import type Anthropic from '@anthropic-ai/sdk';
import { validateProjectCatalog } from '@aivc/contracts';
import type { ModelAdapter, ModelEvent, ModelRoundInput } from './contracts.js';
function message(
  content: Anthropic.ContentBlock[],
  stop: Anthropic.StopReason,
): Anthropic.Message {
  return {
    id: 'mock-round',
    type: 'message',
    role: 'assistant',
    model: 'mock',
    content,
    stop_reason: stop,
    stop_sequence: null,
    container: null,
    diagnostics: null,
    stop_details: null,
    usage: {
      input_tokens: 0,
      output_tokens: 0,
      cache_creation: null,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
      inference_geo: null,
      output_tokens_details: null,
      service_tier: null,
      server_tool_use: { web_search_requests: 0, web_fetch_requests: 0 },
    },
  };
}
export class MockAdapter implements ModelAdapter {
  async *runRound(
    input: ModelRoundInput,
    signal: AbortSignal,
  ): AsyncIterable<ModelEvent> {
    signal.throwIfAborted();
    const last = input.messages.at(-1);
    let text: string;
    let content: Anthropic.ContentBlock[];
    let stop: Anthropic.StopReason = 'end_turn';
    if (Array.isArray(last?.content)) {
      const result = last.content.find((b) => b.type === 'tool_result');
      if (
        result?.type === 'tool_result' &&
        !result.is_error &&
        typeof result.content === 'string'
      ) {
        const catalog = validateProjectCatalog(JSON.parse(result.content));
        text = catalog.records.length
          ? catalog.records
              .map(
                (r) =>
                  r.name +
                  ' is ' +
                  r.status +
                  ', owned by ' +
                  r.ownerTeam +
                  ', with ' +
                  r.openItems +
                  ' open items.',
              )
              .join(' ')
          : 'No matching synthetic projects were found.';
      } else text = 'Mock response: the lookup arguments were rejected.';
      content = [{ type: 'text', text, citations: [] }];
    } else {
      const question = typeof last?.content === 'string' ? last.content : '';
      if (/project|status|atlas/i.test(question)) {
        const name = question.match(/(?:status of|project)\s+([\w-]+)/i)?.[1];
        text = name
          ? 'Let me check ' + name + '.'
          : 'Let me check the projects.';
        stop = 'tool_use';
        content = [
          { type: 'text', text, citations: [] },
          {
            type: 'tool_use',
            id: 'mock-lookup-1',
            name: 'lookup_projects',
            input: name ? { name } : {},
            caller: { type: 'direct' },
          },
        ];
      } else {
        text = 'Mock response: ' + question;
        content = [{ type: 'text', text, citations: [] }];
      }
    }
    yield { type: 'text', text };
    yield { type: 'round', message: message(content, stop), searchUses: 0 };
  }
}

// Synthetic speech is deliberately deterministic and never claims provider audio.
export function createMockSpeechAdapter(): import('./contracts.js').SpeechAdapter {
  return {
    async transcribe(_wav, signal) {
      signal.throwIfAborted();
      return 'Hello from mock speech.';
    },
    async synthesize(_input, signal) {
      signal.throwIfAborted();
      let chunk = 0;
      return {
        format: { encoding: 'pcm_s16le', sampleRate: 24000, channels: 1 },
        stream: new ReadableStream<Uint8Array>({
          pull(c) {
            signal.throwIfAborted();
            if (chunk++ < 2) {
              const bytes = new Uint8Array(2400);
              const view = new DataView(bytes.buffer);
              for (let i = 0; i < 1200; i++)
                view.setInt16(
                  i * 2,
                  Math.round(
                    Math.sin(
                      ((i + (chunk - 1) * 1200) * 2 * Math.PI * 440) / 24000,
                    ) * 2000,
                  ),
                  true,
                );
              c.enqueue(bytes);
            } else c.close();
          },
        }),
      };
    },
  };
}
