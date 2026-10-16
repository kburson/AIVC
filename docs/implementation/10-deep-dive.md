# Story #10 interruption deep dive

## Current authority and sequence

### Whole-story interruption delivery

Strict Done #8/#9/#14 are merged at feature baseline `49939084ad0ad5fccbfa1541a800e29c499430c2`. Fresh registered sequential rank-7 Explain returned ready before Plan entry. Accepted Task 8, contract-first amendment `6eda972a`, hydration `e559f6b`, base plan `cb82f730`, specification `bc6e15ec` and exact Node26 pins remain authoritative. Estimate remains L/5h/P1/rank7.

#### Source and compatibility review

Consume `CaptureSession` and its immutable `CaptureToken` observer unchanged: synchronous rawStart/confirmedStart/misfire carry the same token, and one `onUtterance` callback owns the valid WAV end. Its misfire observer runs before it clears current identity; caller-owned recovery therefore records an admitted misfire synchronously and guards later work with candidate/transition identity, session ownership and answer generation. Overlong status precedes module invalidation, so the caller must retire its candidate synchronously. No module API or frozen contract/manifest/pin change is needed.

`Playback` already serializes suspend/resume, but empty-context recovery currently replaces a suspended context without resuming it. Test this actual behavior first and make the smallest playback correction needed to await pending reversible suspension, stop old sources before recovery, resume the dedicated empty context and reject non-running recovery. Preserve the existing watchdog path for an unresolved native resume. `SpeechQueue` admission pauses must retain active small response drainage and transport ownership; canceled/stalled queue output must not be revived by late misfire. `Conversation` preserves #9 capture startup, typed-output adoption, independent mutes, Stop/unmount/StrictMode and failed-start regressions.

#### Implementation sequence and files

1. Create `tests/voice/interruption.test.ts` around real controller/playback/queue and controlled browser/VAD boundaries; watch two-phase, delayed suspension, no-answer capture, misfire, stale callback, history and mute/Stop cases fail. Add `apps/web/client/voice/interruption.ts` with exact Candidate capture/answerToken/phase separation. Confirmation consumes old answer cancellation while preserving capture admission; end consumes once before submit. Raw start never requests work.
2. Wire `apps/web/components/Conversation.tsx` through the single delivered observer and single end callback; retain `CaptureSession` unchanged. Typed submission, Stop, microphone mute, overlong and restart retire prior capture ownership synchronously; output mute retains capture and text/history. Recovery failures use a visible transition-owned speech status independent of the invalidated answer token. Add focused playback/queue tests before necessary internal changes to `apps/web/client/voice/playback.ts` and `apps/web/client/voice/speech-queue.ts`.
3. Create `tests/slow/rapid-interruption.test.ts` using actual turn/speech route admission and cancellation-ignoring upstream settlement. Prove canceled jobs retain both slots, third turn gets Busy, deliberate post-settlement recovery succeeds, and model/STT/retrieval/TTS signals abort without replay. State transport cancellation limits honestly.
4. Create `tests/browser/interruption.spec.ts` and extend only test-owned `tests/browser/voice-harness.ts` as needed. Use real browser AudioContext scheduling with labeled controlled VAD callbacks/transport, prove Beacon schedules audio after voice interruption, measure callback-to-suspension with performance.now() <=200ms, and report confirmation-to-abort separately. Keep actual pinned asset/model browser smoke and all #9 regressions. Synthetic timing does not establish physical acoustic/provider/echo acceptance; #11 owns those.
5. Commit/push documentation from the first authored checkpoint and keep an open draft PR targeting `codex/2-draft`. Run all root declared commands and impacted complete suites, preserve exact test names in the owned New Automated Tests comment, obtain distinct Astra6/high whole-branch review, commit final documentation/review collateral before canonical exact-head Test, then Stop and hand off. Root owns Review/approval/sanctioned cloud merge/Close.

#### Story review and risks

All seven semantic questions remain yes: the beneficiary is a person interrupting speech; the capability is reversible pause then genuine replacement; raw noise and asynchronous cancellation create the need; preserved slow work and stale-output prevention provide value; current Scope/spec/plan support each claim; this differs from sibling playback and capture wiring; and the existing story explains the behavior independently. No new AC, verifier, sibling or scope change is introduced.

Key risks are late suspend completion after confirmation/new candidate, misfire after module identity retirement, watchdog cancellation mistaken for resumable speech, recovery errors tied to obsolete answer tokens, and premature server slot release. Tests must control these races directly. Completed text already in history stays; incomplete/canceled pairs never enter history. Output silence must not disable listening for an entire answer. No paid calls or device claim belongs to this story.

#### Dependencies

Depends on strict Done #8 playback/queue, #9 capture UI and #14 capture owner, consuming frozen #13 public contracts. Blocks #11 full-system/live/tutorial acceptance. No additional sibling is needed.
