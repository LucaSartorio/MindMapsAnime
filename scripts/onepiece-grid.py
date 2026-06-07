#!/usr/bin/env python3
"""Disegna una griglia di coordinate (piano viewBox) sulla mappa di One Piece.

Serve a misurare con precisione la posizione delle etichette stampate: si legge
dove cade un'isola rispetto alle linee numerate, evitando stime "a occhio".

    python3 scripts/onepiece-grid.py
       -> /tmp/grid.png   (mappa con griglia, linee/etichette ogni 25/50 vb)

viewBox 2000 x 1000 ; immagine 4096 x 2048 ; fattore px = vb * 2.048
"""
from PIL import Image, ImageDraw, ImageFont

VB_W, VB_H = 2000, 1000
img = Image.open("public/assets/worlds/onepiece/maps/onepiece-world-map.jpeg").convert("RGB")
W, H = img.size
sx, sy = W / VB_W, H / VB_H
draw = ImageDraw.Draw(img)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
except Exception:
    font = ImageFont.load_default()

# linee verticali ogni 25 vb, evidenziate ogni 100
for vx in range(0, VB_W + 1, 25):
    px = vx * sx
    bold = vx % 100 == 0
    draw.line([(px, 0), (px, H)], fill=(255, 80, 80) if bold else (255, 180, 0),
              width=2 if bold else 1)
    if vx % 50 == 0:
        draw.text((px + 2, 4), str(vx), fill=(255, 255, 0), font=font)
        draw.text((px + 2, H - 22), str(vx), fill=(255, 255, 0), font=font)
# linee orizzontali ogni 25 vb, evidenziate ogni 100
for vy in range(0, VB_H + 1, 25):
    py = vy * sy
    bold = vy % 100 == 0
    draw.line([(0, py), (W, py)], fill=(255, 80, 80) if bold else (255, 180, 0),
              width=2 if bold else 1)
    if vy % 50 == 0:
        draw.text((4, py + 2), str(vy), fill=(0, 255, 255), font=font)

img.save("/tmp/grid.png")
print(f"wrote /tmp/grid.png ({W}x{H})")
