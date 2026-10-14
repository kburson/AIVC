import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { enumerateOwnedFiles } from '../../scripts/format-check.mjs';
it('checks all first-party files including sealed evidence and excludes generated files', () => {
  mkdirSync('.scratch', { recursive: true });
  const root = mkdtempSync(join(process.cwd(), '.scratch/format-'));
  try {
    mkdirSync(join(root, 'apps/web/app'), { recursive: true });
    writeFileSync(join(root, 'apps/web/next-env.d.ts'), 'generated');
    writeFileSync(
      join(root, 'apps/web/app/page.tsx'),
      'export default function Page(){}',
    );
    mkdirSync(join(root, 'docs/peer-reviews/spec/sealed'), { recursive: true });
    writeFileSync(
      join(root, 'docs/peer-reviews/spec/sealed/evidence.json'),
      '{}',
    );
    mkdirSync(join(root, 'apps/web/public/vendor'), { recursive: true });
    writeFileSync(join(root, 'apps/web/public/vendor/asset.js'), 'copied');
    expect(enumerateOwnedFiles(root)).toEqual([
      'apps/web/app/page.tsx',
      'docs/peer-reviews/spec/sealed/evidence.json',
    ]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
it('refuses an empty ownership selection', () => {
  mkdirSync('.scratch', { recursive: true });
  const root = mkdtempSync(join(process.cwd(), '.scratch/format-'));
  try {
    expect(() => enumerateOwnedFiles(root)).toThrow(/owned files/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
