import type { WorldDataset } from '@/types';
import { SOURCE_LOCALES, isLocalizedText } from '@/types/i18n';

/**
 * SCHEMA dei campi `Localizable` di un dataset — unica fonte usata dai
 * validatori (`validate:i18n`, `test:seo`) per sapere quali campi devono essere
 * tradotti. Deriva dalle interfacce in `src/types/index.ts`: quando si aggiunge
 * un campo `Localizable` a un'entità, va aggiunto anche qui.
 *
 * Due classi di campo:
 *  - `text`: testo narrativo (descrizioni, titoli, periodi, label…). DEVE essere
 *    `{ it, en }` con entrambe le lingue sorgente non vuote: una stringa
 *    semplice è testo italiano non tradotto e renderebbe la pagina `/en`
 *    non indicizzabile (vedi `isTranslatedIn` in `src/seo/metadata.ts`);
 *  - `name`: nome proprio (`localizedName`, titolo dell'opera). Una stringa
 *    semplice è ammessa quando il nome è identico in tutte le lingue.
 */
export type LocalizableFieldClass = 'text' | 'name';

/** Percorso di campo: `a.b` per oggetti annidati, `a[]` per array. */
type FieldSpec = [path: string, cls: LocalizableFieldClass, required?: boolean];

export const LOCALIZABLE_FIELDS: Record<string, FieldSpec[]> = {
  nations: [
    ['localizedName', 'name'],
    ['description', 'text', true],
    ['descriptionLong', 'text'],
  ],
  boundaries: [
    ['localizedName', 'name'],
    ['descriptionShort', 'text', true],
    ['descriptionLong', 'text'],
  ],
  locations: [
    ['localizedName', 'name'],
    ['shortDescription', 'text', true],
    ['longDescription', 'text'],
    ['poneglyph.note', 'text'],
    ['poneglyph.inscription', 'text'],
  ],
  characters: [
    ['localizedName', 'name'],
    ['shortDescription', 'text', true],
    ['longDescription', 'text'],
    ['trivia[]', 'text'],
    ['bounties[].note', 'text'],
    ['transformations[].localizedName', 'name'],
    ['transformations[].description', 'text'],
    ['relationships[].label', 'text'],
    ['aliases[]', 'name'],
    ['rank', 'name'],
    ['kekkeiGenkai[]', 'name'],
  ],
  factions: [
    ['localizedName', 'name'],
    ['description', 'text', true],
    ['longDescription', 'text'],
    ['kekkeiGenkai', 'name'],
    ['structure[].name', 'text'],
    ['structure[].note', 'text'],
    ['structure[].members[].label', 'name'],
    ['structure[].members[].role', 'text'],
    ['succession[].title', 'text'],
    ['succession[].holders[].label', 'name'],
    ['succession[].holders[].role', 'text'],
  ],
  teams: [
    ['localizedName', 'name'],
    ['description', 'text', true],
    ['longDescription', 'text'],
  ],
  arcs: [
    ['localizedName', 'name'],
    ['saga', 'text'],
    ['period', 'text'],
    ['description', 'text', true],
    ['longDescription', 'text'],
  ],
  events: [
    ['title', 'text', true],
    ['description', 'text', true],
    ['longDescription', 'text'],
    ['period', 'text', true],
    ['battle.note', 'text'],
  ],
  routes: [
    ['localizedName', 'name'],
    ['group', 'text'],
    ['description', 'text', true],
    ['longDescription', 'text'],
    ['steps[].label', 'text'],
    ['steps[].title', 'text'],
    ['steps[].description', 'text'],
    ['steps[].approximateTimeLabel', 'text'],
    ['steps[].notes', 'text'],
  ],
  jutsu: [
    ['localizedName', 'name'],
    ['shortDescription', 'text', true],
    ['longDescription', 'text'],
  ],
  mapLevels: [
    ['localizedName', 'name'],
    ['description', 'text'],
  ],
  tournaments: [
    ['localizedName', 'name'],
    ['description', 'text', true],
    ['outcome', 'text'],
    ['rounds[].name', 'text', true],
    ['rounds[].matches[].note', 'text'],
    ['rounds[].matches[].sides[].label', 'name'],
  ],
};

export type LocalizableIssueCode =
  | 'plain_string'
  | 'missing_it'
  | 'missing_en'
  | 'empty'
  | 'missing_field'
  | 'en_looks_italian'
  | 'it_looks_english'
  | 'italian_name_without_en';

export interface LocalizableIssue {
  severity: 'error' | 'warning';
  code: LocalizableIssueCode;
  world: string;
  kind: string;
  id: string;
  field: string;
  value: string;
}

// Euristica leggera (solo WARNING): parole funzionali tipiche di una lingua.
// Confini "di lettera" Unicode (`\b` di JS non riconosce le lettere accentate:
// "Bell-mère" conterrebbe la parola "è").
const IT_WORDS = /(?<!\p{L})(il|lo|gli|della|dello|delle|degli|dei|che|per|con|nel|nella|sono|è|una|anche|dopo|contro|suo|sua|viene)(?!\p{L})/iu;
const EN_WORDS = /(?<!\p{L})(the|and|of|with|his|her|who|after|against|which|from|their|is)(?!\p{L})/iu;
export const looksItalian = (s: string) => s.length > 25 && IT_WORDS.test(s) && !EN_WORDS.test(s);
export const looksEnglish = (s: string) => s.length > 25 && EN_WORDS.test(s) && !IT_WORDS.test(s);

function valuesAt(obj: unknown, path: string): unknown[] {
  const [head, ...rest] = path.split('.');
  const isArray = head.endsWith('[]');
  const key = isArray ? head.slice(0, -2) : head;
  const v = (obj as Record<string, unknown> | undefined)?.[key];
  if (v === undefined || v === null) return [];
  const list = isArray ? (Array.isArray(v) ? v : []) : [v];
  return rest.length ? list.flatMap((x) => valuesAt(x, rest.join('.'))) : list;
}

/** Controlla TUTTI i campi `Localizable` di un dataset secondo lo schema. */
export function auditLocalizable(dataset: WorldDataset): LocalizableIssue[] {
  const world = dataset.world.slug;
  const out: LocalizableIssue[] = [];
  const push = (i: Omit<LocalizableIssue, 'world'>) => out.push({ world, ...i });

  const check = (kind: string, id: string, field: string, cls: LocalizableFieldClass, required: boolean, entity: unknown) => {
    const values = valuesAt(entity, field);
    if (values.length === 0) {
      if (required) push({ severity: 'error', code: 'missing_field', kind, id, field, value: '' });
      return;
    }
    for (const v of values) {
      if (typeof v === 'string') {
        if (!v.trim()) push({ severity: 'error', code: 'empty', kind, id, field, value: v });
        else if (cls === 'text') push({ severity: 'error', code: 'plain_string', kind, id, field, value: v });
        continue;
      }
      if (!isLocalizedText(v as never)) continue;
      const map = v as Partial<Record<string, string>>;
      for (const loc of SOURCE_LOCALES) {
        const t = map[loc];
        if (t === undefined || t.trim() === '') {
          push({ severity: 'error', code: loc === 'it' ? 'missing_it' : 'missing_en', kind, id, field, value: JSON.stringify(v) });
        }
      }
      if (map.en && looksItalian(map.en)) push({ severity: 'warning', code: 'en_looks_italian', kind, id, field, value: map.en });
      if (map.it && looksEnglish(map.it)) push({ severity: 'warning', code: 'it_looks_english', kind, id, field, value: map.it });
    }
  };

  for (const [kind, specs] of Object.entries(LOCALIZABLE_FIELDS)) {
    const list = ((dataset as unknown as Record<string, unknown>)[kind] ?? []) as Array<Record<string, unknown>>;
    for (const entity of list) {
      const id = String(entity.id);
      for (const [field, cls, required] of specs) check(kind, id, field, cls, !!required, entity);
      // Nome italiano senza traduzione: il nome in `/en` resterebbe italiano.
      if (typeof entity.name === 'string' && !entity.localizedName && IT_WORDS.test(entity.name)) {
        push({ severity: 'warning', code: 'italian_name_without_en', kind, id, field: 'name', value: entity.name });
      }
    }
  }
  check('world', dataset.world.id, 'title', 'name', true, dataset.world);
  check('world', dataset.world.id, 'subtitle', 'text', false, dataset.world);
  check('world', dataset.world.id, 'description', 'text', true, dataset.world);
  return out;
}
