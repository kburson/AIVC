> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/39c18e086ea832fc3214431575a1161742f374d6/docs/peer-reviews/code/14-capture-module/round-1-author-response.md) and its exact bytes remain available in the [integration evidence archive](../../../quality-evidence/2026-10-14-25-integration-originals.json).
> Original SHA-256: `ad8c5f3b646dccf6252939b30b2972700b5ebf10eaf99b1e5b544ca8002b6cca`. Review acceptance and protocol hashes apply to those original bytes.

# Round 1 author response: late cleanup outcomes

[R1](round-1.md#important-finding-r1-preserve-late-cleanup-failure-outcomes) is reproduced and repaired within the accepted issue #14 scope. This is the author's response; independent re-review and integration remain pending.

When permission resolves after Stop or mute and a track stop throws, repeated cleanup must report the original failure. The original WeakSets retained only the fact that cleanup was attempted, so a later disposal pass fulfilled and hid the failed release.

CaptureSession retains per-track failures alongside its required idempotent WeakSet. A later shutdown returns that failure without calling track.stop again. Obsolete initialization/load errors remain benign; their catch does not manufacture a current load failure. Cleanup outcomes survive separately and are surfaced by Stop/mute as CAPTURE_CLEANUP_FAILED.

The pinned MicVAD patch caches the stream cleanup promise before invoking pauseStream. Every subsequent disposal pass observes that same promise, including its synchronous or asynchronous rejection, while the underlying hook is invoked once. Existing pending initialization/frame guards, partial-node cleanup and finally model.release behavior remain unchanged. Public interfaces, FrameProcessor, package versions and configured400ms/measured384ms timing remain unchanged.

## Reproduction and regression evidence

Seven new regressions were run before changing production code. All seven failed with disposal fulfilled instead of rejected:

- CaptureSession pending permission followed by Stop or mute: two cases.
- Actual CaptureSession + createVad + patched MicVAD, pending permission followed by Stop or mute: two cases.
- Actual MicVAD late stream cleanup throws synchronously or rejects asynchronously: two cases.
- Actual MicVAD pending resume followed by destroy and late cleanup failure: one case.

The minimal outcome-retention changes made all seven pass. Three additional characterization cases protect late model-release failure and late worklet rejection with and without a real cleanup failure. They pass while keeping obsolete load errors silent, disposal failures visible, resource attempts exactly once and capture inactive. Test stream objects now return one stable track identity, matching browser MediaStream behavior.

The published [round-1 reproduction](round-1-reproduction.md) was executed unchanged from its code block against the repaired actual modules. Observed:

```json
{
  "outcomes": ["fulfilled", "rejected"],
  "statuses": ["CAPTURE_CLEANUP_FAILED", "CAPTURE_CLEANUP_FAILED"],
  "trackStops": 1,
  "contextCloses": 1,
  "releaseCalls": 1
}
```

These are start and Stop outcomes. The existing status propagation reports cleanup failure at shutdown and final Stop. The separate actual MicVAD outcomes are:

```json
[
  { "status": "rejected", "error": "late pause failed" },
  { "status": "rejected", "error": "MicVAD cleanup failed" }
]
```

These are start and destroy. Repeated destroy retains the rejection without another release. Controlled browser-node/model/ORT factories exercise the actual pinned module; no physical microphone or real model inference is claimed.

## Fresh local verification

A fresh Node26.8.1/npm12.0.2 npmci applied patch-package8.0.1 successfully. The normal copy helper regenerated10assets and recomputed the patch/applied-module manifest. Allocated WAV/capture/lifecycle/assets tests passed52/52 (8/21/19/4); typecheck, build, lint, format, unit24, slow1 and contracts141 passed. The frozen shared digest remains ef4409385e545e82b91fcd44caaab02e457e8af9404d5abba3f07b8956a1d58c.

Patch SHA256:44485e484f4f0223b720e0e02e12e8e498ce6354bf24a21c71e7c60a9f5d9137.
Applied JS SHA256:37b55cc57c1463624857ad65a9ceaf9cc073327bc9ed07fd34d0ecbe564eaa2a.
Applied declaration SHA256:96ebf0ce34024fa79448119ff5e5956e69bd9f2e8aed5648ded27d1e114e1a50.

The copier still validates full Git postimages and filesystem/module/file digests; marker-only trust is not introduced. No manifest dependency or pin changed. The original review and reproduction documents remain intact.

Old receipt01M4VW86NG66XK4CXXGSWQDAKH verifies d8d24a59ef956ab2266fc3418c8da49563e43ed8 only. A new exact-head canonical Test is required after this repair commit and individual Scope/AC refresh. Current issue state is Test; author repair does not assert Review, approval, Done or integration. Final native receipt and source SHA will be recorded in the issue, draft PR21 and task11 handoff report.
