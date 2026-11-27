/**
 * `npm run test:3d:unit` — pure-logic tests of the 3D explorer (node:assert, no browser, ~1 s):
 * collisions, adaptive quality hysteresis, the build guard's chunk-graph analysis, deterministic PRNG.
 */
import assert from 'node:assert/strict';
import { CollisionWorld, floorHeightAt, type Feet } from '../src/features/explorer3d/engine/collision';
import { AutoQualityController, initialAutoLevel, QUALITY_PRESETS } from '../src/features/explorer3d/engine/quality';
import { createRandom } from '../src/features/explorer3d/engine/random';
import { analyseBundle, isExplorerModule } from './vite/explorer3dGuard';

let passed = 0;
function test(name: string, fn: () => void): void {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}
/** Walks for `seconds` at `speed` m/s along (dx, dz) with 60 fps steps. */
function walk(world: CollisionWorld, feet: Feet, dx: number, dz: number, seconds: number, speed = 3): void {
  const dt = 1 / 60;
  for (let t = 0; t < seconds; t += dt) world.move(feet, dx * speed * dt, dz * speed * dt, dt);
}

console.log('explorer3d · collisions');
const room = () => {
  const w = new CollisionWorld();
  w.add({
    floors: [
      { minX: 0, maxX: 10, minZ: 0, maxZ: 10, y: 0 },
      // stairs climbing along +x from x 10 to 14, y 0 → 3, then a landing
      { minX: 10, maxX: 14, minZ: 0, maxZ: 2, y: 0, ramp: { axis: 'x', y1: 3 } },
      { minX: 14, maxX: 18, minZ: 0, maxZ: 2, y: 3 },
      // a 1 m high box top (not climbable)
      { minX: 2, maxX: 3, minZ: 6, maxZ: 7, y: 1 },
    ],
    walls: [{ minX: 5, maxX: 5.2, minY: 0, maxY: 3, minZ: 3, maxZ: 10 }],
  });
  return w;
};

test('a wall stops the player (and it slides along it)', () => {
  const w = room();
  const f = { x: 4, y: 0, z: 5 };
  walk(w, f, 1, 0.3, 2);
  assert.ok(f.x <= 5 - 0.3 + 1e-6, `crossed the wall: x=${f.x}`);
  assert.ok(f.z > 5.3, 'did not slide along the wall');
});

test('walking off every floor is impossible (ocean edge)', () => {
  const w = room();
  const f = { x: 1, y: 0, z: 9 };
  walk(w, f, 0, 1, 3);
  assert.ok(f.z <= 10, `left the floor: z=${f.z}`);
  assert.equal(f.y, 0);
});

test('a ramp (stairs) is climbed to the landing', () => {
  const w = room();
  const f = { x: 9, y: 0, z: 1 };
  walk(w, f, 1, 0, 3.5);
  assert.ok(f.x > 14, `did not reach the landing: x=${f.x}`);
  assert.equal(f.y, 3);
  assert.equal(floorHeightAt({ minX: 10, maxX: 14, minZ: 0, maxZ: 2, y: 0, ramp: { axis: 'x', y1: 3 } }, 12, 1), 1.5);
});

test('walking back down the stairs follows the ramp without falling', () => {
  const w = room();
  const f = { x: 15, y: 3, z: 1 };
  walk(w, f, -1, 0, 3);
  assert.ok(f.x < 10 && f.y === 0, `x=${f.x} y=${f.y}`);
  assert.equal(w.falling, false);
});

test('a step higher than stepUp is not climbed', () => {
  const w = room();
  const f = { x: 1, y: 0, z: 6.5 };
  walk(w, f, 1, 0, 1);
  assert.equal(f.y, 0, 'climbed a 1 m box');
});

test('a big drop makes the player fall and land', () => {
  const w = new CollisionWorld();
  w.add({ floors: [{ minX: 0, maxX: 4, minZ: 0, maxZ: 4, y: 0 }, { minX: 0, maxX: 2, minZ: 0, maxZ: 4, y: 0 }] });
  const f = { x: 1, y: 2, z: 1 };
  w.move(f, 0, 0, 1 / 60);
  assert.ok(w.falling, 'should be falling');
  for (let i = 0; i < 120; i++) w.move(f, 0, 0, 1 / 60);
  assert.equal(f.y, 0);
  assert.equal(w.falling, false);
});

test('walls above the head do not block (doors, beams)', () => {
  const w = new CollisionWorld();
  w.add({ floors: [{ minX: 0, maxX: 10, minZ: 0, maxZ: 10, y: 0 }], walls: [{ minX: 4, maxX: 6, minY: 2.2, maxY: 4, minZ: 0, maxZ: 10 }] });
  const f = { x: 2, y: 0, z: 5 };
  walk(w, f, 1, 0, 2);
  assert.ok(f.x > 6, `blocked by an overhead beam: x=${f.x}`);
});

console.log('explorer3d · adaptive quality');
test('initial level never trusts a software rasterizer', () => {
  assert.equal(initialAutoLevel({ coarsePointer: false, pixels: 1e6, cores: 16, memoryGb: 16, softwareRenderer: true }), 'low');
  assert.equal(initialAutoLevel({ coarsePointer: false, pixels: 2e6, cores: 12, memoryGb: 16, maxTextureSize: 16384 }), 'high');
  assert.equal(initialAutoLevel({ coarsePointer: true, pixels: 5e6, cores: 4, memoryGb: 2 }), 'low');
  assert.equal(initialAutoLevel({ coarsePointer: false, pixels: 2e6 }), 'medium');
});

const feed = (c: AutoQualityController, ms: number, seconds: number, stopOnChange = false) => {
  const changes: string[] = [];
  for (let t = 0; t < seconds * 1000; t += ms) {
    const r = c.sample(ms);
    if (r) {
      changes.push(r);
      if (stopOnChange) break;
    }
  }
  return changes;
};

test('steps down only after two slow windows, after the cooldown', () => {
  const c = new AutoQualityController('high', { windowMs: 1000, cooldownMs: 1000 });
  assert.deepEqual(feed(c, 40, 2.5), [], 'changed too early');
  assert.deepEqual(feed(c, 40, 1.5), ['medium']);
});

test('no oscillation: a level that was too slow is never re-entered', () => {
  const c = new AutoQualityController('high', { windowMs: 500, cooldownMs: 500 });
  feed(c, 40, 10, true); // → medium, then the device becomes fast
  assert.equal(c.level, 'medium');
  const changes = feed(c, 5, 20); // very fast afterwards
  assert.deepEqual(changes, [], `ping-pong: ${changes.join(',')}`);
});

test('steps up after sustained fast windows when allowed', () => {
  const c = new AutoQualityController('low', { windowMs: 500, cooldownMs: 0 });
  const fast = QUALITY_PRESETS.medium.targetFrameMs * 0.4;
  const changes = feed(c, fast, 2.6);
  assert.deepEqual(changes, ['medium']);
});

test('reports struggling at low', () => {
  const c = new AutoQualityController('low', { windowMs: 500, cooldownMs: 0 });
  feed(c, 80, 1.2);
  assert.equal(c.struggling, true);
});

console.log('explorer3d · build guard (chunk graph)');
const chunk = (fileName: string, o: Partial<{ isEntry: boolean; isDynamicEntry: boolean; facadeModuleId: string | null; imports: string[]; modules: string[] }>) => ({
  type: 'chunk',
  fileName,
  isEntry: !!o.isEntry,
  isDynamicEntry: !!o.isDynamicEntry,
  facadeModuleId: o.facadeModuleId ?? null,
  imports: o.imports ?? [],
  modules: Object.fromEntries((o.modules ?? []).map((m) => [m, { renderedLength: 10 }])),
  code: 'x',
});

test('module classification', () => {
  assert.equal(isExplorerModule('/r/node_modules/three/build/three.module.js'), true);
  assert.equal(isExplorerModule('/r/src/features/explorer3d/engine/collision.ts'), true);
  assert.equal(isExplorerModule('/r/src/features/explorer3d/launcher/registry.ts'), false);
  assert.equal(isExplorerModule('/r/src/features/explorer3d/types.ts'), false);
  assert.equal(isExplorerModule('C:\\r\\src\\features\\explorer3d\\viewer\\X.tsx'), true);
});

test('dynamic-only reachability passes', () => {
  const r = analyseBundle({
    a: chunk('assets/index.js', { isEntry: true, modules: ['/r/src/main.tsx'] }),
    b: chunk('assets/WorldRoute.js', { isDynamicEntry: true, facadeModuleId: '/r/src/routes/WorldRoute.tsx', modules: ['/r/src/features/explorer3d/launcher/Explorer3DHost.tsx'] }),
    c: chunk('assets/Viewer.js', { isDynamicEntry: true, facadeModuleId: '/r/src/features/explorer3d/viewer/Explorer3DViewer.tsx', imports: ['assets/three.js'], modules: ['/r/src/features/explorer3d/viewer/Explorer3DViewer.tsx'] }),
    d: chunk('assets/three.js', { modules: ['/r/node_modules/three/build/three.module.js'] }),
  });
  assert.deepEqual(r.violations, []);
  assert.deepEqual(r.explorerChunks.map((c) => c.kind).sort(), ['shared', 'viewer']);
});

test('a static path from a route to three.js fails', () => {
  const r = analyseBundle({
    a: chunk('assets/index.js', { isEntry: true }),
    b: chunk('assets/WorldRoute.js', { isDynamicEntry: true, facadeModuleId: '/r/src/routes/WorldRoute.tsx', imports: ['assets/shared.js'] }),
    s: chunk('assets/shared.js', { imports: ['assets/three.js'] }),
    d: chunk('assets/three.js', { modules: ['/r/node_modules/three/build/three.module.js'] }),
  });
  assert.equal(r.violations.length, 1);
  assert.match(r.violations[0], /WorldRoute\.js → assets\/shared\.js → assets\/three\.js/);
});

test('an emitted binary model fails', () => {
  const r = analyseBundle({ a: chunk('assets/index.js', { isEntry: true }), m: { type: 'asset', fileName: 'assets/ship-abc.glb' } as never });
  assert.equal(r.violations.length, 1);
});

console.log('explorer3d · determinism');
test('same seed, same sequence', () => {
  const a = createRandom(42);
  const b = createRandom(42);
  for (let i = 0; i < 100; i++) assert.equal(a(), b());
  assert.notEqual(createRandom(1)(), createRandom(2)());
});

console.log(`\n${passed} passed`);
