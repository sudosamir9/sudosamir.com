# 7.0 Creating and Using Macros (10%) - cram

## Syntax

```spl
`mymacro`
`argmacro(120,300)`
`argmacro(lo=120,hi=300)`
`argmacro(hi=300,lo=120)`
| `mygeneratingmacro`
`mymacro("He said \"hello!\"")`
```

```ini
[bc_status_band(2)]
args = lo, hi
definition = index=web sourcetype=access_combined status>=$lo$ status<$hi$
validation = isnum($lo$) AND isnum($hi$)
errormsg = Both lo and hi must be numeric HTTP status codes.
iseval = false
description = Web access events in a half-open status range.
```

- UI path: Settings, Advanced search, Search macros, New.
- Name carries the argument COUNT: two arguments means `mymacro(2)`.
- Arguments field: bare names, comma-delimited, in order, no dollar signs.
- Definition: tokens as `$argname$`. Literal dollar sign: `$$` [verify].
- Preview expansion: Control-Shift-E (Command-Shift-E on macOS).

## Defaults and limits

| Item | Value |
| --- | --- |
| Invocation delimiter | Backtick, both sides |
| Stanza name form | `<name>` or `<name>(<numargs>)` |
| args | Default none. Alphanumerics, underscores, hyphens. No repeats. Ignored if stanza takes no args |
| definition | Default none, required. `$arg$` replaced globally, even inside quotation marks |
| validation | Default none. Boolean: true passes, false or NULL fails. Non-Boolean: NULL passes, returned string fails and is the message |
| errormsg | Default none. Used only by the Boolean form of validation |
| iseval | Default false. true means definition is an eval expression returning the expansion string |
| description | Default none, optional |
| Destination app | Default: current app context |
| Nesting | Indefinite; cycles detected and error |
| limits.conf [search] max_macro_depth | Default 100, minimum 1 |
| Macro reference inside quoted value | Not expanded |
| Hyphen in macro name | Unsupported by the Search app |
| macros.conf restart | Not required; search-time file, use `/en-US/debug/refresh` |

## Decision rule

| If | Then |
| --- | --- |
| Chunk never varies | Zero-argument macro |
| Chunk varies by a value | Arguments, count in the name, `$name$` in definition |
| Chunk varies by a whole option | Pass the option text as the argument value, e.g. `span=1h` |
| Expansion text chosen conditionally | Use eval-based definition, return a string |
| One bad-input condition | Boolean validation plus Validation error message |
| Several bad-input conditions | `validate(cond1,"msg1",cond2,"msg2")`, non-Boolean, errormsg unused |
| Definition starts with a generating command | Pipe goes before the backtick, not in the definition |
| Needed outside the owning app | Share All apps; admin or power role required |
| Unsure what ran | Control-Shift-E |

## Five facts they test

1. Backticks invoke a macro. Single or double quotation marks do not.
2. `mymacro(2)` is stored because it takes two arguments; it is invoked as `` `mymacro(foo,bar)` ``.
3. Arguments field has no dollar signs; Definition has `$arg$` tokens.
4. Validation failure is an error before dispatch, not zero results.
5. Macro expansion is textual and precedes parsing, so macros never appear in the search-time operations sequence (field filters, field extractions, field aliases, calculated fields, lookups, event types, tags).

## Trap IDs

T-07-01 backticks not quotes, T-07-02 number is the argument count, T-07-03 Arguments bare vs Definition tokens, T-07-04 references inert in quotes but tokens substituted in quotes, T-07-05 Boolean vs non-Boolean validation asymmetry, T-07-06 validation failure is an error, T-07-07 no restart for macros.conf, T-07-08 macros absent from the search-time operations sequence, T-07-09 leading pipe outside the definition, T-07-10 hyphens legal in arg names, hostile in macro names, T-07-11 overloading by argument count creates distinct macros, T-07-12 named arguments are order-independent, T-07-13 iseval returns the expansion string, T-07-14 app scope decides whether the macro resolves.
