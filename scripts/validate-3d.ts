/**
 * `npm run validate:3d` — deterministic contract of the 3D explorer (~1 s, part of `npm run build`).
 *
 *  1. Registry: unique scene ids, one scene per location, world/location ids exist in the datasets.
 *  2. Loader wiring (syntax tree of `launcher/loaders.ts`): one loader per manifest; a `prototype` loader is wrapped in
 *     `__EXPLORER_3D_PROTOTYPES__ ? … : undefined` (so production builds drop it), an `available` one is not.
 *  3. Scene definitions: ids, zones, spawns, bounds; every hotspot points at an existing entity that the dataset
 *     already ties to the location, with no `needs_verification` data; provenance complete; `available` scenes need
 *     `rights: 'cleared'`.
 *  4. Asset policy: no binary 3D model in the repository; explorer code loads nothing remote (no URLs, no fetch, no
 *     three.js loaders).
 *  5. Import isolation (syntax trees of every file under `src/`): outside the explorer, only `launcher/` and
 *     `types.ts` may be imported, and no ordinary file imports `three`; the launcher reaches the engine, viewer and
 *     scenes through dynamic `import()` only. The artifact-level counterpart is the build guard
 *     (`scripts/vite/explorer3dGuard.ts`, real chunk graph).
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import type { WorldDataset } from '../src/types';
import type { SceneDefinition, SceneManifest } from '../src/features/explorer3d/types';
import { animeWorlds } from '../src/data/worlds';
import { hasWorldDataset, loadWorldDataset } from '../src/data/registry';
import { SCENE_MANIFESTS } from '../src/features/explorer3d/launcher/manifests';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const SRC = join(ROOT, 'src');
const EXPLORER = join(SRC, 'features/explorer3d');
const LAUNCHER = join(EXPLORER, 'launcher');
const LOADERS = join(LAUNCHER, 'loaders.ts');
const FLAG = '__EXPLORER_3D_PROTOTYPES__';
const MODEL_EXT = /\.(glb|gltf|fbx|obj|blend|dae|3ds|usdz?|stl|ply|drc|ktx2?|vrm|mtl)$/i;

const errors: string[] = [];
const warnings: string[] = [];
const err = (scope: string, msg: string) => errors.push(`[ERR ] ${scope} · ${msg}`);
const warn = (scope: string, msg: string) => warnings.push(`[WARN] ${scope} · ${msg}`);
const rel = (p: string) => relative(ROOT, p);

function parse(file: string): ts.SourceFile {
  return ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
}

/* ---------------------------------------------------------------- 1. registry */

const ids = new Set<string>();
const locations = new Set<string>();
for (const m of SCENE_MANIFESTS) {
  if (ids.has(m.id)) err(`scene/${m.id}`, 'duplicate scene id');
  ids.add(m.id);
  const key = `${m.worldId}/${m.locationId}`;
  if (locations.has(key)) err(`scene/${m.id}`, `location ${key} already has a scene (one scene per location)`);
  locations.add(key);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(m.id)) err(`scene/${m.id}`, 'id must be kebab-case <world>-<location>');
  if (m.status !== 'prototype' && m.status !== 'available') err(`scene/${m.id}`, `unknown status ${String(m.status)}`);
}

const datasets = new Map<string, WorldDataset>();
for (const m of SCENE_MANIFESTS) {
  const world = animeWorlds.find((w) => w.id === m.worldId);
  if (!world) {
    err(`scene/${m.id}`, `worldId ${m.worldId} is not registered in src/data/worlds.ts`);
    continue;
  }
  if (!hasWorldDataset(world.slug)) {
    err(`scene/${m.id}`, `world ${world.slug} has no dataset loader`);
    continue;
  }
  if (m.status === 'available' && world.status !== 'available') err(`scene/${m.id}`, `public scene in a world that is not public (${world.status})`);
  if (!datasets.has(m.worldId)) {
    const d = await loadWorldDataset(world.slug);
    if (d) datasets.set(m.worldId, d);
  }
}

/* ---------------------------------------------------------------- 2. loaders.ts wiring */

interface LoaderInfo {
  gated: boolean;
  specifier: string | null;
}
const loaders = new Map<string, LoaderInfo>();
{
  const sf = parse(LOADERS);
  const findImport = (n: ts.Node): string | null => {
    let found: string | null = null;
    const visit = (x: ts.Node) => {
      if (ts.isCallExpression(x) && x.expression.kind === ts.SyntaxKind.ImportKeyword && x.arguments[0] && ts.isStringLiteral(x.arguments[0])) {
        found ??= x.arguments[0].text;
      }
      ts.forEachChild(x, visit);
    };
    visit(n);
    return found;
  };
  const visit = (n: ts.Node) => {
    if (ts.isVariableDeclaration(n) && n.name.getText(sf) === 'SCENE_LOADERS' && n.initializer && ts.isObjectLiteralExpression(n.initializer)) {
      for (const p of n.initializer.properties) {
        if (!ts.isPropertyAssignment(p)) {
          err('loaders.ts', `unsupported property syntax: ${p.getText(sf).slice(0, 40)}`);
          continue;
        }
        const id = ts.isStringLiteral(p.name) || ts.isIdentifier(p.name) ? p.name.text : p.name.getText(sf);
        const init = p.initializer;
        const gated =
          ts.isConditionalExpression(init) &&
          ts.isIdentifier(init.condition) &&
          init.condition.text === FLAG &&
          ts.isIdentifier(init.whenFalse) &&
          init.whenFalse.text === 'undefined';
        loaders.set(id, { gated, specifier: findImport(init) });
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}
for (const m of SCENE_MANIFESTS) {
  const l = loaders.get(m.id);
  if (!l) {
    err(`scene/${m.id}`, 'no loader in launcher/loaders.ts');
    continue;
  }
  if (m.status === 'prototype' && !l.gated) err(`scene/${m.id}`, `prototype loader must be \`${FLAG} ? () => import(…) : undefined\` (else production ships it)`);
  if (m.status === 'available' && l.gated) err(`scene/${m.id}`, `available scene still gated by ${FLAG}: it would never be public`);
  if (!l.specifier || !l.specifier.startsWith('../worlds/')) err(`scene/${m.id}`, 'loader must dynamically import ../worlds/<world>/<location>/scene');
}
for (const id of loaders.keys()) if (!ids.has(id)) err('loaders.ts', `loader "${id}" has no manifest entry`);

/* ---------------------------------------------------------------- 3. definitions */

function relatesToLocation(d: WorldDataset, locationId: string, type: string, id: string): { exists: boolean; related: boolean; unverified: boolean } {
  const loc = d.locations.find((l) => l.id === locationId);
  switch (type) {
    case 'character': {
      const c = d.characters.find((x) => x.id === id);
      const related = !!loc?.characterIds?.includes(id) || d.events.some((e) => e.locationId === locationId && e.characterIds?.includes(id));
      return { exists: !!c, related, unverified: c?.referenceStatus === 'needs_verification' };
    }
    case 'event': {
      const e = d.events.find((x) => x.id === id);
      return { exists: !!e, related: e?.locationId === locationId || !!loc?.eventIds?.includes(id), unverified: e?.referenceStatus === 'needs_verification' };
    }
    case 'arc': {
      const a = d.arcs.find((x) => x.id === id);
      return { exists: !!a, related: !!loc?.arcIds?.includes(id) || !!a?.locationIds?.includes(locationId), unverified: a?.referenceStatus === 'needs_verification' };
    }
    case 'place': {
      const p = d.locations.find((x) => x.id === id);
      return { exists: !!p, related: id === locationId, unverified: p?.referenceStatus === 'needs_verification' };
    }
    case 'faction': {
      const f = d.factions.find((x) => x.id === id);
      return { exists: !!f, related: !!f?.locationIds?.includes(locationId), unverified: f?.referenceStatus === 'needs_verification' };
    }
    default:
      return { exists: false, related: false, unverified: false };
  }
}

const inBox = (p: readonly number[], b: SceneDefinition['bounds']) => p.every((v, i) => v >= b.min[i] && v <= b.max[i]);

async function checkDefinition(m: SceneManifest): Promise<void> {
  const l = loaders.get(m.id);
  if (!l?.specifier) return;
  const sceneFile = resolve(LAUNCHER, `${l.specifier}.ts`);
  const configFile = join(dirname(sceneFile), 'config.ts');
  const scope = `scene/${m.id}`;
  if (!existsSync(sceneFile)) {
    err(scope, `${rel(sceneFile)} not found`);
    return;
  }
  if (!existsSync(configFile)) {
    err(scope, `${rel(configFile)} not found (scene data lives in config.ts)`);
    return;
  }
  const mod = (await import(configFile)) as { definition?: SceneDefinition };
  const def = mod.definition;
  if (!def) {
    err(scope, `${rel(configFile)} must export \`definition\``);
    return;
  }
  if (def.id !== m.id || def.worldId !== m.worldId || def.locationId !== m.locationId) err(scope, 'definition id/worldId/locationId differ from the manifest');
  if (!Number.isInteger(def.seed)) err(scope, 'seed must be an integer (deterministic generation)');
  const d = datasets.get(m.worldId);
  const loc = d?.locations.find((x) => x.id === m.locationId);
  if (d && !loc) err(scope, `location ${m.locationId} not found in the ${m.worldId} dataset`);
  if (m.status === 'available' && loc?.referenceStatus === 'needs_verification') err(scope, 'public scene for an unverified location');

  const zoneIds = new Set<string>();
  for (const z of def.zones) {
    if (zoneIds.has(z.id)) err(scope, `duplicate zone ${z.id}`);
    zoneIds.add(z.id);
    if (z.bounds.min.some((v, i) => v >= z.bounds.max[i])) err(scope, `zone ${z.id}: empty bounds`);
  }
  const spawnIds = new Set<string>();
  for (const s of def.spawns) {
    if (spawnIds.has(s.id)) err(scope, `duplicate spawn ${s.id}`);
    spawnIds.add(s.id);
    const z = def.zones.find((x) => x.id === s.zone);
    if (!z) err(scope, `spawn ${s.id}: unknown zone ${s.zone}`);
    else if (!inBox(s.position, z.bounds)) err(scope, `spawn ${s.id} is outside its zone ${s.zone}`);
  }
  if (!spawnIds.has(def.defaultSpawn)) err(scope, `defaultSpawn ${def.defaultSpawn} does not exist`);
  if (!inBox(def.camera.position, def.bounds) || !inBox(def.camera.target, def.bounds)) err(scope, 'camera outside scene bounds');
  if (def.camera.minDistance <= 0 || def.camera.minDistance >= def.camera.maxDistance) err(scope, 'camera min/max distance incoherent');

  const hotspotIds = new Set<string>();
  const entities = new Set<string>();
  for (const h of def.hotspots) {
    if (hotspotIds.has(h.id)) err(scope, `duplicate hotspot ${h.id}`);
    hotspotIds.add(h.id);
    const key = `${h.entity.type}:${h.entity.id}`;
    if (entities.has(key)) warn(scope, `entity ${key} has more than one hotspot`);
    entities.add(key);
    if (!zoneIds.has(h.zone)) err(scope, `hotspot ${h.id}: unknown zone ${h.zone}`);
    if (!inBox(h.position, def.bounds)) err(scope, `hotspot ${h.id} outside scene bounds`);
    if (!d) continue;
    const r = relatesToLocation(d, m.locationId, h.entity.type, h.entity.id);
    if (!r.exists) err(scope, `hotspot ${h.id}: ${key} does not exist in the dataset`);
    else if (!r.related) err(scope, `hotspot ${h.id}: ${key} is not linked to ${m.locationId} in the dataset (link it there first, never in the scene)`);
    if (r.unverified) err(scope, `hotspot ${h.id}: ${key} is needs_verification`);
  }

  const p = def.provenance;
  if (p.method !== 'procedural') err(scope, 'provenance.method must be procedural');
  if (!p.author?.trim() || !p.license?.trim()) err(scope, 'provenance needs author and license');
  if (!p.sources?.length) err(scope, 'provenance needs at least one source');
  if (!p.notes?.length) err(scope, 'provenance needs notes (canon vs interpretive parts)');
  for (const s of p.sources ?? []) if (s.url && !/^https:\/\//.test(s.url)) err(scope, `source url must be https: ${s.url}`);
  if (m.status === 'available' && p.rights !== 'cleared') err(scope, "available scene requires provenance.rights 'cleared' (owner approval)");
  if (!def.zones.some((z) => z.reconstruction === 'interpretive') && p.notes.every((n) => !/interpretive/i.test(n))) {
    warn(scope, 'no interpretive part declared: double-check that every element is documented in the work');
  }
}
for (const m of SCENE_MANIFESTS) await checkDefinition(m);

/* ---------------------------------------------------------------- 4. asset policy */

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
{
  let files: string[] = [];
  try {
    files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: ROOT, encoding: 'utf8' }).split('\n');
  } catch {
    files = walk(SRC).map(rel);
  }
  for (const f of files) if (MODEL_EXT.test(f)) err('assets', `binary 3D model in the repository: ${f} (scenes are procedural)`);

  const forbiddenNew = new Set(['GLTFLoader', 'FBXLoader', 'OBJLoader', 'TextureLoader', 'ImageLoader', 'FileLoader', 'XMLHttpRequest', 'Image', 'Worker']);
  for (const file of walk(EXPLORER).filter((f) => /\.tsx?$/.test(f))) {
    const sf = parse(file);
    const visit = (n: ts.Node) => {
      if (ts.isStringLiteralLike(n) && /^(https?:)?\/\//.test(n.text) && !ts.isImportDeclaration(n.parent)) err('assets', `${rel(file)}: remote URL "${n.text}" (explorer code loads nothing remote)`);
      if (ts.isImportDeclaration(n) && ts.isStringLiteral(n.moduleSpecifier) && /\/loaders\//.test(n.moduleSpecifier.text)) err('assets', `${rel(file)}: three.js loader import ${n.moduleSpecifier.text}`);
      if (ts.isNewExpression(n) && ts.isIdentifier(n.expression) && forbiddenNew.has(n.expression.text)) err('assets', `${rel(file)}: new ${n.expression.text}() (no file/remote loading in scenes)`);
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'fetch') err('assets', `${rel(file)}: fetch() (no network access in the explorer)`);
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
}

/* ---------------------------------------------------------------- 5. import isolation */

function resolveSpecifier(from: string, spec: string): string {
  if (spec === 'three' || spec.startsWith('three/')) return 'three';
  if (spec.startsWith('@/')) return join(SRC, spec.slice(2));
  if (spec.startsWith('.')) return resolve(dirname(from), spec);
  return spec;
}
function isHeavy(target: string): boolean {
  if (target === 'three') return true;
  if (!target.startsWith(EXPLORER)) return false;
  const t = target.replace(/\.(tsx?|js)$/, '');
  return !t.startsWith(LAUNCHER) && t !== join(EXPLORER, 'types');
}
let scanned = 0;
for (const file of walk(SRC).filter((f) => /\.tsx?$/.test(f))) {
  const insideHeavy = file.startsWith(EXPLORER) && !file.startsWith(LAUNCHER) && file !== join(EXPLORER, 'types.ts');
  if (insideHeavy) continue; // the lazy side may import anything
  scanned++;
  const sf = parse(file);
  const visit = (n: ts.Node) => {
    let spec: string | null = null;
    let typeOnly = false;
    let dynamic = false;
    if (ts.isImportDeclaration(n) && ts.isStringLiteral(n.moduleSpecifier)) {
      spec = n.moduleSpecifier.text;
      const c = n.importClause;
      typeOnly = !!c && (c.isTypeOnly || (!c.name && !!c.namedBindings && ts.isNamedImports(c.namedBindings) && c.namedBindings.elements.length > 0 && c.namedBindings.elements.every((e) => e.isTypeOnly)));
    } else if (ts.isExportDeclaration(n) && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) {
      spec = n.moduleSpecifier.text;
      typeOnly = n.isTypeOnly;
    } else if (ts.isCallExpression(n) && n.expression.kind === ts.SyntaxKind.ImportKeyword && n.arguments[0] && ts.isStringLiteral(n.arguments[0])) {
      spec = n.arguments[0].text;
      dynamic = true;
    }
    if (spec && !typeOnly) {
      const target = resolveSpecifier(file, spec);
      if (isHeavy(target)) {
        if (!dynamic) err('isolation', `${rel(file)} statically imports ${spec}: only launcher/ and types.ts may be imported by ordinary code`);
        else if (!file.startsWith(LAUNCHER)) err('isolation', `${rel(file)} dynamically imports ${spec}: the explorer is entered only through launcher/`);
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}

/* ---------------------------------------------------------------- report */

console.log('=== AniMapVerse · 3D explorer validator ===');
console.log(`Scenes: ${SCENE_MANIFESTS.length} (${SCENE_MANIFESTS.filter((m) => m.status === 'available').length} public) · files checked for isolation: ${scanned}`);
for (const w of warnings) console.log(w);
for (const e of errors) console.log(e);
if (errors.length) {
  console.log(`\n${errors.length} error(s).`);
  process.exit(1);
}
console.log('OK');
