import { execFileSync } from 'node:child_process';
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { afterAll, expect, it } from 'vitest';
import * as formatting from '../../scripts/format-check.mjs';

const paths = [
  'docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md',
  'docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-review-manifest.md',
  'docs/peer-reviews/plan/stateless-service-migration-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-review-3f99142a6b19c9dcbe0e6e53c7b1354a-review-manifest.md',
];
let fixtureRoot: string | undefined;
function fixture() {
  if (!fixtureRoot) {
    mkdirSync('.scratch/test', { recursive: true });
    fixtureRoot = mkdtempSync(
      join(process.cwd(), '.scratch/test/migration-format-'),
    );
    execFileSync('git', [
      'clone',
      '--shared',
      '--quiet',
      process.cwd(),
      fixtureRoot,
    ]);
  }
  execFileSync(
    'git',
    ['reset', '--hard', '2da3ec5995237cc6a61e3494a056492e32146b1d'],
    { cwd: fixtureRoot },
  );
  execFileSync('git', ['clean', '-fd'], { cwd: fixtureRoot });
  return fixtureRoot;
}
afterAll(() => {
  if (fixtureRoot) rmSync(fixtureRoot, { recursive: true, force: true });
});

it('keeps all three immutable #40 files byte-exact and distinguishes integrity exclusion from a Prettier pass', async () => {
  const before = paths.map((path) => readFileSync(path));
  const messages: string[] = [];
  expect(
    await formatting.checkFormatting({
      paths,
      log: (message: string) => messages.push(message),
    }),
  ).toBe(0);
  for (const [index, path] of paths.entries()) {
    expect(readFileSync(path)).toEqual(before[index]);
    expect(messages).toContain(
      'Integrity-verified immutable evidence: ' + path,
    );
  }
  expect(formatting.enumerateOwnedFiles()).toEqual(
    expect.arrayContaining(paths),
  );
  await expect(
    formatting.checkFormatting({ paths, write: true, log: () => {} }),
  ).rejects.toThrow(/Refusing/);
}, 15000);

it.each(paths)(
  'refuses changed immutable bytes before excluding %s',
  async (path) => {
    const root = fixture();
    writeFileSync(
      join(root, path),
      Buffer.concat([readFileSync(join(root, path)), Buffer.from('\n')]),
    );
    await expect(
      formatting.checkFormatting({ root, paths: ['README.md'], log: () => {} }),
    ).rejects.toThrow();
  },
);

it.each([
  'missing-all',
  'mode',
  'file-alias',
  'parent-alias',
  'storage-replacement',
  'index-drift',
])('fails closed on migration evidence %s before traversal', (kind) => {
  const root = fixture();
  const path = join(root, paths[0]);
  const publication = 'e6e96c9a4f07bb78faa73dc56368a0503d912982';
  try {
    if (kind === 'missing-all')
      for (const name of paths) rmSync(join(root, name));
    if (kind === 'mode') chmodSync(path, 0o755);
    if (kind === 'file-alias') {
      renameSync(path, path + '.original');
      symlinkSync(path + '.original', path);
    }
    if (kind === 'parent-alias') {
      const directory = join(root, 'docs/superpowers/specs');
      renameSync(directory, directory + '-original');
      symlinkSync(directory + '-original', directory);
    }
    if (kind === 'storage-replacement')
      execFileSync(
        'git',
        ['replace', publication, '385d11b2448dac5bf01400bb7c11834bfefbfbfd'],
        { cwd: root },
      );
    if (kind === 'index-drift') {
      const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], {
        cwd: root,
        input: 'changed index bytes\\n',
        encoding: 'utf8',
      }).trim();
      execFileSync(
        'git',
        ['update-index', '--cacheinfo', '100644,' + blob + ',' + paths[0]],
        { cwd: root },
      );
    }
    expect(() => formatting.enumerateOwnedFiles(root)).toThrow();
  } finally {
    if (kind === 'storage-replacement')
      execFileSync('git', ['replace', '-d', publication], { cwd: root });
  }
});

it('still formats copied lookalikes and unrelated malformed source', async () => {
  const root = fixture();
  writeFileSync(
    join(root, 'copied-migration.md'),
    readFileSync(join(root, paths[0])),
  );
  expect(
    await formatting.checkFormatting({
      root,
      paths: ['copied-migration.md'],
      log: () => {},
    }),
  ).toBe(1);
  writeFileSync(join(root, 'ordinary.ts'), 'const value={a:1}');
  expect(
    await formatting.checkFormatting({
      root,
      paths: ['ordinary.ts'],
      log: () => {},
    }),
  ).toBe(1);
});
