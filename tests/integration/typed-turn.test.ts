import { afterEach, expect, it } from 'vitest';
import { createRetrievalApp } from '../../apps/retrieval/src/http/app';
import { runTurn } from '../../apps/web/server/turns/run-turn';
import { createRetrievalClient } from '../../apps/web/server/tools/retrieval-client';
import { assertTurnSequence, decodeSse, encodeSse } from '@aivc/contracts';
import type { TurnEvent } from '@aivc/contracts';
import {
  wireEvents,
  wireTurnId,
  wireDeltaFixture,
} from '../helpers/wire-contract-fixtures';
import {
  collect,
  deps,
  round,
  ScriptedModel,
  tool,
  atlasCatalog,
  multiRoundDeltaFixture,
} from '../helpers/scripted-providers';
const cleanup: Array<() => Promise<unknown>> = [];
afterEach(async () => {
  for (const fn of cleanup.splice(0)) await fn();
});
async function service() {
  const app = createRetrievalApp();
  await app.listen({ host: '127.0.0.1', port: 0 });
  cleanup.push(() => app.close());
  return app.listeningOrigin;
}
const input = () => ({
  kind: 'text' as const,
  turnId: crypto.randomUUID(),
  history: [],
  text: 'What is the status of Atlas?',
});
async function events(model: ScriptedModel) {
  return collect(
    runTurn(
      input(),
      deps(model, await service()),
      new AbortController().signal,
    ),
  );
}
it('preserves exact native tool identity and real HTTP producer wire conformance', async () => {
  const model = new ScriptedModel([
    round({ text: 'Let me check Atlas.', stop: 'tool_use', tools: [tool()] }),
    round({ text: 'Atlas is active, owned by North, with 3 open items.' }),
  ]);
  const emitted = await events(model);
  assertTurnSequence(emitted);
  async function* encoded() {
    for (const e of emitted) yield encodeSse(e);
  }
  const decoded = await collect(decodeSse(encoded()));
  expect(decoded.map((e) => ({ ...e, turnId: wireTurnId }))).toEqual(
    wireEvents,
  );
  expect(
    emitted.filter((e) => e.type === 'answer.delta').map((e) => e.data.text),
  ).toEqual(wireDeltaFixture);
  expect(multiRoundDeltaFixture).toEqual(wireDeltaFixture);
  expect(model.inputs[1].messages.at(-1)?.content).toContainEqual({
    type: 'tool_result',
    tool_use_id: 'tool-atlas-1',
    is_error: false,
    content: JSON.stringify(atlasCatalog),
  });
  expect(model.inputs[1].messages.at(-2)?.content).toEqual([
    { type: 'text', text: 'Let me check Atlas.', citations: [] },
    tool(),
  ]);
  expect(model.inputs.every((i) => i.maxTokens === 1024)).toBe(true);
});
it.each([
  tool('bad', 'unknown'),
  tool('bad', 'lookup_projects', { name: 'Atlas', url: 'http://evil.test' }),
  tool('bad', 'lookup_projects', { name: 4 }),
])(
  'rejects invalid native arguments without retrieval dispatch and continues',
  async (bad) => {
    const model = new ScriptedModel([
      round({ stop: 'tool_use', tools: [bad] }),
      round({ text: 'Corrected answer' }),
    ]);
    const d = deps(model, await service());
    let calls = 0;
    d.lookup = async () => {
      calls++;
      return atlasCatalog;
    };
    const out = await collect(
      runTurn(input(), d, new AbortController().signal),
    );
    assertTurnSequence(out);
    expect(calls).toBe(0);
    expect(out.some((e) => e.type === 'tool.started')).toBe(false);
    expect(model.inputs[1].messages.at(-1)?.content).toContainEqual(
      expect.objectContaining({ tool_use_id: 'bad', is_error: true }),
    );
    expect(out.at(-1)).toMatchObject({
      type: 'turn.completed',
      data: { status: 'complete', text: 'Corrected answer' },
    });
  },
);
it('ends failed retrieval visibly without catalog substitution or native continuation', async () => {
  const model = new ScriptedModel([
    round({ stop: 'tool_use', tools: [tool()] }),
  ]);
  const d = deps(model, await service());
  d.lookup = createRetrievalClient('http://127.0.0.1:1');
  const out = await collect(runTurn(input(), d, new AbortController().signal));
  assertTurnSequence(out);
  expect(out.at(-1)).toMatchObject({
    type: 'turn.failed',
    data: { code: 'RETRIEVAL_UNAVAILABLE', retryable: false },
  });
  expect(out.some((e) => e.type === 'tool.completed')).toBe(false);
  expect(model.inputs).toHaveLength(1);
});
it.each([
  ['four then answer', 4, false, 'complete'],
  ['excess batch', 5, false, 'truncated'],
  ['four then another', 4, true, 'truncated'],
] as const)(
  'bounds custom attempts: %s',
  async (_name, count, extra, status) => {
    const scripts = [
      round({
        stop: 'tool_use',
        tools: Array.from({ length: count }, (_, n) => tool('tool-' + n)),
      }),
      extra
        ? round({ stop: 'tool_use', tools: [tool('extra')] })
        : round({ text: 'Final answer' }),
    ];
    const model = new ScriptedModel(scripts);
    const out = await events(model);
    assertTurnSequence(out);
    expect(out.at(-1)).toMatchObject({
      type: 'turn.completed',
      data: { status },
    });
    expect(out.filter((e) => e.type === 'tool.completed')).toHaveLength(
      count > 4 ? 0 : count,
    );
    expect(model.inputs).toHaveLength(count > 4 ? 1 : 2);
  },
);
it('continues pause unchanged and stops after three calls with a visible round limit', async () => {
  const pause = round({ stop: 'pause_turn', text: 'Working' });
  const model = new ScriptedModel([
    pause,
    round({ stop: 'pause_turn', text: 'More' }),
    round({ stop: 'pause_turn', text: 'Still more' }),
  ]);
  const out = await events(model);
  assertTurnSequence(out);
  expect(model.inputs).toHaveLength(3);
  expect(model.inputs[1].messages.at(-1)).toEqual({
    role: 'assistant',
    content: [{ type: 'text', text: 'Working', citations: [] }],
  });
  expect(out.at(-1)).toMatchObject({ data: { status: 'truncated' } });
  expect(
    out
      .filter((e) => e.type === 'answer.delta')
      .map((e) => e.data.text)
      .join(''),
  ).toContain('round limit');
});
it.each(['max_tokens', 'refusal', 'stop_sequence'] as const)(
  'does not complete on provider stop %s',
  async (stop) => {
    const out = await events(
      new ScriptedModel([round({ stop, text: 'Partial' })]),
    );
    assertTurnSequence(out);
    expect(out.at(-1)).toMatchObject(
      stop === 'max_tokens'
        ? { type: 'turn.completed', data: { status: 'truncated' } }
        : { type: 'turn.failed' },
    );
  },
);
it.each(['ends with space ', 'ends with newline\n'])(
  'does not invent separators after trailing whitespace',
  async (preamble) => {
    const out = await events(
      new ScriptedModel([
        round({ stop: 'tool_use', text: preamble, tools: [tool()] }),
        round({ text: 'Answer' }),
      ]),
    );
    expect(
      out.filter((e) => e.type === 'answer.delta').map((e) => e.data.text),
    ).toEqual([preamble, 'Answer']);
  },
);
it('retains several citation snapshots and joins text blocks without separators within a round', async () => {
  const sources = [
    { title: 'Source', url: 'https://example.test/', citedText: 'fact' },
  ];
  const final = round({ text: 'ignored native final' }).at(-1)!;
  const model = new ScriptedModel([
    [
      { type: 'text', text: 'One' },
      { type: 'sources', sources },
      { type: 'text', text: 'Two' },
      { type: 'sources', sources },
      final,
    ],
  ]);
  const out: TurnEvent[] = await events(model);
  assertTurnSequence(out);
  expect(out.at(-1)).toMatchObject({ data: { text: 'OneTwo' } });
  expect(out.filter((e) => e.type === 'sources')).toHaveLength(2);
});

it('validates malformed actual HTTP retrieval responses and emits no catalog fallback', async () => {
  const app = createRetrievalApp();
  app.addHook('onSend', async () =>
    JSON.stringify({
      schemaVersion: 1,
      source: 'synthetic-project-catalog',
      records: [],
      unexpected: true,
    }),
  );
  const url = await app.listen({ host: '127.0.0.1', port: 0 });
  cleanup.push(() => app.close());
  const model = new ScriptedModel([
    round({ stop: 'tool_use', tools: [tool()] }),
  ]);
  const out = await collect(
    runTurn(input(), deps(model, url), new AbortController().signal),
  );
  assertTurnSequence(out);
  expect(out.at(-1)).toMatchObject({
    type: 'turn.failed',
    data: { code: 'RETRIEVAL_UNAVAILABLE' },
  });
  expect(out.some((e) => e.type === 'tool.completed')).toBe(false);
  expect(model.inputs).toHaveLength(1);
});
it('tool names cannot select a different origin or inject extra query fields', async () => {
  const app = createRetrievalApp();
  const seen: string[] = [];
  app.addHook('onRequest', async (req) => {
    seen.push(req.raw.url ?? '');
  });
  const url = await app.listen({ host: '127.0.0.1', port: 0 });
  cleanup.push(() => app.close());
  const lookup = createRetrievalClient(url);
  const catalog = await lookup(
    'Atlas&name=Boreal',
    new AbortController().signal,
  );
  expect(seen).toEqual(['/v1/projects?name=Atlas%26name%3DBoreal']);
  expect(catalog.records).toEqual([]);
  expect(() => createRetrievalClient('https://evil.test/path')).toThrow(
    'configured',
  );
});
it('refuses ambiguous duplicate native tool IDs before any retrieval dispatch', async () => {
  const model = new ScriptedModel([
    round({ stop: 'tool_use', tools: [tool('same'), tool('same')] }),
  ]);
  const d = deps(model, await service());
  let calls = 0;
  d.lookup = async () => {
    calls++;
    return atlasCatalog;
  };
  const out = await collect(runTurn(input(), d, new AbortController().signal));
  expect(calls).toBe(0);
  expect(out.at(-1)).toMatchObject({
    type: 'turn.failed',
    data: { code: 'MODEL_FAILED' },
  });
});
it('empty transcription makes no model call and yields history-ineligible no-speech', async () => {
  const model = new ScriptedModel([]);
  const d = deps(model, 'http://127.0.0.1:1');
  let transcribed = 0;
  d.transcribe = async () => {
    transcribed++;
    return '  ';
  };
  const out = await collect(
    runTurn(
      {
        kind: 'audio',
        wav: new Uint8Array(),
        turnId: crypto.randomUUID(),
        history: [],
      },
      d,
      new AbortController().signal,
    ),
  );
  assertTurnSequence(out);
  expect(out.at(-1)).toMatchObject({ data: { status: 'no-speech', text: '' } });
  expect(model.inputs).toHaveLength(0);
  expect(transcribed).toBe(1);
});
it('transcription seam emits one transcript before model work with exact native question', async () => {
  const model = new ScriptedModel([round({ text: 'Answer' })]);
  const d = deps(model, 'http://127.0.0.1:1');
  d.transcribe = async () => 'Spoken question';
  const out = await collect(
    runTurn(
      {
        kind: 'audio',
        wav: new Uint8Array(),
        turnId: crypto.randomUUID(),
        history: [],
      },
      d,
      new AbortController().signal,
    ),
  );
  assertTurnSequence(out);
  expect(out.filter((e) => e.type === 'transcript.final')).toEqual([
    expect.objectContaining({ data: { text: 'Spoken question' } }),
  ]);
  expect(model.inputs[0].messages.at(-1)).toEqual({
    role: 'user',
    content: 'Spoken question',
  });
});

it('invalid tool arguments still exhaust the custom execution budget with zero HTTP calls', async () => {
  const model = new ScriptedModel([
    round({
      stop: 'tool_use',
      tools: [0, 1, 2, 3].map((i) => tool('invalid-' + i, 'unrecognized', {})),
    }),
    round({ stop: 'tool_use', tools: [tool('next')] }),
  ]);
  const d = deps(model, await service());
  let calls = 0;
  d.lookup = async () => {
    calls++;
    return atlasCatalog;
  };
  const out = await collect(runTurn(input(), d, new AbortController().signal));
  expect(calls).toBe(0);
  expect(model.inputs).toHaveLength(2);
  expect(model.inputs[1].messages.at(-1)?.content).toHaveLength(4);
  expect(out.at(-1)).toMatchObject({
    type: 'turn.completed',
    data: { status: 'truncated' },
  });
});
it('a repeated identifier in a later native round cannot replay retrieval', async () => {
  const model = new ScriptedModel([
    round({ stop: 'tool_use', tools: [tool('same')] }),
    round({ stop: 'tool_use', tools: [tool('same')] }),
  ]);
  const d = deps(model, await service());
  let calls = 0;
  d.lookup = async () => {
    calls++;
    return atlasCatalog;
  };
  const out = await collect(runTurn(input(), d, new AbortController().signal));
  expect(calls).toBe(1);
  expect(out.at(-1)).toMatchObject({
    type: 'turn.failed',
    data: { code: 'MODEL_FAILED' },
  });
});
