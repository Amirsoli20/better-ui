---
name: ui-tells
description: Registry of patterns that make a UI look AI-generated (visual, type, layout, imagery, motion, code and process tells), what to put in their place, and the guard against over-correcting into an empty page. Load before shipping any page or screen, when reviewing a design, or when output feels generic.
---

# UI Tells

A tell is a default that marks the page as machine-made. Each one is legitimate for some brief, but as a default it is a giveaway. If the brief explicitly asks for one, follow the brief and note it. **[CORE]** rules from the other ui-* skills override this list (for example a sticky "02 / 04" group counter is allowed by `ui-sections` §2, and code-made gradient grounds by `ui-images` §3.1).

## 1. The registry

### Layout
- Centred headline + subtitle + two buttons + screenshot below.
- Stock order: hero, logos, three features, testimonial, pricing, CTA, footer.
- A distinctive first screen followed by stock blocks.
- Every section the same layout, the same gap, the same split three times in a row; a zigzag of mirrored splits.
- Everything centred.
- Three parallel items everywhere (three features, three stats, three steps) when the content has another number.
- Three equal cards with an icon in a tinted square above a heading. Rows of identical cards. A bento grid of rounded tiles with filler content.
- A card inside a card. A thick colored stripe on a card's side or top.
- The AI nav (wordmark left, links, button right, hairline under) and the AI footer (four link columns, social row, copyright) by reflex.
- An email sign-up as the last section on a page whose job is not subscribing.
- Thin sections: a heading and a paragraph standing alone; a narrow column with the other half empty; a dead band under the hero.
- Rows of 24+ identical marks (dots, ticks, bars) standing for a number. Set the number in type.

### Visual and color
- Violet/indigo gradients; purple-blue or purple-pink gradients; gradient text.
- Glass panels, backdrop blur, floating pill navigation.
- Glow, aurora, mesh blobs, blurred orbs behind content.
- A soft grey shadow under every card; one medium radius (12-16px) on everything.
- Cream + high-contrast serif + terracotta; near-black + one neon accent; broadsheet hairlines everywhere.
- A framework's stock swatch as the brand color.
- Fake dashboard made of grey bars and donut charts; a hand-drawn browser window or OS title bar.
- Emoji as icons or bullets.

### Type
- Eyebrow labels above headings; a pill badge ("New", "Beta") above the hero.
- One word of a headline in italic, color, serif or underline.
- Tiny uppercase letter-spaced labels; monospace labels as a "technical" costume.
- Index numbering (01 / 02 / 03, "Step 02") when the content is not a real sequence.
- The default font (Inter, Roboto, system-ui) as the display face; nine near-equal sizes; everything bold.
- A full sentence at display size over three or four lines.
- Middle-dot meta strings (A · B · C); "→" glued to every link; "WORD - fragment" labels; em dashes as a habit.

### Imagery
- Grey placeholder boxes, empty gradient blocks, icons in squares where a picture belongs.
- Stock photos that read as stock at once; a mixed set with different light and filters.
- Drawn illustrations, illustration packs, 3D blobs, isometric scenes, abstract floating shapes.
- Text on a busy photo with no scrim; body text on a picture.
- Laptop and phone mock-up frames; shrunken unreadable screenshots.
- Photos covering the whole page one after another with no type section between them (a stock gallery).

### Copy
- See `ui-copy` §3: buzzwords, fill-in-the-blank and three-word-slogan headlines, "not just X", stock buttons, invented proof, placeholder names.

### Motion
- The same fade-up on every block; a dozen staggered hero entrances.
- Hover lift or zoom on every card and image; more than one hover effect on one element.
- Bounce, elastic or overshoot easing on interface elements.
- Meaningless infinite loops (pulsing dots, shimmering text, spinning badges) with no off switch.
- Preloaders, counters before content, gates; scramble or typewriter text; buttons that follow the cursor.
- Reveals that never fire and leave a blank band; content held at opacity 0.
- `transition: all`; `ease-in` on entrances.

### Code and process
- Decisions you cannot justify ("it's common").
- Hand-rolled controls where native ones exist (`<div onclick>` instead of `<button>`); dropdowns without keyboard support.
- Raw literals (`#fff`, `bg-white`, `13px`) instead of tokens; random spacing values; mixed radii; mixed depth strategies.
- Structural hacks: negative margins undoing parent padding, escape-hatch `calc()`, absolute positioning to dodge layout.
- Missing states (hover, focus, disabled, loading, empty, error): the fastest tell of an unfinished interface.
- Layout shift, horizontal overflow on phones.
- Forms that print "Thanks!" with no request behind them.

## 2. What to put in their place

| Instead of | Do |
|---|---|
| Eyebrow label | Put the information in the heading or first sentence, or drop it |
| Index numbering | Order by position, scale, words; a real `<ol>` only when order matters |
| Hairlines and boxes | Space, a step of ground tone, a change of scale |
| Decorative gradient or glow | Flat color, a code-made ground behind a real object, or a real photo |
| Resting shadow | A tone step between surfaces; shadows only on floating layers |
| Glass nav | A plain bar on the page ground: wordmark, a few links, one action |
| Icon-topped cards | A composed section built from real content and images |
| Accent word in a headline | One face, one color; a line break carries the stress |
| Fake dashboard | A real screenshot or a true-size interface fragment with real data |
| Fade-up everywhere | The three-stage motion plan (`ui-motion`) with one standout moment |
| Emoji | Words or a real picture |
| Stock section order | The order of the argument and the visitor's job (`ui-sections` §5) |

When you remove a pattern, do not drop a different decoration into the gap. Use the space for bigger type, the full real content, a real image of the subject, or a plain block of color.

## 3. Do not over-correct
- Removing every pattern and adding nothing leaves a bare, lifeless page, which looks generated too. A quiet page still needs scale, real content and real images.
- Keep deliberate choices. A bold choice made for a stated reason is not a pattern to remove.
- Do not copy flaws from trendy sites either: tiny 9-13px text, key facts hidden for style, text over video with no overlay, splash screens.

## 4. Fast checks
1. **Similar-brief check:** would another brief in the same field produce this same hero, layout, palette and font? If yes, change one big decision.
2. **Name check:** replace the brand name with a rival's. If the first screen still works, the page has no idea of its own.
3. **Blur check:** blur your eyes. The order of importance should survive and nothing should jump out harshly.
4. **Default check:** imagine your font and layout replaced with the most common ones. If nothing feels lost, you used defaults.
5. **Naming check:** read your CSS variable names. Names taken from the subject (`--clay`, `--harbor`) show intent; `--gray-700`, `--surface-2` show a template.
6. **Subtract one:** remove one decorative element before shipping.
7. **Label check:** delete the small line above each heading. If nothing was lost but a name, it was filler.
