// CaptureSession unit simulation: controlled permission/VAD/context; no microphone or model claim.
import { describe, expect, it, vi } from 'vitest';
import {
  CaptureSession,
  type CaptureToken,
  type CaptureReason,
  type CaptureVadEvent,
} from '../../apps/web/client/voice/capture-session';
import {
  acquireMicrophoneStream,
  type VadCallbacks,
  type VadHandle,
} from '../../apps/web/client/voice/vad-adapter';
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
}
const raw = (id = 1): CaptureToken =>
  Object.freeze({ epoch: 999, utteranceId: id, intentVersion: 999 });
function harness() {
  const order: string[] = [],
    contexts: Array<{
      resume: ReturnType<typeof vi.fn>;
      close: ReturnType<typeof vi.fn>;
    }> = [],
    tracks: Array<{ stop: ReturnType<typeof vi.fn> }> = [];
  const events: CaptureVadEvent[] = [],
    utterances: Array<{ token: CaptureToken; wav: Blob }> = [],
    statuses: CaptureReason[] = [];
  const drivers: Array<{
    callbacks: VadCallbacks;
    handle: VadHandle;
    destroyed: boolean;
    stream: MediaStream | null;
    started: number;
  }> = [];
  const deps = {
    createContext: () => {
      order.push('context');
      const ctx = {
        resume: vi.fn(async () => {
          order.push('resume');
        }),
        close: vi.fn(async () => {}),
      };
      contexts.push(ctx);
      return ctx as unknown as AudioContext;
    },
    acquireStream: vi.fn(async () => {
      order.push('permission');
      const t = { stop: vi.fn() };
      tracks.push(t);
      return { getTracks: () => [t] } as unknown as MediaStream;
    }),
    createVad: vi.fn(
      async (
        _ctx: AudioContext,
        acquire: () => Promise<MediaStream>,
        stop: (stream: MediaStream) => Promise<void>,
        callbacks: VadCallbacks,
      ) => {
        order.push('vad');
        let pending: Promise<void> | null = null,
          destroying: Promise<void> | null = null;
        const d = {
          callbacks,
          handle: null as unknown as VadHandle,
          destroyed: false,
          stream: null as MediaStream | null,
          started: 0,
        };
        d.handle = {
          start: () => {
            d.started++;
            pending = (async () => {
              const s = await acquire();
              d.stream = s;
              if (d.destroyed) {
                await stop(s);
                return;
              }
            })();
            return pending;
          },
          pause: async () => {
            if (d.stream) await stop(d.stream);
          },
          destroy: () => {
            if (destroying) return destroying;
            d.destroyed = true;
            const stopped = d.stream ? stop(d.stream) : Promise.resolve();
            destroying = (async () => {
              await stopped;
              await pending?.catch(() => {});
            })();
            return destroying;
          },
        };
        drivers.push(d);
        return d.handle;
      },
    ),
    onVadEvent: (event: CaptureVadEvent) => {
      events.push(event);
    },
    onUtterance: (token: CaptureToken, wav: Blob) => {
      utterances.push({ token, wav });
    },
    onStatus: (reason: CaptureReason) => {
      statuses.push(reason);
    },
  };
  return {
    deps,
    order,
    contexts,
    tracks,
    events,
    utterances,
    statuses,
    drivers,
  };
}
describe('bounded capture owner', () => {
  it('refuses a reused stopped stream on unmute and allows a fresh user Start', async () => {
    const h = harness(),
      s = new CaptureSession(h.deps);
    await s.start();
    const old = h.drivers[0].stream!;
    await s.mute();
    h.deps.acquireStream.mockResolvedValueOnce(old);
    await expect(s.unmute()).rejects.toThrow(
      'Microphone stream is not fresh and usable',
    );
    expect(h.statuses).toContain('CAPTURE_LOAD_FAILED');
    expect(h.tracks[0].stop).toHaveBeenCalledTimes(1);
    expect(h.contexts[0].close).toHaveBeenCalledTimes(1);
    await s.start();
    expect(h.contexts).toHaveLength(2);
    expect(h.drivers[2].stream).not.toBe(old);
    await s.stop();
  });

  it('creates/resumes synchronously before any permission/model await and reuses double-click pending work', async () => {
    const h = harness(),
      resume = deferred<void>();
    h.deps.createContext = () => {
      h.order.push('context');
      const ctx = {
        resume: vi.fn(() => {
          h.order.push('resume');
          return resume.promise;
        }),
        close: vi.fn(async () => {}),
      };
      h.contexts.push(ctx);
      return ctx as unknown as AudioContext;
    };
    const s = new CaptureSession(h.deps);
    const a = s.start(),
      b = s.start();
    expect(a).toBe(b);
    expect(h.order).toEqual(['context', 'resume']);
    expect(h.contexts).toHaveLength(1);
    expect(h.deps.acquireStream).not.toHaveBeenCalled();
    expect(h.deps.createVad).not.toHaveBeenCalled();
    resume.resolve();
    await a;
    expect(h.order).toEqual(['context', 'resume', 'vad', 'permission']);
    await s.stop();
  });
  it('reports rejected resume and closes the allocated caller context', async () => {
    const h = harness();
    h.deps.createContext = () => {
      const ctx = {
        resume: vi.fn(async () => {
          throw Error('resume rejected');
        }),
        close: vi.fn(async () => {}),
      };
      h.contexts.push(ctx);
      return ctx as unknown as AudioContext;
    };
    const s = new CaptureSession(h.deps);
    await expect(s.start()).rejects.toThrow('resume rejected');
    expect(h.statuses).toEqual(['CAPTURE_LOAD_FAILED']);
    expect(h.contexts[0].close).toHaveBeenCalledTimes(1);
    expect(h.deps.acquireStream).not.toHaveBeenCalled();
    await s.stop();
    expect(h.contexts[0].close).toHaveBeenCalledTimes(1);
  });
  it('maps raw token once synchronously, preserves immutable identity/order and emits one valid current end', async () => {
    const h = harness(),
      s = new CaptureSession(h.deps);
    await s.start();
    const c = h.drivers[0].callbacks,
      internal = raw();
    c.rawStart(internal);
    const token = h.events[0].capture;
    expect(token).not.toBe(internal);
    expect(Object.isFrozen(token)).toBe(true);
    expect(token.epoch).not.toBe(999);
    expect(token.intentVersion).not.toBe(999);
    expect(s.isCurrent(token)).toBe(true);
    c.confirmedStart(internal);
    c.confirmedStart(internal);
    c.end(internal, new Float32Array(1600).fill(0.2));
    c.end(internal, new Float32Array(1600));
    expect(h.events.map((e) => e.type)).toEqual(['rawStart', 'confirmedStart']);
    expect(h.events[1].capture).toBe(token);
    expect(h.utterances).toHaveLength(1);
    expect(h.utterances[0].token).toBe(token);
    expect(h.utterances[0].wav.size).toBe(3244);
    await s.stop();
  });
  it('misfires notify the same token but never notify an utterance, including a delayed end', async () => {
    const h = harness(),
      s = new CaptureSession(h.deps);
    await s.start();
    const c = h.drivers[0].callbacks,
      t = raw();
    c.rawStart(t);
    c.misfire(t);
    c.end(t, new Float32Array(800));
    expect(h.events.map((e) => e.type)).toEqual(['rawStart', 'misfire']);
    expect(h.events[1].capture).toBe(h.events[0].capture);
    expect(s.isCurrent(h.events[0].capture)).toBe(false);
    expect(h.utterances).toHaveLength(0);
    await s.stop();
  });
  it('ignores a misfire after confirmation and admits the valid end exactly once', async () => {
    const h = harness(),
      s = new CaptureSession(h.deps);
    await s.start();
    const c = h.drivers[0].callbacks,
      t = raw();
    c.rawStart(t);
    c.confirmedStart(t);
    c.misfire(t);
    c.end(t, new Float32Array(100));
    expect(h.events.map((e) => e.type)).toEqual(['rawStart', 'confirmedStart']);
    expect(h.utterances).toHaveLength(1);
    await s.stop();
  });
  it('invalidates typed intent and older raw candidate callbacks without manufacturing new tokens', async () => {
    const h = harness(),
      s = new CaptureSession(h.deps);
    await s.start();
    const c = h.drivers[0].callbacks,
      a = raw(),
      b = raw(2);
    c.rawStart(a);
    c.confirmedStart(a);
    const old = h.events[0].capture;
    s.invalidateIntent();
    c.confirmedStart(a);
    c.misfire(a);
    c.end(a, new Float32Array(100));
    expect(s.isCurrent(old)).toBe(false);
    c.rawStart(b);
    c.confirmedStart(b);
    c.end(a, new Float32Array(100));
    c.end(b, new Float32Array(100));
    expect(h.utterances).toHaveLength(1);
    expect(h.utterances[0].token).toBe(h.events[2].capture);
    expect(h.utterances[0].token.intentVersion).toBeGreaterThan(
      old.intentVersion,
    );
    await s.stop();
  });
  it('a newer raw candidate invalidates an older confirmed candidate end', async () => {
    const h = harness(),
      s = new CaptureSession(h.deps);
    await s.start();
    const c = h.drivers[0].callbacks,
      a = raw(),
      b = raw(2);
    c.rawStart(a);
    c.confirmedStart(a);
    c.rawStart(b);
    c.end(a, new Float32Array(100));
    c.confirmedStart(b);
    c.end(b, new Float32Array(100));
    expect(h.utterances).toHaveLength(1);
    expect(h.utterances[0].token).toBe(h.events[2].capture);
    await s.stop();
  });
  it('rejects tentative/empty/malformed ends without an utterance', async () => {
    const h = harness(),
      s = new CaptureSession(h.deps);
    await s.start();
    const c = h.drivers[0].callbacks;
    const a = raw();
    c.rawStart(a);
    c.end(a, new Float32Array(100));
    const b = raw(2);
    c.rawStart(b);
    c.confirmedStart(b);
    c.end(b, new Float32Array());
    const d = raw(3);
    c.rawStart(d);
    c.confirmedStart(d);
    c.end(d, new Float32Array([NaN]));
    expect(h.utterances).toHaveLength(0);
    await s.stop();
  });
  it('permission denial is visible, destroys allocation and permits a fresh Start', async () => {
    const h = harness();
    h.deps.acquireStream.mockRejectedValueOnce(
      new DOMException('denied', 'NotAllowedError'),
    );
    const s = new CaptureSession(h.deps);
    await expect(s.start()).rejects.toThrow('denied');
    expect(h.statuses).toContain('CAPTURE_PERMISSION_DENIED');
    expect(h.drivers[0].destroyed).toBe(true);
    expect(h.contexts[0].close).toHaveBeenCalledTimes(1);
    await s.start();
    expect(h.contexts).toHaveLength(2);
    await s.stop();
    expect(h.tracks[0].stop).toHaveBeenCalledTimes(1);
  });
  it('stops pending permission before waiting, releases the late stream once, and suppresses old events', async () => {
    const h = harness(),
      permission = deferred<MediaStream>(),
      requested = deferred<void>(),
      track = { stop: vi.fn() };
    h.deps.acquireStream.mockImplementationOnce(() => {
      requested.resolve();
      return permission.promise;
    });
    const s = new CaptureSession(h.deps),
      starting = s.start();
    await requested.promise;
    const stopping = s.stop();
    expect(h.drivers[0].destroyed).toBe(true);
    permission.resolve({ getTracks: () => [track] } as unknown as MediaStream);
    await Promise.all([starting, stopping]);
    expect(track.stop).toHaveBeenCalledTimes(1);
    expect(h.contexts[0].close).toHaveBeenCalledTimes(1);
    h.drivers[0].callbacks.rawStart(raw());
    h.drivers[0].callbacks.end(raw(), new Float32Array(100));
    expect(h.events).toHaveLength(0);
    expect(h.utterances).toHaveLength(0);
  });
  it('destroys late model allocation without calling start, then closes the caller context', async () => {
    const h = harness(),
      model = deferred<VadHandle>(),
      requested = deferred<void>(),
      start = vi.fn(async () => {}),
      destroy = vi.fn(async () => {});
    h.deps.createVad.mockImplementationOnce(async () => {
      requested.resolve();
      return model.promise;
    });
    const s = new CaptureSession(h.deps),
      starting = s.start();
    await requested.promise;
    const stopping = s.stop();
    model.resolve({ start, pause: async () => {}, destroy });
    await Promise.all([starting, stopping]);
    expect(start).not.toHaveBeenCalled();
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(h.contexts[0].close).toHaveBeenCalledTimes(1);
  });
  it('reports model load failure, releases context and allows a fresh Start', async () => {
    const h = harness();
    h.deps.createVad.mockRejectedValueOnce(Error('model load'));
    const s = new CaptureSession(h.deps);
    await expect(s.start()).rejects.toThrow('model load');
    expect(h.statuses).toContain('CAPTURE_LOAD_FAILED');
    expect(h.contexts[0].close).toHaveBeenCalledTimes(1);
    await s.start();
    await s.stop();
    expect(h.contexts).toHaveLength(2);
  });
  it('mute/unmute preserves one context, stops each track once and creates a fresh usable capture allocation', async () => {
    const h = harness(),
      s = new CaptureSession(h.deps);
    await s.start();
    const old = h.drivers[0].callbacks,
      t = raw();
    old.rawStart(t);
    old.confirmedStart(t);
    await s.mute();
    expect(h.tracks[0].stop).toHaveBeenCalledTimes(1);
    await s.unmute();
    expect(h.contexts).toHaveLength(1);
    expect(h.contexts[0].close).not.toHaveBeenCalled();
    old.end(t, new Float32Array(100));
    const c = h.drivers[1].callbacks,
      next = raw();
    c.rawStart(next);
    c.confirmedStart(next);
    c.end(next, new Float32Array(100));
    expect(h.utterances).toHaveLength(1);
    await s.stop();
    expect(h.tracks.map((t) => t.stop.mock.calls.length)).toEqual([1, 1]);
    await s.start();
    expect(h.contexts).toHaveLength(2);
    await s.stop();
    expect(h.contexts.map((c) => c.close.mock.calls.length)).toEqual([1, 1]);
  });
  it('counts800ms pre-roll plus measured512-sample hops, discards at30s and recaptures without a new context', async () => {
    const h = harness(),
      s = new CaptureSession(h.deps);
    await s.start();
    const c = h.drivers[0].callbacks,
      t = raw();
    c.rawStart(t);
    c.confirmedStart(t);
    for (let i = 0; i < 912; i++) c.frame(new Float32Array(512));
    expect(h.statuses).not.toContain('CAPTURE_OVERLONG');
    c.frame(new Float32Array(512));
    expect(h.statuses).toContain('CAPTURE_OVERLONG');
    c.end(t, new Float32Array(480000));
    expect(h.utterances).toHaveLength(0);
    await vi.waitFor(() => expect(h.drivers).toHaveLength(2));
    await vi.waitFor(() => expect(h.tracks).toHaveLength(2));
    expect(h.contexts).toHaveLength(1);
    const next = raw(),
      fresh = h.drivers[1].callbacks;
    fresh.rawStart(next);
    fresh.confirmedStart(next);
    fresh.end(next, new Float32Array(1600));
    expect(h.utterances).toHaveLength(1);
    await s.stop();
    expect(h.tracks.map((t) => t.stop.mock.calls.length)).toEqual([1, 1]);
  });
  it('also discards an excess end instead of emitting malformed WAV', async () => {
    const h = harness(),
      s = new CaptureSession(h.deps);
    await s.start();
    const c = h.drivers[0].callbacks,
      t = raw();
    c.rawStart(t);
    c.confirmedStart(t);
    c.end(t, new Float32Array(480001));
    expect(h.utterances).toHaveLength(0);
    expect(h.statuses).toContain('CAPTURE_OVERLONG');
    await s.stop();
  });
  it('concurrent Stop and a Strict Mode replacement release contexts/tracks once with no late utterance', async () => {
    const h = harness(),
      s = new CaptureSession(h.deps);
    await s.start();
    const c = h.drivers[0].callbacks,
      t = raw();
    c.rawStart(t);
    c.confirmedStart(t);
    await Promise.all([s.stop(), s.stop()]);
    c.end(t, new Float32Array(100));
    const next = new CaptureSession(h.deps);
    await next.start();
    await next.stop();
    expect(h.utterances).toHaveLength(0);
    expect(h.tracks.map((t) => t.stop.mock.calls.length)).toEqual([1, 1]);
    expect(h.contexts.map((c) => c.close.mock.calls.length)).toEqual([1, 1]);
  });
  it('surfaces cleanup failure while still closing the caller context and permits a new Start', async () => {
    const h = harness(),
      s = new CaptureSession(h.deps);
    await s.start();
    h.drivers[0].handle.destroy = async () => {
      throw Error('cleanup');
    };
    await expect(s.stop()).rejects.toThrow();
    expect(h.statuses).toContain('CAPTURE_CLEANUP_FAILED');
    expect(h.contexts[0].close).toHaveBeenCalledTimes(1);
    expect(h.tracks[0].stop).toHaveBeenCalledTimes(1);
    await s.start();
    await s.stop();
    expect(h.contexts).toHaveLength(2);
  });
  it('requests the exact mono/echo/noise/AGC browser constraints at the real acquisition boundary', async () => {
    const getUserMedia = vi.fn(async () => ({}) as MediaStream);
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } });
    try {
      await acquireMicrophoneStream();
      expect(getUserMedia).toHaveBeenCalledWith({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
