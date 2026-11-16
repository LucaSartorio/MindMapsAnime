---
paths:
  - "src/components/common/{EntityImage,entityArt,abilityFormArt,fruitArt,portraitArt,portraitDetailed}.tsx"
  - "src/lib/{worldPlaceholders,abilityArt,portrait}.ts"
  - "src/utils/{entityImage,worldCursor}.ts"
  - "src/data/*/{appearance,fruitLooks}.ts"
  - "src/assets/**"
---

# Entity images, placeholders, portraits

Moved verbatim from `CLAUDE.md`.

### Entity images & per-world placeholders
`src/components/common/EntityImage.tsx` renders a themed SVG placeholder per entity. A real image is
used if a **drop-in** file named `<entityId>.<ext>` exists under
`src/assets/worlds/<slug>/{characters,jutsu,clans,locations,arcs}/` (auto-discovered at build time via
`import.meta.glob`, for ALL worlds). World logos: `src/assets/worlds/logos/<slug>.png`. World cursor:
`src/utils/worldCursor.ts`.

**The generated placeholders are per-world.** They used to be drawn on Naruto's visual codes (ninja
headband on characters, chakra swirl on techniques) and were reused for every world — a straw-hat
pirate got a forehead protector. Now each world declares its own symbols in the registry
`src/lib/worldPlaceholders.ts`:
- `WORLD_STYLES[slug]` picks a **motif** per kind — `character` (headband · straw hat · spiky hair ·
  Nen aura · grimoire · hood · blade · …), `ability` (chakra swirl · devil fruit · ki orb · Nen
  hexagram · magic circle · slash · …) and `emblem` (crest · Jolly Roger · dragon ball · Hunter badge ·
  squad banner · wings · …), drawn by `src/components/common/entityArt.tsx`. All shapes are **original
  geometry**, never official artwork (see Copyright below).
- `ink` is the world's signature colour used *inside* the motif (straw gold, ki orange, Nen cyan,
  grimoire gold), so the symbol stays recognisable whatever the entity's tint.
- Background tints derive from the world's own `theme` (`primary/accent/highlight` in `worlds.ts`) via
  `getWorldEntityColor`, with a per-kind slot (`DEFAULT_TINT`, overridable per world through `tint`)
  and a **narrow** deterministic hue jitter — entities differ from each other without leaving the
  world's palette.
- Per-entity colour overrides live in `WORLD_ENTITY_COLORS`, **scoped by world**: Naruto's chakra
  natures / villages / clans tint only Naruto (Dragon Ball reuses attribute ids like `wind` with a
  different meaning, and used to inherit Naruto's greens).

**Technique images are data-driven** (`src/lib/abilityArt.ts` → `src/components/common/abilityFormArt.tsx`):
pass `ability={jutsu}` to `EntityImage` and `resolveAbilityArt(slug, jutsu)` picks a **form** from the category
(`type` → `chakraNature` → `classification`; `COMMON_FORMS` for shared ids like `transformation`/`item`/`taijutsu`,
`WORLD_FORMS` for world-only ones: Paramecia/Zoan/Logia fruits, the Nen hexagon with the category's vertex lit,
Quincy bow, Hollow mask…) and an **element** glyph (`ELEMENT_KEYWORDS`: natures, types and tags, IT/EN, exact
match) that also tints the background (`ELEMENT_COLORS`, after the world's own colours like Naruto's chakra
natures). Unknown ids fall back to the world motif — a new world needs no edits; add ids to the maps to enrich it.

**Fruit illustrations** (`Jutsu.fruit: FruitLook`, drawn by `FruitArt` in `src/components/common/fruitArt.tsx`): a
declarative spec — `body` (round, melon, pear, heart, flames, cloud, cactus, paw, flower, mushroom, berry, grapes,
scales, bananas/ghosts/blades, twin, jaws, segments, wheel…), colours, `stem` and `features` — rendered as one
outlined silhouette covered by the Devil Fruit swirls. One Piece fills it in `src/data/onepiece/fruitLooks.ts`
(`withFruitLooks`, unknown ids throw) ONLY for the 38 fruits the series actually shows, each translated from the
wiki's textual "Appearance" description (no image downloaded or traced). The fruits never shown keep the symbolic
type+element art: never invent a canonical-looking design for them.

**Character portraits are data-driven too**: `Character.appearance` (`CharacterAppearance`) is written per world in
`src/data/<world>/appearance.ts` (`appearanceKit` → `withAppearance`, applied last in the world's `index.ts`; unknown ids
throw) and passed as `appearance={character.appearance}` to `EntityImage`. With `face` set it is drawn by the **manga-style
`DetailedPortrait`** (`src/components/common/portraitDetailed.tsx`): face shape + eyes/brows/mouth/nose styles (`fc('male
sharp angry smirk')` shorthand, `d(hair, hairStyle, clothes, outfit, face, rest)` one-liner), cel shading, a library of hair
styles (`HAIR`, or hand-drawn `hairFront`/`hairBack`/`hairDetail` paths), outfits (`clothes`: gi, flak_vest, akatsuki,
haori, survey, uniform, saiyan_armor…), special irises (`sharingan`, `ripple`, `byakugan`), two-tone hair (`hair2`), per-eye
colour (`eyes2`) and many `marks` (headbands, hats, scars, tattoos, masks, horns…). Animals use the same style through
`species: 'beast'` + `face.shape` = `fox · tanuki · cat · ape · ox · panda` (`BeastPortrait`: tailed beasts, Panda). Without
`face` the old symbolic `PortraitArt` is the fallback. Every main/major character of the 8 worlds has a detailed portrait
(no drop-in photo overrides them any more), each built from the wiki's textual appearance description — own drawing, no image downloaded or traced.
Colours are palette names (`PORTRAIT_COLORS`, `src/lib/portrait.ts`) or hex; an unknown id (style, mark) is ignored.

`EntityImage` resolves the world from `useWorldStore` (optional `worldSlug` prop overrides it for
cross-world cards), so call sites don't change. A world absent from the registry falls back to neutral
motifs but still gets its own palette — **adding an anime needs no component edits**; add an entry only
to give it dedicated symbols. Location silhouettes stay driven by `LocationType` (world-agnostic) and
cover `planet`/`dimension`/`ruins`/`hideout` too, so cosmic worlds don't render village rooftops.
