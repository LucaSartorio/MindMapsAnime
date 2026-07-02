import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
  /** Conteggio opzionale mostrato come badge accanto all'etichetta. */
  badge?: number;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  /** Etichetta accessibile del gruppo di tab. */
  ariaLabel: string;
  defaultTabId?: string;
}

/**
 * Tabs accessibili (pattern WAI-ARIA):
 * - `role="tablist"` con figli `role="tab"` (aria-selected + roving tabindex);
 * - ←/→ (e ↑/↓) spostano selezione e focus, Home/End agli estremi;
 * - il pannello attivo ha `role="tabpanel"` + `aria-labelledby`, focusabile.
 * La tablist è sticky in cima al pannello scrollabile.
 */
export function Tabs({ items, ariaLabel, defaultTabId }: TabsProps) {
  const baseId = useId();
  const [active, setActive] = useState(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeIndex = Math.max(0, items.findIndex((i) => i.id === active));
  const activeItem = items[activeIndex] ?? items[0];
  if (!activeItem) return null;

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  function focusTab(index: number) {
    const it = items[(index + items.length) % items.length];
    setActive(it.id);
    tabRefs.current[it.id]?.focus();
  }
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        focusTab(activeIndex + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        focusTab(activeIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusTab(0);
        break;
      case 'End':
        e.preventDefault();
        focusTab(items.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className="sticky top-0 z-10 -mx-5 mb-4 flex gap-1 overflow-x-auto border-b border-ink-700/60 bg-ink-900/90 px-5 backdrop-blur scrollbar-none"
      >
        {items.map((it) => {
          const selected = it.id === activeItem.id;
          return (
            <button
              key={it.id}
              ref={(el) => {
                tabRefs.current[it.id] = el;
              }}
              id={tabId(it.id)}
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(it.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(it.id)}
              className={cn(
                '-mb-px flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-medium transition',
                selected
                  ? 'border-chakra-400 text-white'
                  : 'border-transparent text-ink-300 hover:text-white',
              )}
            >
              {it.label}
              {typeof it.badge === 'number' && it.badge > 0 && (
                <span className="count-badge">{it.badge}</span>
              )}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={panelId(activeItem.id)}
        aria-labelledby={tabId(activeItem.id)}
        tabIndex={0}
        className="space-y-5 focus:outline-none"
      >
        {activeItem.content}
      </div>
    </div>
  );
}
