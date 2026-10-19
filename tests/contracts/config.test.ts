import { readFile } from 'node:fs/promises';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../../apps/orchestrator/src/config.js';
import { createCapabilities } from '../../apps/orchestrator/src/capabilities.js';
import { AppError } from '@aivc/contracts';
import { validateCapabilities } from '@aivc/contracts';

const env = () => ({
  NODE_ENV: 'test' as const,
  AIVC_MODE: 'live',
  BFF_ALLOWED_ORIGINS: 'http://localhost:3000,http://127.0.0.1:3000',
  BFF_ALLOWED_HOSTS: 'localhost:3000,127.0.0.1:3000',
  RETRIEVAL_BASE_URL: 'http://127.0.0.1:3001',
  CLAUDE_WEB_SEARCH: 'enabled',
  CLAUDE_WEB_SEARCH_TOOL_VERSION: 'web_search_20250305',
  SPEECH_CHARS_PER_SECOND: '14',
  TURN_TIMEOUT_MS: '60000',
  RETRIEVAL_TIMEOUT_MS: '5000',
  SPEECH_TIMEOUT_MS: '20000',
});
afterEach(() => {
  vi.unstubAllEnvs();
  delete (globalThis as { __aivcRuntimeV1?: unknown }).__aivcRuntimeV1;
  vi.resetModules();
});
describe('server configuration and sanitized capabilities', () => {
  it('loads exactly the accepted private fields and documented limits', () => {
    const config = loadConfig(env());
    expect(Object.keys(config).sort()).toEqual(
      [
        'mode',
        'allowedOrigins',
        'allowedHosts',
        'anthropicKey',
        'claudeModel',
        'deepgramKey',
        'sttModel',
        'ttsModel',
        'retrievalBaseUrl',
        'searchEnabled',
        'searchToolVersion',
        'speechCharsPerSecond',
        'segmentChars',
        'turnTimeoutMs',
        'retrievalTimeoutMs',
        'speechTimeoutMs',
      ].sort(),
    );
    expect(config).toMatchObject({
      mode: 'live',
      anthropicKey: null,
      claudeModel: null,
      deepgramKey: null,
      sttModel: null,
      ttsModel: null,
      retrievalBaseUrl: 'http://127.0.0.1:3001',
      searchEnabled: true,
      searchToolVersion: 'web_search_20250305',
      speechCharsPerSecond: 14,
      segmentChars: 84,
      turnTimeoutMs: 60000,
      retrievalTimeoutMs: 5000,
      speechTimeoutMs: 20000,
    });
    expect([...config.allowedOrigins]).toEqual([
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ]);
    expect([...config.allowedHosts]).toEqual([
      'localhost:3000',
      '127.0.0.1:3000',
    ]);
  });
  it('defaults only mode to live and permits explicit mock', () => {
    expect(loadConfig({ ...env(), AIVC_MODE: undefined }).mode).toBe('live');
    expect(loadConfig({ ...env(), AIVC_MODE: 'mock' }).mode).toBe('mock');
    expect(() => loadConfig({ ...env(), AIVC_MODE: 'fallback' })).toThrow(
      AppError,
    );
  });
  it.each([
    '*',
    'http://*.localhost:3000',
    'http://user:pass@localhost:3000',
    'http://localhost:3000/',
    'http://localhost:3000/path',
    'http://localhost:3000?x=1',
    'http://localhost:3000#x',
    'null',
    'ftp://localhost:3000',
    'http://LOCALHOST:3000',
    'http://localhost:03000',
    '',
  ])('rejects noncanonical origin %s', (origin) => {
    expect(() => loadConfig({ ...env(), BFF_ALLOWED_ORIGINS: origin })).toThrow(
      AppError,
    );
  });
  it.each([
    '*',
    'localhost:3000/path',
    'user@localhost:3000',
    'localhost:99999',
    'localhost:03000',
    'localhost:3000?x=1',
    'LOCALHOST:3000',
    'localhost:3000#x',
    'http://localhost:3000',
    '',
  ])('rejects malformed host %s', (host) => {
    expect(() => loadConfig({ ...env(), BFF_ALLOWED_HOSTS: host })).toThrow(
      AppError,
    );
  });
  it('rejects missing matching Host and missing required admission settings', () => {
    expect(() =>
      loadConfig({ ...env(), BFF_ALLOWED_HOSTS: 'localhost:3000' }),
    ).toThrow(AppError);
    expect(() =>
      loadConfig({ ...env(), BFF_ALLOWED_ORIGINS: undefined }),
    ).toThrow(AppError);
    expect(() =>
      loadConfig({ ...env(), BFF_ALLOWED_HOSTS: undefined }),
    ).toThrow(AppError);
  });
  it.each([
    'SPEECH_CHARS_PER_SECOND',
    'TURN_TIMEOUT_MS',
    'RETRIEVAL_TIMEOUT_MS',
    'SPEECH_TIMEOUT_MS',
  ])('rejects missing/nonpositive/nonfinite %s', (key) => {
    for (const value of [undefined, '', '0', '-1', 'NaN', 'Infinity', 'oops']) {
      expect(() => loadConfig({ ...env(), [key]: value })).toThrow(AppError);
    }
  });
  it('derives effective segment cap and rejects an unusably small CPS', () => {
    expect(
      loadConfig({ ...env(), SPEECH_CHARS_PER_SECOND: '30' }).segmentChars,
    ).toBe(120);
    expect(
      loadConfig({ ...env(), SPEECH_CHARS_PER_SECOND: '1.5' }).segmentChars,
    ).toBe(9);
    expect(() =>
      loadConfig({ ...env(), SPEECH_CHARS_PER_SECOND: '0.01' }),
    ).toThrow(AppError);
  });
  it('rejects invalid fixed retrieval origins and unsupported search configuration', () => {
    for (const origin of [
      'http://user@localhost:3001',
      'http://localhost:3001/path',
      'ftp://localhost:3001',
      '',
    ]) {
      expect(() =>
        loadConfig({ ...env(), RETRIEVAL_BASE_URL: origin }),
      ).toThrow(AppError);
    }
    expect(() => loadConfig({ ...env(), CLAUDE_WEB_SEARCH: 'yes' })).toThrow(
      AppError,
    );
    expect(() =>
      loadConfig({ ...env(), CLAUDE_WEB_SEARCH_TOOL_VERSION: 'latest' }),
    ).toThrow(AppError);
  });
  it('parses the credential-free example and all exact defaults', async () => {
    const example = await readFile(
      new URL('../../apps/web/.env.example', import.meta.url),
      'utf8',
    );
    const values = Object.fromEntries(
      example
        .split(/\r?\n/)
        .filter((line) => /^[A-Z_]+=/.test(line))
        .map((line) => {
          const at = line.indexOf('=');
          return [line.slice(0, at), line.slice(at + 1)];
        }),
    );
    const config = loadConfig({ ...values, NODE_ENV: 'test' });
    for (const name of [
      'ANTHROPIC_API_KEY',
      'CLAUDE_MODEL',
      'DEEPGRAM_API_KEY',
      'DEEPGRAM_STT_MODEL',
      'DEEPGRAM_TTS_MODEL',
    ])
      expect(values[name]).toBe('');
    expect(config.segmentChars).toBe(84);
    expect(config.turnTimeoutMs).toBe(60000);
    expect(config.retrievalTimeoutMs).toBe(5000);
    expect(config.speechTimeoutMs).toBe(20000);
    const caps = createCapabilities(config, {
      mode: 'development',
      buildId: null,
    });
    expect(caps.turnsAvailable).toBe(false);
    expect(caps.speechAvailable).toBe(false);
    expect(caps.search).toMatchObject({
      state: 'unavailable',
      accountValidation: 'unavailable',
    });
  });
  it('preserves typed capability without Deepgram and never verifies search from config', () => {
    const config = loadConfig({
      ...env(),
      ANTHROPIC_API_KEY: 'dummy-anthropic-secret',
      CLAUDE_MODEL: 'operator-model',
    });
    const caps = createCapabilities(config, {
      mode: 'production',
      buildId: 'tested-build',
    });
    expect(caps.turnsAvailable).toBe(true);
    expect(caps.speechAvailable).toBe(false);
    expect(caps.model).toBe('operator-model');
    expect(caps.search.state).toBe('unavailable');
    expect(caps.search.reason).toMatch(/support.*not.*checked/i);
    expect(caps.search.accountValidation).toBe('pending');
    expect(validateCapabilities(caps)).toEqual(caps);
    expect(JSON.stringify(caps)).not.toContain('dummy-anthropic-secret');
    expect(Object.keys(caps)).not.toContain('anthropicKey');
  });
  it('handles missing Claude, disabled search and explicit simulation truthfully', () => {
    const config = loadConfig({
      ...env(),
      DEEPGRAM_API_KEY: 'dummy-deepgram',
      DEEPGRAM_STT_MODEL: 'stt',
      DEEPGRAM_TTS_MODEL: 'tts',
    });
    const caps = createCapabilities(config, {
      mode: 'development',
      buildId: null,
    });
    expect(caps.turnsAvailable).toBe(false);
    expect(caps.speechAvailable).toBe(true);
    expect(caps.search.reason).toMatch(/Claude.*not configured/i);
    expect(
      createCapabilities(
        loadConfig({ ...env(), CLAUDE_WEB_SEARCH: 'disabled' }),
        caps.build,
      ).search.state,
    ).toBe('disabled');
    const mock = createCapabilities(
      loadConfig({ ...env(), AIVC_MODE: 'mock' }),
      caps.build,
    );
    expect(mock.mode).toBe('mock');
    expect(mock.search).toEqual({
      state: 'unavailable',
      reason: 'Mock/Contract Simulation does not verify hosted search.',
      accountValidation: 'unavailable',
    });
  });
  it('keeps runtime and two-slot pools stable across module reload', async () => {
    for (const [key, value] of Object.entries(env())) vi.stubEnv(key, value);
    const firstModule = await import('../../apps/web/server/runtime');
    const first = firstModule.getRuntime();
    const lease1 = first.leasePools.acquire('turn');
    const lease2 = first.leasePools.acquire('turn');
    vi.resetModules();
    const secondModule = await import('../../apps/web/server/runtime');
    const second = secondModule.getRuntime();
    expect(second).toBe(first);
    expect(() => second.leasePools.acquire('turn')).toThrowError(/busy/i);
    lease1.release();
    lease2.release();
    expect(second.adapters).toEqual({});
  });
});

it('disables only the missing Deepgram capability', () => {
  const ttsOnly = loadConfig({
    ...env(),
    DEEPGRAM_API_KEY: 'dummy-deepgram',
    DEEPGRAM_TTS_MODEL: 'tts',
  });
  const build = { mode: 'development' as const, buildId: null };
  expect(createCapabilities(ttsOnly, build).speechAvailable).toBe(true);
  const sttOnly = loadConfig({
    ...env(),
    DEEPGRAM_API_KEY: 'dummy-deepgram',
    DEEPGRAM_STT_MODEL: 'stt',
  });
  expect(createCapabilities(sttOnly, build).speechAvailable).toBe(false);
  expect(createCapabilities(sttOnly, build).sttModel).toBe('stt');
});

it('does not advertise usable audio models when the Deepgram credential is absent', () => {
  const config = loadConfig({
    ...env(),
    DEEPGRAM_STT_MODEL: 'stt',
    DEEPGRAM_TTS_MODEL: 'tts',
  });
  const caps = createCapabilities(config, {
    mode: 'development',
    buildId: null,
  });
  expect(caps.speechAvailable).toBe(false);
  expect(caps.sttModel).toBe(null);
  expect(caps.ttsModel).toBe(null);
});

it('shares occupied default paid and pipeline pools across factories, compatibility exports and reloads', async () => {
  for (const [key, value] of Object.entries(env())) vi.stubEnv(key, value);
  const firstModule = await import('../../apps/web/server/runtime');
  const first = firstModule.getRuntime();
  expect(first.pipelines).toBeDefined();
  const core = await import('../../apps/orchestrator/src/runtime.js');
  const resources = await import('../../apps/orchestrator/src/resources.js');
  expect(core.getRuntime()).toBe(first);
  const other = core.createRuntime({ ...env(), AIVC_MODE: 'mock' });
  expect(other.leasePools).toBe(first.leasePools);
  expect(other.pipelines).toBe(first.pipelines);
  const held = [first.leasePools, first.pipelines].flatMap((pool) =>
    (['turn', 'speech'] as const).flatMap((kind) => [
      pool.acquire(kind),
      pool.acquire(kind),
    ]),
  );
  try {
    vi.resetModules();
    const reloaded = await import('../../apps/orchestrator/src/runtime.js');
    const reloadedResources =
      await import('../../apps/orchestrator/src/resources.js');
    expect(reloaded.getRuntime()).toBe(first);
    expect(reloadedResources.getPipelinePools()).toBe(
      resources.getPipelinePools(),
    );
    const fresh = reloaded.createRuntime(env());
    for (const pool of [fresh.leasePools, fresh.pipelines])
      for (const kind of ['turn', 'speech'] as const)
        expect(() => pool.acquire(kind)).toThrowError(/busy/i);
    expect(fresh.config.mode).toBe('live');
    expect(other.config.mode).toBe('mock');
    expect(first.adapters).toEqual({});
  } finally {
    held.forEach((lease) => lease.release());
  }
});

it('requires a complete explicit resource context and keeps isolated contexts independent', async () => {
  const runtime = await import('../../apps/web/server/runtime');
  expect(runtime.createRuntime).toBeTypeOf('function');
  const { LeasePools } =
    await import('../../apps/orchestrator/src/turns/leases.js');
  const { PipelinePools } =
    await import('../../apps/orchestrator/src/resources.js');
  const context = {
    leasePools: new LeasePools(),
    pipelines: new PipelinePools(),
  };
  const first = runtime.createRuntime(env(), { resources: context });
  const shared = runtime.createRuntime(env(), { resources: context });
  const isolated = runtime.createRuntime(env(), {
    resources: { leasePools: new LeasePools(), pipelines: new PipelinePools() },
  });
  const held = [first.leasePools, first.pipelines].flatMap((pool) => [
    pool.acquire('turn'),
    pool.acquire('turn'),
  ]);
  try {
    for (const pool of [shared.leasePools, shared.pipelines])
      expect(() => pool.acquire('turn')).toThrowError(/busy/i);
    for (const pool of [isolated.leasePools, isolated.pipelines]) {
      const lease = pool.acquire('turn');
      lease.release();
    }
  } finally {
    held.forEach((lease) => lease.release());
  }
  for (const resources of [
    null,
    {},
    { leasePools: context.leasePools },
    { pipelines: context.pipelines },
    { leasePools: {}, pipelines: {} },
  ])
    expect(() =>
      runtime.createRuntime(env(), { resources: resources as never }),
    ).toThrowError(/complete resource context/i);
});

it('caches ordinary adapters per runtime while preserving explicit adapter injection', async () => {
  const module = await import('../../apps/web/server/runtime');
  expect(module.createRuntime).toBeTypeOf('function');
  const runtime = module.createRuntime({ ...env(), AIVC_MODE: 'mock' });
  const first = module.getTurnDeps(runtime);
  expect(module.getTurnDeps(runtime).model).toBe(first.model);
  expect(module.getTurnDeps(runtime).lookup).toBe(first.lookup);
  expect(module.getSpeechAdapter(runtime)).toBe(
    module.getSpeechAdapter(runtime),
  );
  const transcribe = async () => 'injected text';
  const injected = module.createRuntime(
    { ...env(), AIVC_MODE: 'mock' },
    { adapters: { transcribe } },
  );
  expect(
    await module
      .getTurnDeps(injected)
      .transcribe(new Uint8Array(), new AbortController().signal),
  ).toBe('injected text');
});

it('keeps factory build metadata bound to its supplied environment after ambient changes', async () => {
  vi.stubEnv('NODE_ENV', 'development');
  const { createRuntime } = await import('../../apps/web/server/runtime');
  const production = createRuntime({ ...env(), NODE_ENV: 'production' });
  expect(production.capabilities.build.mode).toBe('production');
  expect((await production.buildInfo).mode).toBe('production');
  const development = createRuntime({ ...env(), NODE_ENV: 'development' });
  vi.stubEnv('NODE_ENV', 'production');
  expect(await development.buildInfo).toEqual({
    mode: 'development',
    buildId: null,
  });
});
