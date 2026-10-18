import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Capabilities } from '@aivc/contracts';
export type BuildInfo = Capabilities['build'];
export async function readBuildInfo(webRoot: string): Promise<BuildInfo> {
  if (process.env.NODE_ENV !== 'production')
    return { mode: 'development', buildId: null };
  try {
    const raw = await readFile(join(webRoot, '.next', 'BUILD_ID'), 'utf8');
    const buildId = raw.replace(/\r?\n$/, '');
    if (!/^[A-Za-z0-9_-]{1,256}$/.test(buildId))
      return { mode: 'production', buildId: null };
    return { mode: 'production', buildId };
  } catch {
    return { mode: 'production', buildId: null };
  }
}
