// Library (Value · Strategy Frameworks) — After. Spec: specs/library.md, renders img/library-after-*.png
const libraryStages = [
  { value: 'command', label: 'Home' }, { value: 'value', label: 'Value' }, { value: 'explore', label: 'Explore' },
  { value: 'build', label: 'Build' }, { value: 'plan', label: 'Plan' }, { value: 'results', label: 'Results' },
];

const libraryNav = [
  { id: 'active', label: 'Active framework' },
  { type: 'section', label: 'Library', items: [
    { id: 'sf', label: 'Strategy frameworks' }, { id: 'vf', label: 'Value frameworks' }, { id: 'vm', label: 'Value models' },
  ] },
  { id: 'hp', label: 'Human Performance' },
];

const libraryDate = s => new Date(`${s}T00:00`);
const libraryFmt = d => IFS.format.date(d);
const libraryTorres = { name: 'M. Torres', initials: 'MT', type: 'dark-purple' };
const librarySingh = { name: 'A. Singh', initials: 'AS', type: 'blue' };

const libraryRows = [
  { id: 'f1', name: 'Copy of 2025 Strategy Framework v3', status: { type: 'gray', label: 'Draft' }, stage: 'Shape', modified: libraryDate('2025-10-02'), by: libraryTorres },
  { id: 'f2', name: 'Q1 2026 Strategy Framework', status: { type: 'green', label: 'Active' }, modified: libraryDate('2026-01-15'), by: { name: 'J. Carter', initials: 'JC', type: 'orange' } },
  { id: 'f3', name: 'Q2 2026 Strategy Framework', status: { type: 'blue', label: 'Ready to publish' }, scheduled: true, modified: libraryDate('2026-01-10'), by: librarySingh },
  { id: 'f4', name: 'Cost Optimization 2026', status: { type: 'gray', label: 'Draft' }, stage: 'Input', modified: libraryDate('2025-12-18'), by: librarySingh },
  { id: 'f5', name: 'Draft 2026', status: { type: 'gray', label: 'Draft' }, stage: 'Shape', modified: libraryDate('2025-02-15'), by: librarySingh },
  { id: 'f6', name: '2025 Strategy Framework v6', status: { type: 'gray', label: 'Draft' }, stage: 'Review', modified: libraryDate('2025-11-22'), by: librarySingh },
  { id: 'f7', name: '2025 Strategy Framework v3', status: { type: 'archive', label: 'Archived' }, modified: libraryDate('2025-10-02'), by: libraryTorres },
  { id: 'f8', name: '2025 Strategy Framework v2', status: { type: 'archive', label: 'Archived' }, modified: libraryDate('2025-04-18'), by: libraryTorres },
  { id: 'f9', name: '2024 Strategy Framework v1', status: { type: 'archive', label: 'Archived' }, modified: libraryDate('2024-11-10'), by: libraryTorres },
].map(r => ({ ...r, tags: [r.name.match(/20\d\d/) ? r.name.match(/20\d\d/)[0] : null, /^Q\d/.test(r.name) ? 'Quarterly' : null, /^Copy/.test(r.name) ? 'Copy' : null].filter(Boolean) }));

const libraryTabs = {
  variant: 'tabs',
  items: [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active', match: r => r.status.label === 'Active' },
    { value: 'ready', label: 'Ready to publish', match: r => r.status.label === 'Ready to publish' },
    { value: 'archived', label: 'Archived', match: r => r.status.label === 'Archived' },
    { value: 'draft', label: 'Draft', match: r => r.status.label === 'Draft' },
  ],
};

function ScreenLibrary({ bp, height }) {
  const { AppShell, NavBar, SideNav, BottomSheet, Button, IconButton, DataTable, Indicator, Badge } = IFS;
  const toast = useToast();
  const [section, setSection] = React.useState('sf');
  const [rows, setRows] = React.useState(libraryRows);

  const columns = [
    { key: 'name', title: 'Strategy framework', name: true, width: '1fr', filter: 'chips', filterValue: r => r.tags },
    { key: 'status', title: 'Status', width: 200, type: 'custom', filterValue: r => r.status.label,
      render: r => <>
        <Indicator type={r.status.type} size="s">{r.status.label}</Indicator>
        {r.stage && <Badge color="white" size="m">{r.stage}</Badge>}
        {r.scheduled && <IconButton icon="calendar-time" type="tertiary" size="s" label="Schedule publishing"
          onClick={e => { e.stopPropagation(); toast(`Schedule publishing for ${r.name}`); }} />}
      </> },
    { key: 'modified', title: 'Last modified', width: 136, kind: 'date', filter: false, type: 'custom', render: r => libraryFmt(r.modified) },
    { key: 'by', title: 'Created by', width: 200, type: 'user', filterValue: r => r.by.name },
  ];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AppShell height={height}
        navBar={<NavBar stages={libraryStages} defaultValue="value" hasNotifications user={{ initials: 'JP', name: 'J. Parker' }}
          onChange={navStage}
          onSearch={() => toast('Search')} onSettings={() => toast('Settings')} onNotifications={() => toast('Notifications')} />}
        sideNav={<SideNav title="Value" items={libraryNav} value={section}
          onSelect={goValueNav} />}
        bottom={<BottomSheet prompts={['Walk me through this framework', 'What hasn’t been updated in a while?']} cooperIndicator={false}
          onPrompt={l => toast(`Asked Cooper: ${l}`)} onCooper={() => toast('Opening Cooper')} />}>
        <div className="pg-content" style={{ paddingTop: 'var(--pg-gap)', paddingBottom: 'var(--pg-gap)' }}>
          <DataTable variant="standard" rows={rows} onRowsChange={setRows} filterTabs={libraryTabs}
            pageTop={{ title: 'Strategy framework', description: 'Published, archived, and draft strategy frameworks',
              actions: <Button type="secondary" size="m" iconLeft="system-pencil-plus" onClick={() => toast('New strategy framework')}>New</Button> }}
            search={{ placeholder: 'Ask anything about strategy frameworks', noResults: ['Q1 2026 Strategy Framework', 'Cost Optimization 2026'] }}
            onOpen={r => (r.id === 'f2' ? goScreen('dashboard') : r.id === 'f3' ? goScreen('review') : r.status.type === 'gray' ? goScreen('mapoverview') : toast(`${r.name} is archived`))} onRename={() => {}}
            columns={columns} />
        </div>
      </AppShell>
    </div>
  );
}

SCREENS.push({ id: 'library', name: 'Library (Value · Strategy Frameworks)', Comp: ScreenLibrary });
