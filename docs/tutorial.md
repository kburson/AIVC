# A compact tour of the voice BFF

Use the [README](../README.md) for exact setup and commands. Read the
[architecture](architecture.md) beside this code tour. The baseline is local and
uses synthetic Atlas/Beacon/Cedar records. Mock/Contract Simulation and actual
live observations are separate evidence classes.

## React state, capture and automatic turns

Start in [Conversation](../apps/web/components/Conversation.tsx). A gesture unlocks
separate playback/capture contexts; effects only fetch capabilities and release
resources. The [capture owner](../apps/web/client/voice/capture-session.ts) handles
permission races, fresh streams, thirty-second bounds and exactly one valid WAV
end. The [VAD module adapter](../apps/web/client/voice/vad-adapter.ts) requests echo
cancellation/noise suppression and checks its applied lifecycle marker. Constraints
alone do not prove acoustic echo mitigation. Interruption remains a separate
[identity-aware policy](../apps/web/client/voice/interruption.ts), so tentative noise
can restore output while confirmed speech invalidates an obsolete answer.

## Route Handlers and streaming events

The [turn Route Handler](../apps/web/app/api/turn/route.ts) admits a request before
body/provider work. Follow the [client stream](../apps/web/client/turn-stream.ts)
through the canonical [SSE parser](../packages/contracts/src/sse.ts): reads may split UTF-8,
framing and events. [Contracts](../packages/contracts/src/contracts.ts) carry turn IDs and
sequence numbers; [controller](../apps/web/client/turn-controller.ts) updates cannot
cross answer generations. Compare the accumulated answer with final text and
[completed history](../apps/web/client/history.ts), rather than assuming a finished
network read means successful completion.

## Claude streaming and explicit tool loop

The [adapter](../apps/web/server/providers/claude.ts) creates a real streaming
Messages request; [runTurn](../apps/web/server/turns/run-turn.ts) handles custom
lookup, end, pause and truncation distinctly. Native assistant blocks and tool-use
IDs survive each continuation. Three rounds, four custom executions and a shared
two-search budget prevent unbounded work. A provider pause is not inferred from an
ordinary response. Exhausted search is omitted without rewriting retained native
blocks; incompatibility becomes explicit truncation, never a restored budget.

## Fastify HTTP aggregation

The [lookup tool](../apps/web/server/tools/lookup-projects.ts) validates arguments,
then [the HTTP client](../apps/web/server/tools/retrieval-client.ts) calls the
independent [Fastify service](../apps/retrieval/src/http/app.ts). Its
[catalog](../apps/retrieval/src/projects/catalog.ts) is the fact authority. The
browser displays exact returned cards; it does not fill service failures from an
imported catalog. This boundary can be demonstrated by holding/failing real HTTP
retrieval while the actual Next route has already streamed its preamble.

## Deepgram synthesis and PCM scheduling

[Deepgram](../apps/web/server/providers/deepgram.ts) receives a completed WAV for
transcription; this is batch STT. Speech generation streams raw signed16-bit
little-endian PCM at24kHz mono. The
[speech endpoint](../apps/web/app/api/speech/route.ts) does not buffer a whole answer.
[Stable text](../apps/web/client/voice/speech-text.ts) feeds a bounded
[queue](../apps/web/client/voice/speech-queue.ts), while
[playback](../apps/web/client/voice/playback.ts) counts current/future/unscheduled
samples once on the audio clock. A fast producer must wait at high water and resume
at low water; overflow or a stalled playback clock cancels speech with visible
text retained.

## Cancellation, failures and honest measurement

Follow [Interruption](../apps/web/client/voice/interruption.ts) for reversible raw
pause, confirmed cancellation and obsolete callback rejection. Follow
[leases](../apps/web/server/turns/leases.ts) for capacity held until upstream
settlement and deliberate Busy recovery. STT, retrieval, synthesis and rate-limit
failures have distinct visible outcomes. Output mute preserves listening/text;
microphone mute releases capture; Stop/unmount disposes both owners.

Use the [live procedure](live-validation.md) to record actual versions, models,
production build ID, patch/module provenance, sample count and method. Three Atlas
trials and one research/interruption exercise do not establish a percentile.
Callback-to-silence, confirmation-to-cancel and optional acoustic-onset latency are
separate. A headset workaround cannot turn failed speaker acceptance into a pass.
The read-only verifier checks evidence; it neither launches provider calls nor
creates successful results.

## Where to extend

A different model API belongs behind the server adapter; a different BFF must
retain admission/events/leases. Continuous STT/WebSocket/WebRTC work requires a new
transport/session boundary. Persistent research/history and public scaling need
explicit storage, identity and deployment decisions. See the
[extension boundaries](architecture.md#extension-boundaries); none adds a dependency
to this baseline.
