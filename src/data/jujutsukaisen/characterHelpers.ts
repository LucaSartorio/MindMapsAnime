import type { Character, CharacterTransformation, Localizable } from '@/types';

/** Default comuni ai personaggi di Jujutsu Kaisen (canon e verificati salvo override). */
export const ch = (c: Omit<Character, 'worldId'>): Character => ({
  worldId: 'world-jujutsukaisen',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...c,
});

/** Una forma o uno stato (il vero corpo di Sukuna, il risveglio di Maki…) nelle «Trasformazioni». */
export const form = (
  id: string,
  order: number,
  name: string,
  kind: CharacterTransformation['kind'],
  description: Localizable,
  arcId?: string,
  localizedName?: Localizable,
): CharacterTransformation => ({ id, order, name, kind, description, arcId, localizedName });
