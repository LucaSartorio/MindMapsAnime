import type { CanonStatus, ReferenceStatus, WorldStatus } from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import {
  getCanonStatusLabel,
  getReferenceStatusLabel,
  getWorldStatusLabel,
} from '@/utils/localization';
import { Badge } from './Badge';

/** Pill per stato di un mondo (homepage / pagina coming soon). */
export function WorldStatusPill({ status }: { status: WorldStatus }) {
  const locale = useLocaleStore((s) => s.locale);
  const variant = status === 'available' ? 'success' : status === 'coming_soon' ? 'warning' : undefined;
  return <Badge variant={variant}>{getWorldStatusLabel(status, locale)}</Badge>;
}

const CANON_VARIANT: Record<CanonStatus, 'success' | 'warning' | 'default' | 'accent' | 'danger'> = {
  canon: 'success',
  anime_only: 'accent',
  movie: 'accent',
  filler: 'warning',
  novel: 'accent',
  uncertain: 'warning',
};

/** Pill per livello canon di un evento/arco. */
export function CanonPill({ canon }: { canon: CanonStatus }) {
  const locale = useLocaleStore((s) => s.locale);
  return <Badge variant={CANON_VARIANT[canon]}>{getCanonStatusLabel(canon, locale)}</Badge>;
}

/** Pill per stato di verifica delle fonti. */
export function ReferencePill({ status }: { status: ReferenceStatus }) {
  const locale = useLocaleStore((s) => s.locale);
  const variant = status === 'verified' ? 'success' : status === 'needs_verification' ? 'warning' : undefined;
  return <Badge variant={variant}>{getReferenceStatusLabel(status, locale)}</Badge>;
}
