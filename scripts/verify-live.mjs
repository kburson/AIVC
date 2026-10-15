import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const patchPath = 'patches/@ricky0123+vad-web+0.0.31.patch';
const modulePath = 'node_modules/@ricky0123/vad-web/dist/real-time-vad.js';
const lifecycleRevision = 'aivc-vad-lifecycle-v1';
const upstreamIntegrity =
  'sha512-ePVq8TvB21sdHSxVMZOEIf9JVa7MAYpaIaNXeGgsPOiMCN8xbPCdF2LS5aYj7VRR3ZxzutedgV9ZplV65IA1Fg==';
const upstreamGitHead = 'de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d';
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const object = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const equal = isDeepStrictEqual;
const git = (root, args) =>
  execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 16 * 1024 * 1024,
  });
function sourcePath(path) {
  return (
    /^(?:apps|scripts|patches)\//.test(path) ||
    (!path.includes('/') &&
      (/\.(?:jsonc?|[cm]?js|ts|ya?ml)$/.test(path) ||
        ['.nvmrc', '.npmrc', '.gitignore'].includes(path)))
  );
}
function regular(root, path) {
  if (
    !text(path) ||
    isAbsolute(path) ||
    path.includes('\\') ||
    path.split('/').some((p) => !p || p === '.' || p === '..')
  )
    throw Error('Unsafe artifact/source path');
  let current = root;
  const parts = path.split('/');
  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    const stat = lstatSync(current);
    if (
      stat.isSymbolicLink() ||
      (index === parts.length - 1 ? !stat.isFile() : !stat.isDirectory())
    )
      throw Error('Artifact/source must have regular paths: ' + path);
  }
  return current;
}
function json(root, path) {
  return JSON.parse(readFileSync(regular(root, path), 'utf8'));
}
function secretFree(value) {
  if (
    typeof value === 'string' &&
    /sk-ant-[A-Za-z0-9_-]{12,}|(?:Bearer|Token)\s+[A-Za-z0-9_-]{24,}|(?:ANTHROPIC_API_KEY|DEEPGRAM_API_KEY)\s*=\s*[\x22\x27]?[A-Za-z0-9_-]{8,}/.test(
      value,
    )
  )
    return false;
  if (Array.isArray(value)) return value.every(secretFree);
  if (object(value))
    return Object.entries(value).every(
      ([key, item]) =>
        !/(?:api_?key|authorization|secret|access_?token)$/i.test(key) &&
        secretFree(item),
    );
  return true;
}
export function computeSourceDigest(root = workspace, ref = null) {
  const paths = git(
    root,
    ref ? ['ls-tree', '-r', '--name-only', '-z', ref] : ['ls-files', '-z'],
  )
    .split('\0')
    .filter(sourcePath)
    .sort();
  if (!paths.length) throw Error('No tracked application source');
  const hash = createHash('sha256');
  for (const path of paths) {
    const bytes = ref
      ? execFileSync('git', ['show', ref + ':' + path], {
          cwd: root,
          stdio: ['ignore', 'pipe', 'pipe'],
          maxBuffer: 8 * 1024 * 1024,
        })
      : readFileSync(regular(root, path));
    hash.update(path).update('\0').update(bytes).update('\0');
  }
  return hash.digest('hex');
}
export function installedPackages(root = workspace) {
  const manifest = json(root, 'package.json');
  const contexts = [
    ['.', manifest],
    ...(manifest.workspaces ?? []).map((path) => [
      path,
      json(root, path + '/package.json'),
    ]),
  ];
  return Object.fromEntries(
    contexts.map(([context, declaration]) => {
      const require = createRequire(join(root, context, 'package.json'));
      const names = Object.keys({
        ...declaration.dependencies,
        ...declaration.devDependencies,
      }).sort();
      return [
        context,
        Object.fromEntries(
          names.map((name) => {
            if (!/^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/i.test(name))
              throw Error('Invalid package name');
            let path;
            try {
              path = require.resolve(name + '/package.json');
            } catch {
              let directory = dirname(require.resolve(name));
              while (true) {
                const candidate = join(directory, 'package.json');
                if (
                  existsSync(candidate) &&
                  JSON.parse(readFileSync(candidate, 'utf8')).name === name
                ) {
                  path = candidate;
                  break;
                }
                const parent = dirname(directory);
                if (parent === directory)
                  throw Error('Package metadata not found: ' + name);
                directory = parent;
              }
            }
            const metadata = json(
              root,
              relative(root, path).split('\\').join('/'),
            );
            if (metadata.name !== name || !text(metadata.version))
              throw Error('Invalid installed package metadata: ' + name);
            return [name, metadata.version];
          }),
        ),
      ];
    }),
  );
}
export function verifyLive({
  root = workspace,
  reportPath = 'docs/evidence/live-validation.json',
  log = console.log,
} = {}) {
  root = resolve(root);
  const errors = [];
  const require = (condition, message) => {
    if (!condition) errors.push(message);
  };
  let report;
  try {
    report = json(root, reportPath);
  } catch (error) {
    return { ok: false, errors: ['Live report unavailable: ' + error.message] };
  }
  if (!object(report))
    return { ok: false, errors: ['Invalid live report schema'] };
  require(report.schemaVersion === 1, 'Invalid live report schema version');
  require(report.mode === 'live', 'Evidence must record live mode');
  require(secretFree(report), 'Report contains credential-looking data');
  require(typeof report.nodeVersion === 'string' &&
    /^v(?:2[6-9]|[3-9]\d|\d{3,})\./.test(report.nodeVersion) &&
    report.nodeVersion ===
      process.version, 'Tested Node version must be >=26 and match this verification runtime');
  require(Array.isArray(report.limitations) &&
    report.limitations.every(text), 'Record explicit limitations as strings');
  require(object(report.providers) &&
    ['claudeModel', 'sttModel', 'ttsModel'].every(
      (key) =>
        text(report.providers[key]) &&
        !/mock|placeholder|example|unverified/i.test(report.providers[key]),
    ), 'Missing actual provider model labels');
  require(object(report.browser) &&
    ['name', 'version', 'os'].every((key) => text(report.browser[key])) &&
    /^(?:Chrome|Chromium|Edge)$/i.test(
      report.browser.name,
    ), 'Missing actual supported browser/version/OS binding');
  if (
    typeof report.gitHead !== 'string' ||
    !/^[a-f0-9]{40}$/.test(report.gitHead)
  )
    errors.push('Invalid tested Git head');
  else {
    try {
      git(root, ['merge-base', '--is-ancestor', report.gitHead, 'HEAD']);
      const digest = computeSourceDigest(root);
      require(report.sourceDigest === digest &&
        computeSourceDigest(root, report.gitHead) ===
          digest, 'Tested source digest is stale or does not match its tested head');
      require(!git(root, ['ls-files', '--others', '--exclude-standard', '-z'])
        .split('\0')
        .some(
          sourcePath,
        ), 'Untracked application source cannot reuse live evidence');
    } catch (error) {
      errors.push(
        'Cannot verify tested source/head ancestry: ' + error.message,
      );
    }
  }
  try {
    require(object(report.packages) &&
      equal(
        report.packages,
        installedPackages(root),
      ), 'Recorded package versions do not match actual installed packages');
  } catch (error) {
    errors.push('Installed package verification failed: ' + error.message);
  }
  const vad = report.vadPatch;
  require(object(vad), 'Missing VAD patch provenance');
  if (object(vad)) {
    require(vad.packageVersion === '0.0.31' &&
      vad.upstreamGitHead === upstreamGitHead &&
      vad.patchPath === patchPath &&
      vad.modulePath ===
        modulePath, 'VAD patch/package/upstream paths differ from accepted provenance');
    require(vad.observedLifecycleRevision ===
      lifecycleRevision, 'Missing observed VAD lifecycle marker/revision');
    require(vad.buildMode === 'production' &&
      text(vad.buildId) &&
      /^[A-Za-z0-9_-]{1,256}$/.test(vad.buildId) &&
      !/^development$/i.test(
        vad.buildId,
      ), 'Missing observed production build ID/mode');
    try {
      require(sha(readFileSync(regular(root, patchPath))) ===
        vad.patchDigest, 'Current patch bytes do not match tested patch digest');
      const module = readFileSync(regular(root, modulePath), 'utf8');
      require(sha(module) ===
        vad.appliedModuleDigest, 'Installed VAD module digest differs from tested module');
      require(/MicVAD\.lifecyclePatchRevision\s*=\s*["']aivc-vad-lifecycle-v1["']/.test(
        module,
      ), 'Installed VAD module lacks the lifecycle marker');
      const metadata = json(
        root,
        'node_modules/@ricky0123/vad-web/package.json',
      );
      require(metadata.version ===
        vad.packageVersion, 'Installed VAD package version differs');
      const lock = json(root, 'package-lock.json').packages?.[
        'node_modules/@ricky0123/vad-web'
      ];
      require(lock?.version === '0.0.31' &&
        lock?.integrity ===
          upstreamIntegrity, 'Locked VAD distribution differs from accepted upstream integrity');
      // npm's installed package.json need not include the registry gitHead. The
      // accepted upstream identity is bound by lock integrity and the actual
      // patched implementation/declaration postimages, not an invented field.
      const patch = readFileSync(regular(root, patchPath), 'utf8');
      const blocks = patch.split('diff --git ').slice(1);
      require(blocks.length ===
        2, 'Lifecycle patch must contain exactly its two accepted modules');
      for (const file of ['dist/real-time-vad.js', 'dist/real-time-vad.d.ts']) {
        const prefix =
          'a/node_modules/@ricky0123/vad-web/' +
          file +
          ' b/node_modules/@ricky0123/vad-web/' +
          file;
        const block = blocks.find((value) => value.split('\n')[0] === prefix);
        const expected = block
          ?.split('\n')
          .find((value) => value.startsWith('index '))
          ?.slice(6)
          .split(' ')[0]
          .split('..')[1];
        const bytes = readFileSync(
          regular(root, 'node_modules/@ricky0123/vad-web/' + file),
        );
        const actual = createHash('sha1')
          .update('blob ' + bytes.length + '\0')
          .update(bytes)
          .digest('hex');
        require(typeof expected === 'string' &&
          /^[a-f0-9]{40}$/.test(expected) &&
          actual ===
            expected, 'Installed VAD module differs from actual patch postimage: ' +
          file);
      }
    } catch (error) {
      errors.push('Cannot verify patch/installed module: ' + error.message);
    }
  }
  require(Array.isArray(report.cases) &&
    report.cases.every(object), 'Malformed required live case records');
  const cases = Array.isArray(report.cases) ? report.cases.filter(object) : [];
  require(cases.length === 8 &&
    new Set(cases.map((item) => item.id)).size ===
      8, 'Live report must contain exactly L1–L8');
  for (let n = 1; n <= 8; n++) {
    const item = cases.find((entry) => entry.id === 'L' + n);
    require(item?.status === 'pass' &&
      text(item?.observations), 'Incomplete required live case L' +
      n +
      ': ' +
      (item?.status ?? 'missing'));
    if (item?.artifact !== null && item?.artifact !== undefined) {
      try {
        regular(root, item.artifact);
      } catch (error) {
        errors.push(
          'Invalid evidence artifact for L' + n + ': ' + error.message,
        );
      }
    }
  }
  let observed;
  try {
    const artifact = cases.find((item) => item.id === 'L1')?.artifact;
    if (!artifact)
      throw Error('L1 requires the sanitized runtime observation artifact');
    observed = json(root, artifact);
    require(object(observed) &&
      secretFree(observed) &&
      observed.mode ===
        'live', 'Runtime observation artifact must contain sanitized live observations');
    require(equal(
      observed.providers,
      report.providers,
    ), 'Recorded provider labels differ from runtime observation');
    require(equal(
      observed.browser,
      report.browser,
    ), 'Recorded browser differs from runtime observation');
    require(observed.sourceDigest === report.sourceDigest &&
      observed.nodeVersion ===
        report.nodeVersion, 'Runtime observation source/runtime binding differs');
    require(observed.build?.mode === 'production' &&
      observed.build?.buildId ===
        vad?.buildId, 'Observed production build binding differs');
    require(observed.observedLifecycleRevision ===
      lifecycleRevision, 'Browser-observed lifecycle marker differs');
    require(text(observed.measurementMethod?.clock) &&
      /performance\.now/.test(observed.measurementMethod.clock) &&
      text(
        observed.measurementMethod?.description,
      ), 'Missing same-clock browser measurement method');
    require(observed.devices?.headset === 'pass' &&
      observed.devices?.speakers ===
        'pass', 'Headset and speaker echo acceptance must both pass');
    require(observed.stt?.status === 'pass' &&
      observed.stt?.mode ===
        'batch-wav', 'Real batch WAV STT remains unverified');
    require(observed.tts?.status === 'pass' &&
      observed.tts?.incremental ===
        true, 'Real incremental TTS remains unverified');
    require(observed.sse?.incremental === true &&
      observed.sse?.beforeCompletion ===
        true, 'Actual local HTTP SSE before completion remains unverified');
    const search = observed.search;
    if (search?.state === 'unavailable')
      require(text(search.reason) &&
        search.lookupWithoutSearch === true &&
        search.conversationWithoutSearch ===
          true, 'Unavailable search requires actual reason and successful search-off lookup/conversation');
    else {
      require(search?.state ===
        'verified', 'Search must be actually verified or explicitly unavailable');
      require(Array.isArray(search?.citations) &&
        search.citations.length > 0 &&
        search.citations.every(
          (url) => typeof url === 'string' && /^https?:\/\//.test(url),
        ), 'Actual hosted search requires recorded citations');
      require(Number.isSafeInteger(search?.searchUses) &&
        search.searchUses >= 1 &&
        search.searchUses <=
          2, 'Invalid observed per-turn hosted-search budget');
      require(search?.omittedToolContinuation === 'accepted' &&
        search?.pauseObserved ===
          true, 'Required omitted-tool/prior-block provider-pause continuation remains unverified');
    }
  } catch (error) {
    errors.push(
      'Cannot validate runtime observation artifact: ' + error.message,
    );
  }
  require(Array.isArray(report.timings) &&
    report.timings.every(object), 'Malformed timing records');
  const timings = Array.isArray(report.timings)
    ? report.timings.filter(object)
    : [];
  const fields = [
    'vadMs',
    'sttMs',
    'modelToolMs',
    'ttsMs',
    'bufferMs',
    'speechEndToTextMs',
    'speechEndToAudioMs',
    'callbackToSilenceMs',
    'confirmationToCancelMs',
    'acousticOnsetToSilenceMs',
  ];
  const samples = new Set();
  for (const timing of timings) {
    const key =
      (typeof timing.scenario === 'string'
        ? timing.scenario.trim().toLowerCase()
        : '') +
      ':' +
      timing.sample;
    require(text(timing.scenario) &&
      Number.isSafeInteger(timing.sample) &&
      timing.sample > 0 &&
      !samples.has(key), 'Invalid/duplicate timing scenario sample');
    samples.add(key);
    require(fields.every(
      (field) =>
        Object.hasOwn(timing, field) &&
        (timing[field] === null ||
          (Number.isFinite(timing[field]) && timing[field] >= 0)),
    ), 'Timing fields must contain actual nonnegative durations or explicit null');
  }
  const atlas = timings.filter((timing) => /^atlas$/i.test(timing.scenario));
  require(atlas.length >= 3 &&
    atlas.every(
      (timing) =>
        Number.isFinite(timing.speechEndToTextMs) &&
        Number.isFinite(timing.speechEndToAudioMs),
    ), 'At least three actual Atlas speech/text/audio timing samples are required');
  const research = timings.filter((timing) =>
    /^research$/i.test(timing.scenario),
  );
  require(research.length > 0 &&
    research.every(
      (timing) =>
        Number.isFinite(timing.speechEndToTextMs) &&
        Number.isFinite(timing.speechEndToAudioMs),
    ), 'Missing actual public research speech/text/audio timing sample');
  const interruption = timings.filter((timing) =>
    /^interruption$/i.test(timing.scenario),
  );
  require(interruption.length > 0 &&
    interruption.every(
      (timing) =>
        Number.isFinite(timing.callbackToSilenceMs) &&
        timing.callbackToSilenceMs <= 200 &&
        Number.isFinite(timing.confirmationToCancelMs),
    ), 'Missing/passing <=200ms callback silence and separate confirmation timing');
  if (timings.some((timing) => timing.acousticOnsetToSilenceMs === null))
    require(text(
      observed?.measurementMethod?.acousticReason,
    ), 'Unavailable acoustic onset timing requires an explicit reason');
  require(Array.isArray(report.usage) &&
    report.usage.every(
      (usage) =>
        object(usage) &&
        Object.entries(usage).every(
          ([key, value]) =>
            ['inputTokens', 'outputTokens', 'searchUses'].includes(key) &&
            Number.isSafeInteger(value) &&
            value >= 0,
        ),
    ), 'Usage must contain only actual nonnegative provider counters; omit unknown counters');
  for (const error of errors) log('Live evidence: ' + error);
  if (!errors.length)
    log(
      'Live evidence is complete and bound to tested source/runtime. No provider calls were made.',
    );
  return { ok: errors.length === 0, errors };
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  if (process.argv.length !== 2) {
    console.error(
      'verify:live accepts no provider/execution/report-generation options',
    );
    process.exitCode = 2;
  } else process.exitCode = verifyLive().ok ? 0 : 1;
}
