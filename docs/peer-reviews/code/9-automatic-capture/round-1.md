# Story #9 native code review, round 1

**Verdict: Spec FAIL; Quality requires fixes. Not ready to merge.**

The [verbatim native report](round-1-native.txt) reviews source `5ceedc61378257f237ca285b574afc089466f02c` against product base `3049e5b911b2d82b916d7ad70d5e5cc5fb47cc4b`. Its exact raw SHA-256 is `b5875044a0e9d9de01bd964da6c0048ae2e7cec79b7bb4afdfc09e06fc82787e`. Genuine reviewer SID: `01a13c7c-c4a4-7760-8b80-278687d46e54`, requested Astra6/high. Native final message: `msg_03981de7adb10efe016ad0046a66fc81948ff9ef363d91e17a`.

The reviewer independently reproduced three P2 ownership races: capture startup lost an existing typed playback token; failed capture startup disposed playback adopted by a newer typed turn; and a second Stop/unmount during pending teardown left newly allocated typed playback undisposed. The initial failure verdict is preserved and is not represented as a passing review.

Independent checks passed 125 targeted tests and eight browser cases. Additional real Chromium probes used controlled permission and synthetic PCM to reproduce the findings. The report explicitly excludes physical microphone, echo, latency and live-provider acceptance owned by #11, and does not claim independent build/typecheck/lint/format/full contracts/integration runs.

The author addressed the three findings in source `fb14a5d47c927e050e19ebdab4d80669caa59958` with four regression cases, including both second Stop and unmount. The same native reviewer must issue the follow-up verdict; this wrapper does not supply one.
