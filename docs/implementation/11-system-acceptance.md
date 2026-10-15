# Story #11 joined system and live acceptance status

Whole-story acceptance remains unverified. This checkpoint supplies the joined
system, documentation, read-only verifiers and measurement implementation for
independent review. Required actual provider/browser/device L1–L8 observations
remain pending; no controlled run is a substitute.

## Actual application boundary

The [joined browser suite](../../tests/browser/typed-system.spec.ts) runs the actual
Next Route Handlers and Fastify catalog using a [test-owned launcher](../../tests/browser/system-server.ts).
It never routes, replaces or intercepts `/api/turn`. Test-owned Fastify controls
hold or fail the real catalog HTTP request. Passive CDP request observation checks
actual multipart history, and the canonical SSE decoder verifies final text.
The suite proves early text during held retrieval, exact cards, final/history
agreement, visible unavailable-search state, no-fallback retrieval failure and
Busy recovery by a deliberate new action.

This exposed a real Node26/Next request-branding error in `new Request(req, ...)`.
The admitted request now enters the existing bounded reader directly; its combined
cancellation signal is passed separately to the existing deadline runner. All
Origin/Host checks still precede body/provider work; frozen contracts and pins are
unchanged. The initial actual browser failure and corrected pass were observed.

The expanded Ubuntu CI lane exposed production shutdown with npm wrappers exiting
before their server descendants released ports. An owned-only local ancestry
trace confirmed the wrapper topology. Production now directly launches the pinned
Next CLI and compiled Fastify entry. Its owned trace contains the two actual server
processes and confirms both ports close. No process-group/global kill, unowned
process cleanup or dependency change was introduced. Ubuntu CI confirmed this fix at source `7294c3e`: all six checks passed,
including Offline system acceptance in [run38660164354](https://github.com/kburson/AIVC/actions/runs/38660164354/job/116179276814),
completed2026-10-15T00:30:16Z. The earlier component368273f run failed shutdown
truthfully and remains distinct from this passing result.

## Offline verification observed

- Unit/UI:97 tests; contracts:324; integration:26; voice:138; slow:27.
- Browser:15 tests, including three actual joined-system cases. Existing controlled
  voice/browser cases retain their explicit synthetic boundaries.
- Separate archived-evidence protection lane:10 node:test cases.
- Clean production build, TypeScript checks, ESLint, Markdown lint, complete
  formatting inventory and `verify:docs` passed locally.
- Focused measurements/capture/interruption/playback/queue/controller:81 tests.
  Measurement helper privacy/retention behavior was observed red before passing.
- Read-only live report remains deliberately nonpassing until actual evidence is
  complete. Model metadata alone establishes no generated voice/search success.

The new [browser marks](../../apps/web/client/measurements.ts) are bounded and
sanitized. The [procedure and all15-case mapping](../live-validation.md) explain
same-clock correlation, VAD-frame estimates, network-inclusive spans, scheduled
versus acoustic output, and local versus remote cancellation.

## Preliminary independent component review

The genuine distinct Astra6/high reviewer inspected committed component
`368273fdbf7568060d658f64cab1ff1d0c1c7f46` against feature baseline
`31948e8d40ce11bf36a1ca74cc4363a9643f7757`. The
[unaltered response](../evidence/11-astra-component-review.txt) has SHA256
`36e29430fdccb5efb7109f9f24c086d36c2bb60f0476aa81e3d0e008974061e4`,
1858 UTF-8 bytes, native message
`msg_03981de7adb10efe016ad01b7abf7081949f211e52a6cefd94`, reviewer SID
`01a13c7c-c4a4-7760-8b80-278687d46e54`. It is a static preliminary review, with
no independent test run or whole-story verdict.

Its two P2 findings were reproduced with four failing regressions. The corrected
verifier normalizes scenario/sample identity, requires measured research speech-
end→text/audio totals while allowing explicitly unavailable optional boundaries,
and rejects provider-named credential properties/literal assignments. All46
focused live/docs verifier tests pass, including those four regressions. Empty
sanitized environment examples, variable names and ordinary digest hex remain
valid. Final whole-head review and actual live evidence are still required.

An actual installed-package check then exposed three additional verifier gaps.
The npm distribution does not carry gitHead in its installed package.json, root
AJV differs from retrieval's resolved direct AJV, and a marker plus recomputed
report hash could accept altered installed code. Three regressions were observed
failing before passing. Versions are now recorded per actual root/workspace
resolution; accepted upstream provenance uses lock integrity, and both installed
VAD JS/declaration bytes must match the unchanged patch's full Git postimages.
No gitHead field was invented and no package/patch/manifest pin changed.

## Whole offline review corrections

Independent review at7294c3e passed612 tests/49 files,15 browser cases,10 separate
archive cases, clean build/typecheck/docs/lint/format and additional actual
production SSE/admission/shutdown probes. Its offline specification verdict
requested three corrections: retain the accepted flat `packages:Record<string,string>`
interface using context-qualified keys; preserve exactly two arguments to
VadCallbacks.end and keep timing in adapter-local marks; and use the accepted
`tests/browser/typed-system.spec.ts` path. The focused callback and flat-map
regressions were observed failing before correction. No live acceptance verdict
is claimed by the offline checks. Same-seat correction review remains pending.

The [unchanged native whole-offline response](../evidence/11-astra-offline-review-7294.txt)
has4483 UTF-8 bytes, SHA256
`50153e5127a7ddfbff7eedb44b08d17e4ec01331614918acc1019cb13cd1d89e`,
native message `msg_03981de7adb10efe016ad01f36fe848194b1751b92e57bf5aa`
from the same genuine reviewer SID above. Its specification FAIL/quality changes
requested is preserved; independent offline passes do not replace the requested
compatibility corrections or actual provider/device evidence.
