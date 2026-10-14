> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/node26-parallel-amendment/2026-10-13-2026-10-13-2-node26-parallel-execution-amendment-review-5ef82914582f28301f7a3be322541e48-reviewer-response-1.md) and its exact bytes remain available in the [evidence archive](../../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `6fbf26696417f098a2736e6e8227f20edee6ea5e0d8432e7571c1b73d3462f9b`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-5ef82914582f28301f7a3be322541e48'
role: 'reviewer'
turn: 1
commit_mode: 'normal'
authority_assurance: 'unavailable'
artifact_path: 'docs/superpowers/plans/2026-10-13-2-node26-parallel-execution-amendment.md'
artifact_commit: 'b7d49407b2464325d6c9d11c4d624c4089aea206'
artifact_blob: '2f8ec3614a1ea4fea4e2904a984ac0589f474d81'
artifact_digest: 'sha256:180474128b9d15289f06d0279961812020e3faa8025cb6edbf008566d494a04a'
agent:
  host: 'claude-code'
  provider: 'anthropic'
  model_id: 'claude-opus-5-5'
  model_display: 'claude-opus-5-5'
  session_fingerprint: 'sha256:5026c80f4b8d4366c9625e2fb11e874d7bccaa40e091d301b8f544292e2a025c'
  identity_source: 'runtime'
started_at: '2026-10-13T12:12:08.787Z'
submitted_at: '2026-10-13T12:14:43.660Z'
finding_ids: []
answered_finding_ids: []
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

I reviewed the amendment (`docs/superpowers/plans/2026-10-13-2-node26-parallel-execution-amendment.md`, blob `2f8ec36`) against the full accepted implementation plan (`docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md`, all 768 lines). I checked every task's Files/Modify lists, interfaces, verification commands, the Plan Metadata dependency note (line 77) and the Task 1 / Task 9 runtime and CI steps. I covered the focus areas the amendment names: runtime constraints, package/setup consistency, dependency ordering, exclusive file ownership and preservation of final verification gates. I also fetched the cited Node 26.8.1 release page. It exists, is dated August 26, 2026, labels the line "Current" and does not name a bundled npm version. I did not recompute the SHA-256 of the base plan in this session.

The amendment keeps the important things intact. Architecture, limits, deliverables, all 15 spec cases, live-evidence gates and the Test/Review/approval/Close boundaries stay binding. It never lets partial work stand in for Done ("CODE_COMPLETE, never … Done"). It also leaves the global ai-peer-review runtime alone. The Node floor change and the Task 8 / Task 9 ordering are sound.

Four gaps would block a coherent native dependency graph or reproducible setup:

- The Task 3/Task 5 shared-file handoff leaves it unclear who commits the shared-file edits, and under which child issue.
- Tasks 6 and 7 have no stated entry prerequisites.
- The exact npm 12.0.2 pin has no enforcement mechanism on Node 26.
- The `@types/node` 24.19.2 pin now conflicts with the Node ≥26 runtime contract.

All four are small, local edits.

## Findings

1. **Task 3/Task 5 handoff leaves unclear who edits the shared files and which child issue gets the commit (High: ownership and traceability).**
   - What the amendment says: "Task 5 hands its adapter to Task 3's owner for shared-file wiring after Task 3 integration."
   - What the base plan requires (line 464): Task 5 modifies `mock.ts`, `runtime.ts`, `run-turn.ts` and `capabilities.ts`. Line 487 also makes the audio-turn integration Task 5's own deliverable: transcribing stage, transcript event and no-speech completion inside `run-turn.ts`. Line 126 says "every task ends with its declared delivered tests and a scoped commit under the real governed child issue."
   - The gap: if Task 3's implementer writes Task 5's `run-turn`/runtime/mock wiring, that commit must be bound to either Task 3's or Task 5's child. The amendment doesn't say which.
     - Bound to Task 3's child, Task 5's acceptance depends on code committed outside its own scoped trail.
     - Bound to Task 5's child, a different session commits under a child it is not bound to, which strains the "genuine task bindings" rule in item 5.
   - It is also inconsistent with item 3. There, after Task 6 integrates, the _same_ Task 7 implementer completes the Conversation wiring. That pattern serializes access to shared files without moving the work to a different owner.
   - Smaller related gap: the amendment doesn't say where `SpeechAdapter` is declared while Tasks 3 and 5 run concurrently. The natural home is `apps/web/server/providers/contracts.ts`, which Task 3 creates. The Task 5 mock speech adapter belongs in Task 3's `mock.ts`.
   - Failure scenario: Task 5's isolated worktree declares `SpeechAdapter` locally (or edits `providers/contracts.ts`) while Task 3 creates that same file. That collides with "No two agents edit the same file concurrently." Alternatively, Task 5 cannot compile `deepgram.ts` against the shared interface until Task 3 lands.

2. **Tasks 6 and 7 have no entry prerequisites, so the native dependency graph can't be derived (High: dependency ordering).**
   - What the amendment says (item 3): "Task 4 typed UI follows Task 3. Task 6 speech playback and Task 7 capture/VAD may overlap only on independent files." It never says what Task 6 or Task 7 waits for.
   - Task 6 dependencies in the base plan:
     - It modifies `Conversation`/controller, which Task 4 creates (line 508).
     - It needs `multiRoundDeltaFixture` from Task 3's `tests/helpers/scripted-providers.ts` (line 534).
     - Its queue calls the `/api/speech` endpoint and `SpeechInput` contract from Task 5, and the wiring needs the real route.
   - Task 7 dependencies in the base plan:
     - It modifies `Conversation` and the "mock browser harness" (the Task 4 Playwright config/webServer).
     - It encodes the Task 2 WAV contract.
     - Its Start click creates the Task 6 playback context.
   - Item 5 says "Native dependencies and rank reflect the graph," but the text doesn't state the graph for these two nodes.
   - There is also a lower-severity ambiguity. Base-plan line 77 says Task 5's "final integration follows typed-path validation." The amendment moves Task 5 wiring to "after Task 3 integration" without saying whether "typed-path validation" means Task 3 only, or Tasks 3 and 4.
   - Failure scenario: the decomposition step links Task 6 only to Task 3, or Task 7 only to Task 2. An implementer then starts Task 6's Conversation wiring before Task 4's Conversation exists, or before `/api/speech` exists, and has to stub or create files another task owns.

3. **The exact npm 12.0.2 pin has no mechanism that installs or checks it (Medium: reproducibility).**
   - What the amendment says: `packageManager` pins `npm@12.0.2`, and "CI and documented reproduction use these exact versions."
   - Why that isn't enough:
     - `.nvmrc` and `actions/setup-node` select only Node. They install whatever npm ships with that Node build.
     - The cited Node 26.8.1 release page doesn't say npm 12.0.2 is the bundled version. The shell's npm 12.0.2 may be a separate global install.
     - Corepack stopped shipping with Node starting at Node 25, so on Node 26 the `packageManager` field neither installs nor enforces npm by default.
     - The base plan's Task 9 CI step (line 697) says only "pinned Node24/npm11.9," with no install or check step. Neither the base plan nor the amendment adds one.
   - Failure scenario: CI uses setup-node 26.8.1 and gets a different bundled npm. `npm ci` may rewrite or reject `package-lock.json` metadata, or resolve differently. CI would still be described as running "these exact versions."

4. **The `@types/node` 24.19.2 pin is retained by implication and contradicts the Node ≥26 contract (Medium: package consistency).**
   - The amendment says to "Preserve all other direct package versions in the accepted plan." Base-plan line 143 pins "type packages Node 24.19.2," so as written that pin stays.
   - With Node 24 no longer allowed at runtime, typecheck would check against Node 24 API surface while the only supported runtime is Node 26.
   - Failure scenario: code typechecks against an API that changed or was removed in Node 26, or the plan's runtime checks rely on a Node 26 API that 24.x types lack. Either way, `npm run typecheck` (Epic VC 5) is not evidence for the declared runtime. The amendment's focused-review charter explicitly includes package/setup consistency, so this needs an explicit decision rather than an implicit carry-over.

5. **Node 26 is still the "Current" line, not LTS (Low: accuracy of documentation).**
   - The base plan's Tech Stack (line 9) says "Node 24.21.0 LTS." The cited release page labels 26.8.1 "Current."
   - Node 26's LTS promotion is expected in late October 2026, but it has not happened as of the amendment date.
   - Nothing in the amendment is wrong. However, nothing stops the Task 9 README/tutorial or evidence from carrying an "LTS" label over from the superseded baseline.

## Required changes

1. **Task 3/Task 5 handoff (finding 1).** Replace "hands its adapter to Task 3's owner for shared-file wiring" with the serialized same-implementer pattern already used for Task 7:
   - After Task 3 is integrated, the Task 5 implementer, still bound to Task 5's child, makes the `mock`/`runtime`/`run-turn`/`capabilities` wiring and the audio-turn integration in Task 5's own scoped commit.
   - Alternatively, explicitly name the child binding and commit scope for those edits if a different session makes them.
   - Also state where `SpeechAdapter` is declared during the concurrent window. Either Task 3 creates it in `providers/contracts.ts` as part of its reviewed interface before Task 5 imports it, or Task 5 declares it in `deepgram.ts` and moves it during wiring.
   - Also state that Task 5's concurrent portion is limited to `deepgram.ts`, `deepgram.test.ts` and route/endpoint code that compiles with injected dependencies. `audio-turn.test.ts` and the endpoint lease/capability tests reach green only in the wiring phase.
2. **Explicit predecessors for every task (finding 2).** At minimum:
   - Task 6 starts after Tasks 4 and 5 are integrated. Optionally, its pure `pcm`/`playback`/`speech-text`/`speech-queue` modules may start after Task 3, with Conversation wiring after Tasks 4 and 5.
   - Task 7's independent WAV/VAD/capture/patch/assets portion may start after Task 2 (or another named point). Its Conversation/browser wiring follows Tasks 4 and 6.
   - Clarify whether Task 5 wiring waits for Task 3 only or for Tasks 3 and 4, and reconcile this with base-plan line 77 ("typed-path validation").
3. **npm enforcement (finding 3).** Add a concrete step to Task 1 and Task 9.
   - Task 1's runtime check fails unless `node --version` equals the `.nvmrc` value and `npm --version` equals the `packageManager` version.
   - Task 9 CI installs npm 12.0.2 explicitly after setup-node (for example `npm install -g npm@12.0.2`) and then asserts both versions.
   - README reproduction documents the same step.
   - Optionally add `engines.npm`, so the existing `engine-strict=true` also guards local installs.
   - Alternatively, if 26.8.1 is verified to bundle npm 12.0.2, cite that evidence and still keep the version assertion.
4. **`@types/node` decision (finding 4).** Name the `@types/node` version Task 1 should pin under the Node ≥26 contract: an exact 26.x release confirmed in registry metadata at Task 1, matching the Node 24 approach. Alternatively, state and justify an explicit exception. In either case, amend "Preserve all other direct package versions" so it doesn't silently keep 24.19.2.

## Optional suggestions

1. In the Runtime contract, say that Node 26.8.1 is a "Current" release at amendment time. Ask Task 9 docs/evidence to state the actual release-line status observed at test time rather than reusing the superseded "LTS" wording (finding 5).
2. Item 3 lists the files Task 7 owns early. Also say that Task 7's early portion owns root `package.json`/`package-lock.json` (the `patch-package` 8.0.1 devDependency and `postinstall`) and `apps/web/package.json` (`predev`/`prebuild` VAD regeneration). Add that no other concurrently running task may change the lockfile until Task 7 integrates. Parent serialization covers this in principle, but the lockfile is the most conflict-prone shared file.
3. Name which task first delivers each shared test group in the parallel layout. For example, Task 6 and Task 7 each contribute `tests/voice` files in separate worktrees, and Task 5 adds to `tests/integration`. That way the base plan's "do not add empty passing groups" and absent-suite rules are judged per worktree and again after parent integration.
4. Parallel execution adds handoff and re-verification work, such as Task 5's post-wiring re-run and Task 7's post-Task-6 browser checks. Consider saying explicitly that this overhead fits inside the existing per-task ranges or is tracked separately. The amendment rightly does not shorten the estimate, but it should not implicitly absorb new coordination cost either.

## Decision

revisions-requested
