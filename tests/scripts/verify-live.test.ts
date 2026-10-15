import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  mkdirSync,
  existsSync,
  chmodSync,
  renameSync,
  symlinkSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
  unlinkSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { afterEach, afterAll, expect, it } from 'vitest';
import {
  verifyLive,
  acceptanceProvenance,
} from '../../scripts/verify-live.mjs';

const roots: string[] = [];
const patch = 'patches/@ricky0123+vad-web+0.0.31.patch';
const modulePath = 'node_modules/@ricky0123/vad-web/dist/real-time-vad.js';
const revision = 'aivc-vad-lifecycle-v1';
const upstream = 'de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d';
const sha = (bytes: string | Uint8Array) =>
  createHash('sha256').update(bytes).digest('hex');
function put(root: string, path: string, bytes: string | Uint8Array) {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), bytes);
}
function json(root: string, path: string, value: unknown) {
  put(root, path, JSON.stringify(value));
}
function git(root: string, ...args: string[]) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}
function commit(root: string, message: string) {
  git(root, 'add', '.');
  git(
    root,
    '-c',
    'user.name=Evidence fixture',
    '-c',
    'user.email=fixture@example.test',
    'commit',
    '-qm',
    message,
  );
}
function fixture() {
  mkdirSync('.scratch', { recursive: true });
  const root = mkdtempSync(join(process.cwd(), '.scratch/live-verifier-'));
  roots.push(root);
  git(root, 'init', '-q');
  const moduleBytes = `class MicVAD {}\nMicVAD.lifecyclePatchRevision = \"${revision}\";\n`;
  const declarationBytes = 'declare class MicVAD {}\n';
  const blobHash = (bytes: string) =>
    createHash('sha1')
      .update('blob ' + Buffer.byteLength(bytes) + '\0')
      .update(bytes)
      .digest('hex');
  const fixturePatch = ['dist/real-time-vad.js', 'dist/real-time-vad.d.ts']
    .map(
      (file, index) =>
        'diff --git a/node_modules/@ricky0123/vad-web/' +
        file +
        ' b/node_modules/@ricky0123/vad-web/' +
        file +
        '\nindex ' +
        '0'.repeat(40) +
        '..' +
        blobHash(index ? declarationBytes : moduleBytes) +
        ' 100644\n',
    )
    .join('');
  const files = {
    '.gitignore': 'node_modules/\n',
    '.npmrc': 'engine-strict=true\n',
    '.nvmrc': '26.8.1\n',
    'package.json':
      '{"name":"live-fixture","dependencies":{"@ricky0123/vad-web":"0.0.31"}}\n',
    'apps/example.ts': 'export const answer = 1;\n',
    'scripts/runtime.mjs': 'export const version = 1;\n',
    [patch]: fixturePatch,
    'package-lock.json': JSON.stringify({
      packages: {
        'node_modules/@ricky0123/vad-web': {
          version: '0.0.31',
          integrity:
            'sha512-ePVq8TvB21sdHSxVMZOEIf9JVa7MAYpaIaNXeGgsPOiMCN8xbPCdF2LS5aYj7VRR3ZxzutedgV9ZplV65IA1Fg==',
        },
      },
    }),
  };
  for (const [path, bytes] of Object.entries(files)) put(root, path, bytes);
  commit(root, 'Tested source');
  // Independent literal source inventory: adding/removing the wrong class must fail.
  const hash = createHash('sha256');
  for (const path of Object.keys(files).sort())
    hash
      .update(path)
      .update('\0')
      .update(files[path as keyof typeof files])
      .update('\0');
  const sourceDigest = hash.digest('hex');
  put(root, modulePath, moduleBytes);
  put(
    root,
    'node_modules/@ricky0123/vad-web/dist/real-time-vad.d.ts',
    declarationBytes,
  );
  json(root, 'node_modules/@ricky0123/vad-web/package.json', {
    name: '@ricky0123/vad-web',
    version: '0.0.31',
    main: 'dist/index.js',
  });
  const providers = {
    claudeModel: 'claude-sonnet-4-6',
    sttModel: 'nova-3',
    ttsModel: 'aura-2-thalia-en',
  };
  const browser = {
    name: 'Chrome',
    version: '140-unit-fixture',
    os: 'fixture',
  };
  const timing = (scenario: string, sample: number) => ({
    scenario,
    sample,
    vadMs: 800,
    sttMs: 300,
    modelToolMs: 400,
    ttsMs: 250,
    bufferMs: 20,
    speechEndToTextMs: 1500,
    speechEndToAudioMs: 1800,
    callbackToSilenceMs: scenario === 'interruption' ? 30 : null,
    confirmationToCancelMs: scenario === 'interruption' ? 10 : null,
    acousticOnsetToSilenceMs: null,
  });
  const report = {
    schemaVersion: 1,
    gitHead: git(root, 'rev-parse', 'HEAD'),
    sourceDigest,
    mode: 'live',
    nodeVersion: process.version,
    packages: { '.:@ricky0123/vad-web': '0.0.31' },
    providers,
    browser,
    vadPatch: {
      packageVersion: '0.0.31',
      upstreamGitHead: upstream,
      patchPath: patch,
      patchDigest: sha(readFileSync(join(root, patch))),
      modulePath,
      appliedModuleDigest: sha(readFileSync(join(root, modulePath))),
      observedLifecycleRevision: revision,
      buildId: 'observed-production-fixture',
      buildMode: 'production',
    },
    cases: Array.from({ length: 8 }, (_, n) => ({
      id: `L${n + 1}`,
      status: 'pass',
      observations: 'Unit-test evidence fixture; never application acceptance.',
      artifact: 'docs/evidence/runtime.json' as string | null,
    })),
    timings: [
      timing('Atlas', 1),
      timing('Atlas', 2),
      timing('Atlas', 3),
      timing('research', 1),
      timing('interruption', 1),
    ],
    usage: [{ inputTokens: 20, outputTokens: 30, searchUses: 0 }],
    limitations: ['Acoustic onset was not measured in this unit fixture.'],
  };
  const observation = {
    mode: 'live',
    sourceDigest,
    nodeVersion: process.version,
    providers: { ...providers },
    browser: { ...browser },
    build: { mode: 'production', buildId: 'observed-production-fixture' },
    observedLifecycleRevision: revision,
    measurementMethod: {
      clock: 'browser performance.now()',
      description:
        'Request-correlated browser marks, separate server monotonic durations.',
      acousticReason: 'No acoustic recording in the unit fixture.',
    },
    search: {
      state: 'unavailable',
      reason:
        'Actual model metadata did not advertise search in this unit fixture.',
      lookupWithoutSearch: true,
      conversationWithoutSearch: true,
      citations: [] as string[],
      searchUses: 0,
      omittedToolContinuation: 'unverified',
      pauseObserved: false,
    },
    devices: { headset: 'pass', speakers: 'pass' },
    stt: { status: 'pass', mode: 'batch-wav' },
    tts: { status: 'pass', incremental: true },
    sse: { incremental: true, beforeCompletion: true },
  };
  function save() {
    json(root, 'docs/evidence/live-validation.json', report);
    json(root, 'docs/evidence/runtime.json', observation);
  }
  save();
  return { root, report, observation, save };
}
afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true });
});
function errors(f: ReturnType<typeof fixture>) {
  f.save();
  return verifyLive({ root: f.root, log: () => {} }).errors.join('\n');
}

it('validates a complete explicit unavailable-search alternative without a build directory or writing evidence', () => {
  const f = fixture();
  const before = readFileSync(
    join(f.root, 'docs/evidence/live-validation.json'),
  );
  expect(errors(f)).toBe('');
  expect(
    readFileSync(join(f.root, 'docs/evidence/live-validation.json')),
  ).toEqual(before);
  expect(git(f.root, 'status', '--porcelain')).toBe('?? docs/');
});
it('keeps identical rebuilds and documentation-only descendants valid', () => {
  const f = fixture();
  put(f.root, 'apps/web/.next/BUILD_ID', 'another-random-production-id');
  // Build output is ignored as it is in the real repository.
  put(f.root, '.git/info/exclude', 'apps/web/.next/\n');
  put(f.root, 'docs/notes.md', '# Documentation only\n');
  commit(f.root, 'Documentation only');
  expect(errors(f)).toBe('');
  rmSync(join(f.root, 'apps/web/.next'), { recursive: true });
  expect(errors(f)).toBe('');
});
it.each([
  [
    'schema',
    (f: ReturnType<typeof fixture>) => {
      f.report.schemaVersion = 2;
    },
    /schema/,
  ],
  [
    'mock',
    (f: ReturnType<typeof fixture>) => {
      f.report.mode = 'mock';
    },
    /live mode/,
  ],
  [
    'omitted case',
    (f: ReturnType<typeof fixture>) => {
      f.report.cases.pop();
    },
    /L8/,
  ],
  [
    'failed case',
    (f: ReturnType<typeof fixture>) => {
      f.report.cases[2].status = 'fail';
    },
    /L3/,
  ],
  [
    'unverified case',
    (f: ReturnType<typeof fixture>) => {
      f.report.cases[6].status = 'unverified';
    },
    /L7/,
  ],
  [
    'model binding',
    (f: ReturnType<typeof fixture>) => {
      f.report.providers.claudeModel = 'claude-different';
    },
    /provider/,
  ],
  [
    'browser binding',
    (f: ReturnType<typeof fixture>) => {
      f.report.browser.version = 'another';
    },
    /browser/,
  ],
  [
    'package binding',
    (f: ReturnType<typeof fixture>) => {
      f.report.packages['.:@ricky0123/vad-web'] = '0.0.30';
    },
    /package/,
  ],
  [
    'production ID',
    (f: ReturnType<typeof fixture>) => {
      f.report.vadPatch.buildId = '';
    },
    /build/,
  ],
  [
    'development mode',
    (f: ReturnType<typeof fixture>) => {
      f.report.vadPatch.buildMode = 'development';
    },
    /production/,
  ],
  [
    'marker',
    (f: ReturnType<typeof fixture>) => {
      f.report.vadPatch.observedLifecycleRevision = 'unpatched';
    },
    /marker|revision/,
  ],
  [
    'sample count',
    (f: ReturnType<typeof fixture>) => {
      f.report.timings.splice(2, 1);
    },
    /three|3.*Atlas/,
  ],
  [
    'measurement method',
    (f: ReturnType<typeof fixture>) => {
      f.observation.measurementMethod.description = '';
    },
    /method/,
  ],
  [
    'speaker unresolved',
    (f: ReturnType<typeof fixture>) => {
      f.observation.devices.speakers = 'unverified';
    },
    /speaker/,
  ],
  [
    'unsafe artifact',
    (f: ReturnType<typeof fixture>) => {
      f.report.cases[0].artifact = '../private';
    },
    /artifact/,
  ],
] as const)(
  'rejects %s rather than reusing an apparent pass',
  (_label, mutate, expected) => {
    const f = fixture();
    mutate(f);
    expect(errors(f)).toMatch(expected);
  },
);
it('rejects missing reports and missing patch bytes explicitly', () => {
  const f = fixture();
  unlinkSync(join(f.root, 'docs/evidence/live-validation.json'));
  expect(verifyLive({ root: f.root, log: () => {} }).errors.join('\n')).toMatch(
    /report/,
  );
  f.save();
  unlinkSync(join(f.root, patch));
  expect(verifyLive({ root: f.root, log: () => {} }).errors.join('\n')).toMatch(
    /patch|source/i,
  );
});
it.each(['apps/example.ts', 'scripts/runtime.mjs', '.npmrc', patch])(
  'rejects changed tracked runtime source %s',
  (path) => {
    const f = fixture();
    put(f.root, path, 'changed\n');
    expect(errors(f)).toMatch(/source|patch/i);
  },
);
it('rejects changed installed bytes and an unpatched module even with a matching recomputed module digest', () => {
  const f = fixture();
  put(f.root, modulePath, 'class MicVAD {}\n');
  expect(errors(f)).toMatch(/module|marker/i);
  f.report.vadPatch.appliedModuleDigest = sha(
    readFileSync(join(f.root, modulePath)),
  );
  expect(errors(f)).toMatch(/marker|revision/i);
});
it('rejects an unrelated tested head and a stale source commit even if current digest is copied', () => {
  const f = fixture();
  f.report.gitHead = 'a'.repeat(40);
  expect(errors(f)).toMatch(/ancestor|head/i);
  f.report.gitHead = git(f.root, 'rev-parse', 'HEAD');
  put(f.root, 'apps/example.ts', 'export const answer = 2;\n');
  commit(f.root, 'Changed source');
  expect(errors(f)).toMatch(/source/);
});
it('requires actual search citations, omitted-tool continuation and pause on the available-search branch', () => {
  const f = fixture();
  f.observation.search = {
    state: 'verified',
    reason: '',
    lookupWithoutSearch: false,
    conversationWithoutSearch: false,
    citations: ['https://example.test/public'],
    searchUses: 2,
    omittedToolContinuation: 'accepted',
    pauseObserved: true,
  };
  expect(errors(f)).toBe('');
  f.observation.search.pauseObserved = false;
  expect(errors(f)).toMatch(/pause/);
  f.observation.search.pauseObserved = true;
  f.observation.search.citations = [];
  expect(errors(f)).toMatch(/citation/);
});
it('requires demonstrated lookup and ordinary conversation for unavailable search', () => {
  const f = fixture();
  f.observation.search.lookupWithoutSearch = false;
  expect(errors(f)).toMatch(/search-off|lookup/);
});
it('accepts optional acoustic timing only with its reason and keeps callback target misses nonpassing', () => {
  const f = fixture();
  expect(errors(f)).toBe('');
  f.observation.measurementMethod.acousticReason = '';
  expect(errors(f)).toMatch(/acoustic/);
  f.observation.measurementMethod.acousticReason = 'Unavailable in fixture';
  f.report.timings.at(-1)!.callbackToSilenceMs = 230;
  expect(errors(f)).toMatch(/200|callback/);
});

it('rejects malformed nested cases and timings with explicit errors rather than throwing', () => {
  const f = fixture();
  json(f.root, 'docs/evidence/live-validation.json', {
    ...f.report,
    cases: [null],
    timings: [null],
  });
  const result = verifyLive({ root: f.root, log: () => {} });
  expect(result.ok).toBe(false);
  expect(result.errors.join('\n')).toMatch(/case|timing/i);
});
it('compares runtime metadata by value independently of JSON property order', () => {
  const f = fixture();
  f.observation.providers = {
    ttsModel: 'aura-2-thalia-en',
    sttModel: 'nova-3',
    claudeModel: 'claude-sonnet-4-6',
  };
  expect(errors(f)).toBe('');
});
it('rejects research rows without actual applicable latency measurements', () => {
  const f = fixture();
  const row = f.report.timings.find(
    (timing) => timing.scenario === 'research',
  )!;
  for (const key of Object.keys(row))
    if (key.endsWith('Ms'))
      (row as unknown as Record<string, unknown>)[key] = null;
  f.save();
  expect(verifyLive({ root: f.root, log: () => {} }).ok).toBe(false);
});
it('does not count capitalization variants as distinct Atlas trials', () => {
  const f = fixture();
  for (const [index, scenario] of ['Atlas', 'atlas', 'ATLAS'].entries()) {
    f.report.timings[index].scenario = scenario;
    f.report.timings[index].sample = 1;
  }
  f.save();
  expect(verifyLive({ root: f.root, log: () => {} }).ok).toBe(false);
});
it('rejects nonempty provider-named credentials in runtime observations', () => {
  const f = fixture();
  Object.assign(f.observation, {
    DEEPGRAM_API_KEY: '0123456789abcdef0123456789abcdef01234567',
  });
  f.save();
  expect(verifyLive({ root: f.root, log: () => {} }).ok).toBe(false);
});
it('accepts npm package metadata without an invented upstream gitHead field', () => {
  const f = fixture();
  const path = 'node_modules/@ricky0123/vad-web/package.json';
  const metadata = JSON.parse(readFileSync(join(f.root, path), 'utf8'));
  delete metadata.gitHead;
  json(f.root, path, metadata);
  expect(verifyLive({ root: f.root, log: () => {} }).ok).toBe(true);
});
it('records actual dependency versions resolved independently by each workspace', async () => {
  const f = fixture();
  const rootPackage = JSON.parse(
    readFileSync(join(f.root, 'package.json'), 'utf8'),
  );
  rootPackage.workspaces = ['apps/retrieval'];
  json(f.root, 'package.json', rootPackage);
  json(f.root, 'apps/retrieval/package.json', {
    dependencies: { ajv: '8.17.1' },
  });
  json(f.root, 'node_modules/ajv/package.json', {
    name: 'ajv',
    version: '6.15.0',
  });
  json(f.root, 'apps/retrieval/node_modules/ajv/package.json', {
    name: 'ajv',
    version: '8.17.1',
  });
  const { installedPackages } = await import('../../scripts/verify-live.mjs');
  expect(installedPackages(f.root)).toMatchObject({
    'apps/retrieval:ajv': '8.17.1',
  });
});
it('rejects altered installed code despite a retained marker and recomputed report digest', () => {
  const f = fixture();
  put(
    f.root,
    modulePath,
    readFileSync(join(f.root, modulePath), 'utf8') +
      '\n// altered installed code\n',
  );
  f.report.vadPatch.appliedModuleDigest = sha(
    readFileSync(join(f.root, modulePath)),
  );
  f.save();
  expect(verifyLive({ root: f.root, log: () => {} }).ok).toBe(false);
});

it('consumes the fixed reviewed release disposition without relabelling original L4/L6 observations', () => {
  const messages: string[] = [];
  const root = amendedFixture();
  const before = readFileSync(join(root, 'docs/evidence/live-validation.json'));
  const result = verifyLive({ root, log: (message) => messages.push(message) });
  expect(result.errors).toEqual([]);
  expect(messages.join('\n')).toContain(
    'Amended release acceptance with explicit limitations',
  );
  expect(messages.join('\n')).not.toContain('Live evidence is complete');
  expect(
    readFileSync(join(root, 'docs/evidence/live-validation.json')),
  ).toEqual(before);
  const report = JSON.parse(before.toString());
  expect(
    report.cases.find((item: { id: string }) => item.id === 'L4').status,
  ).toBe('fail');
  expect(
    report.cases.find((item: { id: string }) => item.id === 'L6').status,
  ).toBe('unverified');
});

// Real shared Git history and actual captured evidence; no invented accepted authority.
let amendmentRoot: string | undefined;
function amendedFixture() {
  if (!amendmentRoot) {
    amendmentRoot = mkdtempSync(join(process.cwd(), '.scratch/amended-live-'));
    execFileSync('git', [
      'clone',
      '--shared',
      '--no-checkout',
      '--quiet',
      process.cwd(),
      amendmentRoot,
    ]);
  }
  const root = amendmentRoot;
  rmSync(join(root, 'docs/implementation'), { recursive: true, force: true });
  git(root, 'reset', '--hard', 'c529123d95e782acd962aa8276cd635616d59db9');
  git(root, 'clean', '-fd');
  for (const path of [
    'scripts/verify-live.mjs',
    'scripts/format-check.mjs',
    'scripts/lint-markdown.mjs',
    'tests/scripts/verify-live.test.ts',
    'tests/scripts/format-check.test.ts',
    'tests/scripts/quality-scans.test.ts',
    'docs/evidence/11-live-acceptance-disposition.json',
    'docs/implementation/11-system-acceptance.md',
    'docs/live-validation.md',
    'README.md',
  ])
    put(root, path, readFileSync(path));
  const finalReview = 'docs/evidence/11-astra-amended-pr-review.txt';
  if (existsSync(finalReview))
    put(root, finalReview, readFileSync(finalReview));
  const packages = JSON.parse(
    readFileSync('docs/evidence/live-validation.json', 'utf8'),
  ).packages;
  for (const [key, version] of Object.entries(packages)) {
    const [context, name] = key.split(':');
    json(
      root,
      (context === '.' ? '' : context + '/') +
        'node_modules/' +
        name +
        '/package.json',
      { name, version, main: 'index.js' },
    );
  }
  json(root, 'node_modules/@ricky0123/vad-web/package.json', {
    name: '@ricky0123/vad-web',
    version: '0.0.31',
    main: 'dist/index.js',
  });
  for (const suffix of ['js', 'd.ts']) {
    const path = 'node_modules/@ricky0123/vad-web/dist/real-time-vad.' + suffix;
    put(root, path, readFileSync(path));
  }
  return root;
}
afterAll(() => {
  if (amendmentRoot) rmSync(amendmentRoot, { recursive: true, force: true });
});
function amendErrors(root: string) {
  return verifyLive({ root, log: () => {} }).errors.join('\n');
}
it('keeps the qualified profile and original observed failures separate in a fresh checkout without .next', () => {
  const root = amendedFixture();
  expect(amendErrors(root)).toBe('');
});
type AmendmentRecord = {
  policy: string;
  authority: { reviewStorageCommit: string };
  currentSourceDigest: string;
  changedFiles: unknown[];
  runtimeProfile: { speechCharsPerSecond: number };
  observations: { L4: string; pauseObserved: boolean };
};
for (const [name, mutate] of [
  [
    'arbitrary policy',
    (d: AmendmentRecord) => {
      d.policy = 'self-accepted';
    },
  ],
  [
    'self-asserted authority',
    (d: AmendmentRecord) => {
      d.authority.reviewStorageCommit = '0'.repeat(40);
    },
  ],
  [
    'forged current source digest',
    (d: AmendmentRecord) => {
      d.currentSourceDigest = 'a'.repeat(64);
    },
  ],
  [
    'caller path exception',
    (d: AmendmentRecord) => {
      d.changedFiles.push({ path: 'apps/web/server/config.ts', after: {} });
    },
  ],
  [
    'different runtime profile',
    (d: AmendmentRecord) => {
      d.runtimeProfile.speechCharsPerSecond = 14;
    },
  ],
  [
    'fabricated observed pass',
    (d: AmendmentRecord) => {
      d.observations.L4 = 'pass';
    },
  ],
  [
    'fabricated pause',
    (d: AmendmentRecord) => {
      d.observations.pauseObserved = true;
    },
  ],
] as const)
  it('rejects disposition ' + name, () => {
    const root = amendedFixture();
    const path = 'docs/evidence/11-live-acceptance-disposition.json';
    const d = JSON.parse(readFileSync(join(root, path), 'utf8'));
    mutate(d);
    json(root, path, d);
    expect(amendErrors(root)).toContain('Amended acceptance invalid');
  });
for (const path of [
  'apps/web/server/providers/claude.ts',
  'apps/web/server/turns/run-turn.ts',
  'apps/web/shared/contracts.ts',
  'apps/web/server/config.ts',
  'package-lock.json',
  patch,
  'docs/evidence/11-native-search-ordered-385d11b.json',
  'docs/evidence/11-live-physical-2687b54.json',
  'docs/superpowers/specs/2026-10-15-11-live-acceptance-amendment-design.md',
  'docs/superpowers/specs/2026-10-15-11-sealed-review-formatting-addendum.md',
  'docs/evidence/11-astra-full-pr-review-f2baab7.txt',
  'docs/superpowers/specs/2026-10-15-11-sealed-review-lint-addendum.md',
  'docs/evidence/11-astra-sealed-lint-assessment.txt',
])
  it('rejects changed immutable component or collateral ' + path, () => {
    const root = amendedFixture();
    put(root, path, readFileSync(join(root, path), 'utf8') + '\nChanged\n');
    expect(amendErrors(root)).toContain('Amended acceptance invalid');
  });
it('does not accept an untracked application file or a deleted original runtime path', () => {
  const root = amendedFixture();
  put(root, 'apps/web/new.ts', 'export const hidden = 1;');
  expect(amendErrors(root)).toContain('Amended acceptance invalid');
  unlinkSync(join(root, 'apps/web/new.ts'));
  unlinkSync(join(root, 'apps/web/server/config.ts'));
  expect(amendErrors(root)).toContain('Amended acceptance invalid');
}, 15000);
it('still rejects changed installed code after the exact accepted source disposition', () => {
  const root = amendedFixture();
  put(
    root,
    modulePath,
    readFileSync(join(root, modulePath), 'utf8') + '\n// changed',
  );
  expect(amendErrors(root)).toMatch(/module|postimage/);
});
it('refuses original observation changes to cases, timings, citations or credentials rather than masking their failures', () => {
  for (const mutate of [
    (r: ReturnType<typeof fixture>['report']) => {
      r.cases[0].status = 'fail';
    },
    (r: ReturnType<typeof fixture>['report']) => {
      r.timings = [];
    },
    (r: ReturnType<typeof fixture>['report']) => {
      r.providers.claudeModel = 'different';
    },
    (r: ReturnType<typeof fixture>['report']) => {
      r.usage = [{ inputTokens: 20, outputTokens: 30, searchUses: 99 }];
    },
  ]) {
    const root = amendedFixture();
    const path = 'docs/evidence/live-validation.json';
    const r = JSON.parse(readFileSync(join(root, path), 'utf8'));
    mutate(r);
    json(root, path, r);
    expect(amendErrors(root)).toContain('Accepted immutable anchor differs');
  }
}, 20000);
it('fails missing disposition under original strict acceptance rather than treating absence as approval', () => {
  const root = amendedFixture();
  unlinkSync(join(root, 'docs/evidence/11-live-acceptance-disposition.json'));
  expect(amendErrors(root)).toContain('Incomplete required live case L4: fail');
  expect(amendErrors(root)).toContain(
    'Incomplete required live case L6: unverified',
  );
});

it('does not apply the fixed disposition to a caller-selected report even in an allowed documentation path', () => {
  const root = amendedFixture();
  put(
    root,
    'README.md',
    readFileSync(join(root, 'docs/evidence/live-validation.json')),
  );
  json(
    root,
    'docs/evidence/11-live-acceptance-disposition.json',
    acceptanceProvenance(root),
  );
  expect(
    verifyLive({ root, reportPath: 'README.md', log: () => {} }).errors.join(
      '\n',
    ),
  ).toContain('requires the fixed observed report path');
}, 15000);

it('rejects a committed protected change even after the working file is restored', () => {
  const root = amendedFixture();
  const path = 'apps/web/server/config.ts';
  const original = readFileSync(join(root, path));
  put(
    root,
    path,
    Buffer.concat([original, Buffer.from('\n// committed product change\n')]),
  );
  commit(root, 'Protected candidate change');
  put(root, path, original);
  expect(() => acceptanceProvenance(root)).toThrow(/candidate HEAD/i);
}, 15000);
it('rejects a committed runtime addition removed from both index and working tree', () => {
  const root = amendedFixture();
  const path = 'apps/web/server/hidden-runtime.ts';
  put(root, path, 'export const hidden=true;\n');
  commit(root, 'Hidden committed runtime');
  git(root, 'rm', '--cached', path);
  unlinkSync(join(root, path));
  expect(() => acceptanceProvenance(root)).toThrow(/candidate HEAD/i);
}, 15000);

it('accepts the actual target merge context in an isolated candidate', () => {
  const root = amendedFixture();
  const target = 'fe2a158c8f717aed43d604c3d7614dc18a3452e1';
  const mergedTree = git(
    root,
    'merge-tree',
    '--write-tree',
    'HEAD',
    target,
  ).split('\n')[0];
  const mergedHead = git(
    root,
    '-c',
    'user.name=Evidence fixture',
    '-c',
    'user.email=fixture@example.test',
    'commit-tree',
    mergedTree,
    '-p',
    'HEAD',
    '-p',
    target,
    '-m',
    'Actual target merge fixture',
  );
  git(root, 'update-ref', 'HEAD', mergedHead);
  git(
    root,
    'checkout',
    mergedHead,
    '--',
    'docs/implementation/2-live-validation-handoff.md',
  );
  expect(() => acceptanceProvenance(root)).not.toThrow();
}, 15000);

const handoff = 'docs/implementation/2-live-validation-handoff.md';
for (const kind of [
  'missing',
  'changed',
  'mode',
  'file alias',
  'parent alias',
] as const)
  it(
    'rejects ' + kind + ' immutable target handoff',
    () => {
      const root = amendedFixture();
      const path = join(root, handoff);
      if (kind === 'missing') unlinkSync(path);
      if (kind === 'changed')
        put(root, handoff, readFileSync(path, 'utf8') + '\nChanged\n');
      if (kind === 'mode') chmodSync(path, 0o755);
      if (kind === 'file alias') {
        renameSync(path, path + '.original');
        symlinkSync(path + '.original', path);
      }
      if (kind === 'parent alias') {
        const dir = join(root, 'docs/implementation');
        renameSync(dir, dir + '-original');
        symlinkSync(dir + '-original', dir);
      }
      expect(() => acceptanceProvenance(root)).toThrow();
    },
    15000,
  );
it('pins target collateral in candidate HEAD even when working bytes are restored', () => {
  const root = amendedFixture();
  const original = readFileSync(join(root, handoff));
  put(root, handoff, Buffer.concat([original, Buffer.from('\nChanged\n')]));
  commit(root, 'Committed altered handoff');
  put(root, handoff, original);
  expect(() => acceptanceProvenance(root)).toThrow(/candidate HEAD/i);
}, 15000);
it('requires archival ancestry but not target ancestry for the unmerged child', () => {
  const root = amendedFixture();
  expect(() =>
    git(
      root,
      'merge-base',
      '--is-ancestor',
      'fe2a158c8f717aed43d604c3d7614dc18a3452e1',
      'HEAD',
    ),
  ).toThrow();
  expect(() => acceptanceProvenance(root)).not.toThrow();
  git(root, 'update-ref', 'HEAD', '63fdb6911a87d2978551e0a86c7387a53cfc0461');
  expect(() => acceptanceProvenance(root)).toThrow(/c529123/);
}, 15000);
it('refuses a different trusted-target storage blob despite correct working and archive bytes', () => {
  const root = amendedFixture();
  const target = 'fe2a158c8f717aed43d604c3d7614dc18a3452e1';
  git(
    root,
    'update-ref',
    'refs/replace/' + target,
    '63fdb6911a87d2978551e0a86c7387a53cfc0461',
  );
  try {
    expect(() => acceptanceProvenance(root)).toThrow(/Target handoff storage/);
  } finally {
    git(root, 'replace', '-d', target);
  }
}, 15000);
it('rejects an unrelated addition in an actual target merge tree even if absent from working files', () => {
  const root = amendedFixture();
  const target = 'fe2a158c8f717aed43d604c3d7614dc18a3452e1';
  const mergedTree = git(
    root,
    'merge-tree',
    '--write-tree',
    'HEAD',
    target,
  ).split('\n')[0];
  const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], {
    cwd: root,
    input: '# Unrelated target fixture\n',
    encoding: 'utf8',
  }).trim();
  const badTree = execFileSync('git', ['mktree'], {
    cwd: root,
    input:
      git(root, 'ls-tree', mergedTree) +
      '\n100644 blob ' +
      blob +
      '\tunrelated-target.md\n',
    encoding: 'utf8',
  }).trim();
  const head = git(
    root,
    '-c',
    'user.name=Evidence fixture',
    '-c',
    'user.email=fixture@example.test',
    'commit-tree',
    badTree,
    '-p',
    'HEAD',
    '-p',
    target,
    '-m',
    'Unrelated target addition fixture',
  );
  git(root, 'update-ref', 'HEAD', head);
  expect(() => acceptanceProvenance(root)).toThrow(
    /candidate HEAD.*unrelated-target/,
  );
}, 15000);
it('validates genuine pre-archive provenance without manufacturing a final-review file', () => {
  const root = amendedFixture();
  const path = 'docs/evidence/11-astra-amended-pr-review.txt';
  if (existsSync(join(root, path))) unlinkSync(join(root, path));
  json(
    root,
    'docs/evidence/11-live-acceptance-disposition.json',
    acceptanceProvenance(root),
  );
  expect(amendErrors(root)).toBe('');
  expect(existsSync(join(root, path))).toBe(false);
}, 15000);
it('retains authentic native bytes for post-archive fixture provenance', () => {
  const root = amendedFixture();
  const path = 'docs/evidence/11-astra-amended-pr-review.txt';
  // If final review is not archived yet, use genuine existing assessment bytes
  // ONLY as copied test-fixture content, never a production final-review placeholder.
  const native = readFileSync(
    existsSync(path)
      ? path
      : 'docs/evidence/11-astra-target-collateral-assessment.txt',
  );
  put(root, path, native);
  json(
    root,
    'docs/evidence/11-live-acceptance-disposition.json',
    acceptanceProvenance(root),
  );
  expect(amendErrors(root)).toBe('');
  expect(readFileSync(join(root, path))).toEqual(native);
}, 15000);
