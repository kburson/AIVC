# Story #9 automatic capture completion checkpoint

The first complete source checkpoint was `5ceedc61378257f237ca285b574afc089466f02c`; the corrected source is `fb14a5d47c927e050e19ebdab4d80669caa59958` on draft [PR #35](https://github.com/kburson/AIVC/pull/35), targeting `codex/2-draft`. It consumes actual strict-Done #8/#14 product integration `3049e5b` and carries the parent's documentation checkpoint `cbc80fd`. The existing controller and bounded multipart/SSE/history interfaces are reused; #14 capture/WAV/adapter/patch/manifest/package files and frozen #13 contracts remain unchanged. Epic PR #17 stays draft.

## Capture integration

The explicit Start conversation gesture resumes dedicated playback and capture contexts synchronously before permission/model initialization. Effects fetch capabilities and release resources; they never start capture or provider work. The delivered CaptureSession owns VAD resources, stream epochs, overlong restart and track stop accounting.

The sole valid-end callback checks the active session, current immutable raw/confirmed candidate, CaptureSession.isCurrent and consumed token identity before submitting WAV through the same turn/controller/history path. Raw/confirmed/misfire observers never submit. Typed input invalidates capture intent and candidate, resumes playback without requesting microphone permission, and remains available as fallback. Recognized transcript remains inside collapsed details; complete spoken turns contribute their recognized text to completed history without transcript approval.

Microphone mute stops capture and obtains a fresh constrained stream on unmute while reusing capture context. Output mute cancels speech independently and preserves listening, text and history. Overlong utterances are discarded before automatic restart, with a visible duration notice and no invalid submission. Stop/unmount invalidate capture and answer generation before asynchronous teardown and await pending capture initialization/public destroy plus playback disposal. Permission, load, duration and cleanup failures are visible; cleanup failure is never counted as successful release.

The test-first implementation also corrected obsolete startup reporting Listening during a newer load, and failed unmute stranding the capture session or replacing its precise permission reason. The integration fixture models the real patched VAD's rule that an initialization rejection alone is not a disposal failure.

Independent review found three P2 typed/capture overlap races. Four focused regression cases were observed failing, then passing after minimal corrections: capture unlock preserves an existing playback token; failed startup releases output only while still unclaimed; and every Stop/unmount disposes independently acquired output while joining earlier capture teardown. The latter tests assert context closure exactly once and timer disposal, beyond eventual source cancellation.

## Actual iteration verification

| Command                    | Observed result at corrected source checkpoint                             |
| -------------------------- | -------------------------------------------------------------------------- |
| `npm run assets:vad`       | Ten pinned local assets regenerated                                        |
| `npm test`                 | 49 unit/UI tests passed                                                    |
| `npm run test:voice`       | 107 tests passed, including 19 new rendered capture integration cases      |
| `npm run test:contracts`   | 324 tests passed, including asset/applied-module provenance                |
| `npm run test:integration` | 26 tests passed, including actual two-process HTTP and signaled shutdown   |
| `npm run test:browser`     | Eight Chromium cases passed: three new capture cases plus five typed cases |
| `npm run typecheck`        | Both workspaces passed                                                     |
| `npm run build`            | Optimized Next/retrieval builds passed                                     |
| `npm run lint`             | TypeScript and Markdown passed                                             |
| `npm run format:check`     | 289 files checked, zero findings before final review collateral            |

The three new Chromium cases use real browser AudioContexts/native worklets and actual pinned local ONNX/ORT model loading. All manifest-listed files return HTTP200 with expected MIME and matching SHA-256. Manifest version/upstream/patch/applied-module hashes and lifecycle marker agree. Successful native AudioWorklet.addModule is observed directly because Chromium's page request stream omits worklet loading. No foreign asset request is observed. The synthetic silent stream boundary is explicitly labeled and proves local load, lifecycle and fallback behavior only; deterministic VAD callbacks in rendered tests separately prove automatic current-only submission. Physical microphone, live providers, acoustic echo and latency acceptance remain #11.

Playwright writes its ignored last-run JSON without a final newline, while the existing formatting inventory includes test-results. The generated result was preserved in ignored scratch. The documented `PLAYWRIGHT_LAST_RUN_OUTPUT_FILE=.tmp/playwright-last-run.json` setting directs subsequent output outside source inventory; the actual passing result file is present there. Declared commands and formatter policy are unchanged. Canonical Test must inherit this same documented environment input.

## Independent review and final gates

The [initial native Astra6/high review](../peer-reviews/code/9-automatic-capture/round-1.md) returned Spec FAIL and Quality requires fixes for `5ceedc6`. Its exact native bytes are retained separately from the formatted wrapper. The [same reviewer's second round](../peer-reviews/code/9-automatic-capture/round-2.md) returned Spec PASS and Quality PASS for corrected source `fb14a5d`, with no remaining actionable findings. It independently passed 129 targeted tests, eight browser cases and the original three Chromium overlap probes. It did not independently rerun build/typecheck/lint/format/full contracts/integration; those remain the author's actual checks above. This is ordinary native code review, not sealed APR/provider evidence. Slow tests remain mandatory in canonical Test; no pre-Test slow acceptance stamp is claimed.

The final documentation-only checkpoint retains both native reports and their hashes, completion evidence and owner-requested workflow observations. It must preserve identical application/tests/scripts/package trees to the accepted source before exact-head canonical Test. The final Test receipt and exact documentation head belong in the external registered handoff; this document does not invent a future receipt or self-referential commit hash.

The same genuine author SID `01a13b91-1d59-7ea3-9149-27f80a022660` and binding generation `f6dfb887-7a21-4058-82d8-1fde64c921fa` performed normal Plan/Develop work. A mistaken initial human-mode approval caused by the auto-both/environment mismatch was superseded through registered cancel-plan/re-Plan; no human review is claimed. Current persisted approval is explicit Full-Auto with its posted audit. Accepted M/2h is a compatibility estimate, without an invented AI forecast.

Root owns registered Review, approval, sanctioned exact-head cloud merge and Close. Author handoff uses normal Stop after canonical Test to release its claim. Those future gates are not claimed complete here.
