import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { LocationType, Series, VisibleLayers, WorldDataset } from '@/types';
import { worldSeriesOptions } from '@/lib/series';
import { getNationTerm } from '@/lib/worldConfig';
import { Drawer } from '@/components/common/Drawer';
import { Button } from '@/components/common/Button';
import { useMapStore, useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import {
  getLocalizedText,
  getLocationTypeLabel,
} from '@/utils/localization';

interface FiltersDrawerProps {
  dataset: WorldDataset;
}

/**
 * Ordine di presentazione dei tipi di luogo. La lista mostrata viene poi
 * filtrata sui soli tipi effettivamente presenti nel dataset attivo, così
 * ogni mondo espone solo i propri (Naruto: villaggi/campi di battaglia…;
 * Hunter x Hunter: città/regioni/rovine…).
 */
const LOCATION_TYPE_ORDER: LocationType[] = [
  'village',
  'city',
  'nation',
  'region',
  'landmark',
  'battlefield',
  'hideout',
  'sacred_place',
  'training_area',
  'ruins',
  'bridge',
  'forest',
  'mountain',
  'cave',
];

/** Drawer filtri tradotto IT/EN. */
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

  function toggleLayer<K extends keyof VisibleLayers>(layer: K) {
    setVisibleLayer(layer, !visibleLayers[layer] as VisibleLayers[K]);
  }

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

  // Solo i tipi di luogo realmente presenti nel mondo attivo.
  const locationTypes = useMemo(() => {
    const present = new Set(dataset.locations.map((l) => l.type));
    return LOCATION_TYPE_ORDER.filter((type) => present.has(type));
  }, [dataset.locations]);

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

  // Le "serie" (blocchi narrativi) si applicano solo ai mondi che le usano
  // (Naruto). Per gli altri la sezione resta nascosta.
  const seriesOptions = worldSeriesOptions(dataset.world);
  const nationTerm = getNationTerm(dataset.world, locale, t('filters.nation'));

  return (
    <Drawer
      open={open}
      side="left"
      onClose={close}
      ariaLabel={t('filters.title')}
      className="w-[92vw] sm:max-w-sm"
    >
      <div className="h-full flex flex-col">
        <header className="px-4 py-3 border-b border-ink-700/60 flex items-center justify-between gap-2 shrink-0">
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
            className="h-8 w-8 grid place-items-center rounded-md text-ink-300 hover:text-white hover:bg-ink-800/70"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 space-y-5 text-sm">
          {seriesOptions.length > 0 && (
            <Section title={t('filters.series')}>
              <p className="text-[11px] text-ink-400 mb-2">
                {t('filters.seriesHint')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {seriesOptions.map((s) => (
                  <Pill
                    key={s}
                    active={filters.series.includes(s)}
                    onClick={() => toggleSeries(s)}
                    variant={s === 'movies' ? 'ember' : 'chakra'}
                  >
                    {t(`filters.series${s.charAt(0).toUpperCase() + s.slice(1)}` as const)}
                  </Pill>
                ))}
              </div>
            </Section>
          )}

          {locationTypes.length > 0 && (
            <Section title={t('filters.locationType')}>
              <div className="flex flex-wrap gap-1.5">
                {locationTypes.map((type) => (
                  <Pill
                    key={type}
                    active={filters.locationTypes.includes(type)}
                    onClick={() => toggleType(type)}
                  >
                    {getLocationTypeLabel(type, locale)}
                  </Pill>
                ))}
              </div>
            </Section>
          )}

          <Section title={nationTerm}>
            <ul className="space-y-1.5">
              {dataset.nations.map((n) => (
                <li key={n.id}>
                  <label className="flex items-center gap-2 text-ink-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.nationIds.includes(n.id)}
                      onChange={() => toggleNation(n.id)}
                      className="accent-chakra-500"
                    />
                    <span
                      aria-hidden
                      className="inline-block w-2.5 h-2.5 rounded-full"
                      style={{ background: n.color ?? '#5b6275' }}
                    />
                    {getLocalizedText(n.localizedName, locale) || n.name}
                  </label>
                </li>
              ))}
            </ul>
          </Section>

          {villages.length > 0 && (
            <Section title={t('filters.village')}>
              <div className="flex flex-wrap gap-1.5">
                {villages.map((v) => (
                  <Pill
                    key={v.id}
                    active={filters.nationIds.includes(v.nationId ?? '')}
                    onClick={() => v.nationId && toggleNation(v.nationId)}
                  >
                    {getLocalizedText(v.localizedName, locale) || v.name}
                  </Pill>
                ))}
              </div>
            </Section>
          )}

          <Section title={t('filters.arc')}>
            <div className="flex flex-wrap gap-1.5">
              {sortedArcs.map((a) => (
                <Pill
                  key={a.id}
                  variant="ember"
                  active={filters.arcIds.includes(a.id)}
                  onClick={() => toggleArc(a.id)}
                >
                  {getLocalizedText(a.localizedName, locale) || a.name}
                </Pill>
              ))}
            </div>
          </Section>

          <Section title={t('filters.character')}>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-auto pr-1">
              {sortedCharacters.map((c) => (
                <Pill
                  key={c.id}
                  active={filters.characterIds.includes(c.id)}
                  onClick={() => toggleCharacter(c.id)}
                >
                  {c.name}
                </Pill>
              ))}
            </div>
          </Section>

          <Section title={t('filters.importance')}>
            <div className="flex flex-wrap gap-1.5">
              {(['main', 'secondary', 'minor'] as const).map((i) => (
                <Pill
                  key={i}
                  variant="ember"
                  active={filters.importance.includes(i)}
                  onClick={() => toggleImportance(i)}
                >
                  {t(
                    i === 'main'
                      ? 'filters.importanceMain'
                      : i === 'secondary'
                        ? 'filters.importanceSecondary'
                        : 'filters.importanceMinor',
                  )}
                </Pill>
              ))}
            </div>
          </Section>

          <Section title={t('filters.layersMap')}>
            <div className="space-y-1.5 text-ink-200">
              <CheckRow
                checked={visibleLayers.boundaries}
                onChange={() => toggleLayer('boundaries')}
                label={t('filters.showBoundaries')}
              />
              <CheckRow
                checked={visibleLayers.nationLabels}
                onChange={() => toggleLayer('nationLabels')}
                label={t('filters.showNationLabels')}
              />
              <CheckRow
                checked={visibleLayers.mainVillages}
                onChange={() => toggleLayer('mainVillages')}
                label={t('filters.showMainVillages')}
              />
              <CheckRow
                checked={visibleLayers.minorVillages}
                onChange={() => toggleLayer('minorVillages')}
                label={t('filters.showMinorVillages')}
              />
              <CheckRow
                checked={visibleLayers.specialPlaces}
                onChange={() => toggleLayer('specialPlaces')}
                label={t('filters.showSpecialPlaces')}
              />
              <CheckRow
                checked={filters.showUnverified}
                onChange={(v) => setFilters({ showUnverified: v })}
                label={t('filters.showUnverified')}
                emberAccent
              />
            </div>
          </Section>

          <Section title={t('filters.layersStory')}>
            <div className="space-y-1.5 text-ink-200">
              <CheckRow
                checked={filters.showRoutes}
                onChange={(v) => setFilters({ showRoutes: v })}
                label={t('filters.showRoutes')}
              />
              <CheckRow
                checked={visibleLayers.routesCanon}
                onChange={() => toggleLayer('routesCanon')}
                label={t('filters.routesCanon')}
              />
              <CheckRow
                checked={visibleLayers.routesNonCanon}
                onChange={() => toggleLayer('routesNonCanon')}
                label={t('filters.routesNonCanon')}
              />
              <CheckRow
                checked={visibleLayers.eventsCanon}
                onChange={() => toggleLayer('eventsCanon')}
                label={t('filters.eventsCanon')}
              />
              <CheckRow
                checked={visibleLayers.eventsNonCanon}
                onChange={() => toggleLayer('eventsNonCanon')}
                label={t('filters.eventsNonCanon')}
              />
              <CheckRow
                checked={visibleLayers.arcsCanon}
                onChange={() => toggleLayer('arcsCanon')}
                label={t('filters.arcsCanon')}
              />
              <CheckRow
                checked={visibleLayers.arcsNonCanon}
                onChange={() => toggleLayer('arcsNonCanon')}
                label={t('filters.arcsNonCanon')}
              />
              <CheckRow
                checked={filters.canonOnly}
                onChange={(v) => setFilters({ canonOnly: v })}
                label={t('filters.canonOnly')}
                emberAccent
              />
            </div>
          </Section>
        </div>

        <footer className="px-4 py-3 border-t border-ink-700/60 shrink-0 flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              resetFilters();
              resetLayers();
            }}
            className="flex-1"
          >
            {t('filters.reset')}
          </Button>
          <Button variant="primary" onClick={close} className="flex-1">
            {t('filters.apply')}
          </Button>
        </footer>
      </div>
    </Drawer>
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
      <h3 className="text-xs uppercase tracking-widest text-ink-400 font-mono mb-2">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Pill({
  active,
  onClick,
  children,
  variant = 'chakra',
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'chakra' | 'ember';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        'px-2 py-0.5 rounded-full text-[11px] border transition ' +
        (active
          ? variant === 'ember'
            ? 'bg-ember-500 text-white border-ember-300'
            : 'bg-chakra-500 text-white border-chakra-300'
          : `border-ink-600/60 text-ink-200 ${
              variant === 'ember'
                ? 'hover:border-ember-500/50'
                : 'hover:border-chakra-500/50'
            }`)
      }
    >
      {children}
    </button>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
  emberAccent,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  emberAccent?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={emberAccent ? 'accent-ember-500' : 'accent-chakra-500'}
      />
      {label}
    </label>
  );
}
