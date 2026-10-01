import type { WorldPoint } from '../../config/types';
import { allInView, clampToMap, fitCamera, keepInView, type Camera, type CameraKey, type ScreenBox } from '../../lib/camera';
import { clamp, easeInOut, lerp } from '../../lib/easing';
import { boundsOf } from '../../lib/geometry';
import type { JourneyPlan } from './timeline';

/** Screen layout the camera frames around (HUD on top, cards at the bottom). */
const JOURNEY_FY = 830;
const RECAP_BOX = { w: 800, h: 520, fy: 720 };
const STOP_BOX = { w: 740, h: 620 };
const ZOOM_RANGE: [number, number] = [1.25, 2.1];
/** Screen band the map must fill (below the header, above the bottom cards). */
const BAND = { top: 330, bottom: 1640 };
/** Where the active stop must stay visible (clear of the header, label room above, the stop card below). */
const STOP_SAFE: ScreenBox = { left: 150, right: 930, top: 470, bottom: 1240 };
/** Where every pin must sit during the recap (above the key-locations panel). */
const RECAP_SAFE: ScreenBox = { left: 130, right: 950, top: 450, bottom: 1010 };
const linear = (t: number) => t;

/**
 * Camera keyframes generated from the stop coordinates — nothing hand-placed:
 * establishing shot of the whole map → fly to each stop (zoomed so the
 * previous stop stays in frame, with a light zoom-out "lift" mid-flight and a
 * slow push-in while dwelling) → pull back to frame the whole journey.
 */
export function buildJourneyCamera(points: WorldPoint[], map: { width: number; height: number }, plan: JourneyPlan, screenWidth: number): CameraKey[] {
  const b = boundsOf(points);
  const center = { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2 };
  const overviewZoom = (screenWidth / map.width) * 1.1;
  // Very long legs (parts can cross a whole map) may zoom out further than the
  // usual 1.25 — never below ~the establishing shot — so the leg stays in frame.
  const minStopZoom = Math.min(ZOOM_RANGE[0], Math.max(overviewZoom * 1.15, 0.6));
  const overview: Camera = { x: map.width / 2, y: map.height / 2, zoom: overviewZoom, fy: 900 };
  const establishing: Camera = {
    x: lerp(overview.x, center.x, 0.35),
    y: lerp(overview.y, center.y, 0.35),
    zoom: overviewZoom * 1.1,
    fy: 900,
  };

  const stopCam = (i: number): Camera => {
    const here = points[i];
    const neighbour = i > 0 ? points[i - 1] : points[1] ?? here;
    const dx = Math.abs(here.x - neighbour.x) || 1;
    const dy = Math.abs(here.y - neighbour.y) || 1;
    const zoom = clamp(Math.min(STOP_BOX.w / dx, STOP_BOX.h / dy), minStopZoom, ZOOM_RANGE[1]);
    // Lean towards where we came from so the drawn leg stays visible.
    const focus = i > 0 ? { x: lerp(here.x, neighbour.x, 0.3), y: lerp(here.y, neighbour.y, 0.3) } : here;
    const clamped = clampToMap({ x: focus.x, y: focus.y, zoom, fy: JOURNEY_FY }, map, { width: screenWidth, ...BAND });
    return keepInView(clamped, [here], STOP_SAFE, screenWidth);
  };

  const keys: CameraKey[] = [
    { frame: 0, cam: overview },
    { frame: plan.intro.end, cam: establishing, easing: easeInOut },
  ];
  plan.stops.forEach((timing, i) => {
    const cam = stopCam(i);
    keys.push({ frame: timing.arrive, cam, easing: easeInOut, lift: i > 0 ? 0.16 : 0 });
    keys.push({ frame: timing.leave, cam: { ...cam, zoom: cam.zoom * 1.05 }, easing: linear });
  });
  const recap = recapCamera(points, b, map, screenWidth, overviewZoom);
  const settle = Math.min(plan.recap.start + Math.round(plan.fps * 1.1), plan.recap.end);
  keys.push({ frame: settle, cam: recap, easing: easeInOut });
  keys.push({ frame: plan.total, cam: { ...recap, zoom: recap.zoom * 1.06 }, easing: linear });
  return keys;
}

/**
 * Whole-journey framing: the tightest zoom whose map-clamped camera keeps every
 * pin in RECAP_SAFE (stepping the zoom down 5% at a time — deterministic);
 * if none does, the best fit panned so the pins stay visible.
 */
function recapCamera(points: WorldPoint[], b: ReturnType<typeof boundsOf>, map: { width: number; height: number }, screenWidth: number, overviewZoom: number): Camera {
  // Down to the whole-map framing when a part spans (almost) the entire world.
  const minZoom = Math.min(0.8, overviewZoom * 0.82);
  const fit = fitCamera(b, RECAP_BOX, [minZoom, ZOOM_RANGE[1]]);
  const band = { width: screenWidth, ...BAND };
  for (let zoom = fit.zoom; zoom >= minZoom; zoom *= 0.95) {
    const cam = clampToMap({ ...fit, zoom }, map, band);
    if (allInView(cam, points, RECAP_SAFE, screenWidth)) return cam;
  }
  return keepInView(clampToMap(fit, map, band), points, RECAP_SAFE, screenWidth);
}
