# Original evidence and formatting views

[Story #25](https://github.com/kburson/AIVC/issues/25) fixes the Markdownlint and
Prettier findings in [PR #26](https://github.com/kburson/AIVC/pull/26). The owner
explicitly required preservation of the original sealed review evidence and
left TypeScript errors to the owning PRs.

## Preserved originals

[The original-byte archive](2026-10-13-25-originals.json) contains all 70 review,
specification, plan and relocation-receipt documents from source commit
`0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c`. Each entry retains its original
repository path, byte length, SHA-256 and exact bytes encoded as base64. These
include repository-authored navigation and code-review notes as well as sealed
SPR/XPR documents; an archived snapshot does not create a new acceptance claim.

Original review acceptance, artifact hashes, signatures, participant metadata
and historical paths remain attached to the original bytes. Git history
retains those files at their original paths and source commit. Every current
Markdown view links directly to that immutable GitHub revision and the archive.
The JSON relocation receipt remains unchanged at its existing path.

## Current Markdown

The current Markdown files are explicitly labeled formatting views. Corrections
normalize headings, tables, lists, quoting and spacing. Protected response
metadata is displayed as YAML code, preserving its readable values while the
archive retains the original protocol envelope byte for byte. These views
remain in the original artifact group and stage directories.

The formatting views pass the same strict Markdownlint and Prettier rules;
there is no findings baseline, document exclusion or rule suppression. Their
new file hashes are not substituted into original protocol records. Machine
readers requiring the sealed protocol envelope use the archived original or
its historical Git blob, rather than a formatting view.

## Verification and retrieval

Run `npm run verify:sealed-evidence`. The verifier checks the complete original
corpus from Git, canonical base64 encoding, byte lengths and SHA-256 values,
then compares every decoded entry directly to its historical Git blob. It
rejects missing records, changed originals, unsafe paths, archive aliases and
symlinks in every archive/view path component. The required source commit is
pinned independently in the verifier; archive metadata cannot select an older
ancestor and silently reduce the corpus.
Prettier validation also runs this check, and CI fetches the required history.
`npm run test:evidence` exercises preservation and tamper refusal using real
local Git fixtures.

To retrieve an original without interpreting the formatting view:

```sh
git show 0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c:docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md
```

The source commit must be available locally; use a full-history checkout.
The archive provides the same bytes independently through each entry's base64
payload. Original acceptance hashes continue to identify those original bytes.
