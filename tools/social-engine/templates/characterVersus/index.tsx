import { Composition } from 'remotion';
import { SITE } from '@/seo/config';
import { fillTemplate } from '../../config/copy';
import { VERTICAL_FORMAT } from '../../config/defaults';
import type { CharacterVersusConfig } from '../../config/types';
import type { TemplateDefinition } from '../types';
import { CharacterVersus } from './CharacterVersus';
import { parseCharacterVersusConfig } from './config';
import { resolveCharacterVersus } from './resolve';
import { scanCharacterVersus } from './scan';
import { versusSubject } from './sides';
import type { CharacterVersusProps } from './types';

const COMPOSITION_ID = 'CharacterVersus';
const example: CharacterVersusConfig = {
  template: 'characterVersus',
  anime: 'naruto',
  subject: 'naruto-uzumaki',
  opponent: { anime: 'onepiece', subject: 'monkey-d-luffy' },
  locale: 'en',
};

function CharacterVersusComposition() {
  return (
    <Composition
      id={COMPOSITION_ID}
      component={CharacterVersus}
      width={VERTICAL_FORMAT.width}
      height={VERTICAL_FORMAT.height}
      fps={VERTICAL_FORMAT.fps}
      durationInFrames={VERTICAL_FORMAT.fps * 22}
      defaultProps={{ config: example } satisfies CharacterVersusProps}
      calculateMetadata={async ({ props }) => {
        const data = props.data ?? (await resolveCharacterVersus(props.config));
        return { durationInFrames: Math.round(data.durationSeconds * VERTICAL_FORMAT.fps), props: { ...props, data } };
      }}
    />
  );
}

export const characterVersusTemplate: TemplateDefinition<CharacterVersusConfig> = {
  id: 'characterVersus',
  compositionId: COMPOSITION_ID,
  cliName: 'character-versus',
  description: 'Who travelled more? Two characters (often from two worlds), their journeys on the map, real counts, one winner.',
  example,
  configKeys: ['subject', 'opponent'],
  parseConfig: parseCharacterVersusConfig,
  configFor: (anime, subject, locale) => ({ template: 'characterVersus', anime, subject, opponent: { anime: '', subject: '' }, locale }),
  scan: scanCharacterVersus,
  schema: {
    required: ['subject', 'opponent'],
    properties: {
      subject: { type: 'string', minLength: 1, description: 'First character (in `anime`): catalog `request.subject`. NOT the composite catalog `subject`.' },
      opponent: {
        type: 'object',
        additionalProperties: false,
        required: ['anime', 'subject'],
        description: 'Second character, copied from the catalog item `request.opponent`.',
        properties: { anime: { type: 'string', minLength: 1 }, subject: { type: 'string', minLength: 1 } },
      },
    },
  },
  async resolve(config, options) {
    const resolved = await resolveCharacterVersus(config);
    const data = options?.audio ? { ...resolved, audio: options.audio } : resolved;
    const props: CharacterVersusProps = { config, data };
    const { a, b } = data;
    const sides: [string, string] = [a.name, b.name];
    return {
      identity: { anime: a.anime, subject: versusSubject(a.slug, b.anime, b.slug), subjectName: `${a.name} vs ${b.name}`, locale: data.locale, segment: null },
      segment: null,
      props,
      durationSeconds: data.durationSeconds,
      publicAssets: ['icon-512.png', ...[a, b].flatMap((s) => (s.map.backgroundSrc ? [s.map.backgroundSrc] : []))],
      canonicalConfig: { subject: a.slug, opponent: { anime: b.anime, subject: b.slug } },
      manifest: {
        title: `${a.name} vs ${b.name} · ${data.copy.kicker}`,
        hook: data.hook,
        cta: data.cta,
        pageUrl: SITE.origin,
        winner: data.winner === 'tie' ? 'tie' : data.winner === 'a' ? a.name : b.name,
        places: [`${a.name}: ${a.places}`, `${b.name}: ${b.places}`],
      },
      social: {
        contentType: 'character-versus',
        animes: a.anime === b.anime ? [a.anime] : [a.anime, b.anime],
        animeTitles: a.anime === b.anime ? [a.worldTitle] : [a.worldTitle, b.worldTitle],
        characterNames: sides,
        part: null,
        partCount: null,
        places: null,
        pageUrl: SITE.origin,
        spoilerFree: false,
      },
      cover: {
        format: 'versus',
        title: fillTemplate(data.copy.coverTitle, { a: a.name, b: b.name }),
        subtitle: data.copy.kicker,
        kicker: a.anime === b.anime ? a.worldTitle : `${a.worldTitle} × ${b.worldTitle}`,
        formatLabel: data.copy.formatLabel,
        accents: [a.accent, b.accent],
        backgrounds: [a, b].flatMap((s) => (s.map.backgroundSrc ? [s.map.backgroundSrc] : [])),
        sides,
      },
      summary: [
        `${a.worldTitle} × ${b.worldTitle} · ${a.name} vs ${b.name} · ${data.locale}`,
        `hook: "${data.hook}"`,
        `cta:  "${data.cta}"`,
        `duration: ${data.durationSeconds}s · ${a.name}: ${a.places} places / ${a.arcs} arcs · ${b.name}: ${b.places} places / ${b.arcs} arcs → ${data.winner} (${data.decidedBy})`,
      ],
    };
  },
  Composition: CharacterVersusComposition,
};
