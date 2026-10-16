# Stateless Service Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for inline execution or superpowers:subagent-driven-development when the owner selects that method. Steps use checkbox (`- [ ]`) syntax for tracking. This document authorizes neither execution method nor implementation.

**Goal:** Deliver the real three-service migration required by #40 so research #41/#42 can consume an accepted integrated application and stateless-service evidence.

**Architecture:** Browser-safe contracts form a neutral workspace. A standalone Fastify orchestrator owns the existing provider/tool lifecycle; Next.js delegates over private authenticated streaming HTTP. Lookup stays independent. History and speech inputs travel with each request; cancellation stays with its open transport, so no shared coordination store or affinity is required for the selected semantics.

**Tech Stack:** Existing Node 26.8.1/npm 12.0.2, TypeScript/ESM, Next.js 16.4.0, Fastify 5.12.5, existing pinned provider SDKs, Vitest, node:test, Playwright, Docker Compose. No dependency/runtime upgrade is included.

**Spec:** [Migration-specific design](../specs/2026-10-16-40-stateless-service-migration-design.md). Initial design checkpoint `07a92dd97ca7d8819e235ebe97b17f08608d8671`; exact accepted spec revision/digest must be recorded before this plan is accepted. Read both artifacts and #39's governing sections; #39 review lineage does not approve this migration.

**Issue:** [#40](https://github.com/kburson/AIVC/issues/40). Date: October 16, 2026 (America/Chicago). Draft for independent review. Future code/test steps below are requirements, not claims that they were performed.

## Global Constraints

- Preparation/review only until owner approval; no product implementation, paid calls, deployment, cluster or research campaign.
- Independent production web, orchestrator and lookup containers; scale orchestrator without copying peers.
- Keep multipart text/WAV turn input and JSON speech; preserve version-1 SSE/PCM/error/usage schemas. No JSON turn extension without explicit design amendment.
- Core auth before body/provider lease; web Host/Origin protection; no wildcard/forwarded-header trust, retries, credential leakage or browser core token.
- Two turn/two speech slots per core process until actual settlement; never release on client timeout alone.
- No history/session storage or affinity; explicit client generation fencing and per-stream cancellation. No global idempotency or remote cancellation claim.
- Streaming application queues at most 64 KiB plus one chunk of at most 16 KiB per hop; socket buffers declared separately.
- Core deadlines include upload. BFF deadline includes upload/connect/headers/full stream without chunk resets; no cross-process monotonic subtraction.
- SIGTERM withdraws readiness, refuses new work, drains 15 seconds, aborts then waits 5 seconds; container stop grace at least 25 seconds; unsettled hard exit remains unknown.
- Mock providers only for migration acceptance, external provider egress denied and paid credentials absent. Preserve historical sealed evidence.

## Review Focus

1. Upload completed but response client disconnects: cancel the actual provider owner and retain its lease until settlement (Tasks 2–3).
2. A slow reader stops consuming while producer keeps generating: bound both bridges and producer demand, including abort while waiting for drain (Task 2, repeated via Task 3).
3. Turn A followed by speech/history B and cold A replacement: no server-local state/affinity; stale generation output remains fenced by the real client (Task 5).
4. Drain with keepalive, late provider cancellation and hard kill: refuse new work, preserve unknown outcomes and never replay (Tasks 4–5).
5. Runtime/config/catalog mismatch or missing container tooling: fail acceptance explicitly instead of skipping tests or inventing an integrated baseline (Tasks 4–6).

## Delivery graph and effort

These are proposed implementation work packages, not already created or approved issues. Estimate is preliminary joint human effort, not AI elapsed time.

| Task  | Deliverable                                         | Depends on                                   | Joint hours |
| ----- | --------------------------------------------------- | -------------------------------------------- | ----------- |
| 1     | Neutral contract workspace and consumer migration   | Accepted spec/plan and normal AITM admission | 4           |
| 2     | Portable authenticated core with bounded transport  | 1                                            | 10          |
| 3     | Thin web streaming delegation                       | 2                                            | 6           |
| 4     | Independent production containers and lifecycle     | 3                                            | 8           |
| 5     | Cross-replica, interruption and shutdown acceptance | 4                                            | 8           |
| 6     | Integrated regression evidence and Task 0 handoff   | 5                                            | 4           |
| Total | Dependency-ordered migration                        |                                              | 40          |

Before coding, run governed decomposition/admission against the accepted plan. #40 is XL and must not silently execute as an atomic story. The next preparation action is governed decomposition/conversion and child hydration as required by AITM; no issue numbers are invented here. Each implementation owner gets a bound worktree, current source, pushed branch and draft PR targeting its recorded integration base. Preserve review and source provenance across the resulting issues. Do not start parallel implementation before contract freeze and ownership admission; this sequence is serial by default.

## File map

| Path                                                                                                           | Responsibility                                                           |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `packages/contracts/{package.json,tsconfig.json,src/index.ts}` and `src/{contracts,validation,history,sse}.ts` | Browser-safe compiled ESM/declarations                                   |
| `apps/orchestrator/{package.json,tsconfig.json,src/index.ts}`                                                  | Production Fastify entry point and process ownership                     |
| `apps/orchestrator/src/http/{app,auth,request,response,pump}.ts`                                               | Routes, authentication, request bridge and bounded response pumping      |
| `apps/orchestrator/src/{runtime,config,capabilities,build-info}.ts`, `providers/`, `tools/`, `turns/`          | Moved real orchestration and lifecycle with corrected imports            |
| `apps/orchestrator/src/lifecycle.ts`                                                                           | Readiness, active request registry, drain/abort/settlement               |
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

Existing `apps/web/server/http/{body,sse-response,speech-response,errors}.ts` move into core's corresponding HTTP modules; provider/runtime orchestration leaves web. Keep only web admission/forwarding. Tests follow their new owning imports; do not delete behavioral assertions to make moves green.

## Task 1: Extract browser-safe contracts

**Files:** Create the contract workspace in the file map; modify root workspaces/build order, consumer package manifests/lockfile, browser/server and existing contract-test imports. Existing source set is exactly `apps/web/shared/{contracts,validation,history,sse}.ts`.

**Interfaces:** `@aivc/contracts` re-exports existing types/functions without changing signatures: `TurnInput`, `SpeechInput`, `TurnEvent`, `Capabilities`, `parseTurn`, validators, `encodeSse`, `assertTurnSequence`, and history helpers. ESM exports point to compiled `dist/index.js`; types point to `dist/index.d.ts`.

- [ ] Step 1: Add the transitive import boundary regression before moving source. Retain the existing frozen wire fixtures and schema rejection cases.

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
- [ ] Step 3: Move the four source files into the package; define explicit exports and compile before consumers. Import/re-export only the current public symbols; preserve parser and history limits. Migrate the boundary walker so it examines the new package transitively rather than an empty old directory.

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

- [ ] Step 4: Build workspace then run focused existing validation/history/SSE/wire tests, `npm run typecheck`, and browser bundling. Assert the package closure rejects Node/server/provider/env imports; no handwritten copy remains in web.
- [ ] Step 5: Commit exact owning paths using the actual delivery issue attribution; keep its draft PR current.

## Task 2: Extract and serve the real Fastify orchestrator

**Files:** Core workspace, moved server modules and `tests/contracts/orchestrator-http.test.ts`. Root discovery/build config and moved tests belong to this step.

**Interfaces:** `createOrchestratorApp({runtime, lifecycle}): FastifyInstance`; `createRuntime(env, overrides?): ServerRuntime` retains existing adapter injection for scripted providers. `requestFromIncoming(raw, signal): Request` preserves streaming bytes/content type without eagerly consuming the body. `pumpResponse(response, rawReply, signal): Promise<void>` awaits downstream demand and actual reader cancellation. `Lifecycle` is defined in Task 4; initially its non-draining implementation supplies request registration/abort handles with the same interface.

- [ ] Step 1: Write socket-based authentication ordering tests using a request body that never finishes and a scripted provider counter. Missing/wrong token must return 401 with zero body-consumer, adapter and lease calls. Add valid direct multipart text/audio, JSON speech and capabilities tests against the real core.

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
    });
  } finally {
    await h.close();
  }
});
```

`startCoreFixture` is created here in `tests/helpers/migration-topology.ts`; it starts real Node/Fastify sockets with injected adapters. `rawRequest` resolves on response headers and closes its still-open upload in cleanup. `counts()` returns sanitized in-memory test counters, never a public production endpoint.

- [ ] Step 2: Run the focused test; RED must be missing core entry point/auth behavior, not a provider/network credential failure.
- [ ] Step 3: Move runtime/providers/tools/deadline/lease and HTTP handling into core, remove Next-specific assumptions, preserve caller-independent validation, and add an onRequest auth gate before Fastify body parsing. Use raw streamed routes/custom parsing for capped request handling; default JSON parsing must not precede authentication. Node request construction uses `duplex: 'half'` where required by the pinned runtime.

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

`finish` removes the registry entry only after settlement, while recording terminal or unknown outcome. A lease belongs to core work, not the response pump. Handle Node response close independently of request upload completion. Disable request/SDK automatic retries and redirect following. Never release from deadline `result`; retain existing release-from-`settled` semantics.

- [ ] Step 4: Add pausing-reader and deferred cancellation fixtures. Fill two slots, abort both transports, keep underlying provider cancellation unresolved, and prove a third request remains BUSY until actual settlement. Pause read demand and assert producer pulls/queued bytes stop at the declared bound; abort during drain and verify cleanup. Exercise oversize body, malformed media/history, provider rate limit, deadline before headers, deadline after accepted SSE, PCM EOF/error and once-only terminal.
- [ ] Step 5: Run `npx vitest run tests/contracts/orchestrator-http.test.ts tests/contracts/leases.test.ts tests/contracts/deepgram.test.ts tests/contracts/search-budget.test.ts tests/slow/disconnect.test.ts tests/slow/deadlines.test.ts`. Update moved imports only, retain prior behavioral assertions. Commit focused core ownership/transport deliverable.

## Task 3: Delegate web requests without provider ownership

**Files:** Web forwarding modules, three API routes, web-only config/capabilities adapter, package dependencies, and `tests/contracts/web-forwarding.test.ts`.

**Interfaces:** `forwardRequest(req: Request, path: '/api/turn' | '/api/speech', config: ForwardingConfig): Promise<Response>`; `ForwardingConfig` holds fixed `coreOrigin`, private `coreToken`, allowed web Host/Origin sets, turn/speech timeout and transport-grace milliseconds. `forwardCapabilities(req, config, webBuild): Promise<Response>` preserves validated capability shape while replacing only web build metadata. `forwardRequest` never parses or regenerates multipart/SSE/PCM.

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
- [ ] Step 3: Replace routes with Host/Origin admission plus fixed forwarding. Sanitize request/response headers, preserve status/content types/audio fields, retain no-cache semantics, disable redirects/retries, bound full-stream deadline and combine abort sources. Add core-unreachable 502, deadline 504 and after-header incomplete behavior. Remove executable orchestration imports and provider SDK dependencies from web.
- [ ] Step 4: Test bad Host/Origin, invalid browser-supplied auth/forwarded headers, slow upload, early core errors, delayed SSE/audio, downstream abort and upstream failure without duplicate terminal or appended PCM. Build web and inspect runtime dependency closure for provider/core imports and secret leakage.
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
- [ ] Step 3: Implement registry/readiness/drain using request-scoped controllers and settle promises. Avoid `server.close()` indefinitely waiting before abort triggers. Reject new work on keepalive after withdrawal. Hard exit bounds cleanup and labels unresolved work unknown. Web participates through an owned production server wrapper or equivalent verified pinned Next.js lifecycle hook; a health route flag alone cannot prove upstream stream drain. The implementation must show the chosen pinned Next.js mechanism in this task's review.
- [ ] Step 4: Add independent multistage production builds, nonroot/read-only roots, baked contracts/assets/catalog, explicit bounded ephemeral mounts where necessary, private network, limits and stop grace. Build images with existing lockfile/toolchain pins; pin base image digests in delivered manifest. Token/key supplied only at runtime, never image build args.
- [ ] Step 5: Extend `scripts/dev.mjs` and clean-build to own all three processes and ports with deterministic shutdown. Test missing core build, startup failure, cleanup after second/third child failure and exit-code preservation. Run lifecycle/launcher/cleanup tests and three production builds; commit deployable topology.

## Task 5: Prove cross-replica state and transport behavior

**Files:** `tests/contracts/stateless-services.test.mjs`, `tests/integration/stateless-services.test.ts`, `tests/browser/stateless-interruption.spec.ts`, topology/provider helpers. Any discovered app correction belongs to its owning implementation package and gets re-reviewed.

**Interfaces:** `startMigrationTopology({coreReplicas: 1 | 2, production: true, offline: true})` returns `direct(replica)`, `web`, `routeNext(replica)`, `replace(replica)`, `stop(signal)`, `manifest()`, `providerCounts()` and `close()`. Replica selection lives only in test infrastructure, not an application backdoor. Test router uses request round-robin or explicit test schedule, no stickiness and no retry.

- [ ] Step 1: Add the required Node test entry point. It performs explicit Docker/Compose/image preflight, runs the container integration/browser acceptance selection, and fails nonzero if unavailable. It must not return success for a skipped test.

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
test('production stateless service acceptance', () => {
  const probe = spawnSync('docker', ['info'], { encoding: 'utf8' });
  assert.equal(probe.status, 0, 'Docker is required for migration acceptance');
  const run = spawnSync('npm', ['run', 'test:migration:containers'], {
    stdio: 'inherit',
  });
  assert.equal(run.status, 0, 'Container acceptance must execute and pass');
});
```

Define `test:migration:containers` here to run the topology-owned integration/browser suite exactly once, not recurse into the entry point. Cross-platform subprocess behavior must match the repository's existing runner conventions.

- [ ] Step 2: Run the new acceptance entry point; expect RED for absent implementation, or explicit unavailable tooling. Never treat tool absence as a product defect fix or success.
- [ ] Step 3: Schedule a multipart turn on A, a speech segment on B, then a next turn with retained history on B; cold-replace A and repeat. Observe actual replica identity via test harness connection target, not public API/header additions. Compare provider-observed histories and speech inputs with expected payloads. Read-only filesystems and no session volumes remain enforced.
- [ ] Step 4: Through the real browser controller/queue, interrupt A turn/B speech, delay old events and cancellation settlement, then begin next generation on another replica. Assert stale output cannot play/enter history and old work settles without replay. Verify duplicate submitted IDs are independent requests, not claimed deduplicated; clients/proxy never retry on lost response. Probe nonexistent cancellation-by-ID endpoint and require 404/zero work.
- [ ] Step 5: Scale 1→2 orchestrators and verify web/lookup count/image/limits unchanged; mismatch catalog/config/contract digest must fail topology eligibility. Run graceful SIGTERM and hard SIGKILL while streaming; measure readiness/new work, stream outcome and provider count. Core failure does not cause replay. Add web and lookup termination/outage cases with bounded failure/cleanup.
- [ ] Step 6: Execute required entry point, focused existing interruption/disconnect/rapid-interruption regressions and browser suite. Commit acceptance suite plus actual sanitized evidence; failed/incomplete results remain visible.

## Task 6: Integrate, verify and hand off the accepted application

**Files:** Migration implementation guide and evidence manifest; final test/build/doc runner updates; issue/PR references via sanctioned commands.

**Interfaces:** Research Task 0 receives an accepted integrated SHA/PR, source-to-image mapping, exact contract/catalog/config digests, independent replicas/resources/mounts, state/coordination declaration, per-instance/aggregate lease meaning, local ingress cost, actual verifier outputs and limitations. No benchmark/capacity or paid calibration result is implied.

- [ ] Step 1: Freeze integrated source, confirm clean tree and expected dependency graph, build images and write immutable source/image/fixture identity manifest. Source changes invalidate affected receipts; do not label stale reports as current.
- [ ] Step 2: Run `npm run typecheck`, `npm run build`, `npm test`, `npm run test:contracts`, `npm run test:integration`, `npm run test:voice`, `npm run test:slow`, `npm run test:browser`, `npm run lint`, `npm run format:check`, `npm run verify:docs`, `npm run verify:sealed-evidence` and `node --test tests/contracts/stateless-services.test.mjs` at the accepted integrated revision. Use stage-owned canonical verifiers; document commands requiring container/browser infrastructure and fail/stop when prerequisites are unavailable. No paid `verify:live` run is authorized.
- [ ] Step 3: Check each issue AC/DoD separately with actual declared verifier evidence; preserve Test/Review and final approval gates. Get independent whole-change code review on the exact integrated SHA; do not reuse planning consensus as code review.
- [ ] Step 4: Keep every delivery branch fetchable/draft PR current and integrate only with owner-authorized exact-head sanctioned merge. Verify accepted source reachable from recorded target before Done. Record actual merge dates/provenance, no invented provider-action receipt.
- [ ] Step 5: Publish the Task 0 handoff with explicit no-store semantics, per-stream abort, no global dedup/failover claim, shutdown unknown outcomes, catalog version, independent topology and ingress footprint. Unblock research only through normal dependency authority after #40 delivery is accepted, not while this plan is merely reviewed.

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
