# Author response to Astra SAR round 1

Story: [#39](https://github.com/kburson/AIVC/issues/39).

Reviewed initial artifact commit: `49126847bf74f09064ea38ca04f401d8fd8960ab`, SHA-256 `e0e95479c33a44c0a74b72ed239faa735a3bf4ef7d1e80c6ca92da2c22c32255`.

Revised artifact commit: `52ec46fa8dcf37dd250133be314541f2f4fb9407`, SHA-256 `28a34d9d29bdfcc3effd59e8c85231073316cb25b3725dc353c34255aaca1438`.

The coordinator read the complete round-1 report and checked its findings against the reference's separate turn/SSE and speech requests, completed-text history behavior, and bounded audio scheduling. Each required and optional finding is accepted as a specification clarification. This is not implementation work or new benchmark evidence. Existing historical report/request bytes remain preserved.

| Finding | Disposition | Concrete revision |
| --- | --- | --- |
| R1: cross-request timing origin | Addressed | Section 16.1 defines origins, endpoints, clock owners, populations, segment selection, client versus server first audio, and unavailable cases. The three-second budget is explicitly backend-only and cannot prove acoustic latency. Section 10 now names the request-local first-audio budget and section 16.1 resolves typed versus voice completion thresholds. |
| R2: voice success after text completion | Addressed | Section 16.2 defines independent text/voice/cancellation outcomes and deterministic segment/audio/drain checks. Voice success requires every required eligible segment. A multi-segment fixture outlives SSE completion. Observation, drain, cancellation settlement, unfinished-work accounting, and separate intentional-policy outcomes are bounded explicitly. |
| R3: sparse statistics and reliability | Addressed | Section 16.3 calls 99.9% an observed screening policy, not established reliability. It requires at least 200 applicable baseline/candidate timing observations per repeat for p95 decisions; bounded extensions otherwise end inconclusive. All three repeats must pass independently. The report uses candidate operating-point labels, and a one-session limit keeps a visible no-headroom caveat rather than rounding to zero. No additional paid samples are introduced. |
| R4: pacing and residence | Addressed | Section 16.4 fixes 180-second residence, submission-based intended schedule, jitter/phase, nonoverlap, busy-schedule-miss accounting, drain populations, open conversation iterations, and separately labeled open-turn saturation. Actual arrivals, missed offers, population, residence, and achieved pacing govern capacity/cost conversions. |
| O1: profile/matrix coverage | Addressed | Section 16.5 supplies the mandatory coverage table for minimum-wait, replay, sensitivity/fault/pacing, deep-dive, worker, and instance comparisons. Unavailable empirical replay cannot be replaced by an unlabeled hypothetical profile. |
| O2: allocation versus purchasable hosting | Addressed | Section 16.5 requires dated SKU/region/architecture/granularity/overhead/packing mappings. Fractional experimental CPU is not automatically fractionally purchasable; price and capacity transfers remain projected or unknown where appropriate. |

## Verification and next action

The author ran `git diff --check` and `git diff --cached --check` with no whitespace errors before revision commit `52ec46f`. Targeted reads confirmed each new section and the corrected earlier thresholds. The artifact digest above was computed from actual local bytes. These checks verify the documentation revision; they are not application tests, streaming-client compatibility evidence, statistical confirmation, or paid API calibration.

Return the complete revised artifact and this response to the same native `gpt-6-astra` / `high` reviewer session. Re-review must inspect the full document and new interactions, not merely accept this disposition table. Continue until no further specification revision remains or a real blocker occurs. Owner approval and implementation planning remain separate.
