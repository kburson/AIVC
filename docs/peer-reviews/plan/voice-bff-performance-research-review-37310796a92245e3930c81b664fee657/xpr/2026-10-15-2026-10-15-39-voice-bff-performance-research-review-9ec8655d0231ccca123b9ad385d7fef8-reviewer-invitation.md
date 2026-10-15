<!-- ai-peer-review-template version="1" digest="sha256:064952674640611160aff00e947b64de060d4a4cfe7139019eb0f24ee264aa25" -->
<!-- ai-peer-review-invitation data="ewogICJhcnRpZmFjdCI6ICIvVXNlcnMva3BidXJzb24vcHJvamVjdHMvQUlWQy9kb2NzL3N1cGVycG93ZXJzL3BsYW5zLzIwMjYtMTAtMTUtMzktdm9pY2UtYmZmLXBlcmZvcm1hbmNlLXJlc2VhcmNoLm1kIiwKICAicmVzcG9uc2UiOiAiL1VzZXJzL2twYnVyc29uL3Byb2plY3RzL0FJVkMvZG9jcy9wZWVyLXJldmlld3MvcGxhbi92b2ljZS1iZmYtcGVyZm9ybWFuY2UtcmVzZWFyY2gtcmV2aWV3LTM3MzEwNzk2YTkyMjQ1ZTM5MzBjODFiNjY0ZmVlNjU3L3hwci8yMDI2LTEwLTE1LTIwMjYtMTAtMTUtMzktdm9pY2UtYmZmLXBlcmZvcm1hbmNlLXJlc2VhcmNoLXJldmlldy05ZWM4NjU1ZDAyMzFjY2NhMTIzYjlhZDM4NWQ3ZmVmOC1yZXZpZXdlci1yZXNwb25zZS0xLm1kIiwKICAicmV2aWV3X2lkIjogInJldmlldy05ZWM4NjU1ZDAyMzFjY2NhMTIzYjlhZDM4NWQ3ZmVmOCIsCiAgInNjaGVtYSI6ICJhaS1wZWVyLXJldmlldy5pbnZpdGF0aW9uLXJvdXRpbmcvdjEiLAogICJ3b3Jrc3BhY2UiOiAiL1VzZXJzL2twYnVyc29uL3Byb2plY3RzL0FJVkMvLnNjcmF0Y2gvcGVlci1yZXZpZXcvcmV2aWV3LTllYzg2NTVkMDIzMWNjY2ExMjNiOWFkMzg1ZDdmZWY4Igp9Cg" -->

# Reviewer invitation

Review: `review-9ec8655d0231ccca123b9ad385d7fef8`

Mode: `normal`

- Artifact: `/Users/kpburson/projects/AIVC/docs/superpowers/plans/2026-10-15-39-voice-bff-performance-research.md`
- Workspace: `/Users/kpburson/projects/AIVC/.scratch/peer-review/review-9ec8655d0231ccca123b9ad385d7fef8`
- Response: `/Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-reviewer-response-1.md`
- Invitation: `/Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-reviewer-invitation.md`
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

When the project-local broker is active, yield after each handoff; do not poll or repeat wait calls. Inspect `peer-review broker status --json` for authenticated instance state. After a failure, preserve receipts and run `peer-review broker reconcile /Users/kpburson/projects/AIVC/.scratch/peer-review/review-9ec8655d0231ccca123b9ad385d7fef8 --json` only when the exact recovery evidence calls for it. A broker failure never silently changes the selected reviewer or transport. If the broker is unavailable for an existing manual review, use the bounded `peer-review status /Users/kpburson/projects/AIVC/.scratch/peer-review/review-9ec8655d0231ccca123b9ad385d7fef8 --next` recovery path.

Role: reviewer. Join from a distinct session in the same physical worktree.

Installed join: `peer-review join /Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-reviewer-invitation.md`

Installed-package join: `npx --no-install ai-peer-review join /Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-reviewer-invitation.md`

Rules of engagement:

- Edit only the exact pending reviewer response shown above.
- Do not edit the reviewed artifact, create commits, or push.
- Query `peer-review help join` instead of guessing command syntax.

Recovery: `peer-review resume /Users/kpburson/projects/AIVC/.scratch/peer-review/review-9ec8655d0231ccca123b9ad385d7fef8`
