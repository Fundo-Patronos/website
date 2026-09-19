"""Second batch of Patronos mockups: dimensioned engineering, software, CFD,
motorsport, genetics, natural form and crystallography.

Everything here is computed, not drawn by hand. The Joukowski streamlines are a
real potential-flow solution, the phyllotaxis uses the real golden angle, the
nautilus is a real logarithmic spiral. That is the point of the approach: the
geometry is correct, so the drawing is correct.
"""
import math

from artlib import Art, naca_like, union_outline


# --- 06. Turbofan, dimensioned --------------------------------------------
def turbofan_dimensioned():
    a = Art()
    cx, cy = 600, 545
    R_case, R_tip, R_hub, R_spin = 395, 366, 126, 49
    for r, w in ((R_case, 2.4), (R_tip, 1.6), (R_hub, 1.6), (R_spin, 1.6), (26, 1.4)):
        a.circle(cx, cy, r, w=w)
    n = 24
    for i in range(n):
        ang = 2 * math.pi * i / n
        a.path([(cx + rr * math.cos(ang + 0.5 * u ** 1.4),
                 cy + rr * math.sin(ang + 0.5 * u ** 1.4))
                for u, rr in ((s / 40, R_hub + s / 40 * (R_tip - R_hub))
                              for s in range(41))], w=1.3)
    for i in range(16):                                   # stator vanes
        ang = 2 * math.pi * i / 16 + 0.1
        a.line(cx + R_spin * math.cos(ang), cy + R_spin * math.sin(ang),
               cx + R_hub * math.cos(ang - 0.2), cy + R_hub * math.sin(ang - 0.2), w=1.0)
    a.line(cx - 470, cy, cx + 470, cy, w=1.1, dash="26 10 4 10")
    a.line(cx, cy - 470, cx, cy + 470, w=1.1, dash="26 10 4 10")

    a.dim(cx - R_case, cy, cx + R_case, cy, "Ø 2 360", off=-455, size=25)
    a.dim(cx - R_hub, cy, cx + R_hub, cy, "Ø 750", off=455, size=21)

    ang = math.radians(-34)                               # leader to a blade tip
    px, py = cx + R_tip * math.cos(ang), cy + R_tip * math.sin(ang)
    a.path([(px, py), (px + 86, py - 52), (px + 196, py - 52)], w=1.1)
    a.arrow(px, py, ang + math.pi, size=13, w=1.1)
    a.text(px + 204, py - 58, "24 × PÁS", size=22, anchor="start")

    a.text(cx, cy + 585, "ESTÁGIO DE FAN — VISTA FRONTAL", size=25)
    a.text(cx, cy + 620, "ESCALA 1:20   COTAS EM mm", size=17, weight=400)
    return a, "Turbofan fan stage, dimensioned front elevation"


# --- 10. Genetics: plasmid map --------------------------------------------
def plasmid_map():
    a = Art()
    cx, cy, R, BP = 600, 585, 360, 5400
    ang = lambda bp: 2 * math.pi * bp / BP - math.pi / 2
    a.circle(cx, cy, R, w=2.0)
    a.circle(cx, cy, R - 16, w=1.2)

    for bp in range(0, BP, 100):                           # ticks
        t, L = ang(bp), (20 if bp % 500 == 0 else 10)
        a.line(cx + R * math.cos(t), cy + R * math.sin(t),
               cx + (R + L) * math.cos(t), cy + (R + L) * math.sin(t),
               w=1.4 if bp % 500 == 0 else 0.9)
        if bp % 1000 == 0:
            a.text(cx + (R + 46) * math.cos(t), cy + (R + 46) * math.sin(t) + 7,
                   f"{bp}", size=18, weight=400)

    feats = [(240, 1180, 78, "ori"), (1460, 2520, 112, "AmpR"),
             (2760, 3640, 92, "lacZ"), (3900, 5060, 126, "GFP")]
    for s, e, off, label in feats:
        r0, r1 = R - off - 26, R - off
        t0, t1 = ang(s), ang(e)
        arc = lambda r, n=60: [(cx + r * math.cos(t0 + (t1 - t0) * k / n),
                               cy + r * math.sin(t0 + (t1 - t0) * k / n))
                               for k in range(n + 1)]
        tip = t1 - 0.055
        outer, inner = arc(r1), arc(r0)[::-1]
        head = [(cx + r1 * math.cos(tip), cy + r1 * math.sin(tip)),
                (cx + (r0 + r1) / 2 * math.cos(t1), cy + (r0 + r1) / 2 * math.sin(t1)),
                (cx + r0 * math.cos(tip), cy + r0 * math.sin(tip))]
        a.path(outer[:-3] + head + inner[3:], close=True, w=1.6)
        tm = (t0 + t1) / 2
        a.text(cx + (r0 - 34) * math.cos(tm), cy + (r0 - 34) * math.sin(tm) + 7,
               label, size=21)

    for bp, label in ((160, "EcoRI"), (2680, "BamHI"), (3820, "XhoI")):
        t = ang(bp)
        a.line(cx + (R + 22) * math.cos(t), cy + (R + 22) * math.sin(t),
               cx + (R + 84) * math.cos(t), cy + (R + 84) * math.sin(t), w=1.1)
        side = "start" if math.cos(t) > 0 else "end"
        a.text(cx + (R + 94) * math.cos(t), cy + (R + 94) * math.sin(t) + 6,
               label, size=19, anchor=side)

    a.text(cx, cy - 10, "pPTR-1", size=40, weight=600)
    a.text(cx, cy + 30, f"{BP} bp", size=22, weight=400)
    return a, "Plasmid map with annotated features and restriction sites"


# --- 11. Natural form: nautilus ------------------------------------------
def nautilus():
    a = Art()
    cx, cy = 600, 620
    b, turns = 0.1759, 3.6                                 # log spiral, ~1.35/quarter
    k = 470 / math.exp(b * 2 * math.pi * turns)
    T0 = 0.14                                              # skip the hairline tail
    spiral = lambda f, n=900: [
        (cx + f * k * math.exp(b * 2 * math.pi * turns * (T0 + (1 - T0) * s / n))
         * math.cos(2 * math.pi * turns * (T0 + (1 - T0) * s / n)),
         cy - f * k * math.exp(b * 2 * math.pi * turns * (T0 + (1 - T0) * s / n))
         * math.sin(2 * math.pi * turns * (T0 + (1 - T0) * s / n)))
        for s in range(n + 1)]
    outer, inner = spiral(1.0), spiral(0.44)
    a.path(outer, w=2.4)
    a.path(inner, w=1.8)
    for i in range(34):                                    # chamber septa
        th = 2 * math.pi * turns * (i + 4) / 38
        r_o = k * math.exp(b * th)
        pts = []
        for s in range(19):                                # curved, concave forward
            u = s / 18
            r = r_o * (0.44 + 0.56 * u)
            d = th - 0.30 * math.sin(math.pi * u)
            pts.append((cx + r * math.cos(d), cy - r * math.sin(d)))
        a.path(pts, w=1.0)
    a.path([outer[-1], inner[-1]], w=2.0)                  # aperture
    a.path([outer[0], inner[0]], w=1.4)
    return a, "Nautilus shell, logarithmic spiral with chamber septa"


# --- 12. Botany: sunflower phyllotaxis ------------------------------------
def phyllotaxis():
    a = Art()
    cx, cy, N = 600, 600, 620
    gold = math.pi * (3 - math.sqrt(5))                    # 137.507...deg
    c = 520 / math.sqrt(N)
    pts = []
    for i in range(1, N + 1):
        r = c * math.sqrt(i)
        th = i * gold
        pts.append((cx + r * math.cos(th), cy + r * math.sin(th), r))
    for x, y, r in pts:
        a.circle(x, y, 2.6 + 9.5 * (r / 520) ** 0.85, w=1.0)
    # No parastichy chains are drawn. Joining every 55th disc produces
    # near-radial spokes through the crowded core rather than spirals; the
    # packing alone already shows both the 34 and 55 families to the eye.
    a.circle(cx, cy, 545, w=1.6)
    return a, "Sunflower phyllotaxis, golden angle with 34 and 55 parastichies"


# --- 13. Crystallography: face-centred cubic unit cell --------------------
def fcc_cell():
    a = Art()
    cx, cy, S = 600, 620, 330
    ax = (S, -S * 0.30)                                    # axonometric basis
    ay = (0, -S)
    az = (-S * 0.72, -S * 0.40)
    proj = lambda u, v, w: (cx - S * 0.15 + u * ax[0] + v * ay[0] + w * az[0],
                            cy + S * 0.55 + u * ax[1] + v * ay[1] + w * az[1])
    corners = [(u, v, w) for u in (0, 1) for v in (0, 1) for w in (0, 1)]
    for p in corners:                                      # cell edges
        for i in range(3):
            q = list(p)
            if q[i] == 0:
                q[i] = 1
                a.path([proj(*p), proj(*q)], w=1.5)
    faces = [(0.5, 0.5, 0), (0.5, 0.5, 1), (0.5, 0, 0.5),
             (0.5, 1, 0.5), (0, 0.5, 0.5), (1, 0.5, 0.5)]
    for site, r in [(c, 26) for c in corners] + [(f, 30) for f in faces]:
        x, y = proj(*site)
        a.circle(x, y, r, w=1.6)
        a.circle(x, y, r * 0.42, w=1.0)
    for f in faces[:2]:                                    # in-plane bonds
        for c in corners:
            if abs(c[2] - f[2]) < 1e-9:
                a.path([proj(*f), proj(*c)], w=0.9, dash="7 6")
    for label, vec in (("a", (1, 0, 0)), ("b", (0, 1, 0)), ("c", (0, 0, 1))):
        x0, y0 = proj(0, 0, 0)
        x1, y1 = proj(*[v * 1.40 for v in vec])
        a.path([(x0, y0), (x1, y1)], w=1.2, dash="16 8 3 8")
        ang = math.atan2(y1 - y0, x1 - x0)
        a.arrow(x1, y1, ang + math.pi, size=14, w=1.2)
        a.text(x1 + 34 * math.cos(ang), y1 + 34 * math.sin(ang) + 10,
               label, size=30, weight=600)
    return a, "Face-centred cubic unit cell, axonometric"




# --- 08/09/14. Launch vehicle, engine bay, engine section ------------------
# Proportions follow a Falcon 9 Block 5: 70 m tall, 3.7 m core diameter,
# 41.2 m first stage, 13.8 m second stage, 13.1 m x 5.2 m fairing, nine
# engines on an octaweb. Drawn as a generic reusable two-stage vehicle rather
# than badged as anyone's product.
BODY_R, FAIR_R = 1.85, 2.60
Y_BOAT, Y_S1, Y_IS, Y_S2, Y_FAIR = 3.0, 34.5, 41.2, 55.0, 68.1


def _bell(a, xc, y_top, h, r_throat, r_exit, T, w=1.4):
    """A bell nozzle contour: parabolic flare, throat, chamber shoulder."""
    for sgn in (-1, 1):
        pts = []
        for k in range(29):
            u = k / 28
            r = r_throat + (r_exit - r_throat) * u ** 0.62
            pts.append(T(xc + sgn * r, y_top - h * u))
        a.path(pts, w=w)
    a.path([T(xc - r_exit, y_top - h), T(xc + r_exit, y_top - h)], w=w * 0.8)


def launch_vehicle():
    """Full vehicle elevation with a conventional break in the first-stage tank.

    A 70 m x 3.7 m vehicle is 19:1. Drawn whole it is a hairline sliver; the
    break symbol is how a drafter compresses a long uniform run, so the stage
    joints and the engine bay stay readable at slide size."""
    a = Art(690, 1240)
    B0, B1, GAP = 11.0, 26.0, 1.8                          # break window

    def ym(y):
        if y <= B0:
            return y
        if y >= B1:
            return y - (B1 - B0) + GAP
        return B0 + GAP * (y - B0) / (B1 - B0)

    S, CX, Y0 = 18.6, 312, 1118
    T = lambda x, y: (CX + x * S, Y0 - ym(y) * S)
    box = lambda x0, y0, x1, y1, w=1.8: a.path(
        [T(x0, y0), T(x1, y0), T(x1, y1), T(x0, y1)], close=True, w=w)

    a.path([T(0, -1.0), T(0, Y_FAIR + 1.4)], w=1.1, dash="26 10 4 10")

    box(-BODY_R, Y_BOAT, BODY_R, Y_S1, w=2.2)              # stage 1 tankage
    box(-BODY_R, Y_S1, BODY_R, Y_IS, w=2.2)                # interstage
    box(-BODY_R, Y_IS, BODY_R, Y_S2, w=2.2)                # stage 2
    a.path([T(-BODY_R, Y_BOAT), T(-BODY_R + 0.45, 0.0),
            T(BODY_R - 0.45, 0.0), T(BODY_R, Y_BOAT)], w=2.2)   # boat-tail

    nose = []                                              # ogive fairing
    for k in range(41):
        u = k / 40
        nose.append(T(-FAIR_R * math.sqrt(max(0.0, 1 - u ** 2.6)),
                      Y_S2 + 3.2 + u * (Y_FAIR - Y_S2 - 3.2)))
    a.path([T(-FAIR_R, Y_S2), T(-FAIR_R, Y_S2 + 3.2)] + nose
           + [(2 * (CX) - x, y) for x, y in nose[::-1]]
           + [T(FAIR_R, Y_S2 + 3.2), T(FAIR_R, Y_S2)], w=2.2)
    a.path([T(-FAIR_R, Y_S2), T(FAIR_R, Y_S2)], w=1.6)
    a.path([T(0, Y_S2 + 3.2), T(0, Y_FAIR)], w=1.0, dash="7 7")   # fairing split

    for y in (9.5, 30.5, 45.0, 52.0):                      # tank domes
        a.path([(T(-BODY_R + 2 * BODY_R * k / 24, 0)[0],
                 T(0, y)[1] - 1.15 * S * math.sin(math.pi * k / 24))
                for k in range(25)], w=1.2)
    for y in list(range(4, 11, 2)) + list(range(27, 34, 2)) + [43, 47, 50, 53]:
        a.path([T(-BODY_R, y), T(BODY_R, y)], w=0.7)       # ring frames

    for sgn in (-1, 1):                                    # grid fins, stowed
        box(sgn * BODY_R, 31.6, sgn * (BODY_R + 1.15), 33.9, w=1.5)
        for k in range(1, 5):
            a.path([T(sgn * BODY_R + sgn * 1.15 * k / 5, 31.6),
                    T(sgn * BODY_R + sgn * 1.15 * k / 5, 33.9)], w=0.7)
        for k in range(1, 4):
            a.path([T(sgn * BODY_R, 31.6 + 2.3 * k / 4),
                    T(sgn * (BODY_R + 1.15), 31.6 + 2.3 * k / 4)], w=0.7)
        a.path([T(sgn * BODY_R, 4.2), T(sgn * (BODY_R + 0.52), 5.0),
                T(sgn * (BODY_R + 0.52), 12.5), T(sgn * BODY_R, 12.9)],
               close=True, w=1.5)                          # landing leg, stowed

    # nine engines on an octaweb project to three across the diameter in
    # elevation; drawing all nine turns the skirt into a band of hatching
    for xc in (-1.15, 0.0, 1.15):                          # engine bells
        _bell(a, xc, Y_BOAT - 0.35, 2.55, 0.24, 0.56, T)
    a.path([T(-BODY_R + 0.45, 0.0), T(BODY_R - 0.45, 0.0)], w=1.0, dash="9 7")

    xd = CX - BODY_R * S - 96                               # dimension chain
    for y0, y1, label in ((0, Y_FAIR, "70 000"), (0, Y_S1, "41 200"),
                          (Y_S1, Y_S2, "20 500"), (Y_S2, Y_FAIR, "13 100")):
        xx = xd - (88 if label == "70 000" else 0)   # overall dim outermost
        p0, p1 = (xx, T(0, y0)[1]), (xx, T(0, y1)[1])
        a.path([p0, p1], w=1.1)
        a.arrow(p0[0], p0[1], -math.pi / 2, size=12, w=1.1)
        a.arrow(p1[0], p1[1], math.pi / 2, size=12, w=1.1)
        for p, y in ((p0, y0), (p1, y1)):
            a.path([(T(-BODY_R, y)[0] - 8, p[1]), (p[0] - 10, p[1])], w=0.8)
        a.text(xx - 12, (p0[1] + p1[1]) / 2, label, size=19, anchor="end")

    for y, name in ((Y_BOAT, "OCTAWEB"), (20.0, "CORPO Ø 3 700"),
                    (Y_S1, "INTERESTÁGIO"), (Y_IS, "2.º ESTÁGIO"),
                    (Y_S2, "COIFA Ø 5 200")):
        x0 = T(BODY_R, y)[0] + 68
        a.path([(T(BODY_R, y)[0] + 8, T(0, y)[1]), (x0 - 8, T(0, y)[1])],
               w=0.9, dash="12 7")
        a.text(x0, T(0, y)[1] + 6, name, size=18, anchor="start")

    yb = (T(0, B0)[1] + T(0, B1)[1]) / 2                   # conventional long break
    for yoff in (14, -14):
        a.path([(CX - BODY_R * S + 2 * BODY_R * S * k / 12,
                 yb + yoff + (5 if k % 2 else -5)) for k in range(13)], w=1.2)

    a.text(CX, 1196, "VEÍCULO LANÇADOR REUTILIZÁVEL", size=23)
    a.text(CX, 1224, "ELEVAÇÃO · ESCALA 1:200 · COTAS EM mm", size=15, weight=400)
    return a, "Reusable two-stage launch vehicle, dimensioned elevation"


def octaweb(annotated=True):
    """Engine bay in plan: eight engines on a ring plus one on the axis.

    annotated=False drops the dimensions, leader and title, leaving the bare
    geometry for use as a large background element."""
    a = Art()
    cx, cy, S = 600, 585, 200
    R_ring, R_out, R_exit = 1.30, 1.85, 0.46
    for r, w, dash in ((R_out, 2.4, None), (R_out - 0.10, 1.4, None),
                       (R_ring, 1.0, "9 8"), (0.62, 1.2, None)):
        a.circle(cx, cy, r * S, w=w, dash=dash)
    for i in range(8):                                     # thrust-frame webs
        th = 2 * math.pi * i / 8 + math.pi / 8
        a.line(cx + 0.62 * S * math.cos(th), cy + 0.62 * S * math.sin(th),
               cx + (R_out - 0.10) * S * math.cos(th),
               cy + (R_out - 0.10) * S * math.sin(th), w=1.2)
    sites = [(0.0, 0.0)] + [(R_ring * math.cos(2 * math.pi * i / 8),
                             R_ring * math.sin(2 * math.pi * i / 8))
                            for i in range(8)]
    for x, y in sites:
        px, py = cx + x * S, cy + y * S
        for rr, w in ((R_exit, 1.8), (R_exit * 0.74, 1.1), (R_exit * 0.30, 1.4),
                      (R_exit * 0.12, 1.1)):
            a.circle(px, py, rr * S, w=w)
        for k in range(16):                                # cooling tubes
            th = 2 * math.pi * k / 16
            a.line(px + R_exit * 0.74 * S * math.cos(th),
                   py + R_exit * 0.74 * S * math.sin(th),
                   px + R_exit * S * math.cos(th),
                   py + R_exit * S * math.sin(th), w=0.7)
    a.line(cx - 1.02 * R_out * S, cy, cx + 1.02 * R_out * S, cy, w=1.1,
           dash="26 10 4 10")
    a.line(cx, cy - 1.02 * R_out * S, cx, cy + 1.02 * R_out * S, w=1.1,
           dash="26 10 4 10")
    if not annotated:
        return a, "Nine-engine octaweb, plan view"
    a.dim(cx - R_out * S, cy, cx + R_out * S, cy, "Ø 3 700", off=-475, size=22)
    a.dim(cx - R_ring * S, cy, cx + R_ring * S, cy, "Ø 2 600 PCD", off=440, size=20)
    th = math.radians(-45)
    px, py = cx + (R_ring + R_exit) * S * math.cos(th), cy + (R_ring + R_exit) * S * math.sin(th)
    a.path([(px, py), (px + 70, py + 44), (px + 190, py + 44)], w=1.1)
    a.arrow(px, py, th + math.pi, size=13, w=1.1)
    a.text(px + 198, py + 38, "9 × MOTOR", size=21, anchor="start")
    a.text(cx, cy + 560, "OCTAWEB — VISTA INFERIOR", size=24)
    return a, "Nine-engine octaweb, plan view"


def engine_section():
    """Gas-generator rocket engine in section.

    Dimensioned to sit inside the octaweb plate: exit diameter 920 mm, which is
    what nine engines on a 2 600 mm pitch circle inside a 3 700 mm core can
    actually accommodate. The contour is a real converging-diverging profile -
    a steep initial bell expansion tapering to the exit, a rounded throat, a
    straight chamber barrel - rather than a cone."""
    a = Art(1080, 1240)
    S, CX, Y0 = 268, 386, 985                             # px per metre
    T = lambda x, y: (CX + x * S, Y0 - y * S)
    R_EXIT, R_THR, R_CH = 0.460, 0.115, 0.220
    Y_THR, Y_CH0, Y_CH1, Y_INJ = 1.55, 1.95, 2.45, 2.60

    def wall(y):
        """Inner wall radius at height y."""
        if y <= Y_THR:                                     # diverging bell
            u = (Y_THR - y) / Y_THR
            return R_THR + (R_EXIT - R_THR) * u ** 0.56
        if y <= Y_CH0:                                     # converging throat
            u = (y - Y_THR) / (Y_CH0 - Y_THR)
            return R_THR + (R_CH - R_THR) * (1 - math.cos(math.pi * u)) / 2
        return R_CH

    ys = [i / 300 * Y_CH1 for i in range(301)]
    for sgn in (-1, 1):
        a.path([T(sgn * wall(y), y) for y in ys], w=2.2)            # inner wall
        a.path([T(sgn * (wall(y) + 0.030), y) for y in ys], w=1.4)  # outer jacket
    for i in range(0, 301, 6):                             # regenerative channels
        y = ys[i]
        r = wall(y)
        for sgn in (-1, 1):
            a.path([T(sgn * r, y), T(sgn * (r + 0.030), y)], w=0.6)
    for y in (0.38, 0.78, 1.18):                           # stiffening rings
        r = wall(y) + 0.030
        for sgn in (-1, 1):
            a.path([T(sgn * r, y - 0.022), T(sgn * (r + 0.026), y - 0.022),
                    T(sgn * (r + 0.026), y + 0.022), T(sgn * r, y + 0.022)],
                   close=True, w=1.0)
    a.path([T(-R_EXIT - 0.030, 0), T(R_EXIT + 0.030, 0)], w=1.6)    # exit plane
    a.path([T(-R_THR, Y_THR), T(R_THR, Y_THR)], w=0.9, dash="7 6")

    for sgn in (-1, 1):                                    # injector + dome
        a.path([T(sgn * (R_CH + 0.030), Y_CH1), T(sgn * 0.300, Y_CH1),
                T(sgn * 0.300, Y_INJ), T(sgn * (R_CH + 0.030), Y_INJ)], w=1.6)
    a.path([T(-0.300, Y_INJ), T(0.300, Y_INJ)], w=1.6)
    dome = [T(0.300 * math.cos(math.pi * k / 40),
              Y_INJ + 0.190 * math.sin(math.pi * k / 40)) for k in range(41)]
    a.path(dome, w=2.2)
    a.path([T(-0.238 * math.cos(math.pi * k / 40),
              Y_INJ + 0.150 * math.sin(math.pi * k / 40)) for k in range(41)], w=1.1)
    for k in range(-5, 6):                                 # injector elements
        a.circle(*T(k * 0.048, Y_CH1 + 0.075), 0.019 * S, w=0.9)

    a.circle(*T(0, Y_INJ + 0.300), 0.072 * S, w=1.8)       # gimbal bearing
    a.circle(*T(0, Y_INJ + 0.300), 0.034 * S, w=1.1)
    a.path([T(-0.072, Y_INJ + 0.300), T(-0.072, Y_INJ + 0.190)], w=1.4)
    a.path([T(0.072, Y_INJ + 0.300), T(0.072, Y_INJ + 0.190)], w=1.4)
    for sgn in (-1, 1):                                    # thrust struts
        a.path([T(sgn * 0.072, Y_INJ + 0.330), T(sgn * 0.400, Y_INJ + 0.455)], w=1.5)
        a.path([T(sgn * 0.340, Y_INJ + 0.520), T(sgn * 0.460, Y_INJ + 0.390)], w=1.6)

    PX, PY = 0.560, 2.12                                   # turbopump assembly
    for r, w in ((0.190, 1.8), (0.150, 1.0)):
        a.circle(*T(PX, PY + 0.230), r * S, w=w)           # fuel pump volute
    for r, w in ((0.160, 1.8), (0.124, 1.0)):
        a.circle(*T(PX, PY - 0.190), r * S, w=w)           # ox pump volute
    for k in range(10):                                    # impeller vanes
        th = 2 * math.pi * k / 10
        for cy, r0, r1 in ((PY + 0.230, 0.055, 0.150), (PY - 0.190, 0.046, 0.124)):
            a.path([T(PX + r0 * math.cos(th), cy + r0 * math.sin(th)),
                    T(PX + r1 * math.cos(th + 0.40), cy + r1 * math.sin(th + 0.40))],
                   w=0.8)
    a.path([T(PX - 0.046, PY - 0.190), T(PX - 0.046, PY + 0.230)], w=1.4)
    a.path([T(PX + 0.046, PY - 0.190), T(PX + 0.046, PY + 0.230)], w=1.4)   # shaft
    a.path([T(PX - 0.150, PY + 0.470), T(PX + 0.150, PY + 0.470),
            T(PX + 0.112, PY + 0.640), T(PX - 0.112, PY + 0.640)],
           close=True, w=1.6)                              # gas generator
    a.path([T(PX, PY + 0.470), T(PX, PY + 0.380)], w=1.2, dash="8 6")

    a.path([T(0.300, Y_INJ - 0.060), T(PX - 0.190, PY + 0.230)], w=1.5)     # fuel in
    a.path([T(0.300, Y_CH1 + 0.040), T(0.430, Y_CH1 + 0.040),
            T(PX - 0.160, PY - 0.190)], w=1.5)                              # ox in
    duct = [T(PX - 0.112, PY + 0.640), T(PX + 0.020, PY + 0.760),
            T(PX + 0.230, PY + 0.700), T(PX + 0.230, 1.70)]
    duct += [T(wall(1.70 - k * 0.34) + 0.150, 1.70 - k * 0.34) for k in range(1, 6)]
    a.path(duct, w=1.4)                                                     # exhaust
    for x, y in ((0.300, Y_INJ - 0.060), (0.430, Y_CH1 + 0.040)):           # flanges
        a.path([T(x - 0.026, y - 0.026), T(x + 0.026, y + 0.026)], w=1.2)

    a.path([T(0, -0.26), T(0, Y_INJ + 0.60)], w=1.1, dash="26 10 4 10")
    a.dim(*T(-R_EXIT, 0), *T(R_EXIT, 0), "Ø 920", off=92, size=21)
    xd = T(-R_EXIT, 0)[0] - 104
    p0, p1 = (xd, T(0, 0)[1]), (xd, T(0, Y_INJ + 0.49)[1])
    a.path([p0, p1], w=1.1)
    a.arrow(p0[0], p0[1], -math.pi / 2, size=12, w=1.1)
    a.arrow(p1[0], p1[1], math.pi / 2, size=12, w=1.1)
    a.text(xd - 12, (p0[1] + p1[1]) / 2, "3 090", size=21, anchor="end")

    for y, x_at, name in ((0.30, R_EXIT + 0.06, "TUBEIRA"),
                          (Y_THR, R_THR + 0.05, "GARGANTA Ø 230"),
                          (2.18, R_CH + 0.06, "CÂMARA"),
                          (Y_CH1 + 0.07, 0.31, "INJETOR"),
                          (PY + 0.23, PX + 0.20, "TURBOBOMBA"),
                          (PY + 0.60, PX + 0.16, "GERADOR DE GÁS"),
                          (Y_INJ + 0.30, 0.09, "JUNTA CARDÃ")):
        x0 = T(x_at, y)[0]
        a.path([(x0 + 6, T(0, y)[1]), (826, T(0, y)[1])], w=0.9, dash="12 7")
        a.text(834, T(0, y)[1] + 6, name, size=16, anchor="start")

    a.text(540, 1166, "MOTOR-FOGUETE — CORTE LONGITUDINAL", size=22)
    a.text(540, 1196, "ESCALA 1:10 · COTAS EM mm", size=15, weight=400)
    return a, "Gas-generator rocket engine, longitudinal section"


# --- 07/15/16. Software infrastructure, drawn as CAD ----------------------
def server_rack():
    """A 42U rack in front elevation: frame, mounted equipment, dimensions.

    A box-and-arrow architecture diagram sits in a different visual language
    from the rest of the set. A rack is a real object with real dimensions
    (600 x 2000 mm, 44.45 mm per U), so it draws in the same CAD register as
    the rocket plates."""
    a = Art(760, 1240)
    S, X0, Y0 = 0.40, 250, 1090                            # 0.40 px per mm
    U, WIDE = 44.45, 600.0
    T = lambda x, y: (X0 + x * S, Y0 - y * S)
    box = lambda x0, y0, x1, y1, w=1.6: a.path(
        [T(x0, y0), T(x1, y0), T(x1, y1), T(x0, y1)], close=True, w=w)

    box(0, 0, WIDE, 2000, w=2.4)                           # rack frame
    box(14, 14, WIDE - 14, 1986, w=1.2)
    for x in (62, WIDE - 62):                              # mounting rails
        a.path([T(x, 60), T(x, 1930)], w=1.4)
        a.path([T(x + 22, 60), T(x + 22, 1930)], w=1.0)
    for i in range(42):                                    # cage-nut holes
        yb = 66 + i * U
        for x in (72, WIDE - 72):
            for k in range(3):
                a.circle(*T(x, yb + 8 + k * 13), 2.6, w=0.8)

    def device(u_start, u_height, kind):
        y = 66 + u_start * U
        h = u_height * U - 4
        box(90, y, WIDE - 90, y + h, w=1.6)
        box(100, y + 5, WIDE - 100, y + h - 5, w=0.9)
        if kind == "server":
            for k in range(8):                             # drive bays
                bx = 118 + k * 42
                box(bx, y + 10, bx + 32, y + h - 10, w=0.9)
                a.circle(*T(bx + 26, y + h / 2), 2.2, w=0.8)
            a.circle(*T(WIDE - 120, y + h / 2), 4.0, w=1.0)
        elif kind == "switch":
            for row in range(2):                           # port field
                for k in range(24):
                    px = 112 + k * 16.5
                    box(px, y + 9 + row * 15, px + 11, y + 20 + row * 15, w=0.7)
        elif kind == "vent":
            for row in range(4):
                for k in range(26):
                    a.circle(*T(114 + k * 15, y + 12 + row * 11), 2.4, w=0.7)

    layout = [(0, 2, "vent"), (2, 1, "switch"), (3, 1, "switch"),
              (5, 2, "server"), (7, 2, "server"), (9, 2, "server"),
              (12, 4, "vent"), (17, 2, "server"), (19, 2, "server"),
              (21, 2, "server"), (24, 1, "switch"), (26, 4, "vent"),
              (31, 2, "server"), (33, 2, "server"), (36, 3, "vent")]
    for u0, uh, kind in layout:
        device(u0, uh, kind)

    a.dim(*T(0, 2000), *T(WIDE, 2000), "600", off=-86, size=20)
    xd = T(0, 0)[0] - 92
    p0, p1 = (xd, T(0, 0)[1]), (xd, T(0, 2000)[1])
    a.path([p0, p1], w=1.1)
    a.arrow(p0[0], p0[1], -math.pi / 2, size=12, w=1.1)
    a.arrow(p1[0], p1[1], math.pi / 2, size=12, w=1.1)
    a.text(xd - 12, (p0[1] + p1[1]) / 2, "2 000", size=20, anchor="end")
    for i in (0, 20, 41):                                  # U station marks
        yb = 66 + i * U + U / 2
        a.path([T(-34, yb), T(-6, yb)], w=0.9)
        a.text(T(-42, yb)[0], T(0, yb)[1] + 6, f"{i + 1}U", size=15, anchor="end")

    a.text(T(WIDE / 2, 0)[0], 1150, "RACK 42U — ELEVAÇÃO FRONTAL", size=23)
    a.text(T(WIDE / 2, 0)[0], 1180, "COTAS EM mm", size=15, weight=400)
    return a, "42U server rack, dimensioned front elevation"


def cloud_symbol():
    """Cloud mark: the union outline of overlapping discs, plus inner echoes."""
    a = Art(1200, 760)
    CX, CY = 600, 380
    puffs = [(-215, -28, 132), (-96, -92, 162), (52, -100, 182),
             (192, -54, 146), (286, 18, 116), (-262, 44, 112),
             (-140, 62, 132), (18, 66, 140), (170, 62, 124), (272, 70, 98)]
    puffs = [(CX + x, CY + y, r) for x, y, r in puffs]
    for loop in union_outline(puffs):
        a.path(loop, close=True, w=2.6)
    for k, f in enumerate((0.84, 0.68, 0.52)):
        inner = [(CX + (x - CX) * f, CY + (y - CY) * f, r * f) for x, y, r in puffs]
        for loop in union_outline(inner):
            a.path(loop, close=True, w=1.1 if k == 0 else 0.9,
                   dash=None if k == 0 else "10 9")
    return a, "Cloud symbol, concentric contours"


def _rack(a, x0, y0, w_, h_, units=13):
    """One equipment rack in front elevation. Shared by the row and the single."""
    u = (h_ - 52) / units
    a.path([(x0, y0), (x0 + w_, y0), (x0 + w_, y0 + h_), (x0, y0 + h_)],
           close=True, w=2.2)
    a.path([(x0 + 12, y0 + 12), (x0 + w_ - 12, y0 + 12),
            (x0 + w_ - 12, y0 + h_ - 12), (x0 + 12, y0 + h_ - 12)],
           close=True, w=1.0)
    for k in range(units):
        uy = y0 + 26 + k * u
        uh = u - 9
        a.path([(x0 + 22, uy), (x0 + w_ - 22, uy),
                (x0 + w_ - 22, uy + uh), (x0 + 22, uy + uh)], close=True, w=1.0)
        if k % 4 == 2:                                     # vented blank
            rows = max(2, int(uh // 9))
            for row in range(rows):
                for j in range(9):
                    a.circle(x0 + 34 + j * (w_ - 70) / 8,
                             uy + 6 + row * (uh - 8) / max(rows - 1, 1),
                             2.4 * w_ / 196, w=0.7)
        else:
            for j in range(4):                             # drive bays
                bw = (w_ - 74) / 4
                bx = x0 + 32 + j * (bw + 9)
                a.path([(bx, uy + 5), (bx + bw, uy + 5),
                        (bx + bw, uy + uh - 5), (bx, uy + uh - 5)], close=True, w=0.7)
            a.circle(x0 + w_ - 32, uy + uh / 2, 3.2 * w_ / 196, w=0.8)
    for fx in (x0 + 26, x0 + w_ - 26):                     # castors
        a.circle(fx, y0 + h_ + 14, 11 * w_ / 196, w=1.4)
        a.circle(fx, y0 + h_ + 14, 4 * w_ / 196, w=1.0)


def datacenter_row():
    """A row of equipment racks in front elevation."""
    a = Art(1200, 860)
    for cx in (200, 400, 600, 800, 1000):
        _rack(a, cx - 98, 190, 196, 470)
    a.path([(80, 700), (1120, 700)], w=1.2, dash="26 10 4 10")
    return a, "Datacentre rack row, front elevation"


def datacenter_single():
    """One equipment rack, same drawing at a size that carries a slide alone."""
    a = Art(620, 1000)
    _rack(a, 160, 90, 300, 760, units=18)
    a.path([(60, 900), (560, 900)], w=1.2, dash="26 10 4 10")
    return a, "Equipment rack, front elevation"


EXTRA = {
    "mockup-06-engineering-turbofan-dimensioned": turbofan_dimensioned,
    "mockup-07-software-server-rack": server_rack,
    "mockup-15-software-cloud": cloud_symbol,
    "mockup-16-software-datacenter-row": datacenter_row,
    "mockup-16b-software-datacenter-single": datacenter_single,
    "mockup-08-aerospace-launch-vehicle": launch_vehicle,
    "mockup-09-aerospace-octaweb": octaweb,
    "mockup-09b-aerospace-octaweb-clean": lambda: octaweb(annotated=False),
    "mockup-14-aerospace-engine-section": engine_section,
    "mockup-10-genetics-plasmid-map": plasmid_map,
    "mockup-11-biology-nautilus-spiral": nautilus,
    "mockup-12-botany-phyllotaxis": phyllotaxis,
    "mockup-13-chemistry-fcc-unit-cell": fcc_cell,
}
