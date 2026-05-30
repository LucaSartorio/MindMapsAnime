# Hunter x Hunter — world map

Il dataset HxH si aspetta qui il PNG della mappa del Mondo Conosciuto:

```
public/assets/worlds/hunterxhunter/maps/hxh-world-map.png
```

- Referenziato da `hxh-world-map-reference` in `src/data/hunterxhunter/assets.ts`
  e usato come sfondo del map level `hxh-map-world`.
- Il piano coordinate (viewBox) è **2000 × 1180**: pin, confini e label dei
  boundary sono calibrati su queste proporzioni. Se il PNG ha un aspect ratio
  diverso, aggiorna `HXH_MAP_VIEWBOX` in `src/data/hunterxhunter/mapLevels.ts`
  mantenendo lo stesso rapporto larghezza/altezza per non disallineare i pin.
- Finché il file non è presente, `WorldMapBackground` mostra uno stato neutro
  con il percorso atteso; i confini vettoriali cliccabili restano comunque
  visibili sopra.

## Copyright

La mappa fornita è amatoriale ("Made by Sharpsider"). Il mondo rappresentato è
© Yoshihiro Togashi / Shueisha. È marcata `needs_verification` e attribuita
all'autore in `assets.ts`. Sostituiscila con un asset chiaramente licenziato
prima di qualunque pubblicazione.
