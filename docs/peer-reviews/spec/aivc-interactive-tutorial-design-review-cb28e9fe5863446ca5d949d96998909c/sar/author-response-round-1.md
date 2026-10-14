# SAR round 1 — author dispositions and revision

Story: [#15](https://github.com/kburson/AIVC/issues/15).

Review: [Astra round 1](astra-sar-report.md). Authority: [owner's SAR loop clarification](review-loop-authority.md).

Original artifact: revision `858559d527668ac7fed7310c14d16e914a2dd744`, SHA-256 `b6ac0743e9346dc0074361413a451ec4e5920a31da87ec2a3963fdb577c53214`.

Revised artifact SHA-256: `9b3f489fcfa836f0f3d11f3545694949e22f0d66e611cd34260b0bff3a24f0aa`. The issue-attributed revision commit is recorded in the canonical commit trace; the next request supplies its exact SHA after commit.

## Finding dispositions

| Finding | Disposition | Correction and evidence |
|---|---|---|
| SAR-01 | Revised; awaiting Astra validation | Added tutorial-specific Host/Origin admission, fail-closed configuration, pre-body/pre-source/cache/GitHub/provider rejection, JSON-only media handling, sanitized Host-only status, stronger admission for source/runtime endpoints and acceptance cases 14–15. It preserves the reference BFF boundary, verified against the reference specification's admission contract. Browser-origin protection is explicitly distinct from local-process authentication. |
| SAR-02 | Revised; awaiting Astra validation | Defined edition snapshot as default authority, separate local/GitHub retrieval backends, explicit exploration/comparison/working-copy modes, selected Git-object bytes, immutable per-request identity, context reset/cancellation, dirty-file exclusion, exact-SHA/unavailable behavior and acceptance cases 8/16. Source experience no longer ambiguously chooses HEAD over an edition. |
| SAR-O1 | Revised; awaiting Astra validation | Defined cold offline verification after dependency/toolchain installation, including clean initial build, empty runtime source caches, disabled networking and a fresh browser profile. Assets are locally bundled; no PWA/offline-serverless promise added. Acceptance case 2 carries the check. |
| SAR-O2 | Revised; awaiting Astra validation | Added CP1 no-key Atlas, CP2 connected Atlas and CP3 complete-edition boundaries; publisher live evidence is distinct from learner optional participation. Missing required live evidence prevents the applicable checkpoint from passing. Acceptance case 4 preserves this distinction. |
| SAR-O3 | Revised; awaiting Astra validation | Added Postman publication contract checks for turn/history/input exclusivity, WAV format/duration/body cap, speech IDs/effective cap and second-clone sample-file rebinding. Direct Deepgram formats remain distinguished from BFF acceptance. Verified exact fields and limits by reading the reference spec's `/api/turn` and `/api/speech` sections; acceptance case 9 covers the contract. |
| SAR-O4 | Revised; awaiting Astra validation | Added Chrome/Edge version recording, keyboard/focus/non-color/text alternatives, actual VoiceOver/Chrome observations and speed/seek synchronization checks. Specified ignored source-cache/lab-observation locations, separate clearing/retention, safe operational logs, and private-source exclusions from bundles/commits/exports. Acceptance cases 11–12 cover these obligations. |

All six findings received concrete design changes. No finding is silently deferred, rejected, or represented as validated merely because the author revised prose. Astra's next pass must examine the complete artifact for both closure and regressions.

## Verification boundary

The author read the entire first report and compared its media/admission observations to the governing reference contracts before changing the specification. `git diff --check` passed on the revised document. Document section/requirement consistency was inspected and its SHA-256 recorded above. No application tests, endpoint execution, Postman import, provider request, microphone or assistive-technology trial occurred; those remain future acceptance obligations, not evidence from this design revision.

The specification remains pending owner review and the SAR loop remains open until re-review reports no further revisions. Existing AITM lifecycle/push and active-timing limitations are not bypassed by this document work.
