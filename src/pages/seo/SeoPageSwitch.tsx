import type { ResolvedPage } from '@/seo/metadata';
import { WorldLandingPage } from './WorldLandingPage';
import { MapPage } from './MapPage';
import { DirectoryPage } from './DirectoryPage';
import { TimelinePage } from './TimelinePage';
import { EntityPage } from './EntityPage';

/**
 * Smista una pagina di mondo già risolta (`resolveSeoPath`) sul suo template.
 * Gli indici "archivio" (personaggi, fazioni, archi, tecniche) restano le
 * pagine interattive esistenti e sono montati direttamente da `WorldRoute`.
 */
export function SeoPageSwitch({ resolved }: { resolved: ResolvedPage }) {
  const p = resolved.page;
  switch (p.kind) {
    case 'world':
      return p.dataset ? <WorldLandingPage resolved={resolved} dataset={p.dataset} /> : null;
    case 'map':
      return <MapPage resolved={resolved} dataset={p.dataset} />;
    case 'timeline':
      return <TimelinePage resolved={resolved} dataset={p.dataset} />;
    case 'category':
      if (p.category === 'locations' || p.category === 'journeys' || p.category === 'regions') {
        return <DirectoryPage resolved={resolved} dataset={p.dataset} category={p.category} />;
      }
      return null;
    case 'entity':
      return <EntityPage resolved={resolved} dataset={p.dataset} category={p.category} id={p.id} />;
    default:
      return null;
  }
}
