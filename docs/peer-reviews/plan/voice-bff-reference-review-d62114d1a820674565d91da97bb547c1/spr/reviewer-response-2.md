> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/reviewer-response-2.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `c55bd9e74f4300b4d586f338f6b78bd31e1328df9eafc8e56a2a3ee6ea19b809`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-d62114d1a820674565d91da97bb547c1'
role: 'reviewer'
turn: 2
commit_mode: 'normal'
authority_assurance: 'unavailable'
artifact_path: 'docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md'
artifact_commit: '859174f5c5db919072807bba2ef017f5a7755cd1'
artifact_blob: '5e0d124a0cbef5b811604f408dbe72600315a889'
artifact_digest: 'sha256:db3c6df40ac34588bbb73e321dfa58610a13ef08cc03edf9fa66dd4f3c23b300'
agent:
  host: 'codex'
  provider: 'openai'
  model_id: 'gpt-6-astra'
  model_display: 'gpt-6-astra'
  session_fingerprint: 'sha256:26905761b314a738f4c13fa256f8a1bdc358ab76086141b9761e701741329250'
  identity_source: 'declared'
started_at: '2026-10-13T05:22:27.904Z'
submitted_at: '2026-10-13T05:38:54.625Z'
finding_ids: ['R2-F001', 'R2-F002']
answered_finding_ids: []
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

The author addressed the three original design gaps and the optional MIME suggestion. Two small follow-through corrections are required in the revised artifact: the new whitespace predicate is overescaped, and the live source-evidence contract omits the newly introduced dependency patch. These are concrete issues in the revision, not requests for broader architecture or another feature.

The existing authentic reviewer handoff wait returned `delivered` at sequence 10, delivery `author-turn-1-to-reviewer`, digest `sha256:ea32971b0334ef1e04daa3d8c4d5c7c71b3694903ce6272c0577dcc9853b0f40`. I read the complete author response, pending protected reviewer response and complete revised plan in four contiguous chunks. The current artifact digest matches protected metadata, and the accepted-spec digest remains `8512daa8c456af00628a16471d4b13526c7585172c223c8bfa0f2323bee4fff6`.

### Original finding disposition assessment

- R1-F001: resolved at planning level. Task 7 explicitly owns a narrow version-bound installed-package patch, deterministic installation failure, disposal cancellation guards, waiting for admitted inference, idempotent public destroy and actual-module release instrumentation. It no longer claims the unmodified API handles never-started instances. The patch and tests remain future implementation obligations. The one-hour estimate increase is disclosed, making the total 39 hours, range 28–57, while retaining the eight-hour checkpoint and owner authorization boundary.
- R1-F002: resolved. Immutable capture epoch/utterance/intent identity is distinct from an optional old answer token. Confirmed end uses capture ownership after deliberate answer invalidation, consumes once, and is revoked by explicit user/capture actions. Initial Listening and the full interruption-to-next-turn path now have required tests.
- R1-F003: the design rule and test coverage are resolved. Push boundaries are provisional, structured lexical tokens remain buffered, terminal flushing is explicit and partition tests preserve early stable speech. The literal code example needs the narrow correction in R2-F001.
- Optional MIME suggestion: adopted with exact media-type parsing, parameter validation and controlled-fetch cases.

The reread found no unrelated regression in task dependency order, the two-process architecture, all 15 specification mappings, owned root verifiers, normal/live/mock evidence distinctions or approval boundaries. This is plan review; no application build, dependency patch application or live-provider test was run. Authority assurance remains unavailable.

## Findings

### R2-F001 — Correct the whitespace regex in the new streaming scanner example

**Priority:** P2. **Location:** Task 6, `hasRightContext` code example.

The Markdown code block contains `/\\s/u.test(buffer[i + 1])`. In a JavaScript regular-expression literal, that matches a literal backslash followed by `s`, not whitespace. Since the argument is one character, it cannot satisfy that two-character pattern. Following the example therefore prevents every ordinary whitespace-delimited sentence from becoming stable in `push`, delaying speech until terminal flushing and defeating the early-speech requirement.

**Verification performed:** A read-only Node expression evaluated the displayed pattern on a space as false and the intended whitespace pattern on the same space as true. This was an isolated language check, not an application test.

**Required change:** Use `/\s/u` with one backslash in the literal code block, or an equivalent correct explicit whitespace predicate. Keep the planned test asserting that `push('Hello. Next')` produces an eligible first sentence before `finish()`, together with the new ambiguous-boundary tests.

### R2-F002 — Bind live evidence to the newly introduced VAD patch bytes

**Priority:** P2. **Location:** Task 7 dependency patch/provenance and Task 9 `sourceDigest` and live-evidence schema.

Task 7 now changes runtime behavior through `patches/@ricky0123+vad-web+0.0.31.patch`. Task 9 still defines the tested source digest over tracked `apps/`, `scripts/` and root package/lock/config files, excluding this new runtime input. After a successful live run, a later commit can modify only the patch; package versions and lockfile remain identical, the old tested commit remains an ancestor, and the enumerated source digest still matches. The current verifier contract can consequently accept old voice/lifecycle evidence against changed dependency behavior. Task 7's instruction to record a patch digest does not by itself require Task 9 to compare that digest to current patch or installed runtime bytes; its current JSON schema has no defined patch provenance field either.

**Required change:** Extend the source-digest domain to include tracked patch files and explicitly define the recorded/current VAD patch provenance comparison. Ensure the runtime actually exercised is the patched module with the recorded modified-file digest, rather than merely recording an upstream version. A small typed patch-provenance field or an equally explicit deterministic contract is sufficient; no new general provenance framework is needed.

**Verification:** Add read-only evidence-verifier tests showing that a patch-only modification, a missing patch and an unapplied/mismatched installed module cannot reuse a passing report. A documentation-only commit should still preserve valid source evidence. The patch itself and live test results remain implementation work.

## Required changes

1. Correct the literal Task 6 whitespace predicate and preserve the early-emission test obligation.
2. Include the new dependency patch and applied runtime identity in Task 9's evidence binding and regression tests.

## Optional suggestions

None beyond the already adopted MIME check. The maintenance burden of the VAD patch is now explicit and has a task owner; runtime correctness must be established by the planned actual-module and real-browser checks.

### Primary-source verification

I retained the round-one pinned MicVAD/API evidence and additionally inspected [pinned Silero release](https://github.com/ricky0123/vad/blob/de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d/packages/web/src/models/silero.ts). Its release method calls session release and then disposes state/sample-rate tensors, supporting the proposed instrumentation boundary. The [patch-package project documentation](https://github.com/ds300/patch-package#readme) confirms committed patch files and postinstall application as the mechanism. That mechanism makes patch bytes runtime-affecting inputs, which is why Task 9 must bind them. Neither source proves the proposed local patch works before it exists.

## Decision

revisions-requested
