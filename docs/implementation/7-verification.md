# Story #7 implementation verification

Genuine author: Codex Sol 6.1/high session `01a13a80-df10-73d1-bb27-014703513b3d`, existing generation `9bc5cb69-a631-49a3-8f8c-6ab8283fd3d4`. Whole story entered Develop through registered lifecycle, after fresh native admission, accepted-plan Full-Auto approval and retained M/3h human estimate. No new human plan review or AI forecast is claimed.

Source base is fetched integrated feature `08567a2b4ddbd489f9ab562181142e8157a7ea2d`, merged normally at `07f8287ec60efb1e6dad3bd7052c5323e53e1fd8`. Frozen shared contracts, validators, package pins and manifests are unchanged.

## Delivery

Real pinned Deepgram SDK receives WAV Blob transcription and configured models with retries disabled at constructor/request. Transcript structure is runtime validated; valid empty text remains distinct from malformed/accepted responses. Synthesis inspects actual raw Headers and streams BinaryResponse incrementally with strict PCM MIME/metadata validation and rejected-body cancellation. Configured and remaining shared deadlines bound SDK requests.

The Node speech endpoint rejects Origin/Host before body/provider work, measures an 8 KiB JSON body, uses frozen validation and capability checks, and normalizes only fixed PCM headers. Two independent speech leases remain held until provider reads and cancellation promises settle. First-chunk preparation allows common JSON errors before audio; failures/deadline after bytes error the stream. Runtime lazily selects deterministic synthetic mock or real speech without disturbing typed turns. Existing actual runTurn transcription/no-speech producer is retained and covered.

## Observed verification

- Provider RED: 17 failing behaviors against initial stub, then 27 GREEN; expanded SDK/status/timeout coverage now 30 GREEN.
- Endpoint RED: 13 failing behaviors against initial stub; expanded body/late-error/pending-read cancellation coverage now 17 GREEN.
- Audio integration RED: 2 failures against unwired runtime, then 3 GREEN. Actual producer events pass frozen validation and sequence checks; empty STT makes zero model calls and independent speech failure preserves completed text.
- Declared targeted provider/endpoint plus audio: 50 passing tests.
- `npm test`: 43 passing tests.
- `npm run test:contracts`: 324 passing tests in 19 files.
- `npm run test:integration`: 26 passing tests in 3 files, including current production build and actual two-process HTTP test. Launcher shutdown intentionally signals Next, whose subprocess logs code143; the owning test and full lane pass.
- `npm run test:slow`: 15 passing tests.
- `npm run typecheck`: both workspaces pass.
- `npm run lint`: TypeScript clean, Markdown zero issues.
- `npm run format:check`: 265 files checked, zero findings.

Initial broader verification found required NODE_ENV missing from new explicit test fixtures and the existing VAD patch absent after script-suppressed installation. Fixtures were corrected and the unchanged registered postinstall patch applied; fresh checks above pass. Initial integration failure is superseded by a fresh passing production build/integration run, never relabeled as an original pass.

Distinct Astra review, canonical exact-head AITM Test, Review/approval, cloud merge and Close remain orchestrator-owned. No live Deepgram, microphone, playback, acoustic or final system acceptance is claimed; those remain the separately scoped downstream stories.
