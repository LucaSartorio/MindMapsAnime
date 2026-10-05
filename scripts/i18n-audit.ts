/**
 * Audit di traduzione "a tutto campo": tutto ciò che il sito MOSTRA deve
 * esistere in ogni lingua con URL (it, en, es), così una lingua nuova si
 * traduce subito per intero senza lasciare indietro niente.
 *
 *   npm run i18n:audit                    # lingue con URL: errori bloccanti (exit 1)
 *   npm run i18n:audit -- --locale fr     # cosa manca per una lingua futura (solo report)
 *   npm run i18n:audit -- --names         # + elenco dei nomi identici in tutte le lingue (da rivedere)
 *
 * Controlla:
 *  1. ETICHETTE derivate dai dati — tipi di tecnica, attributi, gradi, ruoli,
 *     razze, tipi di luogo e di fazione, trasformazioni, classificazioni,
 *     sigilli, tag mostrati: ogni id usato da un mondo deve avere un'etichetta
 *     ESATTA nella lingua (config del mondo o mappa nota), non il ripiego
 *     `humanizeId` né la catena di fallback.
 *  2. TESTI E NOMI dei dataset nelle lingue non sorgente: ogni voce traducibile
 *     (testi, nomi, alias, gradi, kekkei genkai, etichette) è nell'overlay.
 *     Per it/en ci pensa `validate:i18n`.
 *  3. (con `--names`) NOMI identici in tutte le lingue: informativo, per la
 *     revisione dei doppiaggi (un nome proprio identico è spesso corretto).
 */
import { animeWorlds } from '../src/data/worlds';
import { hasWorldDataset, loadWorldDatasetWithTranslations, worldTranslationLocales } from '../src/data/registry';
import { datasetTranslatables } from '../src/data/shared/translations';
import { SEO_LOCALES } from '../src/seo/config';
import { SOURCE_LOCALES, SUPPORTED_LOCALES, type SupportedLocale } from '../src/types/i18n';
import type { AnimeWorld, LabeledOption, Localizable, WorldDataset } from '../src/types';
import {
  ABILITY_CLASSIFICATION_LABELS,
  CHAKRA_NATURE_LABELS,
  CHARACTER_ROLE_LABELS,
  FACTION_TYPE_LABELS,
  HAND_SEAL_LABELS,
  JUTSU_TYPE_LABELS,
  LOCATION_TYPE_LABELS,
  NINJA_RANK_LABELS,
  RACE_LABELS,
  TRANSFORMATION_KIND_LABELS,
} from '../src/utils/localization';
import { TAG_LABELS } from '../src/lib/tagLabels';

const argv = process.argv.slice(2);
const onlyLocale = argv.includes('--locale') ? (argv[argv.indexOf('--locale') + 1] as SupportedLocale) : undefined;
const listNames = argv.includes('--names');
if (onlyLocale && !SUPPORTED_LOCALES.includes(onlyLocale)) {
  console.error(`[i18n:audit] lingua sconosciuta: ${onlyLocale}`);
  process.exit(1);
}
const URL_LOCALES = SEO_LOCALES as readonly SupportedLocale[];
const LOCALES: SupportedLocale[] = onlyLocale ? [onlyLocale] : [...URL_LOCALES];

/** Traduzione ESATTA (senza fallback) di un'etichetta; una stringa vale per tutte le lingue. */
function exact(label: Localizable | undefined, locale: SupportedLocale): boolean {
  if (label === undefined) return false;
  if (typeof label === 'string') return label.trim() !== '';
  return !!(label as Partial<Record<SupportedLocale, string>>)[locale]?.trim();
}
const fromOptions = (options: LabeledOption[] | undefined, id: string) => options?.find((o) => o.id === id)?.label;

type LabelKind =
  | 'abilityType' | 'attribute' | 'rank' | 'role' | 'race' | 'locationType'
  | 'factionType' | 'transformation' | 'classification' | 'handSeal' | 'tag';

/** Fonte dell'etichetta di un id, nella stessa cascata dei componenti (config → mappa nota). */
function labelSource(world: AnimeWorld, kind: LabelKind, id: string): Localizable | undefined {
  const c = world.config;
  switch (kind) {
    case 'abilityType': return fromOptions(c?.ability?.categories, id) ?? JUTSU_TYPE_LABELS[id as keyof typeof JUTSU_TYPE_LABELS];
    case 'attribute': return fromOptions(c?.ability?.attribute?.options, id) ?? CHAKRA_NATURE_LABELS[id as keyof typeof CHAKRA_NATURE_LABELS];
    case 'rank': return fromOptions(c?.characterRank?.options, id) ?? NINJA_RANK_LABELS[id as keyof typeof NINJA_RANK_LABELS];
    case 'role': return fromOptions(c?.characterRoles, id) ?? CHARACTER_ROLE_LABELS[id];
    case 'race': return RACE_LABELS[id as keyof typeof RACE_LABELS];
    case 'locationType': return LOCATION_TYPE_LABELS[id as keyof typeof LOCATION_TYPE_LABELS];
    case 'factionType': return FACTION_TYPE_LABELS[id];
    case 'transformation': return TRANSFORMATION_KIND_LABELS[id as keyof typeof TRANSFORMATION_KIND_LABELS];
    case 'classification': return ABILITY_CLASSIFICATION_LABELS[id];
    case 'handSeal': return HAND_SEAL_LABELS[id.toLowerCase()];
    case 'tag': return TAG_LABELS[id];
  }
}

/** Gli id effettivamente MOSTRATI da un mondo, per tipo di etichetta. */
function usedIds(ds: WorldDataset): Array<[LabelKind, string]> {
  const out = new Set<string>();
  const add = (kind: LabelKind, v: unknown) => {
    for (const x of [v].flat()) if (typeof x === 'string' && x) out.add(`${kind}\u0000${x}`);
  };
  const w = ds.world;
  for (const j of ds.jutsu ?? []) {
    add('abilityType', j.type);
    if (w.config?.ability?.attribute) add('attribute', j.chakraNature);
    add('classification', j.classification);
    if (w.config?.ability?.showHandSeals) add('handSeal', j.handSeals);
  }
  for (const c of ds.characters) {
    if (w.config?.characterRank) add('rank', c.ninjaRank);
    add('role', c.role);
    add('race', c.race);
    for (const t of c.transformations ?? []) add('transformation', t.kind);
  }
  for (const l of ds.locations) add('locationType', l.type);
  for (const f of ds.factions) add('factionType', f.type);
  // Tag mostrati a schermo: nazioni, confini e il mondo stesso (gli altri servono a ricerca/filtri).
  for (const n of [...(ds.nations ?? []), ...(ds.boundaries ?? [])]) add('tag', n.tags);
  add('tag', w.tags);
  return [...out].map((k) => k.split('\u0000') as [LabelKind, string]);
}

let errors = 0;
const report = (blocking: boolean, line: string) => {
  if (blocking) errors++;
  console.log(`  ${blocking ? '✗' : '·'} ${line}`);
};

const worlds = animeWorlds.filter((w) => w.status === 'available' && hasWorldDataset(w.slug));
for (const world of worlds) {
  const ds = await loadWorldDatasetWithTranslations(world.slug);
  if (!ds) continue;
  const lines: string[] = [];
  const blockingFor = (locale: SupportedLocale) =>
    !onlyLocale && (SOURCE_LOCALES.includes(locale) || (world.translatedLocales ?? []).includes(locale));

  // 1. Etichette.
  for (const locale of LOCALES) {
    const missing = new Map<LabelKind, string[]>();
    for (const [kind, id] of usedIds(ds)) {
      if (!exact(labelSource(ds.world, kind, id), locale)) missing.set(kind, [...(missing.get(kind) ?? []), id]);
    }
    for (const [kind, ids] of missing) lines.push(`${blockingFor(locale) ? '!' : ' '}[${locale}] etichette ${kind} (${ids.length}): ${ids.join(', ')}`);
  }

  // 2. Testi e nomi del dataset nelle lingue non sorgente.
  for (const locale of LOCALES.filter((l) => !SOURCE_LOCALES.includes(l))) {
    const published = worldTranslationLocales(world.slug).includes(locale);
    const missing = datasetTranslatables(ds).filter((e) => !e.value[locale]?.trim());
    if (missing.length) {
      lines.push(`${published ? '!' : ' '}[${locale}] voci del dataset non tradotte: ${missing.length}${published ? '' : ' (nessun overlay)'} — es. ${missing.slice(0, 4).map((e) => e.key).join(', ')}`);
    }
  }

  // 3. Nomi identici in tutte le lingue (informativo).
  if (listNames) {
    const same: string[] = [];
    for (const e of datasetTranslatables(ds)) {
      if (!e.nameOwner && !e.plainSlot && !/\.localizedName$/.test(e.key)) continue;
      const vals = URL_LOCALES.map((l) => e.value[l]).filter(Boolean);
      if (vals.length === URL_LOCALES.length && new Set(vals).size === 1) same.push(`${e.key} = ${vals[0]}`);
    }
    if (same.length) lines.push(` [names] identici in ${URL_LOCALES.join('/')}: ${same.length}\n      ${same.join('\n      ')}`);
  }

  if (lines.length) {
    console.log(`\n${world.slug}`);
    for (const l of lines) report(l.startsWith('!'), l.slice(1));
  }
}

if (errors) {
  console.error(`\n[i18n:audit] ${errors} gruppi di voci mancanti in lingue pubblicate (✗).`);
  process.exit(1);
}
console.log(`\n[i18n:audit] OK — ${onlyLocale ? `report per "${onlyLocale}"` : `lingue con URL: ${URL_LOCALES.join(', ')}`}.`);
