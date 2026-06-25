import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { WorldDataset } from '@/types';
import { useUiStore, type ActiveModal } from '@/store/useUiStore';

/**
 * Sincronizza la modale attiva con i query param dell'URL, in entrambe le
 * direzioni, così ogni entità è deep-linkabile e condivisibile:
 *   /worlds/naruto?character=char-naruto
 *
 * - URL → store: all'apertura del link (o col tasto "indietro") apre/chiude la
 *   modale corrispondente, validando che l'id esista nel dataset attivo.
 * - store → URL: aprendo/chiudendo una modale aggiorna l'URL con `replace`
 *   (niente voce extra nella cronologia per ogni click).
 *
 * Non renderizza nulla. Va montato dentro un mondo risolto (ha il dataset).
 */
type ModalKind = NonNullable<ActiveModal>['kind'];

// Il nome del query param coincide con il tipo di entità (leggibile e univoco:
// una sola modale per volta ⇒ un solo param presente).
const KINDS: ModalKind[] = [
  'location',
  'character',
  'event',
  'arc',
  'faction',
  'route',
  'boundary',
  'nation',
  'jutsu',
];

function entityExists(
  dataset: WorldDataset,
  kind: ModalKind,
  id: string,
): boolean {
  switch (kind) {
    case 'location':
      return dataset.locations.some((x) => x.id === id);
    case 'character':
      return dataset.characters.some((x) => x.id === id);
    case 'event':
      return dataset.events.some((x) => x.id === id);
    case 'arc':
      return dataset.arcs.some((x) => x.id === id);
    case 'faction':
      return dataset.factions.some((x) => x.id === id);
    case 'route':
      return dataset.routes.some((x) => x.id === id);
    case 'boundary':
      return (dataset.boundaries ?? []).some((x) => x.id === id);
    case 'nation':
      return dataset.nations.some((x) => x.id === id);
    case 'jutsu':
      return (dataset.jutsu ?? []).some((x) => x.id === id);
    default:
      return false;
  }
}

function openModal(kind: ModalKind, id: string): void {
  const s = useUiStore.getState();
  switch (kind) {
    case 'location':
      return s.openLocationModal(id);
    case 'character':
      return s.openCharacterModal(id);
    case 'event':
      return s.openEventModal(id);
    case 'arc':
      return s.openArcModal(id);
    case 'faction':
      return s.openFactionModal(id);
    case 'route':
      return s.openRouteModal(id);
    case 'boundary':
      return s.openBoundaryModal(id);
    case 'nation':
      return s.openNationModal(id);
    case 'jutsu':
      return s.openJutsuModal(id);
  }
}

interface ModalDeepLinkProps {
  dataset: WorldDataset;
}

export function ModalDeepLink({ dataset }: ModalDeepLinkProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModal = useUiStore((s) => s.activeModal);
  const skipNextUrlWrite = useRef(true);

  // URL → store
  useEffect(() => {
    let desired: ActiveModal = null;
    for (const kind of KINDS) {
      const id = searchParams.get(kind);
      if (id) {
        desired = { kind, id } as ActiveModal;
        break;
      }
    }

    const store = useUiStore.getState();

    if (desired) {
      if (!entityExists(dataset, desired.kind, desired.id)) {
        // id inesistente (typo, entità rimossa, mondo diverso): pulisci l'URL.
        const next = new URLSearchParams(searchParams);
        next.delete(desired.kind);
        setSearchParams(next, { replace: true });
        if (store.activeModal) store.closeModal();
        return;
      }
      const cur = store.activeModal;
      if (!cur || cur.kind !== desired.kind || cur.id !== desired.id) {
        openModal(desired.kind, desired.id);
      }
    } else if (store.activeModal) {
      store.closeModal();
    }
  }, [searchParams, dataset, setSearchParams]);

  // store → URL (salta il primo run per non sovrascrivere il param iniziale)
  useEffect(() => {
    if (skipNextUrlWrite.current) {
      skipNextUrlWrite.current = false;
      return;
    }
    const next = new URLSearchParams(searchParams);
    for (const kind of KINDS) next.delete(kind);
    if (activeModal) next.set(activeModal.kind, activeModal.id);
    setSearchParams(next, { replace: true });
    // searchParams volutamente escluso dalle deps: reagiamo solo al cambio di
    // modale; l'URL viene riallineato qui in modo idempotente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModal]);

  return null;
}
