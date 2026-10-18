import { AppError } from '@aivc/contracts';
export type DeadlineRun<T> = {
  result: Promise<T>;
  settled: Promise<void>;
  signal: AbortSignal;
};
const state = globalThis as typeof globalThis & {
  __aivcDeadlinesV1?: WeakMap<AbortSignal, number>;
};
const deadlines = (state.__aivcDeadlinesV1 ??= new WeakMap<
  AbortSignal,
  number
>());
export function deadlineRemainingMs(signal: AbortSignal): number {
  const at = deadlines.get(signal);
  return at === undefined ? Infinity : Math.max(0, at - performance.now());
}
export function runWithDeadline<T>(
  ms: number,
  caller: AbortSignal,
  work: (signal: AbortSignal) => Promise<T>,
): DeadlineRun<T> {
  if (!Number.isFinite(ms) || ms <= 0 || ms > 2147483647)
    throw new AppError(
      400,
      'INVALID_REQUEST',
      'Invalid deadline.',
      null,
      false,
    );
  const remaining = Math.min(ms, deadlineRemainingMs(caller));
  const controller = new AbortController();
  deadlines.set(controller.signal, performance.now() + remaining);
  let resolveResult!: (value: T) => void,
    rejectResult!: (reason: unknown) => void;
  const result = new Promise<T>((resolve, reject) => {
    resolveResult = resolve;
    rejectResult = reject;
  });
  // Observers can attach after the caller has already aborted; retain rejection semantics without a background unhandled rejection.
  void result.catch(() => {});
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cleanup = () => {
    if (timer !== undefined) clearTimeout(timer);
    caller.removeEventListener('abort', onAbort);
  };
  const abort = (reason: unknown) => {
    controller.abort(reason);
    rejectResult(reason);
    cleanup();
  };
  const onAbort = () => abort(caller.reason);
  const timeout = () =>
    abort(
      new AppError(
        504,
        'TURN_DEADLINE',
        'Turn deadline exceeded.',
        null,
        false,
      ),
    );
  if (caller.aborted) onAbort();
  else if (remaining <= 0) timeout();
  else {
    caller.addEventListener('abort', onAbort, { once: true });
    timer = setTimeout(timeout, remaining);
  }
  const upstream = Promise.resolve().then(() => {
    controller.signal.throwIfAborted();
    return work(controller.signal);
  });
  // Only this continuation proves the work actually settled; timeout-facing result never owns a lease release.
  const settled = upstream.then(
    (value) => {
      cleanup();
      resolveResult(value);
    },
    (error: unknown) => {
      cleanup();
      rejectResult(error);
    },
  );
  return { result, settled, signal: controller.signal };
}
