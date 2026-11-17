# Catalyst Design System 2.0

The next version of the IFS DS code kit: a React code twin of the IFS Design System Figma library, with user-selectable density and a type and spacing scale set against best-in-class design systems.

It started as a copy of the IFS DS kit (`shinyc01/new-cl-design-system`, folder `ifs-kit`) with the IFS DS polish values from Flexy (Nov 2026). That kit is unchanged and still powers the `catalyst-prototype` skill; this repo is a separate version.

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

| Setting | Body | Small | H4 / H3 / H2 / H1 | Display S / M / L | Controls S/M/L | Table row = header | Cell padding | Card | Modal | Page margin / gap (1440) |
|---|---|---|---|---|---|---|---|---|---|---|
| **Spacious** | 16/24 | 14 | 18 / 22 / 26 / 32 | 36 / 40 / 48 | 28 / 36 / 44 | 64 | 20 / 20 | 24 | 32 | 32 / 32 |
| **Comfortable** (default) | 14/20 | 12 | 16 / 20 / 24 / 28 | 32 / 36 / 44 | 24 / 32 / 40 | 56 | 16 / 16 | 20 | 24 | 24 / 24 |
| **Compact** | 12/16 | 10 | 14 / 16 / 20 / 24 | 28 / 32 / 40 | 20 / 28 / 32 | 40 | 12 / 8 | 12 | 20 | 16 / 20 |

### Where the numbers come from
Comfortable is the average of six reference systems: Fluent 2, Atlassian, Carbon, Material 3, Apple HIG and Notion (Notion unofficial, from its CSS).

**Type** is averaged as ratios to each system's body size, then applied to our body size and rounded to even px: Small x0.85, H4 x1.11, H3 x1.38, H2 x1.66, H1 x1.97, Display x2.54. Each heading step is now about 20% (it was about 11% with 16/18/20/24). Average heading weights: H4 600, H3-H1 about 500, so weights did not change.

**Spacing** (published values; px):
| Role | Fluent 2 | Atlassian | Carbon | Material 3 | Average → ours |
|---|---|---|---|---|---|
| Default button | 32 | 32 | 40 (forms) | 40 | 36 → kept 32 (dense-app systems use 32) |
| Table row (default) | 44 | ~28 | 48 | — | 46 → **48**, header same height (was 60 / 40) |
| Table cell padding (x) | 8 | 8 | 16 | — | 11 → **12** (was 16) |
| Card padding | 12 | — | 16 | — | 14 → kept 16 |
| Modal padding | 24 | 24 | 16 | 24 | 22 → **24** (was 20) |
| Side panel width | 320 | 360 | 480 | 360 | 380 → kept 380 |
| Side panel padding | 24 | — | 16 | — | 20 → **20** (was 16) |
| Menu surface padding | 4 | 0 | 4 | 8 | 4 → **4** (was 8) |
| Field gap / label gap | — / 4 | 8 / 4 | 16–32 / 8 | — | kept 16 / 4 |
| Page margin (1440) | — | — | 16 | 24 | 20 → **20** (was 24) |
| Gap between cards | — | 12–24 | 32 | 24 | ~24 → **24** (was 16) |
| Section spacing | — | 32+ | 32 | 24 | ~32 → **32** (was 24) |

**Base scale:** 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, plus **64 and 80** (new; Atlassian and Carbon both have them). 10 is only in Fluent; it stays because existing components use it.

**Adjusted after review:** the averages below (rows 48, cell padding 12, card 16, panel 20, page margin 20, sections 32) felt tight next to the larger type, so Comfortable spacing sits half a step looser (rows 56, cell padding 16 all round, card 20, panel 24, page margin 24, sections 40). Spacious steps one notch above that.

**Table row rule:** row height = tallest cell content (24: badge, avatar, chip) + 2 × the cell's top/bottom padding. Spacious 24 + 2×20 = 64, Comfortable 24 + 2×16 = 56, Compact 24 + 2×8 = 40. Rows are centred, so the row height (not the padding) sets the visible space; following the rule keeps every row the same height whatever it contains. Compact steps text one notch down but spacing only about half a notch (a full notch felt too tight). Apple and Notion publish no spacing metrics, so they count for type only.

How it works:
- Put `data-density="spacious"`, `"comfortable"` or `"compact"` on `<html>` (or any container). `IFS.setDensity('compact')` does this and remembers the choice; `IFS.getDensity()` reads it back.
- Type is tokens in two layers (like the Figma library): primitives (families, weights, letter-spacing steps, and the `--type-s|m|l|h3|h2|h1|display-*` size/line-height pairs per density) and one semantic set per text style, `--text-<style>` + `-tracking` + `-weight` (`src/foundations/typography.css`). Components use only the semantic set. 15 styles; rules in `guide/typography.md`.
- Control heights read `--control-h-s|m|l`, `--tab-h-m|l`, `--nav-row-h`, `--table-row-h`, `--table-header-h`.
- The `--spacing-*` role tokens step down one notch in Compact; `--page-margin` / `--page-gap` give the page grid.
- All values live in the Density block at the end of `src/tokens.css`.
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
