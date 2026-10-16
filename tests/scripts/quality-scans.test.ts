import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { afterEach, afterAll, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { renameSync, symlinkSync } from 'node:fs';
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

it('preserves the exact accepted native pair as integrity exclusions rather than Markdownlint passes', async () => {
  const { lintMarkdown } = await import('../../scripts/lint-markdown.mjs');
  const paths = ['review-manifest.md', 'reviewer-response-1.md'].map(
    (name) =>
      'docs/peer-reviews/spec/live-acceptance-amendment-review-d37abf9831b9cc30583d0df9ef47d2f9/spr/' +
      name,
  );
  const before = paths.map((path) => readFileSync(path));
  const messages: string[] = [];
  expect(await lintMarkdown({ log: (message) => messages.push(message) })).toBe(
    0,
  );
  for (const [index, path] of paths.entries()) {
    expect(readFileSync(path)).toEqual(before[index]);
    expect(messages.join('\n')).toContain(
      'Integrity-verified immutable evidence (not linted): ' + path,
    );
  }
  expect(messages.join('\n')).toMatch(/2 integrity-verified exclusions/);
}, 15000);

const lintGroup =
  'docs/peer-reviews/spec/live-acceptance-amendment-review-d37abf9831b9cc30583d0df9ef47d2f9/spr';
let lintRoot: string | undefined;
function anchoredLintFixture() {
  if (!lintRoot) {
    lintRoot = mkdtempSync(join(process.cwd(), '.scratch/anchored-lint-'));
    execFileSync('git', [
      'clone',
      '--shared',
      '--quiet',
      process.cwd(),
      lintRoot,
    ]);
  }
  rmSync(join(lintRoot, lintGroup), { recursive: true, force: true });
  execFileSync(
    'git',
    ['reset', '--hard', '63fdb6911a87d2978551e0a86c7387a53cfc0461'],
    { cwd: lintRoot },
  );
  execFileSync('git', ['clean', '-fd'], { cwd: lintRoot });
  return lintRoot;
}
afterAll(() => {
  if (lintRoot) rmSync(lintRoot, { recursive: true, force: true });
});
for (const kind of [
  'corrupt',
  'missing',
  'file alias',
  'parent alias',
  'lineage',
] as const)
  it(
    'propagates ' + kind + ' sealed integrity failure before lint exclusion',
    async () => {
      const { lintMarkdown } = await import('../../scripts/lint-markdown.mjs');
      const root = anchoredLintFixture();
      const path = join(root, lintGroup, 'reviewer-response-1.md');
      if (kind === 'corrupt')
        writeFileSync(path, readFileSync(path, 'utf8') + '\n');
      if (kind === 'missing') rmSync(path);
      if (kind === 'file alias') {
        renameSync(path, path + '.original');
        symlinkSync(path + '.original', path);
      }
      if (kind === 'parent alias') {
        const dir = join(root, lintGroup);
        renameSync(dir, dir + '-original');
        symlinkSync(dir + '-original', dir);
      }
      if (kind === 'lineage')
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
        await expect(lintMarkdown({ root, log: () => {} })).rejects.toThrow();
      } finally {
        if (kind === 'lineage')
          execFileSync(
            'git',
            ['replace', '-d', '71fc7115200bd94e7872c3e2f5dc3e15fd10bbce'],
            { cwd: root },
          );
      }
    },
  );
it('still lints copied native response, exact startup/invitation and unrelated Markdown', async () => {
  const { lintMarkdown } = await import('../../scripts/lint-markdown.mjs');
  const root = anchoredLintFixture();
  writeFileSync(
    join(root, 'copied-native.md'),
    readFileSync(join(root, lintGroup, 'reviewer-response-1.md')),
  );
  const messages: string[] = [];
  expect(await lintMarkdown({ root, log: (m) => messages.push(m) })).toBe(1);
  expect(messages.join('\n')).toContain('copied-native.md');
  rmSync(join(root, 'copied-native.md'));
  for (const name of ['author-startup.md', 'reviewer-invitation.md']) {
    const path = join(root, lintGroup, name);
    const original = readFileSync(path);
    writeFileSync(path, '#Title\n');
    expect(await lintMarkdown({ root, log: () => {} })).toBe(1);
    writeFileSync(path, original);
  }
  writeFileSync(
    join(root, 'ordinary.md'),
    '<!-- markdownlint-disable -->\n\n#Title\n',
  );
  expect(await lintMarkdown({ root, log: () => {} })).toBe(1);
}, 15000);
