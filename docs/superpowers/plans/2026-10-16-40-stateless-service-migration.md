# Stateless Service Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for inline execution or superpowers:subagent-driven-development when the owner selects that method. Steps use checkbox (`- [ ]`) syntax for tracking. This document authorizes neither execution method nor implementation.

**Goal:** Deliver the real three-service migration required by #40 so research #41/#42 can consume an accepted integrated application and stateless-service evidence.

**Architecture:** Browser-safe contracts form a neutral workspace. A standalone Fastify orchestrator owns the existing provider/tool lifecycle; Next.js delegates over private authenticated streaming HTTP. Lookup stays independent. History and speech inputs travel with each request; cancellation stays with its open transport, so no shared coordination store or affinity is required for the selected semantics.

**Tech Stack:** Existing Node 26.8.1/npm 12.0.2, TypeScript/ESM, Next.js 16.4.0, Fastify 5.12.5, existing pinned provider SDKs, Vitest, node:test, Playwright, Docker Compose. No dependency/runtime upgrade is included.

**Spec:** [XPR-accepted migration design](../specs/2026-10-16-40-stateless-service-migration-design.md), published at `e6e96c9`, SHA-256 `f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`. Sealed review `review-0009efb5ca6886291ad48628afa78120` finalized accepted-uncommitted after two reviewer rounds and one revision; ordinary Git publication separately pins those bytes. Read both artifacts and governing #39 sections. Historical SAR and #39 acceptance do not approve this revised artifact.

**Issue:** [#40](https://github.com/kburson/AIVC/issues/40). Date: October 16, 2026 (America/Chicago). Draft for independent review. Future code/test steps below are requirements, not claims that they were performed.

## Global Constraints

- Preparation/review only until owner approval; no product implementation, paid calls, deployment, cluster or research campaign.
- Independent production web, orchestrator and lookup containers; scale orchestrator without copying peers.
- Preserve multipart text/WAV and JSON speech; add the accepted design's bounded JSON text-turn representation. Preserve version-1 SSE/PCM/error/usage schemas.
- Core auth, interface-policy consistency and two-per-kind pre-body pipeline admission precede parsing/provider leases; web Host/Origin protection; no wildcard/forwarded-header trust, retries, credential leakage or browser core token.
- Two turn/two speech pipeline permits cover ingestion through actual settlement, separately from the existing two-per-kind paid leases acquired after validation. No waiting queue or timeout-based early release.
- No history/session storage or affinity; explicit client generation fencing and per-stream cancellation. No global idempotency or remote cancellation claim.
- Streaming application queues at most 64 KiB plus one chunk of at most 16 KiB per hop; socket buffers declared separately.
- Core deadlines include upload. BFF deadline includes upload/connect/headers/full stream without chunk resets; no cross-process monotonic subtraction.
- SIGTERM withdraws readiness, refuses new work, drains 15 seconds, aborts then waits 5 seconds; container stop grace at least 25 seconds; unsettled hard exit remains unknown.
- Mock providers and local real-adapter/SDK protocol stubs only; external provider egress denied, paid credentials absent and stub credentials valueless. Preserve historical sealed evidence.
- Health/readiness are local only; dependency diagnostics never gate either. Shared non-secret interface-policy digests gate accepted topology and delegated API admission, not static UI availability.

## Review Focus

1. Upload completed but response client disconnects: cancel the actual provider owner and retain its lease until settlement (Tasks 2–3).
2. A slow reader stops consuming while producer keeps generating: bound both bridges and producer demand, including abort while waiting for drain (Task 2, repeated via Task 3).
3. Turn A followed by speech/history B and cold A replacement: no server-local state/affinity; stale generation output remains fenced by the real client (Task 5).
4. Drain with keepalive, late provider cancellation and hard kill: refuse new work, preserve unknown outcomes and never replay (Tasks 4–5).
5. Mismatched interface policy or early core refusal while an upload is open: reject before paid work and preserve delegated status/retryability; dependency loss must leave static UI ready (Tasks 2–5). Missing tooling or identity evidence fails acceptance explicitly (Tasks 4–6).

## Delivery graph and effort

These are proposed implementation work packages, not created or approved issues. Preliminary joint effort is reassessed from 52 to 64 hours/XL for JSON parsing, pre-body admission, pinned Next compatibility, policy consistency, real SDK stubs and deterministic attribution. This is a review input, not an approved forecast or AI elapsed time.

| Task  | Deliverable                                          | Depends on                                   | Joint hours |
| ----- | ---------------------------------------------------- | -------------------------------------------- | ----------- |
| 1     | Neutral contracts, JSON and Next compatibility proof | Accepted spec/plan and normal AITM admission | 6           |
| 2     | Portable core, pre-body admission and SDK stub proof | 1                                            | 16          |
| 3     | Thin forwarding, policy and owned Next listener      | 2                                            | 8           |
| 4     | Production containers, lifecycle and bounded runner  | 3                                            | 16          |
| 5     | Attributed cross-replica and shutdown acceptance     | 4                                            | 14          |
| 6     | Integrated regression evidence and Task 0 handoff    | 5                                            | 4           |
| Total | Dependency-ordered migration                         |                                              | 64          |

Before coding, run governed decomposition/admission against the accepted plan. #40 is XL and must not silently execute as an atomic story. The next preparation action is governed decomposition/conversion and child hydration as required by AITM; no issue numbers are invented here. Each implementation owner gets a bound worktree, current source, pushed branch and draft PR targeting its recorded integration base. Preserve review and source provenance across the resulting issues. Do not start parallel implementation before contract freeze and ownership admission; this sequence is serial by default.

## File map

| Path                                                                                                           | Responsibility                                                           |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `packages/contracts/{package.json,tsconfig.json,src/index.ts}` and `src/{contracts,validation,history,sse}.ts` | Browser-safe compiled ESM/declarations                                   |
| `apps/orchestrator/{package.json,tsconfig.json,src/index.ts}`                                                  | Production Fastify entry point and process ownership                     |
| `apps/orchestrator/src/http/{app,auth,request,response,pump}.ts`                                               | Routes, authentication, request bridge and bounded response pumping      |
| `apps/orchestrator/src/{runtime,config,capabilities,build-info}.ts`, `providers/`, `tools/`, `turns/`          | Moved real orchestration and lifecycle with corrected imports            |
| `apps/orchestrator/src/lifecycle.ts`                                                                           | Readiness, active request registry, drain/abort/settlement               |
| `apps/web/server/start.mjs`                                                                                    | Owned production Next.js HTTP/socket lifecycle wrapper                   |
| `scripts/test-migration-containers.mjs`, `vitest.migration.config.ts`, `playwright.migration.config.ts`        | Bounded runner and explicit production-container test selections         |
| `deploy/{migration-provider,migration-test}.Dockerfile`, `deploy/compose.migration-test.yaml`                  | Separate private fixture/test driver images and networks                 |
| `tests/fixtures/migration-provider/{server,schema}.mjs`, `tests/scripts/migration-runner.test.ts`              | Fixture wire/control/ledger contract and dispatch/cleanup tests          |
| `apps/orchestrator/src/providers/scripted.ts`                                                                  | Mock-only fixture adapters sharing real production lifecycle             |
| `apps/web/server/forwarding/{config,request,capabilities}.ts`                                                  | Fixed upstream, token, bounded stream/abort and safe metadata adaptation |
| `apps/web/server/http/admission.ts`, existing web API routes                                                   | Web-only admission and delegation                                        |
| `apps/web/app/{health,ready}/route.ts`                                                                         | Operational health/readiness                                             |
| `apps/retrieval/src/{index,lifecycle}.ts`, `http/app.ts`, `build-info.ts`                                      | Lookup lifecycle and immutable catalog metadata                          |
| `deploy/{web,orchestrator,lookup}.Dockerfile`, `deploy/compose.yaml`, `.dockerignore`                          | Reproducible independent production services                             |
| `tests/helpers/{migration-topology,scripted-provider-server}.ts`                                               | Offline real-server fixtures and request scheduling                      |
| `tests/contracts/{workspace-boundaries,orchestrator-http,web-forwarding,service-lifecycle}.test.ts`            | Owning focused contracts                                                 |
| `tests/contracts/stateless-services.test.mjs`, `tests/integration/stateless-services.test.ts`                  | Required production-container entry point and replica behavior           |
| `tests/browser/stateless-interruption.spec.ts`                                                                 | Real client generation/abort regression through migrated services        |
| `scripts/{dev,clean-build,run-tests,verify-docs}.mjs`, root config/package lock                                | Three-service orchestration and test discovery                           |
| `docs/implementation/40-stateless-services.md`, `docs/evidence/40-migration-manifest.json`                     | Actual integrated handoff, state/cost/topology and verifier references   |

Existing server implementations move into core. Task 2 retains temporary single-source compatibility re-exports so web route checkpoints remain buildable; Task 3 removes them when forwarding replaces the routes. The final web graph contains contracts and web admission/forwarding only. Preserve assertions while retargeting fixtures as detailed below.

### Additional owned files for accepted XPR requirements

- Task 1: `packages/contracts/src/{json,interface-policy}.ts`, `tests/contracts/{json-turn,interface-policy,next-server-compat}.test.ts`, `tests/helpers/next-server-compat.ts`.
- Task 2: `apps/orchestrator/src/http/{pipeline,interface-policy}.ts`, `tests/contracts/provider-sdk-migration.test.ts`, `tests/fixtures/provider-protocol-stubs/server.mjs`.
- Task 3: `tests/contracts/next-server-lifecycle.test.ts`, plus the already mapped production `apps/web/server/start.mjs`.
- Tasks 4–5: `deploy/migration-router.Dockerfile`, `tests/fixtures/migration-router/{server,schema}.mjs`, `tests/contracts/migration-router.test.ts`, `deploy/interface-policy.json` and bounded policy/routing observations in the existing operations manifest. JSON/SDK source additions are application work only after approval, not work performed in this planning stage.

## Task 1: Extract browser-safe contracts

**Files:** Create the contract workspace plus `packages/contracts/src/{json,interface-policy}.ts`, `tests/contracts/{json-turn,interface-policy,next-server-compat}.test.ts` and `tests/helpers/next-server-compat.ts`, and a pinned minimal Next app under `tests/fixtures/next-server-compat/{package.json,app/layout.tsx,app/page.tsx,app/api/stream/route.ts}`; modify root build order, manifests/lockfile and imports. Move exactly `apps/web/shared/{contracts,validation,history,sse}.ts`; additions implement accepted representation/policy requirements.

**Interfaces:** `@aivc/contracts` re-exports existing types/functions without changing signatures: `TurnInput`, `SpeechInput`, `TurnEvent`, `Capabilities`, `parseTurn`, validators, `encodeSse`, `assertTurnSequence`, and history helpers. ESM exports point to compiled `dist/index.js`; types point to `dist/index.d.ts`.

- [ ] Step 1: Add the transitive import boundary regression before moving source. Retain frozen wire fixtures/schema cases. Move the existing transitive walker from wire-contracts.test.ts into workspace-boundaries.test.ts, re-root on the actual package export closure and remove the old empty-directory walk. Missing/empty export closure fails.

```ts
import { expect, it } from 'vitest';
import { validateTurnEvent, assertTurnSequence } from '@aivc/contracts';
import { wireEvents } from '../helpers/wire-contract-fixtures';
it('retains the frozen wire grammar after extraction', () => {
  assertTurnSequence(wireEvents);
  for (const event of wireEvents)
    expect(validateTurnEvent(event)).toEqual(event);
});
```

- [ ] Step 2: Run `npx vitest run tests/contracts/workspace-boundaries.test.ts tests/contracts/wire-contracts.test.ts`; expect the new package import to fail before extraction. Record genuine RED.
- [ ] Step 3: Move the four source files into the package; define explicit exports and compile before consumers. Import/re-export only the current public symbols; preserve multipart/history limits. Add JSON text-turn selection for `application/json` with optional `charset=utf-8`; reject other parameters/media types. Require strict UTF-8, exact turnId/history/text members, existing UUID/history/text validation and the 2 MiB whole-body cap. A pure browser-safe lexical preflight rejects duplicate object keys at every depth, decoding escaped key spellings before comparison, and depth above 16; JSON.parse remains the syntax authority. Test escaped duplicates, malformed encoding/syntax, extra keys, types, audio/base64 rejection, all limits and identical normalized multipart/JSON text input. Interface-policy code owns the closed non-secret schema and canonical encoding; Node hashing stays in service config outside browser exports. Migrate the boundary walker so it examines the new package transitively rather than an empty old directory.

```json
{
  "name": "@aivc/contracts",
  "private": true,
  "type": "module",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  }
}
```

- [ ] Step 4: Build workspace then run focused validation/history/SSE/wire, json-turn and interface-policy tests, `npm run typecheck`, and browser bundling. Run `npx vitest run tests/contracts/next-server-compat.test.ts`: its fixture uses a real pinned production Next build/prepare/getRequestHandler, streamed fixture route, disconnect, AsyncLocalStorage context and new keep-alive refusal/drain. It owns teardown and invokes no providers. If pinned compatibility or bounded observable stream demand fails, stop for design revision before downstream tasks. Assert the package closure rejects Node/server/provider/env imports; no handwritten copy remains in web.
- [ ] Step 5: Commit exact owning paths using the actual delivery issue attribution; keep its draft PR current.

## Task 2: Extract and serve the real Fastify orchestrator

**Files:** Core workspace, moved server modules, `apps/orchestrator/src/http/{pipeline,interface-policy}.ts`, `tests/contracts/{orchestrator-http,provider-sdk-migration}.test.ts` and `tests/fixtures/provider-protocol-stubs/server.mjs`. Root discovery/build config and moved tests belong to this step.

**Interfaces:** `createOrchestratorApp({runtime, lifecycle}): FastifyInstance`; `createRuntime(env, overrides?): ServerRuntime` is a new factory. Production entry obtains the moved memoized `getRuntime()` once and passes it to every app/route; actual existing adapter injection seams remain supported. `requestFromIncoming(raw, signal): Request` preserves streaming bytes/content type without eagerly consuming the body. `pumpResponse(response, rawReply, signal): Promise<void>` awaits downstream demand and actual reader cancellation. `Lifecycle` is defined in Task 4; initially its non-draining implementation supplies request registration/abort handles with the same interface.

- [ ] Step 1: Write socket-based authentication ordering tests using a request body that never finishes and a scripted provider counter. Missing/wrong token must return 401 with zero body-consumer, adapter and lease calls. Add valid multipart text/audio, JSON text/speech and capabilities tests. Open more than four simultaneous never-finishing unauthenticated uploads, then policy-mismatched uploads: permit counts must remain zero and valid authenticated requests of each kind must still be admitted. Gate two slow uploads per kind: a third must receive retryable 429 before another body read/provider call. Assert memory plateau, retained permits through reader/work settlement and unaffected admitted work. A policy mismatch returns retryable 503 before body/lease work.

```ts
it('rejects unauthenticated work before body and paid admission', async () => {
  const h = await startCoreFixture();
  try {
    const result = await h.rawRequest({
      path: '/api/turn',
      authorization: 'Bearer wrong',
      leaveUploadOpen: true,
    });
    expect(result.status).toBe(401);
    expect(h.counts()).toMatchObject({
      bodyReads: 0,
      providerCalls: 0,
      heldTurns: 0,
      heldTurnPipelines: 0,
      heldSpeechPipelines: 0,
    });
  } finally {
    await h.close();
  }
});
```

`startCoreFixture` is created here in `tests/helpers/migration-topology.ts`; it starts real Node/Fastify sockets with injected adapters. `rawRequest` resolves on response headers and closes its still-open upload in cleanup. `counts()` returns sanitized in-memory test counters, never a public production endpoint.

- [ ] Step 2: Run the focused test; RED must be missing core entry point/auth behavior, not a provider/network credential failure.
- [ ] Step 3: Move runtime/providers/tools/deadline/lease and HTTP handling into core, remove Next-specific assumptions, preserve caller-independent validation, and add ordered onRequest lifecycle registration, Host/bearer auth, policy consistency and nonqueued two-per-kind pipeline admission before Fastify body parsing. Use raw streamed routes/custom parsing for capped request handling; default JSON parsing must not precede authentication. Node Request construction uses `duplex: 'half'` where required. Convert the moved eager turn producer to a pull-driven iterator: obtain the next runTurn event only when stream demand permits. Demand-gating the socket pump alone cannot bound an eager producer queue.

```ts
export type PumpLimits = { highWaterBytes: 65536; maxChunkBytes: 16384 };
export type ActiveRequest = {
  signal: AbortSignal;
  finish(settled: Promise<void>): void;
};
export type Lifecycle = {
  ready(): boolean;
  enter(): ActiveRequest;
  shutdown(): Promise<void>;
};
```

`pipelines.acquire(kind)` returns an idempotent `{release(): void}` permit or immediately throws a sanitized retryable 429; no request body is read on refusal. `assertInterfacePolicy` validates a present consistency digest against server config and throws sanitized retryable 503 before ingestion. These helpers live in the mapped http modules, with positive/negative tests. `kind` is derived only from the fixed route, never caller identity. `finish` removes the registry entry only after settlement, while recording terminal or unknown outcome. A lease belongs to core work, not the response pump. Handle Node response close independently of request upload completion. Disable request/SDK automatic retries and redirect following. Never release from deadline `result`; retain existing release-from-`settled` semantics.

- [ ] Step 4: Add pausing-reader and deferred cancellation fixtures. Fill two slots, abort both transports, keep underlying provider cancellation unresolved, and prove a third request remains BUSY until actual settlement. Pause read demand and assert producer pulls/queued bytes stop at the declared bound; abort during drain and verify cleanup. Exercise oversize body, malformed media/history, provider rate limit, deadline before headers, deadline after accepted SSE, PCM EOF/error and once-only terminal.
- [ ] Step 5: Run `npx vitest run tests/contracts/orchestrator-http.test.ts tests/contracts/provider-sdk-migration.test.ts tests/contracts/config.test.ts tests/contracts/leases.test.ts tests/contracts/admission.test.ts tests/contracts/deepgram.test.ts tests/contracts/search-budget.test.ts tests/slow/disconnect.test.ts tests/slow/deadlines.test.ts`. Use the temporary compatibility seam defined below at this checkpoint; preserve every behavioral assertion. Task 3 retargets legacy fixtures to the real core and removes the seam. Commit focused core ownership/transport deliverable.

### Runtime and pool ownership — Task 2

Move memoized `getRuntime()`, `getLeasePools()` and their process-global defaults into core. Add one process-global default pipeline pool with two permits per kind. Every production app in the process shares those pools and the memoized runtime/config/ordinary adapter cache, including across module reloads; no request constructs a new runtime or pools. New `createRuntime(env, overrides?)` constructs a runtime using default process pools unless an explicit complete resource context is injected. Production uses `getRuntime()` to memoize its result, never hot-reloading config.

In-process fixtures may inject `ResourceContext = {leasePools: LeasePools; pipelines: PipelinePools}`, owning both pools and teardown. Sharing one context must contend at two slots; separate explicit contexts simulate separate processes and are not a production multi-pool claim. Retarget config.test.ts module-reload identity assertions to moved getRuntime/getLeasePools plus default pipelines; retain shared occupied slots after re-import. Retarget leases.test.ts and admission.test.ts to core, adding shared-two-app contention and explicitly isolated contexts. Task 2 compatibility re-exports point to those identical moved singleton modules; Task 3 removes only legacy web globals/injection, retaining core sharing tests.

Ordinary adapters remain cached. Only explicit mock-script mode calls createScriptedDeps per admitted request, with fresh parent/replica context passed as arguments, never stored on cached model/speech objects. Each STT/model-round/TTS method creates a fresh invocation ID. Immutable fixture transport/config may be shared. Interleave two parents/multiple rounds in tests to detect ID/abort leakage. Real lookup remains its cached independent HTTP client.

## Task 3: Delegate web requests without provider ownership

**Files:** Web forwarding modules, `apps/web/server/start.mjs`, three API routes, config/capabilities adapter, dependencies and `tests/contracts/{web-forwarding,next-server-lifecycle}.test.ts`. Task 3 owns the production wrapper extending Task 1's compatibility fixture; Task 4 packages and repeats it in containers.

**Interfaces:** `forwardRequest(req: Request, path: '/api/turn' | '/api/speech', config: ForwardingConfig): Promise<Response>`; `ForwardingConfig` holds fixed `coreOrigin`, private `coreToken`, allowed web Host/Origin sets, a validated shared interface-policy manifest and digest deriving turn/speech timeout and transport-grace milliseconds. `forwardCapabilities(req, config, webBuild): Promise<Response>` preserves validated capability shape while replacing only web build metadata. `forwardRequest` never parses or regenerates multipart/SSE/PCM.

- [ ] Step 1: Write direct-versus-delegated fixture comparison using one scripted request per independent fixture. Compare validated event sequence/usage and exact PCM bytes/headers, normalizing only explicitly path-specific build metadata. Include response-socket disconnect after complete upload and cancellation while a write awaits demand.

```ts
it('overwrites browser authorization and never forwards identity headers', async () => {
  const h = await startWebFixture();
  try {
    await h.turn({
      authorization: 'Bearer browser-input',
      forwardedHost: 'spoof.invalid',
    });
    expect(h.coreHeaders().authorization).toBe('Bearer fixture-core-token');
    expect(h.coreHeaders()['x-forwarded-host']).toBeUndefined();
    expect(h.providerCallsInWeb()).toBe(0);
  } finally {
    await h.close();
  }
});
```

`startWebFixture` extends the real topology helper with a production-compatible web handler and a capture core; browser/web admission is configured explicitly. The known fixture token is test-only and never reads real secrets.

- [ ] Step 2: Run `npx vitest run tests/contracts/web-forwarding.test.ts`; expect RED because routes still own provider execution.
- [ ] Step 3: Implement the owned Node/Next listener proven in Task 1, then replace routes with Host/Origin admission plus fixed forwarding. Sanitize request/response headers, preserve status/content types/audio fields, retain no-cache semantics, disable redirects/retries, bound full-stream deadline and combine abort sources. Overwrite X-AIVC-Interface-Digest from server config and strip private digest response headers from browser output. Add core-unreachable 502, no-eligible/draining/policy-mismatch 503, deadline 504 and after-header incomplete behavior. Derive deadlines from paired policy; web remains locally ready during dependency outages. Remove executable orchestration imports and provider SDK dependencies from web.
- [ ] Step 4: Test bad Host/Origin, forged auth/forwarded/policy headers, slow upload, delayed SSE/audio, downstream abort and upstream failure without duplicate terminal or appended PCM. During a still-open multi-chunk upload, force each early 401/429/policy-503 core refusal and require browser status/envelope/retryability parity, not accidental 502. Prove upload reader/cancellation cleanup with pinned Node half-duplex semantics. Mismatched timeout/segment policy refuses API work before providers but preserves static UI/local readiness. Distinguish core Node write/drain from web pull-driven Web Streams and measured framework/socket buffers. Build web and inspect runtime dependency closure for provider/core imports and secret leakage.
- [ ] Step 5: Run focused web tests, existing typed/audio integration and UI/client tests. Commit thin-BFF deliverable with docs/config example updates; examples contain no real token/key.

## Task 4: Package independent production services and implement drain

**Files:** Three Dockerfiles/Compose, orchestrator/lookup lifecycle and entrypoints, web operational routes, launcher/build/cleanup scripts, lifecycle tests and `.dockerignore`.

**Interfaces:** Use Task 2's `Lifecycle`; production implementation registers live request controllers before processing, withdraws readiness synchronously on shutdown and awaits work settlement. Service operations manifest includes `service`, source SHA, image digest, contract digest, catalog digest where applicable, readiness/config version and actual resource/mount configuration. Exclude secrets and raw env values.

- [ ] Step 1: Test lifecycle with fake clock and deferred provider promises: ready → SIGTERM → 503 new/keepalive work → grace expiry → abort → actual settlement or unknown hard exit. Ensure operations checks never invoke providers.

```ts
it('never reports unsettled provider cancellation as drained', async () => {
  const h = createLifecycleFixture({ drainMs: 15000, settleMs: 5000 });
  h.beginDeferredRequest();
  const stopped = h.shutdown();
  expect(h.ready()).toBe(false);
  await h.advance(20000);
  await stopped;
  expect(h.outcomes()).toEqual(['settlement-unknown']);
  expect(h.replays()).toBe(0);
});
```

`createLifecycleFixture` supplies fake timers and injected deferred work; the socket/production-container tests later independently validate real signal handling and elapsed bounds.

- [ ] Step 2: Run `npx vitest run tests/contracts/service-lifecycle.test.ts`; expect RED before lifecycle implementation.
- [ ] Step 3: Implement registry/readiness/drain using request-scoped controllers and settle promises. Avoid `server.close()` indefinitely waiting before abort triggers. Reject new work on keepalive after withdrawal. Hard exit bounds cleanup and labels unresolved work unknown. Web uses Task 3's explicit Node/Next listener, compatibility-proven in Task 1; no next start or health-flag-only alternative is allowed. Mark draining and intercept new/keep-alive requests synchronously before any awaited close; join real framework/socket and forwarding cleanup.
- [ ] Step 4: Add independent multistage production builds, nonroot/read-only roots, baked contracts/assets/catalog, explicit bounded ephemeral mounts where necessary, private network, limits and stop grace. Build images with existing lockfile/toolchain pins; pin base image digests in delivered manifest. Token/key supplied only at runtime, never image build args.
- [ ] Step 5: Extend `scripts/dev.mjs` and clean-build to own all three processes and ports with deterministic shutdown. Test missing core build, startup failure, cleanup after second/third child failure and exit-code preservation. Run lifecycle/launcher/cleanup tests and three production builds; commit deployable topology.

## Task 5: Prove cross-replica state and transport behavior

**Files:** `tests/contracts/stateless-services.test.mjs`, `tests/integration/stateless-services.test.ts`, `tests/browser/stateless-interruption.spec.ts`, topology/provider helpers. Any discovered app correction belongs to its owning implementation package and gets re-reviewed.

**Interfaces:** `attachMigrationTopology(manifest)` attaches the in-container driver to the existing host-owned topology. It provides direct/web clients, fixture controls, manifest reads and the bounded acknowledged lifecycle methods defined below; it never starts or owns Compose. Driver actions have explicit targets and verified host acknowledgements.

- [ ] Step 1: Add the required Node test entry point. It performs explicit Docker/Compose/image preflight, runs the container integration/browser acceptance selection, and fails nonzero if unavailable. It must not return success for a skipped test.

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { cleanupOwnedMigrationRun } from '../../scripts/test-migration-containers.mjs';
test('production stateless service acceptance', { timeout: 1860000 }, () => {
  const probe = spawnSync('docker', ['info'], {
    timeout: 10000,
    encoding: 'utf8',
  });
  assert.equal(probe.status, 0, 'Docker is required');
  const runId = randomUUID();
  const run = spawnSync(
    process.execPath,
    ['scripts/test-migration-containers.mjs'],
    {
      stdio: 'inherit',
      timeout: 1800000,
      killSignal: 'SIGKILL',
      env: { ...process.env, AIVC_MIGRATION_RUN_ID: runId },
    },
  );
  if (run.error || run.signal || run.status === null) {
    const cleanup = cleanupOwnedMigrationRun(runId, { timeoutMs: 30000 });
    assert.equal(cleanup.status, 0, 'Owned fallback teardown must complete');
  }
  assert.ifError(run.error);
  assert.equal(run.signal, null);
  assert.equal(run.status, 0, 'Acceptance must execute and pass');
});
```

Define `test:migration:containers` as the same direct Node runner for operator use; wrapper uses process.execPath so npm/shell dispatch cannot outlive timeout. Runner CLI has an import-main guard: importing cleanupOwnedMigrationRun never starts a stack. This exported helper validates UUID, saved manifest, exact project/run labels and owned container IDs, then performs fixed Compose teardown argv under the 30-second bound. Missing ownership proof refuses. Persist manifest before resources are created. No recursive entry point. Cross-platform subprocess behavior must match the repository's existing runner conventions.

- [ ] Step 2: Run the new acceptance entry point; expect RED for absent implementation, or explicit unavailable tooling. Never treat tool absence as a product defect fix or success.
- [ ] Step 3: Repeat the forced sequence for multipart text/WAV and JSON text controls. Schedule a turn on A, a speech segment on B, then a next turn with retained history on B; cold-replace A and repeat. Use the deterministic per-request L7 router below for delegated legs and private replica addresses for direct controls. Correlate actual upstream-address observations with independent provider/lease journals. Same-replica and absent/ambiguous-attribution negative controls must fail; no public routing field is added. Compare provider-observed histories and speech inputs with expected payloads. Read-only filesystems and no session volumes remain enforced.
- [ ] Step 4: Through the real browser controller/queue, interrupt A turn/B speech, delay old events and cancellation settlement, then begin next generation on another replica. Assert stale output cannot play/enter history and old work settles without replay. Verify duplicate submitted IDs are independent requests, not claimed deduplicated; clients/proxy never retry on lost response. Probe nonexistent cancellation-by-ID endpoint and require 404/zero work.
- [ ] Step 5: Scale 1→2 orchestrators and verify web/lookup count/image/limits unchanged; mismatch catalog/config/contract/interface-policy digest must fail topology eligibility; timeout/segment-policy mismatch also refuses delegated work before body/provider calls. Run graceful SIGTERM and hard SIGKILL while streaming; measure readiness/new work, stream outcome and provider count. Core failure does not cause replay. Add web and lookup termination/outage cases with bounded failure/cleanup.
- [ ] Step 6: Execute required entry point, focused existing interruption/disconnect/rapid-interruption regressions and browser suite. Commit acceptance suite plus actual sanitized evidence; failed/incomplete results remain visible.

## Task 6: Integrate, verify and hand off the accepted application

**Files:** Migration implementation guide and evidence manifest; final test/build/doc runner updates; issue/PR references via sanctioned commands.

**Interfaces:** Research Task 0 receives an accepted integrated SHA/PR, source-to-image mapping, both turn representations, exact contract/catalog/config/interface-policy digests, independent replicas/resources/mounts, state/coordination declaration, per-instance/aggregate lease meaning, local ingress cost, actual verifier outputs and limitations. No benchmark/capacity or paid calibration result is implied.

- [ ] Step 1: Freeze integrated source, confirm clean tree and expected dependency graph, build images and write immutable source/image/fixture identity manifest. Source changes invalidate affected receipts; do not label stale reports as current.
- [ ] Step 2: Run `npm run typecheck`, `npm run build`, `npm test`, `npm run test:contracts`, `npm run test:integration`, `npm run test:voice`, `npm run test:slow`, `npm run test:browser`, `npm run lint`, `npm run format:check`, `npm run verify:docs`, `npm run verify:sealed-evidence` and `node --test tests/contracts/stateless-services.test.mjs` at the accepted integrated revision. Use stage-owned canonical verifiers; document commands requiring container/browser infrastructure and fail/stop when prerequisites are unavailable. No paid `verify:live` run is authorized.
- [ ] Step 3: Check each issue AC/DoD separately with actual declared verifier evidence; preserve Test/Review and final approval gates. Get independent whole-change code review on the exact integrated SHA; do not reuse planning consensus as code review.
- [ ] Step 4: Keep every delivery branch fetchable/draft PR current and integrate only with owner-authorized exact-head sanctioned merge. Verify accepted source reachable from recorded target before Done. Record actual merge dates/provenance, no invented provider-action receipt.
- [ ] Step 5: Publish the Task 0 handoff with declared JSON media type, coordinated policy/key change limitation, measured slow-upload lockout under the fixed two-per-kind pipeline cap, explicit no-store semantics, per-stream abort, no global dedup/failover claim, shutdown unknown outcomes, catalog version, independent topology and ingress footprint. Unblock research only through normal dependency authority after #40 delivery is accepted, not while this plan is merely reviewed.

## Spec coverage and self-review

| Design requirement                                               | Owning plan tasks                     |
| ---------------------------------------------------------------- | ------------------------------------- |
| Governing source and actual baseline                             | Header, Task 6                        |
| Neutral contracts / portable provider ownership                  | Tasks 1–2                             |
| Auth, web protection, safe forwarding                            | Tasks 2–3                             |
| Bounded backpressure, abort/deadline/settlement                  | Tasks 2–3, repeated Task 5            |
| Request-carried state, generation, no-store limitations          | Task 5, Task 6 handoff                |
| Independent production services, resources/catalog/readiness     | Task 4, Task 5                        |
| Graceful/hard termination without replay                         | Tasks 4–5                             |
| Complete offline proof and accepted integrated downstream source | Tasks 5–6                             |
| Decomposition and no implementation before approval              | Delivery graph and global constraints |

Self-review checks: every interface above is assigned an owning task; snippets are design-level contracts/tests, not implemented application APIs. Existing application tests remain behavioral authority. All five Review Focus cases have owning tests. No test or deployment result is claimed by this plan. Review may revise the design and plan together; accepted artifact pins must follow the actual final bytes.

## Specification SAR and concrete planning decisions

Historical spec `07a92dd97ca7d8819e235ebe97b17f08608d8671`, SHA-256 `fecb93bdc40e6f2636f04bb243d7f5cbf74cbb8041f8c16891f38db4c643d1d4`, received [native SAR acceptance](../../peer-reviews/spec/stateless-service-migration-design-review-40-native/sar/astra-sar-report-round-1.md). This historical pin is preserved. The current separately XPR-accepted spec has the header's f5059000 digest/publication e6e96c9 and [round 2 acceptance](../../peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-reviewer-response-2.md), with adjacent manifest. The earlier uncertain attempt remains preserved and unsettled. No review grants application implementation approval.

The following decisions preserve the three historical optional SAR planning suggestions, reconciled with the accepted spec's later XPR requirements. They are part of this plan's review input and govern their owning tasks above.

### Service networking — Tasks 2–4

- Production binds inside private containers: web `0.0.0.0:3000`, orchestrator `0.0.0.0:3002`, lookup `0.0.0.0:3001`. Local launcher can retain loopback. Compose exposes only web; direct-core tests run inside the private test network.
- Web `ORCHESTRATOR_BASE_URL` is one fixed private origin; `CORE_CALLER_TOKEN`, `BFF_ALLOWED_HOSTS`, `BFF_ALLOWED_ORIGINS`, forwarding turn/speech timeouts and bounded transport grace are server-owned config. Core has separate `CORE_ALLOWED_HOSTS` and the configured caller token. Incoming headers cannot override any value.
- The current lookup client rejects all non-loopback origins. Task 2 replaces that restriction with an exact configured `RETRIEVAL_BASE_URL` origin policy and fixed `/v1/projects` path. Reject userinfo, fragments, query/base paths, wildcard origins, user-supplied URLs and redirects. Select the declared private lookup service origin explicitly; retain strict query/schema validation.
- Task 2 owns negative origin/redirect tests and real two-server HTTP connectivity. Task 4 owns production binds and inter-container connectivity after packaging exists. Relocation without these changes does not pass.

### Contract digest migration — Task 1

Modify `scripts/contract-digest.mjs`, its declaration, `tests/contracts/contract-digest.test.ts` and build-info consumers with the moved contracts. The digest currently frames closed path-labelled inputs under `apps/web/shared`; moving those paths changes the digest even with identical behavior. Record the new framed digest; retain frozen wire fixtures as semantic parity proof. Preserve historical sealed artifacts and hashes rather than rewriting them to the new layout. Extend Task 1's transitive boundary tests to all new package exports and include the owning digest test in its focused verification.

### Interface policy, credentials and readiness — Tasks 1–4

Task 1 defines a closed InterfacePolicy schema with finite positive safe-integer turn/speech/grace deadlines, whole-body limits 2097152/8192, text limit 2000, history limits 8/16000, configured segmentChars and the frozen contract version. Canonical encoding has fixed field order and explicit values; reject missing/unknown members, invalid numbers and inconsistent segment cap. Service config uses Node SHA-256 over those canonical UTF-8 bytes. `deploy/interface-policy.json` is the shared non-secret deployment input; all eligible web/core images or runtime config refer to its exact digest. It is not a shared mutable store or a secret-bearing env snapshot.

Core validates any present X-AIVC-Interface-Digest after auth and before body/pipeline/paid work, refusing a mismatch with sanitized retryable 503. Web always overwrites it from its own validated manifest. Direct authenticated clients may supply it for consistency but it grants no identity or privileges. Core exposes actual policy digest on its private capabilities header; web strips that header before browser output. Test missing/forged browser headers, exact match, deliberate timeout/segment mismatch, invalid policy and mixed eligible replicas. Topology eligibility independently checks all digests, not only one probe through the router.

Policy updates and the single bearer credential require coordinated changes; mismatched deployment windows can refuse delegated calls. Record that availability limitation rather than promise zero-downtime independent policy/key rotation. Task 4 tests missing core, lookup outage and all-core drain leave web local readiness/static UI intact while API calls produce the declared failures.

Core caller token and valid service Host/origin/config values are mandatory in every mode. Mock readiness succeeds with paid-provider keys absent. In live mode retain existing unavailable capability states for optional missing provider configuration; readiness/capability reads make no paid call, and unavailable-function requests retain sanitized failures.

Readiness/liveness are strictly local per accepted spec section 8. Optional dependency diagnostics cache for five seconds, time out after one second, coalesce checks, have no retries/paid probes and never gate readiness/liveness or trigger restarts. Lookup failure affects its bounded tool call only. Core outage/drain gives API 502/503 while static UI stays locally ready. Task 4 tests this graph, missing caller token, mock readiness without paid keys and unavailable live capability states. Drain always withdraws local readiness.

### Concrete web lifecycle mechanism — Task 3, packaged in Task 4

Task 3 creates `apps/web/server/start.mjs`, updates the web start script and adds its socket lifecycle tests. Task 1's fixture proves the pinned mechanism first; Task 4 packages the delivered wrapper and repeats its signal/keep-alive tests in containers. Use an owned Node HTTP server around pinned Next.js `next({dev:false})` and `getRequestHandler()`. Its request/socket registry and signal handling withdraw readiness and gate new/keepalive work before invoking the framework handler; close/abort at the declared bounds. Merely toggling a health route cannot prove upstream drain.

The local pinned guide `node_modules/next/dist/docs/01-app/02-guides/custom-server.md` supports this API and states that custom servers and standalone output cannot be combined. Package required production dependencies and `.next` output, not unsupported standalone tracing. Production tests validate background/framework close and active forwarding streams. This selects the wrapper option previously described in Task 4; no unresolved alternative remains.

Task 2's Node request bridge must distinguish normal upload completion from an actual disconnected response: a normal IncomingMessage close after a fully uploaded request cannot abort valid work. Socket tests exercise both conditions independently.

## Route settlement interface — revised Task 2 contract

The following operation contract replaces Task 2's response-only moved-handler boundary. A response or completed socket pump is never a substitute for operation settlement.

```ts
export type OperationHandle = {
  response: Promise<Response>;
  settled: Promise<void>;
  abort(reason: unknown): void;
};
export function beginTurn(
  req: Request,
  runtime: ServerRuntime,
  signal: AbortSignal,
): OperationHandle;
export function beginSpeech(
  req: Request,
  runtime: ServerRuntime,
  signal: AbortSignal,
): OperationHandle;
```

Create the handle synchronously before asynchronous body ingestion, after the request's pipeline permit has been acquired. The one-per-request permit is carried from the onRequest context into the route; raw route code never acquires it twice. Its `response` resolves to headers/body readiness or rejects with the pre-header error; its `settled` resolves only when body work, producer, pending reads and provider/reader cancellation actually settle. Validation or unavailable-provider failures resolve `settled` after their own cleanup; missing adapter work is not an unresolved promise. Provider failures retain response/error semantics while `settled` observes every rejection. `abort` is idempotent and signals all admitted work. Existing deadline `task.settled` must feed this handle directly, rather than being hidden behind `Promise<Response>`.

The route registers an `ActiveRequest` before auth/body work, and passes its signal into the handle. Core onRequest bearer/Host, policy or pipeline rejection never reads the body or acquires a paid lease; that rejected request finishes its registry entry with a resolved cleanup promise. Authentication is not deferred into a body parser. A factory throw before the handle exists also finishes the entry after local cleanup. For accepted work, the response pump has its own settled promise including reader cancellation. Route ownership is:

```ts
const active = lifecycle.enter(); // rejects new application work during drain
let operation: OperationHandle | undefined;
let pumpSettled: Promise<void> = Promise.resolve();
let cleanEnd = false;
let pipelinePermit: { release(): void } | undefined;
try {
  assertCoreCaller(rawRequest, config); // before parser/body/lease
  assertInterfacePolicy(rawRequest, config);
  pipelinePermit = pipelines.acquire(kind); // immediate 429, no body or queue
  operation = beginTurn(
    requestFromIncoming(rawRequest, active.signal),
    runtime,
    active.signal,
  );
  const response = await operation.response;
  pumpSettled = pumpResponse(response, rawReply, active.signal);
  await pumpSettled;
  cleanEnd = true;
} catch (error) {
  sendPreHeaderErrorOrClose(rawReply, error); // never a second terminal
} finally {
  if (!cleanEnd) operation?.abort(new Error('transport ended'));
  const settled = Promise.allSettled([
    operation?.settled ?? Promise.resolve(),
    pumpSettled,
  ]).then(() => undefined);
  active.finish(settled.finally(() => pipelinePermit?.release())); // once, after settlement
}
```

`enter` installs the entry before returning its controller. `finish` is idempotent and retains the entry during its supplied promise; shutdown enumerates entries even if `finish` has not yet been called because headers are pending. `sendPreHeaderErrorOrClose` can emit a sanitized JSON error only before headers; otherwise it closes incomplete. In actual code, capture a reader-cancel promise even when a pump fails during initialization, and join it to `pumpSettled`. Core paid-lease release stays directly tied to the operation's real work settlement, not lifecycle bookkeeping or the pump. Shutdown may report unknown at the hard bound while leaving the unresolved entry until process exit; it must not claim drained.

Web has no paid lease. Its custom HTTP wrapper registers requests before Next dispatch. `forwardRequest` exposes an internal `ForwardingHandle` with the same `response`, `settled` and idempotent `abort` fields; `settled` covers its upload, upstream response reader, and reader/socket cancellation cleanup. The forwarding function binds that handle to the wrapper's request context before returning a Response. Use an AsyncLocalStorage-owned request context passed through the custom server to route delegation; no browser header selects registry identity. The wrapper joins framework response transport cleanup and forwarding settlement before removing its entry. It does not claim knowledge of provider settlement from a closed HTTP socket; the owning core retains that separate responsibility. Requests with no forwarding handle settle from framework/socket cleanup only. Core/web close listeners ignore normal upload completion and abort on real downstream loss.

Task 2 adds a **real route + lifecycle** test, not only the fake lifecycle unit: occupy both turn slots, time out/close both responses, defer actual adapter cancellation, and observe both leases and both lifecycle entries still occupied. Start shutdown; assert not drained. Resolve the gates and require registry/lease removal exactly once; repeat with gates never resolved through the hard bound and require settlement-unknown. Exercise auth failure, validation failure and factory failure before response readiness and require zero leaked entries/provider calls. Task 3 repeats the route/registry oracle through the real web wrapper and upstream cancellation cleanup. These are necessary RED/GREEN tests for the new operation interface.

## Production acceptance harness — revised Tasks 2, 4 and 5

### Scripted provider selection and observations

Create `apps/orchestrator/src/providers/scripted.ts` in Task 2, with an optional mock-only adapter selection in the real `createRuntime` factory. Production image/entrypoint remains the same as the delivered application; provider injection does not replace routes, validation, orchestration, deadlines, leases, streaming or lifecycle. With `AIVC_MODE=mock` and an explicitly configured `AIVC_MOCK_SCRIPT_ORIGIN` plus `AIVC_MOCK_SCRIPT_TOKEN`, adapters use the isolated fixture service. Without that origin, preserve the existing deterministic in-process mock. If script configuration is present in live mode, refuse startup; do not silently enable it. Accept only one fixed private origin and fixed fixture paths, no redirects or caller-selected URL. Do not add test-control application routes, query flags or browser-visible tokens.

Create `tests/fixtures/migration-provider/{server.mjs,schema.mjs}` and `deploy/migration-provider.Dockerfile` in Task 4. This is a small offline contract fixture, not the later research performance simulator. It owns an append-only, monotonically sequenced observation ledger for the lifetime of the test run, outside the core containers. The ledger survives core SIGKILL/replacement; fixture death invalidates the run. No application session/history dependency is introduced: it represents the external mock provider and is used only in the offline topology. Record its image/resource limits and test provenance separately from the three application services.

Runtime creates a fresh internal operation UUID for each turn/speech dispatch, distinct from caller IDs; duplicate submitted IDs do not collapse ledger entries. Each adapter request carries internal operation UUID, replica-instance marker, caller turn/segment IDs, provider kind and exact fixture inputs. The fixture records ordered entries with operation UUID, provider kind, event kind (`started`, `input`, `chunk`, `cancel-requested`, `settled`, `connection-lost`), timestamp from its own clock and sanitized test input. Compare timestamps only within that fixture clock. Input contains fixture prompts/history/text needed by assertions, never real user content or secrets; evidence exports only fixture IDs and digests where full payloads are unnecessary.

Model fixtures supply the existing `ModelEvent` structure, including tool rounds and usage, rather than public application SSE. STT returns transcript; TTS returns bounded raw PCM. The actual orchestrator still constructs the public SSE, invokes lookup tools and enforces all lifecycle/validation. Controls select per-operation/fixture scripts: delay before first result, gate after a chunk, produce a larger-than-16-KiB chunk, hold final settlement, provider failure, and deferred cancellation acknowledgement. Controls are bounded by the run deadline and always released/terminated during teardown.

The fixture has separate runner-only control endpoints to load scripts, release gates and read the ledger; these are not reachable through web/core application routes. Use distinct fixture auth credentials for adapter traffic and runner control, on a private control network without host bindings; credential values are generated per run, never logged or baked into images. Core can invoke only data/cancellation endpoints, not mutate scripts or clear observations. All fixture/control inputs have schema/body caps. Compose internal networks deny external provider egress; no paid credentials enter any service. No control endpoint can proxy an external URL.

Adapter abort has two obligations: stop its current data reader and send an authenticated fixture cancellation request whose acknowledgement may be deliberately gated. The adapter's promise/iterator finalization waits for pending reader cleanup **and that acknowledgement**, so local operation settlement can remain delayed even after the original HTTP fetch rejects on abort. A fixture EOF alone cannot satisfy the cancellation gate. The fixture ledger records cancellation independently. If core dies first, record started-but-unsettled/connection-lost from the surviving fixture; do not invent cancellation acknowledgement or zero provider cost. Surviving cores never receive a replay request. Task 5 reads the ledger from the runner after hard kill to prove provider-call counts and no replay. This mock boundary tests actual app settlement plumbing, without claiming that a real provider settles identically.

### Early-refusal transport contract — Tasks 2–5

For pre-body 401, policy-503, capacity-429 and drain-503, pause application upload consumption, send the bounded existing JSON envelope with Connection: close, and end the response. End the writable socket after response flush and force-destroy it within 1000 ms of refusal, regardless of upload EOF. Never application-drain an endless rejected body. Fixed HTTP/kernel receive buffers may already contain bytes; no body parser/provider/permit may consume them. Measure those separately. A deliberately stalled response reader can receive incomplete transport at the bound, never a fabricated complete envelope.

Core socket tests continuously offer upload bytes and assert healthy-reader status/envelope/retryability, zero body-parser/provider/new-permit activity, bounded close and memory plateau for all refusals. Test keep-alive and new connections while admitted work continues.

Use the owned Node HTTP/HTTPS client for BFF duplex forwarding so its response event can be handled before upload completion; do not depend on half-duplex fetch returning first. Stop pulling browser body on an early response, relay the error immediately, and defer destructive browser-upload cancellation until browser-facing response flush. Stop upstream upload without destroying its incoming response prematurely. The wrapper owns close and joins cleanup within the same 1000 ms policy. Pinned Next tests must prove that reader cancellation does not destroy the error response before flush. No retries or unbounded discarded-body drain.

The private L7 router uses the same duplex early-response/close rule. TLS ingress disables buffering/retries and uses bounded lingering close (lingering_time 1s, lingering_timeout 1s), with actual pinned-behavior tests. Task 5 repeats ongoing-upload refusals through direct core, router, BFF and HTTPS ingress. Healthy response readers must receive unchanged status/envelope/retryability, including 429/503 rather than accidental 502; stalled readers require explicit incomplete transport within the bound.

### Actual moved SDK paths — Task 2, repeated in Task 5

The scripted fixture proves application orchestration/settlement, but does not replace real adapter coverage. Add local protocol stubs for each moved real STT/model/TTS adapter in `tests/fixtures/provider-protocol-stubs/server.mjs` and tests in `tests/contracts/provider-sdk-migration.test.ts`. Instantiate actual ClaudeAdapter with its existing ClaudeOptions.fetch seam and createDeepgramAdapter(config, fetchImpl), retaining the pinned SDKs and valueless fixture keys. The test-owned fetch transport checks the expected fixed SDK host/path, maps only that destination to the local HTTP stub, preserves the AbortSignal/body/response streaming contract, and refuses every unrecognized destination. This is constructor injection already present in source, not a browser/request-selected endpoint or new production configuration. Production defaults and authentication remain unchanged. Network policy denies external egress throughout.

For each real adapter require: a normal result/stream with existing usage/format; abort before first result; abort after a chunk; delayed reader EOF/rejection; and reader/cancellation cleanup before actual settlement/lease release. Exercise local HTTP/WebSocket protocol as used by that adapter, not a replacement application SSE fixture. Record no provider capability or paid success from this test. Reuse the compiled actual modules in an isolated in-container SDK test selection in Task 5 and include the SDK case counts/outcomes in the existing Vitest selection's run manifest (no third subprocess selection). Missing stub compatibility is a failed required test, not permission for live credentials. Task 2 runs the focused SDK test alongside the existing deepgram/lease/deadline regressions; Task 5 repeats the declared cases with compiled actual adapter/SDK modules in the isolated test driver; the separate scripted real-application tests prove HTTP/process/lifecycle composition. Do not represent an in-driver adapter test as a live-provider or full application-path result.

### Replica binding and lease observations — Tasks 2, 4–5

Host generates a fresh non-secret UUID per new core container, supplied as AIVC_INSTANCE_ID and a run-owned label. Core validates it once and emits it in boot/mock-script invocation metadata; production without supplied ID generates one once per process. It grants no auth/routing privilege or session state. Replacement uses a fresh ID.

Before tests and after acknowledged replace/scale, host inspect verifies run/source/image labels, exact container ID, instance UUID and actual private address against the core boot event. Manifest records a bijection of instance UUID, container ID and address. Missing, duplicate or mismatched bindings fail before dispatch. Router enums resolve through that verified manifest; fixture instance markers must match it independently. Never export raw environment/inspect data or secrets.

In explicit mock-script mode, production core modules emit sanitized structured stdout events for boot, pipeline acquire/release and paid-lease acquire/release: instance UUID, monotonic per-process sequence, parent operation ID when admitted, kind and held count. Release events follow actual settlement only. No prompt/history/audio/token/header values or test-control endpoint. Host captures per-container logs with 1 MiB/10000-event per-instance caps and bounded Docker log storage; overflow/loss/sequence gaps invalidate the run. Collect before container removal. Never compare cross-process monotonic times.

Task 2 tests real route events while cancellation remains gated. Task 5 joins host-tagged events, fixture parent/invocation IDs and router records, also asserting BUSY until settlement. SIGKILL leaves acquired-but-unreleased work unknown; surviving fixture observations and zero replay remain required. Corrupt binding/log negative controls fail; absent observations never imply release.

### Deterministic replica routing and attribution — Tasks 4–5

Create a small private L7 router in the mapped router files; it is separate test infrastructure, with its own pinned image, limits and non-secret observation ledger. Web's sole upstream is its fixed private origin. The data listener forwards exact application bytes and safe headers with bounded producer demand, and sets upstream Host from the run-owned target manifest. It does not expose a public application routing token, buffer a whole body, follow redirects, retry or substitute another target. Direct controls use explicit private core-a/core-b addresses and their allowed Host values.

Only `POST /api/turn` and `POST /api/speech` consume the ordered per-test script; entries contain a closed method/path pair and target enum core-a/core-b, never a URL. Every matching request consumes one entry exactly once; wrong method/path order or exhausted script invalidates the scenario. Direct authenticated readiness probes (at most once per second, 500 ms timeout, no retries) and acknowledged host membership updates track eligible targets without consuming scripts. Known draining/ineligible/removed target returns sanitized retryable 503 without substitution, marking contradictory scripts invalid; a stale probe followed by core drain-503 relays 503 unchanged. No eligible core means 503. A still-declared eligible target with unexpected connection refusal/network loss returns sanitized 502, never alternate dispatch. Acknowledged removal means ineligible/503; an unexpected crash with stale membership means network failure/502 until refreshed. Apply to fixed capabilities target too. These probes affect router eligibility only, never application readiness/liveness. Health/readiness probes use direct replica addresses and do not consume entries. `GET /api/capabilities` has an explicitly configured fixed eligible target and no script consumption, so page bootstrap cannot shift the A/B/B sequence. Driver gates the real browser dispatch order using provider milestones rather than timing sleeps. Downstream/upstream keep-alive cannot influence selection, which occurs for every HTTP request, not every connection.

A separate private control listener is accessible only to the driver/control network, authenticated with the run-owned control credential, with 8 KiB closed request caps. Load at most 64 script entries per scenario, reset only between scenarios after requests settle, and bind target enums to exact current container IDs/private addresses from the host manifest. On replacement/scale, require the verified host acknowledgement before updating membership; stale IDs refuse. The control record accepts no shell, code, arbitrary URL, image or service override. Production app containers never possess this control credential or interface.

For every routed request record monotonic router sequence, method/path, actual selected upstream/container ID and sanitized outcome in a bounded 256-entry/1 MiB per-scenario ledger; overflow fails, never truncates. Correlate it with the independent fixture parent/invocation ledger and per-core lease observations. Assert script fully consumed and forced-distinct legs actually reached distinct replicas. Negative controls intentionally route both legs to A or omit an attribution record; each must make the acceptance oracle fail. A negative control is successful only when the oracle detects the planted defect; it cannot replace the positive A/B/B run.

Task 4's router tests use two real local HTTP targets and a keep-alive client: prove per-request selection, unaffected capabilities/probes, exact ordering, no failed-target retry, pressure/abort cleanup and closed control schema. Task 5 performs attributed delegated A/B/B and direct controls in production containers, with fixture gates determining browser ordering. Router/fixture/ingress costs and buffers are recorded separately. None is application history/affinity storage.

### Exact runner and browser configuration

Add the following owning files to Task 4's file map: `scripts/test-migration-containers.mjs`, `tests/scripts/migration-runner.test.ts`, `vitest.migration.config.ts`, `playwright.migration.config.ts`, the fixture files/Dockerfile above, `deploy/compose.migration-test.yaml`, and `apps/web/server/start.mjs`. Task 5 supplies the acceptance cases/config includes; Task 4 supplies independently tested runner startup/cleanup and production service packaging.

The command graph is fixed and nonrecursive:

```text
node --test tests/contracts/stateless-services.test.mjs
  -> npm run test:migration:containers
     -> node scripts/test-migration-containers.mjs
        -> build/verify production images; start private Compose topology
        -> npx vitest run --config vitest.migration.config.ts
        -> npx playwright test --config playwright.migration.config.ts
        -> collect sanitized ledger/manifests; docker compose down
```

Root script `test:migration:containers` is exactly `node scripts/test-migration-containers.mjs`. Vitest's migration config includes exactly `tests/integration/stateless-services.test.ts` and `tests/contracts/provider-sdk-migration.test.ts`, runs serially against the runner's ready topology, and excludes the Node wrapper. Playwright's migration config includes only `tests/browser/stateless-interruption.spec.ts`, uses `baseURL` from validated `AIVC_MIGRATION_WEB_URL`, sets one worker, `retries: 0`, `forbidOnly: true`, and defines **no `webServer`**. It refuses an absent URL/topology manifest; it cannot import the legacy system-server launcher. The runner passes only bounded fixture/control connection information, never paid credentials. No suite uses an implicit localhost/development fallback.

The runner owns a unique Compose project name, all images/services/networks/volumes and teardown on success, failure, signals and timeout. Keep the three application services at production mode, with independent configured replicas; the fixture/router are declared test infrastructure. Application images are built from the clean pinned source revision or accepted only when source SHA, build manifest, contract/catalog digests and content labels match that exact revision. A local tag or cached image without this proof refuses. Record the built image content digests before tests. Core death never deletes the fixture ledger before assertions/artifact capture.

Bound the runner to 1800 seconds: builds 600, initial readiness 90, Vitest 780, Playwright 240 and teardown 30 seconds, leaving 60 seconds global reserve. Every phase also obeys remaining global time; budgets never renew. Wrapper test timeout is 1860 seconds, subprocess timeout 1800 and verified run-owned fallback teardown at most 30 seconds. Individual cases are at most 60 seconds. Missing Docker/Compose/source-image identity/Chromium fails nonzero, never skip; perform required builds before image-availability acceptance. Cleanup/incomplete evidence failures remain nonzero. The closed scenario inventory below cannot be trimmed to hide exhaustion.

Task 4 owns `tests/fixtures/migration-scenarios.json`: closed exact case IDs, suite, required count and maximum duration. Preflight rejects missing/duplicate/extra/skipped cases or sums exceeding 80% of a phase budget. Case maxima include host actions/readiness; remaining global/case time bounds every 30-second action and 40-second acknowledgement wait. Compare inventory with actual suite counts/outcomes.

| Required Vitest case                           | Max seconds |
| ---------------------------------------------- | ----------- |
| Multipart text A/B/B plus cold replacement     | 60          |
| Multipart WAV A/B/B plus cold replacement      | 60          |
| JSON text A/B/B plus cold replacement          | 60          |
| Core graceful drain/unknown-settlement bound   | 30          |
| Core SIGKILL/no replay/replacement             | 60          |
| Web graceful termination while forwarding      | 30          |
| Lookup termination/tool failure                | 30          |
| Core scale up/down with identical peers        | 60          |
| Timeout/segment policy mismatch                | 20          |
| Padded-WAV direct/delegated cases              | 30          |
| Real adapter/SDK stub matrix                   | 45          |
| Early upload refusal across all hops           | 30          |
| Attribution/corrupt observation negatives      | 20          |
| Local readiness during dependency loss         | 30          |
| Held leases/pipelines and delayed cancellation | 45          |
| Total                                          | 610         |

610 is below 624 (80% of 780); margin is 170 seconds. All signals, replacements and their readiness are included, not additional uncounted time. If actual required work cannot fit, fail and revise the reviewed budget/inventory.

| Required Playwright case                            | Max seconds |
| --------------------------------------------------- | ----------- |
| Typed turn/speech interruption and next generation  | 60          |
| Voiced turn with old delayed events/cancellation    | 60          |
| Secure bootstrap/capabilities without script shift  | 20          |
| Dependency outage with usable static UI/error state | 20          |
| Total                                               | 160         |

160 is below 192 (80% of 240), leaving 80 seconds. No parallelism or reduced drain window is assumed. Task 4 tests the arithmetic and rejection of over-budget inventory; Task 5 reports actual per-case durations/outcomes without claiming these maxima as measurements.

Task 4's runner tests use a fake spawn interface to assert exact argv/config selection and error/signal/timeout cleanup. The runtime run manifest lists the Node wrapper (when invoked), Vitest selection and Playwright selection with start/end/exit code and expected test counts. Reject missing, duplicate or skipped selections and any legacy launcher selection. The Node wrapper is not re-entered by either child suite. Pair fake dispatch tests with Task 5's real topology manifest so a fake-only runner cannot pass acceptance.

Task 3 migrates `tests/browser/system-server.ts` and the ordinary `playwright.config.ts` fixture contract to start the actual standalone core (scripted/mock mode) plus lookup and the thin web server; it must no longer inject a web-global paid runtime. Ordinary developer regressions may retain their existing dev web workflow, but Task 6's required migration production-browser proof always uses the dedicated migration config without `webServer`. The ordinary browser suite still runs to preserve regression assertions; its outcome is distinct from production-container acceptance.

## Extraction checkpoint and regression ownership — revised Tasks 2–3

Task 2 uses **temporary single-source compatibility re-exports**, removed in Task 3. Move implementations to core, but leave tiny deprecated modules at the old web server paths to re-export the moved code/types and response-compatibility functions. Do not copy or fork the implementation. Preserve the existing test-only global runtime identity for this temporary seam so current route fixtures still inject their scripted dependencies. `turnResponse`/`speechResponse` compatibility functions return the new operation handle's `response` and preserve existing web admission; core's external Fastify routes apply their separate bearer/Host gate before invoking the same underlying operations. Re-exports themselves own no provider logic.

Thus Task 2's web routes remain buildable and old route-based regressions still execute their behavioral assertions while the new core socket/lifecycle tests independently prove the portable path. Intermediate Task 2 is **not** accepted final three-service delivery and does not satisfy the final web import-boundary test. Provider dependency removal and the final no-provider-web-graph gate belong to Task 3, after delegation replaces those routes.

Task 3 removes all compatibility re-exports and the legacy web runtime-global injection. Retarget existing `tests/slow/disconnect.test.ts`, deadline/lease/speech route fixtures and integration imports to `createOrchestratorApp` with `createRuntime(..., overrides)` on real sockets; preserve each original behavioral assertion while changing setup/transport to the new owner. Keep new delegated-path regressions against the real thin web wrapper as a second layer. Migrate every test importing old server paths, not just module specifiers; `rg` for old web runtime/http/provider imports is a required closure check. Only browser-safe contracts and web admission/forwarding remain in the final web graph.

Task 2 proves private origin policy and two real local HTTP servers with different host/port origins. **Production inter-container connectivity belongs to Task 4**, after Dockerfiles/Compose exist; it is not a Task 2 prerequisite. Task 5 then tests the accepted packaged topology across replicas. This corrects the earlier appended suggestion assigning real inter-container proof prematurely to Task 2.

Task 2's pressure test separately measures original producer allocations, queued slices and Node/Web/socket buffers; views into a large original allocation do not make that allocation disappear from the bound. Gate producer demand and copy bounded chunks where retaining the original would violate limits. Include the oversized-chunk fixture in both core and delegated-path pressure tests.

### Fixture wire protocol and private test execution

Freeze the fixture boundary in `tests/fixtures/migration-provider/schema.mjs` and validate it on both sides. `createScriptedDeps({operationId, turnId, segmentId?, replicaId}, config)` is the Task 2 request-scoped adapter factory; the core generates operation IDs itself. It returns the existing `TurnDeps`/`SpeechAdapter` interfaces and is selected by mock-only configuration above, never by request headers. Tool lookup remains the real separate lookup HTTP service.

| Listener/operation                           | Contract                                                                                                                                                                                                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Data: `POST /v1/mock/invocations`            | Authenticated adapter token; body contains parent operation UUID, fresh invocation UUID and replica UUID, kind (`model`, `stt`, `tts`), caller IDs and typed fixture input. Returns an operation receipt; accepts each fresh provider invocation once. |
| Data: `GET /v1/mock/invocations/:id/stream`  | Same adapter identity and operation receipt; model NDJSON carries existing `ModelEvent` values, STT JSON carries transcript, TTS body carries raw bounded PCM. No public application SSE is synthesized by fixture.                                    |
| Data: `POST /v1/mock/invocations/:id/cancel` | Records cancel request; acknowledgement resolves only when the named cancellation gate is released. EOF/data-socket abort does not auto-release that gate.                                                                                             |
| Control: `POST /v1/control/scripts`          | Runner token only; loads bounded declarative scripts (no code/eval/URLs), keyed by fixture/caller input. No application-side endpoint invokes this operation.                                                                                          |
| Control: `POST /v1/control/release`          | Runner token, operation ID and named gate; returns acknowledged gate transition.                                                                                                                                                                       |
| Control: `GET /v1/control/ledger`            | Runner-only paginated sequence/observation records; monotonic cursor, no reset/delete during run.                                                                                                                                                      |

Data inputs cap at 3 MiB (with separate raw/base64/envelope bounds below); control bodies cap at 8 KiB. Limit the fixture to 256 provider invocations and a 16 MiB observation ledger per run; overflow invalidates the run with an explicit error instead of dropping observations. Gate deadlines never exceed the runner's remaining budget. Fixture listener auth failures read no control payload and mutate no scripts. Bind the control listener only to its separate control-network interface/address, verified by the runner; it must not listen on the application's data interface or wildcard. Separate adapter/control credentials enforce roles even if a network is misconfigured.

The host runner performs Compose orchestration only. Add `deploy/migration-test.Dockerfile` and a `migration-test` container containing the exact source/lockfile, pinned Node/dev dependencies and the pinned Playwright Chromium installation. It joins private application/control networks and has no host binding or Internet egress. Fixture/router/test-container resources and image digests are in the manifest. Data-plane app containers do not join the control network. The fixture binds its data listener to the application interface and control listener to the control interface. All auth values are runtime secrets generated by the host runner and passed without logging; no app/data container receives the runner token.

Execute the diagram's two test selections through `docker compose exec -T migration-test npx --no-install vitest run --config vitest.migration.config.ts` and `docker compose exec -T migration-test npx --no-install playwright test --config playwright.migration.config.ts`. This is the concrete realization of the Vitest/Playwright rows in the earlier command graph. The browser base URL is `https://web.migration.test:3443` inside that topology, validated against the manifest; direct core tests address replica service/connection targets from the same private application network. No host cannot-reach-core workaround, hidden core port exposure, dev server or extra test execution path is permitted. The driver reads fixture observations from the control interface; a hard-killed core cannot erase them.

Production application images share exactly the delivered entrypoint/modules and are separately source/image-verified. The test driver and fixture are distinct tooling images; their presence does not convert the application into a test server. Missing Chromium inside the pinned driver image fails browser preflight. No runtime `npx` download is permitted. The host's Node wrapper and runner impose the previously declared global bounds on all Compose exec processes and preserve their real nonzero exit codes.

Fixture STT input serializes WAV as an explicit base64 byte string with byte length and SHA-256; model input serializes the existing typed round input, and TTS input serializes the existing speech input. Decode and validate these forms inside the fixture caps. The encoded data cap is 3 MiB, derived from the raw/base64/envelope bounds below; ledger observations retain STT byte length/digest rather than duplicating audio bytes. History/speech assertions use their exact controlled fixture text. The runner's declared scenario inventory stays below ledger/operation caps; exhaustion is an explicit invalid run, never evidence of success.

The first onRequest stage creates exactly one lifecycle registration before auth. Acquire at most one pipeline permit only AFTER bearer/Host auth and interface-policy checks pass, before body reads; carry that permit to the raw route. The earlier route pseudocode describes the combined onRequest/route ownership, not a second registration or permit acquisition; an implementer must not register a second entry when the raw route begins. Auth/pre-parser error hooks finish the same request entry after local cleanup. The web wrapper likewise creates exactly one request context and verifies its AsyncLocalStorage binding reaches the actual Next.js Node route in production tests.

## Final harness corrections from SAR round 2

These decisions replace the earlier plain-HTTP browser origin, one-ID provider protocol and 2 MiB encoded-fixture cap. They also define the host-owned lifecycle action channel. These historical SAR corrections remain requirements of this next full review input, not an application test-result claim. The current spec's later XPR requirements above supersede earlier conflicting readiness/representation wording.

### Trustworthy production browser origin — Tasks 4–5

Use `https://web.migration.test:3443`, served by a separate pinned test TLS ingress container with that private network alias. The host runner generates an ephemeral per-run CA and leaf certificate with exactly that DNS SAN; private keys stay in runtime-only secret mounts and are deleted on cleanup. Install/trust that CA in the pinned driver's OS and Chromium/NSS trust stores, and verify trust before tests. This is normal certificate validation: `ignoreHTTPSErrors` stays false, no insecure-origin allowlist or disabled web-security flags are permitted, and no crypto/client API is patched.

The ingress proxies to the actual production web server, preserves the browser authority Host, disables retries, request/response buffering and compression, and propagates abort/backpressure within declared queue/socket bounds. Its image, CPU/memory/connection limits, buffer settings and private TLS/plaintext hop are recorded as test ingress costs. Add `deploy/migration-ingress.Dockerfile`, `tests/fixtures/migration-ingress/nginx.conf` and certificate/trust setup to Task 4. Nginx settings include `proxy_buffering off`, `proxy_request_buffering off`, `proxy_next_upstream off`, and `gzip off`; use pinned production timeout/resource limits compatible with the core/BFF deadlines. No public core port is exposed.

Web admission accepts exactly Host `web.migration.test:3443` and Origin `https://web.migration.test:3443` for this acceptance profile. The ingress is configured to forward that exact Host and cannot select another upstream; core caller identity still comes from web's server-held token, not forwarded browser headers. Readiness probes may use separately declared private service Host values, without weakening the browser Origin check. Production Playwright config takes its sole base URL from this HTTPS topology manifest and refuses a mismatch; no plain-HTTP fallback exists.

Before the real controller/queue scenario, browser preflight asserts `window.isSecureContext === true`, `typeof crypto.randomUUID === 'function'`, a valid generated UUID, and callable `AudioContext` and `navigator.mediaDevices.getUserMedia`. Voice fixture inputs remain controlled; no physical microphone/paid service validation is claimed. Missing required browser APIs or trust installation is a failed prerequisite. These requirements follow the [Web Cryptography interface](https://w3c.github.io/webcrypto/#crypto-interface) and [Secure Contexts origin algorithm](https://w3c.github.io/webappsec-secure-contexts/#is-origin-trustworthy); private DNS alone does not make HTTP a secure context.

### Parent request versus provider invocation — Tasks 2 and 5

Keep a fresh parent `operationId` for each admitted HTTP turn/speech request. Generate a separate fresh `invocationId` **for every** STT call, model round and TTS call. Never use caller IDs or the parent ID as invocation uniqueness. A parent can therefore own STT plus up to three model invocations; a speech request owns its TTS invocation. Each invocation carries parent ID, invocation UUID, provider kind, per-parent invocation ordinal, model-round number when applicable, replica-instance marker and caller turn/segment correlation. Model round ordinals are 1–3; other ordinals count admitted invocations in order. Parent-local ownership is transient state, not shared session storage.

The private fixture endpoints are `POST /v1/mock/invocations`, `GET /v1/mock/invocations/:invocationId/stream` and `POST /v1/mock/invocations/:invocationId/cancel`. Creation body includes both parent `operationId` and unique `invocationId`; receipts and ledger records include both. Key uniqueness, streams, cancellation acknowledgements and named gates by invocation ID, with matching adapter/receipt authority. Request-scoped `createScriptedDeps` creates fresh invocation IDs on each adapter method call; it does not allocate one at factory construction and reuse it across rounds.

The parent's `OperationHandle.settled` waits for cleanup of every admitted child invocation, including pending reads/cancellation acknowledgements, even when public response readiness failed. Cancelling a parent signals every outstanding child; settled earlier children are not cancelled again. A lost creation receipt is ambiguous: do not replay creation, mint a replacement invocation, run later rounds or claim no work. Surface failure/unknown and settle observed cleanup as far as possible. Duplicate caller IDs create independent parents and child invocations; no paid idempotency guarantee is added.

Task 2's fixture adapter tests and Task 5's production acceptance explicitly cover audio STT then model, two and three model rounds including actual lookup tool continuations, cancellation in a later round, and duplicate caller submissions. Assert exact invocation started/cancel-requested/settled counts grouped by parent and actual lookup observations; the fixture cannot collapse rounds or synthesize the orchestrator's tool loop. Lost-receipt tests assert zero automatic resubmissions.

### Driver-to-host lifecycle milestones — Tasks 4–5

The host runner is the sole Docker/Compose authority. The in-container client is `attachMigrationTopology(manifest)` and never starts a second stack. It delegates signal/replacement/scale actions to the host through a bounded per-run request/acknowledgement directory mounted only into the driver and visible to the host. No application or fixture container receives this mount, Docker socket or Docker API access. The host creates the directory under ignored generated `.tmp` state with restricted permissions; a per-run capability nonce authenticates driver control records and is omitted from evidence.

The capped control request uses this closed discriminated union; unknown fields refuse. UUIDs and container IDs are validated canonical strings, sequence is a positive safe integer, and the deadline is bounded by the run budget.

```ts
type LifecycleRequestBase = {
  runId: string;
  requestId: string;
  sequence: number;
  capabilityNonce: string;
  deadlineUnixMs: number;
};
type CoreMembership = { 'core-a': string; 'core-b': string | null };
type LifecycleRequest = LifecycleRequestBase &
  (
    | {
        action: 'terminate' | 'kill' | 'replace';
        target: 'core-a' | 'core-b' | 'web' | 'lookup';
        expectedContainerId: string;
      }
    | {
        action: 'scale-core';
        target: 'core';
        desiredCount: 1 | 2;
        expectedReplicas: CoreMembership;
        expectedPeers: { web: string; lookup: string };
      }
  );
```

Single-container actions require their target to be currently present and its ID to match exactly; absent core-b refuses. Scale always names the allowed core group and supplies both membership keys: core-a is present; core-b is null in the one-replica state and an exact present ID in the two-replica state. Missing or extra keys, stale/foreign IDs or membership different from the current run manifest refuse before Docker mutation. The host verifies expected web/lookup IDs as well. No shell command, path, image, argv array or arbitrary service/group name is accepted.

For 1-to-2, retain core-a unchanged and create only core-b from the pinned run-owned orchestrator replica template. For 2-to-1, retain core-a unchanged and drain/remove only core-b using the declared lifecycle bounds. Use fixed host-owned Compose/template mappings; neither the driver nor a record selects an image or service name. Never recreate core-a to satisfy a scale request. A request matching the current count is a verified no-op. Verify web/lookup identities and limits are unchanged and publish complete before/after CoreMembership plus peer IDs in the acknowledgement/updated manifest, including core-b:null after scale-down. Partial/uncertain results remain unknown and fail the run. All actual targets must retain the unique run label and expected source/image identity.

The driver writes each capped 8 KiB JSON request to a temporary file and atomically renames it into the request directory. Host runner asynchronously consumes requests while suite subprocesses are active, validates schema/capability/deadline/identity, executes fixed argv arrays for the enumerated action only, then atomically writes an acknowledgement with request/run IDs, verified before/after container IDs, outcome (`completed`, `refused`, `failed`, `unknown`), sanitized error and host-owned timestamp. Return an updated manifest after replacement/scale. A completed signal receipt verifies signal delivery and observed target termination; it does not assert provider settlement. Driver waits at most 40 seconds and never infers success from silence or provider counts alone.

Duplicate matching request IDs return the recorded acknowledgement without repeating an action; conflicting duplicate IDs, stale identities, expired milestones, foreign labels or malformed requests refuse. Limit to 32 actions per run. Each host action is bounded to 30 seconds and the remaining global budget. Partial/uncertain Docker outcomes become `unknown`, fail the run and trigger bounded cleanup rather than automatic action replay. Record observations needed for audit without the nonce. Host polling/file watching remains a bounded runtime mechanism, not model-token polling. Teardown is host-owned and cannot be selected as an arbitrary driver action.

`attachMigrationTopology` exposes `replace(target)`, `signal(target, 'SIGTERM' | 'SIGKILL')` and `scaleCore(1 | 2)` by emitting the above records and awaiting verified acknowledgements. It rejects obsolete `stop(signal)` calls without a target. Direct/web request clients, fixture controls and manifest reads are pure in-container test operations; only the explicit milestone path invokes host authority.

Task 4 runner tests cover allowed actions, actual-run identity checks, duplicate/conflicting records, expired deadlines, failed actions and teardown. Task 5 gates a real core stream using the fixture ledger, requests `kill` of that exact replica, awaits host termination acknowledgement, then reads the surviving invocation ledger and exercises the next request/replacement. Repeat SIGTERM and independent scaling with peer identities unchanged. A failed action/expired milestone is an explicit failing test with bounded cleanup, never replaced by a guessed sleep or an unacknowledged kill.

### Raw, encoded and metadata bounds — Tasks 2 and 5

The application's 2 MiB cap is on the entire multipart body; RIFF ancillary chunks may make accepted WAV bytes larger than the PCM sample-count bound. Preserve that contract. Use these conservative independent fixture limits:

- Decoded raw WAV: at most 2,097,152 bytes, followed by the unchanged WAV structural/PCM validation. Real accepted raw bytes are slightly smaller because multipart overhead also consumes the application's cap.
- Canonical base64 field: at most `4 * ceil(2,097,152 / 3) = 2,796,204` bytes.
- JSON metadata/envelope excluding base64 field contents but including all keys/quotes: at most 65,536 UTF-8 bytes.
- Whole encoded fixture request: at most 3,145,728 bytes (3 MiB). The derived maximum is 2,861,740 bytes, below that wire ceiling.

Validate encoded length and canonical base64 before decoding; validate decoded raw size afterwards. Bound both allocations and release the encoded buffer when possible; do not confuse wire cap with stream-queue bounds. The earlier 2 MiB **encoded fixture** cap is superseded by 3 MiB; application body caps are unchanged. Audio ledger entries retain only length/digest.

Add a structurally valid 1,600,000-byte WAV with a legal ancillary padding chunk, plus a valid near-multipart-limit padded WAV: first prove application parsing accepts them, then fixture roundtrip/length/digest succeeds. Add over-wire-cap, over-base64-field, noncanonical encoding and decoded-raw-over-cap rejections. Keep original PCM/duration restrictions; do not reject legal ancillary chunks merely to fit the fixture. Task 5 repeats the accepted padded-WAV case through direct and delegated production paths.

When retargeting old regressions, retain Origin/Host browser-protection assertions at the web boundary; test core bearer/Host independently. Do not turn browser Origin into a direct-core requirement.

Task 4's lifecycle-channel tests instantiate the discriminated scale schema for 1→2 with `core-b: null`, 2→1 with both exact IDs, and same-count no-op. Reject omitted/extra membership, stale/foreign identity, mismatched peer IDs and single-target actions on absent core-b. A duplicate matching request returns its original before/after membership acknowledgement without scaling again; a conflicting duplicate refuses. Task 5 verifies real transitions retain the identical core-a, web and lookup containers, while only core-b is added or drained/removed. No template/service/image override is accepted from the driver.
