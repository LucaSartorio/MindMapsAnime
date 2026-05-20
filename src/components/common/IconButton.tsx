import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** aria-label è obbligatorio: questi pulsanti non hanno testo visibile */
  'aria-label': string;
  variant?: 'solid' | 'ghost' | 'accent';
}

/**
 * Pulsante icona riusabile per i floating controls sulla mappa.
 * Compatto, accessibile, con focus ring.
 */
export function IconButton({
  children,
  variant = 'solid',
  className,
  ...rest
}: IconButtonProps) {
  const base =
    'inline-flex items-center justify-center h-9 w-9 rounded-md transition focus-visible:ring-2 focus-visible:ring-chakra-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950';
  const map = {
    solid:
      'bg-ink-900/85 border border-ink-700/70 text-ink-100 hover:bg-ink-800 hover:border-chakra-500/50 backdrop-blur-md',
    ghost: 'text-ink-200 hover:text-white hover:bg-ink-800/70',
    accent:
      'bg-chakra-500/90 text-white hover:bg-chakra-400 border border-chakra-400/50',
  };
  return (
    <button type="button" className={cn(base, map[variant], className)} {...rest}>
      {children}
    </button>
  );
}
