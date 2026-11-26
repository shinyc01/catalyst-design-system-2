// Entry for the single-file prototype bundle: Catalyst Design System 2.0.
// Exposes the kit as window.Catalyst, and as window.IFS so existing prototypes keep working.
// React itself comes from the page (UMD script), so prototypes and the kit share one React.
import { IFS } from './components/index.js';

IFS.version = '2.0.7';
IFS.DENSITIES = ['spacious', 'comfortable', 'compact'];
// Theme (C3, Nov 23): sets data-theme on <html> (or a given element). Only Dark has values today; Light comes right after phase 1.
IFS.setTheme = (t, el = document.documentElement) => { el.setAttribute('data-theme', t); return t; };
// Density is a user setting: sets data-density on <html> (or a given element) and remembers it.
IFS.setDensity = (d, el = document.documentElement) => {
  el.setAttribute('data-density', d);
  try { localStorage.setItem('catalyst-density', d); } catch (e) {}
};
IFS.getDensity = () => { try { return localStorage.getItem('catalyst-density') || 'comfortable'; } catch (e) { return 'comfortable'; } };
// Direction follows the product language (Arabic = 'rtl'): sets dir on <html> (or a given element). Not remembered:
// the page's language decides it. Layout mirrors through start/end CSS (rule 11.4); directional icons flip.
IFS.DIRECTIONS = ['ltr', 'rtl'];
IFS.setDirection = (d, el = document.documentElement) => { el.setAttribute('dir', d === 'rtl' ? 'rtl' : 'ltr'); };
IFS.getDirection = (el = document.documentElement) => (el.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr');
// Lite glass (G3, Nov 25; USER-SETTINGS row 12): 'lite' drops the glass blur from 80 to 10 (low-end machines, remote desktops); fills stay
// the same. Sets data-glass on <html> (or a given element) and remembers it, like density.
IFS.GLASS = ['full', 'lite'];
IFS.setGlass = (g, el = document.documentElement) => {
  if (g === 'lite') el.setAttribute('data-glass', 'lite'); else el.removeAttribute('data-glass');
  try { localStorage.setItem('catalyst-glass', g === 'lite' ? 'lite' : 'full'); } catch (e) {}
};
IFS.getGlass = () => { try { return localStorage.getItem('catalyst-glass') === 'lite' ? 'lite' : 'full'; } catch (e) { return 'full'; } };
// Good vs bad colours (Nov 26; USER-SETTINGS row 14): the organisation sets the default and each person may override it (someone with
// red-green colour blindness can go back to azure-rose when the admin chose red-green). setOrgDiverging(pair): the product calls it on load with
// the organisation's choice; it applies only while the person has no choice of their own. setDiverging(pair): the person's choice, remembered;
// setDiverging(null) clears it and goes back to the organisation's. 'red-green' sets data-diverging on <html>; 'azure-rose' (default) removes it.
IFS.DIVERGING = ['azure-rose', 'red-green'];
const applyDiverging = (pair, el = document.documentElement) => { if (pair === 'red-green') el.setAttribute('data-diverging', 'red-green'); else el.removeAttribute('data-diverging'); };
let orgDiverging = 'azure-rose';
const ownDiverging = () => { try { const v = localStorage.getItem('catalyst-diverging'); return IFS.DIVERGING.includes(v) ? v : null; } catch (e) { return null; } };
IFS.setOrgDiverging = (pair, el) => { orgDiverging = pair === 'red-green' ? 'red-green' : 'azure-rose'; applyDiverging(ownDiverging() || orgDiverging, el); };
IFS.setDiverging = (pair, el) => {
  try { if (IFS.DIVERGING.includes(pair)) localStorage.setItem('catalyst-diverging', pair); else localStorage.removeItem('catalyst-diverging'); } catch (e) {}
  applyDiverging(ownDiverging() || (IFS.DIVERGING.includes(pair) ? pair : orgDiverging), el);
};
IFS.getDiverging = (el = document.documentElement) => (el.getAttribute('data-diverging') === 'red-green' ? 'red-green' : 'azure-rose');
// Base map (G3): which kind of map the screen shows, for map glass on surfaces outside the map container (snackbars over a map).
// 'dark' | 'light' | 'imagery' sets data-base-map on <html>; null removes it when the map screen closes.
IFS.setBaseMap = (kind, el = document.documentElement) => { if (kind) el.setAttribute('data-base-map', kind); else el.removeAttribute('data-base-map'); };
// The stored glass choice is applied when the kit loads (rule 4.2: lite glass is remembered).
if (typeof document !== 'undefined' && IFS.getGlass() === 'lite' && !document.documentElement.hasAttribute('data-glass')) IFS.setGlass('lite');
// A person's own good vs bad choice is applied when the kit loads (it wins over the organisation's).
if (typeof document !== 'undefined' && ownDiverging()) applyDiverging(ownDiverging());
window.IFS = IFS;
window.Catalyst = IFS;
