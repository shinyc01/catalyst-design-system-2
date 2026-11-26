// Screen 06 — Dashboard (Value · Active Framework). Builder: data. Spec: specs/dashboard.md
const dashboardStages = [
  { value: 'command', label: 'Home' }, { value: 'value', label: 'Value' }, { value: 'explore', label: 'Explore' },
  { value: 'build', label: 'Build' }, { value: 'plan', label: 'Plan' }, { value: 'results', label: 'Results' },
];
const dashboardNav = [
  { id: 'active', label: 'Active framework' },
  { type: 'section', label: 'Library', items: [{ id: 'strategy', label: 'Strategy frameworks' }, { id: 'valuefw', label: 'Value frameworks' }, { id: 'models', label: 'Value models' }] },
  { id: 'hp', label: 'Human Performance' },
];
const dashboardStats = [
  { title: 'Portfolio benefit-cost ratio', value: '2.5' },
  { title: 'Total capital', value: '$1.24B' },
  { title: 'Risk coverage', value: '94%', description: 'of investments scored', descriptionPosition: 'inline' },
  { title: 'Industry position', value: '62nd', description: 'percentile among peer utilities', descriptionPosition: 'inline' },
];

// Series fills (portfolio rows) and legend
// Value drivers: one dark categorical slot each (rules 10.7, 10.12; decided Nov 25), the same in every chart here.
// The stacked columns split each driver into levels: StackedColumnChart `levels` gives each column its driver's dark slot (1 · 3 · 5 · 7 · 9, in column order) and its levels that family's ramp, step 2 on the baseline, then lighter upwards (rule 10.7, groups with levels).
const dashboardSlot = n => `var(--color-data-viz-categorical-${n})`;
const dashboardSeries = [
  { label: 'Reliability', fill: dashboardSlot(1), legend: dashboardSlot(1), proj: dashboardSlot(1) },
  { label: 'Financial', fill: dashboardSlot(3), legend: dashboardSlot(3), proj: dashboardSlot(3) },
  { label: 'Environment', fill: dashboardSlot(5), legend: dashboardSlot(5), proj: dashboardSlot(5) },
  { label: 'Social', fill: dashboardSlot(7), legend: dashboardSlot(7), proj: dashboardSlot(7) },
  { label: 'Governance', fill: dashboardSlot(9), legend: dashboardSlot(9), proj: dashboardSlot(9) },
];
const dashboardPortfolio = {
  weight: [['You', [40, 35, 13, 7, 5]], ['Peer avg', [35, 25, 16, 8, 16]], ['Best in class', [38, 28, 19, 4, 11]]],
  // "By budget" is not drawn in Figma — illustrative numbers so the toggle works.
  budget: [['You', [44, 31, 12, 6, 7]], ['Peer avg', [37, 27, 15, 9, 12]], ['Best in class', [36, 30, 18, 5, 11]]],
};

// Levels per driver, baseline first (a driver with 3 levels has no 4th).
const dashboardLevels = ['Objective 1', 'Objective 2', 'Objective 3', 'Objective 4'].map((label, j) => ({ key: `o${j}`, label }));
const dashboardColumnRows = rows => rows.map(([label, vals]) => Object.assign({ label }, ...vals.map((v, j) => ({ [`o${j}`]: v }))));
const dashboardColumns = {
  budget: dashboardColumnRows([['Reliability', [230, 20, 21, 32]], ['Financial', [25, 20, 260]], ['Environmental', [25, 28, 230, 20]], ['Social', [25, 20, 260]], ['Governance', [25, 28, 230, 20]]]),
  // "By investment" is not drawn in Figma — illustrative split so the toggle works.
  investment: dashboardColumnRows([['Reliability', [189, 30, 36, 48]], ['Financial', [43, 52, 210]], ['Environmental', [33, 40, 196, 34]], ['Social', [38, 42, 225]], ['Governance', [31, 36, 205, 31]]]),
};
// A one-off chart (rule 10.12 step 2): measure types appear nowhere else, so they take the free slots in order after the drivers (1 · 3 · 5 · 7 · 9).
const dashboardCoverage = [
  { label: 'Risk', value: 30, color: dashboardSlot(2) }, { label: 'Service measure', value: 19, color: dashboardSlot(4) },
  { label: 'Benefit', value: 18, color: dashboardSlot(6) }, { label: 'Cost', value: 17, color: dashboardSlot(8) },
  { label: 'Condition score', value: 10, color: dashboardSlot(10) }, { label: 'Resource', value: 6, color: dashboardSlot(11) },
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
    BarChartItem, StackedColumnChart, DonutChart, BottomSheet } = IFS;
  const toast = useToast();
  const [nav, setNav] = React.useState('active');
  const [view, setView] = React.useState('overview');
  const [pf, setPf] = React.useState('weight');
  const [so, setSo] = React.useState('budget');

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
                        style={{ flex: `${v} 1 0` }}>{v}%</BarChartItem>
                    ))}
                  </IFS.Inline>
                </IFS.Inline>
              ))}
            </div>
          </DataVizCard>

          <div className="ifs-grid">
            <DataVizCard title="Strategic objectives breakdown" className="ifs-span-8"
              header={{ segments: [{ value: 'budget', label: 'By budget' }, { value: 'investment', label: 'By investment' }], segmentValue: so, onSegmentChange: setSo }}>
              <StackedColumnChart bare levels height={353} data={dashboardColumns[so]} series={dashboardLevels} />
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
