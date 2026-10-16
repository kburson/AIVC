> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/b612108309811663ffad1e04ba2005621c68ea5f/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/sar/astra-sar-report.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-16-39-originals.json).
> Original SHA-256: `c07e7015ff47c7f484e57356ceae6ea7bcae4b9249ca361cf22c3bd9cd56f81d`. Review acceptance and protocol hashes apply to those original bytes.

# Story 39 performance research plan — native SAR round 1

Decision: **changes-requested**. One required P2 finding remains. No P0 or P1 defect was identified. The required change concerns executable campaign scope and tier budgeting; it does not require implementation or experiment execution.

## Reviewed authority and scope

- Tracking: <https://github.com/kburson/AIVC/issues/39>.
- Artifact: `docs/superpowers/plans/2026-10-15-39-voice-bff-performance-research.md`, all 492 lines; SHA-256 `8829f19c9c3f8dc845d900216b0cfbfd46d8658d2198986509980e7f81a97721`.
- Governing amended specification: `docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md`, all 477 lines; SHA-256 `76c5bc37359cecc3b2dda0cd32fd409771d36c7d639876021b2e3a6c2eebc38d`.
- Both byte hashes were verified locally and match the exact SAR request. Commit identifiers are request provenance, not independently checked Git evidence; no Git commands were run.
- Read the repository AGENTS.md, native peer-review orchestration instructions, installed project peer-review skill, task adapter/router and pickup/boot instructions, and the exact SAR request. The using-superpowers skill explicitly exempts a dispatched subagent from its general workflow.
- Requested native reviewer selection: Codex `gpt-6-astra` / `high`. This is the dispatch selection, not provider-certified per-turn model/effort attestation. Reviewer session continuity fingerprint (SHA-256 of this native thread identity): `30f5ba9bc732d4dad050bf1e4c52bf448a907a5ac1992c39e80080aa8e6fec37`. No raw provider handle is reproduced here.
- Native SAR is a single-reviewer document review, not sealed two-party consensus or XPR acceptance. Same-session follow-up is available through a total of three SAR rounds, stopping earlier on acceptance.
- No application edits, Git operations, issue-state mutations, installations, paid calls, benchmarks, or implementation tests were performed. Proposed tests and fixture examples were inspected, not executed. The declared absent integrated application and unproven k6 build remain prerequisites, not fabricated defects in existing application code.

## Required finding

### R1-F001 — P2: Make the control inventory and tier estimates finite before the campaign is delegated

**Locations:** plan lines 130–156 (campaign estimate, especially table row 147), lines 348–369 (Experiment/estimate/controller contract), and lines 430–434 (execution tiers). Governing spec: sections 16.5, 16.9 and 16.10, particularly lines 453 and 457–471.

**Problem:** The plan gives useful counts for discovery and confirmation packages, but combines every independent infrastructure proof, topology/feasibility check, F1 confirmation, B1–B5 deep dive, pacing, fault/recovery and instrumentation subset into a single “Declared controls” allowance of 15–60 hours. It never declares that inventory's counts, selected profiles/cells, observation durations, or bounded repeat policy. The mandatory open-conversation scenario is named in Task 10 but has no planned arrival-series extent or duration in this allowance. The table also combines tiers instead of giving the required family-by-tier ranges.

This is an execution and approval gap rather than a request for more precise performance predictions. Task 7 is told to implement an estimator that includes every experiment/control/repeat/soak, but its input policy does not say what several mandatory experiments are or how many to count. Different implementers can produce materially different coverage and cost while claiming to have followed the same plan. A cumulative stop ceiling prevents an unlimited run, but does not define which finite campaign is being quoted or establish that the 15–60-hour allowance covers it. The plan appropriately warns that the 12-hour checkpoint and 160-hour ceiling can yield partial research; that warning should remain.

The existing numbers already show why the missing tier breakdown matters. Assuming the declared two profiles and all confirmation packages are feasible, Tier 1's priced families alone are 4 F1 discovery series, 16 M1 discovery series (8 research and 8 default), and 16 confirmation packages. At the plan's own unit ranges, that is **41.2–302 target-environment hours before the control allowance**, not a forecast that 12 hours completes Tier 1. Tier 2's corresponding families are **47.6–238.8 hours** before controls; Tier 3 discovery plus ten scaling/matched-baseline confirmation packages are **24–182.8 hours** before controls. These reconcile to the existing 112.8–723.6 subtotal before its 15–60-hour control bucket. The arithmetic is internally consistent; the control policy and tier attribution are the missing pieces.

**Required revision:** Add a compact bounded control/experiment inventory and a family-by-tier estimate derived from it. Specify the minimum required control cells/profile coverage, durations or explicit duration bounds, repeat counts, and any adaptive stopping rule for the currently combined families. Include the mandatory open-conversation workload, pre-plateau 1.5× infrastructure checks, load-one tuple/fixture feasibility work, F1 reduction/quantitative-comparison controls, paired B1/B2/B3/B4/B5 and two/eight pacing coverage, topology protection checks, instrumentation pairs, and worker/instance skew/recovery subsets. Reuse is acceptable where exact configuration/profile equivalence is recorded; identify what can be reused. If a count depends on the later baseline or funded calibration tuples, give a bounded parameter/range and require the concrete quote to freeze it before execution. Retain helper-host accounting and owner approval at Task 0; no current SKU or live benchmark is required for this revision.

**Acceptance checks:**

1. Each mandatory family maps to a tier and a finite parameterized count/duration/repetition policy that Task 7 can encode without inventing experimental scope.
2. The estimator's planned tests cover omission of a mandatory family and reconciliation of tier subtotals, controls, and the whole campaign estimate.
3. The estimate explicitly includes reused versus fresh infrastructure/feasibility controls, failed/infeasible attempts and fallback substitutions as appropriate, and preserves partial-report behavior when the approved budget is exhausted.
4. The plan distinguishes the initial 12-hour checkpoint, the estimated full Tier 1 work, and the cumulative 160-hour stop policy. Revised ranges may exceed that ceiling; do not reduce required scope merely to fit it.

## Optional suggestions

### R1-O001 — P3: Choose the initial uncertainty display method and test its evidence inputs

**Locations:** plan lines 375–397; spec lines 272 and 384–390.

The plan correctly preserves per-run/per-stratum values, histogram precision, three independent passing repeats and minimum sample counts, and forbids averaging percentiles. It does not select the initial uncertainty representation or explicitly name independent-session counts among the screen/report outputs. A small addition could choose a descriptive per-repeat range initially, record session counts and percentile estimator/histogram precision, and avoid implying that the range is a confidence interval. A later bootstrap or formal interval need not be added to this work. Add one fixture proving that a missing applicable evidence input cannot be concealed by pooled timing volume. This is optional because the governing specification already requires the uncertainty evidence and remains explicit authority.

### R1-O002 — P3: Make incomplete-run evidence durable before final manifest publication

**Locations:** plan lines 193–211 and 348–364; spec lines 257, 305 and 328.

The plan requires stopped-run preservation and immutable finalized evidence, but the writeRun/runExperiment interface descriptions emphasize final manifest creation. When implementing, use a bounded append-only run journal or equivalent external raw stream plus a terminal manifest so process interruption before finalization still leaves identifiable raw evidence and a recoverable incomplete-run status. Include an offline interrupted-mock-run fixture. This is optional design guidance, not a demand to alter the schema or write application code now.

## Whole-artifact review assessment

- **Execution boundaries and dependency order:** Tasks 0–10 form a coherent serial dependency graph. Actual accepted application source is a hard prerequisite. Candidate branch paths are explicitly provisional. The plan neither reconstructs a reference application nor treats docs-only issue #39 as application-edit authority. The staged test/code/verification instructions are sufficiently concrete for the core harness modules.
- **Statistics and capacity labels:** The empirical 99.9% screen is qualified; ordinary failed offers remain in the denominator. Minimum p95 samples, exploratory p99, three independent repeats, sparse/inconclusive outcomes, distinct candidate checks and an additional soak are retained. A one-session candidate carries the no-headroom exception. Event-loop p99 gates confirmed capacity as well as the candidate. Discovery-only points cannot become confirmed operating counts. The plan's large runtime envelope honestly acknowledges sparse-baseline costs rather than relaxing sample thresholds.
- **Voice and concurrency correctness:** All ordinary M1 input types remain output-enabled, with independent per-turn seeded mixture. Text success cannot hide missing speech. The delayed second-segment-after-SSE regression, per-session generation/history ownership, one active speech request, exact segment/queue policy, valid PCM samples, delivery versus virtual playback, busy-schedule misses, bounded observation/drain and unresolved cancellation semantics are all preserved.
- **Streaming feasibility and optional observations:** Task 5 makes actual POST/multipart SSE, split parsing, early semantic output, abort and speech/answer concurrent progress a blocking prerequisite. It does not substitute buffered HTTP, change the public transport, or label Node load generation as k6. Missing client first-audio observation stays unavailable or is supplied only for the separately validated observer's recorded scope. The uncertain extension/build remains explicit, with a separately estimated remedy if necessary.
- **Realistic-wait fallback:** Four-turn infeasibility triggers the unchanged two-turn Tier 1 replay at every executive pair. The sole predeclared one-turn substitute has correct 48-second minimum gap and 38.4-second occupancy bound, requires separate agreement, and does not permit indefinite pacing search. Empirical calibration remains distinct from hypothetical profiles. The report leaves VP question 4/realistic-wait Tier 1 incomplete when required evidence is unavailable.
- **Resources, admission and topology:** Separate target/peer cgroups, production builds, fixed heap policy, research admission versus shipped 2/2 controls, nonbinding requirements and correct worker/instance efficiency formulas are explicit. Supported workers may be unavailable without invented Next.js clustering. Independent 1.5× infrastructure proofs precede plateaus; telemetry loss, simulator lag, swapping and peer limits prevent isolated service claims. Actual Origin/Host protections and fail-closed paid egress are tested through the measured path.
- **Spend and calibration:** The USD 10 aggregate and initial 30-request/provider caps, charged continuations/cancellations/warmups, conservative pre-call reservations, durable unresolved reservations, no automatic retry and unknown-rate refusal are retained. Optional cells and connection/concurrency characterization remain within the same budget. Paid calibration is separate from mock execution and requires concrete agreement.
- **Raw evidence and reporting:** Source/input/image hashes, schema versions, exact output roots, immutable artifact references, no inaccessible-raw pass, deterministic rerender, independent-percentile prohibition, unknown price propagation, containing-SKU pricing and projected telephony/cloud transfers are appropriately specified. Completion requires all required tiers and evidence, with unavailable/reduced/infeasible states visible.

## Session and handoff record

The first AITM start attempt encountered a transient GitHub TLS handshake timeout; the exact start was retried successfully. `npx aitm start 39 --role agent` bound this reviewer in `/Users/kpburson/projects/AIVC`; status/fleet showed #39 active in main/trunk. The issue-scoped occupancy record matched this native review thread, rather than an inherited parent session identifier. Project preferences were read through getPreferences(). Explain returned `indeterminate`, blocker `state-unavailable`, with no automatic remediation, matching the coordinator's disclosed Backlog/no-sentinel limitation. No lifecycle movement was attempted.

A memory lookup was denied by the repository hook's read scope; no memory content was used. This did not prevent review of the complete supplied artifacts.

The reviewer will pause its timer and release only its own #39 occupancy after saving this report. Coordinator action: address R1-F001 in the plan and record the disposition, then return the full revised artifact and exact next report path to this same reviewer session. Optional observations need not block acceptance. This round does not authorize plan execution or paid work.
