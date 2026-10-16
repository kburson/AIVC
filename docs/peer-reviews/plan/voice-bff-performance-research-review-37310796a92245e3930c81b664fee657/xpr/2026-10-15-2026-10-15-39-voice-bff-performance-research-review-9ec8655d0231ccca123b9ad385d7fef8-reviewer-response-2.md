> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/b612108309811663ffad1e04ba2005621c68ea5f/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-reviewer-response-2.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-16-39-originals.json).
> Original SHA-256: `558c9950f05f28abd32200c3cfc4725345f9191c36d4e466839bd40717f2693b`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-9ec8655d0231ccca123b9ad385d7fef8'
role: 'reviewer'
turn: 2
commit_mode: 'normal'
authority_assurance: 'unavailable'
artifact_path: 'docs/superpowers/plans/2026-10-15-39-voice-bff-performance-research.md'
artifact_commit: '8109522128c13412f8333d0029d5382011a3feb3'
artifact_blob: '09df0a348162042e02efb81c890d47ecb573942e'
artifact_digest: 'sha256:4e9f4e00b671e461e0a66951246441bf29e2ed5a0939fd58bfd4be10f8a6b018'
agent:
  host: 'claude-code'
  provider: 'anthropic'
  model_id: 'claude-opus-5-5'
  model_display: 'claude-opus-5-5'
  session_fingerprint: 'sha256:e05027dbc00897fc6a3e980f19c2de7bbe9c8eba3dda27db6159a5d026df83c0'
  identity_source: 'runtime'
started_at: '2026-10-15T06:15:55.566Z'
submitted_at: '2026-10-15T06:27:53.033Z'
finding_ids: ['R2-F001', 'R2-F002', 'R2-F003', 'R2-F004']
answered_finding_ids: []
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

This is the round-2 independent XPR of the revised plan. The commit, blob and digest are bound in the frontmatter above. I re-read the entire revised artifact (all 718 lines, including the new normative section 11) against the governing spec. The spec's sections 2–18 were read in full across both rounds, and this round I specifically re-read sections 10–15 and 16–18, as the author requested. I read author response 1 for context only; every disposition below was checked against the artifact text, not against the author's summary. No harness code, tests, k6 builds, benchmarks or paid calls were run.

**R1-F001 (mixed per-pair fallback): resolved.**

- `chooseReplayPacing({contexts,oneApproved})` now takes all eight Tier 1 replay contexts as separate records.
- Any four-turn failure triggers two-turn replay at all four pairs in both admission modes, which matches spec 16.7.
- A feasible four-turn package is kept and gains a two-turn package. An infeasible one is replaced.
- Missing results block the decision instead of defaulting to true or false.
- I re-derived the budget. The 7-package cap follows from 8−F with F≥1. Hours: 7×(1.6+17)=130.2. Headroom windows: 7×(12+16)=196, which at 2 minutes each is 6.5333 h. Topology series: the existing eight fallback series cover every substitute exactly once.
- Totals: Tier 1 core 41.2–432.2 h, controls 11.3–75.4 h, total 52.5–507.6 h. Whole campaign: core 112.8–853.8 h, controls 146.6167–471.9333 h, total 259.4167–1325.7333 h. Headroom windows: 716/1192/1176, total 3084.
- These figures are consistent across sections 3, 8 and 11 and the Task 7 fixture.

**R1-F002 (topology preflight): resolved.**

- Section 11 lists, for each family, the measured topology and the auxiliary protection targets.
- An off-path web BFF and the F1 reference core each run at a fixed 1 CPU/2 GiB, in separate cgroups on helper infrastructure. They never use the constrained target's quota, and they are charged once, by lifetime.
- The full 18-request proof is kept. "Actual-path" is redefined as each entry's real deployed path.
- Preflight traffic has its own journal, denominator and usage ledger. All settlement and the collection flush must finish inside the preflight bound, before counters reset and warmup begins.

**R1-F003 (calibration tuples): resolved.**

- The primary paid casebook is now five coherent end-to-end replicates of each of the four ordinary fixtures, with ordered operation IDs and no splicing of samples from different runs.
- Maximum requests are 25 model, 10 STT and 25 TTS, within the 30-per-provider cap. Segments fit the 84-character cap.
- Secondary characterization cells are unfunded and are dropped first. The order in which cells are given up is declared in advance.
- A pre-dispatch whole-casebook quote must prove both the count caps and the USD 10 ceiling. Otherwise it returns `unfunded-casebook` and dispatches zero requests.

**R1-F004 (record schema): resolved.**

- `TurnRecord` now additionally requires `inputMode`, `outputMode`, `oracleId`, `requestId`, `offerClassification` (including `busy-schedule-miss`), a bounded `reason`, and a `speech` array.
- A busy miss is recorded as a failed offer with no latency sample, and is treated differently at load one than at higher loads.
- A full `SpeechRequestRecord` provides segment correlation on the client clock, and the server duration is named separately.
- Round-trip and screening tests are specified.

**R1-F005 to R1-F008: addressed as described.** The header and section 7 now agree. The tuple, header and exec-mock test examples are fixed. The "lookup-constrained" label and the archive-pointer wording are in place. Infrastructure-generated 502/503 responses and resets are counted as failed offered work, with negative fixtures.

On the re-read I found no regressions and no new blocking defects. Spec 16.10 headroom, 16.6 admission, 16.3 statistics, 16.4 scheduling, the section 10 procedure and thresholds, and the section 14 completion conditions are all still respected. I have four non-blocking suggestions below.

## Findings

None.

## Required changes

None.

## Optional suggestions

### R2-F001 — State where the measured web BFF runs in the forwarding family

The section 11 topology table puts the auxiliary BFF on helper infrastructure, but it only says the **measured** BFF in the web-forwarding comparison "has its fixed 1CPU/2GiB allocation". It does not say whether that BFF runs on the target host or the helper host. Section 3 sizes the target host for exactly 4 CPU/12 GiB plus OS headroom. At the 4 CPU/12 GiB pair, co-locating the measured BFF would need about 5 CPU/14 GiB, and so would undercut the dedicated-core claim. Stating the placement explicitly would remove this ambiguity: for example, on the helper host, or on a target host sized for both, with its network hop recorded.

### R2-F002 — Reconcile the subset unit tests with "missing results block"

Section 11 says missing context results block the aggregate decision. Yet the Task 6 examples call `chooseReplayPacing` with a single context and expect a run action. That is intended as a "supplied subset" mapping. An explicit discriminator would stop an implementation from passing the unit tests while silently accepting a partial campaign input. Options include a required `expectedContextIds` list, or a `scope:'subset'|'campaign'` field that blocks unless all eight IDs are present.

### R2-F003 — Record deferred spec-6 calibration cells as explicit unavailable entries

Spec section 6 lists several reasonable initial cells: model longer bounded context, STT 15-second input, standalone TTS at 120 and 300 characters, and a concurrency-three sample. Spec section 14 requires that unavailable samples be identified honestly. Section 11 correctly demotes these cells to unfunded secondary status. Consider requiring the calibration manifest and the report's external-limitations section to list each one as `unavailable: not funded in primary casebook`, so the omission is visible, not just absent.

### R2-F004 — Bound real-model output so the five-replicate coherent shapes are achievable

The primary casebook requires B1, B2 and short B3 to produce exactly one segment of at most 84 characters, and multi-segment B3 exactly two. A case outside that shape counts as unsupported, and there are no retries. To keep K=5 realistically reachable, the calibration request settings could bound model output to the declared shape, using the fixture prompt plus a maximum-output-token setting recorded in the manifest. The settings should also state that any segment beyond the declared shape is never sent to TTS and is recorded as an unsupported case. This is a fidelity and yield improvement only; it changes neither the paid limits nor the oracle.

## Decision

accepted
