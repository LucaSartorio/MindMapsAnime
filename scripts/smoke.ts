/**
 * Smoke test end-to-end della build di produzione.
 *
 * Avvia `vite preview`, apre le rotte chiave con Chromium headless e verifica
 * che renderizzino davvero (homepage, mappe, archivi) senza errori in console.
 * Serve a intercettare regressioni di runtime che `tsc`/build NON vedono
 * (es. chunk circolari, import rotti, crash al mount).
 *
 * Uso:  npm run smoke
 * Richiede Chromium di Playwright:  npx playwright install chromium
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { chromium, type ConsoleMessage } from 'playwright';
import { worldsWithMap } from '../src/seo/worldLinks';

const PORT = 4188;
const BASE = `http://localhost:${PORT}`;

/**
 * Risolve un eseguibile Chromium. Usa quello di default di Playwright; se manca
 * (es. il numero di build scaricato non combacia con la versione installata,
 * tipico in ambienti con cache browser preesistente) ripiega su un qualsiasi
 * chromium già presente in PLAYWRIGHT_BROWSERS_PATH.
 */
function resolveExecutablePath(): string | undefined {
  const dir = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!dir || !existsSync(dir)) return undefined;
  for (const entry of readdirSync(dir)) {
    if (!entry.startsWith('chromium-')) continue;
    const exe = `${dir}/${entry}/chrome-linux/chrome`;
    if (existsSync(exe)) return exe;
  }
  return undefined;
}

async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch (err) {
    const executablePath = resolveExecutablePath();
    if (executablePath) return chromium.launch({ executablePath });
    throw err;
  }
}

/**
 * Rumore "di ambiente" da ignorare: gli script Vercel Analytics/Speed-Insights
 * esistono solo su Vercel (404 in preview locale), font/cert in sandbox, e i
 * generici "Failed to load resource" (privi di URL: il problema reale, se c'è,
 * emerge comunque come pageerror o come 404 su un URL tracciato a parte).
 */
const IGNORED = [
  '_vercel',
  'ERR_CERT',
  'favicon',
  'net::ERR_',
  'Failed to load resource',
];
/** URL di risorse il cui 404 è atteso/benigno fuori da Vercel. */
const IGNORED_404 = ['/_vercel/', 'favicon'];

function waitForServer(url: string, timeoutMs = 30_000): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch {
        /* non ancora pronto */
      }
      if (Date.now() - start > timeoutMs) {
        return reject(new Error(`Server non pronto su ${url}`));
      }
      setTimeout(tick, 300);
    };
    void tick();
  });
}

interface Check {
  path: string;
  /** Almeno uno di questi testi deve comparire nel body. */
  anyOf: string[];
  /** Selettore opzionale da attendere (es. nodi mappa). */
  selector?: string;
  /** Conteggio minimo del selettore. */
  minCount?: number;
  /**
   * L'HTML pre-renderizzato deve essere IDRATATO (nodi DOM conservati), non
   * ricreato: un mismatch di idratazione fa ricostruire il DOM al client.
   */
  hydrated?: boolean;
}

const CHECKS: Check[] = [
  // `/` → redirect per lingua (307) → home: i mondi disponibili sono link reali.
  { path: '/', anyOf: ['AniMapVerse'], selector: 'a[href^="/en/"]', minCount: 5, hydrated: true },
  { path: '/en/naruto', anyOf: ['Naruto'], selector: 'main h1', minCount: 1, hydrated: true },
  { path: '/en/naruto/map', anyOf: ['Naruto'], selector: '.react-flow__node', minCount: 10 },
  { path: '/en/one-piece/map', anyOf: ['One Piece'], selector: '.react-flow__node', minCount: 10 },
  { path: '/it/hunter-x-hunter/map', anyOf: ['Hunter'], selector: '.react-flow__node', minCount: 5 },
  { path: '/en/naruto/characters', anyOf: ['Naruto'], selector: 'input[type=search]', minCount: 1, hydrated: true },
  { path: '/it/one-piece/characters', anyOf: ['One Piece'], selector: 'input[type=search]', minCount: 1 },
  { path: '/en/hunter-x-hunter/abilities', anyOf: ['Nen'], selector: 'input[type=search]', minCount: 1 },
  { path: '/en/naruto/characters/itachi-uchiha', anyOf: ['Itachi'], selector: 'nav[aria-label] ol li', minCount: 3, hydrated: true },
  { path: '/it/one-piece/locations/page/2', anyOf: ['One Piece'], selector: 'main article a[href^="/it/one-piece/locations/"]', minCount: 20, hydrated: true },
  { path: '/en/naruto/timeline', anyOf: ['Naruto'], selector: 'li[id^="event-"]', minCount: 10, hydrated: true },
  { path: '/en/about', anyOf: ['AniMapVerse'] },
  // Spagnolo: home e pagine dei mondi tradotti (overlay applicato prima dell'idratazione).
  { path: '/es', anyOf: ['AniMapVerse'], selector: 'a[href^="/es/naruto"]', minCount: 1, hydrated: true },
  { path: '/es/naruto/characters/itachi-uchiha', anyOf: ['Genio Uchiha'], selector: 'nav[aria-label] ol li', minCount: 3, hydrated: true },
  { path: '/es/naruto/map', anyOf: ['Naruto'], selector: '.react-flow__node', minCount: 10 },
];

/**
 * Pagine su cui la head SEO dopo l'idratazione deve coincidere con l'HTML
 * statico: personaggi di Naruto e One Piece nelle 4 lingue URL + due landing.
 */
const HEAD_PARITY_PAGES = [
  ...['it', 'en', 'es', 'fr'].flatMap((l) => [
    `/${l}/naruto/characters/itachi-uchiha`,
    `/${l}/one-piece/characters/monkey-d-luffy`,
  ]),
  '/it/naruto',
  '/fr/one-piece',
];

/** Navigazioni SPA (click su un link delle relazioni) dopo cui la head deve essere quella della pagina di arrivo. */
const SPA_NAVIGATIONS: [from: string, to: string][] = [
  ['/en/naruto/characters/itachi-uchiha', '/en/naruto/characters/sasuke-uchiha'],
  ['/it/one-piece/characters/monkey-d-luffy', '/it/one-piece/characters/monkey-d-garp'],
  ['/fr/naruto/characters/itachi-uchiha', '/fr/naruto/characters/sasuke-uchiha'],
  ['/es/one-piece/characters/monkey-d-luffy', '/es/one-piece/characters/roronoa-zoro'],
];

/** Mondi pubblicati con mappa (SEO-05): le CTA della home e le liste "altri mondi" ne dipendono. */
const SEO05_PUBLISHED_MAPS = worldsWithMap().length;
/** Landing e mappe in tutte le lingue URL su cui controllare il blocco "altri mondi". */
const SEO05_PAGES = ['/en/naruto', '/it/one-piece', '/es/naruto/map', '/fr/one-piece/map', '/en/naruto/map', '/it/one-piece/map'];

interface SeoHead {
  canonical: string | null;
  robots: string | null;
  description: string | null;
  ogLocale: string | null;
  ogLocaleAlternates: string[];
  hreflang: [string, string][];
}

const decodeEntities = (s: string) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

/** Head SEO dell'HTML pre-renderizzato (tag `data-seo` scritti da `renderHeadHtml`). */
function headFromHtml(html: string): SeoHead {
  const head = html.split('</head>')[0];
  const one = (re: RegExp) => {
    const m = head.match(re);
    return m ? decodeEntities(m[1]) : null;
  };
  return {
    canonical: one(/<link rel="canonical" href="([^"]*)"/),
    robots: one(/<meta name="robots" content="([^"]*)"/),
    description: one(/<meta name="description" content="([^"]*)"/),
    ogLocale: one(/<meta property="og:locale" content="([^"]*)"/),
    ogLocaleAlternates: [...head.matchAll(/<meta property="og:locale:alternate" content="([^"]*)"/g)].map((m) => m[1]).sort(),
    hreflang: [...head.matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)"/g)]
      .map((m): [string, string] => [m[1], decodeEntities(m[2])])
      .sort(),
  };
}

/** Stessa head letta dal DOM vivo (eseguita nel browser: niente riferimenti esterni). */
function headFromDom(): SeoHead {
  const h = document.head;
  return {
    canonical: h.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
    robots: h.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null,
    description: h.querySelector('meta[name="description"]')?.getAttribute('content') ?? null,
    ogLocale: h.querySelector('meta[property="og:locale"]')?.getAttribute('content') ?? null,
    ogLocaleAlternates: Array.from(h.querySelectorAll('meta[property="og:locale:alternate"]'))
      .map((m) => m.getAttribute('content') ?? '')
      .sort(),
    hreflang: Array.from(h.querySelectorAll('link[rel="alternate"][hreflang]'))
      .map((l) => [l.getAttribute('hreflang') ?? '', l.getAttribute('href') ?? ''] as [string, string])
      .sort(),
  };
}

const sameHead = (a: SeoHead, b: SeoHead) => JSON.stringify(a) === JSON.stringify(b);

async function main() {
  // Server con semantica Vercel (redirect, 404 veri): `vite preview` servirebbe
  // index.html con 200 per qualsiasi path.
  const preview: ChildProcess = spawn(
    'npx',
    ['tsx', '--tsconfig', 'scripts/tsconfig.json', 'scripts/serve-static.ts'],
    { stdio: 'ignore', env: { ...process.env, PORT: String(PORT) } },
  );

  let failures = 0;
  const consoleErrors: string[] = [];

  try {
    await waitForServer(BASE);
    const browser = await launchBrowser();
    const page = await browser.newPage();
    // Marca i nodi dell'HTML statico prima che React parta: se dopo il boot il
    // primo figlio di #root è ancora lo stesso nodo, l'idratazione è riuscita.
    await page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        const first = document.getElementById('root')?.firstElementChild as
          | (Element & { __ssr?: boolean })
          | null;
        if (first) first.__ssr = true;
      });
    });
    page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));
    page.on('console', (m: ConsoleMessage) => {
      const text = m.text();
      if (m.type() === 'error' && !IGNORED.some((s) => text.includes(s))) {
        consoleErrors.push(`console: ${text}`);
      }
    });
    // 404/5xx su URL reali (asset/chunk mancanti), escluse risorse benigne.
    page.on('response', (r) => {
      if (r.status() >= 400 && !IGNORED_404.some((s) => r.url().includes(s))) {
        consoleErrors.push(`http ${r.status()}: ${r.url()}`);
      }
    });

    for (const check of CHECKS) {
      const before = consoleErrors.length;
      await page.goto(`${BASE}${check.path}`, { waitUntil: 'networkidle', timeout: 30_000 });
      const body = (await page.textContent('body')) ?? '';
      let ok = check.anyOf.some((s) => body.includes(s));
      let detail = '';
      if (ok && check.selector) {
        try {
          await page.waitForSelector(check.selector, { timeout: 20_000 });
          const count = await page.locator(check.selector).count();
          if (count < (check.minCount ?? 1)) {
            ok = false;
            detail = ` (${check.selector}: ${count} < ${check.minCount})`;
          } else {
            detail = ` · ${check.selector}=${count}`;
          }
        } catch {
          ok = false;
          detail = ` (selettore non trovato: ${check.selector})`;
        }
      }
      if (ok && check.hydrated) {
        const kept = await page.evaluate(
          () => (document.getElementById('root')?.firstElementChild as { __ssr?: boolean } | null)?.__ssr === true,
        );
        if (!kept) {
          ok = false;
          detail += ' (HTML statico ricreato: mismatch di idratazione)';
        } else detail += ' · idratato';
      }
      const newErrors = consoleErrors.length - before;
      if (newErrors > 0) {
        ok = false;
        detail += ` (${newErrors} errori console)`;
      }
      if (!ok) failures += 1;
      console.log(`${ok ? '✓' : '✗'} ${check.path}${detail}`);
    }

    // Head SEO dopo l'idratazione e dopo una navigazione SPA = HTML statico della
    // stessa pagina (regressione SEO-01: il client perdeva gli hreflang es/fr).
    {
      const html = async (path: string) => (await fetch(`${BASE}${path}`)).text();
      for (const path of HEAD_PARITY_PAGES) {
        const expected = headFromHtml(await html(path));
        await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30_000 });
        await page.waitForTimeout(300);
        const actual = await page.evaluate(headFromDom);
        const ok = sameHead(expected, actual) && expected.hreflang.length > 0;
        if (!ok) failures += 1;
        console.log(`${ok ? '✓' : '✗'} head SEO idratata = HTML ${path} · hreflang ${actual.hreflang.map((h) => h[0]).join(',')}`);
        if (!ok) console.log(`    atteso ${JSON.stringify(expected)}\n    trovato ${JSON.stringify(actual)}`);
      }
      for (const [from, to] of SPA_NAVIGATIONS) {
        await page.goto(`${BASE}${from}`, { waitUntil: 'networkidle', timeout: 30_000 });
        // Marcatore sulla window: sopravvive solo a una navigazione CLIENT-side
        // (un caricamento completo della pagina lo azzererebbe).
        await page.evaluate(() => ((window as unknown as { __spa?: number }).__spa = 1));
        const link = page.locator(`main a[href="${to}"]`).first();
        const clicked = await link
          .click({ timeout: 8_000 })
          .then(() => true)
          .catch(() => false);
        await page.waitForURL(`**${to}`, { timeout: 8_000 }).catch(() => {});
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(300);
        const expected = headFromHtml(await html(to));
        const actual = await page.evaluate(headFromDom);
        const spa = await page.evaluate(() => (window as unknown as { __spa?: number }).__spa === 1);
        const ok =
          clicked &&
          spa &&
          page.url() === `${BASE}${to}` &&
          expected.hreflang.length > 0 &&
          sameHead(expected, actual);
        if (!ok) failures += 1;
        console.log(`${ok ? '✓' : '✗'} head SEO dopo navigazione SPA ${from} → ${to}`);
        if (!ok) console.log(`    click ${clicked} · spa ${spa} · url ${page.url()}\n    atteso ${JSON.stringify(expected)}\n    trovato ${JSON.stringify(actual)}`);
      }
    }

    // Link interni fra mondi (SEO-05): nell'HTML statico, uguali dopo
    // l'idratazione, verso mappe esistenti, nella lingua della pagina.
    {
      const mapLinks = (html: string, lang: string) =>
        [...html.matchAll(/<a[^>]*\shref="(\/[a-z]{2}\/[a-z0-9-]+\/map)"/g)].map((m) => m[1]).filter((h) => h.startsWith(`/${lang}/`));
      const otherWorldsSection = (html: string) => html.match(/<section aria-labelledby="other-worlds-[^"]+"[\s\S]*?<\/section>/)?.[0] ?? '';
      const status = async (path: string) => (await fetch(`${BASE}${path}`, { redirect: 'manual' })).status;
      // Home: una CTA "mappa" per ogni mondo pubblicato.
      for (const lang of ['en', 'it', 'es', 'fr']) {
        const html = await (await fetch(`${BASE}/${lang}`)).text();
        const links = [...new Set(mapLinks(html, lang))];
        const statuses = await Promise.all(links.map(status));
        await page.goto(`${BASE}/${lang}`, { waitUntil: 'networkidle', timeout: 30_000 });
        const dom = await page.evaluate((l) => [...new Set([...document.querySelectorAll(`main a[href^="/${l}/"][href$="/map"]`)].map((a) => a.getAttribute('href')))].sort(), lang);
        const ok = links.length === SEO05_PUBLISHED_MAPS && statuses.every((s) => s === 200) && JSON.stringify(dom) === JSON.stringify([...links].sort());
        if (!ok) failures += 1;
        console.log(`${ok ? '✓' : '✗'} home /${lang}: ${links.length} link diretti alle mappe (HTML statico = DOM idratato, tutti 200)`);
      }
      // Landing e mappe: "altri mondi" senza la pagina corrente.
      for (const path of SEO05_PAGES) {
        const [, lang, world] = path.split('/');
        const html = await (await fetch(`${BASE}${path}`)).text();
        const links = mapLinks(otherWorldsSection(html), lang);
        const statuses = await Promise.all(links.map(status));
        await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 30_000 });
        const dom = await page.evaluate(
          () => [...document.querySelectorAll('section[aria-labelledby^="other-worlds-"] a')].map((a) => a.getAttribute('href')),
        );
        const ok =
          links.length === SEO05_PUBLISHED_MAPS - 1 &&
          new Set(links).size === links.length &&
          !links.some((h) => h.startsWith(`/${lang}/${world}/`)) &&
          statuses.every((s) => s === 200) &&
          JSON.stringify(dom) === JSON.stringify(links);
        if (!ok) failures += 1;
        console.log(`${ok ? '✓' : '✗'} altri mondi su ${path}: ${links.length} mappe, nessun link a sé, HTML statico = DOM idratato`);
        if (!ok) console.log(`    statico ${JSON.stringify(links)}\n    DOM ${JSON.stringify(dom)}`);
      }
      // Navigazione reale dopo l'idratazione: CTA della home → mappa; guida → altra mappa.
      // Un link mancante conta come UN fallimento, non interrompe lo smoke.
      const click = (selector: string) =>
        page.locator(selector).first().click({ timeout: 8_000 }).then(() => true, () => false);
      await page.goto(`${BASE}/en`, { waitUntil: 'networkidle', timeout: 30_000 });
      await click('main a[href="/en/naruto/map"]');
      await page.waitForURL('**/en/naruto/map', { timeout: 10_000 }).catch(() => {});
      const homeOk = page.url() === `${BASE}/en/naruto/map`;
      await page.waitForLoadState('networkidle');
      await click('details > summary');
      await click('section[aria-labelledby^="other-worlds-"] a[href="/en/one-piece/map"]');
      await page.waitForURL('**/en/one-piece/map', { timeout: 10_000 }).catch(() => {});
      const guideOk = page.url() === `${BASE}/en/one-piece/map`;
      if (!homeOk || !guideOk) failures += 1;
      console.log(`${homeOk && guideOk ? '✓' : '✗'} navigazione: home → /en/naruto/map (${homeOk}) · guida → /en/one-piece/map (${guideOk})`);
    }

    // HTTP: 404 reale (niente soft-404) e redirect legacy.
    {
      const r404 = await fetch(`${BASE}/questo-url-non-esiste-123`, { redirect: 'manual' });
      const legacy = await fetch(`${BASE}/worlds/naruto/clans`, { redirect: 'manual' });
      const ok =
        r404.status === 404 &&
        legacy.status === 308 &&
        legacy.headers.get('location') === '/it/naruto/factions';
      if (!ok) failures += 1;
      console.log(`${ok ? '✓' : '✗'} HTTP 404=${r404.status} · legacy ${legacy.status} → ${legacy.headers.get('location')}`);
    }

    // Interazione: "Mostra tutti" in homepage espande i mondi "in arrivo".
    {
      await page.goto(`${BASE}/en`, { waitUntil: 'networkidle', timeout: 30_000 });
      const cards = page.locator('section[aria-labelledby="worlds-heading"] li a[href^="/en/"]');
      const before = await cards.count();
      const toggle = page.locator('section[aria-labelledby="worlds-heading"] button[aria-expanded]');
      await toggle.click();
      await page.waitForTimeout(150);
      const after = await cards.count();
      const ok = before >= 5 && after > before;
      if (!ok) failures += 1;
      console.log(`${ok ? '✓' : '✗'} homepage "mostra tutti": ${before} → ${after}`);
    }

    // Selettore lingua: dalla pagina entità EN a quella IT equivalente.
    {
      await page.goto(`${BASE}/en/naruto/characters/itachi-uchiha`, { waitUntil: 'networkidle', timeout: 30_000 });
      await page.getByRole('button', { name: /change language|cambia lingua/i }).first().click();
      await page.getByRole('option', { name: /italiano/i }).first().click();
      await page.waitForURL('**/it/naruto/characters/itachi-uchiha', { timeout: 8_000 }).catch(() => {});
      const ok = page.url().endsWith('/it/naruto/characters/itachi-uchiha');
      if (!ok) failures += 1;
      console.log(`${ok ? '✓' : '✗'} cambio lingua EN → IT: ${page.url().replace(BASE, '')}`);
    }

    // Spagnolo: su un mondo tradotto si passa a /es; su uno non tradotto (oggi
    // solo i mondi "in arrivo") si resta su /en con l'interfaccia in spagnolo
    // (nessuna pagina /es inesistente).
    {
      await page.goto(`${BASE}/en/naruto/characters/itachi-uchiha`, { waitUntil: 'networkidle', timeout: 30_000 });
      await page.getByRole('button', { name: /change language|cambia lingua/i }).first().click();
      await page.getByRole('option', { name: /español/i }).first().click();
      await page.waitForURL('**/es/naruto/characters/itachi-uchiha', { timeout: 8_000 }).catch(() => {});
      await page.getByText('Genio Uchiha').first().waitFor({ timeout: 8_000 }).catch(() => {});
      const okEs = page.url().endsWith('/es/naruto/characters/itachi-uchiha') && (await page.getByText('Genio Uchiha').count()) > 0;
      if (!okEs) failures += 1;
      console.log(`${okEs ? '✓' : '✗'} cambio lingua EN → ES (mondo tradotto): ${page.url().replace(BASE, '')}`);

      // La preferenza ES è salvata: su /en/frieren l'interfaccia resta già in spagnolo.
      await page.goto(`${BASE}/en/frieren`, { waitUntil: 'networkidle', timeout: 30_000 });
      await page.getByRole('button', { name: /change language|cambia lingua|cambiar idioma/i }).first().click();
      await page.getByRole('option', { name: /español/i }).first().click();
      await page.waitForTimeout(800);
      const lang = await page.evaluate(() => document.documentElement.lang);
      const homeHref = await page.locator('header a[href="/es"]').count();
      const okStay = new URL(page.url()).pathname === '/en/frieren' && homeHref > 0;
      if (!okStay) failures += 1;
      console.log(`${okStay ? '✓' : '✗'} ES su mondo non tradotto resta su ${new URL(page.url()).pathname} (html lang=${lang}, link home /es: ${homeHref})`);
      // La scelta è persistita: torniamo all'inglese per non influenzare i check successivi.
      await page.evaluate(() => localStorage.setItem('animeInteractiveMaps.locale', 'en'));
    }

    // Francese: mondo tradotto → /fr con i nomi dell'edizione francese (Uchiwa).
    {
      await page.goto(`${BASE}/en/naruto/characters/itachi-uchiha`, { waitUntil: 'networkidle', timeout: 30_000 });
      await page.getByRole('button', { name: /change language|cambia lingua/i }).first().click();
      await page.getByRole('option', { name: /français/i }).first().click();
      await page.waitForURL('**/fr/naruto/characters/itachi-uchiha', { timeout: 8_000 }).catch(() => {});
      await page.getByText('Itachi Uchiwa').first().waitFor({ timeout: 8_000 }).catch(() => {});
      const okFr = page.url().endsWith('/fr/naruto/characters/itachi-uchiha') && (await page.getByText('Itachi Uchiwa').count()) > 0;
      if (!okFr) failures += 1;
      console.log(`${okFr ? '✓' : '✗'} cambio lingua EN → FR (mondo tradotto): ${page.url().replace(BASE, '')}`);
      await page.evaluate(() => localStorage.setItem('animeInteractiveMaps.locale', 'en'));
    }

    // Interazione: cliccare una card personaggio deve aprire il modale
    // (valida il wiring onSelect dopo la memoizzazione).
    {
      await page.goto(`${BASE}/en/one-piece/characters`, {
        waitUntil: 'networkidle',
        timeout: 30_000,
      });
      const before = consoleErrors.length;
      // Le card sono link reali verso la pagina entità: il click semplice apre
      // comunque la scheda modale (UX invariata).
      await page.locator('main ul li a[href^="/en/one-piece/characters/"]').first().click();
      const dialog = page.locator('[role="dialog"]');
      const ok = await dialog
        .first()
        .waitFor({ state: 'visible', timeout: 8_000 })
        .then(() => true, () => false);
      const newErrors = consoleErrors.length - before;
      if (!ok || newErrors > 0) failures += 1;
      console.log(
        `${ok && newErrors === 0 ? '✓' : '✗'} click card → modale${
          ok ? '' : ' (modale non aperto)'
        }${newErrors ? ` (${newErrors} errori console)` : ''}`,
      );
    }

    // Header desktop: 1 riga, 3 zone mai sovrapposte, nessuna tab tagliata,
    // tab attiva corretta anche sulle route figlie, "Altro" solo se serve.
    {
      const cases: { path: string; active: string }[] = [
        { path: '/it/naruto', active: 'Panoramica' },
        { path: '/it/naruto/map', active: 'Mappa' },
        { path: '/it/one-piece/characters/monkey-d-luffy', active: 'Personaggi' },
        { path: '/en/hunter-x-hunter/locations', active: 'Locations' },
        { path: '/en/black-clover/arcs', active: 'Story Arcs' },
      ];
      const hp = await browser.newPage();
      // tsx/esbuild avvolge le funzioni nominate con `__name`: nel browser serve lo shim.
      await hp.addInitScript(() => {
        (globalThis as { __name?: unknown }).__name = (f: unknown) => f;
      });
      let headerFailures = 0;
      for (const width of [1920, 1600, 1440, 1366, 1024, 768]) {
        await hp.setViewportSize({ width, height: 900 });
        for (const c of cases) {
          await hp.goto(`${BASE}${c.path}`, { waitUntil: 'networkidle', timeout: 30_000 });
          const r = await hp.evaluate(() => {
            const R = (el: Element) => el.getBoundingClientRect();
            const shown = (el: Element | null) => !!el && getComputedStyle(el).display !== 'none' && R(el).width > 0;
            const header = document.querySelector('header')!;
            const bar = header.firstElementChild!;
            const left = bar.firstElementChild!;
            const right = bar.lastElementChild!;
            const nav = header.querySelector('nav.world-tabs')!;
            const divider = header.querySelector('[data-nav-divider]');
            // Selettore, tab visibili e utility: stessa altezza e stesso centro verticale.
            const controls = [
              header.querySelector('button[aria-haspopup="menu"]'),
              ...[...nav.querySelectorAll('.world-tabs__list > li > a')].filter(shown),
              ...[...right.querySelectorAll(':scope > a, :scope > button, :scope > div > button')].filter(shown),
            ].filter((el): el is Element => !!el);
            const heights = new Set(controls.map((el) => Math.round(R(el).height)));
            const centers = controls.map((el) => R(el).top + R(el).height / 2);
            const list = nav.querySelector('.world-tabs__list')!;
            const tabs = [...list.children].filter(shown);
            const active = nav.querySelector('[aria-current="page"]');
            return {
              height: R(header).height,
              overlap: R(left).right > R(nav).left + 0.5 || R(nav).right > R(right).left + 0.5,
              clipped: tabs.some((li) => R(li).right > R(list).right + 0.5),
              visible: tabs.length,
              total: list.children.length,
              more: shown(nav.querySelector('.wt-more')),
              active: active?.textContent ?? null,
              activeShown: !!active && (shown(active.closest('li')) || shown(nav.querySelector('.wt-more-current'))),
              hscroll: document.documentElement.scrollWidth > innerWidth,
              heights: [...heights],
              centerSpread: Math.max(...centers) - Math.min(...centers),
              divider: !!divider && shown(divider) && R(divider).left >= R(left).right && R(divider).right <= R(nav).left,
            };
          });
          const problems = [
            r.height > 64 && `altezza ${r.height}`,
            r.overlap && 'zone sovrapposte',
            r.clipped && 'tab tagliata',
            r.hscroll && 'scroll orizzontale',
            r.active !== c.active && `tab attiva "${r.active}" ≠ "${c.active}"`,
            !r.activeShown && 'tab attiva non visibile',
            width >= 1366 && (r.more || r.visible < r.total) && `"Altro" a ${width}px`,
            r.visible < r.total && !r.more && 'tab nascoste senza "Altro"',
            r.heights.length !== 1 && `altezze diverse ${r.heights.join('/')}`,
            r.centerSpread > 1 && `centri verticali sfalsati di ${r.centerSpread.toFixed(1)}px`,
            !r.divider && 'divisore selettore │ tab assente o fuori posto',
          ].filter(Boolean);
          if (problems.length) {
            failures += 1;
            headerFailures += 1;
            console.log(`✗ header ${width}px ${c.path}: ${problems.join(', ')}`);
          }
        }
      }
      console.log(`${headerFailures ? '✗' : '✓'} header responsive: ${cases.length} route × 6 viewport verificate`);

      // Selettore anime: da una scheda porta SEMPRE alla Panoramica del nuovo mondo.
      await hp.setViewportSize({ width: 1440, height: 900 });
      await hp.goto(`${BASE}/it/one-piece/characters/monkey-d-luffy`, { waitUntil: 'networkidle', timeout: 30_000 });
      await hp.getByRole('button', { name: 'Cambia universo' }).click();
      await hp.waitForTimeout(400); // fine dell'animazione popIn
      const anchor = await hp.evaluate(() => {
        const btn = document.querySelector('header button[aria-haspopup="menu"]')!.getBoundingClientRect();
        const menu = document.querySelector('header [role="menu"]')!.getBoundingClientRect();
        return { dx: Math.abs(menu.left - btn.left), gap: menu.top - btn.bottom, wider: menu.width >= btn.width };
      });
      const okAnchor = anchor.dx < 1 && anchor.gap >= 0 && anchor.gap <= 10 && anchor.wider;
      if (!okAnchor) failures += 1;
      console.log(`${okAnchor ? '✓' : '✗'} menu anime ancorato al selettore: ${JSON.stringify(anchor)}`);
      await hp.getByRole('menuitem', { name: 'Naruto' }).click();
      await hp.waitForURL(/\/it\/naruto$/, { timeout: 8_000 }).catch(() => {});
      const okSwitch = new URL(hp.url()).pathname === '/it/naruto';
      if (!okSwitch) failures += 1;
      console.log(`${okSwitch ? '✓' : '✗'} selettore anime → Panoramica: ${new URL(hp.url()).pathname}`);
      await hp.close();
    }

    await browser.close();
  } catch (err) {
    console.error('Errore durante lo smoke test:', err);
    failures += 1;
  } finally {
    preview.kill('SIGTERM');
  }

  if (consoleErrors.length) {
    console.log('\n--- errori console/page raccolti ---');
    for (const e of consoleErrors) console.log('  ' + e);
  }

  if (failures > 0) {
    console.log(`\n✗ SMOKE FALLITO (${failures} check)`);
    process.exit(1);
  }
  console.log('\n✓ SMOKE OK — tutte le rotte chiave renderizzano');
  process.exit(0);
}

void main();
