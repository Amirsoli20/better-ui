---
name: ui-copy
description: Writing the visible words of a UI - headlines, section heads, button labels, word budgets per screen, banned generated phrasing, honest content (no invented proof), missing-fact slots, and UX writing for errors, empty and loading states. Load before writing or editing any text that appears on a page or screen.
---

# UI Copy

Generic words make a page look generic even when the layout is good. Write plainly, the way the business owner would explain it to a customer face to face.

## 1. Budgets
- **One idea per screen.** About 80 words on any one screen at most; about 450 visible words on a whole landing page.
- Hero: headline (at most 7 words) + one sentence (at most ~12 words, saying what it is, for whom, and the one difference) + one or two actions.
- Section heads at most 6 words; a section intro is one line; paragraphs are two short sentences; lists four items; tables five rows.
- If content does not fit one screen, **cut or split the section; never shrink the text** (`ui-sections` §1).
- Check: the hero plus the section headings alone should explain the whole offer. If they do, the body text can stay short.

## 2. Check every line
1. Is it concrete enough to picture?
2. Does it state something checkable, not just a mood?
3. Is it specific to this business? Put a rival's name on the line. If it still fits, rewrite it around a detail only this business has. ("The best tool for your team" fits anyone; "Repairs back in 48 hours, or the next one is free" fits one shop.)

## 3. Shapes and words
- Section heads say what the visitor gets ("Bikes fixed while you wait"), never a category label ("Features", "Our story", "Why us").
- Verbs over adjectives. A short line beside a longer one. One idea per sentence. Specific beats clever; a pun once per page at most.
- **Banned phrasing:** unlock, unleash, supercharge, elevate, empower, streamline, seamless, effortless, robust, cutting-edge, next-generation, world-class, best-in-class, industry-leading, all-in-one, game-changer, journey, reimagine(d).
- **Banned shapes:** fill-in-the-blank headlines ("The AI-powered platform for modern teams"); three-word slogans ("Fast. Simple. Secure."); the correction ("Not just a tool, it's a workflow", "More than a..."); "X, reimagined"; "Welcome to..."; "Meet..." for something nobody has met; "Whether you're X or Y"; "Say goodbye to"; a question the reader did not ask; a headline that needs a colon; two short fragments in a row ("Less work. More time.").
- No adjective triads ("fast, simple, powerful"). No filler openers ("In today's landscape", "Built for the modern team").
- No filler text: "Est. 2024", coordinates, local time, version stamps, "Scroll to explore", "Available for work" with a dot, captions narrating the design.
- Repeat a fact once, where it does work. A price printed in four sections reads as filler. A section's last line never restates its heading.

## 4. Actions
- Buttons name the action with a verb: "Book a table", "Download for Mac", "Save changes". Not "Get started", "Learn more", "Submit", "Click here".
- One name per action across a flow ("Publish" leads to "Published").
- No stock second button beside the primary. A secondary action is a plain text link.
- The nav action is the visitor's goal as a verb (Book, Tickets, Shop, Start free).

## 5. Honesty
- **Never invent** metrics, testimonials, customer logos, review stars, press quotes, case-study counts, team members, or "10,000+ teams". If the user did not give it, it does not exist.
- No placeholder identities (Jane Doe, Acme, User 1, lorem ipsum).
- **A missing fact becomes a visible text slot**, never an invented value: "Opening hours to be confirmed" in a muted dashed outline. Two slots per page at most; list each in the report.
- A section the user named but gave nothing for: its heading + one line + one slot, or merge it into a neighbour.
- A form with no backend never prints success. Say plainly: "Nothing was sent. This form is not connected yet."
- Sample data uses `example.com` and round plausible values that no visitor could take as a claim.

## 6. UX writing (states)
- **Errors:** what happened, why if known, what to do next. No "Oops", no apology, no exclamation marks. Put the message where the error is.
- **Empty states:** what is empty, why it matters, one action ("No invoices yet. Create your first invoice.").
- **Loading:** show a state after 150-300ms, keep it at least 300ms; add "Loading…" text past 2 seconds.
- **Success:** silent when the user can see the result. No toast for something already visible.
- Use the user's words, not system words ("Notifications", not "webhook config").
- Punctuation rules (quotes, ellipsis, no em dashes) are in `ui-type` §6.
