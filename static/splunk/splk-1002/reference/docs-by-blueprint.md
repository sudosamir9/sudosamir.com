# Documentation reading list, in blueprint order

Every Splunk documentation page used anywhere in this guide, 154 of them, numbered and ordered to follow the official test blueprint from start to finish. Read top to bottom and you have covered the exam.

This is the blueprint-ordered companion to [`doc-links.md`](doc-links.md), which lists the same material grouped by Splunk manual with `DL-nnn` ids. Use that one to look a page up, this one to read in order.

Every URL was fetched and confirmed to return HTTP 200. `help.splunk.com` is the current home of Splunk documentation: the old `docs.splunk.com` addresses redirect here, and `latest` resolves to Splunk Enterprise 10.4. CIM pages are versioned separately and sit at 8.6.

> The following topics are general guidelines for the content likely to be included on the exam; however, other related topics may also appear on any specific delivery of the exam. In order to better reflect the contents of the exam and for clarity purposes, the guidelines below may change at any time without notice.

## Stage 0: Foundations, read before section 1.0

Off blueprint by design. SPLK-1002 has no prerequisite exam but assumes Splunk Core Certified User knowledge, and later sections lean on several of these. Covered by [`topics/00-foundations-refresher.md`](../topics/00-foundations-refresher.md).

1. [The sequence of search-time operations (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/get-started-with-knowledge-objects/the-sequence-of-search-time-operations)  
   "Each operation can have configurations that reference fields derived by operations that precede them in the sequence. However, those same configurations cannot contain fields that are derived by operations that follow them." Lookup section adds that lookups can reference extractions, aliases and calculated fields.
2. [Types of commands](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/search-overview/types-of-commands)  
   the same taxonomy from the search manual side, with the streaming versus non-streaming reasoning. 10 minutes.
3. [Search modes](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/use-the-search-app/search-modes)  
   what Fast mode still returns with field discovery off, and the Smart mode rule about event versus transforming searches. Shared with section 1. 4 minutes.
4. [Command types (SPL Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/quick-reference/command-types)  
   Streaming commands table: eval = Distributable streaming; transaction = Centralized streaming; cluster = Streaming in some modes. Intro names the six command types.
5. [Time modifiers](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/time-format-variables-and-modifiers/time-modifiers)  
   the unit alias table, snap-to, `@w0` to `@w7`, and every example. 15 minutes.
6. [Specify time modifiers in your search](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/specify-time-ranges/specify-time-modifiers-in-your-search)  
   precedence over the Time Range Picker and the subsearch boundary rule. 5 minutes.
7. [Manage knowledge object permissions (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/get-started-with-knowledge-objects/manage-knowledge-object-permissions)  
   "When a Splunk user first creates a new report, event type, transaction, or similar knowledge object, it is only available to that user." Read means see and use; no permission means the role cannot see or use the object.
8. [About searching with time](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/specify-time-ranges/about-searching-with-time)  
   `_time` as UNIX epoch and why calendar-boundary ranges differ per time zone. 5 minutes.
9. [About subsearches](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/subsearches/about-subsearches)  
   and [Use subsearch to correlate events](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/subsearches/use-subsearch-to-correlate-events) - background for the correlation approaches the blueprint touches indire.
10. [format](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/format)  
   the default delimiters and the single `search` field it produces. 5 minutes.
11. [Use fields to search (Search Tutorial 10.4)](https://help.splunk.com/en/splunk-enterprise/search/search-tutorial/10.4/part-4-searching-the-tutorial-data/use-fields-to-search)  
   "When you first run a search the Selected Fields list contains the default fields host, source, and sourcetype. These default fields appear in every event. Interesting Fields are fields that appear in at least 20% of the events." Also names index as a default field created at index time.
12. [View search job properties, Search Job Inspector (Search Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/manage-jobs/view-search-job-properties)  
   Confirms the troubleshooting and knowledge-object purpose, the not-expired access rule, and that the key sections are Execution costs and Search job properties. Also documents the Job Details dashboard sections.
13. [About jobs and job management (Search Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/manage-jobs/about-jobs-and-job-management)  
   Defines a job as the process created by any search, pivot, report or dashboard panel, tracking owner, app, event count and runtime, and creating a search artifact. Also lists srchJobsQuota and srchDiskQuota, which is why option B is not clearly false.
14. [Manage orphaned knowledge objects](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/get-started-with-knowledge-objects/manage-orphaned-knowledge-objects)  
   how they arise and the Reassign page limitation. 5 minutes.
15. [About lookups](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-lookups-in-splunk-web/about-lookups)  
   off blueprint. Skim the four types and the file versus definition versus automatic distinction only. 5 minutes.
16. [Alert type and triggering scenarios](https://help.splunk.com/en/splunk-enterprise/alert-and-respond/alerting-manual/10.4/choose-an-alert-type/alert-type-and-triggering-scenarios)  
   off blueprint. Skim scheduled versus real-time and the two real-time triggering shapes. 5 minutes.
17. [Overview of summary-based search acceleration](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-data-summaries-to-accelerate-searches/overview-of-summary-based-search-acceleration)  
   off blueprint. Read only the comparison of the three mechanisms. 5 minutes.
18. [What is Splunk Dashboard Studio?](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/dashboard-studio/10.4/introduction-to-splunk-dashboard-studio/what-is-splunk-dashboard-studio)  
   off blueprint. Skim for the Studio versus Simple XML differences only. 5 minutes.

## 1.0 Using Transforming Commands for Visualizations (5%)

Covered by [`topics/01-transforming-commands.md`](../topics/01-transforming-commands.md).

### Section-wide, covers every objective below

19. [About transforming commands and searches (Search Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/create-statistical-tables-and-chart-visualizations/about-transforming-commands-and-searches)  
   the five primary transforming commands and why visualizations need statistical tables. 5 min.
20. [top (Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/top)  
   the seven options and their defaults, especially `useother=false`. 10 min.
21. [rare (Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/rare)  
   confirm which options are documented. 5 min.
22. [Data structure requirements for visualizations (Simple XML Dashboards 10.4)](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/get-started-with-visualizations/data-structure-requirements-for-visualizations)  
   visualization type to required table shape. 5 min.
23. [Pie chart (Simple XML Dashboards 10.4)](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/charts/pie-chart)  
   the two-column rule and the extra-columns-are-ignored rule. 5 min.
24. [Column and bar charts (Simple XML Dashboards 10.4)](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/charts/column-and-bar-charts)  
   and [Line and area charts](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/charts/line-and-area-charts) - which axis the first Statistics column feeds, single versus multiple s.
25. [Scatter chart (Simple XML Dashboards 10.4)](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/charts/scatter-chart)  
   the marker, X, Y ordering. Then skim [Bubble chart](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/charts/bubble-chart) for the four-column, three-dimension contrast. 5 min.
26. [Generate a single value (Simple XML Dashboards 10.4)](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/single-value/generate-a-single-value)  
   why sparkline and trend indicator need `timechart`. 5 min.
27. [Use trellis layout to split visualizations (Simple XML Dashboards 10.4)](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/trellis-layout-for-visualizations/use-trellis-layout-to-split-visualizations)  
   the requirement that the last command be transforming. 5 min.
28. [untable (Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/untable)  
   and [xyseries (Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/xyseries) - the two shape converters and their command types. 10 min.
29. [Build a chart of multiple data series (Search Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/create-statistical-tables-and-chart-visualizations/build-a-chart-of-multiple-data-series)  
   the `stats` plus `xyseries` pattern and the `chart n by x,y` equivalence. 10 min.

### 1.1 Use the chart command

30. [chart command (Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/chart)  
   Syntax block, plus row-split and column-split argument definitions: row-split becomes the first column and the X-axis label, column-split becomes the data series columns. Basic example 2 is `... | chart max(delay) OVER site BY org`.
31. [stats command (Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/stats)  
   Description and by-clause: one row per distinct BY value, one row total when BY is omitted. AS renames the aggregate column.
32. [Statistical and charting functions (Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/statistical-and-charting-functions/statistical-and-charting-functions)  
   Opening sentence names chart, stats and timechart as the three commands that take these functions; the related-commands table extends them to sichart, eventstats, streamstats, geostats, sistats and sitimechart. Sparkline is called out as chart and stats only.

### 1.2 Use the timechart command

33. [timechart command (Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/timechart)  
   Bin options: span sets the size of each bin, bins defaults to 100. Usage, "bins and span arguments" and "Default time spans" tables confirm span wins over bins and list the picker defaults.

## 2.0 Filtering and Formatting Results (10%)

Covered by [`topics/02-filtering-and-formatting.md`](../topics/02-filtering-and-formatting.md).

### Section-wide, covers every objective below

34. [search](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/search)  
   Usage: the implied search command, using search later in the pipeline, Boolean expressions, Comparing two fields, the IN operator, and example 6 on `NOT` versus `!=`. 20 minutes.
35. [Difference between != and NOT](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/expressions-and-predicates/difference-between-and-not)  
   the Ponies.csv example, framed exactly as the exam frames it. 6 minutes.
36. [Boolean expressions with logical operators](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/expressions-and-predicates/boolean-expressions-with-logical-operators)  
   the precedence table and the two AND/OR examples. 6 minutes.
37. [filldown](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/filldown)  
   one short page, read purely to fix the contrast. 3 minutes.
38. [fieldformat](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/fieldformat)  
   the Description paragraphs on export and pipeline position, plus the supported-function table. 10 minutes.
39. [Text functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/text-functions)  
   and [Multivalue eval functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/multivalue-eval-functions) - signatures and index bases; note that `split` lives on the multivalue.
40. [Informational functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/informational-functions)  
   and [Date and Time functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/date-and-time-functions) - skim signatures, read the `now()` versus `time()` distinction properly. 12.
41. [Mathematical functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/mathematical-functions)  
   skim signatures plus the two defaults worth knowing, `log` base 10 and `round` to integer. 6 minutes.

### 2.1 The eval command

42. [eval command (SPL Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/eval)  
   Description: "If the field name that you specify does not match a field in the output, a new field is added"; if it matches, "the results of the eval expression overwrite the values in that field." Usage adds that booleans cannot be assigned to fields.
43. [Comparison and Conditional functions, case (SPL Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/comparison-and-conditional-functions)  
   case(<condition>,<value>,...): conditions evaluated first to last, "defaults to NULL if none of the <condition> arguments are true". Its example is this exact 200/404/500 search, with blank descriptions for 408 and 406. The true() entry shows the default-value idiom.
44. [Conversion functions, tostring (SPL Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/conversion-functions)  
   Usage: tostring values under eval "might not sort as expected because they are converted to ASCII. Use the fieldformat command with the tostring function to format the displayed values.".
45. [sort command (SPL Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/sort)  
   Usage: sort auto-detects numeric, IP or lexicographical collation, and the Lexicographical order section gives 10, 9, 70, 100 sorting as 10, 100, 70, 9.

### 2.2 Use the search and where commands to filter results

46. [where command (SPL Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/where)  
   and [eval](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/eval) - one sentence each, and both are the sentence behind T-04-05: the expression is case-sensitive. 2 minutes.

### 2.3 The fillnull command

47. [fillnull command (SPL Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/fillnull)  
   value argument: "Specify a string value to replace null values. If you do not specify a value, the default value is applied", Default: 0. Usage covers the field-list versus no-field-list command type split.

## 3.0 Correlating Events (15%)

Covered by [`topics/03-correlating-events.md`](../topics/03-correlating-events.md).

### Section-wide, covers every objective below

48. [Event order functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/statistical-and-charting-functions/event-order-functions)  
   and [Time functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/statistical-and-charting-functions/time-functions) - the `first`/`last` versus `earliest`/`latest` table. 8 minutes.
49. [Multivalue stats and chart functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/statistical-and-charting-functions/multivalue-stats-and-chart-functions)  
   `values()` versus `list()` and the 100-value cap on `list()`. 5 minutes.
50. [join command reference](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/join)  
   the "Alternative commands" table, the clearest published statement of when to pick `transaction` over `stats`. 10 minutes.

### 3.1 Identify transactions

51. [transaction command (Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/transaction)  
   maxspan and maxpause definitions and defaults; Extended example 2 runs `index=web sourcetype=access_combined | transaction clientip host maxspan=30s maxpause=5s` and describes the result as a distinct combination of clientip and host values. The Specifying multiple fields section carries the not-necessarily-a-conjunction caveat.

### 3.2 Group events using fields

52. [About transactions (Search Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/group-and-correlate-events/about-transactions)  
   Using stats instead of transaction names the two cases where transaction is most useful: when a unique id alone cannot separate two transactions (so time spans, pauses or begin/end messages are needed), and when you want the combined raw text. Otherwise stats "performs more efficiently, especially in a distributed environment".

### 3.3 Group events using fields and time

53. [Identify and group events into transactions (Search Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/group-and-correlate-events/identify-and-group-events-into-transactions)  
   [field-list]: "each event must have the same field(s) to be considered part of the same transaction. Events with common field names and different values will not be grouped." Also the list of what transactions can include across hosts, sources and sourcetypes, which is the source of the course's own explanation text.

### 3.4 Search with transactions

54. [Search for transactions](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/transactions/search-for-transactions)  
   `transactiontype`, `match=closest`, and the macro combination. 8 minutes.

### 3.5 Report on transactions

55. [Configure transaction types](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/transactions/configure-transaction-types)  
   `transactiontypes.conf` attributes and defaults, needed for `name=`. 10 minutes.

### 3.6 Determine when to use transactions vs. stats

56. [About event grouping and correlation (Search Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/group-and-correlate-events/about-event-grouping-and-correlation)  
   "In most cases, you can accomplish more with the stats command or the transaction command; and these are recommended over using the join and append commands.".
57. [limits.conf (Admin Manual 10.4)](https://help.splunk.com/en/data-management/splunk-enterprise-admin-manual/10.4/configuration-file-reference/10.4.0-configuration-file-reference/limits.conf)  
   [transactions] stanza contains only maxopentxn (Default: 5000) and maxopenevents (Default: 100000). max_events_per_bucket is in the [search] stanza and applies to timeline buckets when status_buckets>0.

## 4.0 Creating and Managing Fields (10%)

Covered by [`topics/04-field-extractions.md`](../topics/04-field-extractions.md).

### Section-wide, covers every objective below

58. [About fields](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/fields-and-field-extractions/about-fields)  
   what a field is, every mechanism for creating one, and the rule that custom extractions belong at search time. 5 minutes.
59. [Use default fields](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/fields-and-field-extractions/use-default-fields)  
   the three groups (internal, default, default datetime) and what is not on the list. 8 minutes.
60. [When Splunk software extracts fields](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/fields-and-field-extractions/when-splunk-software-extracts-fields)  
   index time versus search time, and the first-100-fields rule. 6 minutes.
61. [Field Extractor: Select Sample step](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/field-extractor-select-sample-step)  
   the twenty-line sample limit and the overlapping-extraction warning. 4 minutes.
62. [Field Extractor: Validate step](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/field-extractor-validate-step)  
   counterexamples, the grey X and the blue X. 4 minutes.
63. [rex](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/rex)  
   syntax, `field` default `_raw`, `max_match` default 1, `offset_field`, and sed mode. 10 minutes.
64. [erex](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/erex)  
   `examples`, `counterexamples`, `fromfield` default `_raw`, `maxtrainers` default 100 with range 1 to 1000. 6 minutes.
65. [extract](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/extract)  
   `pairdelim`, `kvdelim`, `limit=50`, `maxchars=10240`, and the `_raw`-only restriction. 7 minutes.
66. [Use the Field extractions page](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-settings-pages-for-field-extractions-in-splunk-web/use-the-field-extractions-page)  
   Inline versus Uses transform, the statement that IFX creates `EXTRACT-<class>` entries, and the manual New Field Extraction form that is not the wizard. 6 minutes.
67. [Configure advanced extractions with field transforms](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-configuration-files-to-configure-field-extractions/configure-advanced-extractions-with-field-transforms)  
   `DELIMS`, `FIELDS`, `REGEX`, `FORMAT`, `MV_ADD`, `CLEAN_KEYS`, and `REPORT-<class>`. Read for recognition. 10 minutes.

### 4.1 Perform regex field extractions using the Field Extractor (FX)

68. [Build field extractions with the field extractor (Knowledge Manager 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/build-field-extractions-with-the-field-extractor)  
   "Access the field extractor from a specific event": Event Actions > Extract Fields. "The field extractor starts you at the Select Method step, in a new browser tab. You have already defined the source type and sample event." All other entry points start at Select Sample.
69. [Field Extractor: Select Fields step (Knowledge Manager 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/field-extractor-select-fields-step)  
   "Identify required text to create extractions that match specific event patterns": required text behaves like a search filter and must be present for the extraction to match; highlight the text, select Require, then Add Required Text. Lists the one-string-per-extraction and no-overlap limits.
70. [Field Extractor: Save step (Knowledge Manager 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/field-extractor-save-step)  
   "In the Save step of the field extractor you define the name of the new field extraction definition, set its permissions, and save the extraction." Saved extractions are listed on the Field Extractions page in Settings, and default to Owner.
71. [About Splunk regular expressions (Knowledge Manager 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/get-started-with-knowledge-objects/about-splunk-regular-expressions)  
   the PCRE statement and the two named-capture spellings, `(?P<var> ...)` in the metacharacter table and `(?<field_name>capture pattern)` in the Capture groups section. 8 minutes.
72. [Create and manage roles with Splunk Web (Securing 10.4)](https://help.splunk.com/en/splunk-enterprise/administer/manage-users-and-security/10.4/manage-splunk-platform-users-and-roles/create-and-manage-roles-with-splunk-web)  
   "Use the Indexes tab to choose the indexes that the role can search, and which ones it should search by default." Backs option D.

### 4.2 Perform delimiter field extractions using the FX

73. [Field Extractor: Select Method step (Knowledge Manager 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/field-extractor-select-method-step)  
   "This is commonly the case with structured, table-based data such as .csv files or events indexed from a database", with a comma-delimited USGS earthquake .csv event as the example. Regular Expression is for unstructured data such as a system log.
74. [Field Extractor: Rename Fields step (Knowledge Manager 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-field-extractor-in-splunk-web/field-extractor-rename-fields-step)  
   "If you select Space, Comma, Tab, or Pipe, the field extractor breaks the event up into fields based on that delimiter... If the delimiter is not one of those four options, select Other, and enter the delimiter character or characters in the provided field.".

## 5.0 Creating Field Aliases and Calculated Fields (10%)

Covered by [`topics/05-aliases-and-calculated-fields.md`](../topics/05-aliases-and-calculated-fields.md).

### Section-wide, covers every objective below

75. [About tags and aliases (Knowledge Manager 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/tags/about-tags-and-aliases)  
   "Tags come last in the sequence of search-time operations" settles option B; the Tags section (track abstract field values, group values under one name) settles option C. No case-sensitivity statement on the page.
76. [Understand and use the Common Information Model Add-on (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/get-started-with-knowledge-objects/understand-and-use-the-common-information-model-add-on)  
   Source of the two-components framing quoted in the explanation: fields plus event category tags, with which "a knowledge manager can normalize log files at search time so that they follow a similar schema".
77. [Create calculated fields with Splunk Web](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/calculated-fields/create-calculated-fields-with-splunk-web)  
   the six steps and the private-by-default note. 4 minutes.
78. [Field alias behavior change](https://help.splunk.com/en/splunk-enterprise/release-notes-and-updates/release-notes/10.4/known-issues-for-this-release/field-alias-behavior-change)  
   the 7.2.4 change and the lexicographical collision rule between competing `AS` configurations. 6 minutes.

### 5.1 Describe, create, and use field aliases

79. [Create field aliases in Splunk Web (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/field-aliases/create-field-aliases-in-splunk-web)  
   "Where field aliases fit in the search-time sequence of operations": aliases are applied after key-value extraction but before calculated fields, lookups, event types and tags, and later operations can reference them.
80. [Configure field aliases with props.conf (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/field-aliases/configure-field-aliases-with-props.conf)  
   "Perform field aliasing after key-value extraction but before field lookups so that you can specify a lookup table based on a field alias." Also "A field can have multiple aliases, but a single alias can only apply to one field.".
81. [props.conf (Configuration File Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/configuration-file-reference/10.4.0-configuration-file-reference/props.conf)  
   [<spec>] stanza section: spec is <sourcetype>, host::<host> or source::<source>, and the wildcard pattern match language is documented for the source:: and host:: forms, not for a bare source type stanza.

### 5.2 Describe, create, and use calculated fields

82. [About calculated fields (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/calculated-fields/about-calculated-fields)  
   "Preventing overrides of existing fields": "If a calculated field has the same name as a field that has been extracted by normal means, the calculated field will override the extracted field, even if the eval statement evaluates to null." Both coalesce forms follow.
83. [Configure calculated fields with props.conf (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/calculated-fields/configure-calculated-fields-with-props.conf)  
   EVAL-<field_name> = <eval statement>; "<eval_statement> is as flexible as it is for the eval search command. It can be evaluated to any value type, including multivals, boolean, or null.".

## 6.0 Creating Tags and Event Types (10%)

Covered by [`topics/06-tags-and-event-types.md`](../topics/06-tags-and-event-types.md).

### Section-wide, covers every objective below

84. [Define and manage tags in Settings](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/tags/define-and-manage-tags-in-settings)  
   the three views and the cross-app disable warning. 10 minutes.
85. [Tag the host field](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/tags/tag-the-host-field)  
   tagging does not change the field value. 4 minutes.
86. [Tag event types](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/tags/tag-event-types)  
   the tag layer on top of the event type layer. 5 minutes.
87. [Use the CIM to normalize data at search time](https://help.splunk.com/en/splunk-enterprise/common-information-model/8.6/using-the-common-information-model/use-the-cim-to-normalize-data-at-search-time)  
   why event types get tagged, with the `[eventtype=nessus]` example. Context only, not directly examined. 6 minutes.

### 6.1 Create and use tags

88. [Tag field-value pairs in Search (Knowledge Manager 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/tags/tag-field-value-pairs-in-search)  
   Search for tagged field values: exactly two forms, `tag=<tagname>` for any field and `tag::<field>=<tagname>` for a specific field. Wildcard examples `tag::eventtype=IP-*`, `tag::host=*local*`, `NOT tag::eventtype=*`.
89. [About event types (Knowledge Manager 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/event-types/about-event-types)  
   How event types work: eventtype=<name> is added at search time "even if you are searching for something completely different", and is then usable as a search term. A single event can match several event types, so eventtype acts as a multivalue field.

### 6.2 Describe event types and their uses

90. [Define event types in Splunk Web (Knowledge Manager 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/event-types/define-event-types-in-splunk-web)  
   Add an event type in Settings: "Priority determines the order of the event type listing in the expanded event. It also determines which color displays for the event type if two or more of the event types matching the event have a defined Color value.".
91. [About event type priorities (Knowledge Manager 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/event-types/about-event-type-priorities)  
   "When an event matches multiple event types, the Color for the event type with the best Priority value is displayed", and event types with a Priority are listed above those without.
92. [Configure event types in eventtypes.conf (Knowledge Manager 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/event-types/configure-event-types-in-eventtypes.conf)  
   Settles option B: event type definitions are stanzas in eventtypes.conf, never props.conf, and the stanza header is the event type name.

### 6.3 Create an event type

93. [Automatically find and build event types (Knowledge Manager 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/event-types/automatically-find-and-build-event-types)  
   Build Event Type utility: expand an event in the results, "Click Event Actions and select Build Event Type". Same page shows the finder command is `findtypes` (default top 10, max argument, analyses up to 5000 events), not searchtypes.

## 7.0 Creating and Using Macros (10%)

Covered by [`topics/07-macros.md`](../topics/07-macros.md).

### Section-wide, covers every objective below

94. [When to restart Splunk Enterprise after a configuration file change](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/administer-splunk-enterprise-with-configuration-files/when-to-restart-splunk-enterprise-after-a-configuration-file-change)  
   confirm macros.conf is on the no-restart list, note the debug refresh URL. Three minutes.

### 7.1 Describe macros

95. [Use search macros in searches (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/search-macros)  
   Insert search macros into search strings: backticks around the macro name, example index=web sourcetype=access_combined | `mymacro`. Also: macros inside quoted values are not expanded, and a macro that expands to a generating command needs a pipe BEFORE the backtick.

### 7.2 Create and use a basic macro

96. [Define search macros in Settings (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/search-macros/define-search-macros-in-settings)  
   Arguments are entered at creation time as a comma-delimited string of argument names; the definition references them as tokens with dollar signs, for example $arg1$. Validation checks 'the argument values used to invoke the search macro', which are supplied at invocation.
97. [macros.conf (Configuration File Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/configuration-file-reference/10.4.0-configuration-file-reference/macros.conf)  
   Stanza notes: 'Macros can be used in the search language by enclosing the macro name and any argument list in backtick marks' and 'The Splunk platform does not expand macros when they are inside quoted values'.

### 7.3 Define arguments and variables for a macro

98. [Search macro examples](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/search-macros/search-macro-examples)  
   iis_search(1), the expansion preview, makesessions plus pageviews_per_session(1), newrate(2). Ten minutes; rebuild one on your own instance.

### 7.4 Add and use arguments with a macro

99. [Use search macros in searches](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/search-macros/use-search-macros-in-searches)

## 8.0 Creating and Using Workflow Actions (10%)

Covered by [`topics/08-workflow-actions.md`](../topics/08-workflow-actions.md).

### 8.1 Describe the function of GET, POST, and Search workflow actions

100. [About workflow actions in Splunk Web (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/workflow-actions/about-workflow-actions-in-splunk-web)  
   the definition, the four canonical use cases, the one-paragraph description of each of the three kinds, the Settings navigation, and the "Apply only to the following fields / event types" scoping rules including the `*.
101. [workflow_actions.conf (Admin Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/configuration-file-reference/10.4.0-configuration-file-reference/workflow_actions.conf)  
   the only page that states the defaults, and the only page documenting `$@field_name$`, `$@field_value$`, `$@sid$`, `$@offset$`, `$@namespace$` and `$@latest_time$`. Read the settings list, then map each example stanza back to its.
102. [Control workflow action appearance in field and event menus (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/workflow-actions/control-workflow-action-appearance-in-field-and-event-menus)  
   event-level versus field-level placement, and screenshots of where the entries land. Read it for the mental picture of Event Actions versus a field's Actions menu. 5 minutes.

### 8.2 Create a GET workflow action

103. [Set up a GET workflow action (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/workflow-actions/set-up-a-get-workflow-action)  
   "GET link workflow actions drop one or more values into an HTML link", with WHOIS lookups and search engines as the canonical examples; values in the URI are URL encoded automatically.

### 8.3 Create a POST workflow action

104. [Set up a POST workflow action (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/workflow-actions/set-up-a-post-workflow-action)  
   Procedure step "Under Open link in, determine whether the workflow action displays in the current window or if it opens the link in a new window", plus the note that POST URI variables are URL encoded.

### 8.4 Create a Search workflow action

105. [Set up a search workflow action (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/workflow-actions/set-up-a-search-workflow-action)  
   "Identify the app that the search runs in. If you want it to run in a view other than the current one, select that view." No character limit or macro restriction is stated anywhere on the page.

## 9.0 Creating Data Models (10%)

Covered by [`topics/09-data-models-and-pivot.md`](../topics/09-data-models-and-pivot.md).

### Section-wide, covers every objective below

106. [Add an auto-extracted field](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/define-data-model-dataset-fields/add-an-auto-extracted-field)  
   the root-dataset-only rule and the four-value status picker. 5 minutes. Skim the eval expression, lookup, regular expression and Geo IP siblings from the same chapter, 5 minutes each.
107. [Design pivot tables with the Pivot Editor](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/pivot-manual/10.4/building-pivots/design-pivot-tables-with-the-pivot-editor)  
   the four pivot element categories and the per-type filter, split and aggregation options. 20 minutes.
108. [Open a non-transforming search in Pivot to create tables and charts](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/create-statistical-tables-and-chart-visualizations/open-a-non-transforming-search-in-pivot-to-create-tables-and-charts)  
   Instant Pivot, the fieldset choices, and the private data model it creates on save. 5 minutes.
109. [tstats](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/tstats)  
   the FROM datamodel syntax, `summariesonly`, `allow_old_summaries`, and the indexed-fields-only restriction. 15 minutes.
110. [from](https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.4/search-commands/from)  
   the `datamodel:` colon syntax and dotted dataset path. 5 minutes.
111. [pivot](https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.4/search-commands/pivot)  
   the SPL equivalent of the Pivot Editor, useful for reading a saved pivot. 10 minutes.
112. [datamodels.conf](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/configuration-file-reference/10.4.0-configuration-file-reference/datamodels.conf)  
   every acceleration default in one place, plus `strict_fields` and `tags_whitelist`. Read last as a defaults reference, 10 minutes.

### 9.1 Describe the relationship between data models and pivot

113. [About data models (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/build-a-data-model/about-data-models)  
   Datasets section: "Datasets break down into four types. These types are: Event datasets, search datasets, transaction datasets, and child datasets." Root datasets section names event, search and transaction as the top-level types.
114. [Introduction to Pivot (Pivot Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/pivot-manual/10.4/pivot-overview/introduction-to-pivot)  
   "About datasets, briefly" independently states "There are four dataset types" and lists event, transaction, search, and child datasets.

### 9.2 Identify data model attributes

115. [Design data models (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/build-a-data-model/design-data-models)  
   the exact Add Dataset flow for each dataset type, Dataset Name and Dataset ID rules, transaction Group Dataset requirements, and the macro restriction on child constraints. 20 minutes.
116. [Define dataset fields (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/define-data-model-dataset-fields/define-dataset-fields)  
   "Marking fields as hidden or required" and "Enter or update field names and types" cover hiding, renaming, and the Boolean/IPv4/Number/String type list; the Auto-extracted entry gives the root-dataset-only rule.

### 9.3 Create a data model

117. [Manage data models (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/build-a-data-model/manage-data-models)  
   "Enable data model acceleration" caveats: an accelerated model cannot be edited, acceleration applies only to root event and streaming root search datasets and their children, and the prerequisite is the accelerate_datamodel capability.
118. [Accelerate data models (Knowledge Manager Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-data-summaries-to-accelerate-searches/accelerate-data-models)  
   "When the data model definition changes and your summaries have not been updated to match it" describes editing an existing accelerated model's definition and the allow_old_summaries setting, which presupposes that the model can be changed rather than replaced.
119. [datamodel command (Search Reference 10.4)](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/datamodel)  
   Syntax and "Data model search mode options": positional order is data model name, dataset name, search mode; modes are search, flat, acceleration_search and their _string variants. Usage confirms it is a generating command that must lead with a pipe.

## 10.0 Using the Common Information Model (CIM) Add-On (10%)

Covered by [`topics/10-cim.md`](../topics/10-cim.md).

### Section-wide, covers every objective below

120. [Match TA event types with CIM data models to accelerate searches](https://help.splunk.com/en/data-management/common-information-model/8.6/using-the-common-information-model/match-ta-event-types-with-cim-data-models-to-accelerate-searches)  
   how a TA's `eventtypes.conf` plus `tags.conf` produces model membership. 10 minutes.

### 10.1 Describe the Splunk CIM

121. [Overview of the Splunk Common Information Model (CIM 8.6)](https://help.splunk.com/en/data-management/common-information-model/8.6/introduction/overview-of-the-splunk-common-information-model)  
   "The CIM add-on contains a collection of pre-configured data models ... Each data model in the CIM consists of a set of field names and tags that define the least common denominator of a domain of interest." Also lists the extra tools shipped with the add-on.
122. [Install the Splunk Common Information Model Add-on (CIM 8.6)](https://help.splunk.com/en/data-management/common-information-model/8.6/introduction/install-the-splunk-common-information-model-add-on)  
   Settles option D: "Install the Splunk Common Information Model Add-on to your search heads only." Also Splunkbase app 1621 and the cim_modactions index.
123. [Approaches to using the CIM (CIM 8.6)](https://help.splunk.com/en/data-management/common-information-model/8.6/using-the-common-information-model/approaches-to-using-the-cim)  
   Lists the documented uses (normalize, validate, generate reports and dashboards via Pivot, common action model), which is what makes option B a near-miss rather than nonsense.
124. [Set up the Splunk Common Information Model Add-on (CIM 8.6)](https://help.splunk.com/en/data-management/common-information-model/8.6/introduction/set-up-the-splunk-common-information-model-add-on)  
   Accelerating CIM data models section repeats it: "All data models included in the CIM add-on have data model acceleration turned off by default." Also documents the CIM Setup page where you enable it.
125. [Accelerate CIM data models (Common Information Model 8.6)](https://help.splunk.com/en/data-management/common-information-model/8.6/using-the-common-information-model/accelerate-cim-data-models)  
   Enable data model acceleration section: "By default, the data model acceleration for all models included in the Splunk Common Information Model Add-on are disabled.".

### 10.2 List the knowledge objects included with the Splunk CIM Add-On

126. [Data Models chapter index (CIM 8.6)](https://help.splunk.com/en/data-management/common-information-model/8.6/data-models)  
   The authoritative 8.6 model catalogue. Confirms Alerts, Email and Databases have reference pages, that there is no User permissions model, and that Application State and Change Analysis are flagged deprecated.
127. [Use the CIM to validate your data (CIM 8.6)](https://help.splunk.com/en/data-management/common-information-model/8.6/using-the-common-information-model/use-the-cim-to-validate-your-data)  
   "Use the CIM Validation (S.o.S.) datamodel" section: CIM 4.2.0 moved the validation datasets into their own data model, so CIM Validation (S.o.S.) genuinely is a shipped model even though it has no reference-table page.
128. [Use the CIM Filters to exclude data (CIM 8.6)](https://help.splunk.com/en/data-management/common-information-model/8.6/using-the-common-information-model/use-the-cim-filters-to-exclude-data)  
   Proof that the add-on does ship search macros: the CIM Filter macros "are available by default and located in the CIM Filters section of the $SPLUNK_HOME/etc/apps/Splunk_SA_CIM/default/macros.conf file". They exclude data, they do not normalize it, which is why option A is keyed false here.
129. [CIM fields per associated data model (CIM 8.6)](https://help.splunk.com/en/data-management/common-information-model/8.6/data-models/cim-fields-per-associated-data-model)  
   Single-page field-to-model map; the model column shows the current names in use (Change, Data Access, Data Loss Prevention, Endpoint) with no Application State or Change Analysis.

### 10.3 Use the CIM Add-On to normalize data

130. [Use the CIM to normalize data at search time (CIM 8.6)](https://help.splunk.com/en/data-management/common-information-model/8.6/using-the-common-information-model/use-the-cim-to-normalize-data-at-search-time)  
   Step 5: "Normalize your data for each of these fields using a combination of field aliases, field extractions, and lookups." Sub-steps b/c/d give the alias, extraction, lookup order; step 3 covers the CIM-compliant event tags the stem already grants.
131. [How to use the CIM data model reference tables (CIM 8.6)](https://help.splunk.com/en/data-management/common-information-model/8.6/data-models/how-to-use-the-cim-data-model-reference-tables)  
   Describes the tags tables (constraints per dataset, including inherited tags from parent datasets) and the fields tables (extracted and calculated fields, descriptions, expected values), and notes that "object" is the pre-6.5.0 term for "dataset".

## Cross-cutting reference pages

Cited by the reference files rather than by one blueprint objective: command-type classification, conf-file specs, function catalogues. Read them when a topic file sends you here, not in sequence.

132. [Configuration file precedence](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/administer-splunk-enterprise-with-configuration-files/configuration-file-precedence)
133. [Transforms.conf](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/configuration-file-reference/10.4.0-configuration-file-reference/transforms.conf)
134. [Index time versus search time](https://help.splunk.com/en/splunk-enterprise/administer/manage-indexers-and-indexer-clusters/10.4/indexing-overview/index-time-versus-search-time)
135. [Bubble chart (Simple XML Dashboards 10.4)](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/charts/bubble-chart)  
   Definition of the three dimensions, the `<stats_command> <y-axis_field> <x-axis_field> <bubble_size_field>` data shape, and the four-column Statistics tab requirement.
136. [Chart overview (Simple XML Dashboards 10.4)](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/charts/chart-overview)  
   Chart selection table: pie shows a single dimension, column/bar/line/area plot on two axes, scatter and bubble represent multiple dimensions.
137. [Line and area charts](https://help.splunk.com/en/splunk-enterprise/create-dashboards-and-reports/simple-xml-dashboards/10.4/charts/line-and-area-charts)
138. [Rename source types at search time](https://help.splunk.com/en/splunk-enterprise/get-started/get-data-in/10.4/configure-source-types/rename-source-types-at-search-time)
139. [About regular expressions with field extractions](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/fields-and-field-extractions/about-regular-expressions-with-field-extractions)
140. [Use macros with event types and tags](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/tags/use-macros-with-event-types-and-tags)
141. [Make your lookup automatic](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/use-the-configuration-files-to-configure-lookups/make-your-lookup-automatic)
142. [What is splunk knowledge](https://help.splunk.com/en/splunk-enterprise/manage-knowledge-objects/knowledge-management-manual/10.4/welcome-to-knowledge-management/what-is-splunk-knowledge)
143. [Field alias behavior change](https://help.splunk.com/en/splunk-enterprise/release-notes-and-updates/release-notes/10.2/known-issues-for-this-release/field-alias-behavior-change)
144. [Manage Splunk Enterprise jobs from the OS (Search Manual 10.4)](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/manage-jobs/manage-splunk-enterprise-jobs-from-the-os)  
   "When a search job runs, it will manifest itself as a process in the OS called splunkd search", with the ps output showing the child processes under the splunkd pid. Settles option D.
145. [Use subsearch to correlate events](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.4/subsearches/use-subsearch-to-correlate-events)
146. [Date and time functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/date-and-time-functions)
147. [Evaluation functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/evaluation-functions)
148. [Multivalue eval functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/evaluation-functions/multivalue-eval-functions)
149. [Eventstats](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/eventstats)
150. [Regex](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/regex)
151. [Streamstats](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/streamstats)
152. [Xyseries](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/search-commands/xyseries)
153. [Aggregate functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/statistical-and-charting-functions/aggregate-functions)
154. [Time functions](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.4/statistical-and-charting-functions/time-functions)

## How to use this list

Read the topic file for a section first, then its pages here. The topic file tells you which paragraph on the page matters, which turns a 25-minute reference page into a 5-minute read. Doing it the other way round costs hours.

If you only have time for a handful, read these six: the search-time operation sequence (it underpins sections 4, 5, 6, 9 and 10, half the exam by weight), the `transaction` command reference and About transactions (section 3.0 is the heaviest at 15%), `workflow_actions.conf` (the only page stating those defaults), Use search macros in searches, and the CIM overview (10% of the exam with no Splunk course behind it).
