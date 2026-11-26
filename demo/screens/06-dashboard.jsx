// Screen 06 — Dashboard (Value · Active Framework). Builder: data. Spec: specs/dashboard.md
const dashboardStages = [
  { value: 'command', label: 'Home' }, { value: 'value', label: 'Value' }, { value: 'explore', label: 'Explore' },
  { value: 'build', label: 'Build' }, { value: 'plan', label: 'Plan' }, { value: 'results', label: 'Results' },
];
const dashboardNav = [
  { id: 'active', label: 'Active Framework' },
  { type: 'section', label: 'Library', items: [{ id: 'strategy', label: 'Strategy Frameworks' }, { id: 'valuefw', label: 'Value Frameworks' }, { id: 'models', label: 'Value Models' }] },
  { id: 'hp', label: 'Human Performance' },
];
const dashboardStats = [
  { title: 'Portfolio Benefit-Cost Ratio', value: '2.5' },
  { title: 'Total capital', value: '$1.24B' },
  { title: 'Risk coverage', value: '94%', description: 'of investments scored', descriptionPosition: 'inline' },
  { title: 'Industry position', value: '62nd', description: 'percentile among peer utilities', descriptionPosition: 'inline' },
];

// Series fills (portfolio rows) and legend
// One categorical slot per value driver (rules 10.7, 10.12; decided Nov 25): the same driver keeps its colour in every chart here.
const dashboardSlot = n => `var(--color-data-viz-categorical-${n})`;
const dashboardSeries = [
  { label: 'Reliability', fill: dashboardSlot(1), legend: dashboardSlot(1), proj: dashboardSlot(1) },
  { label: 'Financial', fill: dashboardSlot(2), legend: dashboardSlot(2), proj: dashboardSlot(2) },
  { label: 'Environment', fill: dashboardSlot(3), legend: dashboardSlot(3), proj: dashboardSlot(3) },
  { label: 'Social', fill: dashboardSlot(4), legend: dashboardSlot(4), proj: dashboardSlot(4) },
  { label: 'Governance', fill: dashboardSlot(5), legend: dashboardSlot(5), proj: dashboardSlot(5) },
];
const dashboardPortfolio = {
  weight: [['You', [40, 35, 13, 7, 5]], ['Peer avg', [35, 25, 16, 8, 16]], ['Best in class', [38, 28, 19, 4, 11]]],
  // "By budget" is not drawn in Figma — illustrative numbers so the toggle works.
  budget: [['You', [44, 31, 12, 6, 7]], ['Peer avg', [37, 27, 15, 9, 12]], ['Best in class', [36, 30, 18, 5, 11]]],
};

const dashboardColumns = {
  budget: [
    ['Reliability', [[32, dashboardSlot(1)], [21, dashboardSlot(1)], [20, dashboardSlot(1)], [230, dashboardSlot(1)]]],
    ['Financial', [[260, dashboardSlot(2)], [20, dashboardSlot(2)], [25, dashboardSlot(2)]]],
    ['Environmental', [[20, dashboardSlot(3)], [230, dashboardSlot(3)], [28, dashboardSlot(3)], [25, dashboardSlot(3)]]],
    ['Social', [[260, dashboardSlot(4)], [20, dashboardSlot(4)], [25, dashboardSlot(4)]]],
    ['Governance', [[20, dashboardSlot(5)], [230, dashboardSlot(5)], [28, dashboardSlot(5)], [25, dashboardSlot(5)]]],
  ],
  // "By investment" is not drawn in Figma — illustrative split so the toggle works.
  investment: [
    ['Reliability', [[48, dashboardSlot(1)], [36, dashboardSlot(1)], [30, dashboardSlot(1)], [189, dashboardSlot(1)]]],
    ['Financial', [[210, dashboardSlot(2)], [52, dashboardSlot(2)], [43, dashboardSlot(2)]]],
    ['Environmental', [[34, dashboardSlot(3)], [196, dashboardSlot(3)], [40, dashboardSlot(3)], [33, dashboardSlot(3)]]],
    ['Social', [[225, dashboardSlot(4)], [42, dashboardSlot(4)], [38, dashboardSlot(4)]]],
    ['Governance', [[31, dashboardSlot(5)], [205, dashboardSlot(5)], [36, dashboardSlot(5)], [31, dashboardSlot(5)]]],
  ],
};
const dashboardCoverage = [
  { label: 'Risk', value: 29, color: dashboardSlot(1) }, { label: 'Service measure', value: 18, color: dashboardSlot(2) },
  { label: 'Benefit', value: 17, color: dashboardSlot(3) }, { label: 'Cost', value: 16, color: dashboardSlot(4) },
  { label: 'Condition score', value: 10, color: dashboardSlot(5) }, { label: 'Resource', value: 6, color: dashboardSlot(6) },
];
const dashboardProjects = [
  ['Alpine Meadows Transformers', '$192M', [297, 297, 116, 67, 67]],
  ['Ridgeline Substation Rebuild', '$100M', [206, 206, 206, 67, 67]],
  ['Azure Peak Interconnect', '$80M', [256, 83, 256, 67, 67]],
  ['Whispering Pines Upgrade', '$56M', [128, 67, 415, 51, 48]],
  ['Shadow Canyon Expansion', '$51M', [185, 185, 88, 185, 48]],
  ['Emerald Vista Connection', '$49M', [49, 233, 116, 233, 48]],
];
const dashboardProjMax = 844;

function DashboardLegend({ proj }) {
  return <IFS.Legend items={dashboardSeries.map(s => ({ key: s.label, label: s.label, color: proj ? s.proj : s.legend }))} />;
}

function ScreenDashboard({ bp, height }) {
  const { AppShell, NavBar, SideNav, PageHeader, Indicator, SegmentedControl, CooperChip, StatCardsRow, StatCard, DataVizCard,
    BarChartItem, VerticalBarChartItem, DonutChart, BottomSheet } = IFS;
  const toast = useToast();
  const [nav, setNav] = React.useState('active');
  const [view, setView] = React.useState('overview');
  const [pf, setPf] = React.useState('weight');
  const [so, setSo] = React.useState('budget');
  const [activeCol, setActiveCol] = React.useState('Reliability');

  const header = (
    <PageHeader title="Q1 2026 Strategy Framework" onTitleMenu={() => toast('Framework menu')}
      status={<Indicator size="xs" type="green">Active</Indicator>}
      views={<SegmentedControl size="s" value={view} onChange={v => (v === 'node-map' ? goScreen('cooper') : setView(v))} options={[
        { value: 'overview', iconLeft: 'overview', ariaLabel: 'Overview' },
        { value: 'node-map', iconLeft: 'node-map', ariaLabel: 'Node map' },
        { value: 'capital-flow', iconLeft: 'capital-flow', ariaLabel: 'Capital flow' },
      ]} />}
      actions={<CooperChip onClick={() => goScreen('cooper')}>1 Recommendation</CooperChip>} />
  );

  const label = { color: 'var(--color-text)' };
  const muted = { color: 'var(--color-text-softer)' };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AppShell height="100%"
        navBar={<NavBar stages={dashboardStages} defaultValue="value" onChange={navStage} hasNotifications user={{ initials: 'JP', name: 'J. Parker' }} />}
        sideNav={<SideNav title="Value" items={dashboardNav} value={nav} onSelect={id => (id === 'active' ? setNav(id) : goValueNav(id))} />}
        header={header}
        bottom={<BottomSheet prompts={['Generate Cooper from chart', 'Compare to best practice']} onPrompt={l => toast(l)} onCooper={() => toast('Cooper')} />}>
        <IFS.Stack gap="page-gap" style={{ boxSizing: 'border-box', width: '100%', maxWidth: 'calc(var(--layout-max-content-width) + 2 * var(--pg-margin))', margin: '0 auto', padding: 'var(--pg-gap) var(--pg-margin)' }}>
          <div className="ifs-grid">{dashboardStats.map(c => <StatCard key={c.title} size="m" className="ifs-span-3" {...c} />)}</div>

          <DataVizCard title="Portfolio under this framework"
            header={{ segments: [{ value: 'weight', label: 'By weight' }, { value: 'budget', label: 'By budget' }], segmentValue: pf, onSegmentChange: setPf }}
            legend={<DashboardLegend />}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {dashboardPortfolio[pf].map(([name, vals], r) => (
                <IFS.Inline gap="200" align="center" key={name} style={{ padding: 'var(--space-100) 0' }}>
                  <span className="t-label-m-medium" style={{ ...label, width: 140, flex: 'none' }}>{name}</span>
                  <IFS.Inline gap="50" style={{ flex: '1 1 0', minWidth: 0 }}>
                    {vals.map((v, i) => (
                      <BarChartItem key={i} fill={dashboardSeries[i].fill} title={`${dashboardSeries[i].label}: ${v}%`}
                        style={{ flex: `${v} 1 0`, ...(r > 0 ? { color: 'var(--color-text-on-solid-soft)' } : null) }}>{v}%</BarChartItem>
                    ))}
                  </IFS.Inline>
                </IFS.Inline>
              ))}
            </div>
          </DataVizCard>

          <div className="ifs-grid">
            <DataVizCard title="Strategic objectives breakdown" className="ifs-span-8"
              header={{ segments: [{ value: 'budget', label: 'By budget' }, { value: 'investment', label: 'By investment' }], segmentValue: so, onSegmentChange: setSo }}>
              <IFS.Inline gap="150" style={{ height: 353 }}>
                <div className="t-label-m-medium" style={{ ...muted, width: 37, flex: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 'var(--space-inset)' }}>
                  {['100%', '80%', '60%', '40%', '20%', '0'].map(t => <span key={t}>{t}</span>)}
                </div>
                <IFS.Stack gap="stack" style={{ flex: '1 1 0', minWidth: 0 }}>
                  <IFS.Inline gap="50" align="end" style={{ padding: 'var(--space-100)', height: 321, boxSizing: 'border-box' }}>
                    {dashboardColumns[so].map(([name, segs]) => (
                      <div key={name} style={{ flex: '1 1 0', minWidth: 0 }}>
                        <VerticalBarChartItem width="100%" height={313} label={name} active={activeCol === name}
                          onActiveChange={on => setActiveCol(on ? name : null)}
                          segments={segs.map(([v, fill]) => ({ value: v, fill }))} />
                      </div>
                    ))}
                  </IFS.Inline>
                  <IFS.Inline gap="50" style={{ padding: '0 var(--space-100)' }}>
                    {dashboardColumns[so].map(([name]) => <span key={name} className="t-label-m-medium" style={{ ...muted, flex: '1 1 0', textAlign: 'center' }}>{name}</span>)}
                  </IFS.Inline>
                </IFS.Stack>
              </IFS.Inline>
            </DataVizCard>
            <DataVizCard title="Framework coverage by measure type" className="ifs-span-4">
              <DonutChart bare data={dashboardCoverage} sort={false} height={300} valueLabel="Share" format={v => `${v}%`} />
            </DataVizCard>
          </div>

          <DataVizCard title="Projects by value driver" header={{ button: { label: 'Show all', iconRight: 'arrow-right', onClick: () => toast('Show all projects') } }}
            legend={<DashboardLegend proj />}>
            <IFS.Stack gap="100">
              {dashboardProjects.map(([name, value, segs]) => {
                const sum = segs.reduce((a, b) => a + b, 0);
                return (
                  <IFS.Inline gap="stack" align="center" key={name} style={{ padding: 'var(--space-150) 0' }}>
                    <span className="t-label-m-medium" style={{ ...label, width: 196, flex: 'none' }}>{name}</span>
                    <IFS.Inline gap="stack" align="center" style={{ flex: '1 1 0', minWidth: 0 }}>
                      <IFS.Inline gap="50" style={{ width: `calc((100% - 64px) * ${sum / dashboardProjMax})` }}>
                        {segs.map((w, i) => <BarChartItem key={i} number={false} fill={dashboardSeries[i].proj} title={`${name} · ${dashboardSeries[i].label}`}
                          style={{ flex: `${w} 1 0`, height: 16 }} />)}
                      </IFS.Inline>
                      <span className="t-label-m-medium" style={label}>{value}</span>
                    </IFS.Inline>
                  </IFS.Inline>
                );
              })}
            </IFS.Stack>
          </DataVizCard>
        </IFS.Stack>
      </AppShell>
    </div>
  );
}

SCREENS.push({ id: 'dashboard', name: 'Dashboard (Value · Active Framework)', Comp: ScreenDashboard });
