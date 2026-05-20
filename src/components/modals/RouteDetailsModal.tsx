import { useNavigate } from 'react-router-dom';
import type { WorldDataset } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ReferencePill } from '@/components/common/StatusPill';
import { useMapStore, useUiStore } from '@/store';
import { findArc, findCharacter, findLocation, findRoute } from '@/lib/entities';

interface RouteDetailsModalProps {
  dataset: WorldDataset;
  routeId: string;
}

export function RouteDetailsModal({
  dataset,
  routeId,
}: RouteDetailsModalProps) {
  const route = findRoute(dataset, routeId);
  const close = useUiStore((s) => s.closeModal);
  const openLocation = useUiStore((s) => s.openLocationModal);
  const openCharacter = useUiStore((s) => s.openCharacterModal);
  const openArc = useUiStore((s) => s.openArcModal);
  const openEvent = useUiStore((s) => s.openEventModal);
  const setSelectedRoute = useMapStore((s) => s.setSelectedRoute);
  const navigate = useNavigate();

  if (!route) {
    return (
      <Modal open onClose={close} title="Percorso non trovato" size="sm">
        <p>Riferimento non valido.</p>
      </Modal>
    );
  }

  const protagonists = route.protagonistCharacterIds
    .map((id) => findCharacter(dataset, id))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const arc = findArc(dataset, route.arcId);
  const steps = [...route.steps].sort((a, b) => a.order - b.order);

  return (
    <Modal
      open
      onClose={close}
      eyebrow="Percorso narrativo"
      title={route.name}
      badges={
        <>
          <Badge>{steps.length} step</Badge>
          {arc && <Badge variant="accent">{arc.name}</Badge>}
          {route.referenceStatus && (
            <ReferencePill status={route.referenceStatus} />
          )}
        </>
      }
      footer={
        <>
          <Button
            variant="ember"
            onClick={() => {
              setSelectedRoute(route.id);
              navigate(`/worlds/${dataset.world.slug}`);
              close();
            }}
          >
            Mostra sulla mappa
          </Button>
          <Button variant="primary" onClick={close}>
            Chiudi
          </Button>
        </>
      }
    >
      <p className="leading-relaxed">{route.description}</p>

      {protagonists.length > 0 && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            Protagonisti
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {protagonists.map((c) => (
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

      {arc && (
        <button
          type="button"
          onClick={() => openArc(arc.id)}
          className="panel-soft p-3 w-full text-left hover:border-chakra-500/60"
        >
          <p className="text-[10px] uppercase tracking-widest text-chakra-300 font-mono">
            Arco principale
          </p>
          <p className="text-ink-100 mt-0.5">{arc.name}</p>
        </button>
      )}

      <section>
        <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
          Ordine degli step
        </h3>
        <ol className="space-y-1.5">
          {steps.map((s) => {
            const loc = findLocation(dataset, s.locationId);
            const ev = s.eventId
              ? dataset.events.find((e) => e.id === s.eventId)
              : undefined;
            return (
              <li
                key={s.order}
                className="panel-soft px-3 py-2 flex items-center gap-2"
              >
                <Badge>#{s.order}</Badge>
                <div className="flex-1 min-w-0">
                  {loc ? (
                    <button
                      type="button"
                      onClick={() => openLocation(loc.id)}
                      className="text-left text-ink-100 hover:text-chakra-200 truncate block"
                    >
                      {s.label ?? loc.name}
                    </button>
                  ) : (
                    <span className="text-ink-100 truncate">
                      {s.label ?? 'Luogo sconosciuto'}
                    </span>
                  )}
                  {s.notes && (
                    <p className="text-[11px] text-ink-400">{s.notes}</p>
                  )}
                </div>
                {ev && (
                  <button
                    type="button"
                    onClick={() => openEvent(ev.id)}
                    className="chip text-[10px] hover:border-chakra-500/70 hover:text-white"
                  >
                    evento
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </Modal>
  );
}
