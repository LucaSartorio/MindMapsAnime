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
- last update: 2026-11-23 · next step: batch 4 — places + nations/regions, then add `locationIds`/`nationIds` to the 57 events (needs a source for city positions); else batch 7 — factions, relations, family

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
| 5 | arcs | done | arcs 18 (17 manga covering ch. 1-108 contiguously + 1 movie); all needs_verification | (this commit) | `arcs.ts`; names/boundaries are an editorial convention (no official arcs, single source S14); Brotherhood episode ranges from a community list (S15) cross-checked with episode titles (S16); Milos at `order` 13 (S6 editors place it around ep. 21); no `saga` grouping (none sourced); `eventIds` derived from events in `index.ts` |
| 6 | events | done | events 57 (53 manga with `mangaChapters` + 4 Milos `movie`); 41 verified / 16 needs_verification; manga coverage 100/108 ch. (93 %), 0 gaps ≥ 5 | (this commit) | `eventHelpers.ts`, `periods.ts` (editorial phase labels, no in-story dates), `eventsEarly.ts` (31), `eventsWar.ts` (26); ≥ 1 event per arc; backstory (Xerxes, Hohenheim, Ishval, human transmutation) at order 10-60 with the chapters where the manga shows it; no `locationId(s)`/`factionIds`/`battle` yet; `verified` = event in a Brotherhood summary + chapter pinned by ≥ 2 signals (titles S2, footnotes S9/S10); uncovered single chapters: 22, 25, 26, 28, 63, 80, 81, 98 |
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
| S14 | Epic Stream, "All Fullmetal Alchemist Arcs in Order" (epicstream.com/article/fullmetal-alchemist-arcs-in-order) | editorial, single source | the 17 manga arc names + chapter ranges | web fetch; gives no basis for its division |
| S15 | MyAnimeList user stack "Fullmetal Alchemist Anime Watch Guide" (myanimelist.net/stacks/58056) | community, user-made | Brotherhood episode range per arc | web fetch; not authoritative |
| S16 | Wikipedia, "List of Fullmetal Alchemist: Brotherhood episodes" | encyclopedia | episode titles + summaries (descriptions; title cross-check of S15 boundaries) | web fetch |
| S18 | /Film, "How the Fullmetal Alchemist: Brotherhood anime shortchanges the manga's best arc"; Yen Press vol. 15 blurb; Goodreads review | editorial / publisher blurb | Ishval flashback = vol. 15 (ch. 58-61), condensed into ep. 30 | search snippets only |
| S19 | daddyjim.ai chapter/episode pages (ch. 1, ch. 23, ep. 40) | community / aggregator | ep. 40 ↔ ch. 74-76, ch. 23 = human transmutation, ch. 1 summary | search snippets only; low reliability |
| S17 | aggregator / search summaries for ch. 3-4 | community / aggregator | short Mining Town / Battle on the Train descriptions only | search summary only; low reliability |

Batch 3 also used S6 (Milos film characters) and S2 (full chapter table, as context).

Batch 6 re-read S2 (full chapter-title table), S16 (episode summaries ep. 1-64), S9 (in full: chapter footnotes), S10 (chapter citations, partly inconsistent), S6 (Milos plot). Not reachable: supersummary.com (HTTP 429); no per-chapter summary site found.

Batch 5 also re-used S2 (volume ↔ chapter table; it names no arcs), S6 (Milos placement), S11 (plot sequence).

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
| arc-fma-* (manga) | the 17-arc division and chapter boundaries | S14 | unverified (editorial) | no official arcs; all needs_verification |
| arc-fma-* (manga) | Brotherhood episode ranges | S15 + S16 title cross-check | unverified | ep. 19 and 29 shared by two arcs; ep. 1-2 sit in Dublith (Brotherhood opens out of order) |
| arc-fma-mining-town, arc-fma-battle-on-the-train | content of ch. 3 and 4 | S2 titles, S17 | unverified (thin) | check against vol. 1; no episodes listed |
| arc-fma-rush-valley | the Elrics' presence in ch. 17-19 | — | unknown | only Winry listed |
| arc-fma-sacred-star-of-milos | placement at `order` 13 (around ep. 21, range ep. 15-24) | S6 | editor estimate | not official; move to the end if a strict order is preferred |
| arc-fma-* | descriptions paraphrased from Brotherhood summaries (manga-faithful per S3) | S16, S11 | proxy source | manga not consulted directly |
| arc-fma-briggs | Xerxes flashback (ch. 75, ep. 40) kept inside the arc | S2, S16 | unverified boundaries | longDescription only |
| arc-fma-promised-day | volume gaiden (vol. 3, 4, 7, 8, 14, 23, 24, 27) outside the 108 chapters | S2 | note | not added |
| arc-fma-* | Italian arc names are own translations | — | unofficial | revisable without touching ids |
| evt-fma-* | chapter ↔ event mapping | S2 titles, S9/S10 footnotes, S16 | unverified (no manga read) | 41 verified = ≥ 2 signals; 16 needs_verification |
| evt-fma-* | Wikipedia chapter footnotes disagree by ±1 | S9, S10, S2 | disputed (sources) | e.g. Ross's faked death cited at ch. 40 and 41 though Lust dies ch. 39 → wide ranges used |
| evt-fma-ross-faked-death | ch. 36-38 | S16 ep. 17, S10 | unknown | range inferred from titles; needs_verification |
| evt-fma-xerxes-falls | who made whom (Father / Hohenheim) | S16 ep. 40, snippets | disputed (inside sources) | text kept generic; ep. 40 ↔ ch. 74-76 from S19 only |
| evt-fma-elrics-human-transmutation | ch. 23 holds the attempt; flashback may spread over ch. 22-24 | S2, S10, S19, S16 ep. 2 | unverified (extent) | |
| evt-fma-edward-becomes-state-alchemist | ch. 24 | S2 title, S16 ep. 2 | inferred | needs_verification |
| evt-fma-cornello-exposed-liore | stone real vs fake; place name Liore vs Reole | S19 vs S16 ep. 3 | disputed | text says "supposed Stone" |
| evt-fma-ishval-war-begins | Envy started the civil war (ch. 51) | S16 ep. 25, S9 | unverified | details left out; needs_verification |
| evt-fma-ishval-war-of-extermination | ch. 58-61 flashback, ch. 57 frame story | S18, S2, S10 | unverified (boundary) | Brotherhood compresses it into ep. 30 |
| evt-fma-marcoh-confesses-ishval-truth | who held Marcoh at the time | S16, S10 | unknown | text silent |
| evt-fma-kimblee-killed | Pride devours Kimblee (ch. 93) | S9 only | unverified | needs_verification |
| evt-fma-final-battle-father-defeated | Father's defeat / Greed's sacrifice at ch. 107 or 108 | S9, S10 | disputed (sources) | range 107-108 |
| evt-fma-journeys-end-epilogue | Havoc's legs request | S16 ep. 64 only | Brotherhood only | flagged in longDescription |
| evt-fma-milos-atlas-unmasked | what Atlas did to the real Ashleigh | S6 | disputed (inside source) | text: "took his face and identity" |
| evt-fma-* | Brotherhood reorders some chapters (e.g. ep. 18-19 vs ch. 39-41) | S16, S2 | note | `animeEpisodes` are references, not mappings |
| (batch 3) | Italian renderings of titles/epithets (e.g. «Alchimista d'Acciaio») | — | unverified | no official Italian edition consulted; aliases/descriptions only, revisable without touching ids |

## Open issues

- Source access: the FMA fandom wiki refuses direct fetches; no primary (manga) access. City positions for batch 4
  need a better source (e.g. the manga chapter that shows the country map, or an authorised wiki read).
- No sourced railway lines and no sourced Central City layout → no railway layer, no Central sub-map for now.
- `npm run data:coverage -- fullmetalalchemist` prints nothing while the dataset is empty.
