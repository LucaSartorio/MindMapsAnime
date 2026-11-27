#!/usr/bin/env node
/**
 * `npm run benchmark:3d:bundle` — what an ordinary visit downloads, measured on the built `dist/`.
 *
 * For a fixed set of prerendered pages it lists every JS/CSS file the HTML loads eagerly (`<script src>`,
 * `modulepreload`, stylesheet) and reports raw / gzip / brotli sizes, plus the size of every emitted chunk that
 * contains the 3D explorer (`dist/assets/explorer3d-*.json` written by the build guard, see
 * `scripts/vite/explorer3dGuard.ts`). It only reads files: same `dist/` → same numbers, so a baseline taken before a
 * change is comparable with one taken after it. `--json` prints machine-readable output.
 *
 * It is a measurement, not a gate: the blocking checks are the build guard (chunk graph) and `npm run test:3d`
 * (real network requests in Chromium).
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';

const DIST = process.env.DIST ?? 'dist';
const PAGES = (process.env.PAGES ?? 'en/index.html,en/one-piece/map/index.html,en/one-piece/locations/baratie/index.html,en/one-piece/characters/sanji/index.html')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const json = process.argv.includes('--json');

if (!existsSync(join(DIST, 'assets'))) {
  console.error(`[bundle-report] ${DIST}/assets not found: run "npm run build" first.`);
  process.exit(1);
}

const sizeCache = new Map();
function sizes(rel) {
  const hit = sizeCache.get(rel);
  if (hit) return hit;
  const buf = readFileSync(join(DIST, rel));
  const s = {
    raw: buf.length,
    gzip: gzipSync(buf, { level: 9 }).length,
    brotli: brotliCompressSync(buf, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length,
  };
  sizeCache.set(rel, s);
  return s;
}
const sum = (files) =>
  files.reduce((a, f) => {
    const s = sizes(f);
    return { raw: a.raw + s.raw, gzip: a.gzip + s.gzip, brotli: a.brotli + s.brotli };
  }, { raw: 0, gzip: 0, brotli: 0 });
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

const pages = [];
for (const page of PAGES) {
  const file = join(DIST, page);
  if (!existsSync(file)) {
    pages.push({ page, missing: true });
    continue;
  }
  const html = readFileSync(file, 'utf8');
  const refs = new Set();
  for (const m of html.matchAll(/<(?:script|link)\b[^>]*>/g)) {
    const tag = m[0];
    const url = /(?:src|href)="\/(assets\/[^"]+\.(?:js|css))"/.exec(tag)?.[1];
    if (!url) continue;
    if (tag.startsWith('<script') || /rel="(?:modulepreload|stylesheet)"/.test(tag)) refs.add(url);
  }
  const files = [...refs].sort();
  pages.push({ page, files: files.length, js: sum(files.filter((f) => f.endsWith('.js'))), css: sum(files.filter((f) => f.endsWith('.css'))) });
}

// Chunks that carry the 3D explorer, as recorded by the build guard.
let explorer = null;
const reportFile = join(DIST, 'assets', 'explorer3d-report.json');
if (existsSync(reportFile)) {
  const r = JSON.parse(readFileSync(reportFile, 'utf8'));
  const files = (r.chunks ?? []).map((c) => `assets/${c.file}`).filter((f) => existsSync(join(DIST, f)));
  explorer = { enabled: r.enabled, chunks: (r.chunks ?? []).map((c) => ({ ...c, ...sizes(`assets/${c.file}`) })), total: sum(files) };
}

const assets = readdirSync(join(DIST, 'assets')).filter((f) => f.endsWith('.js'));
const allJs = assets.reduce((n, f) => n + statSync(join(DIST, 'assets', f)).size, 0);

const out = { dist: DIST, pages, explorer, allJsRaw: allJs, jsFiles: assets.length };
if (json) {
  console.log(JSON.stringify(out, null, 2));
} else {
  console.log('=== AniMapVerse · eager JS/CSS per page (raw / gzip / brotli) ===');
  for (const p of pages) {
    if (p.missing) console.log(`  ${p.page}: (missing)`);
    else console.log(`  ${p.page}: ${p.files} files · JS ${kb(p.js.raw)} / ${kb(p.js.gzip)} / ${kb(p.js.brotli)} · CSS ${kb(p.css.raw)} / ${kb(p.css.gzip)}`);
  }
  console.log(`  all emitted JS: ${assets.length} files, ${kb(allJs)} raw`);
  if (!explorer) console.log('  explorer3d: no report (build without the guard)');
  else {
    console.log(`  explorer3d (${explorer.enabled ? 'flag ON' : 'flag OFF'}): ${explorer.chunks.length} chunks · ${kb(explorer.total.raw)} / ${kb(explorer.total.gzip)} / ${kb(explorer.total.brotli)}`);
    for (const c of explorer.chunks) console.log(`    ${c.file} [${c.kind}] ${kb(c.raw)} / ${kb(c.gzip)} / ${kb(c.brotli)}`);
  }
}
