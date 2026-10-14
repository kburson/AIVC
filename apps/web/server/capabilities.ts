import type { Capabilities } from '../shared/contracts';
import type { ServerConfig } from './config';
import type { BuildInfo } from './build-info';
export function createCapabilities(
  config: ServerConfig,
  build: BuildInfo,
): Capabilities {
  const turnsAvailable =
    config.mode === 'mock' ||
    Boolean(config.anthropicKey && config.claudeModel);
  const speechAvailable =
    config.mode === 'mock' || Boolean(config.deepgramKey && config.ttsModel);
  let search: Capabilities['search'];
  if (config.mode === 'mock')
    search = {
      state: 'unavailable',
      reason: 'Mock/Contract Simulation does not verify hosted search.',
      accountValidation: 'unavailable',
    };
  else if (!config.searchEnabled)
    search = {
      state: 'disabled',
      reason: turnsAvailable
        ? 'Hosted search is disabled by configuration.'
        : 'Hosted search is disabled. Claude turns are not configured.',
      accountValidation: 'unavailable',
    };
  else if (!turnsAvailable)
    search = {
      state: 'unavailable',
      reason: 'Claude turns are not configured (missing server key or model).',
      accountValidation: 'unavailable',
    };
  else
    search = {
      state: 'unavailable',
      reason: 'Hosted search model support has not been checked.',
      accountValidation: 'pending',
    };
  return {
    schemaVersion: 1,
    mode: config.mode,
    model: config.claudeModel,
    sttModel:
      config.mode === 'mock' || config.deepgramKey ? config.sttModel : null,
    ttsModel:
      config.mode === 'mock' || config.deepgramKey ? config.ttsModel : null,
    build: { ...build },
    turnsAvailable,
    speechAvailable,
    search,
    speech: {
      segmentChars: config.segmentChars,
      backlogChars: 2400,
      highWaterSeconds: 10,
      lowWaterSeconds: 2,
    },
  };
}
