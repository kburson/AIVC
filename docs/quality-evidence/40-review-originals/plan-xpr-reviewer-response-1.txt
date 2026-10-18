<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-3f99142a6b19c9dcbe0e6e53c7b1354a"
role: "reviewer"
turn: 1
commit_mode: "no-commit"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md"
artifact_commit: "e6f70cbb52fa5b5651cd3c3817f3e7104deb2a14"
artifact_blob: "9f4fe68867a0864f32b86d38c7c832a6d584f221"
artifact_digest: "sha256:ba0da2e873c29d41dd1947720aeffd586709e5ec95eb356752dd068d8dfce76a"
agent:
  host: "claude-code"
  provider: "anthropic"
  model_id: "claude-opus-5-5"
  model_display: "claude-opus-5-5"
  session_fingerprint: "sha256:36fa55b446e522f55e4fc3f6d284dd591a436eb4e96b1bdf4772d693e907b3d3"
  identity_source: "runtime"
started_at: "2026-10-17T09:13:18.696Z"
submitted_at: "2026-10-17T09:17:18.872Z"
finding_ids: ["R1-F001","R1-F002","R1-F003","R1-F004","R1-F005","R1-F006","R1-F007","R1-F008","R1-F009","R1-F010"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---

> **LOCAL JOURNAL MODE** — authority assurance: `unavailable`

## Summary

I reviewed the whole migration plan (artifact blob `9f4fe688…`, commit `e6f70cb`, the workspace copy `artifacts/start.md`, all 579 lines). I checked it against the XPR-accepted design `docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md`, sections 4–10, and against the current source in this worktree:

- `apps/web/server/runtime.ts`
- `apps/web/server/turns/leases.ts`
- `apps/web/server/http/sse-response.ts`
- `apps/web/server/providers/deepgram.ts`
- `apps/web/server/providers/claude.ts` (`ClaudeOptions.fetch`)
- `apps/web/server/tools/retrieval-client.ts`
- `tests/contracts/{config,leases,admission,wire-contracts}.test.ts`
- `tests/helpers/wire-contract-fixtures.ts`

Source claims that hold:

- `ClaudeOptions.fetch` and `createDeepgramAdapter(config, fetchImpl?)` exist. The SDK-stub seam is real constructor injection. Deepgram STT and TTS use REST through that `fetch`, so no WebSocket stub is needed today.
- The retrieval client rejects every non-loopback origin (`retrieval-client.ts:9-22`) and already uses `redirect: 'error'`.
- Leases release from `task.settled`, not `result` (`sse-response.ts:98`).
- SSE enqueues eagerly (`sse-response.ts:33-40`).
- `wireEvents`, `validateTurnEvent`, `assertTurnSequence` and a transitive import walker (`wire-contracts.test.ts:76-105`) exist.

`node_modules` is not installed in this worktree, so I could not open the cited pinned `next/dist/docs/01-app/02-guides/custom-server.md`. Task 1's compatibility gate covers that risk.

Overall the plan is thorough, honest about its limits and faithful to the accepted design. It assigns every spec requirement to an owning task. The route settlement contract, the parent/invocation split, the fixture ledger, the host-owned lifecycle channel and the HTTPS secure-context origin are well specified. Seven items still block acceptance. Each one leaves an implementer to guess something security- or acceptance-relevant:

- the order of the pipeline permit and authentication;
- what the transport does after an early refusal while the upload is still open;
- how attribution is joined across sources in production containers, and where lease observations come from;
- an incomplete Task 2 verification command;
- router behavior for draining or absent cores;
- whether the runner's phase budgets are feasible;
- the scope of the runtime and lease pools in the new core factory.

None of these needs a change of approach or a shared store.

## Findings

### R1-F001 — The plan contradicts itself on whether the pipeline permit is acquired before or after authentication

Several passages put the permit after authentication and the policy check:

- spec §6: "After authentication and policy checks, each core process has two turn-pipeline permits…";
- plan lines 357–371: in the pseudocode, `assertCoreCaller` → `assertInterfacePolicy` → `pipelines.acquire(kind)`;
- plan line 20 lists auth, then policy, then pipeline admission.

Plan line 493 says the opposite: "exactly one lifecycle registration per HTTP request and at most one acquired pipeline permit, **created in the first onRequest stage before the auth gate** and carried in request context to the raw route." The natural reading is that the permit is acquired before auth.

If an implementer follows line 493, unauthenticated callers can hold all four permits with uploads that never finish. That locks out authenticated work (a pre-auth denial of service), and it contradicts the spec. Task 2 Step 1's ordering test (lines 134–155) asserts zero body reads, provider calls and `heldTurns`. It does not assert that **pipeline permits** stay free after 401 or policy-503 refusals, so the contradiction would pass the declared tests.

### R1-F002 — Core transport behavior after a pre-body refusal is unspecified while the upload is still open

The plan requires these refusals to happen "before body": 401, policy 503, pipeline 429, and drain 503 (including on keep-alive). It never says what happens to the connection afterwards. In Node's HTTP server, as I understand current releases (not verified against pinned Node 26.8.1), a response that finishes before the request body is consumed causes the server to resume and discard the rest of the body (`req._dump()` on finish). The connection may stay open while an endless or slow upload keeps streaming. Fastify `onRequest` replies inherit this unless the route closes the socket.

Consequences:

- The spec's pre-body bounds (§5, §6) protect buffering. They do not stop an unauthenticated or refused client from holding a socket and consuming bandwidth indefinitely. No declared bound covers that socket.
- Task 3 Step 4 (line 209) requires the web side to surface early core 401/429/503 during an open multi-chunk upload "with status/envelope/retryability parity, not accidental 502". Whether undici's half-duplex fetch resolves the early response or errors depends on whether core keeps reading, closes after the response, or resets. Without a specified core behavior, that parity test is not deterministic across implementations.
- The same question applies to the private router (lines 420–430) and the TLS ingress (lines 501–503). Each sits between web and core and also relays early responses during open uploads.

### R1-F003 — The attribution join key and the per-core lease observation channel are undefined for production containers

Task 5 Step 3 (line 265) and lines 424–428 require correlating three sources:

- router records of the "actual selected upstream/container ID";
- the fixture ledger, keyed by a "replica-instance marker" / replica UUID (lines 406, 476, 511);
- "per-core lease observations".

The plan does not define either of the following:

1. **How a replica marker maps to a container ID.** It does not say who generates the marker (core at startup? the runner through non-secret env?), how the runner learns it, or how the manifest binds marker ↔ container ID ↔ private address. Without a verified binding, "forced-distinct legs actually reached distinct replicas" (line 428) compares identifiers from two unrelated namespaces. A mapping error could pass or fail the oracle silently.
2. **Where per-core lease observations come from in production images.** Line 157 confines `counts()` to in-process tests and forbids a public endpoint, and line 402 forbids test-control application routes. The plan names no sanctioned channel, such as sanitized structured logs collected by the host runner, or lease state inferred only from fixture ledger plus 429 behavior. An implementer will either add a debug endpoint, which is forbidden, or silently drop the lease leg of the oracle. Task 5 Step 5 ("measure … provider count") and Review Focus 1 ("retain its lease until settlement") both need this across real containers.

### R1-F004 — Task 2's focused verification command omits its own SDK-migration test

Line 418 says "Task 2 runs the focused SDK test alongside the existing deepgram/lease/deadline regressions". Task 2's file list (line 130) and the additional owned files (line 84) include `tests/contracts/provider-sdk-migration.test.ts`. The exact Step 5 command (line 178), however, is: `orchestrator-http`, `leases`, `deepgram`, `search-budget`, `slow/disconnect`, `slow/deadlines`. It does not include `provider-sdk-migration.test.ts`. An executor who runs Step 5 literally can commit Task 2 without the SDK abort/settlement proof the plan declares a required test.

### R1-F005 — Router behavior for draining, absent or failed scripted targets is undefined, so the 502/503 mapping is ambiguous

Spec §8 says: "The test/ingress router excludes draining cores; when none remain, API requests receive sanitized 503 … Network unreachability gives 502." It also forbids substitution: "A failed selected target yields an explicit failure."

The plan's router (lines 422–430) consumes an immutable script with no substitution, and says only that an "unavailable selected target fails explicitly". It never states:

- the status the router returns when the scripted target is draining, removed, or connection-refused;
- whether the router ever "excludes draining cores", and if so how, given that probes must not consume script entries;
- how web distinguishes "no eligible/draining" (503) from "core unreachable" (502), when its sole upstream is the router (line 422).

Task 3 Step 3 (line 208) requires both 502 and 503 outcomes. Task 4 (line 321) and Task 5 Step 5 (line 267) test "all-core drain" and core outage through web. The status depends on whether a draining core answers its own synchronous 503 (spec §8), whether the router turns a refused connection into a 502 or a 503, and whether the router passes an upstream 503 through unchanged. Leaving this open makes those acceptance assertions implementation-defined.

### R1-F006 — The runner's phase budgets are not shown to be feasible for the declared scenario inventory

Line 452 fixes Vitest at 240 s and Playwright at 240 s, both serial (line 448, one worker). Scenarios deliberately hold work across drain windows: 15 s drain plus 5 s settlement = 20 s each. Host lifecycle actions are bounded at 30 s each, with a 40 s driver wait (lines 555–557).

Vitest alone must cover at least the following:

- three-representation A/B/B runs, each with a cold replacement of A (three replacements plus readiness);
- core SIGTERM while streaming (~20 s);
- core SIGKILL plus replacement;
- web termination (~20 s);
- lookup termination;
- scale 1→2, plus 2→1 with a drain of core-b (up to ~20 s);
- policy mismatch;
- the padded-WAV direct/delegated cases;
- the SDK suite (line 448).

A plausible worst-case sum is 150–250 s before ordinary request time. The plan asserts only that "real 20-second shutdown checks fit" a single 60 s test. Because budget exhaustion is a hard failure (line 452), an infeasible budget produces nondeterministic acceptance failures that look like product defects, or pressure to trim scenarios.

### R1-F007 — `createRuntime` is a new factory, and the plan does not decide the runtime, lease-pool or pipeline-permit scope

Line 132 says `createRuntime(env, overrides?)` "retains existing adapter injection". No `createRuntime` exists today. The current design has three relevant properties:

1. `getRuntime()` memoizes a process-global runtime on `globalThis.__aivcRuntimeV1` (`runtime.ts:24-47`).
2. `LeasePools` is a process-global singleton on `globalThis.__aivcLeasePoolsV1` (`leases.ts:26-34`).
3. Adapters are cached singletons on `runtime.adapters` (`runtime.ts:58-91`).

Existing tests assert this sharing: `config.test.ts:254-268` ("keeps runtime and two-slot pools stable across module reload", `expect(second).toBe(first)`), plus `leases.test.ts` and `admission.test.ts:182-183` using the global pool.

The plan does not decide three things:

- whether core pools (leases and the new pipeline permits) stay process-global or become per-`createRuntime`/per-`createOrchestratorApp` instances;
- how the global-sharing assertions are retargeted, given the instruction to "preserve every behavioral assertion" (lines 178, 464);
- how a request-scoped `createScriptedDeps({operationId, …, replicaId})` (line 472) coexists with the cached `runtime.adapters.model` / `.speech` singletons.

This matters for correctness, not only tidiness:

- In-process tests that start several core apps, or the Task 2 checkpoint where legacy web routes and core routes run in one process, will share or split permits depending on the choice. That changes whether the "third request remains BUSY" oracles (lines 177, 396) are meaningful.
- Spec §7's "two slots of each kind per process" is the production semantic.

## Required changes

1. **R1-F001.** Rewrite line 493 to separate the two objects. The lifecycle registration is created first in `onRequest`, before the auth gate. The pipeline permit is acquired only after bearer/Host authentication and the interface-policy check pass, once per request, and is carried to the route. Add to Task 2 Step 1: with more than four never-finishing **unauthenticated** uploads, and separately policy-mismatched uploads, open concurrently, an authenticated request of each kind is still admitted and permit counters stay at zero.
2. **R1-F002.** Specify core early-refusal transport behavior for every pre-body refusal (401, policy 503, 429, drain 503). For example: respond with `Connection: close`, then end and destroy the socket within a stated bound, without draining an unbounded rejected body; or name another bounded behavior. Add a Task 2 socket test: refuse a never-ending upload and assert the socket closes within the bound, with no permit or memory growth. State the matching router and ingress relay behavior (Tasks 4–5) so Task 3 Step 4's early-refusal parity test has one defined expected outcome.
3. **R1-F003.** Define the replica attribution binding. Say who generates the replica marker, how it reaches the fixture ledger, and how the runner verifies marker ↔ container ID ↔ private address in the run manifest before tests (and again after replace/scale). Define the sanctioned per-core lease observation channel for production containers, for example sanitized structured lifecycle/lease log events captured by the host runner with bounded size, with no new application route. If no such channel is wanted, state explicitly that lease retention across containers is inferred from fixture ledger plus BUSY behavior, and adjust line 265 and Task 5 Step 5 to match.
4. **R1-F004.** Add `tests/contracts/provider-sdk-migration.test.ts` to Task 2 Step 5's exact command (line 178).
5. **R1-F005.** Define the router's response for a scripted target that is draining (pass through core's synchronous 503), absent or removed, or connection-refused/unreachable (state 502 or 503 explicitly, never substitution). Reconcile this with spec §8's "router excludes draining cores" wording: either say that exclusion means the runner's script never targets a draining core and the router does no readiness-based selection, or define the router readiness source. Then state the browser-visible status that Tasks 3–5 assert for core-draining, all-core-drained and core-unreachable.
6. **R1-F006.** Add a declared scenario inventory with a worst-case duration for each Vitest and Playwright case. Have Task 4's runner tests, or a preflight, reject an inventory whose sum exceeds its phase budget with margin. Otherwise, derive the phase budgets from that inventory and restate the 1,200 s/1,260 s global bounds.
7. **R1-F007.** In Task 2 Interfaces, state that `createRuntime` is new. Declare the scope of the runtime, lease pools and pipeline permits in core (recommended: per process in production, injectable per app instance for in-process tests). Say how `config.test.ts:254-268`, `leases.test.ts` and `admission.test.ts:182-183` are retargeted or retired with their intent preserved, and how request-scoped scripted deps replace the cached adapter singletons only in mock-script mode.

## Optional suggestions

### R1-F008 — Make the Task 5 Step 1 entry-point snippet match the declared wrapper bounds

The snippet (lines 252–259) calls `spawnSync('npm', …)` with no `timeout` or `killSignal`. Because `spawnSync` blocks the event loop, a `node:test` timeout cannot interrupt it. Line 452 requires a 1,200 s subprocess timeout and fallback teardown. Show `timeout`/`killSignal`, report signal termination (`status === null`), and invoke `node scripts/test-migration-containers.mjs` directly, or note why `npm` is kept on Windows.

### R1-F009 — Move the existing transitive walker instead of duplicating its assertion

The Task 1 Step 1 snippet repeats `wire-contracts.test.ts:72`. The meaningful regression is the existing walker (`wire-contracts.test.ts:76-105`), which currently roots at `apps/web/shared`. Say explicitly that it moves into `workspace-boundaries.test.ts` and is re-rooted on the package's export closure, so the old walker does not end up passing vacuously over an empty directory.

### R1-F010 — Name the producer conversion in Task 2 Step 3

`turnResponse` enqueues every `runTurn` event without checking `desiredSize` (`sse-response.ts:33-40,84-90`). Gating `pumpResponse` on `write(false)`/`drain` does not stop that producer, because the queue grows inside the `ReadableStream` instead. Line 468 implies the fix ("Gate producer demand"). Stating in Step 3 that the moved turn producer pulls the next `runTurn` event only on stream demand would make the Review Focus 2 test target explicit.

## Decision

revisions-requested
