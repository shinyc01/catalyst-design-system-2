import React from 'react';
import { IFS } from './registry.js';
// Comments pattern (Patterns › Comments 12:30065, section 12:33979): canvas pins, the comments drawer list,
// the thread callout (kit CommentThread) and the rules that tie them together.

const cmCx = (...a) => IFS.cx(...a);
function useCmValue(value, defaultValue, onChange) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const v = controlled ? value : inner;
  const set = (next, ...extra) => { if (!controlled) setInner(next); onChange && onChange(next, ...extra); };
  return [v, set];
}

/* ───────────────────────────── comment-pin-organism ───────────────────────────── */

// Figma: comment-pin-organism (260:47160) — key 6c7355bd…; Patterns copy 12:30494.
// The canvas anchor of a thread. Teardrop pill (sharp bottom-left corner = the anchor point) holding up to three Avatar M.
// Props: type unread|read|cooper (Figma Type: blue / elevation-1 + blur / Cooper accent), avatars = [Avatar props] (1–3:
// Figma show-2nd-avatar / show-3rd-avatar), count (number shown on one Inactive avatar instead of authors — the screens'
// roll-up pin on a collapsed node), preview = { name, time, text, replies } (Figma State=Hover card: hover/focus shows it,
// a preview only), state hover (forced, gallery), onClick (opens the thread), label (accessible name).
// Place it with its bottom-left corner on the anchor: style={{ position:'absolute', left, top, transform:'translateY(-100%)' }}.
function CommentPin({ type = 'unread', avatars = [], count, preview, state, onClick, label, className, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const open = !!preview && (state === 'hover' || hover);
  const list = count != null ? [{ type: 'inactive', initials: String(count) }] : avatars.slice(0, 3);
  const name = label || (count != null ? `${count} comments` : preview ? `Comment by ${preview.name}` : 'Comment');
  return (
    <button type="button" aria-label={name} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}
      className={cmCx('ifs-cpin', `ifs-cpin--${type}`, open && 'ifs-cpin--open', className)} style={style} {...rest}>
      <span className="ifs-cpin__avatars">
        {list.map((a, i) => <IFS.Avatar key={i} size="m" {...a} />)}
      </span>
      {open && (
        <span className="ifs-cpin__body">
          <span className="ifs-cpin__title">
            <span className="ifs-cpin__name">{preview.name}</span>
            {preview.time && <span className="ifs-cpin__time">{preview.time}</span>}
          </span>
          <span className="ifs-cpin__text">{preview.text}</span>
          {preview.replies && <span className="ifs-cpin__replies">{preview.replies}</span>}
        </span>
      )}
    </button>
  );
}

/* ───────────────────────────── comment-drawer-card ───────────────────────────── */

// Figma: comment-drawer-card (1231:170874) — key 548d968e…; Patterns copy 12:30656. One thread row in the Comments drawer.
// Props: type new|read|resolved|cooper (Figma Type: New = unread, blue dot; Read/Resolved = Inactive avatar; Cooper = author +
// Cooper avatar and the "Need review" indicator), number ("#56"), place (where it is anchored, e.g. "Value models"),
// name, time, children = the first comment (truncated to three lines; replies are never shown in the row),
// avatar (author Avatar props; Read/Resolved render it Inactive), avatars (extra avatars, Figma show-2nd-avavtar),
// actionRequired (Figma show-action-required: Badge "Action required"; never on Resolved), cooperLabel (Cooper indicator text),
// selected (Figma State=Selected: the thread whose callout is open), state hover|selected|focus (forced, gallery),
// onClick (open the thread), onResolve (✓ on hover — absent on Resolved), menu = ⋯ items [{ label, icon, onClick, copy }].
function CommentDrawerCard({ type = 'read', number, place, name, time, children, avatar, avatars = [], actionRequired, cooperLabel = 'Need review',
  selected, state, onClick, onResolve, menu, className, ...rest }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const muted = type === 'read' || type === 'resolved';
  const author = avatar && (muted ? { ...avatar, type: 'inactive', src: undefined } : avatar);
  const isSel = selected || state === 'selected';
  const onKey = e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick && onClick(e); } };
  return (
    <div role="button" tabIndex={0} aria-pressed={isSel || undefined} onClick={onClick} onKeyDown={onKey} data-state={state}
      className={cmCx('ifs-cdcard', `ifs-cdcard--${type}`, isSel && 'ifs-cdcard--selected', menuOpen && 'ifs-cdcard--menu', className)} {...rest}>
      <div className="ifs-cdcard__box">
        <div className="ifs-cdcard__head">
          <span className="ifs-cdcard__avatars">
            {author && <IFS.Avatar size="m" {...author} />}
            {avatars.map((a, i) => <IFS.Avatar key={i} size="m" {...a} />)}
          </span>
          <span className="ifs-cdcard__meta">
            {type === 'cooper' && <IFS.Indicator type="orange">{cooperLabel}</IFS.Indicator>}
            {actionRequired && type !== 'resolved' && type !== 'cooper' && <IFS.Badge color="white" size="s">Action required</IFS.Badge>}
            {type === 'new' && <span className="ifs-cdcard__dot" aria-label="Unread" />}
          </span>
          <span className="ifs-cdcard__buttons">
            {menu && menu.length > 0 && <IFS.Menu more label="More actions" items={menu} open={menuOpen} onOpenChange={setMenuOpen} />}
            {type !== 'resolved' && onResolve && <IFS.Tooltip content="Resolve"><IFS.IconButton type="ghost" size="s" icon="system-circle-check" label="Resolve"
              onClick={e => { e.stopPropagation(); onResolve(e); }} /></IFS.Tooltip>}
          </span>
        </div>
        <div className="ifs-cdcard__comment">
          <div className="ifs-cdcard__where">
            <span>{number}</span>{place && <><span className="ifs-cdcard__bullet" aria-hidden="true" /><span>{place}</span></>}
          </div>
          <div className="ifs-cdcard__title">
            <span className="ifs-cdcard__name">{name}</span>
            {time && <span className="ifs-cdcard__time">{time}</span>}
          </div>
          <div className="ifs-cdcard__text">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── Thread callout ───────────────────────────── */

// Pattern helper: thread callout — built from CommentThread (its @ picker is CommentMentionMenu).
// The thread opened in place from a pin or a drawer row: kit CommentThread (comment-popover-organism) wired to this page's
// thread state. Props: thread = { number, resolved, comments: [{ id, name, time, text, avatar, you, mentions }] },
// currentUser { name, avatar }, people (mention list), onCommentsChange(comments), onResolve, onUnresolve, onCopyLink, onClose,
// cooperSuggestion ({ label, onClick } — Action required threads), autoFocus.
// The kit thread owns the look and menus: resolved = ⋯ (Unresolve, Copy link) + ✕ with Inactive avatars (12:44840);
// unresolved = ⋯ (Copy link) + ✓ + ✕; own reply ⋯ = Edit / Delete; the composer's @ picker draws CommentMentionMenu.
function CommentCallout({ thread, currentUser = { name: 'You' }, people = [], onCommentsChange, onResolve, onUnresolve, onCopyLink, onClose,
  cooperSuggestion, className, style }) {
  const [draft, setDraft] = React.useState('');
  React.useEffect(() => { setDraft(''); }, [thread && thread.id]);
  const resolved = !!thread.resolved;
  return (
    <div className={cmCx('ifs-ccallout', resolved && 'ifs-ccallout--resolved', className)} style={style}>
      <IFS.CommentThread number={thread.number} comments={thread.comments} onCommentsChange={onCommentsChange} currentUser={currentUser}
        resolved={resolved} onResolvedChange={r => (r ? onResolve && onResolve() : onUnresolve && onUnresolve())} onClose={onClose}
        onCopyLink={onCopyLink} mentionables={people}
        cooperSuggestion={!resolved ? cooperSuggestion : undefined}
        composerProps={{ value: draft, onChange: setDraft }} />
    </div>
  );
}

/* ───────────────────────────── Search ───────────────────────────── */

const CM_STOP = new Set('a an the me my all any show find get list give what which who whose where when is are was were about of on in for to with by from comments comment everything anything that this those these please do does did there'.split(' '));
const cmWords = s => (s || '').toLowerCase().replace(/[^\w\s.#-]/g, ' ').split(/\s+/).filter(Boolean);
// Pattern helper: comment search stand-in — plain function, no visuals.
// "Search comments" (Figma note 247:229908): Cooper reads the query and returns the matching threads — by author,
// status, time, element or content — as the same list with fewer items. This stand-in matches every meaningful word of the
// query against author, number, place, type, time and text. Returns { results, suggestion } — suggestion = the closest term
// found in the comments when nothing matches (Figma "You might be looking for").
function searchComments(threads = [], query = '') {
  const terms = cmWords(query).filter(w => !CM_STOP.has(w));
  if (!terms.length) return { results: threads, suggestion: null };
  const hay = t => cmWords([t.number, t.place, t.type === 'action' ? 'action required' : t.type, t.unread ? 'unread new' : 'read',
    ...t.comments.map(c => `${c.name} ${c.time || ''} ${c.text}`)].join(' '));
  const results = threads.filter(t => { const h = hay(t); return terms.every(w => h.some(x => x.startsWith(w) || x === w)); });
  let suggestion = null;
  if (!results.length) {
    const all = threads.flatMap(t => t.comments.map(c => c.text));
    for (const w of terms) {
      const stem = w.slice(0, Math.max(3, w.length - 2));
      for (const text of all) {
        const ws = text.split(/\s+/); const i = ws.findIndex(x => x.toLowerCase().startsWith(stem));
        if (i >= 0) { const next = ws[i + 1] && /\d/.test(ws[i + 1]) ? ` ${ws[i + 1]}` : ''; suggestion = `${ws[i]}${next}`.replace(/[^\w\s.-]+$/, ''); break; }
      }
      if (suggestion) break;
    }
  }
  return { results, suggestion };
}

/* ───────────────────────────── Comments drawer ───────────────────────────── */

// Pattern helper: Comments drawer list — built from Drawer + SegmentedControl + SmartSearch + CommentDrawerCard + EmptyState.
// The Comments panel (Figma "Map - Overview - Comments panel unresolved" 12:34047): kit Drawer titled "Comments" with an
// Unresolved | Resolved SegmentedControl, the SmartSearch "Search comments", and one CommentDrawerCard per thread,
// newest first. Rows never expand: a click opens the thread's callout on the canvas (onOpen).
// Props: threads [{ id, number, place, type: action|question|info, unread, resolved, comments }], filter / defaultFilter /
// onFilterChange ('unresolved' | 'resolved'), selectedId, onOpen(thread), onResolve(thread), onUnresolve(thread),
// onCopyLink(thread), onClose, currentUser (marks "(you)"), search(threads, query) (default searchComments), style, className.
// Empty states (EmptyState, section): all resolved → "All comments have been resolved / Ready to proceed to review.";
// search without match → No results for “<query>” + "You might be looking for" chip; nothing resolved yet → inferred copy.
function CommentsPanel({ threads = [], filter, defaultFilter = 'unresolved', onFilterChange, selectedId, onOpen, onResolve, onUnresolve,
  onCopyLink, onClose, currentUser = { name: 'You' }, search = searchComments, className, style }) {
  const [view, setView] = useCmValue(filter, defaultFilter, onFilterChange);
  const [text, setText] = React.useState('');
  const [query, setQuery] = React.useState('');
  const listRef = React.useRef(null);
  const inView = threads.filter(t => (view === 'resolved') === !!t.resolved);
  const { results, suggestion } = query ? search(inView, query) : { results: inView, suggestion: null };
  React.useEffect(() => {
    const el = listRef.current && listRef.current.querySelector('.ifs-cdcard--selected');
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }, [selectedId, view]);
  const run = q => { setText(q); setQuery(q); };
  const first = t => t.comments[0] || {};
  let empty = null;
  if (!results.length) {
    if (query) empty = <IFS.EmptyState cause="no-results-similar" icon={null} heading={`No results for “${query}”`} body={suggestion ? 'You might be looking for' : undefined}
      suggestions={suggestion ? [suggestion] : undefined} onSuggestion={run} />;
    else if (view === 'unresolved') empty = <IFS.EmptyState cause="all-done" icon={null} heading="All comments have been resolved" body="Ready to proceed to review." />;
    else empty = <IFS.EmptyState cause="empty-container" icon={null} heading="No resolved comments" body="Resolved threads are listed here." />;
  }
  return (
    <IFS.Drawer inline title="Comments" collapsible={false} onOpenChange={o => { if (!o && onClose) onClose(); }}
      className={cmCx('ifs-cpanel', className)} style={style}
      segmented={<IFS.SegmentedControl size="s" value={view} onChange={setView}
        options={[{ value: 'unresolved', label: 'Unresolved' }, { value: 'resolved', label: 'Resolved' }]} />}>
      <div className="ifs-cpanel__search">
        <IFS.SmartSearch width="100%" placeholder="Search comments" value={text} onChange={v => { setText(v); if (!v) setQuery(''); }}
          onSubmit={setQuery} onClear={() => setQuery('')} />
      </div>
      {empty ? <div className="ifs-cpanel__empty">{empty}</div> : (
        <div ref={listRef} className="ifs-cpanel__list" role="list" aria-label={`${view === 'resolved' ? 'Resolved' : 'Unresolved'} comments`}>
          {results.map(t => {
            const c = first(t); const mine = c.name === currentUser.name;
            const type = t.resolved ? 'resolved' : t.cooper ? 'cooper' : t.unread && !mine ? 'new' : 'read'; // own comments are never unread (12:47974)
            return (
              <CommentDrawerCard key={t.id} role="listitem" type={type} number={t.number} place={t.place} name={mine ? `${c.name} (you)` : c.name} time={c.time}
                avatar={{ name: c.name, ...c.avatar }} actionRequired={t.type === 'action'} selected={t.id === selectedId}
                avatars={t.cooper ? [{ type: 'cooper' }] : []}
                onClick={() => onOpen && onOpen(t)} onResolve={onResolve ? () => onResolve(t) : undefined}
                menu={[...(t.resolved ? [{ label: 'Unresolve', icon: 'arrow-back-up', onClick: () => onUnresolve && onUnresolve(t) }] : []),
                  { copy: true, onClick: () => onCopyLink && onCopyLink(t) }]}>
                {c.text}
              </CommentDrawerCard>
            );
          })}
        </div>
      )}
    </IFS.Drawer>
  );
}
CommentsPanel.panelMode = 'push'; // AppShell panel mode by job (Nov 19): used together with the whole page

/* ───────────────────────────── State ───────────────────────────── */

// Pattern helper: thread state hook — no visuals.
// Thread state for the pattern. Returns { threads, setThreads, open(id) (marks read — the blue dot goes), resolve(id) →
// next unresolved id (Figma: resolving the selected comment selects the next unresolved one), unresolve(id),
// setComments(id, comments), add(thread) (newest first, next number; starts read — it is the sender's own), unreadCount, unresolvedCount }.
function useCommentThreads({ defaultThreads = [] } = {}) {
  const [threads, setThreads] = React.useState(defaultThreads);
  const patch = (id, p) => setThreads(ts => ts.map(t => t.id === id ? { ...t, ...p } : t));
  const open = id => patch(id, { unread: false });
  const resolve = id => {
    const open = threads.filter(t => !t.resolved);
    const i = open.findIndex(t => t.id === id);
    const next = open.filter(t => t.id !== id)[Math.min(Math.max(i, 0), open.length - 2)];
    patch(id, { resolved: true, unread: false });
    return next ? next.id : null;
  };
  const unresolve = id => patch(id, { resolved: false });
  const setComments = (id, comments) => patch(id, { comments });
  const add = t => {
    const max = threads.reduce((m, x) => Math.max(m, parseInt(String(x.number).replace(/\D/g, ''), 10) || 0), 0);
    // The sender has seen their own new comment, so it starts read (no blue dot; Figma note 12:47974 — unread = not yet viewed by you).
    const nt = { id: `t${Date.now()}`, number: `#${max + 1}`, type: 'info', unread: false, resolved: false, ...t };
    setThreads(ts => [nt, ...ts]);
    return nt;
  };
  return { threads, setThreads, open, resolve, unresolve, setComments, add,
    unreadCount: threads.filter(t => t.unread && !t.resolved).length, unresolvedCount: threads.filter(t => !t.resolved).length };
}

Object.assign(IFS, { CommentPin, CommentDrawerCard, CommentCallout, CommentsPanel, useCommentThreads, searchComments });
export { CommentPin, CommentDrawerCard, CommentCallout, CommentsPanel, useCommentThreads, searchComments };
