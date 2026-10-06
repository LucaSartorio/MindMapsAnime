import type { VideoLocale } from '../../config/types';
import type { VersusCopy } from './types';

/** `{a}` / `{b}` = names, `{name}` = winner. Deterministic copy (no AI text). */
export const VERSUS_COPY: Record<VideoLocale, VersusCopy> = {
  en: {
    formatLabel: 'VERSUS',
    kicker: 'Who travelled more?',
    places: 'places',
    arcs: 'story arcs',
    wins: '{name} wins',
    tie: "It's a tie",
    hook: 'Who travelled more: {a} or {b}?',
    cta: 'Who should compete next?',
    coverTitle: '{a} vs {b}',
    brandTagline: 'Interactive atlas · Anime & Manga',
  },
  it: {
    formatLabel: 'SFIDA',
    kicker: 'Chi ha viaggiato di più?',
    places: 'luoghi',
    arcs: 'archi narrativi',
    wins: 'Vince {name}',
    tie: 'Pareggio',
    hook: 'Chi ha viaggiato di più: {a} o {b}?',
    cta: 'Chi deve sfidarsi la prossima volta?',
    coverTitle: '{a} vs {b}',
    brandTagline: 'Atlante interattivo · Anime & Manga',
  },
};
