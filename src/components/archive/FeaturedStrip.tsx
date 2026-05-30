import type { ReactNode } from 'react';

export interface FeaturedTile {
  id: string;
  /** Titolo principale del tile (es. nome del personaggio/jutsu/clan). */
  title: string;
  /** Sottotitolo opzionale (es. nome del villaggio o sotto-nome). */
  subtitle?: string;
  /** Eyebrow / etichetta breve in cima al tile (es. rango, saga). */
  caption?: string;
  /** Immagine renderizzata a tutto-bleed: di solito un <EntityImage>. */
  image: ReactNode;
  onClick: () => void;
}

interface FeaturedStripProps {
  /** Titolo della striscia (es. "In evidenza", "Tecniche iconiche"). */
  title: string;
  /** Riga di hint opzionale a destra del titolo. */
  hint?: string;
  /** Tile da mostrare. Componente nullo se l'array è vuoto. */
  items: FeaturedTile[];
}

/**
 * Striscia "vetrina" in cima alle pagine archivio.
 *
 * Disegna 4-6 tile in formato poster (4:5) con immagine full-bleed,
 * gradiente scuro verso il basso e titolo sovrapposto in basso a sinistra.
 * Pensata per dare un colpo d'occhio iniziale agli archivi senza
 * compromettere la scansionabilità della griglia densa che segue.
 *
 * Convenzioni:
 *  - La griglia adatta il numero di colonne al breakpoint (2/3/6).
 *  - Nessun chrome aggiuntivo (sezioni accessorie, hint, ecc.) per non
 *    far concorrenza al contenuto.
 *  - I tile sono `<button>` per restare accessibili da tastiera/screen
 *    reader senza dover navigare a una URL dedicata.
 */
export function FeaturedStrip({ title, hint, items }: FeaturedStripProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-3" aria-labelledby="featured-strip-title">
      <header className="flex items-baseline justify-between gap-3">
        <h2
          id="featured-strip-title"
          className="font-display text-lg sm:text-xl text-ink-100"
        >
          {title}
        </h2>
        {hint && <p className="text-xs text-ink-400">{hint}</p>}
      </header>
      <ul className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={t.onClick}
              className="group relative block w-full text-left aspect-[4/5] overflow-hidden rounded-xl border border-ink-700/60 bg-ink-900 shadow-lg transition hover:border-chakra-500/70 hover:shadow-chakra/40 focus:outline-none focus:ring-2 focus:ring-chakra-500/60"
              aria-label={t.title}
            >
              {/* Immagine full-bleed. Lo zoom sutile su hover dà
                  un'inerzia "cinematic" senza muovere la griglia. */}
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
                {t.image}
              </div>
              {/* Gradiente leggibilità: opaco in basso, trasparente in
                  alto. Lascia respirare l'immagine. */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/45 to-ink-950/0 pointer-events-none" />
              <div className="relative h-full flex flex-col justify-end p-3 text-ink-100">
                {t.caption && (
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-chakra-300 mb-1 drop-shadow">
                    {t.caption}
                  </p>
                )}
                <h3 className="font-display text-base sm:text-lg leading-tight line-clamp-2 drop-shadow">
                  {t.title}
                </h3>
                {t.subtitle && (
                  <p className="text-[11px] text-ink-300 mt-0.5 line-clamp-1 drop-shadow">
                    {t.subtitle}
                  </p>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
