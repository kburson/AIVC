<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-2cf04b3fce92c2a6faacb5bb36a1efb1"
role: "reviewer"
turn: 2
commit_mode: "normal"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md"
artifact_commit: "55d8d208d0a5c465fdec820b11688e112afa6865"
artifact_blob: "1ce75a4485a1a89be7697a300cba6828ff2b985b"
artifact_digest: "sha256:2ee7b08cff5b8d5cf5f655bffc08a65219b0e9d0dc6e03b86e84654788a832e5"
agent:
  host: "claude-code"
  provider: "anthropic"
  model_id: "claude-opus-5-5"
  model_display: "claude-opus-5-5"
  session_fingerprint: "sha256:fa258c7fab72affedc1cbbed003c94c72e90757978a36794cea76dfb997ec052"
  identity_source: "runtime"
started_at: "2026-10-15T05:00:22.224Z"
submitted_at: "2026-10-15T05:13:27.248Z"
finding_ids: ["R2-F001","R2-F002"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---

Mode: `normal`

## Summary

This is round 2 of the independent XPR, from the same registered reviewer session. Material re-read:

- The full revised specification, 472 lines; the sealed digest is in the frontmatter. The reviewer did not hash it independently because shell hashing is not permitted in this session.
- The complete author response 1, including all nine dispositions.
- The governing reference-design clauses on which the round-1 premises rested.

The judgment covers the whole document, including how earlier sections interact with the new normative sections 16.6–16.10. It does not rest only on the disposition table.

**Every round-1 finding is closed:**

| Finding | Status | Evidence in the revised specification |
| --- | --- | --- |
| R1-F001 (admission) | Closed | Section 16.6 (lines 422–426). The primary series uses a finite admission limit, selected by a pilot and frozen, that is declared per process and in aggregate, with no unbounded queue. "Nonbinding" requires zero 429s at the last passing point and at the candidate. A result where admission binds first is labeled admission-bound and the hardware boundary is censored. A separate default series of two turns and two speech requests runs at all four paired configurations. Hardware scaling efficiency is published only when admission is nonbinding in every compared deployment. Equal-aggregate worker comparisons use `C(workers) / C(one process)` and no longer reuse the n-times-resources formula, which also fixes a latent formula mismatch I had not raised. Manifests record admission mode, limits, and rejection evidence. |
| R1-F002 (schedule feasibility) | Closed | Section 16.7 (lines 434–439). The author chose option (a). The occupancy ceilings of 24/12/6-second minimum gaps less 20%, giving 19.2/9.6/4.8 seconds, are arithmetically correct for the declared jitter. A busy miss or bound failure at load one makes the combination infeasible-by-workload/profile, not a capacity failure. Misses at higher load remain failed offers, so the SAR R4 protection against hidden demand suppression is preserved. The primary minimum-wait, four-turn M1 must prove that its fixtures fit, including the mandatory multi-segment case, without changing reference speech policy, or the primary scenario is blocked. That rule rules out silent fixture shortening. Under minimum-wait TTS, two short segments fit under 9.6 seconds with the reference's two-second low-water gating, so the gate is satisfiable. |
| R1-F003 (M1 output and mix) | Closed | Sections 9 (line 219), 16.1 (line 368), 16.2 (line 372) and 16.7 (lines 430–432). Turn types are seeded categorical draws per turn within each conversation, and realized composition is recorded. Every ordinary M1 type is output-enabled, matching the reference's typed-path behavior on line 91, and is judged by the voice oracle. Muted B1/B2 controls are labeled departures that never substitute into M1. The 250 ms completion budget follows output mode rather than input type. "Voice-bearing" is defined. |
| R1-F004 (topology and admission deviation) | Closed | Section 16.8 (lines 445–447). The private test network is a declared configuration deviation. Bind addresses, retrieval URL, allowlists, and balancer Host policy are recorded. The allowlist correctly names the targeted BFF origin rather than the generator's IP. There is no wildcard and no forwarded-header trust. A shared loopback namespace is permitted only with separate cgroups. Before every series, a conformance check on both paid-capable routes through the real network path must show 403 with zero upstream work. |
| R1-F005 (procedure scope and effort) | Closed | Section 16.9 (lines 453–467) and the realigned sections 10 and 14. Every executed cell runs steps 1–3 and 6. Steps 4–5 (repeats, candidate, soak) apply to the paired configurations and to the selected worker/instance configurations. Discovery-only cells cannot receive a confirmed capacity label. The plan must supply machine-hour, host-hour, and cost estimates, and a maximum budget that the owner approves before execution; when the budget is reached, work stops and a partial report is published. The three publishable tiers have a coverage ledger. The only reduction allowed is a tightly evidenced rule for the Fastify-constrained memory cells, which is rechecked after scaling. |
| R1-F006 (session stagger) | Closed | Line 441, plus the 180-second ramp at line 461. Session starts are staggered across one residence period with real histories, and replacement waves stay visible. |
| R1-F007 (search configuration) | Closed | Line 449. Search is disabled for primary runs, tool definitions are stable, and any SDK model-validation call is simulated in mock mode or recorded during calibration. Hosted-search characterization needs separate authorization. |
| R1-F008 (event-loop-delay threshold) | Closed | Line 463. The 20 ms event-loop-delay p99 rule gates every confirmed low-lag candidate. Curves beyond that rule are descriptive only, not a second operating point. |
| R1-F009 (headroom sequence) | Closed | Section 16.10 (line 471). Headroom is validated before each plateau at 1.5 times its demand, then rechecked at the boundary and at higher-aggregate scaling. Points that were not validated are censored. The control uses a nonbinding sink rather than the constrained application. |

**Whole-document check.** The revision preserves:

- the real BFF entry and the real Fastify peer;
- the full BFF-constrained and F1 16-cell discovery matrices;
- the paid-calibration ceilings and pre-reservation;
- the fail-closed mock egress;
- the correlated-clock rules;
- the text, voice, and cancellation outcome separation;
- the sample-count and inconclusive rules;
- the evidence-versus-projection labels.

No new contradiction was introduced:

- Section 1 states that section 16 governs. Two older sentences are now superseded by 16.10 and 16.9: line 161 ("highest accepted target load") and line 252 ("published low-lag operating point"). They do not conflict.
- Admission rejects still count in the 99.9% denominator. That stays consistent with 16.6, because the research limit must show zero 429s at accepted points.
- The tier table's steps 4–5 assignment is consistent with step 5's soak and with section 14's completion clause.

Two non-blocking observations remain. They are recorded as optional suggestions below. Neither prevents a conforming plan from producing honest, comparable results, so the specification is accepted.

No Git command, artifact edit, benchmark, k6 build, or paid request was performed.

## Findings

None.

## Required changes

None.

## Optional suggestions

### R2-F001 — Guarantee at least one feasible realistic-wait M1 series so VP question 4 is never left unanswered

The load-one gate in section 16.7 takes the **maximum** occupancy across all predeclared replay tuples and seed schedules. At four turns per minute the ceiling is 9.6 seconds. A calibrated replay tuple with realistic STT and first-token waits, together with the multi-segment audio playback, can plausibly exceed that ceiling on a single slow tuple. The whole replay profile would then be infeasible at four turns per minute in every cell.

Section 16.5 requires replay only "when schedule-feasible". Line 439 says a feasible sensitivity profile "may" be measured. A fully conforming campaign could therefore finish with no realistic-wait M1 capacity curve. VP question 4, on how external waits affect in-flight work, local capacity, and response delay, would then rest only on sensitivity and open-turn controls.

Suggestion: when replay is infeasible at four turns per minute, require at least the Tier 1 paired configurations to run the same replay profile at the slowest declared pacing that is feasible, which is two turns per minute (ceiling 19.2 seconds). Label it as a pacing substitute, not as the four-turn result. Infeasibility then stays visible and Q4 still gets a measured realistic-wait curve.

### R2-F002 — Add forward references in the superseded earlier sentences

Sections 16.9 and 16.10 now refine line 161 (the 1.5× headroom against "the highest accepted target load") and line 252 (the "published low-lag operating point"). Section 1 already makes section 16 governing, so nothing conflicts. Still, a short "(see 16.10)" and "(see 16.9)" at those two points would stop a plan author who reads sections 7 or 10 in isolation from implementing the older wording.

## Decision

accepted
