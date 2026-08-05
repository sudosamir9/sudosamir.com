# SPLK-1002: Splunk Core Certified Power User

A self-contained study system for the Splunk Core Certified Power User exam, built entirely from `help.splunk.com` 10.4. Everything you need is in this folder: the concepts, the option defaults, worked SPL against a practice dataset you install locally, the traps, and a 200-question exam simulator. No other book or course is required.

If you want a video course alongside it, "Splunk: Zero to Power User" by Hailie Shaw on Udemy is a reasonable companion for building intuition. It is not a prerequisite for anything here.

Start with [`00-exam-overview.md`](00-exam-overview.md).

## The exam in four lines

65 questions, 60 minutes (three of which are the exam agreement), $130, no prerequisite exam. Splunk publishes no passing score, so ignore the "70%" that circulates. Ten blueprint sections; the heaviest is 3.0 Correlating Events at 15%. **Lookups, dashboards, reports and alerts are not on this exam**, however much space they get in general Splunk training.

## Reading order

**1. Orient.** [`00-exam-overview.md`](00-exam-overview.md) for the verified blueprint, weights and what the exam is not.

**2. Set up the lab.** [`lab-setup.md`](lab-setup.md). About twenty minutes on your local 10.x instance. Every topic file ends with an exercise that assumes this is done.

**3. Read the one file that carries 50% of the exam.** [`reference/knowledge-object-precedence.md`](reference/knowledge-object-precedence.md). Sections 4, 5, 6, 9 and 10 all reduce to the search-time operation order. Read it before the topic files, not after.

**4. Work the sections.** In blueprint order, or heaviest first if you are short on time. Each file is concept, every option with its default, output shape, worked SPL, decision rules, traps, a lab, self-check questions, and the docs to read. Read the topic file first, then its pages in [`reference/docs-by-blueprint.md`](reference/docs-by-blueprint.md), which numbers all 154 documentation pages in blueprint order from 1.1 through 10.3.

| File | Section | Weight |
|---|---|---|
| [`topics/00-foundations-refresher.md`](topics/00-foundations-refresher.md) | Assumed knowledge, off blueprint | - |
| [`topics/01-transforming-commands.md`](topics/01-transforming-commands.md) | 1.0 Using Transforming Commands for Visualizations | 5% |
| [`topics/02-filtering-and-formatting.md`](topics/02-filtering-and-formatting.md) | 2.0 Filtering and Formatting Results | 10% |
| [`topics/03-correlating-events.md`](topics/03-correlating-events.md) | 3.0 Correlating Events | **15%** |
| [`topics/04-field-extractions.md`](topics/04-field-extractions.md) | 4.0 Creating and Managing Fields | 10% |
| [`topics/05-aliases-and-calculated-fields.md`](topics/05-aliases-and-calculated-fields.md) | 5.0 Creating Field Aliases and Calculated Fields | 10% |
| [`topics/06-tags-and-event-types.md`](topics/06-tags-and-event-types.md) | 6.0 Creating Tags and Event Types | 10% |
| [`topics/07-macros.md`](topics/07-macros.md) | 7.0 Creating and Using Macros | 10% |
| [`topics/08-workflow-actions.md`](topics/08-workflow-actions.md) | 8.0 Creating and Using Workflow Actions | 10% |
| [`topics/09-data-models-and-pivot.md`](topics/09-data-models-and-pivot.md) | 9.0 Creating Data Models | 10% |
| [`topics/10-cim.md`](topics/10-cim.md) | 10.0 Using the Common Information Model (CIM) Add-On | 10% |

**5. Drill.** Open the [exam simulator](site/exam/index.html). 200 questions, every one checked against the documentation. Untimed practice reveals the answer, the traps it bites and the reasoning behind every option the moment you submit; the timed mode is 65 questions in 60 minutes under exam conditions.

**6. Cram.** The `cram/` folder has one screen per section, reachable from the Study / Cram control at the top of each topic page, and [`cram/all-in-one.md`](cram/all-in-one.md) is the single sheet for the last hour.

## Reference layer

| File | What it is |
|---|---|
| [`reference/knowledge-object-precedence.md`](reference/knowledge-object-precedence.md) | The search-time operation order and what each stage can see. The highest-yield file here |
| [`reference/exam-traps.md`](reference/exam-traps.md) | Every trap in the guide by stable ID, plus the top twenty and a final-review list |
| [`reference/docs-by-blueprint.md`](reference/docs-by-blueprint.md) | **All 154 documentation pages, numbered 1 to 154 in blueprint order.** Read top to bottom and you have covered the exam |
| [`reference/doc-links.md`](reference/doc-links.md) | The same pages grouped by Splunk manual with `DL-nnn` ids, for looking one up |
| [`reference/spl-command-reference.md`](reference/spl-command-reference.md) | Every command in scope by type, plus the commands that look alike |
| [`reference/eval-functions.md`](reference/eval-functions.md) | Corrected eval function catalogue |
| [`reference/stats-and-chart-functions.md`](reference/stats-and-chart-functions.md) | Aggregate, event-order, multivalue and rate functions, and the by/over/split-by shapes |
| [`reference/time-modifiers.md`](reference/time-modifiers.md) | `earliest`/`latest`, snap-to, `span`, and the strftime table |
| [`reference/regex-for-splunk.md`](reference/regex-for-splunk.md) | Reading what the Field Extractor generates, plus `rex`, `erex` and `regex` |
| [`reference/cim-data-models.md`](reference/cim-data-models.md) | The CIM model catalogue with required, recommended and optional fields |
| [`reference/glossary.md`](reference/glossary.md) | Terms the exam uses precisely, including the three that mean two things |


## Two things to know before you start

**Answer keys in circulation are unreliable.** Several widely-shared study guides key the data model to Pivot relationship backwards, which is blueprint objective 9.1 verbatim, and contradict themselves on field-value case sensitivity and on whether the delimiters method is for structured data. Every claim in this guide traces to a documentation page, and [`reference/exam-traps.md`](reference/exam-traps.md) records each of those errors with a stable ID so you meet them here rather than in the exam.

**Splunk's own course path has a hole.** The blueprint names eight suggested courses and none of them covers section 10.0, CIM, which is 10% of the exam. [`topics/10-cim.md`](topics/10-cim.md) and [`reference/cim-data-models.md`](reference/cim-data-models.md) are written to stand alone because of it.
