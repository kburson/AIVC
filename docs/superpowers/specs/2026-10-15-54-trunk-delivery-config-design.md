# #54 Trunk delivery configuration design

## Purpose and authority

Enable authentic Epic #2 trunk delivery through the supported provider-action merge path, preserving the reviewed application's bytes and the original evidence limitations. The owner requested completion of Epic #2 in native turn 01a14008-14f2-7ba2-9c7c-f9466f3f681c. Issue #54 is the separately governed defect; this document is a proposed additive acceptance addendum until independent Astra6/high review and governed adoption in #54 and #2. No implementation or merge approval is implied by this draft.

At baseline b4d5ff903f4965429a27f409cbd2bcac843fb324, the project config omits fullAutoMerge, so loadConfig supplies null. Installed admitted AITM delivery-preflight.validateConfiguration rejects this for open, merged-current and historical recovery paths. Its supported contract requires an explicit provider-action object and merge method. Merge-commit delivery preserves the ancestry required by the existing evidence anchors. The known failure needs project configuration, not an AITM framework patch or application change.

## Selected approach

Use the existing project-local config verb to add only fullAutoMerge with mechanism provider-action and mergeMethod merge. Extend the existing fixed acceptanceProvenance policy in scripts/verify-live.mjs for this exact transition and this exact reviewed collateral. Keep the current independent candidate HEAD and working-tree checks and the strict default validator. Regenerate only the existing separate disposition after source and collateral settle.

A blanket config-path exemption would admit unrelated preference, project, permission or delivery changes and is rejected. Changing global settings would not make this repository's delivery authority auditable and is rejected. Merging first and reconstructing configuration or a provider receipt afterward would bypass the delivery boundary and is rejected. There is no new subsystem, CLI, application endpoint, policy override or caller-supplied authority.

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

## Exact configuration transition

Path: .ai-task-manager/task-tracker.json. Baseline storage and preimage authority: b4d5ff903f4965429a27f409cbd2bcac843fb324. Mode must remain 100644, with regular file and regular nonsymlink parents. The raw preimage lacks fullAutoMerge; effective null is a default, not a raw null property.

| Image  | UTF8 bytes | Git blob                                 | SHA256                                                           |
| ------ | ---------: | ---------------------------------------- | ---------------------------------------------------------------- |
| Before |       2002 | c8263ac7233be6e8462805d0a1386f5919dd0ee6 | 269c2744e6ab4c59b131aeee53188197501e95f99e652d97c81a60f8337880b3 |
| After  |       2091 | 4c117bc9ffdd4cfbbaf2d6fa4ad758c4834affa3 | 23500227004639e8708857bf2017b6eaeba8c0e0c427e339b8865f547b37885f |

The proposed after bytes were computed in memory using the supported setter's exact serialization: parse the baseline JSON, append fullAutoMerge = {mechanism:'provider-action', mergeMethod:'merge'}, JSON.stringify with two spaces, then one newline. No configuration has been written in this design phase. The implementation invokes the supported admitted2012 config verb, then independently compares actual bytes/mode/blob/SHA with this table. All other parsed fields and formatting must remain exactly as the preimage; semantic equality alone does not authorize reserialization differences.

The production acceptance verifier requires the exact after image in BOTH candidate HEAD and working tree. The before image is an immutable historical authority, not a second permitted final candidate. The baseline commit must be an ancestor of actual adoption/storage and candidate HEAD. Require the adoption/storage commit containing the genuine accepted design/plan/native assessment to be an ancestor of candidate HEAD; resolve its actual commit after review, never substitute a tested head for an artifact storage commit. Pin all three files by complete path, 100644 mode, Git blob, SHA256 and byte count in the existing policy. Validate regular paths and exact working bytes against stored bytes before use. Overlay those immutable entries into the fixed protected tree, not acceptancePaths. Independently compare the complete candidate tree and actual working tree with that protected tree, retaining rejection of every unknown path, deletion, mode or blob change. The exact config postimage is similarly an expected protected-tree entry, not a path exemption.

Required new anchors are this file, docs/superpowers/plans/2026-10-15-54-trunk-delivery-config.md and docs/evidence/54-astra-trunk-delivery-config-assessment.txt. The last path holds the genuine ordinary native Astra6/high final without alteration. No placeholder assessment, self-asserted caller hash, caller-selected review root or mutable branch name is authority. The root records the genuine review, actual archive commit, complete immutable tuples and governed issue adoption before implementation; the implementation hardcodes those reviewed values. Avoid a self-hash cycle: this document does not contain its own final hash or future storage commit.

## Existing evidence consumption

No previous artifact is rebound to a new source digest. docs/evidence/live-validation.json remains its original 11044 bytes and SHA256 d908c3bb4a8fd6ab1a99272833d6de9d69fc8f43cebccf563aea61afe1ee6882. The physical run and human reports remain historical with their original head/profile. Native ordinary search proof was TESTED at385d11b2448dac5bf01400bb7c11834bfefbfbfd and STORED at eddb4722584cda6137d0e456c87f4a560f90e117; keep that distinction and the existing component-equality proof. Genuine pause stays deferred/unverified and six seconds stays a tuning target, not a newly met guarantee. Minor audible unevenness and the owner's no-further-iteration direction remain recorded.

The separate docs/evidence/11-live-acceptance-disposition.json adds an issue54 delivery-configuration provenance record: exact baseline/preimage, accepted archive/adoption commit and three immutable anchor tuples, exact config postimage, current source digest and complete changed-file inventory. Existing authority, observations, limitations and runtime-profile fields remain truthful. The disposition excludes only itself from its inventory to avoid a cycle. It is regenerated after all owned changes and any final archive bytes settle. Existing fixed report-path and default strict behavior remain: no disposition means original L4/L6 requirements still fail; an alternate report never consumes this disposition. Success continues to describe amended release acceptance with explicit limitations, never complete physical qualification.

The existing source digest intentionally does not include nested task configuration; do not change that algorithm. The complete mode/blob inventory independently secures this exact configuration transition. New verifier code changes the whole source digest, and the disposition records that current digest separately from physical14bee.

## Ownership and non-goals

Only .ai-task-manager/task-tracker.json, scripts/verify-live.mjs, tests/scripts/verify-live.test.ts, the existing separate disposition and the exact three issue54 collateral paths change. Existing primary/addendum/sealed report bytes, old status docs, app files, dependencies, global configuration, profiles and framework stay untouched. Do not add a generic policy loader, another harness, new flags or broad quality exclusions. The native assessment remains ordinary report evidence, not a sealed APR receipt. New review requirements do not reopen old sealed groups.

## Regression requirements

Extend the existing isolated real-history amendedFixture, preserving genuine stored review bytes and actual ancestry. Positive tests use the accepted fixed storage commit and exact postimage. Negative cases independently exercise candidate HEAD and working tree, including a bad committed config restored to exact good working bytes and an added committed runtime path removed from both index and disk. A caller must not be able to repair authority by passing new strings or hashes.

Reject: absent config/fullAutoMerge/raw null; squash/rebase/unknown merge methods; wrong mechanism; extra fullAutoMerge keys; changes to any other config field; byte-only reserialization; symlink/file-parent aliases; executable or nonregular mode; missing/altered design, plan or genuine assessment; malformed or nonancestor storage; hidden committed anchor/config/runtime changes; unrelated app/dependency/patch/profile changes; unknown documentation paths. Exercise valid before-history plus exact after candidate and actual target merge context. Preserve existing alternate-report, missing-disposition, strict source/runtime/packages/patch/security, original L4/L6 and immutable review tests. Ordinary fixtures without amendment authority remain strict.

## Verification and delivery boundary

Before code, record seven-question story review and mirrored deep dive through normal AITM verbs. Root adopts the reviewed exact addendum into54/2Scope, records Plan approval and admits Develop. Use TDD with actual failing output for new regressions before the minimal verifier change. Verify the supported setter's output against the fixed tuple, not a handcrafted production config write.

Run issue54 root commands: focused verify-live tests, verify:live, verify:docs, lint, format:check, npm test, test:slow and git log --oneline -1. Also run full affected offline contracts/integration/voice/mock-browser/type/build/sealed/evidence/toolchain lanes on stable source as required by project ownership; record exact outputs and source. Preserve prior CI/Test receipts as historical; root runs registered canonical Test at the final clean commit and checks exact-head CI. No physical rerun is authorized or needed for this unchanged application/runtime boundary. Independent Astra rechecks the implementation and full final PR scope before root integration and genuine exact-head trunk delivery. Draft PR54 targets codex/2-draft; PR17 targets trunk. Neither this addendum nor passing tests authorizes merge or Close.
