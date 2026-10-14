import {
  mkdirSync,
  mkdtempSync,
  writeFileSync,
  rmSync,
  existsSync,
} from 'node:fs';
import { join } from 'node:path';
import { expect, it, vi } from 'vitest';
import { cleanBuild } from '../../scripts/clean-build.mjs';
it('cleans only application output and preserves the build result', () => {
  mkdirSync('.scratch', { recursive: true });
  const root = mkdtempSync(join(process.cwd(), '.scratch/build-'));
  try {
    for (const dir of ['apps/web/.next', 'apps/retrieval/dist', 'keep']) {
      mkdirSync(join(root, dir), { recursive: true });
      writeFileSync(join(root, dir, 'file'), 'keep');
    }
    const call = vi.fn(() => ({ status: 9 }));
    expect(cleanBuild({ root, spawnChild: call })).toBe(9);
    expect(existsSync(join(root, 'apps/web/.next'))).toBe(false);
    expect(existsSync(join(root, 'apps/retrieval/dist'))).toBe(false);
    expect(existsSync(join(root, 'keep/file'))).toBe(true);
    expect(call).toHaveBeenCalledWith(
      process.execPath,
      [expect.stringMatching(/npm(?:-cli)?\.js$/), 'run', 'build'],
      { cwd: root, stdio: 'inherit' },
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
