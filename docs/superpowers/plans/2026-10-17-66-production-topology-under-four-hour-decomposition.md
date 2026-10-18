# Story #66 production-topology decomposition plan

> **For agentic workers:** Use the owner-selected execution method and applicable task skills at future pickup. Checklist steps below are planning obligations. This revision authorizes no application implementation.

**Goal:** Deliver accepted migration Task 4 through 8 independently testable stories below four hours each.

**Architecture:** The accepted three-service architecture is unchanged. #66 becomes a nested coordination epic under #40; its leaves integrate serially into its recorded branch before the package integrates into `codex/40-draft`.

**Tech Stack:** Existing pinned Node/TypeScript/ESM, Fastify, Next.js, Vitest, Playwright and Docker Compose.

**Spec:** [Accepted migration design](../specs/2026-10-16-40-stateless-service-migration-design.md). Read it and the entire accepted [migration plan](2026-10-16-40-stateless-service-migration.md), especially Task 4 and all assigned later corrections.

**Status:** Owner-requested sizing reassessment on October 17, 2026 (America/Chicago), after #63 governed Done and merged PR69. New decomposition; no renewed peer acceptance or Plan approval. All new stories remain Backlog. The old 16h package estimate stays historical; the new leaf sum is 26.5h and requires JIT forecast convergence.

## Source authority

Accepted design: `docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md`, publication `e6e96c9a4f07bb78faa73dc56368a0503d912982`, SHA-256 `f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`, XPR `review-0009efb5ca6886291ad48628afa78120`.

Accepted implementation plan: `docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md`, publication `80efe1a150dbd8605aab69678c2a7a87f8553072`, SHA-256 `eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`, XPR `review-3f99142a6b19c9dcbe0e6e53c7b1354a`. Both retain LOCAL JOURNAL MODE / accepted-uncommitted / assurance unavailable and separate exact-byte Git publication. The uncertain predecessor `review-2bdf5dd8ee56accc6e494643054a3cf1` remains unsettled. No acceptance transfers to this supplement.

Every original SAR/XPR, #39 predecessor and later unreviewed-amendment reference remains in [the preserved original decomposition lineage](2026-10-17-40-stateless-service-migration-decomposition.md#preserved-artifact-and-review-lineage), publication `86927fedfdd9741bb936c80223577b19e7387235` (original intake `22aee3f4c06293f164e2b5f8fd442ff6ca332c1d`). Neither that supplement nor either accepted artifact is edited.

## Story Intent

- **Beneficiary:** service operator
- **Capability:** start scale and terminate each production service independently
- **Need:** the current launcher and container lifecycle cannot prove independent stateless operation
- **Value or failure prevented:** capacity changes and shutdowns preserve bounded cleanup and explicit interruption outcomes

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

### Task 1: Implement local service readiness and bounded drain

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** terminate each service without misreporting unfinished work
- **Need:** local health and actual settlement are distinct from dependency availability
- **Value or failure prevented:** shutdown is finite and preserves explicit unknown outcomes without replay

#### Scope and acceptance boundary

Accepted migration Task 4, bounded slice 1. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Complete shared Lifecycle registration/finish ownership; SIGTERM synchronously withdraws readiness and refuses keep-alive before15s drain then 5s abort cleanup.
- Core/lookup Fastify and actual Next listener use owned controllers/settled promises; hard exit records interrupted/settlement-unknown without early lease release or replay.
- Local liveness/readiness never depend on peers; optional diagnostics coalesce/cache5s/timeout1s with no paid probe/retry; missing caller token and invalid local policy refuse startup, mock needs no paid keys.

**Owned files:** `apps/orchestrator/src/lifecycle.ts`, `apps/retrieval/src/lifecycle.ts`, `apps/retrieval/src/index.ts`, `apps/web/app/health/route.ts`, `apps/web/app/ready/route.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Accepted #63 contracts and predecessor package #65 governed Done; original accepted interfaces and corrections remain authoritative.

**Produces:** terminate each service without misreporting unfinished work; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/service-lifecycle.test.ts tests/contracts/next-server-lifecycle.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 2: Package three independent pinned production services

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** deploy web core and lookup as independently scalable production containers
- **Need:** a shared development launcher cannot prove production isolation
- **Value or failure prevented:** scaling core preserves the web and lookup services and immutable build identity

#### Scope and acceptance boundary

Accepted migration Task 4, bounded slice 2. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Build three pinned multistage non-root/read-only images with production assets and no source bind mount/latest/dev server; no dependency upgrades.
- Bind web3000/core3002/lookup3001 explicitly on container-private0.0.0.0; expose only web, configure exact private origins and shared interface-policy input.
- Declare CPU/memory/connections/ephemeral mounts/stop grace>=25s and source/image/contract/catalog/config/policy digests; prove real inter-container lookup and delegation.

**Owned files:** `deploy/web.Dockerfile`, `deploy/orchestrator.Dockerfile`, `deploy/lookup.Dockerfile`, `deploy/compose.yaml`, `.dockerignore`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 1 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** deploy web core and lookup as independently scalable production containers; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/service-lifecycle.test.ts`

Run: `npm run build`

Run: `npm run typecheck`

Run: `npm run build`

### Task 3: Build the private provider fixture and surviving invocation ledger

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** retain provider observations after a core dies or is replaced
- **Need:** in-process mock logs disappear with the request owner
- **Value or failure prevented:** hard-kill outcomes and invocation counts remain observable without storing application sessions

#### Scope and acceptance boundary

Accepted migration Task 4, bounded slice 3. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Implement the previously frozen data/cancellation protocol and bounded append-only monotonic ledger outside core; fixture death invalidates run.
- Separate adapter data/cancel credentials from runner-only script/control/ledger authority on private networks with no application control routes or external proxy.
- Provide bounded input/chunk/EOF/failure/cancel-ack gates and actual model/tool-round/STT/TTS events; retain original wire/raw/base64/metadata caps and padded-WAV acceptance.

**Owned files:** `tests/fixtures/migration-provider/server.mjs`, `tests/fixtures/migration-provider/schema.mjs`, `deploy/migration-provider.Dockerfile`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 2 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** retain provider observations after a core dies or is replaced; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/fixture-schema.test.ts tests/contracts/provider-sdk-migration.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 4: Route each accepted request deterministically with independent attribution

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** select a declared replica per application request and audit the actual target
- **Need:** TCP keep-alive can obscure whether later requests reached a distinct core
- **Value or failure prevented:** cross-replica evidence detects affinity and missing or corrupted routing observations

#### Scope and acceptance boundary

Accepted migration Task 4, bounded slice 4. Joint estimate **3h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 1.75h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Build private stateless L7 per-request ordered routing; probes/capabilities do not consume script; keep-alive cannot alter selection.
- Forbid retries/redirects/failed-target substitution, preserve bounded duplex early refusal/backpressure/abort, and expose bounded runner-only closed control schema.
- Log actual selected private upstream address for independent fixture/lease correlation; test two real local servers, script ordering and corrupt/missing observations.

**Owned files:** `tests/fixtures/migration-router/server.mjs`, `tests/fixtures/migration-router/schema.mjs`, `deploy/migration-router.Dockerfile`, `tests/contracts/migration-router.test.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 3 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** select a declared replica per application request and audit the actual target; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/migration-router.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 5: Provide trusted HTTPS browser ingress and isolated test topology

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** exercise the real browser under a trustworthy production HTTPS origin
- **Need:** a development fallback cannot prove production forwarding and browser bootstrap
- **Value or failure prevented:** container acceptance includes the real thin web path without paid egress or exposed core

#### Scope and acceptance boundary

Accepted migration Task 4, bounded slice 5. Joint estimate **3h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 1.75h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Add pinned trusted-TLS ingress/Chromium certificate setup, real production web/core/lookup plus separately budgeted fixture/router/driver.
- Disable proxy buffering/request buffering/compression/retries and bound lingering close1s; declare private plaintext hop and ingress resources/costs.
- Use internal data/control networks, no paid credentials/external provider egress or Docker socket in driver; validate browser URL/topology rather than fall back to localhost/dev.

**Owned files:** `deploy/migration-ingress.Dockerfile`, `tests/fixtures/migration-ingress/nginx.conf`, `deploy/compose.migration-test.yaml`, `playwright.migration.config.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 4 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** exercise the real browser under a trustworthy production HTTPS origin; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/service-lifecycle.test.ts tests/contracts/migration-router.test.ts`

Run: `npm run build`

Run: `npm run typecheck`

Run: `npm run build`

### Task 6: Implement the acknowledged host-only lifecycle channel

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** request exact owned replica lifecycle actions with verified acknowledgements
- **Need:** guessed sleeps and unverified container identities cannot prove kill replacement or scale
- **Value or failure prevented:** only the intended owned core changes while peer containers remain identical

#### Scope and acceptance boundary

Accepted migration Task 4, bounded slice 6. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Implement accepted closed driver-host request/ack schema, exact run/project/container/image/peer identity checks, bounded records/actions/deadlines and idempotent acknowledgements.
- Only allowed fixed host actions can SIGTERM/SIGKILL/replace/scale; no caller-specified shell/image/service override, no Docker socket in driver.
- Validate1→2 core-b: null,2→1 exact both IDs,same-count no-op; refuse stale/foreign/conflicting/extra membership and absent-target actions; preserve before/after membership and peer identity.

**Owned files:** `scripts/test-migration-containers.mjs`, `tests/helpers/migration-topology.ts`, `tests/scripts/migration-runner.test.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 5 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** request exact owned replica lifecycle actions with verified acknowledgements; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

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

### Task 7: Bound runner dispatch budgets and owned teardown

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** finish or fail an offline acceptance run with verified cleanup
- **Need:** nested launchers and renewable phase timers can outlive the declared run
- **Value or failure prevented:** timeouts signals and partial startup cannot leave unowned resources or report a skipped success

#### Scope and acceptance boundary

Accepted migration Task 4, bounded slice 7. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Implement unique run UUID/Compose ownership manifest before resource creation; guarded cleanupOwnedMigrationRun import never launches topology.
- Use nonrecursive direct process dispatch: global 1800s / wrapper 1860s; build 600 / readiness 90 / Vitest 780 / browser 240 / teardown 30 / reserve 60 seconds; each phase/action obeys remaining global/case time.
- Use fake spawn to prove exact config/argv, signal/timeout/failure cleanup, no wrapper reentry, one browser worker/retries0/forbidOnly/no webServer and explicit missing-prerequisite failures.

**Owned files:** `scripts/test-migration-containers.mjs`, `tests/scripts/migration-runner.test.ts`, `vitest.migration.config.ts`, `playwright.migration.config.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 6 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** finish or fail an offline acceptance run with verified cleanup; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

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

### Task 8: Freeze scenario inventory and topology identity manifest

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** reject incomplete or mismatched acceptance topology before crediting results
- **Need:** successful subprocess exits do not prove all required cases or image identities ran
- **Value or failure prevented:** the accepted evidence covers the closed scenario set and actual source image and resource mapping

#### Scope and acceptance boundary

Accepted migration Task 4, bounded slice 8. Joint estimate **3h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 1.75h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Freeze all 15 Vitest / 4 Playwright case IDs and maxima from accepted plan (610<=624 and160<=192); reject missing/duplicate/extra/skipped selections and overbudget inventory.
- Verify clean source→build/image digest and actual instance/container/IP bindings, contract/catalog/config/policy eligibility and resource/parser/queue/socket observations.
- Emit sanitized per-selection/per-case start/end/exit/count/duration and control-channel observations; partial future case implementations cannot claim full production acceptance until #67 all cases exist.

**Owned files:** `tests/fixtures/migration-scenarios.json`, `docs/evidence/40-migration-manifest.json`, `deploy/interface-policy.json`, `tests/scripts/migration-runner.test.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 7 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** reject incomplete or mismatched acceptance topology before crediting results; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/scripts/migration-runner.test.ts tests/contracts/service-lifecycle.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

## Coverage and semantic self-review

The union of these slices retains the original package Scope and ACs and every assigned accepted correction. The coordination epic's original body/reviews remain the aggregate oracle. Each leaf names an operational beneficiary, distinct capability, source-grounded gap and avoided failure; the seven story-quality questions were reviewed against original Scope/ACs, source plan and siblings. No test result or code acceptance is claimed by writing this supplement. Review the master #40 coverage map before pickup.
