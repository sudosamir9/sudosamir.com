# 0.0 Foundations Refresher (cram)

Off blueprint. Zero direct points. Everything here is assumed knowledge that blueprint questions are phrased in.

## Syntax

```spl
earliest=<time_modifier> latest=<time_modifier>
[+|-]<time_integer><time_unit>@<time_unit>
outer_search [ generating_subsearch | format maxresults=<int> ]
lookup [local=<bool>] [update=<bool>] <table> <lkup-fld> [AS <evt-fld>] [OUTPUT|OUTPUTNEW <dest>]
| inputlookup [append=<bool>] [strict=<bool>] [start=<int>] [max=<int>] <file>|<table> [WHERE <q>]
```

## Defaults and limits

| Item | Default |
| --- | --- |
| Search mode | Smart |
| Smart on non-transforming search | Field discovery ON, behaves as Verbose |
| Smart on transforming search | Field discovery OFF, behaves as Fast |
| Fast mode fields returned | Default (`host`, `source`, `sourcetype`) + index-time + fields named in the search |
| Selected Fields at first run | `host`, `source`, `sourcetype` |
| Interesting Fields threshold | Field present in >= 20% of **events returned by the search** |
| Ad hoc search time range | Last 24 hours |
| `latest` when omitted | `now()` |
| Snap direction | Always DOWN (latest time not after the value) |
| Order within `-2h@h` | Offset first, then snap |
| Week snap codes | `@w0`/`@w7` = Sunday, `@w6` = Saturday |
| Picker vs inline `earliest`/`latest` | **Inline wins** |
| Subsearch `maxout` | 10,000 results |
| Subsearch `maxtime` | 60 seconds, then silently finalized |
| `format` defaults | AND within a row, OR between rows, wrapped in `( )`; output field is `search`; `maxresults=0`; `emptystr="NOT( )"` |
| Lookups (off blueprint) | `lookup` with no OUTPUT clause outputs all non-match fields; `local`/`update` `false`; `inputlookup` `append=false`, `max=1000000000`; `outputlookup append=false` overwrites |
| Report acceleration min events | 100,000 in the hot bucket covered by Summary Range; `max_summary_ratio` 10% |
| Cron fields | min 0-59, hour 0-23, dom 1-31, month 1-12, dow 0-6 (0 = Sunday) |
| Sharing levels | `Owner` (Private), `App`, `All apps` (Global) |

## Decision rule

Transforming command present? Yes: Smart runs Fast, discovery off, pipeline holds **rows** not events, `_raw` gone, `_time` survives only if the command emitted it. No: Smart runs Verbose, discovery on, pipeline holds events. Everything downstream follows from that one question.

## Five facts they test

1. **Smart is the default**, and it flips to Fast behaviour the instant a transforming command appears.
2. **Inline `earliest`/`latest` override the Time Range Picker**, never the reverse. Time modifiers do not cross the subsearch boundary in either direction.
3. **The subsearch runs FIRST**, capped at 10,000 results and 60 seconds, and truncation is silent.
4. **`scanCount`** = read off disk, **`eventCount`** = matched the search terms, **`resultCount`** = rows returned. Sparse means `scanCount` >> `resultCount`.
5. **Search-time sequence**: field filters, inline extractions, transform extractions, automatic KV, field aliases, calculated fields, lookups, event types, tags. Calculated fields cannot see lookups; lookups cannot see event types or tags.

Bonus: `table` and `append` are on the official **transforming** list. `sort`, `eventstats`, `transaction`, `dedup`, `join`, `union` are **dataset processing**, not streaming.

## Trap IDs

T-00-01 Smart not Fast is default. T-00-02 Smart discovery is conditional. T-00-03 Verbose kills report acceleration. T-00-04 20% is of returned events. T-00-05 search bar beats picker. T-00-06 snap rounds down only. T-00-07 offset before snap. T-00-08 subsearch runs first. T-00-09 10,000 / 60s. T-00-10 format is AND-in-row, OR-between-rows. T-00-11 `table` is transforming. T-00-12 `sort` is dataset processing. T-00-13 scanCount is not eventCount. T-00-14 App sharing is one app only. T-00-15 orphaned + private cannot be reassigned in the UI. T-00-16 three acceleration mechanisms are distinct. T-00-17 calculated fields cannot reference lookups. T-00-18 `_time` is epoch, displayed in user timezone.
