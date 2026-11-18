---
name: enrich-anime-world
description: Fill data gaps of an existing world (relations, thin pages, unplaced events, chapters, unverified data, portraits) in prioritized verified batches. Use for "completa i dati di <anime>", "enrich <world>".
argument-hint: <world> [focus: characters|locations|events|arcs|factions|abilities|relations|portraits|verification]
---

# Enrich world: $ARGUMENTS

1. **Measure (deterministic, cheap):** `npm run data:coverage -- $0 --json --limit 40`, `npm run validate:data`
   (errors/warnings for this world), `npm run coverage:chapters -- $0`. Read `docs/world-pipeline/<slug>.md` if it
   exists (previous batches, ledger). Do not open whole dataset files: grep for the ids you need.
2. **Prioritize** (write the plan in 5-10 lines, ask nothing unless scope is ambiguous):
   narrative importance (main/major first) > broken or missing relations that hurt the map (events without
   place, places without events, characters tied to no place) > thin pages that real content can lift above the
   SEO threshold > chapter gaps in the story > needs_verification items > portraits/art.
   Usefulness for maps, social journeys and SEO beats the raw number of new entities. Never pad text to pass a threshold.
3. **Batches** of one kind or one arc (≈ 10-30 entities), delegated to `anime-data-curator` with the exact ids and
   gaps to address. Each batch: research/verify → edit using the world's existing files/kits → `npm run validate:data`
   → `npm run validate:i18n` → `npm run seo:slugs` + `npm run i18n:index` if entities were added → re-run
   `data:coverage` to prove the delta → update the manifest (create it from `docs/world-pipeline/README.md` if
   missing) → commit.
4. If the world is published in /es or /fr (`translatedLocales` in `worlds.ts`), changed/added texts make the
   overlays stale: run `npm run i18n:status` and plan `/sync-translations <world> es|fr` (pages are noindex in that
   language until 100 % translated).
5. **Finish:** rebase on `main`, then `npm run social:catalog` (the world is `available`, so its social catalog
   changes with the data) and commit `tools/social-engine/catalog/*.json` → `npm run social:validate` →
   `npm run build`. Report gap counts before → after (from data:coverage), entities added/edited,
   sources, remaining needs_verification and disputes, SEO impact (indexable before → after), checks run.
