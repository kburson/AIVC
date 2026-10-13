import { describe, expect, it } from 'vitest';
import { HistoryStore } from '../../apps/web/client/history';
import { validateHistory } from '../../apps/web/shared/validation';
import type { TurnStatus } from '../../apps/web/shared/contracts';
const token = { generation: 1, turnId: '11111111-1111-4111-8111-111111111111' };
describe('completed context', () => {
  it('commits an immutable complete pair once and ignores a stale token', () => {
    let current = true;
    const store = new HistoryStore(() => current);
    store.complete(token, 'Atlas?', 'Atlas is active.', 'complete');
    store.complete(token, 'Atlas?', 'duplicate', 'complete');
    expect(store.messages()).toEqual([
      { role: 'user', content: 'Atlas?' },
      { role: 'assistant', content: 'Atlas is active.' },
    ]);
    const snapshot = store.messages();
    expect(() => {
      snapshot[0].content = 'mutated';
    }).toThrow();
    current = false;
    store.complete({ ...token, generation: 2 }, 'Beacon?', 'late', 'complete');
    expect(store.messages()).toHaveLength(2);
  });
  it.each<TurnStatus>(['failed', 'truncated', 'interrupted', 'no-speech'])(
    'excludes both messages for %s',
    (status) => {
      const store = new HistoryStore(() => true);
      store.complete(token, 'Atlas?', 'partial', status);
      expect(store.messages()).toEqual([]);
    },
  );
  it('excludes pre-transcript completion and a new store has no old context', () => {
    const store = new HistoryStore(() => true);
    store.complete(token, '', 'unrecognized', 'complete');
    expect(store.messages()).toEqual([]);
    store.complete(token, 'Atlas?', 'answer', 'complete');
    expect(new HistoryStore(() => true).messages()).toEqual([]);
  });
  it('drops whole oldest pairs at the four-pair limit', () => {
    const store = new HistoryStore(() => true);
    for (let i = 0; i < 5; i++)
      store.complete(
        { ...token, generation: i, turnId: String(i) },
        'question' + i,
        'answer' + i,
        'complete',
      );
    expect(store.messages()).toHaveLength(8);
    expect(store.messages()[0]).toEqual({ role: 'user', content: 'question1' });
  });
  it('omits an oversized newest pair without discarding older context', () => {
    const store = new HistoryStore(() => true);
    store.complete(token, 'old', 'answer', 'complete');
    expect(
      store.complete(
        { ...token, generation: 2, turnId: 'new' },
        'new',
        'x'.repeat(16000),
        'complete',
      ),
    ).toEqual({ omitted: true });
    expect(store.messages()).toEqual([
      { role: 'user', content: 'old' },
      { role: 'assistant', content: 'answer' },
    ]);
  });
  it('trims whole pairs to the UTF-16 character cap', () => {
    const store = new HistoryStore(() => true);
    store.complete(token, 'first', 'x'.repeat(9000), 'complete');
    store.complete(
      { ...token, generation: 2, turnId: 'second' },
      'second',
      '😀'.repeat(4000),
      'complete',
    );
    expect(store.messages()).toEqual([
      { role: 'user', content: 'second' },
      { role: 'assistant', content: '😀'.repeat(4000) },
    ]);
  });
  it('consumes the frozen validator rejection boundaries', () => {
    expect(() =>
      validateHistory(
        Array.from({ length: 9 }, (_, i) => ({
          role: i % 2 ? 'assistant' : 'user',
          content: 'x',
        })),
      ),
    ).toThrow();
    expect(() =>
      validateHistory([
        { role: 'assistant', content: 'x' },
        { role: 'user', content: 'x' },
      ]),
    ).toThrow();
    expect(() =>
      validateHistory([
        { role: 'user', content: 'x' },
        { role: 'assistant', content: 'x'.repeat(16000) },
      ]),
    ).toThrow();
  });
});
