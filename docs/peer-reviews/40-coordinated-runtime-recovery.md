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

The runtime owner is assessing the separately verified #190 build for a supported
installation without native bootstrap. It is not yet established as the installed
replacement. Both #40 artifacts remain identical to their native SAR acceptance
pins. Neither has sealed XPR acceptance; implementation remains stopped.

The [earlier restoration checkpoint](40-runtime-restoration-checkpoint.md) retains
the missing primary-file pins and original recovery boundary. This investigation
does not change either artifact, its review history, or #40's Plan state.
