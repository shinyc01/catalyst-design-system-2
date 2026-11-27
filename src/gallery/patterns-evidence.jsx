import React from 'react';
import { IFS } from '../components/index.js';

const IFS_GALLERY = [];
export default IFS_GALLERY;

{
  const { SourceCard, EvidenceSection, PeerBenchmark, EvidenceButton, EvidenceChainDrawer, evidenceZone } = IFS;
  const Row = ({ label, children, style }) => <div className="g-row" style={style}><span className="g-label t-body-m-regular">{label}</span>{children}</div>;
  const noop = () => {};

  /* ---------------- sample data (from the Figma frames) ---------------- */
  const FLAGGED_DOCS = [
    { key: 'fca', title: 'Feeder Condition Assessment', children: '“7 feeder sections show deteriorating condition indicators and increasing likelihood of reliability issues.”', badge: 'Aging asset risk increasing' },
    { key: 'nca', title: 'Network Capacity Analysis', children: '“Current feeder loading is approaching operational limits, reducing flexibility during future demand growth or outages.”', badge: 'Limited network flexibility' },
    { key: 'frm', title: 'Financial Risk Model', children: '“Deferring intervention increases exposure to reactive repairs, outage costs, and accelerated replacement needs.”', badge: 'Delay creates financial risk' },
  ];
  const FLAGGED_SYSTEMS = [
    { key: 'oms', title: 'OMS · high', icon: null, children: '4 sustained outages across the 7 feeders in 90 days, against a baseline of about 1 a quarter: a clear trend break.' },
    { key: 'reg', title: 'Asset register + inspection · med-high', icon: null, children: 'Avg age 47 yrs, 5 of 7 past service life; condition trending down 3 cycles straight.' },
    { key: 'cre', title: 'Copperleaf risk engine · high', icon: null, children: 'PoF up about 2.4× over 24 months; about 9,400 customers served, including 2 critical-care facilities; limited backfeed on 3 feeders. Reliability risk is the dominant, rising driver → #1 in Greater Hartford.' },
  ];
  const DECISIONS = [
    { key: 'sfr', title: 'Southern Feeder Replacement — Circuit 14B', content: 'text', children: 'Proceed with a proactive feeder replacement investment instead of waiting for asset failure.', badge: 'Reduced reliability exposure' },
    { key: 'rrr', title: 'Reliability Risk Review — FY27 Capital Planning', content: 'text', children: 'Prioritize the affected feeder sections due to their increasing failure probability and customer impact.', badge: 'Focused risk reduction' },
  ];
  const CONSIDERED = [
    { key: 'in', type: 'user', user: { name: 'Ingrid Nielsen', initials: 'IN', type: 'blue' }, children: '“Defer 3 years: rejected. The risk trajectory crosses tolerance in roughly 14 months.”' },
  ];
  const rationale = flagged => [
    { title: 'Why it’s flagged', items: flagged },
    { title: 'Decisions', items: DECISIONS },
    { title: 'Considered but not included', items: CONSIDERED },
  ];
  // Figma bars are raw hex (no variables); rose-8 matches a token exactly, the rest are raw in Figma.
  const SCOPE_COLORS = { a: 'var(--color-data-viz-categorical-1)', b: 'var(--color-data-viz-categorical-3)', c: 'var(--color-data-viz-categorical-5)', d: 'var(--color-data-viz-categorical-7)' }; // categorical slots (rule 10.7; were a light rose and three raw Figma hexes)
  const BENCHMARK = {
    description: 'Peer benchmark supports the current idea context. Similar ideas for aging feeder renewal most often cover 5–10 feeders, use a $3M–$6M early cost range, and are assigned a 12–18 month action window.',
    summary: [{ label: 'Similar past ideas', value: '341 ideas' }, { label: 'Peer utilities', value: '27 utilities' }, { label: 'Typical cost range', value: '$3M–$6M' }, { label: 'Most common action window', value: '12–18 mo' }],
    scope: {
      label: 'Typical scope', value: '5–10 feeders',
      legend: [{ label: '1–5 feeders', color: SCOPE_COLORS.a }, { label: '5–10 feeders', color: SCOPE_COLORS.b }, { label: '10-15 feeders', color: SCOPE_COLORS.c }, { label: '15+ feeders', color: SCOPE_COLORS.d }],
      // segments top → bottom: 15+, 10–15, 5–10, 1–5 (heights read from the Figma bars, 1.56 px per utility)
      columns: [['<40', [1, 8, 11, 8]], ['40-50', [15, 8, 45, 22]], ['50-60', [6, 10, 24, 34]], ['>60', [3, 13, 10, 10]], ['UNKN', [10, 3, 9, 2]]]
        .map(([label, v]) => ({ label, segments: [SCOPE_COLORS.d, SCOPE_COLORS.c, SCOPE_COLORS.b, SCOPE_COLORS.a].map((color, i) => ({ value: v[i], color })) })),
    },
  };

  /* ---------------- components ---------------- */
  IFS_GALLERY.push({ name: 'SourceCard', figma: 'source-card (1440:5362)', render: () => <IFS.Stack gap="400">
    <Row label="file · quote · badge (Default)"><div style={{ width: 354 }}><SourceCard {...FLAGGED_DOCS[0]} onOpen={noop} /></div></Row>
    <Row label="file · text · badge (Variant2)"><div style={{ width: 354 }}><SourceCard {...DECISIONS[0]} onOpen={noop} /></div></Row>
    <Row label="user · quote (Variant3)"><div style={{ width: 354 }}><SourceCard {...CONSIDERED[0]} /></div></Row>
    <Row label="label only · quote (State=Default)"><div style={{ width: 354 }}><SourceCard {...FLAGGED_SYSTEMS[0]} /></div></Row>
    <Row label="loading"><div style={{ width: 354 }}><SourceCard loading /></div></Row>
  </IFS.Stack> });

  IFS_GALLERY.push({ name: 'EvidenceSection', figma: 'Evidence chain "Slot" blocks [patterns] (31:76667)', render: () => <IFS.Stack gap="300" style={{ width: 354 }}>
    <EvidenceSection title="Why it’s flagged" items={FLAGGED_DOCS.slice(0, 2)} />
    <EvidenceSection title="Considered but not included" items={CONSIDERED} />
  </IFS.Stack> });

  IFS_GALLERY.push({ name: 'PeerBenchmark', figma: 'Evidence chain › Peer benchmark [patterns] (31:77627)', render: () => <IFS.Inline gap="700" align="start">
    <div style={{ width: 354 }}><PeerBenchmark {...BENCHMARK} /></div>
    <div style={{ width: 354 }}><PeerBenchmark empty /></div>
  </IFS.Inline> });

  IFS_GALLERY.push({ name: 'EvidenceButton', figma: 'icon-button Shape=Circle Type=Tertiary S, cooper evidence icon [patterns] (31:74957)', render: () => {
    const [on, setOn] = React.useState(false);
    return <Row label="default · open (aria-expanded) · click"><EvidenceButton /><EvidenceButton active /><EvidenceButton active={on} onClick={() => setOn(!on)} /></Row>;
  } });

  IFS_GALLERY.push({ name: 'EvidenceChainDrawer', figma: 'drawer-organism "Evidence chain" [patterns] (31:76682)', render: () => {
    const [open, setOpen] = React.useState(true);
    return <>
      {!open && <IFS.Button size="s" type="secondary" onClick={() => setOpen(true)}>Reopen</IFS.Button>}
      <IFS.Inline gap="400" align="start">
        {[60, 87, 96].map((v, i) => <div key={v} style={{ height: 760, display: 'flex' }}>
          <EvidenceChainDrawer floating={false} value={v} rationale={rationale(FLAGGED_DOCS)} benchmark={BENCHMARK} defaultTab={i === 2 ? 'benchmark' : 'rationale'}
            {...(i === 0 ? { open, onOpenChange: setOpen } : {})} />
        </div>)}
      </IFS.Inline>
    </>;
  } });

  /* ---------------- pattern screens ---------------- */
  const shell = { position: 'relative', width: 1440, height: 900, display: 'grid', overflow: 'hidden',
    background: 'var(--color-surface-canvas)', border: '1px solid var(--color-border-soft)', boxSizing: 'content-box' };
  const drawerSlot = { position: 'absolute', zIndex: 5, width: 380, display: 'flex' };

  // One open chain per screen; remembers the trigger so Esc / ✕ give focus back to it.
  function useChain(initial = null) {
    const [key, setKey] = React.useState(initial);
    const trigger = React.useRef(null);
    const toggle = (k) => (e) => { trigger.current = e && e.currentTarget; setKey(cur => (cur === k ? null : k)); };
    const close = () => { setKey(null); const t = trigger.current; t && setTimeout(() => t.focus(), 0); };
    return { key, toggle, close, setKey };
  }

  function DemoBar({ children }) {
    return <IFS.Inline gap="200" align="center" wrap style={{ marginBottom: 'var(--space-300)', maxWidth: 1440 }}>
      <span className="t-label-m-medium" style={{ color: 'var(--color-text-softer)' }}>Demo —</span>{children}</IFS.Inline>;
  }

  /* ---- Build › Idea overview (31:74915 → 31:75728; Northgate 297:75586 / 297:76637) ---- */
  function AffectedAssets() {
    const { MapPinDot, MapPinFlow, MapPinPole } = IFS;
    const S = 0.6;
    const at = (x, y, node, k) => <div key={k} style={{ position: 'absolute', left: x, top: y, transform: `scale(${S})`, transformOrigin: '0 0' }}>{node}</div>;
    const route = '110,170 170,205 235,222 290,244 316,245 386,244 450,243 400,152';
    return (
      <div style={{ position: 'relative', width: '100%', height: 352, overflow: 'hidden', borderRadius: 'var(--radius-control)', background: 'var(--color-surface-secondary)' }}>
        <svg width="670" height="352" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
          <polyline points={route} fill="none" stroke="var(--color-icon-danger)" strokeOpacity=".35" strokeWidth="4" />
          <polyline points={route} fill="none" stroke="var(--color-icon-danger)" strokeWidth=".6" strokeDasharray="2.6 1.7" />
        </svg>
        {[[168, 202], [233, 219], [314, 242], [384, 241], [448, 240]].map(([x, y], i) => at(x, y, <MapPinDot size="xs" label="Fault" scale={S} />, `d${i}`))}
        {at(286, 240, <MapPinDot size="xs" state="selected" label="Fault" scale={S} />, 'sel')}
        {at(396, 148, <MapPinDot size="s" label="Fault" scale={S} />, 's1')}{at(106, 182, <MapPinDot size="s" label="Fault" scale={S} />, 's2')}
        {[[196, 205, 169], [344, 241, 180], [424, 185, -63]].map(([x, y, r], i) => at(x, y, <MapPinFlow type="error" rotate={r} />, `f${i}`))}
        {[[162, 186, 6], [444, 224, 1], [376, 230, 2], [308, 228, 3], [226, 206, 5]].map(([x, y, n]) => at(x, y, <MapPinPole pin={false} number={n} />, `p${n}`))}
        {at(282, 222, <MapPinPole pin={false} number={4} />, 'p4')}
        {at(386, 108, <MapPinPole number="Demeter SS" pinIcon="asset type-substation" />, 'dem')}
        {at(92, 140, <MapPinPole number="Recloser R-1" pinIcon="asset type-switcher" />, 'rec')}
        {at(70, 10, <MapPinPole symbol="defect" number="Ridgeview Village" defect={{ type: 'cyclone', state: 'confirmed' }} />, 'rv')}
        <div style={{ position: 'absolute', insetInlineEnd: 8, top: 8 }}><IFS.IconButton type="tertiary" size="s" icon="map" label="Open map" /></div>
      </div>
    );
  }
  const RELEVANCE = [['Reliability', 40, 1], ['Financial', 35, 2],
    ['Environment', 13, 3], ['Social', 7, 4], ['Governance', 5, 5]];
  const GOALS = ['Financial stewardship & efficiency', 'Reduce wildfire & emergency risk', 'Maintain public & worker safety', 'Decarbonize grid by 2045', 'Community & equity outcomes'];
  // Confidence Cooper reports for each block it filled in (drives the strength bar per chain).
  const FIELD_CONF = { overview: 87, need: 92, goals: 74, relevance: 61, assets: 88, alternative: 87, options: 79 };

  function IdeaOverview({ chain, title = 'Southern Feeder Replacement — Circuit 14B' }) {
    const ev = (k) => <EvidenceButton active={chain.key === k} onClick={chain.toggle(k)} label={`Evidence chain: ${k}`} />;
    const card = (k, t, body, extra) => <IFS.DataVizCard title={t} header={{ draggable: false, slot: <IFS.Inline as="span" gap="200" align="center">{extra}{ev(k)}</IFS.Inline> }}>{body}</IFS.DataVizCard>;
    const pad = { padding: '0 var(--space-250) var(--space-250)', boxSizing: 'border-box', width: '100%' };
    return (
      <IFS.Stack gap="300" style={{ padding: 'var(--space-300)' }}>
        {card('overview', 'Idea overview', <div style={pad}>
          <div className="t-heading-h2-medium">{title}</div>
          <div className="t-body-l-regular" style={{ color: 'var(--color-text-soft)', marginTop: 'var(--space-200)' }}>7 aging feeders serve Ridgeview Village and about 9,400 customers. Reliability risk is rising, flagged before failure, with an investment idea already drafted.</div>
        </div>, <IFS.Button type="tertiary" size="s" iconLeft="cooper-system-icon">Edit with Cooper</IFS.Button>)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-300)', alignItems: 'start' }}>
          <IFS.Stack gap="300">
            {card('need', 'The need', <div className="t-body-l-regular" style={pad}>Fault frequency on these feeders are up 3.1× over 24 months, with two sustained outages this year. Health index has dropped from 74 to 41. Left alone, Cooper projects a likely in-service failure within 18-30 months, affecting about 9,400 customers, including a hospital.</div>)}
            {card('goals', 'Aligned enterprise goals', <IFS.Inline gap="200" wrap style={{ ...pad }}>{GOALS.map(g => <IFS.Badge key={g} color="black" size="m">{g}</IFS.Badge>)}</IFS.Inline>)}
            {card('relevance', 'Strategic relevance', <IFS.Stack gap="400" style={{ ...pad }}>
              <IFS.Inline gap="50" style={{ height: 24 }}>{RELEVANCE.map(([l, v, c]) => <IFS.BarChartItem key={l} color={c} style={{ flex: `${v} 1 0`, minWidth: 0 }}>{`${v}%`}</IFS.BarChartItem>)}</IFS.Inline>
              <IFS.Inline gap="400" justify="center" wrap>{RELEVANCE.map(([l, , c]) => <IFS.LegendSwatch key={l} color={c} label={l} />)}</IFS.Inline>
            </IFS.Stack>)}
          </IFS.Stack>
          {card('assets', 'Affected assets and area', <div style={{ ...pad, padding: '0 var(--space-100) var(--space-100)' }}><AffectedAssets /></div>)}
        </div>
        {card('alternative', 'Recommended alternative', <div style={pad}>
          <div style={{ padding: 'var(--space-300)', borderRadius: 'var(--radius-control)', boxShadow: 'inset 0 0 0 var(--border-width-default) var(--color-border-soft)' }}>
            <div className="t-heading-h2-medium">Targeted Hardening</div>
            <div className="t-body-l-regular" style={{ color: 'var(--color-text-soft)', margin: 'var(--space-150) 0 var(--space-300)' }}>Replaces only the worst 40% or so of units, starting with Feeder 4. Lower cost and faster, but leaves aging sections in place. Partial risk reduction: the cluster stays exposed to repeat failures.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-300)' }}>
              {[['BCR', '2.5'], ['Cost range', '$2.4M-$3.8M'], ['Timing', 'about 8 months'], ['Potential value', '6M-9M']].map(([t, v]) => <IFS.StatCard key={t} title={t} value={v} />)}
            </div>
          </div>
        </div>)}
        {card('options', 'Other options', <div style={{ ...pad, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-300)' }}>
          <IFS.ContentCard title="Full Replacement" description="Replace all 7 feeders in one program. Highest cost, removes the cluster risk." />
          <IFS.ContentCard title="Reactive Repair" description="Fix on failure. Lowest near-term cost; outage exposure keeps rising." />
        </div>)}
      </IFS.Stack>
    );
  }

  function BuildScreen({ label, title = 'Southern Feeder Replacem…', recordTitle, initialKey = null, benchmark = BENCHMARK, initialTab, demo }) {
    const chain = useChain(initialKey);
    const [tab, setTab] = React.useState(initialTab || 'rationale');
    return (
      <div style={{ ...shell, gridTemplateRows: '48px 40px 1fr 40px' }} aria-label={label}>
        <IFS.NavBar defaultValue="build" hasNotifications user={{ initials: 'JP', name: 'J. Parker' }} />
        <div style={{ position: 'relative' }}>
          <IFS.PageHeader title={title} id="INV-2025-0842" onBack={noop} backLabel="Back to Investments" onTitleMenu={noop}
            status={<IFS.Indicator type="purple" size="xs">Shaping</IFS.Indicator>}
            actions={<>
              <IFS.Inline as="span" gap="100"><IFS.Button type="tertiary" size="s" iconLeft="users-group">3/5</IFS.Button><IFS.CommentButton /></IFS.Inline>
              <IFS.Inline as="span" gap="200"><IFS.Button type="secondary" size="s">Dismiss</IFS.Button><IFS.Button type="primary" size="s">Send for review</IFS.Button></IFS.Inline>
            </>} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 344 }}>
            <IFS.Stepper steps={[{ label: 'Shape' }, { label: 'Review' }, { label: 'Refine' }, { label: 'Approve' }]} current={0} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 48px', minHeight: 0 }}>
          <div style={{ position: 'relative', minHeight: 0 }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'auto' }}><IdeaOverview chain={chain} title={recordTitle} /></div>
            {chain.key && <div style={{ ...drawerSlot, top: 12, insetInlineEnd: 12, bottom: 12 }}>
              <EvidenceChainDrawer key={chain.key} open onOpenChange={v => !v && chain.close()} value={FIELD_CONF[chain.key]}
                rationale={rationale(FLAGGED_DOCS)} benchmark={benchmark} tab={tab} onTabChange={setTab} />
            </div>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-400)', boxShadow: 'inset var(--border-width-default) 0 0 var(--color-border-soft)' }}>
            <IFS.IconButton type="tertiary" size="s" icon="arrow-bar-left" label="Open panel" /></div>
        </div>
        <IFS.BottomSheet type="value" style={{ position: 'relative' }} documents={{ label: '16 documents', icon: 'system-file', onClick: noop }} onUpload={noop}
          prompts={['Find similar past ideas', 'What could block this idea?']} />
      </div>
    );
  }

  /* ---- Value › Review (31:76689 → 31:76841 / 31:77627 / 31:78108…78888) ---- */
  const IMPACT = [['Major loss', 42, 'var(--color-data-viz-diverging-positive-3)'], ['Moderate loss', 49, 'var(--color-data-viz-diverging-positive-2)'], ['Minor loss', 67, 'var(--color-data-viz-diverging-positive-1)'],
    ['No material change', 163, 'var(--color-data-viz-neutral)'], ['Minor gain', 82, 'var(--color-data-viz-diverging-negative-1)'], ['Moderate gain', 74, 'var(--color-data-viz-diverging-negative-2)'], ['Major gain', 38, 'var(--color-data-viz-diverging-negative-3)']];
  function ImpactChart() {
    return <IFS.DataVizCard title="Investment value impact" header={{ draggable: false }}>
      <div style={{ padding: '0 var(--space-250) var(--space-300)', width: '100%', boxSizing: 'border-box' }}>
        <div className="t-body-m-regular" style={{ color: 'var(--color-text-soft)', marginBottom: 'var(--space-300)' }}>Value change measured as % of each investment’s total value (NPV) under the proposed framework, compared with the current one.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gridTemplateRows: '200px auto', gap: 'var(--space-200) var(--space-100)' }}>
          <div className="t-body-m-regular" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--color-text-soft)' }}>{[250, 200, 150, 100, 50, 0].map(t => <span key={t}>{t}</span>)}</div>
          <IFS.Inline gap="150" align="end">{IMPACT.map(([l, v, c]) => <IFS.VerticalBarChartItem key={l} label={`${l}: ${v}`} width="auto" height={200} value={v} max={250} segments={[{ value: 1, fill: c }]} style={{ flex: '1 1 0' }} />)}</IFS.Inline>
          <span />
          <IFS.Inline gap="150" className="t-body-m-regular" style={{ color: 'var(--color-text-soft)', textAlign: 'center' }}>{IMPACT.map(([l]) => <span key={l} style={{ flex: '1 1 0' }}>{l}</span>)}</IFS.Inline>
        </div>
        <IFS.Inline gap="400" justify="center" style={{ marginTop: 'var(--space-300)' }}>
          <IFS.LegendSwatch color="var(--color-data-viz-diverging-positive-3)" label="Loss" /><IFS.LegendSwatch color="neutral" label="Unchanged" /><IFS.LegendSwatch color="var(--color-data-viz-diverging-negative-3)" label="Gain" />
        </IFS.Inline>
      </div>
    </IFS.DataVizCard>;
  }
  const delta = (a, b, up) => <span>{a} → <span style={{ color: up ? 'var(--color-text-success)' : 'var(--color-text-danger)' }}>{b}</span></span>;
  const REVIEW_ROWS = [
    ['Substation 12 Reliability Upgrade', 'Reliability', '$3.1M', '$4.4M', '+$1.3M', '2.6', '3.7', true, 'Biggest gainers'],
    ['Grid Hardening Program', 'Reliability', '$5.0M', '$6.2M', '+$1.2M', '2.5', '3.1', true, 'Biggest gainers'],
    ['Transformer Replacement Program', 'Asset Replacement', '$2.8M', '$3.4M', '+$0.6M', '1.9', '2.3', true, 'Biggest gainers'],
    ['Vegetation Management', 'Safety', '$4.2M', '$2.9M', '-$1.3M', '1.6', '1.1', false, 'Lost the most value'],
    ['Safety Compliance Retrofit', 'Cost', '$3.6M', '$3.0M', '-$0.6M', '1.7', '1.4', false, 'Lost the most value'],
  ].map(([name, type, a, b, ch, r1, r2, up, group], i) => ({ id: `r${i}`, name, type, a, b, ch, r1, r2, up, group }));
  const REVIEW_COLS = [
    { key: 'name', title: 'Investment', width: '1.4fr', filter: { onClick: noop } },
    { key: 'type', title: 'Type', width: '1fr', filter: { onClick: noop }, type: 'custom', render: r => <IFS.Badge color="white" size="s">{r.type}</IFS.Badge> },
    { key: 'total', title: 'Total value', width: '1fr', sortable: true, type: 'custom', render: r => delta(r.a, r.b, r.up) },
    { key: 'ch', title: 'Value change', width: '1fr', sortable: true, type: 'custom', render: r => <span style={{ color: r.up ? 'var(--color-text-success)' : 'var(--color-text-danger)' }}>{r.up ? '▴' : '▾'} {r.ch}</span> },
    { key: 'ratio', title: 'Value / cost ratio', width: '1fr', sortable: true, type: 'custom', render: r => delta(r.r1, r.r2, r.up) },
  ];

  function SystemConfidence({ onEvidence, evidenceOpen }) {
    return (
      <IFS.Panel title="System confidence" onEvidence={onEvidence} style={{ height: '100%' }}>
        <IFS.Stack gap="300" style={{ padding: 'var(--space-300)', borderRadius: 'var(--radius-floating)', background: 'var(--color-surface-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="t-heading-h3-medium">Approval readiness</span>
            <IFS.Inline as="span" gap="200" align="center"><IFS.ProgressRing value={50} size={16} label="Approval readiness" /><span className="t-heading-h3-medium">50%</span></IFS.Inline>
          </div>
          <IFS.ReadinessStatus style={{ width: "100%" }} type="done" end="Passed">Objective weighting</IFS.ReadinessStatus>
          <IFS.ReadinessStatus style={{ width: "100%" }} type="done" end="Passed">Strategic alignment</IFS.ReadinessStatus>
          <IFS.ReadinessStatus style={{ width: "100%" }} type="in-progress" indicators={[{ type: 'red', label: '0/1' }]}>Risk balance</IFS.ReadinessStatus>
          <IFS.ReadinessStatus style={{ width: "100%" }} type="in-progress" indicators={[{ type: 'red', label: '0/1' }, { type: 'orange', label: '0/2' }]}>Governance flags</IFS.ReadinessStatus>
          <IFS.SegmentedControl size="m" defaultValue="q" aria-label="Issue type" options={[{ value: 'q', label: 'Open questions', counter: 2 }, { value: 'w', label: 'Warnings', counter: 2 }]} />
          <IFS.Pager defaultPage={1} total={2} percent={0} onShowAll={noop} showAllLabel="All" />
          <div><div className="t-heading-h2-medium">Wildfire risk over-weighted</div><div className="t-body-l-regular" style={{ color: 'var(--color-text-soft)', marginTop: 'var(--space-100)' }}>V2 pulls capital into ignition mitigation</div></div>
          <div className="t-label-m-medium" style={{ color: 'var(--color-text-soft)' }}>Solutions</div>
          <IFS.ContentCard size="s" cooper title="Lock weight at 28%, restore methodology only" description="Hybrid restore · Keeps FY26 strategic alignment" />
          <IFS.ContentCard size="s" title="Accept v2's 45% weighting in full" description="Faithful restore · Requires Strategy OKR review" />
          <IFS.ContentCard size="s" title="Skip restore now, plan for v3.2 release" description="Capture V2's calculation features in FY27 release plan" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-200)' }}><IFS.Button type="secondary" size="m" iconLeft="system-upload">Upload file</IFS.Button><IFS.Button type="secondary" size="m" iconLeft="system-plus">My answer</IFS.Button></div>
        </IFS.Stack>
      </IFS.Panel>
    );
  }

  function ReviewScreen({ label, initialOpen = false, value = 87, initialTab = 'rationale', benchmark = BENCHMARK, onOpenChange }) {
    const [open, setOpen] = React.useState(initialOpen);
    const [tab, setTab] = React.useState(initialTab);
    const scroller = React.useRef();
    const btn = React.useRef();
    React.useEffect(() => { if (scroller.current) scroller.current.scrollTop = 414; }, []); // Figma frames are scrolled to the chart
    const set = v => { setOpen(v); onOpenChange && onOpenChange(v); if (!v) setTimeout(() => { const b = document.querySelector(`[aria-label="${label}"] .ifs-panel__buttons button`); b && b.focus(); }, 0); };
    return (
      <div style={{ ...shell, gridTemplateRows: '48px 1fr' }} aria-label={label}>
        <IFS.NavBar defaultValue="value" hasNotifications user={{ initials: 'JP', name: 'J. Parker' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-400)', boxShadow: 'inset calc(-1 * var(--border-width-default)) 0 0 var(--color-border-soft)' }}><IFS.ArrowButton label="Open navigation" /></div>
          <div style={{ display: 'grid', gridTemplateRows: '40px 1fr 40px', minHeight: 0, minWidth: 0 }}>
            <div style={{ position: 'relative' }}>
              <IFS.PageHeader title="Copy of Q1 2026 Enterprise…" onBack={noop} backLabel="Back to Value frameworks" onTitleMenu={noop}
                status={<IFS.Indicator type="gray" size="xs">Draft</IFS.Indicator>}
                views={<IFS.Inline as="span" gap="50">{[['node-map', 'Node map'], ['map-view-2d', 'Map'], ['map-views', 'Map views']].map(([i, l]) => <IFS.IconButton key={i} icon={i} label={l} type="ghost" size="s" />)}</IFS.Inline>}
                actions={<>
                  <IFS.Inline as="span" gap="100"><IFS.Button type="tertiary" size="s" iconLeft="users-group">3/5</IFS.Button><IFS.CommentButton /></IFS.Inline>
                  <IFS.Button type="primary" size="s" disabled>Send for approval</IFS.Button>
                </>} />
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 344 }}>
                <IFS.Stepper steps={[{ label: 'Input' }, { label: 'Shape' }, { label: 'Review' }, { label: 'Approve' }]} current={2} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 0 }}>
              <IFS.Stack gap="300" ref={scroller} style={{ overflow: 'auto', padding: 'var(--space-300)' }}>
                <div><div className="t-heading-h1-medium">Executive summary</div>
                  <div className="t-body-l-regular" style={{ color: 'var(--color-text-soft)', marginTop: 'var(--space-200)' }}>Applying this change increases Reliability influence by 18%, decreases Safety influence by 7%, and changes the value of 876 investments. 3 investments move into the top funding tier under the proposed framework; 2 safety initiatives drop out of it.</div></div>
                <IFS.StatCardsRow cards={[{ title: 'Portfolio value', value: '$2.24B', description: 'Proposed · $2.14B current', trend: '4.8%' },
                  { title: 'Investments re-scored', value: '1,621', description: '357 gained · 519 lost · 745 unchanged' },
                  { title: 'Funding tier changes', value: '876', description: '52 gained · 31 lost · 12 significant shift' },
                  { title: 'Governance flags', value: '1', description: 'executing investment affected' }]} />
                <IFS.Tabs items={[{ value: 'impact', label: 'Portfolio impact' }, { value: 'align', label: 'Strategic alignment' }]} defaultValue="impact" />
                <ImpactChart />
                <IFS.Table columns={REVIEW_COLS} rows={REVIEW_ROWS} groupBy="group" />
              </IFS.Stack>
              <SystemConfidence onEvidence={() => set(!open)} evidenceOpen={open} />
            </div>
            <IFS.BottomSheet type="value" style={{ position: 'relative' }} documents={{ label: '16 documents', icon: 'system-file', onClick: noop }}
              prompts={['Explain me the value impact', 'Evaluate publish risk']} />
          </div>
        </div>
        {open && <div style={{ ...drawerSlot, top: 48, right: 12, bottom: 52 }}>
          <EvidenceChainDrawer open onOpenChange={set} value={value} rationale={rationale(FLAGGED_SYSTEMS)} benchmark={benchmark} tab={tab} onTabChange={setTab} />
        </div>}
      </div>
    );
  }

  IFS_GALLERY.push({ name: 'Pattern: Evidence chain from a card', figma: 'Idea overview / Investment owner review → Rationale (Evidence chain) [patterns] (31:75728)', render: () => <>
    <DemoBar><span className="t-body-m-regular" style={{ color: 'var(--color-text-soft)' }}>click the round Cooper button on any card; each block carries its own confidence (Strategic relevance 61% → Reject zone).</span></DemoBar>
    <BuildScreen label="Idea overview with evidence chain" initialKey="overview" />
  </> });

  IFS_GALLERY.push({ name: 'Pattern: Evidence chain from system confidence', figma: 'Review - Portfolio impact - Errors (system confidence → drawer, tabs) [patterns] (31:76841)', render: () => <>
    <DemoBar><span className="t-body-m-regular" style={{ color: 'var(--color-text-soft)' }}>the round button in the System confidence panel opens the chain over the panel; switch Rationale / Peer benchmark.</span></DemoBar>
    <ReviewScreen label="Review with system confidence" />
  </> });

  IFS_GALLERY.push({ name: 'Pattern: Evidence chain confidence states', figma: 'review — Rejected / Need review / Approve [patterns] (31:78108)', render: () => {
    const [v, setV] = React.useState(60);
    const z = evidenceZone(v);
    return <>
      <DemoBar>
        <IFS.SegmentedControl size="s" value={String(v)} onChange={x => setV(+x)} options={[{ value: '60', label: '60% Rejected' }, { value: '87', label: '87% Need review' }, { value: '96', label: '96% Approve' }]} />
        <span className="t-body-m-regular" style={{ color: 'var(--color-text-soft)' }}>{z.label}: {z.behaviour}</span>
      </DemoBar>
      <ReviewScreen key={v} label={`Evidence chain at ${v}%`} initialOpen value={v} />
    </>;
  } });

  IFS_GALLERY.push({ name: 'Pattern: Peer benchmark empty state', figma: 'Peer benchmark (empty state) — Default / Error [patterns] (297:76637)', render: () => {
    const [enough, setEnough] = React.useState(false);
    return <>
      <DemoBar>
        <IFS.SegmentedControl size="s" value={enough ? 'y' : 'n'} onChange={x => setEnough(x === 'y')} options={[{ value: 'n', label: 'Too few comparable ideas' }, { value: 'y', label: 'Enough to benchmark' }]} />
      </DemoBar>
      <BuildScreen key={String(enough)} label="Northgate Cluster, peer benchmark" title="Northgate Cluster · 7 aging…" recordTitle="Northgate Cluster"
        initialKey="overview" initialTab="benchmark" benchmark={enough ? BENCHMARK : null} />
    </>;
  } });
}
