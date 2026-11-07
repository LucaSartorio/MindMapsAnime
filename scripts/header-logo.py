#!/usr/bin/env python3
"""Genera il logo dell'header (TopNav) da `public/favicon.png` (1024×1024).

    python3 scripts/header-logo.py

Il logo è mostrato a 36×36 px CSS: servire il PNG originale da 800 KB costava
~0,8 MB su ogni prima visita (PERF-01). Questo script scrive due WebP LOSSLESS
(nessuna perdita di qualità rispetto al ridimensionamento) in `src/assets/brand/`:

  - animapverse-logo-72.webp   → schermi 1× e 2× (72 = 36 × 2)
  - animapverse-logo-108.webp  → schermi 3× (108 = 36 × 3)

Importati da TopNav, Vite li pubblica in `/assets/` con hash nel nome (cache
`immutable` di 1 anno, vedi vercel.json). Entrambi superano i 4 KB, quindi Vite
non li incorpora in base64 nel bundle JS. Tela intera 1024×1024 conservata (nessun
ritaglio: stesso aspetto di prima); ridimensionamento con alpha premoltiplicato
(niente aloni sui bordi trasparenti). Deterministico: rieseguirlo dà gli stessi byte
a parità di versione di Pillow/libwebp. Richiede Pillow (già usato dagli altri
script Python del repository).
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "favicon.png"
OUT = ROOT / "src" / "assets" / "brand"
SIZES = (72, 108)


def main() -> None:
    src = Image.open(SRC).convert("RGBA")
    OUT.mkdir(parents=True, exist_ok=True)
    for size in SIZES:
        img = src.convert("RGBa").resize((size, size), Image.LANCZOS).convert("RGBA")
        dest = OUT / f"animapverse-logo-{size}.webp"
        img.save(dest, "WEBP", lossless=True, method=6, exact=False)
        print(f"{dest.relative_to(ROOT)}: {dest.stat().st_size} B ({size}×{size})")


if __name__ == "__main__":
    main()
