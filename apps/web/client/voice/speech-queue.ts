import type { TurnToken } from '../turn-controller';
import type { SpeechInput } from '../../shared/contracts';
import type { Playback } from './playback';
import { PcmDecoder } from './pcm';
import { SpeechText } from './speech-text';
export type QueueOptions = {
  playback: Playback;
  synthesize?: (input: SpeechInput, signal: AbortSignal) => Promise<Response>;
  segmentChars: number;
  isCurrent: (token: TurnToken) => boolean;
  onStatus: (
    token: TurnToken,
    status: 'speaking' | 'ready' | 'failed',
    reason?: string,
  ) => void;
  now?: () => number;
};
export async function synthesizeSpeech(
  input: SpeechInput,
  signal: AbortSignal,
): Promise<Response> {
  return fetch('/api/speech', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
    signal,
  });
}
type State = {
  token: TurnToken;
  scanner: SpeechText;
  pending: string[];
  closed: boolean;
  disabled: boolean;
  stopped: boolean;
  tentative: boolean;
  busy: boolean;
  sequence: number;
  abort: AbortController | null;
  reader: ReadableStreamDefaultReader<Uint8Array> | null;
  resumeAt: number | null;
  stallAt: number | null;
  readyReported: boolean;
  notice: string | undefined;
};
/** Request-level backpressure. Active small bodies are always drained promptly. */
export class SpeechQueue {
  private state: State | null = null;
  private disposed = false;
  private timer: ReturnType<typeof setInterval>;
  private transportBusy = false;
  private now: () => number;
  constructor(private options: QueueOptions) {
    this.now = options.now ?? (() => performance.now());
    this.timer = setInterval(() => this.tick(), 25);
  }
  private current(state: State): boolean {
    return (
      !this.disposed &&
      this.state === state &&
      !state.stopped &&
      this.options.isCurrent(state.token)
    );
  }
  private get(token: TurnToken): State | null {
    if (this.disposed || !this.options.isCurrent(token)) return null;
    if (
      this.state?.token.generation === token.generation &&
      this.state.token.turnId === token.turnId
    )
      return this.state;
    if (this.state) this.cancel(this.state.token, 'TURN_INTERRUPTED');
    const state: State = {
      token,
      scanner: new SpeechText(this.options.segmentChars, (reason) => {
        state.notice = reason;
        this.options.onStatus(token, 'failed', reason);
      }),
      pending: [],
      closed: false,
      disabled: false,
      stopped: false,
      tentative: false,
      busy: false,
      sequence: 0,
      abort: null,
      reader: null,
      resumeAt: null,
      stallAt: null,
      readyReported: false,
      notice: undefined,
    };
    this.state = state;
    return state;
  }
  accept(token: TurnToken, text: string): void {
    const state = this.get(token);
    if (!state || state.disabled || state.closed) return;
    if (
      state.scanner.pendingChars() +
        state.pending.reduce((n, t) => n + t.length, 0) +
        text.length >
      2400
    ) {
      state.disabled = true;
      state.pending = [];
      state.scanner = new SpeechText(this.options.segmentChars);
      this.options.onStatus(token, 'failed', 'SPEECH_TEXT_OVERFLOW');
      return;
    }
    state.pending.push(...state.scanner.push(text));
    this.pump(state);
  }
  flush(token: TurnToken): void {
    const state = this.get(token);
    if (!state || state.disabled || state.closed) return;
    state.closed = true;
    state.pending.push(...state.scanner.finish());
    this.pump(state);
  }
  setTentative(token: TurnToken, value: boolean): void {
    const state = this.get(token);
    if (!state || state.stopped) return;
    state.tentative = value;
    if (!value) this.pump(state);
  }
  private failure(state: State, reason: string): void {
    if (!this.current(state)) return;
    state.disabled = true;
    state.stopped = true;
    state.pending = [];
    state.scanner = new SpeechText(this.options.segmentChars);
    state.resumeAt = null;
    state.stallAt = null;
    state.abort?.abort();
    void state.reader?.cancel().catch(() => {});
    this.options.playback.cancel(state.token);
    void this.options.playback.resetAfterCancel().catch(() => {});
    this.options.onStatus(state.token, 'failed', reason);
  }
  private tick(): void {
    const state = this.state;
    if (!state || this.disposed || state.stopped) return;
    if (!this.options.isCurrent(state.token)) {
      this.cancel(state.token, 'TURN_INTERRUPTED');
      return;
    }
    const outstanding = this.options.playback.outstandingSeconds();
    if (outstanding > 0 && !this.options.playback.isRunning()) {
      state.stallAt ??= this.now();
      if (this.now() - state.stallAt > 3000) {
        this.failure(state, 'PLAYBACK_STALLED');
        return;
      }
    } else state.stallAt = null;
    if (state.resumeAt !== null && this.now() - state.resumeAt >= 2000) {
      this.failure(state, 'SPEECH_RESUME_FAILED');
      return;
    }
    if (
      !state.disabled &&
      !state.busy &&
      !state.pending.length &&
      state.closed &&
      outstanding === 0 &&
      !state.readyReported
    ) {
      state.readyReported = true;
      this.options.onStatus(state.token, 'ready', state.notice);
    }
    this.pump(state);
  }
  private pump(state: State): void {
    if (
      !this.current(state) ||
      state.disabled ||
      state.tentative ||
      state.busy ||
      this.transportBusy ||
      !state.pending.length ||
      this.options.playback.outstandingSeconds() > 2 ||
      (!this.options.playback.isRunning() &&
        this.options.playback.outstandingSeconds() > 0)
    )
      return;
    state.busy = true;
    void this.run(state);
  }
  private async run(state: State): Promise<void> {
    const playback = this.options.playback;
    let ownsTransport = false;
    try {
      state.resumeAt = this.now();
      try {
        await playback.ensureRunning(state.token);
      } catch {
        this.failure(state, 'SPEECH_RESUME_FAILED');
        return;
      }
      state.resumeAt = null;
      if (
        !this.current(state) ||
        state.disabled ||
        state.tentative ||
        !playback.isRunning() ||
        this.transportBusy
      )
        return;
      const text = state.pending.shift();
      if (!text) return;
      const abort = new AbortController();
      state.abort = abort;
      this.transportBusy = true;
      ownsTransport = true;
      const response = await (this.options.synthesize ?? synthesizeSpeech)(
        {
          turnId: state.token.turnId,
          segmentId: String(++state.sequence),
          text,
        },
        abort.signal,
      );
      if (!this.current(state)) {
        await response.body?.cancel().catch(() => {});
        return;
      }
      if (!response.ok) {
        await response.body?.cancel().catch(() => {});
        throw new Error('SPEECH_FAILED');
      }
      const headers = response.headers;
      if (
        headers.get('content-type')?.split(';')[0].trim().toLowerCase() !==
          'application/octet-stream' ||
        headers.get('x-audio-encoding') !== 'pcm_s16le' ||
        headers.get('x-audio-sample-rate') !== '24000' ||
        headers.get('x-audio-channels') !== '1' ||
        !response.body
      ) {
        await response.body?.cancel().catch(() => {});
        throw new Error('INVALID_PCM');
      }
      const reader = response.body.getReader();
      state.reader = reader;
      const decoder = new PcmDecoder();
      let samples = 0;
      try {
        while (true) {
          const part = await reader.read();
          if (!this.current(state)) return;
          if (part.done) break;
          const decoded = decoder.push(part.value);
          samples += decoded.length;
          if (samples > 240000) throw new Error('AUDIO_OVERFLOW');
          playback.enqueue(state.token, decoded);
          if (decoded.length && !state.disabled)
            this.options.onStatus(state.token, 'speaking', state.notice);
        }
        decoder.finish();
      } finally {
        await reader.cancel().catch(() => {});
        reader.releaseLock();
        state.reader = null;
      }
    } catch (error) {
      this.failure(
        state,
        error instanceof Error && error.message === 'AUDIO_OVERFLOW'
          ? 'AUDIO_OVERFLOW'
          : 'SPEECH_FAILED',
      );
    } finally {
      state.busy = false;
      state.resumeAt = null;
      state.abort = null;
      if (ownsTransport) this.transportBusy = false;
      if (this.state) this.pump(this.state);
    }
  }
  cancel(token: TurnToken, reason: string): void {
    const state = this.state;
    if (
      !state ||
      state.token.generation !== token.generation ||
      state.token.turnId !== token.turnId
    )
      return;
    state.stopped = true;
    state.disabled = true;
    state.pending = [];
    state.resumeAt = null;
    state.stallAt = null;
    state.scanner = new SpeechText(this.options.segmentChars);
    state.abort?.abort(new Error(reason));
    void state.reader?.cancel().catch(() => {});
    this.options.playback.cancel(token);
  }
  dispose(): void {
    if (this.disposed) return;
    if (this.state) this.cancel(this.state.token, 'DISPOSED');
    this.disposed = true;
    clearInterval(this.timer);
  }
}
