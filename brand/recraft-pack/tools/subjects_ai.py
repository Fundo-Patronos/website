"""An abstract mark for artificial intelligence.

A layered network is the honest visual: it is what the thing actually is, and
it draws well in one line weight. Two choices keep it from reading as the
stock clip-art version - edges are sparse, because a fully connected mat turns
into grey texture at hairline weight, and each edge's width carries its weight,
so the drawing has the uneven, learned look of a trained network rather than a
tidy diagram.
"""
import math
import random

from artlib import Art


def neural_network():
    rnd = random.Random(19)
    a = Art(1260, 880)
    layers = [5, 9, 11, 9, 4]
    X0, X1, CY, SPAN = 150, 1110, 440, 660
    cols = [X0 + (X1 - X0) * i / (len(layers) - 1) for i in range(len(layers))]
    nodes = []
    for ci, n in enumerate(layers):
        step = SPAN / max(layers) 
        ys = [CY + (k - (n - 1) / 2) * step for k in range(n)]
        nodes.append([(cols[ci], y) for y in ys])

    for ci in range(len(layers) - 1):                      # weighted, sparse edges
        for (x1, y1) in nodes[ci]:
            for (x2, y2) in nodes[ci + 1]:
                wgt = rnd.random()
                if wgt < 0.42:                             # prune the weak ones
                    continue
                dx = (x2 - x1) * 0.42
                pts = [(x1 + (x2 - x1) * t / 24 +
                        0.0,
                        y1 + (y2 - y1) * (3 * (t / 24) ** 2 - 2 * (t / 24) ** 3))
                       for t in range(25)]
                a.path(pts, w=round(0.35 + 1.5 * (wgt - 0.42) / 0.58, 2))

    for ci, col in enumerate(nodes):                       # units
        for (x, y) in col:
            r = 17 if 0 < ci < len(layers) - 1 else 21
            a.circle(x, y, r, w=1.9)
            if rnd.random() > 0.58:                        # an activated unit
                a.circle(x, y, r * 0.52, w=1.2)
            if ci == 0:
                a.path([(x - 62, y), (x - r - 6, y)], w=1.1)
                a.arrow(x - r - 6, y, 0.0, size=10, w=1.1)
            if ci == len(layers) - 1:
                a.path([(x + r + 6, y), (x + 62, y)], w=1.1)
                a.arrow(x + 62, y, 0.0, size=10, w=1.1)
    for ci in (0, len(layers) - 1):                        # layer brackets
        col = nodes[ci]
        xb = col[0][0] + (-46 if ci == 0 else 46)
        y0, y1 = col[0][1] - 34, col[-1][1] + 34
        s = 1 if ci == 0 else -1
        a.path([(xb + s * 12, y0), (xb, y0), (xb, y1), (xb + s * 12, y1)], w=1.2)
    return a, "Layered neural network with weighted, sparse connections"


AI = {"mockup-30-ai-neural-network": neural_network}
