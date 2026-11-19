# Spacing — Catalyst Design System 2.0.1

Tokens: `src/foundations/spacing.css` (scale, roles, page grid) and the Density block in `src/tokens.css` (table and control sizes).

## 1. Two layers

| Layer | Tokens | Changes with |
|---|---|---|
| Scale | `--space-0` … `--space-1100` (100 = 4px): 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80 | nothing |
| Size ruler | `--size-*`: dimensions only (heights, widths, icons, 1–3px optical nudges) | nothing |
| Roles | `--space-inset`, `--space-stack`, `--space-section` | density |
| Page grid | `--page-margin`, `--page-gap` | screen width |

**px in Figma, rem in code (2.0.3).** Figma stays in px; the code ships the spacing scale, the size ruler (4 and up), control, tab, nav and table row heights, table column widths and icons in rem at a 16px base (16px = `1rem`, 24px = `1.5rem`). At the browser's default text size nothing looks different; when a user sets a larger default text size the whole UI grows in proportion, like zoom, and nothing gets cut off. Still px on purpose: borders, dividers and focus rings (and `--size-0` … `--size-3`), radius, breakpoints and media queries, fixed layout widths (side nav 240, rail 48, panels 380 / 600, modals 440 / 600, popover 320, menus 200 / 320, max content widths, `--layout-content-min` 840), and chart, map-pin and canvas geometry. Numbers in this guide stay in px.

One scale replaces Figma's four identical scales (gaps, paddings, margins, gutters), as in Atlassian (`space.*`), Carbon (`spacing-*`) and Primer.

## 2. Roles

| Role | Spacious | Comfortable | Compact | Use for |
|---|---|---|---|---|
| `--space-inset` | 20 | 16 | 12 | Padding of every container part, on all four sides: cards and table cards, panels, drawers, modals, popovers, forms. Also table cell left and right. |
| `--space-stack` | 16 | 12 | 8 | Gap between blocks inside a container (fields, cards in a panel, sections of a drawer) |
| `--space-section` | 40 | 32 | 24 | Gap between the sections of a page |

## 3. Page grid (by screen width, not density)

| Screen width | < 1024 | 1024–1439 | 1440+ |
|---|---|---|---|
| `--page-margin` | 16 | 24 | 24 |
| `--page-gap` (between cards and blocks on a page) | 16 | 16 | 20 |

Content is capped at `--layout-max-content-width` (1600) and centred, so wider screens get centred space, not bigger gaps. This follows Carbon, Atlassian, Primer and Polaris.

## 4. Rules

1. **Never a raw px value** for padding, gap or margin, in components or in screens.
2. **Three roles, no exceptions for containers.** Every part of a container (header, tabs, body, footer) has the same inset on all four sides. A container's height comes from its padding, not a fixed height.
3. **Fixed scale steps only where the part scales by its own height:** inside controls (buttons, fields, selects, tabs, chips, prompts, chat input), the nav bar and side nav, chart geometry (axes, legends, sankey, timeline), table-like cells, and gaps of 8 or less (icon to label, label to field). These stay the same in every density.
4. **Control heights** (Spacious / Comfortable / Compact): S 28 / 24 / **24**, M 36 / 32 / 28, L 44 / 40 / 32. Nothing clickable is smaller than 24 (WCAG 2.2 target size, decided Nov 19: Compact S went from 20 to 24, visually, not as a hidden hit area). Touch screens get larger targets with the mobile work.
5. **Menus and dropdowns:** 4px from the trigger and 4px inside the list, in every density. Option and menu-item height follows the control height: 36 / 32 / 28 (large lists 44 / 40 / 32).
6. **Exceptions are written next to the value** in the CSS, with the reason. The only kinds: rows (list rows, table cells, note rows) keep a fixed vertical step with inset sides; a tab row sits on its divider (no bottom padding); full-bleed lists leave side padding to their items; the collapsed panel rail is chrome; the page header is a bar of controls (tallest part + 4 top and bottom, page margin at the sides).

## 5. Tables

| | Spacious | Comfortable | Compact |
|---|---|---|---|
| Row height (fixed; content centred) | 64 | 52 | 40 |
| Header height (text + stack) | 40 | 32 | 24 |
| Space above the header text | no header padding: the toolbar gap (stack) or the card padding (inset) above | | |
| Space below the header text (= stack) | 16 | 12 | 8 |
| Table card padding (= inset) | 20 | 16 | 12 |
| Gap from the card's toolbar to the table (stack) | 16 | 12 | 8 |
| Cell padding, left and right (inset) | 20 | 16 | 12 |

The header has no top padding, so the space above its text is just the toolbar gap or card padding, about the same as the space below it. Every table uses one table card (`.ifs-table-card`), for `IFS.Table` and `IFS.DataTable` alike.

## 6. Case and uppercase (with typography)
No uppercase text style. Statuses, column headers, eyebrows and captions are sentence case in Label/M/medium. Only avatar initials and abbreviations are capitals. Full type rules: `guide/typography.md`.

## 7. Empty states
Padding: inset on all four sides. Gaps between icon, heading and text: 20 / 16 / 12 (the inset values). Buttons are their own group: a section gap above them (40 / 32 / 24).

Cards placed on a page use the page gap; blocks inside a container use the stack.

## 8. Stack and Inline (layout spacing in screens, 2.0.3)

**Rule: use `IFS.Stack` and `IFS.Inline` for layout spacing in screens instead of writing your own `display:flex; gap`.** They only take tokens, so a screen can't end up with a raw px gap.

| | Lays out | Props |
|---|---|---|
| `IFS.Stack` | top to bottom | `gap`, `align` (start, center, end, stretch), `justify` (start, center, end, between), `as`, `className`, `style` |
| `IFS.Inline` | side by side, in reading order (start is the right edge in RTL) | the same, plus `align="baseline"` and `wrap` (rows use the same gap) |

- `gap` is a role (`inset`, `stack`, `section`, `page-gap`) or a step of the scale as a string (`"50"`, `"100"`, `"150"`, `"200"`, `"250"`, `"300"`, `"400"`, `"500"`, `"600"` … `"1100"`). Default `stack`. Anything else (a number, `"12px"`) warns in the console and uses `stack`.
- Pick the gap as in §2 and §4: a role between blocks in a container (`stack`) or between page sections (`section`); a fixed step for small gaps (8 or less) and inside parts that scale by their own height.
- `align` and `justify` left out = flexbox defaults (stretch, start). Values are logical (start/end), never left/right.
- `style` is for sizing and surface (width, padding, background), not for overriding the layout. Cards on the page grid still use `.ifs-grid` / `.ifs-span-*` (guide/layout.md).
- Components keep their own CSS; Stack and Inline are for the space between things in a screen or prototype.

```jsx
<IFS.Stack gap="stack">
  <IFS.Inline gap="200" align="center" justify="between">
    <h2 className="t-heading-h4-medium">Investments</h2>
    <IFS.Inline gap="200"><IFS.Button type="secondary">Export</IFS.Button><IFS.Button type="primary">Add</IFS.Button></IFS.Inline>
  </IFS.Inline>
  <IFS.Table … />
</IFS.Stack>
```

What we took from the benchmarks: the two names and the token-only `space` prop from Atlassian (Stack / Inline); `gap` as the prop name and steps as strings (`"200"`) from Polaris (BlockStack / InlineStack) and Carbon; `align` / `justify` / `wrap` names from Primer. Like Atlassian and Primer, `wrap` is off by default (Polaris turns it on); we left out responsive props, `grow` and `separator` until a screen needs them.

