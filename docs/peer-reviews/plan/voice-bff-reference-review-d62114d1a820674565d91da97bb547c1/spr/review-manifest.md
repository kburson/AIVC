> **Formatting view; original evidence preserved.**
> The [historical original](https://github.com/kburson/AIVC/blob/0d1a9d1c352933bcd18922a2a0fc7a06dd60fd3c/docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/review-manifest.md) and its exact bytes remain available in the [evidence archive](../../../../quality-evidence/2026-10-13-25-originals.json).
> Original SHA-256: `0d363c260aa938a0d160d331fcfe91a5117d234b8f3451960bc3fa0de62e91cd`. Review acceptance and protocol hashes apply to those original bytes.

<!-- ai-peer-review-template version="1" digest="sha256:e53bf4d9991ae94a699fede1d62fd90324e45923de951babcb8d9ad237900bd9" -->

# Review manifest

Mode: `normal`

```json
{
  "acceptance_basis": "reviewer-consensus",
  "artifact_history": [
    {
      "blob": "e2b2bf28e5287e4416e676409002d7745c1f48f6",
      "commit": "f0a4971adf76da1db1b4d4efd626faf4842089a3",
      "digest": "sha256:810b1f1a18964fa185fe2e92b358cab9d2a259d5b43fbbc56ab03577c91483f1",
      "path": "docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md",
      "snapshot": null,
      "turn": 0
    },
    {
      "blob": "5e0d124a0cbef5b811604f408dbe72600315a889",
      "commit": "859174f5c5db919072807bba2ef017f5a7755cd1",
      "digest": "sha256:db3c6df40ac34588bbb73e321dfa58610a13ef08cc03edf9fa66dd4f3c23b300",
      "path": "docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md",
      "snapshot": null,
      "turn": 1
    },
    {
      "blob": "8f2f3f3551512ba83c90ef94c7ab34114413dbef",
      "commit": "0118b29685cf8998235885d2d172da27673ed67f",
      "digest": "sha256:555fdbbcf7ecc3234087733cc694bb7bbf5952d773739258c2b285a0bd69e3de",
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
      "claim_id": "claim-2a9606b2-0507-43f0-a309-231523fdd716",
      "claimed_at": "2026-10-13T05:22:27.905Z",
      "expires_at": "2026-10-13T13:22:27.905Z",
      "host": "codex",
      "last_activity_at": "2026-10-13T05:22:27.905Z",
      "role": "reviewer",
      "session_fingerprint": "sha256:26905761b314a738f4c13fa256f8a1bdc358ab76086141b9761e701741329250"
    },
    {
      "claim_id": "claim-b6029519-414e-485d-afa9-8a493e2e40f9",
      "claimed_at": "2026-10-13T05:27:47.521Z",
      "expires_at": "2026-10-13T13:27:47.521Z",
      "host": "codex",
      "last_activity_at": "2026-10-13T05:27:47.521Z",
      "role": "author",
      "session_fingerprint": "sha256:48daf6ba8b2a5f061e5b9a3cf267a2f0de1f0f3a80cf29b2774ae19f87408a30"
    }
  ],
  "commit_mode": "normal",
  "final_commit": "0118b29685cf8998235885d2d172da27673ed67f",
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
        "joined_at": "2026-10-13T05:21:22.349Z",
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
        "event_log_digest": "sha256:e91664e497c82e05f3f797d202a7880d263284583c803a523cb8c6cc11c5a5fa",
        "predecessor_review_id": null,
        "reciprocal_receipt_digest": null,
        "record_id": "review-d62114d1a820674565d91da97bb547c1",
        "recovery_claim_digest": null,
        "recovery_id": null,
        "recovery_ordinal": 0,
        "review_id": "review-d62114d1a820674565d91da97bb547c1",
        "root_review_id": "review-d62114d1a820674565d91da97bb547c1",
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
      "joined_at": "2026-10-13T05:21:22.349Z",
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
          "declared_id": null,
          "observed_id": null,
          "requested_id": "gpt-6-astra",
          "source": "launch-request"
        },
        "session": {
          "assurance": "declared",
          "fingerprint": "sha256:26905761b314a738f4c13fa256f8a1bdc358ab76086141b9761e701741329250",
          "source": "environment-declaration"
        }
      },
      "host": "codex",
      "identity_source": "declared",
      "joined_at": "2026-10-13T05:22:27.904Z",
      "model_display": "gpt-6-astra",
      "model_id": "gpt-6-astra",
      "provider": "openai",
      "role": "reviewer",
      "session_fingerprint": "sha256:26905761b314a738f4c13fa256f8a1bdc358ab76086141b9761e701741329250"
    }
  },
  "record_id": "review-d62114d1a820674565d91da97bb547c1",
  "recoveries": [],
  "residual_risk": ["human-authority-unavailable"],
  "review_id": "review-d62114d1a820674565d91da97bb547c1",
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
  "startup_commit": "f0a4971adf76da1db1b4d4efd626faf4842089a3",
  "status": "accepted",
  "supplements": [],
  "turns": [
    {
      "artifact": {
        "blob": "5e0d124a0cbef5b811604f408dbe72600315a889",
        "digest": "sha256:db3c6df40ac34588bbb73e321dfa58610a13ef08cc03edf9fa66dd4f3c23b300",
        "path": "docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md"
      },
      "author_response": {
        "digest": "sha256:ea32971b0334ef1e04daa3d8c4d5c7c71b3694903ce6272c0577dcc9853b0f40",
        "path": "docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/author-response-1.md"
      },
      "commit": "859174f5c5db919072807bba2ef017f5a7755cd1",
      "decision": "revisions-requested",
      "finding_ids": ["R1-F001", "R1-F002", "R1-F003"],
      "reviewer_response": {
        "digest": "sha256:fa7e356e7ceac50871365e9c07b6b4d6d428bc06043a07afe6988221d82c5957",
        "path": "docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/reviewer-response-1.md"
      },
      "snapshot": null,
      "turn": 1
    },
    {
      "artifact": {
        "blob": "8f2f3f3551512ba83c90ef94c7ab34114413dbef",
        "digest": "sha256:555fdbbcf7ecc3234087733cc694bb7bbf5952d773739258c2b285a0bd69e3de",
        "path": "docs/superpowers/plans/2026-10-12-2-voice-bff-reference.md"
      },
      "author_response": {
        "digest": "sha256:5c8c5693c9f402b73a69142990063c6e6598aa056f0ea48cb532ad7ac74d41bf",
        "path": "docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/author-response-2.md"
      },
      "commit": "0118b29685cf8998235885d2d172da27673ed67f",
      "decision": "revisions-requested",
      "finding_ids": ["R2-F001", "R2-F002"],
      "reviewer_response": {
        "digest": "sha256:c55bd9e74f4300b4d586f338f6b78bd31e1328df9eafc8e56a2a3ee6ea19b809",
        "path": "docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/reviewer-response-2.md"
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
        "digest": "sha256:9cd7200d4cdda9a9bd4c56326f73c5d8c02a426fca22d654319d599ccbc640c5",
        "path": "docs/peer-reviews/plan/voice-bff-reference-review-d62114d1a820674565d91da97bb547c1/spr/reviewer-response-3.md"
      },
      "snapshot": null,
      "turn": 3
    }
  ]
}
```
