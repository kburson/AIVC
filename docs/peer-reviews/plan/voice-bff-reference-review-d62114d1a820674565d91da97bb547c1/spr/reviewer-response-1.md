<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-d62114d1a820674565d91da97bb547c1"
role: "reviewer"
turn: 1
commit_mode: "normal"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md"
artifact_commit: "f0a4971adf76da1db1b4d4efd626faf4842089a3"
artifact_blob: "e2b2bf28e5287e4416e676409002d7745c1f48f6"
artifact_digest: "sha256:810b1f1a18964fa185fe2e92b358cab9d2a259d5b43fbbc56ab03577c91483f1"
agent:
  host: "codex"
  provider: "openai"
  model_id: "gpt-6-astra"
  model_display: "gpt-6-astra"
  session_fingerprint: "sha256:26905761b314a738f4c13fa256f8a1bdc358ab76086141b9761e701741329250"
  identity_source: "declared"
started_at: "2026-10-13T05:22:27.904Z"
submitted_at: "2026-10-13T05:27:47.521Z"
finding_ids: ["R1-F001","R1-F002","R1-F003"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---

Mode: `normal`

## Summary

Revisions requested for three implementation-contract gaps in the browser voice path. The plan otherwise preserves the accepted two-process architecture, covers all 15 numbered specification cases, assigns every epic verifier an implementation owner, and distinguishes the 38-hour estimate from the provisional eight-hour timebox. It does not claim executed application tests or live acceptance.

This is independent plan review, not implementation verification or Plan approval. I read the complete 717-line sealed artifact and complete accepted specification; checked their SHA-256 values; inspected the existing package manifest and the installed epic-verifier export; and checked relevant upstream primary sources. The plan hash matches the protected frontmatter. The specification hash is `8512daa8c456af00628a16471d4b13526c7585172c223c8bfa0f2323bee4fff6`, matching the plan's provenance. No Git command, artifact edit, application execution, dependency installation or provider call was performed. Authority assurance is unavailable as recorded by the protocol.

**Coverage and feasibility assessment**

| Area | Assessment |
|---|---|
| Task 1 and command ownership | Workspace/retrieval contracts, exact fixtures, script runner, formatter exclusions and epic wrapper have concrete files and verifiers. The installed verifier exports `main` and recognizes the proposed issue override. No missing final command is silently waived. |
| Task 2 admission and leases | Explicit pre-body origin/host rejection, measured body limits, WAV/history validation and upstream-settlement leases address spec cases 9, 14 and 15. Slow tests distinguish response deadline from actual cancellation settlement. |
| Task 3 model/retrieval/search/SSE | Native blocks and IDs, actual retrieval HTTP, bounded rounds/tools/search, no replay, normalized incremental SSE and search availability cover cases 1, 3, 7, 11 and 13. Exhausted-tool continuation remains live evidence, not an assumed provider guarantee. |
| Task 4 UI/history | Whole-pair history, current-generation gates, safe rendering, truthful incomplete states and typed browser tests cover cases 4, 7, 14 and 15. |
| Task 5 speech provider | Pinned SDK methods, raw streaming response, zero retries and lease/deadline ownership are supported by the checked API source. Optional metadata-hardening suggestion appears below. |
| Task 6 playback | Exact 24 kHz PCM ledger, split-sample handling, request backpressure, active-response draining and emergency teardown address cases 3, 6 and 10. Streaming text stabilization needs the correction in R1-F003. |
| Task 7 capture | Asset provenance, real browser asset check, bounded utterances, gesture startup and resource tests cover cases 5 and 8. The prescribed partial-start cleanup conflicts with the pinned library in R1-F001. |
| Task 8 interruption | Tentative pause, no paid replay, stale event guards and slow-settlement concurrency address cases 4, 12 and 15. Confirmed utterance ownership needs the explicit distinction in R1-F002. |
| Task 9 delivery evidence | All 15 cases and eight live scenarios are mapped; real search/STT/TTS/browser evidence, missing-capability outcomes, sample counts and source-bound read-only verification are explicit. Speaker failures and unavailable pause evidence stay nonpassing. |
| Scope and estimate | Nine sequential tasks total 38 expected hours with a 27–55-hour range. The eight-hour checkpoint requires reporting open scope and further owner authorization; it does not rebrand a partial mock as the completed baseline. Approval/decomposition remain root-owned. |

## Findings

### R1-F001 — Close the model-resource gap before prescribing partial VAD cleanup

**Priority:** P2. **Location:** Task 7, especially lines 555–565 and its cleanup tests at line 567. **Affected contract:** spec case 8 and Stop/unmount resource release.

The plan correctly observes that pinned `destroy()` assumes initialized audio nodes, but then prescribes calling it only after successful `start()`. In the selected source, `MicVAD.new({startOnLoad:false})` has already created the model before returning the VAD instance. `destroy()` calls `getAudioInstances()` before `model.release()`. If Stop invalidates the epoch while `new()` is pending, it can receive an allocated but never-started instance; likewise `start()` can fail during worklet initialization. Skipping destroy and stopping tracks/closing the caller-owned AudioContext does not reach the model release. Repeated failed or canceled starts therefore retain ONNX/WASM resources, despite the planned assertion that all VAD resources were released. This is a concrete uncovered lifetime, not a request for generalized lifecycle infrastructure.

**Required change:** Specify a verified cleanup mechanism for the allocated-but-not-started and partially-started pinned VAD instances, including model/session resources, without activating capture after a canceled epoch. If that cannot be done with the selected public API, explicitly resolve the dependency/lifecycle choice in the plan rather than instructing implementation to claim cleanup from stopped tracks alone. Keep the successful-start cleanup path distinct and idempotent.

**Verification:** Add focused failure cases for (a) model creation resolves after Stop, before start, and (b) worklet initialization rejects after model allocation. Require observable model/session release as well as track/node/context cleanup, zero post-cancel listening/submission, and successful subsequent fresh Start. A generic mock destroy spy is insufficient unless the adapter test also establishes that the pinned implementation actually reaches the release path.

### R1-F002 — Give confirmed capture an owner independent of the canceled answer token

**Priority:** P2. **Location:** Task 8 interface and transition, lines 594–610. **Affected contract:** automatic next utterance after confirmed interruption; spec cases 5 and 12.

The retained candidate has only an answer `token`, phase and candidate ID. The interface then requires all callbacks to check the current generation, while confirmation explicitly invalidates that same answer generation. Applying the stated guard to the later `end` callback rejects the very confirmed utterance that should create the next turn. Conversely, removing the generation guard from end without another ownership rule can admit an obsolete end after typed submit, Stop, mute or a newer candidate. The prose requests both outcomes but does not provide a coherent state contract for them; the initial Listening path also requires a candidate when no answer token exists.

**Required change:** Distinguish captured-utterance ownership from the interrupted answer token. Define the confirmed candidate's end-admission predicate using a capture epoch/candidate identity and explicit invalidation rules, while retaining the old answer token only for old-output cancellation. Define the no-active-answer state. Make clear which callbacks require the old token to remain current and which confirmed end callback remains authorized after its deliberate invalidation.

**Verification:** Require a complete raw-start → confirmation → old-generation invalidation → speech-end test that submits exactly once, plus no-current-answer startup. Repeat with typed submit, Stop/mute and a newer candidate between confirmation and end and assert the old end submits nothing. Delayed playback callbacks must still be unable to resume old audio.

### R1-F003 — Treat an answer-delta boundary as provisional during speech segmentation

**Priority:** P2. **Location:** Task 6 sentence detection, lines 511–512. **Affected contract:** meaningful numbers and URLs remain intact; early stable speech in spec case 6.

The planned punctuation predicate accepts whitespace or end after punctuation, but `SpeechText.push(delta)` sees arbitrary provider chunks. End of the current accumulated chunk is not end of the answer. For example, pushes containing `The value is 3.` and then `5 today. ` can prematurely enqueue a sentence before the decimal exception is knowable. Splitting `https://example.` from `com/path` similarly risks speaking or stripping incomplete pieces incorrectly. Testing complete strings containing `3.5`, abbreviations and URLs does not establish this streaming behavior. Once the first segment has been sent for synthesis, a later chunk cannot repair it.

**Required change:** Define buffering/lookahead for ambiguous trailing punctuation and partial formatting/URL tokens across `push` calls; reserve actual end-of-answer flushing for `finish()` or the explicitly allowed terminal status. State that a transport/delta boundary alone never proves a stable sentence boundary.

**Verification:** Partition representative decimal, abbreviation, URL, citation and Markdown examples at every character boundary and require the same eventual sanitized speech segmentation as the unsplit input, with no premature emission at the ambiguous boundary. Retain a test showing an unambiguous completed sentence still starts speech before model completion.

## Required changes

1. Resolve R1-F001 in Task 7 with an achievable pinned-library cleanup contract and targeted release tests.
2. Resolve R1-F002 in Task 8 with explicit capture-candidate ownership and the complete confirmed-interruption/end test.
3. Resolve R1-F003 in Task 6 with incremental segmentation rules and chunk-partition tests.

The requested changes are plan corrections. Application tests and actual live behavior remain implementation obligations; do not manufacture passing execution evidence during plan revision.

## Optional suggestions

- Task 5 currently checks `contentType.toLowerCase().startsWith('audio/l16')` and then advertises fixed 24 kHz mono PCM. Consider parsing the MIME type and checking supplied rate/channel parameters, rejecting contradictory metadata such as `audio/l16;rate=16000`. A prefix match also accepts a distinct type beginning with that text. The fixed request parameters are correct, but a precise response boundary would make the normalized format claim stronger. Add controlled-fetch cases if adopted.

**Primary-source verification**

- [Pinned MicVAD implementation](https://github.com/ricky0123/vad/blob/de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d/packages/web/src/real-time-vad.ts): confirms caller-owned audio context, deferred start, real-start callbacks and 16 kHz end samples. Model construction precedes optional start; destroy obtains complete audio instances before releasing the model. This supports R1-F001. The public method order, rather than a live memory measurement, establishes the uncovered path.
- [Pinned VAD package metadata](https://github.com/ricky0123/vad/blob/de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d/packages/web/package.json): identifies version 0.0.31 and its ORT dependency. Actual asset/build compatibility still needs the planned browser test.
- [Deepgram synthesis client](https://github.com/deepgram/deepgram-js-sdk/blob/v5.15.0/src/api/resources/speak/resources/v1/resources/audio/client/Client.ts): confirms `generate`, raw response, binary-response mode and request-level abort/retry/timeout options. [BinaryResponse](https://github.com/deepgram/deepgram-js-sdk/blob/v5.15.0/src/core/fetcher/BinaryResponse.ts) returns the original response body through `stream()`. [RawResponse](https://github.com/deepgram/deepgram-js-sdk/blob/v5.15.0/src/core/fetcher/RawResponse.ts) preserves a Headers object, supporting the plan's `.headers.get` access.
- [Deepgram media settings](https://developers.deepgram.com/docs/tts-media-output-settings): confirms REST linear16 supports no container and 24 kHz and documents a rate-bearing audio/l16 content type. This supports the chosen request format and optional response-metadata check; it does not prove actual incremental delivery.
- [Claude hosted search documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool): inspected as the plan's primary search reference. The plan conservatively retains a separate live proof for exhausted-tool and pause continuations instead of treating documentation/configuration as account validation.

## Decision

revisions-requested
