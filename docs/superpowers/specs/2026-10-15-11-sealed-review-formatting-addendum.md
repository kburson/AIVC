# Story #11 sealed review formatting addendum

This bounded implementation addendum supplements the accepted
[acceptance amendment](2026-10-15-11-live-acceptance-amendment-design.md).
It does not change that accepted artifact or its closed SPR decision.

The owner authorized preservation of evidence and required checks in native turn
`01a13f63-b581-7f11-af49-fc567f7aa25b`. Checking the finalized SPR found exactly
two generated files that fail Prettier. Reformatting them would alter sealed
evidence. The same independent Astra6/high reviewer confirmed the failure and
reviewed this exact bounded remedy in ordinary native message
`msg_0cf7ad7b97c73867016ad0c37ed6108195839c19d751446ce1`.
Its [unaltered assessment](../../evidence/11-astra-sealed-formatting-assessment.txt)
is 3937 UTF-8 bytes, SHA-256
`3f6e35b27baee932f7fa15d99dc2ea081e735d45e9e10e70b82109ae52188352`.
This ordinary assessment is separate from the accepted primary sealed SPR.

## Exact extension

The primary amendment's sole-source-path clause is extended only to permit
`scripts/format-check.mjs` and its existing
`tests/scripts/format-check.test.ts`, in addition to the already permitted
live verifier and its test. No application, runtime configuration, dependency,
patch, default profile or paid budget change is authorized.

Before traversal or any formatting exemption, validate the following two native
files under
`docs/peer-reviews/spec/live-acceptance-amendment-review-d37abf9831b9cc30583d0df9ef47d2f9/spr/`:

- `review-manifest.md`: 6528 bytes, SHA-256
  `7e4fbfa61c1ca9845298e994a94ff15810e8d81c83d7f52706a6a72de6e1b716`.
- `reviewer-response-1.md`: 7628 bytes, SHA-256
  `f7ad186c2eeef0f8d7a14f60c5867711989dc3a54c8776b4249a495d1712866c`.

Require exact paths, regular files and regular parents, expected Git modes,
fixed length/hash, equality with their actual storage blobs at
`71fc7115200bd94e7872c3e2f5dc3e15fd10bbce`, and that commit's ancestry.
Validate the accepted manifest's review ID, artifact identity, normal mode,
complete lineage, accepted turn and exact response path/digest. Its
`final_commit` identifies reviewed artifact revision `75ffee8`, not the
storage commit. Authority assurance remains unavailable; local metadata is not
authenticated human authority.

Keep both files in the owned inventory and report them as integrity-verified
immutable evidence. Skip only their Prettier normalization after all checks pass.
Explicit formatting writes still refuse them. Startup, invitation, copied or
renamed lookalikes, all other review files and ordinary formatting checks retain
their existing behavior. No caller allowlist, environment bypass, basename
exception or broad directory exclusion is allowed. Do not change historical
archive verification or the exact specification-copy protection.

The amended live verifier must recognize only these two additional nonproduct
source/test paths and these exact addendum/assessment collateral paths. All
physical evidence reuse and source/runtime equality requirements remain binding.
A final review report may use the exact collateral path
`docs/evidence/11-astra-amended-pr-review.txt`; that report is output evidence,
not authority to expand the policy.

## Required regression evidence

Test exact-pair success without byte changes; missing/changed files, lengths,
modes, blobs or ancestry; file and parent symlinks; inconsistent/unaccepted
manifest lineage, artifact and response identity; copied/renamed lookalikes;
normal startup/invitation and unrelated formatting failures; refused writes; and
preserved specification-copy and historical-archive protections.

Implementation and the final PR must receive the requested independent recheck
and all required automated verification. No new live, microphone, speaker or
paid application-provider calls are authorized. Original L4 failure and L6
unverified observations remain intact; final merge approval remains with the owner.
