# Story #11 joined system and live acceptance status

Whole-story acceptance remains unverified. This checkpoint supplies the joined
system, documentation, read-only verifiers, source-qualified partial live evidence
and measurement implementation for independent review. Current functional subcases are supported by the observer-free physical checkpoint below;
L4 duration tuning is failed and L6 provider pause remains unverified. Full
acceptance has not passed; no controlled run is a substitute.

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

## Reviewed correction and ordered-search continuation

The same distinct Astra6/high reviewer returned scoped Spec/Quality PASS at
`385d11b2448dac5bf01400bb7c11834bfefbfbfd`, source
`cfa3cca0d676f4e98545aa965c6526f7c098ddbbaca6de6c3784a3b1262707bf`,
with no remaining finding in the seven-file correction. Its
[unchanged native response](../evidence/11-astra-accounting-fix-385d11b.txt) is
5561 characters/5565 UTF-8 bytes, SHA256
`d1e877dc42257d087f41d84a798dd0db2a89dcc769d10abcd377eb4fba855813`,
message `msg_0cf7ad7b97c73867016ad0580916588195afb8852b994ced0f`, same reviewer
SID `01a13d8d-0f96-7862-a1f0-c8d3c5c86071`. Independent 63 accounting tests,
both-workspace typecheck and docs passed; live verification remained nonpassing.
This is ordinary scoped review, not whole-live or lifecycle acceptance.

After fresh verified-module build:clean, production build
`O9qVb3AkQrdBpNGEUkEyB` served exact 385d/source cfa3 to actual Chrome 155.0.8059.40
on macOS with native 1200×1279 content, both mutes on and zero acquired tracks.
A separate one-shot ordered prompt explicitly required both web-search results
before catalog lookup. The [new sanitized diagnostic](../evidence/11-native-search-ordered-385d11b.json)
preserves that actual request and its native/public observations separately
from the earlier 69e8/bfe61 failures.

Turn `9866542c-9f0c-4495-8e22-cf51aa609dda` completed HTTP 200/SSE. First native
round `tool_use` contained two search-use blocks at indices 1/2, matching completed
results at 3/4 and catalog lookup at 6. Its authoritative search counter was 2,
with 15236 input/201 output tokens. The next outgoing request offered only
lookup_projects, retained all seven native blocks with matching whole-content and
per-block JSON/canonical hashes, and was accepted with `end_turn`. That round
reported 11202 input/240 output tokens and no search counter. The public completed
answer reported 26438/441 tokens and omitted unknown cumulative search usage;
the UI displayed unavailable. Atlas rendered active/North/3. No API/observer
error, cap, retry, budget reset/increase or policy/flag change occurred.

The final answer contained official-site Markdown links, but no structured
`sources` SSE event or native citation evidence was captured. The hash/type
observer does not prove categorical absence of native citation payloads. Those
links alone do not establish structured-citation acceptance. The response also
included prefatory narration; no strict three-sentence compliance is claimed.
No `pause_turn` occurred. This is successful ordinary completed-result omission,
not required provider-pause acceptance or complete L6 qualification.

The unchanged observer core and offline proof retain hashes 1d65f669/4b2b1db0.
A unique-output wrapper retained the original request/Response behavior and
explicitly labeled the core's old ID-fallback accounting projection as historical.
Only actual native counters/results and actual public usage support current
accounting conclusions. Observer-assisted latency remains excluded from baseline
timing. Both mutes stayed on, with zero microphone tracks, speech requests and
native audio sources; no browser MicVAD marker or physical acceptance was obtained.
Owned browser exited 0, server exited 130 after SIGINT and both ports closed.

The next phase is a clean production restart with NODE_OPTIONS and the passive
fetch-observer activation explicitly unset. A documentation-only descendant may
reuse the clean O9qV build after unchanged source/module/patch bytes and served
build provenance are checked. A fresh browser with a unique output path must
reach idle Ready, both mutes on, zero turns/tracks, before the root asks for human
participation. No microphone starts during this preparation. Baseline physical
qualification and the existing missing Speaking-candidate/native-resume correlation
remain pending under the unchanged whole-source gate.

## Current observer-free physical checkpoint at eddb472

The [deduplicated current-source evidence](../evidence/11-live-baseline-eddb472.json)
binds actual head `eddb4722584cda6137d0e456c87f4a560f90e117`, source
`cfa3cca0d676f4e98545aa965c6526f7c098ddbbaca6de6c3784a3b1262707bf`,
Node 26.8.1 and actual Chrome 155.0.8059.40 on macOS. It reuses production build
`O9qVb3AkQrdBpNGEUkEyB`, clean-built at reviewed 385d with identical source,
installed patch postimages and module bytes reverified at eddb. It was not rebuilt
at the documentation-only descendant. Both server observer environment flags
were explicitly unset. The actual browser imported the patched MicVAD and
recorded `aivc-vad-lifecycle-v1`.

This checkpoint records eleven actual completed application turns, forty-eight
speech requests, 670 unique bounded browser marks and 4649 native PCM sources.
The original stopped 29,478,554-byte snapshot remains unchanged in ignored
`.scratch/11-live-eddb472-groups1-4-stopped.json`, SHA256
`4748a59552face0821cbd40570588a8e98ff1aa327b5cfef29a41cd02964660f`.
The cloud artifact retains deduplicated exact marks/native PCM summaries, public
SSE, selected UI/device states, request delivery summaries and source custody;
it contains no raw audio or credential headers. The initial 04:50 session timestamp
is not an event timestamp. Owner answers retain their visible values, times and
question context supplied from the current root transcript, without a native-byte
authentication claim.

| Case | Current disposition and limits                                                                                                                                                                                                                                  |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1   | Functional pass: three spoken Atlas replies had active/North/3 and audible voice. First-audio target failed; see measured values below.                                                                                                                         |
| L2   | Owner follow-up resolved Atlas/North after completed history. Provider outgoing history bodies were not separately captured.                                                                                                                                    |
| L3   | Two genuine unconfirmed Speaking candidates overlap nonquiet native PCM, suspend/resume the same context at its frozen clock and preserve the answer. A Working candidate and confirmed Beacon interruption also occurred.                                      |
| L4   | **Fail:** normal answer hearing/coverage is supported, but five PCM segments exceeded the six-second estimate and required tuning remains open.                                                                                                                 |
| L5   | Typed mic-muted Cedar had no STT and 5 TTS requests; output-muted spoken Beacon had STT and 0 TTS. Clearing output mute did not replay Beacon.                                                                                                                  |
| L6   | **Unverified:** current spoken research supplied four structured sources events and actual public searchUses 1; ordinary seven-block-identical omitted-tool continuation was separately accepted at the same source. Genuine provider pause remains unobserved. |
| L7   | Bounded headset and speaker trials passed with owner confirmation; no universal echo claim.                                                                                                                                                                     |
| L8   | Actual Stop ended 5 acquired tracks/closed 8 contexts. Separate live capture followed by owned document/process close is distinct from controlled React-unmount tests.                                                                                          |

The three Atlas frame-end-proxy→first-text/scheduled-audio pairs were
5307/6514.8ms, 3769/4419.6ms and 2602.2/4179.2ms. All miss the around-three-second
first-audio target. The owner follow-up was 2178.3/3882.2ms; the spoken public
research was 5343.9/7087.6ms. STT/model-tool/TTS spans include browser, dispatch and
network time. Scheduled native playback includes its 10ms scheduling offset;
these values do not measure Bose/OS acoustic onset. Independent acoustic timing
stays null with a reason, and no percentile/SLA is claimed.

The owner reported three short sounds during the first four-sentence answer.
Only two VAD candidates were observed, so no one-to-one third-sound mapping is
invented. Each overlaps an actual nonquiet 40ms PCM source in native context 3:
suspensions at 1517911.4/1531069.1 retain clocks 66.4148752834/78.6459863946;
the same context resumes at 1518843.4/1532090.7. No confirmation or new turn
occurs for either candidate; the owner confirmed the same answer resumed and
finished clearly. Callback→native suspension was 1.7/0.7ms. Later Working raw
1730589.9 precedes first playback 1733031.8 and preserves the same Atlas answer.
Confirmed Beacon raw1740070.2→native suspension1740070.6 took about 0.4ms;
confirmation1740640.8→local cancel1740641.1 took about 0.3ms. These are local
context/abort boundaries, never independent acoustic silence or remote cessation.

The research hearing complaint is preserved exactly: the owner said voice stopped
after point 4 and did not read the following bullets. Phase1 traced the boundary:
the final answer ends at point 4; the visual bullets are separate Sources metadata.
Offline replay of the captured answer chunks through current SpeechText(84)
exactly matches all 11 speech request texts. Existing normalization omits inline
code, including model=nova-3, so this is eligible-answer coverage rather than
verbatim display reading. All 1428 research PCM sources ended before Stop;
last native end 1826329.3 precedes Stop 1853065.4 by 26,736.1ms. The owner subsequently
confirmed all four answer points were heard and understood the source distinction.
No dropped eligible tail, retry or source/UI change was established.

Duration accounting nevertheless found a separate unmet accepted obligation:
five segments measured 6.08/6.40/6.12/6.04/6.20 seconds at 81/81/80/74/81 characters.
All 48 admitted synthesis bodies completed; maximum observed scheduled native
outstanding was 6.3447 seconds, below the ten-second emergency bound. This does
not directly inspect every unscheduled internal queue field. Repeated duration
overruns leave L4 failed until accepted CPS/segment tuning is validated. The
profile remains CPS 14/cap 84. A concrete proposal for independent review is
runtime CPS 12/cap 72, replaying captured answers offline and validating only
distinct recut speech segments through the existing speech endpoint before any
joined listening check. It has not been executed; no source/config/budget change
or extra paid call is authorized by writing this proposal.

Headset input/default output were actual Bose QC Bluetooth. The speaker group
used actual Yeti input/default USB Audio output, with the owner confirming
speakers. Inputs were 48000Hz/16bit/mono/10ms and reported AEC/NS/AGC enabled.
Speaker Atlas's last native source ended 13,415.1ms before Stop, with no extra
turn and owner-reported no self voice. This bounded quiet observation does not
establish general speaker-echo immunity.

The final quiet teardown started capture once, observed live Yeti/Listening and
two running contexts, then closed only the owned browser/document. The browser
control exited 0; owned Node 92292/Chrome 92298 were absent; turn/speech request
counts stayed 11/48. No post-close JavaScript track-state query or direct React
cleanup observation is claimed. Existing controlled tests cover pending startup,
typed playback/timer and React unmount; current CI was independently checked by
the root. Owned production server SIGINT exited 130 and ports 3000/3001 were clear.
No microphone was reacquired after close.

The read-only report is now bound to this actual current-source baseline, while
all older failed/partial artifacts remain unchanged at their own source. L4
duration tuning and L6 genuine pause remain open; failed timing targets stay
failed. Full scope is unchanged and no canonical Test, Review, approval, merge
or Close follows from this checkpoint.

## Independent physical audit and inline-content correction

The same distinct Astra6/high reviewer found one P2 in the prior cfa3 checkpoint:
closed inline code was deleted wholesale, so point 4 said “you simply use in your
API calls” while the displayed answer supplied model=nova-3. The earlier exact
scanner replay proved queue consistency, not permission to delete that meaningful
value. The separate Sources-excerpt explanation remains valid; it does not resolve
this semantic omission.

The [unchanged native audit](../evidence/11-astra-physical-audit-1bbe506.txt) is 7046
UTF-8 bytes, SHA256
`5374216421508c1e470dd68eea969fb12765514b55bba4b99bf60f4f76123951`, native
message `msg_0cf7ad7b97c73867016ad06915c0e88195a4ef8fef437713d7`, reviewer SID
`01a13d8d-0f96-7862-a1f0-c8d3c5c86071`. It supports the stated bounded prior
functional cases and requests this correction; it grants no whole-live acceptance.

The minimal scanner correction retains closed inline payloads while removing
matching delimiters. Numeric values, underscores, operators and indexing remain
readable. Inline delimiters must close with the same run length; a longer run
inside the span cannot prematurely commit a sentence. Backtick-fenced listings
remain deliberately visual, with language tags excluded. Dangling tokens remain
conservative and existing URL/citation sanitation, segment cap, overlong-token
notice, backlog and playback policy remain intact. No API, queue, pin, default
CPS or budget changed.

The captured sentence and related regressions were observed failing before code:
eight failures included the missing model value and wrong delimiter handling.
All 42 scanner tests now pass, including every two-way split and one-character
chunks, one/two delimiters with longer nonmatching runs, numeric/code values,
fenced language tags, dangling tokens and the existing cap/omission behavior.
No actual new listening, synthesis, browser or microphone run occurred.

This changes the whole-source digest. The cfa3/cap 84 artifact and its human reports
remain byte-identical at their original tested source/build; the mutable summary
keeps that tested provenance and is now deliberately stale for corrected code.
L4 duration tuning and L6 genuine provider pause remain nonpassing. The same
reviewer must recheck this stable correction before the proposed CPS 12/cap 72
engineering screen; no probes have been released or executed here.

Correction verification at source
`14bee2533f13459b45add5278bf59a243e5af135e5cc70110dcaf54f31854e63`:
160 voice tests (including42 scanner tests),98 unit/UI/script tests,355 contracts,
27 slow and26 integration tests passed. Integration rebuilt the current workspaces
and exercised compiled two-process HTTP/shutdown with mock providers. Typecheck,
ESLint, Markdown lint, format and docs checks passed. No live browser/microphone
or paid synthesis/model request ran. Read-only live verification exits1 for the
historical source digest plus L4 fail, L6 unverified and unobserved required pause.

The [offline cap72 coverage analysis](../evidence/11-inline-content-offline-replay.json)
is a proposal input bound to the corrected source, not an executed CPS profile.
It replays full captured answer deltas without repairing the existing observer
encoding mismatch: Atlas SSE has mojibake where actual queued speech/UI has an
emoji. Two secondary Atlas analyses reconstruct the complete actually submitted
speech text with explicit lost whitespace/line-boundary provenance; they do not
prove display/final-answer equality. Research's captured ASCII delta replay is
primary and retains model=nova-3 after correction.

Eight distinct recut segments overlap the five previous overrun occurrences
(four distinct old text regions). Expanding to all immediate neighboring segments
produces fourteen distinct candidates, beyond the hard maximum ten probes.
The two raw Atlas source variants cannot exactly locate the queued emoji-bearing
region and remain unknown. Independent review must resolve whether a smaller
complete affected-boundary set is justified; no difficult case is silently
dropped, no text is normalized to hide a mismatch, and no probe budget expands.

## Reviewed partial CPS12 synthesis screen at 3e7170f

The [unchanged scoped inline-fix review](../evidence/11-astra-inline-fix-3e7170f.txt)
passed Spec/Quality with the P2 resolved. Its exact native final is 7708 UTF-8 bytes,
SHA256 `fd4b41c14bc5c73e827a649d4df317a5e820e57c2a28df86ad09ce9701b1c930`.
The reviewer explicitly approved a partial ten-text rejection screen, with nine
changed texts uncovered; it did not approve L4 or whole-live acceptance.

The [sanitized screen](../evidence/11-cps12-partial-screen-3e7170f.json) records
clean production build `2DZ7lAnJs9Ui-zV4QVYF_` from source
`14bee2533f13459b45add5278bf59a243e5af135e5cc70110dcaf54f31854e63`
and runtime CPS12/cap72 override, with defaults unchanged. Installed VAD postimages
and lifecycle marker matched; Node26.8.1, Deepgram SDK5.15.0 and voice
`aura-2-thalia-en` retain their pins. Native provider-clone observer variables
were explicitly unset. No browser, microphone, model/STT/search request or playback
was used in this HTTP-only screen.

Exactly ten sequential admitted synthesis requests completed once, with no retry,
all HTTP200, expected PCM headers, positive even byte counts and EOF. Durations
were 4.16,5.40,4.80,3.88,4.92,3.28,4.84,5.28,3.56,5.28 seconds. These are complete
PCM frame counts divided by24000Hz, not elapsed network or acoustic duration.
Original ignored results remain 12466 bytes, SHA256
`a9f5d9615642994a34a70cf255bd9bd5940588f53ed6b856f15bb4ebab93ed4e`.
No raw PCM or credentials are included.

The bounded corpus has23 distinct texts,19 changed and4 unchanged. All eight
overlap candidates were selected in order, then secondary Atlas segment5 and
research segment14. Secondary Atlas segments3/4/6 and research1/2/10/11/12/13
remain uncovered. Ten acceptable samples establish only those ten exact one-off
durations; no audible inline-value, joined queue/backpressure or current-source
physical qualification follows. Historical cfa3/cap84 evidence stays unchanged.
L4 remains failed/incomplete and L6 genuine pause unobserved. Full scope remains
retained; no Test, Review, approval, merge or Close is authorized by this result.
