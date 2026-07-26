# PricingSection Specification

## Overview
- **Target file:** `src/components/PricingSection.tsx`
- **Interaction model:** **click-driven** — confirmed live: clicking a currency pill changes the accent bar's gradient color to match that currency's flag colors, and swaps the displayed price/currency.

## DOM Structure
`<section class="py-28 bg-white relative overflow-hidden">` with two faint decorative blurred circles (`absolute ... rounded-full blur-3xl opacity-5`, top-right and bottom-left, `w-[600px]`/`w-[500px]`), then `div.max-w-3xl.mx-auto.px-4.relative.z-10`:
1. Heading (`text-center mb-20`): eyebrow `<p class="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">أسعار بسيطة</p>`, H2 `<h2 class="font-cinzel text-4xl md:text-5xl font-bold text-gray-900 mb-4">دعوة واحدة، سعر واحد</h2>`, subtitle `<p class="text-gray-600">اختر عملتك المفضلة. كل خطة تشمل تجربة الدعوة الكاملة مع جميع الميزات الفاخرة.</p>`.
2. Pricing card (`relative group` wrapper with a gold gradient glow that appears on hover behind the card via `absolute -inset-0.5 ... opacity-0 group-hover:opacity-100`): inner card `relative bg-white rounded-2xl p-8 md:p-12 border border-gray-100`:
   - Small accent bar at top: `h-1 w-12 rounded-full bg-gradient-to-r ... mb-6 mx-auto` — gradient colors match the selected currency's flag (see data table below).
   - Price block (`space-y-6 flex flex-col items-center text-center`): flag+currency-name row (e.g. "🇸🇦 Saudi Riyal"), then big price row: gold-gradient-text price number (`text-6xl font-bold`, using `.text-gradient-gold`) + currency code label beside it.
   - Divider: `h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6`.
   - CTA button "View Pricing": `w-full py-3 px-6 rounded-lg bg-gradient-to-r from-[#C8A24A] to-[#A68832] text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`.
3. Currency selector row below/within the card: label "اختر العملة" + 3 pill buttons, each `flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border`, showing flag emoji + currency code. The active/selected pill should be visually distinguished (e.g. solid gold background + white text) vs inactive (white/gray border).
4. Small note below: "🔄 فقط اختر GBP بجانب السعر وسيتحول تلقائياً إلى عملتك المحلية." (small gray helper text).

## Data — 3 currency options (exact)
| Currency | Flag | Code | Price | Accent bar gradient |
|---|---|---|---|---|
| Saudi Riyal | 🇸🇦 | SAR | 69.99 | `from-[#006C35] to-[#00A651]` (Saudi green — use as a reasonable match; exact riyal-state color wasn't captured, this green is a safe brand-consistent choice) |
| US Dollar | 🇺🇸 | USD | 19.99 | `from-[#3C3B6E] to-[#5A5898]` (confirmed captured) |
| British Pound | 🇬🇧 | GBP | 14.99 | `from-[#012169] to-[#1A3E9A]` (confirmed captured) |

Default selected currency on load: SAR (this is what the live site showed).

## Text Content (verbatim)
- Eyebrow: "أسعار بسيطة"
- H2: "دعوة واحدة، سعر واحد" (note: source renders this as two lines, "دعوة واحدة," then "سعر واحد" — keep as one heading with a line break or space)
- Subtitle: "اختر عملتك المفضلة. كل خطة تشمل تجربة الدعوة الكاملة مع جميع الميزات الفاخرة."
- Currency select label: "اختر العملة"
- CTA button: "View Pricing"
- Helper note: "🔄 فقط اختر GBP بجانب السعر وسيتحول تلقائياً إلى عملتك المحلية."

## Behavior implementation
`"use client"` component with `useState<CurrencyCode>` (default `"SAR"`). Clicking a pill updates state, which drives: the displayed flag/currency-name/price/code, the accent bar gradient classes (swap via a lookup object keyed by currency), and the active-pill styling. Use the `CurrencyOption`/`CurrencyCode` types from `src/types/numinds.ts`.

## Responsive Behavior
- Card and currency row remain centered and stack naturally; `max-w-3xl` container keeps it narrow at all sizes — no special breakpoint logic needed beyond default Tailwind text-size scaling (`text-4xl md:text-5xl` on the H2).
