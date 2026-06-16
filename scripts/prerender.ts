/**
 * Pre-rendering SEO statico.
 *
 * Eseguito DOPO `vite build`. Per ogni rotta nota (vedi `src/lib/seo.ts`):
 *  - genera un file HTML dedicato (es. `dist/about/index.html`) a partire dal
 *    template `dist/index.html`;
 *  - inietta i meta tag SEO corretti (title, description, canonical, Open Graph,
 *    Twitter, robots, JSON-LD) direttamente nell'HTML statico, così i crawler
 *    che NON eseguono JavaScript leggono comunque i metadati giusti;
 *  - inserisce un fallback testuale nel `#root` (H1 + descrizione) per
 *    l'indicizzazione anche senza JS. Il client lo sostituisce al mount.
 *
 * Genera inoltre `dist/sitemap.xml`. `robots.txt` e le immagini OG sono serviti
 * staticamente da `public/`.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE,
  absoluteUrl,
  getAllRoutes,
  pageTitle,
  type RouteSeo,
} from '../src/lib/seo';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '..', 'dist');

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Rimuove dal template i tag SEO che gestiamo per rotta, per evitare duplicati. */
function stripManagedTags(html: string): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="(?:description|robots|author|twitter:[^"]*)"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '');
}

function buildHead(route: RouteSeo): string {
  const title = pageTitle(route.title);
  const description = route.description;
  const canonical = absoluteUrl(route.path);
  const image = absoluteUrl(route.image ?? SITE.ogImage);
  const type = route.type ?? 'website';
  const robots = route.noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="author" content="${esc(SITE.author)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="${SITE.ogImageWidth}" />`,
    `<meta property="og:image:height" content="${SITE.ogImageHeight}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:locale:alternate" content="${SITE.altLocale}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
  ];

  for (const block of route.jsonLd ?? []) {
    // `<` escapato per non chiudere prematuramente lo <script>.
    const json = JSON.stringify(block).replace(/</g, '\\u003c');
    tags.push(`<script type="application/ld+json">${json}</script>`);
  }

  return tags.join('\n    ');
}

/** Fallback testuale visibile ai crawler senza JS (sostituito al mount). */
function buildBodyFallback(route: RouteSeo): string {
  return (
    `<div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">` +
    `<h1>${esc(route.title)}</h1>` +
    `<p>${esc(route.description)}</p>` +
    `<nav><a href="/">Home</a></nav>` +
    `</div>`
  );
}

function pathToFile(routePath: string): string {
  if (routePath === '/') return join(DIST, 'index.html');
  return join(DIST, routePath.replace(/^\//, ''), 'index.html');
}

function buildSitemap(routes: RouteSeo[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .filter((r) => !r.noindex)
    .map((r) => {
      const parts = [
        `    <loc>${esc(absoluteUrl(r.path))}</loc>`,
        `    <lastmod>${today}</lastmod>`,
      ];
      if (r.changefreq) parts.push(`    <changefreq>${r.changefreq}</changefreq>`);
      if (r.priority != null) parts.push(`    <priority>${r.priority.toFixed(1)}</priority>`);
      return `  <url>\n${parts.join('\n')}\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function main() {
  const templatePath = join(DIST, 'index.html');
  let template: string;
  try {
    template = readFileSync(templatePath, 'utf8');
  } catch {
    console.error(`[prerender] dist/index.html non trovato. Esegui prima "vite build".`);
    process.exit(1);
  }

  const base = stripManagedTags(template);
  const routes = getAllRoutes();

  let written = 0;
  for (const route of routes) {
    const head = buildHead(route);
    let html = base.replace('</head>', `    ${head}\n  </head>`);
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${buildBodyFallback(route)}</div>`,
    );
    const outFile = pathToFile(route.path);
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, html, 'utf8');
    written++;
  }

  writeFileSync(join(DIST, 'sitemap.xml'), buildSitemap(routes), 'utf8');

  console.log(
    `[prerender] ${written} pagine generate · sitemap.xml con ${routes.filter((r) => !r.noindex).length} URL`,
  );
}

main();
