---
name: ui-color
description: Color for web UI - the 60-30-10 balance (neutral, primary, optional accent) checked per screen, naming color roles as tokens, contrast, surfaces and depth (borders, shadows, radius), dark mode and status colors. Load before choosing any color, background, shadow or dark theme.
---

# UI Color

## 1. [CORE] 60-30-10 balance, per screen

| Share | Role | What it is | Where it goes |
|---|---|---|---|
| **~60%** | **Neutral** | White or very close to it. Dark theme: black or very close to it. At most a very faint tint. **Never vibrant, never saturated.** | Backgrounds, white space. Text and thin lines are small and count with the neutral. |
| **~30%** | **Primary** | The brand's identity color or colors. Not a second neutral, not the loud color. | Large colored areas: one section background, big shapes, the tint on photos. |
| **~10%** | **Accent** | One vibrant secondary color, **only if the brand really has one** | The key action (main button) and a few small highlights |

### 1.1 The accent exists only if the brand has it
- If the brand has no vibrant secondary color: **no accent at all.** The neutral takes ~70% and the primary ~30%. The primary is the only color.
- **Never invent a loud color to fill the 10%.** A loud color that is not part of the brand feels out of brand. If everything is loud, nothing stands out.

### 1.2 How to apply
1. **Name the roles before designing**, as tokens. Every color on the page comes from these roles. Do not add other colors.
```css
:root {
  --neutral: #ffffff;        /* ~60% (or ~70% with no accent) */
  --ink: oklch(22% 0.01 var(--hue));   /* text: counts with the neutral */
  --muted: oklch(45% 0.01 var(--hue));
  --primary: …;              /* ~30% */
  --primary-ink: …;          /* text color that reads on --primary */
  --accent: …;               /* ~10%, ONLY if the brand has a vibrant secondary */
  --accent-ink: …;
}
```
2. **Every screen, not only the page average.** Each full-screen section has roughly the same balance, so each one is easy to look at.
3. **Connected rules:** the one photo grade leans toward the primary (`ui-images` §4). Text over images needs a quiet area, which the neutral gives. Loops and effects use the accent (or the primary when there is no accent), never new colors.
4. **Measure it** on a screenshot of every section: neutral (near black, grey, white, cream), color, vivid. A pixel count cannot tell primary from accent, so "vivid" stands in for the accent. Target ~60/30/10 (or ~70/30/0), tolerance about 10 points either way. Script: `ui-review` `scripts/color_share.py`. If a screen is too colorful or too flat, fix it before finishing.

### 1.3 Risks
- A saturated glow or gradient behind everything counts as color, not as neutral.
- Photos bring their own colors; the shared grade keeps them inside the palette.
- A tinted neutral drifts toward a color. Keep the tint faint.
- With an accent, too little accent makes a page flat: the page needs one clear loud point (the primary action).

## 2. Building the palette

- **Color comes from the subject.** Picture the real place, objects and materials connected to the product and take hues from them, not from a category habit (blue for software, green for health).
- Work in OKLCH or HSL. For each role build a few steps (hover, pressed, tint for pale backgrounds). As lightness nears the extremes, raise saturation slightly and rotate hue a little so light and dark steps do not look dead.
- Greys are tinted very slightly toward the primary hue.
- Never use a framework's stock swatch (indigo-500, violet-600, slate-900 and the like) as the brand.
- Status colors (success, warning, error, info) are separate tokens, used only for status, always with an icon or text too.

## 3. Contrast (non-negotiable)
- Body text 4.5:1; large text (24px+, or 18.66px bold) 3:1; UI components, icons, focus rings and field edges 3:1.
- If white text on a color fails, do not darken the color to black: use dark text on a light tint of the same hue.
- Never rely on color alone (add text, an icon or a pattern).
- Never lower text opacity to "soften" it without re-checking the ratio. Hover and focus raise contrast, never lower it.
- Button text must clearly differ from its fill; grey text never sits on a colored surface (use the role's `-ink` token).
- Disabled controls stay legible and explain why they are disabled.

## 4. Surfaces and depth

- **Pick one depth strategy for the project and do not mix:** tone steps only (a surface 2-6 lightness points from the ground), borders only (1px, low contrast), or subtle shadows. 
- Shadows only on what floats (menus, popovers, dialogs). At most one shadow recipe. Never a border and a wide soft shadow on the same element. Never a soft grey shadow under every card.
- Never a card inside a card. Never white cards on a tinted page by reflex. Group with space and one container split by dividers, not a box around every item.
- Elevated surfaces are never darker than their canvas (light theme); in dark theme elevation is lighter steps (+3-7% lightness per level).
- Borders: low contrast, so they disappear until needed. If the border is the first thing you see, it is too strong. Hairlines are allowed only where they carry structure (tables, a rule between real rows), never as decoration on every section.
- Radius: one scale, one radius per nesting level, concentric (`outer = inner + padding`). Choose square or clearly rounded once; a medium 12-16px radius on everything is the generated default.
- Inputs sit slightly inset (a step darker or a clear 1px border); dropdowns sit one level above their parent.

## 5. Dark theme
A second, equally designed rendering, never an inversion:
- Neutral is near black (not necessarily `#000`), ink is a soft near white. Text still meets 4.5:1, muted text included.
- Hue never moves; only lightness changes. Desaturate the accent and status colors slightly and raise their lightness.
- Shadows are weak on dark: use lighter surface steps instead. No glows.
- Drop body weight one step (or add 0.01em tracking) for light text on dark.
- Never `filter: invert()`. Test both themes on their own. Do not ship dual-mode unless asked.

## 6. Banned color moves (unless the brand itself owns them)
- Purple-to-blue, purple-to-pink, cyan-on-dark gradients; gradient text.
- Glow, aurora, mesh blobs or blurred orbs behind text.
- Cream paper + high-contrast serif + terracotta/clay accent (the newest generated "warm" look).
- Near-black ground + one neon/acid accent + glow.
- Decorative gradients on buttons, cards, KPI tiles. (Allowed: code-made gradient, noise, wave or shade grounds behind a cropped object or as a section ground, see `ui-images` §3.1, still counted in the color share.)
- More than one accent family on one screen.
