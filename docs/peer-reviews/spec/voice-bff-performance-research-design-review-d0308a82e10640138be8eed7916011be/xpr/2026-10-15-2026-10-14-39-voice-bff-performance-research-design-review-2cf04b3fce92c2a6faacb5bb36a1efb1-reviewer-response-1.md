> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/b612108309811663ffad1e04ba2005621c68ea5f/docs/peer-reviews/spec/voice-bff-performance-research-design-review-d0308a82e10640138be8eed7916011be/xpr/2026-10-15-2026-10-14-39-voice-bff-performance-research-design-review-2cf04b3fce92c2a6faacb5bb36a1efb1-reviewer-response-1.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-16-39-originals.json).
> Original SHA-256: `d7a05aa89266c09f754628940e57456c10ce2e517eae69c6b7e4f8ae55a7367c`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-2cf04b3fce92c2a6faacb5bb36a1efb1'
role: 'reviewer'
turn: 1
commit_mode: 'normal'
authority_assurance: 'unavailable'
artifact_path: 'docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md'
artifact_commit: '07301c9c720a199850d0e8720316940575ddd1ae'
artifact_blob: '8c0099734220fc899fb9a70d7843df2ad7a9c18f'
artifact_digest: 'sha256:28a34d9d29bdfcc3effd59e8c85231073316cb25b3725dc353c34255aaca1438'
agent:
  host: 'claude-code'
  provider: 'anthropic'
  model_id: 'claude-opus-5-5'
  model_display: 'claude-opus-5-5'
  session_fingerprint: 'sha256:fa258c7fab72affedc1cbbed003c94c72e90757978a36794cea76dfb997ec052'
  identity_source: 'runtime'
started_at: '2026-10-15T05:00:22.224Z'
submitted_at: '2026-10-15T05:04:13.312Z'
finding_ids:
  [
    'R1-F001',
    'R1-F002',
    'R1-F003',
    'R1-F004',
    'R1-F005',
    'R1-F006',
    'R1-F007',
    'R1-F008',
    'R1-F009',
  ]
answered_finding_ids: []
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

Independent XPR of `docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md` (418 lines, artifact digest as sealed in this response's frontmatter), read in full together with the governing reference design `docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md` (architecture, `/api/turn` and `/api/speech` contracts, typed-path speech, speech backpressure, origin/host admission, loopback hosting, search configuration, deadlines, and the two-turn/two-speech admission limit) and the retained native SAR chain (request, both Astra reports, author dispositions, loop summary). The SAR findings R1–R4 and O1–O2 are not re-raised; their closures were spot-checked against section 16 and hold.

The specification is strong. It measures the real Next.js BFF boundary, isolates Fastify without relabeling lookup RPS as call capacity, keeps paid calibration tightly bounded with pre-reservation, refuses to fabricate streaming header timings, fails closed on paid egress, separates text/voice/cancellation outcomes, and guards against pooled percentiles and sparse-run reliability claims. Those are the hard parts and they are done well.

The remaining problems arise where the research workload meets concrete reference-application constants that the specification does not reconcile. Using reference values (two active turns and two active speech requests per process; typed answers spoken automatically; 84-character ≈ 6-second segments with sequential, playback-gated synthesis; loopback-only binding with a localhost Host/Origin allowlist), I found five issues that would let two conforming implementation plans produce materially different, or structurally failing, capacity results:

1. The admission setting that governs the primary matrix and the process/instance comparisons is undefined, and per-process admission multiplies with process count, which confounds the scaling-efficiency metric.
2. The fixed submission schedule in 16.4 is shorter than the ordinary voice-turn occupancy implied by the reference speech policy. Busy-schedule-misses would therefore occur at zero load and fail the 99.9% screen by construction, especially at eight turns per minute.
3. M1 does not say whether typed B1/B2 turns request speech, although the reference typed path speaks automatically, or whether the mix is assigned per turn or per conversation.
4. The containerized, multi-host topology conflicts with the reference's loopback-only binding and localhost Origin/Host allowlists. The permitted research deviation is not declared.
5. Section 10 does not say which steps of the discovery procedure apply to every resource cell, and the mandatory matrix has no effort estimate or decision-priority tiering, so the work could run to hundreds of machine-hours.

Four optional suggestions follow. No benchmark, k6 build, paid request, Git command, or artifact edit was performed. The reviewer could not independently hash the artifact (shell hashing was not permitted in this session) and relies on the package-sealed digest.

## Findings

### R1-F001 — Define the admission configuration for the primary matrix and normalize it across process and instance comparisons

**Evidence.** Reference line 259 limits the application to "two active turn requests and two active speech requests per local process", with HTTP 429 beyond that and no automatic retry. Artifact line 259 says "Preserve a default-admission control, then use explicit mock-only research admission settings to find the hardware curve", and calls the semaphore one possible first binding limit. Line 249 counts admission rejects as failures in the 99.9% denominator. Lines 112–116 compare one process against two or four workers and against two or four instances. Line 269 defines scaling efficiency as `C(n) / (n * C(1))`.

**Problem.** The specification never states:

- which admission setting governs the 16-cell matrix, the executive table, and the published operating point;
- what form the "research admission settings" take (removed, raised to a fixed N, or swept);
- whether limits are per process or aggregate in worker and instance comparisons.

With the reference default, each process admits at most two concurrent turns and two concurrent speech requests. At four turns per minute, with turns lasting several seconds plus speech, the 429 ceiling is reached at a handful of sessions on any CPU/RAM cell. Every cell then shows roughly the same capacity, set by configuration, not hardware. Conversely, a two-worker or four-instance deployment silently gains 2× or 4× admission slots. `C(n) / (n * C(1))` would then approach 1.0 because the semaphore multiplied, not because CPU parallelism helped. An unbounded research setting has the opposite problem: it removes the overload behavior (fast 429s) that the reference relies on, and it changes queueing and memory behavior at the boundary.

Both outcomes are legitimate measurements, but they answer different VP questions (section 1, Q1 and Q3). An implementation plan could pick either and still conform.

**Consequence.** The headline capacity-versus-CPU and scaling-efficiency results become artifacts of an unstated admission choice. Cost per supported concurrent session (section 12) inherits the error.

**Required revision.**

- Name the admission configuration used for the primary 16-cell sweep and for the published operating point. A defensible choice: the primary hardware curve uses a declared research limit high enough not to bind, verified by observing zero or near-zero 429s below the boundary. A separate default-admission series at the four paired executive configurations shows the shipped-configuration ceiling.
- State that admission limits in worker and instance comparisons are recorded both per process and as an aggregate, and that a scaling-efficiency figure is published only when aggregate admission is non-binding in both the 1× and n× runs, or is explicitly held equal.
- State that any capacity result in which admission rejects are the first binding limit is labeled admission-bound rather than hardware-bound.
- Require the manifest to carry turn and speech admission limits per process.

**Closure condition.** A reader can tell, for every published capacity and every scaling-efficiency number, whether admission or hardware bound it. Adding processes cannot inflate scaling efficiency merely by multiplying semaphore slots.

### R1-F002 — The fixed submission schedule is shorter than ordinary voice-turn occupancy, so busy-schedule-misses occur at zero load

**Evidence.** Artifact line 396 schedules turns at `phase + 15*k` seconds with ±1.5-second jitter. At two and eight turns per minute it uses 30- and 7.5-second intervals with ±10% jitter. Line 398 forbids a turn from overlapping "unsettled prior answer, required speech delivery, or virtual playback" and counts any overlap as a `busy-schedule-miss`, which is a failed offer. Line 374 requires at least one ordinary B3 fixture whose speech continues after SSE completion. The reference (lines 158, 202, 206, 212) prompts for "a few sentences", segments speech at about 84 characters (≈ 6 seconds), synthesizes segments sequentially, and starts the next segment only when outstanding audio is at or below 2 seconds. Ordinary voice-turn occupancy therefore spans: time to first audio (STT plus model plus segmentation), plus nearly the full answer audio duration of virtual playback.

**Arithmetic.**

- **Four turns per minute:** the minimum gap between consecutive intended submissions is 15 − 1.5 − 1.5 = 12 seconds. A three-sentence answer of about 220 characters at 14 characters per second is about 16 seconds of audio before any STT or model time, which already exceeds 12 seconds.
- **Eight turns per minute:** the minimum gap is 7.5 × 0.8 = 6 seconds, so any ordinary voice turn with more than one segment cannot fit.
- **Consequence for M1:** the 30% B3 share, plus typed turns if they speak (see R1-F003), produces busy-schedule-misses at load one. Line 249 requires ≥ 99.9% success, so the low-load baseline itself fails.

**Problem.** Section 16.4 correctly prevents completion-coupled pacing from hiding offered demand. However, it pairs that rule with intervals that are infeasible for the fixtures the specification also requires. The result measures fixture length, not system capacity. It is also unrealistic: a caller does not begin the next utterance a fixed 15 seconds after the previous one regardless of how long the assistant spoke, and the cycle also omits the user's own utterance duration (2–15 seconds per line 136).

**Consequence.** Every M1 voice capacity point either fails at baseline or forces the plan to choose ultra-short fixtures silently. The second option contradicts the mandatory multi-segment fixture and undercounts speech cost. The sweep at eight turns per minute is structurally invalid for voice.

**Required revision.** Choose and state one of the following.

- **(a)** Keep the fixed schedule, but require a low-load feasibility precondition. For each workload, profile, and pacing combination, the maximum ordinary-turn occupancy at load one (submission to virtual playback completion), plus a declared margin, must fit within the minimum intended gap. Otherwise that cell is reported infeasible-by-workload rather than as a capacity failure. Constrain ordinary M1 voice fixtures, including the required multi-segment case, so they satisfy the precondition at four turns per minute.
- **(b)** Define the voice-session cycle as an open schedule of "user think time after the prior turn's virtual playback completes, plus utterance duration". Then measure offered-demand suppression separately through the open new-conversation scenario, which already prevents coordinated omission at the conversation level.

In either case:

- state that busy-schedule-misses observed at the load-one baseline invalidate the cell's screening threshold rather than counting against capacity;
- report achieved turns per minute against nominal;
- make the treatment of the eight-turns-per-minute voice sweep explicit.

**Closure condition.** At load one, a conforming M1 or B3 run with the mandatory fixtures can meet the outcome screen. A busy-schedule-miss then indicates system slowdown, not a schedule shorter than the fixture's own playback.

### R1-F003 — M1 does not define whether typed turns request speech, or whether the mix is assigned per turn or per conversation

**Evidence.** Reference line 91: "The typed path invokes the same BFF turn capability and speaks the response automatically when output is enabled." Artifact line 213 describes B1 and B2 as typed answers with no speech mention, while line 214 says B3 includes speech. Line 219 sets the M1 mix (40% B1, 30% B2, 30% B3) and says "B3 includes all required speech requests". Line 372 refers to "ordinary B3 and voice-bearing M1 turns", which implies that some non-B3 M1 turns may be voice-bearing. Line 221 treats each virtual conversation as owning one speech scheduler.

**Problem.** Whether the 70% typed share of M1 requests speech changes:

- `/api/speech` request volume by up to about 3.3×;
- TTS characters and cost;
- speech-admission pressure (see R1-F001);
- session occupancy and busy-schedule-miss rate (see R1-F002);
- which oracle (text-only or voice) judges those turns.

It is also unstated whether each conversation is homogeneous (a typed session or a voice session) or each turn draws independently from the mix. That choice affects history composition (STT transcripts versus typed text), per-session occupancy variance, and the meaning of "concurrent voice sessions" in the VP report.

**Consequence.** Two plans could both conform yet differ by a large factor in speech load and cost per M1 turn. The headline "concurrent conversation sessions" number would not be comparable across them.

**Required revision.**

- State whether typed M1 turns are output-enabled, meaning they request speech and are judged by the voice oracle, or output-muted, meaning text oracle only. If muted, note that this departs from the reference's default typed behavior, and consider an output-enabled typed variant as a labeled sensitivity cell.
- State whether the M1 mix is drawn per turn within one conversation or per conversation type, and record the realized per-turn and per-session composition in the manifest.
- Define "voice-bearing M1 turn" explicitly.

**Closure condition.** Speech request volume, TTS cost, and the applicable oracle per M1 turn are determined by the specification, not by harness choice.

### R1-F004 — Declare the permitted research network and admission configuration, given the reference's loopback-only hosting

**Evidence.** Reference lines 166 and 255 say "Bind only to loopback" and "Use loopback hosting for the reference app". Its admission default is `BFF_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000`, `BFF_ALLOWED_HOSTS=localhost:3000,127.0.0.1:3000`, and `RETRIEVAL_BASE_URL=http://127.0.0.1:3001`. Its admission check requires the Origin host and port to match the request Host and never infers origin from forwarded headers. Artifact lines 83–89 require separate cgroups per service, separate budgets for generators, simulators, and collectors, and separate hosts preferred for publication runs. Line 120 requires a declared balancer for instance comparisons. Line 190 says trace propagation must not weaken Origin/Host admission. Line 207 requires a "permitted Origin/Host".

**Problem.** A k6 generator on another host, or in another container network namespace, cannot reach a BFF bound only to loopback. A BFF in its own container cannot reach Fastify at `127.0.0.1:3001` unless the two share a network namespace. Sharing one is possible with separate cgroups, but the specification neither permits nor constrains it. A balancer in front of n instances must preserve or rewrite Host, and the Origin/Host equality rule then needs a deliberate allowlist entry for the balancer's address. The specification does not say:

- which bind addresses, allowlist entries, Host and Origin values, and balancer header policy are permitted;
- whether those choices count as a declared configuration deviation from the reference;
- how the plan proves that the deviation leaves admission semantics intact (fail-closed for disallowed, null, or mismatched Origin and Host).

The specification forbids lookalikes and silent changes (lines 27 and 29), so this omission will force an undeclared choice during implementation.

**Consequence.** One plan could run everything on host-network loopback, collapsing the isolation requirements. Another could widen allowlists or trust forwarded headers to make the balancer work, weakening admission and changing the measured request path. Neither choice is visible in results.

**Required revision.**

- Add a short topology-deviation clause. The research may bind services to a declared private test-network address, with explicit allowlist entries for the generator and balancer origin and host. No wildcards and no forwarded-header trust are allowed.
- Require Host preservation at the balancer, or an explicit allowlisted balancer Host.
- Require `RETRIEVAL_BASE_URL` to name the peer's declared address.
- Require each manifest to record the exact bind addresses, allowlists, and balancer header policy.
- Require a pre-run admission conformance check through the actual research topology: disallowed, null, and mismatched Origin and Host still receive 403 with zero upstream calls.
- State that shared-network-namespace loopback is permitted only when cgroup budgets remain separate and recorded.

**Closure condition.** The containerized or multi-host topology is a declared, verified configuration of the reference application, not an undeclared change to its admission or binding contract.

### R1-F005 — State which discovery steps apply to every resource cell, and give the mandatory matrix an effort bound or priority tiers

**Evidence.** Artifact line 236 says: "For each of the 16 resource cells, run F1 isolation and M1 with the intended service constrained … must not replace a required cell with extrapolation." Line 83 requires separate BFF-constrained and Fastify-constrained sweeps. Lines 410–412 require minimum-wait and one replay profile for M1 in every feasible cell and both constrained-service sweeps. Lines 238–245 define a six-step procedure, including:

- three repetitions of four points;
- a 30-minute soak;
- cleanup verification.

Line 388 allows extending each run up to 60 minutes to obtain counts. Section 16.4 makes each session resident for 180 seconds, so a plateau shorter than one residence period plus 120 seconds of steady observation is not steady.

**Problem.** It is ambiguous whether steps 4–6 (repeats, the 75% candidate, and the soak) are required in all 16 cells × 2 constrained services × 2 profiles, or only at the paired executive configurations. A rough lower bound under the all-cells reading:

- 64 M1 discovery series;
- each with about 8–10 plateaus of at least 5 minutes, refinement, 12 confirmation runs (each possibly up to 60 minutes), and a 30-minute soak;
- giving several hours per series and therefore on the order of 200–400+ machine-hours before F1, worker, instance, deep-dive, B4/B5, and instrumentation-overhead runs.

Much of that buys little decision value. The Fastify-constrained BFF-path sweep across four memory limits (2–12 GiB) tests an in-memory, three-record service whose BFF-path load is at most one lookup per B2/B3 turn. F1 isolation will very likely show orders-of-magnitude headroom and no memory sensitivity.

**Consequence.** The plan must either silently reduce scope, which the specification prohibits, or budget a very large campaign whose cost the owner has not seen. Without priority tiers, partial completion has no defined publishable subset.

**Required revision.**

- State explicitly which procedure steps run in every cell (for example: discovery, bracket refinement, single-run boundary) and which run only at the paired executive configurations and the selected process/instance comparisons (for example: three-repeat confirmation, the 75% candidate, the 30-minute soak).
- Permit a declared, evidence-based reduction for the Fastify-constrained BFF-path sweep. For example, run CPU-only at a fixed memory once F1 isolation shows memory insensitivity and at least a declared multiple (such as 10×) of headroom over the peak retrieval RPS observed in the BFF path. Report skipped cells as reduced-by-rule, not as measured.
- Require the implementation plan to provide a machine-hour estimate and a tiered order: Tier 1 is the paired executive BFF-constrained M1, F1, and default-admission series; later tiers follow. Each tier should be independently publishable with its limitations stated.

**Closure condition.** The mandatory scope is unambiguous, its cost is estimable before work starts, and any stopping point has a defined, honest publishable subset.

## Required changes

1. R1-F001 — Name the admission configuration for the primary matrix and the operating point. Normalize or record per-process and aggregate admission in worker and instance comparisons. Gate scaling efficiency on non-binding or equalized admission. Label admission-bound results.
2. R1-F002 — Reconcile the 16.4 fixed schedule with ordinary voice-turn occupancy, either through a declared load-one feasibility precondition and constrained fixtures, or through a playback-relative think-time cycle. Address the eight-turns-per-minute voice sweep explicitly.
3. R1-F003 — Define the speech eligibility and oracle of typed M1 turns, and per-turn versus per-conversation mix assignment. Define "voice-bearing M1 turn".
4. R1-F004 — Add a declared research network and admission deviation clause (bind addresses, explicit allowlists, balancer Host policy, retrieval URL), with manifest recording and a pre-run admission conformance check through the actual topology.
5. R1-F005 — State which section 10 steps apply in every cell versus the paired configurations. Permit an evidence-based reduction of the Fastify-constrained sweep. Require a machine-hour estimate and independently publishable tiers in the plan.

## Optional suggestions

### R1-F006 — Stagger closed-population session starts and expiries

Line 396 staggers only the first-turn phase within [0, 15) seconds. If a plateau starts N sessions together, all of them expire and are replaced at about 180 seconds plus drain. That produces synchronized cold-turn waves and synchronized history growth: every session reaches its largest history at the same time. Consider requiring initial session ages to be spread uniformly across one residence period (with prorated first residences), so expiries are desynchronized. Alternatively, require the steady window to exclude replacement waves and report their effect.

### R1-F007 — Pin hosted-search configuration and the Models API startup check in mock and calibration manifests

The reference default is `CLAUDE_WEB_SEARCH=enabled` (line 245), with a Models API support check at startup or first use (line 130). Artifact line 68 excludes hosted search by default, and line 163 restricts mock-mode egress. Consider requiring the manifest to set `CLAUDE_WEB_SEARCH=disabled` for primary runs, or requiring the model simulator to answer the Models API check deterministically. Without this, fail-closed egress may silently disable search mid-run, changing tool definitions and request payload size, or the denied Models API call may be miscounted as an attempted paid access.

### R1-F008 — Clarify the role of the 20 ms event-loop-delay threshold

Line 252 lists "Event-loop delay p99 at most 20 ms for the published low-lag operating point" among the screening thresholds. It is unclear whether this gates every capacity screen and the 75% candidate, or defines a second "low-lag" operating point alongside the outcome- and latency-gated one. Consider stating which, and if both exist, require both in the executive table.

### R1-F009 — Make the 1.5× generator and simulator headroom check procedurally achievable

Line 161 requires proving that generators and simulators can exceed "the highest accepted target load" by 1.5×, but that load is unknown until discovery finishes. Consider stating that headroom is validated after discovery against the observed boundary, or iteratively before each plateau above the last validated level. Points above the validated headroom remain censored until rechecked.

## Decision

revisions-requested
