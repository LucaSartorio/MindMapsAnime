import type { WorldPoint } from '../config/types';
import { clamp, easeInOut, lerp } from './easing';

/**
 * A simple 2D camera over the world plane.
 * `x/y` = world point shown at the screen focal point (`fx`, `fy`), `zoom` = screen px per world unit.
 * Cameras are interpolated between keyframes (position linear, zoom geometric =
 * perceptually even), with an optional "lift" (zoom-out mid-flight) for travels.
 */
export type Camera = { x: number; y: number; zoom: number; fy: number };

export type CameraKey = {
  frame: number;
  cam: Camera;
  /** Easing used to reach this key from the previous one. */
  easing?: (t: number) => number;
  /** 0..1: how much to zoom out halfway through the move (0 = none). */
  lift?: number;
};

export function cameraAt(keys: CameraKey[], frame: number): Camera {
  if (!keys.length) return { x: 0, y: 0, zoom: 1, fy: 0 };
  if (frame <= keys[0].frame) return keys[0].cam;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (frame <= b.frame) {
      const span = b.frame - a.frame;
      const raw = span > 0 ? (frame - a.frame) / span : 1;
      const t = (b.easing ?? easeInOut)(clamp(raw, 0, 1));
      const zoom = Math.exp(lerp(Math.log(a.cam.zoom), Math.log(b.cam.zoom), t)) * (1 - (b.lift ?? 0) * Math.sin(Math.PI * t));
      return { x: lerp(a.cam.x, b.cam.x, t), y: lerp(a.cam.y, b.cam.y, t), zoom, fy: lerp(a.cam.fy, b.cam.fy, t) };
    }
  }
  return keys[keys.length - 1].cam;
}

/** World → screen for a camera, with the horizontal focal point at `screenWidth / 2`. */
export function toScreen(cam: Camera, p: WorldPoint, screenWidth: number): WorldPoint {
  return { x: (p.x - cam.x) * cam.zoom + screenWidth / 2, y: (p.y - cam.y) * cam.zoom + cam.fy };
}

/** Camera framing `bounds` inside a `boxW × boxH` screen box centred on (screenWidth/2, fy). */
export function fitCamera(
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  box: { w: number; h: number; fy: number },
  zoomRange: [number, number],
): Camera {
  const w = Math.max(bounds.maxX - bounds.minX, 1);
  const h = Math.max(bounds.maxY - bounds.minY, 1);
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
    zoom: clamp(Math.min(box.w / w, box.h / h), zoomRange[0], zoomRange[1]),
    fy: box.fy,
  };
}

/**
 * Keeps the map covering the screen band `[top, bottom]` (between HUD and
 * cards) when the zoom allows it, so the camera never shows empty space past
 * the map's edge. When the map is smaller than the band, it's centred instead.
 */
export function clampToMap(cam: Camera, map: { width: number; height: number }, screen: { width: number; top: number; bottom: number }): Camera {
  const halfW = screen.width / 2 / cam.zoom;
  const x = map.width >= halfW * 2 ? clamp(cam.x, halfW, map.width - halfW) : map.width / 2;
  const above = (cam.fy - screen.top) / cam.zoom;
  const below = (screen.bottom - cam.fy) / cam.zoom;
  const y = map.height >= above + below ? clamp(cam.y, above, map.height - below) : (map.height - below + above) / 2;
  return { ...cam, x, y };
}

export type ScreenBox = { left: number; right: number; top: number; bottom: number };

/** True when every point projects inside `box`. */
export function allInView(cam: Camera, points: WorldPoint[], box: ScreenBox, screenWidth: number): boolean {
  return points.every((p) => {
    const s = toScreen(cam, p, screenWidth);
    return s.x >= box.left && s.x <= box.right && s.y >= box.top && s.y <= box.bottom;
  });
}

/**
 * Minimal pan so the points' bounding box lands inside `box` (centred when it
 * can't fit). Used after `clampToMap`: seeing the subject beats hiding the
 * map's edge (which the screen gradients mostly cover anyway).
 */
export function keepInView(cam: Camera, points: WorldPoint[], box: ScreenBox, screenWidth: number): Camera {
  const screen = points.map((p) => toScreen(cam, p, screenWidth));
  const shift = (min: number, max: number, lo: number, hi: number) =>
    max - min > hi - lo ? (lo + hi) / 2 - (min + max) / 2 : min < lo ? lo - min : max > hi ? hi - max : 0;
  const dx = shift(Math.min(...screen.map((p) => p.x)), Math.max(...screen.map((p) => p.x)), box.left, box.right);
  const dy = shift(Math.min(...screen.map((p) => p.y)), Math.max(...screen.map((p) => p.y)), box.top, box.bottom);
  return { ...cam, x: cam.x - dx / cam.zoom, y: cam.y - dy / cam.zoom };
}
