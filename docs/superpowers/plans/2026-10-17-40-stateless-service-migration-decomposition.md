# Story #40 implementation decomposition

Status: proposed decomposition; awaiting owner approval. This is a new admission supplement, not an amendment or renewed peer acceptance of the sealed source documents. No application implementation is authorized. #40 remains Plan; created children remain Backlog. No Plan approval, Develop transition, provider execution or research unblocking is authorized by filing these stories.

## Source authority and boundaries

The exact accepted migration specification is `docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md` at `e6e96c9a4f07bb78faa73dc56368a0503d912982`, SHA-256 `f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`. The exact accepted implementation plan is `docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md` at `80efe1a150dbd8605aab69678c2a7a87f8553072`, SHA-256 `eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`. Their bytes, original sealed reports, manifests and references are unchanged. Historical in-document pre-review status wording remains historical; the acceptance records below identify the accepted revisions.

This supplement supplies the missing per-task Story Intent and creation-time verification mappings. The full corresponding accepted Task 1–6, Global Constraints, file map, specification coverage and every subsequent XPR/SAR correction remain mandatory; summaries below do not narrow them. In particular, all cross-task corrections beginning with service networking, policy, route settlement and production harness through final lifecycle/fixture corrections apply wherever their task assignments specify.

The dependency graph is serial: Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6. Native child relationships belong under #40. Native blocking edges link each later story to its predecessor. Owner approval of this decomposition is a separate hold on every child including Task 1. #40 remains the aggregate planning record; any later epic conversion, delivery topology and stage advancement must use governed actions after approval. PR #61 continues to target trunk; these issues are intake records, not picked-up implementation branches.

The accepted plan's preliminary joint estimates are 6 + 16 + 8 + 16 + 14 + 4 = 64 hours. They are not an approved forecast or newly assigned Backlog Size/Estimate fields. Refine each child before implementation. All listed verification commands are future implementation obligations, not executed or passing results. Preserve existing behavioral assertions; lack of required infrastructure is a failed prerequisite, not a skip or success.

## Story Intent

- **Beneficiary:** service operator
- **Capability:** deploy and scale the portable voice orchestrator independently
- **Need:** orchestration is coupled to the chosen web client
- **Value or failure prevented:** multiple clients can share backend capacity without duplicating UI or lookup

## Implementation stories

### Task 1: Extract browser-safe contracts

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** share one validated voice protocol across web and portable clients
- **Need:** the current contracts are coupled to the web workspace
- **Value or failure prevented:** clients retain compatible requests and streams when the backend is deployed independently

#### Scope and acceptance boundary

Source: accepted implementation plan Task 1, plus all explicitly assigned later corrections and accepted specification sections 4–9. Extract the actual four shared modules into browser-safe ESM/declarations, preserve multipart/history/SSE/PCM grammar and add bounded strict UTF-8 JSON text turns. Enforce duplicate decoded keys at every depth, depth 16 and unchanged body/text/history limits. Add canonical non-secret interface policy with server-only hashing, fail a missing/empty/transitively unsafe export closure, and prove pinned production Next 16.4 listener streaming, AsyncLocalStorage, disconnect, keep-alive refusal and bounded drain before downstream work.

Hold: owner decomposition approval pending; application implementation stopped. Pinned Next compatibility must pass before any downstream implementation; failure requires design revision.

#### Verification obligations

Run: `npx vitest run tests/contracts/workspace-boundaries.test.ts tests/contracts/wire-contracts.test.ts tests/contracts/json-turn.test.ts tests/contracts/interface-policy.test.ts tests/contracts/next-server-compat.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 2: Extract and serve the real Fastify orchestrator

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** run the existing voice provider pipeline behind a portable authenticated HTTP service
- **Need:** Next.js currently owns provider execution and request settlement
- **Value or failure prevented:** backend capacity can scale without duplicating the web client or releasing unsettled paid work

#### Scope and acceptance boundary

Source: accepted implementation plan Task 2, plus all explicitly assigned later corrections and accepted specification sections 4–9. Move actual runtime/providers/model/tool/STT/TTS/lookup behavior into Fastify with no duplicate executable implementation. Register lifecycle exactly once before auth; authenticate Host/bearer and policy before acquiring two turn/two speech pipeline permits before any body read, without a queue. Acquire paid leases only after validation and retain both permits/leases until actual cleanup. Implement bounded pull/write-drain streaming, deadlines, parent and per-invocation IDs, failure/unknown without replay, and bounded early error flush/connection close within 1000ms even for endless uploads. Exercise real SDK paths through isolated protocol stubs with no paid egress, late EOF/rejection and cancellation settlement; retain the temporary compatibility checkpoint until Task 3.

Hold: owner decomposition approval pending; application implementation stopped. Depends on completion of Task 1 through its governed delivery gates.

#### Verification obligations

Run: `npx vitest run tests/contracts/orchestrator-http.test.ts tests/contracts/provider-sdk-migration.test.ts tests/contracts/config.test.ts tests/contracts/leases.test.ts tests/contracts/admission.test.ts tests/contracts/deepgram.test.ts tests/contracts/search-budget.test.ts tests/slow/disconnect.test.ts tests/slow/deadlines.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 3: Delegate web requests without provider ownership

#### Story Intent

- **Beneficiary:** web voice client operator
- **Capability:** forward authenticated voice requests through a thin streaming web boundary
- **Need:** the web application currently owns the provider pipeline and cannot scale independently
- **Value or failure prevented:** browser behavior and cancellation remain compatible while provider ownership moves to the portable service

#### Scope and acceptance boundary

Source: accepted implementation plan Task 3, plus all explicitly assigned later corrections and accepted specification sections 4–9. Remove web provider imports/dependencies, temporary compatibility re-exports and runtime globals; retarget existing behavioral assertions without weakening them. Own the production Next Node listener, socket registry and AsyncLocalStorage context. Preserve Host/Origin protection and server-held token to fixed private endpoints, overwrite interface digest, strip untrusted/internal headers and forward exact SSE/PCM with bounded demand. Use duplex Node HTTP/HTTPS forwarding so pre-body upstream errors can flush during an incomplete upload before destructive input cancellation. Preserve sanitized 502/503/504 and static UI/local readiness during outages; no redirect/retry or whole-stream buffering.

Hold: owner decomposition approval pending; application implementation stopped. Depends on completion of Task 2 through its governed delivery gates.

#### Verification obligations

Run: `npx vitest run tests/contracts/web-forwarding.test.ts tests/contracts/next-server-compat.test.ts`

Run: `npm run test:integration`

Run: `npm run test:voice`

Run: `npm run typecheck`

Run: `npm run build`

### Task 4: Package independent production services and implement drain

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** start scale and terminate each production service independently
- **Need:** the current launcher and container lifecycle cannot prove independent stateless operation
- **Value or failure prevented:** capacity changes and shutdowns preserve bounded cleanup and explicit interruption outcomes

#### Scope and acceptance boundary

Source: accepted implementation plan Task 4, plus all explicitly assigned later corrections and accepted specification sections 4–9. Deliver three pinned non-root/read-only production images and private container listeners, independent local health/readiness, owned launcher cleanup and measured resource/buffer/config/catalog/interface digests. Withdraw readiness synchronously, refuse new keep-alive work, drain 15s then allow 5s cleanup with stop grace at least 25s. Build the offline fixture/router/driver/TLS ingress and trusted HTTPS Chromium topology; separate private control and data authority, retain surviving invocation journals and verified instance/container/IP attribution. Implement the host-only closed lifecycle channel with exact identities, bounded records/actions, idempotent acknowledgements and no Docker socket in driver. Implement runner budgets 1800s global/1860s wrapper, build600/readiness90/Vitest780/browser240/teardown30/reserve60 and closed scenario inventory. Preserve all final harness corrections, 3 MiB encoded fixture and padded WAV bounds.

Hold: owner decomposition approval pending; application implementation stopped. Depends on completion of Task 3 through its governed delivery gates.

#### Verification obligations

Run: `npx vitest run tests/contracts/service-lifecycle.test.ts`

Run: `npm run typecheck`

Run: `npm run build`

### Task 5: Prove cross-replica state and transport behavior

#### Story Intent

- **Beneficiary:** service operator
- **Capability:** verify later voice requests and interruptions across independently selected replicas
- **Need:** local single-replica tests cannot establish stateless routing or shutdown behavior
- **Value or failure prevented:** replacements and scaling do not hide affinity lost work or automatic paid replay

#### Scope and acceptance boundary

Source: accepted implementation plan Task 5, plus all explicitly assigned later corrections and accepted specification sections 4–9. Implement the mandatory Node acceptance entry point against real production containers with no paid credentials/egress and no silent skip on missing prerequisites. Prove A-to-B-to-B multipart text/WAV/JSON, cold replacement, actual router/fixture/lease attribution and failing same-replica/missing/corrupt attribution controls. Verify real browser generation/queue fencing, exact-owner cancellation and settlement, independent duplicate caller IDs, 404 cancellation-by-ID, multi-round/STT/tool invocation counts and zero ambiguous replay. Exercise authenticated pre-body refusal at every hop, slow upload/reader bounds, policy mismatch, SDK stubs, padded WAV, SIGTERM/SIGKILL and web/lookup outages. Verify real 1-to-2-to-1 membership retains identical core-a/web/lookup and modifies only core-b through acknowledged host actions.

Hold: owner decomposition approval pending; application implementation stopped. Depends on completion of Task 4 through its governed delivery gates.

#### Verification obligations

Run: `node --test tests/contracts/stateless-services.test.mjs`

### Task 6: Integrate verify and hand off the accepted application

#### Story Intent

- **Beneficiary:** research delivery owner
- **Capability:** receive a verified integrated application and its exact operational evidence
- **Need:** research Task 0 cannot use planning acceptance as proof of a working migration
- **Value or failure prevented:** performance research starts from reproducible application behavior and declared limitations

#### Scope and acceptance boundary

Source: accepted implementation plan Task 6, plus all explicitly assigned later corrections and accepted specification sections 4–9. Freeze source/image/topology/contract/config/catalog/interface-policy mapping and run every accepted regression and production acceptance verifier. Map each AC/DoD to genuine evidence, obtain independent whole-code review, and follow normal Test/Review/owner approval and exact-head authorized merge. Hand off actual accepted merged reachable source and both turn representations to research #41/#42 Task 0 only after application delivery. Preserve all planning review lineage and distinguish it from implementation review. No paid live verification, deployment campaign, benchmark claim or automatic research unblocking.

Hold: owner decomposition approval pending; application implementation stopped. Depends on completion of Task 5 through its governed delivery gates.

#### Verification obligations

Run: `npm run typecheck`

Run: `npm run build`

Run: `npm test`

Run: `npm run test:contracts`

Run: `npm run test:integration`

Run: `npm run test:voice`

Run: `npm run test:slow`

Run: `npm run test:browser`

Run: `npm run lint`

Run: `npm run format:check`

Run: `npm run verify:docs`

Run: `npm run verify:sealed-evidence`

Run: `node --test tests/contracts/stateless-services.test.mjs`

## Semantic story review

All six intents use operational beneficiaries grounded in the accepted documents. Each names a distinct capability and concrete failure prevented: protocol compatibility, portable provider ownership, browser forwarding, independent lifecycle, cross-replica correctness, and evidence-backed research entry. Needs and outcomes derive from accepted baseline gaps and acceptance requirements, not task titles. Each rendered story is independently readable; this review does not substitute for owner decomposition approval or later Plan approval.

## Preserved artifact and review lineage

The following is a snapshot of #40's existing Plan Metadata before hydration. Its historical hydration-status text describes that earlier point in time; the new issue map and owner hold above govern this decomposition. All existing review links and acceptance distinctions are preserved here; presentation headings are normalized for repository Markdown rules.

### Design Specification

Current migration design — **sealed XPR accepted**:

- **Accepted-migration-specification**: [XPR-accepted three-service design](https://github.com/kburson/AIVC/blob/e6e96c9a4f07bb78faa73dc56368a0503d912982/docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md)
- **Accepted-migration-specification-commit**: `e6e96c9a4f07bb78faa73dc56368a0503d912982`
- **Accepted-migration-specification-digest**: `sha256:f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`
- **Migration-specification-review-XPR**: [Accepted round 2](https://github.com/kburson/AIVC/blob/e6e96c9a4f07bb78faa73dc56368a0503d912982/docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-reviewer-response-2.md) · [Sealed manifest](https://github.com/kburson/AIVC/blob/e6e96c9a4f07bb78faa73dc56368a0503d912982/docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-review-manifest.md). Review `review-0009efb5ca6886291ad48628afa78120`; Claude `claude-opus-5-5` / high; two rounds, one revision; no required changes remain.
- **Acceptance mode**: LOCAL JOURNAL MODE, terminal `accepted-uncommitted`, assurance unavailable. Git publication separately pins exact accepted bytes; authentic MCP author handoffs completed at sequences 8 and 12.
- **Earlier uncertain XPR**: `review-2bdf5dd8ee56accc6e494643054a3cf1` remains preserved/unsettled. The accepted review is independent with a sealed preserved-predecessor reference; no launch replay or invented provider termination.

Historical migration design — **native SAR accepted at its original revision**:

- **Migration-specification**: [Three-service migration design](https://github.com/kburson/AIVC/blob/07a92dd97ca7d8819e235ebe97b17f08608d8671/docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md)
- **Migration-specification-commit**: `07a92dd97ca7d8819e235ebe97b17f08608d8671`
- **Migration-specification-digest**: `sha256:fecb93bdc40e6f2636f04bb243d7f5cbf74cbb8041f8c16891f38db4c643d1d4`
- **Migration-specification-review-SAR**: [Astra/high accepted report](https://github.com/kburson/AIVC/blob/codex/40-draft/docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/sar/astra-sar-report-round-1.md) — no required changes; native single-reviewer evidence.

Accepted revision — predecessor research specification from #39:

- **Specification-review-SAR/XPR**: [Specification review index](https://github.com/kburson/AIVC/blob/trunk/docs/peer-reviews/spec/voice-bff-performance-research-design-review-d0308a82e10640138be8eed7916011be/README.md)
- **Specification-review-XPR**: [Accepted round 2](https://github.com/kburson/AIVC/blob/trunk/docs/peer-reviews/spec/voice-bff-performance-research-design-review-d0308a82e10640138be8eed7916011be/xpr/2026-10-15-2026-10-14-39-voice-bff-performance-research-design-review-2cf04b3fce92c2a6faacb5bb36a1efb1-reviewer-response-2.md) · [Final sealed manifest](https://github.com/kburson/AIVC/blob/trunk/docs/peer-reviews/spec/voice-bff-performance-research-design-review-d0308a82e10640138be8eed7916011be/xpr/2026-10-15-2026-10-14-39-voice-bff-performance-research-design-review-2cf04b3fce92c2a6faacb5bb36a1efb1-review-manifest.md)
- **Accepted-specification**: [XPR-accepted research specification](https://github.com/kburson/AIVC/blob/55d8d208d0a5c465fdec820b11688e112afa6865/docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md)
- **Specification-reference-commit**: `55d8d208d0a5c465fdec820b11688e112afa6865`
- **Specification-reference-digest**: `sha256:2ee7b08cff5b8d5cf5f655bffc08a65219b0e9d0dc6e03b86e84654788a832e5`

Later amendments — **not covered by renewed SAR/XPR acceptance**:

- **Governing-spec**: [Amended governing specification](https://github.com/kburson/AIVC/blob/be1da47a81cbbf8b2bc56eda194bca2c0e9e1c42/docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md) — `docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md`
- **Governing-spec-commit**: `be1da47a81cbbf8b2bc56eda194bca2c0e9e1c42`
- **Governing-spec-SHA-256**: `bd1803bf8b3b1f6c70489c33a125ec4fd4dd9c8962b50023ae23a26945059919`
- **Governing sections**: 18–19 define the owner-directed three-service architecture and stateless-container requirements.

### Implementation Plan

Current migration plan — **sealed XPR accepted**:

- **Accepted-migration-plan**: [XPR-accepted migration plan](https://github.com/kburson/AIVC/blob/80efe1a150dbd8605aab69678c2a7a87f8553072/docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md)
- **Accepted-migration-plan-commit**: `80efe1a150dbd8605aab69678c2a7a87f8553072`
- **Accepted-migration-plan-digest**: `sha256:eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`
- **Migration-plan-review-XPR**: [Accepted round 2](https://github.com/kburson/AIVC/blob/80efe1a150dbd8605aab69678c2a7a87f8553072/docs/peer-reviews/plan/stateless-service-migration-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-review-3f99142a6b19c9dcbe0e6e53c7b1354a-reviewer-response-2.md) · [Sealed manifest](https://github.com/kburson/AIVC/blob/80efe1a150dbd8605aab69678c2a7a87f8553072/docs/peer-reviews/plan/stateless-service-migration-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-review-3f99142a6b19c9dcbe0e6e53c7b1354a-review-manifest.md). Review `review-3f99142a6b19c9dcbe0e6e53c7b1354a`; Claude `claude-opus-5-5` / high; two rounds, one revision; no required changes remain.
- **Acceptance mode**: LOCAL JOURNAL MODE, terminal `accepted-uncommitted`, assurance unavailable; separately published exact bytes. Authentic MCP author handoffs completed at sequences 8 and 12, including the unchanged delayed first caller.
- **Current planning estimate**: Six proposed dependent packages; preliminary **64 joint hours / XL**, reassessed from historical 52. Governed estimate/forecast, decomposition, hydration and owner Plan approval remain pending. Optional acceptance notes are recommendations, not later amendments to accepted bytes.

Historical migration plan — **native SAR accepted at its original revision**:

- **Migration-implementation-plan**: [Migration implementation plan](https://github.com/kburson/AIVC/blob/878cb5c16d5183a39980d39f5c7d54c27d8b2347/docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md)
- **Migration-plan-commit**: `878cb5c16d5183a39980d39f5c7d54c27d8b2347`
- **Migration-plan-review-SAR**: [Round 1 — changes requested](https://github.com/kburson/AIVC/blob/f92d678e576658fa0e89d2bb692d5f441f27ba16/docs/peer-reviews/plan/stateless-service-migration-review-40-native/sar/astra-sar-report-round-1.md) · [Author revisions](https://github.com/kburson/AIVC/blob/f92d678e576658fa0e89d2bb692d5f441f27ba16/docs/peer-reviews/plan/stateless-service-migration-review-40-native/sar/author-response-round-1.md). [Accepted round 4 — exact original report](https://github.com/kburson/AIVC/blob/e6347619fb245ba506bf455d57a0672cf663260b/docs/peer-reviews/plan/stateless-service-migration-review-40-native/sar/astra-sar-report-round-4.md) · [Complete four-round lineage and dispositions](https://github.com/kburson/AIVC/blob/codex/40-draft/docs/peer-reviews/plan/stateless-service-migration-review-40-native/README.md). Four rounds, three revisions; no required changes remain. Native single-reviewer acceptance, not sealed consensus.
- **Migration-plan-digest**: `sha256:bfe8787c8d9b0e1b93fbfd81c44633e0dc165f8d487c553f917cc1524c80de06`
- **Planning-PR**: [Draft PR #61 to trunk](https://github.com/kburson/AIVC/pull/61). Six proposed dependent work packages; historical SAR estimate 52 joint hours/XL, superseded by the current preliminary 64-hour XPR plan estimate above; decomposition required before coding.

Accepted revision — predecessor research plan from #39:

- **Plan-review-SAR/XPR**: [Plan review index](https://github.com/kburson/AIVC/blob/trunk/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/README.md)
- **Plan-review-XPR**: [Accepted round 2](https://github.com/kburson/AIVC/blob/trunk/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-reviewer-response-2.md) · [Final sealed manifest](https://github.com/kburson/AIVC/blob/trunk/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/xpr/2026-10-15-2026-10-15-39-voice-bff-performance-research-review-9ec8655d0231ccca123b9ad385d7fef8-review-manifest.md)
- **Accepted-plan**: [XPR-accepted research implementation plan](https://github.com/kburson/AIVC/blob/8109522128c13412f8333d0029d5382011a3feb3/docs/superpowers/plans/2026-10-15-39-voice-bff-performance-research.md)
- **Accepted-plan-commit**: `8109522128c13412f8333d0029d5382011a3feb3`
- **Accepted-plan-digest**: `sha256:4e9f4e00b671e461e0a66951246441bf29e2ed5a0939fd58bfd4be10f8a6b018`

Later amendments — **not covered by renewed SAR/XPR acceptance**:

- **Source-plan**: [Amended source research plan](https://github.com/kburson/AIVC/blob/f273bf88d0d3a7125c78e54479541794adf7c40e/docs/superpowers/plans/2026-10-15-39-voice-bff-performance-research.md) — `docs/superpowers/plans/2026-10-15-39-voice-bff-performance-research.md`
- **Source-plan-commit**: `f273bf88d0d3a7125c78e54479541794adf7c40e`
- **Source-plan-SHA-256**: `23bae15f1cde2d54d8c78994170739a46f05bb3405f259e5815204323d7f289b`
- **Source-plan-section**: Sections 1, 12–13; #40's original scope pointer is sections 1 and 13.
- **Amendment records**: [Owner-directed review dispositions](https://github.com/kburson/AIVC/blob/trunk/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/xpr/owner-amendment-2026-10-15.md) · [Three-container/stateless amendment lineage](https://github.com/kburson/AIVC/blob/trunk/docs/peer-reviews/plan/voice-bff-performance-research-review-37310796a92245e3930c81b664fee657/README.md#subsequent-three-containerstateless-clarification)
- **Planning-status**: #39 predecessor acceptance applies only to its exact accepted revisions/digests. Its later architecture/stateless/task-intent amendments remain without renewed whole-document acceptance. #40's migration spec and plan now have separate sealed XPR acceptance at the exact current pins above; historical SAR applies only to its original pins. Current accepted bytes remain unchanged since XPR finalization. Peer acceptance does not record owner Plan approval or integrated application acceptance.

### Backlog Hydration Plan

- **Planning-record**: [#39 — research specification and planning](https://github.com/kburson/AIVC/issues/39)
- **Preparation-handoff**: [Documentation delivery and backlog map](https://github.com/kburson/AIVC/blob/trunk/docs/superpowers/plans/2026-10-15-39-performance-documentation-delivery.md)
- **Hydration-status**: #40 is the separate application-migration prerequisite for research epic #41 and Task 0 #42. Refine/decompose #40 before coding.
- **Verification design**: Delivery must provide the offline stateless-services contract suite declared below; this is not an existing or executed test claim.
- **Execution / stop boundary**: #40 remains **Plan**. Registered runtime/MCP restoration and the Linux/macOS-only CI/receipt-gate prerequisite completed in 1h 6m 27s, including waits, within the original four-hour cap; Windows deferred/unverified. Both migration artifacts have genuine sealed XPR acceptance. [Current recovery evidence](https://github.com/kburson/AIVC/blob/codex/40-draft/docs/peer-reviews/40-coordinated-runtime-recovery.md) retains earlier failures, unknown predecessor and actual MCP delivery. Application implementation and paid execution remain stopped. No Plan approval, child hydration, state promotion, merge, Done or research unblocking is authorized by peer acceptance; retain normal decomposition, approval and delivery gates.
