#!/usr/bin/env python3
"""Sotto-mappe ORIGINALI dei villaggi di Naruto (Konoha + 8 villaggi).

Il manga/anime non ha mai pubblicato piante complete dei villaggi: queste sono
ricostruzioni AniMapVerse basate su ciò che la serie mostra (la Roccia degli
Hokage a nord di Konoha, la residenza rossa con il kanji 火, le mura circolari,
il quartiere Uchiha in periferia, la Foresta della Morte; Suna dentro un anello
di rupi con un solo varco; Kiri tra nebbia e acqua; Iwa scolpita nei pinnacoli;
Kumo sulle vette tra le nuvole; Ame tra torri industriali e pioggia; Oto nei
covi sotterranei di Orochimaru; Uzushio in rovina tra i vortici; Taki dietro la
cascata attorno all'albero gigante).

    python3 scripts/mapgen/naruto.py   → public/assets/worlds/naruto/maps/*.svg
                                          + aggiorna x/y dei pin in src/data/naruto/
"""
from __future__ import annotations

import math
import random
import sys

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from kit import (DISPLAY, JP, SERIF, Svg, apply_pins, arena, both, compass, curved_text, dome, dots,
                 ellipse_pts, f, far_from, forest, house, island, jagged, mountain, mountain_range,
                 out_path, patch, preview, pip, plaque, poly, region_label, river, road, scatter, sea, shade,
                 smooth, text, tower, trees, wood, ship, big_tree)

INK = "#2e2618"
PAPER = "#f3ead2"
CREDIT = "Ricostruzione originale AniMapVerse · CC0 · non è materiale ufficiale di Naruto"


# -----------------------------------------------------------------------------
# Mattoni specifici (edifici giapponesi dall'alto, in leggera prospettiva)
# -----------------------------------------------------------------------------
def block(x, y, w, h, roof, depth=None, stroke=INK, sw=0.9) -> list[str]:
    """Edificio a tetto piatto/spiovente visto dall'alto con facciata (prospettiva)."""
    d = depth if depth is not None else h * 0.45
    return [f'<rect x="{f(x - w / 2)}" y="{f(y - h / 2)}" width="{f(w)}" height="{f(h + d)}" fill="{shade(roof, -0.35)}" stroke="{stroke}" stroke-width="{sw}"/>',
            f'<rect x="{f(x - w / 2)}" y="{f(y - h / 2)}" width="{f(w)}" height="{f(h)}" fill="{roof}" stroke="{stroke}" stroke-width="{sw}"/>']


def blocks(rng, n, box, ok, roofs, size=(14, 26), mind=20.0, stroke=INK) -> list[str]:
    pts = scatter(rng, n, box, ok, mind=mind)
    out = ["<g>"]
    for x, y in sorted(pts, key=lambda p: p[1]):
        w = rng.uniform(*size)
        h = w * rng.uniform(0.55, 0.9)
        out += block(x, y, w, h, rng.choice(roofs), stroke=stroke)
        if rng.random() < 0.18:  # serbatoi d'acqua sui tetti, tipici di Konoha
            out.append(f'<ellipse cx="{f(x + w * 0.2)}" cy="{f(y - h * 0.15)}" rx="{f(w * 0.12)}" ry="{f(w * 0.08)}" fill="#d8d2c4" stroke="{stroke}" stroke-width="0.6"/>')
    out.append("</g>")
    return out


def cylinder(x, y, r, h, body, top, stroke=INK, kanji: str | None = None, kcolor="#fff") -> list[str]:
    """Edificio cilindrico (residenze dei Kage)."""
    out = [f'<path d="M{f(x - r)},{f(y - h)} V{f(y)} A{f(r)},{f(r * 0.35)} 0 0,0 {f(x + r)},{f(y)} V{f(y - h)}" fill="{body}" stroke="{stroke}" stroke-width="1.6"/>',
           f'<ellipse cx="{f(x)}" cy="{f(y - h)}" rx="{f(r)}" ry="{f(r * 0.35)}" fill="{top}" stroke="{stroke}" stroke-width="1.6"/>',
           f'<path d="M{f(x - r * 0.55)},{f(y - h * 0.05)} V{f(y - h * 0.75)}" stroke="{shade(body, -0.3)}" stroke-width="{f(r * 0.12)}" opacity="0.5"/>']
    if kanji:
        out.append(text(x + r * 0.15, y - h * 0.35, kanji, size=r * 0.75, fill=kcolor, family=JP, weight="bold"))
    return out


def posts(x, y, s=1.0) -> list[str]:
    """Tre pali di legno del campo d'addestramento."""
    out = []
    for i, dx in enumerate((-14, 0, 14)):
        out.append(f'<rect x="{f(x + dx * s - 3 * s)}" y="{f(y - 18 * s)}" width="{f(6 * s)}" height="{f(18 * s)}" fill="#8a5a32" stroke="{INK}" stroke-width="1"/>')
        out.append(f'<ellipse cx="{f(x + dx * s)}" cy="{f(y - 18 * s)}" rx="{f(3 * s)}" ry="{f(1.4 * s)}" fill="#c08850" stroke="{INK}" stroke-width="0.8"/>')
    return out


def clearing(x, y, rx, ry, fill="#c9b98a", rng=None) -> str:
    pts = ellipse_pts(x, y, rx, ry, 18, rng, 0.12) if rng else ellipse_pts(x, y, rx, ry, 18)
    return patch(pts, fill, stroke=shade(fill, -0.3), sw=1.2)


def canopy(svg, rng, box, ok, r=11.0, n=None, palette=("#4f7f3a", "#2f5226", "#76a85a")) -> list[str]:
    area = (box[2] - box[0]) * (box[3] - box[1])
    n = n or int(area / (r * r * 2.2))
    return wood(svg, scatter(rng, n, box, ok, mind=r * 1.05), rng, r=r, fill=palette[0], dark=palette[1],
                light=palette[2], stroke="#1f3418", sw=0.8)


def title(svg: Svg, x, y, name, jp, sub, w=360) -> None:
    svg.add(plaque(x, y, w, 92, name, sub=sub, jp=jp, fill="#2a2116", stroke="#c9a85a", ink="#f6e9c8", size=28))


def save(svg: Svg, name: str, pins: dict) -> None:
    svg.save(out_path("naruto", name))
    preview(svg.path, pins, svg.w, svg.h)


def ring(cx, cy, rx, ry) -> list[tuple[float, float]]:
    return ellipse_pts(cx, cy, rx, ry, 64)


# =============================================================================
# KONOHAGAKURE — 1200 × 800
# =============================================================================
def konoha() -> dict:
    W, H = 1200, 800
    rng = random.Random(101)
    svg = Svg(W, H, "Konohagakure no Sato · 木ノ葉隠れの里", CREDIT)
    P = {
        "loc-konoha-monument": (600, 112),
        "loc-konoha-hokage-residence": (600, 238),
        "loc-konoha-mission-room": (676, 262),
        "loc-konoha-academy": (512, 286),
        "loc-konoha-anbu-hq": (760, 182),
        "loc-konoha-intelligence": (440, 340),
        "loc-konoha-cemetery": (390, 222),
        "loc-konoha-hospital": (800, 282),
        "loc-konoha-hospital-2": (880, 236),
        "loc-konoha-ichiraku": (640, 392),
        "loc-konoha-central-street": (712, 452),
        "loc-konoha-yamanaka-shop": (568, 450),
        "loc-konoha-bbq": (800, 470),
        "loc-konoha-exam-arena": (940, 372),
        "loc-konoha-senju-compound": (316, 330),
        "loc-konoha-uchiha-district": (320, 600),
        "loc-konoha-naka-shrine": (258, 676),
        "loc-konoha-hyuga-compound": (836, 610),
        "loc-konoha-orphanage": (730, 660),
        "loc-konoha-main-gate": (600, 748),
        "loc-konoha-training-7": (958, 560),
        "loc-konoha-training-3": (1080, 478),
        "loc-konoha-memorial": (1098, 552),
        "loc-konoha-root-hq": (1090, 262),
        "loc-konoha-nara-forest": (96, 430),
        "loc-konoha-hot-springs": (110, 628),
    }
    pins = list(P.values())
    cx, cy, rx, ry = 600, 470, 450, 285
    wall = ring(cx, cy, rx, ry)
    inside = lambda x, y: ((x - cx) / (rx - 14)) ** 2 + ((y - cy) / (ry - 14)) ** 2 <= 1

    # foresta di Hi no Kuni tutto attorno
    svg.add(f'<rect width="{W}" height="{H}" fill="#5f8a44"/>')
    svg.add(canopy(svg, rng, (-10, -10, W + 10, H + 10),
                   both(lambda x, y: not (((x - cx) / (rx + 8)) ** 2 + ((y - cy) / (ry + 8)) ** 2 <= 1), far_from(pins, 26)),
                   r=13, palette=("#4b7a37", "#2c4a22", "#6f9e50")))

    # Foresta della Morte (Campo 44) recintata — angolo sud-est
    fod = jagged(ellipse_pts(1105, 730, 120, 92, 14), rng, 0.1, 2)
    svg.add(patch(fod, "#24361d", stroke="#8a6a3a", sw=3))
    svg.add(canopy(svg, rng, (985, 640, 1200, 800), both(lambda x, y: pip(x, y, fod), far_from(pins, 22)), r=12,
                   palette=("#2f4a26", "#16240f", "#46663a")))
    svg.add(f'<path d="{smooth(fod)}" fill="none" stroke="#c9a060" stroke-width="2" stroke-dasharray="6 5"/>')
    svg.add(region_label(1100, 708, "Shi no Mori", jp="死の森", sub="Campo 44 · Training Ground 44", size=17,
                         color="#f3e6c4", halo="#1a2614"))

    # fiume che attraversa la foresta a ovest e il lago termale
    svg.add(river([(-10, 180), (60, 260), (40, 360), (120, 520), (70, 700), (130, 810)], 12))
    svg.add(f'<ellipse cx="110" cy="660" rx="44" ry="22" fill="#9fd0d8" stroke="#3e7f9c" stroke-width="2"/>')
    for i in range(3):
        svg.add(f'<path d="M{96 + i * 14},648 q-5,-10 0,-18 q5,-8 0,-16" fill="none" stroke="#fff" stroke-width="2" opacity="0.7"/>')

    # Foresta dei Nara (cervi) a ovest, oltre le mura
    svg.add(region_label(96, 372, "Nara", jp="奈良一族の森", size=16, color="#f3e6c4", halo="#22381a"))

    # suolo del villaggio
    svg.add(f'<path d="{smooth(wall)}" fill="#d8c99a"/>')
    svg.add(dots(rng, (cx - rx, cy - ry, cx + rx, cy + ry), 600, "#7a6640", (0.6, 1.4), inside, (0.1, 0.3)))

    # ROCCIA DEGLI HOKAGE — rupe a nord
    cliff_top = [(250, 0), (250, 70), (330, 60), (420, 40), (520, 30), (680, 30), (780, 40), (870, 60), (950, 75), (950, 0)]
    svg.add(f'<path d="M230,0 L230,90 C320,70 420,40 600,36 C780,40 880,70 970,95 L970,0 Z" fill="#5d8a44"/>')
    svg.add(canopy(svg, rng, (230, 0, 970, 60), lambda x, y: True, r=11, palette=("#4b7a37", "#2c4a22", "#6f9e50")))
    face = "M240,96 C330,74 430,48 600,44 C770,48 870,74 960,100 L940,170 C860,190 760,200 600,204 C440,200 340,190 260,170 Z"
    svg.add(f'<path d="{face}" fill="#bfa883" stroke="{INK}" stroke-width="2"/>')
    for i in range(14):  # strati di roccia
        y = 70 + i * 9
        svg.add(f'<path d="M{260 + i * 2},{y + 40} C420,{y + 10} 780,{y + 10} {940 - i * 2},{y + 42}" fill="none" stroke="#8d7756" stroke-width="1" opacity="0.45"/>')
    # cinque volti scolpiti (geometria originale: ovali, sopracciglia, bocca)
    for i, x in enumerate((420, 510, 600, 690, 780)):
        y = 128 - (2 if i == 2 else 0)
        svg.add(f'<ellipse cx="{x}" cy="{y}" rx="34" ry="44" fill="#cdb894" stroke="{INK}" stroke-width="1.6"/>')
        svg.add(f'<path d="M{x - 20},{y - 12} q8,-6 14,0 M{x + 6},{y - 12} q8,-6 14,0 M{x - 10},{y + 22} q10,6 20,0" fill="none" stroke="{INK}" stroke-width="1.6"/>')
        svg.add(f'<path d="M{x},{y - 4} v14" stroke="#8d7756" stroke-width="2"/>')
        svg.add(f'<path d="M{x + 34},{y - 30} q8,30 0,62" fill="none" stroke="#8d7756" stroke-width="3" opacity="0.6"/>')
        svg.add(f'<path d="{HAIR[i](x, y)}" fill="#a8916c" stroke="{INK}" stroke-width="1.4" stroke-linejoin="round"/>')
    svg.add(text(600, 196, "火影岩", size=15, fill="#4a3b26", family=JP, spacing=6))

    # mura e strade
    svg.add(f'<path d="{smooth(wall)}" fill="none" stroke="#7a6a4c" stroke-width="12" stroke-dasharray="1 0"/>')
    svg.add(f'<path d="{smooth(wall)}" fill="none" stroke="#d9cdb0" stroke-width="7"/>')
    svg.add(f'<path d="{smooth(wall)}" fill="none" stroke="{INK}" stroke-width="1" stroke-dasharray="3 5" opacity="0.6"/>')
    streets = [
        [(600, 760), (600, 600), (605, 420), (600, 260)],             # viale principale
        [(230, 470), (420, 455), (600, 430), (820, 430), (1000, 440)],  # asse est-ovest
        [(320, 300), (450, 330), (600, 330), (760, 330), (900, 300)],
        [(330, 640), (470, 560), (600, 560), (760, 580), (900, 650)],
        [(900, 300), (960, 450), (900, 650)],
        [(320, 300), (250, 450), (330, 640)],
    ]
    for s in streets:
        svg.add(road(s, 10, "#ecdfb8", "#a08a5e"))
    svg.add(road([(600, 760), (610, 800)], 12, "#ecdfb8", "#a08a5e"))

    # quartieri residenziali (tetti in colori tipici: arancio, rosso mattone, verde, blu)
    roofs = ["#c96e3e", "#b5523b", "#d99a4e", "#7a9a6a", "#6f8fb0", "#c9b48a", "#a8644a"]
    reserved = [(600, 238, 90), (512, 286, 50), (800, 282, 55), (940, 372, 95), (320, 600, 115),
                (836, 610, 80), (316, 330, 70), (600, 748, 40), (958, 560, 60), (390, 222, 40)]
    def free(x, y):
        return inside(x, y) and all((x - a) ** 2 + (y - b) ** 2 > r * r for a, b, r in reserved) and y > 214
    svg.add(blocks(rng, 420, (cx - rx, 200, cx + rx, cy + ry), both(free, far_from(pins, 15)), roofs, (13, 24), 19))

    # alberi dentro il villaggio (Konoha è "la foglia")
    svg.add(wood(svg, scatter(rng, 70, (cx - rx, 200, cx + rx, cy + ry), both(free, far_from(pins, 22)), mind=26), rng,
                  r=8, fill="#5b8c42", dark="#2f5226", light="#86b860", stroke="#1f3418", sw=0.7))

    # cimitero
    svg.add(clearing(390, 232, 52, 26, "#9fb07a", rng))
    for i in range(12):
        x, y = 360 + (i % 6) * 12, 224 + (i // 6) * 14
        svg.add(f'<rect x="{x}" y="{y}" width="5" height="8" fill="#b9b4a8" stroke="{INK}" stroke-width="0.6"/>')

    # residenza dell'Hokage (rossa, cilindrica, 火) + Accademia + sala missioni
    svg.add(block(512, 290, 82, 40, "#c98a4e"))
    svg.add(block(676, 268, 54, 30, "#b5523b"))
    svg.add(cylinder(600, 268, 52, 44, "#c0392b", "#d9573d", kanji="火"))

    # ospedale (blocco bianco a più piani) e struttura medica
    svg.add(block(800, 290, 70, 34, "#e8e4da", depth=28))
    svg.add(f'<path d="M793,276 h14 M800,269 v14" stroke="#c0392b" stroke-width="4"/>')
    svg.add(block(880, 244, 50, 26, "#dcd6c8", depth=16))

    # ANBU e Radice: ingressi nascosti nella roccia / sotto il bosco
    svg.add(f'<path d="M748,192 q12,-18 24,0 Z" fill="#2a2016" stroke="{INK}" stroke-width="1.2"/>')
    svg.add(f'<path d="M1078,270 q12,-18 24,0 Z" fill="#2a2016" stroke="{INK}" stroke-width="1.2"/>')

    # stadio degli esami Chūnin
    svg.add(arena(940, 380, 78, 46, "#cdb48a", "#a7c27a"))

    # complesso Senju, Hyūga (cortili tradizionali)
    for (x, y, w, h, c) in ((316, 336, 110, 70, "#7d6a52"), (836, 616, 130, 84, "#5a5f6e")):
        svg.add(f'<rect x="{x - w / 2}" y="{y - h / 2}" width="{w}" height="{h}" fill="#e6dcc2" stroke="{INK}" stroke-width="1.5"/>')
        svg.add(block(x - w * 0.25, y - h * 0.18, w * 0.38, h * 0.32, c))
        svg.add(block(x + w * 0.22, y - h * 0.18, w * 0.34, h * 0.3, c))
        svg.add(block(x, y + h * 0.22, w * 0.6, h * 0.22, c))
    # quartiere Uchiha, cinto da mura proprie, con il santuario Naka
    uch = jagged(ellipse_pts(300, 620, 120, 92, 12), rng, 0.05, 2)
    svg.add(patch(uch, "#cbbf9f", stroke="#6b5a40", sw=4))
    svg.add(blocks(rng, 40, (180, 530, 420, 712), both(lambda x, y: pip(x, y, scale_pts_(uch, 0.86)), far_from(pins, 18)),
                   ["#3b3f4a", "#4a4f5c", "#5a3a3a"], (13, 20), 20))
    for (x, y) in ((360, 560), (230, 600), (340, 690)):  # ventaglio uchiwa (rosso/bianco)
        svg.add(f'<line x1="{x}" y1="{y + 10}" x2="{x}" y2="{y + 20}" stroke="{INK}" stroke-width="2"/>')
        svg.add(f'<path d="M{x - 8},{y} a8,8 0 0,1 16,0 Z" fill="#c0392b" stroke="{INK}" stroke-width="1"/>')
        svg.add(f'<path d="M{x - 8},{y} a8,8 0 0,0 16,0 Z" fill="#fff" stroke="{INK}" stroke-width="1"/>')
    svg.add(f'<path d="M244,686 h28 M248,680 h20 M251,680 v16 M265,680 v16" stroke="#c0392b" stroke-width="3"/>')  # torii
    svg.add(region_label(300, 545, "Uchiha", jp="うちは一族", size=15, color="#f3e6c4", halo="#3a2a22"))

    # campi d'addestramento: radure con i tre pali, stele commemorativa
    svg.add(clearing(958, 566, 48, 30, "#b9b07a", rng))
    svg.add(posts(958, 568))
    svg.add(clearing(1080, 500, 70, 66, "#b9b07a", rng))
    svg.add(posts(1074, 488))
    svg.add(f'<path d="M1090,560 l8,-26 l10,0 l6,26 Z" fill="#4a4a50" stroke="{INK}" stroke-width="1.2"/>')

    # orfanotrofio, porta principale (A-Un)
    svg.add(block(730, 668, 44, 26, "#b9805a"))
    svg.add(f'<rect x="570" y="740" width="60" height="22" fill="#3d6b3a" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<rect x="562" y="732" width="76" height="9" fill="#2e4a2a" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(text(585, 757, "阿", size=12, fill="#f3e6c4", family=JP, weight="bold"))
    svg.add(text(615, 757, "吽", size=12, fill="#f3e6c4", family=JP, weight="bold"))

    svg.add(compass(1140, 80, 36, INK, PAPER, "#c0392b"))
    title(svg, 150, 60, "Konohagakure", "木ノ葉隠れの里", "Villaggio della Foglia · Hidden Leaf", 270)
    save(svg, "naruto-konoha.svg", P)
    return P


# capigliature stilizzate dei cinque volti (forme originali, non ricalcate)
HAIR = [
    lambda x, y: f"M{x - 36},{y + 30} C{x - 40},{y - 40} {x + 40},{y - 40} {x + 36},{y + 30} L{x + 30},{y - 10} C{x + 20},{y - 34} {x - 20},{y - 34} {x - 30},{y - 10} Z",
    lambda x, y: f"M{x - 32},{y - 18} l6,-22 l10,8 l8,-14 l8,10 l10,-12 l6,12 l10,-6 l-2,24 C{x + 18},{y - 34} {x - 18},{y - 34} {x - 32},{y - 18} Z",
    lambda x, y: f"M{x - 34},{y - 16} C{x - 30},{y - 48} {x + 30},{y - 48} {x + 34},{y - 16} C{x + 18},{y - 28} {x - 18},{y - 28} {x - 34},{y - 16} Z",
    lambda x, y: f"M{x - 38},{y - 2} l4,-30 l8,10 l2,-20 l12,12 l8,-18 l10,16 l12,-14 l4,18 l10,-8 l-2,34 C{x + 20},{y - 30} {x - 20},{y - 30} {x - 38},{y - 2} Z",
    lambda x, y: f"M{x - 34},{y - 10} C{x - 34},{y - 46} {x + 34},{y - 46} {x + 34},{y - 10} C{x + 10},{y - 24} {x - 6},{y - 30} {x - 34},{y - 10} Z M{x - 34},{y - 6} l-8,30 l10,-8 Z M{x + 34},{y - 6} l8,30 l-10,-8 Z",
]


def scale_pts_(pts, k):
    cx = sum(p[0] for p in pts) / len(pts)
    cy = sum(p[1] for p in pts) / len(pts)
    return [(cx + (x - cx) * k, cy + (y - cy) * k) for x, y in pts]


# -----------------------------------------------------------------------------
# Altri mattoni
# -----------------------------------------------------------------------------
def domehouse(x, y, r, body="#e2c48e", top="#d6b278", stroke=INK, win=True) -> list[str]:
    """Casa a cupola di Suna (cilindro basso + cupola)."""
    h = r * 0.8
    out = [f'<path d="M{f(x - r)},{f(y - h)} V{f(y)} A{f(r)},{f(r * 0.35)} 0 0,0 {f(x + r)},{f(y)} V{f(y - h)}" fill="{body}" stroke="{stroke}" stroke-width="1"/>',
           f'<path d="M{f(x - r)},{f(y - h)} A{f(r)},{f(r * 0.9)} 0 0,1 {f(x + r)},{f(y - h)} A{f(r)},{f(r * 0.35)} 0 0,1 {f(x - r)},{f(y - h)} Z" fill="{top}" stroke="{stroke}" stroke-width="1"/>']
    if win and r > 7:
        out.append(f'<circle cx="{f(x - r * 0.35)}" cy="{f(y - h * 0.45)}" r="{f(r * 0.16)}" fill="#3b2a18" opacity="0.8"/>')
        out.append(f'<circle cx="{f(x + r * 0.3)}" cy="{f(y - h * 0.4)}" r="{f(r * 0.16)}" fill="#3b2a18" opacity="0.8"/>')
    return out


def mesa(x, y, rx, h, top="#b08a5e", side="#8a6440", stroke=INK, rng=None, green: str | None = None) -> list[str]:
    """Pinnacolo/rupe in prospettiva: cima irregolare, pareti a sfaccettature (luce a sinistra), strati."""
    rng = rng or random.Random(int(x * 7 + y * 13))
    ry = rx * 0.38
    tp = jagged(ellipse_pts(x, y - h, rx, ry, 12), rng, 0.07, 2)
    bw = rx * 1.14
    body = (f"M{f(x - rx)},{f(y - h)} L{f(x - bw)},{f(y)} A{f(bw)},{f(ry * 1.14)} 0 0,0 {f(x + bw)},{f(y)} "
            f"L{f(x + rx)},{f(y - h)} Z")
    out = [f'<path d="{body}" fill="{side}" stroke="{stroke}" stroke-width="1.4" stroke-linejoin="round"/>']
    # sfaccettature verticali: chiare a sinistra, scure a destra
    n = 5
    for i in range(n):
        t0, t1 = -1 + 2 * i / n, -1 + 2 * (i + 1) / n
        k = (t0 + t1) / 2
        col = shade(side, 0.18) if k < -0.4 else (shade(side, -0.22) if k > 0.35 else None)
        if not col:
            continue
        a0, a1 = x + rx * t0, x + rx * t1
        b0, b1 = x + bw * t0, x + bw * t1
        yb0 = y + ry * 1.14 * math.sqrt(max(0, 1 - t0 * t0))
        yb1 = y + ry * 1.14 * math.sqrt(max(0, 1 - t1 * t1))
        out.append(f'<path d="M{f(a0)},{f(y - h)} L{f(a1)},{f(y - h)} L{f(b1)},{f(yb1)} L{f(b0)},{f(yb0)} Z" fill="{col}" opacity="0.8"/>')
    for k in range(1, int(h / 26) + 1):  # strati orizzontali
        yy = y - h + k * 26 + rng.uniform(-4, 4)
        out.append(f'<path d="M{f(x - rx * 1.02)},{f(yy)} q{f(rx)},{f(ry * 0.6)} {f(rx * 2.04)},0" fill="none" stroke="{shade(side, -0.4)}" stroke-width="1" opacity="0.45"/>')
    out.append(f'<path d="{smooth(tp)}" fill="{top}" stroke="{stroke}" stroke-width="1.4"/>')
    if green:
        out.append(f'<path d="{smooth(scale_pts_(tp, 0.7))}" fill="{green}" opacity="0.6"/>')
    return out


def cloud(x, y, w, fill="#ffffff", opacity=0.85, stroke: str | None = None) -> str:
    h = w * 0.32
    d = (f"M{f(x - w / 2)},{f(y)} q{f(w * 0.02)},{f(-h * 0.9)} {f(w * 0.2)},{f(-h * 0.7)} "
         f"q{f(w * 0.08)},{f(-h * 0.9)} {f(w * 0.28)},{f(-h * 0.6)} q{f(w * 0.12)},{f(-h * 0.6)} {f(w * 0.24)},{f(h * 0.1)} "
         f"q{f(w * 0.2)},{f(-h * 0.2)} {f(w * 0.28)},{f(h * 1.2)} Z")
    st = f' stroke="{stroke}" stroke-width="1.4"' if stroke else ""
    return f'<path d="{d}" fill="{fill}" opacity="{opacity}"{st}/>'


def spiral(x, y, r, turns=3.0, color="#ffffff", width=2.0, opacity=0.7, cw=True) -> str:
    pts = []
    n = int(turns * 24)
    for i in range(n + 1):
        t = i / n
        a = t * turns * 2 * math.pi * (1 if cw else -1)
        rr = r * (1 - t)
        pts.append((x + math.cos(a) * rr, y + math.sin(a) * rr * 0.75))
    return (f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="{color}" stroke-width="{width}" '
            f'stroke-linecap="round" opacity="{opacity}"/>')


def bridge(a, b, color="#8a6a44", stroke=INK) -> list[str]:
    (x1, y1), (x2, y2) = a, b
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2 + 12
    out = [f'<path d="M{f(x1)},{f(y1)} Q{f(mx)},{f(my)} {f(x2)},{f(y2)}" fill="none" stroke="{stroke}" stroke-width="7" stroke-linecap="round"/>',
           f'<path d="M{f(x1)},{f(y1)} Q{f(mx)},{f(my)} {f(x2)},{f(y2)}" fill="none" stroke="{color}" stroke-width="4.5" stroke-linecap="round"/>',
           f'<path d="M{f(x1)},{f(y1)} Q{f(mx)},{f(my)} {f(x2)},{f(y2)}" fill="none" stroke="{stroke}" stroke-width="4.5" stroke-dasharray="1 4" opacity="0.5"/>']
    return out


def standard_title(svg, name, jp, sub, x=170, y=58, w=300, compass_at=None):
    title(svg, x, y, name, jp, sub, w)
    cxy = compass_at or (svg.w - 56, 70)
    svg.add(compass(cxy[0], cxy[1], 32, INK, PAPER, "#c0392b"))


# =============================================================================
# SUNAGAKURE — 1000 × 700 · villaggio nel deserto, chiuso da un anello di rupi
# =============================================================================
def suna() -> dict:
    W, H = 1000, 700
    rng = random.Random(202)
    svg = Svg(W, H, "Sunagakure no Sato · 砂隠れの里", CREDIT)
    P = {
        "loc-suna-main-gate": (188, 372),
        "loc-suna-kazekage-office": (540, 300),
        "loc-suna-council": (632, 388),
        "loc-suna-hospital": (676, 240),
        "loc-suna-academy": (742, 430),
        "loc-suna-puppet-workshop": (420, 448),
        "loc-suna-desert-outskirts": (888, 618),
    }
    pins = list(P.values())
    g = svg.gradient("dune", [(0, "#f0d39a"), (1, "#d9a865")])
    svg.add(f'<rect width="{W}" height="{H}" fill="{g}"/>')
    for i in range(16):  # dune
        y = 40 + i * 44 + rng.uniform(-10, 10)
        svg.add(f'<path d="M-20,{f(y)} C200,{f(y - 30)} 380,{f(y + 26)} 560,{f(y - 8)} S860,{f(y + 30)} 1020,{f(y - 10)}" fill="none" stroke="#b9864a" stroke-width="2" opacity="0.35"/>')
    svg.add(dots(rng, (0, 0, W, H), 900, "#8a5e2e", (0.5, 1.3)))
    cx, cy, rx, ry = 530, 372, 330, 250
    outer = jagged(ellipse_pts(cx, cy, rx + 70, ry + 62, 40), rng, 0.05, 3)
    inner = jagged(ellipse_pts(cx, cy, rx, ry, 40), rng, 0.04, 3)
    # rupi: anello con varco a ovest (l'unico ingresso)
    svg.add(f'<path d="{smooth(outer)} {smooth(inner)}" fill="#b07a48" fill-rule="evenodd" stroke="{INK}" stroke-width="2"/>')
    for k in range(6):
        e = jagged(ellipse_pts(cx, cy, rx + 12 + k * 10, ry + 10 + k * 9, 40), rng, 0.04, 2)
        svg.add(f'<path d="{smooth(e)}" fill="none" stroke="#7d5230" stroke-width="1.2" opacity="0.45"/>')
    svg.add(f'<path d="{smooth(inner)}" fill="#e7c48a" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M110,346 L215,352 L215,392 L110,398 Z" fill="#e7c48a"/>')  # varco
    svg.add(f'<path d="M110,346 L215,352 M110,398 L215,392" stroke="{INK}" stroke-width="2"/>')
    for x in (130, 150, 170, 190):
        svg.add(f'<path d="M{x},350 l6,-14 M{x},396 l6,14" stroke="#7d5230" stroke-width="2"/>')
    # strade di sabbia battuta
    for s in ([(200, 372), (360, 380), (540, 330)], [(540, 330), (640, 400), (760, 440)], [(420, 450), (540, 330), (676, 250)]):
        svg.add(road(s, 9, "#f2dcae", "#b9864a"))
    # case a cupola
    ok = both(lambda x, y: ((x - cx) / (rx - 24)) ** 2 + ((y - cy) / (ry - 24)) ** 2 <= 1,
              far_from(pins, 30), lambda x, y: (x - 540) ** 2 + (y - 300) ** 2 > 80 ** 2)
    out = ["<g>"]
    for x, y in sorted(scatter(rng, 170, (cx - rx, cy - ry, cx + rx, cy + ry), ok, mind=26), key=lambda p: p[1]):
        out += domehouse(x, y, rng.uniform(9, 15), rng.choice(["#e2c48e", "#d9b47c", "#ecd2a0"]), rng.choice(["#d6b278", "#c99f62", "#e0bf86"]))
    out.append("</g>")
    svg.add(out)
    # palazzo del Kazekage (grande cupola con 風), ospedale, consiglio, accademia, laboratorio marionette
    svg.add(domehouse(540, 330, 64, "#e8c98e", "#d8b070", win=False))
    svg.add(text(540, 312, "風", size=40, fill="#7d3a1e", family=JP, weight="bold"))
    for (x, y, r) in ((676, 262, 30), (632, 402, 26), (742, 448, 30), (420, 466, 24)):
        svg.add(domehouse(x, y, r, "#ecd2a0", "#cfa66a"))
    svg.add(f'<path d="M669,236 h14 M676,229 v14" stroke="#c0392b" stroke-width="3.5"/>')
    # cisterne/serre (oasi interna)
    svg.add(f'<ellipse cx="340" cy="270" rx="46" ry="18" fill="#7cc0dc" stroke="#3e7f9c" stroke-width="2"/>')
    svg.add(trees([(300, 262), (380, 262), (330, 296), (360, 250)], rng, r=7, kind="palm", fill="#5e8a3a"))
    svg.add(region_label(888, 560, "Deserto", sub="Kaze no Kuni · Land of Wind", size=17, color="#5a3a1a", halo="#f0d39a"))
    standard_title(svg, "Sunagakure", "砂隠れの里", "Villaggio della Sabbia · Hidden Sand", w=290)
    save(svg, "naruto-suna.svg", P)
    return P


# =============================================================================
# KIRIGAKURE — 1000 × 700 · torri cilindriche tra acqua e nebbia
# =============================================================================
def kiri() -> dict:
    W, H = 1000, 700
    rng = random.Random(303)
    svg = Svg(W, H, "Kirigakure no Sato · 霧隠れの里", CREDIT)
    P = {
        "loc-kiri-mizukage-office": (500, 284),
        "loc-kiri-academy": (346, 372),
        "loc-kiri-swordsmen-hall": (584, 430),
        "loc-kiri-training": (296, 520),
        "loc-kiri-prison": (790, 236),
        "loc-kiri-harbor": (742, 548),
    }
    pins = list(P.values())
    main = jagged([(170, 200), (330, 150), (520, 160), (660, 210), (700, 330), (660, 470), (560, 560), (380, 600), (220, 560), (150, 420)], rng, 0.08, 3)
    isle = jagged(ellipse_pts(796, 250, 70, 50, 12), rng, 0.1, 2)
    sea(svg, "#6f95a3", "#4e7480", "#d8ecf0", rng, [main, isle], n=140, wave_w=14, opacity=0.4)
    island(svg, main, "#7e9a74", stroke=INK, shallow="#9fc0c6", beach="#c9c2a4")
    island(svg, isle, "#7d7f7a", stroke=INK, shallow="#9fc0c6", beach=None)
    svg.add(forest(svg, main, rng, 0.0009, 9, avoid=both(far_from(pins, 40), lambda x, y: (x - 480) ** 2 + (y - 360) ** 2 > 210 ** 2),
                   fill="#4f7259", dark="#2c4434", light="#6f9378", stroke="#1d2e22"))
    for s in ([(300, 520), (346, 380), (500, 300)], [(500, 300), (584, 430), (700, 540)], [(346, 380), (584, 430)]):
        svg.add(road(s, 8, "#cfd3c8", "#6c7a6e"))
    svg.add(bridge((660, 260), (740, 248), "#6d6a62"))
    # torri cilindriche con cupole verdi/blu (stile Kiri)
    ok = both(lambda x, y: pip(x, y, scale_pts_(main, 0.82)), far_from(pins, 26), lambda x, y: (x - 500) ** 2 + (y - 290) ** 2 > 70 ** 2)
    out = ["<g>"]
    for x, y in sorted(scatter(rng, 90, (180, 180, 700, 600), ok, mind=30), key=lambda p: p[1]):
        r = rng.uniform(8, 13)
        out += cylinder(x, y, r, rng.uniform(16, 34), rng.choice(["#c9cfc8", "#b8c2bc", "#d6d8cf"]), rng.choice(["#5f9a8a", "#4f7f9a", "#6aa38c"]))
    out.append("</g>")
    svg.add(out)
    svg.add(cylinder(500, 312, 50, 70, "#d9ddd2", "#4f8f7a", kanji="水", kcolor="#1d4a5a"))
    svg.add(cylinder(584, 448, 30, 30, "#c9cfc8", "#3f5f6f"))
    svg.add(cylinder(346, 392, 30, 30, "#d6d8cf", "#5f9a8a"))
    svg.add(cylinder(790, 256, 28, 40, "#8c8e88", "#4a4c48"))
    for i in range(5):  # sbarre della prigione
        svg.add(f'<path d="M{776 + i * 7},{232} v-22" stroke="{INK}" stroke-width="1.5"/>')
    svg.add(clearing(296, 528, 52, 30, "#a9b49a", rng))
    svg.add(posts(296, 532, 0.9))
    # porto: moli e barche
    for i in range(4):
        x = 680 + i * 34
        svg.add(f'<rect x="{x}" y="520" width="10" height="70" fill="#8a6a44" stroke="{INK}" stroke-width="1.2"/>')
    from kit import ship
    for (x, y) in ((700, 618), (770, 630), (840, 600)):
        svg.add(ship(x, y, 0.7, sail="#e6eef0", flag="#3f5f6f"))
    # nebbia (霧)
    for _ in range(26):
        x, y = rng.uniform(-50, W + 50), rng.uniform(-30, H + 30)
        if any((x - a) ** 2 + (y - b) ** 2 < 70 ** 2 for a, b in pins):
            continue
        svg.add(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(rng.uniform(90, 180))}" ry="{f(rng.uniform(22, 40))}" fill="#f2f6f6" opacity="{rng.uniform(0.25, 0.45):.2f}"/>')
    svg.add(region_label(880, 470, "Mizu no Kuni", sub="Land of Water", size=16, color="#173a44", halo="#d8ecf0"))
    standard_title(svg, "Kirigakure", "霧隠れの里", "Villaggio della Nebbia · Hidden Mist", w=290)
    save(svg, "naruto-kiri.svg", P)
    return P


# =============================================================================
# IWAGAKURE — 1000 × 700 · villaggio scolpito nei pinnacoli, ponti di roccia
# =============================================================================
def iwa() -> dict:
    W, H = 1000, 700
    rng = random.Random(404)
    svg = Svg(W, H, "Iwagakure no Sato · 岩隠れの里", CREDIT)
    P = {
        "loc-iwa-tsuchikage-office": (520, 160),
        "loc-iwa-central-plaza": (520, 440),
        "loc-iwa-academy": (330, 300),
        "loc-iwa-cliffside-gate": (170, 520),
        "loc-iwa-training": (720, 500),
    }
    pins = list(P.values())
    g = svg.gradient("rock", [(0, "#9d8166"), (1, "#7a6048")])
    svg.add(f'<rect width="{W}" height="{H}" fill="{g}"/>')
    svg.add(dots(rng, (0, 0, W, H), 700, "#3f2e1e", (0.6, 1.6)))
    # canyon e strade
    svg.add(patch(jagged([(120, 520), (300, 420), (520, 400), (760, 470), (900, 560), (760, 620), (520, 560), (300, 600)], rng, 0.06, 2), "#b89a78", stroke="#6b5038", sw=2))
    for s in ([(150, 520), (330, 400), (520, 430)], [(520, 430), (720, 500)], [(520, 430), (520, 300)]):
        svg.add(road(s, 9, "#d8c2a0", "#7a6048"))
    # pinnacoli abitati (finestre scavate)
    fixed = [(520, 300, 82, 140), (330, 400, 52, 100)]
    spots = scatter(rng, 22, (60, 140, 960, 690), both(far_from(pins + [(520, 300), (330, 400)], 85),
                    lambda x, y: (x - 520) ** 2 + (y - 440) ** 2 > 110 ** 2), mind=95)
    towers = sorted([(x, y, rng.uniform(28, 46), rng.uniform(60, 140)) for x, y in spots] + fixed, key=lambda p: p[1])
    tops: list = []
    out = ["<g>"]
    for x, y, rx, h in towers:
        out += mesa(x, y, rx, h, "#b8936a", "#8f6c4c", rng=rng, green="#7d8a52")
        for k in range(int(h / 22)):
            wx = x + rng.uniform(-rx * 0.7, rx * 0.7)
            wy = y - h + rx * 0.4 + 10 + k * 20 + rng.uniform(-4, 4)
            out.append(f'<rect x="{f(wx)}" y="{f(wy)}" width="5" height="7" rx="2" fill="#3a2a1a" opacity="0.8"/>')
        tops.append((x, y - h))
    out.append("</g>")
    svg.add(out)
    # ponti tra le cime
    for i in range(len(tops) - 1):
        a, b = tops[i], tops[i + 1]
        if math.hypot(a[0] - b[0], a[1] - b[1]) < 200:
            svg.add(bridge(a, b, "#8a6a44"))
    svg.add(domehouse(520, 190, 34, "#c9a87e", "#9a7a54", win=False))
    svg.add(text(520, 244, "土", size=40, fill="#f3e2c0", family=JP, weight="bold"))
    svg.add(domehouse(330, 318, 20, "#c9a87e", "#9a7a54"))
    svg.add(clearing(720, 506, 50, 28, "#c8ad86", rng))
    svg.add(posts(720, 510, 0.9))
    svg.add(f'<path d="M150,540 l0,-34 l40,0 l0,34" fill="none" stroke="{INK}" stroke-width="5"/>')
    svg.add(f'<path d="M144,506 h52" stroke="#5a3a20" stroke-width="7"/>')
    svg.add(region_label(860, 660, "Tsuchi no Kuni", sub="Land of Earth", size=16, color="#2e2014", halo="#b89a78"))
    standard_title(svg, "Iwagakure", "岩隠れの里", "Villaggio della Roccia · Hidden Stone", w=290)
    save(svg, "naruto-iwa.svg", P)
    return P


# =============================================================================
# KUMOGAKURE — 1000 × 700 · vette tra le nuvole, edifici a cupola bianca
# =============================================================================
def kumo() -> dict:
    W, H = 1000, 700
    rng = random.Random(505)
    svg = Svg(W, H, "Kumogakure no Sato · 雲隠れの里", CREDIT)
    P = {
        "loc-kumo-raikage-office": (470, 300),
        "loc-kumo-main-tower": (586, 190),
        "loc-kumo-training": (330, 450),
        "loc-kumo-academy": (660, 400),
        "loc-kumo-mountain-paths": (800, 520),
    }
    pins = list(P.values())
    g = svg.gradient("sky", [(0, "#a9c3d9"), (1, "#e3ecf2")])
    svg.add(f'<rect width="{W}" height="{H}" fill="{g}"/>')
    # mare di nuvole sul fondo
    for i in range(18):
        svg.add(cloud(rng.uniform(-60, W), rng.uniform(560, 720), rng.uniform(160, 300), "#ffffff", 0.9))
    # picchi rocciosi (aghi) con edifici
    peaks = [(470, 420, 120, 230), (586, 330, 70, 210), (330, 560, 90, 190), (660, 520, 85, 180), (800, 640, 90, 170),
             (190, 420, 70, 220), (880, 400, 60, 230), (120, 640, 70, 160), (420, 650, 70, 140), (560, 680, 60, 120)]
    out = ["<g>"]
    for x, y, rx, h in sorted(peaks, key=lambda p: p[1]):
        out += mesa(x, y, rx, h, "#a3a9ad", "#6c7378", rng=rng)
        for k in range(3):
            out.append(f'<path d="M{f(x - rx * 0.6 + k * rx * 0.5)},{f(y - h + 18)} l{f(rng.uniform(-8, 8))},{f(h * 0.8)}" stroke="#4e5458" stroke-width="2" opacity="0.5"/>')
        top_y = y - h
        for _ in range(int(rx / 18)):
            bx = x + rng.uniform(-rx * 0.6, rx * 0.6)
            by = top_y + rng.uniform(-rx * 0.15, rx * 0.2)
            if all((bx - a) ** 2 + (by - b) ** 2 > 26 ** 2 for a, b in pins):
                out += domehouse(bx, by, rng.uniform(8, 12), "#eef1f2", "#cfd8de")
    out.append("</g>")
    svg.add(out)
    # palazzo del Raikage (grande cupola con 雷) e la Grande Torre
    svg.add(domehouse(470, 322, 56, "#f4f6f6", "#d9e2e8", win=False))
    svg.add(text(470, 300, "雷", size=34, fill="#b8860b", family=JP, weight="bold"))
    svg.add(tower(586, 214, 30, 80, "#eef1f2", "#5b7fa8"))
    svg.add(clearing(330, 386, 46, 22, "#b7bcb2", rng))
    svg.add(posts(330, 390, 0.85))
    svg.add(domehouse(660, 360, 26, "#eef1f2", "#cfd8de"))
    # scale e passerelle tra le vette
    for a, b in (((470, 190), (586, 120)), ((470, 190), (330, 370)), ((586, 120), (660, 340)), ((660, 340), (800, 470)), ((880, 170), (586, 120))):
        svg.add(bridge(a, b, "#a8a29a"))
    # nuvole sospese davanti
    for (x, y, w) in ((140, 200, 220), (860, 300, 200), (320, 120, 160), (760, 90, 180)):
        svg.add(cloud(x, y, w, "#ffffff", 0.7))
    # fulmini stilizzati
    for (x, y) in ((90, 90), (930, 210)):
        svg.add(f'<path d="M{x},{y} l-14,34 h12 l-10,32 l30,-44 h-14 l12,-22 Z" fill="#f2d33a" stroke="{INK}" stroke-width="1.2"/>')
    svg.add(region_label(160, 690 - 30, "Kaminari no Kuni", sub="Land of Lightning", size=16, color="#24323c", halo="#ffffff"))
    standard_title(svg, "Kumogakure", "雲隠れの里", "Villaggio della Nuvola · Hidden Cloud", w=300)
    save(svg, "naruto-kumo.svg", P)
    return P


# =============================================================================
# AMEGAKURE — 1000 × 700 · torri industriali sul lago, pioggia perenne
# =============================================================================
def ame() -> dict:
    W, H = 1000, 700
    rng = random.Random(606)
    svg = Svg(W, H, "Amegakure no Sato · 雨隠れの里", CREDIT)
    P = {
        "loc-ame-central-tower": (500, 300),
        "loc-ame-konan-quarters": (630, 222),
        "loc-ame-bridges": (664, 440),
        "loc-ame-orphan-hideout": (190, 520),
    }
    pins = list(P.values())
    lake = jagged(ellipse_pts(500, 360, 470, 330, 30), rng, 0.04, 2)
    g = svg.gradient("ameLand", [(0, "#4d5a52"), (1, "#3a443e")])
    svg.add(f'<rect width="{W}" height="{H}" fill="{g}"/>')
    svg.add(f'<path d="{smooth(lake)}" fill="#5f7480" stroke="#2a3238" stroke-width="2"/>')
    city = jagged(ellipse_pts(520, 330, 280, 210, 18), rng, 0.06, 2)
    svg.add(f'<path d="{smooth(city)}" fill="#6c7072" stroke="#2a2e30" stroke-width="2"/>')
    for i in range(30):  # cerchi di pioggia sul lago
        x, y = rng.uniform(40, 960), rng.uniform(40, 660)
        if pip(x, y, lake) and not pip(x, y, city):
            svg.add(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="9" ry="3" fill="none" stroke="#c9d6dc" stroke-width="1" opacity="0.6"/>')
    # torri (grattacieli grigi con tubature)
    spots = scatter(rng, 60, (240, 120, 800, 560), both(lambda x, y: pip(x, y, scale_pts_(city, 0.9)), far_from(pins, 34),
                                                    lambda x, y: (x - 500) ** 2 + (y - 320) ** 2 > 70 ** 2), mind=36)
    out = ["<g>"]
    for x, y in sorted(spots, key=lambda p: p[1]):
        w = rng.uniform(16, 26)
        h = rng.uniform(40, 110)
        c = rng.choice(["#8a8f92", "#7a7f82", "#9a9fa2"])
        out.append(f'<rect x="{f(x - w / 2)}" y="{f(y - h)}" width="{f(w)}" height="{f(h)}" fill="{c}" stroke="{INK}" stroke-width="1"/>')
        out.append(f'<rect x="{f(x - w / 2)}" y="{f(y - h)}" width="{f(w * 0.35)}" height="{f(h)}" fill="{shade(c, -0.25)}"/>')
        for k in range(int(h / 14)):
            out.append(f'<rect x="{f(x + w * 0.05)}" y="{f(y - h + 6 + k * 14)}" width="{f(w * 0.3)}" height="3" fill="#d9c27a" opacity="0.55"/>')
        if rng.random() < 0.5:
            out.append(f'<path d="M{f(x + w / 2)},{f(y - h * 0.6)} h{f(rng.uniform(8, 18))} v{f(h * 0.5)}" fill="none" stroke="#5a5f62" stroke-width="3"/>')
    out.append("</g>")
    svg.add(out)
    # torre centrale (la più alta), alloggi di Konan, rete di ponti
    svg.add(f'<rect x="478" y="140" width="44" height="190" fill="#7d8285" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<rect x="478" y="140" width="16" height="190" fill="#5f6466"/>')
    svg.add(f'<path d="M468,140 L500,96 L532,140 Z" fill="#5a5f62" stroke="{INK}" stroke-width="1.6"/>')
    for k in range(5):
        svg.add(f'<path d="M478,{170 + k * 32} h-22 v18 M522,{180 + k * 32} h22 v14" fill="none" stroke="#4a4f52" stroke-width="3"/>')
    svg.add(f'<rect x="612" y="160" width="36" height="66" fill="#8a8f92" stroke="{INK}" stroke-width="1.4"/>')
    for k in range(4):  # origami di carta di Konan
        x, y = 600 + k * 14, 150 - k * 6
        svg.add(f'<path d="M{x},{y} l6,-8 l6,8 l-6,3 Z" fill="#f4f1ea" stroke="{INK}" stroke-width="0.8"/>')
    for a, b in (((560, 420), (720, 450)), ((610, 470), (780, 420)), ((540, 470), (640, 520)), ((720, 450), (840, 500))):
        svg.add(bridge(a, b, "#6a6560"))
    # rifugio degli orfani (capanna fuori città)
    svg.add(house(190, 540, 26, "#8a7a62", "#4a3a2a"))
    # pioggia
    rain = ["<g stroke=\"#d6e2e8\" stroke-width=\"1\" opacity=\"0.35\">"]
    for _ in range(650):
        x, y = rng.uniform(0, W), rng.uniform(0, H)
        rain.append(f'<path d="M{f(x)},{f(y)} l-5,14"/>')
    rain.append("</g>")
    svg.add(rain)
    svg.add(region_label(160, 650, "Ame no Kuni", sub="Land of Rain", size=16, color="#e6ecef", halo="#2a3238"))
    standard_title(svg, "Amegakure", "雨隠れの里", "Villaggio della Pioggia · Hidden Rain", w=290)
    save(svg, "naruto-ame.svg", P)
    return P


# =============================================================================
# OTOGAKURE — 1000 × 700 · covi sotterranei di Orochimaru sotto le risaie
# =============================================================================
def oto() -> dict:
    W, H = 1000, 700
    rng = random.Random(707)
    svg = Svg(W, H, "Otogakure no Sato · 音隠れの里", CREDIT)
    P = {
        "loc-oto-sound-base": (540, 176),
        "loc-oto-lab-main": (500, 330),
        "loc-oto-cells": (330, 410),
        "loc-oto-training": (676, 420),
    }
    pins = list(P.values())
    svg.add(f'<rect width="{W}" height="{H}" fill="#8aa86a"/>')
    # risaie (Ta no Kuni) a griglia
    for i in range(0, W, 46):
        for j in range(0, H, 34):
            if rng.random() < 0.7:
                c = rng.choice(["#9fbf72", "#a9c77e", "#8fb466", "#b7cf8a"])
                svg.add(f'<rect x="{i + 2}" y="{j + 2}" width="42" height="30" fill="{c}" stroke="#6f8a4e" stroke-width="1"/>')
    svg.add(forest(svg, jagged([(0, 0), (260, 0), (300, 120), (200, 220), (0, 260)], rng, 0.05, 2), rng, 0.0026, 10,
                   fill="#4f7a3a", dark="#2c4a22", light="#6f9e50", stroke="#1f3418"))
    svg.add(forest(svg, jagged([(760, 0), (1000, 0), (1000, 300), (840, 240)], rng, 0.05, 2), rng, 0.0026, 10,
                   fill="#4f7a3a", dark="#2c4a22", light="#6f9e50", stroke="#1f3418"))
    # collina rocciosa che nasconde il covo
    hill = jagged(ellipse_pts(510, 330, 300, 200, 16), rng, 0.08, 2)
    svg.add(patch(scale_pts_(hill, 1.08), "#6f7f5a", stroke=INK, sw=1.5))
    svg.add(patch(hill, "#8b8f7a", stroke=INK, sw=2))
    # sezione delle gallerie sotterranee (tratteggio = sotto terra)
    svg.add(f'<path d="{smooth(scale_pts_(hill, 0.92))}" fill="#2b2a33" opacity="0.55"/>')
    chambers = [(500, 330, 70, 44), (330, 410, 54, 34), (676, 420, 64, 38), (540, 176, 60, 34)]
    for x, y, rx, ry in chambers:
        svg.add(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="#4a4656" stroke="#c9b9e0" stroke-width="2" stroke-dasharray="6 4"/>')
    for a, b in (((500, 330), (330, 410)), ((500, 330), (676, 420)), ((500, 330), (540, 176))):
        svg.add(f'<path d="M{a[0]},{a[1]} L{b[0]},{b[1]}" stroke="#c9b9e0" stroke-width="10" opacity="0.25"/>')
        svg.add(f'<path d="M{a[0]},{a[1]} L{b[0]},{b[1]}" stroke="#c9b9e0" stroke-width="2" stroke-dasharray="6 5"/>')
    rim = [p for p in scatter(rng, 80, (180, 110, 840, 560), lambda x, y: pip(x, y, scale_pts_(hill, 1.06)) and not pip(x, y, scale_pts_(hill, 0.96)), mind=16)]
    svg.add(wood(svg, rim, rng, r=9, fill="#4f7a3a", dark="#2c4a22", light="#6f9e50", stroke="#1f3418", sw=0.8))
    # celle (sbarre) e vasche del laboratorio
    for i in range(6):
        svg.add(f'<path d="M{306 + i * 9},398 v24" stroke="#c9b9e0" stroke-width="1.6"/>')
    for (x, y) in ((470, 322), (500, 316), (530, 322)):
        svg.add(f'<rect x="{x - 7}" y="{y - 14}" width="14" height="24" rx="5" fill="#7fd0b0" stroke="#c9b9e0" stroke-width="1" opacity="0.8"/>')
    # ingressi nascosti (bocche nella roccia) e serpenti stilizzati nelle gallerie
    for (x, y) in ((260, 300), (760, 300), (510, 520)):
        svg.add(f'<path d="M{x - 14},{y} q14,-24 28,0 Z" fill="#1d1a22" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<path d="M600,250 q20,-16 40,0 t40,0 t40,0" fill="none" stroke="#9a7fc0" stroke-width="3" opacity="0.6"/>')
    svg.add(text(500, 270, "音", size=34, fill="#e8dcff", family=JP, weight="bold", opacity=0.85))
    svg.add(region_label(860, 620, "Ta no Kuni", sub="Land of Rice Fields", size=16, color="#2a3a1a", halo="#c9dba0"))
    svg.add(text(500, 560, "covi sotterranei · underground hideouts", size=13, fill="#e8dcff", italic=True, halo="#2b2a33", halo_w=3))
    standard_title(svg, "Otogakure", "音隠れの里", "Villaggio del Suono · Hidden Sound", w=290)
    save(svg, "naruto-oto.svg", P)
    return P


# =============================================================================
# UZUSHIOGAKURE — 1000 × 700 · isola in rovina tra i vortici
# =============================================================================
def uzu() -> dict:
    W, H = 1000, 700
    rng = random.Random(808)
    svg = Svg(W, H, "Uzushiogakure no Sato · 渦潮隠れの里", CREDIT)
    P = {
        "loc-uzu-ruins-center": (470, 320),
        "loc-uzu-sealing-shrine": (330, 420),
        "loc-uzu-whirlpool": (790, 470),
    }
    pins = list(P.values())
    land = jagged([(200, 200), (360, 150), (560, 170), (660, 260), (640, 400), (540, 500), (360, 540), (220, 470), (170, 330)], rng, 0.1, 3)
    sea(svg, "#3f7f9a", "#2a5f78", "#cfe8ef", rng, [land], n=150, wave_w=14, opacity=0.4)
    for (x, y, r) in ((790, 470, 90), (860, 220, 60), (150, 600, 70), (700, 630, 55), (90, 140, 50), (930, 620, 45)):
        for k in range(3):
            svg.add(spiral(x, y, r - k * 6, 2.6, "#e6f4f8", 2.2 - k * 0.5, 0.75 - k * 0.2, cw=(k % 2 == 0)))
    island(svg, land, "#8fae7a", stroke=INK, shallow="#7fb8c9", beach="#d9cc9e")
    svg.add(forest(svg, land, rng, 0.0016, 9, avoid=far_from(pins + [(470, 320)], 70),
                   fill="#5f8a4a", dark="#34522a", light="#86b060"))
    # rovine: muri spezzati, colonne
    out = ["<g>"]
    for x, y in scatter(rng, 26, (360, 230, 600, 410), far_from(pins, 26), mind=26):
        w = rng.uniform(16, 30)
        out.append(f'<path d="M{f(x - w / 2)},{f(y)} v-12 l5,-4 l4,6 l6,-8 l{f(w - 15)},6 v12 Z" fill="#a39a88" stroke="{INK}" stroke-width="1"/>')
    out.append("</g>")
    svg.add(out)
    svg.add(f'<circle cx="470" cy="320" r="44" fill="none" stroke="#b9ab90" stroke-width="10" opacity="0.8"/>')
    svg.add(spiral(470, 320, 30, 2.2, "#b03a2e", 5, 0.95))
    svg.add(f'<path d="M318,438 h26 M322,432 h18 M325,432 v16 M337,432 v16" stroke="#b03a2e" stroke-width="3"/>')
    svg.add(region_label(800, 620, "Uzu no Kuni", sub="Land of Whirlpools", size=16, color="#0f2f3c", halo="#cfe8ef"))
    standard_title(svg, "Uzushiogakure", "渦潮隠れの里", "Villaggio dei Vortici · Hidden Whirlpool", w=310)
    save(svg, "naruto-uzu.svg", P)
    return P


# =============================================================================
# TAKIGAKURE — 1000 × 700 · dietro la cascata, attorno all'albero gigante
# =============================================================================
def taki() -> dict:
    W, H = 1000, 700
    rng = random.Random(909)
    svg = Svg(W, H, "Takigakure no Sato · 滝隠れの里", CREDIT)
    P = {
        "loc-taki-hidden-access": (520, 178),
        "loc-taki-hero-water": (606, 452),
        "loc-taki-center": (318, 470),
    }
    pins = list(P.values())
    svg.add(f'<rect width="{W}" height="{H}" fill="#6f9a52"/>')
    # rupe e cascata a nord
    svg.add(f'<path d="M0,0 H1000 V150 C820,170 700,120 600,140 C520,150 470,150 420,140 C300,120 160,170 0,150 Z" fill="#8a8172" stroke="{INK}" stroke-width="2"/>')
    for i in range(8):
        svg.add(f'<path d="M0,{30 + i * 15} C300,{20 + i * 16} 700,{20 + i * 16} 1000,{30 + i * 15}" fill="none" stroke="#6a6152" stroke-width="1" opacity="0.5"/>')
    svg.add(f'<path d="M440,0 H600 V150 C560,160 480,160 440,150 Z" fill="#a9d8ec" stroke="#3e7f9c" stroke-width="2"/>')
    for i in range(10):
        x = 450 + i * 15
        svg.add(f'<path d="M{x},0 C{x + 4},50 {x - 4},100 {x + 2},150" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.7"/>')
    svg.add(f'<ellipse cx="520" cy="168" rx="110" ry="24" fill="#ffffff" opacity="0.6"/>')
    # fiume e lago con l'isola dell'albero
    svg.add(river([(520, 170), (540, 250), (560, 300)], 34, "#8fcbe0", "#3e7f9c"))
    lake = jagged(ellipse_pts(560, 400, 210, 120, 18), rng, 0.06, 2)
    svg.add(f'<path d="{smooth(lake)}" fill="#8fcbe0" stroke="#3e7f9c" stroke-width="3"/>')
    svg.add(river([(700, 470), (800, 560), (860, 720)], 22, "#8fcbe0", "#3e7f9c"))
    isle = jagged(ellipse_pts(560, 430, 70, 40, 12), rng, 0.08, 2)
    svg.add(patch(isle, "#7fa860", stroke=INK, sw=2))
    svg.add(big_tree(560, 440, 0.95, leaf="#3f7a34", dark="#24461e", light="#6fb04e"))
    # foreste e villaggio
    svg.add(forest(svg, [(0, 150), (420, 150), (300, 300), (0, 300)], rng, 0.0022, 10, fill="#4f7a3a", dark="#2c4a22", light="#6f9e50"))
    svg.add(forest(svg, [(640, 150), (1000, 150), (1000, 420), (780, 330)], rng, 0.0022, 10, fill="#4f7a3a", dark="#2c4a22", light="#6f9e50"))
    svg.add(forest(svg, [(0, 560), (300, 600), (420, 700), (0, 700)], rng, 0.0022, 10, fill="#4f7a3a", dark="#2c4a22", light="#6f9e50"))
    svg.add(forest(svg, [(760, 520), (1000, 460), (1000, 700), (880, 700)], rng, 0.0022, 10, fill="#4f7a3a", dark="#2c4a22", light="#6f9e50"))
    roofs = ["#a8644a", "#7a8f6a", "#c98a4e", "#8a7a62"]
    svg.add(blocks(rng, 60, (180, 380, 480, 600), both(lambda x, y: not pip(x, y, lake), far_from(pins, 20),
                                                     lambda x, y: ((x - 330) / 160) ** 2 + ((y - 480) / 110) ** 2 <= 1), roofs, (14, 22), 22))
    svg.add(blocks(rng, 30, (640, 300, 860, 470), both(lambda x, y: not pip(x, y, lake), far_from(pins, 20)), roofs, (14, 22), 22))
    svg.add(bridge((380, 420), (500, 410), "#8a6a44"))
    svg.add(region_label(860, 640, "Taki no Kuni", sub="Land of Waterfalls", size=16, color="#1f3418", halo="#c9dba0"))
    standard_title(svg, "Takigakure", "滝隠れの里", "Villaggio della Cascata · Hidden Waterfall", w=320)
    save(svg, "naruto-taki.svg", P)
    return P


ALL = [konoha, suna, kiri, iwa, kumo, ame, oto, uzu, taki]

if __name__ == "__main__":
    pins: dict = {}
    for fn in ALL:
        pins.update(fn())
    apply_pins("naruto", pins)
