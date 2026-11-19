import React from 'react';
import { IFS } from './registry.js';
// Patterns › Nav bar (Patterns file KmmVU2D0kqWr0dC1xXNzWw, page 243:66369, section "nav bar" 244:119940).
// 1. IFS DS components the kit lacked: explore-header (ExploreHeader), home-row-card-organism (HomeRowCard).
// 2. Pattern composites (NavBar collapses by width itself since 2.0.3): SideNavTree (the Plan L2 sidebar: a folder tree in
//    navigation-panel-organism's Content slot) and StagedAppShell (L1 stage → that stage's sidebar, header, content, bottom sheet).

const cx = (...a) => a.filter(Boolean).join(' ');

// Controlled-or-uncontrolled value helper (local to this family).
function useNbValue(value, defaultValue, onChange) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = React.useCallback((v, ...extra) => { if (!controlled) setInner(v); onChange && onChange(v, ...extra); }, [controlled, onChange]);
  return [current, set];
}

// Width of an element (ResizeObserver). Returns [ref, width]; width is null until measured.
function useNbWidth() {
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

const NB_STAGES = ['Command', 'Value', 'Explore', 'Build', 'Plan', 'Results'].map(l => ({ value: l.toLowerCase(), label: l }));

// Figma: explore-header (key ae9026ad…; Patterns copy 12:175111) — the 40px bar under the nav bar on the Explore map.
// Left (Figma "Content right slot"): smart-search-organism (248 wide, 28 tall, "Search for…") + icon-button-filter (round, 28).
// Right ("container-left"): collaborators button (Button Tertiary S, users-group, "3/5") + icon-button-comment.
// Props: search = SmartSearch props (placeholder, onSubmit, suggestions…), onFilter, filtersApplied (filter dot),
// collaborators (label, default "3/5"; null hides), onCollaborators, onComments, hasNewComments, children (extra left content),
// actions (node: replaces the right side).
function ExploreHeader({ search = {}, onFilter, filtersApplied, collaborators = '3/5', onCollaborators, onComments, hasNewComments,
  children, actions, className, ...rest }) {
  return (
    <div className={cx('ifs-explore-header', className)} {...rest}>
      <div className="ifs-explore-header__bar">
      <div className="ifs-explore-header__search">
        <IFS.SmartSearch width={248} size="s" placeholder="Search for..." {...search} />
        <IFS.FilterButton shape="round" hasNew={filtersApplied} onClick={onFilter} />
      </div>
      {children != null && <div className="ifs-explore-header__left">{children}</div>}
      <div className="ifs-explore-header__right">
        {actions || <>
          {collaborators != null && <IFS.Button type="tertiary" size="s" iconLeft="users-group" onClick={onCollaborators}
            aria-label={`Collaborators ${collaborators}`}>{collaborators}</IFS.Button>}
          <IFS.CommentButton hasNew={hasNewComments} onClick={onComments} />
        </>}
      </div>
      </div>
    </div>
  );
}

// Figma: home-row-card-organism (key c497ce96…; Patterns copy 244:117301). One ranked item on the Command (home) list.
// Type=Primary (124 tall: the top item; copper→white gradient stroke, metrics under the text, media on the right) |
// Secondary (72 tall: metrics in their own columns). State Default | Hover | Loading | Focus.
// Props: type primary|secondary, rank (counter-atom S), title, badge (label → badge-atom White S), description,
// metrics [{ value, label }] (show-metric; Figma shows two: CPV and V/C), liveAlert = MapPinDefect props (show-live-alert),
// collaboration = Avatar props (show-collaboration), media (node: primary right side, e.g. a map), onOpen (card + arrow button),
// openLabel (arrow name, default "Open"), loading, state hover|focus (forced, gallery).
function HomeRowCard({ type = 'secondary', rank, title, badge, description, metrics = [], liveAlert, collaboration, media, onOpen,
  openLabel = 'Open', loading, state, className, ...rest }) {
  const primary = type === 'primary';
  const interactive = !!onOpen && !loading;
  const onKeyDown = e => { if (interactive && e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onOpen(); } };
  const S = IFS.Skeleton;
  const head = loading
    ? <div className="ifs-home-row-card__head"><S width={250} height={16} /></div>
    : (
      <div className="ifs-home-row-card__head">
        {collaboration && <IFS.Avatar size="m" {...collaboration} />}
        {liveAlert && IFS.MapPinDefect && <IFS.MapPinDefect {...liveAlert} />}
        <span className="ifs-home-row-card__title">{title}</span>
        {badge && <IFS.Badge color="white" size="s">{badge}</IFS.Badge>}
      </div>
    );
  const text = (
    <div className="ifs-home-row-card__text">
      {head}
      {loading ? <S width={180} height={12} /> : description && <p className="ifs-home-row-card__desc">{description}</p>}
    </div>
  );
  const metricCells = metrics.map((m, i) => (
    <div key={i} className="ifs-home-row-card__metric">
      {loading ? <><S width={i ? 120 : 80} height={16} /><S width={40} height={12} /></>
        : <><span className="ifs-home-row-card__value">{m.value}</span><span className="ifs-home-row-card__label">{m.label}</span></>}
    </div>
  ));
  const arrow = <IFS.IconButton icon="arrow-right" type="secondary" size="s" label={openLabel} disabled={loading}
    onClick={e => { e.stopPropagation(); onOpen && onOpen(); }} tabIndex={interactive ? -1 : undefined} />;

  return (
    <div className={cx('ifs-home-row-card', `ifs-home-row-card--${primary ? 'primary' : 'secondary'}`, loading && 'ifs-home-row-card--loading', className)}
      data-state={state} role={interactive ? 'button' : undefined} tabIndex={interactive ? 0 : undefined} aria-busy={loading || undefined}
      aria-label={interactive ? `${rank != null ? `${rank}. ` : ''}${title}` : undefined}
      onClick={interactive ? () => onOpen() : undefined} onKeyDown={onKeyDown} {...rest}>
      <div className="ifs-home-row-card__rank">{rank != null && <IFS.Counter size="s">{loading ? '' : rank}</IFS.Counter>}</div>
      {primary ? <>
        <div className="ifs-home-row-card__body">
          {text}
          {metrics.length > 0 && <div className="ifs-home-row-card__metrics">{metricCells}</div>}
        </div>
        <div className="ifs-home-row-card__media">
          {media && !loading && <div className="ifs-home-row-card__media-art" aria-hidden="true">{media}</div>}
          <div className="ifs-home-row-card__action">{arrow}</div>
        </div>
      </> : <>
        <div className="ifs-home-row-card__body">{text}</div>
        {metricCells}
        <div className="ifs-home-row-card__action">{arrow}</div>
      </>}
    </div>
  );
}

// Pattern: SideNavTree — navigation-panel-organism (sidebar-organism View=Expanded/Collapsed) whose Content slot holds a
// folder tree, as the Plan stage draws it (Patterns 244:120655). Same shell as IFS.SideNav (title H3/UPPERCASE + collapse).
// Tree row: 32px, padding 8/8/8/4, caret (folders) + chat-folder 16 + Body/M/medium label; children indent 18px with a
// hairline guide. The open path (folders above the current row) gets a border/base outline; the current row also the
// background/elevation-1/secondary fill. Sections (e.g. "Ad hoc plans") = NavSubtitle + flat rows.
// Props: title, tree [{ id, label, folder (default: has children), children: [...] }], sections [{ label, action, items: [{ id, label }] }],
// value / defaultValue / onSelect(id, item), expanded / defaultExpanded (ids) / onExpandedChange,
// collapsed / defaultCollapsed / onCollapsedChange.
function SideNavTree({ title, tree = [], sections = [], value, defaultValue, onSelect, expanded, defaultExpanded = [], onExpandedChange,
  collapsed, defaultCollapsed = false, onCollapsedChange, className, ...rest }) {
  const [current, setCurrent] = useNbValue(value, defaultValue, onSelect);
  const [open, setOpen] = useNbValue(expanded, defaultExpanded, onExpandedChange);
  const [isCollapsed, setCollapsed] = useNbValue(collapsed, defaultCollapsed, onCollapsedChange);
  const openSet = new Set(open || []);
  // ids of folders above the current row
  const path = React.useMemo(() => {
    const find = (nodes, trail) => {
      for (const n of nodes) {
        if (n.id === current) return trail;
        if (n.children) { const r = find(n.children, [...trail, n.id]); if (r) return r; }
      }
      return null;
    };
    return new Set(find(tree, []) || []);
  }, [tree, current]);
  const toggle = id => { const s = new Set(openSet); s.has(id) ? s.delete(id) : s.add(id); setOpen([...s]); };

  const row = (n, depth) => {
    const kids = n.children || [];
    const isFolder = n.folder !== undefined ? n.folder : kids.length > 0;
    const isOpen = openSet.has(n.id);
    const sel = n.id === current;
    return (
      <li key={n.id} className="ifs-nav-tree__node">
        <button type="button" className={cx('ifs-nav-tree__row', sel && 'is-current', path.has(n.id) && 'is-path')}
          aria-current={sel ? 'page' : undefined} aria-expanded={kids.length ? isOpen : undefined}
          onClick={() => { setCurrent(n.id, n); if (kids.length && !isOpen) toggle(n.id); }}>
          {isFolder && (kids.length
            ? <span className="ifs-nav-tree__caret" role="presentation" onClick={e => { e.stopPropagation(); toggle(n.id); }}>
                <IFS.Icon name={isOpen ? 'arrow-caret-down-filled' : 'arrow-caret-right-filled'} size={12} /></span>
            : <span className="ifs-nav-tree__caret" />)}
          {isFolder && <IFS.Icon name="chat-folder" size={16} />}
          <span className="ifs-nav-tree__label" title={n.label}>{n.label}</span>
        </button>
        {kids.length > 0 && isOpen && <ul className="ifs-nav-tree__children">{kids.map(c => row(c, depth + 1))}</ul>}
      </li>
    );
  };
  return (
    <IFS.SideNav title={title} collapsed={isCollapsed} onCollapsedChange={setCollapsed} className={cx('ifs-nav-tree', className)} {...rest}>
      <ul className="ifs-nav-tree__list">{tree.map(n => row(n, 0))}</ul>
      {sections.map((s, i) => (
        <div key={s.label || i} className="ifs-nav-tree__section">
          <IFS.NavSubtitle action={s.action}>{s.label}</IFS.NavSubtitle>
          <ul className="ifs-nav-tree__list">{(s.items || []).map(n => row(n, 0))}</ul>
        </div>
      ))}
    </IFS.SideNav>
  );
}

// Pattern: StagedAppShell — the three-level navigation model as one working shell: the L1 nav bar (NavBar, collapses by width) picks the
// stage; each stage brings its own L2 sidebar, header, content and bottom sheet (IFS.AppShell slots). Below `collapseSideBelow`
// the sidebar is handed `narrow: true` so it can start collapsed (icon rail) — inferred from the Navigation page rule
// "the sidebar collapses to an icon rail on narrow widths before it disappears".
// Props: stages, value / defaultValue / onChange (stage), screens = { [stage]: { sideNav, header, bottom, content } } where each
// entry may be a node or a function ({ stage, narrow, width }) → node; navBar = extra NavBar props;
// collapseNavBelow (default 800), collapseSideBelow (default 1280, inferred), height.
function StagedAppShell({ stages = NB_STAGES, value, defaultValue, onChange, screens = {}, navBar = {}, collapseNavBelow = 800,
  collapseSideBelow = 1280, height, className, style, ...rest }) {
  const [stage, setStage] = useNbValue(value, defaultValue !== undefined ? defaultValue : stages[0] && stages[0].value, onChange);
  const [ref, w] = useNbWidth();
  const ctx = { stage, width: w, narrow: w != null && w < collapseSideBelow, setStage };
  const s = screens[stage] || {};
  const slot = k => (typeof s[k] === 'function' ? s[k](ctx) : s[k]);
  return (
    <div ref={ref} className={cx('ifs-staged-shell', className)} style={{ height, ...style }} {...rest}>
      <IFS.AppShell height="100%"
        navBar={<IFS.NavBar stages={stages} value={stage} onChange={setStage} collapseBelow={collapseNavBelow} {...navBar} />}
        sideNav={slot('sideNav')} header={slot('header')} bottom={slot('bottom')}>
        {slot('content')}
      </IFS.AppShell>
    </div>
  );
}

Object.assign(IFS, { ExploreHeader, HomeRowCard, SideNavTree, StagedAppShell });
export { ExploreHeader, HomeRowCard, SideNavTree, StagedAppShell };
