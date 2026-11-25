import React from 'react';
import { IFS } from './registry.js';
// Figma "Feedback" + "Surfaces" pages: tooltip, alert, snackbar, overlay, modal, drawer, panel, popover, floating bar.

// Controlled/uncontrolled boolean state (open, expanded).
function useSurfaceState(value, defaultValue, onChange) {
  const [inner, setInner] = React.useState(!!defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = React.useCallback(v => { if (!controlled) setInner(v); onChange && onChange(v); }, [controlled, onChange]);
  return [current, set];
}

const SURF_FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// While `active` (G4, rules 9.17–9.18): focus moves to the surface's first field (input, select, textarea, combobox); with no field, to its
// title (the aria-labelledby target, given tabIndex -1), never the header ✕; else the surface itself. Escape calls onEscape. `trap` (modal,
// drawer with a scrim) keeps Tab inside and makes the rest of the page inert (restored on close). On close focus returns to the trigger;
// if the trigger is gone, to its nearest container that is still in the page (else <main>).
const SURF_FIELD = 'input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[role=combobox]:not([aria-disabled=true])';
const SURF_KEEP_LIVE = '.ifs-live-region, .ifs-snackbar-stack, .ifs-overlay, .ifs-floating, .ifs-skip-link';
function surfInertOthers(el) {
  const set = [];
  for (let node = el; node && node.parentElement && node !== document.body; node = node.parentElement) {
    for (const sib of node.parentElement.children) {
      if (sib === node || sib.inert || sib.matches(SURF_KEEP_LIVE) || sib.tagName === 'SCRIPT' || sib.tagName === 'STYLE') continue;
      sib.inert = true; set.push(sib);
    }
  }
  return () => set.forEach(n => { n.inert = false; });
}
function useSurfaceFocus(ref, active, { onEscape, trap = false } = {}) {
  const escRef = React.useRef(onEscape);
  escRef.current = onEscape;
  React.useEffect(() => {
    if (!active || !ref.current) return;
    const prev = document.activeElement;
    const prevPath = [];
    for (let n = prev && prev.parentElement; n; n = n.parentElement) prevPath.push(n);
    const el = ref.current;
    const field = el.querySelector(SURF_FIELD);
    const titleId = el.getAttribute('aria-labelledby');
    const title = titleId && document.getElementById(titleId);
    if (!field && title && !title.hasAttribute('tabindex')) title.setAttribute('tabindex', '-1');
    (field || title || el).focus({ preventScroll: true });
    const restoreInert = trap ? surfInertOthers(el) : null;
    const onKey = e => {
      if (e.key === 'Escape' && escRef.current) { e.stopPropagation(); escRef.current(e); }
      if (trap && e.key === 'Tab') {
        const items = [...el.querySelectorAll(SURF_FOCUSABLE)];
        if (!items.length) { e.preventDefault(); return; }
        const a = items[0], z = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === a || document.activeElement === title)) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    el.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('keydown', onKey);
      restoreInert && restoreInert();
      if (prev && prev.focus && document.contains(prev)) { prev.focus({ preventScroll: true }); return; }
      const near = prevPath.find(n => document.contains(n) && n.matches(SURF_FOCUSABLE + ',main,[tabindex]'));
      const target = near || document.querySelector('main');
      if (target) { if (!target.matches(SURF_FOCUSABLE) && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
    };
  }, [active, trap]);
}

let surfUid = 0;
function useSurfaceId(p) { return React.useMemo(() => `${p}-${++surfUid}`, []); }

// Figma: tooltip-organism (67:6151)
// Props: content (Figma Label / Content slot), hotkey (hotkey-atom text, e.g. "⌘/"; absent = show-hotkey off),
// color black|grey ("grey (for black bg)"), type bottom|top|left|right = side the ARROW is on
// (bottom → bubble sits above the trigger, the default), arrow left|center|right (top/bottom only).
// Wraps one trigger child; shows after the 300ms pointer wait (M3) and at once on keyboard focus, hides instantly, Esc dismisses.
// open/onOpenChange to control. `inline` renders the bubble alone (gallery).
function Tooltip({ content, hotkey, color = 'black', type = 'bottom', arrow = 'center', delay = IFS.motionMs('--motion-duration-300', 300) /* M3: the pointer wait, the only delay */, open, defaultOpen, onOpenChange, inline, children, className }) {
  const [shown, setShown] = useSurfaceState(open, defaultOpen, onOpenChange);
  const id = useSurfaceId('ifs-tooltip');
  const timer = React.useRef();
  const side = type === 'left' || type === 'right';
  const bubble = (
    <span role="tooltip" id={id} className={IFS.cx('ifs-tooltip', `ifs-tooltip--${type}`, !side && `ifs-tooltip--arrow-${arrow}`, color === 'grey' && 'ifs-tooltip--grey', className)}>
      <span className="ifs-tooltip__body">{content}{hotkey && <span className="ifs-tooltip__hotkey">{hotkey}</span>}</span>
      <span className="ifs-tooltip__arrow" />
    </span>
  );
  React.useEffect(() => () => clearTimeout(timer.current), []);
  if (inline) return bubble;
  const show = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setShown(true), delay); };
  const hide = () => { clearTimeout(timer.current); setShown(false); };
  const child = React.Children.only(children);
  return (
    <span className="ifs-tooltip-anchor" onMouseEnter={show} onMouseLeave={hide}
      onFocus={() => { clearTimeout(timer.current); setShown(true); }} onBlur={hide}
      onKeyDown={e => { if (e.key === 'Escape' && shown) hide(); }}>
      {React.cloneElement(child, { 'aria-describedby': shown ? id : undefined })}
      {shown && bubble}
    </span>
  );
}

const SURF_ALERT_ICON = { error: 'status-error-filled', warning: 'status-warning-filled', success: 'status-success-filled' };

// Figma: alert-organism (1440:5440)
// Props: type error|warning (success = Figma variant only: screens never use a success Alert, rule 7.12), title, children = Body text, showIcon (Figma show-icon, default off),
// action = button label (Primary S; absent = show-button off), onAction, onClose (shows the close
// icon-button; Figma show-close-icon), closable=false to hide it.
function Alert({ type: t = 'error', title, children, showIcon = false, action, onAction, onClose, closable = true, className, ...rest }) {
  const type = t === 'danger' ? 'error' : t; // C1 status word
  return (
    <div role={type === 'error' ? 'alert' : 'status'} className={IFS.cx('ifs-alert', `ifs-alert--${type}`, className)} {...rest}>
      <div className="ifs-alert__text">
        <div className="ifs-alert__header">
          {showIcon && <IFS.Icon name={SURF_ALERT_ICON[type]} size={16} className="ifs-alert__icon" />}
          <span className="ifs-alert__title">{title}</span>
        </div>
        {children != null && <div className="ifs-alert__body">{children}</div>}
      </div>
      {action && <IFS.Button type="primary" size="s" onClick={onAction}>{action}</IFS.Button>}
      {closable && <IFS.IconButton className="ifs-alert__close" icon="system-close" label="Dismiss" type="ghost" size="s" onClick={onClose} />}
    </div>
  );
}

// Figma: snackbar-organism (3795:29459)
// Props: title, children = description (Content slot), secondaryAction / primaryAction = { label, onClick }
// (Secondary S + Primary S; add iconLeft, e.g. Undo → 'arrow-back-up'), onClose (close icon-button; showClose=false hides it).
// Use IFS.toast({...same props, duration}) to show one top-end (timing: rule 7.12). The Snackbar has no live role of its own (G5): the
// message reaches screen readers through IFS.announce (the always-present live regions, rule 9.19), so it is never read twice or missed.
function Snackbar({ title, children, secondaryAction, primaryAction, onClose, showClose = true, className, ...rest }) {
  const hasActions = secondaryAction || primaryAction || showClose;
  return (
    <div className={IFS.cx('ifs-snackbar', className)} {...rest}>
      <div className="ifs-snackbar__text">
        {title != null && <div className="ifs-snackbar__title">{title}</div>}
        {children != null && <div className="ifs-snackbar__desc">{children}</div>}
      </div>
      {hasActions && <div className="ifs-snackbar__actions">
        {secondaryAction && <IFS.Button type="secondary" size="s" iconLeft={secondaryAction.iconLeft} disabled={secondaryAction.disabled} onClick={secondaryAction.onClick}>{secondaryAction.label}</IFS.Button>}
        {primaryAction && <IFS.Button type="primary" size="s" iconLeft={primaryAction.iconLeft} disabled={primaryAction.disabled} onClick={primaryAction.onClick}>{primaryAction.label}</IFS.Button>}
        {showClose && <IFS.IconButton icon="system-close" label="Dismiss" type="ghost" size="s" onClick={onClose} />}
      </div>}
    </div>
  );
}

// Toast stack: newest on top. Timing (G5, Nov 25; rule 7.12):
// - with an action (Undo …): shown at least 10 s (TOAST_ACTION_MIN, or `duration` when longer); after that it never closes on time alone: it
//   closes on the user's next command elsewhere (a click on a control, an edit, a navigation; IFS.toast.command() for app-level ones). While
//   the user does nothing it stays. Moving focus, Tab, F6, scrolling and clicks on empty space are not commands.
// - without an action: closes after `duration` (default 6 s).
// - hover or keyboard focus holds either kind; `duration: 0` = sticky. One action snackbar at a time: a new one replaces the previous (its
//   action stays reachable through the screen's own undo, e.g. Ctrl+Z / history).
const TOAST_ACTION_MIN = 10000; // ms, G5: the guaranteed time an action snackbar stays
const TOAST_INFO = 6000; // ms, G5: a snackbar without an action (5–7 s, default 6)
const surfToasts = { list: [], subs: new Set(), seq: 0 };
const surfToastEmit = () => surfToasts.subs.forEach(f => f(surfToasts.list));
// M3: a dismissed snackbar fades and slides 16 out to the end side in 50 (.is-leaving), then leaves the stack.
function surfDismissToast(id) {
  if (!surfToasts.list.some(t => t.id === id && !t.leaving)) return;
  surfToasts.list = surfToasts.list.map(t => (t.id === id ? { ...t, leaving: true } : t)); surfToastEmit();
  setTimeout(() => { surfToasts.list = surfToasts.list.filter(t => t.id !== id); surfToastEmit(); }, IFS.motionMs('--motion-duration-50', 50));
}
const hasAction = t => !!(t.primaryAction || t.secondaryAction);
// A command elsewhere closes every action snackbar that is past its minimum and not held.
const toastCommandSubs = new Set();
function surfToastCommand() { [...toastCommandSubs].forEach(f => f()); }
const TOAST_COMMAND = 'button, a[href], input:not([type=text]):not([type=search]):not([type=email]):not([type=number]):not([type=password]), select, '
  + '[role=button], [role=menuitem], [role=menuitemradio], [role=menuitemcheckbox], [role=option], [role=radio], [role=tab], [role=switch], [role=checkbox]';
let toastListening = false;
function listenForCommands() {
  if (toastListening || typeof document === 'undefined') return;
  toastListening = true;
  const outside = t => t instanceof Element && !t.closest('.ifs-snackbar-stack');
  document.addEventListener('click', e => { if (outside(e.target) && e.target.closest(TOAST_COMMAND)) surfToastCommand(); }, true);
  document.addEventListener('change', e => { if (outside(e.target)) surfToastCommand(); }, true);
  window.addEventListener('popstate', surfToastCommand);
  window.addEventListener('hashchange', surfToastCommand);
}
// The one snackbar timing (rule 7.12), for IFS.toast and any pattern that shows its own Snackbar (Documents feedback):
// useSnackbarTiming({ action, duration, onClose }) → handlers to spread on the snackbar's wrapper (hover / focus hold it).
function useSnackbarTiming({ action, duration, onClose }) {
  const ms = duration === 0 ? 0 : action ? Math.max(TOAST_ACTION_MIN, duration || 0) : (duration || TOAST_INFO);
  const [held, setHeld] = React.useState(false);
  const left = React.useRef(ms), armed = React.useRef(false), heldRef = React.useRef(false), closeRef = React.useRef(onClose);
  heldRef.current = held; closeRef.current = onClose;
  React.useEffect(() => {
    listenForCommands();
    const f = () => { if (armed.current && !heldRef.current) closeRef.current && closeRef.current(); };
    toastCommandSubs.add(f);
    return () => { toastCommandSubs.delete(f); };
  }, []);
  React.useEffect(() => {
    if (held || !ms || armed.current) return undefined;
    const started = Date.now();
    const h = setTimeout(() => { if (action) armed.current = true; else closeRef.current && closeRef.current(); }, left.current);
    return () => { clearTimeout(h); left.current = Math.max(0, left.current - (Date.now() - started)); };
  }, [held]);
  return { onMouseEnter: () => setHeld(true), onMouseLeave: () => setHeld(false), onFocus: () => setHeld(true), onBlur: () => setHeld(false) };
}
function SurfToastItem({ t }) {
  const close = () => surfDismissToast(t.id);
  const hold = useSnackbarTiming({ action: hasAction(t), duration: t.duration, onClose: close });
  const wrap = a => a && { ...a, onClick: e => { a.onClick && a.onClick(e); close(); } };
  const { id, duration, description, leaving, ...props } = t;
  return (
    <div className={leaving ? 'is-leaving' : undefined} {...hold}>
      <Snackbar {...props} primaryAction={wrap(t.primaryAction)} secondaryAction={wrap(t.secondaryAction)} onClose={close}>{description}</Snackbar>
    </div>
  );
}
// C3 (Nov 23): snackbars sit top-end, below the page or Explore header (never over the nav bar or the header), one page margin
// from the window edge (--float-inset in CSS). floatTop() = the bottom of the lowest visible header, in px from the window top.
const FLOAT_HEADERS = '.ifs-page-header, .ifs-explore-header, .ifs-page-top__heading, .ifs-navbar';
function floatTop() {
  if (typeof document === 'undefined') return 0;
  let b = 0;
  for (const el of document.querySelectorAll(FLOAT_HEADERS)) { const r = el.getBoundingClientRect(); if (r.height && r.bottom > b && r.top < window.innerHeight / 2) b = r.bottom; }
  return Math.round(b);
}
IFS.floatTop = floatTop;
// C3: ONE stack element for every message (toasts, Documents feedback, live notifications), so two can never overlap.
// IFS.snackbarHost() returns it; patterns render into it with a portal. Its top is measured each time a message arrives.
function snackbarHost() {
  if (typeof document === 'undefined') return null;
  if (!surfToasts.host || !surfToasts.host.isConnected) {
    surfToasts.host = document.createElement('div');
    surfToasts.host.className = 'ifs-snackbar-stack';
    document.body.appendChild(surfToasts.host);
  }
  return surfToasts.host;
}
snackbarHost.place = (top = floatTop()) => { const h = snackbarHost(); if (h) h.style.setProperty('--float-top', `${top}px`); };
IFS.snackbarHost = snackbarHost;
function SurfToastStack() {
  const [list, setList] = React.useState(surfToasts.list);
  React.useEffect(() => { surfToasts.subs.add(setList); return () => surfToasts.subs.delete(setList); }, []);
  React.useLayoutEffect(() => { if (list.length) snackbarHost.place(); }, [list.length]);
  const h = snackbarHost();
  return h ? ReactDOM.createPortal(<>{list.map(t => <SurfToastItem key={t.id} t={t} />)}</>, h) : null;
}
// toast({ title, description, primaryAction, secondaryAction, duration }) → id. toast.dismiss(id). toast.command() = a command the page
// made outside the DOM events the kit listens to (e.g. a client-side route change). The message is announced politely (IFS.announce).
function surfToast(opts) {
  listenForCommands();
  if (!surfToasts.root) {
    const host = document.createElement('div');
    host.style.display = 'contents'; // the toasts render straight into the one stack (snackbarHost) through a portal
    document.body.appendChild(host);
    surfToasts.root = ReactDOM.createRoot(host);
    surfToasts.root.render(<SurfToastStack />);
  }
  const id = ++surfToasts.seq;
  const action = hasAction(opts);
  const duration = opts.duration;
  if (action) surfToasts.list.filter(t => hasAction(t) && !t.leaving).forEach(t => surfDismissToast(t.id)); // one action snackbar at a time
  surfToasts.list = [{ ...opts, duration, id }, ...surfToasts.list];
  surfToastEmit();
  const desc = typeof opts.description === 'string' ? opts.description : '';
  if (IFS.announce && typeof opts.title === 'string') IFS.announce(desc ? `${opts.title}. ${desc}` : opts.title);
  return id;
}
surfToast.dismiss = surfDismissToast;
surfToast.command = surfToastCommand;
// Hook form: const show = useSnackbar(); show({ title: 'Saved' })
function useSnackbar() { return surfToast; }

// Figma: overlay-background (338:21403)
// Props: type strong (--color-overlay-screen-strong + --blur-40) | base (no blur), onClick, inline (absolute, not fixed).
function Overlay({ type = 'strong', inline, className, ...rest }) {
  return <div aria-hidden="true" className={IFS.cx('ifs-overlay', `ifs-overlay--${type}`, inline && 'ifs-overlay--inline', className)} {...rest} />;
}

// Figma: modal-organism (4169:208596)
// Props: open / defaultOpen / onOpenChange, title (Header Slot), children (Content slot),
// secondaryAction / primaryAction = { label, onClick, disabled, iconLeft } (Tertiary L + Primary L, split footer),
// footer (custom footer node, replaces the two buttons), dismissible=false hides ✕ and blocks Esc/overlay close,
// overlay strong|base|none, width, inline (renders the card in place without overlay — gallery).
function Modal({ open, defaultOpen, onOpenChange, title, children, secondaryAction, primaryAction, footer, dismissible = true, overlay = 'strong', width, inline, className, style }) {
  const [isOpen, setOpen] = useSurfaceState(open, defaultOpen, onOpenChange);
  const ref = React.useRef();
  const titleId = useSurfaceId('ifs-modal-title');
  const close = () => dismissible && setOpen(false);
  useSurfaceFocus(ref, !inline && isOpen, { onEscape: close, trap: true });
  const ex = IFS.useExit(isOpen, '--motion-duration-100'); // M3: the modal closes in 100
  if (!inline && !ex.mounted) return null;
  const card = (
    <div ref={ref} role="dialog" aria-modal={inline ? undefined : 'true'} aria-labelledby={titleId} tabIndex={-1}
      className={IFS.cx('ifs-modal', !inline && ex.leaving && 'is-leaving', className)} style={{ width: IFS.remOf(width), ...style }}>
      <div className="ifs-modal__header">
        <h2 id={titleId} className="ifs-surface__title">{title}</h2>
        {dismissible && <IFS.IconButton icon="system-close" label="Close" type="ghost" size="s" onClick={close} />}
      </div>
      <div className="ifs-modal__body ifs-scroll">{children}</div>
      {(footer || secondaryAction || primaryAction) && <div className="ifs-modal__footer">
        {footer || <>
          {secondaryAction && <IFS.Button type="tertiary" size="l" iconLeft={secondaryAction.iconLeft} disabled={secondaryAction.disabled} onClick={secondaryAction.onClick}>{secondaryAction.label}</IFS.Button>}
          {primaryAction && <IFS.Button type="primary" size="l" iconLeft={primaryAction.iconLeft} disabled={primaryAction.disabled} onClick={primaryAction.onClick}>{primaryAction.label}</IFS.Button>}
        </>}
      </div>}
    </div>
  );
  if (inline) return card;
  return <>
    {overlay !== 'none' && <Overlay type={overlay} onClick={close} className={ex.leaving ? 'is-leaving' : undefined} />}
    <div className="ifs-modal-layer" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>{card}</div>
  </>;
}

// Figma: drawer-organism (4394:21241)
// Props: open / defaultOpen / onOpenChange, title (Header slot), expanded / defaultExpanded=true / onExpandedChange
// (Figma Expanded; False = header only), collapsible (show the diagonal collapse/expand button),
// showClose (show-button-close), tabs (node, show-tabs), subtitle + segmented (node, show-subtitle /
// show-segmented-control), children (Content slot), side right|left, overlay none|strong|base,
// height, inline (renders in place — gallery). Esc closes.
function Drawer({ open, defaultOpen, onOpenChange, title, expanded, defaultExpanded = true, onExpandedChange, collapsible = true, showClose = true,
  tabs, subtitle, segmented, children, side = 'right', overlay = 'none', height, inline, className, style }) {
  const [isOpen, setOpen] = useSurfaceState(open, defaultOpen, onOpenChange);
  const [isExp, setExp] = useSurfaceState(expanded, expanded === undefined ? defaultExpanded : undefined, onExpandedChange);
  const ref = React.useRef();
  const titleId = useSurfaceId('ifs-drawer-title');
  useSurfaceFocus(ref, !inline && isOpen, { onEscape: () => setOpen(false), trap: overlay !== 'none' });
  const ex = IFS.useExit(isOpen, '--motion-duration-100'); // M3: drawers slide out in 100
  if (!inline && !ex.mounted) return null;
  const panel = (
    <aside ref={ref} role="dialog" aria-modal={!inline && overlay !== 'none' ? 'true' : undefined} aria-labelledby={titleId} tabIndex={-1}
      className={IFS.cx('ifs-drawer', `ifs-drawer--${side}`, !inline && 'ifs-drawer--floating', !inline && ex.leaving && 'is-leaving', !isExp && 'ifs-drawer--collapsed', className)}
      style={{ height, ...style }}>
      <div className="ifs-drawer__header">
        <h2 id={titleId} className="ifs-surface__title">{title}</h2>
        <div className="ifs-surface__actions">
          {collapsible && <IFS.IconButton icon={isExp ? 'arrow-diagonal-collapse' : 'arrow-diagonal-expand'} label={isExp ? 'Collapse' : 'Expand'}
            aria-expanded={isExp} type="ghost" size="s" onClick={() => setExp(!isExp)} />}
          {showClose && <IFS.IconButton icon="system-close" label="Close" type="ghost" size="s" onClick={() => setOpen(false)} />}
        </div>
      </div>
      {tabs && <div className="ifs-drawer__tabs">{tabs}</div>}
      {(subtitle || segmented) && <div className="ifs-drawer__sub">
        {subtitle && <h3 className="ifs-drawer__subtitle">{subtitle}</h3>}
        {segmented}
      </div>}
      <div className="ifs-drawer__content ifs-scroll">{children}</div>
    </aside>
  );
  if (inline || overlay === 'none') return panel;
  return <><Overlay type={overlay} onClick={() => setOpen(false)} />{panel}</>;
}

// Figma: panel-organism (4305:365421); collapsed rail = sidebar-organism View=Collapsed as the pattern screens draw it.
// Props: title, actions (node, header right, before the buttons), expanded / defaultExpanded=true / onExpandedChange
// (Figma Expanded: 380px ↔ 48px rail holding only the ←| expand button), dot error|warning (status dot on the rail's button:
// red = errors / open questions, orange = warnings only), showEvidence (show-evidence-chain, circle Tertiary S icon-button),
// onEvidence, onClose (shows ✕ instead of the collapse toggle; the panel then never collapses), collapsible (default true: every panel can fold;
// false only when a screen is specifically asked to stay open: no toggle, always open; rule 4.6, Nov 20), full (fills the content area),
// children (Content slot). Lives in the page layout: no scrim, no focus trap.
function Panel({ title, actions, expanded, defaultExpanded = true, onExpandedChange, dot, showEvidence = true, onEvidence, onClose, collapsible = true, full, children, className, style }) {
  const [isExp, setExp] = useSurfaceState(expanded, expanded === undefined ? defaultExpanded : undefined, onExpandedChange);
  const label = typeof title === 'string' ? title : undefined;
  if (!isExp && !onClose && collapsible) return (
    <aside className={IFS.cx('ifs-panel', 'ifs-panel--collapsed', className)} style={style} aria-label={label}>
      <IFS.ArrowButton direction="left" type="ghost" dot={dot} label={label ? `Expand ${label.toLowerCase()}` : 'Expand panel'}
        aria-expanded={false} onClick={() => setExp(true)} />
    </aside>
  );
  return (
    <aside className={IFS.cx('ifs-panel', full && 'ifs-panel--full', className)} style={style} aria-label={label}>
      <div className="ifs-panel__header">
        <h2 className="ifs-surface__title">{title}</h2>
        <div className="ifs-panel__buttons">
          {actions}
          {showEvidence && <IFS.EvidenceButton onClick={onEvidence} />}
          {onClose
            ? <IFS.IconButton icon="system-close" label="Close" type="ghost" size="s" onClick={onClose} />
            : collapsible && <IFS.IconButton className="ifs-panel__toggle" icon="arrow-bar-right" label="Collapse panel" aria-expanded
                type="ghost" size="s" onClick={() => setExp(false)} />}
        </div>
      </div>
      <div className="ifs-panel__content ifs-scroll">{children}</div>
    </aside>
  );
}
Panel.panelMode = 'push'; // AppShell panel mode by job (Nov 19): a docked panel is used together with the page

// Figma: popover-organism (4394:56471)
// Props: trigger (element; click toggles), open / defaultOpen / onOpenChange, align start|end,
// title (Title slot; absent = show-title off), count (counter-atom), showClose,
// search (show-search: true or placeholder string), searchValue / onSearchChange(value) to control it (onSearch = alias),
// the field shows ✕ to clear once it has text, onFilter (show-filter: Secondary M icon-button),
// children (Content slot), width, inline (renders the card alone — gallery). Esc / outside click / ✕ close.
function Popover({ trigger, open, defaultOpen, onOpenChange, align = 'start', title, count, showClose = true, search, searchValue, onSearchChange, onSearch, onFilter, children, width, inline, className, style }) {
  const [isOpen, setOpen] = useSurfaceState(open, defaultOpen, onOpenChange);
  const [innerQ, setInnerQ] = React.useState('');
  const q = searchValue !== undefined ? searchValue : innerQ;
  const setQ = v => { if (searchValue === undefined) setInnerQ(v); onSearchChange && onSearchChange(v); onSearch && onSearch(v); };
  const searchInput = React.useRef();
  const ref = React.useRef();
  const anchor = React.useRef();
  const id = useSurfaceId('ifs-popover');
  useSurfaceFocus(ref, !inline && isOpen, { onEscape: () => setOpen(false) });
  React.useEffect(() => {
    if (inline || !isOpen) return;
    const onDown = e => { if (anchor.current && !anchor.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isOpen, inline]);
  const ex = IFS.useExit(isOpen, '--motion-duration-50'); // M3: small surfaces close in 50, fade only
  const card = (inline || ex.mounted) && (
    <div ref={ref} id={id} role="dialog" aria-label={typeof title === 'string' ? title : undefined} tabIndex={-1}
      className={IFS.cx('ifs-popover', align === 'end' && 'ifs-popover--end', !inline && ex.leaving && 'is-leaving', className)} style={{ width: IFS.remOf(width), ...style }}>
      {(title != null || showClose) && <div className="ifs-popover__header">
        <div className="ifs-popover__title">
          {title != null && <span className="ifs-surface__title">{title}</span>}
          {count != null && <span className="ifs-popover__counter">{count}</span>}
        </div>
        {showClose && <IFS.IconButton icon="system-close" label="Close" type="ghost" size="s" onClick={() => setOpen(false)} />}
      </div>}
      {(search || onFilter) && <div className="ifs-popover__tools">
        {search && <label className="ifs-popover__search">
          <IFS.Icon name="system-search" size={12} />
          <input ref={searchInput} type="search" value={q} placeholder={typeof search === 'string' ? search : 'Search for...'}
            aria-label={typeof search === 'string' ? search : 'Search'} onChange={e => setQ(e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape' && q) { e.stopPropagation(); setQ(''); } }} />
          {q && <IFS.IconButton icon="system-close" label="Clear search" type="ghost" size="s" className="ifs-popover__clear"
            onClick={() => { setQ(''); searchInput.current && searchInput.current.focus(); }} />}
        </label>}
        {onFilter && <IFS.IconButton icon="system-filter" label="Filter" type="secondary" size="m" onClick={onFilter} />}
      </div>}
      <div className="ifs-popover__content ifs-scroll">{children}</div>
    </div>
  );
  if (inline) return card;
  return (
    <span ref={anchor} className="ifs-popover-anchor">
      {trigger && React.cloneElement(trigger, {
        'aria-haspopup': 'dialog', 'aria-expanded': isOpen, 'aria-controls': isOpen ? id : undefined,
        onClick: e => { trigger.props.onClick && trigger.props.onClick(e); setOpen(!isOpen); },
      })}
      {card}
    </span>
  );
}

// Figma: floating-bar-organism (7405:22521)
// Props: category (type label, e.g. "Folder"), categoryIcon (default "chat-folder"), item (name or "3 items selected"),
// badge (node next to the item, e.g. an indicator), secondaryAction / primaryAction = { label, onClick }
// (Tertiary M + Primary M) or actions (node), onClose (✕ and Escape — clears the selection),
// open (default true), inline (in place instead of fixed top-centre — gallery).
function FloatingBar({ category, categoryIcon = 'chat-folder', item, badge, secondaryAction, primaryAction, actions, onClose, open = true, inline, className, style }) {
  React.useEffect(() => {
    if (inline || !open || !onClose) return;
    const onKey = e => { if (e.key === 'Escape') onClose(e); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, inline, onClose]);
  if (!open) return null;
  return (
    <div role="toolbar" aria-label={typeof item === 'string' ? item : 'Selection'} className={IFS.cx('ifs-floating-bar', !inline && 'ifs-floating-bar--floating', className)} style={style}>
      <div className="ifs-floating-bar__context">
        {category != null && <div className="ifs-floating-bar__category">{categoryIcon && <IFS.Icon name={categoryIcon} size={12} />}{category}</div>}
        <div className="ifs-floating-bar__item">{item}{badge}</div>
      </div>
      <span className="ifs-floating-bar__divider" aria-hidden="true" />
      <div className="ifs-floating-bar__buttons">
        {actions || <>
          {secondaryAction && <IFS.Button type="tertiary" size="m" onClick={secondaryAction.onClick}>{secondaryAction.label}</IFS.Button>}
          {primaryAction && <IFS.Button type="primary" size="m" onClick={primaryAction.onClick}>{primaryAction.label}</IFS.Button>}
        </>}
      </div>
      {onClose && <div className="ifs-floating-bar__close">
        <span className="ifs-floating-bar__divider" aria-hidden="true" />
        <IFS.IconButton icon="system-close" label="Clear selection" type="ghost" size="s" onClick={onClose} />
      </div>}
    </div>
  );
}

Object.assign(IFS, { Tooltip, Alert, Snackbar, toast: surfToast, useSnackbar, useSnackbarTiming, Overlay, Modal, Drawer, Panel, Popover, FloatingBar });
export { Tooltip, Alert, Snackbar, surfToast as toast, useSnackbar, useSnackbarTiming, Overlay, Modal, Drawer, Panel, Popover, FloatingBar };
