// Kit entry: styles, icons and every component family. Import from here, not from family files.
import '../foundations/fonts.css'; // G6: self-hosted Inter + JetBrains Mono, first
import '../foundations/palette.css';
import '../tokens.css';
import '../foundations/spacing.css';
import '../foundations/motion.css';
import '../foundations/layout.css';
import '../foundations/typography.css';
// Old token names (aliases until 3.0); after the foundations so every alias resolves to its new name.
import '../foundations/deprecated.css';
import './_core.css';
import './button.css';
import './data.css';
import './forms.css';
import './navigation.css';
import './selection.css';
import './surfaces.css';
import '../icons.js';

export { IFS } from './registry.js';
// Formatting helpers (IFS.format) load first so every family can use them.
export { format } from './format.js';
// Layout primitives (Stack, Inline) load early so every family and screen can use them.
import './layout.css';
export * from './layout.jsx';
export * from './_core.jsx';
export * from './button.jsx';
export * from './data.jsx';
export * from './forms.jsx';
export * from './navigation.jsx';
export * from './selection.jsx';
export * from './surfaces.jsx';
import './states.css';
export * from './states.jsx';
import './activity.css';
export * from './activity.jsx';
import './canvas.css';
export * from './canvas.jsx';
import './charts.css';
export * from './charts.jsx';
import './extras.css';
export * from './extras.jsx';
import './patterns-documents.css';
export * from './patterns-documents.jsx';
import './patterns-widget-builder.css';
export * from './patterns-widget-builder.jsx';
import './patterns-cooper.css';
export * from './patterns-cooper.jsx';
import './patterns-table.css';
export * from './patterns-table.jsx';
import './patterns-collaboration.css';
export * from './patterns-collaboration.jsx';
import './patterns-evidence.css';
export * from './patterns-evidence.jsx';
import './patterns-nav-bar.css';
export * from './patterns-nav-bar.jsx';
import './patterns-activity.css';
export * from './patterns-activity.jsx';
import './patterns-comments.css';
export * from './patterns-comments.jsx';
import './patterns-approval.css';
export * from './patterns-approval.jsx';
import './patterns-trace.css';
export * from './patterns-trace.jsx';
