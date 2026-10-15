# Voice BFF Performance Research Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This draft authorizes neither implementation nor experiment execution; preserve the owner's selected execution method and applicable AITM approvals.

**Goal:** Build a reproducible, predominantly mock-only experiment system that measures the voice BFF's local operating envelope and produces an evidence-backed performance and cost report.

**Architecture:** Headless k6 conversations enter the real Next.js Node BFF, call the real Fastify retrieval peer when selected, and use separately provisioned network provider simulators. Local stage telemetry, client observations, cgroup metrics and immutable manifests support service attribution, resource/process comparisons and cost projections. The real provider APIs receive only separately authorized bounded calibration samples.

**Tech Stack:** The integrated application's exact Node/npm/dependency pins; Node-native `.mjs` research utilities and `node:test`; existing TypeScript/Vitest for application changes; Docker/Compose or equivalent verified cgroups; a pinned k6 build whose POST/multipart SSE and concurrent speech behavior passes Task 5. Node >=26 is the governing floor; the existing amendment selects Node 26.8.1/npm 12.0.2. Reverify these against the selected integrated revision; no runtime upgrade is part of this plan.

**Spec:** [Story 39 amended design](../specs/2026-10-14-39-voice-bff-performance-research-design.md), source commit `e293c3aa5dd015a3737f7453b44d336f5752b046`, SHA-256 `76c5bc37359cecc3b2dda0cd32fd409771d36c7d639876021b2e3a6c2eebc38d`. Read the whole spec; sections 16 and 17 govern qualifications and amendment lineage.

**Issue:** [#39](https://github.com/kburson/AIVC/issues/39). Date: October 15, 2026 (America/Chicago). Draft plan for owner review; no new plan SAR/XPR is claimed. The earlier SAR/XPR accepted the identified predecessor spec, not this plan or its later owner-directed amendment.

## Global Constraints

- Primary entry is the actual Next.js BFF; Fastify isolation cannot be labeled voice-session capacity.
- Use production builds and pinned toolchains/images. Do not benchmark Next.js development compilation, HMR, debug builds, or an unreported profiler as steady production overhead.
- All primary cells run one application process per target container.
- Primary grid: 1, 2, 3, 4 CPU quotas crossed with 2, 4, 8, 12 GiB. Executive pairs: 1/2, 2/4, 3/8, 4/12 CPU/GiB.
- Keep heap policy fixed for the primary comparison; report changes caused by Node's detected container limit.
- Proposed paid calibration ceiling: USD 10 aggregate; at most 30 billable requests per provider initially; five repetitions per selected cell. Continuations, warmups, cancellations and retries count against both limits. No automatic paid retries or hosted search.
- Mock-only execution is the default; no paid credentials, fail-closed external egress, independently budgeted generators/simulators/collectors.
- Limit timing headers to 2 KiB and fixed metric names. No prompts, transcripts, secrets, URLs, provider account IDs, or raw untrusted descriptions enter headers.
- No future stream duration in headers; no appended diagnostic bytes in PCM; no cross-process monotonic subtraction; no subtraction or summation of independent percentiles.
- Ordinary M1: per-turn seeded 40% B1, 30% B2, 30% B3; all output-enabled. Four intended turns/minute; 180-second session residence plus bounded drain; no hidden catch-up, overlap or skipped offers.
- Feasibility ceilings at two/four/eight turns/minute: 19.2/9.6/4.8 seconds. If realistic replay fails at four, Tier 1 must run its unchanged two-turn pacing substitute at all four pairs. If two also fails, only the predeclared one-turn substitute below may follow separate owner agreement; retain all infeasibility.
- A voice turn's delivery observation window stays open after answer SSE completion until required segments and pending speech settle or a 120-second absolute turn-observation deadline is reached.
- Drain ordinary work for up to 120 seconds, then cancel and observe settlement for up to 30 seconds; unresolved work is cleanup failure.
- Primary research admission is finite, frozen and nonbinding at accepted points. Default-admission controls retain two turn and two speech slots per process. Payload/deadline/cancellation protections remain in force.
- At least 99.9% correct completed ordinary turns among all expected offered work is an empirical screen, not a production reliability guarantee.
- Baseline p95 regression budgets: first answer +100 ms, speech-request first server audio +150 ms, matching completion +250 ms. Event-loop delay p99 <=20 ms gates every confirmed low-lag point/candidate. Candidate memory <85% of limit.
- p95 decisions require >=200 applicable observations per baseline stratum and per candidate repeat; extend at most 60 minutes/run, otherwise inconclusive. Exploratory p99 requires >=1,000 applicable observations across repeats and remains qualified.
- All three confirmation repeats must pass separately; candidate is floor(75% of highest confirmed pass), with the spec's one-session/no-headroom exception and a 30-minute mock-only soak.
- Before each plateau validate generator/simulator capacity at 1.5 times its request, connection, byte and scheduled-output demand; unvalidated points are censored.
- Search disabled, stable tool definitions, actual Origin/Host protections, no wildcard or forwarded-header trust.
- No actual Twilio gateway, production deployment, new Kubernetes cluster, browser rendering, acoustic measurement, self-hosted inference or multi-agent-per-turn fanout is implemented here. Telephony and cloud transfers remain projections.

## Review Focus

1. SSE completes while required second-segment speech is still pending: ordinary voice success must wait for all audio, not count text success (Tasks 5–6, delayed-second-segment regression).
2. Replay fits a fast average but one declared tuple exceeds the schedule: load-one maximum must trigger the unchanged two-turn fallback or explicit incompleteness (Tasks 6–7, 10-second and 20-second occupancy regressions).
3. A provider request times out but cancellation has not settled: retain lease ownership and cost reservation, with zero paid replay (Tasks 2 and 4, deferred-settlement regressions).
4. Generator/simulator or telemetry collection saturates before the target: mark invalid/censored, stop unsafe growth and withhold a target capacity claim (Tasks 3, 7–8, deliberately lagged simulator/collector regressions).
5. A later partial run or pricing change is merged with older results: bind manifests by source/profile/topology/digest and retain unknown prices, failed repeats and missing cells (Tasks 1, 8–9, tampered-manifest/mixed-price regressions).

---

## 1. Baseline, ownership and execution boundary

This plan is one integrated research workstream because session scheduling, streaming observation and outcome/cost accounting share contracts. Independently reviewable tasks below can become delivery stories through the governed approved-plan workflow; no extra stories or issue-state changes are created by writing this document. Story #39 is currently docs-only. Do not treat it as permission to modify application code or bypass its state gates; approved execution must use correctly scoped, bound delivery issues.

Authoring checked `trunk` at `e293c3a`: its tracked application workspace, tests and runtime configs are absent, and root `npm test` is intentionally failing bootstrap text. Untracked `apps/` contains generated assets/build information; preserve it and do not stage it. Read-only inspection of `codex/2-draft` at `fe2a158c8f717aed43d604c3d7614dc18a3452e1` established concrete candidate integration paths, not accepted/merged application authority:

- `apps/web/server/runtime.ts` chooses in-process `MockAdapter`/mock speech or real Claude/Deepgram, with actual retrieval HTTP in either mode.
- `ModelAdapter.runRound(input, signal): AsyncIterable<ModelEvent>`; `SpeechAdapter.transcribe(wav, signal)` and `synthesize(input, signal)` are the adapter seams.
- `apps/web/server/turns/leases.ts` hardcodes two slots per kind; it needs an explicit mock research option before a hardware curve is meaningful.
- `apps/web/app/api/turn/route.ts` wraps `turnResponse`; Fastify `createRetrievalApp()` registers `/v1/projects` and `/health`.
- `apps/web/client/voice/speech-queue.ts` and `speech-text.ts` implement actual speech scheduling/segmentation. Headless tests must conform to those policies, not invent an easier output stream.

Task 0 rechecks all paths and APIs against the accepted integrated application. If they differ, record an exact path/signature map in `research/performance/baseline.json` and update this plan before downstream coding. If the implementation is unavailable, Task 0 can deliver only the blocker inventory; do not implement a stand-in reference application. No merge, checkout, reset, runtime install, package upgrade or mutation of another worktree is implied by inspection.

## 2. File structure and interfaces

All paths below are repository-relative. Paths marked application are conditional on Task 0 matching the integrated revision. Research `.mjs` modules use explicit imports and Node's built-in test runner; portable k6 modules use `.js` without Node builtins. Keep a small exported API per module. Do not introduce a database, dashboard service, root workspace or plotting dependency merely to hold results.

| Boundary | New or modified paths | Responsibility |
| --- | --- | --- |
| Baseline and manifest | `tools/performance/{baseline,records,verify}.mjs`; `research/performance/{baseline.json,schema/records.schema.json}` | Source/toolchain/path authority, schema, hashes and read-only verification |
| Timing (application) | `apps/web/server/observability/{timing,metrics}.ts`; `apps/retrieval/src/http/timing.ts`; route/error/SSE/provider/retrieval integration points | Early headers, streaming spans, process samples, bounded export |
| Research configuration (application) | `apps/web/server/{config,runtime}.ts`; `apps/web/server/turns/leases.ts`; `apps/retrieval/src/index.ts` | Default-preserving mock-only network adapters/admission/bind configuration |
| Network mocks | `tools/performance/simulators/{server,profiles,model,speech}.mjs`; `research/performance/fixtures/{turns,replay,hypothetical}.json` | Versioned protocol fixtures and observed simulator scheduling |
| Calibration | `tools/performance/calibration/{ledger,run}.mjs`; `research/performance/calibration/{casebook,rate-card}.json` | Separate paid command, durable reservations and sanitized observations |
| Streaming proof | `tools/performance/clients/{probe,observer}.mjs`; `tools/performance/k6/{compat,transport}.js`; `research/performance/client-lock.json` | Actual k6 protocol support and separately validated audio observer |
| Conversation model | `tools/performance/shared/{schedule,oracle,playback}.js`; `tools/performance/k6/{f1,b1-b5,m1,open}.js` | Per-session pacing, generation/history/speech state, all-work outcomes |
| Campaign | `tools/performance/campaign/{matrix,controller,estimate,runner,topology}.mjs`; `tools/performance/containers/{compose.yaml,Dockerfile,balancer.cfg}`; `research/performance/campaign.json` | Enforced isolation, discovery/confirmation/soak/cleanup and finite budgets |
| Analysis | `tools/performance/analysis/{screen,curves,cost,report}.mjs` | Reconcile counts, classify evidence, cost scenarios, SVG/CSV/HTML output |
| Operator entry | `tools/performance/cli.mjs`; `docs/research/performance/{README,report-template}.md` | Explicit commands/modes and decision report |
| Tests | `tests/performance/*.test.mjs`; application timing/config tests in `tests/contracts/` and `tests/integration/` | Deterministic controls and genuine network/streaming integration |
| Generated evidence | `research/performance/runs/<run-id>/`, `research/performance/analysis/` | Immutable manifests, index, summaries and raw artifact references |

Use these shared record shapes, refined only additively under schema versioning. JS functions below accept plain objects matching these TypeScript-style declarations; JSON schema and runtime validation are authoritative:

```ts
type Evidence = 'screened'|'confirmed'|'inconclusive'|'failed'|'invalid'|
  'censored'|'unavailable'|'infeasible-by-workload/profile'|'reduced-by-rule';
type Outcome = 'success'|'failed'|'rejected'|'dropped'|'unfinished'|'planned-cancel';
type TurnRecord = {
  schema: 'aivc.perf.turn/v1'; runId: string; sessionId: string; turnId: string;
  generation: number; type: 'B1'|'B2'|'B3'|'B4'|'B5'; profile: string;
  offeredAtMs: number; startedAtMs: number|null; outcome: Outcome;
  textOutcome: Outcome; voiceOutcome: Outcome; cancellationOutcome: Outcome|null;
  timingsMs: Record<string, number|null>; requiredSegments: number;
  deliveredSegments: number; usage: Record<string, number>;
};
type RunManifest = {
  schema: 'aivc.perf.run/v1'; runId: string; mode: 'mock'|'calibration';
  source: { head: string; sourceDigest: string; dirtyDigest: string|null };
  inputs: Record<string,string>; // scenario/profile/fixture/tool/image hashes
  config: Record<string,unknown>; // allocations, seeds, admission, clocks, thresholds
  infrastructure: Record<string,unknown>; // headroom controls, host inventory, telemetry
  intervals: Record<string,unknown>; stopReason: string|null;
  evidence: Evidence; artifacts: { path:string; sha256:string }[];
};
```

Numeric counter zero is not missing evidence. Unavailable metrics use null plus a bounded reason; runtime schema must require that reason in the metric detail record. IDs appear in records, never metric labels. Artifact paths must stay under the declared output root; hash external immutable objects and retain storage/retention metadata.

## 3. Sequence, effort and budget model

Execution order: 0 → 1 → 2 → 3; Task 4 follows 1 and 3; Task 5 follows 2 and 3; Task 6 follows 5; Task 7 follows 1–6; Task 8 follows 7's synthetic evidence fixtures; Task 9 follows 8; Task 10 executes the accepted campaign only after all gates. Application manifest/config changes have one serial owner. Parallel execution, if later selected, must respect these dependencies and distinct file ownership.

| Task | Engineering estimate | Principal uncertainty |
| --- | --- | --- |
| 0 Baseline and prerequisites | 2–4 h | Accepted integrated application availability |
| 1 Evidence contracts | 3–5 h | Existing source-digest conventions |
| 2 Application instrumentation/admission | 8–14 h | Framework error/stream completion ownership |
| 3 Network simulators | 6–10 h | Actual provider protocol/SDK redirect support |
| 4 Paid calibration and ledger | 4–7 h | Usage/rate visibility and continuation accounting |
| 5 k6 streaming compatibility | 4–8 h | POST/multipart support and concurrent speech |
| 6 Headless workload/oracle | 8–14 h | Conformance to actual segment/playback behavior |
| 7 Resource and campaign runner | 8–14 h | Host entitlements, finite controller and cleanup |
| 8 Validity and capacity analysis | 5–8 h | Sparse strata and attribution |
| 9 Cost model/report | 5–8 h | Purchasable SKU/contract inputs |
| 10 Campaign operations/interpretation | 4–8 h active effort | Measured boundaries and repeat length |
| **Total** | **57–100 h active effort** | Excludes blocked integration time and unattended experiment runtime |

These are planning estimates, not executed measurements or delivery promises. A new k6 extension or alternate streaming implementation is outside the 4–8-hour compatibility gate: if no available pinned build passes, record a blocked prerequisite and propose a separately estimated client change before capacity work.

### Finite campaign estimate

Use sequential target experiments initially. A target-environment hour means one topology under test for one hour; report application-container CPU-hours/GiB-hours and helper-host hours separately. It is not one CPU-hour. The following bracket policy bounds discovery without assuming a demand target:

- Up to eight doubling plateaus (sessions 1 through 128 for M1), then up to four intermediate refinements. Reaching the ceiling without failure gives a censored/lower-bound result; a larger search requires an explicit revised campaign budget.
- Each M1 plateau budgets a 180-second ramp, >=120-second steady window, up to 120-second drain and 30-second cancellation settlement. Twelve plateaus cost up to 1.5 hours plus warmup/control overhead; use **0.5–1.6 hours per discovery series** for budgeting. This range is not a guaranteed execution bound; independent headroom proofs are counted separately below.
- F1 uses route-matched arrival rates, a 60-second warmup and >=120-second observation per point; budget **0.3–1.1 hours per series** with up to twelve points. Choose the initial F1 rate from a recorded pilot and freeze it.
- Confirmation allowance per series: baseline/last-pass/boundary/first-fail three times, plus three independent 75% candidate checks and one 30-minute soak. At minimum five minutes/window and up to 60 minutes of steady sampling plus ramp/drain, budget **2–17 hours per confirmed series**. Reuse a baseline only with identical profile/stratum/config and proven noncontention, recording its ID; failed or sparse repeats cannot be repaired by reuse.

| Experiment family | Initial count before infeasibility/reduction | Target-environment hours |
| --- | --- | --- |
| F1 grid discovery | 16 | 4.8–17.6 |
| BFF-constrained M1 discovery, minimum-wait + replay | 32 | 16–51.2 |
| Fastify-constrained M1 discovery, same profiles | 32 | 16–51.2 |
| Default-admission M1 discovery at four pairs | 8 | 4–12.8 |
| Worker/instance discovery, four deployments × two profiles | 8 | 4–12.8 |
| Paired and scaling M1 confirmation packages | Up to 34: 8 BFF + 8 Fastify + 8 default + 8 scaling + 2 matched worker baselines | 68–578 |
| Headroom/topology/feasibility, F1 confirmation controls, B1–B5/pacing/fault/recovery and instrumentation subsets | Declared controls, not hidden overhead | 15–60 |
| **Initial campaign envelope** | Conditional, before extra slower profiles or reruns | **127.8–783.6 target-environment hours** |

Actual discovery failures, statistical insufficiency, validated Fastify reductions and unavailable workers can reduce completed work; extra profiles or infrastructure retesting can increase it. Do not count reduced/unavailable cells as measured. A two-turn replay replaces the infeasible four-turn replay's confirmation package in the budget, while retaining its failed feasibility control; it is not pooled into the four-turn result. Section 16.9's Fastify reduction applies only with all its measured prerequisites; no resource matrix is silently dropped to meet this estimate.

**Proposed execution checkpoints, requiring owner agreement before running:** first authorize at most 12 target-environment hours for the pilot and initial Tier 1 evidence; then return the coverage ledger, actual rate of progress and revised remaining estimate. Proposed cumulative campaign ceiling is 160 target-environment hours, with a partial report at exhaustion. That ceiling may be insufficient for complete research, especially sparse low-load confirmations; it is a stop policy, not a reduced definition of completion. No timer or hosting budget auto-renews. Owner agreement to this plan's content alone is not an actual cloud purchase or permission to exceed the paid calibration ceiling.

For baseline procurement, evaluate a target host capable of honoring 4 dedicated CPU/12-GiB target plus OS headroom, with a separately provisioned helper host for peers/generator/simulators/collector. Record actual CPU architecture, quota/cpuset/SMT, VM overcommit and network. A local shared-host pilot is allowed only as a labeled contention-controlled preliminary result. Publication requires demonstrated isolation/headroom, not a guessed host size.

Let measured deployment prices per hour be `p_target` and `p_helpers`, including containing SKUs/spares; then sequential hosting cost is `targetHours*p_target + helperHostHours*p_helpers + network/storage/telemetry + paidCalibration`. Reserve helperHostHours from actual topology lifetimes, not the number of parallel experiments. No SKU, external quota uplift or dollar hosting total is invented before inventory and current primary-source rate verification. Task 0 produces the dated rate card and concrete machine-hour/host-hour quote before any rented execution; if unpriced, stop procurement and keep local simulation development available.

### Predeclared slower fallback

If unchanged realistic replay fails the two-turn feasibility gate, the sole proposed additional substitute is **one turn/minute**, same 180-second residence, phase [0,60), jitter ±6 seconds, minimum gap 48 seconds and maximum occupancy 38.4 seconds (20% gap margin). Require separate owner agreement before executing this series, including revised sample/runtime budget. If it fails too, stop the pacing fallback, retain its evidence and mark realistic-wait Tier 1/VP question 4 incomplete. Do not retry at ever-slower pacing, shorten answers or add paid calibration to find a pass. A hypothetical profile is always identified as such and cannot fill the empirical-calibration gap.

## 4. Implementation tasks

### Task 0: Verify the real baseline and quote the execution environment

**Files:** Create `tools/performance/baseline.mjs`, `research/performance/baseline.json`, `tests/performance/baseline.test.mjs`; update this plan only with an exact verified path/API reconciliation if necessary.

**Interfaces:** `verifyBaseline({root, expectedHead, requiredPaths, exec}): Promise<{head, sourceDigest, toolchain, routes, interfaces, blockers}>`. `exec(file,args)` uses argument arrays; never interpolate fixture/model text into a shell command. Produces the baseline record consumed by every manifest/runner. It does not fetch, install, build, launch providers or modify Git state.

- [ ] Write failing tests for missing tracked routes, unrecorded dirty source, runtime mismatch, rejected out-of-root paths and documentation-only descendants. A generated untracked asset cannot satisfy a required source file:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyBaseline } from '../../tools/performance/baseline.mjs';
test('an untracked route cannot satisfy the baseline', async () => {
  const exec = async (file, args) => {
    if (file === 'git' && args[0] === 'ls-files') return '';
    throw new Error('unexpected command');
  };
  await assert.rejects(verifyBaseline({root: process.cwd(), expectedHead: 'a'.repeat(40),
    requiredPaths: ['apps/web/app/api/turn/route.ts'], exec}), /missing tracked source/);
});
```

- [ ] Run `node --test tests/performance/baseline.test.mjs`; expect failure before the module exists. Implement a read-only verifier using `execFile`, tracked-file byte hashing, `.nvmrc`/package lock/image checks and explicit route/interface inventory. Never label a docs-only digest as application validation.
- [ ] At the authorized integrated application revision inspect all Task 2/3/6 paths, model/tool/speech contracts, config and production startup. Record exact revisions plus outstanding application story prerequisites. If absent, return the blocker inventory and stop downstream application coding.
- [ ] Inspect actual host/cgroup/network resources; record a dated containing-SKU rate card in baseline.json.hostQuote and quote target/container/helper hours using section 3. Request the necessary execution budget only after the quote is concrete. Do not start a paid run here.
- [ ] Rerun the baseline test and the accepted application's existing toolchain/contract checks at that revision. Expected outcome: actual recorded evidence, or an explicit prerequisite blocker; no generic bootstrap `npm test` pass claim. Commit only these owned files with `[#<delivery issue>] Verify performance experiment baseline`.

### Task 1: Establish immutable records and read-only evidence verification

**Files:** Create `tools/performance/{records,verify}.mjs`, `research/performance/schema/records.schema.json`, `tests/performance/records.test.mjs`, `tools/performance/cli.mjs` with only `verify` wired initially.

**Interfaces:** `validateManifest(value): RunManifest` throws on incomplete/unknown-version records; `writeRun(root, manifest, artifacts): Promise<string>` creates a new directory exclusively and hashes every artifact; `verifyRun(path): Promise<{valid:boolean,reasons:string[]}>` never creates evidence or runs APIs. CLI proposed: `node tools/performance/cli.mjs verify <run-dir>`.

- [ ] Write tests rejecting duplicate IDs, a reused run directory, missing dirty/input/image digests, a traversal artifact path, edited raw bytes and a missing metric reason. Test that later source changes cannot relabel an old run current:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateManifest } from '../../tools/performance/records.mjs';
test('partial evidence is not a complete manifest', () => {
  assert.throws(() => validateManifest({schema:'aivc.perf.run/v1',runId:'r1',mode:'mock'}),
    /source|inputs|config/);
});
```

- [ ] Run `node --test tests/performance/records.test.mjs`; expect red. Implement schema validation with explicit required keys, finite nonnegative counters/times and enumerated evidence states; use `mkdir`/exclusive file creation, canonical serialization and SHA-256. Reject evidence promotion by editing a summary without matching raw records.
- [ ] Add verifier behavior for missing inaccessible remote raw objects: return unavailable/invalid with reason, never pass solely on a URL. Preserve hash, retention and access instructions for intentionally external large raw artifacts.
- [ ] Run the records tests and `node tools/performance/cli.mjs verify research/performance/runs/does-not-exist`; expect tests pass and verifier nonzero with a missing-run reason. Commit only Task 1 files; the failing negative verifier is intentional evidence of refusal.

### Task 2: Instrument local APIs and expose bounded research configuration

**Files:** Create application timing/metrics modules from section 2; modify the verified routes for turn, speech, capabilities, errors, `sse-response.ts`, `run-turn.ts`, provider/tool boundaries, Fastify app/index and config/runtime/leases. Create `tests/contracts/performance-timing.test.ts`, `tests/contracts/research-config.test.ts`, `tests/integration/performance-streams.test.ts` and `tests/performance/collector.test.mjs`; create `tools/performance/collector.mjs`.

**Interfaces:** `beginTiming({requestId,service,now,exporter}): TimingContext`; `TimingContext.span(name): {end(outcome, counters?):void}`; `TimingContext.headers(): Headers`; `TimingContext.finish(outcome):void` is idempotent and follows actual settlement. Exporter `emit(record):boolean` is bounded, reporting dropped/backpressured counts. Research configuration: `mode:'mock'`, `networkMockBaseUrl`, `admissionMode:'default'|'research'`, positive integer `turnLimit/speechLimit`; live mode rejects any research-only setting. `LeasePools({turn:2,speech:2})` keeps shipped defaults.

- [ ] Write failing Vitest cases for 200/400/403/429/502 headers, the 2-KiB bound, fixed names, no sensitive descriptions, early SSE/PCM flush, post-header completion records, stable correlation IDs and child-wait overlap. Include the key future-duration rule:

```ts
it('does not claim a future stream duration in a header', () => {
  let ms = 0;
  const records: unknown[] = [];
  const ctx = beginTiming({requestId:'r', service:'bff', now:()=>ms,
    exporter:{emit:(record:unknown)=>{ records.push(record); return true; }}});
  const model = ctx.span('bff.model');
  const early = ctx.headers();
  expect(early.get('Server-Timing')).not.toContain('bff.model');
  ms = 250; model.end('success'); ctx.finish('success');
  expect(records.length).toBeGreaterThan(0);
  expect(early.get('Server-Timing')).not.toContain('250');
});
```

- [ ] Run `npx --no-install vitest run tests/contracts/performance-timing.test.ts tests/contracts/research-config.test.ts`; expect red. Implement monotonic timing around real lifecycle boundaries. Begin before admission/body parsing; catch normal errors with context. Wrap stream production/abort settlement without buffering bodies, delaying headers, adding PCM bytes or releasing provider leases early.
- [ ] Add finite positive research limits only under explicit mock configuration, defaulting to 2/2 and rejecting invalid/live combinations. Test timeout before deferred upstream settlement still holds the slot, and idempotent release decrements once. Separate active/settling counters from HTTP response completion.
- [ ] Implement `perf_hooks` loop-delay/ELU/GC/CPU/memory sampling with recorded resolution/reset windows; bounded asynchronous collector batches to external storage. Application stop flushes with a deadline and records incomplete export; collector saturation invalidates attribution. Do not use unique IDs as metric labels.
- [ ] Run the new Vitest suites plus `node --test tests/performance/collector.test.mjs` and existing admission/deadline/streaming tests resolved by Task 0. Compare instrumentation on/off in later Task 10; unit tests do not establish zero overhead. Commit the exact instrumentation/config/test paths.

### Task 3: Build seeded network provider simulators and isolate paid egress

**Files:** Create simulator modules/fixtures from section 2, `apps/web/server/providers/network-mock.ts`, `tests/performance/simulators.test.mjs`, `tests/contracts/network-mock.test.ts`; modify runtime/config to select the narrow network mock only in explicit mock research mode.

**Interfaces:** `startSimulators({profile,seed,clock,bind}): Promise<{url,close,events}>`; `selectTuple(profile,seed,caseId)` preserves observed tuple relationships. `NetworkMockModelAdapter implements ModelAdapter` and `createNetworkMockSpeechAdapter(): SpeechAdapter` use real HTTP and actual abort signals. Prefer redirecting actual SDKs when verified supported; otherwise this narrow adapter's omitted SDK parsing/setup behavior is explicitly recorded. There is no in-process shortcut in published capacity runs.

- [ ] Write network tests for first-output before completion, split UTF-8/SSE frames, tool IDs/continuation blocks, malformed data, 429/5xx, cancellation, slow consumers, audio burst versus virtual playback and disconnect settlement. Include simulator lag evidence:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectTuple } from '../../tools/performance/simulators/profiles.mjs';
test('replay keeps first output, completion and bytes from one tuple', () => {
  const tuples=[{id:'a',firstMs:20,endMs:40,bytes:100},
    {id:'b',firstMs:80,endMs:300,bytes:900}];
  const tuple=selectTuple({tuples}, 7, 'short');
  assert.ok(tuples.some(t=>JSON.stringify(t)===JSON.stringify(tuple)));
});
```

- [ ] Run `node --test tests/performance/simulators.test.mjs`; expect red. Implement bounded HTTP fixtures using native `http`, scripted model/tool messages, submitted WAV metadata and deterministic valid PCM bytes. Record intended dispatch/chunk times and actual times independently of target traces. Never synthesize real speech or use a model to prepare load responses.
- [ ] Implement minimum-wait, empirical tuple replay, clearly hypothetical sensitivity and fault/quota profiles. Include finite active-request and token/audio quota models; expose actual simulator queue/scheduling lag and byte counters. Validate fixture output lengths against the real speech caps.
- [ ] Run actual BFF-to-network-mock-to-real-Fastify integration in mock mode. Prove no dummy retrieval data shortcut, exact cancellation signal propagation and correct usage semantics. Run `npx --no-install vitest run tests/contracts/network-mock.test.ts` and simulator tests.
- [ ] Create a mock container network with explicit local allowlists, no paid credentials and no usable external route. From the actual application namespace attempt a paid-host connection and confirm denial, including SDK fallback/metadata routes; verify intended internal routes work. A test-only hostname interceptor alone does not establish egress isolation. Retain namespace/routing/firewall evidence, not secrets. Commit owned simulator, adapter, config and fixture files.

### Task 4: Add the separate bounded live calibration mode

**Files:** Create calibration ledger/runner/casebook/rate card from section 2, `tests/performance/calibration.test.mjs`; extend CLI with `calibrate --casebook <file> --budget <agreed-budget-file>`.

**Interfaces:** `reserve({provider,requestId,maxCostUsd,requestUnits},ledger): Promise<reservation>` uses exclusive durable locking; `settle(reservation,usageOrUnknown): Promise<void>` retains uncertainty. `runCalibration(casebook,{budget,adapters,now}): Promise<observations>` never shares a mock-run credential environment. Rate rows include provider/model/region, URL/effective date, unit/minimum/cache/reasoning/tool rules and known limits.

- [ ] Write ledger tests for parallel requests racing the last budget, aggregate ceiling shared across providers, 30-request cap, charged continuation/warmup/cancellation, ambiguous completion after crash, missing price/max units and disabled retries:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateReservation } from '../../tools/performance/calibration/ledger.mjs';
test('unknown billing cannot become a zero-cost reservation', () => {
  assert.throws(()=>estimateReservation({provider:'tts',maxCharacters:120,rate:null}),
    /unpriced/);
});
```

- [ ] Run `node --test tests/performance/calibration.test.mjs`; expect red. Implement `estimateReservation(request)` plus reserve/settle, durable write-before-call reservations and no refund for uncertain outcomes. The runner stops at either cap, counts every continuation and never retries automatically. An advisory provider invoice estimate is labeled as such.
- [ ] Create bounded casebook entries: short model answer, one real lookup continuation, longer bounded context; STT 2/5/15-second fixtures; TTS 40/120/300 characters. Use five repeats only for selected funded cells; do not assume all cells × concurrency × cold/reuse fit 30 requests/provider. Initial concurrency one; optional concurrency three only from the same remaining budget.
- [ ] With fake provider clients prove headers/usage/first-output/completion/bytes, cold/reused connections, redaction and raw sample counts are retained; generate a provisional replay profile preserving complete tuples. Actual paid sampling remains Task 10 after explicit budget authorization; omit unsupported/unknown-cost cells.
- [ ] Re-run ledger/runner tests, interrupt/restart a fake calibration run and verify unresolved reservation persistence. Commit only sanitized casebook/rate-input schema, code and tests; never commit API keys or private audio.

### Task 5: Prove k6 can observe the real streaming conversation

**Files:** Create client and k6 compatibility modules/client-lock from section 2, `tests/performance/stream-observer.test.mjs`; add bounded compatibility protocol fixture under `tools/performance/clients/fixture.mjs`. Modify no public application transport to accommodate a client limitation.

**Interfaces:** `observeConversation({turnRequest,onDelta,requestSpeech,signal,now}): Promise<Observation>` owns one monotonic clock across turn and speech requests. `runCompatibilityFixture(options)` returns `{secondDeltaAtMs,firstSpeechEndAtMs,firstDeltaAtMs,turnEndAtMs}` on one fixture-client clock. The k6 transport must provide the same observable behavior through its pinned extension/build; `requestSpeech` returns a stream and can run while answer events continue. Client lock records k6 version, extension source commit, build recipe/image digest and proven/unavailable metrics, not just a binary name.

- [ ] Write failing Node observer tests for POST JSON and multipart SSE, first semantic delta before EOF, split event/UTF-8 parsing, ignored keepalives, prompt abort and malformed/odd PCM chunks. Include parallel progress:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runCompatibilityFixture } from '../../tools/performance/clients/probe.mjs';
test('speech work does not stop answer event consumption', async () => {
  const r=await runCompatibilityFixture({speechDelayMs:100,secondDeltaDelayMs:20});
  assert.ok(r.secondDeltaAtMs < r.firstSpeechEndAtMs);
  assert.ok(r.firstDeltaAtMs < r.turnEndAtMs);
});
```

- [ ] Run `node --test tests/performance/stream-observer.test.mjs`; expect red. Implement observer with `fetch` readers/TextDecoder streaming, strict event contracts and PCM format checks. Require at least one valid complete PCM sample for first-audio timing. Store unavailable separately if the eventual k6 client cannot observe incremental PCM.
- [ ] Investigate the spec's candidate `phymbert/xk6-sse` against the accepted k6 release and exact POST/multipart contract using its primary source and a small pinned build. Run the same fixture through k6; prove first-event observation, headers, abort, concurrent speech/continued answer and sustained stream cleanup. Standard buffered HTTP cannot stand in for this proof.
- [ ] Record the exact successful build in `client-lock.json`, or record a blocked client prerequisite and a separately estimated remedy. Do not silently switch to GET/WebSocket, use a Node load generator as if it were k6, or label server first-write as client first audio. A separately validated Node observer can supply audio-first-byte measurements only within its declared sampled scope; it cannot manufacture missing k6 conversation behavior.
- [ ] After lock/proof exists run proposed `k6 run tools/performance/k6/compat.js` in mock isolation and retain the fixture report. Rerun Node tests; commit only client/proof/build-lock files. Capacity scenarios remain blocked if the core incremental/concurrent client fails.

### Task 6: Implement paced sessions, speech scheduling and complete outcomes

**Files:** Create portable schedule/oracle/playback modules, k6 scenario modules from section 2, `tests/performance/{schedule,oracle,playback}.test.mjs`; add declared expected segment/text/tool outcomes to `research/performance/fixtures/turns.json`. Reuse or build-test against the actual `SpeechText`/PCM policies verified by Task 0; do not import browser audio globals into k6.

**Interfaces:** `makeSchedule({seed,startMs,residenceMs,turnsPerMinute}): {turnIndex,intendedAtMs,type}[]`; `checkFeasibility({maxOccupancyMs,turnsPerMinute,busyMisses}): {feasible,ceilingMs}`; `chooseReplayPacing({fourFeasible,twoFeasible,oneApproved}): {action,pacing,label}`; `evaluateTurn(expected,observed): {textOutcome,voiceOutcome,cancellationOutcome,outcome}`; `createVirtualPlayback({sampleRate:24000,now}): {enqueue(samples),advance(),outstandingSeconds(),cancel()}`. Use one pending generation, atomic completed history, one speech request and actual text/audio limits per session.

- [ ] Write failing tests for independent deterministic schedules, realized per-turn mixture, no catch-up or overlapping turns, staggered 180-second session replacement, one busy miss as a failed offered turn, and actual 24-kHz byte-duration consumption. Include replay fallback cases:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkFeasibility, chooseReplayPacing } from '../../tools/performance/shared/schedule.js';
test('10 seconds does not fit four turns but fits two', () => {
  assert.equal(checkFeasibility({maxOccupancyMs:10000,turnsPerMinute:4,busyMisses:0}).feasible,false);
  assert.equal(checkFeasibility({maxOccupancyMs:10000,turnsPerMinute:2,busyMisses:0}).feasible,true);
  assert.deepEqual(chooseReplayPacing({fourFeasible:false,twoFeasible:true,oneApproved:false}),
    {action:'run',pacing:2,label:'two-turn-pacing-substitute'});
});
test('20 seconds needs the separately agreed slower series', () => {
  assert.equal(checkFeasibility({maxOccupancyMs:20000,turnsPerMinute:2,busyMisses:0}).feasible,false);
  assert.equal(chooseReplayPacing({fourFeasible:false,twoFeasible:false,oneApproved:false}).action,
    'owner-agreement-required');
});
```

- [ ] Run `node --test tests/performance/schedule.test.mjs tests/performance/oracle.test.mjs tests/performance/playback.test.mjs`; expect red. Implement seeded phase/jitter and per-turn categorical selection with fixed seed sets for matched comparisons. A busy offer becomes `busy-schedule-miss`; it is never queued/retried or reclassified as planned cancellation. Support two/eight pacing and the separately approved one-turn profile with explicit labels.
- [ ] Implement oracle checks for expected complete text, correct tool result/IDs, all required eligible speech segments, ordered complete PCM drain, terminal events and generation ownership. Test a mandatory multi-segment B3 where second speech starts after SSE completion: missing second audio must produce `textOutcome:'success'`, `voiceOutcome:'failed'`, `outcome:'failed'`. A synthesized audio response with JSON/error MIME must fail; stale-generation output must never pass.
- [ ] Implement virtual playback and headless segmentation conformance. Test segment cap `min(120,floor(6*CPS))`, default CPS14, 2,400-character pending limit, two-second low-water, ten-second outstanding limit and cancellation. Require the entire speech plan before ordinary success; preserve separate delivery and virtual-playback completion clocks. Test odd PCM byte handling and stalled consumers without inventing physical playback.
- [ ] Wire F1, standalone B1/B2 muted controls, B3 voice, B4 extremes and B5 cancellation/fault cases. M1 draws 40/30/30 per intended turn with output enabled for all three. Closed populations replace after residence plus bounded drain; open k6 arrivals each start a new independent 180-second conversation. Record dropped starts and actual resident/in-flight/settling populations; optional one-turn saturation is explicitly unpaced.
- [ ] Prove every predeclared ordinary fixture/tuple/seed schedule passes load-one maximum-occupancy feasibility for the chosen profile. Use all declared tuples, not just a selected median. Run k6 mock smoke through real BFF/Fastify and compare harness speech segmentation/history behavior with application fixture tests. Rerun the three Node suites and commit exact shared/scenario/test/fixture files.

### Task 7: Enforce resources and implement the finite campaign controller

**Files:** Create campaign modules, container/balancer definitions and campaign config from section 2, `tests/performance/{matrix,controller,estimate,topology}.test.mjs`; extend CLI with `estimate`, `preflight` and `campaign`. Do not add Kubernetes manifests or a custom Next.js server.

**Interfaces:** `buildMatrix(config): Experiment[]`; `nextAction(state,observation): {kind,load,reason}` is pure; `estimateCampaign(experiments,policy): {targetHours,containerCpuHours,containerGiBHours,helperHostHours,priceInputs}`; `runExperiment(experiment,dependencies): Promise<RunManifest>`. `Experiment` includes tier, workload/profile/pacing, constrained service, allocations, seed set, admission, topology, required observer/headroom refs, repeat role and `maxDurationMs`. `runExperiment` must use verified production images and Task 1 records, never run paid calibration implicitly.

- [ ] Write tests for exactly 16 one-process grid cells per required sweep, all four paired configurations, default versus research admission, worker resource normalization and full resource provisioning. Add Fastify reduction tests rejecting average-only retrieval demand, fewer than three controls, >10% effects, insufficient 10× peak headroom and any reduction of the BFF/F1 grids:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMatrix } from '../../tools/performance/campaign/matrix.mjs';
test('primary BFF discovery retains the entire grid', () => {
  const cells=buildMatrix({family:'bff-grid',profiles:['minimum-wait'],
    cpus:[1,2,3,4],memoryGiB:[2,4,8,12],processes:1});
  assert.equal(cells.length,16);
  assert.equal(new Set(cells.map(c=>`${c.cpu}/${c.memoryGiB}`)).size,16);
});
```

- [ ] Run `node --test tests/performance/matrix.test.mjs tests/performance/controller.test.mjs tests/performance/estimate.test.mjs tests/performance/topology.test.mjs`; expect red. Implement a manifest-driven controller: preflight → load-one feasibility → infrastructure proof → warm/ramp → plateau → drain/settle → screen → refine → confirmation → candidate/soak → cleanup. Stop on finite discovery/time budgets and unsafe validity conditions; restart creates a new run, not appended results.
- [ ] Implement actual cgroup CPU/memory settings and record effective values/heap behavior. Keep target service and peer in separate application containers; no ambiguous shared quota. Container entry invokes the verified production build/start for exactly its service and binds the explicit private address. Task 0 resolves the precise workspace startup command, avoiding the root launcher starting two copies. Keep peers fixed at demonstrated nonbinding allocations for BFF-constrained and Fastify-constrained sweeps.
- [ ] Validate network protections through both actual paid-capable routes for every topology: missing, malformed, null, mismatched or disallowed Origin/Host gets 403 with zero simulator/provider calls; permitted pair works. Preserve the exact BFF target Host/Origin through the balancer. Record research address deviation, allowlists, TLS, connection reuse and pool settings; do not accept `X-Forwarded-*` as authority.
- [ ] Implement independent nonbinding sink/driver controls at 1.5× each next plateau's request/connection/byte/output demand, without the constrained app in the loop. Inject simulator delay, generator dropped arrivals and collector loss to prove censor/invalid/stop outcomes; stop attribution when a peer binds. Record cgroup OOM/throttle, FD/socket pool limits, host swap and queue/settlement state.
- [ ] Add frozen finite research admission pilot and shipped 2/2 controls. An admission-first boundary remains admission-bound, with no hardware-efficiency claim. Compare two workers under a common 2-CPU/12-GiB budget and four workers under 4-CPU/12-GiB against one process with the same total allocations. Promote the single-process 2-CPU/12-GiB discovery cell to three-repeat confirmation plus candidate soak for both profiles before using its worker ratio; the 4-CPU/12-GiB baseline is already paired. Unsupported worker mechanisms remain unavailable. For horizontal comparisons select 1-CPU/2-GiB per instance for both two and four instances, with the matching one-instance baseline, fixed balancer policy, per-instance loads/skew and aggregate admission accounting. All ratios require identical profile/pacing; apply the declared replay fallback to matched comparisons consistently. Revalidate infrastructure/peer headroom at aggregate scale.
- [ ] Run tests plus proposed `node tools/performance/cli.mjs estimate --campaign research/performance/campaign.json` and `node tools/performance/cli.mjs preflight --campaign research/performance/campaign.json`. Estimate output must include every experiment/control/repeat/soak and stop ceiling. Preflight must fail on missing baseline/client-lock/budget evidence; a negative preflight is a successful refusal test, not campaign readiness. Commit exact campaign/container/test files.

### Task 8: Derive honest capacity curves and bottleneck attribution

**Files:** Create `tools/performance/analysis/{screen,curves}.mjs`, `tests/performance/{screen,curves}.test.mjs`; extend CLI with `analyze --runs <index> --out <new-directory>`.

**Interfaces:** `screenRun({manifest,turns,metrics,baseline}): {evidence,reasons,counts,timings}`; `confirmPoint(repeats): {evidence,reasons}`; `selectCandidate(points): {sessions,noHeadroom,sourcePointId}|null`; `buildCurves(validatedRuns): {tables,figures,coverage}`. Preserve per-run/per-stratum values and histogram precision; figures are standalone SVG with CSV and explicit evidence labels.

- [ ] Write failed-offer reconciliation, sparse sample, bad-repeat and invalid-infrastructure tests. Include threshold boundaries, no averaging percentiles, no resurrection by soak, and discovery-only exclusions:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { confirmPoint, selectCandidate } from '../../tools/performance/analysis/screen.mjs';
test('one failed repeat cannot be hidden by two passes', () => {
  assert.equal(confirmPoint([{evidence:'confirmed'},{evidence:'failed'},
    {evidence:'confirmed'}]).evidence,'failed');
});
test('one confirmed session has no 25 percent headroom', () => {
  assert.deepEqual(selectCandidate([{id:'p1',sessions:1,evidence:'confirmed'}]),
    {sessions:1,noHeadroom:true,sourcePointId:'p1'});
});
```

- [ ] Run `node --test tests/performance/screen.test.mjs tests/performance/curves.test.mjs`; expect red. Implement offered/admitted/started/completed/failure/rejection/drop/unfinished reconciliation with planned B5 cancellation separated. All ordinary voice types require voice success; mixed costs/goodput cannot hide missing audio behind typed success.
- [ ] Require >=200 applicable timings for each baseline stratum and each candidate repeat, all applicable outcome/resource/latency gates, and three separate passing repeats. Up to 60 minutes/run is a sampling limit; insufficient counts remain inconclusive. Treat p99 counts/exploratory labels separately. Candidate75% must itself be checked, with 30-minute soak and memory/loop-delay/cleanup gates.
- [ ] Generate latency/goodput/event-loop/CPU/GC/memory/queue/byte curves by service, resources, admission mode, input/output workload and pacing/profile. Show failed and beyond-policy points descriptively; never publish a low-lag accepted point over20ms p99. A censored run is a lower bound when appropriate, not an exact maximum. Do not pool incompatible revisions/profiles or independent percentiles.
- [ ] Derive first-binding-limit evidence from request traces plus target/peer/container/infrastructure data. Report inclusive spans and overlapping child-wait union separately from CPU; unknown residuals remain unknown. Compute instance efficiency `C(n)/(n*C(1))` only under identical per-instance entitlements/nonbinding admission, and worker gain `C(workers)/C(single)` under equal total entitlements.
- [ ] Run tests and regenerate a clearly labeled synthetic analysis fixture twice; require stable CSV/figure content hashes excluding declared generation timestamps. Corrupt raw input and verify analysis fails read-only validation. Commit only analysis/tests and small labeled verification fixtures; no invented campaign result becomes a completed report.

### Task 9: Build the cost model and executive/technical report

**Files:** Create `tools/performance/analysis/{cost,report}.mjs`, `docs/research/performance/{README,report-template}.md`, `tests/performance/{cost,report}.test.mjs`; add `research/performance/pricing.json` schema-conformant dated inputs with unknown values retained. Extend CLI with `report`.

**Interfaces:** `projectCosts({capacity,usage,pricing,utilization,dutyCycle,spares,quotas}): {measured,projected,unknown,breakEven}`; `renderReport({curves,costs,coverage,baseline}): {markdown,html,assets}`. `providerDemand({sessions,turnsPerMinute,requestsPerTurn})` returns `{rpm:sessions*turnsPerMinute*requestsPerTurn}`. `capacity` includes evidence/workload/admission/pacing; `pricing` includes purchasable containing SKU, effective date/source, currency, region, shared/dedicated policy, billing granularity and included/extra features. Capacity transfer to a different host is projected.

- [ ] Write tests for unknown provider uplift, a 3-CPU allocation requiring a containing4-CPU SKU, idle/warm-spare cost, failed/canceled API work, repeated speech requests and missing empirical calibration. Include explicit quota translation:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { providerDemand } from '../../tools/performance/analysis/cost.mjs';
test('continuations multiply model requests, not callers', () => {
  assert.equal(providerDemand({sessions:100,turnsPerMinute:4,requestsPerTurn:2}).rpm,800);
});
```

- [ ] Run `node --test tests/performance/cost.test.mjs tests/performance/report.test.mjs`; expect red. Implement measured usage versus mock-projected usage, telephone/stream/STT minutes, TTS characters, model input/output/cache/reasoning/tool units, compute/memory, LB/NAT/network, observability/storage and required idle/HA capacity. Null contract prices stay unknown and propagate to totals/ranges; never coerce them to zero.
- [ ] Model active-request, RPM/TPM/audio/concurrency limits from dated sources and actual turn/segment overlap. Compute the practical envelope as the minimum of local/network/data/provider bounds in common workload units. Show instance/node/contract spend steps. More replicas may improve independent-session capacity; do not claim they shorten one remote inference operation.
- [ ] Generate report sections for operating envelope, first constraints, paired resource table, full-grid curves, process/instance efficiency, external sample limitations, realistic-wait fallback, cost/utilization/budget scenarios, recommended investment sequence and technical evidence. Show incremental engineering cost/payback for each optimization versus hardware/provider allocation. Revenue/budget is an adjustable assumption; do not invent financial viability.
- [ ] Create standalone HTML, Markdown, SVG/PNG and CSV with local links and no hosted dashboard requirement. Telephony/WebSocket/acoustic claims must remain explicitly unmeasured; no accepted HTTP session count is relabeled simultaneous telephone calls. Test that a missing Tier1 realistic-wait series leaves VP question4 incomplete, and a hypothetical series cannot establish empirical provider behavior.
- [ ] Rerun tests; validate report fixture links, raw/source manifests, unpriced cells, incomplete coverage and reproducibility instructions. Commit report generator/template/tests. The template stays labeled unpopulated until Task10 supplies valid evidence.

### Task 10: Execute the agreed tiers and publish the evidence-backed report

**Files:** Create immutable run directories and indexes under `research/performance/runs/`, derived analysis artifacts, dated final report under `docs/research/performance/`; update operator README with actual pinned commands and storage/retention references. Large raw artifacts stay outside ordinary Git with accessible immutable hashes. No application source changes in this task unless a discovered defect gets its own governed fix and a new baseline.

**Interfaces:** Consumes all preceding validated CLI commands, integrated application baseline, priced host inventory, owner-approved campaign/time/spend limits, and current rate cards. Produces a coverage ledger and report whose status is complete only if spec14/16.9 requirements all pass; otherwise explicitly partial/incomplete.

- [ ] Before any run, verify approved execution scope, bound delivery issue/worktree, clean source or declared input digest, production images, client-lock, isolation/headroom controls, and exact allowed spend/time. Run all research tests offline with `node --test tests/performance/*.test.mjs`; run accepted app typecheck/build/contracts/integration/slow/lint/format commands from its actual root. Fix failures before resource comparisons; preserve reviewed app contracts.
- [ ] Execute only separately agreed live calibration using the casebook/ledger; confirm aggregate/request reservations, five repeats only for funded selected cells, redacted observations and actual usage/rates. No permission to spend follows from the mock campaign command. If unavailable, retain unknown calibration and use labeled hypothetical profiles without claiming real provider latency or completing empirical requirements.
- [ ] Freeze fixtures/profiles/seeds/admission/thresholds and campaign estimate after the bounded pilot. Prove load-one feasibility and all predeclared replay tuples. If four-turn replay fails, retain failure and test unchanged two-turn replay at every Tier1 pair. If two also fails, stop for the separately agreed one-turn series and budget; absence of that agreement leaves realistic-wait work incomplete.
- [ ] Run initial Tier1 within the agreed 12-hour checkpoint or its explicitly revised budget: F1 at pairs, BFF-constrained minimum-wait/replay/default controls, three-repeat confirmation and candidate/soak where evidence permits. Do not pretend the checkpoint guarantees full Tier1. Publish progress, observed point costs and remaining-hour estimate before extending the campaign.
- [ ] Run Tier2 full F1 and BFF grids and Fastify-constrained grid. Apply the only permitted memory-cell reduction with linked three-repeat controls and >10× observed peak retrieval headroom; recheck after scaling. Record unavailable, infeasible, invalid, censored, inconclusive and reduced cells explicitly. Do not label discovery-only cells confirmed.
- [ ] Run Tier3 equal-aggregate worker comparisons (if supported), two/four-instance configurations and paired B1/B2/B3 deep dives, B4/B5 failures/recovery, two/eight pacing, mandatory open conversations and instrumentation-on/off controls. Revalidate helpers, peers and balanced distribution at each greater aggregate demand. Compute efficiency only for genuinely comparable nonbinding-admission deployments.
- [ ] After every series verify bounded cleanup, leases/queues/FDs/connections, retained heap/external memory trend, infrastructure telemetry and full offered-work reconciliation. Stop at OOM, unsafe queues, swapping, attribution loss or the agreed cumulative budget. Publish partial evidence immediately on stop; no automatic repeat/purchase/budget extension.
- [ ] Run read-only verification over every retained run, then `analyze` and `report` into new output directories. Independent rerender from raw records must reproduce tables/figures. Review the actual report for unsupported percentile, telephony, quota and cost claims; update story references through governed records and commit the small report/index artifacts. Do not close implementation/research issues or claim complete research until their required approvals/evidence exist.

## 5. Operator command contract

These are **future commands owned by this plan**, not commands implemented or executed during plan authoring. CLI help must list their side effects and required modes. Use argument-array child processes; reject unknown flags/paths. Every failed preflight exits nonzero before launching workload or paid APIs.

```sh
# Read-only validation / planning
node tools/performance/cli.mjs verify research/performance/runs/<run-id>
node tools/performance/cli.mjs estimate --campaign research/performance/campaign.json
node tools/performance/cli.mjs preflight --campaign research/performance/campaign.json

# Local-only actual experiment; budget file is required and bounded
node tools/performance/cli.mjs campaign --mode mock --tier 1 --campaign research/performance/campaign.json --budget research/performance/approved-budget.json

# Separate paid mode: never run automatically or from CI
node tools/performance/cli.mjs calibrate --casebook research/performance/calibration/casebook.json --budget research/performance/approved-budget.json

# Derived artifacts; output must be new and inputs verified
node tools/performance/cli.mjs analyze --runs research/performance/runs/index.json --out research/performance/analysis/<analysis-id>
node tools/performance/cli.mjs report --analysis research/performance/analysis/<analysis-id> --pricing research/performance/pricing.json --out docs/research/performance/<report-id>
```

The budget record contains exact owner-agreed scope, approval reference/time, target-environment/helper-host ceilings, hosting amount/currency or explicit local-only execution, paid ceiling/request counters, allowed tiers/profiles and expiry. It cannot be synthesized from a generic plan approval or adjusted automatically. Commands must reject expired/missing agreement, unknown rates for rented resources, or a request to run a profile outside the approved set. `.env` credentials are never accepted as proof of permission to spend.

Task7 owns `estimate/preflight/campaign`; Task4 owns `calibrate`; Task1 owns `verify`; Task8 owns `analyze`; Task9 owns `report`. By the end, `cli.mjs` dispatches only these commands. Negative tests prove `campaign` cannot enter calibration, a mock config cannot use a live adapter, and an incomplete compatibility proof cannot proceed to M1 capacity testing.

## 6. Requirement-to-delivery map

| Spec requirements | Owner tasks | Required evidence |
| --- | --- | --- |
| 1–4 intent, actual backend, topology, attribution | 0,3,7,10 | Integrated source/path record, real BFF/Fastify/network calls, independently nonbinding peers |
| 5 full resource/process/instance matrix | 7,10 | Effective cgroups, one-process grids, supported workers, balanced replicas and coverage ledger |
| 6 bounded calibration | 4,10 | Reservations/request counts/rate sources, per-case actual samples, unknown outcomes |
| 7 network simulation and egress | 3,7 | Tuple/stream conformance, denied paid access, scheduling/headroom controls |
| 8 Server-Timing and completion telemetry | 2,5,8 | Normal/error headers, no future durations, correlated spans, observer clocks, collection overhead |
| 9 workloads and streaming client | 5,6,10 | Pinned compatibility proof, all eligible speech, open/closed scenarios, cancellation |
| 10 screening/repeats/candidate/soak/cleanup | 6–8,10 | Failed offers, all-three pass, empirical labels, loop/memory gates, bounded settlement |
| 11 curves and scale attribution | 7–8 | Resource/byte/latency curves, first-binding evidence, correct efficiency formulas |
| 12 price/quotas/financial feasibility | 0,4,9 | Actual SKU mapping and units, usage provenance, variable/fixed/unknown costs |
| 13–14 reproducibility, report, completion | 1,8–10 | Immutable raw manifests, regenerated tables/plots, explicit coverage and limitations |
| 16.1–16.4 metric/oracle/statistics/schedule | 1–2,5–6,8 | Same-clock observations, multi-segment regressions, sample counts, no suppressed offers |
| 16.5–16.6 coverage and admission | 2,7–10 | Default versus nonbinding research modes, hardware versus semaphore attribution |
| 16.7 and owner amendment R2-F001 | 6–7,9–10 | Mandatory unchanged two-turn substitute; bounded one-turn agreement; Q4 incomplete if unavailable |
| 16.8 private topology/search | 2–3,7 | Actual Origin/Host conformance through both routes, disabled search and metadata behavior |
| 16.9 finite tiers and reduction | 7–10 | Complete cost/hour estimate, stop budget, full BFF/F1 grids, measured reduction authority |
| 16.10 and R2-F002 forward references | 3,7 | Independent pre-plateau 1.5× proof and explicit governing-spec links |

## 7. Plan author self-review and handoff

- All eleven tasks have file ownership, consumed/produced interfaces, specific negative tests, bounded implementation steps and verification/commit boundaries. Proposed code/commands are future implementation instructions, not executed evidence.
- The actual application is a prerequisite, not reconstructed by this work. Concrete candidate interfaces were read from the epic branch; Task0 revalidates them at the accepted revision.
- Both owner-requested optional observations are incorporated in the source spec and in Tasks6–7/10. The primary four-turn workload and real replay tuples remain unchanged; substitute pacing receives its own curve and cost label.
- Empirical calibration, network simulation and hypothetical sensitivity remain separate. The report may answer local-hardware questions while external/telephony questions remain explicitly incomplete.
- The full campaign is potentially expensive in elapsed hours even with zero paid load traffic. The estimate, initial checkpoint and cumulative stop policy expose that cost without weakening completion rules.
- No application edit, dependency installation, k6 build, benchmark, API sample, infrastructure purchase or deployment was performed while writing this plan. No implementation execution method or plan review result is inferred.

Before implementation, the owner reviews this plan, selects the execution approach and approves the applicable governed plan/decomposition. Native execution is the recommended default for harness development because the observer, scheduler, oracle and campaign contracts are tightly coupled; a fresh whole-branch review should precede any capacity report. A subagent-driven approach is also available if the owner prefers per-task independent review, preserving the serial integration boundaries above. Experiment execution still requires its concrete baseline/host/spend approval after preflight.
