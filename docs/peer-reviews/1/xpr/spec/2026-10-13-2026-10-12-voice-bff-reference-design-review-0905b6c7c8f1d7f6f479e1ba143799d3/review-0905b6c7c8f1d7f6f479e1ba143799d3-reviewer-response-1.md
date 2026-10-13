<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-0905b6c7c8f1d7f6f479e1ba143799d3"
role: "reviewer"
turn: 1
commit_mode: "normal"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md"
artifact_commit: "cd745923c83e7b45d1a795ffcf4e87a193d4771a"
artifact_blob: "fcde53a12d5e49cb1b02a957a18d7d6f2fe660f3"
artifact_digest: "sha256:44e70b02d0cac27217b805f387bdb6d8677a5f79ce136c33f2ebf4fd51d5422a"
agent:
  host: "claude-code"
  provider: "anthropic"
  model_id: "claude-opus-5-5"
  model_display: "claude-opus-5-5"
  session_fingerprint: "sha256:fda8e7de99ee2c1fed79750f470d63803a60856d5cb5b7c62647757e55d14659"
  identity_source: "runtime"
started_at: "2026-10-13T03:13:14.779Z"
submitted_at: "2026-10-13T03:16:16.952Z"
finding_ids: ["R1-F001","R1-F002","R1-F003","R1-F004","R1-F005","R1-F006","R1-F007","R1-F008"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---

Mode: `normal`

## Summary

The specification is coherent, well bounded for a one-day reference build, and unusually careful about trust boundaries (origin/Host admission before body reads, BFF-owned tool definitions, retrieval origin not chosen by the model, no silent fixture substitution, honest mock labeling, per-turn hosted-search budget). The client ↔ BFF ↔ AI/data layering, the directory layout and the test list are concrete enough to hand to a new build agent.

Four issues should be resolved before transfer, because a build agent following the text literally would either produce a voice loop that fails on ordinary answers or would have to invent policy at the most delicate points of the interaction:

1. The ten-second unplayed-audio bound is specified as a hard overflow that disables speech, but the 600-character speech segment and faster-than-real-time synthesis mean ordinary answers exceed it. It needs to be backpressure, with segment size aligned to the bound.
2. "New user speech immediately invalidates the previous generation" does not distinguish a raw VAD speech-start from a confirmed utterance, so coughs, noise or residual echo irreversibly abort paid turns, while the spec simultaneously asks to reject misfires and to stop playback within 200 ms.
3. Hosted web search is a baseline feature, but there is no configuration switch, no defined way to determine availability, and no defined behavior when the account/model rejects the tool; required settings also omit the origin/host allowlist the admission section depends on.
4. The client-held history policy for interrupted, failed and speech-interrupted turns is undefined, which directly affects the "Who owns it?" follow-up and the interruption acceptance case.

Four further items are optional. Decision: revisions requested.

## Findings

### R1-F001 — Ten-second audio backlog with hard overflow contradicts 600-character segments and normal synthesis speed

Location: `POST /api/speech` (segment cap 600 characters; pending text queue 2,400 characters; "Bound all generated but unplayed audio to ten seconds … If accepting additional audio would exceed the limit, stop every scheduled source … and disable further speech for that answer"); verification item 10.

Problem: At a typical synthesized speaking rate of roughly 14–17 characters per second, a single permitted 600-character segment is about 35–45 seconds of audio, and any sentence over roughly 150–170 characters is already more than ten seconds. Deepgram REST synthesis also normally produces audio much faster than real time. With requests issued sequentially as soon as the previous one finishes, a normal two- or three-sentence answer accumulates more than ten seconds of generated-but-unplayed audio within the first sentence's playback. The spec defines that state as overflow: stop all scheduled sources and disable speech for the answer. So the common case (a "fast PCM producer", which item 10 itself names) silences the answer rather than merely bounding lag. The text describes a safety limit but implements it as a failure trigger with no flow control before it.

There is a secondary interaction with the 20-second speech-request deadline: if the implementer reacts by pausing reads of the PCM response body to stay under the bound, a long segment keeps the Deepgram request open for its full playback duration and can exceed the deadline.

Required resolution:

- Treat the ten-second figure as a high-water mark for backpressure, not as the normal overflow trigger. Do not start the next `/api/speech` request until the outstanding audio (remaining current playback + scheduled + unscheduled PCM, as already defined) is below a low-water mark that leaves room for one maximum segment.
- Cap speech segments by expected duration so one segment fits under the bound (for example, split at safe word boundaries to about 120–150 characters, or derive the cap from a configured characters-per-second estimate), so a single response never needs to be throttled mid-stream.
- Reserve the stop-everything overflow path for conditions that flow control cannot handle (for example, a single response that still exceeds the bound, or a suspended playback clock that persists past a configured interval).
- State that the pending text queue (not the audio buffer) is where a long answer waits, and that a long answer exceeding the 2,400-character text queue disables remaining speech with a visible status — this is already specified and is the intended way a 1,024-token answer degrades.
- Revise verification item 10 so a fast producer with normal playback speaks a multi-sentence answer completely while outstanding audio stays at or below ten seconds, and keep a separate case where suspended playback or an oversize response triggers the overflow path.

### R1-F002 — Raw speech-start invalidation lets misfires and echo abort paid turns; the 200 ms interruption target needs a two-phase barge-in

Location: "Automatic turn behavior" step 7; "Reject VAD misfires/very short noise"; "Turn ownership and interruption" ("New user speech immediately invalidates the previous generation while Working as well as while Speaking … aborts its turn request"); the 200 ms interruption target; echo-cancellation paragraph.

Problem: The VAD exposes a raw speech-start event before it knows whether the sound is a real utterance (the referenced library also reports misfires for segments shorter than its minimum speech duration). The spec requires both immediate invalidation on "new user speech" and rejection of misfires, but does not say which VAD event commits the interruption. If invalidation happens on raw speech-start, a cough, keyboard noise or a burst of residual speaker echo aborts the in-flight turn request and speech irreversibly, even though the subsequent utterance is discarded as a misfire — the user loses a paid answer and receives nothing. If invalidation waits for the completed utterance, playback continues for the whole user utterance plus the 700–900 ms silence window, failing the 200 ms target and talking over the user. Speaker (non-headset) mode makes this worse, and the spec forbids the obvious workaround of muting listening during playback without offering an allowed alternative.

Required resolution:

- Specify a two-phase barge-in: on raw speech-start, pause or duck local playback reversibly (for example, suspend the playback AudioContext or set a gain node to zero) within the 200 ms target, without aborting requests; on confirmed speech (a minimum-duration confirmation, such as the pinned VAD release's "real speech start" callback if available, or a client-side duration check), commit the invalidation exactly as currently specified; on misfire, resume or restore the paused playback and keep the turn current.
- Apply the same rule while Working: a misfire must not abort a pending turn request.
- Name the permitted mitigations if acoustic echo cancellation is insufficient in speaker mode (for example, a higher VAD threshold or longer confirmation duration while Speaking), and allow speaker-mode self-triggering to be reported as a known limitation rather than solved by disabling listening.
- Add a verification case: a short noise/misfire during Speaking and during Working neither aborts the turn nor discards its audio, while confirmed speech still stops playback within the target.

### R1-F003 — Hosted web search availability, configuration and rejection behavior are undefined; required settings are incomplete

Location: "One day scope" ("provider-hosted public web search when supported by the configured Claude model/account"); Claude adapter web-search paragraph; `GET /api/capabilities`; "Required live settings"; origin admission paragraph ("a different port or additional loopback hostname requires explicit configuration").

Problem: Web search is in the baseline, and the spec says to show it as unavailable when unsupported, but it never says how the BFF determines support. Availability depends on the model, the configured tool version and organization-level enablement in the provider console; none of these is discoverable from the listed settings. If the BFF always includes the hosted-search tool and the account or model does not support it, the provider may reject the entire Messages request, which would turn every turn — including the Atlas lookup acceptance case — into `turn.failed`, rather than degrading only search. The required settings list also lacks the tool version, an enable/disable switch, and the permitted origin/host lists that the admission section requires to be explicitly configurable.

Required resolution:

- Add explicit settings, for example `CLAUDE_WEB_SEARCH` (enabled/disabled), the hosted-search tool version, and the permitted BFF origins/hosts (with the documented localhost defaults), to the settings list and sanitized example.
- Define the availability rule: `/api/capabilities` reports search as enabled only when configured on; if a live request is rejected specifically because the hosted tool or tool version is unsupported, mark search unavailable for the process with a visible reason, and state whether that turn fails visibly or is re-issued once without the search tool (a rejected request should not have produced output or charges, but say so explicitly given the no-automatic-retry rule).
- Make clear that the project-lookup path must remain usable when search is disabled or unavailable.

### R1-F004 — Conversation history policy for interrupted, failed and speech-interrupted turns is undefined

Location: `POST /api/turn` `history` field; "No session database is required: history is kept in browser memory"; "A completed visual answer can remain visible with an interrupted-speech marker … A partially generated answer remains visibly incomplete and is not silently treated as completed conversation history"; manual cases "Who owns it?" and "Interrupt an answer and ask about Beacon".

Problem: The client constructs history, but the spec only states one negative rule. It does not say whether (a) an answer whose text completed but whose speech was interrupted is included as normal assistant history; (b) the user question of an interrupted or failed turn is included, and if so, with what assistant placeholder; (c) a turn invalidated before `transcript.final` arrived contributes anything; or (d) how the eight-message/16,000-character cap is trimmed (oldest pair first, never splitting a user/assistant pair). These choices determine whether "Who owns it?" resolves to Atlas after an interruption and whether the model sees consecutive unanswered user questions. Different reasonable implementations would behave visibly differently in the acceptance script.

Required resolution: State the history rules explicitly. A suggested policy: completed-text answers are history regardless of speech interruption; an interrupted or failed turn contributes its recognized user text only if `transcript.final` (or typed text) is known, paired with a short neutral assistant marker such as "[answer interrupted]" or omitted together with its user text — choose one; trimming drops whole oldest pairs. Add a unit test for the chosen policy.

## Required changes

1. R1-F001: Replace the hard ten-second overflow-on-normal-production behavior with request-level backpressure (high/low-water marks), cap speech segments by expected duration so one segment fits under the bound, keep overflow only for unthrottleable conditions, and revise verification item 10 accordingly.
2. R1-F002: Specify two-phase barge-in (reversible pause/duck on raw speech-start; commit invalidation on confirmed speech; resume on misfire), apply it during Working and Speaking, name allowed speaker-mode mitigations, and add the misfire verification case.
3. R1-F003: Add web-search enable/version settings and the permitted origin/host settings to the required configuration; define how search availability is determined and what happens when the provider rejects the hosted tool, keeping the project-lookup path working.
4. R1-F004: Define the client history inclusion and trimming policy for completed, speech-interrupted, interrupted and failed turns, and test it.

## Optional suggestions

### R1-F005 — Confirm the provider accepts removing the hosted-search tool while its prior content blocks remain

The budget rule says that when the per-turn search allowance reaches zero, the BFF disables further hosted search "while preserving existing provider content blocks". Whether that is implemented by omitting the tool definition from the next Messages request or by another mechanism, the build agent should verify against the live API that a continuation (including a provider pause continuation) containing prior hosted-search use/result blocks is accepted without the tool definition; if it is not, document the alternative used (for example, keeping the tool with a cap that cannot be exceeded, or ending the turn with a truncated status). Adding this as an explicit verification note avoids a late surprise in item 11.

### R1-F006 — Concurrency admission can reject a legitimate barge-in turn while aborted turns still hold slots

With a two-turn-per-process limit, rapid successive interruptions can leave server-side work for aborted requests running until cancellation propagates, so the newest turn may receive HTTP 429. Because a 429 admission rejection performs no paid work, the spec could allow the client one short delayed retry for 429 specifically (distinct from the prohibition on retrying paid calls), or require slot release on observed client abort, and show a clear Busy state otherwise.

### R1-F007 — Restrict link protocols in rendered Markdown and sources

"No raw HTML from model output is executed" does not cover Markdown links. Model output and search results can carry `javascript:` or other non-HTTP schemes. Require that rendered links and source references permit only `https:` (and `http:` if desired), open with `rel="noopener noreferrer"`, and are otherwise rendered as text.

### R1-F008 — Protect `GET /api/capabilities` with the same Host validation

The capabilities endpoint is unpaid and not admission-gated. It exposes model labels and limits; under DNS rebinding a hostile page could read it unless Host is validated. Applying the existing Host check (not necessarily the Origin rule, since it is a GET) keeps the loopback posture consistent at negligible cost.

## Decision

revisions-requested
