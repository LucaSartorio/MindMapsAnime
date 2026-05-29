import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Titolo visualizzato (anche aria-label se manca) */
  title?: string;
  /** Eyebrow opzionale sopra il titolo (es. "Luogo · Villaggio") */
  eyebrow?: ReactNode;
  /** Badge/azioni accanto al titolo */
  badges?: ReactNode;
  /** Banner/immagine opzionale renderizzato in cima alla modale */
  media?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Larghezza max della modale */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Footer opzionale (azioni primarie) */
  footer?: ReactNode;
}

const SIZE_MAP: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
};

/**
 * Modale "card flottante" con overlay leggero.
 * - chiusura: X, ESC, click sull'overlay
 * - focus iniziale sul pulsante chiudi (focus trap base)
 * - scroll interno se il contenuto è lungo
 * - non sposta il layout: posizione fixed
 */
export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  badges,
  media,
  children,
  className,
  size = 'lg',
  footer,
}: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // ESC + scroll lock
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const root = dialogRef.current;
        if (!root) return;
        const focusable = root.querySelectorAll<HTMLElement>(
          'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // focus iniziale leggermente differito per evitare race con il portal
    const id = setTimeout(() => closeRef.current?.focus(), 30);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(id);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px] animate-[fadeIn_120ms_ease-out]"
      />
      <div
        ref={dialogRef}
        className={cn(
          'panel relative z-10 w-full flex flex-col max-h-[92dvh] sm:max-h-[85dvh]',
          'rounded-t-2xl sm:rounded-2xl',
          SIZE_MAP[size],
          'shadow-2xl',
          className,
        )}
      >
        {(title || eyebrow || badges || media) && (
          <header className="px-5 py-4 border-b border-ink-700/60 flex items-start gap-4 shrink-0 rounded-t-2xl">
            {media && (
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl border border-ink-700/60 bg-ink-900 shadow-lg">
                {media}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {eyebrow && (
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-chakra-300 mb-1">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="font-display text-xl sm:text-2xl text-ink-100 leading-tight">
                  {title}
                </h2>
              )}
              {badges && (
                <div className="mt-2 flex flex-wrap gap-1.5">{badges}</div>
              )}
            </div>
            <button
              ref={closeRef}
              type="button"
              aria-label="Chiudi"
              onClick={onClose}
              className="h-8 w-8 grid place-items-center rounded-md text-ink-300 hover:text-white hover:bg-ink-800/70 shrink-0"
            >
              ×
            </button>
          </header>
        )}
        <div className="flex-1 overflow-auto px-5 py-4 text-sm text-ink-200 space-y-5">
          {children}
        </div>
        {footer && (
          <footer className="px-5 py-3 border-t border-ink-700/60 shrink-0 flex flex-wrap items-center justify-end gap-2">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
