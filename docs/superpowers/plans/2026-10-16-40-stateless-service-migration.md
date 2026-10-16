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

These are proposed implementation work packages, not already created or approved issues. Estimate is preliminary joint human effort revised after native SAR to include concrete production fixtures and settlement handoff, not AI elapsed time.

| Task  | Deliverable                                             | Depends on                                   | Joint hours |
| ----- | ------------------------------------------------------- | -------------------------------------------- | ----------- |
| 1     | Neutral contract workspace and consumer migration       | Accepted spec/plan and normal AITM admission | 4           |
| 2     | Portable authenticated core with bounded transport      | 1                                            | 12          |
| 3     | Thin web streaming delegation                           | 2                                            | 6           |
| 4     | Independent production containers, lifecycle and runner | 3                                            | 14          |
| 5     | Cross-replica, interruption and shutdown acceptance     | 4                                            | 12          |
| 6     | Integrated regression evidence and Task 0 handoff       | 5                                            | 4           |
| Total | Dependency-ordered migration                            |                                              | 52          |

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
- [ ] Step 5: Run `npx vitest run tests/contracts/orchestrator-http.test.ts tests/contracts/leases.test.ts tests/contracts/deepgram.test.ts tests/contracts/search-budget.test.ts tests/slow/disconnect.test.ts tests/slow/deadlines.test.ts`. Use the temporary compatibility seam defined below at this checkpoint; preserve every behavioral assertion. Task 3 retargets legacy fixtures to the real core and removes the seam. Commit focused core ownership/transport deliverable.

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

## Specification SAR and concrete planning decisions

The migration specification at `07a92dd97ca7d8819e235ebe97b17f08608d8671`, SHA-256 `fecb93bdc40e6f2636f04bb243d7f5cbf74cbb8041f8c16891f38db4c643d1d4`, received native SAR acceptance with no required changes. [Complete SAR report](../../peer-reviews/spec/stateless-service-migration-design-review-40-native/sar/astra-sar-report-round-1.md). Its accepted bytes are unchanged. This records the exact specification pin required by the header. Sealed XPR is pending the owner-selected tooling recovery; native SAR is not two-party consensus or implementation approval.

The following decisions make the three optional SAR planning suggestions concrete. They are part of this plan's review input and govern their owning tasks above.

### Service networking — Tasks 2–4

- Production binds inside private containers: web `0.0.0.0:3000`, orchestrator `0.0.0.0:3002`, lookup `0.0.0.0:3001`. Local launcher can retain loopback. Compose exposes only web; direct-core tests run inside the private test network.
- Web `ORCHESTRATOR_BASE_URL` is one fixed private origin; `CORE_CALLER_TOKEN`, `BFF_ALLOWED_HOSTS`, `BFF_ALLOWED_ORIGINS`, forwarding turn/speech timeouts and bounded transport grace are server-owned config. Core has separate `CORE_ALLOWED_HOSTS` and the configured caller token. Incoming headers cannot override any value.
- The current lookup client rejects all non-loopback origins. Task 2 replaces that restriction with an exact configured `RETRIEVAL_BASE_URL` origin policy and fixed `/v1/projects` path. Reject userinfo, fragments, query/base paths, wildcard origins, user-supplied URLs and redirects. Select the declared private lookup service origin explicitly; retain strict query/schema validation.
- Task 2 owns negative origin/redirect tests and real two-server HTTP connectivity. Task 4 owns production binds and inter-container connectivity after packaging exists. Relocation without these changes does not pass.

### Contract digest migration — Task 1

Modify `scripts/contract-digest.mjs`, its declaration, `tests/contracts/contract-digest.test.ts` and build-info consumers with the moved contracts. The digest currently frames closed path-labelled inputs under `apps/web/shared`; moving those paths changes the digest even with identical behavior. Record the new framed digest; retain frozen wire fixtures as semantic parity proof. Preserve historical sealed artifacts and hashes rather than rewriting them to the new layout. Extend Task 1's transitive boundary tests to all new package exports and include the owning digest test in its focused verification.

### Credential/readiness matrix — Tasks 2 and 4

Core caller token and valid service Host/origin/config values are mandatory in every mode. Mock readiness succeeds with paid-provider keys absent. In live mode retain existing unavailable capability states for optional missing provider configuration; readiness/capability reads make no paid call, and unavailable-function requests retain sanitized failures.

Dependency readiness checks run at most once per five seconds, timeout at 500 ms, use no retries, coalesce concurrent probes and cache at most ten seconds. Failed/stale probes return not-ready, affect readiness only, and never cause autonomous restarts or paid probes. Drain always overrides cached health. Task 4 tests missing caller token, mock success without paid keys, unavailable live capabilities and stale/failed probe behavior; Task 2 retains provider-availability request errors.

### Concrete web lifecycle mechanism — Task 4

Create `apps/web/server/start.mjs`, update the web start script and add its socket lifecycle tests. Use an owned Node HTTP server around pinned Next.js `next({dev:false})` and `getRequestHandler()`. Its request/socket registry and signal handling withdraw readiness and gate new/keepalive work before invoking the framework handler; close/abort at the declared bounds. Merely toggling a health route cannot prove upstream drain.

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

Create the handle synchronously before asynchronous body ingestion. Its `response` resolves to headers/body readiness or rejects with the pre-header error; its `settled` resolves only when body work, producer, pending reads and provider/reader cancellation actually settle. Validation or unavailable-provider failures resolve `settled` after their own cleanup; missing adapter work is not an unresolved promise. Provider failures retain response/error semantics while `settled` observes every rejection. `abort` is idempotent and signals all admitted work. Existing deadline `task.settled` must feed this handle directly, rather than being hidden behind `Promise<Response>`.

The route registers an `ActiveRequest` before auth/body work, and passes its signal into the handle. Core onRequest bearer/Host rejection never reads the body or acquires a lease; that rejected request finishes its registry entry with a resolved cleanup promise. Authentication is not deferred into a body parser. A factory throw before the handle exists also finishes the entry after local cleanup. For accepted work, the response pump has its own settled promise including reader cancellation. Route ownership is:

```ts
const active = lifecycle.enter(); // rejects new application work during drain
let operation: OperationHandle | undefined;
let pumpSettled: Promise<void> = Promise.resolve();
let cleanEnd = false;
try {
  assertCoreCaller(rawRequest, config); // before parser/body/lease
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
  active.finish(settled); // finish arranges removal only after this promise
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

Root script `test:migration:containers` is exactly `node scripts/test-migration-containers.mjs`. Vitest's migration config includes only `tests/integration/stateless-services.test.ts`, runs serially against the runner's ready topology, and excludes the Node wrapper. Playwright's migration config includes only `tests/browser/stateless-interruption.spec.ts`, uses `baseURL` from validated `AIVC_MIGRATION_WEB_URL`, sets one worker, `retries: 0`, `forbidOnly: true`, and defines **no `webServer`**. It refuses an absent URL/topology manifest; it cannot import the legacy system-server launcher. The runner passes only bounded fixture/control connection information, never paid credentials. No suite uses an implicit localhost/development fallback.

The runner owns a unique Compose project name, all images/services/networks/volumes and teardown on success, failure, signals and timeout. Keep the three application services at production mode, with independent configured replicas; the fixture/router are declared test infrastructure. Application images are built from the clean pinned source revision or accepted only when source SHA, build manifest, contract/catalog digests and content labels match that exact revision. A local tag or cached image without this proof refuses. Record the built image content digests before tests. Core death never deletes the fixture ledger before assertions/artifact capture.

Bound the whole runner to 1,200 seconds: builds at most 600 seconds, readiness 90 seconds, Vitest 240 seconds, Playwright 240 seconds, teardown 30 seconds, all also constrained by the remaining global budget. Individual integration/browser tests have at most 60-second deadlines; real 20-second shutdown checks fit that limit. The Node wrapper has a 1,260-second timeout, launches the runner with a 1,200-second subprocess timeout and preserves nonzero exits. On forced runner death it performs bounded fallback teardown using the recorded Compose project; capture incomplete evidence first if possible. Cleanup failure stays a nonzero test outcome. Docker, Compose, image identity or Chromium absence is explicit failure, never skip. Build services from the pinned source before declaring images missing; a required unavailable build/runtime is still nonzero.

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

| Listener/operation                          | Contract                                                                                                                                                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Data: `POST /v1/mock/operations`            | Authenticated adapter token; body contains operation/replica UUIDs, kind (`model`, `stt`, `tts`), caller IDs and typed fixture input. Returns an operation receipt; accepts each internal operation once.           |
| Data: `GET /v1/mock/operations/:id/stream`  | Same adapter identity and operation receipt; model NDJSON carries existing `ModelEvent` values, STT JSON carries transcript, TTS body carries raw bounded PCM. No public application SSE is synthesized by fixture. |
| Data: `POST /v1/mock/operations/:id/cancel` | Records cancel request; acknowledgement resolves only when the named cancellation gate is released. EOF/data-socket abort does not auto-release that gate.                                                          |
| Control: `POST /v1/control/scripts`         | Runner token only; loads bounded declarative scripts (no code/eval/URLs), keyed by fixture/caller input. No application-side endpoint invokes this operation.                                                       |
| Control: `POST /v1/control/release`         | Runner token, operation ID and named gate; returns acknowledged gate transition.                                                                                                                                    |
| Control: `GET /v1/control/ledger`           | Runner-only paginated sequence/observation records; monotonic cursor, no reset/delete during run.                                                                                                                   |

Data inputs cap at 2 MiB; control bodies cap at 8 KiB. Limit the fixture to 256 operations and a 16 MiB observation ledger per run; overflow invalidates the run with an explicit error instead of dropping observations. Gate deadlines never exceed the runner's remaining budget. Fixture listener auth failures read no control payload and mutate no scripts. Bind the control listener only to its separate control-network interface/address, verified by the runner; it must not listen on the application's data interface or wildcard. Separate adapter/control credentials enforce roles even if a network is misconfigured.

The host runner performs Compose orchestration only. Add `deploy/migration-test.Dockerfile` and a `migration-test` container containing the exact source/lockfile, pinned Node/dev dependencies and the pinned Playwright Chromium installation. It joins private application/control networks and has no host binding or Internet egress. Fixture/router/test-container resources and image digests are in the manifest. Data-plane app containers do not join the control network. The fixture binds its data listener to the application interface and control listener to the control interface. All auth values are runtime secrets generated by the host runner and passed without logging; no app/data container receives the runner token.

Execute the diagram's two test selections through `docker compose exec -T migration-test npx --no-install vitest run --config vitest.migration.config.ts` and `docker compose exec -T migration-test npx --no-install playwright test --config playwright.migration.config.ts`. This is the concrete realization of the Vitest/Playwright rows in the earlier command graph. The browser base URL is `http://web:3000` inside that topology, validated against the manifest; direct core tests address replica service/connection targets from the same private application network. No host cannot-reach-core workaround, hidden core port exposure, dev server or extra test execution path is permitted. The driver reads fixture observations from the control interface; a hard-killed core cannot erase them.

Production application images share exactly the delivered entrypoint/modules and are separately source/image-verified. The test driver and fixture are distinct tooling images; their presence does not convert the application into a test server. Missing Chromium inside the pinned driver image fails browser preflight. No runtime `npx` download is permitted. The host's Node wrapper and runner impose the previously declared global bounds on all Compose exec processes and preserve their real nonzero exit codes.

Fixture STT input serializes WAV as an explicit base64 byte string with byte length and SHA-256; model input serializes the existing typed round input, and TTS input serializes the existing speech input. Decode and validate these forms inside the fixture caps. The data cap is 2 MiB so the application's maximum valid WAV remains representable; ledger observations retain STT byte length/digest rather than duplicating audio bytes. History/speech assertions use their exact controlled fixture text. The runner's declared scenario inventory stays below ledger/operation caps; exhaustion is an explicit invalid run, never evidence of success.

The real core request boundary has exactly one lifecycle registration per HTTP request, created in the first onRequest stage before the auth gate and carried in request context to the raw route. The earlier route pseudocode describes that combined boundary; an implementer must not register a second entry when the raw route begins. Auth/pre-parser error hooks finish the same request entry after local cleanup. The web wrapper likewise creates exactly one request context and verifies its AsyncLocalStorage binding reaches the actual Next.js Node route in production tests.
