"""Toolkit condiviso per le mappe SVG ORIGINALI di AniMapVerse.

Le sotto-mappe che non hanno una mappa ufficiale (o di cui non esiste un'immagine
con licenza utilizzabile) sono RICOSTRUITE da zero, in geometria originale, a
partire da ciò che le opere mostrano e raccontano. Questo modulo fornisce i mattoni
comuni (coste organiche, mare, foreste, montagne, edifici in prospettiva,
etichette, cartigli, rose dei venti) e i pin: ogni mappa dichiara la posizione dei
suoi luoghi e `apply_pins` la riscrive nei file dati, così pin e disegno restano
sempre allineati.

Tutto è DETERMINISTICO (random con seme fisso): rieseguire uno script produce
file identici.
"""
from __future__ import annotations

import math
import os
import random
import re
import zlib
from dataclasses import dataclass, field

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

SERIF = "Georgia, 'Times New Roman', serif"
SANS = "'Helvetica Neue', Arial, sans-serif"
JP = "'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif CJK JP', 'Noto Serif JP', serif"
DISPLAY = "'Trebuchet MS', 'Arial Black', Arial, sans-serif"

Pt = tuple[float, float]


def f(v: float) -> str:
    """Numero compatto (max 1 decimale) per tenere leggeri i file."""
    s = f"{v:.1f}"
    if s == "-0.0":
        return "0"
    return s[:-2] if s.endswith(".0") else s


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


# =============================================================================
# Documento
# =============================================================================
@dataclass
class Svg:
    w: int
    h: int
    title: str
    credit: str = "Ricostruzione originale AniMapVerse · CC0 · non è materiale ufficiale"
    defs: list[str] = field(default_factory=list)
    parts: list[str] = field(default_factory=list)

    def add(self, *items: str | list[str]) -> None:
        for it in items:
            if isinstance(it, list):
                self.parts.extend(it)
            else:
                self.parts.append(it)

    def gradient(self, gid: str, stops: list[tuple[float, str]] | list[tuple[float, str, float]],
                 kind: str = "linear", attrs: str = 'x1="0" y1="0" x2="0" y2="1"') -> str:
        ss = []
        for s in stops:
            op = f' stop-opacity="{s[2]}"' if len(s) > 2 else ""
            ss.append(f'<stop offset="{s[0]}" stop-color="{s[1]}"{op}/>')
        tag = "linearGradient" if kind == "linear" else "radialGradient"
        self.defs.append(f'<{tag} id="{gid}" {attrs}>{"".join(ss)}</{tag}>')
        return f"url(#{gid})"

    def save(self, path: str) -> None:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        head = [
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" '
            f'viewBox="0 0 {self.w} {self.h}">',
            f"<title>{esc(self.title)}</title>",
            f"<!-- {self.credit} -->",
        ]
        if self.defs:
            head.append("<defs>" + "".join(self.defs) + "</defs>")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write("\n".join(head + self.parts) + "\n</svg>\n")
        print(f"  {os.path.relpath(path, ROOT)}  {os.path.getsize(path) / 1024:.0f} KB")
        self.path = path


# =============================================================================
# Geometria
# =============================================================================
def ellipse_pts(cx, cy, rx, ry, n=24, rng: random.Random | None = None, jitter=0.0, rot=0.0) -> list[Pt]:
    pts = []
    cr, sr = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    for i in range(n):
        a = 2 * math.pi * i / n
        k = 1 + (rng.uniform(-jitter, jitter) if rng and jitter else 0)
        x, y = math.cos(a) * rx * k, math.sin(a) * ry * k
        pts.append((cx + x * cr - y * sr, cy + x * sr + y * cr))
    return pts


def jagged(pts: list[Pt], rng: random.Random, rough=0.16, levels=3, closed=True) -> list[Pt]:
    """Spostamento del punto medio: rende 'naturale' un poligono di controllo."""
    out = list(pts)
    amp = rough
    for _ in range(levels):
        nxt: list[Pt] = []
        n = len(out)
        rng_n = n if closed else n - 1
        for i in range(rng_n):
            a, b = out[i], out[(i + 1) % n]
            nxt.append(a)
            dx, dy = b[0] - a[0], b[1] - a[1]
            ln = math.hypot(dx, dy) or 1
            d = rng.gauss(0, amp) * ln
            nxt.append(((a[0] + b[0]) / 2 - dy / ln * d, (a[1] + b[1]) / 2 + dx / ln * d))
        if not closed:
            nxt.append(out[-1])
        out = nxt
        amp *= 0.55
    return out


def smooth(pts: list[Pt], closed=True, tension=1.0) -> str:
    """Catmull-Rom → Bézier cubiche."""
    n = len(pts)
    if n < 3:
        return "M" + " L".join(f"{f(x)},{f(y)}" for x, y in pts)
    d = [f"M{f(pts[0][0])},{f(pts[0][1])}"]
    rng_n = n if closed else n - 1
    for i in range(rng_n):
        p0 = pts[(i - 1) % n] if closed or i > 0 else pts[0]
        p1 = pts[i]
        p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n] if closed or i + 2 < n else pts[-1]
        t = tension / 6
        c1 = (p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t)
        c2 = (p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t)
        d.append(f"C{f(c1[0])},{f(c1[1])} {f(c2[0])},{f(c2[1])} {f(p2[0])},{f(p2[1])}")
    if closed:
        d.append("Z")
    return " ".join(d)


def poly(pts: list[Pt], closed=True) -> str:
    s = "M" + " L".join(f"{f(x)},{f(y)}" for x, y in pts)
    return s + (" Z" if closed else "")


def pip(x: float, y: float, pts: list[Pt]) -> bool:
    """Punto nel poligono (ray casting)."""
    inside = False
    n = len(pts)
    j = n - 1
    for i in range(n):
        xi, yi = pts[i]
        xj, yj = pts[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-9) + xi:
            inside = not inside
        j = i
    return inside


def scale_pts(pts: list[Pt], k: float, c: Pt | None = None) -> list[Pt]:
    if c is None:
        c = (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))
    return [(c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k) for x, y in pts]


def scatter(rng: random.Random, n: int, box: tuple[float, float, float, float], ok=None,
            mind: float = 0.0, tries: int = 30) -> list[Pt]:
    """Punti casuali in un riquadro (x0,y0,x1,y1), filtrati da `ok`, con distanza minima."""
    x0, y0, x1, y1 = box
    out: list[Pt] = []
    cell = mind if mind > 0 else 1
    grid: dict[tuple[int, int], list[Pt]] = {}
    attempts = 0
    while len(out) < n and attempts < n * tries:
        attempts += 1
        x, y = rng.uniform(x0, x1), rng.uniform(y0, y1)
        if ok and not ok(x, y):
            continue
        if mind > 0:
            gx, gy = int(x // cell), int(y // cell)
            bad = False
            for ix in (gx - 1, gx, gx + 1):
                for iy in (gy - 1, gy, gy + 1):
                    for q in grid.get((ix, iy), ()):
                        if (q[0] - x) ** 2 + (q[1] - y) ** 2 < mind * mind:
                            bad = True
                            break
                    if bad:
                        break
                if bad:
                    break
            if bad:
                continue
            grid.setdefault((gx, gy), []).append((x, y))
        out.append((x, y))
    return out


def far_from(points: list[Pt], d: float):
    """Predicato: il punto è lontano almeno `d` da tutti i `points` (per non coprire i pin)."""
    def ok(x, y):
        return all((x - px) ** 2 + (y - py) ** 2 >= d * d for px, py in points)
    return ok


def both(*preds):
    def ok(x, y):
        return all(p(x, y) for p in preds)
    return ok


# =============================================================================
# Testo, etichette, cartigli
# =============================================================================
def text(x, y, s, size=20, fill="#fff", anchor="middle", family=SERIF, weight="normal",
         spacing=0, opacity=1.0, italic=False, halo: str | None = None, halo_w=4, rot=0.0) -> str:
    st = ' font-style="italic"' if italic else ""
    ls = f' letter-spacing="{spacing}"' if spacing else ""
    op = f' opacity="{opacity}"' if opacity != 1 else ""
    hl = (f' stroke="{halo}" stroke-width="{halo_w}" stroke-linejoin="round" paint-order="stroke"'
          if halo else "")
    tr = f' transform="rotate({f(rot)} {f(x)} {f(y)})"' if rot else ""
    return (f'<text x="{f(x)}" y="{f(y)}" font-family="{family}" font-size="{f(size)}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{ls}{st}{op}{hl}{tr}>{esc(s)}</text>')


def curved_text(svg: Svg, pid: str, pts: list[Pt], s: str, size=20, fill="#fff", family=SERIF,
                spacing=4, halo: str | None = None, italic=True, weight="normal") -> str:
    """Testo lungo una curva (fiumi, catene montuose, mari)."""
    svg.defs.append(f'<path id="{pid}" d="{smooth(pts, closed=False)}"/>')
    hl = (f' stroke="{halo}" stroke-width="4" stroke-linejoin="round" paint-order="stroke"' if halo else "")
    st = ' font-style="italic"' if italic else ""
    return (f'<text font-family="{family}" font-size="{f(size)}" fill="{fill}" letter-spacing="{spacing}" '
            f'font-weight="{weight}"{st}{hl}><textPath href="#{pid}" startOffset="50%" text-anchor="middle">'
            f"{esc(s)}</textPath></text>")


def region_label(x, y, main, sub=None, jp=None, size=30, color="#3b2f1e", sub_color=None,
                 halo="#f4ead2", family=SERIF, spacing=5, rot=0.0) -> list[str]:
    sub_color = sub_color or color
    out = [text(x, y, main.upper(), size=size, fill=color, spacing=spacing, weight="bold",
                family=family, halo=halo, halo_w=size * 0.22, rot=rot)]
    dy = size * 0.95
    if jp:
        out.append(text(x, y + dy, jp, size=size * 0.6, fill=sub_color, family=JP, spacing=3,
                        halo=halo, halo_w=3, rot=rot, opacity=0.9))
        dy += size * 0.72
    if sub:
        out.append(text(x, y + dy, sub, size=size * 0.45, fill=sub_color, italic=True, family=family,
                        halo=halo, halo_w=3, rot=rot, opacity=0.9))
    return out


def ribbon(x, y, w, s, size=34, fill="#e9dcc0", stroke="#5a4630", ink="#3a2a18", family=SERIF,
           sub: str | None = None) -> list[str]:
    """Nastro-titolo stile 'mappa d'avventura' (One Piece, Black Clover)."""
    est = max(len(s) * size * 0.62, len(sub) * size * 0.45 * 0.56 if sub else 0)
    w = max(w, est + 70)
    h = size * 1.55 + (size * 0.6 if sub else 0)
    x0, x1, y0, y1 = x - w / 2, x + w / 2, y - h / 2, y + h / 2
    tail = h * 0.55
    out = [f'<g stroke="{stroke}" stroke-width="3" stroke-linejoin="round">']
    # code del nastro
    for side in (-1, 1):
        ex = x0 if side < 0 else x1
        out.append(
            f'<path d="M{f(ex)},{f(y0 + h * 0.25)} L{f(ex + side * tail)},{f(y0 + h * 0.25)} '
            f'L{f(ex + side * tail * 0.6)},{f(y + h * 0.38)} L{f(ex + side * tail)},{f(y1 + h * 0.25)} '
            f'L{f(ex)},{f(y1 + h * 0.25)} Z" fill="{shade(fill, -0.18)}"/>')
    out.append(
        f'<path d="M{f(x0)},{f(y0)} Q{f(x)},{f(y0 - h * 0.18)} {f(x1)},{f(y0)} L{f(x1)},{f(y1)} '
        f'Q{f(x)},{f(y1 - h * 0.18)} {f(x0)},{f(y1)} Z" fill="{fill}"/>')
    out.append("</g>")
    ty = y + size * 0.33 - (size * 0.3 if sub else 0) - h * 0.05
    out.append(text(x, ty, s, size=size, fill=ink, family=family, weight="bold", spacing=3))
    if sub:
        out.append(text(x, ty + size * 0.72, sub, size=size * 0.45, fill=ink, family=family,
                        italic=True, spacing=2, opacity=0.85))
    return out


def plaque(x, y, w, h, s, sub=None, fill="#1d2433", stroke="#c9a85a", ink="#f4e6c2",
           size=30, family=SERIF, jp: str | None = None) -> list[str]:
    """Cartiglio rettangolare con doppia cornice."""
    out = [
        f'<rect x="{f(x - w / 2)}" y="{f(y - h / 2)}" width="{f(w)}" height="{f(h)}" rx="6" fill="{fill}" '
        f'fill-opacity="0.92" stroke="{stroke}" stroke-width="3"/>',
        f'<rect x="{f(x - w / 2 + 6)}" y="{f(y - h / 2 + 6)}" width="{f(w - 12)}" height="{f(h - 12)}" rx="3" '
        f'fill="none" stroke="{stroke}" stroke-width="1" opacity="0.7"/>',
    ]
    lines = [(s, size, "bold", False, family)]
    if jp:
        lines.append((jp, size * 0.55, "normal", False, JP))
    if sub:
        lines.append((sub, size * 0.42, "normal", True, family))
    total = sum(l[1] * 1.15 for l in lines)
    cy = y - total / 2 + lines[0][1] * 0.9
    for txt, sz, wt, it, fam in lines:
        out.append(text(x, cy, txt, size=sz, fill=ink, family=fam, weight=wt, italic=it,
                        spacing=3 if wt == "bold" else 1))
        cy += sz * 1.2
    return out


def compass(x, y, r=46, ink="#3b2f1e", fill="#f4ead2", accent="#a33b2b", letters=True) -> list[str]:
    out = [f'<g stroke="{ink}" stroke-width="1.4" stroke-linejoin="round">',
           f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r * 0.72)}" fill="{fill}" fill-opacity="0.75"/>',
           f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r * 0.6)}" fill="none" stroke-dasharray="2 3"/>']
    for k, a in enumerate(range(0, 360, 45)):
        long = k % 2 == 0
        rr = r if long else r * 0.62
        w = r * (0.16 if long else 0.12)
        ang = math.radians(a - 90)
        tip = (x + math.cos(ang) * rr, y + math.sin(ang) * rr)
        l = (x + math.cos(ang - math.pi / 2) * w, y + math.sin(ang - math.pi / 2) * w)
        rgt = (x + math.cos(ang + math.pi / 2) * w, y + math.sin(ang + math.pi / 2) * w)
        c1 = accent if a == 0 else ink
        out.append(f'<path d="{poly([(x, y), l, tip])}" fill="{fill}"/>')
        out.append(f'<path d="{poly([(x, y), rgt, tip])}" fill="{c1}"/>')
    out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r * 0.08)}" fill="{ink}"/>')
    out.append("</g>")
    if letters:
        out.append(text(x, y - r - 6, "N", size=r * 0.42, fill=ink, weight="bold", halo=fill, halo_w=3))
    return out


def scale_bar(x, y, length, label, ink="#3b2f1e", halo="#f4ead2") -> list[str]:
    seg = length / 4
    out = [f'<g stroke="{ink}" stroke-width="1.2">']
    for i in range(4):
        out.append(f'<rect x="{f(x + i * seg)}" y="{f(y)}" width="{f(seg)}" height="6" '
                   f'fill="{ink if i % 2 == 0 else halo}"/>')
    out.append("</g>")
    out.append(text(x + length / 2, y + 22, label, size=13, fill=ink, italic=True, halo=halo, halo_w=3))
    return out


# =============================================================================
# Colori
# =============================================================================
def _hex(c: str) -> tuple[int, int, int]:
    c = c.lstrip("#")
    return int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16)


def shade(c: str, k: float) -> str:
    """k<0 scurisce, k>0 schiarisce."""
    r, g, b = _hex(c)
    if k < 0:
        r, g, b = (int(v * (1 + k)) for v in (r, g, b))
    else:
        r, g, b = (int(v + (255 - v) * k) for v in (r, g, b))
    return f"#{max(0, min(255, r)):02x}{max(0, min(255, g)):02x}{max(0, min(255, b)):02x}"


def mix(a: str, b: str, t: float) -> str:
    ra, ga, ba = _hex(a)
    rb, gb, bb = _hex(b)
    return f"#{int(ra + (rb - ra) * t):02x}{int(ga + (gb - ga) * t):02x}{int(ba + (bb - ba) * t):02x}"


# =============================================================================
# Terreno
# =============================================================================
def sea(svg: Svg, top: str, bottom: str, wave: str, rng: random.Random, land: list[list[Pt]] | None = None,
        n=260, wave_w=18, opacity=0.55, margin=26.0) -> None:
    g = svg.gradient("seaG", [(0, top), (1, bottom)])
    svg.add(f'<rect width="{svg.w}" height="{svg.h}" fill="{g}"/>')
    land = land or []

    def ok(x, y):
        for pts in land:
            if pip(x, y, scale_pts(pts, 1.0)) or near_poly(x, y, pts, margin):
                return False
        return True

    pts = scatter(rng, n, (10, 10, svg.w - 10, svg.h - 10), ok, mind=wave_w * 1.7)
    out = [f'<g fill="none" stroke="{wave}" stroke-width="2" stroke-linecap="round" opacity="{opacity}">']
    for x, y in pts:
        w = wave_w * rng.uniform(0.7, 1.3)
        out.append(f'<path d="M{f(x - w)},{f(y)} q{f(w / 2)},{f(-w * 0.45)} {f(w)},0 '
                   f'q{f(w / 2)},{f(w * 0.45)} {f(w)},0"/>')
    out.append("</g>")
    svg.add(out)


def near_poly(x, y, pts: list[Pt], d: float) -> bool:
    d2 = d * d
    n = len(pts)
    for i in range(n):
        ax, ay = pts[i]
        bx, by = pts[(i + 1) % n]
        dx, dy = bx - ax, by - ay
        L = dx * dx + dy * dy or 1e-9
        t = max(0, min(1, ((x - ax) * dx + (y - ay) * dy) / L))
        px, py = ax + t * dx, ay + t * dy
        if (x - px) ** 2 + (y - py) ** 2 < d2:
            return True
    return False


def island(svg: Svg, pts: list[Pt], fill: str, stroke="#2b2418", shallow="#9fd3e6", beach="#e9d9a6",
           shallow_w=26, beach_w=9, stroke_w=3.0, fill_attr: str | None = None) -> str:
    """Isola: alone di acqua bassa, spiaggia, terra con contorno. Ritorna il path `d`."""
    d = smooth(pts)
    if shallow:
        svg.add(f'<path d="{d}" fill="{shallow}" stroke="{shallow}" stroke-width="{shallow_w}" '
                f'stroke-linejoin="round" opacity="0.75"/>')
    if beach:
        svg.add(f'<path d="{d}" fill="{beach}" stroke="{beach}" stroke-width="{beach_w}" stroke-linejoin="round"/>')
    svg.add(f'<path d="{d}" fill="{fill_attr or fill}" stroke="{stroke}" stroke-width="{f(stroke_w)}" '
            f'stroke-linejoin="round"/>')
    return d


def patch(pts: list[Pt], fill: str, opacity=1.0, stroke: str | None = None, sw=1.5) -> str:
    st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    op = f' opacity="{opacity}"' if opacity != 1 else ""
    return f'<path d="{smooth(pts)}" fill="{fill}"{st}{op}/>'


_SYMS: dict[int, set[str]] = {}


def tree_symbols(svg: Svg, r: float, fill: str, dark: str, light: str, stroke: str, sw: float, kind: str) -> list[str]:
    """Registra (una volta per documento) 3 varianti di albero come <symbol> e ne ritorna gli id."""
    key = f"{kind}{r:.0f}{fill}{dark}{light}{stroke}{sw}"
    sid = "t" + format(zlib.crc32(key.encode()), "x")
    done = _SYMS.setdefault(id(svg), set())
    ids = [f"{sid}{i}" for i in range(3)]
    if sid not in done:
        done.add(sid)
        for i, k in enumerate((0.82, 1.0, 1.18)):
            body = trees([(0.0, 0.0)], random.Random(0), r * k, fill, dark, light, stroke, sw, kind, jitter=False)
            svg.defs.append(f'<symbol id="{ids[i]}" overflow="visible">{"".join(body)}</symbol>')
    return ids


def wood(svg: Svg, points: list[Pt], rng: random.Random, r=9.0, fill="#4f8a3c", dark="#2f5a26",
         light="#7fb85a", stroke="#1f3a18", sw=1.0, kind="round") -> list[str]:
    """Come `trees` ma con <use> su simboli condivisi: file molto più leggeri per foreste fitte."""
    ids = tree_symbols(svg, r, fill, dark, light, stroke, sw, kind)
    out = ["<g>"]
    for x, y in sorted(points, key=lambda p: p[1]):
        out.append(f'<use href="#{rng.choice(ids)}" x="{f(x)}" y="{f(y)}"/>')
    out.append("</g>")
    return out


def trees(points: list[Pt], rng: random.Random, r=9.0, fill="#4f8a3c", dark="#2f5a26", light="#7fb85a",
          stroke="#1f3a18", sw=1.0, kind="round", jitter=True) -> list[str]:
    """Alberi in prospettiva: ombra, chioma, riflesso. `kind`: round | pine | palm | dead."""
    pts = sorted(points, key=lambda p: p[1])
    out = [f'<g stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round">']
    for x, y in pts:
        rr = r * rng.uniform(0.8, 1.2) if jitter else r
        if kind == "pine":
            h = rr * 2.6
            out.append(f'<path d="M{f(x)},{f(y - h)} L{f(x + rr)},{f(y)} L{f(x - rr)},{f(y)} Z" fill="{fill}"/>')
            out.append(f'<path d="M{f(x)},{f(y - h)} L{f(x + rr)},{f(y)} L{f(x)},{f(y)} Z" fill="{dark}" stroke="none"/>')
        elif kind == "palm":
            out.append(f'<path d="M{f(x)},{f(y)} q{f(rr * 0.3)},{f(-rr)} 0,{f(-rr * 1.8)}" fill="none" '
                       f'stroke="#7a5a32" stroke-width="2.4"/>')
            for a in (-150, -110, -70, -30):
                ang = math.radians(a)
                out.append(f'<path d="M{f(x)},{f(y - rr * 1.8)} q{f(math.cos(ang) * rr * 0.7)},{f(-rr * 0.5)} '
                           f'{f(math.cos(ang) * rr * 1.3)},{f(math.sin(ang) * rr * 0.6 + rr * 0.4)}" '
                           f'fill="none" stroke="{fill}" stroke-width="3.2"/>')
        elif kind == "dead":
            out.append(f'<path d="M{f(x)},{f(y)} l0,{f(-rr * 1.8)} m0,{f(rr * 0.6)} l{f(rr * 0.6)},{f(-rr * 0.6)} '
                       f'm{f(-rr * 0.6)},{f(rr * 0.9)} l{f(-rr * 0.6)},{f(-rr * 0.5)}" fill="none" '
                       f'stroke="{fill}" stroke-width="2"/>')
        else:
            out.append(f'<ellipse cx="{f(x + rr * 0.25)}" cy="{f(y + rr * 0.15)}" rx="{f(rr)}" ry="{f(rr * 0.55)}" '
                       f'fill="{dark}" stroke="none" opacity="0.45"/>')
            out.append(f'<circle cx="{f(x)}" cy="{f(y - rr * 0.6)}" r="{f(rr)}" fill="{fill}"/>')
            out.append(f'<circle cx="{f(x - rr * 0.3)}" cy="{f(y - rr * 0.95)}" r="{f(rr * 0.38)}" '
                       f'fill="{light}" stroke="none" opacity="0.8"/>')
    out.append("</g>")
    return out


def forest(svg: Svg, pts_poly: list[Pt], rng: random.Random, density=0.0016, r=9.0, avoid=None, **kw) -> list[str]:
    xs = [p[0] for p in pts_poly]
    ys = [p[1] for p in pts_poly]
    box = (min(xs), min(ys), max(xs), max(ys))
    area = (box[2] - box[0]) * (box[3] - box[1])
    n = int(area * density)
    ok = (lambda x, y: pip(x, y, pts_poly)) if avoid is None else both(lambda x, y: pip(x, y, pts_poly), avoid)
    return wood(svg, scatter(rng, n, box, ok, mind=r * 1.15), rng, r=r, **kw)


def mountain(x, y, w, h, fill="#a08a6a", dark="#6e5a40", snow: str | None = "#ffffff", stroke="#3b2f1e",
             rng: random.Random | None = None, sw=1.6) -> list[str]:
    """Montagna in prospettiva (lato in luce + lato in ombra + eventuale neve)."""
    j = rng.uniform(-0.12, 0.12) if rng else 0
    px = x + w * j
    top = (px, y - h)
    l, r = (x - w / 2, y), (x + w / 2, y)
    out = [f'<path d="{poly([l, top, r])}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>',
           f'<path d="{poly([top, r, (px + w * 0.05, y)])}" fill="{dark}" opacity="0.85"/>']
    if snow:
        k = 0.3
        sl = (px - (px - l[0]) * k, top[1] + h * k)
        sr = (px + (r[0] - px) * k, top[1] + h * k)
        out.append(f'<path d="M{f(top[0])},{f(top[1])} L{f(sl[0])},{f(sl[1])} L{f(px - w * 0.05)},{f(sl[1] - h * 0.06)} '
                   f'L{f(px + w * 0.03)},{f(sl[1] + h * 0.02)} L{f(sr[0])},{f(sr[1])} Z" fill="{snow}" '
                   f'stroke="{stroke}" stroke-width="{sw * 0.7}" stroke-linejoin="round"/>')
    return out


def mountain_range(points: list[Pt], rng: random.Random, w=60, h=50, **kw) -> list[str]:
    out: list[str] = []
    for x, y in sorted(points, key=lambda p: p[1]):
        s = rng.uniform(0.75, 1.25)
        out += mountain(x, y, w * s, h * s, rng=rng, **kw)
    return out


def river(pts: list[Pt], width=10.0, color="#7cc0dc", edge="#3e7f9c") -> list[str]:
    d = smooth(pts, closed=False)
    return [f'<path d="{d}" fill="none" stroke="{edge}" stroke-width="{f(width + 3)}" stroke-linecap="round"/>',
            f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{f(width)}" stroke-linecap="round"/>']


def road(pts: list[Pt], width=8.0, color="#e8d7a8", edge="#8a7550", dash: str | None = None) -> list[str]:
    d = smooth(pts, closed=False)
    ds = f' stroke-dasharray="{dash}"' if dash else ""
    return [f'<path d="{d}" fill="none" stroke="{edge}" stroke-width="{f(width + 3)}" stroke-linecap="round"{ds}/>',
            f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{f(width)}" stroke-linecap="round"{ds}/>']


def path_line(pts: list[Pt], color="#5a4630", width=2.0, dash="6 6", opacity=0.8) -> str:
    return (f'<path d="{smooth(pts, closed=False)}" fill="none" stroke="{color}" stroke-width="{width}" '
            f'stroke-dasharray="{dash}" stroke-linecap="round" opacity="{opacity}"/>')


# =============================================================================
# Edifici (prospettiva leggera dall'alto, stile mappa illustrata)
# =============================================================================
def house(x, y, s=14.0, wall="#efe2c4", roof="#b5523b", stroke="#3b2f1e", sw=1.1) -> list[str]:
    """Casetta: base in (x,y), larghezza s."""
    w, h = s, s * 0.62
    rh = s * 0.55
    return [
        f'<rect x="{f(x - w / 2)}" y="{f(y - h)}" width="{f(w)}" height="{f(h)}" fill="{wall}" stroke="{stroke}" stroke-width="{sw}"/>',
        f'<path d="M{f(x - w / 2 - s * 0.12)},{f(y - h)} L{f(x - w * 0.3)},{f(y - h - rh)} L{f(x + w * 0.3)},{f(y - h - rh)} '
        f'L{f(x + w / 2 + s * 0.12)},{f(y - h)} Z" fill="{roof}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>',
    ]


def town(rng: random.Random, cx, cy, rx, ry, n, s=13.0, walls=("#efe2c4",), roofs=("#b5523b",),
         ok=None, stroke="#3b2f1e") -> list[str]:
    pts = scatter(rng, n, (cx - rx, cy - ry, cx + rx, cy + ry),
                  both(lambda x, y: ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1, ok or (lambda x, y: True)),
                  mind=s * 1.05)
    out = [f'<g>']
    for x, y in sorted(pts, key=lambda p: p[1]):
        out += house(x, y, s * rng.uniform(0.8, 1.15), rng.choice(walls), rng.choice(roofs), stroke)
    out.append("</g>")
    return out


def tower(x, y, w=16.0, h=50.0, wall="#e9dcc0", roof="#3d5a8c", stroke="#2b2418", cone=True, sw=1.3) -> list[str]:
    out = [f'<rect x="{f(x - w / 2)}" y="{f(y - h)}" width="{f(w)}" height="{f(h)}" fill="{wall}" stroke="{stroke}" stroke-width="{sw}"/>',
           f'<rect x="{f(x - w * 0.12)}" y="{f(y - h * 0.7)}" width="{f(w * 0.24)}" height="{f(h * 0.14)}" rx="2" fill="{stroke}" opacity="0.7"/>']
    if cone:
        out.append(f'<path d="M{f(x - w * 0.68)},{f(y - h)} L{f(x)},{f(y - h - w * 1.5)} L{f(x + w * 0.68)},{f(y - h)} Z" '
                   f'fill="{roof}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>')
    else:
        for i in range(3):
            bx = x - w / 2 + i * w / 2.5
            out.append(f'<rect x="{f(bx)}" y="{f(y - h - w * 0.25)}" width="{f(w / 5)}" height="{f(w * 0.25)}" '
                       f'fill="{wall}" stroke="{stroke}" stroke-width="{sw}"/>')
    return out


def castle(x, y, s=1.0, wall="#e9dcc0", roof="#3d5a8c", stroke="#2b2418", flag: str | None = "#c0392b") -> list[str]:
    """Castello: corpo centrale + due torri + mastio."""
    out = [f'<g stroke-linejoin="round">']
    bw, bh = 70 * s, 34 * s
    out.append(f'<rect x="{f(x - bw / 2)}" y="{f(y - bh)}" width="{f(bw)}" height="{f(bh)}" fill="{wall}" stroke="{stroke}" stroke-width="1.6"/>')
    for i in range(7):
        out.append(f'<rect x="{f(x - bw / 2 + i * bw / 6.5)}" y="{f(y - bh - 6 * s)}" width="{f(5 * s)}" height="{f(6 * s)}" '
                   f'fill="{wall}" stroke="{stroke}" stroke-width="1.2"/>')
    out.append(f'<path d="M{f(x - 8 * s)},{f(y)} v{f(-14 * s)} a{f(8 * s)},{f(8 * s)} 0 0,1 {f(16 * s)},0 v{f(14 * s)} Z" fill="{stroke}" opacity="0.75"/>')
    out += tower(x - bw / 2, y, 18 * s, 52 * s, wall, roof, stroke)
    out += tower(x + bw / 2, y, 18 * s, 52 * s, wall, roof, stroke)
    out += tower(x, y - bh + 2, 24 * s, 46 * s, wall, roof, stroke)
    if flag:
        fy = y - bh - 46 * s - 24 * 1.5 * s
        out.append(f'<path d="M{f(x)},{f(fy)} v{f(-16 * s)} l{f(14 * s)},{f(5 * s)} l{f(-14 * s)},{f(5 * s)}" '
                   f'fill="{flag}" stroke="{stroke}" stroke-width="1"/>')
    out.append("</g>")
    return out


def arena(x, y, rx=60.0, ry=34.0, wall="#d9c7a0", floor="#c9a874", stroke="#3b2f1e", tiers=3) -> list[str]:
    out = [f'<ellipse cx="{f(x)}" cy="{f(y + ry * 0.25)}" rx="{f(rx)}" ry="{f(ry)}" fill="{shade(wall, -0.25)}" stroke="{stroke}" stroke-width="1.6"/>',
           f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(rx)}" ry="{f(ry)}" fill="{wall}" stroke="{stroke}" stroke-width="1.6"/>']
    for i in range(1, tiers + 1):
        k = 1 - i * 0.16
        out.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(rx * k)}" ry="{f(ry * k)}" fill="none" stroke="{stroke}" stroke-width="0.8" opacity="0.6"/>')
    k = 1 - (tiers + 1) * 0.16
    out.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(rx * k)}" ry="{f(ry * k)}" fill="{floor}" stroke="{stroke}" stroke-width="1.2"/>')
    return out


def dome(x, y, r=40.0, fill="#cfe3f0", stroke="#2b3a4a", ribs=5, opacity=0.9) -> list[str]:
    out = [f'<path d="M{f(x - r)},{f(y)} a{f(r)},{f(r * 0.85)} 0 0,1 {f(2 * r)},0 Z" fill="{fill}" stroke="{stroke}" '
           f'stroke-width="1.6" opacity="{opacity}"/>']
    for i in range(1, ribs):
        k = -1 + 2 * i / ribs
        out.append(f'<path d="M{f(x + k * r)},{f(y)} Q{f(x + k * r * 0.55)},{f(y - r * 0.85)} {f(x)},{f(y - r * 0.85)}" '
                   f'fill="none" stroke="{stroke}" stroke-width="0.8" opacity="0.55"/>')
    out.append(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(r)}" ry="{f(r * 0.18)}" fill="none" stroke="{stroke}" stroke-width="1.2"/>')
    return out


def big_tree(x, y, s=1.0, trunk="#7a5432", leaf="#4f8a3c", dark="#2f5a26", light="#86c060", stroke="#2b2418") -> list[str]:
    """Albero gigante (Ohara, Elbaf, mangrovie di Sabaody)."""
    out = [f'<g stroke="{stroke}" stroke-width="1.6" stroke-linejoin="round">',
           f'<path d="M{f(x - 16 * s)},{f(y)} C{f(x - 10 * s)},{f(y - 40 * s)} {f(x - 12 * s)},{f(y - 70 * s)} {f(x - 6 * s)},{f(y - 95 * s)} '
           f'L{f(x + 6 * s)},{f(y - 95 * s)} C{f(x + 12 * s)},{f(y - 70 * s)} {f(x + 10 * s)},{f(y - 40 * s)} {f(x + 16 * s)},{f(y)} '
           f'Q{f(x + 26 * s)},{f(y + 4 * s)} {f(x + 30 * s)},{f(y + 8 * s)} L{f(x - 30 * s)},{f(y + 8 * s)} Q{f(x - 26 * s)},{f(y + 4 * s)} {f(x - 16 * s)},{f(y)} Z" fill="{trunk}"/>']
    blobs = [(-34, -110, 34), (30, -112, 36), (0, -138, 40), (-52, -88, 24), (52, -90, 26), (-18, -96, 26), (20, -95, 28)]
    for bx, by, br in blobs:
        out.append(f'<circle cx="{f(x + bx * s)}" cy="{f(y + by * s)}" r="{f(br * s)}" fill="{leaf}"/>')
    for bx, by, br in blobs[:3]:
        out.append(f'<circle cx="{f(x + bx * s - br * s * 0.3)}" cy="{f(y + by * s - br * s * 0.35)}" r="{f(br * s * 0.4)}" fill="{light}" stroke="none" opacity="0.7"/>')
    out.append("</g>")
    return out


def ship(x, y, s=1.0, hull="#7a4f2a", sail="#f4ecd8", stroke="#2b2418", flag="#1d1d1d") -> list[str]:
    return [f'<g stroke="{stroke}" stroke-width="1.3" stroke-linejoin="round">',
            f'<path d="M{f(x - 22 * s)},{f(y - 8 * s)} L{f(x + 22 * s)},{f(y - 8 * s)} L{f(x + 16 * s)},{f(y)} L{f(x - 16 * s)},{f(y)} Z" fill="{hull}"/>',
            f'<path d="M{f(x)},{f(y - 8 * s)} V{f(y - 38 * s)}" fill="none"/>',
            f'<path d="M{f(x - 13 * s)},{f(y - 34 * s)} Q{f(x)},{f(y - 30 * s)} {f(x + 13 * s)},{f(y - 34 * s)} L{f(x + 13 * s)},{f(y - 14 * s)} Q{f(x)},{f(y - 10 * s)} {f(x - 13 * s)},{f(y - 14 * s)} Z" fill="{sail}"/>',
            f'<path d="M{f(x)},{f(y - 38 * s)} l{f(9 * s)},{f(3 * s)} l{f(-9 * s)},{f(3 * s)} Z" fill="{flag}"/>',
            "</g>"]


def frame(svg: Svg, color="#3b2f1e", inner="#c9a85a", w=10) -> None:
    svg.add(f'<rect x="{w / 2}" y="{w / 2}" width="{svg.w - w}" height="{svg.h - w}" fill="none" stroke="{color}" stroke-width="{w}"/>',
            f'<rect x="{w + 4}" y="{w + 4}" width="{svg.w - 2 * w - 8}" height="{svg.h - 2 * w - 8}" fill="none" stroke="{inner}" stroke-width="1.5"/>')


def dots(rng: random.Random, box, n, color="#000", r=(0.6, 1.6), ok=None, opacity=(0.15, 0.4)) -> list[str]:
    """Granulosità (sabbia, carta, stelle)."""
    out = [f'<g fill="{color}">']
    for x, y in scatter(rng, n, box, ok):
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rng.uniform(*r))}" opacity="{rng.uniform(*opacity):.2f}"/>')
    out.append("</g>")
    return out


def hatch(pts: list[Pt], color="#000", gap=7.0, angle=45, opacity=0.25, sw=1.0, cid="h") -> tuple[str, list[str]]:
    """Tratteggio limitato a un poligono (rilievi, ombre) via clipPath."""
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    clip = f'<clipPath id="{cid}"><path d="{smooth(pts)}"/></clipPath>'
    L = (x1 - x0) + (y1 - y0)
    a = math.radians(angle)
    lines = []
    k = -L
    while k < L:
        sx, sy = x0 + k, y0
        lines.append(f"M{f(sx)},{f(sy)} l{f(math.cos(a) * L * 2)},{f(math.sin(a) * L * 2)}")
        k += gap
    out = [f'<g clip-path="url(#{cid})"><path d="{" ".join(lines)}" stroke="{color}" stroke-width="{sw}" opacity="{opacity}" fill="none"/></g>']
    return clip, out


# =============================================================================
# Pin → file dati
# =============================================================================
def apply_pins(world_dir: str, pins: dict[str, Pt]) -> None:
    """Riscrive `x:`/`y:` dei luoghi indicati nei file `src/data/<world_dir>/*.ts` (idempotente)."""
    base = os.path.join(ROOT, "src", "data", world_dir)
    todo = dict(pins)
    for fn in sorted(os.listdir(base)):
        if not fn.endswith(".ts"):
            continue
        path = os.path.join(base, fn)
        src = open(path, encoding="utf-8").read()
        changed = False
        for lid in list(todo):
            m = re.search(r"\bid:\s*'" + re.escape(lid) + r"',", src)
            if not m:
                # forma posizionale compatta: L('level', 'id', 'nome', 'name', 'type', x, y, ...)
                strs = r"""(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")"""
                pm = re.search(r"'" + re.escape(lid) + r"',(\s*" + strs + r"\s*,){1,4}\s*(-?[\d.]+),\s*(-?[\d.]+),", src)
                if pm:
                    x, y = todo[lid]
                    new = src[pm.start():pm.start(2) - 0]
                    seg = src[pm.start():pm.end()]
                    seg2 = re.sub(r"(-?[\d.]+),\s*(-?[\d.]+),$", f"{round(x)}, {round(y)},", seg)
                    if seg2 != seg:
                        src = src[:pm.start()] + seg2 + src[pm.end():]
                        changed = True
                    del todo[lid]
                continue
            nxt = re.search(r"\bid:\s*'", src[m.end():])
            end = m.end() + (nxt.start() if nxt else len(src) - m.end())
            block = src[m.end():end]
            x, y = todo[lid]
            nb, nx = re.subn(r"([\s{,]x:\s*)-?[\d.]+(,)", lambda mm: f"{mm.group(1)}{round(x)}{mm.group(2)}", block, count=1)
            nb, ny = re.subn(r"([\s{,]y:\s*)-?[\d.]+(,)", lambda mm: f"{mm.group(1)}{round(y)}{mm.group(2)}", nb, count=1)
            if nx != 1 or ny != 1:
                raise SystemExit(f"apply_pins: x/y non trovati per {lid} in {fn}")
            if nb != block:
                src = src[:m.end()] + nb + src[end:]
                changed = True
            del todo[lid]
        if changed:
            open(path, "w", encoding="utf-8").write(src)
    if todo:
        raise SystemExit(f"apply_pins: luoghi non trovati in src/data/{world_dir}: {sorted(todo)}")


def out_path(world_slug: str, name: str) -> str:
    return os.path.join(ROOT, "public", "assets", "worlds", world_slug, "maps", name)


def preview(path: str, pins: dict[str, Pt], w: int, h: int) -> None:
    """Se PREVIEW_DIR è impostata, scrive un SVG di controllo: mappa + pin numerati (solo sviluppo)."""
    pdir = os.environ.get("PREVIEW_DIR")
    if not pdir:
        return
    os.makedirs(pdir, exist_ok=True)
    name = os.path.basename(path).replace(".svg", ".preview.html")
    out = [f'<html><body style="margin:0"><div style="position:relative;width:{w}px;height:{h}px">',
           f'<img src="file://{path}" style="position:absolute;inset:0;width:{w}px;height:{h}px">',
           f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" style="position:absolute;inset:0">']
    for lid, (x, y) in pins.items():
        short = lid.split("-", 2)[-1]
        out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="7" fill="#ff2d6f" stroke="#fff" stroke-width="2"/>')
        out.append(text(x + 10, y + 4, short, size=12, fill="#fff", anchor="start", family=SANS,
                        weight="bold", halo="#000", halo_w=3))
    out.append("</svg></div></body></html>")
    with open(os.path.join(pdir, name), "w", encoding="utf-8") as fh:
        fh.write("\n".join(out))
