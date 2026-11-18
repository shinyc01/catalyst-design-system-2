// Screen: Map · Error detail (trace report) (spec mapoverview.md, Figma 13352:11269 / 17011 / 18152)
// Built only from IFS kit components; own markup = layout wrappers. The Strategic Objectives tree is a faithful but
// simplified copy of the Figma map (same cards, order and positions; connectors are kit CanvasConnector curves).

const mapovStages = [
  { value: 'command', label: 'Home' }, { value: 'value', label: 'Value' }, { value: 'explore', label: 'Explore' },
  { value: 'build', label: 'Build' }, { value: 'plan', label: 'Plan' }, { value: 'results', label: 'Results' },
];
const mapovValueNav = [
  { id: 'active', label: 'Active Framework' },
  { type: 'section', label: 'Library', items: [{ id: 'strategy', label: 'Strategy Frameworks' }, { id: 'value', label: 'Value Frameworks' }, { id: 'models', label: 'Value Models' }] },
];
const mapovColumns = ['Enterprise Goals', 'Value Framework', 'Strategic Objectives', 'Value Models', 'Measure Output'];
const mapovIssues = [
  { id: 'e1', kind: 'error', title: 'Weighting is no longer balanced', description: 'Adding this objective increases the total strategic objective weight above 100%.',
    solutions: [
      { id: 'a', title: 'Rebalance all objective weights', description: 'Redistribute the weights across all strategic objectives so the total returns to 100%.', recommended: true },
      { id: 'b', title: 'Use Cooper’s suggested weight', description: 'Apply a recommended weight based on the current objective structure.' },
      { id: 'c', title: 'Add without a weight', description: 'Save the objective as a draft and assign its weight before publishing.' }] },
  { id: 'e2', kind: 'error', title: 'Required measures are not configured', description: 'The objective has no measures, so it cannot contribute value.',
    solutions: [{ id: 'a', title: 'Configure measures now', description: 'Open Measure output and link at least one measure.', recommended: true },
      { id: 'b', title: 'Inherit measures from parent', description: 'Use the measures of the Social goal.' }] },
  { id: 'e3', kind: 'error', title: 'Existing measures use incompatible units', description: 'Two linked measures report in different units.',
    solutions: [{ id: 'a', title: 'Convert to the framework unit', description: 'Normalise both measures to $ / year.', recommended: true }] },
  { id: 'w1', kind: 'warning', title: 'Objective overlap detected', description: 'Community engagement overlaps with Public safety.', okay: true },
  { id: 'w2', kind: 'warning', title: 'Existing investments will be rescored', description: 'Investments using this framework will be re-scored when it is published.', okay: true },
  { id: 'w3', kind: 'warning', title: 'Reports may need updating', description: 'Current dashboards and reports do not include this objective and may show incomplete results until updated.', okay: true },
  { id: 'n1', kind: 'note', title: 'Existing investments will be recalculated', description: 'Investments using this framework will receive updated scores after the objective is published.', okay: true },
  { id: 'n2', kind: 'note', title: 'Version history updated', description: 'This change is saved as a new draft version.', okay: true },
  { id: 'n3', kind: 'note', title: 'Collaborators notified', description: 'Editors on this framework see the change in their activity.', okay: true },
];

// Map geometry in Figma "map" frame px at 1440 (zoom 0.6 of the 200px-wide kit node); converted to world px below.
const MAPOV_Z = 0.6;
const mapovTop = [
  { id: 'vf', type: 'value-framework', title: 'Value Framework v12', x: 211 },
  { id: 'so', type: 'strategic-objective', title: 'Strategic Objectives', counter: 6, x: 473 },
  { id: 'vm', type: 'value-model', title: 'Value Models', counter: 9, x: 870 },
  { id: 'ms', type: 'measure', title: 'Measures', counter: 12, x: 1195, focus: true },
];
const MAPOV_TOP_Y = 135, MAPOV_OBJ_X = 636, MAPOV_CHILD_X = 708;
const mapovObjectives = [
  { title: 'Financial', y: -55, step: 23.5, children: ['Capital expenditure efficiency', 'Operating cost efficiency', 'Rate-case approvability', 'Avoided liability cost', 'Asset lifecycle value'] },
  { title: 'Environmental', y: 134, step: 23.5, children: ['Direct emissions (Scope 1)', 'Indirect emissions (Scope 2)', 'Habitat impact', 'Renewable integration', 'Resource efficiency'] },
  { title: 'Social', y: 324, step: 23.5, children: ['DAC customer reach', 'Affordability burden', 'Worker safety', 'Public safety', 'Community engagement'], error: 'Community engagement' },
  { title: 'Governance', y: 515, step: 23.5, children: [] },
  { title: 'Reliability & service continuity', y: 572, step: 24.5, first: 32, children: ['Customer interruption duration', 'Customer interruption frequency', 'Asset reliability', 'Network resilience', 'Customer-minutes saved'] },
];

function MapovTree() {
  const { NodeCard, CanvasConnector, AddNodeButton, Icon } = IFS;
  const w = v => v / MAPOV_Z;              // Figma px → world px
  const TOP_H = 40, CH_H = 33, NODE_W = 200;
  const out = [], lines = [];
  const node = (key, x, y, props, h) => out.push(
    <div key={key} style={{ position: 'absolute', left: w(x), top: w(y), width: NODE_W }}>
      <NodeCard stackIcons={false} style={{ minHeight: h }} {...props} />
    </div>);
  mapovTop.forEach(n => node(n.id, n.x, MAPOV_TOP_Y, { type: n.type, title: n.title, counter: n.counter, outOfFocus: !n.focus }, TOP_H));
  const topMid = w(MAPOV_TOP_Y) + TOP_H / 2;
  const right = x => w(x) + NODE_W;
  lines.push(<CanvasConnector key="l-vf" from={{ x: right(211), y: topMid }} to={{ x: w(473), y: topMid }} />);
  lines.push(<CanvasConnector key="l-vm" from={{ x: right(870), y: topMid }} to={{ x: w(1195), y: topMid }} />);
  mapovObjectives.forEach((o, oi) => {
    const err = !!o.error;
    const mid = w(o.y) + TOP_H / 2;
    node('o' + oi, MAPOV_OBJ_X, o.y, { type: 'strategic-objective', title: o.title, outOfFocus: true }, TOP_H);
    lines.push(<CanvasConnector key={'so' + oi} from={{ x: right(473), y: topMid }} to={{ x: w(MAPOV_OBJ_X), y: mid }} highlighted={err} />);
    lines.push(<CanvasConnector key={'vm' + oi} from={{ x: right(MAPOV_OBJ_X), y: mid }} to={{ x: w(870), y: topMid }} highlighted={err} />);
    const first = o.first || 46;
    const ys = o.children.map((_, i) => o.y + first + i * o.step);
    o.children.forEach((t, i) => {
      const isErr = t === o.error;
      node('c' + oi + i, MAPOV_CHILD_X, ys[i], { type: 'subnode', title: t, outOfFocus: !isErr, 'aria-label': isErr ? t + ' (error)' : undefined }, CH_H);
      if (isErr) out.push(<div key={'err' + oi} style={{ position: 'absolute', left: w(MAPOV_CHILD_X) + NODE_W - 24, top: w(ys[i]) + (CH_H - 16) / 2, display: 'flex', color: 'var(--icon-danger)', zIndex: 3 }}>
        <Icon name="status-error-filled" size={16} title="Error" /></div>);
      lines.push(<CanvasConnector key={'e' + oi + i} from={{ x: w(686), y: w(o.y) + TOP_H }} to={{ x: w(MAPOV_CHILD_X), y: w(ys[i]) + CH_H / 2 }} highlighted={isErr} />);
    });
    const addY = o.children.length ? ys[ys.length - 1] + o.step : o.y + 26;
    out.push(<div key={'add' + oi} style={{ position: 'absolute', left: w(MAPOV_CHILD_X), top: w(addY) }}>
      <AddNodeButton disabled label={'Add measure to ' + o.title} /></div>);
  });
  return <>{lines}{out}</>;
}

function ScreenMapoverview({ bp, height }) {
  const { AppShell, NavBar, SideNav, PageHeader, CanvasHeader, CanvasBackground, ValueMapButton, Indicator, SegmentedControl,
    Stepper, Button, CollaboratorsButton, CommentButton, BottomSheet, DocumentsContext, useDocuments, TraceReport, useIssueReport } = IFS;
  const toast = useToast();
  const wide = bp >= 2560;
  const home = wide ? { x: -65, y: -5, zoom: MAPOV_Z * 1.31 } : { x: 0, y: -8, zoom: MAPOV_Z };
  const [view, setView] = React.useState(home);
  const api = React.useRef(null);
  const [run, setRun] = React.useState(0);
  const [shown, setShown] = React.useState(true);
  const docs = useDocuments({ defaultDocuments: [
    { id: 'd1', name: 'Q2 2026 Board directive.pdf', date: 'Apr 2, 2026' },
    { id: 'd2', name: 'Community engagement survey.xlsx', date: 'Mar 28, 2026' },
    { id: 'd3', name: 'Objective weighting notes.docx', date: 'Mar 20, 2026' }] });

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AppShell height={height}
        navBar={<NavBar stages={mapovStages} defaultValue="value" onChange={navStage} hasNotifications user={{ initials: 'JP', name: 'J. Parker' }}
          onSearch={() => toast('Search')} onSettings={() => toast('Settings')} onNotifications={() => toast('Notifications')} />}
        sideNav={<SideNav title="Value" items={mapovValueNav} defaultValue="active" defaultCollapsed onSelect={goValueNav} />}
        header={<>
          <PageHeader title="Copy of Q2 2026 Strategy Framework" onTitleMenu={() => toast('Framework menu')}
            status={<Indicator type="gray" size="xs">Draft</Indicator>}
            views={<SegmentedControl size="s" defaultValue="overview" onChange={v => v !== 'overview' && toast('View: ' + v)} options={[
              { value: 'overview', iconLeft: 'overview', ariaLabel: 'Overview' },
              { value: 'node-map', iconLeft: 'node-map', ariaLabel: 'Node map' },
              { value: 'capital-flow', iconLeft: 'capital-flow', ariaLabel: 'Capital flow' }]} />}
            center={<div style={{ width: 352 }}><Stepper current={1} active={1} steps={['Input', 'Shape', 'Review', 'Approve'].map(label => ({ label }))} /></div>}
            actions={<>
              <CollaboratorsButton accepted={3} invited={5} onClick={() => toast('Collaborators')} />
              <CommentButton onClick={() => toast('Comments')} />
              <Button type="primary" size="s" onClick={() => goScreen('review')}>Review</Button>
            </>} />
          <CanvasHeader columns={mapovColumns} />
        </>}
        bottom={<BottomSheet type="value" left={<DocumentsContext controller={docs} />}
          prompts={['Walk me through this framework', 'What hasn’t been updated in a while?']} onPrompt={p => toast(p)} onCooper={() => toast('Cooper')} />}>
        <div style={{ position: 'relative', height: '100%' }}>
          <CanvasBackground apiRef={api} view={view} onViewChange={setView} aria-label="Strategy framework map" style={{ position: 'absolute', inset: 0 }}
            overlay={<div style={{ position: 'absolute', left: 'var(--page-margin)', bottom: 'var(--space-300)' }}>
              <ValueMapButton type="shape" defaultSelected="fit" onFit={() => api.current && api.current.fit({ x: 300, y: -150, width: 1950, height: 1500 })}
                onExpand={() => toast('Expand all')} onCollapse={() => toast('Collapse all')} />
            </div>}>
            <MapovTree />
          </CanvasBackground>
          {shown && <div style={{ position: 'absolute', top: 'var(--space-300)', right: 'var(--page-margin)', width: 'var(--region-panel)' }}>
            <MapovTrace key={run} TraceReport={TraceReport} useIssueReport={useIssueReport}
              onDone={() => { setShown(false); toast('All issues resolved'); }}
              onUndo={() => { setShown(false); toast('Change undone'); }} />
          </div>}
          {!shown && <div style={{ position: 'absolute', top: 'var(--space-300)', right: 'var(--page-margin)' }}>
            <Button type="tertiary" size="s" iconLeft="arrow-refresh" onClick={() => { setRun(r => r + 1); setShown(true); }}>Replay the change</Button>
          </div>}
        </div>
      </AppShell>
    </div>
  );
}

function MapovTrace({ TraceReport, useIssueReport, onDone, onUndo }) {
  const c = useIssueReport({ issues: mapovIssues, kinds: IFS.TRACE_KINDS, onResolvedAll: onDone });
  return <TraceReport controller={c} onUndo={onUndo} style={{ width: 'var(--region-panel)' }} />;
}

SCREENS.push({ id: 'mapoverview', name: 'Map · Error detail (trace report)', Comp: ScreenMapoverview });
