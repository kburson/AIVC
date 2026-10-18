# Story 40 plan XPR — reviewer response 2

> Formatting view only. [Exact original Git blob](https://github.com/kburson/AIVC/blob/80efe1a150dbd8605aab69678c2a7a87f8553072/docs/peer-reviews/plan/stateless-service-migration-review-40-native/xpr/posix-763538f/2026-10-17-2026-10-16-40-stateless-service-migration-review-3f99142a6b19c9dcbe0e6e53c7b1354a-reviewer-response-2.md) · [Lossless original file](../../../../../quality-evidence/40-review-originals/plan-xpr-reviewer-response-2.txt).
> Original SHA-256: `e2b0046e9d38ead19e2bc10b4511bc151ea6298d529c4c69f81b13b20000154a`. Acceptance and sealed hashes bind the original bytes; this view changes presentation only.

## Original protocol metadata

```text
<!-- ai-peer-review-template version="1" digest="sha256:78e9a634af9d540baaf6790db82952eaf39cf7ab59a6cdc7938319ae07a4cbed" -->

<!-- protected-frontmatter -->

---
schema: "ai-peer-review.response/v1"
review_id: "review-3f99142a6b19c9dcbe0e6e53c7b1354a"
role: "reviewer"
turn: 2
commit_mode: "no-commit"
authority_assurance: "unavailable"
artifact_path: "docs/superpowers/plans/2026-10-16-40-stateless-service-migration.md"
artifact_commit: "e6f70cbb52fa5b5651cd3c3817f3e7104deb2a14"
artifact_blob: "b0ae6d454c6ff109a403067594ab89af0924f680"
artifact_digest: "sha256:eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350"
agent:
  host: "claude-code"
  provider: "anthropic"
  model_id: "claude-opus-5-5"
  model_display: "claude-opus-5-5"
  session_fingerprint: "sha256:36fa55b446e522f55e4fc3f6d284dd591a436eb4e96b1bdf4772d693e907b3d3"
  identity_source: "runtime"
started_at: "2026-10-17T09:13:18.696Z"
submitted_at: "2026-10-17T09:41:36.058Z"
finding_ids: ["R2-F001","R2-F002","R2-F003"]
answered_finding_ids: []
acknowledged_supplement_ids: []
---
```

> **LOCAL JOURNAL MODE** — authority assurance: `unavailable`

## Summary

I re-read the whole revised plan (artifact blob `b0ae6d45…`, workspace copy `artifacts/turn-1.md`) against author-response-1. I checked each disposition against the revised text itself, not against the author's summary.

I also re-checked the arithmetic:

- Vitest inventory: 3×60 + 30 + 60 + 30 + 30 + 60 + 20 + 30 + 45 + 30 + 20 + 30 + 45 = 610 s, which is ≤ 624 (80% of 780).
- Playwright inventory: 60 + 60 + 20 + 20 = 160 s, which is ≤ 192 (80% of 240).
- Global budget: 600 + 90 + 780 + 240 + 30 = 1,740 s, plus a 60 s reserve = 1,800 s.
- Wrapper: 10 s Docker probe + 1,800 s subprocess + 30 s fallback teardown = 1,840 s, which is ≤ the 1,860 s `node:test` timeout.

Disposition verification:

- **R1-F001 (resolved).** Line 575 now separates the two objects. Exactly one lifecycle registration is created before auth. At most one pipeline permit is acquired only after bearer/Host and interface-policy checks pass. This matches the route pseudocode (lines 397–399) and spec §6. Task 2 Step 1 (line 134) adds more than four concurrent never-finishing unauthenticated uploads, then policy-mismatched ones, and requires zero permits held while valid requests of each kind are still admitted. The snippet asserts `heldTurnPipelines`/`heldSpeechPipelines` = 0.
- **R1-F002 (resolved).** The early-refusal transport contract (lines 443–451) covers 401, policy 503, capacity 429 and drain 503. Each gets:
  - a bounded JSON envelope with `Connection: close`;
  - an end after flush, and a forced destroy within 1,000 ms whether or not the upload has reached EOF;
  - no application drain of the rejected body.

  Kernel-buffered bytes are measured separately rather than denied. On the BFF side, an owned Node HTTP/HTTPS duplex client removes the dependency on undici half-duplex ordering, and destructive browser-upload cancellation waits until the error response has flushed. The router and ingress follow the same rule (nginx lingering 1 s / 1 s). Task 5 repeats the refusals hop by hop, and the outcomes for healthy versus stalled readers are explicit. Task 3 Step 4's parity test now has one defined expected outcome.

- **R1-F003 (resolved).** The host generates `AIVC_INSTANCE_ID` and a run label for each new core container. Host inspect verifies a bijection between instance UUID, container ID and private address against the core boot event, before tests and after every acknowledged replace or scale. Router enums and fixture markers both resolve through that manifest. Lease and pipeline observations come from sanitized structured stdout events. They are emitted only in explicit mock-script mode and carry a per-process monotonic sequence. Capture is bounded, and gaps or overflow invalidate the run. No application route is added. A SIGKILL leaves unreleased work unknown, and absent events never imply release. This is a sanctioned channel that can be falsified.
- **R1-F004 (resolved).** Task 2 Step 5 (line 180) now includes `provider-sdk-migration.test.ts`, plus `config` and `admission`.
- **R1-F005 (resolved).** Line 473 defines router eligibility as bounded direct probes plus acknowledged membership updates, neither of which consumes the script. The outcomes are:
  - a known draining, ineligible or removed target gives a retryable 503 with no substitution;
  - a drain-503 from core is relayed unchanged;
  - no eligible core gives 503;
  - an unexpected connection failure of a still-declared target gives 502;
  - a contradictory script invalidates the scenario.

  This reconciles spec §8 ("router excludes draining cores") with its no-substitution rule.

- **R1-F006 (resolved).** `tests/fixtures/migration-scenarios.json` is a closed inventory with maximum durations for each case. Preflight rejects missing, duplicate, extra or skipped cases and any sum above 80% of a phase budget. The Vitest phase and the global bounds are explicitly revised, and the arithmetic holds. The maxima are labeled as enforced limits, not measurements.
- **R1-F007 (resolved).** `createRuntime` is declared new (line 132). The production runtime, lease pools and new pipeline pools stay process-global and memoized. In-process tests may inject a complete `ResourceContext`, and that is explicitly not a production multi-pool claim. `config`, `leases` and `admission` tests are retargeted with shared-contention and isolated-context cases. Only mock-script mode builds request-scoped deps, passing parent/replica context as arguments and never storing it on cached adapters. Tests with interleaved parents across several rounds cover leakage.
- **R1-F008, R1-F009, R1-F010 (incorporated).** The entry point now uses `process.execPath` with `timeout`/`killSignal`, handles signal and `null` status, and runs an owned fallback cleanup behind an import-main guard. The transitive walker is moved and re-rooted, and an empty closure fails. Task 2 Step 3 converts the eager `runTurn` producer to demand-driven iteration.

The revisions introduce no new blocking contradiction with the accepted spec. The no-store boundary, the approval boundary, the 64-hour preliminary estimate and the "no execution claimed" statements are unchanged. Three small consistency refinements remain; they are listed below as optional.

## Findings

None.

## Required changes

None.

## Optional suggestions

### R2-F001 — Bring the command-graph diagram into line with the direct-Node wrapper

The diagram at lines 487–495 still shows `node --test …` → `npm run test:migration:containers` → `node scripts/test-migration-containers.mjs`. The revised wrapper (lines 271–280) and line 291 instead invoke `process.execPath scripts/test-migration-containers.mjs` directly, specifically "so npm/shell dispatch cannot outlive timeout". Task 4's runner tests assert the exact argv, so the diagram should drop the npm hop. Optionally, also pass an explicit `cwd` (the repository root) to `spawnSync`, because the script path is relative.

### R2-F002 — State which credential, if any, the router's readiness probes use

Line 473 calls the router's eligibility checks "direct authenticated readiness probes". Spec §5 lists `/health` and `/ready` as local operational endpoints. If those probes reuse web's core caller bearer token, the test router comes to hold the application credential, which it otherwise never needs, since it only relays web's `Authorization`. Say whether `/ready` is probed without credentials or with a separate, run-generated, non-application probe credential.

### R2-F003 — Say whether the per-case maxima are enforced as timeouts, and recheck two tight cases

The inventory sums are enforced at preflight. The plan does not say whether each case's maximum is also its runtime timeout; only "individual cases are at most 60 seconds" is stated. If the maxima are enforced as timeouts, two 30-second cases look tight:

- "Web graceful termination while forwarding": 15 s drain + 5 s settle, plus a host action and the web replacement's readiness so later cases have a web.
- "Early upload refusal across all hops": the drain-503 leg needs a draining core, plus its replacement and readiness.

The 170 s margin can absorb larger maxima for these cases. Alternatively, state that replacement time is accounted for in another case.

## Decision

accepted
