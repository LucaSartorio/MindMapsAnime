import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ChipVariant = 'accent' | 'ember' | 'neutral';

interface FilterChipProps {
  active: boolean;
  onToggle: () => void;
  children: ReactNode;
  variant?: ChipVariant;
  /** Conteggio opzionale (es. quanti luoghi corrispondono a questo valore). */
  count?: number;
}

const ACTIVE: Record<ChipVariant, string> = {
  accent: 'bg-chakra-600 text-white border-chakra-400 shadow-focus',
  ember: 'bg-ember-500 text-white border-ember-300',
  neutral: 'bg-ink-200 text-ink-950 border-ink-100',
};

const IDLE: Record<ChipVariant, string> = {
  accent:
    'bg-ink-800/60 text-ink-200 border-ink-600/60 hover:border-chakra-500/60 hover:text-white',
  ember:
    'bg-ink-800/60 text-ink-200 border-ink-600/60 hover:border-ember-500/60 hover:text-white',
  neutral:
    'bg-ink-800/60 text-ink-200 border-ink-600/60 hover:border-ink-400/60 hover:text-white',
};

/**
 * Chip filtro toggabile e accessibile.
 *
 * - `aria-pressed` comunica lo stato attivo agli screen reader (non dipende
 *   solo dal colore → WCAG 1.4.1).
 * - Bersaglio minimo ~30px di altezza per l'uso a pollice su mobile.
 * - Focus ring globale via `*:focus-visible`.
 */
export function FilterChip({
  active,
  onToggle,
  children,
  variant = 'accent',
  count,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition',
        active ? ACTIVE[variant] : IDLE[variant],
      )}
    >
      {children}
      {typeof count === 'number' && (
        <span
          className={cn(
            'rounded-full px-1 text-[10px] font-semibold tabular-nums',
            active ? 'bg-black/20 text-white' : 'bg-ink-950/60 text-ink-300',
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
