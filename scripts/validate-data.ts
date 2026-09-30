/**
 * Script CLI per `npm run validate:data`.
 *
 * Stampa report leggibile dei problemi rilevati nel dataset Naruto.
 * Exit code:
 *  - 0 → nessun errore (eventuali warning sono solo informativi)
 *  - 1 → almeno un errore di integrità
 */
import type { WorldDataset } from '../src/types';
import { narutoDataset } from '../src/data/naruto';
import { hunterxhunterDataset } from '../src/data/hunterxhunter';
import { onepieceDataset } from '../src/data/onepiece';
import { dragonballDataset } from '../src/data/dragonball';
import { blackcloverDataset } from '../src/data/blackclover';
import { validateDataset } from '../src/utils/validateDataset';
import { animeWorlds, getWorldUrlSlug } from '../src/data/worlds';
import { SEO_CATEGORIES, categoryEntities } from '../src/seo/categories';
import { getSlugIndex, slugify } from '../src/seo/slug';
import { STATIC_PAGES } from '../src/seo/paths';

const datasets: WorldDataset[] = [
  narutoDataset,
  hunterxhunterDataset,
  onepieceDataset,
  dragonballDataset,
  blackcloverDataset,
];

const lines: string[] = [];
lines.push('=== Anime Interactive Maps · dataset validator ===');

let anyErrors = false;

for (const dataset of datasets) {
  const report = validateDataset(dataset);
  anyErrors = anyErrors || report.hasErrors;

  lines.push('');
  lines.push(`World: ${dataset.world.title} (${dataset.world.slug})`);
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
  // --- SEO: slug delle pagine entità (src/seo/slug.ts) ---
  const slugIndex = getSlugIndex(dataset);
  for (const c of slugIndex.collisions) {
    lines.push(
      `[WARN] seo/${c.category} · slug_collision · "${c.slug}" condiviso da ${c.ids.join(', ')} → disambiguato con suffisso; valuta \`slug\` esplicito`,
    );
  }
  for (const category of SEO_CATEGORIES) {
    for (const e of categoryEntities(dataset, category)) {
      for (const s of [e.slug, ...(e.previousSlugs ?? [])].filter((x): x is string => !!x)) {
        if (slugify(s) !== s) {
          anyErrors = true;
          lines.push(`[ERR ] seo/${category}/${e.id} · invalid_slug · "${s}" non è kebab-case ASCII (atteso "${slugify(s)}")`);
        }
      }
    }
  }
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
