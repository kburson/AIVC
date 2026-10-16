# #40 coordinated runtime recovery

The owner authorized coordination with the peer-review runtime-owner chat.
It verified the selected runtime as healthy in its own primary checkout and
reproduced AIVC's historical hook-inventory refusal. The selected installation
lacks the closed extended-Bash compatibility repair from recovery source head
`7734853e897c5b1c47d3bffc113715ea7d4e54a9`.

The locally packed candidate has SHA-256
`4820c89127cc6ebe41128d5170c9219a4ca883f695ef8c72fcf95bef5b83f7cb`.
Its [exact-head CI run](https://github.com/kburson/ai-peer-review/actions/runs/38200720042)
failed at `Run npm run lint` and `Preserve actual command receipts`; this was
independently checked through GitHub. The runtime owner confirmed that fresh
installation requires native bootstrap. Copying a helper or resealing changed
installed bytes is not a supported repair. No installation, selection change,
active-review termination or primary-policy edit was made.

A genuine stdio MCP client invoked the selected package's official MCP entrypoint
with the inherited environment and no identity overrides. Initialization closed
before tool listing, with server error `APR_PRIMARY_AUTHORITY_UNAVAILABLE` and
message `Primary policy cannot be validated.` This is failed endpoint preflight,
not native tool attachment, a handoff receipt or review acceptance. No synthetic
review ID or handoff event was supplied.

The runtime owner subsequently repaired the no-native candidate through the normal
#190 rework process in [PR #196](https://github.com/kburson/ai-peer-review/pull/196).
Source revision `fb922c4cabad5648ad71e467e9b602fa76dd41a4` contains historical-hook
compatibility and bounded support for AIVC npm aliases and tracked Node check
drivers. The repair preserves unknown-command refusal and source/proposed-file
custody. Its real AIVC zero-write preflight passed within the original setup
deadline, with Git, index and package metadata unchanged. Local checks are
reported green by the runtime owner; exact-head hosted verification is pending.
The ordinary and selected historical installations remain intact.

The new review workflow retains sealed invitations, participant-bound responses,
artifact snapshots, acceptance events and genuine MCP delivery receipts in LOCAL
JOURNAL MODE. Its terminal accepted-uncommitted record must not be described as a
historical Git-bound normal-mode finalization or a test-human-authority approval.
Any later Git publication independently pins the actual accepted bytes.

Both #40 artifacts remain identical to their native SAR acceptance pins. Neither
has sealed XPR acceptance; implementation remains stopped.

The [earlier restoration checkpoint](40-runtime-restoration-checkpoint.md) retains
the missing primary-file pins and original recovery boundary. This investigation
does not change either artifact, its review history, or #40's Plan state.
