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

A normal merge preserves accepted baseline dbf5e2f46f3503673aef7db58adb6e07f44f368d and the original branch history. Sealed historical review files are unchanged.

## Dependencies and status

Application source entry requires strict integrated whole-story Done on [#4](https://github.com/kburson/AIVC/issues/4) and [#5](https://github.com/kburson/AIVC/issues/5), plus a current registered native rank-4 grant. Shared contracts from [#13](https://github.com/kburson/AIVC/issues/13) are consumed unchanged through those deliveries.

The story remains Ready for Planning. Fresh Explain reports blocked-by-not-done and refine-exit-wip-budget, with rank-wave-admission-refused and rank-wave-graph-stale on the WIP guard. Documentation publication grants no Plan, Develop, or application source authority. No partial story completion is permitted.

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
