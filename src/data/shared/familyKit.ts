import type { Character } from '@/types';

/**
 * Legami di parentela per l'albero genealogico, scritti a parte e applicati ai
 * personaggi dall'index del mondo. Basta un lato: i figli, i fratelli e il
 * coniuge "inverso" sono ricavati da `src/lib/familyTree.ts`.
 */
export interface FamilyLinks {
  parents?: string[];
  spouses?: string[];
}

export function familyKit(prefix: string) {
  const id = (x: string) => (x.startsWith('char-') ? x : prefix + x);
  return {
    /** `p(['genitore1', 'genitore2'], ['coniuge'])` */
    p: (parents: string[], spouses?: string[]): FamilyLinks => ({
      parents: parents.map(id),
      ...(spouses ? { spouses: spouses.map(id) } : {}),
    }),
    /** Solo coniuge. */
    s: (...spouses: string[]): FamilyLinks => ({ spouses: spouses.map(id) }),
    key: id,
  };
}

export function applyFamily(characters: Character[], links: Record<string, FamilyLinks>, prefix: string): Character[] {
  const byId = new Map(Object.entries(links).map(([k, v]) => [k.startsWith('char-') ? k : prefix + k, v]));
  const missing = [...byId.keys()].filter((k) => !characters.some((c) => c.id === k));
  if (missing.length) throw new Error(`family: personaggi inesistenti ${missing.join(', ')}`);
  return characters.map((c) => {
    const l = byId.get(c.id);
    if (!l) return c;
    return {
      ...c,
      parents: [...new Set([...(c.parents ?? []), ...(l.parents ?? [])])],
      spouses: [...new Set([...(c.spouses ?? []), ...(l.spouses ?? [])])],
    };
  });
}

export function withFamily<T extends { characters: Character[] }>(dataset: T, links: Record<string, FamilyLinks>, prefix: string): T {
  return { ...dataset, characters: applyFamily(dataset.characters, links, prefix) };
}
