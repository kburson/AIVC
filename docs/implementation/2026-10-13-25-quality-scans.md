# Repository quality scans delivery

Story: [AIVC #25](https://github.com/kburson/AIVC/issues/25).
Publication: [draft PR #26](https://github.com/kburson/AIVC/pull/26), targeting
`codex/2-draft`.
Usage: [quality scan commands](../quality-scans.md).
Review: [ordinary tooling code review](../peer-reviews/code/25-quality-scans/review.md).

## Implemented behavior

The owner approved strict policy B: every current first-party Markdown finding
fails the checks, with no historical baseline. The root tooling now scans
review collateral, specifications, plans, ordinary docs and hidden repository
guidance. TypeScript rules apply at every directory depth, including authored
declarations, root configs and future shared/service packages. React/Next rules
are scoped to the web package.

`.github/workflows/ci.yml` contains independent jobs named `eslint`, `prettier`,
`markdownlint`, `typecheck` and `tests`. Each uses the pinned toolchain and locked
dependencies. No check has `continue-on-error`; no dependency between scan jobs
prevents another scan from running after a failure.

The Markdown runner uses the pinned markdownlint-cli2 library exports with
literal file contents and strict root rules. Nested configs and inline comments
cannot enable fixes or suppress findings. The formatter checks all owned
supported files; writes require explicit ordinary paths and reject protected
review/spec/plan evidence before writing anything.

## Measured validation

- Baseline unit/UI suite: 34 tests passed before implementation.
- Updated unit/UI suite: 42 tests passed, including 8 behavioral scanner tests.
- Existing slow suite: 2 tests passed.
- ESLint: exit 0 across the current first-party TypeScript tree.
- CI YAML parsed with all five independent strict validation jobs present.
- Full read-only scan snapshot before adding the final delivery records:
  193 files, including 95 Markdown and 63 TypeScript files.
- All 69 then-present protected documents retained their SHA-256 values.
- Markdownlint: exit 1, 463 findings in 47 files.
- Prettier: exit 1, 51 existing files needing formatting.
- Typecheck: exit 2, five TS2353 errors in `tests/scripts/quality-scans.test.ts`
  involving the inferred JavaScript helper options and `paths`.
- The aggregate quality command runs every scan and returns failure when any
  scan fails, without suppressing later diagnostics.

The owner explicitly instructed that TypeScript errors be left for PR checks
to fail. No TypeScript error cleanup was performed. Sealed/accepted historical
documents were not rewritten or silently exempted from scans. Strict quality
gates remain failing until their findings are resolved through governed work.
This is a published tooling change, not a green repository, merged application,
accepted-artifact revision, Test-state promotion or closed story.
