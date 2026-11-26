import React from 'react';
import { IFS } from './registry.js';
// Data Display family — Figma page Data Display (3501:10172) + progress-bar-molecule (1674:1902).

const dataKey = v => String(v).toLowerCase().replace(/\s*\(.*\)$/, '').replace(/\s+/g, '-');

// Enter / Space activate a div[role=button] (cards contain buttons, so they cannot be <button>).
const dataClickable = (onClick, extra = {}) => onClick ? {
  role: 'button', tabIndex: 0, onClick,
  onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(e); } },
  ...extra,
} : extra;

// counter-atom (88:24147) — internal piece of group rows and grouped notifications.
const DataCounter = ({ children, className }) => <span className={IFS.cx('ifs-data-counter', className)}>{children}</span>;

// Figma: status-indicator-atom (789:39211)
// Props: state default|error|success|cooper|warning|blue, stroke (Figma Stroke=True: a 1px --color-surface-primary ring; B1: Figma 1.5 snaps to 1).
// C1 (Nov 23): the five status words info · success · warning · danger · neutral; the old words stay as aliases.
function StatusIndicator({ state = 'default', stroke, label, className, ...rest }) {
  state = { neutral: 'default', danger: 'error', info: 'blue' }[state] || state;
  return <span role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
    className={IFS.cx('ifs-status-indicator', `ifs-status-indicator--${state}`, stroke && 'ifs-status-indicator--stroke', className)} {...rest} />;
}

// Figma: badge-atom (83:52162)
// Props: color white|black|red|green|orange|info|false|loading (Figma "False" = no fill, sentence-case Label/M/medium caption; info = black fill
// with --color-text-info + --color-icon-info, as the Patterns source-card draws it), borderless (drops the black badge's --color-border edge —
// the library's Black variant has that stroke hidden), size l|m|s (default s since 2.0.7, rule 14.15; was m), iconLeft / iconRight (icon names; Figma default shows system-star-favourite on the left),
// indicator = status-indicator state (show-indicator), avatar = Avatar props (show-avatar; XS (20) in L, XXS (16) in M/S), flag = node (show-flag), children = label.
function Badge({ color = 'white', size = 's', borderless, iconLeft, iconRight, indicator, avatar, flag, children, className, ...rest }) {
  color = { danger: 'red', success: 'green', warning: 'orange', neutral: 'white' }[color] || color; // C1 status words (hue words stay as aliases)
  const sz = color === 'false' ? 's' : size;
  const iconSize = sz === 's' ? 12 : 16;
  if (color === 'loading') return <span aria-hidden="true" className={IFS.cx('ifs-badge', 'ifs-badge--loading', `ifs-badge--${size}`, 'ifs-sk', className)} {...rest} />;
  return (
    <span className={IFS.cx('ifs-badge', `ifs-badge--${color}`, `ifs-badge--${sz}`, borderless && 'ifs-badge--borderless', className)} {...rest}>
      {indicator && <StatusIndicator state={indicator} />}
      {avatar && <Avatar size={sz === 'l' ? 'xs' : 'xxs'} {...avatar} />}
      {flag}
      {iconLeft && <IFS.Icon name={iconLeft} size={iconSize} />}
      {children != null && <span>{children}</span>}
      {iconRight && <IFS.Icon name={iconRight} size={iconSize} />}
    </span>
  );
}

// Figma: status-risk-atom (260:18430) — internal; used as the avatar status.
const RISK_ATOM_ICON = { check: 'status-success-filled', warning: 'status-warning-filled', error: 'status-error-filled' };
function RiskAtom({ type = 'check', className }) {
  return (
    <span className={IFS.cx('ifs-risk-atom', `ifs-risk-atom--${type}`, className)} aria-hidden="true">
      {RISK_ATOM_ICON[type] && <IFS.Icon name={RISK_ATOM_ICON[type]} size={16} />}
      {type === 'reload' && <IFS.Icon name="arrow-refresh" size={16} />}
    </span>
  );
}

// Figma: avatar-atom (260:17144) + avatar-organism (260:19923)
// Props: initials (Figma Label, e.g. "UN") or name (initials derived), size xxs (16)|xs (20)|s (24)|m (32)|l (40)|xl (56),
// type black|red|dark-orange|orange|yellow|brown|dark-blue|blue|light-blue|green|lime|dark-purple|purple|light-purple|dark-pink|light-pink|image|awaiting|cooper|inactive|loading
//   or "auto" (picks a collaboration colour from the name), src (Type=Image), status = risk-atom type check|online|offline|warning|error (Figma show-status; absent = hidden),
// onClick makes it a button with Figma Hover/Pressed/Focus states.
const AVATAR_COLOURS = ['black', 'red', 'dark-orange', 'orange', 'yellow', 'brown', 'dark-blue', 'blue', 'light-blue', 'green', 'lime', 'dark-purple', 'purple', 'light-purple', 'dark-pink', 'light-pink'];
const initialsOf = name => String(name || '').trim().split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
function Avatar({ initials, name, type = 'black', src, size = 'm', status, state, onClick, label, className, ...rest }) {
  let t = src && type === 'black' ? 'image' : type;
  if (t === 'auto') { let h = 0; for (const ch of String(name || initials || '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0; t = AVATAR_COLOURS[1 + (h % 15)]; }
  const full = initials || initialsOf(name);
  const text = size === 'xxs' || size === 'xs' ? String(full).slice(0, 1) : full; // 16/20 px avatars show one initial (Body/S fits one letter)
  const Base = onClick ? 'button' : 'span';
  const showText = !['image', 'cooper', 'loading'].includes(t);
  return (
    <span className={IFS.cx('ifs-avatar', `ifs-avatar--${size}`, `ifs-avatar--${t}`, className)} {...rest}>
      <Base className={IFS.cx('ifs-avatar__base', t === 'loading' && 'ifs-sk')} data-state={state} onClick={onClick} type={onClick ? 'button' : undefined}
        role={onClick || t === 'loading' ? undefined : 'img'} aria-hidden={t === 'loading' && !onClick ? true : undefined} /* A11Y L10: the skeleton is hidden, LoadingRegion announces */
        aria-label={t === 'loading' && !onClick ? undefined : label || name || full || undefined} title={onClick ? (label || name) : undefined}>
        {t === 'image' && src && <img className="ifs-avatar__img" src={src} alt="" />}
        <span className="ifs-avatar__overlay" />
        {showText && <span className="ifs-avatar__name" aria-hidden="true">{text}</span>}
      </Base>
      {status && <span className="ifs-avatar__status"><RiskAtom type={status} /></span>}
    </span>
  );
}

// Figma: status-risk-molecule (69:1729)
// Props: type success|warning|error|evaluated, state hover|focus (forced, gallery) , disabled, loading,
// children = label (defaults to Figma's: auto-resolved / moderate risk / critical risk / evaluated), onClick → button.
const RISK = {
  success: ['status-success-filled', 'Auto-resolved'], warning: ['status-warning-filled', 'Moderate risk'],
  error: ['status-error-filled', 'Critical risk'], evaluated: ['status-evaluated-filled', 'Evaluated'],
};
function RiskStatus({ type = 'success', state, disabled, loading, onClick, children, className, ...rest }) {
  type = { danger: 'error', info: 'evaluated' }[type] || type; // C1 status words
  if (loading) return <span aria-hidden="true" className={IFS.cx('ifs-risk', 'ifs-risk--loading', 'ifs-sk', className)} {...rest} />;
  const [icon, def] = RISK[type] || RISK.success;
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} disabled={onClick ? disabled : undefined} aria-disabled={!onClick && disabled ? true : undefined}
      data-state={state} className={IFS.cx('ifs-risk', `ifs-risk--${type}`, className)} {...rest}>
      <IFS.Icon name={icon} size={16} />
      <span>{children != null ? children : def}</span>
    </Tag>
  );
}

// Figma: indicator-molecule (1074:180251)
// Props: type orange|green|red|blue|purple|gray|cooper|archive|loading (also the tone names warning|success|error|info|accent|neutral|disabled,
// same colours: 2.0.3), size s|xs, children = text,
// buttonRight = icon name (Figma "button right": tertiary S icon-button), onButtonClick, buttonLabel.
function Indicator({ type = 'orange', size = 's', children, buttonRight, onButtonClick, buttonLabel, className, ...rest }) {
  type = { danger: 'error' }[type] || type; // C1 status words (info, success, warning, neutral have their own classes)
  return (
    <span className={IFS.cx('ifs-indicator', `ifs-indicator--${type}`, `ifs-indicator--${size}`, className)} {...rest}>
      <span className="ifs-status-indicator" />
      {type === 'loading' ? <span className="ifs-skeleton-bar ifs-sk" /> : <span>{children}</span>}
      {buttonRight && IFS.IconButton && <IFS.IconButton icon={buttonRight} label={buttonLabel || 'Action'} type="tertiary" size="s" onClick={onButtonClick} />}
    </span>
  );
}

// Figma: status-readiness-molecule (1440:5273)
// Props: type done|warning|error|in-progress|active|loading (error = red, e.g. "Exceeded" in the Patterns file), children = label (Figma Label),
// end = text at the end of the row (Right-section=Text; renamed from `right` in 2.0.7, rule 11.4: `right` still works, deprecated until 3.0)
// OR indicators = [{ type, label }] (Right-section=Status, XS indicators).
function ReadinessStatus({ type = 'done', children, end: endIn, right, indicators, className, ...rest }) {
  const end = endIn !== undefined ? endIn : right; // deprecated alias (2.0.7 → 3.0)
  type = { success: 'done', danger: 'error' }[type] || type; // C1 status words
  const t = dataKey(type);
  const icon = t === 'done' ? 'status-success-filled' : t === 'warning' ? 'status-warning-filled' : t === 'error' ? 'status-error-filled' : null;
  const loading = t === 'loading';
  return (
    <div className={IFS.cx('ifs-readiness', `ifs-readiness--${t}`, className)} {...rest}>
      <div className="ifs-readiness__left">
        <span className="ifs-readiness__icon">{icon && <IFS.Icon name={icon} size={16} />}</span>
        {loading ? <span className="ifs-readiness__label ifs-skeleton-bar ifs-sk" /> : <span className="ifs-readiness__label">{children}</span>}
      </div>
      {indicators ? (
        <div className="ifs-readiness__right">
          {indicators.map((d, i) => <Indicator key={i} size="xs" type={loading ? 'loading' : (d.type || 'gray')}>{d.label}</Indicator>)}
        </div>
      ) : end != null && (
        <div className="ifs-readiness__right ifs-readiness__right--text">
          {loading ? <span className="ifs-skeleton-bar ifs-sk" style={{ width: 'var(--size-24)', height: 'var(--size-16)' }} /> : <span className="ifs-readiness__text">{end}</span>}
        </div>
      )}
    </div>
  );
}

// Figma: stat-card-organism (3643:35055)
// Props: size m|s (default m, rule 2.6, Nov 25: M everywhere and the only size on dashboards and in the widget builder, there with the description inline; s = an option for dense page layouts), title (show-title), value, description, descriptionPosition below|inline (below = value over a sentence-case
// Label/M/medium caption, as the Patterns file draws it; inline = the library's default slot: description beside the value), trend (e.g. "3 %"; show-trend), trendDirection up|down,
// badge = Badge props (show-badge; Figma default Color=Red S), children = additional content slot, loading,
// compare = { from, to, fromLabel, toLabel } (replaces value: two caption-over-value columns joined by an arrow, from in --color-text-softer;
// without `from` only the `to` column shows). The one stat card: it replaces QuickStatCard and CompareStatValue (2.0.3).
// Dashboards (Nov 25): one variant, size="m" descriptionPosition="inline" — its height comes from its content (--space-inset all round,
// title → value --space-inset) and is the dashboard row unit --size-data-viz-row (116 / 100 / 84); never mixed with below-description cards.
function StatCard({ size = 'm', title, value, description, descriptionPosition = 'below', trend, trendDirection = 'up', badge, compare, loading, children, className, ...rest }) {
  const m = size === 'm';
  return (
    <div className={IFS.cx('ifs-stat-card', `ifs-stat-card--${size}`, !compare && descriptionPosition === 'inline' && 'ifs-stat-card--inline', compare && 'ifs-stat-card--compare', loading && 'ifs-stat-card--loading', className)} aria-busy={loading || undefined} {...rest}>
      {(title != null || trend != null || badge || loading) && (
        <div className="ifs-stat-card__top">
          {loading ? <span className="ifs-skeleton-bar ifs-sk" style={{ flex: 1, height: 'var(--size-14)' }} /> : <span className="ifs-stat-card__title">{title}</span>}
          {trend != null && (
            <span className={IFS.cx('ifs-stat-card__trend', trendDirection === 'down' && 'ifs-stat-card__trend--down')}>
              <IFS.Icon name="arrow-caret-up-filled" size={12} />{trend}
            </span>
          )}
          {badge && !loading && <Badge color="red" size="s" {...badge} />}
        </div>
      )}
      <div className="ifs-stat-card__value-row">
        {loading ? <>
          <span className="ifs-skeleton-bar ifs-sk" style={{ width: '3.1875rem', height: m ? 'var(--size-24)' : 'var(--size-20)' }} />
          <span className="ifs-skeleton-bar ifs-sk" style={{ flex: 1, height: 'var(--size-16)' }} />
        </> : compare ? <span className="ifs-stat-card__stack">
          <span className="ifs-stat-card__compare">
            {compare.from != null && <>
              <span className="ifs-stat-card__col ifs-stat-card__col--from">
                {compare.fromLabel && <span className="ifs-stat-card__cap">{compare.fromLabel}</span>}
                <span className="ifs-stat-card__value">{compare.from}</span>
              </span>
              <span className="ifs-stat-card__arrow"><IFS.Icon name="arrow-right" size={12} /></span>
            </>}
            <span className="ifs-stat-card__col">
              {compare.toLabel && <span className="ifs-stat-card__cap">{compare.toLabel}</span>}
              <span className="ifs-stat-card__value">{compare.to}</span>
            </span>
          </span>
          {description != null && <span className="ifs-stat-card__desc ifs-stat-card__desc--below">{description}</span>}
        </span> : <>
          {description != null && descriptionPosition !== 'inline'
            ? <span className="ifs-stat-card__stack">
                <span className="ifs-stat-card__value">{value}</span>
                <span className="ifs-stat-card__desc ifs-stat-card__desc--below">{description}</span>
              </span>
            : <>
                <span className="ifs-stat-card__value">{value}</span>
                {description != null && <span className="ifs-stat-card__desc">{description}</span>}
              </>}
        </>}
      </div>
      {children != null && !loading && <div className="ifs-stat-card__extra">{children}</div>}
    </div>
  );
}

// Figma: content-card-organism (3643:32067)
// Props: size m|s, title, description (show-description), avatar = Avatar props (show-avatar, L 40),
// control = node (show-checkbox / show-radio-button / show-switch → pass IFS.Checkbox etc.), iconRight = icon name (Figma arrow-right),
// iconLeft = icon name before the title (show-icon-left; Figma default arrow-caret-right-filled),
// meta = short read-only info at the end of the title row (a count, a date, time left, a value; Body/M secondary, truncates first; rule 14.17),
// iconButton = { icon, label, onClick } (show-icon-button), top / bottom = slot nodes (with no title/description/avatar/control/icons
// the title block is skipped, so a slots-only card holds just its slots),
// tertiaryAction / primaryAction = Button props incl. children (show-buttons, show-tertiary-button, show-primary-button),
// selected, cooper (Figma State=Cooper), loading, state (forced: hover|pressed|focus|drag|selected|cooper), onClick → focusable role=button.
function ContentCard({ size = 'm', title, description, meta, avatar, control, iconLeft, iconRight, iconButton, top, bottom, tertiaryAction, primaryAction,
  selected, cooper, loading, state, onClick, className, ...rest }) {
  const bsize = size === 's' ? 's' : 'm';
  const hasMain = loading || title != null || description != null || avatar || control || iconLeft || iconRight || iconButton;
  return (
    <div {...dataClickable(onClick, { 'aria-pressed': onClick && selected != null ? !!selected : undefined })} data-state={state} aria-busy={loading || undefined}
      className={IFS.cx('ifs-content-card', `ifs-content-card--${size}`, selected && 'ifs-content-card--selected', cooper && 'ifs-content-card--cooper', loading && 'ifs-content-card--loading ifs-sk', className)} {...rest}>
      {top && <div className="ifs-content-card__slot">{top}</div>}
      {hasMain && <div className="ifs-content-card__main">
        {avatar && !loading && <Avatar size="l" {...avatar} />}
        <div className="ifs-content-card__text">
          {loading ? <>
            <span className="ifs-skeleton-bar ifs-sk" style={{ height: 'var(--size-20)' }} />
            <span className="ifs-skeleton-bar ifs-sk" style={{ width: '41%', height: 'var(--size-16)' }} />
          </> : <>
            <div className="ifs-content-card__head">
              {iconLeft
                ? <span className="ifs-content-card__lead"><IFS.Icon name={iconLeft} size={16} /><span className="ifs-content-card__title">{title}</span></span>
                : <span className="ifs-content-card__title">{title}</span>}
              {meta != null && <span className="ifs-content-card__meta">{meta}</span>}
              {control}
              {iconRight && <IFS.Icon name={iconRight} size={16} />}
              {iconButton && IFS.IconButton && <IFS.IconButton type="ghost" size="s" {...iconButton} onClick={e => { e.stopPropagation(); iconButton.onClick && iconButton.onClick(e); }} />}
            </div>
            {description != null && <div className="ifs-content-card__desc">{description}</div>}
          </>}
        </div>
      </div>}
      {bottom && <div className="ifs-content-card__slot">{bottom}</div>}
      {(tertiaryAction || primaryAction) && (
        <div className="ifs-content-card__buttons">
          {tertiaryAction && <IFS.Button type="tertiary" size={bsize} {...tertiaryAction} onClick={e => { e.stopPropagation(); tertiaryAction.onClick && tertiaryAction.onClick(e); }} />}
          {primaryAction && <IFS.Button type="primary" size={bsize} {...primaryAction} onClick={e => { e.stopPropagation(); primaryAction.onClick && primaryAction.onClick(e); }} />}
        </div>
      )}
    </div>
  );
}

function TableSort({ dir, state }) {
  return (
    <span className={IFS.cx('ifs-table-sort', dir && `ifs-table-sort--${dir}`)} data-state={state} aria-hidden="true">
      {!dir && <IFS.Icon name="arrow-selector" size={16} />}
    </span>
  );
}

// Number cells are right-aligned by default (table-cell-atom Type=Number exists only as Align=Right).
const alignOf = c => c.align || (c.type === 'number' ? 'right' : null);

// F1: a missing value is "—" (IFS.format), read as "No value"; zero is never a dash.
const NoValue = () => <><span aria-hidden="true">{IFS.format.empty()}</span><span className="ifs-sr-only">No value</span></>;
function renderCell(col, row) {
  if (col.render) return col.render(row);
  const v = row[col.key];
  if ((!col.type || col.type === 'text' || col.type === 'number') && (v == null || v === '' || (typeof v === 'number' && Number.isNaN(v)) || v === IFS.format.empty())) return <NoValue />;
  switch (col.type) {
    case 'description': return <div className="ifs-table__stack"><span>{v && v.text}</span><span className="ifs-table__desc">{v && v.description}</span></div>;
    case 'counter': return <><span>{v && v.text}</span>{v && v.value != null && <span className={IFS.cx('ifs-table__trend', v.direction === 'down' && 'ifs-table__trend--down')}><IFS.Icon name="arrow-caret-up-filled" size={12} />{v.value}</span>}</>;
    case 'badge': return v ? <Badge {...(typeof v === 'object' ? v : { children: v })} /> : null;
    case 'status': return v ? <><Indicator type={v.type}>{v.label}</Indicator>{v.description && <span className="ifs-table__status-desc">{v.description}</span>}</> : null;
    case 'check': return v ? <><IFS.Icon name="status-success-filled" size={16} /><span>{v}</span></> : null;
    case 'user': return v ? <><Avatar size="s" {...v} /><span className="ifs-table__ellipsis">{v.name}</span></> : null;
    case 'user-description': return v ? <><Avatar size="s" {...v} /><div className="ifs-table__stack ifs-table__stack--user"><span className="ifs-table__username">{v.name}</span><span className="ifs-table__desc">{v.description}</span></div></> : null;
    default: return v;
  }
}

// Figma: table-card-organism (4835:4031) with table-header-molecule (1440:5904), table-cell-atom (1440:5941),
// table-sort-atom (1440:5921), table-filter-atom (1440:5932), group-row-molecule (4833:19072), content-row-molecule (4835:3501).
// Figma rule: tables show every row (no pagination). Filter with the `tabs` slot: the Figma table card puts a
// SegmentedControl there (prop "show-segmanted-control"); the canvas notes call it "tabs with counts".
// Props:
//   columns = [{ key, title, width ('1fr' | 240 | 'auto'), align left|center|right (Figma Align=Left|Right; the header follows its column), sortable, sortValue(row), primary (medium-weight name column; default the first text column),
//               type text|number|description|counter|badge|status|check|user|user-description|custom, render(row), filter: { applied, onClick } }]
//     cell values by type: text → row[key]; number → row[key] (Figma Type=Number, right-aligned unless align is set); description → { text, description }; counter → { text, value, direction };
//     badge → Badge props; status → { type, label, description }; check → label; user → { name, initials, type, description }.
//   rows = [{ id, ...data }], groupBy = key or fn(row) → group title (group-row-molecule, expand/collapse), defaultCollapsed = [titles],
//   groups (Nov 20): collapsed / onCollapsedChange(titles) to control which are folded; groupOrder = [titles] (fixed order, groups with no
//   rows still show); groupInfo(title, rows) → { locked, note, end }: locked = a lock instead of the caret, can't open, rows hidden;
//   note = short text after the title ("Opens when Executive is approved"); end = node at the row's end (default: the row count);
//   headerPerGroup = the column header sits under each open group instead of once at the top (sectioned table, e.g. approval stages),
//   sort / defaultSort = { key, dir: 'asc'|'desc' }, onSortChange, selectedId / onRowClick (row hover + selected),
//   title (show-table-name), tabs (show-segmanted-control), search (right side of the bar). Without title/tabs/search it renders the bare table.
//   rowHeight = content-row min height in px (default 60, Figma content-row-molecule),
//   rowProps(row) → { className, style, ...attributes } merged onto that content row (drag states, data-* hooks).
function Table({ columns = [], rows = [], groupBy, defaultCollapsed = [], collapsed: collapsedProp, onCollapsedChange, groupOrder, groupInfo, headerPerGroup,
  sort, defaultSort = null, onSortChange,
  selectedId, onRowClick, rowKey = 'id', rowHeight, rowProps, title, tabs, search, className, ...rest }) {
  // M3 (Nov 23): when the rows change (a tab change, a filter), the new rows show at once and only the table height glides
  // (200, standard), so nothing below jumps. Reduced motion snaps.
  const glideRef = React.useRef(null), lastH = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = glideRef.current; if (!el) return undefined;
    const to = el.offsetHeight, from = lastH.current; lastH.current = to;
    if (from == null || from === to || (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)) return undefined;
    el.style.overflow = 'hidden'; el.style.height = `${from}px`; void el.offsetHeight;
    el.style.transition = 'height var(--motion-duration-200) var(--motion-ease-standard)'; el.style.height = `${to}px`;
    const t = setTimeout(() => { el.style.height = ''; el.style.transition = ''; el.style.overflow = ''; }, IFS.motionMs('--motion-duration-200', 200));
    return () => clearTimeout(t);
  }, [rows]);
  const [inner, setInner] = React.useState(defaultSort);
  const cur = sort !== undefined ? sort : inner;
  const [collapsedInner, setCollapsedInner] = React.useState(() => new Set(defaultCollapsed));
  const collapsed = collapsedProp !== undefined ? new Set(collapsedProp) : collapsedInner;
  const setCollapsed = f => { const n = f(collapsed); if (collapsedProp === undefined) setCollapsedInner(n); onCollapsedChange && onCollapsedChange([...n]); };
  const setSort = s => { if (sort === undefined) setInner(s); onSortChange && onSortChange(s); };
  const cycle = key => setSort(!cur || cur.key !== key ? { key, dir: 'asc' } : cur.dir === 'asc' ? { key, dir: 'desc' } : null);

  const sorted = React.useMemo(() => {
    if (!cur) return rows;
    const col = columns.find(c => c.key === cur.key) || {};
    const val = r => { const v = col.sortValue ? col.sortValue(r) : r[cur.key]; return v && typeof v === 'object' ? (v.text ?? v.name ?? v.label ?? v.children ?? '') : v; };
    const m = cur.dir === 'desc' ? -1 : 1;
    return [...rows].sort((a, b) => {
      const x = val(a), y = val(b);
      if (x == null) return 1; if (y == null) return -1;
      return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true })) * m;
    });
  }, [rows, columns, cur]);

  // Primary (name) column is medium, every other cell regular: the column with primary: true, else the first text/description/custom column.
  const primaryKey = (columns.find(c => c.primary) || columns.find(c => !c.type || ['text', 'description', 'custom'].includes(c.type)) || {}).key;
  // Columns keep a minimum width (Nov 19, reflow / 400% zoom): flexible columns never squash below --table-col-short-min;
  // when the card is narrower than the columns need, the table scrolls sideways inside its card instead. Fixed widths are in rem.
  const flexCol = fr => `minmax(max(var(--table-col-short-min), var(--table-col-flex-min)), ${fr})`; // 120, or 160 when the user enlarges text
  const cols = columns.map(c => c.width == null ? flexCol('1fr') : typeof c.width === 'number' ? `calc(${c.width / 16}rem * var(--density-scale))`
    : /^\d*\.?\d+fr$/.test(String(c.width).trim()) ? flexCol(String(c.width).trim()) : c.width).join(' ');
  const groupOf = typeof groupBy === 'function' ? groupBy : groupBy ? r => r[groupBy] : null;
  const groups = [];
  if (groupOf) { const map = new Map(); (groupOrder || []).forEach(g => { map.set(g, []); groups.push([g, map.get(g)]); });
    sorted.forEach(r => { const g = groupOf(r); if (!map.has(g)) { map.set(g, []); groups.push([g, map.get(g)]); } map.get(g).push(r); }); }

  const renderRow = row => {
    const id = row[rowKey];
    const sel = selectedId != null && id === selectedId;
    const { className: xCls, style: xStyle, ...xAttrs } = (rowProps && rowProps(row)) || {};
    return (
      <div role="row" key={id} {...xAttrs} style={xStyle} aria-selected={onRowClick ? sel : undefined} {...(onRowClick ? { tabIndex: 0, onClick: () => onRowClick(row), onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(row); } } } : {})}
        className={IFS.cx('ifs-table__row', 'ifs-table__row--content', onRowClick && 'ifs-table__row--clickable', sel && 'ifs-table__row--selected', xCls)}>
        {columns.map(c => <div role="cell" key={c.key} className={IFS.cx('ifs-table__td', `ifs-table__td--${c.type || 'text'}`, alignOf(c) && `ifs-table__td--${alignOf(c)}`, c.key === primaryKey && 'ifs-table__td--primary')}>{renderCell(c, row)}</div>)}
      </div>
    );
  };

  const headerRow = (
      <div role="row" className="ifs-table__row ifs-table__row--header">
        {columns.map(c => {
          const dir = cur && cur.key === c.key ? cur.dir : null;
          return (
            <div role="columnheader" key={c.key} aria-sort={dir ? (dir === 'asc' ? 'ascending' : 'descending') : undefined}
              className={IFS.cx('ifs-table__th', alignOf(c) && `ifs-table__th--${alignOf(c)}`)}>
              {c.sortable ? (
                <button type="button" className="ifs-table__th-btn" onClick={() => cycle(c.key)}>
                  <span className="ifs-table__th-label" title={typeof c.title === 'string' ? c.title : undefined}>{c.title}</span><TableSort dir={dir} />
                </button>
              ) : c.title != null && c.title !== '' ? <span className="ifs-table__th-label" title={typeof c.title === 'string' ? c.title : undefined}>{c.title}</span> : c.title}
              {c.filter && <IFS.IconButton icon="system-filter" type="ghost" size="s" label={`Filter ${c.title || ''}`} onClick={c.filter.onClick}
                className={IFS.cx('ifs-table-filter', c.filter.applied && 'ifs-table-filter--applied')} />}
            </div>
          );
        })}
      </div>
  );
  const table = (
    <div ref={glideRef} role="table" className={IFS.cx('ifs-table', !(title || tabs || search) && className)} style={{ '--cols': cols, ...(rowHeight != null && { '--ifs-table-row-h': `${rowHeight / 16}rem` }) }} {...(title || tabs || search ? {} : rest)}>
      {!(groupOf && headerPerGroup) && headerRow}
      {groupOf ? groups.map(([g, rs]) => {
        const info = (groupInfo && groupInfo(g, rs)) || {};
        const open = !info.locked && !collapsed.has(g);
        return (
          <React.Fragment key={String(g)}>
            <div role="row" className="ifs-table__group-row"><div role="cell" aria-colspan={columns.length} className="ifs-table__group-cell">{/* row > cell keeps the table structure for screen readers (WCAG 1.3.1) */}
            <button type="button" className={IFS.cx('ifs-table__group', info.locked && 'ifs-table__group--locked')} aria-expanded={info.locked ? undefined : open}
              aria-disabled={info.locked || undefined} onClick={() => { if (!info.locked) setCollapsed(s => { const n = new Set(s); open ? n.add(g) : n.delete(g); return n; }); }}>
              {info.locked ? <IFS.Icon name="lock" size={16} />
                : <IFS.Icon name={open ? 'arrow-caret-up-filled' : 'arrow-caret-left-filled'} size={16} className="ifs-table__group-caret" />}
              <span className="ifs-table__group-title">{g}{info.note && <span className="ifs-table__group-note">{info.note}</span>}</span>
              {info.end !== undefined ? info.end : !info.locked && <DataCounter>{rs.length}</DataCounter>}
            </button>
            </div></div>
            {open && headerPerGroup && headerRow}
            {open && rs.map(renderRow)}
          </React.Fragment>
        );
      }) : sorted.map(renderRow)}
    </div>
  );
  if (!(title || tabs || search)) return table;
  return (
    <div className={IFS.cx('ifs-table-card', className)} {...rest}>
      {title && <div className="ifs-table-card__name">{title}</div>}
      {(tabs || search) && <div className="ifs-table-card__bar">{tabs || <span />}{search}</div>}
      {table}
    </div>
  );
}

// Figma: notification-card (9943:5373)
// Type = what happened: all (avatar + action tag), specific (avatar, no tag), grouped (Cooper avatar + count).
// Read: read hides the unread dot. critical (show-critical) adds status-error-filled on the leading icon's top-right (aria-label "Critical").
// actionRequired (show-action-required, default on): the tag in the title row — only for Action needed / Outcome; turn off once
// Resolved / Acknowledged / Unavailable or for a successful outcome. Hidden for type="specific".
// Props: title, details (show-details), meta ("{item} · {area}"), time, status = Badge props (show-status),
// actions = [{ label, onClick }] up to two (show-actions: Secondary + Tertiary S buttons), avatar = Avatar props, count (grouped),
// actionLabel (tag text, default "Action required"), onClick → focusable card.
function NotificationCard({ type = 'all', read = false, title, details, meta, time, critical, status, actions, actionRequired = true,
  actionLabel = 'Action required', avatar, count, onClick, className, ...rest }) {
  const isRead = read === true || read === 'read';
  const tag = actionRequired && type !== 'specific';
  return (
    // A11Y M4 (final audit): the card's main action is one real button (the title, stretched over the card), the action buttons are its siblings
    <div className={IFS.cx('ifs-notification', onClick && 'ifs-notification--clickable', `ifs-notification--${type}`, isRead ? 'ifs-notification--read' : 'ifs-notification--unread', tag && 'ifs-notification--has-tag', className)} {...rest}>
      <div className="ifs-notification__lead">
        <Avatar size="m" type={type === 'grouped' ? 'cooper' : 'black'} initials="UN" {...avatar} />
        {critical && <span className="ifs-notification__critical" role="img" aria-label="Critical"><IFS.Icon name="status-error-filled" size={12} /></span>}
        {type === 'grouped' && count != null && <DataCounter className="ifs-notification__count">{count}</DataCounter>}
      </div>
      <div className="ifs-notification__content">
        <div className="ifs-notification__title-row">
          <span className="ifs-notification__title">{onClick ? <button type="button" className="ifs-notification__main" onClick={onClick}>{title}</button> : title}</span>
          {tag && <Badge color="white" size="s">{actionLabel}</Badge>}
        </div>
        {details != null && <div className="ifs-notification__details">{details}</div>}
        <div className="ifs-notification__meta-row">
          {status && <Badge color="white" size="s" {...status} />}
          <span className="ifs-notification__meta">{meta}</span>
          <span className="ifs-notification__time">{time}</span>
        </div>
        {actions && actions.length > 0 && (
          <div className="ifs-notification__actions">
            {actions.slice(0, 2).map((a, i) => <IFS.Button key={i} size="s" type={i === 0 ? 'secondary' : 'tertiary'} {...a}
              onClick={e => { e.stopPropagation(); a.onClick && a.onClick(e); }}>{a.label}</IFS.Button>)}
          </div>
        )}
      </div>
      {!isRead && <span className="ifs-notification__unread"><StatusIndicator state="error" label="Unread" /></span>}
    </div>
  );
}

// Figma: progress-bar-molecule (1674:1902); showValue = progress-bar-loading (5530:11867, bar + rounded percentage).
// Props: value 0–100 (Figma % variants 0/10/20/40/50/60/80/100 — any value works), label = accessible name,
// showValue (adds the percentage; replaces ProgressLoading, 2.0.3).
function ProgressBar({ value = 0, label = 'Progress', showValue, className, ...rest }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  if (showValue) {
    const r = Math.round(v);
    return (
      <div className={IFS.cx('ifs-progress-loading', className)} {...rest}>
        <ProgressBar value={r} label={label} />
        <span className="ifs-progress-loading__value" aria-hidden="true">{r}%</span>
      </div>
    );
  }
  return (
    <span role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} className={IFS.cx('ifs-progress', className)} {...rest}>
      {v > 0 && <span className="ifs-progress__bar" style={{ width: `${v}%` }} />}
    </span>
  );
}

Object.assign(IFS, { Badge, StatusIndicator, Avatar, RiskStatus, ReadinessStatus, Indicator, StatCard, ContentCard, Table, NotificationCard, ProgressBar });
export { Badge, StatusIndicator, Avatar, RiskStatus, ReadinessStatus, Indicator, StatCard, ContentCard, Table, NotificationCard, ProgressBar };
