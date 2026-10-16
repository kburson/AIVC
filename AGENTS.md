<!-- ai-task-manager:codex-superpowers:start -->

## AI Task Manager: Codex Superpowers Bootstrap

AITM added this this workspace AGENTS.md block to approximate Claude Code Superpowers startup behavior in Codex.

- At the start of a new Codex conversation in this workspace, if the `using-superpowers` skill is available, load it before acting.
- Before planning, debugging, testing, implementing, dispatching agents, using worktrees, finishing a branch, or handling review, check whether a matching Superpowers skill is available and follow it.
- Treat Superpowers skills as optional mirrored Codex skills under `~/.codex/skills`; AITM does not install Superpowers as a package dependency.
- Keep AI Task Manager task workflow instructions separate at `.agents/skills/task/SKILL.md`.

**FORBIDDEN — breaks the issue workflow, must never be done:**

- Never call `gh issue create` directly. Always use `scripts/gh/create-issue.mjs --shape <stub|epic|sub-issue|solo|defect>`. Direct calls skip project tether, `aitm-fields` injection, placeholder substitution, and assignee/priority gates — the resulting issue cannot be closed via the normal workflow.
- Never call `move-state.mjs <N> <state>` directly to jump to an arbitrary kanban state. Always use `/task promote` (or `next`) to advance one step and `/task demote` to step back — they enforce one-step-at-a-time movement and prevent stage-skipping (e.g., jumping from backlog straight to development).

### State Transition Verb Map (8-state model)

States: `Backlog → Refine → Ready for Planning → Plan → Develop → Test → Review → Done`.

- `/task promote #N` or `/task next #N` — advance one state along the chain when no dedicated stage verb applies.
- `/task refine #N --size <XS|S|M|L|XL> --estimate <hours> --priority <p0|p1|p2> --rank <N> --reason "<text>"` — Backlog → Refine with required fields.
- `/task plan #N` — Ready for Planning → Plan for Sprint-Planning entry; distinct from `/task discover`.
- `/task plan-approve #N` — records the Plan-approval marker required before Develop.
- `/task test #N` — Develop → Test after implementation verification.
- `/task approve #N` — records human review-approval marker on a Review-state issue (gate for `close`).
- `/task close #N` — Review → Done (refused unless `approve` marker present)

Test → Review: agent self-report REVIEW_COMPLETE (no CLI verb).
<!-- ai-task-manager:codex-superpowers:end -->

## Native AI peer review

For user-requested Codex fanout reviews, read `.codex/peer-review-orchestration.md` alongside the installed `peer-review` skill. Use native launch and supervision with the sealed ai-peer-review protocol. The established native workflow uses explicit manual protocol transport and authentic MCP handoff waits; `automatic-required` checks the separate package-managed resident transport and is not a prerequisite for ordinary Codex agent spawning. Preserve genuine distinct session identities, requested per-run model/effort selections, tracked issue binding, and all author/reviewer boundaries.

All SAR/SPR/XPR collateral for one artifact must share `docs/peer-reviews/<kind>/<artifact-slug>-<group-review-id>/{sar|spr|xpr}/`. For the voice BFF reference design, use `docs/peer-reviews/spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/`. Follow the explicit per-run path-template instructions in `.codex/peer-review-orchestration.md`; preserve sealed historical bytes when relocating terminal evidence.

## Cloud story delivery

The owner requires every active story to have a pushed, fetchable branch and an open draft PR from the start of its authored work. Keep each branch and PR current with its specification, accepted plan, review reports, and selected verification/provenance collateral. Commit documentation checkpoints while implementation is dependency-gated; a draft PR does not authorize a lifecycle transition.

Epic #2 child PRs target `codex/2-draft`; the feature integration PR targets `trunk`. A separate solo story uses its recorded base. Push normally and preserve existing remote history. Exclude credentials, machine-local bindings, and raw secret-bearing logs.

Before Done, verify the story PR is actually merged into its target and its accepted source is reachable there. Keep registered AITM Test, Review, approval, and Close gates. Historical local delivery and later cloud backfill must retain distinct dates and provenance; do not manufacture a package-managed provider-action envelope or delivery receipt. Use the sanctioned GitHub integration with an exact expected head SHA for an owner-authorized cloud merge.
