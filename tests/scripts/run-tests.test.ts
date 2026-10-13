import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, expect, it, vi } from 'vitest';
import { runTests } from '../../scripts/run-tests.mjs';

afterEach(() => {
  vi.restoreAllMocks();
});

it('rejects unknown and missing groups instead of reporting empty success', () => {
  const diagnostic = vi.spyOn(console, 'error').mockImplementation(() => {});
  expect(runTests('bogus')).toBe(2);
  expect(diagnostic).toHaveBeenNthCalledWith(1, 'Unknown test group: bogus');
  mkdirSync('.scratch', { recursive: true });
  const root = mkdtempSync(join(process.cwd(), '.scratch/runner-'));
  try {
    expect(runTests('integration', { root })).toBe(1);
    expect(diagnostic).toHaveBeenNthCalledWith(
      2,
      'No delivered tests for group: integration',
    );
    expect(diagnostic).toHaveBeenCalledTimes(2);
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
    const diagnostic = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(runTests(group)).toBe(2);
    expect(diagnostic).toHaveBeenCalledWith('Unknown test group: ' + group);
    expect(diagnostic).toHaveBeenCalledTimes(1);
  },
);
