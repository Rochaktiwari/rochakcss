# rochakcss ⚡

> A lightweight utility-first CSS framework — your own mini Tailwind, using the `r-*` prefix.

[![npm version](https://img.shields.io/badge/npm-v1.0.4-f5c542?style=flat-square)](https://www.npmjs.com/package/rochakcss)
[![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-green?style=flat-square)]()
[![size](https://img.shields.io/badge/size-~10kb-orange?style=flat-square)]()

No build step. No config file. No dependencies. Just add one script tag and start styling with `r-*` classes.

---

## Links

- 📦 **npm** → [npmjs.com/package/rochakcss](https://www.npmjs.com/package/rochakcss)
- 📚 **Documentation** → [rochakcss.rochaktiwari.online](https://rochakcss.rochaktiwari.online)
- 🌐 **Website** → [rochaktiwari.online](https://rochaktiwari.online)
- 🐦 **X (Twitter)** → [@Rochak__tiwari](https://x.com/Rochak__tiwari)
- 💻 **GitHub** → [github.com/Rochaktiwari](https://github.com/Rochaktiwari)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [CDN Usage](#cdn-usage)
  - [npm Install](#npm-install)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Numeric Scale](#numeric-scale)
- [Class Reference](#class-reference)
- [JavaScript API](#javascript-api)
- [Examples](#examples)
- [License](#license)

---

## Features

- **Zero build step** — drop in a single `<script>` tag and go
- **CDN ready** — works via jsDelivr, no installation needed
- **r-\* prefix** — all classes are namespaced, no conflicts with existing CSS
- **Inline style application** — uses `Object.assign(el.style, …)` for maximum specificity
- **MutationObserver** — automatically styles dynamic/lazy-loaded content
- **Tiny footprint** — ~10kb, no runtime dependencies
- **JavaScript API** — programmatic access to the parser and config
- **Beginner friendly** — readable class names, predictable numeric scale

---

## Installation

### CDN Usage

The fastest way to get started. Paste this `<script>` tag into any HTML file — no installation needed.

```html
<script src="https://cdn.jsdelivr.net/npm/rochakcss/dist/rochak.js"></script>
```

That's it. rochakcss will automatically scan the DOM and apply all `r-*` classes as inline styles.

**Example:**

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/rochakcss/dist/rochak.js"></script>
  </head>
  <body>
    <div class="r-flex r-items-center r-gap-4 r-p-6 r-bg-#1e293b r-rounded-3">
      <p class="r-text-18 r-weight-bold r-color-#f5c542">Hello, rochakcss!</p>
    </div>
  </body>
</html>
```

### npm Install

For Node.js or bundler-based projects (Webpack, Vite, etc.):

```bash
npm install rochakcss
```

Then in your JavaScript:

```js
const rochak = require('rochakcss');
rochak.init();
```

Or link the built file from `node_modules`:

```html
<script src="node_modules/rochakcss/dist/rochak.js"></script>
```

> 📦 View on npm: [npmjs.com/package/rochakcss](https://www.npmjs.com/package/rochakcss)

---

## Quick Start

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Add CDN script -->
    <script src="https://cdn.jsdelivr.net/npm/rochakcss/dist/rochak.js"></script>
  </head>
  <body>

    <!-- Use r-* classes on any element -->
    <div class="r-flex r-items-center r-gap-4 r-p-6 r-bg-#1e293b r-rounded-3">
      <p class="r-text-18 r-weight-bold r-color-#f5c542">
        Hello, rochakcss!
      </p>
    </div>

  </body>
</html>
```

rochakcss scans the DOM on load, applies all `r-*` classes as inline styles, and watches for changes via `MutationObserver`.

---

## How It Works

rochakcss is split into four focused modules bundled into a single file:

```
src/
├── config.js   ← lookup tables: staticStyles, spacing, sizing, weightMap
├── parser.js   ← pure function: class name → style object | null
├── applier.js  ← walks DOM, calls Object.assign(el.style, styles)
└── index.js    ← boots library, sets up MutationObserver
```

**Resolution order inside the parser:**

1. Quick bail-out — does the class start with `r-`?
2. Static exact match — check `staticStyles` lookup table
3. Spacing prefix match — check `spacing` map (e.g. `r-p`, `r-mx`)
4. Sizing prefix match — check `sizing` map (e.g. `r-w`, `r-max-h`)
5. Dynamic switch — parse prefix + value and build the style object

---

## Numeric Scale

Most numeric values multiply by **4** to produce pixels:

| Class         | CSS Property   | Result  |
|---------------|----------------|---------|
| `r-p-4`       | padding        | `16px`  |
| `r-gap-3`     | gap            | `12px`  |
| `r-w-20`      | width          | `80px`  |
| `r-m-2`       | margin         | `8px`   |
| `r-rounded-2` | border-radius  | `8px`   |

**Exceptions (no ×4 scaling):**

| Class           | Rule                          | Example                    |
|-----------------|-------------------------------|----------------------------|
| `r-text-{px}`   | Direct pixel value            | `r-text-14` → `14px`       |
| `r-spacing-{n}` | Direct px (letter-spacing)    | `r-spacing-2` → `2px`      |
| `r-opacity-{n}` | Divided by 10                 | `r-opacity-7` → `0.7`      |
| `r-blur-{px}`   | Direct px                     | `r-blur-8` → `blur(8px)`   |

---

## Class Reference

### Display

| Class            | Style                     |
|------------------|---------------------------|
| `r-flex`         | `display: flex`           |
| `r-grid`         | `display: grid`           |
| `r-block`        | `display: block`          |
| `r-inline`       | `display: inline`         |
| `r-inline-block` | `display: inline-block`   |
| `r-hidden`       | `display: none`           |

### Flexbox

| Class                                             | Style                                |
|---------------------------------------------------|--------------------------------------|
| `r-center`                                        | flex + justify-center + align-center |
| `r-dir-row` / `r-dir-col`                         | `flex-direction`                     |
| `r-wrap-yes` / `r-wrap-no`                        | `flex-wrap`                          |
| `r-items-{center\|start\|end\|stretch}`           | `align-items` variant                |
| `r-justify-{center\|start\|end\|between\|around}` | `justify-content` variant            |
| `r-gap-{n}` / `r-gap-x-{n}` / `r-gap-y-{n}`     | gap (×4px)                           |
| `r-grow-{n}` / `r-shrink-{n}` / `r-flex-{n}`     | flex sizing                          |

### Spacing

```
r-p-{n}   r-pt-{n}  r-pb-{n}  r-pl-{n}  r-pr-{n}  r-px-{n}  r-py-{n}
r-m-{n}   r-mt-{n}  r-mb-{n}  r-ml-{n}  r-mr-{n}  r-mx-{n}  r-my-{n}
r-m-auto  r-mx-auto
```

### Sizing

```
r-w-{n}     r-h-{n}
r-min-w-{n} r-max-w-{n}
r-min-h-{n} r-max-h-{n}
r-w-full    r-w-half    r-w-auto
r-h-full    r-h-screen  r-h-auto
r-full-screen
```

### Typography

| Class                            | Style                                                                     |
|----------------------------------|---------------------------------------------------------------------------|
| `r-text-{px}`                    | `font-size: {px}px` (e.g. `r-text-14`)                                   |
| `r-weight-{name}`                | `font-weight` — thin / light / normal / medium / semibold / bold / extrabold / heavy |
| `r-color-{value}`                | `color` — hex or named (e.g. `r-color-#f5c542` or `r-color-red`)         |
| `r-align-{left\|center\|right}`  | `text-align`                                                              |
| `r-leading-{n}`                  | `line-height` (unitless multiplier)                                       |
| `r-spacing-{n}`                  | `letter-spacing: {n}px`                                                   |
| `r-italic`                       | `font-style: italic`                                                      |
| `r-underline`                    | `text-decoration: underline`                                              |
| `r-uppercase` / `r-capitalize`   | `text-transform`                                                          |
| `r-line-through`                 | `text-decoration: line-through`                                           |

### Background

| Class           | Style                             |
|-----------------|-----------------------------------|
| `r-bg-{value}`  | `background-color` (hex or named) |

### Borders

| Class            | Style                                        |
|------------------|----------------------------------------------|
| `r-rounded-{n}`  | `border-radius` (×4px)                       |
| `r-rounded-full` | `border-radius: 9999px`                      |
| `r-border-{n}`   | `border: {n}px solid rgba(255,255,255,0.15)` |

### Position

| Class          | Style                          |
|----------------|--------------------------------|
| `r-relative`   | `position: relative`           |
| `r-absolute`   | `position: absolute`           |
| `r-fixed`      | `position: fixed`              |
| `r-sticky`     | `position: sticky; top: 0`     |
| `r-top-{n}`    | `top` (×4px)                   |
| `r-bottom-{n}` | `bottom` (×4px)                |
| `r-left-{n}`   | `left` (×4px)                  |
| `r-right-{n}`  | `right` (×4px)                 |
| `r-z-{n}`      | `z-index`                      |

### Effects

| Class            | Style                                       |
|------------------|---------------------------------------------|
| `r-shadow-{n}`   | Layered `box-shadow` scaled by n            |
| `r-opacity-{n}`  | `opacity` (÷10, e.g. `r-opacity-7` → `0.7`) |
| `r-blur-{px}`    | `filter: blur({px}px)`                      |
| `r-bright-{n}`   | `filter: brightness({n}/10)`                |
| `r-glass`        | Frosted glass (backdrop-filter + rgba bg)   |

### Transitions

| Class                 | Style                               |
|-----------------------|-------------------------------------|
| `r-transition-fast`   | `transition: all 150ms ease-in-out` |
| `r-transition-normal` | `transition: all 350ms ease-in-out` |
| `r-transition-slow`   | `transition: all 800ms ease-in-out` |
| `r-transition-ultra`  | `transition: all 2000ms ease-in-out`|
| `r-transition-{ms}`   | Custom, e.g. `r-transition-500`     |

### Overflow & Cursor

| Class               | Style                  |
|---------------------|------------------------|
| `r-overflow-hidden` | `overflow: hidden`     |
| `r-overflow-auto`   | `overflow: auto`       |
| `r-overflow-scroll` | `overflow: scroll`     |
| `r-pointer`         | `cursor: pointer`      |
| `r-cursor-default`  | `cursor: default`      |
| `r-no-pointer`      | `pointer-events: none` |

---

## JavaScript API

After the script loads, a `rochak` object is available globally:

```js
// Re-scan the entire DOM (useful after large dynamic renders)
rochak.refresh();

// Parse a single class name → returns a style object or null
rochak.parse("r-p-4");
// → { padding: "16px" }

rochak.parse("r-text-18");
// → { fontSize: "18px" }

rochak.parse("unknown-class");
// → null

// Inspect all configuration tables
rochak.getConfig();
// → { staticStyles, spacing, sizing }
```

---

## Examples

### Centered hero card

```html
<script src="https://cdn.jsdelivr.net/npm/rochakcss/dist/rochak.js"></script>

<div class="r-center r-h-screen r-bg-#0f172a">
  <div class="r-flex r-dir-col r-gap-4 r-p-8 r-bg-#1e293b
              r-rounded-4 r-shadow-6 r-max-w-20">
    <h1 class="r-text-32 r-weight-bold r-color-#f5c542">Welcome</h1>
    <p class="r-text-14 r-color-#94a3b8 r-leading-6">
      Build fast with utility classes.
    </p>
    <button class="r-bg-#f5c542 r-text-14 r-weight-bold r-px-5
                   r-py-3 r-rounded-2 r-pointer r-transition-fast">
      Get Started
    </button>
  </div>
</div>
```

### Frosted glass card

```html
<script src="https://cdn.jsdelivr.net/npm/rochakcss/dist/rochak.js"></script>

<div class="r-relative r-center r-h-screen r-bg-#6366f1">
  <div class="r-glass r-rounded-4 r-p-8 r-border-1 r-shadow-8">
    <p class="r-text-20 r-weight-semibold r-color-#fff">
      Frosted Glass Effect
    </p>
    <p class="r-text-13 r-color-#e2e8f0 r-mt-2 r-leading-5">
      Using r-glass + r-border-1 + r-rounded-4
    </p>
  </div>
</div>
```

### Navigation bar

```html
<script src="https://cdn.jsdelivr.net/npm/rochakcss/dist/rochak.js"></script>

<nav class="r-flex r-items-center r-justify-between r-px-8 r-py-4
            r-bg-#0f172a r-sticky r-z-10 r-shadow-4">
  <span class="r-text-18 r-weight-bold r-color-#f5c542">MyApp</span>
  <div class="r-flex r-gap-6">
    <a class="r-text-14 r-color-#94a3b8 r-pointer r-transition-fast">Home</a>
    <a class="r-text-14 r-color-#94a3b8 r-pointer r-transition-fast">Docs</a>
  </div>
</nav>
```

### Dynamic content (MutationObserver)

rochakcss automatically styles elements added to the DOM after load:

```js
const card = document.createElement('div');
card.className = 'r-flex r-dir-col r-gap-3 r-p-6 r-bg-#1e293b r-rounded-3';
document.body.appendChild(card);
// Styles applied automatically — no rochak.refresh() needed
```

---

## License

MIT — free for personal and commercial use.

---

Made with ⚡ by [Rochak Tiwari](https://rochaktiwari.online)  
[𝕏 @Rochak__tiwari](https://x.com/Rochak__tiwari) · [GitHub](https://github.com/Rochaktiwari) · [npm](https://www.npmjs.com/package/rochakcss)