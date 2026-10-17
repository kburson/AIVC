<!-- ai-peer-review-template version="1" digest="sha256:e53bf4d9991ae94a699fede1d62fd90324e45923de951babcb8d9ad237900bd9" -->

# Review manifest

> **LOCAL JOURNAL MODE** — authority assurance: `unavailable`

```json
{
  "acceptance_basis": "reviewer-consensus",
  "artifact_history": [
    {
      "blob": "9f4fe68867a0864f32b86d38c7c832a6d584f221",
      "commit": "e6f70cbb52fa5b5651cd3c3817f3e7104deb2a14",
      "digest": "sha256:ba0da2e873c29d41dd1947720aeffd586709e5ec95eb356752dd068d8dfce76a",
      "path": "docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md",
      "snapshot": null,
      "turn": 0
    },
    {
      "blob": "b0ae6d454c6ff109a403067594ab89af0924f680",
      "commit": null,
      "digest": "sha256:eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350",
      "path": "docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md",
      "snapshot": {
        "digest": "sha256:eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350",
        "path": "artifacts/turn-1.md"
      },
      "turn": 1
    }
  ],
  "artifact_path": "docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md",
  "authority": {
    "acceptance_attestation": null,
    "policy": "unavailable",
    "verifier": null
  },
  "authority_assurance": "unavailable",
  "claims": [
    {
      "claim_id": "claim-7ea996f2-b894-4506-9798-e8ff1feefd4e",
      "claimed_at": "2026-10-17T09:13:18.732Z",
      "expires_at": "2026-10-17T17:13:18.732Z",
      "host": "claude-code",
      "last_activity_at": "2026-10-17T09:13:18.732Z",
      "role": "reviewer",
      "session_fingerprint": "sha256:36fa55b446e522f55e4fc3f6d284dd591a436eb4e96b1bdf4772d693e907b3d3"
    },
    {
      "claim_id": "claim-a740150a-2d40-4214-a49c-455c56f5ca9e",
      "claimed_at": "2026-10-17T09:17:18.872Z",
      "expires_at": "2026-10-17T17:17:18.872Z",
      "host": "codex",
      "last_activity_at": "2026-10-17T09:17:18.872Z",
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
        "joined_at": "2026-10-17T09:10:55.923Z",
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
        "event_log_digest": "sha256:7f35f155a6b1f210cc9bf4429e4e670f7d3f3c000044ac2102ffcbdcc51ccdf8",
        "predecessor_review_id": null,
        "reciprocal_receipt_digest": null,
        "record_id": "review-3f99142a6b19c9dcbe0e6e53c7b1354a",
        "recovery_claim_digest": null,
        "recovery_id": null,
        "recovery_ordinal": 0,
        "review_id": "review-3f99142a6b19c9dcbe0e6e53c7b1354a",
        "root_review_id": "review-3f99142a6b19c9dcbe0e6e53c7b1354a",
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
      "joined_at": "2026-10-17T09:10:55.923Z",
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
          "fingerprint": "sha256:36fa55b446e522f55e4fc3f6d284dd591a436eb4e96b1bdf4772d693e907b3d3",
          "source": "environment-declaration"
        }
      },
      "host": "claude-code",
      "identity_source": "runtime",
      "joined_at": "2026-10-17T09:13:18.696Z",
      "model_display": "claude-opus-5-5",
      "model_id": "claude-opus-5-5",
      "provider": "anthropic",
      "role": "reviewer",
      "session_fingerprint": "sha256:36fa55b446e522f55e4fc3f6d284dd591a436eb4e96b1bdf4772d693e907b3d3"
    }
  },
  "record_id": "review-3f99142a6b19c9dcbe0e6e53c7b1354a",
  "recoveries": [],
  "residual_risk": [
    "human-authority-unavailable"
  ],
  "review_id": "review-3f99142a6b19c9dcbe0e6e53c7b1354a",
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
  "startup_commit": "e6f70cbb52fa5b5651cd3c3817f3e7104deb2a14",
  "status": "accepted-uncommitted",
  "supplements": [],
  "turns": [
    {
      "artifact": {
        "blob": "b0ae6d454c6ff109a403067594ab89af0924f680",
        "digest": "sha256:eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350",
        "path": "docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md"
      },
      "author_response": {
        "digest": "sha256:9a454aa51f638d018f8ab4c4ef35f19383538a74e17c3305d5635c4e4613f148",
        "path": "docs/peer-reviews/plan/stateless-service-migration-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-review-3f99142a6b19c9dcbe0e6e53c7b1354a-author-response-1.md"
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
        "R1-F010"
      ],
      "reviewer_response": {
        "digest": "sha256:063ff8c0b32407c4ae346ddf8b73cebd100a4fb9105c10d9b0d11ab87f7ab2a9",
        "path": "docs/peer-reviews/plan/stateless-service-migration-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-review-3f99142a6b19c9dcbe0e6e53c7b1354a-reviewer-response-1.md"
      },
      "snapshot": {
        "digest": "sha256:eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350",
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
        "R2-F003"
      ],
      "reviewer_response": {
        "digest": "sha256:e2b0046e9d38ead19e2bc10b4511bc151ea6298d529c4c69f81b13b20000154a",
        "path": "docs/peer-reviews/plan/stateless-service-migration-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-review-3f99142a6b19c9dcbe0e6e53c7b1354a-reviewer-response-2.md"
      },
      "snapshot": null,
      "turn": 2
    }
  ]
}
```
