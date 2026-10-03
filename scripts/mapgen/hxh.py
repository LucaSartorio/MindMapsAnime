#!/usr/bin/env python3
"""Sotto-mappe ORIGINALI di Hunter x Hunter.

Ricostruzioni AniMapVerse (nessuna mappa ufficiale riprodotta):
  * Torre Celeste — 991 m, 251 piani: atrio, piani 200+ (solo utenti Nen), Floor Master, 251°.
  * Monte Kukuroo — la Porta della Prova (7 battenti), il sentiero di Mike, la casa dei
    maggiordomi, la villa Zoldyck nella nebbia sulla cima.
  * Greed Island — isola del gioco: Punto di Partenza, Antokiba (la più vicina al centro),
    Masadora (città della magia), Dorias (azzardo), Limeiro (castello dei Game Master),
    Aiai, Soufrabi sul mare, Rubicuta, Bunzen, il porto (unica uscita), le Badlands.
  * Palazzo di East Gorteau (Peijin) — porta, cortile, torre del trono, sala del Gungi.
  * Yorknew City — Cemetery Building (asta), centro, mercato, covo della Brigata, deserto, aeroporto di Lingon.
  * Whale Island — porto, casa di Mito, foresta (Kite), lago del Signore del Lago.
  * NGL — posto di confine, costa (approdo della Regina), nido, radura dello scontro di Kite.
  * Black Whale 1 — sezione schematica dei Tier (1 · 2–3 · 4–5).

    python3 scripts/mapgen/hxh.py  → public/assets/worlds/hunterxhunter/maps/*.svg + pin
"""
from __future__ import annotations

import math
import random
import sys

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from kit import (JP, SERIF, Svg, apply_pins, arena, big_tree, both, castle, compass, dome, dots,
                 ellipse_pts, f, far_from, forest, house, island, jagged, mountain, mountain_range,
                 out_path, patch, path_line, pip, plaque, poly, preview, region_label, river, road,
                 scale_pts, scatter, sea, shade, ship, smooth, text, tower, town, trees, wood)

INK = "#2b2620"
PAPER = "#efe4c8"
CREDIT = "Ricostruzione originale AniMapVerse · CC0 · non è materiale ufficiale di Hunter x Hunter"


def save(svg: Svg, name: str, pins: dict) -> None:
    svg.save(out_path("hunterxhunter", name))
    preview(svg.path, pins, svg.w, svg.h)


def title(svg, x, y, name, sub, w=320, jp=None):
    svg.add(plaque(x, y, w, 86 if not jp else 100, name, sub=sub, jp=jp, fill="#26302c", stroke="#c9b27a",
                   ink="#f1e6c6", size=28))


# =============================================================================
# TORRE CELESTE (天空闘技場) — 1000 × 1400
# =============================================================================
def heavens_arena() -> dict:
    W, H = 1000, 1400
    rng = random.Random(11)
    svg = Svg(W, H, "Heavens Arena · 天空闘技場", CREDIT)
    P = {
        "loc-hxh-ha-floor251": (500, 196),
        "loc-hxh-ha-floor200": (500, 420),
        "loc-hxh-ha-entrance": (500, 1290),
    }
    sky = svg.gradient("sky", [(0, "#1d2a4a"), (0.45, "#5a7fae"), (1, "#c9dcea")])
    svg.add(f'<rect width="{W}" height="{H}" fill="{sky}"/>')
    svg.add(dots(rng, (0, 0, W, 360), 160, "#ffffff", (0.5, 1.3), None, (0.3, 0.8)))
    # città ai piedi della torre
    for i in range(46):
        x = rng.uniform(0, W)
        if 360 < x < 640:
            continue
        w, h = rng.uniform(26, 60), rng.uniform(60, 190)
        c = rng.choice(["#6b7a8f", "#7a889c", "#5c6a80", "#8995a8"])
        svg.add(f'<rect x="{f(x - w / 2)}" y="{f(1340 - h)}" width="{f(w)}" height="{f(h)}" fill="{c}" stroke="{INK}" stroke-width="1"/>')
        for k in range(int(h / 18)):
            svg.add(f'<rect x="{f(x - w / 2 + 5)}" y="{f(1340 - h + 8 + k * 18)}" width="{f(w - 10)}" height="4" fill="#f4e3a8" opacity="0.35"/>')
    svg.add(f'<rect x="0" y="1336" width="{W}" height="64" fill="#5a6070"/>')
    svg.add(f'<path d="M0,1350 H{W}" stroke="#c9c2a8" stroke-width="3" stroke-dasharray="20 14"/>')
    # la torre: fusto che si assottiglia con anelli, cupola e guglia
    def half(y):  # semi-larghezza alla quota y
        t = (1300 - y) / (1300 - 150)
        return 150 - 108 * t ** 0.85
    left = [(500 - half(y), y) for y in range(1300, 149, -50)]
    right = [(500 + half(y), y) for y in range(150, 1301, 50)]
    body = left + right
    g = svg.gradient("towerG", [(0, "#cfd4dc"), (0.45, "#f2f2ee"), (1, "#9aa3b2")], attrs='x1="0" y1="0" x2="1" y2="0"')
    svg.add(f'<path d="{poly(body)}" fill="{g}" stroke="{INK}" stroke-width="2.4"/>')
    # finestre a nastro e anelli dei piani notevoli
    for y in range(1270, 170, -22):
        hw = half(y) * 0.86
        svg.add(f'<path d="M{f(500 - hw)},{f(y)} Q500,{f(y + 6)} {f(500 + hw)},{f(y)}" fill="none" stroke="#5f6f88" stroke-width="2" opacity="0.45"/>')
    fy = lambda fl: 1290 - (fl - 1) / 250 * (1290 - 196)  # piani in scala lineare
    marks = [(1290, "1F", "atrio · lobby"), (fy(50), "50F", ""), (fy(100), "100F", ""), (fy(150), "150F", ""),
             (fy(200), "200F", "solo Nen · Nen users only"), (fy(230), "230–250F", "Floor Master"), (196, "251F", "")]
    for y, lab, sub in marks:
        hw = half(y)
        svg.add(f'<path d="M{f(500 - hw - 14)},{f(y)} Q500,{f(y + 16)} {f(500 + hw + 14)},{f(y)} L{f(500 + hw + 14)},{f(y + 10)} Q500,{f(y + 26)} {f(500 - hw - 14)},{f(y + 10)} Z" fill="#8c96a8" stroke="{INK}" stroke-width="1.6"/>')
        svg.add(f'<path d="M{f(500 + hw + 18)},{f(y + 4)} H{f(760 if y > 300 else 700)}" stroke="#f1e6c6" stroke-width="1.2" stroke-dasharray="4 4"/>')
        tx = 770 if y > 300 else 710
        svg.add(text(tx, y + 9, lab, size=22, fill="#ffffff", anchor="start", weight="bold", halo="#1d2a4a", halo_w=4))
        if sub:
            svg.add(text(tx, y + 30, sub, size=14, fill="#e6ecf2", anchor="start", italic=True, halo="#1d2a4a", halo_w=3))
    # cupola e guglia sommitali
    svg.add(f'<path d="M418,170 Q500,60 582,170 Z" fill="#e6e8ea" stroke="{INK}" stroke-width="2.2"/>')
    svg.add(f'<path d="M490,96 L500,20 L510,96 Z" fill="#b9c2cf" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<circle cx="500" cy="18" r="5" fill="#f2d33a" stroke="{INK}" stroke-width="1"/>')
    # ingresso con la folla
    svg.add(f'<path d="M440,1336 v-46 a60,40 0 0,1 120,0 v46 Z" fill="#3a4458" stroke="{INK}" stroke-width="2"/>')
    for i in range(40):
        x = rng.uniform(300, 700)
        svg.add(f'<circle cx="{f(x)}" cy="{f(rng.uniform(1352, 1390))}" r="3" fill="{rng.choice(["#2b2620", "#7a3a2a", "#3a5a7a"])}"/>')
    # nuvole a metà torre
    for (x, y, w) in ((180, 560, 260), (820, 560, 240), (260, 330, 200), (860, 900, 220), (120, 980, 200)):
        svg.add(f'<ellipse cx="{x}" cy="{y}" rx="{w / 2}" ry="{w / 7}" fill="#ffffff" opacity="0.65"/>')
    svg.add(text(80, 1200, "991 m", size=24, fill="#ffffff", anchor="start", weight="bold", halo="#2a3550", halo_w=4))
    svg.add(f'<path d="M60,1336 V160 M52,160 H68 M52,1336 H68" stroke="#ffffff" stroke-width="2" opacity="0.7"/>')
    title(svg, 210, 70, "Heavens Arena", "Torre Celeste · 251 piani / floors", 300, jp="天空闘技場")
    save(svg, "hxh-heavens-arena.svg", P)
    return P


# =============================================================================
# MONTE KUKUROO — TENUTA ZOLDYCK — 1200 × 900
# =============================================================================
def zoldyck() -> dict:
    W, H = 1200, 900
    rng = random.Random(22)
    svg = Svg(W, H, "Kukuroo Mountain · Zoldyck Estate · ククルーマウンテン", CREDIT)
    P = {
        "loc-hxh-zd-testing-gate": (210, 690),
        "loc-hxh-zd-butlers": (560, 470),
        "loc-hxh-zd-residence": (900, 250),
        "loc-hxh-zd-torture-room": (1010, 330),
    }
    pins = list(P.values())
    sky = svg.gradient("sky", [(0, "#3a3550"), (1, "#8a8aa0")])
    svg.add(f'<rect width="{W}" height="{H}" fill="{sky}"/>')
    # massiccio della montagna
    mt = [(-20, 900), (-20, 640), (180, 560), (380, 420), (560, 330), (760, 190), (900, 120), (1040, 170), (1220, 260), (1220, 900)]
    svg.add(f'<path d="{smooth(jagged(mt, rng, 0.05, 3), closed=True)}" fill="#3e4a36" stroke="{INK}" stroke-width="2"/>')
    mt2 = [(-20, 900), (-20, 760), (300, 680), (600, 560), (900, 520), (1220, 560), (1220, 900)]
    svg.add(f'<path d="{smooth(mt2)}" fill="#33402d" opacity="0.9"/>')
    # foresta fitta su tutto il monte (il territorio di Mike)
    mpoly = jagged(mt, rng, 0.05, 3)
    ok = both(lambda x, y: pip(x, y, mpoly), far_from(pins, 46), lambda x, y: y > 170)
    svg.add(wood(svg, scatter(rng, 900, (0, 140, W, H), ok, mind=17), rng, r=10, fill="#3f5a34", dark="#1f2e1a",
                 light="#5f7a4a", stroke="#141c10", sw=0.8, kind="pine"))
    # sentiero dalla porta alla villa
    trail = [(210, 700), (330, 640), (430, 560), (560, 480), (650, 420), (760, 330), (860, 270), (900, 250)]
    svg.add(road(trail, 9, "#b9a782", "#4a3e2a"))
    # muro della tenuta e Porta della Prova (7 battenti)
    svg.add(f'<path d="M-10,760 L150,708 L270,672 L420,640 L560,640" fill="none" stroke="#8a8478" stroke-width="16"/>')
    svg.add(f'<path d="M-10,760 L150,708 L270,672 L420,640 L560,640" fill="none" stroke="#b9b3a6" stroke-width="10"/>')
    svg.add(f'<rect x="166" y="610" width="96" height="92" fill="#6c665c" stroke="{INK}" stroke-width="2"/>')
    for i in range(7):
        svg.add(f'<rect x="{172 + i * 12.6}" y="{620 - i * 1.5}" width="11" height="{78 + i * 1.5}" fill="#8a8478" stroke="{INK}" stroke-width="0.8"/>')
    svg.add(text(214, 600, "試しの門", size=14, fill="#f1e6c6", family=JP, halo="#2b2620", halo_w=3))
    # casa dei maggiordomi
    for (x, y) in ((540, 476), (580, 470), (560, 492)):
        svg.add(house(x, y, 26, "#c9bfa8", "#4a3e5a"))
    # la villa nella nebbia, sulla vetta
    svg.add(f'<ellipse cx="930" cy="240" rx="230" ry="70" fill="#d9d6e6" opacity="0.45"/>')
    svg.add(castle(900, 262, 1.15, "#8a8698", "#3a3648", flag=None))
    svg.add(f'<rect x="990" y="300" width="44" height="34" fill="#5a5666" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<path d="M996,300 v34 M1006,300 v34 M1016,300 v34 M1026,300 v34" stroke="{INK}" stroke-width="1.2"/>')
    for (x, y, w) in ((760, 170, 300), (1080, 210, 260), (980, 120, 220), (640, 330, 220)):
        svg.add(f'<ellipse cx="{x}" cy="{y}" rx="{w / 2}" ry="{w / 9}" fill="#e6e4f0" opacity="0.5"/>')
    # Mike (il cane da guardia), solo un'ombra con occhi
    svg.add(f'<path d="M330,600 q30,-40 70,-10 q20,-10 30,10 q-10,20 -40,22 q-40,4 -60,-22 Z" fill="#1a1a1a" opacity="0.85"/>')
    svg.add(f'<circle cx="412" cy="590" r="3" fill="#f2d33a"/><circle cx="422" cy="592" r="3" fill="#f2d33a"/>')
    # Dentora: città e bus turistico ai piedi
    svg.add(f'<rect x="0" y="800" width="{W}" height="100" fill="#6f7a5e"/>')
    svg.add(road([(0, 840), (300, 830), (600, 850), (1200, 830)], 14, "#b9b0a0", "#4a4438"))
    svg.add(town(rng, 860, 820, 300, 40, 40, 18, ("#d9cdb0", "#c9bda0"), ("#8a4a3a", "#5a6a8a", "#7a6a4a")))
    svg.add(f'<rect x="300" y="818" width="56" height="22" rx="6" fill="#e8c34a" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<circle cx="312" cy="842" r="5" fill="{INK}"/><circle cx="344" cy="842" r="5" fill="{INK}"/>')
    svg.add(region_label(860, 878, "Dentora", sub="Repubblica di Padokea · Republic of Padokea", size=16, color="#f1e6c6", halo="#2b2620"))
    svg.add(compass(1140, 70, 34, INK, PAPER, "#8a2a2a"))
    title(svg, 200, 66, "Kukuroo Mountain", "Tenuta Zoldyck · Zoldyck Estate", 340, jp="ククルーマウンテン")
    save(svg, "hxh-zoldyck-estate.svg", P)
    return P


# =============================================================================
# GREED ISLAND — 1300 × 900
# =============================================================================
def greed_island() -> dict:
    W, H = 1300, 900
    rng = random.Random(33)
    svg = Svg(W, H, "Greed Island · グリードアイランド", CREDIT)
    P = {
        "loc-hxh-gi-starting-point": (650, 470),
        "loc-hxh-gi-antokiba": (770, 400),
        "loc-hxh-gi-masadora": (420, 320),
        "loc-hxh-gi-limeiro": (640, 220),
        "loc-hxh-gi-dorias": (960, 330),
        "loc-hxh-gi-aiai": (290, 520),
        "loc-hxh-gi-rubicuta": (720, 610),
        "loc-hxh-gi-bunzen": (430, 650),
        "loc-hxh-gi-soufrabi": (560, 760),
        "loc-hxh-gi-port": (1110, 720),
        "loc-hxh-gi-badlands": (1050, 500),
        "loc-hxh-gi-battlefield": (900, 640),
    }
    pins = list(P.values())
    land = jagged([(170, 300), (300, 170), (520, 120), (760, 110), (980, 170), (1140, 300), (1190, 470), (1170, 650),
                   (1080, 780), (860, 820), (640, 830), (420, 800), (240, 700), (150, 520)], rng, 0.09, 3)
    sea(svg, "#3f78a0", "#2b5a80", "#d6ecf6", rng, [land], n=190, wave_w=16, opacity=0.45)
    island(svg, land, "#9fbf7a", stroke=INK, shallow="#8fc9de", beach="#e9d9a6")
    # zone: montagne a nord, deserto/badlands a est, foreste, lago
    svg.add(mountain_range(scatter(rng, 26, (260, 150, 1040, 260), both(lambda x, y: pip(x, y, scale_pts(land, 0.92)), far_from(pins, 60)), mind=44),
                           rng, 64, 58, fill="#a8987a", dark="#76664c", snow="#f4f4f4", stroke=INK))
    bad = jagged([(960, 420), (1120, 400), (1160, 560), (1060, 620), (960, 560)], rng, 0.1, 2)
    svg.add(patch(bad, "#c9a46a", stroke="#8a6a3a", sw=1.5))
    svg.add(dots(rng, (950, 390, 1170, 630), 260, "#6a4a22", (0.6, 1.6), lambda x, y: pip(x, y, bad)))
    for (x, y) in scatter(rng, 9, (970, 420, 1150, 600), both(lambda x, y: pip(x, y, bad), far_from(pins, 30)), mind=40):
        svg.add(f'<path d="M{f(x - 14)},{f(y)} l6,-20 l10,4 l8,-12 l6,28 Z" fill="#a8845a" stroke="{INK}" stroke-width="1.2"/>')
    lake = jagged(ellipse_pts(520, 470, 70, 40, 12), rng, 0.08, 2)
    svg.add(patch(lake, "#8fc9de", stroke="#3e7f9c", sw=2))
    svg.add(river([(560, 140), (540, 260), (520, 360), (520, 430)], 9))
    svg.add(river([(560, 500), (600, 600), (640, 700), (650, 830)], 9))
    svg.add(forest(svg, jagged([(200, 360), (330, 300), (360, 420), (280, 600), (190, 560)], rng, 0.08, 2), rng, 0.0035, 9,
                   avoid=far_from(pins, 30), fill="#4f7a3a", dark="#2c4a22", light="#76a85a"))
    svg.add(forest(svg, jagged([(760, 520), (900, 470), (950, 560), (860, 600), (760, 600)], rng, 0.08, 2), rng, 0.0035, 9,
                   avoid=far_from(pins, 30), fill="#4f7a3a", dark="#2c4a22", light="#76a85a"))
    svg.add(forest(svg, jagged([(800, 680), (1000, 700), (1040, 780), (860, 800), (760, 760)], rng, 0.08, 2), rng, 0.0035, 9,
                   avoid=far_from(pins, 30), fill="#4f7a3a", dark="#2c4a22", light="#76a85a"))
    # strade tra le città
    for s in ([(650, 470), (770, 400), (960, 330)], [(770, 400), (640, 220)], [(650, 470), (420, 320)],
              [(420, 320), (290, 520), (430, 650), (560, 760)], [(650, 470), (720, 610), (900, 640), (1110, 720)],
              [(430, 650), (720, 610)], [(960, 330), (1050, 500), (1110, 720)]):
        svg.add(road(s, 6, "#efe0b4", "#8a7550", dash=None))
    # Punto di partenza: albero Shiso sulla collina con la scalinata
    svg.add(f'<ellipse cx="650" cy="480" rx="46" ry="16" fill="#86a868" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(big_tree(650, 480, 0.42))
    # città (sagome caratteristiche)
    svg.add(castle(640, 238, 0.8, "#e6dcc4", "#7a3a8a"))                           # Limeiro
    for dx in (-26, 0, 26):                                                          # Masadora: torri magiche
        svg.add(tower(420 + dx, 340, 14, 50 + (20 if dx == 0 else 0), "#d8d0e8", "#5a3a8a"))
    svg.add(town(rng, 770, 400, 40, 24, 9, 14, ("#efe2c4",), ("#c96e3e", "#3d6a9a")))  # Antokiba
    svg.add(dome(960, 344, 30, "#e8c34a", INK))                                     # Dorias: casinò
    svg.add(text(960, 330, "$", size=18, fill="#7a3a0a", weight="bold"))
    svg.add(town(rng, 290, 520, 40, 24, 9, 14, ("#f6dde6",), ("#d86a8a", "#e89ab0")))  # Aiai
    svg.add(town(rng, 720, 610, 34, 20, 7, 14, ("#efe2c4",), ("#8a6a4a",)))            # Rubicuta
    svg.add(town(rng, 430, 650, 30, 18, 6, 13, ("#efe2c4",), ("#7a8f6a",)))            # Bunzen
    svg.add(town(rng, 560, 760, 40, 22, 9, 14, ("#e6eef0",), ("#3d6a9a", "#5a8aaa")))  # Soufrabi
    for (x, y) in ((610, 806), (520, 812)):
        svg.add(f'<path d="M{x - 12},{y} l8,-16 l10,6 l6,10 Z" fill="#8a8478" stroke="{INK}" stroke-width="1"/>')
    svg.add(f'<path d="M1110,720 l60,40" stroke="#6a4a2a" stroke-width="8"/>')     # porto
    svg.add(ship(1190, 790, 0.9))
    svg.add(f'<path d="M880,630 l40,20 M900,620 l0,40" stroke="#b03a2e" stroke-width="3" opacity="0.6"/>')
    svg.add(region_label(1060, 470, "Badlands", size=15, color="#4a2e10", halo="#e9d2a0"))
    svg.add(compass(1230, 80, 36, INK, PAPER, "#b03a2e"))
    svg.add(region_label(1130, 860, "Mare / Sea", size=14, color="#e6f2f8", halo="#2b5a80"))
    title(svg, 190, 70, "Greed Island", "L'isola del gioco · The game's island", 310, jp="グリードアイランド")
    save(svg, "hxh-greed-island.svg", P)
    return P


# =============================================================================
# PALAZZO DI EAST GORTEAU (Peijin) — 1200 × 900
# =============================================================================
def east_gorteau() -> dict:
    W, H = 1200, 900
    rng = random.Random(44)
    svg = Svg(W, H, "East Gorteau Royal Palace · 東ゴルトー共和国 宮殿", CREDIT)
    P = {
        "loc-hxh-eg-gate": (600, 806),
        "loc-hxh-eg-courtyard": (600, 560),
        "loc-hxh-eg-throne": (600, 240),
        "loc-hxh-eg-gungi-room": (930, 330),
    }
    svg.add(f'<rect width="{W}" height="{H}" fill="#7a8a62"/>')
    svg.add(dots(rng, (0, 0, W, H), 600, "#3a4a2a", (0.6, 1.6)))
    # città di Peijin attorno
    roofs = ["#8a5a4a", "#6a6a7a", "#9a8a6a", "#5a6a5a"]
    out = ["<g>"]
    for x, y in sorted(scatter(rng, 150, (0, 0, W, H), lambda x, y: not (170 < x < 1030 and 90 < y < 860) and not (x < 360 and y < 120), mind=30), key=lambda p: p[1]):
        out += house(x, y, rng.uniform(16, 24), "#d9cdb0", rng.choice(roofs))
    out.append("</g>")
    svg.add(out)
    # mura del complesso e fossato
    svg.add(f'<rect x="170" y="90" width="860" height="770" fill="#8fc9de" stroke="#3e7f9c" stroke-width="2"/>')
    svg.add(f'<rect x="200" y="120" width="800" height="710" fill="#cdbf9a" stroke="{INK}" stroke-width="3"/>')
    svg.add(f'<rect x="212" y="132" width="776" height="686" fill="none" stroke="#8a7a5a" stroke-width="10"/>')
    svg.add(dots(rng, (220, 140, 980, 810), 500, "#6a5a3a", (0.6, 1.4)))
    # cortile con giardino geometrico
    svg.add(f'<rect x="380" y="430" width="440" height="260" fill="#9fbf7a" stroke="{INK}" stroke-width="2"/>')
    for i in range(4):
        svg.add(f'<rect x="{400 + i * 105}" y="450" width="85" height="220" fill="none" stroke="#6f8f4a" stroke-width="2"/>')
    svg.add(f'<circle cx="600" cy="560" r="34" fill="#8fc9de" stroke="{INK}" stroke-width="2"/>')
    svg.add(trees([(400 + i * 50, 700) for i in range(9)], rng, r=9))
    # viale dalla porta al palazzo
    svg.add(road([(600, 860), (600, 700)], 30, "#e6dcc4", "#8a7a5a"))
    svg.add(road([(600, 420), (600, 330)], 30, "#e6dcc4", "#8a7a5a"))
    # porta monumentale
    svg.add(f'<rect x="540" y="790" width="120" height="50" fill="#b03a2e" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M530,790 L600,758 L670,790 Z" fill="#3a5a4a" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M585,840 v-28 a15,15 0 0,1 30,0 v28" fill="#2a2016" stroke="{INK}" stroke-width="1.2"/>')
    # corpo del palazzo con cupole e torre del trono
    svg.add(f'<rect x="300" y="200" width="600" height="140" fill="#e6dcc4" stroke="{INK}" stroke-width="2.4"/>')
    for i in range(14):
        svg.add(f'<rect x="{318 + i * 42}" y="236" width="18" height="30" rx="8" fill="#3a3a4a" opacity="0.7"/>')
        svg.add(f'<rect x="{318 + i * 42}" y="290" width="18" height="30" rx="8" fill="#3a3a4a" opacity="0.7"/>')
    svg.add(f'<path d="M290,200 L600,150 L910,200 Z" fill="#3a5a4a" stroke="{INK}" stroke-width="2"/>')
    svg.add(dome(600, 160, 70, "#d9a84a", INK))
    svg.add(f'<path d="M600,100 V60" stroke="{INK}" stroke-width="3"/>')
    svg.add(f'<path d="M600,60 l26,8 l-26,8 Z" fill="#b03a2e" stroke="{INK}" stroke-width="1"/>')
    for x in (330, 870):
        svg.add(tower(x, 210, 34, 70, "#e6dcc4", "#3a5a4a"))
    # ala est (sala del Gungi) e ala ovest
    for x in (930, 270):
        svg.add(f'<rect x="{x - 70}" y="270" width="140" height="120" fill="#ddd2b8" stroke="{INK}" stroke-width="2"/>')
        svg.add(dome(x, 270, 46, "#7a9a8a", INK))
    for i in range(3):
        for j in range(3):  # scacchiera del Gungi
            svg.add(f'<rect x="{906 + i * 16}" y="{338 + j * 12}" width="16" height="12" fill="{"#e9dcb8" if (i + j) % 2 else "#8a6a3a"}" stroke="{INK}" stroke-width="0.6"/>')
    svg.add(compass(1140, 70, 34, INK, PAPER, "#b03a2e"))
    svg.add(region_label(600, 885, "Peijin", sub="Repubblica di East Gorteau · Republic of East Gorteau", size=16, color="#f1e6c6", halo="#2b2620"))
    title(svg, 190, 56, "East Gorteau", "Palazzo reale · Royal Palace", 300)
    save(svg, "hxh-east-gorteau-palace.svg", P)
    return P


# =============================================================================
# YORKNEW CITY — 1400 × 1000
# =============================================================================
def yorknew() -> dict:
    W, H = 1400, 1000
    rng = random.Random(55)
    svg = Svg(W, H, "Yorknew City · ヨークシンシティ", CREDIT)
    P = {
        "loc-hxh-yk-cemetery-building": (560, 330),
        "loc-hxh-yk-downtown": (720, 500),
        "loc-hxh-yk-market": (850, 660),
        "loc-hxh-yk-hideout": (1110, 250),
        "loc-hxh-yk-wasteland": (1250, 720),
        "loc-hxh-yk-airport": (250, 800),
    }
    pins = list(P.values())
    svg.add(f'<rect width="{W}" height="{H}" fill="#c9b98e"/>')
    # baia a ovest/sud-ovest
    bay = [(-20, -20), (240, -20), (300, 140), (250, 330), (330, 520), (240, 640), (120, 660), (-20, 620)]
    svg.add(f'<path d="{smooth(jagged(bay, rng, 0.05, 3))}" fill="#6f9fbf" stroke="#3e6f8c" stroke-width="3"/>')
    svg.add(dots(rng, (0, 0, 300, 640), 140, "#d6ecf6", (0.6, 1.5), lambda x, y: pip(x, y, bay), (0.3, 0.6)))
    # deserto roccioso a est (la "terra di nessuno" oltre la città)
    waste = [(1080, 470), (1420, 420), (1420, 1020), (1020, 1020), (1000, 820)]
    svg.add(patch(jagged(waste, rng, 0.06, 2), "#c49a64", stroke="#8a6a3a", sw=1.5))
    svg.add(dots(rng, (1000, 420, W, H), 420, "#6a4a22", (0.6, 1.8), lambda x, y: pip(x, y, waste)))
    for (x, y) in scatter(rng, 16, (1030, 480, 1390, 990), both(lambda x, y: pip(x, y, waste), far_from(pins, 46)), mind=60):
        sx = rng.uniform(0.8, 1.4)
        svg.add(f'<path d="M{f(x - 22 * sx)},{f(y)} l{f(8 * sx)},{f(-30 * sx)} l{f(14 * sx)},{f(6 * sx)} l{f(10 * sx)},{f(-16 * sx)} l{f(12 * sx)},{f(40 * sx)} Z" fill="#a8784a" stroke="{INK}" stroke-width="1.2"/>')
    # rovine a nord-est (il covo della Brigata)
    for (x, y) in scatter(rng, 14, (1000, 160, 1250, 360), far_from([P["loc-hxh-yk-hideout"]], 36), mind=36):
        w, h = rng.uniform(26, 50), rng.uniform(24, 60)
        svg.add(f'<path d="M{f(x - w / 2)},{f(y)} V{f(y - h)} l{f(w * 0.3)},{f(h * 0.25)} l{f(w * 0.3)},{f(-h * 0.2)} l{f(w * 0.4)},{f(h * 0.3)} V{f(y)} Z" fill="#8a8478" stroke="{INK}" stroke-width="1.2"/>')
    svg.add(f'<rect x="1075" y="205" width="70" height="56" fill="#6c665c" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M1075,205 l20,-14 l20,10 l30,-8 v12" fill="none" stroke="{INK}" stroke-width="2"/>')
    # griglia urbana
    city = [(330, 120), (980, 100), (1040, 420), (980, 900), (360, 900), (380, 640), (330, 420)]
    svg.add(patch(city, "#b9b4a6", stroke="#6a6458", sw=2))
    for x in range(360, 1040, 46):
        svg.add(f'<path d="M{x},100 V910" stroke="#e6e0cc" stroke-width="5" opacity="0.8"/>')
    for y in range(130, 910, 40):
        svg.add(f'<path d="M320,{y} H1050" stroke="#e6e0cc" stroke-width="5" opacity="0.8"/>')
    out = ["<g>"]
    for (x, y) in sorted(scatter(rng, 260, (340, 120, 1030, 900), both(lambda x, y: pip(x, y, city), far_from(pins, 34)), mind=22), key=lambda p: p[1]):
        h = rng.uniform(16, 70) * (1.5 if ((x - 720) ** 2 + (y - 480) ** 2) < 200 ** 2 else 0.8)
        w = rng.uniform(12, 20)
        c = rng.choice(["#7a889c", "#8995a8", "#6b7a8f", "#9aa3b2", "#a8a090"])
        out.append(f'<rect x="{f(x - w / 2)}" y="{f(y - h)}" width="{f(w)}" height="{f(h)}" fill="{c}" stroke="{INK}" stroke-width="0.8"/>')
        out.append(f'<rect x="{f(x - w / 2 + 2)}" y="{f(y - h + 3)}" width="{f(w - 4)}" height="{f(h * 0.12)}" fill="#f4e3a8" opacity="0.4"/>')
    out.append("</g>")
    svg.add(out)
    # parco centrale
    svg.add(patch([(590, 560), (660, 556), (664, 610), (594, 616)], "#8aa86a", stroke=INK, sw=1.2))
    svg.add(trees([(604 + i * 16, 590) for i in range(4)], rng, r=7))
    # Cemetery Building: grattacielo tra le lapidi
    for (x, y) in scatter(rng, 26, (470, 340, 650, 400), far_from([P["loc-hxh-yk-cemetery-building"]], 18), mind=12):
        svg.add(f'<path d="M{f(x - 3)},{f(y)} v-8 a3,3 0 0,1 6,0 v8 Z" fill="#d9d6cc" stroke="{INK}" stroke-width="0.7"/>')
    svg.add(f'<rect x="536" y="200" width="48" height="120" fill="#4a4a5a" stroke="{INK}" stroke-width="2"/>')
    for k in range(9):
        svg.add(f'<rect x="542" y="{208 + k * 12}" width="36" height="5" fill="#f4e3a8" opacity="0.45"/>')
    # viadotto verso l'aeroporto e l'aeroporto di Lingon
    svg.add(road([(380, 700), (330, 760), (290, 800)], 12, "#d9d2bc", "#6a6458"))
    svg.add(f'<path d="M120,760 L420,860 M150,860 L400,720" stroke="#4a4a4a" stroke-width="22"/>')
    svg.add(f'<path d="M120,760 L420,860 M150,860 L400,720" stroke="#f1e6c6" stroke-width="2" stroke-dasharray="14 12"/>')
    svg.add(f'<rect x="200" y="770" width="70" height="26" fill="#d9d2bc" stroke="{INK}" stroke-width="1.5"/>')
    svg.add(f'<ellipse cx="380" cy="940" rx="60" ry="18" fill="#c9c2a8" stroke="{INK}" stroke-width="1.5"/>')  # dirigibile
    svg.add(f'<path d="M360,958 h40 v8 h-40 Z" fill="#6a6458"/>')
    # strada verso il deserto
    svg.add(road([(1040, 640), (1140, 680), (1250, 720), (1400, 760)], 9, "#e6d2a8", "#8a6a3a"))
    svg.add(compass(1330, 80, 36, INK, PAPER, "#b03a2e"))
    svg.add(region_label(160, 400, "Baia", sub="Bay", size=16, color="#e6f2f8", halo="#3e6f8c"))
    svg.add(region_label(1230, 900, "Deserto", sub="Wasteland", size=16, color="#4a2e10", halo="#e9d2a0"))
    title(svg, 190, 60, "Yorknew City", "Asta del Mercato Nero · Southernpiece Auction", 320, jp="ヨークシンシティ")
    save(svg, "hxh-yorknew.svg", P)
    return P


# =============================================================================
# WHALE ISLAND (くじら島) — 1200 × 900
# =============================================================================
def whale_island() -> dict:
    W, H = 1200, 900
    rng = random.Random(66)
    svg = Svg(W, H, "Whale Island · くじら島", CREDIT)
    P = {
        "loc-hxh-wi-port": (930, 650),
        "loc-hxh-wi-mito-house": (760, 560),
        "loc-hxh-wi-forest": (430, 360),
        "loc-hxh-wi-lake": (300, 560),
    }
    pins = list(P.values())
    # sagoma a balena: corpo, coda a ovest
    land = jagged([(120, 470), (60, 360), (150, 380), (230, 300), (420, 210), (640, 190), (860, 240), (1020, 340),
                   (1080, 470), (1040, 600), (900, 700), (700, 740), (480, 720), (300, 640), (190, 560), (70, 600)], rng, 0.05, 3)
    sea(svg, "#4a8ab0", "#2b5a80", "#d6ecf6", rng, [land], n=170, wave_w=16, opacity=0.45)
    island(svg, land, "#a8c47a", stroke=INK, shallow="#8fc9de", beach="#eadbb0")
    svg.add(mountain_range(scatter(rng, 10, (520, 220, 860, 330), both(lambda x, y: pip(x, y, scale_pts(land, 0.9)), far_from(pins, 60)), mind=50),
                           rng, 70, 60, fill="#8aa06a", dark="#5a7040", snow=None, stroke=INK))
    svg.add(forest(svg, jagged([(240, 330), (420, 250), (600, 330), (560, 470), (380, 480), (230, 420)], rng, 0.08, 2), rng, 0.004, 10,
                   avoid=far_from(pins, 30), fill="#3f7a3a", dark="#25502a", light="#6fa85a"))
    lake = jagged(ellipse_pts(300, 570, 70, 42, 12), rng, 0.08, 2)
    svg.add(patch(lake, "#6fa8c0", stroke="#3e7f9c", sw=2))
    svg.add(patch(jagged(ellipse_pts(300, 570, 40, 20, 10), rng, 0.1, 2), "#5a8a7a", opacity=0.5))
    svg.add(river([(640, 300), (520, 420), (380, 520), (330, 545)], 7))
    # villaggio e casa-locanda di Mito, porto con il molo
    svg.add(town(rng, 860, 600, 110, 50, 24, 16, ("#efe2c4", "#e6d6b0"), ("#b5523b", "#3d6a9a", "#8a6a4a"), far_from(pins, 26)))
    svg.add(house(760, 566, 34, "#f4ead2", "#c0392b"))
    svg.add(f'<rect x="752" y="534" width="8" height="10" fill="#6a4a2a"/>')
    svg.add(f'<path d="M930,660 L1010,720" stroke="#6a4a2a" stroke-width="10"/>')
    svg.add(f'<path d="M930,660 L1010,720" stroke="#a87a4a" stroke-width="6"/>')
    svg.add(ship(1060, 760, 1.0))
    svg.add(road([(760, 570), (840, 600), (930, 650)], 6, "#efe0b4", "#8a7550"))
    svg.add(path_line([(760, 560), (620, 480), (500, 420), (430, 370)]))
    svg.add(path_line([(430, 370), (360, 480), (310, 550)]))
    # la volpe-orso (sagoma) nella foresta
    svg.add(f'<path d="M500,300 q20,-26 50,-8 q16,-6 24,6 q-6,16 -30,18 q-30,4 -44,-16 Z" fill="#5a3a22" opacity="0.8"/>')
    svg.add(compass(1130, 80, 34, INK, PAPER, "#b03a2e"))
    svg.add(region_label(600, 860, "Mare / Sea", size=14, color="#e6f2f8", halo="#2b5a80"))
    title(svg, 190, 66, "Whale Island", "Isola Balena · casa di Gon / Gon's home", 320, jp="くじら島")
    save(svg, "hxh-whale-island.svg", P)
    return P


# =============================================================================
# NGL — NEO-GREEN LIFE — 1300 × 900
# =============================================================================
def ngl() -> dict:
    W, H = 1300, 900
    rng = random.Random(77)
    svg = Svg(W, H, "NGL · Neo-Green Life", CREDIT)
    P = {
        "loc-hxh-ngl-gate": (1080, 470),
        "loc-hxh-ngl-coast": (240, 700),
        "loc-hxh-ngl-nest": (560, 380),
        "loc-hxh-ngl-forest": (780, 600),
    }
    pins = list(P.values())
    land = [(160, -20), (1320, -20), (1320, 920), (420, 920), (330, 800), (180, 760), (110, 640), (150, 420), (100, 200)]
    sea(svg, "#3f78a0", "#2b5a80", "#d6ecf6", rng, [land], n=60, wave_w=16, opacity=0.45)
    island(svg, jagged(land, rng, 0.03, 3), "#6f9a52", stroke=INK, shallow="#8fc9de", beach="#e2d2a0")
    # confine con East Gorteau/Rokario a est: muro e posto di blocco
    svg.add(f'<path d="M1150,-10 L1120,300 L1140,600 L1110,910" fill="none" stroke="#8a8478" stroke-width="14"/>')
    svg.add(f'<path d="M1150,-10 L1120,300 L1140,600 L1110,910" fill="none" stroke="#c9c2b0" stroke-width="7" stroke-dasharray="18 8"/>')
    svg.add(f'<rect x="1050" y="430" width="80" height="50" fill="#d9d2bc" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M1050,430 l40,-22 l40,22" fill="#5a6a4a" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(region_label(1220, 160, "East Gorteau", sub="confine · border", size=13, color="#2b2620", halo="#c9d6b0", rot=-90))
    # giungla fittissima: niente tecnologia, solo natura
    svg.add(wood(svg, scatter(rng, 1100, (110, 0, 1110, H), both(lambda x, y: pip(x, y, land), far_from(pins, 48),
                 lambda x, y: not ((x - 560) ** 2 / 150 ** 2 + (y - 380) ** 2 / 100 ** 2 < 1)), mind=17), rng, r=11,
                 fill="#3f7a3a", dark="#204a22", light="#68a050", stroke="#142a12", sw=0.8))
    # fiume che sfocia sulla costa ovest
    svg.add(river([(900, 60), (760, 220), (620, 300), (420, 520), (300, 660), (230, 720)], 10))
    # il nido della Regina: termitaio gigante in una radura
    svg.add(f'<ellipse cx="560" cy="400" rx="140" ry="80" fill="#a88a5a" stroke="{INK}" stroke-width="1.5" opacity="0.8"/>')
    svg.add(f'<path d="M470,410 Q500,240 560,180 Q620,240 650,410 Z" fill="#7a5a3a" stroke="{INK}" stroke-width="2.4"/>')
    for (x, y) in ((530, 300), (585, 260), (560, 350), (520, 380), (610, 370)):
        svg.add(f'<ellipse cx="{x}" cy="{y}" rx="7" ry="10" fill="#2a1a10"/>')
    # radura della battaglia di Kite
    svg.add(f'<ellipse cx="780" cy="610" rx="60" ry="30" fill="#b9a874" stroke="{INK}" stroke-width="1" opacity="0.85"/>')
    # relitto sulla costa (la Regina giunta dal mare)
    svg.add(f'<path d="M210,716 q30,-10 60,0 q-10,14 -30,14 q-20,0 -30,-14 Z" fill="#5a4a3a" stroke="{INK}" stroke-width="1.2"/>')
    svg.add(compass(1230, 820, 34, INK, PAPER, "#b03a2e"))
    svg.add(region_label(140, 860, "Mare / Sea", size=14, color="#e6f2f8", halo="#2b5a80"))
    title(svg, 330, 60, "NGL", "Neo-Green Life · regione autonoma / autonomous region", 420)
    save(svg, "hxh-ngl.svg", P)
    return P


# =============================================================================
# BLACK WHALE 1 — sezione della nave — 1400 × 900
# =============================================================================
def black_whale() -> dict:
    W, H = 1400, 900
    rng = random.Random(88)
    svg = Svg(W, H, "Black Whale 1 · ブラックホエール1号", CREDIT)
    P = {
        "loc-hxh-bw-tier1": (700, 250),
        "loc-hxh-bw-middle-tiers": (700, 450),
        "loc-hxh-bw-lower-tiers": (700, 640),
    }
    sky = svg.gradient("sky", [(0, "#1d2a4a"), (0.55, "#3a5a80"), (0.56, "#2b4a6a"), (1, "#14283c")])
    svg.add(f'<rect width="{W}" height="{H}" fill="{sky}"/>')
    svg.add(dots(rng, (0, 0, W, 300), 120, "#ffffff", (0.5, 1.2), None, (0.3, 0.8)))
    for y in range(520, H, 26):
        svg.add(f'<path d="M0,{y} Q350,{y - 8} 700,{y} T1400,{y}" fill="none" stroke="#d6ecf6" stroke-width="1.2" opacity="0.25"/>')
    # scafo a sezione (prua a destra)
    hull = [(120, 300), (1180, 300), (1320, 360), (1260, 560), (1120, 760), (260, 760), (150, 620)]
    svg.add(f'<path d="{poly(hull)}" fill="#2a2e38" stroke="{INK}" stroke-width="3"/>')
    # ponti: Tier 1 (sovrastruttura di lusso), Tier 2-3, Tier 4-5
    decks = [(300, 380, "#d9c48a", "Tier 1"), (380, 520, "#a8b4c4", "Tier 2–3"), (520, 740, "#7a7f8a", "Tier 4–5")]
    for y0, y1, c, lab in decks:
        svg.add(f'<rect x="170" y="{y0 + 8}" width="1070" height="{y1 - y0 - 16}" fill="{c}" stroke="{INK}" stroke-width="1.5" opacity="0.92"/>')
        svg.add(text(200, y0 + 40, lab, size=22, fill="#1d1d1d", anchor="start", weight="bold", halo="#f1e6c6", halo_w=4))
        for x in range(260, 1220, 34):
            svg.add(f'<rect x="{x}" y="{y0 + 54}" width="16" height="10" rx="3" fill="#1d2a4a" opacity="0.5"/>')
    # sovrastruttura reale con le torri dei principi
    svg.add(f'<path d="M320,300 L340,170 L1060,170 L1080,300 Z" fill="#e6dcc4" stroke="{INK}" stroke-width="2.4"/>')
    for i, x in enumerate(range(380, 1040, 48)):
        h = 40 + (i % 3) * 18
        svg.add(tower(x, 170, 22, h, "#efe4c8", "#b08a2a", cone=True))
    svg.add(dome(700, 170, 46, "#d9a84a", INK))
    # impianto di trattamento tra i ponti inferiori
    svg.add(f'<rect x="900" y="640" width="200" height="40" fill="#4a5a4a" stroke="{INK}" stroke-width="1.4"/>')
    for x in range(910, 1100, 24):
        svg.add(f'<circle cx="{x}" cy="660" r="8" fill="#6a7a6a" stroke="{INK}" stroke-width="0.8"/>')
    # ciminiere e scia
    for x in (500, 900):
        svg.add(f'<rect x="{x - 14}" y="110" width="28" height="60" fill="#3a3a4a" stroke="{INK}" stroke-width="1.6"/>')
        svg.add(f'<ellipse cx="{x - 30}" cy="96" rx="40" ry="14" fill="#c9c2b0" opacity="0.4"/>')
    svg.add(f'<path d="M120,600 Q60,620 0,600" stroke="#d6ecf6" stroke-width="3" opacity="0.5" fill="none"/>')
    svg.add(region_label(700, 860, "Verso il Nuovo Continente · Towards the New Continent", size=15, color="#e6f2f8", halo="#14283c"))
    title(svg, 200, 60, "Black Whale 1", "Nave reale di Kakin · Kakin royal ship", 330, jp="ブラックホエール1号")
    save(svg, "hxh-black-whale.svg", P)
    return P


ALL = [heavens_arena, zoldyck, greed_island, east_gorteau, yorknew, whale_island, ngl, black_whale]

if __name__ == "__main__":
    pins: dict = {}
    for fn in ALL:
        pins.update(fn())
    apply_pins("hunterxhunter", pins)
