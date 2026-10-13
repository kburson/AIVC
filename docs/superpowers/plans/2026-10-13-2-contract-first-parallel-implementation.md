# Contract-first Parallel Implementation Plan Amendment for Epic #2

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this amendment task-by-task. Steps use checkbox syntax. This additive amendment changes decomposition and scheduling only after sealed acceptance and root-owned canonical hydration; it grants no native parallel wave or lifecycle approval.

**Goal:** Deliver independent browser and BFF work against one executable public API agreement while retaining the separate Fastify service and every final system/live requirement.

**Architecture:** Preserve the accepted two-process Next.js Node BFF plus Fastify retrieval application. Extract one complete public-contract foundation from Tasks 2/3/4 and one complete capture-module package from Task 7. Browser components use explicit test-only controlled transports; BFF tests use real retrieval HTTP. Later system tests join the independently delivered components.

**Tech stack:** Node >=26; exact reproduction 26.8.1 / npm 12.0.2 / @types/node 26.6.5, all other accepted direct pins unchanged. Global ai-peer-review 0.4.1 runtime/MCP remains untouched.

**Spec:** [Accepted design](../specs/2026-10-12-voice-bff-reference-design.md). **Authority:** Historical specification bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac, SHA-256 8512daa8c456af00628a16471d4b13526c7585172c223c8bfa0f2323bee4fff6; base plan docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md, at accepted revision cb82f730f63ba0e0bd4480f7bc76ca09d286af83, SHA-256 5dc37eb3c25f59d056756b45582a584ea321ac3a881041992b073b5a3656523e; accepted Node26 amendment 3574e5d35ebaafbf427a68aeac7c66e409b1e4e0, SHA-256 0d478dc1a1a114b63c7ebd2bf151fa7e0e5b17ed33f4410c81a06ddc098cd939. Exact Task 1 / 2 / 3 / 4 / 5 / 7 sections and current native rank-wave policy/bindings/runtime were inspected.

## Preserved global requirements

Keep exactly two local processes; same-origin browser→BFF only; server-owned credentials/model/tools/retrieval origin; no Edge/extra gateway/general framework. Typed input 2,000 characters, measured turn body 2 MiB, WAV mono PCM16 / 16 kHz / 30 seconds. Completed history four whole pairs/eight messages/16,000 JS-string characters, never partial-turn history. Turn/retrieval/speech deadlines 60 / 5 / 20 seconds, two upstream-held slots per request kind, no paid replay or automatic 429 retry. Model 3 rounds / 4 custom attempts / 1,024 output tokens; hosted search 2 uses shared across continuations, exact web_search_20250305. Speech mono PCM16 little-endian at 24 kHz, segment min(120,floor(6*CPS)), CPS 14 gives 84 characters, backlog 2,400 characters, audio high/low 10 / 2 seconds and stalled playback 3 seconds. Preserve safe Markdown/HTTP(S), exact VAD timing/cleanup patch, all 15 spec cases and actual final live evidence. No API credentials or live model selection is needed for these offline contract/component deliveries.

## Review Focus

1. Producer and consumer disagree about the first sequence or terminal text: CONTRACT pins valid/invalid traces; #5 producer and #6 consumer prove conformance.
2. A client test double accidentally becomes a production fallback: #6 tests intercept only test harness transport; #11 joins actual HTTP processes without turn interception.
3. Shared validation imports a secret-bearing config or provider SDK: CONTRACT checks transitive public-module imports and browser build; server config stays server-only.
4. Capture initialization or inference settles after Stop: CAPTURE-MODULE exercises the actual patched public destroy path; #9 proves real browser resource cleanup.
5. A rank member reports a module checkpoint as complete before shared wiring: controller enforces whole-story entry/completion graph, especially #7; independent checks never waive Test/Review/Close.

## Exact runtime and dependency pins

Node floor >=26; .nvmrc 26.8.1; npm 12.0.2; packageManager npm@12.0.2; @types/node 26.6.5. Keep engine-strict=true and save-exact=true. Preserve TypeScript 5.9.3, tsx 4.20.6, Vitest 4.0.18, ESLint 9.39.1, eslint-config-next 16.4.0, Prettier 3.9.10, jsdom 26.1.0, @testing-library/react 16.3.3, Playwright 1.64.0, @types/react 19.3.0 and @types/react-dom 19.3.0. Web: Next 16.4.0, React/React DOM 19.3.0, react-markdown 10.1.0, @anthropic-ai/sdk 0.133.0, @deepgram/sdk 5.15.0, @ricky0123/vad-web 0.0.31 and onnxruntime-web 1.30.0. Retrieval: Fastify 5.12.5 and Ajv 8.17.1. CAPTURE-MODULE alone adds patch-package 8.0.1 with postinstall patch-package --error-on-fail. Preserve the existing local AITM tarball and global local APR 0.4.1 installation/Node26 runtime/MCP. No package installation is authorized by authoring this amendment.

Clean reproduction explicitly selects Node26.8.1, installs npm@12.0.2 if absent, checks versions with delivered scripts/verify-toolchain.mjs, then npm ci. Node26.8.1 is the selected Current release, not an inherited Node24 LTS claim. CI and README retain the accepted Node26 amendment ordering. A later major meets the floor but is tested only if actually exercised.

## Verified current status

Fastify/workspace #3 is implemented. Current issue read shows OPEN, last-known Test, rank 2; remaining review/approval/integration/Close gates are not complete. It is neither an ongoing implementation track nor strict Done. Do not invent retrieval work to claim three concurrent tracks.

Current live field ranks: #4=3; #5=4; #6=5; #7=4; #8=7; #9=7; #10=9; #11=10. This checkout is clean c5c94f4 and has no application interface source; exact APIs below come from accepted plan, not invented existing code. Implementers must use the actual reviewed #3 integrated source base.

The amendment author is genuinely bound as issue #2 orchestrator in native session 01a135ad-c1bc-7492-9e5f-be69bf8257f4, branch codex/2-draft. This is planning collateral only. The actual canonical child state can change during review; root revalidates it before scheduling. No new source implementation is claimed here.

## Defineed smallest complete graph

Create exactly TWO new governed child stories, symbolically CONTRACT and CAPTURE-MODULE until canonical creation assigns real numeric IDs. CONTRACT is a complete executable public agreement delivery. CAPTURE-MODULE is a complete independently reviewable library/patch/assets delivery. Narrow existing scopes explicitly; do not close a partial phase of an unchanged original story.

| Delivery | Proposed rank | Required reviewed/integrated/strict-Done entry | Full completion |
|---|---:|---|---|
| #3 Fastify/workspace | 2 unchanged | None | Existing complete delivery/gates |
| CONTRACT new issue, ID not assigned | 3 | #3 | Public types/validators/history/SSE/docs/fixtures/conformance |
| #4 BFF admission | 4, was 3 | CONTRACT | Server config/body/admission/leases/deadlines/build/capabilities |
| #6 typed browser client | 4, was 5 | CONTRACT | Generation/history/rendering/transport and honest client-contract browser acceptance |
| CAPTURE-MODULE new issue, ID not assigned | 4 | CONTRACT | WAV/VAD/capture/patch/assets module checks |
| #5 Claude/tools | 4 unchanged | #4 | Complete typed model/tool/retrieval HTTP/SSE producer integration |
| #7 Deepgram | 4 unchanged | #4 independent adapter/endpoint; #5 before shared wiring/full completion | Same owner completes all #7 integration, no partial-story Done |
| #8 PCM/playback/queue | 5, was 7 | Full #6 and #7 | Full speech client plus Conversation/controller wiring |
| #9 capture browser wiring | 6, was 7 | CAPTURE-MODULE and #8 | Full automatic Start/Stop/mutes/browser/assets acceptance |
| #10 interruption | 7, was 9 | #8 and #9 | Original full race/interruption/browser behavior |
| #11 system/live/tutorial | 8, was 10 | #3, CONTRACT, CAPTURE-MODULE and #4–#10 | Original final evidence plus joined typed-system browser tests |

After CONTRACT, three genuinely ready disjoint tracks are #4 server admission, #6 browser typed UI and CAPTURE-MODULE browser internals. After #4, #5 and #7 server modules can overlap browser work, while #7 waits #5 before shared-file wiring. Fastify is the delivered boundary reused by them.

Rank 4 requires ONE explicit rank-level grant whose exact membership is #4 / #5 / #6 / #7 / the real CAPTURE-MODULE number. Internal native DAG edges remain. Root bounds active workers by available slots while preparing genuine native identities/occupancy for all members; no manufactured sessions or duplicate bindings. Assigning #4/#5/#6 successive ranks would serialize their overlap under current strict lower-rank rule. Later ranks 5 → 6 → 7 → 8 deliberately serialize shared Conversation wiring.

Native epic-rank-wave-policy.mjs requires EVERY lower-rank child: board Done, issue closed, closeReason completed, no childEvidenceError, recoveryPhase null/complete. Ungranted operation is sequential. Granted operation requires frozen graph including ranks/dependencies/refinement digests, exact membership of ALL children of that rank, genuine bindings and each target’s current refinement and dependencyReadiness ready. Any other-rank active child refuses. Occupancy must match provider/session/worktree/generation; physical branch/common-directory and native transcript identity are independently verified. A paused Ready-for-Planning peer may retain genuine occupancy for preparation; the target still needs active exact bind. Verified supervisor discharge handles Test/Review handoffs; closed identities are retained historical evidence, never fabricated occupancy.

New stories/scopes/ranks/digests are not yet authoritative and the root has not recorded a grant. Root must review/pin the amendment, create real issues through canonical create-issue, update authorities/refinement/dependencies through sanctioned actions and record/revalidate a native grant. Refusal means hold source; do not bypass or send technical/rank choices to the user.

## Executable API agreement

CONTRACT owns apps/web/shared/contracts.ts, validation.ts, history.ts and sse.ts. New proposed artifacts: docs/contracts/voice-bff-v1.md, tests/helpers/wire-contract-fixtures.ts, tests/contracts/wire-contracts.test.ts, public-validation.test.ts, public-history.test.ts; tests/contracts/sse.test.ts moves from #5. Agreement records schemaVersion 1, exact limits/errors/headers/framing/sequence/terminal semantics and trace fixtures. Production modules/types and executable conformance—not prose alone—are consumer authority.

Exact accepted types:
```ts
type ProjectRecord = { id:string;name:string;status:'active'|'paused'|'complete';ownerTeam:string;openItems:number;summary:string };
type ProjectCatalog = { schemaVersion:1;source:'synthetic-project-catalog';records:ProjectRecord[] };
type HistoryMessage = { role:'user'|'assistant';content:string };
type TurnInput = {turnId:string;history:HistoryMessage[]} &
 ({kind:'text';text:string}|{kind:'audio';wav:Uint8Array});
type SpeechInput = {turnId:string;segmentId:string;text:string};
type Source = {title:string;url:string;citedText?:string};
type Usage = {inputTokens?:number;outputTokens?:number;searchUses?:number};
type AppErrorFields = {code:string;message:string;turnId:string|null;retryable:boolean};
type TurnStatus = 'complete'|'interrupted'|'failed'|'truncated'|'no-speech';
type EventPayloads = {
 'turn.accepted':{mode:'live'|'mock'};
 'transcript.final':{text:string};
 stage:{stage:'transcribing'|'researching'|'retrieving'|'answering'};
 'tool.started':{name:'lookup_projects';summary:string};
 'tool.completed':{result:ProjectCatalog};
 'answer.delta':{text:string};
 sources:{sources:Source[]};
 'turn.completed':{text:string;status:'complete'|'truncated'|'no-speech';usage?:Usage};
 'turn.failed':AppErrorFields;
};
type TurnEvent = {[K in keyof EventPayloads]:{
 schemaVersion:1;turnId:string;seq:number;type:K;data:EventPayloads[K]
}}[keyof EventPayloads];
type Capabilities = {
 schemaVersion:1;mode:'live'|'mock';model:string|null;sttModel:string|null;ttsModel:string|null;
 build:{mode:'production'|'development';buildId:string|null};
 turnsAvailable:boolean;speechAvailable:boolean;
 search:{state:'disabled'|'unavailable'|'configured'|'verified';reason:string|null;accountValidation:'pending'|'verified'|'unavailable'};
 speech:{segmentChars:number;backlogChars:2400;highWaterSeconds:10;lowWaterSeconds:2};
};
```

Accepted exports: parseTurn(bytes:Uint8Array,contentType:string):Promise<TurnInput>; validateSpeech(value:unknown,cap:number):SpeechInput; validateHistory(value:unknown):HistoryMessage[]; encodeSse(event:TurnEvent):Uint8Array; decodeSse(bytes:AsyncIterable<Uint8Array>):AsyncIterable<TurnEvent>. Parse bounded bytes only; reject duplicate/extra fields, invalid UUID, both/neither input, >2000chars, invalid RIFF length/chunk/padding/PCM 1 / channel 1 / 16,000 Hz / 16 bits / blockAlign 2 / byteRate 32,000 / more than 480,000 samples. Valid empty PCM maps later to no-speech without model. History validation rejects unpaired/nonstring/>8 messages / >16,000 characters input; never silently trims inbound.

Public interface allocations and explicit additions:
- Export AppError from shared/contracts.ts with constructor(httpStatus:number,code:string,message:string,turnId:string|null,retryable:boolean), matching the accepted common class so shared validation avoids server imports. #4 http/errors.ts normalizes/re-exports it; no competing class.
- Export retainPairs(input:ReadonlyArray<readonly [HistoryMessage,HistoryMessage]>):{pairs:Array<[HistoryMessage,HistoryMessage]>;omitted:boolean}, copied from accepted Task 4 algorithm: clone, omit oversized newest pair, otherwise drop whole oldest pairs until four pairs / 16,000 characters. #6 keeps current-generation atomic completion in HistoryStore.
- Initial seq convention was unpinned in historical text. This amendment explicitly defines seq 0 for turn.accepted and strict +1 thereafter. The reviewed agreement, producer and consumer conformance tests pin this additive choice; it is not represented as an already implemented convention.

Shared code cannot import server provider/runtime/credential-bearing config. ServerConfig remains #4 server/config.ts, with exact accepted mode/allowlists/keys/models/retrieval/search/CPS/segment/deadline fields. BFF parse/admission/deadline/lease APIs remain accepted assertAdmission(headers,config,requireOrigin):void, readBoundedBody(req,cap,signal):Promise<Uint8Array>, acquireLease(kind):{release():void}, runWithDeadline(ms,caller,work):{result,settled,signal}, deadlineRemainingMs(signal):number, getRuntime():process singleton. Timeout-facing result is never lease-settlement evidence.

Codec incrementally validates discriminated event/data/turn/sequence across UTF8/CRLF/multiline/terminators/trailing frame. Proposed protocol requires one accepted event and at most one terminal/no post-terminal append. #6 consumer additionally checks completed.text equals accumulated literal deltas. #5’s accepted joining invariant remains: one accumulator appends each delta once, no separator within round, later first nonempty text inserts standalone two-newline iff prior text exists without trailing whitespace, final native text never appended again. Truncation is visibly terminal but cannot establish history.

Endpoints:
- POST /api/turn: configured Origin+matching allowed Host before body; measured 2 MiB multipart fields turnId, history and exactly text or audio; fetch-readable text/event-stream, Cache-Control:no-cache,no-transform. No EventSource.
- POST /api/speech: same admission; measured 8 KiB JSON SpeechInput; segmentId nonempty<=80, text nonempty <= effective cap<=120; application/octet-stream plus X-Audio-Encoding:pcm_s16le, X-Audio-Sample-Rate:24000, X-Audio-Channels:1; no-store.
- GET /api/capabilities: allowed Host only, JSON/no-store, no secrets.
- Existing retrieval GET /health→{status:'ok'}, GET /v1/projects[?name]→validated ProjectCatalog; optional name nonempty <=200 / case-insensitive exact, malformed / repeated / unknown query returns 400, unmatched valid name returns empty. No browser direct call or BFF fixture fallback.

Common pre-stream JSON {error:{code,message,turnId,retryable}}; accepted 400 / 403 / 413 / 429 / 502 / 504; pre-body turnId null; accepted-SSE errors one turn.failed then close. Preserve all accepted stable server/client codes and sanitized fields, not provider raw events/headers/thinking.

## Client/module evidence versus system evidence

wire-contract-fixtures.ts contains immutable normative simulated traces, exact Atlas record/summary from Task 1 (“Synthetic active project owned by North with three open items.”), mode mock capabilities with unverified live search and malformed variants. Preamble/separator/answer trace is labeled Mock/Contract Simulation, never a provider/live observation.

#6 tests consume this fixture instead of not-yet-delivered #5 helper. Controlled fetch yields split SSE chunks and deferred terminal; production startTurn still calls /api/turn. Real Next page/components run with explicit test-harness interception; no fake production route/fallback/provider claim. This proves client parsing, rendering, generations, history and errors against agreement.

#5 keeps tests/helpers/scripted-providers.ts for complete native Anthropic messages/rounds and real createRetrievalClient HTTP deps. Emit real runTurn/producer events, decode foundation codec, assert actual emitted delta trace equals normative fixture. Preserve multiRoundDeltaFixture export as actual observed sequence or compatible re-export plus equality assertion. #6/#8 no longer depend on that unavailable helper. #5 alone claims full typed server path after actual Fastify HTTP integration.

#11 adds tests/browser/typed-system.spec.ts: actual Next BFF plus actual Fastify and explicit deterministic providers, no turn interception. Recheck incremental text/HTTP project provenance/exacttext-history/search-unavailable ordinaryuse/visible retrievalfailure/no fallback/Busy deliberate recovery. Original #6 full system browser acceptance is explicitly transferred here, not falsely passed by controlled components. Full mock-system evidence remains distinct from original real live-provider/browser acceptance.

## Exclusive files and source changes

| Owner | Exclusive files/changes |
|---|---|
| CONTRACT | shared contracts/validation/history/SSE, agreement/fixture/public tests; no server config/runtime/providers |
| #4 | server config/build-info/http admission/body/errors/leases/deadline/capabilities/runtime/capabilitiesroute/.env.example; admission/config/build/lease/slowdeadline tests; new body.test.ts separates measured-body tests |
| #6 | client turn-controller/turn-stream/history; Conversation/Answer/ProjectCard/Details/Capabilities/globals/page/layout; UI/history/controller/links/typed.spec.ts/playwrightconfig |
| CAPTURE-MODULE | voice wav/vad-adapter/capture-session; copy-vad-assets script/exact VAD patch; rootpackage-lock/ patch-package 8.0.1 postinstall / web predev-prebuild; wav/capture-module/vad-lifecycle/assets tests; no Conversation/controller/browserharness |
| #5 | server providers ModelAdapter/Claude/mock/tools/run-turn/SSEresponse/turnroute, runtime/capabilities after #4; scriptedhelper/typed integration/search/disconnect; consumes shared SSE |
| #7 | deepgram.ts SpeechAdapter/speechroute/distinct provider and endpoint tests; same-owner mock/runtime/run-turn/capability/audiointegration wiring only after #5 |
| #8 | PCM/playback/speech-text/queue and Conversation/controller only after full #6 / #7 |
| #9 | capture Conversation/controller/browserharness/capture.spec.ts after #8; imports module instead of reowning patch/package/library |
| #10/#11 | Existing scopes; #11 additionally owns joined typed-system test and final contract provenance |

Required accepted authority edits before launch:
1. #2 plan mapping, new task intents, graph/ranks, AC/test ownership and epic trail gain both real new issues, preserving all original behaviors.
2. #4 removes public / pure contracts/validation/history to CONTRACT, consumes it; retains complete admission/body/deadline/lease/config/metadata. Combined input.test split into foundation public tests and #4 body.test; residual full criteria must pass.
3. #5 moves shared SSE implementation/test to CONTRACT; keeps producer/model/tool/search/retrieval/text/disconnect invariants and complete typed integration; imports/exercises fixture/codec. Still enters after full #4.
4. #6 blocker changes #5→CONTRACT, fixture dependency changes to foundation; Scope/AC explicitly separate client-contract acceptance from full system browser test moved #11. All client safeguards retained.
5. #7 retains #4 entry and #5 final serialized-wiring gate/same owner / no partial Done.
6. #9 extracts complete library/patch/assets to CAPTURE-MODULE; retains all full automatic gesture/start/stop/mute/browseracceptance after #8. Actual pinned VAD/ORT HTTP 200 / MIME / load browser smoke stays #9.
7. #8 consumes canonical fixture/waitsfull #6 / #7; #10 semantic dependencies remain; #11 adds two new children/full system test. Refresh scopes/source bindings / refinement / forecasts / ranks / dependency edges through registered procedures. Prior approvals/refinement receipts become stale, never reused.

Root/package-lock ownership moves from #9 early phase to CAPTURE-MODULE; no concurrent manifest edits by other tracks. Missing dependency requests go root for serialization. Distinct tests prevent source collisions. Foundation modules/fixture remain frozen consumer inputs; incompatible change needs reviewed amendment and coordinated revalidation.

## Capture module as a complete new story

Preserve accepted encodeWav(samples:Float32Array):Blob; CaptureToken={epoch,utteranceId,intentVersion}; exact VadCallbacks rawStart/confirmedStart/misfire/end/frame; createVad(context,acquireStream,stopStream,callbacks)→start/pause/destroy promises; CaptureSession start/mute/unmute/stop/invalidateIntent owns epoch/streams/callercontext/pending initialization. Inject valid-end WAV callback; module knows no Conversation / playback / BFF / provider and creates no second turn controller.

Module criteria: exact WAV clipping / header / 16 kHz / little-endian / 30-second limits checked against foundation parseTurn; no submission on misfire/obsolete/overlong; fresh usable stream resume; stop pending permission / model / worklet / start and admitted frame; real patched MicVAD public destroy / session / tensor release exactly once, no activation after cancel, visible cleanup failures; marker PLUS patch/package digests; pinned local VAD/ORT asset manifest / clean install / build regeneration. Controlled browser-node/ORT boundaries label simulation. Actual browser gesture dual context and HTTP asset / load / microphone / automatic turn acceptance remains #9 / #10 / #11. This extracted issue completes all its reviewed modulecriteria; original #9 does not close early.

## Executable verification strategy

Every code step follows failing behavioral test → observe expected missing behavior → minimal code → observe green. Import/setup failures are not intended red. No absent/future suite is empty-pass evidence.

CONTRACT:
```sh
npx vitest run tests/contracts/wire-contracts.test.ts tests/contracts/public-validation.test.ts tests/contracts/public-history.test.ts tests/contracts/sse.test.ts
npm run typecheck
npm run lint
npm run format:check
```
Exact limits / fields / WAV / history / schema, every UTF-8 byte / CRLF / multiline / trailing frame split, invalid turn / seq / data, literal trace and transitive browser-import boundaries. Type / docs / fixture alignment is separately reviewed.

#4:
```sh
npx vitest run tests/contracts/admission.test.ts tests/contracts/body.test.ts tests/contracts/leases.test.ts tests/contracts/config.test.ts tests/contracts/build-info.test.ts
npm run test:slow
npm run typecheck
```
Zero body/upstream reads on rejected origins; counted chunked body / cancel, third-slot rejection / settled deferred retention, provider ignoring cancellation, stalled body deadline, sanitized capabilities.

#6 keeps npm test, dedicated history/controller/links, browser --grep typed and typecheck. Actual UI with controlled transport proves first delta before deferred terminal, stale generation / duplicate seq / final mismatch excluded, partial/no-speech never enters history, safe links, Busy deliberate retry/no replay. No real retrieval / provider assertion in component acceptance.

CAPTURE-MODULE:
```sh
npm run assets:vad
npx vitest run tests/voice/wav.test.ts tests/voice/capture-module.test.ts tests/voice/vad-lifecycle.test.ts tests/contracts/assets.test.ts
npm run typecheck
npm run build
```
Actual patched library lifecycle / ORT release boundaries rather than fake destroy; WAV conformance; package patch / asset generation / module types. Browser asset/device acceptance retained later.

#5 retains all actual Fastify HTTP typed/search/disconnect/typecheck/fullsuite/lint/format checks plus consumed SSE regression; #7 full provider / endpoints / audio integration; #8/#9/#10 own complete checks. Parent reruns full owning and impacted combined delivered suites after each integration. #11 runs every original root VC / epic trail with both new children / typed-system / browser / live record validation.

All 15 spec cases remain assigned:1/11/13 #5 native orchestration/search;2 #3 exact retrieval;3 CONTRACT SSE plus #8 PCM;4/14/15 #6client guards joined by#10/#11;5/8 CAPTURE-MODULE lifecycle joined by #9 browser;6/10 #8early speech / backpressure joined in final system;7 #5/#7distinct failures with #11 UI;9 #4/#7admission;12 #10misfire / interruption with real latency;15 #4/#5/#7/#10actual settlement and final browser concurrency. Mock evidence never substitutes for live account / omitted-tool / microphone / audio / echo / latency acceptance.

## Handoff and limitations

Two extra complete stories are sufficient: CONTRACT removes browser → Claude source dependency; CAPTURE-MODULE removes browser library → playback dependency while preserving whole-story gates. More adapter/wiring splits are unnecessary; unchanged #7 legitimately remains incomplete until same-owner wiring. No reduced product baseline is proposed.

Root pins the accepted tracked amendment and owns canonical hydration, refinement, native grant and the accepted integrated source base before execution. Draft bytes have no scheduling authority. Existing #5 implementation ownership remains unchanged until canonical reconciliation. Reestimate extracted/residual tasks from exact accepted scopes; do not add extracted hours atop original tasks or promise parallelism saves total effort. Existing 41 hours / range 29–61 hours is the old planning baseline; coordination / system test transfer / renewed review may change forecast. Current #5 L / 5.5 hours remains until sanctioned refinement.

The controller manages technical/rank scheduling and reports concrete machine refusals. Source fanout remains unlaunched until its current native scope is authorized; generic parallel intent is not a machine grant.


### New-story intent drafts

CONTRACT: Beneficiary: developer implementing the browser or BFF. Capability: implement both sides against shared validated requests, normalized events and executable traces. Need: independently developed endpoints and consumers can drift in fields, framing, text and terminal semantics. Value: compatible components compose without hiding malformed inputs, stale results or false completion.

CAPTURE-MODULE: Beneficiary: person using hands-free capture. Capability: produce bounded valid utterances and stop capture resources reliably through the pinned VAD package. Need: pending permission, model initialization and inference can outlive Stop, while malformed WAV or unbounded capture prevents safe automatic submission. Value: downstream browser wiring receives attributable utterances and cancellation cannot leave microphone/model resources active.

If installed native dependencies cannot represent #7 independent entry separately from its final #5 wiring gate, hold the whole #7 until #5 strict Done. Browser #6 and CAPTURE-MODULE remain genuinely independent, so that limitation does not justify removing a blocker or partial completion.


## Estimated effort redistribution

These allocations move existing work rather than counting extraction twice. Preserve the accepted 41-hour planning basis and 29–61-hour original range; parallelism changes possible elapsed scheduling, not the effort sum. Canonical estimates/forecasts remain root-owned until accepted hydration. Additional contract coordination, renewed reviews, conformance fixtures and joined typed-browser integration have a planning allowance of 2 hours (range 1–4) beyond that basis, making the amended working forecast 43 hours and indicative range 30–65 before provider/account delays. This is a disclosed estimate, not measured effort or savings.

| Deliverable | Redistribution of accepted expected hours |
|---|---:|
| #3 workspace/retrieval | 3 |
| CONTRACT | 2 (1.5 from old Task2; 0.5 from old Task3) |
| #4 BFF admission | 2.5 |
| #5 Claude/tools | 5 |
| #6 typed client | 3 (0.5 joined-system browser work transferred to #11) |
| #7 Deepgram | 3 |
| #8 playback | 5 |
| CAPTURE-MODULE | 3 (extracted from old Task7) |
| #9 capture UI integration | 2 |
| #10 interruption | 5 |
| #11 evidence/tutorial/joined typed browser | 7.5 |
| Accepted-scope subtotal | 41 |
| New coordination/conformance/review allowance | 2 |

The eight-hour baseline budget and six-hour owner check-in remain timebox observations; this forecast makes no full-scope one-day promise. At the next checkpoint list open requirements/verifiers without weakening them.

## Detailed contract foundation execution

**Story Intent:** Beneficiary: developer implementing browser or BFF; Capability: implement both sides against shared validated requests, normalized events and executable traces; Need: independently developed endpoints/consumers can drift in fields, framing, text and terminal semantics; Value: independently tested components compose without malformed inputs, stale results or false completion.

**Files:** Create the exact shared modules, docs/contracts/voice-bff-v1.md, tests/helpers/wire-contract-fixtures.ts, tests/contracts/wire-contracts.test.ts, public-validation.test.ts, public-history.test.ts and sse.test.ts listed above. Modify no server/config/provider/UI code or root manifests. Consume the delivered #3 ProjectRecord/ProjectCatalog shape, with no runtime fixture import into browser production code.

**Interfaces:** Export all public types above from contracts.ts. Export AppError class there with readonly httpStatus/code/turnId/retryable and inherited message; validation throws this one class. Export validateProjectCatalog(value:unknown):ProjectCatalog, validateCapabilities(value:unknown):Capabilities and validateTurnEvent(value:unknown):TurnEvent from validation.ts, alongside parseTurn/validateSpeech/validateHistory. Public validators clone validated inputs, reject additional fields, nonfinite/noninteger usage or seq, wrong schemaVersion/literal enums and malformed UUIDs. Project openItems must be a nonnegative integer, status one of active/paused/complete; names/summary/owner/id are strings. Capabilities segmentChars is positive integer <=120, literal backlog/water values exact; models/build IDs/reasons are string or null; no key-like extra fields. Source URLs are strings at the wire boundary; #6 safe URL rendering separately blocks unsafe schemes. SSE validates envelope and payload with these exports.

- [ ] Add one exact fixture in wire-contract-fixtures.ts, with fixed UUID 11111111-1111-4111-8111-111111111111, accepted seq0 mode mock, answer deltas ['Let me check Atlas.','\\n\\n','Atlas is active, owned by North, with 3 open items.'], exact Atlas catalog tool.completed and complete final text equal to their join. Use the delivered fixture values, not a separate invented catalog. Export wireTurnId:string, wireDeltaFixture:readonly string[], wireEvents:readonly TurnEvent[], mockCapabilities:Capabilities and invalidWireValues:readonly unknown[]. The fixture prominently labels Mock/Contract Simulation and search configured/pending or unavailable, never verified live account success.
- [ ] Add and observe red behavioral validation tests: allowed fields/boundaries; duplicate multipart fields; both/neither text/audio; 2000/2001 text; 8/9 messages; 16000/16001 JS-string history; malformed UUID/JSON; empty PCM accepted for later no-speech; exact 480000-sample PCM accepted, next sample rejected; unknown valid padded WAV chunk skipped; duplicate/truncated fmt/data rejected. The wire parser receives already bounded bytes and independently rejects >2MiB; #4 still owns streaming counted reads before it.
- [ ] Implement parseTurn using new Request with only bounded bytes and contentType, then FormData; only turnId/history and exactly text or audio. Validate MIME boundary, string fields, JSON history and WAV structure; text turn strips no meaningful text and rejects empty input. Reject non-audio File types/extra inputs rather than trusting MIME alone. Speech validation uses exact fields UUID/nonempty segmentId <=80/nonempty text<=supplied positive integer cap<=120. Own malformed-request AppError400 and body-size AppError413 only; paid admission remains #4.
- [ ] Add public-history red assertions, then implement the exact retainPairs algorithm below. Inbound validateHistory requires alternating user/assistant pairs, <=4 pairs/eight messages/16000 chars and never trims. Retention clones each message; oversized newest pair is omitted with notice while preserving previously valid pairs. Do not mix generation ownership into this pure module.

```ts
export function retainPairs(input:ReadonlyArray<readonly [HistoryMessage,HistoryMessage]>) {
  const pairs:Array<[HistoryMessage,HistoryMessage]>=input.map(p=>[{...p[0]},{...p[1]}]);
  const size=(p:[HistoryMessage,HistoryMessage])=>p[0].content.length+p[1].content.length;
  if(pairs.length && size(pairs[pairs.length-1])>16000) return {pairs:pairs.slice(0,-1),omitted:true};
  while(pairs.length>4 || pairs.reduce((n,p)=>n+size(p),0)>16000) pairs.shift();
  return {pairs,omitted:false};
}
```

- [ ] Add SSE red conformance test, then codec. encodeSse uses UTF-8 'event: '+type+'\\ndata: '+JSON.stringify(event)+'\\n\\n'; no provider raw blocks. decodeSse uses streaming TextDecoder, handles LF/CRLF, joins multiline data with newline, ignores comment lines, requires event field (if present) match envelope type, validates JSON/event shape and fixed turnId/seq0/+1. At least one turn.accepted starts a stream; at most one turn.completed/turn.failed terminal; EOF before terminal produces a disconnected client condition, never synthetic complete. Final unterminated frame is decoded and validated, not silently discarded. Reject events before accepted, duplicate accepted, sequence gaps/duplicates, mixed IDs and post-terminal events. Abort/disconnect remains consumer-owned.

```ts
it('preserves a simulated trace at every UTF-8 split',async()=>{
  const bytes=concatBytes(wireEvents.map(encodeSse));
  for(let at=0;at<=bytes.length;at++) {
    const actual=[];
    for await(const event of decodeSse(chunks(bytes.slice(0,at),bytes.slice(at)))) actual.push(event);
    expect(actual).toEqual(wireEvents);
  }
});
```

concatBytes/chunks are local helpers in sse.test.ts: concatenate Uint8Arrays without reencoding, and an async generator yielding each provided byte chunk. Add emoji/CRLF/multiline and trailing-frame fixtures; run one-byte-chunk and every two-way split tests. Invalid fixture tests prove malformed payloads/seq/terminal behavior reject, not merely roundtrip implementation output.

- [ ] Add public dependency-boundary tests that follow local static imports/exports recursively from all four shared entry files and reject server/, node: imports, provider SDKs and secret-bearing config. Public modules may use standard web APIs/types only; NodeJS.ProcessEnv and Anthropic native types are server-only. Browser build/typecheck checks actual import compatibility; a lexical test alone does not prove bundle contents.
- [ ] Run the exact CONTRACT verifiers above, inspect nonempty test output and diff, commit under its assigned real issue. Controller integrates reviewed source and freezes shared agreement bytes/digest, fixture and validator version before consumer fanout. Record that digest in docs/contracts/voice-bff-v1.md and consumer review evidence; hashing excludes the doc's own digest field to avoid a circular self-hash. Contracts source/fixture files are the hashed inputs, sorted paths plus bytes.

**Full AC/VC:** Foundation passes all public schemas/boundaries, history/SSE and import restrictions, exact normative docs/types/fixtures agree, no provider/upstream call exists, and scoped typecheck/lint/format pass. Independently earn canonical Test, independent code review, approved delivery and Close. No claim that real BFF or browser/provider end-to-end is already working.

## Detailed producer and consumer conformance execution

### #4 BFF boundary

**Files:** The exclusive table above is exhaustive for public extraction; server-only Task2 files/slow tests remain. Create tests/contracts/body.test.ts instead of the old combined input.test.ts. ServerConfig exact fields: mode; allowedOrigins/allowedHosts ReadonlySet<string>; anthropicKey/claudeModel/deepgramKey/sttModel/ttsModel:string|null; retrievalBaseUrl:string; searchEnabled:boolean; searchToolVersion:'web_search_20250305'; speechCharsPerSecond/segmentChars/turnTimeoutMs/retrievalTimeoutMs/speechTimeoutMs:number. loadConfig(env:NodeJS.ProcessEnv):ServerConfig. http/errors.ts reexports shared AppError and owns common JSON conversion; no second error class.

- [ ] Read frozen contracts before code. Add rejected-origin getter-spy tests and counted chunked body tests; observe missing behavior; implement canonical Origin.origin===suppliedOrigin, HTTP(S), allowed Origin with origin.host===Host, allowed Host and ignored forwarded headers. Reject Origin null/missing/malformed before reading body/lease/upstream. GET capabilities validates Host only. Start turn deadline after admission before measured body read.
- [ ] Add leases/deadlines red tests; implement separate two-slot pools, idempotent release, result versus settled split. runWithDeadline<T>(ms,caller,work):{result:Promise<T>;settled:Promise<void>;signal:AbortSignal}; export deadlineRemainingMs(signal):number using monotonic registry, Infinity only for unregistered direct-module tests. Provider ignores cancellation test proves slot remains held; body stall cancels reader with turnId:null and zero upstream calls. Handle all late errors.
- [ ] Retain sanitized environment/default config, build metadata and Host-only no-store capabilities checks. No live-success from config. Run #4 exact scoped suite plus slow/typecheck/lint/format and canonical lifecycle. Full admission delivery imports complete public validation, with no public types still missing.

### #5 BFF producer

**Interfaces:** Native Anthropic.MessageParam/Message blocks remain in server/providers/contracts.ts. ModelAdapter.runRound(input:{messages:Anthropic.MessageParam[];searchRemaining:number;searchEnabled:boolean;maxTokens:1024},signal):AsyncIterable<ModelEvent>; ModelEvent text/source/round union remains accepted. runTurn(input:TurnInput,deps:{model;lookup;transcribe;mode;capabilities},signal):AsyncIterable<TurnEvent>. createRetrievalClient(baseUrl:string):(name:string|undefined,signal)=>Promise<ProjectCatalog>. Do not move server tool/native types into shared modules.

- [ ] Add actual producer conformance in tests/integration/typed-turn.test.ts: start actual Fastify app at ephemeral loopback origin; ScriptedModel emits native preamble tool_use and end_turn answer; real retrieval client gets exact catalog; runTurn emits events encoded by encodeSse and decoded by decodeSse. Assert emitted delta sequence equals wireDeltaFixture, seq accepted0/+1, final text equals join, actual tool-result ID/provenance and no transcript function call for typed input. Do not stub runTurn itself to pass agreement.
- [ ] Retain all existing tests for 3 rounds/4 custom attempts/exact-four final answer/excess batch truncation/1024 tokens, unchanged native blocks and pause continuations, shared search2 accounting, unknown/contradictory usage disables more search, disabled/configured/verified/unavailable states, explicit rejection without replay and hidden fallback exclusion. Official SDK maxRetries0; validate real Models capability separately from account search success.
- [ ] Preserve one accumulator: append each delta once; within-round no invented separators; later first nonempty text emits standalone two-newlines only if previous text exists without trailing whitespace; final native text is never appended twice. Keep helper multiRoundDeltaFixture as observed producer sequence or compatibility reexport with actual equality test. Foundation fixture does not prove producer correctness on its own.
- [ ] Actual POST turn route: admission → deadline → counted body/parse → lease → normalized SSE; pre-stream JSON common error, one turn.failed after accepted SSE; producer/upstream settlement retains lease. First delta visible before deferred round finishes; disconnected request never paid-replayed. Run typed/search/slow/conformance/typecheck/lint/format and full available suites, then whole-story gates.

### #6 Browser consumer

**Interfaces:** Preserve TurnToken{generation,turnId}, TurnController begin/current/attachAbort/cancelCurrent/apply, HistoryStore complete/messages and startTurn exact accepted signatures. HistoryStore uses shared retainPairs and injected isCurrent, never calls server imports. startTurn builds multipart and fetches same-origin /api/turn, iteratively decodes shared codec, validates token/seq and accumulated final text. Production code contains no controlled provider/retrieval fallback.

- [ ] Add controller/history/UI red tests fed wireEvents, including duplicate/gapped seq, mismatched IDs/final text, old Atlas after Beacon, failed/truncated/interrupted/no-speech/pre-transcript, oversized pair notice and unsafe HTTP schemes. Implement current-generation atomic complete only; retain display after speech failure/mute. Decode failures show explicit error and allow deliberate new question without reconnect/replay.
- [ ] Run actual React page in tests/browser/typed.spec.ts with test-only Playwright route interception on /api/turn and /api/capabilities, or injected test transport only in harness. Label visible Mock/Contract Simulation. Yield first delta then defer terminal; prove early text, collapsed trace, exact cards, safe links, deliberate Busy retry and Strict Mode no effect-based duplicate paid calls. Browser consumer result is client-contract acceptance only. No assertion that a fixture card proves HTTP retrieval.
- [ ] Add tests/ui/conversation.test.tsx and history/controller/links suites using fixture imports from tests/helpers only. No production import of tests or sibling server internals. Run declared #6 suite/browser typed/typecheck/lint/format and canonical gates. The original real-process typed acceptance is owned by #11 below.

## Detailed complete capture module execution

**Story Intent:** Beneficiary: hands-free capture user; Capability: produce bounded attributable WAV utterances and stop resources reliably; Need: late permission/model/inference can outlive Stop or allow malformed/unbounded capture; Value: downstream wiring receives valid utterances without leaving microphone or model resources alive.

**Interfaces:** Keep encodeWav(samples:Float32Array):Blob, CaptureToken and VadCallbacks/createVad above. Explicit module constructor to remove UI dependence: CaptureSession(deps:{createContext:()=>AudioContext;acquireStream:()=>Promise<MediaStream>;createVad:typeof createVad;onUtterance:(token:CaptureToken,wav:Blob)=>void;onStatus:(reason:string)=>void}). Session exposes start/mute/unmute/stop/invalidateIntent and isCurrent(token):boolean. The Start handler later supplies/resumes its caller-owned context in the synchronous gesture through createContext; module never creates a playback context. onUtterance only signals a valid complete current capture; #9 owns actual BFF submission. onStatus uses explicit module reason strings for permission/load/overlong/cleanup failure, mapped visibly by #9.

- [ ] Add WAV red tests for clipping/extrema/RIFF44/little-endian/16kHz/empty/excess; implement exact headers and Math.round negative*32768/positive*32767. Convert produced Blob to bytes and wrap multipart for shared parseTurn in wav.test.ts. Valid max-duration encoding parses; invalid/excess rejected; no empty submission.
- [ ] Add lifecycle red tests against actual pinned MicVAD module, controlled model/ORT/browser-node factories: allocated-never-started, pending model then Stop, worklet reject, pending worklet success then Stop, concurrent destroy, admitted frame inference unresolved. Apply narrow patch to dist/real-time-vad.js/d.ts only: cached disposal, destroyed-before-await guards, frame accounting, late stream/node stop and finally model.release once including ORT session/state/sample-rate tensors. Test waits for frame settlement, refuses new frames/listening after cancel, cleanup failures visible and fresh Start succeeds. Public static lifecyclePatchRevision='aivc-vad-lifecycle-v1' plus patch/applied-file digests are mandatory. Never access private model fields from adapter.
- [ ] Implement owned tracks WeakSet/idempotent stop, acquire/resume fresh stream constraints mono/echoCancellation/noiseSuppression/autoGainControl, epoch/intent snapshots and synchronous rawStart capture token. startOnLoad:false; model:v5; AudioWorklet; minSpeechMs400; redemptionMs800; preSpeechPadMs800; thresholds .3/.25. Model creation after Stop destroys without starting; pending start is destroyed before awaiting it. Overlong 30s counting includes pre-roll; discard/restart before unbounded buffer; zero utterance on misfire/obsolete/overlong; one callback per valid current end. Preserve raw/confirmed/misfire callbacks for later interruption logic.
- [ ] Add copy-vad-assets.mjs using createRequire.resolve actual package roots; require local worklet, silero_vad_v5.onnx and required ORT wasm/mjs; write version/upstream/file/patch/module SHA256 manifest and ignore copied outputs. root assets:vad and web predev/prebuild regenerate; postinstall patch-package --error-on-fail. No CDN/latest loads. Module assets tests compare actual files/digests; clean npm ci/build exercises applied patch. Browser HTTP/MIME/actual model load stays #9, so no simulated asset test is counted as that acceptance.
- [ ] Run module-specific WAV/capture-module/vad-lifecycle/assets/typecheck/build/lint/format suites. Commit complete library/patch/assets under assigned real issue; independent review and canonical Test/delivery/Close required. No Conversation/turn-controller/Playwright harness changes here.

## Remaining integration deliveries and final acceptance

#7 retains entire accepted Deepgram SDK/STT/TTS provider+speech endpoint delivery. Its exclusive concurrent files are deepgram.ts with SpeechAdapter signatures, speech route and distinct tests. STT empty transcript never invokes model. TTS BinaryResponse.stream() inspected rawResponse/type, exact audio/l16 media type and rate24000/channels1 if supplied, duplicate/malformed params/JSON/missing-body fail before PCM. Explicit maxRetries0 and deadlineRemainingMs bound every request. After #5 strict integrated delivery the same genuine #7 owner wires mock/runtime/run-turn/capabilities/audio-turn tests; no partial CodeComplete. If native phase entry cannot represent this, hold #7 until #5 Done; this does not block #6 or CAPTURE-MODULE.

#8 retains complete PCM/playback/speech-text/queue plus Conversation/controller wiring after full #6/#7: every split sample, pending byte, 24kHz audio-clock ledger for current/future/unscheduled PCM exactly once, high10/low2/segment6/backlog2400, prompt active-response drain, emergency overrun/stall3s teardown with text retained. SpeechText split-invariant decimals/Dr./U.S./URLs/partial markup, early 'Hello. Next' and finish once complete/truncated remain. Queue reads canonical wireDeltaFixture; no dependency on future provider helper. Retain base exact Playback/PcmDecoder/SpeechText/SpeechQueue interfaces and all tests.

#9 becomes full capture UI integration after #8+CAPTURE-MODULE. Import delivered library; Start synchronously creates/resumes distinct playback/capture contexts before permission; no effects start capture/work. Wire onUtterance through the same current turn controller and bounded /api/turn path; independent mic/output mutes, Stop/unmount/Strict Mode and overlong restart remain. Actual pinned VAD/ORT assets HTTP200/MIME/browser load smoke required; simulation labeled separately. Own tests/voice/capture-session.test.ts for conversation wiring and tests/browser/capture.spec.ts; do not re-own module test/patch/manifests.

#10 retains original complete interruption scope: raw-start reversible playback suspension and paused queue, Working slow lookup preserved, real-start confirmed during speech invalidates answer but retains valid capture token, later end submits exactly once; misfire before confirmation resumes same generation only. Candidate epoch/utterance/intent plus answer generation prevent obsolete/confirmed/watchdog/typed/muted callbacks restoring or submitting. Async suspend/resume serialization and ensureRunning/resetAfterCancel failure states remain. Synthetic callback-to-silence<=200ms is tested local browser timing, physical latency reported separately live.

#11 consumes every fully delivered child and adds tests/browser/typed-system.spec.ts with actual Next BFF and actual Fastify plus deterministic server providers; no /api/turn interception. Assert streamed text before finish, exact real HTTP cards, accumulated/history equality, search-unavailable ordinary lookup, unavailable retrieval visible with zero hidden fallback and Busy deliberate recovery. Implement typed consumer/producer compatibility regression at joined boundary; repeat all public conformance after combined integration. This proves explicit Mock system behavior, still separate from real provider/microphone acceptance.

Final #11 keeps production build/served buildId and sourceDigest+patchDigest+appliedModuleDigest/observed marker provenance; read-only verify:live refuses missing/mock/stale/omitted/fail/unverified cases, records real versions/models/browser/sample-method counts, no invented passing report or retries. Identical rebuilt code or docs-only descendants can validate without original .next; patch/module/source change cannot. Before live exercise clean-build from verified applied module then npm start exactly two production processes. Real L1–L8: Atlas automatic text/card/voice; completed-history owner followup; confirmed Beacon plus short Speaking/Working misfire; normal full multi-sentence audio/latency; optional transcript/typed/mutes; actual search plus omitted-tool unchanged prior-block pause or explicitly unavailable search-off capability; headset/speaker echo; Stop/unmount teardown. Uninduced required provider pause or unresolved speaker echo remains unverified/failing. Required STT/TTS incremental bytes and real local SSE before completion remain.

### Full 15-case ownership

| Spec case | Automated owner | Final observed/live obligation |
|---|---|---|
| 1 tool IDs/typed lookup/invalid args | #5 producer, #11 joined browser | Actual Claude Atlas tool/result |
| 2 exact retrieval/missing/malformed | #3 | Separate HTTP service visible |
| 3 split SSE/UTF8/PCM | CONTRACT codec, #5 producer, #6 consumer, #8 PCM | Actual incremental SSE/TTS bytes |
| 4 stale cards/text/audio | #6/#8/#10 and #11 joined | Confirmed Beacon interruption |
| 5 automatic VAD end | CAPTURE-MODULE and #9 | Real microphone no transcript action |
| 6 speech before completion | #8/#11 | Correlated first text/TTS/model finish |
| 7 distinct failure states/text retained | #4/#5/#7/#6/#11 | Actual configured-provider observations |
| 8 Strict Mode/Stop/unmount | CAPTURE-MODULE/#6/#9/#10 | Real device release/no duplicates |
| 9 Origin/Host pre-body no work | #4/#7 | Deliberate headed HTTP/browser checks |
| 10 fast PCM/backpressure/emergencies | #8/#11 | Full real multi-sentence voice ledger |
| 11 search/pause budget | #5 | Actual omitted-tool unchanged-block pause or explicit unverified |
| 12 misfire/confirmed latency | #10 | Headset/speaker and callback/acoustic timing separately |
| 13 unavailable search ordinary use | #5/#6/#11 | Actual model/account state with reason/search-off lookup |
| 14 complete-only history | CONTRACT/#6/#10/#11 | Completed-text followup after speech interruption |
| 15 rapid interruption/Busy/unsafe links | #4/#5/#7/#6/#10/#11 | Real cancellation settlement/Busy deliberate recovery |

### Final root verification and delivery

- [ ] Root imports each reviewed complete child from its own binding; inspect scoped commit trail and contract digest. Rerun owning plus impacted combined suites after each integration; failure returns to owning child, no partial accepted delivery.
- [ ] #11 runs npm test, npm run test:contracts, test:integration, test:voice, test:slow, test:browser, typecheck, build, lint, format:check, verify:docs, verify:live. Root #2 runs node scripts/task-tracker/verify-epic-trail.mjs with both new real children included. No future/absent lane may empty-pass. Each AC retains original vc1–vc13 citations and new child-specific declarations are explicit, independently stamped at canonical Test.
- [ ] Root performs whole-branch independent review, then required approval/delivery/Close gates individually; no child or parent Done from mock-only system output. Parent AC/DoD waits all child gates and honest live evidence. This amendment does not write those markers.

## Contract freeze and canonical hydration checklist

- [ ] Complete normal-commit Sol6.1/high author → distinct Astra/high SPR → same-author ClaudeOpus5.5/high XPR; preserve actual review IDs, sealed evidence and authority-assurance limitation.
- [ ] Root pins accepted amendment path/revision/hash in #2; creates exactly CONTRACT and CAPTURE-MODULE through governed create-issue (no guessed numeric IDs); binds full Story Intent/Scope/AC/VC/source-plan/estimates.
- [ ] Root atomically reconciles source scopes/ranks/dependency metadata for #4–#11, new issues and parent epic graph. Refresh refinement/deep dive/plan approval through current registered actions; old receipts/approvals cannot authorize changed scope.
- [ ] Root records current human parallel scope through native rank-wave authority with exact real rank4 membership and genuine occupancy; no grant exists by writing this plan. All lower ranks strict Done and active other-rank exclusion remain. Parent owns scheduling details; user need not interpret internal IDs.
- [ ] CONTRACT completes independent lifecycle and freezes source/fixture digest. Browser and BFF owners inspect same frozen agreement before code fanout; no request/response/event changes by unilateral consumer edits.
- [ ] An incompatible contract deviation stops impacted consumer work, receives compatibility review and regenerated fixtures/tests, refreshed current scope/digests and rerun producer/consumer/joined tests before renewed fanout. Compatible internal server changes still preserve public conformance and private-key boundary.

## Author self-review and review handoff

Self-review checked accepted specification/base/runtime amendment, exact public/private boundaries, eleven complete deliveries with no fabricated Fastify work, all fifteen cases, exact pins, named new stories, graph/wiring/ownership, estimate subtotal41 plus disclosed allowance, truthful simulated/live distinction and current native admission limitation. Historical artifacts remain byte-identical. This amendment has no source changes, issue mutation, lifecycle grant or claimed application verification.

Requested review ladder: normal-commit manual SPR, issue2, author codex gpt-6.1-sol/high and distinct reviewer codex gpt-6-astra/high; then XPR same author with package-launched claude-opus-5-5/high. Archive under docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/{spr|xpr}/contract-first-parallel-amendment. Authentic MCP wait_for_handoff uses actual reviewID/role/last sequence; root supervises. Generated authority assurance remains unavailable unless actual runtime evidence changes it. No package-managed automatic-required claim.
