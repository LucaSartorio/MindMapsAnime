import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { cn } from '@/lib/cn';

interface DrawerProps {
  open: boolean;
  side?: 'left' | 'right' | 'bottom';
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}

export function Drawer({
  open,
  side = 'right',
  onClose,
  children,
  ariaLabel = 'Drawer',
  className,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const sideClasses =
    side === 'left'
      ? 'left-0 top-0 h-full w-[90vw] max-w-sm border-r'
      : side === 'right'
        ? 'right-0 top-0 h-full w-[90vw] max-w-sm border-l'
        : 'left-0 bottom-0 w-full max-h-[80vh] border-t';

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
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity',
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
      />
      <aside
        role="dialog"
        aria-label={ariaLabel}
        aria-hidden={!open}
        className={cn(
          'fixed z-50 panel transition-transform duration-300 ease-out',
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
