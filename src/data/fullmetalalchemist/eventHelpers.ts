import type { TimelineEvent } from '@/types';

/**
 * Default comuni agli eventi di Fullmetal Alchemist: canone del manga, `needs_verification` salvo
 * override esplicito (i capitoli sono ricavati da titoli e citazioni secondarie, non dal manga letto).
 * Il film «La Stella Sacra di Milos» usa `canon: 'movie'`.
 */
export const ev = (
  e: Omit<TimelineEvent, 'worldId' | 'canonStatus' | 'referenceStatus' | 'canon'> &
    Partial<Pick<TimelineEvent, 'canon' | 'referenceStatus'>>,
): TimelineEvent => {
  const canon = e.canon ?? 'canon';
  return {
    worldId: 'world-fullmetalalchemist',
    referenceStatus: 'needs_verification',
    ...e,
    canon,
    canonStatus: canon,
  };
};
