> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/code/4-bff-admission/review.md) and its exact bytes remain available in the [evidence archive](../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `f029544af7bdeaa399f92d09a654d017304ff1a0d0fa939251f7f4ac69d2f133`. Review acceptance and protocol hashes apply to those original bytes.

Spec compliance: PASS for accepted residual #4 scope.
Task quality: Approved; no Critical or Important source findings.

Review identity and scope

- Astra 6/high independent reviewer; genuine SID 01a137a7-7923-7082-a5d6-a761bf22f884; #4 orchestrator generation bc4fcf0e-024d-4759-8478-d5040861a547; codex/4-draft; Test; active timer.
- Reviewed task-2-review-6c64bfef-f5b82e11.diff once in three consecutive portions: base 6c64bfefc3db5bc19929e774aa8c7e3def282c19; head f5b82e11ec89ee31104205b20ae2f042937c3405; two commits; exactly 17 owned paths. Compared with task-2-brief.md and live Scope/AC/VC/DoD; author report treated as claims.
- Root separately authorized ordinary read-only semantic review while wave evidence normalization remains unresolved. No fresh wave READY/refresh is claimed.

Strengths and compliance

- apps/web/server/config.ts:2 and apps/web/.env.example:4: exact private configuration fields, explicit live default, blank provider values, canonical origin/Host pairs, positive finite CPS/deadlines, fixed search version and required segment calculation. Dependency and frozen public-contract files are untouched.
- apps/web/server/http/admission.ts:12 and apps/web/server/http/body.ts:58: canonical actual Host/Origin admission precedes body access and admitted work; forwarded claims grant no access. Original deadline begins before measured reading, followed by frozen parseTurn.
- apps/web/server/http/body.ts:8: actual bytes enforce 2 MiB, reused buffers are copied, excess/abort cancels reading, cancellation errors are consumed and reader/listeners are released. tests/contracts/body.test.ts:37 covers exact/excess boundaries, dishonest length, cancellation, stalled reading, same deadline and forbidden extra input.
- apps/web/server/turns/deadline.ts:19 and apps/web/server/turns/leases.ts:4: timeout-facing result and actual settlement are separate; late errors are handled; monotonic remaining time propagates; global turn/speech pools independently hold two slots with idempotent release. tests/contracts/leases.test.ts:44 and tests/slow/deadlines.test.ts:4 exercise cancellation-ignoring upstream work retaining slots.
- apps/web/app/api/capabilities/route.ts:5, apps/web/server/runtime.ts:20 and apps/web/server/build-info.ts:5: Node/no-store route validates Host before lazy disk metadata, validates sanitized output, preserves singleton/pools across reload and reports missing/invalid production BUILD_ID as null.
- apps/web/server/capabilities.ts:5: independent typed/STT/TTS configuration; explicit mock; absent credentials suppress affected capabilities; configuration cannot claim verified search.
- apps/web/server/http/errors.ts:1: sole shared AppError reexport, sanitized unexpected exceptions and weak exact-constructor registration preserve old-generation BUSY/429. tests/contracts/admission.test.ts:179 covers the regression.

Findings

- Critical: none.
- Important: none.
- Minor, tooling/evidence hygiene: .scratch/evidence/4-canonical-test.log:33 warns cfg.fieldBlockedBy is missing and some board mirrors are skipped. Root should reconcile the project field through the registered configuration workflow when appropriate. This is not a BFF source defect or invalidation of the exact-head passing Test receipt; no repair attempted.

Evidence checked, without reruns

- Live #4 exposes develop-final 01M4VSV5X51ACQB0GPGA7P6WGA and Test 01M4VSX41A49BE79396TF3AYP9 at reviewed HEAD, with exit-zero commands and the single AC/seven VC proofs. Retained canonical log confirms sandbox Test success.
- Retained outputs show 72 scoped, 209 contract, 24 unit and two slow tests (one new), successful typecheck/lint/format/build, and actual production HTTP admitted 200/rejected 403/no-store with matching BUILD_ID on an ephemeral port. Frozen digest output: sha256:ef4409385e545e82b91fcd44caaab02e457e8af9404d5abba3f07b8956a1d58c.
- Reload RED evidence explicitly shows expected429 versus actual502; committed regression and passing final scoped output cover the correction. No repeated suite, build, browser, slow test, fixed-port process or paid call was run.
- No outside-diff product-code check was necessary. Only brief/report, live lifecycle evidence and retained verification logs were inspected beyond the immutable diff. Product source/index/HEAD/branch were read-only; this report is the sole review write.

Cannot verify from this diff

- apps/web/server/http/body.ts:58 delegates lease acquisition/release to its callback owner; apps/web/server/runtime.ts:33 reserves adapters for later deliveries. Actual paid routes, producer/SDK settlement, provider deadline/code translation, tools/search/retries, browser/history/audio and all 15 joined system cases remain their assigned owners' checks.
- Unchanged exact runtime/dependency pins and two-process launcher are outside the diff. This is not a new clean-install or full-system attestation. The author's existing dependency-audit/blocked-script report is not independently assessed as a vulnerability finding.
- All-model/live/search/microphone acceptance remains unverified. Source Review, final review, approval, PR delivery and Close remain pending. The human requirement for a PR into remote codex/2-draft and actual merged-PR delivery before Done remains binding on Root's delivery workflow.

Assessment: owned BFF foundations match the accepted scope and have meaningful adversarial coverage. Task-level approval does not perform or authorize Review, approval, merge, Close or discharge. Reviewer remains genuinely bound #4 awaiting Root's next lifecycle instruction.
