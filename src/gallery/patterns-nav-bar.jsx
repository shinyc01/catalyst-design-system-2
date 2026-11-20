import React from 'react';
import { IFS } from '../components/index.js';

const IFS_GALLERY = [];
export default IFS_GALLERY;

{
  const { ExploreHeader, HomeRowCard, SideNavTree } = IFS;
  const { useState } = React;
  const Row = ({ label, children, top }) => <div className="g-row" style={top ? { alignItems: 'flex-start' } : null}><span className="g-label t-body-m-regular">{label}</span>{children}</div>;
  const USER = { initials: 'JP', name: 'J. Parker' };
  const STAGES = ['Command', 'Value', 'Explore', 'Build', 'Plan', 'Results'].map(l => ({ value: l.toLowerCase(), label: l }));
  const toast = title => IFS.toast && IFS.toast({ title });

  /* ───────────────────────── components ───────────────────────── */

  IFS_GALLERY.push({ name: 'NavBar: collapsed by width', figma: 'nav-bar-organism Type=Default ↔ Collapsed / Collapsed opened (3412:29453)', render: () => {
    const [w, setW] = useState(1200);
    const [stage, setStage] = useState('plan');
    return (
      <IFS.Stack gap="600">
        <Row label="Width (collapses below 800)"><IFS.SegmentedControl size="s" value={String(w)} onChange={v => setW(+v)} options={['1200', '900', '760', '600'].map(v => ({ value: v, label: `${v}px` }))} /></Row>
        <div style={{ width: w, transition: 'width .2s' }}><IFS.NavBar stages={STAGES} value={stage} onChange={setStage} hasNotifications user={USER} /></div>
        <Row label="Collapsed opened" top><div style={{ width: 600, height: 300 }}><IFS.NavBar collapsed stages={STAGES} defaultValue="value" defaultMenuOpen hasNotifications user={USER} /></div></Row>
      </IFS.Stack>
    );
  } });

  IFS_GALLERY.push({ name: 'ExploreHeader', figma: 'explore-header [patterns] (12:175111)', render: () => (
    <IFS.Stack gap="400" style={{ width: 1100 }}>
      <Row label="Default"><div style={{ flex: 1 }}><ExploreHeader search={{ suggestions: ['Where are the oldest feeders?', 'Show substations over capacity'] }} onCollaborators={() => toast('Collaborators')} onComments={() => toast('Comments')} /></div></Row>
      <Row label="Filters applied, new comments"><div style={{ flex: 1 }}><ExploreHeader filtersApplied hasNewComments collaborators="5/5" /></div></Row>
    </IFS.Stack>
  ) });

  const MiniMap = () => (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 40%, var(--background-elevation-1-tertiary), var(--surface-secondary-alpha) 70%)' }}>
      <div style={{ position: 'absolute', left: '30%', top: 30 }}><IFS.MapPinPole symbol="pin" number="Recloser R-1" pinIcon="asset type-substation" /></div>
      <div style={{ position: 'absolute', left: '66%', top: 18 }}><IFS.MapPinPole symbol="pin" number="Demeter SS" /></div>
      <div style={{ position: 'absolute', left: '62%', top: 84 }}><IFS.MapPinDot size="s" status="error" type="text" counter="88%" /></div>
    </div>
  );
  const DECISIONS = [
    { id: 1, title: 'Northgate Cluster · 7 aging feeders replacement', badge: 'Explore', description: '7 aging feeders serving Ridgeview Village and ~9,400 customers — reliability risk rising, flagged before failure, with an investment idea already drafted.', cpv: '$18.1M', vc: '1,345 V/$K', priority: 'critical' },
    { id: 2, title: 'EastZone C · Transformer Overload Risk', badge: 'Explore', description: '3 zones over safe capacity ahead of peak', cpv: '$12.4M', vc: '1,986 V/$K', priority: 'critical' },
    { id: 3, title: 'Ridgeline Substation · Protection Relay Fault', badge: 'Build', description: 'Relay protection upgrade serving West Corridor', cpv: '8.6M', vc: '2,092 V/$K', priority: 'critical' },
    { id: 4, title: 'Hera SS · Capacitor bank reactive support', badge: 'Plan', description: 'Voltage sagging across the South Loop at evening peak', cpv: '$7.3M', vc: '1,123 V/$K', priority: 'critical' },
    { id: 5, title: 'Apollo SS · Tx Bank 1 end-of-life replacement', badge: 'Explore', description: 'Lead transformer past expected life with a rising DGA trend', cpv: '$22.6M', vc: '4,876 V/$K', priority: 'critical' },
    { id: 6, title: 'Harbor feeders · Underground cable refurbishment', badge: 'Explore', description: '4 salt-exposed cable sections flagged ahead of storm season', cpv: '$9.8M', vc: '1,583 V/$K', priority: 'critical' },
  ];
  const metricsOf = d => [{ value: d.cpv, label: 'CPV' }, { value: d.vc, label: 'V/C' }];

  IFS_GALLERY.push({ name: 'HomeRowCard', figma: 'home-row-card-organism [patterns] (244:117301)', render: () => {
    const d = DECISIONS[0], e = DECISIONS[1];
    const box = { width: 1036 };
    return (
      <IFS.Stack gap="300">
        <Row label="Primary" top><div style={box}><HomeRowCard type="primary" rank={1} {...d} metrics={metricsOf(d)} media={<MiniMap />} onOpen={() => toast(`Opening ${d.title}`)} /></div></Row>
        <Row label="Primary hover" top><div style={box}><HomeRowCard type="primary" rank={1} {...d} metrics={metricsOf(d)} media={<MiniMap />} state="hover" /></div></Row>
        <Row label="Primary focus" top><div style={box}><HomeRowCard type="primary" rank={1} {...d} metrics={metricsOf(d)} media={<MiniMap />} state="focus" /></div></Row>
        <Row label="Primary loading" top><div style={box}><HomeRowCard type="primary" rank={1} metrics={metricsOf(d)} loading /></div></Row>
        <Row label="Secondary"><div style={box}><HomeRowCard rank={2} {...e} metrics={metricsOf(e)} onOpen={() => toast(`Opening ${e.title}`)} /></div></Row>
        <Row label="Secondary hover"><div style={box}><HomeRowCard rank={2} {...e} metrics={metricsOf(e)} state="hover" /></div></Row>
        <Row label="Secondary focus"><div style={box}><HomeRowCard rank={2} {...e} metrics={metricsOf(e)} state="focus" /></div></Row>
        <Row label="Secondary loading"><div style={box}><HomeRowCard rank={2} metrics={metricsOf(e)} loading /></div></Row>
        <Row label="Live alert"><div style={box}><HomeRowCard rank={3} {...e} liveAlert={{ type: 'storm', state: 'confirmed', label: 'Storm warning' }} metrics={metricsOf(e)} onOpen={() => {}} /></div></Row>
        <Row label="Collaboration"><div style={box}><HomeRowCard rank={4} {...e} collaboration={{ initials: 'AS', type: 'blue', size: 's' }} metrics={metricsOf(e)} onOpen={() => {}} /></div></Row>
        <Row label="No metrics"><div style={box}><HomeRowCard rank={5} {...e} onOpen={() => {}} /></div></Row>
      </IFS.Stack>
    );
  } });

  const PLAN_TREE = [
    { id: 'dc', label: 'DC Water Capital Improvement Plan', children: [{ id: 'dc-1', label: 'Water mains 2027' }, { id: 'dc-2', label: 'Treatment plant upgrades' }] },
    { id: 'wa', label: 'Whistler Americas', children: [
      { id: 'cot', label: 'Claude optimisation test' },
      { id: 'demo', label: 'Demo portfolio', children: [{ id: 'demo-1', label: 'Demo scenario A' }] },
      { id: 'el', label: 'Electrical', children: [{ id: 'el-d', label: 'Electrical Distribution' }, { id: 'el-t', label: 'Electrical Transmission' }] },
      { id: 'eg', label: 'Electrical Generation', children: [{ id: 'eg-1', label: 'Thermal & gas' }] },
    ] },
    { id: 'dist', label: 'Distribution', children: [{ id: 'dist-1', label: 'Urban feeders' }] },
  ];
  const PLAN_SECTIONS = [{ label: 'Ad hoc plans', action: { icon: 'system-plus', label: 'New ad hoc plan', onClick: () => toast('New ad hoc plan') },
    items: [{ id: 'ah1', label: 'All Transformer Investments' }, { id: 'ah2', label: 'Ridgeview Village — All Infrastructure' }, { id: 'ah3', label: 'Pluto Unit 4 Outage — 2026' }, { id: 'ah4', label: 'My investments' }] }];
  const findNode = (nodes, id) => { for (const n of nodes) { if (n.id === id) return n; const r = n.children && findNode(n.children, id); if (r) return r; } return null; };

  IFS_GALLERY.push({ name: 'SideNavTree', figma: 'sidebar-organism + Plan tree [patterns] (244:120655)', render: () => (
    <IFS.Inline gap="600" style={{ height: 640 }}>
      <SideNavTree title="Plan" tree={PLAN_TREE} sections={PLAN_SECTIONS} defaultValue="el" defaultExpanded={['wa', 'el']} />
      <SideNavTree title="Plan" tree={PLAN_TREE} sections={PLAN_SECTIONS} defaultValue="el-d" defaultExpanded={['wa', 'el']} />
      <SideNavTree title="Plan" tree={PLAN_TREE} defaultCollapsed />
    </IFS.Inline>
  ) });
}
