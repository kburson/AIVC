import { afterEach, expect, it, vi } from 'vitest';
import {
  acquireLease,
  getLeasePools,
} from '../../apps/orchestrator/src/turns/leases.js';
import {
  runWithDeadline,
  deadlineRemainingMs,
} from '../../apps/orchestrator/src/turns/deadline.js';
afterEach(() => vi.useRealTimers());
function deferred<T>() {
  let resolve!: (value: T) => void, reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
it('has separate two-slot pools, rejects the third, and releases idempotently', () => {
  const turn1 = acquireLease('turn'),
    turn2 = acquireLease('turn');
  const speech1 = acquireLease('speech'),
    speech2 = acquireLease('speech');
  expect(() => acquireLease('turn')).toThrowError(/busy/i);
  expect(() => acquireLease('speech')).toThrowError(/busy/i);
  turn1.release();
  turn1.release();
  const third = acquireLease('turn');
  expect(() => acquireLease('turn')).toThrowError(/busy/i);
  third.release();
  turn2.release();
  speech1.release();
  speech2.release();
});
it('preserves pools through module reload', async () => {
  const pools = getLeasePools();
  vi.resetModules();
  expect(
    (
      await import('../../apps/orchestrator/src/turns/leases.js')
    ).getLeasePools(),
  ).toBe(pools);
});
it.each(['deadline', 'caller'] as const)(
  'holds a lease until cancellation-ignoring work actually settles after %s',
  async (kind) => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
    const work = deferred<string>(),
      caller = new AbortController();
    const first = acquireLease('turn'),
      second = acquireLease('turn');
    const running = runWithDeadline(20, caller.signal, () => work.promise);
    void running.settled.then(() => first.release());
    const rejected = expect(running.result).rejects.toMatchObject(
      kind === 'deadline'
        ? { code: 'TURN_DEADLINE', httpStatus: 504 }
        : { name: 'AbortError' },
    );
    await Promise.resolve();
    if (kind === 'deadline') await vi.advanceTimersByTimeAsync(20);
    else caller.abort();
    await rejected;
    expect(running.signal.aborted).toBe(true);
    expect(() => acquireLease('turn')).toThrowError(/busy/i);
    work.resolve('late answer');
    await running.settled;
    await Promise.resolve();
    const admitted = acquireLease('turn');
    admitted.release();
    second.release();
  },
);
it('consumes a late upstream rejection and resolves settled after result already ended', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
  const work = deferred<void>(),
    caller = new AbortController();
  const running = runWithDeadline(10, caller.signal, () => work.promise);
  const rejection = expect(running.result).rejects.toMatchObject({
    code: 'TURN_DEADLINE',
  });
  await vi.advanceTimersByTimeAsync(10);
  await rejection;
  let settled = false;
  void running.settled.then(() => {
    settled = true;
  });
  await Promise.resolve();
  expect(settled).toBe(false);
  work.reject(new Error('late upstream failure'));
  await expect(running.settled).resolves.toBeUndefined();
});
it('propagates ordinary work result/failure and does not run a pre-aborted caller', async () => {
  const caller = new AbortController();
  const success = runWithDeadline(100, caller.signal, async () => 42);
  expect(await success.result).toBe(42);
  await success.settled;
  const expected = new Error('controlled work failure');
  const failure = runWithDeadline(100, caller.signal, async () => {
    throw expected;
  });
  await expect(failure.result).rejects.toBe(expected);
  await failure.settled;
  caller.abort();
  const work = vi.fn();
  const canceled = runWithDeadline(100, caller.signal, work);
  await expect(canceled.result).rejects.toMatchObject({ name: 'AbortError' });
  await canceled.settled;
  expect(work).not.toHaveBeenCalled();
});
it('uses a monotonic registered deadline and preserves the earlier inherited bound', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] });
  const outerWork = deferred<void>(),
    innerWork = deferred<void>();
  const outer = runWithDeadline(
    100,
    new AbortController().signal,
    () => outerWork.promise,
  );
  expect(deadlineRemainingMs(outer.signal)).toBe(100);
  expect(deadlineRemainingMs(new AbortController().signal)).toBe(Infinity);
  await vi.advanceTimersByTimeAsync(30);
  expect(deadlineRemainingMs(outer.signal)).toBe(70);
  const inner = runWithDeadline(500, outer.signal, () => innerWork.promise);
  expect(deadlineRemainingMs(inner.signal)).toBe(70);
  const rejection1 = expect(outer.result).rejects.toMatchObject({
    code: 'TURN_DEADLINE',
  });
  const rejection2 = expect(inner.result).rejects.toMatchObject({
    code: 'TURN_DEADLINE',
  });
  await vi.advanceTimersByTimeAsync(70);
  await rejection1;
  await rejection2;
  expect(deadlineRemainingMs(outer.signal)).toBe(0);
  outerWork.resolve();
  innerWork.resolve();
  await outer.settled;
  await inner.settled;
});
it('removes timeout and caller listener after settlement', async () => {
  vi.useFakeTimers();
  const caller = new AbortController();
  const remove = vi.spyOn(caller.signal, 'removeEventListener');
  const running = runWithDeadline(500, caller.signal, async () => 'done');
  await running.result;
  await running.settled;
  expect(vi.getTimerCount()).toBe(0);
  expect(remove).toHaveBeenCalledWith('abort', expect.any(Function));
  caller.abort();
  expect(running.signal.aborted).toBe(false);
});
