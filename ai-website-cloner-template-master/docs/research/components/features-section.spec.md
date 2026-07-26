# FeaturesSection Specification

## Overview
- **Target file:** `src/components/FeaturesSection.tsx`
- **Interaction model:** static (clicking other feature items did not change any visible state in testing — one item ships pre-expanded with a description; treat as a fixed layout, not a tab system)

## DOM Structure
`<section class="py-20 md:py-28 bg-white overflow-hidden">` > `div.max-w-6xl.mx-auto.px-4`:
1. Heading block (`text-center mb-12 md:mb-16`): eyebrow `<p class="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">المميزات</p>`, H2 `<h2 class="font-cinzel text-3xl md:text-4xl font-semibold text-gray-900 mb-4">كل ما تحتاجه</h2>`, subtitle `<p class="text-gray-500 max-w-xl mx-auto text-sm md:text-base">أنشئ دعوات رقمية احترافية بميزات قوية مصممة للاحتفالات العصرية.</p>`.
2. Desktop layout (`hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center`): left column (`flex flex-col gap-3`, 3 items), center column (a decorative phone/device mockup graphic — simple static illustrative element, no image asset was found here so build it as a simplified phone-frame shape using the same bezel styling as Hero/TemplatesGrid, empty/placeholder screen or a subtle icon), right column (`flex flex-col gap-3`, 3 items).
3. Mobile layout (`md:hidden flex flex-col ...`): same 6 items stacked in a single column list (reuse the same item component).

## Data — 6 feature items (exact order: left col top→bottom, then right col top→bottom)
| Column | Icon | Title | Description | Badge |
|---|---|---|---|---|
| left | CameraIcon | الكاميرا | — | "NEW" badge (small gold pill) |
| left | MusicIcon | موسيقى | — | — |
| left | HeartIcon | تأكيد الحضور | يؤكد الضيوف حضورهم مباشرة من الدعوة بلمسة واحدة. | — (this item ships expanded/highlighted by default) |
| right | PhoneIcon | تواصل | — | — |
| right | MapPinIcon | الموقع | — | — |
| right | CalendarIcon | احفظ الموعد | — | — |

Only "تأكيد الحضور" has visible body copy in the live DOM (the others show icon + title only) — reproduce exactly this way: render each item as an icon + title row, and give "تأكيد الحضور" an extra description line plus a subtly emphasized/expanded card style (e.g. slightly larger padding, a thin gold border, or a soft shadow) to match it being the visually "featured" row.

## Computed Styles
- Item row: icon in a small rounded-xl tinted square (reuse the `CategoryPills` beige `#F5F0E8` background convention) + `text-sm font-medium text-gray-800` title, `flex items-center gap-3`.
- Featured item ("تأكيد الحضور"): add `bg-white rounded-2xl border border-[#C8A24A]/20 shadow-sm p-4` wrapper and a `text-xs text-gray-500 mt-1` description line.
- "NEW" badge: small pill, `bg-[#C8A24A] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase`, positioned top-right of the الكاميرا icon.

## Text Content (verbatim)
- Eyebrow: "المميزات"
- H2: "كل ما تحتاجه"
- Subtitle: "أنشئ دعوات رقمية احترافية بميزات قوية مصممة للاحتفالات العصرية."
- Items: الكاميرا (+NEW), موسيقى, تأكيد الحضور ("يؤكد الضيوف حضورهم مباشرة من الدعوة بلمسة واحدة."), تواصل, الموقع, احفظ الموعد

## Assets / Icons
`CameraIcon, MusicIcon, HeartIcon, PhoneIcon, MapPinIcon, CalendarIcon` from `src/components/icons.tsx`.

## Responsive Behavior
- **Desktop (md+):** 3-column layout, `[1fr_auto_1fr]` grid with a center decorative mockup between two 3-item columns.
- **Mobile:** single stacked column of all 6 items, center mockup omitted or shown above the list (simplify: omit the center mockup on mobile, matching `md:hidden` alternate block having its own simpler structure).
