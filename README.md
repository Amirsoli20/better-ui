# Better UI

A Claude Code plugin that stops AI from building generic UI.

Ask Claude for a landing page and you usually get the same thing: a centred headline, three icon cards, a soft gradient and a long strip of stacked blocks. Better UI gives Claude a designer's method instead. It builds pages from real images, composes each screen like a slide, balances color on purpose, adds motion with a reason, and checks the result in a real browser at six screen sizes.

Current focus: **landing pages and marketing sites.** App screens and dashboards are covered too.

## What it changes

| Plain AI output | With Better UI |
|---|---|
| Screens built from icons, emoji, boxes and shapes | Screens built from real photos: layered cut-out objects, one central object on a minimal image, or a cropped object on a clean background |
| Generated or placeholder images | Real, licensed photos gathered by Claude itself, credited, with one shared photo style across the page |
| One long strip of blocks | A stack of full-screen sections, each composed as one picture, with an optional peek of the next section |
| Related content crammed together or scattered | Related content grouped so it reads as one thing |
| Random colors, or a loud accent the brand never had | 60-30-10 color balance (neutral, primary, accent only if the brand has one), measured on every screen |
| Fade-up on every block | Motion in three stages: light loops inside sections, a transition between sections, mouse reactions on part of the components |
| Normal jumpy wheel scrolling | Eased mouse-wheel scrolling with a soft pull to section starts, while touch, keyboard and scrollbar stay native |
| "Looks fine in the code" | Screenshots at six sizes, color share and text-over-image contrast measured, reduced motion, keyboard and phone checked |

## Install

In Claude Code:

```
/plugin marketplace add Amirsoli20/better-ui
/plugin install better-ui@better-ui
```

Or from a terminal:

```bash
claude plugin marketplace add Amirsoli20/better-ui
```

```bash
claude plugin install better-ui@better-ui
```

Restart Claude Code after installing.

## Use

Just ask for UI as usual ("Build a landing page for a ceramics studio in Lisbon"). The skills load on their own. To start explicitly, run:

```
/better-ui:ui-director
```

### The skills

| Skill | What it does |
|---|---|
| `ui-director` | Entry point: rule priority, the build workflow, which skill to use when |
| `ui-sections` | Full-screen sections, the peek, grouped sections, hero, grid and spacing |
| `ui-images` | Image layouts, finding licensed photos, cut-outs, one photo style, readable text on images |
| `ui-color` | 60-30-10 balance, color roles, contrast, depth, dark mode |
| `ui-type` | Fonts, size scale, headline lengths, labels, punctuation |
| `ui-copy` | Word budgets, banned phrasing, honest content, error and empty-state text |
| `ui-motion` | Three-stage motion, effect menus, eased scrolling, timing tokens, tool choice |
| `ui-components` | States, buttons, forms, dialogs, accessibility, responsive rules |
| `ui-app-screens` | Dashboards, admin and settings screens |
| `ui-tells` | Patterns that make UI look AI-made, and what to use instead |
| `ui-review` | Six-size screenshots, measured checks, critique loop, report |

## Recommended setup

**Image source.** Better UI never generates images and never asks you to send any. Connect an image connector so Claude can find real photos. Unsplash works best. Without one, Claude falls back to openly licensed sources (Openverse, Wikimedia Commons). Image downloads need open internet, so run Claude Code on your own machine rather than a locked-down sandbox.

**Review tools** (optional, but they make the checks real):

```bash
npm i -D playwright
```

```bash
npx playwright install chromium
```

```bash
pip install pillow
```

If they are missing, Claude does the same checks by hand and says so in its report.

## What is inside

```
skills/
  ui-motion/assets/motion.css      motion tokens, section scrolling, loops, hover effects, reduced motion
  ui-motion/assets/motion.js       eased wheel, soft magnet, section transitions, reveals, loop pausing (no library)
  ui-motion/scripts/motion-lint.mjs   flags common motion mistakes in source code
  ui-review/scripts/shoot.mjs         screenshots every section at six sizes and measures layout facts
  ui-review/scripts/color_share.py    measures the 60-30-10 balance per screenshot
  ui-review/scripts/contrast_over_image.py   checks text contrast against the real pixels behind it
```

The motion runtime keeps the real page scroll, turns itself off with reduced motion and on touch devices, and leaves the page fully readable with JavaScript off.

## License

MIT
