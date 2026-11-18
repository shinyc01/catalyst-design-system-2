// Screen 05 — Review (Approve step). Builder: data. Spec: specs/review.md
const reviewStages = [
  { value: 'command', label: 'Home' }, { value: 'value', label: 'Value' }, { value: 'explore', label: 'Explore' },
  { value: 'build', label: 'Build' }, { value: 'plan', label: 'Plan' }, { value: 'results', label: 'Results' },
];

const reviewStats = [
  { title: 'Portfolio value', trend: '4.8 %', compare: { from: '$2.14B', to: '$2.24B', fromLabel: 'Current', toLabel: 'Proposed' } },
  { title: 'Investments re-scored', value: '1,621', description: '357 gained • 519 lost • 745 unchanged' },
  { title: 'Finding tier changes', value: '876', description: '52 gained • 31 lost • 12 major shift' },
  { title: 'Governance flags', value: '1', description: 'executing investment affected' },
];

const reviewMetrics = [
  { title: 'Investments re-scored', value: '1,621' },
  { title: 'Net value change', value: '-3.1%', direction: 'down', tone: 'danger' },
  { title: 'Materially impacted', value: '225' },
  { title: 'Funding-tier changes', value: '38' },
];

// Bar heights (px of a 200px / 250-unit plot) from the spec. The kit draws value/max × 192px, so value = px × 250 / 192.
const reviewBinsPx = [
  ['Major loss', 41, 'loss', 5, 51], ['Moderate loss', 48, 'loss', 4, 60], ['Minor loss', 67, 'loss', 3, 84],
  ['No material change', 140, 'unchanged', null, 175],
  ['Minor gain', 81, 'gain', 3, 101], ['Moderate gain', 74, 'gain', 4, 93], ['Major gain', 38, 'gain', 5, 48],
];
const reviewBins = reviewBinsPx.map(([label, px, tone, step, n]) => ({
  label, value: (px * 250) / 192, tone, step: step || undefined, n,
  color: tone === 'unchanged' ? 'var(--background-elevation-1-secondary)' : undefined,
}));
const reviewLegend = [
  { label: 'Loss', color: 'var(--data-viz-alert-data-4)' },
  { label: 'No change', color: 'var(--background-elevation-1-secondary)' },
  { label: 'Gain', color: 'var(--data-viz-deep-green-data-4)' },
];

const reviewUnchangedTypes = ['Reliability', 'Safety', 'Cost', 'Asset Replacement'];
const reviewUnchangedNames = ['Feeder Upgrade', 'Pole Replacement', 'Meter Refresh', 'Line Reconductoring', 'Switchgear Renewal', 'Cable Replacement'];
const reviewRows = [
  { id: 'g1', group: 'Biggest gainers', name: 'Substation 12 Reliability Upgrade', type: 'Reliability', total: { from: '$3.1M', to: '$4.4M' }, change: { value: '+$1.3M', direction: 'up' }, ratio: { from: '2.6', to: '3.7' } },
  { id: 'g2', group: 'Biggest gainers', name: 'Grid Hardening Program', type: 'Reliability', total: { from: '$5.0M', to: '$6.2M' }, change: { value: '+$1.2M', direction: 'up' }, ratio: { from: '2.5', to: '3.1' } },
  { id: 'g3', group: 'Biggest gainers', name: 'Transformer Replacement — North', type: 'Asset Replacement', total: { from: '$2.8M', to: '$3.4M' }, change: { value: '+$0.6M', direction: 'up' }, ratio: { from: '1.9', to: '2.3' } },
  { id: 'l1', group: 'Lost the most value', name: 'Vegetation Management', type: 'Safety', total: { from: '$4.2M', to: '$2.9M' }, change: { value: '-$1.3M', direction: 'down' }, ratio: { from: '1.6', to: '1.1' } },
  { id: 'l2', group: 'Lost the most value', name: 'Safety Compliance Retrofit', type: 'Cost', total: { from: '$3.6M', to: '$3.0M' }, change: { value: '-$0.6M', direction: 'down' }, ratio: { from: '1.7', to: '1.4' } },
  // "Unchanged · 408": generated placeholder rows (the spec only gives the count; the group starts collapsed).
  ...Array.from({ length: 408 }, (_, i) => {
    const v = (0.4 + ((i * 37) % 21) / 10).toFixed(1), r = (1 + ((i * 13) % 15) / 10).toFixed(1);
    return { id: 'u' + i, group: 'Unchanged', name: `${reviewUnchangedNames[i % 6]} ${String(i + 1).padStart(3, '0')}`, type: reviewUnchangedTypes[i % 4],
      total: { from: `$${v}M`, to: `$${v}M` }, change: { value: '$0.0M' }, ratio: { from: r, to: r } };
  }),
];

const reviewSections = [
  { id: 'impact', title: 'Portfolio impact', badge: { label: '+4.8%', tone: 'success', icon: 'arrow-caret-up-filled' },
    content: <IFS.ReadinessFacts rows={[['Current value', '$2.14B'], ['Proposed value', '$2.24B'], ['Net change', '+4.8%', 'success']]} /> },
  { id: 'rescored', title: 'Investments re-scored', badge: '1,621',
    content: <IFS.ReadinessFacts rows={[['Gained', '357'], ['Lost', '519'], ['Unchanged', '745']]} /> },
  { id: 'tiers', title: 'Fundings-tier changes', badge: '38',
    content: <IFS.ReadinessFacts rows={[['Funding-tier changes', '38']]} /> },
  { id: 'risks', title: 'Flagged risks', badge: { label: '1 resolved', tone: 'success' },
    content: <IFS.ReadinessFacts rows={[['Executing investment affected', 'Resolved', 'success']]} /> },
  { id: 'notes', title: 'Reviewer notes', count: 2,
    content: <p className="t-body-m-regular" style={{ margin: 0, color: 'var(--text-secondary)' }}>2 notes in the approval chain.</p> },
];

function ScreenReview({ bp, height }) {
  const { AppShell, NavBar, SideNav, PageHeader, Indicator, SegmentedControl, Stepper, CollaboratorsButton, CommentButton, Button,
    SplitButton, Stat, Tabs, InvestmentValueImpact, TableReview, Panel, ReadinessEvaluation, BottomSheet, EmptyState } = IFS;
  const toast = useToast();
  const [tab, setTab] = React.useState('impact');
  const [approved, setApproved] = React.useState(false);
  const [view, setView] = React.useState('overview');

  const header = (
    <PageHeader title="Copy of Q1 2026 Enterprise Strategy Framework" onTitleMenu={() => toast('Framework menu')}
      status={<Indicator size="xs" type="orange">Pending approval</Indicator>}
      views={<SegmentedControl size="s" value={view} onChange={setView} options={[
        { value: 'overview', iconLeft: 'overview', ariaLabel: 'Overview' },
        { value: 'node-map', iconLeft: 'node-map', ariaLabel: 'Node map' },
        { value: 'capital-flow', iconLeft: 'capital-flow', ariaLabel: 'Capital flow' },
      ]} />}
      center={<Stepper current={3} active={3} steps={[{ label: 'Input' }, { label: 'Shape' }, { label: 'Review' }, { label: 'Approve' }]} />}
      actions={<>
        <CollaboratorsButton accepted={3} invited={5} onClick={() => toast('Collaborators')} />
        <CommentButton size="s" onClick={() => toast('Comments')} />
        <Button type="secondary" size="s" onClick={() => toast('Approval chain')}>Approval chain</Button>
        {approved
          ? <SplitButton disabled iconLeft="system-check" items={[{ label: 'Request more information' }]}>Approved</SplitButton>
          : <SplitButton onClick={() => { setApproved(true); toast('Framework approved'); }}
              items={[{ label: 'Request more information', description: 'Ask for more detail about idea.', onClick: () => toast('Revision requested') }]}>Approve</SplitButton>}
      </>} />
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AppShell height="100%"
        navBar={<NavBar stages={reviewStages} defaultValue="value" onChange={navStage} hasNotifications user={{ initials: 'JP', name: 'J. Parker' }} />}
        sideNav={<SideNav title="Value" defaultCollapsed items={[{ id: 'active', label: 'Active Framework' }]} onSelect={goValueNav} />}
        header={header}
        bottom={<BottomSheet prompts={['Explain me the value impact', 'Evaluate publish risk']} onPrompt={l => toast(l)} onCooper={() => toast('Cooper')} />}>
        <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
          <div className="ifs-scroll" style={{ flex: '1 1 0', minWidth: 0, overflow: 'auto' }}>
            <div style={{ boxSizing: 'border-box', width: '100%', maxWidth: 'calc(var(--layout-max-content-width) + 2 * var(--pg-margin))', margin: '0 auto',
              padding: 'var(--pg-gap) var(--pg-margin)', display: 'flex', flexDirection: 'column', gap: 'var(--pg-gap)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-200)' }}>
                <span className="t-heading-h2-medium" style={{ color: 'var(--text-primary)' }}>Executive summary</span>
                <span className="t-label-m-medium" style={{ color: 'var(--text-secondary)' }}>Applying this change increases Reliability influence by 18%, decreases Safety influence by 7%, and changes the value of 876 investments.</span>
              </div>
              <Stat items={reviewStats} style={{ gap: 'var(--pg-gap)' }} />
              <Tabs aria-label="Review views" value={tab} onChange={setTab} items={[{ value: 'impact', label: 'Portfolio Impact' }, { value: 'alignment', label: 'Strategic Alignment' }]} />
              {tab === 'impact' ? <>
                <InvestmentValueImpact metrics={reviewMetrics} bins={reviewBins} legend={reviewLegend} max={250} ticks={6}
                  format={b => `${b.label}: ~${b.n} investments`} />
                <TableReview rows={reviewRows} defaultCollapsed={['Unchanged']} onFilter={k => toast(`Filter ${k === 'name' ? 'Investment' : 'Type'}`)} />
              </> : (
                <EmptyState cause="empty-container" heading="Strategic Alignment" body="This view is not part of this prototype." />
              )}
            </div>
          </div>
          <Panel title="Readiness evaluation" onEvidence={() => toast('Evidence chain')}>
            <ReadinessEvaluation
              summary={{ title: 'Ready to Approve', text: 'All governance checks passed and the one flagged risk has been resolved. Net portfolio value rises 4.8% ($2.14B → $2.24B) with 1,621 investments re-scored.' }}
              readiness={100}
              checks={[
                { label: 'Objective weighting', type: 'done', right: 'Passed' },
                { label: 'Strategic alignment', type: 'done', right: 'Passed' },
                { label: 'Risk balance', type: 'done', right: 'Passed' },
                { label: 'Governance flags', type: 'done', right: 'Passed' },
              ]}
              sections={reviewSections} />
          </Panel>
        </div>
      </AppShell>
    </div>
  );
}

SCREENS.push({ id: 'review', name: 'Review (Approve step)', Comp: ScreenReview });
