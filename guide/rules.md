# Catalyst Design System 2.0.6 — rules

The one rulebook. Each rule is stated once; other files point here by number (e.g. "rule 3.9").
Values are Spacious / Comfortable / Compact unless a rule says otherwise. Comfortable is the default.
Components and patterns: [components.md](components.md). Props: [`dist/api.md`](../dist/api.md). Figma keys, nodes and review items: [figma.json](figma.json).
When Figma frames and Figma notes disagree, the notes win. When a guide and the code disagree, the code wins.

---

Rules are grouped in the 11 foundation categories (A15, `prototypes/phase1-prep/FOUNDATION-STRUCTURE.md`, decided Nov 24), then the three non-foundation sections (page headers, map slots, component use) and the open list. Content stays section 8 and Accessibility section 9 (decided Nov 25), so their numbers (and the G-gap rules 9.13–9.19) did not move. Rules were renumbered on Nov 25 (2.0.6); the table at the end maps every old number to its new one.

---

## 1. Colour

Palettes, colour roles and their names: rule 11.6; contrast targets: rule 9.14; forced colours: rule 9.13; data-viz colours: section 10; collaboration colours `--color-collaboration-user-*` are for people, never data. Light theme values come with L01.

1.1 **Status:** five status words, the same in tokens and props (the old hue words stay as prop aliases):

| Meaning | Word | Token (icon / dot; text `--color-text-<word>`) | Icon |
|---|---|---|---|
| Information, evaluated | `info` | `--color-icon-info` | `status-evaluated-filled` |
| Done, passed, approved | `success` | `--color-icon-success` | `status-success-filled` |
| At risk, needs attention | `warning` | `--color-icon-warning` | `status-warning-filled` |
| Failed, blocked, rejected | `danger` | `--color-icon-danger` | `status-error-filled` |
| No state, draft, archived | `neutral` | `--color-icon-softer` (the readable grey, not the disabled grey) | dot |

- Never colour alone (rule 9.3): meaningful status (risk, health, process) uses icon + colour (`RiskStatus`, `ReadinessStatus`); colour-only dots (`StatusIndicator`) only where a label carries the meaning. Archived = the neutral dot + `--color-text-softer`.
- Where each word works: `Indicator`, `StatusIndicator`, `Badge` and `MapPin` take all five. `RiskStatus` takes info, success, warning, danger (no neutral risk in Figma); `ReadinessStatus` takes success, warning, danger (its other types are progress states, not colours). Map pins: info = `--color-background-info-strong`. The dot pin (`MapPinDot`) has no success or info (Nov 24): it is `danger` · `warning` · `neutral`, because the map only flags risk (red high, yellow medium, grey low); the old names stay as aliases: `error` draws danger, `success` and `info` draw neutral.
- Blue is info only; links use `--color-text-link`. Accent and Cooper are not statuses (rule 1.2). Chart series never use status colours; status marks in charts (only when the data is a status, always with an icon or word) use `--color-data-viz-good|warning|bad`. Good / bad change on a chart uses the diverging palette, not red and green (rule 10.8).
- Selected (cards, table rows): a 2 outline (`--border-width-selected`, rule 4.1) in the selected colour (`--color-border-strong`).
- Badges are read-only; clickable values are chips.
1.2 **Cooper orange is attribution only,** never severity.

---

## 2. Typography

2.1 **Two token layers, like Figma.** Primitives (families, weights 400 / 500 / 600, letter-spacing steps, size/line-height pairs `--font-size-s|m|l|h3|h2|h1|display-*` per density) and one semantic set per style: `--font-<style>`, `-tracking`, `-weight` (`src/foundations/typography.css`; naming: rule 11.2). The semantic set is declared on `:root` and every `[data-density]` container, so text follows the nearest density. Components and prototypes use only the semantic set; `.t-<style>` classes exist for prototypes. Every text in the kit uses a style, including chart SVG text. Fonts ship with the kit (`fonts/`, G6, Nov 25): never load them from a third party in production; if they fail, a metric-matched fallback (Arial / Helvetica, then sans-serif; Courier New, then monospace) keeps the layout from jumping (`src/foundations/fonts.css`). Google Fonts only in prototypes.
2.2 **Levels** (size/line height):

| Level | Token | Spacious | Comfortable | Compact |
|---|---|---|---|---|
| Small | `--font-size-s` | 14/20 | 12/16 | 11/14 |
| Body | `--font-size-m` | 16/24 | 14/20 | 12/16 |
| Large | `--font-size-l` | 18/26 | 16/24 | 14/20 |
| H3 | `--font-size-h3` | 22/28 | 20/28 | 16/24 |
| H2 | `--font-size-h2` | 26/32 | 24/32 | 20/28 |
| H1 | `--font-size-h1` | 32/40 | 28/36 | 24/32 |
| Display S / M / L | `--font-size-display-s/m/l` | 36/44 · 40/48 · 48/56 | 32/40 · 36/44 · 44/52 | 28/36 · 32/40 · 40/48 |
2.3 **17 styles** (tracking in px):

| Style | Level | Weight | Tracking |
|---|---|---|---|
| Display L / M / S | Display L / M / S | 500 | −0.5 |
| Heading/H1/medium · H2/medium · H3/medium | H1 · H2 · H3 | 500 | −0.3 · −0.2 · −0.1 |
| Heading/H4/semibold | Large | 600 | 0 |
| Body/L/regular · Body/M/regular (default) · Body/S/regular | Large · Body · Small | 400 | −0.1 · 0 · +0.1 |
| Label/L/medium · Label/M/medium | Large · Body | 500 | −0.15 · 0 |
| Label/S/medium (in-chart data labels only, rule 2.7, 10.11; 2.0.6) | Small | 500 | +0.1 |
| Code/M/regular · Code/M/medium · Code/S/regular (mono) | Body · Body · Small | 400 · 500 · 400 | 0 |

Retired classes still work and render as: Code regular / medium → Code/M; Label/M/semibold, Label/S/UPPER, Caption UPPER, Body/M/medium, Heading/H4/medium → Label/M/medium; Label/L/semibold → H4; Body/L/medium → Label/L/medium. Caption semibold UPPER, H3 uppercase, H4 upper, Label/L upper → Label/M/medium; `.t-display` → Display/M. Label/M/UPPER is removed (style, tokens and class).
2.4 **Pick the style by role:**

| Role | Style |
|---|---|
| Hero or form page title (rare) | H1 |
| Page title in `PageTop` (broad pages), once per page | H2 |
| Title in the thin `PageHeader` and `ExploreHeader` | Label/M/medium |
| Page section on the page background (not in a container) | H3 |
| Title of a card, panel, modal, drawer, table card, side nav, empty state; every `ContentCard` title (S and M), readiness cards, Cooper fix cards, widget cards | H4 |
| Chart card titles: every `DataVizCard` header, the chart card and the older organism card (and so `WidgetFrame`) | H4 in `--color-text` (item 11 and user decision, Nov 25; was Label/M/medium, text tertiary); the optional one-line subtitle under it Body/M/regular in `--color-text-soft` (rule 10.2) |
| Stat card titles | Label/M/medium, `--color-text-soft` (the chart subtitle colour; Nov 25, was text-softer) |
| Command list card title (`HomeRowCard`), notification titles | Label/L/medium |
| Sub-section inside a titled container | Label/M/medium, primary colour |
| Content, typed text, menu items, options, cells | Body/M/regular |
| Name, primary column, item title, key value | Label/M/medium |
| Control text (button, tab, chip, segmented, badge, nav item) | Label/M/medium; L controls Label/L/medium |
| Status, tag, badge, table header, nav group header, eyebrow | Label/M/medium |
| Meta: time, author, ID, file size, helper text, captions | Body/M/regular, secondary (`--color-text-soft`) or tertiary (`--color-text-softer`) colour |
| Long reading, L-field input | Body/L/regular |
| Code, formulas, JSON | Code/M (Code/S only inside Small text) |
| Disclaimer, footnote | Body/S/regular |

Exceptions (H3 inside a container): the Trace report issue title (the issue is the panel's main subject) and the `Calendar` month/year title.
2.5 **Heading order** follows the page from the outside in: H2 page → H3 page section → H4 container → Label/M/medium sub-section. Don't skip a level: if cards are grouped into sections, each group gets an H3. H1 and H2 are never titles inside a card or panel. The HTML level is separate from the look: pick `<h1>`–`<h4>` so the screen-reader outline stays in order (the thin header's title is the page's top heading).
2.6 **Big numbers** sit next to a label that says what they are:
- H2 (stat card M), the default (user decision, Nov 25; `StatCard` is M when no `size` is passed; was S since 2.0.4): every stat card unless a dense page layout needs S, and the only size on dashboards and in the widget builder, there with the description inline (`descriptionPosition="inline"`): one size per dashboard, never mixed with S or with below-description cards; compactness comes from density. Its height is the dashboard row unit (rule 10.3). Also the Cooper chat card number and Command "1 Year". `StatCardsRow` takes `size` per card.
- H3 (stat card S, pass `size="s"`): an option for dense page layouts when needed, e.g. numbers inside a card or section with other numbers beside it (alternatives on Build › Shape, comparison rows, before → after pairs inside a card, metric rows), where a 24 number would compete with a 24 or 20 title. Use `StatCard size="s"`, not loose heading text. A donut or gauge centre number is the StatCard S value (H3, rule 10.11).
- Display/M: one hero number that is the point of the view (not a chart centre: rule 10.11); at most one per screen.
- Label/M/medium: numbers inside content (table cells, lists, sentences). A number in a table never uses a heading style.
- Never H1 for a number. Revisit if prototypes keep overriding this.
2.7 **Small is rare.** Only disclaimers and footnotes, and text inside a fixed small shape: avatar initials at 24 and below, map pin counts, live-cursor name tags, chart axis ticks, labels inside Sankey bars. Never labels, statuses, headers, meta or anything the user acts on. Avatar initials: XL (56) H4; L (40) and M (32) Label/M/medium; S (24) and below Body/S (XS 20 and XXS 16 one initial). M and L map pins widen into a pill when the count needs it; a live-cursor tag grows with its text. In-chart data labels Label/S/medium (rule 10.11). Widget thumbnails: title H4 in `--color-text` like the chart card it previews (Nov 25), tiny text drawn as skeleton bars. Navbar wordmark fallback H3. Label/S/medium (`--font-label-s-medium`, 2.0.6) is the one Small label and exists for in-chart data labels only (rule 10.11): Inter 500, `--font-size-s` (14/20 · 12/16 · 11/14), tracking +0.1.
2.8 **Weights mean something:** 400 content, 500 every label, name and control, 600 H4 only. A row with no name or key value is all regular. In tables the name column (`primary: true`, else the first text column; `.ifs-table__td--primary`) is medium; every other cell is regular. Bold words inside text use `--font-label-m-medium-weight`.
2.9 **Case.** Title Case: page, section, card, chart, panel and modal titles, headings and navigation. Sentence case: buttons, dropdown triggers, statuses, column headers, menu items, options, field labels, Cooper prompts and answers, all content. Tags, badges and chips keep the case their text is written in (normal case, never forced). No uppercase text: only avatar initials and abbreviations are capitals. Case is a string change, not CSS.
2.10 **Status vs tag.** A status shows the object's changing state: coloured dot + 1–3 words ("Draft", "Under review"). A tag or badge shows a category, stage, count or attribute: pill, no dot ("Shape", "0/4"). One status per object; a second state is a tag or an icon. Never make a tag look like a status.
2.11 **Tabular figures** (`font-variant-numeric:var(--font-numeric)`, `.t-numeric`) for numbers people compare or watch change: table and list cells, big numbers, chart text, counters, progress and pager values. Numbers inside sentences keep normal figures.
2.12 **Line length and truncation:**
- Reading text (descriptions, Cooper answers, help, empty-state text) wraps at about 75 characters (`max-width:var(--font-measure)`, `.t-measure`).
- Titles, names, labels, buttons, tabs, statuses, table headers: one line, "…", full text in a tooltip (`.t-truncate`).
- Table and list cells: one line with "…" and a tooltip; a column may opt into wrapping to 2 lines.
- IDs and file names truncate in the middle (`TruncatedText mode="middle"`).
- Never truncate numbers, statuses in a table cell, error messages or anything the user acts on: the layout changes instead.
2.13 Paragraph spacing comes from spacing tokens, not type. Weights, letter-spacing and case are the same in every density.

---

## 3. Layout and space

3.1 **One scale.** `--space-0` … `--space-1100` (100 = 4px): 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80. Dimensions use `--size-*` (rem from `--size-4` up; `--size-0` … `--size-3` stay px, rule 11.3). Neither changes with density.
3.2 **Roles (change with density):**

| Role | Values | Use for |
|---|---|---|
| `--space-inset` | 20 / 16 / 12 | Padding of every container part, all four sides: cards (stat, chart, content), panels, drawers, popovers, empty states |
| `--space-inset-l` | 24 / 20 / 16 | Padding of modals and form cards |
| `--space-table-x` | 20 / 16 / 16 | Table card padding and table cell sides |
| `--space-stack` | 16 / 12 / 8 | Gap between blocks inside a container (fields, cards in a panel, toolbar to table) |
| `--space-section` | 40 / 32 / 24 | Gap between page sections |
| `--space-inset-nested` | 6 / 6 / 4 | A control nested in a control: the Select XL trigger pads its inner field by it (Nov 24) |
3.3 **Containers.** Every part of a container (header, tabs, body, footer) has the same inset on all four sides. A container's height comes from its padding, never a fixed height. Chat, history and agent headers: vertical padding = inset − 4 (`--space-100`), i.e. 16 / 12 / 8; the height = tallest item + that padding (chat and history headers 60 / 48 / 40; the agent window header 68 / 56 / 44, because it holds an M button).
3.4 **Fixed steps only where a part scales by its own height:** inside controls (buttons, fields, selects, tabs, chips, prompts, chat input), the nav bar and side nav, chart geometry, table-like rows and cells, and gaps of 8 or less (icon to label, label to field). These stay the same in every density; each is commented in the CSS. The allowed kinds: list and note rows (fixed vertical step, inset sides); a tab row sits on its divider (no bottom padding); full-bleed lists leave side padding to their items; the collapsed panel rail; header bars (`PageHeader`, `ExploreHeader`): tallest part + 4 top and bottom, page margin at the sides; never a fixed height. So the thin header is 50 / 46 / 42 with a stepper (the stepper is 42 / 38 / 34) and 36 / 32 / 32 without one (S buttons and icon buttons), and the ExploreHeader 36 / 32 / 32 (Spacious / Comfortable / Compact).
3.5 **One height ladder** (`--size-control-xs|s|m|l|xl`). Every component height uses a step; every control's S / M / L is s / m / l, including small segmented controls, icon buttons, nav items and breadcrumbs:

| Step | Spacious | Comfortable | Compact | Used by |
|---|---|---|---|---|
| xs | 24 | 20 | 20 | badge S |
| s | 28 | 24 | 24 | control S (incl. the small icon button square), chips, `CooperChip`, `RoleSelect`, badge M, the Explore map-bar search |
| m | 36 | 32 | 28 | control M, badge L, prompts M, search, Smart Search, popover search, phone picker, checkbox and radio rows, nav tree rows, the search card, menu and list items |
| l | 44 | 40 | 32 | control L, prompts L, `Pager`, large list items |
| xl | 52 | 48 | 40 | `Select` XL trigger (its inner field fills it minus `--space-inset-nested`: 40 / 36 / 32), Cooper history search |

Rows keep their own tokens: tabs `--size-tab-m` 40 / 36 / 32 and `--size-tab-l` 48 / 40 / 36; nav rows `--size-nav-row` 44 / 40 / 36; table rows and header (rule 3.7).
3.6 **Fixed sizes (not on the ladder, the same in every density):** app chrome (nav bar 48, side nav, rail, Cooper button), avatars and media, chart and map geometry, calendar dates. Everything else with a height is on the ladder (rule 3.5) or a row token.
3.7 **Tables:** rows `--size-table-row` 64 / 52 / 40, content centred; header `--size-table-header` 40 / 32 / 24, text centred, no vertical padding; cells have no top/bottom padding; hairline row separators at most. One density per table. Every table, including ranked and approval-chain tables, sits in the one table card (`.ifs-table-card`, `--radius-card` 4, `--color-surface-secondary` fill).
3.8 **Menus, dropdowns and popovers:** 4 (`--space-100`) from the trigger and 4 inside the list, every density; tooltips also sit 4 from their trigger. Item height = ladder m (large lists l, rule 3.5). `Menu` width s 200 (actions) or l 320 (items with descriptions).
3.9 **Target size: nothing clickable is smaller than 24 × 24** (`--size-target-min`, WCAG 2.5.8):
- The clickable component's own box is at least 24 (table filter and sort, version toggle, title menu ▾, select clear, drag handles, node-card buttons, readiness indicators, timeline and Cooper toggles). Icons keep their size; hover and focus fill the box. The Figma component gets a 24 frame.
- An invisible 24 hit layer only where the control must look smaller: bare checkbox, small switch, slider thumb, the options of a small segmented control (ladder s outside: 28 / 24 / 24; the options are s − 4 inside the 2 frame: 24 / 20 / 20; each option's area reaches the full outside height), and the range-field stepper (it keeps its look; each 16 × 8 half gets an invisible area 24 wide and 12 tall, growing outward so the halves never overlap).
- Chart marks (G8, 2.0.6): point marks (scatter, bubble, line points) answer within 12 of their centre (a 24 hit area), and a column chart's whole column is the hit area of its bar (rule 10.6). Where marks sit closer than 24, the chart's table view (one click, same page) and arrow-key navigation are the equivalent, so every chart with marks offers both (rules 10.6, 10.10). Heatmap cells keep at least a 24 pitch, or rely on the same table equivalent. Map pins: deferred to phase 2 Explore; until then the hierarchy list is their equivalent. Touch targets (44–48): with the tablet and mobile work.
3.10 **Small fixed gaps:** stat card title to number 4 (the dashboard stat card, M with the description inline: one `--space-inset`, rule 2.6); empty state: icon, heading and text one inset apart (20 / 16 / 12), buttons one `section` below the text; Cooper's empty chat text sits two `section` above the bottom (80 / 64 / 48).
3.11 **Density.** Users pick Spacious, Comfortable or Compact (`data-density="spacious|comfortable|compact"` on `<html>` or any container; `IFS.setDensity('compact')` sets and remembers it, `IFS.getDensity()` reads it). Figma builds Comfortable and Compact; the code also has Spacious.
- Density changes only: type, component heights (rule 3.5 and the row tokens), the room inside containers (`--space-inset`, `-inset-l`, `-table-x`, `-stack`, `-section`) and fixed table column widths (`--density-scale` 1.2 / 1.05 / 0.95).
- Density never changes: the page frame (grid, margins, gaps: rule 3.13), panel and overlay widths, app chrome, icons, avatars, radius, borders, the focus ring, elevation, blur, z-index, colour, motion, the 24 minimum target.
3.12 **Layout spacing in screens uses `IFS.Stack` (top to bottom) and `IFS.Inline` (side by side, in reading order),** never a hand-written `display:flex; gap`. Props on both:
- `gap`: a role (`inset`, `stack`, `section`, `page-gap`) or a scale step as a string (`"200"`); default `stack`; anything else warns and falls back to `stack`.
- `align` start | center | end | stretch (Inline also `baseline`), default stretch; `justify` start | center | end | between, default start. Logical values only.
- Inline `wrap` (default off; wrapped rows keep the gap). `as` (element, default `div`), `className`, `style` (size and surface only, not layout).

Cards on the page grid use `.ifs-grid` (rule 3.14). Components keep their own CSS.
3.13 **Breakpoints and page grid, by screen width.** Designs use a 1440 × 810 desktop reference frame.

| Name | Width | Columns | `--page-margin` | `--page-gap` (gutter) |
|---|---|---|---|---|
| xs | < 600 | 4 | 16 | 16 |
| sm | 600–1023 | 8 | 24 | 16 |
| md | 1024–1439 | 12 | 24 | 16 |
| lg | 1440–1919 | 12 | 24 | 20 |
| xl | 1920+ | 12 | 32 | 32 |
3.14 **Cards and page regions snap to columns:** `.ifs-grid` with `.ifs-span-N`; `.ifs-span-panel` / `.ifs-span-rest` for a side column that is part of the page (3 columns, 4 below 1440; Command's right column is one of these, on columns). Below 1024 quarters become halves and wider spans go full width; below 600 everything is full width. Content inside a card follows the card, not the grid. Cards on a page are `page-gap` apart.
3.15 **Page container:** wrap each page's content in `.ifs-page`. It has the page margin on all four sides (top and bottom match the sides: 16 / 24 / 32 by width), caps content at `--layout-max-content-width` (1600), centres it, and spaces blocks a page gap apart. Docked panels sit outside it.
3.16 **The grid follows the content area** (beside the side nav and any pushed panel). A pushed panel shrinks it and the columns step down (12 → 8 → 4) like a smaller screen. An `over` panel or overlay (floating Cooper chat, evidence chain, popover, modal) never changes the grid.
3.17 **Fixed widths:**

| Surface | Width | Token |
|---|---|---|
| Side nav / rail | 240 / 48 | `--region-sidenav` / `--region-rail` |
| Side panel, drawer, widgets drawer | 380 (min 320, max 50%) | `--region-panel` |
| Cooper full chat | 380 by default; resizable by drag from 380 to 720 | `--region-panel` … `--layout-chat-width-max` |
| Large panel (Study) | 600 | `--region-panel-l` |
| Popover (default; never under 160; wider only at `--layout-modal-width-m` 440 or `-l` 600), collaborators panel, Layers popover | 320 | `--layout-popover-width` |
| Modal (default / wide) | 440 / 600 | `--layout-modal-width-m` / `-l` |
| Approval chain popover | 440 | `--layout-modal-width-m` |
| Cooper history column | 240 | side-nav width |
| Form card | 464–680, content slot min 400 | — |

Docked panels sit flush against the content-area edge; the page beside them keeps its margin.
3.18 **Panel mode by job** (`Component.panelMode`; a screen overrides it only with `AppShell panelMode`; no third mode):
- `push`: the user works with the panel and the page together; the content shrinks and reflows. Panel, readiness evaluation, CommentsPanel, WidgetsDrawer, TraceReport, the row and record preview (RecordPreview, Nov 24), ApprovalChainPanel as a sidebar (it also opens as a 440 popover, the reviewer's form, or full screen).
- `over`: the panel is the focus and the page is context. No scrim; the page stays usable; outside click or Esc (rule 9.6) closes it (`onPanelClose`). EvidenceChainDrawer, ActivityPanel, Cooper full chat (the Cooper button in the bottom sheet hides while it's open). Floating surfaces sit one `--float-inset` (= `--page-margin`) in: the floating drawer, the Evidence drawer, over panels, the Cooper full chat, map slots (rule 13.3) and the snackbar stack, measured below the page or Explore header, above the bottom sheet and from the window edge.
- **Open or folded at the start, by job:** a pushed panel that is part of the user's workflow (a checkpoint they go through before they submit) starts open (`Panel` default): System confidence on the work steps inside an entity (Build › Shape and Refine, Plan › Setup and Compare, a framework's Review step). It folds to its 48 rail only when the user folds it or by rule 3.19. A panel with extra information outside the workflow starts folded to its rail (`defaultExpanded={false}`). Every panel can fold; `Panel collapsible={false}` only when a screen is specifically asked to stay open (none today, Nov 20).
3.19 **Side nav folds to its rail** below md (1024) and whenever a pushed panel would leave the page area under 800 (`--layout-content-min`); with a 380 panel that is below 1440. The rail expands over the content; outside click or Esc (rule 9.6) folds it back. Below md a `push` panel also becomes a rail that expands over the content.
3.20 **App shell:** nav bar (48, sticky, full width) on top; side nav (240) below it on the start side; page header at the top of the content area; content on the grid or a canvas; bottom sheet (40) at the bottom of the content area; Cooper button at the end-bottom corner. The compact Cooper chat opens from the orb's spot, above the bottom sheet: the orb turns into the chat, and the orb and prompt chips hide (`display:none`) while it's open. Bars, side nav, header and panels stay put; only content scrolls. The log-in screen has no product chrome.
3.21 **Map and canvas views** fill the space between the header and the bottom sheet with a pannable, zoomable `CanvasBackground`; floating panels go in map slots (section 13).
3.22 **Tables keep their columns:** flexible columns (no `width`, or an `fr` width) never go below 120 (`--table-col-short-min`), 160 when the user's text size is larger than the default (`--table-col-flex-min`). Fixed-width columns keep their width (a number is px × `--density-scale`; the `--table-col-*` tokens give widths per column type: primary, short, user, number, date, check, action). When the columns don't fit, the table scrolls sideways inside its card.
3.23 **Reflow (400% zoom / 320 wide, WCAG 1.4.10) is in scope.** The page frame reflows; tables, maps and canvases may scroll sideways. Fold points follow the user's text size (they are read in 16px-equivalent widths). Below 720 the bottom sheet hides its prompts; the Cooper button stays.

---

## 4. Shape and depth

4.1 **Shape.** Radius and border width by role, the same in every density:

| Radius role | Value | Use |
|---|---|---|
| `--radius-mark` | 2 | small marks |
| `--radius-control` | 4 | every control at every size, segmented controls, menu items, tooltip; multi-line fields inside floating cards (the comment composer and edit box, chat bubbles, chat input and chat bar once they hold more than one line; on one line they are pills, `--radius-pill`) |
| `--radius-card` | 4 | every card, the table card |
| `--radius-floating` | 8 | popover, menu list, select list, snackbar, alert, modal, drawer, floating bar, form card, comment thread |
| `--radius-floating-l` | 12 | Cooper chat and the agent window |
| `--radius-pill` | full | chips, badges, avatars, switch, counters |

| Border-width role | Value | Use |
|---|---|---|
| `--border-width-default` | 1 | every stroke, divider and outline |
| `--border-width-selected` | 2 | selected cards and table rows (rule 1.1), pins, slider drag |
| `--border-width-emphasis` | 4 | the drag outline |

- Nested shape: an inner radius = outer radius − padding, never below `--radius-control`.
- Odd widths in Figma snap to 1. The focus ring is `--focus-ring`, 2 + 2 (rule 11.5).
4.2 **Elevation and layers.** Four elevation levels:

| Level | Token | Use |
|---|---|---|
| 0 page | — | the page |
| 1 raised | `--elevation-raised` (none) | cards, docked panels |
| 2 floating | `--elevation-floating` | popover, menu, select list, date picker, tooltip, snackbar, floating bar and floating drawer, form card, map panels, Cooper chat and button |
| 3 modal | `--elevation-modal` | modal (over the scrim), dragged items |

`--elevation-1|2|3` are the shadow primitives behind them. Z-index bands (`--z-index-*`), lowest to highest:

| Band | Value | Holds |
|---|---|---|
| `base` | 0 | the page |
| `sticky` | 50 | sticky headers and bars |
| `panels` | 100 | panels |
| `floating` | 200 | Cooper chat and button, the floating drawer, over panels, the floating bar, other people's cursors |
| `popover` | 300 | popovers, menus, select lists, date pickers, the notification tray |
| `selection-overlay` | 400 | selection overlays |
| `modal-overlay` | 500 | the scrim |
| `modal` | 600 | modals, Cooper search |
| `toast` | 700 | snackbars, Documents feedback |
| `tooltip` | 800 | tooltips |
| `max` | 999 | Cooper's cursor, the drag ghost, global loading |

- A host with layers of its own (map slots, canvas) is a stacking context (`isolation:isolate`) with local steps 1–9; no raw z-index above 9.
- Snackbars (one stack, Documents feedback included): top-end, below the header, one page margin (`--float-inset`) from the window edge, 8 apart, newest on top. Never over the nav bar or the header; they may cover docked and map panels; on the map too (rule 13.5).
- Anchored surfaces (popover, menu, select list, tooltip) sit 4 from their trigger (rule 3.8).
- **Materials (G3, Nov 25).** Which surfaces are glass, and what replaces the blur:

| Level / surface | Material | Fill | Blur |
|---|---|---|---|
| 0 page, 1 raised (cards, docked panels) | solid | the surface role | none |
| 2 floating (popover, menu, tooltip, snackbar, floating bar, floating drawer, Cooper chat) | glass | its surface role | `--blur-glass` (80) |
| Nav bar and page header | glass | its role | 10 |
| Map glass (floating bar, map tools, Cooper panel, map popovers, snackbar over a map) | glass | `--color-surface-map-glass` (black 40) on a map that matches the theme; `--color-surface-overlay` (black 85) on one that doesn't (light street map or imagery in Dark) | `--blur-glass` |
| 3 modal | over the scrim | its role | 80 |

- The UI follows the light / dark setting, never the base map. Each base map declares what it is (a map that doesn't is treated as mismatched, black 85: the safe default, decided Nov 25): `data-base-map="dark|light|imagery"` on the map container that holds the map and its slots (`.ifs-slots`; `CanvasBackground baseMap` sets it on the canvas itself, which covers only what sits inside the canvas), and `IFS.setBaseMap(kind)` on `<html>` for the snackbar stack, the one map surface outside the container (other popovers and menus on the page keep their own glass). Light-theme counterparts come with L01. Measured on stand-in maps (lowest text with red 350: dark street 6.32 / 5.81 / 4.97 at blur 80 / 10 / none; light street 5.46; imagery 5.58): re-check on the product's real map styles before release.
- A translucent surface is measured over the lightest background it can sit on (rule 9.14).
- Fallbacks: without `backdrop-filter` the same fill is used (it passes without blur); `prefers-reduced-transparency: reduce` gets solid twins (`--color-surface-elevation-1-solid`, `-2-solid`; map glass and overlay → `--color-surface-primary`) and no blur; forced colours: solid `Canvas` (rule 9.13). Lite glass: `data-glass="lite"` (`IFS.setGlass('lite')`, remembered and re-applied when the kit loads) drops `--blur-glass` to 10 for low-end machines and remote desktops; fills stay the same (USER-SETTINGS row 12, a user setting; whether an admin can set it per organisation is open).

---

## 5. Motion

Reduced motion: rule 9.11.

5.1 **Motion** (`src/foundations/motion.css`). Durations `--motion-duration-0|50|100|200|300`; curves `--motion-ease-standard` (on-screen changes), `-enter` (opening), `-exit` (closing), `-linear` (loops); distances `--motion-distance-2|16`; loops `--motion-loop-spin` 1400, `--motion-loop-pulse` 1600, `--motion-loop-blink` 1000 (the Cooper caret; not in step).

| Duration | Use |
|---|---|
| 0 | press, focus ring, tooltip closing |
| 50 | every colour change; closing small surfaces |
| 100 | small movement (switch knob, tick, chevron); opening small surfaces (tooltip, menu, popover, snackbar); closing large ones |
| 200 | opening large surfaces (modal, drawer, over panel, Cooper chat); size and layout changes (table height, push panels, progress, a deleted row, widget re-flow) |
| 300 | the tooltip's pointer wait (keyboard focus shows it at once) |

- Closing is one step faster than opening. Opening surfaces move 2; snackbars and notifications slide 16 from the end side; drawers slide from their edge. Tab changes: rows swap at once, the table height glides; push panels animate their width. Cooper's grow-from-the-orb (90%) is a Cooper pattern exception. Snackbar timing: rule 14.12.
- Never animates: the focus ring, numbers (they never count up) and chart data, page changes.
- Reduced motion: rule 9.11.
- Built in the kit: enters, exits (`IFS.useExit(open, ms)` keeps a closing surface mounted with `.is-leaving`), the table-height glide when rows change, push-panel width (AppShell fires one resize at the end so maps and canvases redraw once). Not built yet: the chevron turn and the side-nav fold width.

---

## 6. Iconography and imagery

Icon drawing rules (grid, stroke, metaphor, naming), the small-visuals language and empty-state art are open (section 15).

6.1 **Icons** are drawn at 12, 16 or 24 in every density (no scaling); the size follows the component's size: `Button` S 12, M and L 16; `IconButton` 16 at every size; 16 in dense rows; 12 in badges and chips; 24 only for standalone icons. Every expand/collapse and dropdown caret is 16; trend arrows next to numbers stay small.
6.2 **Icon-only controls are always `IconButton`** (ghost S by default): select clear ×, table filter, node-card Open / Delete / Save / Cancel, compare clear, answer-field cancel / save, popover search clear, the timeline phase toggle (caret `IconButton` S; the phase name is plain text). Drag grips are 16 in a 24 box and use the ghost-button hover fill. The focus ring applies where the handle is keyboard-focusable (table row and column-settings handles); the node-card grip is pointer-only (the card itself takes keyboard focus).

---

## 7. Interaction and states

The focus ring: rule 11.5; target size: rule 3.9; tooltips: rule 14.11.

7.1 **State model (S2, Nov 24): one model for every family.** Hover is the most visible step; pressed sits below hover, never equal to it.

| State | Rule |
|---|---|
| Default | the family's rest fill |
| Hover | the most visible step: alpha fills +5 or more; white fills 75% (`--color-background-neutral-stronger-hover`) |
| Pressed | below hover, never equal to it: between rest and hover, or below rest; white fills 60% |
| Selected | strongest fill or white + `--color-border-selected` / strong; hovering a selected item brightens it, never dims it |
| Focus | the ring only (rule 11.5); no fill change |
| Disabled | its own disabled fill, never the rest fill (5%: `--color-background-neutral-softer`, `-softer-inverse` on tertiary); text and icon `--color-text-disabled` / `--color-icon-disabled`; no hover; a tooltip says why (rule 9.10) |
| Loading | keeps its size; data shows a skeleton, an action shows the loader (`system-loader`) in place of its icon (`Button loading`); `aria-busy`; not clickable |
| Error | input families only: `--color-border-danger` + icon + message (never colour alone) |

| Family | Members | Hover | Pressed | Selected | Focus | Disabled | Loading | Error |
|---|---|---|---|---|---|---|---|---|
| Actions | Button, IconButton, CircularButton, FTA, Prompt | ✓ | ✓ | — (toggle buttons: aria-pressed = selected) | ✓ | ✓ | ✓ Button | — |
| Selection controls | Checkbox, Radio, Switch, Chip, SegmentedControl | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ group-level |
| Inputs | TextField, TextArea, Select, Search, SmartSearch, DatePicker | ✓ border | — | — | ✓ (typing = focus) | ✓ | ✓ Select options | ✓ |
| Nav items | NavItem, Tab, NavBar item, nav-tree row, Breadcrumb crumb, header item | ✓ | ✓ | ✓ current | ✓ | ✓ | — | — |
| Cards and rows | ContentCard, NodeCard, Table row, HomeRowCard, Notification | ✓ if clickable | ✓ if clickable | ✓ | ✓ | ✓ | ✓ | — |
| Read-only display | StatCard, Badge, Status, Indicator | — | — | — | — | — | ✓ | — |

- Ladders on roles: ghost button and header item 0 → 15 → 10 (header pressed = the current page's 10); draw bar the same; secondary and switch off 10 → 15 → 5, disabled 5; tertiary disabled black 5; segmented selected 15 → 20 → 5; checkbox and radio off border 60 → 85 (`--color-border-control-hover`) → 15, disabled 10; white ladders (primary, checkbox, radio, chip and switch on, select check) 100 → 75 → 60.
7.2 **Loading and empty:** skeletons only inside the component that owns the async data; shell, nav, header and static labels render at once. Unknown shape → spinner; user-triggered action → the button's loading state (`Button loading`); one loader everywhere, the dotted `system-loader` (spun on `--motion-loop-spin`, 1.4 s a turn); measurable work → progress bar. Never loading → empty → content: hold the skeleton until the final state is known. The empty-state variant is chosen by cause (first run, empty container, all done, error, no access, no results), never by surface; Full size for a page region, Section size inside a card or panel. Errors and partial data (L3, Nov 24): an error stays in the region that failed: a widget, card, panel or table that can't load shows `EmptyState cause="error" size="section"` in its own frame and the rest of the page keeps working; `size="full"` only when the whole page has nothing. Partial data keeps what loaded, with a warning `Alert` above the region ("2 of 5 sources didn't load." + Try again); never replace the content. A load failure uses the warning tone (the system's problem, nothing the user did wrong; `cause="error"` already shows the warning icon); danger red stays for destructive actions and for field validation (field errors unchanged, rule 8.18). Empty, error, no access and no results stay distinct: the 7 causes (rule 8.22). The look of these states is restyled in 2.0.7 (components).

---

## 8. Content

Format every value with `IFS.format` (`dist/api.md` → format); it follows the user's locale (en-US default; `IFS.format.configure({ locale, currency, fyStartMonth, accounting, compactStyle })`). The rules in this section describe English; other languages follow CLDR, except K / M / B (rule 8.26). Readers are experts short of time making decisions worth millions: words are exact, short and calm.

This section is writing guidance for screens, as in other large design systems (Material's writing guidelines, Carbon's and Polaris's content guidelines). Text in components (dialog titles, empty states, alerts, labels) is the screen's content, passed as props; the words in the kit's patterns and examples are samples, not rules (Nov 20).

**Voice**

8.1 Catalyst sounds like a trusted planning analyst. Conclusion first, then the reason ("Reliability is 1.1 min over target. The June storm caused most of it.").
8.2 Specific: name the thing, the number and the time ("6 investments are 10 weeks late").
8.3 Plain and short: everyday words, sentences of about 20 words at most, no internal jargon; domain terms users know (SAIDI, capex, NPV) are fine.
8.4 Talk to the user as "you"; "we" only for the company, rarely.
8.5 Calm: no exclamation marks, hype or emoji. Success is stated, not celebrated. Tone shifts with the moment (routine brief, warnings direct with the consequence, errors serious and helpful, never cute); the voice doesn't.
8.6 Honest about certainty: Cooper shows sources and confidence and never pretends to be a person. Cooper is always "Cooper", never chatbot, bot or "the AI".
8.7 Words to avoid: please, sorry, oops (say the fact and the next step; "sorry" once, only when the product truly failed); simply, just, easy, obviously; seamless, powerful, robust, magic, smart, AI-powered; leverage, utilize, facilitate, empower (use, help, let); click here, here, a bare "learn more"; invalid, illegal, failed, fatal, abort, a bare "error"; `!`, emoji, ALL CAPS. A quoted file or system name is the only exception.
8.8 Write for everyone: gender-neutral words; prefer "select" and "choose" in instructions; no idioms, sports metaphors or culture-specific jokes; one idea per sentence; common contractions (can't, don't, isn't).
8.9 One term per idea: investment (not project), portfolio, scenario (not what-if), value framework, constraint, approve / approval (not sign off), sign in / sign out, email, capex and opex ("capex" in running text, "Capex" to start a label; never CAPEX or CapEx, the same for opex). US spelling (optimization, prioritize). Write names as their owners do (Cooper, IFS, stage names, records as entered) and acronyms as acronyms (FY27, SAIDI, NPV).

**Labels**
8.10 Start with a verb and name the object unless context names it: "Add model", "Send for approval"; "Save" at the foot of an edit form.
8.11 Never "OK", "Submit", "Yes" / "No" alone. A dialog's secondary action is "Cancel" or a real alternative ("Keep draft").
8.12 Same action, same word: Delete removes for good; Remove takes out of a group; Archive hides and can be undone; Create makes something new; Add puts an item in a container.
8.13 Ellipsis `…` on a label only when the action needs more input ("Rename…"); none when the dialog it opens has nothing to fill in.
8.14 Links say where they go ("See the storm report"); a link in a sentence is part of the sentence.
8.15 An icon-only button's `label` (tooltip and accessible name) is verb + object: "Delete file", "Previous month".
8.16 Cooper prompt chips are questions or requests as the user would type them ("Why did Northeast slip?"). Prompts relate to the current screen or query; never generic.
8.17 No end punctuation on buttons, labels, titles, tabs or menu items. Full stops on full sentences in body text, descriptions, messages and tooltips (a 1–3 word tooltip needs none).

**Messages** (what happened, why if it helps, what to do next; important words first)
8.18 Errors (`Alert type="error"`, field errors, `EmptyState cause="error"`): what went wrong in the user's terms and how to fix it; no blame ("You entered…"); never a code alone (a code may follow the sentence when support needs it). Field errors say what's needed: "Enter a date after Jan 1, 2027", "Name is required". System errors: "Couldn't Load Frameworks" / "The server didn't respond. Try again in a minute." Load failures use the warning tone, in the region that failed (rule 7.2). Button: **Try again** (not Retry). Form summary: "3 fields need attention" + list.
8.19 Warnings: the risk, its consequence, the way out ("Weighting is no longer balanced. …" + "Rebalance weights").
8.20 Success: past tense, object first, 2–5 words ("Investment saved", "3 investments moved to Plan"). Add a description only if it says something new. Offer Undo instead of a confirmation for reversible actions. Don't toast what the screen already shows.
8.21 Info: neutral and short, only when it changes what the user does next ("This framework is active, so it's read-only.").
8.22 Empty states: the heading states the situation, the body the next step, the button does it:

| Cause | Heading | Body | Button |
|---|---|---|---|
| first-run | No Value Frameworks Yet | Create your first framework to start planning. | Create framework |
| empty-container | No Models in This Framework | Add a model to start scoring investments. | Add model |
| all-done | All Caught Up | No frameworks are waiting for approval. | — |
| error | Couldn't Load Frameworks | The server didn't respond. Try again in a minute. | Try again |
| no-access | You Don't Have Access to This Framework | Ask the framework owner to share it with you. | Request access |
| no-results | No Frameworks Match Your Filters | Try a different term, or clear filters to see all frameworks. | Clear filters |
| no-results-similar | No Results for "WDRM-2" | You might be looking for + chips | — |
8.23 Loading: prefer a skeleton. Text is "Loading…" or "Loading investments…" with the `…` character; long jobs say what and how far ("Re-scoring 1,621 investments… 40%"). Give `LoadingRegion` a `label` naming the content. Which indicator, when (L2, Nov 24; [NN/g response time limits](https://www.nngroup.com/articles/response-times-3-important-limits/)):

| Wait | Show | Kit |
|---|---|---|
| under 300 ms | nothing (no flash) | `LoadingRegion delay` (300) |
| 300 ms – 10 s, known layout | a skeleton of that layout, kept at least 300 ms | `LoadingRegion skeleton`, `minDuration` (300) |
| 300 ms – 10 s, unknown shape or an action | the dotted loader (`system-loader`, rule 7.2); for an action, in its button | `Spinner`; `Button loading` |
| over 10 s | determinate progress saying what and how far ("Re-scoring 1,621 investments… 40%"), with Cancel where possible; the page stays usable | `ProgressBar showValue` |
| appending to a list | a loader at the end of the list | `LoadingMore` |
8.24 Confirmations: ask only when the action can't be undone or affects other people; otherwise act and offer Undo. Title = action + object as a question ("Delete This Comment?"); body = the specific consequence ("… This can't be undone."); primary repeats verb + object ("Delete comment"), destructive style where Figma has it; secondary "Cancel". Never "Are you sure?", never Yes / No / OK.

**Numbers and dates** (helpers in brackets)
8.25 Money: under $10,000 in full, no cents unless present ($8,450 · $12.50); from $10,000 K / M / B with 3 significant digits ($860K · $19.4M · $3.04B) [`money`]. Zero "$0". Negative: true minus `−` (U+2212) before the symbol, never a hyphen (−$1.8M); a user setting switches finance values to parentheses ($1.8M) [`configure({ accounting: true })`, or `money(v, { accounting: true })` for one value]. Changes always signed (+$1.3M) [`change`]. A column, axis or comparison uses one unit and fixed decimals [`money(v, { unit: 'M', decimals: 1 })`]. Exact amounts in forms, exports and audit [`compact: false`]. A missing value is "—" (em dash), only from `IFS.format` [`empty()`]; `Table` renders missing cells as "—" read "No value". Zero is never a dash.
8.26 K, M, B in every English locale (en-US, en-GB, en-IN …): capitals, no space, no full stop; never MM, mn or bn. Other languages follow CLDR. An organisation setting overrides it [`configure({ compactStyle: 'auto' | 'kmb' | 'locale' })`; `auto` default, `kmb` K / M / B everywhere, `locale` CLDR everywhere]. `$` is US dollars; for another currency, or users across "$" countries, show the code once in the header ("Cost (CAD)"). Negatives never rely on colour alone.
8.27 Numbers: thousands separators from 1,000; counts not abbreviated unless space forces it [`number(v, { compact: true })`]. Decimals as the decision needs, the same within a column. Ratios as plain numbers ("2.4", no "x"). Numerals for all numbers, including one to nine; words only in idioms. Units: a non-breaking space between number and unit, short units in tables ("5.1 min"), full words in sentences [`number(v, { unit })`]. Number ranges: en dash, no spaces, symbol repeated ("28–35%", "$1.2M–$1.8M"); in sentences "from … to …". Date ranges come from `dateRange` (rule 8.29).
8.28 Percentages: no space before `%`; up to 1 decimal, whole numbers without one ("48%") [`percent`]. A change in a percentage is in points ("rose 3 points", "+3 pts").
8.29 Dates: "Nov 12, 2026" default [`date`]; "November 12, 2026" in sentences and formal text; "Nov 12" when the year is obvious; "Nov 2026" for a month; ranges "Nov 12 – 18, 2026" [`dateRange`]; ISO only in exports. Never all-numeric dates in English UI. Data dates `YYYY-MM-DD` are calendar dates read in local time. Weekdays only when they matter ("Due Fri, Nov 13"). Weekday names and the first day of the week come from the locale (`IFS.format.weekStart()`).
8.30 Times: "3:44 AM" (minutes always; the locale decides 12/24h) [`time`]; "Nov 12, 2026, 3:44 AM" [`dateTime`]; add the time zone when several zones share a deadline ("5:00 PM PT"). Relative time for recent activity ("just now" under 45s, "5 minutes ago", "yesterday", "4 days ago"; from 7 days the date) [`relative`], with the exact time in a tooltip; absolute dates for deadlines and anything legal or financial. Durations "2 hr 15 min" in tables, "2 hours 15 minutes" in sentences, countdowns "3h left".
8.31 Fiscal years: FY27 [`fy`]; ranges FY27–FY31 [`fyRange`]; quarters Q2 FY27; FY2027 only where two digits are ambiguous. Never "FY 2027", "FY'27", "fy27" or "FY27-31". A fiscal year is named for the calendar year it ends in. Its start month is an admin system setting [`configure({ fyStartMonth })`, default January]. Plan uses fiscal years and quarters; labels stay short ("Cost FY27"); a fiscal-year header's tooltip shows only its dates [`fyDates(fy)` → "Apr 1, 2026 – Mar 31, 2027"]. Calendar quarters are "Q1 2026".
8.32 Mock data keeps numbers as numbers and formats them at render. Stories and demos use made-up people and organisations.

---

## 9. Accessibility

9.1 Target size: rule 3.9. Text in rem follows the user's own default text size (rule 11.3). Reflow: rule 3.23.
9.2 Every icon-only control has a tooltip and an `aria-label` (the same verb + object, rule 8.15). Text only for screen readers uses `.ifs-sr-only` (Figma: Visually Hidden).
9.3 Never colour alone: meaningful status has an icon (rule 1.1); negatives keep the minus sign; errors have an icon and text.
9.4 Focus is always visible (the shared focus ring, rule 11.5). Tooltips also show on keyboard focus.
9.5 Heading levels follow the outline, independent of the visual style (rule 2.5).
9.6 Esc closes popovers, menus, drawers, `over` panels, the end panel over a narrow map, the expanded side-nav rail, Layers and comment callouts; focus returns to the trigger (rule 9.17).
9.7 Menus and lists: arrow keys, Home / End move; Enter picks; Esc or outside click closes. A multi-select's anchor is its only tab stop; its chips are display-only.
9.8 Breadcrumbs: each crumb is a tab stop; the current crumb is plain text with `aria-current="page"`; separators aren't focusable.
9.9 `LoadingRegion` announces "Loading <label>" and "Loaded"; the `Spinner` inside it has no live role of its own, so nothing is read twice (a standalone `Spinner` keeps its role).
9.10 A disabled action carries a tooltip saying why; an action that never applies is left out, not greyed.
9.11 Reduced motion (`prefers-reduced-motion`), one rule for the whole system: movement snaps or fades (the 2 and 16 distances go to 0; drawers and the Cooper chat fade instead of sliding or growing; chevron, switch knob, slider, progress and push-panel widths change at once); colour and opacity fades stay; loops stop, except the spinner, which slows to 3 × spin. Components need no rule of their own (`src/foundations/motion.css`).
9.12 No red (danger) or purple body text on hover fills (also rule 9.14).
9.13 **Forced colours (G1, Nov 25; Windows High Contrast).** One block in `_core.css`: box-shadow strokes become a 1 px `CanvasText` outline inside the box (no layout change); selected items are `Highlight` / `HighlightText` and tabs get an underline (never a fill change alone); knobs and dots are `CanvasText`; disabled is `GrayText`; glass turns solid `Canvas` with no blur; status dots and map pins keep their colour with a `CanvasText` edge (`forced-color-adjust: none`); focus stays a `Highlight` outline and wins over the stroke outline. Charts follow Power BI's high-contrast model (`charts.css`): data marks in `CanvasText`; bars, areas and slices a `Canvas` fill with a 2 px `CanvasText` outline; hover / selection `Highlight` with the other marks at 40%; each line series its own dash style and point shape, legend swatches matching; bars, stacks and donuts told apart by the gap, outlines, legend order, tooltip and table view; no pattern fills by default. Our own choices where no system documents one: heatmaps keep their ramp with an outline per cell and the value printed in each; the gauge draws its value arc in `CanvasText`. System colour keywords appear only inside `@media (forced-colors: active)`. Simulated: check every family on real Windows (Edge, Chrome, Firefox; Night sky and Desert) before release.
9.14 **Contrast targets (G2, Nov 25): WCAG 2.2 AA.** Text 4.5:1; large text (24, or 18.66 bold) 3:1; UI parts, the focus ring and chart marks 3:1; disabled and decoration exempt. Translucent surfaces are measured over the lightest background they can sit on (maps: rule 4.2). Light (L01) and Flexy colours are checked against the same rule. Field boundaries are a 30% bottom line (hover 40; error = the danger outline alone; focus = the ring; disabled keeps the line at 5%, `--color-border-input-disabled`, decided Nov 25), a narrow pass (3.26 / 3.41 / 3.29 on page / card / menu): check Safari and Firefox before release.
9.15 **Tab order (G4, Nov 25)** follows the reading order; never a positive `tabindex`; one tab stop per composite (tabs, segmented control, menu, a chart's plot; in phase 2 the table grid and the map).
9.16 **Skip link:** "Skip to content" is the first tab stop of every page, shown on focus (`AppShell` renders it; it moves focus to `<main>`).
9.17 **Focus on open and close:** a dialog or drawer focuses its first field; with no field, its title (`tabIndex=-1`), never the ✕. On close focus returns to the trigger; if the trigger is gone, to its nearest container still in the page.
9.18 **Traps and shortcuts:** a modal and a drawer with a scrim trap Tab and make the rest of the page `inert` (restored on close); panels, popovers and `over` panels never trap. Single-key shortcuts work only while focus is not in a text field (input, textarea, contenteditable) and no modifier is held, and the user can turn them off (`IFS.setShortcuts('off')`, USER-SETTINGS row 13; every shortcut checks `IFS.shortcutAllowed(e)`; WCAG 2.1.4). "/" focuses the global search (the convention: GitHub, Gmail, YouTube, Linear, Salesforce; the NavBar search button carries `data-global-search`, else the page's search field). Cooper opens with Ctrl+. on Windows / ⌘+. on Mac (as Atlassian Rovo; there is no common convention for AI panels, and Ctrl+J / I / K are taken), a modifier shortcut that works anywhere; the Cooper button stays and its tooltip shows the platform's key (`IFS.cooperHotkey`). Decided Nov 25. The table grid model and map keyboard access are phase 2.
9.19 **Status messages (G5, Nov 25).** `IFS.announce(text, { assertive })` writes into one of two live regions that are in the page from load (a region created together with its message may not be read). Polite: success, undo snackbars, background jobs and notifications, "Loaded". Assertive: errors that block the user's action, and only those (`Alert type="error"` keeps `role="alert"`). `IFS.toast` announces its message; the `Snackbar` has no live role of its own, so nothing is read twice. Forms focus the first invalid field (`FormCard`). Never announce on every keystroke or filter change: announce the result count once, after typing stops.

---

## 10. Data visualisation

Decided Nov 24 (data viz round D1–D9, `prototypes/phase1-prep/dataviz/DECISIONS.md`); built in 2.0.6. Rule 10.1 is the summary.

10.1 **Charts** (2.0.6, data viz round D1–D9, Nov 24; the detail is section 10): charts come from the data-viz base inside the chart card; zero-based bars; one measure = one colour (categorical slot 1); exact values always available (tooltip, the Chart / Table switch and a screen-reader table). Charts and their legends use data-viz colours only (`--color-data-viz-*`): series take the categorical slots in order (keep it to 8 where you can; lines and areas colour up to 12, stacks and slices fold past 8), the rest into "Other" (`--color-data-viz-other`); sequential = one ramp (azure by default), diverging = azure ↔ pink. Never colour alone: legend, labels, the tooltip and ▲▼ or +/− carry identity and direction too. People (cursors, avatars) use the collaboration colours, never the data-viz palette.
10.2 **The chart card (D1).** Every chart sits in the chart card (`DataVizCard variant="chart"`, which every core chart draws): the container rule, `--space-inset` on all four sides and `--space-stack` between header, plot and legend; header, body and legend have no padding of their own. Header, from the start: title · the chart's own control (e.g. Year / Quarter, `SegmentedControl` S) · [hover / focus: Edit with Cooper, ⋯, then a screen's real extra actions] · the Chart / Table switch (icon-only `SegmentedControl` M, square segments with a centred 16 icon, always visible) · the Evidence button (always visible). The hover row takes no room until shown, so the switch and Evidence never move.
- **Title and subtitle (item 11, Nov 25):** the title is H4 (`--font-heading-h4-semibold`, `--color-text`), for hierarchy across many charts; an optional one-line `subtitle` sits directly under it (space-0) as part of the header, Body/M/regular in `--color-text-soft`, ellipsis with the full text on hover. Titles sit on the same line in every card with or without a subtitle: the header is top-aligned and the controls stay on the title row. A card without a subtitle gives that line to the plot.
- **Description (item 11):** `description` is screen-reader text (`aria-describedby` on the card, and the top of the table view); it is never shown on the card. Showing it is a user setting (USER-SETTINGS row 11, open: its placement on the card).
- **Moving (item 9, Nov 25):** the 6-dot drag handle sits before the title in the card's start inset, on hover and keyboard focus; the title never moves. Dragging works from the whole header (grab cursor, 4 px threshold, buttons excluded, title not selectable). Keyboard: the card is a tab stop; Space picks it up, the arrow keys move it one grid step, Space drops it, Esc cancels; "Move" in ⋯ does the same; every step is announced (rule 9.19). Known limit, accepted for now: the start inset is tight (the handle touches the edge and title in Comfortable and overlaps the title by 2 px in Compact). Where a moved card lands is the dashboard pattern (phase 2).
- **Edit with Cooper and ⋯ (item 9):** Edit with Cooper is its own button before the switch on cards 416 px and wider (outer width: full, half and third of a 1440 dashboard) and the first ⋯ item below that (quarter width). ⋯ holds Move, then the screen's real extra actions (`menuItems`: download, full screen, copy link, remove from dashboard).
10.3 **Card heights (D2).** The card has the fixed height, not the plot; the plot fills what the header, controls and legend leave. The dashboard row unit `--size-data-viz-row` is the height of the dashboard stat card (M, description inline, rule 2.6): 116 / 100 / 84 (Nov 25; replaces item 6's S-inline unit). Default card `--size-data-viz-card` = three rows plus two page gaps (`--page-gap`): 380 / 332 / 284 at the 16 gap, growing with the gap from 1440 and 1920 px (1440 Comfortable 340, 1920 364), so stat cards stacked beside a chart line up at every breakpoint (4 rows rejected: a large card of 940 is taller than a laptop screen); large `--size-data-viz-card-large` = two default cards plus the page gap (1440 Comfortable 700, 1920 760), for heatmaps, many bars and long legends, so it lines up with the grid. Every widget in the widget builder is the default height. The same default card is used inside other components (side panels, cards): no separate small size and no S / M / L plot prop. `height` stays only as an escape hatch for chart geometry outside cards (the card then hugs the plot). Stat cards may sit beside charts (decided Nov 24, supersedes "stat cards never share a row with charts"): three stat cards stacked beside a default chart card are exactly its height, at every breakpoint. These sizes are foundation; how a dashboard places and reflows its cards (the grid, drag, resize) is the dashboard / widget builder pattern (phase 2). StatCard size: rule 2.6.
10.4 **Axes and grid (D3).** Gridlines solid 1 px `--color-border`, value axis only; the zero line solid `--color-border-strong`. 5 value labels (4 intervals) by default; `valueTicks` sets 2–8 intervals when a user asks (Cooper); labels closer than 24 thin out (every other one), gridlines stay. Category labels drop every 2nd (then 3rd …) until none overlap, keeping the first and the last; never rotated (switch to a bar chart instead). Bars, columns and areas start at zero; lines may crop. Time axes don't mirror in RTL (rule 11.4).
10.5 **Legends (D4)** sit by chart type, never between the title and the chart: line and area = names at the line ends; when they collide or don't fit, a vertical legend on the end side of the plot, like the pie and donut list, listing the lines in the order they end, top to bottom (Nov 25); their tooltip lists the series by value at that point, highest first; bar and column with several series = below, centred; stacked = below, in the stack's order; pie and donut = a list beside the chart with values (share labels on the bigger slices); heatmap and colour scales = a scale bar below; scatter and bubble = below, with a size key for bubbles. One series: no legend, the title names the measure. Map: the key stays in the Layers popover (rule 13.9). The swatch matches the mark (`LegendSwatch shape` square · line · dashed · dot); hovering an entry dims the other series; at most 2 lines, then "+N more" (names in its tooltip, values in the table view).
10.6 **Hover and tooltip (D5).** The whole column is the hit area (small bars stay easy to hit, rule 3.9); the hovered mark keeps its colour and the others darken (`--effect-data-viz-dim`), never made transparent, so gridlines never show through; no band over the column. The tooltip sits beside the mark with the same 8 gap on either side (end side first, start side near the edge), never over the mark, inside the card; content-sized (12–20rem), `--space-inset` at the start and end and `--space-300` at the top and bottom, `--space-150` from the title to the rows and `--space-100` between rows; category first, then one row per series in legend order, with the legend's swatch only when it lists more than one series (a single-series or scatter tooltip has none), full values with their unit (`tooltipFormat`, e.g. `v => IFS.format.money(v, { compact: false })`, while the axis stays compact; a chart on the default number format shows full numbers without one). It opens at once, stays while the pointer is on it (the plot keeps tracking the column under the pointer, so moving sideways goes straight to the next mark; WCAG 1.4.13), closes 100 ms after the pointer leaves the plot, and Esc closes it. Keyboard: the plot is one tab stop, arrow keys move between marks (Home / End), the active mark is announced. The tooltip is never interactive and never the only place for a value (the table view has them all).
10.7 **Categorical palette (D6, v2g).** 12 colours in a fixed order (`--color-data-viz-categorical-1…12`), a dark and a light level per hue family, the lights at lower chroma so both levels look equally strong; no red, green, warning orange or Cooper copper. Keep a chart to 8 series where you can (the first 8 are distinct in normal and colour-blind vision): that is guidance, not a code cap. Line and area charts give every series up to 12 its own colour; the 13th and later draw grey as "Other" (`--color-data-viz-other`). Stacks show up to 8 named segments + one grey "Other" segment that sums the rest; the tooltip lists the named segments, then "Other" with its total and each folded series with its own value under it (the screen-reader text says the same). Pie and donut: up to 7 slices + "Other". Pie and donut colours follow the displayed order (slot 1 = the first, largest slice), so the dark / light alternation holds; an explicit colour wins. The same entity keeps its colour on every chart of a screen (rule 10.12). **Groups with levels inside (Nov 25):** when each group of a stacked chart is split into levels of that group (a column per objective, segments for its levels), the group takes a dark slot (1 · 3 · 5 · 7 · 9 · 11, each step 2 of a sequential ramp: azure, teal, yellow, orchid, pink, cyan) and its levels take that ramp from step 2 outwards (2 · 4 · 6 · 8, lighter = later level, rule 10.8); up to 6 groups. One flat colour per group is for 1 : 1 charts only. Bars and bar segments use the slots too (`BarChartItem color` = slot); one measure = slot 1; a colour per bar only for meaning or to highlight one bar. In-bar labels only when they pass 4.5:1 (white on the dark slots, black on the light ones). The values live in `foundations/palette.css` (`--palette-data-viz-*`), the one place to swap them.
10.8 **Sequential, diverging, status (D7).** Sequential ramps share one 9-step lightness ladder, one per hue family: azure, teal, cyan, orchid, pink, yellow (`--color-data-viz-sequential-<family>-1…9`, more = lighter on the dark card; `--color-data-viz-sequential-1…9` = azure, the default); charts use 5 classes (steps 1 · 3 · 5 · 7 · 9) unless a heatmap is dense (9). Diverging is one default, azure ↔ pink meeting at the light midpoint `core-750` (`--color-data-viz-diverging-negative-3…1 / -midpoint / -positive-1…3`). **Which side (confirmed Nov 25):** better = azure, worse = pink; when the data has no good or bad, increase = pink and decrease = azure. The tokens keep their sign names (`-negative-*` azure, `-positive-*` pink); when an increase is better (a benefit going up), the better side still takes azure, so that screen maps its increases to the `-negative-*` tokens. Always with ▲▼ or +/− and a legend naming both sides; red ↔ green (the red and green ramps) only as an option. Status marks: rule 1.1.
10.9 **Stacks and bars (D8).** One stacked-column component, `StackedColumnChart`: up to 8 segments + "Other" (5 or fewer read best), most important on the baseline, segment order = legend order = slot order, a 1 card-colour gap between segments. **One gap for every chart:** wherever a chart's parts touch (stack segments, grouped bars, pie and donut slices, heatmap cells, funnel stages, the gauge's value and track, histogram bins) they are separated by the same 1 gap in the card colour (`--border-width-default`; it keeps neighbours apart, WCAG 1.4.11). Grouped columns (item 7, decided Nov 25): every series and every group is drawn (4 or fewer series read best: guidance, not a cap); bars keep `--size-data-viz-bar-min` (4) and groups `--size-data-viz-group-gap-min` (8). On a resizable dashboard, widening the card is the first fix (pattern, phase 2); if it still doesn't fit, the plot scrolls sideways with the value axis and legend fixed, an edge fade showing there is more, and keyboard reach to every group (focus scrolls it into view); the table view shows everything. Never switch the chart type automatically. Corners, one language for all bars: `--radius-mark` (2) on the end away from the baseline only; the baseline end stays square; in a stack only the outer end of the whole column is rounded and inner joins are square; bars shorter than twice the radius draw square. `VerticalBarChartItem` and `BarChartItem` stay only to match an existing handover screen (rule 14.8).
10.10 **States (D9).** The card keeps its height in every state and the title stays; the Chart / Table switch, the Evidence button and the legend hide while there is no data to show. Loading: the one skeleton with the slow pulse (static plot shapes in the plot area), after the 300 wait (L2). Error: `EmptyState cause="error"` (section, warning tone, Try again) inside the card (L3). Empty (no data yet): an `EmptyState` section in the card. No results (filters match nothing): `cause="no-results"` with Clear filters (kept for now; removed later if never used).
10.11 **One chart text scale** (review Nov 25), for every chart type: axis labels, legend labels, line end labels and scale or size keys = Body/S; in-chart data labels (bar-end values, slice shares, waterfall and funnel labels) = Label/S/medium (`--font-label-s-medium`, used nowhere outside charts); tooltip title = Label/M/medium and its rows = Label/M; the centre metric of a donut or gauge = the StatCard S value (Heading/H3, like a KPI number), with its label in Body/S. Text on a mark (slice share labels) takes `--color-text` or `--color-text-inverse`, whichever has the higher contrast on that fill: white on the dark slots and Other, black on the light slots, every slot ≥ 4.5:1. Chart titles stay as rule 10.2. The gauge arc is as thick as the donut ring in the same card, with `--radius-mark` ends like the bars; its number sits at the arc's optical centre with the label under it.
10.12 **The same entity keeps the same colour across every chart on a screen** (Nov 25). On an asset-class dashboard, Substations is the same colour in the line, stacked, grouped and donut charts. The screen assigns the colours per entity: pass an explicit `color` (a categorical slot) on each series or slice; it always wins over the default order, including the donut's size order (rule 10.7).

---

## 11. Tokens and system

11.1 **Raw values only in the foundations.** Colour, spacing, radius, type and shadow values live in `src/tokens.css` and `src/foundations/*.css`. Everything else uses `var(--…)`. A raw value is allowed only where Figma itself has no variable; mark it `/* raw in Figma */`.
11.2 **Semantic tokens, not numbers.** Spacing uses the `--space-*` roles and steps (rule 3.1–3.2); type uses `font:var(--font-<style>);letter-spacing:var(--font-<style>-tracking)` (rule 2.1). A style's token is its name in lowercase with `/` → `-`: Heading/H4/semibold → `--font-heading-h4-semibold` + `--font-heading-h4-semibold-tracking`, class `.t-heading-h4-semibold`. Never write a size, weight, letter-spacing, padding, gap or margin as a number. Old names are aliases only (rule 11.6); don't use them in new code: `--spacing-modal` / `--spacing-form` → `inset-l`, table cell sides → `table-x`, cell y → 0, card-compact → `stack` (the other `--spacing-*`, `--gaps-*`, `--paddings-*` likewise); `--font-size-caption` = `--font-size-s`.
11.3 **px in Figma, rem in code.** Figma stays in px. Code ships every size that holds text or icons in rem at a 16px base (16px = `1rem`): type, the spacing scale, `--size-*` from 4 up, control, tab, nav and table sizes, icons and layout widths. Still px: 1–3px lines (borders, dividers, focus rings, `--size-0` … `--size-3`), radius, letter-spacing, `@media` breakpoints, and chart, map-pin and canvas geometry. Guides give numbers in px.
11.4 **Start and end, never left and right.** All new and changed code uses logical properties (`margin-inline-start`, `padding-inline-*`, `inset-inline-*`, `border-inline-*`, `text-align:start|end`; in JSX `marginInlineStart` …). Geometry that must not mirror (chart time axes, canvas coordinates) keeps physical values with a `/* ltr: reason */` comment. In RTL the side nav moves to the right and directional icons (arrows, chevrons, back) flip; numbers, media controls, chart time axes, check marks, clocks, trends and logos never mirror. Progress: `node tools/check-direction.mjs` (it scans `src/components`, CSS including transition lists, and JSX; foundations, gallery and demo screens are not checked).
11.5 **Building kit components** (`src/components/<family>.css + .jsx`, one pair per Figma family):
- Match the Figma component exactly; never invent one Figma doesn't have. Get exact specs with `tools/extract-spec.js` via `use_figma` and see the target with `get_screenshot`; never use `get_design_context` code as the implementation. Figma variable `a/b/c` is `var(--a-b-c)` (lowercase; spaces, `/` and `,` become `-`; parentheses dropped; no prefix): `color/text/soft` → `--color-text-soft`, `radius/card` → `--radius-card`, `blur/40` → `--blur-40` (rule 11.6). A Figma fill with no variable keeps its hex (rule 11.1).
- Class names: `.ifs-<component>` block, `--<modifier>` per Figma variant value.
- Strokes keep the Figma box: INSIDE → `box-shadow: inset 0 0 0 W`, OUTSIDE → `box-shadow: 0 0 0 W`, CENTER → `outline` with a −W/2 offset, W always a `--border-width-*` role (rule 4.1). Use `border` only when the stroke changes layout.
- States: Hover / Pressed / Disabled / Focus → `:hover`, `:active`, `:disabled` / `[aria-disabled=true]`, `:focus-visible`, plus `[data-state=hover|pressed|focus]` for the gallery.
- Focus ring (S1, Nov 24): one ring for every control at every size, `box-shadow: var(--focus-ring)` (a 2px `--color-focus-inner` gap + 2px `--color-focus-outer`, outside; meets WCAG 2.4.13); `var(--focus-ring-inset)` (2px inset blue) for items inside clipped lists and scroll areas. Never write the ring out, and never transition it. Forced colours drop box-shadow, so `_core.css` gives `:focus-visible` an outline in `Highlight` and turns the box-shadow strokes into outlines (rule 9.13). Rings that are not focus (Cooper ring, selected node and chip, active documents bar) draw their black gap with `--color-ring-gap`, not `--color-focus-inner`. Effect `blur/40` → `backdrop-filter: blur(var(--blur-40))`; blur steps are named by value: `--blur-4|10|20|40|80|100`.
- JSX: React 18 function components; each file imports `IFS` from `./registry.js`, uses other components as `IFS.Button` (no cross-family imports) and ends with `Object.assign(IFS, { … }); export { … };`.
- Props mirror Figma properties in camelCase with lowercase values (`Type=Primary` → `type="primary"`, `Size=M (32)` → `size="m"`, `show-icon-left` + `Icon left` → `iconLeft="system-heart"`; no icon prop = hidden); text properties → `children` or a named prop. Interactive components work for real and also take controlled props (`value`/`onChange`, `open`/`onOpenChange`).
- Icons: always `<IFS.Icon name="…" size={16} />` with a Figma icon name; never inline SVG or an icon font.
- The header comment names the Figma source: `// Figma: button (65:3211)`. Add every variant and state to `src/gallery/<family>.jsx` and compare the story with Figma before calling it done.
11.6 **Token names (frozen Nov 23, 2026).** Every token starts with its type word; the CSS name is the Figma path with `/` → `-`, no prefix.
- Colour: `--color-<what>-<role>-<strength>-<state>` (`--color-text-soft`, `--color-border-strong`, `--color-background-danger-strong-hover`, `--color-focus-inner`, `--color-cooper-*`). One strength scale: softest · softer · soft · (base) · strong · stronger · strongest. States: hover · pressed · focus · selected · disabled · drag (never typing, active or on: typing → focus, active → selected or open, on → selected). Twin suffix: `-solid` = the opaque twin of a glass role, for reduced transparency (`--color-surface-elevation-1-solid`, `-2-solid`; rule 4.2).
- Type `--font-<style>` (+ `-tracking`, `-weight`), `--font-size-<step>`, `--font-weight-<w>`, `--font-tracking-*`, `--font-numeric`, `--font-measure`.
- Measures: `--space-*`, `--size-*` (`--size-control-xs…xl`, `--size-tab-m|l`, `--size-nav-row`, `--size-table-row`, `--size-table-header`, `--size-badge-s|m|l`, `--size-target-min`), `--radius-*`, `--border-width-*`, `--elevation-*`, `--blur-*` (steps by value, plus the one role `--blur-glass`, rule 4.2), `--z-index-*`, `--motion-*`; effects `--effect-*` (filters such as `--effect-data-viz-dim`, rule 10.6). Custom properties a component or foundation sets for itself (`--fill`, `--ring`, `--pin`, `--map-glass` …) are local, not tokens, and carry no type word. Palette steps sit on the 50 / 100 ladder; the in-between steps (`--palette-core-165`, `-core-450`, `--palette-danger-350`, `-danger-550`) exist only for the G2 / G3 fixes (Nov 25).
- Roles only: components use colour roles (`--color-*`), never primitives (`--palette-*`, `src/foundations/palette.css`), `--element-*` or a component-only colour; `node tools/color-lint.mjs` checks it (every check in `src/components`; primitives, `--element-*` and deprecated names also in `src/gallery` and `demo/screens`; names built at run time such as `` `--color-data-viz-${x}-data-${n}` `` count; foundations are not checked; the compatibility path for old group names is marked `deprecated-ok:`). Eight colours are held unchanged, with their old names, until decided (seven are in use; `--border-blue` is defined but no component uses it): `--border-blue`, the checkbox and radio off pressed borders, the circular button fill (default, hover, pressed), `--white-500`, `--white-alpha-50`.
- Old names (`--text-primary`, `--border-base`, `--control-h-m`, `--blur-medium` …) still work as aliases (`src/foundations/deprecated.css`) until 3.0; don't use them in new code. The full old → new list: `tools/figma/rename-map.tsv`. `dist/tokens.txt` lists the new names, then the deprecated ones; `dist/tokens.json` is DTCG 2025.10 with `$deprecated`.
11.7 **Releases and versioning (G7, Nov 25):** [release.md](release.md): SemVer from 2.1.0 (releases before it are foundation-building), deprecations live at least 2 minors and 60 days, changelog headings Added · Changed · Deprecated · Removed · Fixed, other products pin an exact version.

---

## 12. Page headers

12.1 **Three headers, chosen by the page:**
- `PageTop` on broad pages: tables, libraries, landing and category pages. H2 title, optional Cooper eyebrow, one-line description, one Secondary M action ("New"), then `Tabs` with counts and a 360 `SmartSearch`. On a `DataTable` library page pass `pageTop` so the table's tab filter and search sit in it.
- The thin `PageHeader` inside one entity (an idea, investment, plan, value or strategy framework): back, Label/M title, ID, menu ▾, status, views, stepper (its steps come from the user or the pattern; never invent them), actions. The ▾ opens the entity's Activity panel (`ActivityPanel`): always pass `onTitleMenu` (the kit warns in the console when a header with an ID has none). The header is the same on every step of the entity's flow: same title, ID and ▾. A plan's title is its portfolio and its ID the planning cycle (Electrical distribution · FY27). Narrow behaviour is decided per header type.
- `ExploreHeader` on the Explore and Study map: the thin header's map variant (height rule 3.4); its small Smart Search and round filter button use the small control height.
12.2 Never stack `PageHeader` above `PageTop`. Value and Plan canvases add `CanvasHeader` under the page header.
12.3 **Thin `PageHeader` as it narrows** (fine for now, revisit later):
- The title always stays (truncates, never hides); the main (primary) button always stays.
- The stepper stays in the bar from 1100 up (centred when both sides fit around it, else between the title side and the buttons). When it doesn't fit, it moves under the status (with no status, under a "Progress" button): hover shows, click pins a popover with the steps. No separate progress row.
- Header buttons sit 8 apart.
- When one row doesn't fit: row 1 = back, title and its menu ▾; row 2 starts under the title with the ID and status together, then views, the other buttons, the main button last. Buttons that wrap onto row 3 start at the start edge.
- The title menu ▾ stays at every size, on every entity header (rule 12.1).
- Sizes come from tokens, in rem so they follow the user's text size: the stepper leaves the bar below `--bp-header-steps` (1100 of the header's own width); two rows below `--bp-header-rows` (720) or whenever one row doesn't fit; the title never gets narrower than `--layout-header-title-min` (160) or its own text, and counts up to `--layout-header-title-mid` (240) when checking whether one row still fits.
12.4 **The thin header never scrolls away,** even on short screens.
12.5 **PageTop below 720:** the tabs and the search go on separate rows; the search goes full width.
12.6 **ExploreHeader below 720:** row 1 = back / context + collaborators and comments; row 2 = the search (full width) + filter.
12.7 **NavBar** collapses to the hamburger below 800 of its own width: logo + `IconButton` secondary S `system-hamburger-menu` opening a `Menu` of the stages, with a check on the current one. Its tabs never wrap or scroll.

---

## 13. Map slots

13.1 Floating panels on a map or canvas go in slots (`.ifs-slots` on the map container), never pinned. One panel per side; a new one replaces the open one.

| Slot | Holds, one at a time | Size |
|---|---|---|
| `.ifs-slot-left` (start) | Hierarchy · Study library (opens from the 2nd map-rail button, below Hierarchy) · Search results · Study | `--region-panel` 380; Study `--region-panel-l` 600 (`.has-left-l`) |
| `.ifs-slot-right` (end) | Asset / group details · Trace report · Evidence chain · Cooper window, with Back (details → evidence → back to details) | `--region-panel` 380 |
| `.ifs-slot-top` | Selected bar, or the draw bar while drawing | content, at most `--region-map-bar` 746 |
| `.ifs-slot-bottom` | Horizon bar (`.ifs-slot-fill`), only when a study is open or a time layer is on | `--region-map-bar` 746, never wider than the gap |
| `.ifs-slot-popover` | Layers / map display, beside the tool bar | `--layout-popover-width` 320 |
| `.ifs-slot-fab` | Cooper button, end-bottom corner (the same place on every screen) | `--size-48` |
| `.ifs-slot-exit` | "Exit map preview", top start, when arriving from Build (`.has-exit` moves every slot down one control row) | — |
13.2 **Sizes come from foundation tokens**; add one if missing, never hard-code. State classes on `.ifs-slots`: `.has-left` (+ `.has-left-l`), `.has-right`, `.has-exit`. The map rail and tool bar go in `.ifs-slot-tools` (top start) and `.ifs-slot-tools-bottom` (bottom start); the start slot already leaves room for them. `.ifs-slots` is a stacking context (`isolation:isolate`, rule 4.2) with local layers: 1 top and bottom bars, tools, Cooper button, legend · 2 start and end panels · 3 the Layers popover (and the end panel over a narrow map) · 4 exit.
13.3 **Edges:** every slot sits one `--slot-inset` (= `--float-inset` = page margin, 16 / 24 / 32 by width) from the map edges; tops, bottoms and the end edge line up; neighbours sit a page gap apart. Map tools in the corners use the same edges.
13.4 **Top bar:** centred on the whole map. An open panel only nudges it aside, keeping a page gap; it is never re-centred in the space that's left. When it can't fit between the panels, it lines up with the start panel's edge and sits above it, and the start panel moves down. CSS alone centres the bar in the gap, so the kit measures it for you (`placeMapSlots`, run automatically for every `.ifs-slots`, before paint; nothing to call) and sets, on `.ifs-slots`: `.has-top-x` + `--slot-top-x` (the bar's start position), or `.has-top-start` + `--slot-top-h` (the bar's height, to push the start panel down). It clears the end panel even when that panel overlays the map. It slides in vertically only.
13.5 **Bottom bar (horizon):** the same rule as the top bar; it also clears the Cooper button, and shrinks to the space between panels when wider. The kit sets `.has-bottom-x` + `--slot-bottom-x` and `--slot-bottom-w` the same way. Snackbars on the map stay in the one top-end stack (rule 4.2), not above the horizon bar.
13.6 **No map minimum:** panels never fold because the map is small.
13.7 **Study and the right slot:** Study folds to its rail when any right panel opens, including the Cooper chat, and comes back when it closes; clicking Study hides the right panel.
13.8 **Lists and details stay open together.** Clearing the selection closes the selected bar and the details panel.
13.9 **No legend on the map:** counts go in the selected bar, the key in the Layers popover (`.ifs-slot-legend` stays for other canvases). Layers closes on outside click or Esc (rule 9.6).
13.10 **Camera padding:** when a panel opens or the map flies to a target, centre the target in the visible gap.
13.11 **Narrow:** below 1100 (`--bp-map-overlay`) the end panel sits over the map and closes on outside click or Esc (rule 9.6); below 720 (`--bp-map-sheet`) panels become a bottom sheet.
13.12 **Map data states (L4, Nov 24): split by what still works.** No full-map skeleton and no scrim or card over a map that still works.
- Loading: the base map at once, plus a small "Loading assets…" chip at the top centre with the dotted loader (`LoadingMore` "Loading assets…"); pins don't fake-load.
- The map itself didn't load (no base map, nothing to interact with): the map region is replaced by `EmptyState cause="error"` (warning tone, Try again), with "Last synced …" from `IFS.format.dateTime` ("Last synced Nov 19, 2026, 3:44 PM"). No overlay on a dead map.
- The base map works but the asset data, or one layer, didn't load: the map stays fully interactive; a warning `Alert` strip at the top of the map names what's missing ("Asset data didn't load." + Try again), and that layer's row in the Layers list shows the warning icon (`status-warning-filled`).
- Filters or search match nothing: "No results" with Clear filters inside the asset hierarchy or search panel (`EmptyState cause="no-results"`), never in the centre of the map.
- Panning or zooming to an area with no assets: no message.

---

## 14. Component use

14.1 **Buttons, not links.** Every move (open an object, go to a screen, go up a level) is a button; Ghost replaces a text link. Links stay only inside user-authored content and for external resources.
14.2 **One Primary per container** (page, panel, drawer, modal, card), usually one per page. Button sizes: L in footers of modals, form cards and panels (Cancel / Save, Undo); M in content areas and `PageTop` (the Secondary "New"); S in the thin `PageHeader`, toolbars and dense rows. Types: Primary = the single main action, Secondary = alternatives (most buttons), Tertiary = dense areas, Ghost = link replacement, Accent = hands the task to Cooper.
14.3 **Field size follows the surface:** L full-page forms, M modals, drawers and panels, S footers and toolbars, XL view-level selectors that change what the page shows. Select widths: S at most 240, M 140–400, XL 200–400.
14.4 **Forms:** every visible field is required (no asterisks; optional fields are not shown). Never disable the primary action to signal an incomplete form: on submit validate every field, show the errors, focus the first one; more than three errors adds a summary above the footer.
14.5 **Filters:** a surface is either instant (chips only) or deferred (fields that commit on Apply); never both. In a chip group values combine as OR and "All" is exclusive.
14.6 **No table pagination,** no hidden rows; the one exception is a table in a fixed-height 600 card with Show more / Show less, used when a page has several tables (Table pattern rule 1). Narrow with filters that show counts: on a library page `Tabs` with counts in `PageTop`; inside a table card a `SegmentedControl` S with counts (use it when the page already has tabs). The table scrolls with a sticky header. `Pager` is for item-by-item content, never tables.
14.7 **Collections are tables** (`Table`, or `DataTable` for any list with behaviour), not card grids. Exception: comparing 2–4 alternatives side by side uses `ContentCard` M columns with `BarChartItem` rows (colour index = the categorical slot, rule 10.7).
14.8 **Don't create new card, timeline or chart components.** Cards from `ContentCard` (M in main areas, S nested) and `StatCard`; timelines from the timeline base; charts from the data-viz base inside `DataVizCard` + `DataVizHeader`. Legacy sets only to match an existing handover screen. `NodeCard` is the one canvas exception.
14.9 **One of each:** one `Menu` for every ⋯ / overflow / split-button menu (`more` trigger; destructive items last after a divider); one `StatCard` (`compare` for from → to); one `NavBar`; one `EvidenceButton` (Cooper look, 16 icon) for chart headers and evidence; `VersionHistory` is standalone and `ActivityPanel` uses it. Two approval chains for two uses: `ApprovalChainTable` (on `Table`) is the chain people act on (notes, push, filter), on the approval page (with `stages`, Approval chain rule 10) and in the Approval chain panel (compact view); `ApprovalChain` (timeline cards) is the display-only history in `ActivityPanel`.
14.10 **Stepper is non-interactive:** a button or completion event advances it.
14.11 **Tooltips** name or clarify; they are non-interactive (anything interactive goes in a popover); in after a 300 pointer wait, at once on keyboard focus, out instantly (rule 5.1), Esc dismisses, never tap-only. Every icon-only control has one (rule 9.2). Chart tooltips are the exception to the wait: they open at once on hover or focus and stay while the pointer is on them (rule 10.6).
14.12 **Alerts have two intents:** error (stays until resolved; an error with nothing left to fix, such as a rejected upload, closes on the next action or ✕) and warning (stays while the condition holds). No info alert and no success alert. Success is one of two things: the result of the user's own action (approve, save, publish, remove, rename) is a snackbar; news that can happen while the user isn't watching (all reviewers approved, an investment approved at every gate, an optimization finished) is a notification, stored in the notification tray (`NotificationCard`) and, while the user is in the app, also shown live as a snackbar that leads to it (Nov 20). Neutral confirmation of the user's own action is a snackbar via `IFS.toast` (placement rule 4.2, 1–2 actions). **Timing (G5, Nov 25; replaces the 4 s / 5 s dwell):** a snackbar with an action (e.g. Undo) stays at least 10 s; after that it doesn't close on time alone: it closes on the user's next command elsewhere (a click that changes something, an edit, a navigation; `IFS.toast.command()` for app-level ones) and stays while the user is idle. Moving focus, Tab, F6, scrolling and clicks on empty space are not commands, so keyboard and screen-reader users can reach it. A snackbar without an action closes after 6 s (5–7). Hover or keyboard focus holds either. One action snackbar at a time: a new one replaces the previous, whose action stays reachable through the screen's undo (Ctrl+Z / history). WCAG 2.2.1: time alone never removes the chance to act. Patterns use this timing (`IFS.useSnackbarTiming` for a pattern's own snackbars); the message is announced (rule 9.19). Errors are never snackbars; removal confirmations are never alerts.
14.13 **Modals:** a focused must-complete-or-cancel task over a scrim. Width rule 3.17; at most 85% of the viewport tall. Title never wraps; ✕ top-end; content scrolls; footer actions at the end; at most two footer actions, only one of them Primary (rule 14.2; more means split the flow). Long non-blocking tasks use a drawer.
14.14 **Surfaces by job:** panel = always-relevant side context in the layout (no scrim, no focus trap); drawer = an on-demand task or detail from a screen edge (informative: close only; actionable: collapse + close; blocking: neither until resolved); popover = small anchored content (width rule 3.17, max 600 tall, header and search pinned); floating bar = actions on the current map selection.
14.15 **Product defaults** (Oct 2026 audit of the Build, Explore, Command, Plan and Value handover files, `guide/usage.json`; the rules above win): `IconButton` ghost square S; `SegmentedControl` S everywhere (card, table and chart headers, drawers, panels), usually 2 options with counts; `Tabs` M or L for page views; `Badge` white S; `Counter` S next to labels; `StatusIndicator` dot without stroke inside tabs, segments and badges; `ContentCard selected` for pick-one options; `SideNav` rule 14.19; `Button` mostly Secondary or Tertiary (sizes rule 14.2).
14.16 **Not in the DS** (say so and offer the closest component): Gantt-style schedule timeline, formula builder rows, calendar day items, map layer list, mini-map navigator, tree component (Plan uses the composed `SideNavTree`).
14.17 **A card's title row is title · meta · actions.** `meta` (ContentCard `meta`) holds short read-only info about the card at the end of the row: a count, a date, time left, a value ("9d left", "3 of 5", "Updated Nov 12"). Body/M regular, text secondary; the title keeps priority and the meta truncates first. Actions (icon button, small segmented control) come last. Anything longer than a few words goes in the description under the title.
14.18 **Cooper bar (`BottomSheet`) by page:** every page inside one entity (thin `PageHeader`) uses `type="documents"`, showing that entity's documents (Cooper's context) and upload on every step of its flow; broad pages (`PageTop`: home, libraries, lists) use the base bar, because there's no single record for documents to belong to. Explore uses none. Always two screen-specific prompts.
14.19 **Side nav = the pages of where you are.** Show a side nav only when the current level has more than one page to move between, either a stage's sections (Value) or scopes (the Plan tree), or one entity's own pages (Investment in Build › Refine). Its title names that level. Going inside an entity replaces the stage's side nav with the entity's, or with none, never both. A stepper's steps are not side-nav pages, and a few views of one page are `Tabs`, not a side nav. Open by default; it folds to its rail only as rule 3.19 says.

---

## 15. Open

- Display and Code styles: count their use in the product Figma files; remove what nothing uses.
- Chips in narrow cards wrap more at Body size (Cooper saved scenarios): accept, or truncate them.
- Status sizes XS and S share a text style: merge into one size.
- Truncation: the kit has about 47 hand-written truncation rules; move them onto `.t-truncate` + tooltip and check none truncates a number, status or error.
- H1 / H2 still used inside panels (Cooper recommendation detail, widget-builder section, form card H1, the Cooper voice transcript H1, some prototype titles): pick per case.
- Status dots: size 8 / 6 / 4; keep or remove Badge's `indicator` dot. Look-alike status components: review.
- Whether role names (Portfolio Owner) are written as names.
- Bring the Catalyst voice-check glossary into this repo.
- Benefit-cost ratio shows as "2.40x" in widget stories and "2.4" elsewhere.
- Table Horizon / Modified filters mix instant chips with an Apply period (conflicts with rule 14.5); custom periods: fiscal years (notes) or date picker (frames, built).
- Map: details panel in two columns or stacked; Build → map preview entry; the folded Study rail looks poor.
- ApprovalChain timeline vs ApprovalChainTable: both kept; revisit.
- Sizes not yet on tokens: table filter popover (240), risk pill heights, ApprovalChainPanel collapsed rail (84 vs 48), fixed heights (Cooper compact chat 360, history 400).
- Round 1 sizing, still in progress: card title row (height), pattern heights; `Counter` height (not on the ladder yet).
- Wide content: `--layout-max-content-width-wide` (2240) exists for data screens but has no class and nothing uses it; document a class or delete the token.
- Auto-reminder interval "N days" (Collaboration rule 8, Approval chain rule 8): a Figma placeholder; per tenant, not decided.
- The grid CSS reads the window width for page margin, gap and `--panel-cols`; check it against rule 3.16.
- RTL conversion to logical properties is gradual (rule 11.4).
- RTL first pass (2.0.4, Nov 20): `node tools/check-direction.mjs` is at 0 (was 165); CSS and inline styles use start/end, the rest is marked `ltr:`. Switch with `IFS.setDirection('rtl')`. Left: JS geometry (canvas and map, WidgetBoard drag, sliders and zoom, column resize, popover and tooltip placement) and charts per family.
- Should live cursors appear on framework canvases at all (`LiveCursors` is invented)?
- Data viz: Light values (with L01). 2.0.7 components (decided Nov 25): missing data in line and area charts (item 14: break the line at the gap, an isolated value as a dot, "No data" in the tooltip, opt-in `connectGaps` drawn dashed; until then lines join across missing points) and a legend position prop on every chart (item 17; defaults stay rule 10.5; the control is in the widget builder's chart editor, phase 2). Visible chart descriptions (USER-SETTINGS row 11): placement on the card when on. States and focus are rules 11.5 and 7.1 (S1–S3, Nov 24); loading, empty and error states are rules 7.2, 8.23 and 13.12 (L1–L4, Nov 24).
- Motion still to build (rule 5.1): the chevron turn and the side-nav fold width.
- Light theme: `color-scheme` and `IFS.setTheme` are in; the Light values come right after phase 1.
- `FormCard`: "a form on a page" (components.md) vs a card built like a dialog; settle the wording.
- Cooper orb gap: 12 or 24.
- Map data credit.
- Real names in stories: "DC Water" (nav-bar gallery) and a real person's name (approval gallery); replace unless cleared.

---

## Old → new rule numbers (Nov 25, 2.0.6)

Rules 2.x, 3.1–3.9, 8.x and 9.x kept their numbers. Every other rule moved. New in 2.0.6: 11.7 (releases); old section 10 Open → section 15.

| Old | New | Old | New | Old | New |
|---|---|---|---|---|---|
| 1.1 | 11.1 | 1.2 | 11.2 | 1.3 | 11.3 |
| 1.4 | 11.4 | 1.5 | 3.12 | 1.6 | 11.5 |
| 1.7 | 11.6 | 1.8 | 5.1 | 1.9 | 7.1 |
| 3.10 | 6.2 | 3.11 | 6.1 | 3.12 | 3.10 |
| 3.13 | 3.11 | 3.14 | 4.1 | 4.1 | 3.13 |
| 4.2 | 3.14 | 4.3 | 3.15 | 4.4 | 3.16 |
| 4.5 | 3.17 | 4.6 | 3.18 | 4.7 | 3.19 |
| 4.8 | 4.2 | 4.9 | 3.20 | 4.10 | 3.21 |
| 4.11 | 3.22 | 4.12 | 3.23 | 5.1 | 12.1 |
| 5.2 | 12.2 | 5.3 | 12.3 | 5.4 | 12.4 |
| 5.5 | 12.5 | 5.6 | 12.6 | 5.7 | 12.7 |
| 6.1 | 13.1 | 6.2 | 13.2 | 6.3 | 13.3 |
| 6.4 | 13.4 | 6.5 | 13.5 | 6.6 | 13.6 |
| 6.7 | 13.7 | 6.8 | 13.8 | 6.9 | 13.9 |
| 6.10 | 13.10 | 6.11 | 13.11 | 6.12 | 13.12 |
| 7.1 | 14.1 | 7.2 | 14.2 | 7.3 | 14.3 |
| 7.4 | 14.4 | 7.5 | 14.5 | 7.6 | 14.6 |
| 7.7 | 14.7 | 7.8 | 14.8 | 7.9 | 14.9 |
| 7.10 | 14.10 | 7.11 | 14.11 | 7.12 | 14.12 |
| 7.13 | 14.13 | 7.14 | 14.14 | 7.15 | 7.2 |
| 7.16 | 1.1 | 7.17 | 1.2 | 7.18 | 10.1 |
| 7.19 | 14.15 | 7.20 | 14.16 | 7.21 | 14.17 |
| 7.22 | 14.18 | 7.23 | 14.19 | 11.1 | 10.2 |
| 11.2 | 10.3 | 11.3 | 10.4 | 11.4 | 10.5 |
| 11.5 | 10.6 | 11.6 | 10.7 | 11.7 | 10.8 |
| 11.8 | 10.9 | 11.9 | 10.10 | 11.10 | 10.11 |
| 11.11 | 10.12 |  |  |  |  |

Sections: old 1 Tokens and code → 11 (motion → 5, state model → 7, Stack / Inline → 3); old 3 Spacing and sizing → 3 (icons → 6, shape → 4); old 4 Layout → 3 (elevation and layers → 4); old 5 → 12; old 6 → 13; old 7 Component use → 14 (status and Cooper orange → 1, loading and empty → 7, charts → 10); old 10 Open → 15; old 11 Data visualisation → 10.
