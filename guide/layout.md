# Layout — Catalyst Design System 2.0.1

Tokens: `src/foundations/layout.css`. Spacing roles: `guide/spacing.md`.

## 1. Breakpoints and grid (by screen width, never density)
| Name | Width | Columns | Page margin | Gutter |
|---|---|---|---|---|
| xs | < 600 | 4 | 16 | 16 |
| sm | 600–1023 | 8 | 24 | 16 |
| md | 1024–1439 | 12 | 24 | 16 |
| lg | 1440–1919 | 12 | 24 | 20 |
| xl | 1920+ | 12 | 32 | 32 |

Content is capped at 1600 and centred. The grid is measured in the content area (beside the side nav and any docked panel).

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
On a map or canvas, floating panels are placed in slots, never pinned (`.ifs-slots` on the map container, `.has-left` / `.has-right` when filled):
- Tools: left corner. Left slot: the large panel, next to the tools. Right slot: the side panel.
- Top and bottom slots: centre their content in the space between the left and right slots.
- Every slot sits the page margin from the map edge and the page gap from its neighbours, so nothing overlaps or needs dragging.
- Below 1024: the left slot becomes a bottom sheet; the right slot overlays the map.

- **Edges (Nov 19):** every slot sits one inset (`--slot-inset` = the page margin: 16 / 24 / 32 by screen width) from the map's edges. All top edges line up (map tools, large panel, top bar, side panel), all bottom edges line up, and the side panel lines up with the right edge.
- **Corners:** map tools sit in the left corners (`.ifs-slot-tools`, `.ifs-slot-tools-bottom`); the map legend sits in the bottom-right corner (`.ifs-slot-legend`, 210 wide). With `.has-legend` the bottom slot centres between the bottom tools and the legend, a page gap from each.
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
- The page grid follows the content area (container `content`): a pushed panel narrows the columns like a smaller screen.

## 6. Direction: start and end, never left and right (rule from Nov 19, 2026)
The kit is being prepared for right-to-left languages (Arabic market). In RTL the layout mirrors: the side nav moves to the right, back arrows point right, text starts on the right; numbers, logos, media controls and chart time axes do not mirror.
- **All new and changed code** uses logical properties: `margin-inline-start/end`, `padding-inline-*`, `inset-inline-start/end`, `border-inline-*`, `text-align:start/end`; in JSX `marginInlineStart`, `insetInlineEnd`, …
- Geometry that must not mirror (chart time axes, canvas coordinates) keeps physical values with a `/* ltr: reason */` comment.
- Directional icons (arrows, chevrons, back) will flip in RTL; check marks, media, clocks, trends and logos never flip.
- Progress: `node tools/check-direction.mjs` (171 physical declarations left on Nov 19). The conversion runs gradually (first pass scheduled Fri Nov 20 after 5 pm).

## 7. Narrow and 400% zoom rules (Nov 19, 2.0.3)
- **Tables** keep their columns: flexible columns never go below `--table-col-short-min` (120); when the card is narrower than the columns need, the table scrolls sideways inside its card (allowed 2D scroll for data, WCAG 1.4.10).
- **Bottom sheet**: below 720 wide the prompts hide; the Cooper button stays.
