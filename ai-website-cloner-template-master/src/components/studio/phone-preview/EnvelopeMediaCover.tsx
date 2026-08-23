"use client";

import { useEffect, useRef, useState } from "react";
import { cn, isVideoSource } from "@/lib/utils";
import { STANDALONE_FULLSCREEN_CLASS } from "./standaloneCoverPosition";

const FADE_DURATION_MS = 500;
// Safety net for a tap whose play() call resolves (so the earlier catch
// never fires) but then stalls mid-buffer on a bad connection and never
// reaches "ended" -- without this a guest in that exact spot is stuck
// forever with no tap target left (the OPEN button already unmounted).
// Comfortably longer than every opening clip actually in use today, so it
// never cuts a normal playthrough short.
const STUCK_VIDEO_FALLBACK_MS = 8000;

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
  firstName,
  secondName,
  initialsXPercent,
  initialsYPercent,
}: {
  mediaSrc: string;
  namesFont?: string | null;
  language: "ar" | "en";
  onOpen: () => void;
  standalone: boolean;
  // See Template.EnvelopeInitialsXPercent/YPercent -- when both are set, a
  // frosted patch bearing the couple's real initials is drawn on top of the
  // media at that position, for a video/photo whose seal area is blank (or
  // has placeholder letters this patch is meant to cover) rather than one
  // baked with a specific couple's names. Either missing renders no patch.
  firstName?: string | null;
  secondName?: string | null;
  initialsXPercent?: number | null;
  initialsYPercent?: number | null;
}) {
  const mediaIsVideo = isVideoSource(mediaSrc);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);
  const initials = [firstName?.[0], secondName?.[0]].filter(Boolean).join(" & ");
  const showInitialsPatch = Boolean(initials) && initialsXPercent != null && initialsYPercent != null;

  // Same fix AmbientVideoBackground already needed for the same reason:
  // React commits `muted`/`autoPlay` as DOM properties, not HTML attributes,
  // which can leave a browser evaluating this video's autoplay eligibility
  // before the property has actually landed -- silently leaving it paused
  // forever with no error, no matter how the JSX attributes are written.
  // Setting `.muted` and calling `.play()` imperatively here, after mount,
  // sidesteps that timing gap. onPlay (below) re-pauses it the instant real
  // playback starts, so this never does more than paint one still frame.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mediaIsVideo) return;
    video.muted = true;
    video.play().catch(() => {});
    // mediaSrc is effectively static for a given cover instance -- omitting
    // mediaIsVideo (derived from it) from the deps avoids an ESLint nag for
    // a value that never independently changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaSrc]);

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
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.currentTime = 0;
    }
    // A slow connection can leave the video without enough buffered data to
    // play yet -- rejecting the play() promise. Without this fallback the
    // tap button is already gone (started=true) but nothing ever advances,
    // stranding the guest on a frozen frame with no way back in. Revealing
    // the invitation underneath is the same outcome a finished video ends
    // in anyway, so it's a safe default rather than a real fallback path.
    video?.play().catch(() => handleFinish());
    // Covers the other failure shape: play() itself resolves (playback
    // genuinely starts) but then stalls on bad data mid-clip and never
    // fires "ended" -- the catch above never runs for that case. This
    // timer guarantees the guest reaches the invitation either way.
    // handleFinish() is idempotent (guarded by `closing`), so it's harmless
    // if the video already finished normally before this fires.
    window.setTimeout(handleFinish, STUCK_VIDEO_FALLBACK_MS);
  }

  if (hidden) return null;

  return (
    <div
      className={cn(
        // A `<video>` with no `poster` renders fully transparent until its
        // first frame decodes -- on a slow connection that gap is long
        // enough for AmbientVideoBackground (playing underneath, autoplay
        // muted so browsers fetch it eagerly) to show through where this
        // cover should be solid. Filling it with the template's own page
        // background (the same color the canvas already uses everywhere
        // else, set as --tpl-page-bg-solid higher up the tree) keeps the
        // cover opaque without an off-brand black flash -- a plain gray
        // fallback covers the rare case this renders somewhere that
        // variable isn't defined.
        "z-[1000] overflow-hidden transition-opacity ease-in-out",
        closing ? "pointer-events-none opacity-0" : "opacity-100",
        standalone ? STANDALONE_FULLSCREEN_CLASS : "absolute inset-0"
      )}
      style={{
        transitionDuration: `${FADE_DURATION_MS}ms`,
        backgroundColor: "var(--tpl-page-bg-solid, #1a1a1a)",
      }}
    >
      {mediaIsVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={mediaSrc}
          playsInline
          preload="auto"
          // muted+autoPlay isn't there to actually play the closed-envelope
          // state -- it's the one reliable way to get this video's first
          // frame to paint at all. `preload="auto"` is only ever a hint;
          // on a real device (cellular, Low Power Mode) a browser can
          // ignore it and never fetch a byte until something forces
          // playback, leaving the cover permanently blank. Muted autoplay
          // is exempt from that everywhere, so it kicks the fetch off for
          // real -- onPlay immediately re-pauses it (before handleTap has
          // run) so the guest only ever sees a still first frame, not
          // silent playback. handleTap unmutes and restarts it for the
          // real, audible playthrough.
          muted
          autoPlay
          onPlay={(event) => {
            if (!started) event.currentTarget.pause();
          }}
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

      {showInitialsPatch && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-20 flex items-center justify-center rounded-full bg-[#f9f1e2]/75 shadow-[0_2px_10px_rgba(0,0,0,0.15)] backdrop-blur-md"
          style={{
            top: `${initialsYPercent}%`,
            left: `${initialsXPercent}%`,
            width: "34%",
            aspectRatio: "1 / 1",
            transform: "translate(-50%, -50%)",
          }}
        >
          <span
            className={cn("text-[#8a6a2f]", namesFont || "font-cinzel")}
            style={{ fontSize: "clamp(16px, 6vw, 26px)" }}
          >
            {initials}
          </span>
        </div>
      )}

      {!started && (
        <button
          type="button"
          onClick={handleTap}
          aria-label={language === "ar" ? "فتح" : "Open"}
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-3",
            !mediaIsVideo && "bg-black/10 transition-colors active:bg-black/20"
          )}
        >
          {mediaIsVideo ? null : (
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
