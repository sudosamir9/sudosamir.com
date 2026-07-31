# Lab setup

One-time setup on your local Splunk Enterprise 10.x. Every lab in the topic files assumes this is done. Budget about twenty minutes.

You need three indexes, the Splunk tutorial data, one JSON dataset for the CIM lab, and the CIM add-on.

## What data you already have

The Udemy course materials in `/mnt/c/Academy/splunk-materials/` contain the Splunk tutorial dataset, which is the same Buttercup Games data every Splunk doc example uses. That is convenient, because it means the worked examples in the topic files run unmodified.

| Path (WSL) | Path (Windows) | What it is | Sourcetype to assign |
|---|---|---|---|
| `splunk resources Udemy/sample_logs_generic/www1/access.log`, and the same under `www2/` and `www3/` | `C:\Academy\splunk-materials\splunk resources Udemy\sample_logs_generic\www1\access.log` | Apache access logs with a `JSESSIONID` cookie. The session id is what makes the transaction labs work | `access_combined_wcookie` |
| `sample_logs_generic/www1/secure.log`, `www2/`, `www3/`, `mailsv/secure.log` | as above | Linux `sshd` auth logs, successes and failures | `secure` |
| `sample_logs_generic/vendor_sales/vendor_sales.log` | as above | `VendorID=` / `Code=` / `AcctID=` records, structured and delimited | `vendor_sales` |
| `Final_Lab_Apps_and_sample_logs/sample_logs.txt` | as above | ~6 MB of JSON network flow records with `src_ip`, `dest_ip`, `bytes_in`, `protocol_stack` | `network_flow` (you will create this) |

The `._` prefixed files in those folders are macOS resource forks. Ignore them, and do not index them.

**One important gotcha.** These log files carry fixed timestamps from September 2022. If you search "Last 24 hours" you will get nothing. Every lab search either uses **All time** or sets `earliest=0`. If you would rather have data with current timestamps, download `tutorialdata.zip` fresh from the Splunk Search Tutorial, which generates timestamps relative to the download date. Either works. The fixed-timestamp version is actually easier to reason about when you are testing `maxspan` and `maxpause` behaviour, because the data does not move under you.

## Step 1: create the indexes

Settings, Indexes, New Index. Create three, all defaults otherwise:

| Index name | Holds |
|---|---|
| `tutorial` | The Buttercup Games web, security and sales data |
| `netflow` | The JSON network flow data, used by the CIM lab |
| `scratch` | Anything you want to throw away |

Or from the CLI, if you prefer:

```bash
splunk add index tutorial
splunk add index netflow
splunk add index scratch
```

## Step 2: load the web access data

Settings, Add Data, Upload. Do this once per `access.log` file (there are three, under `www1`, `www2` and `www3`).

1. Select `www1/access.log`.
2. On Set Source Type, choose **Web**, then `access_combined_wcookie`. Confirm the preview shows one event per line with a timestamp of `01/Sep/2022:18:22:16` format. If the timestamp column is blank, the sourcetype is wrong.
3. Next. On Input Settings set **Host, Segment in path** is not available for an upload, so set **Host, Constant value** to `www1`. Repeat with `www2` and `www3` for the other two files. Getting three distinct hosts matters, because several labs split by host.
4. Index: `tutorial`.
5. Review, Submit.

Verify:

```spl
index=tutorial sourcetype=access_combined_wcookie earliest=0 | stats count by host
```

You should get three rows, `www1`, `www2` and `www3`, with a few hundred thousand events between them.

## Step 3: load the security and sales data

Same Upload flow.

- The four `secure.log` files: sourcetype `secure`, host `www1` / `www2` / `www3` / `mailsv`, index `tutorial`.
- `vendor_sales.log`: sourcetype `vendor_sales`, host `vendor_sales`, index `tutorial`.

Verify:

```spl
index=tutorial earliest=0 | stats count by sourcetype
```

Three sourcetypes: `access_combined_wcookie`, `secure`, `vendor_sales`.

## Step 4: load the JSON network flow data

This one gets its own index and its own sourcetype because the CIM lab in `topics/10-cim.md` normalizes it against the Network Traffic data model.

Settings, Add Data, Upload, select `Final_Lab_Apps_and_sample_logs/sample_logs.txt`.

On Set Source Type the auto-detection will probably guess `_json`. Do not accept it. The first few lines of the file are malformed (they start with `host={"endtime": ...`), so a strict JSON sourcetype will drop them. Instead:

1. Click **New Source Type**, name it `network_flow`.
2. Set Event Breaks to **Every Line**.
3. Set Timestamp to **Advanced**, with `Timestamp prefix` of `"timestamp":"` and a `Timestamp format` of `%Y-%m-%dT%H:%M:%S.%6NZ`.
4. Save, then set Index to `netflow`.

Verify:

```spl
index=netflow earliest=0 | head 5
```

You should see JSON events with a parsed `_time`. The `src_ip`, `dest_ip` and `bytes_in` fields will be auto-extracted as key-value pairs from the JSON.

## Step 5: install the CIM add-on

Section 10.0 is 10% of the exam and you cannot practice it without the add-on.

**Online:** Apps, Find More Apps, search "Splunk Common Information Model", install `Splunk_SA_CIM`. Restart if prompted.

**Offline:** download the `Splunk_SA_CIM` package from Splunkbase (app 1621) on another machine, then Apps, Manage Apps, Install app from file.

After installing, do the setup step, because leaving it at the default is the thing the exam asks about:

1. Apps, Manage Apps, find Splunk Common Information Model, click **Set up**.
2. For the **Network Traffic** data model, set the index allowlist to `netflow`.
3. For **Authentication**, set it to `tutorial`.
4. For **Web**, set it to `tutorial`.
5. Leave acceleration off for now. `topics/10-cim.md` has you turn it on deliberately so you can see the difference.

The three add-ons in `splunk resources Udemy/splunk TAs/` (`Splunk_TA_nix`, `Splunk_TA_windows`, the Fortinet FortiGate TA) are all CIM-compliant, so installing one and reading its `props.conf` is a good way to see how a real add-on does its aliases, calculated fields, event types and tags. That is optional, and it is a reading exercise rather than a lab.

## Step 6: create a working app

Do not put your lab knowledge objects in Search & Reporting. Several labs are about permissions and app scoping, and having them mixed into the default app makes that impossible to observe.

Apps, Manage Apps, Create app. Name `splk1002`, folder name `splk1002`, template `barebones`, visible.

Switch to it before starting any lab. Everything you create (extractions, aliases, calculated fields, event types, tags, macros, workflow actions, data models) goes here, which also means you can delete the app at the end and get a clean instance back.

## Verification

Run this before starting the first lab. All four rows should be non-zero.

```spl
| union
    [search index=tutorial sourcetype=access_combined_wcookie earliest=0 | stats count | eval dataset="web"]
    [search index=tutorial sourcetype=secure earliest=0 | stats count | eval dataset="security"]
    [search index=tutorial sourcetype=vendor_sales earliest=0 | stats count | eval dataset="sales"]
    [search index=netflow earliest=0 | stats count | eval dataset="netflow"]
| table dataset count
```

And confirm the add-on is present and its data models are visible:

```spl
| datamodel
```

You should see the CIM models (Authentication, Network_Traffic, Web and the rest) in the output.

## If something is wrong

**No events after upload.** Almost always the time range. Set All time, or add `earliest=0`.

**Timestamps all show the upload time.** The sourcetype did not recognise the timestamp format, so Splunk fell back to the index time. Re-check the sourcetype on Set Source Type, and look at the preview pane before submitting rather than after.

**One host for everything.** You accepted the default host, which is the Splunk server name. Delete and re-upload with a constant host value, or set the host per event with a search-time override. Several labs split by host so it is worth fixing properly.

**`| datamodel` shows nothing.** The add-on is installed but not visible from the app you are in. Either switch to the Search app to check, or set the CIM app's permissions to share globally.
