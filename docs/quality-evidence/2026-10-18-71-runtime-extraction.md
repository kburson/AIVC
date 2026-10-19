# Story 71 runtime extraction

## Authority and scope

This record covers only #71 under #64/#40. Runtime/configuration, providers,
lookup tools, deadlines and paid leases now have one TypeScript implementation
in `apps/orchestrator/src`. Existing web modules export those implementations.
HTTP admission and lifecycle work remain assigned to #72 and later stories.

The accepted design remains commit
`e6e96c9a4f07bb78faa73dc56368a0503d912982`, SHA-256
`f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`,
XPR `review-0009efb5ca6886291ad48628afa78120`. The accepted plan remains
`80efe1a150dbd8605aab69678c2a7a87f8553072`, SHA-256
`eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`,
XPR `review-3f99142a6b19c9dcbe0e6e53c7b1354a`. LOCAL JOURNAL MODE,
accepted-uncommitted and unavailable assurance stay distinct from Git publication.
Earlier `review-2bdf5dd8ee56accc6e494643054a3cf1` remains unsettled.
No sealed source, historical original or review reference was edited.

## Ownership and behavior

`getRuntime()` and `getLeasePools()` retain their existing process-global keys.
Default pipeline pools have their own process-global key and share the existing
two-per-kind, immediate-refusal, idempotent-release pool implementation. Factories
share both defaults unless supplied a complete
`ResourceContext = {leasePools, pipelines}`. Partial contexts refuse. Sharing an
explicit context contends; separate complete contexts isolate. Adapter caches
remain per runtime, with existing explicit injection available. Lazy build
metadata uses the factory's captured environment, preserving legacy direct-reader
defaults.

Lookup accepts a canonical configured private origin and always selects
`/v1/projects`. Caller text is encoded as the name query; redirects are refused.
Two real local HTTP servers prove configured-origin selection and zero redirected
requests. Private DNS constructor tests make no network calls.

## Decisions and regression evidence

- Runtime/resource tests genuinely failed before implementation: missing pipeline
  resources and factory. The expanded selected suite passed after extraction.
- Factory metadata genuinely failed when supplied production configuration was
  mixed with ambient development state. Capturing the build mode fixes that
  inconsistency; configuration/build-info tests passed 44/44.
- Output cleanup genuinely failed to remove orchestrator output; it now removes
  that output while preserving unrelated files and the child build status.
- The legacy blanket non-loopback rejection assertion was replaced with
  noncanonical-origin rejection because the accepted plan explicitly changes
  that policy. Query encoding assertions and new redirect/URL negatives remain.
  Cost if wrong: admitting an operator-selected origin too broadly.
- The first production build failed because Turbopack did not resolve the required
  explicit `.js` ESM specifiers to TypeScript. Temporary web compatibility now
  uses pinned Next's webpack mode and extension aliases, with unchanged versions.
  The existing Next compatibility fixture already uses webpack. The browser
  system launcher uses the same mode. Cost if wrong: temporary bundler behavior
  differs; production build and existing real-route tests must pass.
- Root Vitest defaults to serial files so native Test's standard lane commands
  preserve the requested serial verification. No test or assertion is skipped.

## Verification checkpoint

- Contract/integration/voice/slow plus cleanup: 43 files, 661 tests passed, serial.
- Typecheck: all four workspaces passed.
- Production build: contracts, orchestrator, web and retrieval passed.
- ESLint/Markdownlint: passed, zero Markdown findings.
- Format check: passed, 466 files, zero findings at this checkpoint.
- Original accepted spec/plan hashes: exact matches.

The first all-Vitest run was deliberately interrupted (exit 130) during the
resolver/environment investigation and is not a pass. A complete serial unit run,
browser acceptance, independent implementation review and native lifecycle gates
were still pending when this checkpoint was authored. Final receipts and counts
must be recorded separately, without rewriting these historical observations.

## Timing and dependency boundary

Native actual timing remains Unknown/null. No finite active total is inferred
from wall time, and no earlier pause event is backdated. The admitted estimate is
3.5 hours, with a strict limit below four hours including normal gates. #72–#99
remain gated until #71 reaches governed Done; none is authorized to start here.
