import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FloatingPanelProps {
  title: string;
  /** Icona/label compatta mostrata accanto al titolo */
  icon?: ReactNode;
  /** Controllo stato dall'esterno (modalità controlled) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Stato iniziale se uncontrolled */
  defaultOpen?: boolean;
  /** Larghezza massima quando aperto */
  className?: string;
  /** Contenuto reso solo quando aperto (utile per lazy compute) */
  children: ReactNode;
  /** Azione mostrata accanto alla X (es. Reset) */
  headerAction?: ReactNode;
}

/**
 * Pannello compatto floating: di default mostra solo un bottone con titolo.
 * Cliccando si espande. Pensato per essere posizionato sopra la mappa
 * (vedi `pointer-events-auto` nei contenitori parent).
 */
export function FloatingPanel({
  title,
  icon,
  open,
  onOpenChange,
  defaultOpen = false,
  className,
  children,
  headerAction,
}: FloatingPanelProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  function setOpen(next: boolean) {
    if (onOpenChange) onOpenChange(next);
    else setInternalOpen(next);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={false}
        className="panel pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-ink-100 hover:border-chakra-500/50 transition"
      >
        {icon && <span aria-hidden>{icon}</span>}
        <span className="font-display uppercase tracking-widest text-[11px] text-chakra-300">
          {title}
        </span>
        <span aria-hidden className="text-ink-400">
          ›
        </span>
      </button>
    );
  }

  return (
    <section
      aria-label={title}
      className={cn(
        'panel pointer-events-auto flex flex-col overflow-hidden',
        className,
      )}
    >
      <header className="flex items-center justify-between gap-2 px-3 py-2 border-b border-ink-700/60">
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span aria-hidden className="text-chakra-300">{icon}</span>}
          <h3 className="font-display uppercase tracking-widest text-[11px] text-chakra-300 truncate">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {headerAction}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={`Chiudi pannello ${title}`}
            className="h-7 w-7 grid place-items-center rounded-md text-ink-300 hover:text-white hover:bg-ink-800/70"
          >
            ×
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-auto">{children}</div>
    </section>
  );
}
