# Black Clover — immagini delle entità (drop-in)

`EntityImage` mostra un placeholder SVG generato localmente finché non trova
un file **con lo stesso nome dell'id dell'entità** in una di queste cartelle:

```
src/assets/worlds/blackclover/characters/<characterId>.<ext>
src/assets/worlds/blackclover/jutsu/<magicId>.<ext>
src/assets/worlds/blackclover/clans/<factionId>.<ext>
src/assets/worlds/blackclover/locations/<locationId>.<ext>
src/assets/worlds/blackclover/arcs/<arcId>.<ext>
```

Esempi: `characters/char-bc-asta.webp`, `clans/faction-bc-black-bulls.webp`,
`locations/loc-bc-hage.webp`, `jutsu/magic-bc-anti-magic.webp`.
La scoperta avviene a build time via `import.meta.glob` (vedi
`src/components/common/EntityImage.tsx`): basta aggiungere il file, non serve
registrarlo da nessuna parte.

Il **logo del mondo** sta invece in `src/assets/worlds/logos/blackclover.png`,
e la **world map** in `public/assets/worlds/blackclover/maps/` (vedi il README
lì per il piano coordinate).

## Copyright

Non aggiungere qui immagini ufficiali del manga o dell'anime: il mondo di
Black Clover è © Yūki Tabata / Shueisha. Usa solo materiale di cui hai il
diritto d'uso, oppure lascia i placeholder generati localmente.
