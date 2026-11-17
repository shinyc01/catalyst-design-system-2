# Typography

How type works in Catalyst Design System 2.0: the token structure, the levels, the 16 styles, and the rules for picking one. Decided with the designer in Nov 2026; the six reference systems (Fluent 2, Atlassian, Carbon, Material 3, Apple HIG, Notion) are the benchmark.

## 1. Structure: primitives → semantic → styles

Two layers, the same as the Figma library (collections "3. Typography primitives" and "4. Typography semantic"). Material 3, Fluent 2, Carbon and Atlassian work the same way.

| Layer | Tokens | Where |
|---|---|---|
| Primitives | `--font-family-display / text / mono` · `--font-weight-font-weight-regular / medium / semibold` (400 / 500 / 600) · `--letter-spacing-letter-spacing--05 … -03` (−0.5 … +0.3px) · size scale `--type-s / m / l / h3 / h2 / h1 / display-s / m / l` (size/line-height pairs, one value per density) | `src/tokens.css`, `src/foundations/typography.css` |
| Semantic, one set per style | `--text-<style>` (font shorthand), `--text-<style>-tracking`, `--text-<style>-weight`, e.g. `--text-body-m-regular` | `src/foundations/typography.css` |
| Classes | `.t-<style>`, e.g. `.t-body-m-regular` | `src/tokens.css` |

Components and prototypes use only the semantic layer:
```css
.ifs-thing__title{font:var(--text-heading-h4-semibold);letter-spacing:var(--text-heading-h4-semibold-tracking)}
.ifs-thing__status{font:var(--text-label-m-upper);letter-spacing:var(--text-label-m-upper-tracking);text-transform:uppercase}
```
Never write a weight, size or letter-spacing number. A decision such as "uppercase is 500, +0.3px" now lives in one token. The semantic tokens are declared on `:root` and on every `[data-density]` container, so text follows the nearest density setting.

No exceptions: every text rule in the kit uses a semantic style, including chart SVG text and small component text.
- Avatar initials: XL (56) H4 · L (40) and M (32) Label/M/UPPER · S (24) Body/S · XS (20) and XXS (16) Body/S with one initial.
- Map pin counts: Body/S; M and L pins widen into a pill when the count needs it (e.g. 999 in Spacious).
- Live-cursor name tags: Body/S (ambient text); the tag grows with the text.
- Charts: axis ticks Body/S · in-plot values Label/M/medium · donut centre H1 · gauge value Display/M.
- Widget thumbnails (Widget Builder previews): title Label/M/UPPER; the tiny axis and row labels are drawn as skeleton bars, since a thumbnail has no readable text.
- Navbar wordmark fallback: H3. Bold words inside text use `--text-label-m-medium-weight`.

Paragraph spacing is not a type token (Figma has 8px on Body styles). As in the other systems, the gap between paragraphs comes from spacing tokens.

## 2. Levels

Three text levels plus headings. Steps are 2px.

| Level | Token | Spacious | Comfortable | Compact | Use it for |
|---|---|---|---|---|---|
| Small | `--type-s` | 14/20 | 12/16 | 10/14 | **Low-priority reading text only**: disclaimers, helper text, timestamps, captions under numbers, side notes. Never labels, statuses, headers or anything the user acts on. |
| Body | `--type-m` | 16/24 | 14/20 | 12/16 | The default: all content and all labels. |
| Large | `--type-l` | 18/26 | 16/24 | 14/20 | H4 titles; text in L-size controls. |
| H3 / H2 / H1 | `--type-h3/h2/h1` | 22/26/32 | 20/24/28 | 16/20/24 | Sections, page titles, hero pages, big numbers. |
| Display S/M/L | `--type-display-*` | 36/40/48 | 32/36/44 | 28/32/40 | Rare hero moments. Kept until the product Figma files are checked. |

Caption (10px, smaller than Small) is retired: `--type-caption` now equals `--type-s`. Only Fluent has a 10px level; the others stop at 11–12. Compact Small went from 11 to 10 so every step is 2px.

## 3. Styles (16)

| Style | Level · weight · letter-spacing | Use |
|---|---|---|
| Display L / M / S | Display · 500 · −0.5px | Rare hero numbers |
| Heading/H1/medium | H1 · 500 · −0.3px | Hero/form page title, big KPI numbers |
| Heading/H2/medium | H2 · 500 · −0.2px | Page title, big numbers |
| Heading/H3/medium | H3 · 500 · −0.1px | Page sections that aren't inside a card or panel |
| **Heading/H4/semibold** | Large · 600 · 0 | **The title style**: panel, modal, drawer, card, chart, table card, side nav, empty state |
| Body/L/regular | Large · 400 · −0.1px | L-field input, long reading |
| **Body/M/regular** | Body · 400 · 0 | **Default**: content, cells, descriptions, messages, menu items, options, typed text |
| Body/S/regular | Small · 400 · +0.1px | Low-priority text only |
| Label/L/medium | Large · 500 · −0.15px | L-size control text only |
| **Label/M/medium** | Body · 500 · 0 | Names, primary column, key values, controls, sub-section titles |
| **Label/M/UPPER** | Body · 500 · +0.3px · uppercase | Statuses, table and column headers, nav group headers, eyebrows |
| Code/M/regular, Code/M/medium | Body · mono · 400 / 500 · 0 | Code, formulas, JSON, also inline in Body text (default) |
| Code/S/regular | Small · mono · 400 · 0 | Code inside Small text only |

Retired (the class still works and renders as its replacement): Code regular / medium (were Small) → Code/M; Label/M/semibold and Label/S/medium → Label/M/medium; Label/S/UPPER, Caption regular/semibold UPPER and the older uppercase styles → Label/M/UPPER; Label/L/semibold → H4; Body/L/medium → Label/L/medium; Body/M/medium, Heading/H4/medium → Label/M/medium.

## 4. Rules

**Heading order**: headings follow the page structure, from the outside in.
| Level | Use for | Example |
|---|---|---|
| H2 (H1 on hero or form pages) | The page title, once per page | "Executive Summary" |
| H3 | A page section that is not inside a card or panel (it sits on the page background) | "Recommended Alternative" with several cards under it |
| H4 | The title of a container: card, panel, modal, drawer, chart | "Investment Value Impact", "Readiness Evaluation" |
| Label/M/medium | A sub-section inside a container that already has a title | "Approval readiness" inside the Readiness panel |

Don't skip a level when nesting: if a page groups its cards into sections, each group gets an H3. The visual level is separate from the HTML level: a card title looks like H4 but can be `<h2>` or `<h3>`, whatever keeps the screen-reader outline in order.

**Big numbers**: pick the size by how many numbers compete for attention.
- **H1**: the one main number of a card or tile (stat card M, quick stat, Cooper chat card, donut centre).
- **H2**: several numbers side by side, or a small card (stat card S, before → after pairs, metric rows inside a card).
- **Display**: a single hero number that is the whole point of the view (gauge). At most one per screen.
- **Label/M/medium**: numbers inside content (table cells, lists, sentences). A number in a table never uses a heading style.
Big numbers always sit next to a Body or Small label that says what they are. (Matches the kit today. Revisit if prototypes keep overriding it.)

**By role**
| Role | Style |
|---|---|
| Page title | H2 (H1 for hero/form pages) |
| Page section not inside a container | H3 |
| Panel, modal, drawer, card, chart title | H4 |
| Sub-section inside a titled panel | Label/M/medium, primary colour |
| Content, typed text, menu items, options | Body/M/regular |
| Name / primary column / item title / key value | Label/M/medium |
| Control text (button, tab, chip, segmented, badge, nav item) | Label/M/medium (L controls Label/L/medium) |
| Status (in a table, list or page header) | Label/M/UPPER |
| Table / column header, nav group header, eyebrow | Label/M/UPPER |
| Meta (time, author, ID) | Body/M/regular in secondary colour; Body/S/regular when it's low priority |
| Disclaimer, helper text, caption | Body/S/regular |
| Big number | H1 one per card · H2 several or small cards · Display one hero number per screen |

**Weights mean something**: 400 content · 500 every label, name, control and uppercase text · 600 H4 only (at 500, H4 would equal Label/L/medium). A row with no name or key value is all regular. In tables, the name column is medium (`ifs-table__td--primary`: the column with `primary: true`, else the first text column) and every other cell is regular.

**Case**: Title Case for page, section, card, chart, panel and modal titles, headings, navigation, dropdown triggers and buttons. Sentence case for all content (body text, descriptions, messages, menu items, options, chips, Cooper prompts and answers, field labels). UPPERCASE only through Label/M/UPPER, with the source text typed normally. Title Case is a text change, not CSS: the content guide owns the strings.

**Density**: components read the tokens, so text follows the user's density. Weights, letter-spacing and case are the same in every density.

## 5. How the six reference systems compare

| | Fluent 2 | Atlassian | Carbon | Material 3 | Apple HIG | Notion (unofficial) |
|---|---|---|---|---|---|---|
| Token layers | global (size, line height, weight) → styles | primitives → semantic `font.*` tokens | type scale + weights → type tokens | ref → sys typescale tokens per role | text styles only | none published |
| Content / table cells | regular | regular | regular | regular | regular | regular |
| Headings | 600 | 653 | small 600, large 400 | 400 / 500 | regular titles, semibold headline | 600 |
| Uppercase | none | status lozenge only | none | none (M2 overline removed) | none today | none |
| Smallest text (body 14–17) | 10 | 12 | 12 | 11 | 11 | 12 |
| Largest size | 68 | 32 | 42 (product) | 57 | 34 | 40 |
| Named styles | ~17 | ~14 | ~15 | 15 | 11 | ~6 |

We follow the majority on token layers, regular content, a 12px floor (10 in Compact) and a short list of styles. We keep uppercase for statuses and headers because it separates them from content, and set it at Body size in medium so it isn't heavier than the content around it.

## 6. Decisions log (Nov 17, 2026)

1. Compact Small 11 → 10px (2px steps).
2. Caption retired; Small is the smallest level.
3. Small is only for low-priority reading text (option B). Labels, statuses and headers move to Body size.
4. Uppercase stays for statuses, table headers and nav group headers: Body size, 500, +0.3px. The header status is uppercase too (one status style).
5. Title Case for titles, chart headers, dropdowns and buttons (strings: content guide).
6. Label/M/semibold merged into Label/M/medium; H4 keeps 600.
7. Display S/M/L and Code kept until the product Figma files are checked. Code follows Body size (Code/M), with Code/S for code inside Small text; in the old Figma library Code also matched body size.
8. Tokens rebuilt as primitives → semantic, like Figma.
9. Heading order: H2 page → H3 page section → H4 container → Label/M/medium sub-section; no skipped levels.
10. Big numbers: H1 one main number per card, H2 when several or small, Display one hero number per screen; table numbers Label/M/medium.
11. Earlier in the same pass: content regular, name column medium; panel/modal/card titles H4 (no uppercase); readiness rows no longer split 50/50.

## 7. Open

| # | Item | Recommendation |
|---|---|---|
| 1 | Display and Code use in the product Figma files (Value etc.) | Count style use there; remove what nothing uses. |
| 2 | Modal titles: H4 like every surface, or H3? | H4 for consistency. |
| 3 | Uppercase headers at Body size are wider; narrow columns crowd ("Last modified", "Created by") | Raise the minimum widths for short/date/user columns (layout tokens). |
| 4 | Chips in narrow cards wrap more at Body size (Cooper saved scenarios) | Accept, or let those chips truncate. |
| 5 | Status component sizes XS and S now share the text style | Merge into one size. |
| 6 | Figma library: old style names (Label/M/medium is "Heading/H4/medium"), single mode with 12px body values, a few wrong bindings (Label/M/medium and Code bound to other styles' letter-spacing), stray styles from other files | Rename to the kit names, add Spacious/Comfortable/Compact modes to "4. Typography semantic", fix the bindings, remove strays. |
