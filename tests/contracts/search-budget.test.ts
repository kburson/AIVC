import type { ModelRoundInput } from '../../apps/web/server/providers/contracts';
import { expect, it } from 'vitest';
import type Anthropic from '@anthropic-ai/sdk';
import {
  ClaudeAdapter,
  accountSearch,
} from '../../apps/web/server/providers/claude';
import { runTurn } from '../../apps/web/server/turns/run-turn';
import { AppError } from '../../apps/web/shared/contracts';
import { mockCapabilities } from '../helpers/wire-contract-fixtures';
import {
  collect,
  nativeRound,
  round,
  ScriptedModel,
  deps,
  tool,
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
  ['native IDs without usage', null, [search('a'), search('b')], 2],
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
