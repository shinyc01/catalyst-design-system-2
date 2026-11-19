import React from 'react';
import { IFS } from './registry.js';

// Layout primitives (Catalyst DS 2.0.3, Nov 19 2026). Not Figma components: Figma draws the same thing with auto layout.
// Rules: guide/spacing.md §8. Benchmarks: Atlassian Stack/Inline, Polaris BlockStack/InlineStack, Primer Stack, Carbon Stack.
// They take spacing tokens only, so screens never write their own `display:flex; gap` or a raw px gap.

// gap: a role (density-aware) or a step of the --space-* scale. Nothing else.
const GAP_ROLES = { inset: '--space-inset', stack: '--space-stack', section: '--space-section', 'page-gap': '--page-gap' };
const GAP_STEPS = ['0', '50', '100', '150', '200', '250', '300', '400', '500', '600', '700', '800', '900', '1000', '1100'];
const ALIGN = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' };
const JUSTIFY = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' };
const warned = new Set();
function warnOnce(key, msg) { if (!warned.has(key)) { warned.add(key); console.warn(msg); } }

function gapVar(gap, who) {
  if (GAP_ROLES[gap]) return `var(${GAP_ROLES[gap]})`;
  if (typeof gap === 'string' && GAP_STEPS.includes(gap)) return `var(--space-${gap})`;
  warnOnce(`${who}:gap:${String(gap)}`, `IFS.${who}: gap=${JSON.stringify(gap)} is not a spacing token. Use a role (${Object.keys(GAP_ROLES).join(', ')}) or a --space-* step as a string (${GAP_STEPS.join(', ')}). Falling back to "stack".`);
  return 'var(--space-stack)';
}
function pick(map, value, prop, who, fallback) {
  if (value === undefined || map[value]) return map[value ?? fallback];
  warnOnce(`${who}:${prop}:${value}`, `IFS.${who}: ${prop}=${JSON.stringify(value)} is not one of ${Object.keys(map).join(', ')}. Using "${fallback}".`);
  return map[fallback];
}

// Shared render for Stack and Inline. Unset align / justify stay unset: flexbox's own defaults are stretch and start.
function renderLayout(who, dir, { as: Tag = 'div', gap = 'stack', align, justify, wrap = false, className, style, children, ...rest }, ref) {
  const s = { gap: gapVar(gap, who) };
  if (align !== undefined) s.alignItems = pick(ALIGN, align, 'align', who, 'stretch');
  if (justify !== undefined) s.justifyContent = pick(JUSTIFY, justify, 'justify', who, 'start');
  Object.assign(s, style);
  return (
    <Tag ref={ref} className={IFS.cx(`ifs-${dir}`, wrap && dir === 'inline' && 'ifs-inline--wrap', className)} style={s} {...rest}>
      {children}
    </Tag>
  );
}

// Stack — children top to bottom (block axis). Like Atlassian Stack, Polaris BlockStack, Primer Stack, Carbon Stack.
// Props: gap inset|stack|section|page-gap or a --space-* step "0"…"1100" (default "stack"; anything else warns and uses "stack"),
// align start|center|end|stretch (cross axis, default stretch), justify start|center|end|between (main axis, default start),
// as (element, default div), className, style, any other HTML attribute (role, aria-*, onClick…).
const Stack = React.forwardRef(function Stack({ as, gap, align, justify, className, style, children, ...rest }, ref) {
  return renderLayout('Stack', 'stack', { as, gap, align, justify, className, style, children, ...rest }, ref);
});

// Inline — children side by side in reading order (inline axis; start is on the right in RTL). Like Atlassian Inline,
// Polaris InlineStack, Primer Stack direction="horizontal".
// Props: gap, align (start|center|end|stretch|baseline, default stretch), justify, as, className, style as on Stack;
// wrap (boolean, default false) lets children wrap onto more rows, rows use the same gap.
const Inline = React.forwardRef(function Inline({ as, gap, align, justify, wrap, className, style, children, ...rest }, ref) {
  return renderLayout('Inline', 'inline', { as, gap, align, justify, wrap, className, style, children, ...rest }, ref);
});

Object.assign(IFS, { Stack, Inline });
export { Stack, Inline };
