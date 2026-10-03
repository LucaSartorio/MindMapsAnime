import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type {
  Character,
  Faction,
  Jutsu,
  Localizable,
  Location,
  Nation,
  Route,
  StoryArc,
  WorldDataset,
} from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import {
  getCanonStatusLabel,
  getCharacterStatusLabel,
  getEntityDisplayName,
  getLocalizedText,
  getLocationTypeLabel,
  getRaceLabel,
  getTransformationKindLabel,
} from '@/utils/localization';
import {
  getAbilityAttribute,
  getAbilityCategoryLabel,
  getAbilityTerm,
  getCharacterRankSystem,
  getFactionsTerm,
  getRoleLabel,
  humanizeId,
} from '@/lib/worldConfig';
import {
  buildWorldGraph,
  characterConnections,
  getGraphContextForEntity,
  relatedPlaceIds,
  type EntityRef,
  type RelKind,
} from '@/lib/graph';
import { EntityImage } from '@/components/common/EntityImage';
import type { EntityImageKind } from '@/utils/entityImage';
import { CATEGORY_ENTITY_TYPE, seoLocations, type SeoCategory } from '@/seo/categories';
import { getSeoEntity, seoEntityName, type ResolvedPage } from '@/seo/metadata';
import { categoryPath, entityPath, mapDeepLink } from '@/seo/paths';
import { eventPath, refPath, sortedEvents } from '@/seo/links';
import { markerEventsAt, presentMapMarkers } from '@/lib/mapMarkers';
import { TournamentView } from '@/components/tournaments/TournamentView';
import { tournamentsAt } from '@/lib/tournaments';
import { FactList, MapCta, PageShell, RefLinks, Section, SourceNote } from './parts';

const MAP_KIND = {
  characters: 'character',
  locations: 'location',
  factions: 'faction',
  arcs: 'arc',
  journeys: 'route',
  abilities: 'jutsu',
  regions: 'nation',
} as const;

const IMAGE_KIND: Partial<Record<SeoCategory, EntityImageKind>> = {
  characters: 'character',
  locations: 'location',
  factions: 'clan',
  arcs: 'arc',
  abilities: 'jutsu',
};

const REL_LIMIT = 80;

/**
 * Pagina di un'entità (`/{lang}/{world}/{category}/{slug}`): la versione
 * "a pagina intera", indicizzabile, della scheda che nell'app si apre sopra la
 * mappa. Mostra SOLO dati del dataset; ogni relazione del knowledge graph è un
 * link reale verso la pagina dell'entità collegata, e il CTA porta alla mappa
 * interattiva con la scheda già aperta.
 */
export function EntityPage({
  resolved,
  dataset,
  category,
  id,
}: {
  resolved: ResolvedPage;
  dataset: WorldDataset;
  category: SeoCategory;
  id: string;
}) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const lang = resolved.lang;
  const entity = getSeoEntity(dataset, category, id)!;
  const world = dataset.world;
  const worldTitle = getLocalizedText(world.title, locale);
  const name = seoEntityName(dataset, category, id, locale);
  const graph = buildWorldGraph(dataset);
  const ctx = getGraphContextForEntity(graph, { type: CATEGORY_ENTITY_TYPE[category], id });
  const text = (v: Localizable | undefined) => getLocalizedText(v, locale);
  const factionsTerm = getFactionsTerm(world, locale, t('nav.clansFactions'));
  const abilityTerm = getAbilityTerm(world, locale);
  const link = (cat: SeoCategory, targetId?: string) =>
    targetId ? entityPath(lang, dataset, cat, targetId) : undefined;
  const named = (cat: SeoCategory, targetId?: string): ReactNode => {
    if (!targetId) return undefined;
    const href = link(cat, targetId);
    const label = seoEntityName(dataset, cat, targetId, locale);
    return href ? (
      <Link to={href} className="text-chakra-300 hover:underline">
        {label}
      </Link>
    ) : undefined;
  };

  const e = entity as {
    shortDescription?: Localizable;
    description?: Localizable;
    longDescription?: Localizable;
    japaneseName?: string;
    nameLocal?: string;
    referenceStatus?: string;
  };
  const summary = text(e.shortDescription ?? e.description);
  const long = text(e.longDescription);
  const typeLabel = {
    characters: t('modals.character'),
    locations: t('modals.location'),
    factions: factionsTerm,
    arcs: t('modals.storyArc'),
    journeys: t('modals.route'),
    abilities: abilityTerm,
    regions: t('modals.nation'),
  }[category];

  const pluralLabel = {
    characters: t('nav.characters'),
    locations: t('nav.locations'),
    factions: factionsTerm,
    arcs: t('nav.arcs'),
    journeys: t('nav.journeys'),
    abilities: abilityTerm,
    regions: t('nav.regions'),
  }[category];

  const facts: { label: string; value: ReactNode }[] = [];
  const sections: ReactNode[] = [];
  const addRefs = (key: string, title: string, refs: EntityRef[]) => {
    const withPages = refs.filter((r) => refPath(lang, dataset, r));
    if (withPages.length === 0) return;
    sections.push(
      <Section key={key} id={key} title={title} count={withPages.length}>
        <RefLinks dataset={dataset} lang={lang} refs={withPages} limit={REL_LIMIT} />
      </Section>,
    );
  };
  const idRefs = (type: EntityRef['type'], ids?: string[]) => (ids ?? []).map((x) => ({ type, id: x }));
  const eventsSection = (key: string, title: string, ids: string[]) => {
    const order = new Map(sortedEvents(dataset).map((ev, i) => [ev.id, i]));
    const list = ids
      .map((x) => dataset.events.find((ev) => ev.id === x))
      .filter((ev): ev is NonNullable<typeof ev> => !!ev)
      .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    if (list.length === 0) return;
    sections.push(
      <Section key={key} id={key} title={title} count={list.length}>
        <ol className="space-y-2 text-sm">
          {list.slice(0, REL_LIMIT).map((ev) => (
            <li key={ev.id} className="panel-soft p-3">
              <Link to={eventPath(lang, dataset, ev.id)!} className="font-medium text-ink-100 hover:text-chakra-300 hover:underline">
                {text(ev.title)}
              </Link>
              <span className="block text-xs text-ink-400 mt-0.5">{text(ev.period)}</span>
              <span className="block text-ink-300 mt-1 leading-relaxed">{text(ev.description)}</span>
            </li>
          ))}
        </ol>
      </Section>,
    );
  };

  switch (category) {
    case 'characters': {
      const c = entity as Character;
      const rankSystem = getCharacterRankSystem(world, locale);
      facts.push(
        { label: t('seoPages.fact.status'), value: getCharacterStatusLabel(c.status, locale) },
        { label: t('modals.race'), value: c.race ? getRaceLabel(c.race, locale) || humanizeId(c.race) : undefined },
        {
          label: rankSystem?.term ?? t('seoPages.fact.rank'),
          value: c.ninjaRank && rankSystem ? rankSystem.label(c.ninjaRank) : c.rank,
        },
        { label: t('seoPages.fact.roles'), value: c.role?.map((r) => getRoleLabel(world, r, locale)).join(', ') },
        { label: t('seoPages.fact.home'), value: named('locations', c.villageLocationId) },
        { label: t('nav.regions'), value: named('regions', c.nationId) },
        {
          label: t('seoPages.fact.abilityCategory'),
          value: c.abilityCategory ? getAbilityCategoryLabel(world, c.abilityCategory, locale) : undefined,
        },
        { label: t('seoPages.fact.aliases'), value: c.aliases?.join(', ') },
        { label: t('seoPages.fact.firstManga'), value: c.firstMangaAppearance },
        { label: t('seoPages.fact.firstAnime'), value: c.firstAnimeAppearance },
      );
      // Legami personaggio↔personaggio, per tipo (famiglia, maestri, …).
      const byKind = new Map<RelKind, EntityRef[]>();
      for (const conn of characterConnections(graph, c.id)) {
        byKind.set(conn.kind, [...(byKind.get(conn.kind) ?? []), { type: 'character', id: conn.targetId }]);
      }
      if (byKind.size > 0) {
        sections.push(
          <Section key="relations" id="relations" title={t('modals.relationships')}>
            <dl className="space-y-3">
              {[...byKind].map(([kind, refs]) => (
                <div key={kind} className="space-y-1.5">
                  <dt className="text-xs uppercase tracking-wide text-ink-400">{t(`modals.relations.${kind}`)}</dt>
                  <dd>
                    <RefLinks dataset={dataset} lang={lang} refs={refs} limit={REL_LIMIT} />
                  </dd>
                </div>
              ))}
            </dl>
          </Section>,
        );
      }
      addRefs('factions', factionsTerm, ctx.factions);
      addRefs('places', t('modals.connectedPlaces'), ctx.places);
      addRefs('journeys', t('nav.journeys'), ctx.routes);
      addRefs('arcs', t('modals.relatedArcs'), ctx.arcs);
      addRefs('abilities', t('modals.relatedJutsu', { term: abilityTerm }), ctx.techniques);
      if (c.transformations?.length) {
        sections.push(
          <Section key="transformations" id="transformations" title={t('modals.transformations')} count={c.transformations.length}>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              {[...c.transformations].sort((a, b) => a.order - b.order).map((tr) => (
                <li key={tr.id} className="text-ink-200">
                  <span className="font-medium text-ink-100">{getEntityDisplayName(tr, locale)}</span>
                  {tr.kind && <span className="text-ink-400"> · {getTransformationKindLabel(tr.kind, locale)}</span>}
                  {tr.description && <span className="block text-ink-300 pl-5">{text(tr.description)}</span>}
                </li>
              ))}
            </ol>
          </Section>,
        );
      }
      if (c.bounties?.length) {
        sections.push(
          <Section key="bounties" id="bounties" title={t('modals.bounty')} count={c.bounties.length}>
            <ol className="space-y-1 text-sm text-ink-200">
              {c.bounties.map((b, i) => (
                <li key={i}>
                  ฿ {b.amount}
                  {b.note && <span className="text-ink-400"> — {text(b.note)}</span>}
                </li>
              ))}
            </ol>
          </Section>,
        );
      }
      if (c.trivia?.length) {
        sections.push(
          <Section key="trivia" id="trivia" title={t('modals.trivia')} count={c.trivia.length}>
            <ul className="list-disc list-inside space-y-1 text-sm text-ink-300">
              {c.trivia.map((tv, i) => (
                <li key={i}>{text(tv)}</li>
              ))}
            </ul>
          </Section>,
        );
      }
      break;
    }
    case 'locations': {
      const l = entity as Location;
      const level = dataset.mapLevels.find((m) => m.id === l.mapLevelId);
      const sub = l.subMapLevelId ? dataset.mapLevels.find((m) => m.id === l.subMapLevelId) : undefined;
      facts.push(
        { label: t('seoPages.fact.type'), value: getLocationTypeLabel(l.type, locale) || humanizeId(l.type) },
        { label: t('nav.regions'), value: named('regions', l.nationId) },
        { label: t('seoPages.fact.map'), value: level ? text(level.localizedName) || level.name : undefined },
        { label: t('seoPages.fact.submap'), value: sub ? text(sub.localizedName) || sub.name : undefined },
        { label: t('seoPages.fact.canon'), value: l.canonStatus ? getCanonStatusLabel(l.canonStatus, locale) : undefined },
        { label: t('modals.manga'), value: l.mangaChapters?.join(', ') },
        { label: t('modals.anime'), value: l.animeEpisodes?.join(', ') },
      );
      const hosted = tournamentsAt(dataset, l);
      if (hosted.length > 0) {
        sections.push(
          <Section key="tournaments" id="tournaments" title={t('tournaments.sectionTitle')} count={hosted.length}>
            <div className="space-y-6">
              {hosted.map((tn) => (
                <article key={tn.id} id={tn.id}>
                  <h3 className="mb-2 font-display text-lg text-ink-100">{text(tn.localizedName) || tn.name}</h3>
                  <TournamentView
                    dataset={dataset}
                    tournament={tn}
                    renderName={(cid, label) => {
                      const href = link('characters', cid);
                      return href ? (
                        <Link to={href} className="text-chakra-300 hover:underline">
                          {label}
                        </Link>
                      ) : (
                        label
                      );
                    }}
                  />
                </article>
              ))}
            </div>
          </Section>,
        );
      }
      for (const marker of presentMapMarkers(dataset)) {
        eventsSection(
          `marker-${marker.id}`,
          text(marker.sectionTitle),
          markerEventsAt(dataset, marker.id, l.id).map((ev) => ev.id),
        );
      }
      addRefs('characters', t('modals.relatedCharacters'), ctx.characters);
      addRefs('factions', factionsTerm, ctx.factions);
      addRefs('arcs', t('modals.relatedArcs'), ctx.arcs);
      addRefs('journeys', t('modals.routesPassingHere'), ctx.routes);
      eventsSection('events', t('modals.eventsHere'), ctx.events.map((r) => r.id));
      addRefs(
        'nearby',
        t('modals.connectedPlaces'),
        [...relatedPlaceIds(graph, l.id)].filter((x) => x !== l.id).map((x) => ({ type: 'place' as const, id: x })),
      );
      break;
    }
    case 'factions': {
      const f = entity as Faction;
      facts.push(
        { label: t('seoPages.fact.type'), value: humanizeId(String(f.type)) },
        { label: t('nav.regions'), value: named('regions', f.nationId) },
        { label: t('seoPages.fact.home'), value: named('locations', f.villageLocationId) },
        { label: t('modals.kekkeiGenkai'), value: f.kekkeiGenkai },
      );
      addRefs('leaders', t('seoPages.fact.leaders'), idRefs('character', f.leaderIds));
      addRefs('members', t('seoPages.fact.members'), ctx.characters.filter((r) => !f.leaderIds?.includes(r.id)));
      addRefs('places', t('modals.connectedPlaces'), ctx.places);
      addRefs('arcs', t('modals.relatedArcs'), ctx.arcs);
      addRefs('journeys', t('nav.journeys'), ctx.routes);
      addRefs('abilities', t('modals.relatedJutsu', { term: abilityTerm }), ctx.techniques);
      break;
    }
    case 'arcs': {
      const a = entity as StoryArc;
      const arcs = [...dataset.arcs].sort((x, y) => x.order - y.order);
      const i = arcs.findIndex((x) => x.id === a.id);
      facts.push(
        { label: t('seoPages.fact.arcOrder'), value: t('seoPages.arcOrder', { n: i + 1, total: arcs.length }) },
        { label: t('seoPages.fact.saga'), value: text(a.saga) },
        { label: t('seoPages.fact.period'), value: text(a.period) },
        { label: t('seoPages.fact.canon'), value: getCanonStatusLabel(a.canonStatus ?? a.canon, locale) },
        { label: t('modals.manga'), value: a.mangaChapters?.join(', ') },
        { label: t('modals.anime'), value: a.animeEpisodes?.join(', ') },
      );
      eventsSection('events', t('modals.arcEvents'), [...new Set([...(a.eventIds ?? []), ...ctx.events.map((r) => r.id)])]);
      addRefs('places', t('modals.relatedLocations'), ctx.places);
      addRefs('characters', t('modals.relatedCharacters'), ctx.characters);
      addRefs('factions', factionsTerm, ctx.factions);
      addRefs('journeys', t('nav.journeys'), ctx.routes);
      const prev = arcs[i - 1];
      const next = arcs[i + 1];
      if (prev || next) {
        sections.push(
          <nav key="arc-nav" aria-label={t('nav.arcs')} className="flex flex-wrap justify-between gap-3 text-sm">
            {prev ? (
              <Link to={link('arcs', prev.id)!} className="btn-ghost inline-flex">
                ← {t('seoPages.prevArc')}: {getEntityDisplayName(prev, locale)}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link to={link('arcs', next.id)!} className="btn-ghost inline-flex">
                {t('seoPages.nextArc')}: {getEntityDisplayName(next, locale)} →
              </Link>
            )}
          </nav>,
        );
      }
      break;
    }
    case 'journeys': {
      const r = entity as Route;
      const places = new Map(dataset.locations.map((l) => [l.id, l]));
      const withPage = new Set(seoLocations(dataset).map((l) => l.id));
      facts.push(
        { label: t('modals.protagonists'), value: joinLinks(r.protagonistCharacterIds.map((x) => named('characters', x))) },
        { label: t('modals.mainArc'), value: named('arcs', r.arcId) },
        { label: t('seoPages.fact.steps'), value: r.steps.length },
      );
      sections.push(
        <Section key="steps" id="steps" title={t('modals.stepsOrder')} count={r.steps.length}>
          <ol className="space-y-2">
            {[...r.steps].sort((a, b) => a.order - b.order).map((s) => {
              const loc = places.get(s.locationId);
              const title = text(s.title ?? s.label) || getEntityDisplayName(loc, locale);
              return (
                <li key={`${s.order}-${s.locationId}`} className="panel-soft p-3 flex gap-3">
                  <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-chakra-500/20 text-xs text-chakra-100">
                    {s.order}
                  </span>
                  <div className="min-w-0 text-sm space-y-0.5">
                    <p className="font-medium text-ink-100">
                      <span className="sr-only">{t('seoPages.step', { n: s.order })}: </span>
                      {title}
                    </p>
                    {loc && withPage.has(loc.id) && (
                      <p>
                        <Link to={link('locations', loc.id)!} className="text-chakra-300 hover:underline">
                          {getEntityDisplayName(loc, locale)}
                        </Link>
                        {s.approximateTimeLabel && <span className="text-ink-400"> · {text(s.approximateTimeLabel)}</span>}
                      </p>
                    )}
                    {s.description && <p className="text-ink-300 leading-relaxed">{text(s.description)}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </Section>,
      );
      addRefs('characters', t('modals.relatedCharacters'), ctx.characters);
      addRefs('arcs', t('modals.arcsInvolved'), ctx.arcs);
      addRefs('factions', factionsTerm, ctx.factions);
      break;
    }
    case 'abilities': {
      const j = entity as Jutsu;
      const attribute = getAbilityAttribute(world, locale);
      facts.push(
        { label: t('modals.category'), value: getAbilityCategoryLabel(world, String(j.type), locale) },
        {
          label: attribute?.term ?? '',
          value: attribute && j.chakraNature?.length ? j.chakraNature.map((n) => attribute.label(n)).join(', ') : undefined,
        },
        { label: t('seoPages.fact.rank'), value: j.rank },
        { label: t('modals.classification'), value: j.classification?.map((c) => humanizeId(String(c))).join(', ') },
      );
      addRefs('users', t('modals.usedBy'), ctx.characters);
      addRefs('factions', factionsTerm, ctx.factions);
      break;
    }
    case 'regions': {
      const n = entity as Nation;
      const inRegion = seoLocations(dataset).filter((l) => l.nationId === n.id);
      facts.push(
        { label: t('seoPages.fact.capital'), value: named('locations', n.capitalLocationId) },
        { label: t('nav.locations'), value: inRegion.length || undefined },
      );
      addRefs('places', t('nav.locations'), [
        ...inRegion.map((l) => ({ type: 'place' as const, id: l.id })),
        ...ctx.places.filter((r) => !inRegion.some((l) => l.id === r.id)),
      ]);
      addRefs('factions', factionsTerm, ctx.factions);
      addRefs('characters', t('modals.relatedCharacters'), ctx.characters);
      addRefs('arcs', t('modals.relatedArcs'), ctx.arcs);
      break;
    }
  }

  const imageKind = IMAGE_KIND[category];
  const subtitle = [e.japaneseName, e.nameLocal].filter(Boolean).join(' · ');

  return (
    <PageShell
      resolved={resolved}
      eyebrow={`${worldTitle} · ${typeLabel}`}
      title={name}
      subtitle={subtitle || undefined}
      lead={
        <>
          {summary && <p>{summary}</p>}
          {long && long !== summary && <p className="text-ink-300">{long}</p>}
        </>
      }
      actions={
        <>
          <MapCta
            to={mapDeepLink(lang, dataset, MAP_KIND[category], id)}
            label={category === 'journeys' ? t('seoPages.followOnMap') : t('seoPages.exploreOnMap')}
          />
          <Link to={categoryPath(lang, dataset, category)} className="btn-ghost inline-flex">
            {t('seoPages.allOf', { label: pluralLabel })}
          </Link>
        </>
      }
      media={
        imageKind ? (
          <div className="relative aspect-square w-40 md:w-56 overflow-hidden rounded-xl border border-ink-700/60 bg-ink-900 shadow-md">
            <EntityImage
              kind={imageKind}
              id={id}
              name={name}
              villageId={category === 'characters' ? (entity as Character).villageLocationId : undefined}
              locationType={category === 'locations' ? (entity as Location).type : undefined}
              chakraNature={category === 'abilities' ? (entity as Jutsu).chakraNature?.[0] : undefined}
              fit="cover"
            />
          </div>
        ) : undefined
      }
    >
      <FactList items={facts.filter((f) => f.label)} />
      {e.referenceStatus === 'needs_verification' && (
        <p className="text-xs text-yellow-300/80">{t('modals.needsVerification')}</p>
      )}
      {sections}
      <SourceNote dataset={dataset} />
    </PageShell>
  );
}

function joinLinks(nodes: ReactNode[]): ReactNode {
  const list = nodes.filter(Boolean);
  if (list.length === 0) return undefined;
  return list.map((n, i) => (
    <span key={i}>
      {i > 0 && ', '}
      {n}
    </span>
  ));
}
