---
name: ui-motion
description: Motion for websites and UI - the three-stage motion plan (loops inside sections, transitions between sections, mouse reactions on part of the components), eased mouse-wheel scrolling with a soft magnet to sections, effect menus with conditions, motion tokens (durations, easing, stagger), tool choice (CSS, View Transitions, GSAP), accessibility and performance rules, and a lint script. Load before adding any animation, hover effect, scroll effect or scroll behaviour.
---

# UI Motion

Assets in this skill:
- `assets/motion.css`: tokens, section scroll base, reveal, loops, hover effects, reduced-motion and pause rules.
- `assets/motion.js`: eased wheel + soft magnet + section transitions + anchor glide + reveal-once + loop pausing + spotlight/tilt. No library.
- `scripts/motion-lint.mjs`: flags motion tells in source (`node scripts/motion-lint.mjs <folder>`).

## 0. Two rules above all
1. **The static page must already be finished.** Motion is the last layer. With motion off, scripts off, or a library failed, the page is complete.
2. **Every effect has a reason or it is cut.** Ask what is lost if it were instant. An effect that only shows off hides the content.

## 1. [CORE] Motion in three stages (landing pages and websites)

| Stage | What | Budget | Lives in |
|---|---|---|---|
| **1. Life inside sections** | A light effect, usually a loop, so a section feels alive, not dead | Out of 10 sections, **at least 3 or 4** have a loop or another interactive effect. Not every section. | Full-screen sections (`ui-sections` §1) |
| **2. Transition between sections** | Moving from one section to the next with the wheel or trackpad feels like a transition. Not big, not overcomplicated. | **Every section change has a transition** (built in §4) | Between sections; grouped sections are held together by stage-2 scroll effects (sticky title, stacking parts) |
| **3. Mouse connection** | The mouse feels connected to the page | **About 20% to 30% of the components** react to the mouse (hover state or a mouse effect). Not all. | Buttons, cards, images, links, list rows |

App screens do not use this plan: feedback only (`ui-app-screens` §7).

## 2. [CORE] Safety rules (apply to every effect)
- Respect `prefers-reduced-motion: reduce`: parallax and scroll-moved elements can cause dizziness (WCAG 2.3.3 names them). With reduce on, the page works and looks right with no motion.
- Animate only `transform`, `opacity` and `clip-path`. Never width, height, top, left, margin, padding; never `transition: all`. (Accordions may animate `grid-template-rows`.)
- Use `IntersectionObserver` for "when it enters the screen", not heavy scroll listeners. Read layout at most once per frame in `requestAnimationFrame`.
- CSS scroll-driven animations (`animation-timeline`) have limited browser support: wrap them in `@supports (animation-timeline: view())` so unsupported browsers still show all content.
- Never hide important content behind an animation. Reduce or remove heavy effects on phones.
- Hover does not exist on touch: every hover effect has a tap or focus version; keyboard users get a visible focus state.
- Pause loops when their section is off screen and when the tab is hidden. Anything moving longer than 5 seconds needs a way to pause (a visible "Pause motion" control, `[data-motion-toggle]` in the assets) and pauses on hover and focus.
- Nothing lags when scrolling. Test on a throttled CPU.

## 3. [CORE] Effect menus

Pick per page from these menus, inside the budgets of §1. Tags: **default** = safe first choice; **rare** = at most once per page and only when the brand is playful or expressive; **conditions** = listed limits apply.

### Stage 1: loops and life inside a section
| ID | Effect | Use |
|---|---|---|
| L1 | Slow float: objects, cut-outs or cards drift a few pixels up and down | default. 4-8px, 6-10s cycle, linear or sine |
| L2 | Gentle wiggle or rotate of badges and stickers | rare. 1-3 degrees |
| L3 | Marquee strip of text | conditions: one per page, never text people must read, pauses on hover/focus, 20-60s cycle |
| L4 | Moving background: gradient, noise or waves shift slowly | default. Code-made grounds only, slow (20s+), counts in the color share |
| L5 | Pulse or breathe on a dot, badge or the main button | conditions: only on something that is really live or the one key action; scale at most 1.04 |
| L6 | Changing word: one headline word cycles or types every few seconds | rare. The full headline stays readable at every moment; the static fallback shows one word; screen readers get the full set once |
| L7 | Mini demo loop: a task gets checked, a number counts, a card slides in | default for software. Real product content only |
| L8 | Slow zoom or pan on a photo | default. Scale 1.00 to 1.06 over 15-25s |
| L9 | Line drawing or a small animated icon | conditions: real diagrams or one icon; not filler |
| L10 | Entrance on arrival: parts of a section appear one after another, once | default. Reading order, at most 4 steps, settled within 0.9s |
| L11 | Count up when numbers enter, once | conditions: real numbers only; the final value is in the DOM for screen readers |

### Stage 2: transitions between sections
| ID | Effect | Use |
|---|---|---|
| S1 | Cover: the next section slides over; the old one stays and dims or shrinks | default (this is the built-in transition, §4) |
| S2 | Reveal: the current section lifts away, the next is underneath | conditions: sticky stage, ends cleanly |
| S3 | Color morph: the ground changes smoothly to the next section's color | default when sections change ground color |
| S4 | Mask reveal through a growing circle, rectangle or shape | rare. Once per page |
| S5 | Zoom through: an element scales until it becomes the next section | rare |
| S6 | Soft crossfade: content fades and lifts slightly as the next arrives | default for quiet brands |
| S7 | Shared element: one object travels from one section into the next | conditions: one per page, the object really belongs to both |
| S8 | Shaped edge: wavy, diagonal or torn edge between two sections | conditions: static shape, from the brand's material |
| S9 | Pinned horizontal track: the page pauses, content slides sideways, then continues | rare. Under 3 screens of scroll; keyboard reachable; a normal vertical layout on phones and with reduced motion |

### Stage 2: effects while scrolling inside a section
| ID | Effect | Use |
|---|---|---|
| E1 | Reveal on scroll: elements fade and rise as they enter, in sequence | default, once, below the fold only; one reveal style per page |
| E2 | Parallax: layers at different speeds | conditions: imagery only, travel under 8% of the element, never on text, off on phones and with reduced motion |
| E3 | Pinned or sticky element while content beside it changes | default for groups (`ui-sections` §2) |
| E4 | Scroll scrubbing (progress follows scroll, forward and back) | conditions: linear easing, static end state, phone plan |
| E5 | Text reveal: words or lines appear or fill with color as you scroll | conditions: one statement per page, 3-5 lines, starts at 45% ink minimum |
| E6 | Image unmask: a photo grows from a small frame or opens through a mask | default once per page |
| E7 | Progress indicator through the page or a group | conditions: only for long groups or long pages |
| E8 | Color inversion: text and ground swap at a point | rare |
| E9 | Line or path drawing along the scroll | conditions: real paths (a route, a process) |
| E10 | Speed effects: skew or blur by scroll speed | rare. Heavy; never on text |
| E11 | Smooth scrolling | replaced by the built-in eased wheel (§4); do not add a scrolling library on top |

### Stage 3: mouse effects (about 20-30% of components)
| ID | Effect | Use |
|---|---|---|
| M1 | Hover lift: a card or button rises, its shadow moves | default on a minority of cards; lift at most 2-4px |
| M2 | Hover fill: color wipes across a button, an arrow nudges forward | default for primary actions |
| M3 | Card tilt in 3D toward the mouse | conditions: max 6 degrees, pointer:fine only, one card group |
| M5 | Spotlight: a soft, very smooth glow follows the cursor over a card or ground | default for one surface; glow in the primary/accent at low opacity |
| M6 | Custom cursor: dot and ring following with a small delay | rare. Playful/creative brands only; the system cursor stays for text and inputs |
| M7 | Cursor changes with context ("View", "Drag", grows over links) | conditions: only with M6 |
| M8 | Image hover: zoom, reveal, swap or ripple | conditions: on the container, one effect per image group, not every image |
| M9 | Mouse parallax: layers shift a little with the mouse | conditions: layered-image sections only, travel under 12px |
| M10 | Cursor trail or sparkles | rare. Playful and heavy |
| M11 | Text hover: underline draws in, or a word changes color | default for links. Letter shuffling is rare and the label must stay readable |
| M12 | Hover preview: hovering a list row shows an image near the row | conditions: anchored to the row, not glued to the cursor; thumbnails inline on touch |
| M13 | Dim the others: hovering one link or card dims neighbours | conditions: neighbours stay at 40%+ opacity |
| M14 | Drag a sticker, card or slider | conditions: keyboard and button alternative |
| M15 | Click feedback: press squish, ripple or small burst | default squish (`scale(.97)`); burst is rare |
| M16 | Look at the cursor: eyes or an arrow turn toward the mouse | rare |

**Banned:** buttons or elements that move to follow the cursor (magnetic buttons).

## 4. [CORE] Smooth scrolling and section transitions

The goal: scrolling feels smooth and different from plain scrolling, with a transition between every two sections. A hard snap that sticks like a magnet is not the goal.

1. **Ease the mouse wheel.** A wheel turn does not jump: the page speeds up and slows down smoothly toward the target (one 120px wheel step eases over about one second). Only for a real mouse wheel on desktop. Scrollbar drag, keyboard, touch, find-in-page and zoom stay native.
2. **Soft magnet, not hard snap.** No CSS `mandatory` snap. After scrolling stops, if the page is within about 12% of the screen height of a section start, it glides there. Otherwise it stays where the person stopped. A tall group is never locked.
3. **A transition between every two sections.** The next section opens from a rounded card to full width while the section before eases back (about 5% smaller, about 45% lighter). Driven by scroll position so it moves with the person, not on a timer.
4. **Links glide too:** in-page anchor links scroll there with the same easing; keyboard focus moves to the target at once.
5. **Safe by default.** With reduced motion, or without a fine pointer, the page uses native scrolling with a soft CSS snap (`proximity`), and transitions are off. A page without JavaScript scrolls normally.

Build: include `assets/motion.css` and `assets/motion.js`, mark sections with `data-section` (and `data-snap="off"` for any section the magnet should ignore). The script:
- keeps the scroll position real (no fake scroll container, no custom scrollbar, no pinned screens), so it is not scroll hijacking;
- turns CSS snap off while easing runs (snap and easing fight each other);
- stops easing at once if the user drags the scrollbar, presses a key, or touches.

Check: scroll a full page with a simulated wheel: it eases, reaches the end, never gets stuck; repeat with reduced motion (nothing moves) and at the six sizes. Check `clip-path` on large sections on a slow device (throttle CPU 4-6x).

## 5. Motion language (derive numbers, never guess)

### 5.1 Frequency test (before any animation)
- Seen once per visit (hero, section entrance) → may take its time.
- Seen many times (hover, menu, accordion) → fast and small.
- Seen hundreds of times (typing, keyboard actions, sorting) → **no animation**.

### 5.2 Tokens (one source for CSS and JS; no raw numbers in code)
| Token | Value | For |
|---|---|---|
| `--dur-micro` | 120ms | press, color change |
| `--dur-short` | 220ms | hover that moves, tooltip, menu |
| `--dur-long` | 420ms | dialog, drawer, accordion |
| `--dur-reveal` | 800ms | section entrances, line rises |
| `--dur-open` | 1200ms | one image opening or mask per page |
| exit | 60-75% of the matching enter | everything that leaves |

Scale all durations by the brand's feel with one multiplier (`--motion-scale`): sharp brands about 0.7x, efficient brands about 0.9x, relaxed brands 1.0-1.3x. Direct interaction stays under 300ms; functional animation never over 500ms.

| Ease role | CSS | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | arrivals and hovers under 600ms (default) |
| `--ease-expo` | `cubic-bezier(.16,1,.3,1)` | long reveals, line rises, openings |
| `--ease-inout` | `cubic-bezier(.76,0,.24,1)` | things travelling while visible (wipes, indicators) |
| `--ease-exit` | `cubic-bezier(.55,.055,.675,.19)` | the only legal ease-in: short exits |
| `linear` | `linear` | scroll-linked motion and loops (the user's own scrolling already gives the speed curve) |

- No bounce, elastic or overshoot on interface elements. Exception: a declared playful brand may use slight overshoot on one primary control and one character moment.
- Stagger: rows 20-40ms, cards 50-90ms, heading lines 80-110ms, characters 20-40ms only in headings of 1-3 words. At most 4 steps in a sequence; never hold content hidden more than 900ms once in view.
- Distance: entrance rise 8-16px for small items, 16-32px for blocks. Never animate from `scale(0)`; start at 0.95-0.98. Press `scale(.97)`.
- Origin: menus and popovers open from their trigger; exits retrace entrances; one primary mover at a time.

## 6. Choosing the tool (lowest that works)
1. State change on hover/focus/class → CSS transition.
2. Keyframes with no JS control, loops → CSS `@keyframes` (entry via `@starting-style`).
3. Menus, dialogs, popovers → `<dialog>`, Popover API + CSS.
4. Page-to-page or shared element → View Transitions (`@view-transition { navigation: auto }`; old ~200ms out, new ~380ms in, total under 480ms).
5. Scroll-linked single property → CSS scroll timelines inside `@supports`, or the assets' rAF loop.
6. Reveal once → IntersectionObserver + class (in the assets).
7. Sequencing many elements, runtime control, scrub with smoothing, pinning with snap, layout (FLIP), text splitting, SVG morph, drag with momentum → GSAP.

Do not load a library when steps 1-6 cover the page. If the project already has a motion library, use it instead of adding a second one.

### GSAP rules (when it is used)
- Register plugins once, client-side only, after mount. Scope selectors to a container. Revert on unmount (`gsap.context` + `ctx.revert()`, or `useGSAP` with `scope` in React).
- Reduced motion and breakpoints through `gsap.matchMedia()`; it reverts automatically when the query stops matching.
- Override library defaults (0.5s, `power1.out`) with the tokens: `gsap.defaults({ duration: .42, ease: "power4.out" })`. Close built-ins: out ≈ `power4.out`, expo ≈ `expo.out`, inout ≈ `power3.inOut`, exit ≈ `power2.in`, linear = `"none"`.
- Use transform aliases (`x`, `y`, `scale`, `yPercent`), timelines with the position parameter instead of chained delays, `stagger` instead of many tweens, `clearProps` to hand the end state back to CSS.
- ScrollTrigger goes on a timeline or top-level tween, never on a child tween. `scrub` and `toggleActions` are alternatives, never both. Pin the container, animate its children. Scrubbed and horizontal `containerAnimation` tweens use `ease: "none"`. Create triggers top to bottom; call `ScrollTrigger.refresh()` after fonts and images load. `markers` only in development.
- SplitText: split lines or words (chars only for 1-3 word heads), `autoSplit: true` with the animation created in `onSplit`, `aria: "auto"`, no `text-wrap: balance` on split heads.
- Do not use `autoAlpha` to hide focusable content until a scroll reveal (it removes it from the tab order); use `opacity`.
- Never ship dev tools. Do not use a scrolling library together with the eased wheel.

## 7. Resilience layers (the page works at every level)
| Layer | Guarantee | How |
|---|---|---|
| Base | Finished page with CSS only | No hidden states in base CSS |
| Script gate | Hidden start states only if JS runs | `<script>document.documentElement.classList.add('js')</script>` in `<head>`; rules under `.js` |
| Motion gate | Hidden states only if motion is allowed | `@media (prefers-reduced-motion: no-preference)` |
| Feature gate | Scroll timelines only where supported | `@supports (animation-timeline: view())` |
| Context gate | Heavy effects only where they work | `(hover: hover) and (pointer: fine)`, `(min-width: 60rem)` |
| Failure | If a script fails, nothing stays hidden | Remove the `js` class on failure; never animate from hidden without a fallback |

Reduced motion means fewer and gentler, not broken: keep opacity and color changes, drop travel, scale, parallax, loops and autoplay.

## 8. Checks (motion is not done until all pass)
- Count: of every 10 sections, 3-4 have a loop or interactive effect. About 20-30% of components react to the mouse. Every section change has a transition.
- Every effect has a reason; no effect on actions repeated many times a day.
- Only transform, opacity, clip-path animate; tokens everywhere; exits shorter than enters.
- Reduced motion emulated: the page works and looks right with nothing moving.
- JavaScript disabled: nothing hidden. Touch and keyboard: every hover effect has a tap or focus version; focus ring instant and never covered.
- Loops pause off-screen, in hidden tabs, and through the pause control.
- Nothing lags at 4-6x CPU throttle; no layout shift from motion.
- Lint passes: `node scripts/motion-lint.mjs <src>`; review every warning.
