# 5.0 Field Aliases and Calculated Fields (10%) - Cram

## Syntax

```ini
[<sourcetype>|source::<source>|host::<host>]
FIELDALIAS-<class> = (<orig_field_name> AS|ASNEW <new_field_name>)+
EVAL-<fieldname>   = <eval statement>
```

Alias UI: Settings, Fields, Field aliases, New Field Alias. Form: Destination app, Name, Apply to (sourcetype / source / host) named, Field aliases (existing on the left, new alias on the right), Overwrite field values.

Calc field UI: Settings, Fields, Calculated Fields row, Add new. Form: Destination app, Apply to named, Name, Eval expression. Expression is the right-hand side only: no `eval` keyword, no `fieldname =`.

Valid: `FIELDALIAS-v = VendorID AS vendor_id VendorID AS vendor_name`

Invalid: `FIELDALIAS-f = userID AS user loginID AS user` (use `EVAL-user = coalesce(userID, loginID)`)

## Defaults and limits

| Item | Value |
| --- | --- |
| Search-time sequence | 1 field filters, 2 EXTRACT, 3 REPORT, 4 KV_MODE, 5 FIELDALIAS, 6 EVAL, 7 LOOKUP, 8 event types, 9 tags |
| `FIELDALIAS-<class>` default | No default |
| `EVAL-<fieldname>` default | No default |
| Overwrite field values | Not selected by default (writes `ASNEW`); selected writes `AS` |
| `AS` when dest exists | Value replaced by original |
| `AS` when original missing or empty | Destination removed |
| `ASNEW` when dest exists | Destination unchanged |
| `ASNEW` when original missing or empty | Destination kept |
| `ASNEW` introduced | Splunk 7.2.4 |
| Alias name characters | `a-z`, `A-Z`, `0-9`, `_` |
| Aliases per field | Many. One alias maps to exactly one field |
| Alias reading another alias | Only if the referenced alias's `<class>` sorts earlier. Step 5 runs in lexicographical order by class |
| `EVAL-` prefix case | `EVAL` not case-sensitive, hyphen required, `<fieldname>` IS case sensitive |
| Multiple `EVAL-` in one stanza | Processed in parallel, never chained |
| Calc field vs same-named extraction | Calculated field wins, even when the expression returns null |
| Scope choices | host, source, source type. Nothing else |
| Wildcards in "named" | Supported |
| Sharing on creation | Private to creator |
| Alias to `_time` or other internal field | Unsupported, unpredictable results |
| Alias collision, two `AS` configs | Classes applied in lexicographical order, last one wins |
| Calc field on an aliased source | Not supported. Filter with `if()` inside the expression instead |

## Decision rule

Alias adds a name, `rename` replaces one. Alias if the value already exists under another name. Calculated field if the value must be derived, or if two source fields collapse into one name via `coalesce`. `eval` or `rename` in SPL if it only matters for this search. Anything reading a lookup output field goes in SPL after the lookup, never in a calculated field.

Can reference: alias reads extractions only. Calc field reads extractions and aliases. Lookup reads extractions, aliases, calc fields. Event type reads all four. Tags read anything, including event types.

Ordering inside a step is lexicographical by class for extractions, aliases and lookups, and priority then lexicographical for event types. That is the only way one object can consume another of the same type.

## Five facts they test

1. The original field survives aliasing. Both names return the same events.
2. `EVAL-` statements in one stanza run in parallel. `EVAL-response_time = response_time/1000` followed by `EVAL-bitrate = bytes*1000/response_time` still divides by milliseconds.
3. The Eval expression box holds `round(bytes/1024, 2)`, never `eval kb = round(bytes/1024, 2)`.
4. You cannot alias a calculated field, a lookup output field, an event type, or a tag. Silent failure, no error.
5. A calculated field referencing a lookup output field is the one ordering violation that raises a visible error message.

## Trap IDs

T-05-01 alias renames | T-05-02 alias vs rename | T-05-03 one alias, many originals | T-05-04 Overwrite default | T-05-05 calc reads lookup | T-05-06 alias a calc field | T-05-07 EVAL parallel | T-05-08 eval keyword in form | T-05-09 calc overrides on null | T-05-10 usable pre-pipe | T-05-11 scope triple | T-05-12 calc on aliased source | T-05-13 conf setting names | T-05-14 private on creation | T-05-15 aliasing `_time`
