# #40 coordinated runtime recovery

## Current checkpoint

The registered no-native runtime at source `fb922c4cabad5648ad71e467e9b602fa76dd41a4`
passed all 39 required CI jobs and six installed handoff jobs. CLI entrypoints
and user-owned wrappers now resolve that installation; original CLI targets and
the previous verification launcher were privately backed up. Old package bytes
remain intact. [PR #62](https://github.com/kburson/AIVC/pull/62) retains portable
MCP timeouts while resolving the runner through account configuration.

Actual primary-registration dry-run refused before its callback because the
first-use primary admission root was absent. Its wrapper reported uncertain
completion; no primary effect committed, cleanup discharged. Read-only inspection
confirmed the old activation record and absent owned files. No AIVC non-dry
registration, setup or activation followed. A disposable first-use test then
exposed the separate legacy source-class prerequisite; no class or activation
was fabricated.

The runtime owner corrected the missed legacy-enrollment startup check, awaited
the asynchronous delivery-source factory, and separated passive MCP waiting from
bounded authenticated filesystem operations in source `e416bede4c45b20174bc53dbc645c61a955a9aac`.
The original operation budgets and per-review authentication remain intact.
Actual installed SDK discovery passed in both the physical AIVC checkout and this
linked worktree; the owner also verified canonical notification replay from an
existing genuine journal. These are runtime checks, not new #40 review acceptance.

The first full CI attempt retained one historical five-second Git-inventory
timeout and three Windows MCP failures after delivery, cancellation and replay.
Inspection found a test teardown defect: it deleted its fixture
before closing MCP; a failed first cleanup could prevent the close hook. The
reviewed test-only correction is source
`98efe0374a5a1d53f8171c0e6496238d3bbdfeb1`. Its staged package is byte-identical
to the preceding candidate and remains unselected. All six [fresh installed
journeys](https://github.com/kburson/ai-peer-review/actions/runs/38961639161) passed
at that exact source. [Fresh full CI](https://github.com/kburson/ai-peer-review/actions/runs/38961649041)
and native Test verification remain pending before selection and AIVC rollout.
The selected runtime remains `fb922c4`; no primary-registration, setup or activation
retry followed the refusal. Both #40 artifacts retain native SAR acceptance only;
neither sealed XPR has started and implementation remains stopped.

## Earlier recovery findings

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
