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
- Workspace typecheck and production build passed. Chromium browser checks passed 18/18.
- ESLint and Markdownlint passed. Documentation source links/setup checks passed.
- Sealed archive verifier passed for 122 historical documents. Independently verified both #40 accepted source hashes and all 11 lossless review originals/current views against pinned Git publications.
- Full Prettier gate is blocked by three preserved pre-existing protected artifacts: the accepted #40 design specification and the accepted spec/plan XPR manifests. All three retain their historical bytes. This checkpoint does not introduce exemptions, rewrite evidence, claim a green full format gate or stamp completed application ACs.

## Baseline failures and decisions

The original full unit baseline had 224 passes and seven real-history fixture timeout failures. Exact assertions and historical fixtures remain intact. The affected suite's finite default test bound and two actual preparation-hook bounds are now 30 seconds, replacing 5/10-second defaults after legitimate fixture work reached 24 seconds. All seven failed cases passed the targeted rerun. This changes no production deadline or evidence assertion; its cost if wrong is up to 30 seconds waiting for a hung fixture.

An early post-edit unit run was stopped after current documentation links and one admission paragraph produced known verifier failures; those ordinary documentation defects were corrected. The following full run was also stopped after two quality-scanner cases exceeded their 15-second bounds under concurrent verification, while the long real-history group was still running. No aborted run is reported as passing and no full-unit total is inferred. The unchanged format/quality suites passed 29/29 on their focused rerun after ordinary presentation defects were corrected. The separate full Prettier gate still reports the three preserved protected-format findings above. A serial full `npm test` remains required before application completion.

The absent nested retrieval dependency initially resolved AJV 6 rather than its pinned AJV 8. Restoring its ignored installed dependencies made all 355 original contract tests pass. Installed dependencies were then copied into this isolated worktree before linking the new workspace, preserving the runtime override and leaving the primary checkout unchanged. Lockfile changes only register the new local workspace/dependency; no existing dependency versions changed.

## Preserved acceptance and review references

See the [admission record](2026-10-17-63-contracts-admission.md), [complete lineage](../superpowers/plans/2026-10-17-40-stateless-service-migration-decomposition.md#preserved-artifact-and-review-lineage) and [lossless originals manifest](2026-10-17-40-review-originals.json). The accepted specification remains SHA-256 `f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`, XPR `review-0009efb5ca6886291ad48628afa78120`; the accepted plan remains SHA-256 `eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`, XPR `review-3f99142a6b19c9dcbe0e6e53c7b1354a`. LOCAL JOURNAL MODE/accepted-uncommitted provenance and separate Git publication remain explicit. No acceptance is transferred to implementation or decomposition collateral.

## Fresh source review and final checkpoint

A fresh read-only native reviewer, requested model `gpt-6-astra`, inspected the complete implementation range `9cd5981f5c283ad5bab1bc3b5026fd98d78afd18..50b28194f96f264079f0932b9efe3ed124e258ec` and found no Critical, Important or substantiated Minor code defects. Its [presentation](../peer-reviews/code/63-contracts-review-round-1.md) links the unchanged raw report and records every scope limit. The reviewer did not independently run suites, provide sealed acceptance or approve lifecycle progression. Root observed checks and reviewer source judgment remain separately attributed.

Story #63 remains Develop with application ACs unchecked, no completion claim and no Test/Review/merge/Close. Live boards confirm #64–#68 remain Ready for Planning; native blockers remain #63→#64→#65→#66→#67→#68. Their JIT Plan and implementation gates wait for predecessor governed Done. No downstream application work started.

The native activity guard refused writing a JSON operation file for a Plan Metadata prose refresh; the path guard also refused stdin input. Neither guard was relaxed and no unsanctioned body update was used. Existing human Plan approval/Develop markers, published PR and the canonical owned implementation checkpoint comment record the current state; every original Plan Metadata review URL and source pin remains intact. A supported operation-input path is still needed for that prose refresh.

## Owner-authorized blocker repair

The owner resumed #63 and authorized resolving the formatting and metadata input blockers while retaining accepted bytes, hashes and review references. The prior checkpoint's blocker descriptions above remain historical; the repairs below supersede their current status.

The formatter now treats exactly the accepted #40 design specification and its spec/plan XPR manifests as immutable integrity exclusions, using the repository's established preservation model. Before inventory traversal and exclusion it verifies regular non-executable files and parents, exact byte length/SHA-256, original publication ancestry and bytes, and the exact stage-0 Git index blob. Missing files, changed bytes, executable modes, file/parent aliases, replaced storage and index drift refuse. Copied lookalikes and unrelated malformed source still fail formatting. The three files are reported as integrity-verified evidence, never as Prettier passes. Existing two #11 integrity exclusions remain unchanged. Generated `test-results` and `playwright-report` are excluded from authored scans; their contents are test output rather than accepted evidence.

The project activity policy adds only `.scratch/gh/63-current-plan-metadata.json` to its existing exact operation-input allowlist. Other scratch JSON and states that forbid code/config writes remain refused. No installed runtime, broad glob, state matrix, issue writer or lifecycle guard changed. The canonical fresh-base `issue-body` writer updated #63 Plan Metadata to version 24; all original URLs and source pins were retained. A stale section newline precondition was corrected through a fresh read; no invariant was bypassed.

The test dispatcher now forwards explicit Vitest options from `npm test -- ...`; previously they were silently dropped. A real two-directory fixture, requiring exclusive execution, failed with overlapping work before the change and passed with single-worker serial options afterward. This permits the requested full serial run without changing default suite selection or hiding tests. An initial fixture invocation used the CLI's project-root default and timed out; it was corrected to use the runner's supported fixture root, and no child process remained.

Observed RED→GREEN: blocker policy/integrity cases failed before repair, then the three relevant suites passed 25/25; serial runner passed 6/6. Typecheck, ESLint/Markdownlint, full format check (429 files, zero findings), documentation checks and the 122-document sealed archive check passed after the repairs. The authoritative full unit suite with explicit serial options remains to be run at this checkpoint. #63 stays Develop; #64–#68 retain their native predecessor blockers until governed Done.

## Completed serial unit verification

At repair source `568d2631e43260b32c7dce262a6138d9122458a8`, ran:

```sh
npm test -- --no-file-parallelism --maxWorkers=1 --reporter=verbose
```

The dispatcher forwarded these exact options to the complete unit groups `tests/ui` and `tests/scripts`. No test-name, path subset, skip, retry or update option was supplied. No other verification/build ran alongside it, and the source/index remained frozen throughout the run. The command completed with exit code 0: **14 files passed, 244 tests passed**, no failed or skipped tests. Vitest reported **993.30 seconds** total (990.68 seconds test time). This complete serial run supersedes the prior aborted/timeout runs, without relabeling their historical outcomes. The raw output remains in this plan's ignored execution workspace as `unit-serial-2026-10-17.log`; this record is an ordinary observed result, not an AITM Test receipt or a provider delivery envelope.

A fresh [repair source review](../peer-reviews/code/63-blocker-repair-review-round-1.md) inspected `2da3ec5..568d263`, finding no Critical, Important or Minor defects. Its verbatim raw report is preserved separately; the reviewer performed source inspection only and did not independently execute the unit suite. The current serial result was still pending when that review returned; this author-owned result completes the requested verification.

Both requested blockers are resolved: the formatter passes with exact immutable integrity verification, and the canonical metadata writer accepts its narrowly allowlisted input. Accepted source bytes, original evidence hashes and review references remain preserved. #63 remains Develop; no application AC signoff, Test/Review/approval/merge/Close or downstream implementation is implied by these repairs or the passing suite. #64–#68 retain their predecessor dependencies until governed Done permits their next admission.
