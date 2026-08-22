"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface OpeningSequenceProps {
  videoSrc: string;
  posterSrc: string;
  quote: string;
  quoteFontFamily: string;
  accentColor: string;
  skipLabel: string;
  onComplete: () => void;
}

// Plays the envelope-opening video once, fading in the reference markup's
// italic overlay quote roughly a third of the way through (matched off the
// captured DOM: the quote sits at top:68%, already at full opacity by the
// time the video settles). A guest who doesn't want to wait can tap through
// -- the source design has no such affordance, but a real invitation should
// never trap a visitor behind an unskippable video.
export function OpeningSequence({
  videoSrc,
  posterSrc,
  quote,
  quoteFontFamily,
  accentColor,
  skipLabel,
  onComplete,
}: OpeningSequenceProps) {
  const [quoteVisible, setQuoteVisible] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center bottom" }}
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          if (!quoteVisible && video.duration && video.currentTime / video.duration > 0.35) {
            setQuoteVisible(true);
          }
        }}
        onEnded={onComplete}
      />

      <div
        className="pointer-events-none absolute z-20 flex flex-col items-center text-center"
        style={{ top: "68%", left: "50%", transform: "translateX(-50%)", width: 280 }}
      >
        <motion.p
          className="italic leading-relaxed opacity-90"
          style={{ fontSize: 13, fontFamily: quoteFontFamily, color: accentColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: quoteVisible ? 0.9 : 0 }}
          transition={{ duration: 0.9 }}
        >
          {quote}
        </motion.p>
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="absolute inset-x-0 bottom-6 mx-auto w-max text-[11px] tracking-[0.3em] text-white/70 uppercase underline underline-offset-4 transition-colors hover:text-white"
      >
        {skipLabel}
      </button>
    </div>
  );
}
