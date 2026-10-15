# #54 Trunk delivery configuration implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task in the existing genuine author session. Steps use checkbox syntax. Do not spawn agents; the root coordinates the distinct native Astra6/high reviewer.

**Goal:** Enable authentic Epic #2 provider-action merge delivery while preserving the application and every historical evidence limitation.

**Architecture:** Add one supported project-local configuration value and one exact fixed transition to the existing acceptanceProvenance policy. Pin reviewed collateral and config mode/blob/hash in both candidate HEAD and actual worktree, then regenerate only the existing separate disposition. No generic policy mechanism or application change.

**Tech Stack:** Node26.8.1, npm12.0.2, existing JavaScript verifier, Vitest4.0.18, Git real-history fixtures and admitted AITM2012 CLI; existing dependency/patch lock bytes remain unchanged.

**Spec:** docs/superpowers/specs/2026-10-15-54-trunk-delivery-config-design.md

## Global Constraints

- Change no application, runtime, dependency, patch, provider budget, default CPS or qualified physical profile bytes.
- Run offline commands with AIVC_MODE=mock and PLAYWRIGHT_LAST_RUN_OUTPUT_FILE=.tmp/playwright-last-run.json.
- Make no microphone, speaker, live-provider or paid application-provider calls.
- Preserve all original observed, physical, native and sealed evidence bytes; observed L4 remains fail at 6.60 seconds and genuine provider pause remains unverified/deferred.
- Qualified physical evidence remains source14bee2533f13459b45add5278bf59a243e5af135e5cc70110dcaf54f31854e63 at head2687b5434377f423363be7d279dbcaf12279aa8f with CPS12/cap72; unchanged default CPS14 remains unqualified.
- Keep computeSourceDigest, default strict acceptance, fixed observed-report path, security checks, installed package/module/patch checks and independent HEAD/worktree boundaries unchanged.
- Permit only the exact reviewed config postimage and exact issue54 design, plan and native assessment anchors; no arbitrary config or documentation allowlist.
- Preserve registered refinement, Plan approval, Develop, exact-clean-SHA Test, independent review, human approval, exact-head CI, integration and Close gates.
- Use sanctioned provider-action exact-head delivery with merge method merge; never manufacture a provider action, delivery receipt or review identity.

## Review Focus

1. Hidden committed bad config restored in the working tree must fail candidate HEAD validation; Task1 owns its real-history regression.
2. Semantically similar config with extra fields, another merge method or different serialization must fail exact-image validation; Task1 owns table-driven negatives.
3. Missing, altered, aliased, wrong-mode or nonancestor design/plan/assessment must fail before carry-forward; Task1 owns each anchor/lineage regression.
4. Unrelated app/runtime/dependency/patch/profile or unknown-document additions must fail the complete inventory even if removed from the index; Task1 preserves and extends boundary tests.
5. Historical physical evidence must remain distinct from current amended acceptance and alternate reports must stay strict; Task2 checks original hashes, disposition provenance and existing default/report-path regressions.

## Scope and context

Issue54 is a small delivery defect with a known root cause. At baseline b4d5ff903f4965429a27f409cbd2bcac843fb324 the raw project config lacks fullAutoMerge; effective null blocks all genuine delivery-preflight paths. Epic2's prior Test receipt and whole-epic review cover that historical source. The root demoted2 normally for this rework. The new branch codex/54-draft and draft PR target codex/2-draft; root PR17 targets trunk.

## Plan Metadata

- Priority: P1
- Size: S
- Estimate: 1 hour
- Labels: existing governed defect labels

## Story Intent

- **Beneficiary:** developer maintaining the governed AIVC reference application
- **Capability:** deliver the verified epic through the supported exact-head merge path while preserving qualified evidence
- **Need:** absent project workflow configuration prevents an authentic delivery receipt
- **Value or failure prevented:** complete trunk delivery without weakening source protection or misrepresenting prior physical qualification

## Seven-question semantic review

1. Stakeholder: yes, the maintaining developer receives a deliverable application; the author agent is not the beneficiary.
2. Capability: yes, supported exact-head delivery and evidence preservation describe behavior and safeguards.
3. Need: yes, config default null is the reproduced prerequisite failure.
4. Counterfactual value: yes, delivery succeeds without inventing provider authority or discarding evidence safeguards.
5. Source grounding: yes, issue54 Scope/ACs, actual config setter and delivery validator support each claim.
6. Sibling distinctness: yes, completed original stories implement application behavior; this defect repairs only a delivery prerequisite.
7. Standalone readability: yes, the issue story names actor, concrete failure and avoided evidence loss without requiring this plan.

## Admission before implementation

- [ ] Complete registered Backlog→Refine→Ready for Planning→Plan, resolving actual typed graph/occupancy gates through the root; do not infer admission from this file.
- [ ] Post/mirror the narrative deep dive and mark its checkpoint with governed verbs. Bind this plan through normal Plan metadata when approved, preserving the root Story Intent.
- [ ] Commit/push only design and plan and create an honest draft PR; obtain the distinct genuine Astra6/high ordinary native design/plan assessment.
- [ ] Root archives that exact native final at docs/evidence/54-astra-trunk-delivery-config-assessment.txt and records actual archive commit plus all three immutable path/mode/blob/SHA/length tuples. Root adopts the reviewed addendum in54/2Scope and records Plan approval before Develop. Implementation reads those actual committed values; no placeholder assessment or inferred approval.

## Implementation Tasks

### Task 1: Exact delivery configuration and fail-closed provenance

#### Story Intent

- **Beneficiary:** developer maintaining the governed AIVC reference application
- **Capability:** deliver the verified epic through the supported exact-head merge path while preserving qualified evidence
- **Need:** absent project workflow configuration prevents an authentic delivery receipt
- **Value or failure prevented:** complete trunk delivery without weakening source protection or misrepresenting prior physical qualification

**Files:** Modify .ai-task-manager/task-tracker.json and scripts/verify-live.mjs. Test tests/scripts/verify-live.test.ts. Consume only the exact reviewed design/plan/native-assessment archive. Keep scripts/format-check.mjs and scripts/lint-markdown.mjs unchanged.

**Interfaces:** Existing acceptanceProvenance(root = workspace) returns the fixed provenance object or throws on any authority/inventory failure. Existing verifyLive({root,reportPath,log}) retains its public shape. Existing amendedFixture(), put(root,path,bytes), commit(root,message), git(root,...args), amendErrors(root) provide isolated real-history test support. No new public API.

- [ ] **Step 1: Update the isolated fixture to the genuine adopted archive and write failing tests.** Keep fixture reset at the actual accepted54 archive commit, copy current verifier/test/output files, installed module/metadata and genuine optional existing review bytes as before. Never point a fixture at a mutable branch or generate production review authority. Write these assertions using existing helpers:

```ts
const configPath = '.ai-task-manager/task-tracker.json';
const expectedConfigBlob = '4c117bc9ffdd4cfbbaf2d6fa4ad758c4834affa3';
it('accepts only the reviewed delivery configuration postimage', () => {
  const root = amendedFixture();
  const config = JSON.parse(readFileSync(join(root, configPath), 'utf8'));
  config.fullAutoMerge = { mechanism: 'provider-action', mergeMethod: 'merge' };
  put(root, configPath, JSON.stringify(config, null, 2) + '\n');
  expect(git(root, 'hash-object', configPath)).toBe(expectedConfigBlob);
  commit(root, 'Exact reviewed delivery configuration');
  expect(() => acceptanceProvenance(root)).not.toThrow();
});
it('rejects hidden committed bad config despite restored working bytes', () => {
  const root = amendedFixture();
  const good = readFileSync(join(root, configPath));
  const config = JSON.parse(good.toString());
  config.fullAutoMerge.mergeMethod = 'squash';
  put(root, configPath, JSON.stringify(config, null, 2) + '\n');
  commit(root, 'Bad candidate configuration');
  put(root, configPath, good);
  expect(() => acceptanceProvenance(root)).toThrow(/candidate HEAD/i);
});
it.each([
  { mechanism: 'provider-action', mergeMethod: 'squash' },
  { mechanism: 'provider-action', mergeMethod: 'rebase' },
  { mechanism: 'shell', mergeMethod: 'merge' },
  { mechanism: 'provider-action', mergeMethod: 'merge', extra: true },
  null,
])('rejects other delivery values %j', (value) => {
  const root = amendedFixture();
  const config = JSON.parse(readFileSync(join(root, configPath), 'utf8'));
  config.fullAutoMerge = value;
  put(root, configPath, JSON.stringify(config, null, 2) + '\n');
  expect(() => acceptanceProvenance(root)).toThrow();
});
```

Extend the same tests with deleted fullAutoMerge, changed preferences.noPushToOrigin, compact JSON serialization, each anchor removed/changed/executable/symlinked, aliased parent directories, nonancestor archive, committed changed anchor restored on disk, committed runtime addition then git rm --cached plus unlink, unrelated app/package/patch/profile/unknown docs changes. Retain existing real target merge-tree context, hidden candidate tests, strict fixtures, missing disposition and alternate-report cases. Use independent copies/resets so a failed negative does not contaminate the next. Anchor constants come only from the genuine accepted archive, not fixture caller parameters.

- [ ] **Step 2: Run focused RED before implementation.**

```sh
env AIVC_MODE=mock PLAYWRIGHT_LAST_RUN_OUTPUT_FILE=.tmp/playwright-last-run.json npx --no-install vitest run tests/scripts/verify-live.test.ts
```

Expected: the exact reviewed postimage/anchors are rejected by the prior fixed boundary. Record actual failing assertions; existing strict negatives alone do not establish RED. The current planning checkpoint intentionally fails the old amended boundary because new collateral is unadopted; do not label that a new app defect or claim tests pass before implementation.

- [ ] **Step 3: Invoke the supported project-local setter, then verify the image.** In the genuine active54 checkout, use the admitted2012 CLI path already recorded by the root with these literal arguments:

```sh
node /Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/.scratch/runtime/2012-ceb8e75a9/node_modules/@kburson/ai-task-manager/bin/aitm.mjs config fullAutoMerge '{"mechanism":"provider-action","mergeMethod":"merge"}' --allow-foreign-worktree
```

Prefix the required mock/offline environment. Do not use config init or global config. Assert regular100644, 2091 bytes, blob4c117bc9ffdd4cfbbaf2d6fa4ad758c4834affa3 and SHA23500227004639e8708857bf2017b6eaeba8c0e0c427e339b8865f547b37885f. Compare parsed objects after deleting fullAutoMerge and compare every preserved raw field/serialization with baseline. Unexpected setter output is a refusal requiring investigation, not permission to update the expected tuple.

- [ ] **Step 4: Extend only the existing fixed verifier.** Add fixed54 baseline/adoption/archive constants and the three exact immutable tuples from actual reviewed storage. Reuse tree(), regular(), sha(), git() and equal(). Verify preimage from b4d5ff9 and archive ancestry. Validate actual anchor bytes/modes/storage and insert exact expected entries into protectedTree. Insert config postimage as {mode:'100644',blob:'4c117bc9ffdd4cfbbaf2d6fa4ad758c4834affa3'}, validate actual bytes/length/SHA and require it in BOTH independent boundaries. Do not put config or54 anchors in acceptancePaths. Extend the returned provenance with a deliveryConfiguration object carrying before/after tuples, fixed authority/archive and anchor inventory. Keep all previous policy/ordinarySearch/observations/runtimeProfile/verdict fields and computeSourceDigest unchanged. No caller argument selects authority or acceptable config.

- [ ] **Step 5: Run focused GREEN and commit the scoped implementation with issue54 attribution.** Expect all existing and new focused cases pass; capture actual count/exit. Inspect the diff for only allowed owners. If the known self-commit staged-inventory guard refuses, do not retry or change hooks: stage while root2 active, normalStop54 and let registered root transport commit/push with the exact inventory.

### Task 2: Regenerate honest disposition and verify final candidate

**Files:** Modify only docs/evidence/11-live-acceptance-disposition.json after Task1 and exact review collateral settle. No new status-document exception.

**Interfaces:** acceptanceProvenance(root) remains the sole producer of the separate fixed disposition; verifyLive consumes it only for the fixed observed report. Original observed and physical JSON bytes remain inputs, never rewritten.

- [ ] **Step 1: Regenerate the separate disposition with the existing exported producer.**

```js
import { writeFileSync } from 'node:fs';
import { acceptanceProvenance } from './scripts/verify-live.mjs';
writeFileSync(
  'docs/evidence/11-live-acceptance-disposition.json',
  JSON.stringify(acceptanceProvenance(), null, 2) + '\n',
);
```

Use the real child cwd and transparent admitted foreign-worktree wrapper when required. No fake cwd, foreign flag passed into Vitest, identity override or hook modification. Confirm observed report SHA d908c3bb4a8fd6ab1a99272833d6de9d69fc8f43cebccf563aea61afe1ee6882 and every existing immutable anchor remain unchanged. Confirm current source digest differs honestly from physical14bee and L4fail6.6/L6unverified remain in observations; runtime profile12/cap72 remains distinct from default14. Check the complete current changed-file mode/blob inventory and fixed54 authority record. Re-run default missing-disposition/alternate-report tests rather than altering these gates.

- [ ] **Step 2: Run quality checks before full stable-source tests.** Required environment applies to every command. Run npm run lint, npm run format:check, npm run verify:docs, npm run verify:live, npm run verify:sealed-evidence, npm run test:evidence and npm run verify:toolchain. Preserve exact native Markdown hard-break bytes; if scans reject new immutable native text, stop for root review rather than trim it or add blanket exclusions. Run npm run typecheck and npm run build:clean serially; builds may use only mock/offline fixtures.

- [ ] **Step 3: Run the full required offline matrix once source is stable.** Run npm test, npm run test:slow, npm run test:contracts, npm run test:integration, npm run test:voice and npm run test:browser using the existing mock browser harness and .tmp/playwright-last-run.json. No owned interactive browser, microphone, speaker or application-provider call. Record exact outputs/counts/exit codes. Repeat only failed or newly impacted lanes after a meaningful change. Do not reuse prior55-file/372-test counts or canonical receipts as new-source proof.

- [ ] **Step 4: Inspect final Git inventory, original evidence hashes and disposition consistency.** Run git diff --check for authored files, account separately for authentic historical trailing hard-break whitespace, inspect git diff --stat and exact stage inventory, then git log --oneline -1. Regenerate the disposition again if any inventory-bearing bytes changed after Step1, including genuine final review archive updates admitted by the fixed policy. Do not exclude additional paths merely to make it pass.

- [ ] **Step 5: Stage only the fixed owners, normalStop54 and hand off CODE_COMPLETE.** Report exact source digest, config pre/post tuples, review/archive/adoption commits, staged patch SHA, file blobs/hashes, tests and unchecked lifecycle items. Root transports if needed, updates trace, dispatches same genuine Astra independent implementation/full-PR review, runs registered canonical Test at final cleanSHA and checks all exact-head CI. Root handles human approval, exact-head child integration and Close54 before epic final Test/Review/approval and genuine PR17 trunk delivery. A draft PR, local pass or this plan is not delivery authority.

## Self-review coverage

Task1 owns the exact configuration transition, all five Review Focus failure classes, immutable54 authority, independent full HEAD/worktree boundaries and unchanged strict behavior. Task2 owns separate current disposition, historical custody, quality/full offline matrix and handoff. No product/profile/source-evidence rebinding or new live qualification appears in either task. Execution is the same author with root-supervised genuine distinct Astra review; the written artifacts require that review and governed Plan approval before code.
