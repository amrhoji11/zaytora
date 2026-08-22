"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const FADE_DURATION_MS = 500;

const QUOTE_BY_LANGUAGE: Record<"ar" | "en", string> = {
  ar: "أنتم مدعوون لحضور يومنا المميز",
  en: "You are invited for our special day",
};

// A cinematic alternative to the other envelope covers (see
// Template.EnvelopeStyle === "video"): closed state looks like every other
// cover (blurred poster + names badge + OPEN), but tapping plays
// videoSrc full-bleed once instead of a hand-drawn open animation, with a
// quote fading in partway through. Same two rules every cover in this folder
// follows (see EnvelopeCover.tsx's comment): onOpen() fires synchronously
// inside the tap handler (required for the browser's autoplay-audio policy
// -- also what lets the video itself play unmuted, since a real user
// gesture triggered it), and the fade-out/unmount is plain CSS + setTimeout,
// not framer-motion's AnimatePresence (unreliable under this app's React 19
// + Turbopack setup).
export function VideoOpeningCover({
  videoSrc,
  posterSrc,
  firstName,
  secondName,
  namesFont,
  language,
  onOpen,
  standalone,
}: {
  videoSrc: string;
  posterSrc?: string | null;
  firstName: string;
  secondName?: string | null;
  namesFont?: string | null;
  language: "ar" | "en";
  onOpen: () => void;
  standalone: boolean;
}) {
  const [phase, setPhase] = useState<"closed" | "playing">("closed");
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  function handleOpenClick() {
    if (phase !== "closed") return;
    onOpen();
    setPhase("playing");
  }

  function handleFinish() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => setHidden(true), FADE_DURATION_MS);
  }

  if (hidden) return null;

  return (
    <div
      className={cn(
        "z-[1000] overflow-hidden transition-opacity ease-in-out",
        closing ? "pointer-events-none opacity-0" : "opacity-100",
        standalone ? "fixed inset-0" : "absolute inset-0"
      )}
      style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
    >
      {phase === "closed" ? (
        <div className="flex h-full w-full items-center justify-center">
          {posterSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={posterSrc}
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
            />
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
      ) : (
        <>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            poster={posterSrc ?? undefined}
            autoPlay
            playsInline
            preload="auto"
            onTimeUpdate={(event) => {
              const video = event.currentTarget;
              if (!quoteVisible && video.duration && video.currentTime / video.duration > 0.35) {
                setQuoteVisible(true);
              }
            }}
            onEnded={handleFinish}
          />
          <div
            className="pointer-events-none absolute z-10 flex flex-col items-center text-center transition-opacity duration-700"
            style={{ top: "68%", left: "50%", transform: "translateX(-50%)", width: 280, opacity: quoteVisible ? 0.9 : 0 }}
          >
            <p className={cn("italic leading-relaxed text-white", namesFont || "font-cinzel")} style={{ fontSize: 13 }}>
              {QUOTE_BY_LANGUAGE[language]}
            </p>
          </div>
          <button
            type="button"
            onClick={handleFinish}
            className="absolute inset-x-0 bottom-6 mx-auto w-max text-[11px] tracking-[0.3em] text-white/70 uppercase underline underline-offset-4 transition-colors hover:text-white"
          >
            {language === "ar" ? "تخطي" : "Skip"}
          </button>
        </>
      )}
    </div>
  );
}
