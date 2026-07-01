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

## Copyright

La mappa di riferimento è il poster fan-made "Dragon Ball World Map" (Kris
Ambry per LocoDog.Store, v1.0 novembre 2020) — merchandise non a licenza
libera, non incluso in questo repo. Il mondo rappresentato è © Akira
Toriyama / Shueisha; il disegno della mappa è © dell'autore indicato.
**Verifica di averne il diritto d'uso prima di pubblicare il sito con questo
file** — in alternativa sostituiscila con una mappa generata localmente o
un'illustrazione originale.
