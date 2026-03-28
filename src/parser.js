/**
 * parser.js
 * Responsibility: Take ONE class name string and return a style object,
 * or null if the class is not a rochakcss utility.
 *
 * All recognised classes start with "r-".
 * The function never touches the DOM — it is a pure data transformer.
 *
 * Resolution order:
 *   1. Quick bail-out  – does it start with "r-"?
 *   2. staticStyles    – exact match in config.staticStyles
 *   3. spacing map     – prefix found in config.spacing
 *   4. sizing map      – prefix found in config.sizing
 *   5. dynamic switch  – parse prefix + value and build the style
 */

const {
  staticStyles,
  spacing,
  sizing,
  weightMap,
  justifyMap,
  alignMap,
} = require("./config");

/* Scale factor: numeric value × SCALE = pixels */
const SCALE = 4;

/**
 * Convert a value string to a pixel string using the scale factor.
 * e.g. "4" → "16px",  "0" → "0px"
 * @param {string|number} n
 * @returns {string}
 */
function toPx(n) {
  return `${Number(n) * SCALE}px`;
}

/**
 * Parse a single rochakcss class name.
 *
 * @param {string} className  - e.g. "r-p-4", "r-bg-#3b82f6", "r-text-18"
 * @returns {Object|null}     - CSS style object, or null if unrecognised
 */
function parseClass(className) {
  // ── Quick bail-out ──────────────────────────────────────────────────────
  // All rochakcss classes must start with "r-"
  if (!className.startsWith("r-")) return null;

  // ── 1. Static exact-match lookup ────────────────────────────────────────
  if (staticStyles[className]) return staticStyles[className];

  // ── Split: prefix = everything up to the last "-", value = last segment ─
  // Example: "r-px-4"   → prefix="r-px",  value="4"
  //          "r-bg-#fff"→ prefix="r-bg",  value="#fff"
  //          "r-text-xl"→ prefix="r-text",value="xl"
  const lastDash = className.lastIndexOf("-");
  if (lastDash === -1) return null;          // no dash after "r-" → unknown

  const prefix = className.slice(0, lastDash);   // e.g. "r-px"
  const value  = className.slice(lastDash + 1);  // e.g. "4"
  const num    = Number(value);
  const isNum  = !isNaN(num) && value !== "";
  const v      = value.toLowerCase();            // lowercase alias for maps

  // ── 2. Spacing prefixes (r-p, r-px, r-mt, etc.) ─────────────────────────
  if (spacing[prefix]) {
    const props = spacing[prefix];              // string or string[]
    const px    = toPx(num);
    const styles = {};
    if (Array.isArray(props)) {
      props.forEach(p => { styles[p] = px; });
    } else {
      styles[props] = px;
    }
    return styles;
  }

  // ── 3. Sizing prefixes (r-w, r-h, r-max-w, etc.) ───────────────────────
  if (sizing[prefix]) {
    // Numeric → scale to px; non-numeric (e.g. "full", "50%") → use as-is
    return { [sizing[prefix]]: isNum ? toPx(num) : value };
  }

  // ── 4. Dynamic prefix switch ─────────────────────────────────────────────
  // Each case handles one r-{prefix}-{value} pattern
  switch (prefix) {

    /* Typography */
    case "r-text":
      // r-text-14 → fontSize: "14px"
      return { fontSize: isNum ? `${num}px` : v };

    case "r-weight":
      // r-weight-bold → fontWeight: "700"
      return { fontWeight: weightMap[v] || v };

    case "r-leading":
      // r-leading-2 → lineHeight: 2  (unitless multiplier)
      return { lineHeight: isNum ? num : v };

    case "r-spacing":
      // r-spacing-2 → letterSpacing: "2px"  (NOT scaled — direct px)
      return { letterSpacing: `${num}px` };

    case "r-align":
      // r-align-center → textAlign: "center"
      return { textAlign: v };

    /* Color */
    case "r-color":
      // r-color-#ff0000 or r-color-red
      // Keep original value (not lowercased) to preserve hex case
      return { color: value };

    case "r-bg":
      // r-bg-#f5c542 or r-bg-red
      return { backgroundColor: value };

    /* Flexbox (dynamic) */
    case "r-gap":
      // r-gap-4 → gap: "16px"
      return { gap: toPx(num) };

    case "r-gap-x":
      return { columnGap: toPx(num) };

    case "r-gap-y":
      return { rowGap: toPx(num) };

    case "r-justify":
      // r-justify-between → justifyContent: "space-between"
      return { justifyContent: justifyMap[v] || v };

    case "r-items":
      // r-items-center → alignItems: "center"
      return { alignItems: alignMap[v] || v };

    case "r-grow":
      return { flexGrow: num };

    case "r-shrink":
      return { flexShrink: num };

    case "r-flex":
      // r-flex-1 → flex: 1
      return isNum ? { flex: num } : null;

    /* Positioning */
    case "r-pos":
      return { position: v };

    case "r-top":    return { top:    toPx(num) };
    case "r-bottom": return { bottom: toPx(num) };
    case "r-left":   return { left:   toPx(num) };
    case "r-right":  return { right:  toPx(num) };
    case "r-z":      return { zIndex: num };

    /* Visual effects */
    case "r-shadow":
      // r-shadow-4 → layered box-shadow scaled by n
      return {
        boxShadow: `0 ${num * 2}px ${num * 4}px rgba(0,0,0,0.25), 0 ${num}px ${num * 2}px rgba(0,0,0,0.15)`
      };

    case "r-opacity":
      // r-opacity-5 → opacity: 0.5  (value ÷ 10)
      return { opacity: num / 10 };

    case "r-blur":
      // r-blur-8 → filter: blur(8px)  (direct px, no scaling)
      return { filter: `blur(${num}px)` };

    case "r-bright":
      // r-bright-12 → filter: brightness(1.2)
      return { filter: `brightness(${num / 10})` };

    case "r-rounded":
      // r-rounded-full → 9999px;  r-rounded-2 → 8px
      return { borderRadius: v === "full" ? "9999px" : toPx(num) };

    case "r-border":
      // r-border-1 → border: 1px solid rgba(white,0.15)
      return { border: `${num}px solid rgba(255,255,255,0.15)` };

    case "r-overflow":
      return { overflow: v };

    case "r-transition":
      // r-transition-300 → transition: all 300ms ease-in-out
      return { transition: `all ${isNum ? num + "ms" : v} ease-in-out` };

    default:
      return null;  // unknown class → silently ignored
  }
}

// Export
if (typeof module !== "undefined") {
  module.exports = { parseClass };
}