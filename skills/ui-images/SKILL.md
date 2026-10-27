---
name: ui-images
description: Images as the main design material - the three image layouts (layered objects, full-width minimal image, cropped core object), sourcing real photos without generating or asking the user for them, licenses and credits, background removal, one grade for every image, readable text over images, placement, and icons. Load before searching for, cutting, grading or placing any image, and before putting text on a picture.
---

# UI Images

## 1. [CORE] Why images

AI design looks generic mostly because it builds screens from icons, emoji, boxes, fonts and shapes only. A designer uses images as real material. Every full-screen section (see `ui-sections`) needs a strong focal point, and that is usually an image treated with one of the three layouts below.

## 2. [CORE] The three image layouts

| Layout | What it is | Needs | Use when |
|---|---|---|---|
| **A. Layered concept** | Break an image into several cut-out objects that overlap each other and the text, combined into one unique composition. More than a rectangle placed on the screen. | 2+ cut-out objects (background removal), z-ordered layers, text sitting between or beside layers | Hero, signature section, any screen that must be memorable |
| **B. Full-width minimal image** | One central object on a very simple background, full width, with text placed so the image feels embedded in the screen | A photo whose background is already quiet (sky, wall, studio, water) | Statement screens, chapter openers, the close |
| **C. Cropped core object** | Cut the main object out of an image and place it on a minimal ground: flat color, gradient, shades, noise or small waves | One clean cut-out; a ground built in code from the palette | Product, object, menu item, feature with a physical thing |

Rules for all three:
- One subject per frame, cropped tight. Go large or leave it out: an image leads its screen (60%+ of it) or stays a small accent (under 10%). Avoid screen after screen at 20-40%.
- Layered and cropped layouts need a full screen to look good. Do not squeeze them into a short band.
- Vary the layout between neighbouring sections.
- Overlap is deliberate: objects overlap text edges or each other by a clear amount, and text that must be read never sits on a busy part of an object.
- A cut-out object stands on something (the bottom edge, a shadow that was in the photo, a ground line). Never add a fake drop shadow to a cut-out; never let it float in a void.

## 3. [CORE] Sourcing: gather real images yourself

### 3.1 Hard limits
1. **Never generate images** (no AI image tools, no "image generation" features of any connector). Allowed: code-made backgrounds such as noise, waves, gradients and shades, because they are not generated pictures.
2. **Never ask the user to send images.** You gather them. Asking the user to **connect an image connector** is allowed and recommended (it is setup, not asking for material). If the user volunteers their own photos, they come first.
3. **Check the license of every image and record its source.** No license, no use.
4. Never present a found photo as the client's own product, room, dish, person or team.

### 3.2 Source order (try in this order)
| Source | Status | How to use |
|---|---|---|
| The user's own images (only if already given or in the project) | Best | Use as is, apply the grade |
| **Unsplash connector** | Best tested source | Search returns clean photos on `images.unsplash.com`, free to use. Size the link with width and quality URL parameters (`?w=2400&q=80`). **Call the connector's download/track step for every photo you use.** Credit photographer + Unsplash. |
| Openverse, Wikimedia Commons APIs | No key needed | Only CC0, public domain, CC BY, CC BY-SA. Never NC or ND. Credit title, creator, source, license. |
| Free image packs on GitHub / npm | Works from restricted networks | Only CC0 or MIT-licensed images. Smaller choice. |
| Web scraping connectors | Widest reach | Every image needs a verified license before use. |
| Shutterstock connector | Previews only | Files are watermarked with a banner. Good for rough layout tests only, **never for a published page**. |
| Other design connectors (stock inside design suites) | Unverified | Test before relying on them; they may also offer background removal. |

Practical notes:
- Downloads must run on a machine with open internet (the user's own computer). Cloud sandboxes often block photo sites; if a download fails there, do it on the local machine and read the file in.
- Some services refuse sign-ups from some countries. If a connector cannot be used, fall to the next source.
- If no connector is installed, tell the user which one to connect (Unsplash first) and continue with the open APIs meanwhile.
- Search with the concrete facts from your list of what is unique, not with the category name: specific objects, materials and local words ("hand-thrown glazed mug on oak", not "cafe"). Prefer frames with one clear subject and a full range of light and dark.
- Download files locally (never hotlink). Record every image in a credits list: file, source URL, author, license, license URL.
- Credit every non-owned photo in one footer line at readable size. No credit captions over pictures.

### 3.3 Background removal (for layouts A and C)
Use a local background-removal tool (for example `rembg` in Python or a background-removal npm package) or a connector that offers it. Check the edge: no halo, no missing fine detail (hair, handles), clean alpha. Export PNG or WebP with alpha. If the cut is poor, pick another photo rather than shipping a bad edge.

## 4. [CORE] One visual style for every image

All images in the project share one look: the same filter, the same color pattern. Lock it once and apply it to every image.

1. Pick the grade from the brand: the grade leans toward the **primary color** (see `ui-color`). Options: natural, warm, muted, mono, a soft primary tint, duotone in two palette colors.
2. Write it once as a token and apply it to every `<img>` (or bake it into the files with the same settings):
```css
:root { --img-grade: saturate(.85) contrast(1.05) sepia(.08); }
.graded { filter: var(--img-grade); }
.graded-tint { position: relative; isolation: isolate; }
.graded-tint::after { content: ""; position: absolute; inset: 0; background: var(--primary); mix-blend-mode: soft-light; opacity: .18; pointer-events: none; }
```
3. Pick photos with the same light (all daylight, or all low warm light). A strong grade cannot fix a mismatched set.
4. Strong tints wash out light, low-contrast photos. With a heavy grade, pick photos that have deep shadows and bright highlights.
5. Never: mixed treatments, random vignettes, blur, tilted polaroids, a different filter per section.

## 5. [CORE] Readable text over images

When an image sits behind text:
1. Place text over the **calmest area** of the image (sky, wall, out-of-focus zone). Choose or crop the photo for that area.
2. **Measure contrast on the real pixels behind the text**, not on the average image: 4.5:1 for body-size text, 3:1 for text 24px+ (or 18.66px bold). Use the worst 10% of pixels under the text box. (Script: `ui-review` `scripts/contrast_over_image.py`.)
3. If it fails, add a **soft overlay** from the palette ink: a flat scrim at 30-55% or a fade from ~55% to transparent over the text third. Never a colored glow. Measure again.
4. Only display text goes on an image: a headline, one short line, one action. Body text, captions and labels go beside or under the image.
5. Video behind text: check contrast across the whole loop, not only the poster.

## 6. Placement and technique

- Ratios: use two or three ratios for the whole page (4:5 portrait beside text, 16:9 or 21:9 across, 1:1 details).
- `object-fit: cover` with a per-image `object-position` that keeps the subject where the composition needs it. Re-crop for phone (portrait) instead of shrinking a landscape.
- Images touch the viewport edge on their outer side or run full-bleed. Images floating with equal margins on all sides read as placed by default.
- Corners: square, or one small radius for every image. No frames, borders, device mock-ups, drawn browser bars.
- Performance: always `width`/`height` or `aspect-ratio`; the hero image `fetchpriority="high"`, at least ~2400px on its long side; every other image `loading="lazy"`; serve WebP/AVIF at about 2x CSS width; the container has the ground color so layout is whole before the image arrives.
- Alt text describes the picture; decorative layers get `alt=""` or `aria-hidden="true"`.
- Showing software: use real screenshots of the real product when it can be reached (run it and capture it). Otherwise build a real interface fragment at true size with believable data. Never a grey-bar fake dashboard; never shrink a screenshot until text is unreadable.

## 7. What is not an image
- No grey placeholder boxes, "image here", empty gradient blocks where a picture belongs.
- No drawn illustrations of objects, people or scenes in SVG/CSS (code-made noise, waves, gradients and shades as backgrounds are allowed, see §3.1). Allowed drawings: charts, maps and diagrams of real data, the user's logo.
- No illustration packs, 3D blobs, isometric clip art, characters, abstract floating shapes.
- No photo standing in for a fact: a stock face is never a customer or testimonial.

## 8. Icons
- One icon library per project, one stroke width and style, sizes from tokens (16/20/24/32), `currentColor`.
- Never an emoji as an icon. Never an icon in a colored circle or rounded tile above a heading.
- Icons next to text get a softer color than the text (icons are visually heavy). Never scale a small icon up.
- Decorative icons beside visible text: `aria-hidden="true"`. Icon-only buttons: `aria-label` and a 44x44 hit area.
- Logos: the user's own, never redrawn or approximated; monochrome in a logo row. Brand colors are fetched from the brand's own site or CSS, never recalled from memory.
