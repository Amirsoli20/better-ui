---
name: ui-components
description: Building interactive UI correctly - every component state, buttons, inputs and forms, navigation, dialogs, tooltips, toasts, tables, hit targets, accessibility (WCAG 2.2 AA), responsive and touch rules, and performance. Load when writing any interactive element, form or page code, or when checking accessibility and responsiveness.
---

# UI Components

## 1. Use what exists
1. Native element first (`<button>`, `<a>`, `<input>`, `<select>`, `<dialog>`, `<details>`, Popover API).
2. Then the project's own components and tokens.
3. Then a proven headless primitive.
4. Hand-roll only as a last resort, with the full contract: keyboard (arrows, Enter, Escape), focus trap and return, ARIA roles and state, click-outside, scroll lock.
- Extract a component on its second real use. Bind to semantic tokens (`--surface`, `--ink`), never raw literals.

## 2. States are not optional
Every interactive element has **default, hover, focus, active, disabled**; anything async adds **loading, error, success**; every data region adds **empty**.
- Focus ring: `outline: 2px solid var(--focus); outline-offset: 2px`, contrast 3:1, appears **instantly** (never fades in). Never remove an outline without a replacement.
- Hover only behind `@media (hover: hover) and (pointer: fine)`; every hover effect has a focus and tap equivalent. Hover raises contrast, never lowers it.
- Disabled: three channels (reduced opacity ~0.55, `cursor: not-allowed`, the native `disabled` attribute), still legible, explained.
- Press: `transform: scale(.97)` or a 1px drop, never below 0.95.

## 3. Buttons
- One filled primary button per screen. Secondary is outlined or a text link. Never two filled buttons side by side.
- Marketing pages: control height 44-52px. App UI: 32-40px with a 44x44 hit target.
- Two button sizes at most. Labels never wrap at any width (shorten, then `white-space: nowrap`).
- Hierarchy by role, not by meaning: a "Delete" that is not the main action is a quiet secondary; full red belongs to the confirmation.
- Flat fill, no glow, no gradient. During async work show a loading state inside the button.

## 4. Inputs and forms
- Label **above** the field, always visible. No floating labels, no placeholder as label. A placeholder shows a format, never an instruction.
- Field text 16px+ (avoids phone auto-zoom). Field height matches the button beside it. The border width never changes between states; the focus ring is an `outline`.
- Semantic types and `inputmode`, `autocomplete`, allow paste and password managers.
- Validate on blur once touched, then on input. Errors sit under the field in a reserved line (`min-height: 1lh`), linked with `aria-describedby`, saying what broke and how to fix it. No shake. After a failed submit, an error summary at the top with focus moved to it.
- Keep user input on errors. Group related fields with `fieldset`/`legend`. Ask only for what is needed.
- Submit is disabled only while a request is in flight. A form with no endpoint says nothing was sent.

## 5. Overlays
- Dialog: `<dialog>` + `showModal()`, background `inert`, first focus on the first control, Escape closes, focus returns to the trigger, a visible close button. Do not close on outside click when unsaved work could be lost.
- Menus and popovers open from their trigger (origin-aware), Escape closes, arrows move.
- Tooltips: delay 800-1000ms on hover, 0 on focus; also shown on focus; never the only place for important information.
- Toasts: for failures and effects the page cannot show; `aria-live="polite"`; never steal focus; error toasts do not auto-dismiss and offer retry.
- Prefer undo over "Are you sure?" for reversible actions. Irreversible actions keep a confirmation that names the object.
- Anything auto-rotating or moving past 5 seconds pauses on hover and focus and has a visible pause control.

## 6. Tables and lists
- Numbers right-aligned in tabular figures; fixed decimals per metric; thousands separators; header text sentence case, not uppercase tracked.
- No zebra stripes; separate rows with space or a light 1px rule. No outer border.
- Real zero prints ("$0"); missing is a grey dash.
- Phones: tables become two-line lists, or scroll inside their frame with the naming column fixed.

## 7. Accessibility baseline (WCAG 2.2 AA)
- Contrast: body 4.5:1, large text and UI parts 3:1 (`ui-color` §3).
- Keyboard: everything reachable and operable; visible focus; focus never hidden under sticky or pinned elements (`scroll-padding-top`); tab order = visual order.
- Hit targets 44x44 (extend small controls with a pseudo-element); never overlapping targets.
- Semantics: one `h1`, no skipped heading levels, landmarks (`header`, `nav`, `main`, `footer`), `lang`, `<title>`, meta description.
- Images: meaningful `alt`; decorative `alt=""` or `aria-hidden`. Decorative SVG/canvas: `aria-hidden="true"`.
- Icon-only controls have accessible names; toggles expose pressed/expanded state.
- No information by color alone. No flashing more than 3 times per second. Video autoplay only `muted` with `playsinline` and a poster.
- Text survives 200% zoom and user spacing overrides (fluid sizes, unitless line-height, no fixed-height text boxes).
- Content visible without JavaScript: nothing ships hidden waiting for a script.

## 8. Responsive and touch
- Mobile first. Two or three breakpoints in rem (for example 40rem and 60rem); `clamp()` for continuous scaling.
- Use capability queries (`hover: hover`, `pointer: coarse`) for interaction, not widths.
- `svh`/`dvh` for heights, never `vh`. Respect safe areas (`env(safe-area-inset-*)`).
- No horizontal scroll 320-1920 (`overflow-x: clip` on `html` and `body`). Long URLs and IDs: `overflow-wrap: anywhere`.
- Clickable text never wraps; essential text is never clamped to make cards equal.
- The phone is a second composition: re-crop images to portrait, stack in reading order, drop decorative layers, keep every fact (never hide content only on phones).
- Touch targets 44x44 with 8px between them. Gestures always have a button alternative.

## 9. Performance (a UI concern)
- Reserve space for everything (image dimensions, `aspect-ratio`, reserved error lines): CLS under 0.1.
- Hero text and hero image paint on the first frame. Hero image `fetchpriority="high"`, never `loading="lazy"`.
- Images WebP/AVIF, lazy below the fold. Fonts: only used weights, `font-display: swap`.
- Interactions respond in under 100ms. Do not ship a library for what CSS does (`ui-motion` §6).
