# Fullmetal Alchemist — world pipeline

- slug: `fullmetalalchemist` · urlSlug: `fullmetal-alchemist` · status in worlds.ts: coming_soon (loader registered,
  dataset in progress: private everywhere, checked by `validate:data` / `validate:i18n`)
- canon perimeter: the manga by Hiromu Arakawa (Square Enix, Monthly Shōnen Gangan, Aug 2001 issue → Jul 2010 issue;
  108 chapters, 27 tankōbon volumes). Bonus/gaiden stories in the volumes are outside the 108-chapter count and
  are added only if a batch needs them (flag them in the ledger)
- adaptations flagged as: *Fullmetal Alchemist: Brotherhood* (2009-2010, 64 ep.) = manga-faithful, used only for
  `animeEpisodes` references; the 2003 anime (51 ep.) and its film *Conqueror of Shamballa* = separate continuity
  (diverges from the manga after the early volumes), **excluded**; the film *The Sacred Star of Milos* (2011,
  anime-original) → **included** as `canonStatus: 'movie'` (owner decision 2026-11-23); live-action films excluded
- id prefix: `fma` (`char-fma-…`, `loc-fma-…`, `evt-fma-…`, `arc-fma-…`, `faction-fma-…`); dataset export `fmaDataset`
- last update: 2026-11-23 · next step: batch 4 — places + nations/regions (needs a better source for city positions); else batch 5 — arcs

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
| 1 | config + skeleton + loader | done | all kinds 0 | 54bdf82 | existing `worlds.ts` entry kept (id/slug/urlSlug/theme/metadata/config unchanged, metadata matches S2); `src/data/fullmetalalchemist/index.ts` + loader in `registry.ts`; `WORLD_STYLES` placeholder entry already present |
| 2 | map levels + generator | done | levels 1 (`fma-map-world`, viewBox 1500×1000) | (this commit) | schematic original SVG (76 KB, deterministic) from `scripts/mapgen/fullmetalalchemist.py`: abstract Amestris outline, 5 areas, Drachma/Briggs N, Creta W, Aerugo S, Xing + desert E; no cities, no railways, no sub-maps. Area polygons `AMESTRIS_AREAS` (central/north/east/south/west) + `AREA_LABELS` ready for `MapBoundary` in batch 4; `PINS` empty |
| 3 | main characters | done | chars 28 (2 main, 24 major, 2 supporting; 25 canon + 3 movie); 6 needs_verification | (this commit) | files `charactersAmestris/Xing/Homunculi/Milos.ts` + `characterHelpers.ts`; `FMA_ROLES` (7 roles) in `config.ts` → `WorldConfig.characterRoles`; no nation/place/faction/event/family links yet (later batches); first manga appearance only for Ed, Al (ch. 1), Mustang (ch. 4), Scar (ch. 5); inferred Brotherhood "Ep. 1" removed by the orchestrator (not sourced) |
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
| S4 | CBR, "Fullmetal Alchemist: Brotherhood is a masterclass in worldbuilding" (cbr.com/fullmetal-alchemist-brotherhood-masterclass-worldbuilding-anime/) | editorial | five areas (Central + 4 cardinal), Drachma larger, Briggs, Ishval in the East | web fetch |
| S5 | CBR, "10 Things You Need To Know About Amestris" (cbr.com/fullmetal-alchemist-amestris-facts-trivia/) | editorial | neighbours: Drachma N, Creta W, Aerugo S; Briggs on the Drachma border; Ishval in the East | web fetch |
| S6 | Wikipedia, "Fullmetal Alchemist the Movie: The Sacred Star of Milos" | encyclopedia | Table City on the Amestris–Creta border; the Valley | web fetch |
| S7 | Wikipedia, "Amestris (Fullmetal Alchemist)", "Fullmetal Alchemist", "Fullmetal Alchemist: Brotherhood" | encyclopedia | Central City capital; Briggs north; few foreign countries named | web fetch; no detailed geography |
| S8 | Fullmetal Alchemist Wiki (fma.fandom.com: Amestris, List of Locations, city pages, Xerxes, Nationwide Transmutation Circle) | community (discovery only) | leads on city positions (East/South/West/North City, Rush Valley, Dublith, Baschool, Reole, Xerxes) | direct fetch blocked (HTTP 402/403): only search-result summaries; nothing from here is `verified` |
| S9 | Wikipedia, "List of Fullmetal Alchemist characters" | encyclopedia | Japanese names, ranks, roles, Homunculi abilities/fates, Hohenheim, Xing characters | web fetch via summarizer; ~100k of ~188k characters read; summaries sometimes mix the 2003 anime → only manga-consistent statements used |
| S10 | Wikipedia, "Edward Elric", "Alphonse Elric", "Roy Mustang", "Scar (Fullmetal Alchemist)" | encyclopedia | first appearances (Ed/Al ch. 1, Mustang ch. 4, Scar ch. 5), Mustang's blinding, Scar's backstory | web fetch |
| S11 | Wikipedia, "Fullmetal Alchemist" (main article) | encyclopedia | manga ending summary | web fetch (first 100k characters) |
| S12 | Screen Rant, "Fullmetal Alchemist Endings Explained" (screenrant.com/fullmetal-alchemist-endings-explained-manga-brotherhood-ed-al/) | editorial | manga epilogue (Ed/Winry, Al to Xing, Havoc, Scar, Ling, Pinako) | web fetch; does not cover Olivier, Izumi, Hawkeye |
| S13 | TV Tropes (Scar), mirror of an old Wikipedia "State Military characters" article | community / mirror | discovery only | search summaries only; nothing relied on |

Batch 3 also used S6 (Milos film characters) and S2 (full chapter table, as context).

## Ledger (significant claims only)

| entity id | claim | source(s) | status | note |
|---|---|---|---|---|
| world-fullmetalalchemist | 108 chapters, 27 volumes, serialized 2001-2010 | S2 | unverified | MyAnimeList counts 116 (bonus material); 108 = main story, used as perimeter |
| map (batch 2) | Amestris = landlocked, Central + North/East/South/West areas; Drachma N (Briggs range on the border), Creta W, Aerugo S | S4, S5, S8 | verified | drawn on the world map |
| map (batch 2) | Overall shape of Amestris's border | — | unknown | map uses an abstract outline, not the official silhouette |
| map (batch 2) | Xing lies east of Amestris beyond a desert | S8 | unverified | label only; "Great Desert" vs "Eastern Desert" not reconciled |
| (batch 4) | Ishval in the East Area; its position inside the area (south-east?) | S4, S5 (area) · S8 (position) | unverified (position) | pin position must be marked needs_verification |
| (batch 4) | Resembool's area; Liore "western desert"; Dublith / Rush Valley in the South | S8 | unverified / unknown | do not place without a better source |
| (batch 4) | Table City / the Valley (Milos) on the Amestris–Creta border | S6 | verified (coarse) | `canonStatus: 'movie'` |
| char-fma-roy-mustang | rank "Brigadier General (formerly Colonel)" | S9, S10 | unverified | S9 summary garbled; epilogue rank not confirmed → needs_verification |
| char-fma-riza-hawkeye | alive at the end | search snippet only | unverified | needs_verification |
| char-fma-alex-louis-armstrong | alive at the end; rank Major | S9 (rank) | unverified (status) | needs_verification |
| char-fma-olivier-mira-armstrong | alive at the end | S10 (Scar page), review snippet | unverified | needs_verification |
| char-fma-izumi-curtis | alive; treated by Hohenheim; Sloth fight with Armstrong and Sig | S9 | unverified | needs_verification |
| char-fma-greed | order of the two incarnations (original body vs Ling's body) | S9 | unverified | one entry; text avoids claiming the order; needs_verification |
| char-fma-father | `status: 'deceased'` for being pulled back into the Gate | S9 | disputed (semantic) | description explains it; `unknown` is the alternative |
| char-fma-melvin-voyager, char-fma-ashleigh-crichton | what Atlas did to the real Ashleigh | S6 | disputed (inside the source) | text says "attacked"; he survives as Colonel Herschel |
| (batch 3) | first manga appearance of 24/28 characters | — | unknown | left blank; the "earliest chapters cited" in S9 are not first appearances |
| char-fma-may-chang, char-fma-ling-yao, char-fma-king-bradley | names "May Chang" (Viz) vs "Mei Chan"; "Ling Yao" (official English) vs "Lin Yao"; rank "Führer" | S9, S11, S12 | note | official English forms used |
| (batch 3) | Italian renderings of titles/epithets (e.g. «Alchimista d'Acciaio») | — | unverified | no official Italian edition consulted; aliases/descriptions only, revisable without touching ids |

## Open issues

- Source access: the FMA fandom wiki refuses direct fetches; no primary (manga) access. City positions for batch 4
  need a better source (e.g. the manga chapter that shows the country map, or an authorised wiki read).
- No sourced railway lines and no sourced Central City layout → no railway layer, no Central sub-map for now.
- `npm run data:coverage -- fullmetalalchemist` prints nothing while the dataset is empty.
