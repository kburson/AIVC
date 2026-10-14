// @vitest-environment jsdom
// Real capture/controller/queue/playback; only native audio/VAD and transport are controlled.
import { createElement } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type {
  CaptureToken,
  VadCallbacks,
} from '../../apps/web/client/voice/vad-adapter';
import type { startTurn } from '../../apps/web/client/turn-stream';
import type {
  HistoryMessage,
  TurnEvent,
} from '../../apps/web/shared/contracts';
import { AudioClock, pcm, settle, speechResponse } from './audio-fixture';
import { mockCapabilities } from '../helpers/wire-contract-fixtures';
const boundary = vi.hoisted(() => ({ createVad: vi.fn() }));
vi.mock('../../apps/web/client/voice/vad-adapter', async (original) => ({
  ...(await original<
    typeof import('../../apps/web/client/voice/vad-adapter')
  >()),
  createVad: boundary.createVad,
}));
import Conversation from '../../apps/web/components/Conversation';
import { Interruption } from '../../apps/web/client/voice/interruption';
import { TurnController } from '../../apps/web/client/turn-controller';
import { HistoryStore } from '../../apps/web/client/history';
import { Playback } from '../../apps/web/client/voice/playback';
import { wireEvents } from '../helpers/wire-contract-fixtures';
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
let contexts: AudioClock[], callbacks: VadCallbacks;
let requests: Array<{
  signal: AbortSignal;
  history: HistoryMessage[];
  input: { text?: string; wav?: Blob };
  finish: () => void;
}>;
let speechSignals: AbortSignal[];
let holdSpeech: ReturnType<typeof deferred> | undefined;
let noText = false;
const internal = (id = 1): CaptureToken =>
  Object.freeze({ epoch: 90, utteranceId: id, intentVersion: 90 });
const transport: typeof startTurn = async function* (
  token,
  input,
  history,
  signal,
) {
  const done = deferred(),
    index = requests.length;
  requests.push({ signal, history, input, finish: done.resolve });
  const name = index === 0 ? 'Atlas' : 'Beacon';
  const events: TurnEvent[] = [
    {
      schemaVersion: 1,
      turnId: token.turnId,
      seq: 0,
      type: 'turn.accepted',
      data: { mode: 'mock' },
    },
  ];
  if (input.wav)
    events.push({
      schemaVersion: 1,
      turnId: token.turnId,
      seq: events.length,
      type: 'transcript.final',
      data: { text: name + ' question' },
    });
  if (!noText)
    events.push({
      schemaVersion: 1,
      turnId: token.turnId,
      seq: events.length,
      type: 'answer.delta',
      data: { text: name + ' answer. Next' },
    });
  yield* events;
  await done.promise; // Deliberately ignores abort to exercise stale completion.
  yield {
    schemaVersion: 1,
    turnId: token.turnId,
    seq: events.length,
    type: 'turn.completed',
    data: { status: 'complete', text: noText ? '' : name + ' answer. Next' },
  };
};
beforeEach(() => {
  contexts = [];
  requests = [];
  speechSignals = [];
  noText = false;
  holdSpeech = undefined;
  class Context extends AudioClock {
    constructor() {
      super();
      contexts.push(this);
    }
  }
  vi.stubGlobal('AudioContext', Context);
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: {
      getUserMedia: async () => ({
        getTracks: () => [{ readyState: 'live', stop() {} }],
      }),
    },
  });
  boundary.createVad.mockReset();
  boundary.createVad.mockImplementation(async (_context, acquire, stop, cb) => {
    callbacks = cb;
    const stream = await acquire();
    return {
      start: async () => {},
      pause: async () => {},
      destroy: async () => {
        await stop(stream);
      },
    };
  });
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url, init) => {
      if (String(url).includes('capabilities'))
        return new Response(
          JSON.stringify({ ...mockCapabilities, speechAvailable: true }),
        );
      speechSignals.push(init.signal);
      await holdSpeech?.promise;
      return speechResponse(pcm(0.5));
    }),
  );
});
afterEach(async () => {
  cleanup();
  for (const request of requests) request.finish();
  holdSpeech?.resolve();
  await settle();
  vi.unstubAllGlobals();
});
async function start() {
  render(createElement(Conversation, { transport }));
  await waitFor(() =>
    expect(
      (
        screen.getByRole('button', {
          name: 'Start conversation',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Start conversation' }));
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toBe('Listening'),
  );
}
async function typed(text = 'Atlas?') {
  fireEvent.change(screen.getByLabelText('Question', { exact: true }), {
    target: { value: text },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Start' }));
  await act(settle);
}
async function speaking() {
  await start();
  await typed();
  await waitFor(() => expect(contexts[0].sources.length).toBeGreaterThan(0));
}
async function raw(token = internal()) {
  await act(async () => {
    callbacks.rawStart(token);
    await settle();
  });
  return token;
}
async function confirm(token: CaptureToken) {
  await act(async () => {
    callbacks.confirmedStart(token);
    await settle();
  });
}
async function end(token: CaptureToken) {
  await act(async () => {
    callbacks.end(token, new Float32Array(1600));
    await settle();
  });
}
it('raw start reversibly suspends real playback while retaining active model and small speech requests', async () => {
  holdSpeech = deferred();
  await start();
  await typed();
  const token = await raw();
  expect(contexts[0].state).toBe('suspended');
  expect(requests[0].signal.aborted).toBe(false);
  expect(speechSignals[0].aborted).toBe(false);
  expect(requests).toHaveLength(1);
  holdSpeech.resolve();
  await act(settle);
  expect(contexts[0].sources[0].stopped).toBe(false);
  await act(async () => {
    callbacks.misfire(token);
    await settle();
  });
  expect(contexts[0].state).toBe('running');
  expect(requests).toHaveLength(1);
});
it('confirmation cancels the answer but retains capture for exactly one WAV submission and new scheduled audio', async () => {
  await speaking();
  const token = await raw();
  await confirm(token);
  expect(requests[0].signal.aborted).toBe(true);
  expect(contexts[0].sources.every((s) => s.stopped)).toBe(true);
  expect(requests).toHaveLength(1);
  await end(token);
  await end(token);
  await waitFor(() => expect(requests).toHaveLength(2));
  expect(requests[1].input.wav).toBeInstanceOf(Blob);
  await waitFor(() =>
    expect(
      contexts.flatMap((c) => c.sources).filter((s) => !s.stopped).length,
    ).toBeGreaterThan(0),
  );
  expect(requests[1].history).toEqual([]);
});
it('a no-active-answer candidate confirms and submits once from initial Listening', async () => {
  await start();
  const token = await raw();
  await confirm(token);
  await end(token);
  await end(token);
  expect(requests).toHaveLength(1);
  expect(requests[0].input.wav).toBeInstanceOf(Blob);
});
it('a Working misfire retains the slow request without replay', async () => {
  noText = true;
  await start();
  await typed();
  const token = await raw();
  await act(async () => {
    callbacks.misfire(token);
    await settle();
  });
  expect(requests).toHaveLength(1);
  expect(requests[0].signal.aborted).toBe(false);
  expect(contexts[0].state).toBe('running');
});
it.each([
  'typed',
  'Stop',
  'microphone mute',
  'overlong',
  'new candidate',
] as const)('confirmed end is obsolete after %s', async (action) => {
  await speaking();
  const token = await raw();
  await confirm(token);
  if (action === 'typed') await typed('Replacement');
  if (action === 'Stop')
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
  if (action === 'microphone mute')
    fireEvent.click(screen.getByLabelText('Mute microphone', { exact: true }));
  if (action === 'overlong')
    await act(async () => {
      callbacks.frame(new Float32Array(480000));
      await settle();
    });
  if (action === 'new candidate') await raw(internal(2));
  const count = requests.length;
  await end(token);
  expect(requests).toHaveLength(count);
});
it('output mute preserves confirmed capture admission and cancels only old output', async () => {
  await speaking();
  const token = await raw();
  await confirm(token);
  fireEvent.click(screen.getByLabelText('Mute output', { exact: true }));
  await end(token);
  expect(requests).toHaveLength(2);
  expect(
    (
      screen.getByLabelText('Mute microphone', {
        exact: true,
      }) as HTMLInputElement
    ).checked,
  ).toBe(false);
});
it.each([
  'before confirmation',
  'after confirmation',
  'after misfire',
] as const)(
  'delayed suspend settles %s without resurrecting canceled sources',
  async (order) => {
    await speaking();
    const gate = deferred();
    contexts[0].suspendGate = gate.promise;
    const token = await raw();
    if (order === 'after misfire')
      await act(async () => {
        callbacks.misfire(token);
        await settle();
      });
    if (order !== 'before confirmation') await confirm(token);
    gate.resolve();
    await act(settle);
    if (order === 'before confirmation') await confirm(token);
    if (order === 'after misfire') {
      // Misfire consumed this candidate: a distinct genuine utterance is required.
      const fresh = await raw(internal(2));
      await confirm(fresh);
      await end(fresh);
    } else await end(token);
    await waitFor(() => expect(requests).toHaveLength(2));
    expect(contexts[0].sources[0].stopped).toBe(true);
    await waitFor(() =>
      expect(contexts.flatMap((c) => c.sources).some((s) => !s.stopped)).toBe(
        true,
      ),
    );
  },
);
it('a newer tentative candidate owns the pause when an old delayed misfire settles', async () => {
  await speaking();
  const gate = deferred();
  contexts[0].suspendGate = gate.promise;
  const old = await raw();
  await act(async () => {
    callbacks.misfire(old);
    await settle();
  });
  const next = await raw(internal(2));
  gate.resolve();
  await act(settle);
  expect(contexts[0].state).toBe('suspended');
  await act(async () => {
    callbacks.misfire(next);
    await settle();
  });
  expect(contexts[0].state).toBe('running');
  expect(requests).toHaveLength(1);
});
it('stale old completion and speech bytes cannot enter history or current text after confirmed interruption', async () => {
  holdSpeech = deferred();
  await start();
  await typed();
  const token = await raw();
  await confirm(token);
  await end(token);
  requests[0].finish();
  holdSpeech.resolve();
  await act(settle);
  expect(requests[1].history).toEqual([]);
  expect(screen.getByRole('article', { name: 'Turn 1' }).textContent).toContain(
    'interrupted',
  );
  expect(screen.getByRole('article', { name: 'Turn 2' }).textContent).toContain(
    'Beacon',
  );
  expect(contexts[0].sources.length).toBe(1);
});
it('completed old text stays in history with interrupted speech when a new voice turn replaces it', async () => {
  await speaking();
  requests[0].finish();
  await act(settle);
  const token = await raw();
  await confirm(token);
  await end(token);
  expect(requests[1].history).toEqual([
    { role: 'user', content: 'Atlas?' },
    { role: 'assistant', content: 'Atlas answer. Next' },
  ]);
  expect(screen.getByRole('article', { name: 'Turn 1' }).textContent).toContain(
    'Answer text is retained',
  );
});

it.each(['rejected', 'never-running'] as const)(
  'interruption recovery shows an answer-independent speech failure after %s resume',
  async (kind) => {
    await speaking();
    const token = await raw();
    if (kind === 'rejected')
      contexts[0].resumeGate = Promise.reject(
        new Error('Native resume denied'),
      );
    else contexts[0].resume = async () => {};
    await confirm(token);
    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toContain(
        'Speech could not resume after interruption',
      ),
    );
    expect(requests).toHaveLength(1);
    expect(requests[0].signal.aborted).toBe(true);
    expect(
      screen.getByRole('article', { name: 'Turn 1' }).textContent,
    ).toContain('Atlas answer');
  },
);
it('watchdog teardown prevents a later misfire from restoring old speech and a subsequent confirmed question works', async () => {
  await speaking();
  const token = await raw();
  await waitFor(
    () =>
      expect(
        screen.getByRole('article', { name: 'Turn 1' }).textContent,
      ).toContain('PLAYBACK_STALLED'),
    { timeout: 4500 },
  );
  await act(async () => {
    callbacks.misfire(token);
    await settle();
  });
  expect(contexts[0].sources.every((s) => s.stopped)).toBe(true);
  const next = await raw(internal(2));
  await confirm(next);
  await end(next);
  await waitFor(() => expect(requests).toHaveLength(2));
  await waitFor(() =>
    expect(contexts.flatMap((c) => c.sources).some((s) => !s.stopped)).toBe(
      true,
    ),
  );
});
it('microphone mute during a tentative candidate restores only the still-current answer', async () => {
  await speaking();
  await raw();
  fireEvent.click(screen.getByLabelText('Mute microphone', { exact: true }));
  await act(settle);
  expect(requests[0].signal.aborted).toBe(false);
  expect(contexts[0].sources[0].stopped).toBe(false);
  expect(contexts[0].state).toBe('running');
});

it('the accepted sample end and single WAV admission share one consume-before-submit gate', () => {
  const controller = new TurnController(),
    capture = internal(),
    samples = new Float32Array(16),
    onEnd = vi.fn();
  const interruption = new Interruption({
    controller,
    answerToken: () => null,
    output: () => null,
    captureIsCurrent: (c) => c === capture,
    isActive: () => true,
    onEnd,
    showSpeechResumeFailure: vi.fn(),
  });
  interruption.rawStart(capture);
  interruption.confirmedStart(capture);
  interruption.end(capture, samples);
  interruption.end(capture, samples);
  expect(onEnd).toHaveBeenCalledExactlyOnceWith(capture, samples);
  expect(interruption.admitEnd(capture)).toBe(false);
  const next = new Interruption({
    controller,
    answerToken: () => null,
    output: () => null,
    captureIsCurrent: (c) => c === capture,
    isActive: () => true,
    onEnd,
    showSpeechResumeFailure: vi.fn(),
  });
  next.rawStart(capture);
  next.confirmedStart(capture);
  expect(next.admitEnd(capture)).toBe(true);
  next.end(capture, samples);
  expect(onEnd).toHaveBeenCalledTimes(1);
});
it('stale transcript, delta, tool result, completion and source events cannot mutate the new card/text/history', () => {
  const controller = new TurnController(),
    history = new HistoryStore((t) => controller.current(t));
  const old = controller.begin();
  const next = controller.begin();
  const before = controller.getSnapshot();
  const stale: TurnEvent[] = [
    {
      schemaVersion: 1,
      turnId: old.turnId,
      seq: 0,
      type: 'transcript.final',
      data: { text: 'Obsolete transcript' },
    },
    ...wireEvents.map((e) => ({ ...e, turnId: old.turnId })),
    {
      schemaVersion: 1,
      turnId: old.turnId,
      seq: 0,
      type: 'sources',
      data: { sources: [{ title: 'Old', url: 'https://old.example' }] },
    },
  ];
  for (const event of stale) controller.apply(old, event);
  controller.fail(old, new Error('Old failure'));
  controller.setSpeech(old, 'speaking');
  history.complete(old, 'Obsolete user', 'Obsolete answer', 'complete');
  expect(controller.getSnapshot()).toBe(before);
  expect(controller.current(next)).toBe(true);
  expect(history.messages()).toEqual([]);
});
it('an old source-ended callback cannot prune or restart the current generation after cancellation', () => {
  const clock = new AudioClock(),
    controller = new TurnController();
  const old = controller.begin();
  const playback = new Playback(clock.context(), (t) => controller.current(t));
  playback.enqueue(old, new Float32Array(24000));
  const ended = clock.sources[0].onended!;
  controller.cancelCurrent('interrupted');
  playback.cancel(old);
  const next = controller.begin();
  playback.enqueue(next, new Float32Array(24000));
  const outstanding = playback.outstandingSeconds();
  ended();
  expect(playback.outstandingSeconds()).toBe(outstanding);
  expect(clock.sources[0].stopped).toBe(true);
  expect(clock.sources[1].stopped).toBe(false);
  void playback.dispose();
});
