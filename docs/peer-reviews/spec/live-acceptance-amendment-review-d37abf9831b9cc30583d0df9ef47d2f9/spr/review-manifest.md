<!-- ai-peer-review-template version="1" digest="sha256:e53bf4d9991ae94a699fede1d62fd90324e45923de951babcb8d9ad237900bd9" -->

# Review manifest

Mode: `normal`

```json
{
  "acceptance_basis": "reviewer-consensus",
  "artifact_history": [
    {
      "blob": "6d10c3e71de0f3b95ac616ab3be4609eb3cf6672",
      "commit": "75ffee8031203efec513b589daf74f2f2ab4453d",
      "digest": "sha256:e15e9cbace3029fa11a457383c5c2ed8fd78be27b437ffe0efe39780553cddd5",
      "path": "docs/superpowers/specs/2026-10-15-11-live-acceptance-amendment-design.md",
      "snapshot": null,
      "turn": 0
    }
  ],
  "artifact_path": "docs/superpowers/specs/2026-10-15-11-live-acceptance-amendment-design.md",
  "authority": {
    "acceptance_attestation": null,
    "policy": "unavailable",
    "verifier": null
  },
  "authority_assurance": "unavailable",
  "claims": [
    {
      "claim_id": "claim-9b49a317-df2a-4218-8088-5c08547dc38d",
      "claimed_at": "2026-10-15T12:04:09.276Z",
      "expires_at": "2026-10-15T20:04:09.276Z",
      "host": "codex",
      "last_activity_at": "2026-10-15T12:04:09.276Z",
      "role": "reviewer",
      "session_fingerprint": "sha256:c49b4f95e79c99a6b92cc1f02033c5dc3506e13dcdac71db6a8a01c5faf482be"
    },
    {
      "claim_id": "claim-7e678d2c-23bc-42c5-9853-b854c15012df",
      "claimed_at": "2026-10-15T12:09:13.390Z",
      "expires_at": "2026-10-15T20:09:13.390Z",
      "host": "codex",
      "last_activity_at": "2026-10-15T12:09:13.390Z",
      "role": "author",
      "session_fingerprint": "sha256:97f4eda0c08a07bbc46f8d863684f53faeef742e8350a3e47249055671354305"
    }
  ],
  "commit_mode": "normal",
  "final_commit": "75ffee8031203efec513b589daf74f2f2ab4453d",
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
            "fingerprint": "sha256:97f4eda0c08a07bbc46f8d863684f53faeef742e8350a3e47249055671354305",
            "source": "official-runtime"
          }
        },
        "host": "codex",
        "identity_source": "runtime",
        "joined_at": "2026-10-15T12:01:35.412Z",
        "model_display": "gpt-6.1-sol",
        "model_id": "gpt-6.1-sol",
        "provider": "openai",
        "role": "author",
        "session_fingerprint": "sha256:97f4eda0c08a07bbc46f8d863684f53faeef742e8350a3e47249055671354305"
      },
      "role": "author",
      "sequence": 3
    }
  ],
  "lineage_receipt": {
    "attempts": [
      {
        "consumed_grant_digest": null,
        "event_log_digest": "sha256:e30e0da790a92c33f8ac04338a9432a23eda6a479728fa3a19dea80737f045fc",
        "predecessor_review_id": null,
        "reciprocal_receipt_digest": null,
        "record_id": "review-d37abf9831b9cc30583d0df9ef47d2f9",
        "recovery_claim_digest": null,
        "recovery_id": null,
        "recovery_ordinal": 0,
        "review_id": "review-d37abf9831b9cc30583d0df9ef47d2f9",
        "root_review_id": "review-d37abf9831b9cc30583d0df9ef47d2f9",
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
          "fingerprint": "sha256:97f4eda0c08a07bbc46f8d863684f53faeef742e8350a3e47249055671354305",
          "source": "official-runtime"
        }
      },
      "host": "codex",
      "identity_source": "runtime",
      "joined_at": "2026-10-15T12:01:35.412Z",
      "model_display": "gpt-6.1-sol",
      "model_id": "gpt-6.1-sol",
      "provider": "openai",
      "role": "author",
      "session_fingerprint": "sha256:97f4eda0c08a07bbc46f8d863684f53faeef742e8350a3e47249055671354305"
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
          "fingerprint": "sha256:c49b4f95e79c99a6b92cc1f02033c5dc3506e13dcdac71db6a8a01c5faf482be",
          "source": "environment-declaration"
        }
      },
      "host": "codex",
      "identity_source": "declared",
      "joined_at": "2026-10-15T12:04:09.275Z",
      "model_display": "gpt-6-astra",
      "model_id": "gpt-6-astra",
      "provider": "openai",
      "role": "reviewer",
      "session_fingerprint": "sha256:c49b4f95e79c99a6b92cc1f02033c5dc3506e13dcdac71db6a8a01c5faf482be"
    }
  },
  "record_id": "review-d37abf9831b9cc30583d0df9ef47d2f9",
  "recoveries": [],
  "residual_risk": [
    "human-authority-unavailable"
  ],
  "review_id": "review-d37abf9831b9cc30583d0df9ef47d2f9",
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
    "project_root_digest": "0a7c0dec9e26dc41ab89e2d8bb28e8044cc40906d3c5095c9b9815feb6063944",
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
  "startup_commit": "75ffee8031203efec513b589daf74f2f2ab4453d",
  "status": "accepted",
  "supplements": [],
  "turns": [
    {
      "artifact": null,
      "author_response": null,
      "commit": null,
      "decision": "accepted",
      "finding_ids": [],
      "reviewer_response": {
        "digest": "sha256:f7ad186c2eeef0f8d7a14f60c5867711989dc3a54c8776b4249a495d1712866c",
        "path": "docs/peer-reviews/spec/live-acceptance-amendment-review-d37abf9831b9cc30583d0df9ef47d2f9/spr/reviewer-response-1.md"
      },
      "snapshot": null,
      "turn": 1
    }
  ]
}
```
