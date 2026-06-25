import type {
  ChakraNature,
  Character,
  WorldDataset,
} from '@/types';

/**
 * Restituisce le nature del chakra di un personaggio.
 *
 * Priorità:
 *  1. `character.chakraNatures` esplicito (canon dal databook);
 *  2. unione delle `chakraNature` di tutti i jutsu che il personaggio usa
 *     (o di cui è in `characterIds`).
 *
 * Deduplica e mantiene un ordine stabile.
 */
export function getCharacterChakraNatures(
  character: Character,
  dataset: WorldDataset,
): ChakraNature[] {
  if (character.chakraNatures && character.chakraNatures.length > 0) {
    return character.chakraNatures;
  }
  const set = new Set<ChakraNature>();
  const charJutsuIds = new Set(character.jutsuIds ?? []);
  for (const j of dataset.jutsu ?? []) {
    const usedByThis =
      charJutsuIds.has(j.id) ||
      (j.characterIds ?? []).includes(character.id);
    if (!usedByThis) continue;
    for (const n of j.chakraNature ?? []) set.add(n as ChakraNature);
  }
  return Array.from(set);
}
