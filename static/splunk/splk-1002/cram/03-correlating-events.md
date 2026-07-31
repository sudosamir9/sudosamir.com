# 3.0 Correlating Events (15%) - cram

## Syntax

```spl
transaction [<field-list>] [name=<txn-name>] [<txn_definition-options>] [<memcontrol-options>] [<rendering-options>]
```

```spl
txn_definition = maxspan | maxpause | maxevents | startswith | endswith | connected | unifyends | keeporphans
memcontrol     = maxopentxn | maxopenevents | keepevicted
rendering      = delim | mvlist | mvraw | nullstr
filter-string  = <search-expression> | (<quoted-search-expression>) | eval(<eval-expression>)

sourcetype=access_* | transaction JSESSIONID clientip startswith="view" endswith="purchase" maxspan=30m | where duration>0
sourcetype=access_* | stats range(_time) AS duration, count AS eventcount, values(action) AS actions BY JSESSIONID
```

## Defaults and limits

| Option | Default | Note |
| --- | --- | --- |
| `maxspan` | `-1` (no limit) | earliest to latest; negative deactivates; needs descending `_time` |
| `maxpause` | `-1` (no limit) | gap between consecutive events; negative deactivates; needs descending `_time` |
| `maxevents` | `1000` | negative deactivates |
| `startswith` | none / empty string | closes a transaction (reverse chronological processing) |
| `endswith` | none / empty string | does NOT set `closed_txn=1` |
| `connected` | `true` | only when a field list is given |
| `unifyends` | `true`, same default as `connected` | follows `connected` |
| `keeporphans` | `false` | orphans get `_txn_orphan=1` |
| `keepevicted` | `false` (`0`) | evicted get `closed_txn=0` |
| `maxopentxn` | from `limits.conf [transactions]`, shipped `5000` | LRU eviction |
| `maxopenevents` | from `limits.conf [transactions]`, shipped `100000` | LRU eviction |
| `mvlist` | `false` | `false` = unique set, alphabetical; `true` = list, arrival order |
| `mvraw` | `false` | makes `_raw` multivalue |
| `delim` | `" "` (whitespace) | value separator |
| `nullstr` | `NULL` | missing value placeholder in lists |
| `match` | `closest` only supported value | |
| Fields created | `duration` (seconds), `eventcount`, `closed_txn` | output also carries `linecount`, `field_match_sum` |
| `_time` of result | timestamp of the EARLIEST member | |
| `_raw` of result | raw text of every member | |
| Events shown per txn | first `5`, rest collapsed | |
| `transaction` type | centralized streaming (search head only) | |
| `stats` type | transforming (distributable reduce) | |
| `join` | `type=inner`, `max=1`, `usetime=false`, `earlier=true`, `overwrite=true` | 50,000 rows / 60 s cap |
| `append` / `appendcols` / `union` | `maxout=50000`, `maxtime=60`; `override=false`; `timeout=60`/`300` | no `transaction` after `append` |
| `selfjoin` | `keepsingle=false`, `max=1`, `overwrite=true` | main results capped at 100,000 |

## Decision rule

| Need | Command |
| --- | --- |
| Unique ID + aggregates only; large or distributed | `stats` |
| Raw event text preserved in the group | `transaction` |
| ID reused over time | `transaction ... maxspan=/maxpause=` |
| Group bounded by a start or end message | `transaction ... startswith=/endswith=` |
| Sequence, not a shared key | `transaction` |
| After an `append` | `stats` (never `transaction`) |
| Small static right-side dataset | `lookup` before `join` |

## Five facts they test

1. `maxspan` and `maxpause` default to `-1` (no limit); only `maxevents` has a positive default, `1000`.
2. `closed_txn=1` only when `maxevents`, `maxspan`, `maxpause`, or `startswith` is specified. `endswith` alone leaves it `0`.
3. `transaction` creates `eventcount`, not `count`; `duration` is in seconds and is `0` for a one-event transaction.
4. `_time` of the transaction is the earliest member's timestamp; `_raw` is the concatenated raw text of all members.
5. Input must be in descending chronological order; `| sort -_time` goes immediately before `| transaction`, and ascending input silently returns wrong results.

## Trap IDs

T-03-01 `-1`/`-1`/`1000`. T-03-02 descending order. T-03-03 `duration` seconds. T-03-04 `_time` earliest. T-03-05 `endswith` never closes. T-03-06 `_txn_orphan=1`. T-03-07 `mvlist=false` set. T-03-08 `unifyends` follows `connected`. T-03-09 transforming vs centralized streaming. T-03-10 `eventcount` not `count`. T-03-11 no `transaction` after `append`. T-03-12 `first`/`last` vs `earliest`/`latest`. T-03-13 `values()` vs `list()`. T-03-14 negative deactivates. T-03-15 not regex. T-03-16 field list not strict AND. T-03-17 `join max=1`. T-03-18 `connected` needs fields. T-03-19 `1000` is settable. T-03-20 `keepevicted` vs `keeporphans`.
