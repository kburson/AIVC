import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  readFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  renameSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { afterEach, it } from 'node:test';
import assert from 'node:assert/strict';
import * as formatting from '../../scripts/format-check.mjs';

const roots = [];
function fixture() {
  mkdirSync('.scratch', { recursive: true });
  const root = mkdtempSync(join(process.cwd(), '.scratch/evidence-'));
  roots.push(root);
  const path = 'docs/peer-reviews/spec/group/spr/reviewer-response.md';
  const bytes = Buffer.from('# Sealed\r\n\r\nExact original bytes.\r\n');
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), bytes);
  const git = (...args) =>
    execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  git('init');
  git('config', 'user.name', 'Evidence Test');
  git('config', 'user.email', 'evidence-test@example.invalid');
  git('add', '.');
  git('commit', '-m', 'Original evidence');
  const archive = {
    schema: 'aivc.evidence-originals/v1',
    sourceCommit: git('rev-parse', 'HEAD'),
    documents: [
      {
        path,
        sha256: createHash('sha256').update(bytes).digest('hex'),
        byteLength: bytes.length,
        base64: bytes.toString('base64'),
      },
    ],
  };
  mkdirSync(join(root, 'docs/quality-evidence'), { recursive: true });
  const archivePath = 'docs/quality-evidence/2026-10-13-25-originals.json';
  writeFileSync(join(root, archivePath), JSON.stringify(archive));
  writeFileSync(
    join(root, path),
    '# Formatting view\n\nOriginal retained in the archive.\n',
  );
  return {
    root,
    archive,
    archivePath,
    expectedSourceCommit: archive.sourceCommit,
  };
}
afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true });
});

it('verifies the exact sealed bytes against their historical Git blob after the current view changes', () => {
  const { root, expectedSourceCommit } = fixture();
  assert.equal(typeof formatting.verifyEvidenceArchive, 'function');
  assert.equal(
    formatting.verifyEvidenceArchive({ root, expectedSourceCommit }),
    1,
  );
});

it('rejects archive tampering even when its declared hash is recomputed', () => {
  const { root, archive, archivePath, expectedSourceCommit } = fixture();
  const changed = Buffer.from('# Forged evidence\n');
  archive.documents[0].base64 = changed.toString('base64');
  archive.documents[0].byteLength = changed.length;
  archive.documents[0].sha256 = createHash('sha256')
    .update(changed)
    .digest('hex');
  writeFileSync(join(root, archivePath), JSON.stringify(archive));
  assert.throws(
    () => formatting.verifyEvidenceArchive({ root, expectedSourceCommit }),
    /historical Git blob/,
  );
});

it('fails closed on missing originals and unsafe paths', () => {
  const { root, archive, archivePath, expectedSourceCommit } = fixture();
  archive.documents[0].path = '../outside.md';
  writeFileSync(join(root, archivePath), JSON.stringify(archive));
  assert.throws(
    () => formatting.verifyEvidenceArchive({ root, expectedSourceCommit }),
    /path/,
  );
  rmSync(join(root, archivePath));
  assert.throws(() =>
    formatting.verifyEvidenceArchive({ root, expectedSourceCommit }),
  );
});

it('rejects a current view replaced with a symlink', () => {
  const { root, archive, expectedSourceCommit } = fixture();
  const path = join(root, archive.documents[0].path);
  rmSync(path);
  writeFileSync(join(root, 'another.md'), '# Another file\n');
  symlinkSync(join(root, 'another.md'), path);
  assert.throws(
    () => formatting.verifyEvidenceArchive({ root, expectedSourceCommit }),
    /view/,
  );
});

it('rejects an archive that omits an original from the historical corpus', () => {
  const { root, archive, archivePath } = fixture();
  const originalPath = archive.documents[0].path;
  writeFileSync(
    join(root, originalPath),
    Buffer.from(archive.documents[0].base64, 'base64'),
  );
  const secondPath = 'docs/superpowers/plans/accepted.md';
  mkdirSync(dirname(join(root, secondPath)), { recursive: true });
  writeFileSync(join(root, secondPath), '# Another original\n');
  execFileSync('git', ['add', '.'], { cwd: root });
  execFileSync('git', ['commit', '-m', 'Second historical original'], {
    cwd: root,
    stdio: 'ignore',
  });
  archive.sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
  }).trim();
  writeFileSync(join(root, archivePath), JSON.stringify(archive));
  assert.throws(
    () =>
      formatting.verifyEvidenceArchive({
        root,
        expectedSourceCommit: archive.sourceCommit,
      }),
    /corpus/,
  );
});

it('rejects substitution of an older ancestor even when its complete corpus matches Git', () => {
  const { root, archive } = fixture();
  execFileSync('git', ['commit', '--allow-empty', '-m', 'Required snapshot'], {
    cwd: root,
    stdio: 'ignore',
  });
  const expectedSourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
  }).trim();
  assert.notEqual(archive.sourceCommit, expectedSourceCommit);
  assert.throws(
    () => formatting.verifyEvidenceArchive({ root, expectedSourceCommit }),
    /source commit/,
  );
});

it('rejects current views beneath a symlinked ancestor', () => {
  const { root, expectedSourceCommit } = fixture();
  renameSync(join(root, 'docs/peer-reviews'), join(root, 'original-views'));
  symlinkSync(join(root, 'original-views'), join(root, 'docs/peer-reviews'));
  assert.throws(
    () => formatting.verifyEvidenceArchive({ root, expectedSourceCommit }),
    /symlink/,
  );
});

it('rejects archive aliases and symlinked archive ancestors', () => {
  const { root, archivePath, expectedSourceCommit } = fixture();
  renameSync(join(root, archivePath), join(root, 'archive.json'));
  symlinkSync(join(root, 'archive.json'), join(root, archivePath));
  assert.throws(
    () => formatting.verifyEvidenceArchive({ root, expectedSourceCommit }),
    /symlink/,
  );
  rmSync(join(root, archivePath));
  renameSync(
    join(root, 'docs/quality-evidence'),
    join(root, 'archive-directory'),
  );
  symlinkSync(
    join(root, 'archive-directory'),
    join(root, 'docs/quality-evidence'),
  );
  assert.throws(
    () => formatting.verifyEvidenceArchive({ root, expectedSourceCommit }),
    /symlink/,
  );
});

it('excludes generated VAD dependency assets from scans and refuses formatting them', async () => {
  const { root } = fixture();
  const generated = 'apps/web/public/vad/ort/ort-wasm.mjs';
  mkdirSync(dirname(join(root, generated)), { recursive: true });
  writeFileSync(join(root, generated), 'const minified={asset:true};');
  writeFileSync(
    join(root, 'apps/web/public/owned.ts'),
    'export const owned = true;\n',
  );
  const files = formatting.enumerateOwnedFiles(root);
  assert.ok(files.includes('apps/web/public/owned.ts'));
  assert.ok(!files.includes(generated));
  await assert.rejects(
    () => formatting.checkFormatting({ root, paths: [generated], write: true }),
    /inventory/,
  );
});

it('rejects tutorial original tampering even when its declared hash is recomputed', () => {
  const root = mkdtempSync(join(process.cwd(), '.scratch/tutorial-evidence-'));
  roots.push(root);
  execFileSync('git', ['clone', '--shared', '--no-checkout', '.', root], {
    stdio: 'pipe',
  });
  mkdirSync(join(root, 'scripts'), { recursive: true });
  writeFileSync(
    join(root, 'scripts/sealed-evidence.mjs'),
    readFileSync('scripts/sealed-evidence.mjs'),
  );
  const archivePaths = [
    'docs/quality-evidence/2026-10-13-25-originals.json',
    'docs/quality-evidence/2026-10-14-25-integration-originals.json',
    'docs/quality-evidence/2026-10-14-25-tutorial-originals.json',
  ];
  for (const path of archivePaths) {
    const bytes = readFileSync(path);
    const archive = JSON.parse(bytes.toString());
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), bytes);
    for (const document of archive.documents) {
      mkdirSync(dirname(join(root, document.path)), { recursive: true });
      writeFileSync(join(root, document.path), '# Formatting view\n');
    }
  }
  const verify = () =>
    execFileSync(
      process.execPath,
      [join(root, 'scripts/sealed-evidence.mjs')],
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
  assert.match(verify(), new RegExp('Verified 90 original documents'));
  const path = join(root, archivePaths[2]);
  const archive = JSON.parse(readFileSync(path, 'utf8'));
  const forged = Buffer.from('# Forged tutorial review\n');
  archive.documents[0].base64 = forged.toString('base64');
  archive.documents[0].byteLength = forged.length;
  archive.documents[0].sha256 = createHash('sha256')
    .update(forged)
    .digest('hex');
  writeFileSync(path, JSON.stringify(archive));
  assert.throws(verify, new RegExp('historical Git blob'));
});
