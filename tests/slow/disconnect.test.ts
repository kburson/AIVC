import { afterEach, expect, it } from 'vitest';
import { POST } from '../../apps/web/app/api/turn/route';
import { createRetrievalApp } from '../../apps/retrieval/src/http/app';
import { getRuntime } from '../../apps/web/server/runtime';
import type { ServerRuntime } from '../../apps/web/server/runtime';
import { loadConfig } from '../../apps/web/server/config';
import { createCapabilities } from '../../apps/web/server/capabilities';
import { LeasePools } from '../../apps/web/server/turns/leases';
import { decodeSse, assertTurnSequence } from '../../apps/web/shared/sse';
import {
  collect,
  deferred,
  nativeRound,
  ScriptedModel,
  round,
  tool,
  atlasCatalog,
} from '../helpers/scripted-providers';
const state = globalThis as typeof globalThis & {
  __aivcRuntimeV1?: ServerRuntime;
};
const previous = state.__aivcRuntimeV1;
const cleanup: Array<() => Promise<unknown>> = [];
afterEach(async () => {
  for (const fn of cleanup.splice(0)) await fn();
  if (previous) state.__aivcRuntimeV1 = previous;
  else delete state.__aivcRuntimeV1;
});
function setup(
  model?: ScriptedModel,
  url = 'http://127.0.0.1:1',
  timeout = 1000,
) {
  const config = loadConfig({
    NODE_ENV: 'test',
    AIVC_MODE: 'mock',
    BFF_ALLOWED_HOSTS: 'localhost:3000',
    BFF_ALLOWED_ORIGINS: 'http://localhost:3000',
    RETRIEVAL_BASE_URL: url,
    SPEECH_CHARS_PER_SECOND: '14',
    TURN_TIMEOUT_MS: String(timeout),
    RETRIEVAL_TIMEOUT_MS: '5000',
    SPEECH_TIMEOUT_MS: '20000',
  });
  const build = { mode: 'development' as const, buildId: null };
  const runtime: ServerRuntime = {
    config,
    capabilities: createCapabilities(config, build),
    adapters: model
      ? {
          model,
          transcribe: async () => {
            throw Error('Typed transcript called');
          },
        }
      : {},
    leasePools: new LeasePools(),
    buildInfo: Promise.resolve(build),
  };
  state.__aivcRuntimeV1 = runtime;
  return runtime;
}
function request(signal?: AbortSignal, text = 'What is the status of Atlas?') {
  const form = new FormData();
  form.set('turnId', crypto.randomUUID());
  form.set('history', '[]');
  form.set('text', text);
  return new Request('http://localhost:3000/api/turn', {
    method: 'POST',
    body: form,
    headers: { host: 'localhost:3000', origin: 'http://localhost:3000' },
    signal,
  });
}
async function* bytes(response: Response) {
  const reader = response.body!.getReader();
  try {
    while (true) {
      const p = await reader.read();
      if (p.done) return;
      yield p.value;
    }
  } finally {
    reader.releaseLock();
  }
}
async function emitted(response: Response) {
  return collect(decodeSse(bytes(response)));
}
function delayed(gate: { promise: Promise<void> }) {
  return async function* () {
    yield { type: 'text' as const, text: 'Early' };
    await gate.promise;
    yield nativeRound({ text: 'Early' });
  };
}
const ticks = () => new Promise<void>((r) => setImmediate(r));
it('actual POST with production mock adapter retrieves validated projects over real Fastify HTTP', async () => {
  const app = createRetrievalApp();
  let lookups = 0;
  app.addHook('onRequest', async () => {
    lookups++;
  });
  const url = await app.listen({ host: '127.0.0.1', port: 0 });
  cleanup.push(() => app.close());
  setup(undefined, url);
  const res = await POST(request());
  expect(res.status).toBe(200);
  expect(res.headers.get('content-type')).toContain('text/event-stream');
  expect(res.headers.get('cache-control')).toBe('no-cache, no-transform');
  const out = await emitted(res);
  assertTurnSequence(out);
  expect(out[0]).toMatchObject({
    type: 'turn.accepted',
    data: { mode: 'mock' },
  });
  expect(out.find((e) => e.type === 'tool.completed')).toMatchObject({
    data: { result: atlasCatalog },
  });
  expect(out.at(-1)).toMatchObject({ data: { status: 'complete' } });
  expect(lookups).toBe(1);
  expect(getRuntime().capabilities.search.state).toBe('unavailable');
});
it('sends first delta before a delayed native final round completes', async () => {
  const gate = deferred();
  const model = new ScriptedModel([delayed(gate)]);
  setup(model);
  const res = await POST(request());
  const reader = res.body!.getReader();
  let text = '';
  for (let i = 0; i < 3; i++)
    text += new TextDecoder().decode((await reader.read()).value);
  expect(text).toContain('Early');
  expect(text).not.toContain('turn.completed');
  gate.resolve();
  reader.releaseLock();
  const remaining = await emittedTail(res);
  expect(remaining).toContain('turn.completed');
  expect(model.inputs).toHaveLength(1);
});
async function emittedTail(res: Response) {
  let s = '';
  for await (const b of bytes(res)) s += new TextDecoder().decode(b);
  return s;
}
it('reader cancellation aborts producer but retains its slot until the ignored upstream settles', async () => {
  const a = deferred(),
    b = deferred();
  const model = new ScriptedModel([
    delayed(a),
    delayed(b),
    round({ text: 'Recovered' }),
  ]);
  setup(model);
  const first = await POST(request());
  const reader = first.body!.getReader();
  for (let i = 0; i < 3; i++) await reader.read();
  await reader.cancel();
  expect(model.signals[0].aborted).toBe(true);
  const second = await POST(request());
  expect(second.status).toBe(200);
  const third = await POST(request());
  expect(third.status).toBe(429);
  expect(await third.json()).toMatchObject({
    error: { code: 'BUSY', retryable: true },
  });
  expect(model.inputs).toHaveLength(2);
  a.resolve();
  await ticks();
  const recovered = await POST(request());
  expect(recovered.status).toBe(200);
  expect((await emitted(recovered)).at(-1)).toMatchObject({
    data: { status: 'complete' },
  });
  expect(model.inputs).toHaveLength(3);
  await second.body!.cancel();
  b.resolve();
  await ticks();
});
it('request abort has no paid replay, no completion, and holds lease through ignored upstream', async () => {
  const gate = deferred();
  const model = new ScriptedModel([delayed(gate)]);
  setup(model);
  const caller = new AbortController();
  const res = await POST(request(caller.signal));
  const reader = res.body!.getReader();
  for (let i = 0; i < 3; i++) await reader.read();
  caller.abort();
  let rest = '';
  while (true) {
    const p = await reader.read();
    if (p.done) break;
    rest += new TextDecoder().decode(p.value);
  }
  expect(rest).toContain('turn.failed');
  expect(rest).not.toContain('turn.completed');
  expect(model.signals[0].aborted).toBe(true);
  expect(model.inputs).toHaveLength(1);
  gate.resolve();
  await ticks();
});
it('turn deadline closes failed SSE but retains the lease until upstream settlement', async () => {
  const a = deferred(),
    b = deferred();
  const model = new ScriptedModel([delayed(a), delayed(b)]);
  setup(model, 'http://127.0.0.1:1', 40);
  const first = await POST(request());
  const out = await emitted(first);
  assertTurnSequence(out);
  expect(out.filter((e) => e.type === 'turn.failed')).toHaveLength(1);
  expect(out.at(-1)).toMatchObject({ data: { code: 'TURN_DEADLINE' } });
  expect(out.some((e) => e.type === 'turn.completed')).toBe(false);
  const second = await POST(request());
  expect(second.status).toBe(200);
  expect((await POST(request())).status).toBe(429);
  a.resolve();
  await second.body!.cancel();
  b.resolve();
  await ticks();
  expect(model.inputs).toHaveLength(2);
});
it('rejected Origin reads no body and invokes no upstream adapter', async () => {
  const model = new ScriptedModel([]);
  setup(model);
  const req = request();
  req.headers.set('origin', 'https://evil.test');
  let reads = 0;
  const original = req.body;
  Object.defineProperty(req, 'body', {
    get() {
      reads++;
      return original;
    },
  });
  const res = await POST(req);
  expect(res.status).toBe(403);
  expect(await res.json()).toMatchObject({
    error: { code: 'ORIGIN_NOT_ALLOWED', turnId: null },
  });
  expect(reads).toBe(0);
  expect(model.inputs).toHaveLength(0);
});
it('pre-aborted request reads no body and invokes no paid work', async () => {
  const model = new ScriptedModel([]);
  setup(model);
  const caller = new AbortController();
  caller.abort();
  const req = request(caller.signal);
  let reads = 0;
  const original = req.body;
  Object.defineProperty(req, 'body', {
    get() {
      reads++;
      return original;
    },
  });
  const res = await POST(req);
  expect(res.status).toBeGreaterThanOrEqual(400);
  expect(reads).toBe(0);
  expect(model.inputs).toHaveLength(0);
});
it('malformed pre-stream input uses common JSON without consuming model work', async () => {
  const model = new ScriptedModel([]);
  setup(model);
  const req = new Request('http://localhost:3000/api/turn', {
    method: 'POST',
    body: '{}',
    headers: {
      host: 'localhost:3000',
      origin: 'http://localhost:3000',
      'content-type': 'application/json',
    },
  });
  const res = await POST(req);
  expect(res.status).toBe(400);
  expect(await res.json()).toMatchObject({
    error: { code: 'INVALID_REQUEST', turnId: null, retryable: false },
  });
  expect(model.inputs).toHaveLength(0);
});
it('dispatched retrieval failure produces one failed terminal and no substitute catalog', async () => {
  const model = new ScriptedModel([
    round({ stop: 'tool_use', tools: [tool()] }),
  ]);
  setup(model);
  const out = await emitted(await POST(request()));
  assertTurnSequence(out);
  expect(out.at(-1)).toMatchObject({
    type: 'turn.failed',
    data: { code: 'RETRIEVAL_UNAVAILABLE' },
  });
  expect(out.filter((e) => e.type === 'turn.failed')).toHaveLength(1);
  expect(out.some((e) => e.type === 'tool.completed')).toBe(false);
});

it.each(['origin', 'host', 'body', 'aborted'] as const)(
  'cold live runtime rejects %s before Models or Messages HTTP',
  async (kind) => {
    const runtime = setup();
    runtime.config = {
      ...runtime.config,
      mode: 'live',
      anthropicKey: 'offline-test-key',
      claudeModel: 'offline',
    };
    runtime.capabilities = createCapabilities(runtime.config, {
      mode: 'development',
      buildId: null,
    });
    const original = globalThis.fetch;
    let upstream = 0;
    globalThis.fetch = async () => {
      upstream++;
      throw Error('Unexpected provider HTTP');
    };
    try {
      const caller = new AbortController();
      if (kind === 'aborted') caller.abort();
      const req =
        kind === 'body'
          ? new Request('http://localhost:3000/api/turn', {
              method: 'POST',
              body: '{}',
              headers: {
                host: 'localhost:3000',
                origin: 'http://localhost:3000',
                'content-type': 'application/json',
              },
            })
          : request(caller.signal);
      if (kind === 'origin') req.headers.set('origin', 'http://evil.test');
      if (kind === 'host') req.headers.set('host', 'evil.test');
      const res = await POST(req);
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.headers.get('content-type')).toContain('application/json');
      expect(upstream).toBe(0);
      expect(runtime.adapters).toEqual({});
    } finally {
      globalThis.fetch = original;
    }
  },
);
