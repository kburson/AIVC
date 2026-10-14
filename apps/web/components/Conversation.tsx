'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { FormEvent } from 'react';
import { TurnController, clientReason } from '../client/turn-controller';
import { HistoryStore } from '../client/history';
import { startTurn } from '../client/turn-stream';
import type { Capabilities as CapabilityContract } from '../shared/contracts';
import { validateCapabilities } from '../shared/validation';
import { Playback } from '../client/voice/playback';
import { SpeechQueue } from '../client/voice/speech-queue';
import {
  CaptureSession,
  type CaptureReason,
  type CaptureToken,
} from '../client/voice/capture-session';
import {
  acquireMicrophoneStream,
  createVad,
} from '../client/voice/vad-adapter';
import type { TurnToken } from '../client/turn-controller';
import { Answer } from './Answer';
import { ProjectCard } from './ProjectCard';
import { Details } from './Details';
import { Capabilities } from './Capabilities';
type CaptureRun = {
  session: CaptureSession;
  candidate: { token: CaptureToken; confirmed: boolean } | null;
  consumed: WeakSet<CaptureToken>;
  operation: number;
};
const captureReasons: Record<CaptureReason, string> = {
  CAPTURE_PERMISSION_DENIED:
    'Microphone permission was denied. Type a question or enable access and Start conversation again.',
  CAPTURE_LOAD_FAILED:
    'Voice capture could not load. Type a question or try Start conversation again.',
  CAPTURE_OVERLONG:
    'Recording exceeded 30 seconds and was discarded. Listening restarts automatically; speak a shorter question.',
  CAPTURE_CLEANUP_FAILED:
    'Microphone or audio cleanup failed. Reload the page before starting again.',
};
export default function Conversation({
  transport = startTurn,
}: {
  transport?: typeof startTurn;
}) {
  const [controller] = useState(() => new TurnController());
  const [history] = useState(
    () => new HistoryStore((token) => controller.current(token)),
  );
  const output = useRef<{
    playback: Playback;
    queue: SpeechQueue;
    token: TurnToken | null;
  } | null>(null);
  const capture = useRef<CaptureRun | null>(null);
  const teardown = useRef<Promise<void> | null>(null);
  const mounted = useRef(false);
  const capsRef = useRef<CapabilityContract | null>(null);
  const transportRef = useRef(transport);
  const outputMuted = useRef(false);
  const microphoneMuted = useRef(false);
  const turns = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
  const [question, setQuestion] = useState('');
  const [caps, setCaps] = useState<CapabilityContract | null>(null);
  const [capError, setCapError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [captureReason, setCaptureReason] = useState<CaptureReason | null>(
    null,
  );
  const [muted, setMuted] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [captureState, setCaptureState] = useState<
    'stopped' | 'starting' | 'listening' | 'muted'
  >('stopped');
  const [stopping, setStopping] = useState(false);
  const [omitted, setOmitted] = useState<string[]>([]);
  useEffect(() => {
    transportRef.current = transport;
  }, [transport]);
  useEffect(() => {
    mounted.current = true;
    const abort = new AbortController();
    void (async () => {
      try {
        const response = await fetch(
          new URL('api/capabilities', window.location.origin),
          { signal: abort.signal },
        );
        if (!response.ok) throw new Error('Unavailable');
        const value = validateCapabilities(await response.json());
        if (!abort.signal.aborted) {
          capsRef.current = value;
          setCaps(value);
        }
      } catch {
        if (!abort.signal.aborted)
          setCapError(
            'Capabilities are unavailable. Reload the page after the service is ready.',
          );
      }
    })();
    return () => {
      mounted.current = false;
      abort.abort();
      void stopConversation(false);
    };
    // Resources are created only by gestures and owned through refs, never by effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller]);
  const current = turns.at(-1);
  const status:
    'Ready' | 'Listening' | 'Working' | 'Speaking' | 'Busy' | 'Error' =
    formError ||
    capError ||
    (captureReason && captureReason !== 'CAPTURE_OVERLONG')
      ? 'Error'
      : current?.code?.includes('BUSY')
        ? 'Busy'
        : current?.status === 'failed'
          ? 'Error'
          : current?.speech === 'speaking'
            ? 'Speaking'
            : current?.status === 'working'
              ? 'Working'
              : captureState === 'listening'
                ? 'Listening'
                : 'Ready';
  function prepareOutput(token: TurnToken | null, force = false): void {
    const capability = capsRef.current;
    if (
      !capability ||
      (!force && (outputMuted.current || !capability.speechAvailable))
    )
      return;
    let allocated: AudioContext | null = null;
    try {
      if (!output.current) {
        allocated = new AudioContext();
        const unlocked = allocated.resume(); // Initiate synchronously, inside the actual gesture.
        const playback = new Playback(
          allocated,
          (t) => controller.current(t),
          unlocked,
          () => new AudioContext(),
        );
        const queue = new SpeechQueue({
          playback,
          segmentChars: capability.speech.segmentChars,
          isCurrent: (t) => controller.current(t),
          onStatus: (t, state, reason) =>
            controller.setSpeech(t, state, reason),
        });
        output.current = { playback, queue, token };
      } else {
        output.current.token = token;
        void output.current.playback.resume().catch(() => {
          if (token)
            controller.setSpeech(token, 'failed', 'SPEECH_RESUME_FAILED');
        });
      }
    } catch {
      if (allocated) void allocated.close().catch(() => {});
      if (token) controller.setSpeech(token, 'failed', 'SPEECH_RESUME_FAILED');
    }
  }
  function releaseOutput(): Promise<void> {
    const former = output.current;
    output.current = null;
    former?.queue.dispose();
    return former?.playback.dispose() ?? Promise.resolve();
  }
  function stopConversation(notify = true): Promise<void> {
    // Invalidate both owners before asynchronous disposal can yield.
    const run = capture.current;
    capture.current = null;
    if (run) {
      run.candidate = null;
      run.session.invalidateIntent();
    }
    controller.cancelCurrent(
      notify
        ? 'Stopped. This turn was not added to context.'
        : 'Conversation stopped.',
    );
    if (notify && mounted.current) setCaptureState('stopped');
    if (teardown.current) return teardown.current;
    if (!run && !output.current) return Promise.resolve();
    if (notify && mounted.current) setStopping(true);
    const resources = [
      run?.session.stop() ?? Promise.resolve(),
      releaseOutput(),
    ];
    const operation = Promise.allSettled(resources)
      .then((results) => {
        if (mounted.current && results.some((r) => r.status === 'rejected'))
          setCaptureReason('CAPTURE_CLEANUP_FAILED');
      })
      .finally(() => {
        if (teardown.current === operation) teardown.current = null;
        if (mounted.current) setStopping(false);
      });
    teardown.current = operation;
    return operation;
  }
  function startConversation(): void {
    if (!capsRef.current?.turnsAvailable || teardown.current || capture.current)
      return;
    setCaptureReason(null);
    setFormError(null);
    setCaptureState('starting');
    const formerOutput = output.current;
    prepareOutput(null, true);
    const startedOutput = output.current;
    const run: CaptureRun = {
      candidate: null,
      consumed: new WeakSet(),
      operation: 0,
      session: new CaptureSession({
        createContext: () => new AudioContext(),
        acquireStream: acquireMicrophoneStream,
        createVad,
        onVadEvent: (event) => {
          if (capture.current !== run) return;
          if (event.type === 'rawStart')
            run.candidate = { token: event.capture, confirmed: false };
          else if (run.candidate?.token === event.capture) {
            if (event.type === 'confirmedStart') run.candidate.confirmed = true;
            else run.candidate = null;
          }
        },
        onUtterance: (token, wav) => {
          if (
            capture.current !== run ||
            microphoneMuted.current ||
            !run.session.isCurrent(token) ||
            run.candidate?.token !== token ||
            !run.candidate.confirmed ||
            run.consumed.has(token)
          )
            return;
          run.consumed.add(token);
          run.candidate = null;
          void runTurn({ wav });
        },
        onStatus: (reason) => {
          if (
            mounted.current &&
            (capture.current === run || reason === 'CAPTURE_CLEANUP_FAILED')
          )
            setCaptureReason(reason);
        },
      }),
    };
    capture.current = run;
    // start() itself creates/resumes capture before its first await, after playback's synchronous resume above.
    const pending = run.session.start();
    if (microphoneMuted.current)
      void run.session.mute().catch(() => {
        if (mounted.current) setCaptureReason('CAPTURE_CLEANUP_FAILED');
      });
    void pending
      .then(() => {
        if (capture.current === run && run.operation === 0 && mounted.current)
          setCaptureState(microphoneMuted.current ? 'muted' : 'listening');
      })
      .catch(async () => {
        if (capture.current !== run || run.operation !== 0) return;
        capture.current = null;
        run.candidate = null;
        if (mounted.current) setCaptureState('stopped');
        if (!formerOutput && output.current === startedOutput) {
          try {
            await releaseOutput();
          } catch {
            if (mounted.current) setCaptureReason('CAPTURE_CLEANUP_FAILED');
          }
        }
      });
  }
  async function muteMicrophone(next: boolean): Promise<void> {
    microphoneMuted.current = next;
    setMicMuted(next);
    const run = capture.current;
    if (!run) return;
    const operation = ++run.operation;
    run.candidate = null;
    run.session.invalidateIntent();
    if (next) setCaptureState('muted');
    else setCaptureState('starting');
    try {
      // CaptureSession invalidates synchronously and owns pending-init/late-stream release.
      if (next) await run.session.mute();
      else await run.session.unmute();
      if (
        capture.current === run &&
        run.operation === operation &&
        mounted.current
      )
        setCaptureState(microphoneMuted.current ? 'muted' : 'listening');
    } catch {
      if (capture.current !== run || run.operation !== operation) return;
      if (next) {
        if (mounted.current) setCaptureReason('CAPTURE_CLEANUP_FAILED');
      } else {
        // The module already reported the precise permission/load/cleanup reason.
        capture.current = null;
        if (mounted.current) setCaptureState('stopped');
        const resources = [run.session.stop()];
        if (!output.current?.token) resources.push(releaseOutput());
        const outcomes = await Promise.allSettled(resources);
        if (mounted.current && outcomes.some((r) => r.status === 'rejected'))
          setCaptureReason('CAPTURE_CLEANUP_FAILED');
      }
    }
  }
  async function runTurn(
    input: { text?: string; wav?: Blob },
    gesture = false,
  ): Promise<void> {
    const capability = capsRef.current;
    if (!capability?.turnsAvailable) return;
    if (output.current?.token)
      output.current.queue.cancel(output.current.token, 'TURN_INTERRUPTED');
    const token = controller.begin(),
      abort = new AbortController();
    if (input.text !== undefined) controller.setUser(token, input.text);
    controller.attachAbort(token, abort);
    controller.setSpeech(
      token,
      outputMuted.current
        ? 'muted'
        : capability.speechAvailable
          ? 'ready'
          : 'unavailable',
      outputMuted.current
        ? 'Output muted. Answer text is retained.'
        : capability.speechAvailable
          ? undefined
          : 'Speech is unavailable. Answer text is retained.',
    );
    if (gesture) prepareOutput(token);
    else if (output.current) output.current.token = token;
    try {
      for await (const event of transportRef.current(
        token,
        input,
        history.messages(),
        abort.signal,
      )) {
        if (!controller.current(token)) continue;
        controller.apply(token, event);
        if (
          event.type === 'answer.delta' &&
          !outputMuted.current &&
          capability.speechAvailable
        )
          output.current?.queue.accept(token, event.data.text);
        if (event.type === 'turn.failed') {
          output.current?.queue.cancel(token, 'TURN_FAILED');
          controller.setSpeech(
            token,
            'failed',
            'Answer failed. Speech stopped; answer text is retained.',
          );
        }
        if (event.type === 'turn.completed') {
          if (
            !outputMuted.current &&
            capability.speechAvailable &&
            (event.data.status === 'complete' ||
              event.data.status === 'truncated')
          )
            output.current?.queue.flush(token);
          else output.current?.queue.cancel(token, 'NO_SPEECH');
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
        output.current?.queue.cancel(token, 'TURN_FAILED');
        if (error instanceof Error && error.name === 'AbortError')
          controller.cancelCurrent('Request interrupted.');
        else {
          controller.fail(token, error);
          controller.setSpeech(
            token,
            'failed',
            'Answer failed. Speech stopped; answer text is retained.',
          );
        }
      }
    }
  }
  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!question.trim() || question.length > 2000) {
      setFormError(clientReason('INVALID_REQUEST'));
      return;
    }
    if (!capsRef.current?.turnsAvailable) return;
    capture.current?.session.invalidateIntent();
    if (capture.current) capture.current.candidate = null;
    const text = question;
    setQuestion('');
    setFormError(null);
    void runTurn({ text }, true);
  }
  function muteOutput(next: boolean): void {
    outputMuted.current = next;
    setMuted(next);
    if (next && output.current?.token)
      output.current.queue.cancel(output.current.token, 'OUTPUT_MUTED');
    if (current)
      controller.setSpeech(
        current,
        next ? 'muted' : caps?.speechAvailable ? 'ready' : 'unavailable',
        next
          ? 'Output muted. Answer text is retained.'
          : 'Output enabled for the next answer. Answer text is retained.',
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
            onClick={startConversation}
            disabled={!caps?.turnsAvailable || stopping}
          >
            Start conversation
          </button>
          <button
            type="button"
            onClick={() => {
              void stopConversation();
            }}
            disabled={!current && captureState === 'stopped' && !stopping}
          >
            Stop
          </button>
          <label>
            <input
              type="checkbox"
              checked={micMuted}
              onChange={(event) => {
                void muteMicrophone(event.target.checked);
              }}
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
        <p>
          {stopping
            ? 'Stopping microphone and audio…'
            : captureState === 'starting'
              ? 'Starting microphone…'
              : captureState === 'muted'
                ? 'Microphone muted. Typed questions still work.'
                : captureState === 'listening'
                  ? 'Speak naturally. Completed questions submit automatically.'
                  : 'Start conversation to speak, or type a question.'}
        </p>
      </form>
      <p className="status" role="status" aria-live="polite">
        {status}
      </p>
      {formError && <p role="alert">{formError}</p>}
      {captureReason && (
        <p role={captureReason === 'CAPTURE_OVERLONG' ? undefined : 'alert'}>
          {captureReasons[captureReason]}
        </p>
      )}
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
