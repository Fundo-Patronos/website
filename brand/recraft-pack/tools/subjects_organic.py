"""Organic subjects, still generated rather than traced.

Branching structure in nature is not freehand - it is the output of a growth
rule. Space colonisation (Runions et al., 2005) grows a vein or dendrite network
toward scattered attractor points, and produces leaf venation and dendritic
arbours that a botanist or a neuroscientist reads as correct. Vessel widths come
from Murray's law, so junctions taper the way real ones do.

This covers a good part of what looked like it needed tracing. What genuinely
does not reduce to a growth rule - a heart, a hand, a named animal - is still a
shape-memory problem, and belongs on the reference-and-trace path in README.md.
"""
import math
import random

from artlib import Art


def _grid_key(p, cell):
    return (int(p[0] // cell), int(p[1] // cell))


def space_colonise(attractors, seeds, influence, kill, step, max_nodes=1400):
    """Grow a branching network from seeds toward attractor points.

    A spatial hash keeps the nearest-node query local; the naive all-pairs form
    is O(attractors x nodes) per step and will not finish on this many points."""
    nodes = [{"p": s, "parent": None} for s in seeds]
    attr = list(attractors)
    cell = influence
    grid = {}
    for i, n in enumerate(nodes):
        grid.setdefault(_grid_key(n["p"], cell), []).append(i)

    def nearest(a):
        kx, ky = _grid_key(a, cell)
        best, bd = None, influence
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                for i in grid.get((kx + dx, ky + dy), ()):
                    d = math.dist(a, nodes[i]["p"])
                    if d < bd:
                        bd, best = d, i
        return best

    while attr and len(nodes) < max_nodes:
        grown_before = len(nodes)
        pull = {}
        for a in attr:
            i = nearest(a)
            if i is not None:
                pull.setdefault(i, []).append(a)
        if not pull:
            break
        for i, ats in pull.items():
            px, py = nodes[i]["p"]
            dx = sum(a[0] - px for a in ats)
            dy = sum(a[1] - py for a in ats)
            m = math.hypot(dx, dy)
            if m < 1e-9:
                continue
            q = (px + step * dx / m, py + step * dy / m)
            nodes.append({"p": q, "parent": i})
            grid.setdefault(_grid_key(q, cell), []).append(len(nodes) - 1)
        if len(nodes) == grown_before:
            break                       # nothing advanced; the field is exhausted
        attr = [a for a in attr
                if (i := nearest(a)) is None or math.dist(a, nodes[i]["p"]) > kill]
    return nodes


def draw_network(a, nodes, w_tip=0.75, w_root=4.6, exp=2.6):
    """Draw the network, thickness from subtree size (Murray's law)."""
    size = [1] * len(nodes)
    for i in range(len(nodes) - 1, 0, -1):
        p = nodes[i]["parent"]
        if p is not None:
            size[p] += size[i]
    smax = max(size) or 1
    for i, n in enumerate(nodes):
        p = n["parent"]
        if p is None:
            continue
        w = w_tip + (w_root - w_tip) * (size[i] / smax) ** (1 / exp)
        a.path([nodes[p]["p"], n["p"]], w=round(w, 2))


# --- 17. Leaf with venation -----------------------------------------------
def leaf():
    rnd = random.Random(7)
    a = Art(820, 1200)
    CX, TIP, BASE = 410, 120, 1010
    L = BASE - TIP
    half = lambda t: 250 * (t ** 0.52) * ((1 - t) ** 0.78) * 1.62   # t: tip->base

    outline = ([(CX - half(k / 120), BASE - L * (1 - k / 120)) for k in range(121)]
               + [(CX + half(k / 120), BASE - L * (1 - k / 120)) for k in range(120, -1, -1)])
    a.path(outline, close=True, w=2.4)
    for k in range(4, 118, 5):                                      # serrated margin
        t = k / 120
        y = BASE - L * (1 - t)
        for sgn in (-1, 1):
            a.path([(CX + sgn * half(t), y),
                    (CX + sgn * (half(t) + 9), y - L / 120 * 2.4),
                    (CX + sgn * half((k + 5) / 120), BASE - L * (1 - (k + 5) / 120))],
                   w=1.0)
    a.path([(CX, BASE), (CX + 6, BASE + 96), (CX + 2, BASE + 150)], w=3.0)  # petiole

    attractors = []
    while len(attractors) < 900:
        t = rnd.random()
        x = CX + rnd.uniform(-1, 1) * half(t) * 0.94
        y = BASE - L * (1 - t)
        if t > 0.015:
            attractors.append((x, y))
    seeds = [(CX, BASE - L * (1 - 0.02) + k * 6) for k in range(1)]
    nodes = space_colonise(attractors, seeds, influence=96, kill=20, step=15,
                           max_nodes=1300)
    draw_network(a, nodes, w_tip=0.7, w_root=4.2)
    return a, "Leaf with venation grown by space colonisation"


# --- 18. Neuron -----------------------------------------------------------
def neuron():
    rnd = random.Random(11)
    a = Art(1200, 1200)
    SX, SY = 470, 470
    soma = [(SX + (56 + 9 * math.sin(3.1 * k / 3)) * math.cos(2 * math.pi * k / 48),
             SY + (50 + 8 * math.cos(2.3 * k / 3)) * math.sin(2 * math.pi * k / 48))
            for k in range(48)]
    a.path(soma, close=True, w=2.4)
    a.circle(SX - 6, SY - 4, 20, w=1.4)                             # nucleus
    a.circle(SX - 6, SY - 4, 7, w=1.0)

    attractors = []
    while len(attractors) < 820:                                    # dendritic field
        ang = rnd.uniform(0, 2 * math.pi)
        r = 88 + 330 * math.sqrt(rnd.random())
        x, y = SX + r * math.cos(ang), SY + r * math.sin(ang)
        if 0 < x < 1180 and 0 < y < 900 and not (ang > 0.55 and ang < 1.35):
            attractors.append((x, y))
    seeds = [(SX + 62 * math.cos(2 * math.pi * k / 6 + 0.4),
              SY + 56 * math.sin(2 * math.pi * k / 6 + 0.4)) for k in range(6)]
    nodes = space_colonise(attractors, seeds, influence=105, kill=22, step=16,
                           max_nodes=1150)
    draw_network(a, nodes, w_tip=0.7, w_root=3.4)

    axon = [(SX + 30, SY + 52)]                                     # axon + myelin
    for k in range(1, 46):
        u = k / 45
        axon.append((SX + 30 + 560 * u + 26 * math.sin(5.2 * u),
                     SY + 52 + 610 * u ** 1.04))
    a.path(axon, w=2.2)
    for k in range(3, 43, 6):                                       # nodes of Ranvier
        p, q = axon[k], axon[k + 1]
        ang = math.atan2(q[1] - p[1], q[0] - p[0]) + math.pi / 2
        for sgn in (-1, 1):
            a.path([(p[0] + sgn * 9 * math.cos(ang), p[1] + sgn * 9 * math.sin(ang)),
                    (q[0] + sgn * 9 * math.cos(ang), q[1] + sgn * 9 * math.sin(ang))],
                   w=1.1)
    tip = axon[-1]
    for k in range(7):                                              # terminal arbour
        ang = -0.55 + 1.15 * k / 6
        mid = (tip[0] + 62 * math.cos(ang + 0.6), tip[1] + 62 * math.sin(ang + 0.6))
        end = (mid[0] + 58 * math.cos(ang), mid[1] + 58 * math.sin(ang))
        a.path([tip, mid, end], w=1.3)
        a.circle(end[0], end[1], 7, w=1.2)
    return a, "Pyramidal neuron: dendritic arbour, axon and terminal boutons"


ORGANIC = {
    "mockup-17-biology-leaf-venation": leaf,
    "mockup-18-biology-neuron": neuron,
}
