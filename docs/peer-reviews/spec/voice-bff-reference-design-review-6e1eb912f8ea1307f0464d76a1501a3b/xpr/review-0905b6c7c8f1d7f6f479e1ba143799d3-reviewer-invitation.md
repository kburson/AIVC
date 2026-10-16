> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/xpr/review-0905b6c7c8f1d7f6f479e1ba143799d3-reviewer-invitation.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `86949f83762bb247d9dbb636de4ded16a4593fd7e73c6f329ab997fc535ad2ee`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:064952674640611160aff00e947b64de060d4a4cfe7139019eb0f24ee264aa25" -->
<!-- ai-peer-review-invitation data="ewogICJhcnRpZmFjdCI6ICIvVXNlcnMva3BidXJzb24vcHJvamVjdHMvQUlWQy9kb2NzL3N1cGVycG93ZXJzL3NwZWNzLzIwMjYtMTAtMTItdm9pY2UtYmZmLXJlZmVyZW5jZS1kZXNpZ24ubWQiLAogICJyZXNwb25zZSI6ICIvVXNlcnMva3BidXJzb24vcHJvamVjdHMvQUlWQy9kb2NzL3BlZXItcmV2aWV3cy8xL3hwci9zcGVjLzIwMjYtMTAtMTMtMjAyNi0xMC0xMi12b2ljZS1iZmYtcmVmZXJlbmNlLWRlc2lnbi1yZXZpZXctMDkwNWI2YzdjOGYxZDdmNmY0NzllMWJhMTQzNzk5ZDMvcmV2aWV3LTA5MDViNmM3YzhmMWQ3ZjZmNDc5ZTFiYTE0Mzc5OWQzLXJldmlld2VyLXJlc3BvbnNlLTEubWQiLAogICJyZXZpZXdfaWQiOiAicmV2aWV3LTA5MDViNmM3YzhmMWQ3ZjZmNDc5ZTFiYTE0Mzc5OWQzIiwKICAic2NoZW1hIjogImFpLXBlZXItcmV2aWV3Lmludml0YXRpb24tcm91dGluZy92MSIsCiAgIndvcmtzcGFjZSI6ICIvVXNlcnMva3BidXJzb24vcHJvamVjdHMvQUlWQy8uc2NyYXRjaC9wZWVyLXJldmlldy9yZXZpZXctMDkwNWI2YzdjOGYxZDdmNmY0NzllMWJhMTQzNzk5ZDMiCn0K" -->

# Reviewer invitation

Review: `review-0905b6c7c8f1d7f6f479e1ba143799d3`

Mode: `normal`

- Artifact: `/Users/kpburson/projects/AIVC/docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md`
- Workspace: `/Users/kpburson/projects/AIVC/.scratch/peer-review/review-0905b6c7c8f1d7f6f479e1ba143799d3`
- Response: `/Users/kpburson/projects/AIVC/docs/peer-reviews/1/xpr/spec/2026-10-13-2026-10-12-voice-bff-reference-design-review-0905b6c7c8f1d7f6f479e1ba143799d3/review-0905b6c7c8f1d7f6f479e1ba143799d3-reviewer-response-1.md`
- Invitation: `/Users/kpburson/projects/AIVC/docs/peer-reviews/1/xpr/spec/2026-10-13-2026-10-12-voice-bff-reference-design-review-0905b6c7c8f1d7f6f479e1ba143799d3/review-0905b6c7c8f1d7f6f479e1ba143799d3-reviewer-invitation.md`
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

When the project-local broker is active, yield after each handoff; do not poll or repeat wait calls. Inspect `peer-review broker status --json` for authenticated instance state. After a failure, preserve receipts and run `peer-review broker reconcile /Users/kpburson/projects/AIVC/.scratch/peer-review/review-0905b6c7c8f1d7f6f479e1ba143799d3 --json` only when the exact recovery evidence calls for it. A broker failure never silently changes the selected reviewer or transport. If the broker is unavailable for an existing manual review, use the bounded `peer-review status /Users/kpburson/projects/AIVC/.scratch/peer-review/review-0905b6c7c8f1d7f6f479e1ba143799d3 --next` recovery path.

Role: reviewer. Join from a distinct session in the same physical worktree.

Installed join: `peer-review join /Users/kpburson/projects/AIVC/docs/peer-reviews/1/xpr/spec/2026-10-13-2026-10-12-voice-bff-reference-design-review-0905b6c7c8f1d7f6f479e1ba143799d3/review-0905b6c7c8f1d7f6f479e1ba143799d3-reviewer-invitation.md`

Installed-package join: `npx --no-install ai-peer-review join /Users/kpburson/projects/AIVC/docs/peer-reviews/1/xpr/spec/2026-10-13-2026-10-12-voice-bff-reference-design-review-0905b6c7c8f1d7f6f479e1ba143799d3/review-0905b6c7c8f1d7f6f479e1ba143799d3-reviewer-invitation.md`

Rules of engagement:

- Edit only the exact pending reviewer response shown above.
- Do not edit the reviewed artifact, create commits, or push.
- Query `peer-review help join` instead of guessing command syntax.

Recovery: `peer-review resume /Users/kpburson/projects/AIVC/.scratch/peer-review/review-0905b6c7c8f1d7f6f479e1ba143799d3`
