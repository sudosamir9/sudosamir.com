# Udemy course map: "Splunk: Zero to Power User" (Hailie Shaw)

All 41 modules mapped to the official SPLK-1002 blueprint, so you can see exactly which parts of the course earn exam points, which are background, and which earn nothing on this exam. This is not a criticism of the course, which teaches Splunk as a product rather than as an exam. It is a triage tool for what to re-watch.

## The headline

Roughly 20 of 41 modules map to blueprint sections. Roughly 11 are off blueprint entirely (installation, data onboarding, lookups, dashboards, reports, alerts). The rest are foundations that the exam assumes without listing.

The course also under-serves several things the exam does test. The gaps at the bottom of this file are the ones to care about.

## Coverage by module

| # | Module | Blueprint section | Status |
|---|---|---|---|
| 1 | Introduction | none | Orientation |
| 2 | What Makes Up Splunk | none | Off blueprint. Forwarder/indexer/search head architecture is SPLK-1003 material |
| 3A | Demo of Lets Download Splunk | none | Off blueprint |
| 3B | MacOS Installation | none | Off blueprint. SPLK-1003 |
| 3C | Demo of Getting the Practice Data | none | Off blueprint, but you need this data for the labs in this guide |
| 4A | Getting Data into Splunk | none | Off blueprint. SPLK-1003 sections on inputs and parsing |
| 4B | Demo of Data Preview and Creating Inputs | none | Off blueprint. SPLK-1003 |
| 4C | App vs Addon | none | Off blueprint, but the distinction matters for understanding what the CIM add-on is in section 10.0 |
| 5 | Demo of Searching and Basic Navigation | foundations | Assumed knowledge. Covered in `topics/00-foundations-refresher.md` |
| 6A | Knowledge Objects | underpins 4.0 to 10.0 | The KO taxonomy is the spine of seven blueprint sections |
| 6B | Demo of KOs | underpins 4.0 to 10.0 | Same |
| 7 | Show me the Fields! | 4.0 + foundations | Fields sidebar, Selected vs Interesting vs All, the 20% rule |
| 8A | Search Processing Language | foundations + 2.0 | Pipeline semantics, command types |
| 8B | Demo of Building SPLs and Basic Commands | foundations + 2.0 | |
| 9A | Transforming Your Search | **1.0** | Direct hit, 5% of the exam |
| 9B | Transforming Commands | **1.0** | Direct hit |
| 10A | What are the Events Telling Me? | **3.0** | Direct hit, 15% of the exam, the heaviest section |
| 10B | Demo of the Transaction Command | **3.0** | Direct hit |
| 11A | Manipulating Your Data | **2.0** | Direct hit, 10% |
| 11B | Demo of eval, where, and search | **2.0** | Direct hit. Note the course does not cover `fillnull`, which is objective 2.3 |
| 12A | Fields, Part 2! | **4.0 + 5.0** | Direct hit, 20% combined |
| 12B | Demo of Field Extracting | **4.0** | Direct hit |
| 13A | Lookups | none | **Off blueprint.** Lookups do not appear anywhere in the SPLK-1002 blueprint |
| 13B | Demo of Using Lookups | none | **Off blueprint** |
| 14A | Visualize Your Data | 1.0 in part | Partial. The transforming-command half counts, the visualization-picking half does not |
| 14B | Demo of Chart, Chart, Chart.....stats. | **1.0** | Direct hit |
| 15A | Visualizations, Part 2! | none | **Off blueprint** |
| 15B | Demo of More Dashboards! | none | **Off blueprint** |
| 16A | Reports & Drilldowns | none | **Off blueprint** |
| 16B | Demo of Generating Reports, Drilldowns, Home Dashboard | none | **Off blueprint** |
| 17 | Alerts | none | **Off blueprint** |
| 18 | Welcome, Tags and Events! | **6.0** | Direct hit, 10% |
| 19A | Macros | **7.0** | Direct hit, 10% |
| 19B | Demo of Making Macros | **7.0** | Direct hit |
| 20 | Workflows to Save You Time | **8.0** | Direct hit, 10%. This is the only module covering all three workflow action types |
| 21A | Data Normalization & Troubleshooting | **5.0 + 10.0** | Direct hit on aliases, calculated fields and CIM normalization |
| 21B | Demo of All the random things we just covered | **5.0 + 10.0** | Direct hit |
| 22A | Datamodels | **9.0** | Direct hit, 10% |
| 22B | Demo of Searching Datamodels | **9.0** | Direct hit |
| 23A | The Common Information Model | **10.0** | Direct hit, 10%. The only real coverage you have of the section with no official Splunk course |
| 23B | Demo of the CIM Add-on & CIM Add-On Builder | **10.0** | Direct hit. Note the CIM Add-on Builder itself is not an exam topic |

## Coverage by blueprint section, the other direction

| Section | Weight | Udemy modules | Assessment |
|---|---|---|---|
| 1.0 Transforming commands | 5% | 9A, 9B, 14A, 14B | Good coverage for the weight |
| 2.0 Filtering and formatting | 10% | 8A, 8B, 11A, 11B | Good on eval, search and where. `fillnull` (objective 2.3) is not covered |
| 3.0 Correlating events | 15% | 10A, 10B | Covers `transaction`. Does not do the transaction-vs-stats comparison, which is objective 3.6 and the single most tested idea in the section |
| 4.0 Field extractions | 10% | 7, 12A, 12B | Good coverage of the Field Extractor |
| 5.0 Aliases and calculated fields | 10% | 12A, 21A, 21B | Aliases covered. Calculated fields as a saved knowledge object are lighter than the 10% weight deserves |
| 6.0 Tags and event types | 10% | 18, 6A, 6B | Reasonable. Priority semantics and event type nesting are thin |
| 7.0 Macros | 10% | 19A, 19B | Covers basic macros. Objectives 7.3 and 7.4 are entirely about arguments, which need more than the course gives |
| 8.0 Workflow actions | 10% | 20 | One module for 10% of the exam. Re-read the topic file rather than relying on this |
| 9.0 Data models | 10% | 22A, 22B | Good on building and searching. Acceleration is light |
| 10.0 CIM | 10% | 23A, 23B | The best coverage available anywhere for this section, since Splunk has no course for it. Still needs the docs |

## What the course does not give you that the exam wants

Work through these in the topic files rather than re-watching:

- `fillnull`, which is a named blueprint objective (2.3) with its own bullet
- The transaction versus stats decision (3.6), including the stats equivalents `range(_time)`, `earliest()`, `latest()`, `values()`
- `transaction` options beyond `maxspan` and `maxpause`: `startswith`, `endswith`, `keeporphans`, `unifyends`, `keepevicted`, `connected`, `maxevents`
- Macro arguments end to end (7.3, 7.4): the `name(n)` argument-count naming, `$arg$` substitution, the `args` list, validation expressions and error messages, eval-based definitions
- POST workflow actions (8.3) specifically, including that post arguments travel in the request body
- Calculated fields as a `Settings, Fields, Calculated fields` object rather than as `eval` typed into a search
- The search-time knowledge object precedence order, which decides what a lookup, an alias and a calculated field can each see
- Data model acceleration, `tstats`, and the `| from datamodel:` syntax
- The CIM data model catalogue and the required-versus-recommended field classification
- `erex`, `fieldformat`, `eventstats`, `streamstats`, `xyseries`, `untable`

## What to ignore for this exam

Modules 2, 3A, 3B, 4A, 4B, 13A, 13B, 15A, 15B, 16A, 16B and 17. That is roughly a quarter of the course. Two caveats: Module 3C is how you get the practice data these labs use, and Module 4C (App vs Addon) is worth two minutes because section 10.0 is entirely about an add-on. Lookups (13A, 13B) stay useful in real work and appear in `topics/00-foundations-refresher.md` in condensed form, and they do come back on SPLK-1004, so the time was not wasted.
