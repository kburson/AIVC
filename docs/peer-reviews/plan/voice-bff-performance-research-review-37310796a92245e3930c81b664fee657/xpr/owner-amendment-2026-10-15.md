# Story 39: remaining XPR observations addressed

On October 15, 2026 the owner requested resolving all four optional observations before implementation. All four are now addressed in the [implementation plan](../../../../superpowers/plans/2026-10-15-39-voice-bff-performance-research.md), section 12 and the affected task interfaces/topology tables.

- Current plan commit: `1dcb41e2ba81864c9a3c314dc005abd0cbb273ae`.
- Current plan SHA-256: `2ea5eb429d59683204be1da0e411b34206399f883be2996a71fe4ab956da6f87`.
- XPR-reviewed predecessor: `8109522128c13412f8333d0029d5382011a3feb3`, SHA-256 `4e9f4e00b671e461e0a66951246441bf29e2ed5a0939fd58bfd4be10f8a6b018`.
- Governing corrected spec remains `3e96c9e5734e2e940d849c3e1339bcb0f0592c97`, SHA-256 `7146781add44a11ba5f90371482901a645ffc4b14c8e8fa50ef23f3361270db4`.

| Observation | Resolution | Required implementation verification |
| --- | --- | --- |
| R2-F001: measured web BFF placement | Fixed 1 CPU/2 GiB on independently provisioned helper infrastructure, outside the constrained orchestrator host/cgroup. Record effective entitlement, placement and network hops; charge actual helper lifetime once if the protection deployment is legitimately reused. | Task 7 rejects target-host placement, missing entitlement/hop evidence, overlapping target resources and inadequate helper headroom. |
| R2-F002: subset versus campaign feasibility | Separate pure single-context `mapReplayContext` from campaign `chooseReplayPacing`. The campaign validates the canonical eight resource/admission IDs, including the expected-ID list itself, before it can authorize capacity work. | Tasks 6/7 cover partial, duplicate, unexpected, mismatched and missing-feasibility inputs; blocked decisions have no actions or dispatch. Existing all-eight fallback coverage and accounting remain. |
| R2-F003: deferred calibration cells | Require all seven named secondary cells in an immutable catalog and the report. Unfunded rows carry explicit unavailable status, reason, zero samples and no observation IDs. Reuse requires genuinely matching primary provenance. | Tasks 1/4/9 reject missing rows or false counts/provenance and prove unavailable rows remain visible without fabricated measurements. |
| R2-F004: real-model output shape | Record calibration-only prompt hashes, model settings and per-round token caps (48/128/48/96 as applicable). Validate actual stable-text segment length/ordinal before TTS. Unsupported/truncated/incomplete shapes retain incurred or uncertain charges without retry or invalid-segment dispatch. | Task 0/4 adapter capability checks precede paid dispatch. Fake-client cases cover truncation, excessive length, third/missing segments and malformed tool continuation, with cost retention and no extra retry/TTS operation. |

The portable Fastify orchestrator remains the primary target, with a separate Fastify lookup service and thin Next.js UI/BFF. The accepted integrated three-service migration remains a prerequisite. The amendment adds no benchmark family or paid sample; resource matrix, campaign inventory, spend/time limits and empirical thresholds are unchanged. It makes existing work and refusal conditions explicit.

Verification performed: read all four final reviewer observations and the full document amendment; checked affected Task 6 interfaces/examples and Task 7 topology entries; passed staged Git whitespace checks; matched committed plan and unchanged source-spec hashes. The plan contains future test requirements; no harness/application test, k6 build, benchmark, paid API calibration, migration, procurement or deployment was executed.

This is a subsequent owner-directed amendment, not a renewed SAR/XPR acceptance. Original sealed reports and manifest bytes remain unchanged; their acceptance remains tied to their recorded predecessor revisions. The prior review index and this additive disposition record explain the lineage. Commits are local and unpushed. No lifecycle approval or implementation start is implied.
