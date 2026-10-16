> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/code/13-public-contract-foundation/review-round-2.md) and its exact bytes remain available in the [evidence archive](../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `5197e8c2b4aa7deeaa08dc33b7434e4fb8941c7131dcf2243d82dc3ba113d249`. Review acceptance and protocol hashes apply to those original bytes.

# Task 10 scoped re-review — round 1

Source: 948c00ed535935a580cd5db84855d3e39fc71a3d.
Previous reviewed head: c1c21bb24a60c3bc22096e09714fb89ce04b1446.
Reviewer: requested Astra 6 / high, genuine session 01a13677-7abf-7dc0-a581-45f3b6823b88, canonically bound to #13 as agent. No identity override or delegation.

## Verdict

Original Important finding: ADDRESSED.
Spec compliance: PASS for the scoped correction; the sole blocking finding from the original review is closed.
Quality: SourceReady. No new Critical or Important breakage found in the four-file fix diff.

## Evidence

At apps/web/shared/validation.ts:278–279, the failure payload turnId is validated once and rejected when non-null and unequal to the already validated envelope ID. The returned value uses that validated ID. Null remains permitted; matching IDs remain unchanged. Existing collected and streaming paths invoke this common validator through the stable SseDecodeError wrapper, so the inconsistent terminal becomes INVALID_STREAM rather than a valid failure or disconnected stream.

The added regressions cover the original direct-validator case, collected sequence, terminated streaming terminal and syntactically complete unterminated terminal. Positive tests preserve matching/null IDs through direct validation, collected validation and both streaming endings. Raw streaming frames are authored without passing the mismatched fixture through a validating encoder, so the negative test reaches the decoder rather than failing during setup. The reported four behavioral RED cases and four positive cases match the actual added test code.

Only validation, two test files and the agreement document changed: four files, 80 additions, 3 deletions. Shared types, SSE implementation, fixture and digest recipe did not change. The document now explicitly records non-null payload/envelope correlation and nullable behavior.

Read the appended author report and parsed the current live GitHub Test receipt with the installed canonical parser. Receipt 01M4VBTN62QKG5237HMM26BSMM binds the reviewed SHA and Node26.8.1 in a clean sandbox. Required unit/integration/slow, targeted contracts, digest, typecheck and build commands have exit0; lint/format reuse is explicitly attributed to same-head Develop evidence. The author report records127 contract tests,24 unit tests and1 slow test. These are inspected recorded results; passing suites were not redundantly rerun.

Ran the delivered digest command once to verify source/document identity. It exited0 and produced:
sha256:ef4409385e545e82b91fcd44caaab02e457e8af9404d5abba3f07b8956a1d58c
The document contains this exact value. HEAD matched the requested SHA and tracked status was clean.

## Remaining boundaries

No remaining source finding from the original review. Its CannotVerifyFromDiff boundaries remain unchanged: future server/browser/capture/provider/joined/live behavior is not established by this foundation review. Orchestrator-owned narrative scope reconciliation, Review, approved delivery, integration and Close remain necessary before consumers use accepted frozen authority. Fresh Explain still reports incomplete Scope/derived checkbox obligations; this review does not bypass them or claim Done, CI or live success.

No source/index/HEAD/branch changes, package installation, broad new review, new tests or provider calls were performed. This report is the only artifact written. Reviewer supported stop/release follows report creation.
