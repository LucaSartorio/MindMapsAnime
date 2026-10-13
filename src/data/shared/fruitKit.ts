import type { FruitLook, Jutsu } from '@/types';

/**
 * Aspetto illustrato delle abilità-frutto (scritto a parte, applicato dall'index
 * del mondo come `familyKit`). Le chiavi sono id completi; un id inesistente è un errore.
 */
export function withFruitLooks<T extends { jutsu?: Jutsu[] }>(dataset: T, looks: Record<string, FruitLook>): T {
  const ids = new Set((dataset.jutsu ?? []).map((j) => j.id));
  const missing = Object.keys(looks).filter((k) => !ids.has(k));
  if (missing.length) throw new Error(`fruit looks: abilità inesistenti ${missing.join(', ')}`);
  return {
    ...dataset,
    jutsu: dataset.jutsu?.map((j) => (looks[j.id] ? { ...j, fruit: looks[j.id] } : j)),
  };
}
