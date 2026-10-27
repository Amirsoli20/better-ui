---
name: ui-sections
description: Page structure for landing pages and websites - full-screen sections stacked like slides, the peek of the next section, grouped sections, hero composition, spacing, grid, frame and section variety. Load when laying out any page or section, deciding section heights, or grouping related content.
---

# UI Sections

## 1. [CORE] The page is a stack of full-screen sections

**The failure to avoid.** AI treats a page as one long strip: blocks stacked top to bottom, each only as tall as its content plus padding. No block is composed for what the user sees on one screen, so the page reads like a document.

**The rule.** Design section by section. Each important section fills the user's screen height and is composed as one picture, like a slide. Scrolling moves from one section to the next.

### 1.1 Rules
1. **Height.** The hero and every section where context matters are at least the full screen height. Width can be wide or narrow; height is the full screen.
2. **One composition per section.** Everything the section says fits on one screen as one designed picture. If it does not fit: cut the copy or split it into two sections. **Never shrink the text to squeeze it in.**
3. **Section to section.** Scrolling moves to the next section, not through a long strip (scroll mechanics: `ui-motion` §4).
4. **The peek.** When a section relates to the next one, make it a little shorter than the screen so a sliver of the next section shows at the bottom. The sliver must hold something real (the top of a heading, an image edge). Empty space is not a peek. Use it on purpose, not on every section.
5. **About 90% of sections are full-screen.** It is the default, not a law. Low-weight sections (footer, a short numbers strip, a single line) stay normal height. Decide per section: does the content have enough weight for a whole screen?
6. **Each section is its own slide.** Own layout, own focal point, own image treatment. Neighbouring sections never share the same layout.
7. **No empty full screens.** A full screen with little content looks empty. Each section needs one strong focal point, usually an image (`ui-images`).

### 1.2 Build
```css
[data-section] {
  min-height: 100svh;               /* never a fixed height; svh survives phone address bars (dvh is the alternative) */
  display: grid;                    /* place content with grid or flex so the focal point stays anchored */
  align-content: center;
}
[data-section][data-peek] {
  min-height: calc(100svh - 12vh);  /* peek = 8-15% of screen height */
}
```
- Never use `vh` for section height (phone bars break it). Never `height:`; always `min-height:` so a section can grow on a short screen.
- Scale type and spacing with `clamp()` and viewport units so the composition keeps its shape from a laptop to a large monitor.
- Keep tab and focus order equal to visual order.
- Snap and wheel behaviour is defined in `ui-motion` §4 (soft magnet, not hard snap).

### 1.3 Risks
- **Short screens and phones:** a section that fits at 900px may not fit at 720px or on a phone. That is why it is `min-height`: it may grow taller than the screen there, which is fine.
- **Too much copy** is the most common failure. Cut or split. Never shrink.
- **Accessibility:** keyboard scrolling, focus order and reduced motion keep working.

## 2. [CORE] Grouped sections

**The failure to avoid.** With related content, AI either crams everything onto one screen, or splits it into separate sections with the same gap as unrelated sections. Both hide that the pieces belong together.

**The rule.** Find content that belongs together and present it as one group: one section in the reader's mind, but its parts do not have to share one screen. Example: four services are four parts of one idea; give them one shared surrounding, then move on.

### 2.1 Rules
1. **Find the group first.** Test: would a reader describe these pieces as one thing? Candidates: services, features, process steps, case studies, team, testimonials. Decide from the content, not from this list.
2. **One group, many parts.** Each part may be full-screen or shorter.
3. **Closer inside than outside.** Spacing inside the group is smaller, and the look more alike, than between the group and its neighbours.
4. **Clear start and end.** The next section must feel like a new chapter.
5. **Group for a real reason.** Never group unrelated content to look designed. Grouping the wrong things hides real differences.
6. **Keep groups short.** A long group is tiring to scroll.

### 2.2 Three ways to bind a group (mix them)
- **Something stays in place:** a group title with a counter ("02 / 04") or a shared image stays fixed while the parts scroll beside it. Build with `position: sticky` (normal scrolling, no hijack).
- **Same background:** all parts share one background and one image treatment.
- **A hint of the next part:** each part is a little shorter than the screen so the next one shows.

### 2.3 Build
```html
<div class="group" data-group>               <!-- one wrapper carries the shared background and image grade -->
  <div class="group__rail"><h2>Services</h2><p class="count">02 / 04</p></div>  <!-- sticky -->
  <article class="group__part">…</article>
  …
</div>
```
```css
.group { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: var(--space-group-inner); }
.group__rail { position: sticky; top: var(--header-h, 0); align-self: start; }
.group__part { min-height: calc(100svh - 12vh); }   /* shorter than the screen when the next part should peek */
@media (max-width: 40rem) {
  .group { grid-template-columns: 1fr; }
  .group__rail { position: static; }                  /* on phones the sticky element becomes a normal header per part */
}
```
- Never two `position: sticky; top: 0` elements; offset the second by the first one's height.
- Check the sticky element never covers text or an image on short screens.

## 3. The hero (the first screen)

- Visible at 1280x800 without scrolling: the headline, one supporting sentence, the primary action, and the focal image.
- Headline at most 7 words, one sentence of at most about 12 words, one or two actions. About 80 words is the ceiling for any one screen.
- Say what this is: one `h1` at display size that names the thing or what it does.
- The memorable thing is on this screen. Check: imagine the screen without its image. If the message does not change, the image is not doing its job; pick a stronger one or make it bigger.
- Content is centred in its screen vertically (space below 1.0-1.5x the space above). No dead band of more than ~160px between the lowest content and the fold.
- Avoid: centred headline + subtitle + two buttons + screenshot below (the most common generated hero). Text beside a picture is the second most common: use it only when the picture is the strongest thing you have.

## 4. Frame, grid and space

### 4.1 The frame
- One pair of equal outer margins at every width (never under 16px). Navigation sits on the same margins as the content.
- A bleed starts from the margin and never moves the margin. Asymmetry lives inside the frame, never in the frame.
- Container: cap content around 1360-1520px and centre it. At 1920 the gutters grow; the measure and column counts do not.
- No horizontal scroll at any width 320-1920: `overflow-x: clip` on both `html` and `body` (never `hidden`, never `100vw` widths).
- Use the width you set up: if text takes one side, the other side holds an image, a figure or a second column. Half a screen of nothing is a hole.

### 4.2 Spacing
- Use a non-linear scale and tokens only, no raw values: `4, 8, 12, 16, 24, 32, 48, 64, 96, 144`. Need more space: take the next step. Not enough: jump two.
- **Space between groups > space within groups.** If a label's gap to its input equals the gap to the next label, the relation is ambiguous.
- A heading has at least 2x the space above it as below it.
- Start with too much space, then remove.
- **Empty space must be intended.** Space you planned looks calm; space left over by accident looks broken. If a screen looks empty, make the main element bigger or cut the section. Never add decoration and never just shrink the gap.
- Vary the rhythm: a dense section next to a quiet one. Identical gaps and density everywhere look automatic.

### 4.3 Alignment
- Pick 2-3 anchor lines (for example: the headline starts on column 5) and reuse them for section heads, captions, footer. Six anchor lines means nothing was decided.
- Every element on the grid. Off by 1-2px is wrong. Grid track sums must close; write the arithmetic down.
- Image grid tracks use `minmax(0, 1fr)`, never bare `1fr`. Display headings carry `overflow-wrap: break-word; min-width: 0`.
- Optical alignment: pull large headlines left ~0.04-0.06em when their first letter is round or diagonal.

## 5. Section variety and order

- **Order follows the argument**, not the stock order (hero, logos, features, testimonial, pricing, CTA). Each section makes one claim with proof. A section with no claim is deleted.
- **The visitor's goal decides the page shape.** Ask what the visitor came to do (book, buy, try, visit, attend, hire, subscribe) and build around it: that action sits in the nav and the hero, the sections give the facts that action needs (a booking page needs the place, the offer, times and address; a product page needs the product, price and options), and the page ends with the same action. End on what the visitor came to do, not on an email sign-up (unless the goal is subscribing).
- No two neighbouring sections share a layout. The same shape three times reads as a template. Alternate dense/quiet, image/type, light/dark ground.
- Break the system once on purpose (one centred line, one inverted section, one image at a very different scale).
- Every section has **visual weight**: an image at least ~360px tall, a set of three or four across, a list or table of 3+ rows, a working control, or one statement set very large. A heading with one paragraph is not enough to be a section.
- Section headings below the hero are large (~52px at 1440; under 40px makes a page look unfinished). Hero head ≈ 1.5x the section head.

## 6. Navigation and footer
- Nav: wordmark, 3-5 text links, one action that carries the visitor's goal as a verb (Book, Tickets, Start free). One line, 56-80px tall, on the page ground. If fixed, it never sits on content it hides; over images it gets a solid band or hides on scroll down.
- Phone: wordmark and one action visible; links in a plain full-screen sheet opened by "Menu".
- Footer: practical facts (address, hours, email, legal, image credits) at readable size on the page's anchor lines. Not four link columns by reflex.
