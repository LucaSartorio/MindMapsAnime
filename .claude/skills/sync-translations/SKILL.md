---
name: sync-translations
description: Bring dataset translation overlays (es, fr) and the translation index up to date for a world, or fix UI i18n key drift across the six locales. Use for "aggiorna le traduzioni spagnole di Naruto", "translations are stale", "i18n:audit fails", "publish Bleach in French".
argument-hint: <world|ui> [locale: es|fr]
---

# Sync translations: $ARGUMENTS

Read `.claude/rules/i18n.md` and `docs/I18N.md` (workflow + glossaries) first. Never edit dataset files to add
`es`/`fr`; never translate ids, slugs or tag values; never mark a language complete when it is not.

## Dataset overlays (`<world> es|fr`)
1. `npm run i18n:status` → missing / stale / orphan counts for `$0` `$1`.
2. `npm run i18n:extract -- --world $0 --locale $1 --out tmp/$0-$1-todo.json` (tmp/ is a scratch output; do not commit it).
3. Translate the JSON values (keep keys, placeholders and proper nouns per the glossary in docs/I18N.md; official
   localized names where they exist). Large files: batches of ~200 keys, delegated to `anime-data-curator` when
   terminology needs lore knowledge.
4. `npm run i18n:merge -- --world $0 --locale $1 --from tmp/$0-$1.json` → `npm run i18n:index`.
5. Publishing the world in a new URL language (only with owner approval): 100 % overlay + loader in
   `worldTranslationLoaders` + locale in `translatedLocales` (`worlds.ts`) + `npm run i18n:index`.
6. Checks: `npm run i18n:status` (0 missing/stale for the target), `npm run validate:i18n`, `npm run i18n:audit`,
   `npm run test:seo`, then `npm run build`.

## UI keys (`ui`)
`npm run validate:i18n` lists missing/orphan keys against `it`; add the key to all six `src/i18n/resources/*.ts`
(real translations, not English copies, unless it is a proper noun) → re-run until green.

Report: keys translated/merged, coverage before → after, files changed, checks + results, items left.
