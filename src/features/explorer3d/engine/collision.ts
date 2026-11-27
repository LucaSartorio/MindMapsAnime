/**
 * Simple, predictable collisions for a walking camera (no physics engine): pure math, no three.js, unit-tested in
 * Node (`npm run test:3d:unit`).
 *
 *  - Floors are axis-aligned rectangles at a height, or ramps (stairs) whose height varies linearly along X or Z.
 *    The player stands on the highest floor under its feet that is reachable with one step.
 *  - Walls are axis-aligned boxes; they block the player's circle (radius `radius`) when they overlap its body
 *    between knee height and head height. Thin boxes along each segment approximate railings and curved hulls.
 *  - Walking off every floor is impossible (the move is rejected axis by axis, so the player slides along edges).
 */
export interface FloorRect {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  /** Height at the min edge of `ramp` (or everywhere when flat). */
  y: number;
  /** Ramp: height goes from `y` at the min of the axis to `y1` at its max. */
  ramp?: { axis: 'x' | 'z'; y1: number };
  /** Zone loading: floors of an interior zone exist only once that zone is built. */
  tag?: string;
}

export interface WallBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  tag?: string;
}

export interface Feet {
  x: number;
  y: number;
  z: number;
}

export interface CollisionOptions {
  radius: number;
  height: number;
  /** Max height climbed without jumping (one stair step). */
  stepUp: number;
  /** Max drop followed without falling (walking down stairs). */
  snapDown: number;
  gravity: number;
}

const DEFAULTS: CollisionOptions = { radius: 0.3, height: 1.7, stepUp: 0.45, snapDown: 0.55, gravity: 18 };

export function floorHeightAt(f: FloorRect, x: number, z: number): number {
  if (!f.ramp) return f.y;
  const t =
    f.ramp.axis === 'x' ? (x - f.minX) / Math.max(1e-6, f.maxX - f.minX) : (z - f.minZ) / Math.max(1e-6, f.maxZ - f.minZ);
  return f.y + (f.ramp.y1 - f.y) * Math.min(1, Math.max(0, t));
}

export class CollisionWorld {
  readonly floors: FloorRect[] = [];
  readonly walls: WallBox[] = [];
  readonly opts: CollisionOptions;
  /** Vertical speed of the current fall (m/s, negative = down). */
  private vy = 0;

  constructor(opts: Partial<CollisionOptions> = {}) {
    this.opts = { ...DEFAULTS, ...opts };
  }

  add(part: { floors?: FloorRect[]; walls?: WallBox[] }): void {
    if (part.floors) this.floors.push(...part.floors);
    if (part.walls) this.walls.push(...part.walls);
  }

  /** Highest floor under (x, z) whose top is at most `feetY + stepUp`; `null` = no ground (void or ocean). */
  groundAt(x: number, z: number, feetY: number): number | null {
    let best: number | null = null;
    for (const f of this.floors) {
      if (x < f.minX || x > f.maxX || z < f.minZ || z > f.maxZ) continue;
      const h = floorHeightAt(f, x, z);
      if (h <= feetY + this.opts.stepUp && (best === null || h > best)) best = h;
    }
    return best;
  }

  /** True when the player's circle at (x, z) with feet at `feetY` overlaps a wall. */
  blocked(x: number, z: number, feetY: number): boolean {
    for (const w of this.walls) if (this.overlap(w, x, z, feetY) !== null) return true;
    return false;
  }

  /** Penetration vector [px, pz] pushing the circle out of `w`, or `null` when they do not touch. */
  private overlap(w: WallBox, x: number, z: number, feetY: number): [number, number] | null {
    const bodyBottom = feetY + this.opts.stepUp * 0.9;
    const bodyTop = feetY + this.opts.height;
    if (w.maxY <= bodyBottom || w.minY >= bodyTop) return null;
    const r = this.opts.radius;
    const cx = Math.min(Math.max(x, w.minX), w.maxX);
    const cz = Math.min(Math.max(z, w.minZ), w.maxZ);
    const dx = x - cx;
    const dz = z - cz;
    const d2 = dx * dx + dz * dz;
    if (d2 >= r * r) return null;
    if (d2 > 1e-12) {
      const d = Math.sqrt(d2);
      return [(dx / d) * (r - d), (dz / d) * (r - d)];
    }
    // Centre inside the box: leave through the nearest face.
    const exits: Array<[number, number, number]> = [
      [x - w.minX + r, -1, 0],
      [w.maxX - x + r, 1, 0],
      [z - w.minZ + r, 0, -1],
      [w.maxZ - z + r, 0, 1],
    ];
    exits.sort((a, b) => a[0] - b[0]);
    const [depth, sx, sz] = exits[0];
    return [sx * depth, sz * depth];
  }

  /** Pushes (x, z) out of every wall (a few relaxation passes handle corners). */
  private resolve(x: number, z: number, feetY: number): [number, number] {
    for (let pass = 0; pass < 4; pass++) {
      let moved = false;
      for (const w of this.walls) {
        const p = this.overlap(w, x, z, feetY);
        if (!p) continue;
        x += p[0];
        z += p[1];
        moved = true;
      }
      if (!moved) break;
    }
    return [x, z];
  }

  /**
   * Moves the feet by (dx, dz) for a frame of `dt` seconds, mutating `feet`. Returns false when the move was fully
   * rejected (the player is against an edge of the walkable area).
   */
  move(feet: Feet, dx: number, dz: number, dt: number): boolean {
    const tryAt = (nx: number, nz: number): { x: number; z: number; ground: number } | null => {
      const [rx, rz] = this.resolve(nx, nz, feet.y);
      const ground = this.groundAt(rx, rz, feet.y);
      if (ground === null) return null;
      // A wall can also be "below" the step threshold at the old height but block at the new height (stair top).
      if (this.blocked(rx, rz, Math.max(feet.y, ground))) return null;
      return { x: rx, z: rz, ground };
    };

    let next = tryAt(feet.x + dx, feet.z + dz);
    if (!next && dx !== 0) next = tryAt(feet.x + dx, feet.z);
    if (!next && dz !== 0) next = tryAt(feet.x, feet.z + dz);
    const accepted = next !== null;
    if (next) {
      feet.x = next.x;
      feet.z = next.z;
    }

    const ground = next?.ground ?? this.groundAt(feet.x, feet.z, feet.y);
    if (ground === null) return accepted;
    if (ground >= feet.y - this.opts.snapDown && this.vy === 0) {
      feet.y = ground; // flat, step up, or walking down a ramp
    } else {
      this.vy -= this.opts.gravity * dt;
      feet.y = Math.max(ground, feet.y + this.vy * dt);
      if (feet.y === ground) this.vy = 0;
    }
    return accepted;
  }

  /** True while the player is falling (the frame loop keeps running until it lands). */
  get falling(): boolean {
    return this.vy !== 0;
  }

  resetMotion(): void {
    this.vy = 0;
  }
}
