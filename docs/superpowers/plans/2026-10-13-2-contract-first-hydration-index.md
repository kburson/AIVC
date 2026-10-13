# Contract-first Hydration Index for Epic #2

This separate document is a canonical hydration representation of the accepted plan and contract-first amendment. **It is not the XPR-reviewed artifact**, does not alter accepted behavior, ranks, estimates, pins, ownership or evidence gates, and grants no implementation/Plan/wave/lifecycle authority. Root independently validates this index's full mapping before making it an active Source-plan/Implementation-plan reference or approving new issues.

The accepted contract-first amendment is `docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md` @ `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`. It was accepted in normal-commit XPR `review-63ab7e25e4be96aca3960c251687c2e1` by the same recorded Claude Opus5.5/high reviewer after two revisions, following normal SPR. Generated authority assurance remains unavailable. XPR acceptance is plan evidence, not issue approval or native grant.

The immutable base plan is `docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md` @ `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, SHA-256 `5dc37eb3c25f59d056756b45582a584ea321ac3a881041992b073b5a3656523e`. The accepted Node26 amendment is `docs/superpowers/plans/2026-10-13-2-node26-parallel-execution-amendment.md` @ `3574e5d35ebaafbf427a68aeac7c66e409b1e4e0`, SHA-256 `0d478dc1a1a114b63c7ebd2bf151fa7e0e5b17ed33f4410c81a06ddc098cd939`. Historical spec remains `bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac` / SHA-256 `8512daa8c456af00628a16471d4b13526c7585172c223c8bfa0f2323bee4fff6`. No source bytes are rewritten by this index.

## Story Intent

- **Beneficiary:** developer learning conversational AI application architecture
- **Capability:** use and inspect a hands-free reference application with visible browser, BFF, provider and retrieval boundaries
- **Need:** a diagram alone cannot demonstrate grounded answers, interruption, failure handling or actual voice latency
- **Value or failure prevented:** the developer can test and extend the architecture using working behavior and honest evidence about its limits

## Canonical task mapping

Plan Task numbers are extractor selectors, not issue IDs. Original Task1–9 numbers/titles/intents remain. New Task10 is CONTRACT and new Task11 is CAPTURE-MODULE; no numeric issue IDs are invented. Root hydrates real IDs then uses each exact heading below as Source-plan-section. Each issue's active Source-plan/Implementation-plan must consistently reference this index; the accepted amendment remains separately pinned technical authority. Scope/AC/VC hydration copies complete accepted obligations rather than interpreting these short mapping descriptions as reduced acceptance.

| Plan task | Existing or named child | Accepted scope allocation |
|---|---|---|
| 1 | #3 | Delivered workspace/Fastify, unchanged |
| 2 | #4 | BFF admission/server boundary after public extraction |
| 3 | #5 | Claude producer/tools/HTTP path after shared SSE extraction |
| 4 | #6 | Complete typed browser consumer; joined actual HTTP browser acceptance moves Task9 |
| 5 | #7 | Complete Deepgram provider/endpoints and same-owner wiring |
| 6 | #8 | Full PCM/playback/speech queue and wiring |
| 7 | #9 | Capture UI integration consuming Task11 module |
| 8 | #10 | Full interruption and race behavior |
| 9 | #11 | Whole-system/live/tutorial plus joined typed browser acceptance |
| 10 | CONTRACT, issue unassigned | Complete frozen public agreement foundation |
| 11 | CAPTURE-MODULE, issue unassigned | Complete capture library/patch/assets |

## Canonical tasks

### Task 1: Reproduce the synthetic retrieval boundary in the pinned workspace

#### Story Intent

- **Beneficiary:** developer examining the application data boundary
- **Capability:** run a separate deterministic project service alongside the browser application
- **Need:** local fixture substitution inside the BFF would conceal the independent HTTP retrieval boundary
- **Value or failure prevented:** the developer can reproduce exact answers and observe service failure without private data or a database

#### Source scope and preserved requirements

Accepted amendment: `docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md` @ `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`. Original scope: `docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md` @ `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, as narrowed/transferred explicitly below and by that amendment. Accepted Node26 runtime amendment `3574e5d35ebaafbf427a68aeac7c66e409b1e4e0` overrides historical Node24 prose.

Keep original Task1 complete workspace/retrieval/toolchain delivery and evidence. No Fastify implementation is invented. Implementation/lifecycle status is live-authority-owned; this index does not close or reverify #3.

All original accepted requirements remain except the expressly transferred ownership above; accepted amendment owns exact entry/completion graph, file/API/test ownership, all15-case coverage and truthful final evidence. No partial story Done or native grant inferred.

#### Verification Commands

```sh
npx vitest run tests/contracts/retrieval.test.ts tests/contracts/fixture-schema.test.ts tests/scripts/epic-wrapper.test.ts tests/scripts/launcher.test.ts
npm run typecheck
npm run build
npm run lint
npm run format:check
```

These are accepted verifier declarations, not passing results. Run all additional impacted complete-scope checks required by the accepted amendment and canonical hydrated issue; full Test/Review/approved delivery/Close remains separately mandatory.

### Task 2: Admit and bound requests before paid work

#### Story Intent

- **Beneficiary:** local reference-application operator
- **Capability:** reject untrusted browser origins and oversized or malformed requests before provider work
- **Need:** a loopback paid endpoint can receive simple cross-origin requests and cancellation may outlive its HTTP response
- **Value or failure prevented:** unintended paid calls, unbounded buffering and excess upstream concurrency are prevented

#### Source scope and preserved requirements

Accepted amendment: `docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md` @ `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`. Original scope: `docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md` @ `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, as narrowed/transferred explicitly below and by that amendment. Accepted Node26 runtime amendment `3574e5d35ebaafbf427a68aeac7c66e409b1e4e0` overrides historical Node24 prose.

Accepted amendment sections Detailed producer and consumer conformance execution / #4 BFF boundary, Exclusive files and source changes, and Collision-sensitive exact path index. Move shared public contracts/validation/history and pure input checks to Task10; retain full counted body/admission/config/build/capabilities/runtime/leases/deadline behavior. tests/contracts/body.test.ts replaces residual measured-body portion of old combined input.test.ts. No public/server-secret boundary or final paid-endpoint case is removed.

All original accepted requirements remain except the expressly transferred ownership above; accepted amendment owns exact entry/completion graph, file/API/test ownership, all15-case coverage and truthful final evidence. No partial story Done or native grant inferred.

#### Verification Commands

```sh
npx vitest run tests/contracts/admission.test.ts tests/contracts/body.test.ts tests/contracts/leases.test.ts tests/contracts/config.test.ts tests/contracts/build-info.test.ts
npm run test:slow
npm run typecheck
npm run lint
npm run format:check
```

These are accepted verifier declarations, not passing results. Run all additional impacted complete-scope checks required by the accepted amendment and canonical hydrated issue; full Test/Review/approved delivery/Close remains separately mandatory.

### Task 3: Stream grounded typed answers through Claude and the retrieval HTTP service

#### Story Intent

- **Beneficiary:** developer learning BFF aggregation and tool execution
- **Capability:** ask typed project or general questions and observe normalized streamed answers from validated provider and retrieval calls
- **Need:** tool IDs, provider pauses and request-scoped search limits can be lost during multi-round orchestration
- **Value or failure prevented:** grounded project cards and citations remain attributable while infinite loops, search-budget overruns and hidden replays are prevented

#### Source scope and preserved requirements

Accepted amendment: `docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md` @ `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`. Original scope: `docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md` @ `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, as narrowed/transferred explicitly below and by that amendment. Accepted Node26 runtime amendment `3574e5d35ebaafbf427a68aeac7c66e409b1e4e0` overrides historical Node24 prose.

Accepted amendment sections #5 BFF producer, Complete normative event agreement and decoder signals, and exact ownership index. Task10 owns shared SSE/types/fixture; Task3 retains all Claude/native-tool/search budgets, actual Fastify HTTP retrieval, full producer type/data conformance, native invalid-argument continuation and terminal unavailable retrieval, canceled settlement and complete typed server path.

All original accepted requirements remain except the expressly transferred ownership above; accepted amendment owns exact entry/completion graph, file/API/test ownership, all15-case coverage and truthful final evidence. No partial story Done or native grant inferred.

#### Verification Commands

```sh
npm run test:integration
npx vitest run tests/contracts/search-budget.test.ts tests/contracts/sse.test.ts
npm run test:slow
npm run typecheck
```

These are accepted verifier declarations, not passing results. Run all additional impacted complete-scope checks required by the accepted amendment and canonical hydrated issue; full Test/Review/approved delivery/Close remains separately mandatory.

### Task 4: Give the typed conversation one safe UI and atomic completed history

#### Story Intent

- **Beneficiary:** person using typed fallback or inspecting a voice answer
- **Capability:** read current grounded answers and follow up using the last completed text context
- **Need:** late callbacks, incomplete turns and unsafe model links can corrupt visible answers or conversation context
- **Value or failure prevented:** stale responses cannot overwrite a new question and incomplete content cannot masquerade as established history

#### Source scope and preserved requirements

Accepted amendment: `docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md` @ `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`. Original scope: `docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md` @ `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, as narrowed/transferred explicitly below and by that amendment. Accepted Node26 runtime amendment `3574e5d35ebaafbf427a68aeac7c66e409b1e4e0` overrides historical Node24 prose.

Accepted amendment sections #6 Browser consumer, Client/module evidence versus system evidence, and exact ownership index. Consume Task10 frozen agreement instead of waiting for Task3 source. Keep complete generation/history/render/typed fallback/error/Busy/safe-link/Strict Mode safeguards. Controlled transport is explicitly Mock/Contract Simulation; actual joined Next/Fastify browser acceptance moves Task9. Extra permitted traces remain in child-owned tests, never change frozen fixture. Replace starter probe with actual consumer.

All original accepted requirements remain except the expressly transferred ownership above; accepted amendment owns exact entry/completion graph, file/API/test ownership, all15-case coverage and truthful final evidence. No partial story Done or native grant inferred.

#### Verification Commands

```sh
npm test
npx vitest run tests/contracts/history.test.ts tests/contracts/turn-controller.test.ts tests/contracts/links.test.tsx
npm run test:browser -- --grep typed
npm run typecheck
```

These are accepted verifier declarations, not passing results. Run all additional impacted complete-scope checks required by the accepted amendment and canonical hydrated issue; full Test/Review/approved delivery/Close remains separately mandatory.

### Task 5: Connect bounded prerecorded transcription and streamed synthesis

#### Story Intent

- **Beneficiary:** person asking spoken questions and hearing answers
- **Capability:** use real server-side transcription and streamed speech while retaining a usable text answer on speech failure
- **Need:** provider errors, header formats and hidden SDK retries can turn bounded requests into invalid audio or duplicate paid work
- **Value or failure prevented:** voice is attributable to the selected provider and failed speech cannot destroy the text conversation

#### Source scope and preserved requirements

Accepted amendment: `docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md` @ `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`. Original scope: `docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md` @ `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, as narrowed/transferred explicitly below and by that amendment. Accepted Node26 runtime amendment `3574e5d35ebaafbf427a68aeac7c66e409b1e4e0` overrides historical Node24 prose.

Accepted amendment remaining integration #7 paragraph and exact ownership index retain entire original Task5 provider/STT/TTS/speech route scope. Independent Deepgram files after BFF admission; same genuine owner wires mock/runtime/run-turn/capabilities after Task3 complete. Hold whole child until Task3 if native phase representation cannot admit earlier source; no partial completion.

All original accepted requirements remain except the expressly transferred ownership above; accepted amendment owns exact entry/completion graph, file/API/test ownership, all15-case coverage and truthful final evidence. No partial story Done or native grant inferred.

#### Verification Commands

```sh
npx vitest run tests/contracts/deepgram.test.ts tests/contracts/speech-endpoint.test.ts
npm run test:integration
npm run typecheck
```

These are accepted verifier declarations, not passing results. Run all additional impacted complete-scope checks required by the accepted amendment and canonical hydrated issue; full Test/Review/approved delivery/Close remains separately mandatory.

### Task 6: Speak stable text early with PCM accounting and request backpressure

#### Story Intent

- **Beneficiary:** person listening to a generated answer
- **Capability:** hear sentences in order before the answer finishes while ordinary long answers drain safely
- **Need:** fast synthesis and a suspended playback clock can accumulate generated audio beyond the playback budget
- **Value or failure prevented:** normal answers remain audible while overflow, stalls and incorrect sample handling cannot create unbounded speech backlog

#### Source scope and preserved requirements

Accepted amendment: `docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md` @ `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`. Original scope: `docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md` @ `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, as narrowed/transferred explicitly below and by that amendment. Accepted Node26 runtime amendment `3574e5d35ebaafbf427a68aeac7c66e409b1e4e0` overrides historical Node24 prose.

Accepted amendment remaining integration #8 paragraph retains entire original Task6 PCM/sample/accounting/queue/text segmentation/backpressure/emergency/Conversation wiring scope. Consume frozen Task10 fixture and full Task4/Task5 deliveries before shared UI wiring.

All original accepted requirements remain except the expressly transferred ownership above; accepted amendment owns exact entry/completion graph, file/API/test ownership, all15-case coverage and truthful final evidence. No partial story Done or native grant inferred.

#### Verification Commands

```sh
npm run test:voice
npm run test:slow
npm run typecheck
```

These are accepted verifier declarations, not passing results. Run all additional impacted complete-scope checks required by the accepted amendment and canonical hydrated issue; full Test/Review/approved delivery/Close remains separately mandatory.

### Task 7: Capture automatic bounded utterances without resource leaks

#### Story Intent

- **Beneficiary:** person asking hands-free questions
- **Capability:** start once, speak naturally and automatically submit completed utterances without transcript approval
- **Need:** VAD assets, browser permission and asynchronous startup can clip speech, duplicate sessions or leave the microphone active after Stop
- **Value or failure prevented:** natural turns remain automatic and microphone/audio resources end when requested

#### Source scope and preserved requirements

Accepted amendment: `docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md` @ `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`. Original scope: `docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md` @ `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, as narrowed/transferred explicitly below and by that amendment. Accepted Node26 runtime amendment `3574e5d35ebaafbf427a68aeac7c66e409b1e4e0` overrides historical Node24 prose.

Accepted amendment remaining integration #9 paragraph and exact ownership index. Extract WAV/VAD/capture-session/patch/manifests/assets into complete Task11; this residual delivery owns full automatic Start/Stop/mutes/gesture/context/browser/actual pinned asset load integration after Task6 plus Task11. Import delivered library; do not re-own its files to bypass compatibility review.

All original accepted requirements remain except the expressly transferred ownership above; accepted amendment owns exact entry/completion graph, file/API/test ownership, all15-case coverage and truthful final evidence. No partial story Done or native grant inferred.

#### Verification Commands

```sh
npm run assets:vad
npm run test:voice
npx vitest run tests/contracts/assets.test.ts tests/voice/vad-lifecycle.test.ts
npm run test:browser -- --grep capture
npm run typecheck
npm run build
```

These are accepted verifier declarations, not passing results. Run all additional impacted complete-scope checks required by the accepted amendment and canonical hydrated issue; full Test/Review/approved delivery/Close remains separately mandatory.

### Task 8: Resolve tentative speech, confirmed interruption and async races

#### Story Intent

- **Beneficiary:** person interrupting an answer while still being heard
- **Capability:** pause output immediately on detected speech, recover from noise and replace the turn only after genuine speech confirmation
- **Need:** canceling on every raw VAD start loses slow work and misfires can resurrect obsolete audio after confirmation
- **Value or failure prevented:** ordinary noise causes no paid replay while genuine interruption prevents stale audio, cards and history from overtaking the new turn

#### Source scope and preserved requirements

Accepted amendment: `docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md` @ `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`. Original scope: `docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md` @ `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, as narrowed/transferred explicitly below and by that amendment. Accepted Node26 runtime amendment `3574e5d35ebaafbf427a68aeac7c66e409b1e4e0` overrides historical Node24 prose.

Accepted amendment remaining integration #10 paragraph preserves complete original interruption/candidate/generation/async suspension/recovery/history/mute/Stop/browser timing scope. All full playback/capture integration predecessors required. Accepted capture observer seam is consumed; module edits only through serialized compatibility review and impacted checks.

All original accepted requirements remain except the expressly transferred ownership above; accepted amendment owns exact entry/completion graph, file/API/test ownership, all15-case coverage and truthful final evidence. No partial story Done or native grant inferred.

#### Verification Commands

```sh
npm run test:voice
npm run test:slow
npm run test:browser -- --grep interruption
npm run typecheck
```

These are accepted verifier declarations, not passing results. Run all additional impacted complete-scope checks required by the accepted amendment and canonical hydrated issue; full Test/Review/approved delivery/Close remains separately mandatory.

### Task 9: Prove live boundaries and publish a compact code-linked tutorial

#### Story Intent

- **Beneficiary:** developer reproducing or extending the reference application
- **Capability:** distinguish passing offline checks from measured live provider and browser behavior
- **Need:** mocked voice, configured search and a few timing trials cannot establish live acceptance or production performance
- **Value or failure prevented:** the developer can reproduce verified behavior without mistaking unavailable capabilities or unresolved echo for successful delivery

#### Source scope and preserved requirements

Accepted amendment: `docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md` @ `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`. Original scope: `docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md` @ `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, as narrowed/transferred explicitly below and by that amendment. Accepted Node26 runtime amendment `3574e5d35ebaafbf427a68aeac7c66e409b1e4e0` overrides historical Node24 prose.

Accepted amendment remaining integration #11 paragraph, Full15-case ownership table and Final root verification and delivery preserve complete whole-branch/live/tutorial/evidence scope. Add actual Next/Fastify typed-system.spec.ts with deterministic providers and no turn interception, transferred from Task4. Every live L1–L8 and all15 cases remain mandatory; mock evidence never passes missing real acceptance. Epic trail gains real Task10/Task11 children after hydration.

All original accepted requirements remain except the expressly transferred ownership above; accepted amendment owns exact entry/completion graph, file/API/test ownership, all15-case coverage and truthful final evidence. No partial story Done or native grant inferred.

#### Verification Commands

```sh
npm test
npm run test:contracts
npm run test:integration
npm run test:voice
npm run test:browser
npm run test:slow
npm run typecheck
npm run build
npm run lint
npm run format:check
npm run verify:docs
npm run verify:live
node scripts/task-tracker/verify-epic-trail.mjs
```

These are accepted verifier declarations, not passing results. Run all additional impacted complete-scope checks required by the accepted amendment and canonical hydrated issue; full Test/Review/approved delivery/Close remains separately mandatory.

### Task 10: Deliver the frozen public voice BFF contract foundation

#### Story Intent

- **Beneficiary:** developer implementing browser or BFF
- **Capability:** implement both sides against shared validated requests, normalized events and executable traces
- **Need:** independently developed endpoints/consumers can drift in fields, framing, text and terminal semantics
- **Value or failure prevented:** independently tested components compose without malformed inputs, stale results or false completion

#### Source scope and preserved requirements

Accepted amendment: `docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md` @ `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`. Original scope: `docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md` @ `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, as narrowed/transferred explicitly below and by that amendment. Accepted Node26 runtime amendment `3574e5d35ebaafbf427a68aeac7c66e409b1e4e0` overrides historical Node24 prose.

Accepted amendment Detailed contract foundation execution; Executable API agreement; Complete normative event agreement and decoder signals; deterministic five-file digest; exact ownership index. Deliver all public client-safe types/validators/history/SSE/errors/grammar/full fixtures/conformance/docs/digest command/browser compilation probe. Freeze reviewed source before browser/BFF code fanout. Whole complete standalone module lifecycle, never claimed live provider/system success.

All original accepted requirements remain except the expressly transferred ownership above; accepted amendment owns exact entry/completion graph, file/API/test ownership, all15-case coverage and truthful final evidence. No partial story Done or native grant inferred.

#### Verification Commands

```sh
npx vitest run tests/contracts/wire-contracts.test.ts tests/contracts/public-validation.test.ts tests/contracts/public-history.test.ts tests/contracts/sse.test.ts tests/contracts/contract-digest.test.ts
node scripts/contract-digest.mjs
npm run typecheck
npm run build
npm run lint
npm run format:check
```

These are accepted verifier declarations, not passing results. Run all additional impacted complete-scope checks required by the accepted amendment and canonical hydrated issue; full Test/Review/approved delivery/Close remains separately mandatory.

### Task 11: Deliver the bounded capture module and pinned lifecycle assets

#### Story Intent

- **Beneficiary:** hands-free capture user
- **Capability:** produce bounded attributable WAV utterances and stop resources reliably
- **Need:** late permission/model/inference can outlive Stop or allow malformed/unbounded capture
- **Value or failure prevented:** downstream wiring receives valid utterances without leaving microphone or model resources alive

#### Source scope and preserved requirements

Accepted amendment: `docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md` @ `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`. Original scope: `docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md` @ `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, as narrowed/transferred explicitly below and by that amendment. Accepted Node26 runtime amendment `3574e5d35ebaafbf427a68aeac7c66e409b1e4e0` overrides historical Node24 prose.

Accepted amendment Detailed complete capture module execution; Capture gesture and restart contract; callback/reason seam; exact ownership index. Deliver WAV/VAD/capture-session/pinned lifecycle patch/manifest/assets/serialized package ownership and actual patched MicVAD module checks. No Conversation/controller/BFF submission/browser integration until Task7. Full module independently reaches Test/Review/delivery/Done.

All original accepted requirements remain except the expressly transferred ownership above; accepted amendment owns exact entry/completion graph, file/API/test ownership, all15-case coverage and truthful final evidence. No partial story Done or native grant inferred.

#### Verification Commands

```sh
npm run assets:vad
npx vitest run tests/voice/wav.test.ts tests/voice/capture-module.test.ts tests/voice/vad-lifecycle.test.ts tests/contracts/assets.test.ts
npm run typecheck
npm run build
npm run lint
npm run format:check
```

These are accepted verifier declarations, not passing results. Run all additional impacted complete-scope checks required by the accepted amendment and canonical hydrated issue; full Test/Review/approved delivery/Close remains separately mandatory.

## Representation validation boundary

Root verifies all eleven exact headings and four substantive single-line intent fields with installed extractPlanTasks/user-story-quality, compares original1–9 intents against immutable base and new10/11 against accepted amendment, and independently reads this index before source linkage/Plan approval. If a mapping changes accepted semantics, stop and review that semantic deviation; this representation does not authorize it. No AITM source, policy, receipts or identity is modified to make extraction pass.
