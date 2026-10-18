# Story 40 specification XPR — reviewer response 2

> Formatting view only. [Exact original Git blob](https://github.com/kburson/AIVC/blob/e6e96c9a4f07bb78faa73dc56368a0503d912982/docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-reviewer-response-2.md) · [Lossless original file](../../../../../quality-evidence/40-review-originals/spec-xpr-reviewer-response-2.txt).
> Original SHA-256: `fa0ab0ee9afb0aac4b1024fb91af3747a1d11a07105e762c8c3bf67550afe93d`. Acceptance and sealed hashes bind the original bytes; this view changes presentation only.

## Original protocol metadata

```text
<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-0009efb5ca6886291ad48628afa78120"
role: "reviewer"
turn: 2
commit_mode: "no-commit"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md"
artifact_commit: "722f9d7f386abc81b789f9a69b245b4011593e86"
artifact_blob: "cbd612b1fe8bcc0d9137fe1c9e9ca2c4de7837af"
artifact_digest: "sha256:f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28"
agent:
  host: "claude-code"
  provider: "anthropic"
  model_id: "claude-opus-5-5"
  model_display: "claude-opus-5-5"
  session_fingerprint: "sha256:e5a477dd9d446b3eeee37efb9e161b3393c72b6a8945835dcb19330f75afa47c"
  identity_source: "runtime"
started_at: "2026-10-17T08:40:42.185Z"
submitted_at: "2026-10-17T08:50:26.350Z"
finding_ids: ["R2-F001","R2-F002","R2-F003","R2-F004","R2-F005"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---
```

> **LOCAL JOURNAL MODE** — authority assurance: `unavailable`

## Summary

I re-read the whole revised design (artifact blob `cbd612b1…`) against author-response-1. I checked each disposition against the actual revised text, not the author's summary. I also re-verified the new factual claims against the source:

- **JSON text-turn bounds** match the existing validators in `apps/web/shared/validation.ts`: a UUID turn ID (line 65), history of at most eight messages in whole pairs (line 159) and at most 16000 characters (line 168), nonblank text of at most 2000 characters (line 383), and a 2097152-byte cap (line 342).
- **The custom server API exists.** The pinned Next.js type declarations expose `prepare()`/`getRequestHandler()` (`node_modules/next/dist/server/next.d.ts:26–27`). The design treats this correctly as API evidence only, not proof that a custom server runs, and gates adoption on a compatibility test.
- **The wire-body arithmetic holds:** two turns × 2 MiB plus two speech requests × 8 KiB = 4 MiB + 16 KiB.

Disposition verification:

- **R1-F001 (resolved).** Sections 7–9 now define:
  - an offline L7 router that applies an immutable per-HTTP-request target script, which neither probes nor connection reuse can advance;
  - retries, redirects and substitution disabled, so a failed target gives an explicit failure;
  - router upstream-address logs correlated with per-replica scripted-provider and lease journals;
  - private per-replica addresses for the direct controls;
  - same-replica and missing-attribution negative controls that must fail the assertion.

  No application routing field is added. The A/B test is now deterministic and falsifiable.

- **R1-F002 (resolved).** Two pre-body pipeline permits per request kind are taken after authentication and before ingestion. They have no queue, return a retryable 429 when exhausted, and are held until actual settlement. Invalid or aborted input releases its permit only after the body reader settles. Section 6 forbids Fastify plugins from parsing bodies before this gate. The memory claim is honestly limited to wire-body buffers, with the other overheads measured separately. The design now declares, rather than hides, the tradeoff that slow uploads occupy capacity. See R2-F001 for an optional refinement.
- **R1-F003 (resolved).** Production web now runs an explicit Node HTTP server wrapper around `prepare`/`getRequestHandler`. That wrapper owns the listener, socket registry, readiness and drain interception. Web backpressure is restated as a pull-driven `ReadableStream` with an explicit high-water mark, proven by socket-level slow-reader tests. Container binds are reachable from outside the container. If the pinned-version compatibility check fails, the design must be revised; silent weakening or a Next.js upgrade is ruled out. SIGTERM ownership is assigned per actual listener, and draining is marked synchronously before any awaited close.
- **R1-F004 (resolved).** A canonical non-secret interface-policy manifest now feeds both web and core. Web always overwrites the digest header. Core refuses a mismatched digest after authentication and before body ingestion. The header grants no privilege. The core's actual digest is exposed on a private header and stripped for browsers. Deliberate-mismatch tests are required. This is coherent and adds no shared state.
- **R1-F005 (resolved).** Readiness and liveness are strictly local for all three services. A lookup outage degrades only the tool call. When no eligible core remains, API calls get 503 while the static UI stays ready. Unreachable networks get 502. Diagnostics never gate readiness.
- **R1-F006 (resolved).** The 8192-byte whole-body cap and the `min(120, floor(6 × SPEECH_CHARS_PER_SECOND))` segment-character cap are now separate, and each is tested at its own boundary.
- **R1-F007 (resolved).** The narrowing is removed. JSON text turns with an exact `{turnId, history, text}` shape are added. They use the same validators and cap, strict UTF-8, and reject unknown or duplicate members. JSON audio is rejected. Task 0 inventories both representations. The browser format is unchanged.
- **R1-F008 (deferral accepted).** Coordinated rotation is now recorded with its outage limitation and no zero-downtime claim. That is an honest scope boundary for an optional item.
- **R1-F009, R1-F010, R1-F011 (incorporated).** Section 9 now requires running the real adapter/SDK code against local stubs with valueless credentials and egress denied. Section 6 now states the slow-reader and provider-idle outcomes. Section 8 now records that rolling shutdowns may interrupt work, classified with no replay.

I found no new blocking contradictions. The approach, the no-store boundary, the approval boundary and the lineage statements are unchanged. Section 10 correctly defers the larger work estimate and the new work packages to the companion plan's review instead of asserting a forecast. What remains are refinements that the plan or its tests can absorb; they are listed below.

## Findings

None.

## Required changes

None.

## Optional suggestions

### R2-F001 — Consider an ingestion timeout or a larger ingestion pool, decoupled from paid leases

Pipeline permits now equal the paid-lease count (two each) and cover ingestion through settlement. Two deliberately slow browser uploads, forwarded by the BFF, can therefore block all turns on a core replica until the absolute turn deadline. The design accepts this tradeoff openly, so it is not blocking. Two mitigations would narrow it while keeping memory bounded:

- a separate ingestion deadline or minimum upload rate that is shorter than the turn deadline;
- a slightly larger ingestion-only permit pool (bounded K × 2 MiB) in front of the unchanged two paid leases.

The plan could measure the slow-upload lockout window either way.

### R2-F002 — Test that the BFF surfaces early core refusals during a streaming upload

Core now answers 401, 429 and interface-mismatch 503 before reading the body. Meanwhile the BFF may still be streaming the browser upload through `fetch` with a half-duplex body. Depending on how the pinned Node/undici version and Fastify handle the unread request body, the BFF may see a write or socket error instead of the response. It would then report a sanitized 502 rather than the core's retryable 429 or 503. Add a delegated parity case for each early refusal during an in-progress multi-chunk upload, asserting that the browser receives the core's status, error envelope and retryability.

### R2-F003 — Say which delegated calls advance the router script

Section 8 says only "application calls" advance the scripted cursor and probes do not. Web's delegated `GET /api/capabilities`, typically fetched when the page loads, is also an application call through the router. Declare whether the script covers every routed request or matches by method and path, for example only `/api/turn` and `/api/speech`. Otherwise an incidental capabilities fetch shifts the expected A, B, B sequence and produces a confusing failure.

### R2-F004 — Record the coordinated-change limitation for interface-policy updates

Changing the interface-policy manifest (a timeout or a segment cap, say) makes every delegated request fail with 503 while web and core digests differ. With independently deployed services, that is a short outage during any policy rollout, the same as the coordinated credential change already recorded in section 5. Recording the same limitation for policy changes would keep the operational expectations consistent.

### R2-F005 — Pin the JSON turn media type

Section 5 defines the JSON turn body exactly but does not state its accepted `Content-Type`. Matching the existing speech rule (`application/json` with an optional `charset=utf-8`) and rejecting anything else would make representation selection unambiguous. It would also give the negative tests a precise boundary.

## Decision

accepted
