# Sacred Ivory Heritage — invitation template clone

Standalone review build. **Not wired into the platform's real Template/
InvitationCanvas system** — see [preview page](../../../app/preview-sacred-ivory/page.tsx)
for a live render at `/preview-sacred-ivory`.

## Source material

- Two videos supplied from the reference site: an envelope-opening intro
  clip and a looping ambient background clip, plus the ambient clip's
  poster frame (a mandap/temple archway photo). Copied into
  `public/invitation-templates/sacred-ivory-heritage/`.
- A DOM dump of the reference invitation card (couple names, tagline,
  date range, CSS custom properties for the burgundy/cream/gold palette).
- Four floral-paper texture screenshots and an envelope-with-wax-seal
  screenshot were also shared as mood-board references, but no local
  file existed for them — they weren't used in this build. If they're
  meant to be additional color-theme variants of this same template
  (rather than just style references), share the actual image files and
  they can be added as a `paperVariant` option.

## What this is

Two phases, swapped by local component state (`phase`, no `AnimatePresence`
— see note below):

1. **Opening** (`sections/OpeningSequence.tsx`) — the intro video plays
   once, fading in an italic quote near the bottom third (matched off the
   reference markup's `top: 68%` positioning). Includes a skip button the
   reference design didn't have — a real invitation shouldn't trap a guest
   behind an unskippable video.
2. **Revealed** (`sections/InvitationCard.tsx`) — the ambient video loops
   behind a staggered reveal of: groom name, "&", bride name, tagline,
   a divider, and the uppercase date range. Falls back to the static
   poster image if no `backgroundVideoSrc` is given.

## Props

Everything visible is a prop — see `sacred-ivory-heritage.types.ts`.
Nothing is hardcoded: names, dates, tagline, quote, video/image sources,
and the full color/font palette (`theme` prop, deep-merged over
`sacred-ivory-heritage.theme.ts`'s defaults) can all be overridden per
couple. Set `skipOpening` or omit `openingVideoSrc` to land directly on
the revealed card (e.g. for a couple who didn't upload an opening video).

## Why no `AnimatePresence`

An earlier version used `AnimatePresence mode="wait"` with an `exit`
animation on `OpeningSequence` to crossfade into `InvitationCard`. While
debugging what looked like a stuck transition, live testing showed the
underlying logic was actually correct the whole time — the "stuck" state
was an artifact of the test harness's tool round-trip latency letting the
5-second video play to completion before the check ran, not a real bug.
It was simplified anyway to a plain conditional (the card still fades in
via its own `initial`/`animate`, just no fade-out of the video) since it's
one fewer moving part with identical visual result — not a bug fix, a
simplification.

## Fonts

Cinzel, Cinzel Decorative, Dancing Script, and Playfair Display are
loaded via `next/font/google` in `sacred-ivory-heritage.fonts.ts`,
scoped to this component only (CSS variables prefixed `--sih-`, distinct
from the app's own `--font-*` set in the root layout) — importing this
component doesn't affect font loading anywhere else on the site.

## Folding into the real platform (not done yet)

If this gets approved as a real selectable template, the natural home is
the existing `Template` entity + `InvitationCanvas.tsx` mechanism
(`--tpl-*` CSS custom properties, `resolveCanvasTheme()`) rather than
this standalone tree. The opening-video concept is new to that system —
today `Envelope`/`EnvelopesController` only support a static photo +
CSS-driven open animation, no video upload/storage/playback — so wiring
this in for real means deciding whether to add a video upload path
(new R2 folder, size caps, `Template.OpeningVideoUrl` field) or keep the
opening sequence CSS/JS-only.
