> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/b612108309811663ffad1e04ba2005621c68ea5f/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/README.md) and its exact bytes remain available in the [evidence archive](../../../quality-evidence/2026-10-16-39-originals.json).
> Original SHA-256: `99ad70ac90e46b4bccf751d69502efde3deede6fa25336f7bdf6a78deddd8444`. Review acceptance and protocol hashes apply to those original bytes.

# Story 39 performance implementation-plan review index

Date: October15,2026 (America/Chicago).
Tracking: [#39](https://github.com/kburson/AIVC/issues/39).

**Outcome: the corrected Fastify-focused plan received native SAR acceptance, then accepted and finalized XPR. No required XPR change remains. The four nonblocking suggestions at acceptance were subsequently addressed by the owner-directed amendment linked below; that amendment has not been re-reviewed.** No implementation, architecture migration, k6 build, benchmark, paid application API calibration, procurement or deployment was executed by these reviews. Document review is not owner Plan approval or experiment-spend authorization.

Plan artifact (current file; reviewed predecessor identified below): [2026-10-15-39-voice-bff-performance-research.md](../../../superpowers/plans/2026-10-15-39-voice-bff-performance-research.md).
Reviewed artifact commit: `8109522128c13412f8333d0029d5382011a3feb3`.
Reviewed artifact SHA-256: `4e9f4e00b671e461e0a66951246441bf29e2ed5a0939fd58bfd4be10f8a6b018`.
Normal XPR finalization commit: `408e83704e6eec665596cc542e4dbef8259325c0`.

Governing corrected [specification](../../../superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md): commit `3e96c9e5734e2e940d849c3e1339bcb0f0592c97`, SHA-256 `7146781add44a11ba5f90371482901a645ffc4b14c8e8fa50ef23f3361270db4`. The plan reviews checked alignment with this spec; they do not independently seal a new specification acceptance.

## Architecture and review scope

The owner corrected the architecture during SAR. There are three application services:

| Service                 | Responsibility and research treatment                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fastify orchestrator    | Portable STT/model/tool/lookup/TTS orchestration, admission/deadline/cancellation/usage ownership; primary direct-core resource/process/replica curves |
| Separate Fastify lookup | Independent retrieval API; isolated F1 and lookup-constrained attribution                                                                              |
| Next.js web BFF         | React/UI and thin streaming delegation; bounded matched forwarding-overhead comparison, separate optional web cost                                     |

Future telephony clients call the core without Next.js. Actual Twilio/WebSocket and acoustic capacity/latency remain unmeasured. The accepted integrated migration to this three-service architecture is an explicit prerequisite; existing Next.js-owned provider code cannot satisfy it by renaming metrics. The research plan does not authorize implementing that migration under docs-only story39.

## Native SAR lineage

Requested reviewer: Codex `gpt-6-astra` / `high`, retained in the same native session.

- Predecessor Next.js-orchestration scope: two changes-requested rounds, then stopped as superseded by owner architecture correction. It was not accepted. [Round1](sar/astra-sar-report.md), [author dispositions1](sar/author-response-round-1.md), [round2](sar/astra-sar-report-round-2.md), [correction dispositions](sar/author-response-round-2-architecture-correction.md), [scope transition](sar/predecessor-scope-status.md).
- Corrected Fastify scope: [exact request](sar/fastify-architecture-amendment/review-request.md), [accepted report](sar/fastify-architecture-amendment/astra-sar-report.md). Accepted in its first explicitly new-scope round, against plan `200bb8c4680d22a1315e357ccf70dda19b7e451a`, digest `8c74c0533d3debe88f3f4f475361b2d3df87a3752b9df6aa25c903cf0ff52d66`. Carried predecessor requirements were independently checked and closed.
- Two optional web-fixture clarifications were applied in `a3411ec08de263b17868d6c2df268948f3ee8589` before XPR, producing digest `690870a0d17b1a6af701f710a6dd0edc9154096b5645fd2440ace6e2465a069a`. [SAR summary](sar/sar-loop-summary.md) explains the exact lineage. SAR acceptance remains tied to its earlier bytes; XPR independently covered the complete later artifact.

Native SAR is single-reviewer evidence, not sealed two-party consensus. Requested launch/session selection is retained, with no provider-certified per-turn model/effort attestation. Reviewer performed no Git operations or application tests; the coordinator independently checked commit/hash relationships.

## XPR evidence and result

Review ID: `review-9ec8655d0231ccca123b9ad385d7fef8`.
Author: Codex `gpt-6.1-sol` / `high`.
Reviewer: Claude `claude-opus-5-5` / `high`.
Result: **accepted**, two sealed reviewer rounds, one author revision, normal author finalization completed. All four first-round required changes and four optional clarifications were addressed. The genuine distinct author/reviewer sessions remained continuous; Claude's second launch used the official same-session resume.

- [Author startup](xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-author-startup.md).
- [Sealed invitation](xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-reviewer-invitation.md).
- [Reviewer round1](xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-reviewer-response-1.md).
- [Author response and dispositions](xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-author-response-1.md).
- [Accepted reviewer round2](xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-reviewer-response-2.md).
- [Final sealed manifest](xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-review-manifest.md).

The manifest records normal commit mode, reviewer-consensus acceptance, complete lineage, exact requested model/effort values and `authority_assurance: unavailable`. Session/model evidence is declared, not provider-certified per turn; no owner approval follows from it. Native-orchestrated manual transport was used, not validated package-managed automatic-required transport. Authentic author MCP handoffs delivered sequences8 and12; a launch ACK alone was never treated as acceptance.

The author completed the documented own-review terminal broker reconciliation, authenticated zero-active-review checkpoint, normal stop and offline confirmation, then paused/released only its own AITM claim. Scratch authority/recovery evidence remains local; raw provider handles are not copied here.

## Nonblocking observations at acceptance — subsequently addressed

The final reviewer requested no required change and retained these optional suggestions, with full reasoning in accepted round2:

1. R2-F001: explicitly pin the measured web BFF's host placement so it cannot consume unbudgeted target-host resources.
2. R2-F002: explicitly distinguish subset unit-test feasibility input from the required complete eight-context campaign decision.
3. R2-F003: list each unfunded secondary calibration cell as unavailable in manifests and report limitations.
4. R2-F004: bound real model output settings to the supported calibration segment shape and record excess-shape cases without undeclared TTS calls.

All four are now addressed in the separate [owner-amendment disposition](xpr/owner-amendment-2026-10-15.md), which identifies current plan commit `1dcb41e2ba81864c9a3c314dc005abd0cbb273ae` and SHA-256 `2ea5eb429d59683204be1da0e411b34206399f883be2996a71fe4ab956da6f87`. No artifact edits had followed acceptance when the original finalization/index was recorded; the subsequent owner-directed revision is distinct and has no new sealed review acceptance. Original review bytes, campaign scope and spending limits remain unchanged.

## Planning consequence and coordinator verification

The revised finite quote exposes a conditional full-campaign planning envelope of259.4167–1325.7333 target-environment hours, not a measured result or approved budget. It includes mixed-feasibility fallback additions and control work. The proposed12-hour checkpoint and160-hour cumulative stop remain distinct and can produce only a partial report. Primary calibration has at most25 model,10 STT and25 TTS requests before required metadata, within the unchanged30/provider cap; actual pricing must fund the whole casebook within the separately agreed aggregate ceiling of at mostUSD10 before any request. No present dollar sufficiency or provider latency is asserted.

The coordinator read the complete predecessor/corrected SAR reports, both XPR reports, author dispositions and final manifest; inspected the full XPR artifact diff; and matched the local file and committed artifact bytes to the accepted SHA-256. Whitespace checks are documentation checks, not execution of the plan's proposed tests. The corrected source-spec hash remained unchanged through XPR.

All package-generated evidence bytes are preserved. The final additive archive commit includes the generated startup/invitation and this index outside the terminal author protocol. Unrelated untracked generated apps/ is excluded. Commits remain local; no remote push is asserted. Story39 carries exact reviewed artifact/spec/review references and this outcome record. Older comments/references remain historical and must not be read as the latest architecture or plan revision.

## Subsequent three-container/stateless clarification

The owner subsequently selected three separate stateless service containers, with independent orchestrator scaling and measured sizing for each service. Governing spec section19 is committed at `be1da47a81cbbf8b2bc56eda194bca2c0e9e1c42`, SHA-256 `bd1803bf8b3b1f6c70489c33a125ec4fd4dd9c8962b50023ae23a26945059919`. Current plan section13 and its source pointer implement that clarification; current plan SHA-256 is `09b3d2a4ade94c4293c7b51109d851d89b189d9157fbf0f33f7719fd360b5544`. The preceding observation disposition remains the historical record for `1dcb41e`; it is not the latest artifact pointer.

Statelessness permits transient ownership of live work but no required replica-local durable/cross-request state. The separately governed migration must demonstrate routing/coordination correctness and explicit stream drain/interruption behavior. Existing topology controls retain resource isolation, peer headroom and cost attribution; allocations are tuned between declared runs. No new paid sample or campaign family is added. These later spec/plan bytes have not received renewed SAR/XPR acceptance, and all sealed review evidence remains unchanged. No implementation or experiment execution follows from this documentation update.

## Governed implementation backlog handoff

The owner requested creating delivery issues without starting implementation. Research plan commit `f273bf88d0d3a7125c78e54479541794adf7c40e`, SHA-256 `23bae15f1cde2d54d8c78994170739a46f05bb3405f259e5815204323d7f289b`, adds root/task Story Intent blocks for the existing eleven tasks. These are later authoring/decomposition bytes, not renewed review acceptance. Research behavior and sealed evidence remain unchanged.

[Documentation delivery/backlog map](../../../superpowers/plans/2026-10-15-39-performance-documentation-delivery.md) links migration prerequisite #40, implementation epic #41 and its eleven native children #42–#52. The epic is blocked by #40; Task0 #42 is directly blocked by #40 and later tasks follow the explicit native dependency chain. All successors remain open in Backlog. #39's documentation completion is distinct from implementation completion; no application work or paid experiment began. Publication, integration and closure must be recorded from their actual live results.
