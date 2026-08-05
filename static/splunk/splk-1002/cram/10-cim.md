# 10.0 CIM Add-On - Cram

## Syntax

```spl
| datamodel [<model>] [<dataset>] [search|flat|acceleration_search|search_string|flat_string|acceleration_search_string] [strict_fields=<b>] [allow_old_summaries=<b>] [summariesonly=<b>]
| tstats [summariesonly=<b>] [allow_old_summaries=<b>] <stats-func> FROM datamodel=<model>.<root> [where nodename=<lineage>] [BY <fields> [span=<t>]]
| datamodelsimple type=<models|objects|attributes> datamodel=<model> object=<dataset> nodename=<lineage>
| from datamodel:<model>.<dataset>
| `cim_datamodelinfo`
```

```ini
# eventtypes.conf
[web_activity]
search = index=web sourcetype=access_combined

# tags.conf
[eventtype=web_activity]
web = enabled

# props.conf
[access_combined]
FIELDALIAS-cim_src = clientip AS src

[secure]
EVAL-action = case(match(_raw,"(?i)Accepted"),"success", match(_raw,"(?i)Failed"),"failure", true(),"error")
```

## Defaults and limits

| Item | Default |
| --- | --- |
| CIM data model acceleration | disabled, every model |
| CIM Setup Indexes allowlist | all indexes |
| `datamodel` search mode | none, returns JSON |
| `strict_fields` | `true` |
| `allow_old_summaries` (datamodel, tstats) | `false` |
| `summariesonly` (datamodel, tstats) | `false` |
| Add-on install tier | search heads only |
| Splunkbase app ID / folder | 1621 / `Splunk_SA_CIM` |
| Model JSON path | `$SPLUNK_HOME/etc/apps/Splunk_SA_CIM/default/data/models` |
| CIM Setup page | Apps > Manage Apps > Set up, or `/en-US/app/search/cim_setup` |
| Setup capability | `accelerate_datamodel` (4.12.0+), `admin_all_objects` (4.11.0 and below) |
| Common action model index | `cim_modactions` (`cim_summary` removed) |
| Documented models in 8.6 | 26, two deprecated (Application State, Change Analysis, both 4.12.0) |

## Decision rule

Right fields, no rows in the model = missing tag. Rows in the model, empty columns = missing field mapping. Rename only = field alias. Derive or normalize a value = calculated field (EVAL). Value absent or coded = lookup. Pipeline order: extraction, alias, calculated field, lookup, event type, tag. Child dataset inherits parent tags and adds its own.

## Five facts they test

1. Search-time only. Schema-on-the-fly, raw data left intact, nothing reindexed.
2. Tags are the entry condition. Compliance = correct tags AND populated required fields.
3. Acceleration is OFF by default; `summariesonly=true` returns zero rows on a stock CIM model.
4. `datamodel ... search` returns dotted `Dataset.field` names; `flat` strips the prefix.
5. `datamodelsimple` ships with the add-on; `datamodel`, `tstats`, `pivot`, `from` are core SPL.

## Tag quick list

`alert` Alerts | `authentication` Authentication | `certificate` Certificates | `change` Change | `data`,`access` Data Access | `database` Databases | `dlp`,`incident` DLP | `email` Email | `process`,`report` Endpoint Processes | `service`,`report` Endpoint Services | `endpoint`,`filesystem` Endpoint Filesystem | `endpoint`,`registry` Endpoint Registry | `listening`,`port` Endpoint Ports | `track_event_signatures` Event Signatures | `messaging` Interprocess Messaging | `ids`,`attack` Intrusion Detection | `inventory` Inventory | `jvm` JVM | `malware`,`attack` Malware_Attacks | `malware`,`operations` Malware_Operations | `network`,`resolution`,`dns` DNS | `network`,`session` Network Sessions | `network`,`communicate` Network Traffic | `performance` Performance | `modaction` Splunk Audit Modular_Actions | `ticketing` Ticket Management | `update`,`status` Updates | `report`,`vulnerability` Vulnerabilities | `web` Web

## Trap IDs

T-10-01 search-time not index-time | T-10-02 acceleration off by default | T-10-03 tags required, not just fields | T-10-04 allowlist default is all indexes | T-10-05 search heads only | T-10-06 Inventory not "Compute Inventory" | T-10-07 dotted field names vs flat | T-10-08 alias runs before calc/lookup/eventtype/tag | T-10-09 datamodelsimple is add-on only | T-10-10 expected values are not enforced | T-10-11 Application State deprecated, use Endpoint | T-10-12 child datasets inherit parent tags | T-10-13 do not clone a CIM model | T-10-14 CIM Add-on vs Add-on Builder | T-10-15 `cim_modactions`, not `cim_summary`
