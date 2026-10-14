import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import {
  readFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  rmSync,
  copyFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'apps/web/package.json'));
const revision = 'aivc-vad-lifecycle-v1';
const patchPath = 'patches/@ricky0123+vad-web+0.0.31.patch';
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
function packageRoot(name) {
  const entry = require.resolve(name);
  let dir = dirname(entry);
  while (true) {
    const file = join(dir, 'package.json');
    if (
      existsSync(file) &&
      JSON.parse(readFileSync(file, 'utf8')).name === name
    )
      return {
        dir,
        entry,
        bytes: readFileSync(file),
        metadata: JSON.parse(readFileSync(file, 'utf8')),
      };
    const parent = dirname(dir);
    if (parent === dir)
      throw Error('Cannot resolve actual package root: ' + name);
    dir = parent;
  }
}
export function copyVadAssets() {
  const vad = packageRoot('@ricky0123/vad-web'),
    ort = packageRoot('onnxruntime-web');
  if (vad.metadata.version !== '0.0.31' || ort.metadata.version !== '1.30.0')
    throw Error(
      'VAD/ORT package versions differ from the exact application pins.',
    );
  if (relative(vad.dir, vad.entry) !== 'dist/index.js')
    throw Error('VAD must use the pinned module entry.');
  const patchBytes = readFileSync(join(root, patchPath)),
    patch = patchBytes.toString('utf8');
  const blocks = patch.split('diff --git ').slice(1);
  const appliedModules = {};
  for (const file of ['dist/real-time-vad.js', 'dist/real-time-vad.d.ts']) {
    const prefix =
      'a/node_modules/@ricky0123/vad-web/' +
      file +
      ' b/node_modules/@ricky0123/vad-web/' +
      file;
    const block = blocks.find((value) => value.split('\n')[0] === prefix);
    const index = block
      ?.split('\n')
      .find((value) => value.startsWith('index '));
    const expected = index?.slice(6).split(' ')[0].split('..')[1];
    if (!expected || !new RegExp('^[a-f0-9]{40}$').test(expected))
      throw Error('Missing full pinned patch postimage: ' + file);
    const bytes = readFileSync(join(vad.dir, file));
    const actual = createHash('sha1')
      .update('blob ' + bytes.length + '\0')
      .update(bytes)
      .digest('hex');
    if (actual !== expected)
      throw Error('Installed VAD module differs from patch postimage: ' + file);
    appliedModules[file] = digest(bytes);
  }
  if (blocks.length !== 2)
    throw Error(
      'Lifecycle patch must affect exactly the JS implementation and declaration.',
    );
  const { MicVAD } = require(vad.entry);
  if (MicVAD.lifecyclePatchRevision !== revision)
    throw Error('VAD lifecycle patch marker is absent.');
  const ortFiles = readdirSync(join(ort.dir, 'dist'))
    .filter((name) => new RegExp('^ort-wasm.*[.](wasm|mjs)$').test(name))
    .sort();
  for (const required of [
    'ort-wasm-simd-threaded.wasm',
    'ort-wasm-simd-threaded.mjs',
  ])
    if (!ortFiles.includes(required))
      throw Error('Missing pinned ORT asset: ' + required);
  const inputs = [
    {
      name: 'vad.worklet.bundle.min.js',
      sourcePackage: vad.metadata.name,
      source: 'dist/vad.worklet.bundle.min.js',
      dir: vad.dir,
    },
    {
      name: 'silero_vad_v5.onnx',
      sourcePackage: vad.metadata.name,
      source: 'dist/silero_vad_v5.onnx',
      dir: vad.dir,
    },
    ...ortFiles.map((name) => ({
      name: 'ort/' + name,
      sourcePackage: ort.metadata.name,
      source: 'dist/' + name,
      dir: ort.dir,
    })),
  ];
  const files = {};
  for (const input of inputs) {
    const file = join(input.dir, input.source);
    if (!existsSync(file)) throw Error('Missing pinned asset: ' + input.source);
    const bytes = readFileSync(file);
    files[input.name] = {
      sourcePackage: input.sourcePackage,
      source: input.source,
      size: bytes.length,
      sha256: digest(bytes),
    };
  }
  const output = join(root, 'apps/web/public/vad');
  rmSync(output, { recursive: true, force: true });
  mkdirSync(join(output, 'ort'), { recursive: true });
  for (const input of inputs)
    copyFileSync(join(input.dir, input.source), join(output, input.name));
  const manifest = {
    schemaVersion: 1,
    vad: {
      version: vad.metadata.version,
      upstreamGitHead: 'de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d',
      upstreamIntegrity:
        'sha512-ePVq8TvB21sdHSxVMZOEIf9JVa7MAYpaIaNXeGgsPOiMCN8xbPCdF2LS5aYj7VRR3ZxzutedgV9ZplV65IA1Fg==',
      packageSha256: digest(vad.bytes),
      lifecyclePatchRevision: MicVAD.lifecyclePatchRevision,
    },
    ort: { version: ort.metadata.version, packageSha256: digest(ort.bytes) },
    patch: { path: patchPath, sha256: digest(patchBytes) },
    appliedModules,
    files,
    timing: {
      sampleRate: 16000,
      frameSamples: 512,
      frameMs: 32,
      minSpeechMs: 400,
      quantizedMinSpeechMs: 384,
      redemptionMs: 800,
      preSpeechPadMs: 800,
    },
  };
  writeFileSync(
    join(output, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );
  return manifest;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const manifest = copyVadAssets();
    console.log(
      'Pinned VAD assets regenerated: ' +
        Object.keys(manifest.files).length +
        ' files.',
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
