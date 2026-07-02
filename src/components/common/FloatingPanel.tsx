import { useId, useState, type ReactNode } from 'react';
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
  /** Azione mostrata nell'header quando aperto (es. Reset) */
  headerAction?: ReactNode;
}

/**
 * Pannello floating collassabile (disclosure WAI-ARIA).
 *
 * Un unico pulsante-titolo con `aria-expanded`/`aria-controls` apre e chiude il
 * contenuto: chevron rotante + stato annunciato agli screen reader (non solo
 * visivo). Pensato per stare sopra la mappa (`pointer-events-auto`).
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
  const contentId = useId();

  function setOpen(next: boolean) {
    if (onOpenChange) onOpenChange(next);
    else setInternalOpen(next);
  }

  const toggle = (
    <button
      type="button"
      onClick={() => setOpen(!isOpen)}
      aria-expanded={isOpen}
      aria-controls={isOpen ? contentId : undefined}
      className="flex min-w-0 flex-1 items-center gap-2 text-left"
    >
      {icon && (
        <span aria-hidden className="text-chakra-300">
          {icon}
        </span>
      )}
      <span className="truncate font-display text-[11px] uppercase tracking-widest text-chakra-300">
        {title}
      </span>
      <span
        aria-hidden
        className={cn('text-ink-400 transition-transform', isOpen && 'rotate-90')}
      >
        ›
      </span>
    </button>
  );

  if (!isOpen) {
    return (
      <div className="panel pointer-events-auto inline-flex items-center px-3 py-1.5 transition hover:border-chakra-500/50">
        {toggle}
      </div>
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
      <header className="flex items-center justify-between gap-2 border-b border-ink-700/60 px-3 py-2">
        {toggle}
        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </header>
      <div id={contentId} className="flex-1 overflow-auto">
        {children}
      </div>
    </section>
  );
}
