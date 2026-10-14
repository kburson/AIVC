import { AppError } from '../shared/contracts';
import type {
  ProjectRecord,
  Source,
  TurnEvent,
  TurnStatus,
  Usage,
} from '../shared/contracts';
import { validateTurnEvent } from '../shared/validation';
import { assertTurnSequence, SseDecodeError } from '../shared/sse';
export type TurnToken = { generation: number; turnId: string };
export type SpeechStatus =
  'unavailable' | 'muted' | 'failed' | 'interrupted' | 'ready' | 'speaking';
export type TurnView = TurnToken & {
  user: string;
  question: string;
  text: string;
  status: TurnStatus | 'working';
  projects: ProjectRecord[];
  sources: Source[];
  trace: string[];
  reason: string | null;
  code: string | null;
  speech: SpeechStatus;
  speechReason: string | null;
  terminal: boolean;
  mode: 'live' | 'mock' | null;
  usage?: Usage;
};
export function clientReason(code: string): string {
  if (code === 'STREAM_DISCONNECTED')
    return 'Connection ended before the answer completed.';
  if (code === 'INVALID_STREAM') return 'The server sent an invalid response.';
  if (code.includes('BUSY'))
    return 'The service is busy. Submit a new question when ready.';
  if (code.includes('RATE_LIMIT'))
    return 'The provider rate limit was reached. Try a new question later.';
  if (code.includes('TRANSCRI'))
    return 'Transcription failed. Type a question or try speaking again.';
  if (code.includes('RETRIEV'))
    return 'Project retrieval failed. Submit a new question when ready.';
  if (code.includes('SPEECH'))
    return 'Speech failed. Your answer text is retained.';
  if (code === 'SEARCH_UNAVAILABLE')
    return 'Web search is unavailable. Submit a new question without search.';
  if (code === 'INVALID_REQUEST')
    return 'Enter a question of 1–2,000 characters.';
  if (code.includes('TIMEOUT') || code.includes('DEADLINE'))
    return 'The request timed out. Submit a new question when ready.';
  return 'The answer could not be completed. Submit a new question when ready.';
}
export class TurnController {
  private generation = 0;
  private token: TurnToken | null = null;
  private abort: AbortController | null = null;
  private events: TurnEvent[] = [];
  private views: TurnView[] = [];
  private listeners = new Set<() => void>();
  getSnapshot = (): readonly TurnView[] => this.views;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private publish(view: TurnView): void {
    this.views = this.views.map((old) =>
      old.turnId === view.turnId ? view : old,
    );
    for (const listener of this.listeners) listener();
  }
  private view(): TurnView | undefined {
    return this.views.at(-1);
  }
  begin(): TurnToken {
    this.cancelCurrent('A new question interrupted this turn.');
    const token = {
      generation: ++this.generation,
      turnId: crypto.randomUUID(),
    };
    this.token = token;
    this.abort = null;
    this.events = [];
    this.views = [
      ...this.views,
      {
        ...token,
        user: '',
        question: '',
        text: '',
        status: 'working',
        projects: [],
        sources: [],
        trace: [],
        reason: null,
        code: null,
        speech: 'unavailable',
        speechReason: null,
        terminal: false,
        mode: null,
      },
    ];
    for (const listener of this.listeners) listener();
    return token;
  }
  current(token: TurnToken): boolean {
    return (
      this.token?.turnId === token.turnId &&
      this.token.generation === token.generation &&
      this.generation === token.generation
    );
  }
  attachAbort(token: TurnToken, controller: AbortController): void {
    if (!this.current(token)) {
      controller.abort();
      return;
    }
    this.abort = controller;
  }
  cancelCurrent(reason: string): void {
    if (!this.token) return;
    this.abort?.abort();
    const view = this.view();
    this.generation++;
    this.token = null;
    this.abort = null;
    if (view) {
      if (!view.terminal)
        this.publish({
          ...view,
          status: 'interrupted',
          terminal: true,
          reason,
          speech: 'interrupted',
          speechReason: 'Output interrupted.',
        });
      else if (view.status === 'complete')
        this.publish({
          ...view,
          speech: 'interrupted',
          speechReason: 'Output interrupted. Answer text is retained.',
        });
    }
  }
  setUser(token: TurnToken, text: string): void {
    const view = this.view();
    if (this.current(token) && view)
      this.publish({ ...view, user: text, question: text });
  }
  setSpeech(token: TurnToken, status: SpeechStatus, reason?: string): void {
    const view = this.view();
    if (this.current(token) && view)
      this.publish({ ...view, speech: status, speechReason: reason ?? null });
  }
  fail(token: TurnToken, error: unknown): void {
    if (!this.current(token)) return;
    const view = this.view();
    if (!view) return;
    const code =
      error instanceof AppError || error instanceof SseDecodeError
        ? error.code
        : 'STREAM_DISCONNECTED';
    this.publish({
      ...view,
      status: 'failed',
      terminal: true,
      code,
      reason: clientReason(code),
      trace: [...view.trace, 'Answer failed'],
    });
  }
  apply(token: TurnToken, event: TurnEvent): void {
    if (!this.current(token)) return;
    const view = this.view();
    if (!view) return;
    let e: TurnEvent;
    try {
      e = validateTurnEvent(event);
      if (e.turnId !== token.turnId || view.terminal)
        throw new SseDecodeError('INVALID_STREAM', 'Invalid current turn.');
      const candidate = [...this.events, e];
      const terminal = e.type === 'turn.completed' || e.type === 'turn.failed';
      // Frozen grammar validates a prefix using a validation-only failed terminal.
      // This sentinel is never emitted, rendered, or committed to history.
      assertTurnSequence(
        terminal
          ? candidate
          : [
              ...candidate,
              {
                schemaVersion: 1,
                turnId: token.turnId,
                seq: candidate.length,
                type: 'turn.failed',
                data: {
                  code: 'PREFIX_VALIDATION',
                  message: 'Validation only.',
                  turnId: token.turnId,
                  retryable: false,
                },
              },
            ],
      );
      this.events = candidate;
    } catch (error) {
      const invalid =
        error instanceof SseDecodeError
          ? error
          : new SseDecodeError('INVALID_STREAM', 'Invalid event.', {
              cause: error,
            });
      this.fail(token, invalid);
      throw invalid;
    }
    let next: TurnView = { ...view };
    switch (e.type) {
      case 'turn.accepted':
        next = {
          ...next,
          mode: e.data.mode,
          trace: [...next.trace, 'Turn accepted'],
        };
        break;
      case 'stage':
        next = {
          ...next,
          trace: [
            ...next.trace,
            {
              transcribing: 'Transcribing',
              researching: 'Researching',
              retrieving: 'Retrieving projects',
              answering: 'Answering',
            }[e.data.stage],
          ],
        };
        break;
      case 'transcript.final':
        next = {
          ...next,
          user: e.data.text,
          trace: [...next.trace, 'Question recognized'],
        };
        break;
      case 'tool.started':
        next = { ...next, trace: [...next.trace, 'Project lookup started'] };
        break;
      case 'tool.completed':
        next = {
          ...next,
          projects: [
            ...new Map(
              [...next.projects, ...e.data.result.records].map((p) => [
                p.id,
                p,
              ]),
            ).values(),
          ],
          trace: [...next.trace, 'Project lookup completed'],
        };
        break;
      case 'answer.delta':
        next = { ...next, text: next.text + e.data.text };
        break;
      case 'sources':
        next = {
          ...next,
          sources: e.data.sources,
          trace: [...next.trace, 'Sources received'],
        };
        break;
      case 'turn.completed':
        next = {
          ...next,
          status: e.data.status,
          terminal: true,
          usage: e.data.usage,
          reason:
            e.data.status === 'no-speech'
              ? 'No speech was recognized. Try speaking again or type a question.'
              : e.data.status === 'truncated'
                ? 'The answer was truncated. This turn was not added to context.'
                : null,
          trace: [...next.trace, 'Answer ' + e.data.status],
        };
        break;
      case 'turn.failed':
        this.fail(
          token,
          new AppError(
            502,
            e.data.code,
            e.data.message,
            e.data.turnId,
            e.data.retryable,
          ),
        );
        return;
    }
    this.publish(next);
  }
}
