<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-63ab7e25e4be96aca3960c251687c2e1"
role: "reviewer"
turn: 1
commit_mode: "normal"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md"
artifact_commit: "296464be0a09f6ec618e9a0bda5e8bc6fcd244d6"
artifact_blob: "b5f2c93df98694879d113015f942888fce7e6b93"
artifact_digest: "sha256:7cdca02756f96887770879722c7870882a3197c01dd4ad24f5ca2c3d7da9d67a"
agent:
  host: "claude-code"
  provider: "anthropic"
  model_id: "claude-opus-5-5"
  model_display: "claude-opus-5-5"
  session_fingerprint: "sha256:23119381b70d64136c4c45e973ea19e455920e76871611c41d8b1754cd6a8d01"
  identity_source: "runtime"
started_at: "2026-10-13T14:57:46.652Z"
submitted_at: "2026-10-13T15:01:24.040Z"
finding_ids: ["R1-F001","R1-F002","R1-F003","R1-F004","R1-F005","R1-F006","R1-F007","R1-F008","R1-F009","R1-F010"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---

Mode: `normal`

## Summary

Independent XPR of the contract-first parallel amendment at artifact commit 296464be0a09f6ec618e9a0bda5e8bc6fcd244d6 (digest sha256:7cdca027…d9d67a). Normal commit mode; generated authority assurance remains unavailable.

Read in full: the complete amendment; the accepted base plan's Plan Metadata, Story Intent, file/interface map and Tasks 1–5 and 7 (docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md). For context only, I also read the sealed SPR reviewer-response-1 and the R1-F003 disposition lines in the SPR author/reviewer responses. My findings below are my own and do not repeat the resolved SPR items. I made no Git calls, artifact edits, issue/binding mutations, package installs or provider calls. The `peer-review help submit` query was denied by the session's permission mode. That did not affect the review content.

What holds up:

- **Decomposition.** CONTRACT and CAPTURE-MODULE are whole, reviewable stories, and no original story is closed early. #7's same-owner rule (no partial Done) and its fallback (hold #7 until #5 is Done) are stated honestly. No retrieval work is invented to claim a third track. The rank-4 grant membership and lower-rank strict-Done rule match the SPR's verification of the installed policy, and the later 5 → 6 → 7 → 8 serialization correctly protects the shared Conversation/controller files.
- **Faithful copy of base authority.** The public types, signatures, limits, error codes, the retainPairs algorithm, the readBoundedBody/deadline split, WAV header math, VAD options and the Deepgram MIME rules all match base Tasks 2–5 and 7 byte for byte where checked. The amendment also states plainly that seq 0 is a new choice, not something already implemented.
- **Evidence honesty.** #6's controlled transport is limited to client-contract acceptance. The original real-HTTP typed browser acceptance moves explicitly to #11 with no turn interception. Mock/simulation and live evidence stay separate. All 15 spec cases still have owners.
- **Estimates.** The redistribution adds back to the base exactly: Task 2 = 2.5 + 1.5; Task 3 = 5 + 0.5; Task 4 = 3 + 0.5; Task 7 = 3 + 2; Task 9 = 7.5 − 0.5. The subtotal is 41. Adding the 2 h (1–4 h) allowance gives 43 h and a range of 30–65, which is consistent.

The remaining gaps are all in the "executable agreement" itself, which is the amendment's central claim. Two things that independent producers and consumers both rely on are not pinned:

1. the full event sequence (only answer deltas are compared to the fixture), and
2. the decoder's failure signalling (disconnect versus malformed).

The freeze digest recipe is also not deterministic, and the capture module's gesture-timing obligation is not stated. Each of these is cheap to fix in the plan. Each is costly to discover after both tracks have been built against different assumptions.

## Findings

### R1-F001 — P2 — Producer conformance compares only answer deltas, so the full event order is never pinned between #5 and #6

Location: amendment lines 141, 261 and 345 (fixture contents and producer conformance) and line 19 (Review Focus 1).

**What the plan says.**
- `wireEvents` is described only as: accepted seq 0, three answer deltas, an exact Atlas `tool.completed`, and a final complete text.
- It does not say where `stage`, `tool.started` or `sources` events go, or whether they appear at all.
- It does not say where `tool.completed` sits relative to the preamble delta and the separator.
- It does not say whether `turn.completed.usage` is present.
- #5's producer test only asserts that the "emitted delta sequence equals wireDeltaFixture", plus seq and final text.

**Failure scenario.**
1. #6 is built and tested only against the fixture ordering. For example: accepted → delta → tool.completed → delta → delta → completed, with no stage or tool.started events.
2. #5's real runTurn emits accepted → stage:researching → delta → tool.started → stage:retrieving → tool.completed → stage:answering → '\n\n' → delta → sources → completed{usage}.
3. Both tracks pass their own gates, because the delta sequences are equal.
4. The first time #6's status/stage handling, Working indicator, collapsed trace or card placement sees the producer's real sequence is #11's joined test (rank 8). That is the exact drift Review Focus 1 says CONTRACT prevents.

**Why the amendment doesn't already cover it.** The decoder enforces only envelope, seq, accepted-first and single-terminal rules. It does not enforce ordering between event types.

### R1-F002 — P2 — The decoder's failure signals are not pinned, so consumers cannot tell disconnect from malformed

Location: amendment lines 125, 133 and 294 (codec semantics), line 354 (#6 decode-failure handling) and base Task 2 line 283 (stable code list).

**What the plan says.**
- `decodeSse` returns `AsyncIterable<TurnEvent>`.
- The plan requires that "EOF before terminal produces a disconnected client condition, never synthetic complete".
- It requires that malformed payload, sequence, terminal or post-terminal input "reject".
- It requires that "Final unterminated frame is decoded and validated".

**What is missing.** An async iterable can only end or throw. The plan never says:
- what is thrown,
- whether disconnect and malformed are distinguishable (error class, `code` or `name`), or
- which stable reason code #6 shows for each.

Neither the base stable server/client code list nor the new CaptureReason union contains a stream-disconnect or malformed-event code.

**How the unterminated-frame rule makes it worse.** A connection cut mid-JSON in the last frame (`data: {"schemaVer` then EOF) will be classified as malformed (JSON parse failure), not as a disconnect. A cut after a complete `data:` line but before the blank line will be accepted as an event.

**Failure scenarios.**
- CONTRACT implements a generic `Error('bad frame')`, and #6 maps every decode error to one generic message. The visible-reason requirement for network close versus protocol violation is then untestable.
- Or #6 pattern-matches on message strings that CONTRACT later changes. Under the freeze rule that change is "incompatible" but no test detects it.
- A truncated stream ending inside a `turn.failed` frame is reported as a protocol violation instead of a disconnect.

### R1-F003 — P3 — The contract freeze digest recipe is not deterministic and contradicts itself on file membership

Location: amendment line 327, plus lines 309–324 (#6 deletes contract-probe.tsx and replaces page.tsx).

**What the plan says.** Two sentences conflict:
1. "Hashing excludes the doc's own digest field to avoid a circular self-hash." This implies docs/contracts/voice-bff-v1.md is hashed, minus one field.
2. "Contracts source/fixture files are the hashed inputs, sorted paths plus bytes." This implies the doc is not hashed at all.

**What is unspecified.**
- The exact file list: are the four shared modules, the fixture helper, the conformance tests and the doc each in or out? The temporary contract-probe.tsx and starter page.tsx must be out, because #6 deletes or replaces them.
- How each path and its bytes are framed (separator or length prefix, path encoding).
- Whether the output is one digest or one digest per file.

**Failure scenario.**
1. The root, #6 and #5 each compute "the" digest with different file sets or framing.
2. A consumer's review evidence records a mismatching value, or matches by coincidence of a shared-but-wrong recipe.
3. As a result, the incompatible-change detection that the freeze rule (lines 416–417) depends on is not reliable.

### R1-F004 — P3 — CaptureSession does not promise to create/resume the context synchronously before its first await

Location: amendment line 362 (CaptureSession constructor and `createContext`), line 366 (overlong discard/restart) and base Task 7 line 605.

**Background.** Base Task 7 requires the Start click to create and resume both AudioContexts *synchronously* before permission or VAD initialization. A context created or resumed after an `await` can start out of the user gesture and remain suspended.

**The gap.** In the new design, CaptureSession (frozen in CAPTURE-MODULE) owns `start(): Promise<void>` and calls the injected `createContext`. The plan says #9 "later supplies/resumes its caller-owned context in the synchronous gesture through createContext". But the module's own criteria never require that `start()` calls `createContext()` (and `resume()`) synchronously before its first await. Nor do they say whether overlong discard/restart reuses the existing capture context or calls `createContext` again outside any gesture.

**Failure scenario.**
1. CAPTURE-MODULE implements `async start(){ await this.acquire…; const ctx = deps.createContext(); … }`.
2. Its node-level tests pass.
3. #9's real-browser gesture acceptance fails with a suspended capture context.
4. Fixing it requires changing the reviewed module that #9 is explicitly forbidden to re-own (line 376). That forces a cross-story amendment.

## Required changes

1. **R1-F001.**
   - Pin the complete normative Atlas event-type sequence in `wireEvents`, including whether and where `stage`, `tool.started` and `sources` appear and whether `usage` is present. Also state the producer ordering grammar in docs/contracts/voice-bff-v1.md: which events are optional and which orderings are permitted.
   - Make #5's typed-turn conformance assert its full emitted sequence. Either assert `(type, data)` equality with `wireEvents` after normalizing turnId and non-deterministic usage, or assert conformance to the stated grammar.
   - Make #6's tests cover at least one grammar-permitted variant (for example, stage and tool.started events interleaved), so the consumer does not depend on the fixture's exact shape.
2. **R1-F002.**
   - Pin `decodeSse`'s failure contract in CONTRACT: the thrown type, and distinct, stable identifiers for (a) EOF/disconnect before terminal, including EOF inside an unterminated or partial final frame, and (b) malformed/protocol violations (bad JSON/schema, seq gap/duplicate, mixed turnId, event before accepted, duplicate accepted, post-terminal event).
   - Add the corresponding client reason codes to the documented stable list.
   - Add CONTRACT tests for each class, including truncation mid-JSON at EOF. Make #6 map them to distinct visible reasons.
   - State explicitly how a complete-but-unterminated final frame is classified.
3. **R1-F003.**
   - Replace the two conflicting sentences with one exact recipe: the enumerated repository-relative file list (explicitly excluding contract-probe.tsx and page.tsx); path ordering; per-entry framing (for example `path + "\0" + byteLength + "\0" + bytes`); and the hash algorithm and output form.
   - State whether the doc is hashed, and if so the exact digest-field exclusion rule. Alternatively, keep the doc out of the hash and verify doc/type agreement separately.
   - Have CONTRACT ship a small script or test that computes the digest, so the root and consumers do not reimplement it.
4. **R1-F004.**
   - Add a CAPTURE-MODULE criterion and test: `start()` invokes `deps.createContext()` and initiates `resume()` synchronously before its first await. A spy records call order relative to `acquireStream`/`createVad`.
   - State that overlong discard/restart and mute/unmute reuse the existing session capture context and never call `createContext` again outside a gesture. A fresh `createContext` happens only on a new user Start.

## Optional suggestions

### R1-F005 — Pin the remaining small wire details the executable agreement leaves open

- **Typed-text limit unit.** Is the 2,000-character limit counted in UTF-16 code units (JS `length`, which matches `maxlength` and the history rule) or in code points? This matters for emoji at the 2,000/2,001 boundary test.
- **Whitespace-only text.** Is it "empty" and rejected? "Strips no meaningful text" is ambiguous.
- **Audio part media type.** Give the exact accepted `audio` part type(s), e.g. `audio/wav`, instead of "non-audio File types".
- **Fixture search state.** Choose one value for `mockCapabilities.search` instead of "configured/pending or unavailable".

### R1-F006 — Have encodeSse serialize the envelope in a fixed key order

The hand-authored raw-frame test only passes if `wireEvents[0]` was built in schemaVersion/turnId/seq/type/data insertion order. Explicitly building `{schemaVersion, turnId, seq, type, data}` inside encodeSse makes producer bytes canonical regardless of how runTurn constructs its objects.

### R1-F007 — Keep retainPairs inside its bounds after omitting a pair

retainPairs is now a public export with arbitrary-input contract tests. In the oversized-newest branch, `pairs.slice(0,-1)` is returned without re-applying the four-pair/16,000-character loop. An arbitrary input of six pairs plus an oversized newest pair therefore returns five pairs, which `validateHistory` would reject. HistoryStore's invariant hides this today. Either apply the trimming loop after omission, which keeps the same result under the store invariant, or document the precondition and test it.

### R1-F008 — Cross-check the delivered retrieval catalog against the shared validator

The plan says the fixture should "use the delivered fixture values". A CONTRACT test that runs apps/retrieval/fixtures/projects.json (or `lookupProjects()` output) through `validateProjectCatalog` would catch drift between #3's retrieval type/schema and the new shared type early. Otherwise that drift only surfaces in #5's HTTP integration.

### R1-F009 — Fix run-together tokens in the ownership authority text

Several words are fused together in the text that is supposed to be the authority on file ownership and exclusivity:

- File/test names: "capabilitiesroute", "slowdeadline tests", "rootpackage-lock/", "scriptedhelper", "audiointegration", "browserharness"
- Phrases: "waitsfull", "browseracceptance", "modulecriteria", "exacttext-history", "ordinaryuse", "retrievalfailure"
- Case mapping: "#6client", "#8early", "#7distinct", "#10misfire", "#10actual"

Using the exact repository paths in the exclusive-files table would make collision checks mechanical.

### R1-F010 — Refresh the stale checkout statement

The plan says "This checkout is clean c5c94f4", but the reviewed revision is 296464b. The later commits are review collateral only. Describe this as the authoring-time snapshot, or drop the commit claim.

## Decision

revisions-requested
