# #40 sealed XPR runtime restoration checkpoint

## Review gate

The migration specification and implementation plan have accepted native SAR
records. Sealed XPR has not started and neither artifact has sealed XPR
acceptance. Implementation remains stopped; this checkpoint grants no Plan
approval or lifecycle transition.

## Verified blockers

The account-selected runtime executes, but `primary inspect --json` refuses
with `APR_PRIMARY_AUTHORITY_UNAVAILABLE`. The physical AIVC primary checkout
is missing the two owned files pinned by its existing activation record:
`.ai-peer-review/config.json` and `.ai-peer-review/skills/peer-review/SKILL.md`.
Commit `91f17b932e3a4aed4834e50b865d20014256fe5f` removed them while adopting
the older global integration. The recorded config blob is
`4c8d0968cacd6f14677f304b140f6aa780b7a059`; the recorded skill blob is
`2d37ef654966d41ffc8872de610dbc692876a815`.

The supported setup dry run independently refuses with the same error code
because primary inventory rejects a historical Codex hook observation. The
installed inventory validator requires the older closed record shape. The
peer-review source recovery branch already recognizes the former producer's
extended Bash shape as historical evidence without granting live identity.
Its locally packed recovery artifact contains that repair. The artifact has
not been installed by this story.

The configured Codex MCP server still points to the older PATH installation,
which does not support the account's v2 configuration. The current chat exposes
no peer-review MCP handoff tool. No MCP handoff, sealed response, or acceptance
has been fabricated.

## Recovery boundary

The selected runtime is account-wide and is also used by the active peer-review
project chat. Coordinate its repair before changing that shared installation.
Retain historical hook observations and interrupted reviews byte for byte.
Do not bypass inventory, manufacture activation records, or switch the physical
primary to an old Git state merely to satisfy the activation check.

After installing and verifying the compatible runtime through its documented
procedure, repair AIVC primary integration from the physical primary: inspect
setup and inventory, settle or preserve each classified review through supported
maintenance, commit the generated owned files, and explicitly activate them.
Restore MCP configuration to that selected runtime and verify actual tool
attachment. A successful server listing alone does not prove a handoff.

Only then start issue-bound sealed XPR for the migration spec and plan, retain
all native SAR and inherited #39 references, and record exact accepted revisions
and sealed review records. Implementation stays stopped until both artifacts
are accepted.
