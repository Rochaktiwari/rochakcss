/*!
 * rochakcss v2.0.0
 * A lightweight utility-first CSS framework — r-* prefix edition
 *
 * Drop this single file into any HTML page:
 *   <script src="rochak.js"></script>
 *
 * Then use r-* classes on any element:
 *   <div class="r-flex r-items-center r-gap-4 r-p-6 r-bg-#1e293b r-rounded-3">
 *     <p class="r-text-18 r-weight-bold r-color-#f5c542">Hello!</p>
 *   </div>
 *
 * All four source modules (config, parser, applier, index) are inlined
 * below inside a single IIFE so they share scope without polluting globals.
 */

(function (global) {
  "use strict";

  /* ═══════════════════════════════════════════════════════════════════════
     MODULE 1 — CONFIG
     Source: src/config.js
     Defines the three lookup tables used by the parser.
  ═══════════════════════════════════════════════════════════════════════ */

  /* Scale factor: numeric class value × SCALE = pixels */
  var SCALE = 4;

  /* 1a. Static styles: exact class → style object */
  var staticStyles = {
    /* ── Display ── */
    "r-flex":         { display: "flex" },
    "r-grid":         { display: "grid" },
    "r-block":        { display: "block" },
    "r-inline":       { display: "inline" },
    "r-inline-block": { display: "inline-block" },
    "r-hidden":       { display: "none" },

    /* ── Flex shorthands ── */
    "r-center":       { display: "flex", justifyContent: "center", alignItems: "center" },
    "r-dir-row":      { flexDirection: "row" },
    "r-dir-col":      { flexDirection: "column" },
    "r-wrap-yes":     { flexWrap: "wrap" },
    "r-wrap-no":      { flexWrap: "nowrap" },

    /* ── Alignment (static) ── */
    "r-items-center":    { alignItems: "center" },
    "r-items-start":     { alignItems: "flex-start" },
    "r-items-end":       { alignItems: "flex-end" },
    "r-items-stretch":   { alignItems: "stretch" },
    "r-justify-center":  { justifyContent: "center" },
    "r-justify-start":   { justifyContent: "flex-start" },
    "r-justify-end":     { justifyContent: "flex-end" },
    "r-justify-between": { justifyContent: "space-between" },
    "r-justify-around":  { justifyContent: "space-around" },

    /* ── Position ── */
    "r-relative": { position: "relative" },
    "r-absolute": { position: "absolute" },
    "r-fixed":    { position: "fixed" },
    "r-sticky":   { position: "sticky", top: "0" },

    /* ── Sizing shorthands ── */
    "r-w-full":      { width: "100%" },
    "r-w-half":      { width: "50%" },
    "r-w-auto":      { width: "auto" },
    "r-h-full":      { height: "100%" },
    "r-h-screen":    { height: "100vh" },
    "r-h-auto":      { height: "auto" },
    "r-full-screen": { width: "100vw", height: "100vh" },

    /* ── Margin auto ── */
    "r-m-auto":  { margin: "auto" },
    "r-mx-auto": { marginLeft: "auto", marginRight: "auto" },

    /* ── Typography ── */
    "r-italic":       { fontStyle: "italic" },
    "r-not-italic":   { fontStyle: "normal" },
    "r-underline":    { textDecoration: "underline" },
    "r-line-through": { textDecoration: "line-through" },
    "r-no-underline": { textDecoration: "none" },
    "r-uppercase":    { textTransform: "uppercase" },
    "r-lowercase":    { textTransform: "lowercase" },
    "r-capitalize":   { textTransform: "capitalize" },

    /* ── Overflow ── */
    "r-overflow-hidden": { overflow: "hidden" },
    "r-overflow-auto":   { overflow: "auto" },
    "r-overflow-scroll": { overflow: "scroll" },

    /* ── Cursor ── */
    "r-pointer":        { cursor: "pointer" },
    "r-cursor-default": { cursor: "default" },
    "r-no-pointer":     { pointerEvents: "none" },

    /* ── Effects ── */
    "r-glass": {
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      backgroundColor: "rgba(255,255,255,0.08)"
    },

    /* ── Transitions ── */
    "r-transition-fast":   { transition: "all 150ms ease-in-out" },
    "r-transition-normal": { transition: "all 350ms ease-in-out" },
    "r-transition-slow":   { transition: "all 800ms ease-in-out" },
    "r-transition-ultra":  { transition: "all 2000ms ease-in-out" },
  };

  /* 1b. Spacing prefixes → CSS property (or array of properties) */
  var spacing = {
    "r-p":  "padding",
    "r-pt": "paddingTop",
    "r-pb": "paddingBottom",
    "r-pl": "paddingLeft",
    "r-pr": "paddingRight",
    "r-px": ["paddingLeft", "paddingRight"],
    "r-py": ["paddingTop",  "paddingBottom"],
    "r-m":  "margin",
    "r-mt": "marginTop",
    "r-mb": "marginBottom",
    "r-ml": "marginLeft",
    "r-mr": "marginRight",
    "r-mx": ["marginLeft",  "marginRight"],
    "r-my": ["marginTop",   "marginBottom"],
  };

  /* 1c. Sizing prefixes → CSS property */
  var sizing = {
    "r-w":     "width",
    "r-h":     "height",
    "r-min-w": "minWidth",
    "r-max-w": "maxWidth",
    "r-min-h": "minHeight",
    "r-max-h": "maxHeight",
  };

  /* 1d. Value maps */
  var weightMap = {
    thin:      "100",
    light:     "300",
    normal:    "400",
    medium:    "500",
    semibold:  "600",
    bold:      "700",
    extrabold: "800",
    heavy:     "900",
  };

  var justifyMap = {
    center:  "center",
    start:   "flex-start",
    end:     "flex-end",
    between: "space-between",
    around:  "space-around",
    evenly:  "space-evenly",
  };

  var alignMap = {
    center:   "center",
    start:    "flex-start",
    end:      "flex-end",
    stretch:  "stretch",
    baseline: "baseline",
  };

  /* ═══════════════════════════════════════════════════════════════════════
     MODULE 2 — PARSER
     Source: src/parser.js
     Pure function: class name string → style object | null
  ═══════════════════════════════════════════════════════════════════════ */

  function toPx(n) {
    return (Number(n) * SCALE) + "px";
  }

  function parseClass(className) {
    /* Quick bail-out */
    if (typeof className !== "string" || className.slice(0, 2) !== "r-") return null;

    /* 1. Exact static match */
    if (staticStyles[className]) return staticStyles[className];

    /* Split at last "-" */
    var lastDash = className.lastIndexOf("-");
    if (lastDash === -1) return null;

    var prefix = className.slice(0, lastDash);   // e.g. "r-px"
    var value  = className.slice(lastDash + 1);  // e.g. "4"
    var num    = Number(value);
    var isNum  = value !== "" && !isNaN(num);
    var v      = value.toLowerCase();

    /* 2. Spacing */
    if (spacing[prefix]) {
      var props = spacing[prefix];
      var px    = toPx(num);
      var s     = {};
      if (Array.isArray(props)) {
        for (var i = 0; i < props.length; i++) s[props[i]] = px;
      } else {
        s[props] = px;
      }
      return s;
    }

    /* 3. Sizing */
    if (sizing[prefix]) {
      return { [sizing[prefix]]: isNum ? toPx(num) : value };
    }

    /* 4. Dynamic switch */
    switch (prefix) {

      /* ── Typography ── */
      case "r-text":
        return { fontSize: isNum ? num + "px" : v };

      case "r-weight":
        return { fontWeight: weightMap[v] || v };

      case "r-leading":
        return { lineHeight: isNum ? num : v };

      case "r-spacing":
        return { letterSpacing: num + "px" };  /* direct px, no scale */

      case "r-align":
        return { textAlign: v };

      /* ── Color ── */
      case "r-color":
        return { color: value };               /* keep original (hex case) */

      case "r-bg":
        return { backgroundColor: value };

      /* ── Flexbox (dynamic) ── */
      case "r-gap":
        return { gap: toPx(num) };

      case "r-gap-x":
        return { columnGap: toPx(num) };

      case "r-gap-y":
        return { rowGap: toPx(num) };

      case "r-justify":
        return { justifyContent: justifyMap[v] || v };

      case "r-items":
        return { alignItems: alignMap[v] || v };

      case "r-grow":
        return { flexGrow: num };

      case "r-shrink":
        return { flexShrink: num };

      case "r-flex":
        return isNum ? { flex: num } : null;

      /* ── Positioning ── */
      case "r-pos":    return { position: v };
      case "r-top":    return { top:    toPx(num) };
      case "r-bottom": return { bottom: toPx(num) };
      case "r-left":   return { left:   toPx(num) };
      case "r-right":  return { right:  toPx(num) };
      case "r-z":      return { zIndex: num };

      /* ── Effects ── */
      case "r-shadow":
        return {
          boxShadow:
            "0 " + (num * 2) + "px " + (num * 4) + "px rgba(0,0,0,0.25)," +
            "0 " + num + "px " + (num * 2) + "px rgba(0,0,0,0.15)"
        };

      case "r-opacity":
        return { opacity: num / 10 };          /* r-opacity-7 → 0.7 */

      case "r-blur":
        return { filter: "blur(" + num + "px)" };

      case "r-bright":
        return { filter: "brightness(" + (num / 10) + ")" };

      case "r-rounded":
        return { borderRadius: v === "full" ? "9999px" : toPx(num) };

      case "r-border":
        return { border: num + "px solid rgba(255,255,255,0.15)" };

      case "r-overflow":
        return { overflow: v };

      case "r-transition":
        return { transition: "all " + (isNum ? num + "ms" : v) + " ease-in-out" };

      default:
        return null;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     MODULE 3 — APPLIER
     Source: src/applier.js
     Walks the DOM and assigns inline styles via parseClass().
  ═══════════════════════════════════════════════════════════════════════ */

  function applyToElement(el) {
    var classList = el.classList;
    for (var i = 0; i < classList.length; i++) {
      var styles = parseClass(classList[i]);
      if (styles) Object.assign(el.style, styles);
    }
  }

  function scanDom() {
    var elements = document.querySelectorAll("[class]");
    for (var i = 0; i < elements.length; i++) {
      applyToElement(elements[i]);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     MODULE 4 — INDEX  (entry point)
     Source: src/index.js
     Boots the library: runs scanDom, starts the MutationObserver.
  ═══════════════════════════════════════════════════════════════════════ */

  function startObserver() {
    if (typeof MutationObserver === "undefined") return;

    var observer = new MutationObserver(function () {
      scanDom();
    });

    observer.observe(document.body, {
      childList:       true,
      subtree:         true,
      attributes:      true,
      attributeFilter: ["class"],
    });
  }

  function init() {
    scanDom();
    startObserver();
    console.log("Rochak CSS \u26A1 Applied Successfully!");
  }

  function refresh() {
    scanDom();
  }

  /* ── Expose public API as window.rochak ─────────────────────────────── */
  global.rochak = {
    init:      init,
    refresh:   refresh,
    parse:     parseClass,
    getConfig: function () {
      return { staticStyles: staticStyles, spacing: spacing, sizing: sizing };
    },
  };

  /* ── Auto-start when the DOM is ready ──────────────────────────────── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})(typeof window !== "undefined" ? window : this);