import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, lstatSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const evidenceArchivePath =
  'docs/quality-evidence/2026-10-13-25-originals.json';
export const originalEvidenceCommit =
  '0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c';
function requireRegularPath(root, path) {
  let current = root;
  const parts = path.split('/');
  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    const stat = lstatSync(current);
    if (stat.isSymbolicLink())
      throw Error('Evidence symlink is forbidden: ' + path);
    if (index < parts.length - 1 ? !stat.isDirectory() : !stat.isFile())
      throw Error('Missing regular evidence view or archive: ' + path);
  }
}
export function verifyEvidenceArchive({
  root = workspace,
  expectedSourceCommit = originalEvidenceCommit,
} = {}) {
  root = resolve(root);
  if (root === workspace && expectedSourceCommit !== originalEvidenceCommit)
    throw Error('Cannot override the required original evidence source commit');
  requireRegularPath(root, evidenceArchivePath);
  const archive = JSON.parse(
    readFileSync(join(root, evidenceArchivePath), 'utf8'),
  );
  if (
    archive.schema !== 'aivc.evidence-originals/v1' ||
    !/^[a-f0-9]{40}$/.test(archive.sourceCommit) ||
    !Array.isArray(archive.documents) ||
    !archive.documents.length
  )
    throw Error('Invalid original-evidence archive');
  if (archive.sourceCommit !== expectedSourceCommit)
    throw Error(
      'Original evidence source commit does not match the required snapshot',
    );
  execFileSync(
    'git',
    ['merge-base', '--is-ancestor', archive.sourceCommit, 'HEAD'],
    { cwd: root, stdio: 'pipe' },
  );
  const expected = new Set(
    execFileSync(
      'git',
      ['ls-tree', '-r', '--name-only', '-z', archive.sourceCommit],
      { cwd: root, encoding: 'utf8' },
    )
      .split('\0')
      .filter((path) =>
        /^(?:docs\/peer-reviews\/|docs\/superpowers\/(?:specs|plans)\/).+\.(?:md|json)$/.test(
          path,
        ),
      ),
  );
  if (
    archive.documents.length !== expected.size ||
    archive.documents.some((document) => !expected.has(document.path))
  )
    throw Error(
      'Original evidence archive corpus is incomplete or contains unexpected paths',
    );
  const seen = new Set();
  for (const document of archive.documents) {
    const path = document.path;
    if (
      typeof path !== 'string' ||
      !/^(?:docs\/peer-reviews\/|docs\/superpowers\/(?:specs|plans)\/).+\.(?:md|json)$/.test(
        path,
      ) ||
      path.split('/').some((part) => !part || part === '.' || part === '..') ||
      path.includes('\\') ||
      seen.has(path)
    ) {
      throw Error('Invalid or duplicate evidence path');
    }
    seen.add(path);
    if (
      typeof document.base64 !== 'string' ||
      typeof document.sha256 !== 'string' ||
      !/^[a-f0-9]{64}$/.test(document.sha256)
    )
      throw Error('Invalid evidence encoding or hash');
    const bytes = Buffer.from(document.base64, 'base64');
    if (
      bytes.toString('base64') !== document.base64 ||
      bytes.length !== document.byteLength ||
      createHash('sha256').update(bytes).digest('hex') !== document.sha256
    )
      throw Error('Original evidence hash or length mismatch: ' + path);
    const original = execFileSync(
      'git',
      ['show', archive.sourceCommit + ':' + path],
      {
        cwd: root,
        maxBuffer: 8 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    if (!bytes.equals(original))
      throw Error(
        'Original evidence differs from historical Git blob: ' + path,
      );
    requireRegularPath(root, path);
  }
  return seen.size;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    console.log(
      `Verified ${verifyEvidenceArchive()} original documents against historical Git blobs.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
