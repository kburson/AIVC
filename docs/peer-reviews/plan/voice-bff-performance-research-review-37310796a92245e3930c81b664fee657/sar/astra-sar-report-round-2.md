# Story 39 performance research plan — native SAR round 2

Decision: **changes-requested**. Two required P2 corrections remain in the new finite inventory. No P0 or P1 finding. Both prior optional observations are addressed. This is round 2 of the maximum three rounds, in the same native reviewer session.

## Artifact and review provenance

- Reviewed the entire revised plan, `docs/superpowers/plans/2026-10-15-39-voice-bff-performance-research.md`, all 582 lines, and the full governing amended specification, `docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md`, all 477 lines, plus `sar/author-response-round-1.md`.
- Verified revised plan SHA-256: `badd8c94d95dffac7e7f8719af0b914dc8be704521f101ab8de37ed957b9995d`. Coordinator-supplied commit: `b9e74a222887c78fb8862480209aae6f2a855f68`; no Git command independently verified that commit.
- Verified unchanged governing spec SHA-256: `76c5bc37359cecc3b2dda0cd32fd409771d36c7d639876021b2e3a6c2eebc38d`.
- Requested reviewer selection remains Codex `gpt-6-astra` / `high`. This is requested launch/session selection, not provider-certified per-turn attestation. Same reviewer thread fingerprint: `30f5ba9bc732d4dad050bf1e4c52bf448a907a5ac1992c39e80080aa8e6fec37`.
- Native SAR remains single-reviewer evidence, not sealed two-party consensus. No Git, source/artifact edit, installation, paid call, benchmark, implementation test or issue-state mutation occurred. Arithmetic was checked with a read-only local calculation; proposed tests were inspected, not run.

## Prior finding dispositions

| Prior ID | Reviewer disposition | Evidence |
| --- | --- | --- |
| R1-F001 | Substantially addressed, but inventory correction still required | Section 8 now supplies bounded families, controls, context/tuple counts, tier attribution and explicit evidence reuse. Task 7 validates inventory and reconciliation. The broad missing-policy problem is repaired. The new concrete inventory exposes the two remaining defects below; do not claim complete closure until corrected. |
| R1-O001 | Addressed | Task 8, line 375 and section 9, lines 571–579, preserve independent-session count, percentile method/precision and descriptive repeat ranges, with missing-provenance refusal even at high pooled volume. The range is explicitly not a confidence interval. |
| R1-O002 | Addressed | Task 1, lines 195–209, and section 9, lines 553–568, establish an exclusive run before work, durable offered records, bounded append-only collection, separate terminal sealing and interruption recovery that cannot invent successful outcomes. |

## Required findings

### R2-F001 — P2: Reserve the remaining residence of open conversations before request drain

**Location:** plan section 8, line 524 (mandatory open-conversation arrivals), related lines 341, 530, 538–549. Governing spec sections 16.2 and 16.4, especially lines 378 and 402.

**Problem:** Each open arrival is declared to own a new 180-second conversation, but its entire experiment window is budgeted as three minutes of population ramp, two minutes of steady arrivals, and at most 2.5 minutes of drain. A conversation admitted just before the end of steady arrivals still has almost three minutes of its ordinary schedule remaining. The 150-second drain/settlement allowance is shorter than that residence even before allowing its final turn/audio to settle.

Following this window literally either truncates healthy ordinary conversations and their scheduled offers because of the harness cutoff, or runs beyond the declared maxDuration and quote. Recording such truncation as unfinished is truthful, but does not turn the truncated iteration into the required ordinary 180-second conversation. If it is intentionally a cancellation intervention it must be separately labeled; it cannot replace this mandatory ordinary open scenario. The distinction also matters for the N/L arrival translation, observed lifetime, usage and late-session workload.

**Required correction:** Separate (1) stopping new conversation starts, (2) allowing already accepted conversations to complete their remaining 180-second scheduled residence, and (3) draining outstanding turn/speech work for up to 120 seconds followed by up to 30 seconds of cancellation settlement. Record the corresponding cutoffs and preserve failures caused by an actual safety/budget stop. Configure k6 iteration/graceful-stop behavior and the runner's maxDuration to match this lifecycle. Do not shorten the ordinary conversation residence to fit the current estimate.

For the stated three-minute ramp plus two-minute steady arrival window, the conservative completion allowance after the last accepted start is another three minutes of residence plus up to 2.5 minutes for drain/settlement: an **8–10.5-minute planning window** with full final residence, rather than 5–7.5 minutes. The 72-window row would therefore be **9.6–12.6 hours** under that conservative policy, before separate infrastructure/topology controls. Equivalent explicit windowing is acceptable if it preserves the full schedules and accounts for all their work; update tier/control/full totals and the estimator fixture accordingly. This is a mathematical lifecycle check, not a measured-runtime prediction.

**Acceptance checks:**

1. A deterministic test admits a conversation immediately before the new-start cutoff and proves its scheduled late turns can still be offered through its residence, followed by bounded network drain/settlement.
2. The test distinguishes a late turn's real timeout from a harness-imposed early termination; neither can disappear from offered-work/usage accounting.
3. Exact quote and maxDuration include the residual residence, and k6 shutdown cannot kill these ordinary iterations at the old 150-second cutoff.
4. The open-row and tier/full estimator expectations reconcile with the corrected bound.

### R2-F002 — P2: Include the specified slow/tail deep-dive sensitivity in the finite inventory

**Locations:** plan lines 262, 496, 521–528 and 549. Governing spec section 7, lines 152–157, and the mandatory coverage table in section 16.5, line 413.

**Problem:** Section 8 now says Task 7 must encode its listed families instead of choosing coverage, but the B1/B2/B3 deep-dive row contains only the minimum-wait and ordinary replay profiles. The two/eight pacing row likewise uses those two profiles. There is no bounded selected ordinary slow/tail sensitivity cell, although the governing coverage table requires “Declared selected slow/tail cells” for B1/B2/B3 deep dives. Task 3's ability to build hypothetical sensitivity profiles does not schedule them. The B5 disconnect/error/slow-consumer scripts test different intervention oracles and do not establish ordinary long-provider-wait behavior with successful expected output.

This is the residual coverage part of R1-F001: an estimator can include every current row and pass its “all mandatory families” validation while omitting the specified slow/tail sensitivity work.

**Required correction:** Declare a small bounded set of selected B1/B2/B3 slow/tail cells: exact selected resource configuration(s), output modes, named hypothetical delay/tuple policy, load point(s), seeds/repeats, and observation/cleanup bounds. It need not become another full grid or a confirmed capacity family. Preserve clearly hypothetical labels and ordinary completion oracles; use the existing load-one schedule-feasibility gate and retain infeasibility without changing fixtures or replacing the original empirical replay. Include the applicable topology/headroom/feasibility controls and their reuse conditions, add the finite count and hours to Tier 3 and the estimator, and test omission of this family. No paid calibration or arbitrary expansion is requested.

**Acceptance checks:**

1. The specification's B1/B2/B3 selected slow/tail row maps to named finite executable cells, distinct from ordinary replay and B5 fault scripts.
2. The coverage ledger and inventory validator cannot report that sensitivity coverage complete merely because simulators support those profiles.
3. Infeasible slow/tail cases remain explicitly infeasible; no shortened outputs, favorable tuple substitution or silent slower pacing is used to make them pass.
4. Added controls and tier/full sums are reconciled once, with reused evidence identified.

## Inventory arithmetic and reuse assessment

The arithmetic of the current declared rows is internally consistent within the stated rounding tolerance; the required changes concern what those rows represent and omit.

- Core counts remain 16 F1 discovery, 80 M1 discovery and 34 confirmation packages, with the two extra matched worker baselines included. Core subtotal is 112.8–723.6 hours.
- T1 core is 41.2–302; T2 core is 47.6–238.8; T3 core is 24–182.8 hours.
- At K=5, the primary load-one context contains 72 probes at up to 2.5 minutes and six full schedules at up to 5.5 minutes: 3.55 hours maximum. The eight-context fallback upper allowance is 22.2 hours.
- The deep-dive feasibility maximum is 288 probes (12 hours) plus 72 schedules (6.6 hours), yielding the stated 18.6 hours.
- Topology series counts reconcile to 28, 84 and 110. T3's infrastructure expression sums to 940; T1/T2 sum to 520/1192, hence 2652 total. These are maxima before applicable evidence reuse.
- Using the displayed rounded components gives control lower/upper totals 11.300/68.866, 38.567/185.133, and 67.984/152.500. The 0.001-hour differences from printed tier values result from rounding; they are not substantive errors. Full 230.65–1130.1 is consistent before the required inventory corrections.
- Context-specific feasibility reuse includes resources, output mode, admission, seed, profile and topology; muted controls cannot borrow voice proof. Headroom reuse requires independent coverage of every demand dimension and current health. Series-level protection checks remain fresh. No improper reuse was identified.
- The exact generated quote, rather than a rounded interval, controls procurement/runtime. The 12-hour pilot and proposed 160-hour cumulative stop are clearly distinguished from full Tier 1/campaign estimates. The larger complete envelope does not authorize spending or turn unexecuted mandatory work into optional work.

## Whole-artifact recheck

Rechecked Tasks 0–10, all global constraints, interfaces, command contracts and requirement mapping in addition to the new sections. The earlier positive assessment remains applicable: integrated source and production/runtime prerequisites remain fail-closed; paid calibration is separately budgeted and reserved; no paid retry or egress shortcut is introduced; k6 incremental/concurrent support remains a genuine blocking proof; all M1 input types remain output-enabled; complete speech settlement and virtual playback remain distinct; the late-second-segment regression remains mandatory; busy offers, generation ownership and cancellation settlement remain accounted for.

Statistical policies remain empirical, with per-stratum counts, three separately passing repeats, no averaging of percentiles, no repair by soak, and explicit inconclusive outcomes. Admission-bound results cannot become hardware efficiency claims. Fastify reduction remains tied to matched repeated evidence and peak-demand headroom. The unchanged four-to-two-to-separately-approved-one pacing fallback preserves tuples/output and incompleteness labels. Immutable raw provenance, interrupted-run accounting, reproducible figures and unknown-price propagation remain intact. No unrelated new required finding was identified outside the two finite-inventory corrections above.

## Optional suggestions

None new. Both round-1 optional suggestions are addressed; the reviewer is not requesting an expanded statistical confidence study or an additional application architecture.

## Session and next action

`npx aitm start 39 --role agent` resumed the genuine review session; Explain again returned the known `indeterminate` / `state-unavailable` result, with no automatic remediation. No lifecycle transition was attempted. The reviewer will pause its timer and release only its own issue claim after writing this report.

Coordinator action: correct R2-F001 and R2-F002, record their dispositions, and return the full revised artifact and exact round-3 report path to this same session. Round 3 is the final allowed SAR round; unresolved required findings at that bound must remain unresolved. This report is not implementation or execution approval.
