# Markdown and formatting corrections

Story: [#25](https://github.com/kburson/AIVC/issues/25).
Publication: [PR #26](https://github.com/kburson/AIVC/pull/26).
This receipt follows the earlier [tooling delivery](2026-10-13-25-quality-scans.md)
and records the owner's instruction to fix findings while preserving originals.

## Preservation

[The archive](../quality-evidence/README.md) retains exact bytes, paths, lengths
and SHA-256 values for all 70 protected documents at
`0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c`. The 69 current Markdown documents
become labeled formatting views with links to the archive and immutable Git
original. The JSON relocation receipt is unchanged. Original review acceptance
and protocol hashes continue to apply only to the archived bytes.

Corrections address headings, tables, list spacing, quote separation, inline
code and missing fence languages. Protocol metadata is displayed as fenced
YAML in views; the archive retains each original protocol envelope. No historical
path or original acceptance hash is refreshed. Ordinary configuration JSON
changes preserve parsed values. TypeScript files are unchanged.

## Review and validation

The [preservation code review](../peer-reviews/code/25-quality-scans/formatting-preservation-review.md)
identified source downgrade and symlink coverage gaps. Both were reproduced by
failing tests and corrected. The verifier pins the source commit independently,
checks the complete Git corpus and every original byte, and rejects symlink
components in both view and archive paths. CI fetches full history.

- Markdownlint and Prettier: zero findings under existing strict rules.
- ESLint: passes across all first-party TypeScript.
- Unit/UI suite: 42 tests pass.
- Evidence tests: 8 pass, including downgrade, tampering and symlink refusal.
- Typecheck: still fails with the same five TS2353 errors concerning `paths`
  in `tests/scripts/quality-scans.test.ts`.

No rule suppression, baseline, scan exclusion or TypeScript repair was added.
The TypeScript failures remain visible for their owning PRs. This correction
creates no new sealed peer-review acceptance and does not merge or close the story.
