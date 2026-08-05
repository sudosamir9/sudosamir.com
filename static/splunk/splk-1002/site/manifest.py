"""The 43 pages of the site, declared rather than discovered.

Every href in the output is decided from this file. Nothing asks the filesystem what
exists, so a page built on its own still links correctly to all the others, and a cram
sheet can never overwrite the topic page it shares a filename with.
"""

# group key, heading shown in the rail, whether the group starts open
GROUPS = [
    ("start",     "Start here",           True),
    ("sections",  "Sections",             True),
    ("reference", "Reference",            False),
    ("practice",  "Practice and sources", False),
]

# (group, source path relative to SPLK-1002, label, section, weight, pair)
#   section: shown as the small prefix on the rail row
#   weight:  exam percentage, only on the ten blueprint sections
#   pair:    the matching cram sheet, giving the Study / Cram control
PAGES = [
    ("start", "README.md",                  "Read me first",        None, None, None),
    ("start", "00-exam-overview.md",        "Exam overview",        None, None, None),
    ("start", "lab-setup.md",               "Lab setup",            None, None, None),
    ("start", "cram/all-in-one.md",         "Final review sheet",   None, None, None),

    ("sections", "topics/00-foundations-refresher.md",       "Foundations refresher",        "0.0",  None, "cram/00-foundations-refresher.md"),
    ("sections", "topics/01-transforming-commands.md",       "Transforming commands",        "1.0",  5,    "cram/01-transforming-commands.md"),
    ("sections", "topics/02-filtering-and-formatting.md",    "Filtering and formatting",     "2.0",  10,   "cram/02-filtering-and-formatting.md"),
    ("sections", "topics/03-correlating-events.md",          "Correlating events",           "3.0",  15,   "cram/03-correlating-events.md"),
    ("sections", "topics/04-field-extractions.md",           "Field extractions",            "4.0",  10,   "cram/04-field-extractions.md"),
    ("sections", "topics/05-aliases-and-calculated-fields.md","Aliases and calculated fields","5.0",  10,   "cram/05-aliases-and-calculated-fields.md"),
    ("sections", "topics/06-tags-and-event-types.md",        "Tags and event types",         "6.0",  10,   "cram/06-tags-and-event-types.md"),
    ("sections", "topics/07-macros.md",                      "Macros",                       "7.0",  10,   "cram/07-macros.md"),
    ("sections", "topics/08-workflow-actions.md",            "Workflow actions",             "8.0",  10,   "cram/08-workflow-actions.md"),
    ("sections", "topics/09-data-models-and-pivot.md",       "Data models and pivot",        "9.0",  10,   "cram/09-data-models-and-pivot.md"),
    ("sections", "topics/10-cim.md",                         "CIM",                          "10.0", 10,   "cram/10-cim.md"),

    ("reference", "reference/knowledge-object-precedence.md", "Search-time precedence",  None, None, None),
    ("reference", "reference/exam-traps.md",                  "Trap inventory",          None, None, None),
    ("reference", "reference/docs-by-blueprint.md",           "Docs by blueprint",       None, None, None),
    ("reference", "reference/doc-links.md",                   "Doc links by manual",     None, None, None),
    ("reference", "reference/spl-command-reference.md",       "SPL command reference",   None, None, None),
    ("reference", "reference/eval-functions.md",              "Eval functions",          None, None, None),
    ("reference", "reference/stats-and-chart-functions.md",   "Stats and chart functions", None, None, None),
    ("reference", "reference/time-modifiers.md",              "Time modifiers",          None, None, None),
    ("reference", "reference/regex-for-splunk.md",            "Regex for Splunk",        None, None, None),
    ("reference", "reference/cim-data-models.md",             "CIM data models",         None, None, None),
    ("reference", "reference/glossary.md",                    "Glossary",                None, None, None),

    ("practice", "practice/README.md",              "How to drill",        None, None, None),
    ("practice", "practice/tracker.md",             "Attempt tracker",     None, None, None),
    ("practice", "practice/weak-areas.md",          "Weak areas",          None, None, None),
]

# Cram sheets are reachable through their topic's Study / Cram control rather than as
# rail rows of their own, so they are declared separately but still built.
CRAM = [
    ("cram/00-foundations-refresher.md",        "Foundations refresher",        "0.0",  None),
    ("cram/01-transforming-commands.md",        "Transforming commands",        "1.0",  5),
    ("cram/02-filtering-and-formatting.md",     "Filtering and formatting",     "2.0",  10),
    ("cram/03-correlating-events.md",           "Correlating events",           "3.0",  15),
    ("cram/04-field-extractions.md",            "Field extractions",            "4.0",  10),
    ("cram/05-aliases-and-calculated-fields.md","Aliases and calculated fields","5.0",  10),
    ("cram/06-tags-and-event-types.md",         "Tags and event types",         "6.0",  10),
    ("cram/07-macros.md",                       "Macros",                       "7.0",  10),
    ("cram/08-workflow-actions.md",             "Workflow actions",             "8.0",  10),
    ("cram/09-data-models-and-pivot.md",        "Data models and pivot",        "9.0",  10),
    ("cram/10-cim.md",                          "CIM",                          "10.0", 10),
]


# Pages that are hand-written rather than rendered from markdown. They appear in the rail
# and in the prev/next chain, but nothing builds them.
STATIC = [
    ("practice", "exam/index.html", "Exam simulator", None, None),
]


def out_path(src: str) -> str:
    """Mirror the source tree, so the 166 existing markdown cross-links stay correct
    under a plain extension swap. The root README becomes the landing page."""
    return "index.html" if src == "README.md" else src[:-3] + ".html"


def all_entries():
    """Every page to build: {src, out, group, label, section, weight, pair, is_cram}."""
    out = []
    for group, src, label, section, weight, pair in PAGES:
        out.append(dict(src=src, out=out_path(src), group=group, label=label,
                        section=section, weight=weight, pair=pair, is_cram=False,
                        static=False))
    for group, out_rel, label, section, weight in STATIC:
        out.append(dict(src=out_rel, out=out_rel, group=group, label=label,
                        section=section, weight=weight, pair=None, is_cram=False,
                        static=True))
    seen = {e["src"] for e in out}
    for src, label, section, weight in CRAM:
        if src in seen:      # cram/all-in-one is already a Start here page
            continue
        topic = src.replace("cram/", "topics/")
        out.append(dict(src=src, out=out_path(src), group="sections", label=label,
                        section=section, weight=weight, pair=topic, is_cram=True,
                        static=False))
    return out
