import type { BattleOutcome, Localizable, TimelineEvent } from '@/types';

/**
 * Esiti degli scontri scritti a parte, per id evento, e applicati agli eventi
 * dall'index del mondo. I nomi brevi diventano id con il prefisso del mondo
 * (`kit('char-jjk-')`). I combattenti mancanti in `characterIds` vengono
 * aggiunti: chi combatte è sempre anche fra i personaggi dell'evento.
 */
export function battleKit(prefix: string) {
  const ids = (xs: string[]) => xs.map((x) => (x.startsWith('char-') ? x : prefix + x));
  return {
    /** Vince il primo schieramento. */
    win: (winners: string[], losers: string[], note?: Localizable): BattleOutcome => ({
      sides: [ids(winners), ids(losers)],
      winner: 0,
      ...(note ? { note } : {}),
    }),
    draw: (a: string[], b: string[], note?: Localizable): BattleOutcome => ({
      sides: [ids(a), ids(b)],
      result: 'draw',
      ...(note ? { note } : {}),
    }),
    /** Interrotto: nessun vincitore (fuga, intervento esterno, tregua). */
    stop: (a: string[], b: string[], note?: Localizable): BattleOutcome => ({
      sides: [ids(a), ids(b)],
      result: 'interrupted',
      ...(note ? { note } : {}),
    }),
  };
}

export function applyBattles(events: TimelineEvent[], outcomes: Record<string, BattleOutcome>): TimelineEvent[] {
  const missing = Object.keys(outcomes).filter((id) => !events.some((e) => e.id === id));
  if (missing.length) throw new Error(`battles: eventi inesistenti ${missing.join(', ')}`);
  return events.map((e) => {
    const battle = outcomes[e.id];
    if (!battle) return e;
    const fighters = battle.sides.flat();
    const characterIds = [...new Set([...(e.characterIds ?? []), ...fighters])];
    return { ...e, characterIds, battle };
  });
}

/** Variante per gli index che assemblano il dataset in un solo oggetto. */
export function withBattles<T extends { events: TimelineEvent[] }>(dataset: T, outcomes: Record<string, BattleOutcome>): T {
  return { ...dataset, events: applyBattles(dataset.events, outcomes) };
}
