---
name: ui-review
description: Verify and critique a built page or screen - render at six screen sizes, screenshot every section, measure color share per section, check text contrast over images, peek size, overflow and small text, test reduced motion, keyboard and phone, look at the screenshots, fix the worst problems, and report. Load after building or changing any UI, and whenever asked to review, audit or critique a design.
---

# UI Review

Judge the rendered page, not the code: what the screenshot shows is what the user gets. You are biased toward your own build, so measure first and then look as if someone else made it.

Scripts (run from this skill's folder or pass full paths):
- `scripts/shoot.mjs <url> [--out shots] [--reduced]`: six sizes, `full.png` plus `section-NN.png` per section, `report.json` with overflow, smallest text, clipped text, section heights, peek percentages. Needs Playwright.
- `scripts/color_share.py <folder|images> [--no-accent]`: neutral / color / vivid share per screenshot against 60/30/10 (or 70/30/0). Needs Pillow.
- `scripts/contrast_over_image.py --report shots/report.json --size 1440x900`: contrast of every element marked `data-on-image` against the real pixels behind it. Needs Pillow.
- Motion lint lives in the `ui-motion` skill: `scripts/motion-lint.mjs`.

If a tool cannot be installed, do the same checks by hand in a browser (device toolbar for sizes, rendering panel for reduced motion) and say so in the report.

## 1. [CORE] The six sizes
| # | Screen | Size |
|---|---|---|
| 1 | Laptop | 1440 x 900 |
| 2 | Large monitor | 1920 x 1080 |
| 3 | Small laptop | 1366 x 768 |
| 4 | Short laptop | 1280 x 720 |
| 5 | Tablet portrait | 820 x 1180 |
| 6 | Phone | 390 x 844 |

At each size, for each section, confirm:
- nothing is cut off at the bottom of a section;
- text is readable and was not shrunk to fit;
- the peek shows where it was planned, and only there (8-15% of the screen, holding something real);
- no large empty space; the focal point is still clear;
- the sticky element of a group never covers text or an image;
- no horizontal scroll; no console errors.

## 2. The loop (at most three rounds)
1. Run `shoot.mjs` (normal) and `shoot.mjs --reduced`.
2. Read the report flags. Then **open and look at every section screenshot** at 1440x900 and 390x844, and the full page at the other sizes.
3. Run `color_share.py` on each size folder (`--no-accent` when the brand has no vibrant secondary). Target ~60/30/10 per section, ±10 points.
4. Run `contrast_over_image.py` for text on images (mark it `data-on-image` in the HTML).
5. Run the motion lint on the source.
6. Do the manual checks in §3.
7. List findings worst first, fix the top three, repeat. Stop after three rounds and report what is left.

## 3. Manual checks

### Structure and composition
- One screen at a time at 1440x900: is something on each screen big enough to be its reason? A screen with nothing strong outranks every detail.
- Squint at each screenshot: hierarchy survives; one focal point per screen; nothing jumps out harshly.
- Quick-glance check: look at the first screen for a few seconds as a new visitor. Can you say what this is, who it is for and what to do next?
- Neighbouring sections differ in layout; groups feel like one thing (spacing inside smaller than outside, clear start and end).
- Read only the headings and the hero: do they tell the story?

### Images
- Every section's focal image uses one of the three image layouts; cut-out edges are clean at 2x zoom.
- All images share the one grade; same light across the set.
- Every non-owned image is in the credits list with source and license; no watermarked file is published.

### Motion
- Count against the budget: 3-4 of every 10 sections have a loop or effect; ~20-30% of components react to the mouse; every section change has a transition.
- Scroll a whole page with a mouse wheel: it eases, the soft magnet only acts near section starts, it reaches the end, never gets stuck. Drag the scrollbar and use the keyboard: native.
- Reduced motion run: nothing moves, the page still looks finished.
- JavaScript disabled: nothing is hidden.
- CPU throttled 4-6x: no lag while scrolling.

### Interaction and access
- Tab through the whole page: focus visible, instant, never under a sticky element, order equals visual order; every hover effect has a focus version.
- Phone: every hover effect has a tap version; touch targets 44x44; nothing hidden only on phones; the sticky group header became normal.
- Zoom to 200%: text reflows, nothing clipped.
- All states exist: hover, focus, active, disabled, loading, empty, error.

### Generic look
- Run the pattern list and the fast checks in `ui-tells`.
- Rate the page 1 to 5 on: **Idea** (is there a clear point of view?), **Clarity** (is the order of importance obvious?), **Craft** (are the details correct?), **Fit** (does it belong only to this client?), **Discipline** (was anything unnecessary removed?), **Freshness** (does it differ from your previous builds?). Revise anything under 3 before shipping. Give an honest reason for each score.

### Fresh eyes
If you can start a separate reviewer (a subagent with no build history), give it only the screenshots and the `ui-tells` pattern list. Ask whether anything looks AI-made and whether any screen lacks a strong focal point. Fix what it finds.

## 4. Baseline comparison (proving the skills help)
To show the difference from plain output, generate the same prompt in a fresh chat with no project files and memory off, render both with `shoot.mjs`, and compare section screenshots side by side with the same checks.

## 5. Report format
```
REVIEW
Sizes tested:     1440x900, 1920x1080, 1366x768, 1280x720, 820x1180, 390x844 (+ reduced motion)
Sections:         n full-screen, n normal height, peeks at sections …, groups …
Color share:      per section neutral/color/vivid, off-target sections and fixes
Text on images:   worst ratios, overlays added
Motion:           loops in n/N sections, mouse-reactive components ~n%, transitions on every change: yes/no
Images:           list with source + license; any placeholders left
Fixed this round: top three
Not tested:       (be explicit)
Open decisions:
```
