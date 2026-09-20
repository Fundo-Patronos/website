"""Mathematics plates.

The charts here follow the house dataviz rules that apply to a static print
asset: one measure per panel and never a dual axis, a single series per chart so
no legend is needed, selective direct labels rather than a number on every mark,
and recessive grid and axes. Colour carries no meaning - it is the brand ramp
across the whole plate - so identity is never encoded by hue.
"""
import math

from artlib import Art

FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
PHI = (1 + math.sqrt(5)) / 2


def _arc(cx, cy, r, a0, a1, n=44):
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * k / n)),
             cy + r * math.sin(math.radians(a0 + (a1 - a0) * k / n)))
            for k in range(n + 1)]


def golden_squares(terms):
    """The Fibonacci square tiling, grown outward, with each square's arc.

    Each new square takes the side of the bounding box it is placed against, so
    its side IS the next Fibonacci number - the sequence falls out of the
    construction instead of being asserted. Arc centres are chosen so successive
    quarter-turns share an endpoint and the spiral is continuous."""
    x0, y0, x1, y1 = 0.0, 0.0, 1.0, 1.0
    out = [(0.0, 0.0, 1.0, "down")]
    order = ["right", "up", "left", "down"]
    for i in range(1, terms):
        d = order[(i - 1) % 4]
        if d == "right":
            s = y1 - y0
            sq = (x1, y0, s)
            x1 += s
        elif d == "up":
            s = x1 - x0
            sq = (x0, y1, s)
            y1 += s
        elif d == "left":
            s = y1 - y0
            sq = (x0 - s, y0, s)
            x0 -= s
        else:
            s = x1 - x0
            sq = (x0, y0 - s, s)
            y0 -= s
        out.append((sq[0], sq[1], sq[2], d))
    return out, (x0, y0, x1, y1)


def fibonacci_plate():
    a = Art(1240, 880)

    # --- panel 1: golden-rectangle construction + spiral -------------------
    squares, (bx0, by0, bx1, by1) = golden_squares(9)
    BW, BH = bx1 - bx0, by1 - by0
    PX, PY, PW, PH = 70, 96, 500, 720
    S = min(PW / BW, PH / BH)
    ox = PX + (PW - BW * S) / 2 - bx0 * S
    oy = PY + PH + by0 * S
    T = lambda x, y: (ox + x * S, oy - y * S)

    for x, y, s, d in squares:
        a.path([T(x, y), T(x + s, y), T(x + s, y + s), T(x, y + s)],
               close=True, w=1.3)
        if s * S > 30:
            a.text(*T(x + s / 2, y + s / 2), f"{int(round(s))}",
                   size=min(30, 9 + s * S * 0.10), weight=500)
    spiral = {                                   # centre corner + sweep, per side
        "right": (lambda x, y, s: (x, y + s), 270, 360),
        "up":    (lambda x, y, s: (x, y), 0, 90),
        "left":  (lambda x, y, s: (x + s, y), 90, 180),
        "down":  (lambda x, y, s: (x + s, y + s), 180, 270),
    }
    for x, y, s, d in squares:
        corner, a0, a1 = spiral[d]
        cx, cy = corner(x, y, s)
        pc = T(cx, cy)
        a.path(_arc(pc[0], pc[1], s * S, -a0, -a1), w=2.4)
    a.path([T(bx0, by0), T(bx1, by0), T(bx1, by1), T(bx0, by1)],
           close=True, w=2.0)

    # --- panel 2: growth of F(n) ------------------------------------------
    CX0, CY1, CW, CH = 690, 430, 480, 258
    n = 12
    fmax = FIB[n - 1]
    bw = CW / n * 0.62
    a.path([(CX0, CY1), (CX0 + CW, CY1)], w=1.3)                 # baseline only
    for gy in (0.25, 0.5, 0.75, 1.0):                            # recessive grid
        y = CY1 - CH * gy
        a.path([(CX0, y), (CX0 + CW, y)], w=0.7, dash="3 9")
    for i in range(n):
        h = CH * FIB[i] / fmax
        x = CX0 + CW * (i + 0.5) / n - bw / 2
        a.path([(x, CY1), (x, CY1 - h), (x + bw, CY1 - h), (x + bw, CY1)], w=1.3)
        a.path([(x, CY1 + 5), (x, CY1)], w=0.8)                  # tick

    # --- panel 3: convergence to phi --------------------------------------
    DX0, DY1, DW, DH = 690, 838, 480, 210
    ratios = [FIB[i + 1] / FIB[i] for i in range(10)]
    lo, hi = 0.92, 2.08
    ty = lambda v: DY1 - DH * (v - lo) / (hi - lo)
    a.path([(DX0, DY1), (DX0, DY1 - DH)], w=1.3)
    for v in (1.0, 1.5, 2.0):
        a.path([(DX0 - 6, ty(v)), (DX0, ty(v))], w=0.9)
    a.path([(DX0, ty(PHI)), (DX0 + DW, ty(PHI))], w=1.1, dash="14 8")
    pts = [(DX0 + DW * (i + 0.5) / len(ratios), ty(v)) for i, v in enumerate(ratios)]
    a.path(pts, w=1.8)
    for i, (px, py) in enumerate(pts):
        a.circle(px, py, 5.0, w=1.4)

    return a, "Fibonacci sequence: construction, growth and convergence"


MATH = {"mockup-19-math-fibonacci": fibonacci_plate}
