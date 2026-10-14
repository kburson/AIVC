import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { enumerateOwnedFiles } from '../../scripts/format-check.mjs';

const roots: string[] = [];
function fixture(files: Record<string, string>) {
  mkdirSync('.scratch', { recursive: true });
  const root = mkdtempSync(join(process.cwd(), '.scratch/quality-'));
  roots.push(root);
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), content);
  }
  return root;
}
afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true });
});

it('discovers review, spec, plan, root and hidden guidance Markdown without altering bytes', () => {
  const files = {
    'docs/peer-reviews/spec/group/xpr/reviewer-response.md':
      '# Review\n\nEvidence.\n',
    'docs/superpowers/specs/design.md': '# Design\n',
    'docs/superpowers/plans/plan.md': '# Plan\n',
    '.agents/skills/local/SKILL.md': '# Guidance\n',
    'extra/nested/collateral.markdown': '# Collateral\n',
    'AGENTS.md': '# Instructions\n',
  };
  const root = fixture(files);
  expect(enumerateOwnedFiles(root)).toEqual(Object.keys(files).sort());
  for (const [file, content] of Object.entries(files)) {
    expect(readFileSync(join(root, file), 'utf8')).toBe(content);
  }
});

it('discovers authored TypeScript at every layer and excludes only generated or external content', () => {
  const authored = [
    'apps/web/components/Client.tsx',
    'apps/web/app/api/turn/route.ts',
    'apps/domain/src/controller.ts',
    'services/anthropic/client.mts',
    'services/deepgram/client.cts',
    'packages/contracts/types.d.ts',
    'tests/contracts/fixture.ts',
    'scripts/types.d.mts',
    'root.config.ts',
    'public/helper.ts',
  ];
  const excluded = [
    'node_modules/example/source.ts',
    'vendors/example/source.ts',
    'apps/web/.next/types/route.ts',
    'apps/domain/dist/index.ts',
    'apps/web/next-env.d.ts',
    'apps/web/public/vendor/lib.ts',
    '.scratch/some/source.ts',
    '.tmp/some/source.ts',
    'coverage/report.ts',
  ];
  const root = fixture(
    Object.fromEntries(
      [...authored, ...excluded].map((file) => [file, 'export {};\n']),
    ),
  );
  expect(enumerateOwnedFiles(root)).toEqual(authored.sort());
});

it('returns failure for protected Markdown formatting findings while leaving bytes unchanged', async () => {
  const { checkFormatting } = await import('../../scripts/format-check.mjs');
  const path = 'docs/peer-reviews/spec/group/xpr/report.md';
  const content = '# Review\n\n-   A badly spaced list\n';
  const root = fixture({ [path]: content });
  expect(await checkFormatting({ root, log: () => {} })).toBe(1);
  expect(readFileSync(join(root, path), 'utf8')).toBe(content);
  await expect(
    checkFormatting({ root, paths: [path], write: true, log: () => {} }),
  ).rejects.toThrow(/protected/);
  expect(readFileSync(join(root, path), 'utf8')).toBe(content);
});

it('refuses an unsafe mixed fix before changing any file and permits an explicit ordinary fix', async () => {
  const { checkFormatting } = await import('../../scripts/format-check.mjs');
  const root = fixture({
    'notes.md': '# Notes\n\n-   Spacing\n',
    'docs/superpowers/plans/accepted.md': '# Plan\n\n-   Spacing\n',
  });
  const before = readFileSync(join(root, 'notes.md'), 'utf8');
  await expect(
    checkFormatting({
      root,
      paths: ['notes.md', 'docs/superpowers/plans/accepted.md'],
      write: true,
    }),
  ).rejects.toThrow(/protected/);
  expect(readFileSync(join(root, 'notes.md'), 'utf8')).toBe(before);
  await expect(
    checkFormatting({ root, paths: ['../outside.md'], write: true }),
  ).rejects.toThrow(/inventory/);
  expect(
    await checkFormatting({
      root,
      paths: ['notes.md'],
      write: true,
      log: () => {},
    }),
  ).toBe(0);
  expect(
    await checkFormatting({ root, paths: ['notes.md'], log: () => {} }),
  ).toBe(0);
});

it('markdownlint detects malformed review headings and passes valid Markdown', async () => {
  const { lintMarkdown } = await import('../../scripts/lint-markdown.mjs');
  const path = 'docs/peer-reviews/spec/group/spr/report.md';
  const root = fixture({ [path]: '#Title\n\n### Skipped heading\n' });
  const before = readFileSync(join(root, path), 'utf8');
  expect(await lintMarkdown({ root, log: () => {} })).toBe(1);
  expect(readFileSync(join(root, path), 'utf8')).toBe(before);
  writeFileSync(join(root, path), '# Title\n\n## Heading\n\nContent.\n');
  expect(await lintMarkdown({ root, log: () => {} })).toBe(0);
});

it('ESLint rejects unused TypeScript across client, BFF, domain, integrations, packages and root files', async () => {
  const { ESLint } = await import('eslint');
  const paths = [
    'apps/web/components/Bad.tsx',
    'apps/web/app/api/turn/route.ts',
    'apps/domain/src/controller.ts',
    'services/anthropic/client.mts',
    'services/deepgram/client.cts',
    'packages/shared/index.ts',
    'tests/somewhere/source.ts',
    'scripts/helper.ts',
    'root.config.ts',
  ];
  const root = fixture(
    Object.fromEntries(
      paths.map((path) => [path, 'const unused = 1;\nexport {};\n']),
    ),
  );
  const eslint = new ESLint({
    cwd: root,
    overrideConfigFile: join(process.cwd(), 'eslint.config.mjs'),
  });
  const results = await eslint.lintFiles(paths);
  expect(results).toHaveLength(paths.length);
  for (const result of results) {
    expect(
      result.messages.some(
        (message) => message.ruleId === '@typescript-eslint/no-unused-vars',
      ),
    ).toBe(true);
  }
});

it('refuses nested Markdown config attempts to fix or hide violating sealed documents', async () => {
  const { lintMarkdown } = await import('../../scripts/lint-markdown.mjs');
  const path = 'docs/peer-reviews/spec/group/spr/report.md';
  const config = 'docs/peer-reviews/spec/group/spr/.markdownlint-cli2.jsonc';
  for (const options of [{ fix: true }, { ignores: ['*.md'] }]) {
    const root = fixture({
      [path]: '#Title\n',
      [config]: JSON.stringify(options),
    });
    const before = readFileSync(join(root, path), 'utf8');
    expect(await lintMarkdown({ root, log: () => {} })).toBe(1);
    expect(readFileSync(join(root, path), 'utf8')).toBe(before);
  }
});

it('scans literal Markdown filenames and refuses inline rule suppression', async () => {
  const { lintMarkdown } = await import('../../scripts/lint-markdown.mjs');
  for (const path of [
    '#review.md',
    '!review.md',
    '[review].md',
    'docs/report.md',
  ]) {
    const root = fixture({
      [path]: '<!-- markdownlint-disable -->\n\n#Title\n',
    });
    const before = readFileSync(join(root, path), 'utf8');
    expect(await lintMarkdown({ root, log: () => {} })).toBe(1);
    expect(readFileSync(join(root, path), 'utf8')).toBe(before);
  }
});

it('ESLint rejects undefined JavaScript names across authored service and tooling files', async () => {
  const { ESLint } = await import('eslint');
  const paths = [
    'services/provider/client.js',
    'packages/shared/index.mjs',
    'scripts/helper.cjs',
    'tests/fixture.js',
    'root.config.js',
  ];
  const root = fixture(
    Object.fromEntries(
      paths.map((path) => [path, 'console.log(missingValue);\n']),
    ),
  );
  const eslint = new ESLint({
    cwd: root,
    overrideConfigFile: join(process.cwd(), 'eslint.config.mjs'),
  });
  for (const result of await eslint.lintFiles(paths)) {
    expect(
      result.messages.some((message) => message.ruleId === 'no-undef'),
    ).toBe(true);
  }
  for (const path of paths)
    writeFileSync(join(root, path), 'console.log(process.version);\n');
  for (const result of await eslint.lintFiles(paths))
    expect(result.errorCount).toBe(0);
});
