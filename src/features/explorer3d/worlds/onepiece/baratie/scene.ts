import { CanvasTexture, Color, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Vector3, type Object3D } from 'three';
import { GeometryBatch, batchToMesh } from '../../../engine/batch';
import type { FloorRect, WallBox } from '../../../engine/collision';
import type { BuildContext, ColliderSet, SceneBuild, SceneModule, ZoneBuild } from '../../../engine/sceneModule';
import { gableRoof, railing, slab, stairs, wall, type Batches, type Opening } from '../../../primitives/architecture';
import { createClouds, createDaylight, createOcean, createSky } from '../../../primitives/environment';
import { chairGeometry, chairsAround, instanced, roundTableGeometry, type Placement } from '../../../primitives/furniture';
import { PartBuilder } from '../../../primitives/parts';
import {
  deckFloorSlices,
  deckOutline,
  ellipsoidRings,
  extrudedSilhouette,
  flatPolygon,
  hullRings,
  loftGeometry,
  type HullProfile,
} from '../../../primitives/ships';
import { definition, DECK_Y, UPPER_Y } from './config';

/**
 * Baratie — procedural builder. Everything below is generated from numbers: no model, no image file.
 * Layout (plan, metres): stern x −27 … bow x +15.5, fish head to x +33; building x −14 … 12, z −8 … 8;
 * ground floor = kitchen (x < −7) | corridor (−7 … −4) | dining hall (−4 … 12); upper floor above kitchen +
 * corridor; terrace on the hall roof; battle fins on both sides at x −12 … 6.
 */
const C = {
  hullWood: '#9a5a2e',
  hullDark: '#6e3d1f',
  hullBand: '#f0dcb4',
  keel: '#4b2a1a',
  deck: '#c99a62',
  deckDark: '#b5854f',
  wall: '#f3e7cc',
  wallShade: '#e2d1ab',
  timber: '#6f4527',
  roof: '#b9442f',
  roofDark: '#8f3122',
  trim: '#2f5d73',
  glass: '#a9dcf0',
  glassWarm: '#ffd88a',
  headTeal: '#3a8e9e',
  headStripe: '#1f5866',
  headBelly: '#dfe8ea',
  lips: '#c4473a',
  mouth: '#3a1414',
  eyeWhite: '#fbfaf5',
  iris: '#f2c230',
  pupil: '#111111',
  iron: '#3b3f45',
  rope: '#d8c39a',
  sail: '#f6efe0',
  floorHall: '#a8693a',
  floorHall2: '#965c31',
  floorKitchen: '#d9d4c7',
  floorKitchen2: '#bdb7a8',
  cloth: '#fbf7ef',
  cushion: '#b23a3a',
  stove: '#2d2f33',
  flame: '#ff8a2a',
  steel: '#b8c0c8',
  brass: '#c9a14a',
};

/** Fish-shaped hull: oval in plan, narrowing towards the head. */
const HULL: HullProfile = {
  xStern: -27,
  xBow: 17,
  halfWidth: (t) => 12 * Math.pow(Math.sin(Math.PI * (0.06 + 0.86 * t)), 0.5),
  deckY: () => DECK_Y,
  keelY: (t) => -3.2 + 0.9 * Math.pow(t, 3),
  fullness: 0.62,
  stations: 44,
  sectionPoints: 18,
};

const HEAD = { x0: 15.4, x1: 33 };
const headRy = (t: number) => (t < 0.32 ? 6.3 + t * 1.2 : 6.7 * Math.pow(Math.max(0, 1 - (t - 0.32) / 0.68), 0.62) + 0.9);
const headRz = (t: number) => (t < 0.3 ? 6.9 + t * 0.8 : 7.15 * Math.pow(Math.max(0, 1 - (t - 0.3) / 0.7), 0.55) + 1.1);
const headCy = (t: number) => 3.1 - 0.9 * t;
const MOUTH_Y = 2.15;

const tmpColor = new Color();
const col = (hex: string) => tmpColor.set(hex).clone();
const HEAD_COLORS = {
  teal: col(C.headTeal),
  stripe: col(C.headStripe),
  belly: col(C.headBelly),
  lips: col(C.lips),
  mouth: col(C.mouth),
};

function headColor(p: Vector3): Color {
  const t = (p.x - HEAD.x0) / (HEAD.x1 - HEAD.x0);
  const cy = headCy(t);
  const ry = headRy(t);
  // Mouth slit near the snout, with lips around it.
  if (t > 0.78) {
    const d = Math.abs(p.y - MOUTH_Y);
    if (d < 0.32) return HEAD_COLORS.mouth;
    if (d < 0.62) return HEAD_COLORS.lips;
  }
  // Gill arc.
  const gillX = 20.2 - 0.05 * (p.y - 3) * (p.y - 3);
  if (Math.abs(p.x - gillX) < 0.24 && p.y > -0.5) return HEAD_COLORS.stripe;
  const rel = (p.y - cy) / ry;
  if (rel < -0.25) return HEAD_COLORS.belly;
  if (rel > 0.15 && Math.sin(p.z * 1.25 + p.x * 0.55 + Math.sin(p.x * 0.9) * 1.6) > 0.42) return HEAD_COLORS.stripe;
  return HEAD_COLORS.teal;
}

function stripedFin(origin: [number, number]): (p: Vector3) => Color {
  return (p) => {
    const a = Math.atan2(Math.abs(p.z) - origin[1], p.x - origin[0]);
    return Math.sin(a * 22) > 0.55 ? HEAD_COLORS.stripe : HEAD_COLORS.teal;
  };
}

function hullColor(p: Vector3): Color {
  if (p.y > DECK_Y - 0.55) return tmpColor.set(C.hullBand);
  if (p.y < 0.35) return tmpColor.set(C.keel);
  return tmpColor.set(Math.floor(p.y / 0.62) % 2 === 0 ? C.hullWood : C.hullDark);
}

/** Splits a closed outline into open polylines, dropping the points inside `gap` (fin roots, head joint). */
function splitOutline(points: Array<[number, number]>, gap: (x: number, z: number) => boolean): Array<Array<[number, number]>> {
  const out: Array<Array<[number, number]>> = [];
  let cur: Array<[number, number]> = [];
  const n = points.length;
  // Start at a point outside every gap so the loop wraps correctly.
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

function mergeColliders(...sets: Array<{ floors?: FloorRect[]; walls?: WallBox[] }>): ColliderSet {
  return { floors: sets.flatMap((s) => s.floors ?? []), walls: sets.flatMap((s) => s.walls ?? []) };
}

/* -------------------------------------------------------------------------------------------- exterior */

function buildHullAndHead(ctx: BuildContext, pb: PartBuilder, smooth: GeometryBatch, solid: GeometryBatch, detail: GeometryBatch): ColliderSet {
  const lowFactor = ctx.level === 'low' ? 0.6 : 1;
  // Hull shell + deck.
  const hull = loftGeometry(ctx.tracker, hullRings({ ...HULL, stations: Math.round(HULL.stations * lowFactor) }), { closed: false, capStart: true, flip: true });
  pb.custom(smooth, hull, [0, 0, 0], hullColor);
  const deck = flatPolygon(ctx.tracker, deckOutline(HULL, 0.05, 40), DECK_Y);
  pb.custom(solid, deck, [0, 0, 0], (p) => tmpColor.set(Math.floor((p.z + 40) / 0.55) % 2 === 0 ? C.deck : C.deckDark));
  // Gunwale cap.
  const outline = deckOutline(HULL, 0, 40);
  for (let i = 0; i < outline.length - 1; i++) {
    const [x0, z0] = outline[i];
    const [x1, z1] = outline[i + 1];
    const len = Math.hypot(x1 - x0, z1 - z0);
    if (len < 0.01) continue;
    pb.box(solid, [(x0 + x1) / 2, DECK_Y + 0.05, (z0 + z1) / 2], [len + 0.05, 0.22, 0.3], C.timber, [0, Math.atan2(-(z1 - z0), x1 - x0), 0]);
  }

  // Fish head (the detachable Sabagashira No. 1 prow).
  const stations = Math.round(36 * lowFactor);
  const ringPts = Math.round(30 * lowFactor);
  const head = loftGeometry(ctx.tracker, ellipsoidRings(HEAD.x0, HEAD.x1, stations, ringPts, headRy, headRz, headCy), { closed: true, capStart: true, capEnd: true, flip: true });
  pb.custom(smooth, head, [0, 0, 0], headColor);
  // Eyes.
  const eyeT = 0.56;
  const ex = HEAD.x0 + (HEAD.x1 - HEAD.x0) * eyeT;
  const eyeY = headCy(eyeT) + headRy(eyeT) * 0.42;
  const eyeZ = headRz(eyeT) * 0.86;
  for (const s of [-1, 1]) {
    pb.sphere(smooth, [ex, eyeY, s * eyeZ], [1.35, 1.35, 0.9], C.eyeWhite, 18);
    pb.sphere(smooth, [ex + 0.08, eyeY + 0.05, s * (eyeZ + 0.62)], [0.86, 0.86, 0.4], C.iris, 16);
    pb.sphere(smooth, [ex + 0.12, eyeY + 0.1, s * (eyeZ + 0.86)], [0.5, 0.5, 0.25], C.pupil, 12);
  }
  // Three cannon barrels poking out of the mouth.
  for (const z of [-0.85, 0, 0.85]) {
    pb.cylinder(solid, [HEAD.x1 - 0.35, MOUTH_Y, z], 0.26, 1.6, C.iron, { segments: 10, rot: [0, 0, -Math.PI / 2] });
    pb.cylinder(solid, [HEAD.x1 + 0.45, MOUTH_Y, z], 0.33, 0.18, C.iron, { segments: 10, rot: [0, 0, -Math.PI / 2] });
  }
  // A small dorsal crest on the head.
  const crest = extrudedSilhouette(ctx.tracker, [[0, 0], [2.6, 0], [1.2, 1.8], [-0.4, 1.4]], 0.3, 0.06, 4);
  pb.custom(smooth, crest, [HEAD.x0 + 2.8, headCy(0.15) + headRy(0.15) - 0.25, 0], stripedFin([HEAD.x0 + 2.8, 0]));

  // Stern tail fin (forked, vertical).
  const tail = extrudedSilhouette(
    ctx.tracker,
    [[0, 0], [2.6, -0.4], [4.2, 1.2], [8.4, -1.2], [6.6, 4.6], [9.2, 10.8], [4.8, 7.6], [2.6, 5.2], [-0.4, 3.6]],
    0.7,
    0.12,
    6,
  );
  pb.custom(smooth, tail, [-24.4, DECK_Y - 0.2, 0], stripedFin([-24.4, 0]), [0, Math.PI, 0]);

  // Battle fins, deployed as platforms on both sides.
  const finShape: Array<[number, number]> = [
    [0, 0], [17, 0], [16.5, 3.4], [12.4, 7.6], [7.4, 10.4], [3.6, 10.8], [1.4, 6.2],
  ];
  const fin = extrudedSilhouette(ctx.tracker, finShape, 0.36, 0.1, 6);
  const finX = -11.5;
  const finRoot = 10.4;
  for (const s of [-1, 1]) {
    pb.custom(smooth, fin, [finX, DECK_Y - 0.52, s * finRoot], stripedFin([finX + 4, finRoot]), [(s * Math.PI) / 2, 0, 0]);
    // Hinge beam along the hull.
    pb.box(solid, [finX + 8.5, DECK_Y - 0.4, s * (finRoot + 0.2)], [17.2, 0.35, 0.5], C.timber);
  }

  // Railing along the deck edge, open at the fin roots and at the head joint.
  const railPts = deckOutline(HULL, 0.35, 40);
  const lines = splitOutline(railPts, (x) => (x > -9.6 && x < 2.4) || x > HEAD.x0 - 0.3);
  const walls: WallBox[] = [];
  for (const line of lines) walls.push(...railing(pb, solid, { points: line, y: DECK_Y, height: 1.0, postSpacing: 1.3, color: C.timber, detail }));
  // Head back: not walkable.
  walls.push({ minX: HEAD.x0 - 0.2, maxX: HEAD.x0 + 2, minY: DECK_Y - 1, maxY: DECK_Y + 6, minZ: -7, maxZ: 7 });
  // Tail root.
  walls.push({ minX: -27.5, maxX: -24.2, minY: DECK_Y - 1, maxY: DECK_Y + 4, minZ: -0.6, maxZ: 0.6 });

  // Floors: deck slices + fin slices (fin top surface ≈ deck − 0.3).
  const floors: FloorRect[] = deckFloorSlices(HULL, DECK_Y, { inset: 0.45, slices: 34, xMax: HEAD.x0 - 0.25 });
  const finTop = DECK_Y - 0.52 + 0.18 + 0.1;
  const finRects: Array<[number, number, number, number]> = [
    // [x0, x1, zFrom, zTo] (|z| outward from the hull)
    [finX + 0.6, finX + 16.2, finRoot - 0.4, finRoot + 2.6],
    [finX + 1.8, finX + 13.2, finRoot + 2.6, finRoot + 6.2],
    [finX + 3.2, finX + 9.4, finRoot + 6.2, finRoot + 9.2],
  ];
  for (const s of [-1, 1]) {
    for (const [x0, x1, a, b] of finRects) {
      floors.push({ minX: x0, maxX: x1, minZ: s < 0 ? -b : a, maxZ: s < 0 ? -a : b, y: finTop });
    }
  }
  return { floors, walls };
}

function buildBuildingShell(pb: PartBuilder, b: Batches, detail: GeometryBatch): ColliderSet {
  const walls: WallBox[] = [];
  const floors: FloorRect[] = [];
  const H = UPPER_Y - DECK_Y; // 4.5 m ground floor
  const T = 0.3;
  const win = (from: number, to: number): Opening => ({ from, to, bottom: 1.05, top: 3.5, kind: 'window' });
  const port = (c: number, r = 0.45, y = 2.6): Opening => ({ from: c - r, to: c + r, bottom: y - r, top: y + r, kind: 'porthole' });
  const base = { y0: DECK_Y, height: H, thickness: T, color: C.wall, frameColor: C.timber, glassColor: C.glass } as const;

  // Ground floor outer walls.
  walls.push(...wall(pb, b, { ...base, axis: 'z', at: 12, from: -8, to: 8, openings: [win(-6.4, -3.6), { from: -1.3, to: 1.3, bottom: 0, top: 3.2, kind: 'door' }, win(3.6, 6.4)] }));
  walls.push(...wall(pb, b, { ...base, axis: 'z', at: -14, from: -8, to: 8, openings: [port(-5), port(-1.5), { from: 3, to: 4.4, bottom: 0, top: 2.6, kind: 'door' }, port(6.4)] }));
  const sideOpenings: Opening[] = [port(-12.5), port(-9.5), port(-5.5), win(-2.6, -0.4), win(0.9, 3.1), win(4.4, 6.6), win(7.9, 10.1)];
  for (const z of [-8, 8]) walls.push(...wall(pb, b, { ...base, axis: 'x', at: z, from: -14, to: 12, openings: sideOpenings }));
  // Timber posts at the corners and a beam at the top: the half-timbered look.
  for (const [x, z] of [[-14, -8], [-14, 8], [12, -8], [12, 8], [-4, -8], [-4, 8], [-7, -8], [-7, 8]] as const) {
    pb.box(b.solid, [x, DECK_Y + H / 2, z], [0.42, H + 0.1, 0.42], C.timber);
  }
  pb.boxMinMax(b.solid, [-14.25, UPPER_Y - 0.35, -8.25], [12.25, UPPER_Y + 0.05, 8.25], C.timber);
  // Plinth: four strips hugging the outer wall faces (never a solid block: the floors are inside).
  pb.boxMinMax(b.solid, [-14.27, DECK_Y, -8.27], [12.27, DECK_Y + 0.55, -8.12], C.wallShade);
  pb.boxMinMax(b.solid, [-14.27, DECK_Y, 8.12], [12.27, DECK_Y + 0.55, 8.27], C.wallShade);
  pb.boxMinMax(b.solid, [-14.27, DECK_Y, -8.12], [-14.12, DECK_Y + 0.55, 8.12], C.wallShade);
  pb.boxMinMax(b.solid, [12.12, DECK_Y, -8.12], [12.27, DECK_Y + 0.55, 8.12], C.wallShade);

  // Hall roof = terrace (walkable), with railing; gap for the outer stairs landing at x 7.5 … 9.5 on the −z side.
  const terrace = slab(pb, b.solid, { minX: -4, maxX: 12.2, minZ: -8.2, maxZ: 8.2, y: UPPER_Y, thickness: 0.35, color: C.deck })!;
  floors.push(terrace);
  const ty = UPPER_Y;
  walls.push(
    ...railing(pb, b.solid, { points: [[-3.8, 8.05], [12.05, 8.05], [12.05, -8.05], [9.6, -8.05]], y: ty, color: C.timber, detail }),
    ...railing(pb, b.solid, { points: [[7.4, -8.05], [-3.8, -8.05]], y: ty, color: C.timber, detail }),
  );
  // Parasol tables on the terrace (props).
  for (const [x, z] of [[3, 3.5], [3, -3.5], [8.5, 3.5]] as const) {
    pb.cylinder(detail, [x, ty + 1.3, z], 0.05, 2.6, C.timber, { segments: 6 });
    pb.cylinder(detail, [x, ty + 2.55, z], 1.6, 0.5, C.roof, { segments: 10, taper: 0.05 });
    pb.cylinder(detail, [x, ty + 0.4, z], 0.55, 0.06, C.cloth, { segments: 12 });
    pb.cylinder(detail, [x, ty + 0.2, z], 0.06, 0.4, C.timber, { segments: 6 });
    walls.push({ minX: x - 0.5, maxX: x + 0.5, minY: ty, maxY: ty + 1, minZ: z - 0.5, maxZ: z + 0.5 });
  }

  // Outer staircase deck → terrace along the −z wall.
  const outer = stairs(pb, b.solid, { axis: 'x', uBottom: 1, uTop: 7.5, c0: -9.55, c1: -8.2, yBottom: DECK_Y, yTop: UPPER_Y, steps: 14, color: C.deck, stringerColor: C.timber, sides: true });
  floors.push(outer.floor);
  walls.push(outer.walls[0]); // outer side only (the building wall is the inner side)
  const landing = slab(pb, b.solid, { minX: 7.5, maxX: 9.7, minZ: -9.7, maxZ: -8.1, y: UPPER_Y, thickness: 0.3, color: C.deck })!;
  floors.push(landing);
  walls.push(...railing(pb, b.solid, { points: [[7.5, -9.65], [9.65, -9.65], [9.65, -8.2]], y: UPPER_Y, color: C.timber, detail }));
  pb.box(b.solid, [8.6, DECK_Y + 2.1, -9.6], [0.3, 4.4, 0.3], C.timber);

  // Upper floor block (above kitchen + corridor).
  const ub = { y0: UPPER_Y, height: 4, thickness: T, color: C.wall, frameColor: C.timber, glassColor: C.glass } as const;
  const uh = (c: number) => port(c, 0.55, 2.2);
  walls.push(...wall(pb, b, { ...ub, axis: 'z', at: -4, from: -8, to: 8, openings: [win(-6.6, -4.2), { from: -1.1, to: 1.1, bottom: 0, top: 2.7, kind: 'door' }, win(4.2, 6.6)] }));
  walls.push(...wall(pb, b, { ...ub, axis: 'z', at: -14, from: -8, to: 8, openings: [uh(-4), uh(0), uh(4)] }));
  for (const z of [-8, 8]) walls.push(...wall(pb, b, { ...ub, axis: 'x', at: z, from: -14, to: -4, openings: [uh(-12), uh(-9), uh(-6.2)] }));
  for (const [x, z] of [[-14, -8], [-14, 8], [-4, -8], [-4, 8]] as const) pb.box(b.solid, [x, UPPER_Y + 2, z], [0.42, 4.1, 0.42], C.timber);
  gableRoof(pb, b.solid, { minX: -14.3, maxX: -3.7, minZ: -8.3, maxZ: 8.3, y: UPPER_Y + 4, rise: 3.2, overhang: 0.7, ridge: 'x', roofColor: C.roof, gableColor: C.wall });
  pb.box(b.solid, [-9, UPPER_Y + 4 + 3.25, 0], [11.6, 0.25, 0.3], C.roofDark);
  // Door canopy towards the terrace.
  pb.box(b.solid, [-3.2, UPPER_Y + 3, 0], [1.6, 0.16, 3.2], C.roof, [0, 0, -0.25]);

  // Chimneys (kitchen) with stylized smoke.
  for (const z of [-3.4, 3.4]) {
    pb.cylinder(b.solid, [-11.5, UPPER_Y + 6.2, z], 0.55, 4.2, C.iron, { segments: 12 });
    pb.cylinder(b.solid, [-11.5, UPPER_Y + 8.35, z], 0.7, 0.3, C.iron, { segments: 12 });
    pb.sphere(detail, [-11.4, UPPER_Y + 9.4, z], 0.75, '#e9edf1', 8);
    pb.sphere(detail, [-11.0, UPPER_Y + 10.4, z + 0.3], 0.95, '#f4f6f8', 8);
  }

  // The sign above the terrace door: frame here, name texture added as a separate quad.
  pb.boxMinMax(b.solid, [-3.95, UPPER_Y + 4.4, -5.6], [-3.55, UPPER_Y + 7.6, 5.6], C.timber);
  pb.boxMinMax(b.solid, [-3.6, UPPER_Y + 4.6, -5.3], [-3.45, UPPER_Y + 7.4, 5.3], C.trim);
  for (const z of [-4.8, 4.8]) pb.box(b.solid, [-3.9, UPPER_Y + 4.2, z], [0.3, 0.8, 0.3], C.timber);

  // Porch canopy over the hall entrance.
  gableRoof(pb, b.solid, { minX: 12, maxX: 14.6, minZ: -2.2, maxZ: 2.2, y: DECK_Y + 3.5, rise: 1.1, overhang: 0.25, ridge: 'x', roofColor: C.roof, gableColor: C.wall });
  for (const z of [-2, 2]) pb.box(b.solid, [14.4, DECK_Y + 1.75, z], [0.25, 3.5, 0.25], C.timber);
  walls.push({ minX: 14.25, maxX: 14.55, minY: DECK_Y, maxY: DECK_Y + 3.5, minZ: -2.15, maxZ: -1.85 }, { minX: 14.25, maxX: 14.55, minY: DECK_Y, maxY: DECK_Y + 3.5, minZ: 1.85, maxZ: 2.15 });
  // Warm lanterns by the door.
  for (const z of [-1.7, 1.7]) pb.sphere(b.glow, [12.35, DECK_Y + 3.1, z], 0.22, C.glassWarm, 10);

  return { floors, walls };
}

function buildMastAndProps(ctx: BuildContext, pb: PartBuilder, solid: GeometryBatch, smooth: GeometryBatch, detail: GeometryBatch): WallBox[] {
  const walls: WallBox[] = [];
  const mx = -19.5;
  pb.cylinder(solid, [mx, DECK_Y + 9.5, 0], 0.42, 19, C.timber, { segments: 12, taper: 0.7 });
  pb.cylinder(solid, [mx, DECK_Y + 14.2, 0], 0.22, 9.5, C.timber, { segments: 8, rot: [Math.PI / 2, 0, 0] });
  pb.cylinder(smooth, [mx, DECK_Y + 13.7, 0], 0.55, 8.6, C.sail, { segments: 12, rot: [Math.PI / 2, 0, 0] });
  pb.cylinder(solid, [mx, DECK_Y + 17.6, 0], 1.1, 0.8, C.timber, { segments: 12 });
  // Pennant.
  pb.box(solid, [mx - 1.1, DECK_Y + 19.2, 0], [2.2, 0.8, 0.05], C.trim);
  walls.push({ minX: mx - 0.5, maxX: mx + 0.5, minY: DECK_Y, maxY: DECK_Y + 19, minZ: -0.5, maxZ: 0.5 });
  // Rigging lines down to the gunwale.
  for (const s of [-1, 1]) {
    for (const dx of [-2.5, 2.5]) {
      const from = new Vector3(mx, DECK_Y + 16, 0);
      const to = new Vector3(mx + dx, DECK_Y + 0.4, s * 9.2);
      const mid = from.clone().add(to).multiplyScalar(0.5);
      const len = from.distanceTo(to);
      const dir = to.clone().sub(from).normalize();
      const rotX = Math.atan2(dir.z, dir.y);
      const rotZ = -Math.asin(Math.max(-1, Math.min(1, dir.x)));
      pb.cylinder(detail, [mid.x, mid.y, mid.z], 0.035, len, C.rope, { segments: 4, rot: [rotX, 0, rotZ] });
    }
  }
  // Barrels and crates on the stern deck (seeded layout).
  const rnd = ctx.random;
  for (let i = 0; i < 9; i++) {
    const x = -25 + rnd() * 6.5;
    const z = (rnd() > 0.5 ? 1 : -1) * (3.5 + rnd() * 3.5);
    if (rnd() > 0.45) {
      pb.cylinder(detail, [x, DECK_Y + 0.5, z], 0.42, 1, C.hullWood, { segments: 10, taper: 0.9 });
      pb.cylinder(detail, [x, DECK_Y + 0.55, z], 0.44, 0.08, C.iron, { segments: 10 });
    } else {
      const s = 0.7 + rnd() * 0.4;
      pb.box(detail, [x, DECK_Y + s / 2, z], [s, s, s], C.deckDark, [0, rnd() * 1.2, 0]);
    }
    walls.push({ minX: x - 0.55, maxX: x + 0.55, minY: DECK_Y, maxY: DECK_Y + 1.1, minZ: z - 0.55, maxZ: z + 0.55 });
  }
  // Lanterns along the deck.
  for (const x of [-20, -10, 0, 10]) for (const s of [-1, 1]) {
    const t = (x - HULL.xStern) / (HULL.xBow - HULL.xStern);
    const z = s * (HULL.halfWidth(t) - 0.4);
    pb.cylinder(detail, [x, DECK_Y + 1.6, z], 0.05, 1.2, C.iron, { segments: 4 });
    pb.sphere(detail, [x, DECK_Y + 2.3, z], 0.2, C.glassWarm, 8);
  }
  return walls;
}

function signQuad(ctx: BuildContext): Object3D {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const g = canvas.getContext('2d')!;
  g.fillStyle = C.trim;
  g.fillRect(0, 0, canvas.width, canvas.height);
  g.strokeStyle = '#f3d58b';
  g.lineWidth = 10;
  g.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);
  g.fillStyle = '#f9e7b0';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = '700 150px Cinzel, Georgia, "Times New Roman", serif';
  g.fillText(ctx.locationName.toUpperCase(), canvas.width / 2, canvas.height / 2 + 6, canvas.width - 80);
  const tex = ctx.tracker.track(new CanvasTexture(canvas));
  tex.anisotropy = 4;
  const geo = ctx.tracker.track(new PlaneGeometry(10.4, 2.6));
  const mat = ctx.tracker.track(new MeshBasicMaterial({ map: tex, fog: true }));
  const mesh = new Mesh(geo, mat);
  mesh.position.set(-3.42, UPPER_Y + 6, 0);
  mesh.rotation.y = Math.PI / 2;
  mesh.name = 'sign';
  return mesh;
}

/* -------------------------------------------------------------------------------------------- interiors */

function buildGroundFloor(ctx: BuildContext): ZoneBuild {
  const pb = new PartBuilder(ctx.tracker, ctx.level === 'low' ? 0.5 : 1);
  const b: Batches = { solid: new GeometryBatch(), glow: new GeometryBatch() };
  const walls: WallBox[] = [];
  const floors: FloorRect[] = [];
  const H = UPPER_Y - DECK_Y;
  const inner = { y0: DECK_Y, height: H, thickness: 0.22, color: C.wallShade, frameColor: C.timber, glassColor: C.glass } as const;

  // Floors (visual: the deck already provides the walkable surface at the same height).
  pb.boxMinMax(b.solid, [-4, DECK_Y, -7.85], [11.85, DECK_Y + 0.02, 7.85], C.floorHall);
  for (let x = -3.5; x < 11.8; x += 0.9) pb.boxMinMax(b.solid, [x, DECK_Y + 0.02, -7.85], [x + 0.06, DECK_Y + 0.03, 7.85], C.floorHall2);
  for (let x = -13.85; x < -7; x += 0.8) for (let z = -7.85; z < 7.85; z += 0.8) {
    if ((Math.round((x + 14) / 0.8) + Math.round((z + 8) / 0.8)) % 2 === 0) pb.boxMinMax(b.solid, [x, DECK_Y, z], [x + 0.8, DECK_Y + 0.025, z + 0.8], C.floorKitchen);
    else pb.boxMinMax(b.solid, [x, DECK_Y, z], [x + 0.8, DECK_Y + 0.02, z + 0.8], C.floorKitchen2);
  }
  // Ceiling (underside of the terrace / upper floor) with beams.
  // (the kitchen stairwell x −13.8 … −12.2, z −5.6 … 0.4 stays open)
  for (const [x0, x1, z0, z1] of [[-12.2, 11.85, -7.85, 7.85], [-13.85, -12.2, -7.85, -5.6], [-13.85, -12.2, 0.4, 7.85]] as const) {
    pb.boxMinMax(b.solid, [x0, UPPER_Y - 0.4, z0], [x1, UPPER_Y - 0.36, z1], C.wall);
  }
  for (let x = -3; x < 12; x += 2.5) pb.boxMinMax(b.solid, [x, UPPER_Y - 0.7, -7.85], [x + 0.3, UPPER_Y - 0.38, 7.85], C.timber);

  // Partitions: hall | corridor (x −4), corridor | kitchen (x −7).
  walls.push(...wall(pb, b, { ...inner, axis: 'z', at: -4, from: -7.85, to: 7.85, openings: [{ from: -1.2, to: 1.2, bottom: 0, top: 3, kind: 'door' }, { from: 3.4, to: 5.8, bottom: 1.1, top: 2.6, kind: 'window' }] }));
  walls.push(...wall(pb, b, { ...inner, axis: 'z', at: -7, from: -7.85, to: 7.85, openings: [{ from: 1.6, to: 3.4, bottom: 0, top: 3, kind: 'door' }, { from: -3.2, to: -1.2, bottom: 0, top: 3, kind: 'door' }] }));

  // Dining hall: round tables, chairs (instanced), bar counter, chandeliers.
  const tables: Placement[] = [];
  const chairs: Placement[] = [];
  for (const x of [-0.6, 3.4, 7.4]) for (const z of [-5, -1.6, 1.8, 5.2]) {
    if (x === -0.6 && z === -5) continue; // bar counter corner
    tables.push({ x, y: DECK_Y, z, yaw: 0 });
    chairs.push(...chairsAround(x, DECK_Y, z, 4, 0.95, Math.PI / 4));
    walls.push({ minX: x - 0.62, maxX: x + 0.62, minY: DECK_Y, maxY: DECK_Y + 1, minZ: z - 0.62, maxZ: z + 0.62 });
  }
  pb.boxMinMax(b.solid, [-3.7, DECK_Y, -7.6], [-2.6, DECK_Y + 1.1, -3.2], C.timber);
  pb.boxMinMax(b.solid, [-3.8, DECK_Y + 1.1, -7.7], [-2.5, DECK_Y + 1.2, -3.1], C.deck);
  walls.push({ minX: -3.8, maxX: -2.5, minY: DECK_Y, maxY: DECK_Y + 1.2, minZ: -7.7, maxZ: -3.1 });
  for (let i = 0; i < 6; i++) pb.cylinder(b.glow, [-3.5 + (i % 3) * 0.3, DECK_Y + 1.45, -7.4 + Math.floor(i / 3) * 0.3 + i * 0.6], 0.09, 0.45, i % 2 ? '#6fbf73' : '#c2563e', { segments: 6 });
  for (const x of [1.4, 5.4, 9.4]) {
    pb.cylinder(b.solid, [x, UPPER_Y - 0.75, 0], 0.025, 0.6, C.brass, { segments: 4 });
    pb.cylinder(b.solid, [x, UPPER_Y - 1.08, 0], 0.55, 0.06, C.brass, { segments: 12 });
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      pb.sphere(b.glow, [x + Math.cos(a) * 0.5, UPPER_Y - 0.98, Math.sin(a) * 0.5], 0.09, C.glassWarm, 8);
    }
  }
  // Wainscot band inside the hall.
  for (const z of [-7.8, 7.8]) pb.boxMinMax(b.solid, [-3.9, DECK_Y, z - 0.03], [11.8, DECK_Y + 1, z + 0.03], C.timber);

  // Kitchen: stoves with flames, counters, island, sink, hanging pots.
  pb.boxMinMax(b.solid, [-13.6, DECK_Y, 6.6], [-7.6, DECK_Y + 0.95, 7.8], C.stove);
  for (let i = 0; i < 6; i++) {
    const x = -13 + i * 1;
    pb.cylinder(b.glow, [x, DECK_Y + 0.98, 7.2], 0.28, 0.04, C.flame, { segments: 10 });
    if (i % 2 === 0) pb.cylinder(b.solid, [x, DECK_Y + 1.3, 7.2], 0.36, 0.6, C.steel, { segments: 12 });
  }
  pb.boxMinMax(b.solid, [-13.7, DECK_Y + 2.2, 6.9], [-7.5, DECK_Y + 2.9, 7.85], C.steel); // hood
  walls.push({ minX: -13.7, maxX: -7.5, minY: DECK_Y, maxY: DECK_Y + 1.2, minZ: 6.5, maxZ: 7.85 });
  pb.boxMinMax(b.solid, [-11.6, DECK_Y, -7.8], [-7.4, DECK_Y + 0.92, -6.9], C.timber);
  pb.boxMinMax(b.solid, [-11.65, DECK_Y + 0.92, -7.85], [-7.35, DECK_Y + 1, -6.85], C.steel);
  walls.push({ minX: -11.65, maxX: -7.35, minY: DECK_Y, maxY: DECK_Y + 1, minZ: -7.85, maxZ: -6.85 });
  pb.boxMinMax(b.solid, [-11.2, DECK_Y, -1], [-8.4, DECK_Y + 0.9, 1], C.timber);
  pb.boxMinMax(b.solid, [-11.3, DECK_Y + 0.9, -1.1], [-8.3, DECK_Y + 1, 1.1], C.deck);
  walls.push({ minX: -11.3, maxX: -8.3, minY: DECK_Y, maxY: DECK_Y + 1, minZ: -1.1, maxZ: 1.1 });
  pb.boxMinMax(b.solid, [-11.2, UPPER_Y - 1.25, -0.05], [-8.4, UPPER_Y - 1.2, 0.05], C.iron);
  for (let i = 0; i < 6; i++) pb.cylinder(b.solid, [-11 + i * 0.5, UPPER_Y - 1.6, 0], 0.18, 0.3, i % 2 ? C.steel : '#b86b3c', { segments: 10 });
  // Big pot and a cutting board.
  pb.cylinder(b.solid, [-9.8, DECK_Y + 1.35, 0.3], 0.45, 0.6, C.steel, { segments: 14 });
  pb.boxMinMax(b.solid, [-10.9, DECK_Y + 1, -0.7], [-10, DECK_Y + 1.06, -0.1], '#e0c08a');

  // Kitchen stairs to the upper floor (climb towards −z), with a stairwell in the ceiling.
  const ks = stairs(pb, b.solid, { axis: 'z', uBottom: 0.4, uTop: -5.6, c0: -13.8, c1: -12.2, yBottom: DECK_Y, yTop: UPPER_Y, steps: 16, color: C.deck, stringerColor: C.timber, sides: true, tag: 'ground' });
  floors.push(ks.floor);
  walls.push(ks.walls[1]); // open side (the exterior wall covers the other)

  // Corridor: a lamp and a notice board-like panel (no text).
  pb.sphere(b.glow, [-5.5, UPPER_Y - 0.9, -4], 0.25, C.glassWarm, 10);
  pb.sphere(b.glow, [-5.5, UPPER_Y - 0.9, 4], 0.25, C.glassWarm, 10);

  const group = new Group();
  group.name = 'interior:ground';
  const solid = batchToMesh(b.solid, ctx.tracker, { name: 'ground:solid', material: ctx.materials.toon, receiveShadow: false, inkMaterial: ctx.materials.ink, inkThresholdDeg: 40 });
  const glow = batchToMesh(b.glow, ctx.tracker, { name: 'ground:glow', material: ctx.materials.glow });
  if (solid) group.add(solid);
  if (glow) group.add(glow);
  const chairGeo = chairGeometry(pb, ctx.tracker, C.timber, C.cushion);
  const tableGeo = roundTableGeometry(pb, ctx.tracker, C.timber, C.cloth, 0.62);
  group.add(instanced('chairs', chairGeo, ctx.materials.toon, chairs), instanced('tables', tableGeo, ctx.materials.toon, tables));
  return { object: group, colliders: { floors, walls } };
}

function buildUpperFloor(ctx: BuildContext): ZoneBuild {
  const pb = new PartBuilder(ctx.tracker, ctx.level === 'low' ? 0.5 : 1);
  const b: Batches = { solid: new GeometryBatch(), glow: new GeometryBatch() };
  const walls: WallBox[] = [];
  const floors: FloorRect[] = [];
  // Floor with the stairwell opening (x −13.8 … −12.2, z −5.6 … 0.4).
  const parts: Array<[number, number, number, number]> = [
    [-12.2, -4, -8, 8],
    [-14, -12.2, -8, -5.6],
    [-14, -12.2, 0.4, 8],
  ];
  for (const [x0, x1, z0, z1] of parts) {
    floors.push(slab(pb, b.solid, { minX: x0, maxX: x1, minZ: z0, maxZ: z1, y: UPPER_Y, thickness: 0.3, color: C.floorHall, tag: 'upper' })!);
  }
  walls.push(...railing(pb, b.solid, { points: [[-13.8, 0.45], [-12.2, 0.45], [-12.2, -5.6]], y: UPPER_Y, color: C.timber, tag: 'upper' }));
  // Ceiling under the roof.
  pb.boxMinMax(b.solid, [-13.85, UPPER_Y + 3.95, -7.85], [-4.15, UPPER_Y + 4, 7.85], C.wall);
  // Crew lounge (interpretive): long table, benches, barrels, hammocks.
  pb.boxMinMax(b.solid, [-10.5, UPPER_Y + 0.72, -1.2], [-5.5, UPPER_Y + 0.8, 1.2], C.timber);
  for (const x of [-10, -6]) for (const z of [-0.9, 0.9]) pb.boxMinMax(b.solid, [x - 0.06, UPPER_Y, z - 0.06], [x + 0.06, UPPER_Y + 0.72, z + 0.06], C.timber);
  for (const z of [-1.9, 1.9]) pb.boxMinMax(b.solid, [-10.4, UPPER_Y + 0.42, z - 0.25], [-5.6, UPPER_Y + 0.48, z + 0.25], C.deckDark);
  walls.push({ minX: -10.6, maxX: -5.4, minY: UPPER_Y, maxY: UPPER_Y + 0.9, minZ: -2.2, maxZ: 2.2 });
  for (const z of [-6.8, 6.8]) {
    pb.cylinder(b.solid, [-9, UPPER_Y + 2.3, z], 0.5, 4.2, C.sail, { segments: 10, rot: [0, 0, Math.PI / 2], scaleZ: 0.35 });
    walls.push({ minX: -11.2, maxX: -6.8, minY: UPPER_Y + 1.8, maxY: UPPER_Y + 2.8, minZ: z - 0.4, maxZ: z + 0.4 });
  }
  for (const [x, z] of [[-13.2, 7], [-13.2, 6.1], [-12.3, 7]] as const) {
    pb.cylinder(b.solid, [x, UPPER_Y + 0.5, z], 0.4, 1, C.hullWood, { segments: 10, taper: 0.9 });
    walls.push({ minX: x - 0.45, maxX: x + 0.45, minY: UPPER_Y, maxY: UPPER_Y + 1, minZ: z - 0.45, maxZ: z + 0.45 });
  }
  for (const x of [-11, -7]) pb.sphere(b.glow, [x, UPPER_Y + 3.4, 0], 0.28, C.glassWarm, 10);

  const group = new Group();
  group.name = 'interior:upper';
  const solid = batchToMesh(b.solid, ctx.tracker, { name: 'upper:solid', material: ctx.materials.toon, receiveShadow: false, inkMaterial: ctx.materials.ink, inkThresholdDeg: 40 });
  const glow = batchToMesh(b.glow, ctx.tracker, { name: 'upper:glow', material: ctx.materials.glow });
  if (solid) group.add(solid);
  if (glow) group.add(glow);
  return { object: group, colliders: { floors, walls } };
}

/* -------------------------------------------------------------------------------------------- scene */

function build(ctx: BuildContext): SceneBuild {
  const root = new Group();
  root.name = 'baratie';
  const pb = new PartBuilder(ctx.tracker, ctx.level === 'low' ? 0.5 : 1);
  const solid = new GeometryBatch();
  const smooth = new GeometryBatch();
  const glow = new GeometryBatch();
  const detail = new GeometryBatch();

  const hull = buildHullAndHead(ctx, pb, smooth, solid, detail);
  const shell = buildBuildingShell(pb, { solid, glow }, detail);
  const props = buildMastAndProps(ctx, pb, solid, smooth, detail);

  const outlines = ctx.quality.outlines;
  const add = (m: Object3D | null) => m && root.add(m);
  add(batchToMesh(solid, ctx.tracker, { name: 'exterior:solid', material: ctx.materials.toon, castShadow: true, receiveShadow: true, inkMaterial: outlines ? ctx.materials.ink : undefined, inkThresholdDeg: 38 }));
  add(batchToMesh(smooth, ctx.tracker, { name: 'exterior:smooth', material: ctx.materials.toon, castShadow: true, receiveShadow: true, outlineMaterial: outlines ? ctx.materials.outline : undefined }));
  add(batchToMesh(glow, ctx.tracker, { name: 'exterior:glow', material: ctx.materials.glow }));
  const detailMesh = batchToMesh(detail, ctx.tracker, { name: 'exterior:detail', material: ctx.materials.toon, castShadow: ctx.level === 'high', receiveShadow: true });
  add(detailMesh);
  root.add(signQuad(ctx));

  // Environment.
  const sunDirection = new Vector3(0.55, 0.75, 0.38).normalize();
  const lights = createDaylight(ctx, sunDirection, 42);
  root.add(lights.group);
  root.add(createSky(ctx, { top: '#3d8fd6', horizon: '#cfeaf7', sunDirection }));
  const ocean = createOcean(ctx, { radius: ctx.quality.fogFar * 1.2, deep: '#1d6fa3', shallow: '#3fa7c9', foam: '#f2fbff', footprintCenter: [0, 0], footprintRadii: [31, 14] });
  root.add(ocean.object);
  const clouds = createClouds(ctx, ctx.level === 'low' ? 6 : 12, [140, 300], [45, 90]);
  if (clouds) root.add(clouds);

  return {
    root,
    colliders: mergeColliders(hull, shell, { walls: props }),
    details: detailMesh ? [{ object: detailMesh, center: new Vector3(-4, 6, 0) }] : [],
    interiors: {
      ground: { zones: ['dining-hall', 'corridor', 'kitchen', 'kitchen-stairs'], build: () => buildGroundFloor(ctx) },
      upper: { zones: ['upper-floor'], build: () => buildUpperFloor(ctx) },
    },
    animate: ocean.update ? [ocean.update] : [],
    sunDirection,
  };
}

export const scene: SceneModule = { definition, build };
