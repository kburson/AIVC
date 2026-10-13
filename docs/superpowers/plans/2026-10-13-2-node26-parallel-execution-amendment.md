# Epic 2 execution amendment: Node 26 and parallel ownership

Date: October 13, 2026. Status: submitted for focused peer review; no application implementation is authorized by this draft alone.

## Authority and unchanged scope

The owner instructed this session to use Node >=26 and to fan out independent work after a reviewed, accepted plan and backlog hydration. This amendment supersedes only the Node 24 execution baseline and serial scheduling details in the accepted [implementation plan](2026-10-12-2-voice-bff-reference.md). That plan remains byte-identical at revision `cb82f730f63ba0e0bd4480f7bc76ca09d286af83`, SHA-256 `5dc37eb3c25f59d056756b45582a584ea321ac3a881041992b073b5a3656523e`. The original [accepted specification](../specs/2026-10-12-voice-bff-reference-design.md) and sealed review records remain unchanged. The two-process architecture, all limits, nine deliverables, 15 specification cases, required evidence and exclusions remain binding.

## Runtime contract

- Minimum supported runtime: Node >=26. Root `engines.node` is `>=26`; Node 24 is no longer an allowed application execution target.
- Reproducible baseline: `.nvmrc` pins `26.8.1`; root `packageManager` pins `npm@12.0.2`; the committed lock pins dependencies. CI and documented reproduction use these exact versions. Later Node majors satisfy the declared floor but are not described as tested without evidence.
- The current shell was checked: Node v26.8.1 and npm 12.0.2. Application setup uses this toolchain and does not install Node 24. Preserve all other direct package versions in the accepted plan; reconcile genuine install/engine errors explicitly.
- Task 1 updates runtime config, package scripts/lock and runtime checks to this contract. Task 9 updates CI, setup/tutorial and evidence validators to require Node >=26 and records the actual tested version.
- The global local-tarball ai-peer-review 0.4.1 runtime and MCP retain their existing absolute Node 26.8.1 path. No public package installation, global runtime replacement or broker-helper rebuild is part of application setup.
- Runtime floor compatibility is supported by [Next.js installation](https://nextjs.org/docs/app/getting-started/installation); the selected binary is the published [Node 26.8.1 release](https://nodejs.org/en/blog/release/v26.8.1). These source checks are not application build/test evidence. Clean installation, typecheck, build and every task's tests must run on the selected toolchain.

## Parallel execution contract

1. Workspace/retrieval Task 1 and shared admission/contracts Task 2 land first; downstream work uses their actual reviewed interfaces.
2. Then Task 3 Claude orchestration and Task 5 Deepgram may run concurrently, as the original plan already permits Task 5 after Task 2. Task 3 owns runtime/run-turn/capability wiring; Task 5 owns new deepgram.ts, speech route and its tests. Task 5 hands its adapter to Task 3's owner for shared-file wiring after Task 3 integration, then verifies its complete task before acceptance. No two agents edit the same file concurrently.
3. Task 4 typed UI follows Task 3. Task 6 speech playback and Task 7 capture/VAD may overlap only on independent files. Task 6 owns Conversation/controller wiring until it lands. Task 7 initially owns WAV/VAD/capture, patch/assets and their tests; after Task 6 is integrated its same implementer completes capture UI wiring and browser/build checks. An independent portion is CODE_COMPLETE, never a claim that the whole task or issue is Done.
4. Task 8 interruption waits for both completed speech/capture integrations. Task 9 completes whole-branch/live evidence and tutorial after the relevant implementation; no mocked or missing live acceptance is marked passing.
5. Use isolated worktrees, genuine task bindings, scoped commits, red/green tests and independent task review. Parent integration serializes shared files. Native dependencies and rank reflect the graph; scope and admission gates remain enforced. Stories reach Done only through the sanctioned Test/Review/approval/delivery/Close boundaries with their actual evidence.

## Acceptance of this amendment

Focused review checks runtime constraints, package/setup consistency, dependency ordering, exclusive file ownership and preservation of final verification gates. Acceptance supplements the original plan; it does not invent passing application tests, provider credentials, live trials or a shorter full-scope estimate. After acceptance, annotate epic #2 and every child with this governing amendment before implementation approval. The plan's 41 expected human hours and 29-61-hour range remain planning inputs rather than a promise of elapsed completion.
