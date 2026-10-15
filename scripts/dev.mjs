import { spawn } from 'node:child_process';
import { existsSync, realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const npmCli =
  process.env.npm_execpath ??
  realpathSync(join(dirname(process.execPath), 'npm'));
/** @param {{args?: string[], root?: string, spawnChild?: typeof spawn, signals?: import('node:events').EventEmitter}} [options] */
export function launch({
  args = [],
  root = workspace,
  spawnChild = spawn,
  signals = process,
} = {}) {
  if (args.some((arg) => arg !== '--production') || args.length > 1)
    throw Error('Unknown launcher flag; use only --production');
  const production = args.includes('--production');
  if (
    production &&
    (!existsSync(join(root, 'apps/web/.next/BUILD_ID')) ||
      !existsSync(join(root, 'apps/retrieval/dist/index.js')))
  )
    throw Error(
      'Production build output missing; run npm run build:clean first',
    );
  const children = [];
  const ended = new Set();
  let stopping = false;
  let code = 0;
  let resolveFinished;
  const finished = new Promise((resolve) => {
    resolveFinished = resolve;
  });
  const stop = (signal) => {
    if (stopping) return;
    stopping = true;
    if (code === 0) code = signal === 'SIGINT' ? 130 : 143;
    for (const child of children) if (!ended.has(child)) child.kill(signal);
  };
  const onInt = () => stop('SIGINT');
  const onTerm = () => stop('SIGTERM');
  const finish = () => {
    if (ended.size !== 2) return;
    signals.removeListener('SIGINT', onInt);
    signals.removeListener('SIGTERM', onTerm);
    resolveFinished(code);
  };
  signals.on('SIGINT', onInt);
  signals.on('SIGTERM', onTerm);
  for (const name of ['web', 'retrieval']) {
    // Production owns the server processes themselves. A package-manager shell
    // can exit on a signal before its server descendant releases the port.
    const command = production
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
      : [npmCli, 'run', 'dev'];
    const child = spawnChild(process.execPath, command, {
      cwd: join(root, 'apps', name),
      stdio: 'inherit',
    });
    children.push(child);
    child.once('error', (error) => {
      console.error('Launcher child error: ' + error.message);
      code = 1;
      ended.add(child);
      stop('SIGTERM');
      finish();
    });
    child.once('exit', (status, signal) => {
      ended.add(child);
      if (!stopping) {
        code = status ?? (signal ? 1 : 0);
        stop('SIGTERM');
        if (status === 0 && !signal) code = 0;
      }
      finish();
    });
  }
  return { children, finished };
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const { finished } = launch({ args: process.argv.slice(2) });
    process.exitCode = await finished;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
