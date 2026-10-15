import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
  unlinkSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { verifyDocs } from '../../scripts/verify-docs.mjs';
const roots: string[] = [];
const workspace = process.cwd();
const workflow = `name: Fixture\non: [pull_request]\nenv:\n  AIVC_MODE: mock\n  PLAYWRIGHT_LAST_RUN_OUTPUT_FILE: .tmp/playwright-last-run.json\njobs:\n  offline:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@pinned\n      - uses: actions/setup-node@pinned\n        with:\n          node-version-file: .nvmrc\n      - run: npm install --global npm@12.0.2\n      - run: node --version\n      - run: npm --version\n      - run: node scripts/verify-toolchain.mjs\n      - run: npm ci\n      - run: npx --no-install playwright install --with-deps chromium\n      - run: npm run assets:vad\n      - run: npm test\n      - run: npm run test:contracts\n      - run: npm run test:integration\n      - run: npm run test:voice\n      - run: npm run test:slow\n      - run: npm run test:browser\n      - run: npm run typecheck\n      - run: npm run build\n      - run: npm run lint\n      - run: npm run format:check\n      - run: npm run verify:docs\n`;
function put(root: string, path: string, bytes: string | Uint8Array) {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), bytes);
}
function fixture() {
  mkdirSync('.scratch', { recursive: true });
  const root = mkdtempSync(join(workspace, '.scratch/docs-verifier-'));
  roots.push(root);
  const copied = new Set<string>();
  function copy(path: string) {
    if (copied.has(path)) return;
    copied.add(path);
    const source = join(workspace, path);
    if (!existsSync(source)) return;
    const bytes = readFileSync(source);
    put(root, path, bytes);
    if (/\.md$/.test(path)) {
      for (const match of bytes.toString().matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
        const link = match[1].split('#')[0];
        if (!link || /^(?:https?:|mailto:)/.test(link)) continue;
        const local = relative(
          workspace,
          resolve(dirname(source), decodeURIComponent(link)),
        );
        if (!local.startsWith('..')) copy(local);
      }
    }
  }
  for (const path of [
    'README.md',
    'docs/architecture.md',
    'docs/tutorial.md',
    'docs/live-validation.md',
    'docs/evidence/live-validation.json',
    'package.json',
    'apps/web/package.json',
    'apps/retrieval/package.json',
    'apps/web/.env.example',
    'apps/web/server/build-info.ts',
    'apps/retrieval/src/index.ts',
    '.nvmrc',
    'scripts/dev.mjs',
    'scripts/run-tests.mjs',
    'scripts/format-check.mjs',
    'scripts/verify-toolchain.mjs',
    'scripts/clean-build.mjs',
    'scripts/copy-vad-assets.mjs',
    'scripts/verify-live.mjs',
    'scripts/verify-docs.mjs',
  ])
    copy(path);
  put(
    root,
    'docs/specification.md',
    execFileSync('git', [
      'show',
      'bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac:docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md',
    ]),
  );
  put(root, '.github/workflows/ci.yml', workflow);
  return root;
}
afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true });
});
function errors(root: string) {
  return verifyDocs({ root, log: () => {} }).errors.join('\n');
}
function edit(
  root: string,
  path: string,
  transform: (value: string) => string,
) {
  put(root, path, transform(readFileSync(join(root, path), 'utf8')));
}
it('validates real code links, exact spec, complete setup and CI without changing document bytes', () => {
  const root = fixture();
  const before = readFileSync(join(root, 'README.md'));
  expect(errors(root)).toBe('');
  expect(readFileSync(join(root, 'README.md'))).toEqual(before);
});
it('rejects missing final documents and missing immutable transfer copy', () => {
  const root = fixture();
  unlinkSync(join(root, 'docs/specification.md'));
  expect(errors(root)).toMatch(/specification/);
  unlinkSync(join(root, 'docs/tutorial.md'));
  expect(errors(root)).toMatch(/tutorial/);
});
it('rejects altered specification bytes even if the prose is otherwise readable', () => {
  const root = fixture();
  edit(root, 'docs/specification.md', (value) => value + '\nChanged\n');
  expect(errors(root)).toMatch(/specification.*(?:hash|bytes)/i);
});
it('rejects nonexistent tutorial source links', () => {
  const root = fixture();
  edit(
    root,
    'docs/tutorial.md',
    (value) => value + '\n[Wrong source](../apps/web/no-such-source.ts)\n',
  );
  expect(errors(root)).toMatch(/link.*no-such-source/);
});
it('rejects credential-looking literal examples and nonempty example provider keys', () => {
  const root = fixture();
  edit(
    root,
    'README.md',
    (value) => value + '\nsk-ant-unit-fixture-secret-not-a-real-key\n',
  );
  expect(errors(root)).toMatch(/credential/i);
  edit(root, 'apps/web/.env.example', (value) =>
    value.replace(
      'DEEPGRAM_API_KEY=',
      'DEEPGRAM_API_KEY=unit-fixture-credential',
    ),
  );
  expect(errors(root)).toMatch(/provider key|credential/);
});
it('rejects a documented script that package.json no longer declares', () => {
  const root = fixture();
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  delete pkg.scripts['assets:vad'];
  put(root, 'package.json', JSON.stringify(pkg));
  expect(errors(root)).toMatch(/script.*assets:vad/);
});
it('rejects browser checks before Chromium and Linux dependency installation', () => {
  const root = fixture();
  edit(
    root,
    '.github/workflows/ci.yml',
    (value) =>
      value.replace(
        '      - run: npx --no-install playwright install --with-deps chromium\n',
        '',
      ) +
      '      - run: npx --no-install playwright install --with-deps chromium\n',
  );
  expect(errors(root)).toMatch(/Chromium|playwright.*before|browser.*install/i);
});
it('rejects npm ci before exact npm and toolchain assertions', () => {
  const root = fixture();
  edit(
    root,
    '.github/workflows/ci.yml',
    (value) =>
      value.replace('      - run: node scripts/verify-toolchain.mjs\n', '') +
      '      - run: node scripts/verify-toolchain.mjs\n',
  );
  expect(errors(root)).toMatch(/toolchain.*before|ordering/);
});
it('rejects a missing tutorial subject without enforcing a word count', () => {
  const root = fixture();
  edit(root, 'docs/tutorial.md', (value) =>
    value.replace(
      '## Deepgram synthesis and PCM scheduling',
      '## Another subject',
    ),
  );
  expect(errors(root)).toMatch(/tutorial.*Deepgram|tutorial.*speech/i);
});
it('rejects documented runtime ports and production build source that no longer match', () => {
  const root = fixture();
  edit(root, 'apps/web/package.json', (value) =>
    value.replace('--port 3000', '--port 4000'),
  );
  expect(errors(root)).toMatch(/port|3000/);
  unlinkSync(join(root, 'apps/web/server/build-info.ts'));
  expect(errors(root)).toMatch(/build-info|build.*source/i);
});
