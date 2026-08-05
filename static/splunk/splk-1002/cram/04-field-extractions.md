# 4.0 Creating and Managing Fields (10%) - Cram

## Syntax

```spl
rex [field=<field>] ( <regex> [max_match=<int>] [offset_field=<string>] ) | (mode=sed <sed-expr>)
erex [<field>] examples=<string> [counterexamples=<string>] [fromfield=<field>] [maxtrainers=<int>]
extract [pairdelim=<string>] [kvdelim=<string>] [limit=<int>] [maxchars=<int>] [mv_add=<bool>] [clean_keys=<bool>] [segment=<bool>] [reload=<bool>] [auto=f] [<extractor-name>]
```

FX regex path: Select Sample, Select Method, Select Fields, Validate, Save.

FX delimiter path: Select Sample, Select Method, Rename Fields, Save.

Entry points: sidebar **Extract New Fields**; **All Fields > Extract new fields**; **Event Actions > Extract Fields**; **Settings > Fields > Field extractions > Open field extractor**; Home page **extract fields**; Add Data **Extract Fields**.

## Defaults and limits

| Item | Value |
| --- | --- |
| `rex field` | `_raw` |
| `rex max_match` | `1` (`0` = unlimited, >1 = multivalue) |
| `rex offset_field` | none |
| `rex` command type | distributable streaming, never filters |
| `erex fromfield` | `_raw` |
| `erex maxtrainers` | `100`, range 1-1000 |
| `erex` output regex | read from the **Job** menu |
| `extract` target field | `_raw` only, no `field=` argument |
| `extract limit` | `50` pairs |
| `extract maxchars` | `10240` |
| `extract mv_add` / `segment` / `reload` | `false` |
| `extract clean_keys` | value of `CLEAN_KEYS` in transforms.conf; `pairdelim`/`kvdelim` have no documented default |
| FX Save permissions | **Owner** (default), App, All apps |
| FX extraction name | cannot contain spaces |
| FX sample event limit | 20 lines |
| FX field name rule | starts with a letter, then letters, numbers, underscores |
| Delimiter auto-names | `field1`, `field2`, ...; rename at least one, not all |
| Delimiter choices | Space, Comma, Tab, Pipe, Other |
| Interesting Fields | field present in at least **20%** of returned events (sidebar display only) |
| Auto KV at search time | first **100** obvious `key=value` pairs |
| Named capture group | `(?<name>...)`, the form used in every docs example; `(?P<name>...)` is also documented and valid (PCRE) |
| FX regex method writes | `EXTRACT-<class>` in props.conf |
| FX delimiter method writes | `REPORT-<class>` in props.conf + `DELIMS`/`FIELDS` stanza in transforms.conf |
| Search-time order | filters, EXTRACT, REPORT, auto-KV, FIELDALIAS, EVAL, LOOKUP, eventtypes, tags |
| Default indexed fields | `host`, `index`, `linecount`, `punct`, `source`, `sourcetype`, `splunk_server`, `timestamp` |
| Internal fields | `_raw`, `_time`, `_indextime`, `_cd`, `_bkt` |
| Datetime fields | `date_hour`, `date_mday`, `date_minute`, `date_month`, `date_second`, `date_wday`, `date_year`, `date_zone` |

## Decision rule

Structured, consistent positions, one separator character: **FX Delimiters**. Unstructured log text with recognisable surrounding literals: **FX Regular Expression**. Needed once in one search: `rex`. Needed permanently by others: FX saved as App or All apps. Know example values but not the regex: `erex`, then paste its regex. Redact or reshape an existing value: `rex mode=sed`. Reparse `key=value` text with odd separators: `extract pairdelim= kvdelim=`. Source is a field other than `_raw`: `rex field=` or `erex fromfield=`, never `extract`.

## Five facts they test

1. FX creates search-time extractions only. Retroactive to all indexed events, no reindex, no restart.
2. Save defaults to **Owner**, so the field is invisible to everyone else until set to App or All apps.
3. **Validate** and counterexamples exist only on the regex path. **Rename Fields** exists only on the delimiter path.
4. Case sensitivity by context: field NAMES yes, field VALUES no, bare keywords no, `CASE()` yes on purpose, `eval` and `where` expressions YES, tag names no (they are values), the field name in `tag::<field>` yes, lookup matching yes (`case_sensitive_match` default true), regex yes (PCRE).
5. `rex` emits every input event, matched or not. `regex` filters. `max_match` defaults to 1.

Bonus: `eventtype` and `tag` are NOT default fields. **Event Actions > Extract Fields** starts on Select Method, everything else on Select Sample. After previewing a manually edited regex you cannot return to the highlighting UI.

## Trap IDs

T-04-01 FX needs a reindex. T-04-02 `rex` makes a knowledge object. T-04-03 Validate on delimiter path. T-04-04 Save defaults to App. T-04-05 field values not case sensitive, names are. T-04-06 `eventtype`/`tag` are default fields. T-04-07 20% rule affects extraction. T-04-08 `rex` requires `field=`. T-04-09 `max_match` default unlimited. T-04-10 `erex` persists. T-04-11 always able to undo a regex edit. T-04-12 `extract` takes `field=`. T-04-13 must rename all delimiter fields. T-04-14 FX always writes the same conf. T-04-15 delimiters are for structured data, not unstructured. T-04-16 Event Actions starts at Select Sample. T-04-17 delimiter extraction editable as regex. T-04-18 sample and extraction limits.
