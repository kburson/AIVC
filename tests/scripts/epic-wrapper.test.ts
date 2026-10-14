import {
  mkdirSync,
  mkdtempSync,
  writeFileSync,
  rmSync,
  readFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { expect, it } from 'vitest';
it('forwards arguments/environment and nonzero exit through the unchanged filesystem wrapper', () => {
  mkdirSync('.scratch', { recursive: true });
  const root = mkdtempSync(join(process.cwd(), '.scratch/wrapper-'));
  try {
    mkdirSync(join(root, 'scripts/task-tracker'), { recursive: true });
    writeFileSync(
      join(root, 'scripts/task-tracker/verify-epic-trail.mjs'),
      readFileSync('scripts/task-tracker/verify-epic-trail.mjs'),
    );
    const pkg = join(
      root,
      'node_modules/@kburson/ai-task-manager/scripts/task-tracker',
    );
    mkdirSync(pkg, { recursive: true });
    writeFileSync(
      join(pkg, 'verify-epic-trail.mjs'),
      'export async function main(args){console.log(JSON.stringify({args,value:process.env.WRAPPER_PROBE}));return 7;}',
    );
    const path = join(root, 'scripts/task-tracker/verify-epic-trail.mjs');
    const result = spawnSync(process.execPath, [path, '2', '--json'], {
      env: { ...process.env, WRAPPER_PROBE: 'forwarded' },
      encoding: 'utf8',
    });
    expect(result.status).toBe(7);
    expect(JSON.parse(result.stdout)).toEqual({
      args: ['2', '--json'],
      value: 'forwarded',
    });
    rmSync(join(root, 'node_modules'), { recursive: true });
    const missing = spawnSync(process.execPath, [path, '2'], {
      encoding: 'utf8',
    });
    expect(missing.status).not.toBe(0);
    expect(missing.stderr).toContain('ERR_MODULE_NOT_FOUND');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
