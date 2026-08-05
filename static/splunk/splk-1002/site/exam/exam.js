/* SPLK-1002 exam simulator.
 *
 * One page, hash-routed. A mock exam is timed, so navigating between questions must not
 * reload the document and restart the clock; every view is rendered into the same shell.
 *
 * The bank arrives as a global from bank.js because fetch and XHR are refused at the
 * file:// origin. Progress lives in localStorage, which does work there.
 *
 * Two rules the data forces. Scoring is against the verified answer, not the course's
 * key, since the fact-check found three keys wrong and one question with no correct
 * option at all. And those four, plus the four off-blueprint ones, never enter a mock
 * exam: a score should not turn on a question that cannot be answered correctly.
 */
(function () {
  "use strict";

  var BANK = window.SPLK_BANK;
  var Q = {}, BY_TEST = {}, SEC = {};
  BANK.questions.forEach(function (q) { Q[q.id] = q; });
  BANK.tests.forEach(function (t) { BY_TEST[t.id] = t; });
  BANK.sections.forEach(function (s) { SEC[s.grp] = s; });

  var MOCK_COUNT = 65, MOCK_MINUTES = 60;
  var GUIDE = "../";                       // the study site, one level up from exam/

  // ------------------------------------------------------------------ storage

  var KEY = "splk1002.v1";
  var store = {
    read: function () {
      try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
    },
    write: function (s) {
      try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    }
  };
  function state() {
    var s = store.read();
    s.progress = s.progress || {};       // qid -> {seen, right, wrong, flag}
    s.attempts = s.attempts || [];       // finished attempts, newest last
    s.active = s.active || null;         // a mock exam in flight
    return s;
  }
  function save(s) { store.write(s); }
  function prog(s, id) {
    return s.progress[id] || (s.progress[id] = { seen: 0, right: 0, wrong: 0, flag: false });
  }

  // ------------------------------------------------------------------ helpers

  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  /* Backticks in the source data are markdown. Render them as code, escaping first so
     nothing in the question text can inject markup. */
  function rich(s) {
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
  }
  /* Every href is built by string concatenation, so it is escaped as an HTML attribute
     and restricted to schemes that cannot execute. Anything else renders as a dead link
     rather than a javascript: URL. */
  function href(u) {
    u = String(u == null ? "" : u);
    return /^(https?:\/\/|\.{0,2}\/|[\w.-]+\.html|#)/i.test(u) ? esc(u) : "";
  }
  function same(a, b) {
    if (a.length !== b.length) return false;
    var x = a.slice().sort().join(""), y = b.slice().sort().join("");
    return x === y;
  }
  function pct(n, d) { return d ? Math.round(n * 100 / d) : 0; }
  function mmss(sec) {
    sec = Math.max(0, Math.round(sec));
    var m = Math.floor(sec / 60);
    return m + ":" + String(sec % 60).padStart(2, "0");
  }
  function shuffle(a, rnd) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor((rnd ? rnd() : Math.random()) * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ------------------------------------------------------------------ pools

  function eligible() { return BANK.questions.filter(function (q) { return !q.block; }); }

  /* Largest-remainder apportionment against the blueprint weights, then capped by what
     each section actually has. Section 6.0 holds only five mock-eligible questions
     because all four disputed tag items live there, so the shortfall has to land
     somewhere; it is redistributed across sections with spare capacity. */
  function drawWeighted(n) {
    var pool = {}, avail = {};
    eligible().forEach(function (q) {
      (pool[q.grp] = pool[q.grp] || []).push(q.id);
    });
    Object.keys(pool).forEach(function (g) { avail[g] = pool[g].length; });

    var groups = BANK.sections.map(function (s) { return s.grp; })
                              .filter(function (g) { return avail[g]; });
    var totalW = groups.reduce(function (a, g) { return a + SEC[g].weight; }, 0);

    var exact = {}, take = {}, used = 0;
    groups.forEach(function (g) {
      exact[g] = n * SEC[g].weight / totalW;
      take[g] = Math.min(avail[g], Math.floor(exact[g]));
      used += take[g];
    });
    // hand out the remaining seats by largest fractional part, skipping full sections
    var rest = groups.slice().sort(function (a, b) {
      return (exact[b] - Math.floor(exact[b])) - (exact[a] - Math.floor(exact[a]));
    });
    var guard = 0;
    while (used < n && guard++ < 500) {
      var moved = false;
      for (var i = 0; i < rest.length && used < n; i++) {
        var g = rest[i];
        if (take[g] < avail[g]) { take[g]++; used++; moved = true; }
      }
      if (!moved) break;                 // pool exhausted, exam is shorter than asked
    }

    var picked = [];
    groups.forEach(function (g) { picked = picked.concat(shuffle(pool[g].slice()).slice(0, take[g])); });
    return shuffle(picked);
  }

  function poolFor(spec) {
    if (spec.kind === "test") return BY_TEST[spec.id].questionIds.slice();
    if (spec.kind === "section") {
      return BANK.questions.filter(function (q) { return q.grp === spec.id; }).map(function (q) { return q.id; });
    }
    if (spec.kind === "flagged") {
      var s = state();
      return BANK.questions.filter(function (q) { return s.progress[q.id] && s.progress[q.id].flag; })
                           .map(function (q) { return q.id; });
    }
    if (spec.kind === "missed") {
      var st = state();
      return BANK.questions.filter(function (q) {
        var p = st.progress[q.id]; return p && p.wrong > 0;
      }).map(function (q) { return q.id; });
    }
    if (spec.kind === "unseen") {
      var su = state();
      return BANK.questions.filter(function (q) { return !su.progress[q.id]; }).map(function (q) { return q.id; });
    }
    return BANK.questions.map(function (q) { return q.id; });     // all
  }

  // ------------------------------------------------------------------ question card

  /* Shared by practice and mock. `revealed` false means an exam: choices are recorded,
     nothing is scored on screen. */
  function questionCard(q, opts) {
    var chosen = opts.chosen || [];
    var revealed = !!opts.revealed;
    var card = el("div", "qcard");

    var eyebrow = el("div", "qeyebrow");
    eyebrow.innerHTML = q.sec
      ? "<b>" + esc(q.sec) + "</b> &nbsp;" + esc(q.secTitle || "")
      : "Off blueprint";
    card.appendChild(eyebrow);

    var stem = el("p", "stem");
    stem.innerHTML = rich(q.stem);
    card.appendChild(stem);

    if (q.type === "multi") {
      card.appendChild(el("p", "hint", "Select exactly " + q.answer.length + " answers."));
    }

    var list = el("div", "answers");
    q.options.forEach(function (o) {
      var b = el("button", "ans");
      b.type = "button";
      b.setAttribute("aria-pressed", chosen.indexOf(o.id) >= 0 ? "true" : "false");
      var k = el("span", "k", o.id);
      var t = el("span", "t");
      t.innerHTML = rich(o.text);
      b.appendChild(k); b.appendChild(t);

      if (revealed) {
        b.disabled = true;
        var picked = chosen.indexOf(o.id) >= 0;
        if (o.correct) b.classList.add("correct");
        else if (picked) b.classList.add("wrong");
        if (picked) {
          var m = el("span", "mark", "✓");
          k.appendChild(m);
        }
      } else {
        b.onclick = function () { opts.onPick(o.id); };
      }
      list.appendChild(b);
    });
    card.appendChild(list);

    if (opts.footer) card.appendChild(opts.footer);
    return card;
  }

  function feedbackBar(right, chosen) {
    var f = el("div", "feedback " + (right ? "ok" : "no"));
    f.appendChild(el("span", "icon", right ? "✓" : "✕"));
    f.appendChild(el("span", "verdict", right ? "Correct!" : "Incorrect"));
    f.appendChild(el("span", "you", "Your answer: " + (chosen.length ? chosen.slice().sort().join(", ") : "none")));
    return f;
  }

  /* The full teaching panel: what the answer is, why, which traps it bites, and why each
     other option fails. The doc links and the key-verdict note are this guide's own
     additions; they are the reason the bank was fact-checked in the first place. */
  function reviewPanel(q, chosen) {
    var r = el("div", "review");
    var h = [];

    if (q.block === "unanswerable") {
      h.push('<div class="keywarn"><b>No offered option is correct.</b> ' + rich(q.note) +
             ' This question is kept out of mock exams.</div>');
    } else if (q.verdict === "wrong") {
      h.push('<div class="keywarn"><b>The course answer key is wrong here.</b> It keys ' +
             esc((q.courseKey || []).join(", ") || "nothing") + '. The verified answer is ' +
             esc(q.answer.join(", ")) + ', and you are scored against that.</div>');
    } else if (q.block === "disputed") {
      h.push('<div class="keywarn"><b>Disputed.</b> The course and the 10.4 documentation ' +
             'disagree and the docs do not settle it. Kept out of mock exams.</div>');
    }

    h.push('<div class="rlabel b">Correct answer</div>');
    h.push('<div class="answerline">' + esc(q.answer.join(", ") || "none") + "</div>");

    if (q.explanation) {
      h.push('<div class="rlabel b">Explanation</div>');
      h.push('<p class="expl">' + rich(q.explanation) + "</p>");
    }

    var traps = (q.traps || []).filter(function (t) { return BANK.traps[t]; });
    if (traps.length) {
      h.push('<div class="rlabel a">Exam trap</div>');
      traps.forEach(function (t) {
        var tr = BANK.traps[t];
        h.push('<div class="trapbox"><span class="tid">' + esc(t) + "</span>" + rich(tr.belief) +
               '<span class="fact">' + rich(tr.fact) + "</span></div>");
      });
    }

    var wrongs = q.options.filter(function (o) { return !o.correct && o.why; });
    if (wrongs.length) {
      h.push('<div class="rlabel r">Why the other options are wrong</div>');
      wrongs.forEach(function (o) {
        h.push('<div class="why"><span class="k">' + esc(o.id) + ":</span><span>" + rich(o.why) + "</span></div>");
      });
    }
    var rights = q.options.filter(function (o) { return o.correct && o.why; });
    if (rights.length) {
      h.push('<div class="rlabel g">Why the answer is right</div>');
      rights.forEach(function (o) {
        h.push('<div class="why pos"><span class="k">' + esc(o.id) + ":</span><span>" + rich(o.why) + "</span></div>");
      });
    }

    /* The course explains its own options, and the fact-check found 65 statements in
       those explanations that the documentation contradicts. Where the reader is being
       told something false, say so on the same screen rather than in a separate file. */
    if (q.issues && q.issues.length) {
      h.push('<div class="rlabel r">Where the course explanation is wrong</div>');
      q.issues.forEach(function (t) {
        h.push('<div class="why"><span class="k">!</span><span>' + rich(t) + "</span></div>");
      });
    }

    if (q.note) {
      // Questions written for this guide carry no course key, so "checked against the
      // documentation" would be the wrong claim; they were written from it.
      if (q.verdict === "authored") {
        h.push('<div class="rlabel b">Written for this guide ' +
               '<span class="badge info">from the 10.4 docs</span></div>');
      } else {
        var cls = q.verdict === "wrong" || q.verdict === "disputed" ? "bad"
                : q.verdict === "imprecise" ? "warn" : "ok";
        h.push('<div class="rlabel b">Checked against the documentation ' +
               '<span class="badge ' + cls + '">' + esc(q.verdict || "checked") + "</span></div>");
      }
      h.push('<div class="note">' + rich(q.note) + "</div>");
    }

    if (q.docs && q.docs.length) {
      h.push('<div class="rlabel b">Documentation</div><ul class="doclist">');
      q.docs.forEach(function (d) {
        h.push('<li><a href="' + href(d.url) + '" target="_blank" rel="noopener">' + esc(d.title) + "</a>" +
               (d.primary ? '<span class="primary">primary</span>' : "") +
               (d.note ? '<span class="n">' + rich(d.note) + "</span>" : "") + "</li>");
      });
      h.push("</ul>");
    }

    if (q.read && q.read.length) {
      h.push('<div class="rlabel b">Read this next</div><ul class="doclist">');
      q.read.forEach(function (p) {
        h.push('<li><a href="' + href(GUIDE + p.replace(/\.md(#|$)/, ".html$1")) + '">' +
               esc(p.replace(/\.md(#|$)/, "$1")) + "</a></li>");
      });
      h.push("</ul>");
    }

    r.innerHTML = h.join("");
    return r;
  }

  // ------------------------------------------------------------------ views

  var app = document.getElementById("app");
  function mount(node) { app.innerHTML = ""; app.appendChild(node); window.scrollTo(0, 0); }
  function go(hash) { location.hash = hash; }

  function topbar(links) {
    var t = el("div", "topbar");
    var b = el("span", "brand");
    b.innerHTML = "SPLK-1002 <b>Exam simulator</b>";
    t.appendChild(b);
    t.appendChild(el("span", "spacer"));
    (links || [["Home", "#/"], ["Study guide", GUIDE + "index.html"]]).forEach(function (l) {
      var a = el("a", null, l[0]); a.href = l[1]; t.appendChild(a);
    });
    return t;
  }

  // ---- home

  function viewHome() {
    var s = state();
    var root = el("div");
    root.appendChild(topbar([["Study guide", GUIDE + "index.html"]]));
    var w = el("div", "wrap");

    w.appendChild(el("h1", null, "Exam simulator"));
    var sub = el("p", "sub");
    sub.textContent = BANK.meta.unique + " unique questions, fact-checked against help.splunk.com 10.4. " +
      BANK.meta.mockEligible + " of them can appear in a mock exam.";
    w.appendChild(sub);

    var seen = 0, right = 0, wrong = 0, flagged = 0;
    BANK.questions.forEach(function (q) {
      var p = s.progress[q.id];
      if (!p) return;
      if (p.seen) seen++;
      right += p.right; wrong += p.wrong;
      if (p.flag) flagged++;
    });

    var grid = el("div", "mode-grid");

    var m1 = el("div", "mode");
    m1.innerHTML = '<span class="eyebrow">Untimed</span><h3>Practice</h3>' +
      "<p>One question at a time with the answer, the explanation, the traps it bites and " +
      "why every other option fails, revealed the moment you submit.</p>";
    var a1 = el("div", "actions");
    var b1 = el("a", "btn", "Start practice"); b1.href = "#/practice";
    a1.appendChild(b1);
    if (wrong > 0) {
      var b1b = el("a", "btn ghost", "Drill what I missed"); b1b.href = "#/practice/missed";
      a1.appendChild(b1b);
    }
    m1.appendChild(a1);
    grid.appendChild(m1);

    var m2 = el("div", "mode");
    m2.innerHTML = '<span class="eyebrow">Timed</span><h3>' + MOCK_COUNT + " questions in " + MOCK_MINUTES + " minutes</h3>" +
      "<p>Real conditions. Drawn fresh each time and weighted to the blueprint, so a " +
      "sitting looks like the exam. No feedback until you submit.</p>";
    var a2 = el("div", "actions");
    if (s.active) {
      var br = el("a", "btn", "Resume exam"); br.href = "#/mock"; a2.appendChild(br);
      var bd = el("button", "btn ghost", "Discard");
      bd.onclick = function () {
        if (!confirm("Discard the exam in progress? It will not be scored.")) return;
        var st = state(); st.active = null; save(st); render();
      };
      a2.appendChild(bd);
    } else {
      var b2 = el("button", "btn", "Start mock exam");
      b2.onclick = function () { startMock(); };
      a2.appendChild(b2);
    }
    if (s.attempts.length) {
      var b2b = el("a", "btn ghost", "Past attempts"); b2b.href = "#/attempts"; a2.appendChild(b2b);
    }
    m2.appendChild(a2);
    grid.appendChild(m2);
    w.appendChild(grid);

    w.appendChild(el("h2", null, "Your progress"));
    var stats = el("div", "stat-row");
    [[seen + " / " + BANK.meta.unique, "questions seen", ""],
     [right + wrong ? pct(right, right + wrong) + "%" : "-", "answered correctly", right >= wrong ? "good" : "bad"],
     [String(wrong), "answers missed", wrong ? "bad" : ""],
     [String(flagged), "flagged for review", ""],
     [String(s.attempts.length), "mock exams taken", ""]
    ].forEach(function (t) {
      var d = el("div", "stat " + (t[2] || ""));
      d.appendChild(el("div", "n", t[0]));
      d.appendChild(el("div", "l", t[1]));
      stats.appendChild(d);
    });
    w.appendChild(stats);

    w.appendChild(el("h2", null, "By blueprint section"));
    var tbl = el("div");
    BANK.sections.forEach(function (sec) {
      var qs = BANK.questions.filter(function (q) { return q.grp === sec.grp; });
      var r = 0, wr = 0;
      qs.forEach(function (q) { var p = s.progress[q.id]; if (p) { r += p.right; wr += p.wrong; } });
      var row = el("div", "sec-row");
      var nm = el("div", "name");
      nm.innerHTML = "<small>" + esc(sec.id) + "</small>" + esc(sec.short) +
        ' <span class="badge info">' + sec.weight + "%</span>";
      var bar = el("div", "bar" + (r + wr === 0 ? "" : pct(r, r + wr) >= 75 ? "" : pct(r, r + wr) >= 50 ? " warn" : " bad"));
      var fill = el("i"); fill.style.width = (r + wr ? pct(r, r + wr) : 0) + "%";
      bar.appendChild(fill);
      var frac = el("div", "frac", r + wr ? r + "/" + (r + wr) : "-");
      row.appendChild(nm);
      var wrapBar = el("div"); wrapBar.appendChild(bar);
      row.appendChild(frac); row.appendChild(wrapBar);
      tbl.appendChild(row);
    });
    w.appendChild(tbl);

    var reset = el("p", "empty");
    var rb = el("button", "btn danger", "Reset all progress");
    rb.onclick = function () {
      if (!confirm("Delete all progress, flags and past attempts? This cannot be undone.")) return;
      localStorage.removeItem(KEY); render();
    };
    reset.appendChild(rb);
    w.appendChild(reset);

    root.appendChild(w);
    mount(root);
  }

  // ---- practice

  var practice = null;   // {ids, i, chosen, revealed, spec}

  function practiceSetup(preset) {
    var root = el("div");
    root.appendChild(topbar());
    var w = el("div", "wrap");
    w.appendChild(el("h1", null, "Practice"));
    w.appendChild(el("p", "sub", "Pick a pool. Answers and explanations show as soon as you submit."));

    var s = state();
    var missed = poolFor({ kind: "missed" }).length;
    var flagged = poolFor({ kind: "flagged" }).length;
    var unseen = poolFor({ kind: "unseen" }).length;

    var specs = [
      { label: "Everything", spec: { kind: "all" }, n: BANK.questions.length },
      { label: "Not yet seen", spec: { kind: "unseen" }, n: unseen },
      { label: "Previously missed", spec: { kind: "missed" }, n: missed },
      { label: "Flagged", spec: { kind: "flagged" }, n: flagged }
    ];
    BANK.tests.forEach(function (t) {
      specs.push({ label: t.title, spec: { kind: "test", id: t.id }, n: t.questionIds.length });
    });
    BANK.sections.forEach(function (sec) {
      var n = BANK.questions.filter(function (q) { return q.grp === sec.grp; }).length;
      if (n) specs.push({ label: sec.id + " " + sec.short, spec: { kind: "section", id: sec.grp }, n: n });
    });

    w.appendChild(el("h2", null, "Pool"));
    var opts = el("div", "opts");
    specs.forEach(function (sp) {
      var c = el("button", "chip");
      c.type = "button";
      c.innerHTML = esc(sp.label) + '<span class="c">' + sp.n + "</span>";
      c.disabled = sp.n === 0;
      if (sp.n === 0) c.style.opacity = ".4";
      c.onclick = function () { beginPractice(sp.spec); };
      opts.appendChild(c);
    });
    w.appendChild(opts);

    var note = el("p", "sub");
    note.innerHTML = "The " + (BANK.questions.length - BANK.meta.mockEligible) +
      " questions that never appear in a mock exam are all here: the one with no correct option, " +
      "the three the docs dispute, and the four that are off blueprint.";
    w.appendChild(note);

    root.appendChild(w);
    mount(root);

    if (preset) beginPractice(preset);
  }

  function beginPractice(spec) {
    var ids = poolFor(spec);
    if (!ids.length) { practiceSetup(); return; }
    practice = { ids: shuffle(ids), i: 0, chosen: [], revealed: false, spec: spec, right: 0, done: 0 };
    renderPractice();
  }

  function renderPractice() {
    var p = practice;
    var q = Q[p.ids[p.i]];
    var s = state();

    var root = el("div");
    var tb = topbar([["Home", "#/"], ["Study guide", GUIDE + "index.html"]]);
    var chg = el("a", null, "Change pool");
    chg.href = "#/practice";
    chg.onclick = function (e) { e.preventDefault(); practice = null; practiceSetup(); };
    tb.insertBefore(chg, tb.querySelector("a"));
    root.appendChild(tb);
    var w = el("div", "wrap");

    var head = el("div", "exam-head");
    head.style.padding = "0 0 1.2rem";
    var hl = el("div");
    hl.appendChild(el("h1", null, "Practice"));
    hl.appendChild(el("div", "q-of", "Question " + (p.i + 1) + " of " + p.ids.length +
      (p.done ? ", " + p.right + " of " + p.done + " correct this run" : "")));
    head.appendChild(hl);
    var flag = el("button", "btn ghost" + (prog(s, q.id).flag ? " on" : ""), (prog(s, q.id).flag ? "Flagged" : "Flag"));
    flag.onclick = function () {
      var st = state(); var pr = prog(st, q.id); pr.flag = !pr.flag; save(st); renderPractice();
    };
    head.appendChild(flag);
    w.appendChild(head);

    var footer = el("div", "qnav");
    if (!p.revealed) {
      var submit = el("button", "btn", "Submit Answer");
      submit.disabled = q.type === "multi" ? p.chosen.length !== q.answer.length : p.chosen.length === 0;
      submit.onclick = function () {
        p.revealed = true;
        var ok = same(p.chosen, q.answer);
        var st = state(); var pr = prog(st, q.id);
        pr.seen++; if (ok) pr.right++; else pr.wrong++;
        save(st);
        p.done++; if (ok) p.right++;
        renderPractice();
      };
      footer.appendChild(submit);
    } else {
      footer.appendChild(el("span", "spacer"));
      var next = el("button", "btn", p.i + 1 < p.ids.length ? "Next question ›" : "Finish");
      next.onclick = function () {
        if (p.i + 1 < p.ids.length) { p.i++; p.chosen = []; p.revealed = false; renderPractice(); }
        else { practice = null; go("#/"); }
      };
      footer.appendChild(next);
    }

    // Before submitting, the control belongs in the card. After, it belongs below the
    // review, so the reader passes the explanation on the way to the next question.
    w.appendChild(questionCard(q, {
      chosen: p.chosen, revealed: p.revealed, footer: p.revealed ? null : footer,
      onPick: function (id) {
        if (q.type === "multi") {
          var k = p.chosen.indexOf(id);
          if (k >= 0) p.chosen.splice(k, 1);
          else if (p.chosen.length < q.answer.length) p.chosen.push(id);
          else { p.chosen.shift(); p.chosen.push(id); }
        } else {
          p.chosen = [id];
        }
        renderPractice();
      }
    }));

    if (p.revealed) {
      w.appendChild(feedbackBar(same(p.chosen, q.answer), p.chosen));
      w.appendChild(reviewPanel(q, p.chosen));
      w.appendChild(footer);
    }

    root.appendChild(w);
    mount(root);
  }

  // ---- mock exam

  function startMock() {
    var ids = drawWeighted(MOCK_COUNT);
    var s = state();
    s.active = {
      ids: ids, i: 0, answers: {}, flags: {},
      started: Date.now(), deadline: Date.now() + MOCK_MINUTES * 60000
    };
    save(s);
    go("#/mock");
    render();
  }

  var tick = null;
  function stopTick() { if (tick) { clearInterval(tick); tick = null; } }

  function renderMock() {
    var s = state();
    if (!s.active) { go("#/"); return; }
    var a = s.active;
    var q = Q[a.ids[a.i]];

    var shell = el("div", "exam-shell");

    // rail: the question navigator
    var rail = el("div", "exam-rail");
    rail.appendChild(el("div", "rail-label", "Questions"));
    var grid = el("div", "grid-nav");
    a.ids.forEach(function (id, n) {
      var b = el("button", null, String(n + 1));
      if (a.answers[id] && a.answers[id].length) b.classList.add("done");
      if (a.flags[id]) b.classList.add("flag");
      if (n === a.i) b.classList.add("here");
      b.onclick = function () { var st = state(); st.active.i = n; save(st); renderMock(); };
      grid.appendChild(b);
    });
    rail.appendChild(grid);

    var goto = el("div", "goto");
    goto.appendChild(el("span", null, "Go to Q:"));
    var gi = document.createElement("input");
    gi.type = "number"; gi.min = 1; gi.max = a.ids.length; gi.placeholder = "#";
    gi.onkeydown = function (e) {
      if (e.key !== "Enter") return;
      var n = parseInt(gi.value, 10);
      if (n >= 1 && n <= a.ids.length) { var st = state(); st.active.i = n - 1; save(st); renderMock(); }
    };
    goto.appendChild(gi);
    rail.appendChild(goto);

    var legend = el("div", "legend");
    legend.innerHTML =
      '<span><i style="background:rgba(79,142,247,.5)"></i>answered</span>' +
      '<span><i style="background:var(--amber)"></i>flagged</span>' +
      '<span><i style="background:var(--line-soft)"></i>not answered</span>';
    rail.appendChild(legend);
    shell.appendChild(rail);

    // main
    var main = el("div", "exam-main");
    var head = el("div", "exam-head");
    var hl = el("div");
    hl.appendChild(el("h1", null, "SPLK-1002 Mock Exam"));
    hl.appendChild(el("div", "q-of", "Question " + (a.i + 1) + " of " + a.ids.length));
    head.appendChild(hl);
    var timer = el("div", "timer");
    timer.id = "timer";
    head.appendChild(timer);
    main.appendChild(head);

    var body = el("div", "exam-body");
    var chosen = a.answers[q.id] || [];
    var footer = el("div", "qnav");
    var savebtn = el("button", "btn", "Save Answer");
    savebtn.onclick = function () {
      var st = state();
      if (st.active.i + 1 < st.active.ids.length) st.active.i++;
      save(st); renderMock();
    };
    footer.appendChild(savebtn);
    body.appendChild(questionCard(q, {
      chosen: chosen, revealed: false, footer: footer,
      onPick: function (id) {
        var st = state();
        var cur = st.active.answers[q.id] || [];
        if (q.type === "multi") {
          var k = cur.indexOf(id);
          if (k >= 0) cur.splice(k, 1);
          else if (cur.length < q.answer.length) cur.push(id);
          else { cur.shift(); cur.push(id); }
        } else {
          cur = [id];
        }
        st.active.answers[q.id] = cur;
        save(st); renderMock();
      }
    }));
    main.appendChild(body);

    var foot = el("div", "exam-foot");
    var prev = el("button", "btn ghost", "‹ Previous");
    prev.disabled = a.i === 0;
    prev.onclick = function () { var st = state(); st.active.i--; save(st); renderMock(); };
    foot.appendChild(prev);

    var answered = a.ids.filter(function (id) { return a.answers[id] && a.answers[id].length; }).length;
    var bar = el("div", "bar");
    var fill = el("i"); fill.style.width = pct(answered, a.ids.length) + "%";
    bar.appendChild(fill);
    foot.appendChild(bar);
    foot.appendChild(el("span", "q-of", answered + " of " + a.ids.length + " answered"));

    var fl = el("button", "btn ghost" + (a.flags[q.id] ? " on" : ""), a.flags[q.id] ? "Flagged" : "Flag");
    fl.onclick = function () {
      var st = state();
      st.active.flags[q.id] = !st.active.flags[q.id];
      save(st); renderMock();
    };
    foot.appendChild(fl);

    var quit = el("button", "btn danger", "Quit exam");
    quit.onclick = function () {
      if (!confirm("Quit without scoring? The exam is discarded.")) return;
      var st = state(); st.active = null; save(st); stopTick(); go("#/");
    };
    foot.appendChild(quit);

    var next = el("button", "btn", a.i + 1 < a.ids.length ? "Next ›" : "Submit exam");
    next.onclick = function () {
      if (a.i + 1 < a.ids.length) { var st = state(); st.active.i++; save(st); renderMock(); }
      else finishMock(false);
    };
    foot.appendChild(next);
    main.appendChild(foot);

    shell.appendChild(main);
    mount(shell);

    stopTick();
    function paint() {
      var st = state();
      if (!st.active) { stopTick(); return; }
      var left = (st.active.deadline - Date.now()) / 1000;
      var t = document.getElementById("timer");
      if (!t) { stopTick(); return; }
      t.textContent = mmss(left);
      t.setAttribute("aria-label", "Time remaining " + mmss(left));
      t.className = "timer" + (left <= 60 ? " crit" : left <= 300 ? " warn" : "");
      if (left <= 0) { stopTick(); finishMock(true); }
    }
    paint();
    tick = setInterval(paint, 1000);
  }

  function finishMock(expired) {
    var s = state();
    if (!s.active) { go("#/"); return; }
    var a = s.active;
    var unanswered = a.ids.filter(function (id) { return !(a.answers[id] && a.answers[id].length); }).length;
    if (!expired && unanswered &&
        !confirm(unanswered + " question(s) are unanswered. Submit anyway?")) return;

    stopTick();
    var results = a.ids.map(function (id) {
      var chosen = a.answers[id] || [];
      return { id: id, chosen: chosen, right: chosen.length > 0 && same(chosen, Q[id].answer) };
    });
    var right = results.filter(function (r) { return r.right; }).length;

    var attempt = {
      id: "a" + a.started,
      started: a.started,
      finished: Date.now(),
      expired: !!expired,
      count: a.ids.length,
      right: right,
      results: results,
      flags: a.flags
    };
    // record into per-question progress so the drill pools and the home page reflect it
    results.forEach(function (r) {
      var pr = prog(s, r.id);
      pr.seen++;
      if (r.right) pr.right++; else pr.wrong++;
      if (a.flags[r.id]) pr.flag = true;
    });
    s.attempts.push(attempt);
    s.active = null;
    save(s);
    go("#/result/" + attempt.id);
  }

  // ---- results

  function viewResult(id) {
    var s = state();
    var a = null;
    s.attempts.forEach(function (x) { if (x.id === id) a = x; });
    if (!a) { go("#/attempts"); return; }

    var root = el("div");
    root.appendChild(topbar([["Home", "#/"], ["All attempts", "#/attempts"], ["Study guide", GUIDE + "index.html"]]));
    var w = el("div", "wrap wide");

    var score = pct(a.right, a.count);
    var hero = el("div", "score-hero");
    var ring = el("div", "score-ring");
    ring.style.setProperty("--pct", score);
    ring.style.setProperty("--ring", score >= 75 ? "var(--green)" : score >= 55 ? "var(--amber)" : "var(--red)");
    var inner = el("span");
    inner.innerHTML = "<b>" + score + "%</b><small>" + a.right + " of " + a.count + "</small>";
    ring.appendChild(inner);
    hero.appendChild(ring);

    var meta = el("div", "score-meta");
    var mins = Math.round((a.finished - a.started) / 60000);
    meta.innerHTML = "<h2>Mock exam result</h2>" +
      "<p>" + esc(new Date(a.started).toLocaleString()) + "</p>" +
      "<p>" + mins + " minutes used of " + MOCK_MINUTES + (a.expired ? ", time expired" : "") + "</p>" +
      "<p>Splunk publishes no passing score for SPLK-1002, so this percentage is a diagnostic, not a verdict.</p>";
    hero.appendChild(meta);
    w.appendChild(hero);

    w.appendChild(el("h2", null, "By blueprint section"));
    var secs = {};
    a.results.forEach(function (r) {
      var g = Q[r.id].grp || "?";
      var b = secs[g] || (secs[g] = { n: 0, r: 0 });
      b.n++; if (r.right) b.r++;
    });
    var box = el("div");
    BANK.sections.forEach(function (sec) {
      var b = secs[sec.grp];
      if (!b) return;
      var p = pct(b.r, b.n);
      var row = el("div", "sec-row");
      var nm = el("div", "name");
      nm.innerHTML = "<small>" + esc(sec.id) + "</small>" + esc(sec.short) +
        ' <span class="badge info">' + sec.weight + "%</span>";
      var frac = el("div", "frac", b.r + "/" + b.n);
      var bar = el("div", "bar" + (p >= 75 ? "" : p >= 50 ? " warn" : " bad"));
      var fill = el("i"); fill.style.width = p + "%";
      bar.appendChild(fill);
      var bw = el("div"); bw.appendChild(bar);
      row.appendChild(nm); row.appendChild(frac); row.appendChild(bw);
      box.appendChild(row);
    });
    w.appendChild(box);

    var missed = a.results.filter(function (r) { return !r.right; });
    w.appendChild(el("h2", null, missed.length ? "Every question you missed (" + missed.length + ")" : "Nothing missed"));
    if (!missed.length) w.appendChild(el("p", "empty", "A clean sitting."));
    missed.forEach(function (r) {
      var q = Q[r.id];
      var block = el("div");
      block.style.margin = "0 0 2rem";
      block.appendChild(questionCard(q, { chosen: r.chosen, revealed: true }));
      block.appendChild(feedbackBar(false, r.chosen));
      block.appendChild(reviewPanel(q, r.chosen));
      w.appendChild(block);
    });

    var acts = el("p");
    var again = el("button", "btn", "Take another mock exam");
    again.onclick = function () { startMock(); };
    acts.appendChild(again);
    var exp = el("button", "btn ghost", "Export this attempt as JSON");
    exp.style.marginLeft = ".6rem";
    exp.onclick = function () { download(a); };
    acts.appendChild(exp);
    w.appendChild(acts);

    root.appendChild(w);
    mount(root);
  }

  /* The repository keeps attempt records under practice/attempts/. The page cannot write
     there from file://, so it hands you the file and you drop it in. */
  function download(a) {
    var payload = {
      attemptId: a.id,
      mode: "mock",
      startedAt: new Date(a.started).toISOString(),
      finishedAt: new Date(a.finished).toISOString(),
      timeExpired: !!a.expired,
      questionCount: a.count,
      correct: a.right,
      answers: a.results.map(function (r) {
        return { questionId: r.id, chosen: r.chosen, correct: r.right, verified: Q[r.id].answer };
      })
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "mock-" + new Date(a.started).toISOString().slice(0, 10) + "-" + a.id + ".json";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function viewAttempts() {
    var s = state();
    var root = el("div");
    root.appendChild(topbar());
    var w = el("div", "wrap");
    w.appendChild(el("h1", null, "Past attempts"));
    if (!s.attempts.length) {
      w.appendChild(el("p", "empty", "No mock exams yet."));
    } else {
      var tw = el("div", "tw");
      var t = el("table", "plain");
      t.innerHTML = "<thead><tr><th>When</th><th>Score</th><th>Correct</th><th>Minutes</th><th></th></tr></thead>";
      var tb = el("tbody");
      s.attempts.slice().reverse().forEach(function (a) {
        var tr = el("tr");
        var p = pct(a.right, a.count);
        tr.innerHTML = "<td>" + esc(new Date(a.started).toLocaleString()) + "</td>" +
          '<td class="num"><span class="badge ' + (p >= 75 ? "ok" : p >= 55 ? "warn" : "bad") + '">' + p + "%</span></td>" +
          '<td class="num">' + a.right + " / " + a.count + "</td>" +
          '<td class="num">' + Math.round((a.finished - a.started) / 60000) + "</td>" +
          '<td><a href="#/result/' + esc(a.id) + '">Review</a></td>';
        tb.appendChild(tr);
      });
      t.appendChild(tb); tw.appendChild(t); w.appendChild(tw);
    }
    root.appendChild(w);
    mount(root);
  }

  // ------------------------------------------------------------------ router

  function render() {
    var h = location.hash.replace(/^#/, "") || "/";
    stopTick();
    if (h === "/") return viewHome();
    if (h === "/practice") return practiceSetup();
    if (h === "/practice/missed") return practiceSetup({ kind: "missed" });
    if (h === "/mock") return renderMock();
    if (h === "/attempts") return viewAttempts();
    var m = h.match(/^\/result\/(.+)$/);
    if (m) return viewResult(m[1]);
    return viewHome();
  }

  window.addEventListener("hashchange", function () {
    if (location.hash.replace(/^#/, "") === "/practice" && practice) practice = null;
    render();
  });

  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.metaKey || e.ctrlKey || e.altKey) return;
    var s = state();
    if (location.hash.indexOf("/mock") >= 0 && s.active) {
      if (e.key === "ArrowRight" && s.active.i + 1 < s.active.ids.length) { s.active.i++; save(s); renderMock(); }
      if (e.key === "ArrowLeft" && s.active.i > 0) { s.active.i--; save(s); renderMock(); }
    }
  });

  render();
})();
