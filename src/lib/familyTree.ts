import type { Character, WorldDataset } from '@/types';

/**
 * Albero genealogico derivato da `Character.parents` e `Character.spouses`
 * (i figli, i fratelli e i coniugi "inversi" si ricavano: basta scrivere ogni
 * legame da un lato solo). Cinque generazioni attorno al personaggio: nonni,
 * genitori, fratelli + lui + coniugi, figli, nipoti.
 */
export interface FamilyTree {
  grandparents: string[];
  parents: string[];
  siblings: string[];
  self: string;
  spouses: string[];
  children: string[];
  grandchildren: string[];
}

interface Index {
  byId: Map<string, Character>;
  children: Map<string, string[]>;
  spouses: Map<string, Set<string>>;
}

const cache = new WeakMap<WorldDataset, Index>();

function index(dataset: WorldDataset): Index {
  const hit = cache.get(dataset);
  if (hit) return hit;
  const byId = new Map(dataset.characters.map((c) => [c.id, c]));
  const children = new Map<string, string[]>();
  const spouses = new Map<string, Set<string>>();
  const pair = (a: string, b: string) => {
    if (a === b || !byId.has(a) || !byId.has(b)) return;
    spouses.set(a, (spouses.get(a) ?? new Set()).add(b));
    spouses.set(b, (spouses.get(b) ?? new Set()).add(a));
  };
  for (const c of dataset.characters) {
    for (const p of c.parents ?? []) if (byId.has(p)) children.set(p, [...(children.get(p) ?? []), c.id]);
    for (const s of c.spouses ?? []) pair(c.id, s);
    // Due genitori dello stesso figlio sono una coppia.
    const ps = (c.parents ?? []).filter((p) => byId.has(p));
    if (ps.length === 2) pair(ps[0], ps[1]);
  }
  const idx = { byId, children, spouses };
  cache.set(dataset, idx);
  return idx;
}

const uniq = (ids: string[], exclude: Set<string>) => [...new Set(ids)].filter((id) => !exclude.has(id));

export function familyTree(dataset: WorldDataset, characterId: string): FamilyTree | null {
  const { byId, children, spouses } = index(dataset);
  const self = byId.get(characterId);
  if (!self) return null;
  const parentsOf = (id: string) => (byId.get(id)?.parents ?? []).filter((p) => byId.has(p));
  const childrenOf = (id: string) => children.get(id) ?? [];
  const seen = new Set([characterId]);
  const take = (ids: string[]) => {
    const out = uniq(ids, seen);
    out.forEach((id) => seen.add(id));
    return out;
  };
  const parents = take(parentsOf(characterId));
  const spouseList = take([...(spouses.get(characterId) ?? [])]);
  const kids = take(childrenOf(characterId));
  const siblings = take(parents.flatMap(childrenOf));
  const grandparents = take(parents.flatMap(parentsOf));
  const grandchildren = take(kids.flatMap(childrenOf));
  const tree = { grandparents, parents, siblings, self: characterId, spouses: spouseList, children: kids, grandchildren };
  const relatives = grandparents.length + parents.length + siblings.length + spouseList.length + kids.length + grandchildren.length;
  // Un albero con un solo parente non aggiunge nulla ai chip "Famiglia".
  return relatives >= 2 ? tree : null;
}

/** Vero se i due personaggi sono coniugi (dichiarati o genitori dello stesso figlio). */
export function areSpouses(dataset: WorldDataset, a: string, b: string): boolean {
  return index(dataset).spouses.get(a)?.has(b) ?? false;
}

/** Genitori noti di un personaggio. */
export function parentsOf(dataset: WorldDataset, id: string): string[] {
  const { byId } = index(dataset);
  return (byId.get(id)?.parents ?? []).filter((p) => byId.has(p));
}

/** Tutti i parenti noti (campo `family` + legami dell'albero), per i chip della scheda. */
export function familyIds(dataset: WorldDataset, c: Character): string[] {
  const tree = familyTree(dataset, c.id);
  const fromTree = tree
    ? [...tree.grandparents, ...tree.parents, ...tree.siblings, ...tree.spouses, ...tree.children, ...tree.grandchildren]
    : [...(c.parents ?? []), ...(c.spouses ?? [])];
  return [...new Set([...(c.family ?? []), ...fromTree])].filter((id) => id !== c.id);
}
