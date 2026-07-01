import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

interface DrawerProps {
  open: boolean;
  side?: 'left' | 'right' | 'bottom';
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}

const FOCUSABLE =
  'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

export function Drawer({
  open,
  side = 'right',
  onClose,
  children,
  ariaLabel = 'Drawer',
  className,
}: DrawerProps) {
  const asideRef = useRef<HTMLElement>(null);

  // `inert` quando chiuso: il pannello resta nel DOM (fuori schermo) ma i suoi
  // controlli escono dal tab order e dall'albero di accessibilità — così non si
  // "tabba" dentro un drawer chiuso (evita anche aria-hidden-focus).
  useEffect(() => {
    const root = asideRef.current;
    if (!root) return;
    if (open) root.removeAttribute('inert');
    else root.setAttribute('inert', '');
  }, [open]);

  // Gestione focus quando aperto: focus iniziale dentro il drawer, trappola del
  // Tab, ESC per chiudere, ripristino del focus al trigger alla chiusura.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusTimer = setTimeout(() => {
      const root = asideRef.current;
      if (!root) return;
      (root.querySelector<HTMLElement>(FOCUSABLE) ?? root).focus();
    }, 30);

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = asideRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(focusTimer);
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [open, onClose]);

  // Posizione + bordi. La larghezza viene sempre dal consumer via className.
  const sideClasses =
    side === 'left'
      ? 'left-0 top-0 h-full border-r'
      : side === 'right'
        ? 'right-0 top-0 h-full border-l'
        : 'left-0 right-0 bottom-0 max-h-[80vh] border-t w-full';

  const slide =
    side === 'left'
      ? open
        ? 'translate-x-0'
        : '-translate-x-full'
      : side === 'right'
        ? open
          ? 'translate-x-0'
          : 'translate-x-full'
        : open
          ? 'translate-y-0'
          : 'translate-y-full';

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity',
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
      />
      <aside
        ref={asideRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={cn(
          'fixed z-50 panel transition-transform duration-300 ease-out outline-none',
          sideClasses,
          slide,
          className,
        )}
      >
        {children}
      </aside>
    </>
  );
}
