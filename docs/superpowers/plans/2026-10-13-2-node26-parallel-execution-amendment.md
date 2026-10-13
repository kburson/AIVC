# Epic 2 execution amendment: Node 26 and parallel ownership

Date: October 13, 2026. Status: submitted for focused peer review; no application implementation is authorized by this draft alone.

## Authority and unchanged scope

The owner instructed this session to use Node >=26 and to fan out independent work after a reviewed, accepted plan and backlog hydration. This amendment supersedes only the Node 24 execution baseline, its Node type/npm pins and serial scheduling details in the accepted [implementation plan](2026-10-12-2-voice-bff-reference.md). The base plan remains byte-identical at revision `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, SHA-256 `5dc37eb3c25f59d056756b45582a584ea321ac3a881041992b073b5a3656523e`. The historical [accepted specification](../specs/2026-10-12-voice-bff-reference-design.md) at revision `bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac`, SHA-256 `8512daa8c456af00628a16471d4b13526c7585172c223c8bfa0f2323bee4fff6`, remains the technical authority. The two-process architecture, all limits, nine deliverables, 15 specification cases, required evidence and exclusions remain binding.

A separate uncommitted working-copy edit changes only the specification's purpose wording from a reference application for learning to a reference architecture for demonstration. Its current SHA-256 is `71bd4797829eb70ce08f744404535487b746430dbf78b2883d01859c1c4d37cc`. It is outside this focused runtime/scheduling amendment and is not accepted specification evidence. Preserve that edit without restoring, stashing or committing it through this review. Sealed historical specification/base-plan/review bytes are unchanged; later purpose reconciliation is root-owned.

## Runtime contract

- Minimum supported application runtime: Node >=26. Root `engines.node` is `>=26`; Node 24 is no longer an application execution target. Later Node majors satisfy the floor but are not described as tested without actual evidence.
- Reproducible baseline: `.nvmrc` pins `26.8.1`; root `packageManager` pins `npm@12.0.2`; `engines.npm` is `12.0.2`; existing `.npmrc` retains `engine-strict=true` and `save-exact=true`. CI and documented reproduction use those exact versions, not whatever npm happens to ship with Node.
- Replace the base plan's `@types/node` 24.19.2 with exact `@types/node` **26.6.5**. Registry metadata confirmed this 26.x release during amendment review; Task 1 confirms the exact pin at installation. Preserve all other direct package versions from the accepted plan. Runtime/typecheck/build tests, not type-package selection alone, prove compatibility.
- The selected 26.8.1 binary is a **Current** release at amendment time, not the superseded Node 24 LTS baseline. Task 9 documentation/evidence records the actual tested runtime and observed release-line status; it must not carry over an unverified LTS claim.
- The current shell was checked as Node v26.8.1/npm 12.0.2. That is a toolchain observation only, not application test/build evidence. No Node 24 installation is an application setup step.
- Task 1 owns `scripts/verify-toolchain.mjs`, root `verify:toolchain` script and `tests/scripts/toolchain.test.ts`. The reproducible-toolchain verifier reads `.nvmrc` and `packageManager`, compares `process.version` and an argument-array invocation of `npm --version`, and exits nonzero with expected/actual values on either mismatch. Tests cover matching versions, mismatched Node/npm and malformed pins. It is a reproduction/CI check; it does not relabel an untested later Node version as tested.
- Task 1 local setup and Task 9 CI/README select Node 26.8.1, explicitly install `npm@12.0.2` if needed, then assert both versions before `npm ci`. Do not rely on Corepack or the `packageManager` field to install npm. CI uses the following sequence after setup-node selects 26.8.1:

```sh
npm install --global npm@12.0.2
node --version
npm --version
node scripts/verify-toolchain.mjs
npm ci
```

- README reproduction documents the same version selection/install/check sequence; a local environment already at npm 12.0.2 can skip its reinstall after verifying it. Task 9 `verify:docs` checks CI/setup ordering and script ownership, while `verify:live` requires Node >=26 and records the actual tested version. CI still requires exact 26.8.1/npm 12.0.2; a declared runtime floor is not proof of testing future majors.
- The global local-tarball ai-peer-review 0.4.1 runtime/MCP retains its existing absolute Node 26.8.1 path. Do not install/update peer-review from the public registry, replace its runtime or rebuild its compiled broker helper as part of application setup. The separate npm version installation above does not authorize changing that review-tool registration.
- The selected Node release and Next.js minimum are supported by primary sources: [Node 26.8.1 release](https://nodejs.org/en/blog/release/v26.8.1), [Next.js installation](https://nextjs.org/docs/app/getting-started/installation). These checks establish selection plausibility, not application compatibility. Clean install, typecheck, build and all declared tests must run on the selected toolchain.

## Explicit entry and integration graph

Task numbers are those in the accepted base plan; the hydrated child mapping is fixed below. Entry prerequisites mean predecessor deliveries reviewed and integrated on the governing branch. A task's independent work cannot claim full completion before its separately listed wiring prerequisites and all declared checks pass.

| Task / child | Entry prerequisites | Additional wiring/completion prerequisites |
|---|---|---|
| 1 / #3 Workspace and retrieval | None | Full Task 1 deliverable and checks |
| 2 / #4 Shared admission/contracts | Task 1 | Full Task 2 interfaces and checks |
| 3 / #5 Claude orchestration | Task 2 | Full typed server-path integration/tests |
| 4 / #6 Typed UI/history | Task 3 | Full typed browser/history checks |
| 5 / #7 Deepgram adapter/voice HTTP | Task 2 for independent phase | Task 3 integrated before shared-file/audio-turn wiring; full Task 5 checks |
| 6 / #8 Speech playback | Tasks 4 and 5 | Full speech/UI integration and checks |
| 7 / #9 Capture/VAD | Task 2 for independent phase | Tasks 4 and 6 integrated before Conversation/controller/browser wiring; full Task 7 checks |
| 8 / #10 Interruption | Tasks 6 and 7 fully integrated | Full interruption/browser checks |
| 9 / #11 Evidence/tutorial | Tasks 1–8 fully integrated | Whole-branch checks, actual live evidence, documentation and epic trail |

For this schedule, the base-plan phrase “typed-path validation” before final Task 5 integration means Task 3's typed server/tool/retrieval tests; it does not require Task 4's UI to finish before server wiring. Thus Task 4 can proceed on client files while Task 5's same implementer completes server wiring after Task 3. Task 6 deliberately waits for both full Task 4 and Task 5, avoiding premature Conversation or speech-endpoint use.

Native entry dependencies/rank and each child's authoritative Scope/AC must carry this graph before dispatch. Record the additional phase wiring gates explicitly in the owning child; parent supervision refuses Test/Review/Done until full wiring/tests are complete. Do not remove or bypass a sanctioned native blocker to make an agent start early. If the installed workflow cannot represent a phase entry independently of a full-task blocker, hold that whole child until all of its listed prerequisites are satisfied; use the other genuinely ready disjoint work for parallelism. No state skipping is authorized.

## Parallel file ownership and handoffs

1. Tasks 1 and 2 land first. Downstream work imports their actual reviewed request/config/deadline/lease interfaces. No agent invents a replacement shared interface to get around an unmet prerequisite.
2. Tasks 3 and 5 may run concurrently after Task 2. Task 3 alone owns `providers/contracts.ts` for ModelAdapter, `providers/mock.ts`, runtime/run-turn/capability wiring and `tests/helpers/scripted-providers.ts` while it is active. Task 5's concurrent phase owns `providers/deepgram.ts`, `tests/contracts/deepgram.test.ts` and its new speech route/endpoint tests compiled against injected Task 2 dependencies. Declare/export `SpeechAdapter` in **deepgram.ts**, using the base plan's exact transcribe/synthesize signatures and Task 2 shared wire/config types; it stays there and does not collide with Task 3's provider contracts file. Task 5's concurrent phase does not edit mock/runtime/run-turn/capabilities/contracts or the shared scripted-provider helper.
3. After Task 3 integrates, the **same Task 5 implementer**, genuinely bound to child #7, updates its worktree to the integrated base and takes serialized ownership of the Task 5 `mock.ts`, `runtime.ts`, `run-turn.ts` and `capabilities.ts` edits. The audio-turn pipeline, injected endpoint adapters, lease/capability tests and `audio-turn.test.ts` must all reach green here. Commit those edits under child #7, not the completed Task 3 child. Task 3's former owner does not commit Task 5 work through another child's binding. Parent integration checks the actual scoped trail and full tests before accepting Task 5.
4. Task 4 follows Task 3 on its own client/UI/history files. Task 6 follows full Tasks 4 and 5 and owns speech modules plus Conversation/controller wiring until integrated. Task 7's independent WAV/VAD/capture/patch/assets modules may run after Task 2; it leaves Conversation/controller and browser harness alone until Tasks 4 and 6 are integrated. Then the **same Task 7 implementer**, still bound to #9, updates to that base and completes capture UI/browser/build integration before its full-task review.
5. Task 7's independent portion exclusively owns root `package.json`/`package-lock.json` changes for `patch-package` 8.0.1/postinstall, `apps/web/package.json` predev/prebuild VAD regeneration, the checked-in patch and asset script/manifest. No concurrent task changes these manifests or lockfile until Task 7's package changes integrate; other tasks reuse the existing pins and report any required dependency change to the parent for serial ownership. Task 7's early code and package changes are not a whole-story completion claim.
6. Independent-phase receipts are internal module checkpoints only. Do not emit an issue-level CODE_COMPLETE or request Test/Close for a partially wired task. The child stays incomplete until its same owner finishes the wiring and complete declared verification; partial success is never Done.
7. Task 8 waits for full speech/capture integration. Task 9 then supplies whole-branch/live evidence/tutorial. Real missing/failed live cases remain nonpassing; parallelism does not substitute mock tests for them.

## Test groups and integration checks

- Task 1 first delivers contracts tests and scripts/unit tests. Task 2 adds admission/config/leases and slow deadline cases.
- Task 3 first delivers `tests/integration` typed orchestration and its own contract/SSE/search files. Task 5 adds separate provider/endpoint files concurrently and adds audio integration only after its wiring gate.
- Task 4 first delivers UI tests and the Playwright browser harness. Task 6 and Task 7 each add distinct `tests/voice` files in their own worktrees; neither edits the other's tests. Task 7's browser/asset integration follows its wiring gate. Task 8 adds its own interruption/slow/browser files.
- Per-worktree test selection includes only the delivered suites at that phase; an absent future suite is explicit unavailable/failing rather than an empty passing group. A partial phase never uses an omitted group as evidence for whole-task acceptance. Parent integration reruns the owning task's complete delivered verification and relevant combined suites after every handoff. Task 9 runs every final root VC and the genuine epic trail.
- Use isolated worktrees, genuine task bindings, scoped commits, red/green boundary tests and independent task review. Parent integration serializes shared files and validates full child commit provenance. Stories reach Done only through the sanctioned Test/Review/approval/delivery/Close workflow with actual evidence.

## Acceptance and estimate

Focused review checks runtime/package/setup consistency, explicit entry/wiring dependencies, exclusive ownership and preservation of final evidence gates. Acceptance supplements the base plan; it does not grant implementation approval by itself or invent passing tests, credentials, live trials or a shorter estimate. Root must annotate epic #2 and every hydrated child with this amendment and its exact accepted revision before implementation approval/dispatch.

The base plan's 41 expected human hours and 29–61-hour range remain planning inputs, not elapsed-time promises. Parallel handoff/update/reverification work is recorded explicitly as coordination/integration time in each owning child. It is budgeted within the existing per-task ranges for this scheduling change; any actual overrun is reported in the child's evidence and root forecast rather than hidden or offset by claiming less scope. Parallelism does not mechanically reduce total effort.
