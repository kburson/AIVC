import { afterEach, expect, it } from 'vitest';
import { observe } from '../../apps/web/client/measurements';
afterEach(() => performance.clearMarks());
it('keeps correlated monotonic boundary marks without retaining private text or audio', () => {
  observe('turn-request', {
    turnId: 'test-turn',
    text: 'private question',
    audio: new Uint8Array([1]),
  } as Parameters<typeof observe>[1]);
  const [mark] = performance
    .getEntriesByType('mark')
    .filter((mark) =>
      mark.name.startsWith('aivc.turn-request:'),
    ) as PerformanceMark[];
  expect(mark.startTime).toBeGreaterThanOrEqual(0);
  expect(mark.detail).toEqual({ turnId: 'test-turn' });
});
it('bounds retained observations and never interrupts product behavior when instrumentation fails', () => {
  for (let i = 0; i < 600; i++) observe('turn-request', { turnId: String(i) });
  expect(
    performance
      .getEntriesByType('mark')
      .filter((mark) => mark.name.startsWith('aivc.turn-request:')),
  ).toHaveLength(512);
  const original = performance.mark;
  performance.mark = () => {
    throw new Error('Unavailable User Timing');
  };
  try {
    expect(() => observe('turn-request', {})).not.toThrow();
  } finally {
    performance.mark = original;
  }
});
