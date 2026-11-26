#!/usr/bin/env node
// Colour lint (N2 / N8, Nov 23): components use colour roles (--color-*) only.
//   node tools/color-lint.mjs          → summary and every finding
//   node tools/color-lint.mjs --summary
// Fails (exit 1) on: a primitive (--palette-*), an old element colour (--element-*) or a deprecated alias (foundations/deprecated.css, incl.
// names built at run time) used in src/components, src/gallery or demo/screens, and a colour role in tokens.css that holds a raw value instead of var() (data viz excepted until D1–D9).
// Reports (known, C3 blocker P1/P2, not failing yet): raw hex / rgb() / rgba() / hsl() colours in component files (CSS, and colour
// strings anywhere in JSX), and every use of the 5 held names (rule 11.6: --element-* held, --white-alpha-50, --white-500, --border-blue).
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src/components');
const HELD = /--element-(checkbox-off-border-pressed|radiobutton-off-border-pressed)\b/; // the circular button fills left the list with D3 (2.0.7)
const HELD_OTHER = /^--(white-alpha-50|white-500|border-blue)$/;
const { customProps } = await import(join(root, 'tools/css-tokens.mjs'));
const DEPRECATED = new Set(customProps(readFileSync(join(root, 'src/foundations/deprecated.css'), 'utf8')).map(d => d.name));
const LIVE = new Set([...customProps(readFileSync(join(root, 'src/tokens.css'), 'utf8')), ...readdirSync(join(root, 'src/foundations')).filter(f => f.endsWith('.css') && f !== 'deprecated.css')
  .flatMap(f => customProps(readFileSync(join(root, 'src/foundations', f), 'utf8')))].map(d => d.name));
// The literal pieces of every var(--…${…}…) in a line (nested braces and parentheses inside ${} are skipped).
function templatedNames(l) {
  const out = [];
  for (let i = l.indexOf('var(--'); i >= 0; i = l.indexOf('var(--', i + 1)) {
    const pieces = ['']; let j = i + 4, ok = false, holes = 0;
    while (j < l.length) {
      if (l[j] === '$' && l[j + 1] === '{') { let d = 1; j += 2; while (j < l.length && d) { if (l[j] === '{') d++; else if (l[j] === '}') d--; j++; } pieces.push(''); holes++; continue; }
      if (l[j] === ')') { ok = true; break; }
      if (!/[a-z0-9-]/.test(l[j])) break;
      pieces[pieces.length - 1] += l[j]; j++;
    }
    if (ok && holes) out.push(pieces);
  }
  return out;
}
const RAW = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g;
const out = { primitive: [], element: [], deprecated: [], role: [], raw: [], held: [] };
for (const d of customProps(readFileSync(join(root, 'src/tokens.css'), 'utf8')))
  if (/^--color-/.test(d.name) && !/^--color-data-viz-/.test(d.name) && d.value.replace(/var\([^)]*\)/g, '').match(RAW)) out.role.push(`tokens.css ${d.name}: ${d.value}`);
// Components: every check. The gallery and demo screens (F-4): the failing checks only (primitive, element, deprecated), as samples that
// people copy must use current names too; their raw colours are not counted (tooling and mock data).
const files = [...readdirSync(dir).filter(f => /\.(css|jsx?)$/.test(f)).map(f => [join(dir, f), f, true]),
  ...['src/gallery', 'demo/screens'].flatMap(d => readdirSync(join(root, d)).filter(f => /\.(css|jsx?)$/.test(f)).map(f => [join(root, d, f), `${d.split('/').pop()}/${f}`, false]))];
for (const [path, f, full] of files) {
  readFileSync(path, 'utf8').split('\n').forEach((l, i) => {
    const at = `${f}:${i + 1}`;
    for (const m of l.matchAll(/var\((--palette-[a-z0-9-]+)/g)) out.primitive.push(`${at} ${m[1]}`);
    for (const m of l.matchAll(/var\((--element-[a-z0-9-]+)/g)) (HELD.test(m[1]) ? out.held : out.element).push(`${at} ${m[1]}`);
    // A name built at run time (`var(--color-data-viz-${x}-data-${n})`, any number of pieces): flag it when the pattern only matches
    // deprecated names. A line marked deprecated-ok: (the documented compatibility path, e.g. charts.jsx dvVar) is skipped.
    if (!/deprecated-ok:/.test(l)) for (const pieces of templatedNames(l)) {
      const rx = new RegExp('^' + pieces.map(p => p.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')).join('[a-z0-9-]*') + '$');
      const all = [...DEPRECATED, ...LIVE].filter(n => rx.test(n)), dep = all.filter(n => DEPRECATED.has(n));
      if (dep.length && dep.length === all.length) out.deprecated.push(`${at} ${pieces.join('${…}')} (built at run time)`);
    }
    for (const m of l.matchAll(/var\((--[a-z0-9-]+)/g)) {
      if (HELD_OTHER.test(m[1])) out.held.push(`${at} ${m[1]}`);
      else if (DEPRECATED.has(m[1]) && !/^--element-/.test(m[1])) out.deprecated.push(`${at} ${m[1]}`);
    }
    if (!full) return;
    // Exempt: CSS masks (#000 is alpha, not a colour), flag artwork (FLAG_ART in extras.jsx), and a line marked /* raw-ok: reason */.
    if (/mask|FLAG_ART|raw-ok:/.test(l) || (f === 'extras.jsx' && /<path|<rect|<circle|fill=/.test(l))) return;
    const code = l.replace(/\/\*.*?\*\//g, '').replace(/\/\/.*$/, f.endsWith('.css') ? '' : '');
    if (/\.css$/.test(f)) for (const m of code.matchAll(RAW)) out.raw.push(`${at} ${m[0]}`);
    else for (const m of code.matchAll(/(['"`])(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\))\1|(?:rgba?|hsla?)\([\d\s.,%]+\)/g)) out.raw.push(`${at} ${m[2] || m[0]}`);
  });
}
const sum = Object.entries(out).map(([k, v]) => `${k} ${v.length}`).join(' · ');
if (!process.argv.includes('--summary')) for (const [k, v] of Object.entries(out)) if (v.length) console.log(`\n${k}:\n  ` + v.join('\n  '));
console.log(`\ncolor-lint: ${sum} (primitive, element, deprecated and role must be 0; raw is the known C3 list; held is rule 11.6)`);
process.exit(out.primitive.length || out.element.length || out.deprecated.length || out.role.length ? 1 : 0);
