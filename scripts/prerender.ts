/**
 * Pre-rendering statico (SSG) — eseguito DOPO `vite build` (client) e
 * `vite build --ssr src/entry-server.tsx` (server).
 *
 * Per OGNI pagina pubblica enumerata dai dati (`src/seo/routes.ts`):
 *  - rende l'app React completa in HTML (`renderApp`, stesso albero del client);
 *  - inietta nel `<head>` title, description, canonical, hreflang, robots,
 *    Open Graph, Twitter e JSON-LD (`buildPageMeta` → `renderHeadHtml`);
 *  - aggiunge i preload critici (font, immagine LCP della mappa, chunk della
 *    rotta) e scrive `dist/<path>/index.html`.
 *
 * Genera inoltre: `404.html` (servito con status 404 da Vercel), le pagine di
 * redirect per gli slug rinominati, `sitemap*.xml`, `robots.txt`, `llms.txt`.
 * Nessun file è scritto a mano: tutto deriva da dataset + `src/seo/`.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type * as Entry from '../src/entry-server';
import type { ResolvedPage } from '../src/seo/metadata';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SERVER_ENTRY = join(ROOT, 'dist-server', 'entry-server.js');

function fail(msg: string): never {
  console.error(`[prerender] ${msg}`);
  process.exit(1);
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/* ------------------------------- asset hints ------------------------------ */

interface ManifestChunk {
  file: string;
  imports?: string[];
  isEntry?: boolean;
}

function readManifest(): Record<string, ManifestChunk> {
  const p = join(DIST, '.vite', 'manifest.json');
  if (!existsSync(p)) return {};
  return JSON.parse(readFileSync(p, 'utf8')) as Record<string, ManifestChunk>;
}

/** File JS (con dipendenze) di un modulo lazy, esclusi quelli già nell'entry. */
function chunkFiles(manifest: Record<string, ManifestChunk>, key: string, entryFiles: Set<string>): string[] {
  const out = new Set<string>();
  const walk = (k: string) => {
    const c = manifest[k];
    if (!c || entryFiles.has(c.file) || out.has(c.file)) return;
    out.add(c.file);
    for (const i of c.imports ?? []) walk(i);
  };
  walk(key);
  return [...out];
}

function entryFileSet(manifest: Record<string, ManifestChunk>): Set<string> {
  const out = new Set<string>();
  const walk = (k: string) => {
    const c = manifest[k];
    if (!c || out.has(c.file)) return;
    out.add(c.file);
    for (const i of c.imports ?? []) walk(i);
  };
  for (const [k, c] of Object.entries(manifest)) if (c.isEntry) walk(k);
  return out;
}

/** Font usati above-the-fold (testo base + titoli). */
function criticalFonts(): string[] {
  const files = readdirSync(join(DIST, 'assets'));
  const pick = (re: RegExp) => files.find((f) => re.test(f));
  return [pick(/^inter-latin-400-normal-.*\.woff2$/), pick(/^cinzel-latin-700-normal-.*\.woff2$/)]
    .filter((f): f is string => !!f)
    .map((f) => `/assets/${f}`);
}

/* --------------------------------- main ---------------------------------- */

async function main() {
  const templatePath = join(DIST, 'index.html');
  if (!existsSync(templatePath)) fail('dist/index.html non trovato: esegui prima "vite build".');
  if (!existsSync(SERVER_ENTRY)) fail('dist-server/entry-server.js non trovato: esegui "vite build --ssr src/entry-server.tsx --outDir dist-server".');
  const template = readFileSync(templatePath, 'utf8');
  if (!template.includes('<!--seo-head-->') || !template.includes('<!--app-html-->')) {
    fail('index.html non contiene i segnaposto <!--seo-head--> / <!--app-html-->.');
  }

  const entry = (await import(pathToFileURL(SERVER_ENTRY).href)) as typeof Entry;
  const datasets = await entry.setup();
  const pages = entry.enumeratePages(datasets);

  const manifest = readManifest();
  const entryFiles = entryFileSet(manifest);
  const fonts = criticalFonts();
  const ARCHIVE: Record<string, string> = {
    characters: 'src/components/archive/CharactersPage.tsx',
    factions: 'src/components/archive/ClansAndFactionsPage.tsx',
    arcs: 'src/components/archive/StoryArcsPage.tsx',
    abilities: 'src/components/archive/JutsuPage.tsx',
  };

  function hintsFor(r: ResolvedPage | null): string[] {
    const tags = fonts.map((f) => `<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin />`);
    const p = r?.page;
    if (!p || p.kind === 'home' || p.kind === 'static') return tags;
    const keys = ['src/routes/WorldRoute.tsx'];
    const dataset = p.dataset;
    if (dataset) keys.push(`src/data/${dataset.world.slug}/index.ts`);
    keys.push(p.kind === 'category' && ARCHIVE[p.category] ? ARCHIVE[p.category] : 'src/pages/seo/SeoPageSwitch.tsx');
    const js = new Set(keys.flatMap((k) => chunkFiles(manifest, k, entryFiles)));
    for (const f of js) tags.push(`<link rel="modulepreload" crossorigin href="/${f}" />`);
    if (p.kind === 'map' && dataset) {
      const img = entry.worldMapImage(dataset);
      if (img) tags.push(`<link rel="preload" as="image" href="${esc(img.url)}" fetchpriority="high" />`);
    }
    return tags;
  }

  function page(head: string, lang: string, body: string): string {
    return template
      .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
      .replace(/<title>[\s\S]*?<\/title>\s*/, '')
      .replace('<!--seo-head-->', head)
      .replace('<!--app-html-->', body);
  }

  function outFile(path: string): string {
    return join(DIST, path.replace(/^\//, ''), 'index.html');
  }

  let written = 0;
  const t0 = Date.now();
  // Riepilogo di indicizzazione per lingua (report di build): indicizzabili /
  // esclusi con motivo (legal_page, coming_soon, thin_content, not_translated,
  // canonicalized = `index` ma canonical verso la risorsa principale).
  const summary = new Map<string, { indexable: number; excluded: Map<string, number> }>();
  for (const r of pages) {
    const s = summary.get(r.lang) ?? { indexable: 0, excluded: new Map<string, number>() };
    summary.set(r.lang, s);
    const reason = entry.noindexReason(r) ?? (entry.canonicalTargetPath(r) ? 'canonicalized' : null);
    if (reason === null) s.indexable++;
    else s.excluded.set(reason, (s.excluded.get(reason) ?? 0) + 1);
  }
  for (const r of pages) {
    const meta = entry.buildPageMeta(r);
    const body = entry.renderApp(r.path, r.lang, r);
    const head = [entry.renderHeadHtml(meta), ...hintsFor(r)].join('\n    ');
    const file = outFile(r.path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, page(head, r.lang, body), 'utf8');
    written++;
  }

  // 404: servito da Vercel con status 404 per ogni path inesistente.
  {
    const meta = entry.notFoundMeta('en');
    const body = entry.renderApp('/en/404', 'en', null);
    writeFileSync(join(DIST, '404.html'), page([entry.renderHeadHtml(meta), ...hintsFor(null)].join('\n    '), 'en', body), 'utf8');
  }

  // `/`: in produzione vercel.json redirige per lingua PRIMA di servire questo
  // file. Resta come fallback sicuro: home inglese, noindex, canonical su /en.
  {
    const home = pages.find((p) => p.lang === 'en' && p.page.kind === 'home')!;
    const meta = { ...entry.buildPageMeta(home), robots: 'noindex, follow', alternates: [] };
    const body = entry.renderApp('/en', 'en', home);
    writeFileSync(templatePath, page([entry.renderHeadHtml(meta), ...hintsFor(home)].join('\n    '), 'en', body), 'utf8');
  }

  // Slug rinominati (`previousSlugs`): redirect permanente lato client
  // (meta refresh 0 = redirect permanente per Google) + canonical al nuovo URL.
  const redirects = entry.enumerateSlugRedirects(datasets);
  for (const r of redirects) {
    const target = entry.absoluteUrl(r.to);
    const html =
      `<!doctype html><html lang="${r.lang}"><head><meta charset="utf-8" />` +
      `<meta name="robots" content="noindex, follow" /><link rel="canonical" href="${esc(target)}" />` +
      `<meta http-equiv="refresh" content="0; url=${esc(r.to)}" /><title>${esc(entry.SITE.name)}</title></head>` +
      `<body><a href="${esc(r.to)}">${esc(target)}</a></body></html>`;
    const file = outFile(r.from);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html, 'utf8');
  }

  // Sitemap (index + una per gruppo) SENZA `lastmod`: non esiste una data di
  // modifica verificabile PER URL. La data dell'ultimo commit di
  // `src/data/<world>` marcava come modificate tutte le pagine di un mondo a
  // ogni ritocco di una sola entità, e nei clone shallow delle build CI
  // diventava la data di un commit qualsiasi (anche estraneo ai dati). Google
  // usa `lastmod` solo se "consistently and verifiably accurate": meglio
  // ometterlo che fornirne uno impreciso (vedi docs/SEO.md §8).
  const sitemaps = entry.buildSitemaps(pages);
  for (const s of sitemaps) writeFileSync(join(DIST, s.file), s.xml, 'utf8');

  // robots.txt — generato dalla stessa config (prefissi tecnici, sitemap).
  const robots = [
    '# AniMapVerse — robots.txt (generato da scripts/prerender.ts)',
    'User-agent: *',
    'Allow: /',
    '# Stati UI della SPA (schede aperte, filtri): la canonical è sempre l\'URL senza query.',
    'Disallow: /*?',
    '# Route tecniche riservate (social card, share preview, render).',
    ...entry.TECHNICAL_PATH_PREFIXES.map((p) => `Disallow: ${p}`),
    '',
    `Sitemap: ${entry.SITE.origin}/sitemap.xml`,
    '',
  ].join('\n');
  writeFileSync(join(DIST, 'robots.txt'), robots, 'utf8');

  // llms.txt — sommario complementare (NON sostituisce sitemap/robots).
  const llms = [
    `# ${entry.SITE.name}`,
    '',
    '> Interactive maps of anime and manga worlds: locations, characters, story arcs, factions, character journeys and timelines, connected to each other. AniMapVerse is an independent fan project; the works belong to their respective authors and publishers.',
    '',
    '## Worlds',
    ...[...datasets.values()].map(
      (d) =>
        `- [${entry.getLocalizedText(d.world.title, 'en')}](${entry.absoluteUrl(entry.worldPath('en', d))}): ${entry.getLocalizedText(d.world.description, 'en')}`,
    ),
    '',
    '## Sitemaps',
    `- [Sitemap index](${entry.SITE.origin}/sitemap.xml)`,
    '',
  ].join('\n');
  writeFileSync(join(DIST, 'llms.txt'), llms, 'utf8');

  // Il manifest serviva solo qui: non pubblicarlo.
  rmSync(join(DIST, '.vite'), { recursive: true, force: true });

  const indexable = sitemaps.reduce((n, s) => n + s.urls.length, 0);
  console.log(
    `[prerender] ${written} pagine in ${((Date.now() - t0) / 1000).toFixed(1)}s · ${indexable} URL indicizzabili in ${sitemaps.length - 1} sitemap · ${redirects.length} redirect di slug`,
  );
  for (const [lang, s] of summary) {
    const ex = [...s.excluded].map(([k, n]) => `${k} ${n}`).join(', ') || 'nessuno';
    console.log(`[prerender]   /${lang}: ${s.indexable} indicizzabili · fuori sitemap: ${ex}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
