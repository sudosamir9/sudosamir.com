/* Guide page behaviour. No framework, no build step, nothing fetched at read time.
 * Depends on progress.js for shared state and the blueprint spine.
 */
(function () {
  "use strict";

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var body = document.body;

  // every asset is referenced relative to the page, so derive the depth once
  var prefix = (function () {
    var link = $('link[href$="theme.css"]');
    var h = link ? link.getAttribute("href") : "theme.css";
    return h.slice(0, h.length - "theme.css".length);
  })();

  // ---------------------------------------------------------------- shared state

  function drawSpine() {
    if (!window.SPLK) return;
    SPLK.spine($("#spine"), { current: body.dataset.section || "", prefix: prefix });
  }
  if (window.SPLK) {
    SPLK.markRead(body.dataset.page || "");
    drawSpine();
    SPLK.theme.wire($("#theme"));
    addEventListener("splk:theme", function () {
      drawSpine();
      if (window.__rerenderMermaid) window.__rerenderMermaid();
    });
  }

  // ---------------------------------------------------------------- reading progress

  var readbar = $("#readbar");
  if (readbar) {
    var barTick = false;
    var updateBar = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      readbar.style.width = (max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0) + "%";
      barTick = false;
    };
    addEventListener("scroll", function () {
      if (!barTick) { barTick = true; requestAnimationFrame(updateBar); }
    }, { passive: true });
    addEventListener("resize", updateBar, { passive: true });
    updateBar();
  }

  // ---------------------------------------------------------------- scrollspy

  var links = $$(".toc a");
  if (links.length) {
    var targets = links.map(function (a) {
      return { a: a, el: document.getElementById(decodeURIComponent(a.hash.slice(1))) };
    }).filter(function (t) { return t.el; });

    var spyTick = false;
    var spy = function () {
      var y = scrollY + 140, cur = targets[0];
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].el.getBoundingClientRect().top + scrollY <= y) cur = targets[i]; else break;
      }
      targets.forEach(function (t) { t.a.classList.toggle("on", t === cur); });
      spyTick = false;
    };
    addEventListener("scroll", function () {
      if (!spyTick) { spyTick = true; requestAnimationFrame(spy); }
    }, { passive: true });
    spy();
  }

  // ---------------------------------------------------------------- copy SPL

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (e) {}
    document.body.removeChild(ta);
  }
  $$(".spl-copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pre = document.getElementById(btn.dataset.copy);
      if (!pre) return;
      var text = pre.textContent;          // the query itself, not the highlight markup
      var done = function () {
        btn.textContent = "Copied"; btn.classList.add("done");
        setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);          // the file:// origin has no async clipboard
      }
    });
  });

  // ---------------------------------------------------------------- search

  var wrap = $("#searchwrap"), input = $("#q"), out = $("#results"), openBtn = $("#searchbtn");
  var INDEX = window.SEARCH_INDEX || [];
  var rows = [], sel = -1;

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function mark(text, terms) {
    var h = esc(text);
    terms.forEach(function (t) {
      if (!t) return;
      h = h.replace(new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>");
    });
    return h;
  }

  function render(q) {
    if (!out) return;
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    rows = []; sel = -1;
    if (!terms.length) {
      out.innerHTML = '<p class="search-empty">Search every heading, trap and SPL command in the guide.</p>';
      return;
    }
    // collect, then rank, then cap. Capping before ranking throws away the best hits.
    var hits = [];
    for (var i = 0; i < INDEX.length; i++) {
      var e = INDEX[i];
      var title = e.t.toLowerCase(), page = e.s.toLowerCase(), detail = (e.d || "").toLowerCase();
      var ok = true, score = 0;
      for (var j = 0; j < terms.length; j++) {
        var term = terms[j];
        var inT = title.indexOf(term), inP = page.indexOf(term), inD = detail.indexOf(term);
        if (inT < 0 && inP < 0 && inD < 0) { ok = false; break; }
        if (inT === 0) score += 20; else if (inT > 0) score += 12;
        if (inD >= 0) score += 3;
        if (inP >= 0) score += 2;
      }
      if (ok) {
        if (e.k === "t") score += 4;       // traps are what the exam actually tests
        hits.push({ e: e, s: score });
      }
    }
    hits.sort(function (a, b) { return b.s - a.s; });
    hits = hits.slice(0, 60);

    if (!hits.length) {
      out.innerHTML = '<p class="search-empty">Nothing matches those terms.</p>';
      return;
    }
    var html = "", lastPage = null;
    hits.forEach(function (h) {
      if (h.e.s !== lastPage) { html += '<div class="res-group">' + esc(h.e.s) + "</div>"; lastPage = h.e.s; }
      html += '<a class="res" href="' + prefix + esc(h.e.u) + '" role="option">' +
              "<b>" + mark(h.e.t, terms) + "</b>" +
              (h.e.d ? "<span>" + mark(h.e.d.slice(0, 160), terms) + "</span>" : "") + "</a>";
    });
    out.innerHTML = html;
    rows = $$(".res", out);
  }

  function openSearch() {
    if (!wrap) return;
    wrap.hidden = false; input.value = ""; render(""); input.focus();
  }
  function closeSearch() {
    if (!wrap) return;
    wrap.hidden = true; sel = -1;
    if (openBtn) openBtn.focus();
  }
  function move(d) {
    if (!rows.length) return;
    if (sel >= 0) rows[sel].classList.remove("sel");
    sel = (sel + d + rows.length) % rows.length;
    rows[sel].classList.add("sel");
    rows[sel].scrollIntoView({ block: "nearest" });
  }

  if (openBtn) openBtn.addEventListener("click", openSearch);
  if (input) input.addEventListener("input", function () { render(input.value); });
  if (wrap) wrap.addEventListener("click", function (e) { if (e.target === wrap) closeSearch(); });

  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
    if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault(); openSearch(); return;
    }
    if (!wrap || wrap.hidden) return;
    if (e.key === "Escape") { e.preventDefault(); closeSearch(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter" && sel >= 0) { e.preventDefault(); rows[sel].click(); }
  });
})();
