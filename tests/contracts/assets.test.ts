// Filesystem/module provenance checks, not HTTP/MIME/model-load/browser/device acceptance.
import { createHash } from 'node:crypto';
import {
  readFileSync,
  existsSync,
  renameSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
const root = process.cwd(),
  require = createRequire(resolve('apps/web/package.json'));
const vadRoot = dirname(dirname(require.resolve('@ricky0123/vad-web')));
const ortRoot = dirname(dirname(require.resolve('onnxruntime-web')));
const output = resolve('apps/web/public/vad'),
  script = resolve('scripts/copy-vad-assets.mjs');
const sha = (file: string) =>
  createHash('sha256').update(readFileSync(file)).digest('hex');
function copy(cwd = root) {
  return spawnSync(process.execPath, [script], { cwd, encoding: 'utf8' });
}
type Manifest = {
  schemaVersion: number;
  vad: {
    version: string;
    upstreamGitHead: string;
    packageSha256: string;
    lifecyclePatchRevision: string;
  };
  ort: { version: string; packageSha256: string };
  patch: { path: string; sha256: string };
  appliedModules: Record<string, string>;
  files: Record<
    string,
    { sha256: string; size: number; sourcePackage: string; source: string }
  >;
};
function manifest(): Manifest {
  return JSON.parse(readFileSync(join(output, 'manifest.json'), 'utf8'));
}
describe('pinned VAD/ORT assets and applied lifecycle proof', () => {
  it('runs generation from web cwd and preserves exact package versions/upstream/marker/file digests', () => {
    const result = copy(resolve('apps/web'));
    expect(result.status, result.stderr).toBe(0);
    const m = manifest();
    expect(m.schemaVersion).toBe(1);
    expect(m.vad.version).toBe('0.0.31');
    expect(m.ort.version).toBe('1.30.0');
    expect(m.vad.upstreamGitHead).toBe(
      'de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d',
    );
    expect(m.vad.lifecyclePatchRevision).toBe('aivc-vad-lifecycle-v1');
    expect(m.vad.packageSha256).toBe(sha(join(vadRoot, 'package.json')));
    expect(m.ort.packageSha256).toBe(sha(join(ortRoot, 'package.json')));
    expect(m.patch.sha256).toBe(sha(resolve(m.patch.path)));
    expect(m.appliedModules['dist/real-time-vad.js']).toBe(
      sha(join(vadRoot, 'dist/real-time-vad.js')),
    );
    expect(m.appliedModules['dist/real-time-vad.d.ts']).toBe(
      sha(join(vadRoot, 'dist/real-time-vad.d.ts')),
    );
    expect(Object.keys(m.files)).toEqual(
      expect.arrayContaining([
        'vad.worklet.bundle.min.js',
        'silero_vad_v5.onnx',
        'ort/ort-wasm-simd-threaded.wasm',
        'ort/ort-wasm-simd-threaded.mjs',
      ]),
    );
    for (const [name, file] of Object.entries(m.files)) {
      expect(file.sha256).toBe(sha(join(output, name)));
      expect(readFileSync(join(output, name)).byteLength).toBe(file.size);
      const source =
        file.sourcePackage === '@ricky0123/vad-web' ? vadRoot : ortRoot;
      expect(file.sha256).toBe(sha(join(source, file.source)));
    }
    expect(
      (
        require('@ricky0123/vad-web') as {
          MicVAD: { lifecyclePatchRevision: string };
        }
      ).MicVAD.lifecyclePatchRevision,
    ).toBe(m.vad.lifecyclePatchRevision);
  });
  it('regenerates a removed output and keeps copied binaries outside Git source authority', () => {
    rmSync(join(output, 'silero_vad_v5.onnx'), { force: true });
    const result = copy();
    expect(result.status, result.stderr).toBe(0);
    expect(existsSync(join(output, 'silero_vad_v5.onnx'))).toBe(true);
    const ignored = spawnSync(
      'git',
      [
        '-C',
        root,
        'check-ignore',
        '--',
        'apps/web/public/vad/silero_vad_v5.onnx',
      ],
      { encoding: 'utf8' },
    );
    expect(ignored.status).toBe(0);
  });
  it('refuses missing pinned model input instead of accepting stale copied output', () => {
    const source = join(vadRoot, 'dist/silero_vad_v5.onnx'),
      parked = source + '.aivc-test';
    renameSync(source, parked);
    try {
      const result = copy();
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('silero_vad_v5.onnx');
    } finally {
      renameSync(parked, source);
    }
    expect(copy().status).toBe(0);
  });
  it('marker alone cannot bless installed module bytes that differ from the patch postimage', () => {
    const source = join(vadRoot, 'dist/real-time-vad.js'),
      original = readFileSync(source);
    writeFileSync(
      source,
      Buffer.concat([
        original,
        Buffer.from('\n// controlled postimage tamper\n'),
      ]),
    );
    try {
      const result = copy();
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('postimage');
    } finally {
      writeFileSync(source, original);
    }
    expect(copy().status).toBe(0);
  });
});
