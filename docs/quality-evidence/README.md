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

## Integration refresh for PR #26

The approved merge into `codex/2-draft` required refreshing the PR with base
commit `39c18e086ea832fc3214431575a1161742f374d6`. That base introduces four
capture code-review documents. Their exact bytes are separately preserved in
[the integration archive](2026-10-14-25-integration-originals.json), with the
same path, length, hash and base64 records. Their current documents are labeled
formatting views. The original 70-document archive remains unchanged.

The verifier pins this second source commit independently and checks the complete
capture-review Markdown corpus at that commit. CI verifies all 74 originals;
missing or altered integration records also fail. Capture source, vendor patch
and TypeScript errors remain the owning stories' responsibility.

## Completion refresh for story #25

The completion branch includes tutorial collateral from independently pinned
source commit `89fc7a6125cd4b2be6f0f338dea928bd81bcea45`. All 16 Markdown
files in its tutorial review group and accepted tutorial specification are
preserved in [the tutorial archive](2026-10-14-25-tutorial-originals.json).
Each published view links to those exact historical bytes. The two earlier
archives remain unchanged. The verifier checks all 90 originals against Git,
including complete tutorial corpus coverage; a real Git fixture test rejects
forged tutorial bytes even when their declared hash is recomputed.

## Performance research documents in story #39

The [performance research archive](2026-10-16-39-originals.json) preserves all 32 original #39 documents from independently pinned source commit b612108309811663ffad1e04ba2005621c68ea5f: 29 records in the exact performance-research specification and plan review groups, plus the specification and two #39 plans. Each record retains original path, byte length, SHA-256 and canonical base64 bytes. Current labeled views link to those originals; original acceptance hashes still identify the historical bytes. Later owner amendments are not retroactively covered by the sealed predecessor reviews.

The verifier derives complete membership from those two fixed review groups and three exact artifact paths at the independently pinned Git source. It applies the same ancestry, encoding, hash/length, Git-blob equality and regular-path checks. All four archives now protect 122 originals; the earlier three archives and their 90 original records remain unchanged. Real-Git regressions prove a complete good baseline before rejecting forged tutorial and performance records, even when their declared hashes, lengths and encodings are recomputed.
