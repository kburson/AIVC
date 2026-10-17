# Issue 40 migration implementation plan — native SAR round 2

## Decision

**changes-requested**

The revision closes the original operation-settlement and extraction-checkpoint findings. It substantially improves the production harness, but four concrete defects remain in its newly selected protocol and execution topology. Required changes concern browser secure-context support, provider invocation identity, host-owned lifecycle controls, and the fixture's encoded audio size limit. No specification amendment is required.

## Artifact and identity

- Issue: [AIVC #40](https://github.com/kburson/AIVC/issues/40).
- Artifact: `docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md`, all 458 lines reviewed, plus `docs/peer-reviews/plan/stateless-service-migration-review-40-native/sar/author-response-round-1.md`.
- Independently computed plan SHA-256: `95aaa9ce83647dfcf33beccb438c7a7898c7f8900b2593a43b29f36e6fbf0ab3`.
- Author-supplied commit: `f92d678e576658fa0e89d2bb692d5f441f27ba16`; no Git command independently attested it. This decision binds the inspected bytes/hash.
- Independently rechecked accepted specification SHA-256: `fecb93bdc40e6f2636f04bb243d7f5cbf74cbb8041f8c16891f38db4c643d1d4`, unchanged.
- Same native reviewer task `/root/migration_sar`; requested Codex / `gpt-6-astra` / `high`. Session fingerprint remains SHA-256 `5c36eec6e272d9b56b54155bfcd9373f488e131c0f0eecad3a3158aadff3f28c`, established from this reviewer's own session handle in the specification round. No raw handle or provider-certified per-turn attestation is asserted.
- Native single-reviewer SAR only. No sealed XPR, protocol finalization, implementation approval or delivered application evidence.

## Previous finding dispositions

| Finding | Disposition | Independent assessment |
| --- | --- | --- |
| R1: operation-to-lifecycle handoff | Closed | Lines 321–379 define synchronous operation handles, separate response/settlement promises, abort, registry/pump joining, early-error cleanup and real-route shutdown oracles. Line 458 removes double-registration ambiguity. Web forwarding has its own settlement handle and an explicitly verified AsyncLocalStorage binding. |
| R2: production harness/runner seam | Partially closed | Lines 381–456 select real runtime adapters, surviving external observations, separate data/control authority, exact production test configs/commands, driver image, finite budgets and identity checks. The defects below are in those concrete selections and prevent full closure. |
| R3: broken extraction checkpoint | Closed | Lines 425–431 select temporary single-source re-exports, preserve the legacy fixture seam only at the intermediate checkpoint, then retarget fixtures and remove it. Production inter-container proof now belongs to Task 4. |
| Optional allocation/file-map suggestions | Addressed | Main file map includes wrapper and harness files. Line 433 requires original backing allocations and queued slices to be measured independently, with oversized-chunk fixtures. |

## Required findings

### R2-A — The selected browser origin cannot run the existing client

**Priority:** P1. **Plan references:** lines 413, 450–454, particularly `http://web:3000` at line 452.

The test browser runs inside the driver and is explicitly assigned a plain-HTTP, non-loopback service hostname. `apps/web/client/turn-controller.ts:76–81` calls `crypto.randomUUID()` when starting every turn. That method requires a secure context. A private container network or DNS name `web` does not make HTTP trustworthy; ordinary HTTP localhost/loopback exceptions do not apply to this service name. The selected origin therefore prevents even typed-turn acceptance from reaching the migrated backend in a normally configured Chromium. Voice facilities impose additional secure-context requirements. This conclusion follows from source and the browser contract; no browser test was executed. See the [Web Cryptography Crypto interface](https://w3c.github.io/webcrypto/#crypto-interface) and [Secure Contexts origin algorithm](https://w3c.github.io/webappsec-secure-contexts/#is-origin-trustworthy), checked during this review.

**Required revision:** Select a supported trustworthy browser origin within the private test topology, such as explicitly configured test TLS or a deliberate loopback-facing in-driver transport with exact routing/provenance. Record its network/resource footprint and corresponding Host/Origin configuration. Do not silently patch `crypto.randomUUID`, bypass browser security, or replace the real client to obtain a pass. Add browser preflight assertions for `isSecureContext`, callable `crypto.randomUUID`, and required voice APIs before the actual controller/queue scenario. Preserve the no-development-server/no-hidden-core-exposure rule.

**Closure condition:** The declared production browser path can execute the unchanged real client with the pinned browser's normal security model and exact admission configuration.

### R2-B — Give each provider invocation its own identity within a request

**Priority:** P1. **Plan references:** lines 389, 437, 441–443.

The runtime generates one internal operation UUID per turn/speech dispatch, passes that same request-scoped ID to `createScriptedDeps`, and the fixture accepts each internal operation once at a URL keyed solely by that ID. But a turn is not one provider invocation. `apps/web/server/turns/run-turn.ts:44–64` performs STT and then model work for audio, and can perform up to three separate model rounds, including tool continuations. A second POST with the same operation ID would be rejected or refer to the first operation's receipt/stream; neither preserves the real turn lifecycle. Adding provider kind alone would still collide between multiple model rounds. The ledger would also undercount provider calls and make per-call cancellation ambiguous.

**Required revision:** Separate the parent HTTP request/operation identity from a fresh provider-invocation identity for every transcribe, model round and synthesize call. Carry both in the receipt/ledger; key stream/cancel endpoints and uniqueness enforcement by invocation ID. Specify sequence/round correlation and the relationship between request settlement and every admitted invocation's cleanup. Duplicate caller IDs must still create independent parent operations and invocations. A lost receipt must not trigger replay.

Add fixture/adapter cases for audio STT followed by a model call, two or three model rounds with a real lookup continuation, cancellation in a later round, and duplicate caller submissions. Assert exact started/cancelled/settled invocation counts and parent grouping.

**Closure condition:** The concrete protocol represents the application's existing multi-provider/multi-round turn without ID collisions, accidental deduplication or hidden replay.

### R2-C — Connect in-container test milestones to host-owned lifecycle actions

**Priority:** P1. **Plan references:** lines 236, 257–259, 415, 450–452.

The helper exposes `replace`, `stop` and orchestrator scaling, and acceptance requires SIGTERM/SIGKILL precisely while streams and cancellation gates are active. The revision places both test suites inside an isolated driver while stating that the host runner alone performs Compose orchestration. The enumerated fixture control API can load scripts, release gates and read observations; it cannot signal, replace or scale application containers. No driver-to-host request/acknowledgement path or host-owned milestone scheduler is defined. Startup, a blocking suite command, and teardown do not supply the intermediate lifecycle actions required by the suite. Granting the driver an undeclared Docker socket would introduce a materially different authority boundary.

**Required revision:** Define one bounded coordination mechanism between test milestones and the host orchestration owner. Specify the control records/transport, request IDs, allowed action/target enumeration, acknowledgement/failure behavior, and timeouts; the host must restrict actions to the unique run's containers and validate current identities. Keep arbitrary shell arguments, Docker API access and application control endpoints out of the driver contract. Update `startMigrationTopology` ownership so its in-container client attaches to the existing topology and delegates the selected lifecycle actions rather than starting another stack. Assign implementation and runner tests for this seam.

A concrete acceptance oracle should gate a real stream, request a specified replica kill/replacement, await the host's verified action acknowledgement, then inspect the surviving fixture ledger and subsequent request behavior. Include a failed action/expired milestone that fails the run and triggers bounded cleanup.

**Closure condition:** Each in-flight termination/replacement/scaling step is executable from the declared driver without inventing a new control path or relying on timer guesses.

### R2-D — The 2 MiB fixture cap does not cover base64-encoded accepted WAVs

**Priority:** P2. **Plan references:** lines 448 and 456.

Line 456 asserts that a 2 MiB fixture data cap represents the application's maximum valid WAV even though the WAV is encoded as base64 inside JSON. Base64 expands bytes to `4 * ceil(n / 3)`, before JSON metadata. The current application limits the entire multipart request to 2 MiB, but `validateWav` (`apps/web/shared/validation.ts:295–336`) limits the PCM data chunk rather than total RIFF ancillary chunks; unknown bounded chunks are accepted. A structurally valid 1,600,000-byte WAV containing ancillary padding can fit within the multipart cap, yet its base64 alone is 2,133,336 bytes, exceeding 2,097,152. Such an accepted input would fail only at the mock-provider transport. This is a source-derived boundary counterexample, not a test-execution claim.

**Required revision:** Derive a fixture wire cap from the full accepted raw WAV bound plus base64 expansion and a bounded metadata envelope, or choose a bounded binary transport with separate metadata. Preserve the existing application input contract rather than silently rejecting previously accepted RIFF chunks. State raw and encoded caps separately and add a valid padded-WAV boundary case plus oversize encoded/decoded rejection cases. Continue storing only audio length/digest in the ledger.

**Closure condition:** Every accepted application WAV can reach the selected fixture adapter without an unintended stricter transport limit, while both raw and wire allocations remain explicitly bounded.

## Holistic assessment

The new operation handle and exactly-once request registration provide a credible implementation contract for retaining leases and shutdown entries beyond response completion. The explicit asynchronous cancellation acknowledgement addresses the previous risk that HTTP abort alone would fake delayed provider settlement. Provider failure, initial auth/parser rejection, response loss, drain, hard exit and unknown work have distinct outcomes. These are planning obligations, not verified implementation behavior.

The private fixture remains external provider test infrastructure rather than application history storage. Its surviving ledger, separate credentials/interfaces, append-only limits and no-live-mode selection preserve the accepted no-store boundary. Core routing and public SSE still use real application modules; the fixture emits provider-level data only. Source/image verification, no runtime downloads, dedicated Playwright configuration, serial nonrecursive selections, finite budgets, failure-preserving teardown and ordinary regression migration are meaningful improvements. R2-A through R2-D must be corrected before those concrete choices are executable together.

The compatibility seam preserves a runnable intermediate extraction and is explicitly removed before final acceptance. The revised 52 joint-hour estimate remains provisional and correctly does not claim elapsed work or govern issue state. Decomposition, exact-head review/integration and research Task 0 gating remain intact. No new database, production telephony path, paid run or cluster is introduced.

## Optional suggestions

1. When retargeting old tests, retain web Origin/Host refusal assertions against the web layer and test core bearer/Host separately. Moving every assertion verbatim to the core would incorrectly reintroduce browser Origin as a direct-core requirement.
2. After resolving the remaining protocol/topology findings, consolidate superseded interface snippets and the final contract into their owning task sections when convenient. The explicit supersession text currently makes R1 understandable, so this editorial cleanup is not an acceptance condition.

## Verification and next action

Read the complete revised plan, author response and relevant source; recomputed plan/spec hashes; consulted primary browser specifications to verify the secure-context requirement. No tests, builds, containers, application edits, Git commands, provider calls or state changes were performed. Wrote only this report.

Revise R2-A through R2-D and return the complete plan plus dispositions to this same reviewer session. Preserve the accepted specification and all earlier reports. After native SAR convergence, retain the owner's requested pause for registered runtime/MCP recovery before sealed XPR; native SAR is not a substitute for that review.
