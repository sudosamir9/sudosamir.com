# 9.0 Creating Data Models - cram

## Syntax

```spl
| datamodel [<model>] [<dataset>] [search|flat|acceleration_search|search_string|flat_string|acceleration_search_string] [strict_fields=<bool>] [allow_old_summaries=<bool>] [summariesonly=<bool>]
| from datamodel:<model>.<dataset>
| tstats [summariesonly=<bool>] [allow_old_summaries=<bool>] [prestats=<bool>] <stats-func>... [FROM datamodel=<model>.<root_dataset> [where nodename=<root>.<...>.<target>]] [WHERE ...] [BY <fields> [span=<timespan>]]
| pivot <model> <dataset> <cell-value> [SPLITROW <f>] [SPLITCOL <f>] [FILTER ...] [SORT ...]
```

Click paths: Settings, Data Models, New Data Model, then Add Dataset (Root Event / Root Search / Root Transaction / Child), then Add Field (Auto-Extracted / Eval Expression / Lookup / Regular Expression / Geo IP). Pivot: Settings, Data Models, Pivot, pick dataset. Datasets listing: Search app, Datasets in the Apps bar, then Explore, Visualize with Pivot or Manage, Edit data model. Instant Pivot: run a non-transforming search, Statistics or Visualization tab, Pivot.

## Defaults and limits

| Item | Default | Note |
| --- | --- | --- |
| `acceleration` | `false` | Off on every model, including all CIM models |
| `acceleration.earliest_time` (Summary Range) | empty string = All Time | UI choices: 1 Day, 7 Days, 1 Month, 3 Months, 1 Year, All Time, Custom |
| `acceleration.cron_schedule` (Summarization Period) | `*/5 * * * *` | Every 5 minutes |
| `acceleration.max_time` | `3600` | 1 hour max summarization search time |
| `acceleration.max_concurrent` | `3` | Concurrent summarization searches |
| `acceleration.manual_rebuilds` | `false` | Auto rebuild on definition change |
| `acceleration.backfill_time` | empty string | Partial summary first |
| `acceleration.allow_old_summaries` | `false` | Also a `tstats` and `datamodel` arg |
| `datamodel strict_fields` | `true` | true = default plus constraint fields only |
| `tstats summariesonly` | `false` | Runs over accelerated and unaccelerated models |
| `tstats prestats` / `local` / `append` | `false` | `prestats=true` makes it event-generating |
| `tstats chunk_size` | `10000000` | Minimum `10000` |
| `tstats span` | `auto` | Mandatory when BY `_time` |
| `tags_whitelist` | empty | Comma-separated tags |
| Field Type | String | Selector: Boolean, IPv4, Number, String |
| Field visibility flag | Shown | Hidden affects Pivot only |
| Field requirement flag | Optional | Required filters out events lacking the field |
| Default inherited fields (root) | `_time`, `host`, `source`, `sourcetype` | Four, `_raw` not listed |
| Data model creators | admin, power roles | Plus `accelerate_datamodel` to accelerate |

## Decision rule

Simple search, no pipes, want acceleration: Root Event. Needs pipes: Root Search, and no acceleration if the search is transforming. Groups events across time: Root Transaction (needs a Group Dataset plus one of Group by, Max Pause, Max Span), never accelerable, children not accelerable either. Narrower slice of an existing dataset: Child, extra constraints only, no macros, cannot add auto-extracted fields. Already extracted field on a root: Auto-Extracted. Derived value: Eval Expression, placed below its inputs. CSV or KV store: Lookup, permissions must match. Inside a string: Regular Expression with named groups. Geo from an IP: Geo IP, below an `ipv4`-typed field, forced Required. Non-SPL user needs a report: Pivot. Model searched constantly: share it app or global, then accelerate.

## Five facts they test

1. The data model provides the dataset; Pivot consumes it. Never the reverse.
2. A child dataset inherits all constraints and all fields from every ancestor and adds its own; inheritance is cumulative and narrowing.
3. Only root event hierarchies and streaming-only root search hierarchies can be persistently accelerated; transforming root search datasets and root transaction datasets (and their children) cannot.
4. Required is a real filter: any event missing the field leaves the dataset. Hidden only removes the field from the Pivot field pickers.
5. `tstats` uses `FROM datamodel=<model>.<root>` with an equals sign; `from` uses `datamodel:<model>.<dataset>` with a colon. `summariesonly` defaults to `false`; `strict_fields` on `datamodel` defaults to `true`.

## Trap IDs

T-09-01 Pivot and data model direction. T-09-02 child inheritance is true. T-09-03 CIM acceleration off by default. T-09-04 which hierarchies accelerate. T-09-05 auto-extracted fields are root-only. T-09-06 Required filters events. T-09-07 Hidden is Pivot-only. T-09-08 root event constraints take no pipes. T-09-09 Dataset ID immutable after save. T-09-10 `datamodel=` versus `datamodel:`. T-09-11 `summariesonly` default false. T-09-12 `strict_fields` default true. T-09-13 ad hoc summaries deleted on leaving Pivot. T-09-14 private models cannot be accelerated. T-09-15 no macros in child constraints. T-09-16 Geo IP fields forced Required. T-09-17 fields process top to bottom. T-09-18 Instant Pivot needs a non-transforming search and saves a private model.
