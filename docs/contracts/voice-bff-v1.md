# Voice BFF public agreement, schemaVersion 1

Issue #13 delivers the client-safe agreement consumed by browser and BFF owners. The accepted contract amendment is docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md at 6eda972a9df1bcbe1f8f650e9506c709026b02d8, SHA-256 c1cbb39604da9627d9ef3b401e42fcef2f8f0cef1bd04ad18af46ca807fb720e. Hydration Task10 maps to #13. Historical specification/base plan and accepted Node26 amendment remain unchanged.

This is Mock/Contract Simulation conformance. It does not establish provider success, joined HTTP/UI behavior, microphone capture, voice latency, hosted search or final live acceptance. The temporary Client Component probe imports every shared module and performs no endpoint or provider call. #6 replaces that probe after its own consumer compilation check.

## Public modules and data

Production imports are restricted to standard web APIs and the four sibling shared modules; server/config/provider/native SDK/runtime/credential dependencies are excluded. The sole AppError is exported from contracts.ts with readonly httpStatus, code, turnId and retryable plus inherited message. Server errors later re-export this class.

All validators clone validated data and reject additional fields, missing required fields, wrong types, literals, enum values, malformed UUID strings, nonfinite/fractional/negative or unsafe integer counters. UUIDs use the hexadecimal 8-4-4-4-12 form, case-insensitively. Sequence values and usage counters are nonnegative safe integers. No raw provider blocks or model thinking appear in public payloads.

| Public data    | Exact fields                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| ProjectRecord  | id, name, status(active/paused/complete), ownerTeam, openItems(nonnegative integer), summary; record strings are nonempty |
| ProjectCatalog | schemaVersion:1, source:synthetic-project-catalog, records:ProjectRecord[]; empty records permitted                       |
| HistoryMessage | role:user/assistant, content:string                                                                                       |
| TurnInput      | turnId, history, kind:text with text:string OR kind:audio with wav:Uint8Array                                             |
| SpeechInput    | turnId, segmentId, text                                                                                                   |
| Source         | title:string, url:string, optional citedText:string; URL rendering policy belongs #6                                      |
| Usage          | optional inputTokens, outputTokens, searchUses; values are never invented                                                 |
| AppErrorFields | code:string, message:string, turnId:string/null, retryable:boolean                                                        |
| TurnStatus     | complete/interrupted/failed/truncated/no-speech; completed SSE permits complete/truncated/no-speech                       |

Capabilities has exactly schemaVersion:1, mode:live/mock, model/sttModel/ttsModel:string-or-null, build:{mode:production/development,buildId:string-or-null}, turnsAvailable:boolean, speechAvailable:boolean, search:{state:disabled/unavailable/configured/verified,reason:string-or-null,accountValidation:pending/verified/unavailable}, speech:{segmentChars:positive integer<=120,backlogChars:2400,highWaterSeconds:10,lowWaterSeconds:2}. Extra key-like fields fail. Configuration does not establish verified hosted search.

## Requests and history

POST /api/turn requires configured Origin and matching allowed Host before body reads or paid work. Multipart contains exactly turnId, history JSON and one text or audio part. Body is bounded to 2MiB both before shared parsing and by the later counted streaming BFF reader. parseTurn accepts already bounded bytes plus multipart/form-data with one valid boundary. Duplicate/extra fields, file-valued string fields, malformed history JSON and both/neither input fail with AppError400 INVALID_REQUEST; >2MiB returns413 BODY_TOO_LARGE. The parser preserves typed text including surrounding whitespace, rejects whitespace-only text, and caps JavaScript UTF-16 length at2000 (an astral emoji counts two). Parsed errors use the valid turnId when available; pre-body/body-cap rejection uses null.

Audio part MIME is case-insensitive audio/wav without parameters. RIFF/WAVE declared byte length must equal actual bytes. Every chunk and odd-byte padding must fit. Exactly one usable fmt and one data chunk are required: PCM format1, channel1,16000Hz,16bits,blockAlign2,byteRate32000. Unknown bounded padded chunks are skipped; duplicates/truncated/misaligned chunks reject. Data is an even number of bytes with at most480000 samples (30 seconds). Empty PCM is valid input for later no-speech handling, never a model-call instruction.

Inbound history must contain alternating whole user/assistant pairs, at most8 messages and16000 total JavaScript UTF-16 units. It rejects rather than trims. retainPairs clones every message, omits an oversized newest completed pair with omitted:true, then drops whole oldest pairs until both four-pair and16000-character limits hold. #6 alone controls current-generation atomic complete history admission; failed/interrupted/truncated/no-speech turns contribute neither message. Completed text remains after later speech failure, mute or interruption.

POST /api/speech requires the same pre-body admission. Measured JSON cap is8KiB. segmentId must be nonblank and<=80 UTF-16 units; text nonblank and<=supplied positive integer cap<=120. Effective cap=min(120,floor(6*CPS)); default CPS14 yields84. Success later streams application/octet-stream with X-Audio-Encoding:pcm_s16le, X-Audio-Sample-Rate:24000, X-Audio-Channels:1 and no-store. GET /api/capabilities validates allowed Host only and returns JSON/no-store. Retrieval remains a separate configured HTTP service, with no browser or BFF fixture fallback.

## Event envelope and grammar

Every event is {schemaVersion:1,turnId:UUID,seq:nonnegative integer,type,data}. Exact payloads are:

| type             | data                                                           |
| ---------------- | -------------------------------------------------------------- |
| turn.accepted    | {mode:live/mock}                                               |
| transcript.final | {text:string}                                                  |
| stage            | {stage:transcribing/researching/retrieving/answering}          |
| tool.started     | {name:lookup_projects,summary:string}                          |
| tool.completed   | {result:ProjectCatalog}                                        |
| answer.delta     | {text:string}                                                  |
| sources          | {sources:Source[]}                                             |
| turn.completed   | {text:string,status:complete/truncated/no-speech,usage?:Usage} |
| turn.failed      | AppErrorFields                                                 |

Exactly one accepted event at seq0 begins the stream; one UUID persists and each event increments seq by one. A non-null turn.failed payload turnId must match the envelope turnId; null remains permitted by AppErrorFields. A successful stream has exactly one completed or failed terminal and no later event. Deltas concatenate literally; complete and truncated terminal text must equal that concatenation. No-speech has empty text and no transcript/model/tool/delta/source work. Optional transcribing hints precede optional nonempty transcript.final, which occurs once before model/tool work. Researching/answering hints may repeat or be omitted; sources may interleave with answer deltas and no-tool ordinary answers are valid.

A public tool.started denotes a validated lookup dispatch, not a rejected model attempt. Lookups serialize; tool.completed requires a pending dispatch. Optional retrieving hints lie between dispatch and completion/failure. No new tool, answer or sources event can occur during a pending lookup. Native argument rejection may continue with ordinary answer events and no public tool/retrieving events. Dispatched retrieval failure ends with RETRIEVAL_UNAVAILABLE, message Project retrieval is unavailable., retryable:false; it may leave the dispatch pending but never fabricate completion, continue answering or fall back. assertTurnSequence applies complete-collected-stream conformance and reports INVALID_STREAM for violations.

## SSE framing and stable decoder failures

The fetch-readable POST response later uses text/event-stream and Cache-Control:no-cache,no-transform. encodeSse validates then canonicalizes envelope property order schemaVersion/turnId/seq/type/data and emits UTF-8 event: TYPE, LF, data: JSON, LF LF. Deltas containing paragraph separators retain actual LF bytes[10,10], not literal backslashes. Expected framing bytes are authored independently in tests.

decodeSse incrementally handles arbitrary UTF-8 byte splits, LF/CRLF, comments, optional matching event labels, multiline data joined with LF and a trailing unterminated frame. It validates schema plus sequence/grammar before yielding. SseDecodeError name is stable; code is STREAM_DISCONNECTED or INVALID_STREAM. Message/cause is diagnostic.

- STREAM_DISCONNECTED: empty/no-terminal EOF, read rejection before terminal, incomplete unterminated final JSON (including partial failed terminal), or incomplete UTF-8 at EOF. Already yielded partial text remains incomplete.
- INVALID_STREAM: malformed terminated JSON, valid JSON with invalid schema/order/sequence at terminated or unterminated EOF, mismatched event label, concurrent/unpaired lookup, mixed UUID, duplicate acceptance, post-terminal events or terminal text mismatch.
- A syntactically complete unterminated terminal is accepted. A complete unterminated nonterminal is yielded and then disconnects. Caller AbortError is preserved, including if iterator cleanup fails. No automatic reconnect or paid replay is authorized.

#6 maps disconnect to Connection ended before the answer completed. and invalid protocol to The server sent an invalid response.; it preserves partial visible text, excludes history and permits deliberate new-question recovery.

## Errors and normative simulation

Pre-stream JSON is {error:{code,message,turnId,retryable}}. Accepted HTTP statuses are400/403/413/429/502/504. After accepted SSE, errors use one turn.failed and close. Stable server codes: ORIGIN_NOT_ALLOWED, INVALID_REQUEST, BODY_TOO_LARGE, BUSY, TRANSCRIPTION_FAILED, MODEL_RATE_LIMIT, MODEL_FAILED, RETRIEVAL_UNAVAILABLE, SEARCH_UNAVAILABLE, TURN_DEADLINE, SPEECH_FAILED, SPEECH_DEADLINE, LIMIT_REACHED. Client-only reasons: NO_SPEECH, SPEECH_BACKLOG, SPEECH_TOKEN_TOO_LONG, AUDIO_OVERSIZE, PLAYBACK_STALLED, SPEECH_RESUME_FAILED, CONTEXT_OMITTED, STREAM_DISCONNECTED, INVALID_STREAM. Shared foundation implements malformed-input/body-size errors; runtime/paid endpoint behavior stays sibling-owned.

The frozen fixture uses UUID11111111-1111-4111-8111-111111111111 and mock mode. Atlas record is exactly id:atlas,name:Atlas,status:active,ownerTeam:North,openItems:3,summary:Synthetic active project owned by North with three open items. Full order: accepted/researching/preamble/tool.started/retrieving/tool.completed/answering/separator/answer/completed. Preamble is Let me check Atlas.; separator is two LF; answer is Atlas is active, owned by North, with 3 open items. Terminal text is their literal join and simulated usage is20 input/30 output/0 search. No transcript or sources event appears in this typed trace. Search is unavailable with reason Mock/Contract Simulation does not verify hosted search. and accountValidation unavailable.

Independent positive traces include repeated/interleaved stage/source events, zero-tool answers, audio transcription, no-speech, truncation and rejected-native-attempt continuation; negative traces include dispatched retrieval failure followed by impossible completion/answer. #5 must prove actual producer equality against this fixture while retaining native tool IDs and real Fastify HTTP work. #6 proves actual UI consumer behavior; #11 later joins HTTP boundaries and repeats conformance.

## Frozen source digest

Run node scripts/contract-digest.mjs. Aggregate SHA-256 covers exactly these five paths in ascending ASCII order: apps/web/shared/contracts.ts, apps/web/shared/history.ts, apps/web/shared/sse.ts, apps/web/shared/validation.ts, tests/helpers/wire-contract-fixtures.ts. For each: UTF-8 path, NUL, ASCII decimal raw byteLength, NUL, raw bytes, NUL. There is no newline/BOM normalization. Output is sha256: plus64 lowercase hexadecimal digits and stdout newline; missing inputs fail. Doc/script/tests/probe/starter/review assets are excluded, and recipe changes require compatibility review.

Current digest: sha256:ef4409385e545e82b91fcd44caaab02e457e8af9404d5abba3f07b8956a1d58c.

Consumers use the delivered command and reviewed source/fixture bytes. Incompatible changes stop impacted work, require compatibility review and regenerated fixtures/tests, refreshed scope/digests and producer/consumer/joined revalidation before renewed fanout. Foundation delivery still requires exact-head Test, independent review, integration and Close before consumer implementation.
