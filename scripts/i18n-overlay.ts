/**
 * Overlay di traduzione dei dataset (lingue NON sorgente, oggi `es`).
 * Vedi `src/data/shared/translations.ts` e docs/I18N.md.
 *
 *   npm run i18n:status  -- [--world naruto] [--locale es]
 *       copertura per mondo: tradotti, mancanti, OBSOLETI (l'inglese è cambiato
 *       dopo la traduzione), orfani (chiavi senza più testo). Exit 0 sempre.
 *
 *   npm run i18n:extract -- --world naruto --locale es [--kinds characters,events] [--limit 200] [--out file.json]
 *       scrive i testi da tradurre (mancanti + obsoleti) come
 *       `{ "<chiave>": { "en": "…", "it": "…" } }` — l'input del traduttore.
 *
 *   npm run i18n:merge -- --world naruto --locale es --from a.json [--from b.json]
 *       unisce `{ "<chiave>": "testo tradotto" }` nell'overlay
 *       `src/data/<world>/i18n/<locale>.ts` (riscritto nell'ordine del dataset)
 *       e aggiorna le impronte in `<locale>.meta.json`. Rifiuta chiavi
 *       inesistenti e testi vuoti; segnala testi identici all'inglese e
 *       lunghezze sospette.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { animeWorlds } from '../src/data/worlds';
import { hasWorldDataset, loadWorldDataset, worldTranslationLocales } from '../src/data/registry';
import { datasetTranslatables, sourceFingerprint, type TranslationOverlay } from '../src/data/shared/translations';
import { SOURCE_LOCALES, SUPPORTED_LOCALES, type SupportedLocale } from '../src/types/i18n';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [command, ...rest] = process.argv.slice(2);

function args(name: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < rest.length; i++) if (rest[i] === `--${name}` && rest[i + 1]) out.push(rest[++i]);
  return out;
}
const arg = (name: string) => args(name)[0];

function fail(msg: string): never {
  console.error(`[i18n] ${msg}`);
  process.exit(1);
}

const overlayFile = (world: string, locale: string) => join(ROOT, 'src/data', world, 'i18n', `${locale}.ts`);
const metaFile = (world: string, locale: string) => join(ROOT, 'src/data', world, 'i18n', `${locale}.meta.json`);

async function readOverlay(world: string, locale: string): Promise<TranslationOverlay> {
  const f = overlayFile(world, locale);
  if (!existsSync(f)) return {};
  const mod = (await import(pathToFileURL(f).href)) as { default: TranslationOverlay };
  return mod.default ?? {};
}

function readMeta(world: string, locale: string): Record<string, string> {
  const f = metaFile(world, locale);
  return existsSync(f) ? (JSON.parse(readFileSync(f, 'utf8')) as Record<string, string>) : {};
}

interface Row {
  key: string;
  en: string;
  it: string;
  /** Traduzione già scritta in linea nei file dati (vince sull'overlay). */
  inline?: string;
  overlay?: string;
  stale: boolean;
}

async function rowsFor(world: string, locale: SupportedLocale): Promise<{ rows: Row[]; orphans: string[] }> {
  const dataset = await loadWorldDataset(world);
  if (!dataset) fail(`mondo senza dataset: ${world}`);
  const overlay = await readOverlay(world, locale);
  const meta = readMeta(world, locale);
  const rows: Row[] = datasetTranslatables(dataset).map(({ key, value: v }) => {
    const overlayText = overlay[key];
    return {
      key,
      en: v.en ?? '',
      it: v.it ?? '',
      // Il dataset non ha overlay applicato: un valore presente è in linea.
      inline: v[locale]?.trim() ? v[locale] : undefined,
      overlay: overlayText,
      stale: overlayText !== undefined && meta[key] !== undefined && meta[key] !== sourceFingerprint(v),
    };
  });
  const keys = new Set(rows.map((r) => r.key));
  return { rows, orphans: Object.keys(overlay).filter((k) => !keys.has(k)) };
}

const kindOf = (key: string) => key.slice(0, key.indexOf('['));

function parseLocale(): SupportedLocale {
  const l = arg('locale') ?? 'es';
  if (!(SUPPORTED_LOCALES as readonly string[]).includes(l) || (SOURCE_LOCALES as readonly string[]).includes(l)) {
    fail(`--locale deve essere una lingua non sorgente (${SUPPORTED_LOCALES.filter((x) => !SOURCE_LOCALES.includes(x)).join(', ')})`);
  }
  return l as SupportedLocale;
}

function parseWorld(required: boolean): string | undefined {
  const w = arg('world');
  if (!w) {
    if (required) fail('--world <slug> obbligatorio');
    return undefined;
  }
  if (!hasWorldDataset(w)) fail(`mondo sconosciuto: ${w}`);
  return w;
}

async function status() {
  const locale = parseLocale();
  const only = parseWorld(false);
  const worlds = animeWorlds.filter((w) => w.status === 'available' && hasWorldDataset(w.slug) && (!only || w.slug === only));
  console.log(`=== Overlay ${locale.toUpperCase()} ===`);
  console.log('mondo            pubblicato  testi  tradotti  mancanti  obsoleti  orfani');
  for (const w of worlds) {
    const { rows, orphans } = await rowsFor(w.slug, locale);
    const done = rows.filter((r) => r.inline || r.overlay?.trim()).length;
    const stale = rows.filter((r) => r.stale).length;
    const published = w.translatedLocales?.includes(locale) ? 'sì' : worldTranslationLocales(w.slug).includes(locale) ? 'no (overlay)' : 'no';
    console.log(
      `${w.slug.padEnd(16)} ${published.padEnd(11)} ${String(rows.length).padStart(5)}  ${`${((done / rows.length) * 100).toFixed(0)}%`.padStart(8)}  ${String(rows.length - done).padStart(8)}  ${String(stale).padStart(8)}  ${String(orphans.length).padStart(6)}`,
    );
    if (only) {
      const byKind = new Map<string, [number, number]>();
      for (const r of rows) {
        const k = kindOf(r.key);
        const [t, d] = byKind.get(k) ?? [0, 0];
        byKind.set(k, [t + 1, d + (r.inline || r.overlay?.trim() ? 1 : 0)]);
      }
      for (const [k, [t, d]] of byKind) console.log(`   ${k.padEnd(14)} ${String(d).padStart(5)}/${t}`);
      for (const r of rows.filter((x) => x.stale).slice(0, 20)) console.log(`   [obsoleto] ${r.key}`);
      for (const o of orphans.slice(0, 20)) console.log(`   [orfano]   ${o}`);
    }
  }
}

async function extract() {
  const locale = parseLocale();
  const world = parseWorld(true)!;
  const kinds = new Set(args('kinds').flatMap((k) => k.split(',')).filter(Boolean));
  const limit = Number(arg('limit') ?? Infinity);
  const { rows } = await rowsFor(world, locale);
  const todo = rows
    .filter((r) => !r.inline && (!r.overlay?.trim() || r.stale))
    .filter((r) => kinds.size === 0 || kinds.has(kindOf(r.key)))
    .slice(0, limit);
  const out: Record<string, { en: string; it: string }> = {};
  for (const r of todo) out[r.key] = { en: r.en, it: r.it };
  const json = `${JSON.stringify(out, null, 2)}\n`;
  const file = arg('out');
  if (file) {
    mkdirSync(dirname(resolve(file)), { recursive: true });
    writeFileSync(resolve(file), json, 'utf8');
    console.error(`[i18n] ${todo.length} testi da tradurre → ${file}`);
  } else {
    process.stdout.write(json);
  }
}

async function merge() {
  const locale = parseLocale();
  const world = parseWorld(true)!;
  const files = args('from');
  if (files.length === 0) fail('--from <file.json> obbligatorio');
  const dataset = await loadWorldDataset(world);
  if (!dataset) fail(`mondo senza dataset: ${world}`);
  const items = datasetTranslatables(dataset).map((e) => [e.key, e.value] as const);
  const byKey = new Map(items);
  const overlay: Record<string, string> = { ...(await readOverlay(world, locale)) };
  const meta = readMeta(world, locale);
  const warnings: string[] = [];
  let merged = 0;
  for (const f of files) {
    const incoming = JSON.parse(readFileSync(resolve(f), 'utf8')) as Record<string, unknown>;
    for (const [key, value] of Object.entries(incoming)) {
      const src = byKey.get(key);
      if (!src) fail(`${f}: chiave inesistente nel dataset ${world}: ${key}`);
      if (typeof value !== 'string' || !value.trim()) fail(`${f}: testo vuoto o non stringa per ${key}`);
      const text = value.trim();
      const en = src.en ?? '';
      if (en.length > 30 && text === en && !key.endsWith('.name')) warnings.push(`identico all'inglese: ${key}`);
      if (en.length > 40 && (text.length < en.length * 0.6 || text.length > en.length * 1.8)) {
        warnings.push(`lunghezza sospetta (${en.length} → ${text.length}): ${key}`);
      }
      overlay[key] = text;
      meta[key] = sourceFingerprint(src);
      merged++;
    }
  }
  // Riscrittura nell'ordine del dataset (diff leggibili); gli orfani in coda.
  const ordered = [...items.map(([k]) => k).filter((k) => k in overlay), ...Object.keys(overlay).filter((k) => !byKey.has(k)).sort()];
  const name = String(dataset.world.title && typeof dataset.world.title === 'object' ? dataset.world.title.en : dataset.world.title);
  const body = ordered.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(overlay[k])},`).join('\n');
  const ts =
    `import type { TranslationOverlay } from '@/data/shared/translations';\n\n` +
    `/**\n * ${name} — overlay di traduzione (${locale}). Generato da\n` +
    ` * \`npm run i18n:merge\` (vedi docs/I18N.md). Le correzioni a mano sono ammesse:\n` +
    ` * il merge successivo riscrive il file ordinato senza perderle.\n */\n` +
    `const ${locale}: TranslationOverlay = {\n${body}\n};\n\nexport default ${locale};\n`;
  mkdirSync(dirname(overlayFile(world, locale)), { recursive: true });
  writeFileSync(overlayFile(world, locale), ts, 'utf8');
  const metaOrdered = Object.fromEntries(ordered.filter((k) => k in meta).map((k) => [k, meta[k]]));
  writeFileSync(metaFile(world, locale), `${JSON.stringify(metaOrdered, null, 1)}\n`, 'utf8');
  console.log(`[i18n] ${merged} testi uniti → ${world}/${locale}: ${ordered.length}/${items.length} tradotti`);
  for (const w of warnings.slice(0, 40)) console.log(`  [WARN] ${w}`);
  if (warnings.length > 40) console.log(`  … altri ${warnings.length - 40} warning`);
}

const COMMANDS: Record<string, () => Promise<void>> = { status, extract, merge };
const run = COMMANDS[command ?? ''];
if (!run) fail(`comando sconosciuto "${command ?? ''}": usa status | extract | merge`);
await run();
