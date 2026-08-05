"""Turn the practice JSON and the trap master table into one loadable question bank.

The simulator opens over file://, where fetch and XHR are refused, so the bank cannot be
requested at read time. It is emitted as a plain script that assigns a global, the same
way the site's search index is.

    python3 site/build_bank.py

Reads  practice/udemy-tests/test-*.json  and  reference/exam-traps.md
Writes site/exam/bank.js
"""
import json, glob, os, re, sys, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)                       # SPLK-1002/
TESTS = os.path.join(ROOT, "practice", "udemy-tests")
AUTHORED = os.path.join(ROOT, "practice", "authored")
TRAPS = os.path.join(ROOT, "reference", "exam-traps.md")
OUT = os.path.join(HERE, "exam", "bank.js")

# The ten blueprint sections, verified against splunk-test-blueprint-power-user.pdf.
SECTIONS = [
    ("1",  "1.0", "Using Transforming Commands for Visualizations", "Transforming commands",  5),
    ("2",  "2.0", "Filtering and Formatting Results",               "Filtering and formatting", 10),
    ("3",  "3.0", "Correlating Events",                             "Correlating events",     15),
    ("4",  "4.0", "Creating and Managing Fields",                   "Field extractions",      10),
    ("5",  "5.0", "Creating Field Aliases and Calculated Fields",   "Aliases and calculated fields", 10),
    ("6",  "6.0", "Creating Tags and Event Types",                  "Tags and event types",   10),
    ("7",  "7.0", "Creating and Using Macros",                      "Macros",                 10),
    ("8",  "8.0", "Creating and Using Workflow Actions",            "Workflow actions",       10),
    ("9",  "9.0", "Creating Data Models",                           "Data models and pivot",  10),
    ("10", "10.0", "Using the Common Information Model (CIM) Add-On", "CIM",                  10),
]

TEST_TITLES = {
    "test-1": "Practice Test 1", "test-2": "Practice Test 2", "test-3": "Practice Test 3",
    "test-4": "Practice Test 4", "test-final": "Final Practice Test",
}

# Questions written for this guide, one file per blueprint section. Kept separate from the
# transcribed course so provenance is never ambiguous, and so a build can drop the course
# questions without touching anything else.
AUTHORED_TITLES = {f"authored-{n:02d}": f"Guide questions {n}.0" for n in range(1, 11)}


def load_traps():
    """ID to wrong belief and correct fact, from the master table only."""
    traps, in_table = {}, False
    for line in open(TRAPS, encoding="utf-8"):
        if line.startswith("| ID |"):
            in_table = True
            continue
        if in_table and not line.startswith("|"):
            if traps:
                break
            continue
        if not in_table or line.startswith("|---"):
            continue
        # A cell may contain an escaped pipe, which is how SPL examples survive a
        # markdown table. Splitting on a bare | truncates those cells mid-sentence.
        row = line.strip().strip("|")
        cells = [c.strip().replace("\\|", "|") for c in re.split(r"(?<!\\)\|", row)]
        if len(cells) >= 4 and re.match(r"^T-[A-Z0-9]+-\d+$", cells[0]):
            traps[cells[0]] = {"belief": cells[2], "fact": cells[3]}
    return traps


EXCLUDE_UDEMY = False


def main():
    global EXCLUDE_UDEMY, OUT
    if "--exclude-udemy" in sys.argv:
        EXCLUDE_UDEMY = True
    if "--out" in sys.argv:
        OUT = sys.argv[sys.argv.index("--out") + 1]
    traps = load_traps()
    if len(traps) < 250:
        sys.exit(f"only {len(traps)} traps parsed from the master table, expected ~292")

    sources = []
    if not EXCLUDE_UDEMY:
        sources += sorted(glob.glob(os.path.join(TESTS, "test-*.json")))
    sources += sorted(glob.glob(os.path.join(AUTHORED, "section-*.json")))

    raw, seen_in = [], {}
    for path in sources:
        key = json.load(open(path, encoding="utf-8"))["testId"]
        for q in json.load(open(path, encoding="utf-8"))["questions"]:
            raw.append((key, q))
            root = q.get("duplicateOf") or q["id"]
            seen_in.setdefault(root, []).append(key)

    titles = dict(TEST_TITLES, **AUTHORED_TITLES)
    questions, order, tests = [], {}, {}
    used_traps = set()

    for key, q in raw:
        root = q.get("duplicateOf") or q["id"]
        tests.setdefault(key, []).append(root)
        if q.get("duplicateOf"):
            continue

        g = q["guide"]
        sec = g.get("blueprintSection")
        grp = sec.split(".")[0] if sec else None
        answer = [o["id"] for o in q["options"] if o["isCorrect"]]

        # A question is kept out of mock exams when it cannot be scored honestly: no
        # option is correct, or the docs and the course genuinely disagree. Samir chose
        # to keep both kinds in practice, where the reasoning is the point.
        unanswerable = bool(q.get("unanswerable") or g.get("unanswerable")) or not answer
        disputed = g.get("keyVerdict") == "disputed"
        off = not g.get("onBlueprint")
        block = ("unanswerable" if unanswerable else
                 "disputed" if disputed else
                 "off-blueprint" if off else None)

        tids = [t for t in (g.get("trapIds") or []) if t in traps]
        used_traps.update(tids)

        questions.append({
            "id": q["id"],
            "type": q["type"],
            "stem": q["stem"],
            "options": [{"id": o["id"], "text": o["text"], "correct": o["isCorrect"],
                         "why": o.get("explanation") or ""} for o in q["options"]],
            "answer": answer,
            "explanation": q.get("overallExplanation") or "",
            "sec": sec, "secTitle": g.get("blueprintTitle"), "grp": grp,
            "traps": tids,
            "read": g.get("readNext") or [],
            "verdict": g.get("keyVerdict"),
            "note": g.get("verdictNote") or "",
            "courseKey": q.get("courseKey") or [],
            "corrected": g.get("correctedAnswer"),
            "docs": g.get("docs") or [],
            "difficulty": g.get("difficulty"),
            "issues": g.get("explanationIssues") or [],
            "block": block,
            "tests": sorted(set(seen_in.get(q["id"], []))),
            "authored": key.startswith("authored-"),
        })
        order[q["id"]] = len(questions) - 1

    for key in tests:
        missing = [i for i in tests[key] if i not in order]
        if missing:
            sys.exit(f"{key} references unknown question ids: {missing[:3]}")

    bank = {
        "meta": {
            "built": datetime.date.today().isoformat(),
            "unique": len(questions),
            "served": len(raw),
            "mockEligible": sum(1 for q in questions if not q["block"]),
            "authored": sum(1 for q in questions if q["authored"]),
            "excludesUdemy": EXCLUDE_UDEMY,
        },
        "sections": [{"grp": g, "id": sid, "title": t, "short": s, "weight": w}
                     for g, sid, t, s, w in SECTIONS],
        "tests": [{"id": k, "title": titles.get(k, k), "questionIds": v,
                   "authored": k.startswith("authored-")}
                  for k, v in sorted(tests.items())],
        "traps": {t: traps[t] for t in sorted(used_traps)},
        "questions": questions,
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    payload = json.dumps(bank, ensure_ascii=False, separators=(",", ":"))
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("// Generated by build_bank.py. Do not edit.\n")
        f.write("window.SPLK_BANK=" + payload + ";\n")

    from collections import Counter
    per = Counter(q["grp"] for q in questions if not q["block"])
    print(f"{len(questions)} unique questions, {len(raw)} served, "
          f"{bank['meta']['mockEligible']} mock-eligible, {len(used_traps)} traps inlined")
    print("blocked:", ", ".join(f"{q['id']} ({q['block']})" for q in questions if q["block"]))
    print("mock pool by section:", " ".join(f"{g}:{per.get(g,0)}" for g, _, _, _, _ in SECTIONS))
    print(f"{OUT} {os.path.getsize(OUT)//1024} KB")


if __name__ == "__main__":
    main()
