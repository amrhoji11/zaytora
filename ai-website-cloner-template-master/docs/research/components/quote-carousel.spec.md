# QuoteCarousel Specification

## Overview
- **Target file:** `src/components/QuoteCarousel.tsx`
- **Interaction model:** **time-driven auto-rotation** — confirmed live: captured the 3 visible quotes, waited ~4 seconds, re-captured, and the quote order/content had changed (a different quote from the pool cycled into view). This pulls from a larger pool of real reviews and rotates automatically.

## DOM Structure
Outer wrapper: `rounded-3xl p-6 md:p-8` with `border: 1.2px solid rgba(200,162,74,0.2)` (gold-tinted border), transparent/white background.
Inner: `grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 w-full` — 3 cards visible side-by-side on desktop (`hidden md:block` each), collapsing to a single rotating card on mobile (`block md:hidden`, one at a time).
Each card: 5 star icons (gold, filled) + quote paragraph text, `relative overflow-hidden rounded-[14px]`.

## Data — quote pool (use these exact real quotes, rotate through them)
Cycle through this pool, showing 3 at a time (desktop) / 1 at a time (mobile), advancing every ~4-5 seconds with a cross-fade transition (400-600ms):
1. "اكثر من رائعه خلال فتره بسيطه انتهيت من اعداد دعوة فاخره وبتصميم احترافي وحديث وحصري وعملية جداً"
2. "فكرة مميزة جدا اكتر من رائعة رهيبة وفخمة الكل انبهر فيها، شكرا لأنكم كنتو جزء من هادي الفرحة"
3. "ممتاز و راقيين فى التعامل"
4. "أريد العمل في هذا المجال .لا يوجد إشتراك شهري !"
5. "جدا روعة وتعاون المسؤولين"
6. "🤍👍🏻👍🏻👍🏻"
7. "Thank you to the team for helping me make my invitation wonderful 😍 highly recommend them!"
8. "منظم وممتع"
9. "دعوة رائعةة جداا جداا وتعامل ولا اروعع بتجننن الدعوةة كتيررر بتستاهل كل ريال وزيادةةة"

Each card shows 5 filled gold star icons above the quote text (all reviews are 5-star in this rotating set).

## Computed Styles
```
outer wrapper: rounded-3xl (24px), padding 24px (md:32px), border 1.2px solid rgba(200,162,74,0.2), background transparent/white
grid: grid-cols-1 md:grid-cols-3, gap 8px (md:12px)
card: rounded-[14px], overflow-hidden, padding ~16-20px, text-sm text-gray-700, quote wrapped in curly quotes as shown in the data above
stars: gold color (#C8A24A), ~14-16px each, row of 5
```

## Behavior implementation guidance
Use a `useState` index + `useEffect` with `setInterval` (~4500ms) that advances a rotating window of 3 items through the quote pool array (wrap around with modulo), with a CSS opacity transition (`transition-opacity duration-500`) on quote change. On mobile, show only the single current quote (`block md:hidden`); on desktop show 3 consecutive items from the rotating pool (`hidden md:grid md:grid-cols-3`).

## Responsive Behavior
- **Desktop:** 3 cards visible in a row.
- **Mobile:** 1 card visible, same rotation logic.
