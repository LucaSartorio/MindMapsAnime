import type { LocationType, VisibleLayers, WorldDataset } from '@/types';
import { Drawer } from '@/components/common/Drawer';
import { Button } from '@/components/common/Button';
import { useMapStore, useUiStore } from '@/store';

interface FiltersDrawerProps {
  dataset: WorldDataset;
}

const LOCATION_TYPE_LABELS: { type: LocationType; label: string }[] = [
  { type: 'village', label: 'Villaggi' },
  { type: 'city', label: 'Città' },
  { type: 'nation', label: 'Nazioni' },
  { type: 'landmark', label: 'Landmark' },
  { type: 'battlefield', label: 'Battaglie' },
  { type: 'hideout', label: 'Nascondigli' },
  { type: 'sacred_place', label: 'Sacri' },
  { type: 'training_area', label: 'Allenamento' },
  { type: 'region', label: 'Regioni' },
  { type: 'ruins', label: 'Rovine' },
  { type: 'bridge', label: 'Ponti' },
  { type: 'forest', label: 'Foreste' },
];

/** Drawer filtri: apribile via floating button, chiudibile con ESC/X/click fuori. */
export function FiltersDrawer({ dataset }: FiltersDrawerProps) {
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

  function toggleType(t: LocationType) {
    setFilters({
      locationTypes: filters.locationTypes.includes(t)
        ? filters.locationTypes.filter((x) => x !== t)
        : [...filters.locationTypes, t],
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

  const villages = dataset.locations
    .filter((l) => l.type === 'village')
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Drawer
      open={open}
      side="left"
      onClose={close}
      ariaLabel="Filtri mappa"
      className="w-[92vw] sm:max-w-sm"
    >
      <div className="h-full flex flex-col">
        <header className="px-4 py-3 border-b border-ink-700/60 flex items-center justify-between gap-2 shrink-0">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-chakra-300">
              {dataset.world.title}
            </p>
            <h2 className="font-display text-base text-ink-100">
              Filtri mappa
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Chiudi filtri"
            className="h-8 w-8 grid place-items-center rounded-md text-ink-300 hover:text-white hover:bg-ink-800/70"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 space-y-5 text-sm">
          <Section title="Tipo luogo">
            <div className="flex flex-wrap gap-1.5">
              {LOCATION_TYPE_LABELS.map(({ type, label }) => (
                <Pill
                  key={type}
                  active={filters.locationTypes.includes(type)}
                  onClick={() => toggleType(type)}
                >
                  {label}
                </Pill>
              ))}
            </div>
          </Section>

          <Section title="Nazione">
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
                    {n.name}
                  </label>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Villaggio">
            <div className="flex flex-wrap gap-1.5">
              {villages.map((v) => (
                <Pill
                  key={v.id}
                  active={filters.nationIds.includes(v.nationId ?? '')}
                  onClick={() => v.nationId && toggleNation(v.nationId)}
                >
                  {v.name}
                </Pill>
              ))}
            </div>
          </Section>

          <Section title="Arco narrativo">
            <div className="flex flex-wrap gap-1.5">
              {dataset.arcs
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((a) => (
                  <Pill
                    key={a.id}
                    variant="ember"
                    active={filters.arcIds.includes(a.id)}
                    onClick={() => toggleArc(a.id)}
                  >
                    {a.name}
                  </Pill>
                ))}
            </div>
          </Section>

          <Section title="Personaggio">
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-auto pr-1">
              {dataset.characters
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((c) => (
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

          <Section title="Importanza">
            <div className="flex flex-wrap gap-1.5">
              {(['main', 'secondary', 'minor'] as const).map((i) => (
                <Pill
                  key={i}
                  variant="ember"
                  active={filters.importance.includes(i)}
                  onClick={() => toggleImportance(i)}
                >
                  <span className="capitalize">{i}</span>
                </Pill>
              ))}
            </div>
          </Section>

          <Section title="Layers mappa">
            <div className="space-y-1.5 text-ink-200">
              <CheckRow
                checked={visibleLayers.boundaries}
                onChange={() => toggleLayer('boundaries')}
                label="Mostra confini"
              />
              <CheckRow
                checked={visibleLayers.nationLabels}
                onChange={() => toggleLayer('nationLabels')}
                label="Mostra nomi nazioni"
              />
              <CheckRow
                checked={visibleLayers.mainVillages}
                onChange={() => toggleLayer('mainVillages')}
                label="Mostra villaggi principali"
              />
              <CheckRow
                checked={visibleLayers.minorVillages}
                onChange={() => toggleLayer('minorVillages')}
                label="Mostra villaggi minori"
              />
              <CheckRow
                checked={visibleLayers.specialPlaces}
                onChange={() => toggleLayer('specialPlaces')}
                label="Mostra luoghi speciali"
              />
            </div>
          </Section>

          <Section title="Layers narrativi">
            <div className="space-y-1.5 text-ink-200">
              <CheckRow
                checked={filters.showRoutes}
                onChange={(v) => setFilters({ showRoutes: v })}
                label="Mostra percorsi"
              />
              <CheckRow
                checked={visibleLayers.routesCanon}
                onChange={() => toggleLayer('routesCanon')}
                label="Route canon"
              />
              <CheckRow
                checked={visibleLayers.routesNonCanon}
                onChange={() => toggleLayer('routesNonCanon')}
                label="Route anime-only / filler"
              />
              <CheckRow
                checked={visibleLayers.eventsCanon}
                onChange={() => toggleLayer('eventsCanon')}
                label="Eventi canon"
              />
              <CheckRow
                checked={visibleLayers.eventsNonCanon}
                onChange={() => toggleLayer('eventsNonCanon')}
                label="Eventi anime-only / filler"
              />
              <CheckRow
                checked={visibleLayers.arcsCanon}
                onChange={() => toggleLayer('arcsCanon')}
                label="Archi canon"
              />
              <CheckRow
                checked={visibleLayers.arcsNonCanon}
                onChange={() => toggleLayer('arcsNonCanon')}
                label="Archi anime-only"
              />
              <CheckRow
                checked={filters.canonOnly}
                onChange={(v) => setFilters({ canonOnly: v })}
                label="Solo canon (filtro globale)"
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
            Reset
          </Button>
          <Button variant="primary" onClick={close} className="flex-1">
            Applica
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
