# Independent capture module review, round 2

**Specification: PASS. Code quality: Approved.** No remaining critical, important or minor findings at source `69a25678acd864f5a5db1c84dad52825b5b30d1a`. R1 is resolved.

Issue: [#14](https://github.com/kburson/AIVC/issues/14). PR: [#21](https://github.com/kburson/AIVC/pull/21). Reviewer remains native Codex Astra 6/high, genuine session `01a1380a-1261-7e21-acb5-038941fb330a`, distinct from Sol 6.1/high source author session `01a136a6-0b4b-78a3-8b6f-cbb9cc5cc722`. Normal orchestrator binding generation for this round is `ec096e28-6359-43ea-b796-7fe436a2e25e`, actual capture worktree and `codex/14-draft`. No identity override was used.

The [round-1 finding](round-1.md), [original executable reproduction](round-1-reproduction.md) and [author response](round-1-author-response.md) are preserved. This is an independent code review, separate from sealed specification/plan acceptance and AITM Task Review approval.

## Scope and authority

The full source was reviewed in round 1 against the [accepted design](../../../superpowers/specs/2026-10-12-voice-bff-reference-design.md), [original Task 7](../../../superpowers/plans/2026-10-12-2-voice-bff-reference.md#task-7-capture-automatic-bounded-utterances-without-resource-leaks), [contract-first amendment](../../../superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md), [Task 11 hydration](../../../superpowers/plans/2026-10-13-2-contract-first-hydration-index.md), and [Node 26 amendment](../../../superpowers/plans/2026-10-13-2-node26-parallel-execution-amendment.md). Amendment authority remains commit `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`.

Historical sealed acceptance is linked in the [spec review archive](../../spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/README.md) and [plan review archive](../../plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/README.md). These remain distinct authorities; no historical bytes were rewritten.

This round inspected the complete five-file repair diff from review collateral head `59fed8072ad1116a3b1b5f1cf262985e10f7f2c2` to `69a25678acd864f5a5db1c84dad52825b5b30d1a`: CaptureSession, pinned MicVAD patch, two existing allocated TS test files, and author response. Live Scope/AC/verification records were reread. The original source baseline is `d8d24a59ef956ab2266fc3418c8da49563e43ed8`; original integrated contract base is `6c64bfefc3db5bc19929e774aa8c7e3def282c19`.

## R1 disposition

CaptureSession now retains each failed track-stop outcome alongside its required idempotent WeakSet. The later shutdown pass observes the failure without calling stop again. This preserves benign cancellation handling while making Stop/mute report CAPTURE_CLEANUP_FAILED for actual cleanup errors.

The actual MicVAD lifecycle patch replaces stream attempt-only accounting with a cached promise, registered before invoking pauseStream. Synchronous throws and asynchronous rejections remain observable to later destroy passes, including late initial acquisition and resume. It retains immediate cancel guards, admitted-frame settlement, guarded node cleanup, one model release attempt and cached final disposal.

The change introduces no new dependency between initialization and disposal promises. Successful cleanup remains immediate where previously synchronous; late cleanup reuses its own result and does not wait on a promise whose completion requires destroy. Existing cancellation prevents new activation or callbacks. Resource attempts remain once per track/stream/model ownership. No public signature, frame processor, model algorithm, threshold, sample rate, package pin or shared contract changed.

## Fresh independent execution

The reviewer executed the original round-1 reproduction code block unchanged against the repaired modules. The actual adapter/session result was:

```json
{"outcomes":["fulfilled","rejected"],"statuses":["CAPTURE_CLEANUP_FAILED","CAPTURE_CLEANUP_FAILED"],"trackStops":1,"contextCloses":1,"releaseCalls":1}
```

The direct actual MicVAD result was:

```json
[{"status":"rejected","error":"late pause failed"},{"status":"rejected","error":"MicVAD cleanup failed"}]
```

Stop and destroy now reject rather than conceal failure. Existing duplicate status propagation at shutdown and final Stop is explicit; the contract requires visible cleanup failure, not an exact status-callback count.

The reviewer also freshly ran `npx vitest run tests/voice/capture-module.test.ts tests/voice/vad-lifecycle.test.ts`: **40/40 pass**, consisting of 21 CaptureSession and 19 actual pinned MicVAD cases. The ten added cases cover seven repaired regressions (Stop/mute, sync/async cleanup, and pending resume), plus three characterization cases for late model-release failure and late worklet rejection with/without real cleanup failure. The tests retain healthy-track cleanup, old-event suppression, idempotent release, fresh Start, successful benign cancellation and unresolved-frame settlement.

All previous WAV/assets tests and implementation are unchanged. The author's exact-source canonical Test receipt `01M4W27ZP4F8X6Y1V37MGC24JE` at `69a25678acd864f5a5db1c84dad52825b5b30d1a` was inspected in the live issue. It records clean setup, classified lanes and declared commands, including all **52 allocated cases (8/21/19/4)**. This prior receipt is source-specific; it is not relabeled as fresh reviewer execution or evidence for this subsequent review-document commit.

## Provenance and delivery boundary

Repair patch SHA-256 is `44485e484f4f0223b720e0e02e12e8e498ce6354bf24a21c71e7c60a9f5d9137`; applied JS SHA-256 is `37b55cc57c1463624857ad65a9ceaf9cc073327bc9ed07fd34d0ecbe564eaa2a`; declaration SHA-256 remains `96ebf0ce34024fa79448119ff5e5956e69bd9f2e8aed5648ded27d1e114e1a50`. Asset generation verifies full Git postimage bytes plus the public lifecycle marker. Frozen shared contract digest remains `ef4409385e545e82b91fcd44caaab02e457e8af9404d5abba3f07b8956a1d58c`. Node26.8.1/npm12.0.2 and requested400ms/actual384ms timing remain unchanged.

These tests use controlled model/ORT/browser-node factories around the actual pinned module. Physical microphone, real model inference, browser HTTP/MIME, integrated submission and final live acceptance remain later #9/#10/#11 scope. No credentials or paid calls were used.

After publishing this report, the normal canonical Test must verify its exact documentation head and each Scope/AC record must be refreshed before registered Task Review/Full-Auto approval. Final receipts belong in the issue and PR so adding receipt prose does not change the already verified head. Code approval does not claim those later actions have happened, does not waive gates, and does not authorize Close before the root verifies the actual PR merge and source reachability.
