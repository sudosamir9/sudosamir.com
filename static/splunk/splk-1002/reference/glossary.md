# Glossary

Every term in this guide that carries a specific Splunk meaning, defined precisely enough to answer an exam question. Entries are alphabetical. Where a term is routinely confused with a neighbouring one, the entry says so, because that confusion is usually what the question is testing.

Three words mean two different things depending on context, and the exam exploits all three: **acceleration**, **precedence** and **required**. Those entries are split into separate sub-entries. Read them slowly.

## Terms

**acceleration** Three unrelated mechanisms share the word. They differ in what they accelerate, what triggers them and where the summary lives.

*Report acceleration.* Applies to a saved report whose search string uses a transforming command, with only streamable commands before it and no event sampling. Enabled by a checkbox plus a Summary Range; the summary is built beside the index buckets but only once the covered hot bucket holds at least 100,000 events. Pivot-created reports cannot be accelerated, and a report run in Verbose mode cannot use acceleration. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

*Data model acceleration.* Applies to a data model, not to a search. Disabled by default, driven by a cron schedule defaulting to `*/5 * * * *`, and it builds `.tsidx` summaries on the indexers that `tstats` reads. The model must be shared rather than private, the user needs `accelerate_datamodel`, and only root event hierarchies or streaming-only root search hierarchies qualify. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

*Summary indexing.* Not automatic: you write a scheduled search, usually with the `si*` commands, that writes its output into an ordinary index you nominate. The only one of the three that supports metric data as well as event data. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**add-on** An app whose purpose is to bring data in or map it rather than display it, holding inputs, parsing configurations, lookups and knowledge objects rather than dashboards and navigation. A technology add-on (TA) is the per-vendor variety that makes one source CIM compliant; the CIM add-on (`Splunk_SA_CIM`) supplies the models TAs map into. Topic: [10-cim](../topics/10-cim.md).

**app** An application running on the Splunk platform that analyzes and displays knowledge around a specific data source, held in a directory under `$SPLUNK_HOME/etc/apps/`. Every knowledge object is bound to the app context in which it was created, and App is the middle of the three sharing scopes (Private, App, All apps). Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**attribute** The data model word for a field: the editor and the CIM tables say field, `datamodels.conf` and blueprint objective 9.2 say attribute. Five kinds can be added (Auto-Extracted, Eval Expression, Lookup, Regular Expression, Geo IP) and four types assigned (Boolean, IPv4, Number, String). Not to be confused with a configuration file attribute, the conf-spec word for a setting such as `KV_MODE`. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

**automatic lookup** A lookup applied to every search over a given host, source or source type without the `lookup` command appearing in the search, configured as `LOOKUP-<class>` in `props.conf` and applied at stage 7. Nested automatic lookups are not supported. Not to be confused with the lookup definition it names or the `lookup` command it replaces. Topic: [knowledge-object-precedence](knowledge-object-precedence.md).

**calculated field** A field added at search time by an `EVAL-<fieldname>` setting in `props.conf`, scoped to a host, source or source type: the persistent, directly searchable form of an `eval` expression, applied at stage 6. All `EVAL-` settings in one stanza run in parallel so they cannot chain, and one overrides a same-named extracted field even when the expression returns null. Not to be confused with the `eval` command, which lasts one search. Topic: [05-aliases-and-calculated-fields](../topics/05-aliases-and-calculated-fields.md).

**child dataset** A data model dataset that inherits every constraint and field from its ancestors and adds at least one constraint of its own. Child constraints cannot include search macros, and only root datasets can add new auto-extracted fields. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

**CIM** Common Information Model: a shared semantic model, delivered as an add-on, that normalizes differently-shaped data onto common field names and tags. Entirely search time (schema-on-the-fly), so it leaves raw data intact and reindexes nothing, and compliance means the right tags plus populated required fields. Not to be confused with a data model you build: CIM models are prebuilt, ship unaccelerated, and use tags as constraints. Topic: [10-cim](../topics/10-cim.md).

**closed_txn** A field the `transaction` command emits when `keepevicted=true`: `1` for a transaction that closed normally, `0` for one that was evicted. It is `1` only when `maxevents`, `maxspan`, `maxpause` or `startswith` was specified; `endswith` alone leaves it `0`. Not to be confused with `_txn_orphan=1`, which `keeporphans=true` adds to results that never joined a transaction. Topic: [03-correlating-events](../topics/03-correlating-events.md).

**constraint** The search that defines which events belong to a data model dataset; on a root event dataset it looks like the first part of a search, before any pipe or command. Child constraints compose with every ancestor, and a Required field or a CIM dataset tag acts as a further implicit constraint. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

**data model** A hierarchically structured search-time mapping of semantic knowledge about one or more datasets, built from root event, root search and root transaction datasets plus children. It is a fully permissionable knowledge object whose permissions cover all its datasets, and it provides the dataset Pivot consumes, never the reverse. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

**data model acceleration** See the second sub-entry under **acceleration**: disabled by default, requires a shared model and `accelerate_datamodel`, builds `.tsidx` summaries on the indexers, and covers only root event hierarchies or streaming-only root search hierarchies. Ad hoc acceleration is the separate temporary form that Pivot builds and deletes when you leave the editor. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

**dataset** A collection of data defined for a specific purpose; inside a data model, one node of the hierarchy. The Datasets listing page shows three kinds of dataset object: lookups, data model datasets and table datasets. Not to be confused with the data model, which is the container that holds datasets and carries their permissions. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

**default fields** The fields Splunk adds at index time. Default: `host`, `index`, `linecount`, `punct`, `source`, `sourcetype`, `splunk_server`, `timestamp`. Internal: `_raw`, `_time`, `_indextime`, `_cd`, `_bkt`. Default datetime: `date_hour`, `date_mday`, `date_minute`, `date_month`, `date_second`, `date_wday`, `date_year`, `date_zone`, present only when the source supplied timestamp information. `eventtype` and `tag` are not default fields. Topic: [04-field-extractions](../topics/04-field-extractions.md).

**delimiter** The character separating values in structured data; the Field Extractor's Delimiters method offers Space, Comma, Tab, Pipe and Other, auto-names fields `field1`, `field2` and so on, and saves a `DELIMS`/`FIELDS` transform plus a `REPORT-` reference. That path has no Select Fields step, no Validate step and no regex to edit later. Also an option name: `stats delim` defaults to a single space, `transaction delim` to whitespace. Topic: [04-field-extractions](../topics/04-field-extractions.md).

**distributable streaming** A streaming command that can run on the indexers in parallel because each event is processed independently: `eval`, `fields`, `rename`, `regex`, `replace`, `where`, `rex`, `extract`, `fieldformat` and others. Not to be confused with centralized streaming (`head`, `streamstats`, `transaction`, some modes of `dedup` and `cluster`), which is still per-event but search head only. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**duration** In `transaction` output, the seconds between the first and last event of the transaction; it is `0`, not null, for a single-event transaction, and `stats range(_time)` gives the same number. Also a Pivot column value function for timestamp fields, and a `tostring()` format rendering seconds as `HH:MM:SS`. Topic: [03-correlating-events](../topics/03-correlating-events.md).

**event** A single indexed record with a timestamp, whose raw text is `_raw` and whose time is `_time`, stored as UNIX epoch seconds. Not to be confused with a result, the row shape a transforming command produces: after one there are no events and `_raw` is not passed down, so a later bare-keyword `search` matches nothing. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**event dataset** A data model dataset, root or child, defined by a constraint that filters events; the most common type and the only root type whose hierarchy is unconditionally eligible for persistent acceleration. Not to be confused with a search dataset or a transaction dataset. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

**event type** A saved search-time classification, a name plus a simple search string in `eventtypes.conf`, applied at stage 8; matching events gain `eventtype=<name>`, which is multivalue when several match. The search string cannot contain a pipe followed by a command, a subsearch, `savedsearch`, or a tag reference, and priority runs 1 (best) to 10 (worst), deciding listing order and which single colour renders. Not to be confused with a report, which you run on demand and may contain pipes. Topic: [06-tags-and-event-types](../topics/06-tags-and-event-types.md).

**event type builder** The Build Event Type utility, reached from Event Actions on an expanded event, which builds an event type from that event and saves it with a name, colour and priority. Distinct from `findtypes`, the command that surfaces candidate patterns by coverage. Topic: [06-tags-and-event-types](../topics/06-tags-and-event-types.md).

**eventcount** The field `transaction` adds giving the number of events in the transaction, which is why `... | transaction user | where count>5` matches nothing. Separately, a generating command (`| eventcount`) valid as the first command of a subsearch. Topic: [03-correlating-events](../topics/03-correlating-events.md).

**field** A name-value pair on an event or a result. Field names are case sensitive and `search` field values are not, while `eval`, `where` and `like()` are case sensitive throughout; a field exists in the schema only if it has at least one non-null value in the result set. Topic: [04-field-extractions](../topics/04-field-extractions.md).

**field alias** An additional name for an existing field, configured as `FIELDALIAS-<class>` in `props.conf` at stage 5; the alias is added alongside the original and never renames or removes it. A field can carry several aliases but one alias name maps from only one field, `AS` replaces an existing target value while `ASNEW` leaves it alone, and you cannot alias a calculated field, event type, tag or lookup output. Not to be confused with `rename`, which lasts one search and drops the old name. Topic: [05-aliases-and-calculated-fields](../topics/05-aliases-and-calculated-fields.md).

**field discovery** The search-time extraction of fields the search string did not name: on in Verbose, on in Smart for non-transforming searches, off in Fast and in Smart for transforming searches. When on, Splunk extracts the first 100 obvious `key=value` pairs plus fields named in the search plus custom extractions. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**Field Extractor** The Splunk Web wizard (FX, historically IFX) that builds a search-time extraction: Select Sample, Select Method, then either Select Fields and Validate (regex path) or Rename Fields (delimiter path), then Save. The sample is capped at 20 lines, Save defaults to Owner permission, the regex path writes `EXTRACT-` and the delimiter path a transform plus `REPORT-`, and nothing is reindexed. Not to be confused with `rex`, which persists nothing. Topic: [04-field-extractions](../topics/04-field-extractions.md).

**field filter** Stage 1 of the search-time sequence, configured in `field_filters.conf`, which removes or replaces specific indexed, `_raw`, search-time and default fields before every other operation, silently breaking anything downstream that depended on the removed field. Not to be confused with the `fields` command or a `where` filter, which act inside a single pipeline. Topic: [knowledge-object-precedence](knowledge-object-precedence.md).

**field transform** A named `transforms.conf` stanza holding `REGEX` plus `FORMAT`, or `DELIMS` plus `FIELDS`, with `SOURCE_KEY` defaulting to `_raw`, referenced from `props.conf` as `REPORT-<class>` at stage 3. Inline `EXTRACT-` extractions are stage 2 and run first, so on a name collision the inline value is kept. Topic: [04-field-extractions](../topics/04-field-extractions.md).

**generating command** A command that produces events or results rather than consuming them, so it must be first in the search behind a leading pipe: `search`, `tstats`, `inputlookup`, `metadata`, `datamodel`, `from`, `pivot`, `makeresults`, `eventcount`. The first command of a subsearch must be generating, and when a macro expands to one the pipe goes before the backtick, not in the definition. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**index-time field extraction** Field extraction performed while data is parsed and written to disk: default fields, structured-data fields and custom `TRANSFORMS-`. It cannot be applied retroactively, it enlarges the index and slows both indexing and searching, and the docs restrict it to rare circumstances. Not to be confused with search-time field extraction. Topic: [knowledge-object-precedence](knowledge-object-precedence.md).

**Instant Pivot** The route from a non-transforming search into the Pivot Editor: open the Statistics or Visualization tab, click Pivot, then choose All Fields, Selected Fields or fields above a coverage threshold. Saving the result as a report or dashboard panel creates a data model, and that model is private. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

**interesting fields** The sidebar list of fields appearing in at least 20 percent of the events returned by the current search. The threshold is measured against the search results, not the index or source type, and it is a display rule only. Not to be confused with Selected Fields. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**knowledge manager** The person responsible for creating, curating, sharing and reassigning knowledge objects on behalf of other users. It is not a role name in `authorize.conf`: the roles that share and promote objects by default are admin (any object) and power (objects it owns). The manual once called the Knowledge Manager Manual is now the Knowledge Management Manual. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**knowledge object** A user-defined object Splunk applies to events at search time, in five documented categories: data interpretation (fields and extractions), data classification (event types and transactions), data enrichment (lookups and workflow actions), data normalization (tags and aliases), and data models. Every one is private when created; sharing levels are Private, App and All apps. Topic: [knowledge-object-precedence](knowledge-object-precedence.md).

**lexicographical order** UTF-8 encoding order, which is what Splunk means whenever it says objects are processed in order: numbers before letters, numbers sorted on the first digit (10, 100, 70, 9), and uppercase before lowercase, so `EXTRACT-ZZZ` runs before `EXTRACT-aaa`. Not to be confused with alphabetical or numeric order. Topic: [knowledge-object-precedence](knowledge-object-precedence.md).

**lookup definition** The named configuration pointing at a lookup table file, KV Store collection, script or KMZ file, holding the matching rules: match fields, `max_matches`, `min_matches`, `default_match` and `case_sensitive_match`. One table file can back several definitions, and the definition name is what the `lookup` command and automatic lookups reference. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**lookup table file** The data itself, typically a CSV in `$SPLUNK_HOME/etc/apps/<app>/lookups/`. It carries no matching rules; those live in the lookup definition. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**macro** A reusable chunk of SPL stored in `macros.conf` and inserted between backticks; it can be any part of a search and need not be a complete command. A macro with arguments is named with the count appended (`mymacro(2)`), arguments are bare names in the Arguments field and `$token$` form in the Definition, and `iseval = true` means the Definition is an eval expression returning the expansion string. Expansion happens at parse time, before the nine search-time operations, which is why macros are absent from that sequence. Topic: [07-macros](../topics/07-macros.md).

**multivalue field** A field holding more than one value in one event or result, produced by `rex max_match` above 1, `MV_ADD`, `transaction` grouping, `stats values()` and `list()`, and by `eventtype` when several event types match. `mvindex()` and `mvfind()` index from 0; `substr()` indexes from 1. Topic: [02-filtering-and-formatting](../topics/02-filtering-and-formatting.md).

**non-streaming command** A command needing the whole result set before it can emit anything, so it runs on the search head and ends the streaming pipeline. Transforming commands are non-streaming, as are the dataset processing commands, including `sort`, `eventstats`, `transaction`, `join`, `union`, `append` and `fillnull` with no field list. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**orphaned knowledge object** An object whose owner's account no longer exists, leaving the scheduler unable to run scheduled searches on that owner's behalf. Reassignment is at Settings > All configurations > Reassign Knowledge Objects, which cannot reassign an object that is both orphaned and privately shared. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**Pivot** The interface that builds tables and charts from a data model dataset without SPL, using four element categories: Filters, Split Rows, Split Columns, Column Values. The time range filter is always present and cannot be removed, and a Pivot-created report cannot be report accelerated. Not to be confused with the data model, which is what Pivot reads. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

**precedence** Two entirely different mechanisms share the word, and conflating them is a classic distractor.

*Search-time knowledge object precedence.* The order in which Splunk applies knowledge objects to the events a search returns: field filters, inline extraction (`EXTRACT-`), transform extraction (`REPORT-`), automatic key-value extraction (`KV_MODE`), field aliasing (`FIELDALIAS-`), calculated fields (`EVAL-`), lookups (`LOOKUP-`), event types, tags. The governing rule is that a configuration may reference fields derived by operations preceding it and may not reference fields derived by operations following it. Topic: [knowledge-object-precedence](knowledge-object-precedence.md).

*Configuration file precedence.* Which copy of a duplicated setting survives when Splunk merges every copy of the same `.conf` file. Global context, highest first: system `local`, app `local`, app `default`, system `default`. App or user context, highest first: the current user's directory, the current app, other apps (exported settings only), then system, with `local` before `default` at each level. App collisions break lexicographically in the global context but reverse-lexicographically in the app or user context. Topic: [knowledge-object-precedence](knowledge-object-precedence.md).

Neither influences the other. The sequence decides in what order objects are applied to events; configuration file precedence decides which duplicate setting wins the merge.

**punct** A default index-time field holding the punctuation pattern extracted from the event, useful for spotting events that share a shape. Topic: [04-field-extractions](../topics/04-field-extractions.md).

**required** The word appears in two places with two different consequences.

*CIM required field.* A field the CIM reference table for a dataset marks as required, expressed in the 8.6 tables as "required for pytest-splunk-addon". It is a contract, not a filter: Splunk enforces nothing, so a missing required field just means your data is not CIM compliant and content expecting it returns nothing. It sits alongside recommended (`comment.recommended = true` in the model JSON) and optional, and expected values are guidance, not enforcement. Topic: [10-cim](../topics/10-cim.md).

*Data model required attribute.* A per-field flag in the Data Model Editor, Optional by default, which when set to Required acts as a filter: the field must appear in every event represented by the dataset, so events lacking it are removed. Geo IP fields are forced to Required, and the Add Auto-Extracted Field dialog exposes visibility and requirement as one picker: Optional, Required, Hidden, Hidden and Required. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

The distinction to hold: a CIM required field describes what your data must supply to be compliant; a data model required attribute changes which events the dataset returns.

**root dataset** The top-level dataset of a hierarchy in a data model, in three kinds: root event (a constraint), root search (arbitrary SPL, possibly transforming) and root transaction (grouping other datasets' events). Its inherited fields are the default fields `_time`, `host`, `source` and `sourcetype`, and only root datasets can add new auto-extracted fields. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

**search dataset** A data model dataset defined by an arbitrary search rather than a constraint, so it may include transforming commands. A root search dataset using a transforming search cannot be accelerated; only streaming-only search hierarchies are eligible. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

**search job** The server-side execution of a search, identified by a sid and inspectable via Job then Inspect Job. Its three counts differ: `scanCount` is events read off disk, `eventCount` the subset matching the search terms, `resultCount` the rows returned; dense searches show similar scan and result counts, sparse searches far larger scan counts. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**search-time field extraction** A field pulled out of `_raw` while a search runs rather than stored in the index, so it applies retroactively and needs no reindex. Configured persistently as `EXTRACT-`, `REPORT-` plus a transform, or `KV_MODE`; or performed for one search only by `rex`, `extract`, `spath`, `multikv`, `xmlkv`, `xpath` or `kvform`, which create no reusable definition. Topic: [04-field-extractions](../topics/04-field-extractions.md).

**selected fields** The fields displayed beneath each event in the events list, defaulting to `host`, `source` and `sourcetype`; you add one from the sidebar with Selected: Yes. Not to be confused with Interesting Fields, the automatic 20 percent coverage list. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**sourcetype** A default index-time field naming the format of the input, and the primary scope for search-time knowledge objects, with `props.conf` `[<sourcetype>]` stanzas matched case-sensitively. It cannot be changed after indexing; `rename` in `props.conf` renames it at search time only, moving the original to `_sourcetype` and switching the event to the target stanza's search-time configuration. Topic: [04-field-extractions](../topics/04-field-extractions.md).

**sparkline** A small inline chart produced by the `sparkline()` function, available only with `chart` and `stats` and never with `timechart`, capped by `sparkline_maxsize` in `limits.conf`. Separately, a single value visualization built from `timechart` shows a sparkline and trend indicator by default while one built from `stats` shows neither. Topic: [01-transforming-commands](../topics/01-transforming-commands.md).

**splunk_server** A default field naming the Splunk instance holding the event; as a search modifier, `splunk_server=local` means the search head. Topic: [04-field-extractions](../topics/04-field-extractions.md).

**streaming command** A command operating one event at a time, roughly one event in and one or no events out, so it can produce output before the whole set arrives. Distributable streaming commands run on the indexers; centralized streaming commands do the same per-event work but must run on the search head. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**summary index** An ordinary index you populate yourself from a scheduled search, usually written with the `si*` commands: the manual member of the acceleration family and the only one supporting metric data as well as event data. Not to be confused with a report acceleration or data model acceleration summary, neither of which is an index you search directly. Topic: [00-foundations-refresher](../topics/00-foundations-refresher.md).

**tag** A searchable label attached to a specific field-value pair, not to an event and not to a bare field name, applied at stage 9 in ASCII sort order. Searched as `tag=<tagname>`, or `tag::<field>=<tagname>` with two colons to scope it to one field; one pair can carry many tags and tagging never changes the underlying value. The CIM pattern tags an event type, `[eventtype=<name>]` in `tags.conf`. Topic: [06-tags-and-event-types](../topics/06-tags-and-event-types.md).

**transaction** A group of related events spanning time, and the command that builds them; it adds `duration` and `eventcount`, takes `_time` from the earliest member and unions the members' other fields. Centralized streaming, so search head only, it requires descending time order, and `maxspan` and `maxpause` default to `-1` (no limit) while `maxevents` defaults to `1000`. Prefer `stats` unless identifiers are reused or you need the combined raw text. Topic: [03-correlating-events](../topics/03-correlating-events.md).

**transaction dataset** A data model dataset, root or child, built by grouping the events of other datasets in the same model; a root one requires a Dataset Name, a Dataset ID, at least one Group Dataset, and at least one of Group by, Max Pause or Max Span. Transaction datasets and their children never benefit from data model acceleration. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

**transforming command** A command that orders search results into a data table, producing results rather than events: `addtotals`, `anomalydetection`, `append`, `associate`, `chart`, `cofilter`, `contingency`, `history`, `makecontinuous`, `mvcombine`, `rare`, `stats`, `table`, `timechart`, `top`, `xyseries` (with `grouped=true`), of which `chart`, `timechart`, `stats`, `top` and `rare` are the primary five. They populate the Statistics and Visualization tabs, are required for trellis and report acceleration, and turn field discovery off in Smart mode; `table` aggregates nothing, so it cannot feed a pie chart. Topic: [01-transforming-commands](../topics/01-transforming-commands.md).

**tsidx** Time-series index file: the bucket-level index of terms that makes searching fast, and also the format of data model acceleration summaries, which collectively form the high performance analytics store that `tstats` reads. Topic: [09-data-models-and-pivot](../topics/09-data-models-and-pivot.md).

**workflow action** A knowledge object that adds a clickable item to an event menu or field menu, defined in `workflow_actions.conf` at Settings > Fields > Workflow actions, in two configured types: `link` (with `link.method` of `get` or `post`) and `search`. `fields` defaults to `*` and a multi-field list is a conjunction, `display_location` defaults to `both`, and `link.target` defaults to `blank`, a new window. It creates no field and changes no result, firing only when a person clicks, which separates it from an alert action. Topic: [08-workflow-actions](../topics/08-workflow-actions.md).

## Terminology that changed

Splunk renamed several long-standing terms and older study material has not caught up. The current exam uses the new names; the Apress book uses the old ones throughout, so treat its vocabulary as dated rather than wrong.

| Old term | Current term |
| --- | --- |
| License master | License manager |
| Whitelist | Allowlist |
| Blacklist | Denylist |
| Cluster master | Cluster manager |
| Knowledge Manager Manual | Knowledge Management Manual |

One of these matters directly for this exam: the CIM Setup page calls its index setting the Indexes allowlist, so any question or courseware calling it a whitelist is quoting a pre-rename version of the documentation. Elsewhere the renaming affects admin vocabulary that SPLK-1002 does not test, but a distractor written in the old vocabulary is a reliable sign that the question was copied from an older source.
