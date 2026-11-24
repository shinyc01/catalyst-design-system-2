// Reads every custom property declaration from a CSS file, with the blocks it sits in.
// Used by tools/gen-tokens-json.mjs (dist/tokens.json) and tools/gen-api.mjs (dist/tokens.txt).
// A small tokenizer, not a regex: it keeps the last declaration of a block when it has no trailing ";",
// follows nested blocks (@media { :root { … } }) and ignores ";" and "{" inside strings and brackets.
export function customProps(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [], stack = [];
  let buf = '', depth = 0, quote = null;
  const flush = () => {
    const m = buf.match(/^\s*(--[a-zA-Z0-9-]+)\s*:([\s\S]*)$/);
    if (m && stack.length) out.push({ name: m[1], value: m[2].trim().replace(/\s+/g, ' '), ctx: [...stack] });
    buf = '';
  };
  for (const ch of css) {
    if (quote) { buf += ch; if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; buf += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (depth > 0) { buf += ch; continue; }
    if (ch === '{') { stack.push(buf.trim().replace(/\s+/g, ' ')); buf = ''; continue; }
    if (ch === ';') { flush(); continue; }
    if (ch === '}') { flush(); stack.pop(); continue; }
    buf += ch;
  }
  return out;
}

// The mode a declaration belongs to, or null for the base value.
// :root / :root,[data-density="comfortable"] = base · [data-density="x"] = x · @media (x) = x · [dir="rtl"] = rtl
// · any other selector (e.g. .ifs-slots.has-right) = that selector.
export function modeOf(ctx) {
  const parts = [];
  for (const sel of ctx) {
    if (/^@media/.test(sel)) { const q = sel.replace(/^@media\s*/, ''); parts.push(/^\([^()]*\)$/.test(q) ? q.slice(1, -1) : q); continue; }
    if (/^@/.test(sel)) { parts.push(sel); continue; }
    if (/^:root$/.test(sel) || /^:root\s*,\s*\[data-density="comfortable"\]$/.test(sel)) continue;
    const d = sel.match(/^\[data-density="(\w+)"\]$/); if (d) { parts.push(d[1]); continue; }
    const r = sel.match(/^\[dir="(\w+)"\]$/); if (r) { parts.push(r[1]); continue; }
    parts.push(sel);
  }
  return parts.length ? parts.join(' ') : null;
}

// name -> { value (first declaration), ctx, modes: { mode: value } }
export function tokenTable(cssList) {
  const t = new Map();
  for (const css of cssList) for (const d of customProps(css)) {
    const mode = modeOf(d.ctx);
    if (!t.has(d.name)) { t.set(d.name, { value: d.value, base: mode, modes: {} }); continue; }
    const e = t.get(d.name);
    if (mode !== e.base && mode !== null) e.modes[mode] = d.value;
  }
  return t;
}
