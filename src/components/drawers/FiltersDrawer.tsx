import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LocationType, Series, VisibleLayers, WorldDataset } from '@/types';
import { worldSeriesOptions } from '@/lib/series';
import {
  getFactionsTerm,
  getNationTerm,
  getPlacesTerm,
} from '@/lib/worldConfig';
import { presentLocationTypes } from '@/lib/locationTypes';
import { Drawer } from '@/components/common/Drawer';
import { Button } from '@/components/common/Button';
import { FilterSection } from '@/components/filters/FilterSection';
import { FilterChip } from '@/components/filters/FilterChip';
import { FilterSearchField } from '@/components/filters/FilterSearchField';
import { ToggleRow } from '@/components/filters/ToggleRow';
import { ActiveFilterBar } from '@/components/filters/ActiveFilterBar';
import { useFilteredLocations } from '@/lib/mapSelectors';
import { useMapStore, useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import {
  getEntityDisplayName,
  getLocalizedText,
  getLocationTypeLabel,
} from '@/utils/localization';

interface FiltersDrawerProps {
  dataset: WorldDataset;
}

/** Soglia oltre la quale una lista lunga riceve un campo di ricerca interno. */
const SEARCH_THRESHOLD = 12;

/**
 * Drawer filtri della mappa (redesign): ricerca globale, riepilogo dei filtri
 * attivi, sezioni collassabili con conteggio, conteggio risultati live.
 * IT/EN via i18n. Le associazioni con lo store sono invariate.
 */
export function FiltersDrawer({ dataset }: FiltersDrawerProps) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const open = useUiStore((s) => s.isFiltersDrawerOpen);
  const close = useUiStore((s) => s.closeFiltersDrawer);
  const filters = useMapStore((s) => s.filters);
  const setFilters = useMapStore((s) => s.setFilters);
  const resetFilters = useMapStore((s) => s.resetFilters);
  const visibleLayers = useMapStore((s) => s.visibleLayers);
  const setVisibleLayer = useMapStore((s) => s.setVisibleLayer);
  const resetLayers = useMapStore((s) => s.resetLayers);
  const resultCount = useFilteredLocations(dataset).length;

  // Ricerca interna alle liste lunghe.
  const [charQuery, setCharQuery] = useState('');
  const [factionQuery, setFactionQuery] = useState('');
  const [placeQuery, setPlaceQuery] = useState('');

  // Mount lazy: il contenuto (centinaia di chip) è renderizzato solo alla prima
  // apertura, poi resta montato (riaperture istantanee, animazione fluida).
  const everOpenedRef = useRef(false);
  if (open) everOpenedRef.current = true;

  function toggleLayer<K extends keyof VisibleLayers>(layer: K) {
    setVisibleLayer(layer, !visibleLayers[layer] as VisibleLayers[K]);
  }

  const hasBoundaries = (dataset.boundaries?.length ?? 0) > 0;
  const hasPoneglyphs = useMemo(
    () => dataset.locations.some((l) => l.poneglyph),
    [dataset.locations],
  );

  function toggleType(tp: LocationType) {
    setFilters({
      locationTypes: filters.locationTypes.includes(tp)
        ? filters.locationTypes.filter((x) => x !== tp)
        : [...filters.locationTypes, tp],
    });
  }
  function toggleNation(id: string) {
    setFilters({
      nationIds: filters.nationIds.includes(id)
        ? filters.nationIds.filter((x) => x !== id)
        : [...filters.nationIds, id],
    });
  }
  function toggleArc(id: string) {
    setFilters({
      arcIds: filters.arcIds.includes(id)
        ? filters.arcIds.filter((x) => x !== id)
        : [...filters.arcIds, id],
    });
  }
  function toggleCharacter(id: string) {
    setFilters({
      characterIds: filters.characterIds.includes(id)
        ? filters.characterIds.filter((x) => x !== id)
        : [...filters.characterIds, id],
    });
  }
  function toggleFaction(id: string) {
    setFilters({
      factionIds: filters.factionIds.includes(id)
        ? filters.factionIds.filter((x) => x !== id)
        : [...filters.factionIds, id],
    });
  }
  function toggleImportance(i: 'main' | 'secondary' | 'minor') {
    setFilters({
      importance: filters.importance.includes(i)
        ? filters.importance.filter((x) => x !== i)
        : [...filters.importance, i],
    });
  }
  function toggleSeries(s: Series) {
    setFilters({
      series: filters.series.includes(s)
        ? filters.series.filter((x) => x !== s)
        : [...filters.series, s],
    });
  }

  const locationTypes = useMemo(
    () => presentLocationTypes(dataset.locations),
    [dataset.locations],
  );

  const villages = useMemo(
    () =>
      dataset.locations
        .filter((l) => l.type === 'village')
        .sort((a, b) => a.name.localeCompare(b.name)),
    [dataset.locations],
  );

  const sortedArcs = useMemo(
    () => dataset.arcs.slice().sort((a, b) => a.order - b.order),
    [dataset.arcs],
  );

  const sortedCharacters = useMemo(
    () => dataset.characters.slice().sort((a, b) => a.name.localeCompare(b.name)),
    [dataset.characters],
  );

  const sortedFactions = useMemo(
    () =>
      dataset.factions
        .slice()
        .sort((a, b) =>
          (getEntityDisplayName(a, locale) || a.name).localeCompare(
            getEntityDisplayName(b, locale) || b.name,
          ),
        ),
    [dataset.factions, locale],
  );

  const filteredCharacters = useMemo(() => {
    const q = charQuery.trim().toLowerCase();
    if (!q) return sortedCharacters;
    return sortedCharacters.filter((c) =>
      (getEntityDisplayName(c, locale) || c.name).toLowerCase().includes(q),
    );
  }, [sortedCharacters, charQuery, locale]);

  const filteredFactions = useMemo(() => {
    const q = factionQuery.trim().toLowerCase();
    if (!q) return sortedFactions;
    return sortedFactions.filter((f) =>
      (getEntityDisplayName(f, locale) || f.name).toLowerCase().includes(q),
    );
  }, [sortedFactions, factionQuery, locale]);

  const filteredVillages = useMemo(() => {
    const q = placeQuery.trim().toLowerCase();
    if (!q) return villages;
    return villages.filter((v) =>
      (getLocalizedText(v.localizedName, locale) || v.name).toLowerCase().includes(q),
    );
  }, [villages, placeQuery, locale]);

  const seriesOptions = worldSeriesOptions(dataset.world);
  const nationTerm = getNationTerm(dataset.world, locale, t('filters.nation'));
  const placesTerm = getPlacesTerm(dataset.world, locale, t('filters.placesDefault'));
  const factionsTerm = getFactionsTerm(dataset.world, locale, t('filters.factions'));

  // Quante scelte di ciascuna sezione "villaggio" sono attive (i chip villaggio
  // filtrano per nazione del villaggio: coerente col comportamento storico).
  const activeVillageCount = villages.filter(
    (v) => v.nationId && filters.nationIds.includes(v.nationId),
  ).length;

  return (
    <Drawer
      open={open}
      side="left"
      onClose={close}
      ariaLabel={t('filters.title')}
      className="w-[92vw] sm:max-w-sm"
    >
      {everOpenedRef.current && (
        <div className="flex h-full flex-col">
          <header className="flex shrink-0 items-center justify-between gap-2 border-b border-ink-700/60 px-4 py-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-chakra-300">
                {dataset.world.title}
              </p>
              <h2 className="font-display text-base text-ink-100">
                {t('filters.title')}
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={t('filters.close')}
              className="grid h-9 w-9 place-items-center rounded-md text-ink-300 transition hover:bg-ink-800/70 hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          {/* Riepilogo filtri attivi + conteggio risultati */}
          <div className="shrink-0 border-b border-ink-700/40 px-4 py-3">
            <ActiveFilterBar dataset={dataset} variant="inline" />
          </div>

          <div className="flex-1 space-y-1 overflow-auto px-4 py-2 text-sm">
            {seriesOptions.length > 0 && (
              <FilterSection
                title={t('filters.series')}
                activeCount={filters.series.length}
                hint={t('filters.seriesHint')}
              >
                <div className="flex flex-wrap gap-1.5">
                  {seriesOptions.map((s) => (
                    <FilterChip
                      key={s}
                      active={filters.series.includes(s)}
                      onToggle={() => toggleSeries(s)}
                      variant={s === 'movies' ? 'ember' : 'accent'}
                    >
                      {t(`filters.series${s.charAt(0).toUpperCase() + s.slice(1)}` as const)}
                    </FilterChip>
                  ))}
                </div>
              </FilterSection>
            )}

            {locationTypes.length > 0 && (
              <FilterSection
                title={t('filters.locationType')}
                activeCount={filters.locationTypes.length}
              >
                <div className="flex flex-wrap gap-1.5">
                  {locationTypes.map((type) => (
                    <FilterChip
                      key={type}
                      active={filters.locationTypes.includes(type)}
                      onToggle={() => toggleType(type)}
                    >
                      {getLocationTypeLabel(type, locale)}
                    </FilterChip>
                  ))}
                </div>
              </FilterSection>
            )}

            <FilterSection title={nationTerm} activeCount={filters.nationIds.length}>
              <ul className="space-y-0.5">
                {dataset.nations.map((n) => (
                  <li key={n.id}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-ink-200 transition hover:bg-ink-800/40">
                      <input
                        type="checkbox"
                        checked={filters.nationIds.includes(n.id)}
                        onChange={() => toggleNation(n.id)}
                        className="h-4 w-4 accent-chakra-500"
                      />
                      <span
                        aria-hidden
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: n.color ?? '#5b6275' }}
                      />
                      {getLocalizedText(n.localizedName, locale) || n.name}
                    </label>
                  </li>
                ))}
              </ul>
            </FilterSection>

            {villages.length > 0 && (
              <FilterSection
                title={placesTerm}
                activeCount={activeVillageCount}
                defaultOpen={activeVillageCount > 0}
              >
                {villages.length > SEARCH_THRESHOLD && (
                  <div className="mb-2">
                    <FilterSearchField
                      value={placeQuery}
                      onChange={setPlaceQuery}
                      placeholder={t('filters.searchPlaces')}
                      label={t('filters.searchPlaces')}
                      clearLabel={t('filters.clearSearch')}
                    />
                  </div>
                )}
                {filteredVillages.length === 0 ? (
                  <p className="px-1 py-2 text-xs text-ink-400">{t('filters.noMatches')}</p>
                ) : (
                  <div className="flex max-h-48 flex-wrap gap-1.5 overflow-auto pr-1">
                    {filteredVillages.map((v) => (
                      <FilterChip
                        key={v.id}
                        active={!!v.nationId && filters.nationIds.includes(v.nationId)}
                        onToggle={() => v.nationId && toggleNation(v.nationId)}
                      >
                        {getLocalizedText(v.localizedName, locale) || v.name}
                      </FilterChip>
                    ))}
                  </div>
                )}
              </FilterSection>
            )}

            <FilterSection
              title={t('filters.arc')}
              activeCount={filters.arcIds.length}
              defaultOpen={filters.arcIds.length > 0}
            >
              <div className="flex flex-wrap gap-1.5">
                {sortedArcs.map((a) => (
                  <FilterChip
                    key={a.id}
                    variant="ember"
                    active={filters.arcIds.includes(a.id)}
                    onToggle={() => toggleArc(a.id)}
                  >
                    {getLocalizedText(a.localizedName, locale) || a.name}
                  </FilterChip>
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title={t('filters.character')}
              activeCount={filters.characterIds.length}
              defaultOpen={filters.characterIds.length > 0}
            >
              {sortedCharacters.length > SEARCH_THRESHOLD && (
                <div className="mb-2">
                  <FilterSearchField
                    value={charQuery}
                    onChange={setCharQuery}
                    placeholder={t('filters.searchCharacters')}
                    label={t('filters.searchCharacters')}
                    clearLabel={t('filters.clearSearch')}
                  />
                </div>
              )}
              {filteredCharacters.length === 0 ? (
                <p className="px-1 py-2 text-xs text-ink-400">{t('filters.noMatches')}</p>
              ) : (
                <div className="flex max-h-48 flex-wrap gap-1.5 overflow-auto pr-1">
                  {filteredCharacters.map((c) => (
                    <FilterChip
                      key={c.id}
                      active={filters.characterIds.includes(c.id)}
                      onToggle={() => toggleCharacter(c.id)}
                    >
                      {getEntityDisplayName(c, locale) || c.name}
                    </FilterChip>
                  ))}
                </div>
              )}
            </FilterSection>

            {sortedFactions.length > 0 && (
              <FilterSection
                title={factionsTerm}
                activeCount={filters.factionIds.length}
                defaultOpen={filters.factionIds.length > 0}
              >
                {sortedFactions.length > SEARCH_THRESHOLD && (
                  <div className="mb-2">
                    <FilterSearchField
                      value={factionQuery}
                      onChange={setFactionQuery}
                      placeholder={t('filters.searchFactions')}
                      label={t('filters.searchFactions')}
                      clearLabel={t('filters.clearSearch')}
                    />
                  </div>
                )}
                {filteredFactions.length === 0 ? (
                  <p className="px-1 py-2 text-xs text-ink-400">{t('filters.noMatches')}</p>
                ) : (
                  <div className="flex max-h-48 flex-wrap gap-1.5 overflow-auto pr-1">
                    {filteredFactions.map((f) => (
                      <FilterChip
                        key={f.id}
                        active={filters.factionIds.includes(f.id)}
                        onToggle={() => toggleFaction(f.id)}
                      >
                        {getEntityDisplayName(f, locale) || f.name}
                      </FilterChip>
                    ))}
                  </div>
                )}
              </FilterSection>
            )}

            <FilterSection
              title={t('filters.importance')}
              activeCount={filters.importance.length}
            >
              <div className="flex flex-wrap gap-1.5">
                {(['main', 'secondary', 'minor'] as const).map((i) => (
                  <FilterChip
                    key={i}
                    variant="ember"
                    active={filters.importance.includes(i)}
                    onToggle={() => toggleImportance(i)}
                  >
                    {t(
                      i === 'main'
                        ? 'filters.importanceMain'
                        : i === 'secondary'
                          ? 'filters.importanceSecondary'
                          : 'filters.importanceMinor',
                    )}
                  </FilterChip>
                ))}
              </div>
            </FilterSection>

            <FilterSection title={t('filters.layersMap')} defaultOpen={false}>
              <div className="space-y-0.5">
                {hasBoundaries && (
                  <ToggleRow
                    checked={visibleLayers.boundaries}
                    onChange={() => toggleLayer('boundaries')}
                    label={t('filters.showBoundaries')}
                  />
                )}
                <ToggleRow
                  checked={visibleLayers.nationLabels}
                  onChange={() => toggleLayer('nationLabels')}
                  label={t('filters.showNationLabels')}
                />
                <ToggleRow
                  checked={visibleLayers.mainVillages}
                  onChange={() => toggleLayer('mainVillages')}
                  label={t('filters.showMainVillages', { places: placesTerm })}
                />
                <ToggleRow
                  checked={visibleLayers.minorVillages}
                  onChange={() => toggleLayer('minorVillages')}
                  label={t('filters.showMinorVillages', { places: placesTerm })}
                />
                <ToggleRow
                  checked={visibleLayers.specialPlaces}
                  onChange={() => toggleLayer('specialPlaces')}
                  label={t('filters.showSpecialPlaces')}
                />
                <ToggleRow
                  checked={filters.showUnverified}
                  onChange={(v) => setFilters({ showUnverified: v })}
                  label={t('filters.showUnverified')}
                  accent="ember"
                />
                {hasPoneglyphs && (
                  <ToggleRow
                    checked={filters.highlightPoneglyphs}
                    onChange={(v) => setFilters({ highlightPoneglyphs: v })}
                    label={t('filters.highlightPoneglyphs')}
                    accent="ember"
                  />
                )}
              </div>
            </FilterSection>

            <FilterSection title={t('filters.layersStory')} defaultOpen={false}>
              <div className="space-y-0.5">
                <ToggleRow
                  checked={filters.showRoutes}
                  onChange={(v) => setFilters({ showRoutes: v })}
                  label={t('filters.showRoutes')}
                />
                <ToggleRow
                  checked={visibleLayers.routesCanon}
                  onChange={() => toggleLayer('routesCanon')}
                  label={t('filters.routesCanon')}
                />
                <ToggleRow
                  checked={visibleLayers.routesNonCanon}
                  onChange={() => toggleLayer('routesNonCanon')}
                  label={t('filters.routesNonCanon')}
                />
                <ToggleRow
                  checked={visibleLayers.eventsCanon}
                  onChange={() => toggleLayer('eventsCanon')}
                  label={t('filters.eventsCanon')}
                />
                <ToggleRow
                  checked={visibleLayers.eventsNonCanon}
                  onChange={() => toggleLayer('eventsNonCanon')}
                  label={t('filters.eventsNonCanon')}
                />
                <ToggleRow
                  checked={visibleLayers.arcsCanon}
                  onChange={() => toggleLayer('arcsCanon')}
                  label={t('filters.arcsCanon')}
                />
                <ToggleRow
                  checked={visibleLayers.arcsNonCanon}
                  onChange={() => toggleLayer('arcsNonCanon')}
                  label={t('filters.arcsNonCanon')}
                />
                <ToggleRow
                  checked={filters.canonOnly}
                  onChange={(v) => setFilters({ canonOnly: v })}
                  label={t('filters.canonOnly')}
                  accent="ember"
                />
              </div>
            </FilterSection>
          </div>

          <footer className="flex shrink-0 items-center gap-2 border-t border-ink-700/60 px-4 py-3">
            <span className="mr-auto text-xs text-ink-400" aria-live="polite">
              {t('filters.resultsCount', { count: resultCount })}
            </span>
            <Button
              variant="ghost"
              onClick={() => {
                resetFilters();
                resetLayers();
              }}
            >
              {t('filters.reset')}
            </Button>
            <Button variant="primary" onClick={close}>
              {t('filters.apply')}
            </Button>
          </footer>
        </div>
      )}
    </Drawer>
  );
}
