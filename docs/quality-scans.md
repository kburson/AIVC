# Repository quality scans

Run checks from the repository root using the versions pinned by `package-lock.json`.
Install with `npm ci` under the Node/npm toolchain in `.nvmrc` and `package.json`.

| Command                                            | Purpose                                                                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `npm run lint:markdown`                            | Scan every first-party Markdown document, including review collateral, specs, plans and hidden repository guidance. |
| `npm run lint:typescript`                          | Lint first-party TypeScript across apps, services, shared packages, tests, scripts and root configs.                |
| `npm run format:check`                             | Read-only Prettier scan of all first-party supported source, configuration and Markdown.                            |
| `npm run quality:check`                            | Run all three scans even if an earlier check fails; return failure if any scan fails.                               |
| `npm run format:write -- path/to/file.ts notes.md` | Format only explicit ordinary files.                                                                                |

The inventory excludes dependencies, vendored payloads, Git internals, build
outputs, coverage and machine-local scratch/cache directories. It includes
`.ts`, `.tsx`, `.mts`, `.cts` and authored declaration files. Generated
`next-env.d.ts` and the generated dependency lockfile are excluded from formatting.
Web-only React/Next rules apply to `apps/web`; common TypeScript rules apply
at every level. Typechecking remains available separately through `npm run typecheck`.

The Markdown policy checks structural consistency with markdownlint's default
rules. Long technical lines are allowed, repeated headings are allowed under
different parents, and title-free fragments are allowed. HTML is limited to
`details`, `summary` and `br`. These are uniform content rules, not historical
file exclusions or findings baselines.

## Strict historical policy

The owner selected policy B in [story #25](https://github.com/kburson/AIVC/issues/25):
all current Markdown must pass with zero findings. There is no grandfathered
finding baseline, `continue-on-error`, or review/spec/plan scan exclusion.
GitHub Actions runs all checks independently and fails the applicable job.
A passing TypeScript check or unit suite does not imply clean Markdown.

Read-only checks leave evidence bytes unchanged. The explicit formatting writer
refuses every file under `docs/peer-reviews` and `docs/superpowers/specs` or
`docs/superpowers/plans`, and validates all targets before writing any file.
Correct accepted artifacts through a governed new revision with original
sealed evidence preserved and additive provenance. Historical acceptance hashes
must not be silently refreshed to match new formatting.

## Before sealing new review evidence

Run the Markdown and formatting checks before submitting or finalizing
review documents. Once sealed, fix findings through the review protocol or a
governed new revision. Never modify terminal reviewer responses or manifests
in place just to turn a scan green.
