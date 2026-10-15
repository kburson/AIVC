# Voice orchestrator Performance Research Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (recommended native inline method) or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This draft authorizes neither implementation nor experiment execution; preserve the owner's selected execution method and applicable AITM approvals.

**Goal:** Build a reproducible, predominantly mock-only experiment system that measures the voice orchestrator's local operating envelope and produces an evidence-backed performance and cost report.

**Architecture:** Next.js, Fastify orchestrator and Fastify lookup run as three independently scalable stateless service containers (section13). Primary headless k6 conversations enter the Fastify orchestrator directly. It owns STT/model/tool/TTS and calls a second Fastify lookup service; separately provisioned network simulators replace paid providers. A thin Next.js web BFF delegates to that same orchestrator only in a bounded forwarding-overhead comparison. Local stage telemetry, client observations, cgroup metrics and immutable manifests support service attribution, resource/process comparisons and cost projections. The real provider APIs receive only separately authorized bounded calibration samples.

**Tech Stack:** The integrated application's exact Node/npm/dependency pins; Node-native `.mjs` research utilities and `node:test`; existing TypeScript/Vitest for application changes; Docker/Compose or equivalent verified cgroups; a pinned k6 build whose POST/multipart SSE and concurrent speech behavior passes Task 5. Node >=26 is the governing floor; the existing amendment selects Node 26.8.1/npm 12.0.2. Reverify these against the selected integrated revision; no runtime upgrade is part of this plan.

**Spec:** [Story 39 amended design](../specs/2026-10-14-39-voice-bff-performance-research-design.md), source commit `be1da47a81cbbf8b2bc56eda194bca2c0e9e1c42`, SHA-256 `bd1803bf8b3b1f6c70489c33a125ec4fd4dd9c8962b50023ae23a26945059919`. Read the whole spec; sections 16–19 govern qualifications, corrected architecture, stateless containers and amendment lineage.

**Issue:** [#39](https://github.com/kburson/AIVC/issues/39). Date: October 15, 2026 (America/Chicago). Draft plan for owner review; exact review decisions and reviewed bytes are recorded in the peer-review archive. The earlier SAR/XPR accepted the identified predecessor spec, not this plan or its later owner-directed amendment.

## Story Intent

- **Beneficiary:** engineering and operations leaders planning voice-service capacity
- **Capability:** measure portable orchestrator capacity and compare resource, replica and provider-cost tradeoffs
- **Need:** local saturation and external-service waits lack separate reproducible evidence
- **Value or failure prevented:** capacity investments follow measured bottlenecks without uncontrolled provider spending


## Global Constraints

- Primary entry is the portable Fastify orchestrator; lookup-only throughput cannot be labeled voice-session capacity. Next.js serves React and delegates; it owns no provider orchestration.
- Use production builds and pinned toolchains/images. Do not benchmark Next.js development compilation, HMR, debug builds, or an unreported profiler as steady production overhead.
- All primary cells run one application process per target container.
- Three separate stateless service containers; scale the orchestrator independently. Freeze peer allocations within each comparison and tune them between declared runs from measured contention. Section13 defines state and replication prerequisites.
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
- Search disabled, stable tool definitions, private core caller authentication plus web Origin/Host protections, no wildcard or forwarded-header trust.
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

Authoring found no complete integrated tracked application in this checkout; generated untracked `apps/` is not source evidence and stays untouched. Read-only predecessor inspection at `fe2a158c8f717aed43d604c3d7614dc18a3452e1` showed provider/runtime/leases under `apps/web/server`, Next.js turn handlers, and separate Fastify lookup. Those are historical observations of the old architecture, not verified new Fastify module paths.

The owner subsequently required three independent application services: Next.js UI/thin BFF, Fastify orchestrator, and Fastify lookup. Task0 now requires the accepted integrated orchestration migration and transport/auth contract before research application instrumentation. The target module map below uses `apps/orchestrator/src` as the explicit proposed core location; reconcile exact accepted paths/signatures before coding. `ModelAdapter.runRound`, `SpeechAdapter.transcribe/synthesize`, turn/speech leases and cancellation semantics move behind Fastify; the lookup retains its independent HTTP boundary. Next.js retains only UI, web admission and streaming delegation. A renamed metric around existing Next.js paid orchestration cannot satisfy this prerequisite.

The migration itself belongs to separately governed application architecture work, not docs-only issue39 or a mock harness. Preserve original epic2/spec acceptance bytes and superseded SAR reports. If the three-service revision is absent, Task0 returns the blocker inventory and stops downstream app coding; it does not implement an imitation core. The source spec section18 is the owner-directed architecture authority; new review evidence must identify its revised digest. No merge, checkout, reset, runtime install, package upgrade or mutation of another worktree is implied by this plan.

## 2. File structure and interfaces

All paths below are repository-relative. Paths marked application are conditional on Task 0 matching the integrated revision. Research `.mjs` modules use explicit imports and Node's built-in test runner; portable k6 modules use `.js` without Node builtins. Keep a small exported API per module. Do not introduce a database, dashboard service, root workspace or plotting dependency merely to hold results.

| Boundary | New or modified paths | Responsibility |
| --- | --- | --- |
| Baseline and manifest | `tools/performance/{baseline,records,verify}.mjs`; `research/performance/{baseline.json,schema/records.schema.json}` | Source/toolchain/path authority, schema, hashes and read-only verification |
| Timing (application) | `apps/orchestrator/src/observability/{timing,metrics}.ts`; `apps/retrieval/src/http/timing.ts`; core route/error/SSE/provider/lookup integration points; `apps/web/server/observability/timing.ts` and `apps/web/server/orchestrator-client.ts` for thin forwarding only | Early headers, streaming spans, process samples, bounded export |
| Research configuration (application) | `apps/orchestrator/src/{config,runtime}.ts`; `apps/orchestrator/src/turns/leases.ts`; `apps/retrieval/src/index.ts` | Default-preserving mock-only network adapters/admission/bind configuration |
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
| 0 Baseline and prerequisites | 3–5 h | Accepted integrated application availability |
| 1 Evidence contracts | 3–5 h | Existing source-digest conventions |
| 2 Application instrumentation/admission | 8–14 h | Framework error/stream completion ownership |
| 3 Network simulators | 6–10 h | Actual provider protocol/SDK redirect support |
| 4 Paid calibration and ledger | 4–7 h | Usage/rate visibility and continuation accounting |
| 5 k6 streaming compatibility | 5–10 h | POST/multipart support and concurrent speech |
| 6 Headless workload/oracle | 8–14 h | Conformance to actual segment/playback behavior |
| 7 Resource and campaign runner | 9–16 h | Host entitlements, finite controller and cleanup |
| 8 Validity and capacity analysis | 5–8 h | Sparse strata and attribution |
| 9 Cost model/report | 6–9 h | Purchasable SKU/contract inputs |
| 10 Campaign operations/interpretation | 4–8 h active effort | Measured boundaries and repeat length |
| **Total** | **61–106 h active effort** | Excludes the separately governed orchestration migration, blocked integration time and unattended experiment runtime |

These are planning estimates, not executed measurements or delivery promises. A new k6 extension or alternate streaming implementation is outside the 5–10-hour compatibility gate: if no available pinned build passes, record a blocked prerequisite and propose a separately estimated client change before capacity work.

### Finite campaign estimate

Use sequential target experiments initially. A target-environment hour means one topology under test for one hour; report application-container CPU-hours/GiB-hours and helper-host hours separately. It is not one CPU-hour. The following bracket policy bounds discovery without assuming a demand target:

- Up to eight doubling plateaus (sessions 1 through 128 for M1), then up to four intermediate refinements. Reaching the ceiling without failure gives a censored/lower-bound result; a larger search requires an explicit revised campaign budget.
- Each M1 plateau budgets a 180-second ramp, >=120-second steady window, up to 120-second drain and 30-second cancellation settlement. Twelve plateaus cost up to 1.5 hours plus warmup/control overhead; use **0.5–1.6 hours per discovery series** for budgeting. This range is not a guaranteed execution bound; independent headroom proofs are counted separately below.
- F1 uses route-matched arrival rates, a 60-second warmup and >=120-second observation per point; budget **0.3–1.1 hours per series** with up to twelve points. Choose the initial F1 rate from a recorded pilot and freeze it.
- Confirmation allowance per series: baseline/last-pass/boundary/first-fail three times, plus three independent 75% candidate checks and one 30-minute soak. At minimum five minutes/window and up to 60 minutes of steady sampling plus ramp/drain, budget **2–17 hours per confirmed series**. Reuse a baseline only with identical profile/stratum/config and proven noncontention, recording its ID; failed or sparse repeats cannot be repaired by reuse.

| Experiment family | Initial count before infeasibility/reduction | Target-environment hours |
| --- | --- | --- |
| F1 grid discovery | 16 | 4.8–17.6 |
| orchestrator-constrained M1 discovery, minimum-wait + replay | 32 | 16–51.2 |
| lookup-constrained M1 discovery, same profiles | 32 | 16–51.2 |
| Default-admission M1 discovery at four pairs | 8 | 4–12.8 |
| Worker/instance discovery, four deployments × two profiles | 8 | 4–12.8 |
| Paired and scaling M1 confirmation packages | Up to 34 base; conditional additions are priced separately below: 8 orchestrator + 8 lookup-constrained + 8 default + 8 scaling + 2 matched worker baselines | 68–578 |
| Mixed-feasibility additional replay packages | At most7 additional two-turn discovery/confirmation packages; section11 | 0–130.2 |
| Mandatory controls and interventions | Finite inventory and tier attribution in section 8 | Added separately below |
| **Core discovery/confirmation subtotal** | Controls excluded here; section 8 supplies the complete envelope | **112.8–853.8 target-environment hours** |

The table above is a core subtotal, not the full campaign estimate. Section 8 defines the mandatory controls, finite count parameters, family-by-tier estimates and full envelope; its inventory governs Task 7 and Task 10. Actual discovery failures, statistical insufficiency, validated lookup reductions and unavailable workers can reduce completed work; extra profiles or infrastructure retesting can increase it. Do not count reduced/unavailable cells as measured. Section11 defines the all-pair fallback trigger: replace only an infeasible four-turn package, retain a feasible four-turn package and add its required two-turn package. Results retain separate pacing labels. Section 16.9's lookup reduction applies only with all its measured prerequisites; no resource matrix is silently dropped to meet this estimate.

**Proposed execution checkpoints, requiring owner agreement before running:** first authorize at most 12 target-environment hours for the pilot and initial Tier 1 evidence; then return the coverage ledger, actual rate of progress and revised remaining estimate. Proposed cumulative campaign ceiling is 160 target-environment hours, with a partial report at exhaustion. That ceiling may be insufficient for complete research, especially sparse low-load confirmations; it is a stop policy, not a reduced definition of completion. No timer or hosting budget auto-renews. Owner agreement to this plan's content alone is not an actual cloud purchase or permission to exceed the paid calibration ceiling.

For baseline procurement, evaluate a target host capable of honoring 4 dedicated CPU/12-GiB target plus OS headroom, with a separately provisioned helper host for peers/generator/simulators/collector. Record actual CPU architecture, quota/cpuset/SMT, VM overcommit and network. A local shared-host pilot is allowed only as a labeled contention-controlled preliminary result. Publication requires demonstrated isolation/headroom, not a guessed host size.

Let measured deployment prices per hour be `p_target` and `p_helpers`, including containing SKUs/spares; then sequential hosting cost is `targetHours*p_target + helperHostHours*p_helpers + network/storage/telemetry + paidCalibration`. Reserve helperHostHours from actual topology lifetimes, not the number of parallel experiments. No SKU, external quota uplift or dollar hosting total is invented before inventory and current primary-source rate verification. Task 0 produces the dated rate card and concrete machine-hour/host-hour quote before any rented execution; if unpriced, stop procurement and keep local simulation development available.

### Predeclared slower fallback

If unchanged realistic replay fails the two-turn feasibility gate, the sole proposed additional substitute is **one turn/minute**, same 180-second residence, phase [0,60), jitter ±6 seconds, minimum gap 48 seconds and maximum occupancy 38.4 seconds (20% gap margin). Require separate owner agreement before executing this series, including revised sample/runtime budget. If it fails too, stop the pacing fallback, retain its evidence and mark realistic-wait Tier 1/VP question 4 incomplete. Do not retry at ever-slower pacing, shorten answers or add paid calibration to find a pass. A hypothetical profile is always identified as such and cannot fill the empirical-calibration gap.

## 4. Implementation tasks

### Task 0: Verify the real baseline and quote the execution environment
#### Story Intent

- **Beneficiary:** performance engineers
- **Capability:** verify the real integrated services and quote a reproducible execution environment
- **Need:** generated assets and guessed host limits cannot establish the research baseline
- **Value or failure prevented:** invalid source or infrastructure assumptions block experiments before cost is incurred



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
    if (file === 'git' && args[0] === 'rev-parse') return 'a'.repeat(40);
    throw new Error('unexpected command');
  };
  await assert.rejects(verifyBaseline({root: process.cwd(), expectedHead: 'a'.repeat(40),
    requiredPaths: ['apps/orchestrator/src/http/app.ts'], exec}), /missing tracked source/);
});
```

- [ ] Run `node --test tests/performance/baseline.test.mjs`; expect failure before the module exists. Implement a read-only verifier using `execFile`, tracked-file byte hashing, `.nvmrc`/package lock/image checks and explicit route/interface inventory. Never label a docs-only digest as application validation.
- [ ] At the authorized integrated application revision inspect all Task 2/3/6 paths, model/tool/speech contracts, config and production startup. Record exact revisions plus outstanding application story prerequisites. If absent, return the blocker inventory and stop downstream application coding.
- [ ] Inspect actual host/cgroup/network resources; record a dated containing-SKU rate card in baseline.json.hostQuote and quote target/container/helper hours using section 3. Request the necessary execution budget only after the quote is concrete. Do not start a paid run here.
- [ ] Rerun the baseline test and the accepted application's existing toolchain/contract checks at that revision. Expected outcome: actual recorded evidence, or an explicit prerequisite blocker; no generic bootstrap `npm test` pass claim. Commit only these owned files with `[#<delivery issue>] Verify performance experiment baseline`.

### Task 1: Establish immutable records and read-only evidence verification
#### Story Intent

- **Beneficiary:** performance engineers and report reviewers
- **Capability:** preserve immutable run records and detect altered or incomplete evidence
- **Need:** partial or edited artifacts could otherwise be presented as complete measurements
- **Value or failure prevented:** capacity claims remain reproducible and auditable



**Files:** Create `tools/performance/{records,verify}.mjs`, `research/performance/schema/records.schema.json`, `tests/performance/records.test.mjs`, `tools/performance/cli.mjs` with only `verify` wired initially.

**Interfaces:** `validateManifest(value): RunManifest` throws on incomplete/unknown-version records; `openRun(root, runId): Promise<Journal>` creates a new run directory exclusively, and its bounded append-only journal records started/offered/completed/stop events durably before terminal publication. `writeRun(root, manifest, artifacts): Promise<string>` verifies that journal, hashes artifacts and exclusively publishes the terminal manifest without overwriting raw bytes. `recoverRun(path): Promise<{evidence,unfinished}>` reads interrupted evidence and records incomplete status without inventing outcomes; `verifyRun(path): Promise<{valid:boolean,reasons:string[]}>` never creates evidence or runs APIs. CLI proposed: `node tools/performance/cli.mjs verify <run-dir>`.

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

- [ ] Run `node --test tests/performance/records.test.mjs`; expect red. Implement schema validation with explicit required keys, finite nonnegative counters/times and enumerated evidence states; use exclusive run-directory creation in openRun, append-only journal frames with bounded buffering/backpressure, exclusive terminal-manifest creation in writeRun, canonical serialization and SHA-256. Reject evidence promotion by editing a summary without matching raw records.
- [ ] Add verifier behavior for missing inaccessible remote raw objects: return unavailable/invalid with reason, never pass solely on a URL. Preserve hash, retention and access instructions for intentionally external large raw artifacts.
- [ ] Run the records tests and `node tools/performance/cli.mjs verify research/performance/runs/does-not-exist`; expect tests pass and verifier nonzero with a missing-run reason. Commit only Task 1 files; the failing negative verifier is intentional evidence of refusal.

### Task 2: Instrument local APIs and expose bounded research configuration
#### Story Intent

- **Beneficiary:** service operators
- **Capability:** observe bounded timing and resource signals across local service boundaries
- **Need:** streaming completion and external wait time are not visible in response headers alone
- **Value or failure prevented:** local bottlenecks can be distinguished from provider waits without leaking sensitive data



**Files:** Create application timing/metrics modules from section 2; modify the verified routes for turn, speech, capabilities, errors, `sse-response.ts`, `run-turn.ts`, provider/tool boundaries, Fastify app/index and config/runtime/leases. Create `tests/contracts/performance-timing.test.ts`, `tests/contracts/research-config.test.ts`, `tests/integration/performance-streams.test.ts` and `tests/performance/collector.test.mjs`; create `tools/performance/collector.mjs`.

**Interfaces:** `beginTiming({requestId,service,now,exporter}): TimingContext`; `TimingContext.span(name): {end(outcome, counters?):void}`; `TimingContext.headers(): Headers`; `TimingContext.finish(outcome):void` is idempotent and follows actual settlement. Exporter `emit(record):boolean` is bounded, reporting dropped/backpressured counts. Research configuration: `mode:'mock'`, `networkMockBaseUrl`, `admissionMode:'default'|'research'`, positive integer `turnLimit/speechLimit`; live mode rejects any research-only setting. `LeasePools({turn:2,speech:2})` keeps shipped defaults.

- [ ] Write failing Vitest cases for 200/400/403/429/502 headers, the 2-KiB bound, fixed names, no sensitive descriptions, early SSE/PCM flush, post-header completion records, stable correlation IDs and child-wait overlap. Include the key future-duration rule:

```ts
it('does not claim a future stream duration in a header', () => {
  let ms = 0;
  const records: unknown[] = [];
  const ctx = beginTiming({requestId:'r', service:'orchestrator', now:()=>ms,
    exporter:{emit:(record:unknown)=>{ records.push(record); return true; }}});
  const model = ctx.span('orchestrator.model');
  const early = ctx.headers();
  expect(early.get('Server-Timing') ?? '').not.toContain('orchestrator.model');
  ms = 250; model.end('success'); ctx.finish('success');
  expect(records.length).toBeGreaterThan(0);
  expect(early.get('Server-Timing') ?? '').not.toContain('250');
});
```

- [ ] Run `npx --no-install vitest run tests/contracts/performance-timing.test.ts tests/contracts/research-config.test.ts`; expect red. Implement monotonic timing around real lifecycle boundaries. Begin before admission/body parsing; catch normal errors with context. Wrap stream production/abort settlement without buffering bodies, delaying headers, adding PCM bytes or releasing provider leases early.
- [ ] Add finite positive research limits only under explicit mock configuration, defaulting to 2/2 and rejecting invalid/live combinations. Test timeout before deferred upstream settlement still holds the slot, and idempotent release decrements once. Separate active/settling counters from HTTP response completion.
- [ ] Implement `perf_hooks` loop-delay/ELU/GC/CPU/memory sampling with recorded resolution/reset windows; bounded asynchronous collector batches to external storage. Application stop flushes with a deadline and records incomplete export; collector saturation invalidates attribution. Do not use unique IDs as metric labels.
- [ ] Run the new Vitest suites plus `node --test tests/performance/collector.test.mjs` and existing admission/deadline/streaming tests resolved by Task 0. Compare instrumentation on/off in later Task 10; unit tests do not establish zero overhead. Commit the exact instrumentation/config/test paths.

### Task 3: Build seeded network provider simulators and isolate paid egress
#### Story Intent

- **Beneficiary:** performance engineers
- **Capability:** replay seeded provider protocols over isolated network simulators
- **Need:** paid provider traffic is costly and provider variability obscures local saturation
- **Value or failure prevented:** repeatable load tests measure local capacity without accidental external spending



**Files:** Create simulator modules/fixtures from section 2, `apps/orchestrator/src/providers/network-mock.ts`, `tests/performance/simulators.test.mjs`, `tests/contracts/network-mock.test.ts`; modify runtime/config to select the narrow network mock only in explicit mock research mode.

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
  assert.deepEqual(selectTuple({tuples}, 7, 'short'),tuple);
  assert.ok(tuples.some(t=>JSON.stringify(t)===JSON.stringify(tuple)));
});
```

- [ ] Run `node --test tests/performance/simulators.test.mjs`; expect red. Implement bounded HTTP fixtures using native `http`, scripted model/tool messages, submitted WAV metadata and deterministic valid PCM bytes. Record intended dispatch/chunk times and actual times independently of target traces. Never synthesize real speech or use a model to prepare load responses.
- [ ] Implement minimum-wait, empirical tuple replay, clearly hypothetical sensitivity and fault/quota profiles. Include finite active-request and token/audio quota models; expose actual simulator queue/scheduling lag and byte counters. Validate fixture output lengths against the real speech caps.
- [ ] Run actual orchestrator-to-network-mock-to-real-Fastify integration in mock mode. Prove no dummy retrieval data shortcut, exact cancellation signal propagation and correct usage semantics. Run `npx --no-install vitest run tests/contracts/network-mock.test.ts` and simulator tests.
- [ ] Create a mock container network with explicit local allowlists, no paid credentials and no usable external route. From the actual application namespace attempt a paid-host connection and confirm denial, including SDK fallback/metadata routes; verify intended internal routes work. A test-only hostname interceptor alone does not establish egress isolation. Retain namespace/routing/firewall evidence, not secrets. Commit owned simulator, adapter, config and fixture files.

### Task 4: Add the separate bounded live calibration mode
#### Story Intent

- **Beneficiary:** engineering managers
- **Capability:** capture a small coherent set of provider latency and usage observations within funded limits
- **Need:** external latency and billing assumptions otherwise lack measured provenance
- **Value or failure prevented:** mocks and financial forecasts have bounded empirical inputs without uncontrolled paid requests



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
- [ ] Candidate secondary characterization entries (primary funded casebook and priority are section11): short model answer, one real lookup continuation, longer bounded context; STT 2/5/15-second fixtures; TTS 40/120/300 characters. Use five repeats only for selected funded cells; do not assume all cells × concurrency × cold/reuse fit 30 requests/provider. Initial concurrency one; optional concurrency three only from the same remaining budget.
- [ ] With fake provider clients prove headers/usage/first-output/completion/bytes, cold/reused connections, redaction and raw sample counts are retained; generate a provisional replay profile preserving complete tuples. Actual paid sampling remains Task 10 after explicit budget authorization; omit unsupported/unknown-cost cells.
- [ ] Re-run ledger/runner tests, interrupt/restart a fake calibration run and verify unresolved reservation persistence. Commit only sanitized casebook/rate-input schema, code and tests; never commit API keys or private audio.

### Task 5: Prove k6 can observe the real streaming conversation
#### Story Intent

- **Beneficiary:** performance engineers
- **Capability:** prove the load client observes actual streaming answers and concurrent speech
- **Need:** buffered or incompatible clients can hide first output and miss required audio
- **Value or failure prevented:** later capacity tests count real protocol outcomes rather than client artifacts



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
#### Story Intent

- **Beneficiary:** performance engineers
- **Capability:** offer deterministic conversations and evaluate complete text, voice and cancellation outcomes
- **Need:** busy turns or unfinished speech can otherwise disappear from the denominator
- **Value or failure prevented:** reported session capacity includes every offered turn and required audio segment



**Files:** Create portable schedule/oracle/playback modules, k6 scenario modules from section 2, `tests/performance/{schedule,oracle,playback}.test.mjs`; add declared expected segment/text/tool outcomes to `research/performance/fixtures/turns.json`. Reuse or build-test against the actual `SpeechText`/PCM policies verified by Task 0; do not import browser audio globals into k6.

**Interfaces:** `makeSchedule({seed,startMs,residenceMs,turnsPerMinute}): {turnIndex,intendedAtMs,type}[]`; `checkFeasibility({maxOccupancyMs,turnsPerMinute,busyMisses}): {feasible,ceilingMs}`; `mapReplayContext({context,oneApproved}): {id,action,pacing?,label?}` (isolated mapping only); `chooseReplayPacing({contexts,expectedContextIds,oneApproved}): {status,reasons,triggered,actions,additionalPackages}` (full campaign only); `evaluateTurn(expected,observed): {textOutcome,voiceOutcome,cancellationOutcome,outcome}`; `createVirtualPlayback({sampleRate:24000,now}): {enqueue(samples),advance(),outstandingSeconds(),cancel()}`. Use one pending generation, atomic completed history, one speech request and actual text/audio limits per session.

- [ ] Write failing tests for independent deterministic schedules, realized per-turn mixture, no catch-up or overlapping turns, staggered 180-second session replacement, one busy miss as a failed offered turn, and actual 24-kHz byte-duration consumption. Include replay fallback cases:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkFeasibility, mapReplayContext } from '../../tools/performance/shared/schedule.js';
test('10 seconds does not fit four turns but fits two', () => {
  assert.equal(checkFeasibility({maxOccupancyMs:10000,turnsPerMinute:4,busyMisses:0}).feasible,false);
  assert.equal(checkFeasibility({maxOccupancyMs:10000,turnsPerMinute:2,busyMisses:0}).feasible,true);
  assert.deepEqual(mapReplayContext({context:{id:"c1",pair:"1CPU-2GiB",admissionMode:"research",fourFeasible:false,twoFeasible:true},oneApproved:false}),
    {id:"c1",action:'run',pacing:2,label:'two-turn-pacing-substitute'});
});
test('20 seconds needs the separately agreed slower series', () => {
  assert.equal(checkFeasibility({maxOccupancyMs:20000,turnsPerMinute:2,busyMisses:0}).feasible,false);
  assert.equal(mapReplayContext({context:{id:"c1",pair:"1CPU-2GiB",admissionMode:"research",fourFeasible:false,twoFeasible:false},oneApproved:false}).action,
    'owner-agreement-required');
});
```

- [ ] Run `node --test tests/performance/schedule.test.mjs tests/performance/oracle.test.mjs tests/performance/playback.test.mjs`; expect red. Implement seeded phase/jitter and per-turn categorical selection with fixed seed sets for matched comparisons. A busy offer becomes `busy-schedule-miss`; it is never queued/retried or reclassified as planned cancellation. Support two/eight pacing and the separately approved one-turn profile with explicit labels.
- [ ] Implement oracle checks for expected complete text, correct tool result/IDs, all required eligible speech segments, ordered complete PCM drain, terminal events and generation ownership. Test a mandatory multi-segment B3 where second speech starts after SSE completion: missing second audio must produce `textOutcome:'success'`, `voiceOutcome:'failed'`, `outcome:'failed'`. A synthesized audio response with JSON/error MIME must fail; stale-generation output must never pass.
- [ ] Implement virtual playback and headless segmentation conformance. Test segment cap `min(120,floor(6*CPS))`, default CPS14, 2,400-character pending limit, two-second low-water, ten-second outstanding limit and cancellation. Require the entire speech plan before ordinary success; preserve separate delivery and virtual-playback completion clocks. Test odd PCM byte handling and stalled consumers without inventing physical playback.
- [ ] Wire F1, standalone B1/B2 muted controls, B3 voice, B4 extremes and B5 cancellation/fault cases. M1 draws 40/30/30 per intended turn with output enabled for all three. Closed populations replace after residence plus bounded drain; open k6 arrivals each start a new independent 180-second conversation. Record dropped starts and actual resident/in-flight/settling populations; optional one-turn saturation is explicitly unpaced.
- [ ] Prove every predeclared ordinary fixture/tuple/seed schedule passes load-one maximum-occupancy feasibility for the chosen profile. Use all declared tuples, not just a selected median. Run k6 mock smoke through real orchestrator/lookup and compare harness speech segmentation/history behavior with application fixture tests. Rerun the three Node suites and commit exact shared/scenario/test/fixture files.

### Task 7: Enforce resources and implement the finite campaign controller
#### Story Intent

- **Beneficiary:** service operators
- **Capability:** enforce isolated resource allocations and a finite validated campaign
- **Need:** peer saturation, partial fallback inputs and unbounded runs can invalidate measurements or exceed budgets
- **Value or failure prevented:** orchestrator scaling curves remain attributable and execution stops at declared limits



**Files:** Create campaign modules, container/balancer definitions and campaign config from section 2, `tests/performance/{matrix,controller,estimate,topology}.test.mjs`; extend CLI with `estimate`, `preflight` and `campaign`. Do not add Kubernetes manifests or a custom Next.js server.

**Interfaces:** `buildMatrix(config): Experiment[]`; `nextAction(state,observation): {kind,load,reason}` is pure; `estimateCampaign(experiments,policy): {targetHours,containerCpuHours,containerGiBHours,helperHostHours,priceInputs}`; `runExperiment(experiment,dependencies): Promise<RunManifest>`. `Experiment` includes tier, workload/profile/pacing, constrained service, allocations, seed set, admission, topology, required observer/headroom refs, repeat role and `maxDurationMs`. `runExperiment` must use verified production images and Task 1 records, never run paid calibration implicitly.

- [ ] Write tests for exactly 16 one-process grid cells per required sweep, all four paired configurations, default versus research admission, worker resource normalization and full resource provisioning. Add lookup reduction tests rejecting average-only retrieval demand, fewer than three controls, >10% effects, insufficient 10× peak headroom and any reduction of the orchestrator/F1 grids:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMatrix } from '../../tools/performance/campaign/matrix.mjs';
test('primary orchestrator discovery retains the entire grid', () => {
  const cells=buildMatrix({family:'orchestrator-grid',profiles:['minimum-wait'],
    cpus:[1,2,3,4],memoryGiB:[2,4,8,12],processes:1});
  assert.equal(cells.length,16);
  assert.equal(new Set(cells.map(c=>`${c.cpu}/${c.memoryGiB}`)).size,16);
});
```

- [ ] Run `node --test tests/performance/matrix.test.mjs tests/performance/controller.test.mjs tests/performance/estimate.test.mjs tests/performance/topology.test.mjs`; expect red. Implement a manifest-driven controller: preflight → load-one feasibility → infrastructure proof → warm/ramp → plateau → drain/settle → screen → refine → confirmation → candidate/soak → cleanup. Stop on finite discovery/time budgets and unsafe validity conditions; restart creates a new run, not appended results.
- [ ] Implement actual cgroup CPU/memory settings and record effective values/heap behavior. Keep Fastify orchestrator, Fastify lookup and any measured Next.js BFF in separately budgeted application containers; no ambiguous shared quota. Container entry invokes the verified production build/start for exactly its service and binds the explicit private address. Task 0 resolves the precise workspace startup command, avoiding the root launcher starting duplicate or unintended services. Keep peers fixed at demonstrated nonbinding allocations for orchestrator-constrained and lookup-constrained sweeps.
- [ ] Validate core bearer admission through both direct paid-capable routes: missing/invalid credentials return 401 with zero upstream work, valid private test/service credentials work without a browser Origin. Separately validate both thin Next.js routes: missing, malformed, null, mismatched or disallowed Origin/Host returns 403 with zero core/provider work; permitted pair delegates using the server-held core credential. Preserve the exact web target Host/Origin through its balancer. Record research address deviation, allowlists, TLS, connection reuse and pool settings; do not accept `X-Forwarded-*` as authority.
- [ ] Implement independent nonbinding sink/driver controls at 1.5× each next plateau's request/connection/byte/output demand, without the constrained app in the loop. Inject simulator delay, generator dropped arrivals and collector loss to prove censor/invalid/stop outcomes; stop attribution when a peer binds. Record cgroup OOM/throttle, FD/socket pool limits, host swap and queue/settlement state.
- [ ] Add frozen finite research admission pilot and shipped 2/2 controls. An admission-first boundary remains admission-bound, with no hardware-efficiency claim. Compare two workers under a common 2-CPU/12-GiB budget and four workers under 4-CPU/12-GiB against one process with the same total allocations. Promote the single-process 2-CPU/12-GiB discovery cell to three-repeat confirmation plus candidate soak for both profiles before using its worker ratio; the 4-CPU/12-GiB baseline is already paired. Unsupported worker mechanisms remain unavailable. For horizontal comparisons select 1-CPU/2-GiB per instance for both two and four instances, with the matching one-instance baseline, fixed balancer policy, per-instance loads/skew and aggregate admission accounting. All ratios require identical profile/pacing; apply the declared replay fallback to matched comparisons consistently. Revalidate infrastructure/peer headroom at aggregate scale.
- [ ] Run tests plus proposed `node tools/performance/cli.mjs estimate --campaign research/performance/campaign.json` and `node tools/performance/cli.mjs preflight --campaign research/performance/campaign.json`. Estimate output must instantiate every row and finite parameter in section 8, reject omission of a mandatory family, reconcile family-by-tier subtotals with the campaign total, and include every fresh or explicitly reused control, failed/infeasible attempt, repeat/soak and stop ceiling. Preflight must fail on missing baseline/client-lock/budget evidence; a negative preflight is a successful refusal test, not campaign readiness. Commit exact campaign/container/test files.

### Task 8: Derive honest capacity curves and bottleneck attribution
#### Story Intent

- **Beneficiary:** engineering leaders
- **Capability:** derive qualified capacity curves and identify the first binding layer
- **Need:** independent percentiles and censored runs cannot support reliable scaling claims
- **Value or failure prevented:** optimization and hardware decisions follow reproducible bottleneck evidence



**Files:** Create `tools/performance/analysis/{screen,curves}.mjs`, `tests/performance/{screen,curves}.test.mjs`; extend CLI with `analyze --runs <index> --out <new-directory>`.

**Interfaces:** `screenRun({manifest,turns,metrics,baseline}): {evidence,reasons,counts,timings}`; `confirmPoint(repeats): {evidence,reasons}`; `selectCandidate(points): {sessions,noHeadroom,sourcePointId}|null`; `buildCurves(validatedRuns): {tables,figures,coverage}`. Preserve per-run/per-stratum values, applicable independent-session counts, percentile estimator and histogram precision; descriptive uncertainty is the minimum/maximum across independent repeats, explicitly not a confidence interval. Missing session/precision/method evidence makes the corresponding decision inconclusive regardless of pooled volume; figures are standalone SVG with CSV and explicit evidence labels.

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
#### Story Intent

- **Beneficiary:** engineering managers
- **Capability:** compare measured service capacity and dated operating costs in an executive report
- **Need:** unavailable provider cells and hidden shared costs can distort financial feasibility
- **Value or failure prevented:** capacity choices expose uncertainty and marginal cost at each layer



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
#### Story Intent

- **Beneficiary:** research operators
- **Capability:** execute only approved experiment tiers and publish a complete coverage ledger
- **Need:** partial runs or exhausted budgets can otherwise be mistaken for completed research
- **Value or failure prevented:** the final report preserves actual coverage, limitations and stop decisions



**Files:** Create immutable run directories and indexes under `research/performance/runs/`, derived analysis artifacts, dated final report under `docs/research/performance/`; update operator README with actual pinned commands and storage/retention references. Large raw artifacts stay outside ordinary Git with accessible immutable hashes. No application source changes in this task unless a discovered defect gets its own governed fix and a new baseline.

**Interfaces:** Consumes all preceding validated CLI commands, integrated application baseline, priced host inventory, owner-approved campaign/time/spend limits, and current rate cards. Produces a coverage ledger and report whose status is complete only if spec14/16.9 requirements all pass; otherwise explicitly partial/incomplete.

- [ ] Before any run, verify approved execution scope, bound delivery issue/worktree, clean source or declared input digest, production images, client-lock, isolation/headroom controls, and exact allowed spend/time. Run all research tests offline with `node --test tests/performance/*.test.mjs`; run accepted app typecheck/build/contracts/integration/slow/lint/format commands from its actual root. Fix failures before resource comparisons; preserve reviewed app contracts.
- [ ] Execute only separately agreed live calibration using the casebook/ledger; confirm aggregate/request reservations, five repeats only for funded selected cells, redacted observations and actual usage/rates. No permission to spend follows from the mock campaign command. If unavailable, retain unknown calibration and use labeled hypothetical profiles without claiming real provider latency or completing empirical requirements.
- [ ] Freeze fixtures/profiles/seeds/admission/thresholds and campaign estimate after the bounded pilot. Prove load-one feasibility and all predeclared replay tuples. If four-turn replay fails, retain failure and test unchanged two-turn replay at every Tier1 pair. If two also fails, stop for the separately agreed one-turn series and budget; absence of that agreement leaves realistic-wait work incomplete.
- [ ] Run initial Tier1 within the agreed 12-hour checkpoint or its explicitly revised budget: F1 at pairs, orchestrator-constrained minimum-wait/replay/default controls, three-repeat confirmation and candidate/soak where evidence permits. Do not pretend the checkpoint guarantees full Tier1. Publish progress, observed point costs and remaining-hour estimate before extending the campaign.
- [ ] Run Tier2 full F1 and orchestrator grids and lookup-constrained grid. Apply the only permitted memory-cell reduction with linked three-repeat controls and >10× observed peak retrieval headroom; recheck after scaling. Record unavailable, infeasible, invalid, censored, inconclusive and reduced cells explicitly. Do not label discovery-only cells confirmed.
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
| 1–4 intent, actual backend, topology, attribution | 0,3,7,10 | Integrated source/path record, real orchestrator/lookup/network calls, independently nonbinding peers |
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
| 16.8 private topology/search | 2–3,7 | Actual core caller-auth and web Origin/Host conformance through both routes, disabled search and metadata behavior |
| 16.9 finite tiers and reduction | 7–10 | Complete cost/hour estimate, stop budget, full orchestrator/F1 grids, measured reduction authority |
| 16.10 and R2-F002 forward references | 3,7 | Independent pre-plateau 1.5× proof and explicit governing-spec links |

## 7. Plan author self-review and handoff

- All eleven tasks have file ownership, consumed/produced interfaces, specific negative tests, bounded implementation steps and verification/commit boundaries. Proposed code/commands are future implementation instructions, not executed evidence.
- The migrated three-service application is a prerequisite, not reconstructed by this research. Predecessor interfaces were observed under Next.js; Task0 requires verified Fastify-owned replacements and thin-BFF delegation at the accepted revision.
- Both owner-requested optional observations are incorporated in the source spec and in Tasks6–7/10. The primary four-turn workload and real replay tuples remain unchanged; substitute pacing receives its own curve and cost label.
- Empirical calibration, network simulation and hypothetical sensitivity remain separate. The report may answer local-hardware questions while external/telephony questions remain explicitly incomplete.
- The full campaign is potentially expensive in elapsed hours even with zero paid load traffic. The estimate, initial checkpoint and cumulative stop policy expose that cost without weakening completion rules.
- No application edit, dependency installation, k6 build, benchmark, API sample, infrastructure purchase or deployment was performed while writing this plan. No implementation execution method or plan review result is inferred.

Before implementation, the owner reviews this plan, selects the execution approach and approves the applicable governed plan/decomposition. Native execution is the recommended default for harness development because the observer, scheduler, oracle and campaign contracts are tightly coupled; a fresh whole-branch review should precede any capacity report. A subagent-driven approach is also available if the owner prefers per-task independent review, preserving the serial integration boundaries above. Experiment execution still requires its concrete baseline/host/spend approval after preflight.

## 8. Normative finite control inventory and tier estimate (SAR revision)

This section replaces the former undifferentiated 15–60-hour control allowance. Task 7 must encode these families and parameters rather than select its own coverage. The core subtotal in section 3 excludes the controls below. These are conservative planning ranges for the declared campaign, not measured runtime or an approved purchase. The concrete quote uses the exact generated window list, including warmup/ramp/drain, helper-host lifetimes and evidence reuse; no rounded table value is an execution timer.

### Frozen parameters and reuse

- Ordinary feasibility fixtures are exactly four: B1 short typed answer, B2 one lookup, B3 short audio input, and B3 multi-segment output continuing after SSE. Preserve their accepted contracts. For each fixture minimum-wait has one tuple. Replay supports K=1–5 complete tuples per fixture in the schema; the primary paid casebook below funds exactly five coherent repeats, with unsupported or unfunded empirical fixtures unavailable; select by predeclared chronological inclusion, not favorable latency. Fewer/missing supported tuples are explicit; unsupported cases are not fabricated. Freeze exact K and the complete funded casebook before quoting/execution under section11; no leftover-balance selection. The upper bound below uses K=5 for all four.
- Use exactly three independent declared seed schedules for controls and matched comparisons. Every active source/profile/fixture/pacing/admission/topology combination is bound by hashes. A failed tuple is retained; an infeasible profile can stop further capacity progression without testing every expensive load. Maximum occupancy is reported only over cases actually observed; no omitted case is assumed to pass.
- A load-one case probe submits one declared fixture/tuple and observes through virtual playback/settlement, with up to120 seconds ordinary observation plus30 seconds unresolved cancellation settlement. For the primary context, probe every fixture/tuple under all three seeds, then run three full180-second seeded M1 schedules per profile, each with up to150 seconds drain/settlement. A profile failing a case probe is infeasible and does not get a false full-schedule pass. The seed schedule checks busy misses; the exhaustive probes prevent a favorable per-turn draw from omitting a slow tuple.
- Contexts are eight Tier1 contexts (four orchestrator-constrained research, four default-admission),28 Tier2 contexts (12 additional orchestrator-constrained plus16 lookup-constrained), and four Tier3 scaling deployments. Each has minimum-wait and replay profiles. The extra single-process2-CPU/12-GiB worker baseline reuses its exact Tier2 feasibility evidence only if all bindings and allocations are unchanged.
- A feasibility result is reusable only with identical source, fixture/tuple, seed, output mode, admission, constrained/peer resources, protocol and topology. Re-evaluating the measured occupancy against a different pacing ceiling can reuse case probes; a new pacing still runs its own three full schedules. Muted B1/B2 cannot reuse output-enabled probes as proof of their own text oracle. Any change makes the affected control fresh and enters a newly quoted scope.
- Headroom proofs may reuse a prior proof only when source/client/simulator/collector builds, profile/output pattern, hosts, allocations and topology are unchanged, the prior proof independently covers at least1.5 times every proposed demand dimension, and current health/scheduling observations remain in the proven envelope. Record the reused proof ID before the next plateau. Otherwise run a fresh proof. No capacity point beyond proven infrastructure is accepted.
- Topology protection preflight is fresh before each series named below, including fallback and recovery series. A preflight sends the six permitted/invalid web Origin/Host cases through each of two Next.js routes (12 requests), plus missing/invalid/valid core-credential cases through each of two direct core routes (six requests). The total18 bounded requests prove entry-specific admission and zero upstream work for refusals. Budget30–120 seconds including observation/export; if that bound expires mark the preflight failed. Reuse is limited to repeats within that unchanged series, never an unrecorded topology change.
- After a failure, do not automatically rerun a series to obtain a pass. The three specified repeats remain independent even when one fails. Defect fixes or additional repetitions require a new baseline/input digest and revised quoted scope. Stop at the first sustained discovery failure and at the finite bracket ceiling; unreached failures remain lower bounds.

### Experiment/control families

Durations below include their stated observation and bounded drain; independent headroom and topology checks are additional rows. Where a series has already met an identical required control, retain both coverage references but charge its actual execution once. The conservative upper estimate assumes fresh controls and no lookup reduction. Normal unavailable/infeasible cases consume their attempted time and stay visible.

| Family | Tier and finite count | Window/repeat policy | Planning target-environment hours |
| --- | --- | --- | --- |
| Core F1 discovery | T1 four; T2 twelve series | Section3 maximum12 points/series,0.3–1.1h/series | T1 1.2–4.4; T2 3.6–13.2 |
| Core research/default M1 discovery | T1 sixteen; T2 fifty-six; T3 eight series | Maximum12 points/series,0.5–1.6h/series; infeasible replay goes to its bounded substitute, not an invented pass | T1 8–25.6; T2 28–89.6; T3 4–12.8 |
| Core M1 confirmation/candidate/soak packages | T1 sixteen; T2 eight; T3 ten (includes two matched worker baselines) |15 check windows plus one30-minute soak/package; per-window <=60-minute steady limit and bounded ramp/drain; section3 approximate2–17h/package | T1 32–272; T2 16–136; T3 20–170 |
| Primary load-one exhaustive probes plus seeded schedules | T1 eight; T2 twenty-eight; T3 four contexts, both profiles | Per context:3*4*(1+K) case probes at0–2.5min each, plus six full schedules at3–5.5min each. Freeze K; conservative per-context0.3–3.55h | T1 2.4–28.4; T2 8.4–99.4; T3 1.2–14.2 |
| Mandatory two-turn replay fallback feasibility | T1 at most eight contexts | Only if four-turn replay fails;3*4*K probes at0–2.5min plus three full schedules at3–5.5min; failed four-turn contexts use replacement packages; feasible contexts require section11 additional packages | T1 additional0–22.2 |
| Mixed-feasibility additive replay work | T1 at most7 contexts whose four-turn package remains feasible when any other replay context fails | One two-turn discovery plus confirmation/candidate/soak package per eligible context,2.5–18.6h; replacement contexts add no second package. Up to196 additional infrastructure windows are charged in the infrastructure row; existing eight fallback topology series already cover all substitutes | T1 additional0–130.2 |
| F1 quantitative/reduction controls | T2 all16 resource cells; four matched points/cell; three seeds =192 windows | Points: low-load, common comparable load across memory at that CPU, discovered last pass, first fail if reachable. Observe2–10min after1min warmup; up to2.5min drain/settlement. If no first failure, retain lower bound, not an exact limit. Inadequate counts are inconclusive; no automatic extension. Retain3–13.5min/window | T2 9.6–43.2 |
| B1/B2/B3 deep dives | T3 four pairs*three types*two profiles*three offered-load points*three seeds =216 windows | B1/B2 explicitly muted text controls, B3 output-enabled; load points1,half the corresponding M1 candidate,that candidate, deduplicating equal loads. Without a confirmed candidate, use the corresponding screened last pass and label descriptive. Each window3min ramp+2min steady+up to2.5min drain | T3 18–27 |
| Deep-dive feasibility | T3 24 type/profile/pair cells | Three full schedules/cell =72 at3–5.5min. Exhaustive probes cover one fixture each for muted B1/B2 and both B3 fixtures:48*(1+K) probes at0–2.5min. Reuse only exact matching output-mode evidence | T3 3.6–18.6 |
| Two/eight pacing sensitivity | T3 four pairs*two profiles*two pacings =16 discovery series | Up to12 plateaus/series,0.5–1.6h; three full load-one seed schedules per new pacing, reusing only equivalent case probes. At most48 feasibility schedules at3–5.5min. A two-turn baseline substitute can satisfy an identical pacing cell by reference. These are screened/descriptive intervention curves unless separately quoted for confirmation | T3 10.4–30 (8–25.6 discovery plus2.4–4.4 schedules) |
| Mandatory open-conversation arrivals | T3 four pairs*two profiles*three arrival rates*three seeds =72 windows | Each arrival iteration owns a new180-second conversation. Rates are0.5,1,1.5 times N/L, where N is matching confirmed M1 candidate (otherwise screened last pass) and L its observed mean session residence seconds. Freeze rates before running; unavailable N/L leaves that cell unavailable. Stop new starts after3min population ramp+2min steady, then allow the last accepted conversation its remaining180-second residence before up to120-second request drain and30-second cancellation settlement. Budget8–10.5min/window and k6 gracefulStop at least330seconds after the new-start cutoff. Count late/dropped starts and actual population; no overlapping turns | T3 9.6–12.6 |
| B4/B5 paired policy interventions | T3 four pairs*five scripts*three seeds =60 windows | Scripts: B4 largest valid body/history/utterance with bounded long output; B5 disconnect with delayed settlement; rapid replacement/stale generation; slow PCM consumer; provider error script with declared429,500 and malformed-result stages. One minimum-wait/fault profile each,3min setup/ramp+2min observation+up to2.5min drain; separate expected outcomes | T3 5–7.5 |
| F1 fault subset | T3 four pairs*two scripts*three seeds =24 windows | Malformed query and interrupted/slow-read client;1min warmup+2min observation+up to2.5min drain; check schema/status/cleanup, not ordinary voice goodput | T3 1.2–2.2 |
| Worker/instance skew and recovery | T3 four deployments*two scripts*three seeds =24 windows | Scripts: one slowed worker/instance and one terminated worker/instance; use matching feasible replay at declared candidate or screened load.3min ramp+2min observation+up to2.5min drain. Capture per-instance skew, failed established streams and new-connection redistribution; no seamless migration claim. Unsupported workers unavailable | T3 2–3 |
| Instrumentation on/off pairs | T3 four pairs*two profiles*two states*three matched seeds =48 windows | Same source except explicit instrumentation flag, profile, workload and offered load; use matching M1 candidate or screened last pass.3min ramp+2min observation+up to2.5min drain. Compare paired descriptive latency/resource deltas, not a new capacity label | T3 4–6 |
| Selected ordinary slow/tail sensitivity | T3 two orchestrator allocations (1CPU/2GiB and4CPU/12GiB)*B1/B2/B3*two named hypothetical profiles*two loads*three seeds =72 windows | B1/B2 muted, B3 output-enabled. Profiles slow2x and tail4x each use one source tuple per fixture, chosen by maximum observed completion with stable-ID ties, and multiply its first-output/completion/chunk waits by2/4 while preserving bytes/text/tool shape; fallback source is the explicitly hypothetical profile when empirical replay is absent. Fixed four-turn pacing; load1 and half matching ordinary candidate or screened last pass, deduplicating equal loads. Use ordinary success oracle,5–7.5min/window; infeasible cells stay infeasible, no fixture/pacing substitution | T3 6–9 |
| Slow/tail feasibility | T3 twelve type/profile/allocation cells | Three full schedules/cell =36 at3–5.5min, plus48 bounded fixture/tuple/seed probes at0–2.5min (one fixed slow/tail tuple per ordinary fixture). Verify transformed durations against actual deadlines; a violation is an infeasible/failed observation, never a manufactured ordinary pass. No extra paid samples | T3 1.8–5.3 |
| Thin Next.js forwarding overhead | T3 four orchestrator executive pairs*two profiles*three offered-load points*three seeds*two entry modes =144 windows | Next.js fixed1CPU/2GiB on independently provisioned helper infrastructure, outside the orchestrator target host and cgroup; lookup/simulators fixed proven nonbinding. Compare direct core versus Next.js-to-core at load1,half matching M1 candidate,and candidate (screened last pass if unconfirmed). Same fixtures/output/seed/core resources;5–7.5min/window. Descriptive paired latency/bytes/CPU/memory/abort/flush deltas, no new confirmed capacity label. A binding BFF is a web-path limit, never a lower portable-core limit | T3 12–18 |
| Web-path feasibility | T3 four allocations*two profiles =eight web contexts | Exhaustive probes3*4*(1+K) per allocation at0–2.5min, plus24 full seed schedules at3–5.5min. Direct-core feasibility may reuse only identical earlier direct controls; web observations are fresh and retain their own clock/path. If the matched core profile needs declared replay fallback, use exactly that pacing for both entries | T3 1.2–14.2 |
| Actual-path topology protection checks | T1 28; T2 84; T3 138 series, maximum250 | Each30–120sec. Counts: T1 four F1+sixteen M1+eight possible fallback; T2 twelve F1+fifty-six M1+sixteen F1 control series; T3 eight scaling+two matched baselines+24 deep+16 pacing+eight open+20 B4/B5+eight F1 fault+eight recovery+16 instrumentation+12 slow/tail+16 web-forwarding | T1 0.233–0.933; T2 0.7–2.8; T3 1.15–4.6 |
| Independent1.5-times infrastructure proofs | T1 maximum716; T2 1192; T3 1176 windows, total3084 before exact reuse | Each60sec same-profile demand observation plus at most60sec warm/drain. Count a fresh proof for every discovery, confirmation/soak or intervention window and one load-one envelope per new context/profile/pacing. Case probes within the exact proven envelope reuse that proof; this row does not recursively require proofs of proof drivers. Record attempted/valid/reused separately | T1 8.667–23.8667; T2 19.867–39.733; T3 19.6–39.2 |

The F1 control row supplies the measured data for the spec16.9 reduction test: at every CPU compare memory using matched payload/routes/load, no memory-induced threshold crossing, <=10% goodput/p95 difference with uncertainty; each retained2-GiB point must show >=10 times the largest peak retrieval RPS from the orchestrator campaign. A first-fail point that is unreachable is explicitly absent, not retried beyond the quoted bracket. A failed/sparse reduction control leaves the full lookup-constrained sweep required. Recheck after worker/instance demand; new invalidating demand restores omitted cells through a revised quote, never inferred results.

Infrastructure window count reconciliation: T1=48 F1 discovery+192 M1 discovery+256 confirmation/soak+16 primary load-one envelopes+eight possible fallback=520. T2=144 F1 discovery+672 M1 discovery+128 confirmation/soak+192 F1 controls+56 primary load-one=1192. T3=96 discovery+160 confirmation/soak+216 deep+192 pacing+72 open+60 B4/B5+24 F1 fault+24 recovery+48 instrumentation+eight primary load-one+24 deep feasibility+16 pacing feasibility+72 slow/tail+12 slow/tail feasibility+144 web-forwarding+eight web feasibility=1176. These base counts gain up to196 conditional mixed-fallback discovery/confirmation proofs, making T1 at most716 and total3084; section11 defines the unique additional windows. These counts bound all windows with no proof reuse; the estimator replaces maxima with exact applicable windows and records reuse IDs. The proof for each next discovery plateau precedes that plateau; a later successful proof cannot retroactively validate an unproven point.

### Tier totals, approvals and estimator tests

| Tier | Core discovery/confirmation | Controls/interventions | Total target-environment hours |
| --- | --- | --- | --- |
|1 decision baseline |41.2–432.2 |11.3–75.4 |**52.5–507.6** |
|2 resource attribution |47.6–238.8 |38.567–185.133 |**86.167–423.933** |
|3 scaling/robustness |24–182.8 |96.75–211.4 |**120.75–394.2** |
|**Whole campaign** |**112.8–853.8** |**146.6167–471.9333** |**259.4167–1325.7333** |

Values are rounded planning intervals, not confidence intervals. They assume both profiles, supported deployments and the conservative control inventory; unavailable/infeasible cells, exact reuse and validated reduction can lower actual executed time while preserving coverage labels. Extra one-turn fallback feasibility/series is excluded until separately agreed and requoted; add at most eight Tier1 substitute series with the same finite probe/window policy, without adding a second primary capacity package for an infeasible four/two-turn result. Defect repairs/reruns are also outside this initial inventory. The exact quote derives CPU/GiB-hours and helper-host hours from each window's allocations/lifetime; parallel scheduling never converts target-environment hours directly into elapsed wall hours or double-counts a host price.

The initial12-hour checkpoint is only a pilot/progress checkpoint. It is not the estimated52.5–507.6 hours for complete Tier1. The proposed cumulative160-hour ceiling may stop before complete Tier2/3 and may be insufficient even for Tier1's sparse cases. Retain the partial report and remaining coverage on exhaustion; only owner agreement to a revised concrete quote can extend it. No mandatory family is removed to fit either checkpoint.

Task7 adds `validateInventory(inventory)` in matrix.mjs, rejecting any missing required family or unbounded parameter; estimator output includes per-tier fresh/reused/attempted/omitted-by-evidence counts and durations. Add tests that remove the open-conversation family, truncate final open-session residence, omit selected slow/tail coverage or thin-BFF forwarding, remove pre-plateau headroom, exceed K=5, omit fallback attempts after four-turn infeasibility, reuse a proof with lower byte/output capacity, and omit a matched worker baseline. Each must fail before launch. Add a fixture of this exact maximal inventory: core subtotal112.8–853.8, controls146.6167–471.9333 and total259.4167–1325.7333; assert each tier reconciles within rounding tolerance, no operation is charged twice, and failure/reuse/unavailable changes preserve remaining required coverage rather than promoting it. Budget exhaustion returns a partial report and cannot mark that tier complete.

## 9. SAR evidence refinements and interruption tests

Task1's `Journal.append(event):Promise<void>` accepts bounded `{runId,sequence,type,turnId?,outcome?,sourceDigest?,inputs?}` frames; `flush():Promise<void>` acknowledges durable collection. Include a start frame with the baseline/input hashes before load, and offered events before dispatch. Enforce monotonic sequence/size limits and expose exporter/backpressure errors. A journal is append-only during a run; terminal publication seals its digest. A process interruption preserves journal/raw data; recovery cannot fabricate timing or outcomes, count offers as success, overwrite sealed evidence or silently reuse a run ID. Raw evidence can reside in an external collector with an immutable accessible reference, using equivalent interrupted-run semantics.

Add this negative integration fixture to Task1's records tests, using the exported openRun/recoverRun contract (test imports `mkdtemp`/`rm` from node:fs/promises and `join` from node:path; scratch parent must exist):

```js
test('interruption before terminal publication keeps offered work incomplete', async t => {
  const root=await mkdtemp('.scratch/performance-interrupt-');
  t.after(()=>rm(root,{recursive:true,force:true}));
  const journal=await openRun(root,'interrupted');
  await journal.append({runId:'interrupted',sequence:1,type:'started',sourceDigest:'a'.repeat(64),inputs:{scenario:'b'.repeat(64)}});
  await journal.append({runId:'interrupted',sequence:2,type:'offered',turnId:'t1'});
  await journal.flush(); // no terminal writeRun call, simulating interruption
  const result=await recoverRun(join(root,'interrupted'));
  assert.equal(result.evidence,'inconclusive');
  assert.equal(result.unfinished,1);
});
```

Task8 adds `requireEvidenceInputs({timingsCount,sessionCount,precisionMs,method}): {evidence,reasons}` in screen.mjs; screenRun uses it before making a percentile decision. Record independent-session count separately from correlated turns. Initial descriptive uncertainty is the observed minimum/maximum of per-repeat values; report actual repeat count and label the range **not a confidence interval**. Do not average independent p95s or use pooled volume to conceal a sparse/failed repeat. Retain the spec's minimum per-stratum counts and optional future formal confidence design as separate research.

```js
test('large pooled volume does not replace session provenance', () => {
  const result=requireEvidenceInputs({timingsCount:10000,sessionCount:null,
    precisionMs:1,method:'empirical-nearest-rank'});
  assert.equal(result.evidence,'inconclusive');
  assert.ok(result.reasons.includes('missing-session-count'));
});
```

Run the owning offline test suites from Tasks1,7,8 after implementing these additions. These fixtures are proposed tests, not tests executed while revising this plan. The sealed report/disposition chain records which SAR revision introduced these requirements.

## 10. Owner architecture correction and remaining predecessor findings

The owner clarified the target during plan SAR on October15,2026: **Next.js UI/thin BFF → Fastify orchestrator → separate Fastify lookup/providers**, with non-web/telephony clients delegating directly to the same orchestrator. The corrected spec section18 governs this plan. This is a material architecture amendment, not a claim that existing Next.js code already meets the target. Native SAR reports for initial plan5be232d and revisionb9e74a2 remain unchanged predecessor evidence; their scope is not accepted for this architecture. The next review request identifies new source hashes and explicitly closes or carries their findings. XPR must independently review the full corrected artifact; see the archive for exact current review status.

### Concrete ownership and integration checks

- Task0 requires an accepted integrated three-service application with independent entry points/cgroups. The Fastify orchestrator serves `/api/turn`, `/api/speech` and `/api/capabilities`; the separate Fastify lookup serves `/v1/projects` and `/health`. Next.js retains the browser routes as HTTP delegates. No new message broker, durable session database or telephony gateway is introduced by the term service bus.
- Target core modules are `apps/orchestrator/src/{config,runtime}.ts`, `providers/{contracts,claude,deepgram,network-mock}.ts`, `turns/{leases,deadline,run-turn}.ts`, `tools/retrieval-client.ts` and `http/{app,auth,timing}.ts`, reconciled to actual migrated files by Task0. Next's `apps/web/server/orchestrator-client.ts` and API route wrappers contain no SDK/provider/model/tool/retrieval orchestration. Preserve source dependency-graph evidence for that ownership; core imports no Next.js server runtime. Application migration implementation/acceptance remains a separately governed prerequisite.
- Task2 instruments Fastify lifecycle and actual streamed writes, including explicit preheaders before a raw/hijacked stream when applicable; it does not assume a Next.js Response wrapper runs in Fastify. Begin timing before core auth/body parsing, and attach completion/lease release to real producer/upstream settlement. Instrument lookup and thin web forwarding under distinct service/process namespaces. A Next timeout/disconnect propagates an abort to core; it does not acquire/release paid leases or retry providers.
- Core requires its private server/test bearer credential before body/provider work, returns401 on absent/wrong credentials, and accepts a valid non-browser caller without an Origin. Next retains strict web Origin/Host403 policy, supplies its own server-held credential and drops arbitrary browser Authorization before delegation. Test both paths with no real credentials/providers; redact secret fields. Do not replace core identity with a permissive browser allowlist.
- Tasks3–6 and primary grid/worker/replica experiments call the actual Fastify orchestrator and real lookup. Headless segmentation/playback follows the chosen workload's declared client protocol; browser device work remains excluded. The separate web forwarding family uses the same core/profile/output/pacing and records added BFF cost and failure modes. An observed web cap cannot be presented as portable-core capacity.
- Task9 prices core, lookup and optional web resources independently. Direct telephony forecasts do not include Next.js on the critical path or charge a mandatory web BFF. Per-provider units, shared hosting overhead, actual quota constraints and unimplemented telephone/WebSocket/acoustic behavior remain separately labeled.

Task0 adds an architecture negative fixture: a source map with providers under Next.js and no core app must fail baseline verification even if its turn responses pass functional tests. Task2/5 web-path integration fixtures must show first SSE event before EOF, first valid PCM behavior where supported, client abort reaching the core, zero automatic replay, one core dispatch per delegated incoming request, and exactly the fixture-expected downstream operation set with no duplicated operation IDs. Legitimate model continuations, STT and multiple speech segments remain independently counted. Also exercise a slow-reading web client: verify bounded Next.js/core buffered bytes during response pressure, continued bounded collection, and eventual abort/upstream lease settlement. This is an offline integration fixture, not an added benchmark family. Forbid full-response buffering and direct Next.js provider calls. Task7 estimator/coverage tests require the new web-forwarding family and its own feasibility/topology/headroom controls; it cannot replace either Fastify grid.

### R2-F001: ordinary open arrivals finish their residence

The section8 open window now separates start cutoff, residual residence and request drain. Task6 exports `conversationCutoffs({startMs,residenceMs,drainMs,settlementMs})` from schedule.js, returning `{residenceEndMs,drainEndMs,settlementEndMs}`. Task7 records `newStartCutoffMs`, per-conversation residence cutoffs and the runner hard stop; k6 open scenarios use gracefulStop >=330seconds after the last permitted new start. With3min ramp+2min steady, a final accepted start gets180seconds residence plus120seconds drain plus30seconds settlement: maximum630seconds from experiment start, not450seconds.

```js
test('a final accepted conversation retains late turns after new starts stop', () => {
  const newStartCutoffMs=300000;
  const startMs=newStartCutoffMs-1;
  const cutoffs=conversationCutoffs({startMs,residenceMs:180000,
    drainMs:120000,settlementMs:30000});
  assert.equal(cutoffs.residenceEndMs,479999);
  assert.equal(cutoffs.drainEndMs,599999);
  assert.equal(cutoffs.settlementEndMs,629999);
  assert.ok(startMs+165000 < cutoffs.residenceEndMs); // late scheduled offer is retained
  assert.ok(startMs+165000 > newStartCutoffMs+150000); // old graceful cutoff was too early
});
```

Add a companion fake-clock integration test admitting that last conversation, emitting its late turn and a delayed final speech segment, then applying an actual route timeout or final safety stop. Preserve the scheduled offer/outcome/usage distinction: a route timeout is an ordinary failed turn; a real safety/budget stop is a stopped-run record with unfinished work, not silently deleted arrivals or a new cancellation-success label. Exact quote/maxDuration includes residual residence; the72-window row is now9.6–12.6hours, and tier/full expectations are updated.

### R2-F002: selected slow/tail profiles are scheduled work

Section8 now declares two endpoint allocations, three B1/B2/B3 types, named hypothetical slow2x/tail4x transformations, two offered-load points and three seeds. Its72 windows and twelve feasibility contexts are distinct from B5 faults and empirical replay. One preselected source tuple per fixture keeps the sensitivity scope finite; source choice, transformation and hypothetical status are versioned. Transform waits, not output bytes, tool IDs or text. Require the ordinary matching text/voice oracle and unchanged four-turn feasibility gate; retain infeasible cells without silently slowing pacing, shortening output or substituting a faster tuple. Missing empirical replay uses a labeled hypothetical source, not manufactured calibration.

Task7 tests that simulator capability alone cannot complete this family, and that deleting any required selected cell leaves coverage incomplete. It also reconciles the added12 topology series and84 infrastructure windows for slow/tail, and16 topology series/152 infrastructure windows for web forwarding, exactly once. Complete estimate now includes3084 maximum infrastructure windows and250 topology series before valid reuse. The amended total259.4167–1325.7333target-environment hours remains a conditional planning interval; the12-hour checkpoint and proposed160-hour stop policy are unchanged and cannot erase incomplete coverage.

The source architecture correction and subsequent plan revisions require the requested review chain before implementation; exact accepted bytes remain recorded in the archive. They do not authorize executing this larger campaign, buying infrastructure, spending the calibration allowance, or moving any story's lifecycle state.

## 11. XPR round 1 contract refinements

This section is normative for Tasks1,4,6,7,8,10. It resolves the exact interfaces and conditional inventory below; the unchanged spec, oracle thresholds, paid ceilings and migration prerequisite remain governing. These are implementation instructions and document checks, not executed tests or permission to run the campaign.

### Mixed feasibility and all-pair fallback (R1-F001)

`chooseReplayPacing({contexts,expectedContextIds,oneApproved})` requires the frozen canonical eight expected context IDs and consumes an array of `{id,pair,admissionMode,fourFeasible,twoFeasible}` records for all eight Tier1 replay contexts (four pairs times research/default admission). `triggered` is true if **any** four-turn load-one context fails. If triggered, schedule unchanged two-turn replay at **all four pairs in both admission modes**, independently gate each at19.2seconds, and retain every original four-turn result. A passing four-turn context retains its four-turn discovery/confirmation package and adds a two-turn package; a failing four-turn context replaces only its unexecutable package with the two-turn package. Missing results block the aggregate decision rather than becoming false/true defaults. Infeasible two-turn contexts request the separately agreed one-turn series or remain incomplete. `actions` returns one `{id,action,pacing,label}` per substitute context, and `additionalPackages` lists only contexts whose feasible four-turn packages remain. With no trigger, no substitute work is added.

The existing core inventory reserves one replay package per context. Let F be the number of four-turn failures. If F=0 the additional count is0; if F>=1 it is at most8-F, hence **seven additional packages maximum**. Each adds one discovery series0.5–1.6h plus confirmation/candidate/soak2–17h: conditional0–130.2h. This is additional work even when all contexts eventually pass two-turn feasibility. A two-turn failure consumes attempted time but never earns a completed package. The same unique window ID cannot be charged as both replacement and addition.

Each additional package can require12 discovery plus16 confirmation/soak headroom proofs:7*28=196 additional windows, conditional0–6.5333h (two minutes maximum each). The original eight fallback topology series already cover all substitute contexts; no duplicate topology series is added. Existing fallback feasibility remains0–22.2h. Thus T1 maxima become core432.2h, controls75.4h, total507.6h; whole-campaign maxima become core853.8h, controls471.9333h, total1325.7333h. Lower bounds remain unchanged. Base proof counts520/1192/1176 become maximum716/1192/1176, total3084, with250 topology series. The exact estimator freezes F and attempted/reused windows before launch; these are conservative conditional maxima, not expected runtime. The12-hour checkpoint and160-hour stop still produce partial reports if exhausted.

Task6 tests include eight mixed contexts, with only the smallest research pair failing four-turn: fallback actions cover all eight, the seven feasible four-turn packages remain, and exactly seven additions appear. Also test no failures (zero additions), all failures (zero additions, eight replacements), unknown feasibility (blocked), and two-turn failure (no success manufactured). Task7 tests use these fixtures to reconcile package/proof IDs, no double charging, unchanged250 topology series and the revised tier/full envelope. The one-context examples above call only mapReplayContext, which cannot authorize a campaign. Full campaign execution calls chooseReplayPacing with the canonical eight expected IDs, rejects incomplete/duplicate/unexpected inputs, and applies the aggregate trigger; section12 defines the exact separation and refusal tests.

### Deployed protection targets and preflight settlement (R1-F002)

The full18-request proof remains mandatory before every declared series. “Actual-path topology protection” means the real deployed balancer/container/network path for each entry being tested, rather than asserting that every entry lies on the measured workload path.

| Family | Measured topology | Auxiliary protection targets |
| --- | --- | --- |
| F1 lookup isolation | Generator → independently constrained lookup | A reference core, web BFF and web balancer on helper infrastructure; core uses the actual lookup under test and the declared simulators |
| Direct core and lookup-constrained M1 | Generator → core → lookup/providers, with only the named service constrained | Web BFF/balancer on helper infrastructure; they delegate to the same measured core for preflight only |
| Workers/replicas | Generator → declared core deployment/balancer → lookup/providers | Helper-host web BFF delegates through the actual declared core balancer; record per-instance routing and admission |
| Web-forwarding comparison | Both matched direct entry and web BFF → same core → lookup/providers | The measured BFF runs on independently provisioned helper infrastructure with fixed1CPU/2GiB in its own cgroup, outside the target host; record its actual network hop and charge its helper lifetime once; no second web implementation is substituted |

An auxiliary web BFF always has fixed1CPU/2GiB and an F1 auxiliary core fixed1CPU/2GiB, in separate cgroups on an independently provisioned helper host. Auxiliary balancer resources are fixed, finite and recorded by Task0. They never share the constrained target's quota or silently consume reserved target-host CPU/RAM. Their effective allocations, process/image/source/configuration, placement and helper-host lifetime enter the baseline/manifests/quote. If a helper cannot supply these resources plus validated generator/simulator/collector headroom, expand the concrete quote or stop; do not place them unaccounted on the target. The web path is absent from primary measured direct-core traffic; an off-target protection service does not make it part of that traffic.

Before warmup, tag all18 requests with a separate preflight run/phase and journal their offered/completed/refused/provider operations and bytes. Valid delegated/direct requests may create genuine mock work; await complete stream/audio/upstream/lease/queue settlement and flush collection within the existing30–120second preflight bound. Verify zero active/settling leases and no outstanding fixture work, then reset measurement counters and begin the separately recorded warmup. Failure or expiration blocks the series. Do not erase preflight evidence or insert its traffic into ordinary measured offers; it belongs to a separate denominator and usage ledger. Preflight-induced warm connections are declared; cold-start experiments reset them explicitly. Fail-closed mock egress applies to auxiliary services too.

Target-environment intervals already include these protection windows; they are not charged again. Auxiliary container CPU/GiB-hours and actual helper-host lifetimes are additional dimensions of the existing host quote, charged once by lifetime, including startup/settlement, with no assumed hosting price. Task7 topology tests verify each family, auxiliary cgroups/placement, rejection of shared constrained budgets, incomplete-settlement refusal, and separate preflight versus measured offered-work counts.

### Funded coherent calibration tuples (R1-F003)

Task4's **primary paid casebook** is five coherent end-to-end replicates of each of the four ordinary fixtures. For each replicate, preserve the actual STT (where applicable), model rounds/tool continuation, stable text segmentation and every TTS operation as one parent case with ordered operation IDs. A tuple is the complete observed case, with operation offsets/durations/bytes and output relationships; do not independently splice provider medians or pair unrelated runs. B1/B2/short B3 require exactly one eligible segment and multi-segment B3 exactly two, all within the actual effective cap (default84characters). Task0/fixtures must demonstrate these bounded shapes; a case that exceeds them fails support and is retained, rather than spending on undeclared extra calls. Freeze replay fixture expected text/tool/audio shape from these supported observations before mock execution; this does not turn real model output into a preclaimed correctness result.

| Provider | B1 five cases | B2 five cases | B3 short five cases | B3 multi five cases | Maximum primary requests |
| --- | --- | --- | --- | --- | --- |
| Model |5 initial |5 initial+5 continuation |5 initial |5 initial |25 |
| STT |0 |0 |5 prerecorded |5 prerecorded |10 |
| TTS |5 actual single segments |5 actual single segments |5 actual single segments |10 actual two segments |25 |

These five replicates supply target K=5 complete tuples per fixture. They are the selected funded use-case cells and their five repetitions; no extra warmup is required. Connection-cold/reused labels characterize operations within these same cases, never extra requests; concurrency remains1. A provider metadata/model-validation request, if required, has its own pre-reserved request and dollar entry and must fit the remaining five model/TTS or twenty STT slots; unknown requirements block the quote. Paid failures/cancellations count within the totals and remain charged/uncertain; no automatic retry or replacement is permitted. If even one fixture lacks five supported complete cases, empirical replay coverage is unavailable/incomplete for that fixture; preserve every chronological sample and do not search for a favorable replacement. Mock work may use a labeled hypothetical profile, which cannot complete empirical requirements.

The provider-characterization short/lookup/long,2/5/15second and40/120/300character examples in Task4 are **candidate secondary cells**, not another funded Cartesian casebook. Existing matching coherent observations can supply descriptive characterization without a second charge. No standalone120/300character sample is used as an in-cap speech tuple. Priority is: (1) required metadata and all four coherent fixture cells with five repetitions, (2) retain the unspent request/spend margin, (3) any additional longer-context, standalone speech, cold/reuse or concurrency-three characterization only after a separately approved revised casebook/quote, still within unchanged aggregate/provider ceilings. Secondary cells are omitted first. This plan does not silently lower funded repetitions or drop a mandatory fixture to fit optional characterization.

Before **any** paid operation, `quoteCalibration` computes the conservative maximum for the entire primary casebook from dated per-operation unit/rate/minimum/cache/reasoning/tool bounds, required metadata and existing unresolved reservations. It must prove each provider count<=30 and sum(maxCostUsd)<=the owner-agreed ceiling<=USD10. A proposed allocation is model<=USD6, STT<=USD1, TTS<=USD3; these are reservation ceilings, not asserted prices, and the exact funded quote must fit each before starting. Unknown prices/bounds, extra rounds/segments, missing funding or a sum above the ceiling return `unfunded-casebook` and dispatch zero paid requests. No rate or dollar sufficiency is invented in this plan. If the complete five-replicate primary casebook cannot be funded, empirical calibration is explicitly unavailable until a separately agreed concrete casebook meets the same specification; it is not attempted until the budget runs out. Task4 fake-client tests cover totals25/10/25, metadata consumption, zero optional requests, out-of-cap segments, coherent case provenance, failed-case retention and unfunded/unknown-rate refusal before the first call. The immutable funded allocation and K are inputs to the exact campaign quote before Task10, not discovered from leftover balance.

### Versioned outcome and speech correlation records (R1-F004)

The section2 v1 declarations are extended additively with required fields in the authoritative JSON schema before any record is produced. `Outcome` remains the aggregate result union. Every TurnRecord additionally requires:

```ts
inputMode: 'typed'|'audio';
outputMode: 'enabled'|'muted';
oracleId: string; // frozen fixture/version and matching text/voice policy
requestId: string|null; // null only for an offer never dispatched
offerClassification: 'admitted'|'busy-schedule-miss'|'admission-rejected'|
  'generator-dropped'|'not-started';
reason: string|null; // bounded fixed code; required non-null for any non-success
speech: SpeechRequestRecord[];
```

A `busy-schedule-miss` is `outcome:'failed'`, `startedAtMs:null`, `requestId:null` with reason `busy-prior-generation`; it stays in the offered denominator and creates no service-latency sample. At load-one it makes the workload/profile infeasible; after a passing load-one gate it is a failed higher-load offer. Unknown classes/missing reasons or mismatched admission/start/request fields are rejected. Explicit input/output/oracle fields, not profile-name parsing, define analysis strata.

```ts
type SpeechRequestRecord = {
  schema:'aivc.perf.speech/v1'; runId:string; sessionId:string; turnId:string;
  generation:number; segmentId:string; requestId:string;
  oracleId:string; inputMode:'typed'|'audio'; outputMode:'enabled';
  intendedInitiationMs:number; actualInitiationMs:number|null;
  firstValidPcmMs:number|null; deliveryCompleteMs:number|null;
  bytes:number; validSamples:number; outcome:Outcome; reason:string|null;
  serverRequestFirstAudioMs:number|null; // request-local server duration only
};
```

All client offsets share the parent turn's client clock/origin; nullable milestones require a bounded unavailable/failure reason, never a zero placeholder. The server duration is a separately named measurement, never subtracted from client timestamps. IDs join per-segment server records and remain out of metric labels. Segment IDs/order are unique within generation; intended but undispatched speech retains its declared request ID and null actual milestones. Required versus delivered counts must reconcile to fixture expectations and the segment records; missing, duplicated or stale segments cannot pass. Muted turns require an empty speech array and text oracle.

Tasks1/6/8 consume these shapes directly. Add round-trip schema tests for an undispatched busy miss, muted typed B2 and enabled typed M1 B2 sharing a type, audio B3, and delayed second speech after SSE. Reject missing modes/oracle/correlation, duplicate segment/request IDs and invalid clocks. Screening tests show busy misses never enter admitted latency histograms, yet fail the ordinary offered-work screen; missing second speech remains voice failure.

### Optional test and wording improvements (R1-F005–R1-F008)

The execution recommendation consistently favors native inline execution through executing-plans, while retaining the owner's choice. Lookup-constrained labels distinguish the two Fastify services; the archive identifies exact review decisions instead of time-sensitive artifact status claims.

Task3's tuple test also asserts equal same-seed/case results and deep equality with the immutable source tuple after selection; repeat with multiple declared seeds/cases to catch mutated samples. Task0's exec mock supplies `git rev-parse HEAD` as the expected head as well as `git ls-files`, and explicit tracked-byte reads, so it does not impose call order. Task2's early header assertions use `?? ''` and accept an absent header while forbidding future values.

Task2/7 collect balancer/infrastructure-generated502/503 responses, resets and early failures that bypass application timing. Preserve generator request/offer correlation, infrastructure status/reset reason and missing application-span reason; never synthesize Server-Timing. Task8 counts these as failed offered work (or the declared fault-oracle result), separately labels attribution unavailable where necessary, and cannot silently drop them as missing telemetry. A negative fixture injects a balancer503 before core dispatch and a connection reset mid-stream, proving failed denominator accounting, zero duplicated dispatch and preserved usage/settlement evidence.

## 12. Owner-directed resolution of the four remaining XPR observations

On October 15, 2026 the owner instructed addressing R2-F001–R2-F004 before implementation. This section and the affected interfaces/table entries above govern the corresponding Tasks0,4,6,7,9,10. The accepted XPR identifies predecessor plan commit `8109522128c13412f8333d0029d5382011a3feb3`, SHA-256 `4e9f4e00b671e461e0a66951246441bf29e2ed5a0939fd58bfd4be10f8a6b018`. This is a subsequent owner-directed amendment, not a newly sealed peer-review acceptance. Preserve the original reports, manifest and their bytes. The governing corrected specification, three-service architecture, campaign inventory, resource allocations, deadlines, empirical thresholds and spend/time ceilings are unchanged. No implementation or paid execution is authorized by this amendment.

### R2-F001: measured web BFF placement is part of the experiment contract

Both the auxiliary protection BFF and the measured BFF in forwarding comparisons run on independently provisioned **helper infrastructure**, each with the declared fixed 1 CPU/2 GiB allocation in a separate recorded cgroup. The measured BFF never runs on the constrained orchestrator target host and never consumes its dedicated CPU/memory entitlement. It may reuse the same web deployment used for protection only when source/configuration/allocation match, all preflight work has settled, and its role/phase is recorded; charge its actual helper lifetime once. These are placement and isolation requirements, not extra application instances or benchmark cells.

Task0's inventory/host quote and Task7's topology/run manifest explicitly record the measured BFF host ID and helper role, cgroup/effective quota/cpuset, source/image/config hashes, process count, network interface/route and actual helper-to-core hop. Record generator-to-BFF and BFF-to-core hop differences in the matched direct/web results; they are part of observed forwarding overhead. Do not subtract an assumed network latency or present co-located results as this topology. Helper provisioning must honor the BFF entitlement plus independently demonstrated generator/simulator/collector headroom; a shared helper label alone is not isolation proof. Missing helper capacity blocks the comparison or requires a revised concrete hosting quote, never an unreported move onto the target host.

Task7 topology tests reject a measured BFF with target-host placement, missing effective allocation/hop evidence, overlapping constrained CPU entitlement, or insufficient helper headroom. The quote charges the existing BFF/helper lifetime and allocation, without adding a second copy when roles are reused legitimately. This clarification adds no campaign window or provider operation.

### R2-F002: subset mapping cannot authorize a partial campaign

`mapReplayContext({context,oneApproved})` is a pure action mapper for one already-selected fallback context. It does not compute campaign-wide triggering, claim complete coverage or launch work. Its isolated tests may use the synthetic ID c1, as in Task6. It is not a runner entry point.

`chooseReplayPacing({contexts,expectedContextIds,oneApproved})` is the only campaign decision API. Task7 derives and freezes the canonical eight IDs from the four executive pairs crossed with research/default admission:

```text
research:1CPU-2GiB  default:1CPU-2GiB
research:2CPU-4GiB  default:2CPU-4GiB
research:3CPU-8GiB  default:3CPU-8GiB
research:4CPU-12GiB default:4CPU-12GiB
```

The expected-ID list must itself equal this canonical set, with no duplicate, omitted or unexpected ID; supplying a one-ID expected list cannot opt into subset execution. Context IDs, pair and admission mode must agree. Missing/duplicate/unexpected contexts or missing required feasibility results return `{status:'blocked',reasons:[<bounded codes>],triggered:null,actions:[],additionalPackages:[]}` before any capacity-series launch. A complete valid decision returns status ready, with the existing any-failure trigger, all-eight two-turn coverage and replacement/addition accounting. Two-turn results may be pending only when no four-turn failure requires a substitute; once triggered, all required substitute feasibility results must be present to authorize its work. The separately agreed one-turn path remains unchanged.

Add these cases to Task6's schedule tests, alongside the existing complete mixed/no-failure/all-failure cases:

```js
test('campaign refuses partial contexts even with successful subset mapping', () => {
  const pairs=['1CPU-2GiB','2CPU-4GiB','3CPU-8GiB','4CPU-12GiB'];
  const expectedContextIds=pairs.flatMap(pair=>['research','default'].map(mode=>`${mode}:${pair}`));
  const contexts=[{id:'research:1CPU-2GiB',pair:'1CPU-2GiB',admissionMode:'research',
    fourFeasible:false,twoFeasible:true}];
  const result=chooseReplayPacing({contexts,expectedContextIds,oneApproved:false});
  assert.equal(result.status,'blocked');
  assert.equal(result.triggered,null);
  assert.deepEqual(result.actions,[]);
  assert.deepEqual(result.additionalPackages,[]);
  assert.equal(chooseReplayPacing({contexts,expectedContextIds:[contexts[0].id],
    oneApproved:false}).status,'blocked');
});
```

This test imports chooseReplayPacing in addition to the pure mapper from shared/schedule.js. Add duplicate-ID, wrong pair/mode, unexpected-ID and unknown-feasibility fixtures. Task7 proves blocked decisions dispatch no experiments and cannot mark coverage complete. No partial-input option exists on the production campaign API; no budget or experiment count changes.

### R2-F003: deferred calibration cells remain visible in evidence and reporting

Task4's immutable calibration manifest requires a `secondaryCells` catalog even when no secondary calls are funded. Each entry records `cellId`, provider/input settings, `status`, `reasonCode`, human-readable reason, `sampleCount` and `observationIds`. At minimum include model-long-context, stt-15s, tts-120chars, tts-300chars, model-concurrency-3, stt-concurrency-3 and tts-concurrency-3. List any other secondary casebook candidate under the same rule; never silently omit a declared case.

For an unfunded/unperformed entry use status unavailable, reasonCode `not-funded-primary-casebook`, reason `not funded in primary casebook`, sampleCount 0 and an empty observation-ID array. This is explicit unavailable evidence, not a failed provider call, measured zero latency, included billable request or successful sample. If existing primary observations genuinely match a secondary cell's complete settings, it may instead be labeled observed-via-primary with exact source IDs and actual sample count; this creates no extra request and cannot imply an untested duration, character length or concurrency. Missing/mismatched provenance blocks that label. Additional standalone calls still require the already specified separate funded casebook/quote and must fit unchanged limits.

Task9's report reproduces every catalog entry in its external-service limitations/coverage table, with exact settings, actual counts, status and reason; unavailable rows have no fabricated percentile/cost measurement. Task1/4 schema/ledger tests reject a missing mandatory catalog ID, nonzero sample count for unavailable entries, or an observed-via-primary claim without matching source IDs/settings. Task9 report tests verify all seven initially unfunded entries appear as unavailable and cannot disappear when no raw sample exists. This records omissions honestly without adding calibration spending, reruns or campaign work.

### R2-F004: bounded calibration output with explicit unsupported-shape handling

Task4 records a calibration-only `modelSettings` profile before quoting or dispatch: exact fixture prompt/template version and hash, model ID, supported SDK maximum-output-token setting for each model round, effective speech segment cap and expected segment count. Use the actual frozen segmenter; do not change speech policy to fit a response. At the default CPS14, the segment cap is 84 characters; prompts use the actual computed cap if the accepted baseline differs.

The initial bounded profiles are:

| Fixture/round | Prompt instruction added to its synthetic use-case prompt | Maximum output tokens |
| --- | --- | --- |
| B1 or short B3 final answer | Return only one concise plain-text sentence, within the effective segment-character cap; no Markdown or preamble | 48 |
| B2 initial tool decision | Perform the required project lookup with the declared native tool; after its result, return only one concise final sentence within the effective segment-character cap | 128 for the native tool-decision round |
| B2 final answer after its one lookup continuation | Use the actual lookup result and return the one concise plain-text sentence within the effective cap | 48 |
| Multi-segment B3 final answer | Return exactly two concise plain-text sentences, each within the effective cap, with a combined length greater than one cap and no greater than two caps; no Markdown or preamble | 96 |

All caps are below the reference 1024-token per-round ceiling, affect only the explicitly recorded calibration profile, and do not alter default application/model settings. Task0/4 must verify that the real selected core adapter/SDK can express and honor each recorded request setting; if it cannot, record a calibration prerequisite and dispatch zero paid calls rather than silently using the default or bypassing the core. Preserve the real B2 tool result/continuation and normal model/STT/TTS pipeline. A token ceiling and prompt are guards, not guarantees of character count, sentence structure or actual segment count.

Validate each actual stable-text segment before any TTS dispatch: its length must fit the effective cap and its ordinal must not exceed the fixture's expected one or two segments. Never send an extra/out-of-cap segment to TTS. When a violation is discovered, stop further TTS dispatch, retain any already completed/in-flight model or allowed speech operation and its billable/uncertain reservation, follow normal cancellation settlement, and mark the coherent calibration case unsupported with a bounded shape reason. A final token-limit/truncated answer, too few segments, extra segments or malformed/incomplete tool continuation is also unsupported. Preserve actual output/usage provenance; do not silently clip text, invent completion, count partial speech as a supported tuple, or retry to replace the failed sample. The original request/spend ceilings and the requirement for complete supported cases remain unchanged.

Task4's fake-client calibration tests cover a token-limited/truncated answer, a segment exceeding the cap, a third segment on the two-segment fixture, a missing second segment, and an incomplete B2 tool block. Assert unsupported case status, zero TTS dispatch for invalid/extra segments, no new provider retry, and retention of already incurred/uncertain cost. Capture the exact prompt/token settings in the manifest and replay provenance; they must not be implied to characterize unconstrained long-answer latency. These are offline tests added to existing owning tasks, not new paid samples or benchmark families.

## 13. Three stateless service containers and measured sizing

The owner's October15 clarification and governing spec section19 require Next.js UI/thin BFF, Fastify orchestrator and Fastify lookup in separate, stateless service containers. Each has independent startup/image configuration, health/readiness, resource limits and replica controls. Kubernetes, if later selected, uses separate service Deployments/pods so adding orchestrator instances does not duplicate Next.js/lookup. No Kubernetes cluster or production deployment is created by this research. Separate containers may share physical infrastructure only under the existing placement/headroom rules; this does not relax section12's measured-BFF helper placement.

**Task0 prerequisite:** Verify that the accepted integrated migration demonstrates all three separate service deployments and the stateless contract: no correctness dependency on writable container files, local session/history storage or a particular replica across independent requests. Record how request-carried history/identifiers or an explicitly declared shared mechanism supports later turn/speech requests, generation validity, cancellation and duplicate-operation prevention where applicable. Immutable lookup data/configuration must be versioned consistently. Any required stateful dependency is external to these service containers and included in topology, headroom and cost evidence; this plan selects no new datastore. An absent or merely asserted contract blocks research application work, rather than authorizing the harness to implement it.

**Transient ownership:** A live stream, bounded buffers, provider work and unsettled leases remain owned by the handling process. Preserve existing per-process admission and settlement semantics, and record the aggregate allowance across replicas. Statelessness does not migrate an established stream or justify releasing/replaying unfinished paid work after failure. Graceful drain and interrupted-stream outcomes remain explicit. Affinity cannot be the sole mechanism making otherwise independent later requests correct.

**Tasks1/7:** Record each service's container/image ID, instances, cgroup/effective allocation, process count, placement and read-only data version. Include the accepted state/coordination mechanism and evidence references. Start with one container per service; existing two/four-instance comparisons scale only the orchestrator, with peer budgets fixed and proven nonbinding. Use existing functional topology/replica controls to verify independent startup/scaling, routing later requests of the same declared conversation to different replicas with correct text/speech/cancellation behavior, and actual drain/interruption outcomes. Required app support belongs to the prior migration; do not fabricate it in a test client. These are contract checks within existing owning tasks, not extra load campaign families or paid samples.

**Tasks7–9 sizing/report:** Tune each service from measured CPU/throttling, event-loop delay, RSS/heap, open connections/buffered bytes, latency and offered/admitted/completed work. Preserve fixed resources throughout a run; resizing a peer creates a new declared configuration and requires renewed headroom evidence. A binding lookup or web BFF is reported as that layer's limit; do not lower the claimed isolated orchestrator capacity or silently resize mid-plateau. Use the existing resource/process/replica, lookup-attribution and bounded web families; add no new sweep. Report recommended starting resources and replica counts as measured recommendations with service/shared-dependency cost, contention, memory/pool duplication and external quota limits. Adding orchestrator replicas increases eligible concurrent local work only to the next demonstrated bottleneck; it does not shorten one external inference/STT/TTS operation.

This owner-directed document amendment follows the plan revisions `1dcb41e` and `bdebb11`; sealed reviews retain their original artifact references. The new spec/plan bytes have not been re-reviewed. Campaign inventory, thresholds, proposed spending/time ceilings and the prohibition on unapproved implementation/paid execution remain unchanged.
