> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/contract-first-parallel-amendment/2026-10-13-2026-10-13-2-contract-first-parallel-implementation-review-63ab7e25e4be96aca3960c251687c2e1-reviewer-invitation.md) and its exact bytes remain available in the [evidence archive](../../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `a0b9a0f6a703dc1e89f526c5336392811951e30777936e4eb5456a987df4bcb8`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:064952674640611160aff00e947b64de060d4a4cfe7139019eb0f24ee264aa25" -->
<!-- ai-peer-review-invitation data="ewogICJhcnRpZmFjdCI6ICIvVXNlcnMva3BidXJzb24vLmNvZGV4L3dvcmt0cmVlcy92b2ljZS1iZmYtZXBpYy0yL0FJVkMvZG9jcy9zdXBlcnBvd2Vycy9wbGFucy8yMDI2LTEwLTEzLTItY29udHJhY3QtZmlyc3QtcGFyYWxsZWwtaW1wbGVtZW50YXRpb24ubWQiLAogICJyZXNwb25zZSI6ICIvVXNlcnMva3BidXJzb24vLmNvZGV4L3dvcmt0cmVlcy92b2ljZS1iZmYtZXBpYy0yL0FJVkMvZG9jcy9wZWVyLXJldmlld3MvcGxhbi92b2ljZS1iZmYtcmVmZXJlbmNlLXJldmlldy1kNjIxMTRkMWE4MjA2NzQ1NjVkOTFkYTk3YmI1NDdjMS94cHIvY29udHJhY3QtZmlyc3QtcGFyYWxsZWwtYW1lbmRtZW50LzIwMjYtMTAtMTMtMjAyNi0xMC0xMy0yLWNvbnRyYWN0LWZpcnN0LXBhcmFsbGVsLWltcGxlbWVudGF0aW9uLXJldmlldy02M2FiN2UyNWU0YmU5NmFjYTM5NjBjMjUxNjg3YzJlMS1yZXZpZXdlci1yZXNwb25zZS0xLm1kIiwKICAicmV2aWV3X2lkIjogInJldmlldy02M2FiN2UyNWU0YmU5NmFjYTM5NjBjMjUxNjg3YzJlMSIsCiAgInNjaGVtYSI6ICJhaS1wZWVyLXJldmlldy5pbnZpdGF0aW9uLXJvdXRpbmcvdjEiLAogICJ3b3Jrc3BhY2UiOiAiL1VzZXJzL2twYnVyc29uLy5jb2RleC93b3JrdHJlZXMvdm9pY2UtYmZmLWVwaWMtMi9BSVZDLy5zY3JhdGNoL3BlZXItcmV2aWV3L3Jldmlldy02M2FiN2UyNWU0YmU5NmFjYTM5NjBjMjUxNjg3YzJlMSIKfQo" -->

# Reviewer invitation

Review: `review-63ab7e25e4be96aca3960c251687c2e1`

Mode: `normal`

- Artifact: `/Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md`
- Workspace: `/Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/.scratch/peer-review/review-63ab7e25e4be96aca3960c251687c2e1`
- Response: `/Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/contract-first-parallel-amendment/2026-10-13-2026-10-13-2-contract-first-parallel-implementation-review-63ab7e25e4be96aca3960c251687c2e1-reviewer-response-1.md`
- Invitation: `/Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/contract-first-parallel-amendment/2026-10-13-2026-10-13-2-contract-first-parallel-implementation-review-63ab7e25e4be96aca3960c251687c2e1-reviewer-invitation.md`
- Reviewer: `claude-opus-5-5` (`claude-opus-5-5`), effort: `high`
- Runtime: XPR, project-local broker

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

Phased sessions remain event-authoritative. After a non-final acceptance, the registered author finalizes and advances the exact next artifact; resume only from the generated reviewer response and never infer or skip a phase from chat.

When the project-local broker is active, yield after each handoff; do not poll or repeat wait calls. Inspect `peer-review broker status --json` for authenticated instance state. After a failure, preserve receipts and run `peer-review broker reconcile /Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/.scratch/peer-review/review-63ab7e25e4be96aca3960c251687c2e1 --json` only when the exact recovery evidence calls for it. A broker failure never silently changes the selected reviewer or transport. If the broker is unavailable for an existing manual review, use the bounded `peer-review status /Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/.scratch/peer-review/review-63ab7e25e4be96aca3960c251687c2e1 --next` recovery path.

Role: reviewer. Join from a distinct session in the same physical worktree.

Installed join: `peer-review join /Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/contract-first-parallel-amendment/2026-10-13-2026-10-13-2-contract-first-parallel-implementation-review-63ab7e25e4be96aca3960c251687c2e1-reviewer-invitation.md`

Installed-package join: `npx --no-install ai-peer-review join /Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/contract-first-parallel-amendment/2026-10-13-2026-10-13-2-contract-first-parallel-implementation-review-63ab7e25e4be96aca3960c251687c2e1-reviewer-invitation.md`

Rules of engagement:

- Edit only the exact pending reviewer response shown above.
- Do not edit the reviewed artifact, create commits, or push.
- Query `peer-review help join` instead of guessing command syntax.

Recovery: `peer-review resume /Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/.scratch/peer-review/review-63ab7e25e4be96aca3960c251687c2e1`
