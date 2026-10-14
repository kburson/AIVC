# #6 typed browser implementation and test summary

Verified product source: `421acd1b76848165fa276c48ca2360030361e579` on `codex/6-draft`, based on accepted foundation `6c64bfefc3db5bc19929e774aa8c7e3def282c19`. This summary is documentation-only collateral committed after that verified source. Existing Scope, AC and Test proofs cite the source SHA; they are not relabeled as proof for this document's later commit. Root explicitly deferred fresh documentation-head metadata to the distinct review handoff.

The browser page now mounts one typed Conversation under a server shell. Its controller aborts old work, ignores stale generations and uses the immutable event grammar to reject duplicate/gapped sequence, mixed IDs and mismatched completed text. The production multipart transport validates frozen body/history/WAV limits and decodes the shared SSE codec. It never reconnects, replays or automatically retries Busy/429 failures. Partial text remains readable; only current validated complete turns enter immutable whole-pair history. History retains four pairs/16,000 JavaScript characters, omits an oversized newest pair with a visible notice and clears on refresh.

Safe Markdown disables raw HTML and image requests and permits credential-free absolute HTTP(S) links. Project cards consume validated catalog events. Labeled controls, live status, capability reasons and collapsed normalized details are delivered. Speech failure/mute/interruption does not erase completed text. Capture/playback wiring belongs later serialized stories.

## New automated test inventory

| Suite                   | Cases | Selected evidence                                                                                                                                                                                                       |
| ----------------------- | ----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| history.test.ts         |    10 | Current immutable atomic pairs, all excluded terminal statuses, pre-transcript, whole-pair count/UTF16 limits, oversized omission preserving older context, frozen inbound rejection boundaries                         |
| turn-controller.test.ts |    15 | Atlas/Beacon stale work, abort, multi-round paragraphs/history, invalid grammar, repeated hints/interleaved sources/no-tool/no-speech, real multipart URL/history, decoder signals, overlimit input, Busy without retry |
| links.test.tsx          |     7 | javascript/data/relative/malformed/credential references remain text; safe HTTP(S), raw HTML exclusion and catalog fields                                                                                               |
| conversation.test.tsx   |    10 | Actual React StrictMode request count, early/deferred terminal, completed history after mute, explicit partial-failure reasons/deliberate retry, excluded statuses, stale Atlas and oversized notice                    |
| typed.spec.ts           |     5 | Actual Chromium page: early text/cards/details/history/refresh; Busy/StrictMode; safe links; Stop; positive same-origin transport and foreign-origin distrust                                                           |

The 47 cases comprise 42 offline contract/component cases and five actual Chromium cases. The harness exists only under tests and is visibly Mock/Contract Simulation. Fixture cards do not prove HTTP retrieval; no provider or foreign network request is made. Joined actual Next/Fastify HTTP acceptance and final system/live evidence remain #11.

TDD behavior failures preceded the history/controller/link/React implementations. Independent final checks passed unit34/34, contracts169/169, targeted contracts32/32, browser5/5, slow1/1, build, typecheck, lint and format. The five-file frozen digest remains `ef4409385e545e82b91fcd44caaab02e457e8af9404d5abba3f07b8956a1d58c`.

## Exact source receipts

Develop-final receipt `01M4VV57TRH1KR1H8FQBS9BPDT` at source421 completed2026-10-13T23:56:55.512Z with lint/format exit0. Test receipt `01M4VV7JM4YF8QXF34S2V7X73W` at the same source completed2026-10-13T23:58:12.100Z with unit/integration/slow/targeted contracts/typed browser/typecheck/build/gitlog exit0 and properly reused Develop lint/format. Its clean isolated worktree used pinned npm-ci and Node26.8.1. A final timing-field GraphQL TLS timeout made the first CLI return1 after proof creation; one normal supported retry validated/reused the current receipt and returned0. No proof was fabricated.

All ten individual operator-inspection Scope records and the AC were refreshed at source421; Functional tests/lint/commits were machine-backed. Operator inspection is distinct from independent code review. Current source Review Explain reported `review-preflight-refused` category `acceptance-evidence` without additional diagnostic messages. Root owns that diagnosis and all new documentation-head proof refreshes.

[Draft PR16](https://github.com/kburson/AIVC/pull/16) targets `codex/2-draft`; accepted #3/#13 and #4 deliveries await prerequisite PR integration into the feature baseline. Independent review and merged-PR delivery remain pending before Done. No local merge-back, Review/Close, unrelated source/manifest/provider/capture changes, or live-provider success is claimed.
