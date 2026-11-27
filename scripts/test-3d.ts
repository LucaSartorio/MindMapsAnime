/**
 * `npm run test:3d` — end-to-end gate of the 3D explorer in Chromium (software WebGL in headless).
 *
 * Builds the site with prototype scenes ON (`VITE_EXPLORER_3D=1 npm run build`, full pipeline incl. SSR/prerender
 * and seo:check) unless `--no-build` reuses a flag-on `dist/`. Then, against `scripts/serve-static.ts`:
 *   1. ordinary navigation (home, map, character, location page, a location scheda WITH the 3D button) requests no
 *      3D chunk;
 *   2. the viewer opens on click, downloads only its chunks, renders, measures timings/draw calls/triangles;
 *   3. orbit (drag, wheel) and on-demand rendering (the loop stops when idle);
 *   4. exploration (routes from the scene's config): through the door into the hall, a curved wall stops the
 *      player, every stair flight reaches its level, the fin edge cannot be crossed, reset position;
 *   5. hotspots: 3D marker click, list focus, "open the entry" opens the existing scheda;
 *   6. quality presets; 7. ten open/close cycles (WebGL contexts, canvases, listeners, rAF, heap);
 *   8. browser back closes the viewer; 9. other languages; 10. mobile (touch joystick); 11. reduced motion;
 *   12. chunk load error + retry; 13. WebGL context loss + retry; 14. no-WebGL fallback.
 * `--benchmark` repeats the viewer measurements (RUNS, default 3) and prints medians.
 *
 * Numbers come from SwiftShader on a shared CPU: valid for regressions on this machine, NOT for phone FPS.
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { devices, type Browser, type BrowserContext, type Page } from 'playwright';
import {
  launchBrowser,
  measurePage,
  ORDINARY_PAGES,
  readExplorerReport,
  startStaticServer,
  WEBGL_ARGS,
  isExplorerRequest,
  type ExplorerReport,
} from './explorer3d-lab';

import { definition as baratie, PLAN as BARATIE_PLAN, FIN_Y, T1_TOP, T2_TOP } from '../src/features/explorer3d/worlds/onepiece/baratie/config';

const PORT = Number(process.env.PORT ?? 4193);
/**
 * Scene-specific walking routes for the gate, built from the scene's own config (spawn ids, levels, plan): a scene
 * rebuild moves the data, never hardcoded coordinates here.
 */
const spawnOf = (id: string) => {
  const sp = baratie.spawns.find((x) => x.id === id);
  if (!sp) throw new Error(`spawn ${id} missing in ${baratie.id}`);
  return sp;
};
const ellipseZ = (x: number) => BARATIE_PLAN.t1.rz * Math.sqrt(Math.max(0, 1 - ((x - BARATIE_PLAN.t1.cx) / BARATIE_PLAN.t1.rx) ** 2));
const ROUTES = {
  climbs: [
    { name: 'outer stairs lead to the terrace', spawn: 'outer-stairs-bottom', level: T1_TOP, interior: null as string | null },
    { name: 'upper stairs lead to the top terrace', spawn: 'upper-stairs-bottom', level: T2_TOP, interior: null },
    { name: 'hall stairs lead to the kitchen (middle level)', spawn: 'hall-stairs-bottom', level: T1_TOP, interior: 'kitchen' },
  ],
};
const BASE = `http://localhost:${PORT}`;
const MAP = '/en/one-piece/map?location=loc-op-baratie';
const args = process.argv.slice(2);
const BENCH = args.includes('--benchmark');
const RUNS = Number(process.env.RUNS ?? 3);
const LOG = 'node_modules/.cache/animapverse/test-3d-build.log';

const results: Array<{ name: string; ok: boolean; info?: string }> = [];
const metrics: Record<string, unknown> = {};
async function check(name: string, fn: () => Promise<string | void>): Promise<void> {
  try {
    const info = (await fn()) ?? undefined;
    results.push({ name, ok: true, info });
    console.log(`  ✓ ${name}${info ? ` — ${info}` : ''}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message.split('\n')[0] : String(e);
    results.push({ name, ok: false, info: msg });
    console.log(`  ✗ ${name} — ${msg}`);
  }
}
function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Instruments WebGL contexts, window/document listeners and rAF calls before any page script. */
const INSTRUMENT = () => {
  const w = window as unknown as Record<string, unknown>;
  const gl = { created: 0, lost: 0 };
  const raf = { count: 0 };
  const listeners = new Map<string, number>();
  const ids = new WeakMap<object, number>();
  let next = 1;
  const keyOf = (t: EventTarget, type: string, fn: unknown, opts: unknown) => {
    if (t !== window && t !== document) return null;
    if (!fn || (typeof fn !== 'function' && typeof fn !== 'object')) return null;
    if (!ids.has(fn as object)) ids.set(fn as object, next++);
    const capture = typeof opts === 'boolean' ? opts : !!(opts as { capture?: boolean } | undefined)?.capture;
    return `${t === window ? 'w' : 'd'}|${type}|${ids.get(fn as object)}|${capture}`;
  };
  const active = new Set<string>();
  const add = EventTarget.prototype.addEventListener;
  const remove = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener = function (type: string, fn: EventListenerOrEventListenerObject | null, opts?: boolean | AddEventListenerOptions) {
    const k = keyOf(this, type, fn, opts);
    if (k) active.add(k);
    return add.call(this, type, fn, opts);
  };
  EventTarget.prototype.removeEventListener = function (type: string, fn: EventListenerOrEventListenerObject | null, opts?: boolean | EventListenerOptions) {
    const k = keyOf(this, type, fn, opts);
    if (k) active.delete(k);
    return remove.call(this, type, fn, opts);
  };
  const getContext = HTMLCanvasElement.prototype.getContext;
  const seen = new WeakSet<object>();
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
    const ctx = (getContext as (...a: unknown[]) => unknown).call(this, type, ...rest);
    if (ctx && /webgl/.test(type) && !seen.has(ctx as object)) {
      seen.add(ctx as object);
      gl.created++;
      add.call(this, 'webglcontextlost', () => gl.lost++);
    }
    return ctx;
  } as typeof HTMLCanvasElement.prototype.getContext;
  const rafOrig = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => {
    raf.count++;
    return rafOrig(cb);
  };
  w.__probe = {
    gl,
    raf,
    listeners: () => {
      listeners.clear();
      for (const k of active) {
        const type = k.split('|').slice(0, 2).join('|');
        listeners.set(type, (listeners.get(type) ?? 0) + 1);
      }
      return Object.fromEntries(listeners);
    },
  };
  try {
    localStorage.setItem('animapverse:explorer3d:quality', 'auto');
  } catch {
    /* ignore */
  }
};

interface Probe {
  gl: { created: number; lost: number };
  raf: { count: number };
  listeners: () => Record<string, number>;
}
type Stats = { calls: number; triangles: number; geometries: number; textures: number; programs: number; frames: number; pixelRatio: number; interiors: string[]; mode: string; level: string; zone: string | null; feet: { x: number; y: number; z: number }; running: boolean };

const probe = (page: Page) => page.evaluate(() => {
  const p = (window as unknown as { __probe: Probe }).__probe;
  return { gl: { ...p.gl }, raf: p.raf.count, listeners: p.listeners() };
});
const stats = (page: Page) => page.evaluate(() => (window as unknown as { __explorer3d: { stats: () => Stats } }).__explorer3d.stats());

async function newPage(browser: Browser, opts: Parameters<Browser['newContext']>[0] = {}): Promise<{ context: BrowserContext; page: Page; requests: string[]; errors: string[] }> {
  const context = await browser.newContext({ viewport: { width: 1366, height: 800 }, ...opts });
  // tsx compiles with esbuild `keepNames`: functions serialized into the page call `__name()`.
  await context.addInitScript({ content: 'window.__name = (f) => f;' });
  await context.addInitScript(INSTRUMENT);
  await context.addInitScript(() => {
    try {
      // Returning visitor (same as scripts/smoke.ts): no cookie banner, no onboarding over the scheda.
      localStorage.setItem('animeInteractiveMaps.cookieConsent', JSON.stringify({ necessary: true, analytics: false, timestamp: new Date().toISOString(), version: 2 }));
      localStorage.setItem('animeInteractiveMaps.onboarding.v1', '1');
    } catch {
      /* ignore */
    }
  });
  const page = await context.newPage();
  const requests: string[] = [];
  const errors: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/_vercel|favicon|Failed to load resource|ERR_/.test(m.text())) errors.push(m.text());
  });
  return { context, page, requests, errors };
}

async function openViewer(page: Page, label = /Explore in 3D/): Promise<void> {
  await page.getByRole('button', { name: label }).click({ timeout: 20_000 });
  await page.waitForSelector('[data-explorer3d="viewer"][data-status="ready"]', { timeout: 90_000 });
}
async function closeViewer(page: Page): Promise<void> {
  await page.click('[data-explorer3d="close"]');
  await page.waitForSelector('[data-explorer3d="viewer"]', { state: 'detached', timeout: 20_000 });
}
async function holdKey(page: Page, key: string, until: () => Promise<boolean>, timeoutMs: number): Promise<void> {
  await page.keyboard.down(key);
  const start = Date.now();
  try {
    while (Date.now() - start < timeoutMs) {
      if (await until()) break;
      await sleep(150);
    }
  } finally {
    await page.keyboard.up(key);
  }
}
const teleportSpawn = (page: Page, id: string, yaw?: number) => {
  const sp = spawnOf(id);
  return teleport(page, [sp.position[0], sp.position[1], sp.position[2]], yaw ?? sp.yaw);
};
const teleport = (page: Page, position: [number, number, number], yaw: number) =>
  page.evaluate(([p, y]) => {
    const s = (window as unknown as { __explorer3d: { session: { setMode(m: string): void; walk: { teleport(sp: unknown): void } } } }).__explorer3d.session;
    s.setMode('explore');
    s.walk.teleport({ id: 'test', zone: '', position: p, yaw: y });
  }, [position, yaw] as const);

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

async function measureViewer(browser: Browser, report: ExplorerReport) {
  const { context, page, requests } = await newPage(browser);
  await page.goto(BASE + MAP, { waitUntil: 'networkidle' });
  const before = requests.length;
  const t0 = Date.now();
  await openViewer(page);
  const openMs = Date.now() - t0;
  await sleep(800);
  const viewerRequests = requests.slice(before).filter((u) => isExplorerRequest(u, report));
  const exterior = await stats(page);
  const timings = await page.evaluate(() => (window as unknown as { __explorer3d: { timings: Record<string, unknown> } }).__explorer3d.timings);
  // Frame time while walking (continuous loop): rAF deltas sampled in the page for 3 s.
  await teleportSpawn(page, baratie.defaultSpawn);
  await page.keyboard.down('KeyW');
  const frames = await page.evaluate(
    () =>
      new Promise<number[]>((resolve) => {
        const out: number[] = [];
        let last = performance.now();
        const end = last + 3000;
        const tick = (t: number) => {
          out.push(t - last);
          last = t;
          if (t < end) requestAnimationFrame(tick);
          else resolve(out.slice(2));
        };
        requestAnimationFrame(tick);
      }),
  );
  await page.keyboard.up('KeyW');
  await sleep(500);
  const interior = await stats(page);
  await context.close();
  const sorted = [...frames].sort((a, b) => a - b);
  return {
    openMs,
    viewerRequests: viewerRequests.length,
    timings,
    exterior: { calls: exterior.calls, triangles: exterior.triangles, geometries: exterior.geometries, textures: exterior.textures, programs: exterior.programs, level: exterior.level },
    interior: { calls: interior.calls, triangles: interior.triangles, zone: interior.zone },
    frameMs: { mean: Math.round((frames.reduce((a, b) => a + b, 0) / frames.length) * 10) / 10, p95: Math.round(sorted[Math.floor(sorted.length * 0.95)] * 10) / 10, samples: frames.length },
  };
}

async function main() {
  if (!args.includes('--no-build')) {
    console.log('[test:3d] building with VITE_EXPLORER_3D=1 (full pipeline, log: ' + LOG + ')…');
    mkdirSync('node_modules/.cache/animapverse', { recursive: true });
    try {
      const out = execSync('npm run build', { env: { ...process.env, VITE_EXPLORER_3D: '1' }, encoding: 'utf8', stdio: 'pipe', maxBuffer: 1 << 28 });
      writeFileSync(LOG, out);
    } catch (e) {
      const out = String((e as { stdout?: string }).stdout ?? '') + String((e as { stderr?: string }).stderr ?? '');
      writeFileSync(LOG, out);
      console.error(out.split('\n').slice(-30).join('\n'));
      throw new Error('build failed');
    }
  }
  const report = readExplorerReport();
  if (!report?.enabled) throw new Error('dist/ is not a flag-on build with a matching guard report: run without --no-build');
  console.log(`[test:3d] explorer chunks: ${report.chunks.map((c) => `${c.file} (${c.kind})`).join(', ')}`);

  const server = await startStaticServer(PORT);
  const browser = await launchBrowser([...WEBGL_ARGS, '--js-flags=--expose-gc']);
  try {
    if (BENCH) {
      const runs: Array<Awaited<ReturnType<typeof measureViewer>>> = [];
      for (let i = 0; i < RUNS; i++) runs.push(await measureViewer(browser, report));
      const pick = (f: (r: (typeof runs)[number]) => number) => median(runs.map(f));
      const summary = {
        runs: RUNS,
        openMs: pick((r) => r.openMs),
        sceneChunkMs: pick((r) => Number(r.timings.sceneChunkMs)),
        buildMs: pick((r) => Math.round(Number(r.timings.buildMs))),
        rendererInitMs: pick((r) => Math.round(Number(r.timings.rendererInitMs))),
        exteriorCalls: pick((r) => r.exterior.calls),
        exteriorTriangles: pick((r) => r.exterior.triangles),
        interiorCalls: pick((r) => r.interior.calls),
        interiorTriangles: pick((r) => r.interior.triangles),
        frameMeanMs: pick((r) => r.frameMs.mean),
        frameP95Ms: pick((r) => r.frameMs.p95),
        level: runs[0].exterior.level,
      };
      console.log('[benchmark:3d] medians (SwiftShader, this machine):');
      console.log(JSON.stringify(summary, null, 2));
      return;
    }

    console.log('[test:3d] 1. ordinary navigation');
    for (const p of ORDINARY_PAGES) {
      await check(`no 3D request on ${p}`, async () => {
        const m = await measurePage(browser, BASE + p, report);
        assert(m.explorerRequests.length === 0, `requested ${m.explorerRequests.join(', ')}`);
        return `${m.requests} requests, ${m.jsTransferKB} KB JS`;
      });
    }

    const { context, page, requests, errors } = await newPage(browser);
    await page.goto(BASE + MAP, { waitUntil: 'networkidle' });
    const idle = await probe(page);
    await sleep(1000);
    const idleRaf = (await probe(page)).raf - idle.raf;

    console.log('[test:3d] 2. open');
    await check('button visible on the location scheda, nothing downloaded yet', async () => {
      await page.getByRole('button', { name: /Explore in 3D/ }).waitFor({ timeout: 20_000 });
      assert(!requests.some((u) => isExplorerRequest(u, report)), '3D chunk requested before the click');
    });
    const beforeOpen = requests.length;
    await check('viewer opens and renders', async () => {
      await openViewer(page);
      const s = await stats(page);
      assert(s.frames > 0 && s.calls > 0 && s.triangles > 0, `nothing rendered: ${JSON.stringify(s)}`);
      const fetched = requests.slice(beforeOpen).filter((u) => isExplorerRequest(u, report)).map((u) => u.split('/').pop());
      metrics.viewerChunks = fetched;
      metrics.openStats = s;
      metrics.timings = await page.evaluate(() => (window as unknown as { __explorer3d: { timings: unknown } }).__explorer3d.timings);
      assert(fetched.length === report.chunks.length, `expected ${report.chunks.length} explorer chunks, got ${fetched.join(', ')}`);
      return `${s.calls} draw calls, ${s.triangles} triangles, level ${s.level}, chunks ${fetched.join(' + ')}`;
    });

    console.log('[test:3d] 3. observation');
    await check('drag orbits, wheel zooms, loop stops when idle', async () => {
      const cam = () => page.evaluate(() => {
        const c = (window as unknown as { __explorer3d: { session: { view: { camera: { position: { x: number; y: number; z: number } } } } } }).__explorer3d.session.view.camera.position;
        return [c.x, c.y, c.z];
      });
      const a = await cam();
      await page.mouse.move(600, 420);
      await page.mouse.down();
      await page.mouse.move(820, 400, { steps: 8 });
      await page.mouse.up();
      await sleep(600);
      const b = await cam();
      assert(Math.hypot(a[0] - b[0], a[2] - b[2]) > 1, 'drag did not rotate');
      const dist = (p: number[]) => Math.hypot(p[0] + 1, p[1] - 6, p[2]);
      await page.mouse.wheel(0, -600);
      await sleep(1200);
      const c = await cam();
      assert(dist(c) < dist(b) - 1, 'wheel did not zoom');
      // Once inertia settles the loop must stop for good.
      await page.waitForFunction(() => !(window as unknown as { __explorer3d: { stats: () => { running: boolean } } }).__explorer3d.stats().running, null, { timeout: 15_000 });
      const f0 = (await stats(page)).frames;
      await sleep(1500);
      const s = await stats(page);
      assert(!s.running, 'render loop still running while idle');
      assert(s.frames === f0, `${s.frames - f0} frames rendered while idle (expected 0: on-demand rendering)`);
      return `settled, then 0 frames in 1.5 s (page rAF baseline ${idleRaf}/s)`;
    });

    console.log('[test:3d] 4. exploration');
    await check('walk from the bow through the door into the hall (zone loading)', async () => {
      await page.click('[data-explorer3d="mode-explore"]');
      await page.locator('[data-explorer3d="viewer"][data-mode="explore"]').waitFor();
      await teleportSpawn(page, baratie.defaultSpawn);
      await holdKey(page, 'KeyW', async () => (await stats(page)).zone === 'dining-hall', 25_000);
      await holdKey(page, 'KeyW', async () => false, 1500);
      const s = await stats(page);
      assert(s.zone === 'dining-hall', `did not enter the hall: zone ${s.zone} at ${JSON.stringify(s.feet)}`);
      assert(s.interiors.includes('hall'), `hall interior not built (${s.interiors})`);
      return `inside at x=${s.feet.x.toFixed(2)} (zone ${s.zone}, interiors ${s.interiors.join('+')})`;
    });
    await check('a curved wall stops the player', async () => {
      const sp = spawnOf('hall');
      await teleportSpawn(page, 'hall', Math.PI); // face +z, towards the oval wall
      await holdKey(page, 'KeyW', async () => false, 5000);
      const s = await stats(page);
      const wallZ = ellipseZ(sp.position[0]);
      assert(s.feet.z < wallZ + 0.05, `crossed the wall: z=${s.feet.z.toFixed(2)} wall≈${wallZ.toFixed(2)}`);
      assert(s.feet.z > wallZ - 1.2, `stopped too early: z=${s.feet.z.toFixed(2)} wall≈${wallZ.toFixed(2)}`);
      return `stopped at z=${s.feet.z.toFixed(2)} (wall ≈ ${wallZ.toFixed(2)})`;
    });
    for (const r of ROUTES.climbs) {
      await check(r.name, async () => {
        await teleportSpawn(page, r.spawn);
        await holdKey(page, 'KeyW', async () => (await stats(page)).feet.y > r.level - 0.1, 25_000);
        await holdKey(page, 'KeyW', async () => false, 700);
        const s = await stats(page);
        assert(Math.abs(s.feet.y - r.level) < 0.05, `y=${s.feet.y.toFixed(2)} expected ${r.level}`);
        if (r.interior) assert(s.interiors.includes(r.interior), `${r.interior} not built (${s.interiors})`);
        return `reached y=${s.feet.y.toFixed(2)} (${s.zone})`;
      });
    }
    await check('the fin edge cannot be crossed (no fall into the ocean)', async () => {
      await teleportSpawn(page, 'fin-port', 0); // face −z, outwards
      await holdKey(page, 'KeyW', async () => false, 5000);
      const s = await stats(page);
      assert(Math.abs(s.feet.y - FIN_Y) < 0.05, `left the fin: y=${s.feet.y}`);
      assert(s.feet.z > -24, `z=${s.feet.z}`);
      return `stopped at z=${s.feet.z.toFixed(2)} on the fin (y=${s.feet.y.toFixed(2)})`;
    });
    await check('reset returns to the spawn', async () => {
      await page.click('[data-explorer3d="reset"]');
      const s = await stats(page);
      const d = spawnOf(baratie.defaultSpawn).position;
      assert(Math.abs(s.feet.x - d[0]) < 0.01 && Math.abs(s.feet.z - d[2]) < 0.01, JSON.stringify(s.feet));
    });

    console.log('[test:3d] 5. hotspots');
    await check('clicking a 3D marker selects it', async () => {
      await page.click('[data-explorer3d="mode-observe"]');
      await sleep(500);
      const pt = await page.evaluate(() => {
        const s = (window as unknown as { __explorer3d: { session: { view: { camera: unknown; canvas: HTMLCanvasElement; scene: { getObjectByName(n: string): { position: { clone(): { project(c: unknown): { x: number; y: number } } } } } } } } }).__explorer3d.session;
        const p = s.view.scene.getObjectByName('hotspot:krieg-assault')!.position.clone().project(s.view.camera);
        const r = s.view.canvas.getBoundingClientRect();
        return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height };
      });
      await page.mouse.click(pt.x, pt.y);
      await page.locator('[data-explorer3d="hotspot-krieg-assault"][aria-pressed="true"]').waitFor({ timeout: 5000 });
    });
    await check('list → focus → "open the entry" opens the existing scheda', async () => {
      await page.click('[data-explorer3d="hotspot-sanji"]');
      await sleep(600);
      const s = await stats(page);
      assert(s.mode === 'explore' && s.zone === 'kitchen', `mode ${s.mode} zone ${s.zone}`);
      await page.click('[data-explorer3d="open-entity"]');
      await page.waitForSelector('[data-explorer3d="viewer"]', { state: 'detached' });
      await page.waitForURL(/character=char-op-sanji/, { timeout: 10_000 });
      assert((await page.locator('[data-explorer3d="canvas"]').count()) === 0, 'canvas left in the DOM');
    });

    console.log('[test:3d] 6. quality');
    await page.goto(BASE + MAP, { waitUntil: 'networkidle' });
    await openViewer(page);
    await check('manual presets rebuild at that level; auto restores', async () => {
      await page.selectOption('[data-explorer3d="quality"]', 'low');
      await sleep(800);
      const low = await stats(page);
      assert(low.level === 'low' && low.pixelRatio <= 1, JSON.stringify({ level: low.level, dpr: low.pixelRatio }));
      await page.selectOption('[data-explorer3d="quality"]', 'high');
      await sleep(1500);
      const high = await stats(page);
      assert(high.level === 'high', high.level);
      await page.selectOption('[data-explorer3d="quality"]', 'auto');
      return `low: ${low.calls} calls/${low.triangles} tris · high: ${high.calls} calls/${high.triangles} tris`;
    });
    await closeViewer(page);

    console.log('[test:3d] 7. lifecycle ×10');
    await check('10 open/close cycles leave nothing behind', async () => {
      const gc = () => page.evaluate(() => (window as unknown as { gc?: () => void }).gc?.());
      const heap = () => page.evaluate(() => (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize ?? 0);
      const snapshots: Array<{ listeners: Record<string, number>; heap: number; alive: number; geometries: number; textures: number }> = [];
      for (let i = 0; i < 10; i++) {
        await page.getByRole('button', { name: /Explore in 3D/ }).waitFor({ timeout: 20_000 });
        await openViewer(page);
        // Measure a settled session (idle loop): resources are uploaded on first render.
        await page.waitForFunction(() => !(window as unknown as { __explorer3d: { stats: () => { running: boolean } } }).__explorer3d.stats().running, null, { timeout: 10_000 });
        await sleep(300);
        const s = await stats(page);
        await closeViewer(page);
        await sleep(300);
        assert((await page.locator('canvas[data-explorer3d="canvas"]').count()) === 0, `cycle ${i + 1}: canvas left`);
        assert(await page.evaluate(() => !('__explorer3d' in window)), `cycle ${i + 1}: debug handle left`);
        await gc();
        await sleep(200);
        const p = await probe(page);
        snapshots.push({ listeners: p.listeners, heap: await heap(), alive: p.gl.created - p.gl.lost, geometries: s.geometries, textures: s.textures });
      }
      const first = snapshots[0];
      const last = snapshots[9];
      assert(last.alive === 0, `${last.alive} WebGL context(s) still alive`);
      assert(JSON.stringify(first.listeners) === JSON.stringify(last.listeners), `listeners grew: ${JSON.stringify(first.listeners)} → ${JSON.stringify(last.listeners)}`);
      assert(
        snapshots.every((x) => x.geometries === first.geometries && x.textures === first.textures),
        `GPU resource counts differ between sessions: ${snapshots.map((x) => `${x.geometries}g/${x.textures}t`).join(' ')}`,
      );
      const r0 = (await probe(page)).raf;
      await sleep(1000);
      const rafAfter = (await probe(page)).raf - r0;
      // Coarse signal (the site itself schedules a few rAF): a leaked 3D loop would add ≥ 10/s here.
      assert(rafAfter <= idleRaf + 6, `rAF activity after close: ${rafAfter}/s (page baseline ${idleRaf}/s)`);
      const growthMb = (last.heap - first.heap) / 1048576;
      metrics.lifecycle = { heapFirstMb: +(first.heap / 1048576).toFixed(1), heapLastMb: +(last.heap / 1048576).toFixed(1), growthMb: +growthMb.toFixed(2), contextsCreated: (await probe(page)).gl.created };
      assert(growthMb < 4, `heap grew ${growthMb.toFixed(1)} MB over 10 cycles`);
      return `heap ${metrics.lifecycle && (metrics.lifecycle as { heapFirstMb: number }).heapFirstMb} → ${(last.heap / 1048576).toFixed(1)} MB, contexts alive 0, listeners stable, rAF idle ${rafAfter}/s`;
    });

    await check('a closed session never renders again (exact)', async () => {
      await openViewer(page);
      await page.evaluate(() => {
        const w = window as unknown as { __explorer3d: { session: unknown }; __held?: unknown };
        w.__held = w.__explorer3d.session;
      });
      await closeViewer(page);
      const read = () => page.evaluate(() => {
        const v = (window as unknown as { __held: { view: { running: boolean; stats: () => { frames: number } } } }).__held.view;
        return { running: v.running, frames: v.stats().frames };
      });
      const a = await read();
      await sleep(1500);
      const b = await read();
      await page.evaluate(() => delete (window as unknown as { __held?: unknown }).__held);
      assert(!a.running && a.frames === b.frames, `loop alive after dispose: ${JSON.stringify([a, b])}`);
    });

    console.log('[test:3d] 8. browser navigation');
    await check('browser back closes the viewer', async () => {
      await page.goto(BASE + '/en/one-piece', { waitUntil: 'networkidle' });
      await page.goto(BASE + MAP, { waitUntil: 'networkidle' });
      await openViewer(page);
      await page.goBack();
      await page.waitForSelector('[data-explorer3d="viewer"]', { state: 'detached', timeout: 10_000 });
      await sleep(300);
      const p = await probe(page);
      assert(p.gl.created === p.gl.lost, 'context not released');
    });
    await check('no page errors during the desktop session', async () => {
      assert(errors.length === 0, errors.join(' | '));
    });
    await context.close();

    console.log('[test:3d] 9. languages');
    // URL languages (ja/de are UI-only languages without URLs: their keys are covered by validate:i18n).
    for (const [lang, button, close] of [['fr', /Explorer en 3D/, 'Quitter la 3D'], ['it', /Esplora in 3D/, 'Esci dal 3D'], ['es', /Explorar en 3D/, 'Salir del 3D']] as const) {
      await check(`UI in ${lang}`, async () => {
        const { context: c, page: p } = await newPage(browser);
        await p.goto(`${BASE}/${lang}/one-piece/map?location=loc-op-baratie`, { waitUntil: 'networkidle' });
        await openViewer(p, button);
        assert(await p.getByRole('button', { name: close }).isVisible(), `"${close}" not visible`);
        await c.close();
      });
    }

    console.log('[test:3d] 10. mobile');
    await check('touch: joystick moves, panel toggles, exit reachable', async () => {
      const { context: c, page: p } = await newPage(browser, { ...devices['Pixel 7'] });
      await p.goto(BASE + MAP, { waitUntil: 'networkidle' });
      await openViewer(p);
      assert(await p.locator('[data-explorer3d="close"]').isVisible(), 'exit not visible');
      await p.click('[data-explorer3d="mode-explore"]');
      const joy = p.locator('[data-explorer3d="joystick"]');
      await joy.waitFor({ timeout: 5000 });
      const box = (await joy.boundingBox())!;
      const before = await stats(p);
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await p.mouse.move(cx, cy);
      await p.mouse.down();
      await p.mouse.move(cx, cy - 40, { steps: 4 });
      await sleep(2500);
      await p.mouse.up();
      const after = await stats(p);
      const moved = Math.hypot(after.feet.x - before.feet.x, after.feet.z - before.feet.z);
      assert(moved > 0.5, `joystick did not move the player (${moved.toFixed(2)} m)`);
      const toggle = p.getByRole('button', { name: /Points of interest/ });
      await toggle.click();
      assert(await p.locator('#explorer3d-hotspots').isVisible(), 'hotspot panel did not open');
      await closeViewer(p);
      await c.close();
      return `moved ${moved.toFixed(1)} m`;
    });

    console.log('[test:3d] 11. reduced motion');
    await check('prefers-reduced-motion disables inertia', async () => {
      const { context: c, page: p } = await newPage(browser, { reducedMotion: 'reduce' });
      await p.goto(BASE + MAP, { waitUntil: 'networkidle' });
      await openViewer(p);
      const damping = await p.evaluate(() => (window as unknown as { __explorer3d: { session: { orbit: { controls: { enableDamping: boolean } } } } }).__explorer3d.session.orbit.controls.enableDamping);
      assert(damping === false, 'damping still on');
      await c.close();
    });

    console.log('[test:3d] 12-13. errors');
    await check('scene chunk failure shows an error, retry recovers', async () => {
      const { context: c, page: p } = await newPage(browser);
      const scene = report.chunks.find((x) => x.kind === 'scene')!.file;
      let block = true;
      await c.route(`**/assets/${scene}`, (route) => (block ? route.abort() : route.continue()));
      await p.goto(BASE + MAP, { waitUntil: 'networkidle' });
      await p.getByRole('button', { name: /Explore in 3D/ }).click();
      await p.waitForSelector('[data-explorer3d="viewer"][data-status="error"]', { timeout: 30_000 });
      block = false;
      await p.getByRole('button', { name: 'Retry' }).click();
      const ok = await p.waitForSelector('[data-explorer3d="viewer"][data-status="ready"]', { timeout: 30_000 }).then(() => true).catch(() => false);
      await c.close();
      assert(ok, 'retry did not recover (the browser may cache the failed module)');
    });
    await check('WebGL context loss shows a message, retry rebuilds', async () => {
      const { context: c, page: p } = await newPage(browser);
      await p.goto(BASE + MAP, { waitUntil: 'networkidle' });
      await openViewer(p);
      await p.evaluate(() => (document.querySelector('canvas[data-explorer3d="canvas"]') as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
      await p.waitForSelector('[data-explorer3d="viewer"][data-status="contextLost"]', { timeout: 10_000 });
      await p.getByRole('button', { name: 'Retry' }).click();
      await p.waitForSelector('[data-explorer3d="viewer"][data-status="ready"]', { timeout: 60_000 });
      assert((await p.locator('canvas[data-explorer3d="canvas"]').count()) === 1, 'duplicate canvases after retry');
      await c.close();
    });
  } finally {
    await browser.close();
  }

  console.log('[test:3d] 14. no WebGL');
  const plain = await launchBrowser(['--disable-webgl', '--disable-3d-apis']);
  try {
    await check('without WebGL: message, no 3D download, scheda still open', async () => {
      const { page: p, requests } = await newPage(plain);
      await p.goto(BASE + MAP, { waitUntil: 'networkidle' });
      await p.getByRole('button', { name: /Explore in 3D/ }).click();
      await p.getByText(/does not support WebGL/).waitFor({ timeout: 5000 });
      await sleep(500);
      assert(!requests.some((u) => isExplorerRequest(u, report)), '3D chunk downloaded without WebGL');
      assert((await p.locator('[data-explorer3d="viewer"]').count()) === 0, 'viewer opened');
    });
  } finally {
    await plain.close();
    server.kill('SIGTERM');
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n[test:3d] ${results.length - failed.length}/${results.length} passed`);
  console.log(`[test:3d] metrics: ${JSON.stringify(metrics)}`);
  if (failed.length) process.exit(1);
}

if (!existsSync('package.json') || !readFileSync('package.json', 'utf8').includes('anime-interactive-maps')) {
  console.error('run from the repository root');
  process.exit(1);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
