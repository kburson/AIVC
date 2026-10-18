<!-- ai-peer-review-template version="1" digest="sha256:e53bf4d9991ae94a699fede1d62fd90324e45923de951babcb8d9ad237900bd9" -->

# Review manifest

> **LOCAL JOURNAL MODE** — authority assurance: `unavailable`

```json
{
  "acceptance_basis": "reviewer-consensus",
  "artifact_history": [
    {
      "blob": "80453a0b32da580da554401b96e411f8189f0cd7",
      "commit": "722f9d7f386abc81b789f9a69b245b4011593e86",
      "digest": "sha256:fecb93bdc40e6f2636f04bb243d7f5cbf74cbb8041f8c16891f38db4c643d1d4",
      "path": "docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md",
      "snapshot": null,
      "turn": 0
    },
    {
      "blob": "cbd612b1fe8bcc0d9137fe1c9e9ca2c4de7837af",
      "commit": null,
      "digest": "sha256:f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28",
      "path": "docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md",
      "snapshot": {
        "digest": "sha256:f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28",
        "path": "artifacts/turn-1.md"
      },
      "turn": 1
    }
  ],
  "artifact_path": "docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md",
  "authority": {
    "acceptance_attestation": null,
    "policy": "unavailable",
    "verifier": null
  },
  "authority_assurance": "unavailable",
  "claims": [
    {
      "claim_id": "claim-6de90c46-0bb7-4372-8bf2-72f8279add94",
      "claimed_at": "2026-10-17T08:40:42.218Z",
      "expires_at": "2026-10-17T16:40:42.218Z",
      "host": "claude-code",
      "last_activity_at": "2026-10-17T08:40:42.218Z",
      "role": "reviewer",
      "session_fingerprint": "sha256:e5a477dd9d446b3eeee37efb9e161b3393c72b6a8945835dcb19330f75afa47c"
    },
    {
      "claim_id": "claim-ed9ce191-6b70-4050-96b1-d076ad682389",
      "claimed_at": "2026-10-17T08:44:29.672Z",
      "expires_at": "2026-10-17T16:44:29.672Z",
      "host": "codex",
      "last_activity_at": "2026-10-17T08:44:29.672Z",
      "role": "author",
      "session_fingerprint": "sha256:3c8a7ddce72ffb1862ebe766fb8e3e447c90e195d470d69ffe8d8cd7930c30cf"
    }
  ],
  "commit_mode": "no-commit",
  "final_commit": null,
  "human_decision": null,
  "identity_changes": [
    {
      "identity": {
        "evidence": {
          "model": {
            "assurance": "observed",
            "conflict": false,
            "declared_id": null,
            "observed_id": "gpt-6.1-sol",
            "requested_id": null,
            "source": "provider-result"
          },
          "session": {
            "assurance": "observed",
            "fingerprint": "sha256:3c8a7ddce72ffb1862ebe766fb8e3e447c90e195d470d69ffe8d8cd7930c30cf",
            "source": "provider-result"
          }
        },
        "host": "codex",
        "identity_source": "runtime",
        "joined_at": "2026-10-17T08:39:33.140Z",
        "model_display": "gpt-6.1-sol",
        "model_id": "gpt-6.1-sol",
        "provider": "openai",
        "role": "author",
        "session_fingerprint": "sha256:3c8a7ddce72ffb1862ebe766fb8e3e447c90e195d470d69ffe8d8cd7930c30cf"
      },
      "role": "author",
      "sequence": 3
    }
  ],
  "lineage_receipt": {
    "attempts": [
      {
        "consumed_grant_digest": null,
        "event_log_digest": "sha256:807356a8a287ef96a4df9f10823f692c391cb0886fc99df9654997d8470941f9",
        "predecessor_review_id": null,
        "reciprocal_receipt_digest": null,
        "record_id": "review-0009efb5ca6886291ad48628afa78120",
        "recovery_claim_digest": null,
        "recovery_id": null,
        "recovery_ordinal": 0,
        "review_id": "review-0009efb5ca6886291ad48628afa78120",
        "root_review_id": "review-0009efb5ca6886291ad48628afa78120",
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
          "assurance": "observed",
          "conflict": false,
          "declared_id": null,
          "observed_id": "gpt-6.1-sol",
          "requested_id": null,
          "source": "provider-result"
        },
        "session": {
          "assurance": "observed",
          "fingerprint": "sha256:3c8a7ddce72ffb1862ebe766fb8e3e447c90e195d470d69ffe8d8cd7930c30cf",
          "source": "provider-result"
        }
      },
      "host": "codex",
      "identity_source": "runtime",
      "joined_at": "2026-10-17T08:39:33.140Z",
      "model_display": "gpt-6.1-sol",
      "model_id": "gpt-6.1-sol",
      "provider": "openai",
      "role": "author",
      "session_fingerprint": "sha256:3c8a7ddce72ffb1862ebe766fb8e3e447c90e195d470d69ffe8d8cd7930c30cf"
    },
    "reviewer": {
      "evidence": {
        "model": {
          "assurance": "declared",
          "conflict": false,
          "declared_id": "claude-opus-5-5",
          "observed_id": null,
          "requested_id": null,
          "source": "environment-declaration"
        },
        "session": {
          "assurance": "declared",
          "fingerprint": "sha256:e5a477dd9d446b3eeee37efb9e161b3393c72b6a8945835dcb19330f75afa47c",
          "source": "environment-declaration"
        }
      },
      "host": "claude-code",
      "identity_source": "runtime",
      "joined_at": "2026-10-17T08:40:42.185Z",
      "model_display": "claude-opus-5-5",
      "model_id": "claude-opus-5-5",
      "provider": "anthropic",
      "role": "reviewer",
      "session_fingerprint": "sha256:e5a477dd9d446b3eeee37efb9e161b3393c72b6a8945835dcb19330f75afa47c"
    }
  },
  "record_id": "review-0009efb5ca6886291ad48628afa78120",
  "recoveries": [],
  "residual_risk": [
    "human-authority-unavailable"
  ],
  "review_id": "review-0009efb5ca6886291ad48628afa78120",
  "runtime": {
    "adapter_version": "1.0.0",
    "classification": "XPR",
    "ownership": "broker",
    "project_root_digest": "b07f727005ae444dada34edd1f9d1bbd238e9f602ea9d1a83dd91789178156f9",
    "reviewer": {
      "effort": "high",
      "host": "claude-code",
      "model_display": "claude-opus-5-5",
      "model_id": "claude-opus-5-5",
      "provider": "anthropic",
      "selector": "claude"
    },
    "schema": "ai-peer-review.runtime/v1",
    "transport_mode": "manual"
  },
  "schema": "ai-peer-review.manifest/v1",
  "startup_commit": "722f9d7f386abc81b789f9a69b245b4011593e86",
  "status": "accepted-uncommitted",
  "supplements": [],
  "turns": [
    {
      "artifact": {
        "blob": "cbd612b1fe8bcc0d9137fe1c9e9ca2c4de7837af",
        "digest": "sha256:f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28",
        "path": "docs/superpowers/specs/2026-10-16-40-stateless-service-migration-design.md"
      },
      "author_response": {
        "digest": "sha256:f576933351fba27827ccc718b250e1e3898cbea840d9f6dbce1e646ee063ac73",
        "path": "docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-author-response-1.md"
      },
      "commit": null,
      "decision": "revisions-requested",
      "finding_ids": [
        "R1-F001",
        "R1-F002",
        "R1-F003",
        "R1-F004",
        "R1-F005",
        "R1-F006",
        "R1-F007",
        "R1-F008",
        "R1-F009",
        "R1-F010",
        "R1-F011"
      ],
      "reviewer_response": {
        "digest": "sha256:96bcb0215a7b1d144cb0f3361bef3520e5fa76e3268202c9a7c2b9f8726b4b93",
        "path": "docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-reviewer-response-1.md"
      },
      "snapshot": {
        "digest": "sha256:f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28",
        "path": "artifacts/turn-1.md"
      },
      "turn": 1
    },
    {
      "artifact": null,
      "author_response": null,
      "commit": null,
      "decision": "accepted",
      "finding_ids": [
        "R2-F001",
        "R2-F002",
        "R2-F003",
        "R2-F004",
        "R2-F005"
      ],
      "reviewer_response": {
        "digest": "sha256:fa0ab0ee9afb0aac4b1024fb91af3747a1d11a07105e762c8c3bf67550afe93d",
        "path": "docs/peer-reviews/spec/stateless-service-migration-design-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-design-review-0009efb5ca6886291ad48628afa78120-reviewer-response-2.md"
      },
      "snapshot": null,
      "turn": 2
    }
  ]
}
```
