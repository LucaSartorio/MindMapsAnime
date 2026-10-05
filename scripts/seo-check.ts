/**
 * Controllo SEO dell'OUTPUT di build (`dist/`) — gira in `npm run build` dopo
 * il pre-rendering ed è BLOCCANTE (exit 1 su errori). Verifica l'HTML reale
 * che ricevono i crawler, non il codice sorgente:
 *
 *  - ogni pagina: 1 <title>, 1 description, robots, `<html lang>`, 1 <h1>,
 *    JSON-LD valido; canonical assoluta HTTPS sull'apex, senza query/hash,
 *    auto-referenziale per le pagine indicizzabili;
 *  - hreflang: self + x-default, destinazioni esistenti, indicizzabili e
 *    RECIPROCHE;
 *  - duplicati: nessun title duplicato fra pagine indicizzabili, nessuna
 *    description duplicata nella stessa lingua;
 *  - lingua: nessuna pagina /en indicizzabile con description italiana, nessuna
 *    pagina /es con description inglese;
 *  - canonical verso altra pagina: destinazione esistente, indicizzabile e
 *    auto-canonica; la pagina non ha hreflang e non è in sitemap;
 *  - lastmod: mai una data unica condivisa da un'intera sitemap;
 *  - link interni: ogni `<a href="/...">` punta a un file esistente o a un
 *    redirect dichiarato (niente 404 interni);
 *  - sitemap: XML ben formato, URL unici, canonici, indicizzabili, nessuna
 *    route tecnica, copertura completa delle pagine indicizzabili;
 *  - robots.txt, 404.html, vercel.json (niente fallback SPA → soft-404).
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { looksEnglish, looksItalian } from '../src/utils/localizableFields';

// Parole funzionali spagnole: un testo che le contiene non è inglese anche se
// cita un titolo inglese (es. il film "The Last").
const ES_WORDS = /(?<!\p{L})(el|la|los|las|de|del|en|con|que|una|por|para|como|sus)(?!\p{L})/iu;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const ORIGIN = 'https://animapverse.com';
const TECHNICAL = ['/og/', '/share/', '/social/', '/render/'];

const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);

if (!existsSync(DIST)) {
  console.error('[seo:check] dist/ non trovato: esegui prima la build.');
  process.exit(1);
}

/* ------------------------------ raccolta ------------------------------ */

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const allFiles = walk(DIST);
const fileSet = new Set(allFiles.map((f) => '/' + relative(DIST, f).split('\\').join('/')));

/** URL path servito da un file (cleanUrls + index.html). */
function urlOf(file: string): string {
  const rel = '/' + relative(DIST, file).split('\\').join('/');
  if (rel === '/index.html') return '/';
  return rel.replace(/\/index\.html$/, '');
}

/** Il path esiste come file statico (pagina o asset)? */
function exists(path: string): boolean {
  if (path === '/') return true;
  return fileSet.has(`${path}/index.html`) || fileSet.has(path) || fileSet.has(`${path}.html`);
}

const decode = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

interface PageInfo {
  url: string;
  lang: string;
  title: string;
  description: string;
  robots: string;
  canonical?: string;
  alternates: Map<string, string>;
  /** robots `index` E canonical auto-referenziale: risorsa indicizzabile in proprio. */
  indexable: boolean;
  /** robots `index` ma canonical verso un'altra pagina (proiezione di quella risorsa). */
  canonicalized: boolean;
  redirectPage: boolean;
  links: string[];
}

const attr = (tag: string, name: string) => {
  const m = new RegExp(`\\s${name}="([^"]*)"`).exec(tag);
  return m ? decode(m[1]) : undefined;
};

function parsePage(file: string): PageInfo {
  const html = readFileSync(file, 'utf8');
  const url = urlOf(file);
  const headEnd = html.indexOf('</head>');
  const head = html.slice(0, headEnd);
  const body = html.slice(headEnd);
  const redirectPage = /http-equiv="refresh"/.test(head);
  const titles = [...head.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((m) => decode(m[1]).trim());
  const metas = [...head.matchAll(/<meta\s[^>]*>/g)].map((m) => m[0]);
  const links = [...head.matchAll(/<link\s[^>]*>/g)].map((m) => m[0]);
  const metaBy = (key: string, value: string) => metas.filter((t) => attr(t, key) === value);
  const lang = /<html lang="([^"]*)"/.exec(html)?.[1] ?? '';
  const where = `${url}`;

  if (titles.length !== 1) err(`${where}: ${titles.length} <title> (atteso 1)`);
  const title = titles[0] ?? '';
  const desc = metaBy('name', 'description');
  const robotsTags = metaBy('name', 'robots');
  if (!redirectPage && desc.length !== 1) err(`${where}: ${desc.length} meta description (attesa 1)`);
  if (robotsTags.length !== 1) err(`${where}: ${robotsTags.length} meta robots (atteso 1)`);
  const description = desc[0] ? attr(desc[0], 'content') ?? '' : '';
  const robots = robotsTags[0] ? attr(robotsTags[0], 'content') ?? '' : '';
  const canonicals = links.filter((l) => attr(l, 'rel') === 'canonical');
  if (canonicals.length > 1) err(`${where}: ${canonicals.length} canonical`);
  const canonical = canonicals[0] ? attr(canonicals[0], 'href') : undefined;
  const alternates = new Map<string, string>();
  for (const l of links.filter((x) => attr(x, 'rel') === 'alternate' && attr(x, 'hreflang'))) {
    alternates.set(attr(l, 'hreflang')!, attr(l, 'href')!);
  }
  const robotsIndex = /(^|,)\s*index\b/.test(robots) && !/noindex/.test(robots);
  const canonicalized = robotsIndex && canonical !== undefined && canonical !== ORIGIN + url;
  const indexable = robotsIndex && !canonicalized;

  if (!redirectPage) {
    if (!lang) err(`${where}: <html lang> mancante`);
    if (!title) err(`${where}: title vuoto`);
    if (!description) err(`${where}: description vuota`);
    const h1 = (body.match(/<h1[\s>]/g) ?? []).length;
    if (h1 !== 1) err(`${where}: ${h1} <h1> nell'HTML statico (atteso 1)`);
    for (const m of head.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      try {
        const j = JSON.parse(m[1]);
        if (!j['@context'] || !j['@type']) err(`${where}: JSON-LD senza @context/@type`);
      } catch {
        err(`${where}: JSON-LD non valido`);
      }
    }
    if (robotsIndex) {
      const og = ['og:title', 'og:description', 'og:url', 'og:type', 'og:image'];
      for (const p of og) if (metaBy('property', p).length !== 1) err(`${where}: ${p} mancante/duplicato`);
      if (title.length > 110) warn(`${where}: title lungo (${title.length})`);
      if (description.length > 200) warn(`${where}: description lunga (${description.length})`);
    }
  }

  const hrefs = [...body.matchAll(/<a\s[^>]*href="([^"]+)"/g)].map((m) => decode(m[1]));
  return { url, lang, title, description, robots, canonical, alternates, indexable, canonicalized, redirectPage, links: hrefs };
}

const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));
const pages = new Map<string, PageInfo>();
for (const f of htmlFiles) {
  if (f.endsWith('404.html')) continue;
  const p = parsePage(f);
  pages.set(p.url, p);
}

/* -------------------------- regole per pagina -------------------------- */

const titleSeen = new Map<string, string>();
const descSeen = new Map<string, string>();
for (const p of pages.values()) {
  if (p.redirectPage) continue;
  if (p.canonical !== undefined) {
    if (!p.canonical.startsWith(`${ORIGIN}/`) && p.canonical !== ORIGIN) err(`${p.url}: canonical non assoluta/HTTPS/apex: ${p.canonical}`);
    if (/[?#]/.test(p.canonical)) err(`${p.url}: canonical con query/hash`);
    if (/\/$/.test(p.canonical)) err(`${p.url}: canonical con slash finale`);
  }
  if (p.canonicalized) {
    // Canonical verso un'altra risorsa: la destinazione deve esistere, essere
    // indicizzabile e canonica di sé; la pagina non dichiara hreflang.
    const target = pages.get(p.canonical!.replace(ORIGIN, ''));
    if (!target) err(`${p.url}: canonical verso pagina inesistente ${p.canonical}`);
    else if (!target.indexable) err(`${p.url}: canonical verso pagina non indicizzabile/non canonica ${p.canonical}`);
    if (p.alternates.size > 0) err(`${p.url}: pagina canonicalizzata altrove con hreflang`);
  } else if (p.indexable) {
    // hreflang
    const self = p.alternates.get(p.lang);
    if (self !== ORIGIN + p.url) err(`${p.url}: hreflang self mancante (${p.lang})`);
    if (!p.alternates.has('x-default')) err(`${p.url}: hreflang x-default mancante`);
    for (const [hl, href] of p.alternates) {
      const path = href.replace(ORIGIN, '');
      const target = pages.get(path);
      if (!target) {
        err(`${p.url}: hreflang ${hl} → pagina inesistente ${href}`);
        continue;
      }
      if (!target.indexable) err(`${p.url}: hreflang ${hl} → pagina noindex ${href}`);
      if (hl !== 'x-default' && target.alternates.get(p.lang) !== ORIGIN + p.url) {
        err(`${p.url}: hreflang ${hl} non reciproco (${href} non rimanda a questa pagina)`);
      }
    }
    // duplicati
    const t = titleSeen.get(p.title);
    if (t) err(`title duplicato: "${p.title}" (${t}, ${p.url})`);
    else titleSeen.set(p.title, p.url);
    // lingua del contenuto: una pagina /en indicizzabile con descrizione
    // italiana (testo non tradotto trapelato) è un errore; il caso inverso è
    // solo un avviso (i nomi propri inglesi sono normali in italiano).
    if (p.lang === 'en' && looksItalian(p.description)) err(`${p.url}: description /en in italiano: "${p.description}"`);
    if (p.lang === 'it' && looksEnglish(p.description)) warn(`${p.url}: description /it sembra inglese: "${p.description}"`);
    // /es: un testo inglese trapelato = overlay mancante (lo spagnolo condivide
    // parole funzionali con l'italiano, quindi niente controllo "sembra italiano").
    if (p.lang === 'es' && looksEnglish(p.description) && !ES_WORDS.test(p.description)) {
      err(`${p.url}: description /es in inglese: "${p.description}"`);
    }
    const dk = `${p.lang}|${p.description}`;
    const d = descSeen.get(dk);
    if (d) err(`description duplicata (${p.lang}): ${d}, ${p.url}`);
    else descSeen.set(dk, p.url);
  } else if (p.alternates.size > 0) {
    err(`${p.url}: pagina noindex con hreflang`);
  }
}

/* ------------------------------ redirect ------------------------------ */

interface VercelRedirect {
  source: string;
  destination: string;
  has?: unknown[];
}
const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8')) as {
  rewrites?: { source: string; destination: string }[];
  redirects?: VercelRedirect[];
};
for (const rw of vercel.rewrites ?? []) {
  if (/index\.html$/.test(rw.destination)) err(`vercel.json: rewrite catch-all verso ${rw.destination} (soft-404: ogni URL risponderebbe 200)`);
}
const redirectMatchers = (vercel.redirects ?? []).map((r) => {
  const re = new RegExp(
    '^' +
      r.source
        .replace(/\/:[a-z]+\*/gi, '(?:/.*)?')
        .replace(/:[a-z]+/gi, '[^/]+') +
      '$',
  );
  return { r, re };
});
for (const { r } of redirectMatchers) {
  if (r.has || /^https?:/.test(r.destination) || r.destination.includes(':')) continue;
  if (!exists(r.destination)) err(`vercel.json: redirect ${r.source} → ${r.destination} (destinazione inesistente)`);
}
const isRedirected = (path: string) => redirectMatchers.some(({ r, re }) => !r.has && re.test(path));

/* ---------------------------- link interni ---------------------------- */

let linkCount = 0;
const broken = new Map<string, string>();
for (const p of pages.values()) {
  for (const href of p.links) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const path = href.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
    linkCount++;
    if (!exists(path) && !isRedirected(path) && !broken.has(path)) broken.set(path, p.url);
  }
}
for (const [path, from] of broken) err(`link interno rotto: ${path} (da ${from})`);

/* ------------------------------- sitemap ------------------------------ */

const sitemapIndex = join(DIST, 'sitemap.xml');
const inSitemap = new Set<string>();
if (!existsSync(sitemapIndex)) err('sitemap.xml mancante');
else {
  const xml = readFileSync(sitemapIndex, 'utf8');
  if (!xml.startsWith('<?xml') || !xml.includes('<sitemapindex')) err('sitemap.xml non è un sitemap index valido');
  const files = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (files.length === 0) err('sitemap index vuoto');
  for (const loc of files) {
    const file = join(DIST, loc.replace(ORIGIN, ''));
    if (!existsSync(file)) {
      err(`sitemap index → file mancante ${loc}`);
      continue;
    }
    const sx = readFileSync(file, 'utf8');
    const opened = (sx.match(/<url>/g) ?? []).length;
    const closed = (sx.match(/<\/url>/g) ?? []).length;
    if (!sx.startsWith('<?xml') || !sx.includes('<urlset') || opened !== closed) err(`${loc}: XML non valido`);
    const locs = [...sx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
    if (locs.length > 50000) err(`${loc}: oltre 50.000 URL`);
    // `lastmod` deve essere la data di modifica di QUELLA pagina (Google lo usa
    // solo se "consistently and verifiably accurate"): la stessa data su tutte
    // le URL di una sitemap grande è una data di build/commit, non di pagina.
    const mods = [...sx.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
    if (mods.length >= 50 && new Set(mods).size === 1) {
      err(`${loc}: tutte le ${mods.length} URL hanno lo stesso lastmod (${mods[0]}): non è una data per pagina`);
    }
    for (const u of locs) {
      if (inSitemap.has(u)) err(`sitemap: URL duplicato ${u}`);
      inSitemap.add(u);
      if (!u.startsWith(`${ORIGIN}/`) || /[?#]/.test(u)) err(`sitemap: URL non canonico ${u}`);
      const path = u.replace(ORIGIN, '');
      if (TECHNICAL.some((t) => path.startsWith(t))) err(`sitemap: route tecnica ${u}`);
      const page = pages.get(path);
      if (!page) err(`sitemap: URL senza pagina ${u}`);
      else {
        if (page.canonicalized) err(`sitemap: URL canonicalizzato altrove ${u}`);
        else if (!page.indexable) err(`sitemap: URL noindex ${u}`);
        if (page.canonical !== u) err(`sitemap: ${u} ha canonical diversa (${page.canonical})`);
      }
    }
  }
}
for (const p of pages.values()) {
  if (p.indexable && !inSitemap.has(ORIGIN + p.url)) err(`pagina indicizzabile assente dalla sitemap: ${p.url}`);
}

/* ------------------------- robots / 404 / altro ------------------------ */

const robotsPath = join(DIST, 'robots.txt');
if (!existsSync(robotsPath)) err('robots.txt mancante');
else {
  const robots = readFileSync(robotsPath, 'utf8');
  if (!/^Sitemap: https:\/\/animapverse\.com\/sitemap\.xml$/m.test(robots)) err('robots.txt: riga Sitemap mancante');
  for (const blocked of ['/assets', '/en', '/it', '/']) {
    if (new RegExp(`^Disallow: ${blocked.replace(/\//g, '\\/')}\\s*$`, 'm').test(robots)) err(`robots.txt blocca ${blocked}`);
  }
}
const notFound = join(DIST, '404.html');
if (!existsSync(notFound)) err('404.html mancante (Vercel servirebbe la pagina 404 di default)');
else {
  const html = readFileSync(notFound, 'utf8');
  if (!/name="robots" content="noindex/.test(html)) err('404.html non è noindex');
  if (/rel="canonical"/.test(html)) err('404.html non deve avere canonical');
}

/* ------------------------------- report ------------------------------- */

const indexable = [...pages.values()].filter((p) => p.indexable && !p.redirectPage);
const canonicalizedCount = [...pages.values()].filter((p) => p.canonicalized && !p.redirectPage).length;
const byLang = new Map<string, number>();
for (const p of indexable) byLang.set(p.lang, (byLang.get(p.lang) ?? 0) + 1);
console.log(
  `[seo:check] ${pages.size} pagine · ${indexable.length} indicizzabili (${[...byLang].map(([l, n]) => `${l}: ${n}`).join(', ')}) · ${canonicalizedCount} canonicalizzate altrove · ${inSitemap.size} URL in sitemap · ${linkCount} link interni verificati`,
);
if (warnings.length) {
  console.log(`[seo:check] ${warnings.length} avvisi (primi 10):`);
  for (const w of warnings.slice(0, 10)) console.log('  ⚠', w);
}
if (errors.length) {
  console.error(`[seo:check] ${errors.length} ERRORI (primi 40):`);
  for (const e of errors.slice(0, 40)) console.error('  ✗', e);
  process.exit(1);
}
console.log('[seo:check] OK');
