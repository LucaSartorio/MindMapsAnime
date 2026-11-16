---
paths:
  - "src/components/common/{EntityImage,entityArt,abilityFormArt,fruitArt,portraitArt,portraitDetailed}.tsx"
  - "src/lib/{worldPlaceholders,abilityArt,portrait}.ts"
  - "src/utils/{entityImage,worldCursor}.ts"
  - "src/data/*/{appearance,fruitLooks}.ts"
  - "src/assets/**"
---

# Entity images & portraits — constraints

How it works: `docs/ARCHITECTURE.md` › Entity images and portraits.

- **Original geometry only**: placeholders, ability art, fruit art and portraits never reproduce official artwork; no
  image is downloaded or traced. Real images only as licensed drop-ins `src/assets/worlds/<slug>/{characters,jutsu,
  clans,locations,arcs}/<entityId>.<ext>` (auto-discovered).
- Per-world symbols live in `WORLD_STYLES` (`src/lib/worldPlaceholders.ts`); tints derive from the world `theme`;
  per-entity colour overrides are scoped by world (`WORLD_ENTITY_COLORS`). A new world needs no component edit.
- Technique art: pass `ability={jutsu}`; `resolveAbilityArt` maps type → chakraNature → classification
  (`COMMON_FORMS`/`WORLD_FORMS`) and element keywords (exact match). Extend the maps, not the components.
- Fruit looks (`fruitLooks.ts`, `withFruitLooks` throws on unknown ids): only for fruits the series actually shows,
  translated from textual descriptions; never invent a canonical-looking design.
- Portraits: `appearance.ts` per world (`appearanceKit` → `withAppearance`, applied last, unknown ids throw); every
  main/major character has a detailed portrait (`face` set) built from the textual appearance description; colours
  from `PORTRAIT_COLORS` or hex; animals via `species: 'beast'` + `face.shape`.
- `EntityImage` resolves the world from `useWorldStore` (`worldSlug` prop for cross-world cards).
