import { useId } from 'react';

interface FilterSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Label accessibile (visivamente nascosta): descrive cosa si sta cercando. */
  label: string;
  clearLabel: string;
}

/**
 * Campo di ricerca "dentro" una sezione (es. filtra la lista personaggi).
 *
 * - `type="search"` + label collegata via `htmlFor` (label nascosta ma presente
 *   per gli screen reader).
 * - Pulsante "pulisci" appare solo quando c'è testo; ha aria-label esplicita.
 */
export function FilterSearchField({
  value,
  onChange,
  placeholder,
  label,
  clearLabel,
}: FilterSearchFieldProps) {
  const id = useId();
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span
        aria-hidden
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field pl-8 pr-8"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={clearLabel}
          className="absolute right-1.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-ink-300 transition hover:bg-ink-700/60 hover:text-white"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
