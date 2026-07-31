# Errata: *Splunk Certified Study Guide* (Deep Mehta, Apress 2021), Part I

Every error below was verified by extracting the text from the PDF in this folder and reading the exact sentence. Quotes are literal. The book is still worth using for its structure and its worked UI walkthroughs. Its answer keys are not safe to memorise.

Page numbers are the printed numbers. To open a page in a PDF viewer, add the offset: printed 1-73 is +20, 75-99 is +19, 101-123 is +18, 125-160 is +17. Part I ends at printed 160 (PDF 177), not printed 177.

## Answer keys that contradict the book's own text

These are the dangerous ones, because the body teaches the correct thing and the key then teaches the opposite.

### Chapter 3, question C - the Field Extractor one-way door

Question: "Once a regular expression is edited, can you go back to the Field Extractor UI? 1. True 2. False". Key: **C: 1** (True).

The body of the same chapter, printed page 56, says: "Once the regular expression is edited, you cannot go back to Field Extractor UI."

**Correct answer: 2 (False).** Once you hand-edit the regex in the Field Extractor, the interactive highlight-and-select UI is no longer available for that extraction.

### Chapter 3, question D - delimiters and structured data

Question: "Are delimiters mostly used in structured data? 1. True 2. False". Key: **D: 2** (False).

**Correct answer: 1 (True).** Delimiter-based extraction exists precisely for structured data (CSV, TSV, pipe-separated). The book itself keys the same fact correctly in Chapter 7 question I ("Delimiters are used for ____ data", key I: 1, structured), so the book contradicts itself between chapters and Chapter 7 has the right version.

### Chapter 3, question E - what field aliases normalize over

Question: "Field aliases normalize data over which default fields? (Select all that apply.) 1. Host 2. Source 3. Source type 4. Events". Key: **E: 1, 2, and 4** (Host, Source, Events).

**Correct answer: 1, 2, 3 (host, source, sourcetype).** "Events" is not a default field and a field alias is scoped by host, source or sourcetype in the Splunk Web form. This one matters because scoping is exactly what the exam asks about in section 5.0.

### Chapter 4, question B - are field values case sensitive

Question: "In Splunk, field values are case insensitive by default. 1. true 2. false". Key: **b: 2** (false, i.e. the book asserts field values ARE case sensitive by default).

Chapter 2, printed page 30, says the opposite in prose: "Field names in Splunk are case sensitive, but the field values are case insensitive." Chapter 4, printed page 76, says: "Field values are case sensitive by default."

**The book contradicts itself and neither statement is complete.** The rule that actually holds is context dependent, so learn it as three separate facts rather than one: field NAMES are case sensitive everywhere; a bare search term or a `field=value` comparison in the `search` command is not case sensitive; a comparison inside `where` or `eval` IS case sensitive. See `topics/04-field-extractions.md` and `topics/02-filtering-and-formatting.md` for the verified statement of each. Treat any exam question phrased as a flat "are field values case sensitive" as asking about the `search` command unless it names `where` or `eval`.

### Chapter 4, question C - tags, event types, priority and colour

Question: "In Splunk, tags use event types. You can set the priority and color based on an event's importance. 1. true 2. false". Key: **c: 2** (false).

The same chapter walks you through creating an event type with a tag, the colour red, and priority 1.

Two problems. The key contradicts the chapter's own worked example, and the question conflates tags with event types. Colour and priority are properties of an **event type**, not of a tag. Event types can carry tags. If a question like this appears on the real exam, the fact being tested is that event types have colour and priority and can be tagged.

### Chapter 5, question B - the data model and Pivot relationship

Question: "What is the relationship between a data model and Pivot? 1. The data model provides a dataset for Pivot. ... 4. Pivot provides a dataset for the data model." Key: **b: 4**.

**Correct answer: 1.** The data model provides the dataset that Pivot consumes. Option 1 is even worded identically to the correct statement, so the key is simply the wrong number. This is objective 9.1 verbatim, so getting it backwards is expensive.

### Chapter 5, question E - child dataset inheritance

Question: "Child datasets inherit all datasets from the parent dataset. 1. true 2. false". Key: **e: 2** (false).

**Correct answer: 1 (true)**, for the concept being tested. A child dataset inherits all constraints and all fields from every ancestor and then narrows further. The question's wording is sloppy (a child inherits constraints and fields, not "datasets"), but the keyed answer teaches the wrong idea.

### Chapter 5, question F - CIM data model acceleration

Question: "Data models included in CIM are configured with data model acceleration turned on. 1. true 2. false". Key: **f: 1** (true).

The body of the same chapter, printed page 120, says: "Data models included in CIM are configured with data model acceleration turned off."

**Correct answer: 2 (false).** CIM data models ship with acceleration disabled. You enable it per model in the CIM add-on setup page.

### Chapter 1, question A - on-premises only

Question: "Splunk Enterprise components can only be installed and administered on-premises. 1. true 2. false". Key: **a: 1** (true).

**Correct answer: 2 (false).** Splunk Cloud Platform exists, and the book's own Part II installs Splunk on an AWS EC2 instance.

## Wrong content in the Chapter 2 function tables

Chapter 2 is a set of reference tables rather than a taught progression, and several rows have the wrong example or the wrong description pasted in. Do not learn eval functions from these tables. Use `reference/eval-functions.md` instead.

| Table | Row | What the book prints | What is correct |
|---|---|---|---|
| 2-9 (stats functions) | `var(field)` | Command shown as `\|stats mode(field_name)` | `\|stats var(field_name)` |
| 2-12 ("timechart Functions") | Whole table | Every command written as `\|stats per_day(...)` etc, under a heading that says timechart | These are `stats`/`timechart` rate functions; the heading and the examples do not agree |
| 2-12 | `per_minute(field)` | Command shown as `\|stats per_day(field_name)` | `\|stats per_minute(field_name)` |
| 2-16 (eval functions) | `coalesce(X,...)` | Described as "it evaluates X if true, return Y; otherwise, it returns Z" | That is `if(X,Y,Z)`. `coalesce` returns the first non-null argument |
| 2-16 | `null()` | Example shown as `\| eval n=nullif(fielda,fieldB)` | That is `nullif`'s example. `null()` takes no arguments and returns null |

Chapter 2 also calls the field-selection command "Field". The actual SPL command is `fields`.

## Invalid SPL printed as examples

Chapter 2's Boolean section prints two searches that will not run:

```spl
index="products"| product_website="amazon" AND "walmart"
```

A bare `field=value` filter cannot follow a pipe. It needs `| search product_website="amazon" AND product_website="walmart"`, and as written the two conditions can never both be true for a single-valued field anyway.

```spl
index="products"| error NOT(400 or 500)
```

Two faults: the same missing `search` command after the pipe, and a lowercase `or`. The same page states that Boolean operators must be capitalised.

## Chapter 7's "exam set" and how to use it

Nineteen questions labelled A through S on printed pages 155-158, with a bare answer key on 159 and no explanations. Its own key is mostly correct. Three problems with it as practice material:

**Four questions are verbatim duplicates of earlier chapter questions.** Q is Chapter 4's G, P is Chapter 4's F, R is Chapter 3's F, S is Chapter 5's A. So the effective count is 15 new questions.

**Three questions test Admin knowledge, not Power User knowledge.** A (forwarder, indexer, search head), B (what is on a standalone install), and C (the 500 MB per day trial limit) are SPLK-1003 material. They are not wrong, they are just off-blueprint for you.

**Two questions are mis-worded even though the intended fact is right.**

- Question M, "Tags are used for ____ pairs", is keyed 3 (both "field/value" and "key/value"). Splunk's term is field-value pair. On the real exam expect "field-value pair" as the only correct phrasing.
- Question R, "Field aliases appear in all fields and interesting fields if they appear at least ____", is keyed 20%. The underlying fact is right, but the subject should be *fields*, not field aliases, and the 20% threshold governs the **Interesting Fields** list only. All Fields shows every field regardless of frequency.

**Nothing in the set tests** `eval`, `stats`, `chart` or `timechart` syntax, `rex`, field aliases, calculated fields, workflow action types, CIM, `top`/`rare`, or knowledge object precedence. Between them those account for well over half the real exam. Chapter 7 is a warm-up, not a mock.

## Version drift, terminology, and other things that are simply old

The book is from 2021 and its documentation links point at Splunk 6.1.1 through 7.3.1. Against 9.x and 10.x, several things it teaches no longer describe the product.

- **Every docs URL in the book is stale.** `docs.splunk.com` now 301-redirects to `help.splunk.com` with restructured paths. Use `reference/doc-links.md` instead of the book's reference lists.
- **Deprecated terminology throughout**: "license master" and "slave", "whitelist" and "blacklist", "cluster master". Current Splunk uses manager and peer, allowlist and denylist. The exam uses current terminology.
- **The certification track described is the pre-2022 model.** The book routes you through "Splunk Fundamentals 1" and "Fundamentals 2", which Splunk retired. Its Admin exam facts (63 questions, $120) no longer match SPLK-1003 either.
- **Dashboards are Simple XML only.** Dashboard Studio shipped in Splunk 8.2 and is the default authoring experience in 10.x. Chapter 6's `<form>` and `<input>` listings still work but are the legacy path.
- **CIM setup is described as "Manage Apps, Splunk Common Information Model, indexes whitelist".** Current CIM uses a per-data-model index allowlist on the CIM Setup page.
- **The book claims editing `macros.conf` requires a Splunk restart.** For search-time knowledge objects a `debug/refresh` or an app reload is enough.
- **"The maximum size of the data in the parsing pipeline is 128MB"** conflates queue sizing with a hard parsing limit.

## Chapter-level scope warning

Chapter 1 is roughly 80% Admin content. It opens with "Overview of the Splunk **Admin** Exam", prints the full 17-section SPLK-1003 blueprint, and covers installing Splunk on macOS and Windows and hand-writing `props.conf` timestamp and line-breaking settings. None of that is on SPLK-1002.

The book never prints the SPLK-1001 or SPLK-1002 blueprints anywhere. Instead it drops claims like "you have covered 30% of the Power User blueprint" or "10% of Module 9" without ever telling you what those modules are, and the percentages it quotes do not match the current blueprint. Use `00-exam-overview.md` for the real thing.
