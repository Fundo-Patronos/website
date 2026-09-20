"""Medical plates.

Four subjects that are genuinely parametric, so none of them needs a traced
silhouette. The ECG is a sum of gaussians on real paper geometry (25 mm/s,
10 mm/mV); the bone section is a packed osteon field plus a strut lattice built
by rejection sampling; the airway tree is grown by the same space-colonisation
rule as the leaf and the neuron in subjects_organic; the syringe is a
manufactured object drawn from its own dimensions.

Anything here can be re-tuned by moving a number: the heart rate, the cortical
wall fraction, the airway generation count, the needle bevel angle.
"""
import math
import random

from artlib import Art
from subjects_organic import draw_network, space_colonise


# --- 24. Electrocardiogram -------------------------------------------------
# Paper geometry is the standard one: 25 mm/s horizontally, 10 mm/mV
# vertically, 1 mm fine squares with every fifth line heavier. Every feature of
# the drawing - beat spacing, wave widths, the calibration pulse - is expressed
# in those units, so changing MM_S or BPM re-times the whole plate correctly.
MM_S, MM_MV, BPM = 25.0, 10.0, 75.0


def _pqrst(t):
    """Lead-II voltage in mV at time t seconds into one cardiac cycle.

    Summed gaussians, one per deflection, with the intervals a cardiologist
    reads off the paper: PR about 130 ms, QRS about 90 ms, QT about 360 ms."""
    g = lambda amp, mu, sig: amp * math.exp(-((t - mu) ** 2) / (2 * sig * sig))
    return (g(0.145, 0.150, 0.0270)        # P: atrial depolarisation
            + g(-0.130, 0.252, 0.0095)     # Q
            + g(1.230, 0.278, 0.0115)      # R
            + g(-0.310, 0.308, 0.0125)     # S
            + g(0.030, 0.360, 0.0400)      # J point, early ST segment
            + g(0.300, 0.500, 0.0550))     # T: ventricular repolarisation


def ecg():
    a = Art(1240, 410)
    PX, PY, S = 60.0, 76.0, 8.0            # plot origin and px per mm
    WMM, HMM = 140.0, 32.0                 # 140 mm = 5,6 s at 25 mm/s
    base = PY + 20.0 * S                   # 0 mV baseline; R needs 12 mm above

    # --- the paper ---------------------------------------------------------
    # Fine 1 mm squares stay recessive by weight and dash; every fifth line is
    # the heavier 5 mm rule the eye actually measures against.
    for k in range(int(WMM) + 1):
        x = PX + k * S
        heavy = k % 5 == 0
        a.path([(x, PY), (x, PY + HMM * S)],
               w=1.05 if heavy else 0.7, dash="8 6" if heavy else "2 6")
    for k in range(int(HMM) + 1):
        y = PY + k * S
        heavy = k % 5 == 0
        a.path([(PX, y), (PX + WMM * S, y)],
               w=1.05 if heavy else 0.7, dash="8 6" if heavy else "2 6")
    a.path([(PX, PY), (PX + WMM * S, PY), (PX + WMM * S, PY + HMM * S),
            (PX, PY + HMM * S)], close=True, w=1.8)

    # --- the trace ---------------------------------------------------------
    # One continuous polyline: calibration pulse, then six beats. Sampling at
    # 2 ms keeps the R spike sharp; anything coarser rounds its apex off. The
    # lead-in is sized so a whole number of cycles lands inside the paper and
    # the strip does not end on a chopped R wave.
    T_RUN, DT = WMM / MM_S, 0.002
    period = 60.0 / BPM
    T_CAL = T_RUN - period * int(T_RUN / period - 0.6)
    xy = lambda t, mv: (PX + t * MM_S * S, base - mv * MM_MV * S)

    trace = []
    t = 0.0
    while t <= T_RUN + 1e-9:
        if t < T_CAL:                      # 1 mV / 200 ms standardisation step
            mv = 1.0 if T_CAL - 0.55 <= t < T_CAL - 0.35 else 0.0
        else:
            mv = _pqrst((t - T_CAL) % period)
        trace.append(xy(t, mv))
        t += DT
    a.path(trace, w=2.2)

    # Isoelectric line, the reference the deflections are measured from.
    a.path([(PX, base), (PX + WMM * S, base)], w=1.0, dash="26 10 4 10")
    return a, "Electrocardiogram, six beats on standard 25 mm/s paper"


# --- 25. Long-bone cross-section ------------------------------------------
def bone_section():
    """Diaphyseal section: cortical lamellae, osteon field, trabecular lattice.

    Nothing is placed by hand. The periosteal contour is a three-lobed radius
    function, the osteons are packed into the cortical band by rejection
    sampling, and the trabeculae are the short edges of a nearest-neighbour
    graph over a blue-noise point set. A fixed seed keeps it reproducible."""
    rnd = random.Random(23)
    a = Art(1200, 1200)
    CX, CY, R0 = 600.0, 600.0, 468.0
    F_END = 0.700                          # endosteal surface, as a fraction
    F_OST = (0.748, 0.902)                 # band the osteons are packed into

    def shape(th, f=1.0):
        """Periosteal radius at angle th, scaled by f. A real diaphysis is a
        rounded triangle, not a circle, so a 3rd and a 2nd harmonic ride on it."""
        r = R0 * (1 + 0.048 * math.cos(3 * th + 0.55) + 0.024 * math.cos(2 * th - 0.9))
        return f * r

    def pol(th, f=1.0, skew=0.0):
        """The point on the contour scaled by f, at angle th (skewed by skew)."""
        return (CX + shape(th, f) * math.cos(th + skew),
                CY + shape(th, f) * math.sin(th + skew))

    # The nutrient canal is placed first: the osteon pack has to open a gap for
    # it, the same way a real canal interrupts the Haversian field.
    TH_NUT = -0.92
    nut = [pol(TH_NUT, f, d) for f, d in ((1.0, 0.0), (F_END - 0.02, -0.085))]

    def _off_canal(p, clear):
        """True when p stands clear of the nutrient canal axis by `clear`."""
        (x1, y1), (x2, y2) = nut
        dx, dy = x2 - x1, y2 - y1
        t = max(0.0, min(1.0, ((p[0] - x1) * dx + (p[1] - y1) * dy) / (dx * dx + dy * dy)))
        return math.dist(p, (x1 + t * dx, y1 + t * dy)) > clear

    ring = lambda f, n=300: [pol(2 * math.pi * k / n, f) for k in range(n)]

    # Circumferential lamellae: a few under the periosteum, a few on the
    # endosteal side. These are the concentric sheets the osteons sit between.
    for f, w in ((1.000, 2.4), (0.978, 1.2), (0.955, 1.0), (0.932, 0.9),
                 (F_END, 2.0), (F_END + 0.020, 1.0), (F_END + 0.040, 0.9)):
        a.path(ring(f), close=True, w=w)

    # --- Haversian systems -------------------------------------------------
    osteons = []
    for _ in range(6000):
        if len(osteons) >= 62:
            break
        th = rnd.uniform(0, 2 * math.pi)
        f = rnd.uniform(*F_OST)
        r = rnd.uniform(17.0, 38.0)
        p = pol(th, f)
        if not _off_canal(p, r + 22):
            continue
        if all(math.dist(p, q) > r + rq + 8 for q, rq in osteons):
            osteons.append((p, r))
    for (px, py), r in osteons:
        # Lamella count follows the osteon's size, as it does in section: a
        # small, young system has three sheets, a mature one five.
        n_lam = max(2, min(5, int(r / 8.0)))
        for k in range(n_lam):
            f = 1.0 - 0.62 * k / max(n_lam - 1, 1)
            a.circle(px, py, r * f, w=round(1.35 - 0.14 * k, 2))
        a.circle(px, py, r * 0.24, w=1.4)              # Haversian canal
        n_lac = 4 if r < 25 else 6                     # osteocyte lacunae
        for k in range(n_lac):
            th = 2 * math.pi * k / n_lac + (px + py) * 0.01
            a.circle(px + r * 0.66 * math.cos(th), py + r * 0.66 * math.sin(th),
                     2.2, w=0.8)

    # Volkmann's canals: transverse channels linking osteons that happen to sit
    # on the same radius. Found, not drawn - the pairing falls out of the pack.
    for i, ((ax_, ay_), ra) in enumerate(osteons):
        for (bx_, by_), rb in osteons[i + 1:]:
            d = math.dist((ax_, ay_), (bx_, by_))
            if d < ra + rb + 26 and abs(math.atan2(ay_ - CY, ax_ - CX)
                                        - math.atan2(by_ - CY, bx_ - CX)) < 0.06:
                a.path([(ax_, ay_), (bx_, by_)], w=0.8, dash="6 5")

    # --- trabecular lattice ------------------------------------------------
    # Blue-noise seeds inside the medullary space, plus anchor points on the
    # endosteal surface so the struts actually land on the cortex. The exclusion
    # radius opens slightly toward the axis, which is the real density gradient:
    # spongy bone is packed against the cortex and looser in mid-marrow.
    R_IN = shape(0.0, F_END)
    pts = [pol(2 * math.pi * k / 44, F_END - 0.006) for k in range(44)]
    anchors = len(pts)
    for _ in range(26000):
        if len(pts) >= 265:
            break
        th = rnd.uniform(0, 2 * math.pi)
        rr = math.sqrt(rnd.random()) * shape(th, F_END) * 0.94
        p = (CX + rr * math.cos(th), CY + rr * math.sin(th))
        sep = 26.0 + 26.0 * (1 - rr / R_IN) ** 1.3
        if all(math.dist(p, q) > sep for q in pts):
            pts.append(p)

    # Nearest-neighbour graph, thinned probabilistically. Connecting every point
    # to all three of its neighbours closes the graph and the result reads as
    # crazed glaze, not as bone; dropping links - more of them away from the
    # cortex, where spongy bone genuinely is sparser - restores the free strut
    # ends and the open marrow spaces that make it read as cancellous.
    RANK_P = (1.00, 0.88, 0.42)
    edges = set()
    for i, p in enumerate(pts):
        near = sorted(range(len(pts)), key=lambda j: math.dist(p, pts[j]))[1:4]
        f_i = math.dist(p, (CX, CY)) / R_IN
        for k, j in enumerate(near):
            d = math.dist(p, pts[j])
            if d > 84 or (k == 2 and d > 62):
                continue
            if i < anchors and j < anchors:
                continue                   # never chord along the endosteum
            if rnd.random() > RANK_P[k] * (0.52 + 0.48 * f_i):
                continue
            edges.add((min(i, j), max(i, j)))
    for i, j in sorted(edges):
        p, q = pts[i], pts[j]
        mid = ((p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
        f = math.dist(mid, (CX, CY)) / R_IN
        # A slight bow off the chord: struts are loaded plates, not straight rods
        bow = (rnd.random() - 0.5) * 0.20 * math.dist(p, q)
        ang = math.atan2(q[1] - p[1], q[0] - p[0]) + math.pi / 2
        a.path([p, (mid[0] + bow * math.cos(ang), mid[1] + bow * math.sin(ang)), q],
               w=round(0.85 + 1.05 * f ** 1.6, 2))     # thicker near the cortex

    # Nutrient canal: one oblique channel right through the cortical wall.
    ang = math.atan2(nut[1][1] - nut[0][1], nut[1][0] - nut[0][0]) + math.pi / 2
    for d in (-8.5, 8.5):
        a.path([(nut[0][0] + d * math.cos(ang), nut[0][1] + d * math.sin(ang)),
                (nut[1][0] + d * math.cos(ang), nut[1][1] + d * math.sin(ang))], w=1.2)

    a.path([(CX - R0 * 1.09, CY), (CX + R0 * 1.09, CY)], w=1.1, dash="26 10 4 10")
    a.path([(CX, CY - R0 * 1.09), (CX, CY + R0 * 1.09)], w=1.1, dash="26 10 4 10")
    return a, "Long-bone cross-section: cortical osteons and trabecular lattice"


# --- 26. Bronchial tree ----------------------------------------------------
# One hemithorax is described by two offset functions measured from the midline:
# how far the lateral border sits at a given height down the field, and how far
# the mediastinal border sits. Changing LAT alone rescales both lungs.
MIDX, APEX = 600.0, 208.0
MED = 44.0
# Right and left fields are not mirror images. The right is the wider and the
# shorter of the two - the liver sits under it - and only the left is notched.
LAT = {-1: 398.0, 1: 368.0}
YB_LAT = {-1: 972.0, 1: 1006.0}
YB_MED = {-1: 902.0, 1: 936.0}


def _shoulder(u):
    """The apex taper shared by both borders, so they meet at the top."""
    return 26.0 * (1 - u) ** 2.4


def _lat_off(u, sgn):
    """Lateral border offset from the midline, u = 0 at apex, 1 at the base."""
    return (MED + _shoulder(u)
            + LAT[sgn] * math.sin(math.pi / 2 * u ** 0.60) * (1 - 0.05 * u ** 6))


def _med_off(u, sgn):
    """Mediastinal border offset. The left field carries the cardiac notch."""
    o = MED + _shoulder(u)
    if sgn > 0:
        o += 146 * math.exp(-((u - 0.78) ** 2) / (2 * 0.145 ** 2))   # cardiac notch
    else:
        o += 26 * math.exp(-((u - 0.60) ** 2) / (2 * 0.240 ** 2))    # right heart border
    return o


def _lung_outline(sgn, u0=0.035, n=150):
    """Closed contour of one lung field: lateral border, base, medial border,
    apex cap. The base is a diaphragmatic dome - highest at its middle, with the
    costophrenic recess as the low point out at the lateral edge."""
    lat = [(MIDX + sgn * _lat_off(u0 + (1 - u0) * k / n, sgn),
            APEX + (u0 + (1 - u0) * k / n) * (YB_LAT[sgn] - APEX)) for k in range(n + 1)]
    med = [(MIDX + sgn * _med_off(u0 + (1 - u0) * k / n, sgn),
            APEX + (u0 + (1 - u0) * k / n) * (YB_MED[sgn] - APEX)) for k in range(n + 1)]
    p0, p1 = lat[-1], med[-1]
    base = [(p0[0] + (p1[0] - p0[0]) * s / 40,
             p0[1] + (p1[1] - p0[1]) * s / 40 - 64 * math.sin(math.pi * s / 40))
            for s in range(41)]
    A, B = med[0], lat[0]                              # rounded apex, quadratic
    cxp = ((A[0] + B[0]) / 2, (A[1] + B[1]) / 2 - 58)
    cap = []
    for k in range(25):
        s = k / 24
        cap.append(((1 - s) ** 2 * A[0] + 2 * (1 - s) * s * cxp[0] + s * s * B[0],
                    (1 - s) ** 2 * A[1] + 2 * (1 - s) * s * cxp[1] + s * s * B[1]))
    return lat + base + med[::-1] + cap


def _tube(a, pts, d0, d1, w=1.8, rings=0):
    """A tapering airway drawn as two offset walls, optionally ringed.

    Cartilage rings are what makes a trachea read as a trachea rather than as a
    thick line, and they come free once the walls are offset properly."""
    n = len(pts) - 1
    left, right = [], []
    for i, p in enumerate(pts):
        q = pts[min(i + 1, n)] if i < n else pts[i]
        r = pts[max(i - 1, 0)]
        ang = math.atan2(q[1] - r[1], q[0] - r[0]) + math.pi / 2
        h = (d0 + (d1 - d0) * i / n) / 2
        left.append((p[0] + h * math.cos(ang), p[1] + h * math.sin(ang)))
        right.append((p[0] - h * math.cos(ang), p[1] - h * math.sin(ang)))
    a.path(left, w=w)
    a.path(right, w=w)
    for k in range(rings):
        i = int((k + 0.5) / rings * n)
        a.path([left[i], right[i]], w=w * 0.62)


def bronchial_tree():
    a = Art(1200, 1200)

    for sgn in (-1, 1):
        a.path(_lung_outline(sgn), close=True, w=2.4)

    # Lobar fissures. Chords between the two borders at known heights: the
    # oblique fissure in both fields, the horizontal one only on the right.
    edge = lambda u, sgn, lateral: (
        MIDX + sgn * (_lat_off(u, sgn) if lateral else _med_off(u, sgn)),
        APEX + u * ((YB_LAT[sgn] if lateral else YB_MED[sgn]) - APEX))
    shrink = lambda A, B, f: (A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f)
    for sgn in (-1, 1):
        A, B = edge(0.27, sgn, False), edge(0.78, sgn, True)
        a.path([shrink(A, B, 0.03), shrink(A, B, 0.97)], w=1.2, dash="15 9")
        if sgn < 0:                                    # horizontal fissure
            m = shrink(A, B, 0.52)
            a.path([shrink(edge(0.40, sgn, False), m, 0.04), m], w=1.2, dash="15 9")

    # --- trachea and carina ------------------------------------------------
    # Each main bronchus leaves the carina directly under its own tracheal wall,
    # so the two tubes never cross the midline or each other.
    Y_TOP, Y_CAR, R_TRA = 96.0, 320.0, 26.0
    _tube(a, [(MIDX, Y_TOP), (MIDX, Y_CAR)], 2 * R_TRA + 2, 2 * R_TRA, w=2.2, rings=9)
    a.path([(MIDX - R_TRA + 3, Y_CAR), (MIDX, Y_CAR + 30),
            (MIDX + R_TRA - 3, Y_CAR)], w=1.8)         # carinal spur

    # The right main bronchus is short and steep, the left long and shallow -
    # the asymmetry that decides where an inhaled object lands.
    hila = {-1: (MIDX - 138, 486.0), 1: (MIDX + 168, 462.0)}
    for sgn in (-1, 1):
        hx, hy = hila[sgn]
        x0 = MIDX + sgn * R_TRA
        stem = [(x0, Y_CAR - 8), (x0 + (hx - x0) * 0.42, Y_CAR + (hy - Y_CAR) * 0.66),
                (hx, hy)]
        pts = [((1 - s / 24) ** 2 * stem[0][0] + 2 * (1 - s / 24) * (s / 24) * stem[1][0]
                + (s / 24) ** 2 * stem[2][0],
                (1 - s / 24) ** 2 * stem[0][1] + 2 * (1 - s / 24) * (s / 24) * stem[1][1]
                + (s / 24) ** 2 * stem[2][1]) for s in range(25)]
        _tube(a, pts, 46, 26, w=1.9, rings=6)

        # --- airway field --------------------------------------------------
        # Attractors are sampled directly between the two borders at a given
        # height, so every one of them is inside the lung by construction. The
        # row is then accepted in proportion to its own width - without that,
        # every height gets the same count and the broad lung base, which is
        # where most of the parenchyma actually is, grows nearly bare.
        rnd = random.Random(31 if sgn < 0 else 37)
        span = lambda y: (_med_off((y - APEX) / (YB_MED[sgn] - APEX), sgn),
                          _lat_off((y - APEX) / (YB_LAT[sgn] - APEX), sgn))
        y0, y1 = APEX + 74, YB_MED[sgn] - 6
        w_max = max(ol - om for om, ol in
                    (span(y0 + (y1 - y0) * k / 120) for k in range(121)))
        attractors = []
        while len(attractors) < 2600:
            y = rnd.uniform(y0, y1)
            u_m = (y - APEX) / (YB_MED[sgn] - APEX)
            if u_m > 0.985:
                continue
            om, ol = span(y)
            if ol - om < 74 or rnd.random() > (ol - om) / w_max:
                continue
            attractors.append((MIDX + sgn * rnd.uniform(om + 32, ol - 30), y))
        nodes = space_colonise(attractors, [(hx, hy)], influence=74, kill=11,
                               step=10, max_nodes=1100)
        draw_network(a, nodes, w_tip=0.7, w_root=4.6, exp=2.4)

    a.path([(MIDX, 60), (MIDX, 1090)], w=1.0, dash="26 10 4 10")
    return a, "Bronchial tree grown by space colonisation inside both lung fields"


# --- 27. Hypodermic syringe ------------------------------------------------
# A 10 mL Luer-slip syringe with a 21G x 1½ needle, in millimetres. Every
# landmark below is a real dimension; the drawing is a projection of them.
X_THUMB, X_ROD, X_FLANGE = 0.0, 4.0, 30.0
X_BARREL, X_PISTON, X_SHOULDER = 34.0, 70.0, 118.0
X_NOZZLE, X_HUB, X_CANNULA, X_TIP = 126.0, 133.0, 153.0, 192.0
R_BARREL, R_BORE, R_ROD, R_NEEDLE = 8.25, 7.40, 3.20, 0.55
BEVEL = math.radians(12.0)              # lancet primary bevel


def _bevel_geometry(r):
    """Axial run of a lancet bevel on a tube of radius r, from heel to tip.

    In a true side elevation the elliptical cut collapses to a straight line -
    the projection is degenerate - so the bevel is two slanted lines, outer wall
    and lumen, which is exactly how it reads on a real drawing."""
    return 2 * r / math.tan(BEVEL)


def syringe():
    a = Art(1340, 500)
    S, X0, YA = 6.2, 62.0, 316.0           # px per mm, origin, axis height
    T = lambda x, y: (X0 + x * S, YA - y * S)
    box = lambda x0, y0, x1, y1, w=1.6: a.path(
        [T(x0, y0), T(x1, y0), T(x1, y1), T(x0, y1)], close=True, w=w)

    # --- plunger -----------------------------------------------------------
    box(X_THUMB, -13.0, X_ROD, 13.0, w=2.0)                 # thumb rest, edge on
    for sgn in (-1, 1):                                     # cruciform rod
        a.path([T(X_ROD, sgn * R_ROD), T(X_PISTON, sgn * R_ROD)],
               w=1.6 if sgn < 0 else 1.6)
        a.path([T(X_ROD, sgn * 0.9), T(X_PISTON, sgn * 0.9)], w=0.8)
    a.path([T(X_PISTON - 8.0, R_BORE), T(X_PISTON - 1.5, R_BORE),
            T(X_PISTON, R_BORE - 1.6), T(X_PISTON, -R_BORE + 1.6),
            T(X_PISTON - 1.5, -R_BORE), T(X_PISTON - 8.0, -R_BORE)],
           close=True, w=1.7)                               # piston stopper
    for x in (X_PISTON - 6.0, X_PISTON - 2.8):              # sealing ribs
        a.path([T(x, -R_BORE), T(x, R_BORE)], w=1.0)

    # --- barrel ------------------------------------------------------------
    for sgn in (-1, 1):
        a.path([T(X_BARREL, sgn * R_BARREL), T(X_SHOULDER, sgn * R_BARREL)], w=2.2)
        a.path([T(X_BARREL, sgn * R_BORE), T(X_SHOULDER, sgn * R_BORE)], w=1.1)
    box(X_FLANGE, -15.0, X_BARREL, 15.0, w=2.0)             # finger flange
    a.path([T(X_BARREL, R_BARREL), T(X_BARREL, -R_BARREL)], w=1.1)

    # Graduation scale: 0,2 mL minor, 1 mL major, zero at the nozzle end.
    G0, G1, N = 40.0, 114.0, 50
    for k in range(N + 1):
        x = G1 - (G1 - G0) * k / N
        major = k % 5 == 0
        a.path([T(x, R_BARREL - 0.6), T(x, R_BARREL - (5.0 if major else 2.4))],
               w=1.05 if major else 0.75)

    # --- nozzle, hub and cannula -------------------------------------------
    X_SEAT = X_HUB + 11.0
    for sgn in (-1, 1):
        a.path([T(X_SHOULDER, sgn * R_BARREL), T(X_NOZZLE, sgn * 2.30),
                T(X_HUB, sgn * 2.05)], w=1.9)               # 6 % Luer taper
        a.path([T(X_HUB, sgn * 5.40), T(X_SEAT, sgn * 5.40),
                T(X_CANNULA, sgn * 2.60)], w=1.8)           # hub barrel + cone
        a.path([T(X_HUB, sgn * 5.40), T(X_HUB, sgn * 2.05)], w=1.4)
    for x in (X_HUB + 3.0, X_HUB + 6.0, X_HUB + 9.0):       # hub grip ribs
        a.path([T(x, -5.40), T(x, 5.40)], w=0.8)
    a.path([T(X_CANNULA, 2.60), T(X_CANNULA, -2.60)], w=1.2)

    blen = _bevel_geometry(R_NEEDLE)
    x_heel = X_TIP - blen
    a.path([T(X_CANNULA, R_NEEDLE), T(X_TIP, R_NEEDLE)], w=1.5)      # bevel side
    a.path([T(X_CANNULA, -R_NEEDLE), T(x_heel, -R_NEEDLE)], w=1.5)   # heel side
    a.path([T(X_TIP, R_NEEDLE), T(x_heel, -R_NEEDLE)], w=1.3)        # primary bevel

    # The centreline stops at the hub: run through the cannula it would swallow
    # a needle only 1,1 mm across and the tip would read as one line, not a tube.
    a.path([T(-6.0, 0.0), T(X_HUB - 1.0, 0.0)], w=1.1, dash="26 10 4 10")

    # --- detail A: the bevel, enlarged -------------------------------------
    # Not a second side elevation. The bevel plane's normal has no component
    # along the line of sight in elevation, so the cut projects to a straight
    # line and the tip reads as a bare wedge. Rolling the view PSI about the
    # needle's own axis opens the face: the rim becomes the long lens every
    # hypodermic point is recognised by, while the tube silhouette stays at
    # plus or minus r because rolling a cylinder about its axis changes nothing.
    BX, BY, K, RD = 1044.0, 152.0, 6.5, 144.0   # centre, magnification, balloon
    PSI = math.radians(62.0)
    tip = T(X_TIP, 0.0)
    a.circle(tip[0] - 16, tip[1], 50, w=1.1, dash="9 7")
    a.path([(tip[0] - 16 - 35, tip[1] - 35),
            (BX + RD * 0.72, BY + RD * 0.72)], w=0.9, dash="12 7")
    a.circle(BX, BY, RD, w=1.1, dash="9 7")

    r, ri = R_NEEDLE * S * K, R_NEEDLE * 0.56 * S * K
    B, SHAFT = 1 / math.tan(BEVEL), 52.0
    ox = BX - (2 * B * r - SHAFT) / 2           # centre the whole detail
    D = lambda dx, dy: (ox + dx, BY + dy)

    def cut(rr, n=140):
        """Rim of the cut on a coaxial tube of radius rr, in the rolled view."""
        return [D(B * r + B * rr * math.cos(t), rr * math.cos(t + PSI))
                for t in (2 * math.pi * k / n for k in range(n))]

    # Each silhouette runs out to where the cut crosses it, which is not the
    # same station on the two sides - that offset is the bevel.
    a.path([D(-SHAFT, r), D(B * r * (1 + math.cos(PSI)), r)], w=1.7)
    a.path([D(-SHAFT, -r), D(B * r * (1 - math.cos(PSI)), -r)], w=1.7)
    a.path(cut(r), close=True, w=1.5)                       # bevel face rim
    a.path(cut(ri), close=True, w=1.0)                      # lumen opening
    a.path([D(-SHAFT, ri), D(-SHAFT + 18, ri)], w=0.9, dash="7 5")
    a.path([D(-SHAFT, -ri), D(-SHAFT + 18, -ri)], w=0.9, dash="7 5")
    a.path([D(-SHAFT - 12, 0.0), D(2 * B * r + 12, 0.0)], w=0.9, dash="20 8 3 8")
    a.text(tip[0] - 16, tip[1] - 62, "A", size=22, weight=600)
    a.text(BX - RD - 16, BY + 8, "A", size=22, anchor="end", weight=600)

    # --- dimensions --------------------------------------------------------
    a.dim(*T(X_THUMB, 0.0), *T(X_TIP, 0.0), "192", off=122, size=21)
    xd = T(X_BARREL, 0.0)[0] - 76               # clear of flange and thumb rest
    p0, p1 = (xd, T(0, R_BARREL)[1]), (xd, T(0, -R_BARREL)[1])
    a.path([p0, p1], w=1.1)
    a.arrow(p0[0], p0[1], math.pi / 2, size=12, w=1.1)
    a.arrow(p1[0], p1[1], -math.pi / 2, size=12, w=1.1)
    for y in (R_BARREL, -R_BARREL):
        a.path([(T(X_BARREL, y)[0] - 6, T(0, y)[1]), (xd - 9, T(0, y)[1])], w=0.8)
    a.text(xd, p0[1] - 14, "Ø 16,5", size=20)
    return a, "Hypodermic syringe, dimensioned side elevation with bevel detail"


MEDICINE = {
    "mockup-24-medicine-ecg": ecg,
    "mockup-25-medicine-bone-section": bone_section,
    "mockup-26-medicine-bronchial-tree": bronchial_tree,
    "mockup-27-medicine-syringe": syringe,
}
