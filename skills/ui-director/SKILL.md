---
name: ui-director
description: Entry point for building any web UI that must not look AI-generated (landing pages first, also sites, product pages and app screens). Load it before designing or coding a page or screen. It sets the rule priority, the full build workflow and which ui-* skill to load at each step.
---

# UI Director

Left alone, you will build the most likely page, not a designed one: the patterns you saw most often, assembled without a reason. The result is technically fine and has no point of view. This skill set replaces those habits with explicit decisions, real material and measured checks.

## 1. Rule priority (read first)

Rules tagged **[CORE]** anywhere in this skill set are the primary rules. They override every other rule in the set. When two rules conflict:

1. **[CORE]** rules win.
2. Then accessibility (WCAG 2.2 AA, `prefers-reduced-motion`, keyboard).
3. Then the user's or brand's own spec (their colors, fonts, motion).
4. Then every other rule in these skills.

If the user's brief explicitly asks for something a non-core rule bans, follow the brief and say so in your report.

## 2. The core ideas in one screen

| # | [CORE] idea | Skill |
|---|---|---|
| 1 | Build screens from real images used as material (layered objects, one central object on a minimal image, cropped object on a minimal ground). Icons, emoji, boxes and shapes alone are not design. | `ui-images` |
| 2 | Gather the images yourself from real photo sources. Never generate pictures. Never ask the user to send images. Record source and license for every image. | `ui-images` |
| 3 | Text over an image stays readable: calm area, measured contrast, soft overlay if it fails. | `ui-images` |
| 4 | One visual grade for every image in the project. | `ui-images` |
| 5 | The page is a stack of full-screen sections (slides stacked vertically), not one long strip. Optional peek of the next section. | `ui-sections` |
| 6 | Related content is shown as one group that feels closer inside than outside. | `ui-sections` |
| 7 | Motion in three stages: light loops inside sections, a transition between sections, mouse reaction on part of the components. | `ui-motion` |
| 8 | Eased mouse-wheel scrolling with a soft magnet to section starts and a scroll-driven transition between every two sections. | `ui-motion` |
| 9 | Color balance 60-30-10: neutral, primary, and an accent only if the brand really has one. Checked per screen. | `ui-color` |
| 10 | Verify by rendering at six screen sizes and measuring, not by reading your own code. | `ui-review` |

## 3. Workflow (do the steps in order)

### Step 1. Read the brief and decide
- Identify: the subject, the audience, the one action the page must get, the stack, any existing brand (colors, fonts, logo), and what real material exists (product screenshots, photos, numbers, quotes).
- If something is vague, decide and state your reading in one line ("Booking page for a small ceramics studio, calm and warm, one action: book a class"). Ask only when a missing fact blocks the work. Never ask the user to send images.
- Facts are never invented: a number, quote, logo or testimonial not given is absent (see `ui-copy`).

### Step 2. List what is unique
Write 8 to 12 concrete facts only this client has: what the name means, where it is, real numbers, its limits, its materials and colors, its daily routine, the physical objects people use with it. This list feeds the idea, the palette and the image search terms.

### Step 3. Find the idea
Write it as: **[one real thing from the list]** → **[how the page uses it as the main visual device]**.
- Rival check: replace the client with its closest rival. If the idea still fits, it is generic. Find another.
- Memorable thing: name the one thing a visitor will remember. It appears on the first screen.

### Step 4. Plan the page (write it down before code)
1. **Sections and groups** (`ui-sections`): list each section, its single message, whether it is full-screen, whether it peeks, and which sections form a group.
2. **Image plan** (`ui-images`): for each full-screen section, pick the image layout (layered / full-width minimal / cropped core object) and the search query. Pick the one grade.
3. **Color roles** (`ui-color`): name neutral, primary, and accent (only if the brand has one) as tokens.
4. **Type** (`ui-type`): faces, the size scale, the headline lengths.
5. **Motion plan** (`ui-motion`): which sections loop, the section transition, which components react to the mouse.
6. **Self-review the plan:** if a similar prompt would get the same plan, change at least one large decision. Scan the plan against `ui-tells`.

### Step 5. Gather and prepare images
Search, download, check license, record credits, cut out objects, apply the grade (`ui-images`). Do this before layout so the layout is built around real pictures.

### Step 6. Build static first
Build every section with motion off. The static page must already look finished. Then add states (`ui-components`), then motion (`ui-motion`) as the last layer.

### Step 7. Verify
Run the `ui-review` loop: render at six sizes, measure color share per section, check readability over images, check reduced motion, keyboard and phone. Fix the three worst problems, repeat at most three rounds.

### Step 8. Report
Section plan, the idea, color roles and measured shares, image list with sources and licenses, what was tested, what was not tested, open decisions.

## 4. Which skill when

| You are about to... | Load |
|---|---|
| Lay out a page, a hero, section heights, grouping, spacing, grid | `ui-sections` |
| Find, cut, grade or place images; text over images; icons | `ui-images` |
| Choose colors, surfaces, shadows, dark mode | `ui-color` |
| Choose fonts, sizes, headline lengths, punctuation | `ui-type` |
| Write any visible words | `ui-copy` |
| Add any animation, hover, scroll effect | `ui-motion` |
| Build buttons, forms, nav, tables, dialogs, states, accessibility, responsive | `ui-components` |
| Build a dashboard, admin or settings screen | `ui-app-screens` |
| Check generic patterns before shipping | `ui-tells` |
| Test and score the result | `ui-review` |

## 5. Three laws that apply everywhere
1. **Decide everything, default nothing.** Be able to say why for every choice. "It's common" or "it works" means you defaulted.
2. **Be bold in one place per screen.** One focal point, one primary action, everything else quieter.
3. **Cleaning is not designing.** After removing clutter, fill the space with scale, real content and real images, never with new decoration. A page that is only tidy and empty is still generic.
