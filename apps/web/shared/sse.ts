import type { TurnEvent } from './contracts';
import { validateTurnEvent } from './validation';
export type SseDecodeCode = 'STREAM_DISCONNECTED' | 'INVALID_STREAM';
export class SseDecodeError extends Error {
  constructor(
    readonly code: SseDecodeCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'SseDecodeError';
  }
}
function invalid(message = 'The server sent an invalid response.'): never {
  throw new SseDecodeError('INVALID_STREAM', message);
}
function disconnected(cause?: unknown): SseDecodeError {
  return new SseDecodeError(
    'STREAM_DISCONNECTED',
    'Connection ended before terminal.',
    cause === undefined ? undefined : { cause },
  );
}
function validated(value: unknown): TurnEvent {
  try {
    return validateTurnEvent(value);
  } catch (error) {
    throw new SseDecodeError(
      'INVALID_STREAM',
      'Invalid event envelope or payload.',
      { cause: error },
    );
  }
}
export function encodeSse(value: TurnEvent): Uint8Array {
  const e = validated(value);
  const canonical = {
    schemaVersion: e.schemaVersion,
    turnId: e.turnId,
    seq: e.seq,
    type: e.type,
    data: e.data,
  };
  return new TextEncoder().encode(
    'event: ' + e.type + '\ndata: ' + JSON.stringify(canonical) + '\n\n',
  );
}
class TurnGrammar {
  private turnId: string | null = null;
  private next = 0;
  terminal = false;
  private pendingTool = false;
  private transcript = false;
  private work = false;
  private text = '';
  accept(e: TurnEvent): void {
    if (this.terminal || e.seq !== this.next)
      invalid('Invalid sequence or post-terminal event.');
    if (this.next === 0) {
      if (e.type !== 'turn.accepted')
        invalid('Stream must begin with acceptance.');
      this.turnId = e.turnId;
    } else if (e.type === 'turn.accepted' || e.turnId !== this.turnId)
      invalid('Duplicate acceptance or mixed turn.');
    switch (e.type) {
      case 'stage':
        if (e.data.stage === 'transcribing') {
          if (this.work || this.transcript)
            invalid('Transcribing follows answer work.');
        } else if (e.data.stage === 'retrieving') {
          if (!this.pendingTool)
            invalid('Retrieval stage has no dispatched tool.');
        } else this.work = true;
        break;
      case 'transcript.final':
        if (this.transcript || this.work || !e.data.text.trim())
          invalid('Invalid transcription ordering.');
        this.transcript = true;
        break;
      case 'tool.started':
        if (this.pendingTool) invalid('Concurrent lookup dispatch.');
        this.pendingTool = true;
        this.work = true;
        break;
      case 'tool.completed':
        if (!this.pendingTool) invalid('Lookup result without dispatch.');
        this.pendingTool = false;
        break;
      case 'answer.delta':
        if (this.pendingTool) invalid('Answer while lookup is pending.');
        this.work = true;
        this.text += e.data.text;
        break;
      case 'sources':
        if (this.pendingTool) invalid('Sources while lookup is pending.');
        this.work = true;
        break;
      case 'turn.completed':
        if (this.pendingTool || e.data.text !== this.text)
          invalid('Invalid completion text or unsettled lookup.');
        if (
          e.data.status === 'no-speech' &&
          (this.work || this.transcript || e.data.text !== '')
        )
          invalid('No-speech contains model work.');
        this.terminal = true;
        break;
      case 'turn.failed':
        this.terminal = true;
        break;
    }
    this.next++;
  }
}
export function assertTurnSequence(events: ReadonlyArray<TurnEvent>): void {
  const grammar = new TurnGrammar();
  for (const e of events) grammar.accept(validated(e));
  if (!grammar.terminal) invalid('Collected stream has no terminal.');
}
function parseFrame(
  lines: readonly string[],
  terminated: boolean,
): TurnEvent | null {
  const data: string[] = [];
  const labels: string[] = [];
  for (const line of lines) {
    if (line.startsWith(':')) continue;
    const at = line.indexOf(':');
    const field = at < 0 ? line : line.slice(0, at);
    let value = at < 0 ? '' : line.slice(at + 1);
    if (value.startsWith(' ')) value = value.slice(1);
    if (field === 'data') data.push(value);
    else if (field === 'event') labels.push(value);
  }
  if (!data.length) return null;
  let value: unknown;
  try {
    value = JSON.parse(data.join('\n'));
  } catch (error) {
    if (!terminated) throw disconnected(error);
    throw new SseDecodeError(
      'INVALID_STREAM',
      'Malformed terminated JSON frame.',
      { cause: error },
    );
  }
  const event = validated(value);
  if (labels.some((label) => label !== event.type))
    invalid('SSE event label disagrees with envelope.');
  return event;
}
export async function* decodeSse(
  bytes: AsyncIterable<Uint8Array>,
): AsyncIterable<TurnEvent> {
  const decoder = new TextDecoder('utf-8', { fatal: true }),
    grammar = new TurnGrammar();
  let buffer = '';
  let lines: string[] = [];
  function* consume(text: string): Generator<TurnEvent> {
    buffer += text;
    let at: number;
    while ((at = buffer.indexOf('\n')) >= 0) {
      let line = buffer.slice(0, at);
      buffer = buffer.slice(at + 1);
      if (line.endsWith('\r')) line = line.slice(0, -1);
      if (line === '') {
        const event = parseFrame(lines, true);
        lines = [];
        if (event) {
          grammar.accept(event);
          yield event;
        }
      } else lines.push(line);
    }
  }
  let iterator: AsyncIterator<Uint8Array>;
  try {
    iterator = bytes[Symbol.asyncIterator]();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw disconnected(error);
  }
  let ended = false;
  let failed = false;
  try {
    while (true) {
      let result: IteratorResult<Uint8Array>;
      try {
        result = await iterator.next();
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') throw error;
        if (grammar.terminal) return;
        throw disconnected(error);
      }
      if (result.done) {
        ended = true;
        break;
      }
      let text: string;
      try {
        text = decoder.decode(result.value, { stream: true });
      } catch (error) {
        throw new SseDecodeError('INVALID_STREAM', 'Invalid UTF-8 stream.', {
          cause: error,
        });
      }
      yield* consume(text);
    }
    let tail: string;
    try {
      tail = decoder.decode();
    } catch (error) {
      throw disconnected(error);
    }
    yield* consume(tail);
    if (buffer.length)
      lines.push(buffer.endsWith('\r') ? buffer.slice(0, -1) : buffer);
    if (lines.length) {
      const event = parseFrame(lines, false);
      if (event) {
        grammar.accept(event);
        yield event;
      }
    }
    if (!grammar.terminal) throw disconnected();
  } catch (error) {
    failed = true;
    throw error;
  } finally {
    if (!ended && iterator.return) {
      try {
        await iterator.return();
      } catch (error) {
        if (!failed) throw error;
      }
    }
  }
}
