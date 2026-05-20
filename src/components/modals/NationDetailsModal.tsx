import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { CanonPill, ReferencePill } from '@/components/common/StatusPill';
import { useMapStore, useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { findLocation, findNation } from '@/lib/entities';

interface NationDetailsModalProps {
  dataset: WorldDataset;
  nationId: string;
}

export function NationDetailsModal({
  dataset,
  nationId,
}: NationDetailsModalProps) {
  const locale = useLocaleStore((s) => s.locale);
  const { t } = useTranslation();
  const nation = findNation(dataset, nationId);
  const close = useUiStore((s) => s.closeModal);
  const openLocation = useUiStore((s) => s.openLocationModal);
  const openBoundary = useUiStore((s) => s.openBoundaryModal);
  const openArc = useUiStore((s) => s.openArcModal);
  const openEvent = useUiStore((s) => s.openEventModal);
  const navigate = useNavigate();
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);

  if (!nation) {
    return (
      <Modal open onClose={close} title={t("modals.notFound")} size="sm">
        <p>{t("modals.invalidRef")}</p>
      </Modal>
    );
  }

  const boundary = nation.boundaryId
    ? dataset.boundaries?.find((b) => b.id === nation.boundaryId)
    : undefined;
  const hiddenVillages = (nation.hiddenVillageIds ?? [])
    .map((id) => findLocation(dataset, id))
    .filter((l): l is NonNullable<typeof l> => !!l);
  const otherLocations = dataset.locations.filter(
    (l) => l.nationId === nation.id && !(nation.hiddenVillageIds ?? []).includes(l.id),
  );
  const arcs = (nation.relatedArcIds ?? [])
    .map((id) => dataset.arcs.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => !!a);
  const events = dataset.events.filter((e) => {
    if ((nation.relatedEventIds ?? []).includes(e.id)) return true;
    if (e.locationId) {
      const loc = findLocation(dataset, e.locationId);
      return loc?.nationId === nation.id;
    }
    return false;
  });

  return (
    <Modal
      open
      onClose={close}
      eyebrow={`${t('modals.nation')} · ${nation.type?.replace('_', ' ') ?? ''}`}
      title={getLocalizedText(nation.localizedName, locale) || nation.name}
      badges={
        <>
          {nation.canonStatus && <CanonPill canon={nation.canonStatus} />}
          {nation.referenceStatus && (
            <ReferencePill status={nation.referenceStatus} />
          )}
          {nation.japaneseName && (
            <Badge className="font-mono">{nation.japaneseName}</Badge>
          )}
        </>
      }
      footer={
        <>
          {boundary && (
            <Button
              variant="ghost"
              onClick={() => openBoundary(boundary.id)}
            >
              {t("modals.seeBoundary")}
            </Button>
          )}
          {hiddenVillages[0] && (
            <Button
              variant="ghost"
              onClick={() => {
                setActiveMapLevel(hiddenVillages[0].mapLevelId);
                navigate(`/worlds/${dataset.world.slug}`);
                close();
              }}
            >
              {t("modals.openOnMap")}
            </Button>
          )}
          <Button variant="primary" onClick={close}>
            {t("modals.close")}
          </Button>
        </>
      }
    >
      {nation.nameLocal && (
        <p className="text-xs text-ink-300 italic -mt-2">{nation.nameLocal}</p>
      )}
      <p className="leading-relaxed">
        {getLocalizedText(nation.description, locale)}
      </p>
      {nation.descriptionLong && (
        <p className="text-ink-300 leading-relaxed">
          {getLocalizedText(nation.descriptionLong, locale)}
        </p>
      )}

      {hiddenVillages.length > 0 && (
        <Section title={t("modals.hiddenVillages")}>
          <div className="flex flex-wrap gap-1.5">
            {hiddenVillages.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => openLocation(l.id)}
                className="chip-accent hover:border-chakra-300 hover:text-white"
              >
                ⛩ {l.name}
              </button>
            ))}
          </div>
        </Section>
      )}

      {otherLocations.length > 0 && (
        <Section title={t("modals.specialPlaces")}>
          <div className="flex flex-wrap gap-1.5">
            {otherLocations.map((l) => (
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

      {arcs.length > 0 && (
        <Section title={t("modals.relatedArcs")}>
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
        <Section title={t('modals.eventsInNation', { count: events.length })}>
          <ul className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-auto pr-1">
            {events.slice(0, 12).map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => openEvent(e.id)}
                  className="text-left w-full panel-soft p-2 hover:border-chakra-500/60"
                >
                  <p className="text-ink-100 text-xs">
                    {getLocalizedText(e.title, locale)}
                  </p>
                  <p className="text-[10px] text-ink-400 mt-0.5">
                    #{e.order} · {getLocalizedText(e.period, locale)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {nation.tags && nation.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {nation.tags.map((t) => (
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
