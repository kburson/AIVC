# Repository quality tooling code review

Tracked story: [AIVC #25](https://github.com/kburson/AIVC/issues/25).
Publication: [draft PR #26](https://github.com/kburson/AIVC/pull/26).

This is an ordinary read-only native code review, distinct from sealed
SAR/SPR/XPR artifact acceptance. The author requested a fresh-context review
through the requesting-code-review skill, then revised the implementation
and obtained a follow-up review in the same reviewer context.

## Findings and disposition

1. **P1: nested Markdown configuration could write or hide evidence.** The
   first runner invoked markdownlint-cli2 with a root config, but descendant
   configs could override `fix:false` or supply `ignores`. A behavioral test
   reproduced an unexpected successful scan after the fixture was auto-fixed.
   The revised runner uses the pinned library's exported promise API with
   literal file contents, the strict root rules, and inline configuration
   disabled. It invokes no fixer or descendant configuration loader.
2. **P2: discovered filenames could be treated as glob instructions.** A name
   such as `#review.md` was interpreted as a CLI exclusion. Literal string
   inputs now remove that ambiguity. Tests cover `#review.md`, `!review.md`
   and `[review].md`, including attempted inline rule suppression.

Both findings are closed. The follow-up reviewer found no remaining
substantive tooling defects. The reviewer independently scanned all 95
Markdown files, observed the expected 463 findings across 47 files, and
verified that all 193 inventoried files retained their SHA-256 values.

## Verification limits

The scanner behavioral tests pass. The repository-wide strict scans do not:
historical Markdown/format findings remain visible and fail the applicable
jobs under owner-selected policy B. The owner explicitly directed that
TypeScript errors be left for PR checks to fail; no TypeScript error cleanup
was performed. This review does not declare the repository green or approve
an application merge, accepted-artifact rewrite, or issue closure.
