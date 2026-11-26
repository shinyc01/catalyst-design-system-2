import React from 'react';

// Foundations: every page here is read live from the kit's own CSS (the :root and [data-density] token blocks, the
// @media breakpoint blocks and the .t-* text styles). Nothing is typed in by hand, so these pages can't drift from the
// code or contradict guide/rules.md (which says when to use each token). Values are shown for all three densities side
// by side; the toolbar density switch doesn't change them.

const DENSITIES = [['spacious', 'Spacious'], ['comfortable', 'Comfortable (default)'], ['compact', 'Compact']];

// ---------- read the stylesheets ----------
function readCss() {
  const tokens = new Map();          // name -> { density: bool }
  const media = [];                  // { min, name, value }
  const base = {};                   // name -> value in the first :root block outside @media
  const textStyles = new Set();
  const walk = (rules, cond) => {
    for (const r of rules) {
      if (r.media && r.cssRules) { walk(r.cssRules, r.media.mediaText); continue; }
      if (!r.style || !r.selectorText) continue;
      const sel = r.selectorText;
      const m = sel.match(/^\.t-[a-z0-9-]+$/);
      if (m) textStyles.add(sel.slice(1));
      if (!/(^|,)\s*(:root|html|\[data-density)/.test(sel)) continue;
      for (const p of r.style) {
        if (!p.startsWith('--')) continue;
        const t = tokens.get(p) || { density: false };
        if (sel.includes('data-density')) t.density = true;
        tokens.set(p, t);
        const min = cond && cond.match(/min-width:\s*(\d+)px/);
        if (min) media.push({ min: +min[1], name: p, value: r.style.getPropertyValue(p).trim() });
        else if (!cond && !(p in base) && /:root/.test(sel)) base[p] = r.style.getPropertyValue(p).trim();
      }
    }
  };
  for (const s of document.styleSheets) { try { walk(s.cssRules, null); } catch (e) { /* cross-origin sheet (fonts) */ } }
  return { tokens, media, base, textStyles: [...textStyles].sort() };
}
let CSS = null;
const css = () => (CSS || (CSS = readCss()));
const names = re => [...css().tokens.keys()].filter(n => re.test(n)).sort(natural);
const natural = (a, b) => a.localeCompare(b, 'en', { numeric: true });

// ---------- measuring ----------
// A hidden probe per density: custom properties resolve there, and a box sized by the token gives its px value.
function useMeasure(list, prop = 'width') {
  const refs = React.useRef({});
  const [vals, setVals] = React.useState({});
  React.useLayoutEffect(() => {
    const out = {};
    for (const [d] of DENSITIES) {
      const host = refs.current[d]; if (!host) continue;
      const cs = getComputedStyle(host);
      out[d] = {};
      for (const n of list) {
        const probe = host.querySelector(`[data-n="${n}"]`);
        out[d][n] = { raw: cs.getPropertyValue(n).trim(), px: probe ? Math.round(probe.getBoundingClientRect()[prop] * 100) / 100 : null };
      }
    }
    setVals(out);
  }, [list.join()]);
  const probes = DENSITIES.map(([d]) => (
    <div key={d} data-density={d} ref={el => { refs.current[d] = el; }} aria-hidden="true"
      style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', insetInlineStart: 0, top: 0 }}>
      {list.map(n => <div key={n} data-n={n} style={{ [prop]: `var(${n})`, flex: 'none' }} />)}
    </div>
  ));
  return [vals, probes];
}

// ---------- shared bits ----------
const Page = ({ title, intro, children }) => (
  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'var(--space-section)', color: 'var(--color-text)', maxWidth: 'var(--layout-max-content-width)' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-200)' }}>
      <h2 className="t-heading-h2-medium" style={{ margin: 0 }}>{title}</h2>
      <p className="t-body-m-regular" style={{ margin: 0, color: 'var(--color-text-soft)', maxWidth: '80ch' }}>{intro} Read live from the kit's CSS. When to use each token: <code className="t-code-m-regular">guide/rules.md</code>.</p>
    </div>
    {children}
  </div>
);
const Group = ({ title, note, children, open = true }) => (
  <details open={open} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-stack)' }}>
    <summary className="t-heading-h3-medium" style={{ cursor: 'pointer', marginBottom: 'var(--space-stack)' }}>{title}</summary>
    {note && <p className="t-body-m-regular" style={{ margin: '0 0 var(--space-stack)', color: 'var(--color-text-soft)' }}>{note}</p>}
    {children}
  </details>
);
const cell = { padding: 'var(--space-200) var(--space-300)', borderBottom: 'var(--border-width-100) solid var(--color-border-soft)', textAlign: 'start', verticalAlign: 'middle' };
const Table = ({ head, rows }) => (
  <div style={{ overflowX: 'auto' }} tabIndex={0} role="region" aria-label="Token table">
    <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
      <thead><tr>{head.map((h, i) => <th key={i} className="t-label-m-medium" style={{ ...cell, color: 'var(--color-text-soft)' }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j === 0 ? 't-code-m-regular' : 't-body-m-regular'} style={cell}>{c}</td>)}</tr>)}</tbody>
    </table>
  </div>
);
const px = v => (v == null ? '—' : `${v}`);
const Bar = ({ n, d }) => (
  <div data-density={d} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)' }}>
    <span style={{ display: 'block', inlineSize: `var(${n})`, blockSize: 'var(--size-8)', background: 'var(--color-text-soft)', borderRadius: 'var(--radius-100)', flex: 'none' }} />
  </div>
);

// ---------- Colour ----------
function ColourPage() {
  const all = names(/^--/);
  const [vals, probes] = useMeasure(all);
  const c = vals.comfortable || {};
  const isColour = n => /^(#|rgb|hsl|transparent|color\()/i.test((c[n] || {}).raw || '');
  const colours = all.filter(isColour);
  const fam = n => { const p = n.slice(2).split('-'); return p[0] === 'element' || p[0] === 'background' || p[0] === 'data' ? `${p[0]}-${p[1]}` : p[0]; };
  const groups = {};
  colours.forEach(n => { (groups[fam(n)] = groups[fam(n)] || []).push(n); });
  const first = ['surface', 'text', 'border', 'icon', 'focus', 'overlay'];
  const tier = g => { const i = first.indexOf(g); return i >= 0 ? i : g.startsWith('background') ? 10 : g.startsWith('element') ? 30 : /^(data|collaboration)/.test(g) ? 40 : 20; };
  const order = Object.keys(groups).sort((a, b) => (tier(a) - tier(b)) || natural(a, b));
  return (
    <Page title="Colour" intro={`${colours.length} colour tokens, grouped by family. Dark mode (the only theme today).`}>
      {probes}
      {order.map((g, i) => (
        <Group key={g} title={`${g} (${groups[g].length})`} open={i < 8}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))', gap: 'var(--space-stack)' }}>
            {groups[g].map(n => (
              <div key={n} style={{ display: 'flex', gap: 'var(--space-300)', alignItems: 'center', minWidth: 0 }}>
                <span style={{ flex: 'none', inlineSize: 'var(--size-40)', blockSize: 'var(--size-40)', borderRadius: 'var(--radius-100)', background: `var(${n})`, boxShadow: 'inset 0 0 0 var(--border-width-100) var(--color-border-soft)' }} />
                <span style={{ minWidth: 0 }}>
                  <span className="t-code-s-regular" style={{ display: 'block', overflowWrap: 'anywhere' }}>{n}</span>
                  <span className="t-body-s-regular" style={{ color: 'var(--color-text-softer)' }}>{(c[n] || {}).raw}</span>
                </span>
              </div>
            ))}
          </div>
        </Group>
      ))}
    </Page>
  );
}

// ---------- Typography ----------
function TypePage() {
  const styles = css().textStyles;
  const utility = ['t-measure', 't-numeric', 't-truncate'];
  const rank = s => ['t-display', 't-heading', 't-label', 't-body', 't-caption', 't-code'].findIndex(p => s.startsWith(p));
  const size = s => ['-l', '-h1', '-h2', '-h3', '-h4', '-m', '-s'].findIndex(p => s.includes(p + '-') || s.endsWith(p));
  const list = styles.filter(s => !utility.includes(s)).sort((a, b) => (rank(a) - rank(b)) || (size(a) - size(b)) || natural(a, b));
  const refs = React.useRef({});
  const [m, setM] = React.useState({});
  React.useLayoutEffect(() => {
    const out = {};
    for (const s of list) for (const [d] of DENSITIES) {
      const el = refs.current[`${s}|${d}`]; if (!el) continue;
      const cs = getComputedStyle(el);
      out[`${s}|${d}`] = `${parseFloat(cs.fontSize)} / ${parseFloat(cs.lineHeight) || cs.lineHeight} · ${cs.fontWeight}`;
    }
    setM(out);
  }, []);
  const retired = s => /upper/.test(s);
  return (
    <Page title="Typography" intro="Every text style class (.t-*) in each density: size / line height · weight. Weights and letter-spacing are the same in every density; sizes step with density.">
      <Table head={['Style', ...DENSITIES.map(d => d[1])]} rows={list.map(s => [
        <span>.{s}{retired(s) && <span className="t-body-s-regular" style={{ color: 'var(--color-text-softer)' }}> · retired, don't use (no uppercase text)</span>}</span>,
        ...DENSITIES.map(([d]) => (
          <div data-density={d} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-100)' }}>
            <span ref={el => { refs.current[`${s}|${d}`] = el; }} className={s}>Whistler Group</span>
            <span className="t-body-s-regular" style={{ color: 'var(--color-text-softer)' }}>{m[`${s}|${d}`] || ''}</span>
          </div>
        )),
      ])} />
      <Group title="Helpers" note="Utility classes that don't set a style.">
        <Table head={['Class', 'What it does']} rows={[['.t-numeric', 'Tabular figures for numbers people compare (rule 2.11)'], ['.t-truncate', 'One line with an ellipsis'], ['.t-measure', 'Caps line length for reading']]} />
      </Group>
    </Page>
  );
}

// ---------- Spacing and sizes (density tables) ----------
function DensityTable({ list, bars = true }) {
  const [vals, probes] = useMeasure(list);
  return (
    <>
      {probes}
      <Table head={['Token', ...DENSITIES.map(d => d[1])]} rows={list.map(n => [n, ...DENSITIES.map(([d]) => {
        const v = (vals[d] || {})[n] || {};
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-300)' }}>
            {bars && v.px > 0 && <Bar n={n} d={d} />}
            <span className="t-body-m-regular">{px(v.px)}</span>
          </div>
        );
      })])} />
    </>
  );
}
const roleOrder = ['--space-inset', '--space-inset-l', '--space-table-x', '--space-stack', '--space-section'];
function SpacingPage() {
  const roles = roleOrder.filter(n => css().tokens.has(n));
  const scale = names(/^--space-\d+$/);
  const deprecated = names(/^--(gaps|paddings|margins|gutters|spacing)-/);
  return (
    <Page title="Spacing" intro="Roles first (use these), then the scale they are built from. px per density.">
      <Group title="Roles"><DensityTable list={roles} /></Group>
      <Group title="Scale"><DensityTable list={scale} /></Group>
      <Group title={`Deprecated aliases (${deprecated.length})`} note="Kept so old screens keep working; use the role or scale step instead." open={false}><DensityTable list={deprecated} bars={false} /></Group>
    </Page>
  );
}
function SizesPage() {
  const comp = names(/^--(control-h|badge-h|tab-h|nav-row-h|table-row-h|table-header-h|target-min)/);
  const scale = names(/^--size-\d+$/);
  return (
    <Page title="Sizes" intro="Component heights that follow density, then the size scale. px per density.">
      <Group title="Component heights"><DensityTable list={comp} /></Group>
      <Group title="Size scale"><DensityTable list={scale} /></Group>
    </Page>
  );
}

// ---------- Layout ----------
function LayoutPage() {
  const { media, base: baseDecl } = css();
  const keys = ['--layout-columns', '--page-margin', '--page-gap'];
  const steps = [0, ...new Set(media.filter(m => keys.includes(m.name)).map(m => m.min))].sort((a, b) => a - b);
  // value at each breakpoint: the last @media block at or below it, else the base value
  const cs = getComputedStyle(document.documentElement);
  const resolve = v => { const m = /^var\((--[a-z0-9-]+)\)$/.exec(v); return m ? resolve(cs.getPropertyValue(m[1]).trim()) : v; };
  const toPx = v => { const r = /^([\d.]+)rem$/.exec(v); return r ? +r[1] * 16 : v; };
  const at = (k, w) => {
    const hits = media.filter(m => m.name === k && m.min <= w).sort((a, b) => a.min - b.min);
    return toPx(resolve(hits.length ? hits[hits.length - 1].value : baseDecl[k]));
  };
  const widths = names(/^--(region-|overlay-width-|layout-max|layout-content-min|layout-side-panel|bp-)/);
  const [w, wProbes] = useMeasure(widths);
  return (
    <Page title="Layout" intro="Breakpoints and the page grid by screen width (rule 3.13), then the fixed panel and overlay widths.">
      {wProbes}
      <Group title="Breakpoints and grid">
        <Table head={['From width', 'Columns', 'Page margin', 'Gutter (page gap)']} rows={steps.map((s, i) => [
          `${s}${i < steps.length - 1 ? `–${steps[i + 1] - 1}` : '+'}`,
          ...keys.map(k => String(at(k, s))),
        ])} />
      </Group>
      <Group title="Fixed widths" note="Panels, overlays and caps don't change with density.">
        <Table head={['Token', 'px']} rows={widths.map(n => [n, px(((w.comfortable || {})[n] || {}).px) || ((w.comfortable || {})[n] || {}).raw])} />
      </Group>
    </Page>
  );
}

// ---------- Shape and effects ----------
function ShapePage() {
  const radius = names(/^--radius-/);
  const borders = names(/^--border-widths-/);
  const [vals, probes] = useMeasure([...radius, ...borders]);
  const shadows = names(/^--(shadow|drop-shadow|inner-shadow|elevation)/);
  const blur = names(/^--blur/);
  const z = names(/^--z-/);
  const motion = names(/^--(duration|ease|motion)/);
  const raw = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const v = n => ((vals.comfortable || {})[n] || {}).px;
  return (
    <Page title="Shape and effects" intro="Radius, border widths, shadows, blur, layering and motion. These don't change with density.">
      {probes}
      <Group title="Radius">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-500)' }}>
          {radius.map(n => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-200)', alignItems: 'flex-start' }}>
              <span style={{ inlineSize: 'var(--size-64)', blockSize: 'var(--size-64)', borderRadius: `var(${n})`, background: 'var(--color-surface-tertiary)', boxShadow: 'inset 0 0 0 var(--border-width-100) var(--color-border-soft)' }} />
              <span className="t-code-s-regular">{n}</span><span className="t-body-s-regular" style={{ color: 'var(--color-text-softer)' }}>{px(v(n))}</span>
            </div>
          ))}
        </div>
      </Group>
      <Group title="Border widths"><Table head={['Token', 'px']} rows={borders.map(n => [n, px(v(n))])} /></Group>
      <Group title="Shadows">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))', gap: 'var(--space-500)' }}>
          {shadows.map(n => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-200)' }}>
              <span style={{ blockSize: 'var(--size-64)', borderRadius: 'var(--radius-200)', background: 'var(--color-surface-secondary)', boxShadow: `var(${n})` }} />
              <span className="t-code-s-regular">{n}</span><span className="t-body-s-regular" style={{ color: 'var(--color-text-softer)', overflowWrap: 'anywhere' }}>{raw(n)}</span>
            </div>
          ))}
        </div>
      </Group>
      {blur.length > 0 && <Group title="Blur"><Table head={['Token', 'Value']} rows={blur.map(n => [n, raw(n)])} /></Group>}
      {z.length > 0 && <Group title="Layers (z-index)"><Table head={['Token', 'Value']} rows={z.sort((a, b) => (+raw(a) || 0) - (+raw(b) || 0)).map(n => [n, raw(n)])} /></Group>}
      {motion.length > 0 && <Group title="Motion"><Table head={['Token', 'Value']} rows={motion.map(n => [n, raw(n)])} /></Group>}
    </Page>
  );
}

export default {
  title: 'Foundations',
  parameters: { layout: 'padded', controls: { disable: true }, actions: { disable: true }, docs: { disable: true } },
};
export const Colour = { render: () => <ColourPage /> };
export const Typography = { render: () => <TypePage /> };
export const Spacing = { render: () => <SpacingPage /> };
export const Sizes = { render: () => <SizesPage /> };
export const Layout = { render: () => <LayoutPage /> };
export const ShapeAndEffects = { name: 'Shape and effects', render: () => <ShapePage /> };
