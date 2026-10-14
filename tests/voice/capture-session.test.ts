// @vitest-environment jsdom
// Conversation integration simulation: real CaptureSession, controlled browser/VAD boundaries.
import { createElement, StrictMode } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type {
  VadCallbacks,
  VadHandle,
  CaptureToken,
} from '../../apps/web/client/voice/vad-adapter';
import type { startTurn } from '../../apps/web/client/turn-stream';
import type {
  TurnEvent,
  HistoryMessage,
} from '../../apps/web/shared/contracts';
import { AudioClock, settle, pcm, speechResponse } from './audio-fixture';
import {
  mockCapabilities,
  wireEvents,
} from '../helpers/wire-contract-fixtures';
const boundary = vi.hoisted(() => ({ createVad: vi.fn() }));
vi.mock('../../apps/web/client/voice/vad-adapter', async (original) => ({
  ...(await original<
    typeof import('../../apps/web/client/voice/vad-adapter')
  >()),
  createVad: boundary.createVad,
}));
import Conversation from '../../apps/web/components/Conversation';
function deferred<T>() {
  let resolve!: (value: T) => void, reject!: (error: unknown) => void;
  const promise = new Promise<T>((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
}
const raw = (id = 1): CaptureToken =>
  Object.freeze({ epoch: 999, utteranceId: id, intentVersion: 999 });
type Driver = {
  callbacks: VadCallbacks;
  starts: number;
  destroyed: boolean;
  destroy: ReturnType<typeof vi.fn<() => Promise<void>>>;
};
let contexts: Array<AudioClock & { close: ReturnType<typeof vi.fn> }>;
let tracks: Array<{ stop: ReturnType<typeof vi.fn>; readyState: string }>;
let drivers: Driver[];
let order: string[];
let gates: {
  model?: Promise<void>;
  worklet?: Promise<void>;
  permission?: Promise<void>;
  start?: Promise<void>;
};
let acquisition: ReturnType<typeof vi.fn>;
let cleanupFails: boolean;
let calls: Array<{
  input: { text?: string; wav?: Blob };
  history: HistoryMessage[];
  signal: AbortSignal;
}>;
let holdAnswer: Promise<void> | undefined;
const transport: typeof startTurn = async function* (
  token,
  input,
  history,
  signal,
) {
  calls.push({ input, history, signal });
  const base = wireEvents.map((e) => ({ ...e, turnId: token.turnId }));
  const payloads = input.wav
    ? [
        base[0],
        { schemaVersion: 1, type: 'stage', data: { stage: 'transcribing' } },
        {
          schemaVersion: 1,
          type: 'transcript.final',
          data: { text: 'Recognized Atlas question' },
        },
        ...base.slice(1),
      ]
    : base;
  const events = payloads.map(
    (e, seq) => ({ ...e, seq, turnId: token.turnId }) as TurnEvent,
  );
  yield* events.slice(0, -1);
  await holdAnswer;
  yield events.at(-1)!;
};
beforeEach(() => {
  contexts = [];
  tracks = [];
  drivers = [];
  order = [];
  gates = {};
  calls = [];
  cleanupFails = false;
  holdAnswer = undefined;
  boundary.createVad.mockReset();
  class Context extends AudioClock {
    close = vi.fn(async () => {
      this.closed = true;
      this.state = 'closed';
    });
    constructor() {
      super();
      contexts.push(this);
      order.push('context');
    }
    override async resume() {
      order.push('resume');
      await super.resume();
    }
  }
  vi.stubGlobal('AudioContext', Context);
  acquisition = vi.fn(async () => {
    order.push('permission');
    await gates.permission;
    const track = {
      readyState: 'live',
      stop: vi.fn(() => {
        track.readyState = 'ended';
        if (cleanupFails) throw new Error('Track cleanup failed');
      }),
    };
    tracks.push(track);
    return { getTracks: () => [track] } as unknown as MediaStream;
  });
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: { getUserMedia: acquisition },
  });
  boundary.createVad.mockImplementation(
    async (
      _context: AudioContext,
      acquire: () => Promise<MediaStream>,
      stop: (s: MediaStream) => Promise<void>,
      callbacks: VadCallbacks,
    ) => {
      order.push('model');
      await gates.model;
      let stream: MediaStream | undefined,
        pending: Promise<void> | undefined,
        disposal: Promise<void> | undefined;
      const driver: Driver = {
        callbacks,
        starts: 0,
        destroyed: false,
        destroy: vi.fn<() => Promise<void>>(),
      };
      const handle: VadHandle = {
        start: () => {
          driver.starts++;
          pending = (async () => {
            await gates.worklet;
            stream = await acquire();
            if (driver.destroyed) {
              await stop(stream);
              return;
            }
            await gates.start;
          })();
          return pending;
        },
        pause: async () => {
          if (stream) await stop(stream);
        },
        destroy: driver.destroy.mockImplementation(() => {
          if (disposal) return disposal;
          driver.destroyed = true;
          const early = stream ? stop(stream) : Promise.resolve();
          disposal = Promise.allSettled([early, pending?.catch(() => {})]).then(
            (results) => {
              if (results.some((r) => r.status === 'rejected'))
                throw Error('VAD cleanup failed');
            },
          );
          return disposal;
        }),
      };
      drivers.push(driver);
      return handle;
    },
  );
  vi.stubGlobal(
    'fetch',
    async () =>
      new Response(
        JSON.stringify({ ...mockCapabilities, speechAvailable: false }),
      ),
  );
});
afterEach(async () => {
  cleanup();
  await settle();
  vi.unstubAllGlobals();
});
async function ready() {
  await screen.findByText('Mock/Contract Simulation');
}
function startCapture() {
  fireEvent.click(screen.getByRole('button', { name: 'Start conversation' }));
}
function stop() {
  fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
}
async function listening() {
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toBe('Listening'),
  );
}
async function emit(driver = drivers.at(-1)!, id = 1) {
  const token = raw(id);
  await act(async () => {
    driver.callbacks.rawStart(token);
    driver.callbacks.confirmedStart(token);
    driver.callbacks.end(token, new Float32Array(3200).fill(0.25));
    await settle();
  });
  return token;
}
async function typed(text = 'Typed fallback') {
  fireEvent.change(screen.getByLabelText('Question'), {
    target: { value: text },
  });
  fireEvent.click(screen.getByRole('button', { name: /^Start$/ }));
  await act(settle);
}
it('resumes distinct contexts synchronously before permission and submits one current WAV automatically with collapsed transcript and spoken history', async () => {
  render(createElement(Conversation, { transport }));
  await ready();
  startCapture();
  expect(order.slice(0, 4)).toEqual(['context', 'resume', 'context', 'resume']);
  expect(acquisition).not.toHaveBeenCalled();
  await listening();
  const driver = drivers[0],
    token = raw();
  act(() => {
    driver.callbacks.rawStart(token);
    driver.callbacks.confirmedStart(token);
  });
  expect(calls).toHaveLength(0);
  await act(async () => {
    driver.callbacks.end(token, new Float32Array(3200));
    driver.callbacks.end(token, new Float32Array(3200));
    await settle();
  });
  expect(calls).toHaveLength(1);
  expect(calls[0].input.wav?.type).toBe('audio/wav');
  expect(calls[0].input.wav?.size).toBe(6444);
  expect(document.querySelectorAll('details[open]')).toHaveLength(0);
  await typed('Follow up');
  expect(calls[1].history[0]).toEqual({
    role: 'user',
    content: 'Recognized Atlas question',
  });
  expect(acquisition).toHaveBeenCalledTimes(1);
  stop();
  await act(settle);
  expect(tracks[0].stop).toHaveBeenCalledTimes(1);
  expect(contexts).toHaveLength(2);
  for (const c of contexts) expect(c.close).toHaveBeenCalledTimes(1);
});
it('typed submit resumes playback without requesting a microphone and invalidates an unfinished capture candidate', async () => {
  vi.stubGlobal(
    'fetch',
    async () =>
      new Response(
        JSON.stringify({ ...mockCapabilities, speechAvailable: true }),
      ),
  );
  render(createElement(Conversation, { transport }));
  await ready();
  await typed();
  expect(acquisition).not.toHaveBeenCalled();
  expect(contexts).toHaveLength(1);
  startCapture();
  await listening();
  const token = raw();
  act(() => {
    drivers[0].callbacks.rawStart(token);
    drivers[0].callbacks.confirmedStart(token);
  });
  await typed('New intent');
  await act(async () => {
    drivers[0].callbacks.end(token, new Float32Array(100));
    await settle();
  });
  expect(calls.filter((c) => c.input.wav)).toHaveLength(0);
  expect(calls.filter((c) => c.input.text)).toHaveLength(2);
});
it('double Start reuses pending capture and Stop releases a late permission result before a fresh usable Start', async () => {
  const gate = deferred<void>();
  gates.permission = gate.promise;
  render(createElement(Conversation, { transport }));
  await ready();
  startCapture();
  startCapture();
  await waitFor(() => expect(acquisition).toHaveBeenCalledTimes(1));
  expect(contexts).toHaveLength(2);
  stop();
  await act(async () => {
    gate.resolve();
    await settle();
  });
  expect(calls).toHaveLength(0);
  expect(drivers[0].destroyed).toBe(true);
  expect(tracks[0].stop).toHaveBeenCalledTimes(1);
  expect(contexts.every((c) => c.closed)).toBe(true);
  gates.permission = undefined;
  startCapture();
  await listening();
  await emit();
  expect(calls).toHaveLength(1);
});
it.each(['model', 'worklet', 'start'] as const)(
  'Stop during pending %s prevents late listening/submission and releases every allocated resource',
  async (phase) => {
    const gate = deferred<void>();
    gates[phase] = gate.promise;
    render(createElement(Conversation, { transport }));
    await ready();
    startCapture();
    await act(settle);
    stop();
    await act(async () => {
      gate.resolve();
      await settle();
    });
    for (const driver of drivers) {
      expect(driver.destroyed).toBe(true);
      await emit(driver);
    }
    expect(calls).toHaveLength(0);
    expect(contexts.every((c) => c.closed)).toBe(true);
    for (const track of tracks) expect(track.stop).toHaveBeenCalledTimes(1);
  },
);
it('microphone mute/unmute reuses capture context with a fresh constrained stream while output mute retains capture and history', async () => {
  render(createElement(Conversation, { transport }));
  await ready();
  startCapture();
  await listening();
  fireEvent.click(screen.getByLabelText('Mute microphone'));
  await act(settle);
  expect(tracks[0].stop).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByLabelText('Mute microphone'));
  await listening();
  expect(tracks).toHaveLength(2);
  expect(contexts).toHaveLength(2);
  expect(acquisition).toHaveBeenLastCalledWith({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });
  fireEvent.click(screen.getByLabelText('Mute output'));
  await emit();
  expect(calls).toHaveLength(1);
  expect(tracks[1].readyState).toBe('live');
  await emit(drivers.at(-1), 2);
  expect(calls[1].history[0].content).toBe('Recognized Atlas question');
  stop();
  await act(settle);
  for (const track of tracks) expect(track.stop).toHaveBeenCalledTimes(1);
});
it('misfires and overlong utterances submit zero then recover with a fresh stream and one valid automatic turn', async () => {
  render(createElement(Conversation, { transport }));
  await ready();
  startCapture();
  await listening();
  const d = drivers[0],
    misfire = raw();
  act(() => {
    d.callbacks.rawStart(misfire);
    d.callbacks.misfire(misfire);
    d.callbacks.end(misfire, new Float32Array(100));
  });
  expect(calls).toHaveLength(0);
  const long = raw(2);
  await act(async () => {
    d.callbacks.rawStart(long);
    d.callbacks.confirmedStart(long);
    d.callbacks.frame(new Float32Array(480000));
    await settle();
  });
  expect(await screen.findByText(/30 seconds/)).toBeTruthy();
  expect(drivers).toHaveLength(2);
  expect(tracks).toHaveLength(2);
  expect(contexts).toHaveLength(2);
  await emit(d, 3);
  expect(calls).toHaveLength(0);
  await emit(drivers[1], 4);
  expect(calls).toHaveLength(1);
});
it.each(['permission', 'model'] as const)(
  'surfaces %s startup failure, releases contexts and preserves typed fallback and a fresh Start',
  async (phase) => {
    const gate = deferred<void>();
    gates[phase] = gate.promise;
    render(createElement(Conversation, { transport }));
    await ready();
    startCapture();
    await act(async () => {
      gate.reject(
        phase === 'permission'
          ? new DOMException('Denied', 'NotAllowedError')
          : Error('Missing model'),
      );
      await settle();
    });
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(contexts.every((c) => c.closed)).toBe(true);
    await typed();
    expect(calls[0].input.text).toBe('Typed fallback');
    gates[phase] = undefined;
    startCapture();
    await listening();
    await emit();
    expect(calls).toHaveLength(2);
  },
);
it('Stop aborts an unfinished automatic answer and reports cleanup failure without claiming release succeeded', async () => {
  const gate = deferred<void>();
  holdAnswer = gate.promise;
  render(createElement(Conversation, { transport }));
  await ready();
  startCapture();
  await listening();
  await emit();
  cleanupFails = true;
  stop();
  await act(settle);
  expect(calls[0].signal.aborted).toBe(true);
  expect(await screen.findByText(/cleanup failed/i)).toBeTruthy();
  gate.resolve();
  await act(settle);
  expect(tracks[0].stop).toHaveBeenCalledTimes(1);
  expect(contexts.every((c) => c.closed)).toBe(true);
});
it('Strict Mode effects never capture and unmount/remount disposes pending startup without duplicate turns', async () => {
  const gate = deferred<void>();
  gates.model = gate.promise;
  const view = render(
    createElement(StrictMode, null, createElement(Conversation, { transport })),
  );
  await ready();
  expect(contexts).toHaveLength(0);
  expect(acquisition).not.toHaveBeenCalled();
  startCapture();
  await act(settle);
  view.unmount();
  await act(async () => {
    gate.resolve();
    await settle();
  });
  expect(contexts.every((c) => c.closed)).toBe(true);
  expect(calls).toHaveLength(0);
  gates.model = undefined;
  render(
    createElement(StrictMode, null, createElement(Conversation, { transport })),
  );
  await ready();
  startCapture();
  await listening();
  await emit();
  expect(calls).toHaveLength(1);
});
it('obsolete initial startup cannot report Listening while a newer unmute is still loading', async () => {
  const first = deferred<void>(),
    second = deferred<void>();
  gates.model = first.promise;
  render(createElement(Conversation, { transport }));
  await ready();
  startCapture();
  await act(settle);
  fireEvent.click(screen.getByLabelText('Mute microphone'));
  await act(settle);
  gates.model = second.promise;
  fireEvent.click(screen.getByLabelText('Mute microphone'));
  await act(settle);
  await act(async () => {
    first.resolve();
    await settle();
  });
  expect(screen.getByRole('status').textContent).not.toBe('Listening');
  await act(async () => {
    second.resolve();
    await settle();
  });
  await listening();
});
it('failed microphone unmute reports permission denial and permits a usable fresh Start without a stranded session', async () => {
  render(createElement(Conversation, { transport }));
  await ready();
  startCapture();
  await listening();
  fireEvent.click(screen.getByLabelText('Mute microphone'));
  await act(settle);
  const gate = deferred<void>();
  gates.permission = gate.promise;
  fireEvent.click(screen.getByLabelText('Mute microphone'));
  await act(settle);
  await act(async () => {
    gate.reject(
      Object.assign(new Error('Denied'), { name: 'NotAllowedError' }),
    );
    await settle();
  });
  expect(screen.getByRole('alert').textContent).toContain(
    'permission was denied',
  );
  gates.permission = undefined;
  startCapture();
  await listening();
  await emit();
  expect(calls).toHaveLength(1);
  stop();
  await act(settle);
  for (const track of tracks) expect(track.stop).toHaveBeenCalledTimes(1);
});
it('Stop during a spoken automatic answer releases capture, scheduled speech and its unfinished request together', async () => {
  const gate = deferred<void>();
  holdAnswer = gate.promise;
  vi.stubGlobal('fetch', async (input: RequestInfo | URL) => {
    const path =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    return path.includes('capabilities')
      ? new Response(
          JSON.stringify({ ...mockCapabilities, speechAvailable: true }),
        )
      : speechResponse(pcm(0.5));
  });
  render(createElement(Conversation, { transport }));
  await ready();
  startCapture();
  await listening();
  await emit();
  await waitFor(() => expect(contexts[0].sources.length).toBeGreaterThan(0));
  stop();
  await act(settle);
  expect(calls[0].signal.aborted).toBe(true);
  expect(
    contexts[0].sources.every(
      (source) => source.stopped && source.onended === null,
    ),
  ).toBe(true);
  expect(contexts.every((context) => context.closed)).toBe(true);
  expect(tracks[0].stop).toHaveBeenCalledTimes(1);
  gate.resolve();
  await act(settle);
});
