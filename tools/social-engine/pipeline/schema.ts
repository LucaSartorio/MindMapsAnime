import { MAX_CTA_CHARS, MAX_DURATION_SECONDS, MAX_HOOK_CHARS, MIN_DURATION_SECONDS } from '../config/defaults';
import { VIDEO_LOCALES } from '../config/types';
import { animeWorlds, getWorldUrlSlug } from '@/data/worlds';
import { availableWorldSlugs } from '../data/world';
import { TEMPLATE_LIST } from '../templates/registry';
import { MAX_NOTES, SELECTION_MODES } from './content';
import { CTA_TYPES, HOOK_TYPES } from '../growth/config';
import { MAX_SEGMENT, SEGMENT_RE } from './ids';

/**
 * JSON Schema (draft 2020-12) of a content request — GENERATED from the same
 * constants the TypeScript parser uses (`npm run social:schema` writes
 * schemas/social-content.schema.json; `social:validate` fails if it's stale).
 * It's the machine-readable half of docs/SOCIAL_AGENT_CONTRACT.md.
 */
export const SCHEMA_ID = 'https://animapverse.com/schemas/social-content.schema.json';

export function buildContentSchema(): Record<string, unknown> {
  const slug = SEGMENT_RE.source;
  const animeSlugs = availableWorldSlugs().flatMap((s) => {
    const world = animeWorlds.find((w) => w.slug === s);
    const url = world ? getWorldUrlSlug(world) : s;
    return url === s ? [s] : [s, url];
  });
  const shared: Record<string, unknown> = {
    $schema: { type: 'string', description: 'Optional pointer to this schema (ignored).' },
    id: {
      type: 'string',
      pattern: `^${slug.slice(1, -1)}:${slug.slice(1, -1)}:${slug.slice(1, -1)}(?::${slug.slice(1, -1)})?$`,
      description: 'Optional content id "<template>:<anime>:<subject>[:<segment>]" copied from catalog.json. If present it must match the config.',
    },
    status: { const: 'queued', description: 'Optional. Only "queued" is allowed: the pipeline owns every other state.' },
    template: { type: 'string', description: 'Template id.' },
    anime: { enum: animeSlugs, description: 'World: catalog `anime` (internal slug); public URL slugs are accepted too.' },
    locale: { enum: [...VIDEO_LOCALES], default: 'en' },
    variant: { type: 'string', pattern: slug, maxLength: MAX_SEGMENT, description: 'Editorial variant. REQUIRED to produce a new edition of a video already rendered (same content + locale).' },
    hook: { type: 'string', minLength: 1, maxLength: MAX_HOOK_CHARS, description: 'Opening line, ≤ 2 lines on a phone. Default: deterministic template.' },
    cta: { type: 'string', minLength: 1, maxLength: MAX_CTA_CHARS, description: 'Closing call to action. Default: deterministic template.' },
    durationSeconds: {
      type: 'number',
      minimum: MIN_DURATION_SECONDS,
      maximum: MAX_DURATION_SECONDS,
      description: 'OMIT IT: the engine computes the length from the stops. If it must be explicit, copy the catalog `recommendedDurationSeconds` exactly; never invent it.',
    },
    notes: { type: 'string', maxLength: MAX_NOTES, description: 'Why this content was chosen. Stored, never rendered.' },
    allowRerender: { type: 'boolean', description: 'HUMAN OVERRIDE ONLY. Agents must not set it.' },
    hookType: { enum: [...HOOK_TYPES], description: 'Hook category (copy it from catalog/next.json). Recorded in history for performance analysis.' },
    hookId: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', maxLength: 60, description: 'Hook template id (copy it from catalog/next.json).' },
    ctaType: { enum: [...CTA_TYPES], description: 'CTA category (copy it from catalog/next.json); drives the per-network caption wording.' },
    selection: {
      type: 'object',
      additionalProperties: false,
      required: ['mode', 'score', 'seed'],
      description: 'How the growth selector picked this content (copy it from catalog/next.json). Omit for hand-written requests.',
      properties: { mode: { enum: [...SELECTION_MODES] }, score: { type: 'number' }, seed: { type: 'string', maxLength: 80 } },
    },
    audio: {
      type: 'object',
      additionalProperties: false,
      required: ['src'],
      description: 'Optional local royalty-free soundtrack inside tools/social-engine/audio/. Agents should omit it.',
      properties: {
        src: { type: 'string', pattern: '^(?!/)(?!.*\\.\\.)[A-Za-z0-9._/-]+\\.(mp3|wav|m4a|aac|ogg)$' },
        volume: { type: 'number', minimum: 0, maximum: 1 },
      },
    },
  };
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: SCHEMA_ID,
    title: 'AniMapVerse social content request',
    description: 'One JSON object per file in tools/social-engine/content/queue/ (or an array of them passed to `npm run social:queue -- --from`). See docs/SOCIAL_AGENT_CONTRACT.md.',
    oneOf: TEMPLATE_LIST.map((t) => ({
      title: t.id,
      description: t.description,
      type: 'object',
      additionalProperties: false,
      required: ['template', 'anime', ...t.schema.required],
      properties: { ...shared, template: { enum: [t.id, t.cliName], description: `"${t.id}" (or "${t.cliName}")` }, ...t.schema.properties },
    })),
  };
}
