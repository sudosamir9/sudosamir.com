"""Tokenizer for Splunk SPL, used to syntax-highlight ```spl fences at build time.

Hand-rolled rather than borrowed so the token classes match the exam vocabulary:
commands, aggregation functions, option names, clause keywords, the pipe itself.
Output is HTML with span classes; no JavaScript runs at read time.
"""
import re, html

# Commands that can follow a pipe. Anything on this list renders as a command.
COMMANDS = {
    "abstract","accum","addcoltotals","addinfo","addtotals","analyzefields","anomalies",
    "anomalousvalue","anomalydetection","append","appendcols","appendpipe","arules","associate",
    "audit","autoregress","bin","bucket","chart","cluster","cofilter","collect","concurrency",
    "contingency","convert","correlate","datamodel","datamodelsimple","dbinspect","dedup","delete",
    "delta","diff","erex","eval","eventcount","eventstats","extract","fieldformat","fields",
    "fieldsummary","filldown","fillnull","findtypes","folderize","foreach","format","from",
    "gauge","gentimes","geom","geomfilter","geostats","head","highlight","history","iconify",
    "input","inputcsv","inputlookup","iplocation","join","kmeans","kv","kvform","loadjob",
    "localize","localop","lookup","makecontinuous","makemv","makeresults","map","metadata",
    "metasearch","multikv","multisearch","mvcombine","mvexpand","nomv","outlier","outputcsv",
    "outputlookup","outputtext","overlap","pivot","predict","rangemap","rare","regex","relevancy",
    "reltime","rename","replace","rest","return","reverse","rex","rtorder","savedsearch","script",
    "scrub","search","searchtxn","selfjoin","sendemail","set","setfields","sichart","sirare",
    "sistats","sitimechart","sitop","sort","spath","stats","strcat","streamstats","table","tags",
    "tail","timechart","timewrap","top","transaction","transpose","trendline","tscollect","tstats",
    "typeahead","typelearner","typer","union","uniq","untable","where","x11","xmlkv","xmlunescape",
    "xpath","xyseries",
}

# Aggregation, charting and eval functions.
FUNCTIONS = {
    "avg","count","dc","distinct_count","estdc","estdc_error","exactperc","first","last","list",
    "max","mean","median","min","mode","perc","percentile","range","stdev","stdevp","sum","sumsq",
    "upperperc","values","var","varp","earliest","earliest_time","latest","latest_time","rate",
    "rate_avg","rate_sum","per_day","per_hour","per_minute","per_second","sparkline",
    "if","case","coalesce","nullif","null","true","false","validate","match","searchmatch","like",
    "in","cidrmatch","tostring","tonumber","printf","len","lower","upper","ltrim","rtrim","trim",
    "replace","substr","split","spath","round","floor","ceiling","ceil","abs","exact","sigfig",
    "isnull","isnotnull","isnum","isint","isstr","isbool","typeof","now","time","relative_time",
    "strftime","strptime","mvappend","mvcount","mvdedup","mvfilter","mvfind","mvindex","mvjoin",
    "mvmap","mvrange","mvsort","mvzip","urldecode","md5","sha1","sha256","json_object","tojson",
}

# Clause keywords. Uppercase in practice but Splunk accepts either case.
KEYWORDS = {
    "by","over","as","where","output","outputnew","sortby","groupby","from","datamodel","in",
    "and","or","not","xor","like","true","false","null",
}

_TOKEN = re.compile(r"""
    (?P<comment>```[\s\S]*?```)
  | (?P<string>"(?:[^"\\]|\\.)*")
  | (?P<macro>`[^`\n]+`)
  | (?P<time>[+-]?\d+(?:s|m|h|d|w|mon|q|y)\b(?:@[a-z]+\d*)?|@[a-z]+\d*)
  | (?P<number>\b\d+(?:\.\d+)?\b)
  | (?P<pipe>\|)
  | (?P<option>\b[A-Za-z_][A-Za-z0-9_]*(?=\s*=))
  | (?P<func>\b[A-Za-z_][A-Za-z0-9_]*(?=\s*\())
  | (?P<word>\b[A-Za-z_][A-Za-z0-9_.:{}-]*)
  | (?P<op>[=<>!]+|[,()\[\]+\-*/%.])
  | (?P<ws>\s+)
  | (?P<other>.)
""", re.VERBOSE)


def highlight(code: str) -> str:
    """Return SPL as HTML with span classes. Input is raw, output is escaped."""
    out, expect_command = [], True
    for m in _TOKEN.finditer(code):
        kind = m.lastgroup
        text = m.group()
        esc = html.escape(text)

        if kind == "time":
            out.append(f'<span class="t-time">{esc}</span>')
            expect_command = False
            continue
        if kind == "ws":
            out.append(esc)
            continue
        if kind == "comment":
            out.append(f'<span class="t-comment">{esc}</span>')
            continue
        if kind == "string":
            out.append(f'<span class="t-str">{esc}</span>')
        elif kind == "macro":
            out.append(f'<span class="t-macro">{esc}</span>')
        elif kind == "number":
            out.append(f'<span class="t-num">{esc}</span>')
        elif kind == "pipe":
            out.append('<span class="t-pipe">|</span>')
            expect_command = True
            continue
        elif kind == "option":
            out.append(f'<span class="t-opt">{esc}</span>')
        elif kind == "func":
            low = text.lower()
            cls = "t-cmd" if (expect_command and low in COMMANDS) else (
                "t-func" if low in FUNCTIONS else "t-field")
            out.append(f'<span class="{cls}">{esc}</span>')
        elif kind == "word":
            low = text.lower()
            if expect_command and low in COMMANDS:
                out.append(f'<span class="t-cmd">{esc}</span>')
            elif low in KEYWORDS:
                out.append(f'<span class="t-kw">{esc}</span>')
            elif low in FUNCTIONS:
                out.append(f'<span class="t-func">{esc}</span>')
            else:
                out.append(f'<span class="t-field">{esc}</span>')
        elif kind == "op":
            out.append(f'<span class="t-op">{esc}</span>')
            if text == "[":
                # a subsearch starts a fresh pipeline, so the next word is a command
                expect_command = True
                continue
        else:
            out.append(esc)
        expect_command = False
    return "".join(out)
