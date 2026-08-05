# Design direction: Blueprint

Written before any markup, per the web-build phase order. This is the document the build answers to.

## What this is

Not a documentation site. An instrument panel for a single deadline. There is one reader, one exam date, ten sections with published weights, and a readiness number that can actually be measured. The previous interface hid all of that behind a generic three-column docs layout: the simulator knew the per-section accuracy and the guide never showed it, and the two halves looked like different products.

## The one-sentence direction

The exam blueprint itself becomes the interface: ten segments sized in proportion to their exam weight, carrying both what has been read and what has been answered correctly, present in the guide and in the simulator, so that navigating and measuring readiness are the same act.

## Candidates considered and rejected

The style database proposed a Data-Dense Dashboard on near-black `#0F172A` with an acid green `#22C55E` accent, in a FAQ landing pattern with a hero, category cards and an accordion.

- **Rejected the palette.** Near-black with a single bright acid-green accent is one of the three looks that currently cluster in AI-generated design. Arriving there is a signal to keep looking, not a result.
- **Rejected the pattern.** There is no support desk to escalate to and no FAQ. An accordion would hide content that has to be scannable under time pressure.
- **Rejected its "avoid text-heavy pages" rule.** This guide is 176,000 words and the text is the product. That rule belongs to marketing dashboards.
- **Rejected Editorial Grid / Magazine.** Drop caps and pull quotes on a reference manual are costume.
- **Kept, scoped:** the Data-Dense treatment applies to reference tables and the simulator navigator only, never to prose.
- **Kept:** Swiss Modernism grid discipline for structure, E-Ink / Paper calm and print-fidelity for the reading surface.

## Palette

Two full modes, both WCAG AA at minimum on body text. Semantic tokens only; no raw hex in components.

| Token | Paper (light) | Ink (dark) | Means |
|---|---|---|---|
| `--surface` | `#FBFAF7` | `#12161D` | page |
| `--surface-raised` | `#FFFFFF` | `#181D26` | cards, panels |
| `--surface-sunk` | `#F1EFEA` | `#0D1116` | rails, chrome |
| `--text` | `#1A1D21` | `#E8ECF1` | body |
| `--text-soft` | `#4C5560` | `#A5AFBC` | secondary |
| `--text-faint` | `#6B7480` | `#7E8896` | metadata |
| `--rule` | `#E0DCD4` | `#242A34` | hairlines |
| `--accent` | `#1F7A4C` | `#3FB37C` | the one accent: current page, primary action, correct |
| `--warn` | `#9A6108` | `#D69A3C` | traps only, nothing else |
| `--wrong` | `#A32C28` | `#E8635E` | incorrect answers only |
| `--spl` | `#8A3A66` | `#F2A0C4` | inline SPL and code |

Paper is not cream-and-serif; it is a warm near-white with an ink-black text and a deep forest accent. The accent is Splunk's green family at a readable weight rather than the acid green the database proposed.

## Type

Vendored locally as woff2, latin subset. Both faces are OFL, so bundling is licensed and the site renders identically offline and on the domain. No Google Fonts request, which would fail at the `file://` origin anyway.

- **IBM Plex Sans** for prose. Drawn by IBM for technical documentation, with a true companion mono. 400/500/600/700.
- **JetBrains Mono** for SPL, headings, numerals, and every piece of structural chrome. 400/500/700.

Headings are mono because the subject is a query language. Numbers are mono everywhere so weights, counts and the exam clock align in columns.

Scale, fifth-based and fixed: 12, 13, 14, 16, 18, 21, 26, 32, 42. Body 17px/1.65. Prose is never capped to a measure; every block fills its column, which is the repository rule.

## Space

One modular scale, 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96. Density is dialled up for tables and the navigator grid, down for prose. Nothing uses a magic number.

## Signature element: the weighted spine

Ten segments, widths proportional to 5/10/15/10/10/10/10/10/10/10. Each segment shows:

- its blueprint number,
- a read mark once the topic page has been opened,
- an accuracy fill from the simulator's per-section results.

It sits in the left rail on every guide page and across the head of the simulator. Clicking a segment moves to that section. A single control on it switches between reading and drilling. This is the element that makes the two halves one product, and it is the only place the design is allowed to be loud.

## Motion language

Restrained. State changes get 150ms ease-out. Nothing enters on scroll, nothing bounces, nothing parallaxes. The only continuously animated thing in the entire site is the exam countdown, and only under a minute remaining.

No GSAP. It would have to come from a CDN, which the `file://` origin refuses, and CSS transitions do this job in a few lines. The workflow's own instruction is to check that before adding the dependency.

## Non-negotiables carried through every phase

Contrast 4.5:1 on body text and 3:1 on large text, in both modes. Focus rings visible and never removed. Full keyboard operation, including the simulator. 44px minimum hit targets. `prefers-reduced-motion` honoured. SVG icons, never emoji. No animation of width, height, top or left. Print stylesheet that drops the chrome and resets to ink on white.
