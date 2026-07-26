# Footer Specification

## Overview
- **Target file:** `src/components/Footer.tsx`
- **Interaction model:** static, plain hover-underline on links

## DOM Structure
`<footer class="py-16 border-t border-gray-100">` > `div.max-w-7xl.mx-auto.px-4` containing:
1. `div.grid.md:grid-cols-4.gap-10.mb-12` — 4 columns:
   - Col 1 (`md:col-span-1`): brand block — "Numinds" logo/name + tagline paragraph "دعوات رقمية فاخرة لأجمل لحظاتك."
   - Col 2: heading "الصفحات" + links: القوالب، الاستوديو، الدليل، تواصل معنا
   - Col 3: heading "المميزات" + links: دعم ثنائي اللغة، إدارة الردود، كاميرا الحدث، مشاركة رمز QR
   - Col 4: heading "تواصل معنا" (contact block — likely email/phone/social icons; use MailIcon/PhoneIcon from icons.tsx)
2. `div.border-t.border-gray-100.pt-8.pb-6.flex.flex-col.items-center.gap-4` — "Secure Payments" label (gray, small, with lock/shield icon) + row of payment badges: VISA, Pay (Apple Pay), G Pay, Samsung Pay (render as simple rounded-badge text chips or small logo SVGs — exact vector art not extracted, use clean text-in-pill badges with brand-appropriate colors as a faithful approximation).
3. `div.border-t.border-gray-100.pt-8.flex.flex-col.md:flex-row.items-center.justify-between` — left: copyright `© 2026 NumindsDesign. جميع الحقوق محفوظة.` (text-sm text-gray-400); right: legal links row — الشروط والأحكام / سياسة الخصوصية / سياسة الاسترداد / Delete Account.

## Computed Styles
- Footer: `py-16 border-t border-gray-100` (padding-top/bottom 64px, top border 1px #f3f4f6-ish gray-100).
- Column headings: text-sm font-semibold text-gray-900 mb-4 (uppercase-ish tracking, matches other section eyebrows in weight).
- Links: text-sm text-gray-500, hover:text-[#C8A24A], transition-colors.
- Copyright text: text-sm text-gray-400.
- Container: max-w-7xl mx-auto px-4 (matches rest of site).

## Text Content (verbatim)
- Brand tagline: "دعوات رقمية فاخرة لأجمل لحظاتك."
- Column headers: الصفحات / المميزات / تواصل معنا
- الصفحات links: القوالب, الاستوديو, الدليل, تواصل معنا
- المميزات links: دعم ثنائي اللغة, إدارة الردود, كاميرا الحدث, مشاركة رمز QR
- Payment row label: "Secure Payments"
- Payment badges: VISA, Pay, G Pay, Samsung Pay
- Copyright: "© 2026 NumindsDesign. جميع الحقوق محفوظة."
- Legal links: الشروط والأحكام, سياسة الخصوصية, سياسة الاسترداد, Delete Account

## Assets / Icons
`MailIcon`, `PhoneIcon` from `src/components/icons.tsx` for the contact column.

## Responsive Behavior
- **Desktop:** 4-column grid (`md:grid-cols-4`).
- **Mobile:** columns stack to single column (`grid-cols-1` implicit, gap-10 vertical).
- Bottom bar: `flex-col` on mobile, `md:flex-row` with `justify-between` on desktop.
