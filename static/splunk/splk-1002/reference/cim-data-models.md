# Reference: CIM data model catalogue

This is the lookup table for section 10.0. The concepts, the normalization procedure, and the search-time pipeline are taught in `topics/10-cim.md` and are not repeated here. What follows is the catalogue: every model, the tags that admit events to it, the field lists for the six models the exam draws from most, and the searches that prove compliance. Everything below tracks CIM 8.6 on Splunk Enterprise 10.4.

Two reading rules before the tables. Tags are the entry condition: a dataset returns nothing for your events until the events carry every tag in its constraint, and child datasets inherit the parent constraint rather than replacing it. Fields are the payload: an event admitted by tags but missing the required fields appears in the dataset with empty columns, which reads as "the model is broken" and is actually "the mapping is incomplete".

## 1. Master catalogue

Twenty-six documented models in CIM 8.6, two of them deprecated. The Typical sources column is practitioner guidance, not a docs claim; every other column comes from the CIM 8.6 data model reference pages.

| Model | Dataset(s) | Required tags | What data belongs here | Typical sources |
| --- | --- | --- | --- | --- |
| Alerts | Alerts | `alert` | Alerts from alerting and monitoring systems, not from security appliances | Nagios, NetCool, Zabbix |
| Application State (deprecated) | Ports, Processes, Services | Ports `listening`,`port`; Processes `process`,`report`; Services `service`,`report` | Deprecated in 4.12.0, replaced by Endpoint. Present for backwards compatibility only | Map nothing new here |
| Authentication | Authentication, Default_Authentication, Insecure_Authentication, Privileged_Authentication, Failed_Authentication, Successful_Authentication | `authentication` on the root | Login activity from any source, successful or not, interactive or service | Linux `secure`, Windows Security log, Okta, Azure AD, CloudTrail sign-ins |
| Certificates | All_Certificates, SSL | All_Certificates `certificate`; SSL `ssl` OR `tls` | Key and certificate management from secure servers and IAM systems | Zeek `x509` and `ssl`, Windows CA, Venafi |
| Change | All_Changes, Auditing_Changes, Endpoint_Changes, Network_Changes, Account_Management, Instance_Changes | All_Changes `change`; Auditing_Changes `audit`; Endpoint_Changes `endpoint`; Network_Changes `network`; Account_Management `account`; Instance_Changes `instance` | Create, read, update and delete activity against any managed object | CloudTrail, Azure Activity Log, Windows account management, firewall rule edits |
| Change Analysis (deprecated) | All_Changes and children | `change` | Deprecated in 4.12.0, replaced by Change | Map nothing new here |
| Data Access | Data_Access | `data`,`access` | Shared data access by users, for unauthorized-access and exfiltration detection | SharePoint, Box, file server auditing |
| Databases | All_Databases, Database_Instance, Instance_Stats, Session_Info, Lock_Info, Database_Query, Tablespace, Query_Stats | All_Databases `database`; then `instance`, `stats`, `session`, `lock`, `query`, `tablespace` | Structured and semi-structured data storage events and statistics | Oracle, SQL Server, MySQL, DB Connect |
| Data Loss Prevention | DLP_Incidents | `dlp`,`incident` | Incidents raised by DLP tooling | Symantec DLP, Forcepoint, Microsoft Purview |
| Email | All_Email, Delivery, Content, Filtering | All_Email `email`; Delivery `delivery`; Content `content`; Filtering `filter` | Email traffic, server to server or client to server, plus filtering verdicts | Exchange message tracking, Postfix, Proofpoint |
| Endpoint | Ports, Processes, Services, Filesystem, Registry | Ports `listening`,`port`; Processes `process`,`report`; Services `service`,`report`; Filesystem `endpoint`,`filesystem`; Registry `endpoint`,`registry` | Endpoint client state and activity: processes, services, files, listening ports, registry | Sysmon, osquery, CrowdStrike, auditd |
| Event Signatures | Event_Signatures | `track_event_signatures` | Standard location for Windows EventID data | Windows event logs via the Microsoft Windows add-on |
| Interprocess Messaging | All_Interprocess_Messaging | `messaging` | Transactional requests across programmatic interfaces, queues, IPC and web interfaces | RabbitMQ, Kafka, API gateways |
| Intrusion Detection | IDS_Attacks | `ids`,`attack` | Attack detection from network and host monitoring devices and applications | Snort, Suricata, Palo Alto threat logs |
| Inventory | All_Inventory, CPU, Memory, Network, Storage, OS, User, Default_Accounts, Virtual_OS, Snapshot, Tools | `inventory` plus a component tag: `cpu`, `memory`, `network`, `storage`, OS `system`,`version`, `user`, Default_Accounts `default`, `virtual`, `snapshot`, `tools` | Inventory of computer infrastructure components, plus network inventory and topology | CMDB exports, vCenter, AWS Config |
| Java Virtual Machines (JVM) | JVM, Threading, Runtime, OS, Compilation, Classloading, Memory | JVM `jvm`; then `threading`, `runtime`, `os`, `compilation`, `classloading`, `memory` | Generic Java server platform telemetry | JMX inputs, Tomcat, WebLogic |
| Malware | Malware_Attacks, Malware_Operations | Malware_Attacks `malware`,`attack`; Malware_Operations `malware`,`operations` | Malware detections, and the health of the endpoint protection estate | Symantec Endpoint Protection, Defender, McAfee ePO |
| Network Resolution (DNS) | DNS | `network`,`resolution`,`dns` | DNS traffic, server to server or client to server | Zeek `dns`, Windows DNS logs, Infoblox |
| Network Sessions | All_Sessions, Session_Start, Session_End, DHCP, VPN | All_Sessions `network`,`session`; Session_Start `start`; Session_End `end`; DHCP `dhcp`; VPN `vpn` | DHCP and VPN session assignment and teardown, plus network inventory and topology | ISC and Windows DHCP, AnyConnect, GlobalProtect |
| Network Traffic | All_Traffic | `network`,`communicate` | Connection-level flows across network infrastructure | Firewall traffic logs, NetFlow, Zeek `conn`, VPC Flow Logs |
| Performance | All_Performance, CPU, Facilities, Memory, Storage, Network, OS, Uptime, Timesync | All_Performance `performance` plus one of `cpu`, `facilities`, `memory`, `storage`, `network`, or (`os` with (`uptime` OR (`time`,`synchronize`))) | Performance tracking metrics for hosts, storage and facilities | Unix and Linux add-on, perfmon, SNMP polling |
| Splunk Audit Logs | Modular_Actions, Modular Action Invocations, View_Activity, Datamodel_Acceleration, Search_Activity, Scheduler_Activity, Web_Service_Errors | Modular_Actions `modaction`; Modular Action Invocations `invocation`; the remaining datasets are search-constrained, not tag-constrained | Audit information for systems that produce event logs, including Splunk's own | `index=_audit`, `index=_internal` |
| Ticket Management | All_Ticket_Management, Change, Incident, Problem | All_Ticket_Management `ticketing`; Change `change`; Incident `incident`; Problem `problem` | Service requests and their state in ITIL-influenced desks, bug trackers, ticket systems and GRC platforms | ServiceNow, Jira, Remedy, Archer |
| Updates | Updates, Update_Errors | Updates `update`,`status`; Update_Errors `update`,`error` | Patch management events from individual systems or central management tools | WSUS, SCCM, yum and apt history, Jamf |
| Vulnerabilities | Vulnerabilities | `report`,`vulnerability` | Vulnerability detection results | Nessus, Qualys, Rapid7, image scanners |
| Web | Web, Proxy, Storage | Web `web`; Proxy `proxy`; Storage `storage` | Web server and proxy server data in a security or operational context, plus cloud object storage access | Apache, nginx, IIS, Blue Coat, Zscaler, S3 access logs |

Deprecated does not mean deleted: Application State and Change Analysis still ship, still appear in `| datamodel`, and still return data if something is tagged for them. CIM Validation (S.o.S.) ships with the add-on but is not an entry in the Data models section, so it is not one of the twenty-six.

## 2. Field classification semantics

The CIM reference tables sort every field into required, recommended or optional. The three words mean different things to compliance testing, to Enterprise Security content, and to whether your event shows up at all.

| Class | What the docs mark | What it means in practice | Consequence of leaving it empty |
| --- | --- | --- | --- |
| Required | The 8.6 tables carry the phrase "required for pytest-splunk-addon" | The minimum field set a dataset cannot be meaningfully used without. This is the set an add-on must populate to pass Splunk's own add-on test suite | The event is still in the dataset (tags decide that) but the column is null. Any downstream search, correlation rule or Pivot that filters or splits on that field drops the event silently |
| Recommended | Flagged `recommended=true` in the model JSON under `comment.recommended` | Fields that are "both commonly available in data sources of the intended type, and highly useful for security monitoring and investigations". This is the prioritization list for mapping work | The dataset still works. ES content that pivots on the field loses your source. Map these second |
| Optional | Everything else in the table | Value-add where the source happens to carry it | No compliance impact |

A field can carry both marks: `action`, `app` and `user` in Authentication are flagged required and are also flagged recommended in the model JSON. The tables below place each field in one bucket only, taking the highest mark.

Required here is a documentation classification in the CIM reference tables, not the Required flag in the Data Model Editor described in `topics/09-data-models-and-pivot.md`. That flag really does filter events out of a dataset. The CIM tables' required column is a mapping target for add-on authors and for Splunk's own add-on test suite, and membership of a CIM dataset is decided by tags. Same word, two mechanisms, and the exam can ask about either.

Required does not mean enforced. Nothing in Splunk rejects an event with a missing required field or an out-of-spec value, because expected values are "not exhaustive or exclusive". The failure mode is always silence, and that silent removal is the exam's favourite consequence. Say Authentication events arrive tagged correctly with no `user`: `| datamodel Authentication Authentication search | stats count` returns a healthy number, while `| tstats count FROM datamodel=Authentication.Authentication BY Authentication.user` returns nulls. The event was admitted and then dropped by every consumer that needed the field, which is why validation searches count by field rather than counting rows.

Fields ending `_bunit`, `_category` or `_priority`, plus `cim_entity_zone` and `tag`, are auto-provided by Enterprise Security's asset and identity framework. The docs tell you not to extract them yourself.

## 3. The six models in detail

Each block gives the dataset tags, the field list split three ways, and a mock of a compliant event. Auto-provided fields are omitted throughout: every model here carries `tag`, `cim_entity` or `cim_entity_zone`, and the `_bunit`, `_category` and `_priority` variants of whichever of `dest`, `src`, `dvc`, `user` and `src_user` it defines. In the mocks, the `eval tag=` line documents the constraint so the whole contract reads in one block; real membership comes from `tags.conf` on an event type, never from `eval`.

### 3.1 Authentication

| Dataset | Tags |
| --- | --- |
| Authentication | `authentication` |
| Default_Authentication | `authentication`,`default` |
| Insecure_Authentication | `authentication` plus (`cleartext` OR `insecure`) |
| Privileged_Authentication | `authentication`,`privileged` |
| Failed_Authentication | Search-constrained on the result, not tag-constrained |
| Successful_Authentication | Search-constrained on the result, not tag-constrained |

| Class | Fields |
| --- | --- |
| Required | `action`, `app`, `user` |
| Recommended | `dest`, `src`, `src_user` |
| Optional | `authentication_method`, `authentication_service`, `dest_nt_domain`, `duration`, `process`, `reason_id`, `response_time`, `result`, `signature`, `signature_id`, `src_nt_domain`, `src_user_id`, `src_user_role`, `src_user_type`, `user_agent`, `user_id`, `user_role`, `user_type`, `vendor_account` |

Expected values: `action` is `success`, `failure`, `pending` or `error`. `app` examples are `ssh`, `splunk`, `win:local`, `signin.amazonaws.com`. `authentication_service` examples are `Okta`, `ActiveDirectory`, `AzureAD`. `user_type` examples are `IAMUser`, `Admin`, `System`.

The distinction that gets tested: `user` is the account being authenticated, `src_user` is the account requesting the authentication on someone else's behalf. A `sudo` or `runas` event populates both, and Privileged_Authentication is the dataset that cares.

```spl
| makeresults
| eval action="failure", app="ssh", user="jdoe", src="10.3.7.44", dest="app01.example.com", src_user="-", signature="Failed password", vendor_product="OpenSSH", tag="authentication"
```

### 3.2 Network Traffic

| Dataset | Tags |
| --- | --- |
| All_Traffic | `network`,`communicate` |

| Class | Fields |
| --- | --- |
| Required | `action`, `app`, `dest`, `dest_zone`, `dvc`, `src`, `src_translated_ip`, `src_zone`, `transport` |
| Recommended | `bytes`, `bytes_in`, `bytes_out`, `dest_port`, `rule`, `src_port`, `user`, `vendor_product` |
| Optional | `channel`, `dest_interface`, `dest_ip`, `dest_mac`, `dest_translated_ip`, `dest_translated_port`, `direction`, `duration`, `dvc_ip`, `dvc_mac`, `dvc_zone`, `flow_id`, `icmp_code`, `icmp_type`, `packets`, `packets_in`, `packets_out`, `process_guid`, `process_id`, `protocol`, `protocol_version`, `response_time`, `rule_id`, `session_id`, `src_interface`, `src_ip`, `src_mac`, `src_translated_port`, `ssid`, `tcp_flag`, `tos`, `ttl`, `vendor_account`, `vlan`, `wifi` |

Expected values: `action` is `allowed`, `blocked` or `teardown`. `transport` is `icmp`, `tcp` or `udp`, lowercase. `direction` is `inbound` or `outbound`. `protocol` is lowercase, for example `ip`, `appletalk`, `ipx`. MAC addresses are lowercase and colon-separated. `icmp_type` runs `0` to `254`. `wifi` takes `802.11a`, `802.11b`, `802.11g`, `802.11n`.

Two required fields catch people out. `src_translated_ip` is required even when there is no NAT, and `dest_zone` and `src_zone` are required even in a flat network. Firewall add-ons usually fill them; a hand-rolled mapping usually does not.

```spl
| makeresults
| eval action="allowed", app="https", transport="tcp", src="10.3.7.44", src_port=51422, src_zone="trust", src_translated_ip="203.0.113.9", dest="93.184.216.34", dest_port=443, dest_zone="untrust", dvc="fw01.example.com", bytes_in=1420, bytes_out=8830, bytes=10250, vendor_product="Palo Alto PA-3220", tag="network communicate"
```

### 3.3 Web

| Dataset | Tags |
| --- | --- |
| Web | `web` |
| Proxy | `web`,`proxy` |
| Storage | `web`,`storage` |

| Class | Fields |
| --- | --- |
| Required | `action`, `bytes`, `bytes_in`, `bytes_out`, `category`, `dest`, `dest_port`, `http_user_agent`, `http_user_agent_length`, `src`, `status`, `url` |
| Recommended | `http_content_type`, `http_method`, `http_referrer`, `http_referrer_domain`, `url_domain`, `user`, `vendor_product` |
| Optional | `app`, `cached`, `cookie`, `dest_ip`, `duration`, `response_time`, `site`, `src_ip`, `storage_name`, `uri_path`, `uri_query`, `url_length` |
| Storage dataset only | `error_code`, `operation`, `storage_dataset`, `storage_name` |

Expected values: `http_method` is `GET`, `PUT`, `POST`, `DELETE`, `HEAD`, `OPTIONS`, `CONNECT` or `TRACE`. `status` is an HTTP status code in the 100 to 511 range, and it is a string in CIM, not a number. `cached` is boolean, accepting `true`, `false`, `1` or `0`. Storage examples: `error_code` such as `NoSuchBucket`, `operation` such as `REST.PUT.OBJECT`.

The Proxy dataset defines no fields of its own; it inherits the whole Web field set and adds only the `proxy` tag requirement. A proxy log therefore needs both `web` and `proxy`, never `proxy` alone.

```spl
| makeresults
| eval action="allowed", src="10.3.7.44", dest="www.example.com", dest_port=443, http_method="GET", http_user_agent="Mozilla/5.0", http_user_agent_length=11, status="200", url="https://www.example.com/cart", url_domain="www.example.com", category="Shopping", bytes_in=380, bytes_out=42109, bytes=42489, vendor_product="Apache httpd", tag="web"
```

### 3.4 Change

| Dataset | Tags |
| --- | --- |
| All_Changes | `change` |
| Auditing_Changes | `change`,`audit` |
| Endpoint_Changes | `change`,`endpoint` |
| Network_Changes | `change`,`network` |
| Account_Management | `change`,`account` |
| Instance_Changes | `change`,`instance` |

| Class | Fields |
| --- | --- |
| Required (All_Changes) | `action`, `change_type`, `command`, `dest`, `dvc`, `image_id`, `object`, `object_attrs`, `object_category`, `object_id`, `object_path`, `status`, `user`, `vendor_product` |
| Recommended (All_Changes) | `result`, `src`, `user_name` |
| Optional (All_Changes) | `result_id`, `user_agent`, `user_type`, `vendor_account`, `vendor_region` |
| Account_Management adds | Recommended: `dest_nt_domain`, `src_nt_domain`, `src_user`, `src_user_name`. Optional: `src_user_type` |
| Network_Changes adds | Optional: `dest_ip_range`, `dest_port_range`, `direction`, `rule_action`, `src_ip_range`, `src_port_range`, `device_restarts` |
| Auditing_Changes, Endpoint_Changes, Instance_Changes | No dataset-specific fields; they narrow All_Changes by tag only |

Expected values: `action` is `acl_modified`, `cleared`, `created`, `deleted`, `modified`, `stopped`, `lockout`, `read`, `logoff`, `updated`, `started`, `restarted` or `unlocked`. `status` is `success` or `failure`. IP ranges use CIDR notation, for example `203.0.113.5/32`. Port ranges accept a single port, a hyphenated range such as `8000-8080`, or a comma list such as `80,443`.

Change is the only one of these six models where `action` and `status` are both required and mean different things: `action` is what was attempted, `status` is whether it worked. Authentication folds both into `action`.

```spl
| makeresults
| eval action="modified", change_type="AWS Security Group", command="AuthorizeSecurityGroupIngress", object="sg-0a1b2c3d", object_category="security_group", object_id="sg-0a1b2c3d", object_attrs="ingress", object_path="/ec2/sg-0a1b2c3d", status="success", user="arn:aws:iam::111122223333:user/jdoe", user_name="jdoe", dest="ec2.eu-west-1.amazonaws.com", dvc="cloudtrail", image_id="ami-0abc", vendor_product="AWS CloudTrail", src="203.0.113.9", tag="change network"
```

### 3.5 Malware

| Dataset | Tags |
| --- | --- |
| Malware_Attacks | `malware`,`attack` |
| Malware_Operations | `malware`,`operations` |

| Class | Fields (Malware_Attacks) |
| --- | --- |
| Required | `action`, `category`, `dest`, `file_name`, `file_path`, `signature` |
| Recommended | `date`, `severity`, `user`, `vendor_product` |
| Optional | `dest_ip`, `dest_requires_av`, `file_hash`, `severity_id`, `signature_id`, `src`, `src_ip`, `src_user`, `url` |

| Class | Fields (Malware_Operations) |
| --- | --- |
| Required | `dest`, `signature_version`, `vendor_product` |
| Recommended | `dest_nt_domain`, `product_version` |
| Optional | `dest_requires_av` |

Expected values: `action` is `allowed`, `blocked` or `deferred`. `severity` is `critical`, `high`, `medium`, `low` or `informational`. `category` carries the vendor's classification, for example `keylogger` or `ad-supported program`. `signature` is the detection name, for example `Trojan.Vundo`, `Spyware.Gaobot`, `W32.Nimbda`.

The two datasets answer different questions and share almost no required fields. Malware_Attacks is "what did the product catch". Malware_Operations is "is the product healthy and current", which is why its required set is `dest`, `signature_version` and `vendor_product` and it has no `action` at all. In Malware_Attacks, `src` is the DAT relay or the sender, not the attacker's host.

```spl
| makeresults
| eval action="blocked", category="keylogger", dest="ws-4417.example.com", file_name="invoice.scr", file_path="C:\\Users\\jdoe\\Downloads\\invoice.scr", signature="Trojan.Vundo", severity="high", user="jdoe", vendor_product="Symantec Endpoint Protection", tag="malware attack"
```

### 3.6 Intrusion Detection

| Dataset | Tags |
| --- | --- |
| IDS_Attacks | `ids`,`attack` |

| Class | Fields |
| --- | --- |
| Required | `action`, `category`, `dvc`, `ids_type`, `severity`, `signature`, `transport` |
| Recommended | `dest`, `dest_port`, `file_hash`, `file_name`, `file_path`, `severity_id`, `signature_id`, `src`, `src_port`, `user`, `vendor_product` |
| Optional | Everything else the 8.6 Intrusion Detection table lists, none of which the exam draws from |

Expected values: `action` is `allowed` or `blocked`, with no `deferred` and no `teardown`. `ids_type` is `network`, `host`, `application` or `wireless`. `severity` is `critical`, `high`, `medium`, `low` or `informational`. `transport` is `icmp`, `tcp` or `udp`.

Note what is required here and nowhere else: `ids_type` and `severity`. Note also what is not required: `dest` and `src` are only recommended, because a host IDS event may have no network endpoints at all. `dvc` is required because the model is about which sensor made the detection.

```spl
| makeresults
| eval action="blocked", category="spyware", dvc="ids01.example.com", ids_type="network", severity="high", signature="ET TROJAN Observed DNS Query to .top domain", transport="tcp", src="10.3.7.44", src_port=51422, dest="198.51.100.7", dest_port=80, user="jdoe", vendor_product="Suricata", tag="ids attack"
```

## 4. Knowledge objects the add-on ships (objective 10.2)

Objective 10.2 asks you to list them. The list is closed and short, and the exam builds distractors by adding index-time objects to it.

| Knowledge object | What ships |
| --- | --- |
| Data models | The CIM model definitions as JSON in `$SPLUNK_HOME/etc/apps/Splunk_SA_CIM/default/data/models` |
| Tags | The tag definitions used as dataset constraints |
| Event types | Event type definitions, including those backing the validation content |
| Field aliases | Aliases used by the add-on's own content |
| Calculated fields | EVAL expressions backing model-level calculations |
| Lookups | Lookups backing normalization and the CIM filter macros |
| Search macros | `cim_datamodelinfo` and the CIM filter macros such as `cim_filter_known_scanners`, in `Splunk_SA_CIM` macros. The docs name no per-model index macro; index scoping is the Indexes allowlist on the CIM Setup page, see section 5 |
| Reports and dashboards | Validation content reachable through Pivot on the CIM Validation (S.o.S.) model, and the Data Model Audit dashboard |
| A custom search command | `datamodelsimple`, for CIM validation |
| A common action model | Support for custom alert actions, backed by the `cim_modactions` index |

Not on the list, and therefore always a wrong answer: indexes (other than `cim_modactions`), source types, inputs, index-time transforms, props settings for parsing, and summary indexes. The retired `cim_summary` index has been removed.

## 5. The per-model Indexes allowlist

Every CIM data model constrains itself to a set of indexes, and the control is the **Indexes allowlist** field on the CIM Setup page: pick a model, type a comma-delimited list, save. The docs describe the field and its effect ("Restricts the index attribute of the data model to specified index values to improve performance") but do **not** document where the setting is persisted, and they name no macro as the mechanism.

That last point is worth stating plainly, because older material and several practice tests assert a `cim_<Model_Name>_indexes` macro convention. **No 8.6 documentation page names such a macro.** Treat the Indexes allowlist as the documented interface and do not answer an exam question by asserting a macro name. The macros the add-on documentably ships are `cim_datamodelinfo` and the `cim_filter_*` CIM Filter macros, both in `Splunk_SA_CIM/default/macros.conf`.

Why it matters. The default for every model is all indexes. A CIM data model search is a tag lookup across whatever it is allowed to see, so an unconstrained Network Traffic model asks every index in the deployment whether it holds anything tagged `network` and `communicate`. On a real deployment that multiplies the work by the number of indexes that will never match, and acceleration reruns the same scan on a schedule.

Two consequences the exam can reach. A new index is not picked up automatically, so someone must add it to the allowlist or the model silently misses the data. And index names defined only on indexers are accepted here even though the search head cannot resolve them, so a typo produces no error and no data. The companion macro `cim_datamodelinfo`, run on its own as a generating search, reports acceleration status, which is off by default for every CIM model.

## 6. Validation recipes

Five ways to ask "is my data in this model", in rising order of what they assume.

**Read the contract without touching data.** If `datamodelsimple` is unrecognized, the add-on is not installed on this search head.

```spl
| datamodelsimple type=objects datamodel=Authentication
| datamodelsimple type=attributes datamodel=Authentication nodename=Authentication.Authentication
```

**Return the events the dataset actually contains.** This works whether or not the model is accelerated, because it falls back to raw search. Field names come back fully qualified as `Dataset.field`; swap `search` for `flat` to strip the prefix.

```spl
| datamodel Authentication Authentication search
| search sourcetype=linux_secure
| stats count BY Authentication.action, Authentication.user
```

**Check whether the required fields are populated.** The docs' own pattern, and the one that catches silent removal.

```spl
| datamodel Authentication Successful_Authentication search
| search sourcetype=linux_secure
| table *
| fields - date_* host index punct _raw time* splunk_server sourcetype source eventtype linecount
| fieldsummary
```

A required CIM field sitting at `count=0` is the finding. Row count alone would have looked healthy.

**Query the acceleration summary.**

```spl
| tstats summariesonly=t count FROM datamodel=Network_Traffic.All_Traffic WHERE nodename=Network_Traffic.All_Traffic BY All_Traffic.action, _time span=1h
```

`summariesonly=t` reads only the TSIDX summary. Against a stock CIM model, which is not accelerated, this returns zero rows no matter how good your tagging is. Drop the flag to fall back to raw data, and check acceleration with `cim_datamodelinfo` before blaming the mapping. Model names with spaces use underscores in the `datamodel=` reference: `Network_Traffic`, `Intrusion_Detection`, `Network_Resolution`.

**Treat the dataset as a table.**

```spl
| from datamodel:Malware.Malware_Attacks
| stats count BY action, signature
```

`from` uses a colon between `datamodel` and the model name, then a dot between the model and the dataset. It returns bare field names, not dotted ones, which is the practical reason to reach for it over `datamodel ... search`.

**The validation dashboards.** Settings, then Data models, then CIM Validation (S.o.S.), then Pivot from the Actions column. The model provides top-level datasets plus Missing Extractions searches (events in a model with required fields absent) and Untagged Events searches (events that look like CIM candidates and carry no tag). Do not accelerate this model; the docs warn that accelerating CIM Validation (S.o.S.) might cause issues. Separately, the Data Model Audit dashboard in Search and Reporting reports acceleration health and summary size.

## 7. Cross-model field quick reference

The field names repeat across models, which is exactly why tags exist as constraints. This table is scoped to what the CIM 8.6 pages confirm.

| Field | Models | Constrained values |
| --- | --- | --- |
| `action` | Authentication, Change, Data Access, Data Loss Prevention, Email, Endpoint, Intrusion Detection, Malware, Network Sessions, Network Traffic, Performance, Web | Differs per model, see the table below |
| `app` | Alerts, Authentication, Data Access, Data Loss Prevention, Network Traffic, Splunk Audit Logs, Web | Free text. Authentication examples: `ssh`, `splunk`, `win:local`, `signin.amazonaws.com` |
| `dest` | Alerts, Authentication, Certificates, Change, Data Access, Data Loss Prevention, Databases, Email, Endpoint, Event Signatures, Interprocess Messaging, Intrusion Detection, Inventory, Malware, Network Resolution (DNS), Network Traffic, Performance, Ticket Management, Updates, Vulnerabilities, Web | Free text. Populate from `dest_host`, `dest_ip` or `dest_nt_host`, most specific first |
| `dest_ip` | Inventory, Network Sessions, Network Traffic | IPv4 or IPv6 |
| `dest_port` | Certificates, Endpoint, Intrusion Detection, Network Resolution (DNS), Network Traffic, Web | Numeric only, no protocol name |
| `src` | Required in Network Traffic and Web. Recommended in Authentication, Change, Intrusion Detection. Optional in Malware_Attacks | Free text. Populate from `src_host`, `src_ip` or `src_nt_host` |
| `src_ip` | Optional in Network Traffic and Web | IPv4 or IPv6 |
| `src_port` | Recommended in Network Traffic and Intrusion Detection | Numeric only |
| `user` | Required in Authentication and Change. Recommended in Intrusion Detection, Malware_Attacks, Network Traffic, Web | Free text |
| `src_user` | Recommended in Authentication and in Change Account_Management. Optional in Malware_Attacks | The account requesting on another's behalf, not the account being acted on |
| `status` | Required in Change and in Web | Change: `success`, `failure`. Web: HTTP status code as a string, 100 to 511 |
| `signature` | Required in Intrusion Detection and Malware_Attacks. Optional in Authentication | Vendor detection name, for example `Trojan.Vundo` |
| `vendor_product` | Required in Change and Malware_Operations. Recommended in Intrusion Detection, Malware_Attacks, Network Traffic, Web | Vendor and product together, for example `Symantec AntiVirus` |
| `bytes`, `bytes_in`, `bytes_out` | Network Traffic, Web | Numeric. `bytes` is the total, and CIM expects it to equal `bytes_in` plus `bytes_out` |
| `duration` | Authentication, Certificates, Databases, Email, Interprocess Messaging, Network Resolution (DNS), Network Sessions, Network Traffic, Splunk Audit Logs, Web | Seconds |

The complete cross-model membership rows for `src`, `src_ip`, `src_port`, `user`, `src_user`, `status`, `signature` and `vendor_product` on the "CIM fields per associated data model" page could not be read; the entries above are compiled from the six per-model field tables instead, so treat them as a floor rather than an exhaustive list `[verify]`.

### Allowed values of `action`, by model

The single highest-yield table in this file. Same field name, different vocabulary, and a value that is legal in one model is meaningless in another.

| Model | Allowed values of `action` |
| --- | --- |
| Authentication | `success`, `failure`, `pending`, `error` |
| Network Traffic | `allowed`, `blocked`, `teardown` |
| Intrusion Detection | `allowed`, `blocked` |
| Malware (Malware_Attacks) | `allowed`, `blocked`, `deferred` |
| Change | `acl_modified`, `cleared`, `created`, `deleted`, `modified`, `stopped`, `lockout`, `read`, `logoff`, `updated`, `started`, `restarted`, `unlocked` |
| Web | No prescribed value list in the CIM 8.6 Web table; `action` is required but the values are left to the source |

Prescribed values of `action` for Data Access, Data Loss Prevention, Email, Endpoint, Network Sessions and Performance were not read from the docs in this pass `[verify]`.

## 8. Traps

**T-CIM-01** An event tagged `proxy` is missing from the Web model's Proxy dataset. Wrong belief: the child tag is the whole constraint. Correct fact: Proxy needs `web` and `proxy`, because child datasets inherit the parent constraint. Same shape for Endpoint Filesystem, Malware_Attacks, and Change Network_Changes.

**T-CIM-02** An answer offers `action=denied` or `action=deny` for a Network Traffic firewall event. Correct fact: Network Traffic prescribes `allowed`, `blocked` and `teardown`. Splunk does not reject `denied`, it just never matches ES content. Same trap with `action=failed` instead of `failure` in Authentication.

**T-CIM-03** `action=teardown` or `action=deferred` appears on an Intrusion Detection event. Correct fact: Intrusion Detection allows only `allowed` and `blocked`. `teardown` belongs to Network Traffic and `deferred` to Malware_Attacks.

**T-CIM-04** A distractor claims Malware_Operations requires `action` and `signature`. Correct fact: it requires `dest`, `signature_version` and `vendor_product`, and has no `action` field at all. It describes the health of the protection deployment, not a detection.

**T-CIM-05** A Network Traffic mapping is presented as complete with `src`, `dest`, `transport`, `action` and ports. Correct fact: the required set also contains `app`, `dvc`, `src_zone`, `dest_zone` and `src_translated_ip`, which are required even with no segmentation and no NAT.

**T-CIM-06** A question asks which field records whether a change succeeded and offers `action`. Correct fact: in Change, `action` is what was attempted and `status` carries `success` or `failure`. Only in Authentication does `action` itself carry the outcome.

**T-CIM-07** An answer treats Web `status` as a number and writes `| where Web.status > 400`. Correct fact: CIM types Web `status` as a string. `| search Web.status=4*` or an explicit `tonumber()` is the honest form.

**T-CIM-08** A question claims an event missing a required field is excluded from the data model. Correct fact: tags decide membership, fields do not. The event sits in the dataset with a null column and disappears only from searches that use that field. Nothing warns.

**T-CIM-09** A distractor says required fields are the ones flagged `recommended=true` in the model JSON. Correct fact: two separate marks. `recommended=true` flags recommended fields; required is marked in the 8.6 tables as "required for pytest-splunk-addon". Many fields carry both.

**T-CIM-10** A `tstats` example reads `FROM datamodel=Network Traffic.All_Traffic`. Correct fact: the reference uses the internal name, so spaces become underscores: `Network_Traffic`, `Intrusion_Detection`, `Network_Resolution`. The spaced display name belongs in the UI, not the search.

**T-CIM-11** An answer offers `| from datamodel.Web.Web` or `| from datamodel:Web:Web`. Correct fact: the syntax is `| from datamodel:<model>.<dataset>`, colon after `datamodel`, dot between model and dataset. Quotation marks only when a name contains spaces.

**T-CIM-12** An answer states that setting the Indexes allowlist is required before a CIM model returns data, or that new indexes join it automatically. Correct fact: the default is all indexes, so the allowlist is purely a performance control, and new indexes must be added by hand.

**T-CIM-13** A Windows service state change is offered as either Endpoint or Change. Correct fact: Endpoint's Services dataset (`service`,`report`) records observed service state on a client; Change's Endpoint_Changes (`change`,`endpoint`) records an administrative modification. Observation goes to Endpoint, administration to Change.

**T-CIM-14** A distractor lists CIM Validation (S.o.S.) among the documented models, or names Compute Inventory as current. Correct fact: the Data models section documents twenty-six models, two deprecated. CIM Validation (S.o.S.) is documented on the validation page, and Compute Inventory is the legacy slug for Inventory.

**T-CIM-15** A DHCP lease or VPN connection is offered as Network Traffic. Correct fact: Network Sessions covers DHCP (`network`,`session`,`dhcp`) and VPN (`network`,`session`,`vpn`). A VPN tunnel's payload flows are Network Traffic; the tunnel establishment is Network Sessions.

**T-CIM-16** An answer claims `bytes` is unrelated to `bytes_in` and `bytes_out`. Correct fact: all three are required in Web and recommended in Network Traffic, and CIM expects `bytes` to be the sum. `EVAL-bytes = bytes_in + bytes_out` is the normal way to satisfy it.
