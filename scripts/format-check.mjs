import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as prettier from 'prettier';
import { verifyEvidenceArchive } from './sealed-evidence.mjs';
import { verifySpecificationCopy } from './verify-docs.mjs';
export { verifyEvidenceArchive } from './sealed-evidence.mjs';

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..');
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
  '.cache',
  '.turbo',
]);
const supported = /\.(?:[cm]?[jt]sx?|jsonc?|css|scss|ya?ml|md|markdown|mdx)$/i;
export function enumerateOwnedFiles(root = workspace) {
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
  let failures = 0;
  for (const path of selected) {
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
