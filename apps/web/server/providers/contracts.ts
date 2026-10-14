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
