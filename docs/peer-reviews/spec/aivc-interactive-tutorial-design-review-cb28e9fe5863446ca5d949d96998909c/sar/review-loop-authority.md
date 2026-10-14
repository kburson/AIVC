# SAR loop authority correction

Design story: [#15](https://github.com/kburson/AIVC/issues/15).

On October 13, 2026 the owner clarified: "an SAR implies a loop of review+revise until there is nothing left to revise."

This supersedes the one-pass stopping condition in the historical [initial request](review-request.md). That request and the [first Astra report](astra-sar-report.md) remain unchanged as evidence of the original pass. The earlier coordinator claim of completed SAR was premature: the pass completed, but its revisions-needed result leaves the SAR loop open.

Continue the same native Astra context and requested selection (`gpt-6-astra`, medium). The author verifies findings, revises the tracked specification, records dispositions and the resulting revision/hash, and requests another holistic review. Address blockers and optional improvements with concrete changes or evidence-backed dispositions that the reviewer validates. Stop only when Astra reports no further specification revisions; an actual external/tool/identity blocker must be recorded rather than treated as acceptance. No numerical round limit or automatic switch of reviewer is imposed by this native SAR.

Native SAR collateral remains distinct from a sealed two-party SPR/XPR and from owner approval. Specification implementation and plan approval are outside this review/revision loop. All rounds stay in this group's `sar/` directory; historical reports are preserved.
