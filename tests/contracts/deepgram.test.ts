import { expect, it } from 'vitest';
import {
  createDeepgramAdapter,
  isExpectedPcmMime,
} from '../../apps/web/server/providers/deepgram';
import { loadConfig } from '../../apps/web/server/config';
import { runWithDeadline } from '../../apps/web/server/turns/deadline';
export const config = () =>
  loadConfig({
    NODE_ENV: 'test',
    AIVC_MODE: 'live',
    BFF_ALLOWED_HOSTS: 'localhost:3000',
    BFF_ALLOWED_ORIGINS: 'http://localhost:3000',
    RETRIEVAL_BASE_URL: 'http://localhost:3001',
    SPEECH_CHARS_PER_SECOND: '14',
    TURN_TIMEOUT_MS: '90000',
    RETRIEVAL_TIMEOUT_MS: '5000',
    SPEECH_TIMEOUT_MS: '40000',
    DEEPGRAM_API_KEY: 'test-only',
    DEEPGRAM_STT_MODEL: 'configured-stt',
    DEEPGRAM_TTS_MODEL: 'configured-tts',
  });
const input = {
  turnId: '00000000-0000-0000-0000-000000000001',
  segmentId: 's1',
  text: 'Hello',
};
const signal = () => new AbortController().signal;
it.each([
  'audio/l16',
  'Audio/L16; rate=24000; channels=1',
  'audio/l16;rate="24000"',
])('accepts exact PCM metadata %s', (value) =>
  expect(isExpectedPcmMime(value)).toBe(true),
);
it.each([
  'audio/l16evil',
  'application/json',
  'audio/l16;rate=16000',
  'audio/l16;channels=2',
  'audio/l16;rate=24000;RATE=24000',
  'audio/l16;broken',
  'audio/l16;rate=',
  'audio/l16;rate="24000',
  'audio/l16;channels=1;channels=1',
])('rejects invalid PCM metadata %s', (value) =>
  expect(isExpectedPcmMime(value)).toBe(false),
);
it('uploads WAV with configured model and trims recognized text', async () => {
  let seen: Request | undefined;
  const adapter = createDeepgramAdapter(config(), async (url, init) => {
    seen = new Request(url, init);
    return Response.json({
      results: { channels: [{ alternatives: [{ transcript: ' hello ' }] }] },
    });
  });
  expect(await adapter.transcribe(Uint8Array.of(1, 2), signal())).toBe('hello');
  expect(new URL(seen!.url).searchParams.get('model')).toBe('configured-stt');
  expect(seen!.headers.get('content-type')).toContain('audio/wav');
  expect([...new Uint8Array(await seen!.arrayBuffer())]).toEqual([1, 2]);
});
it.each(['', '  '])('preserves valid empty transcript %j', async (text) => {
  const a = createDeepgramAdapter(config(), async () =>
    Response.json({
      results: { channels: [{ alternatives: [{ transcript: text }] }] },
    }),
  );
  expect(await a.transcribe(new Uint8Array(), signal())).toBe('');
});
it.each([
  {},
  { request_id: 'accepted' },
  { results: { channels: [] } },
  { results: { channels: [{ alternatives: [{ transcript: 2 }] }] } },
])('rejects malformed transcription instead of no-speech %j', async (body) => {
  const a = createDeepgramAdapter(config(), async () => Response.json(body));
  await expect(a.transcribe(new Uint8Array(), signal())).rejects.toMatchObject({
    code: 'STT_FAILED',
  });
});
it.each([429, 502])('never replays provider status %i', async (status) => {
  let calls = 0;
  const a = createDeepgramAdapter(config(), async () => {
    calls++;
    return Response.json({ error: 'secret-provider-error' }, { status });
  });
  await expect(a.synthesize(input, signal())).rejects.toBeDefined();
  expect(calls).toBe(1);
});
it('streams first PCM before deferred tail and requests exact fixed format', async () => {
  let c!: ReadableStreamDefaultController<Uint8Array>;
  let seen!: Request;
  const a = createDeepgramAdapter(config(), async (url, init) => {
    seen = new Request(url, init);
    return new Response(
      new ReadableStream({
        start(controller) {
          c = controller;
          c.enqueue(Uint8Array.of(1, 2));
        },
      }),
      { headers: { 'content-type': 'audio/l16' } },
    );
  });
  const out = await a.synthesize(input, signal());
  const reader = out.stream.getReader();
  expect((await reader.read()).value).toEqual(Uint8Array.of(1, 2));
  expect(out.format).toEqual({
    encoding: 'pcm_s16le',
    sampleRate: 24000,
    channels: 1,
  });
  const q = new URL(seen.url).searchParams;
  expect([
    q.get('model'),
    q.get('encoding'),
    q.get('sample_rate'),
    q.get('container'),
  ]).toEqual(['configured-tts', 'linear16', '24000', 'none']);
  expect(await seen.json()).toEqual({ text: 'Hello' });
  c.close();
  await reader.read();
});
it.each(['application/json', 'audio/l16;rate=16000'])(
  'cancels unacceptable successful body %s',
  async (mime) => {
    let canceled = false;
    const a = createDeepgramAdapter(
      config(),
      async () =>
        new Response(
          new ReadableStream({
            cancel() {
              canceled = true;
            },
          }),
          { headers: { 'content-type': mime } },
        ),
    );
    await expect(a.synthesize(input, signal())).rejects.toMatchObject({
      code: 'SPEECH_FAILED',
    });
    expect(canceled).toBe(true);
  },
);
it('rejects missing synthesis body', async () => {
  const a = createDeepgramAdapter(
    config(),
    async () =>
      new Response(null, { headers: { 'content-type': 'audio/l16' } }),
  );
  await expect(a.synthesize(input, signal())).rejects.toMatchObject({
    code: 'SPEECH_FAILED',
  });
});
it('does not start paid fetch after cancellation', async () => {
  let calls = 0;
  const a = createDeepgramAdapter(config(), async () => {
    calls++;
    return Response.json({});
  });
  const c = new AbortController();
  c.abort();
  await expect(a.transcribe(new Uint8Array(), c.signal)).rejects.toBeDefined();
  expect(calls).toBe(0);
});
it('propagates a smaller shared deadline into the real fetch signal', async () => {
  let aborted = false;
  const a = createDeepgramAdapter(
    config(),
    async (_url, init) =>
      new Promise((_resolve, reject) => {
        init!.signal!.addEventListener('abort', () => {
          aborted = true;
          reject(init!.signal!.reason);
        });
      }),
  );
  const task = runWithDeadline(15, signal(), (s) =>
    a.transcribe(new Uint8Array(), s),
  );
  await expect(task.result).rejects.toBeDefined();
  await task.settled;
  expect(aborted).toBe(true);
});
it.each([429, 502])(
  'never replays STT status %i or exposes provider payload',
  async (status) => {
    let calls = 0;
    const a = createDeepgramAdapter(config(), async () => {
      calls++;
      return Response.json({ error: 'private-test-payload' }, { status });
    });
    try {
      await a.transcribe(new Uint8Array(), signal());
      throw Error('Expected rejection');
    } catch (error) {
      expect(error).toMatchObject({
        code: status === 429 ? 'RATE_LIMITED' : 'STT_FAILED',
      });
      expect((error as Error).message).not.toContain('private-test-payload');
    }
    expect(calls).toBe(1);
  },
);
it('honors nondefault configured SDK timeout while shared deadline is longer', async () => {
  const cfg = config();
  cfg.turnTimeoutMs = 12;
  let observed = false;
  const a = createDeepgramAdapter(
    cfg,
    async (_url, init) =>
      new Promise((_resolve, reject) => {
        init!.signal!.addEventListener('abort', () => {
          observed = true;
          reject(init!.signal!.reason);
        });
      }),
  );
  await expect(a.transcribe(new Uint8Array(), signal())).rejects.toMatchObject({
    code: 'STT_FAILED',
  });
  expect(observed).toBe(true);
});
