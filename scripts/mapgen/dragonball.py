#!/usr/bin/env python3
"""Sotto-mappe ORIGINALI di Dragon Ball: Universo, Namecc, Spazio (GT), Aldilà, Santuario di Dio,
isola di Papaya, Città dell'Ovest.

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
from kit import (SERIF, DISPLAY, Svg, apply_pins, arena, both, compass, dome, dots, ellipse_pts, f, far_from, island,
                 jagged, mountain, out_path, patch, path_line, pip, plaque, poly, preview, region_label,
                 ribbon, river, road, scale_pts, scatter, sea, shade, ship, smooth, text, town, tower, trees, wood)

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
        "loc-dbz-tournament-arena": (1170, 760),
        "loc-dbz-yardrat": (540, 130),
        "loc-dbz-new-namek": (110, 340),
        "loc-dbz-planet-vampa": (110, 560),
        "loc-dbz-planet-cereal": (520, 800),
        "loc-dbz-nameless-planet": (1000, 170),
        "loc-dbz-galactic-prison": (720, 120),
        "loc-dbz-demon-realm": (1240, 560),
        "loc-dbz-future-earth": (390, 470),
        "loc-dbz-zeno-palace": (880, 60),
        "loc-dbz-sadala": (1320, 360),
        "loc-dbz-u10-sacred-world": (690, 830),
    }
    svg.add(f'<rect width="{W}" height="{H}" fill="#0b0e24"/>')
    nebula(svg, 300, 260, 320, 220, "#2a8a6a", "n1")
    nebula(svg, 260, 680, 300, 200, "#a83a2a", "n2")
    nebula(svg, 1000, 430, 420, 300, "#e8c86a", "n3")
    nebula(svg, 1180, 160, 260, 160, "#8a4ac8", "n4")
    starfield(svg, rng, 700)
    # le 4 Galassie (croce dei Kaioh) nel nostro universo
    svg.add(f'<path d="M640,40 V860 M40,450 H760" stroke="#ffffff" stroke-width="1.4" stroke-dasharray="4 10" opacity="0.35"/>')
    for (x, y, lab) in ((660, 30, "Galassia del Nord · North Galaxy"), (330, 840, "Galassia del Sud · South Galaxy"),
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
    # Regno dei Demoni (Daima): tre mondi sovrapposti sotto l'Aldilà
    for k, (col, dy) in enumerate((("#3a0a3a", 40), ("#5a1a4a", 0), ("#7a2a5a", -40))):
        svg.add(f'<ellipse cx="1240" cy="{580 + dy}" rx="{110 - k * 14}" ry="22" fill="{col}" stroke="#d86ad8" stroke-width="1.6"/>')
    svg.add(text(1240, 650, "Regno dei Demoni · Demon Realm", size=13, fill="#f0c8f0", italic=True))
    # nuovi pianeti: Yardrat, Nuovo Namecc, Vampa, Cereal, il pianeta senza nome, la Prigione Galattica
    svg.add(planet(540, 130, 34, "#e8d86a", "#8a7a1a", svg=svg, gid="yard"))
    for (dx, dy) in ((-14, -6), (8, 10), (12, -12)):
        svg.add(f'<circle cx="{540 + dx}" cy="{130 + dy}" r="5" fill="#c8b43a" opacity="0.8"/>')
    svg.add(planet(110, 340, 38, "#7ad8a8", "#1a7a5a", svg=svg, gid="nnamek"))
    svg.add(planet(110, 560, 42, "#b49a6a", "#5a4a2a", svg=svg, gid="vampa"))
    svg.add(f'<path d="M84,548 l10,-14 l8,12 M112,572 l10,-16 l10,14" fill="none" stroke="#5a4a2a" stroke-width="2"/>')
    svg.add(planet(520, 800, 40, "#c8e8f8", "#4a7aa8", svg=svg, gid="cereal"))
    svg.add(f'<circle cx="520" cy="800" r="12" fill="none" stroke="#2a5a8a" stroke-width="2"/>')
    svg.add(planet(1000, 170, 30, "#c8b8a0", "#6a5a4a", svg=svg, gid="nameless"))
    svg.add(f'<rect x="988" y="158" width="24" height="10" fill="#f4f1ea" stroke="{INK}" stroke-width="1"/>')
    svg.add(planet(720, 120, 30, "#8a94a8", "#3a4458", svg=svg, gid="prison"))
    for k in range(5):
        svg.add(f'<path d="M{708 + k * 6},{100} v40" stroke="#d8dce4" stroke-width="1.6"/>')
    # Terra del futuro (linea temporale di Trunks): pianeta fantasma
    svg.add(f'<circle cx="390" cy="470" r="34" fill="#4a5a6a" stroke="#cfe0ff" stroke-width="1.6" stroke-dasharray="5 4" opacity="0.85"/>')
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
    # Palazzo di Zeno, sopra gli universi; Sadal (Universo 6); il pianeta dei Kaiohshin dell'Universo 10
    svg.add(f'<ellipse cx="880" cy="66" rx="70" ry="16" fill="#f4f1ea" opacity="0.25" stroke="#cfe0ff" stroke-width="1.2"/>')
    svg.add(f'<path d="M846,64 h68 v-16 h-10 v-12 h-14 v-10 h-20 v10 h-14 v12 h-10 Z" fill="#e8ecf6" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<circle cx="880" cy="22" r="6" fill="#ffd86a" stroke="{INK}" stroke-width="1"/>')
    svg.add(planet(1320, 360, 30, "#c86a3a", "#6a2a10", svg=svg, gid="sadala"))
    svg.add(text(1320, 410, "Universo 6", size=11, fill="#cfe0ff", italic=True))
    svg.add(planet(690, 830, 30, "#8ad08a", "#2a6a3a", svg=svg, gid="kai10"))
    svg.add(f'<path d="M690,804 v-14" stroke="#6a4a2a" stroke-width="3"/><circle cx="690" cy="786" r="8" fill="#3a8a3a" stroke="{INK}" stroke-width="1"/>')
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


# =============================================================================
# ALDILÀ — 1600 × 1000
# =============================================================================
def other_world() -> dict:
    W, H = 1600, 1000
    rng = random.Random(504)
    svg = Svg(W, H, "Dragon Ball · Aldilà / Other World / あの世", CREDIT)
    P = {
        "loc-dbz-ow-yemma": (300, 520),
        "loc-dbz-ow-snake-way": (880, 410),
        "loc-dbz-ow-princess-snake": (760, 630),
        "loc-dbz-kaio-planet": (1380, 210),
        "loc-dbz-ow-grand-kai": (1250, 790),
        "loc-dbz-gt-hell": (420, 890),
        "loc-dbz-ow-cosmic-gate": (90, 930),
    }
    sky = svg.gradient("owsky", [(0, "#ffe9a8"), (0.7, "#f6c86a"), (1, "#d8903a")])
    svg.add(f'<rect width="{W}" height="{H}" fill="{sky}"/>')
    # mare di nuvole gialle
    for _ in range(140):
        x, y, r = rng.uniform(0, W), rng.uniform(80, 760), rng.uniform(30, 80)
        svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="#fff3c4" opacity="{f(rng.uniform(0.25, 0.6))}"/>')
    # Inferno: sotto le nuvole, rosso con picchi aguzzi e il lago di sangue
    hell = [(0, 790), (220, 770), (480, 800), (760, 780), (900, 820), (900, 1000), (0, 1000)]
    svg.add(f'<path d="{smooth(hell)}" fill="#7a1420" stroke="#3a0a10" stroke-width="2"/>')
    for k in range(14):
        x = 30 + k * 62
        svg.add(f'<path d="M{x},{960} l18,-70 l18,70 Z" fill="#a8242a" stroke="#3a0a10" stroke-width="1.4"/>')
    svg.add(f'<ellipse cx="640" cy="905" rx="110" ry="34" fill="#c0102a" stroke="#ff6a2a" stroke-width="2"/>')
    svg.add(text(640, 960, "Lago di sangue · Blood Pool", size=13, fill="#ffd8c8", italic=True))
    svg.add(text(240, 985, "INFERNO · HELL", size=18, fill="#ffd8c8", weight="bold", spacing=3))
    # Paradiso: prato fiorito in alto a sinistra
    svg.add(f'<ellipse cx="190" cy="190" rx="160" ry="70" fill="#a8e08a" stroke="{INK}" stroke-width="1.6"/>')
    for x, y in scatter(rng, 40, (50, 140, 330, 240), lambda x, y: ((x - 190) / 150) ** 2 + ((y - 190) / 62) ** 2 < 1, mind=12):
        svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="3.4" fill="{rng.choice(("#ff8ac8", "#ffffff", "#ffe36a"))}"/>')
    svg.add(text(190, 285, "Paradiso · Heaven", size=15, fill=INK, italic=True, halo="#fff3c4", halo_w=3))
    # palazzo di Re Yama: grande edificio rosso con la fila di anime
    svg.add(f'<rect x="210" y="430" width="180" height="110" fill="#d8442a" stroke="{INK}" stroke-width="2.4"/>')
    svg.add(f'<path d="M190,430 L300,360 L410,430 Z" fill="#a8241a" stroke="{INK}" stroke-width="2.4"/>')
    svg.add(f'<rect x="270" y="470" width="60" height="70" fill="#5a1a10" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<rect x="282" y="390" width="36" height="22" fill="#ffd23a" stroke="{INK}" stroke-width="1.2"/>')
    for k in range(16):
        x = 60 + k * 9 + rng.uniform(-2, 2)
        y = 600 - k * 4
        svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="7" fill="#ffffff" stroke="#c8b48a" stroke-width="1" opacity="0.9"/>')
    svg.add(text(300, 590, "Re Yama · King Yemma", size=15, fill=INK, weight="bold", halo="#fff3c4", halo_w=3))
    # Via del Serpente: dal palazzo al pianetino di Re Kaioh
    snake = [(390, 470), (470, 420), (540, 470), (620, 400), (700, 460), (780, 390), (860, 440), (930, 370),
             (1010, 420), (1080, 340), (1150, 380), (1220, 300), (1290, 320), (1340, 260)]
    svg.add(f'<path d="{smooth(snake, closed=False)}" fill="none" stroke="#a8781a" stroke-width="22" stroke-linecap="round"/>')
    svg.add(f'<path d="{smooth(snake, closed=False)}" fill="none" stroke="#f6d86a" stroke-width="14" stroke-linecap="round"/>')
    svg.add(f'<path d="{smooth(snake, closed=False)}" fill="none" stroke="#c89a2a" stroke-width="2" stroke-dasharray="8 10"/>')
    svg.add(f'<circle cx="1340" cy="258" r="14" fill="#f6d86a" stroke="#a8781a" stroke-width="3"/>')
    svg.add(f'<circle cx="1345" cy="253" r="3" fill="#2a1a10"/>')
    svg.add(text(860, 360, "Via del Serpente · Snake Way · 1.000.000 km", size=16, fill="#7a4a0a", italic=True, halo="#fff3c4", halo_w=3))
    # palazzo della Principessa Serpente, sotto la Via
    svg.add(f'<rect x="700" y="560" width="120" height="60" fill="#f4a8c8" stroke="{INK}" stroke-width="2"/>')
    for k in range(3):
        svg.add(f'<path d="M{690 + k * 50},560 l25,-34 l25,34 Z" fill="#d84a8a" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<path d="M760,540 q-20,-40 0,-80" fill="none" stroke="#c89a2a" stroke-width="3" stroke-dasharray="4 4"/>')
    # pianeta di Re Kaioh: casetta a cupola, auto, albero
    svg.add(planet(1380, 210, 46, "#7ac04a", "#3a6a1a", svg=svg, gid="kaio"))
    svg.add(f'<path d="M1362,176 a18,16 0 0,1 36,0 Z" fill="#f4f1ea" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<rect x="1392" y="190" width="18" height="8" rx="3" fill="#d83a2a" stroke="{INK}" stroke-width="1"/>')
    svg.add(f'<path d="M1356,196 v-16" stroke="#6a4a2a" stroke-width="3"/><circle cx="1356" cy="176" r="8" fill="#3a8a3a" stroke="{INK}" stroke-width="1"/>')
    svg.add(text(1380, 290, "Pianeta di Re Kaioh · King Kai", size=14, fill=INK, weight="bold", halo="#fff3c4", halo_w=3))
    # pianeta del Gran Kaioh con il palazzo e lo stadio del Torneo dell'Aldilà
    svg.add(planet(1250, 820, 120, "#8ad06a", "#3a7a2a", svg=svg, gid="gkai"))
    svg.add(f'<rect x="1180" y="700" width="90" height="50" fill="#f4f1ea" stroke="{INK}" stroke-width="1.8"/>')
    svg.add(dome(1225, 700, 44, "#ffd23a", INK, 5, 1))
    svg.add(arena(1310, 790, 54, 26, "#e9dcc0", "#c9a874", INK, 2))
    svg.add(text(1250, 965, "Gran Kaioh · Grand Kai · Torneo dell'Aldilà", size=14, fill=INK, weight="bold", halo="#fff3c4", halo_w=3))
    svg.add(text(90, 900, "→ Universo", size=13, fill="#7a4a0a", italic=True, halo="#fff3c4", halo_w=3))
    head(svg, "Aldilà", "Other World · あの世", x=1000, y=80, w=320, size=32)
    svg.add(compass(1540, 60, 30, INK, "#fff3c4", "#d83a1a"))
    save(svg, "dragonball-other-world.svg", P)
    return P


# =============================================================================
# SANTUARIO DI DIO E TORRE DI KARIN — 1100 × 1500
# =============================================================================
def lookout() -> dict:
    W, H = 1100, 1500
    rng = random.Random(505)
    svg = Svg(W, H, "Dragon Ball · Santuario di Dio e Torre di Karin / Kami's Lookout & Korin Tower", CREDIT)
    P = {
        "loc-dbz-lk-palace": (550, 235),
        "loc-dbz-lk-time-chamber": (800, 250),
        "loc-dbz-lk-korin-top": (560, 790),
        "loc-dbz-lk-holy-land": (290, 1340),
        "loc-dbz-lk-return": (110, 1450),
    }
    sky = svg.gradient("lsky", [(0, "#2a4a9a"), (0.35, "#5a9ae0"), (1, "#bfe6ff")])
    svg.add(f'<rect width="{W}" height="{H}" fill="{sky}"/>')
    # banchi di nuvole a più quote
    for yy in (420, 640, 1000):
        for _ in range(26):
            x, r = rng.uniform(-40, W + 40), rng.uniform(30, 70)
            svg.add(f'<circle cx="{f(x)}" cy="{f(yy + rng.uniform(-20, 20))}" r="{f(r)}" fill="#ffffff" opacity="{f(rng.uniform(0.5, 0.85))}"/>')
    # Terra Sacra di Karin: foresta e prateria
    ground = [(0, 1260), (300, 1230), (700, 1250), (1100, 1220), (1100, 1500), (0, 1500)]
    svg.add(f'<path d="{smooth(ground)}" fill="#7ab05a" stroke="{INK}" stroke-width="2"/>')
    svg.add(wood(svg, scatter(rng, 70, (0, 1280, W, 1480), far_from([(290, 1340), (560, 1420), (110, 1450)], 70), mind=22), rng, r=14))
    svg.add(f'<path d="M260,1350 h40 v-24 l-20,-16 l-20,16 Z" fill="#e9dcc0" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<path d="M232,1360 l-6,-70 l6,-10 l6,10 Z" fill="#a8742a" stroke="{INK}" stroke-width="1.2"/>')  # totem di Bora
    svg.add(text(290, 1395, "Terra Sacra di Karin · Holy Land", size=15, fill=INK, weight="bold", halo="#e8f6d8", halo_w=3))
    # Torre di Karin: colonna bianca con fasce rosse che sale fino al cielo
    svg.add(f'<rect x="540" y="830" width="40" height="600" fill="#f4f1ea" stroke="{INK}" stroke-width="2"/>')
    for k in range(12):
        svg.add(f'<rect x="540" y="{850 + k * 48}" width="40" height="8" fill="#c0392b"/>')
    # la sommità di Karin: piattaforma a bulbo
    svg.add(f'<path d="M490,830 h140 q-6,-50 -70,-70 q-64,20 -70,70 Z" fill="#e9dcc0" stroke="{INK}" stroke-width="2.2"/>')
    svg.add(f'<path d="M520,770 h80 l-10,-24 h-60 Z" fill="#c0392b" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(text(700, 800, "Torre di Karin · Korin Tower", size=15, fill=INK, weight="bold", anchor="start", halo="#ffffff", halo_w=3))
    svg.add(text(700, 822, "Fagioli di Balzar · Senzu beans", size=13, fill=INK, italic=True, anchor="start", halo="#ffffff", halo_w=3))
    # il palo sacro (Nyoibo) che collega la Torre al Santuario
    svg.add(f'<path d="M560,746 V320" stroke="#c0392b" stroke-width="5"/>')
    # Santuario di Dio: piattaforma a mezzaluna sospesa
    svg.add(f'<path d="M150,300 h800 q-60,90 -400,110 q-340,-20 -400,-110 Z" fill="#d8ccb0" stroke="{INK}" stroke-width="2.4"/>')
    svg.add(f'<ellipse cx="550" cy="300" rx="400" ry="40" fill="#f4f1ea" stroke="{INK}" stroke-width="2.4"/>')
    for x in (230, 330, 430, 670, 770, 870):
        svg.add(f'<path d="M{x},{300} l-6,-26 h12 Z" fill="#3a8a3a" stroke="{INK}" stroke-width="1"/>')
    svg.add(f'<path d="M500,300 v-60 h100 v60" fill="#f4f1ea" stroke="{INK}" stroke-width="2"/>')
    svg.add(dome(550, 240, 52, "#f4f1ea", INK, 6, 1))
    for (x, h) in ((470, 70), (630, 70)):
        svg.add(tower(x, 300, 22, h, "#f4f1ea", "#f4f1ea", INK, True))
    # Stanza dello Spirito e del Tempo
    svg.add(f'<rect x="770" y="230" width="60" height="50" fill="#f4f1ea" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<rect x="788" y="250" width="24" height="30" fill="#2a2a3a"/>')
    svg.add(text(800, 360, "Stanza dello Spirito e del Tempo", size=14, fill=INK, weight="bold", halo="#ffffff", halo_w=3))
    svg.add(text(800, 378, "Hyperbolic Time Chamber · 1 anno = 1 giorno", size=12, fill=INK, italic=True, halo="#ffffff", halo_w=3))
    svg.add(text(110, 1420, "→ Terra", size=13, fill=INK, italic=True, halo="#e8f6d8", halo_w=3))
    head(svg, "Il Santuario di Dio", "Kami's Lookout · 神殿 · Torre di Karin", x=550, y=80, w=520, size=32)
    svg.add(compass(1040, 1440, 30, INK, "#e8f6d8", "#d83a1a"))
    save(svg, "dragonball-lookout.svg", P)
    return P


# =============================================================================
# ISOLA DI PAPAYA · TORNEO TENKAICHI — 1400 × 1000
# =============================================================================
def papaya() -> dict:
    W, H = 1400, 1000
    rng = random.Random(506)
    svg = Svg(W, H, "Dragon Ball · Isola di Papaya / Papaya Island · 天下一武道会", CREDIT)
    P = {
        "loc-dbz-pp-ring": (700, 360),
        "loc-dbz-pp-prelims": (1010, 330),
        "loc-dbz-pp-gate": (700, 600),
        "loc-dbz-pp-port": (690, 880),
        "loc-dbz-pp-return": (90, 930),
    }
    pins = list(P.values())
    land = jagged(ellipse_pts(700, 470, 560, 380, 22), rng, 0.08, 3)
    sea(svg, "#6ac8e8", "#2a8ac0", "#e8fbff", rng, [land], n=160, wave_w=14, opacity=0.5)
    island(svg, land, "#b8d88a", stroke=INK, shallow="#9ee0f0", beach="#f0e0a8", shallow_w=26, beach_w=14, stroke_w=2.6)
    # strade dalla banchina al torneo
    svg.add(road([(690, 880), (700, 740), (700, 600), (700, 470)], 18, "#e8d7a8", "#8a7550"))
    svg.add(road([(260, 520), (480, 560), (700, 600), (940, 560), (1140, 500)], 12, "#e8d7a8", "#8a7550"))
    # città: case colorate attorno alla strada
    svg.add(town(rng, 420, 650, 200, 120, 46, 18, ("#f4f1ea", "#ffe0b0"), ("#d8442a", "#3a8ac8", "#ffd23a"), far_from(pins, 70)))
    svg.add(town(rng, 1000, 650, 200, 120, 46, 18, ("#f4f1ea", "#ffe0b0"), ("#d8442a", "#3a8ac8", "#ffd23a"), far_from(pins, 70)))
    # palme
    for x, y in scatter(rng, 40, (160, 160, 1240, 820), both(lambda x, y: pip(x, y, scale_pts(land, 0.92)), far_from(pins + [(700, 470)], 120)), mind=40):
        svg.add(f'<path d="M{f(x)},{f(y)} q4,-16 0,-30" fill="none" stroke="#8a6a3a" stroke-width="3"/>')
        for a in (-60, -20, 20, 60):
            svg.add(f'<path d="M{f(x)},{f(y - 30)} q{f(16 * math.sin(math.radians(a)))},{-8} {f(26 * math.sin(math.radians(a)))},{6}" fill="none" stroke="#3a8a3a" stroke-width="4" stroke-linecap="round"/>')
    # recinto del torneo: mura, tribune e ring quadrato
    svg.add(f'<rect x="440" y="200" width="520" height="340" rx="20" fill="#e9dcc0" stroke="{INK}" stroke-width="3"/>')
    for k in range(5):
        svg.add(f'<rect x="{460 + k * 6}" y="{220 + k * 6}" width="{480 - k * 12}" height="{300 - k * 12}" rx="14" fill="none" stroke="{INK}" stroke-width="0.8" opacity="0.5"/>')
    svg.add(f'<rect x="560" y="270" width="280" height="180" fill="#d8d0c0" stroke="{INK}" stroke-width="2.4"/>')
    for k in range(1, 6):
        svg.add(f'<path d="M560,{270 + k * 30} h280 M{560 + k * 46},270 v180" stroke="{INK}" stroke-width="0.7" opacity="0.4"/>')
    # portale con i tetti a pagoda
    svg.add(f'<path d="M640,560 h120 v-40 h-120 Z" fill="#d8442a" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M620,520 h160 l-20,-24 h-120 Z" fill="#3a6a3a" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<rect x="684" y="530" width="32" height="30" fill="#5a1a10"/>')
    # sala delle eliminatorie
    svg.add(f'<rect x="960" y="290" width="110" height="70" fill="#f4f1ea" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M944,290 l71,-36 l71,36 Z" fill="#d8442a" stroke="{INK}" stroke-width="2"/>')
    svg.add(text(1015, 395, "Eliminatorie · Preliminaries", size=13, fill=INK, italic=True, halo="#f0f6e0", halo_w=3))
    # porto e traghetti
    svg.add(f'<path d="M640,880 h100 v40 h-100 Z" fill="#a8742a" stroke="{INK}" stroke-width="1.6"/>')
    for (x, y) in ((560, 930), (820, 940)):
        svg.add(ship(x, y, 1.4, "#f4f1ea", "#ffffff", INK, "#d8442a"))
    svg.add(text(700, 175, "Tenkaichi Budokai · 天下一武道会", size=20, fill=INK, weight="bold", halo="#f0f6e0", halo_w=4))
    svg.add(text(90, 900, "→ Terra", size=13, fill=INK, italic=True, halo="#e8fbff", halo_w=3))
    head(svg, "Isola di Papaya", "Papaya Island · パパイヤ島", x=260, y=70, w=360, size=30)
    svg.add(compass(1330, 920, 32, INK, "#f0f6e0", "#d83a1a"))
    save(svg, "dragonball-papaya.svg", P)
    return P


# =============================================================================
# CITTÀ DELL'OVEST · CAPSULE CORPORATION — 1400 × 1000
# =============================================================================
def west_city() -> dict:
    W, H = 1400, 1000
    rng = random.Random(507)
    svg = Svg(W, H, "Dragon Ball · Città dell'Ovest / West City · Capsule Corporation", CREDIT)
    P = {
        "loc-dbz-wc-capsule-hq": (700, 430),
        "loc-dbz-wc-gravity-room": (930, 560),
        "loc-dbz-wc-lab": (470, 560),
        "loc-dbz-wc-garden": (700, 680),
        "loc-dbz-wc-return": (90, 930),
    }
    pins = list(P.values())
    svg.add(f'<rect width="{W}" height="{H}" fill="#d8dcd0"/>')
    # isolati: griglia di strade e palazzi tondeggianti (stile Toriyama: cupole e capsule)
    for gx in range(0, W, 140):
        svg.add(f'<rect x="{gx + 54}" y="0" width="32" height="{H}" fill="#b8bcb4"/>')
    for gy in range(0, H, 130):
        svg.add(f'<rect x="0" y="{gy + 50}" width="{W}" height="30" fill="#b8bcb4"/>')
    campus = (380, 300, 640, 470)
    for gx in range(0, W, 140):
        for gy in range(0, H, 130):
            cx, cy = gx + 140, gy + 120
            if campus[0] - 60 < cx < campus[0] + campus[2] + 60 and campus[1] - 60 < cy < campus[1] + campus[3] + 60:
                continue
            for _ in range(3):
                x, y = cx - 60 + rng.uniform(0, 80), cy - 40 + rng.uniform(0, 30)
                if any(math.hypot(x - px, y - py) < 60 for px, py in pins):
                    continue
                col = rng.choice(("#f4f1ea", "#e8e0c8", "#cfe3f0", "#f0d8c8"))
                if rng.random() < 0.5:
                    svg.add(dome(x, y, rng.uniform(14, 24), col, INK, 3, 1))
                else:
                    h = rng.uniform(26, 60)
                    svg.add(f'<rect x="{f(x - 12)}" y="{f(y - h)}" width="24" height="{f(h)}" rx="8" fill="{col}" stroke="{INK}" stroke-width="1.2"/>')
    # complesso della Capsule Corporation
    svg.add(f'<rect x="{campus[0]}" y="{campus[1]}" width="{campus[2]}" height="{campus[3]}" rx="40" fill="#a8d88a" stroke="{INK}" stroke-width="2.4"/>')
    svg.add(dome(700, 470, 150, "#f4f1ea", INK, 7, 1))
    svg.add(f'<rect x="620" y="420" width="160" height="34" rx="6" fill="#ffffff" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(text(700, 444, "CAPSULE CORP.", size=18, fill="#2a5ab0", weight="bold", spacing=2))
    # laboratorio di Bulma con la Macchina del Tempo
    svg.add(f'<rect x="420" y="530" width="110" height="60" rx="14" fill="#e8e0c8" stroke="{INK}" stroke-width="1.8"/>')
    svg.add(f'<ellipse cx="475" cy="520" rx="26" ry="10" fill="#f4f1ea" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<path d="M455,516 a20,14 0 0,1 40,0 Z" fill="#8ac8f0" stroke="{INK}" stroke-width="1.2"/>')
    svg.add(text(475, 615, "Laboratorio · Lab", size=13, fill=INK, italic=True, halo="#e8f6d8", halo_w=3))
    # stanza della gravità (navicella sferica)
    svg.add(f'<circle cx="930" cy="540" r="40" fill="#f4f1ea" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<rect x="914" y="536" width="32" height="8" fill="#d83a2a"/>')
    svg.add(text(930, 605, "Stanza della gravità · Gravity Room", size=13, fill=INK, italic=True, halo="#e8f6d8", halo_w=3))
    # giardino con gli animali di casa Brief
    for x, y in scatter(rng, 18, (560, 640, 840, 740), far_from(pins, 30), mind=26):
        svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="10" fill="#4f8a3c" stroke="{INK}" stroke-width="1"/>')
    svg.add(f'<ellipse cx="760" cy="700" rx="36" ry="14" fill="#7cc0dc" stroke="{INK}" stroke-width="1.2"/>')
    svg.add(text(90, 900, "→ Terra", size=13, fill=INK, italic=True, halo="#d8dcd0", halo_w=3))
    head(svg, "Città dell'Ovest", "West City · 西の都 · Capsule Corporation", x=330, y=70, w=480, size=30)
    svg.add(compass(1330, 920, 32, INK, "#f4f1ea", "#2a5ab0"))
    save(svg, "dragonball-west-city.svg", P)
    return P


ALL = [cosmic, namek, gt_space, other_world, lookout, papaya, west_city]

if __name__ == "__main__":
    pins: dict = {}
    for fn in ALL:
        pins.update(fn())
    apply_pins("dragonball", pins)
