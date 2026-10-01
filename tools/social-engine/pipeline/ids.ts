import type { VideoLocale } from '../config/types';

/**
 * Identifiers of the content pipeline — stable, unique, readable, and
 * independent of the date, the hook text and (for `contentId`) the language.
 *
 *   contentId  character-journey:naruto:itachi-uchiha        WHAT  (template : world : subject)
 *   renderId   character-journey:naruto:itachi-uchiha@en     ONE VIDEO (+ locale)
 *              character-journey:naruto:itachi-uchiha@en+teaser   (+ editorial variant)
 *   fileStem   naruto_itachi-uchiha_character-journey_en[_teaser]  (files: .mp4, .manifest.json)
 *
 * Every segment is a lowercase slug (`[a-z0-9-]`), so ids are safe to embed
 * in file names and can never contain path separators.
 */
export const SEGMENT_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_SEGMENT = 80;
export const DEFAULT_VARIANT = null;

export function isSafeSegment(value: string): boolean {
  return value.length <= MAX_SEGMENT && SEGMENT_RE.test(value);
}

function assertSegment(kind: string, value: string): void {
  if (!isSafeSegment(value)) throw new Error(`Invalid ${kind} "${value}" (expected a lowercase slug: a-z, 0-9, "-")`);
}

export type RenderKey = { contentId: string; locale: VideoLocale; variant: string | null };

export function contentIdFor(templateCliName: string, anime: string, subject: string): string {
  assertSegment('template', templateCliName);
  assertSegment('anime', anime);
  assertSegment('subject', subject);
  return `${templateCliName}:${anime}:${subject}`;
}

export function renderIdFor({ contentId, locale, variant }: RenderKey): string {
  parseContentId(contentId);
  if (variant !== null) assertSegment('variant', variant);
  return `${contentId}@${locale}${variant ? `+${variant}` : ''}`;
}

export function parseContentId(contentId: string): { template: string; anime: string; subject: string } {
  const parts = contentId.split(':');
  if (parts.length !== 3 || !parts.every(isSafeSegment)) throw new Error(`Invalid content id "${contentId}" (expected template:anime:subject)`);
  const [template, anime, subject] = parts;
  return { template, anime, subject };
}

export function parseRenderId(renderId: string): RenderKey {
  const m = /^([^@]+)@(en|it)(?:\+([a-z0-9-]+))?$/.exec(renderId);
  if (!m) throw new Error(`Invalid render id "${renderId}" (expected <contentId>@<locale>[+<variant>])`);
  parseContentId(m[1]);
  if (m[3] !== undefined) assertSegment('variant', m[3]);
  return { contentId: m[1], locale: m[2] as VideoLocale, variant: m[3] ?? null };
}

/** `naruto_itachi-uchiha_character-journey_en` — the name of every file of a render. */
export function fileStemFor(key: RenderKey): string {
  const { template, anime, subject } = parseContentId(key.contentId);
  return [anime, subject, template, key.locale, ...(key.variant ? [key.variant] : [])].join('_');
}
