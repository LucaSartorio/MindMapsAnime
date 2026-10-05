import type { WorldDataset } from '@/types';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/types/i18n';
import { DERIVED_JOURNEY_TAG, localizeCharacterJourneys } from './autoJourneys';

/**
 * Traduzioni dei dataset nelle lingue NON sorgente (oggi lo spagnolo).
 *
 * I dataset sono scritti in it/en direttamente nei file dati. Le altre lingue
 * vivono in un OVERLAY per mondo e lingua, `src/data/<slug>/i18n/<lingua>.ts`:
 * una mappa `chiave → testo` caricata in modo lazy solo da chi la usa (chi
 * naviga in italiano non scarica lo spagnolo) e applicata al dataset già
 * caricato aggiungendo la chiave di lingua ai suoi `Localizable`
 * (`{ it, en }` → `{ it, en, es }`). Nessun file dati viene toccato.
 *
 * La CHIAVE è il percorso del `Localizable` dalla radice del dataset, con gli
 * elementi di array indirizzati per `id` quando ce l'hanno (stabile anche se
 * l'ordine cambia), altrimenti per indice:
 *
 *   characters[char-naruto].shortDescription
 *   routes[route-naruto-journey].steps[3].description
 *   factions[clan-uchiha].structure[0].members[2].role
 *
 * Anche i NOMI descrittivi scritti come stringa semplice (fazioni, team,
 * luoghi, …) sono traducibili: chiave `factions[clan-uchiha].name`.
 *
 * Restano fuori: `world` (titolo e config del mondo sono tradotti in linea in
 * `src/data/worlds.ts`, servono anche alla home), `seoSlugs` e i cammini
 * DERIVATI dagli eventi (rigenerati da `localizeCharacterJourneys`).
 *
 * Il file `<lingua>.meta.json` accanto all'overlay conserva l'impronta del
 * testo inglese tradotto: `npm run i18n:status` segnala le traduzioni
 * diventate obsolete quando l'inglese cambia. Flusso completo in docs/I18N.md.
 */

export type TranslationOverlay = Readonly<Record<string, string>>;

/** Vero se l'oggetto è un `Localizable` (solo chiavi lingua, valori stringa). */
export function looksLocalizable(value: object): boolean {
  const entries = Object.entries(value);
  if (entries.length === 0) return false;
  if (!SUPPORTED_LOCALES.some((l) => l in value)) return false;
  return entries.every(([k, v]) => (SUPPORTED_LOCALES as readonly string[]).includes(k) && (typeof v === 'string' || v === undefined));
}

type LocalizableObject = Partial<Record<SupportedLocale, string>>;

/** Collezioni del dataset escluse dall'overlay (vedi sopra). */
const SKIPPED_ROOTS = new Set(['world', 'seoSlugs']);

function isDerivedJourney(node: unknown): boolean {
  const tags = (node as { tags?: unknown }).tags;
  return Array.isArray(tags) && tags.includes(DERIVED_JOURNEY_TAG);
}

/**
 * Visita ogni `Localizable` (oggetto) raggiungibile da `node`, con il suo
 * percorso. Lo stesso oggetto raggiunto due volte viene visitato una sola
 * volta (il primo percorso in ordine di visita vince): ordine deterministico.
 */
function walk(
  node: unknown,
  path: string,
  seen: Set<object>,
  visit: (path: string, value: LocalizableObject) => void,
): void {
  if (node === null || typeof node !== 'object') return;
  if (seen.has(node)) return;
  seen.add(node);
  if (Array.isArray(node)) {
    node.forEach((item, i) => {
      const id = item && typeof item === 'object' && typeof (item as { id?: unknown }).id === 'string' ? (item as { id: string }).id : String(i);
      walk(item, `${path}[${id}]`, seen, visit);
    });
    return;
  }
  if (looksLocalizable(node)) {
    visit(path, node as LocalizableObject);
    return;
  }
  for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k, seen, visit);
}

/**
 * Collezioni i cui NOMI descrittivi possono cambiare lingua ("Uchiha Clan" →
 * "Clan Uchiha", "Team 7" → "Equipo 7"). Un `name` stringa semplice senza
 * `localizedName` diventa una voce traducibile con chiave `<entità>.name`;
 * applicarla crea `localizedName: { it: name, en: name, <lingua>: testo }`,
 * così it/en restano identici. I personaggi sono esclusi: nomi propri.
 */
const NAMED_ROOTS = new Set(['factions', 'teams', 'locations', 'jutsu', 'arcs', 'routes', 'nations', 'boundaries', 'mapLevels', 'tournaments']);

export interface TranslatableEntry {
  key: string;
  /** Testo sorgente (`{ it, en, … }`); per i nomi è un oggetto derivato da `name`. */
  value: LocalizableObject;
  /** Solo per i nomi semplici: l'entità a cui aggiungere `localizedName`. */
  nameOwner?: { name: string; localizedName?: unknown };
}

/** Tutte le voci traducibili di un dataset (testi `Localizable` + nomi semplici), con la loro chiave. */
export function datasetTranslatables(dataset: WorldDataset): TranslatableEntry[] {
  const out: TranslatableEntry[] = [];
  const seen = new Set<object>();
  for (const [root, value] of Object.entries(dataset)) {
    if (SKIPPED_ROOTS.has(root)) continue;
    const list = root === 'routes' && Array.isArray(value) ? value.filter((r) => !isDerivedJourney(r)) : value;
    if (NAMED_ROOTS.has(root) && Array.isArray(list)) {
      for (const e of list as Array<{ id?: unknown; name?: unknown; localizedName?: unknown }>) {
        if (typeof e?.id === 'string' && typeof e.name === 'string' && e.localizedName === undefined) {
          out.push({ key: `${root}[${e.id}].name`, value: { it: e.name, en: e.name }, nameOwner: e as { name: string } });
        }
      }
    }
    walk(list, root, seen, (key, v) => out.push({ key, value: v }));
  }
  return out;
}

/** Solo i `Localizable` (senza i nomi semplici): compatibilità con i consumer esistenti. */
export function datasetLocalizables(dataset: WorldDataset): Array<[key: string, value: LocalizableObject]> {
  return datasetTranslatables(dataset).filter((e) => !e.nameOwner).map((e) => [e.key, e.value]);
}

/** Tutti i `Localizable` di un'entità (o di qualsiasi sotto-albero). */
export function localizablesOf(node: unknown): LocalizableObject[] {
  const out: LocalizableObject[] = [];
  walk(node, '', new Set(), (_, v) => out.push(v));
  return out;
}

/** OGNI testo dell'entità è tradotto (non vuoto) in `locale`? */
export function isFullyTranslated(entity: unknown, locale: SupportedLocale): boolean {
  return localizablesOf(entity).every((v) => !!v[locale]?.trim());
}

/** Impronta del testo sorgente tradotto (inglese): rileva le traduzioni obsolete. */
export function sourceFingerprint(value: LocalizableObject): string {
  const s = value.en ?? value.it ?? '';
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

export interface ApplyStats {
  /** `Localizable` traducibili nel dataset. */
  total: number;
  /** Tradotti dall'overlay. */
  applied: number;
  /** Chiavi dell'overlay che non corrispondono più a nessun testo. */
  orphans: string[];
}

/**
 * Applica un overlay a un dataset GIÀ caricato (in place, idempotente): aggiunge
 * la lingua ai `Localizable`, poi rigenera in quella lingua i cammini derivati.
 * Le lingue sorgente non vengono mai toccate.
 */
export function applyTranslations(dataset: WorldDataset, locale: SupportedLocale, overlay: TranslationOverlay): ApplyStats {
  if (locale === 'it' || locale === 'en') throw new Error(`applyTranslations: ${locale} è una lingua sorgente`);
  const used = new Set<string>();
  let total = 0;
  let applied = 0;
  for (const { key, value, nameOwner } of datasetTranslatables(dataset)) {
    total++;
    const text = overlay[key];
    if (text === undefined || !text.trim()) continue;
    if (nameOwner) {
      // Il nome resta identico in it/en; la lingua dell'overlay riceve il suo.
      nameOwner.localizedName = { it: nameOwner.name, en: nameOwner.name, [locale]: text };
    } else {
      value[locale] = text;
    }
    used.add(key);
    applied++;
  }
  localizeCharacterJourneys(dataset, locale);
  return { total, applied, orphans: Object.keys(overlay).filter((k) => !used.has(k)) };
}
