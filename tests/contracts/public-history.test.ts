import { describe, expect, it } from 'vitest';
import { retainPairs } from '../../apps/web/shared/history';
describe('public whole-pair history retention', () => {
  it('omits an oversized newest pair and still bounds earlier pairs', () => {
    const pairs = Array.from(
      { length: 6 },
      (_, index) =>
        [
          { role: 'user' as const, content: 'question ' + index },
          { role: 'assistant' as const, content: 'answer ' + index },
        ] as const,
    );
    const result = retainPairs([
      ...pairs,
      [
        { role: 'user', content: 'x'.repeat(16000) },
        { role: 'assistant', content: 'y' },
      ],
    ]);
    expect(result.omitted).toBe(true);
    expect(result.pairs).toEqual(pairs.slice(2));
    result.pairs[0][0].content = 'changed';
    expect(pairs[2][0].content).toBe('question 2');
  });
});

it('retains exactly four whole pairs at the 16000 character boundary', () => {
  const pairs = Array.from(
    { length: 4 },
    () =>
      [
        { role: 'user' as const, content: 'x'.repeat(2000) },
        { role: 'assistant' as const, content: 'y'.repeat(2000) },
      ] as const,
  );
  expect(retainPairs(pairs)).toEqual({ pairs, omitted: false });
});
it('drops whole oldest pairs for characters even below the pair-count limit', () => {
  const pairs = Array.from(
    { length: 3 },
    (_, i) =>
      [
        { role: 'user' as const, content: String(i).repeat(5000) },
        { role: 'assistant' as const, content: 'y'.repeat(1000) },
      ] as const,
  );
  expect(retainPairs(pairs)).toEqual({ pairs: pairs.slice(1), omitted: false });
});
it('retains empty history and does not mutate incoming arrays', () => {
  expect(retainPairs([])).toEqual({ pairs: [], omitted: false });
  const pairs = [
    [
      { role: 'user' as const, content: 'u' },
      { role: 'assistant' as const, content: 'a' },
    ],
  ] as const;
  const result = retainPairs(pairs);
  result.pairs.pop();
  expect(pairs.length).toBe(1);
});
