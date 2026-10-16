import type Anthropic from '@anthropic-ai/sdk';
import type {
  ModelAdapter,
  ModelEvent,
  ModelRoundInput,
  TurnDeps,
} from '../../apps/web/server/providers/contracts';
import { createRetrievalClient } from '../../apps/web/server/tools/retrieval-client';
import { mockCapabilities, wireDeltaFixture } from './wire-contract-fixtures';
export const multiRoundDeltaFixture = wireDeltaFixture;
export const atlasCatalog = {
  schemaVersion: 1 as const,
  source: 'synthetic-project-catalog' as const,
  records: [
    {
      id: 'atlas',
      name: 'Atlas',
      status: 'active' as const,
      ownerTeam: 'North',
      openItems: 3,
      summary: 'Synthetic active project owned by North with three open items.',
    },
  ],
};
export function tool(
  id = 'tool-atlas-1',
  name = 'lookup_projects',
  input: unknown = { name: 'Atlas' },
): Anthropic.ToolUseBlock {
  return { type: 'tool_use', id, name, input, caller: { type: 'direct' } };
}
export function nativeRound(
  options: {
    stop?: Anthropic.StopReason;
    text?: string;
    blocks?: Anthropic.ContentBlock[];
    tools?: Anthropic.ToolUseBlock[];
    searchUses?: number | null;
    nativeSearch?: number | null;
    inputTokens?: number;
    outputTokens?: number;
  } = {},
): Extract<ModelEvent, { type: 'round' }> {
  const content = options.blocks ?? [
    ...(options.text
      ? [{ type: 'text' as const, text: options.text, citations: [] }]
      : []),
    ...(options.tools ?? []),
  ];
  return {
    type: 'round',
    searchUses: options.searchUses === undefined ? 0 : options.searchUses,
    message: {
      id: 'offline-native-message',
      type: 'message',
      role: 'assistant',
      model: 'offline-scripted',
      content,
      container: null,
      diagnostics: null,
      stop_details: null,
      stop_reason: options.stop ?? 'end_turn',
      stop_sequence: null,
      usage: {
        input_tokens: options.inputTokens ?? 10,
        output_tokens: options.outputTokens ?? 15,
        cache_creation: null,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
        inference_geo: null,
        output_tokens_details: null,
        service_tier: null,
        server_tool_use:
          options.nativeSearch === null
            ? null
            : {
                web_search_requests:
                  options.nativeSearch ?? options.searchUses ?? 0,
                web_fetch_requests: 0,
              },
      },
    },
  };
}
export function round(
  options: Parameters<typeof nativeRound>[0] = {},
): ModelEvent[] {
  const final = nativeRound(options);
  return [
    ...final.message.content
      .filter((b) => b.type === 'text')
      .map((b) => ({ type: 'text' as const, text: b.text })),
    final,
  ];
}
export type Script =
  ModelEvent[] | ((signal: AbortSignal) => AsyncIterable<ModelEvent>);
export class ScriptedModel implements ModelAdapter {
  readonly inputs: ModelRoundInput[] = [];
  readonly signals: AbortSignal[] = [];
  constructor(private readonly scripts: Script[]) {}
  async *runRound(
    input: ModelRoundInput,
    signal: AbortSignal,
  ): AsyncIterable<ModelEvent> {
    this.inputs.push(structuredClone(input));
    this.signals.push(signal);
    const script = this.scripts[this.inputs.length - 1];
    if (!script) throw Error('Unexpected model replay');
    if (typeof script === 'function') {
      yield* script(signal);
    } else {
      yield* script;
    }
  }
}
export async function collect<T>(events: AsyncIterable<T>): Promise<T[]> {
  const all: T[] = [];
  for await (const e of events) all.push(e);
  return all;
}
export function deps(model: ModelAdapter, retrievalUrl: string): TurnDeps {
  return {
    model,
    lookup: createRetrievalClient(retrievalUrl),
    transcribe: async () => {
      throw Error('Typed input called transcription');
    },
    mode: 'mock',
    capabilities: structuredClone(mockCapabilities),
  };
}
export function deferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}
