---
name: ui-type
description: Typography for web UI - choosing faces, the size scale, headline length budgets, weights, line height, measure, tracking, labels without tracked caps, and micro-typography (quotes, dashes, figures). Load before choosing fonts or setting any text style.
---

# UI Type

Text is most of what a visitor sees, so the font choice is a core design decision, never a leftover default.

## 1. Faces
- **At most two families:** one display, one body (a third only as an outlier with exactly one job, for example a mono for code). Often one family is enough.
- Choose the face from the subject (its era, its signs, its printed objects), not from habit. Do not default to Inter, Roboto, Open Sans, Arial, Helvetica, Poppins, Montserrat, Lato, DM Sans or system-ui as the display face on a landing page. Faces every model picks first (Playfair Display, Cormorant, Fraunces, Instrument Serif, Space Grotesk) need a real reason.
- App screens are the exception: one well-chosen neutral grotesk is normal there (`ui-app-screens`).
- If two faces, make them clearly different (serif + sans, or heavy display + quiet text), each with one fixed role.
- Families with enough weights; display cuts only at display sizes, text cuts for paragraphs.
- Load only the weights used; `font-display: swap`; a fallback stack of the same kind; preload only the hero display font. Verify the real font rendered before judging a screenshot.

## 2. Scale
- Base body 16px (marketing body 16-20px). Build sizes on a ratio of about 1.25 from the body; round to whole pixels.
- **Few sizes, far apart.** Two or three sizes do the visible work; five is the ceiling on a page. Nine near-equal sizes is the generated failure.
- Hierarchy past size comes from **weight and color**, not more sizes.
- Typical page set at 1440: body 18, item title ~26, section head ~52, hero head ~84 (fluid with `clamp()`).
- **Three weights at most** across the page, picked as extremes (400 beside 700, or 300 beside 800). Big type does not need to be bold. Never everything bold. No weight change on hover (text reflows).

## 3. Headline budgets
| Headline length | Treatment |
|---|---|
| up to 20 characters | full display size |
| 21-50 characters | display size |
| 51-90 characters | smaller display (~60px at 1440) or split at the sense break |
| over 90 characters | rewrite it |
- Headlines at most 7 words and at most two lines at every width. Never fix a long headline by shrinking it: cut words.
- A head is one weight, one style, one color. Stress comes from a line break or a second line at a second size, never from one word in italic, color, highlight or underline.
- `text-wrap: balance` on heads, `pretty` on paragraphs. Author line breaks for the hero; avoid a one-word last line.

## 4. Setting
- **Display type** (over ~40px): line-height 1.0-1.15, tracking -0.02 to -0.04em (0 to -0.015em on condensed or very heavy faces). An uppercase head that can wrap never has line-height under 1.0. No text shadow, outline or gradient fill on display type.
- **Body:** 16px+, line-height 1.5-1.65, measure 45-75 characters (`max-width: 65ch`), left-aligned. Never justified without hyphenation. Do not centre paragraphs longer than three lines.
- Secondary text is the same face in a softer ink, not a thinner weight, never under 13px. Running text under 12px or functional text under 11px is broken.
- Light text on dark: drop one weight step or add 0.01em tracking, raise leading slightly.
- Sentence case for headlines, labels, buttons and nav.

## 5. Labels (no tracked caps, no eyebrows)
- Labels, captions, table heads, tags, chips and nav links: the body face, one step smaller, sentence case, **untracked**. Never small uppercase letter-spaced text (one of the clearest signs of AI-made UI).
- **No eyebrow:** no small line before a heading that only announces it ("FEATURES", "OUR STORY", a pill saying "New"). Small text before a heading survives only if it carries a fact, a destination or an identifier (a date, a byline, a real status).
- To start a section without a label: let the heading itself say what the section is about (usually best); just leave space above it; make the first words of the first sentence heavier; change the background color; keep the heading in view while the content scrolls (sticky). Use at most two of these per section.
- Monospace only for code, figures and measurements, never as a "technical" costume for labels.

## 6. Micro-typography (apply silently to every visible string)
- Curly quotes and apostrophes (“ ” ‘ ’). Straight marks only for feet and inches. In JSX paste the real character.
- A real ellipsis (…), real symbols (© ™ × −).
- **No em or en dashes in UI copy** (they read as machine-written): use a comma, colon, full stop or parentheses. Ranges may use "to" ("9 to 5", "10 to 20 people").
- One space after punctuation. Non-breaking space between a number and its unit (`10&nbsp;MB`) and inside short names.
- Bold or italic, never both. No underline except links (thin: `text-decoration-thickness: 1px; text-underline-offset: 0.18em`).
- `font-variant-numeric: tabular-nums` on any figures that compare or change; right-align numbers in tables.
- No arrows glued to link text ("Learn more →"), no middle-dot meta strings (A · B · C), no decorative status dots.
- `::selection`, `caret-color` and `:focus-visible` in the palette so browser states belong to the design. `font-kerning: normal`.
- Accents on proper names are mandatory. At most one exclamation mark per page. No emoji in professional copy.
