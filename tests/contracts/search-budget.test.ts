import type { ModelRoundInput } from '../../apps/web/server/providers/contracts';
import { expect, it, vi } from 'vitest';
import { runWithDeadline } from '../../apps/web/server/turns/deadline';
import type Anthropic from '@anthropic-ai/sdk';
import {
  ClaudeAdapter,
  accountSearch,
} from '../../apps/web/server/providers/claude';
import { runTurn } from '../../apps/web/server/turns/run-turn';
import { AppError } from '@aivc/contracts';
import { mockCapabilities } from '../helpers/wire-contract-fixtures';
import {
  collect,
  nativeRound,
  round,
  ScriptedModel,
  deps,
  tool,
  atlasCatalog,
} from '../helpers/scripted-providers';
const search = (id = 's1'): Anthropic.ServerToolUseBlock => ({
  type: 'server_tool_use',
  id,
  name: 'web_search',
  input: { query: 'facts' },
  caller: { type: 'direct' },
});
const result = (id = 's1'): Anthropic.WebSearchToolResultBlock => ({
  type: 'web_search_tool_result',
  tool_use_id: id,
  caller: { type: 'direct' },
  content: [
    {
      type: 'web_search_result',
      title: 'Facts',
      url: 'https://example.test/facts',
      encrypted_content: 'opaque',
      page_age: null,
    },
  ],
});
function caps() {
  const c = structuredClone(mockCapabilities);
  c.mode = 'live';
  c.search = {
    state: 'unavailable',
    reason: 'Not checked',
    accountValidation: 'pending',
  };
  return c;
}
function reply(message: Anthropic.Message) {
  const events: unknown[] = [
    {
      type: 'message_start',
      message: {
        ...message,
        content: [],
        stop_reason: null,
        usage: { ...message.usage, output_tokens: 0 },
      },
    },
  ];
  message.content.forEach((block, index) => {
    events.push({
      type: 'content_block_start',
      index,
      content_block:
        block.type === 'text'
          ? { ...block, text: '', citations: [] }
          : block.type === 'tool_use' || block.type === 'server_tool_use'
            ? { ...block, input: {} }
            : block,
    });
    if (block.type === 'text') {
      events.push({
        type: 'content_block_delta',
        index,
        delta: { type: 'text_delta', text: block.text },
      });
      for (const citation of block.citations ?? [])
        events.push({
          type: 'content_block_delta',
          index,
          delta: { type: 'citations_delta', citation },
        });
    } else if (block.type === 'tool_use' || block.type === 'server_tool_use')
      events.push({
        type: 'content_block_delta',
        index,
        delta: {
          type: 'input_json_delta',
          partial_json: JSON.stringify(block.input),
        },
      });
    events.push({ type: 'content_block_stop', index });
  });
  events.push(
    {
      type: 'message_delta',
      delta: {
        stop_reason: message.stop_reason,
        stop_sequence: null,
        container: null,
        stop_details: null,
      },
      usage: { ...message.usage },
    },
    { type: 'message_stop' },
  );
  return new Response(
    events
      .map(
        (e) =>
          'event: ' +
          (e as { type: string }).type +
          '\ndata: ' +
          JSON.stringify(e) +
          '\n\n',
      )
      .join(''),
    { headers: { 'content-type': 'text/event-stream' } },
  );
}
type Recorded = {
  max_tokens: number;
  tools: Array<{ name?: string; type?: string; max_uses?: number }>;
  messages: Anthropic.MessageParam[];
};
function transport(
  scripts: Array<Anthropic.Message | Response>,
  support: unknown = true,
) {
  const requests: Recorded[] = [];
  let models = 0;
  const fake: typeof fetch = async (url, init) => {
    if (String(url).includes('/models/')) {
      models++;
      if (support instanceof Response) return support;
      return Response.json({
        id: 'offline',
        type: 'model',
        display_name: 'Offline',
        created_at: '2026-01-01T00:00:00Z',
        deprecated_at: null,
        retires_at: null,
        lifecycle: 'active',
        line: null,
        max_input_tokens: 100000,
        max_tokens: 1024,
        capabilities:
          support === null
            ? null
            : {
                batch: { supported: true },
                citations: { supported: true },
                code_execution: { supported: false },
                context_management: null,
                image_input: { supported: false },
                pdf_input: { supported: false },
                structured_outputs: { supported: true },
                thinking: null,
                server_tools: {
                  supported: true,
                  code_execution: { supported: false },
                  web_search: {
                    supported: support === 'missing' ? undefined : support,
                  },
                },
              },
      });
    }
    const body = JSON.parse(String(init?.body)) as Recorded;
    requests.push(body);
    const script = scripts.shift();
    if (!script) throw Error('Unexpected paid replay');
    return script instanceof Response ? script : reply(script);
  };
  return { fake, requests, modelCalls: () => models };
}
const modelInput = (remaining = 2, enabled = true): ModelRoundInput => ({
  messages: [{ role: 'user' as const, content: 'Question' }],
  searchRemaining: remaining,
  searchEnabled: enabled,
  maxTokens: 1024 as const,
});
function sdk(
  t: ReturnType<typeof transport>,
  c = caps(),
  searchEnabled = true,
) {
  return new ClaudeAdapter({
    apiKey: 'offline-test-key',
    model: 'offline',
    capabilities: c,
    searchEnabled,
    fetch: t.fake,
  });
}
it.each([
  ['pending IDs without usage', null, [search('a'), search('b')], null],
  ['usage without blocks', 1, [], 1],
  ['stream/final duplicate', 1, [search('a')], 1],
  ['contradiction', 2, [search('a')], null],
  ['missing', null, [], null],
  ['noninteger', 1.5, [], null],
  ['negative', -1, [], null],
] as const)('accounts hosted search: %s', (_name, count, blocks, want) => {
  const m = nativeRound({ blocks: [...blocks], nativeSearch: count }).message;
  expect(
    accountSearch(
      m,
      blocks.length ? new Set(blocks.map((b) => b.id)) : new Set(),
    ),
  ).toBe(want);
});
it('does not double count repeated streaming projections', () => {
  const m = nativeRound({ blocks: [search()], nativeSearch: 1 }).message;
  expect(accountSearch(m, new Set(['s1', 's1']))).toBe(1);
});
// These fixtures catch invented public usage from pending, unmatched or ambiguous native records.
const completedFallbackCases: Array<{
  name: string;
  blocks: Anthropic.ContentBlock[];
  seen: string[];
  want: number | null;
}> = [
  {
    name: 'one validated completed pair',
    blocks: [search('a'), result('a')],
    seen: [],
    want: 1,
  },
  {
    name: 'two validated completed pairs',
    blocks: [search('a'), result('a'), search('b'), result('b')],
    seen: ['a', 'b'],
    want: 2,
  },
  {
    name: 'stream and final projections deduplicate a completed pair',
    blocks: [search('a'), result('a')],
    seen: ['a', 'a'],
    want: 1,
  },
  {
    name: 'completed pair plus pending search',
    blocks: [search('a'), result('a'), search('b')],
    seen: ['a', 'b'],
    want: null,
  },
  { name: 'stream-only search ID', blocks: [], seen: ['a'], want: null },
  {
    name: 'completed pair plus unresolved stream ID',
    blocks: [search('a'), result('a')],
    seen: ['a', 'b'],
    want: null,
  },
  { name: 'orphan result', blocks: [result('a')], seen: ['a'], want: null },
  {
    name: 'result paired with another ID',
    blocks: [search('a'), result('b')],
    seen: [],
    want: null,
  },
  {
    name: 'duplicate final search ID',
    blocks: [search('a'), search('a'), result('a')],
    seen: [],
    want: null,
  },
  {
    name: 'contradictory duplicate final search input',
    blocks: [
      search('a'),
      { ...search('a'), input: { query: 'different' } },
      result('a'),
    ],
    seen: [],
    want: null,
  },
  {
    name: 'duplicate result pairing',
    blocks: [search('a'), result('a'), result('a')],
    seen: [],
    want: null,
  },
  {
    name: 'contradictory duplicate final result',
    blocks: [search('a'), result('a'), { ...result('a'), content: [] }],
    seen: [],
    want: null,
  },
  {
    name: 'empty search ID',
    blocks: [search(''), result('')],
    seen: [],
    want: null,
  },
  {
    name: 'whitespace search ID',
    blocks: [search(' '), result(' ')],
    seen: [],
    want: null,
  },
  {
    name: 'malformed search input',
    blocks: [{ ...search('a'), input: null }, result('a')],
    seen: [],
    want: null,
  },
  {
    name: 'missing result ID',
    blocks: [search('a'), { ...result('a'), tool_use_id: '' }],
    seen: [],
    want: null,
  },
  {
    name: 'malformed result content',
    blocks: [search('a'), { ...result('a'), content: null as never }],
    seen: [],
    want: null,
  },
  {
    name: 'malformed result item',
    blocks: [search('a'), { ...result('a'), content: [{} as never] }],
    seen: [],
    want: null,
  },
  {
    name: 'completed empty result still confirms one request',
    blocks: [search('a'), { ...result('a'), content: [] }],
    seen: [],
    want: 1,
  },
  {
    name: 'no counter or completion evidence is not zero',
    blocks: [],
    seen: [],
    want: null,
  },
];
it.each(completedFallbackCases)(
  'absent-counter accounting: $name',
  ({ blocks, seen, want }) => {
    const message = nativeRound({ blocks, nativeSearch: null }).message;
    expect(accountSearch(message, new Set(seen))).toBe(want);
  },
);
it.each([
  ['zero counter-only', 0, [], 0],
  ['positive counter-only', 2, [], 2],
  [
    'supplied counter retains conservative pending-ID consistency',
    2,
    [search('a'), search('b')],
    2,
  ],
  ['zero conflicting with pending IDs', 0, [search('a'), search('b')], null],
  ['nonfinite counter', Infinity, [], null],
  ['NaN counter', NaN, [], null],
  ['nonnumeric counter', '1' as never, [], null],
] as const)(
  'preserves supplied-counter semantics: %s',
  (_name, count, blocks, want) => {
    const message = nativeRound({
      blocks: [...blocks],
      nativeSearch: count,
    }).message;
    expect(accountSearch(message)).toBe(want);
  },
);
it('pending mixed native searches truncate without inventing public usage or replaying', async () => {
  const first = nativeRound({
    stop: 'tool_use',
    blocks: [
      { type: 'text', text: 'Checking the public sources.', citations: [] },
      search('pending-a'),
      search('pending-b'),
      tool('client-atlas'),
    ],
    nativeSearch: null,
    inputTokens: 2387,
    outputTokens: 154,
  }).message;
  // The real native response omitted this nullable-but-required SDK field.
  Reflect.deleteProperty(first.usage, 'server_tool_use');
  const t = transport([
    first,
    Response.json(
      {
        type: 'error',
        error: {
          type: 'invalid_request_error',
          message:
            'web_search tool use pending-a has no corresponding web_search_tool_result block, but no web_search tool was provided',
        },
      },
      { status: 400 },
    ),
  ]);
  const c = caps();
  const d = deps(sdk(t, c), 'http://127.0.0.1:1');
  d.capabilities = c;
  d.mode = 'live';
  d.lookup = async (name) => {
    if (name !== 'Atlas') throw Error('Unexpected catalog request');
    return atlasCatalog;
  };
  const out = await collect(
    runTurn(
      {
        kind: 'text',
        turnId: crypto.randomUUID(),
        history: [],
        text: 'Research then Atlas',
      },
      d,
      new AbortController().signal,
    ),
  );
  expect(out.at(-1)).toMatchObject({
    type: 'turn.completed',
    data: {
      status: 'truncated',
      usage: { inputTokens: 2387, outputTokens: 154 },
    },
  });
  expect(out.at(-1)).not.toHaveProperty('data.usage.searchUses');
  expect(out.find((e) => e.type === 'tool.completed')).toMatchObject({
    data: {
      result: {
        records: [{ id: 'atlas', status: 'active', ownerTeam: 'North' }],
      },
    },
  });
  expect(out.some((e) => e.type === 'turn.failed')).toBe(false);
  expect(t.requests).toHaveLength(2);
  expect(t.requests[1].tools.map((tool) => tool.name)).toEqual([
    'lookup_projects',
  ]);
  expect(t.requests[1].messages[1]).toEqual({
    role: 'assistant',
    content: first.content,
  });
  expect(c.search).toMatchObject({
    state: 'configured',
    accountValidation: 'pending',
  });
});
it.each([
  [0, 3, 'complete'],
  [1, 2, 'truncated'],
] as const)(
  'unknown native usage stays omitted after later counter %s',
  async (laterCounter, calls, status) => {
    const first = nativeRound({
      stop: 'tool_use',
      blocks: [search('pending-a'), search('pending-b'), tool('client-atlas')],
      nativeSearch: null,
    }).message;
    const t = transport([
      first,
      nativeRound({
        stop: 'pause_turn',
        text: 'Continuing',
        nativeSearch: laterCounter,
      }).message,
      nativeRound({ text: 'Done', nativeSearch: 0 }).message,
    ]);
    const c = caps();
    const d = deps(sdk(t, c), 'http://127.0.0.1:1');
    d.capabilities = c;
    d.lookup = async () => atlasCatalog;
    const out = await collect(
      runTurn(
        {
          kind: 'text',
          turnId: crypto.randomUUID(),
          history: [],
          text: 'Question',
        },
        d,
        new AbortController().signal,
      ),
    );
    expect(out.at(-1)).toMatchObject({
      type: 'turn.completed',
      data: { status },
    });
    expect(out.at(-1)).not.toHaveProperty('data.usage.searchUses');
    expect(t.requests).toHaveLength(calls);
    expect(
      t.requests
        .slice(1)
        .every((request) =>
          request.tools.every((tool) => tool.name !== 'web_search'),
        ),
    ).toBe(true);
  },
);

it('shares two uses across custom tools and pause continuation, omitting exhausted search', async () => {
  const a = round({
    stop: 'tool_use',
    tools: [tool()],
    searchUses: 1,
    nativeSearch: 1,
  });
  const b = round({
    stop: 'pause_turn',
    text: 'Researching',
    searchUses: 1,
    nativeSearch: 1,
  });
  const model = new ScriptedModel([a, b, round({ text: 'Done' })]);
  const d = deps(model, 'http://127.0.0.1:1');
  d.lookup = async () => ({
    schemaVersion: 1,
    source: 'synthetic-project-catalog',
    records: [],
  });
  d.capabilities.search = {
    state: 'configured',
    reason: null,
    accountValidation: 'pending',
  };
  const out = await collect(
    runTurn(
      {
        kind: 'text',
        turnId: crypto.randomUUID(),
        history: [],
        text: 'Question',
      },
      d,
      new AbortController().signal,
    ),
  );
  expect(model.inputs.map((i) => i.searchRemaining)).toEqual([2, 1, 0]);
  expect(model.inputs.map((i) => i.searchEnabled)).toEqual([true, true, false]);
  expect(out.at(-1)).toMatchObject({ data: { usage: { searchUses: 2 } } });
  expect(d.capabilities.search.state).toBe('configured');
});
it('unknown accounting disables later search and does not claim a zero-use total', async () => {
  const model = new ScriptedModel([
    round({ stop: 'pause_turn', searchUses: null, nativeSearch: null }),
    round({ text: 'Answer' }),
  ]);
  const d = deps(model, 'http://127.0.0.1:1');
  d.capabilities.search = {
    state: 'configured',
    reason: null,
    accountValidation: 'pending',
  };
  const out = await collect(
    runTurn(
      {
        kind: 'text',
        turnId: crypto.randomUUID(),
        history: [],
        text: 'Question',
      },
      d,
      new AbortController().signal,
    ),
  );
  expect(model.inputs[1].searchEnabled).toBe(false);
  expect(out.at(-1)).not.toHaveProperty('data.usage.searchUses');
});
it('records actual SDK streaming text/citations/final usage and verifies search only on success', async () => {
  const citation: Anthropic.CitationsWebSearchResultLocation = {
    type: 'web_search_result_location',
    url: 'https://example.test/facts',
    title: 'Facts',
    cited_text: 'fact',
    encrypted_index: 'opaque',
  };
  const m = nativeRound({
    blocks: [
      search(),
      result(),
      { type: 'text', text: 'Grounded', citations: [citation] },
    ],
    nativeSearch: 1,
  }).message;
  const t = transport([m]);
  const c = caps();
  const out = await collect(
    sdk(t, c).runRound(modelInput(), new AbortController().signal),
  );
  expect(out.filter((e) => e.type === 'text')).toEqual([
    { type: 'text', text: 'Grounded' },
  ]);
  expect(out.find((e) => e.type === 'sources')).toMatchObject({
    sources: [
      { url: 'https://example.test/facts', title: 'Facts', citedText: 'fact' },
    ],
  });
  expect(out.at(-1)).toMatchObject({
    type: 'round',
    searchUses: 1,
    message: { usage: { input_tokens: 10, output_tokens: 15 } },
  });
  expect(c.search).toMatchObject({
    state: 'verified',
    accountValidation: 'verified',
  });
  expect(t.requests[0]).toMatchObject({
    max_tokens: 1024,
    tools: expect.arrayContaining([
      { type: 'web_search_20250305', name: 'web_search', max_uses: 2 },
    ]),
  });
});
it.each([false, null, 'missing'])(
  'does not offer search for false/missing model support %s',
  async (support) => {
    const t = transport(
      [nativeRound({ text: 'Ordinary answer' }).message],
      support,
    );
    const c = caps();
    await collect(
      sdk(t, c).runRound(modelInput(), new AbortController().signal),
    );
    expect(c.search.state).toBe('unavailable');
    expect(t.requests[0].tools.some((t) => t.name === 'web_search')).toBe(
      false,
    );
  },
);
it('model metadata failure remains unavailable and ordinary answers work', async () => {
  const t = transport(
    [nativeRound({ text: 'Ordinary answer' }).message],
    Response.json(
      { error: { type: 'api_error', message: 'metadata unavailable' } },
      { status: 503 },
    ),
  );
  const c = caps();
  await collect(sdk(t, c).runRound(modelInput(), new AbortController().signal));
  expect(c.search).toMatchObject({
    state: 'unavailable',
    accountValidation: 'unavailable',
  });
  expect(t.modelCalls()).toBe(1);
  expect(t.requests[0].tools.some((t) => t.name === 'web_search')).toBe(false);
});
it.each([
  [false, 2, true],
  [true, 0, false],
  [true, 2, false],
] as const)(
  'omits zero or disabled search without sending a zero-use tool',
  async (config, remaining, inputEnabled) => {
    const t = transport([nativeRound({ text: 'Answer' }).message]);
    await collect(
      sdk(t, caps(), config).runRound(
        modelInput(remaining, inputEnabled),
        new AbortController().signal,
      ),
    );
    expect(t.requests[0].tools.some((t) => t.name === 'web_search')).toBe(
      false,
    );
    if (!config) expect(t.modelCalls()).toBe(0);
  },
);
it('capability support alone is configured/pending and does not verify an account', async () => {
  const c = caps();
  const t = transport([nativeRound({ text: 'Ordinary' }).message]);
  await collect(sdk(t, c).runRound(modelInput(), new AbortController().signal));
  expect(c.search).toEqual({
    state: 'configured',
    reason: null,
    accountValidation: 'pending',
  });
});
it.each([
  'web_search tool is not supported',
  'Unknown tool type web_search_20250305',
  'Your organization does not have access to web_search',
])(
  'explicit rejection disables process search with no replay: %s',
  async (message) => {
    const t = transport([
      Response.json(
        { type: 'error', error: { type: 'invalid_request_error', message } },
        { status: 400 },
      ),
      nativeRound({ text: 'Ordinary later' }).message,
    ]);
    const c = caps();
    const adapter = sdk(t, c);
    await expect(
      collect(adapter.runRound(modelInput(), new AbortController().signal)),
    ).rejects.toMatchObject({ code: 'SEARCH_UNAVAILABLE' });
    expect(c.search.state).toBe('unavailable');
    expect(t.requests).toHaveLength(1);
    await collect(adapter.runRound(modelInput(), new AbortController().signal));
    expect(t.requests).toHaveLength(2);
    expect(t.requests[1].tools.some((t) => t.name === 'web_search')).toBe(
      false,
    );
  },
);
it('ambiguous upstream failure has no automatic retry or false search-unavailable conclusion', async () => {
  const t = transport([
    Response.json(
      {
        type: 'error',
        error: { type: 'api_error', message: 'Temporary overload' },
      },
      { status: 503 },
    ),
  ]);
  const c = caps();
  await expect(
    collect(sdk(t, c).runRound(modelInput(), new AbortController().signal)),
  ).rejects.toMatchObject({ code: 'MODEL_FAILED' });
  expect(t.requests).toHaveLength(1);
  expect(c.search.state).toBe('configured');
});
it('maxRetries zero prevents automatic 429 replay', async () => {
  const t = transport([
    Response.json(
      { type: 'error', error: { type: 'rate_limit_error', message: 'Busy' } },
      { status: 429 },
    ),
  ]);
  await expect(
    collect(sdk(t).runRound(modelInput(), new AbortController().signal)),
  ).rejects.toMatchObject({ code: 'MODEL_FAILED' });
  expect(t.requests).toHaveLength(1);
});
it('provider max-use errors truncate without replenishing or another request', async () => {
  const err: Anthropic.WebSearchToolResultBlock = {
    ...result(),
    content: {
      type: 'web_search_tool_result_error',
      error_code: 'max_uses_exceeded',
    },
  };
  const t = transport([
    nativeRound({ blocks: [search(), err], nativeSearch: 1 }).message,
  ]);
  const c = caps();
  const d = deps(sdk(t, c), 'http://127.0.0.1:1');
  d.mode = 'live';
  d.capabilities = c;
  const out = await collect(
    runTurn(
      {
        kind: 'text',
        turnId: crypto.randomUUID(),
        history: [],
        text: 'Question',
      },
      d,
      new AbortController().signal,
    ),
  );
  expect(out.at(-1)).toMatchObject({
    type: 'turn.completed',
    data: { status: 'truncated' },
  });
  expect(t.requests).toHaveLength(1);
});
it('omitted-tool continuation incompatibility ends truncated without a further call', async () => {
  const t = transport([
    Response.json(
      {
        type: 'error',
        error: {
          type: 'invalid_request_error',
          message: 'web_search server_tool_use requires a tool definition',
        },
      },
      { status: 400 },
    ),
  ]);
  const adapter = sdk(t);
  const direct = modelInput(0, false);
  direct.messages = [{ role: 'assistant', content: [search()] }];
  await expect(
    collect(adapter.runRound(direct, new AbortController().signal)),
  ).rejects.toMatchObject({ code: 'SEARCH_COMPATIBILITY' });
  expect(t.requests).toHaveLength(1);
  const model = new ScriptedModel([
    round({ stop: 'pause_turn', searchUses: 2, nativeSearch: 2 }),
    async function* () {
      throw new AppError(
        502,
        'SEARCH_COMPATIBILITY',
        'Search continuation rejected.',
        null,
        false,
      );
    },
  ]);
  const d = deps(model, 'http://127.0.0.1:1');
  d.capabilities.search = {
    state: 'configured',
    reason: null,
    accountValidation: 'pending',
  };
  const out = await collect(
    runTurn(
      {
        kind: 'text',
        turnId: crypto.randomUUID(),
        history: [],
        text: 'Question',
      },
      d,
      new AbortController().signal,
    ),
  );
  expect(out.at(-1)).toMatchObject({ data: { status: 'truncated' } });
  expect(model.inputs).toHaveLength(2);
});
it('pre-aborted SDK request makes no model or metadata HTTP call', async () => {
  const t = transport([]);
  const a = new AbortController();
  a.abort();
  await expect(
    collect(sdk(t).runRound(modelInput(), a.signal)),
  ).rejects.toThrow();
  expect(t.modelCalls()).toBe(0);
  expect(t.requests).toHaveLength(0);
});

it('initial pending capability is resolved before enabling hosted search on the first admitted turn', async () => {
  const t = transport([
    nativeRound({
      text: 'Answer',
      blocks: [search(), result()],
      nativeSearch: 1,
    }).message,
  ]);
  const c = caps();
  const d = deps(sdk(t, c), 'http://127.0.0.1:1');
  d.capabilities = c;
  const out = await collect(
    runTurn(
      {
        kind: 'text',
        turnId: crypto.randomUUID(),
        history: [],
        text: 'Research',
      },
      d,
      new AbortController().signal,
    ),
  );
  expect(t.requests[0].tools).toContainEqual({
    type: 'web_search_20250305',
    name: 'web_search',
    max_uses: 2,
  });
  expect(out.at(-1)).toMatchObject({
    type: 'turn.completed',
    data: { status: 'complete' },
  });
});

it('concurrent rounds wait for their own confirmed model support before any Messages call', async () => {
  let release!: () => void;
  const gate = new Promise<void>((r) => {
    release = r;
  });
  const t = transport(
    [
      nativeRound({ text: 'One' }).message,
      nativeRound({ text: 'Two' }).message,
    ],
    false,
  );
  let checks = 0;
  const fetcher: typeof fetch = async (url, init) => {
    if (String(url).includes('/models/')) {
      checks++;
      await gate;
    }
    return t.fake(url, init);
  };
  const adapter = new ClaudeAdapter({
    apiKey: 'offline-test-key',
    model: 'offline',
    capabilities: caps(),
    searchEnabled: true,
    fetch: fetcher,
  });
  const calls = [
    collect(adapter.runRound(modelInput(), new AbortController().signal)),
    collect(adapter.runRound(modelInput(), new AbortController().signal)),
  ];
  await new Promise<void>((r) => setImmediate(r));
  expect(t.requests).toHaveLength(0);
  release();
  await Promise.all(calls);
  expect(checks).toBeGreaterThan(0);
  expect(
    t.requests.every((r) =>
      r.tools.every((tool) => tool.name !== 'web_search'),
    ),
  ).toBe(true);
});

it('pause consuming both hosted uses omits search on the exact unchanged assistant continuation', async () => {
  const first = nativeRound({
    stop: 'pause_turn',
    blocks: [search('a'), result('a'), search('b'), result('b')],
    nativeSearch: 2,
  }).message;
  const t = transport([first, nativeRound({ text: 'Done' }).message]);
  const c = caps();
  const d = deps(sdk(t, c), 'http://127.0.0.1:1');
  d.capabilities = c;
  const out = await collect(
    runTurn(
      {
        kind: 'text',
        turnId: crypto.randomUUID(),
        history: [],
        text: 'Question',
      },
      d,
      new AbortController().signal,
    ),
  );
  expect(t.requests).toHaveLength(2);
  expect(t.requests[1].tools.some((t) => t.name === 'web_search')).toBe(false);
  expect(t.requests[1].messages.at(-1)).toEqual({
    role: 'assistant',
    content: first.content,
  });
  expect(out.at(-1)).toMatchObject({
    data: { status: 'complete', usage: { searchUses: 2 } },
  });
});
it('simulated SDK search in mock mode never claims live account verification', async () => {
  const t = transport([
    nativeRound({ blocks: [search(), result()], nativeSearch: 1 }).message,
  ]);
  const c = caps();
  c.mode = 'mock';
  await collect(sdk(t, c).runRound(modelInput(), new AbortController().signal));
  expect(c.search).toMatchObject({
    state: 'configured',
    accountValidation: 'pending',
  });
});

it('an in-flight successful search cannot erase a concurrent explicit account rejection', async () => {
  const rejection = Response.json(
    {
      type: 'error',
      error: {
        type: 'invalid_request_error',
        message: 'web_search is not supported',
      },
    },
    { status: 400 },
  );
  const t = transport([
    nativeRound({ text: 'Warm' }).message,
    rejection,
    nativeRound({ blocks: [search(), result()], nativeSearch: 1 }).message,
  ]);
  let rejectNow!: () => void, finishNow!: () => void;
  const rejectGate = new Promise<void>((r) => {
      rejectNow = r;
    }),
    finishGate = new Promise<void>((r) => {
      finishNow = r;
    });
  let messages = 0;
  const fake: typeof fetch = async (url, init) => {
    if (!String(url).includes('/models/')) {
      const n = messages++;
      if (n === 1) await rejectGate;
      if (n === 2) await finishGate;
    }
    return t.fake(url, init);
  };
  const c = caps();
  const adapter = new ClaudeAdapter({
    apiKey: 'offline-test-key',
    model: 'offline',
    capabilities: c,
    searchEnabled: true,
    fetch: fake,
  });
  await collect(adapter.runRound(modelInput(), new AbortController().signal));
  const rejecting = collect(
    adapter.runRound(modelInput(), new AbortController().signal),
  ).catch((e) => e);
  const succeeding = collect(
    adapter.runRound(modelInput(), new AbortController().signal),
  );
  await new Promise<void>((r) => setImmediate(r));
  rejectNow();
  expect(await rejecting).toMatchObject({ code: 'SEARCH_UNAVAILABLE' });
  finishNow();
  await succeeding;
  expect(c.search).toMatchObject({
    state: 'unavailable',
    accountValidation: 'unavailable',
  });
});
it('uses integer SDK timeouts inside a fractional monotonic deadline without replay or increasing the token cap', async () => {
  let now = 100;
  const clock = vi.spyOn(performance, 'now').mockImplementation(() => now);
  const t = transport([nativeRound({ text: 'Done' }).message]);
  const c = caps();
  try {
    const run = runWithDeadline(
      60000,
      new AbortController().signal,
      async (signal) => {
        now = 100.25;
        return collect(sdk(t, c).runRound(modelInput(), signal));
      },
    );
    const events = await run.result;
    await run.settled;
    expect(events).toContainEqual({ type: 'text', text: 'Done' });
    expect(t.modelCalls()).toBe(1);
    expect(t.requests).toHaveLength(1);
    expect(t.requests[0].max_tokens).toBe(1024);
    expect(t.requests[0].tools.some((tool) => tool.name === 'web_search')).toBe(
      true,
    );
    expect(c.search.state).toBe('configured');
  } finally {
    clock.mockRestore();
  }
});

it('accepts only canonical configured lookup origins, including private service DNS', async () => {
  const { createRetrievalClient } =
    await import('../../apps/web/server/tools/retrieval-client');
  for (const origin of ['http://lookup:3001', 'https://lookup.internal:3443'])
    expect(() => createRetrievalClient(origin), origin).not.toThrow();
  for (const origin of [
    'http://*.internal:3001',
    'http://user:pass@lookup:3001',
    'http://lookup:3001/',
    'http://lookup:3001/base',
    'http://lookup:3001?target=other',
    'http://lookup:3001#other',
    'ftp://lookup:3001',
  ])
    expect(() => createRetrievalClient(origin), origin).toThrow();
});

it('uses only the configured lookup server and refuses redirects to another real origin', async () => {
  const { createServer } = await import('node:http');
  const { createRetrievalClient } =
    await import('../../apps/web/server/tools/retrieval-client');
  const firstRequests: string[] = [],
    secondRequests: string[] = [];
  const catalog = {
    schemaVersion: 1,
    source: 'synthetic-project-catalog',
    records: [],
  };
  let redirect = false,
    secondOrigin = '';
  const first = createServer((request, response) => {
    firstRequests.push(request.url ?? '');
    if (redirect) {
      response.writeHead(302, { location: secondOrigin + '/v1/projects' });
      response.end();
      return;
    }
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(catalog));
  });
  const second = createServer((request, response) => {
    secondRequests.push(request.url ?? '');
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(catalog));
  });
  const listen = async (server: typeof first) => {
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    if (!address || typeof address === 'string')
      throw Error('Missing local lookup address');
    return 'http://127.0.0.1:' + address.port;
  };
  try {
    const firstOrigin = await listen(first);
    secondOrigin = await listen(second);
    const signal = AbortSignal.timeout(3000);
    const callerUrl = secondOrigin + '/caller-selected?other=1';
    const lookup = createRetrievalClient(firstOrigin);
    expect(await lookup(callerUrl, signal)).toEqual(catalog);
    expect(firstRequests).toHaveLength(1);
    const received = new URL(firstRequests[0], firstOrigin);
    expect(received.pathname).toBe('/v1/projects');
    expect(received.searchParams.get('name')).toBe(callerUrl);
    expect(secondRequests).toEqual([]);
    expect(await createRetrievalClient(secondOrigin)('Beacon', signal)).toEqual(
      catalog,
    );
    expect(secondRequests).toEqual(['/v1/projects?name=Beacon']);
    redirect = true;
    await expect(lookup(undefined, signal)).rejects.toMatchObject({
      code: 'RETRIEVAL_UNAVAILABLE',
      httpStatus: 502,
    });
    expect(firstRequests).toHaveLength(2);
    expect(secondRequests).toEqual(['/v1/projects?name=Beacon']);
  } finally {
    for (const server of [first, second]) server.closeAllConnections();
    await Promise.all(
      [first, second].map(
        (server) =>
          new Promise<void>((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve()));
          }),
      ),
    );
  }
});
