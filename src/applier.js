/**
 * applier.js
 * Responsibility: Walk the DOM and apply styles to elements that carry
 * rochakcss (r-*) utility classes.
 *
 * Strategy:
 *   Instead of injecting a <style> tag (which can conflict with specificity),
 *   rochakcss v2 sets inline styles directly via Object.assign(el.style, …).
 *   This means every r-* class is processed individually per element.
 *
 * API exported:
 *   applyToElement(el)  – process one element
 *   scanDom()           – process every element in the current document
 */

const { parseClass } = require("./parser");

/**
 * Apply all recognised r-* classes to a single element.
 * Unrecognised class names are silently skipped.
 *
 * @param {Element} el
 */
function applyToElement(el) {
  // el.classList is a DOMTokenList; iterate each class token
  el.classList.forEach(function (cls) {
    const styles = parseClass(cls);
    if (styles) {
      // Object.assign merges style properties onto the element's inline style
      Object.assign(el.style, styles);
    }
  });
}

/**
 * Scan every element in the document that has at least one class attribute
 * and apply rochakcss styles to it.
 *
 * Called once on load, and again by the MutationObserver in index.js
 * whenever the DOM changes.
 */
function scanDom() {
  // "[class]" selector is faster than "*" because it skips class-less nodes
  document.querySelectorAll("[class]").forEach(function (el) {
    applyToElement(el);
  });
}

// Export
if (typeof module !== "undefined") {
  module.exports = { applyToElement, scanDom };
}