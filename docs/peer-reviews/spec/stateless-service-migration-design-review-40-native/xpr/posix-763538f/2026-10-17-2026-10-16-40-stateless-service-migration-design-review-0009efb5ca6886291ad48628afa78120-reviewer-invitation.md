<!-- ai-peer-review-template version="1" digest="sha256:83e1152f236d0468d42cccebe89136e5a97d44849991b9fab7acd33965d739bd" -->
<!-- ai-peer-review-invitation data="ewogICJhcnRpZmFjdCI6ICIvVXNlcnMva3BidXJzb24vLmNvZGV4L3dvcmt0cmVlcy9jZGY2L0FJVkMvZG9jcy9zdXBlcnBvd2Vycy9zcGVjcy8yMDI2LTEwLTE2LTQwLXN0YXRlbGVzcy1zZXJ2aWNlLW1pZ3JhdGlvbi1kZXNpZ24ubWQiLAogICJyZXNwb25zZSI6ICIvVXNlcnMva3BidXJzb24vLmNvZGV4L3dvcmt0cmVlcy9jZGY2L0FJVkMvZG9jcy9wZWVyLXJldmlld3Mvc3BlYy9zdGF0ZWxlc3Mtc2VydmljZS1taWdyYXRpb24tZGVzaWduLXJldmlldy00MC1uYXRpdmUveHByL3Bvc2l4LTc2MzUzOGYvMjAyNi0xMC0xNy0yMDI2LTEwLTE2LTQwLXN0YXRlbGVzcy1zZXJ2aWNlLW1pZ3JhdGlvbi1kZXNpZ24tcmV2aWV3LTAwMDllZmI1Y2E2ODg2MjkxYWQ0ODYyOGFmYTc4MTIwLXJldmlld2VyLXJlc3BvbnNlLTEubWQiLAogICJyZXZpZXdfaWQiOiAicmV2aWV3LTAwMDllZmI1Y2E2ODg2MjkxYWQ0ODYyOGFmYTc4MTIwIiwKICAic2NoZW1hIjogImFpLXBlZXItcmV2aWV3Lmludml0YXRpb24tcm91dGluZy92MSIsCiAgIndvcmtzcGFjZSI6ICIvVXNlcnMva3BidXJzb24vLmNvZGV4L3dvcmt0cmVlcy9jZGY2L0FJVkMvLnNjcmF0Y2gvcGVlci1yZXZpZXcvcmV2aWV3LTAwMDllZmI1Y2E2ODg2MjkxYWQ0ODYyOGFmYTc4MTIwIgp9Cg" -->

# Reviewer invitation

Review: `review-0009efb5ca6886291ad48628afa78120`

> **LOCAL JOURNAL MODE** — authority assurance: `unavailable`

- Artifact: `/Users/kpburson/.codex/worktrees/cdf6/AIVC/docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md`
- Workspace: `/Users/kpburson/.codex/worktrees/cdf6/AIVC/.scratch/peer-review/review-0009efb5ca6886291ad48628afa78120`
- Response: `/Users/kpburson/.codex/worktrees/cdf6/AIVC/docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-reviewer-response-1.md`
- Invitation: `/Users/kpburson/.codex/worktrees/cdf6/AIVC/docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-reviewer-invitation.md`
- Reviewer: `claude-opus-5-5` (`claude-opus-5-5`), effort: `high`
- Runtime: XPR, local filepath handoff

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

When the project-local broker is active, yield after each handoff; do not poll or repeat wait calls. Inspect `peer-review broker status --json` for authenticated instance state. After a failure, preserve receipts and run `peer-review broker reconcile /Users/kpburson/.codex/worktrees/cdf6/AIVC/.scratch/peer-review/review-0009efb5ca6886291ad48628afa78120 --json` only when the exact recovery evidence calls for it. A broker failure never silently changes the selected reviewer or transport. If the broker is unavailable for an existing manual review, use the bounded `peer-review status /Users/kpburson/.codex/worktrees/cdf6/AIVC/.scratch/peer-review/review-0009efb5ca6886291ad48628afa78120 --next` recovery path.

Role: reviewer. Join from a distinct session in the same physical worktree.

Installed join: `peer-review join /Users/kpburson/.codex/worktrees/cdf6/AIVC/docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-reviewer-invitation.md`

Installed-package join: `npx --no-install ai-peer-review join /Users/kpburson/.codex/worktrees/cdf6/AIVC/docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-reviewer-invitation.md`

Rules of engagement:

- Edit only `/Users/kpburson/.codex/worktrees/cdf6/AIVC/docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-reviewer-response-1.md`, the exact pending reviewer response shown above.
- Do not edit the reviewed artifact, create commits, or push.
- Do not write any other tracked, untracked, ignored or new files, Git metadata, automation-owned coordination records, another response or anything outside the project.
- Existing human-launched sessions are instruction-bound: these instructions do not change their host permissions. Automatically launched sessions use the provider's existing exact response restriction where supported.
- Query `peer-review help join` instead of guessing command syntax.

Recovery: `peer-review resume /Users/kpburson/.codex/worktrees/cdf6/AIVC/.scratch/peer-review/review-0009efb5ca6886291ad48628afa78120`
