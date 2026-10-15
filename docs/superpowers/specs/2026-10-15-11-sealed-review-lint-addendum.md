# Story #11 sealed review lint addendum

This bounded addendum supplements the accepted
[primary amendment](2026-10-15-11-live-acceptance-amendment-design.md) and
[formatting addendum](2026-10-15-11-sealed-review-formatting-addendum.md).
It leaves both artifacts and the closed primary SPR byte-identical.

The same independent Astra6/high reviewer reproduced six Markdownlint findings
on the unchanged native reviewer-response-1.md: MD003 at lines32/44/56/62/69 and
MD022 at line6. Manifest, startup and invitation pass Markdownlint. The full
[ordinary native assessment](../../evidence/11-astra-sealed-lint-assessment.txt)
is3776 UTF-8 bytes, SHA256
7c46b0e3b912433e32854e0595ead2a76bb6799d4c25828501d51596b4c8a52f,
from message msg_0cf7ad7b97c73867016ad0c8f3a1bc819599a7cac0ac85bd00
in the same genuine distinct reviewer session. This is ordinary evidence,
not a new sealed decision or an amendment of the primary SPR retroactively.

## Exact extension

Extend the reviewed source/test boundary only for scripts/lint-markdown.mjs
and its existing owning tests/scripts/quality-scans.test.ts. A separate
lint-markdown.test.ts does not exist and must not be created. Add only this exact
addendum and docs/evidence/11-astra-sealed-lint-assessment.txt as fixed acceptance
collateral. Pin their reviewed committed bytes/storage ancestry in the live
verifier after root adopts this addendum; arbitrary record strings cannot extend
the policy. All existing source/runtime/configuration/package/patch/profile and
other gate protections stay binding.

Keep the complete owned Markdown inventory. Reuse the existing fixed
verifyAmendmentReview(root) integrity gate, including pretraversal regular-file/
parent, mode/hash/length/storage/ancestry and accepted-lineage proof. Only the
same two exact native paths under
`docs/peer-reviews/spec/live-acceptance-amendment-review-d37abf9831b9cc30583d0df9ef47d2f9/spr/`
may enter an integrity-verified exclusion set: review-manifest.md and
reviewer-response-1.md. Do not duplicate or weaken their authority rules.

Exclude these two only from Markdownlint input construction and its corresponding
result iteration. Require an explicit result for every file actually submitted
to Markdownlint. Report inventory count, actually linted count and the two
integrity-verified exclusions distinctly; do not describe excluded files as
having passed Markdownlint. An integrity failure propagates, never becoming an
empty exclusion set or successful fallback. Missing files/parents must fail
before traversal can silently omit them.

Ordinary isolated fixtures without the anchored review retain ordinary strict
lint behavior. Preserve strict root settings, fix:false, noInlineConfig:true,
literal filename handling and refusal of CLI/config overrides. Startup,
invitation, copied/renamed lookalikes, other review documents and unrelated
Markdown stay fully linted. No broad ignore, frontmatter special case, environment
bypass, rule relaxation or sealed-byte edit is authorized.

## Verification and authority sequence

Regress the genuine pair's exact bytes and separate reporting; corrupted,
missing, file/parent symlinked or lineage-invalid pair; copied/renamed lookalike;
malformed startup/invitation/unrelated Markdown; inline suppression and nested
ignore/fix attempts; ordinary fixture behavior; and explicit results for every
actually linted file. Retain existing quality-scan regressions, protected writes,
specification-copy protection and historical-archive verification.

Root must commit this separate reviewed addendum/assessment and update live
issue11 and parent2 Scope via governed mutation before the lint implementation.
Then extend only the fixed accepted inventory, implement with failing regressions
first, run affected tests and required lint/format/docs/evidence checks, and
obtain the independent implementation/full-PR recheck. No more live/provider,
microphone or speaker experiments, product changes or new subsystem follow.
Original L4 fail and L6 unverified remain intact; limited release acceptance,
registered lifecycle and final owner merge approval remain separate.
