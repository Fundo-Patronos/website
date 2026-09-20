"""Humanities plates: architecture, an instrument and the graticule.

The humanities draw badly when they are drawn literally - a book, a bust, a
quill are all shape-memory problems and come out as blobs at hairline weight.
What the humanities actually left behind is geometry: an order with a module,
a reading room laid out on a radius, a keyboard action that is a four-bar
linkage, a graticule that is a projection. All four are computed here from the
rule that generates them, so every one of them is re-tunable by changing a
number at the top of its builder.
"""
import math

from artlib import Art


# --- shared helpers --------------------------------------------------------
def _arc(cx, cy, r, a0, a1, n=48):
    """Arc as a point list, angles in radians, y down (screen space)."""
    return [(cx + r * math.cos(a0 + (a1 - a0) * k / n),
             cy + r * math.sin(a0 + (a1 - a0) * k / n))
            for k in range(n + 1)]


def _bar(p0, p1, t, ends=(0.0, 0.0)):
    """Rectangular member of thickness t between two centres.

    ends extends the rectangle past each centre, so a lever drawn from pivot to
    pivot still shows the material that carries on beyond the pin."""
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    L = math.hypot(dx, dy) or 1.0
    ux, uy = dx / L, dy / L
    nx, ny = -uy, ux
    a = (p0[0] - ux * ends[0], p0[1] - uy * ends[0])
    b = (p1[0] + ux * ends[1], p1[1] + uy * ends[1])
    h = t / 2
    return [(a[0] + nx * h, a[1] + ny * h), (b[0] + nx * h, b[1] + ny * h),
            (b[0] - nx * h, b[1] - ny * h), (a[0] - nx * h, a[1] - ny * h)]


# --- 20. Classical colonnade, front elevation -----------------------------
# Everything is in modules of one lower column diameter D, the way the Doric
# order is actually specified; the drawing scale is derived at the end so the
# whole portico just fits the frame. Change SPACING or N_COL and the triglyph
# rhythm, the entablature width and the steps all follow.
N_COL = 6
SPACING = 2.30          # column axis to column axis
R_BOT, R_TOP = 0.50, 0.405
SHAFT_H = 5.05
ENTASIS_START = 1 / 3   # shaft is cylindrical below this, curved above
N_FLUTES = 20           # Doric: arrises, no fillets
H_ANNULET, H_ECHINUS, H_ABACUS = 0.10, 0.28, 0.16
R_ECHINUS, R_ABACUS = 0.655, 0.700
H_ARCH, H_FRIEZE, H_CORONA, H_CYMA = 0.68, 0.76, 0.26, 0.15
W_TRIG = 0.50           # triglyph width; pitch is SPACING/2
N_STEPS, H_STEP, T_STEP = 3, 0.38, 0.42


def _shaft_r(u):
    """Shaft radius at height fraction u, with entasis.

    Vitruvian practice: the lower third is a true cylinder, above it the
    profile curves in to the neck. The cosine form starts with zero slope, so
    the curve leaves the cylinder tangentially instead of kinking."""
    if u <= ENTASIS_START:
        return R_BOT
    t = (u - ENTASIS_START) / (1 - ENTASIS_START)
    return R_BOT - (R_BOT - R_TOP) * (1 - math.cos(math.pi / 2 * t))


def colonnade():
    a = Art(1500, 900)

    span = (N_COL - 1) * SPACING
    # the frieze ends on a triglyph, which is what fixes the entablature width
    x_ent = span / 2 + SPACING / 2 + W_TRIG / 2
    x_corn = x_ent + 0.30
    x_step0 = x_corn + 0.16                       # stylobate, top step
    x_out = x_step0 + (N_STEPS - 1) * T_STEP
    h_col = SHAFT_H + H_ANNULET + H_ECHINUS + H_ABACUS
    h_ent = H_ARCH + H_FRIEZE + H_CORONA + H_CYMA
    h_all = N_STEPS * H_STEP + h_col + h_ent

    M = 56
    S = min((a.W - 2 * M) / (2 * x_out), (a.H - 2 * M) / h_all)
    CX = a.W / 2
    Y0 = (a.H + h_all * S) / 2                    # ground line, y up from here
    T = lambda x, y: (CX + x * S, Y0 - y * S)
    box = lambda x0, y0, x1, y1, w=1.8: a.path(
        [T(x0, y0), T(x1, y0), T(x1, y1), T(x0, y1)], close=True, w=w)

    # --- crepidoma: three steps, each one tread wider and one rise lower ---
    for k in range(N_STEPS):
        xw = x_step0 + (N_STEPS - 1 - k) * T_STEP
        box(-xw, k * H_STEP, xw, (k + 1) * H_STEP, w=2.0)
    y_sty = N_STEPS * H_STEP

    # --- columns -----------------------------------------------------------
    n_seg = 120
    for i in range(N_COL):
        xc = -span / 2 + i * SPACING
        prof = [(_shaft_r(k / n_seg), y_sty + SHAFT_H * k / n_seg)
                for k in range(n_seg + 1)]
        for sgn in (-1, 1):                        # shaft silhouette
            a.path([T(xc + sgn * r, y) for r, y in prof], w=2.0)
        # flute arrises: the projection of the 20 edges that face the viewer
        step = 2 * math.pi / N_FLUTES
        kmax = int(math.pi / 2 / step)
        for k in range(-kmax + 1, kmax):
            s = math.sin(k * step)
            a.path([T(xc + r * s, y) for r, y in prof], w=0.85)

        y = y_sty + SHAFT_H
        for k in range(3):                         # annulets under the echinus
            yy = y + H_ANNULET * (k + 1) / 3
            a.path([T(xc - R_TOP - 0.012, yy), T(xc + R_TOP + 0.012, yy)], w=1.0)
        y += H_ANNULET
        ech = [(R_TOP + (R_ECHINUS - R_TOP) * (k / 30) ** 0.55,
                y + H_ECHINUS * k / 30) for k in range(31)]
        for sgn in (-1, 1):                        # echinus, an ovolo profile
            a.path([T(xc + sgn * r, yy) for r, yy in ech], w=1.6)
        y += H_ECHINUS
        box(xc - R_ABACUS, y, xc + R_ABACUS, y + H_ABACUS, w=1.8)

    y_ent = y_sty + h_col

    # --- entablature -------------------------------------------------------
    box(-x_ent, y_ent, x_ent, y_ent + H_ARCH, w=2.0)                # architrave
    y_tae = y_ent + H_ARCH
    box(-x_ent - 0.05, y_tae, x_ent + 0.05, y_tae + 0.07, w=1.4)    # taenia
    y_fri = y_tae + 0.07
    box(-x_ent, y_fri, x_ent, y_fri + H_FRIEZE, w=2.0)              # frieze
    y_cor = y_fri + H_FRIEZE
    box(-x_corn, y_cor, x_corn, y_cor + H_CORONA, w=2.0)            # corona
    box(-x_corn - 0.06, y_cor + H_CORONA, x_corn + 0.06,
        y_cor + H_CORONA + H_CYMA, w=1.8)                           # cyma

    # triglyphs on every column axis and every intercolumniation centre, the
    # last one flush with the end of the frieze
    n_trig = int(round(2 * x_ent / (SPACING / 2)))
    for i in range(n_trig + 1):
        xt = -x_ent + W_TRIG / 2 + i * SPACING / 2
        if xt > x_ent - W_TRIG / 2 + 1e-6:
            break
        box(xt - W_TRIG / 2, y_fri, xt + W_TRIG / 2, y_fri + H_FRIEZE, w=1.5)
        for g in (-1, 1):                          # two full glyphs
            for d in (-0.022, 0.022):
                a.path([T(xt + g * W_TRIG / 6 + d, y_fri),
                        T(xt + g * W_TRIG / 6 + d, y_fri + H_FRIEZE * 0.94)], w=0.9)
        for g in (-1, 1):                          # half glyphs at the edges
            a.path([T(xt + g * (W_TRIG / 2 - 0.028), y_fri),
                    T(xt + g * (W_TRIG / 2 - 0.028), y_fri + H_FRIEZE * 0.94)], w=0.9)
        # regula with six guttae, hung from the taenia under each triglyph
        box(xt - W_TRIG / 2, y_ent + H_ARCH - 0.09, xt + W_TRIG / 2,
            y_ent + H_ARCH, w=1.1)
        for k in range(6):
            a.circle(*T(xt - W_TRIG / 2 + W_TRIG * (k + 0.5) / 6,
                        y_ent + H_ARCH - 0.13), 0.030 * S, w=0.8)

    a.path([T(0, -0.30), T(0, h_all + 0.26)], w=1.1, dash="26 10 4 10")
    a.path([T(-x_out - 0.55, 0), T(x_out + 0.55, 0)], w=1.2)        # ground
    return a, "Classical colonnade, Doric front elevation"


# --- 21. Library reading room, plan ---------------------------------------
def library_plan():
    """Square hall, peristyle grid, rotunda of radiating desks.

    The desk array is generated in a local radial frame (u out along the ray,
    v across it), so the tables stay true rectangles instead of turning into
    wedges, and the chairs sit at a constant distance from the table edge the
    way real furniture does."""
    a = Art(1240, 1240)
    CX = CY = 620
    H_OUT, W_WALL = 540, 30                        # outer wall, half size
    H_IN = H_OUT - W_WALL
    D_SHELF = 48                                   # perimeter shelving depth
    H_GRID, N_BAY = 430, 6                         # peristyle: bays per side
    R_DESK0, R_DESK1, HW_DESK = 218, 362, 24
    N_DESK, N_SEAT = 12, 3
    R_CNT0, R_CNT1 = 116, 152                      # central counter
    N_SEG, W_DOOR = 9, 150                         # wall bays per side

    # Each wall is divided into N_SEG equal bays: odd bays are glazed, even
    # bays are solid pier, and the pier is exactly where the shelving goes. One
    # geometry drives the openings and the furniture, so nothing can drift.
    PITCH = 2 * H_OUT / N_SEG
    seg = lambda i: (-H_OUT + i * PITCH, -H_OUT + (i + 1) * PITCH)
    WINDOWS = [i for i in range(N_SEG) if i % 2]
    PIERS = [i for i in range(N_SEG) if not i % 2]

    sides = (lambda t, o: (CX + t, CY - H_OUT + o),          # north
             lambda t, o: (CX + H_OUT - o, CY + t),          # east
             lambda t, o: (CX - t, CY + H_OUT - o),          # south
             lambda t, o: (CX - H_OUT + o, CY - t))          # west
    SOUTH = sides[2]

    for f in sides:
        openings = [(seg(i)[0] + 11, seg(i)[1] - 11) for i in WINDOWS]
        if f is SOUTH:                             # the centre bay is the door
            openings.append((-W_DOOR / 2, W_DOOR / 2))
            openings.sort()
        edges = [-H_OUT] + [v for o in openings for v in o] + [H_OUT]
        for k in range(0, len(edges) - 1, 2):      # solid wall runs, both faces
            for o in (0, W_WALL):
                a.path([f(edges[k], o), f(edges[k + 1], o)], w=2.2)
        for p, q in openings:
            for x in (p, q):                       # jambs
                a.path([f(x, 0), f(x, W_WALL)], w=1.4)
            if abs(p + q) > 1e-6 or f is not SOUTH:
                a.path([f(p, W_WALL / 2), f(q, W_WALL / 2)], w=1.2)   # glazing
    for sx in (-1, 1):                             # wall corners closed off
        for sy in (-1, 1):
            a.path([(CX + sx * H_OUT, CY + sy * H_IN), (CX + sx * H_OUT, CY + sy * H_OUT),
                    (CX + sx * H_IN, CY + sy * H_OUT)], w=2.2)

    # --- perimeter shelving, one run per pier ------------------------------
    # The corner piers carry no shelving: two runs of the same depth meeting at
    # a right angle would overlap in the corner square, and a plan that shows
    # furniture inside furniture is simply wrong.
    for f in sides:
        for i in PIERS[1:-1]:
            if f is SOUTH and i == N_SEG // 2:     # entrance bay stays clear
                continue
            p, q = seg(i)
            p, q = p + 8, q - 8
            a.path([f(p, W_WALL), f(q, W_WALL),
                    f(q, W_WALL + D_SHELF), f(p, W_WALL + D_SHELF)], close=True, w=1.5)
            n_div = max(2, int((q - p) / 52))
            for j in range(1, n_div):
                u = p + (q - p) * j / n_div
                a.path([f(u, W_WALL), f(u, W_WALL + D_SHELF)], w=0.8)

    # --- entrance: two leaves at 90 degrees, with their swing arcs ---------
    y_door, leaf = CY + H_IN, W_DOOR / 2 - 6
    for s in (-1, 1):
        hx = CX + s * W_DOOR / 2
        a.path([(hx, y_door), (hx, y_door - leaf)], w=1.8)
        a.path(_arc(hx, y_door, leaf, 0 if s < 0 else -math.pi, -math.pi / 2, n=24),
               w=0.9, dash="9 8")

    # --- peristyle: a square column grid on a regular bay -------------------
    pitch = 2 * H_GRID / N_BAY
    grid = set()
    for i in range(N_BAY + 1):
        t = -H_GRID + i * pitch
        grid |= {(t, -H_GRID), (t, H_GRID), (-H_GRID, t), (H_GRID, t)}
    for gx, gy in sorted(grid):
        a.circle(CX + gx, CY + gy, 17, w=1.8)
        a.circle(CX + gx, CY + gy, 10, w=1.0)
    # dome above, inscribed in the peristyle: the standard dashed projection
    a.circle(CX, CY, H_GRID - 26, w=1.2, dash="22 12")

    # --- radiating desks ---------------------------------------------------
    for i in range(N_DESK):
        th = math.radians(15 + 360 * i / N_DESK)
        ux, uy = math.cos(th), math.sin(th)
        vx, vy = -uy, ux
        P = lambda u, v: (CX + ux * u + vx * v, CY + uy * u + vy * v)
        a.path([P(R_DESK0, -HW_DESK), P(R_DESK1, -HW_DESK),
                P(R_DESK1, HW_DESK), P(R_DESK0, HW_DESK)], close=True, w=1.6)
        a.path([P(R_DESK0 + 10, 0), P(R_DESK1 - 10, 0)], w=0.9)   # spine divider
        for s in (-1, 1):                          # readers on both long sides
            for k in range(N_SEAT):
                u = R_DESK0 + (R_DESK1 - R_DESK0) * (k + 0.5) / N_SEAT
                c = P(u, s * (HW_DESK + 20))
                a.circle(c[0], c[1], 13, w=1.2)
                b = math.atan2(c[1] - CY - uy * u, c[0] - CX - ux * u)
                a.path(_arc(c[0], c[1], 19, b - 1.0, b + 1.0, n=16), w=0.9)

    # --- central counter, with a gap on the entrance side ------------------
    for r, w in ((R_CNT0, 1.6), (R_CNT1, 1.8)):
        a.path(_arc(CX, CY, r, math.radians(104), math.radians(76 + 360), n=200), w=w)
    for k in range(12):
        th = math.radians(104 + (332) * k / 11)
        a.path([(CX + R_CNT0 * math.cos(th), CY + R_CNT0 * math.sin(th)),
                (CX + R_CNT1 * math.cos(th), CY + R_CNT1 * math.sin(th))], w=0.9)

    a.path([(CX - H_OUT - 46, CY), (CX + H_OUT + 46, CY)], w=1.1, dash="26 10 4 10")
    a.path([(CX, CY - H_OUT - 46), (CX, CY + H_OUT + 46)], w=1.1, dash="26 10 4 10")
    return a, "Library reading room, architectural plan"


# --- 22. Grand piano action, section --------------------------------------
# Millimetres on a real key: the balance pin is the origin, x runs away from
# the player, y is up. The whole mechanism is generated from this pivot table,
# so every member, its pin and its flange block move together when one of
# these points is changed.
KEY_L, KEY_R, KEY_T = -150.0, 218.0, 22.0    # KEY_L is a break, not the front
P_CAP = (86.0, 30.0)         # capstan contact, on the key top
HEEL = (86.0, 44.0)          # whippen heel, sitting on the capstan
P_WIP = (178.0, 58.0)        # whippen flange
P_JACK = (92.0, 66.0)        # jack flange, on the whippen
P_REP = (140.0, 74.0)        # repetition-lever flange, on the whippen
P_KNU = (99.0, 105.0)        # knuckle, hung under the hammer shank
P_HAM = (58.0, 98.0)         # hammer flange
P_DMP = (272.0, 38.0)        # damper underlever flange
R_KNU, SHANK_L, HEAD_L, HEAD_W = 7.0, 150.0, 34.0, 21.0
Y_STR, X_AGR, X_WIRE, X_DOWEL = 210.0, 138.0, 248.0, 206.0


def _pivot(a, T, p, r=3.0):
    """Pin in section: the bore plus the centre mark that locates it."""
    a.circle(*T(*p), r, w=1.2)
    for dx, dy in ((r * 2.6, 0), (0, r * 2.6)):
        a.path([T(p[0] - dx, p[1] - dy), T(p[0] + dx, p[1] + dy)], w=0.8,
               dash="11 4 2 4")


def piano_action():
    a = Art(1240, 860)
    x0, x1 = KEY_L - 14, P_DMP[0] + 32
    y0, y1 = -74.0, Y_STR + 20
    M = 50
    S = min((a.W - 2 * M) / (x1 - x0), (a.H - 2 * M) / (y1 - y0))
    T = lambda x, y: ((a.W - (x1 - x0) * S) / 2 + (x - x0) * S,
                      (a.H + (y1 - y0) * S) / 2 - (y - y0) * S)
    poly = lambda pts, w=1.4, **kw: a.path([T(*p) for p in pts], close=True, w=w, **kw)
    seg = lambda p, q, w=1.4, **kw: a.path([T(*p), T(*q)], w=w, **kw)
    rect = lambda x, y, wd, ht: [(x - wd / 2, y), (x + wd / 2, y),
                                 (x + wd / 2, y + ht), (x - wd / 2, y + ht)]

    def member(p0, p1, t, w=1.6, ends=(0.0, 0.0)):
        poly(_bar(p0, p1, t, ends), w=w)

    def flange(p, rail, t=12.0):
        """Flange block, from its pin down onto the rail it is screwed to."""
        member(p, rail, t, w=1.3)
        a.circle(*T(*rail), 9.0 * S, w=1.8)
        a.circle(*T(*rail), 3.0 * S, w=1.0)

    # --- key frame and key lever -------------------------------------------
    seg((x0, -62), (x1, -62), w=1.6)                            # keybed
    for x, wd, ht in ((0.0, 30, 52), (KEY_R - 12, 26, 44)):     # balance, back rail
        poly(rect(x, -62, wd, ht), w=1.5)
        seg((x - wd / 2 - 3, -62 + ht), (x + wd / 2 + 3, -62 + ht), w=1.1)
    poly([(KEY_L, -KEY_T / 2), (KEY_R, -KEY_T / 2),
          (KEY_R, KEY_T / 2), (KEY_L, KEY_T / 2)], w=2.2)       # key lever
    seg((KEY_L, KEY_T / 2 - 4), (KEY_L + 70, KEY_T / 2 - 4), w=0.8)
    for s in (-1, 1):                                           # conventional break
        a.path([T(KEY_L + 6 + s * 4 * (k % 2), -KEY_T / 2 + KEY_T * k / 8)
                for k in range(9)], w=1.2)
    seg((0, -12), (0, KEY_T / 2 + 14), w=1.2)                   # balance pin
    _pivot(a, T, (0.0, 0.0))

    # capstan: threaded stem into the key, domed head under the whippen heel
    poly(rect(P_CAP[0], KEY_T / 2 - 8, 7, P_CAP[1] - KEY_T / 2 + 4), w=1.2)
    a.path([T(P_CAP[0] - 7, P_CAP[1] - 5)]
           + [T(P_CAP[0] + 7 * math.cos(math.pi * (1 - k / 22)),
                P_CAP[1] - 5 + 5.0 * math.sin(math.pi * k / 22)) for k in range(23)],
           w=1.4)

    # --- whippen: heel on the capstan, flange on the whippen rail ----------
    member(HEEL, P_WIP, 11.0, w=1.8, ends=(11.0, 10.0))
    poly(rect(HEEL[0], P_CAP[1], 26, 8), w=1.2)                 # heel cushion
    slope = (P_WIP[1] - HEEL[1]) / (P_WIP[0] - HEEL[0])
    wip = lambda x: HEEL[1] + slope * (x - HEEL[0])     # whippen top at x
    for p in (P_JACK, P_REP):                                   # flanges on top
        member((p[0], wip(p[0]) + 4.0), p, 11.0, w=1.3)
    flange(P_WIP, (202.0, 52.0))
    _pivot(a, T, P_WIP)

    # --- jack: an L standing on the whippen, its head under the knuckle ----
    jack_top = (P_KNU[0] - 4.0, P_KNU[1] - R_KNU - 1.0)
    member(P_JACK, jack_top, 8.5, w=1.6, ends=(7.0, 0.0))
    member(P_JACK, (P_JACK[0] + 27.0, P_JACK[1] - 5.0), 7.0, w=1.5)  # toe
    _pivot(a, T, P_JACK, r=2.4)

    # --- repetition lever: the second escapement of the grand action -------
    # its nose lands on the knuckle beside the jack, which is what lets the
    # hammer be caught and re-struck before the key has come all the way up
    nose = (P_KNU[0] + R_KNU * math.cos(-0.62), P_KNU[1] + R_KNU * math.sin(-0.62))
    member(nose, P_REP, 7.0, w=1.5)
    member(P_REP, (P_REP[0] + 32.0, P_REP[1] + 5.0), 7.0, w=1.5)
    _pivot(a, T, P_REP, r=2.4)

    # --- hammer: the shank runs tangent to the top of the knuckle ---------
    # The knuckle hangs below the shank, so the shank axis is not the line to
    # the knuckle centre but the tangent to a circle of one shank half-width
    # plus one knuckle radius about it.
    d_knu = math.dist(P_HAM, P_KNU)
    ang = (math.atan2(P_KNU[1] - P_HAM[1], P_KNU[0] - P_HAM[0])
           + math.asin(min(1.0, (4.0 + R_KNU) / d_knu)))
    ux, uy = math.cos(ang), math.sin(ang)
    nx, ny = -uy, ux
    tip = (P_HAM[0] + ux * SHANK_L, P_HAM[1] + uy * SHANK_L)
    member(P_HAM, tip, 8.0, w=1.8, ends=(6.0, 0.0))
    flange(P_HAM, (52.0, 76.0))
    _pivot(a, T, P_HAM)
    a.circle(*T(*P_KNU), R_KNU * S, w=1.4)                      # knuckle
    # head: felt tapering from the shank to a rounded crown on the strike line
    hp, f_top = [], 0.80
    for s in (-1, 1):
        rng = range(0, 17) if s < 0 else range(16, -1, -1)
        for k in rng:
            f = f_top * k / 16
            hw = HEAD_W / 2 * (1 - 0.34 * f)
            hp.append((tip[0] + nx * HEAD_L * f + ux * s * hw,
                       tip[1] + ny * HEAD_L * f + uy * s * hw))
    crown = tip[0] + nx * HEAD_L * f_top, tip[1] + ny * HEAD_L * f_top
    r_cr = HEAD_W / 2 * (1 - 0.34 * f_top)
    hp = hp[:17] + [(crown[0] + r_cr * (-ux * math.cos(t) + nx * math.sin(t)),
                     crown[1] + r_cr * (-uy * math.cos(t) + ny * math.sin(t)))
                    for t in (math.pi * k / 16 for k in range(17))] + hp[17:]
    poly(hp, w=1.8)
    # travel of the strike point about the hammer flange, to the string
    strike = (crown[0] + nx * r_cr, crown[1] + ny * r_cr)
    r_str = math.dist(P_HAM, strike)
    a0 = math.atan2(strike[1] - P_HAM[1], strike[0] - P_HAM[0])
    a1 = math.asin(min(1.0, (Y_STR - P_HAM[1]) / r_str))
    a.path([T(P_HAM[0] + r_str * math.cos(a0 + (a1 - a0) * k / 40),
              P_HAM[1] + r_str * math.sin(a0 + (a1 - a0) * k / 40))
            for k in range(41)], w=0.9, dash="26 10 4 10")
    seg(P_HAM, strike, w=0.8, dash="26 10 4 10")

    # --- string, agraffe and damper ----------------------------------------
    seg((X_AGR, Y_STR), (x1, Y_STR), w=2.4)                     # speaking length
    seg((x0, Y_STR), (X_AGR, Y_STR), w=1.2)                     # back length
    poly(rect(X_AGR, Y_STR - 6, 24, 24), w=1.6)                 # agraffe
    seg((X_AGR, Y_STR + 18), (X_AGR, y1), w=1.4)
    for dx in (-5, 5):
        seg((X_AGR + dx, Y_STR - 6), (X_AGR + dx, Y_STR + 12), w=0.8)
    dmp_tip = (196.0, 30.0)                                     # damper underlever
    member(dmp_tip, P_DMP, 9.0, w=1.6, ends=(8.0, 10.0))
    flange(P_DMP, (286.0, 26.0), t=10.0)
    _pivot(a, T, P_DMP, r=2.6)
    poly(rect(X_DOWEL, KEY_T / 2, 7, 15), w=1.2)                # key-end dowel
    dy = dmp_tip[1] + ((P_DMP[1] - dmp_tip[1])
                       * (X_WIRE - dmp_tip[0]) / (P_DMP[0] - dmp_tip[0]))
    seg((X_WIRE, dy), (X_WIRE, Y_STR - 26), w=1.5)              # damper wire
    poly([(X_WIRE - 14, Y_STR - 26), (X_WIRE + 14, Y_STR - 26),
          (X_WIRE + 10, Y_STR - 1), (X_WIRE - 10, Y_STR - 1)], w=1.6)   # damper head
    seg((X_WIRE - 11, Y_STR - 8), (X_WIRE + 11, Y_STR - 8), w=0.9)
    return a, "Grand piano action, longitudinal section"


# --- 23. Wireframe globe ---------------------------------------------------
def wireframe_globe():
    """Orthographic projection of the graticule, back hemisphere dashed.

    The projection is the real thing - x = cos(lat) sin(dlon), y from the
    rotated colatitude - and the visibility test is the sign of the cosine of
    the angular distance from the view centre. Drawing hidden lines thinner and
    dashed is the drafting convention that makes a wireframe read as a solid."""
    a = Art(1200, 1200)
    CX, CY, R = 600, 600, 452
    PHI0 = math.radians(19.0)                      # latitude of the view centre
    LAM0 = math.radians(-24.0)
    TILT = math.radians(23.44)                     # axial tilt, in the picture plane
    STEP, N = 15, 200                              # graticule interval, samples
    ct, st = math.cos(TILT), math.sin(TILT)

    def proj(lat, lon):
        dl = lon - LAM0
        x = math.cos(lat) * math.sin(dl)
        y = math.cos(PHI0) * math.sin(lat) - math.sin(PHI0) * math.cos(lat) * math.cos(dl)
        vis = (math.sin(PHI0) * math.sin(lat)
               + math.cos(PHI0) * math.cos(lat) * math.cos(dl)) > 0
        return (CX + R * (x * ct - y * st), CY - R * (x * st + y * ct), vis)

    def runs(pts, w_front, w_back):
        """Split a sampled curve into front and back runs at the limb."""
        cur, vis = [pts[0][:2]], pts[0][2]
        for p in pts[1:]:
            if p[2] != vis:                        # crossing: share the point
                cur.append(p[:2])
                if len(cur) > 1:
                    a.path(cur, w=w_front if vis else w_back,
                           dash=None if vis else "9 9")
                cur, vis = [cur[-1]], p[2]
            cur.append(p[:2])
        if len(cur) > 1:
            a.path(cur, w=w_front if vis else w_back,
                   dash=None if vis else "9 9")

    for d in range(-90 + STEP, 90, STEP):          # parallels
        lat = math.radians(d)
        heavy = (d == 0)
        runs([proj(lat, 2 * math.pi * k / N) for k in range(N + 1)],
             2.0 if heavy else 1.35, 1.0 if heavy else 0.7)
    for d in range(0, 180, STEP):                  # meridians, each a full great circle
        lon = math.radians(d)
        runs([proj(-math.pi / 2 + math.pi * k / N, lon) for k in range(N + 1)]
             + [proj(math.pi / 2 - math.pi * k / N, lon + math.pi) for k in range(N + 1)],
             1.35, 0.7)
    a.circle(CX, CY, R, w=2.4)                     # limb

    # polar axis: through the two projected poles, which sit at cos(PHI0) of the
    # radius and not on the limb, so they have to be projected like everything
    # else rather than assumed to be at the top and bottom of the circle
    pn, ps = proj(math.pi / 2, 0.0)[:2], proj(-math.pi / 2, 0.0)[:2]
    ex, ey = (pn[0] - ps[0]) * 0.12, (pn[1] - ps[1]) * 0.12
    a.path([(ps[0] - ex, ps[1] - ey), (pn[0] + ex, pn[1] + ey)], w=1.2,
           dash="26 10 4 10")
    # no pole marks: twenty-four meridians already converge on the pole, and a
    # ring drawn there is simply lost inside the starburst
    return a, "Wireframe globe, orthographic graticule"


HUMANITIES = {
    "mockup-20-humanities-colonnade": colonnade,
    "mockup-21-humanities-library-plan": library_plan,
    "mockup-22-humanities-piano-action": piano_action,
    "mockup-23-humanities-wireframe-globe": wireframe_globe,
}
