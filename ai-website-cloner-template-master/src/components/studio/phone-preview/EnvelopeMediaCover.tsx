"use client";

import { useRef, useState } from "react";
import { PlayIcon } from "@/components/icons";
import { cn, isVideoSource } from "@/lib/utils";
import { STANDALONE_FULLSCREEN_CLASS } from "./standaloneCoverPosition";

const FADE_DURATION_MS = 500;

const QUOTE_BY_LANGUAGE: Record<"ar" | "en", string> = {
  ar: "أنتم مدعوون لحضور يومنا المميز",
  en: "You are invited for our special day",
};

const OPEN_HINT_BY_LANGUAGE: Record<"ar" | "en", string> = {
  ar: "اضغط لفتح الدعوة",
  en: "Tap to open",
};

// The envelope's opening media (see Template.OpeningVideoUrl -- despite the
// field's name, an admin can upload either a video or a plain image there
// now, one single "envelope" slot instead of separate video/library-photo
// paths). Closed state is that media's own first frame/photo, full-bleed,
// no separate blurred-badge screen on top of it. Tapping anywhere opens it:
// a video plays through once with a quote fading in partway (see
// mediaIsVideo branch below); an image just fades away immediately,
// exposing the content underneath, same instant reveal every photo-based
// cover in this folder does. Same two rules every cover here follows (see
// EnvelopeCover.tsx's comment): onOpen() fires synchronously inside the tap
// handler (browser autoplay-audio policy), and the fade-out/unmount on
// finish is plain CSS + setTimeout, not framer-motion's AnimatePresence
// (unreliable under this app's React 19 + Turbopack setup).
export function EnvelopeMediaCover({
  mediaSrc,
  namesFont,
  language,
  onOpen,
  standalone,
}: {
  mediaSrc: string;
  namesFont?: string | null;
  language: "ar" | "en";
  onOpen: () => void;
  standalone: boolean;
}) {
  const mediaIsVideo = isVideoSource(mediaSrc);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  function handleFinish() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => setHidden(true), FADE_DURATION_MS);
  }

  function handleTap() {
    if (started) return;
    onOpen();
    if (!mediaIsVideo) {
      handleFinish();
      return;
    }
    setStarted(true);
    videoRef.current?.play().catch(() => {});
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
      {mediaIsVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={mediaSrc}
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
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mediaSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}

      {!started && (
        <button
          type="button"
          onClick={handleTap}
          aria-label={language === "ar" ? "فتح" : "Open"}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/10 transition-colors active:bg-black/20"
        >
          {mediaIsVideo ? (
            <span className="flex size-16 items-center justify-center rounded-full border border-white/40 bg-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-transform active:scale-95">
              <PlayIcon className="size-6 fill-current text-white ms-0.5" />
            </span>
          ) : (
            <span
              className={cn(
                "rounded-full border border-white/40 bg-black/25 px-4 py-1.5 text-[11px] font-medium tracking-[0.2em] text-white uppercase backdrop-blur-sm",
                namesFont || "font-cinzel"
              )}
            >
              {OPEN_HINT_BY_LANGUAGE[language]}
            </span>
          )}
        </button>
      )}

      {mediaIsVideo && started && (
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
