import { PipelinePools } from '../../apps/orchestrator/src/resources.js';
import { expect, it } from 'vitest';
import { speechResponse } from '../../apps/web/server/http/speech-response';
import { loadConfig } from '../../apps/web/server/config';
import { createCapabilities } from '../../apps/web/server/capabilities';
import { LeasePools } from '../../apps/web/server/turns/leases';
import type { ServerRuntime } from '../../apps/web/server/runtime';
import type { SpeechAdapter } from '../../apps/web/server/providers/contracts';
const id = '00000000-0000-0000-0000-000000000001';
function runtime(speech?: SpeechAdapter): ServerRuntime {
  const config = loadConfig({
    NODE_ENV: 'test',
    AIVC_MODE: 'mock',
    BFF_ALLOWED_HOSTS: 'localhost:3000',
    BFF_ALLOWED_ORIGINS: 'http://localhost:3000',
    RETRIEVAL_BASE_URL: 'http://localhost:3001',
    SPEECH_CHARS_PER_SECOND: '14',
    TURN_TIMEOUT_MS: '60000',
    RETRIEVAL_TIMEOUT_MS: '5000',
    SPEECH_TIMEOUT_MS: '20000',
  });
  return {
    config,
    capabilities: createCapabilities(config, {
      mode: 'development',
      buildId: null,
    }),
    adapters: speech ? { speech } : {},
    leasePools: new LeasePools(),
    pipelines: new PipelinePools(),
    buildInfo: Promise.resolve({ mode: 'development', buildId: null }),
  };
}
function request(
  body: unknown = { turnId: id, segmentId: 's1', text: 'Hello' },
  origin = 'http://localhost:3000',
) {
  return new Request('http://localhost:3000/api/speech', {
    method: 'POST',
    headers: {
      host: 'localhost:3000',
      origin,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}
const format = {
  encoding: 'pcm_s16le' as const,
  sampleRate: 24000 as const,
  channels: 1 as const,
};
const adapter = (synthesize: SpeechAdapter['synthesize']): SpeechAdapter => ({
  transcribe: async () => '',
  synthesize,
});
it('rejects origin before body/provider work', async () => {
  let reads = 0,
    calls = 0;
  const body = new ReadableStream(
    {
      pull() {
        reads++;
      },
    },
    { highWaterMark: 0 },
  );
  const req = new Request('http://localhost:3000/api/speech', {
    method: 'POST',
    headers: {
      host: 'localhost:3000',
      origin: 'http://evil.test',
      'content-type': 'application/json',
    },
    body,
    duplex: 'half',
  } as RequestInit);
  const r = await speechResponse(
    req,
    runtime(
      adapter(async () => {
        calls++;
        throw Error();
      }),
    ),
  );
  expect(r.status).toBe(403);
  expect(reads).toBe(0);
  expect(calls).toBe(0);
});
it.each([
  { turnId: 'bad', segmentId: 'x', text: 'a' },
  { turnId: id, segmentId: '', text: 'a' },
  { turnId: id, segmentId: 'x'.repeat(81), text: 'a' },
  { turnId: id, segmentId: 'x', text: ' ' },
  { turnId: id, segmentId: 'x', text: 'a'.repeat(85) },
  { turnId: id, segmentId: 'x', text: 'a', model: 'untrusted' },
])('rejects invalid frozen speech input %j', async (body) => {
  expect((await speechResponse(request(body), runtime())).status).toBe(400);
});
it('caps measured JSON before parsing', async () => {
  expect(
    (await speechResponse(request({ text: 'x'.repeat(9000) }), runtime()))
      .status,
  ).toBe(413);
});
it('normalizes streamed PCM headers and preserves incremental bytes', async () => {
  let c!: ReadableStreamDefaultController<Uint8Array>;
  const r = await speechResponse(
    request(),
    runtime(
      adapter(async () => ({
        format,
        stream: new ReadableStream({
          start(controller) {
            c = controller;
            c.enqueue(Uint8Array.of(1, 2));
          },
        }),
      })),
    ),
  );
  expect(r.status).toBe(200);
  expect(r.headers.get('content-type')).toBe('application/octet-stream');
  expect(r.headers.get('x-audio-encoding')).toBe('pcm_s16le');
  expect(r.headers.get('x-audio-sample-rate')).toBe('24000');
  expect(r.headers.get('x-audio-channels')).toBe('1');
  expect(r.headers.get('cache-control')).toBe('no-store');
  const reader = r.body!.getReader();
  expect((await reader.read()).value).toEqual(Uint8Array.of(1, 2));
  c.close();
  expect((await reader.read()).done).toBe(true);
});
it('holds two upstream slots through deferred cancellation settlement', async () => {
  let release!: () => void;
  const pending = new Promise<void>((r) => (release = r));
  let canceled = 0;
  const rt = runtime(
    adapter(async () => ({
      format,
      stream: new ReadableStream({
        start(c) {
          c.enqueue(Uint8Array.of(1, 2));
        },
        cancel() {
          canceled++;
          return pending;
        },
      }),
    })),
  );
  const a = await speechResponse(request(), rt),
    b = await speechResponse(request(), rt);
  expect((await speechResponse(request(), rt)).status).toBe(429);
  const cancel = a.body!.cancel();
  await new Promise((r) => setTimeout(r, 0));
  expect(canceled).toBe(1);
  expect((await speechResponse(request(), rt)).status).toBe(429);
  release();
  await cancel;
  await b.body!.cancel();
  await new Promise((r) => setTimeout(r, 0));
  const next = await speechResponse(request(), rt);
  expect(next.status).toBe(200);
  await next.body!.cancel();
});
it('returns JSON if upstream fails before PCM', async () => {
  const rt = runtime(
    adapter(async () => ({
      format,
      stream: new ReadableStream({
        start(c) {
          c.error(Error('private'));
        },
      }),
    })),
  );
  const r = await speechResponse(request(), rt);
  expect(r.status).toBe(502);
  expect(await r.json()).toMatchObject({
    error: { code: 'SPEECH_FAILED', turnId: id },
  });
});
it('errors PCM after the deadline instead of appending JSON', async () => {
  const rt = runtime(
    adapter(async () => ({
      format,
      stream: new ReadableStream({
        start(c) {
          c.enqueue(Uint8Array.of(1, 2));
        },
      }),
    })),
  );
  rt.config.speechTimeoutMs = 15;
  const r = await speechResponse(request(), rt);
  const reader = r.body!.getReader();
  await reader.read();
  await expect(reader.read()).rejects.toBeDefined();
});
it('rejects unavailable speech without provider work', async () => {
  let calls = 0;
  const rt = runtime(
    adapter(async () => {
      calls++;
      throw Error();
    }),
  );
  rt.capabilities.speechAvailable = false;
  expect((await speechResponse(request(), rt)).status).toBe(502);
  expect(calls).toBe(0);
});
it('applies hard120 even when effective cap reaches120', async () => {
  const rt = runtime();
  rt.config.segmentChars = 120;
  expect(
    (
      await speechResponse(
        request({ turnId: id, segmentId: 'x', text: 'a'.repeat(121) }),
        rt,
      )
    ).status,
  ).toBe(400);
});
it('measures exactly8KiB including JSON whitespace', async () => {
  const raw = JSON.stringify({ turnId: id, segmentId: 's', text: 'hello' });
  const req = (n: number) =>
    new Request('http://localhost:3000/api/speech', {
      method: 'POST',
      headers: {
        host: 'localhost:3000',
        origin: 'http://localhost:3000',
        'content-type': 'application/json',
      },
      body: raw.padEnd(n, ' '),
    });
  const r = await speechResponse(req(8192), runtime());
  expect(r.status).toBe(200);
  await r.body!.cancel();
  expect((await speechResponse(req(8193), runtime())).status).toBe(413);
});
it('retains lease when pending upstream read reaches EOF during deferred cancel', async () => {
  let finish!: () => void;
  const canceled = new Promise<void>((r) => (finish = r));
  const rt = runtime(
    adapter(async () => ({
      format,
      stream: new ReadableStream({
        start(c) {
          c.enqueue(Uint8Array.of(1, 2));
        },
        cancel() {
          return canceled;
        },
      }),
    })),
  );
  const a = await speechResponse(request(), rt);
  const b = await speechResponse(request(), rt);
  const reader = a.body!.getReader();
  await reader.read();
  const tail = reader.read();
  await new Promise((r) => setTimeout(r, 0));
  const stopping = reader.cancel();
  await tail;
  expect((await speechResponse(request(), rt)).status).toBe(429);
  finish();
  await stopping;
  await b.body!.cancel();
});
it('terminates an already started PCM stream on upstream failure', async () => {
  let c!: ReadableStreamDefaultController<Uint8Array>;
  const r = await speechResponse(
    request(),
    runtime(
      adapter(async () => ({
        format,
        stream: new ReadableStream({
          start(controller) {
            c = controller;
            c.enqueue(Uint8Array.of(1, 2));
          },
        }),
      })),
    ),
  );
  const reader = r.body!.getReader();
  await reader.read();
  c.error(Error('secret'));
  await expect(reader.read()).rejects.toMatchObject({ code: 'SPEECH_FAILED' });
});
