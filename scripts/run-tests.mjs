import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const groups = {
  unit: ['tests/ui', 'tests/scripts'],
  contracts: ['tests/contracts'],
  integration: ['tests/integration'],
  voice: ['tests/voice'],
  slow: ['tests/slow'],
};
function containsTests(dir) {
  return (
    existsSync(dir) &&
    readdirSync(dir, { withFileTypes: true }).some((entry) =>
      entry.isDirectory()
        ? containsTests(join(dir, entry.name))
        : /\.test\.[cm]?[jt]sx?$/.test(entry.name),
    )
  );
}
/** @param {string} group
 * @param {{root?: string, vitestArgs?: string[], spawnChild?: (command: string, args: string[], options: {cwd: string, stdio: 'inherit'}) => {status: number | null}}} [options] */
export function runTests(
  group,
  { root = workspace, spawnChild = spawnSync, vitestArgs = [] } = {},
) {
  const paths = Object.hasOwn(groups, group) ? groups[group] : undefined;
  if (!paths) {
    console.error('Unknown test group: ' + group);
    return 2;
  }
  const delivered = paths.filter((p) => containsTests(join(root, p)));
  if (!delivered.length) {
    console.error('No delivered tests for group: ' + group);
    return 1;
  }
  const result = spawnChild(
    process.execPath,
    [
      join(workspace, 'node_modules/vitest/vitest.mjs'),
      'run',
      ...delivered,
      ...vitestArgs,
    ],
    { cwd: root, stdio: 'inherit' },
  );
  return result.status ?? 1;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  process.exitCode = runTests(process.argv[2], {
    vitestArgs: process.argv.slice(3),
  });
