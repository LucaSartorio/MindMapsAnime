/**
 * Shared Playwright helpers for the 3D explorer checks (`scripts/test-3d.ts`) and a lab CLI:
 *
 *   npm run benchmark:3d:lab            # needs a built dist/ (npm run build)
 *
 * For each ordinary page it records, in Chromium headless on this machine: every network request (to prove that no
 * 3D chunk is fetched), transferred bytes, LCP, CLS and a lab TBT (sum of long-task time above 50 ms until the page is
 * idle). These are LAB numbers on a shared runner with software rendering: comparable before/after on the same
 * machine, never a claim about real phones (no field data, no INP).
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium, type Browser, type Page } from 'playwright';

export const DIST = 'dist';

/** Chromium flags that give headless a (software, SwiftShader) WebGL context. */
export const WEBGL_ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

function resolveExecutablePath(): string | undefined {
  const dir = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!dir || !existsSync(dir)) return undefined;
  for (const entry of readdirSync(dir)) {
    if (!entry.startsWith('chromium-')) continue;
    for (const sub of ['chrome-linux', 'chrome-linux64']) {
      const exe = `${dir}/${entry}/${sub}/chrome`;
      if (existsSync(exe)) return exe;
    }
  }
  return undefined;
}

export async function launchBrowser(args: string[] = WEBGL_ARGS): Promise<Browser> {
  try {
    return await chromium.launch({ args });
  } catch (err) {
    const executablePath = resolveExecutablePath();
    if (executablePath) return chromium.launch({ executablePath, args });
    throw err;
  }
}

export async function startStaticServer(port: number): Promise<ChildProcess> {
  const server = spawn('npx', ['tsx', '--tsconfig', 'scripts/tsconfig.json', 'scripts/serve-static.ts'], {
    stdio: 'ignore',
    env: { ...process.env, PORT: String(port) },
  });
  const url = `http://localhost:${port}/`;
  const start = Date.now();
  for (;;) {
    try {
      const r = await fetch(url, { redirect: 'manual' });
      if (r.status > 0) return server;
    } catch {
      /* not up yet */
    }
    if (Date.now() - start > 30_000) {
      server.kill('SIGTERM');
      throw new Error(`static server did not start on ${port}`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
}

/** Files of the 3D explorer as recorded by the build guard (`scripts/vite/explorer3dGuard.ts`). */
export interface ExplorerReport {
  enabled: boolean;
  entry: string | null;
  chunks: Array<{ file: string; kind: string; bytes: number }>;
}
export const REPORT_FILE = 'node_modules/.cache/animapverse/explorer3d-report.json';

/** The guard report, only if it describes the build currently in `dist/` (same entry chunk). */
export function readExplorerReport(): ExplorerReport | null {
  if (!existsSync(REPORT_FILE) || !existsSync(join(DIST, 'index.html'))) return null;
  const r = JSON.parse(readFileSync(REPORT_FILE, 'utf8')) as ExplorerReport;
  const html = readFileSync(join(DIST, 'index.html'), 'utf8');
  return r.entry && html.includes(`/${r.entry}`) ? r : null;
}

/** True when a request URL belongs to the 3D explorer (a guard-listed chunk or anything named after three.js). */
export function isExplorerRequest(url: string, report: ExplorerReport | null): boolean {
  const path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
  if (report?.chunks.some((c) => path === `/assets/${c.file}`)) return true;
  return /\/assets\/[^/]*three[^/]*\.js$/i.test(path);
}

export interface PageMetrics {
  url: string;
  requests: number;
  transferKB: number;
  jsTransferKB: number;
  lcpMs: number | null;
  cls: number;
  tbtMs: number;
  explorerRequests: string[];
}

/** Installs LCP / CLS / long-task observers before any page script runs. */
export async function installVitals(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as unknown as { __vitals: { lcp: number | null; cls: number; tbt: number } };
    w.__vitals = { lcp: null, cls: 0, tbt: 0 };
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) w.__vitals.lcp = e.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
          if (!e.hadRecentInput) w.__vitals.cls += e.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) w.__vitals.tbt += Math.max(0, e.duration - 50);
      }).observe({ type: 'longtask', buffered: true });
    } catch {
      /* observer not supported */
    }
  });
}

/** Opens `url` in a fresh page and returns its lab metrics (requests are collected until network idle + 1.5 s). */
export async function measurePage(browser: Browser, url: string, report: ExplorerReport | null): Promise<PageMetrics> {
  const context = await browser.newContext({ viewport: { width: 1366, height: 800 } });
  const page = await context.newPage();
  await installVitals(page);
  const requests: string[] = [];
  let transfer = 0;
  let jsTransfer = 0;
  page.on('request', (r) => requests.push(r.url()));
  page.on('requestfinished', async (r) => {
    try {
      const s = await r.sizes();
      const n = s.responseBodySize + s.responseHeadersSize;
      transfer += n;
      if (r.url().endsWith('.js')) jsTransfer += n;
    } catch {
      /* request gone */
    }
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const vitals = await page.evaluate(() => (window as unknown as { __vitals: { lcp: number | null; cls: number; tbt: number } }).__vitals);
  await context.close();
  return {
    url,
    requests: requests.length,
    transferKB: Math.round(transfer / 102.4) / 10,
    jsTransferKB: Math.round(jsTransfer / 102.4) / 10,
    lcpMs: vitals.lcp === null ? null : Math.round(vitals.lcp),
    cls: Math.round(vitals.cls * 1000) / 1000,
    tbtMs: Math.round(vitals.tbt),
    explorerRequests: requests.filter((u) => isExplorerRequest(u, report)),
  };
}

export const ORDINARY_PAGES = [
  '/en',
  '/en/one-piece/map',
  '/en/one-piece/characters/sanji',
  '/en/one-piece/locations/baratie',
  '/en/one-piece/map?location=loc-op-baratie',
];

async function main() {
  const port = Number(process.env.PORT ?? 4191);
  const runs = Number(process.env.RUNS ?? 3);
  const report = readExplorerReport();
  const server = await startStaticServer(port);
  const browser = await launchBrowser();
  try {
    const rows: Record<string, PageMetrics[]> = {};
    for (let i = 0; i < runs; i++) {
      for (const p of ORDINARY_PAGES) (rows[p] ??= []).push(await measurePage(browser, `http://localhost:${port}${p}`, report));
    }
    const med = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
    console.log(`=== explorer3d lab · ordinary pages · median of ${runs} runs (Chromium headless, this machine) ===`);
    for (const [p, ms] of Object.entries(rows)) {
      const lcps = ms.map((m) => m.lcpMs ?? 0);
      console.log(
        `  ${p}: req ${med(ms.map((m) => m.requests))} · transfer ${med(ms.map((m) => m.transferKB))} KB (JS ${med(ms.map((m) => m.jsTransferKB))} KB) · LCP ${med(lcps)} ms · CLS ${med(ms.map((m) => m.cls))} · TBT ${med(ms.map((m) => m.tbtMs))} ms · 3D requests ${ms.reduce((n, m) => n + m.explorerRequests.length, 0)}`,
      );
    }
    if (process.argv.includes('--json')) console.log(JSON.stringify(rows));
  } finally {
    await browser.close();
    server.kill('SIGTERM');
  }
}

if (process.argv[1]?.endsWith('explorer3d-lab.ts')) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
