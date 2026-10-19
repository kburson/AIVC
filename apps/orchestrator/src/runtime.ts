import { ClaudeAdapter } from './providers/claude.js';
import { MockAdapter, createMockSpeechAdapter } from './providers/mock.js';
import { createDeepgramAdapter } from './providers/deepgram.js';
import type { SpeechAdapter } from './providers/contracts.js';
import type { ModelAdapter, TurnDeps } from './providers/contracts.js';
import { createRetrievalClient } from './tools/retrieval-client.js';
import { AppError } from '@aivc/contracts';
import { basename, resolve } from 'node:path';
import type { Capabilities } from '@aivc/contracts';
import { loadConfig } from './config.js';
import type { ServerConfig } from './config.js';
import { createCapabilities } from './capabilities.js';
import { readBuildInfo } from './build-info.js';
import type { BuildInfo } from './build-info.js';
import { getLeasePools } from './turns/leases.js';
import { getPipelinePools } from './resources.js';
import type { ResourceContext, PipelinePools } from './resources.js';
export type { ResourceContext } from './resources.js';
import type { LeasePools } from './turns/leases.js';
export type ServerRuntime = {
  config: ServerConfig;
  capabilities: Capabilities;
  adapters: Record<string, unknown>;
  leasePools: LeasePools;
  pipelines: PipelinePools;
  readonly buildInfo: Promise<BuildInfo>;
};
const processState = globalThis as typeof globalThis & {
  __aivcRuntimeV1?: ServerRuntime;
};
export type RuntimeOverrides = {
  resources?: ResourceContext;
  adapters?: Record<string, unknown>;
};
export function getRuntime(): ServerRuntime {
  return (processState.__aivcRuntimeV1 ??= createRuntime(process.env));
}
export function createRuntime(
  env: NodeJS.ProcessEnv,
  overrides: RuntimeOverrides = {},
): ServerRuntime {
  const resources = overrides.resources;
  if (
    resources !== undefined &&
    (!resources ||
      typeof resources.leasePools?.acquire !== 'function' ||
      typeof resources.pipelines?.acquire !== 'function')
  )
    throw new AppError(
      400,
      'INVALID_REQUEST',
      'A complete resource context is required.',
      null,
      false,
    );
  const config = loadConfig(env);
  const cwd = process.cwd();
  const webRoot = basename(cwd) === 'web' ? cwd : resolve(cwd, 'apps/web');
  const build: BuildInfo = {
    mode: env.NODE_ENV === 'production' ? 'production' : 'development',
    buildId: null,
  };
  let buildInfo: Promise<BuildInfo> | undefined;
  return {
    config,
    capabilities: createCapabilities(config, build),
    adapters: { ...overrides.adapters },
    leasePools: resources?.leasePools ?? getLeasePools(),
    pipelines: resources?.pipelines ?? getPipelinePools(),
    // Metadata is read only after Host admission; provider adapters are constructed after turn admission.
    get buildInfo() {
      return (buildInfo ??= readBuildInfo(webRoot, build.mode));
    },
  };
}

export function getTurnDeps(runtime: ServerRuntime): TurnDeps {
  if (!runtime.capabilities.turnsAvailable)
    throw new AppError(
      502,
      'MODEL_FAILED',
      'Claude turns are not configured.',
      null,
      false,
    );
  if (!runtime.adapters.model)
    runtime.adapters.model =
      runtime.config.mode === 'mock'
        ? new MockAdapter()
        : new ClaudeAdapter({
            apiKey: runtime.config.anthropicKey!,
            model: runtime.config.claudeModel!,
            capabilities: runtime.capabilities,
            searchEnabled: runtime.config.searchEnabled,
          });
  if (!runtime.adapters.lookup)
    runtime.adapters.lookup = createRetrievalClient(
      runtime.config.retrievalBaseUrl,
    );
  const transcribe = runtime.adapters.transcribe as
    TurnDeps['transcribe'] | undefined;
  return {
    model: runtime.adapters.model as ModelAdapter,
    lookup: runtime.adapters.lookup as TurnDeps['lookup'],
    transcribe:
      transcribe ??
      ((wav, signal) => getSpeechAdapter(runtime).transcribe(wav, signal)),
    mode: runtime.config.mode,
    capabilities: runtime.capabilities,
  };
}

export function getSpeechAdapter(runtime: ServerRuntime): SpeechAdapter {
  if (!runtime.adapters.speech)
    runtime.adapters.speech =
      runtime.config.mode === 'mock'
        ? createMockSpeechAdapter()
        : createDeepgramAdapter(runtime.config);
  return runtime.adapters.speech as SpeechAdapter;
}
