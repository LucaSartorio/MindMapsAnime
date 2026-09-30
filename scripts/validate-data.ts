/**
 * Script CLI per `npm run validate:data`.
 *
 * Valida TUTTI i mondi registrati (data-driven, via `src/data/registry.ts`):
 * integrità referenziale (`validateDataset`) + SEO (slug congelati, duplicati,
 * mancanti, contenuto minimo delle pagine entità).
 * Exit code:
 *  - 0 → nessun errore (eventuali warning sono solo informativi)
 *  - 1 → almeno un errore di integrità
 */
import type { WorldDataset } from '../src/types';
import { validateDataset } from '../src/utils/validateDataset';
import { animeWorlds, getWorldUrlSlug } from '../src/data/worlds';
import { hasWorldDataset, loadWorldDataset } from '../src/data/registry';
import { getLocalizedText } from '../src/utils/localization';
import { SEO_CATEGORIES, categoryEntities } from '../src/seo/categories';
import { getSlugIndex, slugify } from '../src/seo/slug';
import { STATIC_PAGES } from '../src/seo/paths';
import { entityQuality } from '../src/seo/quality';

const datasets: WorldDataset[] = [];
for (const w of animeWorlds) {
  if (w.status !== 'available') continue;
  if (!hasWorldDataset(w.slug)) {
    console.error(`[ERR ] world/${w.slug} · status 'available' ma nessun loader in src/data/registry.ts`);
    process.exit(1);
  }
  const d = await loadWorldDataset(w.slug);
  if (d) datasets.push(d);
}

const lines: string[] = [];
lines.push('=== AniMapVerse · dataset validator ===');

let anyErrors = false;

for (const dataset of datasets) {
  const report = validateDataset(dataset);
  anyErrors = anyErrors || report.hasErrors;

  lines.push('');
  lines.push(`World: ${getLocalizedText(dataset.world.title, 'en')} (${dataset.world.slug})`);
  lines.push('');
  lines.push(`Characters: ${dataset.characters.length}`);
  lines.push(`Factions  : ${dataset.factions.length}`);
  lines.push(`Teams     : ${dataset.teams?.length ?? 0}`);
  lines.push(`Arcs      : ${dataset.arcs.length}`);
  lines.push(`Events    : ${dataset.events.length}`);
  lines.push(`Routes    : ${dataset.routes.length}`);
  lines.push(`Locations : ${dataset.locations.length}`);
  lines.push(`Nations   : ${dataset.nations.length}`);
  lines.push(`Boundaries: ${dataset.boundaries?.length ?? 0}`);
  lines.push(`Jutsu     : ${dataset.jutsu?.length ?? 0}`);
  lines.push('');
  lines.push(`Errors  : ${report.errors.length}`);
  lines.push(`Warnings: ${report.warnings.length}`);

  if (report.errors.length > 0) {
    lines.push('--- ERRORS ---');
    for (const e of report.errors) {
      lines.push(`[ERR ] ${e.entity}/${e.id ?? '?'} · ${e.code} · ${e.message}`);
    }
  }

  if (report.warnings.length > 0) {
    lines.push('--- WARNINGS ---');
    for (const w of report.warnings) {
      lines.push(`[WARN] ${w.entity}/${w.id ?? '?'} · ${w.code} · ${w.message}`);
    }
  }
  // --- SEO: slug delle pagine entità (src/seo/slug.ts + src/data/<world>/slugs.ts) ---
  const slugIndex = getSlugIndex(dataset);
  const seoErr = (m: string) => {
    anyErrors = true;
    lines.push(`[ERR ] ${m}`);
  };
  if (!dataset.seoSlugs) {
    seoErr(`seo/${dataset.world.slug} · slug_lock_missing · manca \`seoSlugs\` nel dataset → npm run seo:slugs e importa src/data/${dataset.world.slug}/slugs.ts in index.ts`);
  }
  for (const u of slugIndex.unlocked) {
    seoErr(`seo/${u.category}/${u.id} · slug_not_locked · slug "${u.slug}" solo derivato (non congelato) → npm run seo:slugs`);
  }
  for (const category of SEO_CATEGORIES) {
    const seen = new Map<string, string>();
    for (const [id, slug] of slugIndex.byId[category]) {
      const other = seen.get(slug);
      if (other) seoErr(`seo/${category}/${id} · duplicate_slug · "${slug}" già usato da ${other}`);
      seen.set(slug, id);
    }
    for (const e of categoryEntities(dataset, category)) {
      for (const s of [e.slug, ...(e.previousSlugs ?? [])].filter((x): x is string => !!x)) {
        if (slugify(s) !== s) {
          seoErr(`seo/${category}/${e.id} · invalid_slug · "${s}" non è kebab-case ASCII (atteso "${slugify(s)}")`);
        }
      }
    }
  }
  for (const r of slugIndex.renamed) {
    lines.push(`[WARN] seo/${r.category}/${r.id} · slug_renamed · "${r.from}" → "${r.to}" (redirect permanente) → npm run seo:slugs`);
  }
  for (const s of slugIndex.stale) {
    lines.push(`[INFO] seo/${s.category}/${s.id} · slug_retired · "${s.slug}" (entità rimossa: slug riservato, mai riassegnato)`);
  }
  for (const c of slugIndex.collisions) {
    lines.push(
      `[WARN] seo/${c.category} · slug_collision · "${c.slug}" condiviso da ${c.ids.join(', ')} → disambiguato con suffisso; valuta \`slug\` esplicito`,
    );
  }
  // Contenuto minimo: le entità sotto soglia hanno una pagina `noindex` (informativo).
  const thin = SEO_CATEGORIES.map((c) => {
    const list = categoryEntities(dataset, c);
    const below = list.filter((e) => !entityQuality(dataset, c, e.id, 'en').indexable && !entityQuality(dataset, c, e.id, 'it').indexable);
    return below.length ? `${c} ${below.length}/${list.length}` : '';
  }).filter(Boolean);
  if (thin.length) lines.push(`[INFO] seo · sotto la soglia di contenuto (pagina noindex): ${thin.join(' · ')}`);
  lines.push('────────────────────────────────────────');
}

// --- SEO: slug URL dei mondi ---
{
  const seen = new Map<string, string>();
  for (const w of animeWorlds) {
    const u = getWorldUrlSlug(w);
    if (slugify(u) !== u) {
      anyErrors = true;
      lines.push(`[ERR ] world/${w.slug} · invalid_url_slug · "${u}"`);
    }
    if ((STATIC_PAGES as readonly string[]).includes(u)) {
      anyErrors = true;
      lines.push(`[ERR ] world/${w.slug} · reserved_url_slug · "${u}" collide con una pagina statica`);
    }
    const dup = seen.get(u);
    if (dup) {
      anyErrors = true;
      lines.push(`[ERR ] world/${w.slug} · duplicate_url_slug · "${u}" già usato da ${dup}`);
    }
    seen.set(u, w.slug);
  }
}

// eslint-disable-next-line no-console
console.log(lines.join('\n'));

process.exit(anyErrors ? 1 : 0);
