# Header Specification

## Overview
- **Target file:** `src/components/Header.tsx`
- **Screenshot:** `docs/design-references/numinds.me/hero-top.png` (header visible at top of hero screenshot)
- **Interaction model:** static (no scroll-triggered change)

## DOM Structure
`<header>` fixed, full width, containing a `max-w-7xl mx-auto` row with (in RTL visual order, right→left): logo, center nav links, right-side controls (account chip, language switch). Also render a mobile-only bottom tab bar (separate fixed nav, `md:hidden`) with 4 items: الرئيسية (House), القوالب (BookDashed), الاستوديو (WandSparkles), لوحة التحكم (LayoutDashboard).

## Computed Styles

### Header container
- position: fixed; top/left/right: 0; z-index: 50
- background: rgba(255,255,255,0.85)
- backdrop-filter: saturate(2) blur(40px)
- border: 1.2px solid rgba(200,162,74,0.15) (all sides)
- height: ~82px desktop (use `h-20` / `py-5` to approximate)
- Use the `.glass-effect` utility already added to globals.css for background+blur+border.

### Logo "NUMINDS"
- font-family: Cinzel (`font-cinzel` class), letter-spacing wide (`tracking-widest`), font-weight 500-600, gold/dark color, uppercase.

### Nav links (desktop, `hidden md:flex items-center gap-8`)
Links in order: الرئيسية (Home — active/current, styled distinct), القوالب (Templates), الاستوديو (Studio), الدليل (Guide), الأسعار (Pricing), شركاؤنا (Partners), تواصل معنا (Contact — styled as a pill/button, distinct from plain links).
- Plain link style: text-sm, `text-gray-700`, hover:`text-[#C8A24A]` (gold) transition.
- Active link (الرئيسية): gold color or underline indicator.

### Right-side controls
- Account chip: circular avatar/user icon + name "Amr" + small notification badge (red/gold dot with count).
- Language switch: globe icon + "EN" text, pill button.

### Mobile bottom nav (`fixed bottom-0 left-0 right-0 z-30 md:hidden`)
- 4 equal-width tab items, icon-over-label, active tab highlighted (gold).

## Assets / Icons
Use from `src/components/icons.tsx`: `HomeIcon`, `TemplatesIcon`, `StudioIcon`, `DashboardIcon`, `GlobeIcon`, `UserIcon`.

## Text Content (verbatim)
Nav: الرئيسية، القوالب، الاستوديو، الدليل، الأسعار، شركاؤنا، تواصل معنا
Logo: NUMINDS
Language: EN
Mobile nav: الرئيسية، القوالب، الاستوديو، لوحة التحكم

## Responsive Behavior
- **Desktop (≥768px):** full horizontal nav row visible, mobile bottom bar hidden.
- **Mobile (<768px):** center nav links hidden, replaced by fixed bottom tab bar; header keeps logo + account + language only.
- Breakpoint: `md` (768px).

## Notes
- RTL layout — logo sits visually on the right, controls on the left, exactly like a mirrored LTR header. Use `dir="rtl"` inherited from `<html>`; don't hardcode `flex-row-reverse` unless needed since RTL + `justify-between` handles it naturally.
- Do not implement scroll-shrink/shadow behavior — confirmed static via audit.
