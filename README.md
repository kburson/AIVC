# Voice BFF reference

A local reference application for automatic voice turns, grounded project answers,
and an inspectable React → Next.js BFF → Claude/Fastify/Deepgram boundary.
Atlas, Beacon and Cedar are synthetic fixtures. No private employer data is used.
The [accepted specification](docs/specification.md) preserves its original bytes;
[architecture](docs/architecture.md) and the [tutorial](docs/tutorial.md) link to
executable source. [Live validation](docs/live-validation.md) distinguishes actual
observations from Mock/Contract Simulation.

## Reproduce the workspace

Use a full-history checkout. Select the exact reproducible toolchain before
installation; the `packageManager` field does not install npm for you:

```sh
nvm install 26.8.1
nvm use 26.8.1
npm install --global npm@12.0.2
node --version
npm --version
node scripts/verify-toolchain.mjs
npm ci
cp apps/web/.env.example apps/web/.env.local
npm run assets:vad
npm run test:browser:install
```

An environment already running npm12.0.2 can skip its reinstall after checking it.
On Linux, install Chromium system dependencies with
`npx --no-install playwright install --with-deps chromium` before browser checks.
The application runtime floor is Node>=26; later majors are not tested merely
because they satisfy the floor. This workspace's baseline toolchain was observed
as Node26.8.1/npm12.0.2. Record actual application/provider/browser versions only
after exercising them; no Node LTS status is assumed.

## Configure server capabilities

Edit the ignored `apps/web/.env.local`, or export server-only values into the
launcher process. The root `.env` is not automatically loaded: Next runs with
`apps/web` as its project root. Never put provider keys in `NEXT_PUBLIC_*`, browser
code, a command argument, committed evidence, or a shared log. Paid API accounts
and API keys are required; consumer application subscriptions do not supply them.

The [sanitized example](apps/web/.env.example) declares every configuration name.
Supply `ANTHROPIC_API_KEY`, `CLAUDE_MODEL`, `DEEPGRAM_API_KEY`,
`DEEPGRAM_STT_MODEL` and `DEEPGRAM_TTS_MODEL` explicitly. Model IDs have no defaults.
Documentation-only candidate suggestions are `claude-sonnet-4-6`, `nova-3`, and
`aura-2-thalia-en`; actual account metadata and bounded application runs must
qualify a selected combination before it is described as tested.

Keep `RETRIEVAL_BASE_URL=http://127.0.0.1:3001`, exact comma-separated
`BFF_ALLOWED_ORIGINS` and `BFF_ALLOWED_HOSTS`, `SPEECH_CHARS_PER_SECOND=14`,
`TURN_TIMEOUT_MS=60000`, `RETRIEVAL_TIMEOUT_MS=5000`, and
`SPEECH_TIMEOUT_MS=20000` from the example unless deliberately testing a supported
configuration. Wildcards and forwarded-origin inference are rejected.
`CLAUDE_WEB_SEARCH=enabled` requests the pinned direct tool
`CLAUDE_WEB_SEARCH_TOOL_VERSION=web_search_20250305`; `disabled` leaves ordinary
conversation and project lookup available. Model support is separate from actual
account validation. Explicit rejection disables search for that process without
replaying the failed turn. Restart after account/configuration repair to recheck.

For offline development, set `AIVC_MODE=mock`. Its deterministic providers and
synthetic speech are visibly labeled Mock/Contract Simulation and do not establish
real transcription, generated voice, hosted search or physical-device behavior.

## Run locally

Development starts two application runtimes: Next on port3000 and the independent
Fastify retrieval service on port3001:

```sh
npm run dev
```

Open [the local app](http://127.0.0.1:3000). Click **Start conversation** once to
request the microphone and unlock the distinct capture/playback audio contexts.
Speak “What is the status of Atlas?” without touching the transcript, then “Who
owns it?”. Try Beacon, Cedar, a general explanation, and a current public research
question when search is available. Typed **Start** is the fallback; microphone
and output mutes are independent. **Stop** releases capture, playback and active
requests. Refresh clears in-memory history; only whole completed turns enter
follow-up context. Local HTTP clients must supply the admitted Origin/Host headers
for paid POST endpoints; capabilities GET validates Host before metadata.

Actual live acceptance uses production output built from the verified applied VAD
module, rather than `next dev`:

```sh
npm run build:clean
npm start
```

The launcher owns two application processes and stops the sibling when one exits.
The Host-validated capabilities response exposes the served production build ID.
Record that observed ID with patch/module digests; later read-only validation does
not depend on retaining ignored `.next` output or its random rebuilt ID.

## Verify

Move Playwright's generated last-run file into the excluded local output bucket;
this preserves its normal data without adding it to owned source formatting:

```sh
export PLAYWRIGHT_LAST_RUN_OUTPUT_FILE=.tmp/playwright-last-run.json
npm test
npm run test:contracts
npm run test:integration
npm run test:voice
npm run test:slow
npm run test:browser
npm run typecheck
npm run build
npm run lint
npm run format:check
npm run verify:docs
npm run verify:sealed-evidence
```

Offline CI sets `AIVC_MODE=mock` and runs the full declared matrix after separately
installing Chromium/Linux dependencies. It uses no provider secrets.
`npm run verify:live` is a separate read-only human-run completion gate over actual
recorded evidence; it makes no provider call and cannot create a passing report.
Default strict validation keeps missing, stale, failed or unverified required cases
nonpassing. Only the exact reviewed story11 disposition below can consume its
identified limitations and unchanged-component evidence. Root issue#2 also owns
`node scripts/task-tracker/verify-epic-trail.mjs`, checking the explicit candidate
ref before merge and actual integrated target afterward.
The child verifier explicitly targets epic2 so it cannot mistake #11 for an epic.

## Known limits and evidence

The baseline transcribes bounded completed WAV utterances; it is not continuous
streaming STT. Browser/provider/physical acceptance remains incomplete until
[the live record](docs/evidence/live-validation.json) contains actual qualified
observations. A headset workaround does not establish successful speaker echo
acceptance. Report unavailable hosted search with its reason and a demonstrated
search-off lookup; never imply that an ordinary answer used current sources.

Timing samples describe the tested conditions and counts, not production
percentiles or guarantees. Callback silence and physical acoustic interruption
latency are different measurements. Transport abort signals do not prove remote
provider work stopped or was free. Public deployment, authentication, persistent
history and scaling are outside this loopback reference baseline. Epic PR17 stays
draft until the owner's full acceptance and integration gates pass.

Story11's [accepted release amendment](docs/superpowers/specs/2026-10-15-11-live-acceptance-amendment-design.md)
keeps measured L4 fail/L6 unverified visible while accepting the6.60-second
limitation and deferring genuine provider-pause qualification. Its read-only
[disposition](docs/evidence/11-live-acceptance-disposition.json) qualifies only
recorded CPS12/cap72/Thalia and unchanged components; default CPS14 remains
unchanged. A limited release verdict is separate from whole-live measured success
and does not authorize merge. See [live validation](docs/live-validation.md#accepted-release-limitations-and-evidence-consumption).
