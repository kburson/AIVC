<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-0905b6c7c8f1d7f6f479e1ba143799d3"
role: "reviewer"
turn: 2
commit_mode: "normal"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md"
artifact_commit: "bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac"
artifact_blob: "1f3b495cdc97e23b2b50786f4ca42cdef1e95d6c"
artifact_digest: "sha256:8512daa8c456af00628a16471d4b13526c7585172c223c8bfa0f2323bee4fff6"
agent:
  host: "claude-code"
  provider: "anthropic"
  model_id: "claude-opus-5-5"
  model_display: "claude-opus-5-5"
  session_fingerprint: "sha256:fda8e7de99ee2c1fed79750f470d63803a60856d5cb5b7c62647757e55d14659"
  identity_source: "runtime"
started_at: "2026-10-13T03:13:14.779Z"
submitted_at: "2026-10-13T03:26:36.481Z"
finding_ids: ["R2-F001","R2-F002","R2-F003","R2-F004"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---

Mode: `normal`

## Summary

I re-read the whole revised specification (artifact blob `1f3b495c…`) against author-response-1 and checked each disposition against the actual text, not the author's summary. All four required findings are resolved, and the four optional items are incorporated or declined with sound reasons. I found no new blocking contradictions. The architecture, transfer boundary, fixtures and one-day priorities are unchanged.

Disposition verification:

- **R1-F001 (resolved).** The speech section now uses request-level backpressure: a ten-second high-water mark, a two-second low-water mark for admitting the next request, and an effective segment cap of `min(120, floor(6 × SPEECH_CHARS_PER_SECOND))`, which is 84 characters at the default of 14. The arithmetic holds: at most 2 s outstanding plus an estimated 6 s segment leaves a 2 s margin. The BFF enforces the same cap, so the transport can no longer bypass client segmentation. Each small response drains promptly, which keeps the 20-second request deadline coherent. Emergency teardown now applies only to an oversize response or a playback stall of more than 3 s. Requirement 10 now tests the normal fast-producer path for complete speech and tests the emergency paths separately. Long answers wait as text, and the 2,400-character text cap is the explicit way they degrade. This fixes the contradiction I reported.
- **R1-F002 (resolved).** The barge-in is now two-phase:
  1. A raw speech-start suspends a dedicated playback AudioContext, separate from capture, so listening continues. No requests are aborted.
  2. Confirmed speech (`onSpeechRealStart` or an equivalent positive-frame check, 400 ms initially) commits the invalidation.
  3. A misfire restores playback and keeps a pending Working turn current.

  Stale candidates cannot revive a canceled generation. The 200 ms target is now measured honestly from callback to silence, separately from confirmation-to-cancellation and from acoustic onset. Speaker-mode mitigations are named, and unresolved self-triggering is reported as a limitation instead of being worked around by disabling listening. Requirement 12 and the manual misfire case cover this. Suspending a context freezes `currentTime`, so retained scheduled sources resume contiguously, which makes the reversible pause sound.
- **R1-F003 (resolved).** `CLAUDE_WEB_SEARCH`, `CLAUDE_WEB_SEARCH_TOOL_VERSION`, `BFF_ALLOWED_ORIGINS`, `BFF_ALLOWED_HOSTS` and `SPEECH_CHARS_PER_SECOND` now have sanitized defaults, and invalid admission configuration fails closed. Search availability has four explicit states, and an explicit hosted-tool rejection latches search off for the process with a reason. The author chose to fail the affected turn visibly with `SEARCH_UNAVAILABLE` rather than replay it. That is a legitimate choice under the no-replay rule, and project lookup stays usable. Requirement 13 covers it.
- **R1-F004 (resolved).** History is whole-pair and completed-text only. Interrupted, failed, truncated, no-speech and pre-transcript turns contribute nothing, and no placeholders are invented. The oldest pairs are trimmed whole, and an oversize single pair is omitted with a notice. The BFF validates the pair structure as untrusted input. This makes the "Who owns it?" follow-up after an interrupted Beacon answer deterministic. Requirement 14 covers it.
- **R1-F005 (incorporated).** Live validation of a continuation that keeps the prior hosted blocks but omits the exhausted tool definition is now required. If the provider rejects that form, the turn ends with an explicit partial/truncated status instead of re-enabling search.
- **R1-F006 (retry declined, Busy specified).** Keeping a slot until upstream work settles preserves the paid-work bound. In the voice path, confirmation-time abort usually precedes the new utterance's end-of-turn silence, so Busy should be rare. I accept declining the retry.
- **R1-F007 / R1-F008 (incorporated).** Rendered links accept only absolute HTTP(S) URLs, and the capabilities GET validates Host.

What remains is tuning and UX refinement, recorded below as optional suggestions. None blocks transfer to the implementation repository.

## Findings

None.

## Required changes

None.

## Optional suggestions

### R2-F001 — One-word spoken interruptions may be classified as misfires

The most natural spoken interruptions are short words such as "stop", "wait" or "no". With a 400 ms minimum of positive speech, many of these will fall below the threshold. The VAD will then report a misfire and the old answer will resume, which is the reverse of what the user intended. The threshold is already configurable, and this is a tuning tradeoff rather than a contradiction. Consider adding a manual case ("say 'stop' during Speaking") and recording the confirmation setting that was tested. If short commands are not supported at the chosen threshold, document that as a known limitation, as the spec already does for speaker echo.

### R2-F002 — Text-queue overflow silences moderately long answers almost immediately

Backpressure makes unsent text accumulate at model speed while it drains at speaking speed. The pending queue therefore holds roughly the whole answer minus what has been spoken. Under the current rule, an answer only slightly over 2,400 characters clears the queue and disables speech within the first segment or two. Speaking the first 2,400 characters and then showing the "speech stopped; remainder on screen" status would degrade more gracefully. In other words, stop accepting new text into the queue at the cap instead of clearing what is already queued. The current behavior is explicit and bounded, so this is optional.

### R2-F003 — Prefer clause boundaries when splitting to the 84-character cap

Many ordinary sentences exceed 84 characters, so they will be split, and each part is synthesized independently. Splitting at an arbitrary word boundary resets intonation in mid-phrase. A brief preference order would usually sound noticeably more natural at no extra cost: sentence end, then clause punctuation (`;`, `:`, `,`, em dash), then a word boundary.

### R2-F004 — Confirm the Models API exposes the search-support signal the availability check relies on

The availability rule says that failed or unknown model support from the Models API disables search. If the pinned API or SDK does not expose a per-model hosted-search support field, search would be permanently disabled even on accounts that support it. The spec should not leave this to chance. Have the build agent confirm that the field exists. If it does not, treat the model check as "configured, not account-verified" and let the first live request settle availability, using the rejection-latching path that is already specified.

## Decision

accepted
