#!/usr/bin/env node
// Writes guide/words.md from guide/words.json (the word list, rule 8.43). Edit the JSON, then run this.
//   node tools/gen-words.mjs          → guide/words.md
//   node tools/gen-words.mjs --check  → exit 1 when words.md is out of date
// build.mjs copies both files to dist/.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'guide/words.json');
const out = join(root, 'guide/words.md');
const w = JSON.parse(readFileSync(src, 'utf8'));
const cell = s => String(s || '').replace(/\|/g, '\\|');
const list = a => (a && a.length ? a.map(cell).join(', ') : '—');

const md = [
  `# Catalyst Design System ${w.version} — word list`,
  '',
  `Generated from \`words.json\` by \`tools/gen-words.mjs\` (${w.updated}); edit the JSON, not this file. Rules: [rules.md](rules.md) section 8 (rule 8.9 is the summary, rule 8.43 how to use this list).`,
  '',
  w.about,
  '',
  '**Organisation settings that change words**',
  ...w.settings.map(s => `- ${s.name} (a user setting, README → User settings): ${s.values.join(' or ')}, default ${s.default}. ${s.notes}`),
  '',
  '## 1. Terms',
  '',
  '| Term | Definition (= hint-tooltip text) | Don\'t use | Notes | Rule | Definition confirmed |',
  '|---|---|---|---|---|---|',
  ...w.terms.map(t => `| ${cell(t.term)} | ${cell(t.definition)} | ${list(t.avoid)} | ${cell(t.notes) || '—'} | ${t.rule} | ${t.confirmed ? 'yes' : 'not yet (product owner)'} |`),
  '',
  '## 2. UI verbs (rules 8.10–8.12)',
  '',
  '| Use | For | Don\'t use | Rule |',
  '|---|---|---|---|',
  ...w.verbs.map(v => `| ${cell(v.use)} | ${cell(v.for)}${v.notes ? `. ${cell(v.notes)}` : ''} | ${list(v.avoid)} | ${v.rule} |`),
  '',
  '## 3. Words we don\'t use',
  '',
  '| Don\'t use | Use instead | Rule |',
  '|---|---|---|',
  ...w.banned.map(b => `| ${cell(b.avoid)} | ${cell(b.use)} | ${b.rule} |`),
  '',
].join('\n');

if (process.argv.includes('--check')) {
  const cur = readFileSync(out, 'utf8');
  if (cur !== md) { console.error('guide/words.md is out of date: run node tools/gen-words.mjs'); process.exit(1); }
  console.log('guide/words.md is up to date');
} else {
  writeFileSync(out, md);
  console.log(`Wrote guide/words.md (${w.terms.length} terms, ${w.terms.filter(t => !t.confirmed).length} definitions not confirmed, ${w.verbs.length} verbs, ${w.banned.length} words we don't use)`);
}
