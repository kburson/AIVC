<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-f90cbcd8ed4a948d618a58f5eca85979"
role: "reviewer"
turn: 1
commit_mode: "normal"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/specs/2026-10-13-15-aivc-interactive-tutorial-design.md"
artifact_commit: "e84554dab3007a47e2317c02650b3d9ef0e8bf75"
artifact_blob: "93e8d002f75338d8bff53b391b3aabb1c1d45689"
artifact_digest: "sha256:9b3f489fcfa836f0f3d11f3545694949e22f0d66e611cd34260b0bff3a24f0aa"
agent:
  host: "claude-code"
  provider: "anthropic"
  model_id: "claude-opus-5-5"
  model_display: "claude-opus-5-5"
  session_fingerprint: "sha256:fc521f6ffe85276cea58c1beafe1060a10186a4a591f3ece4488abc358b95afe"
  identity_source: "runtime"
started_at: "2026-10-14T00:20:24.666Z"
submitted_at: "2026-10-14T00:24:16.796Z"
finding_ids: ["R1-F001","R1-F002","R1-F003","R1-F004","R1-F005","R1-F006","R1-F007","R1-F008","R1-F009","R1-F010","R1-F011"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---

Mode: `normal`

## Summary

Independent XPR review of `docs/superpowers/specs/2026-10-13-15-aivc-interactive-tutorial-design.md` at blob `93e8d002f75338d8bff53b391b3aabb1c1d45689` (commit `e84554d`). I read the artifact in full and checked its repository claims against the governing voice BFF specification (`docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md`), the epic #2 plan (`docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md`), the Node 26 amendment (`docs/superpowers/plans/2026-10-13-2-node26-parallel-execution-amendment.md`), the root `package.json` and `.gitignore` in the checked-out worktree. I did not use the SAR reports or author responses as inputs to this assessment.

The specification is strong overall. It separates evidence modes (implemented/planned/simulated) and checkpoints CP1–CP3 well. Its source-provenance model (edition default, explicit exploration/comparison/working-copy, frozen per-request identity) is careful. It keeps tutorial admission separate from the reference BFF admission. Every reproduced reference contract value matches the governing specification exactly:

- Ports 3000/3001.
- `turnId`/`history`/exactly-one-of `text`/`audio`.
- 2,000-character typed cap.
- Mono PCM16 16 kHz WAV, 30 s, 2 MiB.
- Four pairs / eight messages / 16,000 characters.
- `{ turnId, segmentId, text }` with `min(120, floor(6 * SPEECH_CHARS_PER_SECOND))` = 84.
- Raw mono PCM16 at 24 kHz without a header.
- Fastify `GET /health`, `GET /v1/projects`, `?name=Atlas`.
- Host-only capabilities GET.

The toolchain statement (Node >=26, reproducible 26.8.1, npm 12.0.2) matches the amendment. `.tmp/` is already ignored, so the proposed `.tmp/tutorial/...` runtime stores are consistent with repository policy.

The remaining issues are mostly gaps where a correct-sounding rule is still underspecified for the chosen technology or the shared monorepo:

1. The tutorial's server surface is not fully enumerated. Baseline exploration, comparison, working-copy, refresh, cache-status and clear features need server endpoints beyond the two named ones. Next.js page rendering and Server Actions are server surfaces that the admission rules do not explicitly cover.
2. Adding tutorial workspaces to the shared root changes the reference application's lockfile, root scripts, clean-build and CI. The specification does not define that integration contract.
3. Tutor-quality acceptance criteria are not objectively verifiable as written.
4. Redistribution rights for bundled third-party documentation excerpts and synthesized narration are not required to be recorded.
5. Learner-side credential handling in Postman and curl is not covered by the key policy.
6. Two smaller accuracy/consistency issues: "Existing" labels in the directory tree, and the relationship to the epic #2 `docs/tutorial.md` deliverable.

None of these undermines the design direction. Several affect security or reproducibility boundaries that a plan author would otherwise have to invent, so I request revisions.

## Findings

### R1-F001 — Tutorial server surface and admission class per surface are incomplete for baseline features and for Next.js rendering/Server Actions

Severity: major (security boundary / internal consistency).

Evidence:

- "Contextual tutor" names only two proposed endpoints: `GET /api/tutorial/status` and `POST /api/tutorial/tutor`.
- "Tutorial server admission" states: "No source-returning GET endpoint exists in the baseline."
- Baseline features that acceptance items 8, 12, 15 and 16 make mandatory still require the server to return or mutate data beyond those two endpoints:
  - Explore another committed revision, Compare revisions and Working-copy exploration display selected-revision source. Acceptance item 6 requires that "Tutor citations validate against displayed source", so non-edition source must reach the browser for display.
  - "Show cache/retrieval status and active revision". The status GET is restricted to "sanitized readiness flags and public course-edition identifiers" and returns no private repository names or paths. Status for a private fork, a selected SHA or a working-copy generation therefore needs another surface.
  - Explicit refresh, "explicitly retrieve that exact SHA from configured GitHub", working-copy capture/hash, and runtime-data clear/delete controls are all server mutations or network actions.
  - "Local key entry" leaves open whether keys are entered through the UI. If they are, that is a server write to an ignored file.
- Browsers do not send an `Origin` header on same-origin `GET`/`HEAD` fetches or navigations. The rule that every source-returning endpoint must use the stronger Origin+Host admission therefore means such source must be fetched by non-GET requests from client code. Under that rule, server-rendered pages (React Server Components on a GET navigation) cannot embed non-edition source. The specification never states this consequence. A plan author choosing Next.js would naturally render the Code tab for a selected revision as a Server Component and violate the rule.
- Next.js Server Actions are POST endpoints created implicitly by code. Their built-in CSRF protection compares `Origin` with `Host`/`X-Forwarded-Host`. Under DNS rebinding, both values carry the attacker's hostname, so that check does not replace the configured Host allowlist. The specification's admission text speaks only of "endpoints", and neither Server Actions nor middleware are mentioned. Middleware-only enforcement is also a known weak point: the 2025 `x-middleware-subrequest` middleware-bypass advisory showed it can be skipped. Admission therefore has to be enforced where the work happens.

Consequence: The plan must invent the endpoint set and per-endpoint admission class. The most natural Next.js implementation, server-rendered source plus Server Actions for refresh/clear, would bypass or contradict the stated boundary while appearing compliant with "every tutorial server endpoint".

### R1-F002 — Monorepo integration contract with the reference application is undefined (shared lockfile, root scripts, clean-build, CI, evidence revisions)

Severity: major (reproducibility / scope boundary).

Evidence:

- The specification proposes `apps/tutorial` and three `packages/tutorial-*` workspaces. It says to "Reuse the repository's npm workspaces … exact dependency pins" and that the tutorial "does not independently upgrade the reference toolchain".
- The epic #2 plan defines the root manifest as `"workspaces": ["apps/web", "apps/retrieval"]`, with `build`/`typecheck` running `--workspaces`.
- The same plan defines `scripts/clean-build.mjs` to "remove only apps/web/.next and apps/retrieval/dist", and Task 9 adds CI and `verify-docs` script-ownership checks.
- The governing BFF specification says root development "starts both local applications".
- Adding tutorial workspaces necessarily changes the single root `package-lock.json`. Dependency hoisting/deduplication can change resolved transitive versions used by `apps/web`, and root `build`/`typecheck`/`test` and CI will begin including tutorial code unless explicitly scoped. That alters the reference application's reproduction inputs and could invalidate or blur the revision-bound live evidence epic #2 records.
- The specification only says "Command names … must be reconciled with existing scripts rather than overwriting them". It does not address the lockfile, the root aggregate commands, clean-build scope, CI job separation, or whether tutorial React/Next.js pins must equal the reference pins.

Consequence: The specification says it "does not replace that epic's scope, evidence, or acceptance". Unscoped workspace integration can still change the reference app's dependency graph and CI outcome. A reference regression could then be caused by tutorial work with no stated rule for detecting or preventing it.

### R1-F003 — Tutor-quality acceptance is not objectively verifiable

Severity: moderate (verifiability).

Evidence:

- Acceptance item 6 says "answers distinguish intent/implementation/inference and report gaps".
- Acceptance item 7 requires tests for "malicious source instructions".
- CP2 requires a "genuine source-cited tutor exchange", which is one exchange.
- "Risks" mentions "evaluation cases", but no acceptance item requires a versioned evaluation set, a pass criterion, or recording per model/edition.
- Whether an LLM answer "distinguishes intent from implementation" is a judgment, not a deterministic check. Its outcome varies by model ID and edition.
- Citation validation is also undefined beyond "validated citations". The specification does not state whether a valid citation must reference a chunk actually supplied in that request's context, whether the cited range must exist at the frozen revision, or what happens to an answer that contains an invalid citation (strip, flag or fail).

Consequence: CP2/CP3 could be claimed on the basis of one favorable exchange. Regressions caused by model or prompt changes would be undetectable.

### R1-F004 — Redistribution rights for bundled third-party excerpts and synthesized narration are not required

Severity: moderate (publication / legal-provenance).

Evidence:

- "Source provenance" requires official-reference excerpts to be "edition-bound by stored content/hash and publication metadata", and editions contain "publication-approved bundled excerpts".
- "Narration" requires scripts/assets to "record authorship/license", and sample lab audio to be "authored or licensed for redistribution".
- There is no equivalent licence/attribution requirement for the bundled vendor documentation excerpts the tutor and lessons ship in a public, clonable repository. The cited sources carry different terms:
  - React docs: CC BY 4.0, which requires attribution.
  - MDN: CC BY-SA, which requires attribution and share-alike.
  - Next.js and Fastify docs: repository licences.
  - Anthropic, Deepgram and Postman documentation: proprietary site terms.
- Narration produced by "optional authoring-time synthesis" with a provider is likewise subject to that provider's output terms. The specification records authorship and licence for scripts but does not require confirming that synthesized audio may be redistributed.
- "Publication-approved" is undefined: it does not say who approves or against what criteria.

Consequence: The course could ship verbatim excerpts or generated audio that the repository may not redistribute or that require attribution it does not render. The tutor would also cite those excerpts as if bundling them were unproblematic.

### R1-F005 — Learner-side credential handling for Postman and curl labs is outside the key policy

Severity: moderate (secret handling).

Evidence:

- The specification says "Keys stay in ignored server-local files", "Tokens remain server-local", and "Export key/token values empty; learners set their own local values".
- The Anthropic and Deepgram collections call providers directly, and "Provide equivalent curl requests" means learners will place provider API keys in Postman and on a shell command line.
- Postman environments, collections and history can sync to the learner's Postman cloud workspace depending on account, workspace and variable type. A key typed into a shared or exported variable, a request header, or a saved example can leave the machine or be committed back if a learner re-exports a collection into the repository.
- A key passed as a literal `-H "x-api-key: …"` or `Authorization: Token …` argument lands in shell history and is visible in the process list.
- Acceptance item 12 checks that keys are absent from "bundles/citations/diagnostic logs/progress exports/publication manifests/commits". It does not cover learner re-exports of collections, and it imposes no guidance on how learners should store provider keys in these clients.

Consequence: The only lab path that touches provider keys outside the server has no stated handling rule. That is the path most likely to leak a learner's paid API key.

### R1-F006 — "Existing" directory labels and the relationship to epic #2's `docs/tutorial.md` are inaccurate or undefined

Severity: minor (accuracy / consistency).

Evidence:

- The proposed tree labels `apps/web` and `apps/retrieval` as "Existing". At the artifact's own commit `e84554d`, the checked-out trunk has no `apps/` directory and the root `package.json` has no workspaces. The specification itself says those sources were inspected in PR #12 and that "the full voice loop was not evidenced". "Existing" therefore contradicts the evidence-status discipline the specification imposes on every example.
- The epic #2 plan (Task 9, story #11) creates `docs/tutorial.md` as the "compact code-linked tutorial". This specification proposes a sibling `docs/tutorial/` directory and says it "expands … beyond" story #11. It does not say whether `docs/tutorial.md` remains, is linked from or to the course, or is superseded. It also does not address how the epic #2 `verify-docs` ownership checks treat the new directory.

Consequence: A future reader can be misled about what the repository actually contains. The two tutorial deliverables can drift or collide in documentation checks.

## Required changes

1. For R1-F001, add a baseline server-surface inventory to "Contextual tutor" or "Tutorial server admission". It should list every route, server action or other server-executed surface needed for the baseline features: status, tutor, selected/compared/working-copy source display, cache/retrieval status, refresh/retrieve-exact-SHA, working-copy capture, runtime-data clear, and key entry if any. Assign each an admission class: Host-only (public metadata) or Origin+Host (source, private metadata, mutation, paid or network work). Then state the consequences:
   - Non-edition, private or working-copy source and private status are delivered only through Origin+Host-admitted non-GET requests, not embedded in server-rendered GET pages.
   - Next.js Server Actions are either prohibited for these operations or subject to the same configured Host/Origin allowlist inside the action. The framework's built-in Origin-vs-Host check is not relied upon.
   - Admission is enforced in each handler or action, not only in middleware.
   - Acceptance item 14/15 tests cover every inventoried surface, including DNS-rebinding style requests with a non-allowlisted Host whose Origin matches it.
2. For R1-F002, add a monorepo integration contract. It should state:
   - The tutorial workspaces join the shared root lockfile, or explain why isolation is chosen.
   - Tutorial React/Next.js/TypeScript pins equal the reference pins unless a reviewed exception exists.
   - Root aggregate commands and `scripts/clean-build.mjs` either exclude tutorial workspaces or include them by an explicit, owned decision.
   - CI runs reference and tutorial jobs separately, so tutorial failures do not mask or masquerade as reference results.
   - A tutorial change that alters the resolved dependency graph of `apps/web` or `apps/retrieval` requires re-running the reference checks. It must not reuse reference live evidence recorded at an earlier revision.
3. For R1-F003, make tutor quality verifiable:
   - Define citation validity: the citation references a chunk ID supplied in that request's context, and its path/revision/range/hash match the frozen source.
   - Define behaviour for invalid citations, for example removing them with a visible status. Never render them as valid.
   - Require a versioned tutor evaluation set per edition, covering per-module questions, missing-evidence questions, intent-versus-implementation questions, prompt-injection-in-source cases, and wrong-revision cases. Each case has an expected evidence set and pass rules.
   - Record results per model ID and edition, and make CP2/CP3 depend on recorded results rather than a single exchange.
4. For R1-F004, extend publication provenance. Every bundled third-party excerpt records its source URL, retrieval date, licence or terms, and required attribution, and the UI renders required attributions. Material whose terms do not permit redistribution is linked or summarized, not bundled verbatim. Synthesized narration records the provider, model/voice and the output-use terms that permit redistribution. Define who grants "publication approval" and against which checklist.
5. For R1-F005, add learner-side credential guidance and checks:
   - Postman keys use the client's secret/local-only mechanism. Name the mechanism, such as secret-type variables kept as local current values or Postman Vault, and verify it in the recorded Postman version.
   - Learners never put keys in exported collections, saved examples or shared workspaces.
   - curl examples read keys from environment variables or a file rather than literal arguments.
   - A publication check rejects collections or environments containing non-empty secret values or authorization headers. The same check runs on any learner-facing re-export path documented in the repository.
6. For R1-F006, replace "Existing" with an evidence-qualified label (for example "Reference app, planned by epic #2; partial source in PR #12 at `38b9552`; revalidate"). State the relationship between `docs/tutorial.md` (epic #2 Task 9 / story #11) and `docs/tutorial/`, for example retained and cross-linked, with `verify-docs` ownership unchanged, or another explicit choice.

## Optional suggestions

### R1-F007 — Browser-storage progress is origin-scoped across the two allowed tutorial origins

`http://localhost:3002` and `http://127.0.0.1:3002` are both admitted but are distinct origins for `localStorage`/IndexedDB, and a custom port is a third origin. A learner who opens the other URL will appear to have lost progress, which conflicts with the spirit of "Changing paths preserves progress". Suggest one of the following:

- Name a canonical origin that setup and commands open, with the alternate origin showing a notice that links to the canonical one.
- Document that progress is per-origin and point to export/import.

### R1-F008 — Harden server-side Git access used by local committed/working-copy modes

Local committed mode reads Git objects for learner-selected refs, and working-copy mode reads the learner's checkout. If the implementation shells out to `git`, it should:

- Validate ref syntax (`git check-ref-format`-equivalent) before resolution.
- Pass user-derived refs only after `--end-of-options`/`--`, to prevent option injection.
- Avoid commands that execute repository-configured programs, such as `core.fsmonitor`, hooks or textconv. Alternatively, use plumbing commands or a library with configuration overrides.

This complements the existing containment/symlink rules and the statement that tutor tools cannot run shell commands. The server's own retrieval should be held to the same standard.

### R1-F009 — Broaden or justify the assistive-technology baseline

The only named screen-reader pass is macOS VoiceOver with Chrome, while Edge is a target browser. VoiceOver is most commonly used and best supported with Safari, and Windows screen readers (NVDA/JAWS) are the common pairing for Chrome and Edge. Suggest one of the following:

- Add an NVDA plus Chrome-or-Edge manual pass on Windows.
- State why VoiceOver/Chrome alone is the chosen baseline and list the untested combinations as known limitations.

### R1-F010 — State CP2/CP3 dependency on reference-application completion explicitly

CP2's typed-BFF lab and CP3's browser voice/interruption labs require the epic #2 reference capabilities to exist at the edition revision. The specification implies this ("Missing keys/source leave live cases unverified"; "Unavailable required live cases prevent this completion claim"), but a one-line dependency would prevent CP2/CP3 from being scheduled ahead of their prerequisites. The line would say that CP2 requires the reference typed turn implemented at the pinned revision, and CP3 requires the reference speech/voice/interruption implementation.

### R1-F011 — Postman `Origin`/`Host` override feasibility should be verified per client

The BFF collection relies on Postman sending a configured `Origin` and matching `Host`. These headers are browser-forbidden, and the Postman web client and its agents may not honour overrides the same way the desktop app does. Suggest recording which Postman client(s) support the required headers in the tested version. Also state that the web client is unsupported for BFF requests if it cannot send them, with curl as the fallback.

## Decision

revisions-requested
