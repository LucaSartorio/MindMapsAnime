# Bleach — world pipeline

- slug: `bleach` · urlSlug: `bleach` · status in worlds.ts: available (published in it/en/es/fr; es/fr via overlays)
- canon perimeter: manga (686 ch., incl. the negative-numbered "Turn Back the Pendulum" / bonus chapters) + the
  one-shot "Kon-so Reisai" (2021, event `evt-bl-konso-reisai`); "Burn the Witch" is not in the dataset
- adaptations flagged as: anime-original arcs (Bount, Amagai, Zanpakutō Rebellion, Gotei Invasion) and the Menos Forest
  episodes → `canon: 'filler'`; the TYBW anime is treated as manga-faithful (episode numbers are only references)
- last update: 2026-11-17 · next step: batch 2 — chapter ranges + needs_verification events

## Batches (enrichment)

| # | Batch | Status | Counts | Commit | Notes |
|---|---|---|---|---|---|
| 1 | relations + thin pages | done | +5 events (118 → 123); ~6 events edited (characterIds); ~3 abilities (`longDescription`, 2 set to needs_verification) | — | gaps: thin abilities 3 → 0, characters without event 6 → 0, locations without event 12 → 7 |
| 2 | event chapters + needs_verification | todo | 31 events lack `mangaChapters`; many existing ranges are marked `~` | | also re-check the `needs_verification` events and the new batch-1 events |
| 3 | chapter-gap events | todo | | | `npm run coverage:chapters -- bleach`; Division 2/4/9/10 barracks host no event |
| 4 | es/fr translation sync | todo | 13 new it/en fields (5 events × title+description, 3 ability `longDescription`) | | `i18n:extract` → translate → `i18n:merge` → `i18n:index`; until then the 3 abilities are noindex in es/fr |

## Sources

| id | source | type | used for | access notes |
|---|---|---|---|---|
| S1 | Bleach manga, Shueisha (686 ch.) | primary | canon perimeter | not directly consulted in this batch (no access) |
| S2 | Wikipedia, "List of Bleach chapters" (1–187, 188–423) | reputable secondary | chapter numbers and titles (119, 243-262, 296-300) | web fetch |
| S3 | daddyjim.com chapter / episode / character pages (fan summary database) | community, secondary | chapter-level summaries: ch. 189, 226, 247, 249, 296, 543, 544, 580, 659; ch. -16, -17; first appearances; ep. 46 | web fetch; summaries only, nothing copied |
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
| evt-bl-las-noches-wall-breach | Breach of the Las Noches wall in ch. 247 by Ichigo + Renji (Zangetsu + Zabimaru) | S3 | disputed | existing `loc-bl-las-noches-wall` text says Ichigo and Chad (Getsuga + Brazo); event follows the chapter summary; Chad/Uryū presence in the scene not confirmed; fix the location text in batch 2 |
| evt-bl-menos-forest-ashido | Menos Forest episodes are anime-original (ep. 147-148; ep. 149 contested) | S3, search summaries | unverified | canon `filler`; Renji's role in the episodes not established |
| char-bl-ginrei | Appears at Urahara's captaincy ceremony (ch. -107, Turn Back the Pendulum) | S3 | unverified | added to `evt-bl-urahara-captain` |
| char-bl-katagiri | First appears ch. 530 (Ishida household, "Everything But the Rain" chapters) | S3 | unverified | added to `evt-bl-white-attack` (range ~528-532) |
| char-bl-kiyone, char-bl-sentaro | Present on Sōkyoku Hill with Ukitake (first appear ch. 119) | S3 | unverified | added to `evt-bl-sokyoku-stopped` |
| char-bl-moe | First appears ch. 437; Xcution member | S3 | unverified | added to `evt-bl-ichigo-joins-xcution` (range ~424-445) |
| char-bl-rudbornn | First appears ch. 254; Exequias finish off Dordoni, then move on Chad/Gantenbainne until Unohana arrives | S2, S3 | unverified | added to `evt-bl-ichigo-vs-dordoni` and `evt-bl-chad-vs-gantenbainne` |

## Open issues

- Locations hosting no event: `loc-bl-division-2`, `-4`, `-9`, `-10` (no verified event found yet); `loc-bl-reiokyu`,
  `loc-bl-karakura`, `loc-bl-las-noches` are containers with a `subMapLevelId` (events live on their sub-locations).
- Existing chapter data is approximate in places (e.g. `~` ranges, the `evt-bl-substitute-badge` range) — batch 2.
- 13 new it/en fields await es/fr translation (batch 4).
