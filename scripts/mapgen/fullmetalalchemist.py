#!/usr/bin/env python3
"""Mappa SCHEMATICA ORIGINALE del mondo di Fullmetal Alchemist.

Ricostruzione AniMapVerse (nessun artwork ufficiale, nessuna mappa dell'opera o dei fan ricalcata).
Disegna SOLO ciò che le fonti sostengono:
  * Amestris: paese senza sbocco sul mare, diviso in cinque aree amministrative: Centrale al centro
    (capitale Central City) e Nord, Est, Sud, Ovest nelle rispettive direzioni.
  * Vicini: Drachma a NORD (più grande di Amestris, la catena dei Monti Briggs fa da barriera sul confine),
    Creta a OVEST, Aerugo a SUD, Xing a EST oltre un grande deserto. I vicini sono mostrati solo in parte,
    sfumati ai bordi della mappa.
Il profilo del confine di Amestris NON è documentato: è un contorno organico astratto, non vincolante.
Nessuna città, nessuna ferrovia: solo 4 pin (`PINS`, applicati con `apply_pins`) per i luoghi la cui area è documentata
(Central City, Fort Briggs, Ishval, Table City).

I poligoni delle cinque aree vivono come DATI NOMINATI (`AMESTRIS_AREAS`, piano 1500 × 1000, vertici condivisi
senza buchi): il batch dei confini li emette come `MapBoundary` senza ridisegnarli.

    python3 scripts/mapgen/fullmetalalchemist.py  → public/assets/worlds/fullmetalalchemist/maps/*.svg + pin
"""
from __future__ import annotations

import math
import random
import sys

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from kit import (ROOT, SERIF, Svg, apply_pins, compass, curved_text, dots, f, mountain, out_path, plaque, poly,
                 preview, region_label, text)

W, H = 1500, 1000
WORLD_DIR = "fullmetalalchemist"
CREDIT = "Ricostruzione originale AniMapVerse · CC0 · schema indicativo, non è materiale ufficiale di Fullmetal Alchemist"

INK = "#0c0d11"
LIGHT = "#f2ead6"
GOLD = "#d4af37"
BASE = "#1a1d27"

Pt = tuple[float, float]


# =============================================================================
# GEOMETRIA (dati nominati, deterministici)
# =============================================================================
def wobble(pts: list[Pt], seed: int, amp=0.07, levels=3) -> list[Pt]:
    """Spostamento del punto medio su una polilinea APERTA: gli estremi restano fermi (vertici condivisi)."""
    rng = random.Random(seed)
    out = list(pts)
    a = amp
    for _ in range(levels):
        nxt: list[Pt] = []
        for i in range(len(out) - 1):
            p, q = out[i], out[i + 1]
            nxt.append(p)
            dx, dy = q[0] - p[0], q[1] - p[1]
            ln = math.hypot(dx, dy) or 1
            d = rng.gauss(0, a) * ln
            nxt.append(((p[0] + q[0]) / 2 - dy / ln * d, (p[1] + q[1]) / 2 + dx / ln * d))
        nxt.append(out[-1])
        out = nxt
        a *= 0.55
    return [(round(x, 1), round(y, 1)) for x, y in out]


# Vertici d'angolo del profilo di Amestris (astratto, non documentato) e punti d'incontro dei confini interni.
A, B, C, D = (390, 300), (1130, 330), (1110, 740), (390, 720)
# profilo esterno, in senso orario, diviso nei quattro lati (Nord, Est, Sud, Ovest)
_OUT_N = [A, (520, 250), (640, 220), (780, 252), (910, 232), (1040, 262), B]
_OUT_E = [B, (1160, 430), (1146, 548), (1172, 640), C]
_OUT_S = [C, (990, 800), (860, 832), (730, 808), (580, 862), (470, 800), D]
_OUT_W = [D, (328, 604), (380, 520), (338, 410), A]
# confini interni: dal profilo (A..D) al poligono centrale (a..d), con una piega ciascuno
_DIV = {
    "A": [A, (470, 352), (562, 402)],
    "B": [B, (1046, 372), (950, 410)],
    "C": [C, (1012, 700), (930, 640)],
    "D": [D, (490, 668), (580, 632)],
}
# arco del poligono centrale: tra due divisori
_CEN = {
    "N": [(562, 402), (752, 384), (950, 410)],
    "E": [(950, 410), (978, 524), (930, 640)],
    "S": [(930, 640), (760, 658), (580, 632)],
    "W": [(580, 632), (546, 520), (562, 402)],
}

OUT_N = wobble(_OUT_N, 11, 0.06)
OUT_E = wobble(_OUT_E, 12, 0.06)
OUT_S = wobble(_OUT_S, 13, 0.06)
OUT_W = wobble(_OUT_W, 14, 0.06)
DIV = {k: wobble(v, 20 + i, 0.05, 2) for i, (k, v) in enumerate(_DIV.items())}
CEN = {k: wobble(v, 30 + i, 0.04, 2) for i, (k, v) in enumerate(_CEN.items())}


def _rev(p: list[Pt]) -> list[Pt]:
    return list(reversed(p))


def _area_polys() -> dict[str, list[Pt]]:
    """Poligoni delle cinque aree: ogni lato condiviso è lo STESSO elenco di punti (nessun buco o sovrapposizione)."""
    return {
        "north": OUT_N + DIV["B"][1:] + _rev(CEN["N"])[1:] + _rev(DIV["A"])[1:-1],
        "east": OUT_E + DIV["C"][1:] + _rev(CEN["E"])[1:] + _rev(DIV["B"])[1:-1],
        "south": OUT_S + DIV["D"][1:] + _rev(CEN["S"])[1:] + _rev(DIV["C"])[1:-1],
        "west": OUT_W[:-1] + DIV["A"] + _rev(CEN["W"])[1:] + _rev(DIV["D"])[1:-1],
        "central": CEN["N"][:-1] + CEN["E"][:-1] + CEN["S"][:-1] + CEN["W"][:-1],
    }


# Aree amministrative di Amestris (piano 1500 × 1000 = viewBox del livello `fma-map-world`).
AMESTRIS_AREAS: dict[str, list[Pt]] = _area_polys()
# Punto d'ancoraggio dell'etichetta di ciascuna area (per `MapBoundary.labelPosition`).
AREA_LABELS: dict[str, Pt] = {
    "central": (752, 520),
    "north": (770, 322),
    "east": (1066, 520),
    "south": (762, 742),
    "west": (452, 520),
}
# Profilo esterno completo di Amestris (senza sbocchi sul mare).
AMESTRIS_OUTLINE: list[Pt] = OUT_N + OUT_E[1:] + OUT_S[1:] + OUT_W[1:-1]

# Vicini (parziali, tagliati dal bordo della mappa). Il lato verso Amestris riusa il profilo condiviso.
_J1, _J2 = (1300, 282), (1335, 775)
_XING_W = wobble([_J1, (1362, 400), (1352, 560), _J2], 41, 0.04, 3)
_DRA_E = wobble([(1500, 205), _J1, B], 42, 0.04, 2)
_DRA_W = wobble([A, (180, 285), (0, 268)], 43, 0.04, 2)
_CRE_S = wobble([D, (200, 742), (0, 772)], 44, 0.04, 2)
_AER_E = wobble([C, _J2, (1500, 802)], 45, 0.04, 2)

_I1 = _DRA_E.index(_J1)
_I2 = _AER_E.index(_J2)
NEIGHBOURS: dict[str, list[Pt]] = {
    "drachma": [(0, 0), (1500, 0)] + _DRA_E + _rev(OUT_N)[1:-1] + _DRA_W,
    "creta": _rev(_DRA_W) + _rev(OUT_W)[1:-1] + _CRE_S,
    "aerugo": _rev(_CRE_S) + _rev(OUT_S)[1:-1] + _AER_E + [(1500, 1000), (0, 1000)],
    "xing": [(1500, 205), _J1] + _XING_W[1:] + [(1500, 802)],
    # grande deserto tra il confine est di Amestris e Xing
    "desert": _rev(_DRA_E[_I1:]) + _XING_W[1:] + _rev(_AER_E[:_I2 + 1])[1:] + _rev(OUT_E)[1:-1],
}



def _pip(x: float, y: float, pts: list[Pt]) -> bool:
    inside = False
    j = len(pts) - 1
    for i in range(len(pts)):
        xi, yi = pts[i]
        xj, yj = pts[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            inside = not inside
        j = i
    return inside


# =============================================================================
# PIN (batch 4: solo i luoghi con un'area documentata), derivati dalla geometria
# =============================================================================
def _seg_dist(p: Pt, a: Pt, b: Pt) -> float:
    dx, dy = b[0] - a[0], b[1] - a[1]
    t = 0.0 if dx == dy == 0 else max(0.0, min(1.0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)))
    return math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy))


def _edge_margin(p: Pt, poly_pts: list[Pt]) -> float:
    return min(_seg_dist(p, poly_pts[i], poly_pts[(i + 1) % len(poly_pts)]) for i in range(len(poly_pts)))


def _pin(area: str, p: Pt, min_margin: float) -> Pt:
    """Arrotonda il pin (come fa `apply_pins`) e verifica che stia DENTRO l'area, a distanza minima dai bordi."""
    q = (float(round(p[0])), float(round(p[1])))
    pts = AMESTRIS_AREAS[area]
    if not _pip(q[0], q[1], pts):
        raise SystemExit(f"pin fuori dall'area {area}: {q}")
    if _edge_margin(q, pts) < min_margin:
        raise SystemExit(f"pin troppo vicino al bordo dell'area {area}: {q} ({_edge_margin(q, pts):.1f} < {min_margin})")
    return q


# Fort Briggs: il punto più a nord dell'Area Nord (confine con Drachma, sotto i Monti Briggs), spostato verso l'interno.
_BRIGGS_TOP = min(OUT_N, key=lambda p: p[1])
# Table City: sul confine occidentale con Creta (il punto più a ovest del profilo), spostato verso l'interno.
_TABLE_EDGE = min(OUT_W, key=lambda p: p[0])
# Central City: vicino al centro del poligono centrale, sotto l'etichetta dell'area.
# Ishval: dentro l'Area Est (posizione interna NON documentata: il luogo è `needs_verification`), lontano dai bordi.
PINS: dict[str, Pt] = {
    "loc-fma-central-city": _pin("central", (AREA_LABELS["central"][0], AREA_LABELS["central"][1] + 70), 40),
    "loc-fma-fort-briggs": _pin("north", (_BRIGGS_TOP[0], _BRIGGS_TOP[1] + 26), 12),
    "loc-fma-ishval": _pin("east", (1070, 610), 60),
    "loc-fma-table-city": _pin("west", (_TABLE_EDGE[0] + 28, _TABLE_EDGE[1]), 12),
}

# Il generatore emette anche la GEOMETRIA dei confini delle cinque aree (una sola fonte di verità):
# `src/data/fullmetalalchemist/boundaryGeometry.ts`, importato dalla scheda a mano `boundaries.ts`.
GEOMETRY_TS = "boundaryGeometry.ts"


def _d(pts: list[Pt]) -> str:
    def n(v: float) -> str:
        s = f"{v:.1f}"
        return s[:-2] if s.endswith(".0") else s
    return "M " + " L ".join(f"{n(x)} {n(y)}" for x, y in pts) + " Z"


def write_boundary_geometry() -> None:
    import os
    path = os.path.join(ROOT, "src", "data", WORLD_DIR, GEOMETRY_TS)
    lines = [
        "/**",
        " * GENERATO da `python3 scripts/mapgen/fullmetalalchemist.py` (non modificare a mano).",
        " * Geometria SCHEMATICA delle cinque aree di Amestris sul piano 1500 × 1000 del livello `fma-map-world`:",
        " * stessi poligoni (`AMESTRIS_AREAS`) e stesse etichette (`AREA_LABELS`) disegnati nell'SVG.",
        " * Il profilo e i confini interni non sono documentati dall'opera.",
        " */",
        "export type FmaAreaKey = 'central' | 'north' | 'east' | 'south' | 'west';",
        "",
        "export const FMA_AREA_GEOMETRY: Record<FmaAreaKey, { svgPathD: string; labelPosition: { x: number; y: number } }> = {",
    ]
    for key in ("central", "north", "east", "south", "west"):
        x, y = AREA_LABELS[key]
        lines += [f"  {key}: {{", f"    svgPathD: '{_d(AMESTRIS_AREAS[key])}',",
                  f"    labelPosition: {{ x: {round(x)}, y: {round(y)} }},", "  },"]
    lines += ["};", ""]
    new = "\n".join(lines)
    if not os.path.exists(path) or open(path, encoding="utf-8").read() != new:
        open(path, "w", encoding="utf-8").write(new)


# =============================================================================
# DISEGNO
# =============================================================================
AREA_FILL = {"central": "#8c2f3a", "north": "#3f6f95", "east": "#a8802f", "south": "#4f8a5e", "west": "#7b5b98"}
NEIGH_FILL = {"drachma": "#3b4757", "creta": "#4a4a38", "aerugo": "#40504d", "xing": "#5b4a2c"}
NEIGH_LABEL = {"drachma": ("Drachma", "a nord · to the north"), "creta": ("Creta", "a ovest · to the west"),
               "aerugo": ("Aerugo", "a sud · to the south"), "xing": ("Xing", "a est · to the east")}


def alchemy_circle(cx: float, cy: float, r: float, color: str, op: float) -> list[str]:
    """Cerchio di trasmutazione originale e stilizzato (decorazione, non un cerchio dell'opera)."""
    out = [f'<g fill="none" stroke="{color}" stroke-width="2" opacity="{op}">',
           f'<circle cx="{cx}" cy="{cy}" r="{r}"/>', f'<circle cx="{cx}" cy="{cy}" r="{f(r * 0.9)}" stroke-dasharray="3 7"/>']
    for k in (0, 1):  # due triangoli sovrapposti (esagramma)
        pts = [(cx + r * 0.9 * math.cos(math.radians(-90 + 120 * i + 60 * k)),
                cy + r * 0.9 * math.sin(math.radians(-90 + 120 * i + 60 * k))) for i in range(3)]
        out.append(f'<path d="{poly(pts)}"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{f(r * 0.45)}"/>')
    out.append("</g>")
    return out


def build() -> Svg:
    rng = random.Random(7001)
    svg = Svg(W, H, "Fullmetal Alchemist · Amestris and neighbours (schematic) / Amestris e vicini (schema)", CREDIT)

    # fondo "carta militare" scura + granulosità + reticolo
    g = svg.gradient("bg", [(0, "#232733"), (1, "#11131a")], "radial", 'cx="50%" cy="50%" r="75%"')
    svg.add(f'<rect width="{W}" height="{H}" fill="{g}"/>')
    grid = []
    for x in range(0, W + 1, 100):
        grid.append(f"M{x},0 V{H}")
    for y in range(0, H + 1, 100):
        grid.append(f"M0,{y} H{W}")
    svg.add(f'<path d="{" ".join(grid)}" stroke="#8a93a8" stroke-width="0.6" opacity="0.14" fill="none"/>')

    # vicini (parziali)
    for name, pts in NEIGHBOURS.items():
        if name == "desert":
            continue
        svg.add(f'<path d="{poly(pts)}" fill="{NEIGH_FILL[name]}" stroke="#9aa3b5" stroke-width="2" stroke-linejoin="round"/>')
    # deserto a est di Amestris, tra il confine e Xing
    des = NEIGHBOURS["desert"]
    svg.defs.append(f'<clipPath id="des"><path d="{poly(des)}"/></clipPath>')
    svg.add(f'<path d="{poly(des)}" fill="#6e5b36" stroke="#c9a85a" stroke-width="2" stroke-dasharray="10 7" stroke-linejoin="round"/>')
    svg.add(f'<g clip-path="url(#des)">')
    svg.add(dots(rng, (1100, 270, 1380, 800), 520, "#e8d49a", (0.7, 1.7), None, (0.15, 0.5)))
    for k in range(14):  # dune stilizzate
        x, y = rng.uniform(1160, 1320), 330 + k * 34 + rng.uniform(-8, 8)
        svg.add(f'<path d="M{f(x)},{f(y)} q16,-12 32,0 t32,0" fill="none" stroke="#e8d49a" stroke-width="1.6" opacity="0.5"/>')
    svg.add("</g>")
    # trama a puntini sui vicini
    for name in ("drachma", "creta", "aerugo", "xing"):
        svg.add(dots(rng, (0, 0, W, H), 90, "#ffffff", (0.6, 1.4),
                     lambda x, y, p=NEIGHBOURS[name]: _pip(x, y, p), (0.06, 0.2)))

    # cerchio di trasmutazione decorativo sotto Amestris
    svg.add(alchemy_circle(752, 528, 380, GOLD, 0.16))

    # le cinque aree
    for name in ("north", "east", "south", "west", "central"):
        svg.add(f'<path d="{poly(AMESTRIS_AREAS[name])}" fill="{AREA_FILL[name]}" fill-opacity="0.82" '
                f'stroke="{LIGHT}" stroke-width="2.2" stroke-linejoin="round" stroke-opacity="0.85"/>')
    # contorno esterno di Amestris più marcato (confine nazionale), sopra le linee interne
    svg.add(f'<path d="{poly(AMESTRIS_OUTLINE)}" fill="none" stroke="{GOLD}" stroke-width="5" stroke-linejoin="round"/>')
    svg.add(f'<path d="{poly(AMESTRIS_OUTLINE)}" fill="none" stroke="{INK}" stroke-width="1.2" stroke-linejoin="round" opacity="0.6"/>')

    # Monti Briggs: catena lungo il confine nord (sul lato Drachma)
    peaks = [(x, y - 14) for (x, y) in OUT_N[::4]]
    svg.add(_range(peaks, rng))
    # etichetta curva sopra la catena
    path_pts = [(x, y - 84) for (x, y) in OUT_N[::6]]
    svg.add(curved_text(svg, "briggs", path_pts, "MONTI BRIGGS · BRIGGS MOUNTAINS", size=18, fill=LIGHT,
                        spacing=5, halo=INK, italic=False, weight="bold"))

    # etichette delle aree
    for name, (it, en) in (("central", ("Area Centrale", "Central Area")), ("north", ("Area Nord", "North Area")),
                           ("east", ("Area Est", "East Area")), ("south", ("Area Sud", "South Area")),
                           ("west", ("Area Ovest", "West Area"))):
        x, y = AREA_LABELS[name]
        svg.add(region_label(x, y, it, sub=en, size=26, color=LIGHT, halo=INK, family=SERIF, spacing=3))
    sx, sy = AREA_LABELS["central"]
    svg.add(text(sx, sy - 52, "AMESTRIS", size=15, fill=GOLD, spacing=8, weight="bold", halo=INK, halo_w=4))

    # etichette dei vicini
    for name, (x, y, size) in (("drachma", (820, 80, 40)), ("creta", (166, 520, 34)),
                               ("aerugo", (750, 905, 40)), ("xing", (1432, 520, 30))):
        main, sub = NEIGH_LABEL[name]
        svg.add(region_label(x, y, main, sub=sub, size=size, color=LIGHT, halo=INK, family=SERIF, spacing=6))
    svg.add(text(1236, 560, "DESERTO · DESERT", size=17, fill="#f6e8be", spacing=6, weight="bold", italic=True,
                 halo=INK, halo_w=4, rot=-90))

    # bordo sfumato: i vicini continuano oltre la cornice
    vg = svg.gradient("vig", [(0.62, "#05060a", 0), (1, "#05060a", 0.78)], "radial", 'cx="50%" cy="50%" r="72%"')
    svg.add(f'<rect width="{W}" height="{H}" fill="{vg}"/>')
    svg.add(f'<rect x="10" y="10" width="{W - 20}" height="{H - 20}" fill="none" stroke="{GOLD}" stroke-width="3"/>')
    svg.add(f'<rect x="20" y="20" width="{W - 40}" height="{H - 40}" fill="none" stroke="{GOLD}" stroke-width="1" opacity="0.6"/>')

    # titolo, bussola, avvertenza
    svg.add(plaque(300, 96, 440, 124, "Amestris", sub="Mappa schematica · Schematic map", ink=LIGHT, stroke=GOLD,
                   fill="#171a23", size=40))
    svg.add(compass(1390, 100, 40, GOLD, "#171a23", "#b8232f"))
    svg.add(text(750, 972, "Schema indicativo AniMapVerse: confini e forme non sono canonici · "
                           "Indicative AniMapVerse schematic: borders and shapes are not canon",
                 size=13, fill="#c9cfdd", italic=True, halo=INK, halo_w=3))
    return svg


def _range(points: list[Pt], rng: random.Random) -> list[str]:
    out: list[str] = []
    for x, y in points:
        s = rng.uniform(0.85, 1.2)
        out += mountain(x, y, 64 * s, 52 * s, fill="#9aa3b0", dark="#5c6676", snow="#f4f7fb", stroke="#1d2230",
                        rng=rng, sw=1.4)
    return out


if __name__ == "__main__":
    svg = build()
    svg.save(out_path(WORLD_DIR, "fullmetalalchemist-world-map.svg"))
    preview(svg.path, PINS, svg.w, svg.h)
    write_boundary_geometry()
    apply_pins(WORLD_DIR, PINS)
