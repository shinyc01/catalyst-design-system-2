import React from 'react';
import { IFS } from './registry.js';
// Shared helpers used by every family.

// Join class names, skipping falsy values.
const cx = (...a) => a.filter(Boolean).join(' ');

// Figma: Icons page (1399:9134). `name` is the Figma icon set name, `size` one of 12 | 16 | 24.
// Figma draws every size from its own artwork, so pick the nearest exported size rather than scaling.
// A few sets (cooper-*-icon, voice-input-animation) vary by state instead of size: pass `variant`.
// Directional icons point along the reading direction, so they flip in RTL (class ifs-icon--mirror; CSS in _core.css).
// Never listed: check marks, media, clocks, trend up/down, logos, up/down carets.
const MIRRORED_ICONS = new Set(['arrow-left', 'arrow-right', 'arrow-chevron-left', 'arrow-chevron-right',
  'arrow-caret-left-filled', 'arrow-caret-right-filled', 'arrow-bar-left', 'arrow-bar-right', 'arrow-back-up',
  'corner-down-left-arrow', 'corner-down-right-arrow', 'icon-arrow-down-left', 'exit-arrow-back', 'log out', 'layout-sidebar-right']);

function Icon({ name, size = 16, variant, className, style, title }) {
  const set = (window.IFS_ICONS || {})[name];
  if (!set) {
    console.warn(`[IFS] Unknown icon "${name}"`);
    return <span className={cx('ifs-icon', 'ifs-icon--missing', className)} style={{ width: size, height: size, ...style }} />;
  }
  const key = variant && set[variant] ? variant : set[size] ? size : [24, 16, 12, 25].find(s => set[s]) || Object.keys(set)[0];
  const entry = set[key];
  const svg = typeof entry === 'string' ? entry : entry.svg;
  const vb = typeof entry === 'string' ? `0 0 ${key} ${key}` : entry.vb;
  // Icons use their drawn size (12 / 16 / 24) in every density (A3, Nov 23) and follow the component's size, never a multiplier.
  // In rem (size / 16), so they still follow the user's default text size, like the text beside them.
  const dim = `${size / 16}rem`;
  return (
    <svg className={cx('ifs-icon', MIRRORED_ICONS.has(name) && 'ifs-icon--mirror', name === 'system-loader' && 'ifs-spin', className)} width={size} height={size} viewBox={vb} fill="none"
      aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} style={{ width: dim, height: dim, ...style }}
      dangerouslySetInnerHTML={{ __html: (title ? `<title>${title}</title>` : '') + svg }} />
  );
}

// A size prop given as a number is px at the default 16px text size; it comes out in rem so it follows the user's text size.
const remOf = v => (typeof v === 'number' ? `${v / 16}rem` : v);

// A motion token in ms, read from the CSS (foundations/motion.css), so JS timers follow the tokens: motionMs('--motion-duration-100').
// `fallback` is used before the stylesheet loads or outside a browser.
function motionMs(token, fallback = 0) {
  if (typeof document === 'undefined' || typeof getComputedStyle === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const n = parseFloat(v);
  return Number.isFinite(n) ? (/ms$/.test(v) ? n : /s$/.test(v) ? n * 1000 : n) : fallback;
}

// M3 exits (Nov 23): keeps a closing surface mounted for its exit time, with `leaving` true so it can take the
// .is-leaving class (foundations/motion.css), then unmounts. ms: 50 small surfaces (menu, popover, snackbar), 100 large ones
// (modal, drawer). Reduced motion keeps the time, and motion.css makes the exit a fade.
// ms: a number, or a motion token name ('--motion-duration-100').
function useExit(open, ms) {
  const [state, setState] = React.useState(open ? 'open' : 'closed');
  React.useEffect(() => {
    if (open) { setState('open'); return undefined; }
    if (state === 'closed') return undefined;
    setState('leaving');
    const t = setTimeout(() => setState('closed'), typeof ms === 'string' ? motionMs(ms, +(ms.match(/(\d+)$/) || [0, 0])[1]) : ms);
    return () => clearTimeout(t);
  }, [open]);
  return { mounted: !!open || state !== 'closed', leaving: !open && state !== 'closed' };
}
Object.assign(IFS, { Icon, cx, remOf, MIRRORED_ICONS, useExit, motionMs });
export { Icon, cx, remOf, useExit, motionMs };
