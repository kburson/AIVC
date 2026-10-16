> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/xpr/review-0905b6c7c8f1d7f6f479e1ba143799d3-author-response-1.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `832bb34b64f610ce2aca441b18a2fc1e60603406e915eeb9d329b2464e632886`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:f81da1894a46ceb20866070833b4e99ef536ef633542b418783d29e6a981dbd8" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-0905b6c7c8f1d7f6f479e1ba143799d3'
role: 'author'
turn: 1
commit_mode: 'normal'
authority_assurance: 'unavailable'
artifact_path: 'docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md'
artifact_commit: 'cd745923c83e7b45d1a795ffcf4e87a193d4771a'
artifact_blob: 'fcde53a12d5e49cb1b02a957a18d7d6f2fe660f3'
artifact_digest: 'sha256:44e70b02d0cac27217b805f387bdb6d8677a5f79ce136c33f2ebf4fd51d5422a'
agent:
  host: 'codex'
  provider: 'openai'
  model_id: 'gpt-6.1-sol'
  model_display: 'gpt-6.1-sol'
  session_fingerprint: 'sha256:303babcc83e3373412fb6bcb163feb218ba76be7f97adb90927d06ffe0b09903'
  identity_source: 'runtime'
started_at: '2026-10-13T03:12:28.570Z'
submitted_at: '2026-10-13T03:24:29.217Z'
finding_ids: []
answered_finding_ids:
  [
    'R1-F001',
    'R1-F002',
    'R1-F003',
    'R1-F004',
    'R1-F005',
    'R1-F006',
    'R1-F007',
    'R1-F008',
  ]
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

Revised the standalone design to make normal speech production wait behind playback, preserve paid turns during tentative VAD misfires, define search capability degradation, and choose an explicit completed-text history policy. Dispositioned all four required and four optional sealed findings. The application architecture and transfer boundary remain unchanged: the new repository owns implementation, real application validation and the tutorial.

This submission makes design requirements reviewable. It does not claim that the future application, selected voice timing, speaker echo behavior or live hosted-tool continuation already works.

## Finding dispositions

### R1-F001 — resolved

POST /api/speech now uses a bounded segment plus request-level backpressure. A segment must fit both 120 characters and an estimated six seconds; the cap is min(120, floor(6 * SPEECH_CHARS_PER_SECOND)). The conservative initial estimate 14 gives an 84-character cap. The BFF enforces the same effective cap exposed to the browser, so the previous 600-character transport allowance cannot bypass client segmentation. The estimate is explicitly provisional and must be calibrated for the actual voice; no universal character-to-duration guarantee is claimed.

The client starts another synthesis request only with outstanding audio at or below the two-second low-water mark, running playback and no tentative barge-in. The six-second estimate plus two seconds outstanding leaves two seconds margin under the ten-second high-water bound. Existing current/scheduled/unscheduled actual-audio accounting is retained. Long answers wait as unsent text; a text-queue excess explicitly clears unsent speech and disables the remainder while permitting already generated audio to finish.

The active small PCM response is drained promptly, not held open until playback catches up, preserving the 20-second speech-request deadline. Emergency teardown is reserved for actual oversize PCM or a playback suspension lasting more than three wall-clock seconds while audio remains outstanding. These paths still stop scheduled sources, clear PCM/text, abort synthesis and leave model text available. Requirement 10 now proves normal fast production speaks a multi-sentence answer completely under the bound and separately exercises oversize/stalled emergencies. Manual live acceptance must check actual segment duration and ordinary answer completion.

### R1-F002 — resolved

Turn ownership now separates raw detection from confirmed interruption. Raw speech-start suspends a dedicated playback AudioContext reversibly and pauses new synthesis admission; it retains the generation, scheduled audio and pending requests. Capture/VAD runs separately and remains active. Misfire restores playback and leaves a Working lookup/turn intact. Confirmed positive-duration speech commits the existing generation invalidation, queue cleanup and request abort. Initial confirmation is 400 ms, using the pinned release's real-start callback or a positive-frame duration check; the policy does not wait until utterance end. Stale candidate callbacks cannot resume a canceled generation.

This avoids losing a paid answer on tentative noise while preserving prompt local silence. The measurement contract distinguishes callback-to-silence (200 ms target), confirmation-to-cancellation and physical acoustic onset-to-silence rather than laundering detection delay out of observed latency. Speaker-mode mitigations are VAD threshold/confirmation tuning with continued listening. Unresolved self-triggering remains a failed/unverified acceptance case and documented limitation; headset operation is a labeled workaround. Boundary requirement 12 exercises both Speaking and Working misfires and confirmed cancellation.

### R1-F003 — resolved

Added explicit search enable/version, BFF origin/host and speech-estimate settings with a sanitized default block. Invalid admission configuration fails closed. Search state distinguishes configuration-disabled, reasoned-unavailable, model-supported/account-unverified and successfully live-verified states. Models API support checking can disable search independently; it cannot prove organization enablement.

A provider-specific hosted-tool/version/organization rejection latches search unavailable for the process, exposes a reason and omits search from subsequent turns. The affected turn fails visibly; the baseline deliberately performs no automatic replay and makes no blanket no-charge assertion. Generic failures are not recast as support rejection. Project lookup and ordinary conversation work with search disabled, and the owner may ask again or restart after repair. Requirement 13 and manual acceptance cover degradation and truthful capability labeling.

### R1-F004 — resolved

Selected whole-pair completed-text history. A current turn completing with complete status appends its recognized/typed user text and final assistant display text atomically. Later speech cancellation/mute/failure does not remove completed text. Interrupted, failed, truncated, no-speech and pre-transcript canceled turns append neither message; visible partial turns remain in the timeline but are not model context. No invented assistant placeholders are inserted.

Trim whole oldest pairs to at most four pairs/eight messages and 16,000 characters. A single oversize completed pair is omitted with an explicit context notice, never silently split or truncated. The BFF validates alternating paired history as untrusted input. Requirement 14 covers inclusion and trimming; the follow-up script now refers to the most recent completed-text context. This makes an unfinished interrupted Beacon response incapable of displacing previously completed Atlas context.

### R1-F005 — incorporated as an explicit compatibility requirement

The search-budget section now requires live validation of a continuation carrying unchanged prior hosted blocks while omitting the exhausted tool definition, including provider-pause continuation. If the chosen API/tool combination rejects that request form, the adapter ends with partial/truncated status and documents the limitation; it does not restore a search budget, assume max_uses=0 is legal or replay an already accepted request. Requirement 11 includes offline fallback and live compatibility checks. This is required future implementation evidence, not a claimed live result of this design review.

### R1-F006 — addressed with explicit bounded Busy behavior; automatic retry declined

Concurrency slots remain held until admitted upstream work settles or is confirmed canceled, while abort propagation begins immediately. Releasing a slot solely on client disconnect could let unresolved paid work exceed the process bound, so that alternative was not selected. A newer barge-in may receive pre-paid-work HTTP 429 while prior cancellation settles; the client shows Busy and offers a deliberate new question. No automatic replay/retry is introduced. Requirement 15 proves actual upstream concurrency stays bounded and no automatic retry occurs. This keeps the established paid-request retry policy and avoids speculative cancellation success.

### R1-F007 — incorporated

Browser rendering now permits only parsed absolute HTTP/HTTPS Markdown and source links. Unsupported schemes and invalid URLs remain plain text; external links use noopener/noreferrer. Requirement 15 covers non-HTTP and invalid links. No raw HTML execution is introduced.

### R1-F008 — incorporated

GET /api/capabilities validates the same configured Host list before metadata; invalid Host gets the common 403 format. Origin is not mandatory for this unpaid GET. Requirement 9 includes rejection before capabilities are returned. Paid POST origin/host admission is preserved.

## Changes made

Changed only the selected specification and this generated author response. The focused sections are browser capture/interruption, link rendering, hosted-search configuration/availability, paired history, speech segmentation/backpressure, capabilities, operating limits and their acceptance requirements. Preserved the two-process architecture, tool/data-service boundary, one real AI and speech provider, hidden optional transcript, absence of private data, one-day prioritization and transfer instructions.

## Declined changes and rationale

Declined the optional automatic 429 retry and early slot release on client abort, choosing explicit Busy plus confirmed settlement. No required finding was declined. No live-free-request or speech-rate guarantee was inferred from provider rejection or character count.

## Verification

- Read the full sealed reviewer-response-1 and current specification, then checked all eight IDs against actual wording before revising. Protected response metadata was copied unchanged; protocol submission seals it.
- Checked the current [VAD API](https://docs.vad.ricky0123.com/user-guide/api/) for distinct speech-start, real-start and misfire hooks, and [AudioContext.suspend](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/suspend) for reversible playback suspension. Capture/playback separation and confirmation thresholds are chosen design requirements, not measured browser guarantees.
- Checked [Claude web-search documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool) for model-support discovery and organization-level rejection. The selected no-replay/latching policy is an explicit local design decision. No API key or live provider request was used here.
- Rechecked the speech arithmetic: 6 * 14 = 84 characters; two seconds existing plus six estimated seconds = eight seconds, leaving two seconds margin under ten. Actual PCM accounting remains mandatory because an estimate is not a hard duration bound.
- Ran git diff --check after the specification write: exit 0, no whitespace errors. Read the complete focused diff and verified that the architecture, retrieval fixture records, source contracts, tutorial priorities and repository-transfer instructions were preserved.
- Inspected git status: only the target specification is modified, with generated XPR collateral under docs/peer-reviews/1. No app source, lifecycle, provider configuration or private-state file was changed.
- The package-managed Claude launcher returned submitted with protocol_revision 3 and a distinct runtime session fingerprint. Authentic author wait delivered reviewer-turn-1-to-author at sequence 8, digest sha256:1a7e79b93bf00005fb0e38be526e6020e671e273b1bd008bda2402c17ab95d3f. The same Sol author fingerprint remains in protected metadata.
- Application boundary tests, real voice-rate calibration, acoustic speaker tests and live search-continuation validation are specified for the build repository. They have not been executed during this specification review and are not completion claims.
