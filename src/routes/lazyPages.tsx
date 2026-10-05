import { lazyWithPreload } from '@/lib/lazyWithPreload';
import { parseSeoPath } from '@/seo/paths';
import { ensureWorldTranslation, loadWorldDataset } from '@/data/registry';
import type { SupportedLocale } from '@/types/i18n';
import { useWorldStore } from '@/store/useWorldStore';

/**
 * Tutti i chunk lazy delle rotte, in un unico posto: così `src/main.tsx`
 * (idratazione) e `src/entry-server.tsx` (pre-rendering) possono precaricare
 * esattamente ciò che serve alla rotta corrente prima del primo render.
 *
 *  - `WorldRoute` e tutto il layout-mondo (drawer, modali, timeline) stanno
 *    fuori dal bundle iniziale: la homepage non li scarica.
 *  - La mappa (React Flow) è un chunk a sé, caricato solo sulla rotta /map.
 */
export const WorldRoute = lazyWithPreload(() =>
  import('./WorldRoute').then((m) => m.WorldRoute),
);
export const InteractiveMapView = lazyWithPreload(() =>
  import('@/pages/WorldMapPage').then((m) => m.WorldMapPage),
);
export const CharactersPage = lazyWithPreload(() =>
  import('@/components/archive/CharactersPage').then((m) => m.CharactersPage),
);
export const ClansAndFactionsPage = lazyWithPreload(() =>
  import('@/components/archive/ClansAndFactionsPage').then((m) => m.ClansAndFactionsPage),
);
export const StoryArcsPage = lazyWithPreload(() =>
  import('@/components/archive/StoryArcsPage').then((m) => m.StoryArcsPage),
);
export const JutsuPage = lazyWithPreload(() =>
  import('@/components/archive/JutsuPage').then((m) => m.JutsuPage),
);
/** Pagine SEO (landing, entità, directory, timeline): un solo chunk condiviso. */
export const SeoPages = lazyWithPreload(() =>
  import('@/pages/seo/SeoPageSwitch').then((m) => m.SeoPageSwitch),
);

const WORLD_PAGE_CHUNKS = [CharactersPage, ClansAndFactionsPage, StoryArcsPage, JutsuPage, SeoPages];

/**
 * Precarica chunk + dataset della rotta `pathname` (primo render client).
 * Non precarica la mappa interattiva: sulla rotta /map il primo render mostra
 * l'anteprima statica pre-renderizzata e React Flow arriva subito dopo.
 */
export async function preloadRoute(pathname: string, locale?: SupportedLocale): Promise<void> {
  const parsed = parseSeoPath(pathname);
  if (parsed.kind === 'unknown' || parsed.kind === 'home' || parsed.kind === 'static') return;
  const tasks: Promise<unknown>[] = [WorldRoute.preload()];
  const world = parsed.world;
  if (world.status === 'available') {
    tasks.push(
      loadWorldDataset(world.slug).then((dataset) => {
        // Stesso stato che `WorldLayout` imposterà: il primo render client
        // coincide con l'HTML statico (TopNav del mondo, placeholder a tema).
        if (dataset) useWorldStore.setState({ worldSlug: world.slug, dataset });
      }),
    );
    // Overlay di traduzione della lingua del primo render (es): il primo render
    // client deve già mostrare i testi tradotti dell'HTML statico.
    if (locale) tasks.push(ensureWorldTranslation(world.slug, locale));
    if (parsed.kind === 'category') {
      const archive: Record<string, { preload: () => Promise<void> }> = {
        characters: CharactersPage,
        factions: ClansAndFactionsPage,
        arcs: StoryArcsPage,
        abilities: JutsuPage,
      };
      const chunk = archive[parsed.category] ?? SeoPages;
      tasks.push(chunk.preload());
    } else {
      tasks.push(SeoPages.preload());
    }
  }
  await Promise.all(tasks.map((t) => t.catch(() => undefined)));
}

/** Pre-rendering: tutto caricato una volta sola. */
export async function preloadAll(): Promise<void> {
  await Promise.all([WorldRoute.preload(), ...WORLD_PAGE_CHUNKS.map((c) => c.preload())]);
}
