# Live validation procedure and current evidence

Required whole-story live acceptance is currently **unverified**. Partial actual
provider/browser/physical observations and a real voice finding are recorded in
the [story status](implementation/11-system-acceptance.md). Offline Mock/Contract Simulation is
separate and cannot establish real microphone, generated voice, hosted search,
echo or physical latency acceptance. The [live report](evidence/live-validation.json)
now binds the exact current muted typed run and links source-qualified historical
observations; it retains failed/unverified acceptance, `npm run verify:live` must remain
nonzero until every required case is actually satisfied.

## Production and runtime binding

The accepted specification source is commit
`bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac`, path
`docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md`, SHA256
`8512daa8c456af00628a16471d4b13526c7585172c223c8bfa0f2323bee4fff6`.
[The transfer copy](specification.md) is byte-exact; current formatted navigation
views and preserved historical review records do not replace that authority.

Verify actual installed package versions, upstream VAD identity, patch digest,
applied-module digest and lifecycle marker before `npm run build:clean`.
Then use `npm start` for the two production application runtimes, Next3000 and
Fastify3001. Record the Host-validated capabilities production buildMode/buildId
and browser-observed imported lifecycle revision. A development server, stale
bundle, CDN entry or version string alone cannot establish this binding.
The read-only verifier compares tracked source/config/package bytes, ancestor head,
actual installed packages and applied VAD bytes. It does not launch paid calls,
write evidence, read current `.next/BUILD_ID`, require original ignored build output,
or require the same random ID after an identical rebuild.

## Deliberate bounded sequence

Use a real desktop Chrome or Edge session with the human participant's headset and
speakers. Both are available; actual behavior remains unverified until observed.
Load the already authorized credentials only into server process environment.
Choose explicit model IDs from account metadata, then qualify the actual app run.
Models support is provisional; successful hosted-search events/citations establish
account verification. Never replay an accepted provider call to conceal a failure.

| Case | Required observation                                                                                                                                                                                                         |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1   | Three Atlas hands-free trials: real microphone→batch WAV STT→Claude lookup→actual Fastify card, streamed text and generated voice without transcript action.                                                                 |
| L2   | Ask “Who owns it?” using completed-text history; completed text survives later speech interruption.                                                                                                                          |
| L3   | Confirmed Beacon interruption excludes old output; short Speaking/Working noise misfires restore the same answer/slow work. Record callback silence and confirmation cancellation separately.                                |
| L4   | A normal multi-sentence answer is fully spoken; measure actual segments, PCM/backlog and first-audio-before-completion behavior. Tune the character estimate only from actual overlong segments, then rerun impacted checks. |
| L5   | Transcript is optional; typed fallback and microphone/output mutes work independently.                                                                                                                                       |
| L6   | Actual public research/search citations, budget and omitted-tool unchanged-prior-block continuation including pause, OR an actual unavailable reason plus successful search-off lookup/conversation.                         |
| L7   | Test headset and speaker echo with observed settings. Unresolved speaker self-triggering stays fail/unverified, with the headset workaround documented.                                                                      |
| L8   | Stop/unmount releases microphone, audio and active requests without duplicates; local abort does not prove remote provider cessation.                                                                                        |

Also observe real incremental TTS bytes and local HTTP SSE delivery before model
completion. The baseline STT path is batch WAV, not continuous streaming STT.
If a required provider pause cannot be induced in modest attempts, record that
continuation as unverified. If the exact API/tool combination rejects omitted-tool
continuation, retain explicit truncated fallback and its compatibility limitation;
never restore the exhausted budget or invent successful acceptance.

## Measurement method

Use request-correlated browser `performance.now()` marks for VAD end, request start,
transcript arrival, model/tool stages and deltas, speech enqueue, headers/first bytes,
first scheduled sample, rawStart/local silence and confirmation/cancel. Record
server monotonic spans independently; never subtract clocks from different
processes. Document whether a duration includes upload/network time or only a
provider span. Retain raw nonsecret marks or sanitized observations in repo-relative
artifacts, with actual versions/models/browser, counts and method.

Record at least three Atlas samples, one public research sample and one
interruption/misfire sample. Callback-to-silence target is at most200ms; first audio
around three seconds for a simple lookup is a target rather than a provider
promise. Keep actual misses and limitations; a few samples do not justify a
percentile/SLA. Acoustic speech-onset-to-silence is separate and optional when it
cannot be measured: retain null with a reason, never replace it with callback-only
timing. No raw private audio, credentials, fabricated usage or costs belong here.

## Result interpretation

`npm run verify:live` validates the recorded report and sanitized runtime artifact
referenced by L1. The artifact binds provider labels, browser, served build ID,
observed lifecycle revision, source/runtime, method, search branch and actual
speech/device observations. It is evidence from the deliberate run, not a verifier-
generated attestation. Unknown provider counters are omitted. Required failed/
unverified cases prevent full acceptance; the explicit unavailable-search
alternative and optional acoustic measurement retain their specific meanings.

## Original acceptance case mapping

These links map every original specification case to executable coverage. Controlled
coverage establishes its stated boundary only; it does not turn an L1–L8 live
observation into a pass.

| Original case | Executable coverage and remaining actual observation                                                                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1             | [Typed tool loop](../tests/integration/typed-turn.test.ts) and [joined HTTP browser](../tests/browser/typed-system.spec.ts); actual Claude lookup remains L1.                                        |
| 2             | [Retrieval contract](../tests/contracts/retrieval.test.ts) and joined HTTP cards.                                                                                                                    |
| 3             | [SSE codec](../tests/contracts/sse.test.ts) and [PCM decoder](../tests/voice/pcm.test.ts).                                                                                                           |
| 4             | [Turn controller](../tests/contracts/turn-controller.test.ts), [interruption](../tests/voice/interruption.test.ts) and [browser interruption](../tests/browser/interruption.spec.ts); physical L3.   |
| 5             | [Capture ownership](../tests/voice/capture-session.test.ts) and [browser capture](../tests/browser/capture.spec.ts); real microphone L1.                                                             |
| 6             | [Speech queue](../tests/voice/speech-queue.test.ts); real incremental generation/playback L1.                                                                                                        |
| 7             | [Conversation failure states](../tests/ui/conversation.test.tsx), [audio turns](../tests/integration/audio-turn.test.ts) and joined retrieval failure; actual provider observations remain separate. |
| 8             | [Capture cleanup](../tests/voice/capture-module.test.ts), [conversation ownership](../tests/ui/conversation.test.tsx) and browser capture; physical release L8.                                      |
| 9             | [Admission](../tests/contracts/admission.test.ts), [speech endpoint](../tests/contracts/speech-endpoint.test.ts) and [capabilities](../tests/contracts/config.test.ts).                              |
| 10            | [Bounded speech queue](../tests/voice/speech-queue.test.ts) and [playback watchdog](../tests/slow/playback-watchdog.test.ts); actual generated voice remains live.                                   |
| 11            | [Search budget](../tests/contracts/search-budget.test.ts) and typed tool-loop continuations; selected live API/tool/pause compatibility L6.                                                          |
| 12            | [Reversible interruption](../tests/voice/interruption.test.ts) and browser interruption; physical callback/confirmation timing L3/L4.                                                                |
| 13            | [Capabilities](../tests/contracts/config.test.ts) and [search budget](../tests/contracts/search-budget.test.ts); actual available or explicit unavailable branch L6.                                 |
| 14            | [Public history](../tests/contracts/public-history.test.ts), [history store](../tests/contracts/history.test.ts) and [typed browser](../tests/browser/typed.spec.ts).                                |
| 15            | [Rapid interruption](../tests/slow/rapid-interruption.test.ts), actual joined admission Busy recovery and [safe links](../tests/contracts/links.test.tsx).                                           |

## Reading the bounded browser observations

[User Timing instrumentation](../apps/web/client/measurements.ts) retains at most
512 `aivc.*` marks, with turn/capture/segment IDs and numeric timing metadata.
It retains no question text, audio or credentials and cannot own product progress.
Read these marks after each deliberate sample before the bounded buffer ages out:

```js
performance
  .getEntriesByType('mark')
  .filter((entry) => entry.name.startsWith('aivc.'))
  .map(({ name, startTime, detail }) => ({ name, startTime, detail }));
```

`vad-end` joins `turn-created` by captureEpoch/utteranceId/intentVersion. The
immediately preceding synchronous adapter-local `vad-frame-end` mark records
its separate vadEpoch/vadUtteranceId and frame estimate; the unchanged two-argument
end callback carries no diagnostic extension. Pair these chronological marks
within the accepted end callback, without equating the two token namespaces.
lastSpeechFrameAt is the last VAD frame classified above the configured negative
threshold, not an acoustic recording of the last phoneme; its resolution includes
32ms frame quantization and scheduling. vadEndDelayMs is the observed model-frame
to end-callback interval. Use that same-clock frame estimate for the documented
speech-end totals, and retain its measurement limitation. The separate callback
start time can also be reported without relabeling it acoustic speech end.

`turn-request`, `stage-transcribing`, `transcript.final`, `answer.delta`,
`tts-request`, `tts-headers`, `tts-first-pcm`, `tts-completed` and
`playback-first-scheduled` distinguish upload/transcription, model/tool, synthesis
and browser buffering boundaries. Network-inclusive browser spans are not pure
server/provider durations. First scheduled output is the scheduling mark time
plus scheduledAfterMs; it is not proof of acoustic onset. If a provider-only span
cannot be isolated, retain null and explain the unavailable boundary.

`vad-raw-start` to `playback-suspended` measures callback-to-local-context silence;
`vad-confirmed-start` to `turn-local-cancel` measures separate local generation/
abort initiation. Neither mark proves remote provider cessation. `vad-module`
records the revision checked on the actual imported module after patch validation.

## Historical bounded checkpoints before the current baseline

The [d98 muted typed diagnostic](evidence/11-live-search-continuation-d98.json)
observed one actual HTTP200/SSE request, two reported search uses, Atlas's
active/North/3 card and explicit incompatible-continuation truncation. It produced
no citation event, microphone/STT, speech request or audible playback. Native
provider prior-block identity and pause remain unverified; configured/pending
search does not qualify as account-unavailable fallback. No retry or budget
change followed. Source/build/package/browser/patch identities are recorded,
while the unobserved current browser lifecycle marker stays empty.

The [historical observations](evidence/11-live-partial-history.json) preserve
33d9/96ee microphone, research, callback, listening/mute/device/Stop evidence with
their original heads/builds and saved-file hashes. Research microphone timings
were recovered from genuine saved marks rather than repeating participant rounds.
Review must assess each affected boundary and ambiguity; historical successes do
not turn the current report into full acceptance. The read-only live gate remains
nonzero.

The [separate native diagnostic](evidence/11-native-search-diagnostic-3e030.json)
subsequently proved a mixed pending-tool rejection, with no provider pause and no
authoritative search counter. The pre-correction public `searchUses:2` was
computed from pending IDs; it is preserved as a reporting defect, not actual
executed usage. The bounded correction requires completed pairs for absent-counter
fallback and reuses the existing unknown/omitted usage path without restoring
budget. Current changed source awaits independent recheck and genuine live
qualification under the unchanged whole-source gate.

A [single ordered corrected-source diagnostic](evidence/11-native-search-ordered-385d11b.json)
then observed both matched completed search results before client lookup, followed
by accepted search omission and unchanged native prior blocks. The public total
remained omitted when a later round had unknown search usage. No structured
sources SSE event/native citation evidence or provider pause was captured. It is
a successful ordinary boundary observation with all observer-assisted timing
excluded; full L6 and observer-free current-source physical acceptance remain
unverified. Clean baseline readiness precedes any new participant request.

## Current observer-free physical result

The [current cfa3 baseline](evidence/11-live-baseline-eddb472.json) and
[case report](evidence/live-validation.json) bind actual eddb472/Chrome 155,
browser-observed patched MicVAD and reused clean 385d production build O9qV.
They preserve current headset/speaker, Working/Speaking candidate, confirmed
Beacon, batch STT, incremental TTS/SSE, typed fallback/mutes and actual Stop
observations. Browser/document process closure remains distinct from direct
controlled React-unmount tests.

Full acceptance remains nonpassing. Three Atlas scheduled first-audio values
were 6514.8/4419.6/4179.2ms using the documented frame proxy, so the target failed.
Five native PCM segments exceeded the six-second estimate; L4 duration tuning
is failed. Current research produced four structured sources events and public
searchUses 1. Same-source ordinary omitted-tool/prior-block continuation is
accepted in the separate native artifact, but genuine provider pause stays
unobserved and L6 unverified. Do not retry to chase a pause.

The original source-excerpt hearing complaint and later clarification are both
retained: eleven research speech requests exactly match offline replay of eligible
answer text, with inline code omitted by existing normalization. Visual Sources
excerpts are separate metadata. Three reported short sounds yielded two genuine
unconfirmed Speaking candidates; no third correlation is fabricated. Historical
artifacts retain older source bindings. See the
[implementation checkpoint](implementation/11-system-acceptance.md#current-observer-free-physical-checkpoint-at-eddb472)
for case scope, precise timing limits, custody and the unexecuted CPS 12/cap 72
tuning proposal awaiting independent assessment.

## Inline-content correction after the cfa3 trial

Independent review found that deleting closed inline code removed meaningful
model=nova-3 from the spoken answer. The scanner now retains readable inline
payloads and distinguishes visual-only backtick-fenced listings; see the
[normalization policy](architecture.md#deepgram-pcm-and-bounded-playback).
The [exact audit](evidence/11-astra-physical-audit-1bbe506.txt) and
[correction status](implementation/11-system-acceptance.md#independent-physical-audit-and-inline-content-correction)
preserve the finding and test evidence. The cfa3/cap84 physical artifact stays
unchanged and cannot qualify the new source digest. Its timing misses, L4 duration
overruns and L6 unobserved pause remain; no new live run or lifecycle gate passed.

## Corrected-source partial duration screen

The [CPS12/cap72 partial screen](evidence/11-cps12-partial-screen-3e7170f.json)
records ten exact one-off synthesis responses at corrected source14bee, clean
production build2DZ7lAnJs9Ui-zV4QVYF_ and voice aura-2-thalia-en. All ten had valid
PCM and durations3.28–5.40seconds. Nine changed texts remain uncovered; no audible
listening, joined playback/backlog or whole-source physical qualification was
established. The cfa3/cap84 physical evidence remains historical and unchanged.
L4 stays failed/incomplete, L6 genuine provider pause unobserved, and the read-only
live report intentionally remains nonpassing. See the
[implementation checkpoint](implementation/11-system-acceptance.md#reviewed-partial-cps12-synthesis-screen-at-3e7170f)
for exact selection, provenance and limitations.
