import { expect, it } from 'vitest';
import { acquireLease } from '../../apps/web/server/turns/leases';
import { runWithDeadline } from '../../apps/web/server/turns/deadline';
it('real timers return a deadline failure while cancellation-ignoring upstream still occupies its slot', async () => {
  const first = acquireLease('turn'),
    second = acquireLease('turn');
  let finish!: () => void;
  const upstream = new Promise<void>((resolve) => {
    finish = resolve;
  });
  const running = runWithDeadline(
    30,
    new AbortController().signal,
    () => upstream,
  );
  void running.settled.then(() => first.release());
  await expect(running.result).rejects.toMatchObject({
    httpStatus: 504,
    code: 'TURN_DEADLINE',
  });
  expect(() => acquireLease('turn')).toThrowError(/busy/i);
  finish();
  await running.settled;
  const next = acquireLease('turn');
  next.release();
  second.release();
});
