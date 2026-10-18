import { AsyncLocalStorage } from 'node:async_hooks';
import { execFile, fork } from 'node:child_process';
import { createServer, type ServerResponse } from 'node:http';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import type { Socket } from 'node:net';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const root = fileURLToPath(new URL('../../', import.meta.url));
const fixture = resolve(root, 'tests/fixtures/next-server-compat');
const require = createRequire(import.meta.url);
type Observation = {
  pulls: number;
  maxQueuedBytes: number;
  maxChunkBytes: number;
  cancelled: boolean;
  aborted: boolean;
  finished: boolean;
};
export type Snapshot = {
  ready: boolean;
  draining: boolean;
  handlerCalls: number;
  sockets: number;
  activeResponses: number;
  frameworkClosed: boolean;
  backgroundTasks: number;
  requests: Record<string, Observation>;
};
type Message = {
  id?: number;
  event?: string;
  state?: Snapshot;
  origin?: string;
  versions?: {
    next: string;
    react: string;
    reactDom: string;
    development: boolean;
  };
  error?: string;
};

/** Builds real production output and supervises the owned process; never starts dev or providers. */
export async function startNextCompatibility() {
  await promisify(execFile)(
    process.execPath,
    [require.resolve('next/dist/bin/next'), 'build', fixture, '--webpack'],
    {
      cwd: root,
      timeout: 90000,
      maxBuffer: 4 * 1024 * 1024,
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: '1',
        NODE_ENV: 'production',
      },
    },
  );
  const child = fork(fileURLToPath(import.meta.url), ['--serve'], {
    cwd: root,
    execArgv: ['--import', 'tsx'],
    silent: true,
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
      NODE_ENV: 'production',
    },
  });
  let stderr = '';
  child.stdout?.on('data', () => {});
  child.stderr?.on('data', (chunk: Buffer) => {
    stderr = (stderr + chunk.toString()).slice(-8000);
  });
  let sequence = 0;
  let closedAcknowledged = false;
  const pending = new Map<
    number,
    {
      resolve: (message: Message) => void;
      reject: (error: Error) => void;
      timer: NodeJS.Timeout;
    }
  >();
  let resolveReady!: (message: Message) => void;
  let rejectReady!: (error: Error) => void;
  const ready = new Promise<Message>((resolve, reject) => {
    resolveReady = resolve;
    rejectReady = reject;
  });
  let resolveClosed!: (state: Snapshot) => void;
  let rejectClosed!: (error: Error) => void;
  const closed = new Promise<Snapshot>((resolve, reject) => {
    resolveClosed = resolve;
    rejectClosed = reject;
  });
  void closed.catch(() => {});
  child.on('message', (value: Message) => {
    if (value.event === 'ready') resolveReady(value);
    if (value.event === 'closed') {
      closedAcknowledged = true;
      resolveClosed(value.state!);
    }
    if (value.error) {
      const error = new Error(value.error);
      rejectReady(error);
      rejectClosed(error);
    }
    if (value.id !== undefined) {
      const waiter = pending.get(value.id);
      if (waiter) {
        clearTimeout(waiter.timer);
        pending.delete(value.id);
        waiter.resolve(value);
      }
    }
  });
  const exited = new Promise<void>((resolve) =>
    child.once('exit', () => resolve()),
  );
  child.once('exit', (code) => {
    const error = new Error('Next fixture exited ' + code + ': ' + stderr);
    rejectReady(error);
    for (const waiter of pending.values()) {
      clearTimeout(waiter.timer);
      waiter.reject(error);
    }
    pending.clear();
  });
  function request(command: string): Promise<Snapshot> {
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error('Next fixture IPC timeout: ' + command));
      }, 5000);
      pending.set(id, {
        resolve: (message) => resolve(message.state!),
        reject,
        timer,
      });
      child.send({ id, command }, (error) => {
        if (error) {
          clearTimeout(timer);
          pending.delete(id);
          reject(error);
        }
      });
    });
  }
  const bootTimer = setTimeout(() => {
    rejectReady(new Error('Next fixture prepare timeout: ' + stderr));
    child.kill('SIGKILL');
  }, 15000);
  let initial: Message;
  try {
    initial = await ready;
  } catch (error) {
    child.kill('SIGKILL');
    await exited;
    throw error;
  } finally {
    clearTimeout(bootTimer);
  }
  return {
    origin: initial.origin!,
    versions: initial.versions!,
    snapshot: () => request('snapshot'),
    drain: () => request('drain'),
    closed: () => bounded(closed, 5000, 'framework drain'),
    async stop() {
      if (child.exitCode !== null || child.signalCode !== null) return;
      try {
        if (!closedAcknowledged) await request('drain');
        await bounded(closed, 5000, 'fixture cleanup');
        await bounded(exited, 2000, 'fixture process exit');
      } finally {
        if (child.exitCode === null && child.signalCode === null) {
          child.kill('SIGKILL');
          await exited;
        }
      }
    },
  };
}

async function bounded<T>(
  work: Promise<T>,
  milliseconds: number,
  label: string,
): Promise<T> {
  let timer: NodeJS.Timeout;
  try {
    return await Promise.race([
      work,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(label + ' exceeded finite bound')),
          milliseconds,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer!);
  }
}

async function serve() {
  const { default: next } = await import('next');
  const storage = new AsyncLocalStorage<{
    id: string;
    observation: Observation;
  }>();
  (
    globalThis as typeof globalThis & {
      __aivcNextCompatibility?: typeof storage;
    }
  ).__aivcNextCompatibility = storage;
  const sockets = new Set<Socket>();
  const responses = new Set<ServerResponse>();
  const handlers = new Set<Promise<void>>();
  const requests: Record<string, Observation> = {};
  let ready = false;
  let draining = false;
  let frameworkClosed = false;
  let handlerCalls = 0;
  let drainWork: Promise<void> | undefined;
  const server = createServer((request, response) => {
    if (draining || !ready) {
      response.writeHead(503, { connection: 'close' });
      response.end();
      return;
    }
    const id = 'request-' + ++handlerCalls;
    const observation = {
      pulls: 0,
      maxQueuedBytes: 0,
      maxChunkBytes: 0,
      cancelled: false,
      aborted: false,
      finished: false,
    };
    requests[id] = observation;
    responses.add(response);
    response.once('close', () => responses.delete(response));
    const work = storage.run({ id, observation }, () =>
      handle(request, response),
    );
    handlers.add(work);
    void work
      .catch(() => {
        response.destroy();
      })
      .finally(() => handlers.delete(work));
  });
  server.on('connection', (socket) => {
    sockets.add(socket);
    socket.once('close', () => sockets.delete(socket));
  });
  const app = next({
    dev: false,
    dir: fixture,
    hostname: '127.0.0.1',
    httpServer: server,
  });
  const handle = app.getRequestHandler();
  await app.prepare();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  ready = true;
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Fixture did not own TCP listener');
  function snapshot(): Snapshot {
    return {
      ready,
      draining,
      handlerCalls,
      sockets: sockets.size,
      activeResponses: responses.size,
      frameworkClosed,
      backgroundTasks: handlers.size,
      requests,
    };
  }
  function drain() {
    ready = false;
    draining = true;
    drainWork ??= (async () => {
      const closedServer = new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
      server.closeIdleConnections();
      await new Promise((resolve) => setTimeout(resolve, 150));
      for (const socket of sockets) socket.destroy();
      await bounded(closedServer, 1500, 'owned listener close');
      await bounded(
        Promise.allSettled([...handlers]),
        1500,
        'owned request handlers',
      );
      await bounded(app.close(), 1500, 'Next framework close');
      await new Promise((resolve) => setImmediate(resolve));
      frameworkClosed = true;
      process.send?.({ event: 'closed', state: snapshot() });
      process.disconnect?.();
    })();
    void drainWork.catch((error: Error) => {
      process.send?.({ error: error.message });
      process.exitCode = 1;
      process.disconnect?.();
    });
  }
  process.on('message', (message: { id: number; command: string }) => {
    if (message.command === 'drain') drain();
    process.send?.({ id: message.id, state: snapshot() });
  });
  process.send?.({
    event: 'ready',
    origin: 'http://127.0.0.1:' + address.port,
    versions: {
      next: require('next/package.json').version,
      react: require('react/package.json').version,
      reactDom: require('react-dom/package.json').version,
      development: false,
    },
  });
}
if (process.argv[2] === '--serve') {
  void serve().catch((error: Error) => {
    process.send?.({ error: error.message });
    process.exitCode = 1;
    process.disconnect?.();
  });
}
