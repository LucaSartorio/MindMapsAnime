import type { WorldDataset } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { CanonPill, ReferencePill } from '@/components/common/StatusPill';
import { useUiStore } from '@/store';
import { findArc, findCharacter, findLocation } from '@/lib/entities';

interface StoryArcDetailsModalProps {
  dataset: WorldDataset;
  arcId: string;
}

export function StoryArcDetailsModal({
  dataset,
  arcId,
}: StoryArcDetailsModalProps) {
  const arc = findArc(dataset, arcId);
  const close = useUiStore((s) => s.closeModal);
  const openLocation = useUiStore((s) => s.openLocationModal);
  const openCharacter = useUiStore((s) => s.openCharacterModal);
  const openEvent = useUiStore((s) => s.openEventModal);

  if (!arc) {
    return (
      <Modal open onClose={close} title="Arco non trovato" size="sm">
        <p>Riferimento non valido.</p>
      </Modal>
    );
  }

  const locations = (arc.locationIds ?? [])
    .map((id) => findLocation(dataset, id))
    .filter((l): l is NonNullable<typeof l> => !!l);
  const characters = (arc.characterIds ?? [])
    .map((id) => findCharacter(dataset, id))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const events = dataset.events
    .filter((e) => e.arcId === arc.id)
    .sort((a, b) => a.order - b.order);

  return (
    <Modal
      open
      onClose={close}
      eyebrow={arc.saga ? `Arco · ${arc.saga}` : 'Arco narrativo'}
      title={arc.name}
      badges={
        <>
          <Badge>#{arc.order}</Badge>
          <CanonPill canon={arc.canon} />
          {arc.referenceStatus && <ReferencePill status={arc.referenceStatus} />}
          <Badge>{events.length} eventi</Badge>
        </>
      }
      footer={
        <Button variant="primary" onClick={close}>
          Chiudi
        </Button>
      }
    >
      <p className="leading-relaxed">{arc.description}</p>

      {(arc.mangaChapters?.length || arc.animeEpisodes?.length) ? (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            Riferimenti
          </h3>
          {arc.mangaChapters?.length ? (
            <p className="text-ink-300">
              <strong>Manga:</strong> {arc.mangaChapters.join(', ')}
            </p>
          ) : null}
          {arc.animeEpisodes?.length ? (
            <p className="text-ink-300">
              <strong>Anime:</strong> {arc.animeEpisodes.join(', ')}
            </p>
          ) : null}
        </section>
      ) : (
        arc.referenceStatus !== 'verified' && (
          <div className="rounded-md border border-yellow-700/40 bg-yellow-900/20 px-3 py-2 text-xs text-yellow-200">
            Capitoli/episodi non confermati. Da verificare prima della
            pubblicazione.
          </div>
        )
      )}

      {locations.length > 0 && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            Luoghi coinvolti
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {locations.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => openLocation(l.id)}
                className="chip hover:border-chakra-500/70 hover:text-white"
              >
                {l.name}
              </button>
            ))}
          </div>
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

      {events.length > 0 && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            Eventi dell'arco
          </h3>
          <ol className="space-y-1.5">
            {events.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => openEvent(e.id)}
                  className="text-left w-full panel-soft px-3 py-2 hover:border-chakra-500/60 flex items-center gap-2"
                >
                  <Badge>#{e.order}</Badge>
                  <span className="text-ink-100 text-sm flex-1 truncate">
                    {e.title}
                  </span>
                  <span className="text-[11px] text-ink-400">{e.period}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
    </Modal>
  );
}
