# Independent capture module review, round 1

- Issue: [#14](https://github.com/kburson/AIVC/issues/14); pull request: [#21](https://github.com/kburson/AIVC/pull/21).
- Specification verdict: **FAIL**.
- Code quality verdict: **ChangesRequested**.
- Findings: 0 critical, 1 important, 0 minor.
- Reviewed source: `d8d24a59ef956ab2266fc3418c8da49563e43ed8`.
- Base: `6c64bfefc3db5bc19929e774aa8c7e3def282c19`; complete 15-file diff, including activation documentation.
- Author: native Codex Sol 6.1/high, session `01a136a6-0b4b-78a3-8b6f-cbb9cc5cc722` (author report).
- Reviewer: separately dispatched native Codex Astra 6/high, genuine session `01a1380a-1261-7e21-acb5-038941fb330a`, normal issue-14 orchestrator binding generation `8dbb8c2b-832e-4e5a-8a71-69b154a6c5c2`.
- Worktree: `/Users/kpburson/.codex/worktrees/voice-bff-capture-14/AIVC`; branch `codex/14-draft`.
- This is independent authored-code review. It is neither a sealed specification/plan protocol review nor AITM Task Review approval. Production code and tests were not edited by the reviewer.

## Accepted authority and scope

Read the [accepted design](../../../superpowers/specs/2026-10-12-voice-bff-reference-design.md), [original Task 7](../../../superpowers/plans/2026-10-12-2-voice-bff-reference.md#task-7-capture-automatic-bounded-utterances-without-resource-leaks), [contract-first amendment](../../../superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md), [Task 11 hydration](../../../superpowers/plans/2026-10-13-2-contract-first-hydration-index.md), live issue Scope/AC/VC and author brief/report. The amendment at `6eda972a9df1bcbe1f8f650e9506c709026b02d8`, SHA-256 `c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e`, governs extracted module ownership. [Node 26 amendment](../../../superpowers/plans/2026-10-13-2-node26-parallel-execution-amendment.md) supersedes historical Node 24 wording.

Sealed historical authority remains in the [specification review archive](../../spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/README.md) and [plan review archive](../../plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/README.md), with accepted amendment collateral under the plan review tree. No sealed bytes were changed.

The source satisfies the inspected WAV/header/parser bounds, immutable token observer mapping, current-only valid-end notification, synchronous context resume, conservative pre-roll duration accounting, normal cancellation/restart paths, exact package pins and reproducible local asset postimage checks. The module stays separate from UI/controller/BFF submission. Browser HTTP/MIME, actual model inference, device and final system acceptance remain later stories, as authorized.

## Important finding R1: preserve late cleanup failure outcomes

Primary location: [capture-session.ts lines 213–217](../../../../apps/web/client/voice/capture-session.ts#L213). Related locations: acquisition cancellation at lines 182–187, track accounting at lines 335–351, and late shutdown at lines 389–405. The same defect exists in [the lifecycle patch](../../../../patches/@ricky0123+vad-web+0.0.31.patch#L118), particularly stopStreamOnce at lines 18–22 and pending-start settlement at lines 118–120.

When Stop is called while permission is pending, a later acquired stream is stopped inside initialize's acquisition callback. If a track's stop throws, stopStream records that track as attempted and rejects. The inactive-run catch then returns for every error, discarding the cleanup failure. The shutdown pass retries stopStream, but the WeakSet makes the second call succeed without recovering the original rejection. The public Stop promise fulfills and no CAPTURE_CLEANUP_FAILED status is emitted, despite failed resource cleanup.

The actual patched MicVAD has the corresponding failure independently: a late pauseStream rejection rejects its pending start, but destroy ignores the settled start result; the WeakSet makes its later stopStreamOnce attempt fulfill. Thus destroy reports success. Merely changing the session catch does not fix the public patched lifecycle promise.

This violates the explicit original Task 7 requirement that cleanup errors remain visible and never count as successful release, amendment module criteria, and live Scope 1/2 plus AC1/AC2.

### Reproduction evidence

A fresh reviewer run exercised the actual createVad adapter and patched MicVAD with a controlled model factory and a stable track object. It deferred permission, invoked Stop, then delivered a stream whose track.stop throws. No live microphone, browser engine, ORT model inference or paid API was used.

Observed:

```json
{"outcomes":["fulfilled","fulfilled"],"statuses":[],"trackStops":1,"contextCloses":1,"releaseCalls":1}
```

The outcomes are start and Stop respectively. Both fulfilled; cleanup failure was hidden. A separate direct actual MicVAD instance used deferred getStream and a rejecting pauseStream:

```json
[{"status":"rejected","error":"late pause failed"},{"status":"fulfilled"}]
```

Those outcomes are start and destroy. Destroy fulfilled despite the cleanup rejection. The executable standalone reproduction is preserved in [round-1-reproduction.md](round-1-reproduction.md).

Required correction: retain cleanup results separately from benign canceled initialization errors and preserve the failure when idempotence suppresses repeated stop calls. Public disposal and CaptureSession Stop/mute must observe late cleanup failures while continuing other cleanup exactly once. Add regressions against both the CaptureSession/actual-adapter path and actual patched MicVAD deferred stream path; retain the existing benign cancellation behavior and successful fresh Start.

## Independent checks and evidence limits

Fresh reviewer execution:

- Allocated WAV/capture/lifecycle/assets Vitest command: **42/42 passed**, four files (8/19/11/4).
- Frozen contract digest: **sha256:ef4409385e545e82b91fcd44caaab02e457e8af9404d5abba3f07b8956a1d58c**, unchanged.
- Additional actual-module cancellation reproductions above: defect confirmed.
- Read complete production modules, patch, copier, all allocated tests and package/lock diff; exact existing direct pins preserved, patch-package 8.0.1 added.
- Actual frame processor remains unchanged; literal minSpeechMs 400 is honestly measured as floor-quantized 384 ms for 512-sample frames, with 800 ms silence.
- Asset suite independently regenerated files and checked missing-source and marker-preserving postimage tamper failures.

The author's canonical Test receipt `01M4VW86NG66XK4CXXGSWQDAKH` at reviewed source was inspected in the live issue; it records successful classified checks, including clean-sandbox setup. This review does not relabel that prior run as reviewer execution. No cold install, build, full suite or canonical Test was rerun after the defect was confirmed; a new exact-head Test is required after author repair and later review collateral.

## Workflow disposition

Issue remains Test; no Review, approval, merge or Close was requested by this reviewer. Initial modern-runtime Explain returned indeterminate for one unreadable reviewed-scope comment, unrelated to this code finding. Source fixes return to the author through the root coordinator and registered lifecycle actions. The heavy build/Test window was released to the coordinator. Review resumes after a repaired committed source and fresh evidence; this verdict does not permit integration.
