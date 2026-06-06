#!/usr/bin/env python3
"""Disegna i pin di One Piece sulla mappa di riferimento per verificarne le coordinate.

Uso:
    tsx --tsconfig scripts/tsconfig.json scripts/onepiece-pins.ts > /tmp/op-pins.json
    python3 scripts/onepiece-overlay.py /tmp/op-pins.json \
        public/assets/worlds/onepiece/maps/onepiece-world-map.jpeg /tmp/op-overlay.png

I pin sono espressi nel piano viewBox (di default 2000x1000) e vengono riscalati
sulle dimensioni reali dell'immagine. Colori per importanza: main=rosso,
secondary=arancio, minor=giallo.
"""
import json
import sys
from PIL import Image, ImageDraw, ImageFont

pins_path = sys.argv[1] if len(sys.argv) > 1 else "/tmp/op-pins.json"
img_path = sys.argv[2] if len(sys.argv) > 2 else "public/assets/worlds/onepiece/maps/onepiece-world-map.jpeg"
out_path = sys.argv[3] if len(sys.argv) > 3 else "/tmp/op-overlay.png"

data = json.load(open(pins_path))
vb = data["viewBox"]
pins = data["pins"]

img = Image.open(img_path).convert("RGB")
W, H = img.size
sx = W / vb["width"]
sy = H / vb["height"]

draw = ImageDraw.Draw(img)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
except Exception:
    font = ImageFont.load_default()

COLORS = {"main": (231, 11, 11), "secondary": (245, 130, 26), "minor": (245, 210, 26)}
R = 9


def hex_to_rgb(h):
    h = h.lstrip("#")
    if len(h) != 6:
        return (255, 255, 255)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


# Rotte: polilinee sotto i pin
for r in data.get("routes", []):
    col = hex_to_rgb(r.get("color", "#ffffff"))
    pts = [(p["x"] * sx, p["y"] * sy) for p in r.get("points", [])]
    if len(pts) >= 2:
        draw.line(pts, fill=col, width=5, joint="curve")
        for (cx, cy) in pts:
            draw.ellipse([cx - 5, cy - 5, cx + 5, cy + 5], outline=col, width=3)

for p in pins:
    px = p["x"] * sx
    py = p["y"] * sy
    col = COLORS.get(p.get("importance"), (255, 255, 255))
    draw.ellipse([px - R, py - R, px + R, py + R], fill=col, outline=(0, 0, 0), width=2)
    label = p["name"]
    tb = draw.textbbox((0, 0), label, font=font)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    lx, ly = px + R + 3, py - th / 2
    draw.rectangle([lx - 2, ly - 2, lx + tw + 2, ly + th + 4], fill=(0, 0, 0))
    draw.text((lx, ly), label, fill=col, font=font)

img.save(out_path)
print(f"wrote {out_path}  ({W}x{H}, {len(pins)} pins)")
