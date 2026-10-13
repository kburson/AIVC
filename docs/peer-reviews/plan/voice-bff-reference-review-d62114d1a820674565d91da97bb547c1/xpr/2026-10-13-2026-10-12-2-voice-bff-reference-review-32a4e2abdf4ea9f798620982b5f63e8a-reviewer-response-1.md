<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-32a4e2abdf4ea9f798620982b5f63e8a"
role: "reviewer"
turn: 1
commit_mode: "normal"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md"
artifact_commit: "183bfda3715ff7d6dd5ffd7cfaecbf5987d971eb"
artifact_blob: "8f2f3f3551512ba83c90ef94c7ab34114413dbef"
artifact_digest: "sha256:555fdbbcf7ecc3234087733cc694bb7bbf5952d773739258c2b285a0bd69e3de"
agent:
  host: "claude-code"
  provider: "anthropic"
  model_id: "claude-opus-5-5"
  model_display: "claude-opus-5-5"
  session_fingerprint: "sha256:54bb4b51f8ef2cf4bc224815244edf83497147eeef35a62104d8cd8661463384"
  identity_source: "runtime"
started_at: "2026-10-13T05:51:08.220Z"
submitted_at: "2026-10-13T05:56:21.910Z"
finding_ids: ["R1-F001","R1-F002","R1-F003","R1-F004","R1-F005","R1-F006"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---

Mode: `normal`

## Summary

Revisions requested. The plan is thorough, faithfully tracks the accepted specification's architecture, limits and 15 verification cases, and keeps live/provider evidence honestly separate from offline checks. However, one state-machine gap breaks the core hands-free interruption loop (R1-F001), and five further implementation-contract defects would lead an implementer to wrong behavior or to an unreproducible completion gate (R1-F002 to R1-F006).

This is an independent cross-provider plan review, not implementation verification or Plan approval. I read the complete 745-line artifact at the recorded commit/blob and the complete accepted specification, inspected the root `package.json`, `.gitignore`, `.claude/settings.json` hook entrypoint resolution, and the installed `@kburson/ai-task-manager` `verify-epic-trail.mjs` (`main(argv, deps)` export, direct-invocation guard, `AITM_TEST_ISSUE_NUMBER` handling). I did not run Git, edit the artifact, install dependencies, execute application code or call any provider. External web access was unavailable in this session, so claims about third-party library internals below are stated from the plan's own text or from well-established framework defaults and are marked where they need confirmation. Authority assurance is unavailable as recorded by the protocol.

**Coverage assessment**

| Area | Assessment |
|---|---|
| Architecture and scope | Two loopback processes, no Edge/custom server/second gateway, exclusions and extension prose match the spec. |
| Spec cases 1–15 | Every case has an owning task and automated evidence; live evidence mapping L1–L8 matches the eight manual scenarios. |
| Task 1 workspace/retrieval | Concrete pins, script map and runner rules; epic wrapper import path resolves to the installed package and does not double-run its `main` (direct-invocation guard compares argv[1] to the package path). Fastify validation semantics need correction (R1-F004). |
| Task 2 admission/leases | Pre-body admission, measured body cap, WAV/history validation and settlement-owned leases are coherent and well tested. |
| Task 3 Claude/search/SSE | Native block retention, search budget accounting and `no-transform` SSE are sound. Multi-round text joining is undefined (R1-F003). |
| Task 4 history/UI | Atomic whole-pair history and stale-event gating match spec case 14/4. |
| Task 5 Deepgram | Raw stream, MIME parsing and zero retries are sound; hard-coded SDK timeouts conflict with configurable deadlines (optional 3). |
| Task 6 playback | PCM ledger, segmentation and backpressure are precise. Admission requires a running playback context, which interacts badly with Task 8 (R1-F001). |
| Task 7 capture | Patch-based lifecycle cleanup and token snapshots are thorough. The `getStream` example contradicts the stated pause/resume reacquisition (R1-F005). |
| Task 8 interruption | Capture/answer ownership separation fixes the previously reviewed end-admission ambiguity. Nothing returns the suspended playback context to running after confirmation (R1-F001). |
| Task 9 evidence | Read-only `verify:live`, source/patch/module digests and honest unverified states are strong. The required clean production build has no owned launch command or build-id mechanism (R1-F002); CI omits browser binaries (R1-F006). |

## Findings

### R1-F001 — Confirmed interruption leaves the playback context suspended, so the next voice answer is never spoken

**Priority:** P1. **Location:** Task 6 admission (line 525: "no next request until audio <=2 seconds/running/not tentative"), Task 6 gesture resume (line 526), watchdog (line 528), Task 8 transitions (lines 615, 617, 619–635, 637). **Affected contract:** spec automatic turn behavior step 6–7, spec case 12, live scenario L3 ("interrupt … and ask about Beacon").

Task 8 raw start suspends the dedicated playback `AudioContext` (spec: during both Working and Speaking). Misfire resumes it. Confirmation (`commitCandidate`) cancels the old answer, queue and sources — but no step resumes the context. The playback context is resumed only in a user gesture (Start or typed submit, line 526). Task 6 speech admission requires playback to be *running*. Consequently, after the canonical voice barge-in (raw start → confirm → speech end → new turn), the new answer's text streams but its first speech segment is never admitted: the context stays suspended, `isRunning()` is false, and because no audio is outstanding the three-second watchdog never fires either, so there is no visible error. The same stuck state follows a watchdog `PLAYBACK_STALLED` teardown (the context is left suspended for the next answer) and a candidate invalidated by Stop-less paths (newer raw start, microphone mute, overlong discard) while suspension is in effect. Line 615's "if confirmation/new turn intervened, never restore old audio" can additionally be read as "never resume", reinforcing the defect. The typed path masks the bug because its gesture resumes the context, so typed browser tests would pass while L3 fails live.

**Required change:** Separate "restore old audio" from "return the playback context to running". After confirmation has stopped/cleared the old answer's sources (and after any pending `suspend()` has settled), resume the dedicated context so the next generation can play; likewise after watchdog teardown and whenever a tentative candidate becomes stale without restoration. Resumption must happen only once no old-generation source can still play. Note that programmatic `resume()` after the page has received user activation (Start click) is expected to succeed in Chromium, but the plan should treat a rejected/still-suspended resume as a visible speech error rather than a silent hang. Optionally have the speech pump surface a non-running context while text is pending as a status rather than waiting indefinitely.

**Verification:** Add a red Task 8 test with delayed suspend promises: Speaking → raw start → confirmation (with suspend resolving before and, separately, after confirmation) → speech end → new turn; assert old sources never play again, the context returns to running, and the new answer's first segment is requested and scheduled. Repeat starting from Working (no audio yet), after a watchdog teardown, and after a newer-candidate invalidation. Extend the browser interruption spec to assert the post-interruption answer actually schedules audio.

### R1-F002 — The live-evidence "clean Next build" has no owned two-process production command or build-id mechanism

**Priority:** P2. **Location:** Task 1 script map (lines 142–168), Task 9 live gate (line 668), README requirements (line 669). **Affected contract:** reproducible live evidence; epic VC 7 and 8.

Task 9 requires each deliberate live run to use "a clean Next build … restart the application processes and record that buildId from the served app". The root script map has only `dev` (which launches `next dev` and `tsx watch` children); there is no root `start`/production launcher, and `scripts/dev.mjs` only starts dev children. Under `next dev` the Next build id is not a production build identity, so the requirement cannot be satisfied through any owned root command; an operator would have to invent ad-hoc `npm run start -w …` invocations that `verify:docs` does not check and the tutorial does not document. The plan also does not say how "the served app" exposes its build id to the browser adapter (App Router does not provide a pages-style `__NEXT_DATA__.buildId`), so the `buildId` evidence field has no defined source.

**Required change:** Add an owned production launch command (for example root `start` via the launcher in a production mode running `next start` and `node dist/index.js` for retrieval, preceded by asset regeneration and build), document it in README/tutorial and check it in `verify:docs`. Define the build-id mechanism explicitly (for example a `generateBuildId` in `next.config.ts` that is also exposed to client diagnostics, or reading `.next/BUILD_ID` server-side into the capabilities/diagnostics payload) and state that live evidence recorded under `next dev` is not acceptable—or, alternatively, explicitly permit `next dev` evidence and drop the clean-build requirement. Choose one; do not leave both.

**Verification:** `verify-live.test.ts` rejects evidence lacking a production build id or carrying a development id; `verify-docs.test.ts` requires the documented production launch command to match `package.json`; a script test proves the production launcher starts exactly two children and forwards termination.

### R1-F003 — Multi-round answer text joining is undefined, so `turn.completed.text` equality and speech segmentation become fragile

**Priority:** P2. **Location:** Task 3 loop (lines 353–354), event contract (line 257), Task 4 completion check (line 397), Task 6 segmentation (lines 513–514). **Affected contract:** spec case 1 normalized answer, case 14 completed-history text, case 6 early speech.

Claude commonly emits text in a tool-use round (e.g., "Let me look that up.") and the answer in the following round; hosted search additionally splits an answer into many citation-bearing text blocks. The plan streams `answer.delta` per round and Task 4 rejects a completion "mismatching accumulated final text" as malformed, but never defines how text from separate rounds/blocks is joined or that `turn.completed.text` must equal the exact concatenation of emitted deltas. If the server joins rounds with a separator that is not also emitted as a delta (or vice versa), every tool-using turn fails the client's malformed-completion check and never enters history. If nothing is inserted, "…look that up.Atlas is active" both renders badly and defeats Task 6's whitespace-after-punctuation rule, holding the preamble sentence until a later boundary.

**Required change:** Specify the server's rule: `turn.completed.text` is exactly the concatenation of all `answer.delta` texts for the turn; any round/block separator (e.g., a paragraph break before the first text of a later round, only when prior text exists and does not already end in whitespace) is emitted as its own delta. State how citation-bearing blocks are concatenated (no added separator within a round).

**Verification:** Integration test with a round-1 preamble text plus `tool_use`, then a round-2 answer, and a search round with multiple cited text blocks: assert final text equals concatenated deltas, history commits, Markdown renders with a separator, and the preamble sentence is emitted by `SpeechText.push` before model completion.

### R1-F004 — Fastify's default validator strips unknown query fields and response schemas do not validate

**Priority:** P2. **Location:** Task 1 retrieval behavior (line 170) and implementation notes (lines 198–199). **Affected contract:** spec case 2 ("rejects malformed requests"); plan's own 400 requirements.

The plan states unknown query fields receive 400 and relies on "Fastify query schema has additionalProperties:false". Fastify's documented default Ajv configuration uses `removeAdditional: true` (and `coerceTypes: 'array'`), under which `additionalProperties:false` silently *removes* unknown properties instead of failing validation, so `/v1/projects?foo=1` would return 200 with all records. Likewise, Fastify response schemas drive fast-json-stringify serialization; they drop/coerce rather than validate (for example, enum membership is not enforced), so "Response schema validates every record" overstates the guarantee. Malformed percent-encoding also is not guaranteed to produce 400 with the default querystring parser. An implementer following the notes will either ship the wrong behavior or discover it only if they happen to add the unknown-field test, which the shown red test omits.

**Required change:** Configure `ajv.customOptions.removeAdditional = false` (or reject unknown keys explicitly) for the retrieval app, decide how malformed encoding is detected (custom `querystringParser` that throws on decode failure), and validate the fixture records once at load with the shared schema instead of relying on response serialization. Keep repeated `name` rejected under the chosen coercion setting.

**Verification:** Add to `retrieval.test.ts`: unknown field → 400, malformed percent-encoding → 400, repeated `name` → 400, plus a fixture-validation unit test that fails on an invalid status value.

### R1-F005 — The VAD `getStream` example returns one fixed stream, contradicting "resume reacquires" capture

**Priority:** P3. **Location:** Task 7 adapter (line 567 and snippet line 573). **Affected contract:** microphone mute/unmute and overlong-discard restart; spec case 8 resource release.

Line 567 says "pause stops tracks and resume reacquires echo/noise-suppressed mono capture", but the snippet supplies `getStream: async () => stream`, a single pre-acquired stream. Whatever path the pinned library uses to resume (re-invoking `getStream` or a separate resume hook — not verified in this session), returning the same stream after its tracks were stopped yields ended tracks and silent capture; if the library instead acquires a new stream through its own default, the adapter loses ownership of that stream and its default constraints may differ from the requested `channelCount/echoCancellation/noiseSuppression/autoGainControl` set. Either way, mute → unmute and the 30-second discard/restart path are at risk, and the "every acquired track stopped" accounting can miss a library-acquired stream.

**Required change:** Specify the pinned library's exact stream hooks for start, pause and resume, make `getStream` (and any resume hook) acquire a fresh constrained stream through an adapter-owned function that records every stream it hands out, and define who stops each stream on pause, Stop and destroy.

**Verification:** Extend `capture-session.test.ts`/`vad-lifecycle.test.ts`: start → mute → unmute produces a new live track with the requested constraints; every `getUserMedia` result is stopped exactly once after Stop; overlong discard/restart captures again.

### R1-F006 — CI and setup omit Playwright browser installation

**Priority:** P3. **Location:** Task 9 CI (line 674), README setup (line 669), Task 4 browser tests (line 421). **Affected contract:** epic VC 4 (`npm run test:browser`) on a clean runner.

`@playwright/test` does not ship browser binaries; `npm ci` alone leaves `npm run test:browser` failing on a clean CI runner or fresh checkout. Neither the CI step list nor the README setup includes installing the pinned Chromium.

**Required change:** Add an owned step (for example `npx playwright install --with-deps chromium` in CI and `npx playwright install chromium` in README, or a root script) and have `verify:docs` check that the documented setup includes it.

**Verification:** CI workflow review/`verify-docs.test.ts` asserts the install step precedes `test:browser`.

## Required changes

1. Resolve R1-F001 in Tasks 6 and 8: return the dedicated playback context to running after confirmed interruption, watchdog teardown and stale tentative candidates (without replaying old audio), surface a failed resume visibly, and add the full voice-barge-in → next-answer-speaks tests.
2. Resolve R1-F002 in Tasks 1 and 9: add an owned production two-process launch command and a defined build-id source, or explicitly drop the clean-build requirement; align README, `verify:docs` and `verify:live`.
3. Resolve R1-F003 in Task 3/4: define the multi-round/multi-block text joining rule and the delta/final-text equality invariant with tests.
4. Resolve R1-F004 in Task 1: correct Fastify validation configuration for unknown/malformed queries and validate fixtures at load.
5. Resolve R1-F005 in Task 7: make stream acquisition on resume explicit and adapter-owned.
6. Resolve R1-F006 in Task 9: add Playwright browser installation to CI and setup.

These are plan corrections; do not manufacture execution evidence during revision.

## Optional suggestions

1. Task 3 custom-tool cap: state exactly what happens when a single round requests more `tool_use` blocks than the remaining four-execution budget. Because every `tool_use` needs a matching `tool_result` before any continuation, either return `is_error:true` results for the over-budget calls and continue (if rounds remain) or end `truncated` without a further request. Also clarify that reaching exactly four executions does not by itself prevent the next round from answering with those results.
2. Task 1 wrapper test: the wrapper calls `main(argv)` without forwarding `deps`, so "controlled dependency test injection" is not reachable through it; only the temporary-fixture-package route can test it. Say so to avoid an implementer adding a test-only injection seam to the wrapper.
3. Task 5: derive Deepgram `timeoutInSeconds` from `config.speechTimeoutMs` and the remaining turn deadline instead of hard-coding 20 and 60; otherwise a configured `SPEECH_TIMEOUT_MS` above 20000 is silently undercut by the SDK timeout, contradicting "configurable positive finite bounds". The composite abort signal already enforces the configured bound.
4. Task 1 Vitest configuration: specify the jsdom environment mechanism for `tests/ui` and `.tsx` contract tests (for example Vitest projects or per-file environment docblocks); confirm against the pinned Vitest 4 release which per-glob option remains supported.
5. Task 4 `retainPairs` mutates its input via `shift()` while the store promises immutable pairs; copy before trimming.
6. Task 2: `readBoundedBody` has no time bound before lease acquisition; consider applying the turn deadline (or a shorter read deadline) to body reading so a stalled local client cannot hold an open request indefinitely. Low risk on loopback.

## Decision

revisions-requested
