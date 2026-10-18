# Native SAR — stateless service migration plan — round 4

## Decision

**accepted**

No required revisions remain in the reviewed plan. Round-three finding R3-1 is closed by the actual revised lifecycle schema, transition rules, acknowledgements and tests. This is acceptance of the implementation plan as a planning artifact, not evidence that its future implementation or tests have passed.

## Provenance and review boundary

- Issue: AIVC #40.
- Artifact: `docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md`, complete 543-line file.
- Independently computed artifact SHA256: `bfe8787c8d9b0e1b93fbfd81c44633e0dc165f8d487c553f917cc1524c80de06`.
- Author-supplied commit: `878cb5c16d5183a39980d39f5c7d54c27d8b2347`. Commit association was not independently checked with Git; Git commands are outside this reviewer's boundary.
- Accepted governing migration specification: `docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md`, independently reconfirmed SHA256 `fecb93bdc40e6f2636f04bb243d7f5cbf74cbb8041f8c16891f38db4c643d1d4`.
- Read `sar/author-response-round-3.md` in this review group. Earlier SAR reports and dispositions remain part of the same reviewer session's review history.
- Requested reviewer selection: `gpt-6-astra`, reasoning effort `high`; same native reviewer session retained across specification review and all four plan rounds. This records the requested session selection, not an independently provider-certified per-turn model attestation.
- Genuine reviewer-session fingerprint: SHA256 `5c36eec6e272d9b56b54155bfcd9373f488e131c0f0eecad3a3158aadff3f28c`, derived from the session's own runtime identity. Raw session handles are omitted.
- Review mode: native single-reviewer SAR. No sealed two-party consensus, SPR or XPR is claimed.
- Review activity: read-only artifact and source analysis, with the sole authorized report write. No Git commands, application edits, tests, builds, containers, provider calls or task-state transitions were performed.

## Scope and method

Reread the entire revised plan, not only the latest correction, and checked the author response against its actual text. Reassessed the task sequence and file map together with the later authoritative interface/harness decisions. Applied the accepted migration specification and the previously examined #39 governing specification sections 18–19 and implementation-plan sections 1, 12–13/Task 0. Used the actual route, runtime, deadline, admission, browser controller, speech queue, validation, retrieval, test configuration and launcher source inspected in this same continuing review to evaluate whether the proposed interfaces and test oracles address the existing implementation.

The earlier source analysis established why Response readiness cannot substitute for provider settlement, why audio can involve STT plus several model invocations, why production browser acceptance needs a trustworthy origin, and why valid multipart WAV bytes can exceed the PCM-only size estimate. Those constraints were included in this full-plan reassessment. No implementation validation is inferred from that source analysis.

## Required-finding dispositions

| Finding | Disposition | Reviewed resolution |
| --- | --- | --- |
| Round 1 R1: real operation settlement was inaccessible to route lifecycle accounting | Closed; remains closed | The revised route-settlement contract supplies an explicit `OperationHandle`, registration before asynchronous admission work, and separate response, provider-settlement and transport-cleanup responsibilities (plan lines 321–379). Real-route tests must show that an aborted/failed public response does not release the lease or lifecycle registration while underlying work remains unsettled. |
| Round 1 R2: production fixture and runner were not concretely executable | Closed through rounds 2–4 | The plan selects a private scripted-provider adapter and external fixture service, precise data/control boundaries, production images and manifests, separate Vitest/Playwright configurations, exact container commands, bounded runner lifecycle, and real host-mediated topology actions (lines 381–421, 435–543). The specific deficiencies subsequently found in that design are addressed below. |
| Round 1 R3: extraction checkpoint broke old routes/tests before migration | Closed; remains closed | Temporary single-source compatibility reexports preserve the intermediate checkpoint. The following task retargets actual fixtures/runtime ownership and removes those reexports; production connectivity proof follows packaging (lines 423–433 and task dependencies). |
| Round 2 R2-A: private HTTP browser origin could not exercise required secure-context APIs | Closed; remains closed | A declared TLS ingress, generated per-run CA/SAN, ordinary browser trust, exact Host/Origin and secure-context/API preflight support the real browser controller. No insecure-origin or API replacement fallback is permitted (lines 464–472). |
| Round 2 R2-B: one parent ID could not uniquely represent STT and multiple model invocations | Closed; remains closed | Parent operation IDs and fresh per-adapter-call invocation IDs are distinct; each invocation has its own stream/cancellation authority and ledger record. Parent settlement joins admitted children. Real STT, two/three-round tool continuations, later-round cancellation and duplicate-caller tests are required (lines 474–482). |
| Round 2 R2-C: private driver lacked an actionable host lifecycle channel | Closed | The bounded capability-authenticated request/acknowledgement channel, asynchronous host servicing, fixed command mappings and exact run/container validation make host-only Docker authority usable from the driver. Round-three's remaining scale-schema defect is now corrected (lines 484–526 and 543). |
| Round 2 R2-D: encoded fixture cap rejected otherwise valid WAV requests | Closed; remains closed | Raw WAV, canonical base64, metadata and whole-wire limits are separately derived, with a 3 MiB wire ceiling and accepted padded-WAV regression cases. The application multipart/RIFF contract remains authoritative (lines 528–539). |
| Round 3 R3-1: singular target/identity schema could not represent scaling | Closed | The discriminated union represents singular actions separately from `scale-core`, including explicit core-group target, desired count, exact nullable replica membership and expected peer IDs. Transition/acknowledgement/test rules specify the same semantics (lines 488–526 and 543). |

## Round-three finding verification

The updated schema can now encode both required scale directions without inventing an absent container ID or sending an undeclared target. `CoreMembership` requires core-a and allows core-b to be null only as the one-replica representation. A scale request supplies both keys, `desiredCount: 1 | 2`, target `core`, and expected web/lookup identities. Singular actions retain an exact present target/container identity and cannot act on absent core-b.

The host must compare supplied membership with its current run manifest before mutation, reject missing/extra/stale/foreign membership or peer mismatches, and retain its own template/image authority. For 1→2 it creates only core-b; for 2→1 it drains/removes only core-b. Core-a, web and lookup remain identical. A request for the existing count is a verified no-op. Acknowledgements and the updated manifest include complete before/after membership and peer identities, including null core-b after scale-down.

Duplicate matching requests return the original acknowledgement without repeating an action; conflicting duplicates refuse. Unknown partial outcomes fail the run without replay. The declared 30-second action bound and 40-second driver wait can accommodate the selected 15-second drain plus 5-second settlement lifecycle, subject to the remaining global run budget. Tests explicitly cover valid transitions, same-count no-op, absent targets, malformed membership, stale/foreign identities, mismatched peers and duplicate behavior, followed by actual container-identity observations. This resolves both the representational defect and the associated acceptance-oracle ambiguity.

## Holistic assessment

### Interfaces and sequencing

The contract extraction, orchestrator extraction, web delegation, production packaging, topology acceptance and integration sequence has concrete ownership and dependencies. The temporary compatibility seam keeps only one implementation source and has an explicit removal checkpoint. The file map and regression retargeting account for the fact that changing imports alone would leave the original tests injecting the wrong runtime. Browser Origin checks remain web-owned; direct-core checks validate bearer/Host independently. Contract digest migration and package build ordering are identified rather than left as incidental build breakage.

The custom Next server choice is explicit and consistent with packaging full production dependencies instead of assuming standalone output contains the custom lifecycle wrapper. The runner's direct production entrypoints and dedicated test configurations avoid recursively launching the migration wrapper or silently substituting development servers. The planned commands and test inventory establish a reviewable implementation target. The 52-hour/XL estimate and governed decomposition acknowledge the work's breadth; they are estimates, not execution evidence or permission to advance stages.

### Stateless protocol and trust boundaries

The plan preserves the accepted multipart/JSON request and SSE/PCM response contracts while moving provider ownership into core. Each request carries its own data and request-scoped runtime ownership. Caller IDs are correlation, not replay authority or cross-replica storage. Independent parent and provider-invocation IDs preserve multiple real adapter calls without introducing deduplication or a shared user session. Cancellation and lost receipts retain the specified unknown-outcome/no-replay behavior.

Core authenticates before body consumption, web enforces browser-origin protection and supplies its own server-held identity, and delegation uses fixed configured upstreams without automatic retries or redirect-following. The credential/readiness distinction prevents absent caller identity from being mistaken for provider availability. Fixture scripts, control tokens, ledgers and host lifecycle authority remain outside browser/application control. The production fixture profile does not add a public application control API or turn the fixture ledger into application state.

### Streaming, cancellation, admission and shutdown

The explicit separation among response availability, underlying operation settlement and transport cleanup addresses the current handlers' private settlement state. Registration before authentication/body waits brings early failures and stalled upload paths into lifecycle accounting. Admission remains held through actual operation settlement, and the planned real-route oracle prevents superficial tests from passing merely because a response rejected or a socket closed.

Backpressure and bounded queues apply across adapter, application, BFF and ingress hops. The plan includes original producer allocation measurement, so small subarray views cannot conceal arbitrarily large retained backing buffers. Abort/deadline propagation, paused consumers, partial bodies and shutdown tests must observe the actual operation and transport responsibilities. The BFF accounts for observed upstream cleanup without claiming knowledge of remote provider settlement. Graceful drain and forced termination preserve unknown outcomes rather than manufacture exactly-once or cross-replica cancellation guarantees.

### Acceptance feasibility and meaningful failures

The private fixture service can retain invocation observations when an application container dies. Its protocol represents STT, each model round and TTS separately while the application still performs the real tool loop and lookup requests. Named gates and explicit cancel acknowledgements separate provider cleanup from HTTP EOF. The real production browser topology supplies normally trusted HTTPS and required API preflight, with controlled voice fixtures rather than claims about paid services or physical microphone operation.

The host/driver control channel now has sufficient information to perform and prove interruption, replacement and scaling actions at the test's actual milestone. Acknowledged termination is distinct from provider settlement; the surviving ledger supplies the latter observation. Image/source identities, resource limits and unchanged peer containers make independent scaling assertions meaningful. Missing dependencies, failed actions, expired deadlines, unknown outcomes and unexpected test inventory are failures with bounded cleanup, not skip/fallback paths. The WAV bounds include valid ancillary chunks while preserving existing application validation. These are feasible, concrete acceptance requirements; their actual success remains to be demonstrated during authorized implementation.

## Required revisions

None.

## Optional suggestions

None added in this round. The previously accepted specification suggestions and earlier SAR findings are concretely addressed; further speculative scope would not improve this acceptance decision.

## Acceptance limits and handoff

Acceptance applies only to the plan bytes identified above, interpreted with its explicit later corrections governing predecessor text. Any material subsequent change requires appropriate review. The accepted specification digest remains unchanged.

This report does not authorize implementation, satisfy sealed XPR, unblock governing #39/Task 0 dependencies, record Plan approval, or replace registered task-state and delivery gates. Preserve the owner's selected pause for registered runtime/MCP recovery before sealed XPR. No test, build, provider or production-runtime success is claimed. This genuine reviewer session remains available for further review if needed.
