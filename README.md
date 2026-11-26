# Catalyst Design System 2.0

A React code twin of the IFS Design System Figma library (`atgUmwcA1AE5sjFoWBT7ar`), with user-selectable density and a type and spacing scale set against best-in-class design systems. Current version: **2.0.7**. Releases follow [guide/release.md](guide/release.md) (SemVer from 2.1.0).

## Use it

| What | Where |
|---|---|
| Prototype bundle (exposes `window.IFS` and `window.Catalyst`) | `dist/ifs-ds.js`, `dist/ifs-ds.css` |
| Over the CDN (GitHub Pages) | `https://shinyc01.github.io/catalyst-design-system-2/dist/ifs-ds.js` (and `.css`) |
| Prototype starter | `template.html` |
| Storybook (every component, density switch in the toolbar) | https://shinyc01.github.io/catalyst-design-system-2/dist/storybook/ |
| Demo: six Catalyst screens, Display settings behind the gear icon | https://shinyc01.github.io/catalyst-design-system-2/demo/ |

Every component is `IFS.<Name>` (for example `IFS.Button`, `IFS.DataTable`); `IFS.format` formats numbers, money and dates; `IFS.Stack` / `IFS.Inline` lay out screens.

**Load it** (as in `template.html`): React, then the kit, then your screen.

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.26.4/babel.min.js"></script> <!-- only if you write JSX in the page -->
<link rel="stylesheet" href="https://shinyc01.github.io/catalyst-design-system-2/dist/ifs-ds.css">
<script src="https://shinyc01.github.io/catalyst-design-system-2/dist/ifs-ds.js"></script>
<div id="root"></div>
<script type="text/babel" data-presets="react">/* your screen: IFS.Button, IFS.DataTable … */</script>
```

**Density.** Three levels, as a user setting: Spacious, Comfortable (default), Compact (rule 3.11 in `guide/rules.md`). Density changes type, component heights, the room inside containers and fixed table column widths; never the page frame, icons, radius, borders, elevation, colour or motion.

| | Spacious | Comfortable | Compact |
|---|---|---|---|
| Body text (`--font-size-m`) | 16/24 | 14/20 | 12/16 |
| Heights `--size-control-xs` · `s` · `m` · `l` · `xl` | 24 · 28 · 36 · 44 · 52 | 20 · 24 · 32 · 40 · 48 | 20 · 24 · 28 · 32 · 40 |
| Container padding (`--space-inset`) | 20 | 16 | 12 |
| Table row (`--size-table-row`) | 64 | 52 | 40 |
| Fixed table columns (`--density-scale`) | 1.2 | 1.05 | 0.95 |

Icons are drawn at 12 / 16 / 24 in every density (rule 6.1).

**Fonts.** Inter and JetBrains Mono ship with the kit (`fonts/`, copied to `dist/fonts/`; rule 2.1): no third-party request, so a strict Content Security Policy needs only `font-src 'self'` (plus `data:` for single-file prototypes, which embed them). If they fail to load, a metric-matched Arial / Courier New fallback keeps the layout steady.

**User settings the kit reads** (the product builds the settings screen): density (`IFS.setDensity`), lite glass (`IFS.setGlass('lite')`, blur 10 for remote desktops), good vs bad colours (`IFS.setOrgDiverging('red-green')` for the organisation's default, `IFS.setDiverging(…)` for a person's own choice, which wins; default azure ↔ rose), single-key shortcuts on / off (`IFS.setShortcuts('off')`), and the formatting options in `IFS.format.configure`. Showing chart descriptions on the card is a decided setting with its placement still open.

**Token names.** Every token starts with its type word and matches its Figma path (`color/text/soft` → `--color-text-soft`; rule 11.6). The old names (`--text-primary`, `--control-h-m` …) still work as aliases until 3.0; `dist/tokens.txt` lists the new names, then the deprecated ones; `dist/tokens.json` is DTCG 2025.10 with `$deprecated`; the full old → new list is `tools/figma/rename-map.tsv`.

## Files

| File | What it holds |
|---|---|
| `guide/rules.md` | The rulebook in the 11 foundation categories (colour, typography, layout and space, shape and depth, motion, iconography, interaction and states, content, accessibility, data visualisation, tokens and system), then page headers, map slots, component use and open questions; an old → new number table at the end (renumbered Nov 25) |
| `guide/components.md` | The catalogue: which component for what, and the patterns |
| `guide/words.md`, `guide/words.json` | The word list (rule 8.43): terms with definitions, UI verbs, words we don't use; the JSON is the source (`tools/gen-words.mjs`), both ship in `dist/` |
| `guide/release.md` | Releases and versioning: SemVer from 2.1.0, deprecation, changelog headings, upgrades |
| `guide/figma.json` | Figma keys, node ids and variant axes per component; pattern sources; Figma review items (Storybook warnings) |
| `guide/tiers.json`, `guide/usage.json` | Data for the generators (component tiers; handover usage counts) |
| `dist/api.md` | Every component's props (generated) |
| `dist/icons.txt`, `dist/tokens.txt`, `dist/tokens.json` | Icon names; every token with its value, new names then deprecated aliases; the same as DTCG JSON (generated) |
| `src/tokens.css`, `src/foundations/*.css` | Tokens: colour roles, type, spacing, layout, motion; primitives in `palette.css`, old names in `deprecated.css`; `tokens.css` also holds the `.t-*` text-style and `.fx-*` effect classes |
| `src/icons.js` | `window.IFS_ICONS`: SVG markup per icon and size, exported from Figma |
| `src/components/<family>.css + .jsx` | Components, one pair per Figma family; `index.js` is the entry, `registry.js` the shared `IFS` object |
| `src/gallery/<family>.jsx` | Every variant and state; the source of the Storybook stories |
| `src/stories/` | Generated by `tools/gen-stories.mjs`; don't edit |
| `src/docs/*.mdx` | Hand-written Storybook pages |
| `src/docs/Foundations.stories.jsx` | Storybook › Foundations: colour, type, spacing, sizes, layout, shape. Read live from the CSS (all three densities side by side), so it never needs updating |
| `fonts/` | Self-hosted Inter and JetBrains Mono (woff2; sources, checksums and licence in `fonts/README.md`) |
| `build.mjs` | esbuild → `dist/ifs-ds.js` + `dist/ifs-ds.css` + `dist/fonts/`; `inline` makes single-file prototypes (fonts embedded) |
| `tools/` | Generators, `extract-spec.js` (exact Figma specs), `check-direction.mjs` (RTL progress), `shot.sh` (screenshots), agent briefs |

## Versions

- **2.0.1** (Nov 17–18, 2026): type and spacing. Two-layer type tokens and 16 styles; Small is rare and Compact Small is 11; no uppercase style; one `--space-*` scale with density roles (`inset`, `stack`, `section`); fixed table rows and headers; page grid by screen width.
- **2.0.2** (Nov 18–19): layout. Breakpoints 600 / 1024 / 1440 / 1920 with 12 columns; cards on columns, panels at fixed sizes (380 / 600); Flexy's Figma integration.
- **2.0.3** (Nov 19):
  - Code in rem, Figma in px.
  - New spacing roles `inset-l` and `table-x`; table header text centred, no cell padding.
  - Title levels by role (PageTop, thin headers, cards, charts, HomeRowCard); no H1 for numbers; Label/M/UPPER removed.
  - Round 1 sizes (chips, search, Smart Search, phone picker, checkbox / radio rows, badges); Compact small controls; minimum target size; icon-only controls are IconButtons.
  - Panels by job (`push` / `over`); side nav folds by available space; the grid follows the content area.
  - Three page headers and their narrow behaviour.
  - Map slots: one panel per side, no map minimum, top and bottom bars nudged by panels, narrow overlay and sheet.
  - One Menu, one StatCard, one NavBar, one EvidenceButton, one legend; charts use data-viz colours only.
  - Calendar from the locale; tables scroll with column minimums; reflow at 400% in scope; start / end instead of left / right.
  - Docs merged into `guide/rules.md` and `guide/components.md` (values live there).

- **2.0.4** (Nov 20):
  - Side nav shows the pages of where you are; none on a stepper flow inside an entity.
  - Page container `.ifs-page` (page margin on all four sides).
  - Thin header height from its content; entity header = back, name, ID, title menu ▾ (Activity), status, the same on every step.
  - Workflow panels (System confidence) start open; extra-information panels start folded.
  - Card title row = title · meta · actions (`ContentCard meta`); stat card S by default (`StatCard` with no `size`), `size="m"` only for a key-figure row at the top of the page with no title above.
  - Cooper bar by page (`BottomSheet type="documents"` inside an entity).
  - Table groups open / collapsed / locked; `ApprovalChainTable stages` for several approval stages.
  - The kit places the map's top and bottom bars itself (`placeMapSlots`), no flash; StagedAppShell removed; Storybook Foundations pages.
  - Workflow panels start open, and every panel can fold (`Panel collapsible={false}` only when a screen is asked to stay open).
  - Feedback: Alerts are error or warning only; success = snackbar for the user's own action, notification (tray + live snackbar) for news.
  - Small `SegmentedControl` at the control height outside, with full-height hit layers; widgets a page gap apart; the full Cooper chat floats one page margin in (over).
  - `SmartSearch` is the default search; modal footers have one Primary; Evidence 90% is Review; collaboration Save always on; component text is the screen's content.

- **2.0.5** (Nov 24):
  - Foundations (Nov 23): size ladder and nested insets; shape (border-width and radius roles, odd widths snap to 1); four elevation levels (page, raised, floating, modal) with z-index bands; naming (one word per meaning, old names kept as aliases until 3.0, tokens.json in DTCG); the colour fold onto one palette; number, money and date formatting; motion tokens and the open/close map with one reduced-motion rule.
  - States and components (Nov 24): one focus ring on every control; loading (one dotted loader, one pulsing skeleton); rebalanced status scales with five status words; the map pin (`MapPinDot` danger · warning · neutral); the stepper's completed steps; record preview as a push panel.
  - Foundations restructured into 11 categories (Colour, Typography, Layout and space, Shape and depth, Motion, Iconography and imagery, Interaction and states, Accessibility, Content, Data visualisation, Tokens and system), matched in the Figma file.
  - Data viz moved to 2.0.6 (the widget builder pattern later moved to phase 2).

- **2.0.6** (Nov 26): the remaining foundations. Changelog headings per `guide/release.md` from here on.
  - **Added**
    - Data viz foundation (rule 10.1 and section 10): the chart card, heights on the dashboard row unit `--size-data-viz-row` (116 / 100 / 84), axes, legends, hover and tooltip, the v2g categorical palette, sequential and diverging ramps, stacks and bars, states, one chart text scale (`--font-label-s-medium`), chart-point targets (G8).
    - Chart header: H4 title with an optional one-line `subtitle`; `description` for screen readers; the drag handle, drag from the header and keyboard move (Space, arrows, Esc; "Move" in ⋯); Edit with Cooper folds into ⋯ below 416 px. Rule 10.12: the same entity keeps the same colour across a screen's charts.
    - Forced colours (G1, rule 9.13): strokes become outlines, selection is Highlight, glass turns solid, data colours keep an edge; charts follow Power BI's high-contrast model.
    - Contrast targets (G2, rule 9.14); primitives `--palette-danger-350`, `--palette-danger-550`, `--palette-core-450`, `--palette-core-165`, `--palette-collaboration-user-1…15`; roles `--color-border-input-strong` (+ `-hover`), `--color-icon-map-pin-neutral|danger`, `--color-cooper-background-stronger`.
    - Glass (G3, rule 4.2 materials table): `--color-surface-map-glass`, `data-base-map` / `CanvasBackground baseMap` / `IFS.setBaseMap`, solid twins for reduced transparency, lite glass (`data-glass="lite"`, `IFS.setGlass`, `--blur-glass`).
    - Keyboard and focus (G4, rules 9.15–9.18): skip link in `AppShell`, focus on open goes to the first field or the title, return focus to the trigger's nearest container, `inert` behind modals and scrim drawers, switchable single-key shortcuts (`IFS.setShortcuts`, `IFS.shortcutAllowed`).
    - Status messages (G5, rule 9.19): `IFS.announce` with two live regions in the page from load; `IFS.useSnackbarTiming`; `toast.command()`.
    - Self-hosted fonts (G6, rule 2.1) with metric-matched fallbacks. Release policy (G7, `guide/release.md`).
    - Rule 10.7, groups with levels: a stacked group keeps its dark categorical slot and its levels step lighter on that slot's ramp (2 · 4 · 6 · 8); the dark slots now reference ramp step 2. Rule 11.6: `-solid` documented as the opaque-twin suffix.
  - **Changed**
    - Chart card title H4 in `--color-text` (was Label/M/medium, text tertiary); default chart card = 3 dashboard rows + 2 page gaps (380 / 332 / 284 at a 16 gap; replaces item 6's S-inline unit).
    - Dashboards use the M stat card with the description inline (rule 2.6); its title → value gap is `--space-inset`; stat card descriptions `--color-text-soft`.
    - Snackbar timing (rule 14.12): with an action at least 10 s, then until the next command; without one 6 s; one action snackbar at a time. The Snackbar has no live role of its own.
    - Fields (C3): a 30% bottom line instead of the outline (hover 40); error = danger outline only. Switch off 40% edge (hover 60); slider track 40% when its value is hidden; segmented selected item and date-range days get a 40% outline.
    - `--color-text-danger` → red 350; live text that used the disabled colour → text-softer; overlay placeholders, menu descriptions on hover and attachment meta → text-soft; light data-viz bars take black labels; collaboration colours (direction 5 at 5%, user 13 olive) with white initials on every user; map pins option B; comment pins white meta, Cooper pin cooper 600; NodeCard counter = the tag chip; solid NodeCard caption stays white 85 when selected.
    - Every glass blur 80 reads `--blur-glass`.
    - The Chart / Table switch is `SegmentedControl` M with square icon segments (D1 had S).
    - `StatCard` default size is M (was S since 2.0.4); S is an option for dense page layouts (rule 2.6).
    - Every chart-card header title is H4 in `--color-text`, the older organism `DataVizCard` (and so `WidgetFrame`) too; stat card titles stay Label/M/medium in text-soft.
    - Keyboard: "/" focuses the global search (the convention); Cooper opens with Ctrl+. / ⌘. (`IFS.cooperHotkey` in its tooltip); single-key shortcuts are switchable (rule 9.18).
    - Map glass on a map that doesn't declare its base map is the safe black 85; only a declared matching map gets black 40 (rule 4.2).
    - Investment value impact: loss / gain on the diverging pair (loss pink, gain azure; was red / green); `TimelinePhase color` takes a categorical slot (family names still work).
    - `guide/rules.md` regrouped into the 11 foundation categories (A15), then page headers, map slots, component use and open; the old → new number table is at the end of the file.
  - **Deprecated** (until 3.0)
    - The pre-2.0.6 data-viz colour group roles `--color-data-viz-<group>-data-N` (and the older `--data-viz-<group>-data-N`), `data-1…10`, and group-name `color` values on charts → categorical slots and the sequential / diverging ramps (aliases in `src/foundations/deprecated.css`).
  - **Removed**
    - The Google Fonts `@import` from the kit (prototypes may still load Google Fonts themselves).
  - **Fixed**
    - Icons with clip paths or gradients (e.g. `cooper-evidence-icon`) get unique ids per instance, so every instance draws its own art.
    - A `Spinner` inside `LoadingRegion` no longer announces twice.
- **2.0.7** (in progress, Nov 26): content foundations and components.
  - **Added**
    - Rule 10.13 reference and forecast lines (Carbon, Atlassian convention): `references = [{ value, label }]` on `ColumnChart`, `BarChart`, `GroupedColumnChart`, `StackedColumnChart`, `LineChart` and `AreaChart` (1 px dashed `--color-border-strong`, labelled at the end, in the legend and the table view); `LineChart forecastFrom` (dashed after today, a "Today" marker, "Forecast" in legend, tooltip and table); `forecast: true` on a `ColumnChart` datum (hatched in the series colour, see Changed).
    - `StackedColumnChart levels`: groups with levels inside (rule 10.7): the group's dark slot on the baseline and its family's ramp upwards (every other step up to 4 levels, every step up to 8, then Other). The demo dashboard uses it instead of the bar atoms.
    - Line and area charts: missing values break the line, a lone value is a dot, the tooltip says "No data"; `connectGaps` joins across with a dotted bridge (rule 10.10).
    - `legendPosition` (`below` | `beside`) on every core chart; unset keeps the type's default (rule 10.5).
    - `--color-background-neutral-strong-hover` (white 30), the CircularButton hover.
    - `.ifs-page--wide`: tables, dashboards and maps cap content at `--layout-max-content-width-wide` (2240) instead of 1600 (rule 3.15).
    - Rules: 11.8 strings ready for translation; 9.14 text spacing (WCAG 1.4.12); 9.20 interim table keyboard rule until the phase 2 grid; a 1280 × 720 check frame next to 1440 × 810 (rule 3.13).
    - Good vs bad colours setting: the organisation picks the default (`IFS.setOrgDiverging('red-green')`), each person may override it (`IFS.setDiverging`, remembered; `null` goes back to the organisation's), e.g. someone with red-green colour blindness; `data-diverging="red-green"` swaps every diverging chart to red (worse) ↔ green (better); default azure ↔ rose (rule 10.8, USER-SETTINGS row 14).
    - Content foundations (G9, decided Nov 26): rules 8.33–8.42 grammar and mechanics (names, acronyms, numbers and dates in text, lists, "and" not "&", no slash or N/A, punctuation with the Oxford comma, curly quotes and "…", shortcuts, re- words), 8.43–8.44 word list, 8.45–8.51 help text (the help ladder, placeholders as an example value, descriptions, tooltips, term definitions, teaching, empty-state text), 8.52–8.56 messages by surface, 8.57–8.65 Cooper's voice; 9.21–9.26 accessible text (names, images, chart text, maps, screen-reader-only text, no sensory instructions); 9.19 gets the announcement wording. Appended, so no older number moved.
    - Word list: `guide/words.md` and `guide/words.json`, shipped as `dist/words.md` and `dist/words.json` (40 terms with definition, don't-use list and notes, 24 UI verbs, 44 words we don't use). 30 definitions are `confirmed: false` until a product owner pass. "Investment" notes the organisation setting that renames it "project" (USER-SETTINGS row 15); "project" is no longer banned. `words.json` is the source; `node tools/gen-words.mjs` writes `words.md` (`--check` to verify).
    - `RecommendationDetail applyLabel`: the confirm button names the change (default the recommendation's title; rule 8.60).
    - Required marker (audit run 2 C1, rule 14.4): `required` on `TextField`, `TextArea`, `PhoneField`, `Select`, `Combobox` and `DatePicker` draws an asterisk after the label (`RequiredMark`, hidden from screen readers) and sets the native `required` / `aria-required`; `FormCard` fields are required unless `required: false`, and the form shows "Fields marked * are required." at the top (WCAG 3.3.2). Optional fields may be shown again.
    - `ColumnChart plan: true` (rule 10.13, IBCS): a planned value outlined in the series colour, no fill; `planLabel`, `forecastLabel`.
    - Cooper's limits (rule 8.66): `CooperLimitsNote`, the standing line "Cooper can make mistakes. Check the sources before you decide." under the input of both chat panels (`limitsNote`). Rules 8.66 (also the one-time first-open card) and 8.67 (rating answers; not in the kit until it has icons and a Figma component).
    - `IFS.format.plural(count, { one, other, … })` (ICU-style plural forms, rule 11.8) and `IFS.term('investment', { count, capital })` fed by `IFS.format.configure({ entity: 'project' })` (USER-SETTINGS row 15); the approval, Cooper, widget-builder patterns and the demo take the entity word from it.
    - `AppShell title module`: the browser tab title "{page} – {module} – IFS Copperleaf" (rule 9.27, WCAG 2.4.2); the demo screens set it.
    - `Button href`: a move renders as a link with the Ghost look (rule 14.1).
    - `RemoveCollaboratorModal body` (the screen names its record; default "They lose access.").
    - Rules (audit run 2, decided Nov 26): 8.68 positive checkbox and switch labels, 8.69 "by Cooper" outside the chat, 8.70 when Cooper speaks first (USER-SETTINGS row 16 "Cooper suggestions"), 8.71 Cooper's progress text names real work, 9.27 page titles, the text-growth table in 11.8; 9.10 permanent disabled reasons also as visible text.
  - **Changed**
    - SegmentedControl (Nov 26): small options are 24 px again (28 / 24 / 24 by density; the control 4 taller), and the code default is M; headers pass S (rule 14.15).
    - Disabled actions (rules 14.4, 9.10, Nov 26): an incomplete form or a fixable missing step never disables the primary action; on submit the page scrolls to and focuses the first problem (a summary with links only across pages, tabs or steps); grey out only for permissions, work in progress or an empty single text box, with `Button disabledReason` (focusable, a tooltip says why). Trace "Send for approval" now shows the first open item instead of staying disabled; approval Publish says "Publishes when every reviewer approves (n of m so far)".
    - Table card filter with counts becomes a Select below 600 px (WCAG 1.4.10).
    - Voice (rules 8.1–8.6, G9, Nov 26): trustworthy, precise, empowering; reads like a well-prepared briefing; the person decides; bad news plain with the way out; short forms except legal and high-stakes text; Cooper is a sidekick that calls people by first name, gives one line of why and is never sycophantic.
    - Categorical palette (rule 10.7): six families in colour-wheel order, violet → indigo → azure → teal → terracotta → rose, each a dark then its light partner; violet is slot 1, the base colour of every dashboard. All 12 stay distinct in normal and colour-blind vision; every slot clears info blue, Cooper copper and the status colours. Values in `foundations/palette.css`.
    - Sequential ramps (rule 10.8): one 9-step ramp per family, step 2 = its dark slot; the default ramp is violet (was azure) and a single-hue chart uses the ramp of the entity it shows (rule 10.12). `HeatmapChart ramp` defaults to `violet`.
    - Diverging: azure ↔ rose (rose replaces pink; same sides as 2.0.6).
    - Rule 10.12: one colour key per screen: entities in more than one chart take the dark slots first (and own that ramp), other charts take the free slots in order, reuse only when all 12 are taken.
    - Rule 10.7: levels inside a group use the whole ramp (every other step up to 4 levels, every step up to 8, then Other); black labels from step 3.
    - Tooltips (rule 14.11, WCAG 1.4.13): two versions. UI tooltips are hoverable (the pointer can rest on the bubble), close after a 100 ms grace (`--motion-duration-100`), and Esc closes them from anywhere; chart tooltips follow the pointer across the data and stay while it is over the plot.
    - `IconButton`, `SegmentedControl` and `Badge` default to size S (was M), as rules 6.2 and 14.15 say; the map tool buttons, the bottom-sheet upload button and the Chart / Table switch pass M.
    - CircularButton D3: rest white 20, hover white 30, pressed `--color-background-neutral`, a `--color-border-strong` edge and white ink in every state, hotkey text-soft (white on hover). The circular fills leave the held list (rule 11.6).
    - `DataTable` hover-only row actions hide with opacity, so Tab always reaches them (rule 9.20).
    - The empty, loading and error look restyle (rule 7.2) moves to Flexy's icon and small-visual exploration: no look has been decided, so 2.0.7 keeps today's look.
    - Case (rule 2.9, G9 C1): sentence case everywhere, titles, headings, navigation, confirmations and empty states included (was Title Case for titles, headings and navigation); rules 8.18, 8.22 and 8.24 examples follow, with curly quotes. Gallery and demo titles, tabs, segments, column headers and role labels follow; record, people and document names keep their case.
    - Buttons never truncate (rule 2.12): the layout changes instead.
    - Rule 8.9 term list: investment (renamable), program (an investment type), budget = a spend constraint and constraint the umbrella, alternative never "option", people not users, the send-back pair. Rule 8.10: the short verb when the object is clear, the full action for Cooper, bulk actions and other items. Rule 8.14: link text. Rule 8.21: there is no info alert (rule 14.12); neutral information goes in a description, a status or a page-top warning Alert.
    - Send-back (G9 C12, R26): "Request more information" / "Request more info" becomes **Request revisions** (gallery, demo and docs; behaviour kept); the status is **Needs revision** (`ApprovalChainTable` stage status was "Changes requested"); the snackbar "Revisions requested" with the description "Sent back to {name}.".
    - `FormCard`: no "Submit" default; `primaryAction.label` falls back to "Save".
    - Form errors (audit run 2 B-02 / B-03, rules 8.18, 9.19, 14.4): `FormCard` shows each error inline, scrolls to and focuses the first and announces one polite count ("3 fields need attention", plural-safe: "1 field needs attention"); the summary list on a single page is gone. Assertive only for a blocking error that appears without focus moving.
    - Confirmation buttons (B-01, rules 8.24, 8.52): the short verb ("Delete", "Publish", "Remove"), since the title names the object; the gallery publish / send dialogs drop "Are you sure…" and "Publish now" / "Send now"; the comment delete and collaborator remove dialogs follow.
    - Placeholders (B-10, rule 8.46): never instructions. `Select`, `Combobox`, `DatePicker`, `CompareDropdown`, `AddNodeButton` and the trace answer field have no default placeholder (was "Select…", "Search item", "Select date", "Select framework", "Type…", "My answer"); `SmartSearch` defaults to "Search" (was "Ask anything…"), the column filter to "Search"; screens say what they search ("Search ideas", "Search comments").
    - Counts (B-12, rule 8.35): "3/5" only inside a compact pill or button; accessible names say "3 of 5" (`CollaboratorsButton`, trace gate indicators, approval stage counters).
    - Create, not New (B-24, rule 14.2, words.md): every create button says **Create**; the demo Build page has "Create ▾" (a Menu: Idea, Program).
    - Trace (B-09): the warning button "Okay" is **Mark as reviewed**; warnings and notes count as "reviewed".
    - Rule 10.13 actual / plan / forecast (R1 + A11Y M2, IBCS): forecast bars are hatched in the series colour (were the light partner slot, which could clash with rule 10.12); plan bars outlined; in forced colours plan and forecast get a dashed outline and dashed legend keys stay dashed.
    - Chart states (B-05, B-18): empty "Not enough data yet" (the screen passes when the data will appear), error body "The server didn’t respond. Try again in a minute.", the skeleton is named "Loading {title}", the plot never falls back to the name "Chart".
    - Accessibility (audit run 2): `disabledReason` is always the button's description (M1); the chart tooltip stays inside the window and wraps (L1); Cooper answer buttons wrap (L2); the chart tooltip has an edge in forced colours (L6); "View reply from {name}" (L7); documents pin dots get a 24 px hit area, the dot unchanged (M3; `--pd-hit` for a scaled map).
    - Copy (audit run 2 A): no em dashes as sentence punctuation, sentence-case "Add collaborator" and "3 documents", no "~", "vs" or "&" in sample sentences, words.md notes that the reviewer's disabled "Revisions requested" is the action's past tense (B-14).
    - Tokens (audit run 2 T2): `.ifs-page--wide` redeclares the grid spans for the 2240 cap; the demo table and dashboard screens use it; `--layout-max-content-width` moves to layout.css; TimelinePhase old group names draw the same colours as charts; the canvas pan gap reads `--size-64`.
    - `ApprovalChainTable`: the "User" column is "Person"; the reminder snackbar reads "Reminder sent" + "You can send another in N hours."
    - No-results headings name the search ("No results for “WDRM-2”") or the filters ("No matches for these filters"): `Combobox` (`emptyTitle` default), `ActivityPanel`, `ApprovalChainTable`, `CommentsPanel`, Cooper history search, `DataTable`, the documents popover and the widget drawer ("No widgets match “…”").
    - Cooper strings (rules 8.61, 8.62): "You stopped this answer.", "Cooper couldn’t finish this answer.", "You’re offline. Cooper will answer when you reconnect."; the chat placeholder "Ask Cooper" (was "Write anything, I’m reading"); recommendation notes without hype.
    - `Tooltip` text wraps inside the 20rem bubble (rule 8.48; was one line).
    - Placeholders: `Search`, `Popover search`, the NavBar search and the documents popover say "Search" or what they search (was "Search for..."); "Search by name or role"; no "e.g." Kit strings use curly quotes, "…", "Document removed", "Try uploading again", "This year".
  - **Deprecated** (until 3.0)
    - `ReadinessStatus right` → `end` (rule 11.4); `right` still works. `ReadinessEvaluation checks[].right` → `end` likewise.
    - `--element-button-circular-fill-default | hover | pressed` (T2-4): no longer read by the kit; aliases of `--color-background-neutral-strong`, `-strong-hover` and `--color-background-neutral` until 3.0 (listed as deprecated in tokens.txt and tokens.json).
    - `--color-data-viz-sequential-orchid | pink | yellow | cyan-*` (and the same `HeatmapChart ramp` values): aliases of violet, rose, terracotta and azure until 3.0 (guide/release.md: deprecated names are removed only in a major).

Version 1.0 (the original IFS DS kit, 12px body) is pinned at commit `f75244d` of `shinyc01/new-cl-design-system` (`ifs-kit/`).

## Work on it

```bash
npm install
npm run storybook        # http://localhost:6006
node build.mjs           # bundle only
npm run build-storybook  # static Storybook in dist/storybook
npm run release          # stories, bundle, api.md, examples, demo and Storybook
```

Commit `dist/` and `demo/index.html` with your change: GitHub Pages serves them from `main`. Guides are hand-written; `tools/gen-stories.mjs` reads `guide/components.md` and `guide/figma.json` for the Storybook docs.
