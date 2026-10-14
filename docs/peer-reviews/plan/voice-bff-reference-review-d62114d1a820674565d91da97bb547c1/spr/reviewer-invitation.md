> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/reviewer-invitation.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `668481aeee868b70f982e1efe5de3bd632de45e9a8d3cb516fb50144a2de18e6`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:064952674640611160aff00e947b64de060d4a4cfe7139019eb0f24ee264aa25" -->
<!-- ai-peer-review-invitation data="ewogICJhcnRpZmFjdCI6ICIvVXNlcnMva3BidXJzb24vcHJvamVjdHMvQUlWQy9kb2NzL3N1cGVycG93ZXJzL3BsYW5zLzIwMjYtMTAtMTItMi12b2ljZS1iZmYtcmVmZXJlbmNlLm1kIiwKICAicmVzcG9uc2UiOiAiL1VzZXJzL2twYnVyc29uL3Byb2plY3RzL0FJVkMvZG9jcy9wZWVyLXJldmlld3MvcGxhbi92b2ljZS1iZmYtcmVmZXJlbmNlLXJldmlldy1kNjIxMTRkMWE4MjA2NzQ1NjVkOTFkYTk3YmI1NDdjMS9zcHIvcmV2aWV3ZXItcmVzcG9uc2UtMS5tZCIsCiAgInJldmlld19pZCI6ICJyZXZpZXctZDYyMTE0ZDFhODIwNjc0NTY1ZDkxZGE5N2JiNTQ3YzEiLAogICJzY2hlbWEiOiAiYWktcGVlci1yZXZpZXcuaW52aXRhdGlvbi1yb3V0aW5nL3YxIiwKICAid29ya3NwYWNlIjogIi9Vc2Vycy9rcGJ1cnNvbi9wcm9qZWN0cy9BSVZDLy5zY3JhdGNoL3BlZXItcmV2aWV3L3Jldmlldy1kNjIxMTRkMWE4MjA2NzQ1NjVkOTFkYTk3YmI1NDdjMSIKfQo" -->

# Reviewer invitation

Review: `review-d62114d1a820674565d91da97bb547c1`

Mode: `normal`

- Artifact: `/Users/kpburson/projects/AIVC/docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md`
- Workspace: `/Users/kpburson/projects/AIVC/.scratch/peer-review/review-d62114d1a820674565d91da97bb547c1`
- Response: `/Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/reviewer-response-1.md`
- Invitation: `/Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/reviewer-invitation.md`
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

Phased sessions remain event-authoritative. After a non-final acceptance, the registered author finalizes and advances the exact next artifact; resume only from the generated reviewer response and never infer or skip a phase from chat.

When the project-local broker is active, yield after each handoff; do not poll or repeat wait calls. Inspect `peer-review broker status --json` for authenticated instance state. After a failure, preserve receipts and run `peer-review broker reconcile /Users/kpburson/projects/AIVC/.scratch/peer-review/review-d62114d1a820674565d91da97bb547c1 --json` only when the exact recovery evidence calls for it. A broker failure never silently changes the selected reviewer or transport. If the broker is unavailable for an existing manual review, use the bounded `peer-review status /Users/kpburson/projects/AIVC/.scratch/peer-review/review-d62114d1a820674565d91da97bb547c1 --next` recovery path.

Role: reviewer. Join from a distinct session in the same physical worktree.

Installed join: `peer-review join /Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/reviewer-invitation.md`

Installed-package join: `npx --no-install ai-peer-review join /Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/reviewer-invitation.md`

Rules of engagement:

- Edit only the exact pending reviewer response shown above.
- Do not edit the reviewed artifact, create commits, or push.
- Query `peer-review help join` instead of guessing command syntax.

Recovery: `peer-review resume /Users/kpburson/projects/AIVC/.scratch/peer-review/review-d62114d1a820674565d91da97bb547c1`
