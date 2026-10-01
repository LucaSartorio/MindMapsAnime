import { Composition } from 'remotion';
import exampleJson from '../../examples/itachi-character-journey.json';
import { VERTICAL_FORMAT } from '../../config/defaults';
import { Collector, compact, isObj } from '../../config/schema';
import type { CharacterJourneyConfig } from '../../config/types';
import type { TemplateDefinition } from '../types';
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
  parseConfig: parseCharacterJourneyConfig,
  async resolve(config, options) {
    const resolved = await resolveCharacterJourney(config);
    const data = options?.audio ? { ...resolved, audio: options.audio } : resolved;
    const props: CharacterJourneyProps = { config, data };
    return {
      props,
      durationSeconds: data.durationSeconds,
      outputBaseName: `${data.character.slug}-character-journey-${data.locale}`,
      publicAssets: ['icon-512.png', ...(data.map.backgroundSrc ? [data.map.backgroundSrc] : [])],
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
