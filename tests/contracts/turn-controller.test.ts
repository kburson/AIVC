import { afterEach, describe, expect, it, vi } from 'vitest';
import { TurnController } from '../../apps/web/client/turn-controller';
import { startTurn } from '../../apps/web/client/turn-stream';
import { HistoryStore } from '../../apps/web/client/history';
import { encodeSse, assertTurnSequence } from '@aivc/contracts';
import { validateTurnEvent } from '@aivc/contracts';
import type { TurnEvent } from '@aivc/contracts';
import { wireEvents } from '../helpers/wire-contract-fixtures';
afterEach(() => vi.unstubAllGlobals());
function mapped(id: string) {
  return wireEvents.map((e) => ({ ...e, turnId: id }) as TurnEvent);
}
function response(events: readonly TurnEvent[]) {
  return new Response(
    new ReadableStream<Uint8Array>({
      start(c) {
        for (const e of events) c.enqueue(encodeSse(e));
        c.close();
      },
    }),
    { headers: { 'content-type': 'text/event-stream' } },
  );
}
describe('current-generation event consumer', () => {
  it('aborts Atlas and ignores its late delta/card/completion after Beacon begins', () => {
    const c = new TurnController(),
      atlas = c.begin(),
      abort = new AbortController();
    c.attachAbort(atlas, abort);
    c.apply(atlas, mapped(atlas.turnId)[0]);
    const beacon = c.begin();
    for (const e of mapped(atlas.turnId).slice(1)) c.apply(atlas, e);
    expect(abort.signal.aborted).toBe(true);
    expect(c.current(atlas)).toBe(false);
    expect(c.current(beacon)).toBe(true);
    expect(c.getSnapshot().at(-1)?.text).toBe('');
    expect(c.getSnapshot().at(-1)?.projects).toEqual([]);
    expect(c.getSnapshot()[0].status).toBe('interrupted');
  });
  it('consumes frozen multi-round deltas as one completed history pair', () => {
    const c = new TurnController(),
      t = c.begin(),
      h = new HistoryStore((token) => c.current(token));
    c.setUser(t, 'Atlas?');
    const events = mapped(t.turnId);
    assertTurnSequence(events);
    for (const e of events) c.apply(t, e);
    const view = c.getSnapshot().at(-1)!;
    expect(view.status).toBe('complete');
    h.complete(t, view.user, view.text, 'complete');
    expect(view.text).toBe(
      'Let me check Atlas.\n\nAtlas is active, owned by North, with 3 open items.',
    );
    expect(view.projects[0]).toMatchObject({
      name: 'Atlas',
      ownerTeam: 'North',
      openItems: 3,
    });
    expect(h.messages()).toEqual([
      { role: 'user', content: 'Atlas?' },
      {
        role: 'assistant',
        content:
          'Let me check Atlas.\n\nAtlas is active, owned by North, with 3 open items.',
      },
    ]);
    c.setSpeech(t, 'failed', 'Speech failed. Your answer text is retained.');
    c.cancelCurrent('Stopped');
    expect(c.getSnapshot().at(-1)?.text).toBe(view.text);
    expect(h.messages()).toHaveLength(2);
  });
  it.each(['duplicate', 'gap', 'mixed', 'final'] as const)(
    'rejects %s without appending or accepting malformed history',
    (kind) => {
      const c = new TurnController(),
        t = c.begin(),
        events = mapped(t.turnId);
      for (const e of events.slice(0, 3)) c.apply(t, e);
      const bad =
        kind === 'duplicate'
          ? events[2]
          : kind === 'gap'
            ? { ...events[3], seq: 9 }
            : kind === 'mixed'
              ? { ...events[3], turnId: '22222222-2222-4222-8222-222222222222' }
              : {
                  ...events.at(-1)!,
                  seq: 3,
                  data: { text: 'different', status: 'complete' },
                };
      expect(() => c.apply(t, bad as TurnEvent)).toThrow();
      expect(c.getSnapshot().at(-1)?.text).toBe('Let me check Atlas.');
      expect(c.getSnapshot().at(-1)?.status).toBe('failed');
    },
  );
  it('accepts repeated hints, interleaved sources and an ordinary no-tool answer', () => {
    const c = new TurnController(),
      t = c.begin();
    const payloads = [
      { type: 'turn.accepted', data: { mode: 'mock' } },
      { type: 'stage', data: { stage: 'researching' } },
      { type: 'stage', data: { stage: 'researching' } },
      { type: 'answer.delta', data: { text: 'First.' } },
      {
        type: 'sources',
        data: {
          sources: [{ title: 'Reference', url: 'https://example.test' }],
        },
      },
      { type: 'stage', data: { stage: 'answering' } },
      { type: 'stage', data: { stage: 'answering' } },
      { type: 'answer.delta', data: { text: ' Second.' } },
      {
        type: 'turn.completed',
        data: { text: 'First. Second.', status: 'complete' },
      },
    ];
    const events = payloads.map((p, seq) =>
      validateTurnEvent({ schemaVersion: 1, turnId: t.turnId, seq, ...p }),
    );
    assertTurnSequence(events);
    for (const e of events) c.apply(t, e);
    expect(c.getSnapshot().at(-1)).toMatchObject({
      text: 'First. Second.',
      status: 'complete',
      projects: [],
      sources: [{ title: 'Reference', url: 'https://example.test' }],
    });
  });
  it('renders no-speech without answer work or history and cancels pre-transcript work', () => {
    const c = new TurnController(),
      t = c.begin(),
      h = new HistoryStore((token) => c.current(token));
    c.apply(
      t,
      validateTurnEvent({
        schemaVersion: 1,
        turnId: t.turnId,
        seq: 0,
        type: 'turn.accepted',
        data: { mode: 'mock' },
      }),
    );
    c.apply(
      t,
      validateTurnEvent({
        schemaVersion: 1,
        turnId: t.turnId,
        seq: 1,
        type: 'turn.completed',
        data: { text: '', status: 'no-speech' },
      }),
    );
    const v = c.getSnapshot().at(-1)!;
    expect(v.status).toBe('no-speech');
    h.complete(t, v.user, v.text, 'no-speech');
    expect(v.reason).toMatch(/No speech/);
    expect(h.messages()).toEqual([]);
    const next = c.begin();
    c.cancelCurrent('Stopped');
    expect(c.current(next)).toBe(false);
  });
});
describe('same-origin multipart stream', () => {
  function setup() {
    vi.stubGlobal('window', { location: { origin: 'http://localhost' } });
  }
  it('posts text/history and yields early deltas before completed text', async () => {
    setup();
    let posted: Request | undefined;
    const c = new TurnController(),
      t = c.begin();
    vi.stubGlobal('fetch', async (req: Request) => {
      posted = req;
      return response(mapped(t.turnId));
    });
    const events = [];
    for await (const e of startTurn(
      t,
      { text: 'Atlas?' },
      [],
      new AbortController().signal,
    ))
      events.push(e);
    expect(posted?.url).toBe('http://localhost/api/turn');
    const form = await posted!.formData();
    expect(form.get('text')).toBe('Atlas?');
    expect(form.get('history')).toBe('[]');
    expect(form.get('turnId')).toBe(t.turnId);
    expect(events[2].type).toBe('answer.delta');
    expect(events.at(-1)?.type).toBe('turn.completed');
  });
  it.each(['disconnected', 'invalid', 'id', 'post-terminal'] as const)(
    'classifies %s and never yields an invalid terminal',
    async (kind) => {
      setup();
      const c = new TurnController(),
        t = c.begin(),
        events = mapped(t.turnId);
      let terminal = false;
      let r: Response;
      if (kind === 'disconnected') r = response(events.slice(0, 3));
      else if (kind === 'id')
        r = response(mapped('22222222-2222-4222-8222-222222222222'));
      else if (kind === 'post-terminal') r = response([...events, events[2]]);
      else
        r = new Response('event: answer.delta\ndata: nope\n\n', {
          headers: { 'content-type': 'text/event-stream' },
        });
      vi.stubGlobal('fetch', async () => r);
      const consume = async () => {
        for await (const e of startTurn(
          t,
          { text: 'Atlas?' },
          [],
          new AbortController().signal,
        )) {
          if (e.type === 'turn.completed') terminal = true;
        }
      };
      await expect(consume()).rejects.toMatchObject({
        code:
          kind === 'disconnected' ? 'STREAM_DISCONNECTED' : 'INVALID_STREAM',
      });
      expect(terminal).toBe(false);
    },
  );
  it('rejects empty or oversized typed input before any request', async () => {
    setup();
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    for (const text of [' ', '😀'.repeat(1001)]) {
      const c = new TurnController(),
        t = c.begin();
      await expect(async () => {
        for await (const e of startTurn(
          t,
          { text },
          [],
          new AbortController().signal,
        ))
          void e;
      }).rejects.toMatchObject({ code: 'INVALID_REQUEST' });
    }
    expect(fetch).not.toHaveBeenCalled();
  });
  it('exposes Busy without automatically retrying the paid request', async () => {
    setup();
    const fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            error: {
              code: 'BUSY',
              message: 'Busy',
              turnId: null,
              retryable: true,
            },
          }),
          { status: 429 },
        ),
    );
    vi.stubGlobal('fetch', fetch);
    const c = new TurnController(),
      t = c.begin();
    await expect(async () => {
      for await (const e of startTurn(
        t,
        { text: 'Atlas?' },
        [],
        new AbortController().signal,
      ))
        void e;
    }).rejects.toMatchObject({ code: 'BUSY' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
