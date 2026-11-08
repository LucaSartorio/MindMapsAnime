/**
 * Audit del CONTRASTO DEL TESTO calcolato sul rendering reale (UX-01), con
 * axe-core come secondo parere. Uso:
 *
 *   npm run build && npm run preview:static      # in un terminale (porta 4173)
 *   npm run audit:contrast                       # in un altro
 *
 * Variabili: BASE (default http://localhost:4173), PW_CHROME (eseguibile
 * Chromium, se quello di Playwright non è installato), CONTRAST_JSON (file in cui
 * salvare il dettaglio).
 *
 * Perché non basta `audit:a11y`: axe-core segna come "incomplete" (non come
 * violazione) il testo su sfondi semitrasparenti, sfumati o sopra immagini, cioè
 * gran parte dell'interfaccia sopra la mappa; e lo script esistente non distingue
 * uno scenario fallito da uno pulito. Qui invece:
 *
 *  - per ogni testo visibile si legge il colore CALCOLATO (opacità degli antenati
 *    compresa) e si ricostruisce lo sfondo reale componendo, dall'alto verso il
 *    basso, gli elementi sotto il testo (`elementsFromPoint`) fino al primo opaco;
 *  - soglia WCAG 2.2 AA per ruolo: 4,5:1, oppure 3:1 per il testo grande (≥ 24 px,
 *    o ≥ 18,66 px in grassetto); esclusi i controlli disabilitati e il testo
 *    `aria-hidden` (decorativo), riportati a parte;
 *  - sfondo non determinabile (immagine, gradiente, canvas, SVG della mappa) →
 *    "da verificare", mai "superato";
 *  - ogni scenario verifica di aver raggiunto lo stato richiesto (menu aperto,
 *    modale visibile…): altrimenti è "non eseguito" e l'audit fallisce.
 *
 * Esce con codice 1 se c'è anche un solo contrasto insufficiente certo, un testo
 * con sfondo rimasto indeterminato, una violazione axe `color-contrast` o uno
 * scenario non eseguito. Le altre violazioni
 * axe (es. target-size) e le non conformità note sono stampate ma non bloccano: questo
 * è il controllo del contrasto, non l'audit a11y completo.
 */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:4173';
const AXE = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const VIEWPORTS = {
  m320: { width: 320, height: 640, isMobile: true, hasTouch: true },
  m390: { width: 390, height: 844, isMobile: true, hasTouch: true },
  tablet: { width: 768, height: 1024, isMobile: true, hasTouch: true },
  d1366: { width: 1366, height: 768, isMobile: false, hasTouch: false },
};
const ALL = Object.keys(VIEWPORTS);
const PHONE_DESKTOP = ['m390', 'd1366'];

/** Stato iniziale: consenso cookie dato e onboarding visto (salvo dove serve il banner). */
const consentScript = `try {
  localStorage.setItem('animeInteractiveMaps.cookieConsent', JSON.stringify({ necessary: true, analytics: false, timestamp: new Date().toISOString(), version: 2 }));
  localStorage.setItem('animeInteractiveMaps.onboarding.v1', '1');
} catch (e) {}`;
const onboardingOnly = `try { localStorage.setItem('animeInteractiveMaps.onboarding.v1', '1'); } catch (e) {}`;

const visible = (page, selector) =>
  page.locator(selector).first().waitFor({ state: 'visible', timeout: 10_000 }).then(() => true, () => false);
const openMap = async (page, path) => {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  return page
    .waitForFunction(() => {
      const i = document.querySelector('.react-flow__node[data-id="__layer-background"] img');
      return !!i && i.complete && i.naturalWidth > 0;
    }, null, { timeout: 20_000 })
    .then(() => true, () => false);
};

/**
 * Scenari: `run(page)` porta la pagina nello stato da verificare e restituisce
 * true solo se ci è arrivata davvero.
 */
const SCENARIOS = [
  { name: 'home + cookie banner', viewports: ALL, init: onboardingOnly,
    run: async (p) => { await p.goto(BASE + '/en', { waitUntil: 'networkidle' }); return visible(p, 'text=/accept all/i'); } },
  { name: 'home', viewports: ALL, run: async (p) => { await p.goto(BASE + '/en', { waitUntil: 'networkidle' }); return visible(p, 'main h1'); } },
  { name: 'skip link (focus da tastiera)', viewports: PHONE_DESKTOP, focusOnly: true,
    run: async (p) => {
      await p.goto(BASE + '/en/naruto', { waitUntil: 'networkidle' });
      await p.keyboard.press('Tab');
      return p.evaluate(() => document.activeElement?.getAttribute('href') === '#main-content');
    } },
  ...['it', 'en', 'es', 'fr'].map((lang) => ({
    name: `landing Naruto /${lang}`, viewports: lang === 'en' ? ALL : PHONE_DESKTOP,
    run: async (p) => { await p.goto(`${BASE}/${lang}/naruto`, { waitUntil: 'networkidle' }); return visible(p, 'main h1'); },
  })),
  ...['it', 'en', 'es', 'fr'].map((lang) => ({
    name: `personaggio Itachi /${lang}`, viewports: lang === 'en' ? ALL : PHONE_DESKTOP,
    run: async (p) => { await p.goto(`${BASE}/${lang}/naruto/characters/itachi-uchiha`, { waitUntil: 'networkidle' }); return visible(p, 'main h1'); },
  })),
  { name: 'abilità (Rasengan)', viewports: PHONE_DESKTOP,
    run: async (p) => { await p.goto(BASE + '/en/naruto/abilities/rasengan', { waitUntil: 'networkidle' }); return visible(p, 'main h1'); } },
  { name: 'fazione (Akatsuki)', viewports: PHONE_DESKTOP,
    run: async (p) => { await p.goto(BASE + '/en/naruto/factions/akatsuki', { waitUntil: 'networkidle' }); return visible(p, 'main h1'); } },
  { name: 'timeline Naruto', viewports: PHONE_DESKTOP,
    run: async (p) => { await p.goto(BASE + '/en/naruto/timeline', { waitUntil: 'networkidle' }); return visible(p, 'li[id^="event-"]'); } },
  { name: 'archivio personaggi', viewports: ALL,
    run: async (p) => { await p.goto(BASE + '/en/naruto/characters', { waitUntil: 'networkidle' }); return visible(p, 'main ul li a[href*="/characters/"]'); } },
  { name: 'modale personaggio', viewports: PHONE_DESKTOP,
    run: async (p) => {
      await p.goto(BASE + '/en/naruto/characters', { waitUntil: 'networkidle' });
      await p.locator('main ul li a[href*="/characters/"]').first().click();
      return visible(p, '[role="dialog"][aria-modal="true"], [role="dialog"]:has(h2)');
    } },
  { name: 'mappa Naruto', viewports: ALL, run: (p) => openMap(p, '/en/naruto/map') },
  { name: 'mappa One Piece', viewports: PHONE_DESKTOP, run: (p) => openMap(p, '/en/one-piece/map') },
  { name: 'guida della mappa aperta', viewports: PHONE_DESKTOP,
    run: async (p) => {
      if (!(await openMap(p, '/en/black-clover/map'))) return false;
      await p.locator('details > summary').first().click();
      return p.evaluate(() => !!document.querySelector('details[open]'));
    } },
  { name: 'scheda luogo (pin)', viewports: PHONE_DESKTOP,
    run: async (p) => {
      if (!(await openMap(p, '/en/naruto/map'))) return false;
      // Primo pin visibile (su mobile Konoha può essere dentro un cluster); il click
      // è inviato al contenuto del pin, che lo propaga a React Flow.
      await p.locator('.react-flow__node-map-node .pointer-events-auto').first().dispatchEvent('click');
      return visible(p, '[role="dialog"]:has([role="tablist"])');
    } },
  { name: 'drawer filtri', viewports: PHONE_DESKTOP,
    run: async (p) => {
      if (!(await openMap(p, '/en/naruto/map'))) return false;
      await p.getByRole('button', { name: /^filters$/i }).first().click();
      return visible(p, 'aside[role="dialog"]:not([inert])');
    } },
  { name: 'drawer livelli', viewports: PHONE_DESKTOP,
    run: async (p) => {
      if (!(await openMap(p, '/en/naruto/map'))) return false;
      await p.getByRole('button', { name: /^layers$/i }).first().click();
      return visible(p, 'aside[role="dialog"]:not([inert])');
    } },
  { name: 'pannelli mappa (legenda, percorsi, timeline)', viewports: ['d1366'],
    run: async (p) => {
      if (!(await openMap(p, '/en/naruto/map'))) return false;
      for (const name of [/^legend$/i, /^routes$/i, /^timeline$/i]) await p.getByRole('button', { name }).first().click();
      await p.waitForTimeout(400);
      return p.evaluate(() => document.querySelectorAll('[aria-expanded="true"]').length >= 3);
    } },
  ...[['Dragon Ball', '/en/dragon-ball/map'], ['One Piece', '/en/one-piece/map']].map(([world, path]) => ({
    name: `pannelli mappa ${world}`, viewports: ['d1366'],
    run: async (p) => {
      if (!(await openMap(p, path))) return false;
      for (const name of [/^legend$/i, /^routes$/i, /^timeline$/i]) await p.getByRole('button', { name }).first().click();
      await p.waitForTimeout(400);
      return p.evaluate(() => document.querySelectorAll('[aria-expanded="true"]').length >= 3);
    },
  })),
  { name: 'scheda luogo su One Piece (pin)', viewports: ['d1366'],
    run: async (p) => {
      if (!(await openMap(p, '/en/one-piece/map'))) return false;
      await p.locator('.react-flow__node-map-node .pointer-events-auto').first().dispatchEvent('click');
      return visible(p, '[role="dialog"]:has([role="tablist"])');
    } },
  { name: 'filtri attivi (chip ember e accent)', viewports: PHONE_DESKTOP,
    run: async (p) => {
      if (!(await openMap(p, '/en/naruto/map'))) return false;
      await p.getByRole('button', { name: /^filters$/i }).first().click();
      if (!(await visible(p, 'aside[role="dialog"]:not([inert])'))) return false;
      // Apre tutte le sezioni e attiva un chip ogni 6 (archi, importanza, tipi…).
      await p.evaluate(() => { for (const b of document.querySelectorAll('aside[role="dialog"]:not([inert]) button[aria-expanded="false"]')) b.click(); });
      await p.waitForTimeout(300);
      await p.evaluate(() => { [...document.querySelectorAll('aside[role="dialog"]:not([inert]) button[aria-pressed="false"]')].forEach((b, i) => { if (i % 6 === 0) b.click(); }); });
      await p.waitForTimeout(300);
      return p.evaluate(() => document.querySelectorAll('aside[role="dialog"]:not([inert]) button[aria-pressed="true"]').length > 1);
    } },
  { name: 'barra dei filtri attivi sulla mappa', viewports: PHONE_DESKTOP,
    run: async (p) => {
      if (!(await openMap(p, '/en/naruto/map'))) return false;
      await p.getByRole('button', { name: /^filters$/i }).first().click();
      if (!(await visible(p, 'aside[role="dialog"]:not([inert])'))) return false;
      await p.evaluate(() => { for (const b of document.querySelectorAll('aside[role="dialog"]:not([inert]) button[aria-expanded="false"]')) b.click(); });
      await p.evaluate(() => document.querySelector('aside[role="dialog"]:not([inert]) button[aria-pressed="false"]')?.click());
      await p.keyboard.press('Escape');
      return visible(p, '[role="region"] button:has-text("Clear all")');
    } },
  { name: 'legenda con filtro per tipo', viewports: ['d1366'],
    run: async (p) => {
      if (!(await openMap(p, '/en/naruto/map'))) return false;
      await p.getByRole('button', { name: /^legend$/i }).first().click();
      const row = p.locator('section[aria-label="Legend"] button[aria-pressed="false"]').first();
      await row.click();
      return (await p.locator('section[aria-label="Legend"] button[aria-pressed="true"]').count()) === 1;
    } },
  { name: 'percorso: stepper avanzato', viewports: PHONE_DESKTOP,
    run: async (p) => {
      if (!(await openMap(p, '/en/naruto/map?route=route-team7-waves'))) return false;
      if (!(await visible(p, '[role="dialog"]'))) return false;
      // Nome esatto: i drawer chiusi (inert) sono anch'essi role="dialog".
      const next = p.getByRole('button', { name: 'Next step', exact: true });
      for (let i = 0; i < 2; i++) await next.click();
      await p.waitForTimeout(400);
      return visible(p, '[role="dialog"] li:has-text("✓")');
    } },
  { name: 'modalità storia', viewports: PHONE_DESKTOP,
    run: async (p) => {
      if (!(await openMap(p, '/en/naruto/map?arc=arc-prologue'))) return false;
      if (!(await visible(p, '[role="dialog"]'))) return false;
      await p.getByRole('button', { name: /guided story/i }).first().click();
      await p.waitForTimeout(600);
      return visible(p, '[role="progressbar"]');
    } },
  { name: 'scheda luogo (tutte le tab)', viewports: ['d1366'],
    run: async (p) => (await openMap(p, '/en/naruto/map?location=loc-konoha')) && visible(p, '[role="dialog"] [role="tab"]'),
    states: async (p) => {
      const tabs = p.locator('[role="dialog"] [role="tab"]');
      const n = await tabs.count();
      const out = [];
      for (let i = 1; i < n; i++) {
        const label = ((await tabs.nth(i).textContent()) || `tab ${i}`).replace(/\s+/g, ' ').trim();
        out.push({ label, act: async () => { await tabs.nth(i).click(); return (await tabs.nth(i).getAttribute('aria-selected')) === 'true'; } });
      }
      return out;
    } },
  { name: 'ricerca aperta (con risultati)', viewports: PHONE_DESKTOP,
    run: async (p) => {
      await p.goto(BASE + '/en/naruto', { waitUntil: 'networkidle' });
      await p.getByRole('button', { name: /search/i }).first().click();
      const input = p.getByRole('combobox').first();
      await input.waitFor({ state: 'visible', timeout: 8_000 });
      await input.fill('ita');
      return visible(p, '[role="listbox"] [role="option"]');
    } },
  { name: 'menu lingua aperto', viewports: PHONE_DESKTOP,
    run: async (p) => {
      await p.goto(BASE + '/en', { waitUntil: 'networkidle' });
      await p.getByRole('button', { name: /change language/i }).first().click();
      return visible(p, '[role="listbox"] [role="option"], [role="menu"] [role="menuitemradio"], [role="option"]');
    } },
  { name: 'selettore anime aperto', viewports: ['d1366'],
    run: async (p) => {
      await p.goto(BASE + '/en/naruto', { waitUntil: 'networkidle' });
      await p.getByRole('button', { name: /switch world/i }).first().click();
      return visible(p, '[role="menu"] [role="menuitem"]');
    } },
  { name: 'menu "More" aperto (1180 px)', viewports: ['d1180'],
    run: async (p) => {
      await p.goto(BASE + '/en/one-piece/arcs', { waitUntil: 'networkidle' });
      const more = p.locator('.wt-more').first();
      await more.click();
      const id = await more.getAttribute('aria-controls');
      return (await more.getAttribute('aria-expanded')) === 'true' && visible(p, `[id="${id}"] a:visible`);
    } },
  { name: 'menu mobile aperto', viewports: ['m390'],
    run: async (p) => {
      await p.goto(BASE + '/en/naruto', { waitUntil: 'networkidle' });
      await p.getByRole('button', { name: /open world navigation/i }).first().click();
      return visible(p, '#mobile-world-nav a');
    } },
];
VIEWPORTS.d1180 = { width: 1180, height: 800, isMobile: false, hasTouch: false };

/** Eseguito nella pagina: valuta i testi visibili nella viewport corrente. */
function scanVisibleText(opts) {
  const seen = (window.__contrastSeen ??= new WeakSet());
  const out = (window.__contrastOut ??= []);
  const parse = (s) => {
    const m = s && s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (top, bottom) => {
    const a = top.a + bottom.a * (1 - top.a);
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    const c = (k) => (top[k] * top.a + bottom[k] * bottom.a * (1 - top.a)) / a;
    return { r: c('r'), g: c('g'), b: c('b'), a };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (x, y) => { const [a, b] = [lum(x), lum(y)].sort((m, n) => n - m); return (a + 0.05) / (b + 0.05); };
  const hex = ({ r, g, b }) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const opacityOf = (el) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= Number(getComputedStyle(e).opacity); return o; };
  const label = (el) => {
    const cls = (el.getAttribute('class') || '').split(/\s+/).filter((c) => /^(text-|bg-|opacity|placeholder)/.test(c)).join(' ');
    const host = el.closest('[data-component],[aria-label],nav,header,footer,aside,[role="dialog"],main,section');
    return `${el.tagName.toLowerCase()}${cls ? '.' + cls.replace(/\s+/g, '.') : ''} in ${host ? host.tagName.toLowerCase() + (host.getAttribute('aria-label') ? `[${host.getAttribute('aria-label')}]` : '') : 'body'}`;
  };
  const vw = innerWidth, vh = innerHeight;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.nodeValue.trim();
    if (!text) continue;
    const el = n.parentElement;
    if (!el || seen.has(el) || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TITLE'].includes(el.tagName)) continue;
    if (opts.focusOnly && el !== document.activeElement && !el.contains(document.activeElement) && !document.activeElement?.contains(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility !== 'visible' || cs.display === 'none') continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    const raw = [...range.getClientRects()].find((r) => r.width > 1 && r.height > 1);
    if (!raw) continue;
    // Parte VISIBILE del testo: intersezione con la viewport e con i ritagli
    // (overflow ≠ visible) degli antenati — es. le card fuori dalla striscia
    // scorrevole della timeline non sono visibili anche se il loro box è in viewport.
    let [l, t, r, b] = [raw.left, raw.top, raw.right, raw.bottom];
    for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const acs = getComputedStyle(a);
      if (acs.overflowX !== 'visible' || acs.overflowY !== 'visible') {
        const ar = a.getBoundingClientRect();
        if (acs.overflowX !== 'visible') { l = Math.max(l, ar.left); r = Math.min(r, ar.right); }
        if (acs.overflowY !== 'visible') { t = Math.max(t, ar.top); b = Math.min(b, ar.bottom); }
      }
    }
    l = Math.max(l, 0); t = Math.max(t, 0); r = Math.min(r, vw); b = Math.min(b, vh);
    if (r - l < 2 || b - t < 2) continue; // non visibile qui (fuori viewport o ritagliato)
    const rect = { left: l, top: t, right: r, bottom: b, width: r - l, height: b - t };
    const x = Math.min(Math.max(rect.left + Math.min(rect.width / 2, 6), 0), vw - 1);
    const y = Math.min(Math.max(rect.top + rect.height / 2, 0), vh - 1);
    if (rect.bottom < 0 || rect.top > vh || rect.right < 0 || rect.left > vw) continue; // fuori viewport: prossimo passaggio
    if (rect.width * rect.height < 4) continue;
    // Testo nascosto con clip (sr-only) o tagliato a 1px.
    if (cs.clip === 'rect(0px, 0px, 0px, 0px)' || (el.offsetWidth <= 1 && el.offsetHeight <= 1)) continue;
    const opacity = opacityOf(el);
    if (opacity < 0.01) continue;
    const stack = document.elementsFromPoint(x, y);
    const idx = stack.findIndex((e) => e === el || el.contains(e) || e.contains(el));
    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    // Solo simboli (ⓘ ⤢ → ✓…): componente grafico, soglia 3:1 (WCAG 1.4.11).
    const symbol = /^[\p{S}\s]+$/u.test(text); // ⓘ ⤢ → ✓ (simboli), non la punteggiatura ( · / —
    const need = large || symbol ? 3 : 4.5;
    const rec = { scenario: opts.scenario, viewport: opts.viewport, text: text.slice(0, 60), where: label(el), size: Math.round(size * 10) / 10, weight, need };
    if (idx < 0 || stack.slice(0, idx).some((e) => !el.contains(e) && !e.contains(el) && (parse(getComputedStyle(e).backgroundColor)?.a ?? 0) > 0.6)) {
      // Coperto (es. da un overlay): NON segnato come visto, si riprova al prossimo passaggio.
      continue;
    }
    seen.add(el);
    if (symbol) rec.symbol = true;
    if (el.closest('[aria-hidden="true"]')) rec.exempt = 'aria-hidden (decorativo)';
    else if (el.closest('[role="img"]')) rec.exempt = 'testo dentro un\'immagine (role="img")';
    // NON CONFORMITÀ NOTA (non un'esenzione WCAG: i pin restano cliccabili): in
    // modalità focus la mappa attenua al 40 % i pin non collegati alla selezione.
    // È una scelta di design aperta (UX-02): riportata a parte e contata, non
    // blocca l'audit; qualunque altro testo sotto soglia lo blocca.
    else if (el.closest('.react-flow__node-map-node, .react-flow__node-map-cluster') && opacity <= 0.41) rec.known = 'pin attenuato dalla modalità focus';
    else if (el.closest(':disabled, [aria-disabled="true"]')) rec.exempt = 'controllo disabilitato';
    // Sfondo: elementi sotto il testo, dall'alto, fino al primo opaco. Ogni
    // livello è un colore pieno (con alpha) e/o un gradiente (tutti i suoi stop).
    // Se sotto c'è un contenuto ignoto (immagine, canvas, SVG della mappa) si
    // valutano i due estremi possibili, nero e bianco: il risultato è un INTERVALLO.
    const layers = [];
    let unknown = null;
    for (const e of stack.slice(idx)) {
      const foreign = e !== el && !e.contains(el);
      if (foreign && ['IMG', 'CANVAS', 'VIDEO'].includes(e.tagName)) { unknown = `${e.tagName.toLowerCase()} sotto il testo`; break; }
      if (foreign && e instanceof SVGElement) { unknown = 'svg sotto il testo'; break; }
      const ecs = getComputedStyle(e);
      const op = opacityOf(e);
      const solid = parse(ecs.backgroundColor);
      const layer = {};
      if (solid && solid.a > 0) layer.solid = { ...solid, a: solid.a * op };
      const bi = ecs.backgroundImage;
      if (bi && bi !== 'none') {
        if (/url\(/.test(bi)) { if (layer.solid) layers.push(layer); unknown = `immagine di sfondo su ${e.tagName.toLowerCase()}`; break; }
        layer.stops = (bi.match(/rgba?\([^)]*\)/g) || []).map(parse).filter(Boolean).map((c) => ({ ...c, a: c.a * op }));
      }
      if (layer.solid || layer.stops) layers.push(layer);
      if (layer.solid && layer.solid.a >= 0.999) break;
    }
    const last = layers.at(-1);
    let cands;
    if (last && last.solid && last.solid.a >= 0.999) {
      const base = { ...last.solid, a: 1 };
      cands = last.stops?.length ? last.stops.map((st) => over(st, base)) : [base];
      layers.pop();
    } else if (unknown) {
      cands = [{ r: 0, g: 0, b: 0, a: 1 }, { r: 255, g: 255, b: 255, a: 1 }];
    } else {
      cands = [{ r: 255, g: 255, b: 255, a: 1 }]; // nessuno sfondo: bianco del browser
    }
    for (const layer of layers.reverse()) {
      cands = cands.flatMap((c) => {
        const b = layer.solid ? over(layer.solid, c) : c;
        return layer.stops?.length ? layer.stops.map((st) => over(st, b)) : [b];
      });
      if (cands.length > 32) cands = cands.slice(0, 32);
    }
    const isSvgText = el instanceof SVGElement;
    const fgRaw = parse(isSvgText ? cs.fill : cs.color);
    if (!fgRaw) { rec.status = 'da verificare'; rec.reason = `colore non rgb: ${isSvgText ? cs.fill : cs.color}`; out.push(rec); continue; }
    const fg = { ...fgRaw, a: fgRaw.a * opacity };
    rec.fg = hex(fgRaw) + (fg.a < 0.999 ? ` @${fg.a.toFixed(2)}` : '');
    const ratios = cands.map((c) => ratio(over(fg, c), c));
    const worst = Math.min(...ratios), best = Math.max(...ratios);
    const worstBg = cands[ratios.indexOf(worst)];
    rec.bg = hex(worstBg) + (cands.length > 1 ? ` (${cands.length} casi${unknown ? ', ' + unknown : ', gradiente'})` : '');
    rec.ratio = Math.round(worst * 100) / 100;
    rec.ratioBest = Math.round(best * 100) / 100;
    if (isSvgText && cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0) { rec.status = rec.exempt ? 'esente' : 'da verificare'; rec.reason = 'testo SVG con alone (stroke)'; out.push(rec); continue; }
    if (rec.exempt) rec.status = 'esente';
    else if (rec.known && worst < need) rec.status = 'non conformità nota';
    else if (worst >= need) rec.status = 'ok';
    else if (best < need) rec.status = 'insufficiente';
    else {
      rec.status = 'da verificare';
      rec.reason = unknown ?? 'gradiente che attraversa la soglia';
      // Campionamento dei pixel reali (vedi samplePixels): rettangolo del testo + colore.
      el.setAttribute('data-contrast-sample', JSON.stringify({ i: out.length, rect: [rect.left, rect.top, rect.width, rect.height], fg }));
    }
    out.push(rec);
  }
  return out.length;
}

/**
 * Testi con sfondo indeterminabile (immagine/SVG/gradiente sotto un pannello
 * semitrasparente): si nasconde il testo, si fotografa il suo rettangolo e si
 * misura il contrasto contro i pixel reali dello sfondo (sfocatura compresa).
 * Si usa il 10° percentile dei rapporti, così pochi pixel anomali (un'icona
 * vicina) non decidono l'esito.
 */
async function samplePixels(page) {
  const items = await page.evaluate(() =>
    [...document.querySelectorAll('[data-contrast-sample]')].map((el, k) => {
      el.setAttribute('data-contrast-k', String(k));
      return { k, ...JSON.parse(el.getAttribute('data-contrast-sample')) };
    }),
  );
  const results = [];
  const vp = page.viewportSize();
  for (const it of items) {
    const [x, y, w, h] = it.rect;
    const clip = { x: Math.max(0, x), y: Math.max(0, y), width: Math.min(w, vp.width - Math.max(0, x)), height: Math.min(h, vp.height - Math.max(0, y)) };
    if (clip.width < 2 || clip.height < 2) continue;
    await page.evaluate((k) => {
      const el = document.querySelector(`[data-contrast-k="${k}"]`);
      for (const [prop, val] of [['color', 'transparent'], ['-webkit-text-fill-color', 'transparent'], ['fill', 'transparent'], ['stroke', 'transparent'], ['text-shadow', 'none']]) el.style.setProperty(prop, val, 'important');
    }, it.k);
    const png = PNG.sync.read(await page.screenshot({ clip, animations: 'disabled', caret: 'hide' }));
    await page.evaluate((k) => {
      const el = document.querySelector(`[data-contrast-k="${k}"]`);
      for (const prop of ['color', '-webkit-text-fill-color', 'fill', 'stroke', 'text-shadow']) el.style.removeProperty(prop);
      el.removeAttribute('data-contrast-sample');
      el.removeAttribute('data-contrast-k');
    }, it.k);
    const lum = (r, g, b) => {
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratios = [];
    let worstBg = null, worst = Infinity;
    const fg = it.fg;
    for (let i = 0; i < png.data.length; i += 4) {
      const [r, g, b] = [png.data[i], png.data[i + 1], png.data[i + 2]];
      const fr = fg.r * fg.a + r * (1 - fg.a), fgG = fg.g * fg.a + g * (1 - fg.a), fb = fg.b * fg.a + b * (1 - fg.a);
      const [l1, l2] = [lum(fr, fgG, fb), lum(r, g, b)].sort((m, n) => n - m);
      const q = (l1 + 0.05) / (l2 + 0.05);
      ratios.push(q);
      if (q < worst) { worst = q; worstBg = [r, g, b]; }
    }
    ratios.sort((a, b) => a - b);
    results.push({ i: it.i, p10: ratios[Math.floor(ratios.length * 0.1)], min: worst, worstBg });
  }
  return results;
}

async function scanScenario(page, scenario, viewport) {
  await page.evaluate(() => { window.__contrastSeen = new WeakSet(); window.__contrastOut = []; });
  const opts = { scenario: scenario.name, viewport, focusOnly: !!scenario.focusOnly };
  // elementsFromPoint ignora gli elementi con pointer-events:none (nodi React Flow,
  // overlay della mappa): durante la scansione li rende "colpibili", poi ripristina.
  await page.addStyleTag({ content: '*{pointer-events:auto !important}' }).then((h) => h.evaluate((n) => n.setAttribute('data-contrast-scan', '')));
  // Contenitori scorrevoli: la pagina (scrollingElement) e <main> (overflow:auto).
  const scrollers = ['main#main-content', null];
  const resolve = async () => {
    for (const s of await samplePixels(page)) {
      await page.evaluate(({ i, p10, min, worstBg }) => {
        const r = window.__contrastOut[i];
        r.sampled = Math.round(p10 * 100) / 100;
        r.sampledMin = Math.round(min * 100) / 100;
        r.bg = '#' + worstBg.map((v) => v.toString(16).padStart(2, '0')).join('') + ' (pixel reali)';
        r.ratio = r.sampled;
        r.status = r.exempt ? 'esente' : p10 >= r.need ? 'ok' : 'insufficiente';
        r.reason = (r.reason ?? '') + ' → campionato dai pixel';
      }, s);
    }
  };
  await page.evaluate(scanVisibleText, opts);
  await resolve();
  if (!scenario.focusOnly) {
    // Contenitori interni scorrevoli e visibili (drawer, corpo delle schede, liste dei pannelli).
    const inner = await page.evaluate(() => {
      let n = 0;
      for (const e of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(e);
        if (!/(auto|scroll)/.test(cs.overflowY) || e.scrollHeight <= e.clientHeight + 2 || e.id === 'main-content') continue;
        const r = e.getBoundingClientRect();
        if (r.width < 40 || r.height < 40 || cs.visibility !== 'visible' || e.closest('[inert]')) continue;
        e.setAttribute('data-contrast-scroller', String(n++));
        if (n >= 12) break;
      }
      return n;
    });
    for (let k = 0; k < inner; k++) scrollers.push(`[data-contrast-scroller="${k}"]`);
    for (const sel of scrollers) {
      for (let i = 0; i < 40; i++) {
        const moved = await page.evaluate((s) => {
          const el = s ? document.querySelector(s) : document.scrollingElement;
          if (!el || el.scrollHeight <= el.clientHeight + 2) return false;
          const before = el.scrollTop;
          el.scrollTop = before + el.clientHeight * 0.85;
          return el.scrollTop !== before;
        }, sel);
        if (!moved) break;
        await page.waitForTimeout(60);
        await page.evaluate(scanVisibleText, opts);
        await resolve();
      }
    }
  }
  await page.evaluate(() => document.querySelector('style[data-contrast-scan]')?.remove());
  return page.evaluate(() => window.__contrastOut);
}

async function runAxe(page) {
  await page.evaluate(AXE);
  return page.evaluate((tags) => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }).then((r) => ({
    violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes[0]?.target?.join(' ') ?? '' })),
    incomplete: r.incomplete.map((v) => ({ id: v.id, n: v.nodes.length })),
  })), AXE_TAGS);
}

const exe = process.env.PW_CHROME;
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const report = { scenarios: [], records: [] };
for (const scenario of SCENARIOS) {
  for (const vpName of scenario.viewports) {
    const vp = VIEWPORTS[vpName];
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch });
    await ctx.addInitScript(scenario.init ?? consentScript);
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const entry = { scenario: scenario.name, viewport: vpName, executed: false };
    try {
      entry.executed = await scenario.run(page);
      if (entry.executed) {
        await page.waitForTimeout(300);
        let recs = await scanScenario(page, scenario, vpName);
        // Stati successivi dello stesso scenario (es. ogni tab di una scheda).
        for (const st of scenario.states ? await scenario.states(page) : []) {
          if (!(await st.act())) { entry.executed = false; entry.error = `stato "${st.label}" non raggiunto`; break; }
          await page.waitForTimeout(250);
          recs = recs.concat(await scanScenario(page, { ...scenario, name: `${scenario.name} › ${st.label}` }, vpName));
        }
        report.records.push(...recs);
        const by = (s) => recs.filter((r) => r.status === s).length;
        Object.assign(entry, { checked: recs.filter((r) => r.status !== 'coperto').length, ok: by('ok'), fail: by('insufficiente'), incomplete: by('da verificare'), exempt: by('esente'), known: by('non conformità nota') });
        const axe = await runAxe(page);
        entry.axeViolations = axe.violations;
        entry.axeIncomplete = axe.incomplete;
      } else entry.error = 'stato richiesto non raggiunto';
    } catch (e) {
      entry.error = e.message.split('\n')[0];
    }
    entry.pageErrors = errors.length;
    report.scenarios.push(entry);
    await ctx.close();
    const tag = !entry.executed ? `NON ESEGUITO (${entry.error})` : `${entry.checked} testi · ${entry.fail} insufficienti · ${entry.incomplete} da verificare · axe ${entry.axeViolations.map((v) => `${v.id}(${v.n})`).join(',') || 'ok'}`;
    const axeContrast = (entry.axeViolations ?? []).some((v) => v.id === 'color-contrast');
    console.log(`${entry.executed && !entry.fail && !axeContrast ? '✓' : '✗'} ${scenario.name} @${vpName}: ${tag}${entry.known ? ` · ${entry.known} non conformità note` : ''}`);
  }
}
await browser.close();

const fails = report.records.filter((r) => r.status === 'insufficiente');
const incomplete = report.records.filter((r) => r.status === 'da verificare');
const group = (rows) => {
  const m = new Map();
  for (const r of rows) {
    const k = `${r.where} · ${r.fg} su ${r.bg ?? '?'}${r.ratio ? ` = ${r.ratio}:1 (serve ${r.need}:1)` : ` · ${r.reason}`}`;
    if (!m.has(k)) m.set(k, { n: 0, sample: r.text, scenarios: new Set() });
    const g = m.get(k); g.n++; g.scenarios.add(`${r.scenario}@${r.viewport}`);
  }
  return [...m.entries()].sort((a, b) => b[1].n - a[1].n);
};
console.log(`\n=== Contrasti insufficienti certi: ${fails.length} testi (${group(fails).length} combinazioni) ===`);
for (const [k, g] of group(fails)) console.log(`- ${g.n}× ${k}\n    es. "${g.sample}" · ${[...g.scenarios].slice(0, 4).join(', ')}${g.scenarios.size > 4 ? '…' : ''}`);
console.log(`\n=== Da verificare a mano (sfondo non determinabile): ${incomplete.length} testi ===`);
for (const [k, g] of group(incomplete).slice(0, 15)) console.log(`- ${g.n}× ${k} · es. "${g.sample}"`);
const known = report.records.filter((r) => r.status === 'non conformità nota');
console.log(`\n=== Non conformità note (WCAG 1.4.3, decisione di design aperta, non bloccanti): ${known.length} testi ===`);
for (const [k, g] of group(known)) console.log(`- ${g.n}× ${k} · es. "${g.sample}"`);
const notRun = report.scenarios.filter((s) => !s.executed);
const axeV = report.scenarios.flatMap((s) => (s.axeViolations ?? []).map((v) => `${v.id} in ${s.scenario}@${s.viewport}`));
const axeContrastV = axeV.filter((v) => v.startsWith('color-contrast '));
const axeIncomplete = {};
for (const s of report.scenarios) for (const v of s.axeIncomplete ?? []) axeIncomplete[v.id] = (axeIncomplete[v.id] ?? 0) + v.n;
const checked = report.records.filter((r) => r.status !== 'coperto').length;
console.log(`\n=== Riepilogo ===
scenari: ${report.scenarios.length} · eseguiti ${report.scenarios.length - notRun.length} · NON eseguiti ${notRun.length}
testi controllati: ${checked} · ok ${report.records.filter((r) => r.status === 'ok').length} · insufficienti ${fails.length} · da verificare ${incomplete.length} · esenti ${report.records.filter((r) => r.status === 'esente').length} · non conformità note ${known.length}
axe: violazioni ${axeV.length} (color-contrast ${axeContrastV.length})${axeV.length ? ' → ' + [...new Set(axeV.map((v) => v.split(' in ')[0]))].map((id) => `${id}×${axeV.filter((v) => v.startsWith(id + ' ')).length}`).join(', ') : ''} · incomplete (axe non decide) ${JSON.stringify(axeIncomplete)}
(le violazioni axe diverse dal contrasto sono riportate, non fanno fallire questo controllo: vedi \`npm run audit:a11y\`)`);
for (const s of notRun) console.log(`  NON ESEGUITO: ${s.scenario}@${s.viewport} — ${s.error}`);
if (process.env.CONTRAST_JSON) writeFileSync(process.env.CONTRAST_JSON, JSON.stringify(report, null, 1));
process.exit(fails.length || incomplete.length || axeContrastV.length || notRun.length ? 1 : 0);
