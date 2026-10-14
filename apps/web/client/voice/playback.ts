import type { TurnToken } from '../turn-controller';
type Scheduled = {
  token: TurnToken;
  source: AudioBufferSourceNode;
  start: number;
  end: number;
};
/** Dedicated output context. Only its audio clock releases generated PCM budget. */
export class Playback {
  private sources: Scheduled[] = [];
  private operations: Promise<void> = Promise.resolve();
  private disposed = false;
  constructor(
    private context: AudioContext,
    private isCurrent: (token: TurnToken) => boolean,
    initialResume: Promise<void> = Promise.resolve(),
  ) {
    this.operations = initialResume;
    void initialResume.catch(() => {});
  }
  private prune(): void {
    this.sources = this.sources.filter((entry) => {
      if (this.context.currentTime < entry.end) return true;
      entry.source.disconnect();
      return false;
    });
  }
  outstandingSeconds(): number {
    this.prune();
    const now = this.context.currentTime;
    return this.sources.reduce(
      (sum, s) => sum + Math.max(0, s.end - Math.max(now, s.start)),
      0,
    );
  }
  enqueue(token: TurnToken, samples: Float32Array): void {
    if (this.disposed || !this.isCurrent(token) || !samples.length) return;
    if (this.outstandingSeconds() + samples.length / 24000 > 10 + 1e-9)
      throw new Error('AUDIO_OVERFLOW');
    const buffer = this.context.createBuffer(1, samples.length, 24000);
    buffer.copyToChannel(new Float32Array(samples), 0);
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    const nextEnd = this.sources.reduce((end, s) => Math.max(end, s.end), 0);
    const start = Math.max(this.context.currentTime + 0.01, nextEnd);
    const entry = { token, source, start, end: start + samples.length / 24000 };
    this.sources.push(entry);
    source.onended = () => {
      if (!this.disposed && this.isCurrent(token)) this.prune();
    };
    try {
      source.start(start);
    } catch (error) {
      this.sources = this.sources.filter((s) => s !== entry);
      source.disconnect();
      throw error;
    }
  }
  isRunning(): boolean {
    return !this.disposed && this.context.state === 'running';
  }
  private serialize(action: () => Promise<void>): Promise<void> {
    const next = this.operations
      .catch(() => {})
      .then(async () => {
        if (!this.disposed) await action();
      });
    this.operations = next;
    return next;
  }
  suspend(): Promise<void> {
    return this.serialize(() => this.context.suspend());
  }
  resume(): Promise<void> {
    return this.serialize(() => this.context.resume());
  }
  async ensureRunning(token: TurnToken): Promise<void> {
    if (this.disposed || !this.isCurrent(token))
      throw new Error('TURN_INTERRUPTED');
    await this.resume();
    if (!this.isRunning() || !this.isCurrent(token))
      throw new Error('SPEECH_RESUME_FAILED');
  }
  cancel(token: TurnToken): void {
    this.sources = this.sources.filter((s) => {
      if (
        s.token.generation !== token.generation ||
        s.token.turnId !== token.turnId
      )
        return true;
      s.source.onended = null;
      try {
        s.source.stop();
      } catch {}
      s.source.disconnect();
      return false;
    });
  }
  async resetAfterCancel(): Promise<void> {
    await this.operations.catch(() => {});
  }
  async dispose(): Promise<void> {
    if (this.disposed) return;
    this.disposed = true;
    for (const s of this.sources) {
      s.source.onended = null;
      try {
        s.source.stop();
      } catch {}
      s.source.disconnect();
    }
    this.sources = [];
    await this.context.close();
  }
}
