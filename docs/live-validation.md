# Live validation procedure and current evidence

Required live acceptance is currently **unverified**. No actual provider/browser/
physical run has been recorded for story#11. Offline Mock/Contract Simulation is
separate and cannot establish real microphone, generated voice, hosted search,
echo or physical latency acceptance. The [live report](evidence/live-validation.json)
retains missing/failed/unverified observations; `npm run verify:live` must remain
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
