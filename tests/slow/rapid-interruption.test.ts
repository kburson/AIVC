import { PipelinePools } from '../../apps/orchestrator/src/resources.js';
// Actual route admission and abort signals; scripted upstream intentionally ignores cancellation.
import { afterEach, expect, it } from 'vitest';
import { POST } from '../../apps/web/app/api/turn/route';
import { POST as speechPOST } from '../../apps/web/app/api/speech/route';
import type { ServerRuntime } from '../../apps/web/server/runtime';
import { loadConfig } from '../../apps/web/server/config';
import { createCapabilities } from '../../apps/web/server/capabilities';
import { LeasePools } from '../../apps/web/server/turns/leases';
import { Interruption } from '../../apps/web/client/voice/interruption';
import { TurnController } from '../../apps/web/client/turn-controller';
import type { CaptureToken } from '../../apps/web/client/voice/capture-session';
import { encodeWav } from '../../apps/web/client/voice/wav';
import {
  ScriptedModel,
  deferred,
  nativeRound,
  round,
  tool,
  atlasCatalog,
} from '../helpers/scripted-providers';
const state = globalThis as typeof globalThis & {
  __aivcRuntimeV1?: ServerRuntime;
};
const previous = state.__aivcRuntimeV1;
const releases: Array<() => void> = [];
afterEach(async () => {
  for (const release of releases.splice(0)) release();
  await tick();
  if (previous) state.__aivcRuntimeV1 = previous;
  else delete state.__aivcRuntimeV1;
});
const tick = () => new Promise<void>((r) => setImmediate(r));
function setup(adapters: Record<string, unknown>) {
  const config = loadConfig({
    NODE_ENV: 'test',
    AIVC_MODE: 'mock',
    BFF_ALLOWED_HOSTS: 'localhost:3000',
    BFF_ALLOWED_ORIGINS: 'http://localhost:3000',
    RETRIEVAL_BASE_URL: 'http://127.0.0.1:1',
    SPEECH_CHARS_PER_SECOND: '14',
    TURN_TIMEOUT_MS: '60000',
    RETRIEVAL_TIMEOUT_MS: '5000',
    SPEECH_TIMEOUT_MS: '20000',
  });
  const build = { mode: 'development' as const, buildId: null };
  state.__aivcRuntimeV1 = {
    config,
    capabilities: {
      ...createCapabilities(config, build),
      speechAvailable: true,
    },
    adapters,
    leasePools: new LeasePools(),
    pipelines: new PipelinePools(),
    buildInfo: Promise.resolve(build),
  };
}
function request(signal: AbortSignal, audio = false) {
  const form = new FormData();
  form.set('turnId', crypto.randomUUID());
  form.set('history', '[]');
  if (audio)
    form.set('audio', encodeWav(new Float32Array(1600)), 'capture.wav');
  else form.set('text', 'Atlas?');
  return new Request('http://localhost:3000/api/turn', {
    method: 'POST',
    body: form,
    signal,
    headers: { host: 'localhost:3000', origin: 'http://localhost:3000' },
  });
}
async function readUntil(response: Response, fragment: string) {
  const reader = response.body!.getReader();
  let text = '';
  while (!text.includes(fragment)) {
    const part = await reader.read();
    if (part.done) break;
    text += new TextDecoder().decode(part.value);
  }
  reader.releaseLock();
  expect(text).toContain(fragment);
}
it('three confirmed turns reject the third Busy while both canceled model jobs remain unsettled, then deliberate recovery succeeds without replay', async () => {
  const gates = [deferred(), deferred()];
  releases.push(...gates.map((g) => g.resolve));
  const scripts = gates.map(
    (g) =>
      async function* () {
        yield { type: 'text' as const, text: 'Early' };
        await g.promise;
        yield nativeRound({ text: 'Early' });
      },
  );
  const model = new ScriptedModel([...scripts, round({ text: 'Recovered' })]);
  setup({ model, transcribe: async () => 'Atlas?' });
  const controller = new TurnController();
  let capture: CaptureToken | null = null;
  let pending!: Promise<Response>;
  const submit = (audio = false) => {
    const token = controller.begin(),
      abort = new AbortController();
    controller.attachAbort(token, abort);
    return POST(request(abort.signal, audio));
  };
  const interruption = new Interruption({
    controller,
    answerToken: () => {
      const token = controller.getSnapshot().at(-1);
      return token && controller.current(token) ? token : null;
    },
    captureIsCurrent: (token) => token === capture,
    isActive: () => true,
    output: () => null,
    onEnd: () => {
      pending = submit(true);
    },
    showSpeechResumeFailure: () => {
      throw Error('Unexpected output recovery');
    },
  });
  const confirmedQuestion = (id: number) => {
    capture = Object.freeze({ epoch: 1, utteranceId: id, intentVersion: 0 });
    interruption.rawStart(capture);
    interruption.confirmedStart(capture);
    interruption.end(capture, new Float32Array(1600));
  };
  const a = await submit();
  await readUntil(a, 'Early');
  confirmedQuestion(1);
  await a.body!.cancel();
  const b = await pending;
  await readUntil(b, 'Early');
  confirmedQuestion(2);
  await b.body!.cancel();
  expect(model.signals.map((s) => s.aborted)).toEqual([true, true]);
  const busy = await pending;
  expect(busy.status).toBe(429);
  expect(await busy.json()).toMatchObject({ error: { code: 'BUSY' } });
  expect(model.inputs).toHaveLength(2);
  await tick();
  expect(model.inputs).toHaveLength(2);
  gates[0].resolve();
  gates[1].resolve();
  await tick();
  await tick();
  const recovered = await POST(request(new AbortController().signal));
  expect(recovered.status).toBe(200);
  expect(await recovered.text()).toContain('Recovered');
  expect(model.inputs).toHaveLength(3);
});
it.each(['model', 'STT', 'retrieval'] as const)(
  'confirmed caller cancellation aborts %s without replay and keeps its unsettled turn lease',
  async (path) => {
    const gate = deferred();
    releases.push(gate.resolve);
    let signal: AbortSignal | undefined,
      calls = 0;
    const model =
      path === 'model'
        ? new ScriptedModel([
            async function* (s) {
              signal = s;
              calls++;
              yield { type: 'text' as const, text: 'Early' };
              await gate.promise;
              yield nativeRound({ text: 'Early' });
            },
          ])
        : new ScriptedModel([round({ stop: 'tool_use', tools: [tool()] })]);
    setup({
      model,
      transcribe: async (_wav: Uint8Array, s: AbortSignal) => {
        signal = s;
        calls++;
        await gate.promise;
        return 'Atlas?';
      },
      lookup: async (_name: string, s: AbortSignal) => {
        signal = s;
        calls++;
        await gate.promise;
        return atlasCatalog;
      },
    });
    const caller = new AbortController(),
      response = await POST(request(caller.signal, path === 'STT'));
    await readUntil(
      response,
      path === 'model'
        ? 'Early'
        : path === 'STT'
          ? 'transcribing'
          : 'tool.started',
    );
    await tick();
    expect(signal).toBeDefined();
    caller.abort();
    await response.body!.cancel();
    expect(signal!.aborted).toBe(true);
    expect(calls).toBe(1);
    const pools = state.__aivcRuntimeV1!.leasePools;
    const other = pools.acquire('turn');
    expect(() => pools.acquire('turn')).toThrow(/busy/i);
    other.release();
    gate.resolve();
    await tick();
    await tick();
    const recovered = pools.acquire('turn');
    recovered.release();
    expect(calls).toBe(1);
  },
);
it('confirmed cancellation aborts TTS while transport settlement retains speech capacity and never replays', async () => {
  const gate = deferred();
  releases.push(gate.resolve);
  let signal: AbortSignal | undefined,
    calls = 0;
  setup({
    speech: {
      transcribe: async () => '',
      synthesize: async (_input: unknown, s: AbortSignal) => {
        signal = s;
        calls++;
        await gate.promise;
        return {
          stream: new ReadableStream<Uint8Array>({
            start(c) {
              c.enqueue(new Uint8Array([0, 0]));
              c.close();
            },
          }),
        };
      },
    },
  });
  const caller = new AbortController();
  const response = speechPOST(
    new Request('http://localhost:3000/api/speech', {
      method: 'POST',
      signal: caller.signal,
      headers: {
        host: 'localhost:3000',
        origin: 'http://localhost:3000',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        turnId: crypto.randomUUID(),
        segmentId: '1',
        text: 'Hello.',
      }),
    }),
  );
  for (let i = 0; i < 20 && !signal; i++) await tick();
  expect(signal).toBeDefined();
  caller.abort();
  expect((await response).status).toBeGreaterThanOrEqual(400);
  expect(signal!.aborted).toBe(true);
  expect(calls).toBe(1);
  const pools = state.__aivcRuntimeV1!.leasePools,
    held = [];
  // Both pools have two slots; canceled upstream still owns one until settlement.
  try {
    for (let i = 0; i < 1; i++) held.push(pools.acquire('speech'));
    expect(() => pools.acquire('speech')).toThrow(/busy/i);
  } finally {
    for (const lease of held) lease.release();
  }
  gate.resolve();
  await tick();
  await tick();
  expect(calls).toBe(1);
});
