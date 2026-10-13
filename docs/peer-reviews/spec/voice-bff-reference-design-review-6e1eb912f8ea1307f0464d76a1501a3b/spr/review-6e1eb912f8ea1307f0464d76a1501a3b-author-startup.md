<!-- ai-peer-review-template version="1" digest="sha256:7555c0e7388bb1e33e4ec68e9f0387d9c25cf16764c1fe2139f718efee4456aa" -->

# Author startup

Review: `review-6e1eb912f8ea1307f0464d76a1501a3b`

Mode: `normal`

- Artifact: `/Users/kpburson/projects/AIVC/docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md`
- Workspace: `/Users/kpburson/projects/AIVC/.scratch/peer-review/review-6e1eb912f8ea1307f0464d76a1501a3b`
- Response: `/Users/kpburson/projects/AIVC/docs/peer-reviews/spec/2026-10-13-2026-10-12-voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/review-6e1eb912f8ea1307f0464d76a1501a3b-reviewer-response-1.md`
- Reviewer invitation: `/Users/kpburson/projects/AIVC/docs/peer-reviews/spec/2026-10-13-2026-10-12-voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/review-6e1eb912f8ea1307f0464d76a1501a3b-reviewer-invitation.md`
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

When the project-local broker is active, yield after each handoff; do not poll or repeat wait calls. Inspect `peer-review broker status --json` for authenticated instance state. After a failure, preserve receipts and run `peer-review broker reconcile /Users/kpburson/projects/AIVC/.scratch/peer-review/review-6e1eb912f8ea1307f0464d76a1501a3b --json` only when the exact recovery evidence calls for it. A broker failure never silently changes the selected reviewer or transport. If the broker is unavailable for an existing manual review, use the bounded `peer-review status /Users/kpburson/projects/AIVC/.scratch/peer-review/review-6e1eb912f8ea1307f0464d76a1501a3b --next` recovery path.

Installed help: `peer-review status --help`

Installed-package help: `npx --no-install ai-peer-review status --help`
