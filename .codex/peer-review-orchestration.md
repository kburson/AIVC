# Native peer review in AIVC

Use the installed local-tarball ai-peer-review 0.4.1 protocol with native agent orchestration when the user requests Codex fanout. Keep this guide separate from the package-owned copied skill.

The coordinating agent launches and supervises the requested participants with native agent tools. For the requested two-child SPR, use fresh author and reviewer contexts and genuine distinct identities. Preserve the exact provider, model, effort, artifact, and tracked issue selection per run. Do not copy identity handles or pin model choices in project configuration.

The author runs `peer-review start` in its own session with the tracked issue and requested role selections. Relay only its sealed invitation to the reviewer, which runs `peer-review join` in its own session. Follow the installed procedure, exact generated paths, sealed submissions, and event-derived next actions. Only the author revises and finalizes; reviewer Git and write boundaries remain in force.

Use explicit `--transport-mode manual` for the established native-orchestrated protocol. The native coordinator relays the invitation and supervises existing sessions, so the human need not be a courier. This is the path used by the accepted AITM #1901 Astra SPR. Do not require `doctor --mode automatic-required` merely to spawn agents or run this protocol. That mode tests the separate package-managed automatic provider/resident transport contract. Never label native-orchestrated manual transport as a validated package-managed automatic transport.

The installed 0.4.1 MCP `wait_for_handoff` watches authentic `delivery-written` events and matching delivery receipts, which normal manual-protocol submissions also produce. Its implementation does not require `automatic-required`. Once a review exists, use the exact review ID, receiving role, and last observed sequence to wait for the next handoff; then read the authoritative response and next action. Do not invent IDs, events, receipts, leases, capabilities, or decisions. Use native agent waits for coordinator lifecycle notifications; do not poll the protocol while idle.

Keep the same participant sessions across rounds. Stop at acceptance and author finalization, the sealed turn limit, or an actual intervention. Launch, identity, and tool-attachment checks are preflight evidence; only a sealed submission and subsequent wait wake prove end-to-end operation.

## Evidence

- Native Sol 6.1/high author and Astra 6/high reviewer children were launched and responded with distinct session fingerprints. Both expose `wait_for_handoff`.
- The accepted AITM #1901 SPR used native Astra/high, manual transport, three sealed reviewer rounds, two author revisions, and normal finalization: https://github.com/kburson/ai-task-manager/blob/9a0156bf2d19cfd764775c5ccfabd971b3c57cb7/docs/peer-reviews/1901/plan/2026-10-08-plan-spr-record.md .
- Installed 0.4.1 implementation inspected: `src/startup/runtime.mjs` admits broker-owned manual SPR; `src/cli/run.mjs` writes handoff events during normal submissions; `src/protocol/service.mjs` projects delivery receipts; `src/transport/live-wait.mjs` and `src/mcp/server.mjs` wait on those receipts without an automatic-mode condition.
- AIVC's real spec review and MCP handoff test still require a tracked AIVC issue. No review has started or been accepted.
