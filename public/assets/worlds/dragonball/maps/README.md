# Dragon Ball — world map

Il dataset Dragon Ball si aspetta qui il PNG della mappa della Terra:

```
public/assets/worlds/dragonball/maps/dragonball-world-map.png
```

- Referenziato da `dbz-world-map-reference` in `src/data/dragonball/assets.ts`
  (`DRAGONBALL_WORLD_MAP_SRC` in `src/data/dragonball/mapConstants.ts`) e usato
  come sfondo del map level `dbz-map-world`.
- Il piano coordinate (viewBox) è **1800 × 1200**: i pin dei luoghi sono
  posizioni concettuali stimate dal layout del poster, non estratte
  pixel-per-pixel. Se il PNG ha un aspect ratio diverso, aggiorna
  `DRAGONBALL_MAP_VIEWBOX` in `src/data/dragonball/mapConstants.ts` mantenendo
  lo stesso rapporto larghezza/altezza, poi ricalibra le coordinate con:

  ```
  flowX = px_x / imgW * 1800
  flowY = px_y / imgH * 1200
  ```

- Finché il file non è presente, `WorldMapBackground` mostra uno stato neutro
  con il percorso atteso; i pin restano comunque cliccabili sopra il
  placeholder.

## File servito: WebP (PERF-02)

Il sito serve `dragonball-world-map.webp`, non `dragonball-world-map.png`: è lo stesso
disegno ricodificato in WebP q85 con **le stesse dimensioni in pixel** (nessun
ridimensionamento né ritaglio), quindi viewBox e coordinate dei pin non cambiano.
L'originale resta qui come sorgente. Per rigenerare o verificare il WebP:

```
python3 scripts/optimize-map-images.py           # scrive il .webp se manca (--force per riscriverlo)
python3 scripts/optimize-map-images.py --check   # verifica dimensioni e peso, non scrive nulla
```

Se sostituisci l'originale, salva il nuovo WebP con un nome nuovo (es. `-v2`, poi aggiorna
la costante in `mapConstants.ts`): `/assets/worlds/**` non ha hash nel nome e resta in
cache fino a 8 giorni, quindi riscrivere lo stesso URL con `--force` mostrerebbe a lungo
la versione vecchia. Non usare `npm run optimize:images` su questa mappa: sovrascrive il
WebP e cancella l'originale.

## Copyright

La mappa di riferimento è il poster fan-made "Dragon Ball World Map" (Kris
Ambry per LocoDog.Store, v1.0 novembre 2020) — merchandise non a licenza
libera, non incluso in questo repo. Il mondo rappresentato è © Akira
Toriyama / Shueisha; il disegno della mappa è © dell'autore indicato.
**Verifica di averne il diritto d'uso prima di pubblicare il sito con questo
file** — in alternativa sostituiscila con una mappa generata localmente o
un'illustrazione originale.

## Sotto-mappe (SVG originali)

Universo (1400 × 900), Namecc (1300 × 850) e Spazio GT (1600 × 1000) sono
**mappe SVG originali** disegnate da AniMapVerse (`dragonball-<slug>.svg`),
generate da `python3 scripts/mapgen/dragonball.py` (deterministico; riscrive
anche x/y dei pin delle sotto-mappe in `src/data/dragonball/`). Licenza del
disegno: CC0; il mondo resta © Akira Toriyama / Shueisha.
