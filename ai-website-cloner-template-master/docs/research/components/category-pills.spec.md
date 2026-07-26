# CategoryPills Specification

## Overview
- **Target file:** `src/components/CategoryPills.tsx`
- **Interaction model:** static links, hover scale on icon

## DOM Structure
`<div class="flex flex-wrap justify-center gap-4 mb-12">` containing 8 `<a>` items, each `flex flex-col items-center gap-2 group`: an icon-in-rounded-square (`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110`, uniform beige background `rgb(245,240,232)` / `#F5F0E8`, icon colored per category) + a text label below.

## Data (exact, in order)
| Label | Icon (from icons.tsx) | Icon color |
|---|---|---|
| زفاف | HeartIcon | `#C0627A` |
| خطوبة | GemIcon | `#7B68C8` |
| حنه | LeafIcon | `#4A9E6E` |
| حفلة العروس | SparklesIcon | `#C87AB0` |
| الكشف عن الجنس | StarIcon | `#5AACE0` |
| مواليد | BabyIcon | `#E08A4A` |
| تخرج | GraduationCapIcon | `#A08040` |
| عيد ميلاد | CakeIcon | `#E0604A` |

All icon squares share background `#F5F0E8` (beige/cream tint), only the icon glyph color differs per category as listed above. Icon size ~24px within the 56px (`w-14 h-14`) rounded square.

## Text Content (verbatim)
زفاف، خطوبة، حنه، حفلة العروس، الكشف عن الجنس، مواليد، تخرج، عيد ميلاد

Label styling: small text below icon, `text-sm text-gray-700`, centered.

## Responsive Behavior
`flex-wrap justify-center gap-4` — wraps naturally to 2-4 rows on narrow viewports, no special breakpoint logic needed.

## Behavior
Each pill is a plain link (`href="#"` placeholder, presumably filters templates by category on the real site — not needed for this static clone). On hover, icon square scales to 110% (`group-hover:scale-110`, `transition-all duration-200`).
