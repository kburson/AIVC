import { spawnSync, type ChildProcess } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { createServer } from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, expect, it } from 'vitest';
import { launch } from '../../scripts/dev.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const origin = 'http://127.0.0.1';
const records = [
  {
    id: 'atlas',
    name: 'Atlas',
    status: 'active',
    ownerTeam: 'North',
    openItems: 3,
    summary: 'Synthetic active project owned by North with three open items.',
  },
  {
    id: 'beacon',
    name: 'Beacon',
    status: 'paused',
    ownerTeam: 'West',
    openItems: 1,
    summary: 'Synthetic paused project owned by West with one open item.',
  },
  {
    id: 'cedar',
    name: 'Cedar',
    status: 'complete',
    ownerTeam: 'South',
    openItems: 0,
    summary: 'Synthetic completed project owned by South with no open items.',
  },
];

async function assertPortAvailable(port: number): Promise<void> {
  await new Promise<void>((accept, reject) => {
    const probe = createServer();
    probe.once('error', (error) =>
      reject(
        new Error(
          'Production integration requires exclusive loopback port ' + port,
          { cause: error },
        ),
      ),
    );
    probe.listen(port, '127.0.0.1', () =>
      probe.close((error) => (error ? reject(error) : accept())),
    );
  });
}

async function bounded<T>(
  promise: Promise<T>,
  milliseconds: number,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error('Production integration deadline exceeded')),
          milliseconds,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function waitUntil(
  check: () => Promise<boolean>,
  label: string,
): Promise<void> {
  const deadline = performance.now() + 10_000;
  while (performance.now() < deadline) {
    if (await check()) return;
    await new Promise((accept) => setTimeout(accept, 50));
  }
  throw new Error(label);
}

beforeAll(() => {
  // The canonical integration lane precedes its declared build VC. Always
  // build the current source so stale local output cannot satisfy this test.
  const build = spawnSync('npm', ['run', 'build'], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  });
  expect(build.status, 'current workspace production build').toBe(0);
}, 90_000);

it('serves the compiled two-process HTTP boundary and awaits signaled shutdown', async () => {
  // Fixed-port application checks are serialized by the owning orchestrator.
  // Refuse occupancy rather than touching another application or changing ports.
  await assertPortAvailable(3000);
  await assertPortAvailable(3001);
  const signals = new EventEmitter();
  const running = launch({ args: ['--production'], root, signals });
  try {
    expect(running.children).toHaveLength(2);
    expect(
      running.children.every((child: ChildProcess) =>
        Number.isInteger(child.pid),
      ),
    ).toBe(true);
    await waitUntil(async () => {
      try {
        const web = await fetch(origin + ':3000', {
          signal: AbortSignal.timeout(1000),
        });
        const data = await fetch(origin + ':3001/health', {
          signal: AbortSignal.timeout(1000),
        });
        await web.text();
        await data.text();
        return web.status === 200 && data.status === 200;
      } catch {
        return false;
      }
    }, 'Production processes did not become ready');

    const page = await fetch(origin + ':3000', {
      signal: AbortSignal.timeout(1000),
    });
    expect(page.status).toBe(200);
    expect(page.headers.get('content-type')).toContain('text/html');
    expect(await page.text()).toMatch(/<html\b/);
    const health = await fetch(origin + ':3001/health', {
      signal: AbortSignal.timeout(1000),
    });
    expect(health.status).toBe(200);
    expect(await health.json()).toEqual({ status: 'ok' });

    const all = await fetch(origin + ':3001/v1/projects', {
      signal: AbortSignal.timeout(1000),
    });
    expect(all.status).toBe(200);
    expect(await all.json()).toEqual({
      schemaVersion: 1,
      source: 'synthetic-project-catalog',
      records,
    });
    const atlas = await fetch(origin + ':3001/v1/projects?name=aTlAs', {
      signal: AbortSignal.timeout(1000),
    });
    expect(atlas.status).toBe(200);
    expect(await atlas.json()).toEqual({
      schemaVersion: 1,
      source: 'synthetic-project-catalog',
      records: [records[0]],
    });
    const prefix = await fetch(origin + ':3001/v1/projects?name=Atl', {
      signal: AbortSignal.timeout(1000),
    });
    expect(await prefix.json()).toEqual({
      schemaVersion: 1,
      source: 'synthetic-project-catalog',
      records: [],
    });
    for (const query of [
      'name=',
      'name=Atlas&name=Beacon',
      'foo=1',
      'name=%E0%A4%A',
    ]) {
      const response = await fetch(origin + ':3001/v1/projects?' + query, {
        signal: AbortSignal.timeout(1000),
      });
      expect(response.status, query).toBe(400);
      await response.text();
    }

    signals.emit('SIGTERM');
    expect(await bounded(running.finished, 10_000)).toBe(143);
    await waitUntil(async () => {
      try {
        await assertPortAvailable(3000);
        await assertPortAvailable(3001);
        return true;
      } catch {
        return false;
      }
    }, 'Owned production ports stayed open after child exits');
  } finally {
    // Cleanup only children created by this test. This is test resource cleanup,
    // not an application shutdown timeout or escalation policy.
    for (const child of running.children as ChildProcess[]) {
      if (child.exitCode === null && child.signalCode === null)
        child.kill('SIGTERM');
    }
    await bounded(running.finished, 10_000);
  }
}, 30_000);
