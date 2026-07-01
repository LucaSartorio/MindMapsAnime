import { cn } from '@/lib/cn';

interface ToggleRowProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  /** Descrizione secondaria opzionale (contesto per screen reader e utenti). */
  description?: string;
  accent?: 'chakra' | 'ember';
}

/**
 * Riga con interruttore accessibile (`role="switch"`).
 *
 * - Un unico `<button role="switch" aria-checked>` incapsula label + track:
 *   toccare qualsiasi punto della riga cambia stato (bersaglio ampio, comodo a
 *   pollice). Tastiera: Invio/Spazio nativi del button.
 * - Lo stato NON è comunicato dal solo colore: il pallino si sposta e
 *   `aria-checked` è esposto all'assistive tech (WCAG 1.4.1 / 4.1.2).
 */
export function ToggleRow({
  checked,
  onChange,
  label,
  description,
  accent = 'chakra',
}: ToggleRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-lg px-1 py-1.5 text-left transition hover:bg-ink-800/40"
    >
      <span
        aria-hidden
        className={cn(
          'relative h-5 w-9 shrink-0 rounded-full border transition',
          checked
            ? accent === 'ember'
              ? 'border-ember-400 bg-ember-500/80'
              : 'border-chakra-400 bg-chakra-500/80'
            : 'border-ink-600 bg-ink-700/60',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-all',
            checked ? 'left-[1.125rem]' : 'left-0.5',
          )}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-ink-100">{label}</span>
        {description && (
          <span className="block text-[11px] leading-snug text-ink-400">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}
