# Black Clover — world map

Il dataset Black Clover si aspetta qui l'immagine della world map:

```
public/assets/worlds/blackclover/maps/blackclover-world-map.jpg
```

- Referenziata da `bc-world-map-reference` in `src/data/blackclover/assets.ts`
  (`BLACKCLOVER_WORLD_MAP_SRC` in `src/data/blackclover/mapConstants.ts`) e
  usata come sfondo del map level `bc-map-world`.
- Il piano coordinate (viewBox) è **1500 × 1057** (`BLACKCLOVER_MAP_VIEWBOX`),
  cioè il rapporto d'aspetto ~1,42:1 della mappa su pergamena "World of Black
  Clover". Se l'immagine ha lo **stesso** rapporto d'aspetto (anche a
  risoluzione diversa) non serve toccare nulla: i pin restano allineati.
  Se il rapporto è diverso, aggiorna `BLACKCLOVER_MAP_VIEWBOX` e riconverti
  tutte le coordinate dei pin con:

  ```
  flowX = px_x / imgW * 1500
  flowY = px_y / imgH * 1057
  ```

- I pin dei sei luoghi già etichettati sulla mappa (Elysia, Hage, Nean,
  Hecairo, Capitale Reale, Raquey), i quattro simboli dei semi
  (♣ Clover, ♦ Diamond, ♠ Spade, ♥ Heart) e i tre piccoli rombi neri
  (letti come dungeon) usano le coordinate lette sull'immagine di
  riferimento. Tutti gli altri luoghi sono posizionati per coerenza
  geografica con quei riferimenti e sono marcati
  `referenceStatus: 'needs_verification'` quando la posizione è dedotta e non
  disegnata sulla mappa.
- Finché il file non è presente, `WorldMapBackground` mostra uno stato neutro
  con il percorso atteso; i pin restano comunque cliccabili sopra il
  placeholder.

## File servito: WebP (PERF-02)

Il sito serve `blackclover-world-map.webp`, non `blackclover-world-map.jpg`: è lo stesso
disegno ricodificato in WebP q80 con **le stesse dimensioni in pixel** (nessun
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

## Sotto-mappe (SVG originali)

Le cinque sotto-mappe — Capitale Reale, fortezza del Regno di Spade, Regno di
Heart, Regno di Diamond (1200 × 900) e Inframondo (1200 × 1400, schema a livelli
del regno dei demoni) — sono **mappe SVG originali** disegnate da AniMapVerse
nello stile pergamena della world map: `blackclover-<slug>.svg`, generate da
`python3 scripts/mapgen/blackclover.py` (deterministico; riscrive anche x/y dei
pin delle sotto-mappe in `src/data/blackclover/`). Licenza del disegno: CC0;
il mondo resta © Yūki Tabata / Shueisha.

## Copyright

La mappa di riferimento è fan-made: non è materiale ufficiale. Il mondo
rappresentato è © Yūki Tabata / Shueisha; il disegno della mappa è © del suo
autore. **Verifica di averne il diritto d'uso prima di pubblicare il sito con
questo file** — in alternativa sostituiscila con una mappa generata localmente
o un'illustrazione originale.
