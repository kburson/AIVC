# Task 10 independent review — AIVC #13

Reviewer: requested Astra 6 / high, genuine Codex session 01a13677-7abf-7dc0-a581-45f3b6823b88, canonically bound to #13 as agent. No reviewer delegation or identity override.

Source: c1c21bb24a60c3bc22096e09714fb89ce04b1446.
Base: 4dd63ecc98d84293f4f36aae66d5eb0fafa8d6db.
Scope: all fifteen owned files in the supplied review diff; task-10-brief.md is the requirement authority. Also read task-10-report.md, live issue Scope/AC/VC evidence, installed task/boot instructions, adjacent delivered retrieval schema and runtime pins.

## Verdict

Spec compliance: NeedsFix — one mixed-turn correlation case violates the required one-UUID stream invariant.
Quality: NeedsFix — reject the inconsistent error payload before freezing the shared decoder/validator contract.
Critical: none. Important: one. Minor: none.
The candidate source/digest must not be treated as accepted frozen authority until the finding is resolved and the changed exact head is verified and reviewed. This verdict does not claim Review, delivery, Close, CI, or live success.

## Important finding

### P2 — Reject a failure payload correlated to a different turn

Location: apps/web/shared/validation.ts:276–285, with acceptance completed by apps/web/shared/sse.ts:108–110.

The turn.failed branch independently validates its data.turnId as a UUID but never compares it with the already validated envelope turnId. TurnGrammar checks only the envelope ID and then accepts the failure as terminal. Consequently, an accepted stream for UUID A can finish with envelope UUID A and data.turnId UUID B, and both assertTurnSequence and decodeSse accept it. The accepted brief requires one UUID throughout and INVALID_STREAM for mixed IDs. AppErrorFields is the public correlation payload; retaining contradictory IDs makes consumers choose between incompatible identities and lets an error from another turn pass the frozen conformance boundary.

Focused reproduction on the exact reviewed source, without editing files: construct accepted(seq0,envelope A) followed by turn.failed(seq1,envelope A,data.turnId B), where A is the normative fixture UUID and B is 22222222-2222-4222-8222-222222222222. validateTurnEvent accepts both; assertTurnSequence returns normally; decodeSse yields both from independently framed JSON. Probe exited 0 and printed acceptedMismatchedFailureId:true. This is a novel case, not a rerun of the passing suite. Existing mixed-ID coverage changes only the envelope ID.

Fix: in validateTurnEvent, validate the failure payload ID once and reject it when non-null and unequal to base.turnId. Preserve null because the accepted AppErrorFields type explicitly permits it. Add a direct validator rejection plus collected-sequence and streaming regressions proving INVALID_STREAM for the mismatch, including the syntactically complete unterminated terminal case. Matching and null payload IDs should retain their documented behavior. Refresh the five-file digest and its doc value after the source change, then obtain exact-head verification and re-review.

## Positive review evidence

- Public discriminated types and the single AppError class match the accepted allocation; all four shared modules use standard browser APIs and local public imports. The actual Client Component probe reaches the shared implementations without performing service work.
- Multipart parsing enforces the measured cap, closed/unique field set, text-or-audio choice, UTF-16 limit and preserved text. WAV parsing checks RIFF size, chunk extents/padding, duplicate fmt/data and fixed PCM parameters/sample cap. Empty PCM remains valid for the later no-speech owner.
- Inbound history is strict and cloned; retainPairs implements oversized-newest omission followed by whole-oldest trimming, including the arbitrary-input bound required by the brief.
- The SSE implementation validates payloads, accepted seq0, consecutive envelope sequences, serialized lookup state, literal completion text, stable terminal behavior and EOF/protocol/abort classification. Tests use a hand-authored raw accepted frame and independent separator bytes, not only encoder round trips.
- Normative Atlas fixture values match delivered retrieval data and exact required ordering, text and simulated usage. Search remains explicitly unavailable simulation. Project nonempty string validation agrees with the existing retrieval JSON schema.
- Digest membership, order, raw-byte recipe, CLI guard and TypeScript declaration match the brief. Runtime/manifests preserve the delivered Node26/npm pins; this change introduces no package installation or sibling implementation.

## Verification evidence and limits

The live issue records all three ACs and all nine VCs at c1c21bb24a60c3bc22096e09714fb89ce04b1446. The retained canonical Test receipt 01M4VAEK8KXHDJ1JZ8CEX4HWHH names that SHA and Node26.8.1, with successful required unit/integration/slow checks, targeted contracts, digest, typecheck and build; lint/format carry explicit same-head Develop reuse provenance. The author report records 119 contract, 24 unit and 1 slow tests. Those are existing recorded results, not independently rerun results from this reviewer. Per instruction, broad passing coverage was not redundantly rerun. The only executed code verification was the focused mismatch probe above.

## Reviewed author rulings

- Classifying iterator acquisition failure as disconnected transport, preserving caller AbortError, and preserving a primary failure over secondary cleanup rejection fit the stable decoder contract.
- Safe integers for counters/sequence preserve exact arithmetic; this is a documented defensible bound before any consumers are frozen. Nonblank speech segment identifiers likewise avoid unusable public correlation IDs. No separate blocking finding is raised for these disclosed interpretations.
- Nonadaptive estimate compatibility and historical timing reconciliations are workflow evidence, not proof of API behavior; this review does not relabel them as adaptive forecasts or actor duration.

## CannotVerifyFromDiff / declined to judge

- Actual BFF admission, counted streaming body reads, deadlines, leases, provider work, native tool attempts/results and error sanitization: future server owners implement these. Public fixtures and codec tests do not prove actual upstream behavior.
- Whether a transcript came from an audio request, whether a public lookup represents an actually validated dispatch, and whether invalid native attempts caused zero retrieval calls: the shared event envelope lacks that external request/provider evidence; producer tests must establish it.
- Real browser current-generation suppression, safe source rendering, complete-pair admission, capture/playback and joined/live scenarios: assigned later consumer/capture/joined stories. No claim these already work.
- Fresh CI or production delivery/Close: canonical local exact-head Test evidence is present, but independent review is currently failing and remaining lifecycle gates belong to the orchestrator.

## Review operations

No source/index/HEAD/branch mutation, new tests, installed package changes, provider requests or cross-chat messages were performed. This Markdown is the sole review artifact. Reviewer task timing is tracked under #13; supported stop/release follows this report. Reviewed worktree was clean at the exact requested source.
