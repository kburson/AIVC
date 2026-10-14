import type Anthropic from '@anthropic-ai/sdk';
import type {
  EventPayloads,
  TurnInput,
  TurnEvent,
  Usage,
} from '../../shared/contracts';
import { AppError, errorFields } from '../http/errors';
import type { TurnDeps, ModelEvent } from '../providers/contracts';
import { lookupArguments } from '../tools/lookup-projects';
export async function* runTurn(
  input: TurnInput,
  deps: TurnDeps,
  signal: AbortSignal,
): AsyncIterable<TurnEvent> {
  signal.throwIfAborted();
  let seq = 0,
    text = '',
    attempts = 0,
    searchRemaining = 2,
    searchKnown = true;
  const usage: Usage = { inputTokens: 0, outputTokens: 0, searchUses: 0 };
  const event = <K extends keyof EventPayloads>(
    type: K,
    data: EventPayloads[K],
  ): TurnEvent =>
    ({
      schemaVersion: 1,
      turnId: input.turnId,
      seq: seq++,
      type,
      data,
    }) as TurnEvent;
  const delta = (value: string) => {
    text += value;
    return event('answer.delta', { text: value });
  };
  const completed = (status: 'complete' | 'truncated' | 'no-speech') =>
    event('turn.completed', { text, status, usage });
  yield event('turn.accepted', { mode: deps.mode });
  try {
    let question: string;
    if (input.kind === 'audio') {
      yield event('stage', { stage: 'transcribing' });
      question = await deps.transcribe(input.wav, signal);
      signal.throwIfAborted();
      if (!question.trim()) {
        yield completed('no-speech');
        return;
      }
      yield event('transcript.final', { text: question });
    } else question = input.text;
    const messages: Anthropic.MessageParam[] = [
      ...input.history,
      { role: 'user', content: question },
    ];
    let stage: 'researching' | 'answering' = 'researching';
    for (let call = 0; call < 3; call++) {
      signal.throwIfAborted();
      yield event('stage', { stage });
      let first = true;
      let final: Extract<ModelEvent, { type: 'round' }> | undefined;
      for await (const part of deps.model.runRound(
        {
          messages,
          searchRemaining,
          searchEnabled:
            searchRemaining > 0 &&
            ['configured', 'verified'].includes(deps.capabilities.search.state),
          maxTokens: 1024,
        },
        signal,
      )) {
        signal.throwIfAborted();
        if (final)
          throw new AppError(
            502,
            'MODEL_FAILED',
            'Provider emitted data after its final round.',
            input.turnId,
            false,
          );
        if (part.type === 'text' && part.text) {
          if (first && call > 0 && text && !/\s$/.test(text))
            yield delta('\n\n');
          first = false;
          yield delta(part.text);
        } else if (part.type === 'sources')
          yield event('sources', { sources: part.sources });
        else if (part.type === 'round') final = part;
      }
      signal.throwIfAborted();
      if (!final)
        throw new AppError(
          502,
          'MODEL_FAILED',
          'Provider round did not settle with a message.',
          input.turnId,
          false,
        );
      const native = final.message;
      usage.inputTokens = (usage.inputTokens ?? 0) + native.usage.input_tokens;
      usage.outputTokens =
        (usage.outputTokens ?? 0) + native.usage.output_tokens;
      const used = final.searchUses;
      if (used !== null && (!Number.isSafeInteger(used) || used < 0))
        searchRemaining = 0;
      else if (used !== null && used > searchRemaining) {
        yield delta('\n\n[Answer truncated: hosted search limit reached.]');
        yield completed('truncated');
        return;
      } else {
        searchRemaining = used === null ? 0 : searchRemaining - used;
        if (used === null) {
          searchKnown = false;
          delete usage.searchUses;
        } else if (searchKnown)
          usage.searchUses = (usage.searchUses ?? 0) + used;
      }
      messages.push({ role: 'assistant', content: native.content });
      if (native.stop_reason === 'end_turn') {
        yield completed('complete');
        return;
      }
      if (
        native.stop_reason === 'max_tokens' ||
        native.stop_reason === 'model_context_window_exceeded'
      ) {
        yield delta('\n\n[Answer truncated: output token limit reached.]');
        yield completed('truncated');
        return;
      }
      if (
        native.stop_reason !== 'tool_use' &&
        native.stop_reason !== 'pause_turn'
      )
        throw new AppError(
          502,
          'MODEL_FAILED',
          'Provider did not finish the answer.',
          input.turnId,
          false,
        );
      if (native.stop_reason === 'tool_use') {
        const tools = native.content.filter(
          (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
        );
        if (!tools.length)
          throw new AppError(
            502,
            'MODEL_FAILED',
            'Provider requested no executable tool.',
            input.turnId,
            false,
          );
        if (tools.length > 4 - attempts) {
          yield delta('\n\n[Answer truncated: custom tool limit reached.]');
          yield completed('truncated');
          return;
        }
        if (call === 2) {
          yield delta('\n\n[Answer truncated: model round limit reached.]');
          yield completed('truncated');
          return;
        }
        const results: Anthropic.ToolResultBlockParam[] = [];
        for (const tool of tools) {
          attempts++;
          let args: { name?: string };
          try {
            args = lookupArguments(tool.name, tool.input);
          } catch {
            results.push({
              type: 'tool_result',
              tool_use_id: tool.id,
              is_error: true,
              content:
                'Invalid lookup_projects arguments. Use only an optional project name.',
            });
            continue;
          }
          yield event('tool.started', {
            name: 'lookup_projects',
            summary: args.name ? 'Lookup ' + args.name : 'Lookup all projects',
          });
          yield event('stage', { stage: 'retrieving' });
          const catalog = await deps.lookup(args.name, signal);
          signal.throwIfAborted();
          yield event('tool.completed', { result: catalog });
          results.push({
            type: 'tool_result',
            tool_use_id: tool.id,
            is_error: false,
            content: JSON.stringify(catalog),
          });
        }
        messages.push({ role: 'user', content: results });
        stage = 'answering';
      }
    }
    yield delta('\n\n[Answer truncated: model round limit reached.]');
    yield completed('truncated');
  } catch (error) {
    if (
      !signal.aborted &&
      error instanceof AppError &&
      ['SEARCH_LIMIT', 'SEARCH_COMPATIBILITY'].includes(error.code)
    ) {
      yield delta(
        error.code === 'SEARCH_LIMIT'
          ? '\n\n[Answer truncated: hosted search limit reached.]'
          : '\n\n[Answer truncated: hosted search continuation is incompatible.]',
      );
      yield completed('truncated');
      return;
    }
    const failure =
      signal.aborted && !(signal.reason instanceof AppError)
        ? new AppError(
            400,
            'TURN_INTERRUPTED',
            'Turn interrupted.',
            input.turnId,
            false,
          )
        : signal.aborted
          ? signal.reason
          : error;
    yield event('turn.failed', {
      ...errorFields(failure),
      turnId: input.turnId,
    });
  }
}
