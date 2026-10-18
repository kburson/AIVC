import { PipelinePools } from '../../apps/orchestrator/src/resources.js';
import { expect, it } from 'vitest';
import { getTurnDeps, getSpeechAdapter } from '../../apps/web/server/runtime';
import type { ServerRuntime } from '../../apps/web/server/runtime';
import { loadConfig } from '../../apps/web/server/config';
import { createCapabilities } from '../../apps/web/server/capabilities';
import { LeasePools } from '../../apps/web/server/turns/leases';
import { runTurn } from '../../apps/web/server/turns/run-turn';
import { assertTurnSequence } from '@aivc/contracts';
import { validateTurnEvent } from '@aivc/contracts';
import { collect, round, ScriptedModel } from '../helpers/scripted-providers';
import { AppError } from '../../apps/web/server/http/errors';
function runtime(): ServerRuntime {
  const config = loadConfig({
    NODE_ENV: 'test',
    AIVC_MODE: 'mock',
    BFF_ALLOWED_HOSTS: 'localhost:3000',
    BFF_ALLOWED_ORIGINS: 'http://localhost:3000',
    RETRIEVAL_BASE_URL: 'http://localhost:3001',
    SPEECH_CHARS_PER_SECOND: '14',
    TURN_TIMEOUT_MS: '60000',
    RETRIEVAL_TIMEOUT_MS: '5000',
    SPEECH_TIMEOUT_MS: '20000',
  });
  return {
    config,
    capabilities: createCapabilities(config, {
      mode: 'development',
      buildId: null,
    }),
    adapters: {},
    leasePools: new LeasePools(),
    pipelines: new PipelinePools(),
    buildInfo: Promise.resolve({ mode: 'development', buildId: null }),
  };
}
const input = () => ({
  kind: 'audio' as const,
  turnId: crypto.randomUUID(),
  history: [],
  wav: Uint8Array.of(1, 2),
});
it('wires deterministic mock audio through actual producer and chunked PCM', async () => {
  const rt = runtime();
  const events = await collect(
    runTurn(input(), getTurnDeps(rt), new AbortController().signal),
  );
  events.forEach(validateTurnEvent);
  assertTurnSequence(events);
  expect(events[1]).toMatchObject({
    type: 'stage',
    data: { stage: 'transcribing' },
  });
  expect(events[2]).toMatchObject({
    type: 'transcript.final',
    data: { text: 'Hello from mock speech.' },
  });
  expect(events.at(-1)).toMatchObject({
    type: 'turn.completed',
    data: { status: 'complete' },
  });
  const speech = getSpeechAdapter(rt);
  const a = await speech.synthesize(
    { turnId: crypto.randomUUID(), segmentId: 's', text: 'Hello' },
    new AbortController().signal,
  );
  const reader = a.stream.getReader();
  expect((await reader.read()).value!.length).toBeGreaterThan(0);
  expect((await reader.read()).value!.length).toBeGreaterThan(0);
  await reader.cancel();
});
it('empty transcription completes no-speech without model work', async () => {
  const rt = runtime(),
    model = new ScriptedModel([]);
  rt.adapters.model = model;
  rt.adapters.transcribe = async () => '';
  const out = await collect(
    runTurn(input(), getTurnDeps(rt), new AbortController().signal),
  );
  assertTurnSequence(out);
  expect(out.at(-1)).toMatchObject({
    type: 'turn.completed',
    data: { status: 'no-speech', text: '' },
  });
  expect(model.inputs).toHaveLength(0);
});
it('speech failure retains complete answer and distinct transcription failure stays visible', async () => {
  const rt = runtime();
  rt.adapters.model = new ScriptedModel([round({ text: 'Complete answer' })]);
  rt.adapters.transcribe = async () => 'Question';
  const out = await collect(
    runTurn(input(), getTurnDeps(rt), new AbortController().signal),
  );
  rt.adapters.speech = {
    transcribe: async () => '',
    synthesize: async () => {
      throw new AppError(502, 'SPEECH_FAILED', 'Speech failed.', null, false);
    },
  };
  await expect(
    getSpeechAdapter(rt).synthesize(
      { turnId: crypto.randomUUID(), segmentId: 's', text: 'Complete answer' },
      new AbortController().signal,
    ),
  ).rejects.toMatchObject({ code: 'SPEECH_FAILED' });
  expect(out.at(-1)).toMatchObject({
    type: 'turn.completed',
    data: { text: 'Complete answer' },
  });
  rt.adapters.transcribe = async () => {
    throw new AppError(502, 'STT_FAILED', 'Transcription failed.', null, false);
  };
  const bad = await collect(
    runTurn(input(), getTurnDeps(rt), new AbortController().signal),
  );
  expect(bad.at(-1)).toMatchObject({
    type: 'turn.failed',
    data: { code: 'STT_FAILED' },
  });
});
