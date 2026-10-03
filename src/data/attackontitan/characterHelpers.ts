import type { Character, CharacterTransformation, Localizable } from '@/types';

/** Default comuni ai personaggi di Attack on Titan (canon e verificati salvo override). */
export const ch = (c: Omit<Character, 'worldId'>): Character => ({
  worldId: 'world-attackontitan',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...c,
});

/** Una forma di Gigante (o uno stato, come il risveglio Ackerman) nella sezione «Trasformazioni». */
export const form = (
  id: string,
  order: number,
  name: string,
  kind: CharacterTransformation['kind'],
  description: Localizable,
  arcId?: string,
  localizedName?: Localizable,
): CharacterTransformation => ({ id, order, name, kind, description, arcId, localizedName });
