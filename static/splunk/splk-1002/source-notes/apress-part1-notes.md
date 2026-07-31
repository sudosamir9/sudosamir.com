# Notes: *Splunk Certified Study Guide* (Deep Mehta, Apress 2021), Part I

What is actually in chapters 1 to 7, so you can decide what to re-read rather than paging through it. Read `apress-errata.md` alongside this. The book teaches several things correctly in prose and then keys the corresponding quiz question wrong.

## Page mapping

The PDF drops the blank verso pages before each chapter opener, so the offset between the printed page number and the PDF page number drifts. Add the offset to a printed page to jump to it in a viewer.

| Printed pages | PDF = printed + |
|---|---|
| 1-73 | 20 |
| 75-99 | 19 |
| 101-123 | 18 |
| 125-160 | 17 |
| 163 and up (Part II) | 16 |

**Part I ends at printed page 160, which is PDF page 177.** The commonly repeated "up to page 177" refers to the PDF page, not the printed one. Printed 177 sits inside Chapter 8 (User Management), which is SPLK-1003 material.

The Read tool cannot open this PDF because `pdftoppm` is not installed. Ghostscript is, so text extraction works:

```bash
gs -q -dNOPAUSE -dBATCH -dSAFER -sDEVICE=txtwrite -dFirstPage=23 -dLastPage=177 -sOutputFile=part1.txt "Splunk Certified Study Guide ....pdf"
```

## Chapter 1: An Overview of Splunk

Printed 3-26. **Roughly 80% off-blueprint.** The chapter opens with "Overview of the Splunk **Admin** Exam", prints the SPLK-1003 structure and its full 17-section blueprint, and then installs Splunk.

Contents: Splunk history (2003, Das, Swan and Baum), the four-phase pipeline (input, parsing, indexing, searching), the default port table (Web 8000, management 8089, KV Store 8191), the 60-day 500 MB/day trial, macOS and Windows installation, creating an app under `$SPLUNK_HOME/etc/apps/`, hand-writing a `props.conf` stanza with `TIME_PREFIX`, `TIME_FORMAT`, `MAX_TIMESTAMP_LOOKAHEAD`, `LINE_BREAKER`, `SHOULD_LINEMERGE` and `TRUNCATE`, and uploading a file through Add Data. Names the default fields (host, index, linecount, punct, source, sourcetype, splunk_server, timestamp).

**Worth reading for SPLK-1002:** the default fields list, and nothing else. Everything else here is SPLK-1003.

Five quiz questions. Question A is keyed wrong (see errata).

## Chapter 2: Splunk Search Processing Language

Printed 27-52. A set of reference tables rather than a taught progression. This is where the function-table errors live.

Commands covered with a syntax table each: `sort`, `where`, `dedup`, `head`, `tail`, `top`, `rare`, `history`, `table`, `stats`, `untable`, `chart`, `timechart`, `eval`, `rex` (including `mode=sed`), `lookup` / `inputlookup` / `outputlookup`, `fields` (which the book calls "Field"), `transaction` (only `maxpause` and `maxspan`, plus the 1000-event note).

Function tables: `stats` aggregates (avg, count, dc, max, median, min, mode, sum, var, first, last, list, values, per_day, per_hour, per_minute, per_second) and roughly fifty `eval` functions across comparison and conditional, conversion, cryptographic, date and time, informational, mathematical, multivalue, statistical, text and trigonometric families.

Concepts: pipe semantics, `_time` and the time range picker, relative versus real-time search, the search job lifetime (10 minutes, extendable to 7 days), the five search components, `AND`/`OR`/`NOT` capitalisation and `NOT` versus `!=`, and the SPL syntax colour table.

**Worth reading for SPLK-1002:** the command syntax tables, with the errata open. Four function-table rows are wrong and two of the Boolean examples are invalid SPL. Do not learn `coalesce`, `null`, `nullif`, `var` or the rate functions from this chapter. Use `reference/eval-functions.md` and `reference/stats-and-chart-functions.md`.

Seven quiz questions, A to G.

## Chapter 3: Macros, Field Extraction, and Field Aliases

Printed 53-73. The first chapter that is mostly on-blueprint. Maps to sections 4.0, 5.1 and 7.0.

Field extraction through the Field Extractor UI in three modes: Regular Expression (highlight a value, name the field, use Require to add positive samples, blacklist the non-matches), inline regex editing (with the correct warning on printed page 56 that once you edit the regex you cannot go back to the Field Extractor UI), and Delimiters (tab-separated data, renaming `field1` through `field6`).

Macros: created through Settings, Advanced Search, Search Macros with a definition of `transaction maxpause=20m` invoked as `` `session` ``, and through `$SPLUNK_HOME/etc/apps/<app>/local/macros.conf` with a `[Test9]` stanza. **Only zero-argument macros are shown.** Objectives 7.3 and 7.4 are entirely about arguments and the book covers none of it.

Field aliases: Settings, Fields, Field Aliases, Add New, with "Apply to: source", aliasing `unit_id` and `id` onto a common `ptestid`.

Four worked SPL exercises using `bin span=1h`, `stats count by _time | where count > 150`, `transaction maxpause=10m`, `stats count by port`, and a macro plus `timechart span=1h sum(eventcount) as sessions`.

**Worth reading for SPLK-1002:** the Field Extractor walkthroughs, which are the clearest thing in the book, and the field alias setup. Skip the macro section and use `topics/07-macros.md` instead.

Six quiz questions, A to F. **Three of them are keyed wrong** (C, D, E). Questions A and B are Admin material about input allowlists and `$SPLUNK_HOME/etc`.

## Chapter 4: Tags, Lookups, and Correlating Events

Printed 75-99. Half on-blueprint (tags), half off (lookups, reports, alerts).

Lookups: the four types (CSV/static, KV Store, geospatial/KMZ, external/scripted) and the three creation surfaces treated as separate objects, which is the useful part: lookup table file, lookup definition, automatic lookup. Off blueprint for SPLK-1002.

Tags: created from the event field Actions menu, searched with `"tag::location"=privileged`, wildcards. Event types created at Settings, Event Types, New with a tag, the colour red, and priority 1.

Reports: save-as from a search, or Settings, Searches Reports and Alerts, New Report. Report acceleration and its cost caveat. Scheduling. All off blueprint.

Alerts: a scheduled alert with a trigger condition and severity, plus the cron field ranges (minute 0-59, hour 0-23, day of month 1-31, month 1-12, day of week 0-6) and `0 */12 * * *`. Off blueprint.

**Worth reading for SPLK-1002:** the tags section. That is it.

Seven quiz questions, A to G. Question C is keyed wrong. Question B is where the book states "Field values are case sensitive by default", contradicting its own Chapter 2.

## Chapter 5: Data Models, Pivot, and CIM

Printed 101-123. On-blueprint for sections 8.0, 9.0 and 10.0, and the thinnest coverage relative to what those sections are worth (30% of the exam between them).

Data models: built entirely through the UI. Create a data model, add a Root Event dataset with a constraint, add Auto-Extracted fields, add a Lookup field, add an Eval Expression field using `case(City in(...), "Eastern USA", ...)`, then two child datasets narrowed by the eval field. Pivot: split rows, split columns, column values, column chart, pie chart.

Workflow actions: names GET, POST and Search, then builds **GET** (`URI=www.google.com/search?ip=$ip$`, link method get, applied only to the `ip` field) and **Search** (`index="test"|timechart count by $ip$`, run in app, show in Both). **POST is never demonstrated**, which is exactly objective 8.3.

CIM: about two pages. Create a tag, build a data model constrained on that tag, observe zero counts in Pivot, install the Splunk Common Information Model add-on, add the index to the CIM "indexes whitelist", counts appear. Correctly notes on printed page 120 that CIM data models ship with acceleration turned off, then keys the quiz question the opposite way.

**Worth reading for SPLK-1002:** the data model build walkthrough and the Pivot screens. The workflow action and CIM material is too thin to rely on.

Seven quiz questions, A to G. **Three are keyed wrong** (B, E, F), including the data model to Pivot relationship, which is objective 9.1 verbatim.

## Chapter 6: Knowledge Managers and Dashboards in Splunk

Printed 125-154. Almost entirely off-blueprint, with one genuinely useful section.

Knowledge object management: the five knowledge object categories (data interpretation, classification, enrichment, normalization, data models), making objects global with All Apps and Read/Write Everyone, app-scoped visibility, restricting write to `admin` and `power`, orphaned knowledge objects (Monitoring Console health check, Settings, All Configurations, Reassign Knowledge Objects, filtering by Orphaned), and a note that objects live in `macros.conf`, `tags.conf`, `eventtypes.conf` and `savedsearches.conf`.

Dashboards: eleven reports assembled into a "Sales" dashboard, then four progressively longer Simple XML `<form>` listings adding a radio button, a time input, a dropdown and a link list with `$token$` substitution, `fieldForLabel`, `fieldForValue`, `autoRun` and `searchWhenChanged`. All Simple XML. **Dashboard Studio, which shipped in Splunk 8.2 and is the default in 10.x, is never mentioned.**

**Worth reading for SPLK-1002:** the knowledge object categories and the permissions model, which show up indirectly across several sections. Skip the dashboards.

Five quiz questions, A to E, all keyed correctly.

## Chapter 7: Splunk User/Power User Exam Set

Printed 155-160. Nineteen questions labelled A to S, a bare answer key on printed 159, and a three-sentence summary. No explanations and no mapping back to chapters or blueprint sections.

Its own key is mostly right. See `apress-errata.md` for what is wrong with it as practice material: four questions duplicate earlier chapter questions, three test Admin knowledge, two are mis-worded, and nothing in the set touches `eval`, `stats`, `chart`, `timechart`, `rex`, field aliases, calculated fields, workflow action types, CIM, `top`/`rare`, or knowledge object precedence.

Question I here ("Delimiters are used for ____ data", keyed **structured**) is the correct version of Chapter 3's question D, which keyed the same fact as false. When the book contradicts itself, Chapter 7 has the right answer in that particular case.

Treat this chapter as a fifteen-minute warm-up, not as a mock exam. Your Udemy practice tests and the self-check questions in the topic files are the real practice material.

## What Part I never covers

Listed here so you know what you have to get elsewhere. Each of these is on the blueprint or is tested indirectly.

- Calculated fields as a knowledge object (objective 5.2, 10% of the exam)
- `erex`
- The search-time knowledge object precedence order
- Macros with arguments: `args`, `$arg$`, validation, error messages, eval-based definitions (objectives 7.3 and 7.4)
- POST workflow actions (objective 8.3)
- Data model acceleration, `tstats`, `| datamodel`, `| from datamodel:`
- `transaction` versus `stats` (objective 3.6), and `startswith`, `endswith`, `keeporphans`, `unifyends`, `keepevicted`, `connected`
- `fillnull` (objective 2.3), `fieldformat`, `eventstats`, `streamstats`, `xyseries`, `addtotals`, `appendcols`, `spath`, `mvexpand`, `foreach`
- Search modes: fast, smart, verbose
- `chart` and `timechart` options: `span`, `limit`, `useother`, `usenull`, and the `over X by Y` semantics
- The CIM data model catalogue, and required versus recommended versus optional fields
- Field discovery, All Fields versus Interesting Fields, and the 20% rule as taught prose rather than a quiz answer
- Time modifiers, snap-to syntax, and the time range picker
- The Job Inspector in a Power User context

The book also never prints the SPLK-1001 or SPLK-1002 blueprint. It scatters claims like "you have covered 30% of the Power User blueprint" without ever saying what the modules are, and the percentages it quotes do not match the current blueprint. `00-exam-overview.md` has the real one.
