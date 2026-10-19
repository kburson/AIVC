import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const specificationCommit = 'bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac';
export const specificationSource =
  'docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md';
export const specificationHash =
  '8512daa8c456af00628a16471d4b13526c7585172c223c8bfa0f2323bee4fff6';

export function verifySpecificationCopy(root) {
  for (const path of ['docs', 'docs/specification.md']) {
    const stat = lstatSync(join(root, path));
    if (
      stat.isSymbolicLink() ||
      (path === 'docs' ? !stat.isDirectory() : !stat.isFile())
    )
      throw Error('Specification copy must use regular paths, never symlinks');
  }
  const bytes = readFileSync(join(root, 'docs/specification.md'));
  if (createHash('sha256').update(bytes).digest('hex') !== specificationHash)
    throw Error('Specification copy hash differs from accepted bytes');
  const original = execFileSync(
    'git',
    ['show', specificationCommit + ':' + specificationSource],
    {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 1024 * 1024,
    },
  );
  if (!bytes.equals(original))
    throw Error('Specification copy differs from accepted Git bytes');
  return true;
}

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const documents = [
  'README.md',
  'docs/architecture.md',
  'docs/tutorial.md',
  'docs/live-validation.md',
  'docs/specification.md',
];
const requiredScripts = [
  'dev',
  'start',
  'build:clean',
  'test:browser:install',
  'assets:vad',
  'test',
  'test:contracts',
  'test:integration',
  'test:voice',
  'test:slow',
  'test:browser',
  'typecheck',
  'build',
  'lint',
  'format:check',
  'verify:docs',
  'verify:live',
  'verify:toolchain',
];
const offlineCommands = [
  'npm test',
  ...[
    'test:contracts',
    'test:integration',
    'test:voice',
    'test:slow',
    'test:browser',
    'typecheck',
    'build',
    'lint',
    'format:check',
    'verify:docs',
  ].map((name) => 'npm run ' + name),
];
const configuration = [
  'AIVC_MODE',
  'ANTHROPIC_API_KEY',
  'CLAUDE_MODEL',
  'DEEPGRAM_API_KEY',
  'DEEPGRAM_STT_MODEL',
  'DEEPGRAM_TTS_MODEL',
  'RETRIEVAL_BASE_URL',
  'CLAUDE_WEB_SEARCH',
  'CLAUDE_WEB_SEARCH_TOOL_VERSION',
  'BFF_ALLOWED_ORIGINS',
  'BFF_ALLOWED_HOSTS',
  'SPEECH_CHARS_PER_SECOND',
  'TURN_TIMEOUT_MS',
  'RETRIEVAL_TIMEOUT_MS',
  'SPEECH_TIMEOUT_MS',
];
function regularFile(root, path) {
  const local = relative(root, resolve(root, path));
  if (!local || local.startsWith('..') || isAbsolute(local))
    throw Error('Unsafe local file path');
  let current = root;
  const parts = local.split('/');
  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    const stat = lstatSync(current);
    if (
      stat.isSymbolicLink() ||
      (index === parts.length - 1 ? !stat.isFile() : !stat.isDirectory())
    )
      throw Error('Expected regular local file: ' + local);
  }
  return current;
}
export function verifyDocs({ root = workspace, log = console.log } = {}) {
  root = resolve(root);
  const errors = [];
  const require = (condition, message) => {
    if (!condition) errors.push(message);
  };
  const read = (path) => {
    try {
      return readFileSync(regularFile(root, path), 'utf8');
    } catch (error) {
      errors.push('Missing required file ' + path + ': ' + error.message);
      return '';
    }
  };
  const parse = (path) => {
    try {
      return JSON.parse(read(path));
    } catch {
      errors.push('Invalid JSON: ' + path);
      return {};
    }
  };
  const content = Object.fromEntries(
    documents.map((path) => [path, read(path)]),
  );
  read('docs/evidence/live-validation.json');
  try {
    verifySpecificationCopy(root);
  } catch (error) {
    errors.push('Accepted specification verification: ' + error.message);
  }
  for (const [path, value] of Object.entries(content)) {
    require(!/sk-ant-[A-Za-z0-9_-]{12,}|(?:Bearer|Token)\s+[A-Za-z0-9_-]{24,}|(?:ANTHROPIC_API_KEY|DEEPGRAM_API_KEY)\s*=\s*[\x22\x27]?[A-Za-z0-9_-]{8,}/.test(
      value,
    ), 'Credential-looking literal in ' + path);
    for (const match of value.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const href = match[1];
      if (/^https?:\/\//.test(href)) continue;
      if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
        errors.push('Unsafe link in ' + path + ': ' + href);
        continue;
      }
      const [target, fragment] = href.split('#');
      try {
        const destination = target
          ? resolve(root, dirname(path), decodeURIComponent(target))
          : join(root, path);
        regularFile(root, relative(root, destination));
        if (fragment && /\.md$/i.test(destination)) {
          const headings = [
            ...readFileSync(destination, 'utf8').matchAll(/^#{1,6}\s+(.+)$/gm),
          ].map((entry) =>
            entry[1]
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .trim()
              .replace(/\s+/g, '-'),
          );
          require(headings.includes(
            fragment,
          ), 'Missing local link heading in ' + path + ': ' + href);
        }
      } catch {
        errors.push('Missing/unsafe local link in ' + path + ': ' + href);
      }
    }
  }
  const pkg = parse('package.json');
  for (const name of requiredScripts) {
    require(typeof pkg.scripts?.[name] === 'string' &&
      pkg.scripts[name].trim(), 'Missing declared script ' + name);
    const entry = pkg.scripts?.[name]?.match(
      /(?:^|\s)node\s+([^\s]+\.mjs)/,
    )?.[1];
    if (entry) read(entry);
  }
  require(read('.nvmrc').trim() === '26.8.1' &&
    pkg.packageManager === 'npm@12.0.2' &&
    pkg.engines?.node === '>=26' &&
    pkg.devDependencies?.['@types/node'] ===
      '26.6.5', 'Exact Node26/npm/type-package reproduction pins differ');
  const readme = content['README.md'];
  require(readme.includes('server-only') &&
    new RegExp('root.*\\.env.*not automatically loaded', 'is').test(
      readme,
    ), 'README must explain server-only values and root .env loading');
  require(readme.includes('Mock/Contract Simulation') &&
    readme.includes('unverified') &&
    readme
      .toLowerCase()
      .includes(
        'known limits',
      ), 'README must distinguish mode and known unverified limits');
  for (const name of requiredScripts.filter(
    (name) => name !== 'test' && name !== 'verify:toolchain',
  ))
    require(readme.includes(
      name === 'start' ? 'npm start' : 'npm run ' + name,
    ), 'README missing runnable script ' + name);
  for (const command of [
    'nvm use 26.8.1',
    'npm install --global npm@12.0.2',
    'node --version',
    'npm --version',
    'node scripts/verify-toolchain.mjs',
    'npm ci',
  ])
    require(readme.includes(command), 'README missing setup command ' +
      command);
  require(readme.indexOf('node scripts/verify-toolchain.mjs') <
    readme.indexOf('npm ci'), 'README toolchain must run before npm ci');
  require(readme.indexOf('npm run test:browser:install') <
    readme.indexOf(
      '\nnpm run test:browser\n',
    ), 'README browser installation must precede browser checks');
  require(readme.includes(
    'PLAYWRIGHT_LAST_RUN_OUTPUT_FILE=.tmp/playwright-last-run.json',
  ), 'README must preserve generated Playwright last-run output outside authored inventory');
  const example = read('apps/web/.env.example');
  const values = Object.fromEntries(
    [...example.matchAll(/^([A-Z][A-Z0-9_]*)=(.*)$/gm)].map((match) => [
      match[1],
      match[2].trim(),
    ]),
  );
  for (const name of configuration)
    require(Object.hasOwn(values, name), 'Missing sanitized environment key ' +
      name);
  require(values.ANTHROPIC_API_KEY === '' &&
    values.DEEPGRAM_API_KEY ===
      '', 'Example provider key values must be empty; no literal credential examples');
  require(values.AIVC_MODE === 'live' &&
    values.RETRIEVAL_BASE_URL === 'http://127.0.0.1:3001' &&
    values.CLAUDE_WEB_SEARCH_TOOL_VERSION ===
      'web_search_20250305', 'Environment defaults do not match documented runtime/search');
  const web = parse('apps/web/package.json'),
    retrieval = parse('apps/retrieval/package.json');
  require(new RegExp('next start.*--port 3000').test(
    web.scripts?.start ?? '',
  ) &&
    new RegExp('next dev.*--port 3000').test(web.scripts?.dev ?? '') &&
    (retrieval.scripts?.start ?? '').includes('node dist/index.js') &&
    new RegExp('port:\\s*3001').test(read('apps/retrieval/src/index.ts')) &&
    readme.includes('3000') &&
    readme.includes(
      '3001',
    ), 'Documented two-process ports3000/3001 differ from runtime');
  require(pkg.scripts?.start === 'node scripts/dev.mjs --production' &&
    pkg.scripts?.['build:clean'] === 'node scripts/clean-build.mjs' &&
    read('scripts/dev.mjs').includes(
      "['web', 'retrieval']",
    ), 'Production start/build:clean must preserve two application runtimes');
  require(read('apps/orchestrator/src/build-info.ts').includes('BUILD_ID') &&
    content['docs/live-validation.md'].includes('production') &&
    content['docs/live-validation.md'].includes(
      'buildId',
    ), 'Document actual production build-info source and observed buildId');
  const tutorial = content['docs/tutorial.md'];
  for (const [label, heading] of [
    ['React/capture', /^## .*React.*capture/im],
    ['Route events', /^## .*Route.*events/im],
    ['Claude tools', /^## .*Claude.*tool/im],
    ['Fastify HTTP', /^## .*Fastify.*HTTP/im],
    ['Deepgram speech', /^## .*Deepgram.*PCM/im],
    ['cancellation/measurement', /^## .*Cancellation.*measurement/im],
  ])
    require(heading.test(tutorial), 'Missing tutorial subject: ' + label);
  const ci = read('.github/workflows/ci.yml');
  require(new RegExp('AIVC_MODE:\\s*mock').test(ci) &&
    !ci.includes(
      'secrets.',
    ), 'Offline CI must use Mock mode without provider secrets');
  require(new RegExp(
    'PLAYWRIGHT_LAST_RUN_OUTPUT_FILE:\\s*\\.tmp/playwright-last-run\\.json',
  ).test(
    ci,
  ), 'CI must preserve Playwright generated output outside authored inventory');
  for (const command of offlineCommands)
    require(ci.includes(': ' + command + '\n') ||
      ci.includes(
        '\n          ' + command + '\n',
      ), 'CI missing offline command ' + command);
  const jobs = ci.split(/^ {2}[a-zA-Z][\w-]*:\s*$/m).slice(1);
  for (const job of jobs.filter((value) => value.includes('npm ci'))) {
    const install = job.indexOf('npm ci');
    for (const command of [
      'node-version-file: .nvmrc',
      'npm install --global npm@12.0.2',
      'node --version',
      'npm --version',
      'node scripts/verify-toolchain.mjs',
    ])
      require(job.indexOf(command) >= 0 &&
        job.indexOf(command) <
          install, 'CI toolchain ordering must assert exact Node/npm before npm ci: ' +
        command);
    const browser = job.indexOf('npm run test:browser');
    if (browser >= 0)
      require(job.indexOf(
        'npx --no-install playwright install --with-deps chromium',
      ) >= install &&
        job.indexOf(
          'npx --no-install playwright install --with-deps chromium',
        ) <
          browser, 'CI must install Chromium/Linux dependencies before browser checks');
  }
  for (const error of errors) log('Docs: ' + error);
  if (!errors.length)
    log(
      'Documentation, accepted-spec bytes, local links, setup and offline CI verified.',
    );
  return { ok: errors.length === 0, errors };
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  if (process.argv.length !== 2) {
    console.error('verify:docs is read-only and accepts no overrides');
    process.exitCode = 2;
  } else process.exitCode = verifyDocs().ok ? 0 : 1;
}
