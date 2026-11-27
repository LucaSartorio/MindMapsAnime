import { BufferAttribute, BufferGeometry, ExtrudeGeometry, Shape, Vector2 } from 'three';
import type { ResourceTracker } from '../engine/resources';

/**
 * Ship & organic shapes. A loft (rings of points → smooth indexed surface) is the single generator behind hulls,
 * fish heads and tails: a new ship = new profile functions, not new geometry code.
 */
export type P3 = [number, number, number];

export interface LoftOptions {
  /** Rings are closed loops (fish head) or open U-sections (hull). */
  closed: boolean;
  capStart?: boolean;
  capEnd?: boolean;
  /** Flip the winding when the generated normals point inwards. */
  flip?: boolean;
}

/** Smooth surface through `rings` (every ring has the same number of points). Normals: computed, smooth. */
export function loftGeometry(tracker: ResourceTracker, rings: P3[][], o: LoftOptions): BufferGeometry {
  const n = rings[0].length;
  const pos: number[] = [];
  for (const r of rings) for (const p of r) pos.push(p[0], p[1], p[2]);
  const idx: number[] = [];
  const quad = (a: number, b: number, c: number, d: number) => {
    if (o.flip) idx.push(a, c, b, a, d, c);
    else idx.push(a, b, c, a, c, d);
  };
  const segs = o.closed ? n : n - 1;
  for (let i = 0; i < rings.length - 1; i++) {
    for (let j = 0; j < segs; j++) {
      const j1 = (j + 1) % n;
      quad(i * n + j, i * n + j1, (i + 1) * n + j1, (i + 1) * n + j);
    }
  }
  const centroid = (r: P3[]): P3 => r.reduce((a, p) => [a[0] + p[0] / n, a[1] + p[1] / n, a[2] + p[2] / n] as P3, [0, 0, 0] as P3);
  /** Fan cap whose normal points away from the neighbouring ring (outwards), whatever the ring direction. */
  const cap = (ring: number, neighbour: number) => {
    const r = rings[ring];
    const c = centroid(r);
    const away = centroid(rings[neighbour]).map((v, k) => c[k] - v);
    const ci = pos.length / 3;
    pos.push(...c);
    const a0 = r[0];
    const b0 = r[1 % n];
    const u = [a0[0] - c[0], a0[1] - c[1], a0[2] - c[2]];
    const v = [b0[0] - c[0], b0[1] - c[1], b0[2] - c[2]];
    const nrm = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const outward = nrm[0] * away[0] + nrm[1] * away[1] + nrm[2] * away[2] >= 0;
    for (let j = 0; j < segs; j++) {
      const a = ring * n + j;
      const b = ring * n + ((j + 1) % n);
      if (outward) idx.push(ci, a, b);
      else idx.push(ci, b, a);
    }
  };
  if (o.capStart) cap(0, 1);
  if (o.capEnd) cap(rings.length - 1, rings.length - 2);
  const g = tracker.track(new BufferGeometry());
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export interface HullProfile {
  xStern: number;
  xBow: number;
  /** Half width at normalized length t ∈ [0, 1] (0 = stern). */
  halfWidth: (t: number) => number;
  deckY: (t: number) => number;
  keelY: (t: number) => number;
  /** Fullness of the section (1 = round, < 1 = boxier). */
  fullness: number;
  stations: number;
  sectionPoints: number;
}

/** Open U-shaped hull shell (deck surface is a separate polygon, see `deckOutline`). */
export function hullRings(p: HullProfile): P3[][] {
  const rings: P3[][] = [];
  for (let i = 0; i <= p.stations; i++) {
    const t = i / p.stations;
    const x = p.xStern + (p.xBow - p.xStern) * t;
    const w = Math.max(0.05, p.halfWidth(t));
    const top = p.deckY(t);
    const keel = p.keelY(t);
    const ring: P3[] = [];
    for (let j = 0; j <= p.sectionPoints; j++) {
      const a = (j / p.sectionPoints) * Math.PI; // 0 = port deck edge, π = starboard deck edge
      const s = Math.sin(a);
      const z = -w * Math.cos(a);
      ring.push([x, top - (top - keel) * Math.pow(s, p.fullness), z]);
    }
    rings.push(ring);
  }
  return rings;
}

/** Deck outline in plan, from the same profile (stern → bow along port, then bow → stern along starboard). */
export function deckOutline(p: HullProfile, inset = 0, samples = 32): Array<[number, number]> {
  const port: Array<[number, number]> = [];
  const star: Array<[number, number]> = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = p.xStern + (p.xBow - p.xStern) * t;
    const w = Math.max(0, p.halfWidth(t) - inset);
    port.push([x, -w]);
    star.push([x, w]);
  }
  return [...port, ...star.reverse()];
}

/** Flat polygon (convex-ish outline, fan-triangulated from its centroid) facing +Y at height `y`. */
export function flatPolygon(tracker: ResourceTracker, outline: Array<[number, number]>, y: number): BufferGeometry {
  const cx = outline.reduce((a, p) => a + p[0], 0) / outline.length;
  const cz = outline.reduce((a, p) => a + p[1], 0) / outline.length;
  const pos: number[] = [];
  for (let i = 0; i < outline.length; i++) {
    const [ax, az] = outline[i];
    const [bx, bz] = outline[(i + 1) % outline.length];
    pos.push(cx, y, cz, bx, y, bz, ax, y, az);
  }
  // Ensure every triangle faces up whatever the outline winding.
  for (let i = 0; i < pos.length; i += 9) {
    const ux = pos[i + 3] - pos[i];
    const uz = pos[i + 5] - pos[i + 2];
    const vx = pos[i + 6] - pos[i];
    const vz = pos[i + 8] - pos[i + 2];
    if (uz * vx - ux * vz < 0) {
      for (let k = 0; k < 3; k++) {
        const t = pos[i + 3 + k];
        pos[i + 3 + k] = pos[i + 6 + k];
        pos[i + 6 + k] = t;
      }
    }
  }
  const g = tracker.track(new BufferGeometry());
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  g.computeVertexNormals();
  return g;
}

/** Ellipse-section loft along X (fish heads, buoys, bottles): radii and centre height as functions of t. */
export function ellipsoidRings(
  x0: number,
  x1: number,
  stations: number,
  points: number,
  ry: (t: number) => number,
  rz: (t: number) => number,
  cy: (t: number) => number,
): P3[][] {
  const rings: P3[][] = [];
  for (let i = 0; i <= stations; i++) {
    const t = i / stations;
    const x = x0 + (x1 - x0) * t;
    const ring: P3[] = [];
    for (let j = 0; j < points; j++) {
      const a = (j / points) * Math.PI * 2;
      ring.push([x, cy(t) + Math.sin(a) * Math.max(0.02, ry(t)), Math.cos(a) * Math.max(0.02, rz(t))]);
    }
    rings.push(ring);
  }
  return rings;
}

/** Flat fin/tail/sign silhouette extruded to `depth` with a soft bevel (2D points in local XY). */
export function extrudedSilhouette(tracker: ResourceTracker, points: Array<[number, number]>, depth: number, bevel = 0.08, curveSegments = 6): BufferGeometry {
  const shape = new Shape(points.map(([x, y]) => new Vector2(x, y)));
  const g = tracker.track(
    new ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: bevel > 0,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 1,
      curveSegments,
    }),
  );
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

/**
 * Walkable deck approximated by axis-aligned slices inside the hull outline (cheap AABB floors): each slice spans
 * the narrowest width of its x-range minus `inset`, so the player never stands over the water.
 */
export function deckFloorSlices(
  p: HullProfile,
  y: number,
  o: { inset: number; slices: number; xMin?: number; xMax?: number; tag?: string },
): Array<{ minX: number; maxX: number; minZ: number; maxZ: number; y: number; tag?: string }> {
  const x0 = Math.max(p.xStern, o.xMin ?? p.xStern);
  const x1 = Math.min(p.xBow, o.xMax ?? p.xBow);
  const out: Array<{ minX: number; maxX: number; minZ: number; maxZ: number; y: number; tag?: string }> = [];
  for (let i = 0; i < o.slices; i++) {
    const a = x0 + ((x1 - x0) * i) / o.slices;
    const b = x0 + ((x1 - x0) * (i + 1)) / o.slices;
    const ta = (a - p.xStern) / (p.xBow - p.xStern);
    const tb = (b - p.xStern) / (p.xBow - p.xStern);
    const w = Math.min(p.halfWidth(ta), p.halfWidth(tb), p.halfWidth((ta + tb) / 2)) - o.inset;
    if (w <= 0.2) continue;
    out.push({ minX: a, maxX: b, minZ: -w, maxZ: w, y, tag: o.tag });
  }
  return out;
}
