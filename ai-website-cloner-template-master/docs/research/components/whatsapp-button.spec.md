# WhatsAppButton Specification

## Overview
- **Target file:** `src/components/WhatsAppButton.tsx`
- **Interaction model:** hover expand

## Computed Styles
```
position: fixed;
bottom: 112px; /* bottom-28 */
right: 24px; /* right-6 */
z-index: 50;
width: 52px; height: 52px;
border-radius: 9999px;
background: #25D366;
color: white;
display: flex; align-items: center; justify-content: center; gap: 0;
transition: all 200ms;
```
- Hover: background darkens to `#20BA5A`, `gap` increases to reveal a text label sliding in next to the icon (class pattern: `hover:gap-2`), subtle scale/shadow increase acceptable.
- Icon: WhatsApp glyph, white, centered, ~24px.

## Text Content
No visible label at rest (icon-only pill); on hover a short label may appear (e.g. "تواصل معنا" / "WhatsApp") sliding in — implement with `max-w-0 group-hover:max-w-xs overflow-hidden` text reveal pattern, consistent with the site's `hover:gap-2` class on this element.

## Assets
Use `WhatsAppIcon` from `src/components/icons.tsx`.

## Behavior
- Should link to a WhatsApp `wa.me` URL (use placeholder `https://wa.me/966500000000` since real number wasn't captured).
- Render at the app layout level so it floats above all page content on every route.
