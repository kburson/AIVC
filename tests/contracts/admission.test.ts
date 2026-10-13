import { afterEach, expect, it, vi } from 'vitest';
import { loadConfig } from '../../apps/web/server/config';
import { assertAdmission } from '../../apps/web/server/http/admission';
import { runAdmittedTurn } from '../../apps/web/server/http/body';
import { AppError } from '../../apps/web/shared/contracts';
import {
  errorResponse,
  errorFields,
  AppError as ServerError,
} from '../../apps/web/server/http/errors';

const env = {
  NODE_ENV: 'test' as const,
  AIVC_MODE: 'live',
  BFF_ALLOWED_ORIGINS: 'http://localhost:3000,http://127.0.0.1:3000',
  BFF_ALLOWED_HOSTS: 'localhost:3000,127.0.0.1:3000',
  SPEECH_CHARS_PER_SECOND: '14',
  RETRIEVAL_BASE_URL: 'http://127.0.0.1:3001',
  TURN_TIMEOUT_MS: '60000',
  RETRIEVAL_TIMEOUT_MS: '5000',
  SPEECH_TIMEOUT_MS: '20000',
};
const config = () => loadConfig(env);
afterEach(() => {
  vi.unstubAllEnvs();
  delete (globalThis as { __aivcRuntimeV1?: unknown }).__aivcRuntimeV1;
  vi.resetModules();
});
it.each([
  { origin: 'http://localhost:9999', host: 'localhost:3000' },
  { origin: 'null', host: 'localhost:3000' },
  { host: 'localhost:3000' },
  { origin: 'not a URL', host: 'localhost:3000' },
  { origin: 'http://localhost:3000/', host: 'localhost:3000' },
  { origin: 'http://user@localhost:3000', host: 'localhost:3000' },
  { origin: 'http://LOCALHOST:3000', host: 'localhost:3000' },
  { origin: 'http://localhost:3000', host: '127.0.0.1:3000' },
  { origin: 'http://localhost:3000', host: 'evil:3000' },
  { origin: 'http://localhost:3000' },
])(
  'rejects admission before the actual body getter and any admitted work: %j',
  async (values) => {
    for (const type of ['application/json', 'multipart/form-data']) {
      const form = new FormData();
      form.set('turnId', '11111111-1111-4111-8111-111111111111');
      form.set('history', '[]');
      form.set('text', 'hello');
      const headers = new Headers(
        Object.entries(values) as Array<[string, string]>,
      );
      if (type.includes('json')) headers.set('content-type', type);
      const request = new Request('http://localhost:3000/api/turn', {
        method: 'POST',
        headers,
        body: type.includes('json') ? JSON.stringify({ text: 'hello' }) : form,
      });
      const getter = vi.fn(() => {
        throw new Error('body must not be read');
      });
      Object.defineProperty(request, 'body', { get: getter });
      const upstream = vi.fn();
      expect(() => runAdmittedTurn(request, config(), upstream)).toThrow(
        AppError,
      );
      expect(getter).not.toHaveBeenCalled();
      expect(upstream).not.toHaveBeenCalled();
      try {
        assertAdmission(request.headers, config(), true);
      } catch (error) {
        expect(errorFields(error)).toEqual({
          code: 'ORIGIN_NOT_ALLOWED',
          message: 'Origin or Host is not allowed.',
          turnId: null,
          retryable: false,
        });
        expect(errorResponse(error).status).toBe(403);
      }
    }
  },
);
it('accepts exact configured pairs and ignores forwarded claims', () => {
  for (const host of ['localhost:3000', '127.0.0.1:3000']) {
    expect(() =>
      assertAdmission(
        new Headers({
          origin: 'http://' + host,
          host,
          'x-forwarded-host': 'evil:9999',
          'x-forwarded-proto': 'ftp',
        }),
        config(),
        true,
      ),
    ).not.toThrow();
  }
  expect(() =>
    assertAdmission(
      new Headers({
        origin: 'http://evil:3000',
        host: 'evil:3000',
        'x-forwarded-host': 'localhost:3000',
        'x-forwarded-proto': 'http',
      }),
      config(),
      true,
    ),
  ).toThrow(AppError);
  expect(() =>
    assertAdmission(
      new Headers({ host: 'localhost:3000', origin: 'null' }),
      config(),
      false,
    ),
  ).not.toThrow();
});
it('uses the sole shared AppError and sanitizes unexpected errors', async () => {
  expect(ServerError).toBe(AppError);
  const response = errorResponse(
    new Error('provider-key=secret and upstream headers'),
  );
  expect(response.status).toBe(502);
  expect(response.headers.get('cache-control')).toBe('no-store');
  expect(await response.json()).toEqual({
    error: {
      code: 'MODEL_FAILED',
      message: 'Request failed.',
      turnId: null,
      retryable: false,
    },
  });
});
it('serves Host-only, Node, no-store, sanitized capabilities through the actual route export', async () => {
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  vi.stubEnv('ANTHROPIC_API_KEY', '');
  vi.stubEnv('CLAUDE_MODEL', '');
  vi.stubEnv('DEEPGRAM_API_KEY', '');
  const route = await import('../../apps/web/app/api/capabilities/route');
  expect(route.runtime).toBe('nodejs');
  const response = await route.GET(
    new Request('http://localhost:3000/api/capabilities', {
      headers: { host: 'localhost:3000' },
    }),
  );
  expect(response.status).toBe(200);
  expect(response.headers.get('cache-control')).toBe('no-store');
  const body = await response.json();
  expect(body).toMatchObject({
    schemaVersion: 1,
    mode: 'live',
    turnsAvailable: false,
    speechAvailable: false,
  });
  expect(body).not.toHaveProperty('anthropicKey');
});
it('rejects bad capabilities Host before reading build metadata', async () => {
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  const route = await import('../../apps/web/app/api/capabilities/route');
  const { getRuntime } = await import('../../apps/web/server/runtime');
  const state = getRuntime();
  const metadata = vi.fn(() =>
    Promise.resolve({ mode: 'development' as const, buildId: null }),
  );
  Object.defineProperty(state, 'buildInfo', { get: metadata });
  const response = await route.GET(
    new Request('http://localhost:3000/api/capabilities', {
      headers: { host: 'evil:3000' },
    }),
  );
  expect(response.status).toBe(403);
  expect(await response.json()).toEqual({
    error: {
      code: 'ORIGIN_NOT_ALLOWED',
      message: 'Origin or Host is not allowed.',
      turnId: null,
      retryable: false,
    },
  });
  expect(metadata).not.toHaveBeenCalled();
});

it('preserves BUSY status from an old pool after the errors module reloads', async () => {
  const { getLeasePools } = await import('../../apps/web/server/turns/leases');
  const pools = getLeasePools();
  const first = pools.acquire('turn');
  const second = pools.acquire('turn');
  try {
    let failure: unknown;
    try {
      pools.acquire('turn');
    } catch (error) {
      failure = error;
    }
    vi.resetModules();
    const reloaded = await import('../../apps/web/server/http/errors');
    const response = reloaded.errorResponse(failure);
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({
      error: {
        code: 'BUSY',
        message: 'Busy. Ask again after active work settles.',
        turnId: null,
        retryable: true,
      },
    });
  } finally {
    first.release();
    second.release();
  }
});
