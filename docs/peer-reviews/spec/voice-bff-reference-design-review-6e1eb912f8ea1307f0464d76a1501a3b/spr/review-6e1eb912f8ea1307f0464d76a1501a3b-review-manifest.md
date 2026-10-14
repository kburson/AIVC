> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/spr/review-6e1eb912f8ea1307f0464d76a1501a3b-review-manifest.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `2b05850d12f16cdd82e34703144d1900b56f88c27000994f0234817d0afc4547`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:e53bf4d9991ae94a699fede1d62fd90324e45923de951babcb8d9ad237900bd9" -->

# Review manifest

Mode: `normal`

```json
{
  "acceptance_basis": "reviewer-consensus",
  "artifact_history": [
    {
      "blob": "4148dccc2f931bdf6be394534e68fe9d31072a81",
      "commit": "f68073be0b9e94bc8c035ff996604a7d75eabb94",
      "digest": "sha256:18fcca5fcf1f56e04147db042e57bf0bcfcc37145cecef9b2baec9fb069cf488",
      "path": "docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md",
      "snapshot": null,
      "turn": 0
    },
    {
      "blob": "fcde53a12d5e49cb1b02a957a18d7d6f2fe660f3",
      "commit": "bd238bbc7e19787926bbef49ab226fb1dddbfa9e",
      "digest": "sha256:44e70b02d0cac27217b805f387bdb6d8677a5f79ce136c33f2ebf4fd51d5422a",
      "path": "docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md",
      "snapshot": null,
      "turn": 1
    }
  ],
  "artifact_path": "docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md",
  "authority": {
    "acceptance_attestation": null,
    "policy": "unavailable",
    "verifier": null
  },
  "authority_assurance": "unavailable",
  "claims": [
    {
      "claim_id": "claim-75227e21-408a-4437-9bc7-a5d8e25313f8",
      "claimed_at": "2026-10-13T02:51:31.321Z",
      "expires_at": "2026-10-13T10:51:31.321Z",
      "host": "codex",
      "last_activity_at": "2026-10-13T02:51:31.321Z",
      "role": "reviewer",
      "session_fingerprint": "sha256:149b59c624fd6215473bf95928954a60b2586e1521d46cacc426b9be0c817525"
    },
    {
      "claim_id": "claim-ca87c889-33e1-44a7-bead-14dc35c1391d",
      "claimed_at": "2026-10-13T02:59:07.476Z",
      "expires_at": "2026-10-13T10:59:07.476Z",
      "host": "codex",
      "last_activity_at": "2026-10-13T02:59:07.476Z",
      "role": "author",
      "session_fingerprint": "sha256:303babcc83e3373412fb6bcb163feb218ba76be7f97adb90927d06ffe0b09903"
    }
  ],
  "commit_mode": "normal",
  "final_commit": "bd238bbc7e19787926bbef49ab226fb1dddbfa9e",
  "human_decision": null,
  "identity_changes": [
    {
      "identity": {
        "evidence": {
          "model": {
            "assurance": "declared",
            "conflict": false,
            "declared_id": null,
            "observed_id": null,
            "requested_id": "gpt-6.1-sol",
            "source": "launch-request"
          },
          "session": {
            "assurance": "declared",
            "fingerprint": "sha256:303babcc83e3373412fb6bcb163feb218ba76be7f97adb90927d06ffe0b09903",
            "source": "official-runtime"
          }
        },
        "host": "codex",
        "identity_source": "runtime",
        "joined_at": "2026-10-13T02:22:07.276Z",
        "model_display": "gpt-6.1-sol",
        "model_id": "gpt-6.1-sol",
        "provider": "openai",
        "role": "author",
        "session_fingerprint": "sha256:303babcc83e3373412fb6bcb163feb218ba76be7f97adb90927d06ffe0b09903"
      },
      "role": "author",
      "sequence": 3
    }
  ],
  "lineage_receipt": {
    "attempts": [
      {
        "consumed_grant_digest": null,
        "event_log_digest": "sha256:d6a90a993a0b2353a2bb7da85facb8776b381581e985677c66d46b884dde982f",
        "predecessor_review_id": null,
        "reciprocal_receipt_digest": null,
        "record_id": "review-6e1eb912f8ea1307f0464d76a1501a3b",
        "recovery_claim_digest": null,
        "recovery_id": null,
        "recovery_ordinal": 0,
        "review_id": "review-6e1eb912f8ea1307f0464d76a1501a3b",
        "root_review_id": "review-6e1eb912f8ea1307f0464d76a1501a3b",
        "successor_review_id": null
      }
    ],
    "complete": true,
    "schema": "ai-peer-review.lineage-receipt/v1"
  },
  "participants": {
    "author": {
      "evidence": {
        "model": {
          "assurance": "declared",
          "conflict": false,
          "declared_id": null,
          "observed_id": null,
          "requested_id": "gpt-6.1-sol",
          "source": "launch-request"
        },
        "session": {
          "assurance": "declared",
          "fingerprint": "sha256:303babcc83e3373412fb6bcb163feb218ba76be7f97adb90927d06ffe0b09903",
          "source": "official-runtime"
        }
      },
      "host": "codex",
      "identity_source": "runtime",
      "joined_at": "2026-10-13T02:22:07.276Z",
      "model_display": "gpt-6.1-sol",
      "model_id": "gpt-6.1-sol",
      "provider": "openai",
      "role": "author",
      "session_fingerprint": "sha256:303babcc83e3373412fb6bcb163feb218ba76be7f97adb90927d06ffe0b09903"
    },
    "reviewer": {
      "evidence": {
        "model": {
          "assurance": "declared",
          "conflict": false,
          "declared_id": null,
          "observed_id": null,
          "requested_id": "gpt-6-astra",
          "source": "launch-request"
        },
        "session": {
          "assurance": "declared",
          "fingerprint": "sha256:149b59c624fd6215473bf95928954a60b2586e1521d46cacc426b9be0c817525",
          "source": "environment-declaration"
        }
      },
      "host": "codex",
      "identity_source": "declared",
      "joined_at": "2026-10-13T02:51:31.320Z",
      "model_display": "gpt-6-astra",
      "model_id": "gpt-6-astra",
      "provider": "openai",
      "role": "reviewer",
      "session_fingerprint": "sha256:149b59c624fd6215473bf95928954a60b2586e1521d46cacc426b9be0c817525"
    }
  },
  "record_id": "review-6e1eb912f8ea1307f0464d76a1501a3b",
  "recoveries": [],
  "residual_risk": ["human-authority-unavailable"],
  "review_id": "review-6e1eb912f8ea1307f0464d76a1501a3b",
  "runtime": {
    "adapter_version": "1.0.0",
    "author": {
      "effort": "high",
      "host": "codex",
      "model_display": "gpt-6.1-sol",
      "model_id": "gpt-6.1-sol",
      "provider": "openai"
    },
    "classification": "SPR",
    "ownership": "broker",
    "project_root_digest": "974ea5a5e7b686529981c1d187381dfba13e99abd33e2e8154d11b6e6aba76e3",
    "reviewer": {
      "effort": "high",
      "host": "codex",
      "model_display": "gpt-6-astra",
      "model_id": "gpt-6-astra",
      "provider": "openai",
      "selector": "codex"
    },
    "schema": "ai-peer-review.runtime/v1",
    "transport_mode": "manual"
  },
  "schema": "ai-peer-review.manifest/v1",
  "startup_commit": "f68073be0b9e94bc8c035ff996604a7d75eabb94",
  "status": "accepted",
  "supplements": [],
  "turns": [
    {
      "artifact": {
        "blob": "fcde53a12d5e49cb1b02a957a18d7d6f2fe660f3",
        "digest": "sha256:44e70b02d0cac27217b805f387bdb6d8677a5f79ce136c33f2ebf4fd51d5422a",
        "path": "docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md"
      },
      "author_response": {
        "digest": "sha256:02ea9705beb71e2007c9962d9a8c4b4f84a2d298bc0eb2c482537ae595fa11b7",
        "path": "docs/peer-reviews/spec/2026-10-13-2026-10-12-voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/review-6e1eb912f8ea1307f0464d76a1501a3b-author-response-1.md"
      },
      "commit": "bd238bbc7e19787926bbef49ab226fb1dddbfa9e",
      "decision": "revisions-requested",
      "finding_ids": ["R1-F001", "R1-F002"],
      "reviewer_response": {
        "digest": "sha256:b195f62964250babad17749ebe99bf8e9826ff3e22cea3d849fe25711f7392e9",
        "path": "docs/peer-reviews/spec/2026-10-13-2026-10-12-voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/review-6e1eb912f8ea1307f0464d76a1501a3b-reviewer-response-1.md"
      },
      "snapshot": null,
      "turn": 1
    },
    {
      "artifact": null,
      "author_response": null,
      "commit": null,
      "decision": "accepted",
      "finding_ids": [],
      "reviewer_response": {
        "digest": "sha256:df1836ab835c6f4370887300737f015a4be89c239df655ba3d9821fbfae91a88",
        "path": "docs/peer-reviews/spec/2026-10-13-2026-10-12-voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/review-6e1eb912f8ea1307f0464d76a1501a3b-reviewer-response-2.md"
      },
      "snapshot": null,
      "turn": 2
    }
  ]
}
```
