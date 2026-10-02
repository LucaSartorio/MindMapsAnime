#!/usr/bin/env python3
"""Genera le mappe SVG ORIGINALI di Bleach (nessuna mappa ufficiale esiste).

Bleach non ha mai pubblicato una mappa "geografica" dei suoi mondi: questa è
una RICOSTRUZIONE di AniMapVerse, disegnata da zero a partire da ciò che l'opera
racconta (manga, anime, databook) e da ciò che riportano le wiki dei fan:

  * `bleach-three-worlds.svg`   — la cosmologia: Soul Society (Seireitei +
    Rukongai a 4 quadranti × 80 distretti) con il Reiōkyū sopra, il Dangai,
    il Mondo dei Vivi, la Garganta, Hueco Mundo con Las Noches e la Foresta dei
    Menos, e il Jigoku in basso. Schema cosmologico, NON in scala.
  * `bleach-karakura.svg`       — pianta concettuale della città di Karakura.
  * `bleach-seireitei.svg`      — il Seireitei: mura di sekkiseki, 13 caserme,
    Sōkyoku, Senzaikyū, Central 46, Accademia Shin'ō…
  * `bleach-hueco-mundo.svg`    — il deserto e la fortezza di Las Noches.
  * `bleach-reiokyu.svg`        — il Palazzo del Re delle Anime e i palazzi
    della Divisione Zero.

Tutte le forme sono geometria originale (nessun artwork ufficiale). Il disegno
è DETERMINISTICO (random con seme fisso): rieseguire lo script produce file
identici. Le coordinate dei pin in `src/data/bleach/*.ts` sono lette su questi
stessi piani (viewBox in `src/data/bleach/mapConstants.ts`): se sposti un
elemento qui, aggiorna il pin corrispondente.

    python3 scripts/bleach-maps.py
       -> public/assets/worlds/bleach/maps/*.svg
"""
from __future__ import annotations

import math
import os
import random

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "worlds", "bleach", "maps")

SERIF = "Georgia, 'Times New Roman', serif"
SANS = "'Helvetica Neue', Arial, sans-serif"
JP = "'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif CJK JP', 'Noto Serif JP', serif"


def f(v: float) -> str:
    """Numero compatto (max 1 decimale) per tenere leggeri i file."""
    s = f"{v:.1f}"
    return s[:-2] if s.endswith(".0") else s


def svg_open(w: int, h: int, title: str) -> list[str]:
    return [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">',
        f"<title>{title}</title>",
        "<!-- Ricostruzione originale AniMapVerse · CC0 · non è materiale ufficiale di Bleach -->",
    ]


def text(x, y, s, size=20, fill="#fff", anchor="middle", family=SERIF, weight="normal",
         spacing=0, opacity=1.0, italic=False, extra=""):
    st = ' font-style="italic"' if italic else ""
    ls = f' letter-spacing="{spacing}"' if spacing else ""
    op = f' opacity="{opacity}"' if opacity != 1 else ""
    return (f'<text x="{f(x)}" y="{f(y)}" font-family="{family}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{ls}{st}{op}{extra}>{s}</text>')


def label(x, y, main, sub=None, jp=None, size=34, color="#f1ead8", subcolor="#b9b2a0", spacing=6):
    """Etichetta di regione: nome maiuscolo spaziato, kanji e sottotitolo."""
    out = [text(x, y, main, size=size, fill=color, spacing=spacing, weight="bold",
                extra=' stroke="#000" stroke-opacity="0.35" stroke-width="4" paint-order="stroke"')]
    dy = size * 0.95
    if jp:
        out.append(text(x, y + dy, jp, size=size * 0.62, fill=subcolor, family=JP, spacing=4))
        dy += size * 0.75
    if sub:
        out.append(text(x, y + dy, sub, size=size * 0.42, fill=subcolor, spacing=2, italic=True))
    return out


def stars(rng: random.Random, w, h, n, region=None, color="#ffffff"):
    out = []
    for _ in range(n):
        x, y = rng.uniform(0, w), rng.uniform(0, h)
        if region and not region(x, y):
            continue
        r = rng.choice([0.6, 0.8, 1.0, 1.0, 1.3, 1.8])
        o = rng.uniform(0.25, 0.85)
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" fill="{color}" opacity="{o:.2f}"/>')
    return out


def ring_path(cx, cy, r1, r2):
    """Corona circolare (anello) come path con regola evenodd."""
    return (f"M{f(cx - r2)},{f(cy)} a{f(r2)},{f(r2)} 0 1,0 {f(2 * r2)},0 a{f(r2)},{f(r2)} 0 1,0 {f(-2 * r2)},0 Z "
            f"M{f(cx - r1)},{f(cy)} a{f(r1)},{f(r1)} 0 1,0 {f(2 * r1)},0 a{f(r1)},{f(r1)} 0 1,0 {f(-2 * r1)},0 Z")


def blob(cx, cy, rx, ry, rng: random.Random, n=28, jitter=0.08):
    """Forma organica chiusa (isola, duna, macchia) attorno a un centro."""
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        k = 1 + rng.uniform(-jitter, jitter)
        pts.append((cx + math.cos(a) * rx * k, cy + math.sin(a) * ry * k))
    d = f"M{f(pts[0][0])},{f(pts[0][1])} "
    for i in range(n):
        p1 = pts[(i + 1) % n]
        p0 = pts[i]
        mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
        d += f"Q{f(p0[0])},{f(p0[1])} {f(mx)},{f(my)} "
    return d + "Z"


def roof(x, y, w, h, rot=0):
    """Tetto giapponese visto dall'alto (rettangolo): lo stile viene dal <g> che lo contiene."""
    t = f' transform="rotate({f(rot)} {f(x)} {f(y)})"' if rot else ""
    return f'<rect x="{f(x - w / 2)}" y="{f(y - h / 2)}" width="{f(w)}" height="{f(h)}"{t}/>'


def roofs_open(fill, stroke):
    return f'<g fill="{fill}" stroke="{stroke}" stroke-width="0.8">'


def write(name, parts):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(parts) + "\n</svg>\n")
    print(f"  {name}  {os.path.getsize(path) / 1024:.0f} KB")


# =============================================================================
# 1. I TRE MONDI — 2000 × 1250
# =============================================================================
def three_worlds():
    W, H = 2000, 1250
    rng = random.Random(7)
    p = svg_open(W, H, "Bleach · I Tre Mondi / The Three Worlds")
    p.append("""<defs>
<radialGradient id="sky" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#151a26"/><stop offset="1" stop-color="#05060a"/></radialGradient>
<radialGradient id="ssGlow" cx="50%" cy="50%" r="50%"><stop offset="0.55" stop-color="#d9c79a" stop-opacity="0.18"/><stop offset="1" stop-color="#d9c79a" stop-opacity="0"/></radialGradient>
<radialGradient id="rukon" cx="50%" cy="50%" r="50%"><stop offset="0.3" stop-color="#8a8a5c"/><stop offset="0.75" stop-color="#55603f"/><stop offset="1" stop-color="#36402c"/></radialGradient>
<radialGradient id="seirei" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#fbf7ec"/><stop offset="1" stop-color="#d8cfb9"/></radialGradient>
<linearGradient id="dangai" x1="0" x2="1"><stop offset="0" stop-color="#3a1f5c"/><stop offset="0.5" stop-color="#6b3fa0"/><stop offset="1" stop-color="#3a1f5c"/></linearGradient>
<linearGradient id="hmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#020205"/><stop offset="1" stop-color="#121420"/></linearGradient>
<linearGradient id="sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9e6dc"/><stop offset="1" stop-color="#b9b4a6"/></linearGradient>
<linearGradient id="menos" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1e2b"/><stop offset="1" stop-color="#0a0b12"/></linearGradient>
<radialGradient id="living" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="#36506a"/><stop offset="1" stop-color="#1c2a3a"/></radialGradient>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f2236"/><stop offset="1" stop-color="#081320"/></linearGradient>
<radialGradient id="hell" cx="50%" cy="20%" r="80%"><stop offset="0" stop-color="#7a1414"/><stop offset="0.6" stop-color="#2a0606"/><stop offset="1" stop-color="#0a0202"/></radialGradient>
<radialGradient id="gold" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#fff3c4"/><stop offset="1" stop-color="#c9a24a"/></radialGradient>
<radialGradient id="moon" cx="40%" cy="40%" r="60%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd3dc"/></radialGradient>
</defs>""")
    p.append(f'<rect width="{W}" height="{H}" fill="url(#sky)"/>')
    p += stars(rng, W, H, 520)

    # ---------------- Fili di reishi che collegano i mondi ----------------
    p.append('<g fill="none" stroke="#9fb4d9" stroke-width="1.4" stroke-dasharray="3 9" opacity="0.45">')
    p.append('<path d="M470,300 C470,270 470,250 470,215"/>')  # Seireitei → Reiōkyū
    p.append('<path d="M800,640 C1000,620 1150,700 1330,640"/>')
    p.append('<path d="M1110,760 C1110,880 1110,980 1110,1050"/>')  # Mondo dei vivi → Jigoku
    p.append("</g>")

    # ---------------- SOUL SOCIETY ----------------
    cx, cy = 470, 640
    p.append(f'<circle cx="{cx}" cy="{cy}" r="380" fill="url(#ssGlow)"/>')
    # boschi selvaggi esterni
    p.append(f'<circle cx="{cx}" cy="{cy}" r="330" fill="#25301f" stroke="#59654a" stroke-width="2"/>')
    for _ in range(420):
        a = rng.uniform(0, 2 * math.pi)
        r = rng.uniform(300, 326)
        x, y = cx + math.cos(a) * r, cy + math.sin(a) * r
        p.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rng.uniform(2, 4.5))}" fill="#3d4d30" opacity="0.9"/>')
    # Rukongai: 8 anelli = 80 distretti per quadrante (più lontano = più povero)
    p.append(f'<circle cx="{cx}" cy="{cy}" r="300" fill="url(#rukon)"/>')
    for i in range(1, 9):
        r = 110 + i * 23.75
        p.append(f'<circle cx="{cx}" cy="{cy}" r="{f(r)}" fill="none" stroke="#2b3322" stroke-width="0.9" opacity="0.55"/>')
    # tetti sparsi del Rukongai: densi vicino al centro, radi ai margini
    for _ in range(1100):
        a = rng.uniform(0, 2 * math.pi)
        t = rng.random() ** 1.7
        r = 118 + t * 178
        if min(abs(math.cos(a)), abs(math.sin(a))) < 0.05:  # le grandi strade restano libere
            continue
        x, y = cx + math.cos(a) * r, cy + math.sin(a) * r
        shade = "#c9b98f" if r < 180 else ("#a1926c" if r < 240 else "#7d7058")
        s = 3.4 - t * 1.6
        p.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(s)}" height="{f(s * 0.7)}" fill="{shade}" opacity="0.85" '
                 f'transform="rotate({f(math.degrees(a))} {f(x)} {f(y)})"/>')
    # quattro grandi strade che dividono Kita/Minami/Higashi/Nishi
    p.append('<g stroke="#d8c99f" stroke-width="5" opacity="0.55">')
    p.append(f'<line x1="{cx}" y1="{cy - 300}" x2="{cx}" y2="{cy + 300}"/><line x1="{cx - 300}" y1="{cy}" x2="{cx + 300}" y2="{cy}"/>')
    p.append("</g>")
    # Seireitei: mura di sekkiseki
    p.append(f'<circle cx="{cx}" cy="{cy}" r="114" fill="#efe7d2" stroke="#fdfaf2" stroke-width="7"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="104" fill="url(#seirei)"/>')
    p.append(roofs_open("#e5dccb", "#8e7f66"))
    for _ in range(330):
        a = rng.uniform(0, 2 * math.pi)
        r = rng.uniform(18, 98)
        x, y = cx + math.cos(a) * r, cy + math.sin(a) * r
        p.append(roof(x, y, rng.uniform(5, 9), rng.uniform(3.5, 5.5), rng.choice([0, 90, 45])))
    p.append("</g>")
    p.append(f'<circle cx="{cx}" cy="{cy}" r="12" fill="#9b8a6c" stroke="#5d4f3a" stroke-width="1.5"/>')
    p.append(f'<path d="M{cx + 38},{cy - 70} l20,-14 l22,6 l4,20 l-26,10 Z" fill="#a89064" stroke="#6b5838"/>')  # Sōkyoku
    for gx, gy in [(cx, cy - 114), (cx, cy + 114), (cx - 114, cy), (cx + 114, cy)]:
        p.append(f'<rect x="{gx - 7}" y="{gy - 7}" width="14" height="14" fill="#5d4f3a" transform="rotate(45 {gx} {gy})"/>')
    # etichette dei quadranti
    q = dict(fill="#efe3c0", size=15, spacing=3, opacity=0.85)
    p.append(text(cx, cy - 196, "KITA RUKONGAI", **q))
    p.append(text(cx, cy + 210, "MINAMI RUKONGAI", **q))
    p.append(text(cx + 238, cy - 10, "HIGASHI", **q))
    p.append(text(cx + 238, cy + 8, "RUKONGAI", **q))
    p.append(text(cx - 240, cy - 10, "NISHI", **q))
    p.append(text(cx - 240, cy + 8, "RUKONGAI", **q))
    p.append(text(cx + 236, cy + 270, "1 → 80", size=13, fill="#d9cfb0", opacity=0.7, italic=True))
    p += label(cx, 1030, "SOUL SOCIETY", "Seireitei · Rukongai", "尸魂界", size=38)

    # ---------------- REIŌKYŪ ----------------
    rx, ry = 470, 120
    p.append(f'<ellipse cx="{rx}" cy="{ry + 12}" rx="210" ry="60" fill="#c9a24a" opacity="0.08"/>')
    for dx, dy, s in [(-150, 30, 1), (-85, 70, 0.9), (85, 70, 0.9), (150, 30, 1), (0, 85, 0.85)]:
        x, y = rx + dx, ry + dy
        p.append(f'<ellipse cx="{x}" cy="{y + 6}" rx="{f(34 * s)}" ry="{f(10 * s)}" fill="#6d5520"/>')
        p.append(f'<ellipse cx="{x}" cy="{y}" rx="{f(34 * s)}" ry="{f(10 * s)}" fill="url(#gold)" stroke="#fff1bf" stroke-width="1"/>')
        p.append(f'<rect x="{f(x - 6)}" y="{f(y - 14)}" width="12" height="12" fill="#f7e8b8" stroke="#8a6d2a"/>')
    p.append(f'<ellipse cx="{rx}" cy="{ry - 10}" rx="34" ry="52" fill="url(#gold)" stroke="#fff6d6" stroke-width="2"/>')
    p.append(f'<path d="M{rx - 34},{ry - 10} Q{rx},{ry + 18} {rx + 34},{ry - 10}" fill="none" stroke="#8a6d2a" stroke-width="1.5"/>')
    p += label(rx + 345, 70, "REIŌKYŪ", "Palazzo del Re · Soul King Palace", "霊王宮", size=26, color="#f4dc93", subcolor="#c8b072")

    # ---------------- DANGAI ----------------
    p.append('<path d="M812,560 C840,548 890,548 918,560 L918,720 C890,732 840,732 812,720 Z" fill="url(#dangai)" stroke="#a37ad6" stroke-width="1.5" opacity="0.92"/>')
    for i in range(7):
        y = 572 + i * 22
        p.append(f'<path d="M816,{y} C840,{y - 8} 890,{y + 8} 914,{y}" fill="none" stroke="#caa9f2" stroke-width="1" opacity="0.45"/>')
    for gx in (800, 930):  # Senkaimon alle due estremità
        p.append(f'<g stroke="#f1d7a3" stroke-width="3" fill="none"><line x1="{gx - 9}" y1="606" x2="{gx - 9}" y2="676"/>'
                 f'<line x1="{gx + 9}" y1="606" x2="{gx + 9}" y2="676"/><line x1="{gx - 15}" y1="606" x2="{gx + 15}" y2="606"/>'
                 f'<line x1="{gx - 12}" y1="616" x2="{gx + 12}" y2="616"/></g>')
    p += label(865, 508, "DANGAI", None, "断界", size=22, color="#d9c2f7", subcolor="#a98fcf", spacing=4)
    p.append(text(865, 758, "Mondo del Precipizio", size=11, fill="#a98fcf", italic=True))
    p.append(text(865, 773, "Precipice World", size=11, fill="#a98fcf", italic=True))

    # ---------------- MONDO DEI VIVI ----------------
    p.append('<rect x="945" y="430" width="370" height="420" rx="28" fill="url(#sea)" stroke="#3b5878" stroke-width="2"/>')
    p.append(f'<path d="{blob(1120, 640, 140, 175, rng, 30, 0.12)}" fill="url(#living)" stroke="#6f8fb0" stroke-width="2"/>')
    p.append(f'<path d="{blob(1260, 500, 34, 22, rng, 14, 0.2)}" fill="#2c4258" stroke="#6f8fb0" stroke-width="1.2"/>')
    p.append(f'<path d="{blob(990, 790, 26, 16, rng, 14, 0.2)}" fill="#2c4258" stroke="#6f8fb0" stroke-width="1.2"/>')
    for _ in range(240):  # luci di città
        x, y = rng.gauss(1110, 45), rng.gauss(640, 55)
        p.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rng.uniform(0.6, 1.8))}" fill="#ffd27a" opacity="{rng.uniform(0.3, 0.9):.2f}"/>')
    for _ in range(90):
        x, y = rng.gauss(1195, 22), rng.gauss(560, 22)
        p.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rng.uniform(0.6, 1.4))}" fill="#ffe2a8" opacity="{rng.uniform(0.3, 0.8):.2f}"/>')
    p += label(1130, 895, "GENSEI", "Mondo dei Vivi · World of the Living", "現世", size=30, color="#d8e6f5", subcolor="#93a9c2")

    # ---------------- GARGANTA ----------------
    d = "M1372,430 "
    y = 430
    pts_l, pts_r = [], []
    while y < 860:
        y += rng.uniform(18, 32)
        pts_l.append((1372 - rng.uniform(4, 22), y))
        pts_r.append((1388 + rng.uniform(4, 22), y))
    d += " ".join(f"L{f(x)},{f(yy)}" for x, yy in pts_l)
    d += " L1380,880 " + " ".join(f"L{f(x)},{f(yy)}" for x, yy in reversed(pts_r)) + " L1388,430 Z"
    p.append(f'<path d="{d}" fill="#000" stroke="#4b5a7a" stroke-width="1.5"/>')
    p.append('<path d="M1380,450 L1380,860" stroke="#7f8fb8" stroke-width="1" stroke-dasharray="2 10" opacity="0.6"/>')
    p.append(text(1346, 650, "GARGANTA", size=16, fill="#aab6d6", spacing=4, weight="bold", extra=' transform="rotate(-90 1346 650)"'))
    p.append(text(1380, 906, "黒腔", size=15, fill="#8592b3", family=JP))

    # ---------------- HUECO MUNDO ----------------
    p.append('<rect x="1435" y="190" width="535" height="820" rx="30" fill="url(#hmSky)" stroke="#2b3046" stroke-width="2"/>')
    p.append('<clipPath id="hmClip"><rect x="1435" y="190" width="535" height="820" rx="30"/></clipPath>')
    p.append('<g clip-path="url(#hmClip)">')
    p += stars(rng, W, H, 140, region=lambda x, y: 1440 < x < 1965 and 195 < y < 520)
    p.append('<circle cx="1835" cy="285" r="46" fill="url(#moon)"/><circle cx="1856" cy="270" r="44" fill="#06070c"/>')  # falce di luna
    sand = "M1435,560 "
    for i in range(0, 560, 40):
        sand += f"Q{1435 + i + 20},{f(540 + rng.uniform(-18, 14))} {1435 + i + 40},{f(556 + rng.uniform(-6, 6))} "
    sand += "L1975,880 L1435,880 Z"
    p.append(f'<path d="{sand}" fill="url(#sand)"/>')
    for i in range(6):
        y = 610 + i * 42
        p.append(f'<path d="M1435,{y} C1560,{y - 22} 1700,{y + 18} 1975,{y - 12}" fill="none" stroke="#a49f90" stroke-width="1" opacity="0.6"/>')
    # alberi di quarzo morti
    for _ in range(26):
        x, y = rng.uniform(1450, 1950), rng.uniform(600, 860)
        if 1540 < x < 1840 and y < 760:
            continue
        h = rng.uniform(14, 26)
        p.append(f'<path d="M{f(x)},{f(y)} l0,-{f(h)} m0,{f(h * 0.4)} l-{f(h * 0.35)},-{f(h * 0.35)} m{f(h * 0.35)},{f(h * 0.1)} '
                 f'l{f(h * 0.3)},-{f(h * 0.4)}" stroke="#d7d9de" stroke-width="1.6" fill="none" opacity="0.9"/>')
    # Las Noches
    p.append('<ellipse cx="1690" cy="612" rx="150" ry="34" fill="#9d988a"/>')
    p.append('<path d="M1540,612 A150,128 0 0,1 1840,612 Z" fill="#f4f1e8" stroke="#ffffff" stroke-width="2"/>')
    p.append('<path d="M1580,612 A110,92 0 0,1 1800,612" fill="none" stroke="#c9c4b5" stroke-width="1.2"/>')
    for tx, th in [(1590, 70), (1640, 95), (1700, 120), (1752, 88), (1800, 64)]:
        p.append(f'<rect x="{tx - 5}" y="{612 - th}" width="10" height="{th}" fill="#e3ded0" stroke="#a8a293" stroke-width="0.8"/>')
    p.append('<path d="M1540,612 A150,128 0 0,1 1840,612" fill="none" stroke="#fff" stroke-width="3"/>')
    # Foresta dei Menos sotto la sabbia
    p.append('<rect x="1435" y="880" width="540" height="130" fill="url(#menos)"/>')
    p.append('<path d="M1435,880 L1975,880" stroke="#6d6a62" stroke-width="2"/>')
    for _ in range(36):
        x = rng.uniform(1450, 1960)
        h = rng.uniform(40, 100)
        p.append(f'<path d="M{f(x)},1010 L{f(x - 5)},{f(1010 - h)} L{f(x)},{f(1010 - h - 12)} L{f(x + 5)},{f(1010 - h)} Z" '
                 f'fill="#3a4258" stroke="#7c87a8" stroke-width="0.8" opacity="0.85"/>')
    for _ in range(14):  # maschere bianche dei Menos tra i cristalli
        x, y = rng.uniform(1460, 1950), rng.uniform(920, 995)
        p.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="4" ry="5.5" fill="#f2f2f2" opacity="0.8"/>'
                 f'<circle cx="{f(x - 1.5)}" cy="{f(y - 1)}" r="0.9" fill="#000"/><circle cx="{f(x + 1.5)}" cy="{f(y - 1)}" r="0.9" fill="#000"/>')
    p.append("</g>")
    p += label(1640, 300, "HUECO MUNDO", None, "虚圏", size=28, color="#f2f2f4", subcolor="#9ea3b5")

    # ---------------- JIGOKU ----------------
    p.append('<rect x="890" y="1050" width="440" height="180" rx="22" fill="url(#hell)" stroke="#7a2a20" stroke-width="2"/>')
    for i in range(8):
        x = 905 + i * 52
        p.append(f'<path d="M{x},1230 Q{x + 14},{1185 - (i % 3) * 14} {x + 26},1230" fill="#c13a12" opacity="0.35"/>')
    # Porte dell'Inferno: due battenti con teschi e catene
    p.append('<g transform="translate(1110 1150)">'
             '<rect x="-58" y="-78" width="54" height="120" fill="#2b0c0a" stroke="#c9873c" stroke-width="2"/>'
             '<rect x="4" y="-78" width="54" height="120" fill="#2b0c0a" stroke="#c9873c" stroke-width="2"/>'
             '<path d="M-64,-78 L0,-104 L64,-78 Z" fill="#3a100c" stroke="#c9873c" stroke-width="2"/>'
             '<circle cx="-31" cy="-34" r="11" fill="#e8dcc6"/><circle cx="31" cy="-34" r="11" fill="#e8dcc6"/>'
             '<circle cx="-35" cy="-36" r="2.4" fill="#2b0c0a"/><circle cx="-27" cy="-36" r="2.4" fill="#2b0c0a"/>'
             '<circle cx="27" cy="-36" r="2.4" fill="#2b0c0a"/><circle cx="35" cy="-36" r="2.4" fill="#2b0c0a"/>'
             '<path d="M-58,10 C-30,0 30,20 58,10" stroke="#9a9a9a" stroke-width="3" fill="none" stroke-dasharray="6 3"/>'
             "</g>")
    p.append(text(985, 1092, "JIGOKU", size=22, fill="#f3b38a", spacing=5, weight="bold", anchor="middle"))
    p.append(text(985, 1114, "地獄 · Inferno · Hell", size=13, fill="#c98d6a", family=JP))

    # ---------------- Cartiglio ----------------
    p.append('<g transform="translate(1590 70)">'
             '<rect x="-230" y="-42" width="460" height="92" rx="10" fill="#0d0f16" stroke="#e8552d" stroke-width="1.5" opacity="0.92"/>')
    p.append(text(0, -6, "BLEACH · I TRE MONDI", size=26, fill="#f5efe2", spacing=4, weight="bold"))
    p.append(text(0, 20, "The Three Worlds — schema cosmologico, non in scala", size=13, fill="#b8b2a3", italic=True))
    p.append(text(0, 38, "ricostruzione originale AniMapVerse", size=11, fill="#8d887c", italic=True))
    p.append("</g>")
    write("bleach-three-worlds.svg", p)


# =============================================================================
# 2. KARAKURA — 1600 × 1000
# =============================================================================
def karakura():
    W, H = 1600, 1000
    rng = random.Random(11)
    p = svg_open(W, H, "Bleach · Karakura")
    p.append("""<defs>
<radialGradient id="kbg" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#1f2a38"/><stop offset="1" stop-color="#0d131c"/></radialGradient>
<linearGradient id="river" x1="0" x2="1"><stop offset="0" stop-color="#14324d"/><stop offset="1" stop-color="#1d4669"/></linearGradient>
<radialGradient id="hill" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#3c4d36"/><stop offset="1" stop-color="#232e21"/></radialGradient>
</defs>""")
    p.append(f'<rect width="{W}" height="{H}" fill="url(#kbg)"/>')
    def river_center(x):
        # fiume: entra a destra (1600, 520), scende verso (760, 780) ed esce a sinistra (0, 880)
        if x >= 760:
            t = (x - 760) / 840
            return 780 - 260 * t ** 1.3
        t = x / 760
        return 880 - 100 * t

    # isolati: griglia irregolare con edifici
    roads_h = [130, 260, 430, 600]
    roads_v = [180, 360, 560, 700, 880, 1060, 1240, 1420]
    for bx in range(30, W - 20, 30):
        for by in range(30, H - 20, 30):
            rc = river_center(bx)
            if abs(by - rc) < 48:
                continue
            if any(abs(by - r) < 12 for r in roads_h) or any(abs(bx - r) < 12 for r in roads_v):
                continue
            if (bx - 1290) ** 2 / 190 ** 2 + (by - 190) ** 2 / 140 ** 2 < 1:  # collina
                continue
            if (bx - 500) ** 2 / 120 ** 2 + (by - 320) ** 2 / 70 ** 2 < 1:  # campo/parco
                continue
            if (bx - 975) ** 2 / 115 ** 2 + (by - 345) ** 2 / 70 ** 2 < 1:  # scuola
                continue
            if rng.random() < 0.18:
                continue
            w, h = rng.uniform(12, 24), rng.uniform(10, 20)
            shade = rng.choice(["#2c3a4d", "#33445a", "#293648", "#3a4b61"])
            p.append(f'<rect x="{f(bx - w / 2)}" y="{f(by - h / 2)}" width="{f(w)}" height="{f(h)}" rx="1.5" fill="{shade}"/>')
            if rng.random() < 0.25:
                p.append(f'<rect x="{f(bx - 1.5)}" y="{f(by - 1.5)}" width="3" height="3" fill="#ffd27a" opacity="0.7"/>')
    # strade
    p.append('<g stroke="#56677f" stroke-width="7" opacity="0.65" fill="none">')
    for y in roads_h:
        p.append(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}"/>')
    for x in roads_v:
        p.append(f'<line x1="{x}" y1="0" x2="{x}" y2="{H}"/>')
    p.append("</g>")
    # ferrovia
    p.append('<line x1="0" y1="445" x2="1600" y2="445" stroke="#a7b3c4" stroke-width="3"/>'
             '<line x1="0" y1="445" x2="1600" y2="445" stroke="#1b2430" stroke-width="2" stroke-dasharray="6 6"/>')
    p.append('<rect x="780" y="432" width="84" height="26" rx="3" fill="#4b5d78" stroke="#c4cfdd" stroke-width="1.2"/>')
    # fiume
    pts = [(x, river_center(x)) for x in range(0, W + 1, 40)]
    top = " ".join(f"L{f(x)},{f(y - 30)}" for x, y in pts)
    bot = " ".join(f"L{f(x)},{f(y + 30)}" for x, y in reversed(pts))
    p.append(f'<path d="M{top[1:]} {bot} Z" fill="url(#river)" stroke="#3f6f99" stroke-width="2"/>')
    for x in range(20, W, 70):
        y = river_center(x)
        p.append(f'<path d="M{x},{f(y)} q10,-4 20,0" stroke="#6ea4cf" stroke-width="1" fill="none" opacity="0.5"/>')
    # argine erboso (dove muore Masaki) a nord del fiume
    p.append(f'<path d="M560,{f(river_center(560) - 34)} L1000,{f(river_center(1000) - 34)} L1000,{f(river_center(1000) - 58)} '
             f'L560,{f(river_center(560) - 58)} Z" fill="#2e4630" opacity="0.9"/>')
    for bx in (450, 1050):  # ponti
        y = river_center(bx)
        p.append(f'<rect x="{bx - 12}" y="{f(y - 44)}" width="24" height="88" fill="#6b7a90" stroke="#c4cfdd" stroke-width="1"/>')
    # collina del cimitero
    p.append(f'<path d="{blob(1290, 190, 185, 135, rng, 26, 0.07)}" fill="url(#hill)" stroke="#4f6146" stroke-width="1.5"/>')
    for k in (0.75, 0.5, 0.28):
        p.append(f'<path d="{blob(1290, 190, 185 * k, 135 * k, rng, 22, 0.06)}" fill="none" stroke="#5d7253" stroke-width="1" opacity="0.7"/>')
    for _ in range(40):  # lapidi
        x, y = rng.uniform(1220, 1380), rng.uniform(140, 250)
        p.append(f'<rect x="{f(x)}" y="{f(y)}" width="3" height="6" fill="#b9bcb3" opacity="0.8"/>')
    # campo/parco a ovest
    p.append(f'<path d="{blob(500, 320, 115, 66, rng, 22, 0.08)}" fill="#253a27" stroke="#3f5a40" stroke-width="1.5"/>')
    for _ in range(30):
        x, y = rng.uniform(410, 590), rng.uniform(280, 360)
        p.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rng.uniform(3, 6))}" fill="#355236"/>')
    # scuola: edificio a L + campo sportivo
    p.append('<rect x="880" y="300" width="70" height="90" fill="#59667c" stroke="#c4cfdd" stroke-width="1"/>'
             '<rect x="950" y="300" width="120" height="30" fill="#59667c" stroke="#c4cfdd" stroke-width="1"/>'
             '<rect x="965" y="342" width="105" height="52" rx="22" fill="#5a4a3a" stroke="#b49a7c" stroke-width="1"/>')
    # ospedale generale
    p.append('<rect x="1300" y="480" width="90" height="66" fill="#5f6f87" stroke="#dfe7f1" stroke-width="1.2"/>'
             '<rect x="1340" y="494" width="10" height="34" fill="#dfe7f1"/><rect x="1328" y="506" width="34" height="10" fill="#dfe7f1"/>')
    # case-simbolo: Clinica Kurosaki, Negozio Urahara, appartamento di Orihime
    for x, y, c in [(700, 540, "#c9b27a"), (420, 650, "#7fa36b"), (1100, 630, "#b98aa8")]:
        p.append(f'<rect x="{x - 18}" y="{y - 13}" width="36" height="26" rx="2" fill="{c}" stroke="#f2ead6" stroke-width="1.5"/>'
                 f'<path d="M{x - 20},{y - 13} L{x},{y - 25} L{x + 20},{y - 13} Z" fill="#3a3f47" stroke="#f2ead6" stroke-width="1.2"/>')
    # magazzini abbandonati (Visored)
    for i in range(3):
        p.append(f'<rect x="{196 + i * 26}" y="{502 + (i % 2) * 6}" width="22" height="40" fill="#3a3f47" stroke="#7d848f" stroke-width="1"/>')
    # ospedale abbandonato (Don Kanonji)
    p.append('<rect x="1320" y="830" width="70" height="46" fill="#30363f" stroke="#7d848f" stroke-width="1" stroke-dasharray="4 3"/>')
    # Città replica: 4 pilastri di Tenteikūra
    for x, y in [(140, 120), (1460, 120), (140, 760), (1460, 900)]:
        p.append(f'<circle cx="{x}" cy="{y}" r="26" fill="none" stroke="#7fd1ff" stroke-width="1.5" opacity="0.5"/>'
                 f'<rect x="{x - 7}" y="{y - 30}" width="14" height="44" fill="#cfd6df" stroke="#7fd1ff" stroke-width="1.5"/>')
    p.append('<rect x="140" y="120" width="1320" height="780" fill="none" stroke="#7fd1ff" stroke-width="1.2" stroke-dasharray="10 12" opacity="0.35"/>')
    # etichette
    p.append(text(330, 960, "Fiume di Karakura · Karakura River", size=15, fill="#86b3d8", italic=True, opacity=0.85))
    p.append(text(1290, 345, "Collina · Hill", size=13, fill="#8fa684", italic=True, opacity=0.85))
    p.append(text(1250, 438, "linea ferroviaria · railway", size=12, fill="#9aa7b9", italic=True, opacity=0.75))
    p.append(text(800, 990, "contorno tratteggiato: area della Karakura replica (Tenteikūra)", size=12, fill="#7fd1ff", italic=True, opacity=0.6))
    p.append('<g transform="translate(800 52)"><rect x="-200" y="-30" width="400" height="58" rx="8" fill="#0b1018" stroke="#4fb3d9" opacity="0.9"/>')
    p.append(text(0, -2, "KARAKURA · 空座町", size=24, fill="#eaf2fb", spacing=4, weight="bold"))
    p.append(text(0, 18, "pianta concettuale · conceptual plan", size=12, fill="#9fb1c6", italic=True))
    p.append("</g>")
    write("bleach-karakura.svg", p)


# =============================================================================
# 3. SEIREITEI — 1600 × 1000
# =============================================================================
def seireitei():
    W, H = 1600, 1000
    rng = random.Random(13)
    cx, cy, R = 800, 510, 430
    p = svg_open(W, H, "Bleach · Seireitei")
    p.append("""<defs>
<radialGradient id="sbg" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="#4a5236"/><stop offset="1" stop-color="#1f2418"/></radialGradient>
<radialGradient id="city" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#f7f2e4"/><stop offset="1" stop-color="#ddd3bb"/></radialGradient>
<linearGradient id="cliff" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b59a6a"/><stop offset="1" stop-color="#6f5a39"/></linearGradient>
</defs>""")
    p.append(f'<rect width="{W}" height="{H}" fill="url(#sbg)"/>')
    # Rukongai attorno: campi e tetti
    for _ in range(900):
        x, y = rng.uniform(0, W), rng.uniform(0, H)
        if (x - cx) ** 2 + (y - cy) ** 2 < (R + 30) ** 2:
            continue
        p.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(rng.uniform(4, 9))}" height="{f(rng.uniform(3, 6))}" '
                 f'fill="{rng.choice(["#8b7d5e", "#6f6449", "#9c8e6b"])}" opacity="0.8"/>')
    p.append(text(150, 960, "Rukongai", size=22, fill="#d6cba8", italic=True, opacity=0.8))
    p.append(text(1450, 60, "Rukongai", size=22, fill="#d6cba8", italic=True, opacity=0.8))
    # città interna
    p.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#city)"/>')
    # viali radiali e anulari
    p.append(f'<g stroke="#c4b796" fill="none" stroke-width="6">')
    for a in range(0, 360, 30):
        r = math.radians(a)
        p.append(f'<line x1="{cx}" y1="{cy}" x2="{f(cx + math.cos(r) * R)}" y2="{f(cy + math.sin(r) * R)}"/>')
    for rr in (120, 200, 330):
        p.append(f'<circle cx="{cx}" cy="{cy}" r="{rr}"/>')
    p.append("</g>")
    # tetti: file concentriche di edifici bianchi
    p.append(roofs_open("#ece5d4", "#94866c"))
    for ring in range(4, 36):
        rr = ring * 12
        n = int(2 * math.pi * rr / 16)
        for i in range(n):
            if rng.random() < 0.28:
                continue
            a = 2 * math.pi * i / n + ring * 0.13
            x, y = cx + math.cos(a) * rr, cy + math.sin(a) * rr
            if (x - 1090) ** 2 + (y - 190) ** 2 < 120 ** 2:  # Sōkyoku
                continue
            p.append(roof(x, y, rng.uniform(8, 11), rng.uniform(5, 7), math.degrees(a) + 90))
    p.append("</g>")
    # mura di sekkiseki
    p.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="#fffdf6" stroke-width="16"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="#b7ab8e" stroke-width="2"/>')
    # quattro porte
    for a in (0, 90, 180, 270):
        r = math.radians(a)
        gx, gy = cx + math.cos(r) * R, cy + math.sin(r) * R
        p.append(f'<g transform="rotate({a + 90} {f(gx)} {f(gy)})"><rect x="{f(gx - 26)}" y="{f(gy - 14)}" width="52" height="28" '
                 f'fill="#5d4f3a" stroke="#fffdf6" stroke-width="2"/><line x1="{f(gx)}" y1="{f(gy - 14)}" x2="{f(gx)}" y2="{f(gy + 14)}" '
                 f'stroke="#fffdf6" stroke-width="1.5"/></g>')
    # Torre della Prima Divisione al centro
    p.append(f'<circle cx="{cx}" cy="{cy - 40}" r="36" fill="#e2d6bb" stroke="#6d5d43" stroke-width="2"/>'
             f'<rect x="{cx - 14}" y="{cy - 54}" width="28" height="28" fill="#6d5d43"/>')
    # Collina del Sōkyoku (mesa rocciosa) + alabarda
    p.append(f'<path d="{blob(1090, 190, 105, 70, rng, 24, 0.1)}" fill="url(#cliff)" stroke="#5a4729" stroke-width="2"/>')
    p.append(f'<path d="{blob(1090, 180, 60, 36, rng, 18, 0.06)}" fill="#c9ae7c" stroke="#7d6640" stroke-width="1.2"/>')
    p.append('<g stroke="#3d2f1c" stroke-width="3" fill="none"><line x1="1074" y1="150" x2="1074" y2="206"/><line x1="1106" y1="150" x2="1106" y2="206"/>'
             '<line x1="1066" y1="156" x2="1114" y2="156"/></g>'
             '<path d="M1090,158 l-6,30 l6,8 l6,-8 Z" fill="#d8d2c2" stroke="#3d2f1c"/>')
    # Senzaikyū: torre bianca + lungo ponte verso il Sōkyoku
    p.append('<line x1="980" y1="215" x2="1050" y2="196" stroke="#efe8d6" stroke-width="5"/>'
             '<line x1="980" y1="215" x2="1050" y2="196" stroke="#8a7c62" stroke-width="1"/>')
    p.append('<rect x="966" y="196" width="28" height="40" fill="#fbf8ef" stroke="#7d6f55" stroke-width="2"/>'
             '<rect x="975" y="206" width="10" height="10" fill="#3e352a"/>')
    # Central 46: recinto scuro
    p.append('<rect x="550" y="151" width="100" height="78" fill="#4a4237" stroke="#efe6cf" stroke-width="3"/>'
             '<rect x="570" y="168" width="60" height="44" fill="#6b5f4e" stroke="#c9bb9c" stroke-width="1"/>')
    # Muken: pozzo
    p.append('<circle cx="500" cy="250" r="15" fill="#15120e" stroke="#7d6f55" stroke-width="2"/>'
             '<circle cx="500" cy="250" r="7" fill="#000"/>')
    # Villa Kuchiki: giardino con laghetto
    p.append(f'<path d="{blob(640, 820, 62, 40, rng, 18, 0.06)}" fill="#55704a" stroke="#efe6cf" stroke-width="2"/>'
             f'<path d="{blob(625, 828, 22, 12, rng, 12, 0.1)}" fill="#3f6f99"/>'
             '<rect x="650" y="804" width="28" height="18" fill="#e9e1cd" stroke="#6d5d43"/>')
    # Accademia Shin'ō: cortile quadrato
    p.append('<rect x="960" y="820" width="84" height="64" fill="#e9e1cd" stroke="#6d5d43" stroke-width="2"/>'
             '<rect x="980" y="836" width="44" height="32" fill="#8c9a6c"/>')
    # Senkaimon principale
    p.append('<g stroke="#4b3c27" stroke-width="4" fill="none"><line x1="1180" y1="620" x2="1180" y2="660"/><line x1="1200" y1="620" x2="1200" y2="660"/>'
             '<line x1="1172" y1="620" x2="1208" y2="620"/></g>'
             '<rect x="1183" y="624" width="14" height="36" fill="#6b3fa0" opacity="0.6"/>')
    # Ombre del Wandenreich (Schatten Bereich) a sud del centro
    p.append(f'<path d="{blob(730, 615, 70, 34, rng, 20, 0.15)}" fill="#0f1a2c" opacity="0.35"/>')
    for i in range(5):
        a = math.radians(i * 72 - 90)
        x1, y1 = 730 + math.cos(a) * 18, 615 + math.sin(a) * 18
        p.append(f'<line x1="730" y1="615" x2="{f(x1)}" y2="{f(y1)}" stroke="#2c4a78" stroke-width="2" opacity="0.6"/>')
    # numeri delle Divisioni (posizioni indicative)
    divs = division_positions()
    for n, (x, y) in divs.items():
        p.append(f'<rect x="{f(x - 26)}" y="{f(y - 18)}" width="52" height="36" rx="3" fill="#e2d6bb" stroke="#6d5d43" stroke-width="1.5"/>')
    # cartiglio
    p.append('<g transform="translate(200 70)"><rect x="-170" y="-34" width="340" height="66" rx="8" fill="#14120d" stroke="#d9c79a" opacity="0.92"/>')
    p.append(text(0, -6, "SEIREITEI · 瀞霊廷", size=24, fill="#f5ecd5", spacing=4, weight="bold"))
    p.append(text(0, 16, "mura di sekkiseki · posizioni indicative", size=12, fill="#bcae8b", italic=True))
    p.append("</g>")
    write("bleach-seireitei.svg", p)


def division_positions():
    """Centro delle 13 caserme sulla sotto-mappa del Seireitei (stesse coord. dei pin)."""
    cx, cy, r = 800, 510, 280
    pos = {1: (800, 470)}
    # Due archi laterali (destra 2-7, sinistra 8-13): niente caserme in cima e
    # in fondo, dove le etichette dei pin finirebbero una sopra l'altra.
    angles = {2: -60, 3: -35, 4: -10, 5: 15, 6: 40, 7: 65, 8: 120, 9: 145, 10: 170, 11: 195, 12: 220, 13: 245}
    for n, a in angles.items():
        ra = math.radians(a)
        pos[n] = (round(cx + math.cos(ra) * r), round(cy + math.sin(ra) * r))
    return pos


# =============================================================================
# 4. HUECO MUNDO — 1600 × 1000
# =============================================================================
def hueco_mundo():
    W, H = 1600, 1000
    rng = random.Random(17)
    p = svg_open(W, H, "Bleach · Hueco Mundo")
    p.append("""<defs>
<linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#010103"/><stop offset="0.55" stop-color="#0d0f19"/><stop offset="1" stop-color="#1c1f2c"/></linearGradient>
<linearGradient id="hsand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ebe8df"/><stop offset="1" stop-color="#b6b1a3"/></linearGradient>
<radialGradient id="inner" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#7fb6e6"/><stop offset="0.7" stop-color="#4a7fb6"/><stop offset="1" stop-color="#2d5a8a"/></radialGradient>
<radialGradient id="hmoon" cx="40%" cy="40%" r="60%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#cdd2dc"/></radialGradient>
</defs>""")
    p.append(f'<rect width="{W}" height="{H}" fill="url(#hsky)"/>')
    p += stars(rng, W, 420, 260)
    p.append('<circle cx="1430" cy="140" r="70" fill="url(#hmoon)"/><circle cx="1462" cy="118" r="66" fill="#020205"/>')
    # dune
    d = "M0,330 "
    for x in range(0, W + 1, 80):
        d += f"Q{x + 40},{f(300 + rng.uniform(-30, 20))} {x + 80},{f(330 + rng.uniform(-10, 10))} "
    d += f"L{W},{H} L0,{H} Z"
    p.append(f'<path d="{d}" fill="url(#hsand)"/>')
    for i in range(10):
        y = 380 + i * 62
        p.append(f'<path d="M0,{y} C300,{y - 30} 700,{y + 26} 1000,{y - 8} S1450,{y - 30} 1600,{y}" fill="none" stroke="#9f9a8b" stroke-width="1.2" opacity="0.55"/>')
    # alberi di quarzo
    for _ in range(60):
        x, y = rng.uniform(20, W - 20), rng.uniform(360, 980)
        if (x - 900) ** 2 / 420 ** 2 + (y - 560) ** 2 / 320 ** 2 < 1:
            continue
        h = rng.uniform(18, 40)
        p.append(f'<path d="M{f(x)},{f(y)} l0,-{f(h)} m0,{f(h * 0.45)} l-{f(h * 0.35)},-{f(h * 0.4)} m{f(h * 0.35)},{f(h * 0.12)} '
                 f'l{f(h * 0.3)},-{f(h * 0.42)}" stroke="#e1e3e8" stroke-width="2" fill="none" opacity="0.9"/>')
    # Garganta (lato Hueco Mundo)
    p.append('<path d="M100,230 L118,250 L108,272 L130,290 L112,316 L126,336 L104,350 L92,326 L80,300 L96,276 L84,252 Z" fill="#000" stroke="#5d6a8c" stroke-width="2"/>')
    # Las Noches: cupola esterna + cielo artificiale interno
    p.append('<ellipse cx="900" cy="575" rx="410" ry="300" fill="#f6f3ea" stroke="#ffffff" stroke-width="4"/>')
    p.append('<ellipse cx="900" cy="575" rx="380" ry="275" fill="url(#inner)" opacity="0.85"/>')
    p.append('<ellipse cx="900" cy="700" rx="370" ry="140" fill="#e8e3d6" opacity="0.95"/>')  # sabbia interna
    for i in range(8):
        a = math.radians(i * 45)
        p.append(f'<line x1="900" y1="575" x2="{f(900 + math.cos(a) * 380)}" y2="{f(575 + math.sin(a) * 275)}" stroke="#ffffff" stroke-width="1.2" opacity="0.35"/>')
    # torri e palazzi
    towers = [(760, 360, 150), (1060, 430, 120), (640, 680, 90), (1150, 650, 100), (600, 470, 70), (900, 520, 180)]
    for x, y, h in towers:
        p.append(f'<rect x="{x - 14}" y="{y - h / 2}" width="28" height="{h}" fill="#f3efe5" stroke="#9c9688" stroke-width="1.5"/>')
        p.append(f'<rect x="{x - 20}" y="{y - h / 2 - 8}" width="40" height="10" fill="#d9d3c4" stroke="#9c9688" stroke-width="1"/>')
    # palazzo centrale (sala del trono)
    p.append('<rect x="850" y="545" width="100" height="70" fill="#f8f5ee" stroke="#8c8678" stroke-width="2"/>'
             '<path d="M840,545 L900,505 L960,545 Z" fill="#e8e3d6" stroke="#8c8678" stroke-width="2"/>')
    # pilastri dell'arena di Grimmjow
    for i in range(7):
        x = 1030 + (i % 4) * 22
        y = 395 + (i // 4) * 30
        p.append(f'<rect x="{x}" y="{y}" width="8" height="34" fill="#efeadf" stroke="#8c8678" stroke-width="0.8"/>')
    # cupola: profilo forte
    p.append('<ellipse cx="900" cy="575" rx="410" ry="300" fill="none" stroke="#ffffff" stroke-width="5"/>')
    p.append('<path d="M500,575 L540,575 M1260,575 L1300,575" stroke="#5d5a52" stroke-width="10"/>')  # porta ovest/est
    # accampamento del Wandenreich (Guerra dei Mille Anni)
    for i in range(6):
        x, y = 1380 + (i % 3) * 34, 690 + (i // 3) * 30
        p.append(f'<path d="M{x},{y} l14,-20 l14,20 Z" fill="#dfe6f1" stroke="#2c4a78" stroke-width="1.5"/>')
    p.append('<path d="M1430,640 l0,-30 l24,8 l-24,8" fill="#2c4a78" stroke="#dfe6f1"/>')
    # etichette
    p.append(text(900, 960, "LAS NOCHES · 虚夜宮", size=26, fill="#2f3340", spacing=5, weight="bold"))
    p.append(text(260, 880, "Deserto · Desert", size=16, fill="#5f5b50", italic=True))
    p.append('<g transform="translate(240 60)"><rect x="-200" y="-34" width="400" height="66" rx="8" fill="#0b0c12" stroke="#c9d1d9" opacity="0.92"/>')
    p.append(text(0, -6, "HUECO MUNDO · 虚圏", size=24, fill="#f1f2f6", spacing=4, weight="bold"))
    p.append(text(0, 16, "schema concettuale · posizioni indicative", size=12, fill="#9ea3b5", italic=True))
    p.append("</g>")
    write("bleach-hueco-mundo.svg", p)


# =============================================================================
# 5. REIŌKYŪ — 1400 × 1000
# =============================================================================
def reiokyu():
    W, H = 1400, 1000
    rng = random.Random(19)
    p = svg_open(W, H, "Bleach · Reiōkyū")
    p.append("""<defs>
<linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a4a"/><stop offset="0.5" stop-color="#6b5d86"/><stop offset="1" stop-color="#d9b88a"/></linearGradient>
<radialGradient id="rgold" cx="50%" cy="35%" r="65%"><stop offset="0" stop-color="#fff5cf"/><stop offset="1" stop-color="#c49a3e"/></radialGradient>
<radialGradient id="aura" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff3c4" stop-opacity="0.55"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>
</defs>""")
    p.append(f'<rect width="{W}" height="{H}" fill="url(#rsky)"/>')
    p += stars(rng, W, 350, 120)
    for _ in range(14):  # nuvole
        x, y = rng.uniform(0, W), rng.uniform(500, 1000)
        p.append(f'<path d="{blob(x, y, rng.uniform(80, 160), rng.uniform(18, 30), rng, 16, 0.2)}" fill="#f6e9d3" opacity="0.25"/>')

    def disc(x, y, r, name_it):
        out = [f'<ellipse cx="{x}" cy="{y + 18}" rx="{r}" ry="{f(r * 0.32)}" fill="#5d4718"/>',
               f'<path d="M{x - r},{y + 4} L{x},{y + r * 0.9} L{x + r},{y + 4} Z" fill="#6d5a3c" opacity="0.85"/>',
               f'<ellipse cx="{x}" cy="{y}" rx="{r}" ry="{f(r * 0.32)}" fill="url(#rgold)" stroke="#fff3c4" stroke-width="2"/>']
        out.append(roofs_open("#f7ecd0", "#8a6d2a"))
        for _ in range(16):
            a = rng.uniform(0, 2 * math.pi)
            rr = rng.uniform(0.15, 0.8)
            bx, by = x + math.cos(a) * r * rr, y + math.sin(a) * r * 0.32 * rr
            out.append(roof(bx, by - 5, rng.uniform(10, 16), rng.uniform(6, 9)))
        out.append("</g>")
        out.append(text(x, y + r * 0.32 + 34, name_it, size=14, fill="#2b2112", italic=True, opacity=0.8))
        return out

    p.append('<circle cx="700" cy="250" r="230" fill="url(#aura)"/>')
    p.append('<line x1="700" y1="380" x2="700" y2="1000" stroke="#fff3c4" stroke-width="2" stroke-dasharray="4 10" opacity="0.5"/>')
    p += disc(300, 380, 150, "Kirinden · 麒麟殿")
    p += disc(1100, 380, 150, "")
    p += disc(470, 640, 140, "Gatonden · 臥豚殿")
    p += disc(930, 640, 140, "Hōōden · 鳳凰殿")
    p += disc(700, 840, 130, "")
    # sorgenti termali di Kirinden
    p.append('<ellipse cx="270" cy="380" rx="40" ry="10" fill="#c0392b" opacity="0.7"/><ellipse cx="335" cy="372" rx="30" ry="8" fill="#5dade2" opacity="0.8"/>')
    # dojo in cima alle scale (Ichibē)
    for i in range(8):
        p.append(f'<rect x="{676 + i * 2}" y="{846 - i * 7}" width="{48 - i * 4}" height="5" fill="#d6c08e" stroke="#7d6431" stroke-width="0.6"/>')
    # palazzo del Re delle Anime: bozzolo sospeso
    p.append('<ellipse cx="700" cy="250" rx="86" ry="130" fill="url(#rgold)" stroke="#fff8de" stroke-width="3"/>')
    for k in range(1, 5):
        p.append(f'<path d="M{700 - 86 + k * 6},{250 - 40 + k * 30} Q700,{250 + k * 30} {700 + 86 - k * 6},{250 - 40 + k * 30}" fill="none" stroke="#a37d2c" stroke-width="1.2" opacity="0.7"/>')
    p.append('<g transform="translate(1180 70)"><rect x="-190" y="-34" width="380" height="66" rx="8" fill="#1c1626" stroke="#e8c96a" opacity="0.92"/>')
    p.append(text(0, -6, "REIŌKYŪ · 霊王宮", size=24, fill="#fbefc6", spacing=4, weight="bold"))
    p.append(text(0, 16, "Palazzo del Re · Soul King Palace", size=12, fill="#cdb98a", italic=True))
    p.append("</g>")
    write("bleach-reiokyu.svg", p)


if __name__ == "__main__":
    print("Bleach · mappe SVG originali →", os.path.normpath(OUT))
    three_worlds()
    karakura()
    seireitei()
    hueco_mundo()
    reiokyu()
