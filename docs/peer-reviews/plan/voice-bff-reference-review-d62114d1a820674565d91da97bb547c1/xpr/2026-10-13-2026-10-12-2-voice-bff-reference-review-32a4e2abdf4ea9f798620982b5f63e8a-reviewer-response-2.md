<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-32a4e2abdf4ea9f798620982b5f63e8a"
role: "reviewer"
turn: 2
commit_mode: "normal"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md"
artifact_commit: "8efbdd19f03609f8429237c9be4b218f2ebcf427"
artifact_blob: "6c9c69f7fa6f4c1f0f3ebfce426cd9c121373b95"
artifact_digest: "sha256:276b5337f8d7b5597f15d872e7c13f74bdc93b9cb78b5a981792181a9f08b837"
agent:
  host: "claude-code"
  provider: "anthropic"
  model_id: "claude-opus-5-5"
  model_display: "claude-opus-5-5"
  session_fingerprint: "sha256:54bb4b51f8ef2cf4bc224815244edf83497147eeef35a62104d8cd8661463384"
  identity_source: "runtime"
started_at: "2026-10-13T05:51:08.220Z"
submitted_at: "2026-10-13T06:12:12.442Z"
finding_ids: ["R2-F001"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---

Mode: `normal`

## Summary

Revisions requested for one new, narrow defect introduced by the R1-F002 correction. All six turn-1 findings are resolved in the revised artifact, and the six optional suggestions were adopted soundly. The remaining problem: the new live-evidence rule compares the recorded production build ID against whatever `.next/BUILD_ID` exists when `verify:live` runs. Task 9's own verification sequence runs `npm run build` before `npm run verify:live`, and that rebuild would normally replace the ID. The completion gate would then fail for a correct report, or be passable only by never rebuilding (R2-F001).

Scope of this pass: I reread the revised artifact at the recorded commit/blob (766 lines). I checked every revised region (Tasks 1–9, interfaces, verification matrix) against the turn-1 findings and the author response, and rechecked cross-task consistency of the new contracts (`ensureRunning`/`resetAfterCancel`, `deadlineRemainingMs`, `readBuildInfo`, `parseProjectQuery`, `acquireStream`/`stopStream`, launcher modes). I did not run Git, edit the artifact, install dependencies, execute code or call providers. External web access was unavailable in this session. Where the author cites primary sources (pinned Next server BUILD_ID handling, Fastify validation docs, pinned VAD hooks, Vitest environment guide), I evaluated the plan's use of them for internal consistency; I did not independently re-fetch them. Authority assurance is unavailable as recorded by the protocol.

**Turn-1 finding verification**

| Finding | Status | Evidence in revised plan |
|---|---|---|
| R1-F001 playback context left suspended | Resolved | Task 6 interface adds `ensureRunning`/`resetAfterCancel` (line 509). The watchdog step resets the empty context after teardown, serializes suspend/resume and turns a hung or rejected resume into visible `SPEECH_RESUME_FAILED` even with zero outstanding audio (line 547). Task 8 stops old sources before the reset, defers to a newer tentative owner and never restores canceled audio (lines 636–657). Tests cover suspend before/after confirmation, the Working/no-audio path, post-watchdog recovery, newer-candidate replacement, rejected resume and browser Beacon audio scheduling (line 661). The queue-side `ensureRunning` before first admission also covers paths where `commitCandidate` does not reset. |
| R1-F002 production launch/build ID | Resolved, but see R2-F001 | Root `start --production` and `build:clean` scripts (lines 151–152, 213–214), `readBuildInfo` from `.next/BUILD_ID` exposed through capabilities (lines 276, 324), dev evidence rejected (line 689), README/docs verifier ownership (lines 690–691). |
| R1-F003 multi-round text join | Resolved | Exact delta-concatenation invariant and conditional `\n\n` separator delta (line 370), with preamble/tool and multi-citation integration test (line 371). |
| R1-F004 Fastify validation | Resolved | `removeAdditional:false`, `coerceTypes:false` and a strict `parseProjectQuery` with a malformed-query sentinel that the strict schema rejects (lines 205–212). Unknown-field and malformed-encoding 400 assertions were added to the shown test (lines 193–194). Fixture validation is done at load with pinned Ajv, and serialization is no longer described as validation. |
| R1-F005 stream reacquisition | Resolved | `getStream`/`resumeStream` call the adapter-owned `acquireStream`, and `pauseStream` maps to `stopStream`. Every returned stream is recorded, a WeakSet makes stopping idempotent, and late obsolete-epoch acquisitions are stopped (lines 571, 586, 592). Mute/unmute and overlong-restart tests were added (line 605). |
| R1-F006 Playwright browsers | Resolved | `test:browser:install` script (line 153), Task 4 runs it before the first browser suite (line 440), and CI runs `--with-deps chromium` before tests, enforced by the docs verifier (line 695). |

Optional suggestions 1–6 were adopted consistently: the custom-tool batch overflow truncates without partial results (line 372), the wrapper is tested through the fixture-package route only (line 222), SDK timeouts are derived from config and remaining deadline (lines 474, 482), the Vitest environment is set per file (line 173), and body reading is now under the turn deadline (lines 247, 299–322). The `retainPairs` copy change is described in the author response. I did not re-locate its code line, and it is not material to the decision.

## Findings

### R2-F001 — The build-ID comparison in `verify:live` is invalidated by the plan's own rebuild step

**Priority:** P2. **Location:** Task 9 verifier rule (line 689: "compare served recorded production ID with current .next/BUILD_ID") and the Task 9 verification command list (lines 701–714, `npm run build` at line 709 precedes `npm run verify:live` at line 713). Also Task 1 `build:clean` (line 214). **Affected contract:** epic VC 7 (`verify:live` read-only current live evidence) and reproducibility of the completion gate.

Unless `generateBuildId` is configured, Next.js generates a fresh build ID on each `next build`. The plan does not configure a deterministic ID: the author response cites the `generateBuildId` documentation, but the plan only reads `.next/BUILD_ID`. The intended workflow therefore conflicts with itself:

1. The implementer runs `npm run build:clean`, then `npm start`, then the live cases, and records the served `buildId`.
2. At final Test, the owner runs the Task 9 verification list in order. `npm run build` writes a new `.next/BUILD_ID`.
3. `npm run verify:live` compares the recorded ID with the new current ID, and the comparison fails even though the source, patch and module digests are unchanged.

The same failure occurs on any fresh checkout or detached Test worktree, where `.next/` is absent because it is ignored. The gate can then pass only on the original workspace, and only if no one rebuilds after the live run. That makes the "documentation-only descendant commit remains valid" rule ineffective in practice, and pushes the operator to skip a listed verification command or reorder steps by hand. The plan already binds the live report to the tested code through `sourceDigest`, `patchDigest`, `appliedModuleDigest` and the observed lifecycle marker, so comparing against a mutable local build artifact adds fragility without adding provenance.

**Required change:** Choose one consistent rule and state it in Tasks 1/2/9:

- (a) Make the production build ID deterministic. For example, `generateBuildId` in `next.config.ts` could return a value derived from the same source/patch/module digest set `verify:live` computes. `verify:live` would then recompute the expected ID from current bytes instead of reading `.next/BUILD_ID`, so rebuilds of identical inputs, fresh checkouts and documentation-only descendants stay valid, while any source, patch or module change invalidates the report. Or:
- (b) Keep the random ID as recorded provenance only. Require `buildMode:'production'` and a nonempty `buildId` in the evidence, but drop the comparison with the current `.next/BUILD_ID`, and rely on the existing digests for binding.

In either case, make the Task 9 command order consistent with the rule. Do not leave a listed `npm run build` that silently invalidates the gate.

**Verification:** `verify-live.test.ts` cases: a passing report survives a simulated rebuild of identical inputs, and survives a fresh checkout with no `.next/` (option a: via the recomputed deterministic ID; option b: no `.next` read at all). A source, patch or module change still fails. A development `buildMode` or an empty ID still fails. If option (a) is chosen, add a `build-info.test.ts` or config test proving `generateBuildId` produces the digest-derived value and differs when an input byte changes.

## Required changes

1. Resolve R2-F001: replace the comparison of the recorded build ID with the current `.next/BUILD_ID` with either a deterministic digest-derived build ID or provenance-only recording. Keep the Task 9 command sequence consistent with the chosen rule, and add the stated verifier tests.

These are plan corrections only; no execution evidence is implied.

## Optional suggestions

1. Task 3, line 371: the typed integration test asserts that `SpeechText` emits the stable preamble before the later round completes, but `SpeechText` is created in Task 6, and the dependency order is 1 → … → 9. Task 3 cannot run that assertion red/green. Keep the delta, separator and history assertions in Task 3 and move the preamble-speech assertion into Task 6's `speech-text.test.ts` or fast-producer test, using the same recorded delta sequence as a fixture.
2. Task 8, line 657: `showSpeechResumeFailure` is described as reporting against "the still-current affected answer", but the reset runs right after that answer was canceled, when no current answer exists. Name where the status appears at that point (for example, the conversation-level speech status, or deferred to the next answer's `ensureRunning`) so implementers do not drop it through a stale-token guard. Task 6's queue-side `ensureRunning` already makes the user-visible outcome safe. This is clarity only.

## Decision

revisions-requested
