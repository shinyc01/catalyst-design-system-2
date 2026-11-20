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
  // Icons follow density: --icon-scale (1.143 / 1 / 0.857, like body text), rounded to even px: 16 -> 18 / 16 / 14.
  // In rem (size / 16), so icons also grow with the user's default text size, like the text beside them.
  const dim = `round(calc(${size / 16}rem * var(--icon-scale, 1)), 2px)`;
  return (
    <svg className={cx('ifs-icon', MIRRORED_ICONS.has(name) && 'ifs-icon--mirror', className)} width={size} height={size} viewBox={vb} fill="none"
      aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} style={{ width: dim, height: dim, ...style }}
      dangerouslySetInnerHTML={{ __html: (title ? `<title>${title}</title>` : '') + svg }} />
  );
}

// A size prop given as a number is px at the default 16px text size; it comes out in rem so it follows the user's text size.
const remOf = v => (typeof v === 'number' ? `${v / 16}rem` : v);

Object.assign(IFS, { Icon, cx, remOf, MIRRORED_ICONS });
export { Icon, cx, remOf };
