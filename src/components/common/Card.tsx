import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Variante "soft" più trasparente */
  soft?: boolean;
  /** Attiva un effetto hover sottile (per card cliccabili) */
  interactive?: boolean;
}

export function Card({ children, className, soft, interactive }: CardProps) {
  return (
    <div
      className={cn(
        soft ? 'panel-soft' : 'panel',
        interactive &&
          'transition hover:border-chakra-500/60 hover:shadow-glow hover:-translate-y-0.5',
        className,
      )}
    >
      {children}
    </div>
  );
}
