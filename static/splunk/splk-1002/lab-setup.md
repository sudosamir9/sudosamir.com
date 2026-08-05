# Lab setup

One-time setup on your local Splunk Enterprise 10.x. Every lab and every worked example in this guide runs against the dataset below. Budget about twenty minutes.

You will create three indexes, load seven log files, add one lookup, and install the CIM add-on.

## The practice dataset

[Download the practice data](lab-data/splk-1002-practice-data.zip) (1.5 MB zipped, 18 MB unpacked). The individual files are also [browsable](lab-data/) if you want to look at a line without unpacking anything.

| File in the zip | Goes to index | Host to set | Sourcetype | Events |
|---|---|---|---|---|
| `www1/access.log` | `web` | `web1` | `access_combined` | 13,628 |
| `www2/access.log` | `web` | `web2` | `access_combined` | 12,912 |
| `www3/access.log` | `web` | `web3` | `access_combined` | 12,992 |
| `www1/secure.log` | `security` | `web1` | `linux_secure` | 10,593 |
| `www2/secure.log` | `security` | `web2` | `linux_secure` | 9,683 |
| `www3/secure.log` | `security` | `web3` | `linux_secure` | 9,983 |
| `cisco_ironport_web.log` | `cisco` | `cisco` | `cisco:wsa:squid` | 6,757 |
| `MOCK_DATA.csv` | not an index | | uploaded as a lookup | 1,000 rows |

The folders are named `www1` to `www3` but the host you set is `web1` to `web3`. That is deliberate: the host is something you choose at input time, not something read out of the file, and this guide's searches all use `web1`, `web2`, `web3`.

**What each source is good for.** The `web` index is richly structured, so it carries the transforming, filtering and correlation work. Every access event has a `JSESSIONID` in its query string, which is what makes the `transaction` labs in section 3.0 work. The `security` index is semi-structured text, which makes it the right target for the field extraction labs in section 4.0. The `cisco` index is Squid-format proxy logging, useful for delimiter extraction and for the CIM normalization work in section 10.0.

**The timestamps are fixed and historical.** The web and security logs cover 31 March to 7 April 2021. The Cisco log covers 12 November to 15 December 2017. Searching "Last 24 hours" returns nothing at all. Every search in this guide uses **All time**, or sets `earliest=0` explicitly. Set your time picker to All time now and leave it there. Fixed timestamps are easier to reason about anyway when you are testing `maxspan` and `maxpause`, because the data does not move under you between runs.

## Step 1: create the three indexes

Settings, Indexes, New Index. Create three, leaving every other setting at its default.

| Index | Holds |
|---|---|
| `web` | Apache access logs from three web servers |
| `security` | Linux `sshd` and `su` authentication logs from the same three servers |
| `cisco` | Cisco Web Security Appliance proxy logs in Squid format |

From the CLI instead, if you prefer:

```bash
splunk add index web
splunk add index security
splunk add index cisco
```

## Step 2: load the six web and security logs

Settings, Add Data, Upload. Repeat six times, once per file. The wizard is four steps and only two of them need your attention.

1. **Select Source.** Choose the file, for example `www1/access.log`.
2. **Set Source Type.** For an `access.log` choose **Web**, then `access_combined`. For a `secure.log` choose **Operating System**, then `linux_secure`. Check the preview before continuing: you want one event per line, with a populated Time column. If the Time column is blank or every event shares the upload time, the sourcetype is wrong and nothing downstream will work.
3. **Input Settings.** This is the step people skip. Set **Host** to `web1`, `web2` or `web3` by hand, matching the folder the file came from. Set **Index** to `web` for an access log or `security` for a secure log.
4. **Review**, then **Submit**.

## Step 3: load the Cisco proxy log

Same wizard, once.

1. Select `cisco_ironport_web.log`.
2. Set Source Type: type `cisco:wsa:squid` into the sourcetype box. It may not appear in the menu, which is fine, the name is what matters. The preview should show one event per line with times in November and December 2017, read from the leading epoch value.
3. Input Settings: Host `cisco`, Index `cisco`.
4. Review, Submit.

Without the Splunk Add-on for Cisco WSA installed, these events arrive as raw text with almost no extracted fields. That is intentional here. Section 4.0 uses them to practise extraction, and the field names you create are yours.

## Step 4: verify the load

Run this with the time range set to **All time**:

```spl
index=*
| stats count BY host, index, sourcetype
```

You should get exactly seven rows:

<!-- results -->

| host | index | sourcetype | count |
|---|---|---|---|
| cisco | cisco | cisco:wsa:squid | 6757 |
| web1 | security | linux_secure | 10593 |
| web1 | web | access_combined | 13628 |
| web2 | security | linux_secure | 9683 |
| web2 | web | access_combined | 12912 |
| web3 | security | linux_secure | 9983 |
| web3 | web | access_combined | 12992 |

That is 76,548 events in total. If a count is short, the file was partially uploaded; delete the input and repeat it. If a whole row is missing, the index or host was set wrong on that upload. If you see extra rows for hosts you do not recognise, you have leftover inputs from earlier experiments; find them under Settings, Data inputs and remove them.

Now confirm the fields you will rely on actually extracted:

```spl
index=web sourcetype=access_combined
| head 1
| table clientip, method, uri_path, status, bytes, action, categoryId, productId, JSESSIONID
```

Every column should hold a value except `categoryId` and `productId`, which are only present on some events. `action`, `categoryId`, `productId` and `JSESSIONID` come from Splunk's automatic key-value extraction reading the `key=value` pairs out of the URI query string, which is search-time operation four of nine. If those four columns are empty, check that the sourcetype really is `access_combined` and not something Splunk guessed.

## Step 5: add the lookup

`MOCK_DATA.csv` is a thousand rows of fictional people with an `ip_address` column. It is used in a couple of places in this guide to show where lookups sit in the search-time sequence, nothing more.

1. Settings, Lookups, Lookup table files, New Lookup Table File.
2. Destination app `search`, upload `MOCK_DATA.csv`, destination filename `mock_users.csv`.
3. Settings, Lookups, Lookup definitions, New. Name `mock_users`, type File-based, file `mock_users.csv`.

Check it:

```spl
| inputlookup mock_users
| head 5
```

## Step 6: install the CIM add-on

Section 10.0 needs it. Apps, Find More Apps, search for **Splunk Common Information Model**, install, restart when prompted. It installs to `$SPLUNK_HOME/etc/apps/Splunk_SA_CIM`.

The add-on contains only search-time knowledge objects, so on a single-instance install there is nothing else to place anywhere. Every one of its data models ships with acceleration turned **off**, which is what you want on a laptop.

Confirm it is there:

```spl
| datamodel
```

You should see the CIM models listed, `Web`, `Authentication`, `Network_Traffic` and the rest.

## Step 7: raise the search limits you will hit

Two defaults get in the way of the section 3.0 labs on a dataset this size. Settings, Server settings, Search preferences, or edit `limits.conf` in `$SPLUNK_HOME/etc/system/local/`:

```ini
[search]
max_rawsize_perchunk = 200000000

[transactions]
maxopentxn = 20000
maxopenevents = 200000
```

You can skip this and come back to it if a `transaction` search warns that transactions were evicted. Nothing else in the guide needs it.

## What you should be able to run now

If these three return results, the lab is ready.

```spl
index=web sourcetype=access_combined status=200 action=purchase
| stats count BY categoryId
```

```spl
index=security sourcetype=linux_secure "Failed password"
| stats count BY host
```

```spl
index=cisco sourcetype=cisco:wsa:squid
| head 5
| table _time, _raw
```

## Resetting

To start over, Settings, Indexes, and delete the contents of `web`, `security` and `cisco`, then re-upload. From the CLI:

```bash
splunk clean eventdata -index web
splunk clean eventdata -index security
splunk clean eventdata -index cisco
```
