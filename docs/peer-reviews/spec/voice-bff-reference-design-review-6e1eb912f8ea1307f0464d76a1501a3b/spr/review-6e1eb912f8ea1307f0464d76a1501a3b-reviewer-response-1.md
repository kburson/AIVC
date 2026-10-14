> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/spr/review-6e1eb912f8ea1307f0464d76a1501a3b-reviewer-response-1.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `b195f62964250babad17749ebe99bf8e9826ff3e22cea3d849fe25711f7392e9`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-6e1eb912f8ea1307f0464d76a1501a3b'
role: 'reviewer'
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
  model_id: 'gpt-6-astra'
  model_display: 'gpt-6-astra'
  session_fingerprint: 'sha256:149b59c624fd6215473bf95928954a60b2586e1521d46cacc426b9be0c817525'
  identity_source: 'declared'
started_at: '2026-10-13T02:51:31.320Z'
submitted_at: '2026-10-13T02:59:07.476Z'
finding_ids: ['R1-F001', 'R1-F002']
answered_finding_ids: []
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

The specification preserves a useful, small client/BFF/provider/data-service architecture and a clear hands-free interaction. It correctly distinguishes browser utterance segmentation from streaming STT, retains native tool blocks within an active turn, separates display text from speech delivery, and requires actual live acceptance evidence. This is a specification review; no implementation, provider call, microphone session, or latency measurement was performed.

Two bounded corrections are required before transfer: enforce the same-origin browser boundary before invoking paid providers, and include scheduled-but-unplayed audio in the playback backlog limit. Neither requires accounts, public deployment, or a voice gateway.

Primary references checked during this review:

- [VAD API](https://docs.vad.ricky0123.com/user-guide/api/): the documented speech-end callback returns normalized 16 kHz samples, and the adapter offers speech-start, misfire, and stream lifecycle hooks. This supports the proposed WAV and cleanup boundaries.
- [Deepgram media output settings](https://developers.deepgram.com/docs/tts-media-output-settings): REST supports linear16 with no container at 24 kHz. Incremental SDK delivery remains an implementation verification requirement, as already specified.
- [Claude web search](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool): direct hosted search is supported, including an explicit direct-caller setting for newer versions. Its search cap is per Messages request; see the optional clarification below.
- [Next.js BFF guide](https://nextjs.org/docs/app/guides/backend-for-frontend): Route Handlers are general HTTP endpoints; a same-origin frontend does not itself restrict their callers.

## Findings

### R1-F001 — P2: Specify request-origin admission for paid local endpoints

Location: artifact lines 162–170 and 220–226, the multipart turn endpoint and local operating limits.

The intended browser boundary is same-origin, but the server contract only specifies loopback binding, payload validation, and concurrency admission. It does not require rejection of cross-origin requests. A page served from another local origin can construct the accepted multipart typed-turn fields and submit them to port 3000. Without a server admission check, that request can invoke the owner's configured Claude key even when the browser cannot read the response. Keeping secrets on the server and omitting CORS response headers do not prevent this side effect. This is a defect in the stated local-only boundary, not a request to add production authentication.

[MDN's CORS documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#simple_requests) explains that form-compatible POSTs, including multipart form data, can be sent without a CORS preflight; CORS still controls reading their responses. Browser-specific private-network defenses are not a substitute for the application's own same-origin contract.

Require a small server-side origin/host policy before body processing and before provider work. Define the configured permitted loopback origin(s), reject mismatched and null origins, and explicitly decide how missing Origin is handled for any documented local CLI/test client. Do not derive the trusted origin solely from an unchecked Host or forwarded header. Apply the policy consistently to both paid endpoints. Add a stable 403 error and an offline acceptance test showing that a well-formed cross-origin typed request produces no model or speech call.

### R1-F002 — P2: Count scheduled audio in the ten-second backlog limit

Location: artifact lines 196–200, speech queueing and playback.

The current limit counts only unscheduled playback buffers. A conforming implementation can immediately schedule each incoming PCM chunk in an AudioBufferSourceNode and keep the unscheduled queue near zero while accumulating a long schedule ahead of the current playback time. Sequential speech HTTP requests do not prevent this: generation can finish faster than the user hears it, so subsequent segments can also be scheduled far ahead. The result violates the stated objective of avoiding minutes of lag while satisfying the literal ten-second check.

[AudioBufferSourceNode.start documentation](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/start) confirms that audio sources can be started at future times on the audio context clock. Scheduling therefore does not mean that audio has been played or removed from the outstanding backlog.

Define the limit over all generated but unplayed audio, including the remaining currently playing portion, future scheduled sources, and unscheduled PCM. Require the bound to be checked before accepting/scheduling more audio. On overflow, stop scheduled sources, clear buffered audio and pending speech text, abort the active speech request, and disable further speech for that answer with the already specified visible status. Keep text generation available. Add a deterministic fast-producer/slow-playback test, including a suspended playback clock, so immediately scheduling everything cannot bypass the limit.

## Required changes

1. Resolve R1-F001 with explicit local origin/host admission, its missing-Origin policy and error contract, plus an offline no-provider-work rejection test.
2. Resolve R1-F002 by bounding total generated-but-unplayed audio and defining complete overflow teardown, with a test covering scheduled backlog.

## Optional suggestions

1. Clarify that the two hosted searches are a BFF-turn budget carried across all Messages requests, including tool continuations and provider pauses. Anthropic's max_uses is per request; setting it to two on each of three rounds would permit six searches. The current per-turn intent is correct, but a short remaining-budget rule and a multi-round offline check would prevent an easy adapter mistake.
2. State explicitly that new user speech invalidates the previous generation while Working as well as while Speaking. The present interruption paragraph describes an answer already playing; a slow lookup or output-muted answer should receive the same stale-output protection.

## Decision

revisions-requested
