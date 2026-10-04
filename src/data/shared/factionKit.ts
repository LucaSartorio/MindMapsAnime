import type { Faction, FactionGroup, FactionMember, FactionSuccession, Localizable } from '@/types';

/**
 * Organigrammi e successioni delle fazioni, scritti a parte per id fazione e
 * applicati dall'index del mondo. `m('naruto', ruolo?)` = un personaggio del
 * dataset; `x('Reto')` = una persona senza scheda (solo il nome).
 */
export interface FactionExtras {
  structure?: FactionGroup[];
  succession?: FactionSuccession[];
}

export const L = (it: string, en: string = it): Localizable => ({ it, en });

export function factionKit(prefix: string) {
  return {
    m: (id: string, role?: Localizable): FactionMember => ({
      characterId: id.startsWith('char-') ? id : prefix + id,
      ...(role ? { role } : {}),
    }),
    x: (label: Localizable, role?: Localizable): FactionMember => ({ label, ...(role ? { role } : {}) }),
    g: (name: Localizable, members: FactionMember[], note?: Localizable): FactionGroup => ({
      name,
      members,
      ...(note ? { note } : {}),
    }),
    succ: (title: Localizable, holders: FactionMember[]): FactionSuccession => ({ title, holders }),
  };
}

export function withFactionExtras<T extends { factions: Faction[] }>(dataset: T, extras: Record<string, FactionExtras>): T {
  const missing = Object.keys(extras).filter((id) => !dataset.factions.some((f) => f.id === id));
  if (missing.length) throw new Error(`structure: fazioni inesistenti ${missing.join(', ')}`);
  return {
    ...dataset,
    factions: dataset.factions.map((f) => (extras[f.id] ? { ...f, ...extras[f.id] } : f)),
  };
}
