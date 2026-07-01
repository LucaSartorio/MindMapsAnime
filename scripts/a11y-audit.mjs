import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';

// Audit a11y automatico (WCAG 2.2 A/AA) con axe-core su tutte le pagine/stati.
// Uso: avvia `npm run preview` in un terminale, poi `npm run audit:a11y`.
// Variabili: BASE (url del preview), PW_CHROME (path eseguibile Chromium).
const AXE = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const BASE = process.env.BASE || 'http://localhost:4173';
const EXE =
  process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function runAxe(page) {
  await page.evaluate(AXE);
  return page.evaluate(
    (tags) =>
      // eslint-disable-next-line no-undef
      window.axe
        .run(document, { runOnly: { type: 'tag', values: tags } })
        .then((r) =>
          r.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            n: v.nodes.length,
            sample: v.nodes[0]?.target?.join(' ') ?? '',
            sampleHtml: (v.nodes[0]?.html ?? '').slice(0, 120),
          })),
        ),
    TAGS,
  );
}

async function accept(page, re) {
  const b = page.getByRole('button', { name: re });
  if (await b.count()) {
    await b.first().click().catch(() => {});
    await page.waitForTimeout(250);
  }
}

const scenarios = [
  { name: 'home (cookie banner)', go: async (p) => { await p.goto(BASE + '/'); await p.waitForTimeout(700); } },
  { name: 'home (accepted)', go: async (p) => { await p.goto(BASE + '/'); await p.waitForTimeout(500); await accept(p, /accetta tutti|accept all/i); } },
  { name: 'about', go: async (p) => { await p.goto(BASE + '/about'); await accept(p, /accetta tutti|accept all/i); } },
  { name: 'privacy', go: async (p) => { await p.goto(BASE + '/privacy'); await accept(p, /accetta tutti|accept all/i); } },
  { name: 'cookie-policy', go: async (p) => { await p.goto(BASE + '/cookie-policy'); await accept(p, /accetta tutti|accept all/i); } },
  { name: 'supporta', go: async (p) => { await p.goto(BASE + '/supporta'); await accept(p, /accetta tutti|accept all/i); } },
  { name: 'map (naruto)', go: async (p) => { await p.goto(BASE + '/worlds/naruto'); await p.waitForTimeout(700); await accept(p, /accetta tutti|accept all/i); await accept(p, /start exploring|inizia|esplora/i); await p.waitForTimeout(400); } },
  { name: 'filters drawer', go: async (p) => { await p.goto(BASE + '/worlds/naruto'); await p.waitForTimeout(700); await accept(p, /accetta tutti|accept all/i); await accept(p, /start exploring|inizia|esplora/i); await p.getByRole('button', { name: /apri filtri mappa|open map filters/i }).first().click().catch(()=>{}); await p.waitForTimeout(400); const chip = p.locator('aside[role="dialog"] button[aria-pressed="false"]'); if (await chip.count()) await chip.first().click().catch(()=>{}); await p.waitForTimeout(300); } },
  { name: 'characters', go: async (p) => { await p.goto(BASE + '/worlds/naruto/characters'); await accept(p, /accetta tutti|accept all/i); await p.waitForTimeout(400); } },
  { name: 'clans', go: async (p) => { await p.goto(BASE + '/worlds/onepiece/clans'); await accept(p, /accetta tutti|accept all/i); await p.waitForTimeout(400); } },
  { name: 'jutsu', go: async (p) => { await p.goto(BASE + '/worlds/onepiece/jutsu'); await accept(p, /accetta tutti|accept all/i); await p.waitForTimeout(400); } },
  { name: 'arcs', go: async (p) => { await p.goto(BASE + '/worlds/naruto/arcs'); await accept(p, /accetta tutti|accept all/i); await p.waitForTimeout(400); } },
  { name: 'cookie preferences modal', go: async (p) => { await p.goto(BASE + '/'); await p.waitForTimeout(500); await accept(p, /personalizza|customize/i); await p.waitForTimeout(400); } },
  { name: 'report modal', go: async (p) => { await p.goto(BASE + '/worlds/naruto'); await p.waitForTimeout(600); await accept(p, /accetta tutti|accept all/i); await accept(p, /start exploring|inizia|esplora/i); const burger = p.getByRole('button', { name: /navigazione|navigation/i }); await burger.first().click().catch(()=>{}); await p.waitForTimeout(200); await p.getByText(/Report|Segnala/).last().click().catch(()=>{}); await p.waitForTimeout(500); } },
  { name: 'character modal', go: async (p) => { await p.goto(BASE + '/worlds/naruto/characters'); await accept(p, /accetta tutti|accept all/i); await p.waitForTimeout(500); const card = p.locator('main button').filter({ hasText: /.{2,}/ }); await card.first().click().catch(()=>{}); await p.waitForTimeout(500); } },
  { name: 'language menu open', go: async (p) => { await p.goto(BASE + '/'); await accept(p, /accetta tutti|accept all/i); await p.getByRole('button', { name: /cambia lingua|change language/i }).first().click().catch(()=>{}); await p.waitForTimeout(200); } },
  { name: 'search overlay open', go: async (p) => { await p.goto(BASE + '/worlds/naruto'); await p.waitForTimeout(600); await accept(p, /accetta tutti|accept all/i); await accept(p, /start exploring|inizia|esplora/i); await p.getByRole('button', { name: /cerca|search/i }).first().click().catch(()=>{}); await p.waitForTimeout(300); } },
];

const b = await chromium.launch({ executablePath: EXE });
const agg = new Map();
for (const s of scenarios) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await s.go(p);
    const v = await runAxe(p);
    const ids = v.map((x) => `${x.id}(${x.n})`).join(', ') || 'clean';
    console.log(`\n## ${s.name}: ${ids}`);
    for (const x of v) {
      console.log(`   - [${x.impact}] ${x.id}: ${x.help} | e.g. ${x.sample} :: ${x.sampleHtml}`);
      const k = x.id;
      if (!agg.has(k)) agg.set(k, { impact: x.impact, help: x.help, scenarios: new Set() });
      agg.get(k).scenarios.add(s.name);
    }
  } catch (e) {
    console.log(`\n## ${s.name}: ERROR ${e.message}`);
  }
  await p.close();
}
console.log('\n\n===== AGGREGATO violazioni uniche =====');
if (agg.size === 0) console.log('NESSUNA VIOLAZIONE 🎉');
for (const [id, d] of agg) console.log(`- [${d.impact}] ${id} — ${d.help} (in: ${[...d.scenarios].join(', ')})`);
await b.close();
