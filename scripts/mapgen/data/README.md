# Dati geografici per `scripts/mapgen/aot.py` e `scripts/mapgen/jjk.py`

- `ne_110m_land.json` — Natural Earth 1:110m Land (contorni delle terre emerse).
- `ne_50m_madagascar.json` — Natural Earth 1:50m, solo il Madagascar (base dell'isola di Paradis).
- `ne_10m_japan_admin1.json` — Natural Earth 1:10m Admin-1, le 47 prefetture del Giappone (Jujutsu Kaisen).
- `ne_10m_japan_lakes.json` — Natural Earth 1:10m Lakes, solo il lago Biwa.
- `ne_10m_japan_rivers.json` — Natural Earth 1:10m Rivers, i fiumi Ishikari, Tone e Mogami.
- `ne_10m_land_east_asia.json` — Natural Earth 1:10m Land ritagliato su 122–150°E, 22–47,5°N (Corea, Cina, Russia).

Fonte: [Natural Earth](https://www.naturalearthdata.com/) — **dominio pubblico** (nessun
obbligo di attribuzione; citata per trasparenza). Lo script ribalta i contorni in verticale,
come la Terra capovolta di Attack on Titan, e li disegna nelle mappe originali di AniMapVerse;
`jjk.py` li usa diritti (proiezione di Mercatore) e semplifica i contorni a livello sub-pixel.
