# 2.0 Filtering and Formatting Results (10%) - cram

## Syntax

```spl
eval <field>=<expression>["," <field>=<expression>]...
where <eval-expression>
search <logical-expression>
fillnull [value=<string>] [<field-list>]
filldown <wc-field-list>
fieldformat <field>=<eval-expression>
```

Signatures: `case(<condition>,<value>,...)`, `if(<predicate>,<true>,<false>)`, `coalesce(<values>)`, `nullif(<f1>,<f2>)`, `null()`, `true()`, `validate(<condition>,<value>,...)`, `in(<field>,<list>)`, `like(<str>,<pattern>)`, `match(<str>,<regex>)`, `cidrmatch(<cidr>,<ip>)`, `tostring(<value>,<format>)`, `tonumber(<str>,<base>)`, `mvindex(<mv>,<start>,<end>)`, `substr(<str>,<start>,<length>)`, `split(<str>,<delim>)`, `strftime(<time>,<format>)`, `strptime(<str>,<format>)`, `typeof(<value>)`.

## Defaults and limits

| Item | Default / limit |
| --- | --- |
| `fillnull value=` | `0` |
| `fillnull` field list | all fields; no wildcards; a named missing field is created |
| `fillnull` command type | distributable streaming with a field list, dataset processing without |
| `filldown` field list | all fields; `*` wildcards allowed; no previous value leaves NULL |
| `fieldformat` expressions per command | exactly 1 |
| `eval` / `where` / `fieldformat` / `search` after a pipe | distributable streaming |
| `search` as first command | event-generating |
| `search timeformat` | `%m/%d/%Y:%H:%M:%S` |
| `case` / `validate` with no match | NULL |
| `tostring` formats | `binary`, `hex`, `commas` (2 decimals), `duration` (`HH:MM:SS`) |
| `tonumber` / `toint` / `todouble` base | 10, range 2 to 36 |
| `printf` precision for `%f`, `%e`, `%a` | 6 |
| `ltrim` / `rtrim` / `trim` chars | spaces and tabs |
| `substr` length | rest of string; index starts at **1** |
| `mvindex` end | none; index starts at **0**, `-1` is last, out of range is NULL |
| `mvzip` delimiter | `,` |
| `mvrange` end value | excluded |
| `mv_to_json_array` infer_types | `false` |
| `log` base | 10 |
| `round` precision | integer; negative precision rejected |
| eval numeric precision | 17 significant digits, -2^53+1 to 2^53-1; division by zero gives null |

## Decision rule

| Need | Command |
| --- | --- |
| Filter on indexed terms or field-value pairs | base search, before first pipe |
| Field vs literal, mid-pipeline | `search` or `where` |
| Field vs field | `where` only |
| Evaluation function or arithmetic in the predicate | `where` only |
| Wildcard | `search` uses `*`; `where` uses `like()` with `%` and `_` |
| Case-sensitive match | `where`, or `search` with `CASE()` |
| Keep events missing the field | `NOT field="v"` |
| Drop events missing the field | `field!="v"` |
| Constant in empty cells | `fillnull` |
| Previous row's value in empty cells | `filldown` |
| Display only, value unchanged for sort and export | `fieldformat` |
| Value actually changed, including export | `eval` |
| Boolean result into a field | wrap in `if`, `case`, `validate`, or `tostring` |

## Five facts they test

1. `fillnull` default value is `0`, not blank and not `NULL`; bare `| fillnull` fills every field.
2. `search` cannot compare two fields; it reads the right-hand bare word as a literal string. `where` can.
3. Boolean precedence: `search` does OR before AND; `eval` and `where` do AND before OR. `search` has no `XOR`.
4. `NOT field="v"` keeps events with no `v` field; `field!="v"` drops them. `NOT field=*` returns null-field events; `field!=*` returns nothing.
5. `eval` cannot assign a Boolean; `coalesce` returns the first non-NULL argument; `nullif` returns NULL when two fields match; `case` returns NULL with no default.

## Trap IDs

T-02-01 two-field compare in `search`; T-02-02 Boolean precedence by command; T-02-03 `NOT` vs `!=`; T-02-04 case sensitivity split (field names yes, `search` values no, `where` yes); T-02-05 `coalesce` is not `if`; T-02-06 `null()` is not `nullif()`; T-02-07 `case` defaults to NULL; T-02-08 `eval` cannot store a Boolean; T-02-09 no `*` wildcard in `where`; T-02-10 `IN` operator vs `in()` function; T-02-11 `fillnull` default `0`; T-02-12 no wildcards in `fillnull` field list; T-02-13 `fillnull` vs `filldown`; T-02-14 all-null field is invisible to `fillnull`; T-02-15 `fieldformat` does not change the value or exports; T-02-16 `mvindex` from 0, `substr` from 1; T-02-17 `eval` command vs calculated field; T-02-18 no `_raw` after a transforming command; T-02-19 `tostring` format keywords.
