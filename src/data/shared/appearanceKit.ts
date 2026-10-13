import type { Character, CharacterAppearance, PortraitFace } from '@/types';

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
    /**
     * Ritratto dettagliato in una riga: `d(capelli, modello, abito, coloreAbito, 'forma occhi sopracciglia bocca [naso]', resto)`.
     * Il volto usa `fc`; `resto` aggiunge occhi, pelle, segni, colori secondari o sagome dei capelli.
     */
    d: (
      hair: string | undefined,
      hairStyle: CharacterAppearance['hairStyle'],
      clothes: string,
      outfit: string,
      face: string,
      rest: Omit<CharacterAppearance, 'hair' | 'hairStyle' | 'clothes' | 'outfit' | 'face'> & { faceExtra?: Partial<PortraitFace> } = {},
    ): CharacterAppearance => {
      const { faceExtra, ...others } = rest;
      return { ...(hair ? { hair } : {}), hairStyle, clothes, outfit, face: fc(face, faceExtra), ...others };
    },
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

/**
 * Volto in breve per i ritratti dettagliati: `"forma occhi sopracciglia bocca [naso]"`,
 * es. `fc('male round thick grin')`. Vedi `PortraitFace` per i valori.
 */
export function fc(spec: string, extra: Partial<PortraitFace> = {}): PortraitFace {
  const [shape, eyes, brows, mouth, nose] = spec.trim().split(/\s+/);
  return { shape, eyes, brows, mouth, ...(nose ? { nose } : {}), ...extra };
}
