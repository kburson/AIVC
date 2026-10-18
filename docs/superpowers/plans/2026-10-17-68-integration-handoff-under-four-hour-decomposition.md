# Story #68 integration-handoff decomposition plan

> **For agentic workers:** Use the owner-selected execution method and applicable task skills at future pickup. Checklist steps below are planning obligations. This revision authorizes no application implementation.

**Goal:** Deliver accepted migration Task 6 through 3 independently testable stories below four hours each.

**Architecture:** The accepted three-service architecture is unchanged. #68 becomes a nested coordination epic under #40; its leaves integrate serially into its recorded branch before the package integrates into `codex/40-draft`.

**Tech Stack:** Existing pinned Node/TypeScript/ESM, Fastify, Next.js, Vitest, Playwright and Docker Compose.

**Spec:** [Accepted migration design](../specs/2026-10-16-40-stateless-service-migration-design.md). Read it and the entire accepted [migration plan](2026-10-16-40-stateless-service-migration.md), especially Task 6 and all assigned later corrections.

**Status:** Owner-requested sizing reassessment on October 17, 2026 (America/Chicago), after #63 governed Done and merged PR69. New decomposition; no renewed peer acceptance or Plan approval. All new stories remain Backlog. The old 4h package estimate stays historical; the new leaf sum is 9.5h and requires JIT forecast convergence.

## Source authority

Accepted design: `docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md`, publication `e6e96c9a4f07bb78faa73dc56368a0503d912982`, SHA-256 `f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`, XPR `review-0009efb5ca6886291ad48628afa78120`.

Accepted implementation plan: `docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md`, publication `80efe1a150dbd8605aab69678c2a7a87f8553072`, SHA-256 `eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`, XPR `review-3f99142a6b19c9dcbe0e6e53c7b1354a`. Both retain LOCAL JOURNAL MODE / accepted-uncommitted / assurance unavailable and separate exact-byte Git publication. The uncertain predecessor `review-2bdf5dd8ee56accc6e494643054a3cf1` remains unsettled. No acceptance transfers to this supplement.

Every original SAR/XPR, #39 predecessor and later unreviewed-amendment reference remains in [the preserved original decomposition lineage](2026-10-17-40-stateless-service-migration-decomposition.md#preserved-artifact-and-review-lineage), publication `86927fedfdd9741bb936c80223577b19e7387235` (original intake `22aee3f4c06293f164e2b5f8fd442ff6ca332c1d`). Neither that supplement nor either accepted artifact is edited.

## Story Intent

- **Beneficiary:** research delivery owner
- **Capability:** receive a verified integrated application and its exact operational evidence
- **Need:** research Task 0 cannot use planning acceptance as proof of a working migration
- **Value or failure prevented:** performance research starts from reproducible application behavior and declared limitations

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

### Task 1: Freeze integrated source identities and run all regression lanes

#### Story Intent

- **Beneficiary:** research delivery owner
- **Capability:** verify the integrated migration at one reproducible source and image revision
- **Need:** separate story results can become stale during integration
- **Value or failure prevented:** application acceptance rests on the actual current bytes and complete regression evidence

#### Scope and acceptance boundary

Accepted migration Task 6, bounded slice 1. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 0.5h evidence authoring,2.25h complete verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Freeze clean integrated source, exact image/topology/fixture/contract/catalog/config/interface-policy identity and dependency graph; changes invalidate affected evidence.
- Run every accepted unit/contracts/integration/voice/slow/browser/typecheck/build/lint/format/docs/sealed and full production-container verifier at the source freeze.
- Map actual commands/exits/counts/durations/prerequisites without reclassifying missing infrastructure or historical reports as current success; no paid verify:live.

**Owned files:** `docs/evidence/40-migration-manifest.json`, `docs/implementation/40-stateless-services.md`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Accepted #63 contracts and predecessor package #67 governed Done; original accepted interfaces and corrections remain authoritative.

**Produces:** verify the integrated migration at one reproducible source and image revision; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npm run typecheck`

Run: `npm run build`

Run: `npm test`

Run: `npm run test:contracts`

Run: `npm run test:integration`

Run: `npm run test:voice`

Run: `npm run test:slow`

Run: `npm run test:browser`

Run: `npm run lint`

Run: `npm run format:check`

Run: `npm run verify:docs`

Run: `npm run verify:sealed-evidence`

Run: `node --test tests/contracts/stateless-services.test.mjs`

Run: `npm run typecheck`

Run: `npm run build`

### Task 2: Reconcile whole-change review and governed integration delivery

#### Story Intent

- **Beneficiary:** research delivery owner
- **Capability:** receive an independently reviewed migration with exact reachable delivery evidence
- **Need:** planning acceptance and individual slices cannot substitute for final integrated code review
- **Value or failure prevented:** the release does not claim approval or merged source from stale or unrelated reviews

#### Scope and acceptance boundary

Accepted migration Task 6, bounded slice 2. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 0.25h evidence reconciliation,0.5h verification,2.5h independent review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Obtain independent whole-change code review at frozen integrated SHA; preserve distinct author/reviewer identity and all earlier accepted/unsettled review lineage.
- Check each aggregate AC/DoD individually from genuine evidence, retain native Test/Review/approval/Close and exact-head CI/merge authority; fixes return to owning story and fresh verification.
- Keep branch/PR fetchable, use sanctioned exact-head integration to immediate parent target and verify actual ancestry/date; root#40 trunk delivery remains its later separate gate, not prematurely closed here.

**Owned files:** `docs/implementation/40-stateless-services.md`, `docs/evidence/40-migration-manifest.json`, `docs/peer-reviews/code/`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 1 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** receive an independently reviewed migration with exact reachable delivery evidence; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npm run verify:docs`

Run: `npm run verify:sealed-evidence`

Run: `npm run typecheck`

Run: `npm run build`

### Task 3: Publish research Task 0 handoff with measured limits

#### Story Intent

- **Beneficiary:** research delivery owner
- **Capability:** receive reproducible application state and operational limits before research begins
- **Need:** research cannot infer a working migration from planning or local-only delivery
- **Value or failure prevented:** Task0 starts only from accepted delivered software and honest state cost and interruption evidence

#### Scope and acceptance boundary

Accepted migration Task 6, bounded slice 3. Joint estimate **2.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 1.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Publish accepted integrated source/PR/images, both multipart/JSON turn representations, state/no-store/caller-history/client-fencing/per-stream-abort and per-instance2N capacity meaning.
- Include policy/key coordinated-change limitation, actual slow-upload lockout, unknown shutdown work, real resources/mounts/ingress cost/catalog and every verifier result/limitation.
- Hand off to#41/#42 without paid/benchmark claims or automatic research unblocking; actual #40 root trunk delivery and native dependencies remain required before research admission.

**Owned files:** `docs/implementation/40-stateless-services.md`, `docs/evidence/40-migration-manifest.json`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 2 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** receive reproducible application state and operational limits before research begins; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npm run verify:docs`

Run: `npm run verify:sealed-evidence`

Run: `npm run typecheck`

Run: `npm run build`

## Coverage and semantic self-review

The union of these slices retains the original package Scope and ACs and every assigned accepted correction. The coordination epic's original body/reviews remain the aggregate oracle. Each leaf names an operational beneficiary, distinct capability, source-grounded gap and avoided failure; the seven story-quality questions were reviewed against original Scope/ACs, source plan and siblings. No test result or code acceptance is claimed by writing this supplement. Review the master #40 coverage map before pickup.
