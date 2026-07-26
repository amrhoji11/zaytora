# Numinds.me — Design Tokens

Site is RTL, Arabic (`lang="ar" dir="rtl"`), built on a shadcn-style Tailwind v4 base (same token names as our template: `--background`, `--foreground`, `--primary`, `--accent`, `--border`, `--muted`, `--radius`).

## Colors

| Token | Value | Usage |
|---|---|---|
| `--background` | `hsl(0 0% 100%)` / `#ffffff` | page bg |
| `--foreground` | `hsl(0 0% 3.9%)` / `#0a0a0a` | body text |
| `--primary` | `hsl(0 0% 9%)` | default shadcn primary (mostly unused; real CTAs use custom gradient) |
| `--accent` | `hsl(0 0% 96.1%)` | light gray accents |
| `--muted` | `hsl(0 0% 96.1%)` | muted bg |
| `--border` | `hsl(0 0% 89.8%)` | default borders |
| `--radius` | `.5rem` | shadcn base radius |
| `--gold` (custom) | `#C8A24A` | brand accent — used everywhere for accents, borders, gradients |

### Brand gold gradient (used on headline highlight word + price text, via `background-clip:text` + transparent color)
```css
background: linear-gradient(135deg, #C8A24A 0%, #E8D5A3 50%, #A68832 100%);
```
Applied to: the highlighted word in H1 ("المثالية"), the big price number ("14.99"), likely other emphasis text.

### Primary CTA button (dark pill button, e.g. "✨ إنشاء دعوة")
```css
background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
color: #ffffff;
border-radius: 16px; /* rounded-2xl */
padding: 14px 28px; /* py-3.5 px-7 */
font-size: 14px; font-weight: 600;
transition: all 200ms;
/* hover: scale(1.02) + shadow-2xl   active: scale(0.97) */
```

### Secondary/outline button (glass, e.g. "تصفح القوالب")
```css
background: rgba(255,255,255,0.72);
border: 1.2px solid rgba(200,162,74,0.3); /* gold-tinted */
color: #1f2937; /* gray-800 */
border-radius: 16px;
padding: 14px 24px;
```

### Header ("glass-effect" class)
```css
position: fixed; top:0; left:0; right:0; z-index:50;
background: rgba(255,255,255,0.85);
backdrop-filter: saturate(2) blur(40px);
border: 1.2px solid rgba(200,162,74,0.15); /* full border, all sides, on the header itself */
height: ~82px (desktop);
```
Header does **not** change on scroll (no shadow/bg change observed at scrollY 500+) — it's a static glass header throughout.

### WhatsApp floating button
```css
position: fixed; bottom: 112px /* bottom-28 */; right: 24px /* right-6 */; z-index:50;
background: #25D366; hover: #20BA5A;
width/height: 52px; border-radius: 9999px (pill);
```

## Typography

- **Headings** (h1/h2): `font-family: Cinzel, serif` (Tailwind custom utility `font-cinzel`), weight 600–700. H1 = 60px, H2 = 36–48px (`text-4xl md:text-5xl`). Cinzel has no Arabic glyphs, so Arabic heading text falls back to the browser's serif fallback — reproduce with `next/font/google` Cinzel + a serif fallback stack; for the Arabic clone, keep Cinzel loaded for any Latin brand text ("NUMINDS", "POPULAR", template codes like "W024") and let Arabic headings fall back to a normal serif/system font (matches the source's actual rendering).
- **Body**: no custom font — plain Tailwind default stack (`ui-sans-serif, system-ui, sans-serif, ...`). Do not add a custom body font.
- **Misc UI text** (numbers, some badges): `Inter, sans-serif`, 14px.
- Base body text: 16px/24px, weight 400, color `#0a0a0a`.

## Spacing / Radius

- Section vertical padding: `py-20`/`py-24`/`py-28` (80/96/112px), some `md:py-28`.
- Card radius: `rounded-2xl` (16px) dominant across buttons and cards.
- Container: `max-w-7xl mx-auto px-4` for wide sections (templates), `max-w-3xl mx-auto px-4` for narrower centered sections (pricing).

## Effects

- Decorative background blur blobs: `absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-5` (and similar 500px) positioned top-right / bottom-left inside `position:relative overflow-hidden` sections — very subtle, ~5% opacity colored circles used as ambient section backgrounds (pricing, features, etc.).
- Glass-morphism cards: `bg-white/72` or `/85` + `backdrop-blur` + thin gold-tinted border, reused across header, buttons, quote cards.

## Fonts to configure in `layout.tsx`
- `Cinzel` (Google Font) — weights 400/600/700 — expose as `font-cinzel` utility / CSS var `--font-cinzel`.
- Body: no next/font needed, rely on Tailwind's default sans stack.
