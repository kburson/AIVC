# #5 Claude orchestration

Implementation has not started. Story review is pending. This draft collateral records the accepted scope and planned checks; it does not approve Plan, Develop, or a rank wave.

## Governing authority

- [Issue #5](https://github.com/kburson/AIVC/issues/5)
- [Reference design](../superpowers/specs/2026-10-12-voice-bff-reference-design.md)
- [Accepted base plan](../superpowers/plans/2026-10-12-2-voice-bff-reference.md)
- [Contract-first amendment](../superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md)
- [Canonical hydration index, Task 3](../superpowers/plans/2026-10-13-2-contract-first-hydration-index.md)

Implementation depends on whole [#4](https://github.com/kburson/AIVC/issues/4) being reviewed, integrated, and strictly Done, plus current registered native rank-wave admission. Consume the integrated #4 server configuration, admission, measured-body, deadline, lease, runtime, and capability boundaries. Consume frozen #13 shared contracts, SSE codec, and conformance fixtures unchanged.

## Ownership

After admitted entry, #5 owns the server-native model contracts, Claude and mock adapters, typed turn orchestration, project lookup and real HTTP retrieval client, normalized SSE response, and turn endpoint. It may extend runtime and capabilities after #4. Native Anthropic message and tool types remain server-only.

Owned source paths are `apps/web/server/providers/contracts.ts`, `apps/web/server/providers/claude.ts`, `apps/web/server/providers/mock.ts`, `apps/web/server/turns/run-turn.ts`, `apps/web/server/tools/lookup-projects.ts`, `apps/web/server/tools/retrieval-client.ts`, `apps/web/server/http/sse-response.ts`, `apps/web/app/api/turn/route.ts`, `apps/web/server/runtime.ts`, and `apps/web/server/capabilities.ts`.

Owned evidence paths are `tests/helpers/scripted-providers.ts`, `tests/integration/typed-turn.test.ts`, `tests/contracts/search-budget.test.ts`, and `tests/slow/disconnect.test.ts`. Shared SSE source, fixtures, and `tests/contracts/sse.test.ts` remain #13 inputs. Browser, capture, shared-contract, and root-manifest changes are outside #5 ownership. #7 acquires shared provider/runtime/turn wiring only after whole #5 integration.

## Planned checks

- Prove exact native tool-use/result identity, validated arguments, unchanged provider blocks, and actual Fastify HTTP retrieval provenance with scripted model rounds.
- Exercise three-round, four-attempt, 1,024-token, and shared two-search-use limits; native pause continuation; capability rejection; and no paid retry or replay.
- Prove one display accumulator, exact cross-round separators, citation metadata, and full producer type/data/sequence conformance through the frozen SSE encoder and decoder.
- Exercise incremental first-delta delivery, pre-stream errors, one accepted-stream failure, pre-aborted requests, and disconnect settlement that retains the lease until upstream work settles.
- Check that browser imports cannot reach server-native SDK modules. Preserve accepted runtime/dependency pins without application credentials or a live model choice for offline checks.

The accepted verifier commands are planned, not passing results:

```sh
npm run test:integration
npx vitest run tests/contracts/search-budget.test.ts tests/contracts/sse.test.ts
npm run test:slow
npm run typecheck
npm test
npm run lint
npm run format:check
```

Whole-story implementation, per-criterion evidence, review, delivery, and Close remain pending. The parent owner retains review, integration, and Close authority.

## Integrated boundary readiness

The accepted parent baseline `1dcc070` includes the completed #4 server delivery. The dependency implementation is now present in this branch through a normal preserving merge. Implementation of #5 remains unstarted while native rank-wave admission is refreshed; the current lifecycle decision still refuses entry with `rank-wave-graph-stale`.

The inspected APIs establish the following implementation boundaries:

- `getRuntime()` returns process-owned configuration, capabilities, adapter storage, and shared lease pools. #5 will populate its own model/retrieval adapters without replacing #4 admission or altering another provider.
- `assertAdmission(headers, config, true)` checks the configured Origin and matching Host before body access. `runAdmittedTurn(req, config, work)` performs the inherited turn deadline and bounded 2 MiB parse before the work callback.
- `runWithDeadline()` returns separate `result`, `settled`, and `signal` fields. The producer callback must await all admitted upstream work; returning a Response alone does not establish settlement. Release the acquired turn lease only after `settled`, even when client-facing timeout or stream cancellation occurs earlier.
- `LeasePools.acquire('turn')` limits active upstream-held turn slots to two and supplies idempotent release. Provider cancellation and response-stream completion must preserve this distinction.
- `errorResponse()` and `errorFields()` provide the common sanitized error boundary, using the frozen shared AppError. Pre-stream and accepted-stream error handling must reuse this boundary.
- The actual retrieval integration entry is `createRetrievalApp()`. Tests can start it on an ephemeral loopback port and exercise the real HTTP client without importing a catalog fallback into production BFF code.
- The frozen normalized fixture pins accepted/researching/preamble/tool-started/retrieving/tool-completed/answering/separator/answer/completed, sequence zero plus one, exact Atlas catalog, and scripted usage 20/30/0. Producer conformance must prove that full trace through the actual turn generator and codec.

The first admitted implementation checkpoint will establish the scripted native-message helper and real HTTP producer test, observe the expected failure, and implement only the server-owned orchestration needed to pass. Further checks cover argument-error continuation, round/tool/search budgets, exact text joining, provider capability behavior, and request cancellation with deferred upstream settlement. Official SDK types and capability fields will be checked from the installed pinned SDK before implementing the live adapter; this readiness note makes no live-provider call or acceptance claim.

All earlier ownership and whole-story review gates continue to apply. The user stop boundary remains completion of rank 4, then pause before #8.
