import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Playback } from '../../apps/web/client/voice/playback';
import {
  SpeechQueue,
  synthesizeSpeech,
} from '../../apps/web/client/voice/speech-queue';
import {
  AudioClock,
  pcm,
  settle,
  speechResponse,
  token,
} from './audio-fixture';
let queues: SpeechQueue[] = [];
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  queues.forEach((q) => q.dispose());
  queues = [];
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
function setup(
  synthesize: (
    input: { text: string; segmentId: string; turnId: string },
    signal: AbortSignal,
  ) => Promise<Response>,
  cap = 84,
) {
  const clock = new AudioClock();
  const statuses: string[] = [];
  let current = token;
  const playback = new Playback(clock.context(), (t) => t === current);
  const queue = new SpeechQueue({
    playback,
    synthesize,
    segmentChars: cap,
    isCurrent: (t) => t === current,
    onStatus: (_t, _status, reason) => {
      if (reason) statuses.push(reason);
    },
    now: () => Date.now(),
  });
  queues.push(queue);
  return {
    clock,
    playback,
    queue,
    statuses,
    setCurrent: (t: typeof token) => (current = t),
  };
}
it('speaks before model completion, promptly drains one active body and eventually plays every queued sentence at low water', async () => {
  let calls = 0,
    active = 0,
    maxActive = 0,
    drained = false;
  const { clock, playback, queue } = setup(async () => {
    calls++;
    active++;
    maxActive = Math.max(maxActive, active);
    let part = 0;
    return speechResponse(
      new ReadableStream({
        pull(c) {
          if (part++ === 0) c.enqueue(pcm(3));
          else if (part === 2) c.enqueue(pcm(3));
          else {
            active--;
            drained = true;
            c.close();
          }
        },
      }),
    );
  });
  queue.accept(token, 'First sentence. Second sentence. Third sentence. Tail');
  await settle();
  expect(calls).toBe(1);
  expect(drained).toBe(true);
  expect(playback.outstandingSeconds()).toBeCloseTo(6);
  queue.flush(token);
  await vi.advanceTimersByTimeAsync(25);
  expect(calls).toBe(1);
  let maximum = playback.outstandingSeconds();
  for (let i = 0; i < 8; i++) {
    clock.currentTime += 4.1;
    await vi.advanceTimersByTimeAsync(50);
    maximum = Math.max(maximum, playback.outstandingSeconds());
  }
  expect(calls).toBe(4);
  expect(maxActive).toBe(1);
  expect(maximum).toBeLessThanOrEqual(10);
  expect(clock.buffers.reduce((n, b) => n + b.length / 24000, 0)).toBe(24);
  expect(playback.outstandingSeconds()).toBe(0);
});
it('does not admit while tentative, then wakes immediately on clear', async () => {
  let calls = 0;
  const { queue } = setup(async () => {
    calls++;
    return speechResponse(pcm(0.1));
  });
  queue.setTentative(token, true);
  queue.accept(token, 'First. Next');
  await settle();
  expect(calls).toBe(0);
  queue.setTentative(token, false);
  await settle();
  expect(calls).toBe(1);
});
it('tears down all audio and aborts active synthesis on actual response overflow, then recovers a later generation', async () => {
  let signal!: AbortSignal;
  let calls = 0;
  const { clock, playback, queue, statuses, setCurrent } = setup(
    async (_i, s) => {
      signal = s;
      calls++;
      return speechResponse(pcm(calls === 1 ? 10.1 : 0.1));
    },
  );
  queue.accept(token, 'First. Next');
  await settle();
  expect(statuses).toContain('AUDIO_OVERFLOW');
  expect(signal.aborted).toBe(true);
  expect(playback.outstandingSeconds()).toBe(0);
  expect(clock.sources.every((s) => s.stopped)).toBe(true);
  const next = { ...token, generation: 2 };
  setCurrent(next);
  queue.accept(next, 'Recovered. Next');
  await settle();
  expect(calls).toBe(2);
  expect(playback.outstandingSeconds()).toBeGreaterThan(0);
});
it('counts raw scanner prefixes plus unsent text and clears pending overflow while admitted audio finishes', async () => {
  let calls = 0;
  const { playback, queue, statuses } = setup(async () => {
    calls++;
    return speechResponse(pcm(3));
  });
  queue.accept(token, 'First. Next');
  await settle();
  queue.accept(token, 'x'.repeat(2400));
  expect(statuses).toContain('SPEECH_TEXT_OVERFLOW');
  expect(playback.outstandingSeconds()).toBeGreaterThan(0);
  queue.flush(token);
  await settle();
  expect(calls).toBe(1);
});
it('cancels stale byte callbacks and unsent text without changing the next generation', async () => {
  let output!: ReadableStreamDefaultController<Uint8Array>;
  const { clock, queue, setCurrent } = setup(async () =>
    speechResponse(
      new ReadableStream({
        start(c) {
          output = c;
        },
      }),
    ),
  );
  queue.accept(token, 'Old. Next');
  await settle();
  const next = { ...token, generation: 2 };
  queue.cancel(token, 'TURN_INTERRUPTED');
  setCurrent(next);
  try {
    output.enqueue(pcm(1));
  } catch {}
  await settle();
  expect(clock.sources).toHaveLength(0);
});
it('rejects dangling PCM, metadata errors and fetch failures visibly while preserving text ownership', async () => {
  for (const response of [
    speechResponse(Uint8Array.of(1)),
    new Response(pcm(0.1)),
    new Response(JSON.stringify({ error: { code: 'SPEECH_BUSY' } }), {
      status: 429,
    }),
  ]) {
    const { queue, statuses, playback } = setup(async () => response);
    queue.accept(token, 'Hello. Next');
    await settle();
    expect(statuses.length).toBeGreaterThan(0);
    expect(playback.outstandingSeconds()).toBe(0);
  }
});
it('omits overlong tokens with a visible reason without exceeding the effective segment cap', async () => {
  const texts: string[] = [];
  const { queue, statuses } = setup(async (i) => {
    texts.push(i.text);
    return speechResponse(pcm(0.1));
  }, 10);
  queue.accept(token, 'One two three four. abcdefghijklmnop. End');
  queue.flush(token);
  await settle();
  expect(texts.every((t) => t.length <= 10)).toBe(true);
  expect(statuses).toContain('SPEECH_TOKEN_TOO_LONG');
});
it('sends only same-origin bounded speech input without automatic retries', async () => {
  let requests = 0;
  vi.stubGlobal('fetch', async (url: string, options: RequestInit) => {
    requests++;
    expect(url).toBe('/api/speech');
    expect(JSON.parse(options.body as string)).toEqual({
      turnId: token.turnId,
      segmentId: '1',
      text: 'Hello.',
    });
    expect(options.signal).toBeInstanceOf(AbortSignal);
    return speechResponse(pcm(0.1));
  });
  await synthesizeSpeech(
    { turnId: token.turnId, segmentId: '1', text: 'Hello.' },
    new AbortController().signal,
  );
  expect(requests).toBe(1);
});
it('stops every already-scheduled source before accepting excess active-response bytes even after clock progress', async () => {
  let pulls = 0;
  const clock = new AudioClock();
  const playback = new Playback(clock.context(), () => true);
  const reasons: string[] = [];
  const queue = new SpeechQueue({
    playback,
    segmentChars: 84,
    isCurrent: () => true,
    onStatus: (_t, _s, r) => {
      if (r) reasons.push(r);
    },
    synthesize: async () =>
      speechResponse(
        new ReadableStream({
          pull(c) {
            if (pulls++ === 0) c.enqueue(pcm(6));
            else if (pulls === 2) {
              clock.currentTime = 5;
              c.enqueue(pcm(5));
            } else c.close();
          },
        }),
      ),
  });
  queues.push(queue);
  queue.accept(token, 'Hello. Next');
  await settle();
  expect(reasons).toContain('AUDIO_OVERFLOW');
  expect(clock.sources).toHaveLength(1);
  expect(clock.sources[0].stopped).toBe(true);
  expect(playback.outstandingSeconds()).toBe(0);
});
it('cancels an invalid metadata body instead of leaving the response stream open', async () => {
  let canceled = false;
  const { queue, statuses } = setup(
    async () =>
      new Response(
        new ReadableStream({
          cancel() {
            canceled = true;
          },
        }),
        { headers: { 'content-type': 'application/json' } },
      ),
  );
  queue.accept(token, 'Hello. Next');
  await settle();
  expect(statuses).toContain('SPEECH_FAILED');
  expect(canceled).toBe(true);
});
it('finishes the already-admitted body after text overflow while rejecting future speech', async () => {
  let body!: ReadableStreamDefaultController<Uint8Array>;
  let calls = 0;
  const { queue, playback, statuses } = setup(async () => {
    calls++;
    return speechResponse(
      new ReadableStream({
        start(c) {
          body = c;
        },
      }),
    );
  });
  queue.accept(token, 'Hello. Next');
  await settle();
  body.enqueue(pcm(1));
  await settle();
  queue.accept(token, 'x'.repeat(2400));
  body.enqueue(pcm(1));
  body.close();
  await settle();
  expect(statuses).toContain('SPEECH_TEXT_OVERFLOW');
  expect(playback.outstandingSeconds()).toBeCloseTo(2);
  expect(calls).toBe(1);
});
