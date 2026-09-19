# Patronos — fine-line illustration pack

Vector SVG illustrations for Patronos marketing decks: transparent background,
brand gradient, large enough to hold a significant part of a 16:9 slide, always
placed on white. Paste and go.

The drawings are **generated from code, not prompted**. Every subject is computed
from its real geometry — a NACA 2412 section, a 70 m × 3.7 m launch vehicle, the
golden angle — so it is dimensionally honest, re-tunable by changing a number,
and comes out as clean semantic SVG rather than a mat of traced béziers.

```
recraft-pack/
├── 02-target-mockups/      ← the illustrations
├── 01-style-refs/          ← the two annual reports this style came from
├── 03-color/               ← the gradient, as SVG + PNG + hex
├── PROMPTS.md              ← Recraft prompts, if you ever want to generate more
└── tools/
    ├── artlib.py               plumbing: colour ramp, primitives, SVG writers
    ├── subjects_extra.py       drawings 06–16
    ├── subjects_organic.py     drawings 17–18 (growth-rule biology)
    ├── make_mockups.py         drawings 01–05 + the registry; run this
    └── recolor_svg.py          repaints any foreign SVG in the brand gradient
```

Regenerate everything:

```bash
python3 tools/make_mockups.py 02-target-mockups
```

---

## The subjects

| # | Subject | Canvas | Annotated |
|---|---|---|---|
| 01 | Wing section, NACA 2412, spars and flow isolines | 1200² | dimension line |
| 02 | Turbofan front elevation | 1200² | — |
| 03 | Epitrochoid curve family | 1200² | — |
| 04 | DNA double helix | 1200² | — |
| 05 | Hexagonal molecular lattice | 1200² | — |
| 06 | Turbofan fan stage, dimensioned | 1200² | full CAD plate |
| 07 | 42U server rack, front elevation | 760×1240 | full CAD plate |
| 08 | Reusable two-stage launch vehicle | 690×1240 | full CAD plate |
| 09 | Nine-engine octaweb, plan | 1200² | full CAD plate |
| 09b | Octaweb, **no annotation** — bare geometry | 1200² | — |
| 10 | Plasmid map, features and restriction sites | 1200² | labels |
| 11 | Nautilus, logarithmic spiral | 1200² | — |
| 12 | Sunflower phyllotaxis, golden angle | 1200² | — |
| 13 | Face-centred cubic unit cell | 1200² | axis labels |
| 14 | Gas-generator rocket engine, longitudinal section | 1080×1240 | full CAD plate |
| 15 | Cloud symbol | 1200×760 | — |
| 16 | Datacentre rack row | 1200×860 | — |
| 17 | Leaf with venation (space colonisation) | 820×1200 | — |
| 18 | Pyramidal neuron: arbour, axon, boutons | 1200² | — |

Dropped along the way: a CFD streamline field (read as wallpaper, not a subject)
and an open-wheel racing car (a hand-typed silhouette never came together at
hairline weight).

**Organic subjects mostly do not need tracing.** Branching structure in nature is
the output of a growth rule, not freehand drawing: 17 and 18 use space
colonisation (Runions et al., 2005) with vessel widths from Murray's law, and a
botanist or neuroscientist reads them as correct. The same applies to shells
(logarithmic spirals, 11), seed heads (golden angle, 12), corals, trees, river
networks and viral capsids. What genuinely resists this is *named specific
anatomy* — a heart, a hand, a particular animal — which is a shape-memory
problem. Those belong on the reference-and-trace path below.

## Reference-and-trace, for the subjects that need it

Two constraints, in order of importance.

**Licensing.** These are marketing assets for a real foundation, so image
provenance matters. Do not recolour images pulled off a search engine. Sources
that are genuinely usable, and happen to already be line engravings in exactly
this style: Haeckel's *Kunstformen der Natur* (1899–1904), *Gray's Anatomy*
(1918 edition), Köhler's *Medizinal-Pflanzen* (1887), and similar pre-1929 plates
on Wikimedia Commons, the Biodiversity Heritage Library and the Internet Archive.
Smithsonian Open Access publishes several million CC0 items. Openclipart is CC0.
Licences vary per item even within these collections — check each one, and keep a
note of the source next to the asset.

**Centreline tracing, not outline tracing.** `potrace` (and most "trace bitmap"
buttons) treat black regions as *filled shapes*, so a traced line drawing becomes
hairline-thin fills — precisely the form documented above as washing out in PDF
export. Use a centreline tracer so the result is real strokes.

The pipeline, tested end to end (`04-tracing-demo/`):

```bash
autotrace --centerline --input-format bmp --output-format svg \
          --despeckle-level 4 --output-file traced.svg source_bw.bmp
python3 tools/recolor_svg.py traced.svg final.svg --stroke-width 1.8
```

Prepare `source_bw.bmp` first: drop any colour annotation layer, crop away
labels, upscale ~2×, then threshold to pure black and white.

**What the test showed.** Round-tripping a known-good drawing (render one of
these mockups to bitmap, trace it back) reproduces it faithfully — see
`04-tracing-demo/01-roundtrip-known-good.png`. So the pipeline is sound, and the
*source* decides the result. Running it on a real Gray's Anatomy plate
(`02-real-source-grays-hand.*`) traces perfectly and is still unusable as a brand
asset, because it faithfully traces everything else too: every label becomes
wobbly outlined lettering, and the engraving's tonal hatching becomes a few
thousand short strokes. 3 226 elements for one hand.

So a usable source needs: **uniform line weight, no tonal hatching or stippling,
and no lettering inside the artwork.** Outline plates and diagrams qualify;
19th-century tonal engravings generally do not without heavy manual cleanup.

Two integration details `recolor_svg.py` now handles, both found by this test:
autotrace returns the whole drawing as a **single `<path>` with dozens of
subpaths** (which would take one flat colour), and it declares its paint only
inside `style="stroke:#000000; fill:none;"` (read before stripping, or every line
becomes a filled blob). Paint inherited from a parent `<g>` is resolved the same
way.

**Before tracing at all, check whether a CC0 SVG already exists** — Openclipart,
and science-icon collections such as Bioicons, publish vector line art directly.
`recolor_svg.py` takes those straight, and the result is far cleaner than any
trace.

---

## Three forms of every illustration

| File | What it is | When |
|---|---|---|
| `<name>.svg` | every path cut into short runs, each a flat solid colour sampled along the ramp | **The standard.** Use this. |
| `<name>-gradient.svg` | one real `stroke="url(#patronos)"` gradient | web, or when editing |
| `<name>-outlined.svg` | strokes converted to filled outlines in one compound path | fallback only |

### Why stepped is the standard — tested, not assumed

All three look correct in PowerPoint on screen. **Exporting the deck to PDF is
what separates them:** the outlined version washes out to a pale ghost while the
stepped version stays crisp at full saturation.

The cause is that an outlined stroke is no longer a stroke — it is a filled shape
about 1–2 px wide. PDF rasterisers anti-alias thin fills into partial coverage,
so the colour dilutes toward the page. A real stroke keeps a minimum rendered
width. The same argument applies to `-gradient.svg`, whose hairline strokes are
real but whose gradient PowerPoint may resolve unpredictably.

Stepped avoids the whole question: hundreds of ordinary solid-coloured strokes,
no gradient primitive anywhere, nothing for a converter to get wrong. It is also
how the Patronos 2024 report builds its own mesh ribbon — sampling p. 31 down the
ribbon gives `#f09a35 → #ec8c2b → #ef742e → #ec633a → #e9583f → #e94b41 →
#ea3f50 → #e84265 → #e54c7c`, a few hundred separate flat-coloured lines.

Each path is cut wherever its position on the 135° axis has moved by 1/72 of the
drawing, so the ramp runs *along* each line, not just between lines. A turbofan
goes from 52 elements to ~750 — still a small file, and indistinguishable from a
true gradient at hairline weight.

### Two gradient gotchas (they bit this pack; they will bite a hand-edit)

Only relevant to `-gradient.svg`, but worth knowing:

1. **Never leave a gradient on the default `objectBoundingBox`.** It resolves
   against *each element's own box*, so every line re-runs the whole ramp over
   itself — and any perfectly horizontal or vertical line has a zero-height or
   zero-width box and **does not paint at all**. The dash-dot centrelines
   silently vanished until this was found. Use
   `gradientUnits="userSpaceOnUse"`.
2. **Put the endpoints at the artwork's extremes along the 135° axis**, not at
   the bounding-box corners. A wide flat drawing never reaches its own corners,
   so with corner endpoints the last stop never shows and the piece tails off in
   magenta instead of violet. See `artlib.py:gradient_vector()`.

---

## Putting SVGs into PowerPoint

- Insert → Pictures → the `.svg`. It stays vector and scales cleanly.
- Use `<name>.svg`. Verified on screen and through PDF export.
- To recolour or delete parts: right-click → Graphics Format → Convert to Shape.
  One-way, so do it last.
- Labels are live `<text>` in a sans-serif stack (Inter → Helvetica → Arial), not
  outlined glyphs — that needs the font binary. On a machine without Inter they
  fall back gracefully. The untitled pieces (02–05, 09b, 11, 12, 15, 16) have no
  text at all and are immune.
- Google Slides does not import SVG. Export PNG at 3–4× placed size:
  ```bash
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless --disable-gpu --default-background-color=00000000 \
    --window-size=3840,2160 --screenshot=out.png file:///abs/path/art.svg
  ```

---

## Where the style came from

`01-style-refs/` holds the two annual reports and `reference-pages.pdf` with the
13 source pages. Worth knowing: **neither reference contains technical
drawings.** Patronos uses a parametric mesh ribbon, Amigos da Poli an angular
line network from their logo. What carried over is the grammar, not the subject:

- one uniform hairline weight, no variation
- no fill anywhere — pure contour
- drawn large, often cropped by the page edge
- generous empty space beside it, on white
- Patronos colours it; Poli leaves it monochrome

---

## Adding a subject

Write a builder in `tools/subjects_extra.py` returning `(Art, title)` and
register it in `EXTRA`. Primitives available on `Art`: `path`, `circle`, `line`,
`text`, `arrow`, `dim` (dimension line with arrowheads and label), `rrect`. Plus
`naca4` / `naca_like` for aerofoil sections and `union_outline` for the union of
overlapping discs (how the cloud is drawn). `Art(w, h)` takes a canvas size — a
rocket elevation is 19:1 and does not belong on a square.

---

## Brand colours

```
#ff9700  orange   stop 0%     — also the focus/accent colour used on the website
#ff6253  coral    stop 33%
#fc4696  pink     stop 67%
#c964e2  violet   stop 100%

linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)
```

`src/lib/theme.js` in this repo still defines an older red/yellow palette
(`#C00000`, `#A00000`). It is imported nowhere and is not the brand — ignore it.
