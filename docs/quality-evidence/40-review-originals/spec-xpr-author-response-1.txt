<!-- ai-peer-review-template version="1" digest="sha256:f81da1894a46ceb20866070833b4e99ef536ef633542b418783d29e6a981dbd8" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-0009efb5ca6886291ad48628afa78120"
role: "author"
turn: 1
commit_mode: "no-commit"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md"
artifact_commit: "722f9d7f386abc81b789f9a69b245b4011593e86"
artifact_blob: "80453a0b32da580da554401b96e411f8189f0cd7"
artifact_digest: "sha256:fecb93bdc40e6f2636f04bb243d7f5cbf74cbb8041f8c16891f38db4c643d1d4"
agent:
  host: "codex"
  provider: "openai"
  model_id: "gpt-6.1-sol"
  model_display: "gpt-6.1-sol"
  session_fingerprint: "sha256:3c8a7ddce72ffb1862ebe766fb8e3e447c90e195d470d69ffe8d8cd7930c30cf"
  identity_source: "runtime"
started_at: "2026-10-17T08:39:33.140Z"
submitted_at: "2026-10-17T08:48:41.920Z"
finding_ids: []
answered_finding_ids: ["R1-F001","R1-F002","R1-F003","R1-F004","R1-F005","R1-F006","R1-F007","R1-F008","R1-F009","R1-F010","R1-F011"]
acknowledged_supplement_ids: []
---

> **LOCAL JOURNAL MODE** — authority assurance: `unavailable`

## Summary

Revised the migration design only. The seven required findings now have explicit contracts and future acceptance checks. The companion plan remains unchanged during this spec turn; its separate XPR must reconcile these changes before hydration. Actual candidate MCP delivery reached the author at sequence 8. The preserved predecessor remains unresolved.

## Finding dispositions

- **R1-F001 — addressed, sections 7–9.** An offline L7 router uses an immutable per-application-request target script and transient cursor; probes, connection reuse and upstream keep-alive cannot change selection. Retries, redirects and substitution are disabled. Actual upstream-address logs must agree with per-replica provider/lease journals. Same-replica and missing-attribution negative controls fail acceptance. No application routing identity is introduced.
- **R1-F002 — addressed, sections 6 and 9.** Two pre-body pipeline permits per request kind cover ingestion through actual settlement, with no queue and sanitized retryable 429 before body consumption when exhausted. Separate paid leases still start after validation. Invalid/aborted input releases only after body-reader settlement. Declared wire-body contribution is 4 MiB plus 16 KiB; parser/copy/active-work/stream/socket overhead is separately measured, not falsely included in a total-RSS claim. Slow-upload saturation tests prove bounds, refusal and unaffected admitted work. Slow uploads deliberately occupy capacity.
- **R1-F003 — addressed, sections 2, 4, 6, 8–9.** Selected an explicit Node HTTP listener around pinned Next.js prepare/getRequestHandler, replacing next start for production containers. It owns sockets, readiness and keep-alive/drain interception; routes only forward. Web pressure is pull-driven Web Streams plus measured framework/socket behavior, distinct from core write/drain. Container binds are reachable. Pinned-version compatibility must be proved before adoption; failure requires design revision rather than silently weakening bounds or upgrading.
- **R1-F004 — addressed, sections 5 and 9.** A canonical non-secret interface-policy manifest covers timeouts, grace, whole-body/text/history/segment bounds and contract version. Web derives forwarding settings from it. Web overwrites the internal consistency digest; authenticated core rejects a present mismatch before body/provider work with retryable 503. This header grants no identity/privilege. Core exposes its actual digest on private capabilities headers without changing JSON; web strips that header. Accepted topology and deliberate timeout/segment mismatch tests require coherence.
- **R1-F005 — addressed, sections 5, 8–9.** Health/readiness are local for all services. Lookup availability affects only the bounded tool call, never web/core readiness or restarts. No eligible core produces API 503 while static UI stays ready; unreachable network produces 502. Optional diagnostics have five-second cache/one-second timeout and cannot gate readiness/liveness. Configuration mismatch is an API/topology refusal.
- **R1-F006 — addressed, sections 5 and 9.** Separated the 8192-byte whole JSON request cap from min(120, floor(6 * SPEECH_CHARS_PER_SECOND)) segment-character validation; direct/delegated tests cover both independently.
- **R1-F007 — addressed, sections 2, 5 and 9.** Removed the unsupported narrowing: live #40 criteria provide no waiver of governing section 18. Added JSON text turns with exact turnId/history/text fields, strict UTF-8/JSON, no unknown/duplicate members, shared UUID/history/text validation and the existing 2 MiB body cap. JSON audio is rejected; multipart WAV/text remain. Task 0 inventories both representations.
- **R1-F008 — deferred, section 5.** Bounded multi-key rolling rotation is optional and not necessary to prove this migration. Explicitly recorded coordinated rotation and its outage limitation, with no zero-downtime promise.
- **R1-F009 — adopted, section 9.** Require the moved real adapter/SDK paths against local isolated protocol stubs, in addition to mocks. Use supported endpoint injection or a narrow test construction seam, valueless credentials and denied external egress; no production auth bypass or paid destinations.
- **R1-F010 — adopted, section 6.** Slow readers may retain slots until the absolute deadline. Earlier provider idle failure follows existing sanitized provider-failure/incomplete transport semantics, never completion or retry.
- **R1-F011 — adopted, section 8.** Work whose remaining timeout exceeds drain can be interrupted on rolling shutdown; explicitly retain interrupted/settlement-unknown/no-replay classification.

## Changes made

Revised status and sections 2, 4–10. Corrected stale preliminary 40-hour wording: the companion plan currently proposes 52 joint hours/XL, and its review must reassess JSON, pre-body admission, listener, policy and routing work before hydration. No new approved forecast or issue-field mutation is claimed. Historical SAR acceptance remains tied to original bytes.

## Declined changes and rationale

Only optional R1-F008 is deferred as above. No required change declined.

## Verification

Read the full sealed report; rechecked current web start command, config and turn/speech/history validation. Governing section 18 explicitly includes JSON or multipart; live #40 criteria do not waive it. Inspected pinned Next.js type declarations exposing prepare/getRequestHandler: API evidence only, not custom-server execution proof.

Only this exact author response and the reviewed design were manually edited. No application/provider/container tests or paid calls ran; no deployment/implementation result is asserted. The automation seals the revised artifact digest. The first combined response-write/formatter command was refused by the Plan activity guard before execution; no state promotion or bypass was used. This separate operation writes only the authorized response document.
