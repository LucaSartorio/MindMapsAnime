#!/usr/bin/env python3
"""Mappe ORIGINALI di Attack on Titan (L'Attacco dei Giganti).

Ricostruzioni AniMapVerse disegnate da zero (nessun artwork ufficiale), fedeli alla
geografia che la serie stabilisce:

  * Il Mondo — Isayama ha dichiarato di aver costruito il mondo come «un'immagine
    speculare del nostro»: è la Terra CAPOVOLTA (nord in basso). Il continente di Marley
    è l'Africa rovesciata, Paradis è il Madagascar, Hizuru il Giappone, l'Alleanza del
    Medio Oriente la penisola arabica. Le coste vengono dai dati Natural Earth 1:110m
    (dominio pubblico) ribaltati in verticale: le longitudini restano, le latitudini si
    invertono. Liberio è sulla costa nord-orientale del continente (di fronte a Paradis),
    Karifa sulla costa settentrionale, Odiha e Fort Salta al confine meridionale.
  * Paradis — il Madagascar ribaltato (Natural Earth 1:50m), allargato in orizzontale
    perché le Mura (Wall Maria ha un raggio di 480 km) ci stiano come nella serie: la
    serie stessa non è in scala. Le Mura al centro, la «borderline» e il porto sulla
    costa occidentale, quella rivolta verso Marley.
  * Dentro le Mura — i tre cerchi concentrici in scala (Sina 250 km, Rose 380 km,
    Maria 480 km dal centro: 100 km fra Maria e Rose, 130 fra Rose e Sina), con i
    distretti che sporgono all'esterno di ogni muro sui quattro punti cardinali:
    Shiganshina (sud) e Quinta (ovest, romanzi) su Maria; Trost (sud), Karanes (est),
    Krolva (ovest), Utopia (nord) su Rose; Ehrmich (sud), Stohess (est), Yarckel (ovest),
    Orvud (nord) su Sina; Mitras e la Città Sotterranea al centro.
  * Shiganshina, Trost, Liberio — piante dei luoghi delle grandi battaglie.
  * I Sentieri — la dimensione in cui tutti gli Eldiani sono connessi.

    python3 scripts/mapgen/aot.py → public/assets/worlds/attackontitan/maps/*.svg + pin
"""
from __future__ import annotations

import json
import math
import os
import random
import sys

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from kit import (JP, SERIF, Svg, apply_pins, both, compass, curved_text, dots, ellipse_pts, f, far_from,
                 house, jagged, out_path, patch, pip, plaque, poly, preview, region_label, river, road,
                 scale_pts, scatter, shade, smooth, text, tower, trees, wood)

HERE = os.path.dirname(os.path.abspath(__file__))
INK = "#2b2620"
PAPER = "#ece2c6"
STONE = "#a29a8a"
STONE_D = "#6f685c"
CREDIT = "Ricostruzione originale AniMapVerse · CC0 · non è materiale ufficiale di Attack on Titan"


def save(svg: Svg, name: str, pins: dict) -> None:
    svg.add(getattr(svg, "late", []))
    svg.save(out_path("attackontitan", name))
    preview(svg.path, pins, svg.w, svg.h)


def title(svg, x, y, name, sub, jp="進撃の巨人", w=360):
    svg.add(plaque(x, y, w, 104, name, sub=sub, jp=jp, fill="#2a2a24", stroke="#b0823f", ink="#efe3c4", size=28))


def wings(x, y, s=1.0) -> list[str]:
    """Le Ali della Libertà, stilizzate (geometria originale: due ali sovrapposte)."""
    out = []
    for side, col in ((-1, "#f4f1ea"), (1, "#3a5a8a")):
        pts = []
        for k in range(5):
            pts.append((x + side * (6 + k * 7) * s, y - (16 - k * 7) * s))
            pts.append((x + side * (10 + k * 7) * s, y - (8 - k * 7) * s))
        pts.append((x + side * 4 * s, y + 18 * s))
        out.append(f'<path d="{poly([(x, y + 10 * s)] + pts)}" fill="{col}" stroke="{INK}" stroke-width="1.2" stroke-linejoin="round"/>')
    return out


# =============================================================================
# 1. IL MONDO — Terra capovolta, 2000 × 950
# =============================================================================
W_W, W_H = 2000, 950
LAT_MIN, LAT_MAX = -58.0, 80.0
TOP, BOT = 110.0, 877.0


def wproj(lon: float, lat: float) -> tuple[float, float]:
    """Equirettangolare con le latitudini INVERTITE: il sud in alto, il nord in basso."""
    x = (lon + 180.0) / 360.0 * W_W
    y = TOP + (lat - LAT_MIN) / (LAT_MAX - LAT_MIN) * (BOT - TOP)
    return x, y


def world() -> dict:
    rng = random.Random(9101)
    svg = Svg(W_W, W_H, "Attack on Titan · Il Mondo / The World", CREDIT)
    land = json.load(open(os.path.join(HERE, "data", "ne_110m_land.json")))["rings"]
    P = {
        "loc-aot-paradis": wproj(46.8, -19.4),
        "loc-aot-liberio": wproj(32.6, -25.9),
        "loc-aot-karifa": wproj(25.6, -33.9),
        "loc-aot-odiha": wproj(29.9, 31.2),
        "loc-aot-fort-salta": wproj(-5.5, 31.8),
        "loc-aot-fort-slava": wproj(39.2, 21.5),
        "loc-aot-mid-east": wproj(46.0, 24.5),
        "loc-aot-hizuru": wproj(138.5, 36.0),
        "loc-aot-marley": wproj(22.0, 2.0),
        "loc-aot-paths-gate": (1835, 205),
    }
    g = svg.gradient("sea", [(0, "#8ea7ad"), (1, "#6b8790")])
    svg.add(f'<rect width="{W_W}" height="{W_H}" fill="{g}"/>')
    # reticolo (meridiani e paralleli ogni 30°)
    out = ['<g stroke="#e9e2cf" stroke-width="1" opacity="0.35" fill="none">']
    for lon in range(-180, 181, 30):
        x, _ = wproj(lon, 0)
        out.append(f'<path d="M{f(x)},{f(TOP)} V{f(BOT)}"/>')
    for lat in range(-60, 81, 30):
        _, y = wproj(0, lat)
        if TOP <= y <= BOT:
            out.append(f'<path d="M0,{f(y)} H{W_W}"/>')
    out.append("</g>")
    svg.add(out)
    _, eq = wproj(0, 0)
    svg.add(f'<path d="M0,{f(eq)} H{W_W}" stroke="#efe6cf" stroke-width="1.6" stroke-dasharray="10 6" opacity="0.6"/>')
    # terre emerse (ribaltate)
    rings = []
    for ring in land:
        pts = [wproj(lon, lat) for lon, lat in ring if LAT_MIN - 5 <= lat <= LAT_MAX + 5]
        if len(pts) >= 3:
            rings.append(pts)
    shallow = ['<g fill="#a9bfc0" stroke="#a9bfc0" stroke-width="9" stroke-linejoin="round" opacity="0.8">']
    body = [f'<g fill="#d9cba5" stroke="{INK}" stroke-width="1.3" stroke-linejoin="round">']
    for pts in rings:
        d = poly(pts)
        shallow.append(f'<path d="{d}"/>')
        body.append(f'<path d="{d}"/>')
    shallow.append("</g>")
    body.append("</g>")
    svg.add(shallow, body)
    # Marley: tinta del territorio (il continente dell'Africa capovolta)
    # l'Africa è unita all'Eurasia: si colora solo la parte a ovest del Mar Rosso/Suez
    africa_clip = [(-25, 38), (10, 38.5), (32.2, 31.8), (32.6, 29.8), (43.4, 12.6), (52, 12.2), (55, -40), (-25, -40)]
    svg.add(f'<clipPath id="afr"><path d="{poly([wproj(lo, la) for lo, la in africa_clip])}"/></clipPath>')
    afro = max(rings, key=len)
    svg.add(f'<path d="{poly(afro)}" fill="#c9a77a" opacity="0.6" clip-path="url(#afr)"/>')
    # Hizuru, Medio Oriente: sottolineature di colore
    for (lon, lat, rx, ry, col) in ((138.5, 36.5, 30, 46, "#c75b4a"), (46, 24, 70, 54, "#7a8a5a")):
        x, y = wproj(lon, lat)
        svg.add(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{rx}" ry="{ry}" fill="{col}" opacity="0.22"/>')
    # Paradis: le Mura in miniatura
    x, y = P["loc-aot-paradis"]
    for r in (9, 7, 4.5):
        svg.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" fill="none" stroke="#5a5048" stroke-width="1.2"/>')
    # etichette
    svg.add(region_label(*wproj(12, 15), "Marley", jp="マーレ", sub="il continente · the mainland", size=34, color="#4a2e18", halo="#e9dcbc"))
    svg.add(region_label(*wproj(60, -21), "Paradis", jp="パラディ島", size=20, color="#3a2a1a", halo="#e9dcbc", spacing=3))
    svg.add(region_label(*wproj(52, 30), "Medio Oriente", sub="Mid-East Allied Forces", size=18, color="#2e3a1e", halo="#e9dcbc", spacing=3))
    svg.add(region_label(*wproj(138, 43), "Hizuru", jp="ヒィズル国", size=20, color="#6a1e14", halo="#e9dcbc", spacing=3))
    for (lon, lat, s) in ((-60, -18, "Terre oltreoceano"), (95, 60, "Terre d'Oriente"), (10, 52, "Terre del Nord-Ovest")):
        svg.add(text(*wproj(lon, lat), s, size=16, fill="#5a4a36", italic=True, halo="#e9dcbc", halo_w=3, opacity=0.8))
    for (lon, lat, s) in ((70, -30, "Oceano"), (-25, -10, "Oceano"), (165, 5, "Oceano")):
        svg.add(text(*wproj(lon, lat), s, size=20, fill="#e9f1f2", italic=True, spacing=8, opacity=0.8))
    # riquadro dei Sentieri (dimensione, non geografica)
    svg.add(f'<rect x="1745" y="135" width="180" height="140" rx="8" fill="#0d1022" stroke="#b0823f" stroke-width="2"/>')
    svg.add(dots(rng, (1750, 140, 1920, 270), 90, "#ffffff", (0.5, 1.3), None, (0.3, 0.9)))
    svg.add(f'<path d="M1835,262 C1830,230 1840,210 1835,180" stroke="#cfe8ff" stroke-width="3" fill="none"/>')
    for k in range(7):
        a = math.radians(-150 + k * 20)
        svg.add(f'<path d="M1835,190 q{f(18 * math.cos(a))},{f(10 * math.sin(a))} {f(40 * math.cos(a))},{f(26 * math.sin(a) - 6)}" stroke="#cfe8ff" stroke-width="1.6" fill="none" opacity="0.85"/>')
    svg.add(text(1835, 296, "I Sentieri · The Paths", size=14, fill="#3a2a1a", italic=True, halo="#e9dcbc", halo_w=3))
    svg.add(f'<rect x="6" y="6" width="{W_W - 12}" height="{W_H - 12}" fill="none" stroke="#3a3024" stroke-width="4"/>')
    svg.add(text(1000, 925, "Nella serie il nord è in alto: il mondo è la nostra Terra capovolta · In the series north is up: the world is our Earth turned upside down",
                 size=14, fill="#2b2620", italic=True, halo="#e9dcbc", halo_w=3))
    svg.add(compass(1925, 860, 34, INK, PAPER, "#9e2b25"))
    title(svg, 230, 70, "Il Mondo", "The World · 2.000 anni dopo Ymir", w=360)
    save(svg, "aot-world.svg", P)
    return P


# =============================================================================
# 2. PARADIS — Madagascar capovolto, 1600 × 1100
# =============================================================================
PAR_W, PAR_H = 1600, 1100


def _mdg_km(stretch):
    ring = json.load(open(os.path.join(HERE, "data", "ne_50m_madagascar.json")))["ring"]
    lat0 = sum(p[1] for p in ring) / len(ring)
    lon0 = sum(p[0] for p in ring) / len(ring)
    kx = math.cos(math.radians(lat0)) * 111.32 * stretch   # km per grado × allargamento
    ky = 110.57
    return [((lon - lon0) * kx, -(lat - lat0) * ky) for lon, lat in ring]   # capovolto


def _walls_fit(pts_km, step=8.0):
    """Centro e raggio (km) del cerchio più grande che sta sull'isola con un margine."""
    xs = [p[0] for p in pts_km]
    ys = [p[1] for p in pts_km]
    ring = [k * math.pi / 30 for k in range(60)]
    best = (0.0, 0.0, 0.0)
    for cy in range(int(min(ys)), int(max(ys)), 12):
        for cx in range(int(min(xs)), int(max(xs)), 12):
            if not pip(cx, cy, pts_km):
                continue
            lo, hi = best[0], 900.0
            if not all(pip(cx + (lo + 1) * math.cos(t), cy + (lo + 1) * math.sin(t), pts_km) for t in ring):
                continue
            while hi - lo > step:
                mid = (lo + hi) / 2
                if all(pip(cx + mid * math.cos(t), cy + mid * math.sin(t), pts_km) for t in ring):
                    lo = mid
                else:
                    hi = mid
            if lo > best[0]:
                best = (lo, cx, cy)
    return best


STRETCH = 1.9   # allargamento orizzontale del Madagascar: l'isola della serie è più larga


def paradis_geom():
    """Madagascar capovolto e allargato; le Mura (in proporzione fra loro) nel cerchio più grande che ci sta.

    Nella serie Wall Maria ha un raggio di 480 km, più di metà della larghezza del Madagascar:
    le mappe dell'opera non sono in scala, quindi qui le Mura sono ridotte per stare sull'isola
    mantenendo i rapporti 250 : 380 : 480 fra Sina, Rose e Maria.
    """
    pts_km = _mdg_km(STRETCH)
    r_km, cxk, cyk = _walls_fit(pts_km)
    ys = [p[1] for p in pts_km]
    xs = [p[0] for p in pts_km]
    s = 1000.0 / (max(ys) - min(ys))
    ox = PAR_W / 2 - (min(xs) + max(xs)) / 2 * s
    oy = PAR_H / 2 - (min(ys) + max(ys)) / 2 * s
    pts = [(ox + x * s, oy + y * s) for x, y in pts_km]
    return pts, (r_km * 0.93 * s) / 480.0, (ox + cxk * s, oy + cyk * s)


def coast_x(pts, y, side="west"):
    xs = []
    n = len(pts)
    for i in range(n):
        (x1, y1), (x2, y2) = pts[i], pts[(i + 1) % n]
        if (y1 - y) * (y2 - y) <= 0 and y1 != y2:
            xs.append(x1 + (y - y1) * (x2 - x1) / (y2 - y1))
    return min(xs) if side == "west" else max(xs)


def return_box(svg, x, y, label):
    """Riquadro del pin di ritorno (disegnato per ultimo): il pin a sinistra, il testo a destra."""
    late = getattr(svg, "late", [])
    late += [f'<rect x="{x}" y="{y - 30}" width="170" height="60" rx="6" fill="#2a2a24" stroke="#b0823f" stroke-width="2"/>',
             text(x + 104, y + 5, label, size=14, fill="#efe3c4", italic=True)]
    svg.late = late
    return (x + 30, y)


def paradis() -> dict:
    rng = random.Random(9102)
    svg = Svg(PAR_W, PAR_H, "Paradis Island · パラディ島", CREDIT)
    pts, s, (wx, wy) = paradis_geom()
    rM, rR, rS = 480 * s, 380 * s, 250 * s
    xs = [p[0] for p in pts]
    west = min(xs)
    cw = lambda y, d: (coast_x(pts, y) + d, y)
    P = {
        "loc-aot-paradis-return": return_box(svg, 30, 1040, "↑ Il Mondo"),
        "loc-aot-walls": (wx, wy),
        "loc-aot-borderline": cw(wy + 90, 34),
        "loc-aot-first-sea": cw(wy + 190, 24),
        "loc-aot-paradis-port": cw(wy - 150, 24),
        "loc-aot-outer-lands": (wx + 30, min(wy + rM + 90, PAR_H - 120)),
        "loc-aot-railway": (wx - rM * 0.78, wy - rM * 0.5),
    }
    pins = list(P.values())
    g = svg.gradient("sea", [(0, "#87a3aa"), (1, "#5f7d86")])
    svg.add(f'<rect width="{PAR_W}" height="{PAR_H}" fill="{g}"/>')
    for x, y in scatter(rng, 160, (0, 0, PAR_W, PAR_H), lambda x, y: not pip(x, y, pts), mind=40):
        if all(math.hypot(x - a, y - b) > 30 for a, b in pins):
            svg.add(f'<path d="M{f(x - 10)},{f(y)} q5,-4 10,0 t10,0" fill="none" stroke="#e6eef0" stroke-width="1.4" opacity="0.5"/>')
    svg.add(f'<path d="{poly(pts)}" fill="#b3c6c3" stroke="#b3c6c3" stroke-width="22" stroke-linejoin="round" opacity="0.7"/>')
    svg.add(f'<path d="{poly(pts)}" fill="#cfc29a" stroke="{INK}" stroke-width="2.4" stroke-linejoin="round"/>')
    # terre dei Giganti fuori dalle Mura: foreste, colline, pianure
    outside = lambda x, y: pip(x, y, scale_pts(pts, 0.97)) and math.hypot(x - wx, y - wy) > rM + 18
    svg.add(wood(svg, scatter(rng, 260, (min(xs), 0, max(xs), PAR_H), both(outside, far_from(pins, 30)), mind=17), rng, r=9,
                 fill="#6f7d4e", dark="#3f4a2c", light="#8f9d66", stroke="#2a3020", sw=0.8))
    for x, y in scatter(rng, 20, (min(xs), 0, max(xs), PAR_H), both(outside, far_from(pins, 50)), mind=60):
        svg.add(f'<path d="M{f(x - 22)},{f(y)} L{f(x)},{f(y - 24)} L{f(x + 22)},{f(y)}" fill="#b3a27c" stroke="{INK}" stroke-width="1.2"/>')
    # le tre Mura
    svg.add(f'<circle cx="{f(wx)}" cy="{f(wy)}" r="{f(rM)}" fill="#c9bb88"/>')
    svg.add(f'<circle cx="{f(wx)}" cy="{f(wy)}" r="{f(rR)}" fill="#c4c08a"/>')
    svg.add(f'<circle cx="{f(wx)}" cy="{f(wy)}" r="{f(rS)}" fill="#cfc79a"/>')
    for r, lab in ((rM, "Wall Maria"), (rR, "Wall Rose"), (rS, "Wall Sina")):
        svg.add(f'<circle cx="{f(wx)}" cy="{f(wy)}" r="{f(r)}" fill="none" stroke="{STONE_D}" stroke-width="7"/>')
        svg.add(f'<circle cx="{f(wx)}" cy="{f(wy)}" r="{f(r)}" fill="none" stroke="{STONE}" stroke-width="3.5"/>')
        for k in range(4):
            a = math.pi / 2 * k
            rr = r * 0.05 + 6
            bx, by = wx + r * math.cos(a), wy + r * math.sin(a)
            svg.add(f'<path d="M{f(bx - rr * math.sin(a))},{f(by + rr * math.cos(a))} A{f(rr)},{f(rr)} 0 0,0 {f(bx + rr * math.sin(a))},{f(by - rr * math.cos(a))} Z" fill="#b89a74" stroke="{STONE_D}" stroke-width="2.4"/>')
        svg.add(curved_text(svg, f"wl{int(r)}", [(wx - r * 0.7, wy - r * 0.72), (wx, wy - r - 2), (wx + r * 0.7, wy - r * 0.72)],
                            lab.upper(), size=13, fill="#3a3024", halo="#e7dcbc", italic=False, spacing=4, weight="bold"))
    svg.add(f'<circle cx="{f(wx)}" cy="{f(wy)}" r="{f(rS * 0.28)}" fill="#b98a6a" stroke="{INK}" stroke-width="1.6"/>')
    # la «borderline»: rupe sulla costa occidentale dove Marley trasforma gli Eldiani in Giganti
    bx, by = P["loc-aot-borderline"]
    svg.add(f'<path d="M{f(bx - 30)},{f(by - 34)} q10,34 0,68 l12,4 q12,-38 0,-76 Z" fill="#8a7a5e" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(f'<path d="M{f(bx + 6)},{f(by - 26)} h34 v16 h-34 Z" fill="#6a6a62" stroke="{INK}" stroke-width="1.2"/>')
    # porto e ferrovia (costruiti dopo l'850 con l'aiuto di Hizuru)
    px, py = P["loc-aot-paradis-port"]
    for k in range(3):
        svg.add(f'<path d="M{f(px - 22)},{f(py - 10 + k * 12)} h-40" stroke="#6a5038" stroke-width="5"/>')
    svg.add(f'<path d="M{f(px)},{f(py)} C{f(px + 120)},{f(py - 40)} {f(wx - rM * 0.9)},{f(wy - rM * 0.6)} {f(wx - rM * 0.5)},{f(wy - rM * 0.75)}" fill="none" stroke="{INK}" stroke-width="5"/>')
    svg.add(f'<path d="M{f(px)},{f(py)} C{f(px + 120)},{f(py - 40)} {f(wx - rM * 0.9)},{f(wy - rM * 0.6)} {f(wx - rM * 0.5)},{f(wy - rM * 0.75)}" fill="none" stroke="#e6dcc4" stroke-width="2" stroke-dasharray="6 6"/>')
    svg.add(text(west - 120, wy - 40, "← verso Marley · to Marley", size=15, fill="#f2f0e8", italic=True, rot=-90))
    svg.add(compass(1530, 80, 36, INK, PAPER, "#9e2b25"))
    title(svg, 1360, 1030, "Isola di Paradis", "Paradis Island", jp="パラディ島", w=300)
    save(svg, "aot-paradis.svg", P)
    return P


# =============================================================================
# 3. DENTRO LE MURA — 1600 × 1240 (in scala: 1 km = 1.1667 px)
# =============================================================================
WL_W, WL_H = 1600, 1240
CX, CY = 800.0, 620.0
K = 560.0 / 480.0
RM, RR, RS = 480 * K, 380 * K, 250 * K


def polar(deg, r):
    """Gradi in senso orario dal NORD (0 = nord, 90 = est, 180 = sud, 270 = ovest)."""
    a = math.radians(deg - 90)
    return CX + r * math.cos(a), CY + r * math.sin(a)


def district(svg, rng, deg, r, size, name=None, roofs=("#9e5a3c", "#8a6a4a", "#a8743a", "#7a5a48")):
    """Distretto: borgo fortificato che sporge all'ESTERNO del muro, sul punto cardinale."""
    bx, by = polar(deg, r)
    a = math.radians(deg - 90)
    ox, oy = math.cos(a), math.sin(a)
    # semicerchio verso l'esterno
    pts = []
    for k in range(25):
        t = math.pi * k / 24
        lx, ly = math.cos(t - math.pi / 2), math.sin(t - math.pi / 2)  # da -90° a +90°
        px = bx + (ox * lx * size + (-oy) * ly * size)
        py = by + (oy * lx * size + ox * ly * size)
        pts.append((px, py))
    svg.add(f'<path d="{poly(pts)}" fill="#d8cfb4" stroke="{STONE_D}" stroke-width="6"/>')
    svg.add(f'<path d="{poly(pts)}" fill="none" stroke="{STONE}" stroke-width="2.5"/>')
    inside = lambda x, y: pip(x, y, scale_pts(pts, 0.86))
    out = ["<g>"]
    for x, y in sorted(scatter(rng, int(size * size / 90), (bx - size, by - size, bx + size, by + size), inside, mind=8), key=lambda p: p[1]):
        out.append(f'<rect x="{f(x - 3.5)}" y="{f(y - 2.5)}" width="7" height="5" fill="{rng.choice(roofs)}" stroke="{INK}" stroke-width="0.4"/>')
    out.append("</g>")
    svg.add(out)
    gx, gy = bx + ox * size, by + oy * size
    svg.add(f'<rect x="{f(gx - 5)}" y="{f(gy - 5)}" width="10" height="10" fill="#5a5048" stroke="{INK}" stroke-width="1" transform="rotate({deg} {f(gx)} {f(gy)})"/>')
    if name:
        # est/ovest: fuori dal muro (verso l'interno coprirebbe i pin di Wall Rose); nord/sud: verso l'interno
        tx, ty = (bx + ox * (size + 30), by + size * 0.9) if abs(ox) > 0.5 else (bx - ox * 40, by - oy * 40)
        svg.add(text(tx, ty + 4, name, size=11, fill="#4a3a2a", italic=True, halo="#e7dcbc", halo_w=3))
    return bx + ox * size * 0.45, by + oy * size * 0.45


def walls() -> dict:
    rng = random.Random(9103)
    svg = Svg(WL_W, WL_H, "Attack on Titan · Dentro le Mura / Within the Walls", CREDIT)
    P = {
        "loc-aot-walls-return": return_box(svg, 20, 1180, "↑ Paradis"),
        "loc-aot-wall-maria": polar(318, RM),
        "loc-aot-wall-rose": polar(322, RR),
        "loc-aot-wall-sina": polar(326, RS),
        "loc-aot-mitras": (CX, CY - 14),
        "loc-aot-underground-city": (CX + 34, CY + 30),
        "loc-aot-royal-palace": (CX - 30, CY - 46),
    }
    # suolo e campi: patchwork di coltivazioni negli anelli
    svg.add(f'<rect width="{WL_W}" height="{WL_H}" fill="#9c9a7a"/>')
    svg.add(dots(rng, (0, 0, WL_W, WL_H), 600, "#5a5a3a", (0.6, 1.6)))
    outside = lambda x, y: math.hypot(x - CX, y - CY) > RM + 70
    svg.add(wood(svg, scatter(rng, 380, (0, 0, WL_W, WL_H), outside, mind=19), rng, r=10, fill="#6f7d4e", dark="#3f4a2c",
                 light="#8f9d66", stroke="#2a3020", sw=0.8))
    svg.add(f'<circle cx="{CX}" cy="{CY}" r="{f(RM)}" fill="#b4ae7e"/>')
    for (r0, r1, cols, n) in ((RR, RM, ("#b9b07a", "#a9a46c", "#c2b98a", "#9c9a6a"), 330), (RS, RR, ("#c6bf86", "#b8b378", "#cfc694", "#aeb07a"), 300),
                              (0, RS, ("#cfc79a", "#c4bf8e", "#d6cfa6"), 150)):
        for x, y in scatter(rng, n, (CX - r1, CY - r1, CX + r1, CY + r1), lambda x, y: r0 + 8 < math.hypot(x - CX, y - CY) < r1 - 8, mind=16):
            w, h = rng.uniform(14, 30), rng.uniform(10, 22)
            svg.add(f'<rect x="{f(x - w / 2)}" y="{f(y - h / 2)}" width="{f(w)}" height="{f(h)}" fill="{rng.choice(cols)}" opacity="0.85" '
                    f'transform="rotate({rng.randint(-30, 30)} {f(x)} {f(y)})"/>')
    # Wall Maria perduta (845–850): velo grigio
    svg.add(f'<path d="M{f(CX - RM)},{f(CY)} a{f(RM)},{f(RM)} 0 1,0 {f(2 * RM)},0 a{f(RM)},{f(RM)} 0 1,0 {f(-2 * RM)},0 Z '
            f'M{f(CX - RR)},{f(CY)} a{f(RR)},{f(RR)} 0 1,0 {f(2 * RR)},0 a{f(RR)},{f(RR)} 0 1,0 {f(-2 * RR)},0 Z" fill="#6a665a" fill-rule="evenodd" opacity="0.18"/>')
    # fiumi e laghi interni
    svg.add(river([(CX - 70, CY - RM - 40), (CX - 120, CY - 360), (CX - 60, CY - 200), (CX - 20, CY - 40)], 7, "#86aebb", "#4f7f8c"))
    svg.add(river([(CX + 40, CY + 40), (CX + 160, CY + 220), (CX + 120, CY + 380), (CX + 230, CY + RM + 40)], 7, "#86aebb", "#4f7f8c"))
    for (deg, r, rx, ry) in ((250, 330, 34, 16), (120, 420, 26, 12), (20, 300, 22, 10)):
        x, y = polar(deg, r)
        svg.add(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{rx}" ry="{ry}" fill="#86aebb" stroke="#4f7f8c" stroke-width="1.6"/>')
    # Foresta degli Alberi Giganti (territorio di Wall Maria, fra Karanes e Shiganshina)
    fx, fy = polar(135, (RM + RR) / 2)
    fpoly = jagged(ellipse_pts(fx, fy, 44, 30, 12), rng, 0.1, 2)
    svg.add(patch(fpoly, "#4a5a34", stroke=INK, sw=1.2))
    svg.add(wood(svg, scatter(rng, 26, (fx - 44, fy - 30, fx + 44, fy + 30), lambda x, y: pip(x, y, fpoly), mind=11), rng, r=8,
                 fill="#3f5a30", dark="#24341a", light="#5f7a46", stroke="#1a2412", sw=0.8))
    P["loc-aot-forest-giant-trees"] = (fx, fy)
    # boschi e colline negli anelli
    for (deg, r, n) in ((200, RR + 50, 30), (280, RR + 40, 30), (60, RR + 50, 26), (160, (RS + RR) / 2 + 10, 22), (230, (RS + RR) / 2, 18), (40, (RS + RR) / 2, 18)):
        x, y = polar(deg, r)
        svg.add(wood(svg, scatter(rng, n, (x - 50, y - 40, x + 50, y + 40), lambda a, b: math.hypot(a - x, b - y) < 46, mind=12), rng, r=8,
                     fill="#6f7d4e", dark="#3f4a2c", light="#8f9d66", stroke="#2a3020", sw=0.8))
    # villaggi, castelli, basi (pin) — posizioni dalla serie: Ragako, Dauper e Utgard nel sud di Rose,
    # la cappella dei Reiss a est di Orvud, la Foresta in Wall Maria.
    places = {
        "loc-aot-ragako": polar(196, (RS + RR) / 2 + 6),
        "loc-aot-dauper": polar(226, (RS + RR) / 2 + 20),
        "loc-aot-utgard": polar(160, RR - 26),
        "loc-aot-reiss-chapel": polar(22, (RS + RR) / 2 - 6),
        "loc-aot-training-camp": polar(174, RR - 42),
        "loc-aot-survey-hq": polar(110, (RS + RR) / 2 + 10),
        "loc-aot-levi-hideout": polar(256, RR - 40),
        "loc-aot-historia-farm": polar(316, (RS + RR) / 2),
    }
    P.update(places)
    for lid, (x, y) in places.items():
        if lid in ("loc-aot-utgard", "loc-aot-survey-hq"):
            svg.add(tower(x - 8, y + 8, 10, 22, "#c9bfa8", "#5a5048"))
            svg.add(tower(x + 8, y + 8, 10, 18, "#c9bfa8", "#5a5048"))
        elif lid == "loc-aot-reiss-chapel":
            svg.add(house(x, y + 8, 18, "#e6dcc4", "#5a4a6a"))
            svg.add(f'<path d="M{f(x)},{f(y - 12)} v-10 M{f(x - 4)},{f(y - 18)} h8" stroke="{INK}" stroke-width="1.6"/>')
        elif lid == "loc-aot-training-camp":
            for k in range(3):
                svg.add(f'<rect x="{f(x - 14 + k * 10)}" y="{f(y - 4)}" width="8" height="12" fill="#a8946a" stroke="{INK}" stroke-width="0.8"/>')
        else:
            for k in range(4):
                svg.add(house(x - 12 + (k % 2) * 16, y + 6 + (k // 2) * 8, 10, "#e6dcc4", "#8a5a3a"))
    # i tre muri
    for r in (RM, RR, RS):
        svg.add(f'<circle cx="{CX}" cy="{CY}" r="{f(r)}" fill="none" stroke="#4f4a40" stroke-width="12"/>')
        svg.add(f'<circle cx="{CX}" cy="{CY}" r="{f(r)}" fill="none" stroke="{STONE}" stroke-width="7"/>')
        svg.add(f'<circle cx="{CX}" cy="{CY}" r="{f(r)}" fill="none" stroke="#c9c2b2" stroke-width="1.4" stroke-dasharray="3 6"/>')
    # distretti
    ds = [
        ("loc-aot-shiganshina", 180, RM, 52), ("loc-aot-quinta", 270, RM, 44), (None, 90, RM, 44), (None, 0, RM, 44),
        ("loc-aot-trost", 180, RR, 46), ("loc-aot-karanes", 90, RR, 46), ("loc-aot-krolva", 270, RR, 46), ("loc-aot-utopia", 0, RR, 46),
        ("loc-aot-ehrmich", 180, RS, 40), ("loc-aot-stohess", 90, RS, 42), ("loc-aot-yarckel", 270, RS, 40), ("loc-aot-orvud", 0, RS, 40),
    ]
    for lid, deg, r, size in ds:
        p = district(svg, rng, deg, r, size, None if lid else "distretto senza nome")
        if lid:
            P[lid] = p
    # Mitras, la capitale, e la Città Sotterranea sotto di essa
    mit = jagged(ellipse_pts(CX, CY, 58, 50, 18), rng, 0.05, 2)
    svg.add(f'<path d="{smooth(mit)}" fill="#ddd2b6" stroke="{STONE_D}" stroke-width="4"/>')
    out = ["<g>"]
    for x, y in sorted(scatter(rng, 90, (CX - 58, CY - 50, CX + 58, CY + 50), lambda x, y: pip(x, y, scale_pts(mit, 0.9)), mind=8), key=lambda p: p[1]):
        out.append(f'<rect x="{f(x - 3.5)}" y="{f(y - 2.5)}" width="7" height="5" fill="{rng.choice(["#7a4a5a", "#8a6a4a", "#5a4a6a"])}" stroke="{INK}" stroke-width="0.4"/>')
    out.append("</g>")
    svg.add(out)
    svg.add(tower(CX - 38, CY - 30, 12, 26, "#efe6d0", "#5a3a6a"))
    svg.add(tower(CX - 22, CY - 34, 14, 32, "#efe6d0", "#5a3a6a"))
    svg.add(f'<ellipse cx="{CX + 34}" cy="{CY + 34}" rx="26" ry="10" fill="#3a3430" opacity="0.55" stroke="#c9c2b2" stroke-width="1.2" stroke-dasharray="4 3"/>')
    # etichette dei muri
    for r, lab in ((RM, "WALL MARIA"), (RR, "WALL ROSE"), (RS, "WALL SINA")):
        svg.add(curved_text(svg, "c" + lab[5:], [polar(326, r + 17), polar(340, r + 18), polar(354, r + 17)], lab, size=15,
                            fill="#f2ead2", halo="#3a3024", italic=False, spacing=5, weight="bold"))
    svg.add(curved_text(svg, "lost", [polar(220, RM - 30), polar(240, RM - 34), polar(262, RM - 30)],
                        "territorio perduto 845–850 · lost territory", size=12, fill="#2a2620", halo="#d6d0b4", spacing=2))
    seg = 50 * K
    for k in range(4):
        svg.add(f'<rect x="{f(1260 + k * seg)}" y="1180" width="{f(seg)}" height="7" fill="{INK if k % 2 == 0 else PAPER}" stroke="{INK}" stroke-width="1"/>')
    svg.add(text(1260 + 2 * seg, 1205, "200 km · Sina 250 · Rose 380 · Maria 480 km dal centro", size=12, fill=INK, italic=True, halo=PAPER, halo_w=3))
    svg.add(compass(1530, 80, 36, INK, PAPER, "#9e2b25"))
    title(svg, 200, 76, "Dentro le Mura", "Within the Walls · Maria, Rose, Sina", jp="壁の内側", w=330)
    svg.add(wings(1540, 1110, 1.2))
    save(svg, "aot-walls.svg", P)
    return P


# =============================================================================
# Mattoni per le piante dei distretti
# =============================================================================
def town_blocks(svg, rng, area_ok, box, n, roofs, mind=13, size=(9, 15)):
    out = ["<g>"]
    for x, y in sorted(scatter(rng, n, box, area_ok, mind=mind), key=lambda p: p[1]):
        w = rng.uniform(*size)
        h = w * rng.uniform(0.6, 0.9)
        c = rng.choice(roofs)
        out.append(f'<rect x="{f(x - w / 2)}" y="{f(y - h / 2)}" width="{f(w)}" height="{f(h + h * 0.4)}" fill="{shade(c, -0.35)}" stroke="{INK}" stroke-width="0.6"/>')
        out.append(f'<rect x="{f(x - w / 2)}" y="{f(y - h / 2)}" width="{f(w)}" height="{f(h)}" fill="{c}" stroke="{INK}" stroke-width="0.6"/>')
    out.append("</g>")
    svg.add(out)


def big_wall(svg, d, width=26):
    svg.add(f'<path d="{d}" fill="none" stroke="#4f4a40" stroke-width="{width + 6}" stroke-linejoin="round"/>')
    svg.add(f'<path d="{d}" fill="none" stroke="{STONE}" stroke-width="{width}" stroke-linejoin="round"/>')
    svg.add(f'<path d="{d}" fill="none" stroke="#c9c2b2" stroke-width="2" stroke-dasharray="5 9"/>')


def gate(svg, x, y, horizontal=True, broken=False, label=None):
    w, h = (60, 34) if horizontal else (34, 60)
    svg.add(f'<rect x="{f(x - w / 2)}" y="{f(y - h / 2)}" width="{w}" height="{h}" fill="#5a5048" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M{f(x - 16)},{f(y + h / 2)} v-16 a16,14 0 0,1 32,0 v16 Z" fill="#1d1a16"/>')
    if broken:
        svg.add(f'<path d="M{f(x - 30)},{f(y - 20)} l14,10 l-6,10 l16,6 l-4,14 l20,-8" fill="none" stroke="#e8642a" stroke-width="3"/>')
    if label:
        svg.add(text(x, y - h / 2 - 8, label, size=13, fill="#2a2620", italic=True, halo=PAPER, halo_w=3))


def district_plan(svg, rng, name_wall, roofs, inner_y=190, bulge_r=620, cx=700):
    """Pianta di un distretto: muro principale in alto (verso l'interno) e semicerchio verso sud."""
    W, H = svg.w, svg.h
    # terreno esterno (fuori dal distretto) e interno (oltre il muro principale)
    svg.add(f'<rect width="{W}" height="{H}" fill="#a39f7c"/>')
    svg.add(f'<rect width="{W}" height="{inner_y}" fill="#b9b382"/>')
    for x, y in scatter(rng, 50, (0, 0, W, inner_y - 20), None, mind=26):
        svg.add(f'<rect x="{f(x - 14)}" y="{f(y - 8)}" width="28" height="16" fill="{rng.choice(["#c6bf86", "#b0aa72", "#cfc694"])}" opacity="0.8"/>')
    ry = svg.h - 100 - inner_y
    arc = [(cx + bulge_r * math.cos(t), inner_y + ry * math.sin(t)) for t in [math.pi * k / 40 for k in range(41)]]
    arc = [(x, max(inner_y, y)) for x, y in arc]
    area = [(cx - bulge_r, inner_y)] + arc[::-1] + [(cx + bulge_r, inner_y)]
    area = sorted(arc, key=lambda p: -p[0])
    region = [(cx + bulge_r, inner_y)] + area + [(cx - bulge_r, inner_y)]
    svg.add(f'<path d="{poly(region)}" fill="#d8cfb4"/>')
    return region


# =============================================================================
# 4. SHIGANSHINA — 1400 × 1000
# =============================================================================
def shiganshina() -> dict:
    W, H = 1400, 1000
    rng = random.Random(9104)
    svg = Svg(W, H, "Shiganshina District · シガンシナ区", CREDIT)
    iy = 210
    P = {
        "loc-aot-shig-return": return_box(svg, 20, 950, "↑ Le Mura"),
        "loc-aot-shig-inner-gate": (700, iy),
        "loc-aot-shig-outer-gate": (700, 900),
        "loc-aot-yeager-house": (470, 520),
        "loc-aot-grisha-basement": (430, 560),
        "loc-aot-shig-wall-top": (980, round(210 + 690 * math.sqrt(1 - (280 / 620) ** 2))),
        "loc-aot-shig-rooftops": (760, 470),
        "loc-aot-shig-boats": (560, 300),
        "loc-aot-erwin-charge": (470, 100),
        "loc-aot-beast-position": (980, 70),
    }
    pins = list(P.values())
    region = district_plan(svg, rng, "Maria", (), iy, 620)
    inside = lambda x, y: pip(x, y, scale_pts(region, 0.96, (700, iy + 300))) and y > iy + 24
    # canale che porta alle barche (verso il cancello interno)
    svg.add(river([(330, 760), (420, 600), (520, 420), (560, 300), (590, iy + 10)], 14, "#86aebb", "#4f7f8c"))
    town_blocks(svg, rng, both(inside, far_from(pins, 26)), (80, iy, 1320, 920), 900,
                ["#9e5a3c", "#8a6a4a", "#a8743a", "#7a5a48", "#b07a50"], mind=15)
    for s in ([(700, iy + 30), (700, 870)], [(150, 420), (700, 470), (1250, 420)], [(330, 720), (700, 740), (1070, 720)]):
        svg.add(road(s, 12, "#e6dcc4", "#8a7a5a"))
    big_wall(svg, f"M0,{iy} H{W}")
    big_wall(svg, smooth(region[1:-1], closed=False))
    gate(svg, 700, iy, label="cancello interno · inner gate")
    gate(svg, 700, 900, broken=True, label="cancello esterno · outer gate")
    # casa Yeager e la cantina
    svg.add(house(470, 532, 30, "#efe6d0", "#9e2b25"))
    svg.add(f'<rect x="414" y="548" width="32" height="18" fill="#3a3024" stroke="#e6dcc4" stroke-width="1.4" stroke-dasharray="3 2"/>')
    # barche dei profughi
    for k in range(3):
        svg.add(f'<path d="M{535 + k * 18},{290 - k * 18} l20,0 l-4,6 h-12 Z" fill="#8a5a2a" stroke="{INK}" stroke-width="0.8"/>')
    # campo a nord: carica di Erwin, posizione del Gigante Bestia
    svg.add(f'<path d="M260,140 C380,110 560,110 660,140" fill="none" stroke="#9e2b25" stroke-width="3" stroke-dasharray="8 6"/>')
    svg.add(f'<path d="M660,140 l-14,-10 l2,16 Z" fill="#9e2b25"/>')
    for (x, y) in scatter(rng, 28, (720, 20, 1300, 180), None, mind=26):
        svg.add(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="7" ry="9" fill="#c9a88a" stroke="{INK}" stroke-width="0.8"/>')
    svg.add(f'<ellipse cx="980" cy="58" rx="16" ry="22" fill="#8a6a4a" stroke="{INK}" stroke-width="1.4"/>')
    svg.add(text(1200, 150, "territorio di Wall Maria", size=14, fill="#2a2620", italic=True, halo=PAPER, halo_w=3))
    # esterno del distretto: verso sud, le terre dei Giganti
    svg.add(text(330, 960, "fuori dalle Mura · beyond the Walls", size=14, fill="#2a2620", italic=True, halo=PAPER, halo_w=3))
    svg.add(compass(1340, 90, 32, INK, PAPER, "#9e2b25"))
    title(svg, 1210, 890, "Shiganshina", "Distretto di Wall Maria · sud", jp="シガンシナ区", w=290)
    save(svg, "aot-shiganshina.svg", P)
    return P


# =============================================================================
# 5. TROST — 1400 × 1000
# =============================================================================
def trost() -> dict:
    W, H = 1400, 1000
    rng = random.Random(9105)
    svg = Svg(W, H, "Trost District · トロスト区", CREDIT)
    iy = 210
    P = {
        "loc-aot-trost-return": return_box(svg, 20, 950, "↑ Le Mura"),
        "loc-aot-trost-inner-gate": (700, iy),
        "loc-aot-trost-outer-gate": (700, 900),
        "loc-aot-trost-boulder": (620, 830),
        "loc-aot-trost-hq": (470, 470),
        "loc-aot-trost-vanguard": (880, 700),
        "loc-aot-trost-wall-top": (980, iy),
        "loc-aot-trost-marco": (360, 640),
        "loc-aot-trost-church": (980, 420),
    }
    pins = list(P.values())
    region = district_plan(svg, rng, "Rose", (), iy, 620)
    inside = lambda x, y: pip(x, y, scale_pts(region, 0.96, (700, iy + 300))) and y > iy + 24
    town_blocks(svg, rng, both(inside, far_from(pins, 26)), (80, iy, 1320, 920), 950,
                ["#9e5a3c", "#a8743a", "#8a6a4a", "#7a5a48", "#b07a50", "#6a5a4a"], mind=15)
    for s in ([(700, iy + 30), (700, 870)], [(150, 420), (700, 460), (1250, 420)], [(330, 720), (700, 730), (1070, 720)]):
        svg.add(road(s, 12, "#e6dcc4", "#8a7a5a"))
    big_wall(svg, f"M0,{iy} H{W}")
    big_wall(svg, smooth(region[1:-1], closed=False))
    gate(svg, 700, iy, label="cancello interno · inner gate")
    gate(svg, 700, 900, broken=True, label="cancello esterno · outer gate")
    # il macigno con cui il Gigante d'Attacco sigilla la breccia
    svg.add(f'<ellipse cx="642" cy="858" rx="40" ry="26" fill="#9a8f80" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M622,846 q20,-10 40,6" fill="none" stroke="#6f685c" stroke-width="2"/>')
    # quartier generale dei rifornimenti (torre), chiesa
    svg.add(tower(470, 500, 40, 60, "#d8cfb4", "#5a5048", cone=False))
    svg.add(house(980, 438, 34, "#efe6d0", "#5a4a6a"))
    svg.add(f'<path d="M980,402 v-14 M974,394 h12" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<rect x="960" y="{iy - 14}" width="40" height="10" fill="#9e2b25"/>')
    svg.add(text(330, 960, "fuori dalle Mura · beyond the Walls", size=14, fill="#2a2620", italic=True, halo=PAPER, halo_w=3))
    svg.add(text(1180, 120, "territorio di Wall Rose", size=14, fill="#2a2620", italic=True, halo=PAPER, halo_w=3))
    svg.add(compass(1340, 90, 32, INK, PAPER, "#9e2b25"))
    title(svg, 1210, 890, "Trost", "Distretto di Wall Rose · sud", jp="トロスト区", w=290)
    save(svg, "aot-trost.svg", P)
    return P


# =============================================================================
# 6. LIBERIO — 1400 × 1000
# =============================================================================
def liberio() -> dict:
    W, H = 1400, 1000
    rng = random.Random(9106)
    svg = Svg(W, H, "Liberio · レベリオ", CREDIT)
    P = {
        "loc-aot-liberio-return": return_box(svg, 20, 950, "↑ Il Mondo"),
        "loc-aot-internment-gate": (560, 300),
        "loc-aot-tybur-stage": (640, 560),
        "loc-aot-liberio-basement": (700, 610),
        "loc-aot-liberio-hospital": (380, 470),
        "loc-aot-braun-house": (450, 660),
        "loc-aot-warrior-hq": (1000, 300),
        "loc-aot-liberio-harbor": (1090, 820),
        "loc-aot-liberio-station": (240, 170),
    }
    pins = list(P.values())
    svg.add(f'<rect width="{W}" height="{H}" fill="#b8b3a0"/>')
    # mare a sud-est e porto militare
    sea_poly = [(800, 1000), (900, 760), (1100, 690), (1400, 640), (1400, 1000)]
    svg.add(f'<path d="{smooth(sea_poly)}" fill="#6b8790" stroke="{INK}" stroke-width="2"/>')
    for x, y in scatter(rng, 30, (850, 700, 1400, 1000), lambda x, y: pip(x, y, sea_poly), mind=30):
        svg.add(f'<path d="M{f(x - 10)},{f(y)} q5,-4 10,0 t10,0" fill="none" stroke="#e6eef0" stroke-width="1.4" opacity="0.6"/>')
    for k in range(4):
        svg.add(f'<rect x="{1000 + k * 60}" y="{730 - k * 10}" width="14" height="90" fill="#6a5a4a" stroke="{INK}" stroke-width="1"/>')
    for (x, y) in ((1100, 900), (1240, 860), (1330, 790)):
        svg.add(f'<path d="M{x - 50},{y} h100 l-14,16 h-72 Z" fill="#5a5a62" stroke="{INK}" stroke-width="1.4"/>')
        svg.add(f'<rect x="{x - 14}" y="{y - 22}" width="28" height="22" fill="#6a6a72" stroke="{INK}" stroke-width="1.2"/>')
    # la città marleyana (fuori dalla zona di internamento)
    zone = [(330, 300), (790, 300), (820, 760), (300, 780)]
    town_blocks(svg, rng, both(lambda x, y: not pip(x, y, zone) and not pip(x, y, sea_poly), far_from(pins, 26)), (0, 0, W, H), 600,
                ["#8a8a92", "#9a8a7a", "#7a7068", "#a89a88"], mind=17, size=(11, 18))
    # zona d'internamento: muro e reticolato, case fitte
    svg.add(f'<path d="{poly(zone)}" fill="#cfc4a6" stroke="#4f4a40" stroke-width="8"/>')
    svg.add(f'<path d="{poly(zone)}" fill="none" stroke="#c9c2b2" stroke-width="2" stroke-dasharray="4 6"/>')
    town_blocks(svg, rng, both(lambda x, y: pip(x, y, scale_pts(zone, 0.93)), far_from(pins, 24)), (300, 300, 820, 780), 480,
                ["#9e5a3c", "#8a6a4a", "#a8743a", "#7a5a48"], mind=13)
    gate(svg, 560, 300, label="ingresso della zona d'internamento · internment zone gate")
    # palco della dichiarazione di Willy Tybur, e la cantina sotto l'edificio accanto
    svg.add(f'<rect x="590" y="530" width="100" height="40" fill="#7a2a24" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M580,530 h120 l-10,-20 h-100 Z" fill="#b0823f" stroke="{INK}" stroke-width="1.6"/>')
    for k in range(18):
        svg.add(f'<circle cx="{560 + (k % 9) * 20}" cy="{600 + (k // 9) * 10}" r="3" fill="#3a3024"/>')
    svg.add(f'<rect x="684" y="596" width="34" height="22" fill="#3a3024" stroke="#e6dcc4" stroke-width="1.4" stroke-dasharray="3 2"/>')
    # ospedale, casa Braun
    svg.add(f'<rect x="350" y="450" width="60" height="34" fill="#efe6d0" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<path d="M374,467 h12 M380,461 v12" stroke="#9e2b25" stroke-width="3"/>')
    svg.add(house(450, 672, 22, "#e6dcc4", "#7a5a48"))
    # quartier generale dei Guerrieri e stazione
    svg.add(f'<rect x="950" y="270" width="100" height="56" fill="#d8d2c6" stroke="{INK}" stroke-width="2"/>')
    svg.add(f'<path d="M940,270 h120 l-10,-18 h-100 Z" fill="#5a5a62" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(f'<path d="M0,160 H520" stroke="{INK}" stroke-width="5"/><path d="M0,160 H520" stroke="#e6dcc4" stroke-width="2" stroke-dasharray="8 6"/>')
    svg.add(f'<rect x="210" y="144" width="60" height="30" fill="#d8d2c6" stroke="{INK}" stroke-width="1.6"/>')
    svg.add(text(560, 820, "zona d'internamento eldiana · Eldian internment zone", size=14, fill="#2a2620", italic=True, halo=PAPER, halo_w=3))
    svg.add(text(1100, 230, "quartiere marleyano · Marleyan quarter", size=14, fill="#2a2620", italic=True, halo=PAPER, halo_w=3))
    svg.add(compass(1340, 80, 32, INK, PAPER, "#9e2b25"))
    title(svg, 1150, 470, "Liberio", "Marley · città e zona d'internamento", jp="レベリオ", w=300)
    save(svg, "aot-liberio.svg", P)
    return P


# =============================================================================
# 7. I SENTIERI — 1400 × 1000
# =============================================================================
def paths() -> dict:
    W, H = 1400, 1000
    rng = random.Random(9107)
    svg = Svg(W, H, "The Paths · 道", CREDIT)
    P = {
        "loc-aot-paths-return": return_box(svg, 20, 950, "↑ Il Mondo"),
        "loc-aot-paths-tree": (700, 420),
        "loc-aot-coordinate": (700, 640),
        "loc-aot-ymir-sand": (420, 720),
        "loc-aot-zeke-paths": (1000, 700),
    }
    g = svg.gradient("night", [(0, "#05060f"), (0.7, "#141a33"), (1, "#2a2a3a")])
    svg.add(f'<rect width="{W}" height="{H}" fill="{g}"/>')
    svg.add(dots(rng, (0, 0, W, 620), 700, "#ffffff", (0.4, 1.6), None, (0.2, 0.95)))
    # il deserto di sabbia
    svg.add(f'<path d="M0,620 C300,600 500,640 700,630 C900,620 1100,600 1400,630 V1000 H0 Z" fill="#b8a888"/>')
    for k in range(10):
        y = 650 + k * 34
        svg.add(f'<path d="M-20,{y} C300,{y - 14} 900,{y + 16} 1420,{y - 6}" fill="none" stroke="#9a8a6a" stroke-width="1.4" opacity="0.5"/>')
    # l'albero di luce: la «fonte di tutta la materia organica», con i rami che diventano i Sentieri
    svg.add(f'<path d="M690,640 C680,560 700,520 690,440 L710,440 C700,520 720,560 710,640 Z" fill="#dff1ff" opacity="0.9"/>')
    for k in range(26):
        a = math.radians(-170 + k * 160 / 25)
        L = rng.uniform(240, 420)
        x2, y2 = 700 + L * math.cos(a), 420 + L * 0.8 * math.sin(a)
        svg.add(f'<path d="M700,440 Q{f(700 + L * 0.4 * math.cos(a))},{f(420 + L * 0.25 * math.sin(a) - 20)} {f(x2)},{f(y2)}" fill="none" stroke="#cfe8ff" stroke-width="{f(rng.uniform(0.8, 2.6))}" opacity="0.75"/>')
    svg.add(f'<circle cx="700" cy="420" r="60" fill="#cfe8ff" opacity="0.15"/>')
    # il punto delle Coordinate, dove Eren incontra Ymir
    svg.add(f'<circle cx="700" cy="640" r="18" fill="#fff6c8" opacity="0.9"/>')
    svg.add(f'<circle cx="700" cy="640" r="40" fill="none" stroke="#fff6c8" stroke-width="1.4" opacity="0.6"/>')
    # Ymir che plasma i corpi dei Giganti nella sabbia
    for k in range(6):
        x = 360 + k * 26
        svg.add(f'<path d="M{x},732 q6,-26 12,0" fill="#a8987a" stroke="#6a5a3a" stroke-width="1"/>')
    svg.add(f'<circle cx="420" cy="696" r="6" fill="#e6d8b8"/>')
    svg.add(text(700, 960, "La dimensione che connette ogni Eldiano · the dimension connecting every Eldian", size=15, fill="#f2ead2", italic=True, halo="#2a2a3a", halo_w=3))
    title(svg, 200, 70, "I Sentieri", "The Paths · le Coordinate", jp="道", w=300)
    save(svg, "aot-paths.svg", P)
    return P


ALL = [world, paradis, walls, shiganshina, trost, liberio, paths]

if __name__ == "__main__":
    pins: dict = {}
    only = sys.argv[1:]
    for fn in ALL:
        if not only or fn.__name__ in only:
            pins.update(fn())
    if os.environ.get("AOT_APPLY_PINS", "1") == "1" and os.path.isdir(os.path.join(HERE, "..", "..", "src", "data", "attackontitan")):
        apply_pins("attackontitan", pins)
    if os.environ.get("AOT_DUMP_PINS"):
        json.dump({k: [round(v[0]), round(v[1])] for k, v in pins.items()}, open(os.environ["AOT_DUMP_PINS"], "w"), indent=1)
