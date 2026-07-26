# Hero Specification

## Overview
- **Target file:** `src/components/Hero.tsx`
- **Interaction model:** static

## DOM Structure
`<section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">` with decorative background layers, then a `relative z-10 max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center` two-column grid:
- **Col 1 (text, `text-center lg:text-left`):** H1, subtitle paragraph, CTA button stack.
- **Col 2 (phone mockup):** centered phone frame with 8 floating icon badges (4 left, 4 right).

## Computed Styles

### Section background decoration
- Faint grid/dot pattern layer: `absolute inset-0 opacity-[0.03]`.
- Two soft blurred gold glows: `absolute top-1/4 left-1/4 w-96 h-96 bg-[#C8A24A]/10 rounded-full blur-3xl` and `absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C8A24A]/5 rounded-full blur-3xl`.

### H1
```
font-family: Cinzel (font-cinzel);
font-size: 60px desktop (text-4xl md:text-5xl lg:text-6xl);
font-weight: 600 (font-semibold);
color: #111827 (text-gray-900);
line-height: tight; margin-bottom: 16px;
```
The last word "المثالية" is wrapped in `<span class="gold-text">` — implement `gold-text` as the gold gradient text utility already in globals.css (`.text-gradient-gold`: `linear-gradient(135deg,#C8A24A 0%,#E8D5A3 50%,#A68832 100%)` with `background-clip:text; color:transparent`). Full heading: "صمّم دعوتك الرقمية <span class='text-gradient-gold'>المثالية</span>".

### Subtitle
`text-lg text-gray-600 mb-8 max-w-lg` — "تصاميم فاخرة. مشاركة فورية. استجابات سلسة."

### CTA stack (`flex flex-col gap-3` container, but buttons arrange `sm:flex-row` — see screenshot: primary+secondary side by side, tertiary link below)
1. Primary button "✨ إنشاء دعوة" — dark gradient `linear-gradient(135deg,#1a1a1a,#2d2d2d)`, white text, `rounded-2xl px-7 py-3.5 text-sm font-semibold`, `hover:scale-[1.02] hover:shadow-2xl active:scale-[0.97] transition-all duration-200`.
2. Secondary button "تصفح القوالب" — glass style `bg-white/72 border border-[#C8A24A]/30 text-gray-800 rounded-2xl px-6 py-3.5 text-sm font-semibold`.
3. Tertiary link "عرض نموذج الدعوة" — plain text link with a small "eye" icon (`EyeIcon`), smaller/lighter styling, `px-4 py-3.5 text-sm`.

### Phone mockup
```
Outer glow: absolute inset-0 bg-[#C8A24A]/20 rounded-[3rem] blur-3xl scale-110
Frame: bg-gray-900 rounded-[2rem] p-[3px] shadow-2xl w-64 (phone bezel)
Notch: absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-900 rounded-full z-20
Screen: bg-white rounded-[1.85rem] overflow-hidden aspect-[9/18]
  > img.w-full.h-full.object-cover  — src: /images/hero/invitation-preview.jpg (downloaded asset, alt="Invitation preview")
```

### Floating icon badges (8 total, 4 stacked each side of the phone, vertically spaced)
Each badge: `absolute w-12 h-12 rounded-2xl backdrop-blur-sm border flex items-center justify-center shadow-lg`, tinted background+border color per icon, icon ~20px centered.
- **Left side** (positioned `-left-12`, stacked top-to-bottom with even vertical gaps down the phone height): WhatsApp icon (`bg-[#25D366]/10 border-[#25D366]/20` — use `WhatsAppIcon`), `calendar-days` (`bg-[#C8A24A]/10 border-[#C8A24A]/20` — `CalendarIcon`), `mail` (same gold tint — `MailIcon`), `phone` (same gold tint — `PhoneIcon`).
- **Right side** (positioned `-right-12`, same vertical stacking): `heart` (gold tint — `HeartIcon`), `music` (gold tint — `MusicIcon`), `camera` (gold tint — `CameraIcon`), `qr-code` (gold tint — `QrCodeIcon`).

## Text Content (verbatim)
- H1: "صمّم دعوتك الرقمية المثالية" (last word gold gradient)
- Subtitle: "تصاميم فاخرة. مشاركة فورية. استجابات سلسة."
- Buttons: "✨ إنشاء دعوة", "تصفح القوالب", "عرض نموذج الدعوة"

## Assets
- `/images/hero/invitation-preview.jpg` (already downloaded to `public/images/hero/invitation-preview.jpg`)
- Icons from `src/components/icons.tsx`: `WhatsAppIcon, CalendarIcon, MailIcon, PhoneIcon, HeartIcon, MusicIcon, CameraIcon, QrCodeIcon, EyeIcon`

## Responsive Behavior
- **Desktop (lg+):** 2-column grid, text left-aligned (`lg:text-left`), phone mockup on the right (col 2) — remember this is RTL so "col 1 / col 2" in DOM order renders text on the visual right and phone on the visual left, matching the source screenshot (phone on left, text on right).
- **Mobile:** single column, stacked, text centered (`text-center`), buttons full-width (`w-full sm:w-auto`).
- Breakpoints: `sm` (640px) for button width, `lg` (1024px) for the 2-column split.
