# #5 offline verification checkpoints

## Producer checkpoint

The initial callable skeleton failed all 15 behavioral assertions; the real producer implementation then passed all 15 tests in `tests/integration/typed-turn.test.ts`. This proves real Fastify HTTP retrieval, exact native tool results, normalized producer codec/fixture conformance, budgets, native pause continuation, visible stop failures, and literal text/citation handling. Usage in the fixture is scripted simulation, not paid-provider evidence.

`npm run typecheck` currently fails in the inherited `tests/scripts/quality-scans.test.ts` at lines 85, 100, 106, 111 and 117: the imported formatter options type does not declare `paths`. No #5 file was named in this typecheck output. This was reported to the epic orchestrator; this is an unresolved failure, not a passing receipt.

Whole #5 SDK/search, endpoint/settlement, full verification, independent review, merge and Close remain pending. The cloud draft PR does not claim completion.

## SDK/search checkpoint and compatibility ruling

Official Anthropic SDK 0.133.0 is exercised through controlled offline HTTP responses, including native streaming, citations, final usage, hosted-search capability/account state transitions, explicit rejection, omitted-tool continuation, and maxRetries0 behavior for 429/503 responses. The HTTP harness initially omitted the provider event labels; the real SDK rejected empty chunks. Correct provider event/data framing resolved the harness failure. No live provider call or account verification is claimed by this simulation.

The combined producer/search/SSE/quality-tool tests pass: 87 tests in four files. `npm run typecheck` now passes both workspaces. Root authorized `scripts/format-check.d.mts` as an exclusive narrow #5 integration bridge: the runtime already accepts paths, while allowJs inferred an options type that omitted it. The declaration reflects inspected exported APIs, preserves the evidence-verifier reexport, and changes no #25 behavior, tests, exclusions or pins. Cost if wrong: declaration/runtime drift. Independent review must check this ruling.

Endpoint, cancellation settlement, complete lanes and independent review remain pending.

## Endpoint and settlement checkpoint

The actual typed turn endpoint now wires admitted counted parsing, lazy provider construction, turn leases and incremental SSE. Nine endpoint/settlement tests pass, including real Fastify HTTP with the production Mock adapter, first delta before delayed native settlement, request abort, reader cancel, and deadline failure. The ignored-upstream tests retain occupied slots until the producer settles, reject concurrent admission while those slots remain held, and allow recovery afterward. No runTurn stub or provider replay is used.

The full integration build initially found TypeScript errors in the new slow-test environment and deferred-gate helper types. Those test types were corrected without exclusions or suppression. Typecheck and lint now pass. The focused producer/search/disconnect tests pass 58 assertions. New failing tests caught duplicate native tool identifiers dispatching HTTP twice, first-turn pending capability suppressing confirmed search, and concurrent metadata checks admitting Messages before support confirmation. All three now pass after the corresponding producer/adapter repairs.

Full available lanes, browser regression, clean production verification, independent review and cloud merge remain pending at this checkpoint.

## Whole source delivery verification

Source implementation is complete at `b49bad1e70f5f9118ce73c5e67269138a9654ebe`. Source work began from `f51245f20df436fb5325db3b5b1b85c778a23a90`; the branch subsequently preserving-merged feature parent `88f8b37b318cb41f3669fc1949d17cd02638963b`. These are source/dependency references, not fabricated native Test receipts. The final documentation commit is reported separately in the review handoff.

| Command                                                                            | Observed result                                                                                  |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `npm run test:integration`                                                         | 23 passed in 2 files; actual production build and two-process HTTP/shutdown integration included |
| `npm run test:contracts`                                                           | 277 passed in 17 files                                                                           |
| `npx vitest run tests/contracts/search-budget.test.ts tests/contracts/sse.test.ts` | 69 passed: 32 search and 37 frozen SSE assertions                                                |
| `npm run test:slow`                                                                | 15 passed in 3 files, including 13 endpoint/settlement assertions                                |
| `npm run test:voice`                                                               | 48 passed in 3 files                                                                             |
| `npm test`                                                                         | 42 unit assertions passed in 10 files; this script is not the whole inventory                    |
| `npm run test:evidence`                                                            | 9 Node test assertions passed                                                                    |
| `npm run typecheck`                                                                | Both workspaces passed                                                                           |
| `npm run lint`                                                                     | TypeScript and Markdown passed                                                                   |
| `npm run format:check`                                                             | Passed, zero findings; final documentation is checked again before commit                        |
| `npm run build:clean`                                                              | Clean optimized Next and retrieval TypeScript builds passed                                      |
| `npm run test:browser`                                                             | 5 Chromium typed-client regressions passed                                                       |
| `npm run verify:sealed-evidence`                                                   | 74 original documents verified against historical Git blobs                                      |
| `git diff --check origin/codex/2-draft...HEAD`                                     | Passed                                                                                           |

Playwright generated a disposable ignored status JSON that the inherited formatter scans. Its status was passed with no failed tests. Removing that generated file after the browser run restores the formatter lane without changing its behavior, exclusions or evidence archives. No generated assets or raw logs are source authority.

## Scope and acceptance coverage

- The actual producer preserves complete native assistant blocks and matching custom tool IDs/results, validates argument shape before HTTP, returns native is_error continuation for rejected arguments, counts rejected attempts against the four-attempt cap, and rejects duplicate/reused identifiers before ambiguous dispatch. Exactly four executions can reach a final answer; excessive batches dispatch nothing.
- Actual Fastify HTTP supplies validated project cards through the fixed loopback-origin retrieval client, five-second composite deadline and URLSearchParams. Unavailable, malformed and injected-query cases are visible and cannot substitute a fixture.
- Official SDK 0.133.0 owns streaming Messages with maxRetries0, native pause messages, 1,024 output tokens, three calls maximum, final usage accounting, native hosted-search blocks, safe cited-source metadata and a shared two-use search budget. Missing/contradictory accounting disables later search; omitted-tool compatibility failures truncate without replay.
- Model metadata is confirmed before Messages, including the first pending-capability turn and concurrent cold rounds. Model support alone remains configured/pending. Explicit model/tool/account rejection makes process search unavailable, and an in-flight successful search cannot erase that rejection. Ordinary later turns omit search. Mock search never claims live account verification.
- One display accumulator joins emitted deltas exactly, inserts only the specified later-round separator, never duplicates final native text, and passes full producer codec/type/data/seq conformance against the immutable wire fixture. Sources retain their actual citation metadata.
- The actual turn endpoint enforces Origin/Host, bounded parse, lease and normalized SSE. Text arrives before delayed native settlement. Reader cancel/request abort/deadline abort upstream without replay; client failure/stream closure cannot release the slot before actual producer settlement. Cold live-runtime invalid Origin, invalid Host, malformed body and pre-abort make zero Models or Messages HTTP calls and construct no adapter.
- The transcription seam produces no-speech without model work or emits one exact transcript before the model. Live STT/TTS implementation remains the subsequent #7 owner responsibility. Runtime builds only the selected live or explicitly labeled Mock adapter after admission; it never switches a failed live call into Mock.
- A TypeScript import-resolution audit walked the single client root, 12 local runtime modules and 19 import edges with zero reachability to server provider modules or the Anthropic SDK. The compiled browser regression uses controlled contract transport and is not live-provider evidence.
- The target diff contains 17 paths: nine server source files, four owned test/helper files, three authored documents, and the explicit narrow formatting declaration bridge. Frozen shared contracts/SSE/fixtures, browser/capture source, provider #7, patches, manifests, pins and #25 behavioral tooling are unchanged. The reviewed diff contains no credentials, machine bindings or raw secret-bearing logs. Accepted plan/spec/review originals remain immutable and their archive verification passes.

## Review and lifecycle handoff

The technical residual #5 Scope is implemented and its offline acceptance behavior is covered. Registered exact-head Test evidence and functional checkbox stamping, independent Astra review, Full-Auto Task Review/approval, expected-head GitHub merge into codex/2-draft, and Close remain pending under the epic orchestrator. No native Test receipt, review pass, merge or Done is claimed by these author-run checks. The open draft [PR #22](https://github.com/kburson/AIVC/pull/22) holds all selected source and collateral.

Independent review must include the root-allocated `scripts/format-check.d.mts` compatibility bridge and its declaration/runtime drift risk. The historical inherited TS2353 RED and subsequent GREEN remain above. The epic orchestrator was notified; no unrequested notification to the #25 owner chat is implied.

Live model/account verification, joined provider behavior, speech and system acceptance remain #11 evidence after whole #5/#7 integration; no credential selection or paid call was made here. The original claim remains held for supervised author/reviewer handoff. Timing has not been finalized or flushed; active/engaged durations are Unknown here. The user stop boundary remains completion of wave 4 and pause before #8.
