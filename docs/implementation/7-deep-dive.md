# Story #7 deep-dive analysis

Genuine author session 01a13a80-df10-73d1-bb27-014703513b3d inspected integrated feature 08567a2b4ddbd489f9ab562181142e8157a7ea2d and merged it normally into the story branch. Native admission is recorded and normal Plan entry is verified. This analysis grounds the accepted whole-story implementation; no product tests or live provider verification are claimed yet.

## Analysis

### Concrete interface findings

Accepted Task5 remains whole real Deepgram STT/TTS, bounded speech endpoint, deterministic mock and complete audio wiring. The accepted design/amendments and 17 preparation cases are unchanged. No manifest, frozen shared validator/type, or new architecture review is needed.

The integrated server-private providers/contracts.ts declares ModelAdapter and TurnDeps.transcribe(wav,signal), but not SpeechAdapter. #7 should add the accepted private SpeechAdapter signature beside these types; do not redefine shared SpeechInput/AppError/format in public agreement. getTurnDeps currently uses runtime.adapters.transcribe if present and otherwise throws STT_FAILED. It must resolve real or mock speech lazily after admission, while typed turns remain available without Deepgram. Capability speechAvailable already checks mock or Deepgram key plus TTS model. STT availability must independently require key plus STT model, not TTS.

runTurn already emits turn.accepted, stage transcribing, transcript.final and empty completed no-speech. It awaits deps.transcribe and checks abort before model work. Preserve this producer and its terminal sequencing; fresh integration tests should consume actual events through validateTurnEvent/SSE fixture assertions and establish zero model calls for valid empty STT, malformed STT failure, rate-limit and retrieval failures. No unnecessary producer replacement.

readBoundedBody(req,8192,signal) provides measured transport limit. Frozen validateSpeech(value,config.segmentChars) rejects extra keys and enforces UUID, segmentId<=80 nonempty, text<=effective cap (hard120 via configured cap). assertAdmission precedes body reads and adapters. Use common errorResponse/errorFields, not provider raw errors.

runWithDeadline exposes result, settled, signal. Its work callback must remain pending through provider/body/read/cancel joins; returning headers does not settle the lease. Speech response preparation should prefetch first provider chunk before resolving binary response, so errors before first byte retain common JSON/status. Pump incrementally thereafter, bounded by backpressure; do not aggregate synthesis into arrayBuffer/blob. On abort/cancel, abort adapter signal and await reader.cancel plus pending read before the work settles. A pending read EOF during deferred cancellation cannot release a lease until cancel settles. Release the speech pool slot from deadline.settled only; turn pool remains independent.

The deadline signal uses a registered monotonic remaining budget. SDK timeout options min(configured bound,deadlineRemainingMs)/1000 with minimum .001 and explicit maxRetries0 at constructor and call. Full-body deadline remains maintained by runWithDeadline, since the SDK timer clears at headers.

### Red-first implementation sequence

1. Provider controlled-fetch tests: actual pinned SDK, WAV Blob/model fidelity, transcript validation/empty distinction, single429/502 request, abort/deadline propagation. TTS exact linear16/24000/none options, deferred tail streaming, actual rawResponse Headers, strict audio/l16 MIME matrix, reject/cancel JSON/null body. Then minimal private adapter implementation.
2. Endpoint controlled stream tests: pre-body admission; measured8KiB/UTF8/escaped JSON; frozen schema hard/effective caps; capability; fixed PCM response metadata/no-store; independent two-slot Busy pool; first-byte JSON failure vs after-byte stream error; deferred upstream read/cancel/deadline joins. Then minimal Node route/response helper.
3. Mock/runtime integration: deterministic mock transcript and chunked mono24k PCM explicitly mock; real wiring lazy after admission; actual runTurn conformance including no-speech/no-model and text retention after independent synthesis failure. Preserve typed behavior and accepted configuration.
4. Scoped tests, integration, typecheck, npm test, slow suite, lint/format, then committed pushed CODE_COMPLETE for distinct reviewer. No live Deepgram/browser/microphone claims; #8 playback and #11 live acceptance remain separate.

The 17 original cases in docs/implementation/7-preparation-handoff.md remain the full test checklist, including cancellation race and nondefault deadlines. The analysis does not claim passing implementation verification. M / 3 human hours remains appropriate: provider protocol, streaming settlement and integration are bounded but interdependent. Existing accepted Task 5 and amendments govern the implementation with no semantic scope change.
