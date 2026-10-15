// Controlled adapter observation only; no microphone/provider/physical acceptance.
import { afterEach, expect, it, vi } from 'vitest';
const boundary = vi.hoisted(() => ({
  options: null as Record<string, (...args: never[]) => void> | null,
}));
vi.mock('@ricky0123/vad-web', () => ({
  MicVAD: {
    lifecyclePatchRevision: 'aivc-vad-lifecycle-v1',
    new: vi.fn(async (options) => {
      boundary.options = options;
      return {
        start: async () => {},
        pause: async () => {},
        destroy: async () => {},
      };
    }),
  },
}));
import { createVad } from '../../apps/web/client/voice/vad-adapter';
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  performance.clearMarks();
});
it('retains the two-argument end callback and observes frame timing only inside the adapter', async () => {
  vi.stubGlobal('location', { origin: 'http://localhost:3000' });
  let now = 100;
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  const end = vi.fn();
  await createVad({} as AudioContext, vi.fn(), vi.fn(), {
    rawStart: vi.fn(),
    confirmedStart: vi.fn(),
    misfire: vi.fn(),
    frame: vi.fn(),
    end,
  });
  const options = boundary.options!;
  options.onSpeechStart();
  options.onSpeechRealStart();
  now = 200;
  (
    options.onFrameProcessed as unknown as (
      p: { isSpeech: number },
      samples: Float32Array,
    ) => void
  )({ isSpeech: 0.9 }, new Float32Array(512));
  now = 1000;
  const audio = new Float32Array(1600);
  (options.onSpeechEnd as unknown as (samples: Float32Array) => void)(audio);
  expect(end).toHaveBeenCalledTimes(1);
  expect(end.mock.calls[0]).toHaveLength(2);
  expect(end.mock.calls[0][1]).toBe(audio);
  const marks = performance
    .getEntriesByType('mark')
    .filter((entry) =>
      entry.name.startsWith('aivc.vad-frame-end:'),
    ) as PerformanceMark[];
  expect(marks).toHaveLength(1);
  expect(marks[0].detail).toMatchObject({
    lastSpeechFrameAt: 200,
    vadEndDelayMs: 800,
  });
});
