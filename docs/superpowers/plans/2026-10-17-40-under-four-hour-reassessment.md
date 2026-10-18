# Story #40 open-child sizing reassessment

Requested October 17, 2026 (America/Chicago), after #63 reached governed Done. This is a new decomposition supplement. Accepted specification/plan bytes, original six-package decomposition, sealed evidence, hashes and review references remain unchanged. No application implementation or renewed peer acceptance is implied.

## Intent and sizing rule

Replace executable work packages estimated at 4–16 hours with independently testable leaf stories estimated strictly below four joint hours, including normal implementation, verification, review, CI/delivery and contingency. Every leaf is 2.5–3.5 hours. At JIT Plan, recheck scope and split again if it cannot fit; never lower an estimate to hide oversized work. External wait time and discovery remain uncertain; these estimates are not elapsed-time guarantees or AI forecasts.

Keep #64–#68 as nested coordination epics under #40, preserving original Scope/ACs, estimates, history and all review links. Their aggregate hours are rollups, not executable story budgets. All new leaves remain Backlog, pending normal Refine/Plan gates and owner implementation authorization. #63 remains Done and unchanged.

## Reassessment

| Coordination epic           | Original package hours | New stories | New joint hours | Leaf maximum |
| --------------------------- | ---------------------: | ----------: | --------------: | -----------: |
| #64 Portable core           |                     16 |           7 |            23.5 |          3.5 |
| #65 Thin web                |                      8 |           4 |            13.5 |          3.5 |
| #66 Production topology     |                     16 |           8 |            26.5 |          3.5 |
| #67 Replica acceptance      |                     14 |           7 |              24 |          3.5 |
| #68 Integration and handoff |                      4 |           3 |             9.5 |          3.5 |
| Remaining total             |                     58 |          29 |              97 |          3.5 |

The larger total explicitly budgets a separate verification/review/delivery cycle for every leaf and previously compressed harness work. It does not replace historical board estimates or immutable forecasts. New aggregate estimates/forecasts must converge through normal JIT planning; no retrospective forecast is fabricated.

## Scope and correction coverage

| Accepted obligation                                                      | Owning bounded slices                       |
| ------------------------------------------------------------------------ | ------------------------------------------- |
| Task2 runtime/config/shared pools/private lookup                         | #64 Task1                                   |
| Auth/Host/policy and pre-body two-per-kind admission                     | #64 Task2                                   |
| OperationHandle, demand/oversized allocation and exact settlement        | #64 Tasks3–4,7                              |
| Scripted factory, parent/invocation separation, WAV/encoding bounds      | #64 Task5; repeated #66 Task3 and #67 Task3 |
| Actual SDK protocol abort/EOF cleanup                                    | #64 Task6; repeated #67 Task3               |
| Core endless-upload refusal and route/lifecycle oracle                   | #64 Task7                                   |
| Task3 pinned production Next wrapper and ALS                             | #65 Task1                                   |
| Fixed duplex forwarding, safe headers/errors/deadlines                   | #65 Task2                                   |
| SSE/PCM parity and pressure through real framework                       | #65 Task3                                   |
| Remove compatibility/provider ownership and retarget all regressions     | #65 Task4                                   |
| Task4 local readiness, diagnostics, 15s/5s drain and unknown outcome     | #66 Task1; real acceptance #67 Task6        |
| Independent pinned images, binds/resources/mounts/policy                 | #66 Task2                                   |
| Private provider data/control fixture and surviving ledger               | #66 Task3                                   |
| Deterministic per-request router and independent attribution             | #66 Task4; negative controls #67 Task2      |
| Trusted TLS Chromium ingress and isolated private topology               | #66 Task5                                   |
| Closed acknowledged host lifecycle and scale identity channel            | #66 Task6; real kill/scale #67 Task7        |
| Runner, ownership, exact argv/config, phase/global budgets and cleanup   | #66 Task7                                   |
| Full 15/4 scenario inventory, identities and resource evidence           | #66 Task8; complete acceptance #67 Task7    |
| Task5 fail-closed Node entry point                                       | #67 Task1                                   |
| Multipart text/WAV/JSON A/B/B and cold replacement                       | #67 Task2                                   |
| Exact invocation counts, duplicate IDs, cancellation404, padded WAV      | #67 Task3                                   |
| Real browser typed/voiced generation fencing and bootstrap               | #67 Task4                                   |
| Every-hop early refusal, held leases, policy mismatch/outages            | #67 Task5                                   |
| Real core/web/lookup graceful termination                                | #67 Task6                                   |
| Hard kill, no replay, replacement, actual 1→2→1 and complete entry point | #67 Task7                                   |
| Task6 source/image freeze and every regression lane                      | #68 Task1                                   |
| Independent whole-change review, AC evidence, governed delivery          | #68 Task2                                   |
| Task0 state/limits/cost/representations/evidence handoff                 | #68 Task3                                   |

All full accepted tasks and appended corrections remain mandatory. The map identifies primary ownership; repetition at direct/delegated/container levels remains required. A focused scenario selection can prove its own bounded behavior, but cannot claim the complete closed acceptance inventory. No skip, placeholder or weakened assertion substitutes for a future sibling. The final #67 slice runs the mandatory complete Node entry point.

## Dependency and delivery order

Sequence: #63 Done → #64 leaves1–7 → #64 governed Done → #65 leaves1–4 → #65 Done → #66 leaves1–8 → #66 Done → #67 leaves1–7 → #67 Done → #68 leaves1–3 → #68 Done → remaining aggregate #40 Test/Review/trunk delivery gates. Each arrow requires governed Done. Keep all existing native package dependency edges and add serial native leaf blockers. No parallel execution, automatic Plan approval, paid work or research unblocking.

At future pickup each nested coordination epic uses its recorded branch from `codex/40-draft`, and each leaf PR targets that coordination branch. No new implementation worktree or branch is created by backlog intake. Every accepted source must be reachable on its actual target before Done. #40 PR61 remains the aggregate draft to trunk; final root delivery remains separate from child integration.

## Governing records and preserved lineage

- [Accepted design](https://github.com/kburson/AIVC/blob/e6e96c9a4f07bb78faa73dc56368a0503d912982/docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md), SHA-256 `f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`, XPR `review-0009efb5ca6886291ad48628afa78120`.
- [Accepted plan](https://github.com/kburson/AIVC/blob/80efe1a150dbd8605aab69678c2a7a87f8553072/docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md), SHA-256 `eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`, XPR `review-3f99142a6b19c9dcbe0e6e53c7b1354a`.
- [Complete original lineage](2026-10-17-40-stateless-service-migration-decomposition.md#preserved-artifact-and-review-lineage) retains SAR, #39 predecessors, later unreviewed amendments, uncertain earlier XPR and lossless originals. Both accepted XPRs retain LOCAL JOURNAL MODE / accepted-uncommitted / assurance unavailable with separate Git publication. No acceptance transfers to these new plans.
- [#63](https://github.com/kburson/AIVC/issues/63) and [merged PR69](https://github.com/kburson/AIVC/pull/69): accepted source `f921eaa9f005042a5df5db3f7d2c22968d69dcb5`, parent merge `1e1bf3549e378d7f973b3d1c52be5c39e93c3dcc`. Its timing recovery archives, original bytes, Unknown values and accepted Test receipt remain preserved.

## Detailed bounded plans

- [#64 portable core](2026-10-17-64-portable-core-under-four-hour-decomposition.md)
- [#65 thin web](2026-10-17-65-thin-web-under-four-hour-decomposition.md)
- [#66 production topology](2026-10-17-66-production-topology-under-four-hour-decomposition.md)
- [#67 replica acceptance](2026-10-17-67-replica-acceptance-under-four-hour-decomposition.md)
- [#68 integration/handoff](2026-10-17-68-integration-handoff-under-four-hour-decomposition.md)

## Self-review and stop boundary

Reviewed each slice for stakeholder, capability, need, avoided failure, source grounding, sibling distinctness and standalone readability. Coverage map retains every original package AC and correction family. Every leaf has owned files, explicit interfaces inherited from accepted source, demonstrable ACs, future verifier declarations and a budget below four hours. No implementation, verifier execution claim, stage approval, final-task approval or research readiness is created by this planning work.
