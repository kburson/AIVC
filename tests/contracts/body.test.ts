import { afterEach, expect, it, vi } from 'vitest';
import {
  readBoundedBody,
  runAdmittedTurn,
} from '../../apps/web/server/http/body';
import { loadConfig } from '../../apps/web/server/config';
import { deadlineRemainingMs } from '../../apps/web/server/turns/deadline';
const cap = 2097152;
const env = {
  NODE_ENV: 'test' as const,
  BFF_ALLOWED_ORIGINS: 'http://localhost:3000',
  BFF_ALLOWED_HOSTS: 'localhost:3000',
  RETRIEVAL_BASE_URL: 'http://127.0.0.1:3001',
  SPEECH_CHARS_PER_SECOND: '14',
  TURN_TIMEOUT_MS: '60000',
  RETRIEVAL_TIMEOUT_MS: '5000',
  SPEECH_TIMEOUT_MS: '20000',
};
function request(
  stream: ReadableStream<Uint8Array>,
  extra: Record<string, string> = {},
) {
  return new Request('http://localhost:3000/api/turn', {
    method: 'POST',
    headers: {
      host: 'localhost:3000',
      origin: 'http://localhost:3000',
      ...extra,
    },
    body: stream,
    duplex: 'half',
  } as RequestInit);
}
afterEach(() => vi.useRealTimers());
it('counts the exact 2 MiB chunked body without trusting content-length', async () => {
  let at = 0;
  const chunks = [
    new Uint8Array(cap / 2).fill(1),
    new Uint8Array(cap / 2).fill(2),
  ];
  const req = request(
    new ReadableStream({
      pull(controller) {
        if (at < chunks.length) controller.enqueue(chunks[at++]);
        else controller.close();
      },
    }),
    { 'content-length': '1' },
  );
  const bytes = await readBoundedBody(req, cap, new AbortController().signal);
  expect(bytes.length).toBe(cap);
  expect(bytes[0]).toBe(1);
  expect(bytes[cap - 1]).toBe(2);
  expect(req.body?.locked).toBe(false);
});
it('cancels on the first excess chunk and returns BODY_TOO_LARGE/null', async () => {
  const cancel = vi.fn();
  let at = 0;
  const chunks = [new Uint8Array(cap), new Uint8Array([1])];
  const req = request(
    new ReadableStream({
      pull(controller) {
        controller.enqueue(chunks[at++]);
      },
      cancel,
    }),
    { 'content-length': '1' },
  );
  await expect(
    readBoundedBody(req, cap, new AbortController().signal),
  ).rejects.toMatchObject({
    httpStatus: 413,
    code: 'BODY_TOO_LARGE',
    turnId: null,
    retryable: false,
  });
  expect(cancel).toHaveBeenCalledTimes(1);
  expect(req.body?.locked).toBe(false);
});
it('does not let cancellation rejection replace a body limit error', async () => {
  const req = request(
    new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(cap + 1));
      },
      cancel() {
        return Promise.reject(new Error('late cancellation failure'));
      },
    }),
  );
  await expect(
    readBoundedBody(req, cap, new AbortController().signal),
  ).rejects.toMatchObject({ httpStatus: 413, code: 'BODY_TOO_LARGE' });
  expect(req.body?.locked).toBe(false);
});
it('preserves received bytes when a stream reuses its chunk buffer', async () => {
  const buffer = new Uint8Array([1, 2]);
  let at = 0;
  const req = request(
    new ReadableStream(
      {
        pull(controller) {
          if (at === 0) {
            controller.enqueue(buffer);
            at++;
          } else if (at === 1) {
            buffer.fill(3);
            controller.enqueue(buffer);
            at++;
          } else controller.close();
        },
      },
      { highWaterMark: 0 },
    ),
  );
  expect(await readBoundedBody(req, cap, new AbortController().signal)).toEqual(
    new Uint8Array([1, 2, 3, 3]),
  );
});
it('returns an empty body and refuses a pre-aborted read before body access', async () => {
  const empty = new Request('http://localhost:3000');
  expect(
    await readBoundedBody(empty, cap, new AbortController().signal),
  ).toEqual(new Uint8Array());
  const caller = new AbortController();
  caller.abort(new DOMException('Canceled', 'AbortError'));
  const getter = vi.fn(() => {
    throw new Error('must not read');
  });
  Object.defineProperty(empty, 'body', { get: getter });
  await expect(
    readBoundedBody(empty, cap, caller.signal),
  ).rejects.toMatchObject({ name: 'AbortError' });
  expect(getter).not.toHaveBeenCalled();
});
it('cancels a pending body read on caller abort and releases its reader', async () => {
  const cancel = vi.fn();
  const req = request(new ReadableStream({ pull() {}, cancel }));
  const caller = new AbortController();
  const reading = readBoundedBody(req, cap, caller.signal);
  const rejection = expect(reading).rejects.toMatchObject({
    name: 'AbortError',
  });
  caller.abort();
  await rejection;
  expect(cancel).toHaveBeenCalledTimes(1);
  expect(req.body?.locked).toBe(false);
});
it('times out a stalled admitted body with null id before any lease/upstream work', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
  const cancel = vi.fn();
  const req = request(new ReadableStream({ pull() {}, cancel }));
  const config = loadConfig({ ...env, TURN_TIMEOUT_MS: '25' });
  let leaseCalls = 0,
    providerCalls = 0;
  const running = runAdmittedTurn(req, config, async () => {
    leaseCalls++;
    providerCalls++;
  });
  const result = expect(running.result).rejects.toMatchObject({
    httpStatus: 504,
    code: 'TURN_DEADLINE',
    turnId: null,
  });
  await vi.advanceTimersByTimeAsync(25);
  await result;
  await running.settled;
  expect(cancel).toHaveBeenCalledTimes(1);
  expect(leaseCalls).toBe(0);
  expect(providerCalls).toBe(0);
  expect(req.body?.locked).toBe(false);
});
it('imports frozen parsing after bounded read and retains the original deadline for work', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
  const form = new FormData();
  form.set('turnId', '11111111-1111-4111-8111-111111111111');
  form.set('history', '[]');
  form.set('text', 'hello');
  const req = new Request('http://localhost:3000/api/turn', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000', host: 'localhost:3000' },
    body: form,
  });
  let remaining = 0;
  const running = runAdmittedTurn(
    req,
    loadConfig({ ...env, TURN_TIMEOUT_MS: '100' }),
    async (input, signal) => {
      expect(input).toEqual({
        turnId: '11111111-1111-4111-8111-111111111111',
        history: [],
        kind: 'text',
        text: 'hello',
      });
      await new Promise((resolve) => setTimeout(resolve, 20));
      remaining = deadlineRemainingMs(signal);
      if (input.kind !== 'text') throw new Error('Expected a typed turn.');
      return input.text;
    },
  );
  await vi.advanceTimersByTimeAsync(20);
  expect(await running.result).toBe('hello');
  await running.settled;
  expect(remaining).toBeGreaterThan(0);
  expect(remaining).toBeLessThanOrEqual(80);
});
it('does not call work after frozen validation rejects extra multipart input', async () => {
  const form = new FormData();
  form.set('turnId', '11111111-1111-4111-8111-111111111111');
  form.set('history', '[]');
  form.set('text', 'hello');
  form.set('tools', 'untrusted');
  const req = new Request('http://localhost:3000/api/turn', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000', host: 'localhost:3000' },
    body: form,
  });
  const work = vi.fn();
  const running = runAdmittedTurn(req, loadConfig(env), work);
  await expect(running.result).rejects.toMatchObject({
    httpStatus: 400,
    code: 'INVALID_REQUEST',
  });
  await running.settled;
  expect(work).not.toHaveBeenCalled();
});
