import { spawnSync } from 'node:child_process';
import {
  readFileSync,
  mkdirSync,
  mkdtempSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { verifyToolchain } from '../../scripts/verify-toolchain.mjs';
const roots: string[] = [];
function fixture(
  nodePin = '26.8.1',
  manager = 'npm@12.0.2',
  engine = '12.0.2',
) {
  mkdirSync('.scratch', { recursive: true });
  const root = mkdtempSync(join(process.cwd(), '.scratch/toolchain-'));
  roots.push(root);
  writeFileSync(join(root, '.nvmrc'), nodePin + '\n');
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({ packageManager: manager, engines: { npm: engine } }),
  );
  return root;
}
afterEach(() => {
  for (const r of roots.splice(0)) rmSync(r, { recursive: true, force: true });
});
it('accepts the reproducible toolchain', () => {
  expect(
    verifyToolchain({
      root: fixture(),
      nodeVersion: 'v26.8.1',
      npmVersion: '12.0.2',
    }),
  ).toEqual([]);
});
it.each([
  ['v27.0.0', '12.0.2', 'Node'],
  ['v26.8.1', '12.0.3', 'npm'],
])(
  'reports expected and actual version mismatch %s',
  (nodeVersion, npmVersion, label) => {
    const errors = verifyToolchain({
      root: fixture(),
      nodeVersion,
      npmVersion,
    });
    expect(errors.join(' ')).toContain(label);
    expect(errors.join(' ')).toContain(label === 'Node' ? '26.8.1' : '12.0.2');
    expect(errors.join(' ')).toContain(
      label === 'Node' ? nodeVersion : npmVersion,
    );
  },
);
it.each([
  ['latest', 'npm@12.0.2', '12.0.2'],
  ['26.8.1', 'npm@^12.0.2', '12.0.2'],
  ['26.8.1', 'yarn@12.0.2', '12.0.2'],
  ['26.8.1', 'npm@12.0.2', '12.0.1'],
])('rejects malformed or conflicting pins %#', (nodePin, manager, engine) => {
  expect(
    verifyToolchain({
      root: fixture(nodePin, manager, engine),
      nodeVersion: 'v26.8.1',
      npmVersion: '12.0.2',
    }).length,
  ).toBeGreaterThan(0);
});

it('runs before installation with no dependency directory and rejects actual version mismatch', () => {
  const root = fixture();
  mkdirSync(join(root, 'scripts'));
  writeFileSync(
    join(root, 'scripts/verify-toolchain.mjs'),
    readFileSync('scripts/verify-toolchain.mjs'),
  );
  const path = join(root, 'scripts/verify-toolchain.mjs');
  const matching = spawnSync(process.execPath, [path], { encoding: 'utf8' });
  expect(matching.status).toBe(0);
  writeFileSync(join(root, '.nvmrc'), '26.8.2\n');
  const mismatch = spawnSync(process.execPath, [path], { encoding: 'utf8' });
  expect(mismatch.status).toBe(1);
  expect(mismatch.stderr).toContain('expected v26.8.2, actual v26.8.1');
});
