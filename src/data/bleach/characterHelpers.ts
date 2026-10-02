import type { Character, CharacterTransformation, Localizable } from '@/types';

/** Default comuni ai personaggi di Bleach (canon e verificati salvo override). */
export const ch = (c: Omit<Character, 'worldId'>): Character => ({
  worldId: 'world-bleach',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...c,
});

/**
 * Stadio di rilascio di una spada (o forma di potere), mostrato nella sezione
 * «Trasformazioni & Power-up» della scheda personaggio. `name` è il nome
 * originale (Senbonzakura Kageyoshi…), sempre identico fra le lingue.
 */
export const stage = (
  id: string,
  order: number,
  name: string,
  kind: CharacterTransformation['kind'],
  description: Localizable,
  arcId?: string,
  canonStatus?: CharacterTransformation['canonStatus'],
): CharacterTransformation => ({ id, order, name, kind, description, arcId, canonStatus });
