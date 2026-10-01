import { MAX_CTA_CHARS, MAX_DURATION_SECONDS, MAX_HOOK_CHARS, MIN_DURATION_SECONDS } from './defaults';
import { VIDEO_LOCALES, type AudioTrackConfig, type SocialVideoConfig, type VideoLocale } from './types';

/**
 * Hand-written validator for social video configs (no extra dependency).
 * Accepts `unknown` (parsed JSON / CLI flags) and returns either a typed config
 * or the full list of problems, so the user fixes everything in one pass.
 * Unknown keys are rejected: a typo must never be silently ignored.
 *
 * This file holds the shared building blocks; each template parses its own
 * fields (`templates/<id>/config.ts`) and the registry dispatches by `template`.
 */
export type ConfigParseResult =
  | { ok: true; config: SocialVideoConfig }
  | { ok: false; errors: string[] };

export type Obj = Record<string, unknown>;
export const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

export class Collector {
  errors: string[] = [];
  push(path: string, message: string) {
    this.errors.push(`${path}: ${message}`);
  }
}

export function str(o: Obj, key: string, c: Collector, opts: { required?: boolean; max?: number } = {}): string | undefined {
  const v = o[key];
  if (v === undefined) {
    if (opts.required) c.push(key, 'is required');
    return undefined;
  }
  if (typeof v !== 'string' || !v.trim()) {
    c.push(key, 'must be a non-empty string');
    return undefined;
  }
  if (opts.max !== undefined && v.length > opts.max) {
    c.push(key, `must be at most ${opts.max} characters (got ${v.length})`);
  }
  return v.trim();
}

export function int(o: Obj, key: string, c: Collector, min: number, max: number, path = key): number | undefined {
  const v = o[key];
  if (v === undefined) return undefined;
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    c.push(path, 'must be a number');
    return undefined;
  }
  if (v < min || v > max) c.push(path, `must be between ${min} and ${max} (got ${v})`);
  return v;
}

export function strArray(o: Obj, key: string, c: Collector, max: number, path = key): string[] | undefined {
  const v = o[key];
  if (v === undefined) return undefined;
  if (!Array.isArray(v) || v.some((x) => typeof x !== 'string' || !x.trim())) {
    c.push(path, 'must be an array of non-empty strings');
    return undefined;
  }
  if (v.length > max) c.push(path, `must contain at most ${max} items`);
  return (v as string[]).map((x) => x.trim());
}

export function rejectUnknown(o: Obj, allowed: readonly string[], c: Collector, prefix = '') {
  for (const key of Object.keys(o)) {
    if (!allowed.includes(key)) c.push(`${prefix}${key}`, 'unknown field');
  }
}

export function parseAudio(v: unknown, c: Collector): AudioTrackConfig | undefined {
  if (v === undefined) return undefined;
  if (!isObj(v)) {
    c.push('audio', 'must be an object { src, volume? }');
    return undefined;
  }
  rejectUnknown(v, ['src', 'volume'], c, 'audio.');
  const src = typeof v.src === 'string' && v.src.trim() ? v.src.trim() : undefined;
  if (!src) c.push('audio.src', 'is required (path to a local royalty-free audio file)');
  else if (!/\.(mp3|wav|m4a|aac|ogg)$/i.test(src)) c.push('audio.src', 'must be an .mp3, .wav, .m4a, .aac or .ogg file');
  let volume: number | undefined;
  if (v.volume !== undefined) {
    if (typeof v.volume !== 'number' || v.volume < 0 || v.volume > 1) c.push('audio.volume', 'must be a number between 0 and 1');
    else volume = v.volume;
  }
  return src ? { src, ...(volume !== undefined ? { volume } : {}) } : undefined;
}

export const BASE_KEYS = ['$schema', 'template', 'anime', 'locale', 'hook', 'cta', 'durationSeconds', 'audio'] as const;

/** Parses the fields shared by every template. */
export function parseBase(o: Obj, c: Collector) {
  const locale = o.locale;
  if (locale !== undefined && !VIDEO_LOCALES.includes(locale as VideoLocale)) {
    c.push('locale', `must be one of: ${VIDEO_LOCALES.join(', ')} (got ${JSON.stringify(locale)})`);
  }
  return {
    anime: str(o, 'anime', c, { required: true }) ?? '',
    locale: VIDEO_LOCALES.includes(locale as VideoLocale) ? (locale as VideoLocale) : undefined,
    hook: str(o, 'hook', c, { max: MAX_HOOK_CHARS }),
    cta: str(o, 'cta', c, { max: MAX_CTA_CHARS }),
    durationSeconds: int(o, 'durationSeconds', c, MIN_DURATION_SECONDS, MAX_DURATION_SECONDS),
    audio: parseAudio(o.audio, c),
  };
}

/** Removes `undefined` keys so configs round-trip cleanly through JSON (Remotion props). */
export function compact<T extends Obj>(value: T): T {
  const out: Obj = {};
  for (const [k, v] of Object.entries(value)) {
    if (v === undefined) continue;
    out[k] = isObj(v) ? compact(v) : v;
  }
  return out as T;
}

