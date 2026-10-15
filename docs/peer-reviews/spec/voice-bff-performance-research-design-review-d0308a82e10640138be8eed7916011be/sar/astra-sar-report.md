# Astra SAR report — round 1

Date: October 14, 2026 (America/Chicago).

**Decision: revise.** Four required specification clarifications and two optional improvements remain. These are research-contract revisions, not an implementation plan. No application, benchmark, paid API, or deployment work was performed.

## Reviewed artifact and assurance

- Issue: [#39](https://github.com/kburson/AIVC/issues/39).
- Artifact: `docs/superpowers/specs/2026-10-14-39-voice-bff-performance-research-design.md` (344 lines).
- Directly observed SHA-256: `e0e95479c33a44c0a74b72ed239faa735a3bf4ef7d1e80c6ca92da2c22c32255`.
- Author-supplied commit: `49126847bf74f09064ea38ca04f401d8fd8960ab`; commit relationship and remote publication are not verified by this reviewer.
- Requested native provider/model/effort: Codex / `gpt-6-astra` / `high`; same reviewer task `/root/astra_sar` is retained for re-review. Provider-certified per-turn attestation is unavailable.
- Review class and boundaries: native SAR, not sealed two-party consensus or owner approval. See [review request](review-request.md).

## Overall assessment

The design correctly measures the real Next.js orchestration boundary and isolates Fastify retrieval without relabeling lookup RPS as call capacity. It preserves actual application integration as a prerequisite, makes network simulators the default, separates worker and instance economics, requires fixed-variable resource comparisons, and gives a credible bounded paid-calibration policy. The streaming-header contract correctly avoids inventing future Server-Timing values. Simulator scheduling checks, fail-closed paid-network isolation, reference cancellation leases, and the ban on manufactured result plots are sound requirements.

The remaining risks are in how future observations become reported capacity: undefined origins for cross-request first-audio timing, an incomplete definition of voice-turn success, underspecified statistical confidence for the word reliable, and pacing/session semantics that can change apparent capacity. Those need to be explicit before a plan turns the prose into harness behavior.

## Required findings

### R1 — Define turn-level timing origins and distinguish them from speech-request latency

**Evidence:** Section 8, lines 171–193, defines per-request stages and first audio write, while sections 10–11, lines 250–251 and 266, use first server audio and the reference approximately three-second first-audio goal. The accepted reference has separate `POST /api/turn` and `POST /api/speech` requests, with sentence segmentation initiating speech while answer SSE is still running (reference lines 200–214). The current document never explicitly defines which start timestamp is paired with a first audio write or how the separate requests form a turn-level latency.

**Consequence:** A chart can show fast synthesis by measuring speech-request entry to its first write while omitting upload/STT, model wait, stable-segment formation, and client scheduling. It can then appear to satisfy the conversational goal even though the first response audio arrives much later. A balanced deployment may put the two requests on different processes, so a shared `turnId` does not make their monotonic clocks subtractable. Per-segment audio samples can also be mistaken for one first-audio sample per conversation turn.

**Revision guidance:** Add a small metric dictionary stating each origin, end event, clock owner, eligible population, and unavailable condition. At minimum distinguish (a) client turn submission to first semantic answer, (b) speech-request entry to first server PCM write, (c) client turn submission to the first received PCM of that turn, and (d) answer-text completion versus all required speech completion. Correlate `turnId` and `segmentId`; select the first eligible segment only for turn-level first audio. Use a validated same-client observer for cross-request end-to-end timing or a separately justified synchronized method; never subtract process-local clocks. State that upload-submit-to-first-PCM excludes capture/VAD and physical playback, and cannot demonstrate the reference speech-end-to-audible goal. If the client observer is unavailable, retain request-local server metrics and mark turn-level first audio unavailable. Apply acceptance budgets only to their named measurements.

**Closure condition:** The first-audio charts and thresholds have one unambiguous meaning, and unsupported streaming observation cannot be substituted with speech-endpoint latency.

### R2 — Define correctness and completion for voice turns after text has completed

**Evidence:** Section 9, lines 219–221, requires actual speech requests and reports suppressed/canceled segments; section 10, line 249, uses correct completed turns as the capacity numerator; section 12, line 282, uses successful synthetic turns for cost. The accepted application deliberately retains completed text when later speech fails or is interrupted (reference lines 198 and 234). Consequently, `turn.completed` alone does not establish successful delivery of the voice workload.

**Consequence:** A harness can count a correct SSE answer as a successful B3 turn despite missing/failed synthesis, truncated PCM, or an unplanned speech queue cutoff. Such a run does less work, may show higher goodput, and understates cost per successful voice turn. Normal text completion and intentional interruption also need distinct accounting rather than one ambiguous success flag.

**Revision guidance:** Define a workload-specific outcome oracle. For ordinary B3 and voice-bearing M1 turns, require valid expected text/tool results plus all fixture-required eligible speech segments, validated audio metadata/byte-duration/order, successful draining, and no unintended suppression, overflow, stale generation, or synthesis failure. Record text success and voice success independently; a completed text answer with failed speech remains text success and voice failure. Name the end of the voice-success observation window, including pending speech after SSE ends, and preserve outstanding work during bounded shutdown rather than silently discarding it. Specify expected outcomes separately for intentional B5 cancellation and policy-limited fixture cases. Use the matching success definition in each goodput and cost denominator. Contract checks use deterministic fixture expectations; they do not claim perceived speech quality.

**Closure condition:** A failed or omitted required speech segment cannot improve the published voice capacity or cost-per-success result by being counted as an ordinary successful turn.

### R3 — Keep empirical thresholds separate from reliability and percentile evidence

**Evidence:** Section 10 permits 120-second plateaus with four turns per session-minute (lines 219, 241), repeats selected points three times (243), and applies a 99.9% success threshold plus p95 deltas (249–250). Its explicit minimum-count rule only covers exploratory p99 (255). Section 13 asks for a reliable operating point (309).

**Consequence:** One session produces about eight turns per plateau and about 24 across three repetitions; some workload-specific metrics have fewer samples. An observed 100% success rate in that set is not evidence for underlying 99.9% reliability, and its low-load p95 is an unstable reference for a 100 ms regression budget. Even a 30-minute soak at that pacing yields only about 120 turns for one session. The draft warns against overclaiming p99, but does not prevent the same mistake in pass/fail, baseline p95, or the executive capacity label.

**Revision guidance:** Define discovery results as empirical screening and state a confirmation/evidence rule for operating-point claims. Report numerator, denominator, failures, duration, run count, per-workload timing counts, and uncertainty for baseline and candidate points. Either require a declared confidence/precision criterion with enough observations and treatment of within-session dependence, or explicitly label the operating point an empirically observed candidate whose 99.9% reliability is unproven. Do not automatically extend paid calibration to meet these requirements. Require sufficiently populated, comparable low-load p95 baselines and candidate strata, or mark the corresponding threshold inconclusive and continue bounded mock observation. An inconclusive point is not a pass. Apply a declared per-run/repeated-point rule rather than permitting an aggregate to conceal a failed repeat. Finally handle a highest passing count of one explicitly: rounding 75% down gives zero, which is not a meaningful positive operating point.

**Closure condition:** Sparse runs cannot be promoted into reliable 99.9% operating capacity or a precise p95 regression decision; measured counts and uncertainty visibly govern the claim.

### R4 — Define pacing, session residence, and late-turn handling before translating sessions to capacity

**Evidence:** Lines 219–226 prescribe four turns/minute with jitter, closed populations, and open arrivals of conversations/turns while forbidding overlapping turns. Lines 241–244 discover capacity by session count, and line 284 translates caller count into model RPM. The specification does not define whether the pacing interval starts at prior submission, answer completion, speech completion, or virtual playback completion; how late arrivals are handled; or the residence/turn-count distribution for an arriving conversation.

**Consequence:** A four-turns/minute implementation based on sleep-after-completion has a lower actual arrival rate as latency increases. Conversely, scheduling by nominal start time can force cancellations or skip intended turns when speech remains outstanding. Both can satisfy the present words while yielding different load, costs, and apparent sustainable session counts. Open conversation arrival rates cannot be translated into active population without a defined session lifetime. Merely reporting achieved pacing exposes the difference after the run but does not specify which comparison is valid.

**Revision guidance:** Define the research workload policy at specification level and require its parameters in manifests: the pacing origin, jitter distribution, user-utterance time if modeled, session length/turn count, idle versus in-flight session accounting, and the policy when a scheduled turn would overlap current answer/speech work. Keep normal baseline waits separate from intentional barge-in. Record intended and actual start times and count delay/skips/drops without silently lowering offered demand. Name what one open-model iteration represents and provide a bounded session schedule; use independent session IDs or the stated nonoverlap policy for open turn arrivals. Publish measured active/in-flight populations and achieved turn rate with any conversion to caller-minute cost, and distinguish a paced-session capacity from an unpaced backend saturation curve.

**Closure condition:** Two conforming harnesses cannot obtain materially different session capacity simply by choosing different sleep placement or session lifetime conventions.

## Optional improvements

### O1 — Make the mandatory profile-to-matrix mapping explicit

**Evidence:** Section 7 defines minimum-wait, calibrated replay, sensitivity, and fault profiles; section 10 line 236 requires F1/M1 resource cells without specifying which profiles are mandatory there.

**Value:** A concise coverage table would make effort and completion auditable while protecting the owner's priority on local curves. Require the minimum-wait network profile for local hardware comparisons and a declared replay profile for realistic occupancy comparisons, then identify the smaller subset receiving sensitivity/fault/pacing deep dives. If that exact scope is too large, state the justified reduced coverage explicitly rather than leaving the eventual plan to accidentally omit one purpose. This is a coverage choice, not a request to author commands or a plan now.

### O2 — Separate resource entitlements from the cost of the actual hosting SKU

**Evidence:** Sections 5 and 12 measure continuous CPU/GiB allocations and price compute, memory, platform footprint, and scaling steps, but do not explicitly require mapping a measured allocation to a purchasable instance/platform configuration.

**Value:** Require a documented mapping from each costed allocation to the dated hosting SKU/billing granularity and its shared/dedicated CPU assumptions. Where hardware differs, label both the capacity transfer and price mapping as projections. Do not price a 3-CPU/8-GiB experiment as three quarters of a 4-CPU instance unless the selected platform actually permits that purchase. Preserve unpriced cells and unknown allocation thresholds as unknown. This improves the executive decision without expanding into a hosting bake-off.

## Evidence and technical checks

Reviewed repository material: workspace `AGENTS.md`; native orchestration instructions; installed peer-review skill; the complete research artifact; reference-design architecture, origin admission, turn/SSE and speech contracts, playback bounds, cancellation leases and latency goals; the Node 26 execution amendment; the prior tutorial SAR request/loop conventions; and live issue #39 scope/model selection. Historical acceptance and source-control relationships stated in these documents remain documentary evidence rather than newly verified Git facts.

Read-only primary web checks:

- [xk6-sse author repository](https://github.com/phymbert/xk6-sse) documents POST bodies and incremental event callbacks. That supports its candidacy; it does not prove multipart, header exposure, prompt abort, simultaneous speech scheduling, or the pinned k6 combination. The specification's compatibility fixture is therefore appropriate, and this review does not reject the candidate merely because its simplest example uses GET.
- [Grafana k6 open/closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/) explains completion-coupled closed arrivals and independently scheduled open arrivals. This supports the pacing/accounting concern in R4; the research must still implement its declared conversation behavior.
- [W3C Server Timing](https://www.w3.org/TR/server-timing/) supports the header mechanism. No header capability is treated as proof of future stream-completion measurements or client first-audio observation.

No k6 binary/extension was built, no capacity/speech/client fixture was executed, and no paid request or pricing quote was obtained. Current provider pricing is intentionally deferred to the bounded calibration/analysis phase. Review observations establish specification gaps, not implementation failures.

## Handoff

The author should address R1–R4 and either implement O1–O2 or record a reasoned disposition. Preserve this report and submit the revised artifact, new digest, and disposition document to this same reviewer context. Re-review will check the full revised artifact and every disposition; the loop ends only when no further revision is warranted or a real blocker exists. No lifecycle move, owner approval, or implementation authorization follows from this report.
