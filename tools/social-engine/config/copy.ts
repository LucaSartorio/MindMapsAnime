import type { VideoLocale } from './types';

/**
 * Video copy: deterministic templates, no AI-generated text.
 * `{name}` = character display name, `{anime}` = world title.
 * Data names (characters, places, arcs) come from the datasets, never from here.
 */
export type VideoCopy = {
  templateLabel: string;
  hook: string;
  cta: string;
  mapKicker: string;
  stop: string;
  stops: string;
  arcs: string;
  keyLocations: string;
  start: string;
  end: string;
  brandTagline: string;
  /** Series (long journeys split in parts). `{n}` part number, `{total}` part count. */
  partLabel: string;
  hookPartFirst: string;
  hookPartMiddle: string;
  hookPartLast: string;
  ctaContinue: string;
  nextPart: string;
  /** Cover: "{name}'s Journey" and the format pill. */
  coverTitle: string;
  coverFormat: string;
};

export const VIDEO_COPY: Record<VideoLocale, VideoCopy> = {
  en: {
    templateLabel: 'Character Journey',
    hook: "Follow {name}'s journey across the {anime} world.",
    cta: 'Explore the full journey on AniMapVerse',
    mapKicker: 'The map',
    stop: 'Stop',
    stops: 'stops',
    arcs: 'story arcs',
    keyLocations: 'Key locations',
    start: 'Start',
    end: 'End',
    brandTagline: 'Interactive atlas · Anime & Manga',
    partLabel: 'Part {n} of {total}',
    hookPartFirst: "{name}'s journey begins — Part {n} of {total}.",
    hookPartMiddle: "{name}'s journey continues — Part {n} of {total}.",
    hookPartLast: "The last stretch of {name}'s journey — Part {n} of {total}.",
    ctaContinue: 'Continue the journey on AniMapVerse',
    nextPart: 'Next: Part {n} of {total}',
    coverTitle: "{name}'s Journey",
    coverFormat: 'JOURNEY',
  },
  it: {
    templateLabel: 'Il viaggio del personaggio',
    hook: 'Segui il viaggio di {name} nel mondo di {anime}.',
    cta: 'Esplora il percorso completo su AniMapVerse',
    mapKicker: 'La mappa',
    stop: 'Tappa',
    stops: 'tappe',
    arcs: 'archi narrativi',
    keyLocations: 'Luoghi chiave',
    start: 'Inizio',
    end: 'Fine',
    brandTagline: 'Atlante interattivo · Anime & Manga',
    partLabel: 'Parte {n} di {total}',
    hookPartFirst: 'Il viaggio di {name} comincia — Parte {n} di {total}.',
    hookPartMiddle: 'Il viaggio di {name} continua — Parte {n} di {total}.',
    hookPartLast: "L'ultimo tratto del viaggio di {name} — Parte {n} di {total}.",
    ctaContinue: 'Continua il viaggio su AniMapVerse',
    nextPart: 'Prossima: Parte {n} di {total}',
    coverTitle: 'Il viaggio di {name}',
    coverFormat: 'VIAGGIO',
  },
};

/** Fills `{key}` placeholders. Unknown keys are left untouched. */
export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}
