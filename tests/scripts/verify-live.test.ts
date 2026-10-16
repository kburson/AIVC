import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  appendFileSync,
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
import { pathToFileURL } from 'node:url';
import { afterEach, afterAll, beforeEach, describe, expect, it } from 'vitest';
import {
  verifyLive,
  acceptanceProvenance,
} from '../../scripts/verify-live.mjs';

const { loadConfig, setConfigValue } = await import(
  pathToFileURL(
    join(
      process.cwd(),
      'node_modules/@kburson/ai-task-manager/scripts/task-tracker/config.mjs',
    ),
  ).href
);
const { createDefaultDeliverDeps } = await import(
  pathToFileURL(
    join(
      process.cwd(),
      'node_modules/@kburson/ai-task-manager/scripts/task-tracker/verbs/deliver.mjs',
    ),
  ).href
);

const roots: string[] = [];
const patch = 'patches/@ricky0123+vad-web+0.0.31.patch';
const modulePath = 'node_modules/@ricky0123/vad-web/dist/real-time-vad.js';
const revision = 'aivc-vad-lifecycle-v1';
const upstream = 'de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d';
const sha = (bytes: string | Uint8Array) =>
  createHash('sha256').update(bytes).digest('hex');
// Preserve genuine case errors when an outer acceptance runner discards stdout.
beforeEach((context) => {
  context.onTestFailed(({ task }) => {
    try {
      mkdirSync('.scratch/gh', { recursive: true });
      appendFileSync(
        '.scratch/gh/54-verify-live-failures.jsonl',
        JSON.stringify({
          recordedAt: new Date().toISOString(),
          testFileSha256: sha(readFileSync(import.meta.filename)),
          caseId: task.id,
          caseName: task.fullName,
          state: task.result?.state,
          hookStates: task.result?.hooks ?? null,
          errors: task.result?.errors?.map(({ name, message, stack }) => ({
            name,
            message,
            stack,
          })),
        }) + '\n',
      );
    } catch {
      // Failure recording must never replace the original test failure.
    }
  });
});
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

describe('reviewed live acceptance real history', () => {
  it('consumes the fixed reviewed release disposition without relabelling original L4/L6 observations', () => {
    const messages: string[] = [];
    const root = amendedFixture();
    const before = readFileSync(
      join(root, 'docs/evidence/live-validation.json'),
    );
    const result = verifyLive({
      root,
      log: (message) => messages.push(message),
    });
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
  const deliveryBaseline = 'b4d5ff903f4965429a27f409cbd2bcac843fb324';
  const deliveryConfig = '.ai-task-manager/task-tracker.json';
  const deliveryPostBlob = '4c117bc9ffdd4cfbbaf2d6fa4ad758c4834affa3';
  const trunkBaseline = '78429753cdeede058b0b279296b77d9f1c2bb246';
  const trunkArchive = '72a937e7147018d02a3552400fa16f8d8c4e33ff';
  const trunkPostBlob = 'fcdfc1f95c17b1e342b01325103274a3991077ea';
  const trunkAnchors = [
    'docs/superpowers/specs/2026-10-15-57-explicit-trunk-target-design.md',
    'docs/superpowers/plans/2026-10-15-57-explicit-trunk-target.md',
    'docs/evidence/57-astra-explicit-trunk-target-assessment.txt',
  ];
  function deliveryFixtureTree() {
    if (!amendmentRoot) {
      amendmentRoot = mkdtempSync(
        join(process.cwd(), '.scratch/amended-live-'),
      );
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
    for (const path of [
      'docs/implementation',
      'docs/superpowers/specs',
      'docs/superpowers/plans',
      'docs/evidence',
      '.ai-task-manager',
    ])
      rmSync(join(root, path), { recursive: true, force: true });
    git(root, 'reset', '--hard', trunkArchive);
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
      const path =
        'node_modules/@ricky0123/vad-web/dist/real-time-vad.' + suffix;
      put(root, path, readFileSync(path));
    }
    expect(git(root, 'hash-object', deliveryConfig)).toBe(deliveryPostBlob);
    setConfigValue('trunkRef', 'origin/trunk', {
      projectPath: join(root, deliveryConfig),
    });
    expect(readFileSync(join(root, deliveryConfig)).length).toBe(2121);
    expect(sha(readFileSync(join(root, deliveryConfig)))).toBe(
      '4b3c919cbae4dc9e6e225965ad420ba80405cb8e86f552bfc53bb06b32b450b9',
    );
    expect(git(root, 'hash-object', deliveryConfig)).toBe(trunkPostBlob);
    commit(root, 'Fixture exact reviewed trunk configuration');
    expect(git(root, 'rev-parse', 'HEAD:' + deliveryConfig)).toBe(
      trunkPostBlob,
    );
    return root;
  }
  let producedRoot: string | undefined;
  let preparedRoot: string | undefined;
  beforeEach(() => {
    producedRoot = undefined;
    preparedRoot = undefined;
    const root = deliveryFixtureTree();
    let baseline!: ReturnType<typeof acceptanceProvenance>;
    expect(() => {
      baseline = acceptanceProvenance(root);
    }).not.toThrow();
    expect(baseline.deliveryConfiguration.after.blob).toBe(deliveryPostBlob);
    json(root, 'docs/evidence/11-live-acceptance-disposition.json', baseline);
    producedRoot = root;
  });
  beforeEach(() => {
    preparedRoot = undefined;
    const root = producedRoot;
    producedRoot = undefined;
    if (!root) throw Error('Real-history producer baseline was not verified');
    expect(amendErrors(root)).toBe('');
    preparedRoot = root;
  });
  function amendedFixture() {
    if (!preparedRoot)
      throw Error('Real-history good baseline was not verified');
    return preparedRoot;
  }
  it('accepts the genuine good trunk candidate before any targeted mutation', () => {
    const root = amendedFixture();
    expect(acceptanceProvenance(root).trunkConfiguration.after.blob).toBe(
      trunkPostBlob,
    );
  }, 15000);
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
    it(
      'rejects disposition ' + name,
      () => {
        const root = amendedFixture();
        const path = 'docs/evidence/11-live-acceptance-disposition.json';
        const d = JSON.parse(readFileSync(join(root, path), 'utf8'));
        mutate(d);
        json(root, path, d);
        expect(amendErrors(root)).toContain('Amended acceptance invalid');
      },
      15000,
    );
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
    it(
      'rejects changed immutable component or collateral ' + path,
      () => {
        const root = amendedFixture();
        put(root, path, readFileSync(join(root, path), 'utf8') + '\nChanged\n');
        expect(amendErrors(root)).toContain('Amended acceptance invalid');
      },
      15000,
    );
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
  for (const [name, mutate] of [
    [
      'cases',
      (r: ReturnType<typeof fixture>['report']) => {
        r.cases[0].status = 'fail';
      },
    ],
    [
      'timings',
      (r: ReturnType<typeof fixture>['report']) => {
        r.timings = [];
      },
    ],
    [
      'provider',
      (r: ReturnType<typeof fixture>['report']) => {
        r.providers.claudeModel = 'different';
      },
    ],
    [
      'usage',
      (r: ReturnType<typeof fixture>['report']) => {
        r.usage = [{ inputTokens: 20, outputTokens: 30, searchUses: 99 }];
      },
    ],
  ] as const)
    it(
      'refuses original observation change to ' + name,
      () => {
        const root = amendedFixture();
        const path = 'docs/evidence/live-validation.json';
        const report = JSON.parse(readFileSync(join(root, path), 'utf8'));
        mutate(report);
        json(root, path, report);
        expect(amendErrors(root)).toContain(
          'Accepted immutable anchor differs',
        );
      },
      15000,
    );
  it('fails missing disposition under original strict acceptance rather than treating absence as approval', () => {
    const root = amendedFixture();
    unlinkSync(join(root, 'docs/evidence/11-live-acceptance-disposition.json'));
    expect(amendErrors(root)).toContain(
      'Incomplete required live case L4: fail',
    );
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
  it('requires the reviewed archives in actual candidate ancestry', () => {
    const root = amendedFixture();
    // The genuine issue54 archive already includes the earlier target merge.
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
      expect(() => acceptanceProvenance(root)).toThrow(
        /Target handoff storage/,
      );
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
  it('rejects removing the historical final archive required by the adopted delivery history', () => {
    const root = amendedFixture();
    const path = 'docs/evidence/11-astra-amended-pr-review.txt';
    expect(existsSync(join(root, path))).toBe(true);
    unlinkSync(join(root, path));
    expect(() => acceptanceProvenance(root)).toThrow(path);
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

  const deliveryAnchors = [
    'docs/superpowers/specs/2026-10-15-54-trunk-delivery-config-design.md',
    'docs/superpowers/plans/2026-10-15-54-trunk-delivery-config.md',
    'docs/evidence/54-astra-trunk-delivery-config-assessment.txt',
  ];
  it('records exact config provenance without rebinding physical observations', () => {
    const root = amendedFixture();
    const d = acceptanceProvenance(root);
    expect(d.deliveryConfiguration).toMatchObject({
      baselineCommit: deliveryBaseline,
      storageCommit: '164e233a90e37dd9ea9c9356c6a5f5c6221b0edd',
      path: deliveryConfig,
      before: {
        mode: '100644',
        blob: 'c8263ac7233be6e8462805d0a1386f5919dd0ee6',
        bytes: 2002,
        sha256:
          '269c2744e6ab4c59b131aeee53188197501e95f99e652d97c81a60f8337880b3',
      },
      after: {
        mode: '100644',
        blob: deliveryPostBlob,
        bytes: 2091,
        sha256:
          '23500227004639e8708857bf2017b6eaeba8c0e0c427e339b8865f547b37885f',
      },
    });
    expect(d.originalPhysical.gitHead).toBe(
      '2687b5434377f423363be7d279dbcaf12279aa8f',
    );
    expect(d.observations).toMatchObject({
      L4: 'fail',
      L6: 'unverified',
      pauseObserved: false,
    });
    expect(d.deliveryConfiguration.anchors.map((row) => row.path)).toEqual(
      deliveryAnchors,
    );
  }, 15000);
  for (const [name, mutate] of [
    [
      'missing',
      (c: Record<string, unknown>) => {
        delete c.fullAutoMerge;
      },
    ],
    [
      'null',
      (c: Record<string, unknown>) => {
        c.fullAutoMerge = null;
      },
    ],
    [
      'squash',
      (c: Record<string, unknown>) => {
        c.fullAutoMerge = {
          mechanism: 'provider-action',
          mergeMethod: 'squash',
        };
      },
    ],
    [
      'rebase',
      (c: Record<string, unknown>) => {
        c.fullAutoMerge = {
          mechanism: 'provider-action',
          mergeMethod: 'rebase',
        };
      },
    ],
    [
      'unknown method',
      (c: Record<string, unknown>) => {
        c.fullAutoMerge = {
          mechanism: 'provider-action',
          mergeMethod: 'unknown',
        };
      },
    ],
    [
      'wrong mechanism',
      (c: Record<string, unknown>) => {
        c.fullAutoMerge = { mechanism: 'shell', mergeMethod: 'merge' };
      },
    ],
    [
      'extra property',
      (c: Record<string, unknown>) => {
        c.fullAutoMerge = {
          mechanism: 'provider-action',
          mergeMethod: 'merge',
          extra: true,
        };
      },
    ],
    [
      'another field',
      (c: Record<string, unknown>) => {
        c.repo = 'other/repository';
      },
    ],
  ] as const)
    it(
      'rejects working delivery config ' + name,
      () => {
        const root = amendedFixture();
        const c = JSON.parse(readFileSync(join(root, deliveryConfig), 'utf8'));
        mutate(c);
        put(root, deliveryConfig, JSON.stringify(c, null, 2) + '\n');
        expect(() => acceptanceProvenance(root)).toThrow(
          /Delivery configuration.*task-tracker[.]json/,
        );
      },
      15000,
    );
  it('rejects config reserialization despite identical parsed values', () => {
    const root = amendedFixture();
    put(
      root,
      deliveryConfig,
      JSON.stringify(
        JSON.parse(readFileSync(join(root, deliveryConfig), 'utf8')),
      ),
    );
    expect(() => acceptanceProvenance(root)).toThrow(
      /Delivery configuration.*task-tracker[.]json/,
    );
  }, 15000);
  it('rejects hidden committed config even when working bytes are restored', () => {
    const root = amendedFixture();
    const good = readFileSync(join(root, deliveryConfig));
    const c = JSON.parse(good.toString());
    expect(c.fullAutoMerge).toEqual({
      mechanism: 'provider-action',
      mergeMethod: 'merge',
    });
    c.fullAutoMerge.mergeMethod = 'squash';
    put(root, deliveryConfig, JSON.stringify(c, null, 2) + '\n');
    commit(root, 'Bad committed delivery config');
    put(root, deliveryConfig, good);
    expect(() => acceptanceProvenance(root)).toThrow(
      /candidate HEAD.*task-tracker[.]json/,
    );
  }, 15000);
  for (const path of [deliveryConfig, ...deliveryAnchors]) {
    for (const kind of ['missing', 'changed', 'mode', 'alias'] as const)
      it(
        'rejects delivery ' + kind + ' ' + path,
        () => {
          const root = amendedFixture();
          const file = join(root, path);
          if (kind === 'missing') unlinkSync(file);
          if (kind === 'changed')
            put(root, path, readFileSync(file, 'utf8') + '\nChanged\n');
          if (kind === 'mode') chmodSync(file, 0o755);
          if (kind === 'alias') {
            renameSync(file, file + '.original');
            symlinkSync(file + '.original', file);
          }
          expect(() => acceptanceProvenance(root)).toThrow(path);
        },
        15000,
      );
    for (const kind of ['mode', 'bytes'] as const)
      it(
        'pins committed delivery ' + kind + ' for ' + path,
        () => {
          const root = amendedFixture();
          const bytes = readFileSync(join(root, path));
          if (kind === 'mode') chmodSync(join(root, path), 0o755);
          if (kind === 'bytes')
            put(root, path, bytes.toString() + '\nChanged\n');
          commit(root, 'Hidden committed delivery collateral');
          put(root, path, bytes);
          chmodSync(join(root, path), 0o644);
          expect(() => acceptanceProvenance(root)).toThrow(/candidate HEAD/);
        },
        15000,
      );
  }
  for (const directory of [
    '.ai-task-manager',
    'docs/superpowers/specs',
    'docs/superpowers/plans',
    'docs/evidence',
  ])
    it(
      'rejects aliased delivery parent ' + directory,
      () => {
        const root = amendedFixture();
        const path = join(root, directory);
        renameSync(path, path + '.original');
        symlinkSync(path + '.original', path);
        expect(() => acceptanceProvenance(root)).toThrow(/regular paths/);
      },
      15000,
    );
  it('requires real reviewed delivery archive ancestry', () => {
    const root = amendedFixture();
    git(root, 'update-ref', 'HEAD', deliveryBaseline);
    expect(() => acceptanceProvenance(root)).toThrow(/164e233/);
  }, 15000);
  it('rejects changed config preimage storage even when actual candidate is exact', () => {
    const root = amendedFixture();
    const good = readFileSync(join(root, deliveryConfig));
    put(root, deliveryConfig, '{"fullAutoMerge":null}\n');
    git(root, 'add', deliveryConfig);
    const badTree = git(root, 'write-tree');
    const badStorage = git(
      root,
      '-c',
      'user.name=Evidence fixture',
      '-c',
      'user.email=fixture@example.test',
      'commit-tree',
      badTree,
      ...git(root, 'show', '-s', '--format=%P', deliveryBaseline)
        .split(' ')
        .flatMap((parent) => ['-p', parent]),
      '-m',
      'Wrong preimage storage fixture',
    );
    put(root, deliveryConfig, good);
    git(root, 'add', deliveryConfig);
    git(root, 'replace', deliveryBaseline, badStorage);
    try {
      expect(() => acceptanceProvenance(root)).toThrow(
        /Delivery configuration preimage/,
      );
    } finally {
      git(root, 'replace', '-d', deliveryBaseline);
    }
  }, 15000);
  it('rejects unrelated documentation rather than accepting a path supplied by evidence', () => {
    const root = amendedFixture();
    put(root, 'docs/evidence/54-self-approval.json', '{"approved":true}');
    expect(() => acceptanceProvenance(root)).toThrow(
      /working tree.*54-self-approval/,
    );
  }, 15000);

  it('returned delivery snapshots cannot poison later fixed-policy validation', () => {
    const root = amendedFixture();
    const snapshot = acceptanceProvenance(root).deliveryConfiguration;
    const saved = {
      before: { ...snapshot.before },
      after: { ...snapshot.after },
      anchors: snapshot.anchors.map((anchor) => ({ ...anchor })),
    };
    try {
      snapshot.before.blob = '0'.repeat(40);
      snapshot.after.sha256 = '0'.repeat(64);
      snapshot.anchors[0].blob = '0'.repeat(40);
      // A returned data record cannot mutate the authority used by this later call.
      expect(() => acceptanceProvenance(root)).not.toThrow();
      const good = readFileSync(join(root, deliveryConfig));
      const badConfig = Buffer.concat([good, Buffer.from('\n')]);
      snapshot.after.bytes = badConfig.length;
      snapshot.after.sha256 = sha(badConfig);
      put(root, deliveryConfig, badConfig);
      expect(() => acceptanceProvenance(root)).toThrow(
        /Delivery configuration.*task-tracker[.]json/,
      );
      put(root, deliveryConfig, good);
      const path = deliveryAnchors[0];
      const badAnchor = Buffer.concat([
        readFileSync(join(root, path)),
        Buffer.from('\nChanged\n'),
      ]);
      snapshot.anchors[0].bytes = badAnchor.length;
      snapshot.anchors[0].sha256 = sha(badAnchor);
      put(root, path, badAnchor);
      expect(() => acceptanceProvenance(root)).toThrow(
        /Delivery collateral integrity/,
      );
    } finally {
      // Old implementations expose private references; preserve safe RED isolation.
      Object.assign(snapshot.before, saved.before);
      Object.assign(snapshot.after, saved.after);
      snapshot.anchors.forEach((anchor, index) =>
        Object.assign(anchor, saved.anchors[index]),
      );
    }
  }, 20000);
  it('resolves parent-null delivery through the actual default dependencies and supported trunk setter', async () => {
    const root = amendedFixture();
    const paths = {
      projectPath: join(root, deliveryConfig),
      userPath: join(root, '.scratch/absent-user-config.json'),
    };
    put(
      root,
      deliveryConfig,
      git(root, 'show', trunkBaseline + ':' + deliveryConfig) + '\n',
    );
    expect(sha(readFileSync(paths.projectPath))).toBe(
      '23500227004639e8708857bf2017b6eaeba8c0e0c427e339b8865f547b37885f',
    );
    const commands: Array<{ command: string; args: string[] }> = [];
    const resolveDefault = async () => {
      const cfg = loadConfig(paths);
      const deps = createDefaultDeliverDeps(
        { projectDir: root, cfg },
        {
          exec: async (command: string, args: string[]) => {
            expect(command).toBe('gh');
            expect(args.length).toBe(10);
            expect(args.slice(0, 3)).toEqual(['api', 'graphql', '-f']);
            expect(args[3]).toContain(
              'issue(number: $issue) { parent { number } }',
            );
            expect(args.slice(4)).toEqual([
              '-f',
              'owner=kburson',
              '-f',
              'repo=AIVC',
              '-F',
              'issue=2',
            ]);
            commands.push({ command, args: [...args] });
            return {
              stdout: JSON.stringify({
                data: { repository: { issue: { parent: null } } },
              }),
              stderr: '',
            };
          },
        },
      );
      return deps.resolveLineage({ issueNumber: 2 });
    };
    expect(await resolveDefault()).toEqual({
      parentIssueNumber: null,
      deliveryTarget: '',
    });
    expect(loadConfig(paths)._sources.trunkRef).toBe('default');
    setConfigValue('trunkRef', 'origin/trunk', paths);
    expect(loadConfig(paths)._sources.trunkRef).toBe('project');
    expect(sha(readFileSync(paths.projectPath))).toBe(
      '4b3c919cbae4dc9e6e225965ad420ba80405cb8e86f552bfc53bb06b32b450b9',
    );
    expect(await resolveDefault()).toEqual({
      parentIssueNumber: null,
      deliveryTarget: 'trunk',
    });
    expect(commands).toHaveLength(2);
  }, 15000);
  for (const value of [undefined, '', 'trunk', 'origin/main', 'other/trunk'])
    it(
      'rejects trunk target ' + String(value),
      () => {
        const root = amendedFixture();
        const config = JSON.parse(
          readFileSync(join(root, deliveryConfig), 'utf8'),
        );
        if (value === undefined) delete config.trunkRef;
        else config.trunkRef = value;
        json(root, deliveryConfig, config);
        expect(() => acceptanceProvenance(root)).toThrow(
          /Delivery configuration.*task-tracker[.]json/,
        );
      },
      15000,
    );
  it('rejects hidden committed trunk target restored in working files', () => {
    const root = amendedFixture();
    const good = readFileSync(join(root, deliveryConfig));
    const config = JSON.parse(good.toString());
    config.trunkRef = 'origin/main';
    put(root, deliveryConfig, JSON.stringify(config, null, 2) + '\n');
    commit(root, 'Hidden bad trunk target');
    put(root, deliveryConfig, good);
    expect(() => acceptanceProvenance(root)).toThrow(
      /candidate HEAD.*task-tracker[.]json/,
    );
  }, 15000);
  for (const path of trunkAnchors) {
    for (const kind of ['missing', 'changed', 'mode', 'alias'] as const)
      it(
        'rejects trunk ' + kind + ' ' + path,
        () => {
          const root = amendedFixture();
          const file = join(root, path);
          if (kind === 'missing') unlinkSync(file);
          if (kind === 'changed')
            put(root, path, readFileSync(file, 'utf8') + '\nChanged\n');
          if (kind === 'mode') chmodSync(file, 0o755);
          if (kind === 'alias') {
            renameSync(file, file + '.original');
            symlinkSync(file + '.original', file);
          }
          expect(() => acceptanceProvenance(root)).toThrow(path);
        },
        15000,
      );
    for (const kind of ['mode', 'bytes'] as const)
      it(
        'pins committed trunk ' + kind + ' ' + path,
        () => {
          const root = amendedFixture();
          const bytes = readFileSync(join(root, path));
          if (kind === 'mode') chmodSync(join(root, path), 0o755);
          if (kind === 'bytes')
            put(root, path, bytes.toString() + '\nChanged\n');
          commit(root, 'Hidden trunk authority change');
          put(root, path, bytes);
          chmodSync(join(root, path), 0o644);
          expect(() => acceptanceProvenance(root)).toThrow(/candidate HEAD/);
        },
        15000,
      );
  }
  it('requires real reviewed trunk archive ancestry', () => {
    const root = amendedFixture();
    git(root, 'update-ref', 'HEAD', trunkBaseline);
    expect(() => acceptanceProvenance(root)).toThrow(/72a937e/);
  }, 15000);
  for (const ref of [trunkBaseline, trunkArchive])
    it(
      'rejects changed trunk preimage storage ' + ref,
      () => {
        const root = amendedFixture();
        const good = readFileSync(join(root, deliveryConfig));
        put(root, deliveryConfig, '{"trunkRef":"origin/main"}\n');
        git(root, 'add', deliveryConfig);
        const badTree = git(root, 'write-tree');
        const bad = git(
          root,
          '-c',
          'user.name=Evidence fixture',
          '-c',
          'user.email=fixture@example.test',
          'commit-tree',
          badTree,
          ...git(root, 'show', '-s', '--format=%P', ref)
            .split(' ')
            .flatMap((parent) => ['-p', parent]),
          '-m',
          'Wrong trunk preimage',
        );
        put(root, deliveryConfig, good);
        git(root, 'add', deliveryConfig);
        git(root, 'replace', ref, bad);
        try {
          expect(() => acceptanceProvenance(root)).toThrow(
            /Trunk configuration preimage/,
          );
        } finally {
          git(root, 'replace', '-d', ref);
        }
      },
      15000,
    );
  it('returned trunk snapshots cannot poison later fixed-policy validation', () => {
    const root = amendedFixture();
    const snapshot = acceptanceProvenance(root).trunkConfiguration;
    const saved = {
      before: { ...snapshot.before },
      after: { ...snapshot.after },
      anchors: snapshot.anchors.map((anchor) => ({ ...anchor })),
    };
    try {
      snapshot.before.blob = '0'.repeat(40);
      snapshot.after.sha256 = '0'.repeat(64);
      snapshot.anchors[0].blob = '0'.repeat(40);
      expect(() => acceptanceProvenance(root)).not.toThrow();
      const good = readFileSync(join(root, deliveryConfig));
      const bad = Buffer.concat([good, Buffer.from('\n')]);
      snapshot.after.bytes = bad.length;
      snapshot.after.sha256 = sha(bad);
      put(root, deliveryConfig, bad);
      expect(() => acceptanceProvenance(root)).toThrow(
        /Delivery configuration.*task-tracker[.]json/,
      );
      put(root, deliveryConfig, good);
      const path = trunkAnchors[0];
      const badAnchor = Buffer.concat([
        readFileSync(join(root, path)),
        Buffer.from('\nChanged\n'),
      ]);
      snapshot.anchors[0].bytes = badAnchor.length;
      snapshot.anchors[0].sha256 = sha(badAnchor);
      put(root, path, badAnchor);
      expect(() => acceptanceProvenance(root)).toThrow(
        /Trunk collateral integrity/,
      );
    } finally {
      Object.assign(snapshot.before, saved.before);
      Object.assign(snapshot.after, saved.after);
      snapshot.anchors.forEach((anchor, index) =>
        Object.assign(anchor, saved.anchors[index]),
      );
    }
  }, 20000);
});
