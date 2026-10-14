> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/node26-parallel-amendment/2026-10-13-2026-10-13-2-node26-parallel-execution-amendment-review-5ef82914582f28301f7a3be322541e48-reviewer-response-2.md) and its exact bytes remain available in the [evidence archive](../../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `a513db4496b0b4fd9bd0878ea2af38a0cc71cd27fdac390f56f4764503c9d436`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-5ef82914582f28301f7a3be322541e48'
role: 'reviewer'
turn: 2
commit_mode: 'normal'
authority_assurance: 'unavailable'
artifact_path: 'docs/superpowers/plans/2026-10-13-2-node26-parallel-execution-amendment.md'
artifact_commit: '3574e5d35ebaafbf427a68aeac7c66e409b1e4e0'
artifact_blob: '8d053b67b9ddcce93f68a7a5beb9daef80475d2e'
artifact_digest: 'sha256:0d478dc1a1a114b63c7ebd2bf151fa7e0e5b17ed33f4410c81a06ddc098cd939'
agent:
  host: 'claude-code'
  provider: 'anthropic'
  model_id: 'claude-opus-5-5'
  model_display: 'claude-opus-5-5'
  session_fingerprint: 'sha256:5026c80f4b8d4366c9625e2fb11e874d7bccaa40e091d301b8f544292e2a025c'
  identity_source: 'runtime'
started_at: '2026-10-13T12:12:08.787Z'
submitted_at: '2026-10-13T12:24:06.933Z'
finding_ids: []
answered_finding_ids: []
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

This turn-2 review covers the revised amendment (`docs/superpowers/plans/2026-10-13-2-node26-parallel-execution-amendment.md`, commit `3574e5d`, blob `8d053b6`, digest `sha256:0d478dc1…cd939`). I compared it against three things:

- the author's turn-1 response;
- my own turn-1 findings;
- the accepted base plan's per-task Files/Modify lists, interfaces and verification commands. I had already read the full base plan in turn 1, and the author reports its bytes are unchanged.

All four required changes from turn 1 are resolved in the artifact text, not only in the author response. The optional items were adopted as well. Details below.

1. **Task 3/Task 5 ownership and commit binding (turn-1 finding 1): resolved.**
   - Ownership-and-handoffs items 2–3 now use the same pattern already applied to Task 7. The Task 5 implementer stays bound to child #7, rebases onto the integrated Task 3, and makes the `mock`/`runtime`/`run-turn`/`capabilities` and audio-turn wiring in a commit scoped to #7.
   - Task 3 exclusively owns `providers/contracts.ts`, `mock.ts`, runtime/run-turn/capabilities and the shared scripted-provider helper while it is active.
   - `SpeechAdapter` is declared in Task 5's own `deepgram.ts`, so the two concurrent tasks share no file.
   - The concurrent Task 5 phase is limited to the adapter, provider tests and new route/endpoint files built against injected Task 2 dependencies. `audio-turn.test.ts` and the lease/capability endpoint tests are explicitly gated to the wiring phase.
   - Cross-check: Task 4, which can now overlap Task 5's wiring phase, touches only client/component/CSS/test/Playwright files and page/layout. Those are disjoint from Task 5's server wiring files, so the overlap is safe.
2. **Entry and wiring prerequisites (turn-1 finding 2): resolved.**
   - The new entry/integration table gives every task and hydrated child (#3–#11) both entry prerequisites and wiring/completion prerequisites.
   - Base-plan line 77's "typed-path validation" is now explicitly defined as Task 3's typed server checks.
   - Task 6 enters after the full Tasks 4 and 5. That covers its Conversation/controller dependency, its `/api/speech` dependency, and (through Task 4) Task 3's `multiRoundDeltaFixture`.
   - Task 7's independent phase enters after Task 2. Its Conversation/browser wiring waits for Tasks 4 and 6, which also brings in Task 5 transitively.
   - The fallback is conservative and correct. If the native workflow cannot express a phase-level entry gate, the whole child is held. No sanctioned blocker is bypassed.
3. **npm enforcement (turn-1 finding 3): resolved.**
   - The pin is now enforced in four ways: an exact `engines.npm` under `engine-strict`, an explicit `npm install --global npm@12.0.2` in CI after setup-node, a Task 1-owned `scripts/verify-toolchain.mjs` with its own unit test, and an assertion that runs before `npm ci`.
   - The amendment explicitly declines to rely on Corepack or the `packageManager` field.
   - It also states that installing npm does not authorize touching the pinned global ai-peer-review runtime, MCP registration or broker helper.
4. **`@types/node` (turn-1 finding 4): resolved.**
   - The amendment pins `@types/node` exactly at 26.6.5 and states that this supersedes the 24.19.2 carry-over.
   - The author reports `npm view` evidence that 26.6.5 exists. I did not re-query the registry. Task 1 is required to confirm the exact pin at install, so a wrong version would fail closed.
5. **Release-line label (turn-1 finding 5): adopted.**
   - The amendment now calls 26.8.1 "Current" at amendment time. That matches what the official release page showed when I checked it in turn 1.
   - Task 9 must record the release-line status actually observed, not an inherited LTS label.

The revision also adds two things I did not ask for. Both are sound:

- **Purpose-wording edit excluded from authority.** An uncommitted edit to the specification's purpose wording is explicitly kept out of technical authority. The accepted spec stays at `bc6e15ec` / `8512daa8…`, and the edit is preserved without being stashed or committed through this review. This matches the repository's current state, which shows the specification as modified.
- **Test-group and coordination-time rules.** These are the per-worktree test-group rules and the statement that coordination time fits inside the existing ranges. They do not weaken any final gate:
  - an absent suite is never an empty passing group;
  - the parent re-runs complete verification after every handoff;
  - partial phases never produce an issue-level CODE_COMPLETE;
  - Done still goes only through the sanctioned Test/Review/approval/Close path.

These checks remain unchanged and binding: all 15 spec cases, the nine deliverables, the limits, the live-evidence gates, `verify:live`/`verify:docs` and the epic trail. The estimate is not shortened.

Verification limits for this turn: I did not rerun the SHA-256 computations or `npm view`. I relied on the recorded artifact digest, the author's recorded checks and my turn-1 reading of the base plan. None of the remaining items below blocks acceptance.

## Findings

None.

## Required changes

None.

## Optional suggestions

1. `scripts/verify-toolchain.mjs` runs before `npm ci` in CI, so it must use only Node built-ins (`node:fs`, `node:child_process`), with no workspace or third-party imports. Consider stating this explicitly. Consider also having it assert that `engines.npm` equals the `packageManager` npm version, so the two npm pins cannot drift apart.
2. `engines.npm` is pinned exactly at 12.0.2, `engine-strict` is on, and `engines.node` is an open `>=26` floor. Together, these require any later Node major to be paired with npm 12.0.2. If that is intended, a one-line note in the Runtime contract would prevent a future reader from treating "later Node majors satisfy the floor" as permission to use that Node's bundled npm.
3. Task 9 copies the accepted spec byte-for-byte to `docs/specification.md`. Consider stating that the source is the accepted `bc6e15ec` bytes, checked against `8512daa8…`, rather than whatever the working copy holds. Isolated worktrees cut from committed history already behave this way, and the existing hash check fails closed. Saying so explicitly would keep the uncommitted purpose edit from becoming a copy-source ambiguity before the root reconciles it.

## Decision

accepted
