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
  },
};

/** Fills `{key}` placeholders. Unknown keys are left untouched. */
export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}
