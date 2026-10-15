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

| Observation                                                                                                                            | Useful control or intent                                              | Friction observed                                                                                                                                                                                                                                                                                                                  | Question for later evaluation                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| A process checklist sentence contributed to the frozen graph identity. Clarifying #8's pre-close handoff invalidated admission for #9. | Detect substantive changes to approved scope, ranks and dependencies. | Technical scope and dependency edges were unchanged, but a new graph authorization became necessary. Root introduced the wording change.                                                                                                                                                                                           | Can execution bookkeeping be separated from the technical scope fingerprint?                                                     |
| The same checklist asked for Close before the story could pass pre-close review.                                                       | Ensure a complete delivery rather than partial story closure.         | Wording implied a circular prerequisite. #9–#11 needed registered Shelve, a precise issue-body correction and re-refinement to align future wording. Original refinement histories were preserved.                                                                                                                                 | Can stage-specific obligations be generated and validated at their actual boundary?                                              |
| Contextual selection of a clearly described recovery option was rejected by the source verifier.                                       | Bind authorization to genuine human text and exact scope.             | The owner said to continue with choice A; the actual native-source check returned `rank-wave-source-scope-mismatch`. The parser accepts a restricted grammar and whole letter selections, while the owner now requests numbered choices.                                                                                           | Can genuine contextual approval and numbered choices be supported without loosening identity, scope or reversal checks?          |
| Completed worktrees were missing during successor bootstrap.                                                                           | Preserve real authorship, branch ancestry and native identity.        | A bounded registered restoration repair was needed despite retained refs and merged source.                                                                                                                                                                                                                                        | Can terminal lineage remain verifiable without retaining every physical checkout indefinitely?                                   |
| Native Unknown timing met incompatible Close behavior.                                                                                 | Preserve truthful historical telemetry and consistent closure.        | Reviewed Close compatibility was needed; missing historical measurements must remain unknown.                                                                                                                                                                                                                                      | Which telemetry failures justify blocking product delivery, and which should permit explicit deferred administrative acceptance? |
| Local parent state had to be synchronized after cloud merge before Close.                                                              | Prove accepted source is reachable in the integration branch.         | Fetch alone was insufficient; the local feature branch also needed a normal fast-forward.                                                                                                                                                                                                                                          | Can the registered delivery operation safely perform or explicitly guide this synchronization?                                   |
| Verification command identities, phase restrictions and Markdown heading levels affected gate interpretation.                          | Require relevant, reproducible verification and a real deep dive.     | Authoring details could block progress without changing implementation correctness.                                                                                                                                                                                                                                                | Can declarations be validated earlier and errors identify the smallest supported correction?                                     |
| Some child-worktree commands were evaluated against the parent task context.                                                           | Enforce ownership and prevent unrelated writes.                       | An optional body-backup redirect was refused as `WRITE_OTHER`, citing parent #2. The optional backup was omitted; the registered issue-body operation succeeded.                                                                                                                                                                   | Can guard classification consistently resolve the actual bound worktree and distinguish optional artifact writes?                |
| Public Full-Auto session settings and Plan-approval provenance used different inputs.                                                  | Preserve truthful approval provenance.                                | `auto both` reported Full-Auto, but `plan-approve` read only explicit `TT_FULL_AUTO=1` and recorded human provenance without human Plan review. The author caught this before Develop; registered cancel-plan/re-entry/recheckpoint/re-estimate and explicit Full-Auto approval recovered it while preserving refinement identity. | Can approval use the same actual session policy, or fail closed instead of silently recording human provenance?                  |
| Generated Playwright last-run output entered the owned formatting inventory.                                                           | Check all owned source formatting.                                    | Playwright's ignored JSON lacked the final newline. The documented `PLAYWRIGHT_LAST_RUN_OUTPUT_FILE` setting moved output to `.tmp`; the original generated data was preserved in scratch, without changing source or formatter policy. Canonical Test inheritance must still be observed.                                         | Can inventory distinguish supported generated output from owned source consistently?                                             |
| A successful rank-wave Show returned complete child bodies and embedded evidence.                                                      | Expose current readiness and provenance.                              | The host reported about 128,960 output tokens and truncated the response, although readiness was Ready. This is observed output size, not measured billed tokens or elapsed cost.                                                                                                                                                  | Can a compact readiness/provenance view be the default, retaining full diagnostics on request?                                   |
| A literal collaboration agent name was classified as an absolute filesystem path.                                                      | Preserve actual filesystem access limits.                             | A scratch-ledger append containing the name was refused even though it requested no outside access. Shorter prose succeeded at the same scratch destination.                                                                                                                                                                       | Can executable path operands be distinguished from literal document content?                                                     |
| A documentation-only direct feature push hit the protected-branch CI requirement.                                                      | Keep real CI and merge protection.                                    | The owner-requested notes commit `cbc80fd` was retained and carried through the ordinary story #9 draft PR. No force push, bypass or history rewrite was used.                                                                                                                                                                     | Can checkpoint guidance identify the ordinary PR route before attempting a direct protected-branch push?                         |

## Story #10 additional observations

- Promote discovered the accepted planned-estimate appendix only after Plan approval. The public `plan-estimate --compatibility-mode` route recorded the unchanged L/5h estimate, and a fresh Explain plus ordinary Promote entered Develop. No internal appendix writer or human approval claim was used.
- The original AC referenced full `npm run test:slow` before the canonical Test phase, while the stamper reserves that full lane for Test. The public issue-body operation made VC2 the accepted targeted rapid-interruption file and retained the complete slow suite as VC9. Scope, AC text/citations, rank, refinement semantics and full Test floor stayed intact; mutation read-back passed at body version72.
- Distinct preliminary Astra review identified a never-settling recovery gap despite the initial green interruption/playback/capture suites. The author reproduced the missing pre-end speech-status failure in a red test, then added the existing two-second resume limit as a transition-owned deadline. New candidate/Stop tests check retirement of the obsolete deadline. The final distinct review passed corrected source `e0ed8a8`, independently checking204 targeted tests,12 browser cases and seven extra controlled Chromium probes. Canonical exact-head Test remains a separate gate.

## Story #11 additional observations

- The public deep-dive mirror help places `--from-comment <id>` before the issue number. Supplying the issue first made the early parser treat the numeric comment ID as the target and return `bind-mismatch`; the genuine issue binding was unchanged. The documented argument order is the supported retry, without a new helper or framework change.
- The same genuine story session can be normally paused during dependency waits and resumed for released work. Its actual binding generation, branch and clean feature fast-forward were preserved; preparation did not authorize Plan or implementation before predecessor completion.
- The root credential file is not automatically loaded by the two-process launcher because Next runs in `apps/web`. Live setup must explicitly supply server-only process environment. Configuration names, model metadata and actual provider observations stay separate from credentials and from each other.

- The original #11 acceptance criterion cited full `test:slow` before canonical Test, while the stamper reserves that full command for Test. Public issue-body replacement made VC6 the focused documentation/live verifier tests and retained full slow as VC15. The epic-trail VC now explicitly targets parent2; its bare form targets the bound child and has no child trail to verify. Scope, acceptance text, rank and full verification floors remain unchanged.
- The exact accepted specification transfer has historical Markdown formatting that fails the authored-file formatter. The transfer is checked against both its authoritative SHA256 and original Git bytes before only `docs/specification.md` is excluded from authored formatting/lint inventory. Regression tests reject changed bytes and aliases; existing archived evidence protections remain intact.
- Plain Explain requires its documented `--json` output flag. A fresh JSON Explain after declaration corrections reports the expected incomplete Develop acceptance evidence; it does not indicate an unfinished predecessor or authorize stage advancement.

- The final joined actual Next/Fastify browser check exposed a native Node26 Request-clone branding defect absent from pure handler/intercepted browser coverage. The actual failing browser run became passing after the bounded reader accepted the original request with a separate cancellation signal. Can a minimal real HTTP smoke run earlier without delaying complete final acceptance?
- Preliminary distinct #11 component review found null research rows and case-variant duplicate Atlas trials that could pass the timing verifier, plus provider-named credential literals that escaped sanitized-report/docs checks. Four fake-only regressions were observed failing and passing after focused corrections. These are product/evidence correctness findings, separate from administrative friction.
- Expanding pinned Ubuntu CI to all offline lanes surfaced production server descendants retaining ports after npm wrapper exit. Local owned-process ancestry showed the wrappers; direct production server ownership passed launcher and actual compiled HTTP shutdown checks. Linux confirmation remains a separate CI observation, with no unowned process mutation.

## Controls with demonstrated delivery value

Independent #8 review found concrete playback and recovery defects that the author
corrected. Independent #9 review also found three actual typed/capture ownership
races after 125 targeted tests and eight browser checks passed. Separate Chromium
overlap probes exposed missed output-mute cancellation, capture failure disposing
adopted typed playback, and repeated Stop/unmount leaving newer output undisposed.
Four focused regressions were observed failing and passing after minimal fixes.
The same Astra reviewer then passed corrected source `fb14a5d` with 129 targeted
tests, eight browser checks and the original overlap probes. These are ordinary
native code-review findings and results, distinct from the administrative recovery
friction above. Exact-source verification, real branch reachability, distinct author
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
- A later standalone scoped human statement successfully authorized the same
  rank-6 proposal. Registered publication returned Ready with record digest
  `93b6ecc3942caba9b17f38267c28b80567f2554919bbaf70244784c1f655fbce`.
  This removed the admission blocker; it did not establish implementation completion.
- Story #9's truthful replacement Plan approval persisted `mode="full-auto"`
  with its posted audit at `2026-10-14T22:22:05Z`, before Develop. No new human
  plan-review event is claimed. Its ignored `.scratch/9-workflow-friction.md`
  retains the bounded recovery details for this later evaluation.
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
