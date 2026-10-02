#!/usr/bin/env python3
"""Sotto-mappe ORIGINALI di Black Clover, nello stile pergamena della world map.

Ricostruzioni AniMapVerse (nessun artwork ufficiale):
  * Capitale Reale (Clover) — Castello di Clover a nord, quartier generale dei Cavalieri Magici,
    Parlamento magico, piazza della Festa delle Stelle, quartiere nobile con le dimore Silva e
    Vermillion, quartiere comune e mercato, prigione, arena di selezione dei Cavalieri Reali.
  * Fortezza del Regno di Spade — il castello della Triade Oscura, le tre ali (Dante, Vanica,
    Zenon), l'Albero di Qliphoth e la Porta dell'Inframondo.
  * Regno di Heart — palazzo sul lago, le quattro aree d'addestramento degli spiriti
    (acqua, fulmine, fuoco, terra), la sala dei Guardiani Spirituali.
  * Regno di Diamond — reggia, laboratorio di ricerca, accademia militare, caserme, arena.
  * Inframondo — schema dei livelli del regno dei demoni fino ai domini di Lucifero,
    Belzebù e Astaroth (le aree più profonde) e di Megicula.

    python3 scripts/mapgen/blackclover.py  → public/assets/worlds/blackclover/maps/*.svg + pin
"""
from __future__ import annotations

import math
import random
import sys

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from kit import (JP, SERIF, Svg, apply_pins, arena, big_tree, both, castle, compass, dome, dots, ellipse_pts,
                 f, far_from, forest, hatch, house, jagged, mountain, mountain_range, out_path, patch, pip, poly,
                 preview, region_label, ribbon, river, road, scale_pts, scatter, shade, smooth, text, tower,
                 town, trees, wood)

INK = "#3a2412"
PAPER = "#ecd9b0"
PAPER2 = "#d9bd88"
CREDIT = "Ricostruzione originale AniMapVerse · CC0 · non è materiale ufficiale di Black Clover"
GOTHIC = "'UnifrakturMaguntia', 'Old English Text MT', Georgia, serif"


def save(svg: Svg, name: str, pins: dict) -> None:
    svg.save(out_path("blackclover", name))
    preview(svg.path, pins, svg.w, svg.h)


def parchment(svg: Svg, rng: random.Random, dark=False) -> None:
    g = svg.gradient("parch", [(0, PAPER if not dark else "#3a2430"), (0.7, PAPER2 if not dark else "#2a1420"),
                               (1, "#b8935a" if not dark else "#14080e")], "radial", 'cx="50%" cy="45%" r="75%"')
    svg.add(f'<rect width="{svg.w}" height="{svg.h}" fill="{g}"/>')
    svg.add(dots(rng, (0, 0, svg.w, svg.h), 900, "#6a4a22" if not dark else "#000000", (0.6, 2.0), None, (0.08, 0.25)))
    # macchie e bruciature ai bordi
    for _ in range(14):
        x, y = rng.choice([rng.uniform(0, 60), rng.uniform(svg.w - 60, svg.w)]), rng.uniform(0, svg.h)
        svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rng.uniform(20, 60))}" fill="#8a5a2a" opacity="0.08"/>')
    svg.add(f'<rect x="8" y="8" width="{svg.w - 16}" height="{svg.h - 16}" fill="none" stroke="#a8541a" stroke-width="3"/>')
    svg.add(f'<rect x="16" y="16" width="{svg.w - 32}" height="{svg.h - 32}" fill="none" stroke="{INK}" stroke-width="1"/>')


def title(svg, x, y, name, sub, w=400, size=36):
    svg.add(ribbon(x, y, w, name, size=size, fill="#efdcb2", stroke=INK, ink="#2a1608", sub=sub, family=GOTHIC))


def ink_tree(x, y, s=1.0) -> list[str]:
    """Albero a china (stile world map di Black Clover)."""
    return [f'<path d="M{f(x)},{f(y)} v{f(-6 * s)}" stroke="{INK}" stroke-width="1.2"/>',
            f'<path d="M{f(x - 7 * s)},{f(y - 5 * s)} q{f(-2 * s)},{f(-10 * s)} {f(7 * s)},{f(-14 * s)} q{f(9 * s)},{f(4 * s)} {f(7 * s)},{f(14 * s)} Z" '
            f'fill="#c9a86a" stroke="{INK}" stroke-width="1"/>',
            f'<path d="M{f(x)},{f(y - 6 * s)} q{f(4 * s)},{f(-4 * s)} {f(3 * s)},{f(-10 * s)}" fill="none" stroke="{INK}" stroke-width="0.7"/>']


def ink_forest(svg, rng, pts, n, avoid=None, s=1.0):
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    ok = (lambda x, y: pip(x, y, pts)) if avoid is None else both(lambda x, y: pip(x, y, pts), avoid)
    out = ["<g>"]
    for x, y in sorted(scatter(rng, n, (min(xs), min(ys), max(xs), max(ys)), ok, mind=12 * s), key=lambda p: p[1]):
        out += ink_tree(x, y, s * rng.uniform(0.85, 1.15))
    out.append("</g>")
    svg.add(out)


def ink_mountains(svg, rng, pts, w=50, h=44):
    out = []
    for x, y in sorted(pts, key=lambda p: p[1]):
        k = rng.uniform(0.8, 1.2)
        ww, hh = w * k, h * k
        out.append(f'<path d="M{f(x - ww / 2)},{f(y)} L{f(x)},{f(y - hh)} L{f(x + ww / 2)},{f(y)}" fill="#d8bf8a" stroke="{INK}" stroke-width="1.4"/>')
        for j in range(5):  # tratteggio sul lato in ombra
            t = (j + 1) / 6
            out.append(f'<path d="M{f(x + ww / 2 * t * 0.2)},{f(y - hh * (1 - t))} L{f(x + ww / 2 * t)},{f(y)}" stroke="{INK}" stroke-width="0.8" opacity="0.7"/>')
    svg.add(out)


def suit(x, y, kind, r=26, fill=INK) -> str:
    if kind == "clover":
        return (f'<g fill="{fill}"><circle cx="{f(x)}" cy="{f(y - r * 0.45)}" r="{f(r * 0.42)}"/><circle cx="{f(x - r * 0.45)}" cy="{f(y + r * 0.05)}" r="{f(r * 0.42)}"/>'
                f'<circle cx="{f(x + r * 0.45)}" cy="{f(y + r * 0.05)}" r="{f(r * 0.42)}"/><path d="M{f(x)},{f(y)} l{f(-r * 0.2)},{f(r * 0.8)} h{f(r * 0.4)} Z"/></g>')
    if kind == "spade":
        return (f'<path d="M{f(x)},{f(y - r)} C{f(x + r)},{f(y - r * 0.2)} {f(x + r * 0.9)},{f(y + r * 0.5)} {f(x + r * 0.2)},{f(y + r * 0.3)} '
                f'L{f(x + r * 0.35)},{f(y + r)} H{f(x - r * 0.35)} L{f(x - r * 0.2)},{f(y + r * 0.3)} C{f(x - r * 0.9)},{f(y + r * 0.5)} {f(x - r)},{f(y - r * 0.2)} {f(x)},{f(y - r)} Z" fill="{fill}"/>')
    if kind == "heart":
        return (f'<path d="M{f(x)},{f(y + r)} C{f(x - r * 1.2)},{f(y)} {f(x - r * 0.8)},{f(y - r)} {f(x)},{f(y - r * 0.4)} '
                f'C{f(x + r * 0.8)},{f(y - r)} {f(x + r * 1.2)},{f(y)} {f(x)},{f(y + r)} Z" fill="{fill}"/>')
    return f'<path d="M{f(x)},{f(y - r)} L{f(x + r * 0.7)},{f(y)} L{f(x)},{f(y + r)} L{f(x - r * 0.7)},{f(y)} Z" fill="{fill}"/>'


def walls(cx, cy, rx, ry, color=INK, towers=12) -> list[str]:
    out = [f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" stroke="{color}" stroke-width="8"/>',
           f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" stroke="#e8d4a8" stroke-width="4"/>']
    for k in range(towers):
        a = 2 * math.pi * k / towers
        x, y = cx + rx * math.cos(a), cy + ry * math.sin(a)
        out.append(f'<rect x="{f(x - 7)}" y="{f(y - 7)}" width="14" height="14" fill="#e8d4a8" stroke="{color}" stroke-width="1.6"/>')
    return out


def back_pin_arrow(x, y, label) -> list[str]:
    return [f'<path d="M{x - 40},{y + 16} L{x},{y - 4} L{x + 40},{y + 16}" fill="none" stroke="{INK}" stroke-width="3"/>',
            text(x, y + 40, label, size=13, fill=INK, italic=True, halo=PAPER, halo_w=3)]


# =============================================================================
# CAPITALE REALE — 1200 × 900
# =============================================================================
def royal_capital() -> dict:
    W, H = 1200, 900
    rng = random.Random(601)
    svg = Svg(W, H, "Black Clover · Royal Capital / Capitale Reale", CREDIT)
    P = {
        "loc-bc-capital-return": (600, 60),
        "loc-bc-clover-castle": (600, 205),
        "loc-bc-magic-knights-hq": (430, 315),
        "loc-bc-magic-parliament": (768, 315),
        "loc-bc-star-festival-square": (600, 430),
        "loc-bc-silva-mansion": (215, 320),
        "loc-bc-capital-noble-district": (285, 455),
        "loc-bc-vermillion-mansion": (180, 585),
        "loc-bc-grimoire-tower": (884, 452),
        "loc-bc-capital-market": (790, 590),
        "loc-bc-capital-common-district": (600, 640),
        "loc-bc-clover-prison": (905, 655),
        "loc-bc-royal-knights-arena": (330, 745),
        "loc-bc-shadow-palace": (600, 800),
    }
    pins = list(P.values())
    parchment(svg, rng)
    # colline boscose attorno
    ink_forest(svg, rng, [(20, 80), (300, 80), (200, 200), (20, 260)], 70, far_from(pins, 30))
    ink_forest(svg, rng, [(900, 80), (1180, 80), (1180, 300), (1000, 220)], 70, far_from(pins, 30))
    ink_mountains(svg, rng, [(80, 820), (140, 800), (1080, 820), (1130, 790), (1020, 790)], 60, 54)
    # mura della capitale (doppia cerchia: nobili all'interno, popolo all'esterno)
    svg.add(walls(600, 470, 520, 380, towers=16))
    svg.add(walls(600, 400, 300, 220, towers=10))
    for s in ([(600, 240), (600, 640), (600, 860)], [(100, 460), (600, 430), (1100, 460)], [(330, 745), (600, 640), (900, 650)]):
        svg.add(road(s, 10, "#efdcb2", INK))
    # quartiere nobile (case grandi) e comune (case fitte)
    out = ["<g>"]
    for x, y in sorted(scatter(rng, 70, (300, 200, 900, 600), both(lambda x, y: ((x - 600) / 290) ** 2 + ((y - 400) / 210) ** 2 <= 1,
                                                                 far_from(pins, 40), lambda x, y: abs(x - 600) > 14 and abs(y - 430) > 10), mind=34),
                       key=lambda p: p[1]):
        out += house(x, y, rng.uniform(18, 24), "#f2e2bc", rng.choice(["#a8541a", "#5a3a8a", "#2a5a3a"]), INK)
    for x, y in sorted(scatter(rng, 260, (90, 100, 1110, 850), both(lambda x, y: ((x - 600) / 505) ** 2 + ((y - 470) / 365) ** 2 <= 1,
                                                                  lambda x, y: ((x - 600) / 316) ** 2 + ((y - 400) / 236) ** 2 > 1,
                                                                  far_from(pins, 30)), mind=22), key=lambda p: p[1]):
        out += house(x, y, rng.uniform(12, 16), "#e8d4a8", rng.choice(["#8a5a2a", "#a8742a", "#6a4a2a"]), INK)
    out.append("</g>")
    svg.add(out)
    # Castello di Clover
    svg.add(castle(600, 230, 1.35, "#f4e6c8", "#2a5a3a", INK, flag="#2a5a3a"))
    svg.add(suit(600, 140, "clover", 12, "#2a5a3a"))
    # QG dei Cavalieri Magici, Parlamento, torre, prigione
    svg.add(f'<rect x="396" y="296" width="70" height="40" fill="#f2e2bc" stroke="{INK}" stroke-width="1.8"/>')
    svg.add(f'<path d="M388,296 L431,270 L474,296 Z" fill="#2a5a3a" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<rect x="732" y="296" width="72" height="40" fill="#f2e2bc" stroke="{INK}" stroke-width="1.8"/>')
    svg.add(dome(768, 296, 32, "#c9a86a", INK))
    svg.add(tower(884, 470, 30, 90, "#e8d4a8", "#5a3a8a", INK))
    svg.add(f'<rect x="878" y="636" width="56" height="34" fill="#a8946a" stroke="{INK}" stroke-width="1.8"/>')
    for k in range(5):
        svg.add(f'<path d="M{886 + k * 10},636 v34" stroke="{INK}" stroke-width="1.4"/>')
    # piazza della Festa delle Stelle (stella)
    svg.add(f'<circle cx="600" cy="430" r="46" fill="#efdcb2" stroke="{INK}" stroke-width="2"/>')
    pts = []
    for k in range(10):
        r = 30 if k % 2 == 0 else 12
        a = -math.pi / 2 + k * math.pi / 5
        pts.append((600 + r * math.cos(a), 430 + r * math.sin(a)))
    svg.add(f'<path d="{poly(pts)}" fill="#e8c34a" stroke="{INK}" stroke-width="1.4"/>')
    # dimore nobiliari (Silva, Vermillion) con giardini
    for (x, y, c) in ((215, 320, "#3a5a8a"), (180, 585, "#a83a2a")):
        svg.add(f'<ellipse cx="{x}" cy="{y + 10}" rx="60" ry="30" fill="#c9b07a" stroke="{INK}" stroke-width="1.2"/>')
        svg.add(castle(x, y + 16, 0.55, "#f4e6c8", c, INK, flag=None))
    # mercato (bancarelle)
    for k in range(6):
        x, y = 750 + (k % 3) * 28, 580 + (k // 3) * 22
        svg.add(f'<path d="M{x - 10},{y} h20 l-4,-10 h-12 Z" fill="{["#a83a2a", "#e8c34a", "#2a5a3a"][k % 3]}" stroke="{INK}" stroke-width="1"/>')
    svg.add(arena(330, 760, 70, 40, "#d8bf8a", "#c9a86a", INK))
    # Palazzo dell'Ombra: rovine/sotterraneo
    svg.add(f'<path d="M560,810 l10,-36 l20,10 l14,-24 l16,20 l14,-8 l10,38 Z" fill="#6a5a6a" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(back_pin_arrow(600, 72, "↑ Mappa del mondo · World map"))
    svg.add(region_label(600, 560, "Regno di Clover", sub="Clover Kingdom", size=16, color=INK, halo=PAPER))
    title(svg, 210, 140, "Capitale Reale", "Royal Capital", 300, 32)
    svg.add(compass(1120, 140, 36, INK, PAPER, "#a8541a"))
    save(svg, "blackclover-royal-capital.svg", P)
    return P


# =============================================================================
# FORTEZZA DEL REGNO DI SPADE — 1200 × 900
# =============================================================================
def spade_castle() -> dict:
    W, H = 1200, 900
    rng = random.Random(602)
    svg = Svg(W, H, "Black Clover · Spade Kingdom fortress", CREDIT)
    P = {
        "loc-bc-spade-return": (600, 60),
        "loc-bc-spade-throne-room": (600, 215),
        "loc-bc-spade-dante-wing": (300, 370),
        "loc-bc-spade-vanica-wing": (600, 390),
        "loc-bc-spade-zenon-wing": (900, 370),
        "loc-bc-qliphoth-tree": (600, 560),
        "loc-bc-spade-prison": (250, 620),
        "loc-bc-spade-moris-lab": (940, 620),
        "loc-bc-underworld-gate": (600, 735),
        "loc-bc-spade-courtyard": (300, 790),
    }
    pins = list(P.values())
    parchment(svg, rng)
    svg.add(f'<rect x="20" y="20" width="{W - 40}" height="{H - 40}" fill="#3a2a30" opacity="0.18"/>')
    ink_mountains(svg, rng, scatter(rng, 30, (40, 120, 1160, 860), both(far_from(pins, 90), lambda x, y: not (160 < x < 1040 and 150 < y < 840)), mind=60), 70, 64)
    # pianta della fortezza: mura nere a stella
    star = []
    for k in range(16):
        r = 430 if k % 2 == 0 else 360
        a = -math.pi / 2 + k * math.pi / 8
        star.append((600 + r * math.cos(a), 480 + r * 0.82 * math.sin(a)))
    svg.add(f'<path d="{poly(star)}" fill="#c9b08a" stroke="{INK}" stroke-width="4"/>')
    svg.add(f'<path d="{poly(scale_pts(star, 0.94, (600, 480)))}" fill="none" stroke="{INK}" stroke-width="1.2" stroke-dasharray="4 4"/>')
    # tre ali della Triade Oscura
    for (x, y, c, lab) in ((300, 380, "#5a3a5a", "Dante"), (600, 400, "#7a2a2a", "Vanica"), (900, 380, "#2a3a5a", "Zenon")):
        svg.add(f'<rect x="{x - 80}" y="{y - 40}" width="160" height="70" fill="#9a8a8a" stroke="{INK}" stroke-width="2"/>')
        svg.add(tower(x - 70, y + 30, 22, 76, "#8a7a7a", c, INK))
        svg.add(tower(x + 70, y + 30, 22, 76, "#8a7a7a", c, INK))
        svg.add(text(x, y + 56, lab, size=16, fill=INK, family=GOTHIC, weight="bold", halo=PAPER, halo_w=3))
    # torre del trono
    svg.add(tower(600, 260, 70, 120, "#7a6a6a", "#2a1a1a", INK))
    svg.add(suit(600, 168, "spade", 14, "#1a1010"))
    # Albero di Qliphoth: rami neri e radici che scendono alla porta
    svg.add(f'<path d="M600,700 C590,640 610,600 600,560" stroke="#1a1010" stroke-width="22" fill="none"/>')
    for k in range(9):
        a = math.radians(-160 + k * 18)
        x2, y2 = 600 + 150 * math.cos(a), 540 + 100 * math.sin(a)
        svg.add(f'<path d="M600,560 Q{f(600 + 70 * math.cos(a))},{f(560 + 30 * math.sin(a))} {f(x2)},{f(y2)}" stroke="#1a1010" stroke-width="5" fill="none"/>')
        svg.add(f'<circle cx="{f(x2)}" cy="{f(y2)}" r="6" fill="#7a2a4a" stroke="#1a1010" stroke-width="1"/>')
    svg.add(f'<ellipse cx="600" cy="740" rx="70" ry="22" fill="#2a0a14" stroke="#a83a5a" stroke-width="3"/>')
    svg.add(f'<ellipse cx="600" cy="740" rx="44" ry="12" fill="#5a0a2a"/>')
    # prigioni, laboratorio di Moris, cortile
    svg.add(f'<rect x="210" y="600" width="80" height="44" fill="#6a5a5a" stroke="{INK}" stroke-width="1.8"/>')
    for k in range(7):
        svg.add(f'<path d="M{218 + k * 10},600 v44" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<rect x="900" y="600" width="80" height="44" fill="#8a9a8a" stroke="{INK}" stroke-width="1.8"/>')
    for k in range(3):
        svg.add(f'<rect x="{910 + k * 22}" y="606" width="14" height="30" rx="6" fill="#7fd0b0" stroke="{INK}" stroke-width="1"/>')
    svg.add(f'<rect x="230" y="760" width="140" height="60" fill="#d8c09a" stroke="{INK}" stroke-width="1.6" stroke-dasharray="6 4"/>')
    svg.add(back_pin_arrow(600, 72, "↑ Mappa del mondo · World map"))
    title(svg, 220, 140, "Regno di Spade", "Fortezza della Triade Oscura · Dark Triad fortress", 300, 30)
    svg.add(compass(1120, 140, 36, INK, PAPER, "#a8541a"))
    save(svg, "blackclover-spade-castle.svg", P)
    return P


# =============================================================================
# REGNO DI HEART — 1200 × 900
# =============================================================================
def heart_kingdom() -> dict:
    W, H = 1200, 900
    rng = random.Random(603)
    svg = Svg(W, H, "Black Clover · Heart Kingdom", CREDIT)
    P = {
        "loc-bc-heart-return": (600, 60),
        "loc-bc-heart-palace": (600, 240),
        "loc-bc-heart-spirit-hall": (600, 520),
        "loc-bc-heart-water-training": (290, 400),
        "loc-bc-heart-lightning-training": (900, 400),
        "loc-bc-heart-earth-training": (290, 665),
        "loc-bc-heart-fire-training": (900, 665),
    }
    pins = list(P.values())
    parchment(svg, rng)
    ink_forest(svg, rng, [(40, 120), (1160, 120), (1160, 860), (40, 860)], 420, far_from(pins, 90))
    # lago con il palazzo
    lake = jagged(ellipse_pts(600, 250, 190, 90, 16), rng, 0.08, 2)
    svg.add(patch(lake, "#a8c8c0", stroke=INK, sw=2))
    for k in range(6):
        svg.add(f'<path d="M{480 + k * 40},{230 + (k % 2) * 30} q10,-4 20,0" fill="none" stroke="{INK}" stroke-width="1"/>')
    svg.add(castle(600, 268, 1.1, "#f4e6d8", "#a83a5a", INK, flag="#a83a5a"))
    svg.add(suit(600, 148, "heart", 12, "#a83a5a"))
    # quattro aree degli spiriti
    areas = [(290, 400, "#7ab0d8", "Acqua · Water"), (900, 400, "#e8d84a", "Fulmine · Lightning"),
             (290, 665, "#a8743a", "Terra · Earth"), (900, 665, "#d8642a", "Fuoco · Fire")]
    for (x, y, c, lab) in areas:
        svg.add(f'<circle cx="{x}" cy="{y}" r="74" fill="{c}" opacity="0.45" stroke="{INK}" stroke-width="2"/>')
        svg.add(f'<circle cx="{x}" cy="{y}" r="60" fill="none" stroke="{INK}" stroke-width="1" stroke-dasharray="3 5"/>')
        svg.add(text(x, y + 100, lab, size=15, fill=INK, italic=True, halo=PAPER, halo_w=3))
    svg.add(f'<path d="M270,390 q20,-20 40,0 t40,0" fill="none" stroke="#2a5a8a" stroke-width="3"/>')
    svg.add(f'<path d="M896,370 l-14,30 h12 l-8,26 l24,-36 h-12 l10,-20 Z" fill="#e8c34a" stroke="{INK}" stroke-width="1.2"/>')
    svg.add(f'<path d="M270,680 l20,-36 l20,36 Z" fill="#a8743a" stroke="{INK}" stroke-width="1.2"/>')
    svg.add(f'<path d="M900,690 q-18,-20 0,-50 q18,30 0,50 Z" fill="#d8642a" stroke="{INK}" stroke-width="1.2"/>')
    # sala dei Guardiani Spirituali
    svg.add(f'<rect x="540" y="500" width="120" height="50" fill="#f2e2bc" stroke="{INK}" stroke-width="2"/>')
    svg.add(dome(600, 500, 44, "#c9a86a", INK))
    for s in ([(600, 330), (600, 500)], [(360, 430), (540, 520)], [(840, 430), (660, 520)], [(360, 640), (540, 540)], [(840, 640), (660, 540)]):
        svg.add(road(s, 8, "#efdcb2", INK))
    svg.add(back_pin_arrow(600, 72, "↑ Mappa del mondo · World map"))
    title(svg, 220, 140, "Regno di Heart", "Heart Kingdom", 280, 32)
    svg.add(compass(1120, 140, 36, INK, PAPER, "#a83a5a"))
    save(svg, "blackclover-heart-kingdom.svg", P)
    return P


# =============================================================================
# REGNO DI DIAMOND — 1200 × 900
# =============================================================================
def diamond_kingdom() -> dict:
    W, H = 1200, 900
    rng = random.Random(604)
    svg = Svg(W, H, "Black Clover · Diamond Kingdom", CREDIT)
    P = {
        "loc-bc-diamond-return": (600, 60),
        "loc-bc-diamond-palace": (600, 230),
        "loc-bc-diamond-lab": (300, 430),
        "loc-bc-diamond-barracks": (600, 470),
        "loc-bc-diamond-academy": (890, 430),
        "loc-bc-diamond-arena": (890, 670),
    }
    pins = list(P.values())
    parchment(svg, rng)
    ink_mountains(svg, rng, scatter(rng, 50, (40, 120, 1160, 870), far_from(pins + [(600, 560)], 110), mind=56), 64, 60)
    # cittadella geometrica a rombo (militare)
    dia = [(600, 140), (1000, 470), (600, 820), (200, 470)]
    svg.add(f'<path d="{poly(dia)}" fill="#d8c8a0" stroke="{INK}" stroke-width="4"/>')
    svg.add(f'<path d="{poly(scale_pts(dia, 0.92, (600, 480)))}" fill="none" stroke="{INK}" stroke-width="1.4" stroke-dasharray="6 4"/>')
    for p in dia:
        svg.add(tower(p[0], p[1] + 20, 24, 50, "#c9b8a0", "#3a5a7a", INK))
    svg.add(road([(600, 270), (600, 760)], 12, "#efdcb2", INK))
    svg.add(road([(320, 450), (880, 450)], 12, "#efdcb2", INK))
    # reggia, laboratorio (vasche), caserme in fila, accademia, arena
    svg.add(castle(600, 260, 1.1, "#e6e8f0", "#3a5a7a", INK, flag="#3a5a7a"))
    svg.add(suit(600, 158, "diamond", 12, "#3a5a7a"))
    svg.add(f'<rect x="250" y="410" width="100" height="44" fill="#c9ccd2" stroke="{INK}" stroke-width="1.8"/>')
    for k in range(4):
        svg.add(f'<rect x="{258 + k * 22}" y="416" width="14" height="30" rx="6" fill="#9ad0e0" stroke="{INK}" stroke-width="1"/>')
    for k in range(5):
        svg.add(f'<rect x="{530 + k * 30}" y="480" width="24" height="40" fill="#b8a888" stroke="{INK}" stroke-width="1.2"/>')
    svg.add(f'<rect x="840" y="400" width="100" height="50" fill="#e6dcc4" stroke="{INK}" stroke-width="1.8"/>')
    svg.add(f'<path d="M832,400 L890,370 L948,400 Z" fill="#3a5a7a" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(arena(890, 680, 70, 40, "#d8c8a0", "#c9b08a", INK))
    svg.add(back_pin_arrow(600, 72, "↑ Mappa del mondo · World map"))
    title(svg, 220, 140, "Regno di Diamond", "Diamond Kingdom", 300, 30)
    svg.add(compass(1120, 140, 36, INK, PAPER, "#3a5a7a"))
    save(svg, "blackclover-diamond-kingdom.svg", P)
    return P


# =============================================================================
# INFRAMONDO — 1200 × 1400
# =============================================================================
def underworld() -> dict:
    W, H = 1200, 1400
    rng = random.Random(605)
    svg = Svg(W, H, "Black Clover · Underworld / Inframondo", CREDIT)
    P = {
        "loc-bc-uw-return": (600, 96),
        "loc-bc-uw-level-1": (600, 258),
        "loc-bc-uw-mid-levels": (600, 560),
        "loc-bc-uw-megicula": (340, 880),
        "loc-bc-uw-level-7": (600, 1080),
        "loc-bc-uw-beelzebub": (330, 1230),
        "loc-bc-uw-lucifero": (600, 1256),
        "loc-bc-uw-astaroth": (870, 1230),
    }
    g = svg.gradient("uw", [(0, "#3a2430"), (0.5, "#2a0e18"), (1, "#0e0408")])
    svg.add(f'<rect width="{W}" height="{H}" fill="{g}"/>')
    svg.add(dots(rng, (0, 0, W, H), 500, "#ff6a5a", (0.5, 1.4), None, (0.1, 0.4)))
    # imbuto di livelli (stile "inferno" a gironi)
    levels = [(258, 460, "1"), (390, 430, "2"), (480, 400, "3"), (570, 370, "4"), (660, 340, "5"), (860, 300, "6"), (1080, 270, "7")]
    for y, rx, lab in levels:
        ry = rx * 0.16
        c = mix_color(int(lab))
        svg.add(f'<ellipse cx="600" cy="{y + 14}" rx="{rx}" ry="{f(ry)}" fill="#0a0204" opacity="0.7"/>')
        svg.add(f'<ellipse cx="600" cy="{y}" rx="{rx}" ry="{f(ry)}" fill="{c}" stroke="#d84a5a" stroke-width="2"/>')
        svg.add(f'<ellipse cx="600" cy="{y}" rx="{rx * 0.8}" ry="{f(ry * 0.8)}" fill="none" stroke="#ff8a7a" stroke-width="1" stroke-dasharray="4 6" opacity="0.6"/>')
        svg.add(text(600 + rx - 24, y + 6, f"Livello {lab} · Level {lab}", size=14, fill="#ffd2c8", anchor="end", italic=True))
    # pozzo che scende al centro
    svg.add(f'<path d="M560,130 L640,130 L620,1080 L580,1080 Z" fill="#000000" opacity="0.35"/>')
    # il cancello in cima (dalla fortezza di Spade)
    svg.add(f'<ellipse cx="600" cy="110" rx="80" ry="24" fill="#5a0a2a" stroke="#ff6a8a" stroke-width="3"/>')
    # domini dei demoni più potenti
    for (x, y, c, lab) in ((340, 880, "#5a2a6a", "Megicula"), (330, 1230, "#2a3a2a", "Beelzebub"),
                           (600, 1256, "#6a0a1a", "Lucifero"), (870, 1230, "#3a2a5a", "Astaroth")):
        svg.add(f'<circle cx="{x}" cy="{y}" r="84" fill="{c}" stroke="#ff6a5a" stroke-width="2.4"/>')
        svg.add(f'<circle cx="{x}" cy="{y}" r="64" fill="none" stroke="#ffb0a0" stroke-width="1" stroke-dasharray="3 5"/>')
        for k in range(2):  # corna stilizzate
            sx = -1 if k == 0 else 1
            svg.add(f'<path d="M{x + sx * 30},{y - 70} q{sx * 10},-34 {sx * 34},-40 q{-sx * 14},20 {-sx * 16},44 Z" fill="#1a0408" stroke="#ff6a5a" stroke-width="1.4"/>')
        svg.add(text(x, y + 112, lab, size=20, fill="#ffd2c8", family=GOTHIC, weight="bold"))
    svg.add(ribbon(250, 210, 320, "Inframondo", size=34, fill="#3a1a24", stroke="#ff6a5a", ink="#ffd2c8", sub="Underworld", family=GOTHIC))
    svg.add(text(600, 64, "↑ Fortezza di Spade · Spade fortress", size=14, fill="#ffd2c8", italic=True))
    save(svg, "blackclover-underworld.svg", P)
    return P


def mix_color(level: int) -> str:
    a, b = (90, 40, 60), (30, 6, 12)
    t = (level - 1) / 6
    return "#%02x%02x%02x" % tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


ALL = [royal_capital, spade_castle, heart_kingdom, diamond_kingdom, underworld]

if __name__ == "__main__":
    pins: dict = {}
    for fn in ALL:
        pins.update(fn())
    apply_pins("blackclover", pins)
