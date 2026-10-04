import type { BattleOutcome, TimelineEvent, WorldDataset } from '@/types';

/**
 * Scontri con esito (`TimelineEvent.battle`). Per ogni personaggio: gli scontri
 * in cui combatte, da che parte, e com'è andata. Indice memoizzato per dataset.
 */
export type BattleResult = 'win' | 'loss' | 'draw' | 'interrupted';

export interface CharacterBattle {
  event: TimelineEvent;
  battle: BattleOutcome;
  result: BattleResult;
  allies: string[];
  opponents: string[];
}

const cache = new WeakMap<WorldDataset, Map<string, CharacterBattle[]>>();

function resultFor(b: BattleOutcome, side: number): BattleResult {
  if (b.winner !== undefined) return b.winner === side ? 'win' : 'loss';
  return b.result === 'interrupted' ? 'interrupted' : 'draw';
}

function index(dataset: WorldDataset): Map<string, CharacterBattle[]> {
  const hit = cache.get(dataset);
  if (hit) return hit;
  const out = new Map<string, CharacterBattle[]>();
  const events = [...dataset.events].filter((e) => e.battle).sort((a, b) => a.order - b.order);
  for (const event of events) {
    const battle = event.battle!;
    battle.sides.forEach((side, si) => {
      const opponents = battle.sides.filter((_, i) => i !== si).flat();
      for (const id of side) {
        const entry: CharacterBattle = {
          event,
          battle,
          result: resultFor(battle, si),
          allies: side.filter((x) => x !== id),
          opponents,
        };
        out.set(id, [...(out.get(id) ?? []), entry]);
      }
    });
  }
  cache.set(dataset, out);
  return out;
}

/** Gli scontri di un personaggio, in ordine cronologico. */
export function characterBattles(dataset: WorldDataset, characterId: string): CharacterBattle[] {
  return index(dataset).get(characterId) ?? [];
}

/** Bilancio: vittorie, sconfitte, pareggi/interrotti. */
export function battleRecord(list: CharacterBattle[]) {
  return {
    wins: list.filter((b) => b.result === 'win').length,
    losses: list.filter((b) => b.result === 'loss').length,
    draws: list.filter((b) => b.result === 'draw' || b.result === 'interrupted').length,
  };
}
