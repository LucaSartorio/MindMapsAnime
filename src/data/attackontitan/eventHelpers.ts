import type { TimelineEvent } from '@/types';

/** Default comuni agli eventi di Attack on Titan (canon e verificati salvo override). */
export const ev = (e: Omit<TimelineEvent, 'worldId' | 'canonStatus' | 'referenceStatus' | 'canon'> & Partial<Pick<TimelineEvent, 'canon' | 'referenceStatus'>>): TimelineEvent => {
  const canon = e.canon ?? 'canon';
  return {
    worldId: 'world-attackontitan',
    referenceStatus: 'verified',
    ...e,
    canon,
    canonStatus: canon,
  };
};
