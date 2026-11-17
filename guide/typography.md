# Typography usage

This page covers how components use the type scale. The scale itself (the `--type-*` sizes per density, heading sizes and weights) is fixed and is documented in README.md. Here: which style each **role** gets, how that compares with the six reference systems, what changed in this pass, and what is still open.

## Role → style (the rule)

Pick the style by what the text **is**, not by how it looked in an older frame. Sizes are Comfortable; Spacious and Compact step with the density tokens.

| Role | Style | Comfortable | Case | Colour | Examples |
|---|---|---|---|---|---|
| Page title | H2 (H1 for a hero/form page) | 24/32 · 500 | Sentence | primary | PageTop heading, Executive summary |
| Panel, modal, drawer, card, section title | **H4** | 16/24 · 600 | Sentence | primary | Panel "Readiness evaluation", Modal, Drawer, DataVizCard "Portfolio under this framework", table card name, side-nav title, chat header, empty-state heading |
| Sub-section inside a titled panel/card | **Label/M/semibold** | 14/20 · 600 | Sentence | primary or secondary | Alert title, "Saved scenarios" in a Cooper message, evidence/collab/recommendation group titles |
| Content | **Body/M/regular** | 14/20 · 400 | Sentence | primary or secondary | table cells, list text, descriptions, messages, menu items, select options, checkbox labels, tooltip text, readiness rows |
| Typed text | Body/M/regular (Body/L in L fields) | 14/20 · 400 | as typed | primary | every input, textarea, search, chat composer |
| Name / primary column / item title / key value | **Label/M/medium** | 14/20 · 500 | Sentence | primary | first (name) table column, person name, file name, card title, fact value |
| Big number | H2 / H1 / Display | 24–44 · 500 | – | primary | KPI and stat-card values |
| Meta | Body/M or Body/S regular | 14 or 12 · 400 | Sentence | secondary / tertiary | time, date, author, ID, helper text, captions under numbers |
| Control text | Label/M/medium (L controls: Label/L/medium) | 14/20 · 500 | Sentence | per control | button, tab, chip, segmented control, badge, nav item, prompt |
| Field label | as Figma: Label/L/medium (L field), Label/M/semibold (M field) | | Sentence | tertiary | Field |
| Table / column header | **Label/S/UPPER** | 12/16 · 600 · +0.3 | UPPER | tertiary | table `th`, canvas column header, chart column |
| Eyebrow / group label | **Label/S/UPPER** | 12/16 · 600 · +0.3 | UPPER | tertiary / disabled | menu group, nav "LIBRARY", history date group, page eyebrow, chat-card category |
| Status lozenge / tiny tag | Label/S/UPPER or Caption/semibold/UPPER | 12 or 10 · 600 | UPPER | per status | Indicator S, risk tag, avatar initials, calendar weekday |
| Code | Code regular / medium | 12/16 | – | – | IDs in code style |

Three rules that fall out of the table:
1. **Regular is the default.** Medium (500) means "this is the name or the key value"; semibold (600) means "this is a title". If a row has nothing like that, it is all regular.
2. **Uppercase only for headers of columns, eyebrows/group labels and status lozenges.** A title is never uppercase and never Label/L.
3. **A title is H4** (or H2/H1 at page level); one level down inside a panel it is Label/M/semibold.

The same table sits as a comment above the `.t-*` classes in `src/tokens.css`.

## Inventory (src/components/*.css)

348 rules set `font:` (the review count of ~220 counted fewer files). Counted by script before and after this pass:

| Style | Before | After |
|---|---|---|
| Label/M/medium (14/500) | **116** | 77 |
| Body/M/regular (14/400) | 86 | **128** |
| Label/S/UPPER (12/600) | 45 | 31 |
| Label/M/UPPER (14/600) | 18 | 1 (Cooper brand wordmark) |
| Label/M/semibold (14/600) | 5 | 19 |
| H4 / Label/L semibold (16/600) | 2 | 12 |
| Body/S/regular (12/400) | 5 | 12 |
| Label/S/medium (12/500) | 20 | 21 |
| Label/L/medium (16/500) | 13 | 11 |
| Caption regular UPPER (10/400) | 5 | 3 |
| Caption semibold UPPER (10/600) | 3 | 3 |
| H3 / H2 / H1 (500) | 1 / 8 / 6 | unchanged |
| Body/L/regular, raw px (avatars, mini preview widget) | 3 / 7 | unchanged |
| **All uppercase rules** | **72** | **39** |
| Weight 400 / 500 / 600 | 102 / 167 / 79 | 149 / 127 / 72 |

What the 167 medium-weight rules (116 of them Label/M) were, by role (before, rough script classification): about 21 names/item titles and 31 numbers/values (correctly medium), 28 control labels (correct), and about 45 that should have been regular: 20 content rules (table cells, menu items, options, comments, tooltip), 14 meta rules (times, dates, positions, IDs, helper text) and 11 inputs.

What the 63 uppercase rules (S + M) were: 14 table/column headers, about 20 eyebrows and group labels (fine), and about 30 titles or meta: every Panel/Modal/Drawer title (`.ifs-surface__title`), DataVizCard, table card, side nav, chat header, history, data table, approval chain panel, alert, empty state, plus file dates, attachment meta and KPI captions.

`.t-*` class use in JSX, gallery and demo: Body/M/regular 75, Body/L/regular 21, Label/M/medium 18, H1 8, H2 7, retired `t-body-m-medium` 6 and `t-body-l-medium` 5 (all moved to live styles in this pass), the rest 1–2 each.

## How the six reference systems do it

| | Fluent 2 | Atlassian | Carbon | Material 3 | Apple HIG | Notion (unofficial) |
|---|---|---|---|---|---|---|
| Weights used in UI | 400, 600 (700 "stronger") | 400, 500, 653 (bold) | 300, 400, 600 | 400, 500 | 400, 600/700 (emphasized) | 400, 500, 600 |
| Body / table cells / list text | Body 1 regular | Body regular | body-01 regular | Body regular | Body regular | regular |
| Emphasis inside content | Body 1 Strong (600) | medium / bold | heading-compact-01 (600) | Title M/S (500) | emphasized variant | 500/600 |
| Headings | 600 everywhere | 653 bold everywhere | small 600, large 400 | 400 (Headline/Display), 500 (Title M/S) | Headline semibold; Titles regular | 600 |
| Buttons | Body 1 Strong (600) | 500 | body-compact-01 (400) | Label L (500) | body/headline | 500 |
| Menu items / options | regular | regular | regular | Label L (500) | regular | regular |
| Field labels | Label regular (semibold optional) | small, bold | label-01 regular 12 | Body S / Label | regular | regular, secondary colour |
| Table header | sentence case | sentence case, bold, subtle colour | heading-compact-01, sentence case | (M2 data table: medium, sentence) | sentence case | regular, tertiary, sentence |
| Uppercase | none | lozenge (status tag) only; legacy uppercase headings retired | none (removed) | none (M2 "overline" and uppercase buttons removed in M3) | none today (grouped-list section headers were uppercase until iOS 14) | none (sidebar section headers moved to sentence case) |
| Named styles | ~17 (ramp × strong variants) | ~14 (6 headings, 3 body, code, metric…) | ~15 productive (+ expressive set) | 15 (5 roles × S/M/L) | 11 text styles (+ emphasized) | ~6 |

Sources: Fluent 2 typography (fluent2.microsoft.design/typography) and component pages (Button, Menu, Label, Table); Atlassian foundations/typography (atlassian.design/foundations/typography) and Lozenge, Dynamic table, Form components; Carbon elements/typography/type-sets (carbondesignsystem.com) and Data table, Button, Tabs; Material 3 type-scale tokens and Buttons, Menus (m3.material.io); Apple HIG Typography, macOS and iOS text-style tables (developer.apple.com/design/human-interface-guidelines/typography); Notion from its shipped CSS (no published system). Values read from the documentation as of late 2026; the Notion column and the Fluent/M3 table-header rows are observed behaviour, not published rules.

What the six agree on, and what we take:
- **Content is regular in all six.** Weight above regular is kept for titles, controls and the one thing per row that names it. → content regular, primary column medium.
- **Two emphasis weights at most in a row.** Fluent and Carbon use one weight (600) for both "title" and "strong"; M3 and Notion separate control labels (500) from headings. Nobody uses the heading weight for ordinary content. → 500 = name/key value/control, 600 = title.
- **Nobody uses uppercase for section titles.** It survives only for status lozenges (Atlassian) and, historically, overlines/section headers that M3 and Apple have since dropped. We keep uppercase for column headers, eyebrows/group labels and lozenges, because the IFS look depends on it there and those strings are short.
- **11–17 named styles** is the norm. We now have 19 live styles (+ the `t-display` shorthand) and 8 retired aliases (see below); Carbon-level, a bit above Apple.

## What changed in this pass

Branch `claude/type-usage-f43e8c`. No `--type-*` value or heading size changed.

**Titles (10 rules → H4, sentence case, primary colour):** `.ifs-surface__title` (Modal, Drawer, Panel), `.ifs-sidenav__title-text`, `.ifs-dv-header__title` (DataVizCard, InvestmentValueImpact), `.ifs-table-card__name`, `.ifs-thread__title`, `.ifs-chat-header__title`, `.ifs-history__title`, `.ifs-data-table__title`, `.ifs-apc-panel__title`, `.ifs-empty__heading`.

**Sub-section titles (14 rules → Label/M/semibold, sentence case):** approval brief, collaborators section, evidence section, Cooper message heading, Cooper options head, recommendation group and impact titles, compare list title and header label, alert title, select empty title, documents popover empty, bottom-sheet context title, widget chip title.

**Uppercase meta → Body/S/regular:** file-card date, attachment meta, table status description, stat-card description below, map-field value, quick-stat and compare-stat captions ("Current", "Proposed", "357 gained • …"). The Cooper reasoning toggle and "See all" are controls, now Label/M/medium and Label/S/medium in sentence case. The page eyebrow moved from Label/M/UPPER to Label/S/UPPER (one eyebrow style).

**Medium → regular (content, meta, typed text, 42 rules):** table cells, menu items, menu shortcuts, select options (L list: Body/L/regular), role options, phone options, calendar dates, checkbox labels, tooltip text, breadcrumbs, timeline times, approval position and comment, version time, user-card date, page-header ID, page-top description, stat-card description, field helper text, slider description, table-review from→to, comment location, record-preview ID, history bar count, Cooper "speaking"/"listening"/drop text, spinner and load-more text, and every input/textarea (composer, comment edit, message input, chat bar, history search, smart search, search, popover search).

**Primary column:** `Table` gives the name column `ifs-table__td--primary` (Label/M/medium). It is the column with `primary: true`, else the first text/description/custom column; `DataTable` marks its `name: true` column. Other cells are Body/M/regular.

**Readiness rows (ReadinessStatus):** label and status were each `flex:1 1 0` (50/50) and the label was Label/L/medium (16px), so "Objective weighting" wrapped in the 380px panel. Now the label takes the room it needs (`flex:1 1 auto`), the status keeps its own width (`flex:0 1 auto`), and both are Body/M/regular (content role). No wrap at any density in the Review screen.

**Classes (`src/tokens.css`, in place):** role table added as a comment above the text styles. Retired, values unchanged so old prototypes render the same: `t-body-l-medium` (identical to Label/L/medium), `t-label-l-semibold` (near-duplicate of H4: 16/600, tracking −0.15 vs 0), `t-label-m-upper` (titles → H4, eyebrows → Label/S/UPPER). Narrowed with a comment: `t-label-l-medium` (L-size control text only, never a title), `t-label-s-upper` (headers, eyebrows, group labels), `t-caption-regular-upper` (calendar weekday and tiny step captions only). The five older aliases stay as they were. Gallery and demo uses of retired classes moved to live ones; the dashboard bar values went from Label/S/UPPER to Label/S/medium.

**Checked:** the six demo screens at Spacious, Comfortable and Compact (1440×900), before and after; Storybook Modal, Panel, Alert, Menu and Table at all three densities; `npm run release` builds clean.

## Looks off / found along the way
- **Trace report issue title is H2 inside the 380px panel** (`.ifs-trc-issue__title`, 26px in Spacious, wraps to two lines). Recommend H3 or H4 there; left as is because the issue is the panel's main message.
- **Readiness section badges** ("1 RESOLVED", "+4.8%", "1,621") are 12px Indicator S lozenges next to 14px titles; they read small. Fine under the rule, but consider Label/M/medium for plain numbers (counts are not statuses).
- **Menu items with a description** (Menu "Approve / Moves the item…") now separate title and description by colour only. Fluent and Carbon do the same; if it feels flat, the item title in that variant is the one place to use Label/M/medium.
- **Two weekday styles:** `.ifs-weekday` (Caption/regular/UPPER) and `.ifs-calendar__weekday` (Caption/semibold/UPPER) for the same thing.
- **Chart text is outside this pass** (data viz session): `.ifs-chart__axis/value` use raw 12px/500 instead of the `--type-s` token, and axis/tick labels in IVI and peer benchmark are Label/S/medium where all six systems use regular.
- **Demo copy written for uppercase** now shows as typed: the Governance flags KPI caption reads "executing investment affected" (lower-case start). Fine as a caption; capitalise in the screen data if wanted.
- Field labels stay as Figma has them (L field label 16/500 tertiary is larger than the M field's 14/600); worth a look with the forms owner.

## Decisions for you
1. **Modal title size.** All modal/panel/drawer titles are now H4 (16/600). Fluent, Atlassian and Carbon use ~20px for modal titles (our H3). Keep H4 for every surface (consistent, fits the 48px modal header) or move Modal alone to H3?
2. **Primary column default.** First text column is medium automatically. Keep the automatic default, or require `primary: true` explicitly?
3. **Readiness facts labels** (`.ifs-readiness-facts__label`, "INVESTMENT…") stay Label/S/UPPER as row headers of a two-column fact table. Keep, or treat them as field labels (Body/M/regular, tertiary)?
4. **Compact small sizes.** The scale is fixed, but usage can avoid the smallest steps: Compact Small is 11px and Caption 10px (Caption doesn't shrink between Comfortable and Compact). Options: (a) keep; (b) rule that Caption is only for avatar initials, weekday and lozenges, never for reading text (the current rule already moves KPI captions to Body/S); (c) raise Compact Caption to 11 in the scale work.
5. **Figma.** These changes depart from the Figma library on purpose (titles uppercase → H4, content medium → regular). Should the Figma file be updated to match, or do we list each departure in `guide/review.md`?
6. **Retired classes.** Keep the 8 retired aliases indefinitely, or remove them at the next major version after checking prototypes?
