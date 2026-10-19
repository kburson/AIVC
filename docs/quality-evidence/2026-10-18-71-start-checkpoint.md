# Story #71 implementation start checkpoint

The owner-authorized reset continuation completed #64's native Plan→Develop gate and #71's source-bound deep dive, detailed estimate, human Plan approval and Develop admission. #71's native forecast is `01M58DPBZF81HVT63G8MEPPNK7`: human Plan **3.5h / M**, AI P50 3h and P80 3.5h. It remains strictly below the four-hour admission ceiling; split further if complete scope no longer fits. #72–#99 remain gated. This is a start checkpoint, not application acceptance or governed Done.

## Provenance and timing

Accepted specification remains `e6e96c9a4f07bb78faa73dc56368a0503d912982`, SHA-256 `f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`, XPR `review-0009efb5ca6886291ad48628afa78120`. Accepted plan remains `80efe1a150dbd8605aab69678c2a7a87f8553072`, SHA-256 `eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`, XPR `review-3f99142a6b19c9dcbe0e6e53c7b1354a`. LOCAL JOURNAL MODE / accepted-uncommitted / assurance unavailable remains distinct from Git publication. Earlier `review-2bdf5dd8ee56accc6e494643054a3cf1` stays unsettled.

The owner-reported #64 pause boundary, October 18 at 15:43 CDT (20:43Z), is preserved separately in the owner-pause document and governed `timing.owner-reported-pause-2026-10-18-v1` comment. The later successful native pause has its real execution time. Original timing bytes and Unknown/null values are not replaced with inferred finite durations.

Story #71 branch `codex/71-draft` is based on the published #64 checkpoint `ceb1cd7`; [draft PR101](https://github.com/kburson/AIVC/pull/101) targets `codex/64-draft`. [PR100](https://github.com/kburson/AIVC/pull/100) retains #64's orchestration evidence. The quota-resume heartbeat was removed after the gates and first pickup were achieved; it grants no later story execution.

## First behavioral checkpoint

Added a genuine failing assertion that configured private service DNS is accepted by the lookup client. RED observed the old `Retrieval origin must be loopback` refusal. The minimal change removes that obsolete hostname restriction while retaining canonical exact-origin validation and adding explicit wildcard refusal. Existing fixed endpoint, encoded query, deadline, schema validation and `redirect: error` behavior remain.

Two real local HTTP servers prove the selected configured origin receives `/v1/projects`, a caller URL stays an encoded name rather than selecting a destination, an explicitly selected second origin works independently, and a redirect does not invoke its target. The old integration assertion rejecting all non-loopback names was replaced with a noncanonical-base-path refusal because accepted migration Task 2 intentionally supersedes loopback-only policy. Its existing query-encoding assertions are retained. Cost if this interpretation is wrong: configured origins could be admitted too broadly; negative origin and redirect controls cover the intended boundary.

## Verification observed

- Initial full unit baseline: `npm test` returned 243 passed / 1 failed in 1033.30s. The failure was the quality-scan assertion caused by three Markdown findings in newly authored unsealed planning notes, before migration code changes.
- Corrected only those three note-format findings. `npm run lint:markdown` then passed with zero findings; the formerly failing quality-scan case passed in a focused run (1 passed, 15 deliberately unselected). This does not claim a full-suite rerun.
- Focused implementation check: `npx vitest run tests/contracts/config.test.ts tests/contracts/leases.test.ts tests/contracts/search-budget.test.ts tests/integration/typed-turn.test.ts --no-file-parallelism` passed **132/132** across four files.
- `npm run typecheck` passed for contracts, web and retrieval.

`npm run build` and `npm run lint` also passed. `npm run format:check` passed with 451 files checked and zero findings. No native Test/Review/Close receipt or full migration acceptance is claimed here. Runtime relocation, complete ResourceContext/default pipeline ownership and their remaining regression proof are still pending in #71; no dependent story may start before #71 reaches governed Done.
