# Story 71 independent implementation review

## Review identity and limits

Reviewer: fresh-context Codex subagent `/root/runtime_extraction_review`,
`gpt-6-astra`, high reasoning. Read-only whole-branch review of
`a95ce4f5597c29d7fc11250f2149c6314cf1d3fe` through
`eed804dad6efc81477edb92bfcaf3f24ecf1c41e`. The reviewer received the selected
#64 Task 1, accepted #40 specification/plan, review focus, execution rulings and
actual verifier results. It neither authored code nor dispatched reviewers.
This is implementation review, not renewed sealed SAR/XPR artifact acceptance.

Verdict: no Critical, Important or Minor findings in #71's bounded scope.
Implementation review passes; full serial unit verification and native
lifecycle/delivery gates were still pending at review time. Supplied passing
suite results were not independently rerun by the reviewer.

## Reviewer observations

- Normalized source comparison found unchanged provider, deadline, lease,
  capability and validation algorithms apart from necessary import changes.
- All twelve legacy modules are single-line compatibility exports. Core has no
  reverse web imports.
- Runtime and pool globals retain identity. Complete contexts support shared
  contention and isolation, including occupied default pools across reloads.
- Lookup keeps fixed `/v1/projects`, encoded caller text, schema/deadline checks
  and redirect refusal. Two real local servers prove selection and no redirected
  request.
- Workspace build and cleanup include core without upgrading dependencies.
- Both accepted artifact hashes and unchanged bytes were independently verified.

## Executor rulings on the reviewer's declined scope

Each item preserves the remaining obligation; none is waived or claimed complete.

1. Pre-body authentication, policy refusal and endless-upload status belong to
   #72 and later HTTP work. No new HTTP admission is delivered here. Cost if
   wrong: unauthenticated ingestion or incorrect refusal status in a future hop.
2. Completed-upload versus response-disconnect handling belongs to the later
   transport slice. Current handling is unchanged. Cost if wrong: leaked work or
   premature cancellation when that transport is delivered.
3. Pull-driven streaming, original allocation bounds and pending-reader cleanup
   belong to the streaming slices. Extraction does not prove them. Cost if wrong:
   unbounded buffering or early resource release in a later delivery.
4. Actual SDK protocol settlement fixtures remain a dedicated SDK slice. Existing
   provider algorithms were compared for relocation equivalence. Cost if wrong:
   SDK cancellation/settlement defects surviving until that gate.
5. Shutdown bounds, container attribution, replica behavior and no-replay evidence
   remain lifecycle/packaging/acceptance obligations. Cost if wrong: premature
   deployment claims or unsafe shutdown/replay behavior. Deployment stays gated.
6. Web provider dependency and compatibility-export removal follows web
   delegation. Removing them now would break existing routes. Cost if wrong:
   retaining legacy ownership past its assigned removal gate.
7. The Next metadata convention is temporary legacy compatibility. It creates no
   reverse import and is not a standalone-core claim. Cost if wrong: incorrect
   metadata in the future core entry until the later ownership split is proven.
8. Live-provider correctness/availability is outside this authorization. No paid
   call is needed for relocation proof. Cost if wrong: live integration remains
   unverified; no live acceptance is asserted.
9. Lifecycle approval, merge reachability and timing are governed separately from
   code review. Unknown stays Unknown. Cost if wrong: false Done or fabricated
   effort; native Test/Review/delivery/Close remain mandatory.

## Earlier execution rulings retained

The complete rationale and risks for replacing blanket loopback rejection and
using pinned Next webpack compatibility are in
[the extraction checkpoint](2026-10-18-71-runtime-extraction.md). Neither changes
accepted source bytes or transfers acceptance to later stories. No minor finding
was deferred.
