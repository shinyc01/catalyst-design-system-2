import React from 'react';
import { IFS } from './registry.js';
// Figma: button (65:3211)
// Props: type primary|secondary|tertiary|ghost|cooper (Figma "Accent (Cooper)"), size l|m|s,
// iconLeft / iconRight = icon names (Figma show-icon-* + Icon swap), children = Button label.
// Leave out children for Figma show-label=false.
// loading (S2, Nov 24): the dotted loader in the icon slot (in place of iconLeft, same size), aria-busy, not clickable; the label stays.
// disabledReason (rule 9.10, Nov 26): with `disabled`, the button stays focusable (aria-disabled) and a tooltip says why and what unlocks
// it ("Only portfolio owners can publish"). Only for reasons the person can't fix on this screen; an incomplete form never disables (14.4).
function Button({ type = 'secondary', size = 'm', iconLeft, iconRight, loading, children, state, className, onClick, disabled, disabledReason, ...rest }) {
  const iconSize = size === 's' ? 12 : 16;
  const lead = loading ? 'system-loader' : iconLeft;
  const soft = disabled && disabledReason;
  const btn = (
    <button type="button" data-state={state} aria-busy={loading ? true : undefined}
      className={IFS.cx('ifs-button', `ifs-button--${type}`, `ifs-button--${size}`, loading && 'ifs-button--loading', className)}
      disabled={soft ? undefined : disabled} aria-disabled={soft ? true : undefined}
      onClick={loading || soft ? e => e.preventDefault() : onClick} {...rest}>
      {lead && <IFS.Icon name={lead} size={iconSize} />}
      {children != null && <span className="ifs-button__label">{children}</span>}
      {iconRight && <IFS.Icon name={iconRight} size={iconSize} />}
    </button>
  );
  return soft && IFS.Tooltip ? <IFS.Tooltip content={disabledReason}>{btn}</IFS.Tooltip> : btn;
}

// Figma: icon-button (71:4250)
// Props: icon (required), type ghost|primary|secondary|tertiary, size l|m|s (default s since 2.0.7, rules 6.2 / 14.15; was m), shape square|circle.
// Always pass a `label` — it becomes the accessible name and tooltip.
function IconButton({ icon, iconVariant, label, type = 'ghost', size = 's', shape = 'square', state, className, ...rest }) {
  return (
    <button type="button" aria-label={label} title={label} data-state={state}
      className={IFS.cx('ifs-icon-button', `ifs-icon-button--${type}`, `ifs-icon-button--${size}`, shape === 'circle' && 'ifs-icon-button--circle', className)} {...rest}>
      <IFS.Icon name={icon} size={16} variant={iconVariant} />
    </button>
  );
}

// Figma: the circle Tertiary S icon-button with the Cooper evidence icon (content-card-organism show-icon-button,
// panel-organism show-evidence-chain, the Cooper button of every core chart header). One button for all of them (2.0.3):
// the chart header's look (cooper-evidence-icon, medium variant) at the standard 16px icon size.
// Props: onClick, active (the chain for this value is open → aria-expanded + pressed look), label (accessible name).
function EvidenceButton({ onClick, active, label = 'Evidence chain', className, ...rest }) {
  return <IconButton icon="cooper-evidence-icon" iconVariant="medium" label={label} type="tertiary" size="s" shape="circle" aria-expanded={active == null ? undefined : !!active}
    data-state={active ? 'pressed' : undefined} className={className} onClick={onClick} {...rest} />;
}

Object.assign(IFS, { Button, IconButton, EvidenceButton });
export { Button, IconButton, EvidenceButton };
