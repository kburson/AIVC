# #7 Deepgram adapter delivery

[Story #7](https://github.com/kburson/AIVC/issues/7) retains bounded prerecorded transcription, streamed synthesis, the speech endpoint, and complete audio-turn integration. **Implementation has not started. Story code review is pending.** This branch publishes planning collateral, with no application verification or live-provider success claimed.

## Governing artifacts

- [Reference design](../superpowers/specs/2026-10-12-voice-bff-reference-design.md), accepted spec bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac.
- [Accepted base plan](../superpowers/plans/2026-10-12-2-voice-bff-reference.md), cb82f730f63ba0e0bd4480f7bc76ca09d286af83, Task 5.
- [Node 26 execution amendment](../superpowers/plans/2026-10-13-2-node26-parallel-execution-amendment.md), 3574e5d35ebaafbf427a68aeac7c66e409b1e4e0.
- [Contract-first amendment](../superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md), 6eda972a9df1bcbe1f8f650e9506c709026b02d8; SHA-256 c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e.
- [Canonical hydration index](../superpowers/plans/2026-10-13-2-contract-first-hydration-index.md), e559f6b33010e2902592fde97ed1560281f7f3d3; SHA-256 fea027696afdad014664e7b4b042aae09cb28f6a5fe46f6eb211f1fc17ca76a4, Task 5. This index represents the accepted plan and is not the reviewed XPR artifact.
- [Spec review collateral](../peer-reviews/spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/README.md).
- [Plan review collateral](../peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/README.md), including contract-first amendment SPR/XPR subdirectories.

Normal merges preserve the original story history and the parent preparation baseline aeabcb9b148486870ebcf685675f02cef8c939e5, including merged #4/#6/#14 delivery and approved #25 quality scans. Original sealed spec/plan/review bytes remain in historical Git blobs and the [original-byte archives](../quality-evidence/README.md). Current protected Markdown files are labeled formatting views; their new hashes do not replace original acceptance or protocol evidence.

## Dependencies and status

Application source entry requires strict integrated whole-story Done on [#4](https://github.com/kburson/AIVC/issues/4) and [#5](https://github.com/kburson/AIVC/issues/5), plus a current registered native rank-4 grant. Shared contracts from [#13](https://github.com/kburson/AIVC/issues/13) are consumed unchanged through those deliveries.

Live checks confirm #4, #6 and #14 Closed/Done; #5 remains Open/Ready for Planning. Story #7 remains Ready for Planning. Fresh Explain reports blocked-by-not-done and refine-exit-wip-budget, with rank-wave-admission-refused and rank-wave-source-unverified on the WIP guard. Documentation publication grants no Plan, Develop, or application source authority. No partial story completion is permitted.

## Exact ownership

The same genuine #7 owner delivers these repository-relative paths after admission:

- apps/web/server/providers/deepgram.ts
- apps/web/app/api/speech/route.ts
- tests/contracts/deepgram.test.ts
- tests/contracts/speech-endpoint.test.ts
- tests/integration/audio-turn.test.ts

Only after the complete #5 handoff, that owner wires:

- apps/web/server/providers/mock.ts
- apps/web/server/runtime.ts
- apps/web/server/capabilities.ts
- apps/web/server/turns/run-turn.ts

Public contracts, validators, and #4 errors/deadlines/leases are consumed, not redefined. UI, capture modules, manifests, installations, and shared-contract edits are outside this ownership. Deepgram is the application provider; the implementer remains Codex. Root #2 owns review, integration, and closure.

## Planned verification

After admitted Develop, write red tests before production code using real pinned @deepgram/sdk@5.15.0 with controlled fetch and actual request counts. Cover WAV STT, configured models, trimmed empty transcript with zero model requests, malformed responses, cancellation, no hidden retries after 429/502, incremental TTS before a deferred tail, actual typed raw-response headers, strict audio/l16 MIME/parameters, JSON/error/missing-body rejection, and mono PCM16 little-endian at 24 kHz metadata.

Verify configured and shorter remaining deadlines, upstream settlement and lease retention, pre-body Origin/Host checks, measured 8 KiB body cap, UUID/segment validation, hard 120/effective 84-character bounds, missing capability, two active leases with third 429, normalized headers, before-byte JSON errors, and after-byte failure with text retained. Complete audio-turn wiring must exercise the actual producer and public fixtures, distinct failures, and nonfatal no-speech completion.

Pending declared commands:

- npx vitest run tests/contracts/deepgram.test.ts tests/contracts/speech-endpoint.test.ts
- npm run test:integration
- npm run typecheck
- npm test
- npm run lint
- npm run format:check
- git log --oneline -1

Functional DoD retains its declared broader tests. This documentation publication validates Markdown links, whitespace, file scope, review preservation, and absence of credentials. It does not satisfy implementation ACs or replace real STT/TTS/browser/microphone evidence. No API keys or live application model choice are required for future offline contract work.

## Installed SDK and delivered seams

Preparation used npm ci in the story worktree and verified the reproducible Node 26.8.1/npm 12.0.2 toolchain. The installed package reports @deepgram/sdk 5.15.0. Manifests and lockfile retain the delivered pins. No release install, global ai-peer-review change, adapter implementation, application test, live request, or credential inspection occurred. The refreshed parent lockfile required npm ci; the accepted VAD patch applied successfully. npm reported 16 audit findings and five blocked dependency install scripts; no repair or script approval was attempted. These setup observations do not establish application verification.

The following evidence is static inspection of the installed package, not a compiled or executed adapter. SDK paths are relative to node_modules/@deepgram/sdk/dist/esm/.

| Boundary                  | Installed primary source                                                                                                                                                                                                                                                                                                                                                                                                  | Consequence for later delivery                                                                                                                                                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Export and configuration  | index.d.mts:6 exports CustomDeepgramClient as DeepgramClient; BaseClient.d.mts:5-34 defines explicit key options, injected fetch, maxRetries, timeoutInSeconds, and abortSignal; CustomClient.mjs:163-187 wraps REST auth and adds a provider session header.                                                                                                                                                             | Use the public DeepgramClient export, server-owned explicit apiKey, injected controlled fetch, and zero retries at both constructor and request. The provider session header is separate from agent identity.                                                                            |
| STT call                  | api/resources/listen/resources/v1/resources/media/client/Client.d.mts:45 declares transcribeFile(uploadable, request, requestOptions). Client.mjs:154-214 builds POST v1/listen, uses model query, binary upload headers, JSON response parsing, abortSignal, and requested timeout/retry values. core/file/types.d.mts:10 accepts a global Blob; core/file/file.mjs:11-27 forwards its content type and measured length. | Pass a WAV Blob with audio/wav type and configured STT model. Keep the shared turn deadline and validate the returned transcript at runtime. Compile the exact typed call after source admission.                                                                                        |
| Transcript shape          | api/resources/listen/resources/v1/resources/media/types/MediaTranscribeResponse.d.mts:2 is ListenV1Response or ListenV1AcceptedResponse. api/types/ListenV1ResponseResultsChannelsItem.d.mts makes alternatives and transcript optional; ListenV1AcceptedResponse.d.mts contains request_id only.                                                                                                                         | Require results.channels[0].alternatives[0].transcript to be a string; an absent transcript or asynchronous accepted payload is malformed for this synchronous contract. Only a valid string trimmed to empty is no-speech, with zero model calls.                                       |
| Synthesis and raw headers | api/resources/speak/resources/v1/resources/audio/client/Client.d.mts declares generate returning HttpResponsePromise of BinaryResponse. Client.mjs:45-82 puts linear16/container none/sample_rate 24000 in query parameters and text in the JSON body. core/fetcher/HttpResponsePromise.d.mts:57 exposes withRawResponse; RawResponse.d.mts:4 and RawResponse.mjs:31-39 retain the actual Response headers and status.    | Read rawResponse.headers.get directly without incompatible coercions. Validate exact audio/l16 and supplied rate/channels before PCM, including malformed/duplicate parameters and JSON success payloads. Treat headers as metadata validation, not proof of real little-endian samples. |
| Body streaming            | core/fetcher/BinaryResponse.mjs:1-13 exposes stream as the original Response.body; getResponseBody.mjs selects binary-response without arrayBuffer/blob conversion.                                                                                                                                                                                                                                                       | Read incrementally; reject a null body. Retain ownership of the binary response and upstream reader through close/error/cancel, cancel the stream on rejection, and never buffer the full synthesis body. Future controlled-fetch tests must prove first bytes precede a deferred tail.  |
| Retry and status handling | core/fetcher/requestWithRetries.mjs:12-59 defaults to two retries for 408/429/5xx and makes one initial request before the retry loop. Fetcher.mjs:125 treats 200-399 as SDK success; error responses are parsed by getErrorResponseBody.mjs before DeepgramError statusCode/rawResponse fields are exposed.                                                                                                              | Explicit maxRetries zero is required, with fetch-count tests for 429/502. Inspect status and MIME before PCM; normalize provider failures into common AppError without forwarding raw body/header secrets.                                                                               |
| Full-body deadline        | core/fetcher/makeRequest.mjs:36-54 combines caller and SDK timeout signals, then clears the SDK timeout when fetch returns headers.                                                                                                                                                                                                                                                                                       | SDK timeout options bound response-header acquisition but do not replace the full BFF deadline. Keep the delivered deadline alive until transcript parsing or PCM upstream settlement; cancellation after headers must still abort and cancel the reader.                                |

Delivered repository seams remain authoritative:

- [Admission](../../apps/web/server/http/admission.ts) provides assertAdmission(headers, config, true), rejecting mismatched Origin/Host before body reads or provider work.
- [Bounded body reader](../../apps/web/server/http/body.ts) provides readBoundedBody(request, maxBytes, signal); speech will consume it with the accepted measured 8 KiB limit. Its settlement comment explicitly prohibits releasing a paid lease merely because a Response was returned.
- [Frozen speech validation](../../apps/web/shared/validation.ts) provides validateSpeech(value, config.segmentChars), preserving UUID, exact fields, nonempty segmentId <=80, and nonempty bounded text. No parallel validator is authored.
- [Deadline](../../apps/web/server/turns/deadline.ts) provides runWithDeadline and deadlineRemainingMs. result is the timeout-facing promise; settled proves the admitted work actually finished. SDK request options must use max(0.001, min(configuredTimeoutMs, remainingMs)/1000).
- [Lease pools](../../apps/web/server/turns/leases.ts) hold two slots per turn or speech kind, with idempotent release. Speech capacity releases after upstream/network reader settlement, including cancellation, rather than after synthesis returns headers.
- [Runtime](../../apps/web/server/runtime.ts) presently has adapters as `Record<string, unknown>`; [capabilities](../../apps/web/server/capabilities.ts) derives speech availability from mock mode or configured key/model. These are consumed now and transferred for #7 wiring only after whole #5 delivery. No private provider contract is substituted while #5 remains incomplete.

The next admitted tests must include after-header abort, late upstream cancellation settlement, nondefault timeout bounds, accepted/malformed STT payloads, genuine empty transcript, and no secret-bearing error/header propagation. Full #5 delivery and native source GO remain prerequisites for that work.

## Current quality and authority checkpoint

The [uniform quality policy](../quality-scans.md) applies to this new collateral. No rule suppression, findings baseline, scan exclusion, protected-artifact formatting write, or TypeScript contract edit is introduced by #7. The current spec/plan links above are formatting views; accepted authority remains attached to these immutable originals:

- [Accepted spec original](https://github.com/kburson/AIVC/blob/bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac/docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md).
- [Accepted base-plan original](https://github.com/kburson/AIVC/blob/cb82f730f63ba0e0bd4480f7bc76ca09d286af83/docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md).
- [Accepted Node 26 amendment original](https://github.com/kburson/AIVC/blob/3574e5d35ebaafbf427a68aeac7c66e409b1e4e0/docs/superpowers/plans/2026-10-13-2-node26-parallel-execution-amendment.md).
- [Accepted contract-first amendment original](https://github.com/kburson/AIVC/blob/6eda972a9df1bcbe1f8f650e9506c709026b02d8/docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md).
- [Canonical hydration original](https://github.com/kburson/AIVC/blob/e559f6b33010e2902592fde97ed1560281f7f3d3/docs/superpowers/plans/2026-10-13-2-contract-first-hydration-index.md).

Whole #4 and #5 strict Done plus actual native readiness remain required. The admitted runtime still returns blocked-by-not-done and rank-wave-admission-refused with reason rank-wave-source-unverified. This documentation checkpoint creates no source grant, lifecycle transition, replacement claim, new sealed acceptance, or partial completion. Adapter implementation, application tests and code review remain pending.

Selected-document Markdownlint and Prettier validation reported zero findings. The read-only sealed-evidence verifier confirmed all 74 archived originals against historical Git blobs. All 16 local links and five immutable Git blob links resolve; the credential-pattern scan found no matches. These are documentation and preservation checks, not application verification.
