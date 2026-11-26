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
const typeOf = (n, v) => /^--(color|palette)-/.test(n) ? 'color' : /^--motion-duration|^--motion-loop/.test(n) ? 'duration' : /^--motion-ease/.test(n) ? 'cubicBezier'
  : /^--font-family/.test(n) ? 'fontFamily' : /^--font-weight/.test(n) ? 'fontWeight' : /^--elevation|shadow/.test(n) ? 'shadow' : /^--z-index|density-scale/.test(n) ? 'number'
  : /^--font-(display|heading|body|label|code)-[a-z0-9-]+$/.test(n) && !/-(tracking|weight)$/.test(n) ? 'typography' : /(px|rem|ch|%)$/.test(v) || /^--(space|size|radius|border-width|font-tracking|layout|page|float)/.test(n) ? 'dimension' : undefined;
const out = {};
const put = (p, tok) => { let o = out; for (const k of p.slice(0, -1)) { if (o[k] && o[k].$value !== undefined) o[k] = { $root: o[k] }; o = o[k] = o[k] || {}; }
  const last = p[p.length - 1]; if (o[last] && o[last].$value === undefined) o[last].$root = tok; else o[last] = tok; };
const ref = v => v.replace(/var\((--[a-z0-9-]+)\)/g, (_, n) => `{${pathOf(n).filter(s => s !== '$root').join('.')}}`);
const seen = new Map();
for (const [n, e] of tokenTable(FILES.map(rd))) {
  const t = typeOf(n, e.value), tok = { $value: ref(e.value), ...(t ? { $type: t } : {}) };
  const modes = Object.entries(e.modes);
  if (modes.length) tok.$extensions = { 'com.ifs.catalyst': { modes: Object.fromEntries(modes.map(([m, v]) => [m, ref(v)])) } };
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
writeFileSync(join(root, 'dist/tokens.json'), JSON.stringify({ $description: 'Catalyst Design System 2.0 tokens (DTCG 2025.10). Colours are Dark mode. CSS name = the path with "." -> "-" (deprecated: the CSS name as given).', ...out }, null, 1) + '\n');
console.log(`tokens.json: ${seen.size} tokens, ${nd} deprecated`);
