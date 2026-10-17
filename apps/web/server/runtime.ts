import { ClaudeAdapter } from './providers/claude';
import { MockAdapter, createMockSpeechAdapter } from './providers/mock';
import { createDeepgramAdapter } from './providers/deepgram';
import type { SpeechAdapter } from './providers/contracts';
import type { ModelAdapter, TurnDeps } from './providers/contracts';
import { createRetrievalClient } from './tools/retrieval-client';
import { AppError } from './http/errors';
import { basename, resolve } from 'node:path';
import type { Capabilities } from '@aivc/contracts';
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
    // Metadata is read only after Host admission; provider adapters are constructed after turn admission.
    get buildInfo() {
      return (buildInfo ??= readBuildInfo(webRoot));
    },
  });
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
