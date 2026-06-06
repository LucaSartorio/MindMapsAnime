# One Piece · world map

Drop the world-map image here as:

    onepiece-world-map.jpeg

(referenced by `op-world-map-reference` in `src/data/onepiece/assets.ts`
and by `ONEPIECE_WORLD_MAP_SRC` in `src/data/onepiece/mapLevels.ts`).

The binary is **not** committed (copyright). Until the file is present the map
falls back to a neutral placeholder.

**Coordinate plane:** all `location.x/y` use the viewBox **2000 × 1000**
(see `ONEPIECE_MAP_VIEWBOX`). If the image you drop has a different size,
keep the same ~2:1 aspect ratio so pins stay aligned. Conversion from pixels:

    flowX = px_x / imageWidth  * 2000
    flowY = px_y / imageHeight * 1000
