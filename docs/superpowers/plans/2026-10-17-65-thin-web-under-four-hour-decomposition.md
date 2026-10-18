# Story #65 thin-web decomposition plan

> **For agentic workers:** Use the owner-selected execution method and applicable task skills at future pickup. Checklist steps below are planning obligations. This revision authorizes no application implementation.

**Goal:** Deliver accepted migration Task 3 through 4 independently testable stories below four hours each.

**Architecture:** The accepted three-service architecture is unchanged. #65 becomes a nested coordination epic under #40; its leaves integrate serially into its recorded branch before the package integrates into `codex/40-draft`.

**Tech Stack:** Existing pinned Node/TypeScript/ESM, Fastify, Next.js, Vitest, Playwright and Docker Compose.

**Spec:** [Accepted migration design](../specs/2026-10-16-40-stateless-service-migration-design.md). Read it and the entire accepted [migration plan](2026-10-16-40-stateless-service-migration.md), especially Task 3 and all assigned later corrections.

**Status:** Owner-requested sizing reassessment on October 17, 2026 (America/Chicago), after #63 governed Done and merged PR69. New decomposition; no renewed peer acceptance or Plan approval. All new stories remain Backlog. The old 8h package estimate stays historical; the new leaf sum is 13.5h and requires JIT forecast convergence.

## Source authority

Accepted design: `docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md`, publication `e6e96c9a4f07bb78faa73dc56368a0503d912982`, SHA-256 `f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`, XPR `review-0009efb5ca6886291ad48628afa78120`.

Accepted implementation plan: `docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md`, publication `80efe1a150dbd8605aab69678c2a7a87f8553072`, SHA-256 `eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`, XPR `review-3f99142a6b19c9dcbe0e6e53c7b1354a`. Both retain LOCAL JOURNAL MODE / accepted-uncommitted / assurance unavailable and separate exact-byte Git publication. The uncertain predecessor `review-2bdf5dd8ee56accc6e494643054a3cf1` remains unsettled. No acceptance transfers to this supplement.

Every original SAR/XPR, #39 predecessor and later unreviewed-amendment reference remains in [the preserved original decomposition lineage](2026-10-17-40-stateless-service-migration-decomposition.md#preserved-artifact-and-review-lineage), publication `86927fedfdd9741bb936c80223577b19e7387235` (original intake `22aee3f4c06293f164e2b5f8fd442ff6ca332c1d`). Neither that supplement nor either accepted artifact is edited.

## Story Intent

- **Beneficiary:** web voice client operator
- **Capability:** forward authenticated voice requests through a thin streaming web boundary
- **Need:** the web application currently owns the provider pipeline and cannot scale independently
- **Value or failure prevented:** browser behavior and cancellation remain compatible while provider ownership moves to the portable service

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

### Task 1: Own the production Next listener and request context

#### Story Intent

- **Beneficiary:** web voice client operator
- **Capability:** drain the actual production web listener and its active request context
- **Need:** App Router health flags alone cannot stop keep-alive admission or own forwarding cleanup
- **Value or failure prevented:** web termination refuses new work before framework dispatch and retains active cleanup

#### Scope and acceptance boundary

Accepted migration Task 3, bounded slice 1. Joint estimate **3h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 1.75h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Extend the already-proved pinned Next 16.4 prepare/getRequestHandler production wrapper, with no standalone output assumption or next start substitute.
- Own socket/request registry and AsyncLocalStorage context before dispatch; synchronously withdraw readiness/refuse new and keep-alive work before any awaited shutdown.
- Join framework transport and bound forwarding handles, close idle/active sockets within accepted15s drain plus 5s cleanup; no provider knowledge inferred from HTTP closure.

**Owned files:** `apps/web/server/start.mjs`, `apps/web/package.json`, `tests/contracts/next-server-lifecycle.test.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Accepted #63 contracts and predecessor package #64 governed Done; original accepted interfaces and corrections remain authoritative.

**Produces:** drain the actual production web listener and its active request context; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/next-server-compat.test.ts tests/contracts/next-server-lifecycle.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 2: Forward authenticated requests over fixed duplex upstream transport

#### Story Intent

- **Beneficiary:** web voice client operator
- **Capability:** preserve private upstream admission errors during an incomplete browser upload
- **Need:** destructive cancellation can turn a real core refusal into a misleading proxy failure
- **Value or failure prevented:** clients receive the original retryability without leaking credentials or enabling an open proxy

#### Scope and acceptance boundary

Accepted migration Task 3, bounded slice 2. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Use fixed Node HTTP/HTTPS duplex forwarding to allow response headers/error body before upload completes; bounded flush/close within 1000ms at the BFF hop.
- Preserve Host/Origin gate, overwrite bearer and interface digest, strip cookies/hop-by-hop/untrusted/internal headers, forbid user URL/redirect/retry.
- Expose ForwardingHandle response/settled/abort in the ALS context; full upload/connect/header/stream deadline never resets per chunk; preserve502/503/504 versus incomplete transport.

**Owned files:** `apps/web/server/forwarding/config.ts`, `apps/web/server/forwarding/request.ts`, `apps/web/server/http/admission.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 1 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** preserve private upstream admission errors during an incomplete browser upload; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/web-forwarding.test.ts tests/contracts/next-server-lifecycle.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 3: Prove delegated SSE PCM and pressure parity

#### Story Intent

- **Beneficiary:** web voice client operator
- **Capability:** receive compatible streamed voice responses through the thin web boundary
- **Need:** an additional framework hop can alter stream demand bytes and cancellation
- **Value or failure prevented:** browser and direct clients observe equivalent protocol behavior with bounded buffering

#### Scope and acceptance boundary

Accepted migration Task 3, bounded slice 3. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Compare direct/delegated multipart text/WAV, JSON text/speech, validated event sequence/usage and exact PCM headers/bytes; normalize only explicitly path-specific build metadata.
- Bound App Router pull-driven demand and original oversized-chunk allocations at actual production sockets; abort while awaiting demand and after completed upload.
- Preserve web build metadata/capabilities, strip private policy response header, and prove wrapper registry waits for upload/upstream-reader/cancellation cleanup.

**Owned files:** `apps/web/server/forwarding/request.ts`, `apps/web/server/forwarding/capabilities.ts`, `tests/contracts/web-forwarding.test.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 2 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** receive compatible streamed voice responses through the thin web boundary; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/web-forwarding.test.ts tests/contracts/next-server-compat.test.ts tests/contracts/next-server-lifecycle.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 4: Cut over web routes and preserve legacy regression assertions

#### Story Intent

- **Beneficiary:** web voice client operator
- **Capability:** run the web client without provider ownership or hidden runtime injection
- **Need:** temporary extraction seams leave web coupled to executable provider code
- **Value or failure prevented:** the independently scaled web service keeps browser behavior without duplicating the backend

#### Scope and acceptance boundary

Accepted migration Task 3, bounded slice 4. Joint estimate **3.5h**, including normal verification/review/delivery; upper admission ceiling is strictly below 4h. Budget allocation: 2.25h implementation/authoring,0.5h focused plus standard verification,0.5h review/CI/delivery,0.25h contingency. Gate failures or unexpected scope require reassessment, not silent overrun.

- Switch all three API routes to admitted delegation, remove all temporary compatibility re-exports/provider SDK direct dependencies/web runtime globals.
- Retarget every old runtime/http/provider import and fixture to real createOrchestratorApp/createRuntime sockets, preserving every behavioral assertion; enforce final web import closure.
- Migrate ordinary browser launcher to real standalone mock core plus lookup/thin web; keep static UI/local readiness usable during dependencies unavailable.

**Owned files:** `apps/web/app/api/`, `apps/web/package.json`, `tests/browser/system-server.ts`, `playwright.config.ts`, `tests/slow/disconnect.test.ts`. Shared files may evolve only serially. Existing tests retain all assertions. Creating future test files in this list is an implementation obligation, not a current existence or pass claim.

**Consumes:** Task 3 of this package through its governed Done boundary; original accepted interfaces and corrections remain authoritative.

**Produces:** run the web client without provider ownership or hidden runtime injection; only the obligations above are claimed by this slice. The coordination epic still owns the union of its original Scope/ACs.

#### Implementation and verification steps

- [ ] Inspect exact accepted source/corrections and current predecessor; confirm this slice still fits below 4h before Plan approval.
- [ ] Add the named behavioral and negative regression assertions above before changing production behavior; run the focused verifier and record genuine RED, preserving existing assertions.
- [ ] Make the minimal owning-file change using the accepted plan's exact interfaces and correction sections. Do not implement a sibling slice or add a placeholder/skip to make a future obligation pass.
- [ ] Run the focused commands below plus canonical stage-owned full Test floor; collect actual counts/exits and current source identity. Partial container selections never claim complete production acceptance.
- [ ] Obtain fresh implementation review; resolve findings, keep the issue-attributed branch/PR current, then complete the native Test/Review/approval/exact-head delivery/Close gates. Stop and split again if the bounded story no longer fits.

#### Verification obligations

Run: `npx vitest run tests/contracts/workspace-boundaries.test.ts tests/contracts/web-forwarding.test.ts tests/contracts/next-server-lifecycle.test.ts`

Run: `npm run test:integration`

Run: `npm run test:voice`

Run: `npm run test:browser`

Run: `npm run typecheck`

Run: `npm run build`

## Coverage and semantic self-review

The union of these slices retains the original package Scope and ACs and every assigned accepted correction. The coordination epic's original body/reviews remain the aggregate oracle. Each leaf names an operational beneficiary, distinct capability, source-grounded gap and avoided failure; the seven story-quality questions were reviewed against original Scope/ACs, source plan and siblings. No test result or code acceptance is claimed by writing this supplement. Review the master #40 coverage map before pickup.
