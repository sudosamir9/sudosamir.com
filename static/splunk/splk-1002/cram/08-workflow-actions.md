# 8.0 Workflow Actions - Cram

Path: Settings, Fields, Workflow actions, Add new. Config: `workflow_actions.conf`.

## Syntax

```ini
[<name>]                          # Name = internal, stanza header
type = <link|search>              # ONLY two values
label = <text with $field$>       # what the user sees
fields = <comma list>             # ALL must be present (AND)
eventtypes = <comma list>
display_location = <field_menu|event_menu|both>

link.uri = http://x/?q=$field$    # values auto URI-encoded
link.target = <blank|self>
link.method = <get|post>
link.postargs.1.key = title       # post only, sent in BODY
link.postargs.1.value = err $status$

search.search_string = index=web user="$User$" | stats count
search.app = <app>
search.view = <view>
search.target = <blank|self>
search.earliest = -24h
search.latest = now
search.preserve_timerange = <bool>
```

Tokens: `$field$`, `$_raw$`, `$!field$` (no escaping), `$@field_name$` / `$@field_value$` (field menus only), `$@sid$`, `$@offset$`, `$@namespace$`, `$@latest_time$`.

## Defaults and limits

| Setting | Values | Default |
| --- | --- | --- |
| `type` | `link`, `search` | none, required (skipped if unset) |
| `label` | text + tokens | none, required (skipped if unset) |
| `fields` | list, wildcards | `*` (all fields) |
| `eventtypes` | list, wildcards | none (no restriction) |
| `display_location` | `field_menu`, `event_menu`, `both` | `both` |
| `disabled` | `True`, `False` | `False` |
| `link.uri` | URL + tokens | none, required for link |
| `link.target` | `blank`, `self` | `blank` (new window) |
| `link.method` | `get`, `post` | `get` |
| `link.postargs.<int>.<key/value>` | text + tokens | none (post only) |
| `search.search_string` | SPL + tokens | none, required for search |
| `search.app` | app name | current app |
| `search.view` | view name | current view |
| `search.target` | `blank`, `self` | as `link.target` |
| `search.earliest` / `search.latest` | abs or rel time | none (all time) |
| `search.preserve_timerange` | boolean | `false` |

UI to conf: Action type = `type`; Show action in = `display_location`; Open link in / Run search in = `.target`; Link method = `link.method`; URI = `link.uri`; Search string = `search.search_string`.

## Decision rule

| Need | Type |
| --- | --- |
| External system, values fit a query string | GET: `type = link` + `link.method = get` |
| External system, needs a body / `$_raw$` / values out of the URL / creates a record | POST: `type = link` + `link.method = post` + `link.postargs` |
| Stay in Splunk, run more SPL | Search: `type = search` |
| Inherit analyst's window | `preserve_timerange = true` AND no earliest/latest |
| Fixed lookback | `search.earliest` / `search.latest` (checkbox then ignored) |

## Five facts they test

1. Action type has TWO values (`link`, `search`); GET vs POST is `link.method`.
2. `link.target` and `search.target` default to `blank` = NEW window.
3. Blank "Apply only to" = `fields = *` + `display_location = both` = appears everywhere; multiple fields are ANDed.
4. POST args go in the request BODY, HTTP-form encoded, never the query string.
5. `link.uri` tokens are auto URI-encoded; `search.search_string` tokens are NOT escaped (quote them yourself). `preserve_timerange` is ignored if either bound is set.

## Trap IDs

T-08-01 type is link/search not get/post/search - T-08-02 target default blank = new window - T-08-03 link.method defaults to get - T-08-04 blank fields means all fields - T-08-05 field list is AND not OR - T-08-06 postargs in body not URL - T-08-07 URI encoded, search string not - T-08-08 preserve_timerange ignored if earliest/latest set - T-08-09 `$@field_value$` not available in event menus - T-08-10 Name internal vs Label displayed and tokenized - T-08-11 workflow action is click-only, creates no field, is not an alert action - T-08-12 display_location defaults to both - T-08-13 private until shared, admin/power promote - T-08-14 search.app/search.view default to current app/view
