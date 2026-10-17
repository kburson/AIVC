# Migration plan — author response to native SAR round 3

Read the complete report. R3-1 is a valid inconsistency in the author-selected closed message shape: group scaling cannot be represented by the previous singular target/ID fields, especially when core-b is absent.

Replaced that schema directly with a closed discriminated union: singular actions carry an enumerated present target and expected ID; scale-core carries target core, desired count, exact nullable core-a/core-b membership and expected web/lookup identities. Defined 1→2 by adding only core-b, 2→1 by draining/removing only core-b, and verified same-count no-op. Core-a and both peers remain unchanged; host template mappings and source/image ownership stay authoritative.

Updated acknowledgements to carry complete before/after membership, and added valid transitions, absent/missing/extra membership, stale/foreign ID, peer mismatch, absent-target, matching duplicate and conflicting duplicate tests. The host cannot add arbitrary fields/services/images/commands or silently recreate core-a. Unknown partial results still fail without replay.

No accepted specification byte, application source or earlier report changed. Only the plan and this disposition were authored; application/container tests remain future implementation requirements. Return the full plan to the same native reviewer for acceptance or remaining concrete findings. Preserve the owner's pause for registered runtime/MCP recovery before sealed XPR.
