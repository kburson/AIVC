> Formatting view only. [Exact original Git blob](https://github.com/kburson/AIVC/blob/e6347619fb245ba506bf455d57a0672cf663260b/docs/peer-reviews/plan/stateless-service-migration-review-40-native/sar/astra-sar-report-round-3.md) · [Lossless original file](../../../../quality-evidence/40-review-originals/plan-sar-astra-sar-report-round-3.txt).
> Original SHA-256: `6fa63b47157f9ba00ae6f76acbe03cf028f2d5afd7bb29e5b89575fef7079f3a`. Acceptance and sealed hashes bind the original bytes; this view changes presentation only.
>
> **Formatting view; original report preserved.**
> [Exact original report](https://github.com/kburson/AIVC/blob/e6347619fb245ba506bf455d57a0672cf663260b/docs/peer-reviews/plan/stateless-service-migration-review-40-native/sar/astra-sar-report-round-3.md) · original SHA-256: `6fa63b47157f9ba00ae6f76acbe03cf028f2d5afd7bb29e5b89575fef7079f3a`. Formatting does not renew or expand native SAR acceptance.

# Issue 40 migration implementation plan — native SAR round 3

## Decision

Decision: **changes-requested**.

The four round-two corrections now have workable architectural resolutions. One narrow required correction remains: the declared closed lifecycle-control schema cannot represent its own scale-core action. Resolve that schema inconsistency and its transition tests; no further specification or architecture change is requested.

## Artifact and reviewer identity

- Issue: [AIVC #40](https://github.com/kburson/AIVC/issues/40).
- Full reviewed plan: `docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md`, all 511 lines; also read `docs/peer-reviews/plan/stateless-service-migration-review-40-native/sar/author-response-round-2.md`.
- Independently computed plan SHA-256: `b13756cd0b42b3d60c40a5cc394c6757a3a3081f5a15f1b99b6b4d956d45e03e`.
- Author-supplied commit: `622e7d5ca53ec958860035b381d70d9900775d04`; no Git command independently attested it. The decision binds the inspected bytes/hash.
- Accepted specification independently rehashed unchanged: `fecb93bdc40e6f2636f04bb243d7f5cbf74cbb8041f8c16891f38db4c643d1d4`.
- Same native reviewer task `/root/migration_sar`; requested Codex / `gpt-6-astra` / `high`. Own-session fingerprint remains SHA-256 `5c36eec6e272d9b56b54155bfcd9373f488e131c0f0eecad3a3158aadff3f28c`, established during specification review. Raw session identity is omitted; no provider-certified per-turn attestation is available.
- Native single-reviewer SAR only. No sealed XPR, provider-action receipt, implementation approval or test-pass claim.

## Finding dispositions

| Finding                              | Disposition                                               | Evidence and assessment                                                                                                                                                                                                                                                                                                                |
| ------------------------------------ | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Original R1: settlement handoff      | Closed, retained                                          | Lines 321–379 and 458 preserve synchronous operation handles, separate response and actual settlement, exactly one early lifecycle registration, error cleanup, signal propagation and real-route lease/registry tests.                                                                                                                |
| Original R3: extraction checkpoint   | Closed, retained                                          | Lines 425–431 retain temporary single-source re-exports only through Task 2, then remove them and retarget fixtures. Line 511 correctly leaves browser Origin assertions at the web boundary.                                                                                                                                          |
| R2-A: browser secure context         | Closed                                                    | Lines 464–472 select HTTPS test ingress, exact DNS SAN and Host/Origin, per-run CA trust in the driver/browser, normal certificate checks and real API preflight. No API patch, insecure-origin flag or development-server fallback is allowed. The ingress's resources, buffering and plaintext internal hop are explicit.            |
| R2-B: provider invocation identities | Closed                                                    | Lines 474–482 and the revised endpoint table separate parent operations from fresh per-call invocation IDs, key streams/cancellation/gates by invocation, join all admitted cleanup, cover STT plus multi-round model/tool work, and forbid replay after a lost receipt.                                                               |
| R2-C: host lifecycle action path     | Architectural gap closed; schema correction below remains | Lines 484–496 define driver attachment, a private bounded file channel, host-only Docker authority, run/container identity checks, finite action and wait budgets, acknowledgements, no replay on unknown outcome, and real gated-stream kill/ledger tests. The closed scale message representation still contradicts those semantics. |
| R2-D: encoded WAV limit              | Closed                                                    | Lines 498–509 separately bound decoded bytes, canonical base64 and metadata beneath a 3 MiB wire cap. The arithmetic covers the raw 2 MiB upper bound conservatively; padded and near-limit accepted WAV cases preserve ancillary-chunk compatibility.                                                                                 |

## Required finding R3-1 — Make the closed scale-core schema expressible

**Priority:** P2. **References:** plan lines 488–494, with the 1-to-2 acceptance case at line 259.

Line 488 declares a closed target enum of `core-a`, `core-b`, `web`, and `lookup`, and a singular expected current container ID. The same paragraph then says `scale-core` targets the core group and verifies both expected replica identities. The core group is not a permitted target and there is no field for the two-identity map. In the required initial one-replica state, core-b has no current container ID at all. Consequently, a strict validator cannot accept the required 1-to-2 action as described without inventing a field/target or weakening the closed-schema rule. The instruction to return an updated manifest after scaling does not define the missing precondition representation.

**Required revision:** Define a discriminated action schema. Single-container actions should carry one enumerated target and its expected current container ID. The scale action should carry an explicitly allowed group discriminator, desired count, and exact expected replica membership/identity representation that includes an absent replica. A nullable core-b identity, or a closed list/map of present replicas with explicit membership semantics, is sufficient. Specify how 1-to-2 and 2-to-1 choose/preserve the surviving core identity; the host resolves only run-owned containers and still rejects stale or foreign membership. Update the capped request/ack contract and owning runner tests to use that representation consistently.

Add schema/host-action cases for a valid 1-to-2 transition with no prior core-b, a valid 2-to-1 transition, missing/unexpected membership, and stale identity. Verify unchanged web/lookup identities and that a matching duplicate request returns the original acknowledgement without executing scaling again. No arbitrary service names, image IDs or shell arguments should be added to the control schema.

**Closure condition:** A caller can construct a valid scale-core message using only declared fields/enum values in both supported starting states, and the host can validate complete expected membership before mutation. This is a small planning-contract correction, not a request for application implementation or a different control mechanism.

## Holistic assessment

The revised browser topology is compatible with the unchanged client security requirements: the selected ingress preserves exact browser Host and Origin while forwarding to the real production web process, and core caller authority remains the server-held token. Its extra transport hop is declared and tested for buffering, cancellation and deadline behavior rather than silently excluded from the evidence.

The provider fixture now represents the actual multi-call turn lifecycle. Its observation ledger remains external test infrastructure, with per-invocation receipts, separate control authority and no application session-storage role. Cancellation acknowledgement is distinct from data EOF and HTTP closure. Parent settlement retains admitted-child cleanup, and ambiguous creation receipts forbid replay or zero-work claims.

The host/driver split is now executable in principle: the host remains active while suite subprocesses run and can service authenticated milestone records. The 30-second host-action bound and 40-second driver wait accommodate the stated 15-plus-5-second lifecycle while remaining below a 60-second individual test budget for a single such action. Every operation remains constrained by the overall runner budget; unknown actions fail rather than becoming successful cleanup. R3-1 is the remaining message-shape defect, not an absence of the control path.

The expanded fixture request cap is independent of the response-stream queue bound, and both encoded and decoded allocations are acknowledged. Tests cover accepted ancillary RIFF chunks and stricter encoded/decoded rejection boundaries without weakening the application parser. The earlier pressure requirement continues to measure original backing allocations as well as queued slices and socket buffers.

Production image/source verification, distinct tooling images, private egress isolation, dedicated nonrecursive runner selections, mandatory prerequisites, ordinary regression migration, three-service packaging, temporary extraction compatibility and removal, research handoff provenance, and implementation approval boundaries remain coherent. The provisional 52-hour estimate and XL decomposition requirement are correctly presented as planning information rather than execution or lifecycle authority.

## Optional suggestions

No new optional changes are requested. Earlier editorial consolidation can remain a later readability improvement; explicit supersession already identifies the governing decisions. The remaining required correction should be made directly in the lifecycle schema section rather than adding a contradictory alternate schema elsewhere.

## Verification and next action

Read the complete revised artifact and dispositions; rechecked plan/spec byte hashes and evaluated the corrections against the previously inspected application, parser, client, lifecycle and runner source. No tests, builds, containers, Git commands, provider calls, product edits or state transitions were performed. Wrote only this report.

Resolve R3-1 and return the full updated plan plus disposition to this same reviewer session. Preserve earlier reports and the unchanged accepted specification. After native SAR convergence, maintain the owner's requested pause for registered runtime/MCP recovery before sealed XPR; this review does not authorize implementation.
