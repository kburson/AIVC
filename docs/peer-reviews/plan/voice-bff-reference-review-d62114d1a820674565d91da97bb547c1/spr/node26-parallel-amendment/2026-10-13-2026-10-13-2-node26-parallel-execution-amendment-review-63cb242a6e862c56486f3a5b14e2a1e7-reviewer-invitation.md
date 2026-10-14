> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/node26-parallel-amendment/2026-10-13-2026-10-13-2-node26-parallel-execution-amendment-review-63cb242a6e862c56486f3a5b14e2a1e7-reviewer-invitation.md) and its exact bytes remain available in the [evidence archive](../../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `430e36ec93506bf65cf192028667cc0e56a72cfc69a4d7a7cb88a7e7777d267d`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:064952674640611160aff00e947b64de060d4a4cfe7139019eb0f24ee264aa25" -->
<!-- ai-peer-review-invitation data="ewogICJhcnRpZmFjdCI6ICIvVXNlcnMva3BidXJzb24vcHJvamVjdHMvQUlWQy9kb2NzL3N1cGVycG93ZXJzL3BsYW5zLzIwMjYtMTAtMTMtMi1ub2RlMjYtcGFyYWxsZWwtZXhlY3V0aW9uLWFtZW5kbWVudC5tZCIsCiAgInJlc3BvbnNlIjogIi9Vc2Vycy9rcGJ1cnNvbi9wcm9qZWN0cy9BSVZDL2RvY3MvcGVlci1yZXZpZXdzL3BsYW4vdm9pY2UtYmZmLXJlZmVyZW5jZS1yZXZpZXctZDYyMTE0ZDFhODIwNjc0NTY1ZDkxZGE5N2JiNTQ3YzEvc3ByL25vZGUyNi1wYXJhbGxlbC1hbWVuZG1lbnQvMjAyNi0xMC0xMy0yMDI2LTEwLTEzLTItbm9kZTI2LXBhcmFsbGVsLWV4ZWN1dGlvbi1hbWVuZG1lbnQtcmV2aWV3LTYzY2IyNDJhNmU4NjJjNTY0ODZmM2E1YjE0ZTJhMWU3LXJldmlld2VyLXJlc3BvbnNlLTEubWQiLAogICJyZXZpZXdfaWQiOiAicmV2aWV3LTYzY2IyNDJhNmU4NjJjNTY0ODZmM2E1YjE0ZTJhMWU3IiwKICAic2NoZW1hIjogImFpLXBlZXItcmV2aWV3Lmludml0YXRpb24tcm91dGluZy92MSIsCiAgIndvcmtzcGFjZSI6ICIvVXNlcnMva3BidXJzb24vcHJvamVjdHMvQUlWQy8uc2NyYXRjaC9wZWVyLXJldmlldy9yZXZpZXctNjNjYjI0MmE2ZTg2MmM1NjQ4NmYzYTViMTRlMmExZTciCn0K" -->

# Reviewer invitation

Review: `review-63cb242a6e862c56486f3a5b14e2a1e7`

Mode: `normal`

- Artifact: `/Users/kpburson/projects/AIVC/docs/superpowers/plans/2026-10-13-2-node26-parallel-execution-amendment.md`
- Workspace: `/Users/kpburson/projects/AIVC/.scratch/peer-review/review-63cb242a6e862c56486f3a5b14e2a1e7`
- Response: `/Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/node26-parallel-amendment/2026-10-13-2026-10-13-2-node26-parallel-execution-amendment-review-63cb242a6e862c56486f3a5b14e2a1e7-reviewer-response-1.md`
- Invitation: `/Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/node26-parallel-amendment/2026-10-13-2026-10-13-2-node26-parallel-execution-amendment-review-63cb242a6e862c56486f3a5b14e2a1e7-reviewer-invitation.md`
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

When the project-local broker is active, yield after each handoff; do not poll or repeat wait calls. Inspect `peer-review broker status --json` for authenticated instance state. After a failure, preserve receipts and run `peer-review broker reconcile /Users/kpburson/projects/AIVC/.scratch/peer-review/review-63cb242a6e862c56486f3a5b14e2a1e7 --json` only when the exact recovery evidence calls for it. A broker failure never silently changes the selected reviewer or transport. If the broker is unavailable for an existing manual review, use the bounded `peer-review status /Users/kpburson/projects/AIVC/.scratch/peer-review/review-63cb242a6e862c56486f3a5b14e2a1e7 --next` recovery path.

Role: reviewer. Join from a distinct session in the same physical worktree.

Installed join: `peer-review join /Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/node26-parallel-amendment/2026-10-13-2026-10-13-2-node26-parallel-execution-amendment-review-63cb242a6e862c56486f3a5b14e2a1e7-reviewer-invitation.md`

Installed-package join: `npx --no-install ai-peer-review join /Users/kpburson/projects/AIVC/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/node26-parallel-amendment/2026-10-13-2026-10-13-2-node26-parallel-execution-amendment-review-63cb242a6e862c56486f3a5b14e2a1e7-reviewer-invitation.md`

Rules of engagement:

- Edit only the exact pending reviewer response shown above.
- Do not edit the reviewed artifact, create commits, or push.
- Query `peer-review help join` instead of guessing command syntax.

Recovery: `peer-review resume /Users/kpburson/projects/AIVC/.scratch/peer-review/review-63cb242a6e862c56486f3a5b14e2a1e7`
