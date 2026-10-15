<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-9ec8655d0231ccca123b9ad385d7fef8"
role: "reviewer"
turn: 1
commit_mode: "normal"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/plans/2026-10-15-39-voice-bff-performance-research.md"
artifact_commit: "a3411ec08de263b17868d6c2df268948f3ee8589"
artifact_blob: "cf75585760ee371e7b53f0631a7fbd07fdf1b02a"
artifact_digest: "sha256:690870a0d17b1a6af701f710a6dd0edc9154096b5645fd2440ace6e2465a069a"
agent:
  host: "claude-code"
  provider: "anthropic"
  model_id: "claude-opus-5-5"
  model_display: "claude-opus-5-5"
  session_fingerprint: "sha256:e05027dbc00897fc6a3e980f19c2de7bbe9c8eba3dda27db6159a5d026df83c0"
  identity_source: "runtime"
started_at: "2026-10-15T06:15:55.566Z"
submitted_at: "2026-10-15T06:20:33.535Z"
finding_ids: ["R1-F001","R1-F002","R1-F003","R1-F004","R1-F005","R1-F006","R1-F007","R1-F008"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---

Mode: `normal`

## Summary

Independent XPR review of the full plan `docs/superpowers/plans/2026-10-15-39-voice-bff-performance-research.md` (all 626 lines; the digest is bound in the frontmatter above) against the corrected governing spec `docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md`, sections 2–9 and 16–18. I also read the SAR loop summary, but only to confirm lineage, and did not use it as a basis for findings. No application code, tests, k6 builds or benchmarks were run. The environment did not allow me to recompute file hashes, so I did not independently confirm the spec digest quoted in the plan header.

What holds up well:

- **Architecture conformance.** The plan matches the section 18 correction. The direct Fastify orchestrator is the primary measured entry, and lookup isolation (F1) and the lookup-constrained sweeps are separate. Next.js appears only in the bounded forwarding family. Core bearer auth (401) and web Origin/Host checks (403) are separate boundaries. The three-service migration is a hard Task 0 prerequisite that stops downstream work rather than being imitated.
- **Arithmetic.** I re-derived every count and hour range in sections 3 and 8, and they reconcile:
  - Core discovery: 80 series. Confirmation: 34 packages, giving a core subtotal of 112.8–723.6 hours.
  - Per-context load-one budget: 0.3–3.55 hours with K=5.
  - Two-turn fallback: 0–22.2 hours.
  - Topology series: 28/84/138, total 250. Infrastructure windows: 520/1192/1176, total 2888.
  - Control totals by tier: 11.3–68.867, 38.567–185.133 and 96.75–211.4 hours.
  - Whole campaign: 259.4167–1189.0 hours.
  - The R2-F001 cutoffs (479999/599999/629999 ms) and the one-turn fallback (48-second gap, 38.4-second ceiling) are correct.
- **Gates.** The statistical, oracle, settlement, paid-budget and evidence-labeling rules faithfully carry the spec's requirements. These include the all-three-repeats rule, the ≥200-observation p95 minimum, voice success requiring every segment, no refund for uncertain reservations, and censoring above unproven headroom.

I found four gaps that would let an implementer build something conforming to the plan that still under-quotes, mis-records or cannot execute part of the spec. All four are bounded edits to the plan, and none reopens the architecture or the budgets.

## Findings

### R1-F001 — Mixed per-pair replay feasibility leaves the two-turn fallback trigger, interface and budget undefined

Spec 16.7 says that if the declared realistic-wait replay is infeasible at four turns/minute, Tier 1 must test two turns/minute "at all four paired executive configurations". The plan restates this in Global Constraints line 27 and Task 10. Load-one occupancy, however, is measured separately for each context: section 8 lists eight Tier 1 contexts with distinct CPU/memory and admission settings. A 1 CPU/2 GiB context can therefore exceed the 9.6-second ceiling while 4 CPU/12 GiB passes. The plan does not handle that mixed outcome:

- **Interface.** `chooseReplayPacing({fourFeasible,twoFeasible,oneApproved})` takes one boolean. It cannot say whether feasibility is judged per context or campaign-wide, and the Task 6 tests cover only uniform outcomes.
- **Budget.** Section 3 says "A two-turn replay replaces the infeasible four-turn replay's confirmation package". The section 8 fallback row says the substitute "uses the same core package at substitute pacing". Both assume replacement. In the mixed case, a pair where four-turn replay is feasible keeps its own four-turn discovery and confirmation, and the spec still requires the two-turn substitute there. That adds up to one discovery series (0.5–1.6 hours) and one confirmation package (2–17 hours) per such context. Neither the section 3/8 tables nor the Task 7 estimator test covers this cost.
- **Consequence.** The quote and the `validateInventory` checks would accept an under-counted Tier 1. An implementer could also read the single boolean as "run the fallback only where four-turn failed", which falls short of spec 16.7's all-four-pairs coverage.

### R1-F002 — Per-series topology preflight requires Next.js in topologies the plan defines as Next.js-free, with no placement or isolation rule

Section 8 ("Frozen parameters", line 502) and the "Actual-path topology protection checks" row require a fresh preflight before every series: 12 Origin/Host requests through two Next.js routes plus 6 core-credential requests. This holds for all 250 series, including:

- F1 lookup-isolation series, where k6 calls lookup directly;
- primary direct-core M1 series, where spec section 4 says "Next.js is absent".

Spec 16.8 does say "before each topology/configuration series, prove through both web BFF routes…". The plan still has to say how that is met without disturbing the measured topology, and it does not:

- **Placement and budget.** Task 7 only says "any measured Next.js BFF" gets its own container. Nothing says whether Next.js is deployed in non-web series, on which host, with what fixed cgroup, or whether its idle presence counts against target-host headroom or helper-host hours.
- **Work leakage.** The permitted web case "delegates correctly", so it creates real core, lookup and simulator work, plus possible leases and warm connections, just before warmup. The plan does not require that work to settle before the measured window, or to be excluded from the run's offered-work reconciliation.
- **F1 topology.** In F1 series the core-credential checks need a running orchestrator, which is not on the F1 measured path. The plan does not say whether one is deployed and isolated there.
- **Wording conflict.** The row is called "Actual-path" checks, yet for direct-core and F1 series the web routes are not on the actual path.

As written, an implementer must either add Next.js and orchestrator containers to every topology with unspecified placement, which risks undeclared contention on the target host, or skip spec-required checks. Either choice could later invalidate isolation evidence.

### R1-F003 — Calibration casebook does not produce, or show funding for, the complete per-fixture replay tuples that section 8 assumes

Section 8 requires that replay use "K=1–5 funded, supported complete tuples per fixture" for four ordinary fixtures, and the plan picks K before quoting. All ordinary M1 types are output-enabled under spec 16.7. Every fixture's tuple therefore includes TTS, and the B3 multi-segment fixture needs at least two TTS segments.

Task 4's casebook is organized by provider cell: model short/lookup/long, STT 2/5/15 seconds, TTS 40/120/300 characters. It does not define how a complete per-fixture tuple (STT, model or continuation, and every TTS segment at the fixture's actual segment lengths) is obtained. It could come from end-to-end fixture executions, or from pairing per-provider samples by a predeclared rule. Spec section 7 forbids independently combining incompatible timings. Some of the casebook TTS cells also do not match fixture segments: 120 and 300 characters exceed the default segment cap of min(120, floor(6×14)) = 84.

The request caps do not visibly fit. At K=5:

- TTS: 4 fixtures × at least 1 segment, plus at least 1 extra segment for B3 multi-segment, gives about 25 requests. Adding the casebook's three TTS cells at 5 repeats each (15) reaches about 40, over the 30-request limit, before warmups and cold/reused samples.
- Model: replay alone needs about 25 requests (B2 counts its continuation). The longer-context cell adds 5, reaching the 30-request limit with nothing left for cold/reuse or concurrency-three samples.

The plan allows "fewer/missing supported tuples", but nothing says which cells give way first. That makes K, and whether empirical Tier 1 replay can run at all, an unplanned outcome discovered only in Task 10 under a frozen budget.

### R1-F004 — The record schema cannot represent busy-schedule misses, output mode or segment correlation that the plan and spec require

The section 2 `Outcome` union is `'success'|'failed'|'rejected'|'dropped'|'unfinished'|'planned-cancel'`. Task 6, however, requires "A busy offer becomes `busy-schedule-miss`". `TurnRecord` also has no reason or classification field, so a busy miss can only be stored as a generic `failed`. That conflicts with three spec requirements:

- 16.4 requires keeping service latency for admitted turns distinct from the failed-offer rate.
- 16.7 says a load-one busy miss makes the combination infeasible-by-workload/profile, not a service failure.
- The section 8 analysis must tell them apart.

`TurnRecord` also lacks two more fields the spec requires per record:

- **Output and input mode.** Spec 16.7 requires manifests to record output mode and the matching oracle by type, and to report typed-input and audio-input strata separately. Muted B1/B2 controls and output-enabled M1 B1/B2 turns share `type` values and are distinguishable only by an unconstrained `profile` string.
- **Segment correlation.** Spec 16.1 requires correlating `segmentId` and request IDs for speech requests. `requiredSegments`/`deliveredSegments` counts are not enough for later segments' request-local metrics and continuity checks.

The plan calls the JSON schema authoritative and allows only additive refinement. Leaving these out of the declared v1 shape invites Tasks 1, 6 and 8 to diverge.

## Required changes

1. **(R1-F001)**
   - Define the scope of the fallback trigger. Recommended, consistent with spec 16.7: any Tier 1 replay context whose four-turn load-one gate fails triggers the two-turn substitute at all four paired configurations, for every admission mode that has a replay context.
   - Change `chooseReplayPacing` to take per-context feasibility, or a campaign-level aggregate with a stated rule, and add a Task 6 test for the mixed case.
   - Update the section 3 and section 8 fallback text and the Tier 1 totals, or add an explicit additive row. Pairs where four-turn replay is feasible must keep their four-turn package and add the two-turn discovery and confirmation, bounded at up to eight contexts.
   - Add a Task 7 estimator test showing that the mixed case is neither under-counted nor double-charged.
2. **(R1-F002)**
   - Specify each family's topology composition: which services are deployed for F1, direct-core M1, lookup-constrained, scaling and web-forwarding series.
   - Specify where the Next.js and orchestrator preflight targets run in series where they are not measured, with a fixed recorded cgroup off the constrained service's budget or a declared helper placement, and how that is charged in the hour and host quote.
   - Require that preflight-induced work (the permitted web delegation and valid core calls) settle and be recorded separately, before warmup and outside the measured window's offered-work reconciliation.
   - Keep spec 16.8's full 18-request proof. Clarify that "Actual-path" means the actual deployed balancer/container/network path for each entry, not the measured workload path.
3. **(R1-F003)**
   - Add a calibration allocation table in Task 4 or section 8. For each provider it should show each request's purpose (per-fixture replay tuple versus provider characterization cell, cold/reused, warmup, continuation) and prove the total stays within 30 requests per provider and USD 10 at the planned K.
   - Define how a complete fixture tuple is obtained: an end-to-end fixture run, or a predeclared pairing rule that complies with spec section 7.
   - Make TTS tuples use the fixtures' actual segment lengths within the effective cap.
   - Predeclare the priority order for dropping cells when the caps bind, for example lowering K uniformly before dropping a fixture, or dropping 120/300-character characterization cells first, so that K is decided before execution rather than by what happens to remain.
4. **(R1-F004)**
   - Add `'busy-schedule-miss'` to `Outcome`, or add a required `offerClassification` and reason field, so busy misses stay failed offers with a distinct class.
   - Add required `inputMode` (`typed|audio`) and `outputMode` (`enabled|muted`) fields, plus the oracle identifier, to `TurnRecord`.
   - Declare a segment/speech-request record shape (`segmentId`, `requestId`, `generation`, intended/actual initiation, first valid PCM, completion, bytes, outcome) and use it in Tasks 1, 6 and 8.

## Optional suggestions

### R1-F005 — Execution-method recommendation is internally inconsistent

Line 3 says subagent-driven development is "(recommended)", but section 7 (line 488) says "Native execution is the recommended default". Make the two agree so the owner's choice is not pre-empted by template text.

### R1-F006 — Several example tests are weaker or more brittle than their names suggest

- The Task 3 `selectTuple` test passes for any element of `tuples`, including a random pick. Also assert that the same seed and `caseId` return the same tuple, and that the returned tuple is an unmodified original.
- In the Task 2 future-duration test, `expect(early.get('Server-Timing')).not.toContain(...)` errors on `null` if early headers correctly omit `Server-Timing`. Use `?? ''`.
- The Task 0 `exec` mock throws on any command other than `git ls-files`, which forces a call order (for example, it rejects an implementation that runs `git rev-parse` first). Have the mock answer the expected head query.

### R1-F007 — Label and lifecycle wording

- Section 3's confirmation row reads "8 orchestrator + 8 Fastify + 8 default". Since both services are now Fastify, write "8 lookup-constrained".
- Section 10's "XPR has not started" and the header's "no new plan SAR/XPR is claimed" will be stale once this review exists. Consider wording that does not depend on review state, and leave review status to the review archive.

### R1-F008 — Record infrastructure-generated responses

Spec section 8 requires recording "any infrastructure-generated responses that bypass application instrumentation", such as balancer 502/503 errors or connection resets. Add this to Task 2's collector or Task 7's balancer evidence, and have screening treat those responses as failed offered work rather than missing data.

## Decision

revisions-requested
