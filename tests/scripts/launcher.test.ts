import { EventEmitter } from 'node:events';
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it, vi } from 'vitest';
import { launch } from '../../scripts/dev.mjs';
function boundary() {
  const children = Array.from({ length: 2 }, () =>
    Object.assign(new EventEmitter(), { kill: vi.fn(() => true) }),
  );
  let i = 0;
  const call = vi.fn(() => children[i++] as unknown as ChildProcess);
  return {
    children,
    call,
    spawnChild: call as unknown as typeof spawn,
    signals: new EventEmitter(),
  };
}
it.each([{ args: [] }, { args: ['--production'] }])(
  'launches exactly two workspace processes in mode %j',
  ({ args }) => {
    const b = boundary();
    mkdirSync('.scratch', { recursive: true });
    const root = mkdtempSync(join(process.cwd(), '.scratch/launch-'));
    try {
      if (args.length) {
        mkdirSync(join(root, 'apps/web/.next'), { recursive: true });
        mkdirSync(join(root, 'apps/retrieval/dist'), { recursive: true });
        writeFileSync(join(root, 'apps/web/.next/BUILD_ID'), 'built');
        writeFileSync(join(root, 'apps/retrieval/dist/index.js'), 'built');
      }
      launch({ args, root, ...b });
      expect(b.call).toHaveBeenCalledTimes(2);
      for (const [i, name] of ['web', 'retrieval'].entries()) {
        expect(b.call.mock.calls[i]).toEqual([
          process.execPath,
          args.length
            ? name === 'web'
              ? [
                  join(root, 'node_modules/next/dist/bin/next'),
                  'start',
                  '--hostname',
                  '127.0.0.1',
                  '--port',
                  '3000',
                ]
              : ['dist/index.js']
            : [expect.stringMatching(/npm(?:-cli)?\.js$/), 'run', 'dev'],
          { cwd: join(root, 'apps', name), stdio: 'inherit' },
        ]);
      }
      b.children.forEach((child) => child.emit('exit', 0, null));
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
);
it('rejects flags and missing production output before spawning', () => {
  const b = boundary();
  expect(() => launch({ args: ['--unknown'], ...b })).toThrow(/flag/);
  expect(() =>
    launch({ args: ['--production'], root: '.scratch/absent', ...b }),
  ).toThrow(/build/);
  expect(b.call).not.toHaveBeenCalled();
});
it('forwards SIGINT to both and awaits both exits', async () => {
  const b = boundary();
  const running = launch(b);
  let settled = false;
  void running.finished.then(() => {
    settled = true;
  });
  b.signals.emit('SIGINT');
  expect(b.children.map((c) => c.kill.mock.calls)).toEqual([
    [['SIGINT']],
    [['SIGINT']],
  ]);
  b.children[0].emit('exit', 0, null);
  await Promise.resolve();
  expect(settled).toBe(false);
  b.children[1].emit('exit', 0, null);
  expect(await running.finished).toBe(130);
  expect(b.signals.listenerCount('SIGINT')).toBe(0);
});
it('stops the peer when one child fails and preserves failure', async () => {
  const b = boundary();
  const running = launch(b);
  b.children[0].emit('exit', 7, null);
  expect(b.children[1].kill).toHaveBeenCalledWith('SIGTERM');
  b.children[1].emit('exit', 0, null);
  expect(await running.finished).toBe(7);
});
