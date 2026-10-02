#!/usr/bin/env python3
"""Sotto-mappe ORIGINALI di One Piece (quelle senza un'immagine nel repository).

Ricostruzioni AniMapVerse disegnate da zero sulla base di ciò che manga/anime mostrano
(nessun artwork ufficiale): forme, posizioni relative e punti di riferimento seguono la
geografia descritta dalla serie (es. Totland ad anelli concentrici attorno a Whole Cake;
Sabaody con le 79 mangrovie divise in zone; Marineford a mezzaluna con la baia cinta da
mura; Impel Down in sezione con i 6 livelli + Newkama Land; Water Seven a fontana con i
Dock; Drum con le montagne cilindriche; Marijoa sulla Red Line con il Red Port alla base).

    python3 scripts/mapgen/onepiece.py  → public/assets/worlds/onepiece/maps/*.svg + pin
"""
from __future__ import annotations

import math
import random
import sys

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from kit import (JP, SERIF, Svg, apply_pins, arena, big_tree, both, castle, compass, curved_text, dome,
                 dots, ellipse_pts, f, far_from, forest, house, island, jagged, mountain, mountain_range,
                 out_path, patch, path_line, pip, poly, preview, region_label, ribbon, river, road,
                 scale_pts, scatter, sea, shade, ship, smooth, text, tower, town, trees, wood)

INK = "#2a1f14"
PAPER = "#f1e2bc"
LAND = "#a5d07c"
LAND2 = "#8fc066"
BEACH = "#f2dfa4"
SHALLOW = "#a9e1f0"
CREDIT = "Ricostruzione originale AniMapVerse · CC0 · non è materiale ufficiale di One Piece"


def save(svg: Svg, name: str, pins: dict) -> None:
    svg.save(out_path("onepiece", name))
    preview(svg.path, pins, svg.w, svg.h)


def op_sea(svg, rng, land, top="#62b6dc", bottom="#3d8fc2", n=230, wave="#ffffff"):
    sea(svg, top, bottom, wave, rng, land, n=n, wave_w=16, opacity=0.6)


def op_island(svg, pts, fill=LAND, shallow=SHALLOW, beach=BEACH, sw=3.0):
    return island(svg, pts, fill, stroke=INK, shallow=shallow, beach=beach, shallow_w=28, beach_w=10, stroke_w=sw)


def head(svg, name, sub=None, x=None, y=58, w=420, size=34):
    est = max(len(name) * size * 0.62, len(sub) * size * 0.45 * 0.56 if sub else 0)
    w2 = max(w, est + 70)
    tail = (size * 1.55 + (size * 0.6 if sub else 0)) * 0.55
    if x is not None:
        x = min(max(x, w2 / 2 + tail + 8), svg.w - w2 / 2 - tail - 8)
    svg.add(ribbon(x if x is not None else svg.w / 2, y, w, name, size=size, fill=PAPER, stroke="#5a3a1a",
                   ink="#4a2a10", sub=sub))


def rose(svg, x=None, y=None, r=40):
    svg.add(compass(x if x is not None else svg.w - 62, y if y is not None else svg.h - 70, r, INK, PAPER, "#c0392b"))


def jungle(svg, poly_pts, rng, density=0.0024, r=10, avoid=None, palette=("#5a9a42", "#2f5a26", "#86c060"), kind="round"):
    return forest(svg, poly_pts, rng, density, r, avoid=avoid, fill=palette[0], dark=palette[1], light=palette[2],
                  stroke="#1f3418", sw=0.9, kind=kind)


def bubble(x, y, r, opacity=0.35, stroke="#e8fbff") -> list[str]:
    return [f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="#dff6ff" opacity="{opacity * 0.4:.2f}" stroke="{stroke}" stroke-width="2.5"/>',
            f'<path d="M{f(x - r * 0.55)},{f(y - r * 0.5)} a{f(r * 0.8)},{f(r * 0.8)} 0 0,1 {f(r * 0.5)},{f(-r * 0.3)}" fill="none" stroke="#ffffff" stroke-width="{f(max(2, r * 0.08))}" stroke-linecap="round" opacity="0.8"/>']


# =============================================================================
# 1. TOTLAND — 34 isole ad anelli attorno a Whole Cake Island
# =============================================================================
def totland() -> dict:
    W, H = 1200, 800
    rng = random.Random(1001)
    svg = Svg(W, H, "Totto Land · Whole Cake Island", CREDIT)
    cx, cy = 600, 410
    def ring(a, rx, ry):
        return (cx + rx * math.cos(math.radians(a)), cy + ry * math.sin(math.radians(a)))
    isl = {  # nome: (pos, raggio, colore terra, motivo)
        "loc-op-tl-nuts": (ring(-150, 330, 235), 46, "#c9a26a", "nut"),
        "loc-op-tl-funwari": (ring(-112, 330, 235), 40, "#fbf3dc", "cream"),
        "loc-op-tl-milenge": (ring(-68, 330, 235), 42, "#e8c88a", "layer"),
        "loc-op-tl-cacao": (ring(-25, 330, 235), 54, "#7a4a2a", "choc"),
        "loc-op-tl-cheese": (ring(15, 330, 235), 46, "#f2cf4a", "cheese"),
        "loc-op-tl-kibi": (ring(55, 330, 235), 40, "#d9c27a", "grain"),
        "loc-op-tl-flavor": (ring(88, 330, 235), 40, "#f2a6c0", "candy"),
        "loc-op-tl-candy": (ring(122, 330, 235), 44, "#f6c6e0", "candy"),
        "loc-op-tl-komugi": (ring(150, 330, 235), 50, "#e0c27a", "grain"),
        "loc-op-tl-jam": (ring(185, 330, 235), 46, "#c0392b", "jam"),
        "loc-op-tl-margarine": (ring(205, 470, 300), 40, "#f6e08a", "cream"),
        "loc-op-tl-milk": (ring(150, 215, 150), 34, "#ffffff", "milk"),
        "loc-op-tl-biscuits": (ring(32, 262, 168), 34, "#d8a868", "biscuit"),
    }
    P = {k: v[0] for k, v in isl.items()}
    P.update({
        "loc-op-tl-chateau": (600, 350),
        "loc-op-tl-sweet-city": (590, 432),
        "loc-op-tl-seducing-woods": (690, 470),
        "loc-op-tl-mirror-world": (504, 372),
        "loc-op-tl-prisoner-library": (676, 382),
    })
    wci = jagged(ellipse_pts(cx, cy + 10, 150, 108, 16), rng, 0.08, 3)
    lands = [wci] + [jagged(ellipse_pts(p[0], p[1], r, r * 0.72, 12), rng, 0.12, 2) for p, r, _, _ in isl.values()]
    extra = []
    for a in range(-170, 190, 24):  # isolette minori (34 in tutto)
        for rr in (440, 260):
            p = ring(a + rng.uniform(-6, 6), rr + rng.uniform(-20, 20), rr * 0.7)
            if all(math.hypot(p[0] - q[0], p[1] - q[1]) > 85 for q, _, _, _ in isl.values()) and 30 < p[0] < W - 30 and 110 < p[1] < H - 30 \
                    and math.hypot(p[0] - cx, (p[1] - cy) * 1.4) > 230:
                extra.append(jagged(ellipse_pts(p[0], p[1], 18, 13, 10), rng, 0.15, 2))
    op_sea(svg, rng, lands + extra, top="#7cc4e6", bottom="#4a9cc9")
    for e in extra:
        op_island(svg, e, rng.choice(["#f6c6e0", "#fbf3dc", "#e8c88a", "#a5d07c", "#f2cf4a"]), sw=2)
    # isole maggiori con i loro motivi "dolci"
    for (lid, ((x, y), r, col, motif)), pts in zip(isl.items(), lands[1:]):
        op_island(svg, pts, col)
        if motif == "choc":
            for i in range(5):
                svg.add(f'<path d="M{f(x - r * 0.6 + i * r * 0.3)},{f(y - r * 0.4)} q{f(r * 0.1)},{f(r * 0.4)} 0,{f(r * 0.8)}" fill="none" stroke="#4a2a14" stroke-width="2" opacity="0.6"/>')
        elif motif == "cheese":
            for i in range(5):
                svg.add(f'<circle cx="{f(x + rng.uniform(-r * 0.5, r * 0.5))}" cy="{f(y + rng.uniform(-r * 0.35, r * 0.35))}" r="{f(rng.uniform(3, 6))}" fill="#d9a82a"/>')
        elif motif == "jam":
            svg.add(f'<path d="M{f(x - r * 0.5)},{f(y - r * 0.1)} q{f(r * 0.5)},{f(-r * 0.4)} {f(r)},0" fill="none" stroke="#ff7a6a" stroke-width="4" opacity="0.7"/>')
        elif motif == "candy":
            for i in range(4):
                svg.add(f'<path d="M{f(x - r * 0.6)},{f(y - r * 0.3 + i * r * 0.2)} l{f(r * 1.2)},{f(-r * 0.2)}" stroke="#ffffff" stroke-width="3" opacity="0.8"/>')
        elif motif == "layer":
            for i in range(3):
                svg.add(f'<path d="M{f(x - r * 0.7)},{f(y - r * 0.2 + i * r * 0.2)} h{f(r * 1.4)}" stroke="#a8743a" stroke-width="2" opacity="0.7"/>')
        elif motif == "grain":
            svg.add(trees([(x + rng.uniform(-r * 0.5, r * 0.5), y + rng.uniform(-r * 0.3, r * 0.3)) for _ in range(5)], rng, r=4,
                          kind="pine", fill="#c9a24a", dark="#a8843a", stroke=INK, sw=0.6))
        elif motif == "nut":
            for i in range(4):
                svg.add(f'<ellipse cx="{f(x + rng.uniform(-r * 0.5, r * 0.5))}" cy="{f(y + rng.uniform(-r * 0.3, r * 0.3))}" rx="7" ry="5" fill="#8a5a2a" stroke="{INK}" stroke-width="0.8"/>')
        elif motif == "biscuit":
            for i in range(6):
                svg.add(f'<circle cx="{f(x - r * 0.4 + (i % 3) * r * 0.4)}" cy="{f(y - r * 0.15 + (i // 3) * r * 0.3)}" r="2.4" fill="#8a5a2a"/>')
        elif motif == "milk":
            svg.add(f'<path d="M{f(x - r * 0.6)},{f(y)} q{f(r * 0.3)},{f(-r * 0.5)} {f(r * 0.6)},0 t{f(r * 0.6)},0" fill="none" stroke="#c9e6f0" stroke-width="3"/>')
    # Whole Cake Island
    op_island(svg, wci, "#b8e08a")
    svg.add(jungle(svg, jagged([(650, 440), (740, 430), (740, 500), (660, 510)], rng, 0.08, 2), rng, 0.006, 8,
                   avoid=far_from(list(P.values()), 16), palette=("#3f8a3a", "#245a20", "#6fc060")))
    svg.add(town(rng, 590, 445, 110, 40, 40, 13, ("#fbe9f0", "#fff3d6"), ("#f29ab8", "#c98ae0", "#8ac8f0", "#f2c84a")))
    # il castello-torta di Big Mom (torta a piani con candeline)
    for i, (w, h, c) in enumerate(((120, 30, "#f6d0e0"), (92, 30, "#fbf3dc"), (64, 30, "#f6d0e0"), (36, 26, "#fbf3dc"))):
        y = 382 - i * 28
        svg.add(f'<rect x="{600 - w / 2}" y="{y - h}" width="{w}" height="{h}" rx="6" fill="{c}" stroke="{INK}" stroke-width="1.8"/>')
        svg.add(f'<path d="M{600 - w / 2},{y - h + 6} q{w / 8},10 {w / 4},0 t{w / 4},0 t{w / 4},0 t{w / 4},0" fill="none" stroke="#e86a9a" stroke-width="2.4"/>')
    for dx in (-10, 0, 10):
        svg.add(f'<rect x="{600 + dx - 2}" y="252" width="4" height="12" fill="#f2c84a" stroke="{INK}" stroke-width="0.6"/>')
    svg.add(f'<rect x="490" y="352" width="22" height="30" rx="10" fill="#cfe9f4" stroke="{INK}" stroke-width="1.6"/>')  # specchio
    svg.add(f'<rect x="666" y="370" width="22" height="16" fill="#8a6a4a" stroke="{INK}" stroke-width="1.2"/>')
    head(svg, "Totto Land", "Whole Cake Island · 34 isole / islands", y=50, w=440)
    rose(svg)
    save(svg, "onepiece-totland.svg", P)
    return P


# =============================================================================
# 2. DRESSROSA (+ Green Bit)
# =============================================================================
def dressrosa() -> dict:
    W, H = 1200, 800
    rng = random.Random(1002)
    svg = Svg(W, H, "Dressrosa · ドレスローザ", CREDIT)
    P = {
        "loc-op-dr-royal-palace": (560, 214),
        "loc-op-dr-riku-plateau": (668, 300),
        "loc-op-dr-flower-hill": (430, 330),
        "loc-op-dr-acacia": (920, 360),
        "loc-op-dr-corrida-colosseum": (884, 470),
        "loc-op-dr-toy-house": (770, 430),
        "loc-op-dr-smile-factory": (770, 500),
        "loc-op-dr-sunflower": (330, 470),
        "loc-op-dr-flower-field": (560, 520),
        "loc-op-dr-tontatta": (420, 700),
    }
    pins = list(P.values())
    main = jagged([(200, 260), (360, 150), (600, 120), (840, 170), (1000, 260), (1040, 430), (960, 560), (760, 610),
                   (560, 600), (360, 590), (220, 500), (170, 380)], rng, 0.07, 3)
    gb = jagged(ellipse_pts(420, 712, 150, 66, 14), rng, 0.1, 2)
    op_sea(svg, rng, [main, gb])
    op_island(svg, main, "#b8d88a")
    op_island(svg, gb, "#6fae4e")
    # ponte di ferro (crollato) verso Green Bit, con i pesci combattenti
    svg.add(f'<path d="M470,590 L455,628 M482,594 L467,632" stroke="#5a5a62" stroke-width="5"/>')
    svg.add(f'<path d="M448,664 L440,686 M462,664 L454,686" stroke="#5a5a62" stroke-width="5"/>')
    for (x, y) in ((520, 650), (340, 640)):
        svg.add(f'<path d="M{x},{y} q14,-10 28,0 q-14,10 -28,0 Z M{x + 28},{y} l8,-6 l0,12 Z" fill="#c0392b" stroke="{INK}" stroke-width="1.2"/>')
    svg.add(jungle(svg, gb, rng, 0.006, 9, avoid=far_from(pins, 20), palette=("#3f8a3a", "#245a20", "#6fc060")))
    # Altopiano del Re (a due livelli) con il palazzo
    plat = jagged([(470, 170), (640, 150), (730, 220), (720, 330), (600, 340), (480, 300)], rng, 0.05, 2)
    svg.add(f'<path d="{smooth([(p[0], p[1] + 26) for p in plat])}" fill="#a88a5a" stroke="{INK}" stroke-width="2"/>')
    svg.add(patch(plat, "#d8c08a", stroke=INK, sw=2.2))
    svg.add(castle(560, 236, 1.0, "#f4e6c8", "#c0392b", flag="#e86aa0"))
    svg.add(region_label(600, 360, "King's Plateau", size=13, color="#4a2a10", halo="#f1e2bc", spacing=2))
    # campi di fiori e girasoli
    for (x, y, c) in ((330, 470, "#f2c84a"), (560, 520, "#e86a9a"), (430, 330, "#f29ab8")):
        pts = jagged(ellipse_pts(x, y + 8, 80, 40, 12), rng, 0.08, 2)
        svg.add(patch(pts, shade(c, 0.55), stroke=shade(c, -0.2), sw=1.4))
        for _ in range(26):
            px, py = x + rng.uniform(-66, 66), y + 8 + rng.uniform(-28, 28)
            if pip(px, py, pts) and math.hypot(px - x, py - y) > 16:
                svg.add(f'<circle cx="{f(px)}" cy="{f(py)}" r="3.2" fill="{c}" stroke="{INK}" stroke-width="0.5"/>')
    # Acacia: città portuale con il Colosseo Corrida circondato dall'acqua
    svg.add(town(rng, 940, 380, 70, 50, 20, 15, ("#fff3d6", "#f6e0c0"), ("#e07a4a", "#c0392b", "#f2a64a")))
    svg.add(f'<ellipse cx="884" cy="486" rx="70" ry="40" fill="#7fc8e4" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(arena(884, 478, 56, 32, "#d8b88a", "#e8d8a8"))
    svg.add(f'<path d="M884,446 v64 M828,478 h112" stroke="#c9b08a" stroke-width="4"/>')
    # Toy House + fabbrica SMILE sotterranea (tratteggiata)
    svg.add(house(770, 444, 40, "#fbe0f0", "#e86aa0"))
    svg.add(f'<ellipse cx="770" cy="504" rx="52" ry="22" fill="#2a2433" opacity="0.4" stroke="#2a2433" stroke-width="2" stroke-dasharray="6 4"/>')
    for dx in (-24, 0, 24):
        svg.add(f'<path d="M{770 + dx - 6},{512} v-14 l6,-6 l6,6 v14 Z" fill="#6a6a72" opacity="0.8"/>')
    svg.add(town(rng, 330, 260, 90, 50, 22, 14, ("#fff3d6",), ("#e07a4a", "#c0392b", "#f2a64a")))
    svg.add(town(rng, 680, 560, 90, 30, 16, 14, ("#fff3d6",), ("#e07a4a", "#c0392b")))
    svg.add(trees(scatter(rng, 30, (200, 150, 1040, 600), both(lambda x, y: pip(x, y, scale_pts(main, 0.92)), far_from(pins, 40),
                                                         lambda x, y: not pip(x, y, plat)), mind=40), rng, r=7, kind="palm", fill="#3f8a3a"))
    svg.add(region_label(420, 778, "Green Bit", size=15, color="#f1e2bc", halo="#245a20"))
    head(svg, "Dressrosa", "Regno dell'amore e delle passioni · Kingdom of Love", y=56, w=430)
    rose(svg, 1130, 90)
    save(svg, "onepiece-dressrosa.svg", P)
    return P


# =============================================================================
# 3. SABAODY — 79 mangrovie Yarukiman divise in zone
# =============================================================================
def sabaody() -> dict:
    W, H = 1200, 800
    rng = random.Random(1003)
    svg = Svg(W, H, "Sabaody Archipelago · シャボンディ諸島", CREDIT)
    cx, cy, rx, ry = 600, 430, 430, 270
    zones = [  # (da, a, gruppi, colore, etichetta)
        (1, 29, "#c97a5a", "1–29 · Zona senza legge / Lawless"),
        (30, 39, "#e8b4d8", "30–39 · Sabaody Park"),
        (40, 49, "#f2cf6a", "40–49 · Turismo / Tourist"),
        (50, 59, "#8ac0a8", "50–59 · Cantieri / Shipyards"),
        (60, 69, "#7aa0d8", "60–69 · Marina / Marines"),
        (70, 79, "#c8a8e8", "70–79 · Hotel"),
    ]
    jit = random.Random(77)
    offs = {n: (jit.uniform(-0.09, 0.09), (1 if n % 2 else -1) * jit.uniform(0.02, 0.07)) for n in range(1, 80)}
    def gpos(n):
        da, dr = offs[round(n)] if round(n) == n else (0, 0)
        a = math.radians(150 + (n - 1) * (360 / 79) + da * 4)
        return (cx + rx * (1 + dr) * math.cos(a), cy + ry * (1 + dr * 1.3) * math.sin(a))
    P = {
        "loc-op-sb-auction-house": gpos(1),
        "loc-op-sb-shakky-bar": gpos(13),
        "loc-op-sb-grove-13": (gpos(13)[0] + 70, gpos(13)[1] + 10),
        "loc-op-sb-lawless": (330, 480),
        "loc-op-sb-park": gpos(33),
        "loc-op-sb-grove-41": gpos(41),
        "loc-op-sb-marine-base": gpos(66),
        "loc-op-sb-mangroves": (600, 430),
        "loc-op-sb-chambord": (96, 178),
    }
    pins = list(P.values())
    op_sea(svg, rng, [], top="#7cc4e6", bottom="#4a9cc9", n=200)
    # radici-isola di ogni mangrovia
    for n in range(1, 80):
        x, y = gpos(n)
        col = next(c for a, b, c, _ in zones if a <= n <= b)
        root = jagged(ellipse_pts(x, y + 6, 22, 13, 10), rng, 0.18, 2)
        svg.add(patch(root, "#c9b07a", stroke=INK, sw=1.6))
        svg.add(f'<ellipse cx="{f(x)}" cy="{f(y + 6)}" rx="20" ry="10" fill="{col}" opacity="0.55"/>')
    # alberi giganti (solo alcuni, per leggibilità) e bolle che salgono
    for n in range(2, 80, 3):
        x, y = gpos(n)
        if all(math.hypot(x - a, y - b) > 34 for a, b in pins):
            svg.add(big_tree(x, y + 4, 0.26, trunk="#8a6a3a", leaf="#5aa04a", light="#9ad070"))
    for _ in range(120):
        x, y = rng.uniform(20, W - 20), rng.uniform(100, H - 20)
        if all(math.hypot(x - a, y - b) > 24 for a, b in pins):
            svg.add(bubble(x, y, rng.uniform(4, 14), 0.5))
    for n in (1, 13, 29, 30, 39, 40, 49, 50, 59, 60, 69, 70, 79):
        x, y = gpos(n)
        ox, oy = (x - cx) * 0.12, (y - cy) * 0.12
        svg.add(text(x + ox, y + oy + 30, str(n), size=13, fill="#ffffff", weight="bold", halo=INK, halo_w=3))
    # nomi delle zone sull'anello interno
    for a, b, c, lab in zones:
        mid = (a + b) / 2
        x, y = gpos(mid)
        tx, ty = cx + (x - cx) * 0.6, cy + (y - cy) * 0.6
        svg.add(text(tx, ty, lab, size=14, fill=shade(c, -0.55), weight="bold", halo="#eaf6fb", halo_w=4))
    # Grove 1: casa d'aste; Grove 13: bar di Shakky; parco con ruota panoramica; base Marina
    x, y = gpos(1)
    svg.add(dome(x, y - 4, 22, "#e8d8b8", INK))
    x, y = gpos(33)
    svg.add(f'<circle cx="{f(x)}" cy="{f(y - 34)}" r="26" fill="none" stroke="{INK}" stroke-width="2"/>')
    for k in range(8):
        a = k * math.pi / 4
        svg.add(f'<path d="M{f(x)},{f(y - 34)} l{f(26 * math.cos(a))},{f(26 * math.sin(a))}" stroke="{INK}" stroke-width="1"/>')
        svg.add(f'<circle cx="{f(x + 26 * math.cos(a))}" cy="{f(y - 34 + 26 * math.sin(a))}" r="4" fill="#e86aa0" stroke="{INK}" stroke-width="0.8"/>')
    x, y = gpos(66)
    svg.add(f'<rect x="{f(x - 22)}" y="{f(y - 30)}" width="44" height="26" fill="#ffffff" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(text(x, y - 11, "海軍", size=13, fill="#2a5aa0", family=JP, weight="bold"))
    # Chambord, l'isola dei Draghi Celesti in visita (al largo)
    ch = jagged(ellipse_pts(96, 190, 40, 24, 10), rng, 0.1, 2)
    op_island(svg, ch, "#e8dcc0", sw=2)
    head(svg, "Sabaody Archipelago", "79 mangrovie Yarukiman · 79 Yarukiman groves", y=52, w=520, size=30)
    rose(svg, 1130, 740, 36)
    save(svg, "onepiece-sabaody.svg", P)
    return P


# =============================================================================
# 4. MARINEFORD — isola a mezzaluna, baia cinta da mura
# =============================================================================
def marineford() -> dict:
    W, H = 1200, 800
    rng = random.Random(1004)
    svg = Svg(W, H, "Marineford · マリンフォード", CREDIT)
    P = {
        "loc-op-mf-headquarters": (600, 136),
        "loc-op-mf-justice-tower": (790, 168),
        "loc-op-mf-execution-platform": (600, 290),
        "loc-op-mf-plaza": (600, 400),
        "loc-op-mf-bay": (640, 590),
        "loc-op-mf-frozen-bay": (470, 630),
        "loc-op-mf-walls": (196, 500),
        "loc-op-mf-drawbridges": (1000, 470),
    }
    land = jagged([(150, 420), (210, 250), (380, 130), (600, 90), (820, 130), (990, 250), (1050, 420), (990, 470), (900, 360),
                   (760, 300), (600, 290), (440, 300), (300, 360), (210, 470)], rng, 0.03, 3)
    op_sea(svg, rng, [land])
    op_island(svg, land, "#c9c2a8", shallow=SHALLOW, beach="#e6dcc0")
    # città delle famiglie dei Marine, alle spalle del QG
    svg.add(town(rng, 600, 200, 400, 90, 70, 16, ("#f4f1ea", "#e6e2d6"), ("#3a5a9a", "#5a7ab0", "#8a9ab8"),
                 ok=both(lambda x, y: pip(x, y, scale_pts(land, 0.93)), far_from(list(P.values()), 40),
                         lambda x, y: not (480 < x < 720 and y < 190) and y < 300)))
    # baia interna e piazza Oris
    svg.add(f'<path d="M300,370 Q600,250 900,370 L900,420 Q600,330 300,420 Z" fill="#e2d9c0" stroke="{INK}" stroke-width="2"/>')
    # mura che cingono la baia (con porte) da una punta all'altra della mezzaluna
    wall = [(200, 470), (230, 600), (360, 700), (600, 740), (840, 700), (970, 600), (1000, 470)]
    svg.add(f'<path d="{smooth(wall, closed=False)}" fill="none" stroke="#6a6a72" stroke-width="18" stroke-linecap="round"/>')
    svg.add(f'<path d="{smooth(wall, closed=False)}" fill="none" stroke="#b9bcc4" stroke-width="12" stroke-linecap="round"/>')
    svg.add(f'<path d="{smooth(wall, closed=False)}" fill="none" stroke="{INK}" stroke-width="12" stroke-dasharray="2 14" opacity="0.4"/>')
    # baia gelata (Aokiji) + la breccia dell'Oro Jackson... qui solo ghiaccio e navi
    ice = jagged([(360, 560), (560, 540), (600, 640), (470, 700), (340, 660)], rng, 0.12, 2)
    svg.add(patch(ice, "#e8f6fb", stroke="#8ac8e0", sw=2, opacity=0.9))
    for i in range(10):
        x, y = 380 + rng.uniform(0, 200), 570 + rng.uniform(0, 110)
        if pip(x, y, ice):
            svg.add(f'<path d="M{f(x)},{f(y)} l{f(rng.uniform(-20, 20))},{f(rng.uniform(-12, 12))}" stroke="#8ac8e0" stroke-width="1.4"/>')
    for (x, y, fl) in ((560, 600, "#1d1d1d"), (700, 560, "#1d1d1d"), (780, 620, "#1d1d1d"), (420, 520, "#ffffff")):
        svg.add(ship(x, y, 0.9, flag=fl))
    # Quartier Generale (海軍 sul fronte), torre, patibolo
    svg.add(f'<rect x="500" y="80" width="200" height="90" fill="#f4f1ea" stroke="{INK}" stroke-width="2.4"/>')
    for i in range(4):
        svg.add(f'<rect x="{512 + i * 48}" y="96" width="30" height="60" fill="#d8dce4" stroke="{INK}" stroke-width="1"/>')
    svg.add(f'<path d="M490,80 L600,40 L710,80 Z" fill="#3a5a9a" stroke="{INK}" stroke-width="2"/>')
    svg.add(text(600, 72, "海軍", size=22, fill="#ffffff", family=JP, weight="bold"))
    svg.add(tower(790, 186, 30, 70, "#f4f1ea", "#3a5a9a"))
    svg.add(f'<rect x="570" y="270" width="60" height="20" fill="#8a6a44" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<path d="M578,270 v-38 M622,270 v-38 M574,232 h52" stroke="#5a3a1a" stroke-width="4"/>')
    for (x, y) in ((990, 452), (1012, 490)):
        svg.add(f'<path d="M{x - 18},{y} h36" stroke="#8a6a44" stroke-width="7"/>')
    svg.add(region_label(600, 520, "Baia / Bay", size=15, color="#0f3a5a", halo="#cfeefa"))
    head(svg, "Marineford", "Quartier Generale della Marina · Marine HQ", x=236, y=60, w=360, size=28)
    rose(svg, 1130, 90, 36)
    save(svg, "onepiece-marineford.svg", P)
    return P


# =============================================================================
# 5. EGGHEAD — isola del futuro: Labophase in alto, Fabriophase in basso, Frontier Dome
# =============================================================================
def egghead() -> dict:
    W, H = 1200, 800
    rng = random.Random(1005)
    svg = Svg(W, H, "Egghead · エッグヘッド", CREDIT)
    P = {
        "loc-op-eg-punk-records": (600, 128),
        "loc-op-eg-labophase": (520, 276),
        "loc-op-eg-kuma-room": (330, 262),
        "loc-op-eg-fabriophase": (800, 400),
        "loc-op-eg-vegaforce": (480, 470),
        "loc-op-eg-old-lab": (296, 520),
        "loc-op-eg-harbor": (900, 560),
        "loc-op-eg-defense": (700, 560),
        "loc-op-eg-frontier-gate": (600, 680),
    }
    pins = list(P.values())
    land = jagged([(190, 420), (260, 300), (420, 230), (600, 210), (800, 250), (960, 340), (1010, 470), (940, 600),
                   (760, 660), (560, 690), (360, 650), (220, 560)], rng, 0.05, 3)
    op_sea(svg, rng, [land], top="#8ac8e6", bottom="#5a9cc9")
    op_island(svg, land, "#e6eef2", beach="#dfe6ea")  # isola invernale
    svg.add(dots(rng, (200, 220, 1000, 690), 300, "#9ab8c8", (0.8, 2), lambda x, y: pip(x, y, land)))
    # collina dell'uovo con il Labophase (grande uovo di laboratori) in cima
    svg.add(patch(jagged(ellipse_pts(520, 330, 220, 110, 14), rng, 0.05, 2), "#cfdde6", stroke=INK, sw=2))
    svg.add(f'<ellipse cx="520" cy="268" rx="96" ry="60" fill="#fbf8ef" stroke="{INK}" stroke-width="2.4"/>')
    svg.add(f'<path d="M424,268 q20,-12 40,0 l12,-14 l14,14 l16,-16 l14,16 l18,-14 l14,14 q20,-12 40,0" fill="none" stroke="#c9b48a" stroke-width="3"/>')
    svg.add(f'<ellipse cx="500" cy="248" rx="26" ry="14" fill="#ffffff" opacity="0.8"/>')
    # Punk Records: il "cervello" che fluttua sopra il Labophase
    svg.add(f'<path d="M520,212 C540,180 570,160 600,160" fill="none" stroke="#8a8a9a" stroke-width="4" stroke-dasharray="3 5"/>')
    for (dx, dy, r) in ((-34, 0, 30), (0, -14, 34), (34, 0, 30), (-16, 16, 26), (18, 18, 26)):
        svg.add(f'<circle cx="{600 + dx}" cy="{128 + dy}" r="{r}" fill="#f2a6c0" stroke="{INK}" stroke-width="2"/>')
    for k in range(5):
        svg.add(f'<path d="M{570 + k * 14},{104 + (k % 2) * 6} q8,10 0,22 q-8,10 0,22" fill="none" stroke="#c0567a" stroke-width="2"/>')
    # Fabriophase: fabbriche e ciminiere
    svg.add(patch(jagged(ellipse_pts(800, 420, 150, 80, 12), rng, 0.05, 2), "#c9ccd2", stroke=INK, sw=2))
    for i in range(7):
        x, y = 690 + i * 34, 430 + (i % 2) * 18
        svg.add(f'<rect x="{x - 14}" y="{y - 30}" width="28" height="30" fill="#8a96a8" stroke="{INK}" stroke-width="1.2"/>')
        svg.add(f'<path d="M{x - 14},{y - 30} l14,-12 l14,12" fill="#5a6a82" stroke="{INK}" stroke-width="1.2"/>')
        if i % 2 == 0:
            svg.add(f'<rect x="{x + 6}" y="{y - 60}" width="6" height="30" fill="#6a6a72" stroke="{INK}" stroke-width="1"/>')
            svg.add(f'<circle cx="{x + 9}" cy="{y - 68}" r="7" fill="#e6e6ea" opacity="0.7"/>')
    # hangar (Vega Force-01, Seraphim), vecchio laboratorio, stanza di Kuma
    for (x, y, c) in ((480, 486, "#d9a84a"), (700, 576, "#7a8aa8")):
        svg.add(f'<path d="M{x - 44},{y} v-24 a44,26 0 0,1 88,0 v24 Z" fill="{c}" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<rect x="270" y="500" width="52" height="34" fill="#a8a092" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<path d="M272,500 l10,-8 l10,6 l14,-10 l14,12" fill="none" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<rect x="306" y="244" width="48" height="30" rx="4" fill="#f4e6c8" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<path d="M320,252 a6,6 0 1,1 0.1,0 M340,252 a6,6 0 1,1 0.1,0" fill="#8a5a3a"/>')  # orecchie d'orso
    # porto e navi
    svg.add(f'<path d="M900,580 l70,40 M920,560 l70,40" stroke="#6a6a72" stroke-width="6"/>')
    svg.add(ship(1010, 650, 1.0, flag="#1d1d1d"))
    for (x, y) in ((140, 700), (1080, 230), (180, 180)):
        svg.add(ship(x, y, 0.9, sail="#ffffff", flag="#3a5a9a"))
    # strade sopraelevate
    for s in ([(520, 330), (600, 420), (690, 420)], [(520, 330), (480, 470)], [(600, 420), (600, 660)], [(800, 470), (900, 560)]):
        svg.add(road(s, 6, "#f4f4f6", "#8a96a8"))
    # Frontier Dome (cupola-barriera laser)
    svg.add(f'<ellipse cx="600" cy="440" rx="480" ry="300" fill="none" stroke="#5ad0ff" stroke-width="3" stroke-dasharray="14 8" opacity="0.8"/>')
    svg.add(f'<rect x="572" y="668" width="56" height="22" fill="#5ad0ff" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(text(1010, 120, "Frontier Dome", size=15, fill="#0a4a6a", italic=True, halo="#dff6ff", halo_w=4))
    head(svg, "Egghead", "Isola del futuro · Future Island", x=210, y=60, w=340, size=32)
    rose(svg)
    save(svg, "onepiece-egghead.svg", P)
    return P


# =============================================================================
# 6. ISOLA DEGLI UOMINI-PESCE — a 10.000 m, nella bolla
# =============================================================================
def fishman() -> dict:
    W, H = 1200, 800
    rng = random.Random(1006)
    svg = Svg(W, H, "Fish-Man Island · 魚人島", CREDIT)
    P = {
        "loc-op-fm-sunlight-tree": (390, 96),
        "loc-op-fm-ryugu-palace": (600, 206),
        "loc-op-fm-gyoverly": (760, 360),
        "loc-op-fm-coral-hill": (560, 470),
        "loc-op-fm-gyoncorde": (440, 400),
        "loc-op-fm-mermaid-cove": (740, 540),
        "loc-op-fm-district": (176, 620),
        "loc-op-fm-sea-forest": (1010, 250),
        "loc-op-fm-noah": (1040, 420),
    }
    pins = list(P.values())
    g = svg.gradient("deep", [(0, "#1e5a8a"), (1, "#081a33")])
    svg.add(f'<rect width="{W}" height="{H}" fill="{g}"/>')
    # raggi di sole filtrati dalle radici dell'albero Eve
    for k in range(7):
        x0 = 330 + k * 22
        svg.add(f'<path d="M{x0},0 L{x0 + 140 + k * 30},560 L{x0 + 170 + k * 30},560 L{x0 + 18},0 Z" fill="#fff6c8" opacity="0.07"/>')
    svg.add(f'<path d="M390,0 C392,40 380,60 390,96 M370,0 C376,40 360,60 368,90 M410,0 C406,36 420,64 410,92" fill="none" stroke="#c9a46a" stroke-width="6" stroke-linecap="round"/>')
    svg.add(f'<circle cx="390" cy="96" r="12" fill="#fff6c8" stroke="#c9a46a" stroke-width="3"/>')
    for _ in range(60):  # bolle e pesci lontani
        x, y = rng.uniform(0, W), rng.uniform(0, H)
        svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rng.uniform(2, 6))}" fill="none" stroke="#bfe8ff" stroke-width="1" opacity="0.5"/>')
    # bolla principale (doppio strato), metà acqua e metà aria
    svg.add(f'<circle cx="580" cy="450" r="300" fill="#4aa8d8" opacity="0.35" stroke="#bfe8ff" stroke-width="4"/>')
    svg.add(f'<circle cx="580" cy="450" r="286" fill="none" stroke="#e8fbff" stroke-width="2" opacity="0.7"/>')
    reef = jagged([(330, 520), (420, 420), (560, 390), (720, 400), (830, 470), (840, 560), (760, 640), (600, 690), (440, 660), (340, 600)], rng, 0.06, 3)
    svg.add(patch(reef, "#f2cfa0", stroke=INK, sw=2.4))
    svg.add(patch(scale_pts(reef, 0.8), "#f6dcb4", opacity=0.8))
    for (x, y, c) in ((420, 600, "#e86a6a"), (700, 620, "#f29a5a"), (800, 520, "#e86aa0"), (380, 470, "#f2c84a")):
        for k in range(3):
            svg.add(f'<path d="M{x + k * 10},{y} q-6,-18 4,-30 q4,10 6,30" fill="{c}" stroke="{INK}" stroke-width="1"/>')
    svg.add(town(rng, 560, 480, 120, 60, 30, 14, ("#fde6c8", "#f6f0e0"), ("#3ab0c8", "#e86a6a", "#f2a64a", "#8ac86a"),
                 ok=far_from(pins, 18)))
    svg.add(town(rng, 760, 370, 60, 30, 10, 15, ("#ffffff",), ("#f2c84a", "#e8a8d0")))
    svg.add(f'<ellipse cx="440" cy="404" rx="54" ry="22" fill="#e6dcc4" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<ellipse cx="740" cy="556" rx="60" ry="24" fill="#7fd0e8" stroke="{INK}" stroke-width="1.6"/>')
    # bolla del palazzo Ryugu, in cima
    svg.add(f'<circle cx="600" cy="196" r="86" fill="#7fc8e8" opacity="0.45" stroke="#e8fbff" stroke-width="3"/>')
    svg.add(f'<path d="M600,282 C596,300 604,330 600,360" stroke="#bfe8ff" stroke-width="10" opacity="0.6"/>')
    svg.add(f'<rect x="548" y="200" width="104" height="44" rx="6" fill="#f6e6f0" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M540,200 Q600,120 660,200 Z" fill="#7ad0c0" stroke="{INK}" stroke-width="2"/>')
    for dx in (-44, 44):
        svg.add(f'<path d="M{600 + dx - 10},200 v-26 a10,14 0 0,1 20,0 v26 Z" fill="#f2a6c0" stroke="{INK}" stroke-width="1.4"/>')
    # Distretto degli Uomini-pesce: bolla separata, più in basso
    svg.add(f'<circle cx="176" cy="630" r="104" fill="#3a7aa8" opacity="0.45" stroke="#bfe8ff" stroke-width="3"/>')
    svg.add(town(rng, 176, 650, 70, 40, 16, 14, ("#9aa0a8", "#8a8a92"), ("#4a5a6a", "#5a4a4a")))
    # Foresta Marina (NE) con l'Arca Noah
    svg.add(patch(jagged(ellipse_pts(1010, 280, 140, 60, 12), rng, 0.1, 2), "#3a6a4a", stroke=INK, sw=2))
    svg.add(trees(scatter(rng, 26, (880, 230, 1140, 330), far_from(pins, 20), mind=18), rng, r=8, fill="#2f8a6a", dark="#1a4a3a", light="#5ac08a"))
    svg.add(f'<path d="M960,440 h160 l-20,30 h-120 Z" fill="#8a5a2a" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<rect x="990" y="404" width="100" height="36" fill="#a8743a" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(text(580, 780, "−10.000 m", size=16, fill="#bfe8ff", italic=True))
    head(svg, "Fish-Man Island", "Isola degli Uomini-pesce · Regno di Ryugu", x=230, y=60, w=380, size=30)
    rose(svg, 1130, 720, 36)
    save(svg, "onepiece-fishman-island.svg", P)
    return P


# =============================================================================
# 7. IMPEL DOWN — sezione verticale della prigione sottomarina
# =============================================================================
def impel_down() -> dict:
    W, H = 1200, 800
    rng = random.Random(1007)
    svg = Svg(W, H, "Impel Down · インペルダウン", CREDIT)
    levels = [  # (pin, y, nome, kanji, colore)
        ("loc-op-id-l1", 195, "LV1 · Crimson Hell", "紅蓮地獄", "#b03a2e"),
        ("loc-op-id-l2", 285, "LV2 · Wild Beast Hell", "猛獣地獄", "#8a6a3a"),
        ("loc-op-id-l3", 375, "LV3 · Starvation Hell", "飢餓地獄", "#d9b46a"),
        ("loc-op-id-l4", 465, "LV4 · Blazing Hell", "焦熱地獄", "#e8642a"),
        ("loc-op-id-l5", 560, "LV5 · Freezing Hell", "極寒地獄", "#bfe0f0"),
        ("loc-op-id-l6", 705, "LV6 · Eternal Hell", "無限地獄", "#2a2a33"),
    ]
    P = {"loc-op-id-entrance": (600, 86), "loc-op-id-newkama": (838, 632)}
    P.update({lid: (600, y) for lid, y, *_ in levels})
    svg.add(f'<rect width="{W}" height="{H}" fill="#123a5a"/>')
    svg.add(f'<rect width="{W}" height="70" fill="#62b6dc"/>')
    for i in range(14):
        svg.add(f'<path d="M{i * 90},64 q22,-10 45,0 t45,0" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.6"/>')
    # torre in superficie con il cancello
    svg.add(f'<rect x="520" y="20" width="160" height="80" fill="#5a5a62" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M520,20 L600,0 L680,20 Z" fill="#3a3a42" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M585,100 v-30 a15,15 0 0,1 30,0 v30" fill="#1a1a1a"/>')
    # Porta della Giustizia sullo sfondo
    svg.add(f'<rect x="900" y="0" width="22" height="64" fill="#8a8a92" stroke="{INK}" stroke-width="1.4"/><rect x="980" y="0" width="22" height="64" fill="#8a8a92" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(text(951, 52, "Gates of Justice", size=12, fill="#ffffff", italic=True, halo="#123a5a", halo_w=3))
    # fusto della prigione: livelli impilati
    for i, (lid, y, name, kj, c) in enumerate(levels):
        h = 82 if lid != "loc-op-id-l6" else 120
        top = y - h / 2
        svg.add(f'<rect x="250" y="{f(top)}" width="700" height="{f(h)}" fill="{c}" stroke="{INK}" stroke-width="2.4"/>')
        svg.add(f'<rect x="250" y="{f(top)}" width="700" height="{f(h)}" fill="url(#seaG)" opacity="0"/>')
        svg.add(text(270, top + 26, name, size=17, fill="#ffffff" if c not in ("#bfe0f0", "#d9b46a") else "#1a2a3a",
                     anchor="start", weight="bold", halo=None))
        svg.add(text(930, top + 26, kj, size=17, fill="#ffffff" if c not in ("#bfe0f0", "#d9b46a") else "#1a2a3a",
                     anchor="end", family=JP))
        # decorazioni per livello
        if i == 0:  # foresta di spine cremisi
            for k in range(16):
                x = 300 + k * 40
                svg.add(f'<path d="M{x},{top + h - 6} l6,-28 l6,28 Z" fill="#7a1a14"/>')
        elif i == 1:
            for k in range(5):
                x = 320 + k * 120
                svg.add(f'<path d="M{x},{top + h - 10} q10,-24 30,-16 q14,-8 22,6 q-8,14 -26,14 Z" fill="#4a3a2a"/>')
        elif i == 2:
            svg.add(dots(rng, (260, top + 30, 940, top + h - 4), 160, "#8a6a2a", (0.6, 1.6)))
        elif i == 3:
            for k in range(12):
                x = 290 + k * 56
                svg.add(f'<path d="M{x},{top + h - 4} q8,-30 16,0 q-8,-14 -16,0 Z" fill="#ffd23a"/>')
            svg.add(f'<rect x="250" y="{f(top + h - 14)}" width="700" height="10" fill="#ff8a2a"/>')
        elif i == 4:
            for k in range(14):
                x = 290 + k * 48
                svg.add(f'<path d="M{x},{top + 34} l6,26 l6,-26" fill="#ffffff" stroke="#8ac8e0" stroke-width="1"/>')
        elif i == 5:
            for k in range(7):
                x = 310 + k * 96
                svg.add(f'<rect x="{x}" y="{f(top + 40)}" width="60" height="64" fill="none" stroke="#8a8a92" stroke-width="2"/>')
                for j in range(4):
                    svg.add(f'<path d="M{x + 12 + j * 12},{f(top + 40)} v64" stroke="#8a8a92" stroke-width="1.4"/>')
    # pozzo centrale (ascensore)
    svg.add(f'<rect x="586" y="100" width="28" height="660" fill="#1a1a22" opacity="0.35"/>')
    # Newkama Land: livello nascosto tra 5 e 6
    svg.add(f'<path d="M950,612 h40 a28,28 0 0,1 0,56 h-40" fill="#f2a6c0" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<ellipse cx="930" cy="640" rx="130" ry="36" fill="#f6c6e0" stroke="{INK}" stroke-width="2.2"/>')
    svg.add(text(960, 668, "LV5.5 · Newkama Land", size=14, fill="#7a1a4a", weight="bold", halo="#f6c6e0", halo_w=3))
    for _ in range(30):
        x, y = rng.uniform(40, 220), rng.uniform(120, 780)
        svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rng.uniform(2, 5))}" fill="none" stroke="#bfe8ff" stroke-width="1" opacity="0.5"/>')
    svg.add(text(120, 400, "Calm Belt", size=18, fill="#bfe8ff", italic=True, rot=-90))
    head(svg, "Impel Down", "Grande prigione sottomarina · Great Underwater Prison", x=250, y=40, w=340, size=28)
    save(svg, "onepiece-impel-down.svg", P)
    return P


# =============================================================================
# 8. WATER SEVEN — la città-fontana, i Dock di Galley-La, Aqua Laguna
# =============================================================================
def water_seven() -> dict:
    W, H = 1200, 800
    rng = random.Random(1008)
    svg = Svg(W, H, "Water 7 · ウォーターセブン", CREDIT)
    P = {
        "loc-op-ws-iceburg-mansion": (600, 200),
        "loc-op-ws-galley-la": (470, 330),
        "loc-op-ws-dock1": (330, 470),
        "loc-op-ws-blue-station": (960, 380),
        "loc-op-ws-franky-house": (900, 640),
        "loc-op-ws-aqua-laguna": (300, 700),
    }
    pins = list(P.values())
    city = ellipse_pts(600, 400, 330, 260, 40)
    scrap = jagged(ellipse_pts(900, 650, 80, 40, 12), rng, 0.12, 2)
    op_sea(svg, rng, [city, scrap], top="#5fb0d8", bottom="#3a88bc")
    # Aqua Laguna: la grande marea che arriva da sud-ovest
    for k in range(4):
        svg.add(f'<path d="M0,{760 - k * 26} C150,{700 - k * 26} 300,{640 - k * 26} 470,{720 - k * 22}" fill="none" stroke="#ffffff" stroke-width="{6 - k}" opacity="{0.8 - k * 0.15:.2f}"/>')
    svg.add(f'<path d="M0,800 L0,740 C140,690 300,640 470,720 C520,750 550,780 560,800 Z" fill="#2a6a9a" opacity="0.6"/>')
    # piano della città a terrazze concentriche (Up Town in alto, Down Town in basso) con canali
    for k, (rx, ry, c) in enumerate(((330, 260, "#e6d8b8"), (250, 196, "#ecdfc2"), (170, 132, "#f2e6cc"), (90, 70, "#f6eedc"))):
        svg.add(f'<ellipse cx="600" cy="{400 - k * 30}" rx="{rx}" ry="{ry}" fill="{c}" stroke="{INK}" stroke-width="2.4"/>')
        if k < 3:
            svg.add(f'<ellipse cx="600" cy="{400 - k * 30}" rx="{rx - 14}" ry="{ry - 12}" fill="none" stroke="#5fb0d8" stroke-width="7"/>')
    for a in range(0, 360, 30):  # canali radiali
        ang = math.radians(a)
        svg.add(f'<path d="M{f(600 + 90 * math.cos(ang))},{f(330 + 70 * math.sin(ang))} L{f(600 + 320 * math.cos(ang))},{f(400 + 252 * math.sin(ang))}" stroke="#5fb0d8" stroke-width="6"/>')
    out = ["<g>"]
    for x, y in sorted(scatter(rng, 240, (280, 150, 920, 660), both(lambda x, y: ((x - 600) / 312) ** 2 + ((y - 400) / 244) ** 2 <= 1,
                                                                  far_from(pins, 22), lambda x, y: ((x - 600) / 96) ** 2 + ((y - 310) / 76) ** 2 > 1), mind=20),
                       key=lambda p: p[1]):
        out += house(x, y, rng.uniform(11, 16), rng.choice(["#fbf3e0", "#f4e6c8"]), rng.choice(["#c96e3e", "#3a8ac0", "#e8a84a", "#b5523b"]))
    out.append("</g>")
    svg.add(out)
    # fontana-spina centrale con la villa di Iceburg
    svg.add(f'<path d="M560,320 L580,160 L620,160 L640,320 Z" fill="#e6e2d6" stroke="{INK}" stroke-width="2"/>')
    for k in range(4):
        svg.add(f'<path d="M{586 - k * 12},{160 + k * 40} q-30,-10 -40,20" fill="none" stroke="#7fd0f0" stroke-width="4"/>')
        svg.add(f'<path d="M{614 + k * 12},{160 + k * 40} q30,-10 40,20" fill="none" stroke="#7fd0f0" stroke-width="4"/>')
    svg.add(house(600, 172, 46, "#f6f0e0", "#3a8ac0"))
    # Dock 1–7 di Galley-La lungo la costa
    for i, a in enumerate(range(140, 250, 16)):
        ang = math.radians(a)
        x, y = 600 + 335 * math.cos(ang), 400 + 262 * math.sin(ang)
        svg.add(f'<rect x="{f(x - 18)}" y="{f(y - 12)}" width="36" height="24" fill="#c9a46a" stroke="{INK}" stroke-width="1.4" transform="rotate({a - 90} {f(x)} {f(y)})"/>')
        svg.add(text(x - 30 * math.cos(ang), y - 30 * math.sin(ang) + 5, str(i + 1), size=13, fill="#4a2a10", weight="bold", halo="#f1e2bc", halo_w=3))
    svg.add(f'<rect x="440" y="300" width="60" height="34" fill="#e8d8a8" stroke="{INK}" stroke-width="1.8"/>')
    svg.add(text(470, 322, "GL", size=14, fill="#4a2a10", weight="bold"))
    # Blue Station e binari del Puffing Tom (sul mare)
    svg.add(f'<path d="M930,380 L1200,300" stroke="#5a4a3a" stroke-width="8"/><path d="M930,380 L1200,300" stroke="#c9a46a" stroke-width="4" stroke-dasharray="6 6"/>')
    svg.add(f'<path d="M930,384 L1200,520" stroke="#5a4a3a" stroke-width="8"/><path d="M930,384 L1200,520" stroke="#c9a46a" stroke-width="4" stroke-dasharray="6 6"/>')
    svg.add(f'<rect x="930" y="356" width="60" height="40" fill="#3a8ac0" stroke="{INK}" stroke-width="1.8"/>')
    # Scrap Island con la Franky House
    op_island(svg, scrap, "#a8a090", sw=2)
    for k in range(8):
        x, y = 860 + rng.uniform(0, 80), 640 + rng.uniform(-14, 18)
        svg.add(f'<rect x="{f(x)}" y="{f(y)}" width="10" height="6" fill="#6a5a4a" transform="rotate({rng.randint(0, 90)} {f(x)} {f(y)})"/>')
    svg.add(house(910, 650, 30, "#d8c8a8", "#c0392b"))
    svg.add(region_label(300, 640, "Aqua Laguna", size=15, color="#ffffff", halo="#1a4a7a"))
    head(svg, "Water 7", "La città dell'acqua · City of Water", x=220, y=56, w=340, size=32)
    rose(svg, 1130, 90, 36)
    save(svg, "onepiece-water-seven.svg", P)
    return P


# =============================================================================
# 9. THRILLER BARK — l'isola-nave di Gecko Moria
# =============================================================================
def thriller_bark() -> dict:
    W, H = 1200, 800
    rng = random.Random(1009)
    svg = Svg(W, H, "Thriller Bark · スリラーバーク", CREDIT)
    P = {
        "loc-op-tb-throne": (640, 150),
        "loc-op-tb-mast-mansion": (600, 300),
        "loc-op-tb-brook-room": (856, 300),
        "loc-op-tb-forest": (360, 420),
        "loc-op-tb-graveyard": (780, 480),
        "loc-op-tb-wonder-garden": (400, 560),
    }
    pins = list(P.values())
    g = svg.gradient("fog", [(0, "#2a2438"), (1, "#3a4a5a")])
    svg.add(f'<rect width="{W}" height="{H}" fill="{g}"/>')
    for i in range(12):
        svg.add(f'<path d="M{i * 110 - 20},{760 - (i % 3) * 8} q27,-10 55,0 t55,0" fill="none" stroke="#9ab0c0" stroke-width="2" opacity="0.4"/>')
    # scafo della nave che porta l'isola
    hull = [(130, 560), (240, 680), (600, 730), (960, 680), (1080, 560), (1060, 520), (140, 520)]
    svg.add(f'<path d="{smooth(hull)}" fill="#4a3424" stroke="{INK}" stroke-width="3"/>')
    for k in range(5):
        svg.add(f'<path d="M{200 + k * 10},{560 + k * 26} Q600,{620 + k * 30} {1000 - k * 10},{560 + k * 26}" fill="none" stroke="#2a1a10" stroke-width="2" opacity="0.6"/>')
    for x in (300, 900):  # ruote a pale
        svg.add(f'<circle cx="{x}" cy="640" r="44" fill="#3a2a1a" stroke="{INK}" stroke-width="2.4"/>')
        for k in range(8):
            a = k * math.pi / 4
            svg.add(f'<path d="M{x},640 l{f(44 * math.cos(a))},{f(44 * math.sin(a))}" stroke="#8a6a44" stroke-width="3"/>')
    # isola sul ponte
    deck = jagged([(170, 520), (240, 380), (380, 300), (600, 260), (820, 290), (980, 380), (1040, 520)], rng, 0.05, 3)
    svg.add(f'<path d="{smooth(deck)}" fill="#5a6a4a" stroke="{INK}" stroke-width="2.4"/>')
    svg.add(wood(svg, scatter(rng, 90, (180, 280, 1040, 540), both(lambda x, y: pip(x, y, deck), far_from(pins, 40),
                                                               lambda x, y: not (480 < x < 720 and y < 360)), mind=24), rng, r=11,
                 fill="#3a4a3a", dark="#1a221a", light="#5a6a5a", stroke="#0a120a", sw=0.8, kind="dead"))
    # cimitero: croci e lapidi
    for k in range(18):
        x, y = 720 + (k % 6) * 22 + rng.uniform(-4, 4), 460 + (k // 6) * 22
        svg.add(f'<path d="M{f(x)},{f(y)} v-14 M{f(x - 5)},{f(y - 10)} h10" stroke="#c9c2b0" stroke-width="2.4"/>')
    # giardino di Perona (cuori e ombrellini)
    for k in range(6):
        x, y = 360 + k * 18, 556 + (k % 2) * 10
        svg.add(f'<path d="M{x},{y} c-6,-8 -14,0 0,10 c14,-10 6,-18 0,-10 Z" fill="#e86aa0" stroke="{INK}" stroke-width="0.8"/>')
    # villa-maniero di Hogback e albero maestro con la sala del trono di Moria
    svg.add(castle(600, 330, 1.25, "#6a6a7a", "#3a2a4a", flag=None))
    svg.add(f'<path d="M640,320 V90" stroke="#3a2a1a" stroke-width="12"/>')
    svg.add(f'<path d="M560,140 Q640,110 720,140 L720,210 Q640,190 560,210 Z" fill="#cfc6b0" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M600,100 h80 l-10,-24 h-60 Z" fill="#5a4a6a" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<path d="M640,150 m-14,0 a14,14 0 1,0 28,0 a14,14 0 1,0 -28,0 M634,148 l-4,-4 M646,148 l4,-4" fill="#1d1d1d" stroke="#1d1d1d" stroke-width="1.4"/>')
    svg.add(house(856, 320, 40, "#7a7a8a", "#2a2a3a"))
    # nebbia del Triangolo Florian
    for _ in range(14):
        x, y = rng.uniform(0, W), rng.uniform(0, H)
        if all(math.hypot(x - a, y - b) > 80 for a, b in pins):
            svg.add(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(rng.uniform(80, 160))}" ry="{f(rng.uniform(18, 34))}" fill="#c9d6e0" opacity="0.18"/>')
    svg.add(text(1080, 760, "Florian Triangle", size=15, fill="#c9d6e0", italic=True))
    head(svg, "Thriller Bark", "La nave-isola di Gecko Moria · Moria's island-ship", x=230, y=56, w=380, size=30)
    save(svg, "onepiece-thriller-bark.svg", P)
    return P


# =============================================================================
# 10. ZOU — il ducato Mokomo sul dorso dell'elefante Zunesha
# =============================================================================
def zou() -> dict:
    W, H = 1200, 800
    rng = random.Random(1010)
    svg = Svg(W, H, "Zou · ゾウ", CREDIT)
    P = {
        "loc-op-zo-kurau": (600, 380),
        "loc-op-zo-whale-forest": (350, 300),
        "loc-op-zo-poneglyph": (300, 222),
        "loc-op-zo-spine": (620, 250),
        "loc-op-zo-guardians": (470, 500),
        "loc-op-zo-right-belly": (760, 540),
    }
    pins = list(P.values())
    op_sea(svg, rng, [ellipse_pts(600, 420, 470, 300, 30)], top="#6ab0d8", bottom="#3a80b4")
    # zampe nel mare (cerchi d'onda) e testa con proboscide verso destra
    for (x, y) in ((330, 700), (500, 730), (720, 730), (900, 700)):
        svg.add(f'<ellipse cx="{x}" cy="{y}" rx="70" ry="22" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.7"/>')
        svg.add(f'<ellipse cx="{x}" cy="{y - 6}" rx="46" ry="14" fill="#8a8a92" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M1080,392 C1130,400 1150,440 1130,500 C1110,560 1080,600 1100,660 C1110,710 1160,730 1170,770" fill="none" stroke="{INK}" stroke-width="44" stroke-linecap="round"/>')
    svg.add(f'<path d="M1080,392 C1130,400 1150,440 1130,500 C1110,560 1080,600 1100,660 C1110,710 1160,730 1170,770" fill="none" stroke="#9a9aa2" stroke-width="38" stroke-linecap="round"/>')
    for (cx_, cy_) in ((965, 240), (965, 545)):  # orecchie
        svg.add(f'<ellipse cx="{cx_}" cy="{cy_}" rx="70" ry="105" fill="#7e7e88" stroke="{INK}" stroke-width="2.4"/>')
        svg.add(f'<ellipse cx="{cx_ + 6}" cy="{cy_}" rx="44" ry="74" fill="#9a8a92" opacity="0.6"/>')
    svg.add(f'<ellipse cx="1010" cy="392" rx="84" ry="118" fill="#9a9aa2" stroke="{INK}" stroke-width="2.4"/>')
    svg.add(f'<circle cx="1040" cy="340" r="7" fill="{INK}"/><circle cx="1040" cy="444" r="7" fill="{INK}"/>')
    svg.add(f'<path d="M1070,360 q50,-6 70,-34 M1070,424 q50,6 70,34" fill="none" stroke="#f4f1ea" stroke-width="10" stroke-linecap="round"/>')
    # dorso: l'isola
    back = jagged([(150, 400), (230, 250), (420, 160), (650, 150), (860, 210), (980, 330), (980, 500), (860, 610), (620, 650), (380, 630), (200, 540)], rng, 0.04, 3)
    svg.add(f'<path d="{smooth(back)}" fill="#8a8a92" stroke="{INK}" stroke-width="3"/>')
    top = scale_pts(back, 0.9)
    svg.add(patch(top, "#9fcf7a", stroke=INK, sw=2))
    svg.add(jungle(svg, jagged([(220, 260), (420, 200), (470, 330), (330, 380), (220, 360)], rng, 0.08, 2), rng, 0.004, 11,
                   avoid=far_from(pins, 26), palette=("#3f8a3a", "#245a20", "#6fc060")))
    svg.add(jungle(svg, jagged([(640, 480), (860, 470), (900, 560), (720, 610), (620, 580)], rng, 0.08, 2), rng, 0.004, 11,
                   avoid=far_from(pins, 26), palette=("#3f8a3a", "#245a20", "#6fc060")))
    svg.add(jungle(svg, jagged([(400, 460), (540, 450), (550, 560), (420, 580)], rng, 0.08, 2), rng, 0.004, 10,
                   avoid=far_from(pins, 26), palette=("#4f9a4a", "#2c5a26", "#7fc070")))
    svg.add(big_tree(330, 250, 0.7, leaf="#2f7a3a", light="#6fc060"))  # l'Albero della Balena
    svg.add(f'<path d="M420,240 C520,226 700,226 860,300" fill="none" stroke="#6a6a72" stroke-width="10" stroke-dasharray="2 12" stroke-linecap="round"/>')
    svg.add(town(rng, 600, 390, 110, 60, 34, 15, ("#fff3d6", "#fde6c8"), ("#e8642a", "#f2a64a", "#c0392b"), ok=far_from(pins, 18)))
    svg.add(f'<rect x="276" y="214" width="48" height="30" fill="#c0392b" stroke="{INK}" stroke-width="1.6"/>')
    head(svg, "Zou", "Ducato Mokomo sul dorso di Zunesha · Mokomo Dukedom", x=230, y=56, w=380, size=34)
    rose(svg, 1130, 90, 36)
    save(svg, "onepiece-zou.svg", P)
    return P


# =============================================================================
# 11. PUNK HAZARD — metà fuoco, metà ghiaccio
# =============================================================================
def punk_hazard() -> dict:
    W, H = 1200, 800
    rng = random.Random(1011)
    svg = Svg(W, H, "Punk Hazard · パンクハザード", CREDIT)
    P = {
        "loc-op-ph-entrance": (600, 150),
        "loc-op-ph-lab": (600, 290),
        "loc-op-ph-biscuits-room": (600, 400),
        "loc-op-ph-ice": (330, 420),
        "loc-op-ph-fire": (870, 420),
        "loc-op-ph-gas-lake": (480, 610),
    }
    pins = list(P.values())
    land = jagged([(180, 360), (300, 200), (600, 130), (900, 200), (1030, 360), (980, 560), (780, 680), (600, 700), (420, 680), (220, 560)], rng, 0.06, 3)
    op_sea(svg, rng, [land], top="#5aa8d0", bottom="#2a6a9a")
    # due metà: ghiaccio a ovest, fuoco a est
    svg.add(f'<clipPath id="lh"><rect x="0" y="0" width="600" height="800"/></clipPath><clipPath id="rh"><rect x="600" y="0" width="600" height="800"/></clipPath>')
    svg.add(f'<g clip-path="url(#lh)"><path d="{smooth(land)}" fill="#e8f6fb" stroke="{INK}" stroke-width="3"/></g>')
    svg.add(f'<g clip-path="url(#rh)"><path d="{smooth(land)}" fill="#8a3a2a" stroke="{INK}" stroke-width="3"/></g>')
    svg.add(mountain_range(scatter(rng, 10, (220, 260, 560, 640), both(lambda x, y: pip(x, y, land), far_from(pins, 50)), mind=60), rng,
                           70, 70, fill="#cfe6f0", dark="#8ac0d8", snow="#ffffff", stroke=INK))
    for (x, y) in scatter(rng, 9, (640, 260, 1000, 640), both(lambda x, y: pip(x, y, land), far_from(pins, 50)), mind=70):
        svg.add(mountain(x, y, 80, 80, "#5a2a1a", "#3a1a10", None, INK))
        svg.add(f'<path d="M{f(x - 6)},{f(y - 80)} q6,-24 12,0 Z" fill="#ffb02a"/>')
        svg.add(f'<path d="M{f(x)},{f(y - 78)} q-8,30 -20,40 M{f(x)},{f(y - 78)} q10,30 18,46" fill="none" stroke="#ff6a2a" stroke-width="4"/>')
    for (x, y) in ((760, 560), (860, 300), (960, 480)):
        svg.add(f'<ellipse cx="{x}" cy="{y}" rx="44" ry="14" fill="#ff8a2a" stroke="#ffd23a" stroke-width="2"/>')
    # lago di gas velenoso (Shinokuni)
    svg.add(patch(jagged(ellipse_pts(480, 620, 110, 44, 12), rng, 0.1, 2), "#9a6ac0", stroke="#5a2a7a", sw=2, opacity=0.85))
    for k in range(5):
        svg.add(f'<circle cx="{430 + k * 25}" cy="{606 + (k % 2) * 10}" r="6" fill="#c9a8e8" opacity="0.7"/>')
    # laboratorio di Caesar (al centro, a cavallo dei due lati) + ingresso R
    svg.add(f'<rect x="510" y="250" width="180" height="170" fill="#e6e6ea" stroke="{INK}" stroke-width="2.4"/>')
    for i in range(4):
        svg.add(f'<rect x="{524 + i * 42}" y="268" width="30" height="40" fill="#8ac0d8" stroke="{INK}" stroke-width="1"/>')
    svg.add(f'<path d="M500,250 h200 l-20,-30 h-160 Z" fill="#5a6a82" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<rect x="560" y="380" width="80" height="40" fill="#f2e6c0" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<rect x="578" y="128" width="44" height="40" fill="#5a6a82" stroke="{INK}" stroke-width="2"/>')
    svg.add(text(600, 156, "R", size=22, fill="#ffffff", weight="bold"))
    svg.add(road([(600, 168), (600, 220)], 10, "#cfd2d8", "#5a6a82"))
    svg.add(region_label(300, 760, "Lato ghiaccio · Ice side", size=14, color="#e8f6fb", halo="#1a4a6a"))
    svg.add(region_label(900, 760, "Lato fuoco · Fire side", size=14, color="#ffd2a0", halo="#4a1a10"))
    head(svg, "Punk Hazard", "L'isola fuoco-ghiaccio · Fire & Ice island", x=220, y=56, w=360, size=30)
    rose(svg, 1130, 90, 36)
    save(svg, "onepiece-punk-hazard.svg", P)
    return P


# =============================================================================
# 12. AMAZON LILY — isola delle Kuja nella Calm Belt
# =============================================================================
def amazon_lily() -> dict:
    W, H = 1200, 800
    rng = random.Random(1012)
    svg = Svg(W, H, "Amazon Lily · アマゾン・リリー", CREDIT)
    P = {
        "loc-op-am-castle": (600, 266),
        "loc-op-am-arena": (420, 420),
        "loc-op-am-bath": (790, 400),
        "loc-op-am-village": (520, 540),
        "loc-op-am-forest": (820, 590),
    }
    pins = list(P.values())
    land = jagged([(200, 400), (300, 220), (520, 130), (760, 150), (960, 270), (1010, 450), (930, 620), (720, 710), (480, 710), (280, 620)], rng, 0.05, 3)
    op_sea(svg, rng, [land], top="#4aa0c8", bottom="#2a6a98")
    op_island(svg, land, "#7fb85a", beach=None)
    # corona di rupi a punte che cinge l'isola
    ringp = scale_pts(land, 0.97)
    for i in range(0, len(ringp), 2):
        x, y = ringp[i]
        svg.add(f'<path d="M{f(x - 16)},{f(y + 10)} L{f(x)},{f(y - 34)} L{f(x + 16)},{f(y + 10)} Z" fill="#9a8a72" stroke="{INK}" stroke-width="1.6"/>')
    inner = scale_pts(land, 0.86)
    svg.add(jungle(svg, inner, rng, 0.0022, 11, avoid=far_from(pins + [(600, 300)], 60), palette=("#2f8a3a", "#1a5a22", "#5ac060")))
    # roccia centrale con il castello Kuja (serpenti)
    svg.add(mesa_like(600, 330, 90, 120))
    svg.add(castle(600, 214, 0.95, "#f4e6d8", "#c0392b", flag="#7a3a8a"))
    svg.add(f'<path d="M520,230 q-30,-40 0,-70 q20,-14 30,6" fill="none" stroke="#7a3a8a" stroke-width="7" stroke-linecap="round"/>')
    svg.add(f'<path d="M680,230 q30,-40 0,-70 q-20,-14 -30,6" fill="none" stroke="#7a3a8a" stroke-width="7" stroke-linecap="round"/>')
    svg.add(arena(420, 430, 60, 34, "#d8c8a8", "#c9a87a"))
    svg.add(f'<ellipse cx="790" cy="414" rx="52" ry="22" fill="#9fdcef" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(house(790, 402, 26, "#f6e6f0", "#e86aa0"))
    svg.add(town(rng, 520, 550, 80, 36, 18, 14, ("#fbe9f0", "#fff3d6"), ("#e86aa0", "#7a3a8a", "#f2a64a")))
    for (x, y) in ((140, 160), (1080, 680), (1080, 160), (130, 700)):  # Re del Mare
        svg.add(f'<path d="M{x - 40},{y} q20,-40 40,0 t40,0" fill="none" stroke="#5a8a6a" stroke-width="12" stroke-linecap="round"/>')
        svg.add(f'<circle cx="{x + 40}" cy="{y}" r="5" fill="#ffffff"/>')
    svg.add(text(1070, 600, "Calm Belt", size=16, fill="#e8f6fb", italic=True, halo="#2a6a98", halo_w=4))
    head(svg, "Amazon Lily", "Isola delle donne · Isle of Women", x=220, y=56, w=340, size=32)
    rose(svg, 1130, 90, 36)
    save(svg, "onepiece-amazon-lily.svg", P)
    return P


def mesa_like(x, y, rx, h, top="#a8987a", side="#7a6a52") -> list[str]:
    ry = rx * 0.4
    return [f'<path d="M{f(x - rx)},{f(y - h)} L{f(x - rx * 1.2)},{f(y)} A{f(rx * 1.2)},{f(ry * 1.2)} 0 0,0 {f(x + rx * 1.2)},{f(y)} L{f(x + rx)},{f(y - h)} Z" fill="{side}" stroke="{INK}" stroke-width="2"/>',
            f'<ellipse cx="{f(x)}" cy="{f(y - h)}" rx="{f(rx)}" ry="{f(ry)}" fill="{top}" stroke="{INK}" stroke-width="2"/>']


# =============================================================================
# 13. DRUM ISLAND (Regno di Sakura) — montagne cilindriche, castello sulla più alta
# =============================================================================
def drum() -> dict:
    W, H = 1200, 800
    rng = random.Random(1013)
    svg = Svg(W, H, "Drum Island · Sakura Kingdom · ドラム島", CREDIT)
    P = {
        "loc-op-dm-castle": (600, 150),
        "loc-op-dm-rockies": (720, 330),
        "loc-op-dm-bighorn": (330, 470),
        "loc-op-dm-cocoa-weed": (830, 520),
        "loc-op-dm-gyasta": (680, 640),
        "loc-op-dm-robelle": (300, 640),
    }
    pins = list(P.values())
    land = jagged([(170, 430), (260, 270), (450, 190), (700, 180), (930, 260), (1040, 420), (980, 600), (780, 710), (520, 720), (300, 660)], rng, 0.06, 3)
    op_sea(svg, rng, [land], top="#7ab4d6", bottom="#4a84b0")
    op_island(svg, land, "#f4f8fb", beach="#e6eef4")  # isola invernale
    svg.add(dots(rng, (170, 180, 1040, 720), 300, "#a8c0d0", (0.8, 2), lambda x, y: pip(x, y, land)))
    # Drum Rockies: picchi cilindrici (la più alta al centro con il castello)
    rocks = [(600, 360, 70, 230), (470, 330, 46, 120), (740, 380, 50, 120), (860, 360, 40, 90), (380, 380, 36, 80), (560, 470, 40, 80), (690, 470, 36, 70)]
    for x, y, rx, h in sorted(rocks, key=lambda r: r[1]):
        ry = rx * 0.35
        svg.add(f'<path d="M{x - rx},{y - h} V{y} A{rx},{ry} 0 0,0 {x + rx},{y} V{y - h}" fill="#9aa8b8" stroke="{INK}" stroke-width="2"/>')
        svg.add(f'<path d="M{x + rx * 0.3},{y - h} V{y + ry * 0.8} M{x - rx * 0.5},{y - h} V{y + ry * 0.7}" stroke="#7a8898" stroke-width="3" opacity="0.6"/>')
        svg.add(f'<ellipse cx="{x}" cy="{y - h}" rx="{rx}" ry="{ry}" fill="#ffffff" stroke="{INK}" stroke-width="2"/>')
    svg.add(castle(600, 140, 0.8, "#f0e6d8", "#4a6a9a", flag="#e86aa0"))
    # funivia dal castello a valle
    svg.add(f'<path d="M640,140 L930,250" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<rect x="772" y="186" width="14" height="10" fill="#c0392b" stroke="{INK}" stroke-width="1"/>')
    # pini innevati, villaggi
    svg.add(trees(scatter(rng, 120, (180, 200, 1040, 720), both(lambda x, y: pip(x, y, scale_pts(land, 0.95)), far_from(pins, 30),
                                                          lambda x, y: all((x - a) ** 2 + ((y - b) * 2) ** 2 > (r + 20) ** 2 for a, b, r, _ in rocks)), mind=22),
                  rng, r=8, kind="pine", fill="#3f6a5a", dark="#2a4a3a", stroke="#1a2a22", sw=0.8))
    for (x, y) in ((330, 480), (830, 530), (680, 650)):
        svg.add(town(rng, x, y, 50, 22, 9, 15, ("#f6f0e0",), ("#e6eef4",)))
    svg.add(f'<ellipse cx="740" cy="660" rx="60" ry="22" fill="#cfe6f0" stroke="#7aa0c0" stroke-width="2"/>')
    for (x, y) in ((280, 650), (320, 640), (300, 660)):
        svg.add(f'<path d="M{x - 10},{y} v-12 l6,-4 l6,6 l8,-6 v16 Z" fill="#a8a092" stroke="{INK}" stroke-width="1"/>')
    head(svg, "Drum Island", "Regno di Sakura · Sakura Kingdom", x=220, y=56, w=340, size=32)
    rose(svg, 1130, 90, 36)
    save(svg, "onepiece-drum-island.svg", P)
    return P


# =============================================================================
# 14. MARIJOA — sulla cima della Red Line, il Red Port alla base
# =============================================================================
def mary_geoise() -> dict:
    W, H = 1200, 800
    rng = random.Random(1014)
    svg = Svg(W, H, "Mary Geoise · マリージョア", CREDIT)
    P = {
        "loc-op-mg-empty-throne": (600, 170),
        "loc-op-mg-pangea": (600, 270),
        "loc-op-mg-national-treasure": (380, 210),
        "loc-op-mg-reverie-hall": (420, 360),
        "loc-op-mg-slaves": (800, 400),
        "loc-op-mg-red-port": (600, 700),
    }
    svg.add(f'<rect width="{W}" height="{H}" fill="#9acbe6"/>')
    # la Red Line: altopiano rosso con pareti verticali, mare in basso
    svg.add(f'<path d="M0,0 H1200 V520 C1000,540 800,500 600,530 C400,560 200,520 0,540 Z" fill="#c0392b" stroke="{INK}" stroke-width="3"/>')
    for k in range(10):
        y = 470 + k * 6
        svg.add(f'<path d="M0,{y} C300,{y - 20} 900,{y + 20} 1200,{y}" fill="none" stroke="#8a2018" stroke-width="2" opacity="0.4"/>')
    svg.add(f'<path d="M0,540 C200,520 400,560 600,530 C800,500 1000,540 1200,520 V640 H0 Z" fill="#8a2018" stroke="{INK}" stroke-width="2"/>')
    for i in range(30):
        x = i * 42 + rng.uniform(-6, 6)
        svg.add(f'<path d="M{f(x)},{f(530 + rng.uniform(-14, 10))} v{f(rng.uniform(60, 100))}" stroke="#5a140e" stroke-width="2" opacity="0.6"/>')
    op_sea_band = scatter(rng, 50, (0, 650, W, H), None, mind=36)
    svg.add(f'<rect x="0" y="640" width="{W}" height="160" fill="#4a9cc9"/>')
    for x, y in op_sea_band:
        svg.add(f'<path d="M{f(x - 14)},{f(y)} q7,-6 14,0 t14,0" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.6"/>')
    # cima: giardini e città dei Draghi Celesti
    top = [(80, 80), (1120, 80), (1120, 470), (80, 470)]
    svg.add(f'<rect x="80" y="90" width="1040" height="380" rx="30" fill="#a8d07c" stroke="{INK}" stroke-width="2.4"/>')
    for i in range(6):
        svg.add(f'<path d="M{160 + i * 170},100 v360" stroke="#f4f1ea" stroke-width="8" opacity="0.5"/>')
    svg.add(trees(scatter(rng, 80, (100, 110, 1100, 450), far_from(list(P.values()) + [(600, 230)], 70), mind=30), rng, r=9,
                  fill="#3f8a3a", dark="#245a20", light="#6fc060"))
    # Castello di Pangea con il Trono Vuoto
    svg.add(f'<rect x="470" y="200" width="260" height="90" fill="#f4f1ea" stroke="{INK}" stroke-width="2.4"/>')
    for i in range(8):
        svg.add(f'<rect x="{486 + i * 30}" y="220" width="16" height="50" rx="7" fill="#c9b48a" stroke="{INK}" stroke-width="0.8"/>')
    svg.add(f'<path d="M460,200 L600,120 L740,200 Z" fill="#d9a84a" stroke="{INK}" stroke-width="2.4"/>')
    for x in (470, 730):
        svg.add(tower(x, 290, 30, 110, "#f4f1ea", "#d9a84a"))
    svg.add(f'<path d="M588,190 v-24 h24 v24 Z M584,166 h32" fill="#a8742a" stroke="{INK}" stroke-width="1.4"/>')
    for k in range(20):  # spade attorno al trono
        a = math.pi + k * math.pi / 19
        svg.add(f'<path d="M{f(600 + 40 * math.cos(a))},{f(186 + 18 * math.sin(a))} v-14" stroke="#8a8a92" stroke-width="1.4"/>')
    svg.add(house(380, 226, 40, "#f4f1ea", "#d9a84a"))
    svg.add(f'<rect x="360" y="330" width="120" height="50" fill="#f4f1ea" stroke="{INK}" stroke-width="2"/>')
    svg.add(dome(420, 330, 40, "#e6e2d6", INK))
    for i in range(5):
        svg.add(house(760 + i * 20, 420 - (i % 2) * 10, 18, "#c9b8a0", "#6a5a4a"))
    # Red Port alla base + Bondola (funivia verticale) + la scala
    svg.add(f'<rect x="520" y="660" width="160" height="40" fill="#f4f1ea" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M600,470 V660" stroke="{INK}" stroke-width="2.4"/><path d="M612,470 V660" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<rect x="592" y="560" width="28" height="22" rx="4" fill="#f2c84a" stroke="{INK}" stroke-width="1.4"/>')
    for (x, y) in ((420, 720), (780, 730), (960, 700)):
        svg.add(ship(x, y, 0.9, sail="#ffffff", flag="#3a5a9a"))
    svg.add(text(1040, 560, "Red Line", size=26, fill="#ffffff", weight="bold", spacing=4, halo="#5a140e", halo_w=4))
    head(svg, "Mary Geoise", "Terra Santa · Holy Land", x=220, y=46, w=320, size=32)
    rose(svg, 1140, 140, 34)
    save(svg, "onepiece-mary-geoise.svg", P)
    return P


# =============================================================================
# 15. DAWN ISLAND — Foosha, Monte Colubo, Regno di Goa e Gray Terminal
# =============================================================================
def dawn() -> dict:
    W, H = 1200, 800
    rng = random.Random(1015)
    svg = Svg(W, H, "Dawn Island · ドーン島", CREDIT)
    P = {
        "loc-op-dw-foosha": (250, 540),
        "loc-op-dw-colubo": (500, 330),
        "loc-op-dw-gray-terminal": (700, 520),
        "loc-op-dw-edge-town": (860, 420),
        "loc-op-dw-goa": (940, 300),
    }
    pins = list(P.values())
    land = jagged([(150, 420), (240, 240), (430, 160), (700, 150), (960, 170), (1080, 300), (1060, 480), (920, 640), (700, 700), (440, 690), (220, 620)], rng, 0.06, 3)
    op_sea(svg, rng, [land])
    op_island(svg, land, "#a5d07c")
    # Monte Colubo: foresta e montagna (banditi di Dadan)
    svg.add(mountain_range([(430, 300), (520, 260), (580, 320), (470, 360)], rng, 90, 90, fill="#8a9a6a", dark="#5a6a4a", snow=None, stroke=INK))
    svg.add(jungle(svg, jagged([(260, 260), (480, 200), (640, 260), (620, 430), (420, 470), (260, 420)], rng, 0.06, 2), rng, 0.004, 11,
                   avoid=far_from(pins + [(500, 300)], 50), palette=("#3f8a3a", "#245a20", "#6fc060")))
    svg.add(house(470, 360, 26, "#c9a46a", "#7a4a2a"))
    # Foosha: villaggio di pescatori sulla costa, con il Partys Bar e il mulino
    svg.add(town(rng, 250, 560, 60, 28, 12, 15, ("#fff3d6",), ("#e07a4a", "#c0392b", "#3a8ac0")))
    svg.add(f'<path d="M200,520 l-24,-20 M200,520 l24,-20 M200,520 l-24,20 M200,520 l24,20" stroke="{INK}" stroke-width="4"/>')
    svg.add(f'<circle cx="200" cy="520" r="5" fill="#8a5a2a" stroke="{INK}" stroke-width="1"/>')
    svg.add(f'<path d="M150,600 l40,20" stroke="#8a6a44" stroke-width="7"/>')
    svg.add(ship(130, 650, 0.9, flag="#3a5a9a"))
    # Regno di Goa: Città Alta murata, Città di Confine, e fuori le mura il Gray Terminal
    for r, c in ((150, "#d8cfb8"), (100, "#e6dcc4"), (56, "#f4ecd8")):
        svg.add(f'<ellipse cx="940" cy="330" rx="{r}" ry="{r * 0.72}" fill="{c}" stroke="{INK}" stroke-width="3"/>')
    svg.add(town(rng, 940, 330, 140, 100, 40, 14, ("#fbf3e0",), ("#3a5aa0", "#c0392b", "#d9a84a"), ok=far_from(pins, 20)))
    svg.add(castle(940, 312, 0.6, "#f4ecd8", "#3a5aa0"))
    svg.add(patch(jagged(ellipse_pts(700, 530, 110, 60, 12), rng, 0.12, 2), "#8a7a62", stroke=INK, sw=1.8))
    for _ in range(40):
        x, y = 700 + rng.uniform(-90, 90), 530 + rng.uniform(-45, 45)
        svg.add(f'<rect x="{f(x)}" y="{f(y)}" width="{f(rng.uniform(5, 12))}" height="{f(rng.uniform(3, 7))}" fill="{rng.choice(["#5a4a3a", "#6a6a6a", "#7a5a3a"])}" transform="rotate({rng.randint(0, 90)} {f(x)} {f(y)})"/>')
    svg.add(f'<path d="M640,500 q10,-30 20,0 M720,490 q10,-30 20,0" fill="none" stroke="#9a9a9a" stroke-width="5" opacity="0.6"/>')
    svg.add(road([(250, 540), (470, 470), (700, 520), (830, 430)], 7, "#efe0b4", "#8a7550"))
    svg.add(region_label(500, 210, "Mt. Colubo", size=14, color="#1f3418", halo="#c9e0a0"))
    head(svg, "Dawn Island", "East Blue · Regno di Goa / Goa Kingdom", x=220, y=56, w=340, size=32)
    rose(svg, 1130, 90, 36)
    save(svg, "onepiece-dawn-island.svg", P)
    return P


# =============================================================================
# 16. LOGUETOWN — la città dell'inizio e della fine
# =============================================================================
def loguetown() -> dict:
    W, H = 1200, 800
    rng = random.Random(1016)
    svg = Svg(W, H, "Loguetown · ローグタウン", CREDIT)
    P = {
        "loc-op-lt-scaffold": (600, 300),
        "loc-op-lt-main-street": (470, 420),
        "loc-op-lt-sword-shop": (340, 350),
        "loc-op-lt-port": (780, 570),
        "loc-op-lt-lighthouse": (930, 220),
    }
    pins = list(P.values())
    land = jagged([(100, 200), (300, 120), (600, 110), (860, 140), (980, 200), (930, 330), (860, 440), (900, 560), (760, 640), (520, 680), (260, 640), (110, 500)], rng, 0.04, 3)
    op_sea(svg, rng, [land])
    op_island(svg, land, "#c9d8a0")
    # griglia di strade e isolati
    for i in range(7):
        svg.add(f'<path d="M{220 + i * 100},160 L{200 + i * 100},640" stroke="#efe6cc" stroke-width="10"/>')
    for j in range(5):
        svg.add(f'<path d="M140,{220 + j * 100} L880,{200 + j * 100}" stroke="#efe6cc" stroke-width="10"/>')
    svg.add(road([(180, 430), (480, 420), (780, 410)], 18, "#f4ecd2", "#8a7550"))
    out = ["<g>"]
    for x, y in sorted(scatter(rng, 230, (140, 150, 900, 660), both(lambda x, y: pip(x, y, scale_pts(land, 0.92)), far_from(pins, 26),
                                                                lambda x, y: (x - 600) ** 2 + ((y - 300) * 1.4) ** 2 > 90 ** 2), mind=19),
                       key=lambda p: p[1]):
        out += house(x, y, rng.uniform(12, 17), rng.choice(["#fbf3e0", "#f4e6c8", "#efe2c4"]), rng.choice(["#b5523b", "#c96e3e", "#7a6a5a", "#3a6a9a"]))
    out.append("</g>")
    svg.add(out)
    # piazza con il patibolo dove fu giustiziato Roger
    svg.add(f'<ellipse cx="600" cy="320" rx="90" ry="54" fill="#e6dcc4" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<rect x="570" y="300" width="60" height="22" fill="#8a6a44" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<path d="M578,300 v-44 M622,300 v-44 M572,256 h56" stroke="#5a3a1a" stroke-width="5"/>')
    svg.add(f'<rect x="324" y="336" width="34" height="22" fill="#e8d8b8" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<path d="M330,334 l20,-16 M336,338 l20,-16" stroke="#8a8a92" stroke-width="2"/>')
    # porto e faro
    for i in range(4):
        svg.add(f'<rect x="{730 + i * 40}" y="600" width="12" height="70" fill="#8a6a44" stroke="{INK}" stroke-width="1.2"/>')
    for (x, y) in ((760, 720), (860, 700)):
        svg.add(ship(x, y, 0.9))
    svg.add(f'<path d="M920,240 L928,170 L940,170 L948,240 Z" fill="#ffffff" stroke="{INK}" stroke-width="1.8"/>')
    for k in range(3):
        svg.add(f'<rect x="{922 + k * 0.5}" y="{186 + k * 18}" width="{24 - k}" height="6" fill="#c0392b"/>')
    svg.add(f'<path d="M934,166 l-60,-30 l0,20 Z M934,166 l60,-30 l0,20 Z" fill="#fff6a8" opacity="0.5"/>')
    head(svg, "Loguetown", "La città dell'inizio e della fine · Town of Beginnings and Ends", x=600, y=760, w=420, size=30)
    rose(svg, 1130, 90, 36)
    save(svg, "onepiece-loguetown.svg", P)
    return P


# =============================================================================
# 17. OHARA — l'Albero della Conoscenza
# =============================================================================
def ohara() -> dict:
    W, H = 1200, 800
    rng = random.Random(1017)
    svg = Svg(W, H, "Ohara · オハラ", CREDIT)
    P = {
        "loc-op-oh-tree": (600, 330),
        "loc-op-oh-olvia-lab": (430, 220),
        "loc-op-oh-archaeology": (800, 380),
        "loc-op-oh-harbor": (330, 540),
        "loc-op-oh-lake": (620, 580),
    }
    pins = list(P.values())
    land = jagged([(200, 400), (280, 240), (480, 160), (720, 160), (920, 240), (1000, 400), (920, 560), (720, 660), (480, 660), (280, 580)], rng, 0.06, 3)
    op_sea(svg, rng, [land])
    op_island(svg, land, "#a5d07c")
    svg.add(jungle(svg, scale_pts(land, 0.9), rng, 0.0016, 10, avoid=far_from(pins + [(600, 260)], 90)))
    svg.add(patch(jagged(ellipse_pts(620, 590, 90, 40, 12), rng, 0.08, 2), "#8fd0e8", stroke="#3e7f9c", sw=2))
    # l'Albero della Conoscenza: biblioteca nel tronco
    svg.add(big_tree(600, 380, 1.9, trunk="#8a5a32", leaf="#4f9a3a", dark="#2c5a22", light="#86c060"))
    for k in range(4):
        svg.add(f'<rect x="{588}" y="{300 + k * 18}" width="24" height="10" rx="3" fill="#f4e6b8" stroke="{INK}" stroke-width="0.8"/>')
    svg.add(house(430, 236, 30, "#f4e6c8", "#8a5a3a"))
    svg.add(town(rng, 800, 390, 60, 30, 10, 15, ("#fff3d6",), ("#3a8ac0", "#c96e3e")))
    for i in range(3):
        svg.add(f'<rect x="{280 + i * 34}" y="560" width="10" height="56" fill="#8a6a44" stroke="{INK}" stroke-width="1.2"/>')
    svg.add(ship(240, 650, 0.9, flag="#3a5a9a"))
    svg.add(text(1080, 700, "West Blue", size=16, fill="#ffffff", italic=True, halo="#3a88bc", halo_w=4))
    head(svg, "Ohara", "L'isola degli archeologi · Island of Archaeologists", x=600, y=744, w=360, size=34)
    rose(svg, 1130, 90, 36)
    save(svg, "onepiece-ohara.svg", P)
    return P


# =============================================================================
# 18. ELBAF — la terra dei giganti e l'albero sacro
# =============================================================================
def elbaf() -> dict:
    W, H = 1200, 800
    rng = random.Random(1018)
    svg = Svg(W, H, "Elbaf · エルバフ", CREDIT)
    P = {
        "loc-op-eb-sacred-tree": (380, 300),
        "loc-op-eb-village": (620, 330),
        "loc-op-eb-hall": (840, 290),
        "loc-op-eb-dueling-ground": (780, 500),
        "loc-op-eb-forge": (470, 560),
    }
    pins = list(P.values())
    land = jagged([(140, 380), (220, 200), (420, 110), (700, 120), (960, 200), (1060, 380), (1000, 560), (800, 680), (520, 700), (260, 620)], rng, 0.07, 3)
    op_sea(svg, rng, [land], top="#6aa8cc", bottom="#3a78a8")
    op_island(svg, land, "#9cc87a")
    # fiordi
    for (a, b) in (((1000, 520), (880, 470)), ((260, 600), (360, 530)), ((700, 120), (690, 220))):
        svg.add(f'<path d="M{a[0]},{a[1]} Q{(a[0] + b[0]) / 2 + 20},{(a[1] + b[1]) / 2} {b[0]},{b[1]}" stroke="#6aa8cc" stroke-width="18" stroke-linecap="round"/>')
    svg.add(mountain_range(scatter(rng, 9, (700, 150, 1000, 260), far_from(pins, 60), mind=60), rng, 90, 90, fill="#9aa0a4", dark="#6a7074", snow="#ffffff", stroke=INK))
    svg.add(jungle(svg, scale_pts(land, 0.9), rng, 0.0012, 11, avoid=far_from(pins + [(380, 200)], 80), palette=("#3f7a3a", "#244a20", "#6fa060"), kind="pine"))
    # l'albero sacro, gigantesco
    svg.add(big_tree(380, 330, 1.7, trunk="#6a4a2a", leaf="#3f7a34", dark="#24461e", light="#6fb04e"))
    # villaggio dei giganti (case enormi, in scala) e sala dei guerrieri
    for (x, y) in ((560, 330), (620, 350), (680, 320), (600, 300), (660, 290)):
        svg.add(house(x, y, 46, "#d8c8a8", "#7a4a2a"))
    svg.add(f'<path d="M780,300 h120 v-46 l-60,-34 l-60,34 Z" fill="#c9a46a" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M776,254 l64,-38 l64,38" fill="none" stroke="#7a4a2a" stroke-width="6"/>')
    svg.add(arena(780, 510, 74, 40, "#c9b08a", "#b8a070"))
    svg.add(f'<rect x="440" y="540" width="60" height="34" fill="#6a6a72" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<path d="M490,540 v-30" stroke="#5a5a62" stroke-width="10"/><circle cx="490" cy="502" r="10" fill="#d0d0d0" opacity="0.6"/>')
    for (x, y) in ((140, 700), (1080, 690)):
        svg.add(ship(x, y, 1.3, sail="#e8dcc0", flag="#7a2a1a"))
    head(svg, "Elbaf", "Terra dei giganti · Land of Giants", x=600, y=748, w=340, size=34)
    rose(svg, 1130, 90, 36)
    save(svg, "onepiece-elbaf.svg", P)
    return P


# =============================================================================
# 19. GOD VALLEY — l'isola scomparsa (38 anni prima)
# =============================================================================
def god_valley() -> dict:
    W, H = 1200, 800
    rng = random.Random(1019)
    svg = Svg(W, H, "God Valley · ゴッドバレー", CREDIT)
    P = {
        "loc-op-gv-hunt": (600, 330),
        "loc-op-gv-village": (360, 470),
        "loc-op-gv-landing": (840, 470),
        "loc-op-gv-forest": (600, 590),
    }
    pins = list(P.values())
    land = jagged([(200, 400), (300, 220), (520, 150), (760, 160), (940, 260), (1000, 420), (920, 600), (700, 690), (460, 690), (270, 590)], rng, 0.06, 3)
    op_sea(svg, rng, [land], top="#7ab8d8", bottom="#4a88b8")
    op_island(svg, land, "#b8d88a")
    svg.add(jungle(svg, scale_pts(land, 0.9), rng, 0.0022, 11, avoid=far_from(pins + [(600, 320)], 80)))
    # terreno di caccia dei Draghi Celesti: arena all'aperto recintata
    svg.add(f'<ellipse cx="600" cy="330" rx="150" ry="80" fill="#e6d8a8" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<ellipse cx="600" cy="330" rx="150" ry="80" fill="none" stroke="#8a6a44" stroke-width="4" stroke-dasharray="4 8"/>')
    for (x, y) in ((560, 300), (650, 350), (600, 360)):
        svg.add(f'<path d="M{x},{y} l-8,-14 M{x},{y} l8,-14 M{x - 10},{y - 8} h20" stroke="#8a2a1a" stroke-width="2"/>')
    svg.add(f'<rect x="560" y="236" width="80" height="22" fill="#f4f1ea" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(town(rng, 360, 480, 60, 30, 10, 15, ("#e6d8b8",), ("#8a6a44", "#a8843a")))
    for (x, y, fl) in ((900, 520, "#1d1d1d"), (950, 470, "#ffffff")):
        svg.add(ship(x, y, 1.0, flag=fl))
    svg.add(text(600, 760, "Cancellata dalle mappe · Erased from the maps", size=16, fill="#ffffff", italic=True, halo="#2a5a88", halo_w=4))
    head(svg, "God Valley", "38 anni fa · 38 years ago", x=220, y=56, w=320, size=34)
    rose(svg, 1130, 90, 36)
    save(svg, "onepiece-god-valley.svg", P)
    return P


# =============================================================================
# 20. REGNO DI GERMA — una nazione su lumache-nave giganti
# =============================================================================
def germa() -> dict:
    W, H = 1200, 800
    rng = random.Random(1020)
    svg = Svg(W, H, "Germa Kingdom · ジェルマ王国", CREDIT)
    P = {
        "loc-op-gk-sora": (600, 190),
        "loc-op-gk-castle": (600, 300),
        "loc-op-gk-snail-ships": (330, 430),
        "loc-op-gk-lab": (860, 470),
        "loc-op-gk-barracks": (480, 590),
    }
    op_sea(svg, rng, [], top="#5aa0c8", bottom="#2a6a98", n=220)
    def snail(x, y, s, deck: str | None = None):
        out = [f'<g stroke="{INK}" stroke-width="2" stroke-linejoin="round">',
               f'<path d="M{f(x - 120 * s)},{f(y + 20 * s)} q{f(-30 * s)},{f(-10 * s)} {f(-40 * s)},{f(-40 * s)} q{f(10 * s)},{f(-10 * s)} {f(20 * s)},{f(0)} L{f(x + 130 * s)},{f(y + 20 * s)} Z" fill="#c9a8a0"/>',
               f'<circle cx="{f(x)}" cy="{f(y - 20 * s)}" r="{f(80 * s)}" fill="#8a5a3a"/>']
        for k in range(3):
            out.append(f'<circle cx="{f(x)}" cy="{f(y - 20 * s)}" r="{f((60 - k * 20) * s)}" fill="none" stroke="#5a3a1a" stroke-width="2"/>')
        out.append(f'<path d="M{f(x - 150 * s)},{f(y - 14 * s)} l{f(-10 * s)},{f(-24 * s)} M{f(x - 140 * s)},{f(y - 14 * s)} l{f(4 * s)},{f(-24 * s)}" fill="none"/>')
        out.append("</g>")
        return out
    for (x, y, s) in ((330, 470, 0.9), (860, 510, 0.9), (480, 640, 0.8), (780, 690, 0.6), (170, 650, 0.55), (1040, 330, 0.6)):
        svg.add(snail(x, y, s))
    svg.add(snail(600, 360, 1.5))
    # castello dei Vinsmoke sulla lumaca ammiraglia
    svg.add(castle(600, 300, 1.0, "#e6e6ea", "#3a6a4a", flag="#3a6a4a"))
    svg.add(f'<rect x="572" y="170" width="56" height="30" fill="#f6eef2" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<rect x="830" y="430" width="60" height="40" fill="#e6e6ea" stroke="{INK}" stroke-width="1.6"/>')
    for k in range(3):
        svg.add(f'<rect x="{838 + k * 16}" y="440" width="10" height="20" rx="4" fill="#7fd0b0" stroke="{INK}" stroke-width="0.8"/>')
    for k in range(4):
        svg.add(f'<rect x="{450 + k * 18}" y="570" width="14" height="22" fill="#5a6a5a" stroke="{INK}" stroke-width="1"/>')
    svg.add(text(600, 760, "Germa 66 · North Blue", size=16, fill="#ffffff", italic=True, halo="#2a6a98", halo_w=4))
    head(svg, "Germa Kingdom", "Il regno senza terra · The landless kingdom", x=220, y=56, w=360, size=30)
    rose(svg, 1130, 90, 36)
    save(svg, "onepiece-germa-kingdom.svg", P)
    return P


# =============================================================================
# 21. SPAZIO — la Luna, Birka, la Stella Polare
# =============================================================================
def space() -> dict:
    W, H = 1200, 800
    rng = random.Random(1021)
    svg = Svg(W, H, "Space · 宇宙", CREDIT)
    P = {
        "loc-op-space-terra": (600, 700),
        "loc-op-space-luna": (470, 380),
        "loc-op-space-birka": (770, 400),
        "loc-op-space-polar-star": (440, 150),
        "loc-op-space-pirates": (900, 180),
    }
    svg.add(f'<rect width="{W}" height="{H}" fill="#0a0d1e"/>')
    svg.add(dots(rng, (0, 0, W, H), 500, "#ffffff", (0.5, 1.6), None, (0.3, 0.9)))
    # la Terra in basso, con la Red Line e la Grand Line
    svg.add(f'<circle cx="600" cy="1300" r="640" fill="#2a6aa8" stroke="#8ac8f0" stroke-width="6"/>')
    svg.add(f'<path d="M0,760 Q600,640 1200,760" fill="none" stroke="#5aa0d8" stroke-width="10" opacity="0.6"/>')
    svg.add(f'<path d="M560,668 Q600,740 620,800" fill="none" stroke="#c0392b" stroke-width="16"/>')
    svg.add(f'<path d="M200,740 Q600,700 1000,740" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="10 8" opacity="0.6"/>')
    # la Luna con le rovine dei Birkan/Lunarian
    svg.add(f'<circle cx="470" cy="380" r="130" fill="#e6e2d6" stroke="#a8a49a" stroke-width="3"/>')
    for (x, y, r) in ((420, 330, 22), (520, 420, 30), (450, 450, 14), (520, 330, 12), (400, 410, 16)):
        svg.add(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#cfcabc" stroke="#a8a49a" stroke-width="1.6"/>')
    for k in range(4):
        svg.add(f'<path d="M{430 + k * 22},{372} v-18 h12 v18" fill="#bab6aa" stroke="#7a766a" stroke-width="1"/>')
    # Birka: isola del cielo alla deriva
    svg.add(f'<ellipse cx="770" cy="420" rx="90" ry="34" fill="#f4f6f8" opacity="0.9"/>')
    svg.add(patch(jagged(ellipse_pts(770, 404, 60, 24, 10), rng, 0.1, 2), "#a5d07c", stroke=INK, sw=1.6))
    for k in range(3):
        svg.add(f'<path d="M{750 + k * 16},398 v-12 l6,-4 l6,4 v12" fill="#e6dcc4" stroke="{INK}" stroke-width="0.8"/>')
    # Stella Polare e nave dei pirati spaziali
    svg.add(f'<path d="M440,118 l8,24 l26,0 l-20,16 l8,24 l-22,-14 l-22,14 l8,-24 l-20,-16 l26,0 Z" fill="#fff3a8" stroke="#f2c84a" stroke-width="2"/>')
    svg.add(f'<circle cx="440" cy="150" r="44" fill="#fff3a8" opacity="0.15"/>')
    svg.add(f'<path d="M860,190 h80 l-10,16 h-60 Z" fill="#6a6a8a" stroke="#c9c9e0" stroke-width="1.6"/>')
    svg.add(f'<path d="M900,190 v-34 l22,20 Z" fill="#e6e6f2" stroke="#c9c9e0" stroke-width="1.2"/>')
    svg.add(f'<path d="M940,198 l40,6" stroke="#ffb02a" stroke-width="4" opacity="0.8"/>')
    head(svg, "Space", "Spazio · la Luna e Birka / the Moon and Birka", x=220, y=56, w=320, size=34)
    save(svg, "onepiece-space.svg", P)
    return P


ALL = [totland, dressrosa, sabaody, marineford, egghead, fishman, impel_down, water_seven, thriller_bark, zou,
       punk_hazard, amazon_lily, drum, mary_geoise, dawn, loguetown, ohara, elbaf, god_valley, germa, space]

if __name__ == "__main__":
    pins: dict = {}
    only = sys.argv[1:]
    for fn in ALL:
        if not only or fn.__name__ in only:
            pins.update(fn())
    apply_pins("onepiece", pins)
