import { useId, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';

interface FilterSectionProps {
  title: string;
  /** Numero di valori attivi in questa sezione: mostrato come badge. */
  activeCount?: number;
  defaultOpen?: boolean;
  children: ReactNode;
  /** Testo opzionale d'aiuto sotto il titolo (mostrato solo da aperta). */
  hint?: string;
}

/**
 * Sezione di filtri collassabile e accessibile.
 *
 * - L'header è un `<button aria-expanded aria-controls>` che apre/chiude la
 *   regione dei controlli: tastiera-friendly e annunciato dagli screen reader.
 * - Un badge mostra quanti filtri della sezione sono attivi, così l'utente
 *   ritrova subito i filtri impostati anche a sezione chiusa.
 */
export function FilterSection({
  title,
  activeCount = 0,
  defaultOpen = true,
  children,
  hint,
}: FilterSectionProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(defaultOpen);
  const regionId = useId();

  return (
    <section className="border-b border-ink-700/40 pb-3 last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={regionId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2 rounded-md py-1.5 text-left text-ink-100 transition hover:text-white"
        >
          <span
            aria-hidden
            className={cn(
              'text-ink-400 transition-transform duration-200',
              open ? 'rotate-90' : 'rotate-0',
            )}
          >
            ›
          </span>
          <span className="flex-1 font-mono text-xs uppercase tracking-widest text-ink-300">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="count-badge" aria-label={t('filters.activeCount', { count: activeCount })}>
              {activeCount}
            </span>
          )}
        </button>
      </h3>
      <div id={regionId} hidden={!open} className="mt-2">
        {hint && <p className="mb-2 text-[11px] leading-relaxed text-ink-400">{hint}</p>}
        {children}
      </div>
    </section>
  );
}
