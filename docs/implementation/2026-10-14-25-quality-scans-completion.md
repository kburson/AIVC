# Quality scans completion and native lineage

Story: [#25](https://github.com/kburson/AIVC/issues/25).
Parent: [epic #2](https://github.com/kburson/AIVC/issues/2).
Integration target: `codex/2-draft`; epic delivery to trunk remains separate.

## Delivered quality tooling and typing repair

[PR #26](https://github.com/kburson/AIVC/pull/26) delivered strict repository-wide
Markdownlint, Prettier and TypeScript ESLint checks, with independent CI jobs.
It merged at `ac604ed0ef2e8300e52083e5d2b74a286336167a`, accepted head
`5977efb68b760647bb1e745b236624dec1277254`. The owner explicitly retained the
five TypeScript errors at that integration boundary.

The required AITM integration Test lane subsequently failed on those compiler
errors. That failed evidence remains in the story. The owner then authorized a
separate narrow repair while keeping #25 paused.

[Repair #27](https://github.com/kburson/AIVC/issues/27) and
[PR #28](https://github.com/kburson/AIVC/pull/28) add three JSDoc lines declaring
the formatter's optional `root`, `paths`, `write` and `log` parameter values.
Runtime behavior, tests and compiler configuration are unchanged. Source
`6f1d8732275b45694dfe471cf3cab08d4ed3f4da` merged at
`f39d16aa7086d135f542d2861ee1521857bc208e`.

The five TS2353 errors were reproduced before the repair and workspace
TypeScript checks pass afterward. At that source, all 42 unit/UI cases, the
production build and two-process HTTP integration case, two slow cases and
nine evidence cases pass. All five [CI jobs](https://github.com/kburson/AIVC/actions/runs/38560843008)
pass. Distinct-agent ordinary code review found no actionable findings; its
reported inability to independently execute through its own binding hook is
preserved in #27's review record.

## Owner-authorized graph reconciliation

The owner explicitly chose to attach #25 to epic #2 and reconcile the governed
graph. The native GitHub parent relation now records #2 as #25's parent.
Before adoption, #2's children were #3, #4, #5, #6, #7, #8, #9, #10, #11, #13
and #14. The added auxiliary quality story is #25; those eleven core-feature
children and their original accepted plan mappings are unchanged.

This additive record documents the newly authorized quality scope. It does not
claim that a historical sealed specification, plan or review accepted #25 as
an original child. #25's independently approved deep dive remains its own
planning authority. Native delivery lineage now targets the epic integration
branch rather than treating #25 as a standalone trunk-delivery story.

## Original evidence preservation

The two earlier [original-byte archives](../quality-evidence/README.md), all historical
sealed records, accepted artifact hashes and formatting-view provenance remain
unchanged by this completion work. Refreshing to epic integration head
`89fc7a6125cd4b2be6f0f338dea928bd81bcea45` introduced tutorial collateral
with 135 Markdownlint findings and 11 Prettier findings. A separate
[16-document tutorial archive](../quality-evidence/2026-10-14-25-tutorial-originals.json)
preserves those incoming bytes before labeled formatting views correct the
findings. All 90 archived originals identify their original Git bytes. No TypeScript suppression, test exclusion, quality
baseline or review acceptance rewrite was introduced.

Final exact-head AITM Test, Review, approval, delivery and Close receipts belong
in the live story and completion PR. They must reflect the actual verified
completion head; this document does not manufacture or predeclare those gates.

## JavaScript and cloud enforcement amendment

The owner additionally required JS, TS and Markdown lint/format enforcement
on every cloud PR. ESLint now applies recommended JavaScript rules to authored
`.js`, `.jsx`, `.mjs` and `.cjs` files across the repository. A behavioral
fixture first demonstrated that an undefined JavaScript reference was not
rejected, then verifies rejection and valid Node-global handling. The existing
`lint:typescript` command remains a compatibility alias for `lint:code`.
Independent ESLint, Markdownlint and Prettier jobs run on every pull request.
The delivery branches are `trunk` and `codex/2-draft`; GitHub read-back confirms required ESLint, Markdownlint and Prettier checks on
both delivery branches, bound to GitHub Actions app ID 15368 and enforced for
administrators. No lint or formatting finding waiver is configured.
