> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/spr/review-6e1eb912f8ea1307f0464d76a1501a3b-author-response-1.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `02ea9705beb71e2007c9962d9a8c4b4f84a2d298bc0eb2c482537ae595fa11b7`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:f81da1894a46ceb20866070833b4e99ef536ef633542b418783d29e6a981dbd8" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-6e1eb912f8ea1307f0464d76a1501a3b'
role: 'author'
turn: 1
commit_mode: 'normal'
authority_assurance: 'unavailable'
artifact_path: 'docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md'
artifact_commit: 'f68073be0b9e94bc8c035ff996604a7d75eabb94'
artifact_blob: '4148dccc2f931bdf6be394534e68fe9d31072a81'
artifact_digest: 'sha256:18fcca5fcf1f56e04147db042e57bf0bcfcc37145cecef9b2baec9fb069cf488'
agent:
  host: 'codex'
  provider: 'openai'
  model_id: 'gpt-6.1-sol'
  model_display: 'gpt-6.1-sol'
  session_fingerprint: 'sha256:303babcc83e3373412fb6bcb163feb218ba76be7f97adb90927d06ffe0b09903'
  identity_source: 'runtime'
started_at: '2026-10-13T02:22:07.276Z'
submitted_at: '2026-10-13T03:07:16.100Z'
finding_ids: []
answered_finding_ids: ['R1-F001', 'R1-F002']
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

Resolved both required findings in the standalone specification. The paid local endpoints now have explicit origin/host admission before body processing or upstream work. The ten-second playback bound now includes every generated but unplayed audio segment, and overflow has complete teardown semantics. Also incorporated the two optional clarifications because they make existing per-turn limits and interruption behavior unambiguous without adding new baseline capabilities.

This remains design review and transfer preparation. No application implementation, live provider request, microphone test, deployment, issue lifecycle approval or production validation was performed.

## Finding dispositions

### R1-F001 — resolved

The Browser to BFF API contract now applies one request-admission policy to both POST endpoints before reading bodies or allocating provider work. Initial permitted origins are explicit loopback URLs at port 3000. Origin must be valid and configured, its host/port must match Host, and Host must independently be configured. Unchecked Host and forwarded headers cannot establish trust. Malformed, mismatched, null and missing Origin are rejected; local HTTP CLI/test clients must supply a configured Origin and matching Host. Direct offline module tests remain available without pretending to authenticate local processes.

Rejection is HTTP 403 ORIGIN_NOT_ALLOWED with retryable false and null turnId, since the body has not been read. The common error contract includes 403 and nullable pre-body turn IDs. Added boundary acceptance requirement 9 with provider-call spies proving no transcription, model, retrieval or synthesis call for rejected requests, including a well-formed cross-origin multipart request. This closes the browser-side paid-work side effect without adding accounts or production authentication.

### R1-F002 — resolved

The speech contract now counts the remaining currently playing audio, future scheduled sources and unscheduled PCM exactly once against the ten-second bound. It requires a check before accepting/scheduling more audio and explicitly retains scheduled duration in the backlog. Suspension of the playback clock cannot release that budget.

Overflow stops all scheduled sources for that answer, clears buffered PCM and pending speech text, aborts active synthesis and disables further speech for that answer while keeping text generation and display available. Added boundary acceptance requirement 10 for a fast producer, slow/suspended playback and immediately scheduled chunks, so a near-empty unscheduled queue cannot bypass the bound.

### Optional suggestion 1 — incorporated

The configuration section defines a single two-use hosted-search budget across all Messages requests, custom-tool continuations and provider pauses. Consumption is established from validated provider events/usage; the next request receives only the remaining allowance. Exhaustion disables new searches while preserving existing provider content blocks. Unverifiable consumption conservatively disables additional search. Added multi-round boundary requirement 11. This clarifies the existing per-turn promise rather than multiplying it by model rounds.

### Optional suggestion 2 — incorporated

New user speech now invalidates the current generation during Working and Speaking, including slow lookup and output-muted turns. Existing abort/queue cleanup and stale-callback gates apply consistently. Added boundary requirement 12 covering late lookup results and completed-history exclusion.

## Changes made

- Added local origin/host admission and its explicit missing-Origin policy under POST /api/turn; applied it to POST /api/speech.
- Extended the common error contract with HTTP 403 and a null turnId before body admission.
- Replaced the unscheduled-only playback limit with total generated-but-unplayed accounting and complete overflow teardown.
- Clarified turn invalidation while Working and the cross-request hosted-search budget.
- Added four focused implementation acceptance requirements. The original architecture, provider defaults, automatic voice interaction, data-service boundary and one-day delivery scope are preserved.

## Declined changes and rationale

None. No additional application capability, production authentication system or infrastructure was added.

## Verification

- Read the complete sealed reviewer-response-1 document and the current standalone specification before editing. Confirmed each required defect against its actual wording; both changes fit the authorized small reference application.
- Checked [MDN CORS simple requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#simple_requests), which documents that form-compatible multipart requests can reach a server without preflight while response sharing still needs CORS permission. The added admission rule is a design decision; CORS is not treated as a side-effect guard.
- Checked [MDN AudioBufferSourceNode.start](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/start), which permits future playback scheduling. Counting scheduled duration follows directly from the requirement to bound audio not yet played.
- Checked [Claude web-search documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool), which defines max_uses per request and exposes actual web_search_requests usage. The revised BFF-turn budget is separate from that per-request control.
- Ran git diff --check after the specification write: exit 0, no whitespace errors. Inspected the full specification diff: only the targeted API admission, playback bound, error, interruption, search-budget and acceptance sections changed. No architecture or transfer section was inadvertently removed.
- Inspected git status: only the target specification is modified; generated review collateral remains under docs/peer-reviews. Protected author metadata was copied unchanged from the generated draft; package submission owns sealing.
- Authentic MCP author handoff returned delivered, sequence 8, delivery reviewer-turn-1-to-author, digest sha256:b195f62964250babad17749ebe99bf8e9826ff3e22cea3d849fe25711f7392e9. Same review and author fingerprint are retained.
- Application-level tests and live validation are future implementation requirements, not evidence claimed by this specification revision. The new boundary cases have been specified, not executed.
