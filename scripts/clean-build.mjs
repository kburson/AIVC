import { spawnSync } from 'node:child_process';
import { rmSync, realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..');
/** @param {{root?: string, spawnChild?: (command: string, args: string[], options: {cwd: string, stdio: 'inherit'}) => {status: number | null}}} [options] */
export function cleanBuild({ root = workspace, spawnChild = spawnSync } = {}) {
  for (const path of [
    'apps/web/.next',
    'apps/retrieval/dist',
    'apps/orchestrator/dist',
  ])
    rmSync(join(root, path), { recursive: true, force: true });
  const npmCli =
    process.env.npm_execpath ??
    realpathSync(join(dirname(process.execPath), 'npm'));
  const result = spawnChild(process.execPath, [npmCli, 'run', 'build'], {
    cwd: root,
    stdio: 'inherit',
  });
  return result.status ?? 1;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  process.exitCode = cleanBuild();
