# Story #10 two-phase interruption

## Behavior and ownership

`Interruption` separates the immutable captured utterance from the answer it may interrupt. Raw speech pauses queue admission and the dedicated playback context while retaining the active model, lookup and bounded speech response. A short admitted misfire restores only that retained current answer; delayed suspension is guarded by the same candidate and transition. New candidates, typed submission, microphone mute, overlong recovery and Stop retire prior capture intent. Output mute cancels speech without revoking capture or text/history.

Confirmation marks the capture confirmed before invalidating the old answer, aborts old work and stops every old source. The confirmed capture can therefore admit one later end even though the old answer token is no longer current. The public `end(capture, Float32Array)` and `admitEnd(capture)` share a consume-before-submit gate. Conversation uses the latter only in #14's single `onUtterance(capture, WAV)` callback and forwards that existing WAV unchanged. There is no second end subscriber, invented sample array or WAV decoding round trip. No #14 API, frozen public contract, fixture, package pin, manifest or patch changed.

Empty-context recovery waits for pending suspension and resumes before scheduling new output. It checks the native running state and reports failure independently of the canceled answer. The two-second recovery deadline also covers a native resume that never settles before the next answer exists; a newer transition or Stop clears that deadline. Queue cancellation and watchdog teardown cannot be undone by a late misfire. Completed text remains committed history with interrupted-speech status; partial/canceled pairs remain visible and stay out of context.

## Verification and boundaries

The implementation was driven by rendered red failures for missing reversible suspension, confirmation abort and newer-candidate ownership. A separate playback regression exposed successful recovery from a context that never reached running. Distinct preliminary Astra inspection then identified the never-settling resume gap; the focused regression failed before the transition-owned deadline fix. Final review and canonical Test remain separately recorded in their original reports/receipts.

The targeted set passes 39 tests: 27 interruption cases, seven playback cases and five rapid-interruption route cases. The rapid test drives the real Interruption/controller into actual route admission: both canceled model jobs hold their slots, the third confirmed question receives Busy, and deliberate post-settlement recovery works. Separate model/STT/retrieval/TTS cases prove abort propagation and lease retention through cancellation-ignoring transport settlement, with no replay. Signals request cancellation; they cannot force a remote service or an adapter that ignores the signal to stop immediately.

Author verification passed voice136, slow27, unit49, contracts324 and integration26 tests, both workspace typechecks, lint and formatting. The integration suite built and served the actual two-process production boundary and verified shutdown. These runs precede canonical exact-head Test.

The full browser run passed 12 cases, including the three actual pinned VAD/ORT asset/model load and failure smoke cases from #9 and five prior typed browser checks. Four interruption cases use an isolated test-only esbuild bundle importing the real Conversation, CaptureSession, controller, history, queue and playback. Only the VAD boundary and HTTP transport are controlled; production imports no test helper. AudioContext suspension, resume and AudioBufferSourceNode scheduling are real Chromium operations. Beacon must schedule new audio after confirmed voice interruption, beyond rendering text; short Speaking and Working misfires and delayed suspension are covered separately.

One local synthetic trial measured callback-to-reversible-silence **0.8 ms** and confirmation-to-abort **0.3 ms** using `performance.now()`. The test asserts callback-to-silence <=200 ms and records confirmation timing separately. These are callback/browser measurements from controlled VAD and transport, not physical acoustic latency, paid provider evidence or speaker echo acceptance. No paid calls or physical microphone acceptance occurred in #10; #11 owns those cases.

## Tuning evidence

Delivered capture requests mono microphone input with echo cancellation, noise suppression and automatic gain control. The pinned VAD requests positive/negative thresholds0.3/0.25, minimum speech400ms (384ms quantized at512-sample/32ms frames), redemption800ms and pre-roll800ms. These settings are visible in the browser timing evidence and pinned-adapter tests. Listening stays active during an answer. A headset/speaker physical trial must still record actual constraints and whether persistent self-triggering occurs; requested echo cancellation alone cannot pass that live case.

## Delivery boundary

Author session is the existing genuine Sol6.1/high story #10 agent in its isolated `codex/10-draft` checkout. [Draft PR36](https://github.com/kburson/AIVC/pull/36) targets `codex/2-draft`; feature PR17 remains draft. Root owns registered Review, Full-Auto approval, sanctioned expected-head cloud merge and Close after exact-source verification. This implementation record does not claim those future events.
