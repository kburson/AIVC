# Epic #2 live-validation handoff

The owner requested a fresh chat at 2026-10-15T02:53:53.545Z because this conversation was too long. Continue delivery, with fresh genuine bindings and the recorded worktrees. Historical pause boundaries in `2-wave4-handoff.md` are superseded. Keep epic PR17 draft; no trunk merge or deployment. Use numbered choices. Preserve the primary checkout and concurrent owner work.

## Current delivery

All eleven implementation children except #11 are actually cloud-merged and Closed/Done: #3–#10, #13 and #14. Do not reopen them. Feature `codex/2-draft` contained #10 merge `31948e8d40ce11bf36a1ca74cc4363a9643f7757` before this documentation checkpoint. PR17 is open/draft. #25 was merged earlier; its owner’s legacy approval is deferred and it is not a core dependency. Do not reopen the paused AITM repair projects or create new framework work for evidence overhead.

Story #11 remains Develop, not CODE_COMPLETE/Test/Review/Done. Its draft [PR37](https://github.com/kburson/AIVC/pull/37) targets `codex/2-draft`, exact pushed head **`d98fcd99ffea8c2b8266a9fde7c34f664b88e7c8`**. All six CI checks passed, including offline system acceptance. Source digest: `ce046dc6beb32f54089dab109bf73f423a5425ba2d6a1112ce8e53e5b11e2c51`.

Recorded worktrees:

- Epic: `/Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC`, branch `codex/2-draft`.
- #11: `/Users/kpburson/.codex/worktrees/voice-bff-story-11/AIVC`, branch `codex/11-draft`.
- Primary: `/Users/kpburson/projects/AIVC`, trunk `9e400abad3e04fef3f3a3ad1d47db06ba903c833`, concurrent untracked `apps/` must be preserved. Its ignored `.env` contains the authorized API keys. Load keys only into server environment; never print/copy/commit them.

## Latest user-directed UI change — complete offline

The user explicitly requested newest conversation cards first, stationary controls at the top and a separate scrolling response pane filling the remaining view. Implemented at `0e06ef4`, then corrected at `d98fcd9` after independent review found short windows could collapse the pane to zero.

The display reverses a copy only: original Turn numbers and chronological four-pair model history remain. A new local turn resets only the response pane to its top once; later streamed deltas preserve deliberate reader scrolling. The upper controls region can shrink/scroll when necessary, while the lower pane retains 100px. Normal desktop controls remain stationary without needing their own scroll. Actual joined mock-browser checks cover newest visibility after reading older history, held-answer deltas, viewport growth, unchanged control bounds, 1280×720/390×700 and short 900×400/640×360/390×500 windows.

Same distinct native Astra6/high reviewer independently passed 42 UI/history/controller tests and six joined browser cases at exact `d98fcd9`, inspected the corrected screenshot and found no remaining scoped findings. Reviewer stopped normally and released all resources. The author is Sol6.1/high. These ordinary code reviews are not sealed APR/provider receipts. The exact native PASS is preserved in `docs/evidence/11-astra-ui-pass-d98.txt`: 2190 bytes, SHA256 `28098b2237d4200bdb208d71f8cabd59fd77dc42b5cfc3e741e1eea5ab5464e3`, message `msg_03981de7adb10efe016ad03fa52d28819480ce8b0d2939e7ae`, reviewer SID `01a13c7c-c4a4-7760-8b80-278687d46e54`. Historical identities are provenance, never credentials to copy into a new binding.

## Production ready, next request deliberately NOT run

Clean production build **`6xuDjC0Y8dRzDY4WFlwuR`** passed at exact d98/source ce046. Actual JS and declaration patch postimages, VAD lock0.0.31 and lifecycle marker passed. Node26.8.1. Visible actual Chrome155 used native `viewport:null`, inner1200×1279/outer1200×1366, scrollY0, Ready, both microphone and output muted; no acquired microphone tracks. This corrects the old observer’s fixed emulated1280×720 viewport.

The owner’s new-chat request arrived BEFORE the planned L6 query. No query ran. Shutdown is complete: observer87468 exited0, owned server93399 exited130 after SIGINT, no listeners3000/3001. Author normal Stop11 exited0 and released claim/timer; worktree remains clean at d98. Saved readiness data has zero turns, turn requests, speech requests and tracks. Ignored story11 artifacts: `.scratch/11-live-d98fcd99-preflight.json` and `.scratch/11-live-d98fcd99-observations.json`. Earlier33d9/96ee observations remain preserved. Old process handles are closed; launch fresh owned processes in the new chat.

Next bounded typed request, after normal bootstrap/bind and fresh production readiness:

> First perform two separate web searches: (1) official Anthropic documentation for the web search API; (2) official Deepgram documentation for Nova-3. After both searches, look up Atlas in the project catalog. Then give at most three short sentences with sources and Atlas status/owner.

Keep mic/output muted for this typed diagnostic. No automatic retries, budget resets or increases. Fresh build’s search pending/not-yet-checked state is NOT a genuine account-unavailable fallback. Distinguish actual SSE/tool/usage observations from source-derived inference about outgoing native prior blocks/tool omission. No provider-wire observer was installed; unobserved pause/wire identity stays unverified. Do not chase an uncontrollable provider pause indefinitely or create a new debug endpoint/framework to collect proof.

## Existing live evidence — retain answers and exact provenance

Read story11 `docs/implementation/11-system-acceptance.md`, `docs/live-validation.md`, `docs/evidence/11-live-audio-diagnostic-33d9.json` and its ignored saved snapshots before asking the user to repeat anything. The report skeleton `docs/evidence/live-validation.json` remains nonpassing; it has not yet absorbed all genuine partial observations. Full L1–L8 acceptance is unfinished, not a new product failure claim.

- At `33d9cd3`, three hands-free Atlas requests and “Who owns it?” worked; the participant heard the replies. First audio4.0025/3.8486/3.8209s missed the approximate3s target; preserve the actual numbers. Confirmed Beacon barge-in stopped old audio and produced Beacon. Headset listening and speaker no-self-trigger/full-reply/Stop answers were supplied. Observed microphone in later runs was Yeti Stereo Microphone; do not relabel it built-in/Bluetooth by assumption.
- Choppiness was real. One bounded diagnostic proved a contiguous native PCM boundary with about440–480ms provider padding/prosody at “more detailed answers”; isolated list-number segmentation also existed. The reviewed `96ee0a4` correction keeps list numbers with text and prefers clause boundaries without trimming PCM or changing APIs/budgets. The participant heard the corrected short numbered Atlas/Beacon reply clearly and completely. Its actual three segments were2.60/3.16/3.60s; preserve older failures separately.
- At `96ee0a4`, a brief Working “uh” was unconfirmed and resumed the same request/answer. The later Speaking “umm” crossed confirmation (~363ms), correctly interrupted, and is NOT a passing short Speaking misfire. Older real unconfirmed Speaking candidates may support the requirement if their actual saved timing/playback correlation qualifies; have a distinct reviewer assess evidence instead of automatically repeating human rounds.
- Typed Cedar with microphone muted produced text and audible speech. Three output-muted microphone Beacon turns completed STT/model text with ZERO TTS. The latest `ada42eb5` had3296 input/74 output tokens. The participant initially missed the result because it was below prior turns; their screenshot matched that completed Beacon/West/one-item response. This was a visibility defect, now fixed, not a hidden STT failure. Stop ended observed tracks/contexts.
- L6 actual hosted search/citations succeeded earlier, but the required exhausted-budget/omitted-tool continuation including a genuine provider pause is not yet fully observed. L8 has actual Stop teardown plus controlled unmount coverage; qualify their exact claims honestly.

Keep first text/audio/network and callback/acoustic timing domains separate. Batch WAV STT is not streaming STT. Preserve Unknown/null counters, actual errors and all source/build dates. If modest live attempts leave only evidence obligations unverified, prepare concrete numbered choices rather than invent acceptance or launch another framework project.

## Workflow and remaining gates

Bootstrap current AGENTS/skills/session-boot/pickup/preferences/live issue and fresh Explain. New actors must bind with their own genuine identities; old actors are to be stopped before this handoff completes. Use Sol6.1/high implementers and distinct Astra6/high reviewers as authorized. Preserve independent code-review boundaries and all registered lifecycle gates.

Ordinary admitted executable:
`/Users/kpburson/.codex/worktrees/voice-bff-epic-2/AIVC/.scratch/runtime/2012-ceb8e75a9/node_modules/@kburson/ai-task-manager/bin/aitm.mjs`.
Close compatibility only: root `node_modules/@kburson/ai-task-manager/bin/aitm.mjs`, reviewed source `9b4f6659aeb416ac174b5113ccfc37cc680279f3`. Do not retry2012’s null-engagement Close defect. #8/#9/#10 closed normally through compatibility runtime, no timing healer.

Native hook command context is the epic root even for child-workdir commands. Use registered `--allow-foreign-worktree` where supported. Explain CLI’s early parser does not accept it; use the admitted exported Explain API as recorded in the root ignored ledger. Do not alter hooks/copy identities. Proven commit transport when author’s own git context is rejected: author normal Stop11; root normal pause2/start11 orchestrator in child/fresh Explain; inspect unchanged staged files, commit/push and registered commit-trace11; root Stop11/resume2; author resumes after reviewer releases. This is a transport handoff, not CODE_COMPLETE/Test.

After final live/source/evidence acceptance: author final docs/exact-head verification/canonical Test and normal Stop; root owns Review/FullAuto approval. Use sanctioned GitHub merge with exact expected head SHA for PR37, then delivery reconcile. Do not use `gh pr merge` or fabricate provider-action envelopes. After actual merge, fetch/fast-forward epic, prove accepted source reachability/full tree, and run the exact bare `node scripts/task-tracker/verify-epic-trail.mjs` under ROOT #2 binding before Close11. Child VC13 explicitly targets2. Then fresh compatibility Close11, verify Closed/boardDone. Keep PR17 draft through full epic acceptance.

Carry forward `docs/implementation/2-workflow-simplification-observations.md` for later evaluation of direction C after AIVC delivery. Do not rewrite global memory. The large root `.scratch/plan/2-successor-recovery-ledger.md` is a local fallback, not required initial context or lifecycle authority.

## Handoff publication

GitHub rejected the direct epic-branch documentation push because `codex/2-draft` requires status checks. No override was attempted. This handoff is published on `codex/2-live-validation-handoff` with a draft documentation PR into `codex/2-draft`; integrate it through the sanctioned exact-head merge after checks, then fast-forward the recorded epic checkout. The local epic branch includes this documentation commit and may be ahead of the remote feature until that PR merges. Do not reset it or discard the handoff. PR17 remains draft.
