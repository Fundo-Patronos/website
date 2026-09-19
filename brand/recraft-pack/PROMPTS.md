# Recraft prompts — Patronos fine-line illustration system

> **Status: optional.** The illustrations in `02-target-mockups/` are generated
> from code (`tools/make_mockups.py`), not prompted — that is what makes them
> dimensionally correct and editable. Keep this file for subjects that resist
> parametric construction (anatomy, animals, anything organic), where an image
> model plus cleanup still beats hand-writing coordinates.

Every prompt below is built the same way:

```
[STYLE BLOCK] + [SUBJECT] + [COMPOSITION] + [NEGATIVES]
```

The style block never changes. That is what makes 40 illustrations look like one
family instead of 40 separate pictures. Paste it verbatim each time.

---

## 1. The style block (paste unchanged)

> Fine line technical illustration. Single-weight hairline contour drawing, 1–2 px
> uniform stroke, no fill, no shading, no hatching for tone, no texture, no
> drop shadows. Pure outline geometry in the manner of an engineering blueprint
> or a patent drawing. Lines are drawn in a warm gradient running from orange
> `#ff9700` through coral `#ff6253` and pink `#fc4696` to violet `#c964e2`,
> the colour progressing smoothly across the drawing along a 135° diagonal.
> Transparent background. Flat 2D, orthographic,
> no perspective vanishing point, no photographic realism. Elegant, precise,
> scientific, minimal.

Colour is the one instruction you should not rely on Recraft to honour. Generate
in whatever it gives you and repaint with `tools/recolor_svg.py`, which attaches
the real gradient. Keeping the colour words in the prompt still helps — it nudges
Recraft toward warm, light-on-white art that repaints cleanly.

---

## 2. The negative block (paste unchanged)

> Avoid: solid fills, filled silhouettes, colour blocking, gradient meshes,
> shading, gradients inside shapes, drop shadows, 3D rendering, isometric
> perspective, photographic detail, watercolour, sketchy or hand-drawn wobble,
> variable line weight, background rectangles, background colour, frames,
> borders, watermarks, human faces, text labels, lettering, numbers, arrows
> with labels, logos.

---

## 3. Composition block — pick one per asset

Illustrations must hold a large area of a 16:9 slide, so scale matters more than
subject. Pick the line that matches where the art will sit:

| Where it goes | Composition line to append |
|---|---|
| Full-bleed hero behind a title | `Extreme close-up, the subject cropped by the canvas edges so the lines run off all four sides, filling the entire frame.` |
| Right or left third of a slide | `The subject occupies the right two thirds of a wide 16:9 canvas and bleeds off the right edge, leaving the left third empty for text.` |
| Corner accent | `The subject sits in one corner and bleeds off two edges, diagonal emphasis, most of the canvas empty.` |
| Standalone centred icon-scale piece | `Centred, complete, generous even margins, square canvas.` |

The first two are the ones to use most. The reference report almost never shows a
complete object — the art is always cropped by the page, which is what makes it
feel large.

---

## 4. Subject prompts

Assemble as: **style block + subject + composition + negatives**.

### Engenharia — mechanical

1. `Cutaway technical drawing of a turbofan jet engine, fan blades, compressor stages, bypass duct and shaft centreline shown as pure outline, centreline drawn as a dash-dot line.`
2. `Front elevation of a turbofan engine: concentric annular rings and a radial array of swept fan blades, stator vanes behind, crosshair centrelines.`
3. `Aircraft wing section, NACA airfoil profile in outline, internal ribs and two circular spars, chord line as a dash-dot line, streamline isolines flowing over the upper surface.`
4. `Exploded assembly of a planetary gearbox: sun gear, three planet gears, ring gear and carrier plate, each gear drawn as a toothed outline, thin leader lines between components.`
5. `Technical drawing of a four-stroke engine cylinder: piston, connecting rod, crankshaft throw and valve train in outline section.`
6. `Orthographic drawing of a suspension bridge span: tower, cable catenary and vertical hangers as fine lines, deck in outline.`

### Engenharia — electrical / computing

7. `Printed circuit board trace layout drawn as fine lines: routed traces, via pads as small circles, a rectangular IC footprint, no text.`
8. `Schematic of an electrical network: resistors, capacitors, inductors and a transformer drawn as standard symbols connected by thin straight lines on an invisible grid.`
9. `Three-phase sinusoidal waveforms overlaid on an axis pair, phase offset visible, thin uniform curves.`
10. `Antenna radiation pattern: concentric polar rings with a lobed directivity curve traced over them.`

### Matemática e física

> ⚠️ Do **not** ask Recraft for real equations. Image models render mathematical
> notation as convincing gibberish. Two safe routes:
> **(a)** ask for the *geometry* of the mathematics — curve families, fields,
> solids — as below; or
> **(b)** generate the line art without notation and set the real equation in
> type (LaTeX → SVG) on top, in Patronos orange. Route (b) is the only one that
> survives a professor reading the slide.

11. `A family of epitrochoid curves nested inside one another over a faint dashed polar grid, continuous unbroken curves.`
12. `Lissajous figures: five superimposed parametric curves of different frequency ratios inside a square field.`
13. `Vector field of a dipole: smooth field lines curving between two poles, equipotential contours crossing them perpendicularly.`
14. `Three-dimensional saddle surface drawn purely as a wireframe mesh of thin parallel u and v isolines, no fill.`
15. `Orbital mechanics diagram: nested elliptical orbits sharing a focus, radial sweep lines marking equal areas, dash-dot major axes.`
16. `Fourier synthesis: a stack of sine waves of increasing frequency above their summed square-ish waveform, all thin uniform curves.`

### Biologia

17. `DNA double helix drawn in outline: two continuous sinusoidal backbone strands with straight base-pair rungs between them, vertical composition.`
18. `Botanical line study of a leaf: outline and full venation drawn as fine branching lines, no fill.`
19. `Neuron drawn as pure outline: soma, branching dendritic tree and a long axon with terminal branches.`
20. `Cross-section of a plant stem: concentric tissue rings and a radial array of vascular bundles, outline only.`
21. `Hexagonal molecular lattice of fused aromatic rings with a thin circle inside alternating cells.`

### Medicina e saúde

22. `Anatomical outline drawing of a human heart: chambers, great vessels and valve planes as clean contour lines, no shading.`
23. `Human skeletal hand in orthographic outline, each bone a closed contour, joint spaces visible.`
24. `Electrocardiogram trace: a continuous ECG waveform over several beats on a faint dashed measurement grid.`
25. `Cross-section of a long bone: cortical and trabecular structure drawn as fine contour lines and a lattice, outline only.`
26. `Protein ribbon structure abstracted into a continuous folded line path with helical coils, no fill.`

### Humanidades

> The hardest category — humanities has no canonical technical drawing. Anchor it
> in *architecture, instruments and artefacts*, which draw beautifully in line and
> read instantly as the humanities without becoming literal.

27. `Orthographic elevation of a classical colonnade: fluted columns, capitals and entablature drawn in outline, even rhythm across the frame.`
28. `Architectural plan of a library reading room: walls, column grid, radiating desks and shelving drawn as thin plan lines.`
29. `Technical drawing of a grand piano action: hammer, damper, key lever and string, mechanism in outline section.`
30. `Perspective construction diagram: a vanishing point with radiating construction lines and a horizon line over a simple building block in wireframe.`
31. `Exploded diagram of a printing press platen mechanism, outline only, thin leader lines between parts.`
32. `Wireframe globe: latitude and longitude graticule only, continent outlines as fine contour lines.`

---

## 5. Worked example — one complete prompt

Copy-paste ready:

> Fine line technical illustration. Single-weight hairline contour drawing, 1–2 px
> uniform stroke, no fill, no shading, no hatching for tone, no texture, no drop
> shadows. Pure outline geometry in the manner of an engineering blueprint or a
> patent drawing. Lines are drawn in a warm gradient running from orange #ff9700
> through coral #ff6253 and pink #fc4696 to violet #c964e2, the colour
> progressing smoothly across the drawing along a 135° diagonal.
> Transparent background. Flat 2D, orthographic, no perspective
> vanishing point, no photographic realism. Elegant, precise, scientific, minimal.
> Subject: aircraft wing section, NACA airfoil profile in outline, internal ribs
> and two circular spars, chord line as a dash-dot line, streamline isolines
> flowing over the upper surface. The subject occupies the right two thirds of a
> wide 16:9 canvas and bleeds off the right edge, leaving the left third empty for
> text. Avoid: solid fills, filled silhouettes, colour blocking, gradient meshes,
> shading, gradients inside shapes, drop shadows, 3D rendering, isometric
> perspective, photographic detail, watercolour, sketchy or hand-drawn wobble,
> variable line weight, background rectangles, background colour, frames, borders,
> watermarks, human faces, text labels, lettering, numbers, arrows with labels,
> logos.

Compare the result against `02-target-mockups/mockup-01-engineering-wing-naca2412.svg`,
which is that exact brief drawn to spec — and note how much straighter the
computed version is. That gap is the reason the pack moved to code.

---

## 6. If the output is wrong

| Symptom | Fix |
|---|---|
| Shapes come back filled | Add `outline only, hollow shapes, no filled areas` and re-emphasise `no fill`. Or fix after the fact: `recolor_svg.py --to-stroke`. |
| One flat colour, no gradient progression | Expected. Generate in any colour and repaint with `recolor_svg.py`. This is the workflow, not a fallback. |
| Line weight varies / looks hand-drawn | Add `CAD plotted, constant stroke weight, vector precision`. |
| Too small in frame, floating in the middle | Strengthen the composition line: `cropped by the canvas edges, bleeding off frame, no margins`. |
| A white or coloured background plate appears | Expected. `recolor_svg.py` strips full-bleed rects automatically. |
| Garbled pseudo-mathematics | Never generate notation. See the warning under *Matemática e física*. |
