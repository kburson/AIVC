# Deep-Dive Analysis (2026-10-14)

## Grounded intent

The developer beneficiary needs typed questions to preserve project provenance, native tool identity and bounded continuations. The accepted selected Task 3 gives a concrete capability, need and avoided failures. All seven semantic questions pass: human stakeholder; normalized streamed answers as capability; lost IDs/pause/search accounting as need; prevented hidden replay/overrun as value; exact Scope/spec/amendment grounding; distinct server-producer responsibility from #4 admission, #6 client, #7 audio and #13 public agreement; standalone story readability. Use original accepted amendment 6eda972, base cb82f730, Node amendment 3574e5 and hydration e559f6b. #25 formatting views and original-byte archives do not replace those authority bytes.

## Files and boundaries

Own server providers/contracts.ts, providers/claude.ts, providers/mock.ts, tools/lookup-projects.ts, tools/retrieval-client.ts, turns/run-turn.ts, http/sse-response.ts, apps/web/app/api/turn/route.ts, runtime.ts and capabilities.ts, all under apps/web/server except the stated application handler. Tests are tests/helpers/scripted-providers.ts, tests/integration/typed-turn.test.ts, tests/contracts/search-budget.test.ts and tests/slow/disconnect.test.ts. Consume frozen #13 public types/validators/codec/fixture without editing them. Consume actual integrated #4 config/admission/count-body/deadline/error/lease APIs. No #6 browser, #7 Deepgram, #14 capture/patch, manifests or pins are owned.

## Implementation sequence

1. Observe a failing native-round/real Fastify HTTP producer conformance assertion before implementation. Establish server-only Anthropic contracts and scripted test helpers. Validate retrieval with the frozen catalog validator and fixed loopback origin, no local catalog fallback.
2. Implement the three-round/four-attempt/1024-token loop. Preserve native assistant blocks and exact result IDs, reject excessive batches atomically, return argument-error native results with zero service calls, and fail terminally on dispatched unavailable retrieval. Append each delta once and preserve exact separator/citation semantics.
3. Exercise shared search-two accounting and capability transitions using the real pinned SDK with controlled offline HTTP responses. Configure official SDK maxRetries0, Models.retrieve capabilities.server_tools.web_search.supported, stream incremental text/citations, retain finalMessage and final usage. Explicit rejection is unavailable/no replay; ambiguous errors never claim verification; unknown/inconsistent counts disable more search.
4. Integrate the actual typed turn endpoint. #4 admission precedes deadline/count-body/parse, then lease and SSE. Resolve the Response as soon as accepted streaming starts while the admitted callback continues awaiting the producer. Reader/request cancellation aborts upstream; release only on actual settled, never on timeout-facing result or early Response. Pre-aborted zero paid work and deferred upstream retention receive dedicated slow tests.
5. Wire process-owned runtime/capabilities and an explicitly mock adapter with no provider fallback. Leave the transcription dependency seam for #7; typed input must never call it. Finish full impacted checks, evidence and [#5] commits/PR22; root owns independent review, Test/Review, delivery/Close.

## Test evidence intent

Typed integration starts createRetrievalApp on an ephemeral loopback port and uses createRetrievalClient over HTTP. Actual runTurn events encode/decode through frozen codec and equal full normative wireEvents, only turnId normalized, fixed usage20/30/0 and seq0/+1. Search tests cover exact-four/excess batch/pause/budget accounting/model support/explicit rejection/omitted-tool compatibility and official SDK retry suppression. Slow tests prove first delta before delayed final round, cancellation lease retention and no paid replay. The existing declared root verifiers1-7 cover these requirements; no new criteria or source scope are added. Browser reachability, credential exclusion and Node build are inspected separately.

## Risks and decisions

Timeout-facing promises can settle before provider work, so both callbacks and leases retain actual settlement. Hosted search model capability alone cannot verify an account. Official native usage is final-per-round, never repeated cumulative stream updates. Retrieval client enforces loopback independently because server config validates origin form but not loopback. Controlled SDK HTTP scripts are explicitly offline test utilities; production mock mode is visible and never a live retry/fallback. All source changes wait for actual approved Develop.

## Dependency Map

Depends on: #4 complete integrated server boundaries, #13 frozen public agreement, #3 real retrieval service.
Blocks: #7 final shared wiring, #11 joined system/live acceptance; no sibling issue spawn required.

## Planned estimate

L, 5 hours retained from accepted refined whole residual scope. Test-first producer/retrieval/loop 2h, official streaming/search capability 1.5h, endpoint/settlement/runtime 1h, full evidence/checks 0.5h. No invented application results, keys, model choices or live acceptance.
