<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-0009efb5ca6886291ad48628afa78120"
role: "reviewer"
turn: 1
commit_mode: "no-commit"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md"
artifact_commit: "722f9d7f386abc81b789f9a69b245b4011593e86"
artifact_blob: "80453a0b32da580da554401b96e411f8189f0cd7"
artifact_digest: "sha256:fecb93bdc40e6f2636f04bb243d7f5cbf74cbb8041f8c16891f38db4c643d1d4"
agent:
  host: "claude-code"
  provider: "anthropic"
  model_id: "claude-opus-5-5"
  model_display: "claude-opus-5-5"
  session_fingerprint: "sha256:e5a477dd9d446b3eeee37efb9e161b3393c72b6a8945835dcb19330f75afa47c"
  identity_source: "runtime"
started_at: "2026-10-17T08:40:42.185Z"
submitted_at: "2026-10-17T08:44:29.672Z"
finding_ids: ["R1-F001","R1-F002","R1-F003","R1-F004","R1-F005","R1-F006","R1-F007","R1-F008","R1-F009","R1-F010","R1-F011"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---

> **LOCAL JOURNAL MODE** — authority assurance: `unavailable`

## Summary

I reviewed the full migration design (artifact blob `80453a0b…`, commit `722f9d7`) against governing research specification sections 18–19, governing plan Task 0, and the current application source in this worktree. I checked the source behind every baseline claim:

- `apps/web/server/http/{body,admission,sse-response,speech-response}.ts`
- `apps/web/server/turns/{deadline,leases,run-turn}.ts`
- `apps/web/server/{runtime,config}.ts`
- `apps/web/shared/validation.ts`
- `apps/web/app/api/{turn,capabilities}/route.ts`
- the web/retrieval `package.json` start scripts

I could not read #40's live GitHub acceptance criteria from this session. Wherever a finding depends on them, I say so.

Overall the design is sound and honest about its limits:

- The selected approach (extract contracts and the real provider lifecycle into a Fastify core; leave web as a forwarding adapter) is the lowest-drift option.
- The no-store position is stated precisely, including what it does *not* promise.
- The source checks hold. `runWithDeadline` separates `result` from `settled`. Leases are released only from `settled`. `turn.accepted` is emitted before STT, so the SSE headers mark the first paid-capable boundary. SSE enqueues eagerly, with no demand gating. The turn parser accepts only multipart. Per-process two-slot pools live in `globalThis`. Admission checks Host and Origin before any body read.

Seven items block acceptance. Each is a gap that would leave the migration plan or the acceptance tests under-determined:

- how the replica A/B test steers and attributes requests without adding a replica ID to the contract;
- unbounded concurrent pre-lease body ingestion in the core;
- whether Next.js can actually provide the termination and backpressure mechanisms the spec assigns to "both bridges" and to every service;
- configuration that couples web to core across services;
- the readiness dependency policy;
- an inaccurate speech limit statement;
- an untraced narrowing of the governing `/api/turn` "JSON or multipart" contract.

None of these calls for a shared store or a change of approach.

## Findings

### R1-F001 — The forced A/B replica test has no declared steering or attribution mechanism, and the contract forbids the obvious one

Sections 7 and 8 require "Force turn A → speech B → next turn/history B, replace A, then continue." A "stateless retry-disabled test/ingress router" is meant to prove per-request selection without stickiness. Section 7 also forbids an "owner-replica ID". The design never says:

1. **How the test forces a request onto A or B.** A round-robin or least-connections router does not deterministically produce A→B→B. Retries, health-check timing, or connection reuse can easily put consecutive requests on the same replica, which makes the test either flaky or vacuous.
2. **How evidence attributes each request to a replica.** There is no response field, and none is allowed. That leaves router access logs (upstream address), per-replica request/lease counters, or per-replica scripted-provider journals. The design names none of them.
3. **Whether selection is per request or per connection.** The BFF's `fetch` (undici) pools keep-alive connections to the router. An L4 or connection-level balancer would pin every BFF request to one core and silently fail the test. "Per-request selection" implies L7, but the router's own upstream keep-alive and selection policy also has to be declared.

Without these, the acceptance area "Replica correctness" cannot be verified as specified. A test could pass while every request lands on one replica.

### R1-F002 — Core body ingestion before lease admission has no concurrency bound

In the current code, a turn lease is acquired inside `work` only after `readBoundedBody(req, 2097152, …)` has buffered the whole multipart body (`body.ts:66`, `sse-response.ts:57`). A speech lease likewise comes after its 8 KiB body read. Bearer authentication runs before the body is read. But the authenticated caller is the BFF, and the BFF forwards any browser that passes Host and Origin. So the core accepts effectively anonymous concurrent uploads, each buffering up to 2 MiB. Each slow upload holds a socket and memory until the turn deadline. Only then is it refused with 429 at lease time.

Section 6 says "Body accumulation remains capped" and sets per-hop queue bounds. That bounds each request, not the process. Under section 8's container memory limits, and section 19's "sized from measured traffic", pre-admission memory of N concurrent uploads × 2 MiB is an undeclared, unbounded resource. A container could be OOM-killed. That is a hard exit with settlement unknown for *admitted* work on the same replica, which is exactly the outcome section 8 tries to keep rare.

### R1-F003 — Termination and backpressure mechanisms are specified in terms Next.js `next start` does not expose

Section 8 says SIGTERM "first withdraws readiness and refuses new application requests (including keepalive requests) with sanitized 503", then drains for 15 s and allows 5 s for settlement. It is written for all three images. Section 6 says "Both bridges" use "`write(false)` waits for `drain`". That holds for the Fastify core (`reply.raw`). The web bridge, though, is a Next.js App Router route handler (`apps/web/app/api/turn/route.ts`) that returns a Web `Response`. It never touches the Node socket `write()`/`drain` API. Its only lever is `ReadableStream` pull and `highWaterMark`, plus however Next's server pipes that stream to the socket.

Likewise, `next start` (`apps/web/package.json:9`) has no hook to keep the listener open while answering new keep-alive requests with 503, or to withdraw readiness first. That needs a custom/standalone server wrapper or an ingress-level drain. The script also binds `--hostname 127.0.0.1`, which a separate container cannot receive traffic on.

The design must say how the web service meets each requirement, or scope the requirement to the services that can. Otherwise the plan will either silently weaken them or introduce an undeclared custom server.

### R1-F004 — Cross-service configuration coupling is undeclared

The BFF deadline is "bounded to configured turn/speech timeout plus configured transport grace" (section 6). Web must therefore know the core's `TURN_TIMEOUT_MS` and `SPEECH_TIMEOUT_MS`. Web admission body limits, capabilities, and `segmentChars` matter the same way, if the web layer validates anything. Section 7 requires "same recorded catalog/contract/config digests in eligible replicas", but only across replicas of *one* service.

Suppose web is configured with a shorter turn timeout than the core. The BFF returns 504, or aborts after headers, while the core would have finished or sent its own `TURN_DEADLINE` terminal event. Direct and delegated parity (section 9) then breaks in a way no per-service check detects. Since the services now deploy independently, this mismatch is likely during rolling changes.

### R1-F005 — Readiness dependency policy between web, core and lookup is ambiguous and risks cascading unreadiness

Section 8 makes web readiness check "configured core readiness/capabilities with authentication". It also mentions "bounded cached lookup dependency checks" without saying whether core readiness depends on lookup. Two problems follow:

- **Web readiness flaps with core replicas.** Behind the router, web's probe reaches whichever core replica the router picks. One draining core replica (which returns 503 by design) can mark web unready intermittently. All cores draining during a rolling deploy can take the whole UI out of rotation, including static assets and the client's error UI.
- **Lookup unreadiness has no defined effect on core readiness.** The design does not say whether a lookup outage makes the core unready, which would block text turns that never call lookup, or only degrades the lookup tool. Gating readiness on a downstream service is a known cascading-failure pattern. If it is intended, the design should say so explicitly with hysteresis and caching. If not, it should forbid it.

"Restart storms" in the current text is a liveness concern. The readiness-gating policy itself is unstated.

### R1-F006 — The speech limit is misstated as "8 KiB/segment validation"

The section 5 table says core speech admission is "8 KiB/segment validation". The source enforces two different bounds:

- an 8192-byte cap on the *whole* JSON request body (`speech-response.ts:52`);
- a separate per-segment character cap, `segmentChars = min(120, floor(6 × SPEECH_CHARS_PER_SECOND))` (`config.ts:80`, applied by `validateSpeech`).

The wording reads as an 8 KiB per-segment allowance. It also drops the character cap that bounds per-request TTS cost and keeps the speech deadline coherent. A migration that preserves "8 KiB/segment" literally could regress the governing paid-work bound.

### R1-F007 — Narrowing the governing `/api/turn` "JSON or multipart" contract is not traced to an owner decision or acceptance criterion

Governing section 18 defines the portable contract as "`/api/turn` (POST JSON or multipart, SSE answer)", served by the Fastify orchestrator for web and future non-web adapters alike. Section 2 of this design correctly notes that the current parser accepts only multipart. It then reinterprets the governing text ("the governing JSON-or-multipart description uses its established multipart representation here") and defers JSON to "an explicit extension".

That may be the right scope. But it narrows an owner-directed contract for exactly the consumer the migration exists to serve: authorized non-web clients. The design gives no trace to #40's acceptance criteria or an owner decision. I could not verify #40's live criteria from this session. If they or Task 0's interface inventory expect JSON turn input, the accepted integrated revision would fail the research prerequisite.

## Required changes

1. **R1-F001.** In sections 7, 8 and 9, declare the replica-steering and attribution mechanism:
   - the test router's selection policy (deterministic, e.g. strict ordered round-robin over named upstreams, per HTTP request), its upstream keep-alive behavior, and retries disabled;
   - or direct per-replica addressing for core-direct legs, with the router used only for the delegated legs;
   - the out-of-band evidence that attributes each request (router access log upstream address, per-replica scripted-provider journal, or lease counters). It must not be a response or contract field.

   Add a negative control: the test fails if two forced-distinct requests are attributed to the same replica.
2. **R1-F002.** Declare a per-process bound on concurrent pre-admission request bodies, or on open application connections, in the core. Exceeding it must give a fast, sanitized, retryable refusal (429 or 503) before body consumption. Alternatively, acquire the lease before body ingestion and justify the effect on throughput. Include pre-admission memory in the sizing and readiness discussion. Add an acceptance test: concurrent slow 2 MiB uploads beyond the bound are refused without growing memory past the declared limit, and admitted work is unaffected.
3. **R1-F003.** State the termination contract per service. For web, either:
   - name the mechanism (a custom or standalone Node server wrapper that owns readiness withdrawal, keep-alive 503 refusal and drain, with the pinned Next.js version's support verified); or
   - scope SIGTERM drain semantics for web to what `next start` provides, plus ingress-level drain, and record the gap.

   Restate the web bridge's backpressure requirement as observable bounded buffering through `ReadableStream` pull/`highWaterMark`, rather than `write(false)`/`drain`. Require a container bind address other than loopback.
4. **R1-F004.** Declare which web settings derive from core settings: turn/speech timeouts, body limits, and segment cap if web validates it. Declare how consistency is enforced. Acceptable options: web reads the values from authenticated core capabilities at startup, or a recorded cross-service config digest whose mismatch refuses readiness or the accepted topology. Add a parity test with deliberately mismatched timeouts that shows the refusal.
5. **R1-F005.** Specify the readiness dependency graph explicitly:
   - whether web readiness depends on core (and if so, with an aggregated, cached and hysteretic check, not a single probe through a per-request router);
   - whether core readiness depends on lookup or lookup only degrades the tool.

   State the expected behavior when all core replicas are draining or unavailable, e.g. web stays ready and returns sanitized 502/503 for API calls. Keep liveness strictly local (event-loop health) so no dependency can cause restarts.
6. **R1-F006.** Replace "8 KiB/segment validation" with both preserved bounds: an 8192-byte JSON body cap, and a per-segment character cap of `min(120, floor(6 × SPEECH_CHARS_PER_SECOND))` validated by `validateSpeech`. Apply the same bounds in the direct/delegated parity tests.
7. **R1-F007.** Add an explicit trace for the multipart-only `/api/turn` decision: cite the #40 acceptance criterion or owner decision that permits deferring JSON turn input, and state that Task 0's route/interface inventory will record multipart-only as the accepted contract. If no such authority exists, put JSON turn input in scope as a bounded, validated representation that shares the same parser limits.

## Optional suggestions

### R1-F008 — Let the core accept a small set of bearer credentials so rotation is possible

Web and core deploy and scale independently. A single "configured exact bearer credential" means rotation needs a simultaneous restart of every web and core replica, or causes an outage window. Accepting a bounded set (current plus next), each compared in constant time, with the active one recorded by non-secret fingerprint, allows rolling rotation without a shared store.

### R1-F009 — Exercise the moved real provider adapters against local stub endpoints

Section 9 limits verification to scripted/mock providers with egress denied. `MockAdapter` and `createMockSpeechAdapter` bypass the code that actually moves: `ClaudeAdapter`, the Deepgram adapter, and their SDK abort/stream-reader paths. Consider also running those adapters against local HTTP stubs inside the isolated network (SDK base-URL override, no credentials of value). That would prove abort propagation and late-EOF settlement in the new process, which is where silent regressions are most likely. The egress-denied, no-paid-call rule would still hold.

### R1-F010 — State the slow-reader policy for demand-gated SSE explicitly

Once the core stops pulling `runTurn` while downstream is full, a stalled client keeps the provider stream backpressured at TCP and holds a paid lease until the absolute core deadline. That is consistent with "no per-chunk reset", but it is worth stating outright. Also say whether provider-side idle timeouts that this stall can trigger are mapped to the existing provider error or to an interruption. Then the slow-reader acceptance test has a defined expected outcome.

### R1-F011 — Record the interaction between drain windows and turn and speech timeouts

If `TURN_TIMEOUT_MS` or `SPEECH_TIMEOUT_MS` exceeds the 15 s drain window, every rolling deploy will interrupt in-flight long turns by design. Recording that relationship (and the expected interrupted-outcome classification) next to the 15/5/25 s figures would stop later readers from treating those interruptions as defects or as hidden replay candidates.

## Decision

revisions-requested
