# Migration specification review index

Tracking: [#40](https://github.com/kburson/AIVC/issues/40). Date: October 16, 2026.

## Native SAR — accepted

- Artifact: [Migration design](../../../superpowers/specs/2026-10-16-40-stateless-service-migration-design.md).
- Accepted artifact commit: `07a92dd97ca7d8819e235ebe97b17f08608d8671`.
- Accepted artifact SHA-256: `fecb93bdc40e6f2636f04bb243d7f5cbf74cbb8041f8c16891f38db4c643d1d4`.
- Reviewer: requested Codex `gpt-6-astra` / `high`, genuine distinct native session retained. Provider-certified per-turn model/effort attestation is unavailable.
- [Complete round-1 report](sar/astra-sar-report-round-1.md). No required specification changes remain. The coordinator read the full report and verified the artifact digest; accepted specification bytes remain unchanged.
- Three optional planning suggestions were incorporated into the implementation plan's concrete planning decisions: private inter-container networking, path-labelled contract-digest migration, and mode-specific credentials/readiness. No specification revision followed acceptance.

## Sealed XPR — not started

The owner selected native SAR for both artifacts, followed by a pause for registered runtime and MCP handoff tool recovery before sealed XPR.

The PATH CLI identifies as ai-peer-review 0.4.1 and refuses the current user configuration schema `ai-peer-review.user-config/v2` with `APR_CONFIG_INVALID`. Its `primary inspect` command is unavailable. The runtime-selection registry names a newer registered installation, but AITM's path guard refuses that executable; authentic peer-review MCP handoff tools are not exposed in this session. No sealed review workspace, launch, participant identity, submission, consensus, finalization or delivery receipt is invented. No user configuration downgrade or guard bypass was applied.

Recovery must restore the registered primary/runtime execution path and genuine handoff tools in the actual participant sessions, then run primary verification/setup/doctor according to that runtime's procedure. Do not launch a reviewer by copying handles or silently substituting the older CLI. Exact local refusal details are session/tool evidence, not committed machine-local bindings.

## Authority and downstream boundary

Native single-reviewer SAR is document acceptance, not sealed two-party consensus, owner implementation approval, application validation or #40 completion. The #39 inherited reviews/amendments remain their own history. Research #41/#42 still require an accepted integrated migration and actual state/topology/verification evidence.

Planning collateral is published through [draft PR #61](https://github.com/kburson/AIVC/pull/61) to `trunk`; no merge is implied. Application implementation and paid execution remain stopped.
