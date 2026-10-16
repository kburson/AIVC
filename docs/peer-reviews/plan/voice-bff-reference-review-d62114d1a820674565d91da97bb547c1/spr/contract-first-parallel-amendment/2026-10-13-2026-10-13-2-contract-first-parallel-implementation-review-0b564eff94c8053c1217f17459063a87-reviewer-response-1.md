> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/contract-first-parallel-amendment/2026-10-13-2026-10-13-2-contract-first-parallel-implementation-review-0b564eff94c8053c1217f17459063a87-reviewer-response-1.md) and its exact bytes remain available in the [evidence archive](../../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `f113ca029b39e8111d4efd342934d789ab19a3cc4cc7912f1631011c9bce5454`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-0b564eff94c8053c1217f17459063a87'
role: 'reviewer'
turn: 1
commit_mode: 'normal'
authority_assurance: 'unavailable'
artifact_path: 'docs/superpowers/plans/2026-10-13-2-contract-first-parallel-implementation.md'
artifact_commit: '4c717024140ad3d7a26cb421a1177f7a212afbea'
artifact_blob: '3d9899cc7f4dd23f7fd4f43235b46858223c27c9'
artifact_digest: 'sha256:c2cb78209723ab4dd496fe355c9be7493f35e1bab0232d8c140dad4aa4667a06'
agent:
  host: 'codex'
  provider: 'openai'
  model_id: 'gpt-6-astra'
  model_display: 'gpt-6-astra'
  session_fingerprint: 'sha256:c718e87794011fa18ed4cdaa7d455401049ab1466b0df6b863c5d99886b48238'
  identity_source: 'declared'
started_at: '2026-10-13T14:44:34.242Z'
submitted_at: '2026-10-13T14:49:10.925Z'
finding_ids: ['R1-F001', 'R1-F002', 'R1-F003']
answered_finding_ids: []
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

The decomposition preserves the accepted system boundaries and full delivery gates, but an executable wire-contract contradiction must be corrected before freezing the foundation. Normal commit mode; generated authority assurance remains unavailable.

Reviewed the full amendment; binding specification API, ownership and acceptance requirements; accepted base-plan Tasks 2–5 and 7–8 interfaces; and installed epic-rank-wave policy/guide. No Git commands, artifact edits, task-binding changes, application implementation or provider calls were performed. The Node26 amendment is inherited accepted authority, not newly certified runtime compatibility.

Independent assessment and acceptance evidence:

- API: explicit requests, bounds, strict paired inbound history, schema/event discrimination, sequence zero/+1, terminal rules, final-text equality, errors and audio metadata support independent development after R1-F001.
- Public/server boundary: one shared AppError avoids conflicting classes and server imports. Native SDK types, secrets, config/runtime and retrieval origin remain private. Transitive import checking plus actual browser compilation is appropriate; R1-F002 makes the latter concrete.
- Graph: installed evaluateRankWaveAdmission checks target dependency readiness, allowing same-rank #4→#5 edges without requiring every member ready simultaneously. Strict lower-rank completed Done, all-rank membership and authentic bindings remain required. #7 is explicitly held until #5 if independent entry/final wiring cannot be represented. The amendment invents no grant and keeps canonical hydration/current authorization root-owned.
- Whole stories: CONTRACT and CAPTURE-MODULE have full independent completion scope. #7 cannot finish before same-owner wiring. #3 is implemented with remaining lifecycle gates rather than fabricated parallel work. Exclusive files/manifests and later serialized Conversation/controller changes preserve ownership.
- Evidence: #6 controlled transport proves client agreement only; #5 real runTurn plus Fastify HTTP proves producer behavior; #11 restores joined Next/Fastify browser acceptance without turn interception. Patched MicVAD lifecycle tests, actual asset smoke and real provider/microphone/search/echo/live incremental SSE/PCM remain distinct and assigned. All fifteen cases retain owners and explicit failure/unverified outcomes.
- Estimate: extraction redistributes scope with a disclosed allowance; no mock test implies live acceptance or a one-day full-scope promise.

## Findings

### R1-F001 — P2 — Normative separator and SSE recipes encode literal backslashes

Location: amendment lines 248 and 263.

The exact delta fixture contains the JavaScript source literal '\\n\\n'. The encodeSse recipe likewise uses '\\ndata: ' and '\\n\\n'. These evaluate to backslash-plus-n bytes rather than LF delimiters. Consequently the fixture disagrees with the accepted two-newline producer invariant, and the encoding recipe emits no SSE line/frame terminators. Independently implemented consumers/producers can fail conformance or accidentally share a broken wire format.

Verification: read and evaluated the exact isolated array and encoding expression from the amendment without modifying files. The separator code points were [92,110,92,110]. The resulting encoder string contained zero LF characters and literal backslash-n text. Accepted base-plan Task 3 line 370 requires real newlines.

Required correction: provide unambiguous fenced TypeScript examples using '\n\n' for the separator and '\ndata: ' / '\n\n' for SSE framing. State separator bytes [10,10], and require an independently authored raw-byte SSE fixture with actual LF delimiters. Keep every-split and malformed-stream tests; expected framing must not be derived solely from encodeSse under test.

## Required changes

1. Resolve R1-F001 in both normative examples and verification expectations before freezing the shared contract.

## Optional suggestions

### R1-F002 — Make the browser compilation check executable in CONTRACT

Lines 175/278 require actual browser compatibility beyond lexical scanning, but the CONTRACT command list omits a browser build and the starter page may not import shared modules until #6. Name a browser compilation/bundle probe and its owned entry reaching all four shared modules. Building an unrelated starter page would not exercise the boundary.

### R1-F003 — Pin the capture callback seam

The new CaptureSession constructor exposes onUtterance/onStatus; later interruption needs rawStart/confirmedStart/misfire with immutable tokens. These requirements remain preserved and #10 can modify CaptureSession, so this is not lost scope. Defining a public callback/subscription seam and reason union in the module delivery would nevertheless prevent integration churn and clarify how valid-end handling avoids duplicate submission.

## Decision

revisions-requested
