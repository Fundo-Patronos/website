"""Fluid mechanics and gearing.

An earlier attempt at fluid mechanics - a field of streamlines around an
aerofoil - was dropped because it read as wallpaper rather than as a subject.
A Venturi in section carries the same physics but keeps the technical register:
the streamlines are the real 1-D contraction result, and the velocity profiles
scale by continuity, so the throat profile is genuinely taller than the inlet.
"""
import math

from artlib import Art


def venturi():
    a = Art(1200, 860)
    S, X0, AX = 3.0, 118, 560                              # px per mm, axis line
    T = lambda x, y: (X0 + x * S, AX - y * S)
    R1, R2, WALL = 52.0, 24.0, 6.0
    L_IN, L_CON, L_THR, L_DIV, L_OUT = 62, 52, 30, 118, 52
    X_CON, X_THR, X_DIV, X_OUT = (L_IN, L_IN + L_CON,
                                  L_IN + L_CON + L_THR,
                                  L_IN + L_CON + L_THR + L_DIV)
    L = X_OUT + L_OUT

    def radius(x):
        """Bore radius along the axis - the geometry every other part reads."""
        if x <= X_CON:
            return R1
        if x <= X_THR:
            return R1 + (R2 - R1) * (x - X_CON) / L_CON
        if x <= X_DIV:
            return R2
        if x <= X_OUT:
            return R2 + (R1 - R2) * (x - X_DIV) / L_DIV
        return R1

    xs = [L * k / 500 for k in range(501)]
    for sgn in (-1, 1):                                    # bore and outer wall
        a.path([T(x, sgn * radius(x)) for x in xs], w=2.2)
        a.path([T(x, sgn * (radius(x) + WALL)) for x in xs], w=1.5)
        for x in (0, L):
            a.path([T(x, sgn * radius(x)), T(x, sgn * (radius(x) + WALL))], w=1.5)
    a.path([T(-16, 0), T(L + 16, 0)], w=1.1, dash="26 10 4 10")

    for f in (0.24, 0.48, 0.72, 0.92):                     # streamlines
        for sgn in (-1, 1):
            a.path([T(x, sgn * f * radius(x)) for x in xs], w=0.9)

    # velocity profiles. Continuity fixes the scale: u ~ 1/r^2, so the throat
    # profile is genuinely ~4.7x the inlet one rather than drawn longer by eye.
    for x0 in (26, X_CON + L_CON + L_THR / 2, X_OUT + 30):
        r = radius(x0)
        u = 9.0 * (R1 / r) ** 2
        a.path([T(x0, r), T(x0, -r)], w=0.9, dash="5 6")
        a.path([T(x0 + u * (1 - (k / 30 * 2 - 1) ** 2), (k / 30 * 2 - 1) * r)
                for k in range(31)], w=1.4)
        for g in (-0.66, 0.0, 0.66):
            y, tip = g * r, x0 + u * (1 - g ** 2)
            a.path([T(x0, y), T(tip, y)], w=0.8)
            a.arrow(*T(tip, y), 0.0, size=9, w=0.9)

    # piezometer tubes: the column falls where the bore narrows and the static
    # pressure drops, which is the whole point of the instrument
    TUBE, TOP = 9.0, 112.0
    X_MID = X_CON + L_CON + L_THR / 2                      # mid-throat
    for x0, head in ((30, 98.0), (X_MID, 44.0)):
        rw = radius(x0) + WALL
        for sgn in (-1, 1):
            a.path([T(x0 + sgn * TUBE, rw), T(x0 + sgn * TUBE, rw + TOP)], w=1.4)
        a.path([T(x0 - TUBE, rw + TOP), T(x0 + TUBE, rw + TOP)], w=1.0)
        a.path([T(x0 - TUBE, rw + head), T(x0 + TUBE, rw + head)], w=1.8)
        for k in range(9):                                 # liquid column
            yy = rw + head - 5 - k * 7.5
            if yy > rw + 4:
                a.path([T(x0 - TUBE, yy), T(x0 + TUBE, yy)], w=0.55)
    y_hi = R1 + WALL + 98.0
    y_lo = R2 + WALL + 44.0
    a.path([T(30 + TUBE, y_hi), T(X_MID + 52, y_hi)], w=0.9, dash="9 7")
    a.path([T(X_MID + TUBE, y_lo), T(X_MID + 52, y_lo)], w=0.9, dash="9 7")
    a.dim(*T(X_MID + 46, y_lo), *T(X_MID + 46, y_hi), "Δh", off=0, size=21)

    a.dim(*T(0, -R1), *T(0, R1), "Ø 104", off=-70, size=19)
    tp = T(X_CON + L_CON + L_THR / 2, -R2)                 # throat leader callout
    a.path([tp, (tp[0] + 54, tp[1] + 76), (tp[0] + 150, tp[1] + 76)], w=1.1)
    a.arrow(tp[0], tp[1], math.atan2(-76, -54), size=11, w=1.1)
    a.text(tp[0] + 158, tp[1] + 82, "Ø 48", size=18, anchor="start")
    return a, "Venturi meter in section: streamlines, velocity profiles, piezometers"


def _gear(a, cx, cy, z, m, internal=False, phase=0.0, w=1.6):
    """One gear as a closed tooth outline, built from its module and tooth count.

    Trapezoidal flanks rather than true involutes: at hairline weight the
    difference is invisible, and the tooth count, pitch and tip/root circles
    stay dimensionally honest."""
    rp = m * z / 2
    rt = rp - m if internal else rp + m
    rr = rp + 1.25 * m if internal else rp - 1.25 * m
    p = 2 * math.pi / z
    pts = []
    for k in range(z):
        th = phase + k * p
        for da, r in ((-p * 0.31, rr), (-p * 0.15, rt),
                      (p * 0.15, rt), (p * 0.31, rr)):
            pts.append((cx + r * math.cos(th + da), cy + r * math.sin(th + da)))
        for j in range(1, 5):                              # root arc to next tooth
            da = p * 0.31 + (p * 0.69) * j / 5
            pts.append((cx + rr * math.cos(th + da), cy + rr * math.sin(th + da)))
    a.path(pts, close=True, w=w)
    a.circle(cx, cy, rp, w=0.8, dash="16 8 3 8")           # pitch circle
    return rp


def planetary_gearset():
    """Sun, three planets and an internal ring - z_ring = z_sun + 2*z_planet."""
    a = Art(1200, 1200)
    cx = cy = 600
    Z_SUN, Z_PLANET = 24, 18
    Z_RING = Z_SUN + 2 * Z_PLANET                          # meshing constraint
    m = 2 * 470 / (Z_RING + 2)

    _gear(a, cx, cy, Z_RING, m, internal=True, w=2.0)
    a.circle(cx, cy, m * Z_RING / 2 + 1.25 * m + 16, w=2.2)     # ring rim
    a.circle(cx, cy, m * Z_RING / 2 + 1.25 * m + 30, w=1.2)
    for k in range(12):                                    # rim bolt circle
        th = 2 * math.pi * k / 12
        r = m * Z_RING / 2 + 1.25 * m + 23
        a.circle(cx + r * math.cos(th), cy + r * math.sin(th), 5.5, w=1.0)

    _gear(a, cx, cy, Z_SUN, m, w=1.8)
    a.circle(cx, cy, m * 5.0, w=1.4)                       # sun bore + keyway
    a.path([(cx - m * 1.5, cy + m * 5.0), (cx - m * 1.5, cy + m * 6.2),
            (cx + m * 1.5, cy + m * 6.2), (cx + m * 1.5, cy + m * 5.0)], w=1.2)

    r_carrier = m * (Z_SUN + Z_PLANET) / 2
    for i in range(3):
        th = 2 * math.pi * i / 3 + math.pi / 2
        px, py = cx + r_carrier * math.cos(th), cy + r_carrier * math.sin(th)
        # phase each planet so its teeth sit in the ring's gaps
        _gear(a, px, py, Z_PLANET, m, phase=th * (Z_SUN / Z_PLANET), w=1.5)
        a.circle(px, py, m * 3.4, w=1.3)
        a.circle(px, py, m * 2.0, w=1.0)
        a.path([(cx, cy), (px, py)], w=1.2, dash="16 8 3 8")
    a.circle(cx, cy, r_carrier, w=0.9, dash="3 9")         # carrier pitch path
    a.path([(cx - 540, cy), (cx + 540, cy)], w=1.0, dash="26 10 4 10")
    a.path([(cx, cy - 540), (cx, cy + 540)], w=1.0, dash="26 10 4 10")
    return a, "Planetary gearset: sun, three planets, internal ring"


MECHANICS = {
    "mockup-28-fluid-venturi": venturi,
    "mockup-29-mechanism-planetary-gears": planetary_gearset,
}
