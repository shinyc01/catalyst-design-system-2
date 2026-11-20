// Entry for the single-file prototype bundle: Catalyst Design System 2.0.
// Exposes the kit as window.Catalyst, and as window.IFS so existing prototypes keep working.
// React itself comes from the page (UMD script), so prototypes and the kit share one React.
import { IFS } from './components/index.js';

IFS.version = '2.0.5';
IFS.DENSITIES = ['spacious', 'comfortable', 'compact'];
// Density is a user setting: sets data-density on <html> (or a given element) and remembers it.
IFS.setDensity = (d, el = document.documentElement) => {
  el.setAttribute('data-density', d);
  try { localStorage.setItem('catalyst-density', d); } catch (e) {}
};
IFS.getDensity = () => { try { return localStorage.getItem('catalyst-density') || 'comfortable'; } catch (e) { return 'comfortable'; } };
window.IFS = IFS;
window.Catalyst = IFS;
