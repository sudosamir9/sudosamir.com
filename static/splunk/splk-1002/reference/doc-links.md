# Documentation reading syllabus

The link-by-link reading list. Every URL below was fetched and confirmed to return HTTP 200 on 2026-07-26, all 145 of them, against Splunk Enterprise 10.4 and Common Information Model 8.6.

**Total reading time is roughly 21 hours** if you read every page at the pace the topic files estimate. You do not need to. The "read these first" list below is about 100 minutes and covers the highest-weight material on the exam.

## How this file relates to the topic files

Each topic file already ends with its own **Docs** section: the pages for that blueprint section, in the order to read them, each with a note on what specifically to get from it and a time estimate. That is the syllabus in its natural place, next to the material it explains. This file exists for two things the topic files cannot do: the cross-section reading order with a running total, and one master table of every link with its verified status.

| Stage | Read | Pages | Time |
| --- | --- | --- | --- |
| 0 | [topics/00-foundations-refresher.md](../topics/00-foundations-refresher.md) Docs section | 17 | 135 min |
| 1 | [topics/01-transforming-commands.md](../topics/01-transforming-commands.md) Docs section | 16 | 146 min |
| 2 | [topics/02-filtering-and-formatting.md](../topics/02-filtering-and-formatting.md) Docs section | 14 | 156 min |
| 3 | [topics/03-correlating-events.md](../topics/03-correlating-events.md) Docs section | 12 | 141 min |
| 4 | [topics/04-field-extractions.md](../topics/04-field-extractions.md) Docs section | 17 | 110 min |
| 5 | [topics/05-aliases-and-calculated-fields.md](../topics/05-aliases-and-calculated-fields.md) Docs section | 12 | 110 min |
| 6 | [topics/06-tags-and-event-types.md](../topics/06-tags-and-event-types.md) Docs section | 13 | 97 min |
| 7 | [topics/07-macros.md](../topics/07-macros.md) Docs section | 8 | 59 min |
| 8 | [topics/08-workflow-actions.md](../topics/08-workflow-actions.md) Docs section | 7 | 55 min |
| 9 | [topics/09-data-models-and-pivot.md](../topics/09-data-models-and-pivot.md) Docs section | 14 | 180 min |
| 10 | [topics/10-cim.md](../topics/10-cim.md) Docs section | 14 | 145 min |

Read a stage's docs after reading its topic file, not before. The topic file tells you which paragraph on the page matters, which turns a 25-minute page into a 5-minute one.

## Read these first

Seven pages, about 100 minutes, chosen by exam weight per minute of reading. If you only read seven things, read these.

1. [The sequence of search-time operations](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/get-started-with-knowledge-objects/the-sequence-of-search-time-operations) - 10 min. Blueprint sections 4.0, 5.0, 6.0, 9.0 and 10.0 all reduce to this one ordering, which is 50% of the exam by weight. It also corrects the six-step version most courses teach: the docs list nine operations.
2. [transaction](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/transaction) - 30 min. Section 3.0 is 15%, the heaviest on the exam, and this page carries every option, every default, and the `closed_txn` rule.
3. [About transactions](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/group-and-correlate-events/about-transactions) - 15 min. The two cases where `transaction` beats `stats`. This is the source material for objective 3.6, the hardest thing on the exam.
4. [workflow_actions.conf](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/configuration-file-reference/10.4.0-configuration-file-reference/workflow_actions.conf) - 15 min. The only page that states the workflow action defaults and the only one documenting the `$@` tokens. Section 8.0 is 10% and the docs pages for it state almost no defaults.
5. [Use search macros in searches](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/search-macros) - 10 min. Backtick syntax, argument forms, the not-expanded-inside-quotes rule. Objectives 7.3 and 7.4 are entirely about arguments.
6. [Overview of the Splunk Common Information Model](https://help.splunk.com/en/data-management/common-information-model/8.6/introduction/overview-of-the-splunk-common-information-model) - 10 min. Section 10.0 is 10% and has no official Splunk course behind it, so the docs are the whole syllabus.
7. [chart](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/chart) - 25 min. Read the option defaults and the "Using row-split and column-split fields" section. The `over X by Y` semantics are the reason section 1.0 exists.

## Manual map

The docs reorganised. `docs.splunk.com/Documentation/Splunk/latest/*` now 301-redirects to `help.splunk.com` with restructured paths, and several manuals were renamed at the same time.

| Blueprint section | Manual |
| --- | --- |
| 1.0 Transforming commands | Search Reference, Search Manual, Simple XML Dashboards |
| 2.0 Filtering and formatting | Search Reference (commands and evaluation functions), Search Manual |
| 3.0 Correlating events | Search Manual (Group and correlate events), Search Reference, Knowledge Management Manual (transactions) |
| 4.0 Field extractions | Knowledge Management Manual (Field Extractor), Search Reference (`rex`, `erex`, `extract`) |
| 5.0 Aliases and calculated fields | Knowledge Management Manual, Admin Manual (`props.conf`) |
| 6.0 Tags and event types | Knowledge Management Manual, Admin Manual (`tags.conf`, `eventtypes.conf`) |
| 7.0 Macros | Knowledge Management Manual, Admin Manual (`macros.conf`) |
| 8.0 Workflow actions | Knowledge Management Manual, Admin Manual (`workflow_actions.conf`) |
| 9.0 Data models | Knowledge Management Manual (Build a data model), Pivot Manual, Search Reference (`tstats`, `datamodel`, `from`) |
| 10.0 CIM | Common Information Model 8.6, which is a separate product manual under `data-management`, not under `splunk-enterprise` |

Three renames worth knowing because search results still use the old names:

- The **Knowledge Manager Manual** is now the **Knowledge Management Manual**.
- **Dashboards and Visualizations** (the old `/Viz/` path) split into **Simple XML Dashboards** and **Dashboard Studio**.
- **Pivot** is its own manual, not a chapter of Knowledge Management. A URL of the form `.../knowledge-management-manual/10.4/pivot/...` returns 404.

## Traps in the documentation itself

**The CIM `/latest/` path is stale.** `docs.splunk.com/Documentation/CIM/latest/` returns 200 and self-reports version **6.1.0**, while the current CIM is **8.6**. The version numbers are now synchronised with Splunk Enterprise Security, which is why 6.x jumps to 8.x. The versioned legacy URLs redirect correctly but `/latest/` does not. Always use the `help.splunk.com/en/data-management/common-information-model/8.6/` paths listed below.

**403 is not 404.** `docs.splunk.com` returns HTTP 403 to non-browser user agents. Pages resolve fine in a browser. If a link checker calls a Splunk doc dead, open it manually before believing it.

**`help.splunk.com` accepts some non-canonical paths.** For example `/en/splunk-enterprise/spl-search-reference/...` (missing the `/search/` segment) returns 200 just as the canonical `/en/splunk-enterprise/search/spl-search-reference/...` does. Prefer the canonical form so that a future path check stays meaningful.

**Slugs that moved.** These 404 on 10.4 and the working replacements are already used throughout this guide:

| Broken slug | Working slug |
| --- | --- |
| `get-started-with-knowledge-objects/about-fields` | `fields-and-field-extractions/about-fields` |
| `calculated-fields/create-calculated-fields-in-splunk-web` | `calculated-fields/create-calculated-fields-with-splunk-web` |
| `field-aliases/about-field-aliases` | `tags/about-tags-and-aliases` |
| `knowledge-management-manual/10.4/pivot/introduction-to-pivot` | `pivot-manual/10.4/pivot-overview/introduction-to-pivot` |
| `manage-event-types/define-and-maintain-event-types-in-eventtypes-conf` | `event-types/...` (the chapter slug is `event-types`) |

**Every URL printed in the Apress book is stale.** They point at Splunk 6.1.1 through 7.3.1. Use this file instead of the book's reference lists. See [source-notes/apress-errata.md](../source-notes/apress-errata.md).

## Non-documentation sources

| Source | URL | Why |
| --- | --- | --- |
| Official test blueprint PDF | https://www.splunk.com/en_us/pdfs/training/splunk-test-blueprint-power-user.pdf | The source of record for the ten sections and their weights. Frozen since roughly January 2023 |
| Certification track page | https://www.splunk.com/en_us/training/certification-track/splunk-core-certified-power-user.html | Exam facts: 65 questions, 60 minutes, $130, no prerequisite |
| Course descriptions | `https://www.splunk.com/en_us/pdfs/training/<course>-course-description.pdf` for `working-with-time`, `statistical-processing`, `result-modification`, `correlation-analysis`, `creating-knowledge-objects`, `creating-field-extractions`, `data-models`. Comparing Values lives at `/content/dam/splunk2/en_us/pdfs/training/comparing-values-course-description.pdf` | The eight suggested courses and exactly what each covers. Useful for checking your coverage against Splunk's own module lists |
| Splunk How-To YouTube channel | https://www.youtube.com/@SplunkHowTo | The blueprint explicitly names this as a preparation resource, alongside Splunk Docs and your own experience |
| Splunk Community | https://community.splunk.com/ | For the "why does my calculated field see nothing" class of question |

## Master table

Every documentation URL cited anywhere in this guide, grouped by manual, with the status from the 2026-07-26 check. All 145 returned HTTP 200. The check covered 147 URLs: the `datamodel` and `tstats` command pages were each cited twice, once at documentation version 10.2 and once at 10.4, and both citations have been normalised onto the 10.4 rows DL-067 and DL-086.

### Knowledge Management Manual 10.4 (55 pages)

| ID | Page | Status |
| --- | --- | --- |
| DL-001 | [About data models](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/build-a-data-model/about-data-models) | ok |
| DL-002 | [Design data models](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/build-a-data-model/design-data-models) | ok |
| DL-003 | [Manage data models](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/build-a-data-model/manage-data-models) | ok |
| DL-004 | [About calculated fields](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/calculated-fields/about-calculated-fields) | ok |
| DL-005 | [Configure calculated fields with props.conf](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/calculated-fields/configure-calculated-fields-with-props.conf) | ok |
| DL-006 | [Create calculated fields with splunk web](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/calculated-fields/create-calculated-fields-with-splunk-web) | ok |
| DL-007 | [Add an auto extracted field](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/define-data-model-dataset-fields/add-an-auto-extracted-field) | ok |
| DL-008 | [Define dataset fields](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/define-data-model-dataset-fields/define-dataset-fields) | ok |
| DL-009 | [About event type priorities](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/event-types/about-event-type-priorities) | ok |
| DL-010 | [About event types](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/event-types/about-event-types) | ok |
| DL-011 | [Automatically find and build event types](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/event-types/automatically-find-and-build-event-types) | ok |
| DL-012 | [Configure event types in eventtypes.conf](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/event-types/configure-event-types-in-eventtypes.conf) | ok |
| DL-013 | [Define event types in splunk web](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/event-types/define-event-types-in-splunk-web) | ok |
| DL-014 | [Configure field aliases with props.conf](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/field-aliases/configure-field-aliases-with-props.conf) | ok |
| DL-015 | [Create field aliases in splunk web](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/field-aliases/create-field-aliases-in-splunk-web) | ok |
| DL-016 | [About fields](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/fields-and-field-extractions/about-fields) | ok |
| DL-017 | [About regular expressions with field extractions](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/fields-and-field-extractions/about-regular-expressions-with-field-extractions) | ok |
| DL-018 | [Use default fields](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/fields-and-field-extractions/use-default-fields) | ok |
| DL-019 | [When splunk software extracts fields](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/fields-and-field-extractions/when-splunk-software-extracts-fields) | ok |
| DL-020 | [About splunk regular expressions](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/get-started-with-knowledge-objects/about-splunk-regular-expressions) | ok |
| DL-021 | [Manage knowledge object permissions](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/get-started-with-knowledge-objects/manage-knowledge-object-permissions) | ok |
| DL-022 | [Manage orphaned knowledge objects](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/get-started-with-knowledge-objects/manage-orphaned-knowledge-objects) | ok |
| DL-023 | [The sequence of search time operations](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/get-started-with-knowledge-objects/the-sequence-of-search-time-operations) | ok |
| DL-024 | [Understand and use the common information model add on](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/get-started-with-knowledge-objects/understand-and-use-the-common-information-model-add-on) | ok |
| DL-025 | [Search macros](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/search-macros) | ok |
| DL-026 | [Define search macros in settings](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/search-macros/define-search-macros-in-settings) | ok |
| DL-027 | [Search macro examples](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/search-macros/search-macro-examples) | ok |
| DL-028 | [Use search macros in searches](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/search-macros/use-search-macros-in-searches) | ok |
| DL-029 | [About tags and aliases](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/tags/about-tags-and-aliases) | ok |
| DL-030 | [Define and manage tags in settings](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/tags/define-and-manage-tags-in-settings) | ok |
| DL-031 | [Tag event types](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/tags/tag-event-types) | ok |
| DL-032 | [Tag field value pairs in search](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/tags/tag-field-value-pairs-in-search) | ok |
| DL-033 | [Tag the host field](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/tags/tag-the-host-field) | ok |
| DL-034 | [Use macros with event types and tags](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/tags/use-macros-with-event-types-and-tags) | ok |
| DL-035 | [Configure transaction types](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/transactions/configure-transaction-types) | ok |
| DL-036 | [Search for transactions](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/transactions/search-for-transactions) | ok |
| DL-037 | [Accelerate data models](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-data-summaries-to-accelerate-searches/accelerate-data-models) | ok |
| DL-038 | [Overview of summary based search acceleration](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-data-summaries-to-accelerate-searches/overview-of-summary-based-search-acceleration) | ok |
| DL-039 | [About lookups](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-lookups-in-splunk-web/about-lookups) | ok |
| DL-040 | [Configure advanced extractions with field transforms](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-configuration-files-to-configure-field-extractions/configure-advanced-extractions-with-field-transforms) | ok |
| DL-041 | [Make your lookup automatic](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-configuration-files-to-configure-lookups/make-your-lookup-automatic) | ok |
| DL-042 | [Build field extractions with the field extractor](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/build-field-extractions-with-the-field-extractor) | ok |
| DL-043 | [Field extractor rename fields step](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/field-extractor-rename-fields-step) | ok |
| DL-044 | [Field extractor save step](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/field-extractor-save-step) | ok |
| DL-045 | [Field extractor select fields step](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/field-extractor-select-fields-step) | ok |
| DL-046 | [Field extractor select method step](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/field-extractor-select-method-step) | ok |
| DL-047 | [Field extractor select sample step](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/field-extractor-select-sample-step) | ok |
| DL-048 | [Field extractor validate step](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/field-extractor-validate-step) | ok |
| DL-049 | [Use the field extractions page](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-settings-pages-for-field-extractions-in-splunk-web/use-the-field-extractions-page) | ok |
| DL-050 | [What is splunk knowledge](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/welcome-to-knowledge-management/what-is-splunk-knowledge) | ok |
| DL-051 | [About workflow actions in splunk web](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/workflow-actions/about-workflow-actions-in-splunk-web) | ok |
| DL-052 | [Control workflow action appearance in field and event menus](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/workflow-actions/control-workflow-action-appearance-in-field-and-event-menus) | ok |
| DL-053 | [Set up a get workflow action](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/workflow-actions/set-up-a-get-workflow-action) | ok |
| DL-054 | [Set up a post workflow action](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/workflow-actions/set-up-a-post-workflow-action) | ok |
| DL-055 | [Set up a search workflow action](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/workflow-actions/set-up-a-search-workflow-action) | ok |

### Search Reference 10.4 (40 pages)

| ID | Page | Status |
| --- | --- | --- |
| DL-058 | [Comparison and conditional functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/comparison-and-conditional-functions) | ok |
| DL-059 | [Conversion functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/conversion-functions) | ok |
| DL-060 | [Date and time functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/date-and-time-functions) | ok |
| DL-061 | [Informational functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/informational-functions) | ok |
| DL-062 | [Mathematical functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/mathematical-functions) | ok |
| DL-063 | [Multivalue eval functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/multivalue-eval-functions) | ok |
| DL-064 | [Text functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/text-functions) | ok |
| DL-065 | [Command types](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/quick-reference/command-types) | ok |
| DL-066 | [Chart](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/chart) | ok |
| DL-067 | [Datamodel](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/datamodel) | ok |
| DL-068 | [Erex](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/erex) | ok |
| DL-069 | [Eval](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/eval) | ok |
| DL-070 | [Eventstats](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/eventstats) | ok |
| DL-071 | [Extract](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/extract) | ok |
| DL-072 | [Fieldformat](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/fieldformat) | ok |
| DL-073 | [Filldown](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/filldown) | ok |
| DL-074 | [Fillnull](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/fillnull) | ok |
| DL-075 | [Format](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/format) | ok |
| DL-076 | [Join](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/join) | ok |
| DL-077 | [Rare](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/rare) | ok |
| DL-078 | [Regex](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/regex) | ok |
| DL-079 | [Rex](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/rex) | ok |
| DL-080 | [Search](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/search) | ok |
| DL-081 | [Stats](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/stats) | ok |
| DL-082 | [Streamstats](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/streamstats) | ok |
| DL-083 | [Timechart](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/timechart) | ok |
| DL-084 | [Top](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/top) | ok |
| DL-085 | [Transaction](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/transaction) | ok |
| DL-086 | [Tstats](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/tstats) | ok |
| DL-087 | [Untable](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/untable) | ok |
| DL-088 | [Where](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/where) | ok |
| DL-089 | [Xyseries](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/xyseries) | ok |
| DL-090 | [Aggregate functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/statistical-and-charting-functions/aggregate-functions) | ok |
| DL-091 | [Event order functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/statistical-and-charting-functions/event-order-functions) | ok |
| DL-092 | [Multivalue stats and chart functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/statistical-and-charting-functions/multivalue-stats-and-chart-functions) | ok |
| DL-093 | [Statistical and charting functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/statistical-and-charting-functions/statistical-and-charting-functions) | ok |
| DL-094 | [Time functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/statistical-and-charting-functions/time-functions) | ok |
| DL-095 | [Time modifiers](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/time-format-variables-and-modifiers/time-modifiers) | ok |
| DL-096 | [From](https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.4/search-commands/from) | ok |
| DL-097 | [Pivot](https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.4/search-commands/pivot) | ok |

### Search Manual 10.4 (15 pages)

| ID | Page | Status |
| --- | --- | --- |
| DL-098 | [About transforming commands and searches](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/create-statistical-tables-and-chart-visualizations/about-transforming-commands-and-searches) | ok |
| DL-099 | [Build a chart of multiple data series](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/create-statistical-tables-and-chart-visualizations/build-a-chart-of-multiple-data-series) | ok |
| DL-100 | [Open a non transforming search in pivot to create tables and charts](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/create-statistical-tables-and-chart-visualizations/open-a-non-transforming-search-in-pivot-to-create-tables-and-charts) | ok |
| DL-101 | [Boolean expressions with logical operators](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/expressions-and-predicates/boolean-expressions-with-logical-operators) | ok |
| DL-102 | [Difference between and not](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/expressions-and-predicates/difference-between-and-not) | ok |
| DL-103 | [About event grouping and correlation](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/group-and-correlate-events/about-event-grouping-and-correlation) | ok |
| DL-104 | [About transactions](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/group-and-correlate-events/about-transactions) | ok |
| DL-105 | [Identify and group events into transactions](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/group-and-correlate-events/identify-and-group-events-into-transactions) | ok |
| DL-106 | [View search job properties](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/manage-jobs/view-search-job-properties) | ok |
| DL-107 | [Types of commands](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/search-overview/types-of-commands) | ok |
| DL-108 | [About searching with time](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/specify-time-ranges/about-searching-with-time) | ok |
| DL-109 | [Specify time modifiers in your search](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/specify-time-ranges/specify-time-modifiers-in-your-search) | ok |
| DL-110 | [About subsearches](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/subsearches/about-subsearches) | ok |
| DL-111 | [Use subsearch to correlate events](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/subsearches/use-subsearch-to-correlate-events) | ok |
| DL-112 | [Search modes](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/use-the-search-app/search-modes) | ok |

### Common Information Model 8.6 (12 pages)

| ID | Page | Status |
| --- | --- | --- |
| DL-113 | [Data models](https://help.splunk.com/en/data-management/common-information-model/8.6/data-models) | ok |
| DL-114 | [How to use the cim data model reference tables](https://help.splunk.com/en/data-management/common-information-model/8.6/data-models/how-to-use-the-cim-data-model-reference-tables) | ok |
| DL-115 | [Install the splunk common information model add on](https://help.splunk.com/en/data-management/common-information-model/8.6/introduction/install-the-splunk-common-information-model-add-on) | ok |
| DL-116 | [Overview of the splunk common information model](https://help.splunk.com/en/data-management/common-information-model/8.6/introduction/overview-of-the-splunk-common-information-model) | ok |
| DL-117 | [Set up the splunk common information model add on](https://help.splunk.com/en/data-management/common-information-model/8.6/introduction/set-up-the-splunk-common-information-model-add-on) | ok |
| DL-118 | [Accelerate cim data models](https://help.splunk.com/en/data-management/common-information-model/8.6/using-the-common-information-model/accelerate-cim-data-models) | ok |
| DL-119 | [Approaches to using the cim](https://help.splunk.com/en/data-management/common-information-model/8.6/using-the-common-information-model/approaches-to-using-the-cim) | ok |
| DL-120 | [Match ta event types with cim data models to accelerate searches](https://help.splunk.com/en/data-management/common-information-model/8.6/using-the-common-information-model/match-ta-event-types-with-cim-data-models-to-accelerate-searches) | ok |
| DL-121 | [Use the cim filters to exclude data](https://help.splunk.com/en/data-management/common-information-model/8.6/using-the-common-information-model/use-the-cim-filters-to-exclude-data) | ok |
| DL-122 | [Use the cim to normalize data at search time](https://help.splunk.com/en/data-management/common-information-model/8.6/using-the-common-information-model/use-the-cim-to-normalize-data-at-search-time) | ok |
| DL-123 | [Use the cim to validate your data](https://help.splunk.com/en/data-management/common-information-model/8.6/using-the-common-information-model/use-the-cim-to-validate-your-data) | ok |
| DL-124 | [Use the cim to normalize data at search time](https://help.splunk.com/en/splunk-enterprise/common-information-model/8.6/using-the-common-information-model/use-the-cim-to-normalize-data-at-search-time) | ok |

### Admin Manual 10.4 (conf specs) (7 pages)

| ID | Page | Status |
| --- | --- | --- |
| DL-125 | [Configuration file precedence](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/administer-splunk-enterprise-with-configuration-files/configuration-file-precedence) | ok |
| DL-126 | [When to restart splunk enterprise after a configuration file change](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/administer-splunk-enterprise-with-configuration-files/when-to-restart-splunk-enterprise-after-a-configuration-file-change) | ok |
| DL-127 | [Datamodels.conf](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/configuration-file-reference/10.4.0-configuration-file-reference/datamodels.conf) | ok |
| DL-128 | [Macros.conf](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/configuration-file-reference/10.4.0-configuration-file-reference/macros.conf) | ok |
| DL-129 | [Props.conf](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/configuration-file-reference/10.4.0-configuration-file-reference/props.conf) | ok |
| DL-130 | [Transforms.conf](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/configuration-file-reference/10.4.0-configuration-file-reference/transforms.conf) | ok |
| DL-131 | [Workflow_actions.conf](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/configuration-file-reference/10.4.0-configuration-file-reference/workflow_actions.conf) | ok |

### Simple XML Dashboards 10.4 (7 pages)

| ID | Page | Status |
| --- | --- | --- |
| DL-132 | [Column and bar charts](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/charts/column-and-bar-charts) | ok |
| DL-133 | [Line and area charts](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/charts/line-and-area-charts) | ok |
| DL-134 | [Pie chart](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/charts/pie-chart) | ok |
| DL-135 | [Scatter chart](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/charts/scatter-chart) | ok |
| DL-136 | [Data structure requirements for visualizations](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/get-started-with-visualizations/data-structure-requirements-for-visualizations) | ok |
| DL-137 | [Generate a single value](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/single-value/generate-a-single-value) | ok |
| DL-138 | [Use trellis layout to split visualizations](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/trellis-layout-for-visualizations/use-trellis-layout-to-split-visualizations) | ok |

### Pivot Manual 10.4 (2 pages)

| ID | Page | Status |
| --- | --- | --- |
| DL-139 | [Design pivot tables with the pivot editor](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/pivot-manual/10.4/building-pivots/design-pivot-tables-with-the-pivot-editor) | ok |
| DL-140 | [Introduction to pivot](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/pivot-manual/10.4/pivot-overview/introduction-to-pivot) | ok |

### Dashboard Studio 10.4 (1 pages)

| ID | Page | Status |
| --- | --- | --- |
| DL-141 | [What is splunk dashboard studio](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/dashboard-studio/10.4/introduction-to-splunk-dashboard-studio/what-is-splunk-dashboard-studio) | ok |

### Alerting Manual 10.4 (1 pages)

| ID | Page | Status |
| --- | --- | --- |
| DL-142 | [Alert type and triggering scenarios](https://help.splunk.com/en/splunk-enterprise/alert-and-respond/alerting-manual/10.4/choose-an-alert-type/alert-type-and-triggering-scenarios) | ok |

### Search Tutorial 10.4 (1 pages)

| ID | Page | Status |
| --- | --- | --- |
| DL-143 | [Use fields to search](https://help.splunk.com/en/splunk-enterprise/search/search-tutorial/10.4/part-4-searching-the-tutorial-data/use-fields-to-search) | ok |

### Getting Data In 10.4 (1 pages)

| ID | Page | Status |
| --- | --- | --- |
| DL-144 | [Rename source types at search time](https://help.splunk.com/en/splunk-enterprise/get-started/get-data-in/10.4/configure-source-types/rename-source-types-at-search-time) | ok |

### Managing Indexers and Clusters 10.4 (1 pages)

| ID | Page | Status |
| --- | --- | --- |
| DL-145 | [Index time versus search time](https://help.splunk.com/en/splunk-enterprise/administer/manage-indexers-and-indexer-clusters/10.4/indexing-overview/index-time-versus-search-time) | ok |

### Release Notes (2 pages)

The same known issue is published once per release line. `reference/knowledge-object-precedence.md` cites the 10.2 page and `topics/05-aliases-and-calculated-fields.md` cites the 10.4 page, so both rows stay.

| ID | Page | Status |
| --- | --- | --- |
| DL-146 | [Field alias behavior change](https://help.splunk.com/en/splunk-enterprise/release-notes-and-updates/release-notes/10.2/known-issues-for-this-release/field-alias-behavior-change) | ok |
| DL-147 | [Field alias behavior change](https://help.splunk.com/en/splunk-enterprise/release-notes-and-updates/release-notes/10.4/known-issues-for-this-release/field-alias-behavior-change) | ok |

