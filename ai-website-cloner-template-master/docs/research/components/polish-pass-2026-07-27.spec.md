# UI & Animation Polish Pass — numinds.me Findings

Source: live inspection of https://numinds.me/ via Chrome MCP (getComputedStyle,
inline style attributes, DOM structure walks, click-state extraction).

## 1. Hero spacing + badges (`src/components/Hero.tsx`)

- Text/phone grid: `grid lg:grid-cols-2 gap-12` (unchanged, already matches).
- **Missing on our side:** phone mockup is wrapped in `relative mx-14`
  (56px margin each side) on the live site — this is what creates the
  breathing room between the phone/badges and the heading text. Our
  version has no such wrapper, so the badges sit almost flush against
  the text column.
- Floating badges: verified via `MutationObserver` + polling over 5s+
  hover — **no continuous animation is running**. Each badge holds a
  static inline `transform: translateY(...)` offset (a fixed stagger,
  not a loop):
  - Left column (top-to-bottom): `top:10% translateY(-5px)`,
    `top:32% translateY(5px)`, `top:54% translateY(-5px)`,
    `top:76% translateY(5px)`
  - Right column: `top:10% translateY(4px)`, `top:32% translateY(-4px)`,
    `top:54% translateY(4px)`, `top:76% translateY(-4px)`
  - bg/border/shadow classes (`bg-[#25D366]/10 border-[#25D366]/20
    backdrop-blur-sm shadow-lg rounded-2xl`, gold variant for the rest)
    already match our code 1:1.
- Decision: matched the static stagger positions exactly (real value,
  not guessed), and layered in a subtle CSS bob animation on top since
  the user explicitly asked for "floating/vibrating" motion that isn't
  literally present on the reference right now.

## 2. Features Showcase (`src/components/FeaturesSection.tsx`)

**Interaction model: click-to-swap `<video>` source**, not a live map
embed and not scroll-driven. The phone mockup is a single `<video>`
element; clicking a feature button swaps `video.src` to a dedicated
screen-recording clip for that feature and shows its first frame
(autoplay muted loop). Confirmed by reading `video.currentTime`/`src`
before and after each click — every feature has its own MP4.

Clicking "Open in Google Maps" inside the Location clip triggers an
OS-level map preview (outside the page DOM) — that is not something to
replicate; the in-page content is just the recording.

| Feature (label) | Accent color | Description | Video (downloaded to `public/videos/features/`) |
|---|---|---|---|
| الكاميرا (badge NEW) | violet `rgb(139,92,246)` | يمكن للضيوف التقاط الصور مباشرة من الدعوة عبر الكاميرا المدمجة. | camera.mp4 |
| موسيقى | gold `#C8A24A` | اضبط الأجواء المثالية بملف صوتي أو مقطوعة موسيقية مخصصة. | music.mp4 |
| تأكيد الحضور | pink `rgb(225,48,108)` | يؤكد الضيوف حضورهم مباشرة من الدعوة بلمسة واحدة. | rsvp.mp4 |
| تواصل | WhatsApp green `#25D366` | تواصل مع المضيف فوراً عبر الهاتف أو واتساب بلمسة واحدة. | contact.mp4 |
| الموقع | orange `rgb(249,115,22)` | خريطة Google Maps تفاعلية حتى لا يضيع الضيوف. | location.mp4 |
| احفظ الموعد | blue `rgb(59,130,246)` | حمّل الحدث على التقويم واضبط تذكيراً مباشرة من الدعوة. | save-date.mp4 |

Active row style (inline, per accent color `C`):
- row: `background: rgba(C, 0.063); border: 1px solid rgba(C, 0.19)`
- icon box: `background: rgba(C, 0.1); box-shadow: 0 4px 16px rgba(C, 0.19)`
- icon color: `rgb(C)`

Inactive row style (all features, uniform neutral):
- row: transparent bg, `border: 1px solid rgba(0,0,0,0.08)`
- icon box: `background: rgba(0,0,0,0.04)`, icon color `rgb(153,153,153)`

Phone frame: `bg-gray-900 rounded-[2.2rem] p-[3px] shadow-2xl w-56 md:w-64`,
screen `bg-white rounded-[2rem] overflow-hidden aspect-[9/19]`, video
`w-full h-full object-cover`.

Video files are large (75MB total for all 6 clips — `location.mp4` and
`camera.mp4` are ~25MB each). Flagged to user; kept as-is per "real
assets" principle but this is worth revisiting (compression/CDN) later.

## 3. Account dropdown (`src/components/Header.tsx`)

Live site uses a Radix popover. Items (in order), each `<a>`/`<div>`
with `flex items-center gap-2 px-2.5 py-2 rounded-xl text-sm font-medium`:

1. `🗂️ لوحة التحكم` — `text-gray-700 hover:bg-[#C8A24A]/8 hover:text-[#C8A24A]`
2. `🤝 Business Mode` — same styling as #1
3. divider — `bg-gray-200/60`, full width, 1px
4. `🚪 تسجيل الخروج` — `text-red-500 hover:bg-red-50`
5. `🗑️ Delete Account` — `text-red-600 hover:bg-red-50`

(Auth/business-mode/delete-account are out of scope per TARGET.md —
these remain non-functional menu items, matching the "regular"
UI-only fidelity of the rest of the header.)

## 4. Template card Preview/Select buttons (`src/components/TemplatesGrid.tsx`)

Live site order is **Preview first, then Select** (ours currently has
Select first, Preview second — swapped). Exact classes:

- Preview (eye icon): `flex items-center justify-center gap-1 px-3
  py-1.5 bg-[#C8A24A] text-white rounded-full text-xs font-medium
  hover:bg-[#B8923A] transition-colors shadow-sm flex-1`
- Select (arrow icon): `flex items-center justify-center gap-1 px-3
  py-1.5 bg-white border border-gray-200 text-gray-900 rounded-full
  text-xs font-medium hover:bg-gray-100 transition-colors shadow-sm
  flex-1`

Both fully pill-shaped (`rounded-full`), not `rounded-lg` as ours
currently has.
