// Review board for the 2.0.3 duplicate-component decisions. Every example is the real kit component:
// gallery sections are imported from src/gallery, mock-ups use IFS components directly.
// Build: node review/build.mjs  →  review/review.js + review/review.css (open review/index.html).
import React from 'react';
import { createRoot } from 'react-dom/client';
import { IFS } from '../src/components/index.js';
import '../src/gallery/gallery.css';
import './board.css';

import g1 from '../src/gallery/activity.jsx';
import g2 from '../src/gallery/button.jsx';
import g3 from '../src/gallery/canvas.jsx';
import g4 from '../src/gallery/charts.jsx';
import g5 from '../src/gallery/data.jsx';
import g6 from '../src/gallery/extras.jsx';
import g7 from '../src/gallery/forms.jsx';
import g8 from '../src/gallery/navigation.jsx';
import g9 from '../src/gallery/patterns-activity.jsx';
import g10 from '../src/gallery/patterns-approval.jsx';
import g11 from '../src/gallery/patterns-collaboration.jsx';
import g12 from '../src/gallery/patterns-comments.jsx';
import g13 from '../src/gallery/patterns-cooper.jsx';
import g14 from '../src/gallery/patterns-documents.jsx';
import g15 from '../src/gallery/patterns-evidence.jsx';
import g16 from '../src/gallery/patterns-nav-bar.jsx';
import g17 from '../src/gallery/patterns-table.jsx';
import g18 from '../src/gallery/patterns-trace.jsx';
import g19 from '../src/gallery/patterns-widget-builder.jsx';
import g20 from '../src/gallery/selection.jsx';
import g21 from '../src/gallery/states.jsx';
import g22 from '../src/gallery/surfaces.jsx';

const GALLERY = {};
[g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12, g13, g14, g15, g16, g17, g18, g19, g20, g21, g22].flat().forEach(s => { GALLERY[s.name] = s; });

class Safe extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() { return this.state.err ? <div className="rv-err">Couldn't render: {String(this.state.err.message || this.state.err)}</div> : this.props.children; }
}
const G = name => { const s = GALLERY[name]; return s ? <div className="rv-gallery">{s.render()}</div> : <div className="rv-err">Missing gallery section "{name}"</div>; };

/* ---------- small mock-ups for proposals that don't exist as one component yet ---------- */
const { Menu, ActionMenu, StatusIndicator, Indicator, Badge, Chip, ContentCard, Search, Select, Popover, LegendSwatch, InfoHintItem,
  IconButton, EvidenceButton, Avatar, EmptyState, DataVizBar } = IFS;
const MENU = [{ label: 'Compare', icon: 'compare' }, { label: 'Duplicate', icon: 'duplicate' }, { label: 'Rename', icon: 'system-edit-rename' }, { divider: true }, { label: 'Delete', icon: 'system-trash-delete', danger: true }];
const MENU_AM = [{ label: 'Compare', icon: 'compare' }, { label: 'Duplicate', icon: 'duplicate' }, { label: 'Rename', icon: 'system-edit-rename' }, { label: 'Delete', icon: 'system-trash-delete', destructive: true }];
const Stack = ({ children, gap = 12 }) => <div style={{ display: 'flex', flexDirection: 'column', gap, alignItems: 'flex-start' }}>{children}</div>;
const Line = ({ children, gap = 16 }) => <div style={{ display: 'flex', gap, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>;
const Cap = ({ children }) => <div className="rv-cap">{children}</div>;
const Dot = ({ c, s = 8 }) => <span style={{ display: 'inline-block', width: s, height: s, borderRadius: '50%', background: c }} />;

const mockups = {
  legendProposal: () => <Stack>
    <Cap>LegendSwatch today (group + step)</Cap>
    <Line><LegendSwatch color="alert" step={5} label="Loss" /><LegendSwatch color="deep-green" step={5} label="Gain" /><LegendSwatch color="rose" label="Title" value="$1.2M" /></Line>
    <Cap>InfoHintItem today (fills its row, value pushed right, neutral swatch)</Cap>
    <div style={{ width: 240 }}><Stack gap={8}>
      <InfoHintItem label="Loss" color="var(--data-viz-alert-data-5)" value="36" />
      <InfoHintItem label="Unchanged" neutral value="745" />
      <InfoHintItem label="Gain" color="var(--data-viz-deep-green-data-5)" icon="system-info-hint" value="519" />
    </Stack></div>
  </Stack>,
  menus: () => <Line gap={24}>
    <Stack><Cap>Menu (200 wide, red Delete after a divider)</Cap><Menu inline items={MENU} width={200} label="Actions" /></Stack>
    <Stack><Cap>ActionMenu (180, destructive moved last)</Cap><ActionMenu inline items={MENU_AM} /></Stack>
    <Stack><Cap>160 wide (Activity / Comments / Documents)</Cap><Menu inline items={MENU} width={160} label="Actions" /></Stack>
  </Line>,
  triggers: () => <Line gap={24}>
    <Stack><Cap>⋮ vertical (tables, library rows, documents, widgets)</Cap><IconButton icon="system-dots-vertical" label="More" type="ghost" size="s" /></Stack>
    <Stack><Cap>⋯ horizontal (comments, activity, versions)</Cap><IconButton icon="system-dots-horizont" label="More" type="ghost" size="s" /></Stack>
  </Line>,
  evidence: () => <Line gap={32}>
    <Stack><Cap>Chart header button today: 14px icon</Cap>
      <button type="button" aria-label="Ask Cooper" className="ifs-icon-button ifs-icon-button--tertiary ifs-icon-button--s ifs-icon-button--circle"><IFS.Icon name="cooper-evidence-icon" variant="medium" size={14} /></button></Stack>
    <Stack><Cap>EvidenceButton: 16px icon (every other icon button)</Cap><EvidenceButton /></Stack>
  </Line>,
  legacyCards: () => <Line gap={24}>
    <Stack><Cap>VersionCard → ContentCard</Cap><div style={{ width: 300 }}>
      <ContentCard title="Version 3 changes" bottom={<Stack gap={6}><Indicator size="xs" type="orange">Objective weights</Indicator><Indicator size="xs" type="green">Value model</Indicator></Stack>}
        tertiaryAction={{ children: 'Discard' }} primaryAction={{ children: 'Publish' }} /></div></Stack>
    <Stack><Cap>SourceCard → ContentCard</Cap><div style={{ width: 300 }}>
      <ContentCard top={<IFS.Button type="tertiary" size="s" iconLeft="system-file">Asset health report.pdf</IFS.Button>}
        description="“Transformer T-12 shows accelerated insulation ageing; replacement within 3 years is advised.”"
        bottom={<Badge color="info" size="s" iconLeft="system-access-point">Page 14</Badge>} /></div></Stack>
    <Stack><Cap>SidebarNodeCard → ContentCard (drag icon on the right)</Cap><div style={{ width: 300 }}>
      <ContentCard title="Reduce outage minutes" description="Objective · Reliability" iconRight="system-drag-and-drop" draggable /></div></Stack>
  </Line>,
  search: () => <Line gap={32}>
    <Stack><Cap>Search (the kit field)</Cap><div style={{ width: 280 }}><Search placeholder="Search people" /></div></Stack>
    <Stack><Cap>Popover's built-in search today</Cap><Popover inline title="Add people" search searchValue="" onSearchChange={() => {}} width={320}><div className="t-body-m-regular" style={{ color: 'var(--text-secondary)' }}>(list)</div></Popover></Stack>
  </Line>,
  role: () => <Line gap={32}>
    <Stack><Cap>RoleSelect today (24 tall, 28px rows)</Cap><IFS.RoleSelect defaultValue="editor" onRemove={() => {}} /></Stack>
    <Stack><Cap>Select S (control height, 4px from the trigger)</Cap><div style={{ width: 140 }}>
      <Select size="m" defaultValue="editor" clearable={false} options={[{ value: 'editor', label: 'Editor' }, { value: 'viewer', label: 'Viewer' }, { divider: true }, { label: 'Remove', action: true, danger: true, onClick: () => {} }]} /></div></Stack>
  </Line>,
  empty: () => <Line gap={32}>
    <Stack><Cap>Chart empty today (title + text, gap 8)</Cap><div className="ifs-dv-empty" style={{ width: 320, height: 200, border: '1px dashed var(--border-base)' }}>
      <span className="t-heading-h4-semibold">No data yet</span><span className="t-body-m-regular" style={{ color: 'var(--text-secondary)' }}>Add investments to see this chart.</span></div></Stack>
    <Stack><Cap>EmptyState (inset padding, gaps 20 / 16 / 12)</Cap><div style={{ width: 320 }}><EmptyState title="No data yet" description="Add investments to see this chart." /></div></Stack>
  </Line>,
  status: () => <Stack gap={16}>
    <Cap>Same colour, five sets of names today</Cap>
    <table className="rv-table"><thead><tr><th>Tone (proposed)</th><th>StatusIndicator</th><th>Indicator</th><th>Chip dot</th><th>Readiness / Risk / Approval</th></tr></thead><tbody>
      {[['success', 'success', 'green', 'success', 'done / success / success'], ['warning', 'warning', 'orange', 'warning', 'warning / warning / awaiting'], ['error', 'error', 'red', 'danger', 'error / error / rejected'],
        ['info', 'blue', 'blue', 'info', '—'], ['accent', '—', 'purple', '—', '— / evaluated / —'], ['neutral', 'default', 'gray', '—', 'in-progress / — / empty'], ['cooper', 'cooper', 'cooper', '—', '—'], ['disabled', 'default', 'archive', '—', '—']]
        .map(r => <tr key={r[0]}><td><Indicator type={r[0]}>{r[0]}</Indicator></td>{r.slice(1).map((c, i) => <td key={i}><code>{c}</code></td>)}</tr>)}
    </tbody></table>
    <Cap>Neutral dot: two greys today</Cap>
    <Line gap={24}><Line gap={6}><StatusIndicator state="default" /><span className="t-body-m-regular">StatusIndicator default · #4d4d4d (--icon-disabled)</span></Line>
      <Line gap={6}><Indicator type="gray">Indicator gray · #8c8c8c (--icon-tertiary)</Indicator></Line></Line>
    <Cap>Dot sizes today: 8 (Indicator S, StatusIndicator) · 6 (Indicator XS, Chip) · 4 (Badge)</Cap>
    <Line gap={24}><Indicator type="orange" size="s">Pending approval (S, 8)</Indicator><Indicator type="orange" size="xs">Pending approval (XS, 6)</Indicator>
      <Chip indicator="warning">Chip (6)</Chip><Badge indicator="warning">Badge (4)</Badge></Line>
  </Stack>,
  headers: () => <Stack gap={16}>
    <Cap>Card titles: ContentCard / WidgetCard use Label/M, chart and table cards use H4</Cap>
    <Line gap={24}><div style={{ width: 260 }}><ContentCard title="Grid modernisation" description="Label/M title (ContentCard)" /></div>
      <div style={{ width: 300, padding: 16, borderRadius: 8, background: 'var(--surface-secondary-alpha)' }}><div className="t-heading-h4-semibold">Spend by year</div><div className="t-body-m-regular" style={{ color: 'var(--text-secondary)' }}>H4 title (DataViz / table card)</div></div></Line>
  </Stack>,
};

/* ---------- the decisions ---------- */
const S = 'suggest';
const ITEMS = [
  { sec: 'A. Merges that change the look', id: 'A1', title: 'Legend entry: one LegendSwatch, two layouts (done)',
    q: 'Done on Nov 19 from your feedback.',
    cols: [{ label: 'LegendSwatch / Legend: inline (horizontal) and row (vertical), values on or off', g: 'LegendSwatch' }],
    [S]: 'Done: InfoHintItem is gone. Entries take the data\'s colour (data-viz group + step, a data-viz token, or neutral). Charts only accept data-viz colours now. Neutral grey: --data-viz-neutral = --icon-tertiary (#8c8c8c), 5.2–6.3:1 on page, card and chart backgrounds (WCAG 1.4.11 needs 3:1); bars and swatch match.' },
  { id: 'A2', title: 'Chart bar: BarChartItem → DataVizBar',
    q: 'Which bar look and which colour system?',
    cols: [{ label: 'DataVizBar (keeper candidate)', g: 'DataVizBar' }, { label: 'BarChartItem (1–9 palette)', g: 'BarChartItem' }],
    [S]: 'DataVizBar: group + step colours, hover / out-of-focus states, value label with tabular figures. The 1–9 palette stays only for categorical charts (one colour per category), not for bars.' },
  { id: 'A3', title: 'Stacked column: VerticalBarChartItem vs DataVizGroupedBar',
    q: 'Merge or keep both?',
    cols: [{ label: 'VerticalBarChartItem', g: 'VerticalBarChartItem' }, { label: 'DataVizGroupedBar', g: 'DataVizGroupedBar' }],
    [S]: 'Parked: revisit in the data-viz pass (your call, Nov 19).' },
  { id: 'A4', title: 'Menus: one Menu, two widths, ⋯ trigger (done)',
    q: 'Done on Nov 19. Check the two widths and the ⋯ trigger.',
    cols: [{ label: 'Menu: size s 200 · size l 320 · destructive last · copy link · more (⋯) trigger', g: 'Menu' }],
    [S]: 'Done. One Menu replaces ActionMenu, CommentMenu, CooperMenu and the comment/thread menus. size s = 200 (action menus), size l = 320 (the popover width, for items with descriptions, e.g. the split button). The "more" trigger is ⋯ everywhere: Primer, Atlassian, Fluent and Polaris use the horizontal ellipsis; only Material (Android app bars) and Carbon default to the vertical one.' },
  { id: 'A5', title: 'Cooper chart button = EvidenceButton (done)', q: 'Done on Nov 19.',
    cols: [{ label: 'EvidenceButton (charts, widgets, panels, evidence)', g: 'EvidenceButton' }],
    [S]: 'Done. One EvidenceButton with the chart button\'s look (medium variant of the Cooper icon) at the standard 16px icon size, used by every chart and widget header, Panel and the evidence chain.' },
  { id: 'A6', title: 'Approval chain: timeline vs table (kept, parked)', q: 'Kept as two components (different uses). Revisit later.',
    cols: [{ label: 'ApprovalChain (timeline)', g: 'ApprovalChain' }, { label: 'ApprovalChainTable', g: 'ApprovalChainTable' }],
    [S]: 'Parked on Nov 19: both stay. Open for later: the Rejected wording / icon and the line style differ between them.' },
  { id: 'A7', title: 'Version history: standalone component, used by the Activity panel (done)', q: 'Done on Nov 19.',
    cols: [{ label: 'VersionHistory (standalone)', g: 'VersionHistory' }, { label: 'ActivityPanel (renders VersionHistory)', g: 'ActivityPanel' }],
    [S]: 'Done, as you described: VersionHistory stays the small standalone list, and the Activity panel now renders it instead of its own copy, passing its ⋯ menu, rename rules and search.' },
  { id: 'A8', title: 'People row: Collaborator → CollaboratorRow', q: 'Whose spacing?',
    cols: [{ label: 'Collaborator (follows Nov 18)', g: 'Collaborator' }, { label: 'CollaboratorRow (used in the product)', g: 'CollaboratorRow' }],
    [S]: 'Keep CollaboratorRow (owner badge, online dot, push), with Collaborator\'s spacing: 8 top and bottom, inset at the sides, control height. The role picker becomes Select.' },
  { id: 'A9', title: 'Legacy cards → ContentCard', q: 'Migrate VersionCard, SourceCard, SidebarNodeCard; delete UserCard?',
    cols: [{ label: 'Today', g: 'VersionCard' }, { label: 'Today', g: 'SourceCard' }, { label: 'Today', g: 'SidebarNodeCard' }, { label: 'As ContentCard', el: mockups.legacyCards }],
    [S]: 'Yes to all four. UserCard is unused (CollaboratorRow covers people). SourceCard\'s padding becomes inset (follows Nov 18). SidebarNodeCard keeps its grab cursor and drag shadow as a ContentCard drag state.' },
  { id: 'A10', title: 'FileCard', q: 'Keep as its own component?',
    cols: [{ label: 'FileCard', g: 'FileCard' }],
    [S]: 'Keep it, documented as a list-row exception. ContentCard has no file tile, middle truncation or error state, and adding them only for files makes ContentCard heavier.' },
  { id: 'A11', title: 'RecordPreview and ApprovalChainPanel → Panel', q: 'OK to take Panel\'s look?',
    cols: [{ label: 'RecordPreview', g: 'RecordPreview' }, { label: 'Panel', g: 'Panel' }],
    [S]: 'Yes. H4 title, divider, inset padding, 48 collapsed rail (the region token). The record ID becomes the title.' },
  { id: 'A12', title: 'Popover search → Search', q: 'OK?', cols: [{ label: 'Both', el: mockups.search }],
    [S]: 'Yes. One search field with the kit focus ring and clear button.' },
  { id: 'A13', title: 'RoleSelect and CompareDropdown → Select', q: 'OK to move both to Select?',
    cols: [{ label: 'RoleSelect vs Select', el: mockups.role }, { label: 'CompareDropdown', g: 'CompareDropdown' }],
    [S]: 'Yes. Select gets option groups and trailing badges for CompareDropdown. Heights follow the control height and the list sits 4px from the trigger (Nov 18).' },
  { id: 'A14', title: 'NavBar: one bar, collapses by width (done)', q: 'Done on Nov 19.',
    cols: [{ label: 'NavBar: pick a width; below 800 it collapses to the hamburger', g: 'NavBar: collapsed by width' }],
    [S]: 'Done. One NavBar collapses by its own width (below 800, adjustable with collapseBelow; collapsed forces it). The collapsed stage list is the kit Menu, and the bell is NotificationButton in both looks.' },
  { id: 'A15', title: 'Calendar weekday row = Weekday, from the user\'s locale (done)', q: 'Done on Nov 19.',
    cols: [{ label: 'Weekday / Weekdays', g: 'Weekday' }, { label: 'Calendar', g: 'DatePicker' }],
    [S]: 'Done. The calendar header is the Weekday atom. Day names and the first day of the week come from the user\'s locale (IFS.format.configure({ locale })): en-US starts on Sunday, en-GB and de-DE on Monday, ar-EG on Saturday. A user setting (weekStartsOn) overrides it.' },
  { id: 'A16', title: 'Chart empty → EmptyState', q: 'OK?', cols: [{ label: 'Both', el: mockups.empty }],
    [S]: 'Yes. Empty state gaps 20 / 16 / 12 and inset padding (Nov 18).' },

  { sec: 'B. One status vocabulary', id: 'B1', title: 'Status names, neutral grey, dot size, dots on tags',
    q: 'Adopt one set of names? Which grey? One dot size? Dots on Badge?',
    cols: [{ label: 'Today', el: mockups.status }],
    [S]: 'Names: success, warning, error, info, accent, neutral, cooper, disabled (old names kept as aliases for now). Neutral = #8c8c8c (visible); disabled = #4d4d4d. One status size: 8px dot, 6px gap (the type guide already says to merge XS and S). Remove the dot from Badge: a tag has no dot.' },

  { sec: 'C. Sizes that ignore density or the panel tokens', id: 'C1', title: 'Fixed sizes → tokens',
    q: 'Switch these to the tokens? Use the density buttons at the top to compare.',
    cols: [{ label: 'Approval chain table (rows 52 in every density)', g: 'ApprovalChainTable' }, { label: 'Table (rows 64 / 52 / 40)', g: 'Table' }, { label: 'Widgets drawer (400)', g: 'WidgetsDrawer' }, { label: 'Collaborators panel (360 × 640)', g: 'CollaboratorsPanel' }],
    [S]: 'Yes to all. Rows use the table row height (64 / 52 / 40), including the ranked table (now 60). Widgets drawer 380. Collaborators and approval popovers 320. Chat full panel 380 (side panel). Chat, history and agent headers get their height from inset padding. Search, chips and prompt buttons use control heights. The floating drawer sits the page margin from the edge.' },

  { sec: 'D. Headers', id: 'D1', title: 'Page and card titles', q: 'Which title styles?',
    cols: [{ label: 'PageHeader (object page bar)', g: 'PageHeader' }, { label: 'PageTop (list page)', g: 'PageTop' }, { label: 'Card titles', el: mockups.headers }],
    [S]: 'PageTop keeps H2 (page title). PageHeader keeps Label/M: it is a bar, not the page heading, so change the type guide to say so. WidgetCard title → H4 (it is a card). ContentCard stays Label/M (it is a list item). Chart cards use inset padding like every other card.' },
];

function App() {
  const [density, setDensity] = React.useState(() => IFS.getDensity ? IFS.getDensity() : 'comfortable');
  const setD = d => { IFS.setDensity && IFS.setDensity(d); setDensity(d); };
  const [picks, setPicks] = React.useState(() => { try { return JSON.parse(localStorage.getItem('rv-picks') || '{}'); } catch (e) { return {}; } });
  const pick = (id, v) => { const n = { ...picks, [id]: picks[id] === v ? undefined : v }; setPicks(n); try { localStorage.setItem('rv-picks', JSON.stringify(n)); } catch (e) {} };
  return <div className="rv">
    <header className="rv-top">
      <div><h1 className="t-heading-h2-medium">2.0.3 duplicate components: decisions</h1>
        <p className="t-body-m-regular rv-sub">Every example is the real coded component. Nothing here is in Figma. Your picks are saved in this browser only.</p></div>
      <div className="rv-density"><span className="t-label-m-medium">Density</span>{['spacious', 'comfortable', 'compact'].map(d =>
        <button key={d} type="button" className={'rv-pill' + (density === d ? ' on' : '')} onClick={() => setD(d)}>{d}</button>)}</div>
    </header>
    <nav className="rv-toc">{ITEMS.map(it => <a key={it.id} href={'#' + it.id} className={picks[it.id] ? 'done' : ''}>{it.id}</a>)}</nav>
    {ITEMS.map(it => <React.Fragment key={it.id}>
      {it.sec && <h2 className="t-heading-h3-medium rv-sec">{it.sec}</h2>}
      <section id={it.id} className="rv-item">
        <div className="rv-head"><span className="rv-id">{it.id}</span><div><h3 className="t-heading-h4-semibold">{it.title}</h3><p className="t-body-m-regular rv-q">{it.q}</p></div></div>
        <div className="rv-cols">{it.cols.map((c, i) => <div key={i} className="rv-col"><div className="rv-col-label t-label-m-medium">{c.label}</div>
          <div className="rv-col-body"><Safe>{c.g ? G(c.g) : c.el()}</Safe></div></div>)}</div>
        <div className="rv-suggest"><span className="t-label-m-medium">My suggestion</span><p className="t-body-m-regular">{it[S]}</p>
          <div className="rv-actions">{['Agree', 'Change it', 'Discuss'].map(v =>
            <button key={v} type="button" className={'rv-pill' + (picks[it.id] === v ? ' on' : '')} onClick={() => pick(it.id, v)}>{v}</button>)}</div></div>
      </section></React.Fragment>)}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
