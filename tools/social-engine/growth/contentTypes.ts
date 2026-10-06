import type { TemplateId } from '../config/types';
import type { ContentType } from './config';

/**
 * Content types of the social feed. A type is "implemented" when a template
 * renders it; the others are declared so the model, the config and the docs
 * already speak about them (adding one = a template + `implemented: true`).
 * The content type is the template's CLI name (`character-journey`), which is
 * also the first segment of every content id.
 */
export type ContentTypeInfo = { templateId: TemplateId | null; implemented: boolean; description: string };

export const CONTENT_TYPES: Record<ContentType, ContentTypeInfo> = {
  'character-journey': { templateId: 'characterJourney', implemented: true, description: "A character's journey on the world map (multi-part when long)." },
  'guess-character': { templateId: 'guessCharacter', implemented: true, description: 'Places appear one by one; guess the character before the reveal.' },
  'character-versus': { templateId: 'characterVersus', implemented: true, description: 'Two characters, one question: who travelled more? (real data only).' },
  'guess-location': { templateId: null, implemented: false, description: 'Planned: guess a place from who visited it.' },
  'journey-comparison': { templateId: null, implemented: false, description: 'Planned: two journeys drawn on the same map.' },
};

export const IMPLEMENTED_CONTENT_TYPES = (Object.keys(CONTENT_TYPES) as ContentType[]).filter((t) => CONTENT_TYPES[t].implemented);

const BY_TEMPLATE = new Map(
  (Object.entries(CONTENT_TYPES) as [ContentType, ContentTypeInfo][]).flatMap(([type, info]) => (info.templateId ? [[info.templateId as string, type] as const] : [])),
);

/** `characterJourney` → `character-journey` (unknown templates fall back to their own id). */
export function contentTypeOfTemplate(templateId: string): ContentType | string {
  return BY_TEMPLATE.get(templateId) ?? templateId;
}

/** `character-journey` → `characterJourney`: the template (and so the Remotion composition) that renders a content type. */
export function templateForContentType(contentType: string): TemplateId | null {
  return CONTENT_TYPES[contentType as ContentType]?.templateId ?? null;
}
