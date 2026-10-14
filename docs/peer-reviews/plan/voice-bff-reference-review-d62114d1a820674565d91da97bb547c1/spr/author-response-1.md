> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/author-response-1.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `ea32971b0334ef1e04daa3d8c4d5c7c71b3694903ce6272c0577dcc9853b0f40`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:f81da1894a46ceb20866070833b4e99ef536ef633542b418783d29e6a981dbd8" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-d62114d1a820674565d91da97bb547c1'
role: 'author'
turn: 1
commit_mode: 'normal'
authority_assurance: 'unavailable'
artifact_path: 'docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md'
artifact_commit: 'f0a4971adf76da1db1b4d4efd626faf4842089a3'
artifact_blob: 'e2b2bf28e5287e4416e676409002d7745c1f48f6'
artifact_digest: 'sha256:810b1f1a18964fa185fe2e92b358cab9d2a259d5b43fbbc56ab03577c91483f1'
agent:
  host: 'codex'
  provider: 'openai'
  model_id: 'gpt-6.1-sol'
  model_display: 'gpt-6.1-sol'
  session_fingerprint: 'sha256:48daf6ba8b2a5f061e5b9a3cf267a2f0de1f0f3a80cf29b2774ae19f87408a30'
  identity_source: 'runtime'
started_at: '2026-10-13T05:21:22.349Z'
submitted_at: '2026-10-13T05:36:04.537Z'
finding_ids: []
answered_finding_ids: ['R1-F001', 'R1-F002', 'R1-F003']
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

Addressed all three sealed findings as plan corrections, and adopted the optional Deepgram MIME hardening. The revised plan keeps the accepted two-process architecture and all nine task boundaries. It makes a concrete maintained dependency decision for the pinned VAD cleanup defect, separates capture ownership from canceled answer ownership, and defines incremental speech stabilization across arbitrary provider chunks.

Normal commit mode; authority assurance unavailable. This revision is planning evidence only. No application source, dependency installation, VAD patch application, provider call or application/live test was performed.

## Finding dispositions

### R1-F001 — Accepted and addressed

Verified the pinned MicVAD source order independently: model allocation occurs before deferred start; the original destroy reaches a complete-audio-instance guard before model release. Stopping a stream and caller-owned context alone cannot satisfy the model/session release contract. The pinned Silero release reaches ORT session release and state/sample-rate tensor disposal.

Task 7 now explicitly owns a checked-in narrow patch `patches/@ricky0123+vad-web+0.0.31.patch` applied using exact `patch-package` 8.0.1 through `postinstall: patch-package --error-on-fail`. The app uses the patched package module entry, and never an unpatched CDN bundle. The patch is an application dependency fix, with upstream and patch digests recorded and fresh-install mismatch failing setup. It does not alter globally installed ai-peer-review or its Node runtime.

The defined lifecycle contract handles every allocated instance through the patched public destroy: mark destruction before new start/frame admission; stop already acquired tracks; check destruction after awaited initialization and before connection/listening; await pending initialization/inference; guard optional nodes; release model exactly once despite missing nodes; and close contexts according to ownership. A new instance arriving after Stop is destroyed without starting capture. A started-but-pending instance is canceled immediately through destroy, rather than allowed to activate before later cleanup. Cleanup errors remain visible.

The planned `vad-lifecycle.test.ts` must use the actual patched MicVAD implementation with instrumented model/session/tensor boundaries. It covers late model allocation after Stop, worklet failure after allocation, successful worklet loading after cancellation, normal cleanup, simultaneous destroy calls, inference-settlement ordering, zero post-cancel listening/submission and a successful fresh Start. A generic adapter destroy spy cannot establish the result. The existing real-browser asset/ORT smoke gate remains distinct.

This is an achievable version-bound dependency/lifecycle choice, not a claim the public unmodified API already supports it. The code patch and its tests remain implementation obligations. Task 7 expected effort increases from 4 to 5 hours and its range from 3–6 to 4–8; total bottom-up expected effort increases from 38 to 39 hours and range from 27–55 to 28–57. The eight-hour timebox remains unchanged. Root issue metadata will be reconciled after review rather than mutated during the live seal.

Primary sources checked: [pinned MicVAD](https://github.com/ricky0123/vad/blob/de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d/packages/web/src/real-time-vad.ts), [pinned Silero release](https://github.com/ricky0123/vad/blob/de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d/packages/web/src/models/silero.ts), [package entry metadata](https://github.com/ricky0123/vad/blob/de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d/packages/web/package.json). Registry metadata confirms patch-package 8.0.1 exists; no install was done.

### R1-F002 — Accepted and addressed

The original answer-token guard was insufficient for the confirmed utterance's later end. Tasks 7 and 8 now define an immutable `CaptureToken={epoch,utteranceId,intentVersion}`, attached synchronously to raw-start/real-start/misfire/end callbacks, and `Candidate={capture,answerToken:TurnToken|null,phase}`. Old answer ownership is retained only for old-output cancellation and tentative restoration.

Confirmation uses capture identity, marks the candidate confirmed and deliberately cancels the old answer when present. End uses matching current capture epoch/intent/utterance identity plus confirmed/unconsumed state; it does not require the old answer generation to survive. It consumes admission before beginning the new answer generation. Initial Listening has answerToken null and follows the same automatic confirmation/end path.

Typed submission, Stop, microphone mute, overlong discard, restart and a newer candidate revoke the old captured utterance independently. Output mute only cancels output. Misfire and delayed playback suspend/resume still require the same tentative capture and current old answer, so confirmation cannot restore obsolete audio.

Planned tests now include the entire raw-start → confirmation → answer invalidation → end sequence, exactly one submission, initial no-answer submission, duplicate end, and invalidation by each intervening action. Late end/promise callbacks carry their original token; they never acquire fresh ownership.

### R1-F003 — Accepted and addressed

A `push` boundary is now explicitly provisional. Task 6 buffers ambiguous trailing punctuation and open URL/citation/Markdown/code tokens across pushes. Stable punctuation needs real right-side whitespace plus closed lexical state and the decimal/abbreviation/URL exceptions. A partial URL or formatting delimiter is never sanitized as if complete. Only `finish()` provides actual answer-end flushing, once at an allowed terminal event. Failure/interruption cancels unsent text.

The planned tests compare each representative full input against every character split and one-character chunks, require identical eventual sanitized speech segments and prohibit premature emission after `3.`, `https://example.`, `Dr.` and open markup/citation prefixes. They also retain an early eligible-sentence test before model completion. The backlog limit includes uncommitted scanner text plus sanitized unsent queue, preventing incomplete tokens from escaping the 2,400-character bound.

No streaming text or speech test was executed during this plan-only correction.

## Changes made

- Task 7 now owns the narrow dependency patch, installation failure gate, actual-implementation cleanup tests, provenance and revised effort.
- Tasks 7/8 share explicit immutable capture identity and independent answer cancellation semantics.
- Task 6 defines incremental lexical buffering and chunk-partition tests.
- Task 5 adopts exact MIME parsing instead of a string prefix. It rejects contradictory rate/channels, malformed/duplicate parameters and a type such as audio/l16evil; only supplied compatible PCM parameters support the normalized response. Absent rate/channels use the fixed requested contract, with actual PCM still separately verified live.
- All nine task Story Intent sections and the accepted specification bytes remain unchanged.

## Declined changes and rationale

None. All three required findings and the optional MIME suggestion were adopted.

## Verification

Executed plan-only checks:

- `git diff --check`: exited 0.
- Read-only installed `runDecomposeCheck` API on issue #2 and revised plan: `must-split`, nine tasks, `decomposition-ready`, no readiness blockers and an empty Story Intent violation list for every task. The expected must-split classification remains; it is not Plan approval or permission to Develop.
- Revised plan SHA-256 before submission: `db3c6df40ac34588bbb73e321dfa58610a13ef08cc03edf9fa66dd4f3c23b300`.
- Accepted spec SHA-256 remains `8512daa8c456af00628a16471d4b13526c7585172c223c8bfa0f2323bee4fff6`.
- Plan diff is limited to the reviewed artifact. No source, package manifest, installed dependency, accepted spec, lifecycle approval or issue-state mutation was made.

Application commands, patch application/release instrumentation, VAD assets, real browser timing and live provider acceptance remain future execution gates. Sealed submission and later reviewer decision, not these plan checks, establish review disposition.
