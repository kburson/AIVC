> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/89fc7a6125cd4b2be6f0f338dea928bd81bcea45/docs/peer-reviews/spec/aivc-interactive-tutorial-design-review-cb28e9fe5863446ca5d949d96998909c/xpr/2026-10-14-2026-10-13-15-aivc-interactive-tutorial-design-review-f90cbcd8ed4a948d618a58f5eca85979-author-response-1.md) and its exact bytes remain available in the [tutorial evidence archive](../../../../quality-evidence/2026-10-14-25-tutorial-originals.json).
> Original SHA-256: `098f6d9f095188c9360467f65446b06c52d0a3658a497b2068cbe0c55ea5d357`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:f81da1894a46ceb20866070833b4e99ef536ef633542b418783d29e6a981dbd8" -->

<!-- protected-frontmatter -->

```yaml
schema: 'ai-peer-review.response/v1'
review_id: 'review-f90cbcd8ed4a948d618a58f5eca85979'
role: 'author'
turn: 1
commit_mode: 'normal'
authority_assurance: 'unavailable'
artifact_path: 'docs/superpowers/specs/2026-10-13-15-aivc-interactive-tutorial-design.md'
artifact_commit: 'e84554dab3007a47e2317c02650b3d9ef0e8bf75'
artifact_blob: '93e8d002f75338d8bff53b391b3aabb1c1d45689'
artifact_digest: 'sha256:9b3f489fcfa836f0f3d11f3545694949e22f0d66e611cd34260b0bff3a24f0aa'
agent:
  host: 'codex'
  provider: 'openai'
  model_id: 'gpt-6.1-sol'
  model_display: 'gpt-6.1-sol'
  session_fingerprint: 'sha256:5ece402976145543a077f7252d1886d8bf232cc796f307cf1b09283d8a62a21b'
  identity_source: 'runtime'
started_at: '2026-10-14T00:18:59.466Z'
submitted_at: '2026-10-14T00:31:26.739Z'
finding_ids: []
answered_finding_ids:
  [
    'R1-F001',
    'R1-F002',
    'R1-F003',
    'R1-F004',
    'R1-F005',
    'R1-F006',
    'R1-F007',
    'R1-F008',
    'R1-F009',
    'R1-F010',
    'R1-F011',
  ]
acknowledged_supplement_ids: []
```

Mode: `normal`

## Summary

Revised the complete specification in response to all eleven sealed findings, including the five optional suggestions. New sections define monorepo integration, the server-surface inventory, objective tutor evaluation, publication provenance and local API-client handling. The revised artifact digest is sha256:df44844b8a23be5e6d0fcbde706ef98b5be6ce743247d69346db91282780014b. Every disposition below is an author revision awaiting reviewer validation, not a claim of reviewer acceptance.

## Finding dispositions

### R1-F001 — Revised

Added the complete baseline surface inventory, including source display, refresh/exact-SHA retrieval, working-copy capture, private runtime status and clear operations. All privileged surfaces are JSON POST Route Handlers with in-handler matching configured Origin/Host admission. Private/selected sources cannot be embedded in GET/HEAD/RSC pages; no Server Actions or HTTP key entry exist. Public immutable framework assets are separately identified and cannot carry runtime/private data. Admission includes matching attacker Origin/Host rejection and direct/implicit surface tests. This resolves the missing implementation boundary without requiring a custom gateway or expanding reference admission.

### R1-F002 — Revised

Added the shared workspace/lockfile integration contract, exact reference framework/type pins unless reviewed exception, explicitly reference-scoped root commands, disjoint clean-build outputs, separate CI reports, pre/post reference graph/input checks and current reference regression/live revalidation when reproduction inputs change. Existing verifier digest/ancestry rules are preserved. Root integration and changed ownership checks are governed tutorial work, not an unreviewed edit to epic #2. Checked the original plan's workspace selection, clean-build ownership and Task 9 verification/evidence rules before revising.

### R1-F003 — Revised

Defined citations against chunks actually supplied to the request, with path/revision/range/hash agreement. Invalid citations are removed and answers are visibly unverified; streamed text is provisional and no automatic paid replay occurs. Added the edition-versioned full evaluation corpus, per-module mechanics/decision questions, missing/intent/injection/wrong-revision cases, expected evidence and semantic rubric, all-case passing checkpoints, per-model/prompt/retrieval configuration evidence and invalidation. Synthetic/publication-approved fixtures prevent storing private live conversations as evaluation collateral.

### R1-F004 — Revised

Added owner-owned publication approval with per-item redistribution/licence/terms/permission/attribution evidence and rendered obligations. Original authored summaries with official links are the default; unclear permission means linked-only or replacement, not assumed copying rights. Synthesized audio records provider/model/voice/date/output terms and asset hash. No vendor-specific licence or legal permission is asserted as current by this specification.

### R1-F005 — Revised

Separated server credentials from deliberate direct-provider client credentials. Postman uses Local Vault (not Shared Vault/shared values) and unresolved vault references; tested-client local behavior is required. curl uses owner-readable ignored header files rather than literal or expanded secret argv/history, without trace output/cross-host redirects. Structural publication/re-export checks reject populated secret fields/literal credentials and seeded-secret fixtures prove refusal without leaking values. Primary Postman documentation confirms Local Vault is not synced to Postman Cloud and documents the vault-reference syntax; masking alone is expressly insufficient.

### R1-F006 — Revised

Qualified the proposed tree against epic #2 and the partial PR #12 snapshot rather than claiming current trunk application workspaces exist. Added retention and governed cross-links for compact docs/tutorial.md, separate course docs/tutorial/ ownership and separately enumerated reference/tutorial documentation checks. Root package.json confirms this checkout remains bootstrap-only; no source completion claim was introduced.

### R1-F007 — Revised

Specified canonical localhost tutorial startup, per-origin storage notices on admitted alternates/custom ports, and export/import for intentional origin moves. Audience-path changes preserve same-origin progress; origin changes are not silently merged.

### R1-F008 — Revised

Added audited Git-object access/fixed argument-array plumbing, ref grammar and option/control-character rejection, command-appropriate option terminators, immutable object IDs, curated paths and configuration/executable isolation. Tests prove no shell, hooks, fsmonitor, textconv/filter/external-program execution. Working-copy reads use direct contained file access.

### R1-F009 — Revised

Added an actual Windows NVDA/Edge manual pass alongside macOS VoiceOver/Chrome, with recorded versions and explicit untested-combination limitations. These are future acceptance obligations, not performed trials.

### R1-F010 — Revised

Made CP2's implemented pinned typed-turn/domain prerequisites and CP3's additional speech/capture/playback/interruption prerequisites explicit. Simulations can be authored earlier but cannot pass connected/live checkpoints.

### R1-F011 — Revised

Named the desktop Postman/OS/version baseline, actual outgoing Origin/Host verification including negative cases, unsupported web/agent combinations unless separately verified and credential-safe curl fallback. Client limitations do not weaken the BFF gate. Local Vault support must also be verified for any additional client.

## Changes made

Updated the evidence-qualified directory labels, added the integration contract and canonical-origin behavior, defined all source/runtime API boundaries and no Server Actions/key-form policy, expanded citation/evaluation requirements, added safe Git retrieval/publication/credential rules and extended the accessibility and checkpoint dependencies. Acceptance cases 6, 15 and 17–19 now require the corresponding checks. The three learner paths, eight modules, simulated/optional-live learning model, reference BFF contracts, local-only deployment and toolchain authority remain intact.

## Declined changes and rationale

None. All eleven findings received concrete specification changes. Implementation mechanics and future verification remain in their proper stage; no finding was silently deferred or represented as executed product evidence.

## Verification

Read the full sealed reviewer response and compared workspace/clean-build/docs/live-evidence claims with the epic #2 plan and actual root package.json/.gitignore. Checked current primary Postman Local Vault/reference documentation and Next.js Server Action configuration; consulted the official curl manual for header-file handling. Relevant links are retained in the revised spec. Verified the starting artifact digest against the sealed request before editing, applied only exact-match Markdown replacements, ran git diff --check, and inspected changed sections/status. The reviewed specification is the only tracked artifact modified; generated response/startup/invitation paths are package-owned. An unrelated untracked notes.txt appeared during author work and is preserved/excluded from protocol commits. No application, provider, Postman, browser, audio or assistive-technology tests ran. No manual Git commit/push was performed; normal protocol submit owns exact-path revision commits.
