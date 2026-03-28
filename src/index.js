/**
 * index.js
 * Responsibility: Public entry point for rochakcss.
 *
 * What this file does:
 *   1. Runs scanDom() as soon as the page is ready.
 *   2. Sets up a MutationObserver so any new or changed element is
 *      automatically styled — no manual refresh needed.
 *   3. Exports a small public API for manual control if needed.
 *
 * Browser usage (via dist/rochak.js — no import needed):
 *   <script src="rochak.js"></script>
 *   <!-- rochakcss auto-starts; use r-* classes freely -->
 *
 * Node / bundler usage:
 *   const rochak = require("rochakcss");
 *   rochak.init();
 */

const { scanDom, applyToElement } = require("./applier");
const { parseClass }              = require("./parser");
const config                      = require("./config");

/* ─── MutationObserver ────────────────────────────────────────────────────
   Watch for:
   - New elements added to the DOM  (childList + subtree)
   - class attribute changes on existing elements (attributes + attributeFilter)

   When either fires, re-scan. Because scanDom() is fast (inline style
   assignment), this doesn't hurt performance on typical pages.
──────────────────────────────────────────────────────────────────────── */
function startObserver() {
  if (typeof MutationObserver === "undefined") return; // SSR / Node env guard

  const observer = new MutationObserver(function () {
    scanDom();
  });

  observer.observe(document.body, {
    childList:       true,   // watch for added/removed nodes
    subtree:         true,   // … anywhere in the tree
    attributes:      true,   // watch attribute mutations
    attributeFilter: ["class"], // only care about class changes
  });
}

/**
 * init()
 * Main entry point. Scans the DOM and starts the observer.
 * Safe to call multiple times (observer will be replaced each time,
 * but that is harmless).
 */
function init() {
  scanDom();
  startObserver();
  console.log("Rochak CSS ⚡ Applied Successfully!");
}

/**
 * refresh()
 * Manually re-scan the entire DOM.
 * Useful after large dynamic renders if you want to trigger synchronously.
 */
function refresh() {
  scanDom();
}

/**
 * parse(className)
 * Expose the parser for tooling or debug.
 * Returns the style object for a given r-* class, or null.
 * @param {string} className
 * @returns {Object|null}
 */
function parse(className) {
  return parseClass(className);
}

/**
 * getConfig()
 * Returns the full configuration object (staticStyles, spacing, sizing, …).
 * Useful for editor auto-complete plugins or documentation generators.
 * @returns {Object}
 */
function getConfig() {
  return config;
}

/* ── Auto-init in browser ─────────────────────────────────────────────── */
if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    // HTML not fully parsed yet — wait for it
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // Script loaded after DOM is ready (defer / bottom of body)
    init();
  }
}

/* ── CommonJS exports ─────────────────────────────────────────────────── */
if (typeof module !== "undefined") {
  module.exports = { init, refresh, parse, getConfig };
}