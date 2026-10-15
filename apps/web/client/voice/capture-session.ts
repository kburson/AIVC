import { observe } from '../measurements';
import {
  createVad,
  type CaptureToken,
  type VadCallbacks,
  type VadHandle,
} from './vad-adapter';
import { encodeWav } from './wav';
export type { CaptureToken } from './vad-adapter';
export type CaptureReason =
  | 'CAPTURE_PERMISSION_DENIED'
  | 'CAPTURE_LOAD_FAILED'
  | 'CAPTURE_OVERLONG'
  | 'CAPTURE_CLEANUP_FAILED';
export type CaptureVadEvent = {
  type: 'rawStart' | 'confirmedStart' | 'misfire';
  capture: CaptureToken;
};
type Dependencies = {
  createContext: () => AudioContext;
  acquireStream: () => Promise<MediaStream>;
  createVad: typeof createVad;
  onVadEvent: (event: CaptureVadEvent) => void;
  onUtterance: (token: CaptureToken, wav: Blob) => void;
  onStatus: (reason: CaptureReason) => void;
};
type Candidate = {
  token: CaptureToken;
  phase: 'tentative' | 'confirmed' | 'consumed';
};
type Run = {
  epoch: number;
  context: AudioContext;
  vad?: VadHandle;
  pending?: Promise<void>;
  streams: Set<MediaStream>;
  tokens: WeakMap<CaptureToken, Candidate>;
  candidate?: Candidate;
  segmentSamples: number;
  lastFrameSamples: number;
  segmentActive: boolean;
  shutdown?: Promise<void>;
};
class CanceledCapture extends Error {}
/** A caller-owned capture context and current-only utterance lifecycle; no turn/network/playback ownership. */
export class CaptureSession {
  private epoch = 0;
  private intentVersion = 0;
  private utteranceId = 0;
  private mode: 'stopped' | 'starting' | 'running' | 'muted' | 'restarting' =
    'stopped';
  private context: AudioContext | null = null;
  private run: Run | null = null;
  private runs = new Set<Run>();
  private current: Candidate | null = null;
  private pending: Promise<void> | null = null;
  private recovery: Promise<void> | null = null;
  private stopping: Promise<void> | null = null;
  private stoppedTracks = new WeakSet<MediaStreamTrack>();
  private trackStopFailures = new WeakMap<
    MediaStreamTrack,
    { error: unknown }
  >();
  private closedContexts = new WeakSet<AudioContext>();
  private destroyedVads = new WeakMap<VadHandle, Promise<void>>();
  constructor(private readonly deps: Dependencies) {}
  start(): Promise<void> {
    if (this.pending) return this.pending;
    if (this.mode === 'running') return Promise.resolve();
    if (this.recovery && this.mode === 'restarting') return this.recovery;
    if (this.context) return this.begin(this.context, Promise.resolve());
    let context: AudioContext | null = null;
    try {
      context = this.deps.createContext();
      this.context = context;
      const resumed = context.resume(); // Must start synchronously in the caller's Start gesture.
      return this.begin(context, resumed);
    } catch (error) {
      this.context = null;
      this.mode = 'stopped';
      this.deps.onStatus('CAPTURE_LOAD_FAILED');
      return (context ? this.closeContext(context) : Promise.resolve()).then(
        () => {
          throw error;
        },
      );
    }
  }
  invalidateIntent(): void {
    this.intentVersion++;
    this.current = null;
  }
  isCurrent(token: CaptureToken): boolean {
    return (
      this.current?.token === token &&
      token.epoch === this.epoch &&
      token.intentVersion === this.intentVersion &&
      this.mode === 'running'
    );
  }
  mute(): Promise<void> {
    if (this.mode === 'stopped' || this.mode === 'muted')
      return Promise.resolve();
    this.mode = 'muted';
    this.epoch++;
    this.invalidateIntent();
    this.run = null;
    return this.shutdownAll();
  }
  unmute(): Promise<void> {
    if (this.mode !== 'muted' || !this.context)
      return this.pending ?? Promise.resolve();
    return this.begin(this.context, Promise.resolve());
  }
  stop(): Promise<void> {
    if (this.stopping) return this.stopping;
    const context = this.context,
      recovery = this.recovery;
    this.context = null;
    this.run = null;
    this.mode = 'stopped';
    this.epoch++;
    this.invalidateIntent();
    // shutdownAll invokes destroy synchronously before awaiting pending start/model work.
    const shutting = this.shutdownAll();
    this.stopping = (async () => {
      const errors: unknown[] = [];
      try {
        await shutting;
      } catch (error) {
        errors.push(error);
      }
      try {
        await recovery;
      } catch (error) {
        errors.push(error);
      }
      if (context)
        try {
          await this.closeContext(context);
        } catch (error) {
          errors.push(error);
        }
      if (errors.length) {
        this.deps.onStatus('CAPTURE_CLEANUP_FAILED');
        throw new AggregateError(errors, 'Capture cleanup failed.');
      }
    })();
    return this.stopping;
  }
  private active(run: Run): boolean {
    return (
      this.run === run &&
      run.epoch === this.epoch &&
      (this.mode === 'starting' || this.mode === 'running')
    );
  }
  private begin(context: AudioContext, resumed: Promise<void>): Promise<void> {
    this.mode = 'starting';
    this.stopping = null;
    this.epoch++;
    this.invalidateIntent();
    const run: Run = {
      epoch: this.epoch,
      context,
      streams: new Set(),
      tokens: new WeakMap(),
      segmentSamples: 0,
      lastFrameSamples: 0,
      segmentActive: false,
    };
    this.run = run;
    this.runs.add(run);
    const operation = this.initialize(run, resumed).finally(() => {
      if (this.pending === operation) this.pending = null;
    });
    run.pending = operation;
    this.pending = operation;
    return operation;
  }
  private async initialize(run: Run, resumed: Promise<void>): Promise<void> {
    try {
      await resumed;
      if (!this.active(run)) return;
      run.vad = await this.deps.createVad(
        run.context,
        async () => {
          const stream = await this.deps.acquireStream();
          run.streams.add(stream);
          if (!this.active(run)) {
            await this.stopStream(stream);
            throw new CanceledCapture();
          }
          const tracks = stream.getTracks();
          if (
            !tracks.length ||
            tracks.some(
              (track) =>
                this.stoppedTracks.has(track) || track.readyState === 'ended',
            )
          )
            throw new Error('Microphone stream is not fresh and usable');
          return stream;
        },
        (stream) => this.stopStream(stream),
        this.callbacks(run),
      );
      if (!this.active(run)) {
        await this.destroyVad(run.vad);
        return;
      }
      await run.vad.start();
      if (!this.active(run)) {
        await this.destroyVad(run.vad);
        return;
      }
      this.mode = 'running';
    } catch (error) {
      if (!this.active(run)) {
        if (error instanceof CanceledCapture) return;
        // Obsolete load errors are benign; cached cleanup outcomes remain observable through shutdown.
        return;
      }
      this.run = null;
      this.context = null;
      this.mode = 'stopped';
      this.epoch++;
      this.invalidateIntent();
      const name = error instanceof Error ? error.name : '';
      this.deps.onStatus(
        name === 'NotAllowedError' || name === 'SecurityError'
          ? 'CAPTURE_PERMISSION_DENIED'
          : 'CAPTURE_LOAD_FAILED',
      );
      const tasks = [
        this.destroyVad(run.vad),
        ...Array.from(run.streams, (stream) => this.stopStream(stream)),
        this.closeContext(run.context),
      ];
      const outcomes = await Promise.allSettled(tasks);
      this.runs.delete(run);
      if (outcomes.some((outcome) => outcome.status === 'rejected'))
        this.deps.onStatus('CAPTURE_CLEANUP_FAILED');
      throw error;
    }
  }
  private callbacks(run: Run): VadCallbacks {
    const candidate = (internal: CaptureToken) => run.tokens.get(internal);
    return {
      rawStart: (internal) => {
        if (
          !this.active(run) ||
          this.mode !== 'running' ||
          run.tokens.has(internal)
        )
          return;
        const next: Candidate = {
          token: Object.freeze({
            epoch: run.epoch,
            utteranceId: ++this.utteranceId,
            intentVersion: this.intentVersion,
          }),
          phase: 'tentative',
        };
        run.tokens.set(internal, next);
        run.candidate = next;
        this.current = next;
        run.segmentActive = true;
        run.segmentSamples = 12800 + run.lastFrameSamples;
        this.deps.onVadEvent({ type: 'rawStart', capture: next.token });
      },
      confirmedStart: (internal) => {
        const c = candidate(internal);
        if (!c || c.phase !== 'tentative' || !this.isCurrent(c.token)) return;
        c.phase = 'confirmed';
        this.deps.onVadEvent({ type: 'confirmedStart', capture: c.token });
      },
      misfire: (internal) => {
        const c = candidate(internal);
        if (!c || c.phase !== 'tentative' || run.candidate !== c) return;
        run.segmentActive = false;
        c.phase = 'consumed';
        if (this.isCurrent(c.token))
          this.deps.onVadEvent({ type: 'misfire', capture: c.token });
        if (this.current === c) this.current = null;
      },
      end: (internal, samples) => {
        const c = candidate(internal);
        if (!c || run.candidate !== c || c.phase === 'consumed') return;
        run.segmentActive = false;
        if (c.phase !== 'confirmed' || !this.isCurrent(c.token)) {
          c.phase = 'consumed';
          return;
        }
        if (samples.length > 480000) {
          this.overlong(run);
          return;
        }
        c.phase = 'consumed'; // Consume before the callback so reentrant duplicate end cannot notify again.
        try {
          observe('vad-end', {
            captureEpoch: c.token.epoch,
            utteranceId: c.token.utteranceId,
            intentVersion: c.token.intentVersion,
          });
          this.deps.onUtterance(c.token, encodeWav(samples));
        } catch {
          this.deps.onStatus('CAPTURE_LOAD_FAILED');
        }
      },
      frame: (samples) => {
        if (!this.active(run) || this.mode !== 'running') return;
        run.lastFrameSamples = samples.length;
        // Continue bounding the internal segment even after a typed intent invalidates its public token.
        if (!run.segmentActive) return;
        run.segmentSamples += samples.length;
        if (run.segmentSamples >= 480000) this.overlong(run);
      },
    };
  }
  private overlong(run: Run): void {
    if (!this.active(run)) return;
    this.deps.onStatus('CAPTURE_OVERLONG');
    this.mode = 'restarting';
    this.run = null;
    this.epoch++;
    this.invalidateIntent();
    const epoch = this.epoch,
      context = this.context;
    const shutting = this.shutdown(run); // Cancels VAD immediately; never awaits inside a frame callback.
    this.recovery = (async () => {
      await shutting;
      if (
        this.mode === 'restarting' &&
        this.epoch === epoch &&
        context &&
        this.context === context
      )
        await this.begin(context, Promise.resolve());
    })()
      .catch(() => {
        this.deps.onStatus('CAPTURE_CLEANUP_FAILED');
        if (this.mode === 'restarting') this.mode = 'muted';
      })
      .finally(() => {
        this.recovery = null;
      });
  }
  private async stopStream(stream: MediaStream): Promise<void> {
    const errors: unknown[] = [];
    for (const track of stream.getTracks()) {
      if (this.stoppedTracks.has(track)) {
        const failure = this.trackStopFailures.get(track);
        if (failure) errors.push(failure.error);
        continue;
      }
      this.stoppedTracks.add(track);
      try {
        track.stop();
      } catch (error) {
        this.trackStopFailures.set(track, { error });
        errors.push(error);
      }
    }
    if (errors.length)
      throw new AggregateError(errors, 'Microphone cleanup failed.');
  }
  private destroyVad(vad?: VadHandle): Promise<void> {
    if (!vad) return Promise.resolve();
    const existing = this.destroyedVads.get(vad);
    if (existing) return existing;
    let disposal: Promise<void>;
    try {
      disposal = vad.destroy();
    } catch (error) {
      disposal = Promise.reject(error);
    }
    this.destroyedVads.set(vad, disposal);
    return disposal;
  }
  private closeContext(context: AudioContext): Promise<void> {
    if (this.closedContexts.has(context)) return Promise.resolve();
    this.closedContexts.add(context);
    return context.close();
  }
  private shutdownAll(): Promise<void> {
    const tasks = Array.from(this.runs, (run) => this.shutdown(run));
    return Promise.allSettled(tasks).then((outcomes) => {
      const errors = outcomes.flatMap((outcome) =>
        outcome.status === 'rejected' ? [outcome.reason] : [],
      );
      if (errors.length) {
        this.deps.onStatus('CAPTURE_CLEANUP_FAILED');
        throw new AggregateError(errors, 'Capture cleanup failed.');
      }
    });
  }
  private shutdown(run: Run): Promise<void> {
    if (run.shutdown) return run.shutdown;
    const immediate = Promise.allSettled([
      this.destroyVad(run.vad),
      ...Array.from(run.streams, (stream) => this.stopStream(stream)),
    ]);
    run.shutdown = (async () => {
      const errors: unknown[] = [];
      try {
        await run.pending;
      } catch (error) {
        if (!(error instanceof CanceledCapture)) errors.push(error);
      }
      const outcomes = await immediate;
      for (const outcome of outcomes)
        if (outcome.status === 'rejected') errors.push(outcome.reason);
      const late = await Promise.allSettled([
        this.destroyVad(run.vad),
        ...Array.from(run.streams, (stream) => this.stopStream(stream)),
      ]);
      for (const outcome of late)
        if (outcome.status === 'rejected' && !errors.includes(outcome.reason))
          errors.push(outcome.reason);
      this.runs.delete(run);
      if (errors.length)
        throw new AggregateError(errors, 'Capture cleanup failed.');
    })();
    return run.shutdown;
  }
}
