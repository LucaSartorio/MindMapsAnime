import { useNavigate } from 'react-router-dom';
import type { WorldDataset } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { CanonPill, ReferencePill } from '@/components/common/StatusPill';
import { useMapStore, useUiStore } from '@/store';
import {
  findArc,
  findCharacter,
  findEvent,
  findFaction,
  findLocation,
} from '@/lib/entities';

interface TimelineEventDetailsModalProps {
  dataset: WorldDataset;
  eventId: string;
}

export function TimelineEventDetailsModal({
  dataset,
  eventId,
}: TimelineEventDetailsModalProps) {
  const event = findEvent(dataset, eventId);
  const close = useUiStore((s) => s.closeModal);
  const openLocation = useUiStore((s) => s.openLocationModal);
  const openCharacter = useUiStore((s) => s.openCharacterModal);
  const openArc = useUiStore((s) => s.openArcModal);
  const openFaction = useUiStore((s) => s.openFactionModal);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);
  const navigate = useNavigate();

  if (!event) {
    return (
      <Modal open onClose={close} title="Evento non trovato" size="sm">
        <p>Riferimento non valido.</p>
      </Modal>
    );
  }

  const arc = findArc(dataset, event.arcId);
  const location = findLocation(dataset, event.locationId);
  const characters = (event.characterIds ?? [])
    .map((id) => findCharacter(dataset, id))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const factions = (event.factionIds ?? [])
    .map((id) => findFaction(dataset, id))
    .filter((f): f is NonNullable<typeof f> => !!f);

  const hasReferences =
    (event.mangaChapters?.length ?? 0) > 0 ||
    (event.animeEpisodes?.length ?? 0) > 0;
  const isVerified = event.referenceStatus === 'verified';

  return (
    <Modal
      open
      onClose={close}
      eyebrow={`Evento · ${event.period}`}
      title={event.title}
      badges={
        <>
          <Badge>#{event.order}</Badge>
          <CanonPill canon={event.canon} />
          <ReferencePill status={event.referenceStatus} />
        </>
      }
      footer={
        <>
          {location && (
            <Button
              variant="ghost"
              onClick={() => {
                setActiveMapLevel(location.mapLevelId);
                setSelectedLocation(location.id);
                navigate(`/worlds/${dataset.world.slug}`);
                close();
              }}
            >
              Centra sulla mappa
            </Button>
          )}
          <Button variant="primary" onClick={close}>
            Chiudi
          </Button>
        </>
      }
    >
      <p className="leading-relaxed">{event.description}</p>

      {!isVerified && (
        <div className="rounded-md border border-yellow-700/40 bg-yellow-900/20 px-3 py-2 text-xs text-yellow-200">
          Dato da verificare. Capitoli/episodi non confermati.
        </div>
      )}

      {arc && (
        <button
          type="button"
          onClick={() => openArc(arc.id)}
          className="panel-soft p-3 w-full text-left hover:border-chakra-500/60"
        >
          <p className="text-[10px] uppercase tracking-widest text-chakra-300 font-mono">
            Arco narrativo
          </p>
          <p className="text-ink-100 mt-0.5">{arc.name}</p>
        </button>
      )}

      {location && (
        <button
          type="button"
          onClick={() => openLocation(location.id)}
          className="panel-soft p-3 w-full text-left hover:border-chakra-500/60"
        >
          <p className="text-[10px] uppercase tracking-widest text-chakra-300 font-mono">
            Luogo
          </p>
          <p className="text-ink-100 mt-0.5">{location.name}</p>
        </button>
      )}

      {hasReferences && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            Riferimenti
          </h3>
          {event.mangaChapters?.length ? (
            <p className="text-ink-300">
              <strong>Manga:</strong> {event.mangaChapters.join(', ')}
            </p>
          ) : null}
          {event.animeEpisodes?.length ? (
            <p className="text-ink-300">
              <strong>Anime:</strong> {event.animeEpisodes.join(', ')}
            </p>
          ) : null}
        </section>
      )}

      {characters.length > 0 && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            Personaggi coinvolti
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {characters.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => openCharacter(c.id)}
                className="chip hover:border-chakra-500/70 hover:text-white"
              >
                {c.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {factions.length > 0 && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            Clan / Fazioni
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {factions.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => openFaction(f.id)}
                className="chip-accent hover:border-chakra-300 hover:text-white"
              >
                {f.name}
              </button>
            ))}
          </div>
        </section>
      )}
    </Modal>
  );
}
