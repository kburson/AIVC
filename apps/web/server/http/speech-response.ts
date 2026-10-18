import { getSpeechAdapter } from '../runtime';
import type { ServerRuntime } from '../runtime';
import { assertAdmission } from './admission';
import { readBoundedBody } from './body';
import { AppError, errorResponse } from './errors';
import { validateSpeech } from '@aivc/contracts';
import { runWithDeadline } from '../turns/deadline';
import type { Lease } from '../turns/leases';
export async function speechResponse(
  req: Request,
  runtime: ServerRuntime,
): Promise<Response> {
  let turnId: string | null = null,
    lease: Lease | undefined;
  let resolveReady!: (r: Response) => void;
  const ready = new Promise<Response>((r) => (resolveReady = r));
  const cancel = new AbortController();
  const invalid = (error: unknown) =>
    error instanceof AppError
      ? error
      : new AppError(
          502,
          'SPEECH_FAILED',
          'Speech request failed.',
          turnId,
          false,
        );
  try {
    assertAdmission(req.headers, runtime.config, true);
    const task = runWithDeadline(
      runtime.config.speechTimeoutMs,
      AbortSignal.any([req.signal, cancel.signal]),
      async (signal) => {
        let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
        let pending: Promise<ReadableStreamReadResult<Uint8Array>> | undefined;
        let cancellation: Promise<void> | undefined;
        let output: ReadableStreamDefaultController<Uint8Array> | undefined;
        let finished!: () => void;
        const done = new Promise<void>((r) => (finished = r));
        let closed = false;
        const stop = (reason: unknown) => {
          if (reader && !cancellation)
            cancellation = reader.cancel(reason).catch(() => {});
          if (!closed) {
            closed = true;
            output?.error(invalid(reason));
          }
          finished();
        };
        const onAbort = () => stop(signal.reason);
        try {
          const bytes = await readBoundedBody(req, 8192, signal);
          if (
            !/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(
              req.headers.get('content-type') ?? '',
            )
          )
            throw new AppError(
              400,
              'INVALID_REQUEST',
              'Invalid request.',
              null,
              false,
            );
          let value: unknown;
          try {
            value = JSON.parse(
              new TextDecoder('utf-8', { fatal: true }).decode(bytes),
            );
          } catch {
            throw new AppError(
              400,
              'INVALID_REQUEST',
              'Invalid request.',
              null,
              false,
            );
          }
          const input = validateSpeech(value, runtime.config.segmentChars);
          turnId = input.turnId;
          if (!runtime.capabilities.speechAvailable)
            throw new AppError(
              502,
              'SPEECH_FAILED',
              'Speech is not configured.',
              turnId,
              false,
            );
          signal.throwIfAborted();
          lease = runtime.leasePools.acquire('speech');
          const speech = await getSpeechAdapter(runtime).synthesize(
            input,
            signal,
          );
          reader = speech.stream.getReader();
          signal.addEventListener('abort', onAbort, { once: true });
          signal.throwIfAborted();
          pending = reader.read();
          const first = await pending;
          signal.throwIfAborted();
          if (first.done || !first.value?.byteLength)
            throw new AppError(
              502,
              'SPEECH_FAILED',
              'Speech provider returned invalid audio.',
              turnId,
              false,
            );
          const stream = new ReadableStream<Uint8Array>({
            start(c) {
              output = c;
              c.enqueue(first.value);
            },
            async pull(c) {
              try {
                signal.throwIfAborted();
                pending = reader!.read();
                const part = await pending;
                signal.throwIfAborted();
                if (part.done) {
                  closed = true;
                  c.close();
                  finished();
                } else c.enqueue(part.value);
              } catch (error) {
                stop(error);
              }
            },
            async cancel(reason) {
              closed = true;
              cancel.abort(
                new AppError(
                  400,
                  'TURN_INTERRUPTED',
                  'Speech interrupted.',
                  turnId,
                  false,
                ),
              );
              stop(reason);
              await cancellation;
              await pending?.catch(() => {});
            },
          });
          resolveReady(
            new Response(stream, {
              headers: {
                'content-type': 'application/octet-stream',
                'x-audio-encoding': 'pcm_s16le',
                'x-audio-sample-rate': '24000',
                'x-audio-channels': '1',
                'cache-control': 'no-store',
              },
            }),
          );
          await done;
        } catch (error) {
          stop(error);
          throw invalid(error);
        } finally {
          signal.removeEventListener('abort', onAbort);
          // read() can resolve EOF before cancel()'s underlying promise settles.
          await Promise.allSettled([pending, cancellation]);
          reader?.releaseLock();
        }
      },
    );
    void task.settled.then(() => lease?.release());
    return await Promise.race([ready, task.result.then(() => ready)]);
  } catch (error) {
    const safe = invalid(error);
    return errorResponse(
      new AppError(
        safe.httpStatus,
        safe.code,
        safe.message,
        turnId ?? safe.turnId,
        safe.retryable,
      ),
    );
  }
}
