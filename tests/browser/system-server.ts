// Test-owned orchestration: both actual applications run, and /api/turn is never intercepted.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRetrievalApp } from '../../apps/retrieval/src/http/app';
const root = fileURLToPath(new URL('../../', import.meta.url));
const app = createRetrievalApp();
let mode: 'normal' | 'hold' | 'fail' = 'normal';
let requests: string[] = [];
const pending = new Set<() => void>();
function release() {
  mode = 'normal';
  for (const done of pending) done();
  pending.clear();
}
app.addHook('onRequest', async (request, reply) => {
  if (request.url.split('?')[0] !== '/v1/projects') return;
  requests.push(
    new URL(request.url, 'http://localhost').searchParams.get('name') ?? '',
  );
  if (mode === 'fail')
    return reply.code(503).send({ error: 'Test-owned retrieval outage' });
  if (mode === 'hold')
    await new Promise<void>((resolve) => pending.add(resolve));
});
app.post<{ Body: { mode: typeof mode } }>(
  '/__test/configure',
  (request, reply) => {
    release();
    if (!['normal', 'hold', 'fail'].includes(request.body.mode))
      return reply.code(400).send();
    mode = request.body.mode;
    requests = [];
    return { mode };
  },
);
app.post('/__test/release', () => {
  release();
  return { mode };
});
app.get('/__test/state', () => ({ mode, requests, pending: pending.size }));
await app.listen({ host: '127.0.0.1', port: 3001 });
const next = spawn(
  process.execPath,
  [
    root + 'node_modules/next/dist/bin/next',
    'dev',
    '--hostname',
    '127.0.0.1',
    '--port',
    '3000',
  ],
  {
    cwd: root + 'apps/web',
    stdio: 'inherit',
    env: {
      ...process.env,
      AIVC_MODE: 'mock',
      ANTHROPIC_API_KEY: '',
      CLAUDE_MODEL: '',
      DEEPGRAM_API_KEY: '',
      DEEPGRAM_STT_MODEL: '',
      DEEPGRAM_TTS_MODEL: '',
      RETRIEVAL_BASE_URL: 'http://127.0.0.1:3001',
      CLAUDE_WEB_SEARCH: 'disabled',
      CLAUDE_WEB_SEARCH_TOOL_VERSION: 'web_search_20250305',
      BFF_ALLOWED_ORIGINS: 'http://localhost:3000,http://127.0.0.1:3000',
      BFF_ALLOWED_HOSTS: 'localhost:3000,127.0.0.1:3000',
      SPEECH_CHARS_PER_SECOND: '14',
      TURN_TIMEOUT_MS: '60000',
      RETRIEVAL_TIMEOUT_MS: '15000',
      SPEECH_TIMEOUT_MS: '20000',
    },
  },
);
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  release();
  next.kill('SIGTERM');
  await app.close();
}
process.once('SIGTERM', () => {
  void stop();
});
process.once('SIGINT', () => {
  void stop();
});
next.once('exit', (code) => {
  void stop().then(() => {
    process.exitCode = code ?? 1;
  });
});
