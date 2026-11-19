# Catalyst Design System 2.0

The next version of the IFS DS code kit: a React code twin of the IFS Design System Figma library, with user-selectable density and a type and spacing scale set against best-in-class design systems.

It started as a copy of the IFS DS kit (`shinyc01/new-cl-design-system`, folder `ifs-kit`) with the IFS DS polish values from Flexy (Nov 2026). That kit is unchanged and still powers the `catalyst-prototype` skill; this repo is a separate version.

## 2.0.1 (Nov 18, 2026): spacing
- One `--space-*` scale and three density roles: `--space-inset` 20 / 16 / 12 (padding of every card, panel, drawer, modal, popover and form, on all four sides), `--space-stack` 16 / 12 / 8 (gaps between blocks), `--space-section` 40 / 32 / 24 (between page sections). Page margin and the gap between cards follow screen width. No raw px spacing in components. Spec: [guide/spacing.md](guide/spacing.md).
- Tables: fixed rows 64 / 52 / 40, headers 40 / 32 / 24 (no top padding); one table card for every table. Menus 4px from the trigger and 4px inside.
- Layout: breakpoints 600 / 1024 / 1440 / 1920, 12 columns, margin and gap by screen width; cards on columns, panels at fixed sizes (380 / 600), map slots. Spec: [guide/layout.md](guide/layout.md).

## 2.0.1 (Nov 17, 2026): typography
- Type tokens in two layers like the Figma library: primitives, then one semantic set per style (`--text-<style>`, `src/foundations/typography.css`). Components use only the semantic tokens; no hard-coded sizes, weights or letter-spacing anywhere.
- 16 styles. Caption retired; Small is rare (disclaimers, footnotes, text inside small fixed shapes); Small is 14 / 12 / 11. Labels, statuses, table headers and meta text are Body size.
- No uppercase style (2.0.1 review): statuses, column headers and captions are sentence case in Label/M/medium. Titles, headings and navigation are Title Case; buttons, dropdowns and all content are sentence case. Content is regular, names and key values medium.
- Code follows Body size; tabular figures for numbers; reading text wraps at about 75 characters.
- Full spec and rules: [guide/typography.md](guide/typography.md). Old `.t-*` class names still work.

## Previous version: Catalyst Design System 1.0
Version 1.0 is the original IFS DS code kit, before any of the 2.0 type, spacing or density changes (12 px body text, H1 20 px). It is kept as the record to compare against or go back to.

| What | Where |
|---|---|
| Source, pinned to the 1.0 version (commit `f75244d`, Oct 29, 2026) | https://github.com/shinyc01/new-cl-design-system/tree/f75244d5834d044761e819a78313691005c4104f/ifs-kit |
| Live source (folder `ifs-kit` on `master`; may change later) | https://github.com/shinyc01/new-cl-design-system/tree/master/ifs-kit |
| Storybook (live; shows whatever `master` holds) | https://shinyc01.github.io/new-cl-design-system/ifs-kit/dist/storybook/ |

The pinned link always shows 1.0 exactly as it was, even if `master` changes. To go back to it, copy `ifs-kit/` from that commit (`git checkout f75244d -- ifs-kit` in that repo). Flexy's 14 px polish values (the starting point of 2.0) were never published to that repo; they are the first commit of this one.

## Look at it
| What | Where |
|---|---|
| Storybook (every component, with the density switch in the toolbar) | https://shinyc01.github.io/catalyst-design-system-2/dist/storybook/ |
| Demo: six Catalyst screens, Display settings behind the gear icon | https://shinyc01.github.io/catalyst-design-system-2/demo/ |
| Prototype bundle (exposes `window.Catalyst` and `window.IFS`) | `dist/ifs-ds.js`, `dist/ifs-ds.css` |
| Component API | `dist/api.md` |
| Icon names | `dist/icons.txt` |
| Usage guide | `guide/components.md` |
| Prototype starter | `template.html` |


## What's new in 2.0: density
Users pick how dense the UI is, as a system setting (three levels):

| Setting | Body | Small | H4 / H3 / H2 / H1 | Display S / M / L | Controls S/M/L | Table row / header | Inset | Stack | Section |
|---|---|---|---|---|---|---|---|---|---|
| **Spacious** | 16/24 | 14 | 18 / 22 / 26 / 32 | 36 / 40 / 48 | 28 / 36 / 44 | 64 / 40 | 20 | 16 | 40 |
| **Comfortable** (default) | 14/20 | 12 | 16 / 20 / 24 / 28 | 32 / 36 / 44 | 24 / 32 / 40 | 52 / 32 | 16 | 12 | 32 |
| **Compact** | 12/16 | 11 | 14 / 16 / 20 / 24 | 28 / 32 / 40 | 24 / 28 / 32 | 40 / 24 | 12 | 8 | 24 |

Page margin / gap between cards follow screen width, not density: 16 / 16 below 600, 24 / 16 from 600, 24 / 20 from 1440, 32 / 32 from 1920.

### Where the numbers come from
Comfortable type is the average of six reference systems: Fluent 2, Atlassian, Carbon, Material 3, Apple HIG and Notion (Notion unofficial, from its CSS), taken as ratios to each system's body size and applied to ours, rounded to even px: Small x0.85, H4 x1.11, H3 x1.38, H2 x1.66, H1 x1.97, Display x2.54. Spacing started from the same systems' published averages and was then set in the 2.0.1 review with Flexy; the rules and values are in [guide/spacing.md](guide/spacing.md).

How it works:
- Put `data-density="spacious"`, `"comfortable"` or `"compact"` on `<html>` (or any container). `IFS.setDensity('compact')` does this and remembers the choice; `IFS.getDensity()` reads it back.
- Type is tokens in two layers (like the Figma library): primitives (families, weights, letter-spacing steps, and the `--type-s|m|l|h3|h2|h1|display-*` size/line-height pairs per density) and one semantic set per text style, `--text-<style>` + `-tracking` + `-weight` (`src/foundations/typography.css`). Components use only the semantic set. 16 styles; rules in `guide/typography.md`.
- Control heights read `--control-h-s|m|l`, `--tab-h-m|l`, `--nav-row-h`, `--table-row-h`, `--table-header-h`.
- Spacing: `src/foundations/spacing.css` (scale, roles, page grid). Type and control sizes: the Density block at the end of `src/tokens.css`. Old `--spacing-*`, `--gaps-*` and `--paddings-*` names still work as aliases.
- The bundle exposes `window.Catalyst` (and `window.IFS`, so existing prototypes work unchanged).

---

## Kit notes

Components are rebuilt to match the Figma library (`atgUmwcA1AE5sjFoWBT7ar`): tokens exported from Figma variables, icons exported from Figma. The kit's own rules are in [CONVENTIONS.md](CONVENTIONS.md).

## Working on it
```bash
npm install        # public npm registry
npm run storybook  # review at http://localhost:6006
npm run release    # rebuild dist/ (bundle, API docs, Storybook) and demo/index.html before committing
```
Commit `dist/` and `demo/index.html` with your change: GitHub Pages serves the files straight from `main`.
