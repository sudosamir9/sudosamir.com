# Attempt tracker

Two tables. The first is history. The second is the one that matters.

## Attempts

Add a row per attempt. Corrected score is the score after fixing any answer keys the course got wrong.

| Date | Source | Qs | Raw | Corrected | Minutes | 1.0 | 2.0 | 3.0 | 4.0 | 5.0 | 6.0 | 7.0 | 8.0 | 9.0 | 10.0 | Analysis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | | | | | | |

Section columns hold the per-section rate for that attempt, for example `3/5`. Leave a cell blank when the test had no question in that section.

Note on interpreting the score: Splunk publishes no passing score for SPLK-1002. The 70% figure that circulates is not from Splunk. Use these numbers to find weak sections, not to predict a pass.

## Repeat misses

The single most useful table here. One row per trap ID you have ever missed, with a running count. Sort by count, highest first. A trap missed three times across three different sources is what will cost you on exam day.

| Trap ID | Section | Short description | Times missed | Last missed | Status |
|---|---|---|---|---|---|
| | | | | | |

Status values: `open` (still getting it wrong), `reviewed` (re-read the topic section since the last miss), `closed` (answered correctly at least twice since the last miss).

## Coverage check

Track which blueprint sections your practice material has actually tested you on. Practice tests are rarely weighted like the real exam, so a section can look strong purely because only two questions touched it.

| Section | Weight | Questions seen so far | Expected on a 65-question exam |
|---|---|---|---|
| 1.0 Using Transforming Commands for Visualizations | 5% | 0 | ~3 |
| 2.0 Filtering and Formatting Results | 10% | 0 | ~7 |
| 3.0 Correlating Events | 15% | 0 | ~10 |
| 4.0 Creating and Managing Fields | 10% | 0 | ~7 |
| 5.0 Creating Field Aliases and Calculated Fields | 10% | 0 | ~7 |
| 6.0 Creating Tags and Event Types | 10% | 0 | ~7 |
| 7.0 Creating and Using Macros | 10% | 0 | ~7 |
| 8.0 Creating and Using Workflow Actions | 10% | 0 | ~7 |
| 9.0 Creating Data Models | 10% | 0 | ~7 |
| 10.0 Using the Common Information Model (CIM) Add-On | 10% | 0 | ~7 |
| Off blueprint (lookups, dashboards, reports, alerts) | 0% | 0 | 0 |

The last row is worth watching. If a practice test spends five questions on lookups, that test is written against something other than the current blueprint, and its overall score means less than it looks.
