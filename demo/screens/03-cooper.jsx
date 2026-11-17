// Screen: Map · Cooper answered (spec cooper.md, Figma 13352:12770 / 16011 / 16511)
// Built only from IFS kit components; own markup = layout wrappers.

const cooperStages = [
  { value: 'command', label: 'Home' }, { value: 'value', label: 'Value' }, { value: 'explore', label: 'Explore' },
  { value: 'build', label: 'Build' }, { value: 'plan', label: 'Plan' }, { value: 'results', label: 'Results' },
];
const cooperValueNav = [
  { id: 'active', label: 'Active Framework' },
  { type: 'section', label: 'Library', items: [{ id: 'strategy', label: 'Strategy Frameworks' }, { id: 'value', label: 'Value Frameworks' }, { id: 'models', label: 'Value Models' }] },
];
const cooperColumns = ['Enterprise Goals', 'Value Framework', 'Strategic Objectives', 'Value Models', 'Measure Output'];
const cooperNodes = [
  ['enterprise-goal', 'Enterprise Goals', 5], ['value-framework', 'Value Framework v12'], ['strategic-objective', 'Strategic Objectives', 5],
  ['value-model', 'Value Models', 7], ['measure', 'Measures', 29],
];
// World units: cards 200 wide, 400 apart (Figma 144 / 287 at 1440 = zoom 0.72; 182 / 364.5 at 2560 = zoom 0.91).
const COOPER_NODE_W = 200, COOPER_NODE_STEP = 400, COOPER_NODE_H = 40;
const cooperReasoning = [
  'Reviewed 12 months of high-resolution operational telemetry from your substations',
  'Cross-referenced your current network state with 31 external benchmarks from utilities operating in similar geographic and load conditions',
  'Executed 4 simulation scenarios (Balanced, Cost-Sensitive, Aggressive Maintenance, and Full Load Redistribution) and performed multi-objective optimization',
];
const cooperDocs = [
  { id: 'd1', name: 'Q1 2026 Board directive.pdf', date: 'Jan 15, 2026' },
  { id: 'd2', name: 'Substation telemetry summary.xlsx', date: 'Jan 12, 2026' },
  { id: 'd3', name: 'Peer utility benchmarks.docx', date: 'Jan 8, 2026' },
];

function ScreenCooper({ bp, height }) {
  const { AppShell, NavBar, SideNav, PageHeader, CanvasHeader, CanvasBackground, NodeCard, CanvasConnector, ValueMapButton,
    Indicator, SegmentedControl, CooperChip, BottomSheet, DocumentsContext, useDocuments,
    ChatFullPanel, ChatCompactPanel, UserMessage, CooperMessage } = IFS;
  const toast = useToast();
  const wide = bp >= 2560;
  const home = wide ? { x: 197, y: 556, zoom: 0.91 } : { x: 46, y: 348, zoom: 0.72 };
  const [view, setView] = React.useState(home);
  const api = React.useRef(null);
  const [chat, setChat] = React.useState('full'); // full | compact | closed
  const [extra, setExtra] = React.useState([]);
  const [recSel, setRecSel] = React.useState(false);
  const docs = useDocuments({ defaultDocuments: cooperDocs });

  const scenarios = {
    title: 'Saved scenarios', aside: 'Capture · Recent Activity',
    cards: [
      { title: 'West District Feeder - Balanced', badges: ['T-902', 'T-887'], meta: ['$3.2M', '2yr', 'saved 3:44 AM'], onClick: () => toast('Opened West District Feeder - Balanced') },
      { title: 'West District - Cost-Sensitive', badges: ['T-902'], meta: ['$1.4M', '1yr', 'saved 4:15 AM'], onClick: () => toast('Opened West District - Cost-Sensitive') },
      { title: 'Harbor Substation upgrade', badges: ['Sub-H'], meta: ['$4.8M', '3yr', 'saved 1:40 AM'], onClick: () => toast('Opened Harbor Substation upgrade') },
    ],
    actions: [{ label: 'Open recommended', onClick: () => toast('Opened recommended scenario') }, { label: 'View all scenarios', onClick: () => toast('All scenarios') }],
  };
  const conversation = <>
    <UserMessage>How healthy is our current framework?</UserMessage>
    <CooperMessage status="answered" reasoning={cooperReasoning} defaultReasoningOpen scenarios={scenarios} />
    {extra.map((t, i) => <React.Fragment key={i}>
      <UserMessage>{t}</UserMessage>
      <CooperMessage status="analyzing" step={{ n: 1, total: 2, label: 'Reviewing framework structure' }} />
    </React.Fragment>)}
  </>;
  const panelProps = {
    type: 'text', title: 'Strategy Overview', children: conversation,
    onSend: t => { if (t && t.trim()) setExtra(x => [...x, t.trim()]); },
    onNewChat: () => toast('New chat'), onHistory: () => toast('Chat history'), onMore: () => toast('More actions'),
    onAttach: () => toast('Add attachment'), onTypeChange: () => toast('Voice mode'),
    onClose: () => setChat('closed'),
  };

  const fit = () => api.current && api.current.fit({ x: -40, y: -200, width: COOPER_NODE_STEP * 4 + COOPER_NODE_W + 80, height: 440 });

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AppShell height={height}
        navBar={<NavBar stages={cooperStages} defaultValue="value" onChange={navStage} hasNotifications user={{ initials: 'JP', name: 'J. Parker' }}
          onSearch={() => toast('Search')} onSettings={() => toast('Settings')} onNotifications={() => toast('Notifications')} />}
        sideNav={<SideNav title="Value" items={cooperValueNav} defaultValue="active" defaultCollapsed onSelect={goValueNav} />}
        header={<>
          <PageHeader title="Q1 2026 Strategy Framework" onTitleMenu={() => toast('Framework menu')}
            status={<Indicator type="green" size="xs">Active</Indicator>}
            views={<SegmentedControl size="s" defaultValue="overview" onChange={v => v === 'overview' && goScreen('dashboard')} options={[
              { value: 'overview', iconLeft: 'overview', ariaLabel: 'Overview' },
              { value: 'node-map', iconLeft: 'node-map', ariaLabel: 'Node map' },
              { value: 'capital-flow', iconLeft: 'capital-flow', ariaLabel: 'Capital flow' }]} />}
            actions={<CooperChip selected={recSel} onClick={() => { setRecSel(s => !s); toast('4 Recommendations'); }}>4 Recommendations</CooperChip>} />
          <CanvasHeader columns={cooperColumns} />
        </>}
        bottom={<BottomSheet type="value" left={<DocumentsContext controller={docs} />} showPrompts={false} prompts={[]}
          onCooper={() => setChat(c => (c === 'closed' ? 'full' : 'closed'))} />}>
        <div style={{ position: 'relative', height: '100%' }}>
          <CanvasBackground apiRef={api} view={view} onViewChange={setView} aria-label="Strategy framework map" style={{ position: 'absolute', inset: 0 }}
            overlay={<div style={{ position: 'absolute', left: 12, bottom: 12 }}>
              <ValueMapButton type="shape" defaultSelected="fit" onFit={fit} onExpand={() => toast('Expand all')} onCollapse={() => toast('Collapse all')} />
            </div>}>
            {cooperNodes.map(([t, title, count], i) => (
              <div key={t} style={{ position: 'absolute', left: i * COOPER_NODE_STEP, top: 0, width: COOPER_NODE_W }}>
                <NodeCard type={t} title={title} counter={count} stackIcons={false} style={{ minHeight: COOPER_NODE_H }} />
              </div>
            ))}
            {cooperNodes.slice(1).map((n, i) => (
              <CanvasConnector key={i} from={{ x: i * COOPER_NODE_STEP + COOPER_NODE_W, y: COOPER_NODE_H / 2 }} to={{ x: (i + 1) * COOPER_NODE_STEP, y: COOPER_NODE_H / 2 }} />
            ))}
          </CanvasBackground>
          {chat === 'full' && <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <ChatFullPanel {...panelProps} onResize={() => setChat('compact')} style={{ width: 380, height: 688, maxHeight: 'calc(100% - 24px)' }} />
          </div>}
          {chat === 'compact' && <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
            <ChatCompactPanel {...panelProps} onResize={() => setChat('full')} />
          </div>}
        </div>
      </AppShell>
    </div>
  );
}

SCREENS.push({ id: 'cooper', name: 'Map · Cooper answered', Comp: ScreenCooper });
