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
  private pendingOperations = 1;
  private operationEpoch = 0;
  private suspension: Promise<void> | null = null;
  constructor(
    private context: AudioContext,
    private isCurrent: (token: TurnToken) => boolean,
    initialResume: Promise<void> = Promise.resolve(),
    private createContext?: () => AudioContext,
  ) {
    this.operations = initialResume.finally(() => {
      if (this.operationEpoch === 0) this.pendingOperations--;
    });
    void this.operations.catch(() => {});
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
  private track(operation: Promise<void>, epoch: number): Promise<void> {
    this.pendingOperations++;
    const tracked = operation.finally(() => {
      if (this.operationEpoch === epoch) this.pendingOperations--;
    });
    this.operations = tracked;
    return tracked;
  }
  private serialize(action: () => Promise<void>): Promise<void> {
    const epoch = this.operationEpoch;
    return this.track(
      this.operations
        .catch(() => {})
        .then(async () => {
          if (!this.disposed && this.operationEpoch === epoch) await action();
        }),
      epoch,
    );
  }
  suspend(): Promise<void> {
    const context = this.context;
    const operation = this.serialize(() => context.suspend());
    this.suspension = operation;
    void operation
      .finally(() => {
        if (this.suspension === operation) this.suspension = null;
      })
      .catch(() => {});
    return operation;
  }
  resume(): Promise<void> {
    if (this.disposed) return Promise.resolve();
    // Preserve user activation for an idle reused playback context.
    if (this.pendingOperations === 0)
      return this.track(this.context.resume(), this.operationEpoch);
    const context = this.context;
    return this.serialize(() => context.resume());
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
    if (this.disposed) return;
    await this.suspension?.catch(() => {});
    if (this.disposed) return;
    if (!this.isRunning() && this.createContext && this.pendingOperations > 0) {
      // A failed native resume may never settle. Replace the empty context;
      // late operations can affect only the closed former context.
      const former = this.context;
      const replacement = this.createContext();
      this.context = replacement;
      this.operationEpoch++;
      this.pendingOperations = 0;
      this.operations = Promise.resolve();
      void former.close().catch(() => {});
      await this.resume();
      if (!this.isRunning()) throw new Error('SPEECH_RESUME_FAILED');
      return;
    }
    await this.operations.catch(() => {});
    await this.resume();
    if (!this.disposed && !this.isRunning())
      throw new Error('SPEECH_RESUME_FAILED');
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
