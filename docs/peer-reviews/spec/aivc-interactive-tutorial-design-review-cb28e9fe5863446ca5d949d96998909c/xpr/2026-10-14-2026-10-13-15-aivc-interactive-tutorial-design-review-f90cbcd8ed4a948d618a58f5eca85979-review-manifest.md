> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/89fc7a6125cd4b2be6f0f338dea928bd81bcea45/docs/peer-reviews/spec/aivc-interactive-tutorial-design-review-cb28e9fe5863446ca5d949d96998909c/xpr/2026-10-14-2026-10-13-15-aivc-interactive-tutorial-design-review-f90cbcd8ed4a948d618a58f5eca85979-review-manifest.md) and its exact bytes remain available in the [tutorial evidence archive](../../../../quality-evidence/2026-10-14-25-tutorial-originals.json).
> Original SHA-256: `fed82a0ee5ed6f09e3f9ae29c8e00ea08dcd0ad87f75b8a40ef80c032abbfd75`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:e53bf4d9991ae94a699fede1d62fd90324e45923de951babcb8d9ad237900bd9" -->

# Review manifest

Mode: `normal`

```json
{
  "acceptance_basis": "reviewer-consensus",
  "artifact_history": [
    {
      "blob": "93e8d002f75338d8bff53b391b3aabb1c1d45689",
      "commit": "e84554dab3007a47e2317c02650b3d9ef0e8bf75",
      "digest": "sha256:9b3f489fcfa836f0f3d11f3545694949e22f0d66e611cd34260b0bff3a24f0aa",
      "path": "docs/superpowers/specs/2026-10-13-15-aivc-interactive-tutorial-design.md",
      "snapshot": null,
      "turn": 0
    },
    {
      "blob": "b7ca45d0d3dd6f4d6525c2cdb7e9203aa549de54",
      "commit": "71c5072fedc3253fb3348abccba111f2185d38dc",
      "digest": "sha256:df44844b8a23be5e6d0fcbde706ef98b5be6ce743247d69346db91282780014b",
      "path": "docs/superpowers/specs/2026-10-13-15-aivc-interactive-tutorial-design.md",
      "snapshot": null,
      "turn": 1
    },
    {
      "blob": "cbde29ffd6e11e6c22388dad6f76d37f60d5c127",
      "commit": "88710da8b264773f6d91202da53a01f69c06bdda",
      "digest": "sha256:21003d5aa659a206c04fe8508423376eff4a45658afd4e0b4f2b00522d0303b9",
      "path": "docs/superpowers/specs/2026-10-13-15-aivc-interactive-tutorial-design.md",
      "snapshot": null,
      "turn": 2
    }
  ],
  "artifact_path": "docs/superpowers/specs/2026-10-13-15-aivc-interactive-tutorial-design.md",
  "authority": {
    "acceptance_attestation": null,
    "policy": "unavailable",
    "verifier": null
  },
  "authority_assurance": "unavailable",
  "claims": [
    {
      "claim_id": "claim-f13c661c-29de-4aa3-b199-7c679ec2b834",
      "claimed_at": "2026-10-14T00:20:24.694Z",
      "expires_at": "2026-10-14T08:20:24.694Z",
      "host": "claude-code",
      "last_activity_at": "2026-10-14T00:20:24.694Z",
      "role": "reviewer",
      "session_fingerprint": "sha256:fc521f6ffe85276cea58c1beafe1060a10186a4a591f3ece4488abc358b95afe"
    },
    {
      "claim_id": "claim-058ad478-fe23-430f-a2fe-370ddfcdd523",
      "claimed_at": "2026-10-14T00:24:16.796Z",
      "expires_at": "2026-10-14T08:24:16.796Z",
      "host": "codex",
      "last_activity_at": "2026-10-14T00:24:16.796Z",
      "role": "author",
      "session_fingerprint": "sha256:5ece402976145543a077f7252d1886d8bf232cc796f307cf1b09283d8a62a21b"
    }
  ],
  "commit_mode": "normal",
  "final_commit": "88710da8b264773f6d91202da53a01f69c06bdda",
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
            "fingerprint": "sha256:5ece402976145543a077f7252d1886d8bf232cc796f307cf1b09283d8a62a21b",
            "source": "official-runtime"
          }
        },
        "host": "codex",
        "identity_source": "runtime",
        "joined_at": "2026-10-14T00:18:59.466Z",
        "model_display": "gpt-6.1-sol",
        "model_id": "gpt-6.1-sol",
        "provider": "openai",
        "role": "author",
        "session_fingerprint": "sha256:5ece402976145543a077f7252d1886d8bf232cc796f307cf1b09283d8a62a21b"
      },
      "role": "author",
      "sequence": 3
    }
  ],
  "lineage_receipt": {
    "attempts": [
      {
        "consumed_grant_digest": null,
        "event_log_digest": "sha256:da3cea93d24de461750a5b3c9d1083b598252cd6e0cd970c10a9a3b35073dc6b",
        "predecessor_review_id": null,
        "reciprocal_receipt_digest": null,
        "record_id": "review-f90cbcd8ed4a948d618a58f5eca85979",
        "recovery_claim_digest": null,
        "recovery_id": null,
        "recovery_ordinal": 0,
        "review_id": "review-f90cbcd8ed4a948d618a58f5eca85979",
        "root_review_id": "review-f90cbcd8ed4a948d618a58f5eca85979",
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
          "fingerprint": "sha256:5ece402976145543a077f7252d1886d8bf232cc796f307cf1b09283d8a62a21b",
          "source": "official-runtime"
        }
      },
      "host": "codex",
      "identity_source": "runtime",
      "joined_at": "2026-10-14T00:18:59.466Z",
      "model_display": "gpt-6.1-sol",
      "model_id": "gpt-6.1-sol",
      "provider": "openai",
      "role": "author",
      "session_fingerprint": "sha256:5ece402976145543a077f7252d1886d8bf232cc796f307cf1b09283d8a62a21b"
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
          "fingerprint": "sha256:fc521f6ffe85276cea58c1beafe1060a10186a4a591f3ece4488abc358b95afe",
          "source": "environment-declaration"
        }
      },
      "host": "claude-code",
      "identity_source": "runtime",
      "joined_at": "2026-10-14T00:20:24.666Z",
      "model_display": "claude-opus-5-5",
      "model_id": "claude-opus-5-5",
      "provider": "anthropic",
      "role": "reviewer",
      "session_fingerprint": "sha256:fc521f6ffe85276cea58c1beafe1060a10186a4a591f3ece4488abc358b95afe"
    }
  },
  "record_id": "review-f90cbcd8ed4a948d618a58f5eca85979",
  "recoveries": [],
  "residual_risk": ["human-authority-unavailable"],
  "review_id": "review-f90cbcd8ed4a948d618a58f5eca85979",
  "runtime": {
    "adapter_version": "1.0.0",
    "author": {
      "effort": "high",
      "host": "codex",
      "model_display": "gpt-6.1-sol",
      "model_id": "gpt-6.1-sol",
      "provider": "openai"
    },
    "classification": "XPR",
    "ownership": "broker",
    "project_root_digest": "974ea5a5e7b686529981c1d187381dfba13e99abd33e2e8154d11b6e6aba76e3",
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
  "startup_commit": "e84554dab3007a47e2317c02650b3d9ef0e8bf75",
  "status": "accepted",
  "supplements": [],
  "turns": [
    {
      "artifact": {
        "blob": "b7ca45d0d3dd6f4d6525c2cdb7e9203aa549de54",
        "digest": "sha256:df44844b8a23be5e6d0fcbde706ef98b5be6ce743247d69346db91282780014b",
        "path": "docs/superpowers/specs/2026-10-13-15-aivc-interactive-tutorial-design.md"
      },
      "author_response": {
        "digest": "sha256:098f6d9f095188c9360467f65446b06c52d0a3658a497b2068cbe0c55ea5d357",
        "path": "docs/peer-reviews/spec/aivc-interactive-tutorial-design-review-cb28e9fe5863446ca5d949d96998909c/xpr/2026-10-14-2026-10-13-15-aivc-interactive-tutorial-design-review-f90cbcd8ed4a948d618a58f5eca85979-author-response-1.md"
      },
      "commit": "71c5072fedc3253fb3348abccba111f2185d38dc",
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
        "digest": "sha256:54e209707897a06ec8032ff08c1ed8cbb21773e504b2acc2a5548b03e94d05eb",
        "path": "docs/peer-reviews/spec/aivc-interactive-tutorial-design-review-cb28e9fe5863446ca5d949d96998909c/xpr/2026-10-14-2026-10-13-15-aivc-interactive-tutorial-design-review-f90cbcd8ed4a948d618a58f5eca85979-reviewer-response-1.md"
      },
      "snapshot": null,
      "turn": 1
    },
    {
      "artifact": {
        "blob": "cbde29ffd6e11e6c22388dad6f76d37f60d5c127",
        "digest": "sha256:21003d5aa659a206c04fe8508423376eff4a45658afd4e0b4f2b00522d0303b9",
        "path": "docs/superpowers/specs/2026-10-13-15-aivc-interactive-tutorial-design.md"
      },
      "author_response": {
        "digest": "sha256:f7839ef086d866dc99197e960a4b86c2569e7938e4de578620b7c7e43abafc89",
        "path": "docs/peer-reviews/spec/aivc-interactive-tutorial-design-review-cb28e9fe5863446ca5d949d96998909c/xpr/2026-10-14-2026-10-13-15-aivc-interactive-tutorial-design-review-f90cbcd8ed4a948d618a58f5eca85979-author-response-2.md"
      },
      "commit": "88710da8b264773f6d91202da53a01f69c06bdda",
      "decision": "revisions-requested",
      "finding_ids": ["R2-F001", "R2-F002"],
      "reviewer_response": {
        "digest": "sha256:573a0ccc716a72d48200df7c327a65e385f8d155a160195ac5e9546ec73ed5ee",
        "path": "docs/peer-reviews/spec/aivc-interactive-tutorial-design-review-cb28e9fe5863446ca5d949d96998909c/xpr/2026-10-14-2026-10-13-15-aivc-interactive-tutorial-design-review-f90cbcd8ed4a948d618a58f5eca85979-reviewer-response-2.md"
      },
      "snapshot": null,
      "turn": 2
    },
    {
      "artifact": null,
      "author_response": null,
      "commit": null,
      "decision": "accepted",
      "finding_ids": [],
      "reviewer_response": {
        "digest": "sha256:b17a38d5f3acf31c0f76b3a519c944a8fa607969acd5343ea66ad2bdc6b18daf",
        "path": "docs/peer-reviews/spec/aivc-interactive-tutorial-design-review-cb28e9fe5863446ca5d949d96998909c/xpr/2026-10-14-2026-10-13-15-aivc-interactive-tutorial-design-review-f90cbcd8ed4a948d618a58f5eca85979-reviewer-response-3.md"
      },
      "snapshot": null,
      "turn": 3
    }
  ]
}
```
