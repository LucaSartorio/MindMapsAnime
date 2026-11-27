import { BufferAttribute, BufferGeometry, CanvasTexture, Color, Group, LineSegments, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, Vector3, type Object3D } from 'three';
import { GeometryBatch, SOURCE_COLORS, batchToMesh, type ColorSpec } from '../../../engine/batch';
import type { FloorRect, WallBox } from '../../../engine/collision';
import type { BuildContext, ColliderSet, SceneBuild, SceneModule, ZoneBuild } from '../../../engine/sceneModule';
import {
  chamferedPlan,
  hipRoof,
  latticeBand,
  openLoop,
  planFloors,
  planHalfZ,
  railing,
  segmentWall,
  slab,
  stairs,
  type Batches,
  type Plan,
  type SegmentOpening,
} from '../../../primitives/architecture';
import { createClouds, createDaylight, createOcean, createSky } from '../../../primitives/environment';
import { chairGeometry, chairsAround, instanced, roundTableGeometry, type Placement } from '../../../primitives/furniture';
import { PartBuilder, type XYZ } from '../../../primitives/parts';
import {
  deckFloorSlices,
  deckOutline,
  ellipsoidRings,
  extrudedSilhouette,
  flatPolygon,
  flatShape,
  hullRings,
  loftGeometry,
  sailGeometry,
  type HullProfile,
} from '../../../primitives/ships';
import { definition, DECK_Y, FIN_Y, PLAN, T1_TOP, T2_TOP, T3_TOP } from './config';

/**
 * Baratie — procedural builder (reference-driven, see docs/explorer3d/onepiece-baratie.md). Everything is generated
 * from numbers: no model, no image file. Plan (metres): hull x −26 … 17.5 (round orange bowl), white fish head to
 * x ≈ 30; T1 oval dining hall (x −18 … 12), T2 octagonal kitchen, T3 hip-roofed quarters; two masts with striped
 * sails; wooden battle fins deployed on both sides.
 */
const C = {
  hull: '#e4592b',
  hullPlank: '#cc4a22',
  hullTrim: '#f3ede0',
  hullWater: '#a43a1c',
  head: '#f7f4ee',
  headShade: '#dcd6cc',
  lips: '#f7a11f',
  lipsDark: '#e2770f',
  mouth: '#2a1515',
  iron: '#34383e',
  gold: '#e9b83b',
  eye: '#141414',
  eyeRing: '#f4c534',
  wall: '#72cfb0',
  wallLow: '#58b896',
  wallIn: '#f3ead2',
  wainscot: '#8d5631',
  kitchenIn: '#eef1ec',
  kitchenLow: '#6f8f98',
  quartersIn: '#d8b07c',
  trim: '#f4efe2',
  lattice: '#6a2c22',
  frame: '#f0c44a',
  glass: '#5b96cc',
  glassWarm: '#ffd88a',
  deck: '#d8c290',
  seam: '#b39a68',
  fin: '#dcc796',
  finRim: '#a98c5a',
  roof: '#ef6b2b',
  roofTop: '#f2efe6',
  chimney: '#d24a2a',
  mast: '#5aae8b',
  mastBand: '#f2ecd9',
  ratline: '#2e3035',
  sailY: '#f7b42c',
  sailW: '#fbf5e6',
  flag: '#fbf7ee',
  flagStripe: '#d9452b',
  tail: '#e4592b',
  tailTrim: '#f2c94c',
  tailPanel: '#f4f0e6',
  floorHall: '#a86a3c',
  floorSeam: '#8a5129',
  ceiling: '#f6efdc',
  cloth: '#fbf7ef',
  cushion: '#b8423a',
  wood: '#7a4a2a',
  stove: '#2d2f33',
  flame: '#ff8a2a',
  steel: '#b8c0c8',
  brass: '#c9a14a',
  tile: '#e8e4da',
  tile2: '#cfc9bc',
  plant: '#3f9b55',
  plantDark: '#2d7a45',
  terracotta: '#b86b3c',
  carpet: '#9c2f35',
  carpetDark: '#7a2228',
  slate: '#2f4a3f',
  woodLight: '#d6ad6c',
  woodDark: '#573320',
  cold: '#9fdcf0',
  mirror: '#cfe6ee',
  bulb: '#fff0c4',
};

/** Round, slightly egg-shaped hull (wider at mid-length), very full sections: the "bowl" of the reference. */
const HULL: HullProfile = {
  xStern: -26,
  xBow: 17.5,
  halfWidth: (t) => 13 * Math.pow(Math.sin(Math.PI * (0.03 + 0.94 * t)), 0.5),
  deckY: () => DECK_Y,
  keelY: (t) => -3.2 + 0.9 * t * t * t,
  fullness: 0.8,
  stations: 52,
  sectionPoints: 24,
};
const hullW = (x: number) => HULL.halfWidth(Math.min(1, Math.max(0, (x - HULL.xStern) / (HULL.xBow - HULL.xStern))));

/** Fish head: a white ball (short neck at the hull, full round front), not an elongated snout. */
const HEAD = { ...PLAN.head, ry: 5.5, rz: 6.0, cy: DECK_Y - 0.5 };
const headR = (t: number) => (t < 0.22 ? 0.9 + 0.1 * (t / 0.22) : Math.pow(Math.max(0, 1 - ((t - 0.22) / 0.78) ** 2.4), 1 / 2.4));
const MOUTH = { x: PLAN.head.x1 - 0.55, y: DECK_Y - 1.35 };

/** Fins (battle platforms): crescent between the hull side and this ellipse. */
const FIN = { cx: -3.5, rx: 18.5, rz: 20.5, x0: -16, x1: 9.5 };
const finOuterZ = (x: number) => FIN.rz * Math.sqrt(Math.max(0, 1 - ((x - FIN.cx) / FIN.rx) ** 2));

const tmp = new Color();
const linear = (hex: string): Color => new Color(hex);

/** T1 outline: an ellipse with a segment straddling each axis (front door, back door, side door). */
function t1Plan(): Plan {
  const { cx, cz, rx, rz, segments } = PLAN.t1;
  const out: Plan = [];
  for (let i = 0; i < segments; i++) {
    const a = ((i + 0.5) / segments) * Math.PI * 2;
    out.push([cx + Math.cos(a) * rx, cz + Math.sin(a) * rz]);
  }
  return out;
}
const t2Plan = (): Plan => chamferedPlan(PLAN.t2.cx, PLAN.t2.cz, PLAN.t2.hx, PLAN.t2.hz, PLAN.t2.chamfer);
const t3Plan = (): Plan => chamferedPlan(PLAN.t3.cx, PLAN.t3.cz, PLAN.t3.hx, PLAN.t3.hz, 0.001);
const rectPlan = (r: { minX: number; maxX: number; minZ: number; maxZ: number }): Plan => [
  [r.minX, r.minZ],
  [r.maxX, r.minZ],
  [r.maxX, r.maxZ],
  [r.minX, r.maxZ],
];

/**
 * Two-tone walls in one call: faces whose normal points away from the building centre get the outside colours,
 * faces pointing inwards the interior ones (with a wainscot band). Free: just a colour function per vertex.
 */
function twoTone(cx: number, cz: number, outside: [string, string, number], inside: [string, string, number]): ColorSpec {
  const o0 = linear(outside[0]);
  const o1 = linear(outside[1]);
  const i0 = linear(inside[0]);
  const i1 = linear(inside[1]);
  return (p, n) => {
    const inward = n.x * (p.x - cx) + n.z * (p.z - cz) < 0;
    if (inward) return p.y < inside[2] ? i1 : i0;
    return p.y < outside[2] ? o1 : o0;
  };
}

function hullColor(p: Vector3): Color {
  if (p.y > DECK_Y - 0.75) return tmp.set(C.hullTrim);
  if (p.y < 0.2) return tmp.set(C.hullWater);
  return tmp.set(Math.floor((p.y + 10) / 0.55) % 2 === 0 ? C.hull : C.hullPlank);
}

function headColor(p: Vector3): Color {
  return tmp.set((p.y - HEAD.cy) / HEAD.ry < -0.45 ? C.headShade : C.head);
}

function splitOutline(points: Array<[number, number]>, gap: (x: number, z: number) => boolean): Array<Array<[number, number]>> {
  const out: Array<Array<[number, number]>> = [];
  let cur: Array<[number, number]> = [];
  const n = points.length;
  const start = points.findIndex(([x, z]) => !gap(x, z));
  for (let k = 0; k <= n; k++) {
    const p = points[(start + k) % n];
    if (gap(p[0], p[1])) {
      if (cur.length > 1) out.push(cur);
      cur = [];
    } else cur.push(p);
  }
  if (cur.length > 1) out.push(cur);
  return out;
}

/** Cylinder from A to B (rigging, rails). */
function strut(pb: PartBuilder, b: GeometryBatch, A: XYZ, B: XYZ, r: number, color: string, segments = 5): void {
  const d = new Vector3(B[0] - A[0], B[1] - A[1], B[2] - A[2]);
  const len = d.length();
  d.normalize();
  const rotX = Math.atan2(d.z, d.y);
  const rotZ = -Math.asin(Math.max(-1, Math.min(1, d.x)));
  pb.cylinder(b, [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2], r, len, color, { segments, rot: [rotX, 0, rotZ] });
}

/** Rope ladder (ratlines) from A down to B, `width` wide, rungs every `step`. */
function ratlines(pb: PartBuilder, b: GeometryBatch, A: XYZ, B: XYZ, width: number, step: number, rungs: boolean): void {
  const dir = new Vector3(B[0] - A[0], B[1] - A[1], B[2] - A[2]);
  const side = new Vector3(dir.z, 0, -dir.x).normalize().multiplyScalar(width / 2);
  for (const s of [-1, 1]) {
    strut(pb, b, [A[0] + side.x * s * 0.4, A[1], A[2] + side.z * s * 0.4], [B[0] + side.x * s, B[1], B[2] + side.z * s], 0.05, C.ratline, 4);
  }
  if (!rungs) return;
  const n = Math.floor(dir.length() / step);
  for (let k = 1; k < n; k++) {
    const t = k / n;
    const w = 0.4 + 0.6 * t;
    const cx = A[0] + dir.x * t;
    const cy = A[1] + dir.y * t;
    const cz = A[2] + dir.z * t;
    strut(pb, b, [cx - side.x * w, cy, cz - side.z * w], [cx + side.x * w, cy, cz + side.z * w], 0.03, C.ratline, 3);
  }
}

function mergeColliders(...sets: Array<{ floors?: FloorRect[]; walls?: WallBox[] }>): ColliderSet {
  return { floors: sets.flatMap((s) => s.floors ?? []), walls: sets.flatMap((s) => s.walls ?? []) };
}

/* ------------------------------------------------------------------------------------------ hull, head, tail, fins */

/**
 * Plank seams as ink lines following the hull curvature (one LineSegments, shares the ink material): vertex colours
 * on a sparse hull mesh blur thin bands, lines keep the drawn "anime" plank look at any distance.
 */
function hullSeams(ctx: BuildContext): Object3D | null {
  if (!ctx.quality.outlines) return null;
  const pos: number[] = [];
  const top = DECK_Y;
  const samples = 56;
  for (let y = DECK_Y - 1.3; y > 0.4; y -= 0.62) {
    for (const side of [-1, 1]) {
      let prev: [number, number, number] | null = null;
      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const x = HULL.xStern + (HULL.xBow - HULL.xStern) * t;
        if (x > HEAD.x0 - 0.2) break;
        const keel = HULL.keelY(t);
        const r = (top - y) / (top - keel);
        if (r <= 0 || r >= 1) {
          prev = null;
          continue;
        }
        const a = Math.asin(Math.pow(r, 1 / HULL.fullness));
        const z = side * HULL.halfWidth(t) * Math.cos(a) * 1.004;
        const p: [number, number, number] = [x, y, z];
        if (prev) pos.push(...prev, ...p);
        prev = p;
      }
    }
  }
  const g = ctx.tracker.track(new BufferGeometry());
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  const lines = new LineSegments(g, ctx.materials.ink);
  lines.name = 'hull:seams:ink';
  return lines;
}

function buildHull(ctx: BuildContext, pb: PartBuilder, smooth: GeometryBatch, solid: GeometryBatch, detail: GeometryBatch): ColliderSet {
  const low = ctx.level === 'low';
  const hull = loftGeometry(
    ctx.tracker,
    hullRings({ ...HULL, stations: low ? 30 : HULL.stations, sectionPoints: low ? 14 : HULL.sectionPoints }),
    { closed: false, capStart: true, flip: true },
  );
  pb.custom(smooth, hull, [0, 0, 0], hullColor);
  pb.custom(solid, flatPolygon(ctx.tracker, deckOutline(HULL, 0.05, 48), DECK_Y), [0, 0, 0], C.deck);

  // Bulwark: lattice balustrade along the deck edge (the iconic dark band with white crosses), open at the fin
  // roots and where the head joins the hull.
  const walls: WallBox[] = [];
  const outline = deckOutline(HULL, 0.28, 48);
  for (const line of splitOutline(outline, (x) => (x > -10 && x < 2) || x > HEAD.x0 - 0.4)) {
    walls.push(...latticeBand(pb, solid, { points: line, y: DECK_Y, height: 1.0, panel: 0.9, boardColor: C.lattice, crossColor: C.trim, railColor: C.trim, crosses: !low, collide: true }));
  }

  // Cannon ports along both sides ("a small array of cannons lined on the sides").
  for (let x = -18; x <= 10; x += 4) {
    for (const s of [-1, 1]) {
      const w = hullW(x) * 0.985;
      const slope = (hullW(x + 0.5) - hullW(x - 0.5)) / 1;
      const yaw = s * Math.atan(slope);
      pb.box(solid, [x, DECK_Y - 1.4, s * w], [0.7, 0.55, 0.3], C.iron, [0, yaw, 0]);
      if (!low) pb.cylinder(detail, [x, DECK_Y - 1.4, s * (w + 0.35)], 0.13, 0.7, C.iron, { segments: 8, rot: [Math.PI / 2, 0, 0] });
    }
  }

  // Head back is not walkable; deck floors.
  walls.push({ minX: HEAD.x0 - 0.3, maxX: HEAD.x0 + 2, minY: DECK_Y - 1, maxY: DECK_Y + 6, minZ: -7, maxZ: 7 });
  const floors: FloorRect[] = deckFloorSlices(HULL, DECK_Y, { inset: 0.45, slices: 40, xMax: HEAD.x0 - 0.35 });
  return { floors, walls };
}

function buildHead(ctx: BuildContext, pb: PartBuilder, smooth: GeometryBatch, solid: GeometryBatch): void {
  const low = ctx.level === 'low';
  const rings = ellipsoidRings(HEAD.x0, HEAD.x1, low ? 22 : 40, low ? 20 : 36, (t) => HEAD.ry * headR(t), (t) => HEAD.rz * headR(t), () => HEAD.cy);
  pb.custom(smooth, loftGeometry(ctx.tracker, rings, { closed: true, capStart: true, capEnd: true, flip: true }), [0, 0, 0], headColor);
  // Gold collar where the detachable head meets the hull.
  pb.torus(smooth, [HEAD.x0 + 0.25, HEAD.cy, 0], HEAD.ry * 1.01, 0.32, C.gold, { segments: 36, rot: [0, Math.PI / 2, 0], scale: [HEAD.rz / HEAD.ry, 1, 1] });
  // Big "duck" lips: an elliptic torus around a dark mouth, three cannon muzzles inside.
  // Duck lips: wide, flat, protruding forward and slightly up (upper lip overhangs), around a dark mouth.
  pb.sphere(smooth, [MOUTH.x + 0.1, MOUTH.y, 0], [0.9, 1.0, 2.3], C.mouth, 20);
  pb.torus(smooth, [MOUTH.x + 0.45, MOUTH.y, 0], 1, 0.6, C.lips, { segments: 30, rot: [0, Math.PI / 2, -0.14], scale: [2.6, 1.3, 2.0] });
  pb.torus(smooth, [MOUTH.x + 1.15, MOUTH.y + 0.05, 0], 1, 0.28, C.lipsDark, { segments: 30, rot: [0, Math.PI / 2, -0.14], scale: [2.3, 1.02, 1.1] });
  for (const z of [-0.85, 0, 0.85]) {
    pb.cylinder(solid, [MOUTH.x + 0.35, MOUTH.y, z], 0.27, 1.3, C.iron, { segments: 12, rot: [0, 0, -Math.PI / 2] });
    pb.cylinder(solid, [MOUTH.x + 1.0, MOUTH.y, z], 0.34, 0.16, C.iron, { segments: 12, rot: [0, 0, -Math.PI / 2] });
  }
  // Small black eyes with a yellow ring, high on the head (reference: friendly, round).
  const ex = HEAD.x0 + (HEAD.x1 - HEAD.x0) * 0.6;
  const ey = HEAD.cy + 2.7;
  const t = (ex - HEAD.x0) / (HEAD.x1 - HEAD.x0);
  const k = headR(t);
  const yRel = (ey - HEAD.cy) / (HEAD.ry * k);
  const ez = HEAD.rz * k * Math.sqrt(Math.max(0, 1 - yRel * yRel));
  for (const s of [-1, 1]) {
    const tilt = -s * 0.55;
    pb.sphere(smooth, [ex, ey, s * (ez - 0.05)], [0.62, 0.62, 0.3], C.eye, 14, [tilt, 0, 0]);
    pb.torus(smooth, [ex, ey, s * (ez - 0.02)], 0.78, 0.13, C.eyeRing, { segments: 20, rot: [tilt, 0, 0] });
    pb.sphere(smooth, [ex + 0.2, ey + 0.22, s * (ez + 0.18)], 0.13, C.head, 8);
  }
}

function buildTail(ctx: BuildContext, pb: PartBuilder, smooth: GeometryBatch, solid: GeometryBatch): WallBox[] {
  // Tall stern plate (official model kit): orange body, yellow rim, white panel, dark bars.
  const body: Array<[number, number]> = [[0, 0], [3.4, 0], [4.2, 0.8], [4.2, 7.2], [3.4, 8.2], [0.6, 8.2], [0, 7.4]];
  const rim: Array<[number, number]> = [[-0.25, -0.2], [3.6, -0.2], [4.5, 0.7], [4.5, 7.4], [3.6, 8.5], [0.5, 8.5], [-0.25, 7.6]];
  const panel: Array<[number, number]> = [[0.5, 0.9], [2.6, 0.9], [2.6, 6.2], [0.5, 6.2]];
  const x0 = -22.2;
  const yaw: XYZ = [0, Math.PI, 0];
  pb.custom(smooth, extrudedSilhouette(ctx.tracker, rim, 0.55, 0.05, 2), [x0, DECK_Y - 0.4, 0], C.tailTrim, yaw);
  pb.custom(smooth, extrudedSilhouette(ctx.tracker, body, 0.8, 0.06, 2), [x0, DECK_Y - 0.4, 0], C.tail, yaw);
  pb.custom(smooth, extrudedSilhouette(ctx.tracker, panel, 0.92, 0.03, 1), [x0, DECK_Y - 0.4, 0], C.tailPanel, yaw);
  for (const y of [2.2, 4.6]) pb.box(solid, [x0 - 1.6, DECK_Y - 0.4 + y, 0], [1.8, 0.22, 1.02], C.iron);
  return [{ minX: x0 - 4.6, maxX: x0 + 0.3, minY: DECK_Y - 1, maxY: DECK_Y + 8, minZ: -0.6, maxZ: 0.6 }];
}

function buildFins(ctx: BuildContext, pb: PartBuilder, smooth: GeometryBatch, detail: GeometryBatch): FloorRect[] {
  const samples = ctx.level === 'low' ? 16 : 30;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= samples; i++) {
    const x = FIN.x0 + ((FIN.x1 - FIN.x0) * i) / samples;
    pts.push([x, finOuterZ(x)]);
  }
  for (let i = samples; i >= 0; i--) {
    const x = FIN.x0 + ((FIN.x1 - FIN.x0) * i) / samples;
    pts.push([x, hullW(x) - 0.15]);
  }
  const geo = extrudedSilhouette(ctx.tracker, pts, 0.38, 0.06, 2);
  const yC = FIN_Y - 0.25;
  const floors: FloorRect[] = [];
  for (const s of [-1, 1]) {
    // Shape Y → world ±Z (outwards), extrusion → world Y.
    pb.custom(smooth, geo, [0, yC, 0], C.fin, [(s * Math.PI) / 2, 0, 0]);
    // Rim plank along the outer edge + radial seams (planks), seams only where they are visible.
    for (let i = 0; i < samples; i++) {
      const [ax, az] = pts[i];
      const [bx, bz] = pts[i + 1];
      const len = Math.hypot(bx - ax, bz - az);
      pb.box(smooth, [(ax + bx) / 2, FIN_Y + 0.02, s * ((az + bz) / 2 - 0.25)], [len + 0.05, 0.12, 0.5], C.finRim, [0, Math.atan2(-(s * (bz - az)), bx - ax), 0]);
    }
    if (ctx.level !== 'low') {
      for (let x = FIN.x0 + 1.2; x < FIN.x1 - 0.6; x += 1.1) {
        const zi = hullW(x);
        const zo = finOuterZ(x) - 0.5;
        if (zo - zi < 0.6) continue;
        pb.box(detail, [x, FIN_Y + 0.01, s * (zi + zo) / 2], [0.05, 0.02, zo - zi], C.seam);
      }
    }
    // Walkable slices.
    const n = 22;
    for (let i = 0; i < n; i++) {
      const a = FIN.x0 + ((FIN.x1 - FIN.x0) * i) / n;
      const b = FIN.x0 + ((FIN.x1 - FIN.x0) * (i + 1)) / n;
      const zin = Math.max(hullW(a), hullW(b), hullW((a + b) / 2)) - 0.55;
      const zout = Math.min(finOuterZ(a), finOuterZ(b)) - 0.45;
      if (zout - zin < 0.6) continue;
      floors.push({ minX: a, maxX: b, minZ: s < 0 ? -zout : zin, maxZ: s < 0 ? -zin : zout, y: FIN_Y });
    }
  }
  return floors;
}

/* ------------------------------------------------------------------------------------------ the restaurant tiers */

function t1Openings(i: number, len: number): SegmentOpening[] {
  const n = PLAN.t1.segments;
  if (i === n - 1) return [{ at: len / 2, width: 2.1, bottom: 0, top: 3.5, kind: 'door', arched: true }]; // front
  if (i === n / 2 - 1) return [{ at: len / 2, width: 1.6, bottom: 0, top: 3.0, kind: 'door', arched: true }]; // back
  if (i === Math.round(n / 4) - 1) return [{ at: len / 2, width: 1.6, bottom: 0, top: 3.0, kind: 'door', arched: true }]; // starboard
  if (len < 2.2) return [];
  return [{ at: len / 2, width: Math.min(1.5, len - 1), bottom: 1.15, top: 3.75, kind: 'arch' }];
}

function buildTiers(ctx: BuildContext, pb: PartBuilder, b: Batches, detail: GeometryBatch): ColliderSet {
  const low = ctx.level === 'low';
  const walls: WallBox[] = [];
  const floors: FloorRect[] = [];
  const p1 = t1Plan();
  const p2 = t2Plan();
  const p3 = t3Plan();
  const { cx, cz } = PLAN.t1;
  const glassFrame = { frameColor: C.frame, glassColor: C.glass };

  // ---- T1: oval dining hall walls (mint outside, cream + wood wainscot inside).
  const t1Color = twoTone(cx, cz, [C.wall, C.wallLow, DECK_Y + 0.55], [C.wallIn, C.wainscot, DECK_Y + 1.05]);
  for (let i = 0; i < p1.length; i++) {
    const a = p1[i];
    const c = p1[(i + 1) % p1.length];
    const len = Math.hypot(c[0] - a[0], c[1] - a[1]);
    walls.push(...segmentWall(pb, b, { a, b: c, y0: DECK_Y, height: T1_TOP - DECK_Y, thickness: 0.3, color: t1Color, ...glassFrame, openings: t1Openings(i, len) }));
    // White fascia under the terrace, slightly proud of the wall.
    const yaw = Math.atan2(-(c[1] - a[1]), c[0] - a[0]);
    pb.box(b.solid, [(a[0] + c[0]) / 2, T1_TOP - 0.2, (a[1] + c[1]) / 2], [len + 0.1, 0.4, 0.46], C.trim, [0, yaw, 0]);
  }
  // T1 roof = terrace ring (around T2) + ceiling of the hall (with the stairwell).
  pb.custom(b.solid, flatShape(ctx.tracker, p1, [p2], T1_TOP, 'up'), [0, 0, 0], C.deck);
  // Terrace balustrade, open where the outer stairs arrive (−z side, x ≈ −5.8).
  const gapIdx = p1.findIndex((p, i) => {
    const q = p1[(i + 1) % p1.length];
    const mx = (p[0] + q[0]) / 2;
    return mx > -7.6 && mx < -4.4 && (p[1] + q[1]) / 2 < 0;
  });
  walls.push(...latticeBand(pb, b.solid, { points: p1, closed: true, gaps: [gapIdx], y: T1_TOP, height: 0.95, panel: 0.9, boardColor: C.lattice, crossColor: C.trim, railColor: C.trim, crosses: !low, collide: true }));

  // ---- T2: octagonal kitchen (canon: middle level), sign band on the bow face.
  const t2Color = twoTone(PLAN.t2.cx, PLAN.t2.cz, [C.wall, C.wallLow, T1_TOP + 0.5], [C.kitchenIn, C.kitchenLow, T1_TOP + 1.0]);
  const t2Openings: SegmentOpening[][] = p2.map((a, i) => {
    const c = p2[(i + 1) % p2.length];
    const len = Math.hypot(c[0] - a[0], c[1] - a[1]);
    if (i === 0) return [0.27, 0.73].map((f) => ({ at: len * f, width: 1.1, bottom: 0.9, top: 2.4, kind: 'arch' as const }));
    if (i === 6) return [{ at: 2, width: 1.1, bottom: 0.9, top: 2.4, kind: 'arch' as const }, { at: len / 2, width: 1.5, bottom: 0, top: 2.7, kind: 'door' as const, arched: true }, { at: len - 2, width: 1.1, bottom: 0.9, top: 2.4, kind: 'arch' as const }];
    if (i === 2) return [0.2, 0.5, 0.8].map((f) => ({ at: len * f, width: 1.1, bottom: 0.9, top: 2.4, kind: 'arch' as const }));
    if (i === 4) return [];
    return [{ at: len / 2, width: 0.9, bottom: 1.0, top: 2.3, kind: 'arch' as const }];
  });
  for (let i = 0; i < p2.length; i++) {
    const a = p2[i];
    const c = p2[(i + 1) % p2.length];
    const len = Math.hypot(c[0] - a[0], c[1] - a[1]);
    const yaw = Math.atan2(-(c[1] - a[1]), c[0] - a[0]);
    walls.push(...segmentWall(pb, b, { a, b: c, y0: T1_TOP, height: T2_TOP - T1_TOP, thickness: 0.3, color: t2Color, ...glassFrame, openings: t2Openings[i] }));
    pb.box(b.solid, [(a[0] + c[0]) / 2, T2_TOP - 1.0, (a[1] + c[1]) / 2], [len + 0.12, 0.62, 0.42], C.trim, [0, yaw, 0]);
  }
  latticeBand(pb, b.solid, { points: p2, closed: true, y: T2_TOP - 0.68, height: 0.62, panel: 0.75, boardColor: C.lattice, crossColor: C.trim, railColor: C.lattice, crosses: !low, collide: false, thickness: 0.4 });
  // T2 roof: upper terrace ring around T3; its balustrade opens where the upper stairs arrive (+z face).
  pb.custom(b.solid, flatShape(ctx.tracker, p2, [p3], T2_TOP, 'up'), [0, 0, 0], C.deck);
  const t2Rail = openLoop(p2, 2, [0.95, PLAN.t2.cz + PLAN.t2.hz], [-1.05, PLAN.t2.cz + PLAN.t2.hz]);
  walls.push(...latticeBand(pb, b.solid, { points: t2Rail, y: T2_TOP, height: 0.9, panel: 0.8, boardColor: C.lattice, crossColor: C.trim, railColor: C.trim, crosses: !low, collide: true }));

  // ---- T3: the cooks' quarters, hip roof with a white lantern top and a small chimney.
  const t3Color = twoTone(PLAN.t3.cx, PLAN.t3.cz, [C.wall, C.wallLow, T2_TOP + 0.4], [C.quartersIn, C.wood, T2_TOP + 0.9]);
  const t3Openings: SegmentOpening[][] = [
    [{ at: PLAN.t3.hz, width: 1.3, bottom: 0, top: 2.45, kind: 'door', arched: true }],
    [1.8, 5.4].map((at) => ({ at, width: 0.9, bottom: 1.0, top: 2.2, kind: 'arch' as const })),
    [{ at: PLAN.t3.hz, width: 1.0, bottom: 1.0, top: 2.2, kind: 'arch' }],
    [1.8, 5.4].map((at) => ({ at, width: 0.9, bottom: 1.0, top: 2.2, kind: 'arch' as const })),
  ];
  const t3Faces = [[0, 1], [2, 3], [4, 5], [6, 7]] as const;
  t3Faces.forEach(([i0], f) => {
    const a = p3[i0];
    const c = p3[(i0 + 2) % p3.length];
    walls.push(...segmentWall(pb, b, { a, b: c, y0: T2_TOP, height: T3_TOP - T2_TOP, thickness: 0.28, color: t3Color, ...glassFrame, openings: t3Openings[f] }));
  });
  hipRoof(pb, b.solid, { cx: PLAN.t3.cx, cz: PLAN.t3.cz, hx: PLAN.t3.hx, hz: PLAN.t3.hz, y: T3_TOP, rise: 2.3, topRatio: 0.42, overhang: 0.5, color: C.roof, topColor: C.roofTop });
  pb.box(b.solid, [PLAN.t3.cx + 1.2, T3_TOP + 2.0, -1.4], [0.7, 1.2, 0.7], C.chimney);
  pb.box(b.solid, [PLAN.t3.cx + 1.2, T3_TOP + 2.65, -1.4], [0.85, 0.15, 0.85], C.trim);
  // Scalloped yellow trim under the eaves (dots), a detail that reads strongly in the reference.
  if (!low) {
    const { hx, hz } = PLAN.t3;
    for (let k = -3; k <= 3; k++) pb.sphere(detail, [PLAN.t3.cx + hx + 0.18, T3_TOP - 0.12, (k * hz) / 3.6], 0.16, C.frame, 6);
  }

  // ---- Stairs: deck → T1 terrace (outside, −z), T1 → T2 terrace (outside, +z).
  const s1 = stairs(pb, b.solid, { axis: 'x', uBottom: 1.5, uTop: -5, c0: -11.6, c1: -10.45, yBottom: DECK_Y, yTop: T1_TOP, steps: 15, color: C.deck, stringerColor: C.lattice, sides: true });
  floors.push(s1.floor);
  walls.push(...s1.walls);
  floors.push(slab(pb, b.solid, { minX: -6.6, maxX: -5, minZ: -11.6, maxZ: -9.3, y: T1_TOP, thickness: 0.3, color: C.deck })!);
  walls.push(...latticeBand(pb, b.solid, { points: [[-5, -11.55], [-6.55, -11.55], [-6.55, -10.1]], y: T1_TOP, height: 0.95, panel: 0.8, boardColor: C.lattice, crossColor: C.trim, railColor: C.trim, crosses: !low, collide: true }));
  pb.box(b.solid, [-5.8, (DECK_Y + T1_TOP) / 2, -11.5], [0.3, T1_TOP - DECK_Y, 0.3], C.lattice);

  const s2 = stairs(pb, b.solid, { axis: 'x', uBottom: -7, uTop: -1, c0: 6.4, c1: 7.6, yBottom: T1_TOP, yTop: T2_TOP, steps: 13, color: C.deck, stringerColor: C.lattice, sides: true });
  floors.push(s2.floor);
  walls.push(...s2.walls);
  floors.push(slab(pb, b.solid, { minX: -1, maxX: 0.95, minZ: 5.3, maxZ: 7.6, y: T2_TOP, thickness: 0.3, color: C.deck })!);
  walls.push(...latticeBand(pb, b.solid, { points: [[-1, 7.55], [0.9, 7.55], [0.9, 6.1]], y: T2_TOP, height: 0.9, panel: 0.8, boardColor: C.lattice, crossColor: C.trim, railColor: C.trim, crosses: !low, collide: true }));

  // ---- Walkable floors: T1 roof (terrace + kitchen floor, minus the hall stairwell), T2 roof (+ quarters floor).
  floors.push(...planFloors(p1, T1_TOP, { slices: 34, inset: 0.35, holes: [PLAN.hallStairs] }));
  floors.push(...planFloors(p2, T2_TOP, { slices: 18, inset: 0.3 }));
  return { floors, walls };
}

function buildMasts(ctx: BuildContext, pb: PartBuilder, solid: GeometryBatch, cloth: GeometryBatch, detail: GeometryBatch): WallBox[] {
  const low = ctx.level === 'low';
  const walls: WallBox[] = [];
  const sailY = linear(C.sailY);
  const sailW = linear(C.sailW);
  const stripes = (u: number): [number, number, number] => {
    const c = Math.floor(u * 7) % 2 === 0 ? sailY : sailW;
    return [c.r, c.g, c.b];
  };
  const masts = [
    { x: 7.6, base: T1_TOP, top: T1_TOP + 22, sails: [{ y: T1_TOP + 13.6, w: 14, h: 7.4 }, { y: T1_TOP + 20.4, w: 11, h: 6.2 }] },
    { x: -14.2, base: T1_TOP, top: T1_TOP + 20, sails: [{ y: T1_TOP + 12.4, w: 13, h: 6.8 }, { y: T1_TOP + 18.6, w: 10, h: 5.6 }] },
  ];
  for (const m of masts) {
    const h = m.top - m.base;
    pb.cylinder(solid, [m.x, m.base + h / 2, 0], 0.36, h, C.mast, { segments: 12, taper: 0.62 });
    for (let y = m.base + 2.5; y < m.top - 1; y += 3) pb.cylinder(solid, [m.x, y, 0], 0.42, 0.22, C.mastBand, { segments: 12 });
    // Mast-head block + white flag with a red band (generic, no emblem).
    pb.box(solid, [m.x, m.top - 0.4, 0], [0.7, 0.7, 0.7], C.mastBand);
    pb.box(solid, [m.x - 1.0, m.top + 0.4, 0], [1.6, 1.0, 0.06], C.flag);
    pb.box(solid, [m.x - 1.0, m.top + 0.4, 0], [1.62, 0.25, 0.08], C.flagStripe);
    for (const s of m.sails) {
      // Yard + billowed sail (bulging towards the bow: wind from astern).
      pb.cylinder(solid, [m.x + 0.4, s.y, 0], 0.13, s.w + 0.8, C.wood, { segments: 8, rot: [Math.PI / 2, 0, 0] });
      const geo = sailGeometry(ctx.tracker, s.w, s.h, s.h * 0.28, low ? 6 : 12, low ? 4 : 8, stripes);
      pb.custom(cloth, geo, [m.x + 0.55, s.y - 0.1, 0], SOURCE_COLORS, [0, Math.PI / 2, 0]);
    }
    // Ratlines from the mast down to the terrace edge (port and starboard).
    const edgeZ = PLAN.t1.rz * Math.sqrt(Math.max(0, 1 - ((m.x - PLAN.t1.cx) / PLAN.t1.rx) ** 2)) - 0.4;
    for (const s of [-1, 1]) ratlines(pb, low ? solid : detail, [m.x, m.top - 4.5, s * 0.3], [m.x - 0.8, m.base + 0.3, s * edgeZ], 1.6, 0.55, !low);
    walls.push({ minX: m.x - 0.45, maxX: m.x + 0.45, minY: m.base, maxY: m.top, minZ: -0.45, maxZ: 0.45 });
  }
  return walls;
}

function buildProps(ctx: BuildContext, pb: PartBuilder, glow: GeometryBatch, detail: GeometryBatch): WallBox[] {
  const walls: WallBox[] = [];
  const rnd = ctx.random;
  // Barrels and crates on the stern deck (seeded layout, never on the walkway centre line).
  for (let i = 0; i < 8; i++) {
    const x = -24 + rnd() * 4.5;
    const z = (rnd() > 0.5 ? 1 : -1) * (2.2 + rnd() * 3.2);
    if (rnd() > 0.4) {
      pb.cylinder(detail, [x, DECK_Y + 0.5, z], 0.42, 1, '#9a5a2e', { segments: 10, taper: 0.9 });
      pb.cylinder(detail, [x, DECK_Y + 0.55, z], 0.44, 0.08, C.iron, { segments: 10 });
    } else {
      const s = 0.7 + rnd() * 0.4;
      pb.box(detail, [x, DECK_Y + s / 2, z], [s, s, s], '#b8924f', [0, rnd() * 1.2, 0]);
    }
    walls.push({ minX: x - 0.55, maxX: x + 0.55, minY: DECK_Y, maxY: DECK_Y + 1.1, minZ: z - 0.55, maxZ: z + 0.55 });
  }
  // Lanterns on the terrace balustrade and by the front door.
  for (const [x, z] of [[11.2, -2.6], [11.2, 2.6]] as const) {
    pb.cylinder(detail, [x, DECK_Y + 1.8, z], 0.05, 1.6, C.iron, { segments: 4 });
    pb.sphere(glow, [x, DECK_Y + 2.7, z], 0.24, C.glassWarm, 10);
  }
  for (const a of [0.6, 2.5, 3.8, 5.7]) {
    const x = PLAN.t1.cx + Math.cos(a) * (PLAN.t1.rx - 0.3);
    const z = PLAN.t1.cz + Math.sin(a) * (PLAN.t1.rz - 0.3);
    pb.cylinder(detail, [x, T1_TOP + 1.4, z], 0.05, 1.0, C.iron, { segments: 4 });
    pb.sphere(glow, [x, T1_TOP + 2.0, z], 0.2, C.glassWarm, 8);
  }
  return walls;
}

function canvasQuad(ctx: BuildContext, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, w: number, h: number, size: [number, number], at: XYZ, rotY: number, name: string): Object3D {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d')!, w, h);
  const tex = ctx.tracker.track(new CanvasTexture(canvas));
  tex.colorSpace = SRGBColorSpace; // canvas pixels are sRGB: without this they render washed out
  tex.anisotropy = 4;
  const geo = ctx.tracker.track(new PlaneGeometry(size[0], size[1]));
  // Signs keep their painted colours (no tone mapping), like the rest of the cel-shaded palette reads.
  const mat = ctx.tracker.track(new MeshBasicMaterial({ map: tex, fog: true, toneMapped: false }));
  const mesh = new Mesh(geo, mat);
  mesh.position.set(...at);
  mesh.rotation.y = rotY;
  mesh.name = name;
  return mesh;
}

function signs(ctx: BuildContext): Object3D[] {
  const ring = (g: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    for (let k = 0; k < 8; k++) {
      g.beginPath();
      g.moveTo(x, y);
      g.arc(x, y, r, (k / 8) * Math.PI * 2, ((k + 1) / 8) * Math.PI * 2);
      g.fillStyle = k % 2 ? '#ffffff' : '#d9452b';
      g.fill();
    }
    g.beginPath();
    g.arc(x, y, r * 0.55, 0, Math.PI * 2);
    g.fillStyle = '#f4efe2';
    g.fill();
  };
  const name = canvasQuad(
    ctx,
    (g, w, h) => {
      g.fillStyle = '#f4efe2';
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#6a2c22';
      g.fillRect(0, 0, w, 10);
      g.fillRect(0, h - 10, w, 10);
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.font = '700 104px Cinzel, Georgia, "Times New Roman", serif';
      g.fillStyle = '#5a1f18';
      g.fillText(ctx.locationName.toUpperCase(), w / 2, h / 2 + 4, w - 260);
      ring(g, 70, h / 2, 46);
      ring(g, w - 70, h / 2, 46);
    },
    1024,
    160,
    [6.6, 1.03],
    [PLAN.t2.cx + PLAN.t2.hx + 0.23, T2_TOP - 1.0, 0],
    Math.PI / 2,
    'sign',
  );
  const pictogram = canvasQuad(
    ctx,
    (g, w, h) => {
      g.fillStyle = '#72cfb0';
      g.fillRect(0, 0, w, h);
      g.strokeStyle = '#f0c44a';
      g.lineWidth = 12;
      g.strokeRect(6, 6, w - 12, h - 12);
      g.fillStyle = '#ffffff';
      g.translate(w / 2, h / 2);
      for (const s of [-1, 1]) {
        g.save();
        g.rotate(s * 0.6);
        g.fillRect(-7, -48, 14, 96);
        if (s < 0) for (const dx of [-14, 0, 14]) g.fillRect(dx - 3, -62, 6, 22);
        else {
          g.beginPath();
          g.ellipse(0, -52, 12, 20, 0, 0, Math.PI * 2);
          g.fill();
        }
        g.restore();
      }
    },
    256,
    160,
    [1.6, 1.0],
    [PLAN.t3.cx + PLAN.t3.hx + 0.16, T3_TOP - 0.62, 0],
    Math.PI / 2,
    'sign:pictogram',
  );
  return [name, pictogram];
}

/* ------------------------------------------------------------------------------------------ interiors (zone loaded) */

function interiorMeshes(ctx: BuildContext, name: string, b: Batches, extra: Object3D[] = []): Group {
  const group = new Group();
  group.name = `interior:${name}`;
  const solid = batchToMesh(b.solid, ctx.tracker, { name: `${name}:solid`, material: ctx.materials.toon, receiveShadow: false, inkMaterial: ctx.quality.outlines ? ctx.materials.ink : undefined, inkThresholdDeg: 40 });
  const glow = batchToMesh(b.glow, ctx.tracker, { name: `${name}:glow`, material: ctx.materials.glow });
  if (solid) group.add(solid);
  if (glow) group.add(glow);
  if (extra.length) group.add(...extra);
  return group;
}

const insideEllipse = (x: number, z: number, margin: number) =>
  ((x - PLAN.t1.cx) / (PLAN.t1.rx - margin)) ** 2 + ((z - PLAN.t1.cz) / (PLAN.t1.rz - margin)) ** 2 <= 1;

/** Local frame on a wall: `at(u, y, w)` = u along the wall, w out of the wall into the room; `yaw` turns +z into the room. */
interface WallFrame {
  yaw: number;
  at: (u: number, y: number, w: number) => XYZ;
}
function wallFrame(x: number, z: number, nx: number, nz: number): WallFrame {
  return { yaw: Math.atan2(nx, nz), at: (u, y, w) => [x + nz * u + nx * w, y, z - nx * u + nz * w] };
}
/** Inner-wall frame at vertex `i` of the T1 plan (the piers between two windows), pulled `inset` into the room. */
function t1Pier(p1: Plan, i: number, inset: number): WallFrame {
  const { cx, cz, rx, rz } = PLAN.t1;
  const [x, z] = p1[i];
  let nx = -(x - cx) / (rx * rx);
  let nz = -(z - cz) / (rz * rz);
  const l = Math.hypot(nx, nz);
  nx /= l;
  nz /= l;
  return wallFrame(x + nx * inset, z + nz * inset, nx, nz);
}
/** Vertices of the T1 plan next to a door (no decoration there). */
const DOOR_PIERS = new Set([25, 0, 12, 13, 6, 7]);

/** Brass wall sconce with a warm glass shade. */
function sconce(pb: PartBuilder, b: Batches, f: WallFrame, y: number): void {
  const rot: XYZ = [0, f.yaw, 0];
  pb.box(b.solid, f.at(0, y, 0.03), [0.2, 0.5, 0.06], C.brass, rot);
  pb.box(b.solid, f.at(0, y - 0.1, 0.16), [0.05, 0.05, 0.22], C.brass, rot);
  pb.cylinder(b.solid, f.at(0, y - 0.04, 0.27), 0.1, 0.06, C.brass, { segments: 8, taper: 1.3 });
  pb.sphere(b.glow, f.at(0, y + 0.08, 0.27), [0.12, 0.17, 0.12], C.glassWarm, 8);
}

/** Wall picture (frame + flat canvas with a sun disc and a wave strip), no text. */
function framedPicture(pb: PartBuilder, b: Batches, f: WallFrame, y: number, canvas: string, accent: string): void {
  const rot: XYZ = [0, f.yaw, 0];
  pb.box(b.solid, f.at(0, y, 0.03), [1.0, 0.78, 0.05], C.wood, rot);
  pb.box(b.solid, f.at(0, y, 0.06), [0.84, 0.62, 0.02], canvas, rot);
  pb.cylinder(b.solid, f.at(-0.18, y + 0.1, 0.075), 0.13, 0.02, accent, { segments: 10, rot: [Math.PI / 2, f.yaw, 0] });
  pb.box(b.solid, f.at(0, y - 0.22, 0.075), [0.84, 0.16, 0.012], C.trim, rot);
}

/** Potted floor plant (pot, stem, two foliage blobs). */
function pottedPlant(pb: PartBuilder, b: GeometryBatch, x: number, y: number, z: number, scale = 1): void {
  pb.cylinder(b, [x, y + 0.22 * scale, z], 0.28 * scale, 0.44 * scale, C.terracotta, { segments: 10, taper: 1.25 });
  pb.cylinder(b, [x, y + 0.7 * scale, z], 0.04 * scale, 0.6 * scale, C.woodDark, { segments: 5 });
  pb.sphere(b, [x, y + 1.2 * scale, z], [0.42 * scale, 0.5 * scale, 0.42 * scale], C.plant, 9);
  pb.sphere(b, [x + 0.12 * scale, y + 1.65 * scale, z - 0.06 * scale], [0.28 * scale, 0.32 * scale, 0.28 * scale], C.plantDark, 8);
}

function bottle(pb: PartBuilder, b: GeometryBatch, x: number, y: number, z: number, color: string): void {
  pb.cylinder(b, [x, y + 0.14, z], 0.065, 0.28, color, { segments: 6 });
  pb.cylinder(b, [x, y + 0.36, z], 0.028, 0.16, color, { segments: 5 });
  pb.cylinder(b, [x, y + 0.45, z], 0.032, 0.03, C.brass, { segments: 5 });
}

function buildHall(ctx: BuildContext): ZoneBuild {
  const low = ctx.level === 'low';
  const pb = new PartBuilder(ctx.tracker, low ? 0.5 : 1);
  const b: Batches = { solid: new GeometryBatch(), glow: new GeometryBatch() };
  const walls: WallBox[] = [];
  const floors: FloorRect[] = [];
  const p1 = t1Plan();
  // Wooden floor with plank seams, cream ceiling (stairwell left open) with beams.
  pb.custom(b.solid, flatShape(ctx.tracker, p1, [], DECK_Y + 0.02, 'up'), [0, 0, 0], C.floorHall);
  if (!low) {
    for (let x = PLAN.t1.cx - PLAN.t1.rx + 0.9; x < PLAN.t1.cx + PLAN.t1.rx - 0.5; x += 0.9) {
      const span = planHalfZ(p1, x);
      if (span) pb.box(b.solid, [x, DECK_Y + 0.03, (span[0] + span[1]) / 2], [0.05, 0.01, span[1] - span[0] - 0.4], C.floorSeam);
    }
  }
  pb.custom(b.solid, flatShape(ctx.tracker, p1, [rectPlan(PLAN.hallStairs)], T1_TOP - 0.35, 'down'), [0, 0, 0], C.ceiling);
  for (let x = PLAN.t1.cx - PLAN.t1.rx + 3; x < PLAN.t1.cx + PLAN.t1.rx - 2; x += 3) {
    const span = planHalfZ(p1, x);
    if (!span) continue;
    for (const [z0, z1] of [[span[0] + 0.3, PLAN.hallStairs.minZ - 0.1], [PLAN.hallStairs.maxZ + 0.1, span[1] - 0.3]]) {
      if (x > PLAN.hallStairs.minX - 0.3 && x < PLAN.hallStairs.maxX + 0.3 && z1 > z0) pb.box(b.solid, [x, T1_TOP - 0.5, (z0 + z1) / 2], [0.28, 0.3, z1 - z0], C.wood);
    }
    if (x <= PLAN.hallStairs.minX - 0.3 || x >= PLAN.hallStairs.maxX + 0.3) pb.box(b.solid, [x, T1_TOP - 0.5, (span[0] + span[1]) / 2], [0.28, 0.3, span[1] - span[0] - 0.6], C.wood);
  }

  // Tables in rings around a central aisle (door → bar), avoiding the stairs.
  const tables: Placement[] = [];
  const chairs: Placement[] = [];
  for (const x of [-10.5, -7, -3.5, 0, 3.5, 7.5]) {
    for (const z of [-7, -3.6, 3.6, 7]) {
      const nearStairs = x > PLAN.hallStairs.minX - 1.4 && x < PLAN.hallStairs.maxX + 1.6 && z > 2;
      if (nearStairs || !insideEllipse(x, z, 2.2)) continue;
      tables.push({ x, y: DECK_Y, z, yaw: 0 });
      chairs.push(...chairsAround(x, DECK_Y, z, 4, 0.95, Math.PI / 4));
      walls.push({ minX: x - 0.62, maxX: x + 0.62, minY: DECK_Y, maxY: DECK_Y + 1, minZ: z - 0.62, maxZ: z + 0.62 });
    }
  }
  // Bar counter + bottle shelf at the back.
  pb.boxMinMax(b.solid, [-13.6, DECK_Y, -5.8], [-12.6, DECK_Y + 1.1, -2.2], C.wood);
  pb.boxMinMax(b.solid, [-13.7, DECK_Y + 1.1, -5.9], [-12.5, DECK_Y + 1.2, -2.1], C.deck);
  walls.push({ minX: -13.7, maxX: -12.5, minY: DECK_Y, maxY: DECK_Y + 1.2, minZ: -5.9, maxZ: -2.1 });
  // Back-bar: tall cabinet with a mirror, three lit shelves of bottles, menu slate on top.
  pb.boxMinMax(b.solid, [-14.95, DECK_Y, -5.2], [-14.6, DECK_Y + 1.05, -2.8], C.wood);
  pb.boxMinMax(b.solid, [-14.95, DECK_Y + 1.05, -5.2], [-14.82, DECK_Y + 3.0, -2.8], C.wood);
  pb.boxMinMax(b.solid, [-14.82, DECK_Y + 1.2, -5.05], [-14.8, DECK_Y + 2.9, -2.95], C.mirror);
  pb.boxMinMax(b.solid, [-14.98, DECK_Y + 2.98, -5.3], [-14.5, DECK_Y + 3.08, -2.7], C.brass);
  const bottleColors = ['#4fa866', '#b8503a', '#e3b94f', '#4e86c4', '#d8e6e0', '#8a5a9a'];
  for (let s = 0; s < 3; s++) {
    const sy = DECK_Y + 1.3 + s * 0.6;
    pb.boxMinMax(b.solid, [-14.82, sy, -5.15], [-14.32, sy + 0.05, -2.85], C.wood);
    pb.boxMinMax(b.glow, [-14.8, sy - 0.02, -5.0], [-14.55, sy, -3.0], C.glassWarm);
    if (low && s !== 1) continue;
    for (let k = 0; k < 7; k++) bottle(pb, b.solid, -14.55, sy + 0.05, -4.85 + k * 0.32 + (s % 2) * 0.05, bottleColors[(k + s * 2) % bottleColors.length]);
  }
  // Menu slate above the shelves (cream "lines", no text).
  pb.boxMinMax(b.solid, [-14.95, DECK_Y + 3.12, -5.0], [-14.8, DECK_Y + 3.82, -3.0], C.wood);
  pb.boxMinMax(b.solid, [-14.8, DECK_Y + 3.18, -4.94], [-14.77, DECK_Y + 3.76, -3.06], C.slate);
  if (!low) {
    for (let k = 0; k < 4; k++) pb.boxMinMax(b.solid, [-14.77, DECK_Y + 3.6 - k * 0.12, -4.8], [-14.755, DECK_Y + 3.64 - k * 0.12, -4.8 + 1.5 - k * 0.22], C.trim);
    pb.boxMinMax(b.solid, [-14.77, DECK_Y + 3.24, -4.0], [-14.755, DECK_Y + 3.3, -3.2], C.gold);
  }
  walls.push({ minX: -15, maxX: -14.3, minY: DECK_Y, maxY: DECK_Y + 3.1, minZ: -5.3, maxZ: -2.7 });
  // Counter front: panels, brass foot rail, glasses on top, pendant lamps, stools.
  if (!low) {
    for (let k = 0; k < 3; k++) pb.boxMinMax(b.solid, [-12.52, DECK_Y + 0.15, -5.55 + k * 1.15], [-12.48, DECK_Y + 0.95, -4.6 + k * 1.15], C.woodDark);
    pb.cylinder(b.solid, [-12.35, DECK_Y + 0.25, -4.0], 0.035, 3.4, C.brass, { segments: 6, rot: [Math.PI / 2, 0, 0] });
    for (let k = 0; k < 5; k++) pb.cylinder(b.solid, [-13.0, DECK_Y + 1.26, -5.4 + k * 0.5], 0.06, 0.14, C.mirror, { segments: 6, taper: 1.3 });
    for (const z of [-5.0, -4.0, -3.0]) {
      pb.cylinder(b.solid, [-13.1, T1_TOP - 0.75, z], 0.012, 0.8, C.iron, { segments: 4 });
      pb.cylinder(b.solid, [-13.1, DECK_Y + 3.15, z], 0.24, 0.2, C.terracotta, { segments: 10, taper: 0.35 });
      pb.sphere(b.glow, [-13.1, DECK_Y + 3.02, z], 0.09, C.bulb, 8);
    }
  }
  for (let k = 0; k < 4; k++) {
    const z = -5.2 + k * 0.8;
    pb.cylinder(b.solid, [-11.95, DECK_Y + 0.74, z], 0.22, 0.09, C.cushion, { segments: 10 });
    pb.cylinder(b.solid, [-11.95, DECK_Y + 0.36, z], 0.04, 0.7, C.iron, { segments: 5 });
    pb.cylinder(b.solid, [-11.95, DECK_Y + 0.03, z], 0.2, 0.05, C.iron, { segments: 8 });
  }
  walls.push({ minX: -12.28, maxX: -11.62, minY: DECK_Y, maxY: DECK_Y + 0.85, minZ: -5.5, maxZ: -2.5 });
  // Chandeliers (brass rings with warm bulbs).
  for (const x of [-9, -3, 3, 8.4]) {
    pb.cylinder(b.solid, [x, T1_TOP - 0.85, 0], 0.025, 0.5, C.brass, { segments: 4 });
    pb.torus(b.solid, [x, T1_TOP - 1.1, 0], 0.6, 0.04, C.brass, { segments: 16, rot: [Math.PI / 2, 0, 0] });
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      pb.sphere(b.glow, [x + Math.cos(a) * 0.6, T1_TOP - 1.0, Math.sin(a) * 0.6], 0.09, C.glassWarm, 8);
    }
  }
  // Potted plants by the front door.
  for (const z of [-2.2, 2.2]) {
    pb.cylinder(b.solid, [10.6, DECK_Y + 0.35, z], 0.35, 0.7, '#b86b3c', { segments: 10, taper: 1.2 });
    pb.sphere(b.solid, [10.6, DECK_Y + 1.1, z], [0.55, 0.6, 0.55], C.plant, 10);
    walls.push({ minX: 10.2, maxX: 11, minY: DECK_Y, maxY: DECK_Y + 1.5, minZ: z - 0.4, maxZ: z + 0.4 });
  }

  // Red carpet runner down the aisle (front door → back door), gold edging, welcome mat. Flat: purely visual.
  pb.boxMinMax(b.solid, [-16.4, DECK_Y + 0.035, -0.9], [11.4, DECK_Y + 0.06, 0.9], C.carpet);
  pb.boxMinMax(b.solid, [-16.4, DECK_Y + 0.06, -0.9], [11.4, DECK_Y + 0.065, -0.78], C.gold);
  pb.boxMinMax(b.solid, [-16.4, DECK_Y + 0.06, 0.78], [11.4, DECK_Y + 0.065, 0.9], C.gold);
  if (!low) {
    for (let x = -15.5; x < 11; x += 2.2) pb.boxMinMax(b.solid, [x, DECK_Y + 0.06, -0.7], [x + 0.9, DECK_Y + 0.064, 0.7], C.carpetDark);
    pb.boxMinMax(b.solid, [11.0, DECK_Y + 0.065, -0.8], [11.8, DECK_Y + 0.08, 0.8], C.woodDark);
  }

  // Host lectern near the front door: slanted desk, reservation book, small brass lamp.
  pb.boxMinMax(b.solid, [9.4, DECK_Y, -3.25], [10.0, DECK_Y + 0.95, -2.75], C.wood);
  pb.box(b.solid, [9.7, DECK_Y + 1.04, -3.0], [0.74, 0.05, 0.6], C.woodLight, [0, 0, 0.28]);
  pb.box(b.solid, [9.68, DECK_Y + 1.1, -3.0], [0.34, 0.03, 0.44], C.cloth, [0, 0, 0.28]);
  pb.boxMinMax(b.solid, [9.38, DECK_Y + 0.9, -3.28], [10.02, DECK_Y + 0.96, -2.72], C.brass);
  pb.cylinder(b.solid, [9.95, DECK_Y + 1.35, -3.15], 0.012, 0.4, C.brass, { segments: 4 });
  pb.sphere(b.glow, [9.95, DECK_Y + 1.6, -3.15], 0.09, C.bulb, 8);
  walls.push({ minX: 9.35, maxX: 10.05, minY: DECK_Y, maxY: DECK_Y + 1.3, minZ: -3.3, maxZ: -2.7 });

  // Wall sconces + framed pictures on the piers between the windows, a few potted plants at the foot of the bare ones.
  const picColors: Array<[string, string]> = [['#6fb7d9', '#fbe9a0'], ['#f2a54a', '#fff3d6'], ['#8fd1b0', '#f7d36a'], ['#e48b86', '#fff3d6']];
  for (let i = 0; i < p1.length; i++) {
    if (DOOR_PIERS.has(i)) continue;
    if (low && i % 2) continue;
    const f = t1Pier(p1, i, 0.19);
    if (i % 2 === 0) {
      sconce(pb, b, f, DECK_Y + 2.95);
      if (!low) framedPicture(pb, b, f, DECK_Y + 1.8, picColors[(i / 2) % picColors.length][0], picColors[(i / 2) % picColors.length][1]);
    } else {
      sconce(pb, b, f, DECK_Y + 2.45);
      if (!low && [3, 9, 15, 19, 23].includes(i)) {
        const q = t1Pier(p1, i, 0.65);
        const [px, , pz] = q.at(0, 0, 0);
        pottedPlant(pb, b.solid, px, DECK_Y, pz);
        walls.push({ minX: px - 0.35, maxX: px + 0.35, minY: DECK_Y, maxY: DECK_Y + 1.9, minZ: pz - 0.35, maxZ: pz + 0.35 });
      }
    }
  }

  // Stairs up to the kitchen (canon: the kitchen is the middle level).
  const s = stairs(pb, b.solid, { axis: 'x', uBottom: PLAN.hallStairs.maxX, uTop: PLAN.hallStairs.minX, c0: PLAN.hallStairs.minZ, c1: PLAN.hallStairs.maxZ, yBottom: DECK_Y, yTop: T1_TOP, steps: 16, color: C.wood, stringerColor: C.brass, sides: true, tag: 'hall' });
  floors.push(s.floor);
  walls.push(...s.walls);

  const chairGeo = chairGeometry(pb, ctx.tracker, C.wood, C.cushion);
  const tableGeo = roundTableGeometry(pb, ctx.tracker, C.wood, C.cloth, 0.62);
  const group = interiorMeshes(ctx, 'hall', b, [instanced('chairs', chairGeo, ctx.materials.toon, chairs), instanced('tables', tableGeo, ctx.materials.toon, tables)]);
  return { object: group, colliders: { floors, walls } };
}

function buildKitchen(ctx: BuildContext): ZoneBuild {
  const low = ctx.level === 'low';
  const pb = new PartBuilder(ctx.tracker, low ? 0.5 : 1);
  const b: Batches = { solid: new GeometryBatch(), glow: new GeometryBatch() };
  const walls: WallBox[] = [];
  const p2 = t2Plan();
  const y = T1_TOP;
  const hs = PLAN.hallStairs;
  // Checker tiles inside the octagon, skipping the stairwell.
  const step = low ? 1.6 : 0.8;
  for (let x = PLAN.t2.cx - PLAN.t2.hx; x < PLAN.t2.cx + PLAN.t2.hx; x += step) {
    for (let z = PLAN.t2.cz - PLAN.t2.hz; z < PLAN.t2.cz + PLAN.t2.hz; z += step) {
      const mx = x + step / 2;
      const mz = z + step / 2;
      const span = planHalfZ(p2, mx);
      if (!span || mz < span[0] + 0.2 || mz > span[1] - 0.2) continue;
      if (mx > hs.minX && mx < hs.maxX + 0.5 && mz > hs.minZ && mz < hs.maxZ) continue;
      const odd = (Math.round(x / step) + Math.round(z / step)) % 2 !== 0;
      pb.boxMinMax(b.solid, [x, y, z], [x + step, y + 0.03, z + step], odd ? C.tile2 : C.tile);
    }
  }
  pb.custom(b.solid, flatShape(ctx.tracker, p2, [], T2_TOP - 0.3, 'down'), [0, 0, 0], C.ceiling);
  // Stove range along the back face with flames and pots, steel hood above.
  pb.boxMinMax(b.solid, [-10.15, y, -3.2], [-9.1, y + 0.95, 3.2], C.stove);
  for (let i = 0; i < 6; i++) {
    const z = -2.7 + i * 1.08;
    pb.cylinder(b.glow, [-9.6, y + 0.98, z], 0.28, 0.04, C.flame, { segments: 10 });
    if (i % 2 === 0) {
      // Stock pot with lid, knob and two side handles.
      pb.cylinder(b.solid, [-9.6, y + 1.3, z], 0.36, 0.6, C.steel, { segments: 12 });
      pb.cylinder(b.solid, [-9.6, y + 1.12, z], 0.37, 0.05, C.iron, { segments: 12 });
      pb.cylinder(b.solid, [-9.6, y + 1.62, z], 0.38, 0.05, C.steel, { segments: 12 });
      pb.sphere(b.solid, [-9.6, y + 1.69, z], 0.05, C.brass, 6);
      if (!low) for (const s of [-1, 1]) pb.box(b.solid, [-9.6, y + 1.5, z + s * 0.41], [0.1, 0.04, 0.09], C.iron);
    } else {
      // Frying pan with a long handle pointing along the range (kept clear of the aisle).
      pb.cylinder(b.solid, [-9.6, y + 1.06, z], 0.42, 0.1, C.iron, { segments: 12 });
      pb.cylinder(b.solid, [-9.6, y + 1.1, z], 0.34, 0.03, C.stove, { segments: 12 });
      pb.box(b.solid, [-9.6, y + 1.08, z + 0.62], [0.07, 0.04, 0.4], C.woodDark);
    }
  }
  pb.boxMinMax(b.solid, [-10.2, y + 2.35, -3.4], [-8.8, y + 3.0, 3.4], C.steel);
  walls.push({ minX: -10.2, maxX: -9.05, minY: y, maxY: y + 1.2, minZ: -3.25, maxZ: 3.25 });
  // Range front: oven doors with handles, knobs; tiled backsplash, utensil rail, flue, warm light under the hood.
  for (const z of [-2.1, 0, 2.1]) {
    pb.boxMinMax(b.solid, [-9.12, y + 0.08, z - 0.45], [-9.08, y + 0.62, z + 0.45], C.steel);
    pb.boxMinMax(b.solid, [-9.1, y + 0.55, z - 0.35], [-9.04, y + 0.6, z + 0.35], C.brass);
  }
  for (let i = 0; i < 6; i++) pb.cylinder(b.solid, [-9.1, y + 0.8, -2.7 + i * 1.08], 0.045, 0.05, C.steel, { segments: 6, rot: [0, 0, Math.PI / 2] });
  pb.boxMinMax(b.solid, [-10.34, y + 0.95, -3.7], [-10.2, y + 2.35, 3.7], C.tile);
  pb.boxMinMax(b.glow, [-9.7, y + 2.32, -3.1], [-9.5, y + 2.35, 3.1], C.bulb);
  pb.boxMinMax(b.solid, [-9.85, y + 3.0, -0.45], [-9.25, y + 3.5, 0.45], C.steel);
  if (!low) {
    for (let k = 1; k < 4; k++) pb.boxMinMax(b.solid, [-10.2, y + 0.95 + k * 0.35, -3.7], [-10.19, y + 0.97 + k * 0.35, 3.7], C.tile2);
    pb.cylinder(b.solid, [-10.1, y + 1.95, 0], 0.02, 6.0, C.iron, { segments: 5, rot: [Math.PI / 2, 0, 0] });
    for (let k = 0; k < 10; k++) {
      const z = -2.7 + k * 0.6;
      pb.cylinder(b.solid, [-10.1, y + 1.7, z], 0.018, 0.45, k % 2 ? C.woodDark : C.iron, { segments: 5 });
      if (k % 3 === 0) pb.sphere(b.solid, [-10.1, y + 1.44, z], [0.07, 0.04, 0.07], C.steel, 7);
      else if (k % 3 === 1) pb.box(b.solid, [-10.1, y + 1.5, z], [0.015, 0.16, 0.11], C.steel);
      else pb.cylinder(b.solid, [-10.1, y + 1.46, z], 0.045, 0.18, C.steel, { segments: 6, taper: 0.4 });
    }
  }
  // Counter with sink along the −z face, island with a hanging pot rack, shelves along +z.
  pb.boxMinMax(b.solid, [-8.1, y, -5.75], [-4.5, y + 0.92, -4.95], C.wood);
  pb.boxMinMax(b.solid, [-8.15, y + 0.92, -5.8], [-4.45, y + 1.0, -4.9], C.steel);
  walls.push({ minX: -8.15, maxX: -4.45, minY: y, maxY: y + 1, minZ: -5.8, maxZ: -4.9 });
  // Sink basin + gooseneck tap, drawer fronts, dish rack with plates, bowl stack.
  pb.boxMinMax(b.solid, [-6.85, y + 1.0, -5.65], [-5.95, y + 1.012, -5.05], '#6e7f8a');
  pb.cylinder(b.solid, [-6.4, y + 1.2, -5.7], 0.03, 0.4, C.steel, { segments: 6 });
  pb.cylinder(b.solid, [-6.4, y + 1.4, -5.57], 0.03, 0.28, C.steel, { segments: 6, rot: [Math.PI / 2, 0, 0] });
  pb.box(b.solid, [-6.4, y + 1.1, -5.7], [0.2, 0.05, 0.05], C.brass);
  for (const x of [-7.6, -7.15]) {
    pb.cylinder(b.solid, [x, y + 1.06, -5.4], 0.2, 0.12, C.cloth, { segments: 10, taper: 1.5 });
    pb.cylinder(b.solid, [x, y + 1.17, -5.4], 0.19, 0.1, C.cloth, { segments: 10, taper: 1.5 });
  }
  if (!low) {
    for (let k = 0; k < 3; k++) {
      const x = -7.55 + k * 1.15;
      if (Math.abs(x + 6.4) < 0.6) continue;
      pb.boxMinMax(b.solid, [x - 0.45, y + 0.5, -4.96], [x + 0.45, y + 0.82, -4.93], C.woodLight);
      pb.sphere(b.solid, [x, y + 0.66, -4.9], 0.035, C.brass, 6);
    }
    pb.boxMinMax(b.solid, [-6.85, y + 0.12, -4.96], [-5.95, y + 0.82, -4.93], C.woodLight);
    pb.sphere(b.solid, [-6.4, y + 0.5, -4.9], 0.035, C.brass, 6);
    // Dish rack on the counter (wire frame, plates standing on edge).
    pb.boxMinMax(b.solid, [-5.55, y + 1.0, -5.62], [-4.6, y + 1.03, -5.2], C.steel);
    for (const z of [-5.6, -5.22]) pb.boxMinMax(b.solid, [-5.55, y + 1.03, z], [-4.6, y + 1.07, z + 0.02], C.steel);
    for (let k = 0; k < 6; k++) pb.cylinder(b.solid, [-5.45 + k * 0.15, y + 1.2, -5.41], 0.16, 0.025, C.cloth, { segments: 10, rot: [0, 0, Math.PI / 2] });
  }
  pb.boxMinMax(b.solid, [-6.9, y, -1.2], [-4.6, y + 0.9, 1.2], C.wood);
  pb.boxMinMax(b.solid, [-7.0, y + 0.9, -1.3], [-4.5, y + 1.0, 1.3], C.deck);
  pb.cylinder(b.solid, [-5.4, y + 1.35, 0.4], 0.45, 0.6, C.steel, { segments: 14 });
  pb.boxMinMax(b.solid, [-6.3, y + 1.0, -0.7], [-5.4, y + 1.06, -0.1], '#e0c08a');
  walls.push({ minX: -7.0, maxX: -4.5, minY: y, maxY: y + 1, minZ: -1.3, maxZ: 1.3 });
  // Island: butcher block with a cleaver, knives on the board, vegetables, a knife block, drawer fronts.
  pb.boxMinMax(b.solid, [-6.85, y + 1.0, 0.45], [-6.25, y + 1.2, 1.1], C.woodLight);
  pb.boxMinMax(b.solid, [-6.85, y + 1.1, 0.45], [-6.25, y + 1.115, 1.1], C.wood);
  pb.box(b.solid, [-6.55, y + 1.33, 0.78], [0.2, 0.15, 0.014], C.steel, [0, 0, 0.12]);
  pb.box(b.solid, [-6.55, y + 1.45, 0.78], [0.035, 0.14, 0.03], C.woodDark, [0, 0, 0.12]);
  for (let k = 0; k < 3; k++) {
    const z = -0.62 + k * 0.17;
    pb.box(b.solid, [-6.03, y + 1.075, z], [0.34, 0.014, 0.05 - k * 0.006], C.steel);
    pb.box(b.solid, [-5.76, y + 1.085, z], [0.14, 0.03, 0.03], C.woodDark);
  }
  pb.boxMinMax(b.solid, [-4.95, y + 1.0, -0.95], [-4.65, y + 1.3, -0.6], C.woodDark);
  if (!low) {
    for (let k = 0; k < 4; k++) pb.box(b.solid, [-4.85 + (k % 2) * 0.1, y + 1.32, -0.84 + (k >> 1) * 0.12], [0.03, 0.1, 0.03], k % 2 ? C.iron : C.woodLight);
    for (let k = 0; k < 3; k++) pb.cylinder(b.solid, [-6.1, y + 1.09, 0.45 + k * 0.1], 0.025, 0.22, '#e8892a', { segments: 6, taper: 0.5, rot: [0, 0, Math.PI / 2] });
    pb.sphere(b.solid, [-6.1, y + 1.12, 0.95], 0.11, C.plant, 8);
    pb.sphere(b.solid, [-5.85, y + 1.1, 0.75], 0.07, '#d9452b', 7);
    pb.sphere(b.solid, [-5.98, y + 1.09, 0.65], 0.06, '#d9452b', 7);
    for (let k = 0; k < 3; k++) pb.boxMinMax(b.solid, [-6.94, y + 0.25, -1.0 + k * 0.7], [-6.9, y + 0.8, -0.4 + k * 0.7], C.woodLight);
    // Pot-rack chains.
    for (const x of [-6.85, -4.65]) pb.cylinder(b.solid, [x, T2_TOP - 0.65, 0], 0.012, 0.7, C.iron, { segments: 4 });
  }
  pb.boxMinMax(b.solid, [-6.9, T2_TOP - 1.0, -0.05], [-4.6, T2_TOP - 0.95, 0.05], C.iron);
  for (let i = 0; i < 6; i++) pb.cylinder(b.solid, [-6.6 + i * 0.4, T2_TOP - 1.35, 0], 0.17, 0.28, i % 2 ? C.steel : '#b86b3c', { segments: 10 });
  for (const [x0, x1] of [[-8.2, -3.8]] as const) {
    for (const yy of [y + 1.5, y + 2.2]) pb.boxMinMax(b.solid, [x0, yy, 5.25], [x1, yy + 0.06, 5.75], C.wood);
    for (let i = 0; i < 8; i++) pb.cylinder(b.solid, [x0 + 0.4 + i * 0.55, y + 1.72, 5.5], 0.15, 0.36, ['#d9c27a', '#b86b3c', C.steel][i % 3], { segments: 8 });
  }
  // Rails around the stairwell (the stair side walls are the colliders).
  for (const z of [hs.minZ - 0.05, hs.maxZ + 0.05]) railing(pb, b.solid, { points: [[hs.minX + 0.2, z], [hs.maxX - 0.3, z]], y, height: 1.0, postSpacing: 1.1, color: C.brass });
  // Warm light: flat dome lamps on the ceiling + copper pendants over the counter.
  for (const [x, z] of [[-4, -3], [-4, 3], [0.5, -3], [0.5, 2.2], [-8, -3.6], [-8, 3.6]] as const) {
    pb.torus(b.solid, [x, T2_TOP - 0.34, z], 0.3, 0.03, C.brass, { segments: 12, rot: [Math.PI / 2, 0, 0] });
    pb.sphere(b.glow, [x, T2_TOP - 0.4, z], [0.28, 0.12, 0.28], C.glassWarm, 10);
  }
  for (const x of [-7.3, -6.2, -5.1]) {
    pb.cylinder(b.solid, [x, T2_TOP - 0.7, -4.5], 0.012, 0.6, C.iron, { segments: 4 });
    pb.cylinder(b.solid, [x, T2_TOP - 1.08, -4.5], 0.24, 0.2, C.terracotta, { segments: 10, taper: 0.35 });
    pb.sphere(b.glow, [x, T2_TOP - 1.2, -4.5], 0.09, C.bulb, 8);
  }
  // Walk-in cold room door on the +x wall (between the two windows), crates and sacks beside it.
  const dx = PLAN.t2.cx + PLAN.t2.hx;
  pb.boxMinMax(b.solid, [dx - 0.3, y, -0.72], [dx - 0.17, y + 2.45, -0.6], C.kitchenLow);
  pb.boxMinMax(b.solid, [dx - 0.3, y, 0.6], [dx - 0.17, y + 2.45, 0.72], C.kitchenLow);
  pb.boxMinMax(b.solid, [dx - 0.3, y + 2.33, -0.72], [dx - 0.17, y + 2.45, 0.72], C.kitchenLow);
  pb.boxMinMax(b.solid, [dx - 0.32, y, -0.6], [dx - 0.2, y + 2.33, 0.6], C.steel);
  pb.boxMinMax(b.solid, [dx - 0.34, y + 0.2, -0.45], [dx - 0.32, y + 2.1, 0.45], '#c9d3da');
  pb.boxMinMax(b.solid, [dx - 0.45, y + 1.05, 0.38], [dx - 0.34, y + 1.1, 0.5], C.brass);
  pb.boxMinMax(b.solid, [dx - 0.45, y + 0.85, 0.44], [dx - 0.4, y + 1.3, 0.5], C.brass);
  walls.push({ minX: dx - 0.5, maxX: dx, minY: y, maxY: y + 2.5, minZ: -0.75, maxZ: 0.75 });
  if (!low) {
    pb.cylinder(b.glow, [dx - 0.345, y + 1.75, -0.2], 0.12, 0.02, C.cold, { segments: 10, rot: [0, 0, Math.PI / 2] });
    for (const z of [-1.9, 1.9]) {
      pb.boxMinMax(b.solid, [dx - 0.85, y, z - 0.3], [dx - 0.2, y + 0.55, z + 0.3], C.wood);
      for (const dyy of [0.12, 0.42]) pb.boxMinMax(b.solid, [dx - 0.87, y + dyy, z - 0.31], [dx - 0.2, y + dyy + 0.07, z + 0.31], C.woodLight);
      walls.push({ minX: dx - 0.9, maxX: dx - 0.15, minY: y, maxY: y + 0.6, minZ: z - 0.34, maxZ: z + 0.34 });
    }
    pb.sphere(b.solid, [dx - 0.55, y + 0.72, 1.9], [0.3, 0.17, 0.26], C.tile, 8);
    pb.sphere(b.solid, [dx - 0.6, y + 0.68, -1.9], [0.26, 0.15, 0.24], C.woodLight, 8);
    pb.cylinder(b.solid, [dx - 1.1, y + 0.4, 2.7], 0.3, 0.8, C.wood, { segments: 10, taper: 0.92 });
    pb.torus(b.solid, [dx - 1.1, y + 0.55, 2.7], 0.31, 0.02, C.iron, { segments: 10, rot: [Math.PI / 2, 0, 0] });
    walls.push({ minX: dx - 1.45, maxX: dx - 0.75, minY: y, maxY: y + 0.8, minZ: 2.35, maxZ: 3.05 });
  }
  return { object: interiorMeshes(ctx, 'kitchen', b), colliders: { floors: [], walls } };
}

function buildQuarters(ctx: BuildContext): ZoneBuild {
  const low = ctx.level === 'low';
  const pb = new PartBuilder(ctx.tracker, low ? 0.5 : 1);
  const b: Batches = { solid: new GeometryBatch(), glow: new GeometryBatch() };
  const walls: WallBox[] = [];
  const y = T2_TOP;
  const { cx, hx, hz } = PLAN.t3;
  const x0 = cx - hx; // back (−x) wall
  pb.boxMinMax(b.solid, [cx - hx + 0.15, y, -hz + 0.15], [cx + hx - 0.15, y + 0.03, hz - 0.15], C.floorHall);
  pb.custom(b.solid, flatShape(ctx.tracker, t3Plan(), [], T3_TOP - 0.1, 'down'), [0, 0, 0], C.ceiling);
  // Rug under the table.
  pb.cylinder(b.solid, [cx + 0.6, y + 0.04, 0], 1.6, 0.02, C.carpet, { segments: 20 });
  pb.cylinder(b.solid, [cx + 0.6, y + 0.05, 0], 1.3, 0.02, C.carpetDark, { segments: 20 });
  pb.cylinder(b.solid, [cx + 0.6, y + 0.06, 0], 1.05, 0.02, C.carpet, { segments: 20 });
  // Two bunk beds against the back wall, each bunk with its own blanket (cooks' quarters: interpretive layout).
  const blankets = ['#c8453a', '#3f74b8', '#4f9a5c', '#e0b13a'];
  let bed = 0;
  for (const z0 of [-3.1, 1.1]) {
    for (const lvl of [0.45, 1.55]) {
      pb.boxMinMax(b.solid, [x0 + 0.25, y + lvl, z0], [x0 + 2.15, y + lvl + 0.12, z0 + 2], C.wood);
      pb.boxMinMax(b.solid, [x0 + 0.3, y + lvl + 0.12, z0 + 0.05], [x0 + 2.1, y + lvl + 0.3, z0 + 1.95], C.cloth);
      pb.boxMinMax(b.solid, [x0 + 0.35, y + lvl + 0.3, z0 + 0.2], [x0 + 0.85, y + lvl + 0.45, z0 + 1.8], '#d8e3ea');
      const col = blankets[bed++ % blankets.length];
      pb.boxMinMax(b.solid, [x0 + 0.95, y + lvl + 0.3, z0 + 0.03], [x0 + 2.14, y + lvl + 0.38, z0 + 1.97], col);
      pb.boxMinMax(b.solid, [x0 + 2.14, y + lvl + 0.16, z0 + 0.03], [x0 + 2.19, y + lvl + 0.38, z0 + 1.97], col);
      if (!low) pb.boxMinMax(b.solid, [x0 + 1.45, y + lvl + 0.38, z0 + 0.03], [x0 + 1.6, y + lvl + 0.385, z0 + 1.97], C.trim);
    }
    for (const [dx, dz] of [[0.25, 0], [2.05, 0], [0.25, 1.9], [2.05, 1.9]] as const) {
      pb.boxMinMax(b.solid, [x0 + dx, y, z0 + dz], [x0 + dx + 0.1, y + 2.0, z0 + dz + 0.1], C.wood);
    }
    walls.push({ minX: cx - hx, maxX: cx - hx + 2.25, minY: y, maxY: y + 2.1, minZ: z0, maxZ: z0 + 2 });
  }
  // Round table with stools, a lamp, a mug and a deck of cards; hanging lantern above.
  pb.cylinder(b.solid, [cx + 0.6, y + 0.72, 0], 0.7, 0.06, C.wood, { segments: 14 });
  pb.cylinder(b.solid, [cx + 0.6, y + 0.36, 0], 0.08, 0.7, C.wood, { segments: 6 });
  for (const a of [0, 2.1, 4.2]) pb.cylinder(b.solid, [cx + 0.6 + Math.cos(a) * 1.0, y + 0.25, Math.sin(a) * 1.0], 0.22, 0.5, C.wood, { segments: 8 });
  walls.push({ minX: cx - 0.2, maxX: cx + 1.4, minY: y, maxY: y + 0.8, minZ: -0.8, maxZ: 0.8 });
  pb.cylinder(b.solid, [cx + 0.6, y + 0.78, 0.15], 0.08, 0.08, C.brass, { segments: 8 });
  pb.sphere(b.glow, [cx + 0.6, y + 0.9, 0.15], [0.07, 0.09, 0.07], C.glassWarm, 8);
  pb.cylinder(b.solid, [cx + 0.95, y + 0.81, -0.2], 0.05, 0.1, C.steel, { segments: 8, taper: 1.15 });
  pb.box(b.solid, [cx + 0.25, y + 0.77, -0.3], [0.14, 0.02, 0.2], C.cloth, [0, 0.4, 0]);
  pb.cylinder(b.solid, [cx + 0.6, T3_TOP - 0.45, 0], 0.012, 0.7, C.iron, { segments: 4 });
  pb.cylinder(b.solid, [cx + 0.6, T3_TOP - 0.72, 0], 0.12, 0.05, C.brass, { segments: 8, taper: 0.5 });
  pb.cylinder(b.glow, [cx + 0.6, T3_TOP - 0.92, 0], 0.13, 0.32, C.glassWarm, { segments: 8, taper: 0.85 });
  pb.cylinder(b.solid, [cx + 0.6, T3_TOP - 1.1, 0], 0.11, 0.05, C.brass, { segments: 8 });
  if (!low) for (let k = 0; k < 4; k++) pb.box(b.solid, [cx + 0.6 + Math.cos((k * Math.PI) / 2 + 0.78) * 0.125, T3_TOP - 0.92, Math.sin((k * Math.PI) / 2 + 0.78) * 0.125], [0.02, 0.34, 0.02], C.brass);
  // Bedside table with a lamp and books between the bunks, under the window.
  pb.boxMinMax(b.solid, [x0 + 0.1, y + 0.62, -0.45], [x0 + 0.7, y + 0.68, 0.45], C.woodLight);
  for (const [dx, dz] of [[0.14, -0.4], [0.66, -0.4], [0.14, 0.4], [0.66, 0.4]] as const) pb.boxMinMax(b.solid, [x0 + dx - 0.03, y, dz - 0.03], [x0 + dx + 0.03, y + 0.62, dz + 0.03], C.wood);
  pb.boxMinMax(b.solid, [x0 + 0.1, y + 0.4, -0.42], [x0 + 0.7, y + 0.6, 0.42], C.wood);
  pb.cylinder(b.solid, [x0 + 0.4, y + 0.71, 0.15], 0.09, 0.06, C.brass, { segments: 8 });
  pb.cylinder(b.solid, [x0 + 0.4, y + 0.88, 0.15], 0.015, 0.3, C.brass, { segments: 4 });
  pb.cylinder(b.solid, [x0 + 0.4, y + 1.08, 0.15], 0.2, 0.22, '#f3d9a0', { segments: 10, taper: 0.6 });
  pb.sphere(b.glow, [x0 + 0.4, y + 1.05, 0.15], 0.09, C.bulb, 8);
  pb.boxMinMax(b.solid, [x0 + 0.2, y + 0.68, -0.35], [x0 + 0.45, y + 0.74, -0.1], '#3f74b8');
  pb.boxMinMax(b.solid, [x0 + 0.2, y + 0.74, -0.34], [x0 + 0.44, y + 0.79, -0.12], '#c8453a');
  walls.push({ minX: x0, maxX: x0 + 0.75, minY: y, maxY: y + 0.75, minZ: -0.5, maxZ: 0.5 });
  // Sea chests at the foot of the bunks (half-cylinder lids, brass bands).
  for (const [z, col] of [[-1.55 - 0.7, C.woodDark], [1.55 + 0.7, C.wood]] as const) {
    const cxx = x0 + 2.55;
    pb.boxMinMax(b.solid, [cxx - 0.3, y, z - 0.5], [cxx + 0.3, y + 0.38, z + 0.5], col);
    pb.cylinder(b.solid, [cxx, y + 0.38, z], 0.22, 1.0, col, { segments: 10, scaleZ: 1.36, rot: [0, Math.PI / 2, Math.PI / 2], arc: { start: 0, length: Math.PI } });
    for (const dz of [-0.33, 0.33]) pb.boxMinMax(b.solid, [cxx - 0.31, y, z + dz - 0.04], [cxx + 0.31, y + 0.4, z + dz + 0.04], C.brass);
    pb.sphere(b.solid, [cxx + 0.31, y + 0.4, z], 0.045, C.brass, 6);
    walls.push({ minX: cxx - 0.3, maxX: cxx + 0.32, minY: y, maxY: y + 0.62, minZ: z - 0.5, maxZ: z + 0.5 });
  }
  // Hammock slung along the −z wall under the windows.
  const hxA = cx - 0.3;
  const hxB = cx + hx - 1.45;
  const hzc = -hz + 0.45;
  const segs = low ? 4 : 8;
  const sag = 0.35;
  const hy = (u: number) => y + 1.05 - sag * (1 - (2 * u - 1) ** 2);
  for (let k = 0; k < segs; k++) {
    const u0 = k / segs;
    const u1 = (k + 1) / segs;
    const xa = hxA + (hxB - hxA) * u0;
    const xb = hxA + (hxB - hxA) * u1;
    pb.box(b.solid, [(xa + xb) / 2, (hy(u0) + hy(u1)) / 2, hzc], [Math.hypot(xb - xa, hy(u1) - hy(u0)) + 0.01, 0.06, 0.62], k % 2 ? '#e8d9b0' : '#d9c590', [0, 0, Math.atan2(hy(u1) - hy(u0), xb - xa)]);
    if (k >= 1 && k <= segs - 3) pb.box(b.solid, [(xa + xb) / 2, (hy(u0) + hy(u1)) / 2 + 0.05, hzc], [Math.hypot(xb - xa, hy(u1) - hy(u0)) + 0.01, 0.05, 0.5], '#c8453a', [0, 0, Math.atan2(hy(u1) - hy(u0), xb - xa)]);
  }
  for (const [px, dir] of [[hxA - 0.08, 1], [hxB + 0.08, -1]] as const) {
    pb.boxMinMax(b.solid, [px - 0.05, y, hzc - 0.05], [px + 0.05, y + 1.5, hzc + 0.05], C.wood);
    pb.box(b.solid, [px + dir * 0.06, y + 1.05, hzc], [0.14, 0.03, 0.03], C.brass);
  }
  walls.push({ minX: hxA - 0.15, maxX: hxB + 0.15, minY: y, maxY: y + 1.1, minZ: hzc - 0.35, maxZ: hzc + 0.35 });
  // Coat rails beside the door (+x wall): toques, jackets, an apron. Wall-hung, kept clear of the doorway.
  const wx = cx + hx - 0.22;
  for (const s of [1, -1]) {
    pb.boxMinMax(b.solid, [wx - 0.03, y + 1.7, s > 0 ? 1.0 : -3.0], [wx + 0.05, y + 1.78, s > 0 ? 3.0 : -1.0], C.wood);
    for (let k = 0; k < 4; k++) pb.sphere(b.solid, [wx - 0.06, y + 1.66, s * (1.25 + k * 0.5)], 0.035, C.brass, 6);
    walls.push({ minX: wx - 0.3, maxX: wx + 0.1, minY: y + 0.7, maxY: y + 1.85, minZ: s > 0 ? 1.0 : -3.0, maxZ: s > 0 ? 3.0 : -1.0 });
  }
  pb.box(b.solid, [wx - 0.12, y + 1.2, 1.75], [0.12, 0.8, 0.4], '#3f74b8');
  pb.box(b.solid, [wx - 0.1, y + 1.28, 2.25], [0.06, 0.8, 0.42], C.cloth);
  pb.box(b.solid, [wx - 0.12, y + 1.2, -2.75], [0.12, 0.8, 0.4], '#c8453a');
  for (const z of [1.25, 2.75, -2.25]) {
    pb.cylinder(b.solid, [wx - 0.14, y + 1.5, z], 0.12, 0.2, C.cloth, { segments: 10 });
    pb.sphere(b.solid, [wx - 0.14, y + 1.64, z], [0.16, 0.12, 0.16], C.cloth, 9);
  }
  pb.sphere(b.solid, [wx - 0.14, y + 1.1, -1.25], [0.15, 0.2, 0.15], '#a8794a', 8);
  // Locker doors on the +z wall.
  pb.boxMinMax(b.solid, [cx + 0.2, y, hz - 0.65], [cx + 2.8, y + 2.0, hz - 0.15], '#5f8fa3');
  walls.push({ minX: cx + 0.2, maxX: cx + 2.8, minY: y, maxY: y + 2, minZ: hz - 0.7, maxZ: hz });
  if (!low) {
    for (const x of [cx + 1.07, cx + 1.93]) pb.boxMinMax(b.solid, [x - 0.015, y + 0.05, hz - 0.67], [x + 0.015, y + 1.95, hz - 0.65], C.iron);
    for (const x of [cx + 0.9, cx + 1.1, cx + 1.76, cx + 1.96]) pb.box(b.solid, [x, y + 1.0, hz - 0.68], [0.04, 0.2, 0.03], C.brass);
    pb.boxMinMax(b.solid, [cx + 0.2, y + 2.0, hz - 0.65], [cx + 2.8, y + 2.06, hz - 0.15], C.trim);
  }
  return { object: interiorMeshes(ctx, 'quarters', b), colliders: { floors: [], walls } };
}

/* ------------------------------------------------------------------------------------------ scene */

function build(ctx: BuildContext): SceneBuild {
  const root = new Group();
  root.name = 'baratie';
  const low = ctx.level === 'low';
  const pb = new PartBuilder(ctx.tracker, low ? 0.5 : 1);
  const solid = new GeometryBatch();
  const smooth = new GeometryBatch();
  const cloth = new GeometryBatch();
  const glow = new GeometryBatch();
  const detail = new GeometryBatch();

  const hull = buildHull(ctx, pb, smooth, solid, detail);
  buildHead(ctx, pb, smooth, solid);
  const tail = buildTail(ctx, pb, smooth, solid);
  const finFloors = buildFins(ctx, pb, smooth, detail);
  const tiers = buildTiers(ctx, pb, { solid, glow }, detail);
  const mastWalls = buildMasts(ctx, pb, solid, cloth, detail);
  const propWalls = buildProps(ctx, pb, glow, detail);

  const outlines = ctx.quality.outlines;
  const add = (m: Object3D | null) => m && root.add(m);
  add(batchToMesh(solid, ctx.tracker, { name: 'exterior:solid', material: ctx.materials.toon, castShadow: true, receiveShadow: true, inkMaterial: outlines ? ctx.materials.ink : undefined, inkThresholdDeg: 38 }));
  add(batchToMesh(smooth, ctx.tracker, { name: 'exterior:smooth', material: ctx.materials.toon, castShadow: true, receiveShadow: true, outlineMaterial: outlines ? ctx.materials.outline : undefined }));
  add(batchToMesh(cloth, ctx.tracker, { name: 'exterior:sails', material: ctx.materials.toon, castShadow: !low, receiveShadow: true }));
  add(batchToMesh(glow, ctx.tracker, { name: 'exterior:glow', material: ctx.materials.glow }));
  const detailMesh = batchToMesh(detail, ctx.tracker, { name: 'exterior:detail', material: ctx.materials.toon, castShadow: ctx.level === 'high', receiveShadow: true });
  add(detailMesh);
  for (const s of signs(ctx)) root.add(s);
  add(hullSeams(ctx));

  // Environment: bright anime daylight, cyan sea with foam hugging the hull, puffy clouds.
  const sunDirection = new Vector3(0.5, 0.78, 0.36).normalize();
  const lights = createDaylight(ctx, sunDirection, 46);
  root.add(lights.group);
  root.add(createSky(ctx, { top: '#2b84da', horizon: '#c8eeff', sunDirection }));
  const ocean = createOcean(ctx, { radius: ctx.quality.fogFar * 1.2, deep: '#1c6fb3', shallow: '#4cb8df', foam: '#f4fbff', footprintCenter: [-2, 0], footprintRadii: [31, 14.2] });
  root.add(ocean.object);
  const clouds = createClouds(ctx, low ? 6 : 12, [140, 300], [45, 95]);
  if (clouds) root.add(clouds);

  return {
    root,
    colliders: mergeColliders(hull, tiers, { floors: finFloors, walls: [...tail, ...mastWalls, ...propWalls] }),
    details: detailMesh ? [{ object: detailMesh, center: new Vector3(-4, 8, 0) }] : [],
    interiors: {
      hall: { zones: ['dining-hall', 'hall-stairs'], build: () => buildHall(ctx) },
      kitchen: { zones: ['kitchen'], build: () => buildKitchen(ctx) },
      quarters: { zones: ['quarters'], build: () => buildQuarters(ctx) },
    },
    animate: ocean.update ? [ocean.update] : [],
    sunDirection,
  };
}

export const scene: SceneModule = { definition, build };
