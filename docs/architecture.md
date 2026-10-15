# Voice BFF architecture

The browser owns interaction, the Next.js BFF owns paid orchestration and policy,
and the separate Fastify service owns synthetic project facts. Provider keys,
model selection, retrieval origin and tool definitions stay server-side.

## Client interaction and automatic turns

[Conversation](../apps/web/components/Conversation.tsx) creates resources only from
gestures. [CaptureSession](../apps/web/client/voice/capture-session.ts) owns bounded
microphone acquisition, WAV submission and cleanup; the
[VAD adapter](../apps/web/client/voice/vad-adapter.ts) imports the pinned patched
module and same-origin assets. Capture and playback use distinct AudioContexts so
reversible output silence does not disable listening. Completed utterances submit
automatically. [Interruption](../apps/web/client/voice/interruption.ts) distinguishes
raw start, confirmation and misfire using capture identity and answer generation.

The [turn controller](../apps/web/client/turn-controller.ts) rejects obsolete
updates. [HistoryStore](../apps/web/client/history.ts) retains whole completed-text
pairs, even when later speech fails; interrupted/failed/truncated turns do not
enter history. State is in memory and clears on refresh.

## Next.js Route Handlers and event contract

[Turn POST](../apps/web/app/api/turn/route.ts),
[speech POST](../apps/web/app/api/speech/route.ts), and
[capabilities GET](../apps/web/app/api/capabilities/route.ts) run in Node. Exact
[Origin/Host admission](../apps/web/server/http/admission.ts) precedes request body
or paid work. [Contracts](../apps/web/shared/contracts.ts),
[validation](../apps/web/shared/validation.ts) and
[SSE framing](../apps/web/shared/sse.ts) define a versioned boundary across arbitrary
UTF-8/network chunks. The [client stream](../apps/web/client/turn-stream.ts) consumes
that boundary rather than importing server internals.

## Claude tools and Fastify aggregation

The [Claude adapter](../apps/web/server/providers/claude.ts) uses streamed Messages,
server-selected model IDs, exact native blocks/tool IDs and zero automatic SDK
retries. Models metadata establishes provisional search support; actual successful
search events/results establish account verification. The pinned basic search
version has a shared two-use turn budget across continuations and provider pauses.
An explicit rejection disables search for the process; ambiguous failures are not
reclassified as account incompatibility and no accepted call is replayed.

[runTurn](../apps/web/server/turns/run-turn.ts) validates the single
[lookup_projects tool](../apps/web/server/tools/lookup-projects.ts), performs actual
[HTTP retrieval](../apps/web/server/tools/retrieval-client.ts), and continues with the
native tool-result identity. The independent
[Fastify app](../apps/retrieval/src/http/app.ts) validates queries and serializes
[the exact fixture catalog](../apps/retrieval/src/projects/catalog.ts). The BFF
never substitutes an imported browser fixture for an unavailable data service.

## Deepgram PCM and bounded playback

The [Deepgram adapter](../apps/web/server/providers/deepgram.ts) uploads bounded
completed WAV audio for batch STT, then returns streamed raw PCM TTS at24kHz mono.
It validates the upstream media type and uses explicit deadlines/zero retries.
[SpeechText](../apps/web/client/voice/speech-text.ts) releases stable text before
model completion; [SpeechQueue](../apps/web/client/voice/speech-queue.ts) serializes
segments and applies the text backlog/segment limits.
[Playback](../apps/web/client/voice/playback.ts) accounts for actual decoded PCM on
the audio clock, with ten-second high water, two-second low water and emergency
overrun/stall teardown. Text remains usable when speech fails or output is muted.

Closed inline code retains its readable payload, including model IDs, numeric values,
underscores and indexing; only its matching one/two-backtick delimiters are removed.
URLs and citation metadata still receive speech sanitization. Backtick-fenced
listings use three or more opening backticks and a closing run at least as long;
the listing and language tag remain visual rather than being read as prose.
An unmatched structured suffix is held while streaming and dropped conservatively
at finish. This policy preserves inline meaning without speaking fence syntax.

## Cancellation, budgets and measurement

[Leases](../apps/web/server/turns/leases.ts) retain capacity until real upstream
settlement, even after client-visible cancellation. Admission can therefore return
Busy; recovery is a deliberate next action, never an automatic retry.
[Deadline](../apps/web/server/turns/deadline.ts) and
[configuration](../apps/web/server/config.ts) bound turn, retrieval and speech work.
Abort signals express local cancellation intent and do not establish remote
provider cessation or billing results.

[Live validation](live-validation.md) separates browser same-clock marks from
server monotonic spans, actual physical observations from deterministic offline
checks, and production build provenance from stable source/patch/module binding.
The [production launcher](../scripts/dev.mjs) starts exactly the two application
runtimes after a [clean build](../scripts/clean-build.mjs).

## Extension boundaries

A Responses-style provider adapter would implement the model boundary and native
continuation semantics without changing browser contracts. Another BFF would
preserve admission/events/cancellation while replacing framework hosting. Live STT,
WebSockets or WebRTC would replace the completed-WAV transport and require explicit
session/lifecycle policy; they are not hidden baseline dependencies. Persistent
research/history needs an authorized storage/privacy boundary. Scaling needs
shared leases, authentication and deployment evidence beyond this loopback app.
