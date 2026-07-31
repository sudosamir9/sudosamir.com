// Copy buttons, scrollspy, theme toggle. No framework, no build step.

(function () {
  "use strict";

  // --- copy the SPL, not the highlighting markup ---
  document.querySelectorAll(".spl-copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pre = document.getElementById(btn.dataset.copy);
      if (!pre) return;
      var text = pre.innerText.replace(/ /g, " ");
      var done = function () {
        btn.textContent = "Copied";
        btn.classList.add("done");
        setTimeout(function () {
          btn.textContent = "Copy";
          btn.classList.remove("done");
        }, 1400);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
      function fallback() {
        // file:// has no async clipboard, so fall back to a hidden textarea
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:absolute;left:-9999px";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { btn.textContent = "Ctrl+C"; }
        document.body.removeChild(ta);
      }
    });
  });

  // --- scrollspy + progress, one rAF handler ---
  // An IntersectionObserver with rootMargin "0px 0px -70%" leaves a 394px band against
  // sections averaging 1700px, so it was empty most of the time and the highlight moved
  // twice in fourteen sections. A scroll scan always has an answer.
  var links = Array.prototype.slice.call(document.querySelectorAll("nav.toc a"));
  var targets = links
    .map(function (a) { return document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1))); })
    .filter(Boolean);
  var bar = document.getElementById("progress");
  var rail = document.querySelector("nav.toc");
  var queued = false;

  function paint() {
    queued = false;
    var h = document.documentElement;
    if (bar) {
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
    if (!targets.length) return;
    var line = h.scrollTop + 120, cur = targets[0];
    for (var i = 0; i < targets.length; i++) {
      if (targets[i].getBoundingClientRect().top + h.scrollTop <= line) cur = targets[i];
    }
    // at the very bottom, the last section wins even if it never crosses the line
    if (h.scrollTop + h.clientHeight >= h.scrollHeight - 4) cur = targets[targets.length - 1];
    links.forEach(function (a) {
      var on = decodeURIComponent(a.getAttribute("href").slice(1)) === cur.id;
      a.classList.toggle("active", on);
      if (on) { a.setAttribute("aria-current", "location"); } else { a.removeAttribute("aria-current"); }
    });
    if (rail) {
      var a = rail.querySelector("a.active");
      if (a) {
        var r = a.getBoundingClientRect(), rr = rail.getBoundingClientRect();
        if (r.top < rr.top || r.bottom > rr.bottom) a.scrollIntoView({ block: "nearest" });
      }
    }
  }
  function tick() { if (!queued) { queued = true; requestAnimationFrame(paint); } }
  addEventListener("scroll", tick, { passive: true });
  addEventListener("resize", tick);
  document.addEventListener("toggle", tick, true);   // <details> changes the height
  tick();

  // --- cross-page search over the inlined index ---
  var q = document.getElementById("q");
  var box = document.getElementById("results");
  var INDEX = window.SEARCH_INDEX || [];
  // index urls are site-root relative, so a page in a subfolder needs a prefix
  var PREFIX = (document.querySelector('link[rel="stylesheet"]') || {}).getAttribute
    ? document.querySelector('link[rel="stylesheet"]').getAttribute("href").replace(/theme\.css$/, "")
    : "";
  if (q && box) {
    var sel = -1, rows = [];

    var close = function () {
      box.hidden = true; box.innerHTML = ""; rows = []; sel = -1;
      q.setAttribute("aria-expanded", "false");
    };

    var run = function () {
      var raw = q.value.trim().toLowerCase();
      if (raw.length < 2) return close();
      var terms = raw.split(/\s+/).filter(Boolean);
      var hits = [];
      // Collect everything, then rank, then cap. Capping first discarded exact matches
      // that happened to sit late in the index.
      for (var i = 0; i < INDEX.length; i++) {
        var e = INDEX[i];
        var title = e.t.toLowerCase();
        var hay = title + " " + (e.d || "").toLowerCase() + " " + e.s.toLowerCase();
        var ok = true, best = 9999;
        for (var k = 0; k < terms.length; k++) {
          var at = hay.indexOf(terms[k]);
          if (at === -1) { ok = false; break; }
          if (at < best) best = at;
        }
        if (!ok) continue;
        var lead = title.indexOf(terms[0]);
        var rank = (title === raw ? 0 : lead === 0 ? 1 : lead > -1 ? 2 : 3) * 10000 + best;
        hits.push({ e: e, rank: rank });
      }
      hits.sort(function (a, b) { return a.rank - b.rank; });
      var shown = hits.length;
      hits = hits.slice(0, 60);

      if (!hits.length) {
        box.innerHTML = '<p class="sr-empty">No match in any section.</p>';
        box.hidden = false; rows = []; sel = -1;
        q.setAttribute("aria-expanded", "true");
        return;
      }
      var html = "", lastSec = null;
      hits.forEach(function (h) {
        var e = h.e;
        if (e.s !== lastSec) { html += '<p class="sr-group">' + esc(e.s) + "</p>"; lastSec = e.s; }
        var kind = e.k === "t" ? " sr-trap" : e.k === "c" ? " sr-cmd" : "";
        html += '<a class="sr-item' + kind + '" href="' + PREFIX + e.u + '" role="option">' +
                '<span class="sr-top"><span class="sr-title">' + esc(e.t) + "</span></span>" +
                (e.d ? '<span class="sr-desc">' + esc(e.d) + "</span>" : "") + "</a>";
      });
      if (shown > hits.length) {
        html += '<p class="sr-empty">' + (shown - hits.length) + " more matches, narrow the search.</p>";
      }
      box.innerHTML = html;
      box.hidden = false;
      q.setAttribute("aria-expanded", "true");
      rows = Array.prototype.slice.call(box.querySelectorAll(".sr-item"));
      sel = rows.length ? 0 : -1;
      if (sel === 0) rows[0].classList.add("sel");
    };

    var esc = function (s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    };

    var move = function (d) {
      if (!rows.length) return;
      if (sel > -1) rows[sel].classList.remove("sel");
      sel = (sel + d + rows.length) % rows.length;
      rows[sel].classList.add("sel");
      rows[sel].scrollIntoView({ block: "nearest" });
    };

    q.addEventListener("input", run);
    q.addEventListener("focus", function () { if (q.value.trim().length > 1) run(); });
    q.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter" && sel > -1) { e.preventDefault(); rows[sel].click(); }
      else if (e.key === "Escape") { q.value = ""; close(); }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search")) close();
    });
    // "/" focuses search, the way most docs sites behave
    document.addEventListener("keydown", function (e) {
      var ae = document.activeElement || document.body;
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) {
        e.preventDefault(); q.focus(); q.select();
      }
    });
  }

  // --- keep the current page visible in a 43-item rail ---
  var cur = document.querySelector(".tree-item.current");
  if (cur) {
    var box2 = document.querySelector(".rail");
    if (box2 && cur.getBoundingClientRect().bottom > box2.getBoundingClientRect().bottom) {
      cur.scrollIntoView({ block: "center" });
    }
  }

  // --- theme ---
  var toggle = document.getElementById("theme");
  if (toggle) {
    var sync = function () {
      toggle.setAttribute("aria-pressed",
        document.documentElement.dataset.theme === "dark" ? "true" : "false");
    };
    sync();
    toggle.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("splk-theme", next);
      sync();
      if (window.__rerenderMermaid) window.__rerenderMermaid();
    });
  }
})();
