import type { CanonStatus, ReferenceStatus, WorldStatus } from '@/types';
import { Badge } from './Badge';

/** Pill per stato di un mondo (homepage / pagina coming soon). */
export function WorldStatusPill({ status }: { status: WorldStatus }) {
  if (status === 'available')
    return <Badge variant="success">Available</Badge>;
  if (status === 'coming_soon')
    return <Badge variant="warning">Coming soon</Badge>;
  return <Badge>Hidden</Badge>;
}

/** Pill per livello canon di un evento/arco. */
export function CanonPill({ canon }: { canon: CanonStatus }) {
  const map: Record<CanonStatus, { label: string; variant: 'success' | 'warning' | 'default' | 'accent' | 'danger' }> = {
    canon: { label: 'Canon', variant: 'success' },
    anime_only: { label: 'Anime only', variant: 'accent' },
    movie: { label: 'Movie', variant: 'accent' },
    filler: { label: 'Filler', variant: 'warning' },
    novel: { label: 'Novel', variant: 'accent' },
    uncertain: { label: 'Uncertain', variant: 'warning' },
  };
  const { label, variant } = map[canon];
  return <Badge variant={variant}>{label}</Badge>;
}

/** Pill per stato di verifica delle fonti. */
export function ReferencePill({ status }: { status: ReferenceStatus }) {
  if (status === 'verified')
    return <Badge variant="success">Verified</Badge>;
  if (status === 'needs_verification')
    return <Badge variant="warning">Da verificare</Badge>;
  return <Badge>Unknown</Badge>;
}
