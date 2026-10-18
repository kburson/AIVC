<!-- ai-peer-review-template version="1" digest="sha256:f81da1894a46ceb20866070833b4e99ef536ef633542b418783d29e6a981dbd8" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-3f99142a6b19c9dcbe0e6e53c7b1354a"
role: "author"
turn: 1
commit_mode: "no-commit"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md"
artifact_commit: "e6f70cbb52fa5b5651cd3c3817f3e7104deb2a14"
artifact_blob: "9f4fe68867a0864f32b86d38c7c832a6d584f221"
artifact_digest: "sha256:ba0da2e873c29d41dd1947720aeffd586709e5ec95eb356752dd068d8dfce76a"
agent:
  host: "codex"
  provider: "openai"
  model_id: "gpt-6.1-sol"
  model_display: "gpt-6.1-sol"
  session_fingerprint: "sha256:3c8a7ddce72ffb1862ebe766fb8e3e447c90e195d470d69ffe8d8cd7930c30cf"
  identity_source: "runtime"
started_at: "2026-10-17T09:10:55.923Z"
submitted_at: "2026-10-17T09:39:38.231Z"
finding_ids: []
answered_finding_ids: ["R1-F001","R1-F002","R1-F003","R1-F004","R1-F005","R1-F006","R1-F007","R1-F008","R1-F009","R1-F010"]
acknowledged_supplement_ids: []
---

> **LOCAL JOURNAL MODE** — authority assurance: `unavailable`

## Summary

Revised only the implementation plan and this exact author response. All seven required findings are addressed; three optional suggestions are incorporated. The XPR-accepted specification remains unchanged. No application implementation, runtime installation, Git mutation or other response was edited during this turn.

## Finding dispositions

- **R1-F001 — addressed.** Separated pre-auth lifecycle registration from post-auth/policy pipeline acquisition, exactly once per request. Added more-than-four concurrent rejected-upload tests and explicit zero pipeline/paid counters while valid turn and speech requests remain admissible.
- **R1-F002 — addressed.** Added a shared early-refusal transport contract: bounded JSON, Connection: close, flush then close, force destroy within 1000 ms, no unbounded rejected-body drain. This covers auth/policy/capacity/drain. Explicitly distinguished application parsing from fixed HTTP/kernel bytes already received. BFF/router use owned Node duplex HTTP client response handling while upload remains open, preserving complete error responses before destructive body cancellation. Pinned Next cleanup is tested rather than assumed. Bounded TLS-ingress lingering and healthy-versus-stalled-reader expectations are explicit. Socket tests cover each hop and status/envelope/retryability, no accidental 502.
- **R1-F003 — addressed.** Host generates non-secret per-container instance UUIDs, supplies them at startup and validates exact UUID/container/address binding against inspect and core boot events before testing and after replacement/scaling. The manifest is bijective; router and fixture observations join through it. Explicit mock-script operational stdout events provide paid/pipeline acquisition/release observations with monotonic sequence and parent IDs, bounded capture and no secrets or control endpoint. Missing/gapped/overflowed observations fail. SIGKILL leaves unreleased work unknown; BUSY and surviving fixture observations provide independent checks.
- **R1-F004 — addressed.** Task 2 Step 5 exact command now includes provider-sdk-migration, config and admission tests alongside the original focused regressions.
- **R1-F005 — addressed.** Declared direct authenticated bounded router eligibility probes and acknowledged membership updates, separate from script consumption or app readiness. Known draining/removed/no-eligible targets yield retryable 503 without substitution; core drain-503 passes through. Unexpected network/connection failure of a still-declared eligible target yields 502. Contradictory scripts invalidate the scenario. Fixed capabilities target obeys the same policy.
- **R1-F006 — addressed.** Added closed case inventory with 610-second serial Vitest and 160-second Playwright maxima, including signals/replacements/readiness. Phase budgets are 780/240 seconds with at least 20 percent margin enforced by preflight. Global budget is explicitly revised from 1200 to 1800 seconds: 600 build + 90 readiness + 780 Vitest + 240 browser + 30 teardown = 1740, plus 60 reserve. Wrapper is 1860 seconds with bounded subprocess/fallback teardown. Counts, omissions, duplicates and over-budget inventory fail. These are future enforced maxima, not execution claims or a change to the already completed runtime-owner four-hour approval.
- **R1-F007 — addressed.** Declared createRuntime new, moved production getRuntime/getLeasePools memoization and added default process-global pipelines. Production apps share default pools/runtime; explicit complete ResourceContext injection isolates test fixtures only. Retargeted reload/sharing assertions, legacy compatibility re-exports and two-app contention tests. Only mock-script mode constructs request-scoped adapter wrappers; ordinary cached adapters never store parent context. Interleaved-parent/multi-round tests preserve invocation isolation.
- **R1-F008 — adopted.** Entry-point example now invokes process.execPath directly with an 1800-second spawnSync timeout/SIGKILL, handles error/signal/null status, and calls a validated run-owned 30-second fallback cleanup export. Import-main guard prevents import from starting a topology. No event-loop test timer is relied on to interrupt synchronous spawn.
- **R1-F009 — adopted.** Explicitly move and re-root the existing transitive export walker; absent/empty closure fails rather than vacuously traversing the old directory.
- **R1-F010 — adopted.** Task 2 Step 3 explicitly converts the eager runTurn producer to demand-driven iteration. A drain-aware socket pump alone cannot bound its upstream Web Stream queue.

## Changes made

Updated owning task interfaces/tests, runtime ownership, early-refusal and replica-observation contracts, router semantics, fixed verification command, wrapper example and duration inventory. No required coverage was removed. The current 64-hour joint estimate remains preliminary and requires normal decomposition/admission rather than authorizing implementation.

## Declined changes and rationale

None. Reviewer could not read pinned node_modules; the author confirms the existing linked dependency installation is present. No reinstall is requested or performed. API evidence remains distinct from the future compatibility proof.

## Verification

Read the whole sealed report and rechecked current runtime.ts/getRuntime/getTurnDeps/getSpeechAdapter and leases.ts process-global memoization. Existing ClaudeOptions.fetch and Deepgram fetchImpl seams were verified before this review. Inspected the actual pinned Node runtime's bundled _http_server source: response finish can call req._dump(), confirming why bounded explicit close is necessary and why zero application parsing does not mean zero socket traffic. Verified inventory arithmetic: 610 <= 624 and 160 <= 192, with phase maxima totaling 1740 <= 1800.

No application/provider/container test ran and no paid/production success is claimed. Original candidate SDK MCP wait for this plan remains pending despite authentic canonical delivery sequence 8; it is preserved without cancellation or duplicate wait. The actual sealed report and event-derived author-submit action authorize this document turn. Runtime owner was asked for read-only triage only, with no maintenance/journal/provider mutation.
