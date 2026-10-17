# Migration specification review index

Tracking: [#40](https://github.com/kburson/AIVC/issues/40). Date: October 16, 2026.

## Report presentation and sealed originals

Existing response links below open formatting views. [Lossless originals and provenance](../../../quality-evidence/40-review-originals/README.md) preserve every original SHA-256, exact byte stream and immutable Git reference. Sealed manifest/receipt hashes bind those originals, not the presentation views. Accepted artifact bytes and review decisions are unchanged.

## Current sealed XPR — accepted

- Current [migration design](../../../superpowers/specs/2026-10-16-40-stateless-service-migration-design.md): publication commit `e6e96c9a4f07bb78faa73dc56368a0503d912982`, SHA-256 `f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`.
- Review `review-0009efb5ca6886291ad48628afa78120`: [round 1](xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-reviewer-response-1.md), [author dispositions](xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-author-response-1.md), [accepted round 2](xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-reviewer-response-2.md), [sealed manifest](xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-review-manifest.md).
- Claude `claude-opus-5-5` / `high`, same genuine distinct reviewer session across both rounds. Two rounds and one revision; no required changes remain. Optional round-2 refinements remain recommendations; they did not amend the accepted spec bytes.
- Terminal `accepted-uncommitted` in LOCAL JOURNAL MODE; authority assurance `unavailable`. Git publication separately pins the accepted artifact/reports, without rewriting the manifest as Git-bound acceptance.
- Actual official-SDK stdio MCP handoffs delivered author sequences 8 and 12, with matching canonical receipts. These prove this connection, not a native desktop restart or package automatic-required resident transport.
- Original attempt `review-2bdf5dd8ee56accc6e494643054a3cf1` remains unresolved and preserved; its launch/session/reservation were neither replayed nor settled. The new independent review seals its preserved-predecessor reference. [Recovery and stop boundaries](../../40-coordinated-runtime-recovery.md).

This accepted revision supersedes the historical SAR artifact for current planning. SAR reports and exact predecessor pins below remain unchanged evidence. No application implementation, Plan approval, hydration, merge or research unblocking follows from peer acceptance alone.

### Observed author MCP deliveries

| Sequence | Reviewer-response / canonical receipt digest                              |
| -------- | ------------------------------------------------------------------------- |
| 8        | `sha256:96bcb0215a7b1d144cb0f3361bef3520e5fa76e3268202c9a7c2b9f8726b4b93` |
| 12       | `sha256:fa0ab0ee9afb0aac4b1024fb91af3747a1d11a07105e762c8c3bf67550afe93d` |

These are observed official-SDK results matched to journal delivery receipts and sealed response hashes; this index is an additive publication record, not a fabricated package receipt.

## Historical native SAR — accepted

- Artifact: [Migration design](../../../superpowers/specs/2026-10-16-40-stateless-service-migration-design.md).
- Accepted artifact commit: `07a92dd97ca7d8819e235ebe97b17f08608d8671`.
- Accepted artifact SHA-256: `fecb93bdc40e6f2636f04bb243d7f5cbf74cbb8041f8c16891f38db4c643d1d4`.
- Reviewer: requested Codex `gpt-6-astra` / `high`, genuine distinct native session retained. Provider-certified per-turn model/effort attestation is unavailable.
- [Complete round-1 report](sar/astra-sar-report-round-1.md). No required specification changes remain. The coordinator read the full report and verified the artifact digest; historical SAR bytes remain available at the exact commit above; the later XPR revision is recorded separately.
- Three optional planning suggestions were incorporated into the implementation plan's concrete planning decisions: private inter-container networking, path-labelled contract-digest migration, and mode-specific credentials/readiness. No revision occurred during that SAR checkpoint; the subsequent XPR revision has its own acceptance above.

## Historical tooling pause

### Sealed XPR — not started

The owner selected native SAR for both artifacts, followed by a pause for registered runtime and MCP handoff tool recovery before sealed XPR.

The PATH CLI identifies as ai-peer-review 0.4.1 and refuses the current user configuration schema `ai-peer-review.user-config/v2` with `APR_CONFIG_INVALID`. Its `primary inspect` command is unavailable. The runtime-selection registry names a newer registered installation, but AITM's path guard refuses that executable; authentic peer-review MCP handoff tools are not exposed in this session. No sealed review workspace, launch, participant identity, submission, consensus, finalization or delivery receipt is invented. No user configuration downgrade or guard bypass was applied.

Recovery must restore the registered primary/runtime execution path and genuine handoff tools in the actual participant sessions, then run primary verification/setup/doctor according to that runtime's procedure. Do not launch a reviewer by copying handles or silently substituting the older CLI. Exact local refusal details are session/tool evidence, not committed machine-local bindings.

## Authority and downstream boundary

Native single-reviewer SAR is document acceptance, not sealed two-party consensus, owner implementation approval, application validation or #40 completion. The #39 inherited reviews/amendments remain their own history. Research #41/#42 still require an accepted integrated migration and actual state/topology/verification evidence.

Planning collateral is published through [draft PR #61](https://github.com/kburson/AIVC/pull/61) to `trunk`; no merge is implied. Application implementation and paid execution remain stopped.
