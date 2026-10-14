> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/39c18e086ea832fc3214431575a1161742f374d6/docs/peer-reviews/code/14-capture-module/round-1-reproduction.md) and its exact bytes remain available in the [integration evidence archive](../../../quality-evidence/2026-10-14-25-integration-originals.json).
> Original SHA-256: `10657ddd26d1625d95a3444cc1917291e84bec563f99900d7dcb6c3afa375355`. Review acceptance and protocol hashes apply to those original bytes.

# Round 1 cancellation reproduction

Run from the issue-14 worktree at source `d8d24a59ef956ab2266fc3418c8da49563e43ed8` with Node 26.8.1 and installed tsx. Save the following as a temporary `.mts` file in the repository root, then run `node --import tsx <file>`; alternatively pass it to `node --import tsx --input-type=module -e`. The review used the latter in a separate child process. It changes only process-local dependency factories and globals.

The first case uses the actual CaptureSession, createVad and patched MicVAD. The second isolates the actual public MicVAD destroy path. Model allocation is controlled; this is not physical device or real model evidence.

```ts
import { createRequire } from 'node:module';
import { CaptureSession } from './apps/web/client/voice/capture-session.ts';
import { createVad } from './apps/web/client/voice/vad-adapter.ts';
const require = createRequire(import.meta.url),
  { Silero } = require('@ricky0123/vad-web/dist/models/silero'),
  { MicVAD } = require('@ricky0123/vad-web');
let releaseCalls = 0;
Silero.new = async () => ({
  process: async () => ({ isSpeech: 0, notSpeech: 1 }),
  reset_state() {},
  release: async () => {
    releaseCalls++;
  },
});
globalThis.location = { origin: 'http://localhost:3000' };
let permissionResolve, requestedResolve;
const permission = new Promise((r) => (permissionResolve = r)),
  requested = new Promise((r) => (requestedResolve = r));
const statuses = [];
let trackStops = 0,
  contextCloses = 0;
const session = new CaptureSession({
  createContext: () => ({
    resume: async () => {},
    close: async () => {
      contextCloses++;
    },
  }),
  acquireStream: () => {
    requestedResolve();
    return permission;
  },
  createVad,
  onVadEvent: () => {},
  onUtterance: () => {},
  onStatus: (r) => statuses.push(r),
});
const starting = session.start();
await requested;
const stopping = session.stop();
const track = {
  stop() {
    trackStops++;
    throw Error('late track stop failed');
  },
};
permissionResolve({ getTracks: () => [track] });
const outcomes = await Promise.allSettled([starting, stopping]);
console.log(
  'actual adapter/session',
  JSON.stringify({
    outcomes: outcomes.map((x) => x.status),
    statuses,
    trackStops,
    contextCloses,
    releaseCalls,
  }),
);
let resolveLate;
const late = new Promise((r) => (resolveLate = r));
const vad = await MicVAD.new({
  startOnLoad: false,
  model: 'v5',
  getStream: () => late,
  pauseStream: async () => {
    throw Error('late pause failed');
  },
});
const start = vad.start(),
  destroy = vad.destroy();
const startOutcome = Promise.allSettled([start, destroy]);
resolveLate({ getTracks: () => [] });
console.log(
  'actual MicVAD',
  JSON.stringify(
    (await startOutcome).map((x) => ({
      status: x.status,
      error: x.reason?.message,
    })),
  ),
);
```

Expected behavior after correction: Stop/destroy surface cleanup failure; the CaptureSession status includes CAPTURE_CLEANUP_FAILED. Continue all other cleanup and retain one track-stop attempt/model release/context close. Preserve benign canceled initialization without inventing a current load failure.
