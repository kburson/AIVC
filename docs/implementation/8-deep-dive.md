# Story #8 deep-dive analysis

## Analysis

The same genuine Codex Sol6.1/high author session 01a13b27-de31-7650-8d6f-5379251f5a97 resumed the recorded codex/8-draft worktree and normally fast-forwarded to integrated feature3fdca44916a173e3b897d8fb7ad184c202806407 after root verified strictDone6/7. Fresh Explain returned ready and registered Plan entry is visible. npmci reproduced Node26.8.1/npm12.0.2; baseline npmtest43 passed. No live acoustic/provider acceptance is claimed.

The accepted whole Task6 scope and canonical frozen wireDeltaFixture remain unchanged. Seven semantic questions pass: listener is the beneficiary; early ordered audible sentences and bounded backlog are the capability; fast synthesis/frozen clocks create the need; bounded safe ordinary playback is the consequence; all claims derive from accepted Scope/spec/plan; this differs from7provider/9capture/10interruption/11live; story is understandable alone. Human L/5h remains appropriate for interdependent PCM, lexical parsing, audio scheduling, queue and UI work. No new architecture review or approval request is needed.

### Files and sequence

1. Add tests/voice/pcm.test.ts and apps/web/client/voice/pcm.ts: red split byte/extrema/arbitrary chunk/odd final byte assertions, then one pending byte signed little-endian decoder.
2. Add tests/voice/playback.test.ts and apps/web/client/voice/playback.ts: red24k source scheduling on48k device, exact-once current/future audio budget, all retained handles, cancellation/generation and serialized suspension/recovery. Dedicated playback context only; audio-clock progress is the accounting authority.
3. Add tests/voice/speech-text.test.ts and apps/web/client/voice/speech-text.ts: red every two-way/one-character chunk invariance for decimals/abbreviations/URLs/citations/links/code, early Hello. Next and frozen fixture before deferred terminal; implement conservative incremental scanner and safe word-bound segments. Finish only once on complete/truncated; raw uncommitted text remains countable.
4. Add tests/voice/speech-queue.test.ts and tests/slow/playback-watchdog.test.ts then apps/web/client/voice/speech-queue.ts: one fetch active, <=2s admission, prompt body drain, <=10s actual audio,2400raw+unsent text bound, tentative pause, wall-clock stalled3s and resume2s failure, cancellation/reset/new-generation recovery. Default synthesis fetch validates exact accepted PCM headers, preserves text and never retries.
5. Modify apps/web/components/Conversation.tsx and apps/web/client/turn-controller.ts with tests/ui/conversation.test.tsx: lazy per-mount output context/queue created/resumed synchronously by typed-submit gesture; no capture permission; answer.delta feeds speech while display remains literal; complete/truncated flush; failed/interrupted/new question/mute/Stop/unmount cancel. Stop stays available for audio after model completion. Preserve history/current-generation contracts and later9/10 integration seams.

### Interface risks and verification

TurnController keeps a completed generation current for queue drain. Cancel old speech before beginning a replacement; all bytes/timers/source callbacks check generation. Context.currentTime alone releases audio budget; scheduled samples stay counted and48k device resampling never changes24k source duration. Resume/suspend operations serialize and cannot revive a canceled turn. Queue progress wakeups use bounded polling/internal playback notification without changing mandatory public methods. Text overflow drops only unsent text; PCM overrun/stall tears down the answer's entire audio. Failure disables only the failed generation; next answer recovers.

Run declared voice/slow/typecheck/fullunit/lint/format checks and impacted controller/UI/typed-browser tests; inspect ledger max and eventually played duration assertions. Existing root VC already declares test:slow before canonicalTest. Post exact test-file/verbatim-name lists through registered comment. Root owns distinct Astra review, Review/approval/exact-head cloudmerge/Close. Offline controlled audio tests are simulation, never actual microphone/provider/acoustic acceptance.

## Dependency Map

Depends on: #6 (strictDone typed browser/controller), #7 (strictDone complete speech endpoint/provider); #13 frozen public fixture consumed unchanged.
Blocks: #9 full capture wiring, #10 full interruption integration, #11 whole-system/live evidence.
No sibling issues are spawned; complete current scope is delivered together.
