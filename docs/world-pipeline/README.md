# World pipeline — progress manifests & data provenance

One Markdown file per world being created or enriched: `docs/world-pipeline/<slug>.md` (`<slug>` = the internal
slug in `src/data/worlds.ts`, e.g. `fullmetalalchemist`). It is the **persistent state** of
`/add-anime-world` and `/enrich-anime-world`: a Cloud session can end at any time, so what is done, what is
verified, which sources were used and where to resume live here and in git history, never only in a conversation.

Why Markdown in `docs/` and not fields in the dataset: provenance is editorial metadata. Keeping it out of
`src/data/` keeps it out of the public bundle and out of the SEO/i18n validators; the dataset keeps only what the
site renders (`canonStatus`, `referenceStatus`, `mangaChapters`, `animeEpisodes`).

## Rules

- Update the manifest at the end of **every** batch, in the same commit as the batch.
- Keep it short: counts, decisions, sources and the ledger of *significant* claims (disputed, unverified,
  surprising, or contradicting a popular belief). Routine facts confirmed by the primary source need no row.
- Status vocabulary: `verified` (primary/official source checked) · `disputed` (sources disagree; dataset uses the
  primary source and says so) · `unverified` (secondary source only → dataset `referenceStatus: 'needs_verification'`)
  · `unknown` (not established by the work → not written as fact).
- A model's confidence is not evidence: a claim is `verified` only with a concrete source reference.
- Never paste copyrighted prose; summarize in your own words and cite.

## Template (copy to `docs/world-pipeline/<slug>.md`)

```markdown
# <Title> — world pipeline

- slug: `<slug>` · urlSlug: `<url-slug>` · status in worlds.ts: coming_soon | available
- canon perimeter: <e.g. manga (108 ch.); Brotherhood = manga-faithful; 2003 anime = separate continuity, excluded>
- adaptations flagged as: <anime-only → canonStatus 'anime_only', films → 'movie', …>
- last update: <YYYY-MM-DD> · next step: <batch N — what>

## Batches

| # | Batch | Status | Counts | Commit | Notes |
|---|---|---|---|---|---|
| 1 | config + skeleton + loader | done / in-progress / blocked / todo | — | <sha> | |
| 2 | map levels + generator | | levels 0 | | |
| 3 | main characters | | chars 0 | | |
| 4 | places, nations/regions | | | | |
| 5 | arcs | | | | |
| 6 | events | | | | |
| 7 | factions, relations, family | | | | |
| 8 | battles, tournaments, markers | | | | |
| 9 | power system | | | | |
| 10 | routes, secondary chars, portraits | | | | |
| 11 | translations | | | | |
| 12 | publication gate | | | | |

## Sources

| id | source | type | used for | access notes |
|---|---|---|---|---|
| S1 | <manga vol. 1-27, publisher> | primary | chapters, events order | consulted via … |
| S2 | <official databook / site URL> | official | names, ages | |
| S3 | <wiki URL> | community (discovery only) | leads to verify | |

## Ledger (significant claims only)

| entity id | claim | source(s) | status | note |
|---|---|---|---|---|
| char-xx-foo | <claim> | S1 ch. 12 | verified | |
| loc-xx-bar | <position relative to …> | S3 | unverified | dataset: needs_verification |

## Open issues

- <validation errors, missing map references, decisions waiting for the owner>
```
