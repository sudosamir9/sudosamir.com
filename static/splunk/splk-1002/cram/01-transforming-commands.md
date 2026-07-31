# Cram: 1.0 Using Transforming Commands for Visualizations (5%)

## Syntax

```spl
chart [<chart-options>] [agg=<term>] (<stats-agg-term>|<sparkline-agg-term>|"("<eval-expr>")")...
      [BY <row-split> <column-split>] | [OVER <row-split>] [BY <column-split>] [<dedup_splitvals>]

timechart [sep=] [format=] [partial=] [cont=] [limit=] [agg=] [<bin-options>...]
      ( <single-agg> [BY <split-by-clause>] | (<eval-expr>) BY <split-by-clause> ) [<dedup_splitvals>]

top  [<N>] [<top-options>...]  <field-list> [BY <field-list>]
rare [<rare-options>...]       <field-list> [BY <field-list>]
untable  <x-field> <y-name-field> <y-data-field>
xyseries [grouped=<bool>] <x-field> <y-name-field> <y-data-field>... [sep=] [format=]
```

`chart BY a b` is identical to `chart OVER a BY b`. `a` = row-split = first column = X-axis. `b` = column-split = data series.

## Defaults and limits

| Option | chart | timechart | top | rare |
| --- | --- | --- | --- | --- |
| `limit` | `top 10` (columns; only with a column-split; `0` = all) | `top10` split values (`0` = all, no filtering) | `10` (`0` = all to `maxresultrows`) | `10` |
| `<N>` positional | n/a | n/a | `10` | not documented |
| `useother` | `true` | `true` | `false` | not documented |
| `otherstr` | `OTHER` | `OTHER` | `OTHER` | not documented |
| `usenull` | `true` | `true` | n/a | n/a |
| `nullstr` | `NULL` | `NULL` | n/a | n/a |
| `cont` | `true` | `true` | n/a | n/a |
| `bins` | `300` (max, not target) | `100` (max, not target) | n/a | n/a |
| `span` | none | none (falls back to `bins=100` or picker preset) | n/a | n/a |
| `partial` | not available | `true` | n/a | n/a |
| `fixedrange` | not available | `true` | n/a | n/a |
| `dedup_splitvals` | `false` | `false` | n/a | n/a |
| `sep` / `format` | no default stated | no default stated | n/a | n/a |
| `countfield` / `percentfield` | n/a | n/a | `count` / `percent` | `count` / `percent` |
| `showcount` / `showperc` | n/a | n/a | `true` / `true` | `true` / `true` |
| `start`, `end`, `aligntime`, `agg` | none | none (+ `minspan` none) | n/a | n/a |
| `grouped` (xyseries) | `false` (streaming; `true` = transforming) | | | |
| Max results | | | 50,000 (`maxresultrows`, `[top]`) | 50,000 (`[rare]`) |

Default `timechart` spans with no `span=`: 15m gives 10s, 60m gives 1m, 4h gives 5m, 24h gives 30m, 7d gives 1d, 30d gives 1d, previous year gives 1mon.

## Decision rule

X-axis must be time, use `timechart` (only one BY field). X-axis is any other field, use `chart` (`OVER` row-split, `BY` column-split). One row per unique field combination, use `stats` (any number of BY fields). Pie needs exactly 2 columns. Column/bar/line need 2+ columns, area needs 3+. Scatter needs 3 columns in marker, X, Y order (`table` fixes order). Single value with sparkline and trend arrow needs `timechart`, `stats` gives neither. Trellis needs a transforming command last plus the split field in results. `stats` shape to `chart` shape use `xyseries x y n`, reverse with `untable`.

## Five facts they test

1. `limit` caps COLUMNS (series) on `chart`/`timechart`, not rows; default is top 10, and excess values pool into `OTHER` because `useother=true`.
2. `NULL` comes from `usenull` (events missing the split field); `OTHER` comes from `useother` (values excluded by limit or where-clause). Both default true on `chart` and `timechart`.
3. `bins` default is 300 on `chart` and 100 on `timechart`, and it is a maximum, not a target. If both `bins` and `span` are given to `timechart`, `span` wins and `bins` is ignored.
4. `timechart` accepts exactly one BY field because `_time` is already the row-split; `chart` accepts two; `stats` accepts many. `partial` and `fixedrange` exist only on `timechart`.
5. `useother` defaults to `false` on `top`. Put `span`/`bins` BEFORE the split-by field or they bin the split field instead of time. Same field cannot be both a function argument and the split field.

Extras: `sparkline()` works with `chart` and `stats` only, never `timechart`. `per_day/per_hour/per_minute/per_second` are `timechart`-only aggregations and do NOT set the span. Only week spans work with snap-to-time (`span=w@w1`). An explicit `<where-clause>` makes `limit` and `agg` ignored. `table` is a transforming command; `untable` and `xyseries` (with `grouped=false`) are streaming.

## Trap IDs

T-01-01 limit caps columns. T-01-02 timechart takes one BY field. T-01-03 OVER vs BY ordering. T-01-04 NULL vs OTHER. T-01-05 bins 300 vs 100. T-01-06 span beats bins. T-01-07 top useother=false. T-01-08 rare has no documented useother. T-01-09 partial/fixedrange are timechart only. T-01-10 stats BY a b vs chart BY a b. T-01-11 field reused in function and split. T-01-12 span placement before split-by. T-01-13 week-only snap-to spans. T-01-14 table is transforming but aggregates nothing. T-01-15 sparkline excludes timechart. T-01-16 per_* do not set span. T-01-17 limit=0 means all. T-01-18 xyseries is streaming by default. T-01-19 where-clause disables limit and agg. T-01-20 rare has no positional N.
