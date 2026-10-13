<!-- ai-peer-review-template version="1" digest="sha256:e53bf4d9991ae94a699fede1d62fd90324e45923de951babcb8d9ad237900bd9" -->

# Review manifest

Mode: `normal`

```json
{
  "acceptance_basis": "reviewer-consensus",
  "artifact_history": [
    {
      "blob": "8f2f3f3551512ba83c90ef94c7ab34114413dbef",
      "commit": "183bfda3715ff7d6dd5ffd7cfaecbf5987d971eb",
      "digest": "sha256:555fdbbcf7ecc3234087733cc694bb7bbf5952d773739258c2b285a0bd69e3de",
      "path": "docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md",
      "snapshot": null,
      "turn": 0
    },
    {
      "blob": "6c9c69f7fa6f4c1f0f3ebfce426cd9c121373b95",
      "commit": "8efbdd19f03609f8429237c9be4b218f2ebcf427",
      "digest": "sha256:276b5337f8d7b5597f15d872e7c13f74bdc93b9cb78b5a981792181a9f08b837",
      "path": "docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md",
      "snapshot": null,
      "turn": 1
    },
    {
      "blob": "738b325242007637f88ec19a5ab79e57c4a20d85",
      "commit": "cb82f730f63ba0e0bd4480f7bc76ca09d286af83",
      "digest": "sha256:5dc37eb3c25f59d056756b45582a584ea321ac3a881041992b073b5a3656523e",
      "path": "docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md",
      "snapshot": null,
      "turn": 2
    }
  ],
  "artifact_path": "docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md",
  "authority": {
    "acceptance_attestation": null,
    "policy": "unavailable",
    "verifier": null
  },
  "authority_assurance": "unavailable",
  "claims": [
    {
      "claim_id": "claim-b65425b4-30a0-4870-ac60-9900df614f46",
      "claimed_at": "2026-10-13T05:51:08.248Z",
      "expires_at": "2026-10-13T13:51:08.248Z",
      "host": "claude-code",
      "last_activity_at": "2026-10-13T05:51:08.248Z",
      "role": "reviewer",
      "session_fingerprint": "sha256:54bb4b51f8ef2cf4bc224815244edf83497147eeef35a62104d8cd8661463384"
    },
    {
      "claim_id": "claim-df503e40-0f6d-4840-99cc-8d5bbd4816c6",
      "claimed_at": "2026-10-13T05:56:21.910Z",
      "expires_at": "2026-10-13T13:56:21.910Z",
      "host": "codex",
      "last_activity_at": "2026-10-13T05:56:21.910Z",
      "role": "author",
      "session_fingerprint": "sha256:48daf6ba8b2a5f061e5b9a3cf267a2f0de1f0f3a80cf29b2774ae19f87408a30"
    }
  ],
  "commit_mode": "normal",
  "final_commit": "cb82f730f63ba0e0bd4480f7bc76ca09d286af83",
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
            "fingerprint": "sha256:48daf6ba8b2a5f061e5b9a3cf267a2f0de1f0f3a80cf29b2774ae19f87408a30",
            "source": "official-runtime"
          }
        },
        "host": "codex",
        "identity_source": "runtime",
        "joined_at": "2026-10-13T05:50:03.429Z",
        "model_display": "gpt-6.1-sol",
        "model_id": "gpt-6.1-sol",
        "provider": "openai",
        "role": "author",
        "session_fingerprint": "sha256:48daf6ba8b2a5f061e5b9a3cf267a2f0de1f0f3a80cf29b2774ae19f87408a30"
      },
      "role": "author",
      "sequence": 3
    }
  ],
  "lineage_receipt": {
    "attempts": [
      {
        "consumed_grant_digest": null,
        "event_log_digest": "sha256:106e9908e08c4e9322efe9daf48c5f5c9924a94f2d2b554c07a79666017878b6",
        "predecessor_review_id": null,
        "reciprocal_receipt_digest": null,
        "record_id": "review-32a4e2abdf4ea9f798620982b5f63e8a",
        "recovery_claim_digest": null,
        "recovery_id": null,
        "recovery_ordinal": 0,
        "review_id": "review-32a4e2abdf4ea9f798620982b5f63e8a",
        "root_review_id": "review-32a4e2abdf4ea9f798620982b5f63e8a",
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
          "fingerprint": "sha256:48daf6ba8b2a5f061e5b9a3cf267a2f0de1f0f3a80cf29b2774ae19f87408a30",
          "source": "official-runtime"
        }
      },
      "host": "codex",
      "identity_source": "runtime",
      "joined_at": "2026-10-13T05:50:03.429Z",
      "model_display": "gpt-6.1-sol",
      "model_id": "gpt-6.1-sol",
      "provider": "openai",
      "role": "author",
      "session_fingerprint": "sha256:48daf6ba8b2a5f061e5b9a3cf267a2f0de1f0f3a80cf29b2774ae19f87408a30"
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
          "fingerprint": "sha256:54bb4b51f8ef2cf4bc224815244edf83497147eeef35a62104d8cd8661463384",
          "source": "environment-declaration"
        }
      },
      "host": "claude-code",
      "identity_source": "runtime",
      "joined_at": "2026-10-13T05:51:08.220Z",
      "model_display": "claude-opus-5-5",
      "model_id": "claude-opus-5-5",
      "provider": "anthropic",
      "role": "reviewer",
      "session_fingerprint": "sha256:54bb4b51f8ef2cf4bc224815244edf83497147eeef35a62104d8cd8661463384"
    }
  },
  "record_id": "review-32a4e2abdf4ea9f798620982b5f63e8a",
  "recoveries": [],
  "residual_risk": [
    "human-authority-unavailable"
  ],
  "review_id": "review-32a4e2abdf4ea9f798620982b5f63e8a",
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
  "startup_commit": "183bfda3715ff7d6dd5ffd7cfaecbf5987d971eb",
  "status": "accepted",
  "supplements": [],
  "turns": [
    {
      "artifact": {
        "blob": "6c9c69f7fa6f4c1f0f3ebfce426cd9c121373b95",
        "digest": "sha256:276b5337f8d7b5597f15d872e7c13f74bdc93b9cb78b5a981792181a9f08b837",
        "path": "docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md"
      },
      "author_response": {
        "digest": "sha256:74fce2b0d8f5c064cb5fa9bab966964fac7d8bda9d27455702ebb365e3836bd5",
        "path": "docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/2026-10-13-2026-10-12-2-voice-bff-reference-review-32a4e2abdf4ea9f798620982b5f63e8a-author-response-1.md"
      },
      "commit": "8efbdd19f03609f8429237c9be4b218f2ebcf427",
      "decision": "revisions-requested",
      "finding_ids": [
        "R1-F001",
        "R1-F002",
        "R1-F003",
        "R1-F004",
        "R1-F005",
        "R1-F006"
      ],
      "reviewer_response": {
        "digest": "sha256:af2acc657cf7bf8fc7e2fddb2fe202c62b775cbe9bce0ac5f1b82bc24eba662c",
        "path": "docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/2026-10-13-2026-10-12-2-voice-bff-reference-review-32a4e2abdf4ea9f798620982b5f63e8a-reviewer-response-1.md"
      },
      "snapshot": null,
      "turn": 1
    },
    {
      "artifact": {
        "blob": "738b325242007637f88ec19a5ab79e57c4a20d85",
        "digest": "sha256:5dc37eb3c25f59d056756b45582a584ea321ac3a881041992b073b5a3656523e",
        "path": "docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md"
      },
      "author_response": {
        "digest": "sha256:baaeacc0b07e9860ea96412b3eef8cbb3851fabdbc64f660ef619fe7bdf24b8f",
        "path": "docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/2026-10-13-2026-10-12-2-voice-bff-reference-review-32a4e2abdf4ea9f798620982b5f63e8a-author-response-2.md"
      },
      "commit": "cb82f730f63ba0e0bd4480f7bc76ca09d286af83",
      "decision": "revisions-requested",
      "finding_ids": [
        "R2-F001"
      ],
      "reviewer_response": {
        "digest": "sha256:7661e55b1ebd889ce4c35e5f4bfe2fb796ed0549a55847f02a48237fd86f136a",
        "path": "docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/2026-10-13-2026-10-12-2-voice-bff-reference-review-32a4e2abdf4ea9f798620982b5f63e8a-reviewer-response-2.md"
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
        "digest": "sha256:cae905a8a672c003ebe57992564843a00384275e3dc7db9481e1c142563568ba",
        "path": "docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/xpr/2026-10-13-2026-10-12-2-voice-bff-reference-review-32a4e2abdf4ea9f798620982b5f63e8a-reviewer-response-3.md"
      },
      "snapshot": null,
      "turn": 3
    }
  ]
}
```
