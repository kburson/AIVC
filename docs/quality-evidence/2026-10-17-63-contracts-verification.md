# Story #63 implementation checkpoint

This checkpoint implements accepted #40 migration Task 1 only. Story #63 is in Develop; #64–#68 remain dependency-gated. Application implementation approval came with the owner's #63–#68 decomposition approval and current registered refinement/Plan admission. Planning review acceptance does not substitute for code review, Test, merge or Done.

## Source and behavior

The actual four shared modules moved into `@aivc/contracts`; compiled ESM/declarations build before consumers and after fresh installation. Consumers use its public export. Boundary verification follows both JavaScript and declaration dependencies and refuses missing, empty or unsafe closure. Frozen wire assertions, multipart/history/PCM/SSE behavior and public signatures remain.

Strict JSON adds exact text-turn representation, whole-body 2097152-byte limit, fatal UTF-8, decoded duplicate-key rejection at every object depth and structural depth 16. Canonical non-secret interface policy validates explicit fixed limits, safe positive deadlines/grace and a separately configured matching segment cap; hashing stays outside browser exports for later service configuration owners.

The closed source digest now frames seven public package source modules and the frozen wire fixture, with independent path/NUL/decimal-length/raw-byte tests. Current post-format digest: `sha256:e26fdebb3c49876178267988c44adb8a3f2bcdb70dfada8ce4f2a60b13afc564`. Historical five-file hashes and accepted source/review bytes are preserved.

## Pinned production compatibility

The test fixture builds Next 16.4.0/React 19.3.0 production output with the pinned compiler, then invokes actual `prepare`/`getRequestHandler` behind an owned Node listener. It uses neither development mode nor standalone output. A test-only AsyncLocalStorage request context reaches the real bundled route. Four finite 16384-byte chunks preserve literal byte order.

A paused real socket stopped an otherwise unbounded synchronous pull producer at 52 chunks in the recorded complete contracts run. Application queue maximum was 65536 bytes and chunk maximum 16384 bytes. The separately observed transport envelope was 851968 produced bytes, including application, Next/Node and kernel buffers; the test requires observable demand to plateau below 16 MiB and resume when read, rather than inferring pressure from a high-water mark. This is a measured local pinned-runtime envelope, not a universal OS socket-buffer guarantee. Read bytes retained sequence/content without drops. Disconnect propagated both route cancellation and request abort.

Drain withdrew readiness synchronously, stopped listener admission, closed the real idle keep-alive socket, refused fresh/reused connection attempts, and aborted active streaming after finite fixture grace. The final observation had zero sockets, active responses and owned handler/background tasks, with framework close and clean child exit. Test cleanup is idempotent after the close acknowledgement; a reproduced IPC teardown race was corrected before claiming this proof. The fixture's shortened grace tests ordering and settlement; later service owners must implement the accepted production 15-second/5-second lifecycle.

## Verification so far

- Contract suite: 441/441, including three genuine production Next/socket cases.
- Integration: 26/26; voice: 160/160; slow: 27/27.
- Workspace typecheck and production build passed; browser checks and final unit run remain pending at this checkpoint.
- ESLint and Markdownlint passed. Documentation source links/setup checks passed.
- Sealed archive verifier passed for 122 historical documents. Independently verified both #40 accepted source hashes and all 11 lossless review originals/current views against pinned Git publications.
- Full Prettier gate is blocked by three preserved pre-existing protected artifacts: the accepted #40 design specification and the accepted spec/plan XPR manifests. All three retain their historical bytes. This checkpoint does not introduce exemptions, rewrite evidence, claim a green full format gate or stamp completed application ACs.

## Baseline failures and decisions

The original full unit baseline had 224 passes and seven real-history fixture timeout failures. Exact assertions and historical fixtures remain intact. The affected suite's finite default test bound and two actual preparation-hook bounds are now 30 seconds, replacing 5/10-second defaults after legitimate fixture work reached 24 seconds. All seven failed cases passed the targeted rerun. This changes no production deadline or evidence assertion; its cost if wrong is up to 30 seconds waiting for a hung fixture.

An early post-edit unit run was stopped after current documentation links and one admission paragraph produced known verifier failures; those ordinary documentation defects were corrected. The following full run remains authoritative for final unit results; no aborted run is reported as passing. A format-check fixture also exposed the three preserved protected-format findings above. Final unit/code-review results will be appended before completion claims.

The absent nested retrieval dependency initially resolved AJV 6 rather than its pinned AJV 8. Restoring its ignored installed dependencies made all 355 original contract tests pass. Installed dependencies were then copied into this isolated worktree before linking the new workspace, preserving the runtime override and leaving the primary checkout unchanged. Lockfile changes only register the new local workspace/dependency; no existing dependency versions changed.

## Preserved acceptance and review references

See the [admission record](2026-10-17-63-contracts-admission.md), [complete lineage](../superpowers/plans/2026-10-17-40-stateless-service-migration-decomposition.md#preserved-artifact-and-review-lineage) and [lossless originals manifest](2026-10-17-40-review-originals.json). The accepted specification remains SHA-256 `f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`, XPR `review-0009efb5ca6886291ad48628afa78120`; the accepted plan remains SHA-256 `eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`, XPR `review-3f99142a6b19c9dcbe0e6e53c7b1354a`. LOCAL JOURNAL MODE/accepted-uncommitted provenance and separate Git publication remain explicit. No acceptance is transferred to implementation or decomposition collateral.
