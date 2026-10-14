<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-f90cbcd8ed4a948d618a58f5eca85979"
role: "reviewer"
turn: 2
commit_mode: "normal"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/specs/2026-10-13-15-aivc-interactive-tutorial-design.md"
artifact_commit: "71c5072fedc3253fb3348abccba111f2185d38dc"
artifact_blob: "b7ca45d0d3dd6f4d6525c2cdb7e9203aa549de54"
artifact_digest: "sha256:df44844b8a23be5e6d0fcbde706ef98b5be6ce743247d69346db91282780014b"
agent:
  host: "claude-code"
  provider: "anthropic"
  model_id: "claude-opus-5-5"
  model_display: "claude-opus-5-5"
  session_fingerprint: "sha256:fc521f6ffe85276cea58c1beafe1060a10186a4a591f3ece4488abc358b95afe"
  identity_source: "runtime"
started_at: "2026-10-14T00:20:24.666Z"
submitted_at: "2026-10-14T00:33:10.886Z"
finding_ids: ["R2-F001","R2-F002"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---

Mode: `normal`

## Summary

Turn-2 re-review of the revised specification at blob `b7ca45d0d3dd6f4d6525c2cdb7e9203aa549de54` (commit `71c5072`, digest `sha256:df44844b…014b`). I read the full revised artifact and the author response `…-author-response-1.md`. I checked each R1 disposition against the actual revised text rather than the disposition summary.

Verification of R1 dispositions:

- **R1-F001 — resolved.** The new "Baseline server-surface inventory" assigns an admission class to every baseline surface:
  - status;
  - tutor;
  - source display;
  - refresh/exact-SHA retrieval;
  - working-copy capture;
  - private runtime status;
  - runtime clear;
  - credential entry, which has no HTTP surface.

  It states that private, selected, compared and working-copy source reaches the browser only through Origin+Host-admitted JSON POSTs and never through GET/HEAD/RSC rendering. It prohibits tutorial Server Actions, requires in-handler enforcement rather than middleware-only enforcement, and says the framework's Server Action origin matching is not a substitute for the allowlist. It also tests the attacker-Host/matching-Origin (DNS-rebinding) case. Acceptance item 15 enforces this. The private-status requirement is consistently routed through `POST /api/tutorial/runtime/status`.
- **R1-F002 — resolved.** The "Monorepo integration contract" defines:
  - a shared workspace/lockfile;
  - exact reference framework/type pins unless a reviewed exception exists;
  - reference-scoped root commands and clean-build, which correctly addresses the plan's `--workspaces` aggregates;
  - disjoint tutorial clean-build outputs and separate CI jobs;
  - before/after reference dependency-graph and input comparison, with reference regression and live revalidation when inputs change;
  - preservation of verifier digest/ancestry rules.

  Acceptance item 17 covers it.
- **R1-F003 — resolved.** Citation validity is defined against supplied-context chunk IDs and the frozen path/revision/range/hash. An invalid citation is removed and the answer is visibly marked unverified, with no silent repair or paid replay. A versioned per-edition evaluation set is required, with an all-cases-pass gate for CP2/CP3 recorded per edition/model/prompt/retrieval configuration, and configuration changes invalidate it. Acceptance item 6 reflects this.
- **R1-F004 — resolved.** The new "Publication approval and redistribution" section adds:
  - owner-granted approval against a per-item checklist (hash, URL, retrieval date, terms, redistribution, attribution and its rendered location);
  - authored summaries as the default;
  - linked-only or replacement when rights are unclear;
  - output-terms evidence for synthesized narration.

  Acceptance item 18 covers it.
- **R1-F005 — resolved.** The specification now provides:
  - Postman desktop Local Vault with unresolved `{{vault:…}}` references;
  - an explicit statement that masking is insufficient;
  - no literal secrets in collections, environments, examples or shared workspaces;
  - curl header files (`--header @file`) under ignored, owner-readable storage, with no secrets in argv or history and no trace output;
  - structural secret checks on publication and on every documented re-export path, validated by seeded-secret fixtures.
- **R1-F006 — resolved.** The directory labels are evidence-qualified against epic #2 and PR #12. `docs/tutorial.md` and `docs/tutorial/` have distinct ownership, explicit cross-links and separate verification.
- **R1-F007 — resolved.** The specification adds a canonical-origin start, a per-origin notice on alternate origins, and export/import for intentional moves.
- **R1-F008 — resolved.** Committed retrieval uses an audited library or argument-array plumbing, validates ref grammar, rejects option-like and control-character input, uses option terminators, and reads only by immutable object ID. Hooks, fsmonitor, textconv and filters are disabled. Working-copy capture uses direct contained reads, and hostile-ref and configured-program tests are required.
- **R1-F009 — resolved in the body text.** "Narration, diagrams, and animations" now requires an NVDA/Edge pass. See R2-F001 for the acceptance-list inconsistency.
- **R1-F010 — resolved.** Explicit CP2/CP3 reference-capability dependencies were added.
- **R1-F011 — resolved.** The specification adds desktop-client outgoing Origin/Host verification, including negative cases. Web/agent clients are unsupported unless verified, and curl is the fallback.

I found no regressions or new contradictions in the security, provenance or reference-contract material. Two small residual consistency defects remain, introduced by the revision leaving older sentences unchanged. Both are confined to wording, but one sits in the acceptance list that implementers verify against, so I request a final small revision.

## Findings

### R2-F001 — Acceptance item 11 still names only VoiceOver/Chrome after the body added a required NVDA/Edge pass

Severity: minor (acceptance consistency).

Evidence:

- "Narration, diagrams, and animations" now requires "documented manual macOS VoiceOver/Chrome and Windows NVDA/Edge passes".
- Acceptance item 11 still reads "actual VoiceOver/Chrome observations" and does not mention NVDA/Edge.
- Item 19's "actual manual screen-reader/browser evidence" is generic and does not name the combinations.

Consequence: An implementer checking the acceptance list could satisfy item 11 with VoiceOver/Chrome alone. The NVDA/Edge obligation the R1-F009 revision introduced would then go unverified.

### R2-F002 — "Contextual tutor" still presents two endpoints as the proposed set, contradicting the new inventory

Severity: minor (internal consistency).

Evidence:

- The first paragraph of "Contextual tutor" still says: "Proposed tutorial endpoints are `GET /api/tutorial/status` and `POST /api/tutorial/tutor`."
- The new "Baseline server-surface inventory" defines seven baseline API surfaces, including `POST /api/tutorial/source`, `/source/refresh`, `/source/working-copy`, `/runtime/status` and `/runtime/clear`.

Consequence: Read in isolation, the earlier sentence restates the incomplete endpoint set that R1-F001 corrected. A reader could take it as the complete tutor-facing surface, and the two sections disagree on what the proposed endpoints are.

## Required changes

1. For R2-F001, amend acceptance item 11 to require recorded actual observations for both the macOS VoiceOver/Chrome and the Windows NVDA/Edge manual passes, with their versions. Untested combinations are recorded as limitations.
2. For R2-F002, revise the "Contextual tutor" endpoint sentence so it names the tutor-specific endpoints and defers to the "Baseline server-surface inventory" as the complete authoritative list, or delete the enumeration. For example: "The tutor uses `POST /api/tutorial/tutor`; readiness uses `GET /api/tutorial/status`; the complete baseline surface set and admission classes are defined in the Baseline server-surface inventory."

## Optional suggestions

None.

## Decision

revisions-requested
