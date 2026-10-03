#!/usr/bin/env python3
"""Mappe ORIGINALI di Jujutsu Kaisen.

Jujutsu Kaisen è ambientato nel Giappone reale: le mappe sono ricostruzioni AniMapVerse
disegnate da zero (nessun artwork ufficiale) sulla geografia vera, con i luoghi della
serie nella loro posizione reale — o, quando l'opera li inventa (l'istituto di arti
occulte di Tokyo, il liceo Sugisawa, il ponte Yasohachi), nella zona in cui la serie li
colloca, segnalandolo nelle schede.

  * Il Giappone — prefetture e coste dai dati Natural Earth 1:10m (dominio pubblico),
    proiezione di Mercatore. Le dieci colonie del Culling Game «in fila» da Aomori a
    Kagoshima, Okinawa in un riquadro.
  * Tokyo e dintorni — la baia, i fiumi Tama, Arakawa, Sumida ed Edo, l'anello della
    linea Yamanote; l'istituto nelle colline boscose all'estremo ovest.
  * Shibuya — l'Incidente di Shibuya (31 ottobre 2018) sulle strade reali: la stazione,
    il binario B5F della linea Fukutoshin, Meiji-jingumae, Dogenzaka, lo Shibuya 109,
    lo Shibuya Stream, il Velo di 400 m.
  * L'istituto di arti occulte di Tokyo — pianta immaginata del campus (l'opera lo
    descrive come un complesso di templi fra i boschi), con la Tomba delle Stelle.
  * Kyoto — il Kamo, il Katsura e la città a scacchiera: l'istituto di Kyoto, i Zen'in,
    la colonia, la Parata della Notte.
  * Sendai — la città di Yuji: il fiume Hirose, la stazione, il castello di Aoba.

    python3 scripts/mapgen/jjk.py → public/assets/worlds/jujutsukaisen/maps/*.svg + pin
"""
from __future__ import annotations

import json
import math
import os
import random
import sys

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from kit import (JP, SANS, SERIF, Svg, apply_pins, compass, dots, f, house, mountain, out_path, pip, plaque,
                 poly, preview, region_label, river, road, scale_bar, scatter, shade, smooth, text, wood)

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")
INK = "#26222e"
PAPER = "#efe8d8"
LAND = "#e6dcc4"
LAND2 = "#ddd1b4"
SEA_T, SEA_B = "#a9b8c2", "#8798a6"
CURSE = "#3b2a5c"      # viola dei veli / delle colonie
CURSE_L = "#7b62b8"
BLOOD = "#b0352c"
CREDIT = ("Ricostruzione originale AniMapVerse · CC0 · geografia: Natural Earth (dominio pubblico) · "
          "non è materiale ufficiale di Jujutsu Kaisen")
WORLD = "jujutsukaisen"


def save(svg: Svg, name: str, pins: dict) -> None:
    svg.add(getattr(svg, "late", []))
    svg.save(out_path(WORLD, name))
    preview(svg.path, pins, svg.w, svg.h)


def title(svg, x, y, name, sub, jp="呪術廻戦", w=380, h=108):
    svg.add(plaque(x, y, w, h, name, sub=sub, jp=jp, fill="#1f1a2b", stroke="#8f7ac8", ink="#f1ecf8", size=28))


class Merc:
    """Proiezione di Mercatore adattata a un riquadro (W×H con margine)."""

    def __init__(self, lon0, lon1, lat0, lat1, w, h, pad=0.0):
        self.lon0, self.lon1 = lon0, lon1
        self.y0, self.y1 = self._my(lat0), self._my(lat1)
        sx = (w - 2 * pad) / math.radians(lon1 - lon0)
        sy = (h - 2 * pad) / (self.y1 - self.y0)
        self.s = min(sx, sy)
        self.ox = (w - self.s * math.radians(lon1 - lon0)) / 2
        self.oy = (h - self.s * (self.y1 - self.y0)) / 2
        self.h = h

    @staticmethod
    def _my(lat):
        return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))

    def __call__(self, lon, lat):
        x = self.ox + self.s * math.radians(lon - self.lon0)
        y = self.h - (self.oy + self.s * (self._my(lat) - self.y0))
        return x, y

    def km(self, lat):
        """Pixel per chilometro alla latitudine data."""
        return self.s / (6371.0 * math.cos(math.radians(lat))) * 1.0


def simplify(pts, tol=0.4):
    """Douglas-Peucker (in pixel): toglie i vertici sub-pixel dei contorni Natural Earth
    senza cambiare il disegno a schermo — le mappe pesano molto meno."""
    if len(pts) < 4:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        (ax, ay), (bx, by) = pts[a], pts[b]
        dx, dy = bx - ax, by - ay
        n = math.hypot(dx, dy) or 1e-9
        best, idx = 0.0, -1
        for i in range(a + 1, b):
            px, py = pts[i]
            d = abs(dy * px - dx * py + bx * ay - by * ax) / n if n > 1e-9 else math.hypot(px - ax, py - ay)
            if d > best:
                best, idx = d, i
        if best > tol and idx > 0:
            keep[idx] = True
            stack += [(a, idx), (idx, b)]
    return [p for p, k in zip(pts, keep) if k]


def rings_of(geom):
    if geom["type"] == "Polygon":
        return [geom["coordinates"][0]]
    return [p[0] for p in geom["coordinates"]]


def admin1():
    return json.load(open(os.path.join(DATA, "ne_10m_japan_admin1.json")))["features"]


def dome(x, y, r, label=None, sub=None, size=15, color=CURSE, light=CURSE_L, op=0.22) -> list[str]:
    """Una barriera (Velo / colonia): cupola scura semitrasparente con bordo tratteggiato."""
    out = [f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{color}" fill-opacity="{op}" stroke="{color}" '
           f'stroke-width="2.4"/>',
           f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r - 5)}" fill="none" stroke="{light}" stroke-width="1.2" '
           f'stroke-dasharray="5 4" opacity="0.9"/>']
    if label:
        out.append(text(x, y - r - 8, label, size=size, fill=color, weight="bold", halo=PAPER, halo_w=4, spacing=1))
        if sub:
            out.append(text(x, y - r + size * 0.2 - 8 + size, sub, size=size * 0.72, fill=color, italic=True,
                            halo=PAPER, halo_w=3))
    return out


def return_box(svg, x, y, label):
    """Riquadro del pin di ritorno (disegnato per ultimo, sopra a tutto)."""
    late = getattr(svg, "late", [])
    late.append(f'<rect x="{f(x - 22)}" y="{f(y - 26)}" width="190" height="52" rx="8" fill="#1f1a2b" '
                f'fill-opacity="0.88" stroke="#8f7ac8" stroke-width="2"/>')
    late.append(text(x + 98, y + 6, label, size=15, fill="#f1ecf8", italic=True))
    svg.late = late


# =============================================================================
# 1. IL GIAPPONE — 1800 × 1600
# =============================================================================
J_W, J_H = 1800, 1600
COLONY_PREFS = {"Aomori", "Iwate", "Miyagi", "Tokyo", "Aichi", "Kyōto", "Ōsaka", "Hiroshima", "Kagoshima"}


def japan() -> dict:
    rng = random.Random(2018)
    P = Merc(127.6, 146.4, 30.3, 45.75, J_W, J_H, pad=30)
    svg = Svg(J_W, J_H, "Jujutsu Kaisen · Il Giappone / Japan", CREDIT)
    g = svg.gradient("sea", [(0, SEA_T), (1, SEA_B)])
    svg.add(f'<rect width="{J_W}" height="{J_H}" fill="{g}"/>')
    # reticolo
    out = ['<g stroke="#eef2f4" stroke-width="1" opacity="0.35" fill="none">']
    for lon in range(128, 147, 2):
        x0, y0 = P(lon, 30.3)
        x1, y1 = P(lon, 45.75)
        out.append(f'<path d="M{f(x0)},{f(y0)} L{f(x1)},{f(y1)}"/>')
    for lat in range(31, 46, 2):
        x0, y0 = P(127.6, lat)
        x1, y1 = P(146.4, lat)
        out.append(f'<path d="M{f(x0)},{f(y0)} L{f(x1)},{f(y1)}"/>')
        out.append(text(x0 + 6, y0 - 4, f"{lat}°N", size=11, fill="#eef2f4", anchor="start", opacity=0.8))
    out.append("</g>")
    svg.add(out)
    # continente (Corea, Cina, Russia): grigio, senza dettagli
    land = json.load(open(os.path.join(DATA, "ne_10m_land_east_asia.json")))["rings"]
    cont = ['<g fill="#cfc8b6" stroke="#6f6a5e" stroke-width="1" stroke-linejoin="round">']
    for ring in land:
        cont.append(f'<path d="{poly(simplify([P(lo, la) for lo, la in ring], 0.6))}"/>')
    cont.append("</g>")
    svg.add(cont)
    # prefetture
    feats = admin1()
    shallow = ['<g fill="#b9c8cf" stroke="#b9c8cf" stroke-width="10" stroke-linejoin="round" opacity="0.9">']
    body = []
    for ft in feats:
        name = ft["properties"]["name"]
        if name == "Okinawa":
            continue
        fill = "#e2d6ef" if name in COLONY_PREFS else (LAND if hash(name) % 2 else LAND2)
        for ring in rings_of(ft["geometry"]):
            pts = simplify([P(lo, la) for lo, la in ring if la > 29.0])
            if len(pts) < 3:
                continue
            d = poly(pts)
            shallow.append(f'<path d="{d}"/>')
            body.append(f'<path d="{d}" fill="{fill}" stroke="#8a8170" stroke-width="0.9" stroke-dasharray="3 2" '
                        f'stroke-linejoin="round"/>')
    shallow.append("</g>")
    svg.add(shallow, body)
    # contorno costiero più marcato (sopra i confini)
    coast = [f'<g fill="none" stroke="{INK}" stroke-width="1.4" stroke-linejoin="round">']
    for ft in feats:
        if ft["properties"]["name"] == "Okinawa":
            continue
        for ring in rings_of(ft["geometry"]):
            pts = simplify([P(lo, la) for lo, la in ring if la > 29.0])
            if len(pts) >= 3:
                coast.append(f'<path d="{poly(pts)}" stroke-opacity="0.18"/>')
    coast.append("</g>")
    svg.add(coast)
    # lago Biwa e fiumi principali
    for ft in json.load(open(os.path.join(DATA, "ne_10m_japan_lakes.json")))["features"]:
        for ring in rings_of(ft["geometry"]):
            svg.add(f'<path d="{poly([P(lo, la) for lo, la in ring])}" fill="{SEA_T}" stroke="#4f6a7a" stroke-width="1"/>')
    for ft in json.load(open(os.path.join(DATA, "ne_10m_japan_rivers.json")))["features"]:
        geom = ft["geometry"]
        lines = [geom["coordinates"]] if geom["type"] == "LineString" else geom["coordinates"]
        for ln in lines:
            svg.add(f'<path d="{smooth([P(lo, la) for lo, la in ln], closed=False)}" fill="none" stroke="#6f8ea2" '
                    f'stroke-width="2" stroke-linecap="round"/>')
    # monte Fuji
    fx, fy = P(138.727, 35.361)
    svg.add(mountain(fx, fy + 10, 46, 30, fill="#b9ad96", dark="#8a7e68", snow="#ffffff", stroke=INK, sw=1.2))
    svg.add(text(fx + 30, fy + 4, "Fuji", size=13, fill=INK, italic=True, anchor="start", halo=PAPER, halo_w=3))
    # isole e mari
    for lon, lat, name, sub, jp, size in (
        (142.8, 43.55, "Hokkaidō", None, "北海道", 30),
        (140.15, 39.05, "Honshū", None, "本州", 30),
        (133.45, 33.72, "Shikoku", None, "四国", 20),
        (130.95, 32.55, "Kyūshū", None, "九州", 22),
    ):
        x, y = P(lon, lat)
        svg.add(region_label(x, y, name, jp=jp, size=size, color="#5a4f40", halo="#ece4d2", spacing=4))
    for lon, lat, s, rot in ((134.0, 39.6, "Mar del Giappone · Sea of Japan", -28),
                             (144.2, 37.2, "Oceano Pacifico · Pacific Ocean", -60),
                             (128.75, 30.75, "Mar Cinese Orientale", 0)):
        x, y = P(lon, lat)
        svg.add(text(x, y, s, size=24, fill="#eef2f4", italic=True, spacing=4, opacity=0.85, rot=rot))
    for lon, lat, s in ((127.9, 36.6, "Corea"), (133.5, 44.6, "Russia")):
        x, y = P(lon, lat)
        svg.add(text(x, y, s, size=24, fill="#8a8170", italic=True, spacing=6))
    # città di riferimento (non pin)
    for lon, lat, name in ((141.35, 43.06, "Sapporo"), (136.91, 35.18, "Nagoya"), (135.50, 34.69, "Osaka"),
                           (132.46, 34.39, "Hiroshima"), (130.40, 33.59, "Fukuoka"), (140.74, 40.82, "Aomori"),
                           (141.15, 39.70, "Morioka"), (130.56, 31.60, "Kagoshima")):
        x, y = P(lon, lat)
        svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="3.2" fill="{INK}"/>')
        svg.add(text(x - 8, y + 4, name, size=13, fill=INK, anchor="end", halo="#ece4d2", halo_w=3))
    # le dieci colonie del Culling Game (cupole, ~25 km di raggio, non in scala reale)
    colonies = [
        ("Aomori", 140.74, 40.82), ("Iwate", 141.15, 39.70), ("Sendai", 140.87, 38.27),
        ("Tokyo n.1", 139.70, 35.76), ("Tokyo n.2", 139.80, 35.62), ("Aichi", 136.91, 35.18),
        ("Kyoto", 135.77, 35.01), ("Osaka", 135.50, 34.69), ("Hiroshima", 132.46, 34.39),
        ("Sakurajima", 130.66, 31.585),
    ]
    for name, lon, lat in colonies:
        x, y = P(lon, lat)
        svg.add(dome(x, y, 15, op=0.3))
    lx, ly = 70, 230
    leg = [f'<rect x="{lx - 20}" y="{ly - 40}" width="420" height="150" rx="8" fill="#f4efe4" fill-opacity="0.9" '
           f'stroke="{CURSE}" stroke-width="2"/>',
           text(lx, ly - 12, "Il Culling Game · 死滅回游", size=18, fill=CURSE, anchor="start", weight="bold")]
    leg += dome(lx + 16, ly + 22, 12, op=0.3)
    leg.append(text(lx + 38, ly + 27, "le dieci colonie (barriere), da nord a sud", size=14, fill=INK, anchor="start"))
    leg.append(f'<rect x="{lx + 4}" y="{ly + 50}" width="24" height="16" fill="#e2d6ef" stroke="#8a8170"/>')
    leg.append(text(lx + 38, ly + 63, "prefetture con una colonia", size=14, fill=INK, anchor="start"))
    leg.append(text(lx, ly + 92, "posizione delle cupole indicativa · non in scala", size=12, fill=INK,
                    anchor="start", italic=True, opacity=0.8))
    svg.add(leg)
    # riquadro di Okinawa (Hidden Inventory)
    ox, oy, ow, oh = 1330, 1250, 420, 300
    svg.add(f'<rect x="{ox}" y="{oy}" width="{ow}" height="{oh}" fill="{g}" stroke="{INK}" stroke-width="2"/>')
    OP = Merc(127.55, 128.45, 26.05, 26.95, ow, oh, pad=20)
    oki = next(ft for ft in feats if ft["properties"]["name"] == "Okinawa")
    for ring in rings_of(oki["geometry"]):
        pts = simplify([OP(lo, la) for lo, la in ring if 127.5 <= lo <= 128.5 and 26.0 <= la <= 27.0])
        if len(pts) >= 3:
            pts = [(ox + x, oy + y) for x, y in pts]
            svg.add(f'<path d="{poly(pts)}" fill="{LAND}" stroke="{INK}" stroke-width="1.4" stroke-linejoin="round"/>')
    svg.add(text(ox + 12, oy + 26, "Okinawa · 沖縄", size=16, fill=INK, anchor="start", weight="bold", halo=PAPER, halo_w=3))
    svg.add(text(ox + ow - 10, oy + oh - 12, "riquadro · scala diversa", size=11, fill=INK, anchor="end", italic=True))
    nx, ny = OP(127.68, 26.21)
    pins = {
        "loc-jjk-tokyo": P(139.69, 35.69),
        "loc-jjk-kyoto": P(135.77, 35.01),
        "loc-jjk-sendai": P(140.87, 38.27),
        "loc-jjk-okinawa": (ox + nx, oy + ny),
        "loc-jjk-sakurajima-colony": P(130.66, 31.585),
        "loc-jjk-aomori-colony": P(140.74, 40.82),
        "loc-jjk-iwate-colony": P(141.15, 39.70),
        "loc-jjk-aichi-colony": P(136.91, 35.18),
        "loc-jjk-osaka-colony": P(135.50, 34.69),
        "loc-jjk-hiroshima-colony": P(132.46, 34.39),
    }
    svg.add(compass(1700, 110, r=46, ink=INK, fill=PAPER, accent=BLOOD))
    k = P.km(36.0)
    svg.add(scale_bar(1180, 1200, 200 * k, "200 km (a 36°N)", ink=INK, halo=PAPER))
    title(svg, 230, 92, "Il Giappone", "Japan · 日本 · 2006-2019", w=400)
    svg.add(text(J_W / 2, J_H - 12, "Prefetture e coste: Natural Earth 1:10m (dominio pubblico) · ricostruzione originale",
                 size=12, fill="#eef2f4", italic=True, opacity=0.85))
    save(svg, "jjk-japan.svg", pins)
    return pins


# =============================================================================
# 2. TOKYO E DINTORNI — 2000 × 1400
# =============================================================================
T_W, T_H = 2000, 1400
YAMANOTE = [(35.6812, 139.7671), (35.6919, 139.7709), (35.6984, 139.7731), (35.7138, 139.7773), (35.7281, 139.7710),
            (35.7381, 139.7608), (35.7365, 139.7470), (35.7334, 139.7393), (35.7295, 139.7109), (35.7212, 139.7066),
            (35.7126, 139.7038), (35.7012, 139.7000), (35.6896, 139.7006), (35.6830, 139.7020), (35.6702, 139.7027),
            (35.6580, 139.7016), (35.6467, 139.7101), (35.6339, 139.7157), (35.6262, 139.7236), (35.6197, 139.7286),
            (35.6284, 139.7387), (35.6457, 139.7476), (35.6555, 139.7570), (35.6663, 139.7583), (35.6751, 139.7630)]
RIVERS_TOKYO = {
    "Tama": [(35.80, 139.16), (35.79, 139.26), (35.76, 139.31), (35.72, 139.35), (35.69, 139.41), (35.66, 139.47),
             (35.64, 139.55), (35.61, 139.63), (35.575, 139.68), (35.55, 139.72), (35.535, 139.775), (35.528, 139.795)],
    "Arakawa": [(36.02, 139.46), (35.92, 139.52), (35.86, 139.60), (35.81, 139.66), (35.785, 139.72), (35.765, 139.78),
                (35.745, 139.825), (35.70, 139.845), (35.66, 139.85), (35.635, 139.852)],
    "Sumida": [(35.785, 139.722), (35.768, 139.760), (35.750, 139.800), (35.712, 139.800), (35.695, 139.790),
               (35.668, 139.778), (35.648, 139.770)],
    "Edo": [(36.02, 139.83), (35.92, 139.875), (35.80, 139.885), (35.73, 139.895), (35.68, 139.885), (35.645, 139.872)],
}


def tokyo() -> dict:
    rng = random.Random(1031)
    P = Merc(139.13, 139.97, 35.47, 35.95, T_W, T_H, pad=0)
    svg = Svg(T_W, T_H, "Jujutsu Kaisen · Tokyo e dintorni / Tokyo and surroundings", CREDIT)
    g = svg.gradient("sea", [(0, SEA_T), (1, SEA_B)])
    svg.add(f'<rect width="{T_W}" height="{T_H}" fill="{g}"/>')
    feats = admin1()
    near = {"Tokyo", "Kanagawa", "Saitama", "Chiba", "Yamanashi", "Gunma", "Ibaraki", "Shizuoka", "Tochigi"}
    shallow = ['<g fill="#b9c8cf" stroke="#b9c8cf" stroke-width="16" stroke-linejoin="round" opacity="0.9">']
    body = []
    tokyo_rings = []
    for ft in feats:
        name = ft["properties"]["name"]
        if name not in near:
            continue
        for ring in rings_of(ft["geometry"]):
            if not any(139.0 <= lo <= 140.1 and 35.4 <= la <= 36.05 for lo, la in ring):
                continue
            pts = simplify([P(lo, la) for lo, la in ring])
            d = poly(pts)
            shallow.append(f'<path d="{d}"/>')
            fill = "#ece4d0" if name == "Tokyo" else LAND
            body.append(f'<path d="{d}" fill="{fill}" stroke="#7d7464" stroke-width="1.6" stroke-dasharray="7 4" '
                        f'stroke-linejoin="round"/>')
            if name == "Tokyo":
                tokyo_rings.append(pts)
    shallow.append("</g>")
    svg.add(shallow, body)
    on_land = lambda x, y: svg_land(x, y)
    land_polys = []
    for ft in feats:
        if ft["properties"]["name"] in near:
            for ring in rings_of(ft["geometry"]):
                if any(139.0 <= lo <= 140.1 and 35.4 <= la <= 36.05 for lo, la in ring):
                    land_polys.append(simplify([P(lo, la) for lo, la in ring]))

    def svg_land(x, y):
        return any(pip(x, y, pl) for pl in land_polys)

    # colline e montagne dell'ovest (Okutama, Chichibu, Tanzawa) — boschi
    west = []
    x33, x42 = P(139.33, 35.7)[0], P(139.42, 35.7)[0]
    for x, y in scatter(rng, 1700, (0, 0, x42, T_H), lambda x, y: on_land(x, y), mind=13):
        if x < x33 or rng.random() < 0.5:
            west.append((x, y))
    svg.add(wood(svg, west, rng, r=8, fill="#7c9a5c", dark="#55703c", light="#a2bd7c", stroke="#3a4a2a", sw=0.8,
                 kind="pine"))
    for lon, lat, w, h in ((139.20, 35.86, 70, 48), (139.17, 35.73, 80, 54), (139.22, 35.53, 70, 44),
                           (139.27, 35.94, 60, 40), (139.16, 35.62, 66, 46)):
        x, y = P(lon, lat)
        svg.add(mountain(x, y, w, h, fill="#b5a88a", dark="#8a7e64", snow=None, stroke=INK, rng=rng, sw=1.2))
    # tessuto urbano: i 23 quartieri (fitto) e i sobborghi (rado)
    core = [P(lo, la) for la, lo in ((35.82, 139.62), (35.82, 139.88), (35.66, 139.92), (35.56, 139.80),
                                      (35.55, 139.66), (35.62, 139.58), (35.72, 139.56))]
    blocks = ['<g fill="#c9bfae" stroke="#9a8f7c" stroke-width="0.6">']
    cx0, cy0 = P(139.74, 35.68)
    kk = P.km(35.7)
    for x, y in scatter(rng, 22000, (P(139.36, 35.7)[0], 0, T_W, T_H), lambda x, y: on_land(x, y), mind=7):
        d = math.hypot(x - cx0, y - cy0) / kk
        p = max(0.0, min(1.0, 1.25 - d / 16.0)) if d < 20 else 0.18
        if rng.random() < p:
            w = rng.uniform(4, 8) if d < 12 else rng.uniform(3, 6)
            blocks.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(w * rng.uniform(0.6, 1.0))}" '
                          f'opacity="{0.85 if d < 14 else 0.45}"/>')
    blocks.append("</g>")
    svg.add(blocks)
    # fiumi
    for name, line in RIVERS_TOKYO.items():
        svg.add(river([P(lo, la) for la, lo in line], width=5 if name in ("Sumida",) else 7, color="#9fbccc",
                      edge="#5f7f92"))
    for name, la, lo, rot in (("Tama", 35.655, 139.50, -18), ("Arakawa", 35.83, 139.63, -35),
                              ("Sumida", 35.725, 139.808, 80), ("Edo", 35.86, 139.90, 82)):
        x, y = P(lo, la)
        svg.add(text(x, y - 8, f"fiume {name}", size=13, fill="#3f5f72", italic=True, halo=PAPER, halo_w=3, rot=rot))
    # anello Yamanote (linea JR)
    ring = [P(lo, la) for la, lo in YAMANOTE]
    svg.add(f'<path d="{smooth(ring)}" fill="none" stroke="{INK}" stroke-width="4" opacity="0.75"/>')
    svg.add(f'<path d="{smooth(ring)}" fill="none" stroke="#9cc75a" stroke-width="2.4" stroke-dasharray="8 6"/>')
    lx, ly = P(139.776, 35.705)
    svg.add(text(lx + 34, ly + 4, "linea Yamanote", size=12, fill=INK, italic=True, anchor="start", halo=PAPER, halo_w=3))
    # monumenti di riferimento (non pin)
    for lo, la, name, anchor in ((139.7454, 35.6586, "Tokyo Tower", "start"), (139.8107, 35.7101, "Skytree", "start"),
                                 (139.7528, 35.6852, "Palazzo Imperiale", "start"),
                                 (139.638, 35.4437, "Yokohama", "start"), (139.645, 35.861, "Saitama", "start"),
                                 (139.339, 35.656, "Hachiōji", "start"), (139.446, 35.546, "Machida", "start"),
                                 (139.413, 35.698, "Tachikawa", "start"), (139.7671, 35.6812, "st. Tokyo", "start")):
        x, y = P(lo, la)
        svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="3" fill="{INK}"/>')
        svg.add(text(x + 6, y + 15, name, size=12, fill=INK, anchor=anchor, halo=PAPER, halo_w=3, opacity=0.85))
    # prefetture (etichette)
    for lo, la, name, jp in ((139.30, 35.98, "Saitama", "埼玉県"), (139.50, 35.505, "Kanagawa", "神奈川県"),
                             (139.925, 35.80, "Chiba", "千葉県"), (139.40, 35.76, "Tokyo · Tama", "東京都"),
                             (139.06, 35.56, "Yamanashi", "山梨県")):
        x, y = P(lo, la)
        svg.add(region_label(x, y, name, jp=jp, size=22, color="#5a4f40", halo="#ece4d2", spacing=3))
    x, y = P(139.89, 35.585)
    svg.add(text(x, y, "Baia di Tokyo · 東京湾", size=26, fill="#eef2f4", italic=True, spacing=4, opacity=0.9, rot=-40))
    x, y = P(139.75, 35.80)
    svg.add(text(x, y, "23 QUARTIERI", size=18, fill="#5a4f40", weight="bold", spacing=5, halo="#ece4d2", halo_w=4))
    # le due colonie di Tokyo e il Velo di Shibuya
    k = P.km(35.7)
    x, y = P(139.708, 35.735)
    svg.add(dome(x, y, 2.4 * k, "Colonia Tokyo n.1", "Ikebukuro", size=14))
    x, y = P(139.768, 35.668)
    svg.add(dome(x, y, 1.8 * k, None))
    svg.add(text(x + 1.8 * k + 6, y + 4, "Colonia Tokyo n.2 · Ginza", size=14, fill=CURSE, weight="bold", anchor="start",
                 halo=PAPER, halo_w=4))
    x, y = P(139.7016, 35.658)
    svg.add(dome(x, y, 0.4 * k + 2, None, op=0.5))
    pins = {
        "loc-jjk-jujutsu-high": P(139.272, 35.672),
        "loc-jjk-shibuya": P(139.7016, 35.658),
        "loc-jjk-harajuku": P(139.7027, 35.6702),
        "loc-jjk-shinjuku": P(139.7006, 35.6896),
        "loc-jjk-roppongi": P(139.7314, 35.6628),
        "loc-jjk-tokyo-colony-1": P(139.7109, 35.7295),
        "loc-jjk-tokyo-colony-2": P(139.7650, 35.6717),
        "loc-jjk-eishu": P(139.5383, 35.7253),
        "loc-jjk-satozakura": P(139.659, 35.576),
        "loc-jjk-kawasaki-cinema": P(139.697, 35.531),
        "loc-jjk-yasohachi-bridge": P(139.215, 35.905),
    }
    # istituto: il complesso fra i boschi
    jx, jy = pins["loc-jjk-jujutsu-high"]
    svg.add(f'<rect x="{f(jx - 30)}" y="{f(jy - 22)}" width="60" height="30" fill="#8c3a2c" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<path d="M{f(jx - 40)},{f(jy - 22)} L{f(jx)},{f(jy - 44)} L{f(jx + 40)},{f(jy - 22)} Z" fill="#3b3346" '
            f'stroke="{INK}" stroke-width="1.4"/>')
    svg.add(text(jx, jy + 30, "Istituto di arti occulte di Tokyo", size=14, fill=INK, weight="bold", halo=PAPER, halo_w=4))
    svg.add(text(jx, jy + 47, "posizione immaginaria · colline a ovest", size=11, fill=INK, italic=True, halo=PAPER, halo_w=3))
    bx, by = pins["loc-jjk-yasohachi-bridge"]
    svg.add(f'<path d="M{f(bx - 26)},{f(by + 6)} q26,-22 52,0" fill="none" stroke="{INK}" stroke-width="3"/>')
    svg.add(text(bx, by + 30, "ponte Yasohachi (canyon di Koinokuchi, immaginario)", size=11, fill=INK, italic=True,
                 halo=PAPER, halo_w=3))
    svg.add(compass(1920, 90, r=44, ink=INK, fill=PAPER, accent=BLOOD))
    svg.add(scale_bar(1560, 1330, 10 * k, "10 km", ink=INK, halo=PAPER))
    title(svg, 1560, 80, "Tokyo", "Tokyo e dintorni · Tokyo and surroundings", jp="東京", w=420)
    return_box(svg, 52, 1350, "Torna al Giappone")
    pins["loc-jjk-tokyo-return"] = (52, 1350)
    svg.add(text(T_W / 2, T_H - 10, "Coste e prefetture: Natural Earth 1:10m (dominio pubblico) · fiumi e ferrovia ridisegnati",
                 size=12, fill="#eef2f4", italic=True, opacity=0.85))
    save(svg, "jjk-tokyo.svg", pins)
    return pins


# =============================================================================
# 3. SHIBUYA — l'Incidente del 31 ottobre 2018 · 1500 × 1700
# =============================================================================
S_W, S_H = 1500, 1700
STREETS = {
    # (lat, lon) lungo l'asse della strada; larghezza in px
    "Meiji-dōri": ([(35.6728, 139.7064), (35.6688, 139.7055), (35.6650, 139.7047), (35.6620, 139.7040),
                    (35.6595, 139.7036), (35.6575, 139.7037), (35.6545, 139.7050), (35.6500, 139.7075)], 15),
    "Aoyama-dōri": ([(35.6652, 139.7130), (35.6625, 139.7088), (35.6605, 139.7052), (35.6595, 139.7034)], 16),
    "R. 246 · Tamagawa-dōri": ([(35.6595, 139.7034), (35.6583, 139.7012), (35.6575, 139.6995), (35.6563, 139.6973),
                                (35.6551, 139.6948), (35.6538, 139.6886)], 18),
    "Dōgenzaka": ([(35.6596, 139.6987), (35.6585, 139.6972), (35.6573, 139.6956), (35.6562, 139.6940)], 11),
    "Bunkamura-dōri": ([(35.6596, 139.6987), (35.6603, 139.6970), (35.6608, 139.6952), (35.6613, 139.6928)], 10),
    "Center Gai": ([(35.6598, 139.7003), (35.6603, 139.6993), (35.6608, 139.6982), (35.6613, 139.6969)], 8),
    "Kōen-dōri": ([(35.6602, 139.7010), (35.6615, 139.7003), (35.6630, 139.6996), (35.6648, 139.6988),
                   (35.6668, 139.6979)], 10),
    "Inokashira-dōri": ([(35.6605, 139.7005), (35.6618, 139.6985), (35.6635, 139.6965), (35.6655, 139.6940),
                         (35.6682, 139.6898)], 11),
    "Omotesandō": ([(35.6698, 139.7028), (35.6688, 139.7055), (35.6672, 139.7086), (35.6656, 139.7126)], 13),
    "Miyamasuzaka": ([(35.6595, 139.7036), (35.6598, 139.7060), (35.6600, 139.7090), (35.6603, 139.7125)], 9),
}
JR = [(35.6730, 139.7024), (35.6702, 139.7027), (35.6670, 139.7024), (35.6640, 139.7020), (35.6610, 139.7017),
      (35.6580, 139.7016), (35.6555, 139.7022), (35.6530, 139.7038), (35.6500, 139.7062)]


def shibuya() -> dict:
    rng = random.Random(1031)
    P = Merc(139.6888, 139.7128, 35.6505, 35.6727, S_W, S_H, pad=0)
    k = P.km(35.66)  # px per km
    svg = Svg(S_W, S_H, "Jujutsu Kaisen · Shibuya, 31 ottobre 2018 / The Shibuya Incident", CREDIT)
    svg.add(f'<rect width="{S_W}" height="{S_H}" fill="#e3ddd0"/>')
    # verde: bosco del santuario Meiji / parco Yoyogi, Miyashita Park
    forest = [P(lo, la) for la, lo in ((35.6730, 139.6885), (35.6730, 139.7019), (35.6705, 139.7019),
                                        (35.6692, 139.6992), (35.6674, 139.6976), (35.6662, 139.6950),
                                        (35.6656, 139.6885))]
    svg.add(f'<path d="{poly(forest)}" fill="#b9c99a" stroke="#6f8a52" stroke-width="1.5"/>')
    svg.add(wood(svg, scatter(rng, 260, (0, 0, S_W, S_H), lambda x, y: pip(x, y, forest), mind=16), rng, r=9,
                 fill="#7c9a5c", dark="#55703c", light="#a2bd7c", stroke="#3a4a2a", sw=0.8))
    x, y = P(139.6950, 35.6705)
    svg.add(text(x, y, "bosco del santuario Meiji · parco Yoyogi", size=15, fill="#3a4a2a", italic=True,
                 halo="#dfe6cf", halo_w=4))
    mp = [P(lo, la) for la, lo in ((35.6635, 139.7021), (35.6635, 139.7029), (35.6608, 139.7027), (35.6608, 139.7020))]
    svg.add(f'<path d="{poly(mp)}" fill="#b9c99a" stroke="#6f8a52" stroke-width="1.2"/>')
    # isolati: griglia irregolare di edifici (densità reale di Shibuya)
    roads = {name: [P(lo, la) for la, lo in pts] for name, (pts, _) in STREETS.items()}
    jr = [P(lo, la) for la, lo in JR]

    def near_line(x, y, pts, d):
        for (ax, ay), (bx, by) in zip(pts, pts[1:]):
            dx, dy = bx - ax, by - ay
            L = dx * dx + dy * dy or 1e-9
            t = max(0, min(1, ((x - ax) * dx + (y - ay) * dy) / L))
            if (x - ax - t * dx) ** 2 + (y - ay - t * dy) ** 2 < d * d:
                return True
        return False

    def free(x, y):
        if pip(x, y, forest) or pip(x, y, mp):
            return False
        if near_line(x, y, jr, 22):
            return False
        return not any(near_line(x, y, pts, STREETS[n][1] / 2 + 9) for n, pts in roads.items())

    bl = ['<g fill="#cfc6b4" stroke="#8f8573" stroke-width="0.8">']
    for x, y in scatter(rng, 2400, (0, 0, S_W, S_H), free, mind=17):
        w, h = rng.uniform(12, 24), rng.uniform(10, 20)
        bl.append(f'<rect x="{f(x - w / 2)}" y="{f(y - h / 2)}" width="{f(w)}" height="{f(h)}" '
                  f'transform="rotate({f(rng.uniform(-12, 12))} {f(x)} {f(y)})"/>')
    bl.append("</g>")
    svg.add(bl)
    # fiume Shibuya (che riemerge a sud della stazione)
    svg.add(river([P(lo, la) for la, lo in ((35.6577, 139.7029), (35.6560, 139.7034), (35.6540, 139.7046),
                                             (35.6520, 139.7058), (35.6500, 139.7076))], width=7, color="#9fbccc",
                  edge="#5f7f92"))
    # strade
    for name, pts in roads.items():
        w = STREETS[name][1]
        svg.add(road(pts, width=w, color="#f6f1e6", edge="#8f8573"))
    # sopraelevata n.3 sopra la 246
    svg.add(f'<path d="{smooth(roads["R. 246 · Tamagawa-dōri"], closed=False)}" fill="none" stroke="#7a7468" '
            f'stroke-width="7" opacity="0.55" stroke-dasharray="14 4"/>')
    for name, (la, lo, rot) in {"Meiji-dōri": (35.6640, 139.70455, -80), "R. 246 · Tamagawa-dōri": (35.6551, 139.6930, 22),
                                "Dōgenzaka": (35.6575, 139.6955, 50), "Bunkamura-dōri": (35.6609, 139.6945, -16),
                                "Center Gai": (35.6611, 139.6976, -40), "Kōen-dōri": (35.6655, 139.69845, -64),
                                "Inokashira-dōri": (35.6646, 139.6950, -48), "Omotesandō": (35.6670, 139.7090, -30),
                                "Aoyama-dōri": (35.6628, 139.7092, -40), "Miyamasuzaka": (35.6604, 139.7100, -4)}.items():
        x, y = P(lo, la)
        svg.add(text(x, y + 4, name, size=13, fill="#4a4338", italic=True, rot=rot, halo="#f6f1e6", halo_w=3))
    # ferrovia JR Yamanote / Saikyō (e il terminal della Inokashira)
    svg.add(f'<path d="{smooth(jr, closed=False)}" fill="none" stroke="{INK}" stroke-width="9"/>')
    svg.add(f'<path d="{smooth(jr, closed=False)}" fill="none" stroke="#f6f1e6" stroke-width="5" stroke-dasharray="12 10"/>')
    ino = [P(lo, la) for la, lo in ((35.6584, 139.6990), (35.6579, 139.6962), (35.6576, 139.6925), (35.6572, 139.6888))]
    svg.add(f'<path d="{smooth(ino, closed=False)}" fill="none" stroke="{INK}" stroke-width="5" stroke-dasharray="8 6"/>')
    x, y = P(139.7026, 35.6672)
    svg.add(text(x + 12, y, "JR Yamanote", size=13, fill=INK, italic=True, anchor="start", rot=-88, halo="#e3ddd0", halo_w=3))
    # edifici simbolo
    def bld(la, lo, w, h, name, fill="#b7aa95", dx=0, dy=0, anchor="middle", size=13):
        x, y = P(lo, la)
        svg.add(f'<rect x="{f(x - w / 2)}" y="{f(y - h / 2)}" width="{f(w)}" height="{f(h)}" fill="{fill}" '
                f'stroke="{INK}" stroke-width="1.6"/>')
        if name:
            svg.add(text(x + dx, y + dy, name, size=size, fill=INK, weight="bold", anchor=anchor, halo="#f4efe4", halo_w=3))
    bld(35.65805, 139.70155, 70, 120, None, fill="#a99b84")        # stazione JR
    bld(35.65845, 139.7022, 46, 46, "Scramble Square", fill="#8f8a9a", dx=0, dy=-34)
    bld(35.6590, 139.7038, 48, 40, "Hikarie", fill="#8f8a9a", dx=40, dy=-14, anchor="start")
    bld(35.6584, 139.6992, 86, 30, "Mark City", fill="#a99b84", dx=0, dy=34)
    bld(35.6567, 139.7034, 34, 46, "Shibuya Stream", fill="#8f8a9a", dx=30, dy=8, anchor="start")
    bld(35.6555, 139.6988, 40, 40, "Cerulean Tower", fill="#a99b84", dx=0, dy=40)
    bld(35.6608, 139.6955, 50, 34, "Tōkyū · Bunkamura", fill="#a99b84", dx=0, dy=-26)
    x, y = P(139.6986, 35.6596)
    svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="18" fill="#c9c3cf" stroke="{INK}" stroke-width="1.8"/>')
    svg.add(text(x, y + 5, "109", size=14, fill=INK, weight="bold"))
    # incrocio Scramble (strisce pedonali)
    x, y = P(139.7005, 35.6596)
    zebra = [f'<g stroke="#ffffff" stroke-width="5" opacity="0.95">']
    for a in (0, 90, 45, -45):
        for t in (-24, -12, 0, 12, 24):
            ang = math.radians(a)
            cx, cy = x + math.cos(ang) * t, y + math.sin(ang) * t
            nx, ny = -math.sin(ang) * 9, math.cos(ang) * 9
            zebra.append(f'<path d="M{f(cx - nx)},{f(cy - ny)} L{f(cx + nx)},{f(cy + ny)}"/>')
    zebra.append("</g>")
    svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="34" fill="#c8c1b3" stroke="#8f8573" stroke-width="1"/>', zebra)
    svg.add(text(x - 40, y - 34, "incrocio Scramble", size=13, fill=INK, italic=True, anchor="end", halo="#f4efe4", halo_w=3))
    x, y = P(139.7016, 35.6580)
    svg.add(text(x, y + 84, "STAZIONE DI SHIBUYA", size=15, fill=INK, weight="bold", spacing=1,
                 halo="#f4efe4", halo_w=4))
    # il Velo: 400 m di raggio attorno alla stazione
    r = 0.4 * k
    svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{CURSE}" fill-opacity="0.13" stroke="{CURSE}" '
            f'stroke-width="3"/>')
    svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r - 7)}" fill="none" stroke="{CURSE_L}" stroke-width="1.5" '
            f'stroke-dasharray="8 6"/>')
    svg.add(text(x + r * 0.72, y + r * 0.72 + 20, "il Velo · 帳 · raggio 400 m", size=16, fill=CURSE, weight="bold",
                 halo="#f4efe4", halo_w=4, rot=-45))
    # stazione Meiji-jingumae (Harajuku)
    x, y = P(139.7055, 35.6688)
    svg.add(f'<rect x="{f(x - 14)}" y="{f(y - 10)}" width="28" height="20" rx="4" fill="#8f8a9a" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(text(x + 22, y - 16, "Meiji-jingumae · Harajuku", size=14, fill=INK, weight="bold", anchor="start",
                 halo="#f4efe4", halo_w=3))
    xh, yh = P(139.7027, 35.6702)
    svg.add(text(xh - 14, yh + 4, "st. Harajuku", size=12, fill=INK, italic=True, anchor="end", halo="#e3ddd0", halo_w=3))
    pins = {
        "loc-jjk-shibuya-b5f": P(139.7029, 35.6587),
        "loc-jjk-shibuya-station": P(139.7011, 35.6577),
        "loc-jjk-meiji-jingumae": P(139.7055, 35.6688),
        "loc-jjk-shibuya-stream": P(139.7034, 35.6566),
        "loc-jjk-shibuya-109": P(139.6986, 35.6596),
        "loc-jjk-dogenzaka": P(139.6957, 35.6574),
        "loc-jjk-shibuya-curtain": P(139.7016, 35.6580 + 0.0036),
    }
    svg.add(compass(1420, 300, r=40, ink=INK, fill="#f4efe4", accent=BLOOD))
    svg.add(scale_bar(1110, 1630, 0.25 * k, "250 m", ink=INK, halo="#f4efe4"))
    title(svg, 1230, 90, "Shibuya", "L'Incidente di Shibuya · 31.10.2018", jp="渋谷事変", w=440)
    return_box(svg, 52, 1650, "Torna a Tokyo")
    pins["loc-jjk-shibuya-return"] = (52, 1650)
    save(svg, "jjk-shibuya.svg", pins)
    return pins


# =============================================================================
# 4. L'ISTITUTO DI ARTI OCCULTE DI TOKYO — pianta immaginata · 1600 × 1100
# =============================================================================
H_W, H_H = 1600, 1100


def temple(x, y, w, h, roof="#3b3346", wall="#9a3b2c", tiers=1, stroke=INK) -> list[str]:
    """Edificio in stile tempio: muro rosso, tetto scuro a falde ricurve (geometria originale)."""
    out = [f'<rect x="{f(x - w / 2)}" y="{f(y - h)}" width="{f(w)}" height="{f(h)}" fill="{wall}" stroke="{stroke}" '
           f'stroke-width="1.6"/>']
    for t in range(tiers):
        yy = y - h - t * h * 0.55
        ww = w * (1.25 - t * 0.18)
        out.append(f'<path d="M{f(x - ww / 2)},{f(yy)} Q{f(x - ww * 0.3)},{f(yy - h * 0.18)} {f(x - ww * 0.18)},{f(yy - h * 0.42)} '
                   f'L{f(x + ww * 0.18)},{f(yy - h * 0.42)} Q{f(x + ww * 0.3)},{f(yy - h * 0.18)} {f(x + ww / 2)},{f(yy)} Z" '
                   f'fill="{roof}" stroke="{stroke}" stroke-width="1.6" stroke-linejoin="round"/>')
    return out


def campus() -> dict:
    rng = random.Random(2017)
    svg = Svg(H_W, H_H, "Jujutsu Kaisen · Istituto di arti occulte di Tokyo / Tokyo Jujutsu High (pianta immaginata)",
              CREDIT.replace("geografia: Natural Earth (dominio pubblico) · ", ""))
    g = svg.gradient("grass", [(0, "#a7b98a"), (1, "#8fa673")])
    svg.add(f'<rect width="{H_W}" height="{H_H}" fill="{g}"/>')
    # radura del complesso (terra battuta) e bosco tutto intorno
    clearing = [(560, 250), (980, 210), (1240, 300), (1300, 520), (1180, 760), (900, 860), (640, 820), (520, 600)]
    svg.add(f'<path d="{smooth(clearing)}" fill="#d9cfb4" stroke="#8a7e64" stroke-width="2"/>')
    pts = scatter(rng, 1500, (0, 0, H_W, H_H), lambda x, y: not pip(x, y, clearing) and not (1290 < x and y > 700),
                  mind=17)
    svg.add(wood(svg, pts, rng, r=11, fill="#5f8248", dark="#3f5a30", light="#86a868", stroke="#2c3b22", sw=0.9))
    # campo da baseball (lo scambio di Kyoto, secondo giorno)
    bx, by = 1060, 680
    svg.add(f'<path d="M{bx},{by + 90} L{bx - 120},{by - 30} A170,170 0 0,1 {bx + 120},{by - 30} Z" fill="#c6b48a" '
            f'stroke="{INK}" stroke-width="1.5"/>')
    svg.add(f'<path d="M{bx},{by + 90} l-40,-40 l40,-40 l40,40 Z" fill="#9fb27c" stroke="#ffffff" stroke-width="2"/>')
    svg.add(text(bx, by + 116, "campo sportivo", size=14, fill=INK, italic=True, halo="#e9e2cc", halo_w=3))
    # scalinata e strada d'accesso dal fondovalle (sud-est)
    svg.add(road([(1580, 1080), (1430, 1000), (1300, 960), (1150, 930), (980, 900), (900, 860)], width=14,
                 color="#cfc4a6", edge="#7d7258"))
    steps = [f'<g stroke="{INK}" stroke-width="1">']
    for i in range(10):
        steps.append(f'<rect x="{f(880 - i * 1)}" y="{f(860 - i * 9)}" width="{f(60 + i * 0)}" height="9" fill="#bdb39a"/>')
    steps.append("</g>")
    svg.add(steps)
    # portale d'ingresso
    gx, gy = 910, 770
    svg.add(f'<rect x="{gx - 50}" y="{gy - 50}" width="10" height="56" fill="#9a3b2c" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<rect x="{gx + 40}" y="{gy - 50}" width="10" height="56" fill="#9a3b2c" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<path d="M{gx - 66},{gy - 50} Q{gx},{gy - 64} {gx + 66},{gy - 50} L{gx + 60},{gy - 40} L{gx - 60},{gy - 40} Z" '
            f'fill="#3b3346" stroke="{INK}" stroke-width="1.4"/>')
    # sentieri interni
    for line in ([(910, 760), (880, 640), (860, 520), (860, 430)], [(860, 560), (720, 560), (640, 520)],
                 [(870, 600), (1000, 600), (1060, 620)], [(860, 470), (1040, 420), (1150, 430)],
                 [(860, 430), (760, 360), (660, 330)]):
        svg.add(road(line, width=8, color="#e6dcc0", edge="#9a8e72"))
    # edifici
    svg.add(temple(860, 420, 200, 80, tiers=2))                     # edificio principale
    svg.add(text(860, 452, "edificio principale · aule e uffici", size=14, fill=INK, weight="bold", halo="#e9e2cc", halo_w=3))
    svg.add(temple(640, 330, 120, 60))                              # magazzino
    svg.add(text(640, 352, "magazzino di massima sicurezza", size=13, fill=INK, halo="#e9e2cc", halo_w=3))
    svg.add(temple(1150, 430, 120, 54, roof="#4a4258", wall="#d8cdb6"))  # dormitori
    svg.add(text(1150, 452, "dormitori", size=14, fill=INK, halo="#e9e2cc", halo_w=3))
    svg.add(temple(640, 540, 100, 48, roof="#4a4258", wall="#d8cdb6"))   # infermeria
    svg.add(text(640, 562, "infermeria · sala autopsie", size=13, fill=INK, halo="#e9e2cc", halo_w=3))
    # pagoda (decorazione)
    px, py = 1240, 330
    for t in range(5):
        w = 54 - t * 8
        yy = py - t * 26
        svg.add(f'<rect x="{f(px - w * 0.35)}" y="{f(yy - 18)}" width="{f(w * 0.7)}" height="18" fill="#9a3b2c" stroke="{INK}" stroke-width="1.2"/>')
        svg.add(f'<path d="M{f(px - w / 2)},{f(yy - 18)} L{f(px)},{f(yy - 30)} L{f(px + w / 2)},{f(yy - 18)} Z" fill="#3b3346" stroke="{INK}" stroke-width="1.2"/>')
    svg.add(f'<path d="M{px},{py - 150} V{py - 124}" stroke="{INK}" stroke-width="2"/>')
    # cortile
    svg.add(text(940, 560, "cortile", size=15, fill=INK, italic=True, halo="#e9e2cc", halo_w=3))
    # il bosco dello scambio
    svg.add(region_label(300, 300, "Il bosco", sub="teatro della sfida a squadre con Kyoto", size=24, color="#2c3b22",
                         halo="#c9d4b4"))
    # ruscello
    svg.add(river([(0, 760), (180, 720), (330, 760), (450, 900), (520, 1100)], width=8, color="#9fbccc", edge="#5f7f92"))
    # spaccato: la Tomba delle Stelle sotto il complesso
    cx, cy, cr = 1440, 900, 150
    svg.add(f'<circle cx="{cx}" cy="{cy}" r="{cr}" fill="#1c1826" stroke="#8f7ac8" stroke-width="3"/>')
    svg.add(f'<path d="M{cx},{cy + 120} C{cx - 10},{cy + 40} {cx + 12},{cy - 10} {cx},{cy - 80}" fill="none" stroke="#6a5a3a" '
            f'stroke-width="22" stroke-linecap="round"/>')
    for a in (-150, -120, -60, -30, -95):
        ang = math.radians(a)
        svg.add(f'<path d="M{cx},{cy - 70} q{f(math.cos(ang) * 40)},{f(math.sin(ang) * 20)} {f(math.cos(ang) * 95)},'
                f'{f(math.sin(ang) * 55)}" fill="none" stroke="#6a5a3a" stroke-width="7" stroke-linecap="round"/>')
    svg.add(dots(rng, (cx - cr, cy - cr, cx + cr, cy + cr), 60, color="#d8ccff", r=(0.6, 1.8),
                 ok=lambda x, y: math.hypot(x - cx, y - cy) < cr - 8, opacity=(0.4, 0.9)))
    svg.add(text(cx, cy + cr + 22, "spaccato · sottoterra", size=12, fill=INK, italic=True, halo="#e9e2cc", halo_w=3))
    svg.add(f'<path d="M{cx - cr + 10},{cy - 60} L860,452" stroke="#8f7ac8" stroke-width="2" stroke-dasharray="6 5"/>')
    pins = {
        "loc-jjk-jh-gate": (gx, gy),
        "loc-jjk-jh-main-hall": (860, 395),
        "loc-jjk-jh-courtyard": (920, 590),
        "loc-jjk-jh-storage": (640, 305),
        "loc-jjk-jh-dorms": (1150, 405),
        "loc-jjk-jh-infirmary": (640, 520),
        "loc-jjk-jh-forest": (300, 420),
        "loc-jjk-jh-sports-field": (bx, by),
        "loc-jjk-tombs-of-the-star": (cx, cy - 20),
    }
    svg.add(compass(1520, 90, r=40, ink=INK, fill="#efe8d8", accent=BLOOD))
    title(svg, 1170, 90, "Istituto di Tokyo", "Tokyo Jujutsu High · pianta immaginata", jp="東京都立呪術高等専門学校", w=470)
    return_box(svg, 52, 1050, "Torna a Tokyo")
    pins["loc-jjk-jh-return"] = (52, 1050)
    save(svg, "jjk-jujutsu-high.svg", pins)
    return pins


# =============================================================================
# 5. KYOTO — 1500 × 1500
# =============================================================================
K_W, K_H = 1500, 1500


def kyoto() -> dict:
    rng = random.Random(1194)
    P = Merc(135.662, 135.835, 34.945, 35.065, K_W, K_H, pad=0)
    k = P.km(35.0)
    svg = Svg(K_W, K_H, "Jujutsu Kaisen · Kyoto", CREDIT)
    svg.add(f'<rect width="{K_W}" height="{K_H}" fill="#e6dcc4"/>')
    # colline: Higashiyama (est), Kitayama (nord), Nishiyama/Arashiyama (ovest)
    hills = [
        [P(lo, la) for la, lo in ((35.065, 135.79), (35.065, 135.835), (34.945, 135.835), (34.945, 135.795),
                                   (34.97, 135.783), (35.00, 135.788), (35.03, 135.792), (35.05, 135.79))],
        [P(lo, la) for la, lo in ((35.065, 135.662), (35.065, 135.79), (35.052, 135.76), (35.048, 135.72),
                                   (35.05, 135.69), (35.04, 135.662))],
        [P(lo, la) for la, lo in ((35.04, 135.662), (35.02, 135.672), (35.0, 135.678), (34.97, 135.682),
                                   (34.945, 135.69), (34.945, 135.662))],
    ]
    for hp in hills:
        svg.add(f'<path d="{smooth(hp)}" fill="#c3c9a2" stroke="#7d8a5a" stroke-width="1.5"/>')
        svg.add(wood(svg, scatter(rng, 400, (0, 0, K_W, K_H), lambda x, y, hp=hp: pip(x, y, hp), mind=15), rng, r=9,
                     fill="#6f8f50", dark="#4a6634", light="#94b070", stroke="#2c3b22", sw=0.8, kind="pine"))
    # griglia urbana (le vie storiche)
    ew = {"Kitaōji": 35.0447, "Imadegawa": 35.0298, "Marutamachi": 35.0177, "Oike": 35.0103, "Shijō": 35.0037,
          "Gojō": 34.9955, "Shichijō": 34.9883, "Kujō": 34.9813}
    ns = {"Nishiōji": 135.7305, "Senbon": 135.7425, "Horikawa": 135.7505, "Karasuma": 135.7595, "Kawaramachi": 135.7690}
    grid = ['<g stroke="#f6f1e6" stroke-width="7" stroke-linecap="round">']
    lab = []
    for name, la in ew.items():
        x0, y0 = P(135.722, la)
        x1, _ = P(135.776, la)
        grid.append(f'<path d="M{f(x0)},{f(y0)} H{f(x1)}"/>')
        lab.append(text(x0 - 6, y0 + 4, name, size=12, fill="#5a4f40", italic=True, anchor="end", halo="#e6dcc4", halo_w=3))
    for name, lo in ns.items():
        x0, y0 = P(lo, 35.048)
        _, y1 = P(lo, 34.978)
        grid.append(f'<path d="M{f(x0)},{f(y0)} V{f(y1)}"/>')
        lab.append(text(x0, y1 + 16, name, size=12, fill="#5a4f40", italic=True, halo="#e6dcc4", halo_w=3))
    grid.append("</g>")
    svg.add(f'<g stroke="#a99d85" stroke-width="10" stroke-linecap="round" opacity="0.6">' +
            "".join(g.replace('stroke="#f6f1e6" stroke-width="7"', "") for g in grid[1:-1]) + "</g>")
    svg.add(grid, lab)
    blocks = ['<g fill="#cfc6b4" stroke="#8f8573" stroke-width="0.6">']
    cx0, cy0 = P(135.758, 35.005)
    for x, y in scatter(rng, 24000, (0, 0, K_W, K_H), lambda x, y: not any(pip(x, y, hp) for hp in hills), mind=8):
        d = math.hypot(x - cx0, y - cy0) / k
        if rng.random() < max(0.08, 1.1 - d / 4.5):
            w = rng.uniform(5, 9)
            blocks.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(w * 0.8)}" opacity="0.8"/>')
    blocks.append("</g>")
    svg.add(blocks)
    # fiumi
    kamo = [(35.065, 135.752), (35.045, 135.760), (35.030, 135.7715), (35.010, 135.7715), (34.990, 135.7710),
            (34.975, 135.764), (34.958, 135.750), (34.945, 135.738)]
    takano = [(35.065, 135.795), (35.045, 135.785), (35.030, 135.7715)]
    katsura = [(35.020, 135.662), (35.012, 135.678), (34.995, 135.690), (34.975, 135.700), (34.958, 135.708),
               (34.945, 135.716)]
    for name, line, w in (("Kamo", kamo, 9), ("Takano", takano, 6), ("Katsura", katsura, 11)):
        svg.add(river([P(lo, la) for la, lo in line], width=w, color="#9fbccc", edge="#5f7f92"))
    for name, la, lo, rot in (("fiume Kamo", 35.040, 135.7635, 62), ("fiume Katsura", 34.985, 135.6945, 66)):
        x, y = P(lo, la)
        svg.add(text(x + 16, y, name, size=14, fill="#3f5f72", italic=True, halo="#e6dcc4", halo_w=3, rot=rot))
    # monumenti (non pin)
    def mark(la, lo, name, kind="temple", dx=14, anchor="start"):
        x, y = P(lo, la)
        if kind == "pagoda":
            for t in range(4):
                w = 20 - t * 4
                svg.add(f'<path d="M{f(x - w / 2)},{f(y - t * 10)} L{f(x)},{f(y - t * 10 - 8)} L{f(x + w / 2)},{f(y - t * 10)} Z" '
                        f'fill="#3b3346" stroke="{INK}" stroke-width="1"/>')
        elif kind == "park":
            svg.add(f'<rect x="{f(x - 34)}" y="{f(y - 50)}" width="68" height="100" fill="#b9c99a" stroke="#6f8a52" stroke-width="1.4"/>')
        elif kind == "castle":
            svg.add(f'<rect x="{f(x - 30)}" y="{f(y - 24)}" width="60" height="48" fill="none" stroke="#5f7f92" stroke-width="5"/>')
        elif kind == "station":
            svg.add(f'<rect x="{f(x - 40)}" y="{f(y - 9)}" width="80" height="18" fill="#8f8a9a" stroke="{INK}" stroke-width="1.4"/>')
        elif kind == "torii":
            svg.add(f'<path d="M{f(x - 10)},{f(y)} V{f(y - 18)} M{f(x + 10)},{f(y)} V{f(y - 18)} M{f(x - 15)},{f(y - 18)} H{f(x + 15)} '
                    f'M{f(x - 12)},{f(y - 13)} H{f(x + 12)}" stroke="#b0352c" stroke-width="3" fill="none"/>')
        else:
            svg.add(temple(x, y, 22, 12))
        svg.add(text(x + dx, y + 4, name, size=13, fill=INK, anchor=anchor, halo="#f4efe4", halo_w=3))
    mark(34.9858, 135.7588, "stazione di Kyoto", "station", dx=46)
    mark(35.0254, 135.7621, "Palazzo Imperiale", "park", dx=40)
    mark(35.0142, 135.7481, "castello Nijō", "castle", dx=-36, anchor="end")
    mark(34.9949, 135.7850, "Kiyomizu-dera", "temple")
    mark(35.0037, 135.7785, "Gion · Yasaka", "torii")
    mark(34.9671, 135.7727, "Fushimi Inari", "torii")
    mark(35.0394, 135.7292, "Kinkaku-ji", "temple")
    mark(34.9805, 135.7477, "Tō-ji", "pagoda", dx=-14, anchor="end")
    mark(35.0094, 135.6780, "Arashiyama", "temple")
    for la, lo, name in ((35.035, 135.805, "Higashiyama"), (35.058, 135.735, "Kitayama"), (34.975, 135.670, "Nishiyama")):
        x, y = P(lo, la)
        svg.add(text(x, y, name.upper(), size=17, fill="#3a4a2a", weight="bold", spacing=4, halo="#c3c9a2", halo_w=4))
    pins = {
        "loc-jjk-kyoto-jujutsu-high": P(135.7985, 35.0195),
        "loc-jjk-zenin-estate": P(135.7105, 35.0335),
        "loc-jjk-kyoto-colony": P(135.7600, 35.0040),
        "loc-jjk-kyoto-night-parade": P(135.7588, 34.9890),
    }
    x, y = pins["loc-jjk-kyoto-colony"]
    svg.add(dome(x, y, 2.2 * k, "Colonia di Kyoto", size=15))
    x, y = pins["loc-jjk-kyoto-jujutsu-high"]
    svg.add(temple(x, y + 26, 70, 30, tiers=2))
    svg.add(text(x, y + 50, "Istituto di Kyoto (posizione immaginaria)", size=12, fill=INK, italic=True, halo="#f4efe4", halo_w=3))
    x, y = pins["loc-jjk-zenin-estate"]
    svg.add(f'<rect x="{f(x - 48)}" y="{f(y - 30)}" width="96" height="60" fill="none" stroke="{INK}" stroke-width="3"/>')
    svg.add(temple(x, y + 18, 54, 24))
    svg.add(text(x, y + 48, "tenuta Zen'in (posizione immaginaria)", size=12, fill=INK, italic=True, halo="#f4efe4", halo_w=3))
    svg.add(compass(1420, 1380, r=40, ink=INK, fill="#efe8d8", accent=BLOOD))
    svg.add(scale_bar(1060, 1440, 1 * k, "1 km", ink=INK, halo="#f4efe4"))
    title(svg, 1220, 90, "Kyoto", "Kyoto · la città dei clan", jp="京都", w=420)
    return_box(svg, 52, 1450, "Torna al Giappone")
    pins["loc-jjk-kyoto-return"] = (52, 1450)
    save(svg, "jjk-kyoto.svg", pins)
    return pins


# =============================================================================
# 6. SENDAI — 1600 × 1100
# =============================================================================
D_W, D_H = 1600, 1100


def sendai() -> dict:
    rng = random.Random(2018)
    P = Merc(140.78, 141.05, 38.19, 38.33, D_W, D_H, pad=0)
    k = P.km(38.26)
    svg = Svg(D_W, D_H, "Jujutsu Kaisen · Sendai", CREDIT)
    g = svg.gradient("sea", [(0, SEA_T), (1, SEA_B)])
    svg.add(f'<rect width="{D_W}" height="{D_H}" fill="{g}"/>')
    feats = admin1()
    miy = next(ft for ft in feats if ft["properties"]["name"] == "Miyagi")
    land = []
    for ring in rings_of(miy["geometry"]):
        if any(140.7 <= lo <= 141.1 and 38.1 <= la <= 38.4 for lo, la in ring):
            pts = simplify([P(lo, la) for lo, la in ring])
            land.append(pts)
            svg.add(f'<path d="{poly(pts)}" fill="#b9c8cf" stroke="#b9c8cf" stroke-width="16" stroke-linejoin="round"/>')
            svg.add(f'<path d="{poly(pts)}" fill="{LAND}" stroke="{INK}" stroke-width="1.6" stroke-linejoin="round"/>')
    on_land = lambda x, y: any(pip(x, y, pl) for pl in land)
    # Aobayama e colline a ovest
    xw = P(140.83, 38.26)[0]
    west = scatter(rng, 1100, (0, 0, xw + 120, D_H),
                   lambda x, y: on_land(x, y) and x < xw + 70 * math.sin(y / 110.0) + 40 * math.cos(y / 47.0), mind=15)
    svg.add(wood(svg, west, rng, r=9, fill="#6f8f50", dark="#4a6634", light="#94b070", stroke="#2c3b22", sw=0.8))
    # città: densità attorno alla stazione
    cx0, cy0 = P(140.882, 38.260)
    bl = ['<g fill="#cfc6b4" stroke="#8f8573" stroke-width="0.6">']
    for x, y in scatter(rng, 9000, (0, 0, D_W, D_H), on_land, mind=9):
        d = math.hypot(x - cx0, y - cy0) / k
        if x > xw + 70 * math.sin(y / 110.0) + 40 * math.cos(y / 47.0) + 12 and rng.random() < max(0.1, 1.15 - d / 5.0):
            w = rng.uniform(4, 8)
            bl.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(w * 0.8)}" opacity="0.8"/>')
    bl.append("</g>")
    svg.add(bl)
    hirose = [(38.300, 140.780), (38.285, 140.810), (38.270, 140.835), (38.262, 140.852), (38.255, 140.861),
              (38.245, 140.866), (38.242, 140.875), (38.236, 140.895), (38.225, 140.920), (38.212, 140.945),
              (38.200, 140.960)]
    natori = [(38.215, 140.780), (38.205, 140.840), (38.195, 140.900), (38.190, 140.960), (38.180, 141.000)]
    for line, w in ((hirose, 9), (natori, 11)):
        svg.add(river([P(lo, la) for la, lo in line], width=w, color="#9fbccc", edge="#5f7f92"))
    x, y = P(140.866, 38.240)
    svg.add(text(x + 14, y + 20, "fiume Hirose", size=14, fill="#3f5f72", italic=True, anchor="start", halo=PAPER, halo_w=3))
    # stazione e castello di Aoba
    x, y = P(140.8822, 38.2601)
    svg.add(f'<rect x="{f(x - 14)}" y="{f(y - 30)}" width="28" height="60" fill="#8f8a9a" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(text(x + 22, y + 4, "stazione di Sendai", size=14, fill=INK, anchor="start", weight="bold", halo="#f4efe4", halo_w=3))
    x, y = P(140.8567, 38.2527)
    svg.add(f'<path d="M{f(x - 26)},{f(y + 14)} L{f(x - 18)},{f(y - 14)} L{f(x + 18)},{f(y - 14)} L{f(x + 26)},{f(y + 14)} Z" '
            f'fill="#9a8e72" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(text(x, y + 32, "rovine del castello di Aoba", size=13, fill=INK, halo="#f4efe4", halo_w=3))
    x, y = P(140.84, 38.29)
    svg.add(text(x, y, "AOBAYAMA", size=17, fill="#3a4a2a", weight="bold", spacing=4, halo="#c3c9a2", halo_w=4))
    x, y = P(141.03, 38.22)
    svg.add(text(x, y, "Oceano Pacifico", size=22, fill="#eef2f4", italic=True, spacing=4, rot=-70))
    pins = {
        "loc-jjk-sugisawa": P(140.905, 38.292),
        "loc-jjk-sendai-hospital": P(140.872, 38.271),
        "loc-jjk-sendai-colony": P(140.895, 38.248),
    }
    x, y = pins["loc-jjk-sendai-colony"]
    svg.add(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(7.5 * k)}" ry="{f(5.6 * k)}" fill="{CURSE}" fill-opacity="0.12" '
            f'stroke="{CURSE}" stroke-width="3"/>')
    svg.add(text(x, y + 5.6 * k + 26, "la colonia di Sendai copre quasi tutta la città (contorno indicativo)", size=14,
                 fill=CURSE, weight="bold", halo="#f4efe4", halo_w=4))
    x, y = pins["loc-jjk-sugisawa"]
    svg.add(f'<rect x="{f(x - 30)}" y="{f(y - 22)}" width="60" height="30" fill="#d8cdb6" stroke="{INK}" stroke-width="1.5"/>')
    svg.add(text(x, y + 26, "Terzo liceo Sugisawa (immaginario)", size=12, fill=INK, italic=True, halo="#f4efe4", halo_w=3))
    svg.add(compass(1520, 90, r=40, ink=INK, fill="#efe8d8", accent=BLOOD))
    svg.add(scale_bar(1240, 1040, 2 * k, "2 km", ink=INK, halo="#f4efe4"))
    title(svg, 260, 90, "Sendai", "Sendai · la città di Yuji", jp="仙台", w=420)
    return_box(svg, 52, 1050, "Torna al Giappone")
    pins["loc-jjk-sendai-return"] = (52, 1050)
    save(svg, "jjk-sendai.svg", pins)
    return pins


def main():
    pins: dict = {}
    pins.update(japan())
    pins.update(tokyo())
    pins.update(shibuya())
    pins.update(campus())
    pins.update(kyoto())
    pins.update(sendai())
    if os.path.isdir(os.path.join(os.path.dirname(HERE), "..", "src", "data", WORLD)):
        apply_pins(WORLD, pins)


if __name__ == "__main__":
    main()
