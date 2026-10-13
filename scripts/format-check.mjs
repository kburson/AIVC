import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function enumerateOwnedFiles(root = workspace) {
  const files = [];
  const visit = (relative) => {
    const absolute = join(root, relative);
    if (!existsSync(absolute)) return;
    for (const entry of readdirSync(absolute, { withFileTypes: true })) {
      if (['node_modules', '.next', 'dist', 'public'].includes(entry.name))
        continue;
      const path = relative + '/' + entry.name;
      if (entry.isDirectory()) visit(path);
      else if (
        /\.(?:[cm]?[jt]sx?|json|css|md)$/.test(entry.name) &&
        !entry.name.endsWith('.tsbuildinfo') &&
        entry.name !== 'next-env.d.ts'
      )
        files.push(path);
    }
  };
  for (const path of ['apps', 'tests', 'scripts']) visit(path);
  for (const path of [
    'package.json',
    'tsconfig.base.json',
    'vitest.config.ts',
    'eslint.config.mjs',
    'playwright.config.ts',
    '.github/workflows/ci.yml',
    '.prettierrc.json',
    'README.md',
    'docs/architecture.md',
    'docs/tutorial.md',
    'docs/live-validation.md',
    'docs/evidence/live-validation.json',
  ])
    if (existsSync(join(root, path))) files.push(path);
  if (!files.length) throw Error('No owned files exist for formatting');
  return files.sort();
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const r = spawnSync(
      process.execPath,
      [
        join(workspace, 'node_modules/prettier/bin/prettier.cjs'),
        '--check',
        ...enumerateOwnedFiles(),
      ],
      { cwd: workspace, stdio: 'inherit' },
    );
    process.exitCode = r.status ?? 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
