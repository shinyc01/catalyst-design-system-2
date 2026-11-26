#!/usr/bin/env node
// Writes dist/tokens.json: every token in the DTCG 2025.10 format (https://www.designtokens.org/tr/2025.10/format/), for the other product.
//   node tools/gen-tokens-json.mjs   (also run by tools/gen-api.mjs)
// - Groups follow the Figma path (tools/figma/rename-map.tsv), else the CSS name split at its type word.
// - $value: a reference "{color.text.soft}" when the CSS is var(--x), else the CSS value (composite values stay CSS strings).
// - Density (Spacious / Compact), breakpoint, RTL and state values: $extensions["com.ifs.catalyst"].modes. Dark is the only colour mode today.
// - Every old name is a token with $deprecated (removed in 3.0) pointing at its new name.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tokenTable, customProps } from './css-tokens.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rd = f => readFileSync(join(root, f), 'utf8');
const FILES = ['src/foundations/palette.css', 'src/tokens.css', 'src/foundations/spacing.css', 'src/foundations/motion.css', 'src/foundations/layout.css', 'src/foundations/typography.css'];
const rows = rd('tools/figma/rename-map.tsv').trim().split('\n').slice(1).map(l => l.split('\t'));
const figOf = new Map(rows.filter(r => /^--/.test(r[4]) && /\//.test(r[3]) && !/^\(/.test(r[3])).map(r => [r[4], r[3]]));
const TYPES = ['border-width', 'z-index', 'font-size', 'font-weight', 'font-tracking', 'font-family', 'inner-shadow', 'drop-shadow'];
const pathOf = n => { const f = figOf.get(n); if (f) return f.split('/').map(s => s.replace(/[{}.$]/g, '-'));
  const s = n.slice(2); const t = TYPES.find(t => s.startsWith(t + '-')) || s.split('-')[0]; return [t, s.slice(t.length + 1) || '$root']; };
// $type (T3-6): counts are numbers; *-filter tokens hold a CSS drop-shadow() filter, not a DTCG shadow, so they get no $type and say so in
// $extensions; the focus rings are box-shadows; calc() layout names are dimensions.
const NUMBER = /^--(layout-columns|panel-cols|motion-end|z-index|density-scale)/;
const isFilter = n => /-filter$|^--effect-/.test(n);
const CSS_ONLY = { '--font-numeric': 'font-variant-numeric' }; // no DTCG type; the CSS property it feeds
const typeOf = (n, v) => isFilter(n) ? undefined : NUMBER.test(n) ? 'number' : /^--focus-ring/.test(n) ? 'shadow' : /^--(color|palette)-/.test(n) ? 'color' : /^--motion-duration|^--motion-loop/.test(n) ? 'duration' : /^--motion-ease/.test(n) ? 'cubicBezier'
  : /^--font-family/.test(n) ? 'fontFamily' : /^--font-weight/.test(n) ? 'fontWeight' : /^--elevation|shadow/.test(n) ? 'shadow' : /^--font-numeric$/.test(n) ? undefined
  : /^--font-(display|heading|body|label|code)-[a-z0-9-]+$/.test(n) && !/-(tracking|weight)$/.test(n) ? 'typography' : /(px|rem|ch|%)$/.test(v) || /^--(space|size|radius|border-width|font-tracking|layout|page|float|region|table-col|cooper-compact|span-|slot-)/.test(n) || /^(calc|min|max|clamp)\(/.test(v) ? 'dimension' : undefined;
const out = {};
const put = (p, tok) => { let o = out; for (const k of p.slice(0, -1)) { if (o[k] && o[k].$value !== undefined) o[k] = { $root: o[k] }; o = o[k] = o[k] || {}; }
  const last = p[p.length - 1]; if (o[last] && o[last].$value === undefined) o[last].$root = tok; else o[last] = tok; };
const ref = v => v.replace(/var\((--[a-z0-9-]+)\)/g, (_, n) => `{${pathOf(n).filter(s => s !== '$root').join('.')}}`);
const seen = new Map();
for (const [n, e] of tokenTable(FILES.map(rd))) {
  const t = typeOf(n, e.value), tok = { $value: ref(e.value), ...(t ? { $type: t } : {}) };
  const modes = Object.entries(e.modes), ext = {};
  if (modes.length) ext.modes = Object.fromEntries(modes.map(([m, v]) => [m, ref(v)]));
  if (isFilter(n)) ext.css = 'filter';
  if (CSS_ONLY[n]) ext.css = CSS_ONLY[n];
  if (Object.keys(ext).length) tok.$extensions = { 'com.ifs.catalyst': ext };
  seen.set(n, tok);
}
for (const [n, t] of seen) put(pathOf(n), t);
// deprecated aliases
const dep = rd('src/foundations/deprecated.css');
let nd = 0;
const depMap = new Map(customProps(dep).map(d => [d.name, (d.value.match(/^var\((--[a-z0-9-]+)\)$/) || [])[1]]).filter(d => d[1]));
const finalOf = n => { const seen = new Set(); while (depMap.has(n) && !seen.has(n)) { seen.add(n); n = depMap.get(n); } return n; }; // straight to a current name
for (const d of customProps(dep)) {
  const m = [, d.name, finalOf((d.value.match(/^var\((--[a-z0-9-]+)\)$/) || [])[1])]; if (!m[2]) continue;
  const target = `{${pathOf(m[2]).filter(s => s !== '$root').join('.')}}`;
  put(['deprecated', m[1].slice(2)], { $value: target, $deprecated: `Use ${target} (CSS ${m[2]}). Old name ${m[1]} is removed in 3.0.` }); nd++;
}
// T3-1: a reference to a node that became a group (a token that later got children, so it sits under $root) must name the $root token:
// {color.text} -> {color.text.$root} (DTCG 2025.10 root tokens). Applied to every string: $value, $deprecated and the modes.
const nodeAt = p => p.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), out);
const fixRef = s => s.replace(/\{([^{}]+)\}/g, (m, p) => { const n = nodeAt(p); return n && n.$value === undefined && n.$root ? `{${p}.$root}` : m; });
const walk = (o, f) => { for (const [k, v] of Object.entries(o)) { if (typeof v === 'string') o[k] = f(v); else if (v && typeof v === 'object') walk(v, f); } };
walk(out, fixRef);
// Check: every {…} reference resolves to a node with $value; the run fails otherwise.
const broken = [];
walk(out, s => { for (const [, p] of s.matchAll(/\{([^{}]+)\}/g)) { const n = nodeAt(p); if (!n || n.$value === undefined) broken.push(p); } return s; });
if (broken.length) { console.error(`tokens.json: ${broken.length} references don't resolve: ${[...new Set(broken)].slice(0, 20).join(', ')}`); process.exit(1); }
writeFileSync(join(root, 'dist/tokens.json'), JSON.stringify({ $description: 'Catalyst Design System 2.0 tokens, DTCG-style (the 2025.10 file structure: groups, $value, $type, {alias} references, $deprecated, $extensions). Values are CSS strings (e.g. "1rem", "50ms", the CSS font shorthand, calc()), not 2025.10 value objects: lenient importers (Tokens Studio, Style Dictionary) read it as is; a strict 2025.10 importer needs a value transform. Colours are Dark mode. CSS name = the path with "." -> "-" (deprecated: the CSS name as given).', ...out }, null, 1) + '\n');
console.log(`tokens.json: ${seen.size} tokens, ${nd} deprecated, every reference resolves`);
