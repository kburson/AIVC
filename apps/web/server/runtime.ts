import { basename, resolve } from 'node:path';
import type { Capabilities } from '../shared/contracts';
import { loadConfig } from './config';
import type { ServerConfig } from './config';
import { createCapabilities } from './capabilities';
import { readBuildInfo } from './build-info';
import type { BuildInfo } from './build-info';
import { getLeasePools } from './turns/leases';
import type { LeasePools } from './turns/leases';
export type ServerRuntime = {
  config: ServerConfig;
  capabilities: Capabilities;
  adapters: Record<string, unknown>;
  leasePools: LeasePools;
  readonly buildInfo: Promise<BuildInfo>;
};
const processState = globalThis as typeof globalThis & {
  __aivcRuntimeV1?: ServerRuntime;
};
export function getRuntime(): ServerRuntime {
  if (processState.__aivcRuntimeV1) return processState.__aivcRuntimeV1;
  const config = loadConfig(process.env);
  const cwd = process.cwd();
  const webRoot = basename(cwd) === 'web' ? cwd : resolve(cwd, 'apps/web');
  const build: BuildInfo = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    buildId: null,
  };
  let buildInfo: Promise<BuildInfo> | undefined;
  return (processState.__aivcRuntimeV1 = {
    config,
    capabilities: createCapabilities(config, build),
    adapters: {},
    leasePools: getLeasePools(),
    // Metadata is read only after Host admission; SDK adapter construction belongs to subsequent deliveries.
    get buildInfo() {
      return (buildInfo ??= readBuildInfo(webRoot));
    },
  });
}
