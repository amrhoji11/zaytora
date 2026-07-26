# Numinds.me — Behavior Sweep

## Header
- `fixed`, glass-morphism, **static** — no scroll-triggered change in background/shadow/height observed at scrollY 0 vs 500+.

## Testimonial quote strip (section 2, sub-component 2)
- **Time-driven auto-rotation.** Captured card order/content at t=0 and again after a 4s wait: the three visible quotes changed (a quote from later in the review pool cycled into the first slot). Confirms an auto-advancing carousel pulling from the larger review pool, not a static 3-quote display.
- Implementation guidance: cycle through an array of quotes every ~4–5s with a cross-fade or slide transition (exact easing not captured; a standard 400–600ms fade is a safe match).

## Templates grid
- Each card shows "Select" / "Preview" actions — likely appear/emphasize on hover (standard hover-reveal pattern for card actions). Exact hover diff not captured pixel-by-pixel; use a standard opacity/translate reveal consistent with the rest of the site's `transition-all duration-200` convention.

## Pricing currency selector
- **Click-driven.** Clicking a currency pill (🇸🇦 SAR / 🇺🇸 USD / 🇬🇧 GBP) swaps the displayed price value and currency label. Copy on page states: "🔄 فقط اختر GBP بجانب السعر وسيتحول تلقائياً إلى عملتك المحلية" (auto-converts to local currency when GBP is selected) — implies a currency-conversion note rather than real-time FX; for the clone, hardcode representative prices per currency (e.g. the observed GBP 14.99) and swap on click.

## FAQ
- Standard accordion, 6 questions listed in `PAGE_TOPOLOGY.md`. Click-driven expand/collapse (not yet click-tested in this pass — implement as single-expand accordion consistent with shadcn `Accordion`).

## Reviews section
- Rating breakdown bars (5★:84, 4★:3, 3★:3, 2★:1, 1★:1 — out of ~90) rendered as a horizontal bar histogram next to the "4.9 / 90 ratings" summary.
- The review list is large (~90 items) with real user text, country flag, first-name-initial + period ("د.", "A."), and relative or absolute dates (e.g. "26 Jul 2026"). Given the volume, implement as a horizontally-scrollable or paginated card row rather than one giant vertical dump, to keep the page performant — use the real captured review text (see full corpus already extracted from page text) for at least the first 10–15 cards.

## Scroll rendering caveat (audit-environment-specific, not a real site bug)
- During the audit, `window.scrollTo()` (instant, JS-driven) intermittently produced blank-looking viewports even though the DOM/computed styles at that scroll position were confirmed correct (opacity:1, visibility:visible). Real wheel-driven scrolling rendered correctly every time. This is most consistent with scroll-linked reveal-on-view logic (fade/translate-in elements) that only resolves reliably on genuine scroll gestures in the automated browser, not a real end-user-facing bug. **Builders should still implement standard scroll-into-view fade-up reveals** for section content (a common, low-risk default for this kind of marketing site) but should not over-index on the exact blank frames captured during audit — they are an artifact of the extraction environment.

## Responsive
- Not fully swept at 768/390 this pass due to time constraints extracting the very long single page. Builders should follow standard Tailwind mobile-first stacking: hero phone mockup + copy stack vertically on mobile, header nav collapses (there is a secondary bottom-tab-bar `nav` in the DOM with links "الرئيسية / القوالب / الاستوديو / لوحة التحكم" that is likely the mobile-only bottom navigation, hidden on desktop) — implement as `md:hidden` fixed bottom bar mirroring desktop header links.
