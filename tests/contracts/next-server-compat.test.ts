import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Agent, get, type IncomingMessage } from 'node:http';

type Harness = Awaited<
  ReturnType<
    typeof import('../helpers/next-server-compat').startNextCompatibility
  >
>;
let harness: Harness;
const clients: IncomingMessage[] = [];
const agents: Agent[] = [];
async function open(path: string, agent?: Agent) {
  return new Promise<IncomingMessage>((resolve, reject) => {
    const request = get(harness.origin + path, { agent }, resolve);
    request.on('error', reject);
    request.setTimeout(2000, () =>
      request.destroy(new Error('Fixture HTTP timeout')),
    );
  });
}
async function until<T>(
  read: () => Promise<T>,
  predicate: (value: T) => boolean,
  timeout = 8000,
): Promise<T> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const value = await read();
    if (predicate(value)) return value;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(
    'Pinned Next observation did not reach its bounded condition',
  );
}

describe.sequential(
  'pinned production Next custom listener compatibility',
  () => {
    beforeAll(async () => {
      expect(
        existsSync(
          fileURLToPath(
            new URL('../helpers/next-server-compat.ts', import.meta.url),
          ),
        ),
        'real production fixture helper must exist',
      ).toBe(true);
      const { startNextCompatibility } =
        await import('../helpers/next-server-compat');
      harness = await startNextCompatibility();
    }, 120000);
    afterAll(async () => {
      for (const client of clients) client.destroy();
      for (const agent of agents) agent.destroy();
      await harness?.stop();
    }, 10000);

    it('runs actual pinned production routing with request AsyncLocalStorage context', async () => {
      expect(harness.versions).toEqual({
        next: '16.4.0',
        react: '19.3.0',
        reactDom: '19.3.0',
        development: false,
      });
      const response = await open('/api/stream?finite=1');
      clients.push(response);
      expect(response.statusCode).toBe(200);
      expect(response.headers['x-fixture-context']).toMatch(/^request-\d+$/);
      const chunks: Buffer[] = [];
      for await (const chunk of response) chunks.push(Buffer.from(chunk));
      const bytes = Buffer.concat(chunks);
      expect(bytes.length).toBe(4 * 16384);
      for (let index = 0; index < 4; index++)
        expect(bytes.subarray(index * 16384, (index + 1) * 16384)).toEqual(
          Buffer.alloc(16384, index),
        );
      expect((await harness.snapshot()).ready).toBe(true);
    });

    it('stops producer demand on a paused real socket and resumes without dropped bytes', async () => {
      const response = await open('/api/stream');
      clients.push(response);
      response.pause();
      const id = String(response.headers['x-fixture-context']);
      let previous = -1;
      let equal = 0;
      const paused = await until(
        () => harness.snapshot(),
        (state) => {
          const count = state.requests[id]?.pulls ?? 0;
          equal = count === previous ? equal + 1 : 0;
          previous = count;
          return count > 4 && equal >= 8;
        },
      );
      const observation = paused.requests[id];
      console.info('Paused pinned transport:', JSON.stringify(observation));
      expect(observation.finished).toBe(false);
      expect(observation.pulls).toBeLessThan(1024); // <16 MiB includes Node/framework/kernel buffers, distinct from the application queue.
      expect(observation.maxQueuedBytes).toBeLessThanOrEqual(65536 + 16384);
      expect(observation.maxChunkBytes).toBe(16384);
      let received = 0;
      let invalid = false;
      response.on('data', (chunk: Buffer) => {
        for (const byte of chunk) {
          if (byte !== Math.floor(received / 16384) % 256) invalid = true;
          received++;
        }
      });
      response.resume();
      await until(
        () => harness.snapshot(),
        (state) => state.requests[id].pulls > observation.pulls + 16,
      );
      response.pause();
      expect(invalid).toBe(false);
      expect(received).toBeGreaterThan(0);
      response.destroy();
      const cancelled = await until(
        () => harness.snapshot(),
        (state) => state.requests[id].cancelled && state.requests[id].aborted,
      );
      expect(cancelled.requests[id].finished).toBe(false);
    }, 20000);

    it('withdraws readiness synchronously and bounds active, idle keep-alive and framework drain', async () => {
      const agent = new Agent({ keepAlive: true, maxSockets: 1 });
      agents.push(agent);
      const idle = await open('/api/stream?finite=1', agent);
      clients.push(idle);
      await new Promise<void>((resolve, reject) => {
        idle.resume();
        idle.on('end', resolve);
        idle.on('error', reject);
      });
      const idleSocket = Object.values(agent.freeSockets).flat()[0];
      expect(idleSocket).toBeDefined();
      const active = await open('/api/stream');
      clients.push(active);
      active.pause();
      const id = String(active.headers['x-fixture-context']);
      const started = Date.now();
      const draining = await harness.drain();
      expect(draining.ready).toBe(false);
      expect(draining.draining).toBe(true);
      const handlers = draining.handlerCalls;
      await expect(open('/api/stream', agent)).rejects.toThrow();
      await expect(
        open('/api/stream', new Agent({ keepAlive: false })),
      ).rejects.toThrow();
      const stopped = await harness.closed();
      expect(Date.now() - started).toBeLessThan(5000);
      expect(idleSocket?.destroyed).toBe(true);
      expect(stopped.handlerCalls).toBe(handlers);
      expect(stopped.sockets).toBe(0);
      expect(stopped.activeResponses).toBe(0);
      expect(stopped.frameworkClosed).toBe(true);
      expect(stopped.requests[id].cancelled).toBe(true);
      expect(stopped.requests[id].aborted).toBe(true);
      expect(stopped.backgroundTasks).toBe(0);
      console.info('Drained pinned transport:', JSON.stringify(stopped));
      await harness.stop();
      await harness.stop(); // Closed acknowledgement may precede the process exit event.
    }, 10000);
  },
);
