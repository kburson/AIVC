# Issue 40 migration implementation plan — native SAR round 1

## Decision

**changes-requested**

The target architecture remains sound and the plan resolves the three optional specification suggestions. Three implementation-plan revisions are required: connect actual operation settlement to the lifecycle interface, define a runnable production-container acceptance harness with genuine provider controls/observations, and repair the extraction-stage handoff so its required tests can execute before web delegation is complete. These requests do not require reopening the accepted specification.

## Artifact and reviewer provenance

- Issue: [AIVC #40](https://github.com/kburson/AIVC/issues/40).
- Reviewed artifact: `docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md`, all 314 lines, including the appended decisions.
- Independently computed plan SHA-256: `3a9945e10ec2a53c5bbad579826c34e3693a9492dd7f31d907bbfc190f943c1e`.
- Author-supplied plan commit: `4ce5e66`. No reviewer Git command independently attested that commit. The decision is tied to the file bytes and hash above.
- Accepted specification: `docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md`; independently rechecked SHA-256 `fecb93bdc40e6f2636f04bb243d7f5cbf74cbb8041f8c16891f38db4c643d1d4`, unchanged from specification SAR.
- Requested provider/model/effort: Codex / `gpt-6-astra` / `high`.
- Same native reviewer task: `/root/migration_sar`; same own-session fingerprint SHA-256 `5c36eec6e272d9b56b54155bfcd9373f488e131c0f0eecad3a3158aadff3f28c`, established during specification SAR from this process's own session handle. Raw identity is omitted. Provider-certified per-turn model/effort attestation remains unavailable.
- Review class: native single-reviewer SAR, not sealed SPR/XPR or two-party consensus. The owner selected completion of native SAR followed by a pause for registered runtime/MCP recovery before sealed XPR. No implementation permission follows from this review.

## Scope and verification boundary

Reviewed the full plan against the accepted design and the governing #39 architecture/stateless/Task 0 requirements already inspected in specification SAR. Inspected current route and streaming modules, runtime/mock/scripted-provider boundaries, existing regression tests, test runners, production launcher/build scripts, workspace manifests, contract digest tooling, and Playwright configuration/system server. Read the installed pinned Next.js custom-server guide cited by the plan. Checked the relevant Superpowers review/planning guidance; this is artifact review, not plan execution or a request to launch another reviewer.

Only source/document reads and content hashing were performed. No tests, builds, containers, application code, provider calls, Git commands, lifecycle transitions, or deployments were executed. Wrote only this authorized report. Claims about present source describe inspected files; planned fixtures and interfaces are not treated as implemented evidence.

## Required findings

### R1 — Define the operation-to-lifecycle settlement handoff

**Priority:** P1. **Plan references:** lines 119–162, 164, 203–223; web lifecycle lines 310–314.

The plan defines `ActiveRequest.finish(settled: Promise<void>)` and requires the registry to retain requests until actual settlement. However, the moved turn/speech handlers still have only their existing response contract identified, while `pumpResponse` accepts a `Response` and returns its transport completion. The plan never defines how the real provider settlement promise escapes the handler or is registered with the lifecycle before a response is returned or rejected.

This distinction is observable in current source: `apps/web/server/http/sse-response.ts:97–121` releases a lease from private `task.settled` but returns the race for response readiness; `apps/web/server/http/speech-response.ts:160–169` likewise waits for reads/cancellation internally and returns a separate response promise. A timed-out or disconnected response can finish while those promises remain pending. A route cannot recover the private operation settlement from its response or the socket pump. The lifecycle fixture at plan lines 208–216 supplies a deferred promise itself, so it can pass even if the actual routes unregister on transport completion.

**Required revision:** Define and assign the exact handoff between operation creation, HTTP response readiness, provider/reader settlement and registry removal. An operation handle containing separate `response` and `settled` promises, or an explicit injected registration callback, would work; select one and show its use at the real route boundary. State who registers before ingestion, who finishes rejected pre-admission requests, how shutdown/caller/timeout signals reach the operation, and how response-pump cancellation is joined without substituting it for provider settlement. Document the analogous web wrapper/forwarding connection sufficiently to distinguish a closed browser socket from settled upstream-reader cancellation.

Add a real-route integration oracle in the owning task: after a response times out/closes, delayed provider cancellation still occupies both the paid lease and shutdown registry; shutdown cannot report drained before that promise settles, and the hard bound records unknown if it does not. Include early auth/validation failure and failure before response readiness so registry leaks cannot hide behind successful-stream cases.

**Closure condition:** An implementer can wire the existing private deadline settlement into the declared lifecycle without inventing an unreviewed cross-module interface; the real-route test fails if registry removal is tied to response completion.

### R2 — Freeze the production acceptance runner and scripted-provider boundary

**Priority:** P1. **Plan references:** file map lines 66–69; lines 144, 192, 229–255, 264.

Task 5 depends on provider-observed history/speech input, delayed old events, deferred cancellation, per-replica work counts and no replay across hard termination. The plan names a `scripted-provider-server` and `providerCounts()` but does not specify how the production core image selects that provider, how the test controls it, or how those observations survive termination of the core being tested. Task 2's injected in-process adapters and test counters do not establish this cross-process seam. Current `apps/web/server/providers/mock.ts:32–91` returns fixed immediate model events; its speech mock at lines 95–129 emits two short chunks. Neither exposes the required delays, cancellation gates or observer ledger. Current `tests/helpers/scripted-providers.ts:98–115` stores inputs/signals in the test process and likewise cannot be observed from a separately launched production core without a defined bridge.

The runner is also incomplete. The Node entrypoint delegates to a new script, but that script's concrete command/configuration is not selected. Current `playwright.config.ts:9–13` always starts `tests/browser/system-server.ts`; that file launches `next dev` and an in-process lookup (lines 41–71), without a standalone core. Adding the new browser spec and invoking the existing Playwright command would exercise the wrong topology or collide with the container web port. The file map does not assign this configuration/system-server migration. Saying “topology-owned suite exactly once” and “production-compatible web handler” does not yet identify the production browser execution path.

**Required revision:** Select and define a bounded test-provider mechanism compatible with the real production core entrypoint/images. Record its exact configuration/admission boundary, supported script controls, observation schema, fixture lifecycle, network/egress restrictions and how tests retrieve counters after core death. Test-only controls must remain outside public application routes; if special fixture artifacts are needed, state their provenance and exactly which production lifecycle/module behavior is shared and independently verified. Clients must not manufacture missing server behavior. This need not implement the later performance-research simulator.

Name the owning runner/config files and commands for `test:migration:containers`, Vitest selection, and Playwright selection. Give the container browser config a base URL from the started topology and no development `webServer`; migrate the ordinary browser fixture to three-service routing as needed for Task 6 regressions. Define topology startup/teardown ownership and finite subprocess/test timeouts, preserve nonzero exits for missing Docker/Compose/images/Chromium, and keep the explicit no-recursion rule. Add runner tests or a checkable dispatch manifest proving each required selection runs once and cannot silently fall back to the legacy server. Specify that image/source identity is checked before a cached local image is accepted.

**Closure condition:** The plan supplies a concrete command path from the required node:test entrypoint to the real production topology and browser, with deterministic provider controls and independently observable history/cancellation/replay evidence. The same plan cannot be satisfied by the present two-service development harness or process-local counters.

### R3 — Make the core extraction checkpoint runnable before web delegation

**Priority:** P2. **Plan references:** dependency graph lines 40–50; file moves line 73; Task 2 lines 147–165; Task 3 lines 169–197; networking line 296.

Task 2 moves the runtime and HTTP modules out of web, then runs existing disconnect regressions while Task 3 owns replacement of the web API routes. Current `apps/web/app/api/turn/route.ts:1–9` imports the files being moved. The required `tests/slow/disconnect.test.ts:1–8` imports that web route, and its fixture at lines 19–61 injects a web-global runtime. Updating moved imports only, as line 165 instructs, does not retarget that test to `createOrchestratorApp`; the POST route still points to removed modules until Task 3. The plan supplies no compatibility seam or atomic extraction/delegation boundary, so the Task 2 checkpoint is internally inconsistent with its stated verification.

Additionally, line 296 assigns real inter-container connectivity to Task 2 although production packaging is created in dependent Task 4. That check needs an explicit earlier fixture or a later owning task.

**Required revision:** Select a coherent transition strategy. Either retain explicitly temporary, single-source compatibility re-exports until Task 3 removes them; retarget existing route regressions to a specified core fixture and define how the web remains buildable during extraction; or adjust the work-package boundary so route replacement and extraction land atomically. Do not retain duplicate executable orchestration. Map the existing web-global fixture/POST tests to their new injection/transport target while preserving every behavioral assertion; replace the “imports only” restriction where necessary. Place production inter-container connectivity after its packaging prerequisite or define the earlier fixture it uses.

**Closure condition:** Each declared checkpoint has resolvable imports and runnable owning checks, and no task requires another later task's uncreated deployment artifact. The final web provider-import boundary remains enforced after Task 3.

## Positive conclusions and unchanged design decisions

- The appended networking decision addresses the actual loopback-only lookup client and bind addresses with fixed configured service origins and negative URL/redirect cases.
- Contract-digest path migration is explicitly assigned and preserves historical hashes while using wire fixtures for semantic parity.
- The readiness matrix distinguishes caller authentication from optional paid-provider configuration, supports mock mode without paid keys, and specifies finite coalesced probe/cache policy.
- The installed `node_modules/next/dist/docs/01-app/02-guides/custom-server.md` supports `next({dev:false})`, `prepare()` and `getRequestHandler()`, and explicitly excludes combining a custom server with standalone output. The selected full-dependency packaging approach follows that limitation. Actual shutdown correctness still needs the plan's socket proof and R1 handoff.
- Authentication-before-parser, multipart/JSON parity, two-slot settlement semantics, no retries, caller-carried history, client generation fencing, explicit duplicate behavior, read-only containers, graceful/hard failure outcomes and research gating remain aligned with the accepted specification.
- The Node acceptance wrapper explicitly prohibits recursion and silent prerequisite skips. R2 asks for its missing executable dispatch details rather than reversing that decision.

## Optional suggestions

1. In Task 2's queue instrumentation, distinguish original producer allocations, queued slices, Node/Web stream buffering and socket buffers. A large original chunk retained by small subarray views must not disappear from the reported application memory bound. The plan already requires producer-demand gating; a fixture with an over-16-KiB source chunk makes that obligation observable.
2. Put the selected web wrapper and any new migration-specific runner/configuration files directly into the main file map after revision. This avoids requiring an implementer to discover their ownership only in appended decisions or review dispositions.

## Re-review and stop boundary

Revise the plan and write explicit dispositions for R1–R3, retaining this report. Return the full revised artifact to this same reviewer session for holistic re-review, including any new interactions. No implementation or state transition is needed to resolve these planning findings. Once native review of both artifacts is complete, preserve the owner's requested pause for registered runtime/MCP recovery before sealed XPR; do not convert SAR into XPR evidence.
