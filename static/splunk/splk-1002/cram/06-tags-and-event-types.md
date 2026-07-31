# 6.0 Creating Tags and Event Types (10%) - cram

## Syntax

```spl
tag=<tagname>
tag::<field>=<tagname>
tag::eventtype=IP-*
tag::host=*local*
NOT tag::eventtype=*
eventtype=<name>
tag=router tag=SF NOT (tag=Building1)
```

```ini
# tags.conf - one field-value pair per stanza, one tag per line, no quotes
[<fieldname>=<value>]
<tag> = <enabled|disabled>

[eventtype=nessus]
vulnerability = enabled
```

```ini
# eventtypes.conf
[$EVENTTYPE]
disabled = <1|0>
search   = <string>
description = <string>
priority = <integer>
color    = <string>
```

UI paths: Settings, Tags, (List by field-value pair | List by tag name | All unique tag objects). Event row, Actions arrow, Edit Tags. Save As, Event Type. Settings, Event Types, New. Event Actions, Build Event Type.

## Defaults and limits

| Item | Values | Default |
| --- | --- | --- |
| `priority` | integer 1 to 10, **1 = best, 10 = worst** | none (attribute omitted) |
| `color` | none, et_blue, et_green, et_magenta, et_orange, et_purple, et_red, et_sky, et_teal, et_yellow | `none` |
| `disabled` (eventtypes.conf) | 1 or 0 | none stated; "set to 1 to disable", so no line means active |
| `search` (eventtypes.conf) | no pipe after simple search, no subsearch, no `savedsearch` | none, required |
| `description` | free text | none |
| `tags` (eventtypes.conf) | free text | none, **DEPRECATED**, use tags.conf |
| tags.conf `<tag>` | enabled / disabled | none stated; write it explicitly |
| Event type Name | unique string | none, required |
| Destination App | app name | current app context |
| Tag name case | value semantics, not case sensitive | n/a |
| Field name case | case sensitive | n/a |
| Web-created objects land in | `$SPLUNK_HOME/etc/users/<user>/<app>/local/` | private |
| Sharing | Private, App, All apps | Private |

Search-time order: field filters, inline extraction, transform extraction, auto KV, field aliases, calculated fields, lookups, **event types (8)**, **tags (9)**.

## Decision rule

| Need | Object |
| --- | --- |
| Name a set of values of one field | Tag |
| Many names on one value | Multiple tags on one pair |
| Name a whole event category | Event type |
| Classifier needs a pipe / stats / subsearch | Report or macro, never an event type |
| Reusable search fragment | Search macro |
| Saved search you run | Report |
| Two event types, one colour | Better (lower) priority wins |
| Restrict tag search to one field | `tag::<field>=` |
| Event type using a lookup output field | Legal (7 before 8) |
| Calculated field using `eventtype` | Impossible (6 before 8) |
| Make a sourcetype CIM compliant | Event type, then tag the event type |

## Five facts they test

1. A tag attaches to a **field-value pair**, not to an event and not to a field.
2. An event type search cannot contain a pipe after the simple search, a subsearch, or `savedsearch`.
3. Priority is 1 to 10 and **1 is best**; it sets display order and decides which single colour renders.
4. `eventtype` is set at search time and becomes **multivalue** when an event matches two or more event types.
5. Tags run **last** in the search-time sequence, immediately after event types, which is why `tag::eventtype=` works.

## Trap IDs

T-06-01 tag targets field-value pair. T-06-02 double colon `tag::`. T-06-03 no pipe in event type. T-06-04 no `savedsearch` in event type. T-06-05 priority 1 is best. T-06-06 priority also drives colour. T-06-07 `eventtype` is multivalue. T-06-08 event type vs report. T-06-09 search-time sequence consequences. T-06-10 three Settings, Tags views and cross-app disable. T-06-11 `tags` attribute deprecated, use tags.conf. T-06-12 field names case sensitive, values not. T-06-13 Apress answer key error on question C. T-06-14 tagging does not change the field value.
