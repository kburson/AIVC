> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/89fc7a6125cd4b2be6f0f338dea928bd81bcea45/docs/peer-reviews/spec/aivc-interactive-tutorial-design-review-cb28e9fe5863446ca5d949d96998909c/sar/astra-sar-report-round-2.md) and its exact bytes remain available in the [tutorial evidence archive](../../../../quality-evidence/2026-10-14-25-tutorial-originals.json).
> Original SHA-256: `098ac89dabf73399c9691c68cc1af61b6492d42c2ec94ca597068db2d33feeab`. Review acceptance and protocol hashes apply to those original bytes.

# AIVC interactive tutorial specification — native SAR round 2

Date: October 13, 2026.

**Outcome: no further specification revisions.** Both required findings and all four optional improvements from round 1 are closed by the revised design. A holistic review of the complete revised specification found no additional concrete specification defect or optional change that warrants another revision. The written specification is ready for owner review. This is the terminal outcome of this native SAR loop for the reviewed bytes, not owner approval or implementation authorization.

## Artifact, identity, and review authority

- Tracking story: AIVC #15.
- Artifact: `docs/superpowers/specs/2026-10-13-15-aivc-interactive-tutorial-design.md`, complete revised document, lines 1–296.
- Author-provided revision: `4a4824f2cf57bd2cd693927103076afaee2d242d`.
- Independently verified SHA-256: `9b3f489fcfa836f0f3d11f3545694949e22f0d66e611cd34260b0bff3a24f0aa`, matching the round-2 request and author response.
- Requested selection remains Codex `gpt-6-astra`, `medium`.
- The same native task context, `/root/tutorial_sar`, resumed this review. No replacement reviewer or second-party protocol was launched. The available native invitation/context records the requested selection; no independent provider-certified per-turn model/effort attestation is available or claimed.
- [Owner loop authority](review-loop-authority.md) supersedes the initial one-pass stopping condition. [Round-1 report](astra-sar-report.md) and [author response](author-response-round-1.md) were read and preserved. The corrected stopping condition includes both required and optional findings, with a fresh holistic review after revision.
- No Git commands were run. The supplied commit-to-artifact relationship remains author-provided; the local artifact digest was directly verified. This task wrote only this new report in round 2 and did not modify the specification, reference source, original report, issue, lifecycle, or review protocol state.

This report records document review and source-contract reasoning. No application tests, Postman imports, provider requests, browser exercises, assistive-technology trials, microphone checks, or live demonstrations were executed or represented as passing.

## Sources and method

Read the complete revised specification and both round-2 authority/author documents. Re-examined each prior finding against the revised behavior and acceptance requirements, then reviewed the whole design for contradictions, lost requirements, new dependencies, and inappropriate deferral of product decisions.

Dependency context remains the governing voice BFF specification, epic #2 implementation plan, and Node 26 execution amendment read in round 1. Those reads established the reference origin-admission, multipart/history, WAV, speech, runtime, and evidence contracts. The revision does not alter those reference contracts. Repository `AGENTS.md`, the installed peer-review skill, and native orchestration guide continue to govern this task's boundaries.

The round-1 checks of [Next.js BFF guidance](https://nextjs.org/docs/app/guides/backend-for-frontend), [MDN CORS/simple requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#simple_requests), and [Deepgram media output settings](https://developers.deepgram.com/docs/tts-media-output-settings) remain the targeted external technical support for endpoint exposure, request-versus-response admission, and raw PCM format distinctions. This pass makes no new current-version or live-account claim requiring a separate external refresh. Application availability and historical GitHub snapshots are still correctly presented as needing revalidation before publication.

## Prior finding dispositions

| Finding                                         | Disposition | Evidence and closure reasoning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SAR-01 — tutorial endpoint admission            | **Closed**  | The new “Tutorial server admission” subsection defines distinct tutorial Host/Origin allowlists, loopback startup validation, explicit custom ports, fail-closed configuration, matching Origin/Host, and pre-body/pre-file/pre-cache/pre-GitHub/pre-provider rejection. JSON-only tutor input follows caller admission rather than replacing it. Status is Host-validated and sanitized without source/provider work; runtime mutations and future source routes receive the stronger policy. Acceptance 14–15 directly exercises rejection ordering, safelisted payloads, valid callers, ports, metadata, and zero upstream/source work. The reference BFF policy is expressly preserved. The caller trust boundary is now a specification invariant rather than a framework assumption. |
| SAR-02 — edition versus HEAD authority          | **Closed**  | “Source provenance and revision handling” makes the bundled edition snapshot the normal authority and separates retrieval backend from learning experience. Edition A remains default with HEAD B. Exploration/comparison are explicit, identities freeze per request, committed mode uses selected Git objects, dirty bytes require working-copy mode, and working-copy captures carry hashes. Context switches cancel/reset and reject late callbacks. Unavailable commits preserve lessons without silently changing answer evidence. Acceptance 8 and 16 cover these cases. Mutable official-reference URLs are also anchored to edition-stored content and provenance. The previously ambiguous product default is resolved.                                                          |
| SAR-O1 — cold offline boundary                  | **Closed**  | Setup now defines the prerequisite installation stage, empty runtime caches, removal of tutorial build output, external networking disabled, clean build/start, and a fresh browser profile. Required fonts/media/source snapshots are local. Acceptance 2 repeats this concrete cold test. Serverless/PWA offline restart is explicitly outside the promise. The requirement can no longer be satisfied only through a previously warmed cache.                                                                                                                                                                                                                                                                                                                                           |
| SAR-O2 — Atlas/full-course checkpoints          | **Closed**  | CP1 covers no-key guided/simulation Atlas; CP2 adds connected tutor and observed local/typed/provider labs; CP3 covers the eight-module, three-path complete edition with four collections and recorded provider/voice demonstrations. Missing required live evidence prevents the corresponding publisher checkpoint. Learners may still complete authored material without opting into labs. Acceptance 4 requires separate evidence. This resolves the delivery boundary without making optional learner labs mandatory participation.                                                                                                                                                                                                                                                  |
| SAR-O3 — Postman inherited media contracts      | **Closed**  | The Postman publication paragraph specifies turn IDs, encoded history, input exclusivity, typed-input cap, complete-pair history bounds, WAV format/duration/body cap, speech IDs and effective cap. Examples follow the edition's pinned contract/capabilities, not assumed timeless constants. Second-clone sample selection and absence of author-machine paths are required. Direct Deepgram formats remain distinguished from BFF formats, and raw PCM needs suitable playback handling. Acceptance 9–10 makes these checks explicit. No conflict with the reference contracts reviewed in round 1 was found.                                                                                                                                                                         |
| SAR-O4 — accessibility and private runtime data | **Closed**  | The design now specifies recorded Chrome/Edge versions, keyboard checks, an actual VoiceOver/Chrome pass, focus and accessible naming, non-color/text alternatives, and synchronized speed/seek cues. Source caches and lab observations have ignored locations, explicit retention/clearing rules, and separation from publication/progress. Private/working-copy evidence is excluded from committed assets and diagnostics; operational logs exclude sensitive content. Clear controls require admission and cannot be invoked by the tutor. Acceptance 11–12 supplies corresponding obligations.                                                                                                                                                                                       |

None of the six findings is closed merely because the author marked it revised. Each closure above is based on the actual revised requirement and its verification boundary.

## Whole-document re-review

### Scope, audience, and course structure

The local monorepo course, three shared product/developer/architect paths, JavaScript/TypeScript-fluent developer baseline, guided material, contextual tutor, simulations, optional own-key labs, and first Atlas slice all remain present. The eight modules cover the requested React, Next.js, Node/Fastify, Anthropic, and Deepgram fundamentals and their project-specific boundaries. Decision matrices distinguish technology choice from conceptual necessity and avoid fabricated historical rationale or measured scores.

The added checkpoints do not drop the full course or redefine a simulation as live success. Shared concepts, lesson manifests, source mappings, and progress keep the three paths implementable without requiring three separately authored courses. Detailed lesson prose, exercise rubrics, component decomposition, effort estimates, and governed stories are appropriately reserved for planning.

### Architecture, trust, and source provenance

The tutorial remains a separate local process with tutorial-owned configuration and server endpoints. The reference browser/BFF/domain/provider responsibilities are unchanged. Browser labs remain in the reference application's own origin; Postman/CLI supply its required headers. No convenience proxy or expanded reference allowlist was introduced.

The new tutorial admission policy fits the existing loopback model. Its stronger source/runtime endpoint policy does not require a source-returning GET in the baseline. Public bundled course material is separately publication-approved; private runtime source retrieval is not implicitly made public by the static-assets exception. Host-only status exposes sanitized flags and public edition identifiers, preserving useful no-key readiness without exposing local/private source context.

Edition authority now remains coherent across snippets, tutor retrieval, comparison, dirty modifications, and prior conversation. Missing evidence has an explicit outcome. Curated retrieval, bounded contexts, read-only tools, untrusted source instructions, safe rendering, credential isolation, transmission disclosure, and private-data clearing remain compatible. The implementation will still need rigorous tests; this is an adequate specification of what those boundaries must accomplish.

### Offline, narration, and accessibility

The clean offline build requirement is stronger than a warm-run demonstration but remains bounded by prior dependency/toolchain installation. It does not require network-free installation, a cloud service, or a PWA. The assets required for offline lessons are named, and failure of optional live features leaves the authored experience intact.

Recorded narration, captions, transcripts, manually stepped scenes, reduced motion, keyboard operation, and assistive-technology checks have concrete responsibilities. The added browser evidence targets do not imply untested platforms pass. Learner speech-provider credentials remain unnecessary for recorded narration.

### Contracts, media, and lab evidence

The four collections remain distinct and importable, with sanitized environments and curl alternatives. The reference transport/media limits are correctly distinguished from direct provider capabilities. Dynamic model/voice availability and Postman behavior remain publication-time verification duties, not invented universal promises.

The publisher-versus-learner distinction avoids a completion contradiction: learner labs are optional, but advertising verified live instruction requires publisher evidence. Historical or planned reference code can still support labeled simulation material without prematurely passing the complete live edition. Readiness, local health, provider configuration, HTTP success, and actual functional verification remain separate.

### Acceptance and deferred implementation decisions

The sixteen acceptance items cover the required experience, revised trust boundaries, source identity, cold offline operation, content integrity, media tooling, accessibility, and private runtime data. They are sufficient to derive meaningful plan checks. Exact tutor event envelopes, numeric context/request limits, storage helpers, Git-object access mechanics, test libraries, implementation commands, story decomposition, and publication scripts are legitimate implementation-plan decisions. No further specification change is requested merely to pre-design those details.

## New findings and final disposition

**New required findings: none. New optional specification revisions: none.**

The revised artifact resolves the previous findings without an observed scope regression or contract contradiction. The native SAR review–revise loop can stop at this digest with **no further specification revisions**. Subsequent source changes or new requirements may warrant a new review; they are not outstanding work in this pass.

Owner review remains the next authority boundary. This outcome does not approve the written specification on the owner's behalf, approve a future plan, authorize application implementation, advance #15, attest a two-party SPR/XPR, or establish passing product/live evidence.
