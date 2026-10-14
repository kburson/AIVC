import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Playback } from '../../apps/web/client/voice/playback';
import { SpeechQueue } from '../../apps/web/client/voice/speech-queue';
import {
  AudioClock,
  pcm,
  settle,
  speechResponse,
  token,
} from '../voice/audio-fixture';
let queue: SpeechQueue;
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  queue?.dispose();
  vi.useRealTimers();
});
function setup() {
  const clock = new AudioClock(),
    reasons: string[] = [];
  const playback = new Playback(clock.context(), () => true);
  queue = new SpeechQueue({
    playback,
    segmentChars: 84,
    synthesize: async () => speechResponse(pcm(3)),
    isCurrent: () => true,
    onStatus: (_t, _s, r) => {
      if (r) reasons.push(r);
    },
    now: () => Date.now(),
  });
  return { clock, playback, reasons };
}
it('uses wall time to tear down a frozen audio clock after three seconds and clears all timers on dispose', async () => {
  const { clock, playback, reasons } = setup();
  queue.accept(token, 'Hello. Next');
  await settle();
  clock.state = 'suspended';
  await vi.advanceTimersByTimeAsync(3050);
  expect(reasons).toContain('PLAYBACK_STALLED');
  expect(playback.outstandingSeconds()).toBe(0);
  expect(clock.sources.every((s) => s.stopped)).toBe(true);
  queue.dispose();
  expect(vi.getTimerCount()).toBe(0);
});
it('survives a short tentative suspension and resumes the same queued answer', async () => {
  const { clock, playback, reasons } = setup();
  queue.accept(token, 'Hello. Next');
  await settle();
  queue.setTentative(token, true);
  clock.state = 'suspended';
  await vi.advanceTimersByTimeAsync(1500);
  clock.state = 'running';
  queue.setTentative(token, false);
  await vi.advanceTimersByTimeAsync(2000);
  expect(reasons).not.toContain('PLAYBACK_STALLED');
  expect(playback.outstandingSeconds()).toBeGreaterThan(0);
});
it('fails visibly within two wall seconds when initial resume remains pending with zero audio', async () => {
  const { clock, playback, reasons } = setup();
  clock.state = 'suspended';
  clock.resumeGate = new Promise(() => {});
  queue.accept(token, 'Hello. Next');
  await vi.advanceTimersByTimeAsync(2050);
  expect(reasons).toContain('SPEECH_RESUME_FAILED');
  expect(playback.outstandingSeconds()).toBe(0);
});
it('fails visibly on rejected initial resume rather than waiting forever', async () => {
  const { clock, reasons } = setup();
  clock.state = 'suspended';
  clock.resumeGate = Promise.reject(new Error('Denied'));
  queue.accept(token, 'Hello. Next');
  await settle();
  expect(reasons).toContain('SPEECH_RESUME_FAILED');
});
it('intentional cancellation excludes stalled detection and clears pending speech', async () => {
  const { clock, reasons } = setup();
  queue.accept(token, 'Hello. Next');
  await settle();
  queue.cancel(token, 'OUTPUT_MUTED');
  clock.state = 'suspended';
  await vi.advanceTimersByTimeAsync(4000);
  expect(reasons).not.toContain('PLAYBACK_STALLED');
});
