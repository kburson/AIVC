import {
  readdirSync,
  readFileSync,
  writeFileSync,
  lstatSync,
  existsSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as prettier from 'prettier';
import { verifyEvidenceArchive } from './sealed-evidence.mjs';
import { verifySpecificationCopy } from './verify-docs.mjs';
export { verifyEvidenceArchive } from './sealed-evidence.mjs';

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Fixed repository-reviewed preservation policy, not a caller-selectable exemption.
const amendmentGroup =
  'docs/peer-reviews/spec/live-acceptance-amendment-review-d37abf9831b9cc30583d0df9ef47d2f9/spr/';
const amendmentCommit = '71fc7115200bd94e7872c3e2f5dc3e15fd10bbce';
const artifactCommit = '75ffee8031203efec513b589daf74f2f2ab4453d';
const artifactPath =
  'docs/superpowers/specs/2026-10-15-11-live-acceptance-amendment-design.md';
const artifactDigest =
  'sha256:e15e9cbace3029fa11a457383c5c2ed8fd78be27b437ffe0efe39780553cddd5';
const amendmentFiles = [
  [
    'review-manifest.md',
    6528,
    '7e4fbfa61c1ca9845298e994a94ff15810e8d81c83d7f52706a6a72de6e1b716',
  ],
  [
    'reviewer-response-1.md',
    7628,
    'f7ad186c2eeef0f8d7a14f60c5867711989dc3a54c8776b4249a495d1712866c',
  ],
];
function reviewGit(root, args) {
  return execFileSync('git', args, {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}
export function verifyAmendmentReview(root = workspace) {
  reviewGit(root, ['merge-base', '--is-ancestor', amendmentCommit, 'HEAD']);
  const contents = amendmentFiles.map(([name, length, digest]) => {
    const path = amendmentGroup + name;
    let current = root;
    for (const [index, part] of path.split('/').entries()) {
      current = join(current, part);
      const stat = lstatSync(current);
      if (
        stat.isSymbolicLink() ||
        (index === path.split('/').length - 1
          ? !stat.isFile() || (stat.mode & 0o111) !== 0
          : !stat.isDirectory())
      )
        throw Error(
          'Sealed amendment requires regular 100644 files and parents: ' + path,
        );
    }
    const bytes = readFileSync(current);
    const tree = reviewGit(root, [
      'ls-tree',
      amendmentCommit,
      '--',
      path,
    ]).toString();
    const index = reviewGit(root, [
      'ls-files',
      '--stage',
      '--',
      path,
    ]).toString();
    if (
      !tree.startsWith('100644 blob ') ||
      !index.startsWith('100644 ') ||
      bytes.length !== length ||
      createHash('sha256').update(bytes).digest('hex') !== digest ||
      !bytes.equals(reviewGit(root, ['show', amendmentCommit + ':' + path]))
    )
      throw Error('Sealed amendment integrity differs: ' + path);
    return bytes.toString();
  });
  const manifest = JSON.parse(
    contents[0].match(/\x60\x60\x60json\n([\s\S]*?)\n\x60\x60\x60/)[1],
  );
  const id = 'review-d37abf9831b9cc30583d0df9ef47d2f9';
  const artifact = manifest.artifact_history?.[0];
  const response = manifest.turns?.[0];
  if (
    manifest.status !== 'accepted' ||
    manifest.commit_mode !== 'normal' ||
    manifest.authority_assurance !== 'unavailable' ||
    manifest.acceptance_basis !== 'reviewer-consensus' ||
    manifest.review_id !== id ||
    manifest.record_id !== id ||
    manifest.final_commit !== artifactCommit ||
    manifest.artifact_path !== artifactPath ||
    manifest.artifact_history.length !== 1 ||
    artifact.commit !== artifactCommit ||
    artifact.blob !== '6d10c3e71de0f3b95ac616ab3be4609eb3cf6672' ||
    artifact.digest !== artifactDigest ||
    artifact.path !== artifactPath ||
    !manifest.lineage_receipt?.complete ||
    manifest.lineage_receipt.attempts.length !== 1 ||
    manifest.lineage_receipt.attempts[0].review_id !== id ||
    manifest.turns.length !== 1 ||
    response.decision !== 'accepted' ||
    response.turn !== 1 ||
    response.reviewer_response.path !==
      amendmentGroup + 'reviewer-response-1.md' ||
    response.reviewer_response.digest !== 'sha256:' + amendmentFiles[1][2]
  )
    throw Error('Sealed amendment accepted lineage is inconsistent');
  return amendmentFiles.map(([name]) => amendmentGroup + name);
}
function hasAmendmentReview(root) {
  if (root === workspace || existsSync(join(root, amendmentGroup))) return true;
  try {
    if (
      reviewGit(root, ['rev-parse', '--show-toplevel']).toString().trim() !==
      resolve(root)
    )
      return false;
    reviewGit(root, ['cat-file', '-e', amendmentCommit + '^{commit}']);
    return true;
  } catch {
    return false;
  }
}

/** Exact immutable #40 publications; never a caller-supplied ignore list. */
const migrationFiles = [
  {
    path: 'docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md',
    commit: 'e6e96c9a4f07bb78faa73dc56368a0503d912982',
    length: 24964,
    digest: 'f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28',
  },
  {
    path: 'docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-review-manifest.md',
    commit: 'e6e96c9a4f07bb78faa73dc56368a0503d912982',
    length: 8589,
    digest: '12d9c871ceb8e2dcc1c56c3aada872792dde4b814deab601eb77b1c4fb2bc825',
  },
  {
    path: 'docs/peer-reviews/plan/stateless-service-migration-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-review-3f99142a6b19c9dcbe0e6e53c7b1354a-review-manifest.md',
    commit: '80efe1a150dbd8605aab69678c2a7a87f8553072',
    length: 8462,
    digest: '6fac12382121ec1bdf0b652269c24f565e1e3ed16b8dc3dfb530484a5fec079a',
  },
];
function hasMigrationEvidence(root) {
  if (root === workspace) return true;
  try {
    if (
      reviewGit(root, ['rev-parse', '--show-toplevel']).toString().trim() !==
      resolve(root)
    )
      return false;
    reviewGit(root, [
      'merge-base',
      '--is-ancestor',
      '80efe1a150dbd8605aab69678c2a7a87f8553072',
      'HEAD',
    ]);
    return true;
  } catch {
    return false;
  }
}
function verifyMigrationEvidence(root) {
  for (const { path, commit, length, digest } of migrationFiles) {
    reviewGit(root, ['merge-base', '--is-ancestor', commit, 'HEAD']);
    let current = root;
    const parts = path.split('/');
    for (const [index, part] of parts.entries()) {
      current = join(current, part);
      const stat = lstatSync(current);
      if (
        stat.isSymbolicLink() ||
        (index === parts.length - 1
          ? !stat.isFile() || (stat.mode & 0o111) !== 0
          : !stat.isDirectory())
      ) {
        throw Error(
          'Migration evidence requires regular 100644 files and parents: ' +
            path,
        );
      }
    }
    const bytes = readFileSync(current);
    const tree = reviewGit(root, ['ls-tree', commit, '--', path]).toString();
    const index = reviewGit(root, [
      'ls-files',
      '--stage',
      '--',
      path,
    ]).toString();
    const blob = tree.match(/^100644 blob ([a-f0-9]{40})\t/)?.[1];
    if (
      !blob ||
      index !== '100644 ' + blob + ' 0\t' + path + '\n' ||
      bytes.length !== length ||
      createHash('sha256').update(bytes).digest('hex') !== digest ||
      !bytes.equals(reviewGit(root, ['show', commit + ':' + path]))
    ) {
      throw Error('Migration evidence integrity differs: ' + path);
    }
  }
  return migrationFiles.map(({ path }) => path);
}

const excludedDirectories = new Set([
  '.git',
  'node_modules',
  'vendors',
  '.scratch',
  '.tmp',
  '.superpowers',
  '.next',
  'dist',
  'build',
  'coverage',
  'test-results',
  'playwright-report',
  '.cache',
  '.turbo',
]);
const supported = /\.(?:[cm]?[jt]sx?|jsonc?|css|scss|ya?ml|md|markdown|mdx)$/i;
export function enumerateOwnedFiles(root = workspace) {
  if (hasAmendmentReview(root)) verifyAmendmentReview(root);
  if (hasMigrationEvidence(root)) verifyMigrationEvidence(root);
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(join(root, directory), {
      withFileTypes: true,
    })) {
      const path = directory ? directory + '/' + entry.name : entry.name;
      // This exact transfer path is immutable accepted source, not an authored view.
      // Changed bytes or aliases refuse before this single path can be excluded.
      if (path === 'docs/specification.md') {
        verifySpecificationCopy(root);
        continue;
      }
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (
          excludedDirectories.has(entry.name) ||
          path === '.claude/worktrees' ||
          path === 'apps/web/public/vad' ||
          /(?:^|\/)public\/vendor$/.test(path)
        )
          continue;
        visit(path);
      } else if (
        entry.isFile() &&
        supported.test(entry.name) &&
        entry.name !== 'next-env.d.ts' &&
        entry.name !== 'package-lock.json'
      ) {
        files.push(path);
      }
    }
  };
  visit('');
  if (!files.length) throw Error('No owned files exist for formatting');
  return files.sort();
}

export function isProtectedDocument(path) {
  return (
    /^(?:docs\/peer-reviews\/|docs\/superpowers\/(?:specs|plans)\/)/.test(
      path,
    ) || /^docs\/quality-evidence\/.*\.json$/.test(path)
  );
}

/**
 * @param {{ root?: string, paths?: string[], write?: boolean, log?: (message: string) => void }} [options]
 */
export async function checkFormatting({
  root = workspace,
  paths,
  write = false,
  log = console.log,
} = {}) {
  root = resolve(root);
  if (root === workspace) verifyEvidenceArchive({ root });
  const inventory = enumerateOwnedFiles(root);
  const selected = paths?.length
    ? paths.map((path) =>
        relative(root, resolve(root, path)).split('\\').join('/'),
      )
    : inventory;
  if (selected.some((path) => !inventory.includes(path)))
    throw Error('Formatting target is outside the first-party inventory');
  if (write && !paths?.length)
    throw Error('Formatting writes require explicit file paths');
  if (write && selected.some(isProtectedDocument))
    throw Error(
      'Refusing to rewrite protected review/spec/plan evidence; use a governed revision',
    );
  const immutable = hasAmendmentReview(root)
    ? new Set(verifyAmendmentReview(root))
    : new Set();
  if (hasMigrationEvidence(root))
    for (const path of verifyMigrationEvidence(root)) immutable.add(path);
  let failures = 0;
  for (const path of selected) {
    if (immutable.has(path)) {
      log('Integrity-verified immutable evidence: ' + path);
      continue;
    }
    const absolute = join(root, path);
    const input = readFileSync(absolute, 'utf8');
    const config = await prettier.resolveConfig(absolute);
    const options = { ...config, filepath: absolute };
    if (write) writeFileSync(absolute, await prettier.format(input, options));
    else if (!(await prettier.check(input, options))) {
      log('Formatting: ' + path);
      failures++;
    }
  }
  log(`Prettier: ${selected.length} files checked, ${failures} findings.`);
  return failures ? 1 : 0;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const args = process.argv.slice(2);
    const write = args[0] === '--write';
    if (
      args.some((arg, index) => arg.startsWith('--') && !(write && index === 0))
    )
      throw Error('Unknown formatting option');
    process.exitCode = await checkFormatting({
      write,
      paths: write ? args.slice(1) : args,
    });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
