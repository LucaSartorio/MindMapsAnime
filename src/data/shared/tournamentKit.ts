import type { Localizable, TournamentMatch, TournamentSide } from '@/types';

/**
 * Piccoli costruttori per scrivere i tornei dei dataset in modo compatto.
 * `kit('char-hxh-')` restituisce helper che prefissano gli id dei personaggi.
 */
export const L = (it: string, en: string = it): Localizable => ({ it, en });

export function tournamentKit(charPrefix: string) {
  /** Un lato: uno o più personaggi, con un'etichetta facoltativa (pseudonimo, squadra). */
  const side = (ids: string | string[], label?: Localizable): TournamentSide => ({
    characterIds: (Array.isArray(ids) ? ids : [ids]).map((id) => `${charPrefix}${id}`),
    ...(label ? { label } : {}),
  });
  /** Un lato senza scheda personaggio (es. «gli altri combattenti del blocco A»). */
  const group = (label: Localizable): TournamentSide => ({ label });
  /** Un incontro fra due lati; `winner` = indice del vincitore. */
  const match = (a: TournamentSide, b: TournamentSide, winner?: 0 | 1, extra: Partial<TournamentMatch> = {}): TournamentMatch => ({
    sides: [a, b],
    ...(winner !== undefined ? { winner } : {}),
    ...extra,
  });
  const char = (id: string) => `${charPrefix}${id}`;
  return { side, group, match, char };
}
