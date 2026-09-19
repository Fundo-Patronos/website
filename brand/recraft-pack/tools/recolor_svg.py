#!/usr/bin/env python3
"""Repaint an SVG - typically one that just came out of Recraft - in the
Patronos gradient, so it is ready to paste straight into a deck.

Recraft returns vector art in whatever colours it felt like. By default this
attaches one real SVG gradient sweeping 135deg across the whole drawing, pinned
in user space to the artwork's true extents along that axis.

    python3 recolor_svg.py in.svg out.svg                 # one SVG gradient
    python3 recolor_svg.py in.svg out.svg --mode stepped  # per-element solids
    python3 recolor_svg.py in.svg out.svg --stroke-width 1.6
    python3 recolor_svg.py in.svg out.svg --to-stroke     # fills -> outlines

Two details that are easy to get wrong and that this handles for you:

  * The gradient is declared gradientUnits="userSpaceOnUse". The SVG default,
    objectBoundingBox, resolves against EACH element's own box, so every line
    would re-run the whole ramp over itself - and any perfectly horizontal or
    vertical line, having a zero-height or zero-width box, would not paint at
    all. Pinning to user space gives one continuous sweep instead.

  * The endpoints are the extremes of the art PROJECTED onto the 135deg axis,
    not the bounding-box corners. A wide, flat drawing never reaches its own
    corners, so with corner endpoints the last stop never shows and the piece
    tails off in magenta rather than violet.

--mode stepped gives every element its own flat colour sampled along the ramp
instead. That is how the Patronos 2024 report actually builds its mesh ribbon,
and it needs no gradient support at all - useful if some renderer mangles the
gradient.

Always drops any background rectangle so the result is transparent.
"""
import argparse
import math
import re
import sys
import xml.etree.ElementTree as ET

SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG_NS)

STOPS = ["#ff9700", "#ff6253", "#fc4696", "#c964e2"]
NUM = re.compile(r"-?\d*\.?\d+(?:[eE][-+]?\d+)?")
DRAWABLE = {"path", "line", "polyline", "polygon", "circle", "ellipse", "rect"}


def _rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def ramp(t):
    """Solid colour at t in [0,1] along the 4-stop brand gradient."""
    t = min(max(t, 0.0), 1.0) * (len(STOPS) - 1)
    i = min(int(t), len(STOPS) - 2)
    f = t - i
    a, b = _rgb(STOPS[i]), _rgb(STOPS[i + 1])
    return "#%02x%02x%02x" % tuple(round(a[k] + (b[k] - a[k]) * f) for k in range(3))


def tag(el):
    return el.tag.split("}")[-1]


CMD = re.compile(r"([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)")


def split_subpaths(d):
    """Split a path's d into its separate M...-rooted subpaths.

    autotrace --centerline returns the whole drawing as ONE <path> holding
    dozens of subpaths. Colouring per element would then paint the entire
    illustration a single flat colour, so the subpaths have to be separated
    before anything else happens."""
    parts, cur = [], ""
    for m in CMD.finditer(d):
        c = m.group(1)
        if c in "Mm" and cur.strip():
            parts.append(cur.strip())
            cur = ""
        cur += c + m.group(2)
    if cur.strip():
        parts.append(cur.strip())
    return parts


def chunk_subpath(d, tol, axis):
    """Cut one subpath into runs short enough to read as a single colour.

    Each run restarts with an M at the previous run's last point, so the pieces
    still join up seamlessly."""
    cmds = [(m.group(1), NUM.findall(m.group(2))) for m in CMD.finditer(d)]
    runs, cur, pen, anchor, start = [], "", None, None, None
    for c, nums in cmds:
        vals = [float(v) for v in nums]
        if c in "Zz":
            cur += "Z"
            continue
        if c in "Mm" and len(vals) >= 2:
            pen = (vals[0], vals[1])
            start = pen
            anchor = axis(pen)
            cur = f"M{pen[0]:.2f},{pen[1]:.2f}"
            continue
        if pen is None:
            continue
        cur += c + " " + " ".join(f"{v:.2f}" for v in vals)
        if len(vals) >= 2:
            pen = (vals[-2], vals[-1])
        if anchor is not None and abs(axis(pen) - anchor) >= tol:
            runs.append(cur)
            cur = f"M{pen[0]:.2f},{pen[1]:.2f}"
            anchor = axis(pen)
    if cur and not cur.rstrip().endswith(("M", ",")) and len(cur) > 12:
        runs.append(cur)
    return [r for r in runs if r.count(" ") or "C" in r or "L" in r]


def centroid(el):
    """Rough centroid of an element, from whatever numbers describe it."""
    t = tag(el)
    if t in ("circle", "ellipse"):
        return float(el.get("cx", 0)), float(el.get("cy", 0))
    if t == "rect":
        return (float(el.get("x", 0)) + float(el.get("width", 0)) / 2,
                float(el.get("y", 0)) + float(el.get("height", 0)) / 2)
    if t == "line":
        return ((float(el.get("x1", 0)) + float(el.get("x2", 0))) / 2,
                (float(el.get("y1", 0)) + float(el.get("y2", 0))) / 2)
    src = el.get("d") or el.get("points") or ""
    nums = [float(n) for n in NUM.findall(src)]
    if len(nums) < 2:
        return None
    xs, ys = nums[0::2], nums[1::2]
    n = min(len(xs), len(ys))
    return sum(xs[:n]) / n, sum(ys[:n]) / n


def viewbox(root):
    vb = root.get("viewBox")
    if vb:
        x, y, w, h = [float(v) for v in NUM.findall(vb)][:4]
        return x, y, w, h
    w = float(NUM.findall(root.get("width", "1000"))[0])
    h = float(NUM.findall(root.get("height", "1000"))[0])
    return 0.0, 0.0, w, h


def is_background(el, vw, vh):
    """A full-bleed rect is a background plate, not artwork."""
    if tag(el) != "rect":
        return False
    try:
        return (float(el.get("width", 0)) >= vw * 0.98
                and float(el.get("height", 0)) >= vh * 0.98)
    except ValueError:
        return False


def _style_get(el, prop):
    m = re.search(rf"{prop}\s*:\s*([^;]+)", el.get("style") or "")
    return m.group(1).strip() if m else None


def inline_inherited_paint(root):
    """Push stroke/fill down from groups onto the shapes that inherit them.

    SVG paint cascades, so a <g stroke="url(#g)"> leaves its children with no
    stroke attribute of their own. Reading paint per element without resolving
    that inheritance makes every child look unpainted - and SVG's default fill
    is black, so the whole drawing flips from strokes to filled blobs."""
    def walk(el, stroke, fill):
        s = el.get("stroke") or _style_get(el, "stroke") or stroke
        f = el.get("fill") or _style_get(el, "fill") or fill
        if tag(el) in DRAWABLE:
            if s:
                el.set("stroke", s)
            if f:
                el.set("fill", f)
        for c in el:
            walk(c, s, f)
    walk(root, None, None)


def paint_intent(el):
    """Was this element stroked or filled, before we touch it?

    Must be read BEFORE strip_style_colour runs. autotrace declares its paint
    only inside style="stroke:#000000; fill:none;" - with that stripped first,
    the element looks unpainted, and SVG's default (black fill) turns every
    traced line into a filled blob."""
    style = el.get("style") or ""
    sm = re.search(r"stroke\s*:\s*([^;]+)", style)
    fm = re.search(r"fill\s*:\s*([^;]+)", style)
    stroke = el.get("stroke") or (sm.group(1).strip() if sm else None)
    fill = el.get("fill") or (fm.group(1).strip() if fm else None)
    return stroke not in (None, "none"), fill == "none"


def strip_style_colour(el):
    """Remove fill/stroke declarations hiding inside a style="" attribute."""
    style = el.get("style")
    if not style:
        return
    keep = [d for d in style.split(";")
            if d.strip() and not re.match(r"\s*(fill|stroke)\s*:", d)]
    if keep:
        el.set("style", ";".join(keep))
    else:
        del el.attrib["style"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--mode", choices=["stepped", "true"], default="stepped",
                    help="stepped = solid colours stepped along the ramp, no "
                         "gradient primitive (default; survives PDF export); "
                         "true = one SVG gradient across the drawing")
    ap.add_argument("--stroke-width", type=float, default=None,
                    help="force a uniform stroke width on every element")
    ap.add_argument("--to-stroke", action="store_true",
                    help="convert filled shapes into outlines")
    a = ap.parse_args()

    tree = ET.parse(a.src)
    root = tree.getroot()
    _, _, vw, vh = viewbox(root)

    # drop background plates
    for parent in root.iter():
        for child in list(parent):
            if is_background(child, vw, vh):
                parent.remove(child)

    inline_inherited_paint(root)

    # explode multi-subpath <path> elements before anything measures them
    for parent in root.iter():
        for child in list(parent):
            if tag(child) != "path":
                continue
            subs = split_subpaths(child.get("d", ""))
            if len(subs) < 2:
                continue
            i = list(parent).index(child)
            parent.remove(child)
            for k, sub in enumerate(subs):
                clone = ET.Element(child.tag, dict(child.attrib))
                clone.set("d", sub)
                parent.insert(i + k, clone)

    els = [el for el in root.iter() if tag(el) in DRAWABLE]
    if not els:
        sys.exit(f"{a.src}: no drawable elements found")

    pos = {id(el): centroid(el) for el in els}
    ts = [(c[0] + c[1]) for el in els if (c := pos[id(el)])]
    lo, hi = (min(ts), max(ts)) if ts else (0.0, 1.0)
    span = (hi - lo) or 1.0

    if a.mode == "true":
        # every coordinate in the file, projected onto the 135deg axis
        u = 1 / math.sqrt(2)
        proj = []
        for el in els:
            src = (el.get("d") or el.get("points") or "")
            nums = [float(n) for n in NUM.findall(src)]
            proj += [x * u + y * u for x, y in zip(nums[0::2], nums[1::2])]
            c = pos[id(el)]
            if c:
                proj.append(c[0] * u + c[1] * u)
        p0, p1 = (min(proj), max(proj)) if proj else (0.0, float(vw + vh) * u)
        defs = ET.Element(f"{{{SVG_NS}}}defs")
        g = ET.SubElement(defs, f"{{{SVG_NS}}}linearGradient", {
            "id": "patronos", "gradientUnits": "userSpaceOnUse",
            "x1": f"{p0 * u:.1f}", "y1": f"{p0 * u:.1f}",
            "x2": f"{p1 * u:.1f}", "y2": f"{p1 * u:.1f}"})
        for i, c in enumerate(STOPS):
            ET.SubElement(g, f"{{{SVG_NS}}}stop", {
                "offset": f"{i / (len(STOPS) - 1) * 100:.0f}%", "stop-color": c})
        root.insert(0, defs)
        paint = "url(#patronos)"

    # in stepped mode, also cut long paths so the ramp runs ALONG each line
    if a.mode == "stepped":
        u = 1 / math.sqrt(2)
        axis = lambda p: (p[0] + p[1]) * u
        tol = (max(ts) - min(ts)) * u / 72 if ts else 1e9
        for parent in root.iter():
            for child in list(parent):
                if tag(child) != "path":
                    continue
                runs = chunk_subpath(child.get("d", ""), tol, axis)
                if len(runs) < 2:
                    continue
                i = list(parent).index(child)
                parent.remove(child)
                for k, r in enumerate(runs):
                    clone = ET.Element(child.tag, dict(child.attrib))
                    clone.set("d", r)
                    parent.insert(i + k, clone)
        els = [el for el in root.iter() if tag(el) in DRAWABLE]
        pos = {id(el): centroid(el) for el in els}

    for el in els:
        had_stroke, fill_is_none = paint_intent(el)
        strip_style_colour(el)
        c = pos[id(el)]
        colour = paint if a.mode == "true" else ramp(((c[0] + c[1]) - lo) / span
                                                     if c else 0.5)

        if a.to_stroke or had_stroke or fill_is_none:
            el.set("fill", "none")
            el.set("stroke", colour)
        else:
            el.set("fill", colour)
            el.set("stroke", "none")

        if a.stroke_width is not None and el.get("stroke") != "none":
            el.set("stroke-width", f"{a.stroke_width}")
        el.set("stroke-linecap", "round")
        el.set("stroke-linejoin", "round")

    # clear inherited paint on groups so element-level colour wins
    for el in root.iter():
        if tag(el) in ("g", "svg"):
            strip_style_colour(el)
            for k in ("fill", "stroke"):
                if el.get(k) and tag(el) == "g":
                    del el.attrib[k]

    tree.write(a.dst, encoding="unicode", xml_declaration=True)
    print(f"{a.dst}: repainted {len(els)} elements ({a.mode})")


if __name__ == "__main__":
    main()
