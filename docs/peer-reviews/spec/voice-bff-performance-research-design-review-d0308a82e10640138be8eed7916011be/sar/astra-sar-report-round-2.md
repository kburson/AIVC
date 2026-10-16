> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/b612108309811663ffad1e04ba2005621c68ea5f/docs/peer-reviews/spec/voice-bff-performance-research-design-review-d0308a82e10640138be8eed7916011be/sar/astra-sar-report-round-2.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-16-39-originals.json).
> Original SHA-256: `cb51738033d810cde0dc0cc9681a9cbf4a1b7d6438817c531427aa8ce139b328`. Review acceptance and protocol hashes apply to those original bytes.

# Astra SAR report — round 2

Date: October 14, 2026 (America/Chicago).

**Decision: accepted for this native SAR. No further required or optional specification revision remains.** All four required findings and both optional improvements from round 1 are concretely addressed. The full revised document was re-read, including interactions between the earlier sections and normative section 16; this decision is not based solely on the author's disposition table.

## Artifact, continuity, and authority

- Issue: [#39](https://github.com/kburson/AIVC/issues/39).
- Artifact: `docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md`, all 418 lines read.
- Independently computed SHA-256: `28a34d9d29bdfcc3effd59e8c85231073316cb25b3725dc353c34255aaca1438`, matching the author's supplied digest.
- Author-supplied revised commit: `52ec46fa8dcf37dd250133be314541f2f4fb9407`. The reviewer performed no Git operations and does not independently certify the commit-to-artifact relationship or remote publication.
- Dispositions read in full: [author response to round 1](author-response-round-1.md), supplied by the author as committed at `eec6945`; that commit provenance is likewise author-provided.
- Same native reviewer task and context: `/root/astra_sar`; requested Codex `gpt-6-astra` / `high` throughout. No substitute reviewer or copied session identity was used. Provider-certified per-turn model/effort attestation remains unavailable.
- Own-session AITM resume succeeded after the author's pause and occupancy release. Backlog pickup remains deferred; the previously disclosed move-sentinel/Explain limitation remains, with no lifecycle transition performed or implied.

## Finding dispositions verified

| Finding                                     | Result | Direct evidence in the revised specification                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1: turn-level timing origins               | Closed | Lines 350–368 define named metrics, start/end events, clock owners and populations; the cross-request first-audio metric requires one validated client clock and selects only the first eligible segment. Missing observation becomes unavailable. Lines 250–251 name the request-local budget and separate the exploratory client backend budget from acoustic latency.                                                                                                                                              |
| R2: voice correctness after text completion | Closed | Lines 370–380 require fixture-correct text/tools plus every required speech segment, format/byte-duration/order/drain validation and no unintended suppression. Separate text, voice and cancellation outcomes prevent text-only success from inflating voice goodput. The mandatory multi-segment fixture outlives SSE, the observation window is bounded, and shutdown retains failed/unfinished operations and unresolved leases.                                                                                  |
| R3: sparse statistical claims               | Closed | Lines 247, 309 and 382–392 replace reliability claims with observed screening and an empirically observed candidate. Comparable p95 baselines and candidate repeats require at least 200 applicable observations, with bounded mock-only extension and an inconclusive outcome if evidence remains insufficient. Each of three repeats must pass independently. The minimum is explicitly not a confidence guarantee, the soak cannot repair sparse evidence, and a one-session maximum carries a no-headroom caveat. |
| R4: pacing and session residence            | Closed | Lines 394–404 define 180-second residence, submission-based schedules, phase/jitter, nonoverlap, busy-schedule-miss failure accounting, drain/population reporting and independent new-conversation open arrivals. Open-turn saturation is separately labeled. Cost and capacity conversions use measured rates/residence rather than nominal pacing alone.                                                                                                                                                           |
| O1: profile coverage                        | Closed | Lines 406–416 map minimum-wait, replay and sensitivity/fault/pacing coverage across the full matrix, target-service sweeps, process/instance comparisons and deep dives. Unavailable empirical replay remains explicit, and hypothetical profiles cannot be relabeled as measured provider behavior.                                                                                                                                                                                                                  |
| O2: hosting purchase mapping                | Closed | Line 418 requires dated SKU, region, architecture, CPU policy, billing granularity, usable overhead, packing and spare-capacity assumptions. Fractional experimental resources are priced through the actual purchasable unit, with hardware-capacity transfer and allocation mapping labeled projected where needed.                                                                                                                                                                                                 |

## Whole-document checks and remaining implementation prerequisites

The changes retain the original requested scope: no demand target is selected, the actual Next.js BFF remains the primary test entry, Fastify remains the real retrieval service, and browser execution is excluded without bypassing backend orchestration. The 16-cell CPU/RAM matrix and separate constrained-service sweeps still support attribution. One-process, supported-worker and multi-instance cases retain explicit aggregate-resource and connection-distribution requirements.

The corrected definitions do not convert backend timing into physical speech latency, or deterministic transport correctness into speech quality. Voice delivery completion and virtual playback completion are deliberately separate: the scheduler still uses virtual playback for backpressure and ordinary-turn nonoverlap. Busy scheduled offers are failures rather than silently suppressed demand. Typed, voice and mixed result accounting stays separate. These requirements allow the research to report a pacing or admission constraint before CPU saturation without inventing a hardware-capacity conclusion.

The statistical changes are coherent with short discovery screens: a sparse point can remain descriptive, fail on observed errors, or be inconclusive; it cannot become confirmed capacity by pooling sparse repeats. More than the declared count floor may be needed when the documented uncertainty method shows insufficient evidence. That is already covered by the inconclusive rule and does not require another specification change. Production 99.9% reliability remains expressly unproven even when empirical screens pass.

The small paid calibration remains bounded by the original total/request limits and conservative pre-reservation, with no extra live sampling introduced to satisfy mock statistical counts. Network simulation, paid-egress isolation, generator/simulator headroom, and no invoice-guarantee claim remain intact. The cost model now maps measured resource entitlements to actual purchases while preserving unpriced and projected cases.

The plan must still choose and prove actual streaming-client compatibility, the integrated application baseline, supported process mechanisms, mock/network fidelity, and reproducible analysis methods. Those are explicit implementation prerequisites already specified, not unresolved SAR findings. No present streaming support, runtime test, benchmark, calibrated distribution, spend, capacity, or production-readiness result is asserted by this acceptance.

## Verification evidence

The reviewer independently hashed the revised artifact, read its complete contents in three bounded numbered ranges, read the full author disposition document, and checked each round-1 closure condition against the revised clauses. The original request and round-1 report were retained unchanged, with direct hashes still matching the first-round observations:

- `review-request.md`: `29cbfea1f67ca4d44d7aa8681e8c992c3c73518af446f30779641c0d51a435a6`.
- `astra-sar-report.md`: `c3a5077d596ea6bd1a7d747b6f45b60e670b7ac749b0c6ff360d4b3fbbe7f27a`.

Only SAR collateral was written. No Git command, artifact edit, benchmark, paid request, application test, or implementation plan was performed by this reviewer. AITM session binding/pause/release does not constitute a lifecycle advance or measured active-time claim.

## Outcome and handoff

This SAR loop has reached its intended stopping condition: no further required or optional specification change remains. The same reviewer examined two rounds with one author revision between them. See the [retained-loop summary](sar-loop-summary.md).

This is native SAR acceptance only. It is not sealed SPR/XPR consensus, owner approval, approval of an implementation plan, issue closure, or permission to perform paid calibration. The separately requested XPR and owner review remain subsequent work under their own authority.
