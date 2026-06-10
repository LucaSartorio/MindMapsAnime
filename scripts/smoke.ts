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
}

const CHECKS: Check[] = [
  { path: '/', anyOf: ['Mappe Interattive', 'Interactive Maps'], selector: 'a[href^="/worlds/"]', minCount: 5 },
  { path: '/worlds/naruto', anyOf: ['Naruto'], selector: '.react-flow__node', minCount: 10 },
  { path: '/worlds/onepiece', anyOf: ['One Piece'], selector: '.react-flow__node', minCount: 10 },
  { path: '/worlds/hunterxhunter', anyOf: ['Hunter'], selector: '.react-flow__node', minCount: 5 },
  { path: '/worlds/naruto/characters', anyOf: ['Naruto'], selector: 'input[type=search]', minCount: 1 },
  { path: '/worlds/onepiece/characters', anyOf: ['One Piece'], selector: 'input[type=search]', minCount: 1 },
  { path: '/worlds/hunterxhunter/jutsu', anyOf: ['Nen'], selector: 'input[type=search]', minCount: 1 },
  { path: '/about', anyOf: ['Mappe Interattive', 'Interactive Maps'] },
];

async function main() {
  const preview: ChildProcess = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort'],
    { stdio: 'ignore' },
  );

  let failures = 0;
  const consoleErrors: string[] = [];

  try {
    await waitForServer(BASE);
    const browser = await launchBrowser();
    const page = await browser.newPage();
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
      const newErrors = consoleErrors.length - before;
      if (newErrors > 0) {
        ok = false;
        detail += ` (${newErrors} errori console)`;
      }
      if (!ok) failures += 1;
      console.log(`${ok ? '✓' : '✗'} ${check.path}${detail}`);
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
