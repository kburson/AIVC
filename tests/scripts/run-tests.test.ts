import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
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

it('honors serial options in the real unit runner without hiding or filtering either unit directory', () => {
  const root = mkdtempSync(join(process.cwd(), '.scratch/serial-unit-'));
  try {
    for (const directory of ['ui', 'scripts']) {
      mkdirSync(join(root, 'tests', directory), { recursive: true });
      writeFileSync(
        join(root, 'tests', directory, 'exclusive.test.ts'),
        `
import { it } from 'vitest';
import { mkdirSync, rmSync } from 'node:fs';
import { setTimeout } from 'node:timers/promises';
it('owns the single serial execution slot', async () => {
  const lock = new URL('../../exclusive', import.meta.url);
  mkdirSync(lock);
  try { await setTimeout(100); } finally { rmSync(lock, { recursive: true }); }
});
`,
      );
    }
    const report = join(root, 'report.json');
    expect(
      runTests('unit', {
        root,
        vitestArgs: [
          '--no-file-parallelism',
          '--maxWorkers=1',
          '--reporter=json',
          '--outputFile=' + report,
        ],
        spawnChild: (command, args, options) =>
          spawnSync(command, args, { ...options, timeout: 15000 }),
      }),
    ).toBe(0);
    expect(
      existsSync(report),
      'the real Vitest process must receive forwarded CLI options',
    ).toBe(true);
    const result = JSON.parse(readFileSync(report, 'utf8'));
    expect(result.numTotalTests).toBe(2);
    expect(result.numPassedTests).toBe(2);
    expect(result.success).toBe(true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}, 25000);
