#!/usr/bin/env node
// Bundles the kit for prototypes and makes standalone prototype files.
//   node build.mjs                             → dist/ifs-ds.js (window.IFS, IIFE) + dist/ifs-ds.css
//   node build.mjs inline <in.html> <out.html> → replaces the <!-- IFS-KIT --> marker in a prototype
//        with the bundled kit, so the output is one file that opens anywhere
//        (React + Babel still load from unpkg; React must load before the kit).
// Components are reviewed in Storybook (npm run storybook), not here.
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const read = p => readFileSync(p, 'utf8');

// Resolve `import React from 'react'` to the page's UMD React instead of bundling a second copy.
const reactGlobal = {
  name: 'react-global',
  setup(b) {
    b.onResolve({ filter: /^react(-dom)?$/ }, a => ({ path: a.path, namespace: 'react-global' }));
    b.onLoad({ filter: /.*/, namespace: 'react-global' }, a => ({
      contents: `module.exports = window.${a.path === 'react' ? 'React' : 'ReactDOM'};`, loader: 'js',
    }));
  },
};

async function build() {
  const r = await esbuild.build({
    entryPoints: [join(root, 'src/iife.js')],
    outfile: join(dist, 'ifs-ds.js'),
    bundle: true, format: 'iife', target: 'es2020', minify: true,
    loader: { '.jsx': 'jsx', '.js': 'jsx', '.woff2': 'file' }, jsx: 'transform', assetNames: 'fonts/[name]', // G6: fonts → dist/fonts/
    plugins: [reactGlobal], logLevel: 'error', metafile: true,
  });
  return Object.fromEntries(Object.entries(r.metafile.outputs).map(([k, v]) => [k.split('/').pop(), v.bytes]));
}

// G6: a single-file prototype carries the self-hosted fonts as data URIs, so it still shows Inter offline.
const embedFonts = css => css.replace(/url\("\.\/fonts\/([a-z0-9-]+\.woff2)"\)/g, (m, f) => `url("data:font/woff2;base64,${readFileSync(join(dist, 'fonts', f)).toString('base64')}")`);
function inline(html) {
  if (!html.includes('<!-- IFS-KIT -->')) throw new Error('Missing <!-- IFS-KIT --> marker');
  const block = `<style>\n${embedFonts(read(join(dist, 'ifs-ds.css')))}\n</style>\n<script>\n${read(join(dist, 'ifs-ds.js'))}\n</script>`;
  // Replaces the whole <!-- IFS-KIT --> … <!-- /IFS-KIT --> block (the template's live-kit links), or a bare marker.
  return html.replace(/<!-- IFS-KIT -->[\s\S]*?<!-- \/IFS-KIT -->|<!-- IFS-KIT -->/, () => block);
}

const [cmd, a, b] = process.argv.slice(2);
const sizes = await build();
// G6: the font licences (OFL 1.1) and the fonts README travel with the font files.
mkdirSync(join(dist, 'fonts'), { recursive: true });
for (const f of ['OFL-Inter.txt', 'OFL-JetBrainsMono.txt', 'README.md']) copyFileSync(join(root, 'fonts', f), join(dist, 'fonts', f));
if (cmd === 'inline') {
  writeFileSync(b, inline(read(a)));
  console.log(`Wrote ${b}`);
} else {
  console.log('Built', sizes);
}
