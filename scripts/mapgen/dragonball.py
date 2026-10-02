#!/usr/bin/env python3
"""Sotto-mappe ORIGINALI di Dragon Ball: Universo, pianeta Namecc, Spazio (GT).

Schemi AniMapVerse disegnati da zero (nessun artwork ufficiale):
  * Universo — le quattro Galassie dei Kaioh, la Terra, Namecc, il pianeta Vegeta,
    l'Aldilà (Via del Serpente, pianeta di Re Kaioh, Re Yama), il Mondo dei Kaioshin,
    il pianeta di Beerus, l'arena del Torneo del Potere nel Mondo del Nulla, l'Inferno (GT).
  * Namecc — mare verde-azzurro, isolotti con alberi Ajisa a palla, il villaggio di Moori,
    la casa del Grande Anziano su un pinnacolo, l'astronave di Freezer, il campo di
    battaglia finale tra lava e crepe (il pianeta sta esplodendo).
  * Spazio GT — la rotta della navicella dalla Terra ai pianeti visitati in cerca delle
    Sfere dai Sette Stelle.

    python3 scripts/mapgen/dragonball.py  → public/assets/worlds/dragonball/maps/*.svg + pin
"""
from __future__ import annotations

import math
import random
import sys

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from kit import (SERIF, DISPLAY, Svg, apply_pins, both, compass, dots, ellipse_pts, f, far_from, island,
                 jagged, mountain, out_path, patch, path_line, pip, plaque, poly, preview, region_label,
                 ribbon, river, scale_pts, scatter, sea, shade, smooth, text, tower, trees, wood)

INK = "#1d1a2a"
CREDIT = "Ricostruzione originale AniMapVerse · CC0 · non è materiale ufficiale di Dragon Ball"


def save(svg: Svg, name: str, pins: dict) -> None:
    svg.save(out_path("dragonball", name))
    preview(svg.path, pins, svg.w, svg.h)


def head(svg, name, sub, x, y, w=360, size=32):
    svg.add(ribbon(x, y, w, name, size=size, fill="#ffd23a", stroke="#a8541a", ink="#7a2a0a", sub=sub, family=DISPLAY))


def planet(x, y, r, base, dark, light=None, ring: str | None = None, stroke=INK, gid=None, svg=None) -> list[str]:
    out = []
    if ring:
        out.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(r * 1.8)}" ry="{f(r * 0.45)}" fill="none" stroke="{ring}" stroke-width="{f(r * 0.12)}" opacity="0.8"/>')
    fill = base
    if svg is not None and gid:
        fill = svg.gradient(gid, [(0, light or shade(base, 0.35)), (0.6, base), (1, dark)], "radial", 'cx="38%" cy="35%" r="70%"')
    out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{fill}" stroke="{stroke}" stroke-width="2.4"/>')
    if ring:
        out.append(f'<path d="M{f(x - r * 1.8)},{f(y)} A{f(r * 1.8)},{f(r * 0.45)} 0 0,0 {f(x + r * 1.8)},{f(y)}" fill="none" stroke="{ring}" stroke-width="{f(r * 0.12)}" opacity="0.9"/>')
    return out


def starfield(svg, rng, n=600):
    svg.add(dots(rng, (0, 0, svg.w, svg.h), n, "#ffffff", (0.5, 1.7), None, (0.3, 0.95)))
    for _ in range(12):
        x, y = rng.uniform(0, svg.w), rng.uniform(0, svg.h)
        svg.add(f'<path d="M{f(x)},{f(y - 6)} L{f(x + 1.5)},{f(y - 1.5)} L{f(x + 6)},{f(y)} L{f(x + 1.5)},{f(y + 1.5)} L{f(x)},{f(y + 6)} L{f(x - 1.5)},{f(y + 1.5)} L{f(x - 6)},{f(y)} L{f(x - 1.5)},{f(y - 1.5)} Z" fill="#ffffff" opacity="0.8"/>')


def nebula(svg, x, y, rx, ry, color, gid):
    g = svg.gradient(gid, [(0, color, 0.55), (1, color, 0)], "radial", 'cx="50%" cy="50%" r="50%"')
    svg.add(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(rx)}" ry="{f(ry)}" fill="{g}"/>')


# =============================================================================
# UNIVERSO — 1400 × 900
# =============================================================================
def cosmic() -> dict:
    W, H = 1400, 900
    rng = random.Random(501)
    svg = Svg(W, H, "Dragon Ball · Universo / Universe", CREDIT)
    P = {
        "loc-dbz-earth-gate": (520, 470),
        "loc-dbz-namek-planet": (290, 250),
        "loc-dbz-vegeta-planet": (250, 660),
        "loc-dbz-other-world": (960, 400),
        "loc-dbz-sacred-world-kais": (830, 680),
        "loc-dbz-beerus-planet": (1170, 170),
        "loc-dbz-gt-hell": (1210, 560),
        "loc-dbz-tournament-arena": (1170, 760),
    }
    svg.add(f'<rect width="{W}" height="{H}" fill="#0b0e24"/>')
    nebula(svg, 300, 260, 320, 220, "#2a8a6a", "n1")
    nebula(svg, 260, 680, 300, 200, "#a83a2a", "n2")
    nebula(svg, 1000, 430, 420, 300, "#e8c86a", "n3")
    nebula(svg, 1180, 160, 260, 160, "#8a4ac8", "n4")
    starfield(svg, rng, 700)
    # le 4 Galassie (croce dei Kaioh) nel nostro universo
    svg.add(f'<path d="M640,40 V860 M40,450 H760" stroke="#ffffff" stroke-width="1.4" stroke-dasharray="4 10" opacity="0.35"/>')
    for (x, y, lab) in ((780, 30, "Galassia del Nord · North Galaxy"), (330, 840, "Galassia del Sud · South Galaxy"),
                        (120, 470, "Ovest · West"), (700, 470, "Est · East")):
        svg.add(text(x, y, lab, size=15, fill="#cfe0ff", italic=True, opacity=0.8))
    # Terra
    svg.add(planet(520, 470, 52, "#2a7ad8", "#123a7a", svg=svg, gid="earth"))
    for (dx, dy, rx, ry) in ((-18, -14, 20, 12), (16, 10, 16, 10), (-6, 22, 10, 6)):
        svg.add(f'<ellipse cx="{520 + dx}" cy="{470 + dy}" rx="{rx}" ry="{ry}" fill="#5ab04a" opacity="0.9"/>')
    # Namecc (verde, tre soli)
    svg.add(planet(290, 250, 50, "#5ac88a", "#1a6a4a", svg=svg, gid="namek"))
    for (dx, dy) in ((-90, -80), (-60, -110), (-120, -50)):
        svg.add(f'<circle cx="{290 + dx}" cy="{250 + dy}" r="9" fill="#fff6a8" opacity="0.9"/>')
    # pianeta Vegeta (rosso)
    svg.add(planet(250, 660, 60, "#d84a2a", "#6a1a10", svg=svg, gid="veg"))
    svg.add(f'<path d="M210,640 q40,-20 80,6 M220,690 q30,10 60,-6" fill="none" stroke="#7a1a10" stroke-width="3" opacity="0.6"/>')
    # Aldilà: nuvole gialle, Via del Serpente, pianetino di Re Kaioh, palazzo di Re Yama
    svg.add(f'<ellipse cx="960" cy="420" rx="220" ry="110" fill="#ffe6a0" opacity="0.85" stroke="#e8a83a" stroke-width="2"/>')
    for (dx, dy, r) in ((-150, -30, 50), (-80, -70, 60), (20, -80, 66), (110, -60, 56), (170, -10, 48), (120, 50, 50), (0, 60, 60), (-120, 50, 50)):
        svg.add(f'<circle cx="{960 + dx}" cy="{420 + dy}" r="{r}" fill="#fff0bc" opacity="0.7"/>')
    snake = [(860, 400), (880, 360), (920, 380), (950, 340), (990, 370), (1020, 330), (1060, 360), (1100, 320), (1130, 300)]
    svg.add(f'<path d="{smooth(snake, closed=False)}" fill="none" stroke="#c9a83a" stroke-width="10" stroke-linecap="round"/>')
    svg.add(f'<path d="{smooth(snake, closed=False)}" fill="none" stroke="#f6d86a" stroke-width="6" stroke-linecap="round"/>')
    svg.add(f'<circle cx="1130" cy="296" r="6" fill="#2a1a10"/>')  # testa del serpente
    svg.add(planet(1150, 260, 22, "#7ac04a", "#3a6a1a"))
    svg.add(f'<path d="M1142,240 h16 v-8 a8,8 0 0,0 -16,0 Z" fill="#f4f1ea" stroke="{INK}" stroke-width="1"/>')
    svg.add(f'<rect x="820" y="408" width="56" height="36" fill="#e8642a" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<path d="M814,408 L848,384 L882,408 Z" fill="#c0392b" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(text(960, 520, "Aldilà · Other World", size=16, fill="#7a4a0a", weight="bold", halo="#fff0bc", halo_w=3))
    # Inferno (GT)
    svg.add(f'<ellipse cx="1210" cy="580" rx="110" ry="54" fill="#5a0a14" stroke="#ff6a2a" stroke-width="2"/>')
    for k in range(7):
        x = 1130 + k * 26
        svg.add(f'<path d="M{x},{600} q8,-30 16,0 q-8,-14 -16,0 Z" fill="#ff8a2a"/>')
    # Mondo dei Kaioshin: pianeta-prato con l'albero
    svg.add(planet(830, 680, 54, "#7ad07a", "#2a6a3a", svg=svg, gid="kai"))
    svg.add(f'<path d="M830,640 v-20" stroke="#6a4a2a" stroke-width="4"/><circle cx="830" cy="614" r="12" fill="#3a8a3a" stroke="{INK}" stroke-width="1"/>')
    # pianeta di Beerus: forma irregolare con piramide e albero
    bp = jagged(ellipse_pts(1170, 170, 74, 50, 12), rng, 0.12, 2)
    svg.add(patch(bp, "#a86ad8", stroke=INK, sw=2.4))
    svg.add(f'<path d="M1150,150 L1170,110 L1190,150 Z" fill="#e8c86a" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<path d="M1210,150 v-36" stroke="#6a4a2a" stroke-width="5"/><circle cx="1210" cy="106" r="16" fill="#e8642a" stroke="{INK}" stroke-width="1.2"/>')
    # Mondo del Nulla con l'arena del Torneo del Potere
    svg.add(f'<rect x="1040" y="700" width="260" height="140" rx="12" fill="#f4f6fa" opacity="0.15" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="6 6"/>')
    svg.add(f'<path d="M1110,770 h120 l20,24 h-160 Z" fill="#c9ccd8" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M1110,770 l14,-24 h92 l14,24" fill="#e6e8f0" stroke="{INK}" stroke-width="2"/>')
    for k in range(4):
        svg.add(f'<path d="M{1130 + k * 26},752 v-30" stroke="#c9ccd8" stroke-width="3"/>')
    svg.add(text(1170, 830, "Mondo del Nulla · World of Void", size=13, fill="#e6e8f0", italic=True))
    # sfere del drago sparse
    for (x, y) in ((470, 380), (600, 560), (720, 300)):
        svg.add(f'<circle cx="{x}" cy="{y}" r="7" fill="#ffa82a" stroke="#c0601a" stroke-width="1.4"/>')
        svg.add(f'<circle cx="{x}" cy="{y}" r="2" fill="#d83a1a"/>')
    head(svg, "Universo 7", "Universe 7 · Dragon Ball", x=240, y=60, w=340, size=32)
    svg.add(compass(1340, 860, 30, "#cfe0ff", "#0b0e24", "#ffa82a"))
    save(svg, "dragonball-cosmic.svg", P)
    return P


# =============================================================================
# NAMECC — 1300 × 850
# =============================================================================
def namek() -> dict:
    W, H = 1300, 850
    rng = random.Random(502)
    svg = Svg(W, H, "Planet Namek · Namecc / ナメック星", CREDIT)
    P = {
        "loc-dbz-namek-moori-village": (300, 210),
        "loc-dbz-namek-guru-house": (650, 140),
        "loc-dbz-namek-frieza-ship": (800, 300),
        "loc-dbz-namek-vegeta-landing": (980, 260),
        "loc-dbz-namek-battlefield-plains": (560, 480),
        "loc-dbz-namek-porunga-site": (340, 560),
        "loc-dbz-namek-final-battlefield": (900, 640),
        "loc-dbz-namek-cosmic-gate": (110, 780),
    }
    pins = list(P.values())
    lands = [
        jagged(ellipse_pts(300, 230, 150, 90, 14), rng, 0.12, 3),
        jagged(ellipse_pts(640, 210, 120, 90, 14), rng, 0.12, 3),
        jagged(ellipse_pts(920, 300, 200, 110, 14), rng, 0.12, 3),
        jagged(ellipse_pts(480, 520, 240, 120, 14), rng, 0.12, 3),
        jagged(ellipse_pts(900, 650, 200, 110, 14), rng, 0.12, 3),
        jagged(ellipse_pts(120, 470, 80, 50, 12), rng, 0.12, 2),
        jagged(ellipse_pts(1180, 520, 80, 60, 12), rng, 0.12, 2),
        jagged(ellipse_pts(120, 780, 70, 40, 12), rng, 0.12, 2),
    ]
    sea(svg, "#5ad0b8", "#2a9a8a", "#d8fff4", rng, lands, n=200, wave_w=14, opacity=0.5)
    for pts in lands:
        island(svg, pts, "#a8d86a", stroke=INK, shallow="#8ae8d0", beach="#d8e8a0", shallow_w=24, beach_w=8, stroke_w=2.6)
    # alberi Ajisa: tronco sottile e chioma a palla azzurra
    for pts in lands:
        for x, y in scatter(rng, 14, (min(p[0] for p in pts), min(p[1] for p in pts), max(p[0] for p in pts), max(p[1] for p in pts)),
                            both(lambda x, y, pts=pts: pip(x, y, scale_pts(pts, 0.85)), far_from(pins, 36)), mind=30):
            svg.add(f'<path d="M{f(x)},{f(y)} v-18" stroke="#6a8a4a" stroke-width="2"/>')
            svg.add(f'<circle cx="{f(x)}" cy="{f(y - 22)}" r="8" fill="#5ab0e8" stroke="{INK}" stroke-width="1"/>')
            svg.add(f'<circle cx="{f(x - 3)}" cy="{f(y - 25)}" r="3" fill="#bfe8ff"/>')
    # case-cupola dei Namecciani
    def nhouse(x, y, r=14):
        return [f'<path d="M{f(x - r)},{f(y)} a{f(r)},{f(r * 1.1)} 0 0,1 {f(2 * r)},0 Z" fill="#f4f1ea" stroke="{INK}" stroke-width="1.4"/>',
                f'<circle cx="{f(x - r * 0.35)}" cy="{f(y - r * 0.5)}" r="{f(r * 0.18)}" fill="#3a5a8a"/>',
                f'<circle cx="{f(x + r * 0.35)}" cy="{f(y - r * 0.5)}" r="{f(r * 0.18)}" fill="#3a5a8a"/>']
    for (x, y) in ((270, 230), (310, 200), (340, 240), (250, 196)):
        svg.add(nhouse(x, y))
    # pinnacolo con la casa del Grande Anziano Guru
    svg.add(f'<path d="M610,250 L626,150 L674,150 L690,250 Z" fill="#9aa86a" stroke="{INK}" stroke-width="2"/>')
    svg.add(nhouse(650, 150, 26))
    # astronave di Freezer
    svg.add(f'<ellipse cx="800" cy="306" rx="56" ry="20" fill="#d8dce4" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M752,300 a48,30 0 0,1 96,0 Z" fill="#e6e8f0" stroke="{INK}" stroke-width="2"/>')
    for k in range(5):
        svg.add(f'<circle cx="{768 + k * 16}" cy="292" r="3" fill="#ffd23a"/>')
    for dx in (-36, 0, 36):
        svg.add(f'<path d="M{800 + dx},{324} l-6,14 M{800 + dx},{324} l6,14" stroke="{INK}" stroke-width="2"/>')
    # capsule di Vegeta (crateri d'atterraggio)
    for (x, y) in ((970, 270), (1000, 250)):
        svg.add(f'<ellipse cx="{x}" cy="{y + 6}" rx="16" ry="6" fill="#6a7a4a"/>')
        svg.add(f'<circle cx="{x}" cy="{y}" r="8" fill="#f4f1ea" stroke="{INK}" stroke-width="1.2"/>')
    # sito di evocazione di Porunga + le 7 sfere
    svg.add(f'<circle cx="340" cy="560" r="26" fill="none" stroke="#ffd23a" stroke-width="3" stroke-dasharray="4 4"/>')
    for k in range(7):
        a = k * 2 * math.pi / 7
        svg.add(f'<circle cx="{f(340 + 18 * math.cos(a))}" cy="{f(560 + 18 * math.sin(a))}" r="5" fill="#ffa82a" stroke="#c0601a" stroke-width="1"/>')
    # campo di battaglia finale: lava e crepe
    for k in range(9):
        x0, y0 = 900 + rng.uniform(-150, 150), 650 + rng.uniform(-70, 70)
        pts = [(x0, y0)]
        for _ in range(4):
            pts.append((pts[-1][0] + rng.uniform(-30, 30), pts[-1][1] + rng.uniform(-20, 20)))
        svg.add(f'<path d="{poly(pts, closed=False)}" fill="none" stroke="#ff6a2a" stroke-width="3"/>')
    for (x, y) in ((820, 620), (980, 690), (880, 700)):
        svg.add(f'<ellipse cx="{x}" cy="{y}" rx="34" ry="12" fill="#ff8a2a" stroke="#ffd23a" stroke-width="1.6"/>')
    # cielo verde con i tre soli (angolo)
    for (x, y) in ((1180, 90), (1230, 60), (1250, 120)):
        svg.add(f'<circle cx="{x}" cy="{y}" r="16" fill="#fff6a8" stroke="#ffd23a" stroke-width="2"/>')
    svg.add(text(110, 730, "→ Universo", size=13, fill="#0a3a2a", italic=True, halo="#d8fff4", halo_w=3))
    head(svg, "Namecc", "Planet Namek · ナメック星", x=600, y=790, w=320, size=32)
    svg.add(compass(1240, 780, 32, INK, "#e8fff6", "#ffa82a"))
    save(svg, "dragonball-namek.svg", P)
    return P


# =============================================================================
# SPAZIO GT — 1600 × 1000
# =============================================================================
def gt_space() -> dict:
    W, H = 1600, 1000
    rng = random.Random(503)
    svg = Svg(W, H, "Dragon Ball GT · Space / Spazio", CREDIT)
    P = {
        "loc-dbz-gt-earth-gate": (230, 540),
        "loc-dbz-gt-imecka": (430, 360),
        "loc-dbz-gt-beehay": (640, 300),
        "loc-dbz-gt-gelbo": (850, 285),
        "loc-dbz-gt-m2": (1030, 330),
        "loc-dbz-gt-pital": (1210, 470),
        "loc-dbz-gt-new-plant": (1230, 720),
    }
    svg.add(f'<rect width="{W}" height="{H}" fill="#0a0c1e"/>')
    nebula(svg, 500, 300, 420, 240, "#3a5ac8", "g1")
    nebula(svg, 1200, 620, 420, 280, "#c83a8a", "g2")
    starfield(svg, rng, 800)
    route = [P[k] for k in ("loc-dbz-gt-earth-gate", "loc-dbz-gt-imecka", "loc-dbz-gt-beehay", "loc-dbz-gt-gelbo",
                            "loc-dbz-gt-m2", "loc-dbz-gt-pital", "loc-dbz-gt-new-plant")]
    svg.add(path_line(route, "#ffd23a", 3, "10 8", 0.75))
    svg.add(planet(230, 540, 70, "#2a7ad8", "#123a7a", svg=svg, gid="e"))
    for (dx, dy, rx, ry) in ((-24, -18, 26, 14), (20, 14, 20, 12)):
        svg.add(f'<ellipse cx="{230 + dx}" cy="{540 + dy}" rx="{rx}" ry="{ry}" fill="#5ab04a" opacity="0.9"/>')
    svg.add(planet(430, 360, 44, "#d8b46a", "#7a5a2a", svg=svg, gid="im"))          # Imecka (desertico)
    svg.add(planet(640, 300, 40, "#e8a8d0", "#8a3a6a", svg=svg, gid="bh", ring="#f6d6ea"))
    svg.add(planet(850, 285, 40, "#9a6ac8", "#3a1a6a", svg=svg, gid="gb"))          # Gelbo (setta di Luud)
    svg.add(planet(1030, 330, 48, "#a8b0c0", "#4a5060", svg=svg, gid="m2"))         # M-2 (pianeta macchina)
    for k in range(6):
        a = k * math.pi / 3
        svg.add(f'<path d="M{f(1030 + 48 * math.cos(a))},{f(330 + 48 * math.sin(a))} l{f(10 * math.cos(a))},{f(10 * math.sin(a))}" stroke="#d8dce4" stroke-width="5"/>')
    svg.add(f'<path d="M1000,320 h60 M1030,300 v60" stroke="#6a7080" stroke-width="3"/>')
    svg.add(planet(1210, 470, 44, "#6ad09a", "#1a6a4a", svg=svg, gid="pt"))       # Pital
    svg.add(planet(1230, 720, 62, "#c8643a", "#5a1a10", svg=svg, gid="np"))       # Nuovo pianeta Plant
    svg.add(f'<path d="M1190,700 q40,-20 80,4 M1200,740 q30,10 60,-6" fill="none" stroke="#5a1a10" stroke-width="3" opacity="0.6"/>')
    # la navicella Capsule Corp.
    svg.add(f'<ellipse cx="330" cy="460" rx="26" ry="12" fill="#f4f1ea" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<path d="M310,456 a20,12 0 0,1 40,0 Z" fill="#8ac8f0" stroke="{INK}" stroke-width="1.2"/>')
    svg.add(f'<path d="M304,462 l-24,8" stroke="#ffa82a" stroke-width="4"/>')
    for (x, y) in ((560, 420), (930, 420), (1130, 600)):
        svg.add(f'<circle cx="{x}" cy="{y}" r="8" fill="#ff8a2a" stroke="#a8341a" stroke-width="1.4"/>')
        svg.add(f'<circle cx="{x}" cy="{y}" r="2.4" fill="#5a0a0a"/>')
    svg.add(text(800, 900, "Rotta delle Sfere dai Sette Stelle · Black Star Dragon Ball route", size=17, fill="#ffd23a", italic=True))
    head(svg, "Spazio · GT", "Space · Dragon Ball GT", x=260, y=70, w=340, size=32)
    svg.add(compass(1530, 920, 32, "#cfe0ff", "#0a0c1e", "#ffa82a"))
    save(svg, "dragonball-gt-space.svg", P)
    return P


ALL = [cosmic, namek, gt_space]

if __name__ == "__main__":
    pins: dict = {}
    for fn in ALL:
        pins.update(fn())
    apply_pins("dragonball", pins)
