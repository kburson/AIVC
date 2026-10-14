# Capture module #14 activation checkpoint

This draft checkpoint records accepted scope and current offline implementation progress for [issue #14](https://github.com/kburson/AIVC/issues/14), under epic #2. It does not deliver the unfinished module source.

## Accepted sources and review collateral

- [Reference design](../superpowers/specs/2026-10-12-voice-bff-reference-design.md)
- [Reference implementation plan](../superpowers/plans/2026-10-12-2-voice-bff-reference.md)
- [Contract-first amendment](../superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md), accepted commit `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`
- [Hydration index, Task 11](../superpowers/plans/2026-10-13-2-contract-first-hydration-index.md)
- [Node 26 amendment](../superpowers/plans/2026-10-13-2-node26-parallel-execution-amendment.md)
- [Specification peer review](../peer-reviews/spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/README.md)
- [Plan peer review and amendment collateral](../peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/README.md)

## Assigned delivery

Issue #13 is Done and integrated at `6c64bfefc3db5bc19929e774aa8c7e3def282c19`. This branch was safely rebased onto that accepted parent. The frozen shared digest is `ef4409385e545e82b91fcd44caaab02e457e8af9404d5abba3f07b8956a1d58c`.

The exclusive module scope is WAV encoding, the pinned public VAD adapter, CaptureSession lifecycle and immutable capture identity, the application dependency lifecycle patch, reproducible local VAD/ORT assets and manifest, and allocated module tests. The owner also holds root package/lock, web package scripts, and the single allocated `apps/web/public/vad/` ignore entry. The coordinator subsequently allocated the exact `apps/web/public/vad/**` global exclusion in eslint.config.mjs after generated immutable vendor files produced 365 lint warnings; all other lint behavior is preserved.

Public interfaces remain the accepted four-argument createVad, CaptureToken, VadCallbacks and CaptureSession seams. Captures use mono PCM16 at 16 kHz, at most 30 seconds including pre-roll, one valid current end notification, and synchronous gesture context creation/resume. The configured minimum speech remains 400 ms; the pinned 512-sample frame processor quantizes it to 384 ms. Controller, UI, server, providers and frozen shared contracts remain outside this delivery.

## Current evidence and remaining work

The working tree has 38 passing offline WAV/capture/lifecycle tests (8 WAV, 19 CaptureSession, 11 actual pinned MicVAD lifecycle/adapter tests). Those tests use controlled browser-node, model and ORT boundaries; they do not prove a live microphone or actual browser model inference. Four asset tests passed after a fresh install; the allocated total is 42. A red/green regression additionally proves unmute rejects an already stopped injected stream and a fresh user Start succeeds.

A fresh Node 26.8.1 / npm 12.0.2 `npm ci` has now completed and postinstall applied `@ricky0123/vad-web@0.0.31` through patch-package 8.0.1. Asset generation (10 files), fresh module tests, typecheck, build, lint, formatting, unit tests (24), slow tests (1) and contract tests (141) passed. The voice suite passed all 38 cases after the final fresh-stream guard. Canonical Test and distinct review remain pending.

Distinct review, parent integration, Review approval and Close remain with the coordinator. Actual browser gesture, HTTP/MIME/model load, microphone and automatic-turn acceptance remain later stories #9/#10/#11. No credentials or paid calls have been used.
