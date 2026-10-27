---
name: ui-app-screens
description: Dashboards, admin panels, settings and other product app screens - what changes versus landing pages, density, titles, KPIs without tiles, charts, tables, empty/loading/error states, shells and app-specific tells. Load when building or reviewing any application screen rather than a marketing page.
---

# UI App Screens

App screens follow `ui-color`, `ui-type`, `ui-components` and `ui-tells`, with these changes. The landing-page structure rules (full-screen sections, peek, hero, word budgets, image layouts, three-stage motion, eased wheel scrolling) **do not apply** to app screens. Here the goal is a tool that feels familiar and gets out of the user's way.

## 1. Before building
1. **Inventory the data:** the objects shown, their fields and units, realistic magnitudes (a new account has 1 to 9 of something, not thousands), who opens the screen and how often, what they do next.
2. **Write down the main question the screen answers** ("Are today's orders shipped?") and the most important fact right now. The biggest block answers that question.
3. **Write the sample data:** believable names, amounts that add up, dates in order, a unit on every figure, totals computed from rows.
4. **Give it one unique element:** something only this product shows (its own timeline, map, schedule grid or flow view), not a greeting above four stat cards.

## 2. Structure
- One `h1` per screen: a noun ("Invoices", the project name), 18-32px (about 24), optional one grey sentence about the data (period, scope, finding). Never a landing-page hero.
- Right of the title: only real actions or a freshness stamp ("Updated 4:09 PM" + refresh).
- Everything the brief names is visible on the first screen at 1440x900; cap long lists at 4-6 rows with "View all".
- The most frequent job is one click away.
- One filled primary action per screen at most (often none). Accent only for the primary action, current selection and state.
- A sidebar is earned by more than ~7 destinations. Same color as the canvas, never dark or saturated on a light screen; active item a neutral pill; group labels sentence case.
- Density is a decision: controls 32-40px with a 44px hit target, one gap value (often 16), card padding about 20, tables before cards. Type scale ratio 1.125-1.2; no fluid display heads.
- One neutral grotesk is fine here. No display face on labels, buttons or data.

## 3. Figures and KPIs
- KPIs are type, not tiles: one container split by dividers, or a bare strip. No icon in a colored circle, no sparkline on every KPI, no tinted tile.
- The answer figure is the largest on the screen (about 30-36px, 1.3x its siblings); nothing at 48px+.
- Labels above values, grey, sentence case. Units as smaller grey suffixes.
- Deltas: optional, never larger than the label, with the window in words ("vs prior 30 days"). Color says good or bad, not up or down; a zero change is grey.

## 4. Charts
- Form first: one value → a number; 2-5 values → horizontal bars; a series over time → a line; more than ~7 categories → a table; parts of a whole → a stacked horizontal bar. **Never pie, donut or gauge.**
- One accent series, everything else neutral; multi-series is a lightness ramp of one hue.
- Bars at most 24px thick with 2-4px gaps, always from a zero baseline. Lines 2px. 3-5 solid 1px gridlines. One y-axis, never dual axes.
- No 3D, shadows or gradients in marks (a faint area fade under one line is the only exception). Text never wears the data color.
- Label directly where possible; a legend only for 2+ series. Tooltips: plain box, label and value on one line.
- Never a picture of a chart. A fabricated series is worse than an empty slot.

## 5. Data states (every region that loads data has four)
- **Loading:** the final layout with flat grey bars at the real size of each value, headers shown at once, no layout shift when data lands.
- **Empty:** keep the frame and the header; one sentence and one action. An empty chart is drawn (zero line, no bars).
- **Error:** inside the block that failed, one sentence on what failed and when data was last good, plus Retry. Never a full-screen banner.
- **Full.** Counts follow the current filter. State lives in the URL.

## 6. Settings and forms
- Each settings area opens its own view with its name as the title.
- **One save model per view:** autosave with a quiet "Saved" stamp, or one Save per panel. Never both.
- Destructive actions last, in their own section, consequence in words, confirmation names the object.
- Show what a setting produces (a preview of the email or notification).

## 7. Motion on app screens
Feedback only: press, hover, focus, menus and sheets opening, a row arriving. Nothing performs an entrance. Nothing animates on actions repeated many times a day (typing, keyboard navigation, palette selection, sorting). Durations under 300ms.

## 8. App tells
- "Welcome back, Alex 👋" header; four KPI cards with icons in tinted circles and a green "+12.5%" pill on each.
- Gradient area chart with a smoothed spline and a dot on every point; rainbow chart palettes; a fat donut with a total in the hole.
- Dark navy sidebar with a colored active pill and left bar on a light app.
- Zebra tables under uppercase tracked headers with a checkbox, avatar, status chip and kebab on every row; left-aligned numbers in proportional digits.
- Saturated status chips with white text everywhere; accent on every button, tab and link.
- Placeholder people, round vanity totals, growth on a week-old account; totals that do not add up.
- Top bar with search, bell and avatar holding nothing real; pagination under a five-row list.
- Neon on dark, glowing borders, glass.
