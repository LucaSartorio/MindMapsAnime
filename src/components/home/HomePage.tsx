import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { animeWorlds } from '@/data/worlds';
import { searchWorlds } from '@/lib/search';
import { HeroSection } from './HeroSection';
import { WorldGrid } from './WorldGrid';
import { EmptyState } from '@/components/common/EmptyState';
import { Card } from '@/components/common/Card';

export function HomePage() {
  const [query, setQuery] = useState('');
  const filteredWorlds = useMemo(() => {
    if (!query.trim()) return animeWorlds;
    const results = searchWorlds(query, animeWorlds);
    const ids = new Set(results.map((r) => r.id));
    return animeWorlds.filter((w) => ids.has(w.id));
  }, [query]);

  return (
    <div>
      <HeroSection />

      <main className="max-w-6xl mx-auto px-6 pb-24">
        <section
          aria-labelledby="worlds-heading"
          className="flex flex-col gap-6"
        >
          <header className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2
                id="worlds-heading"
                className="font-display text-2xl md:text-3xl text-ink-100"
              >
                Mondi disponibili
              </h2>
              <p className="text-sm text-ink-300 max-w-md">
                Apri una mappa interattiva e inizia a esplorare. Naruto è
                disponibile come primo mondo. Stiamo lavorando sui prossimi.
              </p>
            </div>
            <div className="w-full sm:w-72">
              <label htmlFor="search-worlds" className="sr-only">
                Cerca un anime
              </label>
              <input
                id="search-worlds"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca un anime…"
                className="w-full panel-soft px-3 py-2 text-sm placeholder-ink-400 focus:border-chakra-500"
              />
            </div>
          </header>

          {filteredWorlds.length > 0 ? (
            <WorldGrid worlds={filteredWorlds} />
          ) : (
            <Card className="p-10">
              <EmptyState
                title="Nessun mondo trovato"
                description="Prova un altro termine di ricerca o esplora tutti i mondi disponibili."
              />
            </Card>
          )}
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          <Card className="p-5">
            <h3 className="font-display text-lg text-ink-100 mb-2">
              Mappe come storie
            </h3>
            <p className="text-sm text-ink-300 leading-relaxed">
              Ogni mondo è un atlante interattivo: nazioni, villaggi,
              percorsi e luoghi simbolo collegati agli eventi narrativi.
            </p>
          </Card>
          <Card className="p-5">
            <h3 className="font-display text-lg text-ink-100 mb-2">
              Timeline e archi
            </h3>
            <p className="text-sm text-ink-300 leading-relaxed">
              Visualizza la cronologia degli archi narrativi, filtra per
              personaggio o nazione, evidenzia eventi canon.
            </p>
          </Card>
          <Card className="p-5">
            <h3 className="font-display text-lg text-ink-100 mb-2">
              Estendibile
            </h3>
            <p className="text-sm text-ink-300 leading-relaxed">
              Aggiungere un nuovo anime significa solo creare un nuovo
              dataset. Il resto della piattaforma si adatta automaticamente.
            </p>
          </Card>
        </section>

        <footer className="mt-16 text-center text-xs text-ink-400">
          Vai alla pagina{' '}
          <Link to="/about" className="text-chakra-300 hover:underline">
            About
          </Link>{' '}
          per saperne di più sul progetto.
        </footer>
      </main>
    </div>
  );
}
