# Layout — Catalyst Design System 2.0.3

Tokens: `src/foundations/layout.css`. Spacing roles: `guide/spacing.md`.

## 1. Breakpoints and grid (by screen width, never density)
| Name | Width | Columns | Page margin | Gutter |
|---|---|---|---|---|
| xs | < 600 | 4 | 16 | 16 |
| sm | 600–1023 | 8 | 24 | 16 |
| md | 1024–1439 | 12 | 24 | 16 |
| lg | 1440–1919 | 12 | 24 | 20 |
| xl | 1920+ | 12 | 32 | 32 |

Content is capped at 1600 and centred. The grid is measured in the content area (beside the side nav and any docked push panel). An overlay panel never changes the grid.

## 2. What snaps to the columns
Cards and page regions: `.ifs-grid` with `.ifs-span-N` children (`.ifs-span-panel` / `.ifs-span-rest` for a side column that is part of the page: 3 columns, 4 below 1440). Below 1024 quarters become halves and wider spans go full width; below 600 everything is full width. Content inside a card (table columns, metric rows) follows the card, not the grid.

## 3. Panels: fixed sizes (hybrid)
| | Width |
|---|---|
| Side panel / drawer | 380 (`--region-panel`, min 320, max 50%) |
| Large panel | 600 (`--region-panel-l`) |
| Modal | 440 / 600 (`--overlay-width-m` / `-l`), centred |
| Popover | 320 (`--overlay-width-s`), 4px from its trigger |

Docked panels sit flush against the content-area edge; the page beside them keeps its margin and reflows onto its own columns.

## 4. Map slots
On a map or canvas, floating panels are placed in slots, never pinned (`.ifs-slots` on the map container). Agreed Nov 19 (2.0.3) from the Explore audit and GIS research: one panel per side, details replace (never stack), panels fold to their rail, the timeline sits at the bottom only when time matters.

| Slot | Holds (one at a time) | Size |
|---|---|---|
| `.ifs-slot-left` (start) | Hierarchy · Study library · Search results · Study | `--region-panel` (380); Study `--region-panel-l` (600, add `.has-left-l`) |
| `.ifs-slot-right` (end) | Asset / group details · Trace report · Evidence chain · Cooper window. A new one replaces the open one, with Back (details → evidence → back to details) | `--region-panel` (380) |
| `.ifs-slot-top` | Selected bar, or the draw bar while drawing. Centred on the whole map. An open panel only nudges it aside, keeping a page gap from the panel; it is never re-centred in the space that's left. When it can't fit between the panels at all, it lines up with the start panel's edge and sits above it, and the start panel moves down (`.has-top-x`, `.has-top-start`, Nov 19) | content, at most `--region-map-bar` (746) |
| `.ifs-slot-bottom` | Horizon bar (`.ifs-slot-fill`), only when a study is open or a time layer is on. Snackbars stack above it, never on it | `--region-map-bar` (746), never wider than the gap |
| `.ifs-slot-popover` | Layers / map display popover, beside the tool bar; closes on outside click or Esc | `--overlay-width-s` (320) |
| `.ifs-slot-fab` | Cooper button, end-bottom corner | `--size-48` |
| `.ifs-slot-exit` | "Exit map preview" when you arrive from Build (add `.has-exit`: every slot moves down one control row) | — |

- State on `.ifs-slots`: `.has-left` (+ `.has-left-l`), `.has-right`, `.has-exit`. The top bar follows the rule in the table above. It clears the end panel even when that panel overlays the map (below 1100). The bottom bar (horizon) is centred in the gap between the panels (bottom-bar rule: open question, Nov 19).
- **Edges:** every slot sits one inset (`--slot-inset` = the page margin) from the map's edges; tops, bottoms and the end edge line up; neighbours sit a page gap apart.
- **No map minimum** (Nov 19): panels never fold because the map is small. Study still folds when a right panel opens (below); below 1100 / 720 the overlay and sheet rules apply.
- **Study and a right panel:** Study folds to its rail when a right panel opens and comes back when it closes; clicking Study hides the right panel. The Cooper chat counts as a right panel too: while the user works with Cooper (custom lens, create idea), Study stays folded (Nov 19, no exception).
- **Lists and details** stay open together. Clearing the selection closes the selected bar and the details panel.
- **No legend on the map:** counts go in the selected bar, the key in the Layers popover. (`.ifs-slot-legend` stays for other canvases.)
- **Camera padding:** when a panel opens or the map flies to a target, centre the target in the visible gap.
- **Narrow:** below 1100 (`--bp-map-overlay`) the end panel sits over the map and closes on outside click / Esc; below 720 (`--bp-map-sheet`) panels become a bottom sheet.
- A floating bar in a slot slides in vertically only, so it lands on the shared top edge.

## 5. AppShell: panel mode by job (decided Nov 19, 2.0.3)
Benchmark: Fluent 2 (inline vs overlay drawer by task), Carbon for IBM Products (SidePanel slideIn per panel), Workday, Visa, Material 3 (standard vs modal; modal only for lack of room).

| Mode | When | Kit panels (default) |
|---|---|---|
| `push` | The user works with the panel and the whole page together; the content shrinks and reflows onto its own columns | Panel, readiness evaluation, Cooper chat (ChatFullPanel), CommentsPanel, WidgetsDrawer, ApprovalChainPanel, TraceReport |
| `over` | The panel is the focus and the page is context (the names on the left stay visible). No scrim; the page stays usable | RecordPreview (row / record preview), EvidenceChainDrawer, ActivityPanel |

- One mode per panel, set by its job (`Component.panelMode`); a screen overrides it only with `AppShell panelMode`. No third mode.
- `over` panels close on an outside click or Esc (`onPanelClose`); clicking another row closes and reopens, so the preview swaps.
- Below md (1024) a `push` panel has no room: it becomes a rail and expands over the content; outside click / Esc fold it back.
- Side nav below md, **and when a pushed panel would leave the page area under 800px** (`--layout-content-min`; Nov 19, fold by available space as Atlassian, Carbon and Material do): a rail that expands over the content; outside click / Esc fold it back. With the 240 side nav and a 380 panel this happens below 1440 (1440 keeps the nav open).
- **Grid convention (Nov 19):** the page grid follows the content area (container `content`). A push panel (docked, sliding) shrinks the content area, so the columns step down like on a smaller screen (12 → 8 → 4). An `over` panel or overlay (Cooper floating chat, record preview, popover, modal) sits on top of the page and never changes the grid.

## 6. Direction: start and end, never left and right (rule from Nov 19, 2026)
The kit is being prepared for right-to-left languages (Arabic market). In RTL the layout mirrors: the side nav moves to the right, back arrows point right, text starts on the right; numbers, logos, media controls and chart time axes do not mirror.
- **All new and changed code** uses logical properties: `margin-inline-start/end`, `padding-inline-*`, `inset-inline-start/end`, `border-inline-*`, `text-align:start/end`; in JSX `marginInlineStart`, `insetInlineEnd`, …
- Geometry that must not mirror (chart time axes, canvas coordinates) keeps physical values with a `/* ltr: reason */` comment.
- Directional icons (arrows, chevrons, back) will flip in RTL; check marks, media, clocks, trends and logos never flip.
- Progress: `node tools/check-direction.mjs` (171 physical declarations left on Nov 19). The conversion runs gradually (first pass scheduled Fri Nov 20 after 5 pm).

## 7. Narrow and 400% zoom rules (Nov 19, 2.0.3)
- **Tables** keep their columns: flexible columns never go below `--table-col-short-min` (120); when the card is narrower than the columns need, the table scrolls sideways inside its card (allowed 2D scroll for data, WCAG 1.4.10).
- **Bottom sheet**: below 720 wide the prompts hide; the Cooper button stays.
