import { observe } from './measurements';
import { AppError } from '../shared/contracts';
import type { HistoryMessage, TurnEvent } from '../shared/contracts';
import { parseTurn, validateHistory } from '../shared/validation';
import { decodeSse, SseDecodeError } from '../shared/sse';
import type { TurnToken } from './turn-controller';
export async function* startTurn(
  token: TurnToken,
  input: { text?: string; wav?: Blob },
  history: HistoryMessage[],
  signal: AbortSignal,
): AsyncIterable<TurnEvent> {
  if (
    (input.text !== undefined) === (input.wav !== undefined) ||
    (input.text !== undefined &&
      (!input.text.trim() || input.text.length > 2000))
  )
    throw new AppError(
      400,
      'INVALID_REQUEST',
      'Invalid request.',
      token.turnId,
      false,
    );
  const form = new FormData();
  form.set('turnId', token.turnId);
  form.set('history', JSON.stringify(validateHistory(history)));
  if (input.text !== undefined) form.set('text', input.text);
  else if (input.wav) form.set('audio', input.wav, 'question.wav');
  const request = new Request(new URL('api/turn', window.location.origin), {
    method: 'POST',
    body: form,
    signal,
  });
  // Measure and validate the serialized multipart body with the immutable contract.
  await parseTurn(
    new Uint8Array(await request.clone().arrayBuffer()),
    request.headers.get('content-type') ?? '',
  );
  signal.throwIfAborted();
  let response: Response;
  try {
    observe('turn-request', { turnId: token.turnId });
    response = await fetch(request);
    observe('turn-headers', { turnId: token.turnId });
  } catch (error) {
    if (
      signal.aborted ||
      (error instanceof Error && error.name === 'AbortError')
    )
      throw error;
    throw new SseDecodeError(
      'STREAM_DISCONNECTED',
      'Connection ended before the answer completed.',
      { cause: error },
    );
  }
  signal.throwIfAborted();
  if (!response.ok) {
    let value: unknown;
    try {
      value = await response.json();
    } catch {
      throw new SseDecodeError('INVALID_STREAM', 'Invalid error response.');
    }
    const error = (
      value as {
        error?: {
          code?: unknown;
          message?: unknown;
          turnId?: unknown;
          retryable?: unknown;
        };
      }
    )?.error;
    if (
      !error ||
      typeof error.code !== 'string' ||
      typeof error.message !== 'string' ||
      typeof error.retryable !== 'boolean' ||
      !(error.turnId === null || error.turnId === token.turnId)
    )
      throw new SseDecodeError('INVALID_STREAM', 'Invalid error response.');
    throw new AppError(
      response.status,
      error.code,
      error.message,
      error.turnId as string | null,
      error.retryable,
    );
  }
  if (
    !response.headers
      .get('content-type')
      ?.toLowerCase()
      .startsWith('text/event-stream') ||
    !response.body
  )
    throw new SseDecodeError('INVALID_STREAM', 'Expected a turn stream.');
  const reader = response.body.getReader();
  async function* bytes() {
    try {
      while (true) {
        signal.throwIfAborted();
        const chunk = await reader.read();
        if (chunk.done) return;
        yield chunk.value;
      }
    } finally {
      await reader.cancel().catch(() => {});
      reader.releaseLock();
    }
  }
  let terminal: TurnEvent | undefined;
  for await (const e of decodeSse(bytes())) {
    signal.throwIfAborted();
    observe(e.type === 'stage' ? 'stage-' + e.data.stage : e.type, {
      turnId: token.turnId,
    });
    if (e.turnId !== token.turnId)
      throw new SseDecodeError('INVALID_STREAM', 'Mismatched turn.');
    // Delay terminal publication until the codec accepts the entire stream.
    if (e.type === 'turn.completed' || e.type === 'turn.failed') terminal = e;
    else yield e;
  }
  signal.throwIfAborted();
  if (terminal) yield terminal;
}
