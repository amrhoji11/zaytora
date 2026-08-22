"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { STANDALONE_FULLSCREEN_CLASS } from "./standaloneCoverPosition";

// A looping video rendered behind the revealed invitation content (see
// Template.AmbientVideoUrl) — same responsive/positioning convention as
// AmbientParticles.tsx (fixed to the viewport in standalone mode, absolute
// within the scrollable container in embedded/studio mode), but at a lower
// z-index so it sits *behind* the particle layer and the page-bg color
// rather than on top of them. Independent of AmbientEffect: a template can
// set both (video behind, particles drifting in front).
//
// React sets `muted` as a DOM property during commit rather than as an HTML
// attribute (a deliberate, long-standing React choice -- see
// facebook/react#6045), which can leave the browser evaluating this video's
// autoplay eligibility before the property has actually landed, silently
// leaving it paused with no error. Setting `.muted` imperatively via a ref
// before calling play() sidesteps the timing gap entirely.
export function AmbientVideoBackground({
  videoSrc,
  standalone,
  textIsLight,
}: {
  videoSrc: string;
  standalone: boolean;
  // Whether the template's own text is light-on-dark or dark-on-light (see
  // InvitationCanvas's `theme.isDark`) -- a raw video's brightness swings
  // frame to frame far more than a photo or flat color ever did, so text
  // legibility now leans partly on a scrim tuned to *darken* the video for
  // light text or *wash it toward white* for dark text, on top of (not
  // instead of) resolveCanvasTheme's own textShadow work. Keeps the
  // "text directly over video, no card" look intact -- this evens out the
  // video's own contrast rather than boxing the text.
  textIsLight: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // Autoplay can still be legitimately refused -- e.g. Chrome pauses
      // audio-less "video-only background media" outright on a backgrounded
      // tab to save power. The video just stays on its poster/first frame,
      // no worse than AmbientParticles rendering nothing for variant="none".
    });
  }, [videoSrc]);

  return (
    <>
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={cn("pointer-events-none z-0 h-full w-full object-cover", standalone ? STANDALONE_FULLSCREEN_CLASS : "absolute inset-0")}
        aria-hidden
      />
      <div
        className={cn("pointer-events-none z-[1]", standalone ? STANDALONE_FULLSCREEN_CLASS : "absolute inset-0")}
        style={{ background: textIsLight ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.18)" }}
        aria-hidden
      />
    </>
  );
}
