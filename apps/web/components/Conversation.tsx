'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import type { FormEvent } from 'react';
import { TurnController, clientReason } from '../client/turn-controller';
import { HistoryStore } from '../client/history';
import { startTurn } from '../client/turn-stream';
import type { Capabilities as CapabilityContract } from '../shared/contracts';
import { validateCapabilities } from '../shared/validation';
import { Answer } from './Answer';
import { ProjectCard } from './ProjectCard';
import { Details } from './Details';
import { Capabilities } from './Capabilities';
export default function Conversation({
  transport = startTurn,
}: { transport?: typeof startTurn } = {}) {
  const [controller] = useState(() => new TurnController());
  const [history] = useState(
    () => new HistoryStore((token) => controller.current(token)),
  );
  const turns = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
  const [question, setQuestion] = useState('');
  const [caps, setCaps] = useState<CapabilityContract | null>(null);
  const [capError, setCapError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [omitted, setOmitted] = useState<string[]>([]);
  useEffect(() => {
    const abort = new AbortController();
    void (async () => {
      try {
        const response = await fetch(
          new URL('api/capabilities', window.location.origin),
          { signal: abort.signal },
        );
        if (!response.ok) throw new Error('Unavailable');
        const value = validateCapabilities(await response.json());
        if (!abort.signal.aborted) setCaps(value);
      } catch {
        if (!abort.signal.aborted)
          setCapError(
            'Capabilities are unavailable. Reload the page after the service is ready.',
          );
      }
    })();
    return () => {
      abort.abort();
      controller.cancelCurrent('Conversation stopped.');
    };
  }, [controller]);
  const current = turns.at(-1);
  const status:
    'Ready' | 'Listening' | 'Working' | 'Speaking' | 'Busy' | 'Error' =
    formError || capError
      ? 'Error'
      : current?.code?.includes('BUSY')
        ? 'Busy'
        : current?.status === 'failed'
          ? 'Error'
          : current?.status === 'working'
            ? 'Working'
            : 'Ready';
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim() || question.length > 2000) {
      setFormError(clientReason('INVALID_REQUEST'));
      return;
    }
    if (!caps?.turnsAvailable) return;
    const text = question,
      token = controller.begin(),
      abort = new AbortController();
    controller.setUser(token, text);
    controller.attachAbort(token, abort);
    controller.setSpeech(
      token,
      muted ? 'muted' : 'unavailable',
      muted
        ? 'Output muted. Answer text is retained.'
        : 'Browser playback is pending voice integration.',
    );
    setQuestion('');
    setFormError(null);
    try {
      for await (const event of transport(
        token,
        { text },
        history.messages(),
        abort.signal,
      )) {
        if (!controller.current(token)) continue;
        controller.apply(token, event);
        if (event.type === 'turn.completed') {
          const view = controller.getSnapshot().at(-1)!;
          const result = history.complete(
            token,
            view.user,
            view.text,
            event.data.status,
          );
          if (result.omitted)
            setOmitted((previous) => [...previous, token.turnId]);
        }
      }
    } catch (error) {
      if (controller.current(token)) {
        if (error instanceof Error && error.name === 'AbortError')
          controller.cancelCurrent('Request interrupted.');
        else controller.fail(token, error);
      }
    }
  }
  function muteOutput(next: boolean) {
    setMuted(next);
    if (current)
      controller.setSpeech(
        current,
        next ? 'muted' : 'unavailable',
        next
          ? 'Output muted. Answer text is retained.'
          : 'Browser playback is pending voice integration.',
      );
  }
  return (
    <main className="conversation">
      <header>
        <p className="eyebrow">Voice BFF reference</p>
        <h1>Ask a question</h1>
        <p>
          Follow up using completed answers. Inspect the details when you need
          them.
        </p>
      </header>
      <Capabilities value={caps} error={capError} />
      <form onSubmit={submit} className="composer">
        <label htmlFor="question">Question</label>
        <textarea
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={2000}
          aria-describedby="question-help"
          placeholder="What is the status of Atlas?"
          required
        />
        <p id="question-help">
          Typed fallback · {question.length}/2,000 characters
        </p>
        <div className="controls">
          <button type="submit" disabled={!caps?.turnsAvailable}>
            Start
          </button>
          <button
            type="button"
            onClick={() =>
              controller.cancelCurrent(
                'Stopped. This turn was not added to context.',
              )
            }
            disabled={!current || current.terminal}
          >
            Stop
          </button>
          <label>
            <input
              type="checkbox"
              checked={micMuted}
              onChange={(event) => setMicMuted(event.target.checked)}
            />
            Mute microphone
          </label>
          <label>
            <input
              type="checkbox"
              checked={muted}
              onChange={(event) => muteOutput(event.target.checked)}
            />
            Mute output
          </label>
        </div>
        <p>Microphone capture is not connected yet. Type a question.</p>
      </form>
      <p className="status" role="status" aria-live="polite">
        {status}
      </p>
      {formError && <p role="alert">{formError}</p>}
      <section aria-label="Conversation timeline" className="timeline">
        {turns.map((turn, i) => (
          <article key={turn.turnId} aria-label={'Turn ' + (i + 1)}>
            <h2>{turn.question || 'Voice question'}</h2>
            {turn.mode === 'mock' && (
              <p className="simulation">Simulated answer</p>
            )}
            <Answer text={turn.text} sources={turn.sources} />
            <div className="projects">
              {turn.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            {turn.reason && (
              <p role={turn.status === 'failed' ? 'alert' : undefined}>
                {turn.reason}
              </p>
            )}
            {omitted.includes(turn.turnId) && (
              <p className="context-notice">
                Context omitted: this completed turn is too large for follow-up
                context.
              </p>
            )}
            <p>
              Speech: {turn.speech}
              {turn.speechReason ? ' · ' + turn.speechReason : ''}
            </p>
            <Details turn={turn} />
          </article>
        ))}
      </section>
    </main>
  );
}
