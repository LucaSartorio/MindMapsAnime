import type { AnimeWorld } from '@/types';
import { WorldCard } from './WorldCard';

interface WorldGridProps {
  worlds: AnimeWorld[];
}

export function WorldGrid({ worlds }: WorldGridProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {worlds.map((w) => (
        <li key={w.id} className="flex flex-col">
          <WorldCard world={w} />
        </li>
      ))}
    </ul>
  );
}
