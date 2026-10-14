> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/89fc7a6125cd4b2be6f0f338dea928bd81bcea45/docs/peer-reviews/spec/aivc-interactive-tutorial-design-review-cb28e9fe5863446ca5d949d96998909c/sar/review-loop-authority.md) and its exact bytes remain available in the [tutorial evidence archive](../../../../quality-evidence/2026-10-14-25-tutorial-originals.json).
> Original SHA-256: `05d81735e8ba4cd8a65c40d6d0fe254be87171bc821f9d38ac1d95f5757fbb9c`. Review acceptance and protocol hashes apply to those original bytes.

# SAR loop authority correction

Design story: [#15](https://github.com/kburson/AIVC/issues/15).

On October 13, 2026 the owner clarified: "an SAR implies a loop of review+revise until there is nothing left to revise."

This supersedes the one-pass stopping condition in the historical [initial request](review-request.md). That request and the [first Astra report](astra-sar-report.md) remain unchanged as evidence of the original pass. The earlier coordinator claim of completed SAR was premature: the pass completed, but its revisions-needed result leaves the SAR loop open.

Continue the same native Astra context and requested selection (`gpt-6-astra`, medium). The author verifies findings, revises the tracked specification, records dispositions and the resulting revision/hash, and requests another holistic review. Address blockers and optional improvements with concrete changes or evidence-backed dispositions that the reviewer validates. Stop only when Astra reports no further specification revisions; an actual external/tool/identity blocker must be recorded rather than treated as acceptance. No numerical round limit or automatic switch of reviewer is imposed by this native SAR.

Native SAR collateral remains distinct from a sealed two-party SPR/XPR and from owner approval. Specification implementation and plan approval are outside this review/revision loop. All rounds stay in this group's `sar/` directory; historical reports are preserved.
