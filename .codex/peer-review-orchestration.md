# Native peer review in AIVC

## Current local review procedure

Resolve `peer-review help --json` from the actual project and read its returned
`skillPath` in full. The registered local runtime uses sealed invitations, genuine
distinct participant sessions, authenticated responses, artifact snapshots and
durable journal authority. It needs no primary setup, activation, source-class
capture, native helper or broker for a new local review. Preserve the separate
legacy maintenance contracts. Some descriptive CLI help still states a broker
requirement; the governing installed procedure and actual local startup path
exclude that prerequisite.

The invoking session is the author. Record the tracked issue and exact reviewer
provider, model and effort for each review. Use the package launcher for Claude
XPR and its same-session resume/recovery actions; never copy identity handles or
handcraft broader write permissions. Follow generated invitations, response paths,
sealed submissions, event-derived actions and the sealed turn limit. Only actual
reviewer acceptance permits author finalization.

New reviews use `LOCAL JOURNAL MODE` and finish as `accepted-uncommitted`. This is
genuine local protocol acceptance, distinct from historical Git-bound normal
mode and from `NO-COMMIT TEST MODE`. Git publication separately pins the accepted
artifact bytes and retained review records; it is not a package-generated Git
finalization or provider-action receipt.

The official MCP `wait_for_handoff` reads authentic delivery events and matching
canonical receipts. Use the real review ID, receiving role and observed sequence.
Native chat tool attachment and an official stdio MCP client are distinct host
connections; report the actual connection used. Discovery alone is preflight,
not a new review handoff or acceptance. Preserve inherited session identity and
never synthesize notifications or receipts.

Retain the collateral layout below. Independent spec and plan XPRs may use their
respective artifact groups so one combined flow cannot place plan collateral
under the specification folder. Ordered multi-phase reviews otherwise follow the
installed finalize/advance procedure.

## Historical 0.4.1 native orchestration

The following procedure and evidence describe the installed local-tarball
ai-peer-review 0.4.1 runtime used for the historical reviews below. Keep this guide
separate from the package-owned copied skill; do not apply historical primary or
broker assumptions to new local journal reviews.

The coordinating agent launches and supervises the requested participants with native agent tools. For the requested two-child SPR, use fresh author and reviewer contexts and genuine distinct identities. Preserve the exact provider, model, effort, artifact, and tracked issue selection per run. Do not copy identity handles or pin model choices in project configuration.

The author runs `peer-review start` in its own session with the tracked issue and requested role selections. Relay only its sealed invitation to the reviewer, which runs `peer-review join` in its own session. Follow the installed procedure, exact generated paths, sealed submissions, and event-derived next actions. Only the author revises and finalizes; reviewer Git and write boundaries remain in force.

Use explicit `--transport-mode manual` for the established native-orchestrated protocol. The native coordinator relays the invitation and supervises existing sessions, so the human need not be a courier. This is the path used by the accepted AITM #1901 Astra SPR. Do not require `doctor --mode automatic-required` merely to spawn agents or run this protocol. That mode tests the separate package-managed automatic provider/resident transport contract. Never label native-orchestrated manual transport as a validated package-managed automatic transport.

The installed 0.4.1 MCP `wait_for_handoff` watches authentic `delivery-written` events and matching delivery receipts, which normal manual-protocol submissions also produce. Its implementation does not require `automatic-required`. Once a review exists, use the exact review ID, receiving role, and last observed sequence to wait for the next handoff; then read the authoritative response and next action. Do not invent IDs, events, receipts, leases, capabilities, or decisions. Use native agent waits for coordinator lifecycle notifications; do not poll the protocol while idle.

Keep the same participant sessions across rounds. Stop at acceptance and author finalization, the sealed turn limit, or an actual intervention. Launch, identity, and tool-attachment checks are preflight evidence; only a sealed submission and subsequent wait wake prove end-to-end operation.

## Collateral layout

Keep all review stages for an artifact under one folder: `docs/peer-reviews/<kind>/<artifact-slug>-<group-review-id>/{sar|spr|xpr}/`. Strip date prefixes from the artifact slug. Do not add an issue-number directory or put the stage before the artifact kind. Preserve each stage's genuine independent protocol review and record IDs; the common folder is an archive grouping.

The voice BFF specification's shared folder is `docs/peer-reviews/spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/`. SAR evidence belongs in `sar/`, SPR evidence in `spr/`, and XPR evidence in `xpr/`.

For every protocol start, pass `--reviews-root docs/peer-reviews` and an explicit `--review-path-template` ending with the selected stage. For this specification use `spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/spr` or `spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/xpr`. A later new attempt in an occupied stage needs a distinct attempt subdirectory inside that same stage; do not overwrite accepted evidence or create a new sibling artifact group.

0.4.1 has no review-class placeholder for its path template. The coordinator must supply the literal `sar`, `spr` or `xpr` segment per run. Its default date/name template and `--record-id` alone do not establish this layout. A first SPR for another artifact can use `<kind>/<artifact-slug>-<review-id>/spr`; replace `<artifact-slug>` with the actual date-free slug before invoking the command because it is not a package placeholder. Reuse the resolved shared folder for subsequent stages. SAR uses native self-review collateral, not a two-party protocol start.

Completed SPR/XPR evidence was relocated without altering sealed bytes. [The archive index](../docs/peer-reviews/spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/README.md) and its additive relocation receipt map historical sealed paths to their current locations. Do not rewrite historical paths inside sealed records or scratch authority.

## Evidence

- Native Sol 6.1/high author and Astra 6/high reviewer children were launched and responded with distinct session fingerprints. Both expose `wait_for_handoff`.
- The accepted AITM #1901 SPR used native Astra/high, manual transport, three sealed reviewer rounds, two author revisions, and normal finalization: <https://github.com/kburson/ai-task-manager/blob/9a0156bf2d19cfd764775c5ccfabd971b3c57cb7/docs/peer-reviews/1901/plan/2026-10-08-plan-spr-record.md> .
- Installed 0.4.1 implementation inspected: `src/startup/runtime.mjs` admits broker-owned manual SPR; `src/cli/run.mjs` writes handoff events during normal submissions; `src/protocol/service.mjs` projects delivery receipts; `src/transport/live-wait.mjs` and `src/mcp/server.mjs` wait on those receipts without an automatic-mode condition.
- AIVC issue #1 SPR `review-6e1eb912f8ea1307f0464d76a1501a3b` reached terminal `accepted` with reviewer consensus in normal commit mode: two reviewer rounds and one author revision, with the same distinct native Sol 6.1/high and Astra 6/high sessions. Genuine MCP handoffs reached the author at sequence 8, reviewer at sequence 10, and author at sequence 12.
- Artifact revision commit: `bd238bbc7e19787926bbef49ab226fb1dddbfa9e`; finalization commit: `48e1d222cfb9e765c685586370702dfffb1f6112`. Complete findings, dispositions, and acceptance evidence are in [the review manifest](../docs/peer-reviews/spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/spr/review-6e1eb912f8ea1307f0464d76a1501a3b-review-manifest.md) and linked responses. Generated authority assurance remains `unavailable`.
- The obsolete account-wide model hook was retired after it attributed parent-only evidence to native children. Project AITM hooks remain installed. Restarting Codex refreshed the hook snapshot and permitted the genuine reviewer join.
- The subsequent issue #1 XPR `review-0905b6c7c8f1d7f6f479e1ba143799d3` used the same Sol 6.1/high author and package-launched `claude-opus-5-5`/high reviewer. Claude joined and made two sealed submissions in the same recorded session, including a package-managed resume. Author MCP waits received sequences 8 and 12. The XPR reached terminal `accepted` after one author revision in normal commit mode: revision `bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac`, finalization `db2a1e92bc6254cd1d1e16697a0e9de4c8780d92`. Complete evidence and optional tuning notes are in [the XPR manifest](../docs/peer-reviews/spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/xpr/review-0905b6c7c8f1d7f6f479e1ba143799d3-review-manifest.md) and linked responses. Authority assurance remains `unavailable`.
- The same author ran the exact reported broker reconciliation after each terminal review. The final authenticated broker checkpoint returned `terminal`, with zero active reviews; both workspace authorities were accepted with no next action or claim. Documented broker stop succeeded and the follow-up status was offline. Registration/recovery journals remain preserved. Offline discovery still lists historical `reserved`/`manual` startup stages and recovery candidates; do not infer a new pending protocol turn or replay a launch from that advisory projection.
- Final installation and current-session doctor checks are healthy for the globally installed 0.4.1 runtime. The separate package-managed `automatic-required` resident-transport contract is not validated by these native/manual-protocol runs. Real MCP delivery evidence above proves the configured handoff waits independently of that contract.
