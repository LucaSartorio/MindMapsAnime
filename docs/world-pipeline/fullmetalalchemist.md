# Fullmetal Alchemist — world pipeline

- slug: `fullmetalalchemist` · urlSlug: `fullmetal-alchemist` · status in worlds.ts: coming_soon (loader registered,
  dataset in progress: private everywhere, checked by `validate:data` / `validate:i18n`)
- canon perimeter: the manga by Hiromu Arakawa (Square Enix, Monthly Shōnen Gangan, Aug 2001 issue → Jul 2010 issue;
  108 chapters, 27 tankōbon volumes). Bonus/gaiden stories in the volumes are outside the 108-chapter count and
  are added only if a batch needs them (flag them in the ledger)
- adaptations flagged as: *Fullmetal Alchemist: Brotherhood* (2009-2010, 64 ep.) = manga-faithful, used only for
  `animeEpisodes` references; the 2003 anime (51 ep.) and its film *Conqueror of Shamballa* = separate continuity
  (diverges from the manga after the early volumes), **excluded**; the film *The Sacred Star of Milos* (2011,
  anime-original) → excluded unless the owner wants it (would be `canonStatus: 'movie'`); live-action films excluded
- id prefix: `fma` (`char-fma-…`, `loc-fma-…`, `evt-fma-…`, `arc-fma-…`, `faction-fma-…`); dataset export `fmaDataset`
- last update: 2026-11-23 · next step: batch 2 — map levels + `scripts/mapgen/fullmetalalchemist.py` (map-engineer)

## Model mapping (discovery, to confirm per batch with sources)

- Power system (`config.ability`, term already "Alchemy"): categories to define in batch 9 from sources (e.g.
  Amestrian alchemy, Xingese alkahestry, homunculus abilities, Philosopher's Stone); none written yet.
- Rank system: Amestris military ranks (`characterRank` = "Military rank", already in `WorldConfig`); State Alchemist
  titles as data, not config.
- Map levels (plan, batch 2): one world map (Amestris + neighbouring countries) and, if sources support a layout,
  sub-maps for Central City. Original generated SVG only (`scripts/mapgen/kit.py`), no traced official maps.
- Optional kinds that make sense: battles, family (Elric / Rockbell / Armstrong / Hohenheim lines), structure
  (military, Homunculi), teams (only if a real team exists in the work). Tournaments: none in the work → skipped.

## Batches

| # | Batch | Status | Counts | Commit | Notes |
|---|---|---|---|---|---|
| 1 | config + skeleton + loader | done | all kinds 0 | (this commit) | existing `worlds.ts` entry kept (id/slug/urlSlug/theme/metadata/config unchanged, metadata matches S2); `src/data/fullmetalalchemist/index.ts` + loader in `registry.ts`; `WORLD_STYLES` placeholder entry already present |
| 2 | map levels + generator | todo | levels 0 | | fill `availableMapLevelIds` + default level |
| 3 | main characters | todo | chars 0 | | |
| 4 | places, nations/regions | todo | | | |
| 5 | arcs | todo | | | |
| 6 | events | todo | | | `mangaChapters` per event |
| 7 | factions, relations, family | todo | | | |
| 8 | battles, markers | todo | | | no tournaments |
| 9 | power system | todo | | | categories in `WorldConfig` |
| 10 | routes, secondary chars, portraits | todo | | | |
| 11 | translations | todo | | | `{ it, en }` throughout; es/fr only if the owner asks |
| 12 | publication gate | todo | | | owner approval required to flip `status` |

## Sources

| id | source | type | used for | access notes |
|---|---|---|---|---|
| S1 | *Fullmetal Alchemist* manga, Hiromu Arakawa, Square Enix (108 ch., 27 vol.) | primary | canon perimeter | not directly consulted (no access in this session) |
| S2 | Wikipedia, "List of Fullmetal Alchemist chapters" (en.wikipedia.org/wiki/List_of_Fullmetal_Alchemist_chapters) | reputable secondary | serialization dates, 108 chapters, 27 volumes | web search summary only; the chapter table is still to be fetched (batch 5/6) |
| S3 | Anime News Network, "Manga vs. Anime: Fullmetal Alchemist" (2016-05-11); /Film, "Why the two Fullmetal Alchemist series are so drastically different" | editorial | 2003 anime diverges (manga at ~5 vol. when it began); Brotherhood follows the completed manga | web search summary |

## Ledger (significant claims only)

| entity id | claim | source(s) | status | note |
|---|---|---|---|---|
| world-fullmetalalchemist | 108 chapters, 27 volumes, serialized 2001-2010 | S2 | unverified | MyAnimeList counts 116 (bonus material); 108 = main story, used as perimeter |

## Open issues

- Owner decision (optional): include *The Sacred Star of Milos* as `canonStatus: 'movie'`? Default: excluded.
- `npm run data:coverage -- fullmetalalchemist` prints nothing while the dataset is empty.
