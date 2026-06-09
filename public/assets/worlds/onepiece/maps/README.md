# One Piece · world map

World-map image:

    onepiece-world-map.jpeg   (4096 × 2048 px, fan-made reference)

Referenced by `op-world-map-reference` in `src/data/onepiece/assets.ts`
and by `ONEPIECE_WORLD_MAP_SRC` in `src/data/onepiece/mapLevels.ts`.
Fan-made material; the depicted world is © Eiichiro Oda / Shueisha.

**Coordinate plane:** all `location.x/y` use the viewBox **2000 × 1000**
(see `ONEPIECE_MAP_VIEWBOX`), a clean 2:1 that matches the 4096 × 2048 image.
Conversion from image pixels:

    flowX = px_x / 4096 * 2000
    flowY = px_y / 2048 * 1000

## Verifying / refining pin coordinates

Render an annotated overlay of every location pin on the map:

    tsx --tsconfig scripts/tsconfig.json scripts/onepiece-pins.ts > /tmp/op-pins.json
    python3 scripts/onepiece-overlay.py /tmp/op-pins.json \
        public/assets/worlds/onepiece/maps/onepiece-world-map.jpeg /tmp/op-overlay.png

(pins coloured by importance: main = red, secondary = orange, minor = yellow).
Requires Python + Pillow (`pip install Pillow`).

## Sub-map images (sotto-mappe)

Sub-maps (Wano, Alabasta, Skypiea, Loguetown, Impel Down, …) use a generated
SVG placeholder until you provide a real image. To add one:

1. **File** → drop it in this folder. Recommended name:

       onepiece-<slug>-submap.jpeg     e.g. onepiece-wano-submap.jpeg

   `<slug>` is the sub-map slug (see `slug` in `src/data/onepiece/mapLevels.ts`):
   `wano`, `alabasta`, `skypiea`, `dressrosa`, `totland`, `sabaody`, `marineford`,
   `egghead`, `fishman-island`, `impel-down`, `enies-lobby`, `water-seven`,
   `thriller-bark`, `zou`, `punk-hazard`, `amazon-lily`, `drum-island`,
   `mary-geoise`, `dawn-island`, `loguetown`, `jaya`, `ohara`, `elbaf`,
   `god-valley`, `germa-kingdom`.

2. **Wire it** → add one line to `ONEPIECE_SUBMAP_IMAGE_URLS` in
   `src/data/onepiece/assets.ts`:

       wano: '/assets/worlds/onepiece/maps/onepiece-wano-submap.jpeg',

   That promotes the `op-wano-submap-placeholder` asset to a real `<img>`.

3. **Coordinate plane** → sub-map pins use the MapLevel `width`/`height`
   (default **1200 × 800**). If your image has a different aspect ratio, update
   `width`/`height` for that level in `mapLevels.ts` (keep the same ratio), then:

       flowX = px_x / imgW * width
       flowY = px_y / imgH * height

Paths are served from the site root, so the `url` always starts with
`/assets/worlds/onepiece/maps/…` (the `public/` prefix is dropped at runtime).
