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
