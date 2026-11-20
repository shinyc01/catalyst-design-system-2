import React from 'react';
import { IFS } from './registry.js';
// Widths in JS follow the user's text size, like zoom: px at the default 16px, scaled by root font size / 16.
const rootPx = () => (typeof document !== 'undefined' && parseFloat(getComputedStyle(document.documentElement).fontSize)) || 16;
const cssPx = (v, fallback) => { const n = parseFloat(v); return Number.isNaN(n) ? fallback : /rem\s*$/.test(v) ? n * rootPx() : n; };
// Navigation family. Organisms (SideNav, Tabs, Breadcrumb, Stepper, Pager, CanvasHeader, NavBar, PageHeader, PageTop)
// are what screens use; NavItem, Tab, Crumb, Step, CanvasColumn are the atoms they are built from.

// Controlled-or-uncontrolled value helper (local to this family).
function useNavControlled(value, defaultValue, onChange) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = React.useCallback((v, ...extra) => { if (!controlled) setInner(v); onChange && onChange(v, ...extra); }, [controlled, onChange]);
  return [current, set];
}

// cooper-system-icon State=Insight. IFS.Icon only resolves size-keyed icons and this set is keyed by State,
// so render the exported artwork from IFS_ICONS directly (same mechanism as IFS.Icon).
function CooperMark({ size = 14, state = 'Insight' }) {
  const set = (window.IFS_ICONS || {})['cooper-system-icon'];
  const e = set && set[state];
  if (!e) return null;
  return <svg className="ifs-icon ifs-nav-item__cooper" width={size} height={size} viewBox={e.vb} fill="none" aria-label="Cooper recommended" role="img"
    dangerouslySetInnerHTML={{ __html: e.svg }} />;
}

// Figma: navigation-panel-atom (1544:2681) — one sidebar row.
// Props: type parent|child|submenu, active (Figma State=Active / Selected), disabled, cooper (Figma "Cooper recommended"),
// action = { icon, label, onClick } (Figma show-button; Child shows it on hover), expanded (submenu only), state (forced gallery state).
function NavItem({ type = 'parent', active, disabled, cooper, action, expanded, state, children, className, onClick, ...rest }) {
  const isSub = type === 'submenu';
  const btn = (
    <button type="button" data-state={state} disabled={disabled}
      aria-current={!isSub && active ? 'page' : undefined} aria-expanded={isSub ? !!expanded : undefined}
      className={IFS.cx('ifs-nav-item', `ifs-nav-item--${type}`, className)} onClick={onClick} {...rest}>
      {type === 'child' && <IFS.Icon name="corner-down-right-arrow" size={16} />}
      {isSub && <IFS.Icon name={expanded ? 'arrow-caret-down-filled' : 'arrow-caret-right-filled'} size={16} />}
      <span className="ifs-nav-item__label">{children}</span>
      {cooper && <CooperMark size={isSub ? 12 : 14} />}
    </button>
  );
  if (!action) return btn;
  return (
    <div className={IFS.cx('ifs-nav-row', `ifs-nav-row--${type}`)} data-state={state}>
      {btn}
      <IFS.IconButton icon={action.icon || 'system-pencil-plus'} label={action.label} size="s" onClick={action.onClick} disabled={disabled} />
    </div>
  );
}

// Figma: navigation-panel-atom Type=Subtitle — section heading with optional "+" icon-button.
function NavSubtitle({ children, action, className }) {
  return (
    <div className={IFS.cx('ifs-nav-subtitle', className)}>
      <p className="ifs-nav-subtitle__label">{children}</p>
      {action && <IFS.IconButton icon={action.icon || 'system-plus'} label={action.label} size="s" onClick={action.onClick} />}
    </div>
  );
}

// Figma: navigation-panel-organism (1545:2808) — the Level-2 sidebar (sidebar-pattern 4482:99996 is this filled in).
// Props: title (Figma "Bar name"), items: array of
//   { id, label, disabled, cooper, action }                         → Parent row
//   { type:'section', label, action, items:[{ id, label, ... }] }   → Subtitle + Child rows
//   { type:'submenu', id, label, defaultOpen, items:[...] }          → Submenu toggle + Child rows
// value / defaultValue / onSelect(id, item) for the active row; collapsed / defaultCollapsed / onCollapsedChange (View=Collapsed).
// children = Figma Content slot: custom content (e.g. a tree) shown under the title instead of / after the `items` rows.
function SideNav({ title, items = [], value, defaultValue, onSelect, collapsed, defaultCollapsed = false, onCollapsedChange, children, className, ...rest }) {
  const [active, setActive] = useNavControlled(value, defaultValue, onSelect);
  const [isCollapsed, setCollapsed] = useNavControlled(collapsed, defaultCollapsed, onCollapsedChange);
  const [open, setOpen] = React.useState(() => Object.fromEntries(items.filter(i => i.type === 'submenu').map(i => [i.id, !!i.defaultOpen])));

  const row = (it, type) => (
    <li key={it.id}>
      <NavItem type={type} active={active === it.id} disabled={it.disabled} cooper={it.cooper} action={it.action}
        onClick={() => setActive(it.id, it)}>{it.label}</NavItem>
    </li>
  );
  const toggleLabel = isCollapsed ? `Expand ${title || 'navigation'}` : `Collapse ${title || 'navigation'}`;

  return (
    <nav aria-label={title || 'Section navigation'} className={IFS.cx('ifs-sidenav', isCollapsed && 'ifs-sidenav--collapsed', className)} {...rest}>
      <div className="ifs-sidenav__menu">
        <div className="ifs-sidenav__title">
          {!isCollapsed && <h2 className="ifs-sidenav__title-text">{title}</h2>}
          <IFS.IconButton icon={isCollapsed ? 'arrow-bar-right' : 'arrow-bar-left'} label={toggleLabel} size="s"
            aria-expanded={!isCollapsed} onClick={() => setCollapsed(!isCollapsed)} />
        </div>
        {!isCollapsed && items.length > 0 && (
          <ul className="ifs-sidenav__content">
            {items.map((it, i) => {
              if (it.type === 'section') return (
                <li key={it.id || `s${i}`} className="ifs-sidenav__section">
                  <NavSubtitle action={it.action}>{it.label}</NavSubtitle>
                  <ul className="ifs-sidenav__group">{(it.items || []).map(c => row(c, 'child'))}</ul>
                </li>
              );
              if (it.type === 'submenu') return (
                <li key={it.id} className="ifs-sidenav__section">
                  <NavItem type="submenu" expanded={!!open[it.id]} cooper={it.cooper}
                    onClick={() => setOpen(o => ({ ...o, [it.id]: !o[it.id] }))}>{it.label}</NavItem>
                  {open[it.id] && <ul className="ifs-sidenav__group">{(it.items || []).map(c => row(c, 'child'))}</ul>}
                </li>
              );
              return row(it, 'parent');
            })}
          </ul>
        )}
        {!isCollapsed && children != null && <div className="ifs-sidenav__slot">{children}</div>}
      </div>
    </nav>
  );
}

// Figma: tab (1440:5039). Props: size m|l, selected, disabled, count (Figma show-counter + counter value), state.
function Tab({ size = 'm', selected, disabled, count, state, children, className, ...rest }) {
  return (
    <button type="button" role="tab" aria-selected={!!selected} tabIndex={selected ? 0 : -1} disabled={disabled} data-state={state}
      className={IFS.cx('ifs-tab', `ifs-tab--${size}`, className)} {...rest}>
      <span>{children}</span>
      {count != null && <span className="ifs-tab__counter">{count}</span>}
    </button>
  );
}

// Figma: tab-organism (3412:32038) — peer views of one page; also the table filter (tabs with counts).
// Props: items [{ value, label, count, disabled }], value / defaultValue / onChange(value), size m|l, aria-label.
// Arrow keys / Home / End move between tabs (automatic activation).
function Tabs({ items = [], value, defaultValue, onChange, size = 'm', className, ...rest }) {
  const first = (items.find(i => !i.disabled) || {}).value;
  const [current, setCurrent] = useNavControlled(value, defaultValue !== undefined ? defaultValue : first, onChange);
  const ref = React.useRef(null);
  const onKeyDown = e => {
    const enabled = items.filter(i => !i.disabled);
    const idx = enabled.findIndex(i => i.value === current);
    let next = null;
    if (e.key === 'ArrowRight') next = enabled[(idx + 1) % enabled.length];
    else if (e.key === 'ArrowLeft') next = enabled[(idx - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') next = enabled[0];
    else if (e.key === 'End') next = enabled[enabled.length - 1];
    if (!next) return;
    e.preventDefault();
    setCurrent(next.value);
    const el = ref.current && ref.current.querySelector(`[data-value="${CSS.escape(String(next.value))}"]`);
    el && el.focus();
  };
  return (
    <div role="tablist" ref={ref} onKeyDown={onKeyDown} className={IFS.cx('ifs-tabs', className)} {...rest}>
      {items.map(it => (
        <Tab key={it.value} data-value={it.value} size={size} selected={it.value === current} disabled={it.disabled} count={it.count}
          onClick={() => setCurrent(it.value)}>{it.label}</Tab>
      ))}
    </div>
  );
}

// Figma: breadcrumb-atom (3492:9413). Props: type previous|current|next, icon (Figma show-icon-left, previous only), disabled, state.
function Crumb({ type = 'previous', icon, disabled, state, children, className, ...rest }) {
  if (type === 'current') return (
    <span aria-current="page" aria-disabled={disabled || undefined} data-state={state}
      className={IFS.cx('ifs-crumb', 'ifs-crumb--current', className)} {...rest}>{children}</span>
  );
  return (
    <button type="button" disabled={disabled} data-state={state} className={IFS.cx('ifs-crumb', `ifs-crumb--${type}`, className)} {...rest}>
      {icon && <IFS.Icon name="arrow-chevron-left" size={16} />}
      <span>{children}</span>
    </button>
  );
}

// Figma: breadcrumb-organism (67:4698).
// Props: items [{ label, onClick, disabled }], current (index of the current crumb, default last), onSelect(index, item),
// back (default true: the first previous crumb carries the ‹ chevron, Figma show-icon-left). Crumbs after `current` render as Type=Next.
function Breadcrumb({ items = [], current, onSelect, back = true, className, ...rest }) {
  const cur = current != null ? current : items.length - 1;
  return (
    <nav aria-label="Breadcrumb" className={IFS.cx('ifs-breadcrumb', className)} {...rest}>
      <ol className="ifs-breadcrumb__list">
        {items.map((it, i) => (
          <li key={i}>
            {i > 0 && <span className="ifs-breadcrumb__sep" aria-hidden="true" />}
            <Crumb type={i === cur ? 'current' : i < cur ? 'previous' : 'next'} icon={back && i === 0 && i !== cur} disabled={it.disabled}
              onClick={i === cur ? undefined : () => { it.onClick && it.onClick(); onSelect && onSelect(i, it); }}>{it.label}</Crumb>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Figma: stepper-molecule (1219:169725). Non-interactive.
// Props: status completed|in-progress|not-started (Figma State), active (Figma Active=Yes), tooltip (shown on hover, Figma Hover=True), state.
const STEP_ICON = { 'completed': 'status-success-filled', 'in-progress': 'select-active-filled', 'not-started': 'select-empty-filled' };
const STEP_SR = { 'completed': 'completed', 'in-progress': 'in progress', 'not-started': 'not started' };
function Step({ status = 'not-started', active, tooltip, state, children, className }) {
  return (
    <div data-state={state} className={IFS.cx('ifs-step', `ifs-step--${status}`, active && 'ifs-step--active', className)}>
      <div className="ifs-step__text">
        <IFS.Icon name={STEP_ICON[status]} size={16} />
        <span className="ifs-step__label">{children}</span>
        <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>, {STEP_SR[status]}</span>
      </div>
      <div className="ifs-step__line" />
      {tooltip && <span className="ifs-step__tip" role="tooltip">{tooltip}</span>}
    </div>
  );
}

// Figma: stepper-organism (3029:22750). Shows progress only — steps are not clickable (Figma rule); advance it from a button.
// Props: steps [{ label, tooltip }], current (index of the in-progress step; earlier = completed, later = not started),
// or give each step its own `status`. active = index of a highlighted step (Figma Active=Yes), optional.
function Stepper({ steps = [], current = 0, active, className, ...rest }) {
  return (
    <ol aria-label="Progress" className={IFS.cx('ifs-stepper', className)} {...rest}>
      {steps.map((s, i) => {
        const status = s.status || (i < current ? 'completed' : i === current ? 'in-progress' : 'not-started');
        return (
          <li key={i} aria-current={status === 'in-progress' ? 'step' : undefined}>
            <Step status={status} active={active === i} tooltip={s.tooltip}>{s.label}</Step>
          </li>
        );
      })}
    </ol>
  );
}

// Figma: pagination-organism (3497:9660) — record pager for item-by-item content. Never for tables (Figma rule).
// Props: page (1-based) / defaultPage / onChange(page), total, percent (Figma show-%; omit to hide),
// progress (word after the percent, e.g. "resolved" → "(0% resolved)"; Figma's text override),
// complete (Figma "show left icon": success icon before the count), onShowAll (Figma show-all-button; omit to hide), showAllLabel.
function Pager({ page, defaultPage = 1, onChange, total = 1, percent, progress, complete, onShowAll, showAllLabel = 'Show all', className, ...rest }) {
  const [p, setP] = useNavControlled(page, defaultPage, onChange);
  return (
    <div className={IFS.cx('ifs-pager', className)} {...rest}>
      <div className="ifs-pager__status" aria-live="polite">
        {complete && <IFS.Icon name="status-success-filled" size={12} />}
        <span className="ifs-pager__count">{p}<span className="ifs-pager__total"> / {total}</span></span>
        {percent != null && <span className="ifs-pager__pct">({percent}%{progress ? ` ${progress}` : ''})</span>}
      </div>
      <div className="ifs-pager__actions">
        {onShowAll && <IFS.Button type="tertiary" size="s" iconLeft="list" onClick={onShowAll}>{showAllLabel}</IFS.Button>}
        <div className="ifs-pager__steps">
          <IFS.IconButton icon="arrow-chevron-left" label="Previous" size="s" disabled={p <= 1} onClick={() => setP(p - 1)} />
          <span className="ifs-pager__divider" aria-hidden="true" />
          <IFS.IconButton icon="arrow-chevron-right" label="Next" size="s" disabled={p >= total} onClick={() => setP(p + 1)} />
        </div>
      </div>
    </div>
  );
}

// Figma: canvas-container-atom (1440:5305) — one column heading of the canvas header. Optional action = { icon, label, onClick }.
function CanvasColumn({ children, action, className, ...rest }) {
  return (
    <div role="columnheader" className={IFS.cx('ifs-canvas-column', className)} {...rest}>
      <div className="ifs-canvas-column__inner">
        <span className="ifs-canvas-column__label">{children}</span>
        {action && <IFS.IconButton icon={action.icon} label={action.label} size="s" onClick={action.onClick} />}
      </div>
    </div>
  );
}

// Figma: canvas-header (1440:5321) — column strip under the page header on map views, plus the zoom ruler.
// Props: columns (array of labels) or children (CanvasColumn elements; Figma "columns" slot), ruler (default true).
function CanvasHeader({ columns, children, ruler = true, className, ...rest }) {
  return (
    <div className={IFS.cx('ifs-canvas-header', className)} {...rest}>
      <div role="row" className="ifs-canvas-header__columns">
        {children || (columns || []).map((c, i) => <CanvasColumn key={i}>{c}</CanvasColumn>)}
      </div>
      {ruler && <div className="ifs-canvas-header__ruler" aria-hidden="true" />}
    </div>
  );
}

// Figma: nav-bar-page-atom (69:4012) — one stage in the Level-1 bar. Props: active, disabled, state.
function NavBarItem({ active, disabled, state, children, className, ...rest }) {
  return (
    <button type="button" disabled={disabled} aria-current={active ? 'page' : undefined} data-state={state}
      className={IFS.cx('ifs-navbar__item', className)} {...rest}>{children}</button>
  );
}

// Stage values: command | value | explore | build | plan | results ('home' is accepted as an alias of 'command').
// Figma: global-header (69:3736) / nav-bar-organism (3412:29453) Type=Default, Collapsed (12:2340) and Collapsed opened (12:2352).
// One bar (2.0.3: replaces NavBarCollapsed and ResponsiveNavBar). It collapses by its own width: below collapseBelow (px,
// default 800, where logo + six tabs + actions stop fitting) the stage tabs become a hamburger (IconButton secondary S) that
// opens a Menu of the stages with a check on the current one. The stage value is the same in both looks.
// Props: stages [{ value, label, disabled }], value / defaultValue / onChange, collapsed (force true/false; omit = by width),
// collapseBelow, menuOpen / defaultMenuOpen / onMenuOpenChange (the collapsed list), menuLabel (default "Stages"),
// logo (node; defaults to IFS.Logo), onSearch, onSettings, onNotifications, hasNotifications,
// user = { initials, name } or avatar (node), actions (node: replaces the default search/settings/bell buttons).
const DEFAULT_STAGES = ['Command', 'Value', 'Explore', 'Build', 'Plan', 'Results'].map(l => ({ value: l.toLowerCase(), label: l }));
const navStage = v => (v === 'home' ? 'command' : v);
function useNavWidth() {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const read = () => setW(el.getBoundingClientRect().width);
    read();
    const ro = window.ResizeObserver ? new ResizeObserver(read) : null;
    ro && ro.observe(el);
    return () => ro && ro.disconnect();
  }, []);
  return [ref, w];
}
function NavBar({ stages = DEFAULT_STAGES, value, defaultValue, onChange, collapsed, collapseBelow = 800, menuOpen, defaultMenuOpen = false,
  onMenuOpenChange, menuLabel = 'Stages', logo, onSearch, onSettings, onNotifications, hasNotifications, user, avatar, actions, className, ...rest }) {
  const [rawCurrent, setCurrent] = useNavControlled(value, defaultValue !== undefined ? defaultValue : stages[0] && stages[0].value, onChange);
  const current = navStage(rawCurrent);
  const [ref, w] = useNavWidth();
  // collapseBelow is px at the default 16px text size; it grows with the user's text size, since the tabs it measures do
  const remScale = rootPx() / 16;
  const isCollapsed = collapsed !== undefined ? !!collapsed : (w != null && w < collapseBelow * remScale);
  const currentLabel = (stages.find(s => navStage(s.value) === current) || {}).label;
  return (
    <header ref={ref} className={IFS.cx('ifs-navbar', isCollapsed && 'ifs-navbar--collapsed', className)} {...rest}>
      <div className="ifs-navbar__left">
        <div className="ifs-navbar__logo">{logo || (IFS.Logo ? <IFS.Logo height={30} /> : <span className="ifs-navbar__logo-fallback">IFS Copperleaf</span>)}</div>
        <nav aria-label="Stages">
          {isCollapsed
            ? <IFS.Menu align="start" label={menuLabel} open={menuOpen} defaultOpen={defaultMenuOpen} onOpenChange={onMenuOpenChange}
                items={stages.map(s => ({ label: s.label, disabled: s.disabled, selected: navStage(s.value) === current, onClick: () => setCurrent(s.value) }))}
                trigger={<IFS.IconButton icon="system-hamburger-menu" type="secondary" size="s" label={currentLabel ? `${menuLabel}: ${currentLabel}` : menuLabel} />} />
            : <ul className="ifs-navbar__list">
                {stages.map(s => (
                  <li key={s.value}><NavBarItem active={navStage(s.value) === current} disabled={s.disabled} onClick={() => setCurrent(s.value)}>{s.label}</NavBarItem></li>
                ))}
              </ul>}
        </nav>
      </div>
      <div className="ifs-navbar__actions">
        <div className="ifs-navbar__buttons">
          {actions || <>
            <IFS.IconButton icon="system-search" label="Search" size="s" onClick={onSearch} />
            <IFS.IconButton icon="system-settings" label="Settings" size="s" onClick={onSettings} />
            {IFS.NotificationButton
              ? <IFS.NotificationButton hasNew={hasNotifications} onClick={onNotifications} />
              : <IFS.IconButton icon="system-notification" label="Notifications" size="s" onClick={onNotifications} />}
          </>}
        </div>
        {avatar || (user && (IFS.Avatar
          ? <IFS.Avatar size="m" initials={user.initials} name={user.name} />
          : <span className="ifs-navbar__avatar" title={user.name} aria-label={user.name} role="img">{user.initials}</span>))}
      </div>
    </header>
  );
}

// Figma: page-header (1588:1971) — Level-3 header at the top of the content area (the instance the Map overview screen uses;
// page-header-pattern / header-pattern are near-duplicates). Props: title, id (Figma ID), onBack (Figma "Show button back"),
// onTitleMenu (the title menu ▾ after the title and ID: opens the entity's ActivityPanel; required on an entity header, rule 5.1), status (node, e.g. an indicator), views (node, e.g. segmented icon control; a divider precedes it),
// center (node, centred between left and right: e.g. the Stepper), actions (node, right side: e.g. Cooper chip, Share, primary button).
// The blur sits on a ::before layer, so fixed popovers/modals opened from header actions aren't trapped by it.
// Narrow widths (Nov 19, measured on the header itself):
//   1100+   one row as drawn: title · id · status · views | stepper | actions · primary.
//   1100+   the stepper stays in the bar (centred when there is room, else between the title side and the buttons).
//   < 1100  (or when it can't fit at all) the stepper leaves the bar and opens in a
//           popover from the status (hover shows, click pins; a "Progress" button when there is no status). Decided Nov 19:
//           no separate row for it.
//   < 720   (or whenever one row doesn't fit even without the stepper) two rows. Row 1: back, title (truncates, never hidden).
//           Row 2, starting under the title (not under back): id + status together, views, the other actions, primary last.
// Props: title, id, onBack, onTitleMenu, status, views, center (e.g. the Stepper), actions (secondary actions), primaryAction (the
// main button: always visible, last), progressLabel.
const pageHeaderWarned = new Set();
const pageHeaderWarnOnce = (k, msg) => { if (!pageHeaderWarned.has(k)) { pageHeaderWarned.add(k); console.warn(msg); } };
// Header sizes in px, read from the layout tokens (rem follows the user's text size)
const headerLen = (el, name) => { const v = getComputedStyle(el).getPropertyValue(name).trim(); return v.endsWith('rem') ? parseFloat(v) * rootPx() : parseFloat(v) || 0; };
const headerTitleMin = el => headerLen(el, '--layout-header-title-min');
function PageHeader({ title, id, onBack, onTitleMenu, status, views, center, actions, primaryAction, progressLabel = 'Progress', className, ...rest }) {
  const ref = React.useRef(null);
  const [size, setSize] = React.useState('wide');
  const [tipOpen, setTipOpen] = React.useState(false);
  const pinned = React.useRef(false), hovering = React.useRef(false); // hover shows the steps; a click pins them open
  // The stepper also leaves the bar when the title side or the actions would not fit beside it (not only below 1100):
  // while wide, the width the bar needs is measured and remembered (needWide).
  const needWide = React.useRef(0), needRow = React.useRef(0); // widths needed for one row with / without the stepper
  const [centered, setCentered] = React.useState(true);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const read = () => {
      const w = el.getBoundingClientRect().width;
      // fold widths from the tokens (--bp-header-steps 1100, --bp-header-rows 720; rem, so they follow the user's text size)
      setSize(w >= Math.max(headerLen(el, '--bp-header-steps'), needWide.current) ? 'wide' : w >= Math.max(headerLen(el, '--bp-header-rows'), needRow.current) ? 'mid' : 'narrow');
      setCentered(true);
    };
    read();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(read) : null;
    ro && ro.observe(el);
    return () => ro && ro.disconnect();
  }, []);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el || size !== 'wide' || center == null) return;
    const bar = el.querySelector('.ifs-page-header__bar'); if (!bar) return;
    // natural width of a row of parts: children + gaps; the title counts up to --layout-header-title-min (160; it may truncate below that)
    const rowNeed = node => {
      if (!node) return 0;
      const kids = [...node.children];
      const g = parseFloat(getComputedStyle(node).columnGap) || 0;
      return kids.reduce((sum, k) => sum + (k.classList.contains('ifs-page-header__title') ? Math.min(k.scrollWidth, headerTitleMin(k))
        : k.classList.contains('ifs-page-header__text') ? rowNeed(k) : k.getBoundingClientRect().width), 0) + Math.max(0, kids.length - 1) * g;
    };
    const gap = parseFloat(getComputedStyle(bar).columnGap) || 0;
    const pad = el.getBoundingClientRect().width - bar.getBoundingClientRect().width;
    const mid = bar.querySelector('.ifs-page-header__center');
    const L = rowNeed(bar.querySelector('.ifs-page-header__left')), R = rowNeed(bar.querySelector('.ifs-page-header__right'));
    const C = (mid ? mid.scrollWidth : 0) + 2 * gap + pad;
    // The stepper stays in the bar from 1100 up. Centred when both sides fit around it; otherwise it simply sits between
    // the title side and the buttons. Only when even that doesn't fit does it go under the status.
    needWide.current = Math.ceil(L + R + C);
    const w = el.getBoundingClientRect().width;
    if (w < needWide.current) { setSize('mid'); return; }
    // one-way within a width: centred → between (re-centred on the next resize), so it can't flip back and forth
    if (centered && w < 2 * Math.max(L, R) + C) setCentered(false);
  });
  // Two rows: when the buttons wrap onto their own line they start on the left (under the title), not at the right end
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el || size !== 'narrow') return undefined;
    const check = () => {
      const meta = el.querySelector('.ifs-page-header__row--meta'), right = meta && meta.querySelector('.ifs-page-header__right');
      if (!right) return;
      right.classList.remove('ifs-page-header__right--wrapped');
      const first = meta.firstElementChild;
      if (first && first !== right && right.getBoundingClientRect().top > first.getBoundingClientRect().bottom - 1) right.classList.add('ifs-page-header__right--wrapped');
    };
    check();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(check) : null;
    ro && ro.observe(el);
    return () => ro && ro.disconnect();
  });
  // One row without the stepper: when even that doesn't fit, fold into two rows (not only below 720)
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el || size !== 'mid') return;
    const bar = el.querySelector('.ifs-page-header__bar'); if (!bar) return;
    const rowNeed = node => {
      if (!node) return 0;
      const kids = [...node.children];
      const g = parseFloat(getComputedStyle(node).columnGap) || 0;
      return kids.reduce((sum, k) => sum + (k.classList.contains('ifs-page-header__title') ? Math.min(k.scrollWidth, headerLen(k, '--layout-header-title-mid'))
        : k.classList.contains('ifs-page-header__text') ? rowNeed(k) : k.getBoundingClientRect().width), 0) + Math.max(0, kids.length - 1) * g;
    };
    const gap = parseFloat(getComputedStyle(bar).columnGap) || 0;
    const pad = el.getBoundingClientRect().width - bar.getBoundingClientRect().width;
    needRow.current = Math.ceil(rowNeed(bar.querySelector('.ifs-page-header__left')) + rowNeed(bar.querySelector('.ifs-page-header__right')) + gap + pad);
    if (el.getBoundingClientRect().width < needRow.current) setSize('narrow');
  });
  const hasSteps = center != null;
  const stepsOut = hasSteps && size !== 'wide';            // the stepper leaves the bar …
  const stepsPop = stepsOut;                               // … into the status popover
  const narrow = size === 'narrow';
  const statusNode = stepsPop && IFS.Popover
    ? <span className="ifs-page-header__status" onMouseEnter={() => { hovering.current = true; setTipOpen(true); }} onMouseLeave={() => { hovering.current = false; if (!pinned.current) setTipOpen(false); }}>
        <IFS.Popover open={tipOpen} onOpenChange={v => {
          if (!v && hovering.current && !pinned.current) { pinned.current = true; setTipOpen(true); return; } // click while hovering: pin
          pinned.current = v; setTipOpen(v); }} showClose={false} width="var(--overlay-width-m)"
          trigger={<button type="button" className="ifs-page-header__status-btn" aria-label={`${progressLabel}: show steps`}>
            {status || <span className="ifs-page-header__progress"><IFS.Icon name="arrow-chevron-down" size={16} />{progressLabel}</span>}</button>}>
          <div className="ifs-page-header__steps">{center}</div>
        </IFS.Popover>
      </span>
    : status;
  const backBtn = onBack && <IFS.IconButton icon="arrow-chevron-left" label="Back" size="s" type="tertiary" onClick={onBack} />;
  const menuBtn = onTitleMenu && <IFS.IconButton icon="arrow-chevron-down" type="ghost" size="s" label={`${title} activity`} onClick={onTitleMenu} className="ifs-page-header__menu" />;
  const titleBits = <>
    {backBtn}
    <h1 className="ifs-page-header__title" title={typeof title === 'string' ? title : undefined}>{title}</h1>
  </>;
  const idNode = id && <span className="ifs-page-header__id">{id}</span>;
  // The title hugs its text (the ID sits --space-200 after it) but never shrinks below --layout-header-title-min or its own width, whichever is smaller
  React.useLayoutEffect(() => {
    const t = ref.current && ref.current.querySelector('.ifs-page-header__title'); if (!t) return;
    t.style.minWidth = ''; t.style.minWidth = Math.min(headerTitleMin(t), t.scrollWidth) + 'px';
  });
  // Rule 5.1: an entity header (it has an ID) always has the ⌄ that opens its Activity panel
  React.useEffect(() => { if (id && !onTitleMenu) pageHeaderWarnOnce(String(title), `IFS PageHeader "${title}" has an ID but no title menu (onTitleMenu). An entity header needs the ⌄ that opens its Activity panel (rule 5.1).`); }, [id, !onTitleMenu, title]);
  // Two rows: the back button keeps its own column, so row 2 starts where the title starts; the ID and the status move together.
  if (narrow) return (
    <div ref={ref} data-size={size} className={IFS.cx('ifs-page-header', 'ifs-page-header--rows', className)} {...rest}>
      <div className="ifs-page-header__rows">
        {backBtn && <div className="ifs-page-header__back">{backBtn}</div>}
        <div className="ifs-page-header__rows-col">
          <div className="ifs-page-header__row">
            <div className="ifs-page-header__text">
              <h1 className="ifs-page-header__title" title={typeof title === 'string' ? title : undefined}>{title}</h1>
              {menuBtn}
            </div>
          </div>
          {(idNode || statusNode || views || actions || primaryAction) && <div className="ifs-page-header__row ifs-page-header__row--meta">
            {(idNode || statusNode) && <div className="ifs-page-header__idstatus">{idNode}{statusNode}</div>}
            {views}
            {(actions || primaryAction) && <div className="ifs-page-header__right">{actions}{primaryAction}</div>}
          </div>}
        </div>
      </div>
    </div>
  );
  const bar = (
    <div className={IFS.cx('ifs-page-header__bar', hasSteps && !stepsOut && centered && 'ifs-page-header__bar--center')}>
      <div className="ifs-page-header__left">
        <div className="ifs-page-header__text">{titleBits}{idNode}{menuBtn}{statusNode}</div>
        {views && <><span className="ifs-page-header__divider" aria-hidden="true" />{views}</>}
      </div>
      {hasSteps && !stepsOut && <div className="ifs-page-header__center">{center}</div>}
      {(actions || primaryAction || (hasSteps && !stepsOut)) && <div className="ifs-page-header__right">{actions}{primaryAction}</div>}
    </div>
  );
  return (
    <div ref={ref} data-size={size} className={IFS.cx('ifs-page-header', className)} {...rest}>
      {bar}
    </div>
  );
}

// Figma: page-top (244:117279, key c5e4c474…) — component set in IFS Design System Patterns (KmmVU2D0kqWr0dC1xXNzWw); variant
// Type=Default 244:117280 and the older standalone copy 95:18889 both carry key 771d8425…. Not found in the published IFS Design System library.
// The page intro on a library / list page (a single object's page uses PageHeader instead). Column, gap 20:
//   title row (gap 8, bottom-aligned): text column (gap 8) = eyebrow + title (Heading/H2/medium) + description (Label/M/medium),
//   then the actions on the right (Figma "Show button": button Secondary M "New" with system-pencil-plus);
//   tabs row (40 tall, space-between, bottom-aligned, gap 32): tab-organism (tabs with counts) + smart-search-organism (360) ("show search").
// Props: title, description (one line; omit for a title-only page-top), eyebrow (Figma "cooper": true → "Cooper", or a string)
// with the Cooper Insight mark, actions (node, e.g. <IFS.Button type="secondary" size="m" iconLeft="system-pencil-plus">New</IFS.Button>),
// tabs (IFS.Tabs props, or a node), search (IFS.SmartSearch props, or a node), headingLevel (default 1).
// With neither description nor eyebrow the title row is 32 tall and centred (the Build / Idea Pad page-top).
function PageTop({ title, description, eyebrow, actions, tabs, search, headingLevel = 1, className, ...rest }) {
  const H = `h${headingLevel}`;
  const node = (v, C) => (v == null || v === false ? null : React.isValidElement(v) ? v : <C {...v} />);
  const tabsNode = node(tabs, IFS.Tabs);
  const searchNode = node(search, IFS.SmartSearch);
  const single = !description && !eyebrow;
  return (
    <div className={IFS.cx('ifs-page-top', single && 'ifs-page-top--single', className)} {...rest}>
      <div className="ifs-page-top__title">
        <div className="ifs-page-top__text">
          {eyebrow && <span className="ifs-page-top__eyebrow"><IFS.Icon name="cooper-system-icon" variant="Insight" size={16} />{eyebrow === true ? 'Cooper' : eyebrow}</span>}
          <H className="ifs-page-top__heading">{title}</H>
          {description && <p className="ifs-page-top__description">{description}</p>}
        </div>
        {actions && <div className="ifs-page-top__actions">{actions}</div>}
      </div>
      {(tabsNode || searchNode) && (
        <div className="ifs-page-top__tabs">
          {tabsNode || <span />}
          {searchNode}
        </div>
      )}
    </div>
  );
}

// AppShell — NOT a Figma component. Reproduces the shell of pattern screen "Map - Overview - Default" (4484:116532):
// 48px NavBar across the top, 240px SideNav below it on the left, then the content column with the PageHeader
// (+ optional CanvasHeader) on top, a scrolling content area and an optional side panel on the right.
// Bar, sidebar, header and panel stay put; only content scrolls.
// Props: navBar, sideNav, header (nodes), panel (node, e.g. <Panel>; right of the content, below the header), bottom (node,
// e.g. a bottom sheet), children (content), height (default 100vh), panelMode, onPanelClose.
// Panel mode (decided Nov 19, guide/rules.md 4.6): set by the panel's JOB, not the screen.
//   push  the content shrinks beside the panel and reflows onto its own columns: the user works with the panel and the
//         whole page together (readiness evaluation, Cooper chat, comments, widgets, approval chain). Default.
//   over  the panel sits over the right of the content, no scrim, the page stays usable: the panel is the focus and the page
//         is context (row / record preview, evidence chain, activity). Outside click and Esc call onPanelClose
//         (clicking another row closes and reopens, so the preview swaps).
//   panelMode beats the panel component's own default (Component.panelMode); below md (1024) push falls back to over:
//   the panel starts collapsed to its rail and expands over the content.
// Side nav below md: starts as a rail and expands over the content; outside click and Esc collapse it again.
// The shell measures its own width and sets data-size xs|sm|md|lg|xl. A side nav with a controlled `collapsed`, or a
// panel with a controlled `expanded`, is left alone.
// Content (rule 4.3): wrap each page's content in `.ifs-page` (page margin on all four sides, 1600 cap, centred); map and canvas
// pages (rule 4.10) fill the content area instead.
const SHELL_SIZES = [[1920, 'xl'], [1440, 'lg'], [1024, 'md'], [600, 'sm'], [0, 'xs']];
const shellSizeOf = w => SHELL_SIZES.find(([min]) => w >= min * rootPx() / 16)[1];
// Outside pointer-down or Esc while `active` → onDismiss (ignores clicks inside `ref`).
function useShellDismiss(ref, active, onDismiss) {
  React.useEffect(() => {
    if (!active) return undefined;
    const down = e => { if (ref.current && !ref.current.contains(e.target) && !(e.target.closest && e.target.closest('.ifs-floating,.ifs-modal,[role="dialog"]'))) onDismiss(); };
    const key = e => { if (e.key === 'Escape' && !e.defaultPrevented) onDismiss(); };
    document.addEventListener('pointerdown', down, true); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down, true); document.removeEventListener('keydown', key); };
  }, [active, onDismiss]);
}
function AppShell({ navBar, sideNav, header, panel, panelMode, onPanelClose, bottom, children, height, className, style, ...rest }) {
  const ref = React.useRef(null), sideRef = React.useRef(null), panelRef = React.useRef(null);
  const [size, setSize] = React.useState(() => shellSizeOf(typeof window !== 'undefined' ? window.innerWidth : 1440));
  const [roomy, setRoomy] = React.useState(true); // false: a pushed panel would leave the page area under --layout-content-min
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const read = () => {
      const w = el.getBoundingClientRect().width;
      setSize(shellSizeOf(w));
      const cs = getComputedStyle(el);
      const min = cssPx(cs.getPropertyValue('--layout-content-min'), 800);
      const nav = cssPx(cs.getPropertyValue('--region-sidenav'), 240);
      const p = panelRef.current ? panelRef.current.getBoundingClientRect().width : 0;
      setRoomy(!p || w - nav - p >= min);
    };
    read();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(read) : null;
    ro && ro.observe(el);
    ro && panelRef.current && ro.observe(panelRef.current);
    return () => ro && ro.disconnect();
  }, [!!panel]);
  const narrow = size === 'xs' || size === 'sm';
  const job = panelMode || (React.isValidElement(panel) && panel.type && panel.type.panelMode) || 'push';
  const over = !!panel && job === 'over';
  const pushRail = !!panel && job === 'push' && narrow; // push panel with no room: rail + expands over
  // Side nav folds to its rail below md, and also when a pushed panel would leave the page area under 800 (Nov 19:
  // fold by available space, as Atlassian, Carbon and Material do); it can be opened again over the content.
  const navFold = !!sideNav && !narrow && !!panel && job === 'push' && !roomy;
  const navOverlay = !!sideNav && (narrow || navFold);

  // Side nav below md: AppShell owns collapse (unless controlled) so outside click / Esc can fold it back.
  const navCtl = React.isValidElement(sideNav) && sideNav.props.collapsed !== undefined;
  const [navCollapsed, setNavCollapsed] = React.useState(true);
  React.useEffect(() => { setNavCollapsed(true); }, [navOverlay]);
  let nav = sideNav;
  if (React.isValidElement(sideNav) && !navCtl && navOverlay) {
    nav = React.cloneElement(sideNav, { collapsed: navCollapsed, onCollapsedChange: v => { setNavCollapsed(v); sideNav.props.onCollapsedChange && sideNav.props.onCollapsedChange(v); } });
  }
  useShellDismiss(sideRef, navOverlay && !navCtl && !navCollapsed, React.useCallback(() => setNavCollapsed(true), []));

  // Push panel with no room: same idea, AppShell folds it back to its rail.
  const panelCtl = React.isValidElement(panel) && panel.props.expanded !== undefined;
  const [panelOpen, setPanelOpen] = React.useState(false);
  React.useEffect(() => { setPanelOpen(false); }, [pushRail]);
  let side = panel;
  if (React.isValidElement(panel) && pushRail && !panelCtl) {
    side = React.cloneElement(panel, { expanded: panelOpen, onExpandedChange: v => { setPanelOpen(v); panel.props.onExpandedChange && panel.props.onExpandedChange(v); } });
  }
  useShellDismiss(panelRef, pushRail && !panelCtl && panelOpen, React.useCallback(() => setPanelOpen(false), []));
  // Over panel: outside click / Esc → onPanelClose.
  useShellDismiss(panelRef, over && !!onPanelClose, React.useCallback(() => onPanelClose && onPanelClose(), [onPanelClose]));

  return (
    <div ref={ref} data-size={size}
      className={IFS.cx('ifs-app-shell', navOverlay && 'ifs-app-shell--nav-overlay', pushRail && 'ifs-app-shell--panel-rail', over && 'ifs-app-shell--panel-over', className)}
      style={height ? { height, ...style } : style} {...rest}>
      <div className="ifs-app-shell__bar">{navBar}</div>
      {sideNav && <div ref={sideRef} className="ifs-app-shell__side">{nav}</div>}
      <div className="ifs-app-shell__main" style={sideNav ? undefined : { gridColumn: '1 / -1' }}>
        {header && <div className="ifs-app-shell__header">{header}</div>}
        <div className="ifs-app-shell__body">
          <main className="ifs-app-shell__content">{children}</main>
          {panel && <div ref={panelRef} className="ifs-app-shell__panel">{side}</div>}
        </div>
        {bottom && <div className="ifs-app-shell__bottom">{bottom}</div>}
      </div>
    </div>
  );
}

Object.assign(IFS, {
  NavItem, NavSubtitle, SideNav, Tab, Tabs, Crumb, Breadcrumb, Step, Stepper, Pager,
  CanvasColumn, CanvasHeader, NavBarItem, NavBar, PageHeader, PageTop, AppShell,
});
export { NavItem, NavSubtitle, SideNav, Tab, Tabs, Crumb, Breadcrumb, Step, Stepper, Pager, CanvasColumn, CanvasHeader, NavBarItem, NavBar, PageHeader, PageTop, AppShell };
