import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import type { EntityRef } from '@/lib/graph';
import { entityRefLabel } from '@/lib/graphRefs';
import { getLocalizedText } from '@/utils/localization';
import { useLocaleStore } from '@/store/useLocaleStore';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { cn } from '@/lib/cn';
import { refPath } from '@/seo/links';
import type { ResolvedPage } from '@/seo/metadata';
import { categoryPath, timelinePath } from '@/seo/paths';

/**
 * Mattoni condivisi delle pagine SEO (landing, entità, directory, timeline).
 * Solo HTML semantico e link reali: `<article>`, un solo `<h1>`, `<section>`
 * con `<h2>`, `<dl>` per i dati, `<a href>` per ogni relazione.
 */

export function PageShell({
  resolved,
  eyebrow,
  title,
  subtitle,
  lead,
  actions,
  media,
  children,
}: {
  resolved: ResolvedPage;
  eyebrow?: ReactNode;
  title: string;
  subtitle?: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  media?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Breadcrumbs resolved={resolved} />
      <header className={cn('grid gap-6', media && 'md:grid-cols-[minmax(0,1fr)_14rem] md:items-start')}>
        <div className="space-y-3 min-w-0">
          {eyebrow && (
            <p className="font-mono text-xs uppercase tracking-widest text-chakra-300">{eyebrow}</p>
          )}
          <h1 className="font-display text-3xl sm:text-4xl text-ink-100 leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-ink-300 italic">{subtitle}</p>}
          {lead && <div className="text-base text-ink-200 leading-relaxed max-w-3xl space-y-3">{lead}</div>}
          {actions && <div className="flex flex-wrap gap-3 pt-1">{actions}</div>}
        </div>
        {media}
      </header>
      {children}
    </article>
  );
}

export function Section({
  id,
  title,
  count,
  children,
  more,
}: {
  id: string;
  title: string;
  count?: number;
  children: ReactNode;
  more?: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`${id}-title`} className="font-display text-xl text-ink-100">
          {title}
          {count != null && <span className="ml-2 text-sm font-sans text-ink-400">({count})</span>}
        </h2>
        {more}
      </div>
      {children}
    </section>
  );
}

/** Elenco di entità collegate come link reali (chip). */
export function RefLinks({
  dataset,
  lang,
  refs,
  limit,
}: {
  dataset: WorldDataset;
  lang: ResolvedPage['lang'];
  refs: EntityRef[];
  limit?: number;
}) {
  const locale = useLocaleStore((s) => s.locale);
  const shown = limit ? refs.slice(0, limit) : refs;
  return (
    <ul className="flex flex-wrap gap-2">
      {shown.map((ref) => {
        const href = refPath(lang, dataset, ref);
        const label = entityRefLabel(dataset, ref, locale);
        return (
          <li key={`${ref.type}:${ref.id}`}>
            {href ? (
              <Link to={href} className="chip hover:border-chakra-500/60 hover:text-white">
                {label}
              </Link>
            ) : (
              <span className="chip">{label}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Elenco "ricco": link + una riga di descrizione (per indici e landing). */
export function LinkCards({
  items,
}: {
  items: { key: string; href: string; title: string; description?: string; meta?: string }[];
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <li key={it.key} className="cv-auto">
          <Link
            to={it.href}
            className="panel-soft block h-full p-4 transition hover:border-chakra-500/60"
          >
            <span className="block font-display text-base text-ink-100">{it.title}</span>
            {it.meta && <span className="block text-[11px] font-mono uppercase tracking-wide text-ink-400 mt-0.5">{it.meta}</span>}
            {it.description && (
              <span className="block text-sm text-ink-300 leading-relaxed mt-1.5 line-clamp-3">{it.description}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FactList({ items }: { items: { label: string; value: ReactNode }[] }) {
  const shown = items.filter((i) => i.value !== undefined && i.value !== null && i.value !== '');
  if (shown.length === 0) return null;
  return (
    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2 text-sm">
      {shown.map((i) => (
        <div key={i.label} className="flex gap-2 border-b border-ink-800/70 pb-2">
          <dt className="text-ink-400 shrink-0">{i.label}</dt>
          <dd className="text-ink-100 min-w-0">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function MapCta({ to, label, secondary }: { to: string; label: string; secondary?: boolean }) {
  return (
    <Link to={to} className={cn(secondary ? 'btn-ghost' : 'btn-primary', 'inline-flex items-center gap-2')}>
      <span aria-hidden>◈</span> {label}
    </Link>
  );
}

/** Nota su fonti e titolarità dell'opera (niente markup che suggerisca ufficialità). */
export function SourceNote({ dataset }: { dataset: WorldDataset }) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const title = getLocalizedText(dataset.world.title, locale);
  const md = dataset.world.metadata ?? {};
  const owners = [md.author, md.publisher].filter((x): x is string => typeof x === 'string').join(' / ');
  return (
    <aside className="text-xs text-ink-400 leading-relaxed border-t border-ink-800/70 pt-4">
      {t('seoPages.sourceNote', { world: title, owners: owners || title })}
    </aside>
  );
}

/** Link "vedi tutti" verso un indice. */
export function SeeAll({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="text-sm text-chakra-300 hover:underline">
      {label} →
    </Link>
  );
}

/** Paginazione con link reali (`/page/N`), crawlabili, ognuna con canonical propria. */
export function Pagination({ resolved }: { resolved: ResolvedPage }) {
  const { t } = useTranslation();
  const p = resolved.page;
  if (p.kind !== 'category' && p.kind !== 'timeline') return null;
  if (p.pageCount <= 1) return null;
  const href = (n: number) =>
    p.kind === 'timeline'
      ? timelinePath(resolved.lang, p.dataset, n)
      : categoryPath(resolved.lang, p.dataset, p.category, n);
  return (
    <nav aria-label={t('seoPages.pagination')} className="flex flex-wrap items-center gap-2 text-sm">
      {Array.from({ length: p.pageCount }, (_, i) => i + 1).map((n) =>
        n === p.page ? (
          <span key={n} aria-current="page" className="chip border-chakra-500/60 text-chakra-100">
            {t('seoPages.page', { n })}
          </span>
        ) : (
          <Link key={n} to={href(n)} className="chip hover:border-chakra-500/60">
            {t('seoPages.page', { n })}
          </Link>
        ),
      )}
    </nav>
  );
}
