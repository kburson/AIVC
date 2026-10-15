<!-- ai-peer-review-template version="1" digest="sha256:064952674640611160aff00e947b64de060d4a4cfe7139019eb0f24ee264aa25" -->
<!-- ai-peer-review-invitation data="ewogICJhcnRpZmFjdCI6ICIvVXNlcnMva3BidXJzb24vLmNvZGV4L3dvcmt0cmVlcy92b2ljZS1iZmYtc3RvcnktMTEvQUlWQy9kb2NzL3N1cGVycG93ZXJzL3NwZWNzLzIwMjYtMTAtMTUtMTEtbGl2ZS1hY2NlcHRhbmNlLWFtZW5kbWVudC1kZXNpZ24ubWQiLAogICJyZXNwb25zZSI6ICIvVXNlcnMva3BidXJzb24vLmNvZGV4L3dvcmt0cmVlcy92b2ljZS1iZmYtc3RvcnktMTEvQUlWQy9kb2NzL3BlZXItcmV2aWV3cy9zcGVjL2xpdmUtYWNjZXB0YW5jZS1hbWVuZG1lbnQtcmV2aWV3LWQzN2FiZjk4MzFiOWNjMzA1ODNkMGRmOWVmNDdkMmY5L3Nwci9yZXZpZXdlci1yZXNwb25zZS0xLm1kIiwKICAicmV2aWV3X2lkIjogInJldmlldy1kMzdhYmY5ODMxYjljYzMwNTgzZDBkZjllZjQ3ZDJmOSIsCiAgInNjaGVtYSI6ICJhaS1wZWVyLXJldmlldy5pbnZpdGF0aW9uLXJvdXRpbmcvdjEiLAogICJ3b3Jrc3BhY2UiOiAiL1VzZXJzL2twYnVyc29uLy5jb2RleC93b3JrdHJlZXMvdm9pY2UtYmZmLXN0b3J5LTExL0FJVkMvLnNjcmF0Y2gvcGVlci1yZXZpZXcvcmV2aWV3LWQzN2FiZjk4MzFiOWNjMzA1ODNkMGRmOWVmNDdkMmY5Igp9Cg" -->

# Reviewer invitation

Review: `review-d37abf9831b9cc30583d0df9ef47d2f9`

Mode: `normal`

- Artifact: `/Users/kpburson/.codex/worktrees/voice-bff-story-11/AIVC/docs/superpowers/specs/2026-10-15-11-live-acceptance-amendment-design.md`
- Workspace: `/Users/kpburson/.codex/worktrees/voice-bff-story-11/AIVC/.scratch/peer-review/review-d37abf9831b9cc30583d0df9ef47d2f9`
- Response: `/Users/kpburson/.codex/worktrees/voice-bff-story-11/AIVC/docs/peer-reviews/spec/live-acceptance-amendment-review-d37abf9831b9cc30583d0df9ef47d2f9/spr/reviewer-response-1.md`
- Invitation: `/Users/kpburson/.codex/worktrees/voice-bff-story-11/AIVC/docs/peer-reviews/spec/live-acceptance-amendment-review-d37abf9831b9cc30583d0df9ef47d2f9/spr/reviewer-invitation.md`
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

When the project-local broker is active, yield after each handoff; do not poll or repeat wait calls. Inspect `peer-review broker status --json` for authenticated instance state. After a failure, preserve receipts and run `peer-review broker reconcile /Users/kpburson/.codex/worktrees/voice-bff-story-11/AIVC/.scratch/peer-review/review-d37abf9831b9cc30583d0df9ef47d2f9 --json` only when the exact recovery evidence calls for it. A broker failure never silently changes the selected reviewer or transport. If the broker is unavailable for an existing manual review, use the bounded `peer-review status /Users/kpburson/.codex/worktrees/voice-bff-story-11/AIVC/.scratch/peer-review/review-d37abf9831b9cc30583d0df9ef47d2f9 --next` recovery path.

Role: reviewer. Join from a distinct session in the same physical worktree.

Installed join: `peer-review join /Users/kpburson/.codex/worktrees/voice-bff-story-11/AIVC/docs/peer-reviews/spec/live-acceptance-amendment-review-d37abf9831b9cc30583d0df9ef47d2f9/spr/reviewer-invitation.md`

Installed-package join: `npx --no-install ai-peer-review join /Users/kpburson/.codex/worktrees/voice-bff-story-11/AIVC/docs/peer-reviews/spec/live-acceptance-amendment-review-d37abf9831b9cc30583d0df9ef47d2f9/spr/reviewer-invitation.md`

Rules of engagement:

- Edit only the exact pending reviewer response shown above.
- Do not edit the reviewed artifact, create commits, or push.
- Query `peer-review help join` instead of guessing command syntax.

Recovery: `peer-review resume /Users/kpburson/.codex/worktrees/voice-bff-story-11/AIVC/.scratch/peer-review/review-d37abf9831b9cc30583d0df9ef47d2f9`
