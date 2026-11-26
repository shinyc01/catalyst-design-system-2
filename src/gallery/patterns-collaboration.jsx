import React from 'react';
import { IFS } from '../components/index.js';

const IFS_GALLERY = [];
export default IFS_GALLERY;

{
  const Row = ({ label, children, style }) => <div className="g-row" style={style}><span className="g-label t-body-m-regular">{label}</span>{children}</div>;
  const canvasBg = { position: 'relative', padding: 'var(--space-600)', borderRadius: 'var(--radius-floating)', background: 'var(--color-surface-canvas)' };
  const HOUR = 3600 * 1000;

  /* ---------------- data (Figma names) ---------------- */
  const P = (id, name, title, type, initials) => ({ id, name, title, avatar: { type }, initials });
  const ME = { ...P('jp', 'Jordan P.', 'Reliability lead', 'black', 'JP'), status: 'owner', access: 'owner', online: true };
  const MARIA = P('mc', 'Maria Chen', 'Reliability lead', 'dark-pink');
  const LARA = P('lg', 'Lara Green', 'Field team lead', 'green');
  const JAMES = P('jr', 'James Reyes', 'Planning engineer', 'yellow');
  const KATARINA = P('ko', 'Katarina Olsson', 'Asset manager', 'blue');
  const JAN = P('jan', 'Jan Ray', 'Planning engineer', 'dark-purple');
  const ISABELLA = P('ig', 'Isabella Grant', 'Asset manager', 'yellow');
  const DIRECTORY = [
    P('jb', 'Jane Brown', 'Asset manager', 'dark-pink'), P('jg', 'Jane Green', 'Field team lead', 'green'),
    P('jc', 'Janice Chen', 'Planning engineer', 'orange'), P('jh', 'Jasmine Hadar', 'Cost estimator', 'light-purple'),
    P('jpi', 'Julia Pipes', 'Field team lead', 'blue'), P('al', 'Armando Lane', 'Planning engineer', 'dark-blue'),
    P('bd', 'Barbara Dickinson', 'Asset manager', 'brown'), JAN, ISABELLA, MARIA, LARA, JAMES, KATARINA,
  ];
  const RECENT = [DIRECTORY[5], DIRECTORY[6]];
  const ROLES = ['Asset manager', 'Planning engineer', 'Field team lead', 'Planning manager', 'Cost estimator'];
  const BRIEF = () => 'Q1 Strategy Framework needs regulatory sign-off on 3 points:\n\n1. Reliability stays above SB-901 30% floor at 40%. No conflict with filed 2023 GRC commitments.\n\n2. Environmental +3pp strengthens SB-100 trajectory alignment.\n\n3. WTRM v1 is a new model; its methodology mirrors WDRM already approved in D.22-08-013.\n\nI cannot see live pre-filing discussions. If there’s something in your channel that conflicts, flag it.\n\nConfidence (regulatory): medium';
  const ago = h => Date.now() - h * HOUR;
  const joined = (p, online) => ({ ...p, status: 'joined', access: 'editor', online, brief: BRIEF(), notifiedAt: ago(72) });
  const waiting = (p, h) => ({ ...p, status: 'awaiting', access: 'editor', brief: BRIEF(), notifiedAt: ago(h) });
  const PRESETS = {
    owner: { label: 'Owner only (1/1)', people: [ME], suggested: [JAN, ISABELLA, MARIA, LARA, JAMES, KATARINA] },
    pending: { label: 'Owner + awaiting (1/5)', people: [ME, waiting(MARIA, 20), waiting(LARA, 20), waiting(JAMES, 50), waiting(KATARINA, 2)], suggested: [JAN, ISABELLA] },
    partial: { label: 'Some accepted (3/5)', people: [ME, joined(MARIA, true), joined(LARA, false), waiting(JAMES, 50), waiting(KATARINA, 2)], suggested: [JAN, ISABELLA] },
    complete: { label: 'All accepted (5/5)', people: [ME, joined(MARIA, true), joined(LARA, true), joined(JAMES, false), joined(KATARINA, true)], suggested: [JAN, ISABELLA] },
  };
  const useCollab = preset => IFS.useCollaboration({ people: PRESETS[preset].people, suggested: PRESETS[preset].suggested, directory: DIRECTORY, recent: RECENT, roles: ROLES, brief: BRIEF });

  /* ---------------- components ---------------- */
  IFS_GALLERY.push({ name: 'CollaboratorCursor', figma: 'cursor-atom (55:1645)', render: () => <div style={{ ...canvasBg, display: 'grid', gridTemplateColumns: 'repeat(6, max-content)', gap: '20px 28px' }}>
    {Array.from({ length: 16 }, (_, i) => <IFS.CollaboratorCursor key={i} user={i + 1} name={`User ${i + 1}`} />)}
    <IFS.CollaboratorCursor user="cooper" />
  </div> });

  IFS_GALLERY.push({ name: 'LiveCursors', figma: 'cursor-atom (55:1645) over canvas-background [patterns] (12:9653)', render: () =>
    <div style={{ ...canvasBg, height: 260, padding: 0, overflow: 'hidden' }}>
      <IFS.LiveCursors users={[{ id: 'mc', ...MARIA }, { id: 'lg', ...LARA }, { id: 'ko', ...KATARINA }, { id: 'co', name: 'Cooper', cooper: true }]} />
    </div> });

  IFS_GALLERY.push({ name: 'CollaboratorsButton', figma: 'header-pattern / collaboration [patterns] (I12:8475;4485:119305)', render: () => <>
    {[[1, 1, 'Owner only'], [1, 5, 'Owner + awaiting'], [3, 5, 'Some accepted'], [5, 5, 'All accepted']].map(([a, i, l]) =>
      <Row key={l} label={l}><IFS.CollaboratorsButton accepted={a} invited={i} /></Row>)}
  </> });

  IFS_GALLERY.push({ name: 'RoleSelect', figma: 'single-select-atom + single-select-list-molecule [patterns] (12:8637)', render: () => <>
    <Row label="editor (click to open)"><IFS.RoleSelect defaultValue="editor" onRemove={() => {}} /></Row>
    <Row label="viewer"><IFS.RoleSelect defaultValue="viewer" onRemove={() => {}} /></Row>
    <Row label="no Remove (modal)"><IFS.RoleSelect defaultValue="editor" /></Row>
    <Row label="disabled"><IFS.RoleSelect defaultValue="editor" disabled /></Row>
  </> });

  IFS_GALLERY.push({ name: 'CollaboratorRow', figma: 'content-card-organism top slot [patterns] (12:8519)', render: () =>
    <IFS.Stack gap="200" style={{ width: 352, padding: 'var(--space-100)', background: 'var(--color-surface-elevation-1)', borderRadius: 'var(--radius-floating)' }}>
      <IFS.CollaboratorRow person={{ ...ME, you: true }} />
      <IFS.CollaboratorRow person={joined(MARIA, true)} onOpen={() => {}} onRemove={() => {}} />
      <IFS.CollaboratorRow person={joined(LARA, false)} onOpen={() => {}} onRemove={() => {}} />
      <IFS.CollaboratorRow person={waiting(KATARINA, 2)} onOpen={() => {}} onRemove={() => {}} />
      <IFS.CollaboratorRow person={waiting(JAMES, 50)} push="available" onOpen={() => {}} onRemove={() => {}} />
      <IFS.CollaboratorRow person={waiting(JAMES, 0)} push="notified" onOpen={() => {}} onRemove={() => {}} />
      <IFS.CollaboratorRow person={JAN} onAdd={() => {}} />
      <IFS.CollaboratorRow person={ISABELLA} onAdd={() => {}} state="hover" />
    </IFS.Stack> });

  IFS_GALLERY.push({ name: 'RoleFilter', figma: 'icon-button + multiple-select-list-molecule [patterns] (12:11259)', render: () => {
    const [v, setV] = React.useState([]);
    return <Row label={v.length ? v.join(', ') : 'All roles'} style={{ minHeight: 230, alignItems: 'flex-start' }}>
      <div style={{ marginInlineStart: 180 }}><IFS.RoleFilter roles={ROLES} value={v} onChange={setV} /></div></Row>;
  } });

  IFS_GALLERY.push({ name: 'CollaboratorsPanel', figma: 'popover-organism Collaborators [patterns] (12:10231 / 12:10037 / 12:9653 / 12:9847)', render: () => {
    const Panel = ({ preset, q }) => { const c = useCollab(preset); return <div><div className="g-label t-body-m-regular" style={{ marginBottom: 'var(--space-200)' }}>{q ? `Search "${q}"` : PRESETS[preset].label}</div>
      <IFS.CollaboratorsPanel inline controller={c} defaultQuery={q} onInvite={() => {}} onOpen={() => {}} onRemove={() => {}} onPush={p => c.push(p.id)} /></div>; };
    return <IFS.Inline gap="600" align="start" wrap>
      <Panel preset="owner" /><Panel preset="pending" /><Panel preset="partial" /><Panel preset="complete" />
      <Panel preset="partial" q="Ja" /><Panel preset="partial" q="Hafs" />
    </IFS.Inline>;
  } });

  IFS_GALLERY.push({ name: 'InviteCollaboratorModal', figma: 'modal-organism Add Collaborator [patterns] (12:11386 / 12:9330)', render: () =>
    <IFS.Inline gap="600" align="start" wrap>
      <IFS.InviteCollaboratorModal inline open person={DIRECTORY[0]} defaultBrief={BRIEF()} onCancel={() => {}} onSubmit={() => {}} />
      <IFS.InviteCollaboratorModal inline open mode="edit" person={JAMES} defaultBrief={BRIEF()} onCancel={() => {}} onSubmit={() => {}} />
    </IFS.Inline> });

  IFS_GALLERY.push({ name: 'RemoveCollaboratorModal', figma: 'modal-organism Remove this collaborator? [patterns] (12:12281)', render: () =>
    <IFS.RemoveCollaboratorModal inline open person={waiting(JAMES, 2)} body="They lose access to this framework." onCancel={() => {}} onConfirm={() => {}} /> });

  /* ---------------- pattern screens ---------------- */
  const shell = { position: 'relative', width: 1440, height: 900, display: 'grid', gridTemplateRows: '48px 1fr', overflow: 'hidden',
    background: 'var(--color-surface-canvas)', border: '1px solid var(--color-border-soft)', boxSizing: 'content-box' };
  const NODES = [['enterprise-goal', 'Enterprise goals', 5], ['value-framework', 'Value Framework v12'], ['strategic-objective', 'Strategic objectives', 5], ['value-model', 'Value models', 7], ['measure', 'Measures', 29]];
  const COLS = ['Enterprise goals', 'Value framework', 'Strategic objectives', 'Value models', 'Measure output'];

  function FrameworkScreen({ c, panelOpen, onPanelOpen, cursors }) {
    const online = c.members.filter(p => p.online && p.status !== 'owner');
    return (
      <div style={shell} aria-label="Draft framework with collaborators">
        <IFS.NavBar defaultValue="value" hasNotifications user={{ initials: 'JP', name: 'Jordan P.' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-400)', boxShadow: 'inset calc(-1 * var(--border-width-default)) 0 0 var(--color-border-soft)' }}><IFS.ArrowButton label="Open navigation" /></div>
          <div style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr 40px', minHeight: 0, minWidth: 0 }}>
            <div style={{ position: 'relative', zIndex: 9 }}>
              <IFS.PageHeader title="Q1 2027 Strategy Framework" onBack={() => {}} onTitleMenu={() => {}}
                status={<IFS.Indicator type="gray" size="xs">Draft</IFS.Indicator>}
                views={<IFS.SegmentedControl size="s" defaultValue="map" aria-label="View" options={[{ value: 'grid', iconLeft: 'overview', ariaLabel: 'Overview' }, { value: 'map', iconLeft: 'node-map', ariaLabel: 'Node map' }, { value: 'flow', iconLeft: 'capital-flow', ariaLabel: 'Capital flow' }]} />}
                actions={<IFS.Inline as="span" gap="100" align="center">
                  <IFS.CollaboratorsMenu controller={c} open={panelOpen} onOpenChange={onPanelOpen} />
                  <IFS.CommentButton />
                  <span style={{ width: 'var(--border-width-default)', height: 'var(--size-24)', margin: '0 var(--space-200)', background: 'var(--color-border-soft)' }} aria-hidden="true" />
                  <IFS.Button type="primary" size="s">Review</IFS.Button>
                </IFS.Inline>} />
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 344 }}>
                <IFS.Stepper steps={[{ label: 'Input' }, { label: 'Shape' }, { label: 'Review' }, { label: 'Approve' }]} current={1} /></div>
            </div>
            <div style={{ isolation: 'isolate' }}><IFS.CanvasHeader columns={COLS} /></div>
            <div style={{ position: 'relative', minHeight: 0, isolation: 'isolate' }}>
              <IFS.CanvasBackground style={{ position: 'absolute', inset: 0 }}
                overlay={<>
                  <div style={{ position: 'absolute', insetInlineStart: 14, bottom: 14, zIndex: 3 }}><IFS.ValueMapButton type="shape" /></div>
                  {cursors && <IFS.LiveCursors users={online} />}
                </>}>
                {NODES.map(([t, title, n], i) => <div key={t} style={{ position: 'absolute', left: 140 + i * 240, top: 360 }}><IFS.NodeCard type={t} title={title} counter={n} /></div>)}
              </IFS.CanvasBackground>
            </div>
            <IFS.BottomSheet type="value" style={{ position: 'relative' }} documents={{ label: '3 documents', icon: 'system-file' }} onUpload={() => {}}
              prompts={['Walk me through this framework', 'What hasn’t been updated in a while?']} />
          </div>
        </div>
      </div>
    );
  }

  IFS_GALLERY.push({ name: 'Pattern: Collaboration on a framework', figma: 'Map - Overview - Collaborator panel partial [patterns] (12:9653)', render: () => {
    const [preset, setPreset] = React.useState('partial');
    return <CollabDemo key={preset} preset={preset} setPreset={setPreset} />;
  } });
  function CollabDemo({ preset, setPreset }) {
    const c = useCollab(preset);
    const [open, setOpen] = React.useState(true);
    const [cursors, setCursors] = React.useState(true);
    const next = c.awaiting[0];
    return <>
      <IFS.Inline gap="200" align="center" wrap style={{ marginBottom: 'var(--space-300)', maxWidth: 1440 }}>
        <span className="t-label-m-medium" style={{ color: 'var(--color-text-softer)' }}>Demo — state:</span>
        <IFS.SegmentedControl size="s" value={preset} onChange={setPreset} options={Object.entries(PRESETS).map(([value, p]) => ({ value, label: p.label }))} />
        <IFS.Button size="s" type="tertiary" disabled={!next} onClick={() => next && c.accept(next.id, true)}>{next ? `Simulate: ${next.name} accepts` : 'Everyone accepted'}</IFS.Button>
        <IFS.Button size="s" type="tertiary" onClick={() => setCursors(!cursors)}>{cursors ? 'Hide live cursors' : 'Show live cursors'}</IFS.Button>
      </IFS.Inline>
      <FrameworkScreen c={c} panelOpen={open} onPanelOpen={setOpen} cursors={cursors} />
    </>;
  }

  IFS_GALLERY.push({ name: 'Pattern: Collaboration header states', figma: 'Map - Overview - Owner only / Owner with pending invites / Some / All accepted [patterns] (12:9594 / 12:9538 / 12:9423 / 12:9482)', render: () =>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 'var(--space-400)' }}>
      {Object.keys(PRESETS).map(k => <HeaderOnly key={k} preset={k} />)}
    </div> });
  function HeaderOnly({ preset }) {
    const c = useCollab(preset);
    return <div style={{ width: 700, border: '1px solid var(--color-border-soft)' }}>
      <IFS.PageHeader title="Q1 2027 Strategy Framework" onBack={() => {}} status={<IFS.Indicator type="gray" size="xs">Draft</IFS.Indicator>}
        actions={<IFS.Inline as="span" gap="100"><IFS.CollaboratorsMenu controller={c} /><IFS.CommentButton /></IFS.Inline>} />
    </div>;
  }
}
