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
 * Il ramo `world` è incluso (etichette di `config`: sistema di poteri, gradi,
 * marcatori…): titolo, sottotitolo e descrizione hanno già la lingua in linea
 * in `src/data/worlds.ts` (servono alla home prima che l'overlay sia caricato)
 * e una traduzione in linea vince sempre sull'overlay. Restano fuori `seoSlugs`
 * e i cammini DERIVATI dagli eventi (rigenerati da `localizeCharacterJourneys`).
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
const SKIPPED_ROOTS = new Set(['seoSlugs']);

function isDerivedJourney(node: unknown): boolean {
  const tags = (node as { tags?: unknown }).tags;
  return Array.isArray(tags) && tags.includes(DERIVED_JOURNEY_TAG);
}

/**
 * Campi "nome" che i dati possono scrivere come STRINGA semplice (identica in
 * tutte le lingue) ma che una lingua può comunque voler rendere diversamente:
 * alias ed epiteti, kekkei genkai, gradi descrittivi, etichette di membri e
 * partecipanti senza scheda, `localizedName` semplici. Il percorso è
 * normalizzato (`[id]`/`[0]` → `[]`). Una stringa in questi campi diventa una
 * voce traducibile con la stessa chiave che avrebbe come `{ it, en }`.
 */
const PLAIN_NAME_PATHS = new Set([
  'characters[].aliases[]',
  'characters[].kekkeiGenkai[]',
  'characters[].rank',
  'factions[].kekkeiGenkai',
  'factions[].structure[].members[].label',
  'factions[].succession[].holders[].label',
  'tournaments[].rounds[].matches[].sides[].label',
]);
const normalizePath = (path: string) => path.replace(/\[[^\]]*\]/g, '[]');
const isPlainNamePath = (path: string) => PLAIN_NAME_PATHS.has(normalizePath(path)) || /\.localizedName$/.test(path);

/** Stringa semplice traducibile: dove si trova, per sostituirla con `{ it, en, <lingua> }`. */
interface PlainSlot {
  parent: Record<string | number, unknown>;
  prop: string | number;
}

/**
 * Visita ogni `Localizable` (oggetto) raggiungibile da `node`, con il suo
 * percorso. Lo stesso oggetto raggiunto due volte viene visitato una sola
 * volta (il primo percorso in ordine di visita vince): ordine deterministico.
 * Le stringhe semplici nei campi "nome" (`PLAIN_NAME_PATHS`) sono passate a
 * `visitPlain`, se fornito.
 */
function walk(
  node: unknown,
  path: string,
  seen: Set<object>,
  visit: (path: string, value: LocalizableObject) => void,
  visitPlain?: (path: string, value: string, slot: PlainSlot) => void,
): void {
  if (node === null || typeof node !== 'object') return;
  if (seen.has(node)) return;
  seen.add(node);
  if (Array.isArray(node)) {
    node.forEach((item, i) => {
      const id = item && typeof item === 'object' && typeof (item as { id?: unknown }).id === 'string' ? (item as { id: string }).id : String(i);
      const itemPath = `${path}[${id}]`;
      if (typeof item === 'string') {
        if (visitPlain && item.trim() && isPlainNamePath(itemPath)) visitPlain(itemPath, item, { parent: node as unknown as PlainSlot['parent'], prop: i });
        return;
      }
      walk(item, itemPath, seen, visit, visitPlain);
    });
    return;
  }
  if (looksLocalizable(node)) {
    visit(path, node as LocalizableObject);
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    const childPath = path ? `${path}.${k}` : k;
    if (typeof v === 'string') {
      if (visitPlain && v.trim() && isPlainNamePath(childPath)) visitPlain(childPath, v, { parent: node as PlainSlot['parent'], prop: k });
      continue;
    }
    walk(v, childPath, seen, visit, visitPlain);
  }
}

/**
 * Collezioni i cui NOMI possono cambiare lingua ("Uchiha Clan" → "Clan
 * Uchiha", "Team 7" → "Equipo 7", "Krillin" → "Krilin"). Un `name` stringa
 * semplice senza `localizedName` diventa una voce traducibile con chiave
 * `<entità>.name`; applicarla crea `localizedName: { it: name, en: name,
 * <lingua>: testo }`, così it/en restano identici. Anche i personaggi: i
 * doppiaggi rinominano spesso (e i nomi propri si copiano invariati).
 */
const NAMED_ROOTS = new Set(['characters', 'factions', 'teams', 'locations', 'jutsu', 'arcs', 'routes', 'nations', 'boundaries', 'mapLevels', 'tournaments']);

/**
 * `localizedName` creati da un overlay a partire da un `name` semplice (e gli
 * oggetti creati da una stringa semplice in `PLAIN_NAME_PATHS`): restano voci
 * con la chiave originale anche dopo l'applicazione, così un secondo overlay
 * (altra lingua) le ritrova con la stessa chiave.
 */
const derivedNames = new WeakSet<object>();

export interface TranslatableEntry {
  key: string;
  /** Testo sorgente (`{ it, en, … }`); per i nomi è un oggetto derivato da `name`. */
  value: LocalizableObject;
  /** Solo per i nomi semplici: l'entità a cui aggiungere `localizedName`. */
  nameOwner?: { name: string; localizedName?: unknown };
  /** Solo per le stringhe semplici in un campo "nome": dove sostituirla. */
  plainSlot?: PlainSlot;
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
        const ln = e?.localizedName;
        const derived = !!ln && typeof ln === 'object' && derivedNames.has(ln);
        if (typeof e?.id === 'string' && typeof e.name === 'string' && (ln === undefined || derived)) {
          out.push({ key: `${root}[${e.id}].name`, value: { it: e.name, en: e.name }, nameOwner: e as { name: string } });
          if (derived) seen.add(ln as object); // non è un testo autonomo del dataset
        }
      }
    }
    walk(
      list,
      root,
      seen,
      (key, v) => {
        // Oggetto creato da un overlay a partire da una stringa: resta una voce "semplice".
        if (derivedNames.has(v)) out.push({ key, value: v, plainSlot: { parent: {}, prop: '' } });
        else out.push({ key, value: v });
      },
      (key, s, slot) => out.push({ key, value: { it: s, en: s }, plainSlot: slot }),
    );
  }
  return out;
}

/** Solo i `Localizable` (senza i nomi semplici): compatibilità con i consumer esistenti. */
export function datasetLocalizables(dataset: WorldDataset): Array<[key: string, value: LocalizableObject]> {
  return datasetTranslatables(dataset).filter((e) => !e.nameOwner && !e.plainSlot).map((e) => [e.key, e.value]);
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
  for (const { key, value, nameOwner, plainSlot } of datasetTranslatables(dataset)) {
    total++;
    const text = overlay[key];
    if (text === undefined || !text.trim()) continue;
    if (nameOwner) {
      // Il nome resta identico in it/en; la lingua dell'overlay riceve il suo.
      const ln = nameOwner.localizedName;
      if (ln && typeof ln === 'object' && derivedNames.has(ln)) {
        (ln as LocalizableObject)[locale] = text;
      } else {
        const created: LocalizableObject = { it: nameOwner.name, en: nameOwner.name, [locale]: text };
        derivedNames.add(created);
        nameOwner.localizedName = created;
      }
    } else if (plainSlot && !derivedNames.has(value)) {
      // Stringa semplice: diventa `{ it, en, <lingua> }` (it/en restano la stringa).
      const created: LocalizableObject = { ...value, [locale]: text };
      derivedNames.add(created);
      plainSlot.parent[plainSlot.prop] = created;
    } else {
      value[locale] = text;
    }
    used.add(key);
    applied++;
  }
  localizeCharacterJourneys(dataset, locale);
  return { total, applied, orphans: Object.keys(overlay).filter((k) => !used.has(k)) };
}
