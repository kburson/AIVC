> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/89fc7a6125cd4b2be6f0f338dea928bd81bcea45/docs/peer-reviews/spec/aivc-interactive-tutorial-design-review-cb28e9fe5863446ca5d949d96998909c/sar/astra-sar-report.md) and its exact bytes remain available in the [tutorial evidence archive](../../../../quality-evidence/2026-10-14-25-tutorial-originals.json).
> Original SHA-256: `1cd9639f00a21baa697767d285be312090b80eb3c6689cae76caf71ae28bec55`. Review acceptance and protocol hashes apply to those original bytes.

# AIVC interactive tutorial specification — native SAR

Date: October 13, 2026.

**Outcome: revisions needed.** Two specification-level gaps should be resolved before treating this version as ready for implementation planning: admission to the tutorial's own paid/source-reading server, and deterministic selection when a course edition and the checked-out revision differ. The architecture and course scope are otherwise coherent. The optional suggestions below are not acceptance blockers.

## Review identity and evidence boundary

- Tracking story: AIVC #15, supplied by the coordinating author as the authorized design story. The coordinator owns binding, timing, lifecycle, and subsequent changes.
- Reviewed artifact: `docs/superpowers/specs/2026-10-13-15-aivc-interactive-tutorial-design.md`.
- Author-provided pinned Git revision: `858559d527668ac7fed7310c14d16e914a2dd744`.
- Independently observed artifact SHA-256: `b6ac0743e9346dc0074361413a451ec4e5920a31da87ec2a3963fdb577c53214`, matching the supplied digest.
- Requested provider/model/effort: Codex, `gpt-6-astra`, `medium` (the requested default effort).
- Observable execution context: this report was produced by the native child review task `/root/tutorial_sar`. The task invitation contains the requested model/effort. This session has no independent provider-certified per-turn model/effort attestation to attach. Requested selection is not presented as such an attestation.
- Review type: one native agent SAR. No two-party SPR/XPR was started; no sealed acceptance, consensus, broker receipt, or separately attested reviewer independence is claimed.
- Git boundary: no Git commands were run. Consequently, the supplied revision-to-file relationship is author-provided; the file digest itself was verified from the local bytes. No implementation or specification changes were made. Only this report and its parent directory were written by this review task.
- Verification scope: document review, reference-contract comparison, artifact hashing, and targeted primary-documentation reads. No application, browser, microphone, Postman, paid provider, or live-lab execution was performed.

A combined read-only shell command was rejected by the workspace hook as `WRITE_CODE` while #15 was in Backlog. The command did not execute. Ordinary `sed -n` reading subsequently succeeded; the rejection did not prevent this review. No state transition, identity substitution, or hook modification was used.

## Sources reviewed

1. The complete target specification, lines 1–261, at the digest above. All target line references below refer to these bytes.
2. Repository `AGENTS.md`, `.codex/skills/peer-review/SKILL.md`, and `.codex/peer-review-orchestration.md`, especially reviewer boundaries, terse communication, shared collateral layout, and native SAR being distinct from a two-party protocol.
3. `docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md`: architecture, retrieval behavior, browser/BFF admission, turn input and SSE contract, speech/PCM contract, capabilities, verification requirements, and original tutorial scope.
4. `docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md`: global constraints, source authority, architecture, interface ownership, toolchain, media limits, task/verification structure, and delivery documentation. This was a targeted dependency review, not a fresh review of every implementation-plan checkbox.
5. Complete `docs/superpowers/plans/2026-10-13-2-node26-parallel-execution-amendment.md`: Node/npm baseline, precedence, integration dependencies, shared-file ownership, and unchanged acceptance obligations.
6. [Next.js BFF guidance](https://nextjs.org/docs/app/guides/backend-for-frontend), read during this review: Route Handlers expose HTTP endpoints; the framework choice alone does not establish endpoint admission.
7. [MDN CORS guidance](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#simple_requests), read during this review: some cross-origin requests are sent without preflight, and response-reading restrictions are distinct from request-side protection.
8. [Deepgram media output settings](https://developers.deepgram.com/docs/tts-media-output-settings), read during this review: REST supports `linear16`, `container=none`, and 24 kHz; default REST output uses a WAV container.

No fresh claim is made about the state of trunk, PR #12, issue completion, installed application packages, or account-specific model availability. The target correctly labels its earlier discovery snapshot as historical and requires revalidation. Its specific runtime authority is assessed against the supplied amendment rather than an inferred replacement toolchain.

## Required revisions

### SAR-01 — P1: Specify admission for the tutorial's own paid and source-reading endpoints

**Location:** target lines 63, 125–137, 170, 206–208, and 225–231.

**Evidence:** The tutorial introduces an independent server at port 3002 with `POST /api/tutorial/tutor`, learner-owned Anthropic credentials, approved local/GitHub retrieval, and possibly private-fork evidence. It specifies loopback binding, retrieval allowlists, model limits, safe rendering, and server-local secrets. Its explicit Origin/Host admission rule at line 170 applies to the existing reference BFF at port 3000. Neither the tutor section nor acceptance defines corresponding admission for the tutorial server itself. Request media-type enforcement is also unspecified, so it cannot currently be relied on as an alternative control.

**Impact:** A conforming implementation could protect the reference BFF yet leave its new tutor endpoint callable by unintended browser origins. Loopback binding does not itself establish which browser page initiated a request. Depending on the eventual body parser and headers, an unintended request can cause paid work or source retrieval/transmission even when the caller cannot read its response. More broadly, source/status routes need a defined host boundary if they expose local configuration or private source metadata. This is a missing design invariant, not evidence that an existing implementation is exploitable. The distinction between sending requests and allowing response reads is documented in [MDN's CORS guidance](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#simple_requests).

**Required action:** Define a tutorial-specific admission policy. A bounded choice consistent with this repository is: configured loopback Host allowlist for tutorial server endpoints; explicit tutorial Origin allowlist plus matching Origin/Host for paid tutor requests; rejection of missing, malformed, null, disallowed, or mismatched origins before reading a body, retrieving sources, or invoking providers; no trust derived from unchecked forwarded headers. State which non-paid GET endpoints require Host only and whether any source-returning endpoint has stronger checks. An equivalently explicit alternative is acceptable. Reuse policy concepts without expanding the reference BFF allowlist. Identify it as browser-origin protection, not local-process authentication.

**Acceptance evidence to add:** Requests from another local page, an external origin, null/missing Origin, disallowed Host, and mismatched Origin/Host produce a stable rejection with zero source/provider calls. A valid tutorial request succeeds. If any parser accepts safelisted content types, exercise those requests too. Preserve independent startup and configured-port behavior.

**Why this belongs in the specification:** Which callers may spend the learner's API budget or cause approved local/private evidence to leave the machine is a trust-boundary decision. Exact helpers, response schema details, and numeric budgets remain implementation-plan work.

### SAR-02 — P2: Resolve course-edition revision versus local HEAD before ordinary retrieval

**Location:** target lines 129, 141–152, 195–206, 225–227.

**Evidence:** Local source mode resolves curated files from repository HEAD (line 143). Each course edition pins a reference revision, comparisons are explicitly selected, and ordinary lessons/answers may not silently mix revisions (line 146). The request also carries both course edition and source mode. There is no defined normal behavior when the edition is pinned to commit A but the learner clones or advances to HEAD B. This is an expected lifecycle, not an exceptional corrupt state. The same policy question affects conversation context retained from an earlier revision.

**Impact:** Two reasonable implementations differ materially: one retrieves HEAD B into the lesson built for A, another refuses the request, and another silently uses the course snapshot. Visible revision labels alone do not determine whether the first answer is an intentional comparison. An implementer cannot select the default or pass a precise mismatch test from the current prose without making a product/source-authority decision. Reading tracked working-tree bytes and attaching HEAD metadata would also violate the existing working-copy distinction, so the chosen policy needs a committed-byte guarantee.

**Required action:** Define precedence and mismatch behavior in a short source-selection contract. Recommended: ordinary course learning/tutoring uses the edition's pinned snapshot; choosing a different local HEAD or GitHub revision enters an explicit compare/current-source experience with separate revision labels and no implicit reuse of prior-revision context. If local HEAD must remain the ordinary default, explicitly specify the mismatch prompt/failure and how a compatible edition is selected. Freeze the selected revision for the whole request, retrieve committed bytes for committed mode, and use only the opt-in working-copy mode for changed local bytes. Explain what happens when the chosen commit is unavailable locally or remotely; a fallback may preserve authored lessons but must not silently answer from a different revision.

**Acceptance evidence to add:** Edition A with HEAD B and a changed mapped file has a deterministic displayed state and source choice; a branch/ref change during retrieval cannot mix bytes; dirty mapped files stay excluded from committed evidence; changing edition/revision does not carry unlabelled evidence from previous tutor context; unavailable revision preserves the course with an explicit source gap.

**Why this belongs in the specification:** Default source authority and learner-visible comparison behavior are part of the promised learning experience. Git object access, caching libraries, and exact context-envelope schemas can remain in the plan.

## Optional improvements — not blockers

### SAR-O1 — P3: Make the cold offline verification boundary explicit

**Location:** lines 152, 199, 220–222.

The text already promises bundled material and an installed snapshot, so offline support is a substantive requirement. Clarify that verification starts after documented toolchain/dependency installation, with an empty runtime retrieval cache and external networking disabled, then starts the local tutorial and opens it in a fresh browser session. State whether producing the initial build is included. This prevents an implementation from passing only because the reviewer previously warmed GitHub, fonts, narration, or remote image caches. An offline browser-only/PWA restart without the local server is not presently promised and need not be added.

### SAR-O2 — P3: Define acceptance checkpoints for Atlas versus the complete course

**Location:** lines 26, 210–214, 223–224.

The sequence is sensible: complete Atlas first, then deepen the eight modules. Add explicit checkpoint labels so the Atlas slice can be reviewed without appearing to satisfy the full eight-module acceptance criterion. Identify the no-key Atlas completion path separately from its credential-dependent tutor/live demonstrations. Preserve unverified live checks when credentials are absent; a simulation is not a substitute for required live evidence. The governed story breakdown, estimates, and precise dependencies properly belong in the later plan.

### SAR-O3 — P3: Carry inherited media limits into the Postman publication checklist

**Location:** lines 168, 181, 187–189.

The four surfaces and raw-PCM distinction match the reference design. In the plan/content checklist, require BFF examples to derive or explicitly reference the authoritative turn fields (`turnId`, `history`, exactly one of text/audio), WAV constraints (mono PCM16/16 kHz, 30 seconds, 2 MiB body), speech IDs, and effective speech text cap. Direct Deepgram examples can demonstrate broader formats, but those must not be presented as formats accepted by the narrower BFF. Verify local sample-file selection after import on another checkout. This is elaboration of already-inherited contracts, not a request to copy the entire BFF schema into this specification.

### SAR-O4 — P3: Add concrete accessibility and private-cache checks to the later plan

**Location:** lines 87, 135, 150–160, 172, 206, 231–232.

The specification already requires keyboard, caption, transcript, reduced-motion, text-only, and safe-rendering paths. The plan should choose a supported-browser/accessibility target and verify focus, non-color diagram meaning, readable textual sequences, and synchronized speed/seek behavior with actual assistive-technology checks. Also specify where private source caches and local lab observations are stored, their exclusion from Git/exports/logs, and how the learner clears them. Browser-memory transcript storage does not automatically describe server logs or source-cache retention. Existing transmission disclosure and private-fork opt-in are appropriate; this suggestion does not introduce hosted accounts or a general consent system.

## Coverage and coherence assessment

| Review area                                   | Assessment                                                                                                                                                                                                                                                                                      |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local monorepo and clone/own-key setup        | Covered. Independent tutorial process and namespaced configuration are explicit; toolchain precedence defers to the Node 26 amendment and accepted current authority. No runtime upgrade is authorized here.                                                                                    |
| Three audience paths and developer baseline   | Covered. Product/developer/architect depth shares modules, stable concepts, sources, and progress; JavaScript/TypeScript fluency is explicit. Per-path scripts and exercise rubrics can be authored in the plan.                                                                                |
| Technology fundamentals and decision matrices | Covered across all five requested technologies plus HTTP/SSE/audio, reliability, delivery, and alternatives. The design distinguishes historical reasons from new instructional analysis and avoids invented measurements.                                                                      |
| Architecture and domain/provider ownership    | Coherent. Next.js hosts the reference BFF, Fastify owns synthetic lookup, providers remain separate dependencies, and the tutorial has its own server. Optional direct-service/provider labs do not rewrite the reference browser's same-origin architecture.                                   |
| Tutor isolation and privacy                   | Strong read-only retrieval, curated paths, bounded context, untrusted-source treatment, safe Markdown, server-held credentials, and explicit transmission disclosure. SAR-01 is the missing caller-admission boundary. Numerical limits and normalized event details can be chosen in the plan. |
| Source/version coherence                      | Strong intended provenance, hashes, planned/implemented labels, working-copy labeling, and comparison separation. SAR-02 resolves a normal-state ambiguity between HEAD and edition authority.                                                                                                  |
| Offline and failure behavior                  | Covered at specification level. Authored lessons, narration, simulations, and progress survive missing keys/network. SAR-O1 sharpens the verification setup without adding a PWA requirement.                                                                                                   |
| Narration and accessibility                   | Covered with authored clips, transcripts/cues, no autoplay, keyboard and reduced-motion/text alternatives. Authored narration does not require learner speech credentials. SAR-O4 adds execution-level test specificity.                                                                        |
| Simulations and optional labs                 | Coherent. Deterministic simulations run without providers, microphone, or reference services; active lab actions remain learner-controlled and labeled by evidence status.                                                                                                                      |
| Four Postman collections                      | Covered with sanitized environments, curl alternatives, actual-version verification, correct tool-result ownership, and explicit separation of inspection from audio playback proof. The 24 kHz raw-PCM discussion agrees with the reference contract and supported Deepgram REST settings.     |
| Live-lab origin admission                     | Correctly preserved for the reference BFF. Browser labs run in its own tab; CLI/Postman send the configured Origin and matching destination Host. No tutorial-origin allowlist expansion is requested. This does not resolve admission for the separate tutor endpoint.                         |
| Testability and scope decomposition           | Broad acceptance is useful and implementable. Required source/admission tests should be extended for SAR-01/SAR-02. Atlas-first sequencing is suitable; detailed stories, estimates, request limits, lesson prose, and exact tools are appropriately deferred.                                  |
| Current source and live claims                | Honest. Historical discovery is identified as a snapshot; incomplete voice code may be taught as planned/simulated. No evidence here establishes completed reference delivery or successful live use.                                                                                           |

## Disposition and next review boundary

The document is suitable for focused owner revision, but this SAR does **not** recommend approving the reviewed bytes as the implementation specification yet. Resolve SAR-01 and SAR-02, update their acceptance coverage, and re-review the resulting artifact and digest. The remaining suggestions can be incorporated during planning without expanding the accepted course scope.

Do not interpret this report as written-spec owner approval, implementation-plan approval, issue advancement, sealed peer-review acceptance, or application validation. No requirement for a vector database, generic agent framework, cloud hosting, user accounts, proxy-based live runner, automatic lab execution, or provider-specific current model guarantee is introduced by this review.
