import React from 'react';
import { IFS } from '../components/index.js';

const IFS_GALLERY = [];
export default IFS_GALLERY;

{
  const { Stack, Inline, Button, Chip, Badge } = IFS;
  const Row = ({ label, children }) => <div className="g-row"><span className="g-label t-body-m-regular">{label}</span>{children}</div>;
  // Placeholder block so the gaps are visible.
  const Box = ({ children = 'Block', w, h }) => (
    <div className="t-label-m-medium" style={{ inlineSize: w, blockSize: h, padding: 'var(--space-200) var(--space-300)', borderRadius: 'var(--radius-radius-100)',
      background: 'var(--color-background-neutral-soft)', boxShadow: 'inset 0 0 0 1px var(--color-border-soft)', color: 'var(--color-text-soft)' }}>{children}</div>
  );
  const Frame = ({ children, w = 'var(--overlay-width-s)' }) => (
    <div style={{ inlineSize: w, padding: 'var(--space-200)', boxShadow: 'inset 0 0 0 1px var(--color-border-soft)', borderRadius: 'var(--radius-radius-100)' }}>{children}</div>
  );

  IFS_GALLERY.push({ name: 'Stack', figma: 'none (code-only layout primitive; Figma uses vertical auto layout)', render: () => <>
    <Row label='gap = role'>
      {['inset', 'stack', 'section'].map(g => <Frame key={g} w="auto"><Stack gap={g}><span className="t-label-m-medium">gap="{g}"</span><Box /><Box /></Stack></Frame>)}
    </Row>
    <Row label='gap = step'>
      {['100', '200', '300', '400', '600'].map(g => <Frame key={g} w="auto"><Stack gap={g}><span className="t-label-m-medium">gap="{g}"</span><Box /><Box /></Stack></Frame>)}
    </Row>
    <Row label="align">
      {['stretch', 'start', 'center', 'end'].map(a => <Frame key={a}><Stack gap="200" align={a}><Box>align="{a}"</Box><Box>Block</Box></Stack></Frame>)}
    </Row>
    <Row label="justify (fixed height)">
      {['start', 'center', 'end', 'between'].map(j => <Frame key={j} w="auto"><Stack gap="200" justify={j} style={{ blockSize: 'calc(var(--size-80) * 2)' }}><Box>justify="{j}"</Box><Box /></Stack></Frame>)}
    </Row>
    <Row label='as="ul"'>
      <Frame><Stack as="ul" gap="100" className="t-body-m-regular" style={{ margin: 0, paddingInlineStart: 'var(--space-500)' }}><li>First</li><li>Second</li><li>Third</li></Stack></Frame>
    </Row>
  </> });

  IFS_GALLERY.push({ name: 'Inline', figma: 'none (code-only layout primitive; Figma uses horizontal auto layout)', render: () => <>
    <Row label="gap">
      {['100', '200', 'stack', 'inset'].map(g => <Frame key={g} w="auto"><Inline gap={g}><Box>gap="{g}"</Box><Box /><Box /></Inline></Frame>)}
    </Row>
    <Row label="align">
      {['stretch', 'start', 'center', 'end', 'baseline'].map(a => <Frame key={a} w="auto"><Inline gap="200" align={a}><Box h="var(--size-56)">align="{a}"</Box><Box /></Inline></Frame>)}
    </Row>
    <Row label="justify">
      {['start', 'center', 'end', 'between'].map(j => <Frame key={j}><Inline gap="200" justify={j}><Box>{j}</Box><Box /></Inline></Frame>)}
    </Row>
    <Row label="wrap">
      <Frame><Inline gap="100" wrap>{['Reliability', 'Financial', 'Environment', 'Social', 'Governance', 'Safety'].map(t => <Chip key={t} selected={false}>{t}</Chip>)}</Inline></Frame>
    </Row>
    <Row label="toolbar">
      <Frame w="calc(var(--overlay-width-m) + var(--space-1100))">
        <Inline gap="200" align="center" justify="between">
          <Inline gap="100" align="center"><span className="t-label-l-medium">Investments</span><Badge>12</Badge></Inline>
          <Inline gap="200"><Button type="secondary" size="s">Export</Button><Button type="primary" size="s">Add investment</Button></Inline>
        </Inline>
      </Frame>
    </Row>
    <Row label="not a token">
      <Frame><Inline gap={12}><Box>gap={'{12}'}</Box><Box>warns, uses stack</Box></Inline></Frame>
    </Row>
  </> });
}
