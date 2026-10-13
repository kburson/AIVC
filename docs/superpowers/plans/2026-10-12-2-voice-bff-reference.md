# Conversational Voice BFF Reference Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Implementation requires the owner's Plan approval and the applicable AITM pickup workflow; this document does not grant either.

**Goal:** Give a developer a working, hands-free reference application that makes browser, BFF, provider and retrieval boundaries observable through grounded answers, interruptible voice and reproducible evidence.

**Architecture:** One npm workspace runs exactly two application processes: Next.js/React with Node Route Handlers on loopback port 3000, and a Fastify synthetic-project retrieval service on loopback port 3001. Transport adapters delegate to framework-independent server modules; the browser owns capture, VAD, generation ownership, history and playback. Claude and Deepgram adapters run only on the server; deterministic adapters exercise the same application contracts offline.

**Tech Stack:** Node 24.21.0 LTS, npm 11.9.0, Next.js 16.4.0, React/React DOM 19.3.0, TypeScript 5.9.3, Fastify 5.12.5, Anthropic SDK 0.133.0, Deepgram SDK 5.15.0, vad-web 0.0.31, onnxruntime-web 1.30.0, Vitest 4.0.18 and Playwright 1.64.0. Exact direct versions and transitive resolutions are committed; no floating install is a delivery command.

**Spec:** [Accepted design](../specs/2026-10-12-voice-bff-reference-design.md), authoritative complete attachment [design.accepted-v1](https://github.com/kburson/AIVC/issues/2#issuecomment-6138545099). Source revision `bc6e15ecb2f48c9f3b0cc030609fd99a8f17adac`, SHA-256 `8512daa8c456af00628a16471d4b13526c7585172c223c8bfa0f2323bee4fff6`.

**Issue:** [AIVC epic #2](https://github.com/kburson/AIVC/issues/2). Document date October 12, 2026 follows the initiating request; source/API checks continued after the local date rollover. Draft planning is documentation only. No application source, dependencies or live-provider validation existed at drafting time.

## Global Constraints

- The baseline is two local application processes, Next.js Node BFF and separate Fastify retrieval; no Edge runtime, custom Next server, second gateway or generalized agent framework.
- Browser requests go only to the same-origin BFF. Provider credentials and the fixed retrieval origin stay server-owned; no secrets in public environment variables, responses, traces or browser bundles.
- Typed input: at most 2,000 characters. WAV: mono signed 16-bit PCM at 16 kHz, valid RIFF/WAVE chunks, at most 30 seconds. Entire turn body: at most 2 MiB, counted while reading even without/trusting Content-Length.
- History: at most four complete user/assistant pairs/eight messages and 16,000 characters total. Whole oldest pairs are dropped; one oversized pair is omitted with a notice. Only a still-current `complete` text turn contributes both messages atomically.
- Turn deadline 60 seconds; retrieval deadline 5 seconds; speech-request deadline 20 seconds; configurable positive finite bounds. Model: 1,024 output tokens per round, three rounds and four custom-tool executions per turn.
- Hosted search: `web_search_20250305`, one shared two-use budget per BFF turn across tools, pauses and Messages requests; no arbitrary domain allowlist or code-execution prerequisite.
- Concurrency: two active turn requests and two active speech requests per BFF process. Keep a slot until admitted upstream work settles or is confirmed canceled. No automatic paid-request replay or automatic 429 retry; SDK retry defaults are explicitly disabled.
- Speech: raw mono signed 16-bit little-endian PCM at 24 kHz without WAV header. Segment cap `min(120, floor(6 * SPEECH_CHARS_PER_SECOND))`; default 14 gives 84 characters. One active speech request per browser conversation, text backlog 2,400 characters, actual outstanding audio at most ten seconds, low-water admission at two seconds, stalled-playback watchdog three wall-clock seconds.
- Separate playback and capture/VAD contexts. Raw VAD start pauses playback reversibly; positive speech confirmation initially 400 ms invalidates/aborts; misfire resumes the same generation. Initial silence 800 ms and pre-roll 800 ms are measured tuning settings.
- Start requests permission and resumes audio contexts in the user gesture. Microphone mute stops capture; output mute cancels speech while retaining text; Stop/unmount releases all tracks, nodes, VAD resources and requests. Listening remains active during answers.
- Safe Markdown, no raw HTML. Only parsed absolute HTTP(S) links; invalid/other schemes render as text. External links use `noopener noreferrer`. Normalize display events; never expose raw provider events or reasoning.
- Required provider configuration: `ANTHROPIC_API_KEY`, `CLAUDE_MODEL`, `DEEPGRAM_API_KEY`, `DEEPGRAM_STT_MODEL`, `DEEPGRAM_TTS_MODEL`, `RETRIEVAL_BASE_URL`. Missing provider settings disable only the affected capability; malformed admission configuration fails closed.
- `CLAUDE_WEB_SEARCH=enabled`, `CLAUDE_WEB_SEARCH_TOOL_VERSION=web_search_20250305`, `BFF_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000`, `BFF_ALLOWED_HOSTS=localhost:3000,127.0.0.1:3000`, `SPEECH_CHARS_PER_SECOND=14`, `RETRIEVAL_BASE_URL=http://127.0.0.1:3001` are sanitized example defaults.
- Offline CI is labeled Mock/Simulation and makes no real provider calls. Live acceptance uses modest normal API usage, records actual models/browser/observations and leaves missing/failed cases explicit. Consumer subscriptions are not API account configuration.
- Exclude accounts, persistent history, private mail/employer data, uploads, vector databases, second model adapter, durable research, public deployment, Kubernetes/Helm and telephony. Extension prose may discuss their additional boundaries.

## Review Focus

1. Disconnect between a completed provider call and the next tool continuation: retain exact native blocks, stop without replay and show incomplete text (Task 3).
2. Stop/unmount while microphone permission or VAD initialization is still pending: release late resources and never start a canceled capture session (Task 7).
3. Device sample rate differs from output PCM rate and network chunks end on odd bytes: derive audio duration from 24 kHz samples, preserve one trailing byte and reject a dangling final byte (Task 6).
4. A misfire arrives after confirmation, or speech ends after an obsolete capture session: candidate/session tokens cannot resume canceled audio or submit a duplicate utterance (Task 8).
5. Provider returns HTTP success with JSON/error or malformed retrieval/source data: validate boundary responses, never decode JSON as PCM or derive cards from model JSON (Tasks 3 and 5).

---

## Scope

Implement the entire accepted baseline, typed aggregation first, then voice. This is one integrated plan because the browser/server cancellation and budgeting contracts must remain coherent. The independently reviewable tasks below become governed child stories only through the root's Plan decomposition workflow. Creating those stories, approving Plan or implementing them is outside draft authoring.

## Context and evidence

The repository currently has AITM bootstrap files, its local tarball dependency and accepted specification/review evidence. `package.json` has no application workspaces and its `test` script intentionally fails. The drafting shell reports Node 26.8.1/npm 12.0.2, so switching application commands to the pinned Node 24 toolchain is an execution prerequisite. The globally installed local-tarball ai-peer-review 0.4.1 and its compiled broker-security helper use the separately pinned Node 26.8.1 runtime/MCP registration; preserve that installation and absolute runtime path. Do not upgrade/rebuild peer-review, alter its MCP registration or assume a generic shebang/PATH switch preserves its native ABI during application setup. No verifier below is represented as executed or passing.

Primary-source checks support these implementation choices:

- Next.js installation documents Node >=20.9 and explicit ESLint; the chosen Node 24 satisfies that floor. [Next installation](https://nextjs.org/docs/app/getting-started/installation), [Node 24.21.0 release](https://nodejs.org/en/blog/release/v24.21.0). Registry metadata confirmed the exact package versions used here without installing them.
- Anthropic Models API exposes `capabilities.server_tools.web_search.supported`. Treat missing/unknown capability as search-unavailable and a true value as model support only, never account verification. [Models API](https://platform.claude.com/docs/en/api/models/retrieve).
- Direct search version 20250305 supports request-scoped `max_uses`; `pause_turn` is resumed with the assistant blocks unchanged. Newer variants can default to code-execution callers, so do not silently upgrade the tool. The omitted-tool/exhausted-budget continuation remains a required live compatibility test. [Web search](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool).
- vad-web 0.0.31's published git head `de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d` has `onSpeechRealStart`, `minSpeechMs`, custom `audioContext`, `getStream`, `startOnLoad`, `pause`, `destroy` and 16 kHz speech-end samples. These remove the callback uncertainty; browser timing and asset compatibility still need execution evidence. [Pinned VAD source](https://github.com/ricky0123/vad/blob/de9b3ff83fd44cd7a2b3e07e9454e6b6f0bc249d/packages/web/src/real-time-vad.ts), [VAD API](https://docs.vad.ricky0123.com/user-guide/api/).
- Deepgram 5.15.0 uses `DeepgramClient`, `listen.v1.media.transcribeFile` and `speak.v1.audio.generate`. Its `BinaryResponse.stream()` returns the original fetch body; use this instead of a whole-response arrayBuffer. Request options include `abortSignal`, `timeoutInSeconds`, `maxRetries`; REST linear16/none permits 24 kHz. [Pinned synthesis client](https://github.com/deepgram/deepgram-js-sdk/blob/v5.15.0/src/api/resources/speak/resources/v1/resources/audio/client/Client.ts), [BinaryResponse](https://github.com/deepgram/deepgram-js-sdk/blob/v5.15.0/src/core/fetcher/BinaryResponse.ts), [SDK options](https://github.com/deepgram/deepgram-js-sdk/blob/v5.15.0/src/BaseClient.ts), [Media output settings](https://developers.deepgram.com/docs/tts-media-output-settings).

Resolved metadata discrepancy: the accepted spec has **15** numbered verification cases. The epic initially said fourteen; the root corrected its prose through the governed issue-body writer. This plan covers all 15. No accepted architecture contradiction was found; live provider/browser capability remains a test obligation, not an inferred guarantee.

## Acceptance Criteria

- [ ] Exact Atlas/Beacon/Cedar retrieval and typed Claude/custom-tool streaming preserve native tool IDs, validated records, citations and actual usage with bounded rounds/tools/search.
- [ ] Origin/Host pre-body admission, measured body/WAV/history limits, deadlines and true upstream slot ownership protect both paid endpoints.
- [ ] Automatic voice turns, early ordered speech, request backpressure, reversible misfire recovery and confirmed interruption meet the generation/history/cleanup contracts.
- [ ] One safe page supports typed fallback, independent mutes, visible failures/capabilities/cards and collapsed transcript/trace.
- [ ] All 15 spec boundary cases and each manual acceptance scenario have automated or actual recorded live evidence; unavailable/failed evidence cannot pass a completion gate.
- [ ] Pinned setup, real code-linked tutorial, command ownership and explicit limitations reproduce the two-process architecture.

## Plan Metadata

- Priority: P1
- Size: XL
- Estimate: 41 hours expected implementation/review/live-debug effort; plausible range 29-61 hours before provider/account delays
- Labels: epic, architecture, voice, bff
- Refinement snapshot: XL/8 hours is a **provisional one-day timebox budget**, not a fixed delivery promise. The current authoritative issue field remains root-owned until the governed estimate/forecast update.
- Dependency order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9. Task 5's provider adapter can be developed after Task 2, but final integration follows typed-path validation. Do not fan out tasks that mutate the same shared contracts.

| Task | Expected effort | Range | Principal risk |
|---|---:|---:|---|
| 1 Retrieval/workspace | 3 h | 2-5 h | Toolchain, strict validation and production launch |
| 2 Transport/admission | 4 h | 3-6 h | Stream/body/cancellation ownership |
| 3 Claude/tools/search | 5.5 h | 4-8 h | Native content/pause/search and exact streamed text joining |
| 4 Typed UI/history | 3.5 h | 2-5 h | Stale events and atomic history |
| 5 Deepgram/voice HTTP | 3 h | 2-4 h | SDK stream/error/cancellation behavior |
| 6 PCM/speech queue | 5 h | 3-7 h | Audio clock accounting and segmentation |
| 7 Capture/VAD | 5 h | 4-8 h | WASM/assets, permission lifecycle and maintained lifecycle patch |
| 8 Interruption | 5 h | 4-8 h | Async suspend/resume races, next-answer recovery, echo |
| 9 Evidence/tutorial | 7 h | 5-10 h | Live account support and device timing |

Effort signals are human-hour planning inputs, not model-token or wall-clock guarantees. Tasks 2/3/6/8 have high coupling and failure impact (paid calls, provider native blocks, PCM accounting, concurrency races); Tasks 1/4/5/7 have medium coupling; Task 9 has high external uncertainty. All nine tasks require new tests because this is a new application; no existing application tests are expected to be removed. Each interface owner supplies additive contract tests before downstream work, and a failed provider/browser compatibility check may require revisiting its owning task. These signals and the per-task ranges above supply the root's genuine Plan-estimation input after governed decomposition.

SPR revision adds one expected hour to Task 7 (range increases from 3-6 to 4-8 hours) for a version-bound VAD lifecycle patch and tests against the real pinned cleanup implementation. This raises the bottom-up total from 38 to 39 hours and range from 27-55 to 28-57; the nine task boundaries and accepted application scope stay the same. Root-owned issue/forecast metadata will be reconciled after the sealed review, rather than mutated during it.

XPR revision adds 0.5 expected hour to Task 1 for reproducible production launch/validation, 0.5 to Task 3 for the exact multi-round text invariant, and 1 to Task 8 for playback-context recovery across async interruption. The total is now 41 hours, range 29-61; scope and the nine child-task boundaries remain unchanged. Other narrow setup/fixture/stream-hook corrections fit their stated ranges. These remain human-hour estimates, not fixed delivery guarantees.

At eight elapsed implementation hours, report which requirements and verifiers remain open; do not remove requirements or label a partial typed/mock demo complete. Continue only within the owner's authorized implementation time. A smaller scope requires explicit new agreement. Prioritize working typed aggregation, then the complete voice loop, then evidence and concise tutorial; decoration has no separate task.

## Story Intent

- **Beneficiary:** developer learning conversational AI application architecture
- **Capability:** use and inspect a hands-free reference application with visible browser, BFF, provider and retrieval boundaries
- **Need:** a diagram alone cannot demonstrate grounded answers, interruption, failure handling or actual voice latency
- **Value or failure prevented:** the developer can test and extend the architecture using working behavior and honest evidence about its limits

## File and interface map

All paths below are repository-relative. New source files use TypeScript; root scripts remain `.mjs` because the existing root is CommonJS. Keep the existing AITM dependency, hooks and sealed review collateral intact.

| Boundary | Owning files | Responsibility |
|---|---|---|
| Workspace | `package.json`, `.nvmrc`, `.npmrc`, `tsconfig.base.json`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.mjs`, `.prettierignore`, `.prettierrc.json`, `.gitignore` | Pins, two-process commands, offline checks |
| Retrieval | `apps/retrieval/src/projects/catalog.ts`, `apps/retrieval/src/projects/schema.ts`, `apps/retrieval/src/http/app.ts`, `apps/retrieval/src/index.ts`, `apps/retrieval/fixtures/projects.json` | Exact synthetic lookup, Fastify validation |
| Contracts | `apps/web/shared/contracts.ts`, `apps/web/shared/validation.ts`, `apps/web/shared/sse.ts`, `apps/web/shared/history.ts` | Normalized event/request/history schemas |
| HTTP | `apps/web/server/http/{admission,body,errors,sse-response}.ts`, `apps/web/app/api/{turn,speech,capabilities}/route.ts` | Pre-body admission, bounded input, Node adapters |
| Server lifecycle | `apps/web/server/{config,capabilities,runtime,build-info}.ts`, `apps/web/server/turns/{leases,deadline,run-turn}.ts` | Configuration, process singleton, held slots, abort/deadline |
| Providers/tools | `apps/web/server/providers/{contracts,claude,deepgram,mock}.ts`, `apps/web/server/tools/{lookup-projects,retrieval-client}.ts` | Native provider blocks, validated tool dispatch, real/mocked modes |
| Client text | `apps/web/client/{turn-controller,turn-stream,history}.ts`, `apps/web/components/{Conversation,Answer,ProjectCard,Details,Capabilities}.tsx` | Generation ownership, safe rendering, optional diagnostics |
| Client speech | `apps/web/client/voice/{pcm,playback,speech-text,speech-queue,wav,vad-adapter,capture-session,interruption}.ts` | PCM ledger, queue admission, capture and two-phase interruption |
| Evidence | `scripts/{dev,run-tests,verify-live,verify-docs,copy-vad-assets}.mjs`, `scripts/task-tracker/verify-epic-trail.mjs`, `docs/{specification,architecture,tutorial,live-validation}.md`, `docs/evidence/live-validation.json` | Reproducible execution and honest acceptance records |

Test groups: `tests/contracts/`, `tests/integration/`, `tests/voice/`, `tests/ui/`, `tests/slow/`, `tests/browser/`, `tests/scripts/`. The explicit Vitest configuration excludes sealed peer-review directories, `node_modules`, `.scratch`, `.tmp` and Playwright specs. Browser tests use Mock/Simulation servers; live evidence is separately produced and checked.

## Implementation Tasks

For each test-bearing checkbox below, add one boundary scenario, run the owning task's exact verifier and confirm it fails for the missing behavior, implement the smallest corresponding change, then rerun that verifier to green before adding the next scenario. Infrastructure installation/type errors are not the intended red assertion. Keep checkpoints reviewable; every task ends with its declared delivered tests and a scoped commit under the real governed child issue. No test is marked passing until its output is inspected.

### Task 1: Reproduce the synthetic retrieval boundary in the pinned workspace

#### Story Intent

- **Beneficiary:** developer examining the application data boundary
- **Capability:** run a separate deterministic project service alongside the browser application
- **Need:** local fixture substitution inside the BFF would conceal the independent HTTP retrieval boundary
- **Value or failure prevented:** the developer can reproduce exact answers and observe service failure without private data or a database

#### Files

Create `.nvmrc`, `.npmrc`, `tsconfig.base.json`, `vitest.config.ts`, `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `apps/retrieval/package.json`, `apps/retrieval/tsconfig.json`, `apps/retrieval/src/projects/catalog.ts`, `apps/retrieval/src/projects/schema.ts`, `apps/retrieval/src/http/app.ts`, `apps/retrieval/src/index.ts`, `apps/retrieval/fixtures/projects.json`, `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/next.config.ts`, `apps/web/app/layout.tsx`, `apps/web/app/page.tsx`, `scripts/dev.mjs`, `scripts/clean-build.mjs`, `scripts/run-tests.mjs`, `scripts/format-check.mjs`, `scripts/task-tracker/verify-epic-trail.mjs`, `tests/contracts/retrieval.test.ts`, `tests/contracts/fixture-schema.test.ts`, `tests/scripts/launcher.test.ts`, `tests/scripts/epic-wrapper.test.ts`. Modify root `package.json`, `package-lock.json`, `.gitignore`.

**Interfaces:** `createRetrievalApp(): FastifyInstance`; `lookupProjects(name?: string): ProjectCatalog`; `ProjectRecord = { id: string; name: string; status: 'active'|'paused'|'complete'; ownerTeam: string; openItems: number; summary: string }`; `ProjectCatalog = { schemaVersion: 1; source: 'synthetic-project-catalog'; records: ProjectRecord[] }`. Task 2 owns the shared copy of these wire types; retrieval may import it once created, avoiding a third running service.

- [ ] Switch to Node 24.21.0/npm 11.9.0, confirm `node --version`/`npm --version`, add exact root/workspace pins and commit the generated lock during implementation. Set `.npmrc` to `save-exact=true` and `engine-strict=true`, `.nvmrc` to `24.21.0`; root `engines.node` to `24.21.0`, `packageManager` to `npm@11.9.0`. Use TypeScript 5.9.3, tsx 4.20.6, Vitest 4.0.18, ESLint 9.39.1, eslint-config-next 16.4.0, Prettier 3.9.10, jsdom 26.1.0, Testing Library React 16.3.3, Playwright 1.64.0 and type packages Node 24.19.2/React 19.3.0/React DOM 19.3.0. Web pins Next 16.4.0, React/DOM 19.3.0, react-markdown 10.1.0, Anthropic 0.133.0, Deepgram 5.15.0, vad-web 0.0.31 and ORT 1.30.0; retrieval pins Fastify 5.12.5 and Ajv 8.17.1. Reconcile install errors explicitly rather than unpinning versions.
- [ ] Define root command ownership using this exact script map; workspace build/typecheck use their own tsconfigs. `scripts/run-tests.mjs` uses `spawnSync` with argument arrays and inherited stdio; unknown groups exit 2, no tests is failure, and any failed child command returns nonzero.

```json
{
  "workspaces": ["apps/web", "apps/retrieval"],
  "scripts": {
    "dev": "node scripts/dev.mjs",
    "start": "node scripts/dev.mjs --production",
    "build:clean": "node scripts/clean-build.mjs",
    "test:browser:install": "playwright install chromium",
    "build": "npm run build --workspaces",
    "typecheck": "npm run typecheck --workspaces",
    "test": "node scripts/run-tests.mjs unit",
    "test:contracts": "node scripts/run-tests.mjs contracts",
    "test:integration": "node scripts/run-tests.mjs integration",
    "test:voice": "node scripts/run-tests.mjs voice",
    "test:browser": "playwright test",
    "test:slow": "node scripts/run-tests.mjs slow",
    "lint": "eslint apps tests scripts --max-warnings=0",
    "format:check": "node scripts/format-check.mjs",
    "verify:live": "node scripts/verify-live.mjs",
    "verify:docs": "node scripts/verify-docs.mjs",
    "assets:vad": "node scripts/copy-vad-assets.mjs"
  }
}
```

`scripts/format-check.mjs` enumerates only existing owned source/test/script files and existing root configuration/README/current architecture/tutorial/live docs, then invokes pinned Prettier with an argument array. It skips future missing files during intermediate tasks, excludes copied assets, generated output, dependencies and sealed review collateral, and fails when no owned files exist. Task 9 `verify:docs` separately requires every final document/config file so skipping a missing final deliverable cannot produce completion. Test the formatter's path enumeration with an existing file, a missing future path and sealed evidence; run its nonmutating check after implementation.

Groups: unit selects `tests/ui` and `tests/scripts`; contracts selects `tests/contracts`; integration selects `tests/integration`; voice selects `tests/voice`; slow selects `tests/slow` and runs offline bounded deadline/cancellation scenarios. Each root verifier becomes meaningful as its owning task delivers tests; do not add empty passing groups. Vitest defaults to Node; each DOM/UI or JSX-rendering contract test begins with `// @vitest-environment jsdom` using pinned jsdom and automatic TSX transformation. Do not rely on obsolete per-glob environment options. A UI smoke assertion proves window/document exist; pure server tests remain Node. Retrieval `dev` is `tsx watch src/index.ts`, `build` is `tsc -p tsconfig.json`, `typecheck` adds `--noEmit`, `start` is `node dist/index.js`; web uses `next dev --hostname 127.0.0.1 --port 3000`, `next build`, `next start --hostname 127.0.0.1 --port 3000`, `tsc --noEmit`.

- [ ] Write the failing retrieval test; run `npx vitest run tests/contracts/retrieval.test.ts` and confirm failure is missing application behavior, then add the real fixture/schema/endpoint. Unknown/repeated query fields, nonstring or empty `name` and malformed query encoding receive 400; an absent `name` lists all records and an unmatched valid name yields an empty list. Set fixture summaries to the explicitly synthetic strings shown here; no real enterprise claim is attached.

```ts
import { expect, it } from 'vitest';
import { createRetrievalApp } from '../../apps/retrieval/src/http/app';
it('looks up exact synthetic records without fuzzy matching', async () => {
  const app = createRetrievalApp();
  try {
    const all = await app.inject('/v1/projects');
    expect(all.json()).toEqual({ schemaVersion: 1, source: 'synthetic-project-catalog', records: [
      { id: 'atlas', name: 'Atlas', status: 'active', ownerTeam: 'North', openItems: 3, summary: 'Synthetic active project owned by North with three open items.' },
      { id: 'beacon', name: 'Beacon', status: 'paused', ownerTeam: 'West', openItems: 1, summary: 'Synthetic paused project owned by West with one open item.' },
      { id: 'cedar', name: 'Cedar', status: 'complete', ownerTeam: 'South', openItems: 0, summary: 'Synthetic completed project owned by South with no open items.' }
    ] });
    expect((await app.inject('/v1/projects?name=aTlAs')).json().records).toHaveLength(1);
    expect((await app.inject('/v1/projects?name=Atl')).json().records).toEqual([]);
    expect((await app.inject('/v1/projects?name=')).statusCode).toBe(400);
    expect((await app.inject('/v1/projects?name=Atlas&name=Beacon')).statusCode).toBe(400);
    expect((await app.inject('/v1/projects?foo=1')).statusCode).toBe(400);
    expect((await app.inject('/v1/projects?name=%E0%A4%A')).statusCode).toBe(400);
    expect((await app.inject('/health')).json()).toEqual({ status: 'ok' });
  } finally { await app.close(); }
});
```

```ts
export function lookupProjects(name?: string): ProjectCatalog {
  return { schemaVersion: 1, source: 'synthetic-project-catalog', records:
    name === undefined ? [...records] : records.filter(r => r.name.toLowerCase() === name.toLowerCase()) };
}
// app.ts: Fastify({ajv:{customOptions:{removeAdditional:false,coerceTypes:false}},
// routerOptions:{querystringParser:parseProjectQuery}}).
// Query schema has additionalProperties:false; name, if present, is string,
// minLength:1/maxLength:200. Response schema serializes validated records.
// index.ts: await app.listen({ host:'127.0.0.1', port:3001 }); close on SIGINT/SIGTERM.
```

- [ ] Implement `parseProjectQuery(raw:string)` in retrieval app.ts: split ampersand fields and the first equals delimiter, decode plus-as-space with strict decodeURIComponent, preserve unknown keys and duplicate keys as arrays in a null-prototype record. On decode exception return `{__malformedQuery:true}`; the non-stripping additionalProperties:false schema rejects this sentinel with HTTP400. Do not throw an unchecked router exception. removeAdditional:false prevents stripping; coerceTypes:false keeps repeated-name arrays invalid. In schema.ts export projectCatalogSchema reused for response serialization and compiled with exact Ajv8.17.1 for fixture-load validation. `loadCatalog(value:unknown):ProjectCatalog` fails startup for schema errors including invalid status, shape and noninteger/negative openItems. Test invalid fixtures independently; response serialization is never validation.
- [ ] Implement the root launcher with exactly two `spawn` children using current Node/npm executables and inherited stdio. Default mode calls web/retrieval dev scripts; --production calls their start scripts (next start and built node dist/index.js). Reject unknown flags and fail production startup when build output is missing. Forward termination to both and await exit; never start a third gateway. Test both modes, arguments/working directories and termination with controlled spawn boundaries.
- [ ] Implement scripts/clean-build.mjs: resolve the workspace root, remove only apps/web/.next and apps/retrieval/dist, then spawn npm run build and preserve its result. Web prebuild regenerates VAD assets when Task 7 lands. The owned live command sequence is npm run build:clean then npm start; npm run dev remains development only. Ignore `.env*` except `.env.example`, `.next`, `dist`, generated browser artifacts and copied VAD assets; preserve the existing AITM ignore lines.
- [ ] Add the owned epic-verifier wrapper. Import package `main` through its installed filesystem path, pass arguments/environment unchanged and preserve exit code. Never copy the package verifier or hard-code success. The root DoD's bare path thereby resolves; active epic binding or `AITM_TEST_ISSUE_NUMBER=2` is required at final Test, with real children/commit trail.

```js
import { main } from '../../node_modules/@kburson/ai-task-manager/scripts/task-tracker/verify-epic-trail.mjs';
process.exitCode = await main(process.argv.slice(2));
```

- [ ] Test the unchanged wrapper in a subprocess using a temporary fixture package at its exact imported path; it has no reachable dependency-injection seam: forward `2`, forward environment, preserve nonzero result and fail when package missing. Do not invoke live GitHub trail during ordinary offline CI. Run the retrieval/wrapper tests and root typecheck/build/lint/format on files delivered by this task. The initial web shell is a working page/layout with no imports of future modules; web typecheck includes root tests via its noEmit config. Do not run a future integration/voice/browser/docs/live group as if delivered; those commands must fail with a clear absent-suite message until their owning task lands. Then commit this task's exact scoped files under its actual governed child issue after decomposition. Use the bound child's real numeric ID in the commit message; never fabricate an ID in this draft.

**Verification Commands:**

```sh
npx vitest run tests/contracts/retrieval.test.ts tests/contracts/fixture-schema.test.ts tests/scripts/epic-wrapper.test.ts tests/scripts/launcher.test.ts
npm run typecheck
npm run build
npm run lint
npm run format:check
```

### Task 2: Admit and bound requests before paid work

#### Story Intent

- **Beneficiary:** local reference-application operator
- **Capability:** reject untrusted browser origins and oversized or malformed requests before provider work
- **Need:** a loopback paid endpoint can receive simple cross-origin requests and cancellation may outlive its HTTP response
- **Value or failure prevented:** unintended paid calls, unbounded buffering and excess upstream concurrency are prevented

#### Files

Create `apps/web/shared/contracts.ts`, `apps/web/shared/validation.ts`, `apps/web/shared/history.ts`, `apps/web/server/config.ts`, `apps/web/server/build-info.ts`, `apps/web/server/http/admission.ts`, `apps/web/server/http/body.ts`, `apps/web/server/http/errors.ts`, `apps/web/server/turns/leases.ts`, `apps/web/server/turns/deadline.ts`, `apps/web/server/capabilities.ts`, `apps/web/server/runtime.ts`, `apps/web/app/api/capabilities/route.ts`, `apps/web/.env.example`, `tests/contracts/config.test.ts`, `tests/contracts/build-info.test.ts`, `tests/contracts/admission.test.ts`, `tests/contracts/input.test.ts`, `tests/contracts/leases.test.ts`, `tests/slow/deadlines.test.ts`.

**Interfaces:** `loadConfig(env: NodeJS.ProcessEnv): ServerConfig`; `assertAdmission(headers: Headers, config: ServerConfig, requireOrigin: boolean): void`; `readBoundedBody(req: Request, maxBytes: number, signal:AbortSignal): Promise<Uint8Array>`; `parseTurn(bytes: Uint8Array, contentType: string): Promise<TurnInput>`; `validateSpeech(value: unknown, cap: number): SpeechInput`; `validateHistory(value: unknown): HistoryMessage[]`; `acquireLease(kind: 'turn'|'speech'): { release(): void }` throws `AppError` when busy; `runWithDeadline<T>(ms: number, caller: AbortSignal, work: (signal: AbortSignal)=>Promise<T>): { result: Promise<T>; settled: Promise<void>; signal: AbortSignal }` separates the deadline-facing result from actual upstream settlement. The result rejects at timeout/caller abort; the settled promise resolves only after the work really settles and has its own rejection handler. Lease release is attached to settled, never to the timeout-facing result. Export `deadlineRemainingMs(signal:AbortSignal):number` from deadline.ts, reading the registered monotonic deadline (Infinity for unregistered direct-module test signals); SDK timeouts use min(configured bound, remaining deadline). After pre-body admission, start the turn deadline before bounded body reading so stalled bodies cannot hold the request indefinitely. No paid lease is needed during reading. `createRetrievalClient(baseUrl:string): (name:string|undefined,signal:AbortSignal)=>Promise<ProjectCatalog>` is exported by Task 3. `getRuntime()` is one process singleton under `globalThis` across module reloads, containing config/capabilities/adapters and separate two-slot pools.

- [ ] Add contracts with discriminated payloads; clients cannot send tools, sources or system prompts. Define `ServerConfig` in config.ts as `{ mode:'live'|'mock'; allowedOrigins:ReadonlySet<string>; allowedHosts:ReadonlySet<string>; anthropicKey:string|null; claudeModel:string|null; deepgramKey:string|null; sttModel:string|null; ttsModel:string|null; retrievalBaseUrl:string; searchEnabled:boolean; searchToolVersion:'web_search_20250305'; speechCharsPerSecond:number; segmentChars:number; turnTimeoutMs:number; retrievalTimeoutMs:number; speechTimeoutMs:number }`. These signatures are the authority for subsequent tasks.

```ts
export type HistoryMessage = { role: 'user'|'assistant'; content: string };
export type TurnInput = { turnId: string; history: HistoryMessage[] } &
  ({ kind: 'text'; text: string } | { kind: 'audio'; wav: Uint8Array });
export type SpeechInput = { turnId: string; segmentId: string; text: string };
export type Source = { title: string; url: string; citedText?: string };
export type Usage = { inputTokens?: number; outputTokens?: number; searchUses?: number };
export type AppErrorFields = { code: string; message: string; turnId: string|null; retryable: boolean };
export type TurnStatus = 'complete'|'interrupted'|'failed'|'truncated'|'no-speech';
export type EventPayloads = {
  'turn.accepted': { mode: 'live'|'mock' };
  'transcript.final': { text: string };
  stage: { stage: 'transcribing'|'researching'|'retrieving'|'answering' };
  'tool.started': { name: 'lookup_projects'; summary: string };
  'tool.completed': { result: ProjectCatalog };
  'answer.delta': { text: string };
  sources: { sources: Source[] };
  'turn.completed': { text: string; status: 'complete'|'truncated'|'no-speech'; usage?: Usage };
  'turn.failed': AppErrorFields;
};
export type TurnEvent = { [K in keyof EventPayloads]: {
  schemaVersion: 1; turnId: string; seq: number; type: K; data: EventPayloads[K]
} }[keyof EventPayloads];
export type Capabilities = {
  schemaVersion: 1; mode: 'live'|'mock'; model: string|null; sttModel: string|null; ttsModel: string|null;
  build: { mode:'production'|'development'; buildId:string|null };
  turnsAvailable: boolean; speechAvailable: boolean;
  search: { state: 'disabled'|'unavailable'|'configured'|'verified'; reason: string|null; accountValidation: 'pending'|'verified'|'unavailable' };
  speech: { segmentChars: number; backlogChars: 2400; highWaterSeconds: 10; lowWaterSeconds: 2 };
};
```

`ProjectRecord`/`ProjectCatalog` are the exact Task 1 types, exported in this file. `AppError` extends Error with `httpStatus` and the four common fields. Stable error codes include `ORIGIN_NOT_ALLOWED`, `INVALID_REQUEST`, `BODY_TOO_LARGE`, `BUSY`, `TRANSCRIPTION_FAILED`, `MODEL_RATE_LIMIT`, `MODEL_FAILED`, `RETRIEVAL_UNAVAILABLE`, `SEARCH_UNAVAILABLE`, `TURN_DEADLINE`, `SPEECH_FAILED`, `SPEECH_DEADLINE`, `LIMIT_REACHED`; client-only reasons include `NO_SPEECH`, `SPEECH_BACKLOG`, `SPEECH_TOKEN_TOO_LONG`, `AUDIO_OVERSIZE`, `PLAYBACK_STALLED`, `SPEECH_RESUME_FAILED`, `CONTEXT_OMITTED`. HTTP statuses are 400/403/413/429/502/504 as specified; rejection before body parsing has `turnId:null`.

- [ ] Write pre-body rejection tests and run them red. Include well-formed multipart and JSON requests from `http://localhost:9999`, null/missing/malformed Origin, mismatched Host, disallowed Host, allowed Origin/Host and ignored forwarded headers. A body getter/read spy and all upstream spies remain untouched for rejection. Capabilities needs allowed Host only and returns 403 before metadata for bad Host.

```ts
it('rejects a simple multipart request without reading its body', () => {
  const headers = new Headers({ origin: 'http://localhost:9999', host: 'localhost:3000' });
  expect(() => assertAdmission(headers, config, true)).toThrowError('ORIGIN_NOT_ALLOWED');
});
```

Add `tests/contracts/config.test.ts` exporting no production fixtures; construct `config` by `loadConfig` with the documented defaults, dummy server keys and explicit model labels. Reject wildcards, userinfo/path/query/fragment in origins, malformed hosts, missing/nonfinite/nonpositive CPS/deadlines and allowlists whose matching host is absent. Keep missing credentials as unavailable capability, not invalid admission.

- [ ] Implement exact canonical admission using parsed Origin `.origin === suppliedOrigin`, an HTTP(S) protocol, a configured canonical origin and `origin.host === Host`; Host must be in the configured list. Never trust `X-Forwarded-*`. A paid request invokes this before `request.body`, JSON/formData parsing or lease acquisition.
- [ ] Write input tests for UUID, both/neither audio and text, duplicate form fields, extra fields, 2,000/2,001 characters, 2 MiB/excess chunked body, malformed/truncated RIFF, wrong format/channel/rate/bits, invalid chunk lengths/alignment, empty/30-second/excess duration and alternating history pairs. Read the transport body through a reader and count received bytes; cancel reader once the cap is exceeded, then parse a bounded synthetic Request/FormData. Do not call unbounded `request.formData()` on the original body.

```ts
export async function readBoundedBody(req: Request, cap: number, signal:AbortSignal): Promise<Uint8Array> {
  const reader = req.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = []; let total = 0;
  const onAbort=()=>{ void reader.cancel(signal.reason).catch(()=>{}); };
  signal.addEventListener('abort',onAbort,{once:true});
  try {
    signal.throwIfAborted();
    while (true) {
      const { done, value } = await reader.read(); signal.throwIfAborted(); if (done) break;
      total += value.byteLength;
      if (total > cap) { await reader.cancel(); throw new AppError(413, 'BODY_TOO_LARGE', 'Request exceeds 2 MiB.', null, false); }
      chunks.push(value);
    }
  } finally { signal.removeEventListener('abort',onAbort); reader.releaseLock(); }
  const out = new Uint8Array(total); let at = 0;
  for (const chunk of chunks) { out.set(chunk, at); at += chunk.length; }
  return out;
}
```

- [ ] Implement schema validation and WAV walking with bounds-checked RIFF chunks, exactly one usable `fmt ` and `data`, PCM format 1/channel1/16000Hz/16bits/blockAlign2/byteRate32000, consistent declared lengths and sample count <=480,000. Unknown valid ancillary chunks can be skipped with padding; invalid/duplicate data/format chunks fail. Empty PCM maps to no-speech without model work. Count history characters as JS string lengths consistently on both sides; reject nonstring roles/content, incomplete pairs and >8/16,000 input, rather than trusting the browser's trimming.
- [ ] Add concurrency/deadline tests: acquire two leases, reject third before work; caller aborts first but its deferred upstream work remains unsettled and slot unavailable; release only after settlement, idempotently. Composite signal joins request abort and deadline; timeout-facing result returns 504 before stream or a failed event after stream, while `settled` owns the held lease until work actually settles. For streaming work, settlement means the producer and its admitted upstream operations finish or cancellation is confirmed, not merely that headers/first bytes arrived. Consume all background errors, including errors after a deadline-facing response ended. Test provider code that ignores cancellation; do not use `Promise.race` settlement alone as evidence of upstream cancellation. Test stalled body reading: deadline cancels reader and returns TURN_DEADLINE/504 with turnId null and zero provider/lease calls; a valid body preserves the same remaining deadline for providers.
- [ ] Write the sanitized environment example with empty key/model values (documented unavailable until the operator fills them), all six required names, `AIVC_MODE=live`, the six exact defaults in Global Constraints and 60000/5000/20000 deadline settings. The example deliberately contains no credentials; blank providers produce unavailable capabilities, never live-success labels. Add a config test asserting those documented defaults parse and keys are absent.
- [ ] Implement `readBuildInfo(webRoot:string):Promise<{mode:'production'|'development';buildId:string|null}>` in build-info.ts. Under next start/NODE_ENV production read webRoot/.next/BUILD_ID and expose this nonsecret production ID in capabilities/collapsed diagnostics. Missing/invalid ID is null and cannot pass live verification. Under next dev report development/null. Never assume App Router __NEXT_DATA__. This serves the actually tested production ID; Task 9 records it as provenance, while later verification relies on stable source/patch/module digests rather than comparing a mutable local build ID. Add controlled filesystem tests for a production ID, missing file and development mode.
- [ ] Implement Host-only capabilities route with `export const runtime='nodejs'`, response no-store and sanitized capability labels/limits. Missing Deepgram disables speech/audio input but preserves configured Claude typed input; missing Claude disables turns and explains why; mock mode requires explicit `AIVC_MODE=mock`, never silently falls back. `AIVC_MODE=live` is default. Document configurable `TURN_TIMEOUT_MS`, `RETRIEVAL_TIMEOUT_MS`, `SPEECH_TIMEOUT_MS` with 60000/5000/20000 defaults.
- [ ] Run boundary and slow tests/typecheck, inspect diff for any secret/default-live claim and commit the task under the actual bound child.

**Verification Commands:**

```sh
npx vitest run tests/contracts/admission.test.ts tests/contracts/input.test.ts tests/contracts/leases.test.ts tests/contracts/config.test.ts tests/contracts/build-info.test.ts
npm run test:slow
npm run typecheck
```

### Task 3: Stream grounded typed answers through Claude and the retrieval HTTP service

#### Story Intent

- **Beneficiary:** developer learning BFF aggregation and tool execution
- **Capability:** ask typed project or general questions and observe normalized streamed answers from validated provider and retrieval calls
- **Need:** tool IDs, provider pauses and request-scoped search limits can be lost during multi-round orchestration
- **Value or failure prevented:** grounded project cards and citations remain attributable while infinite loops, search-budget overruns and hidden replays are prevented

#### Files

Create `apps/web/server/providers/contracts.ts`, `apps/web/server/providers/claude.ts`, `apps/web/server/providers/mock.ts`, `apps/web/server/tools/lookup-projects.ts`, `apps/web/server/tools/retrieval-client.ts`, `apps/web/server/turns/run-turn.ts`, `apps/web/shared/sse.ts`, `apps/web/server/http/sse-response.ts`, `apps/web/app/api/turn/route.ts`, `tests/helpers/scripted-providers.ts`, `tests/integration/typed-turn.test.ts`, `tests/contracts/search-budget.test.ts`, `tests/contracts/sse.test.ts`, `tests/slow/disconnect.test.ts`. Modify runtime/capabilities from Task 2.

**Interfaces:** `ModelAdapter.runRound(input: ModelRoundInput, signal: AbortSignal): AsyncIterable<ModelEvent>`; `ModelRoundInput = { messages: Anthropic.MessageParam[]; searchRemaining: number; searchEnabled: boolean; maxTokens:1024 }`; native SDK message/block types are server-only. `ModelEvent` is `{type:'text';text:string}` or `{type:'sources';sources:Source[]}` or `{type:'round';message:Anthropic.Message;searchUses:number|null;usage?:Usage}`. `runTurn(input:TurnInput, deps:TurnDeps, signal:AbortSignal): AsyncIterable<TurnEvent>`; `TurnDeps` has `model:ModelAdapter`, `lookup:(name:string|undefined,signal:AbortSignal)=>Promise<ProjectCatalog>`, `transcribe:(wav:Uint8Array,signal:AbortSignal)=>Promise<string>`, `mode:'live'|'mock'`, `capabilities:Capabilities`. Task 5 implements live transcription; typed tests supply a function that throws if called. `encodeSse(event:TurnEvent):Uint8Array`; `decodeSse(bytes:AsyncIterable<Uint8Array>):AsyncIterable<TurnEvent>` validates envelope/data/sequence and incremental UTF-8/framing.

- [ ] Create scripted mock adapters whose rounds emit supplied text/source/final native messages, record input/signals and can await a deferred promise. They label mode mock and never perform external calls. Start the actual Fastify app on an ephemeral loopback port in the typed integration test; the BFF's retrieval client calls it over HTTP, not a fixture import.
- [ ] Write a failing test with first round native `tool_use` ID `tool-atlas-1`, input `{name:'Atlas'}`, second round `end_turn` answer and actual token usage; assert the exact matching `tool_result` arrives in the next user message, cards equal validated HTTP results and text/usage complete once. Invalid/unknown/additional-property tool arguments cause zero service calls and a native `is_error:true` tool result; execution attempts count against the four-tool cap. Tool names/arguments cannot choose URL/headers or alter the prompt.

```ts
it('preserves custom tool identity and HTTP retrieval provenance', async () => {
  const model = new ScriptedModel([
    nativeRound({ stop: 'tool_use', tool: { id:'tool-atlas-1', name:'lookup_projects', input:{name:'Atlas'} } }),
    nativeRound({ stop: 'end_turn', text:'Atlas is active, owned by North, with 3 open items.' })
  ]);
  const events = await collect(runTurn({ turnId: crypto.randomUUID(), history: [], kind:'text', text:'What is the status of Atlas?' }, deps(model, retrievalUrl), new AbortController().signal));
  expect(model.inputs[1].messages.at(-1)?.content).toContainEqual(expect.objectContaining({ type:'tool_result', tool_use_id:'tool-atlas-1', is_error:false }));
  expect(events.find(e=>e.type==='tool.completed')?.data).toEqual({ result: atlasCatalog });
  expect(events.at(-1)).toMatchObject({ type:'turn.completed', data:{ status:'complete' } });
});
```

`ScriptedModel`, `nativeRound`, `collect`, `deps` and `atlasCatalog` are implemented in `tests/helpers/scripted-providers.ts`: `nativeRound` creates an Anthropic.Message with complete native blocks/stop reason/usage; `collect` drains an async iterable; `deps` builds a real `createRetrievalClient(retrievalUrl)` and no-call transcription; `atlasCatalog` is the exact Task 1 Atlas wire record. Export them for later test files; do not add production fallback imports.

- [ ] Implement official streaming Messages SDK with `new Anthropic({ apiKey, maxRetries:0 })`, server-controlled model/tools/system and request `signal`. Prompt concisely: synthetic project facts must use `lookup_projects`; general conversation need not. Read streaming text/citations safely, retain the final native Message and all server tool/results unchanged, accumulate actual usage across rounds. Do not emit thinking or raw blocks. Retrieval uses configured validated loopback HTTP origin, fixed `/v1/projects`, URLSearchParams for `name`, `redirect:'error'`, five-second composite deadline and validated response schema; unavailable/malformed response fails visibly with no local-fixture substitution.
- [ ] Define exact display-text joining in run-turn.ts: one accumulator appends each answer.delta exactly once; turn.completed.text is exactly their concatenation. Within a round concatenate provider text blocks without invented separators; citation metadata remains in sources events. Before the first nonempty text of a later round, if prior text exists and does not end in whitespace, emit a separate answer.delta containing `\n\n`, then that round's text. Emit no separator when prior text already ends in whitespace. Include every emitted separator in display/history/speech; never append final native Message text a second time.
- [ ] Add typed integration with round-one preamble plus tool_use, round-two Atlas answer and a search round with several cited blocks. Assert final text equals joined deltas, the separator is emitted at the exact round boundary and citations remain actual metadata. Export the same recorded preamble/separator/answer delta sequence as `multiRoundDeltaFixture:readonly string[]` from tests/helpers/scripted-providers.ts for the later Task 4 UI/history and Task 6 speech tests; those components are not prerequisites of Task 3.
- [ ] Implement the explicit loop. Three calls maximum; append returned assistant blocks unchanged, return all matching custom tool results as user blocks, increment custom execution count before each dispatch, allow at most four. If a response requests more custom calls than remaining, end truncated without any continuation or partially matched tool_result message. Exactly four completed executions may still be followed by a remaining round that answers with all matching results; another requested execution truncates. Test excess multi-call batch, exact-four followed by answer, and exact-four followed by another request. `end_turn` alone completes; `max_tokens` or exhausted round/tool budget ends `truncated` with visible limit reason; unknown/refusal stops are visible failure, never automatic completion. `pause_turn` continues with the exact assistant message only while budget/deadline allow. Any interruption/disconnect produces no history-ready completion.

```ts
let searchRemaining = 2;
// After each final round, validate usage/event accounting before another call.
searchRemaining = round.searchUses === null ? 0 : Math.max(0, searchRemaining - round.searchUses);
// Only include hosted search when enabled AND searchRemaining > 0:
const searchTool = { type:'web_search_20250305' as const, name:'web_search', max_uses:searchRemaining };
// Exhaustion omits that tool; never send a guessed zero-use definition.
// Prior assistant content is retained unchanged in messages regardless of omission.
```

Within each round, count unique validated `server_tool_use` blocks named web_search and compare cumulative final `usage.server_tool_use.web_search_requests` when supplied; de-duplicate stream/final projections. If one source is absent but the other is authoritative, use the authoritative count; missing/contradictory/noninteger accounting is unverifiable and gives zero remaining. Attempted search beyond remaining or provider budget errors never replenish the budget. Token usage is cumulative final-per-round, not summing repeated cumulative stream updates.

- [ ] Write search tests for uses 1+1 across custom tools, pause consuming two, unknown count, inconsistent count, zero budget definition omitted, model support false/missing/error, configuration disabled, explicit tool/version/organization rejection and ambiguous upstream errors. Explicit rejection changes process capability to unavailable and that turn fails `SEARCH_UNAVAILABLE` without replay; a later ordinary/project question omits search and works. Capability true moves to configured/pending; only a successful live hosted-search event/result moves to verified. A mocked search never sets live account verified. If omitted-tool continuation is rejected, terminate partial/truncated with compatibility reason without a further request.
- [ ] Write SSE tests splitting every byte boundary of UTF-8, CRLF, multiline data, event terminators and final trailing frame; reject bad schema/turn/sequence, preserve append-only text. Incremental server `ReadableStream` encodes only normalized events with `text/event-stream`, `Cache-Control:no-cache, no-transform`, no buffering-by-completion. POST uses fetch-readable SSE, never EventSource.
- [ ] Connect transport: admission → bounded body/parse → lease → stream. The async producer owns the lease until runTurn upstream settles; reader cancellation/request signal aborts producer but cannot release early. Pre-stream errors return common JSON; after accepted stream starts, write one `turn.failed`, then close. A pre-aborted request invokes no paid work. Integration test observes first delta before a deliberately delayed final round completes; disconnect test proves no paid replay and retained slot ownership.
- [ ] Run typed integration/search/SSE/disconnect tests and typecheck; commit scoped task with its actual child issue. Verify no browser import can reach server provider modules.

**Verification Commands:**

```sh
npm run test:integration
npx vitest run tests/contracts/search-budget.test.ts tests/contracts/sse.test.ts
npm run test:slow
npm run typecheck
```

### Task 4: Give the typed conversation one safe UI and atomic completed history

#### Story Intent

- **Beneficiary:** person using typed fallback or inspecting a voice answer
- **Capability:** read current grounded answers and follow up using the last completed text context
- **Need:** late callbacks, incomplete turns and unsafe model links can corrupt visible answers or conversation context
- **Value or failure prevented:** stale responses cannot overwrite a new question and incomplete content cannot masquerade as established history

#### Files

Create `apps/web/client/turn-controller.ts`, `apps/web/client/turn-stream.ts`, `apps/web/client/history.ts`, `apps/web/components/Conversation.tsx`, `apps/web/components/Answer.tsx`, `apps/web/components/ProjectCard.tsx`, `apps/web/components/Details.tsx`, `apps/web/components/Capabilities.tsx`, `apps/web/app/globals.css`, `tests/ui/conversation.test.tsx`, `tests/contracts/history.test.ts`, `tests/contracts/turn-controller.test.ts`, `tests/contracts/links.test.tsx`, `tests/browser/typed.spec.ts`, `playwright.config.ts`. Modify page/layout.

**Interfaces:** `TurnToken={ generation:number; turnId:string }`; `TurnController.begin():TurnToken` increments and aborts old work; `current(token:TurnToken):boolean`; `attachAbort(token, controller):void`; `cancelCurrent(reason:string):void`; `apply(token,event):void` accepts validated matching events only. `HistoryStore.complete(token:TurnToken,user:string,text:string,status:TurnStatus):{ omitted:boolean }`; `messages():HistoryMessage[]` returns immutable whole pairs. `startTurn(token,input:{text?:string;wav?:Blob},history:HistoryMessage[],signal:AbortSignal):AsyncIterable<TurnEvent>`. The store receives an injected `isCurrent(token)` predicate. Visible timeline entries retain partial/status/speech status separately from history.

- [ ] Write red tests: submit Atlas then Beacon; late Atlas delta/card/completion ignored by current state/history. Duplicate/old event sequence cannot append text twice. A failed/truncated/interrupted/no-speech/pre-transcript turn adds neither history message. An oversize single completed pair is omitted even when older pairs remain; excessive retained history drops whole oldest pairs. A completion message mismatching accumulated final text is rejected as malformed instead of silently establishing different history. Completed text remains after output mute/speech failure/interruption. Nine messages, incorrect pairs and oversized inbound history reject server-side.
- [ ] Implement history as pairs; only a still-current `complete` terminal event commits recognized user and final display text atomically. Drop whole oldest pairs until <=4 pairs and <=16,000 chars; omit an oversized newest pair and visibly announce context omission. Refresh clears in-memory store.

```ts
function retainPairs(input: ReadonlyArray<readonly [HistoryMessage, HistoryMessage]>) {
  const pairs: Array<[HistoryMessage,HistoryMessage]> = input.map(p=>[{...p[0]},{...p[1]}]);
  const size = (p: [HistoryMessage,HistoryMessage]) => p[0].content.length+p[1].content.length;
  if (pairs.length && size(pairs[pairs.length-1]) > 16000) return { pairs:pairs.slice(0,-1), omitted:true };
  while (pairs.length > 4 || pairs.reduce((n,p)=>n+size(p),0)>16000) pairs.shift();
  return { pairs, omitted:false };
}
```

- [ ] In conversation/history tests replay Task 3 multiRoundDeltaFixture through the Task 4 event consumer; assert the paragraph separator renders and the complete final text commits as one atomic history pair. These assertions are owned here because UI/history are delivered by this task.
- [ ] Write safe-link tests for `javascript:`, `data:`, relative URLs, malformed strings, credential-like invalid URLs and valid HTTP(S); invalid references remain readable plain text with no clickable anchor. Use react-markdown with raw HTML disabled and a URL transformer plus custom anchor renderer; project cards consume only validated `tool.completed.result`.

```ts
export function safeUrl(value: string): string | null {
  try { const u=new URL(value); return u.protocol==='https:'||u.protocol==='http:' ? u.href : null; }
  catch { return null; }
}
// Anchor: safeUrl(href) ? <a href={url} target="_blank" rel="noopener noreferrer">children</a> : <span>children</span>.
// Source cards apply the same parser. Do not enable rehype-raw.
```

- [ ] Implement one Client Conversation beneath a Server page shell: typed field, Start/Stop, microphone/output mute, current Ready/Listening/Working/Speaking/Busy/Error status, answer timeline, source/project cards, capability mode/reasons. Transcript/details and normalized request trace use collapsed `<details>`. Never show raw model reasoning/events or credentials. Typed submit interrupts directly, starts same `/api/turn`, and later Task 6 attaches enabled speech.
- [ ] Run npm run test:browser:install after npm ci before the first browser suite; it installs the Chromium revision tied to pinned Playwright. Browser mock test starts both apps via Playwright webServer, asserts visible Mock/Simulation, real HTTP project retrieval, append text before completion, collapsed details and deliberate Busy recovery. No automatic reconnect/replay after network close. Include clear no-speech, rate-limit, transcription, retrieval and speech-specific reason text; speech failures retain answer text.
- [ ] Run UI/history/controller/link tests and browser typed test; verify accessibility labels/live status and no duplicated fetch from React effects. Commit scoped task under actual child.

**Verification Commands:**

```sh
npm test
npx vitest run tests/contracts/history.test.ts tests/contracts/turn-controller.test.ts tests/contracts/links.test.tsx
npm run test:browser -- --grep typed
npm run typecheck
```

### Task 5: Connect bounded prerecorded transcription and streamed synthesis

#### Story Intent

- **Beneficiary:** person asking spoken questions and hearing answers
- **Capability:** use real server-side transcription and streamed speech while retaining a usable text answer on speech failure
- **Need:** provider errors, header formats and hidden SDK retries can turn bounded requests into invalid audio or duplicate paid work
- **Value or failure prevented:** voice is attributable to the selected provider and failed speech cannot destroy the text conversation

#### Files

Create `apps/web/server/providers/deepgram.ts`, `apps/web/app/api/speech/route.ts`, `tests/contracts/deepgram.test.ts`, `tests/integration/audio-turn.test.ts`, `tests/contracts/speech-endpoint.test.ts`. Modify mock/runtime/run-turn/capabilities.

**Interfaces:** `SpeechAdapter.transcribe(wav:Uint8Array,signal:AbortSignal):Promise<string>`; `SpeechAdapter.synthesize(input:SpeechInput,signal:AbortSignal):Promise<{stream:ReadableStream<Uint8Array>;format:{encoding:'pcm_s16le';sampleRate:24000;channels:1}}>`; `createDeepgramAdapter(config:ServerConfig, fetchImpl?:typeof fetch):SpeechAdapter`. Mock adapter returns deterministic text and chunked synthetic PCM, explicitly mock. `AppError`/leases/deadlines are Task 2 contracts.

- [ ] Add red SDK-boundary tests using controlled fetch responses: STT recognized text, empty text/no model call, malformed response, 429, canceled fetch and configured model. TTS first chunk becomes readable before deferred tail, exact query `encoding=linear16`, `sample_rate=24000`, `container=none`, and zero SDK retries after 429/502. HTTP-success JSON/error, missing body and unacceptable content type must fail before PCM starts.
- [ ] Implement pinned SDK with explicit apiKey and `maxRetries:0`; call STT with WAV Blob and configured model, validate `results.channels[0].alternatives[0].transcript`, trim empty speech without Claude work. Use documented raw response inspection for TTS and content type check; do not use arrayBuffer/blob on the complete synthesis response.

```ts
const client = new DeepgramClient({ apiKey: config.deepgramKey, maxRetries:0, fetch:fetchImpl });
const { data, rawResponse } = await client.speak.v1.audio.generate({
  text: input.text, model: config.ttsModel, encoding:'linear16', sample_rate:24000, container:'none'
}, { abortSignal:signal, maxRetries:0, timeoutInSeconds:Math.max(0.001,Math.min(config.speechTimeoutMs,deadlineRemainingMs(signal))/1000) }).withRawResponse();
const contentType = rawResponse.headers.get('content-type') ?? '';
if (!isExpectedPcmMime(contentType)) throw speechError;
const stream = data.stream();
if (!stream) throw speechError;
return { stream, format:{ encoding:'pcm_s16le', sampleRate:24000, channels:1 } };
```

`isExpectedPcmMime(value:string):boolean` is a pure helper in deepgram.ts: parse the exact case-insensitive media type `audio/l16`, reject malformed or duplicate parameter names, and reject any supplied `rate` other than `24000` or `channels` other than `1`. Absent rate/channels use the fixed requested contract; real PCM format is separately verified live. Never accept a mere prefix such as audio/l16evil. Controlled-fetch tests include contradictory rate/channel metadata, duplicate rate, malformed type, JSON and the documented valid type. `speechError` is `new AppError(502,'SPEECH_FAILED','Speech provider returned invalid audio.',input.turnId,false)`. Header inspection must use the actual `rawResponse` type from the pinned SDK; compile and test it, without coercing an incompatible header object. Import deadlineRemainingMs from Task 2. Test nondefault configured timeouts and smaller remaining turn deadlines in SDK options; fixed 20/60-second SDK values must not undercut configured bounds. Check error responses are JSON before audio starts. STT uses `listen.v1.media.transcribeFile(new Blob([wav],{type:'audio/wav'}),{model:config.sttModel},{abortSignal:signal,maxRetries:0,timeoutInSeconds:Math.max(0.001,Math.min(config.turnTimeoutMs,deadlineRemainingMs(signal))/1000)})` under the shared turn deadline.

- [ ] Write endpoint tests for pre-body Origin/Host rejection, JSON body cap, UUID/segmentId/nonempty text, hard120 and effective84 limits, missing capability, two active speech leases and third429. Apply an explicit 8 KiB measured JSON-body cap as an additional bounded transport implementation choice; all permitted <=120-character segments fit. Validate segment ID as a bounded nonempty string <=80 chars, never a provider configuration field. Effective duration estimate is `text.length / CPS <=6`.
- [ ] Adapt speech route to Node response streaming with `Content-Type:application/octet-stream`, `X-Audio-Encoding:pcm_s16le`, `X-Audio-Sample-Rate:24000`, `X-Audio-Channels:1`, no-store. Normalize provider metadata, never return credential-bearing headers. Keep lease until network/upstream reader settles; canceled response cancels provider stream and abort signal. A deadline/stream failure after bytes starts terminates stream; client displays speech-error reason and retains text. Before bytes, use common JSON/HTTP status.
- [ ] Integrate audio turn: emit transcribing stage and transcript when obtained; empty/no-speech ends nonfatal `turn.completed` status no-speech with no model request. Distinct transcript/rate-limit/retrieval/TTS errors remain visible. Run tests and commit scoped task.

**Verification Commands:**

```sh
npx vitest run tests/contracts/deepgram.test.ts tests/contracts/speech-endpoint.test.ts
npm run test:integration
npm run typecheck
```

### Task 6: Speak stable text early with PCM accounting and request backpressure

#### Story Intent

- **Beneficiary:** person listening to a generated answer
- **Capability:** hear sentences in order before the answer finishes while ordinary long answers drain safely
- **Need:** fast synthesis and a suspended playback clock can accumulate generated audio beyond the playback budget
- **Value or failure prevented:** normal answers remain audible while overflow, stalls and incorrect sample handling cannot create unbounded speech backlog

#### Files

Create `apps/web/client/voice/pcm.ts`, `apps/web/client/voice/playback.ts`, `apps/web/client/voice/speech-text.ts`, `apps/web/client/voice/speech-queue.ts`, `tests/voice/pcm.test.ts`, `tests/voice/playback.test.ts`, `tests/voice/speech-queue.test.ts`, `tests/voice/speech-text.test.ts`, `tests/slow/playback-watchdog.test.ts`. Modify Conversation/controller to attach text/speech status.

**Interfaces:** `PcmDecoder.push(bytes:Uint8Array):Float32Array`, `finish():void`; `Playback.enqueue(token:TurnToken,samples:Float32Array):void`, `outstandingSeconds():number`, `isRunning():boolean`, `suspend():Promise<void>`, `resume():Promise<void>`, `ensureRunning(token:TurnToken):Promise<void>`, `resetAfterCancel():Promise<void>`, `cancel(token:TurnToken):void`, `dispose():Promise<void>`; playback takes dedicated AudioContext and `isCurrent`. `SpeechText.push(delta:string):string[]`, `finish():string[]`; `SpeechQueue.accept(token,text):void`, `flush(token):void`, `setTentative(token,value:boolean):void`, `cancel(token,reason:string):void`, `dispose():void`. Queue dependencies include `synthesize` fetch function, playback, capability segment cap, `isCurrent`, status callback and monotonic wall clock.

- [ ] Write red PCM tests for split samples, negative/positive extrema, odd final byte, arbitrary chunks and AudioContext at 48 kHz. Explicitly create Web Audio buffers at 24 kHz; device context resampling must not alter source-duration accounting.

```ts
it('keeps a half sample across chunks and uses signed little endian', () => {
  const d=new PcmDecoder();
  expect([...d.push(Uint8Array.of(0))]).toEqual([]);
  expect([...d.push(Uint8Array.of(128,255,127))]).toEqual([-1,32767/32768]);
  d.finish();
});
```

- [ ] Implement decoder with one pending byte, `DataView.getInt16(offset,true)/32768`, invalid dangling byte error. Playback retains all source handles and exact start/end times, schedules `start(max(context.currentTime+smallLead,nextEnd))`, and sums generated-but-unplayed PCM once. Pending PCM ledger entries transfer to scheduled entries; they are not removed from the outstanding total by scheduling. Completed sources prune only when actual audio-clock progress passes their ends.

```ts
const scheduledRemaining = sources.reduce((sum,s) =>
  sum + Math.max(0,s.end-Math.max(context.currentTime,s.start)), 0);
const outstanding = scheduledRemaining + unscheduledSamples/24000;
// Before adding samples, check outstanding + samples.length/24000 <=10.
// Keep source handles until ended/cancel; stop every source for canceled token.
```

- [ ] Write text segmentation tests for decimals `3.5`, abbreviations `Dr.` and `U.S.`, URLs, split citations/Markdown links/code delimiters and final fragments. For each complete representative input, compare unsplit parsing with every two-way character split and with one-character chunks; concatenate `push` output and `finish` output and require identical sanitized segments. Before the suffix arrives, pushes ending in `The value is 3.`, `https://example.`, `Dr.`, an open citation/link or partial code delimiter must emit no irreversible segment from that ambiguous token. Assert an unambiguous completed sentence followed by more answer text emits before model completion; specifically `push('Hello. Next')` must emit the eligible first sentence before `finish()`. Also assert the literal scanner whitespace predicate is true for an ordinary space.
- [ ] Replay Task 3 multiRoundDeltaFixture in speech-text.test.ts with its final model completion held pending; the preamble plus emitted separator must yield an eligible speech sentence before the later answer completes. This assertion belongs to Task 6, which owns SpeechText.
- [ ] Implement `SpeechText` as an incremental buffer/scanner. A delta/network chunk boundary is never an end-of-sentence signal. In `push`, hold trailing punctuation until actual following whitespace is received and lexical state proves it is outside a decimal, known abbreviation, URL, citation, Markdown link or code span/fence; hold partial delimiter runs and incomplete structured tokens until closed or `finish`. URL/citation removal operates on complete tokens, never partial prefixes. Preserve ordinary numeric text and perform safe word splits only on stable sanitized sentences. No second LLM is used.

```ts
// Inside SpeechText's scanner, buffer includes ALL retained uncommitted chunks.
const hasRightContext = i + 1 < buffer.length && /\s/u.test(buffer[i + 1]);
// Sentence emission additionally requires closed lexical state and the
// decimal/abbreviation/URL/citation/Markdown exceptions above.
// i === buffer.length - 1 is provisional in push, even if it is punctuation.
```

- [ ] Reserve true answer-end flushing for `finish()` called once on an allowed complete/truncated terminal event. A dangling URL/link/citation/code token is sanitized conservatively at finish; failed/interrupted turns cancel unsent speech instead. Stable sentences split immediately at word boundaries <=effective cap; one overlong token is omitted with a visible reason. The 2,400-character backlog bound includes raw uncommitted scanner text plus sanitized unsent queue text, counted once, so partial tokens cannot bypass the bound. Preserve displayed text unchanged.
- [ ] Write fast-producer test with synthetic multi-sentence answer shorter than backlog cap: first speech starts before model complete, only one request active, active body drained promptly, no next request until audio <=2 seconds/running/not tentative, and every admitted sentence eventually plays without overflow cutoff. Reject extra bytes immediately if actual active response exceeds ten seconds, cancel all scheduled/unscheduled PCM, clear text, abort synthesis, disable remaining speech and preserve model text.
- [ ] Create/resume the dedicated playback context directly in the typed-submit user gesture as well as Start conversation, so typed fallback speaks when output is enabled even before microphone conversation mode starts. Reuse the same playback instance per mounted conversation and clean it on Stop/unmount; permission/capture is unnecessary for a typed answer.
- [ ] Implement a pump awakened by text arrival, stream completion, playback progress/resume and tentative clear. Long answers remain queued as text. Do not pause an active network body waiting for playback. Default six-second estimate admission at <=2 seconds leaves safety margin; actual PCM emergency check still governs. Pending-text overflow clears unsent text and disables future speech, but already generated audio can finish (unlike audio oversize/stall teardown).
- [ ] Add wall-clock watchdog: while audio outstanding and unexpected context suspension lasts >3 seconds, complete emergency teardown with `PLAYBACK_STALLED`; frozen audio clock never releases budget. A short tentative VAD suspension can resume before watchdog; intentional Stop/output mute/confirmed interruption cancels speech directly and is excluded from stalled detection. After emergency teardown reset the empty context for a later answer; disabling the failed answer's speech does not disable the next generation. Before first admission with no tentative pause/output mute, SpeechQueue calls playback.ensureRunning(currentToken). Serialize suspend/resume and await pending suspend before recovery. If resume rejects or stays suspended beyond two wall-clock seconds, disable that answer's speech with visible SPEECH_RESUME_FAILED and retain text, even with zero audio outstanding; never wait silently forever. Clear every timer on dispose, use generation guards on fetch bytes/playback callbacks.
- [ ] Run voice/watchdog/typecheck tests, inspect ledger maximum and played/queued durations in test assertions, commit scoped task.

**Verification Commands:**

```sh
npm run test:voice
npm run test:slow
npm run typecheck
```

### Task 7: Capture automatic bounded utterances without resource leaks

#### Story Intent

- **Beneficiary:** person asking hands-free questions
- **Capability:** start once, speak naturally and automatically submit completed utterances without transcript approval
- **Need:** VAD assets, browser permission and asynchronous startup can clip speech, duplicate sessions or leave the microphone active after Stop
- **Value or failure prevented:** natural turns remain automatic and microphone/audio resources end when requested

#### Files

Create `apps/web/client/voice/wav.ts`, `apps/web/client/voice/vad-adapter.ts`, `apps/web/client/voice/capture-session.ts`, `scripts/copy-vad-assets.mjs`, `patches/@ricky0123+vad-web+0.0.31.patch`, `tests/voice/wav.test.ts`, `tests/voice/capture-session.test.ts`, `tests/voice/vad-lifecycle.test.ts`, `tests/contracts/assets.test.ts`, `tests/browser/capture.spec.ts`. Modify Conversation, root package/lock, web scripts and mock browser harness. Pin root devDependency `patch-package` 8.0.1 and root `postinstall` to `patch-package --error-on-fail`; this is application dependency maintenance, with no change to global peer-review tooling.

**Interfaces:** `encodeWav(samples:Float32Array):Blob` produces Task 2 WAV contract; `CaptureToken={ epoch:number; utteranceId:number; intentVersion:number }`; `VadCallbacks={ rawStart(capture:CaptureToken):void; confirmedStart(capture:CaptureToken):void; misfire(capture:CaptureToken):void; end(capture:CaptureToken,samples:Float32Array):void; frame(samples:Float32Array):void }`; `createVad(context:AudioContext,acquireStream:()=>Promise<MediaStream>,stopStream:(stream:MediaStream)=>Promise<void>,callbacks:VadCallbacks):Promise<{start():Promise<void>;pause():Promise<void>;destroy():Promise<void>}>`. `CaptureSession.start():Promise<void>`, `mute():Promise<void>`, `unmute():Promise<void>`, `stop():Promise<void>` owns one session epoch, stream, capture context/VAD and pending start promise. Playback is the distinct Task 6 context.

- [ ] Write WAV tests for clipped normalized floats, extrema/little endian/header sizes/sample rate and 30-second cap. Encoder writes RIFF44 bytes+sampleCount*2 with mono PCM16/16000 and clips [-1,1]. Reject empty/excess samples on client with a visible nonfatal status, rather than sending garbage.

```ts
const clipped=Math.max(-1,Math.min(1,sample));
view.setInt16(44+i*2,clipped<0?Math.round(clipped*32768):Math.round(clipped*32767),true);
// Header: RIFF length 36+2*n; WAVE/fmt(16)/PCM1/channels1/rate16000/
// byteRate32000/blockAlign2/bits16/data length2*n.
```

- [ ] Resolve the pinned-library cleanup gap explicitly with the checked-in narrow patch `patches/@ricky0123+vad-web+0.0.31.patch`. The app imports the package module entry `dist/index.js`, whose MicVAD implementation is `dist/real-time-vad.js`; it does not import the unpatched CDN bundle. Patch only lifecycle disposal, cancellation guards during asynchronous start, and in-flight frame accounting in that implementation. A clean `npm ci` must apply the patch with `--error-on-fail`; altered/missing upstream context fails setup instead of silently dropping the fix. Record upstream version/git head, patch SHA-256 and modified package-file digest in the VAD asset manifest/README and the typed Task 9 vadPatch provenance. Add a public static `MicVAD.lifecyclePatchRevision='aivc-vad-lifecycle-v1'` marker and matching public declaration in `dist/real-time-vad.d.ts` to this same checked-in patch; the adapter asserts it on the imported module before capture and records it in diagnostics. Marker presence is one check, never a substitute for digest comparison.
- [ ] Make the patched public `destroy()` safe for allocated-but-never-started, partial-start and fully started instances. Cache one disposal promise; mark destroyed and block new start/frame work first, stop already acquired tracks immediately through the adapter-owned pauseStream hook, and retain pending-start/frame promises. Add destroyed-state checks after each awaited stream/worklet initialization and immediately before media-node connection or setting listening; a canceled pending start cannot activate listening. Destroy awaits pending initialization and admitted frame work, then clears worklet message handlers/notifies stop, disconnects whichever nodes exist and releases every late acquired stream/node before model release (late streams use pauseStream so owner stop accounting stays idempotent). Use guarded cleanup with `finally` so absent nodes or a node-cleanup error cannot skip `model.release()`. Call release once; the pinned Silero release reaches its ORT session release plus state/sample-rate tensor disposal. Close only a package-owned context; the adapter always closes its caller-owned capture context. Cleanup errors remain visible, never counted as successful release. The patch preserves speech thresholds, model inference, sample rate and ordinary successful callback semantics, and the adapter never reaches into private model fields.
- [ ] Add `vad-lifecycle.test.ts` against the actual patched MicVAD module, with controlled model factory/ORT session and browser-node boundaries. Exercise model creation resolving after Stop before start, worklet addModule rejecting after model allocation, a pending successful worklet load canceled by Stop, a normal initialized destroy and two concurrent destroys. Instrument model release and its session/tensor release path, not merely a mock adapter destroy method. Assert exactly one release, stopped tracks/disconnected nodes/closed caller context, no post-cancel listening/submission, and a successful fresh Start. Hold a frame inference promise during normal destroy and prove release waits for its settlement; new frames are rejected while disposing. Keep an independent browser smoke test using actual VAD/ORT assets.
- [ ] Copy pinned VAD worklet, `silero_vad_v5.onnx` and required ORT `.wasm`/`.mjs` files from the actual resolved dependency directories into `apps/web/public/vad/` and `/vad/ort/`. Use `createRequire.resolve` to find package roots; fail if required files absent, write a manifest with version/file SHA-256, and ignore copied assets while regenerating them in predev/prebuild. Never fetch CDN/latest assets during runtime. Set `baseAssetPath:'/vad/'`, `onnxWASMBasePath:'/vad/ort/'` and verify HTTP200/expected MIME in browser. Tests check manifest hashes and browser starts actual pinned VAD once; mocks alone cannot validate WASM assets.
- [ ] Implement adapter with the public API of the explicitly patched pinned package and caller-owned capture context. The adapter supplies immutable capture tokens to application callbacks: increment utteranceId at each raw start, snapshot epoch/intentVersion, then attach the same token to that utterance's real-start/misfire/end callbacks before any asynchronous work. Export `CaptureSession.invalidateIntent():void` to increment intentVersion and invalidate pending capture on typed submit/Stop/microphone mute/overlong discard. Session epoch changes on capture restart. Late callbacks carry their old snapshot and cannot acquire a new token. Use `startOnLoad:false`, `model:'v5'`, `processorType:'AudioWorklet'`, `redemptionMs:800`, `preSpeechPadMs:800`, `minSpeechMs:400`, initial thresholds .3/.25. Use pinned getStream for initial acquisition, pauseStream for the current paused stream and resumeStream for an initialized paused instance. Both acquisition hooks call adapter-owned acquireStream; never return a stopped fixed stream. Acquire explicit mono/echoCancellation/noiseSuppression/autoGainControl constraints, record every returned stream before use and stop/reject late results from an obsolete epoch. stopStream tracks stopped MediaStreamTracks in a WeakSet so pause, Stop and patched destroy stop each owned track once. Stop stops all recorded streams including failed/late acquisitions. `onSpeechRealStart` confirms during speech, never wait until `onSpeechEnd`.

```ts
const vad=await MicVAD.new({ audioContext:captureContext, startOnLoad:false,
  model:'v5',processorType:'AudioWorklet',baseAssetPath:'/vad/',onnxWASMBasePath:'/vad/ort/',
  redemptionMs:800,preSpeechPadMs:800,minSpeechMs:400,
  getStream:acquireStream,pauseStream:stopStream,resumeStream:async()=>acquireStream(),
  onSpeechStart:()=>callbacks.rawStart(beginCapture()),
  onSpeechRealStart:()=>callbacks.confirmedStart(currentCapture()),
  onVADMisfire:()=>callbacks.misfire(currentCapture()),
  onSpeechEnd:audio=>callbacks.end(currentCapture(),audio),
  onFrameProcessed:(_probs,frame)=>callbacks.frame(frame)
});
```

`beginCapture():CaptureToken` and `currentCapture():CaptureToken` are local adapter helpers implemented in vad-adapter.ts from the CaptureSession-owned epoch/intentVersion and adapter utterance counter; currentCapture returns the immutable raw-start snapshot, never a fresh current epoch. Ignore a callback if no raw-start snapshot exists. The adapter snapshots the token synchronously before dispatching a callback or promise.

- [ ] In the actual Start click create/resume both contexts synchronously before asynchronous permission/VAD initialization; request `channelCount:1`, `echoCancellation:true`, `noiseSuppression:true`, `autoGainControl:true` where supported. No effect starts capture/paid work. Session start is idempotent; Stop invalidates epoch/intent first, then awaits pending model/start promises and destroys every allocated VAD using the patched public destroy, even if start was never called or failed. If model creation resolves after Stop, destroy it immediately without calling start/getStream; never activate listening to make cleanup possible. If start was already pending, invoke the patched destroy immediately so it marks initialization canceled before awaiting settlement; the patched start guards prevent activation and destroy releases partial/late resources. If no VAD instance was allocated, release any acquired stream/context directly. Keep cleanup idempotent and observable across all paths.
- [ ] Track 16 kHz frame/sample length since raw start including pre-roll conservatively. At 30 seconds deliberately discard overlong utterance, pause/destroy/restart bounded VAD capture after resetting candidate, display duration notice and issue no turn. This prevents the VAD's internal utterance buffer from growing indefinitely; allow the user to speak again. Never just reject at speech end while keeping unbounded capture. Normal end emits WAV once automatically through same turn path, showing transcript only inside collapsed details; no approval action.
- [ ] Test permission denied, permission pending then Stop, VAD asset/load failure, start double-click, Strict Mode mount/unmount/remount, microphone mute/unmute, overlong continuous utterance and Stop during speech. Spies prove exactly one submission per valid end, zero on misfire/overlong/obsolete epoch, every acquired track stopped and contexts/nodes/VAD released. Add start→mute→unmute with a fresh second live stream and exact constraints, then Stop with each owned track stopped once. Overlong discard/restart must acquire another usable stream and automatically submit a subsequent normal utterance. Browser simulation uses synthetic audio explicitly; real microphone remains Task 9 evidence.
- [ ] Run WAV/capture/assets/browser tests and commit scoped task.

**Verification Commands:**

```sh
npm run assets:vad
npm run test:voice
npx vitest run tests/contracts/assets.test.ts tests/voice/vad-lifecycle.test.ts
npm run test:browser -- --grep capture
npm run typecheck
npm run build
```

### Task 8: Resolve tentative speech, confirmed interruption and async races

#### Story Intent

- **Beneficiary:** person interrupting an answer while still being heard
- **Capability:** pause output immediately on detected speech, recover from noise and replace the turn only after genuine speech confirmation
- **Need:** canceling on every raw VAD start loses slow work and misfires can resurrect obsolete audio after confirmation
- **Value or failure prevented:** ordinary noise causes no paid replay while genuine interruption prevents stale audio, cards and history from overtaking the new turn

#### Files

Create `apps/web/client/voice/interruption.ts`, `tests/voice/interruption.test.ts`, `tests/slow/rapid-interruption.test.ts`, `tests/browser/interruption.spec.ts`. Modify CaptureSession/controller/queue/Conversation to wire callbacks and mute/Stop behavior.

**Interfaces:** `Interruption.rawStart(capture:CaptureToken):void`, `confirmedStart(capture:CaptureToken):void`, `misfire(capture:CaptureToken):void`, `end(capture:CaptureToken,samples:Float32Array):void`, `cancel():void`. `Candidate={ capture:CaptureToken; answerToken:TurnToken|null; phase:'tentative'|'confirmed'|'consumed' }`; it separates captured-utterance ownership from the answer it may interrupt. `captureIsCurrent(capture):boolean` requires matching active CaptureSession epoch, intentVersion and utteranceId/active candidate identity. Tentative pause/restoration additionally require `answerToken !== null` and `controller.current(answerToken)`. Confirmed end admission uses capture ownership and confirmed/unconsumed phase only: the deliberate old-answer invalidation does not revoke its utterance. No-active-answer candidates have answerToken null and still confirm/end automatically. Raw start never launches a request.

- [ ] Write red tests with delayed playback suspend promises: raw start in Speaking retains handles/queue/generation, sets tentative admission pause and requests playback suspend; active model/lookup/small synthesis signals remain un-aborted. A misfire resumes retained audio and current Working slow lookup with zero new calls. If suspend resolves after misfire, resume only if that same tentative candidate/current token remains valid; if confirmation/new turn intervened, never restore old audio.
- [ ] Add the full red raw-start → real-start → old-answer invalidation → speech-end test: exactly one new turn submits even though controller.current(oldAnswerToken) is false. Repeat from initial Listening with no answerToken, and with typed submit, Stop, microphone mute, overlong discard or a newer raw-start candidate intervening between confirmation and end; the obsolete end submits zero. Duplicate end is consumed once. Output mute cancels output only and does not invalidate an otherwise valid capture.
- [ ] Implement two-phase ownership transitions. Raw start records a valid capture candidate with the current answer token or null. Confirmation requires captureIsCurrent and tentative phase; mark confirmed before canceling the old answer. If its answerToken is still current, invalidate/abort old model/lookup/speech and stop/clear old audio. Keep the confirmed capture candidate current so its later end remains admitted. Stop/clear every old-generation source before returning the context to running; restoring the context is distinct from restoring canceled audio. After pending suspend settles, resetAfterCancel resumes the empty dedicated context for the next generation, with visible speech-only failure on rejected/non-running resume. Capture stays active. A stale tentative candidate unable to restore still-current speech cancels its retained sources and resets the empty context; if a newer tentative candidate owns the pause, recovery waits for that newer candidate's resolution. Mic mute/overlong discard may resume retained audio only when its answer remains current; canceled generations are never restored. A typed submit, Stop, microphone mute, overlong discard, capture restart or newer candidate invalidates prior capture intent/identity independently of answer generation. Capture continues through genuine interruption; request submission waits for VAD speech end.

```ts
function commitCandidate(candidate: Candidate) {
  if (candidate.phase!=='tentative'||!captureIsCurrent(candidate.capture)) return;
  candidate.phase='confirmed';
  const old=candidate.answerToken;
  if (old && controller.current(old)) {
    controller.cancelCurrent('interrupted');
    queue.cancel(old,'interrupted');
    playback.cancel(old);
    void playback.resetAfterCancel().catch(showSpeechResumeFailure);
  }
}
function admitEnd(candidate: Candidate, capture: CaptureToken): boolean {
  if (candidate.phase!=='confirmed'||candidate.capture!==capture||!captureIsCurrent(capture)) return false;
  candidate.phase='consumed'; // Consume BEFORE beginning the new answer generation.
  return true;
}
```

`showSpeechResumeFailure(error:unknown):void` is the conversation-level speech-status callback for the currently active playback recovery transition; it is independent of the canceled answer token, so a failure immediately after interruption remains visible even before the next answer exists. Ignore obsolete transition failures after a newer recovery supersedes them. The next answer's ensureRunning reports any continuing failure against that current answer. Neither status path changes text/history. resetAfterCancel serializes with pending suspension and never starts old sources. `Candidate` is the exact shape above. Dependencies include controller, queue, playback and CaptureSession identity predicate; callbacks retain the same immutable CaptureToken object. On typed submit call CaptureSession.invalidateIntent(), cancel the candidate, then cancel/submit the answer directly. Misfire and delayed suspend/resume require the same tentative capture plus still-current answer; confirmed, consumed, stale or watchdog-canceled candidates cannot restore old audio. Output mute preserves capture/text/history. Microphone mute and Stop invalidate capture; Stop also invalidates answer generation, aborts work and releases capture/playback/timers.

- [ ] Add stale-callback tests for old transcript/delta/tool result/completion/speech byte/source-ended callback and old capture end; none may update the current card/text/playback/history. Completed old text already committed stays history with interrupted-speech marker. Partial/canceled text stays visible incomplete and contributes neither history message.
- [ ] Rapid-interruption test controls upstream settlement, fires three confirmed turns and verifies third rejects Busy while two old canceled-but-unsettled jobs still hold slots. There is no automatic 429 or paid replay. After settlement a deliberate new question works. Include all four upstream abort paths (model, STT, retrieval, TTS) and transport support limits.
- [ ] Test delayed suspend resolving before confirmation and after confirmation: Speaking→raw start→confirmation→end→new answer returns context to running and requests/schedules its first segment, with zero old-source playback. Repeat from Working/no audio, after PLAYBACK_STALLED teardown and after a newer candidate supersedes a tentative one. Test rejected resume and never-running recovery with visible failure. Browser interruption spec must prove Beacon schedules audio after voice barge-in, beyond receiving text.
- [ ] Browser test records `performance.now()` at rawStart and dedicated playback suspension resolution/audio state. Assert <=200 ms callback-to-reversible-silence in the tested local browser; record confirmation-to-abort separately. Synthetic browser timing is not physical acoustic latency. A false-start/misfire during Speaking and Working preserves respective old audio/slow lookup. A watchdog timeout tears speech down, so subsequent misfire cannot resume it.
- [ ] Verify headset/speaker tuning settings are exposed in diagnostics/evidence; do not mute listening for an entire answer. Persistent speaker self-triggering is an explicit failed/unverified live case handled by Task 9, not fixed by claiming echo cancellation constraints succeeded. Run tests and commit scoped task.

**Verification Commands:**

```sh
npm run test:voice
npm run test:slow
npm run test:browser -- --grep interruption
npm run typecheck
```

### Task 9: Prove live boundaries and publish a compact code-linked tutorial

#### Story Intent

- **Beneficiary:** developer reproducing or extending the reference application
- **Capability:** distinguish passing offline checks from measured live provider and browser behavior
- **Need:** mocked voice, configured search and a few timing trials cannot establish live acceptance or production performance
- **Value or failure prevented:** the developer can reproduce verified behavior without mistaking unavailable capabilities or unresolved echo for successful delivery

#### Files

Create `scripts/verify-live.mjs`, `scripts/verify-docs.mjs`, `tests/scripts/verify-live.test.ts`, `tests/scripts/verify-docs.test.ts`, `docs/specification.md`, `docs/architecture.md`, `docs/tutorial.md`, `docs/live-validation.md`, `docs/evidence/live-validation.json`, `.github/workflows/ci.yml`. Modify `README.md`, configuration example and relevant test files when live findings require fixes. Historical sealed review artifacts remain byte-identical and outside formatting mutation.

**Interfaces:** live JSON `schemaVersion:1`, `gitHead:string`, `sourceDigest:string`, `mode:'live'`, `nodeVersion:string`, `packages:Record<string,string>`, `providers:{claudeModel:string;sttModel:string;ttsModel:string}`, `vadPatch:{ packageVersion:'0.0.31'; upstreamGitHead:string; patchPath:'patches/@ricky0123+vad-web+0.0.31.patch'; patchDigest:string; modulePath:'node_modules/@ricky0123/vad-web/dist/real-time-vad.js'; appliedModuleDigest:string; observedLifecycleRevision:'aivc-vad-lifecycle-v1'; buildId:string; buildMode:'production' }`, `browser:{name:string;version:string;os:string}`, `cases:Array<{id:string;status:'pass'|'fail'|'unverified';observations:string;artifact:string|null}>`, `timings:Array<{scenario:string;sample:number;vadMs:number|null;sttMs:number|null;modelToolMs:number|null;ttsMs:number|null;bufferMs:number|null;speechEndToTextMs:number|null;speechEndToAudioMs:number|null;callbackToSilenceMs:number|null;confirmationToCancelMs:number|null;acousticOnsetToSilenceMs:number|null}>`, `usage:Usage[]`, `limitations:string[]`. No credentials, raw private audio or fabricated usage/costs. Each artifact path is repo-relative sanitized evidence, not a remote credential endpoint.

- [ ] Write verifier tests that reject missing files/schema, mock evidence, stale tested-source/model/package/browser binding, omitted cases, fail/unverified required acceptance, missing timing sample counts/method and speaker unresolved status. Reject missing/empty production build ID, development buildMode or development ID. Treat the random served production buildId as recorded provenance only: verify:live never reads current .next/BUILD_ID or requires ignored build output. Current sourceDigest, patchDigest, appliedModuleDigest and observed patch marker establish code/runtime binding. Test that an identical rebuild and a fresh checkout with no .next preserve a valid report, while source/patch/module changes still fail. Add focused regressions: a patch-only modification, missing patch, original unpatched installed MicVAD bytes, mismatched applied-module digest and absent/mismatched observed lifecycle marker cannot reuse a passing report; a documentation-only descendant commit with identical source/patch/module bytes remains valid. `verify:live` is **read-only evidence validation**, never launches paid calls or creates a passing report. It exits nonzero with explicit incomplete cases. Actual bounded provider/browser exercises are performed once deliberately by the implementer, followed by truthful evidence recording. Record tested `gitHead` plus SHA-256 over sorted paths/bytes for tracked `apps/`, `scripts/`, `patches/`, root package/lock/config files, excluding generated output and the evidence report itself. `verify:live` requires that source digest still matches and the tested head is an ancestor of current HEAD; later documentation-only commits do not invalidate tested code, while source/config/dependency edits do. `verify:live` also requires the recorded patch path to exist, compares patchDigest against current patch bytes and appliedModuleDigest against the actual resolved installed MicVAD module, and verifies the package version/upstream identifier and observed lifecycle marker. Missing/unapplied/mismatched modules fail rather than accepting an upstream version alone. Before each deliberate live run, use npm run build:clean from the verified applied module (clear stale .next output), then npm start to launch exactly two production processes and record production buildMode/buildId from Host-validated capabilities/build diagnostics plus the browser-observed patch marker. Evidence from npm run dev/next dev does not pass the live gate. The evidence records that the actual tested app imported the patched entry, and its build was made from the recorded installed-module bytes; an old server/bundle or CDN entry is not acceptable during the observed live run. Later rebuilds may have different random IDs without invalidating evidence when the tracked source/patch and installed-module digests still match. No deterministic generateBuildId is required. The listed npm run build check before verify:live is therefore safe, including in a fresh Test worktree without original ignored build artifacts. Package setup/digests, clean-build identity and observed module marker are jointly required. A current documentation-only commit may remain valid, but a patch-only edit or changed installed runtime may not reuse the report. It checks actual recorded package versions and browser combination; it does not infer the user's currently open browser. Allow unavailable hosted search only when reason and successful search-off lookup/conversation evidence are recorded; search live-success claims still require an actual event/citation.
- [ ] Copy the accepted spec to `docs/specification.md` byte-for-byte for transfer convenience; preserve original authority/provenance and verify SHA-256 equality. README provides Node switch, `npm ci`, copying sanitized env, server-only keys/models, `npm run assets:vad`, `npm run test:browser:install`, development `npm run dev`, production live `npm run build:clean` then `npm start`, localhost URL, all root checks, sample Atlas/Beacon/Cedar/general questions and restart behavior for repaired search capability. It records actual tested versions only after testing, labels default-model examples as configuration suggestions and explains Node API subscriptions/account setup.
- [ ] Write docs verifier with actual local-link/file checks, six tutorial subjects and script names against package.json including build:clean/start/test:browser:install and production build-id source, two-process ports/runtime, sanitized environment keys/defaults, mode/known-limits text and spec hash. Reject nonexistent tutorial source links and credential-looking literal examples; tests cover each failure. Do not enforce superficial word counts as documentation quality.
- [ ] Record live cases `L1` Atlas hands-free text/card/voice, `L2` owner follow-up from completed history, `L3` confirmed Beacon interruption plus short Speaking/Working misfire, `L4` normal multi-sentence voice/audio ledger/segment-duration tuning, `L5` optional transcript and typed fallback/mutes, `L6` actual hosted search and exhausted omitted-tool continuation including pause OR documented unavailable capability/search-off fallback, `L7` headset and speaker echo, `L8` Stop/unmount teardown. Additionally record successful real STT/TTS incremental bytes and actual local HTTP SSE delivery before completion. If a provider pause cannot be induced in modest tests, its live continuation case is unverified; do not infer it from ordinary continuation.
- [ ] Measure with browser `performance.now()` shared clock and request-correlated marks: acoustic/user end when available, VAD end, request start, transcript arrival, model/tool stage/delta, first stable speech enqueue, speech headers/first bytes, first scheduled/playback sample, rawStart/silence and confirmation/cancel. Server durations use their own monotonic spans, not subtracting unrelated clocks. At least three simple Atlas trials plus one public research and interruption/misfire trial document actual sample count; no percentile/SLA claim. Callback target <=200 ms and simple first-audio around three seconds are recorded as targets; failed measurements stay failed. Acoustic onset measurement may remain unverified with reason, never replaced by callback-only timing.
- [ ] Validate selected model's actual Models capability, account hosted-search result/citations, per-turn search usage and exact native omitted-tool/prior-block continuations. No retries to hide an already accepted call. If compatibility fails, record truncated fallback and limitation; it is not permission to exceed search budget. Reduce CPS if real voice segments repeatedly exceed the estimate; rerun segment/backlog acceptance against the new cap. Report speaker echo failure with headset workaround, leaving speaker acceptance fail/unverified.
- [ ] Implement offline CI on pinned Node24/npm11.9 with npm ci, then `npx --no-install playwright install --with-deps chromium`, assets generation, unit/contracts/integration/voice/slow/browser/typecheck/build/lint/format/docs. Browser binaries/Linux dependencies are installed separately from npm packages. Workflow/docs-verifier tests require install before test:browser; README local setup uses npm run test:browser:install and documents Linux dependencies where needed. CI has no provider secrets and sets `AIVC_MODE=mock`; `verify:live` is a separate human-run completion gate using recorded evidence, not CI mock success. Live keys missing means explicit unverified voice/search cases and prevents calling full voice baseline complete.
- [ ] Write architecture/tutorial with source links for React/client state, automatic capture, Route Handlers/events, Claude explicit tool loop, Fastify HTTP aggregation, Deepgram PCM, cancellation/budgets/failures and measurement. Extensions explain new boundaries (Responses adapter, alternative BFF, live STT/WebSockets/WebRTC, persistent research and scaling) without adding baseline dependencies.
- [ ] Run all commands in the verification matrix below at their required stage, record actual outputs/head and limitations, perform whole-branch review, commit documentation/evidence under actual child, integrate children's commits and run the exact epic-trail verifier under root #2 binding. Do not mark acceptance/DoD checkboxes or approve/close until the respective AITM evidence gates actually pass.

**Verification Commands:**

```sh
npm test
npm run test:contracts
npm run test:integration
npm run test:voice
npm run test:browser
npm run test:slow
npm run typecheck
npm run build
npm run lint
npm run format:check
npm run verify:docs
npm run verify:live
node scripts/task-tracker/verify-epic-trail.mjs
```

## Acceptance-to-evidence mapping

These are planned checks, not completed results. Cases reference the accepted spec's actual numbering.

| Spec case | Owner | Automated evidence | Required live/observed evidence |
|---|---|---|---|
| 1 Typed lookup/IDs/invalid args | 3 | `typed-turn.test.ts` | Actual Claude Atlas custom tool/result |
| 2 Exact fixtures/missing/malformed | 1 | `retrieval.test.ts` | Local service observable in trace |
| 3 Split SSE/UTF-8/PCM | 3,6 | `sse.test.ts`, `pcm.test.ts` | Incremental SSE and actual TTS bytes |
| 4 Stale turn exclusion | 4,8 | controller/interruption tests | Beacon confirmed interruption |
| 5 Automatic VAD end | 7 | capture/WAV/browser tests | Real mic L1 without transcript action |
| 6 Speech before model complete | 6 | fast queue/browser assertion | Correlated first-text/TTS/model-finish marks |
| 7 Distinct failures/text survives | 3,4,5 | UI/provider/error integration | Observed live limits recorded if encountered |
| 8 Strict Mode/Stop/unmount | 7,8 | capture/UI/browser lifecycle | L8 tracks/audio/requests stopped |
| 9 Origin/Host/pre-body | 2,5 | admission/speech endpoint spies | Local HTTP checks use explicit valid headers |
| 10 Backpressure/oversize/stall | 6 | PCM ledger/queue/watchdog | L4 real voice segment durations/backlog |
| 11 Shared search/pause budget | 3 | search-budget tests/fallback | L6 omitted-tool unchanged-block continuation including pause |
| 12 Misfire/confirmation/latency | 8 | slow lookup/late result/race tests | L3 callback/confirmation/acoustic method |
| 13 Search states/no replay | 3 | support/rejection/capability tests | Account success or explicit unavailable + search-off lookup |
| 14 Whole completed history | 4 | history tests incl oversize pair | L2 follow-up, complete text survives speech stop |
| 15 Real concurrency/safe links | 2,4,8 | lease/rapid interruption/link tests | Deliberate Busy recovery; no automatic retries |

## Verification command ownership and honest completion

| Epic VC | Command | Delivered by | Actual purpose and completion rule |
|---|---|---|---|
| 1 | `npm run test:integration` | 1 runner,3/5 suites | Real local Fastify HTTP plus scripted provider integration; no live-provider claim |
| 2 | `npm run test:contracts` | 1 runner,2/3/4/5/7 suites | Admission/body/WAV/history/search/schema/SSE/provider boundary tests |
| 3 | `npm run test:voice` | 1 runner,6/7/8 suites | Deterministic PCM/queue/VAD-controller/interruption checks |
| 4 | `npm run test:browser` | 4 config,4/7/8 suites | Desktop Chromium mock lifecycle/render/stream/audio behaviors; labels mock |
| 5 | `npm run typecheck` | 1 | Both workspace source and tests typecheck; no server modules in client imports |
| 6 | `npm run build` | 1 | Both pinned apps compile, VAD assets regenerate, no provider call during build |
| 7 | `npm run verify:live` | 9 | Read-only complete current actual live evidence; fail/unverified stays nonzero |
| 8 | `npm run verify:docs` | 9 | Real code links/setup/commands/spec provenance and limitations |
| 9 | `npm test` | 1/4/9 | UI/script unit tests, explicit nonempty selection |
| 10 | `npm run test:slow` | 1/2/3/6/8 | Bounded offline deadline/settlement/watchdog/disconnect tests |
| 11 | `npm run lint` | 1 | Explicit ESLint apps/tests/scripts, zero warnings |
| 12 | `npm run format:check` | 1/9 | Current owned source/docs; sealed history excluded from rewriting |
| 13 | `node scripts/task-tracker/verify-epic-trail.mjs` | 1 wrapper,9 final run | Genuine package verifier, active root issue binding and actual integrated child commits |

All root commands are defined by implementation Tasks 1 and 9; no absent script is waived or disguised as a pass. Final epic verifier needs the governed children created after plan review and their commits integrated, and fails without them. The task owner records execution results at Test; unchecked planning checkboxes are not evidence. No reviewer acceptance, live-provider success or production assurance is claimed in this draft.

## Planning self-review and review handoff

The author read the full spec, actual epic Scope/AC/VC contracts, AITM plan template and story-quality rule. Root intent and nine task intents use exactly four substantive fields; each names a distinct human/operational beneficiary, behavior, need and consequence grounded in that evidence. Semantic review checks stakeholder, capability, need, counterfactual value, source grounding, sibling distinctness and standalone readability; these are planning analysis, not Plan approval.

Coverage check: all architecture, automatic-turn, UI, provider/search, retrieval, HTTP, history, speech ledger, two-phase interruption, configuration, concurrency, live measurement and tutorial requirements have an owner and explicit verifier above. Type/interface names are consistent across adjacent tasks. The five review-focus failures each have a concrete owning test. No application tests or live acceptance were run while authoring this plan.

Next gate is root-owned draft inspection, governed issue linkage/deep-dive/estimate metadata and documentation commit. Then this genuine Sol 6.1/high author starts tracked #2 normal-commit manual SPR with a distinct native Astra/high reviewer, using `docs/peer-reviews/plan/voice-bff-reference-<review-id>/spr` as the package path template and authentic MCP handoff waits. The root supervises without impersonating either role. Following accepted/finalized SPR and all-collateral commit, the same author starts Claude Opus5.5/high XPR in the resolved same artifact group `xpr/` using the package launcher and same recorded reviewer session for resumes. These future review steps are not executed by writing the plan. Only sealed protocol decisions establish acceptance; any reported authority assurance limitation remains explicit.
