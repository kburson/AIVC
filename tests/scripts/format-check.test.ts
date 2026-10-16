import {
  mkdirSync,
  mkdtempSync,
  writeFileSync,
  rmSync,
  readFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { afterAll, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { symlinkSync, renameSync, chmodSync } from 'node:fs';
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

it('keeps the exact accepted amendment pair in inventory without normalizing sealed bytes', async () => {
  const { checkFormatting } = await import('../../scripts/format-check.mjs');
  const paths = ['review-manifest.md', 'reviewer-response-1.md'].map(
    (name) =>
      'docs/peer-reviews/spec/live-acceptance-amendment-review-d37abf9831b9cc30583d0df9ef47d2f9/spr/' +
      name,
  );
  const before = paths.map((path) => readFileSync(path));
  expect(enumerateOwnedFiles()).toEqual(expect.arrayContaining(paths));
  expect(await checkFormatting({ paths, log: () => {} })).toBe(0);
  paths.forEach((path, index) =>
    expect(readFileSync(path)).toEqual(before[index]),
  );
  await expect(
    checkFormatting({ paths: [paths[0]], write: true, log: () => {} }),
  ).rejects.toThrow(/Refusing/);
}, 15000);

let sealedRoot: string | undefined;
const sealedGroup =
  'docs/peer-reviews/spec/live-acceptance-amendment-review-d37abf9831b9cc30583d0df9ef47d2f9/spr/';
const manifestPath = sealedGroup + 'review-manifest.md';
function sealedFixture() {
  if (!sealedRoot) {
    sealedRoot = mkdtempSync(join(process.cwd(), '.scratch/sealed-format-'));
    execFileSync('git', [
      'clone',
      '--shared',
      '--quiet',
      process.cwd(),
      sealedRoot,
    ]);
  }
  rmSync(join(sealedRoot, sealedGroup.slice(0, -1)), {
    recursive: true,
    force: true,
  });
  execFileSync(
    'git',
    ['reset', '--hard', 'fc51a548e73dc74bb14cfb9805eb381182fb8ad8'],
    { cwd: sealedRoot },
  );
  execFileSync('git', ['clean', '-fd'], { cwd: sealedRoot });
  return sealedRoot;
}
afterAll(() => {
  if (sealedRoot) rmSync(sealedRoot, { recursive: true, force: true });
});
it('validates exact pair before traversal even when both files or their directory disappear', () => {
  const root = sealedFixture();
  rmSync(join(root, sealedGroup), { recursive: true });
  expect(() => enumerateOwnedFiles(root)).toThrow();
});
for (const kind of [
  'bytes',
  'mode',
  'file symlink',
  'parent symlink',
  'unaccepted manifest',
] as const)
  it('rejects sealed ' + kind + ' before exclusion', () => {
    const root = sealedFixture();
    const path = join(root, manifestPath);
    if (kind === 'bytes')
      writeFileSync(path, readFileSync(path, 'utf8') + '\n');
    if (kind === 'mode') chmodSync(path, 0o755);
    if (kind === 'file symlink') {
      renameSync(path, path + '.original');
      symlinkSync(path + '.original', path);
    }
    if (kind === 'parent symlink') {
      const dir = join(root, sealedGroup.slice(0, -1));
      renameSync(dir, dir + '-original');
      symlinkSync(dir + '-original', dir);
    }
    if (kind === 'unaccepted manifest')
      writeFileSync(
        path,
        readFileSync(path, 'utf8').replace(
          '"status": "accepted"',
          '"status": "rejected"',
        ),
      );
    expect(() => enumerateOwnedFiles(root)).toThrow();
  });
it('requires the real storage ancestry and committed blob rather than only copied bytes', async () => {
  const root = sealedFixture();
  execFileSync(
    'git',
    [
      'update-ref',
      'refs/replace/71fc7115200bd94e7872c3e2f5dc3e15fd10bbce',
      '385d11b2448dac5bf01400bb7c11834bfefbfbfd',
    ],
    { cwd: root },
  );
  try {
    expect(() => enumerateOwnedFiles(root)).toThrow();
  } finally {
    execFileSync(
      'git',
      ['replace', '-d', '71fc7115200bd94e7872c3e2f5dc3e15fd10bbce'],
      { cwd: root },
    );
  }
});
it('does not exempt copied lookalikes or startup/invitation or ordinary malformed source', async () => {
  const { checkFormatting } = await import('../../scripts/format-check.mjs');
  const root = sealedFixture();
  writeFileSync(
    join(root, 'copied-review.md'),
    readFileSync(join(root, manifestPath)),
  );
  expect(
    await checkFormatting({ root, paths: ['copied-review.md'], log: () => {} }),
  ).toBe(1);
  for (const name of ['author-startup.md', 'reviewer-invitation.md']) {
    const path = sealedGroup + name;
    writeFileSync(join(root, path), '# Heading\n\n\nParagraph\n');
    expect(await checkFormatting({ root, paths: [path], log: () => {} })).toBe(
      1,
    );
  }
  writeFileSync(join(root, 'bad.ts'), 'const x={a:1}');
  expect(
    await checkFormatting({ root, paths: ['bad.ts'], log: () => {} }),
  ).toBe(1);
});
