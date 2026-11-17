# Bleach — world pipeline

- slug: `bleach` · urlSlug: `bleach` · status in worlds.ts: available (published in it/en/es/fr; es/fr via overlays)
- canon perimeter: manga (686 ch., incl. the negative-numbered "Turn Back the Pendulum" / bonus chapters) + the
  one-shot "Kon-so Reisai" (2021, event `evt-bl-konso-reisai`); "Burn the Witch" is not in the dataset
- adaptations flagged as: anime-original arcs (Bount, Amagai, Zanpakutō Rebellion, Gotei Invasion) and the Menos Forest
  episodes → `canon: 'filler'`; the TYBW anime is treated as manga-faithful (episode numbers are only references)
- last update: 2026-11-17 · next step: batch 3 — chapter-gap events (+ remaining batch-2 leftovers, see Open issues)

## Batches (enrichment)

| # | Batch | Status | Counts | Commit | Notes |
|---|---|---|---|---|---|
| 1 | relations + thin pages | done | +5 events (118 → 123); ~6 events edited (characterIds); ~3 abilities (`longDescription`, 2 set to needs_verification) | 22a3005 | gaps: thin abilities 3 → 0, characters without event 6 → 0, locations without event 12 → 7 |
| 2 | event chapters + needs_verification | done | `mangaChapters`/`animeEpisodes` on 29 of the 31 events (31 → 2 left); manga coverage 351 → 451/686 ch.; needs_verification 39 → 35; 2 text fields fixed (isshin-vs-grand-fisher description, las-noches-wall shortDescription) | | 2 events left without reference: `evt-bl-kyoraku-captain-commander`, `evt-bl-ichigo-vs-haschwalth` |
| 3 | chapter-gap events | todo | | | `npm run coverage:chapters -- bleach`; Division 2/4/9/10 barracks host no event |
| 4 | es/fr translation sync | todo | 13 new it/en fields (5 events × title+description, 3 ability `longDescription`) | | `i18n:extract` → translate → `i18n:merge` → `i18n:index`; until then the 3 abilities are noindex in es/fr |

## Sources

| id | source | type | used for | access notes |
|---|---|---|---|---|
| S1 | Bleach manga, Shueisha (686 ch.) | primary | canon perimeter | not directly consulted in this batch (no access) |
| S2 | Wikipedia, "List of Bleach chapters" (1–187, 188–423) | reputable secondary | chapter numbers and titles (119, 243-262, 296-300) | web fetch |
| S3 | daddyjim.com chapter list pages (`/bleach/manga-chapter/page/N`) and chapter / episode / character pages (fan summary database) | community, secondary | chapter-level one-line summaries used to place events (ch. 46, 98, 119-126, 134-136, 183-189, 214-240, 247, 270-276, 287-298, 319-327, 377-423, 439-474, 525, 529-537, 580-596, 614-644, 659-662, 668-676); first appearances | web fetch; list covers 623 of 686 chapters (some missing); summaries only, nothing copied |
| S5 | Wikipedia, `List of Bleach chapters` (1–187, 188–423, 424–686) | reputable secondary | authoritative chapter number ↔ title mapping, incl. -17 / -16 / TBTP side chapters | web fetch |
| S4 | Bleach Wiki (Fandom) via search snippets | community (discovery only) | leads; the pages themselves returned HTTP 402 | not fetchable |

## Ledger (significant claims only)

| entity id | claim | source(s) | status | note |
|---|---|---|---|---|
| zan-bl-gamuza | Nelliel's Resurrección appears vs Nnoitra in ch. 296 (centaur form, Lanzador Verde pierces Nnoitra's sword and shoulder, she reverts to child form) | S2 (ch. 296 opens vol. 34), S3 | verified | two sources agree; dataset ability stays `verified` |
| zan-bl-antithesis | Schrift "A" promised to Uryū in ch. 543; Haschwalth's suspicion starts the duel in ch. 659; wound swap vs Haschwalth; "maybe the only power able to stop Yhwach" | S3 + search summaries | unverified | chapter of the wound swap itself not established; dataset: needs_verification |
| zan-bl-power | Meninas debuts ch. 544; smashes Kenpachi into a crater, drops a building on rescuers (ch. 580) | S3 | unverified | single source; dataset: needs_verification |
| evt-bl-hitsugaya-junrinan | Bonus chapter -16 "Death on the Ice Field" (vol. 32) | S3 | unverified | single source; dataset: needs_verification |
| evt-bl-academy-hollow-attack | Academy field exercise = ch. -17 (anime ep. 46 expands it) | S3, search summaries | unverified | accounts of what happens to Hisagi differ; description kept general; needs_verification |
| evt-bl-uryu-powers-restored | Deal at Karakura Hospital in ch. 189; arrow restoration beneath the hospital in ch. 226 | S3 | unverified | needs_verification |
| evt-bl-las-noches-wall-breach, loc-bl-las-noches-wall | Wall breached in ch. 247 ("United On The Desert") by Ichigo + Renji combining Zangetsu and Zabimaru; Chad/Uryū are featured in the chapter but not shown attacking | S3 (ch. 247, read twice), S5 (title) | unverified | dispute resolved in favour of the chapter summary: location text corrected (Ichigo + Renji, no Getsuga/Brazo); event stays needs_verification (single source; Chad/Uryū presence) |
| evt-bl-menos-forest-ashido | Menos Forest episodes are anime-original (ep. 147-148; ep. 149 contested) | S3, search summaries | unverified | canon `filler`; Renji's role in the episodes not established |
| char-bl-ginrei | Appears at Urahara's captaincy ceremony (ch. -107, Turn Back the Pendulum) | S3 | unverified | added to `evt-bl-urahara-captain` |
| char-bl-katagiri | First appears ch. 530 (Ishida household, "Everything But the Rain" chapters) | S3 | unverified | added to `evt-bl-white-attack` (range ~528-532) |
| char-bl-kiyone, char-bl-sentaro | Present on Sōkyoku Hill with Ukitake (first appear ch. 119) | S3 | unverified | added to `evt-bl-sokyoku-stopped` |
| char-bl-moe | First appears ch. 437; Xcution member | S3 | unverified | added to `evt-bl-ichigo-joins-xcution` (range ~424-445) |
| char-bl-rudbornn | First appears ch. 254; Exequias finish off Dordoni, then move on Chad/Gantenbainne until Unohana arrives | S2, S3 | unverified | added to `evt-bl-ichigo-vs-dordoni` and `evt-bl-chad-vs-gantenbainne` |

| evt-bl-hitsugaya-junrinan | ch. -16 "Death on the Ice Field" (vol. 32 bonus): Junrinan, grandmother, Rangiku urges him to enter the Academy | S5 title + S3 summary | verified | lifted from needs_verification |
| evt-bl-academy-hollow-attack | ch. -17 "Prelude for the Straying Stars": Academy field exercise, Aizen and Gin rescue | S5 title + S3 (manga + ep. 46 pages) | verified | lifted; -17 = Academy story, -16 = Hitsugaya/Junrinan (checked) |
| evt-bl-uryu-powers-restored | ch. 189 (deal at Karakura Hospital) + ch. 226 (arrow restoration beneath the hospital); ch. 186 Ryūken offers it | S3, S5 | verified | lifted |
| evt-bl-soken-death | ch. 46 (Uryū recounts the death), ch. 123-124 (Mayuri's confession, Uryū's memories) | S3 | verified | lifted; `mangaChapters` ['46', '123-124'] |
| evt-bl-uryu-vs-mayuri | real range is ch. 119-126 (was `~114-122`) | S3, S5 | verified | lifted |
| evt-bl-ichigo-vs-ulquiorra-first | ch. 270-272 (Ulquiorra overpowers Ichigo, leaves him) | S3 | verified | lifted |
| evt-bl-isshin-vs-grand-fisher | ch. 186-188: Isshin cuts down Grand Fisher in Karakura BEFORE the Hueco Mundo arc, no "Arrancar Grand Fisher / revenge on Karin" | S3, S5 | disputed | description rewritten (it+en), order 565 → 515; stays verified (core fact checked) |
| evt-bl-urahara-training-chad-orihime | ch. 214: Chad asks Urahara to train him; ch. 224 flashback shows Urahara training Chad; nothing found on Yoruichi / Orihime | S3 | unverified | text says Yoruichi trains Chad and Orihime → set needs_verification, text untouched |
| evt-bl-ichigo-vs-haschwalth | ch. 661: Uryū stays to face Haschwalth while Ichigo climbs; no Ichigo-vs-Haschwalth fight found | S3 | unverified | set needs_verification, no chapters; check in batch 3 whether the event should exist |
| evt-bl-kaien-death | ch. 134-136 (Kaien vs the Hollow that killed his wife; Rukia strikes him) | S3 | unverified | "Metastacia was Aizen's experiment" (longDescription) not confirmed; stays needs_verification |
| evt-bl-ginjo-first-substitute | ch. 462 (badge system exists because of Ginjō), ch. 474 (badge as leash) | S3 | unverified | that Ukitake gave him the badge and that he killed Soul Reapers: not confirmed |
| evt-bl-kenpachi-vs-yhwach | sources suggest Kenpachi was already beaten when Yamamoto arrived (before, not after, Yamamoto falls); anime ep. 8 only | search summaries | unverified | stays needs_verification; no chapter established |
| evt-bl-first-blood-war, evt-bl-soul-king-sealed | no manga chapter established; the thousand-year-war flashback is anime-original in TYBW ep. 7, the Soul King / three-realms flashback is in TYBW ep. 28 | search summaries (S4-like) | unverified | referenced by `animeEpisodes` only |
| evt-bl-kyoraku-captain-commander | chapter not established (Yamamoto dies ch. ~510-511) | — | unknown | left without reference |
| evt-bl-giselle-zombies | ch. 580, 590-596 confirmed for the zombies/Mayuri; "Giselle kills Bambietta" unconfirmed | S3 | unverified | stays needs_verification |

## Open issues

- Numeric-only corrections in batch 2: `evt-bl-white-attack` `~528-532` → `529-537` (Isshin/Masaki flashback), `evt-bl-gerard-miracle` `~668-672` → `668-672`; `evt-bl-uryu-vs-haschwalth` has `659-661` only (the Antithesis reveal / Haschwalth's death chapters are not established).
- Locations hosting no event: `loc-bl-division-2`, `-4`, `-9`, `-10` (no verified event found yet); `loc-bl-reiokyu`,
  `loc-bl-karakura`, `loc-bl-las-noches` are containers with a `subMapLevelId` (events live on their sub-locations).
- Remaining `~` ranges on older events (e.g. `evt-bl-grimmjow-raid`, `evt-bl-substitute-badge`, `evt-bl-ichigo-vs-ginjo`, `evt-bl-royal-guard-falls`, `evt-bl-kyoraku-vs-lille`) were not re-checked; daddyjim list is missing ~63 chapters (e.g. 510-520, 633-658 partly).
- es/fr translation (batch 4): batch-1 fields (13) + batch-2 text edits: `evt-bl-isshin-vs-grand-fisher.description`, `loc-bl-las-noches-wall.shortDescription`.
