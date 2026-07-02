import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Tabs, type TabItem } from '@/components/common/Tabs';
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
import { getLocalizedText, getLocationTypeLabel } from '@/utils/localization';
import type { PoneglyphKind } from '@/types';

const PONEGLYPH_KIND_LABEL: Record<PoneglyphKind, { it: string; en: string }> = {
  road: { it: 'Road Poneglyph', en: 'Road Poneglyph' },
  information: { it: 'Poneglyph informativo', en: 'Information Poneglyph' },
  rio: { it: 'Rio Poneglyph', en: 'Rio Poneglyph' },
};

interface LocationDetailsModalProps {
  dataset: WorldDataset;
  locationId: string;
}

/** Modale dettaglio di un luogo: la principale interazione mappa→info. A tab. */
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
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);
  const setTimeline = useUiStore((s) => s.setTimeline);

  // La scheda è ancorata a lato: sincronizziamo la selezione così la mappa
  // dietro centra/evidenzia il luogo (anche se aperto da un cross-link).
  useEffect(() => {
    if (location) setSelectedLocation(location.id);
  }, [location, setSelectedLocation]);
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
      <Modal open onClose={close} title={t('modals.notFound')} size="sm">
        <p>{t('modals.invalidRef')}</p>
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
  const locName = getLocalizedText(location.localizedName, locale) || location.name;

  const overviewTab = (
    <>
      {location.nameLocal && (
        <p className="-mt-1 text-xs italic text-ink-300">{location.nameLocal}</p>
      )}
      <p className="leading-relaxed">
        {getLocalizedText(location.shortDescription, locale)}
      </p>
      {location.longDescription && (
        <p className="leading-relaxed text-ink-300">
          {getLocalizedText(location.longDescription, locale)}
        </p>
      )}

      {location.poneglyph && (
        <div className="rounded-md border border-red-600/50 bg-red-950/30 px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-red-200">
            <span aria-hidden>◈</span>
            {PONEGLYPH_KIND_LABEL[location.poneglyph.kind][locale === 'en' ? 'en' : 'it']}
          </div>
          {location.poneglyph.note && (
            <p className="mt-1 text-sm leading-relaxed text-red-100/90">
              {getLocalizedText(location.poneglyph.note, locale)}
            </p>
          )}
          {location.poneglyph.inscription && (
            <div className="mt-2 border-l-2 border-red-500/60 pl-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-red-300/90">
                {t('modals.poneglyphMeaning')}
              </p>
              <p className="mt-0.5 text-sm italic leading-relaxed text-red-100">
                {getLocalizedText(location.poneglyph.inscription, locale)}
              </p>
            </div>
          )}
        </div>
      )}

      {!isVerified && (
        <div className="rounded-md border border-yellow-700/40 bg-yellow-900/20 px-3 py-2 text-xs text-yellow-200">
          {t('modals.unverifiedNote')}
        </div>
      )}

      {(location.mangaChapters?.length || location.animeEpisodes?.length) && (
        <Section title={t('modals.references')}>
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

      {arcs.length > 0 && (
        <Section title={t('modals.relatedArcs')}>
          <ul className="space-y-1.5">
            {arcs.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => openArc(a.id)}
                  className="inline-flex items-center gap-2 text-left text-ink-100 hover:text-chakra-200"
                >
                  <span className="text-ember-400">◆</span>
                  {a.name}
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );

  const eventsTab = (
    <ul className="grid gap-2 sm:grid-cols-2">
      {events.map((e) => (
        <li key={e.id}>
          <button
            type="button"
            onClick={() => openEvent(e.id)}
            className="panel-soft w-full p-3 text-left transition hover:border-chakra-500/60"
          >
            <p className="text-sm text-ink-100">{getLocalizedText(e.title, locale)}</p>
            <p className="mt-0.5 text-[11px] text-ink-400">
              #{e.order} · {getLocalizedText(e.period, locale)}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );

  const peopleTab = (
    <>
      {characters.length > 0 && (
        <Section title={t('modals.relatedCharacters')}>
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
        <Section title={t('modals.relatedClans')}>
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
    </>
  );

  const routesTab = (
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
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: r.color ?? '#1f9aff' }}
          />
          {r.name}
        </button>
      ))}
    </div>
  );

  const galleryTab = (
    <>
      <div className="grid grid-cols-3 gap-2">
        {(() => {
          const assets = (location.assetIds ?? [])
            .map((id) => dataset.assets.find((a) => a.id === id))
            .filter((a): a is NonNullable<typeof a> => !!a);
          const slots = assets.length > 0 ? assets : [null, null, null];
          return slots.map((a, i) => {
            const entityId = i === 0 ? location.id : `${location.id}-${i + 1}`;
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
                className="aspect-square w-full overflow-hidden rounded-lg border border-ink-600/60 transition hover:border-chakra-500/70 focus:outline-none focus:ring-2 focus:ring-chakra-500/60"
              >
                {a?.url ? (
                  <img
                    src={a.url}
                    alt={a.name}
                    loading="lazy"
                    className="block h-full w-full object-cover"
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
      <p className="mt-1.5 text-[10px] text-ink-400">{t('modals.galleryNote')}</p>
    </>
  );

  // Solo i tab con contenuto (la Panoramica e la Galleria sono sempre presenti).
  const tabs: TabItem[] = [
    { id: 'overview', label: t('modals.tabOverview'), content: overviewTab },
    ...(events.length > 0
      ? [{ id: 'events', label: t('modals.tabEvents'), badge: events.length, content: eventsTab }]
      : []),
    ...(characters.length > 0 || factions.length > 0
      ? [{
          id: 'people',
          label: t('modals.tabCharacters'),
          badge: characters.length + factions.length,
          content: peopleTab,
        }]
      : []),
    ...(routes.length > 0
      ? [{ id: 'routes', label: t('modals.tabRoutes'), badge: routes.length, content: routesTab }]
      : []),
    { id: 'gallery', label: t('modals.tabGallery'), content: galleryTab },
  ];

  return (
    <Modal
      open
      onClose={close}
      media={
        <EntityImage
          kind="location"
          id={location.id}
          name={locName}
          villageId={location.id}
          locationType={location.type}
          fit="cover"
        />
      }
      eyebrow={
        <>
          {t('modals.location')} · {getLocationTypeLabel(location.type, locale)}
        </>
      }
      title={locName}
      badges={
        <>
          {nation && (
            <Badge variant="accent">
              {getLocalizedText(nation.localizedName, locale) || nation.name}
            </Badge>
          )}
          <Badge
            variant={location.importance === 'main' ? 'ember' : 'default'}
            className="capitalize"
          >
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
              {t('modals.showTimeline')}
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
              {t('modals.showRoute')}
            </Button>
          )}
          <Button variant="primary" onClick={close}>
            {t('modals.close')}
          </Button>
        </>
      }
    >
      <Tabs items={tabs} ariaLabel={t('modals.tabsAria')} />

      <ImageLightbox
        open={lightbox !== null}
        onClose={() => setLightbox(null)}
        label={lightbox?.name}
      >
        {lightbox?.url ? (
          <img
            src={lightbox.url}
            alt={lightbox.name}
            className="block h-full w-full object-cover"
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
      <h3 className="mb-2 font-display text-[11px] uppercase tracking-widest text-chakra-300">
        {title}
      </h3>
      {children}
    </section>
  );
}
