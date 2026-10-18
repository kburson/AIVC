# Story #64 portable-core decomposition plan

> **For agentic workers:** Use the owner-selected execution method and applicable task skills at future pickup. Checklist steps below are planning obligations. This revision authorizes no application implementation.

**Goal:** Deliver accepted migration Task 2 through 7 independently testable stories below four hours each.

**Architecture:** The accepted three-service architecture is unchanged. #64 becomes a nested coordination epic under #40; its leaves integrate serially into its recorded branch before the package integrates into `codex/40-draft`.

**Tech Stack:** Existing pinned Node/TypeScript/ESM, Fastify, Next.js, Vitest, Playwright and Docker Compose.

**Spec:** [Accepted migration design](../specs/2026-10-16-40-stateless-service-migration-design.md). Read it and the entire accepted [migration plan](2026-10-16-40-stateless-service-migration.md), especially Task 2 and all assigned later corrections.

**Status:** Owner-requested sizing reassessment on October 17, 2026 (America/Chicago), after #63 governed Done and merged PR69. New decomposition; no renewed peer acceptance or Plan approval. All new stories remain Backlog. The old 16h package estimate stays historical; the new leaf sum is 23.5h and requires JIT forecast convergence.

## Source authority

Accepted design: `docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md`, publication `e6e96c9a4f07bb78faa73dc56368a0503d912982`, SHA-256 `f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`, XPR `review-0009efb5ca6886291ad48628afa78120`.

Accepted implementation plan: `docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md`, publication `80efe1a150dbd8605aab69678c2a7a87f8553072`, SHA-256 `eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`, XPR `review-3f99142a6b19c9dcbe0e6e53c7b1354a`. Both retain LOCAL JOURNAL MODE / accepted-uncommitted / assurance unavailable and separate exact-byte Git publication. The uncertain predecessor `review-2bdf5dd8ee56accc6e494643054a3cf1` remains unsettled. No acceptance transfers to this supplement.

Every original SAR/XPR, #39 predecessor and later unreviewed-amendment reference remains in [the preserved original decomposition lineage](2026-10-17-40-stateless-service-migration-decomposition.md#preserved-artifact-and-review-lineage), publication `86927fedfdd9741bb936c80223577b19e7387235` (original intake `22aee3f4c06293f164e2b5f8fd442ff6ca332c1d`). Neither that supplement nor either accepted artifact is edited.

## Story Intent

- **Beneficiary:** service operator
- **Capability:** run the existing voice provider pipeline behind a portable authenticated HTTP service
- **Need:** Next.js currently owns provider execution and request settlement
- **Value or failure prevented:** backend capacity can scale without duplicating the web client or releasing unsettled paid work

## Global Constraints

- Planning and backlog decomposition only. No application implementation, paid call, deployment, benchmark or research unblocking is authorized by this revision.
- Read the full accepted task and every later assigned correction, not only this summary. Preserve accepted bytes, historical evidence, Unknown values and review provenance.
- Each leaf has a joint-effort budget strictly below 4h, including ordinary implementation, tests, code review, CI/delivery and contingency. Budgets are planning estimates, not promises of elapsed time or AI forecasts. At JIT Plan, split again rather than approve any leaf that cannot fit below 4h; never just lower its estimate.
- Use pinned Node 26.8.1 / npm 12.0.2 / Next 16.4.0 / Fastify 5.12.5 and current SDK versions; no application dependency upgrade.
- Preserve multipart text/WAV, JSON text/speech, version1 SSE/PCM/errors/usage, exact body/text/history/segment limits and browser-safe contracts.
- Lifecycle registration precedes Host/bearer, policy and two-per-kind nonqueued pre-body pipeline admission; paid leases follow validation and remain held with permits until actual settlement.
- No history/session store, sticky affinity, remote cancellation-by-ID, global deduplication or automatic paid replay. IDs correlate and never authenticate.
- Application queues<=64KiB plus one<=16KiB chunk per hop; measure original producer allocations, parser/framework/socket buffers separately. All deadlines include upload and never renew per chunk.
- Local health/readiness never depend on peers. SIGTERM withdraws readiness synchronously, refuses new/keep-alive work, drains 15s then allows 5s cleanup; stop grace>=25s. Unsettled hard exit remains unknown.
- Only mock/local real-SDK protocol stubs, valueless credentials and denied external provider egress. No secret-bearing logs, machine-local bindings or raw live user data in cloud artifacts.
- Every leaf retains independent native Refine/Plan approval/Develop/Test/Review/approval/delivery/Close gates. Keep fetchable branches and draft PRs at pickup; nested leaves target the recorded coordination branch, which later targets codex/40-draft. No duplicate PR or branch is needed for intake-only Backlog.
- Within each package, the first leaf depends on the previous package reaching governed Done, later leaves depend on their preceding leaf. No parallel execution or gate skipping. Coordination epics carry aggregate scope and are not executable stories under the 4h ceiling.

## Review Focus

- Distinguish completed upload from actual response disconnect; join cancellation and pending reader cleanup before releasing resources.
- A slow reader or oversized producer allocation cannot be hidden by stream high-water marks or slice views.
- Admission and policy refusal must retain status/retryability during an endless upload at every delivered hop.
- Missing source/image/container/fixture attribution or prerequisites must fail rather than produce a skipped success.
- Hard exit, delayed settlement and uncertain reviews retain their actual unknown or unsettled state; no replay or invented acceptance.

### Task 1: Move runtime ownership and private lookup policy

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** own one shared runtime and resource context in the portable service
- **Need:** web currently owns cached provider configuration and loopback-only lookup
- **Value or failure prevented:** multiple core app instances share the same bounded resources without duplicated executable providers

#### Scope and acceptance boundary

Accepted migration Task 2, bounded slice 1. Joint estimate **3h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 1.75h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Move the actual runtime/config/providers/tools into the core workspace with temporary single-source compatibility re-exports; no copied implementation or dependency upgrade.
- Preserve getRuntime/getLeasePools/module-reload identities, shared default two-per-kind pools and explicit complete isolated ResourceContext injection.
- Replace loopback-only lookup with exact configured private origin and fixed lookup-projects endpoint from the accepted plan; reject redirects, userinfo, query, fragment and caller-selected origins.

**Owned files:** `apps/orchestrator/src/runtime.ts`, `apps/orchestrator/src/config.ts`, `apps/orchestrator/src/tools/`, `apps/web/server/runtime.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Accepted #63 contracts and predecessor package #63 governed Done; original accepted interfaces and corrections remain authoritative.

**Produces:** own one shared runtime and resource context in the portable service; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/config.test.ts tests/contracts/leases.test.ts tests/contracts/search-budget.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 2: Enforce core authentication and pre-body pipeline admission

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** refuse unauthorized or excess uploads before they consume pipeline resources
- **Need:** a portable HTTP entry can otherwise parse untrusted bodies before admission
- **Value or failure prevented:** slow or unauthenticated callers cannot create unbounded body or provider work

#### Scope and acceptance boundary

Accepted migration Task 2, bounded slice 2. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Add createOrchestratorApp and lifecycle registration before Host/bearer, then interface-policy checks, then exactly one immediate pipeline permit before any parser/body read.
- Enforce two turn and two speech permits with no queue, no paid lease before validation and sanitized 401/429/503; capabilities expose the private policy digest.
- Use never-ending unauthorized, mismatched-policy and third-upload socket controls; all rejection paths and factory failure finish registry entries without provider calls.

**Owned files:** `apps/orchestrator/src/http/app.ts`, `apps/orchestrator/src/http/auth.ts`, `apps/orchestrator/src/http/pipeline.ts`, `apps/orchestrator/src/http/interface-policy.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 1 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** refuse unauthorized or excess uploads before they consume pipeline resources; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/orchestrator-http.test.ts tests/contracts/admission.test.ts tests/contracts/interface-policy.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 3: Deliver pull-driven turn operations and SSE settlement

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** stream turn output without releasing unfinished provider work
- **Need:** response completion does not establish provider and reader settlement
- **Value or failure prevented:** a slow or disconnected client cannot grow an eager queue or prematurely free paid capacity

#### Scope and acceptance boundary

Accepted migration Task 2, bounded slice 3. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Implement synchronous beginTurn OperationHandle with separate response, settled and idempotent abort; join body/producer/read/cancellation promises.
- Gate the actual producer on demand, split/copy oversized chunks and bound application queues to 64KiB plus one at-most-16KiB chunk; measure original allocation separately.
- Retain deadline result versus settled, paid lease and pipeline permit until actual cleanup; preserve multipart/JSON/history/SSE/usage, once-only terminal and valid completed-upload behavior.

**Owned files:** `apps/orchestrator/src/http/request.ts`, `apps/orchestrator/src/http/response.ts`, `apps/orchestrator/src/http/pump.ts`, `apps/orchestrator/src/turns/run-turn.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 2 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** stream turn output without releasing unfinished provider work; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/orchestrator-http.test.ts tests/slow/disconnect.test.ts tests/slow/deadlines.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 4: Deliver speech operations and exact PCM cleanup

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** stream speech with bounded cancellation and lease ownership
- **Need:** closing a PCM response can leave a synthesis reader active
- **Value or failure prevented:** speech bytes stay compatible and a busy slot is held until actual synthesis cleanup

#### Scope and acceptance boundary

Accepted migration Task 2, bounded slice 4. Joint estimate **3h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 1.75h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Implement beginSpeech with the same OperationHandle ownership and separate response-pump settlement; retain two speech permits/paid slots through deferred reader cleanup.
- Preserve 8192-byte whole body, configured independent segment-character cap, 24kHz mono s16le bytes/headers and sanitized pre-header versus incomplete post-header errors.
- Test slow reader, disconnect after completed upload, abort during drain, late EOF/rejection and no appended diagnostics or extra terminal.

**Owned files:** `apps/orchestrator/src/http/speech-response.ts`, `apps/orchestrator/src/http/pump.ts`, `apps/orchestrator/src/providers/`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 3 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** stream speech with bounded cancellation and lease ownership; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/speech-endpoint.test.ts tests/contracts/leases.test.ts tests/slow/disconnect.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 5: Add request-scoped scripted adapters and invocation identity

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** observe each mock provider invocation independently of caller IDs
- **Need:** cached adapters can leak request context or collapse multi-round work
- **Value or failure prevented:** duplicate callers and later tool rounds remain attributable without implying deduplication or replay

#### Scope and acceptance boundary

Accepted migration Task 2, bounded slice 5. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Implement mock-only createScriptedDeps with fresh internal parent UUID and per-STT/model-round/TTS invocation IDs; keep cached ordinary adapters free of request context.
- Freeze and validate data/cancellation protocol on adapter and local fixture helper; live mode refuses script config, fixed private origin/paths and no redirect or caller-selected endpoint.
- Join reader cleanup and authenticated cancellation acknowledgement; cap decoded WAV 2097152, canonical base64 field 2796204, metadata 65536, wire 3145728; preserve legal padded WAV and actual lookup/tool loop.

**Owned files:** `apps/orchestrator/src/providers/scripted.ts`, `apps/orchestrator/src/runtime.ts`, `tests/fixtures/migration-provider/schema.mjs`, `tests/helpers/scripted-provider-server.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 4 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** observe each mock provider invocation independently of caller IDs; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/provider-sdk-migration.test.ts tests/contracts/fixture-schema.test.ts tests/contracts/deepgram.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 6: Verify moved SDK abort and reader behavior against local protocols

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** verify actual STT model and speech SDK cleanup without paid requests
- **Need:** scripted application adapters alone cannot prove real SDK reader semantics
- **Value or failure prevented:** migration retains provider-adapter behavior while all external paid egress stays disabled

#### Scope and acceptance boundary

Accepted migration Task 2, bounded slice 6. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Exercise the actual pinned STT/model/TTS adapter and SDK modules through isolated HTTP/WebSocket stubs and valueless credentials.
- Cover normal format/usage, abort before result, abort after chunk, delayed EOF/rejection and cleanup-before-settlement for every adapter; missing stub compatibility fails.
- Interleave parents and multiple tool/model rounds to detect context/abort leakage; preserve supported endpoint injection or a narrowly test-owned construction seam.

**Owned files:** `tests/contracts/provider-sdk-migration.test.ts`, `tests/fixtures/provider-protocol-stubs/server.mjs`, `apps/orchestrator/src/providers/`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 5 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** verify actual STT model and speech SDK cleanup without paid requests; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/provider-sdk-migration.test.ts tests/contracts/deepgram.test.ts tests/contracts/leases.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 7: Verify core refusal bounds and lifecycle ownership on real sockets

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** bound early refusal and retain active work through actual cancellation
- **Need:** endless uploads and late cancellation can hide resource leaks behind closed responses
- **Value or failure prevented:** a rejected caller receives the real error and shutdown never calls unsettled work drained

#### Scope and acceptance boundary

Accepted migration Task 2, bounded slice 7. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Flush original sanitized 401/429/503 error during ongoing upload; close/settle transport within 1000ms, no unbounded drain, including stalled-reader incomplete outcome.
- Use real route plus lifecycle oracle: occupy both slots, close/timeout responses, defer cancellation, prove third request BUSY and registry retained until gates settle exactly once.
- Exercise validation/factory failures and upload completion versus real response loss; preserve compatibility seams and run the complete Task2 focused matrix before core coordination closes.

**Owned files:** `apps/orchestrator/src/http/app.ts`, `apps/orchestrator/src/lifecycle.ts`, `tests/contracts/orchestrator-http.test.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 6 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** bound early refusal and retain active work through actual cancellation; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/orchestrator-http.test.ts tests/contracts/provider-sdk-migration.test.ts tests/contracts/config.test.ts tests/contracts/leases.test.ts tests/contracts/admission.test.ts tests/contracts/deepgram.test.ts tests/contracts/search-budget.test.ts tests/slow/disconnect.test.ts tests/slow/deadlines.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

## Coverage and semantic self-review

The union of these slices retains the original package Scope and ACs and every assigned accepted correction. The coordination epic's original body/reviews remain the aggregate oracle. Each leaf names an operational beneficiary, distinct capability, source-grounded gap and avoided failure; the seven story-quality questions were reviewed against original Scope/ACs, source plan and siblings. No test result or code acceptance is claimed by writing this supplement. Review the master #40 coverage map before pickup.
