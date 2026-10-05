import type { WorldDataset } from '@/types';
import type { SupportedLocale } from '@/types/i18n';
import { withCharacterJourneys } from '@/data/shared/autoJourneys';
import { applyTranslations, type TranslationOverlay } from '@/data/shared/translations';

/**
 * Registro dei WorldDataset disponibili — caricamento LAZY per-mondo.
 *
 * Ogni dataset è importato con `import()` dinamico: Vite lo separa in un
 * chunk dedicato, così il bundle iniziale non contiene i dati di nessun
 * mondo e aprire Naruto non scarica/parsa One Piece o HxH. Questo riduce
 * il blocco del main thread (INP/TBT) e il peso della prima visita.
 *
 * Per aggiungere un nuovo anime:
 *   1. crea src/data/<slug>/ con i suoi file dati
 *   2. esporta un `<slug>Dataset: WorldDataset`
 *   3. aggiungi qui sotto il loader { '<slug>': () => import(...) }
 *   4. cambia lo status del world in src/data/worlds.ts
 */
const worldDatasetLoaders: Record<string, () => Promise<WorldDataset>> = {
  naruto: () => import('@/data/naruto').then((m) => m.narutoDataset),
  hunterxhunter: () =>
    import('@/data/hunterxhunter').then((m) => m.hunterxhunterDataset),
  onepiece: () => import('@/data/onepiece').then((m) => m.onepieceDataset),
  dragonball: () => import('@/data/dragonball').then((m) => m.dragonballDataset),
  blackclover: () =>
    import('@/data/blackclover').then((m) => m.blackcloverDataset),
  bleach: () => import('@/data/bleach').then((m) => m.bleachDataset),
  attackontitan: () =>
    import('@/data/attackontitan').then((m) => m.aotDataset),
  jujutsukaisen: () =>
    import('@/data/jujutsukaisen').then((m) => m.jjkDataset),
};

/** Cache dei dataset già caricati (gli oggetti sono singleton immutabili). */
const loadedDatasets = new Map<string, WorldDataset>();
/** Promise in volo per slug, per non duplicare i fetch concorrenti. */
const inflight = new Map<string, Promise<WorldDataset | undefined>>();

/** True se lo slug ha un dataset registrato. */
export function hasWorldDataset(slug: string): boolean {
  return slug in worldDatasetLoaders;
}

/**
 * Carica (una sola volta) il dataset di un mondo. Ritorna `undefined` per
 * slug non registrati. Le chiamate successive risolvono dalla cache.
 */
export function loadWorldDataset(
  slug: string,
): Promise<WorldDataset | undefined> {
  const cached = loadedDatasets.get(slug);
  if (cached) return Promise.resolve(cached);
  const pending = inflight.get(slug);
  if (pending) return pending;
  const loader = worldDatasetLoaders[slug];
  if (!loader) return Promise.resolve(undefined);
  const promise = loader()
    // I cammini dei personaggi derivati dagli eventi (src/data/shared/autoJourneys.ts).
    .then(withCharacterJourneys)
    .then((dataset) => {
      loadedDatasets.set(slug, dataset);
      inflight.delete(slug);
      return dataset;
    })
    .catch((err) => {
      inflight.delete(slug);
      throw err;
    });
  inflight.set(slug, promise);
  return promise;
}

/** Accesso sincrono a un dataset GIÀ caricato (altrimenti `undefined`). */
export function getLoadedWorldDataset(slug: string): WorldDataset | undefined {
  return loadedDatasets.get(slug);
}

/* ------------------------- Traduzioni (overlay) ------------------------- */

/**
 * Overlay di traduzione per mondo e lingua NON sorgente (vedi
 * `src/data/shared/translations.ts`). Chunk lazy separati dal dataset: chi
 * naviga in italiano o inglese non scarica le traduzioni. Un overlay può
 * esistere prima che il mondo sia pubblicato in quella lingua
 * (`AnimeWorld.translatedLocales`): intanto serve a chi usa l'interfaccia in
 * quella lingua sugli URL `/en`.
 */
const worldTranslationLoaders: Record<string, Partial<Record<SupportedLocale, () => Promise<TranslationOverlay>>>> = {
  naruto: { es: () => import('@/data/naruto/i18n/es').then((m) => m.default) },
};

const appliedTranslations = new Set<string>();
/** Overlay che non è stato possibile caricare (rete): i testi ricadono sull'inglese. */
const failedTranslations = new Set<string>();
const inflightTranslations = new Map<string, Promise<void>>();
const tKey = (slug: string, locale: SupportedLocale) => `${slug}:${locale}`;

/** Lingue con un overlay registrato per il mondo. */
export function worldTranslationLocales(slug: string): SupportedLocale[] {
  return Object.keys(worldTranslationLoaders[slug] ?? {}) as SupportedLocale[];
}

/** Il dataset (già caricato) è pronto per `locale`? Vero se non serve alcun overlay. */
export function isWorldTranslationReady(slug: string, locale: SupportedLocale): boolean {
  const key = tKey(slug, locale);
  return !worldTranslationLoaders[slug]?.[locale] || appliedTranslations.has(key) || failedTranslations.has(key);
}

/**
 * Carica e applica (una volta) l'overlay `locale` al dataset del mondo,
 * caricando il dataset se serve. No-op se l'overlay non esiste.
 */
export function ensureWorldTranslation(slug: string, locale: SupportedLocale): Promise<void> {
  const loader = worldTranslationLoaders[slug]?.[locale];
  const key = tKey(slug, locale);
  if (!loader || appliedTranslations.has(key)) return Promise.resolve();
  const pending = inflightTranslations.get(key);
  if (pending) return pending;
  const promise = Promise.all([loadWorldDataset(slug), loader()])
    .then(([dataset, overlay]) => {
      if (dataset) applyTranslations(dataset, locale, overlay);
      appliedTranslations.add(key);
      inflightTranslations.delete(key);
    })
    .catch((err) => {
      inflightTranslations.delete(key);
      failedTranslations.add(key);
      throw err;
    });
  inflightTranslations.set(key, promise);
  return promise;
}

/** Dataset con TUTTI i suoi overlay applicati (pre-rendering, script, test). */
export async function loadWorldDatasetWithTranslations(slug: string): Promise<WorldDataset | undefined> {
  const dataset = await loadWorldDataset(slug);
  if (dataset) await Promise.all(worldTranslationLocales(slug).map((l) => ensureWorldTranslation(slug, l)));
  return dataset;
}
