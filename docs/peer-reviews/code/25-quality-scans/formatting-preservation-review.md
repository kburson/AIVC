# Formatting preservation code review

Scope: the Markdown/Prettier corrections for [PR #26](https://github.com/kburson/AIVC/pull/26)
and their original-evidence preservation mechanism. This is an ordinary native
code review, not sealed SAR/SPR/XPR acceptance. The earlier review's original
bytes remain in the archive; this record is additive.

## Findings and corrections

The distinct native reviewer `quality_review` independently confirmed that all
70 archived originals matched historical Git blobs, view provenance links were
correct, the relocation receipt was unchanged, and there was no TypeScript diff.

1. **Source downgrade:** the archive selected its own source commit and corpus.
   Substitution with the preceding ancestor accepted 69 records. The verifier
   now independently pins `0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c` and
   rejects a different archive source before reading its corpus. Test fixtures
   supply a separate expected commit; the production root cannot override it.
2. **Symlink coverage:** checking only the leaf allowed view files beneath
   symlink directories to pass while inventory skipped those directories. The
   verifier now checks every path component and the archive path itself.

The new behavioral tests reproduced both defects before the implementation
changed, then passed after correction. Eight preservation tests cover exact
bytes, recomputed-hash tampering, missing/unsafe records, incomplete corpus,
source substitution, symlink leaves, ancestor directories and archive aliases.

See the [delivery receipt](../../../implementation/2026-10-13-25-markdown-formatting-corrections.md)
and [archive policy](../../../quality-evidence/README.md) for preservation authority.

## Final reviewer result

The same independent reviewer rechecked the corrections and found both findings
closed with no remaining substantive tooling findings. Read-only probes verified
all 70 originals and confirmed refusal of source downgrade, production source
override, symlinked view ancestors, archive ancestors and archive files. The
reviewer confirmed no TypeScript diff and made no filesystem changes.
