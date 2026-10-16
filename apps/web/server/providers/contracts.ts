import type Anthropic from '@anthropic-ai/sdk';
import type {
  Capabilities,
  ProjectCatalog,
  Source,
  Usage,
} from '../../shared/contracts';
export type ModelRoundInput = {
  messages: Anthropic.MessageParam[];
  searchRemaining: number;
  searchEnabled: boolean;
  maxTokens: 1024;
};
export type ModelEvent =
  | { type: 'text'; text: string }
  | { type: 'sources'; sources: Source[] }
  | {
      type: 'round';
      message: Anthropic.Message;
      searchUses: number | null;
      usage?: Usage;
    };
export interface ModelAdapter {
  runRound(
    input: ModelRoundInput,
    signal: AbortSignal,
  ): AsyncIterable<ModelEvent>;
}
export type TurnDeps = {
  model: ModelAdapter;
  lookup: (
    name: string | undefined,
    signal: AbortSignal,
  ) => Promise<ProjectCatalog>;
  transcribe: (wav: Uint8Array, signal: AbortSignal) => Promise<string>;
  mode: 'live' | 'mock';
  capabilities: Capabilities;
};
export interface SpeechAdapter {
  transcribe(wav: Uint8Array, signal: AbortSignal): Promise<string>;
  synthesize(
    input: import('../../shared/contracts').SpeechInput,
    signal: AbortSignal,
  ): Promise<{
    stream: ReadableStream<Uint8Array>;
    format: { encoding: 'pcm_s16le'; sampleRate: 24000; channels: 1 };
  }>;
}
