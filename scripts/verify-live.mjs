import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { verifyAmendmentReview } from './format-check.mjs';

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
  const byContext = Object.fromEntries(
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
  return Object.fromEntries(
    Object.entries(byContext).flatMap(([context, versions]) =>
      Object.entries(versions).map(([name, version]) => [
        context + ':' + name,
        version,
      ]),
    ),
  );
}

const acceptanceBase = 'fc51a548e73dc74bb14cfb9805eb381182fb8ad8';
const physicalHead = '2687b5434377f423363be7d279dbcaf12279aa8f';
const physicalDigest =
  '14bee2533f13459b45add5278bf59a243e5af135e5cc70110dcaf54f31854e63';
const dispositionPath = 'docs/evidence/11-live-acceptance-disposition.json';
const policyId = 'aivc.issue11.accepted-live-limitations/v1';
const acceptancePaths = new Set([
  'scripts/verify-live.mjs',
  'scripts/format-check.mjs',
  'scripts/lint-markdown.mjs',
  'tests/scripts/verify-live.test.ts',
  'tests/scripts/format-check.test.ts',
  'tests/scripts/quality-scans.test.ts',
  'docs/implementation/11-system-acceptance.md',
  'docs/live-validation.md',
  'README.md',
  'docs/evidence/11-astra-amended-pr-review.txt',
  dispositionPath,
]);
const lintStorageCommit = '63fdb6911a87d2978551e0a86c7387a53cfc0461';
const lintAnchors = [
  [
    'docs/superpowers/specs/2026-10-15-11-sealed-review-lint-addendum.md',
    4125,
    'b4a92bd2148cb7987f98f48acd9ccd51e01857a72adf492024b350e9a25b9e68',
  ],
  [
    'docs/evidence/11-astra-sealed-lint-assessment.txt',
    3776,
    '7c46b0e3b912433e32854e0595ead2a76bb6799d4c25828501d51596b4c8a52f',
  ],
];
const targetArchive = 'c529123d95e782acd962aa8276cd635616d59db9';
const targetRef = 'fe2a158c8f717aed43d604c3d7614dc18a3452e1';
const handoffPath = 'docs/implementation/2-live-validation-handoff.md';
const targetAnchors = [
  [
    handoffPath,
    11475,
    'c75d79584e13b4685650ca6bbbe29a9cbce9305b8b23e9a96023525b89891be0',
  ],
  [
    'docs/superpowers/specs/2026-10-15-11-target-collateral-addendum.md',
    3627,
    '1c058fa9d9d7e164223edef0c0b80d198d186cfe17b2d666f43fce73b1a28afa',
  ],
  [
    'docs/evidence/11-astra-target-collateral-assessment.txt',
    11739,
    '77d7d222834c7cfa7ef1c730dd9782b041f8fc4dfe2b5ed1706360e5ec4f3262',
  ],
];
const acceptedAnchors = [
  [
    'docs/superpowers/specs/2026-10-15-11-live-acceptance-amendment-design.md',
    15886,
    'e15e9cbace3029fa11a457383c5c2ed8fd78be27b437ffe0efe39780553cddd5',
  ],
  [
    'docs/superpowers/specs/2026-10-15-11-sealed-review-formatting-addendum.md',
    3933,
    '5d528935471deae245c1931e825cf25ac3175cb2978021978dc86cceb0de2a56',
  ],
  [
    'docs/evidence/11-astra-sealed-formatting-assessment.txt',
    3937,
    '3f6e35b27baee932f7fa15d99dc2ea081e735d45e9e10e70b82109ae52188352',
  ],
  [
    'docs/evidence/live-validation.json',
    11044,
    'd908c3bb4a8fd6ab1a99272833d6de9d69fc8f43cebccf563aea61afe1ee6882',
  ],
  [
    'docs/evidence/11-live-physical-2687b54.json',
    3409513,
    '663b8089359e22afa454abf7e5f1bd9139befc4710e5a9d9a2365b46e08b0da6',
  ],
  [
    'docs/evidence/11-document-teardown-2687b54.json',
    1838,
    '74b2d27f80b9bff407bf58e05125ad3173e261ab0c4cb4709c7b8cdc8e7925d4',
  ],
  [
    'docs/evidence/11-native-search-ordered-385d11b.json',
    196068,
    '4b0159c5d9594ac142bb3104e5ddf1de7a9bd1bca631e59a961da5ade88484c3',
  ],
];
const deliveryBaseline = 'b4d5ff903f4965429a27f409cbd2bcac843fb324';
const deliveryArchive = '164e233a90e37dd9ea9c9356c6a5f5c6221b0edd';
const deliveryPath = '.ai-task-manager/task-tracker.json';
const deliveryBefore = {
  mode: '100644',
  blob: 'c8263ac7233be6e8462805d0a1386f5919dd0ee6',
  bytes: 2002,
  sha256: '269c2744e6ab4c59b131aeee53188197501e95f99e652d97c81a60f8337880b3',
};
const deliveryAfter = {
  mode: '100644',
  blob: '4c117bc9ffdd4cfbbaf2d6fa4ad758c4834affa3',
  bytes: 2091,
  sha256: '23500227004639e8708857bf2017b6eaeba8c0e0c427e339b8865f547b37885f',
};
const deliveryAnchors = [
  {
    path: 'docs/superpowers/specs/2026-10-15-54-trunk-delivery-config-design.md',
    mode: '100644',
    blob: 'be5ed0d4bd985fc13e7080ece1051114e819d3f5',
    bytes: 11642,
    sha256: 'e6f7dee5362ebb9ddf84a4256a1549dff94c56991269c74ebb1ce3e39dd78e46',
  },
  {
    path: 'docs/superpowers/plans/2026-10-15-54-trunk-delivery-config.md',
    mode: '100644',
    blob: 'adeaa19663fc4fcfacdc703b3d6107c5fd8b2c38',
    bytes: 20846,
    sha256: '599d0550b0d24ddafbee99a99419b9e3d8cf559516be13e61ad7c3d846110c0a',
  },
  {
    path: 'docs/evidence/54-astra-trunk-delivery-config-assessment.txt',
    mode: '100644',
    blob: '91a583ae574385a528fe054ac9cd52833ffc18a9',
    bytes: 2782,
    sha256: '82a244a81858bde4b61b8154576e6b20fc947e66d4aeeec7c87df795bacfd689',
  },
];
function tree(root, ref) {
  return new Map(
    git(root, ['ls-tree', '-rz', ref])
      .split('\0')
      .filter(Boolean)
      .map((line) => {
        const [meta, path] = line.split('\t');
        const [mode, type, blob] = meta.split(' ');
        if (type !== 'blob' || !['100644', '100755'].includes(mode))
          throw Error('Unsupported tracked file mode: ' + path);
        return [path, { mode, blob }];
      }),
  );
}
function workingTree(root) {
  const paths = new Set(
    [
      ...git(root, ['ls-files', '-z']).split('\0'),
      ...git(root, ['ls-files', '--others', '--exclude-standard', '-z']).split(
        '\0',
      ),
    ].filter(Boolean),
  );
  return new Map(
    [...paths].sort().map((path) => {
      const file = regular(root, path);
      const bytes = readFileSync(file);
      return [
        path,
        {
          mode: lstatSync(file).mode & 0o111 ? '100755' : '100644',
          blob: createHash('sha1')
            .update('blob ' + bytes.length + '\0')
            .update(bytes)
            .digest('hex'),
        },
      ];
    }),
  );
}
function searchBoundary(path) {
  return (
    /^(?:apps\/web\/(?:server|shared|app\/api)\/|patches\/)/.test(path) ||
    /(?:^|\/)package(?:-lock)?[.]json$/.test(path) ||
    (!path.includes('/') && sourcePath(path))
  );
}
// A single fixed accepted policy. No caller supplies roots of trust or changed-path exemptions.
export function acceptanceProvenance(root = workspace) {
  git(root, ['merge-base', '--is-ancestor', acceptanceBase, 'HEAD']);
  git(root, ['merge-base', '--is-ancestor', physicalHead, acceptanceBase]);
  verifyAmendmentReview(root);
  git(root, ['merge-base', '--is-ancestor', lintStorageCommit, 'HEAD']);
  for (const [path, length, digest] of lintAnchors) {
    const bytes = readFileSync(regular(root, path));
    const stored = execFileSync(
      'git',
      ['show', lintStorageCommit + ':' + path],
      { cwd: root },
    );
    if (
      bytes.length !== length ||
      sha(bytes) !== digest ||
      !bytes.equals(stored)
    )
      throw Error('Accepted lint anchor differs: ' + path);
  }
  if (
    computeSourceDigest(root, physicalHead) !== physicalDigest ||
    computeSourceDigest(root, acceptanceBase) !== physicalDigest
  )
    throw Error('Accepted original physical source does not match Git');
  for (const [path, length, digest] of acceptedAnchors) {
    const bytes = readFileSync(regular(root, path));
    const committed = execFileSync(
      'git',
      ['show', acceptanceBase + ':' + path],
      { cwd: root, maxBuffer: 8 * 1024 * 1024 },
    );
    if (
      bytes.length !== length ||
      sha(bytes) !== digest ||
      !bytes.equals(committed)
    )
      throw Error('Accepted immutable anchor differs: ' + path);
  }
  git(root, ['merge-base', '--is-ancestor', targetArchive, 'HEAD']);
  const archiveTree = tree(root, targetArchive);
  const targetTree = tree(root, targetRef);
  for (const [path, length, digest] of targetAnchors) {
    const file = regular(root, path);
    const bytes = readFileSync(file);
    const archived = execFileSync('git', ['show', targetArchive + ':' + path], {
      cwd: root,
    });
    if (
      lstatSync(file).mode & 0o111 ||
      archiveTree.get(path)?.mode !== '100644' ||
      bytes.length !== length ||
      sha(bytes) !== digest ||
      !bytes.equals(archived)
    )
      throw Error('Target collateral integrity differs: ' + path);
    if (
      path === handoffPath &&
      (targetTree.get(path)?.mode !== '100644' ||
        targetTree.get(path)?.blob !==
          'bd64361def52c6ce512bad6ac90deb96f2a8e406' ||
        !equal(targetTree.get(path), archiveTree.get(path)) ||
        !bytes.equals(
          execFileSync('git', ['show', targetRef + ':' + path], { cwd: root }),
        ))
    )
      throw Error('Target handoff storage/blob differs');
  }
  git(root, ['merge-base', '--is-ancestor', deliveryBaseline, deliveryArchive]);
  git(root, ['merge-base', '--is-ancestor', deliveryArchive, 'HEAD']);
  const deliveryStoredTree = tree(root, deliveryArchive);
  const preimage = execFileSync(
    'git',
    ['show', deliveryBaseline + ':' + deliveryPath],
    { cwd: root },
  );
  const expectedBefore = {
    mode: deliveryBefore.mode,
    blob: deliveryBefore.blob,
  };
  if (
    !equal(tree(root, deliveryBaseline).get(deliveryPath), expectedBefore) ||
    !equal(deliveryStoredTree.get(deliveryPath), expectedBefore) ||
    preimage.length !== deliveryBefore.bytes ||
    sha(preimage) !== deliveryBefore.sha256
  )
    throw Error(
      'Delivery configuration preimage/archive differs: ' + deliveryPath,
    );
  const configured = regular(root, deliveryPath);
  const configuredBytes = readFileSync(configured);
  if (
    lstatSync(configured).mode & 0o111 ||
    configuredBytes.length !== deliveryAfter.bytes ||
    sha(configuredBytes) !== deliveryAfter.sha256
  )
    throw Error('Delivery configuration differs: ' + deliveryPath);
  for (const anchor of deliveryAnchors) {
    const file = regular(root, anchor.path);
    const bytes = readFileSync(file);
    const stored = execFileSync(
      'git',
      ['show', deliveryArchive + ':' + anchor.path],
      { cwd: root },
    );
    if (
      lstatSync(file).mode & 0o111 ||
      bytes.length !== anchor.bytes ||
      sha(bytes) !== anchor.sha256 ||
      !equal(deliveryStoredTree.get(anchor.path), {
        mode: anchor.mode,
        blob: anchor.blob,
      }) ||
      !bytes.equals(stored)
    )
      throw Error('Delivery collateral integrity differs: ' + anchor.path);
  }
  const baseline = tree(root, acceptanceBase);
  const current = workingTree(root);
  const tested = tree(root, physicalHead);
  // Review-approved collateral between actual testing and the fixed adoption baseline.
  // Every other physical component must already be identical there.
  const historical = [
    ...new Set([...tested.keys(), ...baseline.keys()]),
  ].filter((path) => !equal(tested.get(path), baseline.get(path)));
  if (historical.some((path) => !path.startsWith('docs/')))
    throw Error('Adoption baseline changed product/runtime');
  const changed = [...new Set([...baseline.keys(), ...current.keys()])]
    .sort()
    .filter((path) => !equal(baseline.get(path), current.get(path)));
  // Same protected boundary for committed candidate and actual working files.
  // Reviewed immutable collateral is required in both, never just exempted.
  const protectedTree = new Map(baseline);
  const lintTree = tree(root, lintStorageCommit);
  for (const [path] of lintAnchors) protectedTree.set(path, lintTree.get(path));
  for (const [path] of targetAnchors)
    protectedTree.set(path, archiveTree.get(path));
  protectedTree.set(deliveryPath, {
    mode: deliveryAfter.mode,
    blob: deliveryAfter.blob,
  });
  for (const anchor of deliveryAnchors)
    protectedTree.set(anchor.path, { mode: anchor.mode, blob: anchor.blob });
  const ordinaryHead = '385d11b2448dac5bf01400bb7c11834bfefbfbfd';
  git(root, ['merge-base', '--is-ancestor', ordinaryHead, acceptanceBase]);
  const oldSearch = tree(root, ordinaryHead);
  const validateBoundary = (actual, label) => {
    for (const path of new Set([...protectedTree.keys(), ...actual.keys()])) {
      if (
        !equal(protectedTree.get(path), actual.get(path)) &&
        (!acceptancePaths.has(path) || actual.get(path)?.mode !== '100644')
      )
        throw Error(
          'Unreviewed acceptance boundary change in ' + label + ': ' + path,
        );
    }
    for (const path of new Set([...oldSearch.keys(), ...actual.keys()])) {
      if (searchBoundary(path) && !equal(oldSearch.get(path), actual.get(path)))
        throw Error(
          'Historical search component differs in ' + label + ': ' + path,
        );
    }
  };
  validateBoundary(tree(root, 'HEAD'), 'candidate HEAD');
  validateBoundary(current, 'working tree');
  const ordinaryPath = 'docs/evidence/11-native-search-ordered-385d11b.json';
  const storage = 'eddb4722584cda6137d0e456c87f4a560f90e117';
  git(root, ['merge-base', '--is-ancestor', storage, acceptanceBase]);
  if (
    !readFileSync(regular(root, ordinaryPath)).equals(
      execFileSync('git', ['show', storage + ':' + ordinaryPath], {
        cwd: root,
        maxBuffer: 1024 * 1024,
      }),
    )
  )
    throw Error('Ordinary native storage blob differs');
  const ordinary = json(root, ordinaryPath);
  const comparison = ordinary.posthocIdentity?.[1]?.priorBlockComparison;
  if (
    ordinary.gitHead !== ordinaryHead ||
    ordinary.observed?.omittedToolContinuation !== 'accepted' ||
    ordinary.observed?.round1NativeSearchCounter !== 2 ||
    !ordinary.observed?.bothResultsBeforeLookup ||
    ordinary.observed.pauseObserved !== false ||
    comparison?.jsonEqual !== true ||
    comparison.canonicalEqual !== true ||
    comparison.perBlock.length !== 7 ||
    comparison.perBlock.some(
      (item) => item.jsonEqual !== true || item.canonicalEqual !== true,
    )
  )
    throw Error('Ordinary native proof incomplete');
  return {
    policy: policyId,
    authority: {
      amendmentCommit: '75ffee8031203efec513b589daf74f2f2ab4453d',
      reviewStorageCommit: '71fc7115200bd94e7872c3e2f5dc3e15fd10bbce',
      adoptionCommit: acceptanceBase,
      lintAdoptionCommit: lintStorageCommit,
      targetCollateralCommit: targetArchive,
      humanTurn: '01a13f63-b581-7f11-af49-fc567f7aa25b',
      authorityAssurance: 'unavailable',
    },
    deliveryConfiguration: {
      baselineCommit: deliveryBaseline,
      storageCommit: deliveryArchive,
      path: deliveryPath,
      before: { ...deliveryBefore },
      after: { ...deliveryAfter },
      anchors: deliveryAnchors.map((anchor) => ({ ...anchor })),
    },
    targetHandoff: {
      path: handoffPath,
      targetCommit: targetRef,
      storageCommit: targetArchive,
      blob: 'bd64361def52c6ce512bad6ac90deb96f2a8e406',
    },
    originalPhysical: { gitHead: physicalHead, sourceDigest: physicalDigest },
    currentSourceDigest: computeSourceDigest(root),
    changedFiles: changed
      .filter((path) => path !== dispositionPath)
      .map((path) => ({
        path,
        before: baseline.get(path) ?? null,
        after: current.get(path) ?? null,
      })),
    ordinarySearch: {
      testedHead: ordinaryHead,
      storageCommit: storage,
      artifact: ordinaryPath,
      sha256:
        '4b0159c5d9594ac142bb3104e5ddf1de7a9bd1bca631e59a961da5ade88484c3',
    },
    runtimeProfile: json(root, 'docs/evidence/11-live-physical-2687b54.json')
      .runtimeProfile,
    observations: {
      L4: 'fail',
      L6: 'unverified',
      durationSeconds: 6.6,
      pauseObserved: false,
    },
    dispositions: {
      duration: 'accepted-measured-limitation',
      ordinaryContinuation: 'component-equality-qualified',
      providerPause: 'deferred-unverified',
      physical: 'unchanged-components-carried-forward',
    },
    verdict: 'amended-release-accepted-with-explicit-limitations',
  };
}
function acceptedDisposition(root) {
  const record = json(root, dispositionPath);
  if (!secretFree(record) || !equal(record, acceptanceProvenance(root)))
    throw Error(
      'Fixed acceptance disposition does not match actual authority/source inventory',
    );
  const observed = json(root, 'docs/evidence/11-live-physical-2687b54.json');
  if (
    !equal(observed.runtimeProfile, {
      speechCharsPerSecond: 12,
      segmentChars: 72,
      defaultUnchanged: 14,
      backlogChars: 2400,
      highWaterSeconds: 10,
      lowWaterSeconds: 2,
      speechTimeoutMs: 20000,
      turnTimeoutMs: 60000,
      retrievalTimeoutMs: 5000,
    })
  )
    throw Error('Only actual tested CPS12/cap72 runtime profile is qualified');
  return true;
}

export function verifyLive({
  root = workspace,
  reportPath = 'docs/evidence/live-validation.json',
  log = console.log,
} = {}) {
  root = resolve(root);
  const errors = [];
  let amended = false;
  if (existsSync(join(root, dispositionPath))) {
    try {
      if (reportPath !== 'docs/evidence/live-validation.json')
        throw Error(
          'Amended acceptance requires the fixed observed report path',
        );
      amended = acceptedDisposition(root);
    } catch (error) {
      errors.push('Amended acceptance invalid: ' + error.message);
    }
  }
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
      require((amended &&
        report.gitHead === physicalHead &&
        report.sourceDigest === physicalDigest) ||
        (report.sourceDigest === digest &&
          computeSourceDigest(root, report.gitHead) ===
            digest), 'Tested source digest is stale or does not match its tested head');
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
    require((item?.status === 'pass' ||
      (amended &&
        ((n === 4 && item?.status === 'fail') ||
          (n === 6 && item?.status === 'unverified')))) &&
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
      require(amended ||
        (search?.omittedToolContinuation === 'accepted' &&
          search?.pauseObserved ===
            true), 'Required omitted-tool/prior-block provider-pause continuation remains unverified');
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
      amended
        ? 'Amended release acceptance with explicit limitations: 6.60s target miss accepted; genuine provider pause unverified/deferred. Qualified physical profile CPS12/cap72 only; default CPS14 unchanged and not qualified by this result. No provider calls were made.'
        : 'Live evidence is complete and bound to tested source/runtime. No provider calls were made.',
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
