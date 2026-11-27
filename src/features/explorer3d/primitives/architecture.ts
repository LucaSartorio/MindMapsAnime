import type { ColorSpec, GeometryBatch } from '../engine/batch';
import type { FloorRect, WallBox } from '../engine/collision';
import type { PartBuilder, XYZ } from './parts';

/**
 * Parametric architecture: every function appends visual parts to batches AND returns the matching low-cost
 * colliders, so geometry and collisions can never drift apart. Walls are axis-aligned by design (cheap AABB
 * collisions); curved silhouettes belong to hull/loft primitives.
 */
export interface Opening {
  /** Along-wall coordinates (absolute, same axis as the wall). */
  from: number;
  to: number;
  /** Heights relative to the wall base. */
  bottom: number;
  top: number;
  /** `door` leaves a walkable hole; `window` is glazed (blocks); `porthole` is a round glazed decal (no hole). */
  kind: 'window' | 'door' | 'porthole';
}

export interface WallSpec {
  /** The wall runs along this axis… */
  axis: 'x' | 'z';
  /** …at this fixed coordinate of the other axis. */
  at: number;
  from: number;
  to: number;
  y0: number;
  height: number;
  thickness: number;
  color: ColorSpec;
  frameColor?: ColorSpec;
  glassColor?: ColorSpec;
  openings?: Opening[];
  /** false = decorative only (no collider). */
  collide?: boolean;
}

export interface Batches {
  solid: GeometryBatch;
  glow: GeometryBatch;
}

function place(s: WallSpec, u0: number, u1: number, v0: number, v1: number, depth: number, offset = 0): { at: XYZ; size: XYZ } {
  const len = u1 - u0;
  const h = v1 - v0;
  const cu = (u0 + u1) / 2;
  const cy = s.y0 + (v0 + v1) / 2;
  return s.axis === 'x'
    ? { at: [cu, cy, s.at + offset], size: [len, h, depth] }
    : { at: [s.at + offset, cy, cu], size: [depth, h, len] };
}

function collider(s: WallSpec, u0: number, u1: number, v0: number, v1: number): WallBox {
  const t = s.thickness / 2;
  return s.axis === 'x'
    ? { minX: u0, maxX: u1, minY: s.y0 + v0, maxY: s.y0 + v1, minZ: s.at - t, maxZ: s.at + t }
    : { minX: s.at - t, maxX: s.at + t, minY: s.y0 + v0, maxY: s.y0 + v1, minZ: u0, maxZ: u1 };
}

/** Wall with rectangular doors/windows and round portholes. Returns its colliders (doors stay open). */
export function wall(pb: PartBuilder, b: Batches, s: WallSpec): WallBox[] {
  const openings = [...(s.openings ?? [])].filter((o) => o.kind !== 'porthole').sort((a, c) => a.from - c.from);
  const colliders: WallBox[] = [];
  const piece = (u0: number, u1: number, v0: number, v1: number, solidCollider: boolean) => {
    if (u1 - u0 < 1e-3 || v1 - v0 < 1e-3) return;
    const p = place(s, u0, u1, v0, v1, s.thickness);
    pb.box(b.solid, p.at, p.size, s.color);
    if (solidCollider && s.collide !== false) colliders.push(collider(s, u0, u1, v0, v1));
  };
  let cursor = s.from;
  for (const o of openings) {
    piece(cursor, o.from, 0, s.height, true);
    piece(o.from, o.to, 0, o.bottom, true);
    piece(o.from, o.to, o.top, s.height, true);
    if (o.kind === 'window') {
      // Glass blocks movement like the wall it replaces.
      if (s.collide !== false) colliders.push(collider(s, o.from, o.to, o.bottom, o.top));
      const g = place(s, o.from, o.to, o.bottom, o.top, s.thickness * 0.35);
      pb.box(b.glow, g.at, g.size, s.glassColor ?? '#bfe3f2');
    }
    if (s.frameColor) frame(pb, b, s, o);
    cursor = o.to;
  }
  piece(cursor, s.to, 0, s.height, true);

  for (const o of s.openings ?? []) {
    if (o.kind !== 'porthole') continue;
    const r = (o.to - o.from) / 2;
    const cu = (o.from + o.to) / 2;
    const cy = s.y0 + (o.bottom + o.top) / 2;
    const rot: XYZ = s.axis === 'x' ? [Math.PI / 2, 0, 0] : [0, 0, Math.PI / 2];
    const at: XYZ = s.axis === 'x' ? [cu, cy, s.at] : [s.at, cy, cu];
    pb.cylinder(b.glow, at, r * 0.78, s.thickness + 0.04, s.glassColor ?? '#bfe3f2', { segments: 16, rot });
    pb.cylinder(b.solid, at, r, s.thickness + 0.02, s.frameColor ?? '#6b4a2b', { segments: 16, rot });
  }
  return colliders;
}

function frame(pb: PartBuilder, b: Batches, s: WallSpec, o: Opening): void {
  const f = 0.12;
  const depth = s.thickness + 0.1;
  const c = s.frameColor!;
  const parts: Array<[number, number, number, number]> = [
    [o.from - f, o.from, o.bottom, o.top + f],
    [o.to, o.to + f, o.bottom, o.top + f],
    [o.from - f, o.to + f, o.top, o.top + f],
  ];
  if (o.kind === 'window') parts.push([o.from - f, o.to + f, o.bottom - f, o.bottom]);
  for (const [u0, u1, v0, v1] of parts) {
    const p = place(s, u0, u1, v0, v1, depth);
    pb.box(b.solid, p.at, p.size, c);
  }
}

export interface SlabSpec {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  /** Top surface height. */
  y: number;
  thickness: number;
  color: ColorSpec;
  tag?: string;
  /** false = visual only (e.g. a ceiling). */
  walkable?: boolean;
}

export function slab(pb: PartBuilder, b: GeometryBatch, s: SlabSpec): FloorRect | null {
  pb.boxMinMax(b, [s.minX, s.y - s.thickness, s.minZ], [s.maxX, s.y, s.maxZ], s.color);
  return s.walkable === false ? null : { minX: s.minX, maxX: s.maxX, minZ: s.minZ, maxZ: s.maxZ, y: s.y, tag: s.tag };
}

export interface StairsSpec {
  /** Direction of travel when climbing. */
  axis: 'x' | 'z';
  /** Along-axis coordinate of the first (bottom) step edge and of the top edge; `uTop` may be < `uBottom`. */
  uBottom: number;
  uTop: number;
  /** Cross-axis range. */
  c0: number;
  c1: number;
  yBottom: number;
  yTop: number;
  steps: number;
  color: ColorSpec;
  stringerColor?: ColorSpec;
  /** Add side walls (stringers + handrail colliders). */
  sides?: boolean;
  tag?: string;
}

/** Straight stair flight: treads for the eye, one ramp floor for the feet (smooth climbing, no snagging). */
export function stairs(pb: PartBuilder, b: GeometryBatch, s: StairsSpec): { floor: FloorRect; walls: WallBox[] } {
  const dir = Math.sign(s.uTop - s.uBottom) || 1;
  const run = Math.abs(s.uTop - s.uBottom) / s.steps;
  const rise = (s.yTop - s.yBottom) / s.steps;
  const cMid = (s.c0 + s.c1) / 2;
  const width = s.c1 - s.c0;
  for (let i = 0; i < s.steps; i++) {
    const u0 = s.uBottom + dir * i * run;
    const u1 = u0 + dir * run;
    const top = s.yBottom + (i + 1) * rise;
    const uMid = (u0 + u1) / 2;
    const at: XYZ = s.axis === 'x' ? [uMid, top - 0.09, cMid] : [cMid, top - 0.09, uMid];
    const size: XYZ = s.axis === 'x' ? [run + 0.02, 0.18, width] : [width, 0.18, run + 0.02];
    pb.box(b, at, size, s.color);
  }
  const walls: WallBox[] = [];
  if (s.sides) {
    const uMin = Math.min(s.uBottom, s.uTop);
    const uMax = Math.max(s.uBottom, s.uTop);
    const len = uMax - uMin;
    const slope = Math.atan2(s.yTop - s.yBottom, len) * dir;
    for (const c of [s.c0, s.c1]) {
      const at: XYZ = s.axis === 'x' ? [(uMin + uMax) / 2, (s.yBottom + s.yTop) / 2 + 0.5, c] : [c, (s.yBottom + s.yTop) / 2 + 0.5, (uMin + uMax) / 2];
      const length = Math.hypot(len, s.yTop - s.yBottom);
      const size: XYZ = s.axis === 'x' ? [length, 0.08, 0.08] : [0.08, 0.08, length];
      const rot: XYZ = s.axis === 'x' ? [0, 0, slope] : [-slope, 0, 0];
      pb.box(b, at, size, s.stringerColor ?? s.color, rot);
      const t = 0.05;
      walls.push(
        s.axis === 'x'
          ? { minX: uMin, maxX: uMax, minY: Math.min(s.yBottom, s.yTop), maxY: Math.max(s.yBottom, s.yTop) + 1.2, minZ: c - t, maxZ: c + t, tag: s.tag }
          : { minX: c - t, maxX: c + t, minY: Math.min(s.yBottom, s.yTop), maxY: Math.max(s.yBottom, s.yTop) + 1.2, minZ: uMin, maxZ: uMax, tag: s.tag },
      );
    }
  }
  const uMin = Math.min(s.uBottom, s.uTop);
  const uMax = Math.max(s.uBottom, s.uTop);
  const climbsTowardsMax = s.uTop > s.uBottom;
  const floor: FloorRect =
    s.axis === 'x'
      ? { minX: uMin, maxX: uMax, minZ: s.c0, maxZ: s.c1, y: climbsTowardsMax ? s.yBottom : s.yTop, ramp: { axis: 'x', y1: climbsTowardsMax ? s.yTop : s.yBottom }, tag: s.tag }
      : { minX: s.c0, maxX: s.c1, minZ: uMin, maxZ: uMax, y: climbsTowardsMax ? s.yBottom : s.yTop, ramp: { axis: 'z', y1: climbsTowardsMax ? s.yTop : s.yBottom }, tag: s.tag };
  return { floor, walls };
}

export interface RailingSpec {
  /** Polyline in plan (x, z). */
  points: ReadonlyArray<readonly [number, number]>;
  closed?: boolean;
  /** Base height (deck level). */
  y: number;
  height?: number;
  postSpacing?: number;
  color: ColorSpec;
  /** Posts go to the `detail` batch (hidden at distance / low quality); rails stay in `main`. */
  detail?: GeometryBatch;
  tag?: string;
}

/** Railing along a polyline. Colliders: short boxes along each segment (tight even on diagonal segments). */
export function railing(pb: PartBuilder, main: GeometryBatch, s: RailingSpec): WallBox[] {
  const h = s.height ?? 1.05;
  const spacing = s.postSpacing ?? 1.4;
  const pts = s.closed ? [...s.points, s.points[0]] : s.points;
  const walls: WallBox[] = [];
  const postBatch = s.detail ?? main;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, z0] = pts[i];
    const [x1, z1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, z1 - z0);
    if (len < 1e-3) continue;
    const yaw = Math.atan2(-(z1 - z0), x1 - x0);
    const mid: [number, number] = [(x0 + x1) / 2, (z0 + z1) / 2];
    pb.box(main, [mid[0], s.y + h, mid[1]], [len + 0.06, 0.09, 0.12], s.color, [0, yaw, 0]);
    pb.box(postBatch, [mid[0], s.y + h * 0.55, mid[1]], [len, 0.05, 0.05], s.color, [0, yaw, 0]);
    const posts = Math.max(1, Math.round(len / spacing));
    for (let k = 0; k < posts; k++) {
      const t = k / posts;
      pb.box(postBatch, [x0 + (x1 - x0) * t, s.y + h / 2, z0 + (z1 - z0) * t], [0.08, h, 0.08], s.color, [0, yaw, 0]);
    }
    const pieces = Math.max(1, Math.ceil(len / 0.6));
    for (let k = 0; k < pieces; k++) {
      const ax = x0 + ((x1 - x0) * k) / pieces;
      const az = z0 + ((z1 - z0) * k) / pieces;
      const bx = x0 + ((x1 - x0) * (k + 1)) / pieces;
      const bz = z0 + ((z1 - z0) * (k + 1)) / pieces;
      walls.push({
        minX: Math.min(ax, bx) - 0.06,
        maxX: Math.max(ax, bx) + 0.06,
        minY: s.y,
        maxY: s.y + h,
        minZ: Math.min(az, bz) - 0.06,
        maxZ: Math.max(az, bz) + 0.06,
        tag: s.tag,
      });
    }
  }
  const [lx, lz] = pts[pts.length - 1];
  if (!s.closed) pb.box(postBatch, [lx, s.y + h / 2, lz], [0.08, h, 0.08], s.color);
  return walls;
}

export interface GableRoofSpec {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  /** Eave height. */
  y: number;
  rise: number;
  overhang: number;
  /** Ridge direction. */
  ridge: 'x' | 'z';
  roofColor: ColorSpec;
  gableColor: ColorSpec;
}

/** Gable roof: wall-coloured gable prism + two overhanging roof slabs. */
export function gableRoof(pb: PartBuilder, b: GeometryBatch, s: GableRoofSpec): void {
  const along = s.ridge === 'x' ? s.maxX - s.minX : s.maxZ - s.minZ;
  const span = s.ridge === 'x' ? s.maxZ - s.minZ : s.maxX - s.minX;
  const cx = (s.minX + s.maxX) / 2;
  const cz = (s.minZ + s.maxZ) / 2;
  const rotY = s.ridge === 'x' ? Math.PI / 2 : 0;
  pb.prism(b, [cx, s.y, cz], [span, s.rise, along], s.gableColor, [0, rotY, 0]);
  const half = span / 2;
  const slopeLen = Math.hypot(half, s.rise) + s.overhang;
  const angle = Math.atan2(s.rise, half);
  for (const side of [-1, 1]) {
    // Slab from the ridge down past the eave: its centre is half a slab length down the slope.
    const off = side * (slopeLen / 2) * Math.cos(angle);
    const y = s.y + s.rise - (slopeLen / 2) * Math.sin(angle) + 0.08;
    if (s.ridge === 'x') {
      pb.box(b, [cx, y, cz + off], [along + s.overhang * 2, 0.16, slopeLen], s.roofColor, [side * angle, 0, 0]);
    } else {
      pb.box(b, [cx + off, y, cz], [slopeLen, 0.16, along + s.overhang * 2], s.roofColor, [0, 0, -side * angle]);
    }
  }
}

/* ------------------------------------------------------------------ outlines (plans) and free-direction walls */

export type Plan = Array<readonly [number, number]>;

/** Ellipse outline in plan (x, z), counter-clockwise seen from above, `n` points. */
export function ellipsePlan(cx: number, cz: number, rx: number, rz: number, n: number): Plan {
  const out: Plan = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    out.push([cx + Math.cos(a) * rx, cz + Math.sin(a) * rz]);
  }
  return out;
}

/** Rectangle with chamfered corners (octagon) in plan, half sizes `hx`, `hz`. */
export function chamferedPlan(cx: number, cz: number, hx: number, hz: number, chamfer: number): Plan {
  const c = Math.min(chamfer, hx, hz);
  return [
    [cx + hx, cz - hz + c], [cx + hx, cz + hz - c], [cx + hx - c, cz + hz], [cx - hx + c, cz + hz],
    [cx - hx, cz + hz - c], [cx - hx, cz - hz + c], [cx - hx + c, cz - hz], [cx + hx - c, cz - hz],
  ];
}

/** z-range of a convex plan at a given x (`null` outside). */
export function planHalfZ(plan: Plan, x: number): [number, number] | null {
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = 0; i < plan.length; i++) {
    const [x0, z0] = plan[i];
    const [x1, z1] = plan[(i + 1) % plan.length];
    if ((x < Math.min(x0, x1)) || (x > Math.max(x0, x1)) || x0 === x1) continue;
    const z = z0 + ((z1 - z0) * (x - x0)) / (x1 - x0);
    lo = Math.min(lo, z);
    hi = Math.max(hi, z);
  }
  return lo <= hi ? [lo, hi] : null;
}

/**
 * Walkable floor of a convex plan as x-slices (AABB floors, cheap collisions). Each slice spans the narrowest
 * z-range of its x-range minus `inset`; `holes` (stairwells) split slices so the player falls into nothing.
 */
export function planFloors(
  plan: Plan,
  y: number,
  o: { slices: number; inset: number; holes?: Array<{ minX: number; maxX: number; minZ: number; maxZ: number }>; tag?: string },
): FloorRect[] {
  const xs = plan.map((p) => p[0]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const out: FloorRect[] = [];
  for (let i = 0; i < o.slices; i++) {
    const a = x0 + ((x1 - x0) * i) / o.slices;
    const b = x0 + ((x1 - x0) * (i + 1)) / o.slices;
    const spans = [planHalfZ(plan, a + 1e-4), planHalfZ(plan, b - 1e-4), planHalfZ(plan, (a + b) / 2)];
    if (spans.some((s) => !s)) continue;
    const lo = Math.max(...spans.map((s) => s![0])) + o.inset;
    const hi = Math.min(...spans.map((s) => s![1])) - o.inset;
    if (hi - lo < 0.3) continue;
    let pieces: Array<[number, number, number, number]> = [[a, b, lo, hi]];
    for (const h of o.holes ?? []) {
      const next: Array<[number, number, number, number]> = [];
      for (const [pa, pb, pl, ph] of pieces) {
        if (h.maxX <= pa || h.minX >= pb || h.maxZ <= pl || h.minZ >= ph) {
          next.push([pa, pb, pl, ph]);
          continue;
        }
        if (h.minX > pa) next.push([pa, h.minX, pl, ph]);
        if (h.maxX < pb) next.push([h.maxX, pb, pl, ph]);
        const ia = Math.max(pa, h.minX);
        const ib = Math.min(pb, h.maxX);
        if (h.minZ > pl) next.push([ia, ib, pl, h.minZ]);
        if (h.maxZ < ph) next.push([ia, ib, h.maxZ, ph]);
      }
      pieces = next;
    }
    for (const [pa, pb, pl, ph] of pieces) out.push({ minX: pa, maxX: pb, minZ: pl, maxZ: ph, y, tag: o.tag });
  }
  return out;
}

/** Short AABB colliders along a segment (tight even when the segment is diagonal). */
export function segmentColliders(a: readonly [number, number], b: readonly [number, number], y0: number, y1: number, half: number, tag?: string): WallBox[] {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(1, Math.ceil(len / 0.6));
  const out: WallBox[] = [];
  for (let k = 0; k < n; k++) {
    const ax = a[0] + ((b[0] - a[0]) * k) / n;
    const az = a[1] + ((b[1] - a[1]) * k) / n;
    const bx = a[0] + ((b[0] - a[0]) * (k + 1)) / n;
    const bz = a[1] + ((b[1] - a[1]) * (k + 1)) / n;
    out.push({ minX: Math.min(ax, bx) - half, maxX: Math.max(ax, bx) + half, minY: y0, maxY: y1, minZ: Math.min(az, bz) - half, maxZ: Math.max(az, bz) + half, tag });
  }
  return out;
}

export interface SegmentOpening {
  /** Distance from the segment start, metres. */
  at: number;
  width: number;
  bottom: number;
  top: number;
  /** `arch` = glazed window with a round head; `door` = walkable hole (optionally arched); `window` = rectangle. */
  kind: 'window' | 'arch' | 'door';
  arched?: boolean;
}

export interface SegmentWallSpec {
  a: readonly [number, number];
  b: readonly [number, number];
  y0: number;
  height: number;
  thickness: number;
  color: ColorSpec;
  frameColor?: ColorSpec;
  glassColor?: ColorSpec;
  openings?: SegmentOpening[];
  collide?: boolean;
  tag?: string;
}

/**
 * Wall along any plan segment (curved buildings = polylines of these). Openings are measured along the segment;
 * windows are glazed (they block), doors leave a hole. Arched heads use a half disc of glass + a frame ring.
 */
export function segmentWall(pb: PartBuilder, bt: Batches, s: SegmentWallSpec): WallBox[] {
  const [ax, az] = s.a;
  const [bx, bz] = s.b;
  const len = Math.hypot(bx - ax, bz - az);
  if (len < 1e-3) return [];
  const dx = (bx - ax) / len;
  const dz = (bz - az) / len;
  const yaw = Math.atan2(-dz, dx);
  const at = (u: number): [number, number] => [ax + dx * u, az + dz * u];
  const colliders: WallBox[] = [];
  const box = (u0: number, u1: number, v0: number, v1: number, depth: number, color: ColorSpec, batch = bt.solid) => {
    if (u1 - u0 < 1e-3 || v1 - v0 < 1e-3) return;
    const [cx, cz] = at((u0 + u1) / 2);
    pb.box(batch, [cx, s.y0 + (v0 + v1) / 2, cz], [u1 - u0, v1 - v0, depth], color, [0, yaw, 0]);
  };
  const solid = (u0: number, u1: number, v0: number, v1: number) => {
    box(u0, u1, v0, v1, s.thickness, s.color);
    if (s.collide !== false && u1 - u0 > 1e-3) colliders.push(...segmentColliders(at(u0), at(u1), s.y0 + v0, s.y0 + v1, s.thickness / 2, s.tag));
  };
  const ops = [...(s.openings ?? [])].sort((p, q) => p.at - q.at);
  let cursor = 0;
  for (const o of ops) {
    const u0 = Math.max(0, o.at - o.width / 2);
    const u1 = Math.min(len, o.at + o.width / 2);
    const r = (u1 - u0) / 2;
    const arched = o.kind === 'arch' || !!o.arched;
    const rectTop = arched ? o.top - r : o.top;
    solid(cursor, u0, 0, s.height);
    solid(u0, u1, 0, o.bottom);
    solid(u0, u1, o.top, s.height);
    if (arched) {
      // The arch zone is closed masonry; the round glass head (or the door's arch frame) sits proud of both faces,
      // so no hole is left between the arch and the wall.
      solid(u0, u1, rectTop, o.top);
      const [cx, cz] = at((u0 + u1) / 2);
      const head: XYZ = [cx, s.y0 + rectTop, cz];
      // Windows: round glass head. Doors: a glazed fanlight above a clear rectangular doorway.
      // Upper half disc only (after the X turn, world up is local −Z: θ ∈ [π/2, 3π/2]).
      pb.cylinder(bt.glow, head, r * 0.9, s.thickness + 0.05, s.glassColor ?? '#8fc8ee', { segments: 14, rot: [Math.PI / 2, yaw, 0], arc: { start: Math.PI / 2, length: Math.PI } });
      if (o.kind === 'door') box(u0, u1, rectTop - 0.06, rectTop + 0.06, s.thickness + 0.1, s.frameColor ?? s.color);
      // Arched frame: upper half ring (TorusGeometry arc starts at +X and turns through +Y).
      if (s.frameColor) pb.torus(bt.solid, head, r * 0.98, 0.07, s.frameColor, { segments: 16, rot: [0, yaw, 0], arc: Math.PI });
    }
    if (o.kind !== 'door') {
      box(u0, u1, o.bottom, rectTop, s.thickness * 0.4, s.glassColor ?? '#8fc8ee', bt.glow);
      if (s.collide !== false) colliders.push(...segmentColliders(at(u0), at(u1), s.y0 + o.bottom, s.y0 + o.top, s.thickness / 2, s.tag));
      if (s.frameColor) {
        // Mullion + transom: the cross that makes a glazed window read at any distance.
        box((u0 + u1) / 2 - 0.035, (u0 + u1) / 2 + 0.035, o.bottom, rectTop, s.thickness + 0.06, s.frameColor);
        box(u0, u1, (o.bottom + rectTop) / 2 - 0.035, (o.bottom + rectTop) / 2 + 0.035, s.thickness + 0.06, s.frameColor);
      }
    }
    if (s.frameColor) {
      const f = 0.1;
      box(u0 - f, u0, o.bottom, rectTop, s.thickness + 0.08, s.frameColor);
      box(u1, u1 + f, o.bottom, rectTop, s.thickness + 0.08, s.frameColor);
      if (!arched) box(u0 - f, u1 + f, o.top, o.top + f, s.thickness + 0.08, s.frameColor);
      if (o.kind !== 'door') box(u0 - f, u1 + f, o.bottom - f, o.bottom, s.thickness + 0.12, s.frameColor);
    }
    cursor = u1;
  }
  solid(cursor, len, 0, s.height);
  return colliders;
}

export interface LatticeSpec {
  points: Plan;
  closed?: boolean;
  y: number;
  height: number;
  /** Panel width of one "X". */
  panel: number;
  boardColor: ColorSpec;
  crossColor: ColorSpec;
  railColor: ColorSpec;
  /** Draw the X crosses (skip on low quality: a plain band reads the same from afar). */
  crosses: boolean;
  /** Blocks movement (balustrade) or decorative band on a wall. */
  collide: boolean;
  thickness?: number;
  /** Segment indices (i → i+1) left open (stair arrivals, gates). */
  gaps?: number[];
  tag?: string;
}

/** Lattice balustrade / decorative band: dark board, white X per panel, top and bottom rails. */
export function latticeBand(pb: PartBuilder, b: GeometryBatch, s: LatticeSpec): WallBox[] {
  const pts = s.closed ? [...s.points, s.points[0]] : s.points;
  const t = s.thickness ?? 0.12;
  const walls: WallBox[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    if (s.gaps?.includes(i)) continue;
    const [x0, z0] = pts[i];
    const [x1, z1] = pts[i + 1];
    const len = Math.hypot(x1 - x0, z1 - z0);
    if (len < 1e-3) continue;
    const yaw = Math.atan2(-(z1 - z0), x1 - x0);
    const mx = (x0 + x1) / 2;
    const mz = (z0 + z1) / 2;
    const h = s.height;
    pb.box(b, [mx, s.y + h / 2, mz], [len + 0.02, h * 0.86, t], s.boardColor, [0, yaw, 0]);
    pb.box(b, [mx, s.y + h - 0.05, mz], [len + 0.06, 0.1, t + 0.08], s.railColor, [0, yaw, 0]);
    pb.box(b, [mx, s.y + 0.05, mz], [len + 0.06, 0.1, t + 0.06], s.railColor, [0, yaw, 0]);
    if (s.crosses) {
      const n = Math.max(1, Math.round(len / s.panel));
      const w = len / n;
      const diag = Math.hypot(w, h * 0.78);
      const ang = Math.atan2(h * 0.78, w);
      const ux = (x1 - x0) / len;
      const uz = (z1 - z0) / len;
      for (let k = 0; k < n; k++) {
        const u = (k + 0.5) * w;
        const cx = x0 + ux * u;
        const cz = z0 + uz * u;
        for (const sign of [1, -1]) {
          pb.box(b, [cx, s.y + h / 2, cz], [diag, 0.07, t + 0.04], s.crossColor, [0, yaw, sign * ang]);
        }
      }
    }
    if (s.collide) walls.push(...segmentColliders([x0, z0], [x1, z1], s.y, s.y + h, t / 2 + 0.04, s.tag));
  }
  return walls;
}

/** Hip roof (four slopes) over a rectangle, with an optional flat top ("lantern" deck). */
export function hipRoof(
  pb: PartBuilder,
  b: GeometryBatch,
  s: { cx: number; cz: number; hx: number; hz: number; y: number; rise: number; topRatio: number; overhang: number; color: ColorSpec; topColor?: ColorSpec },
): void {
  const hx = s.hx + s.overhang;
  const hz = s.hz + s.overhang;
  pb.squareFrustum(b, [s.cx, s.y + s.rise / 2, s.cz], [hx, s.rise, hz], s.color, s.topRatio);
  if (s.topColor) pb.box(b, [s.cx, s.y + s.rise + 0.06, s.cz], [hx * 2 * s.topRatio, 0.12, hz * 2 * s.topRatio], s.topColor);
}

/**
 * Opens a closed plan between two points lying on its edge `edge` (plan[edge] → plan[edge + 1]) and returns the
 * remaining open polyline (gap end → … → gap start): balustrades with a stair arrival in the middle of a face.
 */
export function openLoop(plan: Plan, edge: number, gapStart: readonly [number, number], gapEnd: readonly [number, number]): Plan {
  const n = plan.length;
  const out: Plan = [gapEnd];
  for (let k = 1; k <= n; k++) out.push(plan[(edge + k) % n]);
  out.push(gapStart);
  return out;
}
