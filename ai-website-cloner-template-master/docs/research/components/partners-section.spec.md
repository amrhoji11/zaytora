# PartnersSection Specification

## Overview
- **Target file:** `src/components/PartnersSection.tsx`
- **Interaction model:** **time-driven, CSS-only infinite marquee** — confirmed via computed style: `animation: 45s linear infinite partnersScroll` on the track element (not JS-driven). Pauses are not required; keep it always running.

## DOM Structure
`<section class="py-20 bg-white overflow-hidden">`:
1. Heading (`max-w-7xl mx-auto px-4 mb-10 text-center`): eyebrow `<p class="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">شبكة الشركاء</p>`, H2 `<h2 class="font-cinzel text-3xl md:text-4xl font-semibold text-gray-900 mb-4">شركاؤنا</h2>`, subtitle `<p class="text-gray-500 max-w-xl mx-auto text-sm">محترفون موثوقون يستخدمون Numinds لإنشاء دعوات رائعة.</p>`.
2. Marquee container (`relative`):
   - Left and right fade-mask overlays: `absolute top-0 bottom-0 w-20 z-10 pointer-events-none`, `left-0` with `bg-gradient-to-r from-white to-transparent`, `right-0` with `bg-gradient-to-l from-white to-transparent` (fades the edges so logos appear to emerge/disappear).
   - `<div class="overflow-hidden">` > `<div class="flex gap-6 items-center">` (the animated track) — contains the partner logo images **duplicated twice back-to-back** (30 total img nodes = 15 unique logos × 2) so the loop is seamless.
3. Below the marquee: "Join us" CTA (secondary/glass button, same style as other secondary buttons on the site).

## CSS keyframes (add to `globals.css` or a local `<style jsx>`/module — whichever fits this codebase's convention, plain global keyframes in `globals.css` is simplest)
```css
@keyframes partnersScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```
Track element: `animation: partnersScroll 45s linear infinite;` — because content is duplicated 2x, translating by -50% creates a seamless loop. Track must be `display:flex` with `width: max-content` (or similar) so the duplicated content actually overflows and the translate makes sense.

## Data — partner logos (15 unique, already downloaded to `public/images/partners/`)
orchid-invites.jpg, lumiere-by-basma.jpeg, nawara.png, numindseg.jpeg, kp-planner.png, halacode.png, togather-n.jpeg, n-design.jpeg, dy-designer.jpeg, dhikra-events.png, ayman-abdalillah.png, dj-dahab.png, zeinap-abdullah.png, dr-design.jpg — render each as a small rounded logo tile (`w-24 h-24` or similar, `object-cover rounded-xl`, grayscale-ish/subtle border acceptable), duplicate the full array once and concatenate for the seamless loop.

## Text Content (verbatim)
- Eyebrow: "شبكة الشركاء"
- H2: "شركاؤنا"
- Subtitle: "محترفون موثوقون يستخدمون Numinds لإنشاء دعوات رائعة."
- CTA button: "انضم إلينا"

## Responsive Behavior
Marquee is naturally responsive (fixed-size logo tiles in a flex row) — no special breakpoint handling needed beyond adjusting the fade-mask width/logo size slightly smaller on mobile if convenient.
