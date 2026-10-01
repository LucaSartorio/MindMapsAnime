import { Composition } from 'remotion';
import exampleJson from '../../examples/itachi-character-journey.json';
import { MAX_HIGHLIGHTS, MAX_STOPS, MIN_STOPS, VERTICAL_FORMAT } from '../../config/defaults';
import { Collector, compact, isObj } from '../../config/schema';
import type { CharacterJourneyConfig } from '../../config/types';
import type { TemplateDefinition } from '../types';
import { scanCharacterJourney } from './catalog';
import { CharacterJourney } from './CharacterJourney';
import { parseCharacterJourneyConfig } from './config';
import { resolveCharacterJourney } from './resolve';
import type { CharacterJourneyProps } from './types';

const COMPOSITION_ID = 'CharacterJourney';

function parseExample(): CharacterJourneyConfig {
  const c = new Collector();
  const config = isObj(exampleJson) ? parseCharacterJourneyConfig({ ...exampleJson }, c) : undefined;
  if (!config || c.errors.length) throw new Error(`Invalid CharacterJourney example: ${c.errors.join('; ')}`);
  return compact(config);
}

const example = parseExample();

function CharacterJourneyComposition() {
  return (
    <Composition
      id={COMPOSITION_ID}
      component={CharacterJourney}
      width={VERTICAL_FORMAT.width}
      height={VERTICAL_FORMAT.height}
      fps={VERTICAL_FORMAT.fps}
      durationInFrames={VERTICAL_FORMAT.fps * 22}
      defaultProps={{ config: example } satisfies CharacterJourneyProps}
      calculateMetadata={async ({ props }) => {
        // CLI renders arrive with `data` already resolved in Node; Studio resolves here (same code).
        const data = props.data ?? (await resolveCharacterJourney(props.config));
        return { durationInFrames: Math.round(data.durationSeconds * VERTICAL_FORMAT.fps), props: { ...props, data } };
      }}
    />
  );
}

export const characterJourneyTemplate: TemplateDefinition<CharacterJourneyConfig> = {
  id: 'characterJourney',
  compositionId: COMPOSITION_ID,
  cliName: 'character-journey',
  description: "A character's journey across the world map: hook → map → animated route → key locations → CTA.",
  example,
  configKeys: ['subject', 'journey', 'highlights'],
  parseConfig: parseCharacterJourneyConfig,
  configFor: (anime, subject, locale) => ({ template: 'characterJourney', anime, subject, locale }),
  scan: scanCharacterJourney,
  schema: {
    required: ['subject'],
    properties: {
      subject: {
        type: 'string',
        minLength: 1,
        description: 'Character: catalog `subject` (SEO slug, e.g. "itachi-uchiha"). Ids ("char-itachi") and unique short forms ("luffy") are accepted too.',
      },
      journey: {
        type: 'object',
        additionalProperties: false,
        description: 'Optional journey tuning. Omit it unless there is a precise reason.',
        properties: {
          routeIds: { type: 'array', items: { type: 'string', minLength: 1 }, maxItems: 20 },
          includeEvents: { type: 'boolean' },
          maxStops: { type: 'integer', minimum: MIN_STOPS, maximum: MAX_STOPS },
        },
      },
      highlights: {
        type: 'array',
        items: { type: 'string', minLength: 1 },
        maxItems: MAX_HIGHLIGHTS,
        description: 'Locations featured in the recap (ids or SEO slugs). Must be stops of the journey. Omit for automatic selection.',
      },
    },
  },
  async resolve(config, options) {
    const resolved = await resolveCharacterJourney(config);
    const data = options?.audio ? { ...resolved, audio: options.audio } : resolved;
    const props: CharacterJourneyProps = { config, data };
    return {
      identity: { anime: data.world.slug, subject: data.character.slug, subjectName: data.character.name, locale: data.locale },
      props,
      durationSeconds: data.durationSeconds,
      publicAssets: ['icon-512.png', ...(data.map.backgroundSrc ? [data.map.backgroundSrc] : [])],
      manifest: {
        title: `${data.character.name} · ${data.copy.templateLabel}`,
        hook: data.hook,
        cta: data.cta,
        pageUrl: `https://${data.pageLabel}`,
        stops: data.stops.map((s) => s.regionName ?? s.shortName),
        journeyPlaces: data.stats.stops,
        journeyArcs: data.stats.arcs,
      },
      summary: [
        `${data.world.title} · ${data.character.name} (${data.character.id}) · ${data.locale}`,
        `hook: "${data.hook}"`,
        `cta:  "${data.cta}"`,
        `duration: ${data.durationSeconds}s · journey: ${data.stats.stops} places / ${data.stats.arcs} arcs → ${data.stops.length} animated stops`,
        ...data.stops.map(
          (s, i) =>
            `  ${String(i + 1).padStart(2)}. ${s.title} — ${[s.placeName, s.regionName].filter(Boolean).join(' · ')}` +
            `${s.arcName ? ` [${s.arcName}]` : ''} (${s.source}${data.highlights.includes(i) ? ', key' : ''})`,
        ),
        `map: ${data.map.name}${data.map.backgroundSrc ? ` (${data.map.backgroundSrc})` : ' (no image: vector fallback)'}`,
        `link: ${data.pageLabel}`,
      ],
    };
  },
  Composition: CharacterJourneyComposition,
};
