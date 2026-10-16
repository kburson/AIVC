import { EventEmitter } from 'node:events';
import { spawn, type ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import { expect, it } from 'vitest';
import { launch } from '../../scripts/dev.mjs';
it('waits for two real signaled children including a delayed exit', async () => {
  const children: ChildProcess[] = [];
  const signals = new EventEmitter();
  const spawnChild: typeof spawn = (() => {
    const delay = children.length === 0 ? 0 : 150;
    const child = spawn(
      process.execPath,
      [
        '-e',
        'process.on("SIGTERM",()=>setTimeout(()=>process.exit(0),' +
          delay +
          '));console.log("ready");setInterval(()=>{},1000);',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    children.push(child);
    return child;
  }) as unknown as typeof spawn;
  const running = launch({ spawnChild, signals });
  try {
    expect(children).toHaveLength(2);
    await Promise.all(children.map((child) => once(child.stdout!, 'data')));
    let finished = false;
    void running.finished.then(() => {
      finished = true;
    });
    const firstExit = once(children[0], 'exit');
    signals.emit('SIGTERM');
    await firstExit;
    expect(finished).toBe(false);
    expect(await running.finished).toBe(143);
    expect(children.map((child) => child.exitCode)).toEqual([0, 0]);
  } finally {
    for (const child of children)
      if (child.exitCode === null) child.kill('SIGKILL');
  }
}, 10000);
