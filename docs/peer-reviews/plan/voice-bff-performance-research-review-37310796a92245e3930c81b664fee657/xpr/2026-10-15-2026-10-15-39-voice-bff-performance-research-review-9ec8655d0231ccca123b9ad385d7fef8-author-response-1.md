> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/b612108309811663ffad1e04ba2005621c68ea5f/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-author-response-1.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-16-39-originals.json).
> Original SHA-256: `9be26a8582d0dd9871e0664f21143aec4bb21d574228cf2a15b4a1543f6eedf8`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:f81da1894a46ceb20866070833b4e99ef536ef633542b418783d29e6a981dbd8" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-9ec8655d0231ccca123b9ad385d7fef8'
role: 'author'
turn: 1
commit_mode: 'normal'
authority_assurance: 'unavailable'
artifact_path: 'docs/superpowers/plans/2026-10-15-39-voice-bff-performance-research.md'
artifact_commit: 'a3411ec08de263b17868d6c2df268948f3ee8589'
artifact_blob: 'cf75585760ee371e7b53f0631a7fbd07fdf1b02a'
artifact_digest: 'sha256:690870a0d17b1a6af701f710a6dd0edc9154096b5645fd2440ace6e2465a069a'
agent:
  host: 'codex'
  provider: 'openai'
  model_id: 'gpt-6.1-sol'
  model_display: 'gpt-6.1-sol'
  session_fingerprint: 'sha256:bbf03239804b4a7748c34bdc62392c2644e40f725937a1e1f2e312019fbe30a7'
  identity_source: 'runtime'
started_at: '2026-10-15T06:14:53.179Z'
submitted_at: '2026-10-15T06:25:52.563Z'
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
  ]
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

Read the entire sealed round1 report after authenticated author handoff sequence8. Revised only the implementation plan. All four required findings and four optional findings are addressed. The governing spec is unchanged. Normative section11 supplies the cross-task contracts and negative fixtures; existing interfaces, affected inventory rows, totals and example tests are amended in place. Normal commit-mode manual XPR continues with authority assurance unavailable. No implementation test, benchmark, paid calibration, procurement, migration or lifecycle movement occurred.

## Finding dispositions

| Finding | Disposition | Change and rationale                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1-F001 | Addressed   | Task6 now consumes per-context feasibility. Any Tier1 four-turn failure triggers unchanged two-turn replay at all four pairs and both admission modes. Feasible four-turn packages remain and gain substitutes; failed packages are replaced. At most seven additional packages are possible because at least one of eight contexts must fail to trigger the fallback. Sections3/8/11 quote0–130.2 extra package hours and up to196 extra infrastructure windows0–6.5333h. Existing eight fallback topology series cover substitutes. Mixed/no-failure/all-failure/unknown tests and unique-window accounting prevent undercount or double charge. T1 upper507.6h and full upper1325.7333h remain conditional, not approved.                                                                                                                                                                                                                                                                           |
| R1-F002 | Addressed   | Section11 gives family-specific measured and auxiliary topology. Off-path BFF and F1 core use separate fixed1CPU/2GiB helper cgroups, with recorded finite balancer allocation and actual helper lifetime in the quote. They do not consume the target quota. All18 probes traverse the real deployed entry paths. Preflight traffic has separate journal/denominator/usage records; complete stream/upstream/lease/queue settlement and collection flush precede counter reset and warmup within the bounded preflight. Failure blocks the series. Auxiliary resource/host cost is charged once by lifetime. Tests reject shared target budgets and unsettled/leaked preflight traffic.                                                                                                                                                                                                                                                                                                               |
| R1-F003 | Addressed   | Section11 defines five coherent end-to-end repetitions of each ordinary fixture. Ordered parent/operation records preserve actual STT/model/tool/TTS relationships without sample splicing. One-segment B1/B2/shortB3 and two-segment multiB3 yield maximum25 model,10 STT,25 TTS requests. TTS lengths fit the effective cap. Cold/reused observations reuse those operations; metadata is separately reserved inside remaining caps. Old characterization examples are secondary and unfunded by the primary table. Optional extra cells are omitted first and require a revised approved quote; no favorable retry or silent fixture loss. Whole-casebook unit/price funding must pass before any call; proposed6/1/3USD provider reservation ceilings sum to10USD, but actual price sufficiency remains unestablished until the dated quote passes. Unknown/excessive costs dispatch zero requests. Fake-client tests cover counts, coherent provenance, no optional charges and unfunded refusal. |
| R1-F004 | Addressed   | Section11 additively requires offerClassification/reason, input/output modes, oracleId, requestId and speech records in the v1 JSON schema before records are produced. Busy misses remain aggregate failed offers with a distinct class and no admitted latency sample; load-one versus higher-load treatment is explicit. SpeechRequestRecord has run/session/turn/generation/segment/request IDs, intended/actual initiation, first valid PCM/completion, bytes/outcomes and separately named request-local server duration. Tasks1/6/8 round-trip and screen fixtures reject missing, duplicate, stale or inconsistent data and preserve delayed second speech.                                                                                                                                                                                                                                                                                                                                    |
| R1-F005 | Addressed   | Header and section7 consistently recommend native inline executing-plans, retaining owner choice and separate implementation approval.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| R1-F006 | Addressed   | Header assertions tolerate missing Server-Timing using null-coalescing. Tuple example checks repeatability, with normative immutable-source/multiple-seed assertions. Baseline exec mock answers the expected HEAD query; normative fixture guidance supplies tracked-byte reads without query-order assumptions. These remain proposed tests.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| R1-F007 | Addressed   | Replaced ambiguous Fastify confirmation label with lookup-constrained. Artifact status points to archived exact review decisions instead of claiming XPR has not started.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| R1-F008 | Addressed   | Section11 records infrastructure502/503/reset evidence bypassing application spans and preserves failed offered-work accounting without invented timings. Negative fixtures cover pre-dispatch503 and mid-stream reset, usage/settlement and no duplicate dispatch.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

## Changes made

Preserved direct Fastify core, independent lookup, thin Next.js, separate auth, streaming/abort/backpressure, immutable evidence, output-enabled M1, empirical counts/confirmation, deadlines/settlement, finite admission, paid ceilings and migration prerequisite. Section11 clarifies contracts inside the plan; it does not amend the governing spec.

Conservative core upper853.8h plus controls471.9333h gives total1325.7333h; lower259.4167h remains. T1 upper507.6h; infrastructure maximum3084; topology250. Base versus conditional additions remain explicit. The12-hour checkpoint and proposed160-hour stop still preserve incomplete coverage. No mandatory family was removed to fit them.

## Declined changes and rationale

None. Current provider rates were not invented or purchased. Dollar funding is an explicit whole-casebook pre-dispatch proof with proposed provider ceilings; price sufficiency remains a prerequisite rather than a present fact. Missing supported coherent cases or funding leave empirical coverage unavailable.

## Verification

Read the full input plan/spec, predecessor SAR reports/dispositions and corrected-scope acceptance. Read the full sealed round1 report before revising. Reviewed the document diff, affected interfaces/inventory references, example fixtures and arithmetic. Git whitespace checks passed before submission. Arithmetic:7*(1.6+17)=130.2;7*(12+16)=196;196*2/60=6.533333;432.2+75.4=507.6;853.8+471.933333=1325.733333;716+1192+1176=3084. Primary TTS/model25 and STT10 bound the declared operation set; metadata must fit residual count and dollar reservations. These are document checks, not executed proposed harness tests.

A compound response-write/check command was refused by the task hook as lacking binding; no write occurred. Genuine AITM start returned already active#39 and fresh Explain preserved indeterminate state-unavailable. Separate exact-path response edits then succeeded. No identity was substituted or lifecycle moved. Unrelated untracked apps/ remains preserved. Package submission owns the exact revision commit.

Reviewer should re-read the entire revised artifact against the entire governing spec, including sections10–15 as well as16–18. Prior SAR and these dispositions provide context rather than acceptance authority. Continue in the same recorded Claude session until genuine acceptance/finalization or the sealed stopping condition.
