import { useEffect, useLayoutEffect, useState } from 'react';

/**
 * `false` durante il pre-rendering e il PRIMO render client (idratazione),
 * `true` subito dopo e in tutte le navigazioni successive.
 *
 * Usalo per ciò che dipende da stato solo-browser (localStorage, consenso
 * cookie, onboarding, la mappa React Flow): così l'HTML statico e il primo
 * render client coincidono e l'idratazione non va in mismatch.
 */
let hydrated = false;

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useHydrated(): boolean {
  const [isHydrated, setHydrated] = useState(hydrated);
  useEffect(() => {
    hydrated = true;
    setHydrated(true);
  }, []);
  return isHydrated;
}
