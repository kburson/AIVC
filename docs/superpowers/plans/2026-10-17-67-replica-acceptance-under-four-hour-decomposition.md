# Story #67 replica-acceptance decomposition plan

> **For agentic workers:** Use the owner-selected execution method and applicable task skills at future pickup. Checklist steps below are planning obligations. This revision authorizes no application implementation.

**Goal:** Deliver accepted migration Task 5 through 7 independently testable stories below four hours each.

**Architecture:** The accepted three-service architecture is unchanged. #67 becomes a nested coordination epic under #40; its leaves integrate serially into its recorded branch before the package integrates into `codex/40-draft`.

**Tech Stack:** Existing pinned Node/TypeScript/ESM, Fastify, Next.js, Vitest, Playwright and Docker Compose.

**Spec:** [Accepted migration design](../specs/2026-10-16-40-stateless-service-migration-design.md). Read it and the entire accepted [migration plan](2026-10-16-40-stateless-service-migration.md), especially Task 5 and all assigned later corrections.

**Status:** Owner-requested sizing reassessment on October 17, 2026 (America/Chicago), after #63 governed Done and merged PR69. New decomposition; no renewed peer acceptance or Plan approval. All new stories remain Backlog. The old 14h package estimate stays historical; the new leaf sum is 24h and requires JIT forecast convergence.

## Source authority

Accepted design: `docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md`, publication `e6e96c9a4f07bb78faa73dc56368a0503d912982`, SHA-256 `f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`, XPR `review-0009efb5ca6886291ad48628afa78120`.

Accepted implementation plan: `docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md`, publication `80efe1a150dbd8605aab69678c2a7a87f8553072`, SHA-256 `eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`, XPR `review-3f99142a6b19c9dcbe0e6e53c7b1354a`. Both retain LOCAL JOURNAL MODE / accepted-uncommitted / assurance unavailable and separate exact-byte Git publication. The uncertain predecessor `review-2bdf5dd8ee56accc6e494643054a3cf1` remains unsettled. No acceptance transfers to this supplement.

Every original SAR/XPR, #39 predecessor and later unreviewed-amendment reference remains in [the preserved original decomposition lineage](2026-10-17-40-stateless-service-migration-decomposition.md#preserved-artifact-and-review-lineage), publication `86927fedfdd9741bb936c80223577b19e7387235` (original intake `22aee3f4c06293f164e2b5f8fd442ff6ca332c1d`). Neither that supplement nor either accepted artifact is edited.

## Story Intent

- **Beneficiary:** service operator
- **Capability:** verify later voice requests and interruptions across independently selected replicas
- **Need:** local single-replica tests cannot establish stateless routing or shutdown behavior
- **Value or failure prevented:** replacements and scaling do not hide affinity lost work or automatic paid replay

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

### Task 1: Add the mandatory container acceptance entry point

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** fail explicitly when production acceptance prerequisites or execution are absent
- **Need:** a wrapper can otherwise pass after skipping missing Docker images or browser tooling
- **Value or failure prevented:** no incomplete topology or timed-out child process is credited as accepted software

#### Scope and acceptance boundary

Accepted migration Task 5, bounded slice 1. Joint estimate **3h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 1.75h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Implement the exact Node wrapper→direct runner command graph and test:migration:containers alias, process.execPath,1860s wrapper/1800s child and owned30s fallback teardown.
- Probe Docker/Compose/build/source-image identity/Chromium, fail nonzero on missing prerequisites, no silent skip/recursive dispatch.
- Test wrapper contract with controlled process outcomes and existing runner tests; actual full entry point is deliberately not credited until the last acceptance slice supplies the complete closed inventory.

**Owned files:** `tests/contracts/stateless-services.test.mjs`, `scripts/test-migration-containers.mjs`, `package.json`, `tests/scripts/migration-runner.test.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Accepted #63 contracts and predecessor package #66 governed Done; original accepted interfaces and corrections remain authoritative.

**Produces:** fail explicitly when production acceptance prerequisites or execution are absent; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/scripts/migration-runner.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 2: Prove A B B routing and cold replacement for every turn representation

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** continue speech and explicit-history turns on a different or replaced core
- **Need:** single-replica tests cannot establish request-carried state
- **Value or failure prevented:** multipart text WAV and JSON requests work without affinity or hidden session storage

#### Scope and acceptance boundary

Accepted migration Task 5, bounded slice 2. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Implement real-container multipart text/WAV/JSON A→B→B plus cold-A replacement through deterministic router and explicit direct controls.
- Join actual router upstream, fixture parent/invocation and core lease events; verify exact histories/speech inputs and immutable catalog/contract/policy identities.
- Add same-replica/missing/ambiguous/corrupt attribution negative controls that really fail the oracle; read-only filesystems and no session volume remain required.

**Owned files:** `tests/integration/stateless-services.test.ts`, `tests/helpers/migration-topology.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 1 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** continue speech and explicit-history turns on a different or replaced core; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run --config vitest.migration.config.ts -t 'replica-state-'`

Run: `npm run typecheck`

Run: `npm run build`

### Task 3: Prove invocation counts SDK parity and padded WAV in containers

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** observe actual STT tool and synthesis work across independent requests
- **Need:** collapsed fixture calls can hide duplicate or replayed paid-capable invocations
- **Value or failure prevented:** duplicate caller IDs remain independent and ambiguous responses never cause automatic replay

#### Scope and acceptance boundary

Accepted migration Task 5, bounded slice 3. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Cover audioSTT→model,2/3model rounds with actual lookup continuation, later-round cancellation and duplicate caller IDs using exact started/cancel-requested/settled counts.
- Repeat compiled actual adapter/SDK stub matrix in the single accepted Vitest selection; label adapter-level evidence separately from full application paths.
- Repeat1600000-byte legal ancillary-padded and near-multipart-cap WAV direct/delegated digest/length cases, all wire/metadata/base64 negatives,404 cancellation-by-ID and zero ambiguous resubmission.

**Owned files:** `tests/integration/stateless-services.test.ts`, `tests/contracts/provider-sdk-migration.test.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 2 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** observe actual STT tool and synthesis work across independent requests; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run --config vitest.migration.config.ts -t 'provider-parity-'`

Run: `npm run typecheck`

Run: `npm run build`

### Task 4: Prove real browser generation fencing and exact-owner interruption

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** start a new generation while ignoring delayed output from interrupted streams
- **Need:** proxy cancellation alone does not prevent stale client audio or history updates
- **Value or failure prevented:** the real controller and speech queue cannot play or retain an obsolete generation

#### Scope and acceptance boundary

Accepted migration Task 5, bounded slice 4. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Use trusted production HTTPS topology and actual controller/queue for typed and voiced interruption across Aturn/Bspeech and next-generation other replica.
- Gate old output and cancellation acknowledgement, assert every active old stream reaches its actual owner and stale output never enters playback/history.
- Cover secure bootstrap/capabilities without router-script consumption; no test client recreates missing server behavior or legacy launcher fallback.

**Owned files:** `tests/browser/stateless-interruption.spec.ts`, `playwright.migration.config.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 3 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** start a new generation while ignoring delayed output from interrupted streams; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx playwright test --config playwright.migration.config.ts -g 'generation-'`

Run: `npm run typecheck`

Run: `npm run build`

### Task 5: Prove admission pressure policy and outage behavior through every hop

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** retain bounded resources and usable static UI under slow or unavailable dependencies
- **Need:** passing a direct transport test does not establish the same bounds through router web and ingress
- **Value or failure prevented:** overload and policy mismatch refuse before paid work while unrelated UI remains ready

#### Scope and acceptance boundary

Accepted migration Task 5, bounded slice 5. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Repeat endless-upload early401/429/503/error-flush<=1000ms through directcore/router/BFF/HTTPS; stalled reader closes explicitly incomplete rather than fabricated success.
- Measure two-per-kind pipeline lockout/recovery, producer allocations/bounds, slow-reader and delayed cancellation with retained leases; auth/policy/body ordering and zero calls remain observable.
- Deliberate timeout/segment policy mismatch and invalid topology fail; core/lookup outage/all-core drain produce declared502/503/504 while local readiness/static UI survive without restart or paid probe.

**Owned files:** `tests/integration/stateless-services.test.ts`, `tests/browser/stateless-interruption.spec.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 4 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** retain bounded resources and usable static UI under slow or unavailable dependencies; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run --config vitest.migration.config.ts -t 'resource-boundary-'`

Run: `npx playwright test --config playwright.migration.config.ts -g 'outage'`

Run: `npm run typecheck`

Run: `npm run build`

### Task 6: Prove graceful listener shutdown and unknown settlement

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** observe bounded graceful termination of all real service listeners
- **Need:** unit lifecycle clocks cannot prove container signals or live keep-alive behavior
- **Value or failure prevented:** shutdown withdraws readiness and distinguishes actual cleanup from unknown work

#### Scope and acceptance boundary

Accepted migration Task 5, bounded slice 6. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Use acknowledged exact-host SIGTERM for core, web while forwarding and lookup while tools run; verify immediate readiness withdrawal/new keep-alive refusal.
- Observe15s drain then 5s abort/settlement window and >=25s stop grace using actual streams/provider gates; late cleanup retains resources and hard-bound unknown is explicit.
- Preserve original error/PCM/SSE semantics, surviving ledgers, zero replay and bounded teardown; no guessed sleep substitutes for host acknowledgement.

**Owned files:** `tests/integration/stateless-services.test.ts`, `tests/helpers/migration-topology.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 5 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** observe bounded graceful termination of all real service listeners; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run --config vitest.migration.config.ts -t 'graceful-lifecycle-'`

Run: `npm run typecheck`

Run: `npm run build`

### Task 7: Prove hard kill scaling and the complete production acceptance inventory

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** replace or scale only the intended core and retain complete acceptance evidence
- **Need:** a hard kill or membership change can hide lost work or duplicate peer containers
- **Value or failure prevented:** surviving replicas do not replay work and every required case executes on the declared topology

#### Scope and acceptance boundary

Accepted migration Task 5, bounded slice 7. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Gate a real stream then acknowledgedSIGKILL of exact owner, inspect surviving fixture started-but-unsettled evidence, replace and continue with zero surviving-core replay.
- Perform real1→2→1, retain identical core-a/web/lookup and modify only core-b; validate before/after membership/idempotence and stale/corrupt negatives.
- Run the mandatory full Node entry point with all 15 Vitest / 4 Playwright cases, exact SDK selection/counts, actual durations and owned cleanup; no omitted case or partial selection satisfies this story.

**Owned files:** `tests/integration/stateless-services.test.ts`, `tests/helpers/migration-topology.ts`, `tests/contracts/stateless-services.test.mjs`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 6 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** replace or scale only the intended core and retain complete acceptance evidence; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `node --test tests/contracts/stateless-services.test.mjs`

Run: `npm run typecheck`

Run: `npm run build`

## Focused scenario names

Future acceptance case names use the explicit prefixes in each focused command: replica-state-, provider-parity-, generation-, resource-boundary- and graceful-lifecycle-. Include every positive and negative assertion assigned to that slice under its prefix. These focused selections do not replace the final runner’s complete closed inventory.

## Coverage and semantic self-review

The union of these slices retains the original package Scope and ACs and every assigned accepted correction. The coordination epic's original body/reviews remain the aggregate oracle. Each leaf names an operational beneficiary, distinct capability, source-grounded gap and avoided failure; the seven story-quality questions were reviewed against original Scope/ACs, source plan and siblings. No test result or code acceptance is claimed by writing this supplement. Review the master #40 coverage map before pickup.
