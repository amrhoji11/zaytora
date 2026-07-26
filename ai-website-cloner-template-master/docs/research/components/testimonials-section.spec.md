# TestimonialsSection Specification

## Overview
- **Target file:** `src/components/TestimonialsSection.tsx`
- **Interaction model:** static content in a scrollable container (the live site renders all ~90 reviews in a `overflow-y-auto` box with `max-height: 560px` — no pagination/infinite-scroll JS, just a native scrolling div). Reproduce with a smaller, real subset (~18 reviews below) in the same scrollable-grid pattern.

## DOM Structure
`<section class="py-24 bg-white overflow-hidden">` > `div.max-w-7xl.mx-auto.px-4`:
1. Heading (`text-center mb-14`): eyebrow `<p class="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">آراء العملاء</p>`, H2 `<h2 class="font-cinzel text-3xl md:text-4xl font-semibold text-gray-900 mb-4">ماذا يقول عملاؤنا</h2>`.
2. Summary row (`flex flex-col md:flex-row items-center justify-center gap-8 mb-12`):
   - Rating badge: `flex flex-col items-center gap-2 bg-gray-50 rounded-3xl px-10 py-8 border border-gray-100` containing big number `<span class="font-cinzel text-5xl font-semibold text-gray-900">4.9</span>`, a row of 5 gold star icons, and `<span class="text-xs text-gray-400 mt-1">بناءً على 90 تقييم</span>`.
   - Rating histogram: `w-full max-w-xs space-y-2` — 5 rows (one per star rating 5→1), each row showing the star number, a horizontal progress-bar (filled proportionally to count/90, gold fill on gray track), and the count. Exact counts: 5★=84, 4★=3, 3★=3, 2★=1, 1★=1 (out of 90 total).
3. Scrollable reviews container: `overflow-y-auto pr-1` with inline `max-height: 560px`, containing `div.grid.md:grid-cols-2.lg:grid-cols-3.gap-5.pb-2` of review cards.
4. Each review card: `relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#C8A24A]/40 transition-colors` containing: a row of 5 gold star icons (`flex gap-0.5 mb-3`), the review body text (`text-sm text-gray-700 mb-4`), and a footer row with a circular initial-avatar (first letter(s) of name in a colored circle), name + period (e.g. "د.", "A."), country flag emoji, and date (`text-xs text-gray-400`).

## Data — 18 real reviews (verbatim from the live site; use these exact texts/names/flags/dates)
1. ★5 — "المعازيم انبهروا بالدعوة و الكل سألني عنها و الكل مبسوط عليها! شكرًا من القلب انكم كنتوا جزء من فرحتي و خليتوها مميزة! 🥹🥹 عنجد مبدعين و فكرة رائعه جدًا 🥰🥰🥰" — د. — 🇯🇴 Jordan — 26 Jul 2026
2. ★5 — "فكرة مميزة جدا اكتر من رائعة رهيبة وفخمة الكل انبهر فيها، شكرا لأنكم كنتو جزء من هادي الفرحة" — ي. — 🇯🇴 Jordan — 24 Jul 2026
3. ★5 — "تجربة رائعة انصح وبشدة" — مج. — 🇵🇸 Palestine — 23 Jul 2026
4. ★5 — "ممتاز و راقيين فى التعامل" — AD. — 🇪🇬 Egypt — 23 Jul 2026
5. ★5 — "تجننن مرا حلوه وحبيت تفاعل الناس معايا" — س. — 🇸🇦 Saudi Arabia — 20 Jul 2026
6. ★5 — "ممتازة جدا 😍😍" — س. — 🇶🇦 Qatar — 20 Jul 2026
7. ★5 — "دعوة رائعةة جداا جداا وتعامل ولا اروعع بتجننن الدعوةة كتيررر بتستاهل كل ريال وزيادةةة" — ان. — 🇰🇼 Kuwait — 20 Jul 2026
8. ★5 — "كل شي كان بيرفكت والكل عجبته بس المشكله اللي واجهتها الخط ماقدر اغير فيه والحجم🥺 عالعموم كانت دعوة خياااال" — س. — 🇸🇦 Saudi Arabia — 19 Jul 2026
9. ★5 — "منظم وممتع" — A. — 🇶🇦 Qatar — 18 Jul 2026
10. ★4 — "اتمنى توفروا قوالب اكثر وامكانيه التعديل على احجام الخط" — ل. — 🇸🇦 Saudi Arabia — 17 Jul 2026
11. ★5 — "دعوة جميلة جدًا و راقيه و سهلة الاستخدام بنصح الكل بدعوات numinds 😍😍😍" — د. — 🇯🇴 Jordan — 14 Jul 2026
12. ★5 — "Thank you to the team for helping me make my invitation wonderful 😍 highly recommend them!" — M. — 🇳🇱 Netherlands — 13 Jul 2026
13. ★5 — "سوو حق تخرج اولاد" — ح. — 🇦🇪 United Arab Emirates — 13 Jul 2026
14. ★3 — "جيد بس التخرج لازم يسون حق اولاد" — ح. — 13 Jul 2026
15. ★5 — "أريد العمل في هذا المجال .لا يوجد إشتراك شهري !" — D. — 🇹🇳 Tunisia — 9 Jul 2026
16. ★5 — "اكثر من رائعه" — S. — 🇳🇱 Netherlands — 9 Jul 2026
17. ★5 — "جدا روعة وتعاون المسؤولين" — A. — 🇸🇦 Saudi Arabia — 7 Jul 2026
18. ★5 — "Made as requested, loved it 💕" — A. — 🇦🇪 United Arab Emirates — 6 Jul 2026

Avatar initials: use the name field directly as the avatar letter(s) (e.g. "د." → "د"), background color can cycle through a small fixed palette (e.g. gold, muted blue, muted green, muted pink) keyed by index for visual variety.

## Computed Styles
```
rating badge: bg-gray-50 rounded-3xl px-10 py-8 border border-gray-100
big number: font-cinzel text-5xl font-semibold text-gray-900 (uses Cinzel — this is a numeral so Cinzel renders it fine, no Arabic fallback issue)
histogram bar track: h-1.5 rounded-full bg-gray-100; fill: bg-[#C8A24A] rounded-full, width = (count/90)*100%
review card: bg-white rounded-2xl p-6 border border-gray-100, hover:border-[#C8A24A]/40 transition-colors
stars: gold #C8A24A filled, ~14px
scroll container: max-height 560px, overflow-y-auto
```

## Assets / Icons
`StarIcon` from `src/components/icons.tsx` for all star ratings (both the summary badge and each card).

## Responsive Behavior
- **Desktop (lg+):** 3-column card grid (`lg:grid-cols-3`).
- **Tablet (md):** 2-column (`md:grid-cols-2`).
- **Mobile:** 1-column (implicit `grid-cols-1`).
- Summary row stacks (`flex-col`) on mobile, side-by-side (`md:flex-row`) on desktop.
