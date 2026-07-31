// Mermaid, loaded from the CDN.
//
// This is deliberately a CLASSIC script, not a module. External ES modules are blocked at
// the file:// origin by the same rule that blocks fetch, so `<script type="module" src>`
// silently does nothing when the page is opened from disk. A classic script may still
// dynamic-import an https URL, which is what happens below.
//
// If the CDN does not resolve, each .mermaid element keeps its source text, styled as a
// monospace block, which stays readable offline.
//
// Two defects this file exists to avoid. Rendering inflates the document, so a deep link
// applied before render settles thousands of pixels past its target; the fragment is
// re-applied afterwards. And a theme toggle used to leave a light diagram in a dark page,
// so the source is stashed and re-rendered on demand.

(function () {
  "use strict";

  var nodes = [].slice.call(document.querySelectorAll(".mermaid"));
  if (!nodes.length) return;
  nodes.forEach(function (n) { n.dataset.src = n.textContent; });

  var mermaid = null;

  function render() {
    var css = getComputedStyle(document.documentElement);
    function v(name, fallback) { return (css.getPropertyValue(name) || fallback).trim(); }

    var load = mermaid
      ? Promise.resolve(mermaid)
      : import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs")
          .then(function (m) { mermaid = m.default; return mermaid; });

    return load.then(function (mm) {
      mm.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          background:         v("--paper-raised", "#fff"),
          primaryColor:       v("--paper-sunk", "#eee"),
          primaryTextColor:   v("--ink", "#111"),
          primaryBorderColor: v("--rule-strong", "#999"),
          lineColor:          v("--ink-faint", "#777"),
          secondaryColor:     v("--paper-sunk", "#eee"),
          tertiaryColor:      v("--paper-raised", "#fff"),
          fontFamily: "ui-monospace, Consolas, monospace",
          fontSize: "13px"
        },
        flowchart: { curve: "basis", useMaxWidth: true }
      });
      nodes.forEach(function (n) {
        n.removeAttribute("data-processed");
        n.textContent = n.dataset.src;
      });
      return mm.run({ nodes: nodes });
    }).then(function () {
      // the diagrams have changed the page height, so the fragment needs re-applying
      document.querySelectorAll(".mermaid-wrap").forEach(function (w) { w.style.minHeight = ""; });
      if (location.hash) {
        var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (t) t.scrollIntoView({ block: "start", behavior: "auto" });
      }
      window.dispatchEvent(new Event("resize"));   // progress bar recomputes
    });
  }

  render()
    .then(function () { window.__rerenderMermaid = render; })
    .catch(function (e) {
      console.warn("Mermaid unavailable, showing diagram source.", e);
      document.querySelectorAll(".mermaid-wrap").forEach(function (w) { w.style.minHeight = ""; });
    });
})();
