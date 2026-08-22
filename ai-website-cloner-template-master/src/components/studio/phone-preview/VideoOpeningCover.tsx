"use client";

import { useRef, useState } from "react";
import { PlayIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { STANDALONE_FULLSCREEN_CLASS } from "./standaloneCoverPosition";

const FADE_DURATION_MS = 500;

const QUOTE_BY_LANGUAGE: Record<"ar" | "en", string> = {
  ar: "أنتم مدعوون لحضور يومنا المميز",
  en: "You are invited for our special day",
};

// A cinematic alternative to the other envelope covers (see
// Template.EnvelopeStyle === "video"): the video's own poster frame IS the
// closed state -- no separate blurred-badge screen on top of it, tapping
// anywhere on it plays videoSrc full-bleed once, with a quote fading in
// partway through. Same two rules every cover in this folder follows (see
// EnvelopeCover.tsx's comment): onOpen() fires synchronously inside the tap
// handler (required for the browser's autoplay-audio policy -- also what
// lets the video itself play unmuted, since a real user gesture triggered
// it), and the fade-out/unmount on finish is plain CSS + setTimeout, not
// framer-motion's AnimatePresence (unreliable under this app's React 19 +
// Turbopack setup).
export function VideoOpeningCover({
  videoSrc,
  posterSrc,
  namesFont,
  language,
  onOpen,
  standalone,
}: {
  videoSrc: string;
  posterSrc?: string | null;
  namesFont?: string | null;
  language: "ar" | "en";
  onOpen: () => void;
  standalone: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  function handleTap() {
    if (started) return;
    onOpen();
    setStarted(true);
    videoRef.current?.play().catch(() => {});
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
        standalone ? STANDALONE_FULLSCREEN_CLASS : "absolute inset-0"
      )}
      style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={videoSrc}
        poster={posterSrc ?? undefined}
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

      {!started && (
        <button
          type="button"
          onClick={handleTap}
          aria-label={language === "ar" ? "تشغيل" : "Play"}
          className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors active:bg-black/20"
        >
          <span className="flex size-16 items-center justify-center rounded-full border border-white/40 bg-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-transform active:scale-95">
            <PlayIcon className="size-6 fill-current text-white ms-0.5" />
          </span>
        </button>
      )}

      {started && (
        <>
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
