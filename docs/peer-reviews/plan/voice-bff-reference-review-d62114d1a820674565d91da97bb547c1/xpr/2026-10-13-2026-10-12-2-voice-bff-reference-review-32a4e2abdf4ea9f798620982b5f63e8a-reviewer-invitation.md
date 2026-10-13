<!-- ai-peer-review-template version="1" digest="sha256:064952674640611160aff00e947b64de060d4a4cfe7139019eb0f24ee264aa25" -->
<!-- ai-peer-review-invitation data="ewogICJhcnRpZmFjdCI6ICIvVXNlcnMva3BidXJzb24vcHJvamVjdHMvQUlWQy9kb2NzL3N1cGVycG93ZXJzL3BsYW5zLzIwMjYtMTAtMTItMi12b2ljZS1iZmYtcmVmZXJlbmNlLm1kIiwKICAicmVzcG9uc2UiOiAiL1VzZXJzL2twYnVyc29uL3Byb2plY3RzL0FJVkMvZG9jcy9wZWVyLXJldmlld3MvcGxhbi92b2ljZS1iZmYtcmVmZXJlbmNlLXJldmlldy1kNjIxMTRkMWE4MjA2NzQ1NjVkOTFkYTk3YmI1NDdjMS94cHIvMjAyNi0xMC0xMy0yMDI2LTEwLTEyLTItdm9pY2UtYmZmLXJlZmVyZW5jZS1yZXZpZXctMzJhNGUyYWJkZjRlYTlmNzk4NjIwOTgyYjVmNjNlOGEtcmV2aWV3ZXItcmVzcG9uc2UtMS5tZCIsCiAgInJldmlld19pZCI6ICJyZXZpZXctMzJhNGUyYWJkZjRlYTlmNzk4NjIwOTgyYjVmNjNlOGEiLAogICJzY2hlbWEiOiAiYWktcGVlci1yZXZpZXcuaW52aXRhdGlvbi1yb3V0aW5nL3YxIiwKICAid29ya3NwYWNlIjogIi9Vc2Vycy9rcGJ1cnNvbi9wcm9qZWN0cy9BSVZDLy5zY3JhdGNoL3BlZXItcmV2aWV3L3Jldmlldy0zMmE0ZTJhYmRmNGVhOWY3OTg2MjA5ODJiNWY2M2U4YSIKfQo" -->

# Reviewer invitation

Review: `review-32a4e2abdf4ea9f798620982b5f63e8a`

Mode: `normal`

- Artifact: `/Users/kpburson/projects/AIVC/docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md`
- Workspace: `/Users/kpburson/projects/AIVC/.scratch/peer-review/review-32a4e2abdf4ea9f798620982b5f63e8a`
- Response: `/Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/2026-10-13-2026-10-12-2-voice-bff-reference-review-32a4e2abdf4ea9f798620982b5f63e8a-reviewer-response-1.md`
- Invitation: `/Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/2026-10-13-2026-10-12-2-voice-bff-reference-review-32a4e2abdf4ea9f798620982b5f63e8a-reviewer-invitation.md`
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

When the project-local broker is active, yield after each handoff; do not poll or repeat wait calls. Inspect `peer-review broker status --json` for authenticated instance state. After a failure, preserve receipts and run `peer-review broker reconcile /Users/kpburson/projects/AIVC/.scratch/peer-review/review-32a4e2abdf4ea9f798620982b5f63e8a --json` only when the exact recovery evidence calls for it. A broker failure never silently changes the selected reviewer or transport. If the broker is unavailable for an existing manual review, use the bounded `peer-review status /Users/kpburson/projects/AIVC/.scratch/peer-review/review-32a4e2abdf4ea9f798620982b5f63e8a --next` recovery path.

Role: reviewer. Join from a distinct session in the same physical worktree.

Installed join: `peer-review join /Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/2026-10-13-2026-10-12-2-voice-bff-reference-review-32a4e2abdf4ea9f798620982b5f63e8a-reviewer-invitation.md`

Installed-package join: `npx --no-install ai-peer-review join /Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/2026-10-13-2026-10-12-2-voice-bff-reference-review-32a4e2abdf4ea9f798620982b5f63e8a-reviewer-invitation.md`

Rules of engagement:

- Edit only the exact pending reviewer response shown above.
- Do not edit the reviewed artifact, create commits, or push.
- Query `peer-review help join` instead of guessing command syntax.

Recovery: `peer-review resume /Users/kpburson/projects/AIVC/.scratch/peer-review/review-32a4e2abdf4ea9f798620982b5f63e8a`
