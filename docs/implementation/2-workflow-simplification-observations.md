# Epic #2 workflow simplification observations

This is a working record for evaluating workflow changes after AIVC delivery.
It records observations and questions, not an approved redesign or permission
to skip current delivery gates. The owner selected continuation with the existing
recovery path and requested these notes on October 14, 2026. Future choices
presented to the owner use numbers.

## Decision and delivery boundary

Continue whole stories #9, #10 and #11 through independent review, verification,
cloud integration and registered closure. Keep epic PR17 draft. Preserve the
primary checkout and concurrent owner work. Formal acceptance of auxiliary AITM
repairs remains approval deferred where already recorded.

## Observations to evaluate

| Observation                                                                                                                            | Useful control or intent                                              | Friction observed                                                                                                                                                                                                                        | Question for later evaluation                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| A process checklist sentence contributed to the frozen graph identity. Clarifying #8's pre-close handoff invalidated admission for #9. | Detect substantive changes to approved scope, ranks and dependencies. | Technical scope and dependency edges were unchanged, but a new graph authorization became necessary. Root introduced the wording change.                                                                                                 | Can execution bookkeeping be separated from the technical scope fingerprint?                                                     |
| The same checklist asked for Close before the story could pass pre-close review.                                                       | Ensure a complete delivery rather than partial story closure.         | Wording implied a circular prerequisite. #9–#11 needed registered Shelve, a precise issue-body correction and re-refinement to align future wording. Original refinement histories were preserved.                                       | Can stage-specific obligations be generated and validated at their actual boundary?                                              |
| Contextual selection of a clearly described recovery option was rejected by the source verifier.                                       | Bind authorization to genuine human text and exact scope.             | The owner said to continue with choice A; the actual native-source check returned `rank-wave-source-scope-mismatch`. The parser accepts a restricted grammar and whole letter selections, while the owner now requests numbered choices. | Can genuine contextual approval and numbered choices be supported without loosening identity, scope or reversal checks?          |
| Completed worktrees were missing during successor bootstrap.                                                                           | Preserve real authorship, branch ancestry and native identity.        | A bounded registered restoration repair was needed despite retained refs and merged source.                                                                                                                                              | Can terminal lineage remain verifiable without retaining every physical checkout indefinitely?                                   |
| Native Unknown timing met incompatible Close behavior.                                                                                 | Preserve truthful historical telemetry and consistent closure.        | Reviewed Close compatibility was needed; missing historical measurements must remain unknown.                                                                                                                                            | Which telemetry failures justify blocking product delivery, and which should permit explicit deferred administrative acceptance? |
| Local parent state had to be synchronized after cloud merge before Close.                                                              | Prove accepted source is reachable in the integration branch.         | Fetch alone was insufficient; the local feature branch also needed a normal fast-forward.                                                                                                                                                | Can the registered delivery operation safely perform or explicitly guide this synchronization?                                   |
| Verification command identities, phase restrictions and Markdown heading levels affected gate interpretation.                          | Require relevant, reproducible verification and a real deep dive.     | Authoring details could block progress without changing implementation correctness.                                                                                                                                                      | Can declarations be validated earlier and errors identify the smallest supported correction?                                     |
| Some child-worktree commands were evaluated against the parent task context.                                                           | Enforce ownership and prevent unrelated writes.                       | An optional body-backup redirect was refused as `WRITE_OTHER`, citing parent #2. The optional backup was omitted; the registered issue-body operation succeeded.                                                                         | Can guard classification consistently resolve the actual bound worktree and distinguish optional artifact writes?                |

## Controls with demonstrated delivery value

Independent #8 review found concrete playback and recovery defects that the author
corrected. Exact-source verification, real branch reachability, distinct author
and reviewer identities, secret separation and preservation of concurrent work
remain useful controls to assess individually.

Offline checks do not establish live provider behavior, real microphone capture,
acoustic interruption or physical-device latency. Those acceptance claims still
need actual evidence. Deferring an administrative approval cannot create that
evidence or establish a product test result.

## Evidence and limits

- The registered rank-6 proposal is recorded locally at
  `.scratch/gh/2-successor-wave-prepare.json`, operation
  `cd49de16-886b-4618-a541-b20f27be0712`, proposal digest
  `9bced8e8c14a8a7a62ce6bd98e044c40f47c748ff7f6d4d5951b1b65a0e940b2`.
  Read-only comparison proved all eleven child IDs, ranks and dependency edges
  unchanged; refinement identities for #8–#11 changed.
- Registered recovery behavior is documented in the admitted AITM package at
  `docs/guides/epic-rank-waves.md`; the installed source verifier is
  `scripts/task-tracker/lib/epic-rank-wave-source.mjs`.
- The October 14 contextual approval is native message
  `msg_01a13c69-bd28-77a2-8b0c-7cc2188d4d1d` in the genuine root session.
  Its actual source hash is
  `sha256:83446848ae5e759148bf789ed771d71c73910b2ef5813bead1bd38f0e3cf6f0a`.
  The source check was read-only; no authorization record was published from it.
- Detailed recovery chronology remains in the ignored local ledger
  `.scratch/plan/2-successor-recovery-ledger.md`. That ledger is context, not
  lifecycle or human authority.
- No reliable breakdown of elapsed workflow cost versus model execution or human
  attention has been established. Historical Unknown timing stays Unknown.

## Evaluation after AIVC

For each proposed simplification, identify the failure it prevents, the observed
cost, the smallest change, and the evidence that the change preserves correctness
and owner control. Prefer removing redundant work over adding another recovery
layer. Do not make completion of this evaluation a new prerequisite for AIVC.
