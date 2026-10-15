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

it('excludes only the verified byte-exact specification transfer copy from authored scans', async () => {
  const { execFileSync } = await import('node:child_process');
  const original = execFileSync('git', [
    'show',
    'bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac:docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md',
  ]);
  const root = mkdtempSync(join(process.cwd(), '.scratch/spec-copy-'));
  try {
    mkdirSync(join(root, 'docs'), { recursive: true });
    writeFileSync(join(root, 'docs/specification.md'), original);
    writeFileSync(join(root, 'docs/ordinary.md'), '# Ordinary\n');
    writeFileSync(join(root, 'docs/specification-other.md'), original);
    expect(enumerateOwnedFiles(root)).toEqual([
      'docs/ordinary.md',
      'docs/specification-other.md',
    ]);
    expect(
      (await import('node:fs')).readFileSync(
        join(root, 'docs/specification.md'),
      ),
    ).toEqual(original);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

it('refuses altered or symlinked specification copies instead of suppressing their findings', async () => {
  const { execFileSync } = await import('node:child_process');
  const { symlinkSync, unlinkSync } = await import('node:fs');
  const original = execFileSync('git', [
    'show',
    'bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac:docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md',
  ]);
  const root = mkdtempSync(join(process.cwd(), '.scratch/spec-copy-'));
  try {
    mkdirSync(join(root, 'docs'), { recursive: true });
    writeFileSync(join(root, 'ordinary.md'), '# Ordinary\n');
    const copy = join(root, 'docs/specification.md');
    writeFileSync(copy, Buffer.concat([original, Buffer.from('\nChanged\n')]));
    expect(() => enumerateOwnedFiles(root)).toThrow(
      /specification.*(?:bytes|hash)/i,
    );
    unlinkSync(copy);
    writeFileSync(join(root, 'original.md'), original);
    symlinkSync(join(root, 'original.md'), copy);
    expect(() => enumerateOwnedFiles(root)).toThrow(
      /specification.*(?:regular|symlink)/i,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
