> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/spec/voice-bff-reference-design-review-6e1eb912f8ea1307f0464d76a1501a3b/xpr/review-0905b6c7c8f1d7f6f479e1ba143799d3-review-manifest.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `440289dca294adb27e5a8ba7f19bdd073674772bb7514036a2942959c50d14ab`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:e53bf4d9991ae94a699fede1d62fd90324e45923de951babcb8d9ad237900bd9" -->

# Review manifest

Mode: `normal`

```json
{
  "acceptance_basis": "reviewer-consensus",
  "artifact_history": [
    {
      "blob": "fcde53a12d5e49cb1b02a957a18d7d6f2fe660f3",
      "commit": "cd745923c83e7b45d1a795ffcf4e87a193d4771a",
      "digest": "sha256:44e70b02d0cac27217b805f387bdb6d8677a5f79ce136c33f2ebf4fd51d5422a",
      "path": "docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md",
      "snapshot": null,
      "turn": 0
    },
    {
      "blob": "1f3b495cdc97e23b2b50786f4ca42cdef1e95d6c",
      "commit": "bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac",
      "digest": "sha256:8512daa8c456af00628a16471d4b13526c7585172c223c8bfa0f2323bee4fff6",
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
      "claim_id": "claim-1ae0f77f-b8ba-412e-a171-b34dae2c5537",
      "claimed_at": "2026-10-13T03:13:14.805Z",
      "expires_at": "2026-10-13T11:13:14.805Z",
      "host": "claude-code",
      "last_activity_at": "2026-10-13T03:13:14.805Z",
      "role": "reviewer",
      "session_fingerprint": "sha256:fda8e7de99ee2c1fed79750f470d63803a60856d5cb5b7c62647757e55d14659"
    },
    {
      "claim_id": "claim-5bb60a8b-9592-4c8c-8ab3-f65a24cb611f",
      "claimed_at": "2026-10-13T03:16:16.952Z",
      "expires_at": "2026-10-13T11:16:16.952Z",
      "host": "codex",
      "last_activity_at": "2026-10-13T03:16:16.952Z",
      "role": "author",
      "session_fingerprint": "sha256:303babcc83e3373412fb6bcb163feb218ba76be7f97adb90927d06ffe0b09903"
    }
  ],
  "commit_mode": "normal",
  "final_commit": "bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac",
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
        "joined_at": "2026-10-13T03:12:28.570Z",
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
        "event_log_digest": "sha256:81769b858e6d24c9894ead0584a46c699ab99517eab858f4523b9c60b927fc1b",
        "predecessor_review_id": null,
        "reciprocal_receipt_digest": null,
        "record_id": "review-0905b6c7c8f1d7f6f479e1ba143799d3",
        "recovery_claim_digest": null,
        "recovery_id": null,
        "recovery_ordinal": 0,
        "review_id": "review-0905b6c7c8f1d7f6f479e1ba143799d3",
        "root_review_id": "review-0905b6c7c8f1d7f6f479e1ba143799d3",
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
      "joined_at": "2026-10-13T03:12:28.570Z",
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
          "declared_id": "claude-opus-5-5",
          "observed_id": null,
          "requested_id": null,
          "source": "environment-declaration"
        },
        "session": {
          "assurance": "declared",
          "fingerprint": "sha256:fda8e7de99ee2c1fed79750f470d63803a60856d5cb5b7c62647757e55d14659",
          "source": "environment-declaration"
        }
      },
      "host": "claude-code",
      "identity_source": "runtime",
      "joined_at": "2026-10-13T03:13:14.779Z",
      "model_display": "claude-opus-5-5",
      "model_id": "claude-opus-5-5",
      "provider": "anthropic",
      "role": "reviewer",
      "session_fingerprint": "sha256:fda8e7de99ee2c1fed79750f470d63803a60856d5cb5b7c62647757e55d14659"
    }
  },
  "record_id": "review-0905b6c7c8f1d7f6f479e1ba143799d3",
  "recoveries": [],
  "residual_risk": ["human-authority-unavailable"],
  "review_id": "review-0905b6c7c8f1d7f6f479e1ba143799d3",
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
  "startup_commit": "cd745923c83e7b45d1a795ffcf4e87a193d4771a",
  "status": "accepted",
  "supplements": [],
  "turns": [
    {
      "artifact": {
        "blob": "1f3b495cdc97e23b2b50786f4ca42cdef1e95d6c",
        "digest": "sha256:8512daa8c456af00628a16471d4b13526c7585172c223c8bfa0f2323bee4fff6",
        "path": "docs/superpowers/specs/2026-10-12-voice-bff-reference-design.md"
      },
      "author_response": {
        "digest": "sha256:832bb34b64f610ce2aca441b18a2fc1e60603406e915eeb9d329b2464e632886",
        "path": "docs/peer-reviews/1/xpr/spec/2026-10-13-2026-10-12-voice-bff-reference-design-review-0905b6c7c8f1d7f6f479e1ba143799d3/review-0905b6c7c8f1d7f6f479e1ba143799d3-author-response-1.md"
      },
      "commit": "bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac",
      "decision": "revisions-requested",
      "finding_ids": [
        "R1-F001",
        "R1-F002",
        "R1-F003",
        "R1-F004",
        "R1-F005",
        "R1-F006",
        "R1-F007",
        "R1-F008"
      ],
      "reviewer_response": {
        "digest": "sha256:1a7e79b93bf00005fb0e38be526e6020e671e273b1bd008bda2402c17ab95d3f",
        "path": "docs/peer-reviews/1/xpr/spec/2026-10-13-2026-10-12-voice-bff-reference-design-review-0905b6c7c8f1d7f6f479e1ba143799d3/review-0905b6c7c8f1d7f6f479e1ba143799d3-reviewer-response-1.md"
      },
      "snapshot": null,
      "turn": 1
    },
    {
      "artifact": null,
      "author_response": null,
      "commit": null,
      "decision": "accepted",
      "finding_ids": ["R2-F001", "R2-F002", "R2-F003", "R2-F004"],
      "reviewer_response": {
        "digest": "sha256:13d5b37f377cb51f7433743a7bc9c525d5f1c728220e24532c27bcc0c4568799",
        "path": "docs/peer-reviews/1/xpr/spec/2026-10-13-2026-10-12-voice-bff-reference-design-review-0905b6c7c8f1d7f6f479e1ba143799d3/review-0905b6c7c8f1d7f6f479e1ba143799d3-reviewer-response-2.md"
      },
      "snapshot": null,
      "turn": 2
    }
  ]
}
```
