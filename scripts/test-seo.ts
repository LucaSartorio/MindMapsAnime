/**
 * Test SEO sulle SORGENTI (`npm run test:seo`): invarianti del layer
 * `src/seo/` verificati su TUTTI i dataset registrati, senza framework di test
 * (node:assert). Complementare a `scripts/seo-check.ts`, che verifica invece
 * l'HTML generato in `dist/`.
 *
 *  - slugify: spazi, apostrofi, diacritici, unicode, simboli, riservati;
 *  - ogni entità con pagina ha uno slug unico e risolvibile (id ↔ slug);
 *  - parse/costruzione URL: ogni pagina enumerata si risolve in se stessa;
 *  - metadati: title/description/canonical presenti, title unici, canonical
 *    assoluta, hreflang reciproci e solo verso pagine indicizzabili;
 *  - sitemap: nessun duplicato, niente noindex/route tecniche, copertura;
 *  - slug stabili: tutte le entità nel lock pubblicato (`npm run seo:slugs`),
 *    stesso slug in ogni lingua, redirect verso slug vivi;
 *  - localizzazione: nessun testo narrativo senza `{ it, en }`.
 */
import assert from 'node:assert/strict';
import type { WorldDataset } from '../src/types';
import { animeWorlds } from '../src/data/worlds';
import { hasWorldDataset, loadWorldDataset } from '../src/data/registry';
import { SEO_CATEGORIES, categoryEntities } from '../src/seo/categories';
import { getSlugIndex, slugify, RESERVED_SLUGS } from '../src/seo/slug';
import { absoluteUrl, parseSeoPath, swapLangInPath } from '../src/seo/paths';
import { buildPageMeta, resolveSeoPath, isIndexable } from '../src/seo/metadata';
import { enumeratePages } from '../src/seo/routes';
import { buildSitemaps } from '../src/seo/sitemap';
import { SITE, isTechnicalPath, seoLocaleFor } from '../src/seo/config';
import { auditLocalizable } from '../src/utils/localizableFields';

let passed = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`✓ ${name}`);
  } catch (e) {
    console.error(`✗ ${name}\n  ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

async function main() {
  const datasets = new Map<string, WorldDataset>();
  for (const w of animeWorlds) {
    if (w.status === 'available' && hasWorldDataset(w.slug)) {
      const d = await loadWorldDataset(w.slug);
      if (d) datasets.set(w.slug, d);
    }
  }

  test('slugify: casi limite', () => {
    assert.equal(slugify('Itachi Uchiha'), 'itachi-uchiha');
    assert.equal(slugify("Goku's House"), 'gokus-house');
    assert.equal(slugify('Jinchūriki'), 'jinchuriki');
    assert.equal(slugify('Konohagakure (Hidden Leaf)'), 'konohagakure-hidden-leaf');
    assert.equal(slugify('Clans & Factions'), 'clans-and-factions');
    assert.equal(slugify('  --Mera Mera no Mi!!-- '), 'mera-mera-no-mi');
    assert.equal(slugify('ナルト'), '');
    assert.equal(slugify('Rufy «Cappello di Paglia» · Monkey D.'), 'rufy-cappello-di-paglia-monkey-d');
    assert.equal(slugify('Kurapika’s Vengeance'), 'kurapikas-vengeance');
    assert.ok(!RESERVED_SLUGS.has(slugify('Naruto')));
  });

  test('lingua URL per lingua UI (ja/fr/de/es → en)', () => {
    assert.equal(seoLocaleFor('it'), 'it');
    assert.equal(seoLocaleFor('en'), 'en');
    for (const l of ['ja', 'fr', 'de', 'es'] as const) assert.equal(seoLocaleFor(l), 'en');
    assert.equal(swapLangInPath('/it/naruto/map', 'en'), '/en/naruto/map');
    assert.equal(swapLangInPath('/en', 'it'), '/it');
  });

  test('parser: forme non canoniche e route sconosciute', () => {
    assert.equal(parseSeoPath('/').kind, 'unknown');
    assert.equal(parseSeoPath('/fr/naruto').kind, 'unknown');
    assert.equal(parseSeoPath('/en/naruto/unknown-section').kind, 'unknown');
    assert.equal(parseSeoPath('/en/naruto/locations/page/1').kind, 'unknown');
    assert.equal(parseSeoPath('/en/naruto/locations/page/abc').kind, 'unknown');
    assert.equal(parseSeoPath('/en/about').kind, 'static');
    assert.ok(isTechnicalPath('/og/naruto.png') && isTechnicalPath('/share/x') && !isTechnicalPath('/en/naruto'));
  });

  test('slug: unici, risolvibili, non riservati (tutti i mondi e categorie)', () => {
    for (const d of datasets.values()) {
      const idx = getSlugIndex(d);
      for (const c of SEO_CATEGORIES) {
        const entities = categoryEntities(d, c);
        assert.equal(idx.byId[c].size, entities.length, `${d.world.slug}/${c}: entità senza slug`);
        const slugs = new Set(idx.byId[c].values());
        assert.equal(slugs.size, entities.length, `${d.world.slug}/${c}: slug duplicati`);
        for (const [id, slug] of idx.byId[c]) {
          assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${d.world.slug}/${c}/${id}: slug non valido "${slug}"`);
          assert.ok(!RESERVED_SLUGS.has(slug), `${slug} riservato`);
          assert.equal(idx.bySlug[c].get(slug), id);
        }
      }
    }
  });

  test('slug stabili: ogni entità è nel lock pubblicato, i redirect puntano a slug vivi', () => {
    for (const d of datasets.values()) {
      assert.ok(d.seoSlugs, `${d.world.slug}: seoSlugs mancante (npm run seo:slugs)`);
      const idx = getSlugIndex(d);
      assert.equal(idx.unlocked.length, 0, `${d.world.slug}: slug non congelati ${idx.unlocked.slice(0, 5).join(', ')} → npm run seo:slugs`);
      for (const c of SEO_CATEGORIES) {
        for (const [from, id] of idx.redirects[c]) {
          const to = idx.byId[c].get(id);
          assert.ok(to, `${d.world.slug}/${c}: redirect ${from} → id ${id} inesistente`);
          assert.notEqual(from, to, `${d.world.slug}/${c}: redirect su se stesso ${from}`);
          assert.ok(!idx.bySlug[c].has(from), `${d.world.slug}/${c}: ${from} è sia slug vivo sia redirect`);
        }
      }
    }
  });

  test('slug indipendenti dalla lingua: la stessa entità ha lo stesso slug in /it e /en', () => {
    for (const r of enumeratePages(datasets)) {
      if (r.page.kind !== 'entity' || r.lang !== 'it') continue;
      const other = resolveSeoPath(swapLangInPath(r.path, 'en'), (s) => datasets.get(s));
      assert.ok(other && other.page.kind === 'entity' && other.page.id === r.page.id, `${r.path}: controparte /en diversa`);
    }
  });

  test('localizzazione: nessun testo narrativo in stringa semplice o senza IT/EN', () => {
    for (const d of datasets.values()) {
      const errors = auditLocalizable(d).filter((i) => i.severity === 'error');
      assert.equal(
        errors.length,
        0,
        `${d.world.slug}: ${errors.length} campi non localizzati, es. ${errors.slice(0, 3).map((e) => `${e.kind}/${e.id}.${e.field} (${e.code})`).join('; ')} → npm run validate:i18n`,
      );
    }
  });

  const pages = enumeratePages(datasets);
  const getDs = (slug: string) => datasets.get(slug);

  test(`round-trip URL: ${pages.length} pagine si risolvono in se stesse`, () => {
    const seen = new Set<string>();
    for (const r of pages) {
      assert.ok(!seen.has(r.path), `path duplicato ${r.path}`);
      seen.add(r.path);
      assert.equal(r.path, r.path.toLowerCase(), `path non minuscolo ${r.path}`);
      assert.ok(!/\/$/.test(r.path) && !/[?#]/.test(r.path), `path non canonico ${r.path}`);
      const again = resolveSeoPath(r.path, getDs);
      assert.ok(again, `non risolvibile: ${r.path}`);
      assert.equal(again!.path, r.path);
    }
  });

  test('metadati: title/description/canonical per ogni pagina, title unici tra le indicizzabili', () => {
    const titles = new Map<string, string>();
    for (const r of pages) {
      const m = buildPageMeta(r);
      assert.ok(m.title.trim().length > SITE.name.length, `title vuoto ${r.path}`);
      assert.ok(m.title.includes(SITE.name), `title senza brand ${r.path}`);
      assert.ok(m.description.trim().length >= 40, `description troppo corta ${r.path}: "${m.description}"`);
      assert.equal(m.canonical, absoluteUrl(r.path));
      assert.ok(m.canonical.startsWith('https://animapverse.com/'));
      assert.ok(m.jsonLd.every((j) => j['@context'] === 'https://schema.org'));
      if (m.indexable) {
        const dup = titles.get(m.title);
        assert.ok(!dup, `title duplicato "${m.title}": ${dup} / ${r.path}`);
        titles.set(m.title, r.path);
      }
    }
  });

  test('hreflang: self + x-default, reciproci, solo verso versioni indicizzabili', () => {
    const byPath = new Map(pages.map((r) => [r.path, r]));
    for (const r of pages) {
      const m = buildPageMeta(r);
      if (!m.indexable) {
        assert.equal(m.alternates.length, 0, `noindex con hreflang ${r.path}`);
        continue;
      }
      assert.ok(m.alternates.some((a) => a.hreflang === r.lang && a.href === m.canonical), `self mancante ${r.path}`);
      assert.ok(m.alternates.some((a) => a.hreflang === 'x-default'), `x-default mancante ${r.path}`);
      for (const a of m.alternates) {
        const other = byPath.get(a.href.replace(SITE.origin, ''));
        assert.ok(other, `alternate verso pagina inesistente ${a.href}`);
        assert.ok(isIndexable(other!), `alternate verso noindex ${a.href}`);
        if (a.hreflang !== 'x-default') {
          const back = buildPageMeta(other!).alternates;
          assert.ok(back.some((b) => b.href === m.canonical), `non reciproco: ${a.href} ↛ ${r.path}`);
        }
      }
    }
  });

  test('sitemap: niente duplicati/noindex/route tecniche, copertura completa', () => {
    const files = buildSitemaps(pages);
    assert.equal(files[0].file, 'sitemap.xml');
    assert.ok(files[0].xml.includes('<sitemapindex'));
    const all = files.flatMap((f) => f.urls);
    assert.equal(new Set(all).size, all.length, 'URL duplicati in sitemap');
    const indexable = new Set(pages.filter((r) => isIndexable(r)).map((r) => absoluteUrl(r.path)));
    for (const u of all) {
      assert.ok(indexable.has(u), `URL non indicizzabile in sitemap: ${u}`);
      assert.ok(!isTechnicalPath(u.replace(SITE.origin, '')));
    }
    assert.equal(all.length, indexable.size, 'pagine indicizzabili mancanti dalla sitemap');
    for (const f of files.slice(1)) assert.ok(f.urls.length <= 50000);
  });

  test('ogni mondo disponibile ha landing, mappa e indici indicizzabili; i mondi "in arrivo" no', () => {
    for (const w of animeWorlds.filter((x) => x.status !== 'hidden')) {
      for (const lang of ['it', 'en'] as const) {
        const landing = pages.find((r) => r.lang === lang && r.page.kind === 'world' && r.page.world.id === w.id);
        assert.ok(landing, `landing mancante ${w.slug}/${lang}`);
        assert.equal(isIndexable(landing!), w.status === 'available' && datasets.has(w.slug));
      }
      if (!datasets.has(w.slug)) continue;
      for (const kind of ['map', 'timeline'] as const) {
        assert.ok(pages.some((r) => r.page.kind === kind && 'dataset' in r.page && r.page.dataset?.world.id === w.id), `${kind} mancante ${w.slug}`);
      }
      for (const c of ['characters', 'locations', 'arcs'] as const) {
        assert.ok(
          pages.some((r) => r.page.kind === 'category' && r.page.category === c && r.page.dataset.world.id === w.id),
          `indice ${c} mancante ${w.slug}`,
        );
      }
    }
  });

  console.log(`\n${passed} test superati${process.exitCode ? ' — CI SONO FALLIMENTI' : ''}`);
}

void main();
