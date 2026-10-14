import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from 'markdownlint-cli2/markdownlint/promise';
import parseConfig from 'markdownlint-cli2/parsers/jsonc';
import { enumerateOwnedFiles } from './format-check.mjs';

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export async function lintMarkdown({
  root = workspace,
  log = console.log,
} = {}) {
  root = resolve(root);
  const paths = enumerateOwnedFiles(root).filter((path) =>
    /\.(?:md|markdown)$/i.test(path),
  );
  if (!paths.length) throw Error('No first-party Markdown files found');
  const settings = parseConfig(
    readFileSync(join(workspace, '.markdownlint-cli2.jsonc'), 'utf8'),
  );
  if (
    settings.fix !== false ||
    !settings.config ||
    settings.config.default !== true
  ) {
    throw Error('Markdown scans require the strict root rules and fix:false');
  }
  if (
    Object.keys(settings).some(
      (key) => !['$schema', 'config', 'fix', 'noInlineConfig'].includes(key),
    )
  ) {
    throw Error(
      'Markdown scan overrides, ignores and custom rules are unsupported',
    );
  }
  log(`markdownlint: scanning ${paths.length} first-party Markdown files.`);
  const strings = Object.fromEntries(
    paths.map((path) => [path, readFileSync(join(root, path), 'utf8')]),
  );
  const results = await lint({
    strings,
    config: settings.config,
    noInlineConfig: true,
  });
  let findings = 0;
  let affected = 0;
  for (const path of paths) {
    const errors = results[path];
    if (!Array.isArray(errors))
      throw Error('Markdown scan did not return a result for ' + path);
    if (errors.length) affected++;
    for (const error of errors) {
      const column = error.errorRange?.[0] ?? 1;
      log(
        `${path}:${error.lineNumber}:${column} ${error.ruleNames[0]} ${error.ruleDescription}${error.errorDetail ? ' [' + error.errorDetail + ']' : ''}`,
      );
      findings++;
    }
  }
  log(`Summary: ${findings} issues in ${affected} files`);
  return findings ? 1 : 0;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    if (process.argv.length !== 2)
      throw Error('Markdown scans accept no overrides or fix flags');
    process.exitCode = await lintMarkdown();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
