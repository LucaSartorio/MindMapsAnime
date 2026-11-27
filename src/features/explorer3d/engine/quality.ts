import type { QualityLevel, QualityPreference } from '../types';

/**
 * Graphics presets and the adaptive ("auto") controller. Pure logic, no three.js and no DOM access except through
 * the `DeviceHints` argument, so it is unit-tested in Node (`npm run test:3d:unit`).
 */
export interface QualitySettings {
  /** Device-pixel-ratio cap (the renderer uses min(devicePixelRatio, dprMax), floored at dprMin). */
  dprMin: number;
  dprMax: number;
  shadows: boolean;
  shadowMapSize: number;
  /** Ink outlines (edge lines) on architecture. */
  outlines: boolean;
  /** Ocean grid resolution per side; 1 = flat quad without vertex waves. */
  oceanSegments: number;
  /** Small props (railing posts, lanterns, crates) are hidden beyond this camera distance. */
  detailDistance: number;
  fogFar: number;
  /** Target frame time (ms) the auto controller tries to keep. */
  targetFrameMs: number;
}

export const QUALITY_PRESETS: Record<QualityLevel, QualitySettings> = {
  low: {
    dprMin: 0.75,
    dprMax: 1,
    shadows: false,
    shadowMapSize: 0,
    outlines: false,
    oceanSegments: 1,
    detailDistance: 45,
    fogFar: 260,
    targetFrameMs: 1000 / 30,
  },
  medium: {
    dprMin: 1,
    dprMax: 1.25,
    shadows: true,
    shadowMapSize: 1024,
    outlines: true,
    oceanSegments: 64,
    detailDistance: 90,
    fogFar: 420,
    targetFrameMs: 1000 / 45,
  },
  high: {
    dprMin: 1,
    dprMax: 1.5,
    shadows: true,
    shadowMapSize: 2048,
    outlines: true,
    oceanSegments: 128,
    detailDistance: 180,
    fogFar: 600,
    targetFrameMs: 1000 / 60,
  },
};

export const QUALITY_ORDER: readonly QualityLevel[] = ['low', 'medium', 'high'];

export interface DeviceHints {
  /** `navigator.hardwareConcurrency` */
  cores?: number;
  /** `navigator.deviceMemory` (GB, Chromium only) */
  memoryGb?: number;
  /** `(pointer: coarse)` media query */
  coarsePointer: boolean;
  /** CSS pixels of the viewport × devicePixelRatio² ≈ pixels to shade. */
  pixels: number;
  /** WebGL `MAX_TEXTURE_SIZE`, a rough GPU class indicator. */
  maxTextureSize?: number;
  /** Software rasterizer (SwiftShader / llvmpipe) detected from the unmasked renderer string. */
  softwareRenderer?: boolean;
}

/** First guess for `auto`, refined by measured frame times. Never relies on the user agent string. */
export function initialAutoLevel(h: DeviceHints): QualityLevel {
  if (h.softwareRenderer) return 'low';
  let score = 0;
  if ((h.cores ?? 4) >= 8) score += 1;
  if ((h.cores ?? 4) <= 2) score -= 1;
  if (h.memoryGb !== undefined && h.memoryGb <= 2) score -= 1;
  if (h.memoryGb !== undefined && h.memoryGb >= 8) score += 1;
  if (h.coarsePointer) score -= 1;
  if (h.pixels > 4_000_000) score -= 1;
  if ((h.maxTextureSize ?? 8192) >= 16384) score += 1;
  if (score >= 2) return 'high';
  if (score <= -1) return 'low';
  return 'medium';
}

export interface AutoQualityOptions {
  /** Length of a measurement window (ms of rendered frames). */
  windowMs: number;
  /** Consecutive slow windows before stepping down. */
  downAfter: number;
  /** Consecutive fast windows before stepping up. */
  upAfter: number;
  /** Ignore measurements for this long after a change (shader compilation, resize). */
  cooldownMs: number;
}

const DEFAULT_AUTO: AutoQualityOptions = { windowMs: 2000, downAfter: 2, upAfter: 4, cooldownMs: 3000 };

/**
 * Hysteresis controller: steps DOWN when the 90th-percentile frame time of a window exceeds 1.25× the target of the
 * current level for `downAfter` windows in a row; steps UP when it stays below 0.6× the target of the NEXT level for
 * `upAfter` windows. Different thresholds + streaks + cooldown = no oscillation between presets.
 * Only frames rendered back-to-back count (`sample` gets the delta between consecutive frames of a continuous loop):
 * on-demand renders are not a frame-rate signal.
 */
export class AutoQualityController {
  private samples: number[] = [];
  private windowElapsed = 0;
  private slow = 0;
  private fast = 0;
  private cooldown = 0;
  private readonly opts: AutoQualityOptions;
  /** Highest level ever stepped down from because it was too slow: never climb back to it (stops ping-pong). */
  private ceiling: number = QUALITY_ORDER.length - 1;

  constructor(
    public level: QualityLevel,
    opts: Partial<AutoQualityOptions> = {},
  ) {
    this.opts = { ...DEFAULT_AUTO, ...opts };
    this.cooldown = this.opts.cooldownMs;
  }

  /** Feeds one frame delta (ms); returns the new level when it changes, otherwise `null`. */
  sample(frameMs: number): QualityLevel | null {
    if (!(frameMs > 0) || frameMs > 1000) return null; // tab switch, breakpoint, first frame
    if (this.cooldown > 0) {
      this.cooldown -= frameMs;
      return null;
    }
    this.samples.push(frameMs);
    this.windowElapsed += frameMs;
    if (this.windowElapsed < this.opts.windowMs) return null;

    const sorted = [...this.samples].sort((a, b) => a - b);
    const p90 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.9))];
    this.samples = [];
    this.windowElapsed = 0;

    const i = QUALITY_ORDER.indexOf(this.level);
    const target = QUALITY_PRESETS[this.level].targetFrameMs;
    if (p90 > target * 1.25) {
      this.slow++;
      this.fast = 0;
    } else if (i < this.ceiling && p90 < QUALITY_PRESETS[QUALITY_ORDER[i + 1]].targetFrameMs * 0.6) {
      this.fast++;
      this.slow = 0;
    } else {
      this.slow = 0;
      this.fast = 0;
    }

    if (this.slow >= this.opts.downAfter && i > 0) {
      this.ceiling = Math.min(this.ceiling, i - 1);
      return this.change(QUALITY_ORDER[i - 1]);
    }
    if (this.fast >= this.opts.upAfter && i < this.ceiling) return this.change(QUALITY_ORDER[i + 1]);
    return null;
  }

  /** True when the device stays too slow even at `low` (the UI may suggest leaving the 3D view). */
  get struggling(): boolean {
    return this.level === 'low' && this.slow >= this.opts.downAfter;
  }

  private change(next: QualityLevel): QualityLevel {
    this.level = next;
    this.slow = 0;
    this.fast = 0;
    this.samples = [];
    this.windowElapsed = 0;
    this.cooldown = this.opts.cooldownMs;
    return next;
  }
}

export function resolveQuality(pref: QualityPreference, autoLevel: QualityLevel): QualityLevel {
  return pref === 'auto' ? autoLevel : pref;
}
