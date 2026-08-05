/* Shared state and the blueprint spine.
 *
 * Loaded by every guide page and by the simulator, so both halves read and write one
 * object. The simulator keeps a small per-section tally; guide pages only read it, which
 * is why they never have to load the 545 KB question bank to draw the spine.
 *
 * Storage is localStorage, which does work at the file:// origin (fetch and XHR do not).
 */
(function (w) {
  "use strict";

  var KEY = "splk1002.progress";
  var THEME_KEY = "splk1002.theme";

  // The ten blueprint sections. Widths in the spine are these weights.
  var SECTIONS = [
    { grp: "1",  id: "1.0",  short: "Transforming commands",         weight: 5,  page: "topics/01-transforming-commands" },
    { grp: "2",  id: "2.0",  short: "Filtering and formatting",      weight: 10, page: "topics/02-filtering-and-formatting" },
    { grp: "3",  id: "3.0",  short: "Correlating events",            weight: 15, page: "topics/03-correlating-events" },
    { grp: "4",  id: "4.0",  short: "Field extractions",             weight: 10, page: "topics/04-field-extractions" },
    { grp: "5",  id: "5.0",  short: "Aliases and calculated fields", weight: 10, page: "topics/05-aliases-and-calculated-fields" },
    { grp: "6",  id: "6.0",  short: "Tags and event types",          weight: 10, page: "topics/06-tags-and-event-types" },
    { grp: "7",  id: "7.0",  short: "Macros",                        weight: 10, page: "topics/07-macros" },
    { grp: "8",  id: "8.0",  short: "Workflow actions",              weight: 10, page: "topics/08-workflow-actions" },
    { grp: "9",  id: "9.0",  short: "Data models and pivot",         weight: 10, page: "topics/09-data-models-and-pivot" },
    { grp: "10", id: "10.0", short: "CIM",                           weight: 10, page: "topics/10-cim" }
  ];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function write(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  function state() {
    var s = read();
    s.read = s.read || {};       // page stem -> timestamp
    s.sec = s.sec || {};         // section group -> {r: right, w: wrong}
    return s;
  }

  var SPLK = {
    SECTIONS: SECTIONS,
    state: state,

    /* A topic page marks itself read on load. Cram sheets do not count: the point of the
       mark is "I have worked through this section", not "I glanced at the summary". */
    markRead: function (stem) {
      if (!stem || stem.indexOf("topics/") !== 0) return;
      var s = state();
      if (!s.read[stem]) { s.read[stem] = Date.now(); write(s); }
    },

    /* Called by the simulator for every answered question. */
    recordAnswer: function (grp, correct) {
      if (!grp) return;
      var s = state();
      var b = s.sec[grp] || (s.sec[grp] = { r: 0, w: 0 });
      if (correct) b.r++; else b.w++;
      write(s);
    },

    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} },

    /* Overall readiness: accuracy weighted by each section's share of the exam, counting
       only sections that have been drilled. Reported honestly as coverage plus accuracy
       rather than as a single number pretending to predict a pass. */
    summary: function () {
      var s = state(), right = 0, wrong = 0, drilled = 0, readCount = 0;
      SECTIONS.forEach(function (sec) {
        var b = s.sec[sec.grp];
        if (b && (b.r + b.w) > 0) { drilled++; right += b.r; wrong += b.w; }
        if (s.read[sec.page]) readCount++;
      });
      return {
        read: readCount, total: SECTIONS.length, drilled: drilled,
        right: right, wrong: wrong,
        accuracy: (right + wrong) ? Math.round(right * 100 / (right + wrong)) : null
      };
    },

    /* Render the spine into `mount`.
       opts: {current: "3", prefix: "../", mode: "guide"|"exam"} */
    spine: function (mount, opts) {
      if (!mount) return;
      opts = opts || {};
      var s = state();
      var sum = SPLK.summary();
      var prefix = opts.prefix || "";

      var head = document.createElement("div");
      head.className = "spine-head";
      var t = document.createElement("span");
      t.className = "spine-title";
      t.textContent = "Blueprint";
      var stat = document.createElement("span");
      stat.className = "spine-stat";
      stat.innerHTML = sum.accuracy === null
        ? sum.read + " / " + sum.total + " read"
        : sum.read + " / " + sum.total + " read &middot; <b>" + sum.accuracy + "%</b> of " + (sum.right + sum.wrong);
      head.appendChild(t); head.appendChild(stat);

      var track = document.createElement("div");
      track.className = "spine-track";
      track.setAttribute("role", "list");

      SECTIONS.forEach(function (sec) {
        var b = s.sec[sec.grp];
        var answered = b ? b.r + b.w : 0;
        var acc = answered ? Math.round(b.r * 100 / answered) : 0;
        var isRead = !!s.read[sec.page];

        var a = document.createElement("a");
        a.className = "spine-seg" + (isRead ? " is-read" : "");
        a.style.flex = sec.weight + " 1 0";
        a.href = prefix + sec.page + ".html";
        a.setAttribute("role", "listitem");
        if (opts.current === sec.grp) a.setAttribute("aria-current", "true");
        a.setAttribute("aria-label",
          sec.id + " " + sec.short + ", " + sec.weight + "% of the exam" +
          (isRead ? ", read" : ", not yet read") +
          (answered ? ", " + acc + "% correct across " + answered + " questions" : ", not yet drilled"));
        a.title = a.getAttribute("aria-label");

        if (answered) {
          var fill = document.createElement("span");
          fill.className = "spine-fill";
          fill.style.height = Math.max(acc, 4) + "%";
          a.appendChild(fill);
        }
        var num = document.createElement("span");
        num.className = "spine-num";
        num.textContent = sec.grp;
        a.appendChild(num);
        track.appendChild(a);
      });

      var legend = document.createElement("div");
      legend.className = "spine-legend";
      legend.innerHTML =
        '<span><i style="background:var(--spine-read)"></i>read</span>' +
        '<span><i style="background:var(--accent)"></i>accuracy</span>' +
        '<span><i style="background:var(--spine-idle)"></i>untouched</span>';

      mount.innerHTML = "";
      mount.appendChild(head);
      mount.appendChild(track);
      mount.appendChild(legend);
    },

    /* Theme. Paper is the default; the choice is remembered and applies to both halves. */
    theme: {
      get: function () {
        try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
      },
      set: function (v) {
        try { localStorage.setItem(THEME_KEY, v); } catch (e) {}
        document.documentElement.setAttribute("data-theme", v);
        w.dispatchEvent(new CustomEvent("splk:theme", { detail: v }));
      },
      toggle: function () {
        var cur = document.documentElement.getAttribute("data-theme");
        if (!cur) {
          cur = w.matchMedia && w.matchMedia("(prefers-color-scheme: dark)").matches ? "ink" : "paper";
        }
        SPLK.theme.set(cur === "ink" ? "paper" : "ink");
      },
      wire: function (btn) {
        if (!btn) return;
        function label() {
          var dark = document.documentElement.getAttribute("data-theme") === "ink";
          btn.setAttribute("aria-label", dark ? "Switch to paper mode" : "Switch to ink mode");
          btn.setAttribute("aria-pressed", dark ? "true" : "false");
        }
        btn.addEventListener("click", function () { SPLK.theme.toggle(); label(); });
        label();
      }
    }
  };

  w.SPLK = SPLK;
})(window);
