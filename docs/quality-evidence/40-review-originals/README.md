# Story 40 review originals and formatting views

The eleven `.txt` files in this directory preserve exact original Markdown bytes. The extension identifies lossless source evidence rather than a rendered Markdown view. No linter rules, exclusions or application code changed.

The [archive manifest](../2026-10-17-40-review-originals.json) maps every existing report path to its original file, immutable source commit, Git blob, SHA-256, byte length and current presentation-view SHA-256. It also records the previous view commit/hash for the three earlier SAR formatting views.

- Five SAR originals are pinned at `e6347619fb245ba506bf455d57a0672cf663260b`.
- Three specification XPR responses are pinned at `e6e96c9a4f07bb78faa73dc56368a0503d912982`.
- Three plan XPR responses are pinned at `80efe1a150dbd8605aab69678c2a7a87f8553072`.

Existing `.md` report paths remain readable presentation views. Their original links, findings, decisions, artifact/identity values and review references remain present. XPR protected metadata is displayed as literal text, preventing Markdown from interpreting protocol delimiters as headings. Standalone bold decisions have an explicit text label. Prettier changes layout only. Each view links both its lossless original and its immutable original Git URL.

Sealed manifests and journal receipts continue to bind the **original response hashes**, not presentation-view hashes. The accepted specification (`f50590006c4f5d22e94ed3e8539ed1d50f0af14755dd6720b175b7f9ea951e28`) and plan (`eb1b3ea30ab1096207790da09403833f9b4e077f3f1289d3579b08e7ba17a350`) are unchanged. No acceptance, review, authority assurance or implementation approval is added by formatting.

Verification checks all eleven original files against their pinned Git blobs and recorded hashes/lengths; checks each current view hash and retained references; matches all six sealed XPR response hashes against the original archives; confirms both accepted artifact hashes and unchanged manifests/journals; and runs the full Markdown scan. The existing historical evidence verifier remains a separate 122-document check and is not represented as automatically covering this new archive.

Verification completed: full Markdown scan **0 findings**; targeted Prettier **16 files, 0 findings**; all **11 original blobs**, **6 sealed XPR responses**, **2 accepted artifacts** and **20 retained/resolved references** verified. The separate historical verifier passed **122 documents**. Git whitespace checks passed.

Story #40 remains Plan. Application implementation remains stopped.
