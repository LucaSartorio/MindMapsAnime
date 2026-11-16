---
name: analyze-data-coverage
description: Report how complete AniMapVerse datasets are (entity counts, thin/noindex pages, orphans, missing places/arcs/chapters, unverified data, missing portraits) for one world or all, and recommend the most valuable next enrichment. Use for "quanto è completo X?", "data coverage", "what's missing in Bleach?".
argument-hint: [world]
context: fork
agent: lightweight-research
allowed-tools:
  - Bash(npm run -s data:coverage *)
  - Bash(npm run -s coverage:chapters *)
---

# Data coverage: $ARGUMENTS

You only run read-only reports and summarize them. Do not edit files.

1. Run `npm run -s data:coverage -- $ARGUMENTS` (no argument = all available worlds). For a single world also run
   `npm run -s coverage:chapters -- $ARGUMENTS --gap 5` and keep only the summary lines.
2. Summarize in at most ~25 lines:
   - counts and SEO indexable ratio per category;
   - the top 5 gaps by impact (main/major characters and map-facing gaps first: events without place, places
     without events/arcs, characters tied to no place, thin pages), each with count, % and 3 sample ids;
   - largest uncovered chapter ranges;
   - needs_verification count.
3. End with `NEXT ACTION:` one concrete `/enrich-anime-world <world> <focus>` suggestion, where focus is one of
   characters | locations | events | arcs | factions | abilities | relations | portraits | verification.
Never claim a fact about the series itself: this report is about the dataset only.
