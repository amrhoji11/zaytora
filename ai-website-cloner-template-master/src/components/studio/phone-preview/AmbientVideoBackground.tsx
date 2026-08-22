"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

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
}: {
  videoSrc: string;
  standalone: boolean;
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
    <video
      ref={videoRef}
      src={videoSrc}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={cn("pointer-events-none z-0 h-full w-full object-cover", standalone ? "fixed inset-0" : "absolute inset-0")}
      aria-hidden
    />
  );
}
