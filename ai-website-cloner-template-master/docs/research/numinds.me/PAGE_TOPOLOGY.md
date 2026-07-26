# Numinds.me — Page Topology

Single page (`/`), RTL Arabic. `lang="ar" dir="rtl"`. Total scrollHeight ≈ 7647px at desktop (2304px-equivalent CSS viewport during audit; treat as a standard ~1440px desktop layout — the extra width came from the audit environment's display scaling, not the site's real breakpoint).

Structure: `<header>` (fixed, global) + `<main><div class="min-h-screen bg-white">` containing 10 flow children `+ <footer>` (sibling of the wrapper div, in body).

## Global chrome

0. **Header** — `fixed top-0 z-50`, glass-morphism (`rgba(255,255,255,0.85)` + `backdrop-filter: blur(40px) saturate(2)`, thin gold border). Contains (RTL, so visually right-to-left): logo "NUMINDS" (Cinzel) on the far right, center nav links (`الرئيسية القوالب الاستوديو الدليل الأسعار شركاؤنا تواصل معنا`), left side: user avatar/account chip ("Amr" + notification badge), language switcher ("EN"). Does NOT change on scroll (static, no shadow/bg shift observed).
1. **Floating WhatsApp button** — `fixed bottom-28 right-6 z-50`, green pill, expands with text on hover (`hover:gap-2`).
2. **Footer** — sibling after main, `py-16 border-t border-gray-100`. 4-column layout: brand blurb, "الصفحات" (page links), "المميزات" (feature links), "تواصل معنا" (contact + payment badges: VISA, Pay, G Pay, Samsung Pay). Bottom bar: copyright + legal links (الشروط والأحكام / سياسة الخصوصية / سياسة الاسترداد / Delete Account).

## Section order (top → bottom)

| # | Section (working name) | Classes | Approx top/height | Interaction model |
|---|---|---|---|---|
| 1 | **Hero** | `relative min-h-[90vh] flex items-center justify-center overflow-hidden` | top 80, h 920 | static (phone mockup + floating icon badges around it, headline with gold gradient word, 2 CTA buttons, "view sample invitation" link) |
| 2 | **Categories + Quote strip + Templates grid** | `py-24 overflow-hidden` | top 1000, h 1318 | **time-driven**: 3 testimonial quote-cards auto-rotate/reshuffle every few seconds (confirmed — text order changed unprompted after ~4s wait). Category pills are static links. Templates grid (4 phone-mockup cards) static with hover states + Select/Preview actions. |
| 3 | **Features** ("كل ما تحتاجه") | `py-20 md:py-28 bg-white overflow-hidden` | top 2318, h 1017 | mostly static grid of feature cards (camera[NEW], music, RSVP-confirm, contact, location, save-the-date), likely with scroll-reveal fade-in per card |
| 4 | **Pricing** ("أسعار بسيطة") | `py-28 bg-white relative overflow-hidden` | top 3252, h 1017 | **click-driven**: currency selector (SAR/USD/GBP flags) swaps the displayed price (gold-gradient-text "14.99") and currency label live |
| 5 | **Partners** ("شبكة الشركاء") | `py-20 bg-white overflow-hidden` | top 4269, h 476 | static logo/partner grid + "Join us" CTA |
| 6 | **Testimonials/Reviews** ("آراء العملاء") | `py-24 bg-white overflow-hidden` | top 4745, h 1122 | rating summary (4.9, 90 reviews, star histogram) + a long list (~90) of individual review cards (name-initial avatar, country flag, date, title, body). Given the count, real implementation should be a scrollable/paginated list, not all rendered inline — clone with a reasonable subset (first ~12) + "show more" or horizontal scroll, using the exact review text captured. |
| 7 | **FAQ** ("الأسئلة الشائعة") | `py-24` | top 5867, h 712 | click-driven accordion (6 questions, single-expand likely) |
| 8 | **Final CTA** ("ابدأ الإنشاء اليوم") | `py-24 bg-gray-50/30` | top 6579, h 536 | static, single CTA button |

## Section 2 detail (most complex — split into 3 sub-components)
Wrapper: `max-w-7xl mx-auto px-4`, 5 children:
1. `flex flex-wrap justify-center gap-4 mb-12` — **CategoryPills**: 8 items (زفاف, خطوبة, حنه, حفلة العروس, الكشف عن الجنس, مواليد, تخرج, عيد ميلاد), each an icon-in-rounded-square + label, `<a>` link.
2. `mb-12 max-w-3xl mx-auto` — **QuoteCarousel**: 3 visible 5-star review cards in a row, auto-rotating content pool (time-driven, ~4s+).
3. `text-center mb-14` — heading block: eyebrow "القوالب", H2 "المفضلة لدى عملائنا", subtitle.
4. `grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center` — **TemplatesGrid**: 4 phone-mockup cards (W024, W031, W029, W019 — all "Wedding" category, one marked `POPULAR`), each with Select/Preview actions on hover.
5. `text-center mt-12` — "عرض جميع القوالب" (view all) outline button.

## Notes for builders
- Everything is RTL — use `dir="rtl"` at the root and let Tailwind's logical properties (or explicit `text-right`/flex-row-reverse where needed) handle mirroring; icons that imply direction (arrows) must flip.
- The floating decorative icon badges around the hero phone mockup (heart, music note, camera, QR, envelope, phone, calendar) reuse the same icon set as the Features section — extract once into `icons.tsx`.
