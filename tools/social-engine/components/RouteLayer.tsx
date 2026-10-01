import { useVideoConfig } from 'remotion';
import type { WorldPoint } from '../config/types';
import { toScreen, type Camera } from '../lib/camera';
import { partialPolyline, toSvgPath, type Polyline } from '../lib/geometry';
import { COLORS } from '../lib/theme';

/**
 * Progressive route reveal, drawn in SCREEN space (constant stroke width at
 * any zoom): each leg is cut at its exact arc-length progress, with a glowing
 * "traveller" head while it's being drawn.
 */
export function RouteLayer({ legs, legProgress, camera, opacity = 1 }: {
  legs: Polyline[];
  /** 0..1 per leg. */
  legProgress: number[];
  camera: Camera;
  opacity?: number;
}) {
  const { width, height } = useVideoConfig();
  const drawn = legs.map((leg, i) => partialPolyline(leg, legProgress[i] ?? 0).map((p) => toScreen(camera, p, width)));
  const heads: WorldPoint[] = drawn
    .map((pts, i) => ((legProgress[i] ?? 0) > 0 && (legProgress[i] ?? 0) < 1 ? pts[pts.length - 1] : undefined))
    .filter((p): p is WorldPoint => Boolean(p));

  return (
    <svg width={width} height={height} style={{ position: 'absolute', inset: 0, opacity }}>
      {drawn.map((pts, i) =>
        pts.length > 1 ? (
          <g key={i}>
            {/* Glow = stacked translucent strokes (an SVG blur filter is far too slow to rasterize). */}
            <path d={toSvgPath(pts)} fill="none" stroke={COLORS.red500} strokeOpacity={0.14} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
            <path d={toSvgPath(pts)} fill="none" stroke={COLORS.red500} strokeOpacity={0.28} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
            <path d={toSvgPath(pts)} fill="none" stroke={COLORS.red500} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
            <path d={toSvgPath(pts)} fill="none" stroke={COLORS.white} strokeOpacity={0.85} strokeWidth={2.5} strokeDasharray="3 15" strokeLinecap="round" />
          </g>
        ) : null,
      )}
      {heads.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={30} fill={COLORS.red500} opacity={0.18} />
          <circle cx={p.x} cy={p.y} r={19} fill={COLORS.red500} opacity={0.4} />
          <circle cx={p.x} cy={p.y} r={10} fill={COLORS.white} />
        </g>
      ))}
    </svg>
  );
}
