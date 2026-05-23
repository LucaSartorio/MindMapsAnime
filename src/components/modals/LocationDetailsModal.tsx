import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { EntityImage } from '@/components/common/EntityImage';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { ReferencePill } from '@/components/common/StatusPill';
import { useMapStore, useUiStore } from '@/store';
import {
  findCharacter,
  findFaction,
  findLocation,
  findNation,
} from '@/lib/entities';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';

interface LocationDetailsModalProps {
  dataset: WorldDataset;
  locationId: string;
}

/** Modale dettaglio di un luogo: la principale interazione mappa→info. */
export function LocationDetailsModal({
  dataset,
  locationId,
}: LocationDetailsModalProps) {
  const locale = useLocaleStore((s) => s.locale);
  const { t } = useTranslation();
  const location = findLocation(dataset, locationId);
  const close = useUiStore((s) => s.closeModal);
  const openCharacter = useUiStore((s) => s.openCharacterModal);
  const openFaction = useUiStore((s) => s.openFactionModal);
  const openArc = useUiStore((s) => s.openArcModal);
  const openEvent = useUiStore((s) => s.openEventModal);
  const openRoute = useUiStore((s) => s.openRouteModal);
  const setRoute = useMapStore((s) => s.setSelectedRoute);
  const setActiveMapLevel = useMapStore((s) => s.setActiveMapLevel);
  const setTimeline = useUiStore((s) => s.setTimeline);
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState<
    null | { url?: string; entityId?: string; name: string }
  >(null);
  const goToMap = () => navigate(`/worlds/${dataset.world.slug}`);

  const events = useMemo(
    () =>
      location
        ? dataset.events
            .filter((e) => e.locationId === location.id)
            .sort((a, b) => a.order - b.order)
        : [],
    [dataset.events, location],
  );
  const routes = useMemo(
    () =>
      location
        ? dataset.routes.filter((r) =>
            r.steps.some((s) => s.locationId === location.id),
          )
        : [],
    [dataset.routes, location],
  );

  if (!location) {
    return (
      <Modal open onClose={close} title={t("modals.notFound")} size="sm">
        <p>{t("modals.invalidRef")}</p>
      </Modal>
    );
  }

  const nation = findNation(dataset, location.nationId);
  const characters = (location.characterIds ?? [])
    .map((id) => findCharacter(dataset, id))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const factions = (location.clanIds ?? [])
    .map((id) => findFaction(dataset, id))
    .filter((f): f is NonNullable<typeof f> => !!f);
  const arcs = (location.arcIds ?? [])
    .map((id) => dataset.arcs.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => !!a);

  const isVerified = location.referenceStatus === 'verified';

  return (
    <Modal
      open
      onClose={close}
      media={
        <EntityImage
          kind="location"
          id={location.id}
          name={getLocalizedText(location.localizedName, locale) || location.name}
          villageId={location.id}
          locationType={location.type}
          fit="contain"
          className="absolute inset-0"
        />
      }
      eyebrow={
        <>
          Luogo · <span className="capitalize">{location.type.replace('_', ' ')}</span>
        </>
      }
      title={getLocalizedText(location.localizedName, locale) || location.name}
      badges={
        <>
          {nation && <Badge variant="accent">{getLocalizedText(nation.localizedName, locale) || nation.name}</Badge>}
          <Badge variant={location.importance === 'main' ? 'ember' : 'default'} className="capitalize">
            {location.importance}
          </Badge>
          {location.referenceStatus && (
            <ReferencePill status={location.referenceStatus} />
          )}
        </>
      }
      footer={
        <>
          {location.subMapLevelId && (
            <Button
              variant="ember"
              onClick={() => {
                setActiveMapLevel(location.subMapLevelId!);
                goToMap();
                close();
              }}
            >
              {t('modals.showSubmap')}
            </Button>
          )}
          {events.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => {
                setTimeline(true);
                goToMap();
                close();
              }}
            >
              {t("modals.showTimeline")}
            </Button>
          )}
          {routes.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => {
                setRoute(routes[0].id);
                goToMap();
                close();
              }}
            >
              {t("modals.showRoute")}
            </Button>
          )}
          <Button variant="primary" onClick={close}>
            {t("modals.close")}
          </Button>
        </>
      }
    >
      {location.nameLocal && (
        <p className="text-xs text-ink-300 italic -mt-2">{location.nameLocal}</p>
      )}
      <p className="leading-relaxed">
        {getLocalizedText(location.shortDescription, locale)}
      </p>
      {location.longDescription && (
        <p className="text-ink-300 leading-relaxed">
          {getLocalizedText(location.longDescription, locale)}
        </p>
      )}

      {!isVerified && (
        <div className="rounded-md border border-yellow-700/40 bg-yellow-900/20 px-3 py-2 text-xs text-yellow-200">
          Dato da verificare: riferimenti narrativi non ancora confermati su
          fonti ufficiali.
        </div>
      )}

      {(location.mangaChapters?.length || location.animeEpisodes?.length) && (
        <Section title={t("modals.references")}>
          {location.mangaChapters?.length ? (
            <p className="text-ink-300">
              <strong>Manga:</strong> {location.mangaChapters.join(', ')}
            </p>
          ) : null}
          {location.animeEpisodes?.length ? (
            <p className="text-ink-300">
              <strong>Anime:</strong> {location.animeEpisodes.join(', ')}
            </p>
          ) : null}
        </Section>
      )}

      {events.length > 0 && (
        <Section title={t("modals.eventsHere")}>
          <ul className="grid sm:grid-cols-2 gap-2">
            {events.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => openEvent(e.id)}
                  className="text-left w-full panel-soft p-3 hover:border-chakra-500/60 transition"
                >
                  <p className="text-ink-100 text-sm">
                    {getLocalizedText(e.title, locale)}
                  </p>
                  <p className="text-[11px] text-ink-400 mt-0.5">
                    #{e.order} · {getLocalizedText(e.period, locale)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {characters.length > 0 && (
        <Section title={t("modals.relatedCharacters")}>
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

      {factions.length > 0 && (
        <Section title={t("modals.relatedClans")}>
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

      {routes.length > 0 && (
        <Section title={t("modals.routesPassingHere")}>
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

      <Section title={t("modals.gallery")}>
        <div className="grid grid-cols-3 gap-2">
          {(() => {
            const assets = (location.assetIds ?? [])
              .map((id) => dataset.assets.find((a) => a.id === id))
              .filter((a): a is NonNullable<typeof a> => !!a);
            const slots = assets.length > 0 ? assets : [null, null, null];
            const locName =
              getLocalizedText(location.localizedName, locale) || location.name;
            return slots.map((a, i) => {
              const entityId =
                i === 0 ? location.id : `${location.id}-${i + 1}`;
              return (
                <button
                  key={a?.id ?? i}
                  type="button"
                  onClick={() =>
                    setLightbox(
                      a?.url
                        ? { url: a.url, name: a.name }
                        : { entityId, name: locName },
                    )
                  }
                  className="aspect-square w-full rounded-lg overflow-hidden border border-ink-600/60 hover:border-chakra-500/70 transition focus:outline-none focus:ring-2 focus:ring-chakra-500/60"
                >
                  {a?.url ? (
                    <img
                      src={a.url}
                      alt={a.name}
                      loading="lazy"
                      className="block w-full h-full object-cover"
                    />
                  ) : (
                    <EntityImage
                      kind="location"
                      id={entityId}
                      name={locName}
                      villageId={location.id}
                      locationType={location.type}
                    />
                  )}
                </button>
              );
            });
          })()}
        </div>
        <p className="text-[10px] text-ink-400 mt-1.5">
          {t('modals.galleryNote')}
        </p>
      </Section>

      <ImageLightbox
        open={lightbox !== null}
        onClose={() => setLightbox(null)}
        label={lightbox?.name}
      >
        {lightbox?.url ? (
          <img
            src={lightbox.url}
            alt={lightbox.name}
            className="block w-full h-full object-cover"
          />
        ) : lightbox?.entityId ? (
          <EntityImage
            kind="location"
            id={lightbox.entityId}
            name={lightbox.name}
            villageId={location.id}
            locationType={location.type}
          />
        ) : null}
      </ImageLightbox>
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
