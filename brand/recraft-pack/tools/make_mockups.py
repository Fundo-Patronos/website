"""Patronos target mockups: fine-line technical drawings carrying the brand
gradient, on a transparent background.

These are not stock art. Every drawing is computed from the real geometry of its
subject - a NACA 2412 section, a Kutta-corrected potential flow, the golden
angle - so it is dimensionally honest and can be re-tuned by changing a number
rather than redrawing.

Three variants are written per subject:

  <name>.svg           THE DEFAULT: paste this one. Every path cut into short
                       runs, each a flat solid colour sampled along the brand
                       ramp, so the gradient reads continuously without any
                       gradient primitive at all. Tested in PowerPoint: survives
                       both on-screen rendering and PDF export intact.

  <name>-gradient.svg  one real stroke="url(#patronos)" gradient. Looks right in
                       PowerPoint on screen, but a PDF export washes the hairline
                       strokes out. Use on the web, or when editing.

  <name>-outlined.svg  strokes converted to filled outlines in one compound path.
                       Same PDF washout, and worse: the "strokes" are hairline
                       FILLS, which anti-alias away. Kept only as a fallback.

    python3 tools/make_mockups.py <out_dir>
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from artlib import Art, naca4, normalise, write_outlined, write_stroked  # noqa: E402
from subjects_extra import EXTRA  # noqa: E402
from subjects_ai import AI  # noqa: E402
from subjects_humanities import HUMANITIES  # noqa: E402
from subjects_math import MATH  # noqa: E402
from subjects_mechanics import MECHANICS  # noqa: E402
from subjects_medicine import MEDICINE  # noqa: E402
from subjects_organic import ORGANIC  # noqa: E402


# --- 1. NACA 2412 wing section --------------------------------------------
def airfoil():
    a = Art()
    m, p, t = 0.02, 0.4, 0.14
    cx, cy, chord = 100, 640, 1000
    T = lambda q: [(cx + x * chord, cy - y * chord * 2.0) for x, y in q]
    up, lo = naca4(m, p, t)
    U, L = T(up), T(lo)
    a.path(U + L[::-1], close=True, w=2.4)
    a.line(cx, cy, cx + chord, cy, w=1.2, dash="26 10 4 10")
    for k in range(1, 26):                               # ribs
        i = min(range(len(up)), key=lambda j: abs(up[j][0] - k / 26))
        a.line(U[i][0], U[i][1], L[i][0], L[i][1], w=1.0)
    for frac, r in [(0.28, 34), (0.66, 22)]:             # spars
        i = min(range(len(up)), key=lambda j: abs(up[j][0] - frac))
        x, y = cx + frac * chord, (U[i][1] + L[i][1]) / 2
        a.circle(x, y, r, w=1.8)
        a.circle(x, y, r - 8, w=1.0)
    y0 = cy + 210                                        # dimension line
    a.line(cx, y0, cx + chord, y0, w=1.1)
    for x in (cx, cx + chord):
        a.line(x, y0 - 18, x, y0 + 18, w=1.1)
    for off in (58, 108, 166):                           # flow isolines above
        a.path([(cx + x * chord, cy - y * chord * 2.0 - off
                 - 34 * abs(math.sin(math.pi * x)) ** 0.7)
                for x, y in up[::3]], w=1.0)
    return a, "Wing section - NACA 2412 with spars, ribs and flow isolines"


# --- 2. Turbofan front elevation ------------------------------------------
def turbofan():
    a = Art()
    cx = cy = 600
    for r, w in ((560, 2.4), (522, 1.6), (300, 1.8), (120, 1.6), (92, 1.2), (40, 1.6)):
        a.circle(cx, cy, r, w=w)
    n = 26
    for i in range(n):
        ang = 2 * math.pi * i / n
        pts = []
        for s in range(41):
            u = s / 40
            rr = 120 + u * 400
            aa = ang + 0.55 * u ** 1.4                   # blade sweep
            pts.append((cx + rr * math.cos(aa), cy + rr * math.sin(aa)))
        a.path(pts, w=1.3)
    for i in range(18):                                  # stator vanes
        ang = 2 * math.pi * i / 18 + 0.1
        a.line(cx + 92 * math.cos(ang), cy + 92 * math.sin(ang),
               cx + 300 * math.cos(ang - 0.22), cy + 300 * math.sin(ang - 0.22), w=1.0)
    a.line(cx - 620, cy, cx + 620, cy, w=1.1, dash="26 10 4 10")
    a.line(cx, cy - 620, cx, cy + 620, w=1.1, dash="26 10 4 10")
    return a, "Turbofan front elevation - fan blades and stator vanes"


# --- 3. Epitrochoid curve family ------------------------------------------
def harmonics():
    a = Art()
    cx, cy = 600, 600
    a.line(60, cy, 1140, cy, w=1.0, dash="26 10 4 10")
    a.line(cx, 60, cx, 1140, w=1.0, dash="26 10 4 10")
    fams = [(5, 3, 1.5), (7, 3, 1.8), (9, 4, 1.4), (11, 4, 1.7), (13, 5, 1.5)]
    for k, (R, r, d) in enumerate(fams):
        scale = 470 / (R + r * d)
        pts = []
        for s_ in range(1001):
            th = 2 * math.pi * r * s_ / 1000
            pts.append((cx + scale * ((R + r) * math.cos(th)
                                      - r * d * math.cos((R + r) / r * th)),
                        cy + scale * ((R + r) * math.sin(th)
                                      - r * d * math.sin((R + r) / r * th))))
        a.path(pts, close=True, w=1.2, t=k / (len(fams) - 1))
    for rr in (160, 320, 470):
        a.circle(cx, cy, rr, w=0.9, dash="3 9")
    return a, "Epitrochoid curve family on a polar reference grid"


# --- 4. DNA double helix ---------------------------------------------------
def helix():
    a = Art()
    cx, amp, turns, top, bot = 600, 215, 3.0, 100, 1100
    span = bot - top
    strand = lambda ph: [(cx + amp * math.sin(2 * math.pi * turns * s / 600 + ph),
                          top + span * s / 600) for s in range(601)]
    a.path(strand(0), w=2.4)
    a.path(strand(math.pi), w=2.4)
    n = 30
    for i in range(n + 1):
        s = i / n
        y = top + span * s
        ph = 2 * math.pi * turns * s
        x1, x2 = cx + amp * math.sin(ph), cx + amp * math.sin(ph + math.pi)
        a.line(x1, y, x2, y, w=0.8 + 0.9 * abs(math.cos(ph)), t=s)
    return a, "DNA double helix with base-pair rungs"


# --- 5. Hexagonal molecular lattice ---------------------------------------
def lattice():
    a = Art()
    R, cx, cy = 96, 600, 600
    dx, dy = R * 1.5, R * math.sqrt(3)
    for col in range(-4, 5):
        for row in range(-4, 5):
            x = cx + col * dx
            y = cy + row * dy + (dy / 2 if col % 2 else 0)
            if math.hypot(x - cx, y - cy) > 500:
                continue
            a.path([(x + R * math.cos(math.pi / 3 * k),
                     y + R * math.sin(math.pi / 3 * k)) for k in range(6)],
                   close=True, w=1.6)
            if (col + row) % 3 == 0:
                a.circle(x, y, R * 0.5, w=1.1)
    return a, "Hexagonal molecular lattice with aromatic centres"


BUILDERS = {
    "mockup-01-engineering-wing-naca2412": airfoil,
    "mockup-02-engineering-turbofan": turbofan,
    "mockup-03-math-epitrochoids": harmonics,
    "mockup-04-biology-dna-helix": helix,
    "mockup-05-chemistry-hex-lattice": lattice,
    **EXTRA,
    **ORGANIC,
    **MATH,
    **MECHANICS,
    **AI,
    **MEDICINE,
    **HUMANITIES,
}

if __name__ == "__main__":
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    for name, fn in BUILDERS.items():
        art, title = fn()
        normalise(art)
        for suffix, body in (
            ("", write_stroked(art, title, stepped=True)),
            ("-gradient", write_stroked(art, title, stepped=False)),
            ("-outlined", write_outlined(art, title)),
        ):
            with open(os.path.join(out, name + suffix + ".svg"), "w") as f:
                f.write(body)
    print(f"{len(BUILDERS)} subjects x 3 variants -> {out}")
