# TemplatesGrid Specification

## Overview
- **Target file:** `src/components/TemplatesGrid.tsx`
- **Interaction model:** static grid with hover-emphasis on card actions

## DOM Structure
Heading block (`text-center mb-14`): eyebrow `<p class="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">القوالب</p>`, `<h2 class="font-cinzel text-4xl md:text-5xl font-bold text-gray-900 mb-4">المفضلة لدى عملائنا</h2>`, subtitle `<p class="text-gray-600">استكشف بعضاً من تصاميم دعواتنا الرقمية الأكثر شعبية.</p>`.

Grid: `grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center`, 4 cards. Each card (`flex flex-col items-center w-40 md:w-44`):
1. Phone-mockup frame (same style as Hero phone: `bg-gray-900 rounded-[2rem] p-[3px] shadow-2xl`, white inner screen, `aspect-[9/18]`, template preview image `object-cover`).
2. Optional badge, top-right overlay on the frame: `absolute -top-2 -right-2 z-30 ... rounded-full text-white` gold/dark pill reading "POPULAR" with a star — only on the first card (W024).
3. Below the frame (`mt-3 text-center`): template code (bold, e.g. "W024") + category label below it (small, gray, e.g. "wedding").
4. Below that (`mt-3 flex flex-col sm:flex-row gap-1.5 w-full`): two action buttons — "Select" (white bg, gray-200 border, with `ArrowRightIcon`) and "Preview" (with `EyeIcon`), small pill buttons, `px-3 py-1.5 text-xs`.

Closing: `text-center mt-12` → outline "عرض جميع القوالب" button (same secondary/glass button style used elsewhere: `bg-white/72 border border-[#C8A24A]/30 rounded-2xl`).

## Data — exact 4 templates
| Code | Category | Popular | Image |
|---|---|---|---|
| W024 | wedding | ✅ (badge "POPULAR") | `/images/templates/w024.png` |
| W031 | wedding | — | `/images/templates/w031.jpeg` |
| W029 | wedding | — | `/images/templates/w029.png` |
| W019 | wedding | — | `/images/templates/w019.png` |

All images already downloaded to `public/images/templates/`.

## Text Content (verbatim)
- Eyebrow: "القوالب"
- H2: "المفضلة لدى عملائنا"
- Subtitle: "استكشف بعضاً من تصاميم دعواتنا الرقمية الأكثر شعبية."
- Card actions: "Select", "Preview" (kept in English on the source site — reproduce as-is)
- Footer button: "عرض جميع القوالب"

## Computed Styles
```
phone frame: bg-gray-900 rounded-[2rem] p-[3px] shadow-2xl, inner bg-white rounded-[1.85rem] aspect-[9/18]
code text: font-semibold text-sm text-gray-900
category text: text-xs text-gray-500 capitalize
action buttons: rounded-full or rounded-lg px-3 py-1.5 text-xs, "Select" = bg-white border border-gray-200 text-gray-700; "Preview" = similar or ghost variant
badge "POPULAR": small pill, gold/dark background, white text, star icon, positioned absolute -top-2 -right-2 z-30
```

## Assets / Icons
`ArrowRightIcon`, `EyeIcon` from `src/components/icons.tsx`. Template images per table above.

## Responsive Behavior
- **Desktop:** `md:grid-cols-4` — all 4 in one row.
- **Mobile:** `grid-cols-2` — 2x2 grid.
- Action buttons: stacked (`flex-col`) on very small screens, side-by-side (`sm:flex-row`) from `sm` breakpoint up.
