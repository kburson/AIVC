/** Browser User Timing observations only: no text, audio, credentials or remote-abort claim. */
export type Measurement = {
  turnId?: string;
  segmentId?: string;
  captureEpoch?: number;
  utteranceId?: number;
  intentVersion?: number;
  revision?: string;
  scheduledAfterMs?: number;
  lastSpeechFrameAt?: number;
  vadEndDelayMs?: number;
};
const keys = [
  'turnId',
  'segmentId',
  'captureEpoch',
  'utteranceId',
  'intentVersion',
  'revision',
  'scheduledAfterMs',
  'lastSpeechFrameAt',
  'vadEndDelayMs',
] as const;
const retained: string[] = [];
let sequence = 0;
export function observe(event: string, detail: Measurement): void {
  try {
    const safe = Object.fromEntries(
      keys.flatMap((key) => {
        const value = detail[key];
        return typeof value === 'string' ||
          (typeof value === 'number' && Number.isFinite(value))
          ? [[key, value]]
          : [];
      }),
    );
    const name = 'aivc.' + event + ':' + ++sequence;
    performance.mark(name, { detail: safe });
    retained.push(name);
    while (retained.length > 512) performance.clearMarks(retained.shift()!);
  } catch {
    /* Measurement availability never owns product progress. */
  }
}
