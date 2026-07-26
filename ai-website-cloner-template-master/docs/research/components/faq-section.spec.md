# FaqSection Specification

## Overview
- **Target file:** `src/components/FaqSection.tsx`
- **Interaction model:** click-driven accordion (confirmed live — clicking a question reveals its answer text). Needs `"use client"`.

## DOM Structure
`<section class="py-24">` > centered heading: eyebrow-less, `<p class="...">الأسئلة الشائعة</p>` style eyebrow, H2 "الأسئلة الأكثر شيوعاً", then a list of 6 accordion items, each a `<button>` (the question, full-width, `flex items-center justify-between`) that toggles a collapsible answer panel below it with a chevron icon (`ChevronDownIcon` from `src/components/icons.tsx`) that rotates 180° when expanded (`transition-transform duration-200`, `rotate-180` when open).

Use shadcn's `Accordion` primitive if available in this project (`@/components/ui/accordion`); otherwise implement a simple `useState<number | null>` "open index" pattern with a single item open at a time (standard single-expand accordion), since that's the common pattern for FAQ sections like this.

## Data — 6 questions with answers (2 answers captured verbatim from the live site; the remaining 4 are plausible mock copy consistent with the product, per TARGET.md's "mock data for demo purposes" scope)
1. **كم يستغرق إعداد الدعوة الرقمية؟** — "معظم الدعوات جاهزة للمشاركة خلال 10–15 دقيقة. فقط اختر القالب، وأدخل تفاصيل حدثك، وأكمل الدفع للنشر فوراً." (verbatim, captured)
2. **هل يمكنني تعديل الدعوة بعد نشرها؟** — "نعم، يمكنك تعديل تفاصيل الدعوة في أي وقت من لوحة التحكم الخاصة بك حتى بعد نشرها ومشاركتها مع الضيوف." (mock)
3. **كيف يتتبع نظام الرد ردود الضيوف؟** — "يقوم كل ضيف بتأكيد حضوره مباشرة من صفحة الدعوة بلمسة واحدة، وتظهر جميع الردود مباشرة في لوحة التحكم الخاصة بك." (mock)
4. **هل يمكن للضيوف رفع الصور عبر ميزة كاميرا الحدث؟** — "نعم، ميزة كاميرا الحدث تتيح لضيوفك رفع صورهم ولحظاتهم المفضلة مباشرة أثناء المناسبة لمشاركتها معك." (mock)
5. **هل يوجد حد لعدد الضيوف أو المشاهدات؟** — "لا، يمكن لعدد غير محدود من الضيوف مشاهدة دعوتك وتأكيد حضورهم دون أي قيود إضافية." (mock)
6. **هل أحتاج إلى مهارات تقنية لإنشاء دعوتي؟** — "لا على الإطلاق. الاستوديو مصمم ليكون بسيطاً وسهل الاستخدام. فقط أدخل تفاصيلك وارفع صورك ودعوتك جاهزة." (verbatim, captured)

## Computed Styles
- Question button: `w-full flex items-center justify-between py-5 text-right text-base font-medium text-gray-900 border-b border-gray-100`.
- Answer panel: `text-sm text-gray-600 pb-5 leading-relaxed` (animate max-height or use a simple conditional render with a fade/slide transition).
- Chevron: 20px, `text-gray-400`, rotates on open.

## Text Content (verbatim)
- Eyebrow/label: "الأسئلة الشائعة"
- H2: "الأسئلة الأكثر شيوعاً"
- Question list: see data table above.

## Responsive Behavior
Single-column list at all widths, contained in a `max-w-3xl mx-auto px-4` wrapper — no special breakpoint logic needed.
