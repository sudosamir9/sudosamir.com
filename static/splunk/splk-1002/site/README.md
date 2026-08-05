# Site build

An HTML renderer for the whole guide. The markdown is the single source of truth; nothing here edits it. This exists because 85,000 words of dense SPL reference reads better in a browser than in an editor, and because SPL needs to look different from prose and from configuration.

## Build

```bash
python3 site/build.py --all
```

That writes 43 pages plus four shared sidecar files. Open `site/index.html`, or from WSL run `explorer.exe site\index.html`. Everything works over `file://` with no server.

```bash
python3 site/build.py --all --check          # build, then print per-page counts
python3 site/build.py topics/07-macros.md    # rebuild one page
```

Requires `markdown-it-py`, which is already installed.

## What gets built

`manifest.py` declares all 43 pages. Nothing asks the filesystem what exists, so a single-page rebuild still links correctly to the other 42, and a cram sheet can never overwrite the topic page it shares a filename with. That last one was a real defect: `cram/01-transforming-commands.md` and `topics/01-transforming-commands.md` have the same stem, and the earlier flat output directory let the 2-block cram sheet replace the 17-block topic page with exit code 0.

Output mirrors the source tree, so the 166 markdown cross-links already in the guide stay correct under a plain `.md` to `.html` swap.

| Group | Pages |
|---|---|
| Start here | README, exam overview, lab setup, final review sheet |
| Sections | 11 topic pages, each paired with its cram sheet |
| Reference | 11 files, including the 292-row trap inventory and the 154-link docs index |
| Practice and sources | 6 files, drill instructions through to the Apress errata |

## What it does

**SPL renders as a Splunk search bar.** Every ` ```spl ` fence becomes a bordered panel with a search icon, a time-range pill, and a copy button. The copy button lifts the plain text, not the highlighting markup, and falls back to a hidden textarea because `file://` has no async clipboard.

**SPL is syntax-highlighted at build time** by `spl_lexer.py`, a hand-rolled tokenizer. No JavaScript runs at read time and it works offline. Token classes match the exam vocabulary rather than a generic code theme: commands green, functions indigo, clause keywords (`BY`, `OVER`, `AS`) slate, strings rust, numbers teal, and the pipe itself picked out in indigo. Time modifiers are one token, so `-24h@h` does not split into a number and a field.

**Traps get their own treatment.** A paragraph starting with a bold trap id becomes an amber-ruled callout with the id as a badge.

**Result tables look like Splunk's Statistics tab.** Put `<!-- results -->` on its own line immediately before a markdown table and it renders with a green header row, white type, zebra striping and ruled cells. Numeric columns are right-aligned, which differs from Splunk and is easier to read.

Ordinary tables wrap. Tables wider than five columns scroll horizontally inside their own container with a sticky header row, because forcing a 17-column CIM table to fit the prose measure makes it unreadable. The page body never scrolls sideways.

**Cross-page search.** A build-time index over every heading, every trap id and wrong-belief line, and every SPL command used anywhere in the guide, 183 KB, loaded as a plain script because `fetch` is blocked at the file origin. Press `/` from anywhere. Terms are matched as AND, results are ranked and then capped, and they are grouped by page.

**Mermaid renders client-side** from a CDN. If the CDN is unreachable the same element stays as readable monospace diagram source, so nothing is lost offline. It is loaded by a classic script that dynamic-imports the module: external ES modules are blocked at the `file://` origin by the same rule that blocks `fetch`, so `<script type="module" src>` silently does nothing from disk.

**Three columns, like the Splunk docs.** Left is the full guide tree in four collapsible groups, with the blueprint number and exam weight on each section row and a Study / Cram control on each topic page. Middle is the content. Right is "On this page", generated from the headings with scrollspy, with a per-section reading estimate.

**Prose is never wrapped to a measure.** Paragraphs, lists, headings and callouts fill the content column exactly as tables, SPL panels and diagrams do, so a line breaks where the window ends and nowhere else. This is the repository's no-hard-wrap rule applied to the rendered page; see `CLAUDE.md`. The shell has a 2100px ceiling, which does nothing at 1080p or 1440p and only stops lines running the full width of an ultrawide display.

Reading estimates sum to the total shown beneath them. Words before the first heading fold into the first section rather than vanishing, and the total is the sum of the displayed figures rather than an independent calculation, so the rail cannot say 43 minutes above a column adding to 42.

Also: breadcrumbs, a version badge, previous and next links, a reading-progress bar, hover anchors on headings, a link to the markdown source of every page, light and dark themes with the choice remembered, a skip link, visible focus rings, reduced motion respected, and a print stylesheet that drops both rails and resets the palette. Below 1320px the right rail goes first, since the guide tree is more useful than the page outline when space is tight; below 1020px both rails collapse above the content.

## Exam simulator

`site/exam/` is a second app on the same data: 106 fact-checked questions, two modes, no server.

**Practice** shows one question at a time. Submitting reveals the verified answer, the course's explanation, every exam trap the question bites with its wrong belief and correct fact, the per-option reasoning where the course supplied it, the documented corrections where the course's own explanation is wrong, the fact-check verdict, the documentation links, and a link into the topic file that teaches it. Pools: everything, not yet seen, previously missed, flagged, any of the five original Udemy tests, or any single blueprint section.

**Mock exam** is 65 questions in 60 minutes with a countdown, a question navigator, flagging, and no feedback until submission. The draw is fresh each sitting and apportioned to the blueprint weights by largest remainder, then capped by what each section actually holds. Section 6.0 has only five mock-eligible questions, so its shortfall is redistributed rather than silently shrinking the exam. Results break down by section and replay every missed question with the full review panel.

Two rules the data forces. Scoring is against the verified answer, never the course's key, because the fact-check found three keys wrong. And eight questions never enter a mock exam: the one with no correct option, the three the documentation disputes, and the four that are off blueprint. All eight stay in practice, where the reasoning is the point.

    python3 site/build_bank.py

regenerates `exam/bank.js` from `practice/udemy-tests/*.json` and the trap master table. It is a plain script assigning a global, not JSON, because fetch is refused at the file origin. Progress, flags, in-flight exams and past attempts live in `localStorage`, which does work there; a finished attempt can be exported as JSON for `practice/attempts/`.

## Design

The subject is a reference manual for a pipe-delimited query language, so the pipe is the structural device and headings are set in monospace because the subject is code. One element is allowed to be loud, the search bar; everything else stays quiet. Amber appears only on traps, where it means warning rather than decoration.

## Files

| File | What it is |
|---|---|
| `manifest.py` | The 43 pages, their groups, labels, blueprint numbers, weights and cram pairings |
| `build.py` | Markdown to HTML. Headings and ids, per-page outline, traps, tables, fences, search index |
| `spl_lexer.py` | SPL tokenizer. Command, function and keyword lists live here |
| `theme.css` | All styling, including both palettes and the print rules |
| `app.js` | Search, copy buttons, scrollspy, progress bar, theme toggle |
| `search-index.js` | Generated. Do not edit |
| `mermaid-init.js` | CDN load, theme-aware re-render, offline fallback |
| `build_bank.py` | Practice JSON plus the trap table to `exam/bank.js` |
| `exam/index.html` | The simulator shell |
| `exam/exam.css` | Its dark palette, separate from the guide's |
| `exam/exam.js` | Routing, both modes, scoring, storage |
| `exam/bank.js` | Generated. Do not edit |

## Verification

The last build: 43 pages, 3,463 links checked, 0 broken targets and 0 broken fragments. Mermaid confirmed rendering over `file://`.

Known limits: Mermaid needs the network on first load. The search index grows with the guide and is loaded in full on every page.
