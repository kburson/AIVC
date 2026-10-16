> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/contract-first-parallel-amendment/2026-10-13-2026-10-13-2-contract-first-parallel-implementation-review-63ab7e25e4be96aca3960c251687c2e1-reviewer-response-2.md) and its exact bytes remain available in the [evidence archive](../../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `3a99e55eeee8d392102efac0abf5d1a0699448c10cccc63ba1c2a10df0ad2368`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-63ab7e25e4be96aca3960c251687c2e1'
role: 'reviewer'
turn: 2
commit_mode: 'normal'
authority_assurance: 'unavailable'
artifact_path: 'docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md'
artifact_commit: 'fe6d4b3fcaec4c6977bdf2d954d12abbbfbc2c0c'
artifact_blob: 'a50a25726fb3c5e0fb0396c5049f719857ce3a23'
artifact_digest: 'sha256:6c8bd00d60594602b60a5df392b913de85e713246d86a6ef2f1b6c9a3cdc1081'
agent:
  host: 'claude-code'
  provider: 'anthropic'
  model_id: 'claude-opus-5-5'
  model_display: 'claude-opus-5-5'
  session_fingerprint: 'sha256:23119381b70d64136c4c45e973ea19e455920e76871611c41d8b1754cd6a8d01'
  identity_source: 'runtime'
started_at: '2026-10-13T14:57:46.652Z'
submitted_at: '2026-10-13T15:10:24.286Z'
finding_ids: ['R2-F001', 'R2-F002', 'R2-F003', 'R2-F004']
answered_finding_ids: []
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

This is my second-turn XPR review of the revised amendment.

- **Revision reviewed:** artifact commit fe6d4b3fcaec4c6977bdf2d954d12abbbfbc2c0c, digest sha256:6c8bd00d…cdc1081.
- **Mode:** normal commit. Generated authority assurance remains unavailable.
- **What I read:** the full revised amendment (all 557 lines) and the sealed author-response-1.
- **Authority checked:** the accepted base plan Tasks 2–4 and 7 (already read in turn 1). I also re-checked the accepted specification's case list (lines 267 and 273) for the tool-failure semantics discussed below.
- **What I did not do:** no Git, no artifact edits, no issue or binding mutations, no installs, no provider calls.

**Result.** All ten turn-1 findings are resolved in substance. One narrow gap remains in the newly added ordering grammar (R2-F001). Because `decodeSse` and `assertTurnSequence` now enforce the grammar strictly at runtime, that gap can turn a spec-required producer behavior into a client-visible INVALID_STREAM. It is a small wording fix, but it belongs in the frozen agreement.

**Verification of turn-1 dispositions:**

- **R1-F001: resolved.**
  - Lines 253–291 pin a complete ten-event Atlas trace, with exact stage, tool.started and tool.completed placement and fixed simulated usage 20/30/0.
  - The fixture is built through `validateTurnEvent`. Its object insertion order (schemaVersion/turnId/seq/type/data) matches the hand-authored raw frame at line 419.
  - The trace satisfies the stated grammar. Retrieving falls between tool.started and tool.completed, and the completed text equals the delta concatenation.
  - #5 now asserts full (type, data) equality after normalizing only the UUID (line 478).
  - #6 must exercise a second permitted trace with repeated hints and interleaved sources, a no-tool answer and a no-speech trace (line 291).
  - `assertTurnSequence` is shared by producer and consumer (line 293).
- **R1-F002: resolved.**
  - `SseDecodeError` carries the stable codes STREAM_DISCONNECTED and INVALID_STREAM (lines 299–312).
  - Partial and unterminated final frames are classified consistently: unparseable means disconnect; valid JSON with invalid protocol means invalid. Terminated malformed JSON means invalid.
  - Caller abort keeps AbortError.
  - Contract tests pin class, name and code. #6 maps each code to a distinct message and still excludes the turn from history (line 487).
- **R1-F003: resolved.**
  - The digest covers exactly five files in ASCII order with fixed path/NUL/length/NUL/bytes/NUL framing and lowercase `sha256:` output (lines 316–350).
  - The doc, probe, starter page, script and tests are explicitly excluded.
  - A delivered script exports `computeContractDigest` with a d.mts declaration, and the tests cover the recipe's sensitivity properties.
  - I checked the example code against the prose recipe. They agree.
- **R1-F004: resolved.**
  - `start()` calls createContext and initiates resume synchronously before its first await, and a spy test checks the order (lines 354–356).
  - Overlong recovery and mute/unmute reuse the existing context. A context-count test checks 1 → 2 only after Stop followed by a new Start (line 358).
- **R1-F005: resolved.**
  - Typed text is counted as UTF-16 code units.
  - Whitespace-only text (empty after trim) is rejected.
  - The audio part must be exactly `audio/wav`, case-insensitive, with no parameters. This matches the base `new Blob([wav],{type:'audio/wav'})` producer.
  - The mock capabilities search state and account validation are both `unavailable`, with a reason string.
- **R1-F006 to R1-F010: resolved.**
  - encodeSse writes the envelope keys in canonical order (line 427).
  - retainPairs now pops the oversized newest pair and then always trims; the code is correct, with a six-pairs-plus-oversize regression test (lines 396–406).
  - The retrieval fixture is cross-validated (line 360).
  - An exact path index was added (lines 171–184). Every path that appears in two rows (runtime.ts, capabilities.ts, mock.ts, run-turn.ts, page.tsx) is ordered by an explicit predecessor.
  - The authoring snapshot is labelled as such (line 35).

## Findings

### R2-F001 — P3 — The strict ordering grammar does not cover tool attempts that are rejected or fail without ending the turn

**Location:** amendment lines 286–293 (grammar and `assertTurnSequence`), line 311 (INVALID_STREAM on "invalid tool/stage ordering"), plus spec case 1 (spec line 267) and base Task 3 line 352.

**What the requirements say.**

- Spec case 1 and base Task 3 require that invalid, unknown or extra-property tool arguments cause zero retrieval calls.
- In that case the model receives a native `is_error:true` tool_result and the turn continues. The attempt also counts toward the four-attempt cap.
- Base Task 3 also says retrieval that is unavailable or malformed "fails visibly". It does not say whether this ends the turn (turn.failed RETRIEVAL_UNAVAILABLE) or returns a tool error to the model and continues.

**What the grammar says.**

- tool.started must be followed by its matching tool.completed.
- Lookups are serialized.
- The only allowed way to leave a lookup unpaired is "Failure may terminate with pending lookup". `tool.completed` can only carry a valid `ProjectCatalog`, so there is no non-terminal tool-error event.

**What the grammar leaves open.** It does not say whether the producer emits tool.started for an argument-rejected attempt. If it does, nothing permits continuing with deltas or another tool.started.

**Failure scenario.**

1. #5's producer emits tool.started for every model-requested lookup, which is a reasonable reading of "tool name and safe summary".
2. It then rejects invalid arguments with `is_error` and continues answering.
3. `decodeSse` (in #5's own conformance path and in #6's production client) throws INVALID_STREAM. A spec-required behavior now appears as "The server sent an invalid response."
4. If instead #5 suppresses tool.started for rejected attempts, nothing in the agreement tells #6 that this is the case. If #5 handles retrieval-unavailable as a continuing tool error, the same conflict occurs.

Either way, the conflict is found only after both tracks are built, and fixing it requires a reviewed contract amendment under lines 549–550.

## Required changes

1. **R2-F001: pin tool-attempt semantics in the grammar, the doc and the tests.**
   - State whether tool.started is emitted for argument-rejected attempts that make zero service calls. The simplest rule consistent with the existing payload types: no public tool event at all, because tool.started means a validated lookup is being dispatched.
   - Pin retrieval-unavailable or malformed-response behavior after tool.started as exactly one of:
     - (a) a terminal turn.failed RETRIEVAL_UNAVAILABLE with the lookup left pending, which the grammar already allows; or
     - (b) a continuing path. In that case, add a public non-terminal tool-failure representation that the grammar permits.
   - Add both cases (an invalid-argument continuation with zero retrieval calls, and retrieval unavailable) to the CONTRACT valid/invalid sequence tests. Have #5 assert that its emitted sequence passes `assertTurnSequence` for both.

## Optional suggestions

### R2-F002 — Remove the leftover superseded phrasings

- Line 141 still says #5 asserts only that the "delta trace equals normative fixture". Line 478 now requires full (type, data) equality.
- Line 427 says "At least one turn.accepted starts a stream". The grammar says exactly one.
- Updating these sentences prevents an implementer from reading the weaker statements as authority.

### R2-F003 — Keep #6's extra traces out of the hashed fixture file

- #6 must exercise additional grammar-permitted traces: interleaved sources, repeated hints, no-tool and no-speech.
- State that these live in #6-owned test files and are checked with `assertTurnSequence`, rather than added to tests/helpers/wire-contract-fixtures.ts.
- That file is one of the five hashed digest members. Editing it after the freeze would change the frozen digest.

### R2-F004 — Complete the CAPTURE-MODULE path-index row

The CAPTURE-MODULE row in the collision-sensitive path index (line 182) omits tests/voice/wav.test.ts, which the prose and the verifier (lines 152, 221) assign to that story.

## Decision

revisions-requested
