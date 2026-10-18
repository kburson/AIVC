import type { TurnInput } from '@aivc/contracts';
import { AppError } from './errors';
import { parseTurn } from '@aivc/contracts';
import type { ServerConfig } from '../config';
import { assertAdmission } from './admission';
import { runWithDeadline } from '../turns/deadline';
import type { DeadlineRun } from '../turns/deadline';
export async function readBoundedBody(
  req: Request,
  maxBytes: number,
  signal: AbortSignal,
): Promise<Uint8Array> {
  signal.throwIfAborted();
  const reader = req.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let total = 0;
  const cancel = (reason?: unknown) => {
    void reader.cancel(reason).catch(() => {});
  };
  const onAbort = () => cancel(signal.reason);
  signal.addEventListener('abort', onAbort, { once: true });
  try {
    signal.throwIfAborted();
    while (true) {
      const { done, value } = await reader.read();
      signal.throwIfAborted();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        cancel();
        throw new AppError(
          413,
          'BODY_TOO_LARGE',
          maxBytes === 2097152
            ? 'Request exceeds 2 MiB.'
            : 'Request exceeds the body limit.',
          null,
          false,
        );
      }
      chunks.push(value.slice());
    }
  } finally {
    signal.removeEventListener('abort', onAbort);
    reader.releaseLock();
  }
  const output = new Uint8Array(total);
  let at = 0;
  for (const chunk of chunks) {
    output.set(chunk, at);
    at += chunk.length;
  }
  return output;
}
// The callback must await the producer and all admitted upstream work; returning a Response alone is not settlement.
// The caller owns its paid lease and releases it from settled, never from result.
export function runAdmittedTurn<T>(
  req: Request,
  config: ServerConfig,
  work: (input: TurnInput, signal: AbortSignal) => Promise<T>,
  caller: AbortSignal = req.signal,
): DeadlineRun<T> {
  assertAdmission(req.headers, config, true);
  return runWithDeadline(config.turnTimeoutMs, caller, async (signal) => {
    const bytes = await readBoundedBody(req, 2097152, signal);
    const input = await parseTurn(bytes, req.headers.get('content-type') ?? '');
    signal.throwIfAborted();
    return work(input, signal);
  });
}
