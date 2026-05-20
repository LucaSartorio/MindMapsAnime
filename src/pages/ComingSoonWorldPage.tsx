import { Link } from 'react-router-dom';
import type { AnimeWorld } from '@/types';
import { Card } from '@/components/common/Card';
import { WorldStatusPill } from '@/components/common/StatusPill';

interface ComingSoonWorldPageProps {
  world: AnimeWorld;
}

export function ComingSoonWorldPage({ world }: ComingSoonWorldPageProps) {
  return (
    <div className="flex-1 grid place-items-center px-6 py-16">
      <Card className="max-w-lg w-full p-8 text-center space-y-5">
        <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">
          /worlds/{world.slug}
        </p>
        <h1 className="font-display text-3xl text-ink-100">{world.title}</h1>
        <div className="flex justify-center">
          <WorldStatusPill status={world.status} />
        </div>
        <p className="text-sm text-ink-300 leading-relaxed">
          {world.description}
        </p>
        <p className="text-sm text-yellow-300/80">
          La mappa interattiva non è ancora disponibile.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          ← Torna alla homepage
        </Link>
      </Card>
    </div>
  );
}
