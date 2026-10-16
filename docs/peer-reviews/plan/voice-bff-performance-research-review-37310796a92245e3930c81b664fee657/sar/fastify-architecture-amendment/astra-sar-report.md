> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/b612108309811663ffad1e04ba2005621c68ea5f/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/sar/fastify-architecture-amendment/astra-sar-report.md) and its exact bytes remain available in the [evidence archive](../../../../../quality-evidence/2026-10-16-39-originals.json).
> Original SHA-256: `c7e2dd19ab89eb3becf6964bbcfbfdaa5d77c87d0e9eaf0cb981eecd00ebe438`. Review acceptance and protocol hashes apply to those original bytes.

# Story 39 Fastify architecture amendment — native SAR round 1

Decision: **accepted**. No required changes remain for this implementation plan under the corrected governing specification. Two optional implementation-test clarifications are recorded below. Acceptance is a document-review decision; it does not approve architecture migration, implementation execution, experiment spending, deployment, or research-completion claims.

## Scope, authority and lineage

Reviewed the entire corrected plan `docs/superpowers/plans/2026-10-15-39-voice-bff-performance-research.md` (625 lines), the entire corrected governing specification `docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md` (498 lines), the exact new scoped request, the preserved predecessor reports and dispositions, `sar/predecessor-scope-status.md`, and `sar/author-response-round-2-architecture-correction.md`.

Verified current artifact hashes:

- Plan SHA-256: `8c74c0533d3debe88f3f4f475361b2d3df87a3752b9df6aa25c903cf0ff52d66`; coordinator-supplied commit `200bb8c4680d22a1315e357ccf70dda19b7e451a`.
- Governing spec SHA-256: `7146781add44a11ba5f90371482901a645ffc4b14c8e8fa50ef23f3361270db4`; coordinator-supplied commit `3e96c9e5734e2e940d849c3e1339bcb0f0592c97`.

Commit identities are supplied provenance, not independently verified Git evidence; no Git commands were run. Hashes were checked directly against the files.

This is round 1 of the explicitly new, materially changed Fastify architecture scope. The prior Next.js-owned scope stopped after two changes-requested rounds as superseded by owner direction, not accepted. This report does not retroactively accept either predecessor plan or rewrite earlier findings. The same genuine reviewer session was retained. Requested selection remains Codex `gpt-6-astra` / `high`; that is the requested dispatch/session selection, not provider-certified per-turn attestation. Reviewer thread fingerprint remains `30f5ba9bc732d4dad050bf1e4c52bf448a907a5ac1992c39e80080aa8e6fec37`.

Native SAR is single-reviewer evidence and is not sealed two-party consensus. This acceptance is of the plan against the identified corrected spec; it is not an independently sealed acceptance of that spec or the pending XPR. No application/source edit, Git operation, installation, paid call, benchmark, implementation test, or issue-state mutation was performed. Review verification comprised whole-document inspection, local byte hashing and independent arithmetic.

## Required findings

None.

## Carried findings and closure evidence

| Finding                                                 | Disposition                   | Concrete closure                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Predecessor R1-F001: finite controls and tier budget    | Closed for the corrected plan | Section 8, lines 490–549, provides finite fixture/tuple/seed/context policies, named control families, per-tier count and duration ranges, reuse conditions, separately counted protection/headroom controls, conditional fallback attempts, and inventory/estimator omission tests. The corrected arithmetic reconciles as detailed below.                                                                                                                                                     |
| Predecessor R1-O001: uncertainty method and provenance  | Remains addressed             | Task 8 line 371 and section 9 lines 571–579 retain per-stratum/session provenance, method/precision, descriptive repeat min/max explicitly not a confidence interval, and refusal of missing-session evidence despite pooled timing volume.                                                                                                                                                                                                                                                     |
| Predecessor R1-O002: interrupted-run evidence           | Remains addressed             | Task 1 lines 191–205 and section 9 lines 553–568 create a run before work, append durable offered records, bound buffering/backpressure, seal final evidence separately, and recover unfinished work without inventing success or rewriting sealed bytes.                                                                                                                                                                                                                                       |
| Predecessor R2-F001: full residual open residence       | Closed                        | Inventory line 520 and section 10 lines 599–617 distinguish new-start cutoff, remaining 180-second conversation residence, 120-second request drain and 30-second cancellation settlement. The final-start example ends at 629999 ms, and k6 gracefulStop is at least 330 seconds after the start cutoff. The companion fake-clock integration test explicitly retains the late turn and delayed speech; real safety stops remain incomplete evidence. The 72-window row is now 9.6–12.6 hours. |
| Predecessor R2-F002: scheduled selected slow/tail cells | Closed                        | Lines 525–526 and 619–623 define two allocations, three types, slow2x/tail4x transformations, two loads, three seeds, 72 observation windows, twelve feasibility contexts and 48 probes. Selection is deterministic, output bytes/text/tool shape remain fixed, profiles are hypothetical, actual deadlines apply, and four-turn infeasibility is retained without favorable pacing or fixture substitution. Capability alone cannot complete coverage.                                         |

## Architecture and contract assessment

**Portable ownership and implementation prerequisite.** The spec sections 2 and 18, plan lines 53–57, module map and section 10 make the intended ownership unambiguous: standalone Fastify core owns provider credentials/configuration, STT, model/tool loop, lookup calls, TTS, validation, admission, deadlines, cancellation settlement and usage; separate Fastify lookup retains its HTTP boundary; Next.js serves UI and delegates. Task 0 requires an accepted integrated migration with independent entry points/cgroups and source dependency evidence. Its negative fixture rejects the old Next.js provider ownership even if functional responses work. Research cannot satisfy this by relabeling metrics, inventing a mock core, or editing the earlier epic under docs-only #39. Exact target paths remain explicitly proposed until integration verification, which is appropriate given absent accepted application source.

**Measured entry paths and attribution.** Primary k6, both constrained-service sweeps and worker/replica comparisons target Fastify orchestration directly. Lookup F1 stays a separate route-matched throughput result. Next.js forwarding is a bounded, matched family with fixed 1-CPU/2-GiB BFF resources and independent service accounting. A binding BFF cannot lower the reported portable-core boundary. The web family cannot replace either full grid. Core, lookup and optional web costs are separate, and direct telephony forecasts do not silently depend on Next.js. Actual telephone/WebSocket/acoustic measurements remain out of scope.

**Caller authentication and web admission.** Plan lines 362 and 593 and spec sections 16.8/18 separate private core bearer authentication from browser Origin/Host checks. Core verifies missing/invalid credentials before paid body/lease/provider work and returns 401; a valid non-browser caller does not invent an Origin. Next retains the six web protection cases, uses its server-held core credential and discards arbitrary browser Authorization. Authentication is exercised through both actual paid-capable routes and the measured topology. Credentials remain private/redacted; no production telephony authentication is asserted. The 18-request preflight correctly combines twelve web and six core requests. Private bind/TLS policy and fail-closed mock egress remain mandatory.

**Streaming, abort and timing.** Section 10 line 592 attaches instrumentation to Fastify lifecycle and actual streamed writes, including explicit preheaders for raw/hijacked streaming; it does not transplant a Next.js Response assumption into Fastify. Core, lookup and forwarding namespaces remain distinct. Forwarding must preserve early SSE/PCM delivery, status/content/correlation, abort/backpressure and zero automatic replay; Next cannot own paid leases or provider decisions. Task 5 still blocks affected scenarios unless the pinned k6 build proves actual POST/multipart incremental SSE, split parsing, abort and continued answer consumption while speech runs. Missing client first-audio observation remains unavailable or is supplied only by the separately validated observer within its scope. No server-first-write or header value is relabeled client/acoustic timing.

**Voice and session correctness.** All M1 input types remain output-enabled. The second-segment-after-SSE fixture, complete text/tool/voice oracle, generation ownership, one active speech request per session, real segment/queue limits, valid PCM sampling, delivery versus virtual playback clocks, and busy-offer accounting remain intact. Request response completion cannot release unsettled provider work. Ordinary observation, cancellation settlement and the corrected open-session lifecycle have separate bounds. The four-to-two-to-separately-approved-one replay fallback preserves workload and marks missing realistic-wait evidence incomplete.

## Measurement, evidence and campaign assessment

The 99.9% screen remains empirical rather than a production reliability guarantee. Each applicable p95 baseline/candidate stratum requires at least 200 observations; sparse results remain inconclusive within bounded extensions. Three repeats must pass independently, exploratory p99 remains separately qualified, and the soak cannot repair failed or sparse confirmation. Event-loop and memory policy, one-session/no-headroom handling and discovery-only labels remain unchanged.

Research admission is finite/frozen, defaults remain 2/2, and admission-bound results cannot masquerade as hardware scaling. Worker efficiency uses equal aggregate resources; replica efficiency uses identical per-instance allocations. Peers and test infrastructure require independent nonbinding evidence. Lookup reduction still requires full F1 evidence, matched three-repeat memory comparisons and at least ten times actual peak retrieval demand; it cannot reduce the primary core or F1 grids.

Mock egress isolation, provider tuple relationships, conservative paid reservations, uncertain-outcome retention, aggregate/request caps and disabled automatic retries remain explicit. No optional calibration case or metadata operation silently becomes free. Immutable source/input/image/raw hashes, bounded collection, interrupted-run evidence, read-only verification, independent rerender and unknown-price propagation remain mandatory. The full report cannot claim completion merely because the approved time budget expires.

Independent count/hour checks found no material discrepancy:

- Core subtotal remains 112.8–723.6 target-environment hours.
- Added ordinary slow/tail coverage contributes 72 observation windows and twelve feasibility envelopes; its maximum probe/schedule calculation is 48 × 2.5 minutes plus 36 × 5.5 minutes = 5.3 feasibility hours.
- Web forwarding contributes 144 observation windows and eight web feasibility envelopes. At K=5, four allocations × 72 probes × 2.5 minutes plus 24 schedules × 5.5 minutes = 14.2 maximum web-feasibility hours.
- Tier 3 infrastructure windows sum to 1176; with Tier 1 520 and Tier 2 1192 the maximum is 2888 before valid reuse. Protection series sum to 28 + 84 + 138 = 250.
- Tier 3 controls/interventions sum to 96.75–211.4 hours; with core they are 120.75–394.2 hours.
- Whole-campaign controls are 146.616666…–465.4 hours and the complete envelope is 259.416666…–1189.0 hours, matching the printed rounding.
- The 12-hour pilot/progress checkpoint and proposed 160-hour cumulative stop remain visibly separate from the complete estimates. Exact generated windows, helper lifetimes and host prices govern an actual quote; these rounded ranges do not authorize a purchase or auto-extension. A partial report retains missing coverage.

## Optional observations

### A1-O001 — P3: Express the forwarding no-replay check in terms of expected dispatch and fan-out

**Location:** plan line 597, “exactly one core provider operation.”

For a simple fixture that contains one provider request this is a useful assertion. When the fixture includes B2 tool continuation or B3 STT/multiple speech segments, legitimate execution contains multiple provider operations. During implementation, make the assertion one core dispatch per delegated incoming request and exactly the fixture's expected downstream operation set, with no duplicated operation IDs. Preserve the existing continuation/segment accounting rather than interpreting that sentence as a universal one-provider-call-per-conversation requirement. This is optional clarification: the plan already preserves the genuine model/tool/speech contracts and forbids replay.

### A1-O002 — P3: Exercise slow downstream reading through the thin forwarding path

**Locations:** plan lines 527, 592 and 597; spec line 490.

The contract explicitly requires backpressure propagation and bounded buffers, while the named new web fixtures emphasize early output and abort. Add a slow-reading web client to the bounded integration fixtures and verify bounded Next/core buffered bytes and eventual abort settlement. This provides direct regression evidence for the extra forwarding boundary. Existing slow-consumer, queue, resource and no-buffering requirements remain binding, so this is an implementation-test improvement rather than an acceptance blocker or a new benchmark family.

## Session and handoff

`npx aitm start 39 --role agent` resumed this genuine review session. The local occupancy record was checked to match this thread and `/Users/kpburson/projects/AIVC`; no parent identity was substituted. Explain returned the disclosed Backlog `indeterminate` / `state-unavailable` result with no automatic remediation. The review performed no lifecycle movement. After saving this report the reviewer pauses its own timer and releases only its own #39 occupancy.

This architecture-scope SAR stops on acceptance after its first round. The coordinator may proceed to the already requested XPR using the exact corrected plan/spec context and the owner's specified author/reviewer selections. Optional observations do not require another SAR round. Implementation, migration and experiment execution retain their separate governed approval and prerequisite gates.
