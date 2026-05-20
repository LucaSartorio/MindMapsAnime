import { useNavigate } from 'react-router-dom';
import type { WorldDataset } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { CanonPill, ReferencePill } from '@/components/common/StatusPill';
import { useMapStore, useUiStore } from '@/store';
import { findCharacter, findNation } from '@/lib/entities';

interface BoundaryDetailsModalProps {
  dataset: WorldDataset;
  boundaryId: string;
}

export function BoundaryDetailsModal({
  dataset,
  boundaryId,
}: BoundaryDetailsModalProps) {
  const boundary = (dataset.boundaries ?? []).find((b) => b.id === boundaryId);
  const close = useUiStore((s) => s.closeModal);
  const openLocation = useUiStore((s) => s.openLocationModal);
  const openCharacter = useUiStore((s) => s.openCharacterModal);
  const openArc = useUiStore((s) => s.openArcModal);
  const openEvent = useUiStore((s) => s.openEventModal);
  const openRoute = useUiStore((s) => s.openRouteModal);
  const openNation = useUiStore((s) => s.openNationModal);
  const navigate = useNavigate();
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);

  if (!boundary) {
    return (
      <Modal open onClose={close} title="Regione non trovata" size="sm">
        <p>Riferimento non valido.</p>
      </Modal>
    );
  }

  const nation = findNation(dataset, boundary.nationId);
  const locations = dataset.locations.filter(
    (l) =>
      l.boundaryId === boundary.id ||
      (boundary.nationId && l.nationId === boundary.nationId),
  );
  const villages = locations.filter((l) => l.type === 'village');
  const specialPlaces = locations.filter((l) => l.type !== 'village');
  const arcs = (boundary.relatedArcIds ?? [])
    .map((id) => dataset.arcs.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => !!a);
  const events = dataset.events.filter(
    (e) =>
      (boundary.relatedEventIds ?? []).includes(e.id) ||
      (e.locationId !== undefined &&
        locations.some((l) => l.id === e.locationId)),
  );
  const routes = dataset.routes.filter((r) =>
    r.steps.some((s) => locations.some((l) => l.id === s.locationId)),
  );
  const characters = (boundary.relatedCharacterIds ?? [])
    .map((id) => findCharacter(dataset, id))
    .filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <Modal
      open
      onClose={close}
      eyebrow={`Regione · ${boundary.type.replace('_', ' ')}`}
      title={boundary.name}
      badges={
        <>
          <CanonPill canon={boundary.canonStatus} />
          <ReferencePill status={boundary.referenceStatus} />
          {nation && (
            <button
              type="button"
              onClick={() => openNation(nation.id)}
              className="chip-accent hover:border-chakra-300 hover:text-white"
            >
              {nation.name}
            </button>
          )}
        </>
      }
      footer={
        <>
          {boundary.mapLevelId && (
            <Button
              variant="ghost"
              onClick={() => {
                setActiveMapLevel(boundary.mapLevelId);
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
      {boundary.japaneseName && (
        <p className="text-xs text-ink-300 italic -mt-2">
          {boundary.japaneseName}
        </p>
      )}
      <p className="leading-relaxed">{boundary.descriptionShort}</p>
      {boundary.descriptionLong && (
        <p className="text-ink-300 leading-relaxed">
          {boundary.descriptionLong}
        </p>
      )}

      {boundary.referenceStatus !== 'verified' && (
        <div className="rounded-md border border-yellow-700/40 bg-yellow-900/20 px-3 py-2 text-xs text-yellow-200">
          Dato da verificare: confine indicativo, da rifinire su fonti
          ufficiali.
        </div>
      )}

      {villages.length > 0 && (
        <Section title="Villaggi presenti">
          <div className="flex flex-wrap gap-1.5">
            {villages.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => openLocation(l.id)}
                className="chip hover:border-chakra-500/70 hover:text-white"
              >
                ⛩ {l.name}
              </button>
            ))}
          </div>
        </Section>
      )}

      {specialPlaces.length > 0 && (
        <Section title="Luoghi importanti">
          <div className="flex flex-wrap gap-1.5">
            {specialPlaces.map((l) => (
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
        </Section>
      )}

      {characters.length > 0 && (
        <Section title="Personaggi collegati">
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
        </Section>
      )}

      {arcs.length > 0 && (
        <Section title="Archi narrativi">
          <ul className="space-y-1.5">
            {arcs.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => openArc(a.id)}
                  className="text-left text-ink-100 hover:text-chakra-200 inline-flex items-center gap-2"
                >
                  <span className="text-ember-400">◆</span>
                  {a.name}
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {events.length > 0 && (
        <Section title={`Eventi nel territorio (${events.length})`}>
          <ul className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-auto pr-1">
            {events.slice(0, 12).map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => openEvent(e.id)}
                  className="text-left w-full panel-soft p-2 hover:border-chakra-500/60"
                >
                  <p className="text-ink-100 text-xs">{e.title}</p>
                  <p className="text-[10px] text-ink-400 mt-0.5">
                    #{e.order} · {e.period}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {routes.length > 0 && (
        <Section title="Percorsi che attraversano">
          <div className="flex flex-wrap gap-1.5">
            {routes.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => openRoute(r.id)}
                className="chip hover:border-chakra-500/70 hover:text-white"
              >
                <span
                  aria-hidden
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: r.color ?? '#1f9aff' }}
                />
                {r.name}
              </button>
            ))}
          </div>
        </Section>
      )}

      {boundary.tags && boundary.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {boundary.tags.map((t) => (
            <Badge key={t}>#{t}</Badge>
          ))}
        </div>
      )}
    </Modal>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
        {title}
      </h3>
      {children}
    </section>
  );
}
