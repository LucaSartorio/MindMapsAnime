import type { WorldPoint } from '../config/types';
import { lerp } from './easing';

/**
 * Route geometry in WORLD coordinates (the map viewBox), precomputed once:
 * each leg is a gentle quadratic arc (a straight line reads as "teleport",
 * an arc reads as "travel"), sampled into a polyline with cumulative lengths
 * so it can be revealed by exact arc-length fraction on any frame.
 */
export type Polyline = { points: WorldPoint[]; lengths: number[]; total: number };

const SAMPLES = 48;
/** Arc bend as a fraction of the leg length (constant sign → A→B and B→A arcs don't overlap). */
const BEND = 0.18;

export function buildLeg(from: WorldPoint, to: WorldPoint): Polyline {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy) || 1;
  const ctrl = { x: (from.x + to.x) / 2 - (dy / dist) * dist * BEND, y: (from.y + to.y) / 2 + (dx / dist) * dist * BEND };
  const points: WorldPoint[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const a = { x: lerp(from.x, ctrl.x, t), y: lerp(from.y, ctrl.y, t) };
    const b = { x: lerp(ctrl.x, to.x, t), y: lerp(ctrl.y, to.y, t) };
    points.push({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
  }
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  return { points, lengths, total: lengths[lengths.length - 1] };
}

/** Points of `line` up to the arc-length fraction `t` (0..1), with an exact interpolated tip. */
export function partialPolyline(line: Polyline, t: number): WorldPoint[] {
  if (t <= 0) return [];
  if (t >= 1) return line.points;
  const target = line.total * t;
  const out: WorldPoint[] = [line.points[0]];
  for (let i = 1; i < line.points.length; i++) {
    if (line.lengths[i] >= target) {
      const seg = line.lengths[i] - line.lengths[i - 1] || 1;
      const k = (target - line.lengths[i - 1]) / seg;
      out.push({ x: lerp(line.points[i - 1].x, line.points[i].x, k), y: lerp(line.points[i - 1].y, line.points[i].y, k) });
      return out;
    }
    out.push(line.points[i]);
  }
  return out;
}

export function toSvgPath(points: { x: number; y: number }[]): string {
  return points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
}

export function boundsOf(points: WorldPoint[]) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}
