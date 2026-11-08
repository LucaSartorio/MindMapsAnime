#!/usr/bin/env python3
"""Converte in WebP SOLO le world map raster pesanti elencate qui sotto (PERF-02).

    python3 scripts/optimize-map-images.py           # scrive i .webp mancanti
    python3 scripts/optimize-map-images.py --check   # verifica soltanto, non scrive nulla
    python3 scripts/optimize-map-images.py --force   # riscrive anche i .webp già presenti

Perché uno script separato da `npm run optimize:images`: quello converte TUTTI i raster
di `public/` e `src/assets/` e CANCELLA gli originali, e richiede `sharp`, che non è
fra le dipendenze del progetto. Questo invece:

  - tocca solo le mappe in `TARGETS` (scelte misurando byte e qualità, vedi sotto);
  - NON cancella né modifica gli originali: scrive il `.webp` accanto al file sorgente;
  - mantiene le STESSE dimensioni in pixel (nessun ridimensionamento né ritaglio) e il
    profilo colore: il piano viewBox del map level e le coordinate dei pin non cambiano,
    e la mappa occupa esattamente lo stesso rettangolo sullo schermo;
  - è deterministico: a parità di Pillow/libwebp produce gli stessi byte;
  - `--check` fallisce (exit 1) se un `.webp` manca, ha dimensioni diverse dall'originale
    o non è più leggero.

Qualità scelte confrontando q75/80/85/90 + lossless (SSIM/PSNR con ffmpeg e ritagli
ingranditi 4× di testi e texture):
  - Dragon Ball (poster PNG, testi piccoli): q85. q80 è già indistinguibile sui testi,
    q85 lascia margine; lossless pesa ancora 1,9 MB.
  - Black Clover (JPEG q75 su pergamena): q80. q75 ammorbidisce la grana della
    pergamena; q85 pesa più dell'originale.
  - One Piece NON è in elenco: è già WebP (q≈80); ricodificarlo risparmierebbe ~10 %
    con una seconda perdita di qualità.

Richiede Pillow con supporto WebP (già usato dagli altri script Python del repository).
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MAPS = ROOT / "public" / "assets" / "worlds"

# (sorgente relativa a public/assets/worlds, qualità WebP)
TARGETS: tuple[tuple[str, int], ...] = (
    ("dragonball/maps/dragonball-world-map.png", 85),
    ("blackclover/maps/blackclover-world-map.jpg", 80),
)


def target_path(src: Path) -> Path:
    return src.with_suffix(".webp")


def convert(src: Path, out: Path, quality: int) -> None:
    with Image.open(src) as im:
        icc = im.info.get("icc_profile")
        rgb = im.convert("RGB")
        kwargs = {"quality": quality, "method": 6}
        if icc:
            kwargs["icc_profile"] = icc
        rgb.save(out, "WEBP", **kwargs)


def check(src: Path, out: Path) -> list[str]:
    errors: list[str] = []
    if not out.exists():
        return [f"{out.relative_to(ROOT)}: manca (esegui lo script senza --check)"]
    with Image.open(src) as a, Image.open(out) as b:
        if b.format != "WEBP":
            errors.append(f"{out.relative_to(ROOT)}: formato {b.format}, atteso WEBP")
        if a.size != b.size:
            errors.append(f"{out.relative_to(ROOT)}: {b.size} px, l'originale è {a.size} px")
    if out.stat().st_size >= src.stat().st_size:
        errors.append(f"{out.relative_to(ROOT)}: non è più leggero dell'originale")
    return errors


def main(argv: list[str]) -> int:
    only_check = "--check" in argv
    force = "--force" in argv
    errors: list[str] = []
    for rel, quality in TARGETS:
        src = MAPS / rel
        if not src.exists():
            errors.append(f"{src.relative_to(ROOT)}: sorgente mancante")
            continue
        out = target_path(src)
        if not only_check and (force or not out.exists()):
            convert(src, out, quality)
            print(f"scritto {out.relative_to(ROOT)} (q{quality})")
        problems = check(src, out)
        errors.extend(problems)
        if not problems:
            before, after = src.stat().st_size, out.stat().st_size
            print(
                f"ok  {out.relative_to(ROOT)}  {before:,} → {after:,} B "
                f"(-{(before - after) / before:.0%}), stesse dimensioni in pixel"
            )
    for e in errors:
        print(f"ERRORE  {e}", file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
