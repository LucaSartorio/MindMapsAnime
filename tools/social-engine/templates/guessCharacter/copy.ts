import type { VideoLocale } from '../../config/types';
import type { GuessCopy } from './types';

/** Deterministic copy (no AI text). `{anime}` = world title, `{count}` = places. */
export const GUESS_COPY: Record<VideoLocale, GuessCopy> = {
  en: {
    formatLabel: 'GUESS',
    kicker: 'Guess the character',
    clue: 'Clue',
    cluesCount: '{count} clues',
    think: 'Who is it?',
    countdown: 'Lock in your answer',
    answerKicker: 'The answer',
    places: 'places on the map',
    coverTitle: 'Guess the character',
    hook: 'Guess the {anime} character from the places they visited.',
    cta: 'Did you get it right?',
    brandTagline: 'Interactive atlas · Anime & Manga',
  },
  it: {
    formatLabel: 'INDOVINA',
    kicker: 'Indovina il personaggio',
    clue: 'Indizio',
    cluesCount: '{count} indizi',
    think: 'Chi è?',
    countdown: 'Dai la tua risposta',
    answerKicker: 'La risposta',
    places: 'luoghi sulla mappa',
    coverTitle: 'Indovina il personaggio',
    hook: 'Indovina il personaggio di {anime} dai luoghi che ha visitato.',
    cta: 'Ci hai preso?',
    brandTagline: 'Atlante interattivo · Anime & Manga',
  },
};
