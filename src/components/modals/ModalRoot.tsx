import type { WorldDataset } from '@/types';
import { useUiStore } from '@/store';
import { LocationDetailsModal } from './LocationDetailsModal';
import { CharacterDetailsModal } from './CharacterDetailsModal';
import { TimelineEventDetailsModal } from './TimelineEventDetailsModal';
import { StoryArcDetailsModal } from './StoryArcDetailsModal';
import { FactionDetailsModal } from './FactionDetailsModal';
import { RouteDetailsModal } from './RouteDetailsModal';
import { BoundaryDetailsModal } from './BoundaryDetailsModal';
import { NationDetailsModal } from './NationDetailsModal';
import { JutsuDetailsModal } from './JutsuDetailsModal';
import { RelationsGraphModal } from './RelationsGraphModal';

interface ModalRootProps {
  dataset: WorldDataset;
}

/**
 * Dispatcher unico delle modali. Una sola modale per volta:
 * il tipo è derivato da useUiStore.activeModal.
 */
export function ModalRoot({ dataset }: ModalRootProps) {
  const activeModal = useUiStore((s) => s.activeModal);
  if (!activeModal) return null;

  switch (activeModal.kind) {
    case 'location':
      return (
        <LocationDetailsModal dataset={dataset} locationId={activeModal.id} />
      );
    case 'character':
      return (
        <CharacterDetailsModal dataset={dataset} characterId={activeModal.id} />
      );
    case 'event':
      return (
        <TimelineEventDetailsModal dataset={dataset} eventId={activeModal.id} />
      );
    case 'arc':
      return <StoryArcDetailsModal dataset={dataset} arcId={activeModal.id} />;
    case 'faction':
      return (
        <FactionDetailsModal dataset={dataset} factionId={activeModal.id} />
      );
    case 'route':
      return <RouteDetailsModal dataset={dataset} routeId={activeModal.id} />;
    case 'boundary':
      return (
        <BoundaryDetailsModal dataset={dataset} boundaryId={activeModal.id} />
      );
    case 'nation':
      return <NationDetailsModal dataset={dataset} nationId={activeModal.id} />;
    case 'jutsu':
      return <JutsuDetailsModal dataset={dataset} jutsuId={activeModal.id} />;
    case 'relations':
      return (
        <RelationsGraphModal dataset={dataset} characterId={activeModal.id} />
      );
    default:
      return null;
  }
}
