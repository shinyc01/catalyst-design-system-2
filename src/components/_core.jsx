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

// Status colours drawn into the icon artwork (status-*-filled, cooper-evidence-icon) get a class, so the fill reads a colour role
// (_core.css) and a theme can remap it (C3); the hex in the artwork stays as the fallback.
const ICON_FILL_ROLE = { '#EE3C3B': 'danger', '#FFAF2E': 'warning', '#2EBC5D': 'success', '#8366F7': 'accent-purple' }; // raw-ok: the artwork's hex, looked up to find its role
const roleFills = svg => svg.replace(/fill="(#[0-9A-Fa-f]{6})"/g, (m, h) => (ICON_FILL_ROLE[h.toUpperCase()] ? `${m} class="ifs-icon__fill--${ICON_FILL_ROLE[h.toUpperCase()]}"` : m));

// Icon artwork exported from Figma reuses fixed ids (clipPath, gradients, masks: e.g. cooper-evidence-icon's clip0_4131_18650), so a second
// instance on the page would point at the first one's defs (and draw nothing once that one is hidden or gone). Each rendered instance gets
// its own suffix on every id and on the references to it (url(#…), href="#…").
let iconUid = 0;
const uniqueIds = (svg, uid) => (svg.includes('id="') ? svg
  .replace(/\bid="([^"]+)"/g, (m, id) => `id="${id}-${uid}"`)
  .replace(/url\(#([^)]+)\)/g, (m, id) => `url(#${id}-${uid})`)
  .replace(/(xlink:)?href="#([^"]+)"/g, (m, x, id) => `${x || ''}href="#${id}-${uid}"`) : svg);

function Icon({ name, size = 16, variant, className, style, title }) {
  const uid = React.useMemo(() => `i${++iconUid}`, []);
  const set = (window.IFS_ICONS || {})[name];
  if (!set) {
    console.warn(`[IFS] Unknown icon "${name}"`);
    return <span className={cx('ifs-icon', 'ifs-icon--missing', className)} style={{ width: size, height: size, ...style }} />;
  }
  const key = variant && set[variant] ? variant : set[size] ? size : [24, 16, 12, 25].find(s => set[s]) || Object.keys(set)[0];
  const entry = set[key];
  const svg = uniqueIds(roleFills(typeof entry === 'string' ? entry : entry.svg), uid);
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
// G5 (Nov 25), rule 9.19: status messages for screen readers. Two visually hidden live regions (polite and assertive) are in the page from
// load, so a message is never lost because its region appeared together with it. announce(text) clears the region and writes the text a
// moment later, so the same message is read again. assertive only for errors that block the user's action.
const ANNOUNCE_DELAY = 50; // ms between clearing and writing, so a repeated message is announced again
const liveRegions = {};
function liveRegion(kind) {
  if (typeof document === 'undefined' || !document.body) return null;
  if (!liveRegions[kind] || !liveRegions[kind].isConnected) {
    const el = document.createElement('div');
    el.className = 'ifs-sr-only ifs-live-region';
    el.setAttribute('aria-live', kind);
    el.setAttribute('aria-atomic', 'true');
    if (kind === 'assertive') el.setAttribute('role', 'alert'); else el.setAttribute('role', 'status');
    document.body.appendChild(el);
    liveRegions[kind] = el;
  }
  return liveRegions[kind];
}
function announce(text, { assertive = false } = {}) {
  const el = liveRegion(assertive ? 'assertive' : 'polite');
  if (!el || text == null || text === '') return;
  el.textContent = '';
  setTimeout(() => { el.textContent = String(text); }, ANNOUNCE_DELAY);
}
if (typeof document !== 'undefined') {
  const mountRegions = () => { liveRegion('polite'); liveRegion('assertive'); };
  if (document.body) mountRegions(); else document.addEventListener('DOMContentLoaded', mountRegions, { once: true });
}

// G4 (Nov 25), rule 9.18: single-key shortcuts ("/" for search …) work only while focus is not in a text field, and the user can turn them off
// (a setting, remembered like density). shortcutAllowed(e) is the one check every single-key shortcut makes.
const SHORTCUT_KEY = 'catalyst-shortcuts';
function setShortcuts(v) { try { localStorage.setItem(SHORTCUT_KEY, v === 'off' ? 'off' : 'on'); } catch (e) { /* storage blocked: stays on */ } }
function getShortcuts() { try { return localStorage.getItem(SHORTCUT_KEY) === 'off' ? 'off' : 'on'; } catch (e) { return 'on'; } }
function shortcutAllowed(e) {
  if (getShortcuts() === 'off' || (e && (e.ctrlKey || e.metaKey || e.altKey))) return false;
  const a = typeof document !== 'undefined' && document.activeElement;
  if (!a) return true;
  const textInput = a.tagName === 'INPUT' && !/^(checkbox|radio|button|submit|reset|range|color|file|image)$/i.test(a.type);
  return !(a.isContentEditable || textInput || /^(textarea|select)$/i.test(a.tagName) || (a.closest && a.closest('[role=combobox],[role=textbox],[contenteditable=true]')));
}

// "/" focuses the global search (G4 convention, decided Nov 25: GitHub, Gmail, YouTube, Linear, Salesforce): never inside a text field or
// with a modifier held, and off when the user turns single-key shortcuts off (rule 9.18; USER-SETTINGS row 13). The target, first found:
// an element marked [data-global-search] (the NavBar's search button carries it; a button is clicked, a field focused), the PageTop or
// ExploreHeader search, then the first visible search field on the page.
const GLOBAL_SEARCH = ['[data-global-search]', '.ifs-page-top .ifs-smart-search__input', '.ifs-explore-header .ifs-smart-search__input',
  '.ifs-smart-search__input', '.ifs-search__input'];
function focusGlobalSearch() {
  for (const sel of GLOBAL_SEARCH) {
    const el = [...document.querySelectorAll(sel)].find(n => n.getClientRects().length && !n.disabled && !n.closest('[inert]'));
    if (!el) continue;
    if (el.matches('input, textarea, [contenteditable=true]')) el.focus(); else el.click();
    return true;
  }
  return false;
}
// The Cooper panel's shortcut (decided Nov 25, as Atlassian Rovo): Ctrl+. on Windows / Linux, ⌘+. on Mac. A modifier shortcut, so it
// works in text fields and is not switched off with the single-key ones. cooperHotkey is the text to show in tooltips and menus.
const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
const cooperHotkey = IS_MAC ? '⌘.' : 'Ctrl+.';
const isCooperShortcut = e => e.key === '.' && (IS_MAC ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey) && !e.altKey && !e.shiftKey;
if (typeof document !== 'undefined' && !IFS.__searchKey) {
  IFS.__searchKey = true;
  document.addEventListener('keydown', e => {
    if (e.key !== '/' || e.defaultPrevented || !shortcutAllowed(e)) return;
    if (focusGlobalSearch()) e.preventDefault();
  });
}

Object.assign(IFS, { Icon, cx, remOf, MIRRORED_ICONS, useExit, motionMs, announce, setShortcuts, getShortcuts, shortcutAllowed, focusGlobalSearch, cooperHotkey, isCooperShortcut });
export { Icon, cx, remOf, useExit, motionMs, announce };
