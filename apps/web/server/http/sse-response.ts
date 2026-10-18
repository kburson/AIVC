import type { TurnEvent } from '@aivc/contracts';
import { encodeSse } from '@aivc/contracts';
import { AppError, errorFields, errorResponse } from './errors';
import { assertAdmission } from './admission';
import { runAdmittedTurn } from './body';
import { getTurnDeps } from '../runtime';
import type { ServerRuntime } from '../runtime';
import type { Lease } from '../turns/leases';
import { runTurn } from '../turns/run-turn';
export async function turnResponse(
  req: Request,
  runtime: ServerRuntime,
): Promise<Response> {
  let turnId: string | null = null;
  let lease: Lease | undefined;
  let accepted = false,
    terminal = false,
    closed = false,
    canceled = false,
    nextSeq = 0;
  let controller: ReadableStreamDefaultController<Uint8Array> | undefined;
  let resolveResponse!: (response: Response) => void;
  const ready = new Promise<Response>((resolve) => {
    resolveResponse = resolve;
  });
  const cancel = new AbortController();
  const close = () => {
    if (!closed && !canceled) {
      closed = true;
      controller?.close();
    }
  };
  const send = (event: TurnEvent) => {
    if (closed || canceled || terminal) return;
    const encoded = encodeSse(event);
    controller!.enqueue(encoded);
    nextSeq = event.seq + 1;
    if (event.type === 'turn.completed' || event.type === 'turn.failed')
      terminal = true;
  };
  try {
    assertAdmission(req.headers, runtime.config, true);
    if (req.signal.aborted)
      throw new AppError(
        400,
        'TURN_INTERRUPTED',
        'Turn interrupted.',
        null,
        false,
      );
    const task = runAdmittedTurn(
      req,
      runtime.config,
      async (input, signal) => {
        turnId = input.turnId;
        signal.throwIfAborted();
        lease = runtime.leasePools.acquire('turn');
        const deps = getTurnDeps(runtime);
        const stream = new ReadableStream<Uint8Array>({
          start(c) {
            controller = c;
          },
          cancel() {
            canceled = true;
            closed = true;
            cancel.abort(
              new AppError(
                400,
                'TURN_INTERRUPTED',
                'Turn interrupted.',
                input.turnId,
                false,
              ),
            );
          },
        });
        const response = new Response(stream, {
          headers: {
            'content-type': 'text/event-stream',
            'cache-control': 'no-cache, no-transform',
          },
        });
        try {
          for await (const event of runTurn(input, deps, signal)) {
            send(event);
            if (event.type === 'turn.accepted') {
              accepted = true;
              resolveResponse(response);
            }
          }
        } finally {
          close();
        }
      },
      AbortSignal.any([req.signal, cancel.signal]),
    );
    // Client-facing timeout/cancellation is not proof that paid upstream settled.
    void task.settled.then(() => lease?.release());
    void task.result.catch((error) => {
      if (accepted && !terminal && !canceled && !closed) {
        const failure =
          task.signal.aborted && !(task.signal.reason instanceof AppError)
            ? new AppError(
                400,
                'TURN_INTERRUPTED',
                'Turn interrupted.',
                turnId,
                false,
              )
            : error;
        send({
          schemaVersion: 1,
          turnId: turnId!,
          seq: nextSeq,
          type: 'turn.failed',
          data: { ...errorFields(failure), turnId },
        });
        close();
      }
    });
    return await Promise.race([ready, task.result.then(() => ready)]);
  } catch (error) {
    const response = errorResponse(error);
    return Response.json(
      {
        error: {
          ...errorFields(error),
          turnId: turnId ?? errorFields(error).turnId,
        },
      },
      { status: response.status, headers: response.headers },
    );
  }
}
