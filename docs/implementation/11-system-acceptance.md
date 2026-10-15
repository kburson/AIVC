# Story #11 joined system and live acceptance status

Whole-story acceptance remains unverified. This checkpoint supplies the joined
system, documentation, read-only verifiers and measurement implementation for
independent review. Required actual provider/browser/device L1–L8 observations
remain pending; no controlled run is a substitute.

## Actual application boundary

The [joined browser suite](../../tests/browser/typed-system.spec.ts) runs the actual
Next Route Handlers and Fastify catalog using a [test-owned launcher](../../tests/browser/system-server.ts).
It never routes, replaces or intercepts `/api/turn`. Test-owned Fastify controls
hold or fail the real catalog HTTP request. Passive CDP request observation checks
actual multipart history, and the canonical SSE decoder verifies final text.
The suite proves early text during held retrieval, exact cards, final/history
agreement, visible unavailable-search state, no-fallback retrieval failure and
Busy recovery by a deliberate new action.

This exposed a real Node26/Next request-branding error in `new Request(req, ...)`.
The admitted request now enters the existing bounded reader directly; its combined
cancellation signal is passed separately to the existing deadline runner. All
Origin/Host checks still precede body/provider work; frozen contracts and pins are
unchanged. The initial actual browser failure and corrected pass were observed.

The expanded Ubuntu CI lane exposed production shutdown with npm wrappers exiting
before their server descendants released ports. An owned-only local ancestry
trace confirmed the wrapper topology. Production now directly launches the pinned
Next CLI and compiled Fastify entry. Its owned trace contains the two actual server
processes and confirms both ports close. No process-group/global kill, unowned
process cleanup or dependency change was introduced. Ubuntu CI confirmed this fix at source `7294c3e`: all six checks passed,
including Offline system acceptance in [run38660164354](https://github.com/kburson/AIVC/actions/runs/38660164354/job/116179276814),
completed2026-10-15T00:30:16Z. The earlier component368273f run failed shutdown
truthfully and remains distinct from this passing result.

## Offline verification observed

- Unit/UI:97 tests; contracts:324; integration:26; voice:138; slow:27.
- Browser:15 tests, including three actual joined-system cases. Existing controlled
  voice/browser cases retain their explicit synthetic boundaries.
- Separate archived-evidence protection lane:10 node:test cases.
- Clean production build, TypeScript checks, ESLint, Markdown lint, complete
  formatting inventory and `verify:docs` passed locally.
- Focused measurements/capture/interruption/playback/queue/controller:81 tests.
  Measurement helper privacy/retention behavior was observed red before passing.
- Read-only live report remains deliberately nonpassing until actual evidence is
  complete. Model metadata alone establishes no generated voice/search success.

The new [browser marks](../../apps/web/client/measurements.ts) are bounded and
sanitized. The [procedure and all15-case mapping](../live-validation.md) explain
same-clock correlation, VAD-frame estimates, network-inclusive spans, scheduled
versus acoustic output, and local versus remote cancellation.

## Preliminary independent component review

The genuine distinct Astra6/high reviewer inspected committed component
`368273fdbf7568060d658f64cab1ff1d0c1c7f46` against feature baseline
`31948e8d40ce11bf36a1ca74cc4363a9643f7757`. The
[unaltered response](../evidence/11-astra-component-review.txt) has SHA256
`36e29430fdccb5efb7109f9f24c086d36c2bb60f0476aa81e3d0e008974061e4`,
1858 UTF-8 bytes, native message
`msg_03981de7adb10efe016ad01b7abf7081949f211e52a6cefd94`, reviewer SID
`01a13c7c-c4a4-7760-8b80-278687d46e54`. It is a static preliminary review, with
no independent test run or whole-story verdict.

Its two P2 findings were reproduced with four failing regressions. The corrected
verifier normalizes scenario/sample identity, requires measured research speech-
end→text/audio totals while allowing explicitly unavailable optional boundaries,
and rejects provider-named credential properties/literal assignments. All46
focused live/docs verifier tests pass, including those four regressions. Empty
sanitized environment examples, variable names and ordinary digest hex remain
valid. Final whole-head review and actual live evidence are still required.

An actual installed-package check then exposed three additional verifier gaps.
The npm distribution does not carry gitHead in its installed package.json, root
AJV differs from retrieval's resolved direct AJV, and a marker plus recomputed
report hash could accept altered installed code. Three regressions were observed
failing before passing. Versions are now recorded per actual root/workspace
resolution; accepted upstream provenance uses lock integrity, and both installed
VAD JS/declaration bytes must match the unchanged patch's full Git postimages.
No gitHead field was invented and no package/patch/manifest pin changed.

## Whole offline review corrections

Independent review at7294c3e passed612 tests/49 files,15 browser cases,10 separate
archive cases, clean build/typecheck/docs/lint/format and additional actual
production SSE/admission/shutdown probes. Its offline specification verdict
requested three corrections: retain the accepted flat `packages:Record<string,string>`
interface using context-qualified keys; preserve exactly two arguments to
VadCallbacks.end and keep timing in adapter-local marks; and use the accepted
`tests/browser/typed-system.spec.ts` path. The focused callback and flat-map
regressions were observed failing before correction. No live acceptance verdict
is claimed by the offline checks. The same-seat correction recheck is recorded below; actual live acceptance remains pending.

The [unchanged native whole-offline response](../evidence/11-astra-offline-review-7294.txt)
has4483 UTF-8 bytes, SHA256
`50153e5127a7ddfbff7eedb44b08d17e4ec01331614918acc1019cb13cd1d89e`,
native message `msg_03981de7adb10efe016ad01f36fe848194b1751b92e57bf5aa`
from the same genuine reviewer SID above. Its specification FAIL/quality changes
requested is preserved; independent offline passes do not replace the requested
compatibility corrections or actual provider/device evidence.

## Actual provider qualification failure and focused fix

The same-seat correction recheck at exactdec0d229 returned offline Spec PASS and
Quality PASS:89 focused tests, six capture/joined browser cases and typecheck/docs
passed. Its [unchanged native response](../evidence/11-astra-offline-pass-dec0.txt)
is2550 UTF-8 bytes, SHA256
`4b29e7301e81d1cf8702d0f372771f90c2b226252efdae1788d6157362c8fa51`,
native message `msg_03981de7adb10efe016ad0202137b8819489c8c5a78a197643`.
This offline verdict did not claim actual L1–L8 acceptance.

A clean production build then served actual Live capabilities and explicit models
to real desktop Chrome155.0.8059.40. The first deliberate typed Atlas question
was accepted as local HTTP200/SSE and failed with MODEL_FAILED. One separate
diagnostic Atlas request exposed the original error at both Models lookup and
Messages streaming: `timeout must be an integer`. The SDK rejects fractional
remaining monotonic milliseconds locally. The metadata-only Node probe had used
an integer timeout, so it did not cover this native deadline path.

[Both failed attempts](../evidence/11-live-failed-attempts.json) remain distinct;
the second had temporary sanitized diagnostics and is not frozen-source acceptance.
The diagnostics were restored before the permanent change. A deterministic
fractional-deadline test through the actual pinned SDK/fetch boundary reproduced
the same error, then passed after flooring both bounded positive timeout options.
All69 owning search/deadline/disconnect/typed-loop tests pass. Overall deadline,
cancellation, paid leases, token cap and zero-retry behavior are unchanged.
Actual provider/device acceptance still requires a fresh reviewed build/run.

## Actual voice finding and bounded boundary correction

The same-seat [timeout correction review](../evidence/11-astra-timeout-pass-33d9.txt)
passed exact33d9 offline Spec/Quality with69 affected tests. The unchanged native
response is1992 UTF-8 bytes, SHA256
`fd9ded3b51f2f60a0f2696559717440c0aebe8878fb90cad9ddae861a2599faf`, native
message `msg_03981de7adb10efe016ad021cf6da08194bb334c64584f58ab`.
All six cloud checks passed at33d9. That source then served clean production
build `pTj3pXYyKylP2hszporEW` to actual desktop Chrome.

Actual provider lookup, hosted citations, Bluetooth output, three hands-free
Atlas turns and owner follow-up were observed. The three VAD-frame-estimated
speech-end to scheduled-audio totals were4002.5,3848.6 and3820.9ms, missing the
roughly three-second target. The real summary→Beacon interruption had0.2ms
callback-to-local-suspension and0.1ms confirmation-to-local-cancel initiation.
These are same-clock browser measurements, not acoustic onset or remote abort.
The participant later clicked visible Stop; spoken cancel/stop had been ordinary
model questions. Two later speaker research attempts remain distinct: first
0c94862f was stopped after4/16 eligible segments; second59d426d5 delivered16/16
before a later Stop. The Yeti microphone track was observed ended; actual default
output was USB Audio. These prior-source observations are preserved, not relabeled
as later corrected-source acceptance.

The participant reported choppy audio, then anchored a stutter before “more
detailed answers” in one explicit microphone-off typed diagnostic. Its
[request-correlated diagnostic](../evidence/11-live-audio-diagnostic-33d9.json)
accounts for every HTTP PCM byte and all1168 native sources/ended events.
The anchored independent-synthesis boundary was scheduled contiguously; actual
provider PCM had200ms low-energy tail plus240–280ms low-energy head. RMS is not
a calibrated acoustic/phoneme boundary. No playback buffer or silence trimming
is justified by this finding. Other subjective cuts may have a different cause.

The [unchanged distinct remediation assessment](../evidence/11-astra-segmentation-assessment.txt)
is3077 UTF-8 bytes, SHA256
`cc0fe22962abc7f791be5a71462bfdbda202f1298a65e6366402c0728ad8855a`, native
message `msg_03981de7adb10efe016ad02ecd3ea88194ba1be8003d7a061e`.
It is a read-only assessment, not a new acceptance verdict.

Eight focused regressions were observed failing before correction. Line-leading
ordered-list numbers now remain with their item; inline numeric sentences,
standalone numeric answers, decimals and abbreviations retain their meaning.
Oversized stable sentences prefer existing clause punctuation before the same
safe word fallback and unchanged effective cap. No punctuation/words or PCM are
trimmed, and no public callback, API, pin, deadline, lease or audio budget changed.
The corrected96ee review and affected actual listening/L4 qualification are
recorded below. Full L1–L8 acceptance remains unverified.

## Corrected segmentation listening and visible-response finding

The same-seat [native segmentation review](../evidence/11-astra-segmentation-pass-96ee.txt)
passed exact `96ee0a413aa30042f37e2f59e69d13af5e813ed5` offline Spec/Quality:
108 affected tests and1725 additional in-memory chunk comparisons passed. The
unchanged response is2541 UTF-8 bytes, SHA256
`45df7baa2ff43f3d2b81f08b7581f2abeda6eab16e2998fa8521abd79557504f`, native
message `msg_03981de7adb10efe016ad031f6bc6c819483aae3d84b175c18`.

A fresh verified-module production build `h1uCvpS25XkLc98uYBglh` served that
source to actual Chrome155.0.8059.40, source digest
`8a2aaa24caf7a7e14a258dce2178f47a1f1b6fb5dbfe7c9083749291d980d889`.
The focused typed numbered Atlas/Beacon reply `0529a441` produced three mapped
speech segments of2.60,3.16 and3.60s at CPS14/cap84, without isolated list
numbers. All248 native sources ended. The participant reported, “Clear and
complete, without the earlier cutouts.” This is an affected normal multi-sentence
listening result, not a promise about every longer independently synthesized reply.

The later actual microphone Atlas turn `0edda763` had an unconfirmed Working
candidate: raw-start to local suspension0.3ms, native resume, same request and
answer retained. The participant's Speaking “umm” instead crossed confirmation;
confirmation to cancel initiation was0.1ms. The following captured turn returned
no-speech with zero model usage. That is not a successful Speaking misfire trial.
Typed Cedar while microphone-muted produced completed text and audible speech.
Three later microphone Beacon attempts completed STT/model text without any TTS
request. The latest `ada42eb5` had3296 input/74 output tokens and completed15.7s
before Stop. The participant initially saw no response; their later screenshot
showed the matching completed Beacon/West/one-item card and transcript. No failed
provider call or hidden automatic retry was substituted for this visibility finding.

Two distinct causes were identified. The ignored live observer used Playwright's
default1280×720 emulated viewport, so growing the OS window did not grow page
content. An owned blank Chrome probe reproduced fixed inner1280×720 at two actual
window sizes; `viewport:null` instead followed native inner900×613 and1200×763.
The next observer launch uses that native viewport and read-only UI geometry/mute
snapshots. No old live page was navigated by the agent for this correction.
Separately, the app placed newest replies after older turns beneath the controls.
The owner explicitly requested newest turn first, stationary top controls and an
independently scrolling response pane filling the remaining viewport.

The bounded UI correction reverses only a display copy, retaining original turn
numbers and chronological four-pair follow-up history. A further red browser
case reproduced old-history scroll position hiding a newly prepended turn; the
pane now resets once per new local turn ID, while later answer deltas preserve
the reader’s deliberate scroll position. Flex sizing/min-height0
keeps Stop/mutes above the scrolling pane, with compact existing chrome. Genuine
red regressions reproduced oldest-first order and absent independent scrolling.
The initial display/pane correction passed98 unit/UI tests, all17 Chromium browser
cases and typecheck/lint/format/docs. The additional new-turn-only scroll reset
passed17 owning conversation tests and typecheck; its strengthened actual-HTTP
browser case covers new submissions after reading older history and preservation
of deliberate scroll during a held answer’s later deltas. Real Next/Fastify mock checks cover
stable control bounds during pane scrolling, viewport-height growth, desktop and
390×700 narrow sizing, usable response area and no outer-page overflow. These are
offline UI results. New-source independent review and production qualification
remain pending; prior live observations retain their actual96ee/33d9 provenance.
Full L1–L8 acceptance remains unverified.
