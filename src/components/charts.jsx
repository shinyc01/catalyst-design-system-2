import React from 'react';
import { IFS } from './registry.js';
// Figma: Data Visualisation page (3487:19894) — data-viz Base atoms + the generic "core chart types".
// Rules (2.0.6, data viz round D1–D9, Nov 24; guide/rules.md 7.18): charts are built from the Base atoms; bars are zero-based; one measure
// = one colour (categorical slot 1); series take the categorical slots in order (up to 8, 9–12 only with direct labels, then "Other");
// every chart backs its picture with exact values (hover/focus tooltip + the Chart / Table switch + a screen-reader table).

/* ------------------------------------------------------------------ helpers */

// Chart geometry the SVG needs as numbers (rule 1.3: chart geometry stays px).
const R_MARK = 2;        // = --radius-mark: the end of a bar away from the baseline (D8)
const GAP_MARK = 1;      // = --border-width-default: the one card-colour gap between the parts of every chart (stack segments, grouped bars, heatmap cells, funnel stages, gauge segments; slices use a 1 px stroke) (D8; 1 px, review Nov 25)
const TIP_GAP = 8;       // tooltip beside the mark, the same 8 px on either side (D5)
const LABEL_MIN = 24;    // value-axis labels closer than this thin out; gridlines stay (D3)
const HIT_R = 12;        // chart points get at least a 24 px hit area (G8, WCAG 2.5.8)
const SERIES_MAX = 8;    // series per chart by default (D6)
const SERIES_MAX_LABELLED = 12; // with direct labels (D6)
const GROUPED_MAX = 4;   // grouped columns (D8)

const SLOTS = 12;
const slotVar = n => `var(--color-data-viz-categorical-${n})`;
const OTHER = 'var(--color-data-viz-other)';
const WHITE = 'var(--color-data-viz-reference)'; // peer-median / reference marks
// Before 2.0.6 charts took a colour group name; those names still work (deprecated: each old step is an alias of the nearest new role).
const DV_GROUPS = ['muted-purple', 'teal', 'rose', 'steel-blue', 'deep-green', 'violet', 'cyan', 'alert'];
const DV_STEP = 3;
const dvVar = (group, step = DV_STEP) => `var(--color-data-viz-${group}-data-${step})`;
// Charts use data-viz colours only. color = a categorical slot (1–12), 'other', 'neutral' | 'reference' | 'target' | 'band', a data-viz token
// ('var(--color-data-viz-sequential-3)'), an old group name (deprecated), or undefined (= slot i + 1). Anything else is ignored (console
// warning) and the slot is used, so a chart never draws a colour outside the data-viz palette.
const DV_SPECIAL = { other: OTHER, neutral: 'var(--color-data-viz-neutral)', reference: 'var(--color-data-viz-reference)', target: 'var(--color-data-viz-target)', band: 'var(--color-data-viz-band)' };
const dvWarned = new Set();
function dvColor(color, i = 0, step = DV_STEP) {
  if (color == null || color === '') return slotVar((i % SLOTS) + 1);
  if (typeof color === 'number' || /^\d+$/.test(String(color))) return slotVar(((Number(color) - 1) % SLOTS + SLOTS) % SLOTS + 1);
  if (DV_SPECIAL[color]) return DV_SPECIAL[color];
  if (typeof color === 'string' && /^var\(--(color-)?data-viz-[a-z0-9-]+\)$/.test(color.trim())) return color.trim();
  if (DV_GROUPS.includes(color)) return dvVar(color, step);
  if (!dvWarned.has(color)) {
    dvWarned.add(color);
    if (typeof console !== 'undefined') console.warn(`IFS charts: "${color}" is not a data-viz colour; using the palette instead.`);
  }
  return slotVar((i % SLOTS) + 1);
}

// Series past the limit fold into one "Other" series (grey) that sums them, so totals stay true (D6).
function foldSeries(series, max) {
  if (series.length <= max) return series;
  const keep = series.slice(0, max - 1), rest = series.slice(max - 1);
  return [...keep, { key: '__other', label: 'Other', color: 'other', members: rest.map(s => s.key) }];
}
// Lines keep their own values: series past the limit draw in the "Other" grey and share one legend entry (a sum would flatten the scale).
function greyLines(series, max) {
  if (series.length <= max) return series;
  return series.map((s, i) => (i < max - 1 ? s : { ...s, color: 'other', group: '__other' }));
}
const valOf = (d, s) => (s.members ? s.members.reduce((t, k) => t + (Number(d[k]) || 0), 0) : d[s.key]);
const colorOf = (s, i) => dvColor(s.color, i);

// Full under 10,000, then compact (19.4K, 3.04M) with a true minus sign; '—' for no value. Same rules as IFS.format.number.
const defaultFormat = v => IFS.format.number(v, { compact: 'auto' });
const signed = (v, f) => (v > 0 ? '+' : v < 0 ? '−' : '') + f(Math.abs(v));

const NICE = [1, 2, 2.5, 5, 10];
function niceStep(range, count) {
  const raw = range / count;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return (NICE.find(n => m <= n) || 10) * p;
}
const nextNice = step => { const p = Math.pow(10, Math.floor(Math.log10(step) + 1e-9)), m = Math.round((step / p) * 10) / 10; const n = NICE.find(x => x > m + 1e-9); return (n || 20) * p; };
// D3: exactly `intervals` evenly spaced "nice" intervals covering [lo, hi] (default 4 = 5 labels; Cooper may ask for 2–8).
function scaleTicks(lo, hi, intervals = 4) {
  const n = Math.max(2, Math.min(8, Math.round(intervals) || 4));
  if (!(hi > lo)) hi = lo + 1;
  let step = niceStep(hi - lo, n);
  for (let k = 0; k < 24; k++) {
    const a = Math.floor(lo / step + 1e-9) * step;
    if (a + n * step >= hi - step * 1e-9) return Array.from({ length: n + 1 }, (_, i) => +(a + i * step).toFixed(10));
    step = nextNice(step);
  }
  return [lo, hi];
}
const finite = a => a.filter(v => typeof v === 'number' && Number.isFinite(v));
const sameIdx = (a, b) => (Array.isArray(a) && Array.isArray(b) ? a[0] === b[0] && a[1] === b[1] : a === b);

function useControlled(value, defaultValue, onChange) {
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== undefined ? value : inner;
  const set = v => { if (value === undefined) setInner(v); onChange && onChange(v); };
  return [cur, set];
}

// Text width in the axis font (Body/S, follows density), for gutters and label thinning.
let measureCtx = null;
const measurers = new Map();
function measurer(font) {
  if (!font || typeof document === 'undefined') return s => String(s).length * 7;
  if (measurers.has(font)) return measurers.get(font);
  measureCtx = measureCtx || document.createElement('canvas').getContext('2d');
  const f = s => { measureCtx.font = font; return measureCtx.measureText(String(s)).width; };
  measurers.set(font, f);
  return f;
}

// Size of the plot box: charts fill the space the card leaves them (D2). fixedH = the `height` escape hatch.
function useBox(fixedH) {
  const ref = React.useRef(null);
  const [box, setBox] = React.useState({ w: 480, h: fixedH || 180, font: '', px: 12 });
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const read = () => {
      const probe = el.querySelector('.ifs-chart__probe');
      const cs = probe && getComputedStyle(probe);
      const font = cs ? `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}` : '';
      const px = cs ? parseFloat(cs.fontSize) || 12 : 12;
      setBox(b => {
        const w = el.clientWidth || b.w, h = fixedH || el.clientHeight || b.h;
        return w === b.w && h === b.h && font === b.font ? b : { w, h, font, px };
      });
    };
    read();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fixedH]);
  return [ref, box];
}

let dvUid = 0;
const useUid = p => { const r = React.useRef(null); if (r.current == null) r.current = `${p}-${++dvUid}`; return r.current; };

// Bar with the corner radius on the end away from the baseline only (D8): end = top | bottom | right | left | none.
// The baseline end stays square so the value reads true; bars shorter than 2 × the radius draw square.
function barPath(x, y, w, h, end = 'top', r = R_MARK) {
  if (h <= 0 || w <= 0) return '';
  const len = end === 'left' || end === 'right' ? w : h;
  if (end === 'none' || len < 2 * r) return `M${x},${y}h${w}v${h}h${-w}Z`;
  r = Math.min(r, (end === 'left' || end === 'right' ? h : w) / 2);
  if (end === 'top') return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  if (end === 'bottom') return `M${x},${y}H${x + w}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x + r}Q${x},${y + h} ${x},${y + h - r}Z`;
  if (end === 'right') return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
  return `M${x + w},${y}H${x + r}Q${x},${y} ${x},${y + r}V${y + h - r}Q${x},${y + h} ${x + r},${y + h}H${x + w}Z`;
}
function arcPath(cx, cy, r0, r1, a0, a1) { // angles in radians, 0 = 12 o'clock, clockwise
  const pt = (r, a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const large = a1 - a0 > Math.PI ? 1 : 0;
  if (a1 - a0 >= Math.PI * 2 - 1e-6) a1 = a0 + Math.PI * 2 - 1e-4;
  const [x0, y0] = pt(r1, a0), [x1, y1] = pt(r1, a1);
  if (r0 <= 0) { return `M${cx},${cy}L${x0},${y0}A${r1},${r1} 0 ${large} 1 ${x1},${y1}Z`; }
  const [x2, y2] = pt(r0, a1), [x3, y3] = pt(r0, a0);
  return `M${x0},${y0}A${r1},${r1} 0 ${large} 1 ${x1},${y1}L${x2},${y2}A${r0},${r0} 0 ${large} 0 ${x3},${y3}Z`;
}

/* ------------------------------------------------------------------ atoms */

// Figma: bar-atom (4457:32996)
// Props: state default|hover|out-of-focus|background|loading, color = categorical slot (default 1) or a data-viz token (old group names
// with step still work), children = the value label (show-value; absent = hidden). Fills its parent. Hover keeps the full colour;
// out-of-focus is darkened (never transparent, D5).
function DataVizBar({ state = 'default', color = 1, step = 4, children, className, style, ...rest }) {
  return (
    <div data-state={state === 'hover' ? 'hover' : undefined} className={IFS.cx('ifs-dv-bar', `ifs-dv-bar--${state}`, state === 'loading' && 'ifs-sk', className)}
      style={{ '--dv-c': dvColor(color, 0, step), ...style }} {...rest}>
      {children != null && state !== 'background' && state !== 'loading' && <ValueLabel>{children}</ValueLabel>}
    </div>
  );
}

// Figma: grouped-bar-molecule (4457:37362)
// Props: type horizontal (segments stacked top→bottom) | vertical (segments side by side), progress (meter: value against max on a
// neutral track), values = numbers (segment sizes; categorical slots 1, 2, 3 … in order — or one old group's steps 4, 5, 6 … when color
// is a group name), value + max (progress), showValues.
function DataVizGroupedBar({ type = 'horizontal', progress = false, values = [], value = 0, max = 100, color, showValues, format = defaultFormat, className, style, ...rest }) {
  if (progress) {
    const pct = Math.max(0, Math.min(1, max ? value / max : 0)) * 100;
    return (
      <div role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} className={IFS.cx('ifs-dv-grouped', `ifs-dv-grouped--${type}`, 'ifs-dv-grouped--progress', className)} style={style} {...rest}>
        <DataVizBar state="background" className="ifs-dv-grouped__track" />
        <DataVizBar color={color ?? 1} className="ifs-dv-grouped__fill" style={type === 'vertical' ? { height: `${pct}%` } : { width: `${pct}%` }}>{showValues ? format(value) : null}</DataVizBar>
      </div>
    );
  }
  const group = DV_GROUPS.includes(color);
  return (
    <div className={IFS.cx('ifs-dv-grouped', `ifs-dv-grouped--${type}`, className)} style={style} {...rest}>
      {values.map((v, i) => <DataVizBar key={i} color={group ? color : i + 1} step={Math.min(10, 4 + i)} style={{ flexGrow: Math.max(0, v), flexBasis: 0 }}>{showValues ? format(v) : null}</DataVizBar>)}
    </div>
  );
}

// Figma: line-atom (4440:32650)
// Props: dashed (3/5 dash — planned, median, reference), orientation horizontal|vertical. Fills its parent's width (or height).
function DataVizLine({ dashed = false, orientation = 'horizontal', className, ...rest }) {
  return <span role="presentation" className={IFS.cx('ifs-dv-line', `ifs-dv-line--${orientation}`, dashed && 'ifs-dv-line--dashed', className)} {...rest} />;
}

// Figma: indicator-atom (4440:32643)
// Props: type default (8px data point) | selected (point + white ring) | intended-target (2×16 target tick), color = categorical slot (default 1) or data-viz token.
function DataVizIndicator({ type = 'default', color = 1, className, style, ...rest }) {
  return <span aria-hidden="true" className={IFS.cx('ifs-dv-indicator', `ifs-dv-indicator--${type}`, className)} style={{ '--dv-c': dvColor(color, 0, 4), ...style }} {...rest} />;
}

// Figma: value-label-atom (4440:32611)
// Props: state primary|secondary|tertiary|empty|loading, children = the value text (Label/M/medium 14/20).
function ValueLabel({ state = 'primary', children, className, ...rest }) {
  return (
    <span className={IFS.cx('ifs-dv-value', `ifs-dv-value--${state}`, className)} {...rest}>
      {state === 'loading' ? <span className="ifs-dv-value__skeleton ifs-sk" /> : state === 'empty' ? null : children}
    </span>
  );
}

// A legend swatch shows the colour of what it describes: chart series use data-viz colours (dvColor); a legend for something
// else (e.g. map risk bands drawn with system colours) may pass that colour's token. Tokens only: raw colours fall back to dvColor.
const legendColor = (color, step) => (typeof color === 'string' && /^var\(--[a-z0-9-]+\)$/.test(color.trim()) ? color.trim() : dvColor(color, 0, step));
// Figma: legend-swatch-atom (4440:32628) + info-hint-item (12:121968). One legend entry, two layouts (2.0.3: replaces InfoHintItem).
// Props: layout inline (horizontal legends: entries sit side by side) | row (vertical lists: fills its row, name truncates,
// value right-aligned); color = the data's colour: a categorical slot (1–12), 'other', a data-viz token, or 'neutral' (grey swatch for
// no-change data; `neutral` prop does the same); for non-chart legends any colour token; shape (2.0.6, D4: the swatch matches the mark)
// square (bars, areas, slices, cells) | line | dashed (lines) | dot (scatter); label; value (optional on every entry, tabular figures);
// icon (16, after the name); state default|hover|out-of-hover|intended-target; swatchOpacity (opacity-coded ramps).
// Hover only: legend entries are not clickable (Figma); hovering one dims the other series in the chart.
function LegendSwatch({ layout = 'inline', state = 'default', color = 1, step = 4, shape = 'square', neutral, label, value, icon, swatchOpacity, className, ...rest }) {
  const isNeutral = neutral || color === 'neutral';
  return (
    <span data-state={state} className={IFS.cx('ifs-dv-legend', `ifs-dv-legend--${layout}`, `ifs-dv-legend--${state}`, className)} {...rest}>
      {state === 'intended-target'
        ? <span className="ifs-dv-legend__target" aria-hidden="true" />
        : <span className={IFS.cx('ifs-dv-legend__swatch', shape !== 'square' && `ifs-dv-legend__swatch--${shape}`, isNeutral && 'ifs-dv-legend__swatch--neutral')} aria-hidden="true"
            style={isNeutral ? { opacity: swatchOpacity } : { '--sw': legendColor(color, step), opacity: swatchOpacity }} />}
      {label != null && <span className="ifs-dv-legend__name">{label}</span>}
      {icon && <IFS.Icon name={icon} size={16} className="ifs-dv-legend__icon" />}
      {value != null && <span className="ifs-dv-legend__value">{value}</span>}
    </span>
  );
}

// A legend: the entries for one chart. Props: items [{ key, label, color, step, shape, neutral, value, icon }] (the same colours the chart
// draws), layout inline (horizontal, wraps) | row (vertical list), showValues (default true: shows each item's value
// when it has one; false hides all values), align center|start (inline only).
function Legend({ items = [], layout = 'inline', showValues = true, align = 'center', className, ...rest }) {
  return (
    <div className={IFS.cx('ifs-legend', `ifs-legend--${layout}`, align === 'start' && 'ifs-legend--start', className)} {...rest}>
      {items.filter(Boolean).map((it, i) => <LegendSwatch key={it.key ?? i} layout={layout} {...it} value={showValues ? it.value : undefined} />)}
    </div>
  );
}

// Figma: data-viz-header-molecule (2154:2068)
// Props: title, state default|hover (forced; real hover/focus of the header or its card also shows the hover row),
// Right element: segments = SegmentedControl options (size S) with segmentValue/defaultSegmentValue/onSegmentChange,
// or button = { label, onClick, iconRight } (Tertiary S). Hover row: drag handle (draggable), and ghost icon-buttons
// for onEdit / onDelete / onMore. hoverActions = custom hover-only node, viewSwitch = the chart card's Chart / Table switch (after the hover row),
// slot = always-visible end node (Figma "Slot"; the chart card's Evidence button).
function DataVizHeader({ title, state, segments, segmentValue, defaultSegmentValue, onSegmentChange, button, onEdit, onDelete, onMore,
  draggable = true, hoverActions, viewSwitch, slot, className, ...rest }) {
  const icons = (onEdit || onDelete || onMore) && <>
    {onEdit && <IFS.IconButton type="ghost" size="s" icon="system-edit-rename" label="Edit" onClick={onEdit} />}
    {onDelete && <IFS.IconButton type="ghost" size="s" icon="system-trash-delete" label="Delete" onClick={onDelete} />}
    {onMore && <IFS.IconButton type="ghost" size="s" icon="system-dots-horizont" label="More" onClick={onMore} />}
  </>;
  return (
    <div data-state={state} className={IFS.cx('ifs-dv-header', className)} {...rest}>
      <div className="ifs-dv-header__left">
        {draggable && <span className="ifs-dv-header__drag" aria-hidden="true"><IFS.Icon name="system-drag-and-drop" size={16} /></span>}
        <span className="ifs-dv-header__title">{title}</span>
      </div>
      {segments && <IFS.SegmentedControl size="s" options={segments} value={segmentValue} defaultValue={defaultSegmentValue ?? (segments[0] && (segments[0].value ?? segments[0]))} onChange={onSegmentChange} />}
      {button && <IFS.Button type="tertiary" size="s" iconRight={button.iconRight === undefined ? 'arrow-right' : button.iconRight} onClick={button.onClick}>{button.label}</IFS.Button>}
      {(icons || hoverActions) && <div className="ifs-dv-header__hover">{hoverActions}{icons}</div>}
      {viewSwitch}
      {slot}
    </div>
  );
}

const VIEW_OPTIONS = [{ value: 'chart', icon: 'chart', label: 'Chart' }, { value: 'table', icon: 'system-table', label: 'Table' }];

// Figma: data-viz-card-organism (4457:33030)
// Props: state default|hover|drag|cooper, title, header = extra DataVizHeader props, children = Content slot, legend (node, below content).
// variant="chart" is the card every core chart (chart-column … chart-funnel) is drawn in (2.0.6, D1 / D2): the container rule (inset on
// all four sides, stack gap between header, plot and legend) and a fixed height, size default (--size-data-viz-card, 320 / 284 / 248) |
// large (2 default cards + the page gap: heatmaps, many bars, long legends); the plot fills what is left. Header, at the end:
// [hover / focus: Edit with Cooper (onEditWithCooper; false hides it) + actions] · Chart / Table switch (icon-only SegmentedControl M, when
// onViewChange is set; `view` = 'chart' | 'table') · Evidence button (onCooper; always visible). A chart's own control (header.segments,
// e.g. Year / Quarter) stays first. No ⋮ by default: `actions` is for a screen's real extra actions (download, full screen …).
// hideControls hides the switch and Evidence (no data to switch or explain: loading, empty, error, no results; D9).
// legendPlacement below (default) | beside (pie and donut: the list sits beside the plot). autoHeight = no fixed height (the `height`
// escape hatch). bare = no frame: no padding, fill, border or header — just the content and legend, for a chart placed inside another
// frame that already draws the header (e.g. a dashboard widget); it fills that frame's height.
function DataVizCard({ variant = 'organism', state, title, header, legend, children, onCooper, onEditWithCooper, view, onViewChange,
  actions, bare, size = 'default', legendPlacement = 'below', hideControls, autoHeight, className, ...rest }) {
  if (variant === 'chart') {
    return (
      <section data-state={state} aria-label={typeof title === 'string' ? title : undefined}
        className={IFS.cx('ifs-dv-card', 'ifs-dv-card--chart', bare && 'ifs-dv-card--bare', size === 'large' && 'ifs-dv-card--large', autoHeight && 'ifs-dv-card--auto',
          state && `ifs-dv-card--${state}`, className)} {...rest}>
        {!bare && <DataVizHeader title={title} draggable {...header}
          hoverActions={(onEditWithCooper !== false || actions) ? <>
            {onEditWithCooper !== false && <IFS.Button type="tertiary" size="s" iconLeft="cooper-system-icon" onClick={onEditWithCooper || undefined}>Edit with Cooper</IFS.Button>}
            {actions}
          </> : undefined}
          viewSwitch={onViewChange && !hideControls ? <IFS.SegmentedControl iconOnly size="m" className="ifs-dv-header__view" aria-label="View as"
            options={VIEW_OPTIONS} value={view || 'chart'} onChange={onViewChange} /> : undefined}
          slot={hideControls ? undefined : <IFS.EvidenceButton label="Ask Cooper about this chart" onClick={onCooper} />} />}
        <div className={IFS.cx('ifs-dv-card__body', legend && legendPlacement === 'beside' && 'ifs-dv-card__body--beside')}>
          {children}
          {legend && legendPlacement === 'beside' && <div className="ifs-dv-card__legend ifs-dv-card__legend--beside">{legend}</div>}
        </div>
        {legend && legendPlacement !== 'beside' && <div className="ifs-dv-card__legend">{legend}</div>}
      </section>
    );
  }
  return (
    <section data-state={state} aria-label={typeof title === 'string' ? title : undefined}
      className={IFS.cx('ifs-dv-card', bare && 'ifs-dv-card--bare', state && `ifs-dv-card--${state}`, className)} {...rest}>
      {!bare && <DataVizHeader title={title} {...header} hoverActions={actions || (header && header.hoverActions) ? <>{header && header.hoverActions}{actions}</> : undefined} />}
      <div className="ifs-dv-card__content">{children}{legend && <div className="ifs-dv-card__legend">{legend}</div>}</div>
    </section>
  );
}

// Figma: data-viz-modal-organism (4440:32681) and the chart-info-modal tooltip used by every core chart.
// Props: title, subtitle (Category line above the title → organism layout, value right of the title),
// value (chart layout: second line), delta = { text, direction up|down, tone positive|negative }, items = [{ label, value, color, shape }]
// (shape square | line | dashed | dot: the same swatch as the legend, D4; no shape = dot; swatches show only when more than one item has a colour,
// so a single-series tooltip has none), showValue (Figma show-value),
// variant chart (content-sized, 12–20rem, D5) | modal (256). children are appended under the items.
function DataVizTooltip({ title, subtitle, value, delta, items = [], showValue = true, variant = 'modal', children, className, ...rest }) {
  const deltaEl = delta && (
    <span className={IFS.cx('ifs-dv-tooltip__delta', delta.tone === 'negative' && 'ifs-dv-tooltip__delta--negative')}>
      <IFS.Icon name={delta.direction === 'down' ? 'arrow-caret-down-filled' : 'arrow-caret-up-filled'} size={12} />{delta.text}
    </span>
  );
  const swatches = items.filter(it => it.color).length > 1;
  return (
    <div role="tooltip" className={IFS.cx('ifs-dv-tooltip', `ifs-dv-tooltip--${variant}`, className)} {...rest}>
      <div className="ifs-dv-tooltip__head">
        {subtitle != null ? (
          <div className="ifs-dv-tooltip__titlerow">
            <div className="ifs-dv-tooltip__titles"><span className="ifs-dv-tooltip__sub">{subtitle}</span><span className="ifs-dv-tooltip__title">{title}</span></div>
            {showValue && value != null && <span className="ifs-dv-tooltip__title">{value}</span>}
          </div>
        ) : <>
          <span className="ifs-dv-tooltip__title">{title}</span>
          {((showValue && value != null) || deltaEl) && <div className="ifs-dv-tooltip__line"><span>{showValue ? value : null}</span>{deltaEl}</div>}
        </>}
      </div>
      {(items.length > 0 || children) && <span className="ifs-dv-tooltip__divider" />}
      {items.length > 0 && (
        <div className="ifs-dv-tooltip__items">
          {items.map((it, i) => (
            <div key={i} className="ifs-dv-tooltip__item">
              {swatches && it.color && <span className={IFS.cx(it.shape ? 'ifs-dv-tooltip__swatch' : 'ifs-dv-tooltip__dot', it.shape && `ifs-dv-tooltip__swatch--${it.shape}`)}
                style={it.shape ? { '--sw': legendColor(it.color) } : { background: legendColor(it.color) }} />}
              <span className="ifs-dv-tooltip__name">{it.label}</span>
              <span className="ifs-dv-tooltip__val">{it.value}</span>
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ chart shell */

// D5: the tooltip sits beside the mark with the same 8 px gap on either side: end side first, start side near the edge; never over
// the mark; vertically at the mark's top, kept inside the plot. anchor = { x0, x1, y } (the mark's start and end x, its top y).
// Hoverable: the pointer can rest on it (the plot keeps tracking the column under the pointer, WCAG 1.4.13).
function ChartTip({ anchor, box, tip, plotRef }) {
  const ref = React.useRef(null);
  const [pos, setPos] = React.useState(null);
  const key = anchor ? `${anchor.x0},${anchor.x1},${anchor.y}` : '';
  React.useLayoutEffect(() => {
    if (!ref.current || !anchor) return;
    const w = ref.current.offsetWidth, h = ref.current.offsetHeight;
    const rtl = plotRef && plotRef.current && getComputedStyle(plotRef.current).direction === 'rtl';
    const endX = anchor.x1 + TIP_GAP, startX = anchor.x0 - TIP_GAP - w;
    const fitsEnd = endX + w <= box.w, fitsStart = startX >= 0;
    let left;
    if (rtl) left = fitsStart ? startX : fitsEnd ? endX : (anchor.x0 > box.w - anchor.x1 ? startX : endX);
    else left = fitsEnd ? endX : fitsStart ? startX : (box.w - anchor.x1 >= anchor.x0 ? endX : startX);
    // kept inside the card (the plot may be shorter than a tooltip with many rows)
    const plot = plotRef && plotRef.current, card = plot && plot.closest('.ifs-dv-card');
    const pr = plot && plot.getBoundingClientRect(), cr = card && card.getBoundingClientRect();
    const minTop = cr ? Math.min(0, cr.top - pr.top + TIP_GAP) : 0, maxTop = (cr ? cr.bottom - pr.top - TIP_GAP : box.h) - h;
    const top = Math.max(minTop, Math.min(anchor.y - TIP_GAP, maxTop));
    setPos(p => (p && p.left === left && p.top === top ? p : { left, top }));
  }, [key, box.w, box.h, tip && tip.title, tip && (tip.items || []).length]);
  if (!anchor || !tip) return null;
  return (
    <div ref={ref} className="ifs-chart__tip" style={pos || { /* ltr: chart tooltip placed from the mark */ left: anchor.x1 + TIP_GAP, top: anchor.y, visibility: 'hidden' }}>
      <DataVizTooltip variant="chart" {...tip} />
    </div>
  );
}

// Grey skeleton drawn while loading (Figma State=Loading, L1): static plot shapes with the one slow pulse, filling the plot area.
function ChartSkeleton({ kind = 'bars', height }) {
  const [ref, box] = useBox(height);
  const W = box.w, H = box.h;
  const x0 = 40, x1 = W - 8, yT = 8, yB = H - 24;
  const hs = [0.5, 0.7, 0.59, 0.91, 0.74, 1];
  const band = (x1 - x0) / hs.length;
  return (
    <div className="ifs-chart__skeleton" aria-busy="true" aria-label="Loading chart">
      <div ref={ref} className="ifs-chart__plot" style={height ? { height } : undefined}>
        <span className="ifs-chart__probe" aria-hidden="true">0</span>
        <svg className="ifs-chart__svg" width={W} height={H} aria-hidden="true">
          {kind === 'ring' ? (
            <circle cx={W / 2} cy={H / 2} r={Math.max(8, Math.min(H, W) / 2 - 24)} fill="none" className="ifs-chart__skel-stroke ifs-sk" strokeWidth={Math.max(8, Math.min(H, W) / 6)} />
          ) : <>
            {[0, 1, 2, 3, 4].map(i => { const y = yB - (i * (yB - yT)) / 4; return <g key={i}>
              <line x1={x0} x2={x1} y1={y} y2={y} className={i ? 'ifs-chart__grid' : 'ifs-chart__skel-stroke ifs-sk'} />
              <rect x={4} y={y - 4} width={[16, 24, 28, 28, 30][i]} height={8} rx={2} className="ifs-chart__skel ifs-sk" />
            </g>; })}
            {hs.map((h, i) => <g key={i}>
              <path d={barPath(x0 + band * i + band * 0.22, yB - h * (yB - yT) * 0.84, band * 0.56, h * (yB - yT) * 0.84)} className="ifs-chart__skel ifs-sk" />
              <rect x={x0 + band * i + band * 0.2} y={yB + 10} width={band * 0.6} height={8} rx={2} className="ifs-chart__skel ifs-sk" />
            </g>)}
          </>}
        </svg>
      </div>
    </div>
  );
}

// D9 · L2: the skeleton waits 300 ms, so fast loads never flash.
function useDelayed(on, ms = 300) {
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    if (!on) { setShown(false); return undefined; }
    const t = setTimeout(() => setShown(true), ms);
    return () => clearTimeout(t);
  }, [on, ms]);
  return on && shown;
}

// Legend row (below the plot, centred, D4): max 2 lines; entries that would start a third line are replaced by "+N more"
// (their names in its tooltip; every value is in the table view).
function LegendRow({ children, beside }) {
  const ref = React.useRef(null);
  const kids = React.Children.toArray(children).filter(Boolean);
  const [hide, setHide] = React.useState(0);
  React.useLayoutEffect(() => { setHide(0); }, [kids.length]);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || beside) return undefined;
    const check = () => {
      const items = [...el.children];
      if (!items.length) return;
      const top0 = items[0].offsetTop, rowH = items[0].offsetHeight;
      const over = items.filter(c => c.offsetTop > top0 + rowH * 1.5).length;
      if (over > 0) setHide(h => Math.min(kids.length - 1, h + over));
    };
    check();
    if (typeof ResizeObserver === 'undefined') return undefined;
    let w = el.clientWidth;
    const ro = new ResizeObserver(() => { if (el.clientWidth !== w) { w = el.clientWidth; setHide(0); } }); // re-fit on a width change only
    ro.observe(el);
    return () => ro.disconnect();
  }, [hide, kids.length, beside]);
  const shown = hide ? kids.slice(0, kids.length - hide) : kids;
  const hidden = hide ? kids.slice(kids.length - hide) : [];
  return (
    <div ref={ref} className={IFS.cx('ifs-chart__legend', beside && 'ifs-chart__legend--beside')}>
      {shown}
      {hidden.length > 0 && <span className="ifs-dv-legend ifs-chart__legend-more" title={hidden.map(k => k.props.label).join(', ')}>+{hidden.length} more</span>}
    </div>
  );
}

// Legend entries from [{ key, label, color, shape, opacity, target, value }]; hovering an entry dims the other series (D4).
// One entry = no legend: the title names the measure (D4).
function ChartLegend({ items, active, onActive, layout = 'inline', beside, extra }) {
  const list = (items || []).filter(Boolean);
  if (list.length <= 1 && !extra) return null;
  return (
    <LegendRow beside={beside}>
      {list.length > 1 && list.map((it, i) => (
        <LegendSwatch key={it.key ?? i} layout={layout} label={it.label} color={it.color} shape={it.shape} swatchOpacity={it.opacity} value={it.value} neutral={it.neutral}
          state={it.target ? 'intended-target' : active == null ? 'default' : active === (it.key ?? i) ? 'hover' : 'out-of-hover'}
          onMouseEnter={onActive && it.key != null ? () => onActive(it.key) : undefined} onMouseLeave={onActive ? () => onActive(null) : undefined} />
      ))}
      {extra}
    </LegendRow>
  );
}

const STATE_COPY = {
  empty: { cause: 'first-run', icon: null, heading: 'Insufficient data', body: 'Not enough data to display this chart yet.' },
  'no-results': { cause: 'no-results', heading: 'No results', body: 'No data matches these filters.' },
  error: { cause: 'error', heading: 'Couldn’t load this chart', body: 'Something went wrong while loading the data.' },
};

// Shared frame for every core chart: DataVizCard (variant chart) + states + Chart / Table switch + screen-reader table.
// Shell props (all charts): title, state default|hover|cooper|loading|empty|no-results|error (hover = forced card hover; real hover works
// too), size default|large (the card height, D2), height (escape hatch: a fixed plot height in px, the card then hugs it),
// view / defaultView chart|table / onViewChange, defaultActive (index — or [row, col] for heatmap — whose tooltip starts open), onCooper,
// onEditWithCooper, actions (a screen's real extra actions, in the hover row), bare (no frame or header: for a chart inside a widget frame),
// valueTicks (2–8 value-axis intervals, default 4 = 5 labels, D3), emptyTitle / emptyText, noResultsTitle / noResultsText /
// onClearFilters, errorTitle / errorText / onRetry, className, style.
// States (D9): the card keeps its height in every state and the title stays; the switch, Evidence and the legend hide while there is no data.
// Loading shows the skeleton after 300 ms; empty / no results / error show an EmptyState (section) inside the card.
function ChartShell({ title, state, legend, table, isEmpty, skeleton = 'bars', height, size, view, defaultView = 'chart', onViewChange,
  onCooper, onEditWithCooper, actions, bare, emptyTitle, emptyText, noResultsTitle, noResultsText, onClearFilters, errorTitle, errorText, onRetry,
  className, style, children }) {
  const [v, setV] = useControlled(view, defaultView, onViewChange);
  const mode = state === 'loading' ? 'loading' : state === 'error' ? 'error' : state === 'no-results' ? 'no-results'
    : state === 'empty' || isEmpty ? 'empty' : v === 'table' && table ? 'table' : 'chart';
  const skel = useDelayed(mode === 'loading');
  const cardState = state === 'hover' || state === 'cooper' ? state : undefined;
  const noData = mode !== 'chart' && mode !== 'table';
  const tbl = table && (
    <table className="ifs-chart__sr">
      {title && <caption>{title}</caption>}
      <thead><tr>{table.columns.map(c => <th key={c.key} scope="col">{c.title}</th>)}</tr></thead>
      <tbody>{table.rows.map(r => <tr key={r.id}>{table.columns.map((c, i) => i === 0 ? <th key={c.key} scope="row">{r[c.key]}</th> : <td key={c.key}>{r[c.key]}</td>)}</tr>)}</tbody>
    </table>
  );
  const copy = STATE_COPY[mode];
  const heading = { empty: emptyTitle, 'no-results': noResultsTitle, error: errorTitle }[mode];
  const body = { empty: emptyText, 'no-results': noResultsText, error: errorText }[mode];
  const action = mode === 'error' ? { type: 'secondary', onClick: onRetry } : mode === 'no-results' ? { onClick: onClearFilters } : undefined;
  const hasLegend = legend && ((legend.items || []).filter(Boolean).length > 1 || legend.extra);
  const legendNode = mode === 'chart' && hasLegend ? <ChartLegend {...legend} /> : null;
  return (
    <DataVizCard variant="chart" title={title} state={cardState} size={size} autoHeight={height != null && !bare} style={style}
      className={IFS.cx('ifs-chart', `ifs-chart--${mode}`, className)}
      onCooper={onCooper} onEditWithCooper={onEditWithCooper} actions={actions} bare={bare} hideControls={noData}
      view={mode === 'table' ? 'table' : 'chart'} onViewChange={table ? setV : undefined}
      legend={legendNode} legendPlacement={legend && legend.beside ? 'beside' : 'below'}>
      {mode === 'loading' ? (skel ? <ChartSkeleton kind={skeleton} height={height} /> : <div className="ifs-chart__wait" aria-busy="true" style={height ? { height } : undefined} />)
        : copy ? <div className="ifs-chart__state" style={height ? { minHeight: height } : undefined}>
            <IFS.EmptyState size="section" cause={copy.cause} icon={copy.icon} heading={heading || copy.heading} body={body || copy.body} primaryAction={action} />
          </div>
        : mode === 'table' ? <div className="ifs-chart__table" style={height ? { height } : undefined}><IFS.Table columns={table.columns.map((c, i) => ({ ...c, align: i ? 'right' : undefined }))} rows={table.rows} /></div>
        : <>{children}{tbl}</>}
    </DataVizCard>
  );
}

// Plot: the chart's SVG plus the shared hover engine (D5). pick(x, y) → the index under the pointer (the whole column is the hit area),
// tracked over the whole plot including the tooltip, so moving sideways goes straight to the next mark and the tooltip never vanishes under
// the pointer; 100 ms grace on leave. Keyboard: the plot is one tab stop; arrow keys move between marks (2D for a heatmap), Home / End,
// Esc closes; the active mark is announced.
function Plot({ p, label, tip, n, pick, describe, children }) {
  const [focused, setFocused] = React.useState(false);
  const grid = Array.isArray(n);
  const move = e => {
    if (!pick || !p.ref.current) return;
    const r = p.ref.current.getBoundingClientRect();
    const i = pick(e.clientX - r.left, e.clientY - r.top);
    if (i == null) p.leave(); else p.show(i);
  };
  const count = grid ? n[0] * n[1] : n;
  const onKeyDown = e => {
    if (e.key === 'Escape') { p.clear(); return; }
    if (!count) return;
    let next = null;
    if (grid) {
      const [r, c] = p.active || [0, 0];
      const d = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] }[e.key];
      if (d) next = p.active ? [Math.max(0, Math.min(n[0] - 1, r + d[0])), Math.max(0, Math.min(n[1] - 1, c + d[1]))] : [0, 0];
      if (e.key === 'Home') next = [r, 0];
      if (e.key === 'End') next = [r, n[1] - 1];
    } else {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (d) next = p.active == null ? 0 : Math.max(0, Math.min(n - 1, p.active + d));
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = n - 1;
    }
    if (next != null) { e.preventDefault(); p.show(next); }
  };
  return (
    <div ref={p.ref} className={IFS.cx('ifs-chart__plot', p.active != null && 'ifs-chart__plot--active')} style={p.fixed ? { height: p.H } : undefined}
      tabIndex={count ? 0 : undefined} role="group" aria-label={`${label || 'Chart'}. Use the arrow keys to read each value.`}
      onMouseMove={move} onMouseLeave={p.leave} onKeyDown={onKeyDown}
      onFocus={e => { if (e.target !== e.currentTarget) return; setFocused(true); if (p.active == null && count && e.target.matches(':focus-visible')) p.show(grid ? [0, 0] : 0); }}
      onBlur={e => { if (e.target !== e.currentTarget) return; setFocused(false); p.clear(); }}>
      <span className="ifs-chart__probe" aria-hidden="true">0</span>
      <svg className="ifs-chart__svg" width={p.W} height={p.H} aria-hidden="true">{children}</svg>
      {tip && <ChartTip anchor={tip.anchor} box={{ w: p.W, h: p.H }} tip={tip.content} plotRef={p.ref} />}
      <span className="ifs-sr-only" aria-live="polite">{focused && p.active != null && describe ? describe(p.active) : ''}</span>
    </div>
  );
}

// Hook shared by every chart: plot size, axis font, active mark (hover / focus), hovered legend series.
function usePlot(props) {
  const fixed = props.height || null;
  const [ref, box] = useBox(fixed);
  const [active, setActive] = React.useState(props.defaultActive ?? null);
  const [series, setSeries] = React.useState(null);
  const t = React.useRef(null);
  const show = i => { clearTimeout(t.current); setActive(prev => (sameIdx(prev, i) ? prev : i)); };
  const leave = () => { clearTimeout(t.current); t.current = setTimeout(() => setActive(null), 100); };
  const clear = () => { clearTimeout(t.current); setActive(null); };
  const on = active != null;
  React.useEffect(() => {
    if (!on) return undefined;
    const k = e => { if (e.key === 'Escape') clear(); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [on]);
  React.useEffect(() => () => clearTimeout(t.current), []);
  const measure = React.useMemo(() => measurer(box.font), [box.font]);
  return { ref, W: box.w, H: box.h, px: box.px, fixed, active, setActive, show, leave, clear, series, setSeries, measure };
}
// Hovered mark full colour, the others darkened (never transparent, D5); a hovered legend entry dims the other series the same way.
const markCls = (p, on, seriesKey) => IFS.cx('ifs-chart__mark',
  ((p.active != null && !on) || (p.series != null && seriesKey !== undefined && p.series !== seriesKey)) && 'ifs-chart__mark--dim');

// D3: value-axis gridlines solid 1 px --color-border, the zero line --color-border-strong; labels closer than 24 px thin out
// (every other one), gridlines stay.
function YAxis({ L, ticks, format }) {
  const base = ticks[0] <= 0 && ticks[ticks.length - 1] >= 0 ? 0 : ticks[0];
  const gap = ticks.length > 1 ? Math.abs(L.y(ticks[0]) - L.y(ticks[1])) : LABEL_MIN;
  const every = gap < LABEL_MIN ? Math.ceil(LABEL_MIN / Math.max(1, gap)) : 1;
  const bi = Math.max(0, ticks.indexOf(base));
  return (
    <g aria-hidden="true">
      {ticks.map((t, i) => <g key={t}>
        {t !== base && <line x1={L.x0} x2={L.x1} y1={L.y(t)} y2={L.y(t)} className="ifs-chart__grid" />}
        {(i - bi) % every === 0 && <text x={0} y={L.y(t)} dy="0.35em" className="ifs-chart__axis">{format(t)}</text>}
      </g>)}
      <line x1={L.x0} x2={L.x1} y1={L.y(base)} y2={L.y(base)} className="ifs-chart__baseline" />
    </g>
  );
}

// Plot geometry for category charts: value gutter from the widest label, room for the category labels below.
function catLayout(p, n, ticks, format, padR = 0) {
  const gutter = Math.max(24, Math.max(...ticks.map(t => p.measure(format(t)))) + 12);
  const x0 = gutter, x1 = p.W - 4 - padR, yT = 8, yB = p.H - Math.round(p.px * 1.34 + 8);
  const lo = ticks[0], hi = ticks[ticks.length - 1];
  const band = (x1 - x0) / Math.max(1, n);
  return { x0, x1, yT, yB, band, cx: i => x0 + band * (i + 0.5), y: v => yB - ((v - lo) / (hi - lo)) * (yB - yT), labelY: p.H - 4 };
}
// D3: category labels never rotate; drop every 2nd (then 3rd …) until none overlap, keeping the first and the last.
function catShown(labels, pitch, measure) {
  const n = labels.length;
  if (n <= 2) return () => true;
  const need = Math.max(...labels.map(l => measure(l))) + 8;
  const k = Math.max(1, Math.ceil(need / Math.max(1, pitch)));
  if (k === 1) return () => true;
  const set = new Set();
  for (let i = 0; i < n; i += k) set.add(i);
  const last = Math.max(...set);
  if (last !== n - 1) { if ((n - 1 - last) < k) set.delete(last); set.add(n - 1); }
  return i => set.has(i);
}

const shellProps = ({ title, state, size, view, defaultView, onViewChange, onCooper, onEditWithCooper, actions, bare, height,
  emptyTitle, emptyText, noResultsTitle, noResultsText, onClearFilters, errorTitle, errorText, onRetry, className, style }) =>
  ({ title, state, size, view, defaultView, onViewChange, onCooper, onEditWithCooper, actions, bare, height,
    emptyTitle, emptyText, noResultsTitle, noResultsText, onClearFilters, errorTitle, errorText, onRetry, className, style });

const tipFrom = (d, base, tooltip, i) => (tooltip ? tooltip(d, i) : { ...base, ...(d.delta && { delta: d.delta }), ...(d.details && { items: d.details }) });

/* ------------------------------------------------------------------ column / bar family */

// Figma: chart-column (9862:12468) — one measure across few or time-ordered categories; zero-based, one colour (slot 1).
// Props: data = [{ label, value, reference?, delta?, details? }], valueLabel (legend + table), referenceLabel (white peer-median tick),
// color (categorical slot or data-viz token; default 1), format(v) for values/axis, tooltip(datum, i) → DataVizTooltip props, valueTicks.
// Shell props (every chart): see ChartShell.
function ColumnChart(props) {
  const { data = [], valueLabel = 'Value', referenceLabel = 'Peer median', color = 1, format = defaultFormat, tooltip, contiguous, valueTicks } = props;
  const p = usePlot(props);
  const hasRef = data.some(d => d.reference != null);
  const ticks = scaleTicks(Math.min(0, ...finite(data.map(d => d.value))), Math.max(0, ...finite(data.flatMap(d => [d.value, d.reference]))), valueTicks);
  const L = catLayout(p, data.length, ticks, format);
  const bw = contiguous ? Math.max(1, L.band - GAP_MARK) : Math.max(4, Math.min(L.band * 0.55, 64));
  const fill = dvColor(color, 0);
  const legend = { items: [{ label: valueLabel, color }, hasRef && { label: referenceLabel, color: WHITE, shape: 'line' }] };
  const table = { columns: [{ key: 'label', title: contiguous ? 'Bin' : 'Category' }, { key: 'v', title: valueLabel }, hasRef && { key: 'r', title: referenceLabel }].filter(Boolean),
    rows: data.map((d, i) => ({ id: i, label: d.label, v: format(d.value), r: d.reference != null ? format(d.reference) : IFS.format.empty() })) };
  const shown = catShown(data.map(d => d.label), L.band, p.measure);
  const a = p.active != null ? data[p.active] : null;
  const tip = a && { anchor: { x0: L.cx(p.active) - bw / 2, x1: L.cx(p.active) + bw / 2, y: L.y(Math.max(a.value, 0, a.reference ?? 0)) },
    content: tipFrom(a, { title: a.label, items: [{ label: valueLabel, value: format(a.value), color, shape: 'square' }, ...(a.reference != null ? [{ label: referenceLabel, value: format(a.reference), color: WHITE, shape: 'line' }] : [])] }, tooltip, p.active) };
  const pick = x => (x < L.x0 || !data.length ? null : Math.max(0, Math.min(data.length - 1, Math.floor((x - L.x0) / L.band))));
  return (
    <ChartShell {...shellProps(props)} legend={legend} table={table} isEmpty={!data.length}>
      <Plot p={p} label={props.title} tip={tip} n={data.length} pick={pick} describe={i => `${data[i].label}: ${format(data[i].value)}`}>
        <YAxis L={L} ticks={ticks} format={format} />
        {data.map((d, i) => {
          const y0 = L.y(0), y1 = L.y(d.value), on = p.active === i;
          return (
            <g key={i}>
              <path d={d.value >= 0 ? barPath(L.cx(i) - bw / 2, y1, bw, y0 - y1, contiguous ? 'none' : 'top') : barPath(L.cx(i) - bw / 2, y0, bw, y1 - y0, contiguous ? 'none' : 'bottom')}
                fill={fill} className={markCls(p, on)} />
              {d.reference != null && <rect x={L.cx(i) - bw / 2 - 6} y={L.y(d.reference) - 1} width={bw + 12} height={2} fill={WHITE} className={markCls(p, on)} />}
              {shown(i) && <text x={L.cx(i)} y={L.labelY} textAnchor="middle" className="ifs-chart__axis">{d.label}</text>}
            </g>
          );
        })}
      </Plot>
    </ChartShell>
  );
}

// Figma: chart-histogram (9864:14012) — distribution of one measure across bins (contiguous zero-based columns, 1 px apart).
// Props: values = raw numbers + bins (count, default 10) or binWidth — or data = pre-binned [{ label, value }];
// binFormat(lo, hi) for bin labels, valueLabel (default 'Count'), + ColumnChart props.
function HistogramChart({ values, bins = 10, binWidth, binFormat, data, valueLabel = 'Count', ...props }) {
  const binned = React.useMemo(() => {
    if (data || !values || !values.length) return data || [];
    const v = finite(values), lo = Math.min(...v), hi = Math.max(...v);
    const w = binWidth || niceStep(hi - lo || 1, bins);
    const start = Math.floor(lo / w) * w, n = Math.max(1, Math.ceil((hi - start) / w + 1e-9));
    const out = Array.from({ length: n }, (_, i) => ({ lo: start + i * w, hi: start + (i + 1) * w, value: 0 }));
    v.forEach(x => { out[Math.min(n - 1, Math.floor((x - start) / w))].value += 1; });
    const f = binFormat || ((a, b) => `${defaultFormat(a)}–${defaultFormat(b)}`);
    return out.map(b => ({ label: f(b.lo, b.hi), value: b.value }));
  }, [data, values, bins, binWidth, binFormat]);
  return <ColumnChart {...props} data={binned} valueLabel={valueLabel} contiguous />;
}

// Figma: chart-bar (9862:12961) — horizontal bars for many categories, long labels or rankings (sort biggest → smallest).
// Props: as ColumnChart + sort (true = biggest first), labelWidth (category column, default 96). Values are labelled at the bar end.
function BarChart(props) {
  const { valueLabel = 'Value', referenceLabel = 'Peer median', color = 1, format = defaultFormat, tooltip, sort = false, labelWidth = 96 } = props;
  const data = sort ? [...(props.data || [])].sort((a, b) => b.value - a.value) : (props.data || []);
  const p = usePlot(props);
  const hasRef = data.some(d => d.reference != null);
  const max = Math.max(0, ...finite(data.flatMap(d => [d.value, d.reference])));
  const valW = Math.max(0, ...data.map(d => p.measure(format(d.value)))) + 12;
  const x0 = labelWidth + 8, x1 = p.W - valW, yT = 4, yB = p.H - 4;
  const row = (yB - yT) / Math.max(1, data.length), bh = Math.max(4, Math.min(26, row * 0.57));
  const X = v => x0 + (max ? (Math.max(0, v) / max) * (x1 - x0) : 0);
  const cy = i => yT + row * (i + 0.5);
  const fill = dvColor(color, 0);
  const legend = { items: [{ label: valueLabel, color }, hasRef && { label: referenceLabel, color: WHITE, shape: 'line' }] };
  const table = { columns: [{ key: 'label', title: 'Category' }, { key: 'v', title: valueLabel }, hasRef && { key: 'r', title: referenceLabel }].filter(Boolean),
    rows: data.map((d, i) => ({ id: i, label: d.label, v: format(d.value), r: d.reference != null ? format(d.reference) : IFS.format.empty() })) };
  const a = p.active != null ? data[p.active] : null;
  const tip = a && { anchor: { x0, x1: X(Math.max(a.value, a.reference ?? 0)) + valW - 12, y: cy(p.active) - bh / 2 },
    content: tipFrom(a, { title: a.label, items: [{ label: valueLabel, value: format(a.value), color, shape: 'square' }, ...(a.reference != null ? [{ label: referenceLabel, value: format(a.reference), color: WHITE, shape: 'line' }] : [])] }, tooltip, p.active) };
  const pick = (x, y) => (!data.length ? null : Math.max(0, Math.min(data.length - 1, Math.floor((y - yT) / row))));
  const every = row < p.px * 1.3 ? Math.ceil((p.px * 1.3) / Math.max(1, row)) : 1;
  return (
    <ChartShell {...shellProps(props)} legend={legend} table={table} isEmpty={!data.length}>
      <Plot p={p} label={props.title} tip={tip} n={data.length} pick={pick} describe={i => `${data[i].label}: ${format(data[i].value)}`}>
        <line x1={x0} x2={x0} y1={yT} y2={yB} className="ifs-chart__baseline" />
        {data.map((d, i) => {
          const on = p.active === i, show = every === 1 || i % every === 0;
          return (
            <g key={i}>
              {show && <text x={0} y={cy(i)} dy="0.35em" className="ifs-chart__axis">{d.label}</text>}
              <path d={barPath(x0, cy(i) - bh / 2, Math.max(0, X(d.value) - x0), bh, 'right')} fill={fill} className={markCls(p, on)} />
              {show && <text x={X(d.value) + 8} y={cy(i)} dy="0.35em" className="ifs-chart__value">{format(d.value)}</text>}
              {d.reference != null && <rect x={X(d.reference) - 1} y={cy(i) - bh / 2 - 4} width={2} height={bh + 8} fill={WHITE} className={markCls(p, on)} />}
            </g>
          );
        })}
      </Plot>
    </ChartShell>
  );
}

const seriesTable = (data, series, format, extra = []) => ({
  columns: [{ key: 'label', title: 'Category' }, ...series.map(s => ({ key: `s_${s.key}`, title: s.label })), ...extra.map(e => ({ key: `e_${e.key}`, title: e.label }))],
  rows: data.map((d, i) => {
    const r = { id: i, label: d.label };
    series.forEach(s => { r[`s_${s.key}`] = format(valOf(d, s)); });
    extra.forEach(e => { r[`e_${e.key}`] = e.value ? e.value(d) : format(d[e.key]); });
    return r;
  }),
});
const warnOnce = (k, msg) => { if (!dvWarned.has(k)) { dvWarned.add(k); if (typeof console !== 'undefined') console.warn(msg); } };

// Figma: chart-grouped-column (9862:13445) — 2–4 series side by side per category; consistent series order + legend.
// Props: data = [{ label, [series.key]: number, reference?, delta?, details? }], series = [{ key, label, color? }] (capped at 4: a 5th and
// more are left out of the plot, kept in the table view, with a console warning; use a stacked column or small multiples), referenceKey (default 'reference') +
// referenceLabel, format, tooltip, valueTicks. + shell props. Bars stay at least 4 px wide with the 1 px card-colour gap (D8).
function GroupedColumnChart(props) {
  const { data = [], referenceKey = 'reference', referenceLabel = 'Peer median', format = defaultFormat, tooltip, valueTicks } = props;
  const all = props.series || [];
  if (all.length > GROUPED_MAX) warnOnce('grouped-max', `IFS charts: GroupedColumnChart draws up to ${GROUPED_MAX} series (the rest are in the table view only). Use StackedColumnChart or small multiples for more.`);
  const series = all.slice(0, GROUPED_MAX);
  const p = usePlot(props);
  const hasRef = data.some(d => d[referenceKey] != null);
  const vals = finite(data.flatMap(d => [...series.map(s => valOf(d, s)), d[referenceKey]]));
  const ticks = scaleTicks(Math.min(0, ...vals), Math.max(0, ...vals), valueTicks);
  const L = catLayout(p, data.length, ticks, format);
  const k = Math.max(1, series.length);
  const gw = Math.max(Math.min(L.band * 0.69, k * 56), Math.min(L.band - 2, k * 4 + (k - 1) * GAP_MARK));
  const bw = Math.max(1, (gw - GAP_MARK * (k - 1)) / k);
  const legend = { active: p.series, onActive: p.setSeries,
    items: [...series.map((s, i) => ({ key: s.key, label: s.label, color: s.color ?? i + 1 })), hasRef && { label: referenceLabel, color: WHITE, shape: 'line' }] };
  const table = seriesTable(data, all, format, hasRef ? [{ key: referenceKey, label: referenceLabel }] : []);
  const shown = catShown(data.map(d => d.label), L.band, p.measure);
  const a = p.active != null ? data[p.active] : null;
  const top = a ? Math.max(0, ...finite(series.map(s => valOf(a, s)))) : 0;
  const tip = a && { anchor: { x0: L.cx(p.active) - gw / 2, x1: L.cx(p.active) + gw / 2, y: L.y(top) },
    content: tipFrom(a, { title: a.label, items: [...series.map((s, i) => ({ label: s.label, value: format(valOf(a, s)), color: s.color ?? i + 1, shape: 'square' })), ...(a[referenceKey] != null ? [{ label: referenceLabel, value: format(a[referenceKey]), color: WHITE, shape: 'line' }] : [])] }, tooltip, p.active) };
  const pick = x => (x < L.x0 || !data.length ? null : Math.max(0, Math.min(data.length - 1, Math.floor((x - L.x0) / L.band))));
  return (
    <ChartShell {...shellProps(props)} legend={legend} table={table} isEmpty={!data.length || !series.length}>
      <Plot p={p} label={props.title} tip={tip} n={data.length} pick={pick} describe={i => `${data[i].label}: ${series.map(s => `${s.label} ${format(valOf(data[i], s))}`).join(', ')}`}>
        <YAxis L={L} ticks={ticks} format={format} />
        {data.map((d, i) => {
          const on = p.active === i, gx = L.cx(i) - gw / 2;
          return (
            <g key={i}>
              {series.map((s, j) => {
                const v = valOf(d, s) ?? 0, y1 = L.y(Math.max(v, 0)), y0 = L.y(Math.min(v, 0));
                return <path key={s.key} d={barPath(gx + j * (bw + GAP_MARK), y1, bw, y0 - y1, v >= 0 ? 'top' : 'bottom')} fill={colorOf(s, j)} className={markCls(p, on, s.key)} />;
              })}
              {d[referenceKey] != null && <rect x={gx - 6} y={L.y(d[referenceKey]) - 1} width={gw + 12} height={2} fill={WHITE} className={markCls(p, on)} />}
              {shown(i) && <text x={L.cx(i)} y={L.labelY} textAnchor="middle" className="ifs-chart__axis">{d.label}</text>}
            </g>
          );
        })}
      </Plot>
    </ChartShell>
  );
}

// Figma: chart-stacked-column (9863:11139) — composition of a total per category; the one stacked-column component (D8).
// Series stack bottom → top in series order (most important first, on the baseline); up to 8 segments, the rest fold into "Other"
// (fewer read better: 5 or fewer recommended). 1 px card-colour gap between segments (--border-width-default, WCAG 1.4.11); only the outer end of the whole column is rounded.
// Props: data = [{ label, [series.key]: number, delta?, details? }], series = [{ key, label, color? }], format, tooltip, valueTicks. + shell props.
function StackedColumnChart(props) {
  const { data = [], format = defaultFormat, tooltip, valueTicks } = props;
  const all = props.series || [];
  const series = foldSeries(all, SERIES_MAX + 1); // up to 8 segments + "Other"
  const p = usePlot(props);
  const totals = data.map(d => series.reduce((t, s) => t + Math.max(0, valOf(d, s) || 0), 0));
  const ticks = scaleTicks(0, Math.max(0, ...totals), valueTicks);
  const L = catLayout(p, data.length, ticks, format);
  const bw = Math.max(4, Math.min(L.band * 0.55, 64));
  const legend = { active: p.series, onActive: p.setSeries, items: series.map((s, i) => ({ key: s.key, label: s.label, color: s.color ?? i + 1 })) };
  const table = seriesTable(data, all, format, [{ key: 'total', label: 'Total', value: d => format(all.reduce((t, s) => t + (d[s.key] || 0), 0)) }]);
  const shown = catShown(data.map(d => d.label), L.band, p.measure);
  const a = p.active != null ? data[p.active] : null;
  const tip = a && { anchor: { x0: L.cx(p.active) - bw / 2, x1: L.cx(p.active) + bw / 2, y: L.y(totals[p.active]) },
    content: tipFrom(a, { title: a.label, value: `Total ${format(totals[p.active])}`, items: series.map((s, i) => ({ label: s.label, value: format(valOf(a, s)), color: s.color ?? i + 1, shape: 'square' })).reverse() }, tooltip, p.active) };
  const pick = x => (x < L.x0 || !data.length ? null : Math.max(0, Math.min(data.length - 1, Math.floor((x - L.x0) / L.band))));
  return (
    <ChartShell {...shellProps(props)} legend={legend} table={table} isEmpty={!data.length || !series.length}>
      <Plot p={p} label={props.title} tip={tip} n={data.length} pick={pick} describe={i => `${data[i].label}: total ${format(totals[i])}; ${series.map(s => `${s.label} ${format(valOf(data[i], s))}`).join(', ')}`}>
        <YAxis L={L} ticks={ticks} format={format} />
        {data.map((d, i) => {
          const on = p.active === i;
          const segs = series.map((s, j) => ({ s, j, v: Math.max(0, valOf(d, s) || 0) })).filter(x => x.v > 0);
          let acc = 0;
          return (
            <g key={i}>
              {segs.map(({ s, j, v }, k) => {
                const yb = L.y(acc) - (k ? GAP_MARK / 2 : 0), yt = L.y(acc + v) + (k < segs.length - 1 ? GAP_MARK / 2 : 0);
                acc += v;
                return <path key={s.key} d={barPath(L.cx(i) - bw / 2, yt, bw, Math.max(0, yb - yt), k === segs.length - 1 ? 'top' : 'none')} fill={colorOf(s, j)} className={markCls(p, on, s.key)} />;
              })}
              {shown(i) && <text x={L.cx(i)} y={L.labelY} textAnchor="middle" className="ifs-chart__axis">{d.label}</text>}
            </g>
          );
        })}
      </Plot>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ line / area */

const linePath = pts => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join('');

// Figma: chart-line (9863:11650) — change over time; actual solid vs planned dashed; optional peer band + dashed median.
// Props: data = [{ label, [series.key]: number, … }], series = [{ key, label, color?, dashed?, points? }] (first series shows its
// points), band = { low, high, mid?, label } (keys into data; drawn as a white 16% band + dashed mid line), referenceKey/referenceLabel
// (dashed white line), zeroBased (default false — lines need not start at 0), endLabels (default true: each line is named at its end, D4;
// when the names collide or don't fit, the legend sits below instead), format, tooltip, valueTicks. Up to 8 series (12 with end labels);
// the rest draw in the "Other" grey with one legend entry. Hover anywhere picks the nearest point; ← → move it with the keyboard.
function LineChart(props) {
  const { data = [], band, referenceKey, referenceLabel = 'Peer median', zeroBased = false, format = defaultFormat, tooltip, area = false, endLabels = true, valueTicks } = props;
  const all = props.series || [];
  const p = usePlot(props);
  const uid = useUid('ifs-area');
  const rawKeys = [...all.map(s => s.key), band && band.low, band && band.high, referenceKey].filter(Boolean);
  const range = (ser) => {
    const vals = finite(data.flatMap(d => [...ser.map(s => valOf(d, s)), ...rawKeys.filter(k => !all.some(s => s.key === k)).map(k => d[k])]));
    const lo = Math.min(...vals), hi = Math.max(...vals);
    return vals.length ? scaleTicks(zeroBased || area ? Math.min(0, lo) : lo - (hi - lo) * 0.1, hi, valueTicks) : [0, 1];
  };
  // Try direct labels with up to 12 series; fall back to a legend (and 8 series) when the end labels collide or take too much room.
  const lineH = p.px * 1.34;
  const tryLabels = ser => {
    if (!endLabels || ser.length < 2 || !data.length) return null;
    const ticks = range(ser);
    const padR = Math.max(...ser.map(s => p.measure(s.label))) + 8;
    if (padR > p.W * 0.35) return null;
    const L = catLayout(p, 1, ticks, format, padR);
    const last = data.length - 1;
    const ys = ser.map(s => { let i = last; while (i > 0 && valOf(data[i], s) == null) i--; const v = valOf(data[i], s); return v == null ? null : L.y(v); });
    const sorted = finite(ys).sort((x, y) => x - y);
    for (let i = 1; i < sorted.length; i++) if (sorted[i] - sorted[i - 1] < lineH) return null;
    return { ticks, padR, ys };
  };
  let series = greyLines(all, SERIES_MAX_LABELLED);
  let lab = tryLabels(series);
  if (!lab) series = greyLines(all, SERIES_MAX);
  const legendSeries = series.filter(s => !s.group).concat(series.some(s => s.group) ? [{ key: '__other', label: 'Other', color: 'other' }] : []);
  const ticks = lab ? lab.ticks : range(series);
  const L = catLayout(p, 1, ticks, format, lab ? lab.padR : 0);
  const n = data.length, step = n > 1 ? (L.x1 - L.x0) / (n - 1) : 0;
  const X = i => (n > 1 ? L.x0 + step * i : (L.x0 + L.x1) / 2);
  const pts = s => data.map((d, i) => { const v = typeof s === 'string' ? d[s] : valOf(d, s); return v == null ? null : [X(i), L.y(v)]; }).filter(Boolean);
  const shape = s => (s.dashed ? 'dashed' : 'line');
  const legend = lab ? null : { active: p.series, onActive: p.setSeries, items: [
    ...legendSeries.map((s, i) => ({ key: s.key, label: s.label, color: s.color ?? i + 1, shape: area ? 'square' : shape(s) })),
    band && { label: band.label, color: 'band' },
    referenceKey && { label: referenceLabel, color: WHITE, shape: 'dashed' }] };
  const extra = [band && band.mid && { key: band.mid, label: band.label }, referenceKey && { key: referenceKey, label: referenceLabel }].filter(Boolean);
  const table = seriesTable(data, all, format, extra);
  const shown = catShown(data.map(d => d.label), n > 1 ? step : L.x1 - L.x0, p.measure);
  const a = p.active != null ? data[p.active] : null;
  const s0 = series[0];
  const topV = a ? Math.max(...finite(series.map(s => valOf(a, s)))) : 0;
  const tip = a && s0 && { anchor: { x0: X(p.active) - 4, x1: X(p.active) + 4, y: L.y(Number.isFinite(topV) ? topV : ticks[0]) },
    content: tipFrom(a, { title: a.label, items: [
      ...series.map((s, i) => ({ label: s.label, value: format(valOf(a, s)), color: s.color ?? i + 1, shape: area ? 'square' : shape(s) })),
      ...(band && band.mid && a[band.mid] != null ? [{ label: band.label, value: `${format(a[band.mid])} ± ${format((a[band.high] - a[band.low]) / 2)}`, color: 'band', shape: 'square' }] : []),
      ...(referenceKey && a[referenceKey] != null ? [{ label: referenceLabel, value: format(a[referenceKey]), color: WHITE, shape: 'dashed' }] : [])] }, tooltip, p.active) };
  const pick = x => (!n ? null : Math.max(0, Math.min(n - 1, step ? Math.round((x - L.x0) / step) : 0)));
  const dimS = k => { const s = series.find(x => x.key === k), g = (s && s.group) || k; return p.series != null && p.series !== g ? 'ifs-chart__mark ifs-chart__mark--dim' : 'ifs-chart__mark'; };
  return (
    <ChartShell {...shellProps(props)} legend={legend} table={table} isEmpty={!data.length || !series.length}>
      <Plot p={p} label={props.title} tip={tip} n={n} pick={pick}
        describe={i => `${data[i].label}: ${series.map(s => `${s.label} ${format(valOf(data[i], s))}`).join(', ')}`}>
        <YAxis L={L} ticks={ticks} format={format} />
        {data.map((d, i) => (shown(i) ? <text key={i} x={X(i)} y={L.labelY} textAnchor="middle" className="ifs-chart__axis">{d.label}</text> : null))}
        {band && (() => { const up = pts(band.high), dn = pts(band.low).reverse(); return up.length ? <path d={`${linePath(up)}L${dn.map(q => q.join(',')).join('L')}Z`} fill={DV_SPECIAL.band} /> : null; })()}
        {band && band.mid && <path d={linePath(pts(band.mid))} fill="none" className="ifs-chart__refline" />}
        {area && series.map((s, k) => (
          <g key={s.key} className={dimS(s.key)}>
            <defs><linearGradient id={`${uid}-${k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={colorOf(s, k)} stopOpacity="0.45" /><stop offset="1" stopColor={colorOf(s, k)} stopOpacity="0" /></linearGradient></defs>
            <path d={`${linePath(pts(s))}L${X(n - 1)},${L.y(Math.max(0, ticks[0]))}L${X(0)},${L.y(Math.max(0, ticks[0]))}Z`} fill={`url(#${uid}-${k})`} />
          </g>
        ))}
        {referenceKey && <path d={linePath(pts(referenceKey))} fill="none" className="ifs-chart__refline" />}
        {series.map((s, k) => (
          <g key={s.key} className={dimS(s.key)}>
            <path d={linePath(pts(s))} fill="none" stroke={colorOf(s, k)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dashed ? '6 4' : undefined} />
            {(s.points ?? (k === 0 && !area)) && pts(s).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill={colorOf(s, k)} />)}
          </g>
        ))}
        {lab && series.map((s, k) => lab.ys[k] != null && (
          <text key={s.key} x={L.x1 + 8} y={lab.ys[k]} dy="0.35em" className={IFS.cx('ifs-chart__end-label', dimS(s.key))}>{s.label}</text>
        ))}
        {a && <g aria-hidden="true">
          <line x1={X(p.active)} x2={X(p.active)} y1={L.yT} y2={L.yB} className="ifs-chart__guide" />
          {series.map((s, k) => valOf(a, s) != null && <circle key={s.key} cx={X(p.active)} cy={L.y(valOf(a, s))} r={4} fill={colorOf(s, k)} className="ifs-chart__point--on" />)}
        </g>}
      </Plot>
    </ChartShell>
  );
}

// Figma: chart-area (9863:12167) — cumulative volume over time; zero-based; series fill fades from 45% to 0 of its colour.
// Props: as LineChart (zeroBased defaults to true; points hidden unless series.points).
function AreaChart(props) {
  return <LineChart zeroBased {...props} area />;
}

/* ------------------------------------------------------------------ pie / donut */

function RoundChart(props) {
  const { data: raw = [], donut, centerValue, centerLabel, sort = true, valueLabel = 'Value', format = defaultFormat, tooltip } = props;
  const indexed = raw.map((d, i) => ({ ...d, _i: i }));
  const ordered = sort ? [...indexed].sort((a, b) => b.value - a.value) : indexed;
  // Up to 8 slices, then one "Other" slice (D6)
  const data = ordered.length > SERIES_MAX
    ? [...ordered.slice(0, SERIES_MAX - 1), { label: 'Other', value: ordered.slice(SERIES_MAX - 1).reduce((t, d) => t + Math.max(0, d.value || 0), 0), color: 'other', _i: -1 }]
    : ordered;
  const p = usePlot(props);
  const total = data.reduce((t, d) => t + Math.max(0, d.value || 0), 0);
  const R = Math.max(8, Math.min(124, p.H / 2 - 4, p.W / 2 - 8)), r0 = donut ? R * 0.66 : 0, cx = p.W / 2, cy = p.H / 2;
  const color = d => d.color ?? (d._i % SLOTS) + 1;
  let acc = 0;
  const arcs = data.map(d => { const a0 = (acc / total) * Math.PI * 2; acc += Math.max(0, d.value || 0); return { d, a0, a1: (acc / total) * Math.PI * 2 }; });
  const pct = v => (total ? Math.round((v / total) * 100) : 0);
  const legend = { beside: true, layout: 'row', active: p.series, onActive: p.setSeries,
    items: data.map(d => ({ key: d.label, label: d.label, color: color(d), opacity: d.opacity, value: format(d.value) })) };
  const table = { columns: [{ key: 'label', title: 'Category' }, { key: 'v', title: valueLabel }, { key: 'p', title: 'Share' }],
    rows: ordered.map((d, i) => ({ id: i, label: d.label, v: format(d.value), p: `${pct(d.value)}%` })) };
  const act = p.active != null ? arcs[p.active] : null;
  const mid = act && (act.a0 + act.a1) / 2;
  const ax = act && cx + R * Math.sin(mid), ay = act && cy - R * Math.cos(mid);
  const tip = act && { anchor: { x0: Math.min(ax, cx), x1: Math.max(ax, cx + (mid > Math.PI ? 0 : R * 0.2)), y: Math.min(ay, cy) },
    content: tipFrom(act.d, { title: act.d.label, value: `${format(act.d.value)} of ${format(total)} (${pct(act.d.value)}%)` }, tooltip, p.active) };
  const pick = (x, y) => {
    const dx = x - cx, dy = y - cy, rr = Math.hypot(dx, dy);
    if (rr > R + 4 || rr < r0 - 4 || !total) return null;
    let ang = Math.atan2(dx, -dy); if (ang < 0) ang += Math.PI * 2;
    const i = arcs.findIndex(a => ang >= a.a0 && ang < a.a1);
    return i < 0 ? null : i;
  };
  return (
    <ChartShell {...shellProps(props)} skeleton="ring" legend={legend} table={table} isEmpty={!total}>
      <Plot p={p} label={props.title} tip={tip} n={arcs.length} pick={pick} describe={i => `${arcs[i].d.label}: ${format(arcs[i].d.value)}, ${pct(arcs[i].d.value)}%`}>
        {arcs.map(({ d, a0, a1 }, i) => {
          const on = p.active === i, m = (a0 + a1) / 2, lr = donut ? (R + r0) / 2 : R * 0.62;
          return (
            <g key={i}>
              <path d={arcPath(cx, cy, r0, R, a0, a1)} fill={dvColor(color(d))} fillOpacity={d.opacity}
                className={IFS.cx('ifs-chart__slice', markCls(p, on, d.label))} />
              {a1 - a0 > 0.5 && R > 48 && <text x={cx + lr * Math.sin(m)} y={cy - lr * Math.cos(m)} dy="0.35em" textAnchor="middle" className="ifs-chart__slice-label">{pct(d.value)}%</text>}
            </g>
          );
        })}
        {donut && centerValue != null && <g aria-hidden="true">
          <text x={cx} y={cy - (centerLabel ? p.px * 0.7 : 0)} dy="0.35em" textAnchor="middle" className="ifs-chart__center">{centerValue}</text>
          {centerLabel && <text x={cx} y={cy + p.px * 1.3} dy="0.35em" textAnchor="middle" className="ifs-chart__axis">{centerLabel}</text>}
        </g>}
      </Plot>
    </ChartShell>
  );
}

// Figma: chart-pie (9866:12309) — parts of one whole with few slices (prefer DonutChart). Slices largest → smallest clockwise from 12;
// up to 8, then "Other". The legend is a list beside the chart with each slice's value (D4); share labels sit on the bigger slices.
// Props: data = [{ label, value, color?, opacity?, delta?, details? }], sort (default true), valueLabel, format, tooltip. + shell props.
function PieChart(props) { return <RoundChart {...props} donut={false} />; }

// Figma: chart-donut (9866:12774) — share of a whole; one legend beside it; the hole carries the total.
// Props: as PieChart + centerValue (big number) + centerLabel (caption under it).
function DonutChart(props) { return <RoundChart {...props} donut />; }

/* ------------------------------------------------------------------ scatter / bubble */

// Figma: chart-scatter (9866:13245) — relationship between two measures; clusters and outliers.
// Props: data = [{ label, x, y, series?, size?, delta?, details? }], series = [{ key, label, color? }] (absent = one series; up to 8,
// then "Other"), xFormat, yFormat (default format), xUnit (suffix on the last x tick, e.g. "days"), xLabel/yLabel (table + tooltip names),
// xReference / yReference (dashed white peer-median lines) + referenceLabel, bubble (size → radius, with a size key in the legend),
// sizeLabel, tooltip, valueTicks. + shell props. Every point has at least a 24 px hit area (G8).
function ScatterChart(props) {
  const { data = [], format = defaultFormat, xFormat = defaultFormat, yFormat = format, xUnit, xLabel = 'X', yLabel = 'Y',
    xReference, yReference, referenceLabel = 'Peer median', bubble = false, sizeLabel = 'Size', tooltip, valueTicks } = props;
  const series = props.series || [];
  const p = usePlot(props);
  const yt = scaleTicks(Math.min(0, ...finite(data.map(d => d.y))), Math.max(0, ...finite([...data.map(d => d.y), yReference])), valueTicks);
  const xt = scaleTicks(Math.min(0, ...finite(data.map(d => d.x))), Math.max(0, ...finite([...data.map(d => d.x), xReference])), 4);
  const L = catLayout(p, 1, yt, yFormat);
  const X = v => L.x0 + 12 + ((v - xt[0]) / (xt[xt.length - 1] - xt[0])) * (L.x1 - L.x0 - 24);
  const smax = Math.max(1, ...finite(data.map(d => d.size)));
  const rad = d => (bubble ? 4 + Math.sqrt(Math.max(0, d.size || 0) / smax) * 18 : 5);
  const sIdx = d => Math.max(0, series.findIndex(s => s.key === d.series));
  const col = d => (series.length ? (sIdx(d) >= SERIES_MAX - 1 && series.length > SERIES_MAX ? 'other' : series[sIdx(d)].color ?? sIdx(d) + 1) : props.color ?? 1);
  const shownSeries = series.length > SERIES_MAX ? [...series.slice(0, SERIES_MAX - 1), { key: '__other', label: 'Other', color: 'other' }] : series;
  const sKey = d => (series.length > SERIES_MAX && sIdx(d) >= SERIES_MAX - 1 ? '__other' : d.series);
  const sizes = finite(data.map(d => d.size));
  const sizeKey = bubble && sizes.length ? (
    <span className="ifs-chart__size-key" key="size">
      <span className="ifs-chart__size-key-name">{sizeLabel}</span>
      {[Math.min(...sizes), Math.max(...sizes)].map((v, i) => { const r = rad({ size: v }); return (
        <span key={i} className="ifs-chart__size-key-item">
          <svg width={r * 2 + 2} height={r * 2 + 2} aria-hidden="true"><circle cx={r + 1} cy={r + 1} r={r} className="ifs-chart__size-key-circle" /></svg>
          {format(v)}
        </span>); })}
    </span>) : null;
  const legend = { active: p.series, onActive: p.setSeries, extra: sizeKey, items: [
    ...(shownSeries.length ? shownSeries.map((s, i) => ({ key: s.key, label: s.label, color: s.color ?? i + 1, shape: 'dot' })) : [{ label: props.valueLabel || 'Items', color: col({}), shape: 'dot' }]),
    (xReference != null || yReference != null) && { label: referenceLabel, color: WHITE, shape: 'dashed' }] };
  const table = { columns: [{ key: 'label', title: 'Item' }, series.length && { key: 's', title: 'Series' }, { key: 'x', title: xLabel }, { key: 'y', title: yLabel }, bubble && { key: 'z', title: sizeLabel }].filter(Boolean),
    rows: data.map((d, i) => ({ id: i, label: d.label, s: series.length ? series[sIdx(d)].label : '', x: xFormat(d.x), y: yFormat(d.y), z: bubble ? format(d.size) : '' })) };
  const a = p.active != null ? data[p.active] : null;
  const tip = a && { anchor: { x0: X(a.x) - rad(a), x1: X(a.x) + rad(a), y: L.y(a.y) - rad(a) },
    content: tipFrom(a, { title: a.label, items: [{ label: yLabel, value: yFormat(a.y), color: col(a), shape: 'dot' }, { label: xLabel, value: xFormat(a.x) + (xUnit ? ` ${xUnit}` : '') }, ...(bubble ? [{ label: sizeLabel, value: format(a.size) }] : [])] }, tooltip, p.active) };
  const order = data.map((d, i) => i).sort((i, j) => (bubble ? (data[j].size || 0) - (data[i].size || 0) : 0));
  // G8: the nearest point within its radius or 12 px, whichever is larger (a 24 px hit area for small points)
  const pick = (x, y) => {
    let best = null, bd = Infinity;
    data.forEach((d, i) => { const dist = Math.hypot(X(d.x) - x, L.y(d.y) - y); if (dist <= Math.max(HIT_R, rad(d)) && dist < bd) { bd = dist; best = i; } });
    return best;
  };
  const xShown = catShown(xt.map((t, i) => xFormat(t) + (i === xt.length - 1 && xUnit ? ` ${xUnit}` : '')), xt.length > 1 ? X(xt[1]) - X(xt[0]) : L.x1 - L.x0, p.measure);
  return (
    <ChartShell {...shellProps(props)} legend={legend} table={table} isEmpty={!data.length}>
      <Plot p={p} label={props.title} tip={tip} n={data.length} pick={pick} describe={i => `${data[i].label}: ${xLabel} ${xFormat(data[i].x)}, ${yLabel} ${yFormat(data[i].y)}`}>
        <YAxis L={L} ticks={yt} format={yFormat} />
        {xt.map((t, i) => xShown(i) && <text key={t} x={X(t)} y={L.labelY} textAnchor="middle" className="ifs-chart__axis">{xFormat(t)}{i === xt.length - 1 && xUnit ? ` ${xUnit}` : ''}</text>)}
        {xReference != null && <line x1={X(xReference)} x2={X(xReference)} y1={L.yT} y2={L.yB} className="ifs-chart__refline ifs-chart__refline--thin" />}
        {yReference != null && <line x1={L.x0} x2={L.x1} y1={L.y(yReference)} y2={L.y(yReference)} className="ifs-chart__refline ifs-chart__refline--thin" />}
        {order.map(i => {
          const d = data[i], on = p.active === i;
          return (
            <g key={i} className={markCls(p, on, series.length ? sKey(d) : undefined)}>
              <circle cx={X(d.x)} cy={L.y(d.y)} r={rad(d)} fill={dvColor(col(d))} fillOpacity={bubble ? 0.85 : 1} />
              {on && <circle cx={X(d.x)} cy={L.y(d.y)} r={rad(d) + 4} fill="none" stroke={dvColor(col(d))} strokeWidth={1} />}
            </g>
          );
        })}
      </Plot>
    </ChartShell>
  );
}

// Figma: chart-bubble (9866:13788) — scatter with a third measure as bubble area. Props: as ScatterChart; data items carry `size`.
function BubbleChart(props) { return <ScatterChart {...props} bubble />; }

/* ------------------------------------------------------------------ gauge */

// Figma: chart-gauge (9867:618) — one KPI against one reference value on a 180° arc.
// Props: value, max (default 100), min (0), target (solid white tick reaching outside the arc), reference (dashed white tick across the arc), format (default v → v%),
// label (caption under the number), valueLabel / targetLabel / referenceLabel (legend), color (slot, default 1), delta, details, tooltip. + shell props.
function GaugeChart(props) {
  const { value = 0, min = 0, max = 100, target, reference, format = v => IFS.format.percent(v), label, valueLabel = 'Value', targetLabel = 'Target',
    referenceLabel = 'Peer median', color = 1, tooltip } = props;
  const p = usePlot({ ...props, defaultActive: props.defaultActive ? 0 : null });
  // the arc is as thick as the donut ring in the same box (R × 0.34), with --radius-mark ends (review Nov 25)
  const donutR = Math.max(8, Math.min(124, p.H / 2 - 4, p.W / 2 - 8)), sw = Math.max(8, donutR * 0.34);
  const R = Math.max(16, Math.min(150, p.W / 2 - sw / 2 - 8, p.H - sw / 2 - p.px * 1.34 - 12)), cx = p.W / 2, cy = p.H - p.px * 1.34 - 8;
  const ang = v => Math.PI * Math.max(0, Math.min(1, (v - min) / (max - min || 1))); // 0 = left end, π = right end
  const pt = (v, r) => [cx - r * Math.cos(ang(v)), cy - r * Math.sin(ang(v))];
  // the arc as a filled band with --radius-mark corners (2 px, like the bars): inset by the radius, then a 2 × radius round-joined stroke
  const band = (v0, v1, gapStart = 0) => {
    const ro = R + sw / 2 - R_MARK, ri = R - sw / 2 + R_MARK;
    const a0 = ang(v0) + gapStart / R, a1 = ang(v1);
    if (a1 - a0 < (2 * R_MARK) / ri) return '';
    const P = (r, a) => `${cx - r * Math.cos(a)},${cy - r * Math.sin(a)}`;
    return `M${P(ro, a0 + R_MARK / ro)}A${ro},${ro} 0 0 1 ${P(ro, a1 - R_MARK / ro)}L${P(ri, a1 - R_MARK / ri)}A${ri},${ri} 0 0 0 ${P(ri, a0 + R_MARK / ri)}Z`;
  };
  const tick = (v, r0, r1) => { const [x0, y0] = pt(v, r0), [x1, y1] = pt(v, r1); return { x1: x0, y1: y0, x2: x1, y2: y1 }; };
  const legend = { items: [{ label: valueLabel, color }, target != null && { label: targetLabel, target: true }, reference != null && { label: referenceLabel, color: WHITE, shape: 'dashed' }] };
  const table = { columns: [{ key: 'label', title: 'Measure' }, { key: 'v', title: 'Value' }],
    rows: [{ id: 0, label: valueLabel, v: format(value) }, target != null && { id: 1, label: targetLabel, v: format(target) }, reference != null && { id: 2, label: referenceLabel, v: format(reference) }].filter(Boolean) };
  const [ex, ey] = pt(value, R);
  const on = p.active != null;
  const tip = on && { anchor: { x0: ex - sw / 2, x1: ex + sw / 2, y: ey - sw / 2 },
    content: tooltip ? tooltip(props) : { title: props.title || valueLabel, value: format(value), delta: props.delta,
      items: props.details || [target != null && { label: targetLabel, value: format(target) }, target != null && { label: 'Gap', value: format(Math.abs(target - value)) }, reference != null && { label: referenceLabel, value: format(reference) }].filter(Boolean) } };
  const pick = (x, y) => (Math.hypot(x - cx, y - cy) <= R + sw && y <= cy + sw ? 0 : null);
  return (
    <ChartShell {...shellProps(props)} skeleton="ring" legend={legend} table={table}>
      <Plot p={p} label={props.title} tip={tip} n={1} pick={pick} describe={() => `${valueLabel}: ${format(value)}${target != null ? `, ${targetLabel} ${format(target)}` : ''}`}>
        <path d={value > min ? band(value, max, GAP_MARK) : band(min, max)} fill="var(--color-border-soft)" stroke="var(--color-border-soft)" strokeWidth={2 * R_MARK} strokeLinejoin="round" />
        {value > min && <path d={band(min, value)} fill={dvColor(color)} stroke={dvColor(color)} strokeWidth={2 * R_MARK} strokeLinejoin="round" />}
        {reference != null && <line {...tick(reference, R - sw * 0.6, R + sw * 0.6)} stroke={WHITE} strokeWidth={3} strokeDasharray="4 3" />}
        {target != null && <line {...tick(target, R - sw / 2, R + sw)} stroke="var(--color-border-on-solid)" strokeWidth={2} strokeLinecap="round" opacity={0.9} />}
        {/* the number at the optical centre of the arc (the centroid of the inner half-disc, 4r / 3π), its label under it */}
        <text x={cx} y={cy - ((R - sw / 2) * 4) / (3 * Math.PI) - (label ? p.px * 0.8 : 0)} dy="0.35em" textAnchor="middle" className="ifs-chart__gauge-value">{format(value)}</text>
        {label && <text x={cx} y={cy - ((R - sw / 2) * 4) / (3 * Math.PI) + p.px * 1.2} dy="0.35em" textAnchor="middle" className="ifs-chart__axis">{label}</text>}
        <text x={cx - R} y={cy + p.px * 1.34 + 4} textAnchor="middle" className="ifs-chart__axis">{format(min)}</text>
        <text x={cx + R} y={cy + p.px * 1.34 + 4} textAnchor="middle" className="ifs-chart__axis">{format(max)}</text>
      </Plot>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ waterfall */

// Figma: chart-waterfall (9866:16075) — bridge from a start value to an end value through increments.
// Props: data = [{ label, value, total? }]: total:true bars stand on 0 (value given = reset the running total; omitted = show it),
// other bars float as +/- steps. colors = { total, increase, decrease } (default neutral / diverging positive (pink) / diverging negative
// (azure), D7: polarity, never colour alone — every step is signed + / −), labels = { total, increase, decrease } (legend), format, tooltip,
// valueTicks. + shell props.
function WaterfallChart(props) {
  const { data = [], format = defaultFormat, tooltip, valueTicks } = props;
  const colors = { total: 'neutral', increase: 'var(--color-data-viz-diverging-positive-2)', decrease: 'var(--color-data-viz-diverging-negative-2)', ...props.colors };
  const names = { total: 'Total', increase: 'Increase (+)', decrease: 'Decrease (−)', ...props.labels };
  const p = usePlot(props);
  let run = 0;
  const bars = data.map(d => {
    if (d.total) { if (d.value != null) run = d.value; return { d, kind: 'total', lo: Math.min(0, run), hi: Math.max(0, run), end: run, shown: run }; }
    const start = run; run += d.value || 0;
    return { d, kind: d.value >= 0 ? 'increase' : 'decrease', lo: Math.min(start, run), hi: Math.max(start, run), end: run, shown: d.value };
  });
  const ticks = scaleTicks(Math.min(0, ...bars.map(b => b.lo)), Math.max(0, ...bars.map(b => b.hi)), valueTicks);
  const L = catLayout(p, data.length, ticks, format);
  const bw = Math.max(4, Math.min(48, L.band * 0.6));
  const legend = { items: ['total', 'increase', 'decrease'].map(k => ({ label: names[k], color: colors[k] })) };
  const table = { columns: [{ key: 'label', title: 'Step' }, { key: 'v', title: 'Change' }, { key: 'r', title: 'Running total' }],
    rows: bars.map((b, i) => ({ id: i, label: b.d.label, v: b.kind === 'total' ? format(b.shown) : signed(b.shown, format), r: format(b.end) })) };
  const shown = catShown(data.map(d => d.label), L.band, p.measure);
  const act = p.active != null ? bars[p.active] : null;
  const tip = act && { anchor: { x0: L.cx(p.active) - bw / 2, x1: L.cx(p.active) + bw / 2, y: L.y(act.hi) },
    content: tipFrom(act.d, { title: act.d.label, value: act.kind === 'total' ? format(act.shown) : signed(act.shown, format), items: [{ label: 'Running total', value: format(act.end) }] }, tooltip, p.active) };
  const pick = x => (x < L.x0 || !data.length ? null : Math.max(0, Math.min(data.length - 1, Math.floor((x - L.x0) / L.band))));
  const valShown = L.band >= Math.max(0, ...bars.map(b => p.measure(b.kind === 'total' ? format(b.shown) : signed(b.shown, format)))) + 4;
  return (
    <ChartShell {...shellProps(props)} legend={legend} table={table} isEmpty={!data.length}>
      <Plot p={p} label={props.title} tip={tip} n={data.length} pick={pick} describe={i => `${bars[i].d.label}: ${bars[i].kind === 'total' ? format(bars[i].shown) : signed(bars[i].shown, format)}`}>
        <YAxis L={L} ticks={ticks} format={format} />
        {bars.map((b, i) => i < bars.length - 1 && (
          <line key={`c${i}`} x1={L.cx(i) + bw / 2} x2={L.cx(i + 1) - bw / 2} y1={L.y(b.end)} y2={L.y(b.end)} className="ifs-chart__connector" />
        ))}
        {bars.map((b, i) => {
          const on = p.active === i, c = colors[b.kind];
          const up = b.kind !== 'decrease';
          return (
            <g key={i}>
              <path d={barPath(L.cx(i) - bw / 2, L.y(b.hi), bw, Math.max(1, L.y(b.lo) - L.y(b.hi)), b.kind === 'total' ? (b.end >= 0 ? 'top' : 'bottom') : up ? 'top' : 'bottom')} fill={dvColor(c)} className={markCls(p, on)} />
              {valShown && <text x={L.cx(i)} y={L.y(b.hi) - 6} textAnchor="middle" className="ifs-chart__value">{b.kind === 'total' ? format(b.shown) : signed(b.shown, format)}</text>}
              {shown(i) && <text x={L.cx(i)} y={L.labelY} textAnchor="middle" className="ifs-chart__axis">{b.d.label}</text>}
            </g>
          );
        })}
      </Plot>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ funnel */

// Figma: chart-funnel (9867:1065) — drop-off across ordered stages.
// Props: data = [{ label, value, reference? (peer value for that stage → white ticks), delta?, details? }], color (stages; categorical slot,
// default 1, fading per stage), outcomeColor (last stage; default slot 3 — set null to keep one colour), stageLabel/outcomeLabel/
// referenceLabel (legend), format (default full number), tooltip. + shell props.
function FunnelChart(props) {
  const { data = [], color = 1, outcomeColor = 3, stageLabel = 'In pipeline', outcomeLabel = 'Completed', referenceLabel = 'Peer median',
    format = v => IFS.format.number(v), tooltip } = props;
  const p = usePlot(props);
  const n = data.length, v0 = Math.max(1, ...finite(data.map(d => d.value)));
  const maxW = Math.min(480, p.W - 110), cx = Math.min(p.W / 2, (p.W - 40) / 2 + 10);
  const gap = GAP_MARK, h = Math.max(8, Math.min(52, (p.H - 8) / Math.max(1, n) - gap));
  const wOf = v => maxW * (0.25 + 0.75 * Math.max(0, v) / v0);
  const hasRef = data.some(d => d.reference != null);
  const last = outcomeColor != null && n > 1;
  const legend = { items: [{ label: stageLabel, color }, last && { label: outcomeLabel, color: outcomeColor }, hasRef && { label: referenceLabel, color: WHITE, shape: 'line' }] };
  const drop = i => (i && data[i - 1].value ? Math.round(((data[i].value - data[i - 1].value) / data[i - 1].value) * 100) : null);
  const table = { columns: [{ key: 'label', title: 'Stage' }, { key: 'v', title: 'Count' }, { key: 'd', title: 'Change' }, hasRef && { key: 'r', title: referenceLabel }].filter(Boolean),
    rows: data.map((d, i) => ({ id: i, label: d.label, v: format(d.value), d: drop(i) == null ? IFS.format.empty() : `${drop(i) > 0 ? '+' : '−'}${Math.abs(drop(i))}%`, r: d.reference != null ? format(d.reference) : IFS.format.empty() })) };
  const a = p.active != null ? data[p.active] : null;
  const y = i => 4 + i * (h + gap);
  const tip = a && { anchor: { x0: cx - wOf(a.value) / 2, x1: cx + wOf(a.value) / 2, y: y(p.active) },
    content: tipFrom(a, { title: a.label, value: format(a.value), items: [p.active > 0 && { label: 'Entered stage', value: format(data[p.active - 1].value) }, p.active > 0 && { label: 'Dropped', value: format(data[p.active - 1].value - a.value) }, a.reference != null && { label: referenceLabel, value: format(a.reference) }].filter(Boolean) }, tooltip, p.active) };
  const pick = (x, yy) => (!n ? null : Math.max(0, Math.min(n - 1, Math.floor((yy - 4) / (h + gap)))));
  return (
    <ChartShell {...shellProps(props)} legend={legend} table={table} isEmpty={!n}>
      <Plot p={p} label={props.title} tip={tip} n={n} pick={pick} describe={i => `${data[i].label}: ${format(data[i].value)}`}>
        {data.map((d, i) => {
          const wt = wOf(d.value), wb = i < n - 1 ? wOf(data[i + 1].value) : wt * 0.75, on = p.active === i, isLast = last && i === n - 1;
          const op = isLast ? 0.7 : Math.max(0.3, 0.85 - i * 0.17);
          const dp = drop(i);
          return (
            <g key={i} className={markCls(p, on)}>
              <path d={`M${cx - wt / 2},${y(i)}H${cx + wt / 2}L${cx + wb / 2},${y(i) + h}H${cx - wb / 2}Z`} fill={dvColor(isLast ? outcomeColor : color)} fillOpacity={op} />
              {h >= p.px * 1.3 && <text x={cx} y={y(i) + h / 2} dy="0.35em" textAnchor="middle" className="ifs-chart__value">{d.label}{' '}{format(d.value)}</text>}
              {d.reference != null && [-1, 1].map(s => <rect key={s} x={cx + s * wOf(d.reference) / 2 - 1} y={y(i) + h / 2 - Math.min(11, h / 2)} width={2} height={Math.min(22, h)} fill={WHITE} />)}
              {dp != null && h >= p.px * 1.3 && <text x={cx + Math.max(wt, d.reference != null ? wOf(d.reference) : 0) / 2 + 20} y={y(i) + h / 2} dy="0.35em" className="ifs-chart__axis">{dp > 0 ? '+' : '−'}{Math.abs(dp)}%</text>}
            </g>
          );
        })}
      </Plot>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ heatmap */

const RAMPS = ['azure', 'teal', 'orchid', 'pink', 'yellow', 'red', 'green'];
// Figma: chart-heatmap (9866:14280) — ordered magnitude across a matrix, one sequential ramp (D7): more = lighter, 5 classes
// (ladder steps 1 · 3 · 5 · 7 · 9) or 9 when the heatmap is dense. The legend is a scale bar below (D4).
// Props: rows = [labels], columns = [labels], values = [[row][col] numbers], ramp (azure default | teal | orchid | pink | yellow),
// classes 5 | 9, color (legacy: one colour with opacity by value, Figma parity), columnLabelEvery (auto),
// lowLabel / highLabel (scale ends), valueLabel, format, tooltip(cell = { row, column, value, r, c }). + shell props.
function HeatmapChart(props) {
  const { rows = [], columns = [], values = [], ramp = 'azure', classes = 5, color, lowLabel = 'Lower', highLabel = 'Higher', valueLabel = 'Value', format = defaultFormat, tooltip } = props;
  const p = usePlot(props);
  const flat = finite(values.flat());
  const lo = Math.min(...flat), hi = Math.max(...flat);
  const fam = RAMPS.includes(ramp) ? ramp : 'azure';
  const steps = classes === 9 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 3, 5, 7, 9];
  const cls = v => Math.min(steps.length - 1, Math.floor((hi > lo ? (v - lo) / (hi - lo) : 1) * steps.length));
  const rampVar = k => `var(--color-data-viz-sequential-${fam}-${steps[k]})`;
  const op = v => 0.2 + 0.8 * (hi > lo ? (v - lo) / (hi - lo) : 1);
  const labelW = Math.max(24, ...rows.map(r => p.measure(r))) + 8;
  // cells fill the plot (rectangles), with the 1 px card-colour gap between them
  const pitch = Math.max(6, (p.W - labelW) / Math.max(1, columns.length)), rowPitch = Math.max(6, (p.H - p.px * 1.34 - 8) / Math.max(1, rows.length));
  const cell = pitch - GAP_MARK, cellH = rowPitch - GAP_MARK;
  const every = props.columnLabelEvery;
  const colShown = every ? (j => j % every === 0) : catShown(columns, pitch, p.measure);
  const rowEvery = rowPitch < p.px * 1.3 ? Math.ceil((p.px * 1.3) / rowPitch) : 1;
  const x = c => labelW + c * pitch, y = r => r * rowPitch;
  const scale = (
    <span className="ifs-chart__scale" key="scale">
      <span className="ifs-chart__scale-end">{lowLabel}</span>
      <span className="ifs-chart__scale-bar" aria-hidden="true">
        {color ? [0.2, 0.4, 0.6, 0.8, 1].map(o => <span key={o} style={{ background: dvColor(color), opacity: o }} />)
          : steps.map((s, k) => <span key={s} style={{ background: rampVar(k) }} />)}
      </span>
      <span className="ifs-chart__scale-end">{highLabel}</span>
    </span>);
  const legend = { items: [], extra: scale };
  const table = { columns: [{ key: 'label', title: '' }, ...columns.map((c, i) => ({ key: `c${i}`, title: c }))],
    rows: rows.map((r, i) => Object.assign({ id: i, label: r }, ...columns.map((c, j) => ({ [`c${j}`]: format(values[i] && values[i][j]) })))) };
  const [ar, ac] = p.active != null ? p.active : [];
  const cellObj = p.active != null && values[ar] ? { row: rows[ar], column: columns[ac], value: values[ar][ac], r: ar, c: ac } : null;
  const tip = cellObj && { anchor: { x0: x(ac), x1: x(ac) + cell, y: y(ar) },
    content: tooltip ? tooltip(cellObj) : { title: `${cellObj.row} · ${cellObj.column}`, value: `${format(cellObj.value)} ${valueLabel}`.trim() } };
  const pick = (px, py) => { const c = Math.floor((px - labelW) / pitch), r = Math.floor(py / rowPitch); return c >= 0 && r >= 0 && c < columns.length && r < rows.length ? [r, c] : null; };
  return (
    <ChartShell {...shellProps(props)} legend={legend} table={table} isEmpty={!flat.length}>
      <Plot p={p} label={props.title} tip={tip} n={[rows.length, columns.length]} pick={pick}
        describe={([r, c]) => `${rows[r]}, ${columns[c]}: ${format(values[r] && values[r][c])}`}>
        {rows.map((r, i) => (i % rowEvery === 0 ? <text key={r} x={0} y={y(i) + cellH / 2} dy="0.35em" className="ifs-chart__axis">{r}</text> : null))}
        {columns.map((c, j) => (colShown(j) ? <text key={c} x={x(j) + cell / 2} y={y(rows.length) + p.px + 4} textAnchor="middle" className="ifs-chart__axis">{c}</text> : null))}
        {rows.map((r, i) => columns.map((c, j) => {
          const v = values[i] && values[i][j], on = ar === i && ac === j;
          return (
            <rect key={`${i}-${j}`} x={x(j)} y={y(i)} width={cell} height={cellH} rx={R_MARK}
              fill={v == null ? 'var(--color-surface-secondary)' : color ? dvColor(color) : rampVar(cls(v))} fillOpacity={color && v != null ? op(v) : undefined}
              className={IFS.cx('ifs-chart__cell', on && 'ifs-chart__cell--on')} />
          );
        }))}
      </Plot>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ small molecules */

// Figma: progress-ring-molecule (4619:18187)
// Props: value 0–100 (Figma % variants 0/10/20/40/50/60/80/100 — any value works), size (default 24), label = accessible name.
function ProgressRing({ value = 0, size = 24, label = 'Progress', className, ...rest }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const sw = size * 0.15, r = size / 2 - sw / 2, C = 2 * Math.PI * r; // Figma: ellipse arc, inner radius 70%
  return (
    <svg role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      className={IFS.cx('ifs-progress-ring', v >= 100 && 'ifs-progress-ring--complete', className)} {...rest}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="ifs-progress-ring__track" strokeWidth={sw} />
      {v > 0 && <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="ifs-progress-ring__bar" strokeWidth={sw}
        strokeDasharray={`${(C * v) / 100} ${C}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />}
    </svg>
  );
}

// Figma: evidence-strength-bar-molecule (67:6634)
// Props: value (%), thresholds = [review, approve] (default [70, 90]), min (left end of the Reject band, default 50), title,
// labels = [reject, review, approve] captions. Type (Reject|Review|Approve) follows the value: the active band is drawn solid.
function EvidenceStrength({ value = 0, thresholds = [70, 90], min = 50, title = 'Evidence strength', labels, className, ...rest }) {
  const [t1, t2] = thresholds;
  const type = value < t1 ? 'reject' : value <= t2 ? 'review' : 'approve'; // exactly t2 (90) is still Review
  const caps = labels || [`<${t1}% Reject`, `${t1}–${t2}% Review`, `>${t2}% Approve`];
  const seg = [[min, t1], [t1, t2], [t2, 100]];
  const k = type === 'reject' ? 0 : type === 'review' ? 1 : 2;
  const [a, b] = seg[k];
  const pos = ((k + Math.max(0, Math.min(1, (value - a) / (b - a || 1)))) / 3) * 100;
  return (
    <div role="meter" aria-label={title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-valuetext={`${value}% — ${caps[k]}`}
      className={IFS.cx('ifs-evidence', `ifs-evidence--${type}`, className)} {...rest}>
      <span className="ifs-evidence__title">{title}</span>
      <div className="ifs-evidence__bar">
        {['reject', 'review', 'approve'].map((s, i) => <span key={s} className={IFS.cx('ifs-evidence__seg', `ifs-evidence__seg--${s}`, i === k && 'ifs-evidence__seg--on')} />)}
        <span className="ifs-evidence__marker" style={{ /* ltr: evidence scale reads left to right */ left: `${pos}%` }}><span className="ifs-evidence__value">{value}%</span><span className="ifs-evidence__pointer" /></span>
      </div>
      <div className="ifs-evidence__caption">{caps.map(c => <span key={c}>{c}</span>)}</div>
    </div>
  );
}


Object.assign(IFS, {
  DataVizBar, DataVizGroupedBar, DataVizLine, DataVizIndicator, ValueLabel, LegendSwatch, Legend, DataVizHeader, DataVizCard, DataVizTooltip,
  ColumnChart, HistogramChart, BarChart, GroupedColumnChart, StackedColumnChart, LineChart, AreaChart, PieChart, DonutChart, ScatterChart, BubbleChart,
  GaugeChart, WaterfallChart, FunnelChart, HeatmapChart, ProgressRing, EvidenceStrength,
});
export {
  DataVizBar, DataVizGroupedBar, DataVizLine, DataVizIndicator, ValueLabel, LegendSwatch, Legend, DataVizHeader, DataVizCard, DataVizTooltip,
  ColumnChart, HistogramChart, BarChart, GroupedColumnChart, StackedColumnChart, LineChart, AreaChart, PieChart, DonutChart, ScatterChart, BubbleChart,
  GaugeChart, WaterfallChart, FunnelChart, HeatmapChart, ProgressRing, EvidenceStrength,
};
