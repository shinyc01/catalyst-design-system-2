#!/usr/bin/env node
// Colour lint (N2 / N8, Nov 23): components use colour roles (--color-*) only.
//   node tools/color-lint.mjs          → summary and every finding
//   node tools/color-lint.mjs --summary
// Fails (exit 1) on: a primitive (--palette-*) or an old element colour (--element-*) used in src/components.
// Reports (known, C3 blocker P1/P2, not failing yet): raw hex / rgb() / rgba() colours in component files.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src/components');
const HELD = /--element-(checkbox-off-border-pressed|radiobutton-off-border-pressed|button-circular-fill-(default|hover|pressed))\b/;
const out = { primitive: [], element: [], raw: [] };
for (const f of readdirSync(dir).filter(f => /\.(css|jsx?)$/.test(f))) {
  readFileSync(join(dir, f), 'utf8').split('\n').forEach((l, i) => {
    const at = `${f}:${i + 1}`;
    for (const m of l.matchAll(/var\((--palette-[a-z0-9-]+)/g)) out.primitive.push(`${at} ${m[1]}`);
    for (const m of l.matchAll(/var\((--element-[a-z0-9-]+)/g)) if (!HELD.test(m[1])) out.element.push(`${at} ${m[1]}`);
    if (/\.css$/.test(f) || /style|color|fill|stroke/i.test(l)) for (const m of l.replace(/\/\*.*?\*\//g, '').matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g)) out.raw.push(`${at} ${m[0]}`);
  });
}
const sum = Object.entries(out).map(([k, v]) => `${k} ${v.length}`).join(' · ');
if (!process.argv.includes('--summary')) for (const [k, v] of Object.entries(out)) if (v.length) console.log(`\n${k}:\n  ` + v.join('\n  '));
console.log(`\ncolor-lint: ${sum} (primitive and element must be 0; raw is the known C3 list)`);
process.exit(out.primitive.length || out.element.length ? 1 : 0);
