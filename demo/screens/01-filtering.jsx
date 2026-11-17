// Filtering (Build · Idea Pad) — After. Spec: specs/filtering.md, renders img/filtering-after-*.png
const filteringStages = [
  { value: 'command', label: 'Home' }, { value: 'value', label: 'Value' }, { value: 'explore', label: 'Explore' },
  { value: 'build', label: 'Build' }, { value: 'plan', label: 'Plan' }, { value: 'results', label: 'Results' },
];

// 11 ideas (segment counts 11 / 8 / 3); the first 9 are the rows the Figma frame shows.
const filteringRows = [
  { id: 'i1', name: 'Northgate Substation Transformer Replacement', program: true, status: { type: 'orange', label: 'Under review', badge: '0/4' }, horizon: 'FY29–FY43', modified: 'Jan 12, 2026', date: '2026-01-12',
    collab: { label: 'View reply', avatar: { initials: 'IG', type: 'purple' }, who: 'I. Garcia', what: 'Replied to your question on outage history', when: '2h ago' }, keywords: ['Northgate', 'Substation', 'Replacement'] },
  { id: 'i2', name: 'Ridgeview Village Backup Tie to Feeder 5', program: true, status: { type: 'blue', label: 'New' }, horizon: 'FY30–FY50', modified: 'Jul 23, 2026', date: '2026-07-23', keywords: ['Feeder'] },
  { id: 'i3', name: 'Cedar Park Feeder Hardening Program', program: true, status: { type: 'gray', label: 'Deferred' }, horizon: 'FY29–FY39', modified: 'Apr 29, 2026', date: '2026-04-29',
    collab: { label: 'Provide asset health', avatar: { initials: 'MR', type: 'orange' }, who: 'M. Ridderikhoff', what: 'Asked for the asset health score', when: '1h ago' }, keywords: ['Feeder'] },
  { id: 'i4', name: 'Southern Feeder Replacement — Circuit 17C', status: { type: 'purple', label: 'Shaping' }, horizon: 'FY34–FY41', modified: 'Mar 11, 2026', date: '2026-03-11', keywords: ['Feeder', 'Replacement'] },
  { id: 'i5', name: 'Elmwood Feeder 2 Underground Cable Renewal', status: { type: 'purple', label: 'Shaping' }, horizon: 'FY34–FY36', modified: 'Feb 9, 2026', date: '2026-02-09', keywords: ['Feeder'] },
  { id: 'i6', name: 'West Corridor Protection Relay Upgrade', status: { type: 'purple', label: 'Shaping' }, horizon: 'FY30–FY32', modified: 'May 18, 2026', date: '2026-05-18',
    collab: { label: 'View reply', avatar: { initials: 'TN', type: 'blue' }, who: 'T. Nguyen', what: 'Attached the relay settings', when: '1d ago' }, keywords: ['Protection', 'Upgrade'] },
  { id: 'i7', name: 'Battery Storage at Northgate to Defer Feeder Upgrade', status: { type: 'purple', label: 'Shaping' }, horizon: 'FY30–FY32', modified: 'Jul 2, 2026', date: '2026-07-02',
    collab: { label: 'Provide asset condition', avatar: { initials: 'SC', type: 'green' }, who: 'S. Chen', what: 'Asked for the latest condition score', when: '3h ago' }, keywords: ['Northgate', 'Feeder', 'Upgrade'] },
  { id: 'i8', name: 'Recloser Swap-outs on Northgate Leftovers (F2, F7)', status: { type: 'purple', label: 'Shaping' }, horizon: 'FY30–FY32', modified: 'Jun 15, 2026', date: '2026-06-15', keywords: ['Northgate', 'Replacement'] },
  { id: 'i9', name: 'Flood Erosion Protection at River Crossing Structure', status: { type: 'archive', label: 'Rejected' }, horizon: 'FY30–FY32', modified: 'Jan 28, 2026', date: '2026-01-28', keywords: ['Protection'] },
  { id: 'i10', name: 'Birchwood Lateral Undergrounding Study', status: { type: 'purple', label: 'Shaping' }, horizon: 'FY31–FY35', modified: 'Dec 4, 2025', date: '2025-12-04', keywords: ['Feeder'] },
  { id: 'i11', name: 'Harbor Road Pole Line Rebuild', status: { type: 'blue', label: 'New' }, horizon: 'FY33–FY38', modified: 'Nov 20, 2025', date: '2025-11-20', keywords: ['Replacement'] },
];

const filteringSegments = [
  { value: 'all', label: 'All ideas' },
  { value: 'project', label: 'Project ideas', match: r => !r.program },
  { value: 'program', label: 'Program ideas', match: r => r.program },
];

// Column filters: chip values per column (only values present in the rows).
const filteringFilterValues = {
  name: r => r.keywords,
  status: r => [r.status.label],
  horizon: r => [r.horizon],
  collab: r => (r.collab ? [r.collab.label] : []),
};

function ScreenFiltering({ bp, height }) {
  const { AppShell, NavBar, BottomSheet, PageTop, Button, Tabs, Table, SegmentedControl, SmartSearch, Indicator, Badge, Tooltip, ColumnFilter, EmptyState } = IFS;
  const toast = useToast();
  const [segment, setSegment] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [applied, setApplied] = React.useState('');
  const [filters, setFilters] = React.useState({}); // key → [values]
  const [openFilter, setOpenFilter] = React.useState(null); // { key, left, top }
  const cardRef = React.useRef(null);
  const popRef = React.useRef(null);

  React.useEffect(() => {
    if (!openFilter) return undefined;
    const onDown = e => {
      if (popRef.current && popRef.current.contains(e.target)) return;
      if (e.target.closest && e.target.closest('.ifs-table-filter')) return; // the funnel toggles its own panel
      setOpenFilter(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [openFilter]);

  const searchMatch = r => {
    if (!applied) return true;
    const hay = [r.name, r.status.label, r.horizon, r.modified, r.collab ? r.collab.label : '', ...(r.keywords || [])].join(' ').toLowerCase();
    return applied.toLowerCase().split(/\s+/).filter(Boolean).some(w => hay.includes(w));
  };
  const filterMatch = r => Object.entries(filters).every(([k, vals]) => !vals || !vals.length || filteringFilterValues[k](r).some(v => vals.includes(v)));
  const base = filteringRows.filter(r => searchMatch(r) && filterMatch(r));
  const seg = filteringSegments.find(s => s.value === segment);
  const rows = base.filter(r => !seg.match || seg.match(r));

  const filterCol = key => ({
    applied: !!(filters[key] && filters[key].length),
    onClick: e => {
      e.stopPropagation();
      const b = e.currentTarget.getBoundingClientRect(); const w = cardRef.current.getBoundingClientRect();
      const scale = w.width / cardRef.current.offsetWidth || 1; // the review frame may be scaled
      setOpenFilter(o => (o && o.key === key ? null : { key, left: Math.min((b.left - w.left) / scale - 12, cardRef.current.offsetWidth - 252), top: (b.bottom - w.top) / scale + 8 }));
    },
  });

  const columns = [
    { key: 'name', title: 'Ideas', width: '1fr', filter: filterCol('name') },
    { key: 'status', title: 'Status', width: 200, type: 'custom', filter: filterCol('status'),
      render: r => <><Indicator type={r.status.type} size="s">{r.status.label}</Indicator>{r.status.badge && <Badge color="white" size="m">{r.status.badge}</Badge>}</> },
    { key: 'horizon', title: 'Horizon', width: 120, filter: filterCol('horizon') },
    { key: 'modified', title: 'Modified', width: 136, sortable: true, sortValue: r => new Date(`${r.date}T00:00`).getTime() },
    { key: 'collab', title: 'Collaboration', width: 240, type: 'custom', filter: filterCol('collab'),
      render: r => r.collab && (
        <Tooltip type="top" arrow="left" content={`${r.collab.who} · ${r.collab.what} · ${r.collab.when}`}>
          <Badge color="black" size="m" avatar={r.collab.avatar} role="button" tabIndex={0} aria-label={r.collab.label} style={{ cursor: 'pointer' }}
            onClick={e => { e.stopPropagation(); toast(`Opening “${r.collab.label}” on ${r.name}`); }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); toast(`Opening “${r.collab.label}” on ${r.name}`); } }}>
            {r.collab.label}
          </Badge>
        </Tooltip>
      ) },
  ];

  const segOptions = filteringSegments.map(s => ({ value: s.value, label: s.label, counter: base.filter(r => !s.match || s.match(r)).length }));
  const openKey = openFilter && openFilter.key;
  const filterOptions = openKey ? [...new Set(filteringRows.flatMap(filteringFilterValues[openKey]))].slice(0, 8).map(v => ({ value: v, label: v })) : [];
  const runSearch = q => { setQuery(q); setApplied(q || ''); };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AppShell height={height}
        navBar={<NavBar stages={filteringStages} defaultValue="build" hasNotifications user={{ initials: 'JP', name: 'J. Parker' }}
          onChange={navStage}
          onSearch={() => toast('Search')} onSettings={() => toast('Settings')} onNotifications={() => toast('Notifications')} />}
        bottom={<BottomSheet prompts={['Brief me', 'What needs my input first?']} cooperIndicator={false}
          onPrompt={l => toast(`Asked Cooper: ${l}`)} onCooper={() => toast('Opening Cooper')} />}>
        <div className="pg-content" style={{ paddingTop: 'var(--pg-gap)', paddingBottom: 'var(--pg-gap)' }}>
          <PageTop title="Build"
            actions={<Button type="secondary" size="m" iconLeft="system-pencil-plus" onClick={() => toast('New idea')}>New</Button>}
            tabs={<Tabs size="m" aria-label="Build views" value="ideas" onChange={v => v === 'inv' && toast('Investments isn’t part of this prototype')}
              items={[{ value: 'ideas', label: 'Idea Pad' }, { value: 'inv', label: 'Investments' }]} />} />
          <div ref={cardRef} style={{ position: 'relative' }}>
            <Table columns={columns} rows={rows}
              onRowClick={r => toast(`Opening ${r.name}`)}
              tabs={<SegmentedControl size="m" aria-label="Filter ideas" value={segment} onChange={setSegment} options={segOptions} />}
              search={<SmartSearch placeholder="Ask anything about idea pad" value={query}
                onChange={v => { setQuery(v); if (!v) setApplied(''); }} onSubmit={runSearch} onClear={() => runSearch('')} />} />
            {rows.length === 0 && (
              <div style={{ position: 'absolute', left: 0, right: 0, top: 120 }}>
                <EmptyState cause="no-results" heading="No results found" body="Try a different term, or clear filters to see everything."
                  primaryAction={{ label: 'Clear filters', type: 'secondary', onClick: () => { setFilters({}); runSearch(''); } }} />
              </div>
            )}
            {openFilter && (
              <div ref={popRef} style={{ position: 'absolute', zIndex: 'var(--z-index-z-popover)', left: Math.max(0, openFilter.left), top: openFilter.top }}>
                <ColumnFilter title="Filter" options={filterOptions} value={filters[openKey] || []}
                  onChange={v => setFilters(f => ({ ...f, [openKey]: v }))} onClearAll={() => setFilters(f => ({ ...f, [openKey]: [] }))} />
              </div>
            )}
          </div>
        </div>
      </AppShell>
    </div>
  );
}

SCREENS.push({ id: 'filtering', name: 'Filtering (Build · Idea Pad)', Comp: ScreenFiltering });
