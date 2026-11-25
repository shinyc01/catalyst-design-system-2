# Catalyst Design System 2.0.6 — components and patterns

The catalogue: which component to use for what, then how the patterns work. Rules live in [rules.md](rules.md) and are referenced by number, not repeated. Full props: [`dist/api.md`](../dist/api.md). Figma keys, node ids, variant axes and review items: [figma.json](figma.json).

How to read an entry: `### <Figma set name> · <kit component>` (no kit name = a building block inside another component, or not built). **Use** / **Don't** / **Notes** follow. Organisms are what screens place; atoms and molecules are their parts, placed directly only when no organism covers the need. Sets with no Figma canvas guidance (their entries are inferred) are listed in [figma.json](figma.json) → `libraryIssues`. Sizes are Spacious / Comfortable / Compact; what density changes and never changes: rule 3.11 (heights on the ladder, rule 3.5; shape, rule 4.1; tokens by their new names, rule 11.6).

## Pick the right component

| Need | Use | Not |
|---|---|---|
| Any action or navigation move | `Button` (types: rule 14.2) | inline links (rule 14.1) |
| An action where a label won't fit | `IconButton` + tooltip | `Button` without label |
| 2–4 directional actions on a canvas node | `CircularMenu` | a menu |
| Open Cooper | `FtaButton`; quick prompts `PromptButton` | — |
| Single-line / multi-line text | `TextField` / `TextArea` | — |
| Phone number | `PhoneField` | `TextField` |
| Search (default: tables, libraries, pages) | `SmartSearch` (AI search: keywords or natural language) | — |
| Simple keyword search, when the use case needs no AI (column filters, small lists) | `Search` | — |
| A form on a page | `FormCard` | `Modal` (blocking task) |
| One of 2–5 options, all visible | `SegmentedControl` | `Tabs` (peer views of a page) |
| One of many options | `Select`; typeable or long → `Combobox` | `SegmentedControl` |
| Several options | `MultiSelect`; typeable or long → multiple combobox | a `Checkbox` list |
| Immediate on/off setting | `Switch` | `Checkbox` (selecting items) |
| One of a few labelled options in a form | `Radio` / `RadioGroup` | `SegmentedControl` |
| Value on a scale or range | `Slider` | `TextField` |
| Date or range | `DatePicker` / `Calendar` | `TextField` |
| Applied filter value or suggestion, clickable | `Chip` | `Badge` (read-only) |
| Read-only status or category | `Badge`, `Indicator` | `Chip` |
| Status that matters (risk, health) | `RiskStatus` | `StatusIndicator` (dot only) |
| Readiness / completion gate | `ReadinessStatus` | `RiskStatus` |
| Stages (L1) / a stage's sections or one entity's own pages (L2, rule 14.19) | `NavBar` / `SideNav` | `Tabs` |
| Peer views in a page; table filter on a library page | `Tabs` | `SegmentedControl` |
| Progress through steps | `Stepper` (non-interactive) | `Tabs` |
| Place in a hierarchy, go up a level | `Breadcrumb` | Ghost `Button` |
| Step through items one at a time | `Pager` | table pagination |
| Short hint on hover / focus | `Tooltip` | `Popover` (interactive) |
| Error / warning | `Alert` | `Snackbar` (the result of the user's own action, Undo) |
| News the user didn't cause (approved, finished) | Notification (`NotificationCard` in the tray) + a live `Snackbar` | a success `Alert` (rule 14.12) |
| Blocking task | `Modal` | `Drawer` |
| Larger on-demand task, same view | `Drawer` | `Panel` (always on) |
| Always-on side context | `Panel` | `Drawer` |
| Small anchored list, picker or mini-form | `Popover`; commands `Menu` | `Tooltip`, `Drawer` |
| Actions on a map selection | `FloatingBar` | page header actions |
| Any content card | `ContentCard` (M main, S nested) | legacy card sets |
| One key metric | `StatCard` (`StatCardsRow` for a row) | `ContentCard` |
| Records | `DataTable` (static: `Table`) | card lists |
| Nothing to show | `EmptyState` | a blank region, an alert |
| Loading | skeleton in the owning component; `Spinner` for unknown shape | — |
| Chart on a dashboard | `DataVizCard` + a core chart | legacy named charts |
| Layout spacing in a screen | `Stack`, `Inline` | hand-written flex + gap |
| Comment on a canvas object | `CommentPin` → `CommentThread` | `Tooltip` |


## Action

Family note: `button` and `icon-button` have no atom/molecule split. `circular-button-molecule` is a building block of `circular-button-organism`. Icon-button presets (`-notification`, `-comment`, `-arrow`, `-filter`) are ready-made icon buttons with an indicator dot.

### button · `Button`
Use: Every action and every navigation move (rule 14.1). Types and sizes: rule 14.2; icon sizes: rule 6.1. `loading` while its action runs: the dotted loader replaces the left icon, `aria-busy`, not clickable, label stays (rule 7.1).
Don't: Links inside user-authored content or to external resources — those stay links.

### icon-button · `IconButton`
Use: An action in a dense context where a label won't fit. Tooltip + aria-label: rule 9.2. Usual: ghost square S.

### circular-button-molecule · `CircularButton`
Use: One directional trigger inside `circular-button-organism`; not placed alone.

### circular-button-organism · `CircularMenu`
Use: A small fixed set (2–4) of related actions tied to a point on a canvas/map node, each with direction + keyboard shortcut, for fast repeat use.
Don't: More than ~4 actions; actions not memorable by position; primary page actions (those belong in toolbars/labelled buttons).

### icon-button-notification · `NotificationButton`
Use: The bell in `NavBar`; True shows the unread dot.

### icon-button-comment · `CommentButton`
Use: Opening comments; True shows a new-comment dot.

### icon-button-arrow · `ArrowButton`
Use: An arrow icon button with indicator dot.

### icon-button-filter · `FilterButton`
Use: Opening a filter surface; dot = filters applied.

### FTA button · `FtaButton`
Use: The Cooper FAB. Stroke/no-stroke depends on the surface: on a non-black surface (Explore) vs. on a black footer (Value). Hides while the chat is open (Cooper rule 3).

### prompt-button · `PromptButton`
Use: Quick prompt placed near the Cooper FAB for fast interaction.
Don't: General actions — use `button`.

### value-map-button · `ValueMapButton`
Use: Map canvas view controls: Fit (zoom to show all, view only), Expand all, Collapse all.
Notes: Floating vertical overlay on the map canvas, grouped in clusters.

### explore-map-button-base
Use: Building block for `explore-map-button`.

### explore-map-button · `MapToolbar`, `MapToolCluster`, `MapToolButton`, `MapToolDivider`
Use: The Explore map's floating tool bar.

### node-button · `NodeHoverActions`
Use: Contextual control shown on hover over a framework node; the action depends on node type/state (collapsed → Expand, expanded → Collapse). Acts on that node only.
Don't: Global toolbar actions.

### add-node-button · `AddNodeButton`
Use: Creating a new (grey, provisional) subnode on the framework canvas; confirmed via its check icon.

## Inputs & Forms

Family note: organisms are the fields to place. `checkbox`, `radio-button`, `switch`, `slider` have atom (bare control) → molecule (control + label); use the molecule in forms. The molecule variants suit secondary contexts (drawers, modals).

### text-field-organism · `TextField`
Use: Single-line input. L full-page forms, M drawers, modals, embedded surfaces (rule 14.3). Cooper / Cooper Generating states show Cooper-filled values.
Boundary (G2 C3, Nov 25; every field family: Select, Combobox, MultiSelect, DatePicker, Search, SmartSearch, RangeField, RoleSelect): rounded fill with a straight 1 px `--color-border-input-strong` (30%) line along the bottom, hover `-strong-hover` (40%); error = the danger outline alone; focus = the ring (rule 9.14).

### mobile-number-field-organism · `PhoneField`
Use: Phone numbers; supports country/region selection and international format. L full page, M compact.

### text-area-organism · `TextArea`
Use: Multi-line text. L full page (grows 140→300px), M compact (100→260px); then scrolls internally. Width 140–400px.

### search-regular-organism · `Search`
Use: Simple keyword/name search where the use case needs no AI (column filters, small lists). The default search is `SmartSearch`; which one is the screen's call by use case (Nov 20).

### smart-search-organism · `SmartSearch`
Use: The default search (AI search): keywords or natural-language queries, where the system interprets intent instead of only matching names.
Notes: Keep it visually distinct from column filters.

### form-card-organism · `FormCard`
Use: A surface that wraps a form: header (title, optional description, one optional action) → optional divider → body (fields) → optional footer (actions).
Notes: Width and padding: rules 3.17, 3.2 (`inset-l`); `--radius-floating`, elevation 2 (rules 4.1, 4.2). The "a form on a page" wording vs a card built like a dialog is still open (rules §15). Height hugs content up to the viewport, then the body scrolls between pinned header and footer. Validation: rule 14.4. Loading = field skeletons; submitting = primary spinner, form locks.

### checkbox-atom · `Checkbox`
Use: Bare checkbox inside tables, list rows and cards; supports indeterminate for parent rows.

### checkbox-molecule · `Checkbox`
Use: Labelled checkbox in forms — selecting any number of items.
Don't: An immediate on/off setting — use `switch-molecule`.

### radio-button-atom · `Radio`
Use: Bare radio inside list rows (e.g. single-select filter categories).

### radio-button-molecule · `Radio`
Use: Labelled exclusive choice among a few options in a form.

### switch-atom · `Switch`
Use: Bare toggle inside cards/rows (e.g. map layer cards).

### switch-molecule · `Switch`
Use: Labelled on/off setting that applies immediately.

### sliter-atom · `Slider`
Use: The slider thumb; building block only.

### slider-molecule · `SliderTrack`
Use: Default = one thumb, zero is the floor, fill length = magnitude. Range = two thumbs, choosing an interval. Centered = zero in the middle, fill left for negative, right for positive.

### slider-organism · `Slider`
Use: A slider as a form field, with title, value and hint; put the right `slider-molecule` type in its slot.

## Selection

The `-atom` sets are the closed field and list rows; `-list-molecule` is the popup list; place the organisms. Size by surface: rule 14.3. Time Picker and Filter are documented compositions with no component set.

### single-select-atom · `Select`
Use: The closed dropdown field; part of `single-select-organism`. Use alone only for S toolbar/footer selectors or XL view selectors.

### single-select-list-atom · `Select`, `Menu`
Use: One option row in a single-select popup.

### single-select-list-molecule · `Select`, `Menu`
Use: The option popup. Group headers only when the list mixes kinds or sources (Recent / Suggested / Results).
Code: `Select`'s option list, and `Menu`: the same list as a command menu anchored to a trigger (rule 14.9; sizes and the 4 offset rule 3.8). Motion: the list opens with a 2 drop in 100 and fades out in 50 (rule 5.1). Items take an icon, shortcut, description, danger, disabled with a reason, a selected check, dividers, section titles and submenus. Pattern helpers such as SplitButton are built on it.

### single-select-organism · `Select`
Use: Choosing one option from a list.
Don't: 2–5 options that should all be visible — use `segmented-control-organism`; long lists the user needs to type into — use `signle-combobox-organism`.

### multiple-select-atom · `MultiSelect`
Use: The closed multi-select field showing chips + "+N"; part of `multiple-select-organism`.

### multiple-select-list-atom · `MultiSelect`
Use: One checkable option row in a multi-select popup.

### multiple-select-list-molecule · `MultiSelect`
Use: The multi-select option popup.

### multiple-select-organism · `MultiSelect`
Use: Choosing several options.
Notes: Editing happens in the popup (keyboard: rule 9.7). ✕ / Delete clears all, recoverable via an Undo toast.

### signle-combobox-organism · `Combobox`
Use: Single choice where the user types to filter the list.
Notes: "No results" shows the headline with the query; suggestions only when real fallbacks exist. Popup sizes to content.

### multiple-combobox-organism
Use: Several choices with type-to-filter.
Notes: While searching the field shows the query, not the selection; clearing the query keeps selections; selected items are grouped on top on open and don't jump while open.

### segmented-control-atom
Use: One segment; building block.

### segmented-control-organism · `SegmentedControl`
Use: Picking one of 2–5 always-visible options, usually switching a view mode in a card, drawer or chart header. Size: rule 14.15.
Notes: `iconOnly` (2.0.6) shows each option's icon only, 16 in a square segment, with `label` as the accessible name and tooltip; M is `--size-control-m` outside. Used for the chart card's Chart / Table switch (rule 10.2).
Don't: More than 5 options — use `single-select-organism`.

### chips · `Chip`
Use: A clickable token for one value. Selection chip = an applied filter value, removable with ✕. Suggestion chip = a fire-once next action or prompt, no ✕, no checked state. Group logic: rule 14.5.
Don't: Read-only labels (→ badge).

### cooper-chip-atom · `CooperChip`
Use: In-context marker where Cooper has a recommendation for something that already exists (node, asset, field, row); click opens the recommendation.

### icon-picker-atom · `IconPicker`
Use: One selectable icon cell; building block.

### icon-picker-variants · `IconPicker`
Use: Icon grid content; building block.

### icon-picker-organism · `IconPicker`
Use: Choosing an icon for a user-created object (e.g. chat folder) from a curated set; single-select. Place it inside `popover-organism`.

### weekday-atom · `Weekday`, `Weekdays`
Use: Weekday header cell in the calendar; names and first day from the locale (rule 8.29).

### date-atom · `Calendar`
Use: One day cell in the calendar.

### date-picker-molecule · `Calendar`, `DatePicker`
Use: Single date: clicking a day commits and closes, no Apply. Range: two clicks, then Apply. The field is typeable and stays in sync with the grid; the header opens a month/year view.
Notes: `Calendar` month/year title: rule 2.4. `fill` takes the full card width (Command calendar): date cells keep 32 and spread.

## Navigation

Family note: Atoms are items; organisms are the containers with slots.

### navigation-panel-atom · `NavItem`
Use: One sidebar row: section (Parent), sub-section (Child), group header (Subtitle).

### navigation-panel-organism · `SideNav`
Use: Level 2 navigation (what it lists and when it shows: rule 14.19). One sidebar for all levels; only the list changes. Only its header (level title + collapse) is sticky when the list scrolls. Exactly one item is current. Folding: rule 3.19.

### tab · `Tabs`
Use: One tab; use `show-counter` for table filter tabs.

### tab-organism · `Tabs`
Use: Switching between peer views of one page; also the library table filter with counts (rule 14.6).
Don't: Stage or section navigation, or step progress.

### canvas-container-atom · `CanvasColumn`
Use: One column label (240×26, e.g. "Enterprise Goals") inside `canvas-header`. Not the mini-map (not in the DS, rule 14.16).

### canvas-header · `CanvasHeader`
Use: Column header strip across a framework canvas (Enterprise goals · Value framework · …), placed under the page header on map views.

### sunkey-canvas-header · `Sankey`
Use: Column header for the Sankey canvas view.

### stepper-molecule · `Stepper`
Use: One step; building block.

### stepper-organism · `Stepper`
Use: Progress through a multi-step flow; any number of steps. Non-interactive (rule 14.10).
States (S3, Nov 24): in progress = the one solid white bar (`--color-border-selected`), white icon, Label/M/medium; completed = check and bar at white 75% (`--color-icon-completed`, bar `--color-border-completed`), white regular label; not started = faint bar, dotted icon, soft label.

### breadcrumb-atom · `Breadcrumb`
Use: One crumb; building block.

### breadcrumb-organism · `Breadcrumb`
Use: Where the page sits in a hierarchy, with a back ‹ control. Keyboard: rule 9.8.

### pagination-organism · `Pager`
Use: A record pager for item-by-item content (Trace report). Never for tables (rule 14.6).

## Feedback

### tooltip-organism · `Tooltip`
Use: A short non-interactive label on hover and focus (text, status, date, avatar, metadata), 4 from its trigger, `--z-index-tooltip` above toasts. Rules 14.11, 9.2.
Motion: fades in over 100 after the 300 pointer wait; at once on keyboard focus; closes at once (rule 5.1).
Don't: Essential content, headings, links, buttons or forms (→ popover).

### alert-organism · `Alert`
Use: Rule 14.12.

### snackbar-organism · `Snackbar`
Use: Rule 14.12; show one with `IFS.toast`. Placement: the one top-end stack, rule 4.2 (one page margin in, below the header, 8 apart, newest on top).
Timing (rule 14.12, G5): with an action at least 10 s, then until the user's next command elsewhere; without one 6 s; hover and focus hold it; one action snackbar at a time. A pattern that renders its own Snackbar uses `IFS.useSnackbarTiming({ action, duration, onClose })`. No live role of its own: `IFS.toast` announces it (rule 9.19).
Motion: slides in 16 from the end side over 100; closes with a fade and 16 back to the end side in 50 (rule 5.1).

## Surfaces

Family note: all surfaces are organisms with a free content slot; the slot holds any content with its own spacing.

### modal-organism · `Modal`
Use: Rule 14.13. Examples: confirm a collaborator and role, a critical decision, a short Save/Cancel form.
Focus (rules 9.17–9.18): opens on its first field, else its title (never ✕); traps Tab and makes the page behind `inert`; returns focus to the trigger (or its nearest container) on close. A drawer with a scrim does the same.
Motion: rises 2 over 200 and the scrim fades in over 200; both fade out in 100 (rule 5.1).

### floating-bar-organism · `FloatingBar`
Use: Contextual action bar, top-centre, shown while something is selected on the map: what is selected + actions (secondary buttons, then one primary) + ✕ to clear.
Notes: Multi-select shows a count and only actions valid for the whole set.

### panel-organism · `Panel`
Use: Rule 14.14. Examples: confidence rail, inspector, reading pane. Full height, a divider (not a shadow) on its edge; widths and mode rules 3.17–3.18.

### popover-organism · `Popover`
Use: Rule 14.14 (width rule 3.17). Examples: detail preview, small picker, quick action list, view switcher, display settings, searchable list behind a count ("16 Documents").
Motion: drops 2 over 100, 4 from its trigger; fades out in 50 (rules 5.1, 3.8).

### drawer-organism · `Drawer`
Use: Rule 14.14. Example: node details on the map. Can expand to fill the content area. `floating` sits one `--float-inset` in, below the header and above the bottom sheet (rule 3.18).
Motion: slides in from its edge over 200; slides back out in 100; reduced motion fades (rules 5.1, 9.11).

### canvas-background · `CanvasBackground`
Use: The infinite, pannable, zoomable ground plane for map-first and node-graph views (Value framework, Explore map).
`baseMap` dark | light | imagery (G3): what the map image is, so map glass picks black 40 (matches the theme) or black 85 (doesn't); default dark with an `image` (rule 4.2).
Don't: Document-flow pages — those use the 12-column grid.

### overlay-background · `Overlay`
Use: The dimming scrim behind a blocking modal.

### move-and-drop-background · `DropZone`
Use: Dashboard edit mode: widgets become draggable tiles and the background shows the dashed drop zone.

## Data Display

Place `content-card-organism`, `stat-card-organism` and `table-card-organism`. Status, table and activity sets go atom → molecule → organism; place organisms and molecules.

### badge-atom · `Badge`
Use: A small read-only marker of status or category attached to another object (Passed / At risk / Failed; Active / Draft / Archived; Critical / Recommended). Status words and colours: rule 1.1. Heights S / M / L = ladder xs / s / m (rule 3.5). Rules 2.10, 1.1.
Don't: The primary content (→ text). Don't badge everything.

### avatar-atom · `Avatar`
Use: The avatar face (initials colour, image, Cooper); building block.

### avatar-organism · `Avatar`
Use: A person or Cooper anywhere in the UI (header user menu, cards, comments).

### cursor-atom · `CollaboratorCursor`, `LiveCursors`
Use: Live multiplayer cursor with name label; one stable colour per user (rule 10.1).

### content-card-organism · `ContentCard`
Use: Every content card (content, selectable, settings, link, media; rule 14.8); vary it with props. M in primary areas, dashboards and full-width lists; S nested in drawers, side panels, popovers and dense lists. Short info beside the title ("9d left", a count, a date) goes in `meta`, not the description (rule 14.17).

### stat-card-organism · `StatCard`
Use: One key metric: title + value + optional trend or badge; `compare` for from → to. Size S by default; `size="m"` only by rule 2.6. Read-only: no hover, focus, selected or disabled; only a loading skeleton. Type: rules 2.4, 2.6.
Dashboards and the widget builder (Nov 25): one variant only, `size="m" descriptionPosition="inline"` (never mixed with below-description cards or with S). Its height comes from its content (`--space-inset` all round, title → value `--space-inset`) and is the dashboard row unit `--size-data-viz-row` (116 / 100 / 84). The description (inline or below) is `--color-text-soft`; keep inline descriptions short (they never wrap or truncate).

### marker-atom · `TimelineMarker`
Use: Timeline marker (icon/avatar circle); building block of `activity-organism`.

### connector-atom · `TimelineConnector`
Use: Line between timeline markers; building block.

### activity-organism · `TimelineItem`, `Timeline`
Use: The timeline base: build any activity/timeline entry type from slots (rule 14.8).

Legacy cards (rule 14.8). Legacy sets with no kit component: question-card, portfolio-card, submodel-card, impact-usage-card, photo-item, photo-gallery, capex-card, create-card, duplicate-framework-card. Kit-built legacy cards follow.

### version-card · `VersionCard`
Use: A version entry with change list.

### file-card · `FileCard`
Use: An uploaded document.

### stat-capital-flow-card · `StatCard compare`
Use: Capital-flow metric.

### collaborator · `CollaboratorRow`
Use: A collaborator row with invite status.

### user-card · `UserCard`
Use: An assigned person / owner.

### source-card · `SourceCard`
Use: Evidence/source behind a Cooper answer.

### sidebar-node-card · `SidebarNodeCard`
Use: Draggable node in a side list, dropped onto the canvas.

### node-card · `NodeCard`
Use: The node on the framework/map canvas — the named exception that earns its own component because of canvas behaviour (drag/connect, map-tied selection).

### approval-chain-timeline · `ApprovalChain`
Use: One step in the display-only approval history in `ActivityPanel` (rule 14.9).

### version-history-timeline · `VersionHistory`
Use: A version-history entry.

### activity-timeline · `Timeline`
Use: Activity feed entry.

### status-indicator-atom · `StatusIndicator`
Use: Colour-only dot for category/identity (legend, series marker, online dot); rule 1.1. `neutral` is the readable grey (`--color-icon-softer`).

### status-risk-atom · `RiskStatus`
Use: Icon + colour status for risk, health or process state; the default for meaningful status.

### status-readiness-atom · `ReadinessStatus`
Use: Readiness/completion gates: ready, passed, waiting, not begun (stepper stages, checklists, approval gates).

### indicator-molecule · `Indicator`
Use: Dot + text status label (e.g. "● Active" next to a page title). Types: the status words (rule 1.1; hue words still work); `archive` = neutral dot + `--color-text-softer`.

### status-readiness-molecule · `ReadinessStatus`
Use: Labelled readiness row (label + readiness icon/text).

### status-risk-molecule · `RiskStatus`
Use: Interactive risk status chip on cards, rows, assets.

### hotkey-atom · `Hotkey`
Use: Keyboard-shortcut label inside tooltips, menus and circular buttons.

### counter-atom · `Counter`
Use: Numeric count on tabs, chips, segmented controls.

### scroll-bar-atom · `ScrollArea`, `ScrollBar`
Use: Custom scrollbar inside scrolling surfaces (popover, drawer).

### table-sort-atom · `Table`
Use: Per-column sort control; one active sort at a time, active column shows ↑/↓.

### table-filter-atom · `Table`
Use: Per-column funnel filter, composable with tab filters.

### table-header-molecule · `Table`
Use: Sticky column header: short, muted labels in sentence case; align to the column's content.

### table-cell-atom · `Table`
Use: Every table cell; pick Type by content. Text start-aligned, numbers end-aligned with consistent decimals, dates start-aligned in one format. A missing value renders "—", read "No value"; zero is never a dash (rule 8.25).

### group-row-molecule · `Table`
Use: Collapsible group row in a grouped table (`groupBy`). Three states: open (caret down, rows shown), collapsed (caret, rows hidden), locked (lock icon, can't open, a short `note` says when it opens). The end of the row shows the row count, or a status (`groupInfo` → `end`). The screen decides each group's state; groups don't have to open one after another. `headerPerGroup` puts the column header under each open group (sectioned table).

### content-row-molecule · `Table`
Use: A table row (header or content) holding cells.

### table-card-organism · `Table`, `DataTable`
Use: Every data table (`Table`; `DataTable` adds the Table pattern's behaviour). Rules 3.7, 3.22, 14.6–14.7. Selected rows: a 2 outline (rule 1.1).

### notification-card · `NotificationCard`
Use: Notification tray card. Type = what happened; Read = unread dot + contrast; show-critical adds the error status.
Notes: Sits loose on the page, outside any documented frame.

## Data Visualisation

Build charts from the base atoms and a core chart type inside `DataVizCard` + `DataVizHeader` (rules 14.8, 10.1; the data viz rules are section 10, decided Nov 24, built in 2.0.6).

Base (building blocks; atoms/molecules) and chart containers:

### data-viz-card-organism · `DataVizCard`
Use: The card that holds any chart on a dashboard; Drag for dashboard edit mode.
Anatomy (`variant="chart"`, drawn by every core chart; rule 10.2): inset on all four sides, stack gap between header · plot · legend. Header (items 9 and 11, Nov 25): `title` (H4, `--color-text`) with an optional one-line `subtitle` (Body/M, `--color-text-soft`, ellipsis + full text on hover) under it · the chart's own control · [hover / focus: Edit with Cooper (its own button on cards 416 px and wider; the first ⋯ item below that), ⋯ (Move, then `menuItems`), `actions`] · Chart / Table switch (icon-only `SegmentedControl` M, when `onViewChange` is set) · Evidence button (always visible). The 6-dot drag handle sits in the start inset on hover / keyboard focus; the title never moves. `description` is screen-reader text (`aria-describedby`, and the top of the table view), never shown on the card (USER-SETTINGS row 11, open).
Moving (item 9, `movable`, default true): drag from the whole header (grab cursor, 4 px threshold, buttons excluded; `onDragEnd({ dx, dy })`); keyboard: the card is a tab stop, Space picks it up, arrows move one grid step (`onMove({ col, row })`), Space drops, Esc cancels (`onMoveEnd({ col, row, cancelled })`); "Move" in ⋯ does the same; every step is announced. Where the card lands is the dashboard pattern's job (phase 2).
Size (rule 10.3): `size` default (`--size-data-viz-card`, 3 dashboard rows + 2 page gaps: 380 / 332 / 284 at a 16 gap) | large (2 default cards + the page gap); the plot fills what is left (and the subtitle line when there is none). `autoHeight` for the `height` escape hatch; `bare` fills its frame. `legendPlacement` below | beside (pie, donut). `hideControls` hides the switch and Evidence (no data, rule 10.10).

### data-viz-header-molecule · `DataVizHeader`
Use: Chart title row with optional view toggle or button. `viewSwitch` sits after the hover row and before `slot` (Evidence), so it never moves when the hover row shows. `subtitle` (chart card): one line under the title; the controls stay on the title row (`.ifs-dv-header__controls`).

### data-viz-modal-organism · `DataVizTooltip`
Use: Chart tooltip / info pop-up showing exact values on hover.
Notes: `variant="chart"` is content-sized (12–20rem); charts place it beside the mark, 8 away, end side first (rule 10.6). Rows: `items` = [{ label, value, color, shape }], `shape` square | line | dashed | dot = the legend swatch of that series. Swatches show only when more than one row has a colour. Spacing: `--space-inset` start and end, `--space-300` top and bottom, `--space-150` title → rows, `--space-100` between rows.

### indicator-atom · `DataVizIndicator`
Use: Target/selection marker on a chart (e.g. bullet-chart target).

### value-label-atom · `ValueLabel`
Use: Axis or data value label.

### line-atom · `DataVizLine`
Use: Gridline / reference line; dashed for planned or median.

### legend-swatch-atom · `LegendSwatch`
Use: One legend entry (`LegendSwatch`; `Legend` for a whole legend). Rules 10.1, 10.5.
Notes: `shape` (2.0.6) matches the mark: square (bars, areas, slices, cells, default) · line · dashed (lines) · dot (scatter). `color` = a categorical slot (1–12), `'other'`, `'neutral'` or a data-viz token. Hover only; a hovered entry dims the other series.

### bar-atom · `DataVizBar`
Use: One bar; Background = the meter track. `color` = a categorical slot (default 1); hover keeps the colour, Out of focus darkens it (never transparent, rule 10.6).

### grouped-bar-molecule · `DataVizGroupedBar`
Use: Grouped bars: compare 2–3 series across the same categories; Progress=True = meter bar against a max. Segments take the categorical slots 1, 2, 3 … in order.

### donut-chart-atom · `DonutChart`
Use: Share of a whole; legend right for wide cards, below for narrow; direct labels for 2–3 slices.

### radar-chart-atom
Use: Comparing 3–6 options across 5–8 criteria; hover dims other polygons to 15%.

### progress-bar-molecule · `ProgressBar`
Use: Linear progress for measurable work (uploads, steps).

### progress-ring-molecule · `ProgressRing`
Use: Circular progress in tight spaces (cards, KPI tiles).

### evidence-strength-bar-molecule · `EvidenceStrength`
Use: Strength of evidence behind a Cooper recommendation, mapped to Reject/Review/Approve.

### sankey-header · `SankeyHeader`
Use: Column header of a Sankey chart; building block.

### sankey-atom · `SankeyNode`
Use: One Sankey node; building block.

### sankey-chart · `Sankey`
Use: Sankey canvas body; building block of `sankey-organism`.

### sankey-organism · `Sankey`
Use: Flow: how a total splits through stages (budget allocation, value decomposition, goal → objective → model lineage); band width = value.

### timiline-phase-molecule · `TimelinePhase`
Use: One phase row of the Gantt; building block.

### timeline-chart-organism · `TimelineChart`
Use: Gantt: tasks/phases on a time axis (e.g. investment phases across a 5-year plan); shows sequential vs parallel work.
Notes: A phase row expands and collapses with a caret `IconButton` S; the phase name is plain text, not a button (rule 6.2).

Core chart types. All share the states Default, Hover, Cooper, Loading, Empty (no data), No results and Error, each at the card's height (rule 10.10; `state`, `onRetry`, `onClearFilters`), and the props `title`, `subtitle`, `description` (screen-reader only), `size` (default | large), `valueTicks` (2–8 value-axis intervals, default 4), `view` / `onViewChange`, `onCooper`, `onEditWithCooper`, `actions`, `menuItems`, `movable` / `onMove` / `onMoveEnd` / `onDragEnd`, `bare`, `height` (escape hatch). Give the same entity the same `color` on every chart of a screen (rule 10.12). Series take the categorical slots in order (keep it to 8: guidance; lines colour up to 12; stacks and slices fold into "Other", rule 10.7). Types with no kit component: box plot, radar, treemap.

### chart-column · `ColumnChart`
Use: One measure across few or time-ordered categories ("which is biggest"); zero-based, one colour (slot 1). Legend only with a reference (one series = no legend); the radius sits on the end away from the baseline.

### chart-bar · `BarChart`
Use: Horizontal bars for many categories, long labels or rankings (sort biggest → smallest). Also the answer when column labels would need rotating (rule 10.4).

### chart-grouped-column · `GroupedColumnChart`
Use: A few series side by side per category; every series and group is drawn (4 or fewer read best), legend below, consistent series order; bars at least `--size-data-viz-bar-min` with a 1 gap and groups at least `--size-data-viz-group-gap-min` apart, otherwise the plot scrolls sideways under a fixed value axis (rule 10.9).

### chart-stacked-column · `StackedColumnChart`
Use: Composition of a total per category; the one stacked-column component (rule 10.9). Up to 8 named segments + one grey "Other" (5 or fewer read best), most important on the baseline, a 1 card-colour gap, only the outer end rounded; legend below in stack order; the tooltip lists the named segments top to bottom, then "Other" with its total and each folded series under it.

### chart-line · `LineChart`
Use: Change over time — spend/burn tracking, actual (solid) vs planned (dashed), trend and rate of change. `endLabels` (default on) names each line at its end; when the names collide or don't fit, a vertical legend sits on the end side of the plot (line / dashed swatches), in the order the lines end (top line first); the tooltip lists the series by value at the hovered point, highest first. Every line up to 12 has its own colour (keep it to 8: guidance); the 13th and later grey with one "Other" entry.

### chart-area · `AreaChart`
Use: Cumulative volume over time; zero-based; names at the line ends, or a vertical legend on the end side when they collide (square swatches).

### chart-histogram · `HistogramChart`
Use: Distribution of one measure across bins.

### chart-pie · `PieChart`
Use: Parts of one whole with few slices. Prefer `chart-donut` (documented). Legend: a list beside the chart with values; share labels on the bigger slices, in white or black by contrast; up to 7 slices + "Other"; colours follow the displayed order.

### chart-donut · `DonutChart`
Use: Share of a whole; slices largest → smallest clockwise from top; the legend is a list beside the chart with each slice's value (rule 10.5); up to 7 slices + "Other"; colours follow the displayed order (slot 1 = largest).

### chart-scatter · `ScatterChart`
Use: Relationship between two measures; clusters and outliers. Legend below (dot swatches); every point has a 24 hit area (rule 3.9).

### chart-bubble · `BubbleChart`
Use: Scatter with a third measure as size; the legend carries a size key (smallest and largest).

### chart-heatmap · `HeatmapChart`
Use: Ordered magnitude across a matrix, using a sequential ramp (`ramp` azure default | teal | cyan | orchid | pink | yellow; `classes` 5 or 9; rule 10.8). The legend is a scale bar below. Often the large card.

### chart-box-plot
Use: Comparing distributions side by side.

### chart-radar
Use: Profile of 3–6 options across 5–8 criteria.

### chart-waterfall · `WaterfallChart`
Use: Bridge from a start value to an end value through increments. Totals neutral; increases and decreases on the diverging pair (positive pink, negative azure) and always signed + / −.

### chart-treemap
Use: Hierarchical part-to-whole by area.

### chart-gauge · `GaugeChart`
Use: One KPI against one reference value; the arc in slot 1, as thick as the donut ring, `--radius-mark` ends; the centre metric is the StatCard S value (rule 10.11).

### chart-funnel · `FunnelChart`
Use: Drop-off across ordered stages.

Legacy and domain charts (Chart List frame; no kit component; keys in figma.json). Built before the base; use one only to match an existing screen, otherwise build from the base + a core type. Each charts the metric in its name: chart-portfolio (by weight or budget), chart-projects, chart-strategic-objectives-breakdown, chart-strategic-objectives (five sets with the same name), chart-coverage-measure, Capex burn by quarter, chart-framework-coverage, investment value, scatter chart (use `chart-scatter`), the admin charts (chart-draft-disposition, chart-brief-to-decision, chart-cooper-findings, chart-needs-you-flags), the sponsor charts (chart-capital-by-cycle, chart-decisions-by-source, chart-benefits-realized, chart-risk-reduction) and the dashboard charts (planned-vs-actual, retained-risk-by-feeder, outage-minutes-vs-peers, capex-variance-by-project, feeders-by-outage-minutes, cost-per-km-vs-peer-range).

## Shell (pattern page)

### global-header
Use: An older 48 nav bar in some pattern screens. Use `NavBar` instead.

### nav-bar-organism · `NavBar`
Use: Level 1 navigation between product stages; one on every screen (Nav bar pattern).

### nav-bar-page-atom · `NavBarItem`
Use: One stage tab in the nav bar; building block.

### logo · `Logo`
Use: IFS Copperleaf logo in the nav bar and log-in screen.

### sidebar-pattern · `SideNav`
Use: The ready-made L2 sidebar (rule 14.19); each stage or entity supplies its own page list.

### header-pattern · `PageHeader`
Use: Figma's header pattern with toggles for stepper, canvas header, Cooper recommendation and collaborators; build it with `PageHeader`.

### page-header-pattern · `PageHeader`
Use: Level 3 page header; build it with `PageHeader`.

### page-header · `PageHeader`
Use: The thin header inside one entity (rules 12.1, 12.3).

### page-top · `PageTop`
Use: The intro of a broad page (rule 12.1). Also the Command home intro (Cooper eyebrow, no button) and the Build page (title only, Tabs L, no search).
Don't: A single object's page (→ `PageHeader`).

### explore-header-pattern · `ExploreHeader`
Use: The Explore and Study map bar (rules 12.1, 12.6).

### base-bottom-sheet-organism · `BottomSheet`
Use: Default bottom sheet for any tab: Cooper FAB + prompt chips.

### value-bottom-sheet-organism · `BottomSheet type="documents"`
Use: base + the entity's documents and upload, which build Cooper's context (where: rule 14.18); read-only (no upload) once a framework is Active. `type="value"` is the old name and still works.

### explore-bottom-sheet · `BottomSheet type="explore"`
Use: Explore tab only: base + map controls.

## Content States (pattern page)

### empty-state-organism · `EmptyState`
Use: A region with no content: heading (required) + optional icon, body, suggestion chips, one primary + one secondary action. Cause and size: rule 7.2; copy: rule 8.22. Errors (L3): a load failure shows `cause="error"` (section) in the frame of the region that failed, `size="full"` only when the whole page has nothing; partial data keeps its content with a warning `Alert` above it; load errors keep the warning icon and tone, danger is for destructive actions and field validation. The look is restyled in 2.0.7 (components).

### Skeleton · `Skeleton`, `LoadingRegion`
Use: One skeleton look for every loading variant (L1, Nov 24): static shapes on `--color-background-skeleton` (Figma background/elevation-1/secondary) with a slow pulse, opacity 1 → 0.5 → 1 on `--motion-loop-pulse` (1.6 s, linear); no shimmer. The class is `.ifs-sk`; every Loading variant (stat, content, file, user and version cards, avatar, badge, indicator, readiness, chart, home-row card, node card, trace solution, table cells) uses it. Reduced motion: no pulse, the shapes stay. `Skeleton` only for an owning component without a Loading variant; `LoadingRegion` around the component that owns the async data. Which indicator, when: rule 8.23.

### empty-state-spinner-molecule · `Spinner`
Use: Indeterminate or shapeless waits where no layout can be previewed. `announce={false}` drops its live role inside a region that already announces (`LoadingRegion` does this, rule 9.9).

### empty-state-loading-more-molecule · `LoadingMore`
Use: Appending items to an already visible list.

### progress-bar-loading · `ProgressBar showValue`
Use: Measurable work (uploads, steps, known duration).

## Comments (pattern page)

### comment-input-atom · `CommentComposer`
Use: The comment input pill; modes switch without clearing the draft; Cooper mode has an orange border (attribution).

### comment-input-molecule · `CommentComposer`
Use: Input + current-user avatar; used inline on the canvas next to an anchor.

### comment-input-organism · `CommentComposer`
Use: Molecule + stacked thread indicators; used at anchored threads with history.

### comment-pin-organism · `CommentPin`
Use: Canvas anchor for a thread, attached to an entity; hover = preview only, click opens the thread.

### comment-popover-organism · `CommentThread`
Use: Full thread opened in place from a pin: header (ID, ⋯, resolve ✓, ✕), replies, input docked at the bottom.

### comment-content-card · `Comment`
Use: One reply inside a thread.

### comment-drawer-card · `CommentDrawerCard`
Use: A thread entry in the Comments panel/drawer list.

## Cooper (pattern page)

### agent-window-organism · `AgentWindow`
Use: Floating panel where Cooper surfaces recommendations and the user accepts or rejects them; opened from the Cooper badge or by Cooper itself (Cooper rule 14).

### chat-collapsed-bar-organism · `ChatCollapsedBar`
Use: Cooper chat size S — the default when chat opens; quick exchanges.

### chat-compact-panel-organism · `ChatCompactPanel`
Use: Cooper chat size M — enlarged from S for longer threads.

### chat-full-panel-organism · `ChatFullPanel`
Use: Cooper chat size L — full workspace with folders and history.

### agent-bottom-sheet
Use: Bottom sheet while Cooper is analysing.

### speaking-control-molecule · `SpeakingControl`
Use: Voice-conversation control; "Paused" stops speech while generation continues.

### text-message-input-molecule · `TextMessageInput`
Use: Text input footer of Cooper chat.

### voice-message-input-molecule · `VoiceMessageInput`
Use: Voice input: speak, pause, message auto-sends.

## Map (pattern page)

### card-asset-organism
Use: Asset summary tile (name · type · corridor) with risk indicator.

### card-layer-organism
Use: Toggle card that turns a map layer on/off.

### card-category-layer-organism
Use: Layer category card with active count ("1/5 layers on").

### map-pin-teardrop · `MapPin`
Use: Default location marker for one asset on an exact spot. Other pins on the page (`map-pin-dot`, `-square`, `-pole`, `-defect`, `-flow`) cover counts, clusters, readings, defects and direction.
Status: `MapPin` takes the five C1 words, `neutral` · `danger` · `warning` · `success` · `info` (`error` = old name for danger). Fills (G2 option B, Nov 25): neutral `--color-icon-map-pin-neutral` (#737373) and danger `--color-icon-map-pin-danger` (#e5001e) with white glyphs and counts; warning keeps its fill with a black glyph and count. The dot pin `MapPinDot` takes `danger` · `warning` · `neutral` (old-name aliases: `error` draws danger, `success` and `info` draw neutral; rule 1.1).

### map-status-risk
Use: Planning-risk severity on a map asset (icon + %).

### map-status-event
Use: Live measured value on a map asset (real-time state, not planning risk).

### object-card-molecule
Use: Scrollable grouped list of map objects ranked by risk.

### locationItem
Use: Single-select row to pick/confirm a location.

### hierarchy-slider-pattern
Use: Map hierarchy level slider.

## Other pattern pages

### log-in-form-pattern
Use: The auth form: SSO first, "OR sign in with email", email + password, Forgot password / Remember me, Sign in, footer links.

### home-row-card-organism, stat-cards-row, review-investment-table, review-data-visualisation · `HomeRowCard`, `StatCardsRow`, `TableReview`, `InvestmentValueImpact`
Use: Ready-made Home and Review screen sections.

## Icons

215 icon component sets plus 22 standalone icon components. Names are kebab-case, prefixed by family: `arrow-*` (arrow-left, arrow-chevron-down, arrow-trend-up …), `chat-*` (chat-folder, chat-microphone-voice …), and so on. Almost every set has one variant axis `size` with values from `24 | 16 | 12` (94 sets have 24/16 only; the rest also 12). Exceptions: one set with `State=[Default|Insight|Smart search]`, one with `Type=[strong|medium|low]`. Sizes: rule 6.1. Names: `dist/icons.txt`.


## Layout (code only, not Figma components)

### AppShell · `AppShell`
Use: The product shell: nav bar, side nav, page header, content, optional panel, bottom sheet (rule 3.20). `panelMode` push | over (rule 3.18). Renders the "Skip to content" link as the first tab stop (`skipLabel`, rule 9.16).

### Stack and Inline · `Stack`, `Inline`
Use: Layout spacing between things in a screen (rule 3.12).

### Formatting · `IFS.format`
Use: Every number, amount, percentage, date, time and fiscal year a screen shows (rules section 8).

## Patterns

How components work together, from the Figma file IFS Design System Patterns. Each pattern: what it's for, its parts (kit components), and the behaviour rules that are not in [rules.md](rules.md). Pattern helpers (DataTable, CooperChat, WidgetBoard …) implement a pattern's rules and are allowed; say so in a plan. Examples in Storybook are demo screens to learn from, not to copy wholesale. Figma sources, consolidated legacy sets and open Figma questions per pattern are in [figma.json](figma.json).

| Pattern | Use when the screen involves… | Main parts |
|---|---|---|
| Nav bar | the app shell: stages, sidebars per stage, collapsed nav | NavBar, SideNav, SideNavTree, ExploreHeader |
| Table | any list of records: filters with counts, search, sort, ranking, rename, preview, columns | DataTable, ColumnFilter, TableToolbar, SmartSearch |
| Cooper | the AI assistant: chat sizes, answers, history and folders, recommendations | CooperChat, ChatCompactPanel, ChatFullPanel, CooperMessage, HistoryPanel, CooperRecommendations |
| Documents | Cooper's document context in the bottom sheet: upload, remove, read-only, errors | DocumentsContext, DocumentsPopover, DocumentRow, BottomSheet |
| Widget builder | dashboards and reports made of widgets: add, reorder, resize, undo | WidgetBoard, WidgetFrame, WidgetsDrawer, StatCardsRow, WidgetCard |
| Collaboration | people on a record: invite, roles, reminders, remove | CollaboratorsMenu, CollaboratorsPanel, InviteCollaboratorModal |
| Comments | comments on canvas nodes: pins, threads, mentions, resolve, the drawer | CommentPin, CommentDrawerCard, CommentsPanel, CommentCallout |
| Approval chain | review and approval: approve, request info, push, publish | ApprovalChainTable, ApprovalChainPanel, ReadinessEvaluation, SplitButton |
| Confidence, trace & readiness | system confidence gates, the trace report, readiness evaluation | SystemConfidence, TraceReport, useIssueReport, Pager |
| Evidence chain | why a Cooper value is trusted: confidence zones, rationale, peer benchmark | EvidenceChainDrawer, SourceCard, PeerBenchmark, EvidenceStrength |
| Activity & versions | activity log, version history, comparing versions | ActivityPanel, VersionHistory, CompareHeader, CompareView |

### Pattern: Nav bar

**For:** the Level 1 bar that switches between stages, and what each stage brings: its own sidebar (or none), header, content and bottom sheet. On every product screen.
**Parts:** `NavBar` (logo, stage tabs `NavBarItem`, search / settings / notifications, avatar; collapse: rule 12.7) · per stage: Command and the Build library no sidebar; Value `SideNav`; Plan `SideNavTree` (folder tree + "Ad hoc plans" with ＋); Explore no sidebar, `ExploreHeader` under the bar; Build and Plan entity steps also dock the System confidence panel on the right, open at the start (rule 3.18); Explore a 48 right-panel rail. Content: Command = `PageTop` (Cooper eyebrow, H2 greeting, Tabs with counts, SmartSearch), "Decisions to review" + `SegmentedControl` S, the ranked `HomeRowCard` list, a right column with Cooper's results, milestone `ProgressBar` and `Calendar` (rule 3.14); Value = `PageTop` + the standard `DataTable` (tabs and search in `PageTop`, outside the card); Build = `PageTop` with `Tabs` L (Idea Pad / Investments) + the ranked `DataTable` with the segmented filter; Explore = map with `MapPinDot` clusters, `MapToolbar` (views top start, default view bottom start), `FtaButton`; Plan = title, description and owner, planning-cycle cards, `StatCardsRow`, affected-area map. Bottom: `BottomSheet` by rule 14.18, with two screen-specific prompts; Explore none.
**Rules:**
1. One bar on every screen (rule 3.20): logo at the start, actions at the end, exactly one stage active.
2. Stage order is fixed: Command, Value, Explore, Build, Plan, Results.
3. Sidebar: rule 14.19; without one the content takes the full width.
4. Switching a stage changes the whole shell below the bar. The active tab gets the header-item active fill.
5. Sidebar rows: Value picks a section (title and table change). Plan: a row selects that plan and expands its folder; the caret toggles a folder without selecting; the open path is outlined, the current folder filled. `arrow-bar-left` / `-right` collapse and expand the sidebar.
6. The hamburger list (rule 12.7) opens 4 under the button; picking a stage closes it.
7. Command list: `HomeRowCard` is the one card on all four tabs (My works / Decisions / Conversations / Following); the tabs change the list. Only the top card is Primary (gradient stroke, media); the rest Secondary. Metrics CPV and V/C; titles and descriptions truncate to one line. States: default, hover (`--color-surface-tertiary` fill), focus (focus ring), loading (skeleton bars, no media, arrow disabled). The priority segmented control filters the list; nothing at a priority shows the all-done empty state. Opening a decision goes to the stage on its badge.

### Pattern: Table

**For:** any list of records (libraries such as Idea Pad, Strategy Framework, Value Framework, Value Models; relationship tables on detail pages). Use `DataTable`; bare `Table` only for a static table.
**Parts:** `DataTable` card around `Table` · `TableToolbar` (40): the row filter at the start (`SegmentedControl` S in the card, or `Tabs` in `PageTop` on library pages, rule 14.6), at the end `SmartSearch`, a divider and a Tertiary S `IconButton` (`system-filter-settings`) for the Columns drawer · `ColumnFilter` (list + `Chip`s; `DatePicker`, `Search` or From/To fields by column) · cells: `Indicator`, `Badge`, `CollaborationBadge`, `TruncatedText`, `Avatar`, `ProgressBar` · row controls: pin `IconButton` and drag handle (ranked), preview `IconButton` (eye), `Menu more`, `FollowButton`, `DropIndicator` while dragging · `RecordPreview` (`over` panel) · Columns drawer (`Drawer` + `ColumnSettings` with `ContentCard` S rows) · `EmptyState`, `Skeleton` cells, `LoadingMore`, `toast`.
**Rules:**
1. Display: a table that is the only or last block loads more rows as you scroll (`progressive`); with several tables or blocks, each sits in a 600 card with Show more / Show less (`fixedHeight`). Loading = skeleton rows in the card; toolbar, tabs and header stay live.
2. Tab and segment counts follow the search; tabs with zero results hide while a search has results.
3. Only date and number columns sort. Text columns are narrowed with the column filter. Headers show only the controls a column supports. Empty dates and numbers sort last in both directions.
4. Two table types on one component. **Standard:** default order Last modified, newest first; sort toggles ↓ ↔ ↑, no "off"; no pin, rank or drag. **Ranked** (Build library): the user's manual order with pinned rows on top; sort is a temporary override ↓ → ↑ → off. Turn ranking on only where users set priorities.
5. Pins: pinned rows always show the pin (hover: Unpin); no limit; a new pin joins the bottom of the pinned group; while sorted, pinned and unpinned groups sort separately. Dragging within a zone reorders; across zones pins or unpins; a thin drop line marks the spot. Drag is off while a sort, search or filter is active.
6. Filters: chips for a finite vocabulary (status, type, owner, segment); a From/To range for numbers, currency, percentages and dates; never both on one column. Chips show only values present in the table, about 6–8 at most (smart search covers the rest); Ideas and Collaboration chips are generated by AI from keywords or frequent values; users don't manage them. The default is All; picking a chip deselects All. The header shows "Filter n" and Clear all; the funnel shows a dot while active; click outside closes.
7. Chips + period (Horizon, Modified) combine with AND. A horizon matches when it overlaps the period. Modified presets: Last 7 / 30 / 90 days and This year, from today in the user's time zone, one at a time. Custom periods include both ends and apply on Apply.
8. Ranges: bounds optional and inclusive ("from X up", "up to X"); arrows step one unit (1, 0.1 for ratios, $0.1M for currency) and repeat while held; a value applies live and commits on blur.
9. Clear filters resets every column filter, not the search or the tab. Filters also clear one column at a time.
10. Search: suggested questions on focus → type → Enter → "Searching…" row → results. No match: "No results found" with suggestion chips, tabs disabled at 0, header hidden. Filters with no match keep the header and show `EmptyState` "No results found / Try a different term, or clear filters to see everything." + Clear filters; tab counts show 0.
11. Collaboration badge: opens the record where the request came from; the label names what's expected ("View reply"); its tooltip is read-only (who, what, when) and follows the badge; several requests show a count and open the newest.
12. Name truncation is a per-tenant setting: end, middle (≈50/50), start, wrap to 2 lines, or segment (whole words removed from the middle). Display-only; every mode has the full-name tooltip; the INV code under the name never truncates.
13. Row: hover highlights; click opens the record; double-click the name renames inline (the name must be unique, or the save is blocked with an error; confirm with a toast + Undo, rule 14.12); ⋯ opens more actions; the eye opens the preview.
14. More actions: each library sets its list (it may depend on status); omitted vs disabled: rule 9.10; destructive last (rule 14.9).
15. Preview: the eye on hover opens a side panel with ID, details and ✕; the table stays usable; a new preview replaces the open one; row click still opens the record page.
16. Columns drawer: Cooper search ("Find a suitable column by description"); shown columns drag to reorder and hide with the eye (both apply at once; hidden columns stay in the list); "Suggested by Cooper" + adds a column, whose cells load before values appear.
17. Don't put interactive content in the collaboration tooltip.

### Pattern: Cooper

**For:** the AI assistant on every stage screen: asking about the current screen, Cooper's proactive recommendations, and past conversations. Always over the content area of an AppShell screen (the full chat floats one page margin in, rule 3.18); never docked, a modal or a full page.
**Parts:** entry = `BottomSheet` prompts (`PromptButton`) + `FtaButton`, shortcut `/` · three sizes: `ChatCollapsedBar` (320 pill above the bottom sheet), `ChatCompactPanel` (320×360 floating; it opens from the orb's spot, above the bottom sheet, rule 3.20), `ChatFullPanel` (floating a level above the page, rule 3.18); each with `ChatHeader`, `TextMessageInput` or `VoiceMessageInput`, `Attachment` · conversation: `UserMessage`, `CooperMessage` (`CooperProgress`, `ChatCard`, `ChatLink`, `Button`) · history: `HistoryPanel` (240, beside the full panel, inside the same floating panel) with `FolderItem`, `SectionHeader`, `ChatHistoryCard`; `FolderContent`; `HistorySearch` + `SearchChatHistoryCard`; `Modal` + `ConfirmDeleteCard`; create folder `Modal` + `TextField` + `IconPicker` · recommendations: `CooperChip` in `PageHeader` → `AgentWindow` (`SpeakingControl`, `RecommendationGroup`, `RecommendationItem`, `RecommendationDetail`, `RecommendationImpact`) · behaviour: `CooperChat`, `CooperHistory`, `CooperRecommendations`.
**Rules:**
1. Opens in voice mode ("Say anything, I'm listening") by "Hey Cooper", `/` or the avatar; the keyboard icon switches to text ("Write anything, I'm reading"), the mic back. In voice mode the transcript shows large while the user speaks. A prompt chip sends at once.
2. "Hey Cooper": the avatar expands into the inline field, a sound plays, the chips hide; Cooper doesn't reply by voice. After ~1.5s of silence the question sends and the floating window opens; after ~6s with nothing said, it collapses back.
3. Sizes: bar → expand on hover (tooltip "Expand to floating window") → compact; the window icon switches compact ↔ full panel. − or a click outside collapses to the avatar; it never closes completely. While the chat is open the bottom sheet hides its chips and avatar (`display:none`; one entry point at a time): the orb turns into the chat.
4. The full panel resizes from its edge up to a maximum; the bar and floating window can be dragged anywhere. The chat never overlaps a widget it generates (the widget appears on the other side).
5. Sending from the bar opens the compact panel. An answer goes Analysing ("Cooper is working on it (Step n/total): …") → Streaming → Answered; Send becomes Stop meanwhile. Step total is 2 for a simple question, 3–4 for building a widget or alternative; only the step text changes.
6. A message has four blocks: "Analyzed your request" (collapsed once complete), content (always), follow-ups, clarifying options. Empty blocks hide with their header; follow-ups hide while options show. Picking one sends it as the user's message; the user can also type their own answer.
7. Stop during Analysing: the progress freezes, "Stopped", no answer, Try again resends. Stop during Streaming: the partial answer stays, blocks that hadn't rendered stay hidden, and Regenerate is offered. Stop never deletes the user's message.
8. Errors: "Something went wrong on our side" or "Connection lost", each with a retry icon (tooltip "Try again"); offline questions resend when the connection returns; a partial answer stays above the line.
9. The chat title is "New chat" until the first answer; then Cooper names it.
10. Input: typing shows Send; multi-line (radius 4, `--radius-control`) moves the buttons below; files by + or drag onto the panel (any number; the input grows to 400 then scrolls; ✕ removes a file; a file can send without text). Hover your message to copy or edit; saving an edit resends.
11. History: Search, Start a new chat, smart folders, your folders (See all after 3), chats grouped Today / This week / Earlier. Chat ⋯: Pin, Rename, Move to folder, Select, Delete. Section ⋯: chats Select, Delete all; folders Create folder, Select, Delete all. Select mode adds a footer (Move, Delete, "Selected n ✕"); Cancel clears the selection. ✕ on an item in a Delete or Move dialog only deselects it.
12. Smart folders (Reminders, Recommendations, Trash) are system-managed; deleted chats stay in Trash 30 days. Users create, rename, give an icon to, bulk move and delete their own folders; deleting a folder never deletes its chats.
13. Show the history panel only beside the full panel; from the compact window the history button first switches to the full panel.
14. Recommendations: chip → window grouped by framework column → expand an item (description, impact, Explore) → Shape walks through them (Back, Decline, Do it) → "Working on it: Applying…" → "I've added … Let's go to the next"; after the last, "All selected recommendations have been applied…" and the window closes. Every recommendation is saved as a chat in Recommendations. Decline removes it and updates the count (the chip disappears at 0; "Decline all" only with more than one); declined items stay in history. Each shows the two impact metrics the backend marks. Cooper never auto-commits.
15. Recommendations and the chat are never open together; "Ask" switches to the chat.
16. After a canvas change Cooper opens with a working message, then a result and Undo; Undo discards only Cooper's recalculation.
17. Selecting text anywhere offers "Ask Cooper to explain" (opens the chat with the text in context). A closed walkthrough resumes where it stopped; "Start over" restarts it.

### Pattern: Documents

**For:** the files attached to a record (investment, value framework) that build Cooper's context. They live in the bottom sheet, never on their own page; not a general file manager.
**Parts:** `BottomSheet type="documents"` with `DocumentsContext` ("Cooper's Context", optional coverage `ProgressBar`, documents Tertiary M `Button`, Upload Tertiary M `IconButton`) · `DocumentsPopover` (`Popover` "Documents" + `Counter`, search, ✕) of `DocumentRow`s (`FileCard` row: name, upload date; hover ⋯ Download / Remove when editable, Download when read-only; error rows Remove + Retry; uploading rows skeleton) · `DocumentsDropArea` (`DropZone` + `NodeCard type="document"` ghosts while dragging) · `DocumentsFeedback` (`Alert`, `Snackbar`, in the one top-end snackbar stack below the page header, rule 4.2) · state `useDocuments({ defaultDocuments, editable, required })`.
**Rules:**
1. The button reads "1 Document" / "N Documents" and is hidden at 0. The popover opens 4 above the bottom sheet, clear of canvas tools, at most 360 tall: 1–7 documents no scroll, 8–9 scroll, 10+ search appears. Newest upload first. Search filters by name; no match "No results found" with no counter.
2. A row opens a preview in a separate window; Download downloads; ✕, Esc or outside click closes the popover.
3. Attach by Upload (multiple files) or by dropping files on the content (purple dashed overlay while dragging). Each file is checked first; a rejected file never enters the list or the count. Accepted files show as loading rows and the button icon spins; on success the count goes up and the list opens with the new file on top.
4. Rejection messages (error `Alert`; nothing is left to fix, so it closes on the next action or ✕, rule 14.12): «Can't add "{file}" — supported formats are {list}.» (PDF, DOCX, XLSX, PPTX, TXT, CSV); «Can't add "{file}" — the file is {size}, the limit is {limit}.» (25 MB, no Retry); several: «{n} of {total} files added. {m} files were skipped — unsupported format or too large.» + See details.
5. Network failure: the row stays with "Upload failed" + retry (tooltip "Try again"), uncounted and outside Cooper's context until it uploads; retry resends that file, one row at a time; completed files stay; the row goes only when removed.
6. Remove (editable): the row goes, the count drops, snackbar "The document has been removed" + Undo (rule 14.12).
7. Empty: depends on whether Cooper's context is required to leave the stage. Required: coverage bar + Upload (the bar fills as documents are processed; 25% per usable document). Optional: Upload only. The counter appears with the first document and the list replaces the empty state; at 100% coverage the empty state gives way to the normal state.
8. Editable up to publication; read-only once Active, Scheduled or Archived: no Upload, drop or ⋯ (rule 9.10); rows keep Download; search and counter still work; the list never disappears. To change documents, create a new version.
9. Long names truncate in the middle, never wrap; rows keep one height; the date never truncates; the tooltip anchors to the row.

### Pattern: Widget builder

**For:** a page of widgets people arrange: add from a catalog, reorder by drag, resize on a 3-column grid, remove. A dashboard (widgets on the page, one grid) or a report (blocks inside sections, one grid per section); same widgets and rules. Editing only while the page is in Draft.
**Parts:** `AppShell` + `NavBar` + `SideNav` + `PageHeader` + `BottomSheet type="documents"` (optional `Panel`) · page intro with a secondary "Widgets" button · `StatCardsRow` (the metrics block) · `WidgetBoard` (grid engine) of `WidgetFrame`s (title, Cooper button; hover ⋮⋮, "Edit with Cooper", ⋮ menu) with kit charts inside (`bare`) · drag feedback: ghost (`WidgetFrame state="ghost"`, or `WidgetCard state="drag"` from the drawer), source at 30%, `DropIndicator`, then `DropZone` "+ Drop here to place", `Tooltip` for a blocked drop · resize: `ResizeHandle`, `Tooltip` · `WidgetsDrawer` (`Drawer` + search + `WidgetCard`s with `PreviewWidgetCard`) · `toast` + Undo.
**Rules:**
1. A section is a 3-column grid with a page gap (rule 3.14); widths only 1/3, 1/2, 2/3 or 3/3. A row holds 1–3 widgets, never spans sections, never leaves an empty column (the last widget fills the rest), and its widgets share the tallest height (height is never resized by hand).
2. Auto widths: 1 → 3/3; 2 → 1/2 + 1/2; 3 → 1/3 each; chart + text → 2/3 + 1/3; chart + chart → 1/2 + 1/2, locked. A row of 2 may be 1/2 + 1/2, 1/3 + 2/3 or 2/3 + 1/3. Manual widths last until the count or order changes or the divider is double-clicked (→ Auto). Width is saved with the edition, the same for everyone.
3. Limits: metrics block (1–3 stat cards of equal width) 3/3 only, no handle, not draggable; text 1/3–3/3; chart min 1/2, resizable only next to a text widget; wide chart or table 3/3 (proposed in Figma).
4. Add: Widgets → drawer (`push`) → "+ Add" places the widget and removes its card, toast `"<name>" widget added` + Undo; or drag the card in (the drawer steps aside). The drawer search filters by description; no match → empty state.
5. Move: hover → ⋮⋮ (only ⋮⋮ starts a drag, after ~4px; a click doesn't) → ghost follows, source fades → indicator line (vertical in a row = insert, horizontal between rows = new row; nothing moves) → resting ~300ms or hovering the line opens the zone at final size and the row reflows to Auto (a new-row zone is full width at the dragged widget's height; a taller widget grows the row; moving away collapses it) → release. Ghost and zone always show together. Toast `"<name>" widget moved` / "Block moved" + Undo. Report blocks can move between sections.
6. Blocked drops (no line, no slot, tooltip): full row ("Row is full — max 3 widgets", "Row is full — max 2 widgets with a chart"), the min doesn't fit, or next to metrics ("Metrics take the whole row"); then only the lines above and below are targets. On release source and target rows go Auto; an empty row disappears; ~200ms animation.
7. Resize: a handle on edge hover only (8 hit zone each side), never in the ~40 header zone; the hovered widget keeps its Hover actions, and resizing switches it to Drag state and hides them; arrows show only possible directions (none → no handle, default cursor); a divider is shared (the start widget's width, the other takes the rest); no handle on the first widget's start edge; the section's end edge only shrinks; chart rows have no edge handles. Past a limit: "Maximum / Minimum width reached" in a tooltip above the handle, without cancelling. Release snaps to the nearest step (under half a step → back). Double-click the divider → Auto. Also ⋮ → Resize → S (1/3) / M (2/3) / L (3/3) with the same limits.
8. Widening pushes neighbours that no longer fit to the next row (or a new row); shrinking pulls the next widget up if its min fits, otherwise (last in the section, or the next is a chart) the widget can't shrink; charts never move rows by a resize.
9. Remove: ⋮ → Remove, the row reflows, toast `"<name>" widget removed` + Undo (toasts: rule 14.12). Esc or releasing outside a target cancels (ghost flies back, no toast); Esc during a resize restores widths.

### Pattern: Collaboration

**For:** the owner of a record invites people, sets access (Editor or Viewer), edits the Cooper brief they receive, reminds people who haven't accepted, and removes people. Entry is always the collaborators indicator in the page header; not a page or a drawer.
**Parts:** `CollaboratorsButton` (Tertiary S, `users-group`, "joined/invited") next to `CommentButton` · `CollaboratorsPanel` (`Popover` 320 "Collaborators" + `Search` "Invite by name or role…" + `RoleFilter` (`IconButton` Secondary M + a multi-select list with `Checkbox`) + `CollaboratorSection`s of `CollaboratorRow`s: `Avatar` M (awaiting = dashed; online = green dot), name + job role, then one control: `Badge` Owner, `RoleSelect` (Editor / Viewer / Remove), ghost "+", or on awaiting rows the reminder bell / disabled "Notified") · `InviteCollaboratorModal`, `RemoveCollaboratorModal` · `toast` · `CollaboratorCursor`, `LiveCursors` · `useCollaboration`, `CollaboratorsMenu` (drop into `PageHeader` actions).
**Rules:**
1. One owner per record, not transferable; the owner grants Editor or Viewer only.
2. The panel is never empty (the owner is always listed first, "(you)"). Sections: In project, Awaiting, Suggested by Cooper; empty sections hide.
3. The indicator counts invited collaborators, not approvers or reviewers: "joined / invited", both including the owner (1/1 alone).
4. Search: empty focus shows Suggested by Cooper + Recently; typing matches name or job role; only people not yet on the record; no match shows suggestion chips of people who can be invited. The role filter narrows to roles; clearing every role returns to All.
5. Invite: "+" → Add Collaborator dialog (access defaults to Editor; Cooper's brief pre-filled and editable) → Send invitation → under Awaiting, invited count +1. Clicking a collaborator opens the same dialog to edit ("Edit Collaborator"; the title is the screen's text, `title` prop); Save is always on (rule 14.4): with no change it just closes the dialog.
6. Remove: role select → Remove → "Remove this collaborator?" (revokes the invite) → gone, count −1. Always confirmed.
7. Push: an awaiting row shows the bell 24h after the last notification (sending the invite counts). Push sends an in-app notification and email (both deep-link to the invitation's Accept / Decline), attributed to the owner, reusing the invite and brief (no new invite, no count change); toast "Reminder sent. You can push again in 24h."; the row then shows a disabled "Notified". At most 1 per invitee per 24h.
8. Auto-reminders: system-sent after N days (§15 Open), impersonal, repeat at intervals then stop; manual and auto reminders are never merged. All reminders stop (queued ones are cancelled) when the invitee accepts or declines, is removed or replaced, or the record is archived; every reminder is logged in Activity ("A. Singh resent the invitation to …"); notification preferences apply (email off → in-app only).
9. Collaboration events reach Command as notifications and cards that open the record at the anchor.
10. Live cursors show only other online, joined people, in their avatar's colour (rule 10.1); nobody sees their own.

### Pattern: Comments

**For:** threaded comments anchored to elements of a canvas (framework map): pins, a thread callout opened in place, and a Comments drawer listing every thread. Not for Cooper chat or activity history.
**Parts:** `CommentPin`, `CommentDrawerCard`, `CommentThread`, `Comment`, `CommentComposer`, `Drawer`, `SegmentedControl`, `SmartSearch`, `EmptyState`, `Menu`, `Badge`, `NodeCard`, `NodeHoverActions` · helpers: `CommentsPanel` (drawer list, filter, search, empty states), `CommentCallout` (thread + ⋯ + @-mention picker + resolved look), `CommentMentionMenu`, `useCommentThreads`, `searchComments`.
**Rules:**
1. Comments mode: the header comment button or C opens the drawer; comment cursor over the canvas, default cursor over the drawer. The mode stays on after sending; closing the drawer (✕) turns it off.
2. Place: click the canvas → composer at the click, anchored to the nearest node → Enter sends (new pin, new row on top with a blue dot); Esc cancels.
3. Collapsed nodes show one roll-up pin (Inactive avatar with the thread count); expanding (node hover action, or clicking the roll-up pin) zooms to the node and shows each thread's author pin; collapsing returns.
4. Hover a pin: preview only (author, time, 3 lines, replies). Click a pin or row: the canvas scrolls to the anchor, the callout opens there, the row is Selected, unread cleared. One callout at a time; Esc or ✕ closes it.
5. Blue dot = unread; opening marks it read (it can stay unresolved). The comment button shows a dot while any unresolved thread is unread.
6. Drawer rows never expand and show only the first comment, truncated.
7. Reply in the callout (voice input works in the composer); `@` opens the people picker (↑/↓, Enter or Tab picks); posted mentions show as a Badge with the mention icon. Your own reply: ⋯ → Edit (field with Cancel + Send, no mention button) / Delete (confirm, then "Comment deleted" + Undo).
8. Resolve: ✓ in the callout header or on row hover (tooltip "Resolve"); the next unresolved thread opens. Resolved threads: callout header ⋯ (Unresolve, Copy link) + ✕, Inactive avatars, text not dimmed, composer kept; drawer card Type=Resolved (no dot, no chip, ⋯ on hover); pins Read style.
9. Types are Action required, Question, Info; only Action required shows a chip; resolved threads show none. The type still drives filters and counts.
10. Search ("Ask anything about comments") filters the current tab (author, status, type, time, element, text); it doesn't answer in chat. Copy link → "✓ Copied" for 2s.
11. Empty: all resolved → "All comments have been resolved / Ready to proceed to review."; no match → "No results found" + suggestion chip; none resolved → "No resolved comments".

### Pattern: Approval chain

**For:** the Approve stage of a framework or investment (Input → Shape → Review → Approve). Reviewers see the impact and a readiness evaluation and approve or request more information; the owner follows each reviewer, nudges late ones, and publishes once all approve or sends back for review.
**Parts:** `PageHeader` (status `Indicator` xs: Draft / Shaping neutral, Pending approval warning, Revisions required danger, Ready to publish info, Active success; `SegmentedControl` S; `Stepper`; actions "3/5", comments, "Approval chain" (reviewer only), `SplitButton`) · main column: `StatCardsRow` (one `compare` card + three), `Tabs`, `InvestmentValueImpact`, `TableReview` · reviewer `Panel` "Readiness Evaluation" (`ReadinessEvaluation`, `ReadinessSection`, `ReadinessFacts`, `ProgressRing`, `ReadinessStatus`) · `ApprovalChainPanel` (forms and panel mode: rule 3.18) around `ApprovalChainTable` (on `Table`: `ApprovalStatus` rail, user cells, notes, filter, push) · `Modal` confirmations · `toast`.
**Rules:**
1. The readiness panel lists only the gates, checks and metrics that exist for this case.
2. Approve and Request more info always go through a confirm modal. Approve: "Approve this framework?" → toast "Framework approved" + Undo, the button becomes **Approved** (disabled), the row turns success; the Approval chain button stays. Request more info (caret menu) takes a note → status Revisions required, toast "Revision requested — sent back to {author}" + Undo, button **Info requested** (disabled) until the author sends it for approval again; the Approval chain button hides; the row turns rejected, the note becomes its comment and the author sees it in the activity log.
3. Full-screen chain collapses the Readiness sidebar; full screen adds Comment, Last notified and an action column once any row has data.
4. Publish stays disabled until every reviewer approves; then status Ready to publish → "Publish this framework?" → "Publish now" → Active, toast "…is now active", button **Published**. A reviewer's revision request shows their comment and a **Shape** action (back to Shaping); **Send for review** ("Send for review?" → "Send now") resets reviewers and the status to Pending approval.
5. A replaced reviewer shows old › new avatar with an ⓘ tooltip "This reviewer was replaced by another stakeholder."
6. Notes: approvers note their own row; the owner can note any row; only the author edits or deletes; click outside saves, Esc cancels. Compact chain clamps notes to 4 lines.
7. The Comment column shows exactly what the approver wrote at decision time and updates when they edit it; empty if nothing. Never invent text.
8. Push: only clock (awaiting) rows; manual push is attributed to the owner, has no threshold, 1 per reviewer per 24h; it stamps Last notified; the "Notified" tooltip shows a live countdown (hours rounded up, minutes under 1h). A reviewer pending for N days (§15 Open) is notified in-app (bell + toast) and by email; auto-reminders then every N days, 3 at most, impersonal. All stop when the reviewer acts, the version is withdrawn, the reviewer is replaced or the approval closes. Every push is logged in Activity; notification preferences apply.
9. User filter: only with more than 3 approvers; applies live; chips (All, Approved, Awaiting, Rejected, Revisions required) are multi-select and All resets them; search matches name or role (✕ clears it); chips and search combine; the counter = 1 per chip other than All + 1 for a non-empty query; Clear all resets both; no match keeps the filter open with "No results found"; outside click closes. Awaiting also matches not-acted rows.
10. **Several stages on one page** (Plan › Approve: Executive, Technical, Financial): one `ApprovalChainTable` with `stages`, not one table per stage. Each stage is a group row of the table (name, then status + done/total at the end; the column header under each open stage). A stage is open, folded or locked as the case needs: locked shows a lock and when it opens ("Opens when Executive is approved"); a fully approved stage folds. The kit writes each stage's status itself: Approved (all approved), Changes requested (anyone rejected or asked for revisions), else Under review; a stage's `collapsed` sets how it starts. Panel and timeline: rule 14.9.

### Pattern: Confidence, trace & readiness

**For:** three right-hand panels with the system's verdict on a framework. **System Confidence**: for the author on the work steps inside an entity (where, and open at the start: rule 3.18): readiness by gate + open questions and warnings. **Trace Report**: a reaction to a user change the system considers incorrect (errors, warnings, notes, one at a time). **Readiness Evaluation**: for a stakeholder reviewing someone else's framework (see Approval chain).
**Parts:** `useIssueReport({ issues, kinds, gates, onResolvedAll })` with `CONFIDENCE_KINDS` (Open questions, Warnings) or `TRACE_KINDS` (Errors, Warnings, Notes) · `SystemConfidence` = `Panel` + `ContentCard` with `ConfidenceGates` (`ProgressRing`, a `ReadinessStatus` per gate with XS `Indicator`s and tooltips), `IssueKindSwitch` (`SegmentedControl` S with counters), `IssueNavigator` · `TraceReport` `type="drawer"` (floating over the canvas, collapse only) or `type="sidebar"` (`Panel`), footer Undo (Tertiary L) · `IssueNavigator`: `Pager progress="resolved"`, issue title (H3) and description, then solutions (`IssueSolution`), Upload file / My answer (`IssueAnswerField`), a single Okay, or the Applied / Answered card; "All" lists `IssueListItem`s · collapsed rail `Panel expanded={false}` with `dot`.
**Rules:**
1. Danger (red) = open questions or errors; warning (orange) = warnings. The rail dot follows (none when all is OK). The Approval readiness total matches the segmented counters.
2. A kind with no items hides from the segmented control; Trace Report hides the control once one kind is left.
3. ‹ › walk the list (disabled at the ends); All shows the numbered list. "1 / 2" is a position and resets when the list or filter changes; "(n% resolved)" is progress across the list and doesn't.
4. Resolving: pick a solution ("Applied"), save My answer or upload a file (a skeleton row, then "Answered"), or press Okay. Warnings and notes count as "viewed"; questions and errors as "resolved". A resolved item gets a check; its gate turns Passed when all its items are resolved; the readiness % and the "resolved/total" indicators update. Undo on an Applied / Answered card (on hover) reopens it.
5. The card layout is chosen by the system: solutions with or without a description; Upload, My answer and Okay only when needed (rule 9.10). The recommended solution is Cooper's pick: Cooper insight icon, gradient title, cooper-base fill.
6. Collapse: System Confidence and the sidebar Trace Report collapse to the rail; the drawer Trace Report to its header only. Trace Report can't be closed or its items dismissed, only collapsed; it closes by itself when everything is resolved; footer Undo reverts the change. Same cards and buttons as System Confidence; sidebar or floating drawer by screen.
7. At 100% every gate is Passed and Send for approval enables.
8. Readiness Evaluation is built from the case's data (no fixed template; reviewer notes are `SourceCard type="user"`, the header a `SplitButton` Approve ▾ → Request more info): approved view "Ready to Approve", blocked view (e.g. 40%, "Budget Envelope Exceeded", a red gate and an extra section); sections expand one at a time; Request more info sets Revision required.
9. Don't use System Confidence for a reviewer (→ Readiness Evaluation) or Trace Report for a standing audit.

### Pattern: Evidence chain

**For:** Cooper's glass box: the sources and reasoning behind one value Cooper filled in, and how sure Cooper is. On every field, block or card Cooper wrote; not for human content or as a document viewer.
**Parts:** `EvidenceButton` (circle Tertiary S, `cooper-evidence-icon`, 16; in a card header via `DataVizCard header.slot` or `ContentCard iconButton`; on a panel `Panel showEvidence onEvidence`) · `EvidenceChainDrawer` (`over`; title "Evidence chain", ✕ only): `EvidenceStrength` (captions `<70% Reject` · `{value}% Review` · `>90% Approve`), `SegmentedControl` S full width Rationale | Peer benchmark, `EvidenceSection`s of `SourceCard`s, `PeerBenchmark` (description, summary rows, "Typical scope" with `LegendSwatch` + `VerticalBarChartItem`; `EmptyState` when there's too little data) · `SourceCard` (`type="file"` a Tertiary S button with the source name that opens the source, icon optional; `type="user"` avatar + name, for a person's input; `content="quote"` excerpt with a start rule, `content="text"` paragraph; optional info `Badge`) · `evidenceZone(value)`.
**Rules:**
1. The trigger shows wherever Cooper-written content exists, at every confidence level (never hidden because confidence is high).
2. From a card: the drawer floats over the content area top-end, one `--float-inset` (the page margin, rule 3.18) in from the page header, the end edge and the bottom sheet; the screen places it (`Drawer floating` uses the same inset). Another card's button switches the chain; the same button, ✕ or Esc closes it and focus returns. From System confidence: it opens in the panel's place, below the nav bar, over the page header, ending one `--float-inset` above the bottom sheet. One chain at a time; its trigger shows as expanded.
3. Confidence zones set what Cooper does: under 70% Reject (Cooper doesn't apply; a reviewer decides), 70–90% Review (Cooper fills in and waits for a person), over 90% Approve (applied automatically; the chain stays available). Exactly 90 is Review; Approve starts above 90 (2.0.4). Every value carries its own confidence.
4. The drawer layout is the same in every zone: only the marker and the behaviour change.
5. Rationale is never empty: Why it's flagged → Decisions → Considered but not included; sections separated by a 1px top rule, each with `--space-inset` above its content and `--space-stack` between its parts and a Label/M/medium title; cards 8 apart.
6. Peer benchmark compares records of the same type, age band and duty. It is the only tab that can be empty: "Peer benchmark isn't available", no action; the tab stays rendered and selectable. The tab choice persists while the drawer is open.
7. Never a modal with a scrim.

### Pattern: Activity & versions

**For:** a record's history: the activity log, saved versions, the approval chain, and comparing two versions or benchmarks. `ActivityPanel` wherever a record offers "Activity"; `CompareView` for a framework's Compare view.
**Parts:** `ActivityPanel` (`over` panel, 380, "Activity", ✕): `SegmentedControl` S Version History | Approval Chain, `SmartSearch` with suggested questions, `VersionHistory` (version cards on the timeline base: title, "Current" `Badge`, description, last-activity author `Avatar` XS and time, ⋯ `Menu`; expanded: nested `Timeline` of entries with type `Badge` Comment / Action / Auto-action, Cooper `Avatar type="cooper"`), `ApprovalChain` (display only), `EmptyState`, `Modal`, `toast` · `CompareView`: `CompareHeader` + `CompareDropdown` (`CompareDropdownList`), four `StatCard`s with `compare`, `Sankey` with current and baseline sources.
**Rules:**
1. Open from a library row ⋯ › Activity, or the entity header's title menu ▾ (after the ID; rule 12.1).
2. The segmented control exists only when both views have content. A record with no approval process (e.g. a study) opens on Version history with no control (`approvals={undefined}`). A record with a process but no chain yet keeps it and shows "No approval chain yet / Approvers appear here after you send this framework for approval".
3. Search filters the panel (author, date, status, what changed: "What did A. Singh do?", "Show comments only", "What did Cooper change automatically?"; also version names, descriptions, authors, dates and log text); matching versions expand to the matching entries. It never answers in a chat bubble. No match: "No results found" + chips; ✕ clears.
4. Versions: collapsed, newest first; ⋯ on hover; the caret opens the version's full log (the author row hides). Each card shows the last person who changed that version. Click a card or name to open that version read-only.
5. ⋯ Compare: the current version is the baseline for any other version; the current version compares with the previous one.
6. ⋯ Duplicate creates a new framework in Draft from that version and opens it in the map with the stepper at Input/Shape (a new framework, not a version).
7. ⋯ Rename changes only the version label (the framework keeps its name): the title becomes an input with ✕ and ✓ (Enter applies, Esc or ✕ cancels and keeps the original name); a name already used by another of the record's versions turns it red, disables ✓ and shows the message in its tooltip; success shows a toast + Undo (rule 14.12).
8. ⋯ Restore (not on the current version): "Restore this version?" → a new draft from that version, which must go through approval; history is unchanged, never an in-place rollback.
9. Approval chain rows are display-only (no hover, no pointer); the search filters them ("Who hasn't responded yet?").
10. Compare: pick a baseline (Top benchmarks, Versions, All frameworks); the stat cards and Sankey update; ✕ clears it (current values only, one Sankey source).
11. Push reminders follow the Approval chain pattern rule 8.
