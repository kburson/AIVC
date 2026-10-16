> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/b612108309811663ffad1e04ba2005621c68ea5f/docs/peer-reviews/spec/voice-bff-performance-research-design-review-d0308a82e10640138be8eed7916011be/xpr/2026-10-15-2026-10-14-39-voice-bff-performance-research-design-review-2cf04b3fce92c2a6faacb5bb36a1efb1-author-response-1.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-16-39-originals.json).
> Original SHA-256: `4c5db3041254a64b0e81a46ca981560c7dd70ecc1e156f0aec7be311cacbe463`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:f81da1894a46ceb20866070833b4e99ef536ef633542b418783d29e6a981dbd8" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-2cf04b3fce92c2a6faacb5bb36a1efb1'
role: 'author'
turn: 1
commit_mode: 'normal'
authority_assurance: 'unavailable'
artifact_path: 'docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md'
artifact_commit: '07301c9c720a199850d0e8720316940575ddd1ae'
artifact_blob: '8c0099734220fc899fb9a70d7843df2ad7a9c18f'
artifact_digest: 'sha256:28a34d9d29bdfcc3effd59e8c85231073316cb25b3725dc353c34255aaca1438'
agent:
  host: 'codex'
  provider: 'openai'
  model_id: 'gpt-6.1-sol'
  model_display: 'gpt-6.1-sol'
  session_fingerprint: 'sha256:dbfd83a85ef32a9b4daf13b11bad1d57d573574df4d33b1a5d6754e4148fed5f'
  identity_source: 'runtime'
started_at: '2026-10-15T04:59:28.017Z'
submitted_at: '2026-10-15T05:11:14.017Z'
finding_ids: []
answered_finding_ids:
  [
    'R1-F001',
    'R1-F002',
    'R1-F003',
    'R1-F004',
    'R1-F005',
    'R1-F006',
    'R1-F007',
    'R1-F008',
    'R1-F009',
  ]
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

Read the complete sealed first-round reviewer response and checked its reference-contract premises against the governing reference specification: typed-output behavior, Models API/search configuration, loopback Origin/Host admission, speech segmentation/backpressure, and two-turn/two-speech per-process limits. All five required findings and four optional suggestions are addressed in the revised specification. The revision remains a proposed research specification for owner review; no application change, benchmark, paid calibration, implementation plan, deployment, or production capacity claim was performed.

The design retains the fixed backend submission-demand schedule with the reviewer's option (a): an explicit load-one feasibility gate. It makes default versus research admission visible, selects output-enabled per-turn M1, declares the isolated-network configuration deviation and conformance checks, and assigns discovery versus confirmation work to publishable tiers. No sealed historical SAR or reviewer response was changed.

## Finding dispositions

| Finding | Disposition and evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1-F001 | Addressed in section 16.6. Primary matrix and candidates use a bounded, finite mock-only research admission selected by a pilot and frozen across comparable single-process cells. Zero admission 429s at the last passing point and candidate establish nonbinding admission there. If admission binds first the hardware boundary is censored and the result labeled admission-bound. Default two-turn/two-speech controls remain at the four executive configurations. All limits are recorded per process and aggregate. Hardware scaling efficiency requires nonbinding admission in every deployment; equal-aggregate admission-bound controls receive no hardware-efficiency number. Worker ratios also distinguish equal aggregate allocation from horizontal n-times-resource scaling.                                                                                                                                                                                              |
| R1-F002 | Addressed in section 16.7 and the section 9 cross-reference. The fixed schedule now requires load-one maximum occupancy plus 20% of the minimum gap to fit that gap, with explicit two/four/eight-turn arithmetic (19.2/9.6/4.8-second occupancy ceilings). A load-one busy miss or failure of the bound makes the combination infeasible-by-workload/profile and invalidates the capacity screen; higher-load misses after a feasible baseline remain failed offers. The primary minimum-wait four-turn M1 must prove its concise fixtures, including the mandatory multi-segment B3 case, fit without changing the reference speech policy. Slow replay and eight-turn voice combinations may be visibly infeasible. Input fixtures remain completed prerecorded uploads; input audio duration is costed, but this controlled backend profile expressly does not claim a realistic capture/think-time cycle.                                                                               |
| R1-F003 | Addressed in sections 9 and 16.7, with outcome/budget alignment in 16.1–16.2. M1 types are independently seeded categorical draws per intended turn within a conversation, with realized offered/admitted compositions by session/turn retained. All ordinary M1 types enable output, including typed B1/B2; every required speech request and voice oracle applies. Explicit output-muted B1/B2 isolation controls use the text oracle, are labeled departures, and cannot substitute into M1. The completion regression metric follows output mode rather than input type.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| R1-F004 | Addressed in section 16.8. A private isolated test network is an explicit configuration deviation from the unchanged reference loopback default. Bind addresses, real retrieval URL, exact Origin/Host allowlists and balancer header policy are recorded. Allowlisted origins identify the targeted BFF, not generator source IPs. Host is preserved or one explicit balancer target Host is configured with matching client Origin; no wildcard or forwarded trust is introduced. Shared loopback namespaces retain independent cgroup budgets. Actual-topology checks on both paid-capable routes prove 403 with zero upstream work for missing, malformed, null, disallowed and mismatched admission inputs before each series.                                                                                                                                                                                                                                                          |
| R1-F005 | Addressed in sections 10 and 16.9. Every executed discovery cell runs procedure steps 1–3 and 6. Paired executive M1 and selected scaling configurations used for operating costs/efficiency additionally require steps 4–5. Discovery-only cells receive no confirmed capacity or operating-count label. The future plan must estimate machine-hours, host-hours, spend, setup/analysis effort and a maximum campaign budget for owner approval before execution. Tier 1 prioritizes executive BFF/F1/default-admission decisions; Tier 2 supplies the full required resource discovery; Tier 3 supplies scaling/robustness. The only permitted reduction is Fastify-constrained BFF-path memory cells after measured full-F1 memory insensitivity and 10-times peak-lookup headroom controls. Reduced cells remain unmeasured and the rule is rechecked after scaling. Both BFF-constrained and F1 full matrices remain required. Partial reports explicitly state incomplete tiers/scope. |
| R1-F006 | Addressed in section 16.7. Initial actual session starts are staggered across one residence period, with real histories and a full-population ramp before the steady window. Replacement slot phases, drain-induced shifts and waves stay visible in time-series data. Section 16.9 budgets at least a 180-second population ramp before steady observations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| R1-F007 | Addressed in section 16.8. Primary mock and calibration manifests explicitly disable hosted search and retain stable tool definitions. Search-disabled mode does not need its search-support Models API check. Any separate SDK-required model validation uses a deterministic simulator response in mock mode or a recorded real metadata request in calibration, retaining egress/spend accounting and not treating ambiguous work as free. Hosted-search characterization needs separate scope/spend authorization.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| R1-F008 | Addressed in section 16.9. The 20 ms event-loop-delay p99 rule gates every confirmed low-lag capacity and its 75% candidate together with the other thresholds. Beyond-rule curves are descriptive rather than a second accepted operating point.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| R1-F009 | Addressed in section 16.10. Infrastructure validation precedes each plateau at 1.5 times its profile-specific request/connection/byte/output demand; the discovered boundary and higher aggregate scaling demand receive rechecks. Unvalidated points remain censored. A nonbinding sink/driver excludes the constrained application from the infrastructure control.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

## Changes made

Added normative sections 16.6–16.10 and aligned the earlier workload, completion-oracle, metric-budget, discovery, coverage-table and completion clauses with them. The section-16 governing rule remains explicit near the start. These changes preserve the original architecture boundary, full BFF/F1 CPU-memory discovery, paid caps and reservations, no-paid-egress proof, correlated clocks, voice settlement, sample-count/inconclusive rules and evidence-versus-projection distinctions.

A finite pilot-selected research admission limit is deliberately not a fabricated numeric configuration: the future plan must specify the integers and validate them before comparison. Reaching the limit censors hardware capacity rather than authorizing an unlimited queue. Likewise, campaign execution hours are not invented without a selected baseline host and bracket depth; a bounded estimate and owner execution budget are required in the later plan. These are explicit prerequisites, not present results.

## Declined changes and rationale

None. For R1-F002, selected the reviewer's fixed-schedule feasibility alternative rather than a completion-relative cycle. This preserves the earlier SAR protection against hidden demand suppression while making fixture/profile infeasibility and the limits of backend-only pacing explicit. The ordinary minimum-wait case must demonstrate feasibility; a failing replay or high-pacing case is retained as such.

## Verification

- Read the entire sealed reviewer response and inspected the governing reference clauses on automatic typed speech, segment caps, sequential playback backpressure, search startup behavior, loopback admission and per-process active-request limits.
- Reviewed the specification diff, targeted revised clauses and all appended normative sections against all nine closure conditions. The primary 16-cell BFF sweep and F1 sweep are preserved; only the measured-rule Fastify BFF-path reduction is permitted.
- `git diff --check` completed with exit 0 before submission. Tracked changes are confined to the exact specification; generated XPR files remain in the exact shared xpr stage. Unrelated untracked `apps/` is untouched and excluded from protocol commits.
- Direct SHA-256 of the revised artifact before package submission: `2ee7b08cff5b8d5cf5f655bffc08a65219b0e9d0dc6e03b86e84654788a832e5`. The package seals its authoritative submitted digest and revision commit.
- Own AITM status confirms active issue #39 in main. Backlog pickup remains deferred and Explain navigation remains indeterminate/state-unavailable; no lifecycle state transition was attempted. Package author identity and genuine Claude reviewer identity remain distinct.
- No runtime test or benchmark applies to this documentation-only review revision. No test result, implemented admission configuration, capacity, spend or execution-plan acceptance is claimed.
- Local generic edit hooks rejected patch parsing and a Python command's classification; the explicit exact-document cat/sed path succeeded. No hook was disabled, identity copied, guard configuration changed, sealed reviewer evidence overwritten, or manual Git commit made.
