# Story #8 bounded speech completion checkpoint

Whole accepted PCM/playback/SpeechText/SpeechQueue and typed Conversation/controller scope is implemented at source `65d19d34e8dccb05b565b3c9393c5ba10913cd42`, based on actual strict-Done #6/#7 integrated feature `3fdca44916a173e3b897d8fb7ad184c202806407`. The final documentation checkpoint is a source-identical descendant. Draft PR #34 targets `codex/2-draft`; epic PR #17 remains draft.

## Delivered behavior

- Streaming PCM decoder retains split bytes, uses signed little-endian samples and rejects dangling final bytes. Playback schedules explicit mono24kHz buffers even on48kHz device contexts. Current/future audio remains counted exactly once until actual audio-clock progress; canceled handles are stopped and disconnected.
- Incremental text scanner holds ambiguous punctuation/decimals/abbreviations, partial citations/links/URLs/code and delimiter runs. Tests compare every two-way split plus one-character chunks with literal expected sanitized output. Frozen `wireDeltaFixture` preamble plus separator speaks before later answer completion. Stable text splits at effective capability caps; omitted oversized tokens retain a visible per-answer notice through later PCM and completion.
- Queue admits one request at a time only at low water/running/not tentative, drains its active response promptly, retains long answers as text, and enforces2400raw-plus-unsent characters and10seconds actual PCM. Text overflow drops unsent speech while admitted audio finishes. Audio overrun/stall tears down all answer audio/text/fetch work, preserving model text.
- Wall-clock watchdogs fail stalled outstanding audio after3seconds and failed/pending resume within2seconds even with zero audio. Suspend/resume serialize; an empty failed context can be replaced so the next generation recovers. Late old callbacks cannot revive canceled audio; all queue timers end on dispose.
- Typed submit directly creates/resumes dedicated output in the gesture without microphone permission. One output instance is reused per mounted conversation, canceled on replacement/mute/failure, and released on Stop/unmount. Stop remains available after complete/truncated terminals; visible Speaking ends after cancellation. Muted future answers stay silent. Complete-only history and literal displayed model text remain intact.

## Actual offline verification

| Command                                | Observed result                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| `npm test`                             | 49 unit/UI tests passed                                                          |
| `npm run test:voice`                   | 88 tests passed                                                                  |
| `npm run test:slow`                    | 22 tests passed                                                                  |
| `npm run test:contracts`               | 324 tests passed                                                                 |
| `npm run test:integration`             | 26 tests passed, including production build and actual two-process HTTP/shutdown |
| `npm run test:browser -- --grep typed` | All5 existing Chromium typed smoke cases passed                                  |
| `npm run typecheck`                    | Both workspaces passed                                                           |
| `npm run build`                        | Optimized Next and retrieval TypeScript builds passed                            |
| `npm run lint`                         | TypeScript and Markdown passed                                                   |
| `npm run format:check`                 | 284files, zero findings including this documentation checkpoint                  |

Playwright generated an ignored `.last-run.json` with status passed and no failed tests. Its generated indentation was the sole formatter finding; after inspecting and removing that disposable output, the formatter passed with284files and zero findings. No formatter policy or exclusion changed.

The integration shutdown intentionally signals the Next child, whose subprocess reports exit143; the owning HTTP/shutdown test and full integration lane pass. No failing check is treated as a pass. The final review report is a format-normalized transcription of the genuine retained message (raw SHA-256 `4e1bf9ef02c3b11cdcec8afafde2708c195543b77668bb2630e6d53337ef5059`); its committed artifact hash is measured separately for Scope proof. Initial source stubs produced behavioral RED before implementation. Additional cancellation/recovery/mute/truncation/omission regressions were observed RED then GREEN. TypeScript typed-array compatibility and standalone Markdown hierarchy findings were corrected without exclusions or policy changes.

Distinct Astra6/high reviewed the complete source and independently passed targeted63/voice88/slow22/typecheck/diff checks; counts overlap. See the retained independent report. Provider responses, audio clocks and device boundaries in these automated tests are controlled simulation. No actual microphone/provider/audio/acoustic latency or final joined live acceptance is claimed; #11 retains it.

## Authority and handoff

Accepted amendment `6eda972a9df1bcbe1f8f650e9506c709026b02d8` and active hydration `e559f6b33010e2902592fde97ed1560281f7f3d3` hashes were verified from Git. The same genuine author binding/generation performed normal Plan/Develop work in the recorded branch. Retained L/5h is an explicit compatibility estimate with no fresh AI-forecast claim. The normal CLI initially selected human Plan-approval provenance before explicit Full-Auto; the owned audit records that this is not a new human plan-review event. Subsequent policy is explicit Full-Auto.

The deep-dive mirror originally ended at an authored level-two Analysis subheading. After a typed guard refusal, root explicitly authorized the existing guarded writer's bounded heading correction with exact occurrence/byte checks. That was a direct canonical writer call, not the public issue-body CLI; it changed only two narrative heading levels and preserved all other bytes/markers. No policy/runtime repair or lifecycle bypass occurred. Later issue edits use registered CLI only.

Canonical exact-head Test, functional stamps and narrative Scope proof follow this committed checkpoint. Root then owns Review/approval/exact-head sanctioned cloud merge/Close. This document does not claim those future gates passed. Final author handoff uses normal stop to release the genuine claim while preserving source/session/evidence identity.
