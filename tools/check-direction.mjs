#!/usr/bin/env node
// Counts physical left/right CSS in components (RTL readiness). Rule (Nov 19, 2026): new code uses start/end
// (margin-inline-start, padding-inline-end, inset-inline-start, border-inline-*, text-align:start/end), never left/right.
//   node tools/check-direction.mjs            → totals per file
//   node tools/check-direction.mjs --list     → every line
// Allowed: geometry that must not mirror (charts' time axes, canvas coordinates) with a "/* ltr: reason */" comment on the line.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src/components');
const re = /(margin|padding|border)-(left|right)\b|(^|[;{\s])(left|right)\s*:|text-align\s*:\s*(left|right)|float\s*:\s*(left|right)/;
const jsxRe = /\b(marginLeft|marginRight|paddingLeft|paddingRight|borderLeft|borderRight)\b|[{,]\s*(left|right)\s*:/;
const list = process.argv.includes('--list');
let total = 0; const rows = [];
for (const f of readdirSync(dir).filter(f => /\.(css|jsx)$/.test(f))) {
  const lines = readFileSync(join(dir, f), 'utf8').split('\n');
  let n = 0;
  lines.forEach((l, i) => { if ((f.endsWith('.css') ? re : jsxRe).test(l) && !/ltr:/.test(l)) { n++; if (list) console.log(`${f}:${i + 1}: ${l.trim().slice(0, 140)}`); } });
  if (n) rows.push([f, n]); total += n;
}
if (!list) { rows.sort((a, b) => b[1] - a[1]).forEach(([f, n]) => console.log(String(n).padStart(4), f)); }
console.log(`\n${total} physical left/right declarations left (target 0, or marked /* ltr: reason */).`);
