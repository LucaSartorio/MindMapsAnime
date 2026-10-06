import { Composition } from 'remotion';
import { mapPath } from '@/seo/paths';
import { findWorld } from '../../data/world';
import { GUESS_MAX_PLACES, GUESS_MIN_PLACES, VERTICAL_FORMAT } from '../../config/defaults';
import type { GuessCharacterConfig } from '../../config/types';
import { SITE } from '@/seo/config';
import type { TemplateDefinition } from '../types';
import { fillTemplate } from '../../config/copy';
import { parseGuessCharacterConfig } from './config';
import { GuessCharacter } from './GuessCharacter';
import { resolveGuessCharacter } from './resolve';
import { scanGuessCharacter } from './scan';
import type { GuessCharacterProps } from './types';

const COMPOSITION_ID = 'GuessCharacter';
const example: GuessCharacterConfig = { template: 'guessCharacter', anime: 'naruto', subject: 'naruto-uzumaki', locale: 'en' };

function GuessCharacterComposition() {
  return (
    <Composition
      id={COMPOSITION_ID}
      component={GuessCharacter}
      width={VERTICAL_FORMAT.width}
      height={VERTICAL_FORMAT.height}
      fps={VERTICAL_FORMAT.fps}
      durationInFrames={VERTICAL_FORMAT.fps * 22}
      defaultProps={{ config: example } satisfies GuessCharacterProps}
      calculateMetadata={async ({ props }) => {
        const data = props.data ?? (await resolveGuessCharacter(props.config));
        return { durationInFrames: Math.round(data.durationSeconds * VERTICAL_FORMAT.fps), props: { ...props, data } };
      }}
    />
  );
}

export const guessCharacterTemplate: TemplateDefinition<GuessCharacterConfig> = {
  id: 'guessCharacter',
  compositionId: COMPOSITION_ID,
  cliName: 'guess-character',
  description: 'Guess the character: places of their journey appear one by one on the map → countdown → reveal → CTA.',
  example,
  configKeys: ['subject', 'places'],
  parseConfig: parseGuessCharacterConfig,
  configFor: (anime, subject, locale) => ({ template: 'guessCharacter', anime, subject, locale }),
  scan: scanGuessCharacter,
  schema: {
    required: ['subject'],
    properties: {
      subject: { type: 'string', minLength: 1, description: 'Character to guess: catalog `subject` (SEO slug).' },
      places: { type: 'integer', minimum: GUESS_MIN_PLACES, maximum: GUESS_MAX_PLACES, description: 'Clues shown before the reveal. Omit (automatic).' },
    },
  },
  async resolve(config, options) {
    const resolved = await resolveGuessCharacter(config);
    const data = options?.audio ? { ...resolved, audio: options.audio } : resolved;
    const props: GuessCharacterProps = { config, data };
    const world = findWorld(data.world.slug);
    // Captions must not give the answer away: link the world map, not the character page.
    const mapUrl = world ? `${SITE.origin}${mapPath(data.locale, world)}` : SITE.origin;
    return {
      identity: { anime: data.world.slug, subject: data.answer.slug, subjectName: data.answer.name, locale: data.locale, segment: null },
      segment: null,
      props,
      durationSeconds: data.durationSeconds,
      publicAssets: ['icon-512.png', ...(data.map.backgroundSrc ? [data.map.backgroundSrc] : [])],
      manifest: {
        title: `${data.copy.coverTitle} · ${data.world.title}`,
        hook: data.hook,
        cta: data.cta,
        pageUrl: mapUrl,
        answer: data.answer.name,
        clues: data.places.map((p) => p.name),
      },
      social: {
        contentType: 'guess-character',
        animes: [data.world.slug],
        animeTitles: [data.world.title],
        characterNames: [data.answer.name],
        part: null,
        partCount: null,
        places: data.places.length,
        pageUrl: mapUrl,
        spoilerFree: true,
      },
      cover: {
        format: 'guess',
        title: data.copy.coverTitle,
        kicker: data.world.title,
        formatLabel: data.copy.formatLabel,
        subtitle: fillTemplate(data.copy.cluesCount, { count: String(data.places.length) }),
        accents: [data.world.accent],
        backgrounds: data.map.backgroundSrc ? [data.map.backgroundSrc] : [],
      },
      summary: [
        `${data.world.title} · guess ${data.answer.name} (${data.answer.slug}) · ${data.locale}`,
        `hook: "${data.hook}"`,
        `cta:  "${data.cta}"`,
        `duration: ${data.durationSeconds}s · ${data.places.length} clues · journey: ${data.journeyPlaces} places`,
        ...data.places.map((p, i) => `  ${String(i + 1).padStart(2)}. ${p.name}${p.region ? ` · ${p.region}` : ''}`),
      ],
    };
  },
  Composition: GuessCharacterComposition,
};
