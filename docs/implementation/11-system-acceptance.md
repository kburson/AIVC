# Story #11 joined system and live acceptance status

Whole-story acceptance remains unverified. This checkpoint supplies the joined
system, documentation, read-only verifiers, source-qualified partial live evidence
and measurement implementation for independent review. Required L1–L8 acceptance
remains failed/unverified; no controlled run is a substitute.

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
offline UI results. The corrected-head independent review and bounded new-source
production result are recorded below; prior live observations retain their
actual96ee/33d9 provenance.
Full L1–L8 acceptance remains unverified.

## Short-window review correction

The distinct [unchanged native UI review](../evidence/11-astra-ui-fail-0e06.txt)
at exact `0e06ef473d67b8211f0b79ad2d853634e64a2179` found one P2 despite42
focused tests and five joined browser checks passing. At900×400 the nonshrinking
upper chrome consumed all remaining space: response-pane height0, status clipped,
and outer overflow hidden. The same issue reproduced at640×360 and390×500.
The native response retains its requested-changes verdict:2759 UTF-8 bytes,
SHA256 `cbef9a0c46ed4afa67e8bd342a8771fe052de3dec92cbc1abbe26febae1198f3`,
message `msg_03981de7adb10efe016ad03d909ebc8194b35f743663da5f74`.

An actual joined browser regression reproduced height0 before the fix. An explicit
named upper controls region can now shrink and scroll when necessary; the separate
response pane reserves100px and retains independent scrolling. At all three short
sizes, Stop/mute/status remain reachable, response scrolling preserves control
bounds, controls scrolling preserves response bounds, and the body does not scroll.
The existing desktop/narrow700 checks still require every control visible without
upper scrolling, responsive pane growth and newest-card visibility. Six joined
browser tests,19 UI tests and typecheck passed. Newest-first display, original turn
numbers, chronological history and new-turn-only scroll reset are unchanged.
The same distinct Astra6/high reviewer passed the corrected exact head
`d98fcd99ffea8c2b8266a9fde7c34f664b88e7c8`:42 scoped tests and six joined
browser cases passed, with no remaining scoped finding. The
[unchanged native response](../evidence/11-astra-ui-pass-d98.txt) has2190 UTF-8
bytes, SHA256 `28098b2237d4200bdb208d71f8cabd59fd77dc42b5cfc3e741e1eea5ab5464e3`,
message `msg_03981de7adb10efe016ad03fa52d28819480ce8b0d2939e7ae`, reviewer SID
`01a13c7c-c4a4-7760-8b80-278687d46e54`. The report is copied byte-identically
from epic documentation checkpoint `fe2a158`. This is an ordinary native code
review, not a sealed APR/provider-action receipt or full live acceptance.

## Bounded current-source live evidence checkpoint

A fresh Sol6.1/high author session qualified exact `d98fcd99`, source digest
`ce046dc6beb32f54089dab109bf73f423a5425ba2d6a1112ce8e53e5b11e2c51`,
Node26.8.1, Chrome155.0.8059.40 on macOS. Actual installed VAD JS/declaration
postimages and the installed lifecycle marker passed before a fresh
`npm run build:clean`. Production build `Fm7ulGF7DhoVvhi0AyrOw` served both
runtimes through the production launcher used by npm start. The visible Chrome
context used native `viewport:null`, inner1200×919/outer1200×1006, scrollY0,
both microphone and output muted, and zero acquired microphone tracks. This typed
run did not import MicVAD, so its browser lifecycle marker remains unobserved.

The [sanitized current observation](../evidence/11-live-search-continuation-d98.json)
preserves the single deliberately submitted two-search-then-Atlas request,
actual HTTP200/SSE events, tool result/card, UI/mutes, marks and usage. Turn
`69e8e493-437b-4cfe-8647-785f54822ff2` reported2387 input/157 output tokens
and2 search uses. The model announced simultaneous lookups; Atlas rendered
active/North/3. The terminal answer was explicitly truncated with
“hosted search continuation is incompatible.” No sources event or complete cited
answer was observed. No retry, search-budget reset or increase followed.

Actual first text arrived1489.4ms after the browser request mark,1970ms before
the terminal event; total request-to-terminal was3459.4ms. These are typed,
network-inclusive same-clock browser spans, not speech-end or pure provider
latency. Zero speech requests/native audio sources were observed. The newest
Turn1 card was visible without outer-page scrolling. Stop/quit completed;
the owned browser exited0 and server exited130 after SIGINT, releasing both ports.

The application mapped the incompatible continuation to its documented truncated
fallback. Source inspection explains that the adapter omits exhausted search and
retains native prior content; outgoing provider bytes, original API error text and
an actual provider pause were not observed. The resulting configured/pending
capability is not an account-unavailable branch. L6 remains failed against the
required successful continuation; its unobserved wire/pause aspects stay
unverified. This result does not justify more paid attempts or relaxed budgets.

The current official [Anthropic server-tools documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools)
requires the same tools when resuming a paused or mixed client/server-tool turn,
and documents a validation400 when a waiting server tool is omitted. This creates
a plausible tension with the accepted exhausted-budget omission requirement. It
is a source-based compatibility hypothesis, not proof that this observed turn
paused or contained a waiting server block. No budget/tool policy was changed.

The [historical partial evidence](../evidence/11-live-partial-history.json)
consolidates exact33d9 and96ee source/build identities, saved-artifact hashes,
request-correlated marks, actual terminal usage/cards/citation URLs, devices and
Stop context states. It preserves all three Atlas timing misses and the actual
microphone research samples: first text5161.9/5079.9ms and scheduled first
audio5648.3/5664.5ms from the VAD-frame speech-end estimate. The first research
reply was stopped after4/16 eligible segments; the second delivered16/16 before
later Stop. Historical incremental TTS HTTP evidence is109 chunks/188160 bytes.
These observations are not relabeled as current-source trials.

The [live report](../evidence/live-validation.json) now has concrete current
source/build/browser/package/patch provenance and source-qualified case narratives.
It deliberately retains L1–L5/L7/L8 unverified and L6 failed, empty current-source
audio timing arrays, and no current browser lifecycle marker. Historical Working
misfire/resume, confirmed interruption, corrected listening, mute results,
headset/speaker answers and Stop evidence are preserved for distinct independent
assessment; short Speaking-misfire acceptance remains ambiguous. No acceptance
box, canonical Test or later lifecycle gate has been advanced.

Two concrete paths remain for owner consideration after the independent audit:

1. Keep #11 in Develop and use the audit to identify only genuinely missing
   observations or a narrowly scoped compatibility correction, preserving answered
   human rounds and requiring new exact-source evidence for any affected fix.
2. Explicitly amend the accepted scope to publish a partial reference baseline
   with the observed incompatibility and remaining gaps. This requires governed
   scope/approval changes; it cannot reuse the present acceptance as passing.

Checkpoint verification: `npm run verify:docs` passed;
`npm run format:check` checked320 files with zero findings. The read-only
`npm run verify:live` exited1 as required: all eight cases are fail/unverified,
the current browser marker and STT/TTS/device acceptance are absent, hosted
citations/accepted continuation/pause are unverified, and current-source Atlas,
research and interruption timing arrays are empty. The separately preserved
historical samples do not satisfy a current-source report automatically.

## Fresh independent whole-story evidence review

A fresh distinct Astra6/high reviewer assessed exact checkpoint
`c63c4d2cdc243d995d0d73fa92b303ece0357b54`, whole-story base `31948e8`.
The independently computed source digest equals the reviewed d98 application
source. Offline implementation Spec and Quality passed with no new actionable
source finding; evidence is honest but incomplete. Whole-live acceptance did
not pass, and merge/lifecycle readiness remains not ready.

The [unchanged native final response](../evidence/11-astra-evidence-review-c63.txt)
is12094 UTF-8 bytes, SHA256
`89933453d4a591fe6c71714a0e4a7a261a90d5a452b188d59d37d19f9cc29aa2`,
native message `msg_0cf7ad7b97c73867016ad046a436ec819595d08e9f0a437d79`,
reviewer SID `01a13d8d-0f96-7862-a1f0-c8d3c5c86071`. Root extracted only
this final message from the current reviewer chat and preserved its bytes. It
is ordinary independent review, not a sealed APR or registered lifecycle receipt.

Independent143 targeted tests and six actual joined mock browser cases passed.
The broader run initially passed621/623: concurrent reviewer browser use caused
an exclusive-port refusal and an ESLint fixture timed out under load. A sequential
rerun of those two files passed all ten tests, including production HTTP/shutdown,
without product edits or relaxed timeouts. Docs verification passed; live
verification correctly exited1. The report preserves both initial failures and
the bounded sequential result.

The reviewer authenticated four saved observation hashes, historical source
digests, retained records and all five historical Atlas/research timing rows.
Historical evidence remains useful for unchanged boundaries. The later source
changes were segmentation, then Conversation display/layout/CSS; the provider,
capture, interruption, playback and budgets were unchanged across those
intervals. These facts do not override the accepted whole-source equality gate.

The observed compatibility fallback conforms to the accepted specification.
Successful omitted-tool/prior-block/pause continuation remains a separate unmet
gate. The genuinely missing physical observation is a short unconfirmed
Speaking candidate with native playback correlation and same-answer resumption.
Actual Stop and controlled offline unmount retain their different boundaries.
No blanket repetition of answered physical rounds is recommended without first
resolving the accepted current-source evidence policy.

All six GitHub CI checks passed at c63, including Offline system acceptance.
The reviewer stopped normally and released all resources. Story11 remains
Develop with a nonpassing live report and draft PR37; canonical Test, task
Review, approval, cloud merge and Close have not occurred. The two numbered
owner paths above remain the concrete decision boundary.

## Proven pending-search accounting finding and bounded correction

The owner selected path 1: retain the full accepted live scope and whole-source
evidence gate. A single separately released, muted current-source diagnostic
ran at `3e0303686e550c166d4958f19d3c29123830494c`, unchanged source
`ce046dc6beb32f54089dab109bf73f423a5425ba2d6a1112ce8e53e5b11e2c51`,
fresh production build `TzhULPOKXYtfOVmaSLSFY`. The
[immutable sanitized diagnostic](../evidence/11-native-search-diagnostic-3e030.json)
preserves actual browser/SSE data, original native error, block hashes, observed
provider usage, source-derived accounting and passive-observer proof/provenance.
The earlier 69e8 record remains separate.

Turn `bfe61c51-f8f8-429e-92f2-153275fe894c` ended its first native round with
`tool_use`, two pending web-search IDs, zero search-result pairs and one client
lookup. Native usage supplied 2387 input/154 output tokens and no authoritative
search counter. All four native assistant blocks matched the actual next outgoing
assistant message by whole-content and per-block JSON/canonical hashes. The next
request omitted search; the original HTTP 400 identified the missing definition
for the unresolved search ID. This establishes the mixed pending-tool failure
for this diagnostic, not a provider pause or the earlier request's native cause.

The application correctly produced the specified truncated fallback and Atlas
active/North/3, but incorrectly displayed `searchUses:2` from pending-ID fallback.
Those IDs establish pending requests, not executed searches. The evidence retains
the computed 2 as an actual bug observation and keeps native search usage unknown.
Both mutes stayed on, with zero microphone tracks, speech requests and native
audio sources. The bounded clone observer preserves original transport objects
and bytes; delayed-clone and failure-isolation offline proofs passed. Clone
read-ahead may affect timing, so none of this diagnostic's latency qualifies as
baseline measurement. Owned browser/server shutdown completed and ports closed.

The same distinct Astra6/high reviewer independently confirmed one P2. Its
[unchanged native assessment](../evidence/11-astra-native-accounting-assessment.txt)
is 6249 characters/6269 UTF-8 bytes, SHA256
`853a85effcbf79109a6fe8c7ee689ef49e9c047b68e072e31cf6ad8e70e0f61f`,
message `msg_0cf7ad7b97c73867016ad053f15fe08195bffb691b9d154188`, reviewer
SID `01a13d8d-0f96-7862-a1f0-c8d3c5c86071`. This is ordinary independent
review and grants no sealed or lifecycle acceptance.

The correction changes only the absent-counter fallback in
[Claude accounting](../../apps/web/server/providers/claude.ts): numeric usage
requires distinct valid completed search-use/result pairs, no unresolved observed
IDs and no ambiguous or malformed final pairings. Supplied valid-counter handling
and its existing conservative consistency checks stay intact. The existing
turn loop already makes unknown consumption fail closed: remaining search becomes
zero and the public usage field is omitted, including after later known rounds.
No UI/interface, model/pin, prior block, retry, tool omission, token/search/round
or deadline budget changed.

The semantic IDs-only expectation was corrected and 17 regressions were observed
failing before the minimal fix; all 63 accounting tests then passed. They cover
the observed native mixed-call shape through the actual pinned SDK and turn loop,
unchanged native continuation, omitted tool, HTTP 400/truncation, absent public
search usage, completed/stream deduplication, malformed/duplicate/orphan pairings,
valid/invalid counters and unknown totals across later rounds. This is offline
correction evidence. Independent fixed-source recheck and all outstanding actual
live acceptance remain required; no new paid or physical run has occurred.

The mutable summary report omits the earlier unverified search-usage claim while
its original application-reported 2 remains in the historical artifact. Its tested
source/build remains original; after this source correction the report is
deliberately stale as well as failed/unverified. No evidence row was rebound to
new code, no accepted scope was amended, and no Test or later gate advanced.

Correction verification: all355 contract tests,98 unit tests and26 integration
tests passed, including the compiled production HTTP/shutdown check. Typecheck
initially caught TS2790 in the deliberately absent-counter test fixture: the SDK
declares its nullable field required although the actual response omitted it.
The fixture now uses Reflect.deleteProperty to represent that observed wire
shape, and both TypeScript workspaces plus all63 accounting tests passed again.
Lint, format and docs checks passed; read-only live verification exited1 with
the expected stale-source and outstanding fail/unverified acceptance reasons.
This checkpoint requests targeted independent source recheck, not whole-live
acceptance, canonical Test or later delivery gates.
