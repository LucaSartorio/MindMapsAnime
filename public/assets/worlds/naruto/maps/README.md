# Naruto — mappe

- `naruto_world_reference_expanded.webp` — world map di riferimento (vedi
  `src/data/naruto/assets.ts` per fonte e licenza).
- `naruto-<villaggio>.svg` — le nove sotto-mappe dei villaggi (Konoha 1200 × 800;
  Suna, Kiri, Iwa, Kumo, Ame, Oto, Uzushio, Taki 1000 × 700). Sono **mappe SVG
  originali** disegnate da AniMapVerse sulla base di ciò che la serie mostra
  (Roccia degli Hokage, mura di Konoha, anello di rupi di Suna, nebbia di Kiri,
  pinnacoli di Iwa, vette di Kumo, torri e pioggia di Ame, covi di Oto, vortici di
  Uzushio, cascata e albero di Taki), generate da
  `python3 scripts/mapgen/naruto.py` (deterministico; riscrive anche x/y dei pin
  delle sotto-mappe in `src/data/naruto/`, così pin e disegno restano allineati).
  Licenza del disegno: CC0; il mondo resta © Masashi Kishimoto / Shueisha.
