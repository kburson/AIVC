import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checks = [
  [
    'JavaScript/TypeScript lint',
    'node_modules/eslint/bin/eslint.js',
    '.',
    '--no-warn-ignored',
    '--max-warnings=0',
  ],
  ['Markdown lint', 'scripts/lint-markdown.mjs'],
  ['Prettier', 'scripts/format-check.mjs'],
];
let status = 0;
for (const [name, command, ...args] of checks) {
  console.log(`Running ${name}.`);
  const result = spawnSync(process.execPath, [join(root, command), ...args], {
    cwd: root,
    stdio: 'inherit',
  });
  const code = result.status ?? 2;
  if (result.error) console.error(result.error.message);
  console.log(`${name}: exit ${code}.`);
  status = Math.max(status, code);
}
process.exitCode = status;
