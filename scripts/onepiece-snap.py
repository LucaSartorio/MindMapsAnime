#!/usr/bin/env python3
"""Aggancia ogni pin al centro del disegno dell'isola più vicina (snap-to-land).

Per ogni location del world map calcola, in una finestra attorno alla sua
posizione attuale, il baricentro della massa di "terra" (pixel non-mare,
non-Red Line) e propone quella coordinata. Output: JSON id -> [x, y].

    tsx ... scripts/onepiece-pins.ts > /tmp/op-pins.json
    python3 scripts/onepiece-snap.py /tmp/op-pins.json public/.../onepiece-world-map.jpeg
"""
import json, sys
import numpy as np
from PIL import Image

pins_path = sys.argv[1]
img_path = sys.argv[2]
data = json.load(open(pins_path))
vb = data["viewBox"]
W = vb["width"]; H = vb["height"]
img = Image.open(img_path).convert("RGB")
PW, PH = img.size
arr = np.asarray(img).astype(int)
R = arr[:, :, 0]; G = arr[:, :, 1]; B = arr[:, :, 2]
# Mask "terra": più verde/sabbia che blu, escludendo la Red Line (rosso dominante)
land = ((R + G) / 2 > B + 10) & ~((R > G + 28) & (B < 130))
sx = PW / W; sy = PH / H
win = int(48 * sx)  # finestra di ricerca ~48 vb

out = {}
for p in data["pins"]:
    cx = int(p["x"] * sx); cy = int(p["y"] * sy)
    x0, x1 = max(0, cx - win), min(PW, cx + win)
    y0, y1 = max(0, cy - win), min(PH, cy + win)
    sub = land[y0:y1, x0:x1]
    ys, xs = np.nonzero(sub)
    if len(xs) < 30:
        out[p["id"]] = [p["x"], p["y"]]  # nessuna terra vicina: invariato
        continue
    # pesa per vicinanza al centro attuale (isola dominante più vicina)
    gx = xs + x0; gy = ys + y0
    d2 = (gx - cx) ** 2 + (gy - cy) ** 2
    w = np.exp(-d2 / (2 * (win * 0.55) ** 2))
    mx = np.sum(gx * w) / np.sum(w); my = np.sum(gy * w) / np.sum(w)
    out[p["id"]] = [round(mx / sx, 1), round(my / sy, 1)]

# stampa diff ordinato per spostamento (per controllo)
moves = []
for p in data["pins"]:
    nx, ny = out[p["id"]]
    dist = ((nx - p["x"]) ** 2 + (ny - p["y"]) ** 2) ** 0.5
    moves.append((dist, p["id"], p["x"], p["y"], nx, ny))
moves.sort(reverse=True)
for d, i, ox, oy, nx, ny in moves:
    print(f"{d:6.1f}  {i:34s} ({ox},{oy}) -> ({nx},{ny})")
json.dump(out, open("/tmp/snap.json", "w"))
print(f"\nwrote /tmp/snap.json ({len(out)} pins)")
