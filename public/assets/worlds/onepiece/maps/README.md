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
