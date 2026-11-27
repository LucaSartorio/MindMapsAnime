/**
 * `npm run capture:3d -- <sceneId> --out <dir> [--quality high|medium|low] [--base <url>] [--views a,b] [--compare <dir>]`
 * `npm run capture:3d -- --compare-only <beforeDir> <afterDir> --out <dir>`
 *
 * Visual QA for `/create-3d-location` (modes exterior, explorable, fidelity): opens the scene in the dev server
 * (`npm run dev`, prototypes and the `window.__explorer3d` debug handle are on there) and captures a FIXED, comparable
 * set of views — orbital presets derived from the scene's own camera (hero, bow, side, rear, top, sea) plus one
 * walking view per spawn (`w-<spawnId>`) — with the viewer UI hidden. `--compare` (or `--compare-only`) writes
 * `compare.html` + `compare.png`: before/after pairs by file name. Output goes to a scratch directory: never commit
 * captures, and never put reference images (official art, photos) next to them.
 */
import { mkdirSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Page } from 'playwright';
import { SCENE_MANIFESTS } from '../src/features/explorer3d/launcher/manifests';
import { animeWorlds, getWorldUrlSlug } from '../src/data/worlds';
import { launchBrowser, WEBGL_ARGS } from './explorer3d-lab';

const argv = process.argv.slice(2);
const opt = (name: string) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const out = resolve(opt('out') ?? 'node_modules/.cache/animapverse/captures');
mkdirSync(out, { recursive: true });

type V3 = [number, number, number];

async function compare(beforeDir: string, afterDir: string): Promise<void> {
  const names = readdirSync(afterDir).filter((f) => f.endsWith('.png') && existsSync(join(beforeDir, f)) && f !== 'compare.png').sort();
  const rows = names
    .map(
      (n) => `<tr><th>${n.replace('.png', '')}</th><td><img src="${pathToFileURL(join(beforeDir, n)).href}"></td><td><img src="${pathToFileURL(join(afterDir, n)).href}"></td></tr>`,
    )
    .join('');
  const html = `<!doctype html><meta charset="utf-8"><style>body{font:14px system-ui;background:#111;color:#eee;margin:12px}
img{width:560px;display:block}th{writing-mode:vertical-rl;transform:rotate(180deg);padding:4px}td{padding:4px}
h2{margin:4px 0}</style><table><tr><th></th><td><h2>Before (${basename(beforeDir)})</h2></td><td><h2>After (${basename(afterDir)})</h2></td></tr>${rows}</table>`;
  const file = join(out, 'compare.html');
  writeFileSync(file, html);
  const browser = await launchBrowser([]);
  const page = await browser.newPage({ viewport: { width: 1180, height: 400 } });
  await page.goto(pathToFileURL(file).href);
  await page.screenshot({ path: join(out, 'compare.png'), fullPage: true });
  await browser.close();
  console.log(`[capture:3d] ${names.length} pairs → ${file} + compare.png`);
}

async function capture(sceneId: string): Promise<void> {
  const manifest = SCENE_MANIFESTS.find((m) => m.id === sceneId);
  if (!manifest) throw new Error(`unknown scene ${sceneId} (launcher/manifests.ts)`);
  const world = animeWorlds.find((w) => w.id === manifest.worldId);
  if (!world) throw new Error(`world ${manifest.worldId} not registered`);
  const base = opt('base') ?? 'http://localhost:5173';
  const quality = opt('quality') ?? 'high';
  const only = opt('views')?.split(',');
  const browser = await launchBrowser(WEBGL_ARGS);
  const page: Page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript({ content: `window.__name=(f)=>f;` });
  await page.addInitScript((q) => {
    try {
      localStorage.setItem('animapverse:explorer3d:quality', q);
      localStorage.setItem('animeInteractiveMaps.cookieConsent', JSON.stringify({ necessary: true, analytics: false, timestamp: new Date().toISOString(), version: 2 }));
      localStorage.setItem('animeInteractiveMaps.onboarding.v1', '1');
    } catch {
      /* ignore */
    }
  }, quality);
  await page.goto(`${base}/en/${getWorldUrlSlug(world)}/map?location=${manifest.locationId}`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Explore in 3D/ }).click({ timeout: 30_000 });
  await page.waitForSelector('[data-explorer3d="viewer"][data-status="ready"]', { timeout: 120_000 });
  await page.addStyleTag({ content: '[data-explorer3d="viewer"] > :not(:first-child){display:none!important}' });
  const def = await page.evaluate(() => {
    const s = (window as unknown as { __explorer3d?: { session: { def: { camera: { position: V3; target: V3 }; spawns: Array<{ id: string }> } } } }).__explorer3d;
    if (!s) throw new Error('no debug handle: capture needs a prototype-enabled build (npm run dev)');
    return { camera: s.session.def.camera, spawns: s.session.def.spawns.map((x) => x.id) };
  });
  const [px, py, pz] = def.camera.position;
  const [tx, ty, tz] = def.camera.target;
  const d = Math.hypot(px - tx, py - ty, pz - tz);
  const orbit: Record<string, [V3, V3]> = {
    hero: [def.camera.position, def.camera.target],
    bow: [[tx + d * 0.92, ty + d * 0.08, tz + d * 0.14], [tx + 6, ty, tz]],
    side: [[tx, ty + d * 0.08, tz + d * 0.97], def.camera.target],
    rear: [[tx - d * 0.86, ty + d * 0.18, tz - d * 0.5], def.camera.target],
    top: [[tx + 0.5, ty + d * 1.35, tz + 2], [tx, 0, tz]],
    sea: [[tx + d * 0.5, 2.5, tz + d * 0.62], [tx, ty + 2, tz]],
  };
  const views = only ?? [...Object.keys(orbit), ...def.spawns.map((s) => `w-${s}`)];
  for (const v of views) {
    if (orbit[v]) {
      await page.evaluate(([p, t]) => {
        const s = (window as unknown as { __explorer3d: { session: { setMode(m: string): void; view: { camera: { position: { set(...a: number[]): void }; lookAt(...a: number[]): void }; requestRender(): void }; orbit: { controls: { target: { set(...a: number[]): void }; update(): void } } } } }).__explorer3d.session;
        s.setMode('observe');
        s.view.camera.position.set(...p);
        s.orbit.controls.target.set(...t);
        s.view.camera.lookAt(...t);
        s.orbit.controls.update();
        s.view.requestRender();
      }, orbit[v]);
    } else if (v.startsWith('w-')) {
      await page.evaluate((id) => {
        const s = (window as unknown as { __explorer3d: { session: { setMode(m: string): void; def: { spawns: Array<{ id: string }> }; walk: { teleport(sp: unknown): void } } } }).__explorer3d.session;
        s.setMode('explore');
        s.walk.teleport(s.def.spawns.find((x) => x.id === id));
      }, v.slice(2));
    } else continue;
    await page.waitForTimeout(900);
    await page.screenshot({ path: join(out, `${v}.png`) });
  }
  const stats = await page.evaluate(() => (window as unknown as { __explorer3d: { stats(): Record<string, unknown> } }).__explorer3d.stats());
  console.log(`[capture:3d] ${views.length} views (${quality}) → ${out} · ${JSON.stringify({ calls: stats.calls, triangles: stats.triangles, interiors: stats.interiors })}${errors.length ? ` · page errors: ${errors.join(' | ')}` : ''}`);
  await browser.close();
  const cmp = opt('compare');
  if (cmp) await compare(resolve(cmp), out);
}

async function main(): Promise<void> {
  const i = argv.indexOf('--compare-only');
  if (i >= 0) return compare(resolve(argv[i + 1]), resolve(argv[i + 2]));
  const sceneId = argv.find((a, k) => !a.startsWith('--') && (k === 0 || !argv[k - 1].startsWith('--')));
  if (!sceneId) throw new Error('usage: npm run capture:3d -- <sceneId> --out <dir> [--quality high] [--base http://localhost:5173] [--views hero,side] [--compare <dir>]');
  return capture(sceneId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
