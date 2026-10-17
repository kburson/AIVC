# Issue 40 migration specification — native SAR round 1

## Decision

**accepted**

No required specification changes remain. The design provides a coherent, testable migration contract for three independently deployable stateless services while preserving the existing request-scoped semantics. Acceptance applies only to the reviewed specification bytes. It does not accept an implementation plan, authorize implementation, establish delivered application correctness, satisfy story completion gates, or unblock research Task 0.

## Artifact and reviewer provenance

- Tracking: [AIVC issue #40](https://github.com/kburson/AIVC/issues/40), read live through the GitHub connector during this review.
- Artifact: `docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md`, all 137 lines reviewed.
- Independently computed artifact SHA-256: `fecb93bdc40e6f2636f04bb243d7f5cbf74cbb8041f8c16891f38db4c643d1d4`.
- Author-supplied artifact commit: `07a92dd97ca7d8819e235ebe97b17f08608d8671`; author-supplied branch: `codex/40-draft`. No reviewer Git command attested these claims. Acceptance is bound to the independently read and hashed artifact bytes.
- Requested provider/model/effort: Codex / `gpt-6-astra` / `high`.
- Native reviewer task: `/root/migration_sar`.
- Own-session fingerprint: SHA-256 `5c36eec6e272d9b56b54155bfcd9373f488e131c0f0eecad3a3158aadff3f28c`, derived in this reviewer process from its own `CODEX_THREAD_ID`; the raw handle is omitted. This is session correlation evidence, not provider-certified per-turn model/effort attestation. Such attestation is unavailable.
- Review class: native single-reviewer SAR. No sealed SPR/XPR, two-party consensus, package-managed provider action, delivery receipt, or finalization is asserted. Retain this reviewer session for any requested re-review.

## Scope and evidence

Read `AGENTS.md`, `.codex/peer-review-orchestration.md`, and the installed workspace peer-review skill. The using-superpowers entrypoint explicitly exempts dispatched subagents. The native SAR follows the repository's distinct SAR path rather than starting a two-party protocol.

Compared the full artifact with the governing research specification sections 18–19; research plan sections 1, 12–13 and Task 0; and live issue #40 scope, acceptance criteria, and verification commands. The governing research documents' historical acceptance and subsequent amendments remain distinct. This SAR does not renew acceptance of the entire research corpus.

Inspected current source for contracts/validation/history, turn and speech transport, deadline and lease lifecycle, runtime/provider construction, Deepgram streaming, lookup client/server startup, client generation and speech queue, package/build ownership, capability metadata, and contract-digest generation. Inspected selected contract/slow-test definitions for their intended settlement coverage; did not execute them. The specification's baseline commit remains an author assertion; source observations describe the files actually read in this worktree.

A quick memory lookup was denied by the workspace read-scope hook before execution. No memory content was obtained or used, and no access workaround was attempted. Initial report writes hit a mutation-target parser error and a combined-shell-command classification refusal. The coordinator supplied the established single-command relative-path documentation write form; no lifecycle transition or scope expansion was used.

## Assessment

### Ownership and protocol compatibility

Sections 4–5 move paid-capable orchestration, configuration, adapters, tool calls, admission and settlement into Fastify. Next.js retains bounded web admission and delegation. The neutral contracts package avoids browser dependence on provider SDKs or server configuration. Removing the web provider import graph is stronger ownership evidence than renaming routes.

The multipart clarification at line 31 is supported by `apps/web/shared/validation.ts:338` onward: the parser accepts multipart text/WAV with explicit caller history. Preserving that representation is consistent with the governing “JSON or multipart” description. Speech remains JSON and carries its own text, turn ID and segment ID (`apps/web/shared/contracts.ts:14–18`). Version-1 SSE, speech format headers, body limits, error envelopes, correlation and retryability remain explicit. Web capability build metadata is retained at line 69 and need not be misattributed to the core build.

### Authentication and transport boundary

Core bearer authentication before body consumption and provider admission, independent Host checks, fixed upstream routes, overwritten Authorization, stripped untrusted headers, no redirects and no automatic retries adequately constrain the private topology. Web Origin validation remains separate browser protection. Neither Origin nor correlation IDs confer core caller authority.

The transport rules distinguish pre-header envelopes from incomplete SSE/PCM after headers, prohibit fabricated completion and PCM diagnostics, and preserve stream bytes. Container isolation and a recorded plaintext/TLS policy fit the private migration scope without claiming public telephony authentication or deployment authorization.

### No-store and cross-replica correctness

The selected no-store model matches the current contract: history accompanies each turn; speech is self-contained; `TurnController` checks generation/turn identity before accepting events; `SpeechQueue` fences current ownership, cancels active transport, and prevents stale dispatch. There is no existing server cancellation-by-ID or global generation contract to preserve.

Sections 3 and 7 distinguish those client guarantees from global deduplication, global admission and remote cancellation. Duplicate IDs may incur separate work. Two core replicas permit four turn and four speech slots in aggregate. These limitations are declared rather than hidden behind affinity. The live issue's later turn/speech/cancellation requirement is addressed through the explicit transport-cancellation contract; it does not require inventing a cancellation-by-ID endpoint.

Forced turn-A/speech-B/history-B, cold replacement, and interruption of every old active transport test the promised request independence. An established stream remains owned by its process; loss does not permit silent replay or establish transparent migration.

### Backpressure, deadlines and settlement

The current `sse-response.ts` enqueues eagerly. The specification explicitly identifies this gap and requires demand gating, byte limits, bounded chunks, drain/abort handling and socket-level checks. Relocation alone cannot satisfy it. Splitting chunks preserves SSE/PCM semantics if order and bytes remain exact. Concrete implementation measurement must account for the original producer allocation as well as queued slices.

Deadlines begin before ingestion, do not reset per chunk, and do not send process-local monotonic timestamps across processes. A bounded forwarding grace accommodates transport without extending the core budget. Actual response-socket closure after upload and headers must propagate abort to the owner.

`runWithDeadline` separates client-facing `result` from `settled`; both existing transport modules release leases from settlement. The speech module separately awaits pending reads and cancellation because EOF can precede cancellation settlement. Lines 86–88 preserve those distinctions, retain slots through cancellation-ignoring upstream work, and require late rejection observation. Unknown provider work is not free success. A persisted cross-replica settlement ledger is unnecessary under the explicitly limited no-replay/no-global-deduplication contract.

### Containers, shutdown and research handoff

Sections 7–9 require separate production images/start commands, independent scaling, read-only roots, bounded disposable framework state, baked assets and explicit router cost. A dev-server or shared writable-volume substitute cannot pass the stated acceptance checks.

Shutdown withdraws readiness and refuses new application requests, including keepalive requests, before draining. The initial 15-second drain plus 5-second settlement window fits the minimum 25-second container grace. Unresolved hard-exit work remains interrupted/settlement-unknown; surviving replicas cannot replay it. Health/readiness avoid paid probes and require a bounded dependency-check policy.

The mandatory offline production-container test fails when prerequisites are absent. Direct/delegated parity, pressure, socket closure, deferred settlement, forced replica routing, graceful termination and hard kill collectively cover the material migration risks. Existing regressions, typecheck, production build, lint and formatting remain required. Task 0 receives accepted integrated source and actual topology/state evidence, not planning acceptance alone. The design is feasible as decomposed application work; none of these checks is claimed to have passed.

## Required findings

None.

## Optional implementation-plan suggestions

These source-derived reminders are not conditions on specification acceptance and can be addressed in the plan without revising the accepted design.

1. **Make container networking explicit.** `apps/web/server/tools/retrieval-client.ts:8–22` rejects every non-loopback origin; `apps/retrieval/src/index.ts:17` binds loopback, as does the web start command. Relocation alone cannot establish inter-container HTTP. Name the replacement configured service-origin policy, production bind addresses, and negative URL/redirect cases while retaining the fixed lookup path and validation. Sections 4–5 and 8 already require this resulting topology.
2. **Migrate contract-digest tooling with contract paths.** `scripts/contract-digest.mjs:6–11` hashes a closed set of path-labelled files under `apps/web/shared`; `tests/contracts/contract-digest.test.ts` asserts that framing. Extraction changes this digest even if wire behavior remains identical. Update inputs and dependents, record the new digest, use semantic parity fixtures, and preserve historical evidence bytes.
3. **State the credential/readiness matrix.** `apps/web/server/capabilities.ts:8–38` supports unavailable live capabilities with missing optional provider configuration and supports mock mode without paid keys. Specify mandatory credentials per service/mode, distinguishing the core caller token from paid-provider credentials. The offline topology must be ready with paid credentials absent, as section 9 requires. Also select the bounded dependency-check interval/failure policy delegated by section 8.

## Verification and authority limits

Performed read-only source/document inspection, a live issue read, artifact hashing and own-session fingerprinting. Wrote only this authorized report. No Git commands, artifact/source edits, tests, builds, container starts, provider calls, lifecycle transitions, implementation, paid execution or deployment were performed. No test pass or production compatibility result is asserted.

Next action: review the separately authored migration implementation plan, followed by the owner's distinct implementation decision. The accepted specification and its exact digest may be recorded as native SAR evidence in issue #40 planning metadata.
