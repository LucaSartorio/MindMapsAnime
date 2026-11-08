import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';

// Audit a11y automatico (WCAG 2.2 A/AA) con axe-core su pagine e stati dell'interfaccia.
// Uso: avvia `npm run preview:static` in un terminale, poi `npm run audit:a11y`.
// Variabili: BASE (url del preview), PW_CHROME (path eseguibile Chromium; senza, quello
// installato da Playwright), REPORT (path di un report JSON, facoltativo).
//
// Ogni scenario dichiara lo STATO che deve raggiungere (`expect`): se un'azione fallisce
// o lo stato non viene raggiunto lo scenario è "fallito" (non verificato) e l'audit esce
// con codice 1 — un menu rimasto chiuso non passa più per "pulito". Il report distingue:
//   - violazioni axe (bloccanti);
//   - controlli UX-02 propri (bloccanti): area cliccabile dei pin della mappa ≥ 24×24 px
//     (WCAG 2.5.8; axe non valuta i pin perché non sono widget ARIA) e link del footer
//     coperti da altri elementi quando non c'è un overlay aperto;
//   - nodi "incomplete" (axe non decide; informativi: il contrasto lo verifica
//     `npm run audit:contrast` ricostruendo lo sfondo reale);
//   - scenari falliti (bloccanti).
const AXE = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const BASE = process.env.BASE || 'http://localhost:4173';
const EXE = process.env.PW_CHROME;
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844, mobile: true };

// Stato del browser all'apertura: consenso cookie già dato + onboarding già visto
// (visita successiva), oppure storage pulito (prima visita). Script come stringa:
// niente funzioni serializzate.
const RETURNING = `try{localStorage.setItem('animeInteractiveMaps.cookieConsent',JSON.stringify({necessary:true,analytics:false,timestamp:new Date().toISOString(),version:2}));localStorage.setItem('animeInteractiveMaps.onboarding.v1','1')}catch(e){throw new Error('localStorage non disponibile: '+e.message)}`;

const MAP_READY = '.react-flow__node[data-id="__layer-background"] img';
const OPEN_DIALOG = 'aside[role="dialog"]:not([inert])';

/** Attende che il selettore sia visibile; se no lancia con un messaggio leggibile. */
async function visible(p, selector, what = selector) {
  try {
    await p.locator(selector).first().waitFor({ state: 'visible', timeout: 8000 });
  } catch {
    throw new Error(`stato non raggiunto: ${what}`);
  }
}
async function hidden(p, selector, what = selector) {
  try {
    await p.locator(selector).first().waitFor({ state: 'hidden', timeout: 8000 });
  } catch {
    throw new Error(`stato non raggiunto: ${what} (ancora visibile)`);
  }
}
async function check(p, fn, what, arg) {
  try {
    await p.waitForFunction(fn, arg, { timeout: 8000 });
  } catch {
    throw new Error(`stato non raggiunto: ${what}`);
  }
}
const openMap = async (p, path) => {
  await p.goto(BASE + path);
  await visible(p, MAP_READY, 'immagine della mappa caricata');
};
// Pulsante degli strumenti mappa: rail verticale (desktop) o bottom nav (mobile),
// quello visibile nella viewport corrente.
const railButton = (p, name) => p.locator(`nav[aria-label="Map tools"] button[aria-label="${name}"]:visible, nav[aria-label="Map tools"] button:visible:has-text("${name}")`).first();
const h1 = (p) => visible(p, 'main h1', '<h1> della pagina');

const scenarios = [
  // ── Prima visita (storage pulito) ────────────────────────────────────────────
  { name: 'home: banner cookie (prima visita)', firstVisit: true,
    go: async (p) => { await p.goto(BASE + '/en'); },
    expect: async (p) => { await visible(p, '[aria-labelledby="cookie-banner-title"]', 'banner cookie'); } },
  { name: 'preferenze cookie (prima visita)', firstVisit: true,
    go: async (p) => { await p.goto(BASE + '/en'); await p.getByRole('button', { name: 'Customize', exact: true }).click(); },
    expect: async (p) => { await visible(p, '[role="dialog"][aria-modal="true"] input[type="checkbox"]', 'dialog preferenze con la casella analytics'); } },
  { name: 'mappa mobile: banner cookie non coperto (prima visita)', firstVisit: true, vp: MOBILE,
    go: async (p) => { await p.goto(BASE + '/en/naruto/map'); await visible(p, MAP_READY, 'mappa'); },
    expect: async (p) => {
      await visible(p, '[aria-labelledby="cookie-banner-title"]', 'banner cookie');
      await check(p, () => {
        const banner = document.querySelector('[aria-labelledby="cookie-banner-title"]');
        const modal = [...document.querySelectorAll('[role="dialog"][aria-modal="true"]')].some((d) => !d.closest('[inert]') && d.getBoundingClientRect().width > 0);
        return !modal && [...banner.querySelectorAll('button')].every((b) => { const r = b.getBoundingClientRect(); const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return t && (t === b || b.contains(t)); });
      }, 'nessun dialog modale sopra il banner e pulsanti del banner cliccabili');
      await check(p, () => [...document.querySelectorAll('nav[aria-label="Map tools"] button')].filter((b) => b.getBoundingClientRect().width > 0).every((b) => {
        const r = b.getBoundingClientRect(); const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return t && (t === b || b.contains(t));
      }), 'bottom nav non coperta dal banner');
    } },
  { name: 'mappa mobile: onboarding touch dopo la scelta cookie (prima visita)', firstVisit: true, vp: MOBILE,
    go: async (p) => { await p.goto(BASE + '/en/naruto/map'); await visible(p, MAP_READY, 'mappa'); await p.getByRole('button', { name: 'Reject', exact: true }).click(); },
    expect: async (p) => {
      await visible(p, '[role="dialog"][aria-label="How to explore the map"]', 'onboarding aperto');
      await visible(p, '[role="dialog"] li:has-text("Tap a pin")', 'istruzioni touch');
      await check(p, () => !document.querySelector('[aria-labelledby="cookie-banner-title"]') && !!document.activeElement?.closest('[role="dialog"]'), 'banner chiuso e focus nel dialog onboarding');
    } },
  // ── Pagine (visita successiva) ───────────────────────────────────────────────
  { name: 'home', go: async (p) => { await p.goto(BASE + '/en'); }, expect: h1 },
  { name: 'about', go: async (p) => { await p.goto(BASE + '/en/about'); }, expect: h1 },
  { name: 'world landing', go: async (p) => { await p.goto(BASE + '/en/naruto'); }, expect: h1 },
  { name: 'world landing (mobile)', vp: MOBILE, go: async (p) => { await p.goto(BASE + '/en/naruto'); }, expect: h1 },
  { name: 'entity page (character)', go: async (p) => { await p.goto(BASE + '/it/naruto/characters/itachi-uchiha'); }, expect: h1 },
  { name: 'entity page (faction, mobile)', vp: MOBILE, go: async (p) => { await p.goto(BASE + '/en/naruto/factions/akatsuki'); }, expect: h1 },
  { name: 'entity page (journey)', go: async (p) => { await p.goto(BASE + '/en/hunter-x-hunter/journeys/gons-journey'); }, expect: h1 },
  { name: 'locations directory', go: async (p) => { await p.goto(BASE + '/en/one-piece/locations'); }, expect: h1 },
  { name: 'timeline page', go: async (p) => { await p.goto(BASE + '/en/naruto/timeline'); }, expect: h1 },
  { name: '404', go: async (p) => { const r = await p.goto(BASE + '/en/does-not-exist'); if (r?.status() !== 404) throw new Error(`stato HTTP ${r?.status()} invece di 404`); }, expect: h1 },
  { name: 'privacy', go: async (p) => { await p.goto(BASE + '/en/privacy'); }, expect: h1 },
  { name: 'cookie-policy', go: async (p) => { await p.goto(BASE + '/en/cookie-policy'); }, expect: h1 },
  { name: 'support', go: async (p) => { await p.goto(BASE + '/en/support'); }, expect: h1 },
  { name: 'arcs archive', go: async (p) => { await p.goto(BASE + '/en/black-clover/arcs'); }, expect: h1 },
  { name: 'characters', go: async (p) => { await p.goto(BASE + '/en/naruto/characters'); }, expect: h1 },
  { name: 'factions', go: async (p) => { await p.goto(BASE + '/en/one-piece/factions'); }, expect: h1 },
  { name: 'abilities', go: async (p) => { await p.goto(BASE + '/en/one-piece/abilities'); }, expect: h1 },
  { name: 'skip link con focus', go: async (p) => { await p.goto(BASE + '/en/naruto'); await h1(p); await p.keyboard.press('Tab'); },
    expect: async (p) => { await check(p, () => document.activeElement?.getAttribute('href') === '#main-content', 'skip link con il focus'); } },
  // ── Mappe e overlay ──────────────────────────────────────────────────────────
  { name: 'map (naruto)', go: (p) => openMap(p, '/en/naruto/map'), expect: async (p) => { await visible(p, '.react-flow__node-map-node', 'pin della mappa'); } },
  { name: 'map (one piece)', go: (p) => openMap(p, '/en/one-piece/map'), expect: async (p) => { await visible(p, '.react-flow__node-map-node', 'pin della mappa'); } },
  { name: 'map (dragon ball, mobile)', vp: MOBILE, go: (p) => openMap(p, '/en/dragon-ball/map'),
    expect: async (p) => { await visible(p, 'nav[aria-label="Map tools"]:visible', 'bottom nav'); await hidden(p, 'footer', 'footer nascosto sotto la bottom nav'); } },
  { name: 'map guide (open)', go: async (p) => { await openMap(p, '/en/black-clover/map'); await p.locator('details summary').first().click(); },
    expect: async (p) => { await visible(p, 'details[open]', 'guida della mappa aperta'); } },
  { name: 'focus mode (scheda luogo)', go: (p) => openMap(p, '/en/naruto/map?location=loc-konoha'),
    expect: async (p) => { await visible(p, '[role="dialog"][aria-modal="true"]', 'scheda del luogo'); await visible(p, '.map-pin[data-dimmed]', 'pin attenuati'); } },
  { name: 'focus mode (mobile)', vp: MOBILE, go: (p) => openMap(p, '/en/naruto/map?location=loc-konoha'),
    expect: async (p) => { await visible(p, '[role="dialog"][aria-modal="true"]', 'scheda del luogo'); } },
  { name: 'filters drawer', go: async (p) => { await openMap(p, '/en/naruto/map'); await railButton(p, 'Filters').click(); await visible(p, OPEN_DIALOG, 'drawer filtri aperto'); await p.locator(`${OPEN_DIALOG} button[aria-pressed="false"]`).first().click(); },
    expect: async (p) => { await visible(p, `${OPEN_DIALOG} button[aria-pressed="true"]`, 'un filtro attivo'); } },
  { name: 'filters drawer (mobile)', vp: MOBILE, go: async (p) => { await openMap(p, '/en/naruto/map'); await railButton(p, 'Filters').click(); },
    expect: async (p) => { await visible(p, OPEN_DIALOG, 'drawer filtri aperto'); } },
  { name: 'layers drawer', go: async (p) => { await openMap(p, '/en/naruto/map'); await railButton(p, 'Layers').click(); },
    expect: async (p) => { await visible(p, `${OPEN_DIALOG} [role="switch"]`, 'drawer livelli aperto'); } },
  { name: 'map panels (legend/routes/timeline)', go: async (p) => { await openMap(p, '/en/naruto/map'); for (const n of ['Legend', 'Routes', 'Timeline']) await railButton(p, n).click(); },
    expect: async (p) => { await check(p, () => ['Legend', 'Routes', 'Timeline'].every((n) => [...document.querySelectorAll(`nav[aria-label="Map tools"] button[aria-pressed="true"]`)].some((b) => b.getBoundingClientRect().width > 0 && (b.getAttribute('aria-label') === n || b.textContent.includes(n)))), 'legenda, percorsi e timeline aperti'); } },
  { name: 'legend + routes (dragon ball, mobile)', vp: MOBILE, go: async (p) => { await openMap(p, '/en/dragon-ball/map'); await railButton(p, 'Legend').click(); },
    expect: async (p) => { await visible(p, 'section[aria-label="Legend"] button[aria-pressed]', 'legenda aperta'); } },
  { name: 'location modal (tabs)', go: async (p) => { await openMap(p, '/en/naruto/map'); await p.locator('.react-flow__node[data-id="loc-konoha"] .pointer-events-auto').first().dispatchEvent('click'); },
    expect: async (p) => { await visible(p, '[role="dialog"][aria-modal="true"] [role="tablist"]', 'scheda con schede'); } },
  { name: 'route modal (stepper)', go: (p) => openMap(p, '/en/naruto/map?route=route-team7-waves'),
    expect: async (p) => { await visible(p, '[role="dialog"] button[aria-label="Next step"]', 'stepper del percorso'); } },
  { name: 'story mode', go: async (p) => { await openMap(p, '/en/naruto/map?arc=arc-prologue'); await p.getByRole('button', { name: /start guided story/i }).click(); },
    expect: async (p) => { await visible(p, 'section[aria-label="Guided story"]', 'pannello storia guidata'); } },
  { name: 'relations graph', go: (p) => openMap(p, '/en/naruto/map?relations=char-itachi'),
    expect: async (p) => { await visible(p, '[role="dialog"][aria-modal="true"] .react-flow', 'grafo delle relazioni'); } },
  { name: 'character modal', go: async (p) => { await p.goto(BASE + '/en/naruto/characters'); await h1(p); await p.locator('main ul li a[href*="/characters/"]').first().click(); },
    expect: async (p) => { await visible(p, '[role="dialog"][aria-modal="true"]', 'scheda personaggio'); } },
  { name: 'report modal', go: async (p) => { await openMap(p, '/en/naruto/map'); await p.getByRole('button', { name: 'Report', exact: true }).click(); },
    expect: async (p) => { await visible(p, '[role="dialog"][aria-modal="true"] form', 'modulo segnalazione'); } },
  { name: 'mobile menu (map)', vp: MOBILE, go: async (p) => { await openMap(p, '/en/naruto/map'); await p.locator('button[aria-controls="mobile-world-nav"]').click(); },
    expect: async (p) => { await visible(p, '#mobile-world-nav a[href$="/privacy"]', 'menu mobile con i link legali'); } },
  { name: 'language menu open', go: async (p) => { await p.goto(BASE + '/en'); await h1(p); await p.getByRole('button', { name: /change language/i }).first().click(); },
    expect: async (p) => { await visible(p, '[role="menu"], [role="listbox"]', 'menu lingue aperto'); } },
  { name: 'header "More" menu open (1180px)', vp: { width: 1180, height: 800 }, go: async (p) => { await p.goto(BASE + '/en/one-piece/arcs'); await h1(p); await p.locator('.wt-more').click(); },
    expect: async (p) => { await check(p, () => document.querySelector('.wt-more')?.getAttribute('aria-expanded') === 'true', 'menu "More" aperto'); } },
  { name: 'world switcher open', go: async (p) => { await p.goto(BASE + '/en/naruto'); await h1(p); await p.getByRole('button', { name: /switch world/i }).first().click(); },
    expect: async (p) => { await visible(p, '[role="menu"]', 'menu dei mondi aperto'); } },
  { name: 'search overlay open', go: async (p) => { await openMap(p, '/en/naruto/map'); await p.getByRole('button', { name: /search/i }).first().click(); },
    expect: async (p) => { await visible(p, '[role="combobox"]', 'campo di ricerca'); } },
];

async function runAxe(page) {
  await page.evaluate(AXE);
  return page.evaluate(
    (tags) =>
      // eslint-disable-next-line no-undef
      window.axe.run(document, { runOnly: { type: 'tag', values: tags } }).then((r) => ({
        incomplete: r.incomplete.map((v) => ({ id: v.id, n: v.nodes.length })),
        violations: r.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          n: v.nodes.length,
          sample: v.nodes[0]?.target?.join(' ') ?? '',
          sampleHtml: (v.nodes[0]?.html ?? '').slice(0, 120),
        })),
      })),
    TAGS,
  );
}

/** Controlli UX-02 che axe non copre. Ritorna violazioni nello stesso formato. */
function ownChecks() {
  const out = [];
  const inView = (r) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
  // 1) Pin della mappa: area cliccabile ≥ 24×24 (WCAG 2.5.8).
  const smallPins = [...document.querySelectorAll('.react-flow__node-map-node .pointer-events-auto > div')]
    .map((e) => ({ e, r: e.getBoundingClientRect() }))
    .filter(({ r }) => inView(r) && (r.width < 24 || r.height < 24));
  if (smallPins.length)
    out.push({ id: 'ux02-pin-target-size', impact: 'serious', help: 'Area cliccabile del pin della mappa sotto 24×24 px (WCAG 2.5.8)', n: smallPins.length,
      sample: smallPins[0].e.textContent.trim().slice(0, 40), sampleHtml: `${Math.round(smallPins[0].r.width)}×${Math.round(smallPins[0].r.height)}` });
  // 2) Link del footer coperti da altro (es. la bottom nav), senza overlay aperti.
  // I drawer chiusi restano nel DOM come dialog `inert`: non contano come overlay.
  const overlayOpen = [...document.querySelectorAll('[role="dialog"], [aria-labelledby="cookie-banner-title"], #mobile-world-nav')].some((e) => !e.closest('[inert]'));
  if (!overlayOpen) {
    const covered = [...document.querySelectorAll('footer a, footer button')].filter((e) => {
      const r = e.getBoundingClientRect();
      if (!inView(r)) return false;
      const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !t || !(t === e || e.contains(t));
    });
    if (covered.length)
      out.push({ id: 'ux02-footer-obscured', impact: 'serious', help: 'Link del footer coperti da un altro elemento', n: covered.length,
        sample: (covered[0].textContent || covered[0].getAttribute('aria-label') || '').trim().slice(0, 40), sampleHtml: covered[0].outerHTML.slice(0, 120) });
  }
  return out;
}

const b = await chromium.launch(EXE ? { executablePath: EXE } : {});
const agg = new Map();
const failed = [];
const incompleteByRule = new Map();
const report = [];
let incompleteTotal = 0;
for (const s of scenarios) {
  const vp = s.vp ?? DESKTOP;
  const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.mobile, hasTouch: !!vp.mobile });
  if (!s.firstVisit) await ctx.addInitScript(RETURNING);
  const p = await ctx.newPage();
  const label = `${s.name} @${vp.width}`;
  try {
    await s.go(p);
    await s.expect(p);
    await p.waitForTimeout(250); // transizioni CSS finite prima dell'analisi
    const { violations, incomplete } = await runAxe(p);
    const v = [...violations, ...(await p.evaluate(ownChecks))];
    const inc = incomplete.reduce((n, x) => n + x.n, 0);
    incompleteTotal += inc;
    for (const x of incomplete) incompleteByRule.set(x.id, (incompleteByRule.get(x.id) ?? 0) + x.n);
    console.log(`\n## ${label}: ${v.map((x) => `${x.id}(${x.n})`).join(', ') || 'nessuna violazione'} · incomplete ${inc}`);
    for (const x of v) {
      console.log(`   - [${x.impact}] ${x.id}: ${x.help} | es. ${x.sample} :: ${x.sampleHtml}`);
      if (!agg.has(x.id)) agg.set(x.id, { impact: x.impact, help: x.help, scenarios: new Set() });
      agg.get(x.id).scenarios.add(label);
    }
    report.push({ scenario: label, status: 'executed', violations: v, incomplete });
  } catch (e) {
    const msg = e.message.split('\n')[0];
    console.log(`\n## ${label}: SCENARIO FALLITO — ${msg}`);
    failed.push(`${label} (${msg})`);
    report.push({ scenario: label, status: 'failed', error: msg });
  }
  await ctx.close();
}
await b.close();

console.log('\n\n===== RIEPILOGO =====');
console.log(`Scenari: ${scenarios.length} · eseguiti ${scenarios.length - failed.length} · falliti ${failed.length}`);
console.log(`Violazioni uniche: ${agg.size}`);
for (const [id, d] of agg) console.log(`- [${d.impact}] ${id} — ${d.help} (in: ${[...d.scenarios].join(', ')})`);
console.log(`Nodi "incomplete" (axe non decide; informativi, contrasto → audit:contrast): ${incompleteTotal}` +
  (incompleteByRule.size ? ` — ${[...incompleteByRule].map(([k, n]) => `${k} ${n}`).join(', ')}` : ''));
if (failed.length) console.log(`SCENARI FALLITI (stato non raggiunto, non verificati):\n- ${failed.join('\n- ')}`);
if (process.env.REPORT) writeFileSync(process.env.REPORT, JSON.stringify({ base: BASE, scenarios: report }, null, 1));
process.exit(agg.size || failed.length ? 1 : 0);
