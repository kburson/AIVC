# Story #40 bounded-story intake and live audit

Status: **29 created stories; native dependency and metadata audit passed. Application implementation remains stopped.** Requested October 17, 2026 (America/Chicago). This document records planning intake, not implementation acceptance or a package-managed delivery receipt.

## Created issue map

| Story                                            | Coordination epic | Bounded deliverable                                                        | Joint hours | Native predecessor |
| ------------------------------------------------ | ----------------- | -------------------------------------------------------------------------- | ----------: | ------------------ |
| [#71](https://github.com/kburson/AIVC/issues/71) | #64               | Move runtime ownership and private lookup policy                           |           3 | #63                |
| [#72](https://github.com/kburson/AIVC/issues/72) | #64               | Enforce core authentication and pre-body pipeline admission                |         3.5 | #71                |
| [#73](https://github.com/kburson/AIVC/issues/73) | #64               | Deliver pull-driven turn operations and SSE settlement                     |         3.5 | #72                |
| [#74](https://github.com/kburson/AIVC/issues/74) | #64               | Deliver speech operations and exact PCM cleanup                            |           3 | #73                |
| [#75](https://github.com/kburson/AIVC/issues/75) | #64               | Add request-scoped scripted adapters and invocation identity               |         3.5 | #74                |
| [#76](https://github.com/kburson/AIVC/issues/76) | #64               | Verify moved SDK abort and reader behavior against local protocols         |         3.5 | #75                |
| [#77](https://github.com/kburson/AIVC/issues/77) | #64               | Verify core refusal bounds and lifecycle ownership on real sockets         |         3.5 | #76                |
| [#78](https://github.com/kburson/AIVC/issues/78) | #65               | Own the production Next listener and request context                       |           3 | #64                |
| [#79](https://github.com/kburson/AIVC/issues/79) | #65               | Forward authenticated requests over fixed duplex upstream transport        |         3.5 | #78                |
| [#80](https://github.com/kburson/AIVC/issues/80) | #65               | Prove delegated SSE PCM and pressure parity                                |         3.5 | #79                |
| [#81](https://github.com/kburson/AIVC/issues/81) | #65               | Cut over web routes and preserve legacy regression assertions              |         3.5 | #80                |
| [#82](https://github.com/kburson/AIVC/issues/82) | #66               | Implement local service readiness and bounded drain                        |         3.5 | #65                |
| [#83](https://github.com/kburson/AIVC/issues/83) | #66               | Package three independent pinned production services                       |         3.5 | #82                |
| [#84](https://github.com/kburson/AIVC/issues/84) | #66               | Build the private provider fixture and surviving invocation ledger         |         3.5 | #83                |
| [#85](https://github.com/kburson/AIVC/issues/85) | #66               | Route each accepted request deterministically with independent attribution |           3 | #84                |
| [#86](https://github.com/kburson/AIVC/issues/86) | #66               | Provide trusted HTTPS browser ingress and isolated test topology           |           3 | #85                |
| [#87](https://github.com/kburson/AIVC/issues/87) | #66               | Implement the acknowledged host-only lifecycle channel                     |         3.5 | #86                |
| [#88](https://github.com/kburson/AIVC/issues/88) | #66               | Bound runner dispatch budgets and owned teardown                           |         3.5 | #87                |
| [#89](https://github.com/kburson/AIVC/issues/89) | #66               | Freeze scenario inventory and topology identity manifest                   |           3 | #88                |
| [#90](https://github.com/kburson/AIVC/issues/90) | #67               | Add the mandatory container acceptance entry point                         |           3 | #66                |
| [#91](https://github.com/kburson/AIVC/issues/91) | #67               | Prove A B B routing and cold replacement for every turn representation     |         3.5 | #90                |
| [#92](https://github.com/kburson/AIVC/issues/92) | #67               | Prove invocation counts SDK parity and padded WAV in containers            |         3.5 | #91                |
| [#93](https://github.com/kburson/AIVC/issues/93) | #67               | Prove real browser generation fencing and exact-owner interruption         |         3.5 | #92                |
| [#94](https://github.com/kburson/AIVC/issues/94) | #67               | Prove admission pressure policy and outage behavior through every hop      |         3.5 | #93                |
| [#95](https://github.com/kburson/AIVC/issues/95) | #67               | Prove graceful listener shutdown and unknown settlement                    |         3.5 | #94                |
| [#96](https://github.com/kburson/AIVC/issues/96) | #67               | Prove hard kill scaling and the complete production acceptance inventory   |         3.5 | #95                |
| [#97](https://github.com/kburson/AIVC/issues/97) | #68               | Freeze integrated source identities and run all regression lanes           |         3.5 | #67                |
| [#98](https://github.com/kburson/AIVC/issues/98) | #68               | Reconcile whole-change review and governed integration delivery            |         3.5 | #97                |
| [#99](https://github.com/kburson/AIVC/issues/99) | #68               | Publish research Task 0 handoff with measured limits                       |         2.5 | #98                |

All 29 issues are OPEN / Backlog, singleton owner `kburson`, Size S, and exactly the displayed native Estimate. Maximum **3.5h**, minimum **2.5h**, remaining sum **97 joint hours**. Estimates include ordinary verification/review/delivery and contingency, with explicit larger verification/review allocations in the final stories. They are planning values, not elapsed-time guarantees or new AI forecasts. At JIT Plan, split again if the complete scope cannot fit strictly below4h; never silently reduce an estimate to pass.

## Package rollups and authority

| Coordination epic                                | Created leaves | New planned rollup | Historical package estimate |
| ------------------------------------------------ | -------------- | -----------------: | --------------------------: |
| [#64](https://github.com/kburson/AIVC/issues/64) | #71–#77        |              23.5h |                         16h |
| [#65](https://github.com/kburson/AIVC/issues/65) | #78–#81        |              13.5h |                          8h |
| [#66](https://github.com/kburson/AIVC/issues/66) | #82–#89        |              26.5h |                         16h |
| [#67](https://github.com/kburson/AIVC/issues/67) | #90–#96        |                24h |                         14h |
| [#68](https://github.com/kburson/AIVC/issues/68) | #97–#99        |               9.5h |                          4h |

Coordination epics #64–#68 are native nested epics under #40, with original Scope/AC bytes preserved. Their aggregate estimates are not executable leaf stories under the four-hour ceiling. Historical board estimates/refinement/forecasts remain historical; new rollups must converge through normal JIT planning. No new Refine completion, forecast, Plan approval or Develop admission is claimed.

The original package chain #63→#64→#65→#66→#67→#68 remains. Every first leaf has the preceding package as its native blocker; later leaves have exactly the displayed preceding leaf. Native child sets match the five exact ranges above. #63 is still CLOSED / Done, closedAt `2026-10-18T01:41:42Z`, with merged [PR69](https://github.com/kburson/AIVC/pull/69). It was neither reopened nor edited by this reassessment.

## Source and review preservation

- Accepted specification SHA-256 `f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`; XPR `review-0009efb5ca6886291ad48628afa78120`.
- Accepted plan SHA-256 `eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`; XPR `review-3f99142a6b19c9dcbe0e6e53c7b1354a`.
- Both retain LOCAL JOURNAL MODE / accepted-uncommitted / assurance unavailable and separate exact-byte Git publication. The earlier `review-2bdf5dd8ee56accc6e494643054a3cf1` remains unsettled. No acceptance transfers to this new decomposition.
- Each new leaf includes both accepted hashes/review references, the uncertain predecessor, selected bounded task and publication pin, verifier citations and execution hold.
- Live read-back verifies every prior Plan Metadata URL retained on #40 and #64–#68, with unchanged original Scope and acceptance-criteria bytes. New current-decomposition sections clearly separate the leaf map, epic rollups, original package history and accepted artifacts.
- The six `*-metadata-operation.json` files in `40-under-four-hour-reassessment/` preserve the exact declarative before/after transformations used by the native issue-body command. They are operator audit artifacts, not lifecycle or acceptance receipts. They contain no credentials or machine-local binding records.
- Root package metadata/lock hashes remain `426c930a0a7e22978bac51a62c11c11819bc40911e643626a2942d5eee0d4b4f` and `833e847eff6ed26a3488659c76f7b891a85c59d7ed71460b9575d591fa94cf54`. No application dependency upgrade or implementation change.

## Native procedure and live verification

1. Read the accepted source, original open scopes/ACs, existing code boundaries and correction families. Created the [master coverage/sizing supplement](../superpowers/plans/2026-10-17-40-under-four-hour-reassessment.md) and five detailed bounded plans. Normal documentation checkpoints remain pushed on `codex/40-draft` / draft [PR61](https://github.com/kburson/AIVC/pull/61).
2. The installed split-plan helper preflight selected a missing consumer-local CLI entrypoint. No issues were created by that failed attempt. Used the documented sanctioned create-issue wrapper directly. Corrected raw verifier-list syntax and safe focused test-group names before the first creation, then preflighted every final draft.
3. Created all29 through the sanctioned sub-issue shape, with project tether, native parent, owner, explicit requested sizing, source/review metadata and per-AC verifier citations. Creation's sized-Backlog warning does not become a refinement snapshot; user-requested sizes remain provisional intake values.
4. Used genuine orchestrator bindings solely for metadata/dependency administration. Newly created Backlog records lacked an initial runtime state marker; independently verified live Backlog, then used native `reconcile accept-live` to adopt that current state with its audit trail. No historical timestamp, state transition, approval or move-complete proof was invented.
5. Used native `block` for every displayed edge. Paused each administrative timer without entering Refine/Plan/Develop. The coordination epics remain Ready for Planning and #40 remains Develop.
6. Fresh GitHub read-back checked all29 OPEN / Backlog states, exact Estimate <4, Size S, singleton owner, recorded Backlog, exact one native predecessor, both accepted XPRs/hashes, uncertain review, execution hold, no Plan/Develop marker, and valid rendered VC syntax. All checks passed. Native five-parent child sets match exactly. Six parent metadata URL/scope/AC/state/kind audits passed.

## Execution stop boundary

This reassessment and intake do not authorize application implementation, paid execution, deployment, benchmarks or research unblocking. Review and approve the revised decomposition before future work; then retain every native Refine/Plan/approval/Test/Review/delivery/Close gate and dependency boundary. Every active authored implementation branch must be fetchable with its draft PR at pickup. No scope, accepted evidence or unknown timing value is replaced by a claim from this audit.

## Documentation verification

- `npm run format:check`: 443 files, zero findings; immutable evidence receives integrity verification.
- `npm run verify:docs`: accepted-spec bytes, local links, setup and offline CI documentation verified.
- `npm run verify:sealed-evidence`: all122 originals matched historical Git blobs.
- Targeted Markdownlint: seven new Markdown documents, zero findings.
- Git whitespace check passed. Exact original Scope and Acceptance Criteria section bytes were compared, including whitespace, on #40 and #64–#68.

No application unit/container/paid-provider run is claimed for this documentation and backlog task. The existing #63 accepted Test evidence remains distinct and preserved.
