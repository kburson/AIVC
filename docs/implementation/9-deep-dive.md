# Story #9 capture integration deep dive

## Current authority

The genuine Sol6.1/high author session resumed `codex/9-draft` in its recorded isolated checkout after strict Done #8/#14. The branch includes product integration `3049e5b` and parent documentation checkpoint `cbc80fd`. Registered Plan entry succeeded after the fresh authorized rank-6 wave publication. The [owned analysis](https://github.com/kburson/AIVC/issues/9#issuecomment-6179721326) is mirrored into the issue. Accepted M/2h remains the human estimate.

### Scope and sequence

1. Add rendered Conversation wiring tests through the delivered real `CaptureSession`, controlling only browser/VAD boundaries. Watch synchronous distinct context resume, valid automatic WAV submission, current token admission and resource cancellation tests fail before implementing.
2. Wire `Conversation.tsx` and `turn-controller.ts`: explicit Start conversation, independent microphone/output mute, typed fallback and the shared bounded turn/controller/history path. A single `onUtterance` callback verifies the active session, immutable candidate and `isCurrent` identity before consuming submission admission.
3. Invalidate capture intent and answer generation synchronously on Stop/typed submission/mic mute. Await pending capture startup and public destroy/stop plus playback disposal; surface all four capture failure reasons and retain successful later recovery. Stop/unmount/Strict Mode may not leave late resources listening or submitting.
4. Extend the test-only browser harness and add `capture.spec.ts`. Prove local pinned asset HTTP200/MIME/digests and actual patched VAD/ORT browser model load. Keep deterministic synthetic callback evidence separate from physical microphone, echo, provider and latency acceptance owned by #11.

### Boundaries and verification

Consume #14 capture/WAV/token/reason/observer APIs unchanged. Preserve #8 dedicated playback/speech queue behavior, frozen #13 contracts, manifests, patches, dependencies and exact runtime pins. Do not implement #10 barge-in here. No effect starts capture or provider work.

Run all declared story commands and owning/impacted UI/controller/contracts/integration/browser checks. Baseline voice88/contracts324/unit49/integration26 tests, typecheck and build passed on Node26.8.1/npm12.0.2 with the pinned lifecycle patch applied. These are baseline results, not implementation acceptance. All future required Test, independent review, approval, cloud integration and Close gates remain mandatory.

### Dependencies

Depends on strict Done #8 playback/queue and #14 capture module; consumes frozen #13 public contracts. Blocks #10 interruption and #11 whole-system/live acceptance. No sibling issue or new architecture is introduced.
