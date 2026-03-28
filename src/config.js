/**
 * config.js
 * Responsibility: Define the utility maps used by parser.js.
 *
 * All rochakcss classes use the "r-" prefix.
 *
 * Three kinds of entries:
 *   1. staticStyles  – exact class name → style object (no dynamic value)
 *   2. spacing       – r-p/m/px/py/… prefix → CSS property (value × 4 = px)
 *   3. sizing        – r-w/h/min-w/… prefix → CSS property (numeric → px, else raw)
 *
 * The parser.js switch handles all other dynamic prefixes
 * (r-text-*, r-bg-*, r-color-*, r-shadow-*, etc.)
 */

/* ── 1. STATIC CLASSES ──────────────────────────────────────────────────────
   Full class name → CSS style object.
   No math, no dynamic value — one class, one fixed style.
────────────────────────────────────────────────────────────────────────── */
const staticStyles = {
  /* Display */
  "r-flex":         { display: "flex" },
  "r-grid":         { display: "grid" },
  "r-block":        { display: "block" },
  "r-inline":       { display: "inline" },
  "r-inline-block": { display: "inline-block" },
  "r-hidden":       { display: "none" },

  /* Flex shorthand */
  "r-center":       { display: "flex", justifyContent: "center", alignItems: "center" },
  "r-dir-row":      { flexDirection: "row" },
  "r-dir-col":      { flexDirection: "column" },
  "r-wrap-yes":     { flexWrap: "wrap" },
  "r-wrap-no":      { flexWrap: "nowrap" },

  /* Alignment (static) */
  "r-items-center":  { alignItems: "center" },
  "r-items-start":   { alignItems: "flex-start" },
  "r-items-end":     { alignItems: "flex-end" },
  "r-items-stretch": { alignItems: "stretch" },
  "r-justify-center":  { justifyContent: "center" },
  "r-justify-start":   { justifyContent: "flex-start" },
  "r-justify-end":     { justifyContent: "flex-end" },
  "r-justify-between": { justifyContent: "space-between" },
  "r-justify-around":  { justifyContent: "space-around" },

  /* Position */
  "r-relative": { position: "relative" },
  "r-absolute": { position: "absolute" },
  "r-fixed":    { position: "fixed" },
  "r-sticky":   { position: "sticky", top: "0" },

  /* Sizing shorthands */
  "r-w-full":    { width: "100%" },
  "r-w-half":    { width: "50%" },
  "r-w-auto":    { width: "auto" },
  "r-h-full":    { height: "100%" },
  "r-h-screen":  { height: "100vh" },
  "r-h-auto":    { height: "auto" },
  "r-full-screen": { width: "100vw", height: "100vh" },

  /* Margin auto */
  "r-m-auto":  { margin: "auto" },
  "r-mx-auto": { marginLeft: "auto", marginRight: "auto" },

  /* Typography — static */
  "r-italic":       { fontStyle: "italic" },
  "r-not-italic":   { fontStyle: "normal" },
  "r-underline":    { textDecoration: "underline" },
  "r-line-through": { textDecoration: "line-through" },
  "r-no-underline": { textDecoration: "none" },
  "r-uppercase":    { textTransform: "uppercase" },
  "r-lowercase":    { textTransform: "lowercase" },
  "r-capitalize":   { textTransform: "capitalize" },

  /* Overflow */
  "r-overflow-hidden": { overflow: "hidden" },
  "r-overflow-auto":   { overflow: "auto" },
  "r-overflow-scroll": { overflow: "scroll" },

  /* Cursor */
  "r-pointer":    { cursor: "pointer" },
  "r-cursor-default": { cursor: "default" },
  "r-no-pointer": { pointerEvents: "none" },

  /* Effects */
  "r-glass": {
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    backgroundColor: "rgba(255,255,255,0.08)"
  },

  /* Transitions */
  "r-transition-fast":   { transition: "all 150ms ease-in-out" },
  "r-transition-normal": { transition: "all 350ms ease-in-out" },
  "r-transition-slow":   { transition: "all 800ms ease-in-out" },
  "r-transition-ultra":  { transition: "all 2000ms ease-in-out" },
};

/* ── 2. SPACING PREFIXES ────────────────────────────────────────────────────
   prefix → CSS property name (or array of names)
   Usage: r-p-4 → padding: 16px   (4 × 4)
          r-px-2 → paddingLeft: 8px; paddingRight: 8px
────────────────────────────────────────────────────────────────────────── */
const spacing = {
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

/* ── 3. SIZING PREFIXES ─────────────────────────────────────────────────────
   prefix → CSS property name
   If value is numeric: value × 4 → px
   If value is non-numeric (e.g. "full", "50%"): used as-is
────────────────────────────────────────────────────────────────────────── */
const sizing = {
  "r-w":     "width",
  "r-h":     "height",
  "r-min-w": "minWidth",
  "r-max-w": "maxWidth",
  "r-min-h": "minHeight",
  "r-max-h": "maxHeight",
};

/* ── 4. FONT WEIGHT MAP ─────────────────────────────────────────────────────
   Used by parser.js for r-weight-{key}
────────────────────────────────────────────────────────────────────────── */
const weightMap = {
  thin:      "100",
  light:     "300",
  normal:    "400",
  medium:    "500",
  semibold:  "600",
  bold:      "700",
  extrabold: "800",
  heavy:     "900",
};

/* ── 5. FLEX VALUE MAPS ─────────────────────────────────────────────────────
   Used by parser.js for r-justify-{v} and r-items-{v}
────────────────────────────────────────────────────────────────────────── */
const justifyMap = {
  center:  "center",
  start:   "flex-start",
  end:     "flex-end",
  between: "space-between",
  around:  "space-around",
  evenly:  "space-evenly",
};

const alignMap = {
  center:  "center",
  start:   "flex-start",
  end:     "flex-end",
  stretch: "stretch",
  baseline:"baseline",
};

// Export everything
if (typeof module !== "undefined") {
  module.exports = { staticStyles, spacing, sizing, weightMap, justifyMap, alignMap };
}