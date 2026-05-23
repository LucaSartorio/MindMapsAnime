import { useEffect, type ReactNode } from 'react';

interface ImageLightboxProps {
  open: boolean;
  onClose: () => void;
  label?: string;
  children: ReactNode;
}

/**
 * Popup a dimensione fissa per ingrandire un'immagine/placeholder.
 * Sta sopra il Modal (z-[70]) e intercetta ESC in fase di capture per
 * chiudere solo il lightbox senza chiudere anche il modale sottostante.
 */
export function ImageLightbox({
  open,
  onClose,
  label,
  children,
}: ImageLightboxProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    }
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <div className="relative z-10 w-[min(88vw,560px)]">
        <div className="aspect-square w-full overflow-hidden rounded-xl border border-ink-600/60 bg-ink-900 shadow-2xl">
          {children}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi"
          className="absolute -top-3 -right-3 h-8 w-8 grid place-items-center rounded-full bg-ink-800 text-ink-100 border border-ink-600/60 hover:bg-ink-700"
        >
          ×
        </button>
      </div>
    </div>
  );
}
