import type { Character, CharacterAppearance } from '@/types';

/**
 * Aspetto dei personaggi per i ritratti SVG, scritto a parte e applicato
 * dall'index del mondo (come `familyKit`). Le chiavi sono id senza prefisso.
 */
export function appearanceKit() {
  return {
    /** `a('black', 'spiky', { eyes: 'blue', marks: ['headband'] })` */
    a: (
      hair: string | undefined,
      hairStyle: CharacterAppearance['hairStyle'],
      rest: Omit<CharacterAppearance, 'hair' | 'hairStyle'> = {},
    ): CharacterAppearance => ({ ...(hair ? { hair } : {}), hairStyle, ...rest }),
  };
}

export function withAppearance<T extends { characters: Character[] }>(
  dataset: T,
  looks: Record<string, CharacterAppearance>,
  prefix: string,
): T {
  const byId = new Map(
    Object.entries(looks).map(([k, v]) => [k.startsWith('char-') ? k : prefix + k, v]),
  );
  const missing = [...byId.keys()].filter((k) => !dataset.characters.some((c) => c.id === k));
  if (missing.length) throw new Error(`appearance: personaggi inesistenti ${missing.join(', ')}`);
  return {
    ...dataset,
    characters: dataset.characters.map((c) => {
      const look = byId.get(c.id);
      return look ? { ...c, appearance: { ...c.appearance, ...look } } : c;
    }),
  };
}
