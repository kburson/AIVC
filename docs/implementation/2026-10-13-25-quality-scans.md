# Repository quality scans

Story: [AIVC #25](https://github.com/kburson/AIVC/issues/25).
Integration base: `codex/2-draft`.

The owner approved the bounded tooling design and selected strict policy B:
all current first-party Markdown must pass with zero findings. There is no
historical finding baseline. This change extends the existing Prettier and
ESLint setup and adds markdownlint and CI enforcement.

The scans include review collateral, specs, plans, root documentation and
repository guidance. TypeScript linting covers first-party `.ts`, `.tsx`,
`.mts` and `.cts` files at every directory depth. Generated output,
dependencies, vendor payloads and machine-local scratch are excluded.

Read-only scans preserve sealed review and accepted artifact bytes. Explicit
formatting fixes refuse protected evidence paths. Historical findings remain
failures until a governed new revision resolves them; scanner tests alone do
not prove that historical review evidence is clean.

Implementation and verification are in progress. No application merge,
accepted-review rewrite or issue closure is claimed by this checkpoint.
