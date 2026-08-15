"use client";

import { useState } from "react";
import Image from "next/image";
import { canUseNextImage, cn, isVideoSource } from "@/lib/utils";

const FADE_DURATION_MS = 500;

// The guest's very first view of the invitation: a closed "envelope" over a
// blurred, darkened version of the template photo, with the couple's names
// in a circular badge and an OPEN affordance — tapping it fades the cover
// away to reveal the already-mounted hero underneath (a crossfade, not a
// content swap), matching numinds.me's entry animation. "OPEN" stays literal
// English regardless of invitation language, mirroring the reference site's
// own choice (its "Preview Mode"/"PREVIEW" watermark do the same).
//
// The fade-out and unmount are driven by plain CSS + a local setTimeout
// (not framer-motion's AnimatePresence exit) — the parent used to gate
// unmounting this component behind an exit-animation completion callback,
// which left it stuck on screen forever under React 19 + Turbopack, where
// that callback doesn't reliably fire. Tapping OPEN also has to call
// onOpen() synchronously, before any transition/timeout, so it still runs
// inside the original click gesture — that's what lets the browser's
// autoplay policy allow the background music to actually start.
export function EnvelopeCover({
  firstName,
  secondName,
  namesFont,
  backgroundImageUrl,
  unoptimized,
  onOpen,
  standalone,
}: {
  firstName: string;
  secondName?: string | null;
  namesFont?: string | null;
  backgroundImageUrl?: string | null;
  unoptimized?: boolean;
  onOpen: () => void;
  standalone: boolean;
}) {
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  function handleOpenClick() {
    if (closing) return;
    onOpen();
    setClosing(true);
    window.setTimeout(() => setHidden(true), FADE_DURATION_MS);
  }

  if (hidden) return null;

  return (
    <div
      className={cn(
        // Above the standalone bottom nav's z-[999] and the modal sheet's
        // z-50 — nothing (nav, watermark, modals) should show through the
        // closed envelope, matching the reference's fully opaque cover.
        "z-[1000] flex items-center justify-center overflow-hidden transition-opacity ease-in-out",
        closing ? "pointer-events-none opacity-0" : "opacity-100",
        standalone ? "fixed inset-0" : "absolute inset-0"
      )}
      style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
    >
      {backgroundImageUrl && (
        isVideoSource(backgroundImageUrl) ? (
          <video
            src={backgroundImageUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
          />
        ) : canUseNextImage(backgroundImageUrl) ? (
          <Image
            src={backgroundImageUrl}
            alt=""
            fill
            sizes="480px"
            unoptimized={unoptimized}
            className="scale-110 object-cover blur-md"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backgroundImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
          />
        )
      )}
      <div className="absolute inset-0 bg-black/45" />

      <button
        type="button"
        onClick={handleOpenClick}
        aria-label="OPEN"
        className="relative flex size-40 flex-col items-center justify-center gap-0.5 rounded-full border border-white/25 bg-white/10 text-center shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition-transform active:scale-95"
      >
        <span className={cn("text-base leading-snug text-white", namesFont || "font-cinzel")}>{firstName}</span>
        {secondName && (
          <>
            <span className={cn("text-base leading-snug text-white/80", namesFont || "font-cinzel")}>&amp;</span>
            <span className={cn("text-base leading-snug text-white", namesFont || "font-cinzel")}>{secondName}</span>
          </>
        )}
        <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/70">Open</span>
      </button>
    </div>
  );
}
