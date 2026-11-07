import type { AnimeWorld } from '@/types';
import { animeWorlds } from '@/data/worlds';
import { hasWorldDataset } from '@/data/registry';

/**
 * Link interni fra mondi (SEO-05). Mondi con una mappa pubblicata:
 * `status: 'available'` E un dataset registrato — la stessa condizione con cui
 * `resolveSeoPath` fa esistere `/{lang}/{world}/map`. I mondi "in arrivo" non
 * hanno mappa e non vengono mai linkati. Ordine = quello del registro mondi.
 */
export function worldsWithMap(): AnimeWorld[] {
  return animeWorlds.filter((w) => w.status === 'available' && hasWorldDataset(w.slug));
}

/** Le mappe da proporre da una pagina del mondo `currentWorldId` (mai se stesso). */
export function otherWorldMaps(currentWorldId: string): AnimeWorld[] {
  return worldsWithMap().filter((w) => w.id !== currentWorldId);
}
