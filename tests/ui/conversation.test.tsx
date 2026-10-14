// @vitest-environment jsdom
import { StrictMode } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Conversation from '../../apps/web/components/Conversation';
import type {
  TurnEvent,
  HistoryMessage,
} from '../../apps/web/shared/contracts';
import { AppError } from '../../apps/web/shared/contracts';
import { SseDecodeError } from '../../apps/web/shared/sse';
import { validateTurnEvent } from '../../apps/web/shared/validation';
import type { startTurn } from '../../apps/web/client/turn-stream';
import {
  mockCapabilities,
  wireEvents,
} from '../helpers/wire-contract-fixtures';
beforeEach(() =>
  vi.stubGlobal(
    'fetch',
    async () => new Response(JSON.stringify(mockCapabilities)),
  ),
);
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const finalText =
  'Let me check Atlas.\n\nAtlas is active, owned by North, with 3 open items.';
function events(id: string) {
  return wireEvents.map((e) => ({ ...e, turnId: id }) as TurnEvent);
}
async function start(text: string) {
  await waitFor(() =>
    expect(
      (screen.getByRole('button', { name: 'Start' }) as HTMLButtonElement)
        .disabled,
    ).toBe(false),
  );
  fireEvent.change(screen.getByLabelText('Question'), {
    target: { value: text },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Start' }));
}
it('renders accessible capabilities, completed paragraphs/cards and collapsed diagnostics in Strict Mode without effect POSTs', async () => {
  const calls: HistoryMessage[][] = [];
  const transport: typeof startTurn = async function* (token, _input, history) {
    calls.push(history);
    yield* events(token.turnId);
  };
  render(
    <StrictMode>
      <Conversation transport={transport} />
    </StrictMode>,
  );
  expect(await screen.findByText('Mock/Contract Simulation')).toBeTruthy();
  expect(
    screen.getByText('Mock/Contract Simulation does not verify hosted search.'),
  ).toBeTruthy();
  expect(calls).toHaveLength(0);
  await start('Atlas?');
  expect(await screen.findByText('Let me check Atlas.')).toBeTruthy();
  expect(
    await screen.findByRole('region', { name: 'Atlas project' }),
  ).toBeTruthy();
  expect(document.querySelectorAll('details[open]')).toHaveLength(0);
  expect(calls).toHaveLength(1);
  fireEvent.click(screen.getByLabelText('Mute output'));
  expect(
    screen.getByText('Atlas is active, owned by North, with 3 open items.'),
  ).toBeTruthy();
  await start('Follow up');
  await waitFor(() => expect(calls).toHaveLength(2));
  expect(calls[1]).toEqual([
    { role: 'user', content: 'Atlas?' },
    { role: 'assistant', content: finalText },
  ]);
});
it('renders early text before terminal and commits history only when the deferred terminal arrives', async () => {
  let finish!: () => void;
  const ready = new Promise<void>((r) => {
    finish = r;
  });
  const calls: HistoryMessage[][] = [];
  const transport: typeof startTurn = async function* (token, _input, history) {
    calls.push(history);
    const e = events(token.turnId);
    yield* e.slice(0, -1);
    if (calls.length === 1) await ready;
    yield e.at(-1)!;
  };
  render(<Conversation transport={transport} />);
  await start('Atlas?');
  expect(await screen.findByText('Let me check Atlas.')).toBeTruthy();
  expect(screen.getByRole('status').textContent).toBe('Working');
  finish();
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toBe('Ready'),
  );
  await start('Next');
  await waitFor(() => expect(calls).toHaveLength(2));
  expect(calls[1]).toHaveLength(2);
});
it.each(['STREAM_DISCONNECTED', 'INVALID_STREAM'] as const)(
  'preserves partial text and deliberate retry without history for %s',
  async (code) => {
    let count = 0;
    const histories: HistoryMessage[][] = [];
    const transport: typeof startTurn = async function* (
      token,
      _input,
      history,
    ) {
      histories.push(history);
      if (++count === 1) {
        yield* events(token.turnId).slice(0, 3);
        throw new SseDecodeError(code, 'internal detail');
      }
      yield* events(token.turnId);
    };
    render(<Conversation transport={transport} />);
    await start('Atlas?');
    expect(
      await screen.findByText(
        code === 'STREAM_DISCONNECTED'
          ? 'Connection ended before the answer completed.'
          : 'The server sent an invalid response.',
      ),
    ).toBeTruthy();
    expect(screen.getByText('Let me check Atlas.')).toBeTruthy();
    expect(count).toBe(1);
    await start('Retry deliberately');
    await waitFor(() => expect(count).toBe(2));
    expect(histories[1]).toEqual([]);
  },
);
it('recovers deliberately from Busy without automatic retry', async () => {
  let count = 0;
  const transport: typeof startTurn = async function* (token) {
    if (++count === 1) throw new AppError(429, 'BUSY', 'internal', null, true);
    yield* events(token.turnId);
  };
  render(<Conversation transport={transport} />);
  await start('First');
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toBe('Busy'),
  );
  expect(count).toBe(1);
  await start('Try again');
  expect(await screen.findByText('Let me check Atlas.')).toBeTruthy();
  expect(count).toBe(2);
});
it.each(['failed', 'truncated', 'no-speech'] as const)(
  'keeps %s out of follow-up context',
  async (status) => {
    let count = 0;
    const histories: HistoryMessage[][] = [];
    const transport: typeof startTurn = async function* (
      token,
      _input,
      history,
    ) {
      histories.push(history);
      if (++count === 1) {
        const e = events(token.turnId);
        if (status === 'no-speech') {
          yield e[0];
          yield validateTurnEvent({
            schemaVersion: 1,
            turnId: token.turnId,
            seq: 1,
            type: 'turn.completed',
            data: { text: '', status: 'no-speech' },
          });
        } else {
          yield* e.slice(0, -1);
          yield validateTurnEvent({
            schemaVersion: 1,
            turnId: token.turnId,
            seq: 9,
            type: status === 'failed' ? 'turn.failed' : 'turn.completed',
            data:
              status === 'failed'
                ? {
                    code: 'RETRIEVAL_FAILED',
                    message: 'internal',
                    turnId: token.turnId,
                    retryable: false,
                  }
                : { text: finalText, status: 'truncated' },
          });
        }
        return;
      }
      yield* events(token.turnId);
    };
    render(<Conversation transport={transport} />);
    await start('First');
    await screen.findByText(
      status === 'failed'
        ? 'Project retrieval failed. Submit a new question when ready.'
        : status === 'truncated'
          ? 'The answer was truncated. This turn was not added to context.'
          : 'No speech was recognized. Try speaking again or type a question.',
    );
    await start('Next');
    await waitFor(() => expect(histories).toHaveLength(2));
    expect(histories[1]).toEqual([]);
  },
);
it('ignores late Atlas cards/completion after Beacon while retaining the interrupted timeline', async () => {
  let release!: () => void;
  const wait = new Promise<void>((r) => {
    release = r;
  });
  let count = 0;
  const histories: HistoryMessage[][] = [];
  const transport: typeof startTurn = async function* (token, _input, history) {
    histories.push(history);
    if (++count === 1) {
      const e = events(token.turnId);
      yield* e.slice(0, 3);
      await wait;
      yield* e.slice(3);
      return;
    }
    for (const [seq, p] of [
      { type: 'turn.accepted', data: { mode: 'mock' } },
      { type: 'answer.delta', data: { text: 'Beacon is paused.' } },
      {
        type: 'turn.completed',
        data: { text: 'Beacon is paused.', status: 'complete' },
      },
    ].entries())
      yield validateTurnEvent({
        schemaVersion: 1,
        turnId: token.turnId,
        seq,
        ...p,
      });
  };
  render(<Conversation transport={transport} />);
  await start('Atlas?');
  await screen.findByText('Let me check Atlas.');
  await start('Beacon?');
  await screen.findByText('Beacon is paused.');
  release();
  await waitFor(() =>
    expect(screen.queryByRole('region', { name: 'Atlas project' })).toBeNull(),
  );
  expect(screen.getByText('Let me check Atlas.')).toBeTruthy();
  expect(
    screen.getByText('A new question interrupted this turn.'),
  ).toBeTruthy();
  await start('Next');
  await waitFor(() => expect(histories).toHaveLength(3));
  expect(histories[2]).toEqual([
    { role: 'user', content: 'Beacon?' },
    { role: 'assistant', content: 'Beacon is paused.' },
  ]);
});
it('announces oversized context omission and sends no split pair on follow-up', async () => {
  let count = 0;
  const histories: HistoryMessage[][] = [];
  const transport: typeof startTurn = async function* (token, _input, history) {
    histories.push(history);
    const text = ++count === 1 ? 'x'.repeat(16001) : 'Next answer';
    for (const [seq, p] of [
      { type: 'turn.accepted', data: { mode: 'mock' } },
      { type: 'answer.delta', data: { text } },
      { type: 'turn.completed', data: { text, status: 'complete' } },
    ].entries())
      yield validateTurnEvent({
        schemaVersion: 1,
        turnId: token.turnId,
        seq,
        ...p,
      });
  };
  render(<Conversation transport={transport} />);
  await start('First');
  expect(
    await screen.findByText(
      'Context omitted: this completed turn is too large for follow-up context.',
    ),
  ).toBeTruthy();
  await start('Next');
  await waitFor(() => expect(histories).toHaveLength(2));
  expect(histories[1]).toEqual([]);
});

it('unlocks typed playback in the submit gesture, speaks before completion and Stop releases queued audio after terminal', async () => {
  const { AudioClock, pcm, speechResponse, settle } =
    await import('../voice/audio-fixture');
  const clocks: InstanceType<typeof AudioClock>[] = [];
  const order: string[] = [];
  vi.stubGlobal(
    'AudioContext',
    class extends AudioClock {
      constructor() {
        super();
        this.state = 'suspended';
        clocks.push(this);
        order.push('create');
      }
      override async resume() {
        order.push('resume');
        await super.resume();
      }
    },
  );
  vi.stubGlobal('fetch', async (url: string) =>
    String(url).includes('capabilities')
      ? new Response(
          JSON.stringify({ ...mockCapabilities, speechAvailable: true }),
        )
      : speechResponse(pcm(3)),
  );
  let finish!: () => void;
  const pending = new Promise<void>((r) => (finish = r));
  const transport: typeof startTurn = async function* (token) {
    order.push('transport');
    const es = events(token.turnId);
    yield* es.slice(0, -1);
    await pending;
    yield es.at(-1)!;
  };
  render(
    <StrictMode>
      <Conversation transport={transport} />
    </StrictMode>,
  );
  await start('Atlas?');
  expect(order.slice(0, 3)).toEqual(['create', 'resume', 'transport']);
  await waitFor(() => expect(clocks[0].buffers.length).toBeGreaterThan(0));
  expect(clocks[0].buffers[0].sampleRate).toBe(24000);
  expect(screen.getByRole('status').textContent).toBe('Speaking');
  finish();
  await settle();
  await screen.findByText(
    'Atlas is active, owned by North, with 3 open items.',
  );
  expect(
    (screen.getByRole('button', { name: 'Stop' }) as HTMLButtonElement)
      .disabled,
  ).toBe(false);
  fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
  await settle();
  expect(clocks[0].sources.every((s) => s.stopped)).toBe(true);
  expect(clocks[0].closed).toBe(true);
  expect(
    screen.getByText('Atlas is active, owned by North, with 3 open items.'),
  ).toBeTruthy();
});
it('output mute cancels speech without losing the answer and a later typed generation reuses playback', async () => {
  const { AudioClock, pcm, speechResponse } =
    await import('../voice/audio-fixture');
  const clocks: InstanceType<typeof AudioClock>[] = [];
  let speechCalls = 0;
  vi.stubGlobal(
    'AudioContext',
    class extends AudioClock {
      constructor() {
        super();
        clocks.push(this);
      }
    },
  );
  vi.stubGlobal('fetch', async (url: string) =>
    String(url).includes('capabilities')
      ? new Response(
          JSON.stringify({ ...mockCapabilities, speechAvailable: true }),
        )
      : (speechCalls++, speechResponse(pcm(3))),
  );
  const transport: typeof startTurn = async function* (token) {
    yield* events(token.turnId);
  };
  const mounted = render(<Conversation transport={transport} />);
  await start('Atlas?');
  await waitFor(() => expect(clocks[0]?.buffers.length).toBeGreaterThan(0));
  fireEvent.click(screen.getByLabelText('Mute output'));
  expect(clocks[0].sources.every((s) => s.stopped)).toBe(true);
  expect(
    screen.getByText('Atlas is active, owned by North, with 3 open items.'),
  ).toBeTruthy();
  fireEvent.click(screen.getByLabelText('Mute output'));
  await start('Again');
  await waitFor(() => expect(speechCalls).toBe(2));
  expect(clocks).toHaveLength(1);
  mounted.unmount();
  expect(clocks[0].closed).toBe(true);
});
it('keeps future typed answers silent while output is muted even when playback already exists', async () => {
  const { AudioClock, pcm, speechResponse } =
    await import('../voice/audio-fixture');
  let calls = 0;
  vi.stubGlobal('AudioContext', AudioClock);
  vi.stubGlobal('fetch', async (url: string) =>
    String(url).includes('capabilities')
      ? new Response(
          JSON.stringify({ ...mockCapabilities, speechAvailable: true }),
        )
      : (calls++, speechResponse(pcm(0.1))),
  );
  const transport: typeof startTurn = async function* (token) {
    yield* events(token.turnId);
  };
  render(<Conversation transport={transport} />);
  await start('Atlas?');
  await waitFor(() => expect(calls).toBeGreaterThan(0));
  fireEvent.click(screen.getByLabelText('Mute output'));
  const before = calls;
  await start('Muted');
  await new Promise((r) => setTimeout(r, 60));
  expect(calls).toBe(before);
  expect(
    screen.getAllByText('Atlas is active, owned by North, with 3 open items.'),
  ).toHaveLength(2);
});
it('Stop after a truncated terminal ends Speaking while retaining literal text and excluding follow-up history', async () => {
  const { AudioClock, pcm, speechResponse } =
    await import('../voice/audio-fixture');
  vi.stubGlobal('AudioContext', AudioClock);
  vi.stubGlobal('fetch', async (url: string) =>
    String(url).includes('capabilities')
      ? new Response(
          JSON.stringify({ ...mockCapabilities, speechAvailable: true }),
        )
      : speechResponse(pcm(3)),
  );
  const histories: HistoryMessage[][] = [];
  const transport: typeof startTurn = async function* (token, _input, history) {
    histories.push(history);
    const es = events(token.turnId);
    yield* es.slice(0, -1);
    yield {
      ...es.at(-1)!,
      data: { text: finalText, status: 'truncated' },
    } as TurnEvent;
  };
  render(<Conversation transport={transport} />);
  await start('Atlas?');
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toBe('Speaking'),
  );
  fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
  expect(screen.getByRole('status').textContent).toBe('Ready');
  expect(
    screen.getByText('Atlas is active, owned by North, with 3 open items.'),
  ).toBeTruthy();
  await start('Next');
  await waitFor(() => expect(histories).toHaveLength(2));
  expect(histories[1]).toEqual([]);
});
it('keeps the omitted-word reason visible after later PCM and playback completion', async () => {
  const { AudioClock, pcm, speechResponse } =
    await import('../voice/audio-fixture');
  const clocks: InstanceType<typeof AudioClock>[] = [];
  vi.stubGlobal(
    'AudioContext',
    class extends AudioClock {
      constructor() {
        super();
        clocks.push(this);
      }
    },
  );
  vi.stubGlobal('fetch', async (url: string) =>
    String(url).includes('capabilities')
      ? new Response(
          JSON.stringify({
            ...mockCapabilities,
            speechAvailable: true,
            speech: { ...mockCapabilities.speech, segmentChars: 10 },
          }),
        )
      : speechResponse(pcm(0.1)),
  );
  const text = 'One abcdefghijklmnop next.\n\nLast.';
  const transport: typeof startTurn = async function* (token) {
    let delta = 0;
    for (const e of events(token.turnId)) {
      if (e.type === 'answer.delta')
        yield {
          ...e,
          data: {
            text: ['One abcdefghijklmnop next.', '\n\n', 'Last.'][delta++],
          },
        };
      else if (e.type === 'turn.completed')
        yield { ...e, data: { ...e.data, text } };
      else yield e;
    }
  };
  render(<Conversation transport={transport} />);
  await start('Atlas?');
  await waitFor(() => expect(clocks[0].buffers.length).toBeGreaterThan(0));
  expect(
    screen.getByText(
      (_t, node) =>
        node?.tagName === 'P' &&
        !!node.textContent?.includes('SPEECH_TOKEN_TOO_LONG'),
    ),
  ).toBeTruthy();
  clocks[0].currentTime = 20;
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toBe('Ready'),
  );
  expect(
    screen.getByText(
      (_t, node) =>
        node?.tagName === 'P' &&
        !!node.textContent?.includes('SPEECH_TOKEN_TOO_LONG'),
    ),
  ).toBeTruthy();
  expect(screen.getByText('One abcdefghijklmnop next.')).toBeTruthy();
});
it('cancels audible partial speech on a failed answer stream and preserves displayed partial text', async () => {
  const { AudioClock, pcm, speechResponse } =
    await import('../voice/audio-fixture');
  const clocks: InstanceType<typeof AudioClock>[] = [];
  vi.stubGlobal(
    'AudioContext',
    class extends AudioClock {
      constructor() {
        super();
        clocks.push(this);
      }
    },
  );
  vi.stubGlobal('fetch', async (url: string) =>
    String(url).includes('capabilities')
      ? new Response(
          JSON.stringify({ ...mockCapabilities, speechAvailable: true }),
        )
      : speechResponse(pcm(3)),
  );
  let fail!: () => void;
  const pending = new Promise<void>((r) => (fail = r));
  const transport: typeof startTurn = async function* (token) {
    yield* events(token.turnId).slice(0, -1);
    await pending;
    throw new SseDecodeError('STREAM_DISCONNECTED', 'lost');
  };
  render(<Conversation transport={transport} />);
  await start('Atlas?');
  await waitFor(() => expect(clocks[0].sources.length).toBeGreaterThan(0));
  fail();
  await screen.findByText('Connection ended before the answer completed.');
  expect(clocks[0].sources.every((s) => s.stopped)).toBe(true);
  expect(
    screen.getByText(
      (_t, node) =>
        node?.tagName === 'P' &&
        !!node.textContent?.startsWith('Speech: failed'),
    ),
  ).toBeTruthy();
  expect(
    screen.getByText('Atlas is active, owned by North, with 3 open items.'),
  ).toBeTruthy();
});
