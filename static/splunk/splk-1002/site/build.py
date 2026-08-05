#!/usr/bin/env python3
"""Build the SPLK-1002 study site from the markdown guide.

The markdown is the single source of truth. Nothing here edits it.

    python3 site/build.py --all              build all 43 pages
    python3 site/build.py topics/07-macros.md   build one
    python3 site/build.py --all --check      build and fail on structural problems

Output mirrors the source tree under site/, so the guide's existing markdown
cross-links stay correct under a plain .md to .html swap. theme.css, app.js and
search-index.js are emitted once as siblings and referenced relatively: a classic
<script src> loads fine over file://, unlike fetch or ES modules.
"""
import sys, re, html, json, pathlib, argparse, posixpath
from markdown_it import MarkdownIt

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
from spl_lexer import highlight as spl_highlight  # noqa: E402
from manifest import GROUPS, all_entries         # noqa: E402

ROOT = HERE.parent
WPM = 190                 # technical reading, not skimming
SHORT_PAGE = 1500         # below this, per-section times are noise

GLASS = ('<svg class="spl-glass" viewBox="0 0 16 16" fill="none" stroke="currentColor" '
         'stroke-width="1.6" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/>'
         '<path d="M10.5 10.5 14 14"/></svg>')


ICON_BOOK = ('<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" '
             'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
             '<path d="M2 3.5A1.5 1.5 0 0 1 3.5 2H7v12H3.5A1.5 1.5 0 0 1 2 12.5z"/>'
             '<path d="M14 3.5A1.5 1.5 0 0 0 12.5 2H9v12h3.5a1.5 1.5 0 0 0 1.5-1.5z"/></svg>')
ICON_TARGET = ('<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" '
               'aria-hidden="true"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="2.5"/></svg>')
ICON_SEARCH = ('<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" '
               'stroke-linecap="round" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/>'
               '<path d="M10.5 10.5 14 14"/></svg>')
ICON_THEME = ('<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" '
              'stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="3.2"/>'
              '<path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1'
              'M12.9 12.9l-1.1-1.1M4.2 4.2 3.1 3.1"/></svg>')

# --------------------------------------------------------------------------- fences

def render_fence(self, tokens, idx, options, env):
    tok = tokens[idx]
    info = (tok.info or "").strip().lower()
    code = tok.content.rstrip("\n")

    if info == "mermaid":
        # One element. Mermaid swaps its text for an SVG; if the CDN is unreachable the
        # same element stays as readable monospace source. min-height reserves the space
        # so the document does not grow under the reader after the CDN resolves.
        env["has_mermaid"] = True
        lines = code.count("\n") + 1
        return (f'<div class="mermaid-wrap" style="min-height:{min(120 + lines * 22, 460)}px">'
                f'<div class="mermaid">{html.escape(code)}</div></div>\n')

    if info == "spl":
        env["spl"] = env.get("spl", 0) + 1
        n = env["spl"]
        env.setdefault("spl_src", []).append(code)
        return (
            f'<div class="spl">'
            f'<div class="spl-chrome">{GLASS}'
            f'<span class="spl-label">Search</span><span class="spl-spacer"></span>'
            f'<button class="spl-copy" type="button" data-copy="spl-{n}">Copy</button></div>'
            f'<pre id="spl-{n}"><code>{spl_highlight(code)}</code></pre>'
            f'</div>\n')

    cls = f' class="plain lang-{info}"' if info else ' class="plain"'
    return f'<pre{cls}><code>{html.escape(code)}</code></pre>\n'


# ---------------------------------------------------------------------------- utils

def slugify(text):
    s = re.sub(r"<[^>]+>", "", text)
    s = re.sub(r"[^\w\s.-]", "", s).strip().lower()
    return re.sub(r"[\s_]+", "-", s) or "section"


def section_minutes(raw):
    """Minutes per h2, and a total that is exactly their sum.

    Words before the first h2 belong to no section, so they fold into the first one
    rather than vanishing. Summing the rounded figures keeps the rail total equal to the
    numbers printed above it. On a short page the per-section figures are suppressed and
    the total is computed honestly instead, because a one-minute floor across ten
    headings turns a three-minute cram sheet into six.
    """
    total_words = len(raw.split())
    order, by, cur, words, preamble = [], {}, None, 0, 0
    for line in raw.split("\n"):
        if line.startswith("## "):
            if cur is None:
                preamble = words
            else:
                by[cur] = words
            cur = line[3:].strip()
            order.append(cur)
            words = 0
        else:
            words += len(line.split())
    if cur is not None:
        by[cur] = words

    if total_words < SHORT_PAGE or not order:
        return {}, max(1, round(total_words / WPM))

    by[order[0]] += preamble
    mins = {k: max(1, round(v / WPM)) for k, v in by.items()}
    return mins, sum(mins.values())


def rel(from_out, to_out):
    """Relative href between two output paths, both site-relative POSIX strings."""
    return posixpath.relpath(to_out, posixpath.dirname(from_out) or ".")


# ------------------------------------------------------------------------ page build

def render_body(raw, entry, by_src, problems):
    md = (MarkdownIt("commonmark", {"html": True, "linkify": False})
          .enable("table").enable("strikethrough"))
    md.add_render_rule("fence", render_fence)
    env = {}
    body = md.render(raw, env)

    # --- heading ids, one dedup namespace across h1-h6 ---
    toc, used = [], set()

    def add_id(m):
        level, attrs, inner = m.group(1), m.group(2), m.group(3)
        sid = base = slugify(inner)
        i = 2
        while sid in used:
            sid = f"{base}-{i}"; i += 1
        used.add(sid)
        text = re.sub(r"<[^>]+>", "", inner).strip()
        if level in ("2", "3"):
            toc.append({"id": sid, "level": level, "text": text})
        # anchor last, so heading.textContent is not "#Traps"
        anchor = (f'<a class="anchor" href="#{sid}" aria-label="Link to this section">#</a>'
                  if level in ("2", "3") else "")
        return f'<h{level} id="{sid}"{attrs}>{inner}{anchor}</h{level}>'

    body = re.sub(r"<h([1-6])([^>]*)>(.*?)</h\1>", add_id, body, flags=re.S)

    # --- traps get an id so search can land on the trap, not the block ---
    traps = []

    def trap(m):
        tid, rest = m.group(1), m.group(2)
        traps.append(tid)
        rest = re.sub(r"\b(Wrong belief)\b", r'<span class="wrong">\1</span>', rest, count=1)
        rest = re.sub(r"\b(Correct fact)\b", r'<span class="right">\1</span>', rest, count=1)
        return f'<p class="trap" id="{tid}"><span class="tid">{tid}</span>{rest}</p>'

    body = re.sub(r"<p><strong>(T-[A-Z0-9]+-\d+)</strong>(.*?)</p>", trap, body, flags=re.S)

    # --- tables ---
    # Wide tables scroll; narrow prose tables wrap. width:max-content on a 3-column
    # table makes long cells expand instead of wrapping, which pushed the last column
    # off the page. Column count decides which behaviour a table gets.
    def wrap_table(m):
        tbl = m.group(0)
        cols = len(re.findall(r"<th[ >]", tbl.split("</tr>")[0] + "</tr>"))
        return f'<div class="tw{" wide" if cols > 5 else ""}">{tbl}</div>'

    body = re.sub(r"<table>.*?</table>", wrap_table, body, flags=re.S)
    n_results = len(re.findall(r"<!--\s*results\s*-->", body))
    body, bound = re.subn(
        r"<!--\s*results\s*-->\s*<div class=\"tw\">(<table>.*?</table>)</div>",
        lambda m: ('<div class="tw"><div class="results">'
                   '<div class="results-head">Statistics</div>'
                   f'{m.group(1)}</div></div>'),
        body, flags=re.S)
    if n_results != bound:
        problems.append(f"{entry['src']}: {n_results - bound} <!-- results --> marker(s) "
                        f"not followed by a table")

    # --- links: markdown to html, external opens in a new tab ---
    def fix_link(m):
        href = m.group(1)
        if href.startswith(("http://", "https://")):
            return f'<a href="{href}" target="_blank" rel="noopener">'
        if ".md" in href:
            path, _, frag = href.partition("#")
            if path.endswith(".md"):
                target = posixpath.normpath(
                    posixpath.join(posixpath.dirname(entry["src"]), path))
                if target in by_src:
                    new = rel(entry["out"], by_src[target]["out"])
                else:
                    new = path[:-3] + ".html"
                href = new + (("#" + frag) if frag else "")
        elif not href.startswith(("#", "/", "mailto:")):
            target = posixpath.normpath(
                posixpath.join(posixpath.dirname(entry["src"]), href.partition("#")[0]))
            if target.startswith("site/"):
                # already inside the output tree, so it is a plain site-relative link
                href = rel(entry["out"], target[len("site/"):])
            elif (ROOT / target).exists():
                # a repository asset such as the practice data, which lives above site/
                up = "../" * (entry["out"].count("/") + 1)
                href = up + href
        return f'<a href="{href}">'

    body = re.sub(r'<a href="([^"]+)">', fix_link, body)

    # A .md suffix is an implementation detail of how this guide is stored. Strip it
    # from everything the reader sees, while leaving every href untouched: the built
    # pages are .html and the markdown-source links must keep pointing at real files.
    # Only text nodes are touched, and only where .md ends a filename-like token, so
    # prose such as "every .md file" is left alone.
    body = re.sub(r">([^<]+)<",
                  lambda m: ">" + re.sub(r"([\w./-]+)\.md\b", r"\1", m.group(1)) + "<",
                  body)

    return body, toc, traps, env


def build_page(entry, by_src, groups_html, problems):
    src = ROOT / entry["src"]
    raw = src.read_text(encoding="utf-8")
    body, toc, traps, env = render_body(raw, entry, by_src, problems)

    if not toc:
        problems.append(f"{entry['src']}: no h2 headings, empty page outline")

    title_m = re.search(r"<h1[^>]*>(.*?)</h1>", body, re.S)
    title = re.sub(r"<[^>]+>", "", title_m.group(1)).strip() if title_m else entry["label"]
    title = re.sub(r"\s*\(\d+%\)\s*$", "", title)          # weight lives in the rail
    if title_m:
        body = body.replace(title_m.group(0),
                            re.sub(r"\s*\(\d+%\)\s*", "", title_m.group(0)), 1)

    mins, total_min = section_minutes(raw)
    onpage = "\n".join(
        f'<li><a class="lvl{t["level"]}" href="#{t["id"]}">'
        f'<span>{html.escape(t["text"])}</span>'
        + (f'<span class="min">{mins[t["text"]]}m</span>'
           if t["level"] == "2" and t["text"] in mins else "")
        + "</a></li>"
        for t in toc)

    # Study / Cram control
    pair = entry.get("pair")
    seg = ""
    if pair and pair in by_src:
        study = entry if not entry["is_cram"] else by_src[pair]
        cram = by_src[pair] if not entry["is_cram"] else entry
        seg = ('<div class="seg" role="group" aria-label="Page format">'
               f'<a class="{"on" if not entry["is_cram"] else ""}" '
               f'href="{rel(entry["out"], study["out"])}">Study</a>'
               f'<a class="{"on" if entry["is_cram"] else ""}" '
               f'href="{rel(entry["out"], cram["out"])}">Cram</a></div>')

    # prev / next within the group
    peers = [e for e in by_src.values()
             if e["group"] == entry["group"] and e["is_cram"] == entry["is_cram"]]
    peers.sort(key=lambda e: e["order"])
    i = peers.index(entry)

    def sib(j, rel_):
        if not (0 <= j < len(peers)):
            return ""
        e = peers[j]
        secn = f'<span class="pn-sec">{e["section"]}</span>' if e["section"] else ""
        return (f'<a href="{rel(entry["out"], e["out"])}" rel="{rel_}">'
                f'<span class="pn-rel">{"Previous" if rel_ == "prev" else "Next"}</span>'
                f'{secn}<span class="pn-label">{html.escape(e["label"])}</span></a>')

    prevnext = f'<nav class="pn" aria-label="Section">{sib(i-1,"prev")}{sib(i+1,"next")}</nav>'

    prefix = "../" * entry["out"].count("/")
    crumb_group = dict((g, t) for g, t, _ in GROUPS)[entry["group"]]

    grp = (entry["section"] or "").split(".")[0] if entry.get("section") else ""
    stem = entry["src"][:-3]

    out = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)} | SPLK-1002</title>
<meta name="description" content="{html.escape(entry['label'])}, SPLK-1002 Splunk Core Certified Power User study guide.">
<script>(function(){{try{{var t=localStorage.getItem("splk1002.theme");
if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"ink":"paper";
document.documentElement.setAttribute("data-theme",t);}}catch(e){{}}}})();</script>
<link rel="stylesheet" href="{prefix}tokens.css">
<link rel="stylesheet" href="{prefix}fonts.css">
<link rel="stylesheet" href="{prefix}theme.css">
</head>
<body data-page="{stem}" data-section="{grp}">
<a class="skip" href="#doc">Skip to content</a>

<header class="topbar">
  <a class="brand" href="{prefix}index.html">
    <span class="brand-code">SPLK-1002</span>
    <span class="brand-name">Splunk Core Certified Power User</span>
  </a>
  <nav class="modes" aria-label="Section of the site">
    <a href="{prefix}index.html" aria-current="true">{ICON_BOOK}Guide</a>
    <a href="{prefix}exam/index.html">{ICON_TARGET}Simulator</a>
  </nav>
  <span class="topbar-spacer"></span>
  <div class="topbar-actions">
    <button class="searchbtn" type="button" id="searchbtn" aria-label="Search all pages">
      {ICON_SEARCH}<span>Search</span><kbd>/</kbd>
    </button>
    <button class="iconbtn" type="button" id="theme">{ICON_THEME}</button>
  </div>
  <div class="readbar" id="readbar"></div>
</header>

<div class="spineband"><div class="spine" id="spine"></div></div>

<div class="shell">
  <aside class="rail" aria-label="Guide contents">
    <nav aria-label="Pages">
{groups_html(entry)}
    </nav>
    <div class="railfoot">
      <a href="{prefix}../{entry["src"]}">Markdown source</a>
      <a href="{prefix}../lab-data/splk-1002-practice-data.zip">Practice data</a>
    </div>
  </aside>

  <main>
    <article class="doc" id="doc" tabindex="-1">
      <div class="crumbs">
        <a href="{prefix}index.html">SPLK-1002</a><span class="sep">/</span>
        <span>{html.escape(crumb_group)}</span><span class="sep">/</span>
        <span>{html.escape(entry['label'])}</span>
        {seg}
      </div>
{body}
{prevnext}
      <p class="doc-foot">Built from <code>{entry['src']}</code>. The markdown is the source
      of truth; rebuild with <code>python3 site/build.py --all</code>.</p>
    </article>
  </main>

  <aside class="aside" aria-label="On this page">
    <p class="aside-title">On this page</p>
    <ul class="toc">
{onpage}
    </ul>
    <div class="aside-meta">
      {f'<span class="weight">{entry["weight"]}% of the exam</span>' if entry.get("weight") else ''}
      <span>{total_min} min read</span>
    </div>
  </aside>
</div>

<div class="searchwrap" id="searchwrap" hidden>
  <div class="searchbox" role="dialog" aria-modal="true" aria-label="Search all pages">
    <input type="search" id="q" placeholder="Search headings, traps and SPL commands" autocomplete="off" spellcheck="false">
    <div class="results-list" id="results" role="listbox"></div>
  </div>
</div>

<script src="{prefix}progress.js"></script>
<script src="{prefix}search-index.js"></script>
<script src="{prefix}app.js"></script>
{"<script src=\"" + prefix + "mermaid-init.js\"></script>" if env.get("has_mermaid") else ''}
</body>
</html>
"""
    dest = HERE / entry["out"]
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(out, encoding="utf-8")
    return dict(toc=len(toc), spl=env.get("spl", 0), traps=traps,
                mermaid=env.get("has_mermaid", False), ids=used if False else None,
                spl_src=env.get("spl_src", []))


# ------------------------------------------------------------------------ side files

def build_search_index(entries, by_src):
    """Headings, traps and SPL command tokens across every page.

    Emitted once as search-index.js and shared by all 43 pages, so widening it does not
    mean rebuilding anything.
    """
    idx = []
    for e in entries:
        if e.get("static"):        # hand-written page, no markdown to index
            continue
        raw = (ROOT / e["src"]).read_text(encoding="utf-8")
        used = set()
        cmds = set()
        in_spl = False
        for line in raw.split("\n"):
            if line.startswith("```"):
                in_spl = line.strip().lower().startswith("```spl")
                continue
            if in_spl:
                for tok in re.findall(r"\|\s*([a-z]+)", line):
                    cmds.add(tok)
                continue
            m = re.match(r"^(#{2,3})\s+(.*)", line)
            if m:
                text = m.group(2).strip()
                sid = base = slugify(text)
                i = 2
                while sid in used:
                    sid = f"{base}-{i}"; i += 1
                used.add(sid)
                idx.append({"t": text, "s": e["label"], "u": f"{e['out']}#{sid}", "k": "s"})
                continue
            m = re.match(r"^\*\*(T-[A-Z0-9]+-\d+)\*\*\s+(.*)", line)
            if m:
                d = re.sub(r"[`*]", "", m.group(2))
                if len(d) > 200:
                    d = d[:200].rsplit(" ", 1)[0] + "..."
                idx.append({"t": m.group(1), "s": e["label"],
                            "u": f"{e['out']}#{m.group(1)}", "k": "t", "d": d})
        for c in sorted(cmds):
            idx.append({"t": c, "s": e["label"], "u": e["out"], "k": "c",
                        "d": f"SPL command used in {e['label']}"})
    return idx


def rail_html_factory(entries, by_src):
    order = {g: i for i, (g, _, _) in enumerate(GROUPS)}
    rows = {g: [] for g, _, _ in GROUPS}
    for e in entries:
        if e["is_cram"]:
            continue
        rows[e["group"]].append(e)
    for g in rows:
        rows[g].sort(key=lambda e: e["order"])

    def render(current):
        out = []
        for g, gtitle, gopen in GROUPS:
            is_here = current["group"] == g
            out.append(f'<details class="railgroup"{" open" if gopen or is_here else ""}>')
            out.append(f'<summary>{html.escape(gtitle)}</summary>')
            for e in rows[g]:
                here = e["src"] == current["src"] or e["src"] == current.get("pair")
                sec = f'<span class="n">{e["section"]}</span>' if e["section"] else ""
                wt = f'<span class="w">{e["weight"]}%</span>' if e["weight"] else ""
                out.append(
                    f'<a class="navitem" href="{rel(current["out"], e["out"])}"'
                    f'{" aria-current=\"page\"" if here else ""}>'
                    f'{sec}<span class="t">{html.escape(e["label"])}</span>{wt}</a>')
            out.append("</details>")
        return "\n".join(out)

    return render


# ----------------------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="*")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    entries = all_entries()
    for i, e in enumerate(entries):
        e["order"] = i
    by_src = {e["src"]: e for e in entries}

    missing = [e["src"] for e in entries
               if not e.get("static") and not (ROOT / e["src"]).exists()]
    if missing:
        sys.exit("manifest lists files that do not exist:\n  " + "\n  ".join(missing))

    buildable = [e for e in entries if not e.get("static")]
    targets = buildable if args.all else [
        by_src[str(pathlib.Path(f).as_posix()).replace(str(ROOT) + "/", "")]
        for f in args.files]
    if not targets:
        sys.exit("nothing to build: pass --all or one or more markdown paths")

    rail = rail_html_factory(entries, by_src)
    problems, stats = [], []
    for e in targets:
        stats.append((e, build_page(e, by_src, rail, problems)))

    # side files, written once
    (HERE / "search-index.js").write_text(
        "window.SEARCH_INDEX=" + json.dumps(build_search_index(entries, by_src),
                                            separators=(",", ":")) + ";\n",
        encoding="utf-8")

    # duplicate trap ids across the corpus would break search deep links
    seen = {}
    for e, s in stats:
        for t in s["traps"]:
            seen.setdefault(t, []).append(e["src"])
    dupes = {t: v for t, v in seen.items() if len(v) > 1}
    if dupes and args.all:
        problems.append(f"{len(dupes)} trap id(s) defined on more than one page: "
                        + ", ".join(list(dupes)[:5]))

    for e, s in stats:
        print(f"{e['out']:52} {s['toc']:3} nav  {s['spl']:3} spl  "
              f"{len(s['traps']):3} traps{'  mermaid' if s['mermaid'] else ''}")
    print(f"\n{len(stats)} page(s), search index "
          f"{(HERE / 'search-index.js').stat().st_size // 1024} KB")

    if problems:
        print("\nproblems:")
        for p in problems:
            print("  -", p)
        if args.check:
            sys.exit(1)


if __name__ == "__main__":
    main()
