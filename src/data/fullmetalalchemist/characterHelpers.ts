import type { Character } from '@/types';

/** Default comuni ai personaggi di Fullmetal Alchemist (canon del manga e verificati salvo override). */
export const ch = (c: Omit<Character, 'worldId'>): Character => ({
  worldId: 'world-fullmetalalchemist',
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...c,
});
