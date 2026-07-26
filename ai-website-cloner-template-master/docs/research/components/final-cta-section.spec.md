# FinalCtaSection Specification

## Overview
- **Target file:** `src/components/FinalCtaSection.tsx`
- **Interaction model:** static

## DOM Structure
`<section class="py-24 bg-gray-50/30">` — centered content, `max-w-2xl mx-auto px-4 text-center`:
- H2: "ابدأ الإنشاء اليوم" (`font-cinzel text-3xl md:text-4xl font-semibold text-gray-900 mb-4`)
- Subtitle: "انضم إلى آلاف الأزواج الذين يثقون بـ NumindsDesign لمناسباتهم الخاصة." (`text-gray-600 mb-8`)
- Primary CTA button: "أنشئ دعوتك" — same dark-gradient primary button style used in Hero (`bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white rounded-2xl px-7 py-3.5 text-sm font-semibold hover:scale-[1.02] hover:shadow-2xl active:scale-[0.97] transition-all duration-200`).

## Text Content (verbatim)
- H2: "ابدأ الإنشاء اليوم"
- Subtitle: "انضم إلى آلاف الأزواج الذين يثقون بـ NumindsDesign لمناسباتهم الخاصة."
- Button: "أنشئ دعوتك"

## Responsive Behavior
Fully centered single-column at all widths — no special breakpoint handling needed.
