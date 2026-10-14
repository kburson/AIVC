import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, expect, it, vi } from 'vitest';
import { readBuildInfo } from '../../apps/web/server/build-info';
const roots: string[] = [];
async function root() {
  await mkdir('.scratch/build-info', { recursive: true });
  const path = await mkdtemp('.scratch/build-info/controlled-');
  roots.push(path);
  return path;
}
afterEach(async () => {
  vi.unstubAllEnvs();
  await Promise.all(
    roots.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});
it('reads the actually served production BUILD_ID, including one trailing newline', async () => {
  vi.stubEnv('NODE_ENV', 'production');
  const path = await root();
  await mkdir(join(path, '.next'));
  await writeFile(join(path, '.next/BUILD_ID'), 'production-build_13\n');
  expect(await readBuildInfo(path)).toEqual({
    mode: 'production',
    buildId: 'production-build_13',
  });
});
it('reports production/null for missing or malformed BUILD_ID', async () => {
  vi.stubEnv('NODE_ENV', 'production');
  const path = await root();
  expect(await readBuildInfo(path)).toEqual({
    mode: 'production',
    buildId: null,
  });
  await mkdir(join(path, '.next'));
  for (const id of [
    '',
    'has whitespace',
    'two\nlines',
    '../escape',
    'x'.repeat(257),
  ]) {
    await writeFile(join(path, '.next/BUILD_ID'), id);
    expect(await readBuildInfo(path)).toEqual({
      mode: 'production',
      buildId: null,
    });
  }
});
it('reports development/null even when a production file remains on disk', async () => {
  vi.stubEnv('NODE_ENV', 'development');
  const path = await root();
  await mkdir(join(path, '.next'));
  await writeFile(join(path, '.next/BUILD_ID'), 'old-production-id');
  expect(await readBuildInfo(path)).toEqual({
    mode: 'development',
    buildId: null,
  });
});
