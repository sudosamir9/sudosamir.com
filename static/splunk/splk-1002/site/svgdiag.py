"""Render the guide's diagrams to inline SVG at build time.

Replaces the Mermaid CDN. Mermaid needed a network request the file:// origin refuses,
so diagrams vanished offline, and its default theme rendered them grey regardless of the
page palette. These are drawn as plain SVG with class names, so theme.css colours them
from the same tokens as everything else and they work with no JavaScript at all.

Covers the subset the guide actually uses: `flowchart TD`/`LR` over a small DAG, and
`pie`. Anything else falls back to readable monospace source rather than failing.
"""
import re, math, html

# Character advance at the label font size. JetBrains Mono is close to 0.6em; the sans
# fallback is narrower, so this slightly over-estimates and leaves the box roomy.
CH = 7.15
FS = 13
LINE = 17
PAD_X, PAD_Y = 14, 11
GAP_X, GAP_Y = 34, 30


def _esc(s):
    return html.escape(s, quote=True)


def _lines(label):
    return [l for l in re.split(r"<br\s*/?>", label)]


def _box(label):
    ls = _lines(label)
    w = max(len(l) for l in ls) * CH + PAD_X * 2
    h = len(ls) * LINE + PAD_Y * 2
    return max(w, 62), max(h, 38), ls


# ------------------------------------------------------------------ parsing

NODE_RE = re.compile(r'([A-Za-z0-9_]+)\s*(\[|\{|\(\(|\()\s*"?(.*?)"?\s*(\]|\}|\)\)|\))')
EDGE_RE = re.compile(
    r'([A-Za-z0-9_]+)\s*(?:\[|\{|\(\(|\()?.*?(?:\]|\}|\)\)|\))?\s*'
    r'(-->|---|-\.->|==>)\s*'
    r'(?:\|\s*"?(.*?)"?\s*\|)?\s*'
    r'([A-Za-z0-9_]+)')
EDGE_LBL_RE = re.compile(
    r'([A-Za-z0-9_]+)\s*--\s*"?(.*?)"?\s*-->\s*([A-Za-z0-9_]+)')


SUBG_RE = re.compile(r'^\s*subgraph\s+([A-Za-z0-9_]+)\s*\[\s*"?(.*?)"?\s*\]')


def parse_panels(src):
    """`subgraph X["Title"] ... end` with no edges between them is a comparison, not a
    graph. Rendered as titled panels side by side, which is what it is trying to say."""
    panels, cur = [], None
    for raw in src.split("\n"):
        line = raw.strip()
        m = SUBG_RE.match(line)
        if m:
            cur = {"title": m.group(2), "body": []}
            panels.append(cur)
            continue
        if line == "end":
            cur = None
            continue
        if cur is not None:
            for m0 in NODE_RE.finditer(line):
                cur["body"].append(m0.group(3))
    return [p for p in panels if p["title"]]


def render_panels(panels, max_w=980):
    cols = len(panels)
    gap = 18
    w = min(max_w, cols * 300)
    pw = (w - gap * (cols - 1)) / cols
    inner = int(pw / CH) - 3
    laid = []
    for p in panels:
        lines = []
        for b in p["body"]:
            for seg in _lines(b):
                while len(seg) > inner:
                    cut = seg.rfind(" ", 0, inner)
                    cut = cut if cut > 10 else inner
                    lines.append(seg[:cut]); seg = seg[cut:].lstrip()
                lines.append(seg)
        laid.append(lines)
    body_h = max(len(l) for l in laid) * LINE + PAD_Y * 2
    head_h = 30
    height = head_h + body_h + 4
    out = [_svg_open(w, height)]
    x = 0
    for p, lines in zip(panels, laid):
        out.append(f'<rect class="dg-panel" x="{x}" y="1" width="{pw:.1f}" height="{head_h + body_h}" rx="6"/>')
        out.append(f'<rect class="dg-panelhead" x="{x}" y="1" width="{pw:.1f}" height="{head_h}" rx="6"/>')
        out.append(f'<rect class="dg-panelhead" x="{x}" y="{head_h - 6}" width="{pw:.1f}" height="6"/>')
        out.append(f'<text class="dg-paneltitle" x="{x + 12}" y="{head_h/2 + 1}" '
                   f'dominant-baseline="middle">{_esc(p["title"])}</text>')
        for i, l in enumerate(lines):
            out.append(f'<text class="dg-text" x="{x + 12}" y="{head_h + PAD_Y + 8 + i*LINE}" '
                       f'dominant-baseline="middle">{_esc(l)}</text>')
        x += pw + gap
    out.append("</svg>")
    return "".join(out)


def parse_flowchart(src):
    direction = "TD"
    m = re.search(r'^\s*flowchart\s+(TD|TB|LR|RL)', src, re.M)
    if m:
        direction = "LR" if m.group(1) in ("LR", "RL") else "TD"

    labels, shapes, edges, order = {}, {}, [], []

    def note(nid, text=None, shape="rect"):
        if nid not in labels:
            labels[nid] = text if text is not None else nid
            shapes[nid] = shape
            order.append(nid)
        elif text is not None:
            labels[nid] = text
            shapes[nid] = shape

    for raw in src.split("\n"):
        line = raw.strip()
        if not line or line.startswith("flowchart") or line.startswith("%%"):
            continue
        for m0 in NODE_RE.finditer(line):
            nid, open_b, text = m0.group(1), m0.group(2), m0.group(3)
            shape = {"[": "rect", "{": "diamond", "(": "round", "((": "circle"}.get(open_b, "rect")
            note(nid, text, shape)
        m = EDGE_LBL_RE.search(line)
        if m:
            a, lbl, b = m.group(1), m.group(2), m.group(3)
            note(a); note(b); edges.append((a, b, lbl))
            continue
        m = EDGE_RE.search(line)
        if m:
            a, _arrow, lbl, b = m.group(1), m.group(2), m.group(3), m.group(4)
            note(a); note(b); edges.append((a, b, lbl or ""))

    return direction, labels, shapes, edges, order


# ------------------------------------------------------------------ layout

def _layers(order, edges):
    succ, indeg = {n: [] for n in order}, {n: 0 for n in order}
    for a, b, _ in edges:
        if b not in succ[a]:
            succ[a].append(b)
            indeg[b] += 1
    layer = {n: 0 for n in order}
    # longest path: relax in topological-ish passes, bounded so a cycle cannot hang
    for _ in range(len(order) + 1):
        changed = False
        for a, b, _ in edges:
            if layer[b] < layer[a] + 1:
                layer[b] = layer[a] + 1
                changed = True
        if not changed:
            break
    return layer, succ, indeg


def _is_chain(order, edges):
    if len(order) < 4 or not edges:
        return False
    out, inn = {}, {}
    for a, b, _ in edges:
        out[a] = out.get(a, 0) + 1
        inn[b] = inn.get(b, 0) + 1
    return all(v == 1 for v in out.values()) and all(v == 1 for v in inn.values())


def _svg_open(w, h):
    return (f'<svg class="dg" viewBox="0 0 {int(w)} {int(h)}" width="{int(w)}" height="{int(h)}" '
            f'role="img" xmlns="http://www.w3.org/2000/svg">'
            '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" '
            'markerHeight="7" orient="auto-start-reverse">'
            '<path class="dg-arrow" d="M0 0 L10 5 L0 10 z"/></marker></defs>')


def _node_svg(x, y, w, h, ls, shape):
    out = []
    if shape == "diamond":
        cx, cy = x + w / 2, y + h / 2
        out.append(f'<path class="dg-node dg-diamond" d="M{cx} {y} L{x+w} {cy} L{cx} {y+h} L{x} {cy} z"/>')
    else:
        r = h / 2 if shape in ("round", "circle") else 5
        out.append(f'<rect class="dg-node" x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}"/>')
    ty = y + h / 2 - (len(ls) - 1) * LINE / 2 + 1
    for i, l in enumerate(ls):
        out.append(f'<text class="dg-text" x="{x + w/2}" y="{ty + i*LINE}" '
                   f'text-anchor="middle" dominant-baseline="middle">{_esc(l)}</text>')
    return "".join(out)


def render_chain(labels, shapes, edges, order, max_w=980):
    """A single path, wrapped into rows so a nine-step sequence stays readable instead of
    running off the page and needing a zoom."""
    seq = []
    nxt = {a: b for a, b, _ in edges}
    starts = [n for n in order if n not in {b for _, b, _ in edges}]
    cur = starts[0] if starts else order[0]
    seen = set()
    while cur and cur not in seen:
        seen.add(cur); seq.append(cur); cur = nxt.get(cur)
    if len(seq) != len(order):
        return None                     # branching hides behind a chain-looking degree count

    boxes = [_box(labels[n]) for n in seq]
    h = max(b[1] for b in boxes)
    rows, row, rw = [], [], 0
    for n, (w, _bh, ls) in zip(seq, boxes):
        step = w + GAP_X
        if row and rw + step > max_w:
            rows.append(row); row, rw = [], 0
        row.append((n, w, ls)); rw += step
    if row:
        rows.append(row)

    width = max(sum(w + GAP_X for _n, w, _l in r) - GAP_X for r in rows) + 4
    height = len(rows) * (h + GAP_Y) - GAP_Y + 4
    out = [_svg_open(width, height)]
    pos = {}
    for ri, r in enumerate(rows):
        x = 2
        y = 2 + ri * (h + GAP_Y)
        for n, w, ls in r:
            pos[n] = (x, y, w)
            out.append(_node_svg(x, y, w, h, ls, shapes.get(n, "rect")))
            x += w + GAP_X
    for i in range(len(seq) - 1):
        a, b = seq[i], seq[i + 1]
        ax, ay, aw = pos[a]; bx, by, _bw = pos[b]
        if ay == by:
            out.append(f'<path class="dg-edge" marker-end="url(#ah)" '
                       f'd="M{ax+aw} {ay+h/2} L{bx-4} {by+h/2}"/>')
        else:                       # wrap: drop out of the row and come back on the left
            my = ay + h + GAP_Y / 2
            out.append(f'<path class="dg-edge" marker-end="url(#ah)" fill="none" '
                       f'd="M{ax+aw/2} {ay+h} L{ax+aw/2} {my} L{bx+ _bw/2} {my} L{bx+_bw/2} {by-4}"/>')
    out.append("</svg>")
    return "".join(out)


def render_flowchart(src, max_w=980):
    direction, labels, shapes, edges, order = parse_flowchart(src)
    if not order:
        return None
    if direction == "LR" and _is_chain(order, edges):
        chain = render_chain(labels, shapes, edges, order, max_w)
        if chain:                       # None when the walk did not reach every node
            return chain

    layer, _succ, _indeg = _layers(order, edges)
    groups = {}
    for n in order:
        groups.setdefault(layer[n], []).append(n)

    boxes = {n: _box(labels[n]) for n in order}
    pos = {}

    if direction == "LR":
        col_w = {L: max(boxes[n][0] for n in ns) for L, ns in groups.items()}
        x = 2
        total_h = 0
        for L in sorted(groups):
            ns = groups[L]
            hh = sum(boxes[n][1] + GAP_Y for n in ns) - GAP_Y
            total_h = max(total_h, hh)
        for L in sorted(groups):
            ns = groups[L]
            hh = sum(boxes[n][1] + GAP_Y for n in ns) - GAP_Y
            y = 2 + (total_h - hh) / 2
            for n in ns:
                w, h, _ls = boxes[n]
                pos[n] = (x + (col_w[L] - w) / 2, y, w, h)
                y += h + GAP_Y
            x += col_w[L] + GAP_X + 26
        width, height = x - GAP_X - 26 + 4, total_h + 4
    else:
        row_h = {L: max(boxes[n][1] for n in ns) for L, ns in groups.items()}
        total_w = 0
        for L, ns in groups.items():
            total_w = max(total_w, sum(boxes[n][0] + GAP_X for n in ns) - GAP_X)
        y = 2
        for L in sorted(groups):
            ns = groups[L]
            ww = sum(boxes[n][0] + GAP_X for n in ns) - GAP_X
            x = 2 + (total_w - ww) / 2
            for n in ns:
                w, h, _ls = boxes[n]
                pos[n] = (x, y + (row_h[L] - h) / 2, w, h)
                x += w + GAP_X
            y += row_h[L] + GAP_Y + 14
        width, height = total_w + 4, y - GAP_Y - 14 + 4

    out = [_svg_open(width, height)]
    for a, b, lbl in edges:
        if a not in pos or b not in pos:
            continue
        ax, ay, aw, ah = pos[a]; bx, by, bw, bh = pos[b]
        if direction == "LR":
            x1, y1 = ax + aw, ay + ah / 2
            x2, y2 = bx - 4, by + bh / 2
            mx = (x1 + x2) / 2
            d = f"M{x1} {y1} C{mx} {y1} {mx} {y2} {x2} {y2}"
            lx, ly = mx, (y1 + y2) / 2 - 6
        else:
            x1, y1 = ax + aw / 2, ay + ah
            x2, y2 = bx + bw / 2, by - 4
            my = (y1 + y2) / 2
            d = f"M{x1} {y1} C{x1} {my} {x2} {my} {x2} {y2}"
            lx, ly = (x1 + x2) / 2, my - 3
        out.append(f'<path class="dg-edge" fill="none" marker-end="url(#ah)" d="{d}"/>')
        if lbl:
            w = len(lbl) * (CH - 0.8) + 10
            out.append(f'<rect class="dg-lblbg" x="{lx-w/2}" y="{ly-9}" width="{w}" height="16" rx="3"/>')
            out.append(f'<text class="dg-lbl" x="{lx}" y="{ly}" text-anchor="middle" '
                       f'dominant-baseline="middle">{_esc(lbl)}</text>')
    for n in order:
        x, y, w, h = pos[n]
        out.append(_node_svg(x, y, w, h, boxes[n][2], shapes.get(n, "rect")))
    out.append("</svg>")
    return "".join(out)


# ------------------------------------------------------------------ pie

def render_pie(src):
    title = ""
    m = re.search(r'^\s*title\s+(.+)$', src, re.M)
    if m:
        title = m.group(1).strip()
    rows = re.findall(r'^\s*"(.+?)"\s*:\s*([\d.]+)\s*$', src, re.M)
    if not rows:
        return None
    data = [(k, float(v)) for k, v in rows]
    total = sum(v for _k, v in data) or 1

    R, CX, CY = 110, 130, 130
    legend_x = 280
    lh = 22
    height = max(2 * CY + 10, len(data) * lh + 40)
    width = legend_x + max(len(k) for k, _ in data) * (CH - 0.5) + 90

    out = [_svg_open(width, height)]
    if title:
        out.append(f'<text class="dg-title" x="0" y="16">{_esc(title)}</text>')
        out.append(f'<g transform="translate(0,26)">')
    ang = -math.pi / 2
    for i, (k, v) in enumerate(data):
        sweep = 2 * math.pi * v / total
        x1, y1 = CX + R * math.cos(ang), CY + R * math.sin(ang)
        ang += sweep
        x2, y2 = CX + R * math.cos(ang), CY + R * math.sin(ang)
        large = 1 if sweep > math.pi else 0
        out.append(f'<path class="dg-slice s{i%10}" d="M{CX} {CY} L{x1:.1f} {y1:.1f} '
                   f'A{R} {R} 0 {large} 1 {x2:.1f} {y2:.1f} z"/>')
        mid = ang - sweep / 2
        tx, ty = CX + R * 0.66 * math.cos(mid), CY + R * 0.66 * math.sin(mid)
        pct = v / total * 100
        if pct >= 6:
            out.append(f'<text class="dg-pct" x="{tx:.1f}" y="{ty:.1f}" text-anchor="middle" '
                       f'dominant-baseline="middle">{v:g}%</text>')
        ly = 14 + i * lh
        out.append(f'<rect class="dg-slice s{i%10}" x="{legend_x}" y="{ly-9}" width="12" height="12" rx="2"/>')
        out.append(f'<text class="dg-legend" x="{legend_x+20}" y="{ly}" '
                   f'dominant-baseline="middle">{_esc(k)}</text>')
    if title:
        out.append("</g>")
    out.append("</svg>")
    return "".join(out)


# ------------------------------------------------------------------ entry point

def render(src):
    """Return SVG markup, or None if this is not a diagram we draw."""
    head = src.strip().split("\n", 1)[0].strip().lower()
    try:
        if head.startswith("pie"):
            return render_pie(src)
        if head.startswith(("flowchart", "graph")):
            if "subgraph" in src:
                panels = parse_panels(src)
                if panels:
                    return render_panels(panels)
            return render_flowchart(src)
    except Exception:
        return None      # a malformed block degrades to readable source, never to a crash
    return None
