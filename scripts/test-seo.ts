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
 *  - localizzazione: nessun testo narrativo senza `{ it, en }`;
 *  - canonical verso altra risorsa (percorsi derivati): destinazione
 *    indicizzabile, niente noindex/hreflang/sitemap sulla pagina;
 *  - lingue aggiuntive (es): pagine solo per i mondi tradotti, link che
 *    ricadono su `/en` per gli altri;
 *  - landing / mappa / indice archi: title distinti (niente cannibalizzazione),
 *    description della landing dai dati (mai lore troncata);
 *  - indice delle traduzioni (`npm run i18n:index`) allineato ai dati;
 *  - parità prerender ↔ idratazione: con il solo overlay della lingua URL (come
 *    nel browser) title, description, canonical, robots e hreflang non cambiano;
 *  - link fra mondi (SEO-05): solo mappe pubblicate, indicizzabili, nella lingua
 *    della pagina, mai la pagina stessa.
 */
import assert from 'node:assert/strict';
import type { WorldDataset } from '../src/types';
import { animeWorlds } from '../src/data/worlds';
import {
  ensureWorldTranslation,
  hasWorldDataset,
  loadWorldDataset,
  loadWorldDatasetWithTranslations,
  worldTranslationLocales,
} from '../src/data/registry';
import { SEO_CATEGORIES, categoryEntities } from '../src/seo/categories';
import { getSlugIndex, slugify, RESERVED_SLUGS } from '../src/seo/slug';
import { absoluteUrl, langFromPath, mapPath, parseSeoPath, swapLangInPath, worldPath } from '../src/seo/paths';
import { otherWorldMaps, worldsWithMap } from '../src/seo/worldLinks';
import { buildPageMeta, canonicalTargetPath, resolveSeoPath, isIndexable } from '../src/seo/metadata';
import { enumeratePages } from '../src/seo/routes';
import { buildSitemaps } from '../src/seo/sitemap';
import { SEO_LOCALES, SITE, isTechnicalPath, seoLocaleFor, worldHasSeoLocale, type SeoLocale } from '../src/seo/config';
import { auditLocalizable } from '../src/utils/localizableFields';
import { getFactionTypeLabel } from '../src/utils/localization';
import { TRANSLATION_GAPS } from '../src/data/translationIndex';
import { computeTranslationGaps, publishedTranslationLocales } from '../src/seo/translationIndexBuild';

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

/**
 * Mondi su cui si simula il client (parità prerender ↔ idratazione): i più
 * grandi, pubblicati in tutte le lingue URL.
 */
const CLIENT_PARITY_WORLDS = ['naruto', 'onepiece'];

/** I campi della head che l'idratazione riscrive (vedi `src/seo/head.ts`). */
const headFields = (m: ReturnType<typeof buildPageMeta>) =>
  JSON.stringify([m.title, m.description, m.canonical, m.robots, m.indexable, m.alternates]);

/**
 * Metadati come li calcola il BROWSER dopo `hydrateRoot`: il client applica
 * solo l'overlay della lingua dell'URL (`preloadRoute` / `WorldRoute` →
 * `ensureWorldTranslation`), il prerender tutti. Gli overlay si applicano IN
 * PLACE sugli stessi oggetti del registry (i nomi tradotti dipendono da
 * WeakSet di modulo: un `structuredClone` non sarebbe fedele), quindi i
 * metadati si fotografano in sequenza: /it e /en senza overlay, /es con il
 * solo overlay es, /fr con es+fr (unica approssimazione: l'overlay es non
 * influisce sui testi e sui nomi francesi).
 */
async function captureClientHeads(): Promise<Map<string, string>> {
  const raw = new Map<string, WorldDataset>();
  for (const slug of CLIENT_PARITY_WORLDS) {
    const d = await loadWorldDataset(slug);
    if (d) raw.set(slug, d);
  }
  const out = new Map<string, string>();
  const snap = (langs: readonly SeoLocale[]) => {
    for (const r of enumeratePages(raw)) {
      if (!langs.includes(r.lang) || !('dataset' in r.page) || !r.page.dataset) continue;
      if (!CLIENT_PARITY_WORLDS.includes(r.page.dataset.world.slug)) continue;
      out.set(r.path, headFields(buildPageMeta(r)));
    }
  };
  snap(['it', 'en']);
  for (const lang of ['es', 'fr'] as const) {
    for (const slug of raw.keys()) await ensureWorldTranslation(slug, lang);
    snap([lang]);
  }
  return out;
}

async function main() {
  // Prima che `loadWorldDatasetWithTranslations` applichi tutti gli overlay.
  const clientHeads = await captureClientHeads();

  const datasets = new Map<string, WorldDataset>();
  for (const w of animeWorlds) {
    if (w.status === 'available' && hasWorldDataset(w.slug)) {
      const d = await loadWorldDatasetWithTranslations(w.slug);
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

  test('lingua URL per lingua UI (ja/de → en; es/fr → se stesse solo sui mondi tradotti)', () => {
    assert.equal(seoLocaleFor('it'), 'it');
    assert.equal(seoLocaleFor('en'), 'en');
    assert.equal(seoLocaleFor('es'), 'es');
    assert.equal(seoLocaleFor('fr'), 'fr');
    for (const l of ['ja', 'de'] as const) assert.equal(seoLocaleFor(l), 'en');
    assert.equal(swapLangInPath('/it/naruto/map', 'en'), '/en/naruto/map');
    assert.equal(swapLangInPath('/es/naruto/map', 'it'), '/it/naruto/map');
    assert.equal(swapLangInPath('/fr/naruto/map', 'es'), '/es/naruto/map');
    assert.equal(swapLangInPath('/en', 'it'), '/it');
    for (const w of animeWorlds) {
      for (const lang of ['es', 'fr'] as const) {
        const has = worldHasSeoLocale(w, lang);
        assert.equal(seoLocaleFor(lang, w), has ? lang : 'en', `${w.slug} ${lang}`);
        // I link costruiti da una pagina /es o /fr non puntano mai a un mondo non tradotto in quella lingua.
        assert.ok(worldPath(lang, w).startsWith(has ? `/${lang}/` : '/en/'), `${w.slug}: ${worldPath(lang, w)}`);
        if (!has) assert.equal(resolveSeoPath(`/${lang}/${w.urlSlug ?? w.slug}`, (s) => datasets.get(s)), null, `${w.slug}: /${lang} senza traduzione`);
      }
    }
  });

  test('parser: forme non canoniche e route sconosciute', () => {
    assert.equal(parseSeoPath('/').kind, 'unknown');
    assert.equal(parseSeoPath('/de/naruto').kind, 'unknown');
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
        for (const [from, to] of idx.redirects[c]) {
          assert.ok(idx.bySlug[c].has(to), `${d.world.slug}/${c}: redirect ${from} → ${to} non è uno slug vivo`);
          assert.notEqual(from, to, `${d.world.slug}/${c}: redirect su se stesso ${from}`);
          assert.ok(!idx.bySlug[c].has(from), `${d.world.slug}/${c}: ${from} è sia slug vivo sia redirect`);
        }
      }
    }
  });

  test('slug indipendenti dalla lingua: la stessa entità ha lo stesso slug in ogni lingua URL', () => {
    for (const r of enumeratePages(datasets)) {
      if (r.page.kind !== 'entity' || r.lang !== 'it') continue;
      for (const lang of ['en', 'es', 'fr'] as const) {
        if (!worldHasSeoLocale(r.page.dataset.world, lang)) continue;
        const other = resolveSeoPath(swapLangInPath(r.path, lang), (s) => datasets.get(s));
        assert.ok(other && other.page.kind === 'entity' && other.page.id === r.page.id, `${r.path}: controparte /${lang} diversa`);
      }
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

  test('canonical verso altra risorsa: destinazione indicizzabile e auto-canonica, mai in sitemap/hreflang', () => {
    const sitemapUrls = new Set(buildSitemaps(pages).flatMap((s) => s.urls));
    let n = 0;
    for (const r of pages) {
      const target = canonicalTargetPath(r);
      if (!target) continue;
      n++;
      const meta = buildPageMeta(r);
      assert.equal(meta.canonical, absoluteUrl(target));
      assert.ok(!/noindex/.test(meta.robots), `${r.path}: noindex + canonical altrove (segnali contraddittori)`);
      assert.equal(meta.alternates.length, 0, `${r.path}: hreflang su pagina canonicalizzata`);
      assert.ok(!sitemapUrls.has(absoluteUrl(r.path)), `${r.path}: canonicalizzata ma in sitemap`);
      const t = resolveSeoPath(target, getDs);
      assert.ok(t && isIndexable(t) && buildPageMeta(t).canonical === absoluteUrl(target), `${r.path}: destinazione ${target} non indicizzabile`);
    }
    assert.ok(n > 0, 'nessuna pagina canonicalizzata: i percorsi derivati dovrebbero esserlo');
  });

  test(`round-trip URL: ${pages.length} pagine si risolvono in se stesse`, () => {
    const seen = new Set<string>();
    for (const r of pages) {
      assert.ok(!seen.has(r.path), `path duplicato ${r.path}`);
      assert.ok(r.path === `/${r.lang}` || r.path.startsWith(`/${r.lang}/`), `lingua del path ≠ ${r.lang}: ${r.path}`);
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
      assert.equal(m.canonical, absoluteUrl(canonicalTargetPath(r) ?? r.path));
      assert.ok(m.canonical.startsWith('https://animapverse.com/'));
      assert.ok(m.jsonLd.every((j) => j['@context'] === 'https://schema.org'));
      if (m.indexable) {
        const dup = titles.get(m.title);
        assert.ok(!dup, `title duplicato "${m.title}": ${dup} / ${r.path}`);
        titles.set(m.title, r.path);
      }
    }
  });

  test('title delle fazioni: tipo nella lingua dell\'URL (mai l\'id inglese umanizzato)', () => {
    for (const r of pages) {
      const p = r.page;
      if (p.kind !== 'entity' || p.category !== 'factions') continue;
      const f = p.dataset.factions.find((x) => x.id === p.id)!;
      const label = getFactionTypeLabel(String(f.type), r.lang);
      if (label) assert.ok(buildPageMeta(r).title.includes(`(${label})`), `${r.path}: tipo "${f.type}" non localizzato nel title`);
    }
  });

  test('landing, mappa e indice archi: intenti distinti, metadati derivati dai dati', () => {
    for (const r of pages) {
      const p = r.page;
      if (p.kind === 'world' && p.dataset) {
        const m = buildPageMeta(r);
        const places = categoryEntities(p.dataset, 'locations').length;
        // Niente lore tagliata a metà: la description è costruita dai conteggi e dalle regioni reali.
        assert.ok(!m.description.includes('…'), `${r.path}: description della landing troncata "${m.description}"`);
        assert.ok(m.description.includes(String(places)), `${r.path}: description senza il numero di luoghi`);
        assert.ok(m.description.length <= 200, `${r.path}: description della landing troppo lunga (${m.description.length})`);
      }
      if (p.kind === 'map') {
        const m = buildPageMeta(r);
        const landing = buildPageMeta({ ...r, path: worldPath(r.lang, p.dataset.world), page: { kind: 'world', world: p.dataset.world, dataset: p.dataset } });
        // La mappa possiede "<mondo> map": title diverso dalla landing e con il numero reale di luoghi.
        assert.notEqual(m.title, landing.title, `${r.path}: title uguale alla landing`);
        assert.ok(m.title.includes(String(categoryEntities(p.dataset, 'locations').length)), `${r.path}: title della mappa senza conteggio luoghi`);
        assert.ok(m.description.length <= 200, `${r.path}: description della mappa troppo lunga (${m.description.length})`);
      }
      if (p.kind === 'category' && p.category === 'arcs') {
        assert.ok(buildPageMeta(r).title.includes(String(p.dataset.arcs.length)), `${r.path}: title degli archi senza conteggio`);
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

  test('indice delle traduzioni (es/fr) allineato ai dati con tutti gli overlay', () => {
    // Da questo indice dipendono hreflang e noindex `not_translated` in prerender
    // E nel browser: se non corrisponde ai dati, una pagina /es con testi in
    // inglese verrebbe dichiarata indicizzabile (o viceversa).
    const expected: Record<string, unknown> = {};
    for (const [slug, d] of datasets) {
      const locales = publishedTranslationLocales(d.world);
      if (locales.length) expected[slug] = computeTranslationGaps(d, locales);
    }
    assert.deepEqual(
      JSON.parse(JSON.stringify(TRANSLATION_GAPS)),
      JSON.parse(JSON.stringify(expected)),
      'src/data/translationIndex.ts obsoleto → npm run i18n:index',
    );
  });

  test('idratazione: il client (solo l\'overlay della lingua URL) produce gli stessi metadati del prerender', () => {
    // Regressione SEO-01: dopo `hydrateRoot`, <Seo> riapplica buildPageMeta con il
    // dataset del browser. Title, description, canonical, robots, hreflang (e
    // og:locale:alternate, derivato dagli hreflang) devono coincidere con
    // l'HTML statico, altrimenti Google, che legge il DOM renderizzato, vede
    // cluster linguistici diversi e non reciproci.
    const mismatches: string[] = [];
    let compared = 0;
    for (const r of pages) {
      const onClient = clientHeads.get(r.path);
      if (onClient === undefined) continue;
      compared++;
      const prerender = buildPageMeta(r);
      if (onClient !== headFields(prerender)) {
        const alts = (j: string) => (JSON.parse(j)[5] as { hreflang: string }[]).map((x) => x.hreflang).join(',');
        mismatches.push(`${r.path} (prerender: ${alts(headFields(prerender))} · client: ${alts(onClient)})`);
      }
    }
    assert.equal(compared, clientHeads.size, 'pagine del client senza corrispettivo nel prerender');
    assert.ok(compared > 6000, `troppe poche pagine confrontate (${compared})`);
    assert.equal(
      mismatches.length,
      0,
      `${mismatches.length}/${compared} pagine con metadati diversi dopo l'idratazione, es.:\n    ${mismatches.slice(0, 5).join('\n    ')}`,
    );
  });

  test('link fra mondi (SEO-05): solo mappe pubblicate e indicizzabili, nella lingua della pagina, mai se stessa', () => {
    const published = worldsWithMap();
    assert.ok(published.length >= 2, 'servono almeno 2 mondi con mappa');
    // Pubblicato = disponibile E con dataset: i mondi "in arrivo" non compaiono mai.
    for (const w of animeWorlds) {
      assert.equal(
        published.some((p) => p.id === w.id),
        w.status === 'available' && datasets.has(w.slug),
        `worldsWithMap() incoerente per ${w.slug} (${w.status})`,
      );
    }
    const byPath = new Map(pages.map((r) => [r.path, r]));
    for (const lang of SEO_LOCALES) {
      for (const w of published) {
        const others = otherWorldMaps(w.id);
        assert.equal(others.length, published.length - 1, `mappe proposte da ${w.slug}`);
        assert.ok(!others.some((o) => o.id === w.id), `${w.slug} linka se stesso`);
        for (const o of others) {
          const path = mapPath(lang, o);
          assert.ok(!path.includes('?') && !path.endsWith('/'), `URL non canonico ${path}`);
          const target = byPath.get(path);
          assert.ok(target, `link a pagina inesistente ${path}`);
          assert.equal(target!.page.kind, 'map', `${path} non è una mappa`);
          assert.ok(isIndexable(target!), `link a mappa noindex ${path}`);
          // Stessa lingua della pagina; altrimenti la lingua di fallback del mondo.
          assert.equal(langFromPath(path), worldHasSeoLocale(o, lang) ? lang : seoLocaleFor(lang, o), `lingua di ${path}`);
        }
        // CTA della home: mappa del mondo stesso, nella lingua della home.
        const home = mapPath(lang, w);
        assert.ok(byPath.get(home)?.page.kind === 'map' && isIndexable(byPath.get(home)!), `CTA home rotta ${home}`);
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
