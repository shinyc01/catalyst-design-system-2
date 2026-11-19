// Builds the 2.0.3 duplicate-decisions review board: node review/build.mjs
import * as esbuild from 'esbuild';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const reactGlobal = { name: 'react-global', setup(b) {
  b.onResolve({ filter: /^react(-dom)?(\/client)?$/ }, a => ({ path: a.path, namespace: 'rg' }));
  b.onLoad({ filter: /.*/, namespace: 'rg' }, a => ({ contents: `module.exports = window.${a.path === 'react' ? 'React' : 'ReactDOM'};`, loader: 'js' }));
} };
await esbuild.build({ entryPoints: [join(here, 'review.jsx')], outfile: join(here, 'review.js'), bundle: true, format: 'iife', target: 'es2020',
  loader: { '.jsx': 'jsx', '.js': 'jsx' }, jsx: 'transform', plugins: [reactGlobal], logLevel: 'error' });
console.log('Built review/review.js');
