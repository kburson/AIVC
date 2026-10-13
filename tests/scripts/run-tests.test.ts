import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it, vi } from 'vitest';
import { runTests } from '../../scripts/run-tests.mjs';
it('rejects unknown and missing groups instead of reporting empty success', () => {
  expect(runTests('bogus')).toBe(2);
  mkdirSync('.scratch', { recursive: true });
  const root = mkdtempSync(join(process.cwd(), '.scratch/runner-'));
  try {
    expect(runTests('integration', { root })).toBe(1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
it('forwards a delivered group through argument-array spawn and preserves failures', () => {
  mkdirSync('.scratch', { recursive: true });
  const root = mkdtempSync(join(process.cwd(), '.scratch/runner-'));
  try {
    mkdirSync(join(root, 'tests/contracts'), { recursive: true });
    writeFileSync(join(root, 'tests/contracts/example.test.ts'), 'test');
    const child = vi.fn(() => ({ status: 7 }));
    expect(runTests('contracts', { root, spawnChild: child })).toBe(7);
    expect(child).toHaveBeenCalledWith(
      process.execPath,
      [expect.stringMatching(/vitest.*vitest.mjs$/), 'run', 'tests/contracts'],
      { cwd: root, stdio: 'inherit' },
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

it.each(['toString', 'constructor', '__proto__'])(
  'rejects inherited object keys as unknown groups: %s',
  (group) => {
    expect(runTests(group)).toBe(2);
  },
);
