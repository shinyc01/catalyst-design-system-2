import React from 'react';
import { IFS } from './registry.js';
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
  const isCollapsed = collapsed !== undefined ? !!collapsed : (w != null && w < collapseBelow);
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
// onTitleMenu (chevron after the title), status (node, e.g. an indicator), views (node, e.g. segmented icon control; a divider precedes it),
// center (node, centred between left and right: e.g. the Stepper), actions (node, right side: e.g. Cooper chip, Share, primary button).
// The blur sits on a ::before layer, so fixed popovers/modals opened from header actions aren't trapped by it.
function PageHeader({ title, id, onBack, onTitleMenu, status, views, center, actions, className, ...rest }) {
  return (
    <div className={IFS.cx('ifs-page-header', center != null && 'ifs-page-header--center', className)} {...rest}>
      <div className="ifs-page-header__left">
        <div className="ifs-page-header__text">
          {onBack && <IFS.IconButton icon="arrow-chevron-left" label="Back" size="s" type="tertiary" onClick={onBack} />}
          <h1 className="ifs-page-header__title">{title}</h1>
          {id && <span className="ifs-page-header__id">{id}</span>}
          {onTitleMenu && <button type="button" className="ifs-page-header__menu" aria-label={`${title} options`} onClick={onTitleMenu}><IFS.Icon name="arrow-chevron-down" size={12} /></button>}
          {status}
        </div>
        {views && <><span className="ifs-page-header__divider" aria-hidden="true" />{views}</>}
      </div>
      {center != null && <div className="ifs-page-header__center">{center}</div>}
      {(actions || center != null) && <div className="ifs-page-header__right">{actions}</div>}
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
// (+ optional CanvasHeader) on top, a scrolling content area and an optional docked side panel on the right (2.0.3, from the
// layout branch). Bar, sidebar, header and panel stay put; only content scrolls.
// Props: navBar, sideNav, header (nodes), panel (node, e.g. <Panel>; right of the content, below the header), bottom (node,
// e.g. a bottom sheet), children (content), height (default 100vh).
// Panels and screen width (guide/layout.md, Nov 18 decision): md and up (1024+) the side nav and the panel push the content,
// which reflows onto its own columns; below md they start collapsed and expand over the content (overlay). The shell measures
// its own width and sets data-size xs|sm|md|lg|xl. A side nav with a controlled `collapsed`, or a panel with a controlled
// `expanded`, is left alone.
const SHELL_SIZES = [[1920, 'xl'], [1440, 'lg'], [1024, 'md'], [600, 'sm'], [0, 'xs']];
const shellSizeOf = w => SHELL_SIZES.find(([min]) => w >= min)[1];
function AppShell({ navBar, sideNav, header, panel, bottom, children, height, className, style, ...rest }) {
  const ref = React.useRef(null);
  const [size, setSize] = React.useState(() => shellSizeOf(typeof window !== 'undefined' ? window.innerWidth : 1440));
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const read = () => setSize(shellSizeOf(el.getBoundingClientRect().width));
    read();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(read) : null;
    ro && ro.observe(el);
    return () => ro && ro.disconnect();
  }, []);
  const overlay = size === 'xs' || size === 'sm';
  const navOverlay = !!sideNav && overlay;
  const panelOverlay = !!panel && overlay;
  let nav = sideNav;
  if (React.isValidElement(sideNav) && sideNav.props.collapsed === undefined) {
    // remount when the mode changes so the new default applies; the user can still expand / collapse
    nav = React.cloneElement(sideNav, { key: navOverlay ? 'overlay' : 'push', defaultCollapsed: navOverlay ? true : sideNav.props.defaultCollapsed });
  }
  let side = panel;
  if (React.isValidElement(panel) && panel.props.expanded === undefined) {
    side = React.cloneElement(panel, { key: panelOverlay ? 'overlay' : 'push', defaultExpanded: panelOverlay ? false : panel.props.defaultExpanded });
  }
  return (
    <div ref={ref} data-size={size}
      className={IFS.cx('ifs-app-shell', navOverlay && 'ifs-app-shell--nav-overlay', panelOverlay && 'ifs-app-shell--panel-overlay', className)}
      style={height ? { height, ...style } : style} {...rest}>
      <div className="ifs-app-shell__bar">{navBar}</div>
      {sideNav && <div className="ifs-app-shell__side">{nav}</div>}
      <div className="ifs-app-shell__main" style={sideNav ? undefined : { gridColumn: '1 / -1' }}>
        {header && <div className="ifs-app-shell__header">{header}</div>}
        <div className="ifs-app-shell__body">
          <main className="ifs-app-shell__content">{children}</main>
          {panel && <div className="ifs-app-shell__panel">{side}</div>}
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
