# Story 5 independent task review — round 1

Spec Compliance: PASS for the reviewed whole typed-orchestration scope.
Task quality: Approved. No Critical, Important, or Minor findings.

## Identity and scope

- Reviewer: genuine Codex session 01a13a1f-a699-76e3-a216-c6cc4ea80df3; binding generation 330d595d-b4b0-4f9b-af43-d089ec728fba. Dispatch selection: gpt-6-astra, high reasoning.
- Independent implementation author: 01a136ac-6dbb-75e1-81cd-e5d51168386f. The reviewer authored no product source, tests, fixtures, manifests, pins, or fixes.
- Issue #5; branch codex/5-draft; PR #22 targets codex/2-draft.
- Review base: 88f8b37b318cb41f3669fc1949d17cd02638963b.
- Reviewed head: 14d537945cb66f3f2bf90d95ab974120bfb1eb51.
- Source head: b49bad1e70f5f9118ce73c5e67269138a9654ebe.
- All 17 target-diff paths were reviewed from the supplied commit/stat/full-diff packet. The supplied task brief, author report, and committed verification report were inspected. Truncated tool output was recovered; no alternate Git diff or broad source crawl was used.

## Strengths and requirement checks

- Native server-only SDK contracts and the explicit loop preserve assistant blocks and matching tool-result IDs, reject ambiguous identifiers before dispatch, validate arguments, count rejected attempts, enforce three rounds/four attempts/1024 tokens, and retain the exact-four final-answer continuation. Evidence: apps/web/server/providers/contracts.ts:1; apps/web/server/turns/run-turn.ts:1; tests/integration/typed-turn.test.ts:1.
- The official adapter disables retries, uses server-controlled model/system/tools, distinguishes model support from live account verification, preserves explicit rejection against concurrent success, and shares the two-use search budget across continuations. Accounting de-duplicates stream/final IDs and fails closed on missing or contradictory counts; exhausted search is omitted. Evidence: apps/web/server/providers/claude.ts:14; tests/contracts/search-budget.test.ts:1.
- Real loopback Fastify HTTP retrieval uses a fixed path, URLSearchParams, redirect rejection, a composite five-second deadline, and schema validation without a fixture fallback. The producer conformance test exercises runTurn plus the real retrieval client and frozen encoder/decoder, comparing the complete normalized sequence with only turnId normalization. Evidence: apps/web/server/tools/retrieval-client.ts:1; tests/integration/typed-turn.test.ts:1.
- One display accumulator joins each emitted delta once, inserts the required standalone later-round separator, retains citation metadata, and never re-appends final native text. Tests cover exact fixture equality, trailing whitespace, multiple text blocks, and citation snapshots. Evidence: apps/web/server/turns/run-turn.ts:1; tests/helpers/scripted-providers.ts:11; tests/integration/typed-turn.test.ts:1.
- The actual POST route admits before body parsing and provider construction, acquires the turn lease after bounded parsing, streams accepted/delta events before final settlement, and releases only from the admitted task’s settled promise. Tests cover reader cancellation, request abort, deadlines, rejected concurrent work, recovery, and cold live-runtime rejection with zero Models/Messages HTTP. Evidence: apps/web/app/api/turn/route.ts:1; apps/web/server/http/sse-response.ts:1; tests/slow/disconnect.test.ts:1.
- Runtime selects explicit mock/live adapters lazily and keeps the transcription dependency seam honest; the production mock adapter never acts as a live failure fallback. Evidence: apps/web/server/runtime.ts:1; apps/web/server/providers/mock.ts:1; docs/implementation/5-verification.md:49.

## Named cross-component checks

- Declaration/runtime drift: scripts/format-check.d.mts:1 faithfully describes the actual exports, optional root/paths/write/log options, asynchronous numeric result, and verifyEvidenceArchive reexport in scripts/format-check.mjs:24,56,64. No behavior, test, exclusion, pin, or primary-owner source change is introduced.
- Lease settlement across the inherited boundary and official SDK: apps/web/server/http/body.ts:56 requires the callback to await work; apps/web/server/turns/deadline.ts:69 makes settled follow that work. The pinned SDK MessageStream implementation’s _createMessage awaits create/stream consumption and done awaits its end promise; its fetch timeout aborts and awaits the underlying fetch. Together with the adapter’s finally-await and the SSE callback loop, response return/cancel does not independently prove upstream settlement.
- Initial search capability compatibility: apps/web/server/capabilities.ts:34 supplies unavailable/pending for a configured live runtime; the new loop admits the pending check and the adapter resolves support before Messages. The unchanged initializer therefore already supports the required transition and needs no source edit.

## Verification limits and TDD evidence

- No test suite was rerun for this review. The supplied code and existing test cases answered the concrete concerns without an additional focused test. Canonical exact-head Test remains a separate required lifecycle gate.
- docs/implementation/5-verification.md:3 records the initial 15 behavioral RED assertions and subsequent GREEN; later checkpoints record SDK harness and test-type corrections, the declaration TS2353 repair, and regression-driven fixes. This is author-recorded TDD provenance, not an independently replayed RED history.
- docs/implementation/5-verification.md:27 records author-run integration 23, contracts 277, focused search/SSE 69, slow 15, voice 48, unit 42, evidence 9, browser 5, both-workspace typecheck, lint/format, clean builds, sealed evidence verification, and client import-boundary audit. No current reviewer test receipt is claimed.
- The full browser import graph, runtime/dependency pins, and sealed-history validation are reported author checks rather than re-executed review checks. The packet contains no manifest, pin, frozen contract, browser, capture, or #7 provider changes.
- Audio implementation remains #7. The all-15-case joined system and actual paid-provider/browser acceptance remain #11; neither this review nor mocked SDK responses claim live account/provider verification.
- This task-scoped approval does not assert canonical Test, lifecycle Review, human approval, actual PR merge, or Done. Those remain separately supervised gates.

## Assessment

The reviewed implementation meets the whole residual typed story and preserves the required ownership and failure boundaries. No defect requiring author changes was found. Proceed to the separately required exact-head lifecycle verification and integration review.
