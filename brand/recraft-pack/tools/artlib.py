"""Shared plumbing for the Patronos mockup generators.

Holds the brand ramp, the geometry collector, stroke-to-outline conversion and
the SVG writers. The drawings themselves live in make_mockups.py.
"""
import math
import os
import sys

STOPS = ["#ff9700", "#ff6253", "#fc4696", "#c964e2"]
W = H = 1200


# --- colour ----------------------------------------------------------------
def _rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def grad(t):
    """Solid colour at position t in [0,1] along the 4-stop brand gradient."""
    t = min(max(t, 0.0), 1.0) * (len(STOPS) - 1)
    i = min(int(t), len(STOPS) - 2)
    f = t - i
    a, b = _rgb(STOPS[i]), _rgb(STOPS[i + 1])
    return "#%02x%02x%02x" % tuple(round(a[k] + (b[k] - a[k]) * f) for k in range(3))


# --- geometry collection ---------------------------------------------------
class Art:
    """Collects raw geometry so it can be emitted as strokes or as outlines."""

    def __init__(self, w=1200, h=1200):
        self.items = []
        self.W, self.H = w, h        # canvas; a rocket elevation is not square

    def path(self, pts, close=False, w=2.2, dash=None, t=None):
        self.items.append(dict(kind="poly", pts=list(pts), close=close,
                               w=w, dash=dash, t=t))

    def circle(self, cx, cy, r, w=2.2, dash=None, t=None):
        self.items.append(dict(kind="circle", cx=cx, cy=cy, r=r,
                               w=w, dash=dash, t=t))

    def line(self, x1, y1, x2, y2, **kw):
        self.path([(x1, y1), (x2, y2)], **kw)

    def text(self, x, y, s, size=20, anchor="middle", weight=500, t=None):
        self.items.append(dict(kind="text", x=x, y=y, s=s, size=size,
                               anchor=anchor, weight=weight, w=0, dash=None, t=t))

    def arrow(self, x, y, ang, size=14, w=1.2, t=None):
        """Open V arrowhead, the technical-drawing convention. Stroke only."""
        for d in (2.5, -2.5):
            self.path([(x + size * math.cos(ang + d), y + size * math.sin(ang + d)),
                       (x, y)], w=w, t=t)

    def dim(self, x1, y1, x2, y2, label, off=0, size=20, w=1.1):
        """Dimension line with arrowheads at both ends and a centred label."""
        ang = math.atan2(y2 - y1, x2 - x1)
        nx, ny = -math.sin(ang) * off, math.cos(ang) * off
        a, b = (x1 + nx, y1 + ny), (x2 + nx, y2 + ny)
        self.path([a, b], w=w)
        self.arrow(a[0], a[1], ang, w=w)
        self.arrow(b[0], b[1], ang + math.pi, w=w)
        for p, q in ((a, (x1, y1)), (b, (x2, y2))):        # extension lines
            self.path([q, (p[0] + nx * 0.12, p[1] + ny * 0.12)], w=w * 0.8)
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
        self.text(mx, my - 9, label, size=size)

    def rrect(self, x, y, w_, h_, r=14, **kw):
        """Rounded rectangle as a closed polyline."""
        pts = []
        for cx, cy, a0 in ((x + w_ - r, y + r, -math.pi / 2), (x + w_ - r, y + h_ - r, 0),
                           (x + r, y + h_ - r, math.pi / 2), (x + r, y + r, math.pi)):
            pts += [(cx + r * math.cos(a0 + math.pi / 2 * k / 8),
                     cy + r * math.sin(a0 + math.pi / 2 * k / 8)) for k in range(9)]
        self.path(pts, close=True, **kw)


def polyline_of(it, n=240):
    """Every primitive as a point list, so outlining has one code path.

    Circle resolution follows the radius. A flat 360 segments turns a 2.6 px
    cage-nut hole into a 360-point polygon, and a rack full of them into a
    multi-megabyte file that PowerPoint struggles to place."""
    if it["kind"] == "text":
        return [(it["x"], it["y"])], False
    if it["kind"] == "circle":
        m = max(12, min(n, int(2.4 * math.sqrt(max(it["r"], 1)) * 3)))
        return [(it["cx"] + it["r"] * math.cos(2 * math.pi * k / m),
                 it["cy"] + it["r"] * math.sin(2 * math.pi * k / m))
                for k in range(m)], True
    return it["pts"], it["close"]


def centroid(it):
    pts, _ = polyline_of(it, n=24)
    return (sum(p[0] for p in pts) / len(pts),
            sum(p[1] for p in pts) / len(pts))


def normalise(art):
    """Rescale gradient positions so the drawing spans the full ramp.

    Without this, centroids cluster near the middle of the 135deg axis and the
    whole illustration comes out pink instead of orange-to-violet."""
    raw = []
    for it in art.items:
        if it["t"] is None:
            c = centroid(it)
            raw.append(c[0] + c[1])
        else:
            raw.append(None)
    known = [v for v in raw if v is not None]
    if known:
        lo, hi = min(known), max(known)
        span = (hi - lo) or 1.0
        for it, v in zip(art.items, raw):
            if v is not None:
                it["t"] = (v - lo) / span


# --- stroke -> outline -----------------------------------------------------
def dash_split(pts, dash):
    """Cut a polyline into the on-segments of a stroke-dasharray."""
    if not dash:
        return [pts]
    pattern = [float(v) for v in dash.split()]
    out, cur = [], [pts[0]]
    idx, left, on = 0, pattern[0], True
    for a, b in zip(pts, pts[1:]):
        seg = math.dist(a, b)
        pos = 0.0
        while seg - pos > 1e-9:
            step = min(left, seg - pos)
            pos += step
            left -= step
            q = (a[0] + (b[0] - a[0]) * pos / seg, a[1] + (b[1] - a[1]) * pos / seg)
            if on:
                cur.append(q)
            if left <= 1e-9:                       # pattern element exhausted
                if on and len(cur) > 1:
                    out.append(cur)
                idx = (idx + 1) % len(pattern)
                left, on = pattern[idx], not on
                cur = [q]
    if on and len(cur) > 1:
        out.append(cur)
    return out


def offset_outline(pts, w, closed):
    """Turn a polyline into the closed polygon that its stroke covers."""
    pts = [p for i, p in enumerate(pts) if i == 0 or math.dist(p, pts[i - 1]) > 1e-9]
    if len(pts) < 2:
        return None
    if closed and math.dist(pts[0], pts[-1]) > 1e-9:
        pts = pts + [pts[0]]
    h, left, right = w / 2, [], []
    n = len(pts)
    for i, p in enumerate(pts):
        if closed:
            a, b = pts[(i - 1) % (n - 1)], pts[(i + 1) % (n - 1)]
        else:
            a = pts[i - 1] if i > 0 else p
            b = pts[i + 1] if i < n - 1 else p
        tx, ty = b[0] - a[0], b[1] - a[1]
        m = math.hypot(tx, ty) or 1.0
        nx, ny = -ty / m, tx / m                   # left normal
        left.append((p[0] + nx * h, p[1] + ny * h))
        right.append((p[0] - nx * h, p[1] - ny * h))
    return left + right[::-1]


def signed_area(poly):
    return 0.5 * sum(poly[i][0] * poly[(i + 1) % len(poly)][1]
                     - poly[(i + 1) % len(poly)][0] * poly[i][1]
                     for i in range(len(poly)))


def outline_polygons(art):
    """Every stroke in the drawing as consistently-wound filled polygons.

    Consistent winding matters: with fill-rule="nonzero", two overlapping
    polygons wound in opposite directions cancel and punch a hole where the
    lines cross. Forcing them all one way makes crossings merge instead."""
    polys = []
    for it in art.items:
        if it["kind"] == "text":
            continue
        pts, closed = polyline_of(it)
        for run in dash_split(pts + ([pts[0]] if closed else []), it["dash"]):
            poly = offset_outline(run, it["w"], closed and not it["dash"])
            if poly and len(poly) >= 3:
                polys.append(poly if signed_area(poly) > 0 else poly[::-1])
    return polys


# --- writers ---------------------------------------------------------------
def gradient_vector(art):
    """Endpoints of the 135deg gradient, at the artwork's true extremes.

    Using the bounding box corners is not enough: a wide, flat drawing never
    reaches its own corners, so the last stop never shows and the illustration
    tails off in magenta instead of violet. Projecting every point onto the
    135deg axis and taking the extremes guarantees the full ramp is spent on
    the art that is actually there."""
    ux = uy = 1 / math.sqrt(2)
    proj = []
    for it in art.items:
        if it["kind"] == "circle":
            c = it["cx"] * ux + it["cy"] * uy
            proj += [c - it["r"], c + it["r"]]
        elif it["kind"] == "text":
            proj.append(it["x"] * ux + it["y"] * uy)
        else:
            proj += [x * ux + y * uy for x, y in it["pts"]]
    lo, hi = min(proj), max(proj)
    return lo * ux, lo * uy, hi * ux, hi * uy


def defs(art):
    """The gradient, pinned to the artwork's 135deg diagonal in user space.

    gradientUnits="userSpaceOnUse" is not optional here. The default,
    objectBoundingBox, resolves against EACH element's own box, so every
    individual line would re-run the whole orange-to-violet ramp over itself -
    and any perfectly horizontal or vertical line, having a zero-height or
    zero-width box, would not paint at all. Pinning the vector to the drawing's
    own bounds makes one continuous sweep across the whole illustration and
    guarantees both end stops are actually reached."""
    x0, y0, x1, y1 = gradient_vector(art)
    stops = "\n".join(
        f'      <stop offset="{i / (len(STOPS) - 1) * 100:.0f}%" stop-color="{c}"/>'
        for i, c in enumerate(STOPS))
    return ('  <defs>\n'
            '    <linearGradient id="patronos" gradientUnits="userSpaceOnUse"\n'
            f'        x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}">\n'
            f'{stops}\n'
            '    </linearGradient>\n  </defs>\n')


def head(title, art=None):
    w, h = (art.W, art.H) if art is not None else (W, H)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'width="{w}" height="{h}">\n  <title>{title}</title>\n')


FONT = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"


def el(it, colour):
    dash = f' stroke-dasharray="{it["dash"]}"' if it["dash"] else ""
    c = f' stroke="{colour}"' if colour else ""
    if it["kind"] == "text":
        fill = colour or "url(#patronos)"
        return (f'    <text x="{it["x"]:.2f}" y="{it["y"]:.2f}" font-family="{FONT}" '
                f'font-size="{it["size"]}" font-weight="{it["weight"]}" '
                f'letter-spacing="0.06em" text-anchor="{it["anchor"]}" '
                f'fill="{fill}" stroke="none">{it["s"]}</text>\n')
    if it["kind"] == "circle":
        g = f'<circle cx="{it["cx"]:.2f}" cy="{it["cy"]:.2f}" r="{it["r"]:.2f}"'
    else:
        d = "M " + " L ".join(f"{x:.2f},{y:.2f}" for x, y in it["pts"])
        g = f'<path d="{d}{" Z" if it["close"] else ""}"'
    return f'    {g}{c} stroke-width="{it["w"]}"{dash}/>\n'


STEPS = 72          # colour resolution across a drawing


def chunk_by_colour(art, it):
    """Split one path into runs short enough to be a single flat colour.

    Colouring a whole element at once is fine for small shapes but obvious on
    long ones: the turbofan's outer case would be one flat pink where the true
    gradient sweeps orange to violet around it. Cutting each path wherever its
    position on the 135deg axis has moved by 1/STEPS of the drawing gives a ramp
    along the line itself, still using nothing but solid colours."""
    pts, closed = polyline_of(it, n=360)
    if closed:
        pts = pts + [pts[0]]
    u = 1 / math.sqrt(2)
    lo, hi = art._proj_range
    tol = (hi - lo) / STEPS
    runs, run, anchor = [], [pts[0]], (pts[0][0] + pts[0][1]) * u
    for q in pts[1:]:
        run.append(q)
        pq = (q[0] + q[1]) * u
        if abs(pq - anchor) >= tol:
            runs.append(run)
            run, anchor = [q], pq
    if len(run) > 1:
        runs.append(run)
    elif runs:
        runs[-1].append(run[0])
    out = []
    for r in runs:
        mid = r[len(r) // 2]
        t = ((mid[0] + mid[1]) * u - lo) / ((hi - lo) or 1.0)
        out.append((r, grad(t)))
    return out


def write_stroked(art, title, stepped):
    if not stepped:
        body = "".join(el(it, None) for it in art.items)
        return (head(title, art) + defs(art)
                + f'  <g fill="none" stroke="url(#patronos)" stroke-linecap="round" '
                  f'stroke-linejoin="round">\n{body}  </g>\n</svg>\n')

    u = 1 / math.sqrt(2)
    proj = []
    for it in art.items:
        pts, _ = polyline_of(it, n=48)
        proj += [(x + y) * u for x, y in pts]
    art._proj_range = (min(proj), max(proj)) if proj else (0.0, 1.0)

    u = 1 / math.sqrt(2)
    lo, hi = art._proj_range
    tol = (hi - lo) / STEPS

    body = ""
    for it in art.items:
        # text and dashed reference lines stay whole: chunking a dash pattern
        # restarts it at every cut and destroys the dash-dot rhythm
        if it["kind"] == "text" or it["dash"]:
            body += el(it, grad(it["t"] or 0.0))
            continue
        pts, _ = polyline_of(it, n=48)
        proj = [(x + y) * u for x, y in pts]
        if max(proj) - min(proj) < tol:
            # shorter than one colour step: emit the primitive as it is, one
            # flat colour. Keeps <circle> a circle instead of a polygon.
            body += el(it, grad(((sum(proj) / len(proj)) - lo) / ((hi - lo) or 1)))
            continue
        for run, colour in chunk_by_colour(art, it):
            d = "M " + " L ".join(f"{x:.2f},{y:.2f}" for x, y in run)
            body += (f'    <path d="{d}" stroke="{colour}" '
                     f'stroke-width="{it["w"]}"/>\n')
    return (head(title, art)
            + f'  <g fill="none" stroke-linecap="round" '
              f'stroke-linejoin="round">\n{body}  </g>\n</svg>\n')


def write_outlined(art, title):
    """Strokes become one compound filled path; text stays live text.

    Glyphs are not outlined - that needs the font binary - so a drawing with
    labels still depends on the viewer having a sans-serif to hand. Labels
    carry fill="url(#patronos)", which is the well-supported gradient form
    anyway."""
    d = " ".join("M " + " L ".join(f"{x:.2f},{y:.2f}" for x, y in poly) + " Z"
                 for poly in outline_polygons(art))
    labels = "".join(el(it, None) for it in art.items if it["kind"] == "text")
    return (head(title, art) + defs(art)
            + f'  <path d="{d}" fill="url(#patronos)" fill-rule="nonzero" '
              f'stroke="none"/>\n{labels}</svg>\n')




# --- shared profile geometry ----------------------------------------------
def naca4(m, p, t, n=180):
    """NACA 4-digit profile on unit chord: (upper, lower) point lists."""
    up, lo = [], []
    for i in range(n + 1):
        x = (1 - math.cos(math.pi * i / n)) / 2          # cosine spacing
        yt = 5 * t * (0.2969 * math.sqrt(x) - 0.1260 * x - 0.3516 * x ** 2
                      + 0.2843 * x ** 3 - 0.1015 * x ** 4)
        if x < p:
            yc, dy = m / p ** 2 * (2 * p * x - x ** 2), 2 * m / p ** 2 * (p - x)
        else:
            q = (1 - p) ** 2
            yc, dy = m / q * ((1 - 2 * p) + 2 * p * x - x ** 2), 2 * m / q * (p - x)
        th = math.atan(dy)
        up.append((x - yt * math.sin(th), yc + yt * math.cos(th)))
        lo.append((x + yt * math.sin(th), yc - yt * math.cos(th)))
    return up, lo


def naca_like(x, y, chord, twist, m=0.06, p=0.4, t=0.10):
    """A cambered aerofoil section placed and rotated in y-up coordinates.

    Used for wing elements on the racing car, where a real section reads far
    better than a lens shape."""
    up, lo = naca4(m, p, t, n=90)
    ct, st = math.cos(twist), math.sin(twist)
    out = []
    for u, v in up + lo[::-1]:
        u, v = (u - 0.25) * chord, v * chord
        out.append((x + u * ct - v * st, y + u * st + v * ct))
    return out


def union_outline(circles, pad=14, step=4.0):
    """Closed contours of the union of a set of circles, by marching squares.

    A cloud symbol is the union of overlapping discs. Tracing that boundary
    analytically means arc-tangent bookkeeping for every pair; sampling the
    field and marching it is shorter, and at a 4 px grid the result is smooth
    at hairline weight. Returns a list of point lists."""
    xs = [c[0] for c in circles]
    ys = [c[1] for c in circles]
    rs = [c[2] for c in circles]
    x0, x1 = min(x - r for x, r in zip(xs, rs)) - pad, max(x + r for x, r in zip(xs, rs)) + pad
    y0, y1 = min(y - r for y, r in zip(ys, rs)) - pad, max(y + r for y, r in zip(ys, rs)) + pad
    nx, ny = int((x1 - x0) / step) + 2, int((y1 - y0) / step) + 2

    def f(ix, iy):
        x, y = x0 + ix * step, y0 + iy * step
        return max(r - math.hypot(x - cx, y - cy) for cx, cy, r in circles)

    grid = [[f(ix, iy) for iy in range(ny)] for ix in range(nx)]
    pt = lambda ix, iy: (x0 + ix * step, y0 + iy * step)

    def lerp(pa, pb, va, vb):
        t = 0.5 if abs(vb - va) < 1e-9 else va / (va - vb)
        return (pa[0] + (pb[0] - pa[0]) * t, pa[1] + (pb[1] - pa[1]) * t)

    segs = []
    for ix in range(nx - 1):
        for iy in range(ny - 1):
            v = [grid[ix][iy], grid[ix + 1][iy], grid[ix + 1][iy + 1], grid[ix][iy + 1]]
            c = [pt(ix, iy), pt(ix + 1, iy), pt(ix + 1, iy + 1), pt(ix, iy + 1)]
            idx = sum((1 << k) for k in range(4) if v[k] > 0)
            if idx in (0, 15):
                continue
            crossings = [lerp(c[k], c[(k + 1) % 4], v[k], v[(k + 1) % 4])
                         for k in range(4) if (v[k] > 0) != (v[(k + 1) % 4] > 0)]
            for k in range(0, len(crossings) - 1, 2):
                segs.append((crossings[k], crossings[k + 1]))

    key = lambda p: (round(p[0], 3), round(p[1], 3))
    adj = {}
    for a_, b_ in segs:
        adj.setdefault(key(a_), []).append(b_)
        adj.setdefault(key(b_), []).append(a_)
    seen, loops = set(), []
    for start in list(adj):
        if start in seen:
            continue
        loop, cur, prev = [], start, None
        while cur is not None and cur not in seen:
            seen.add(cur)
            loop.append(cur)
            nxt = None
            for cand in adj.get(cur, []):
                if key(cand) != prev and key(cand) not in seen:
                    nxt = cand
                    break
            prev, cur = cur, (key(nxt) if nxt else None)
        if len(loop) > 8:
            loops.append([(p[0], p[1]) for p in loop])
    return loops
