// Controlled ORT/model/browser-node simulation against actual pinned MicVAD and Silero modules.
import { createRequire } from 'node:module';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import type {
  MicVAD as MicVad,
  RealTimeVADOptions,
} from '@ricky0123/vad-web/dist/real-time-vad';
import { createVad } from '../../apps/web/client/voice/vad-adapter';
import { CaptureSession } from '../../apps/web/client/voice/capture-session';
const require = createRequire(import.meta.url);
const { MicVAD } = require('@ricky0123/vad-web/dist/real-time-vad') as {
  MicVAD: typeof MicVad & { lifecyclePatchRevision?: string };
};
const { Silero } = require('@ricky0123/vad-web/dist/models/silero') as {
  Silero: {
    new: (
      ort: unknown,
      fetcher: () => Promise<ArrayBuffer>,
    ) => Promise<unknown>;
  };
};
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
type TensorValue = { data: ArrayLike<number | bigint>; dispose: () => void };
let tensors: TensorValue[],
  worklets: Worklet[],
  sources: Source[],
  sourceFailure: boolean;
let release: ReturnType<typeof vi.fn>, run: ReturnType<typeof vi.fn>;
class Tensor implements TensorValue {
  dispose = vi.fn();
  constructor(
    _type: string,
    public data: ArrayLike<number | bigint>,
  ) {
    tensors.push(this);
  }
}
class Worklet {
  port = {
    onmessage: null as
      | null
      | ((event: {
          data: { message: string; data: ArrayBuffer };
        }) => Promise<void>),
    postMessage: vi.fn(),
  };
  disconnect = vi.fn();
  connect = vi.fn();
  constructor() {
    worklets.push(this);
  }
}
class Source {
  disconnect = vi.fn(() => {
    if (sourceFailure) throw Error('disconnect failed');
  });
  connect = vi.fn();
  constructor() {
    sources.push(this);
  }
}
function context(addModule: () => Promise<void> = async () => {}) {
  return {
    audioWorklet: { addModule },
    close: vi.fn(async () => {}),
    destination: {},
    sampleRate: 48000,
  } as unknown as AudioContext;
}
function stream() {
  const stop = vi.fn();
  return {
    value: { getTracks: () => [{ stop }] } as unknown as MediaStream,
    stop,
  };
}
function options(
  ctx: AudioContext,
  s: ReturnType<typeof stream>,
  extra: Partial<RealTimeVADOptions> = {},
) {
  const origin = 'http://localhost';
  return {
    audioContext: ctx,
    startOnLoad: false,
    model: 'v5' as const,
    processorType: 'AudioWorklet' as const,
    baseAssetPath: new URL('vad/', origin).pathname,
    onnxWASMBasePath: new URL('vad/ort/', origin).pathname,
    minSpeechMs: 400,
    redemptionMs: 800,
    preSpeechPadMs: 800,
    getStream: async () => s.value,
    pauseStream: async (value: MediaStream) => {
      value.getTracks().forEach((t) => t.stop());
    },
    resumeStream: async () => s.value,
    ...extra,
  };
}
beforeEach(() => {
  tensors = [];
  worklets = [];
  sources = [];
  sourceFailure = false;
  release = vi.fn(async () => {});
  run = vi.fn(async () => ({
    stateN: new Tensor('float32', new Float32Array(256)),
    output: new Tensor('float32', [0.9]),
  }));
  vi.stubGlobal('AudioWorkletNode', Worklet);
  vi.stubGlobal('MediaStreamAudioSourceNode', Source);
  const actual = Silero.new;
  vi.spyOn(Silero, 'new').mockImplementation(() =>
    actual(
      { Tensor, InferenceSession: { create: async () => ({ run, release }) } },
      async () => new ArrayBuffer(8),
    ),
  );
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe('actual pinned MicVAD lifecycle', () => {
  it('releases allocated-never-started model via actual Silero session/state/sample-rate cleanup', async () => {
    const s = stream(),
      ctx = context(),
      vad = await MicVAD.new(options(ctx, s));
    await vad.destroy();
    expect(release).toHaveBeenCalledTimes(1);
    expect(
      tensors.find((t) => t.data[0] === 16000n)!.dispose,
    ).toHaveBeenCalledTimes(1);
    expect(tensors.at(-1)!.dispose).toHaveBeenCalledTimes(1);
    expect(s.stop).not.toHaveBeenCalled();
    expect(ctx.close).not.toHaveBeenCalled();
  });
  it('caches concurrent disposal, disconnects all nodes once and refuses future frames/start', async () => {
    const s = stream(),
      vad = await MicVAD.new(options(context(), s));
    await vad.start();
    const a = vad.destroy(),
      b = vad.destroy();
    await Promise.all([a, b]);
    expect(a).toBe(b);
    await vad.start();
    await vad.processFrame(new Float32Array(512));
    expect(s.stop).toHaveBeenCalledTimes(1);
    expect(release).toHaveBeenCalledTimes(1);
    expect(worklets[0].disconnect).toHaveBeenCalledTimes(1);
    expect(sources[0].disconnect).toHaveBeenCalledTimes(1);
    expect(worklets[0].port.onmessage).toBeNull();
    expect(vad.listening).toBe(false);
    expect(run).not.toHaveBeenCalled();
  });
  it('releases partial allocation after rejected worklet load', async () => {
    const s = stream(),
      vad = await MicVAD.new(
        options(
          context(async () => {
            throw Error('worklet failed');
          }),
          s,
        ),
      );
    await expect(vad.start()).rejects.toThrow('worklet failed');
    await vad.destroy();
    expect(s.stop).toHaveBeenCalledTimes(1);
    expect(release).toHaveBeenCalledTimes(1);
  });
  it('cancels pending permission and stops the late stream without creating/connecting nodes', async () => {
    const gate = deferred<MediaStream>(),
      s = stream(),
      vad = await MicVAD.new(
        options(context(), s, { getStream: () => gate.promise }),
      );
    const starting = vad.start(),
      disposed = vad.destroy();
    void disposed.catch(() => {});
    gate.resolve(s.value);
    await Promise.all([starting, disposed]);
    expect(s.stop).toHaveBeenCalledTimes(1);
    expect(worklets).toHaveLength(0);
    expect(sources).toHaveLength(0);
    expect(vad.listening).toBe(false);
    expect(release).toHaveBeenCalledTimes(1);
  });
  it('stops immediately during pending worklet, then cleans late node without activation', async () => {
    const gate = deferred<void>(),
      requested = deferred<void>(),
      s = stream();
    const vad = await MicVAD.new(
      options(
        context(() => {
          requested.resolve();
          return gate.promise;
        }),
        s,
      ),
    );
    const starting = vad.start();
    await requested.promise;
    const disposed = vad.destroy();
    void disposed.catch(() => {});
    const immediatelyStopped = s.stop.mock.calls.length;
    gate.resolve();
    await Promise.all([starting, disposed]);
    expect(immediatelyStopped).toBe(1);
    expect(s.stop).toHaveBeenCalledTimes(1);
    expect(worklets[0].disconnect).toHaveBeenCalledTimes(1);
    expect(sources).toHaveLength(0);
    expect(vad.listening).toBe(false);
    expect(release).toHaveBeenCalledTimes(1);
  });
  it('waits for admitted inference settlement, rejects new frames and suppresses late callbacks before release', async () => {
    const gate = deferred<{ stateN: Tensor; output: Tensor }>(),
      admitted = deferred<void>(),
      seen = vi.fn(),
      s = stream();
    run.mockImplementation(() => {
      admitted.resolve();
      return gate.promise;
    });
    const vad = await MicVAD.new(
      options(context(), s, { onFrameProcessed: seen, onSpeechStart: seen }),
    );
    await vad.start();
    const frame = vad.processFrame(new Float32Array(512));
    await admitted.promise;
    const disposed = vad.destroy();
    await new Promise<void>((resolve) => setImmediate(resolve));
    const releaseBeforeSettlement = release.mock.calls.length;
    await vad.processFrame(new Float32Array(512));
    gate.resolve({
      stateN: new Tensor('float32', new Float32Array(256)),
      output: new Tensor('float32', [0.9]),
    });
    await Promise.all([frame, disposed]);
    expect(releaseBeforeSettlement).toBe(0);
    expect(run).toHaveBeenCalledTimes(1);
    expect(seen).not.toHaveBeenCalled();
    expect(s.stop).toHaveBeenCalledTimes(1);
    expect(release).toHaveBeenCalledTimes(1);
    expect(
      tensors.find((t) => t.data[0] === 16000n)!.dispose,
    ).toHaveBeenCalledTimes(1);
    expect(tensors.at(-1)!.dispose).toHaveBeenCalledTimes(1);
  });
  it('reports cleanup failure without skipping other node/model cleanup, cached rejection or fresh allocation', async () => {
    const s = stream(),
      vad = await MicVAD.new(options(context(), s));
    await vad.start();
    sourceFailure = true;
    await expect(vad.destroy()).rejects.toThrow();
    expect(worklets[0].disconnect).toHaveBeenCalledTimes(1);
    expect(release).toHaveBeenCalledTimes(1);
    await expect(vad.destroy()).rejects.toThrow();
    expect(release).toHaveBeenCalledTimes(1);
    sourceFailure = false;
    const fresh = await MicVAD.new(options(context(), stream()));
    await fresh.start();
    expect(fresh.listening).toBe(true);
    await fresh.destroy();
  });
  it('reports a synchronous pause-hook failure but still disposes nodes and model once', async () => {
    const s = stream(),
      vad = await MicVAD.new(
        options(context(), s, {
          pauseStream: () => {
            throw Error('sync pause');
          },
        }),
      );
    await vad.start();
    await expect(Promise.resolve().then(() => vad.destroy())).rejects.toThrow();
    expect(release).toHaveBeenCalledTimes(1);
    expect(worklets[0].disconnect).toHaveBeenCalledTimes(1);
    await expect(Promise.resolve().then(() => vad.destroy())).rejects.toThrow();
    expect(release).toHaveBeenCalledTimes(1);
  });
  it('adapter uses actual patched entry and same-origin pinned options with immutable raw/confirmed/end identity', async () => {
    const origin = 'http://localhost:3000';
    vi.stubGlobal('location', { origin });
    const seen: Array<{ type: string; token: unknown }> = [],
      s = stream(),
      addModule = vi.fn(async () => {}),
      ctx = context(addModule);
    const actualNew = MicVAD.new;
    let observed: Partial<RealTimeVADOptions> | undefined;
    vi.spyOn(MicVAD, 'new').mockImplementation((options) => {
      observed = options;
      return actualNew.call(MicVAD, options);
    });
    const vad = await createVad(
      ctx,
      async () => s.value,
      async (stream) => {
        stream.getTracks().forEach((t) => t.stop());
      },
      {
        rawStart: (token) => {
          seen.push({ type: 'raw', token });
        },
        confirmedStart: (token) => {
          seen.push({ type: 'confirmed', token });
        },
        misfire: (token) => {
          seen.push({ type: 'misfire', token });
        },
        end: (token) => {
          seen.push({ type: 'end', token });
        },
        frame: () => {},
      },
    );
    expect(observed).toMatchObject({
      audioContext: ctx,
      startOnLoad: false,
      model: 'v5',
      processorType: 'AudioWorklet',
      minSpeechMs: 400,
      redemptionMs: 800,
      preSpeechPadMs: 800,
      positiveSpeechThreshold: 0.3,
      negativeSpeechThreshold: 0.25,
    });
    expect(observed!.baseAssetPath).toBe(new URL('vad/', origin).pathname);
    expect(observed!.onnxWASMBasePath).toBe(
      new URL('vad/ort/', origin).pathname,
    );
    await vad.start();
    expect(addModule).toHaveBeenCalledWith(
      new URL('vad/vad.worklet.bundle.min.js', origin).pathname,
    );
    for (let i = 0; i < 12; i++)
      await (vad as MicVad).processFrame(new Float32Array(512).fill(0.25));
    run.mockImplementation(async () => ({
      stateN: new Tensor('float32', new Float32Array(256)),
      output: new Tensor('float32', [0]),
    }));
    for (let i = 0; i < 25; i++)
      await (vad as MicVad).processFrame(new Float32Array(512));
    expect(seen.map((x) => x.type)).toEqual(['raw', 'confirmed', 'end']);
    expect(Object.isFrozen(seen[0].token)).toBe(true);
    expect(seen[1].token).toBe(seen[0].token);
    expect(seen[2].token).toBe(seen[0].token);
    await vad.destroy();
    expect(release).toHaveBeenCalledTimes(1);
  });
  it('Session stops model creation pending in the actual adapter before start and releases late actual allocation once', async () => {
    vi.stubGlobal('location', { origin: 'http://localhost:3000' });
    const gate = deferred<unknown>(),
      requested = deferred<void>();
    const factory = vi.mocked(Silero.new).getMockImplementation()!;
    vi.spyOn(Silero, 'new').mockImplementation(async (ort, fetcher) => {
      requested.resolve();
      await gate.promise;
      return factory(ort, fetcher);
    });
    const ctx = context(),
      s = stream(),
      acquire = vi.fn(async () => s.value),
      seen = vi.fn(),
      status = vi.fn();
    const session = new CaptureSession({
      createContext: () => ctx,
      acquireStream: acquire,
      createVad,
      onVadEvent: seen,
      onUtterance: seen,
      onStatus: status,
    });
    Object.assign(ctx, { resume: async () => {} });
    const started = session.start();
    void started.catch(() => {});
    await requested.promise;
    const stopped = session.stop();
    gate.resolve(undefined);
    await Promise.all([started, stopped]);
    expect(acquire).not.toHaveBeenCalled();
    expect(worklets).toHaveLength(0);
    expect(seen).not.toHaveBeenCalled();
    expect(release).toHaveBeenCalledTimes(1);
    expect(ctx.close).toHaveBeenCalledTimes(1);
    expect(status).not.toHaveBeenCalled();
  });
  it('preserves512-sample32ms hop, requested400ms quantized384ms confirmation and800ms silence segmentation', async () => {
    const events: string[] = [],
      lengths: number[] = [],
      s = stream(),
      ctx = context();
    const vad = await MicVAD.new(
      options(ctx, s, {
        onSpeechStart: () => {
          events.push('raw');
        },
        onSpeechRealStart: () => {
          events.push('confirmed');
        },
        onVADMisfire: () => {
          events.push('misfire');
        },
        onSpeechEnd: (audio) => {
          events.push('end');
          lengths.push(audio.length);
        },
      }),
    );
    await vad.start();
    for (let i = 0; i < 11; i++)
      await vad.processFrame(new Float32Array(512).fill(0.25));
    expect(events).toEqual(['raw']);
    await vad.processFrame(new Float32Array(512).fill(0.25));
    expect(events).toEqual(['raw', 'confirmed']);
    run.mockImplementation(async () => ({
      stateN: new Tensor('float32', new Float32Array(256)),
      output: new Tensor('float32', [0]),
    }));
    for (let i = 0; i < 24; i++) await vad.processFrame(new Float32Array(512));
    expect(events).toEqual(['raw', 'confirmed']);
    await vad.processFrame(new Float32Array(512));
    expect(events).toEqual(['raw', 'confirmed', 'end']);
    expect(lengths).toEqual([18944]);
    await vad.destroy();
  });
});
