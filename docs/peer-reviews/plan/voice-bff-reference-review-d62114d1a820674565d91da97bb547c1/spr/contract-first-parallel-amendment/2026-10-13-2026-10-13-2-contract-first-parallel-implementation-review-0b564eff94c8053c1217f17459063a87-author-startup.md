> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/contract-first-parallel-amendment/2026-10-13-2026-10-13-2-contract-first-parallel-implementation-review-0b564eff94c8053c1217f17459063a87-author-startup.md) and its exact bytes remain available in the [evidence archive](../../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `c29a593c5aece055b07905a661b11c7e1b4a009b976203c5af36a3bd139cf3b6`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:7555c0e7388bb1e33e4ec68e9f0387d9c25cf16764c1fe2139f718efee4456aa" -->

# Author startup

Review: `review-0b564eff94c8053c1217f17459063a87`

Mode: `normal`

- Artifact: `/Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md`
- Workspace: `/Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/.scratch/peer-review/review-0b564eff94c8053c1217f17459063a87`
- Response: `/Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/contract-first-parallel-amendment/2026-10-13-2026-10-13-2-contract-first-parallel-implementation-review-0b564eff94c8053c1217f17459063a87-reviewer-response-1.md`
- Reviewer invitation: `/Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/contract-first-parallel-amendment/2026-10-13-2026-10-13-2-contract-first-parallel-implementation-review-0b564eff94c8053c1217f17459063a87-reviewer-invitation.md`
- Reviewer: `gpt-6-astra` (`gpt-6-astra`), effort: `high`
- Runtime: SPR, project-local broker

## Communication policy (v1)

Keep all peer-review chat messages terse. Put complete review analysis, findings, dispositions, revised prose, rationale, decisions, and verification evidence in the generated durable review documents.

Chat may contain only:

- a short operational status;
- a pointer to the relevant durable document;
- the exact next action; or
- a concise blocker requiring human action.

Read the relevant durable reviewer or author response document; do not rely on a chat summary. Do not paste findings, dispositions, revised prose, verification output, or other durable document content into chat unless the human explicitly requests it.

“Terse chat” does not mean terse review evidence. Durable reviewer and author response documents remain complete, self-contained, and authoritative.

## Project-local broker and recovery

Phased sessions remain event-authoritative. After a non-final acceptance, finalize the current artifact and follow the single `peer-review advance <workspace> <artifact>` action emitted by `status --next`; never infer or skip a phase from chat.

When the project-local broker is active, yield after each handoff; do not poll or repeat wait calls. Inspect `peer-review broker status --json` for authenticated instance state. After a failure, preserve receipts and run `peer-review broker reconcile /Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/.scratch/peer-review/review-0b564eff94c8053c1217f17459063a87 --json` only when the exact recovery evidence calls for it. A broker failure never silently changes the selected reviewer or transport. If the broker is unavailable for an existing manual review, use the bounded `peer-review status /Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/.scratch/peer-review/review-0b564eff94c8053c1217f17459063a87 --next` recovery path.

Installed help: `peer-review status --help`

Installed-package help: `npx --no-install ai-peer-review status --help`
