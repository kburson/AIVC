import type { TurnController, TurnToken } from '../turn-controller';
import type { CaptureToken } from './capture-session';
import type { Playback } from './playback';
import type { SpeechQueue } from './speech-queue';
export type Candidate = {
  capture: CaptureToken;
  answerToken: TurnToken | null;
  phase: 'tentative' | 'confirmed' | 'consumed';
};
type Output = { playback: Playback; queue: SpeechQueue };
type Pause = {
  candidate: Candidate;
  output: Output;
  settled: Promise<void>;
  restorable: boolean;
};
type Dependencies = {
  controller: Pick<TurnController, 'current' | 'cancelCurrent'>;
  answerToken: () => TurnToken | null;
  output: () => Output | null;
  captureIsCurrent: (capture: CaptureToken) => boolean;
  isActive: () => boolean;
  onEnd: (capture: CaptureToken, samples: Float32Array) => void;
  showSpeechResumeFailure: (error: unknown) => void;
};
const same = (a: TurnToken, b: TurnToken) =>
  a.generation === b.generation && a.turnId === b.turnId;
/** Captured-utterance ownership is independent of the answer it interrupts. */
export class Interruption {
  private candidate: Candidate | null = null;
  private pause: Pause | null = null;
  private transition = 0;
  constructor(private deps: Dependencies) {}
  rawStart(capture: CaptureToken): void {
    if (!this.deps.isActive() || !this.deps.captureIsCurrent(capture)) return;
    if (this.candidate) this.candidate.phase = 'consumed';
    this.transition++;
    const answerToken = this.deps.answerToken();
    const candidate: Candidate = { capture, answerToken, phase: 'tentative' };
    this.candidate = candidate;
    const output = this.deps.output();
    this.pause = output
      ? { candidate, output, settled: Promise.resolve(), restorable: true }
      : null;
    if (output && answerToken && this.deps.controller.current(answerToken)) {
      output.queue.setTentative(answerToken, true);
      const pause = this.pause!;
      pause.settled = output.playback.suspend();
      void pause.settled.catch((error) => {
        if (this.owns(pause) && candidate.phase === 'tentative') {
          this.stopRetained(pause);
          this.report(error, ++this.transition);
        }
      });
    }
  }
  confirmedStart(capture: CaptureToken): void {
    const candidate = this.candidate;
    if (
      !candidate ||
      candidate.capture !== capture ||
      candidate.phase !== 'tentative' ||
      !this.deps.isActive() ||
      !this.deps.captureIsCurrent(capture)
    )
      return;
    candidate.phase = 'confirmed'; // Canceling the answer must not revoke capture.
    const version = ++this.transition;
    const old = candidate.answerToken;
    if (old && this.deps.controller.current(old)) {
      this.deps.controller.cancelCurrent(
        'Interrupted by speech. This turn was not added to context.',
      );
      const output = this.deps.output();
      output?.queue.cancel(old, 'interrupted');
      output?.playback.cancel(old);
    }
    const pause = this.pause;
    if (pause) {
      pause.restorable = false;
      void this.recoverEmpty(pause, version);
    }
  }
  misfire(capture: CaptureToken): void {
    const candidate = this.candidate;
    if (
      !candidate ||
      candidate.capture !== capture ||
      candidate.phase !== 'tentative' ||
      !this.deps.isActive() ||
      !this.deps.captureIsCurrent(capture)
    )
      return;
    // Admission is synchronous: CaptureSession clears isCurrent after this observer.
    candidate.phase = 'consumed';
    this.candidate = null;
    const version = ++this.transition;
    if (this.pause) void this.restore(this.pause, version);
  }
  /** Shared consume-once gate for CaptureSession's one already-encoded WAV owner. */
  admitEnd(capture: CaptureToken): boolean {
    const candidate = this.candidate;
    if (
      !candidate ||
      candidate.capture !== capture ||
      candidate.phase !== 'confirmed' ||
      !this.deps.isActive() ||
      !this.deps.captureIsCurrent(capture)
    )
      return false;
    candidate.phase = 'consumed';
    this.candidate = null;
    return true;
  }
  end(capture: CaptureToken, samples: Float32Array): void {
    if (this.admitEnd(capture)) this.deps.onEnd(capture, samples);
  }
  cancel(): void {
    const candidate = this.candidate;
    if (candidate) candidate.phase = 'consumed';
    this.candidate = null;
    const version = ++this.transition;
    if (this.pause) void this.restore(this.pause, version);
  }
  /** Watchdog/mute may destroy audio while its capture candidate remains valid. */
  outputStopped(token: TurnToken): void {
    if (
      this.pause?.candidate.answerToken &&
      same(this.pause.candidate.answerToken, token)
    )
      this.pause.restorable = false;
  }
  private owns(pause: Pause): boolean {
    return (
      this.pause === pause &&
      this.deps.isActive() &&
      this.deps.output() === pause.output
    );
  }
  private report(error: unknown, version: number): void {
    if (this.deps.isActive() && version === this.transition)
      this.deps.showSpeechResumeFailure(error);
  }
  private stopRetained(pause: Pause): void {
    pause.restorable = false;
    const old = pause.candidate.answerToken;
    if (old) {
      pause.output.queue.cancel(old, 'SPEECH_RESUME_FAILED');
      pause.output.playback.cancel(old);
    }
  }
  private async recoverEmpty(pause: Pause, version: number): Promise<void> {
    try {
      await pause.settled.catch(() => {});
      // A newer tentative candidate owns suspension until it resolves.
      if (!this.owns(pause) || version !== this.transition) return;
      await pause.output.playback.resetAfterCancel();
      if (
        this.owns(pause) &&
        version === this.transition &&
        !pause.output.playback.isRunning()
      )
        throw new Error('SPEECH_RESUME_FAILED');
    } catch (error) {
      this.report(error, version);
    }
  }
  private async restore(pause: Pause, version: number): Promise<void> {
    try {
      await pause.settled;
      if (!this.owns(pause) || version !== this.transition) return;
      const old = pause.candidate.answerToken;
      if (!pause.restorable || !old || !this.deps.controller.current(old)) {
        this.stopRetained(pause);
        await this.recoverEmpty(pause, version);
        return;
      }
      await pause.output.playback.resume();
      if (
        !this.owns(pause) ||
        version !== this.transition ||
        !this.deps.controller.current(old)
      )
        return;
      if (!pause.output.playback.isRunning())
        throw new Error('SPEECH_RESUME_FAILED');
      pause.output.queue.setTentative(old, false);
    } catch (error) {
      if (!this.owns(pause) || version !== this.transition) return;
      this.stopRetained(pause);
      this.report(error, version);
      await this.recoverEmpty(pause, version);
    }
  }
}
