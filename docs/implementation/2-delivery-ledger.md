# Epic #2 delivery ledger

All active story work uses a pushed branch and a draft PR; accepted specification, implementation plan, sealed artifact-review collateral, native code-review reports, and selected verification provenance remain tracked. See the Cloud story delivery rule in AGENTS.md.

## Historical cloud backfill

The owner explicitly requested resolution of the merged-delivery gap for #3 and #13 in the AIVC chat at 2026-10-14T00:23:53.787Z. Both were already closed after supported local integration. The following actual GitHub merges supplement that history; they do not fabricate or replace package-managed intent/receipt records.

| Story | Accepted local source                    | Cloud PR head                            | Merged PR                                      | Merge commit                             |
| ----- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------------- | ---------------------------------------- |
| #3    | 4dd63ecc98d84293f4f36aae66d5eb0fafa8d6db | 26f29987240525c7fe5b533e036d6b644de868d1 | [#19](https://github.com/kburson/AIVC/pull/19) | aa36d9f193171ebb2e53606c8570185eb45e161f |
| #13   | 6c64bfefc3db5bc19929e774aa8c7e3def282c19 | 6c64bfefc3db5bc19929e774aa8c7e3def282c19 | [#20](https://github.com/kburson/AIVC/pull/20) | c3a0ee1348d1d5929ba3c85daf6758558fda47fd |

GitHub reports #19 MERGED at 2026-10-14T00:25:27Z and #20 MERGED at 2026-10-14T00:25:47Z into codex/2-draft. Both accepted cloud heads are ancestors of the fetched remote feature head. The local epic fast-forwarded to c3a0ee1; its full tracked tree is byte-identical to accepted #13 source6c64bfe. No source suite was rerun for this history-only synchronization.

For #3, the complete tree difference between accepted local4dd63ec and cloud26f2998 is one owner-authored purpose sentence in the architectural specification, changing application-for-learning to architecture-to-demonstrate. Product source, tests, manifests and accepted plan/review bytes are identical. The source preserves the later owner edit rather than reverting it. Existing canonical Test receipt01M4TZNJMBCVJY86H1Y7QKFX2Z remains a historical receipt at4dd63ec, not an invented receipt at26f2998. The retained Astra summary reviewed earlier38b9552; its two Minor observations were implemented in final source. [Original retained summary](../peer-reviews/code/3-workspace-retrieval/review-summary.md) is archived verbatim and retains its exact scope and limitations; no new Astra attestation is inferred. Historical PR #12 is closed as superseded, never merged.

For #13, canonical Test receipt01M4VCZ75RDMF6SB51W0K0AX7H and the integration re-review both name source6c64bfe. The [initial review](../peer-reviews/code/13-public-contract-foundation/review-round-1.md), [scoped correction re-review](../peer-reviews/code/13-public-contract-foundation/review-round-2.md), and [integration provenance review](../peer-reviews/code/13-public-contract-foundation/integration-review.md) are archived verbatim. The five-file public contract digest remains ef4409385e545e82b91fcd44caaab02e457e8af9404d5abba3f07b8956a1d58c.

## Active story PRs

| Story | Branch         | PR                                             | Publication status                                                                                                          |
| ----- | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| #4    | codex/4-draft  | [#18](https://github.com/kburson/AIVC/pull/18) | Source and independent Astra review/provenance committed; fresh documentation-head Test passed; merged at 1dcc07010e718665ff560c0d0f46b1ffc9621a0b; CLOSED/Done after canonical Review and Full-Auto approval |
| #5    | codex/5-draft  | [#22](https://github.com/kburson/AIVC/pull/22) | Accepted planning references and owned-scope activation document; whole #4 is Done; implementation waits for the reviewed native-wave runtime fix and lawful entry   |
| #6    | codex/6-draft  | [#16](https://github.com/kburson/AIVC/pull/16) | Typed client and distinct Astra review/provenance at 6673039ec9ac7b2e44f990a7396548c973cbbd9c; expanded-set Test, Review and Full-Auto approval passed; PR16 merged at 26d6abb4f489e8a13a87e3a85f613bc2ceba618d; CLOSED/Done 2026-10-14T01:32:17Z         |
| #7    | codex/7-draft  | [#24](https://github.com/kburson/AIVC/pull/24) | Accepted planning references and owned-scope activation document; whole #4 is Done; implementation waits for whole #5 Done                 |
| #14   | codex/14-draft | [#21](https://github.com/kburson/AIVC/pull/21) | Capture source and scoped verification/provenance committed; canonical Test passed; distinct Astra review in progress after normal author discharge                 |

Epic integration [PR #17](https://github.com/kburson/AIVC/pull/17) targets trunk. Separate tutorial design #15 uses codex/15-tutorial-design and [PR #23](https://github.com/kburson/AIVC/pull/23) into trunk; the existing specification and SAR loop are published, with written-spec owner approval still pending.

This ledger is a checkpoint, not a claim that pending stories, live provider/microphone acceptance, or epic completion are finished. Per-story PR metadata and governed issue receipts identify subsequent exact revisions.

## Owner stop boundary

The owner requested a pause after wave 4 at 2026-10-14T00:47:01.848Z. Complete whole stories #4, #5, #6, #7 and #14 through independent review, canonical verification, merged cloud delivery and governed Done, then pause epic #2 before any #8 work. Preserve all branches and collateral and publish a fresh-chat handoff. This is a conditional pause boundary, not a claim that wave 4 is complete.

## Owner timing correction for #3

The [canonical timing log](https://github.com/kburson/AIVC/issues/3#issuecomment-6144827227) now reflects the owner supplied interval math. All 70 rows and all 136 hidden markers were preserved. Active time sums to 13,138 seconds (3h38m58s); corrected idle time sums to 10,748 seconds (2h59m08s), including the missing 519-second stop-to-start interval. Together they reconcile to 23,886 seconds (6h38m06s). Agent and orchestration effort on this story both count; session and word-counter changes do not erase intervals. Display precision is one second; native unknown instrumentation and unmeasured phase totals remain unknown. The requested calculation memory was saved separately in the Codex memory update folder.

Current #6 Test receipt is 01M4VZTQDNJV4TBENZ945265MY at accepted6673039; the added slow verification declaration was established by fresh canonical Test, never a relabeled receipt. Unknown #6 timing remains null through approved runtime2007 Close. [Session runtime admission and remaining compatibility correction](2-session-runtime.md) distinguish exact local package acceptance from actual native wave readiness.
